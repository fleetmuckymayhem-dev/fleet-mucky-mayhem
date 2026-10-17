import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const directory = 'artifacts/parity';
mkdirSync(directory, { recursive: true });
const widths = [390, 768, 1399, 1400, 1440];
const results = [], captures = [];
const astroPort = Number(new URL(process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/').port);
const baselinePort = Number(new URL(process.env.BASELINE_QA_URL || 'http://127.0.0.1:4322/').port);
const sections = ['home', 'about-us', 'what-we-do', 'where-to-next', 'sponsors', 'ride-diary', 'photos', 'faq', 'contact-us', 'group-ride-disclaimer'];
async function waitCollapse(page, selector, open) {
  await page.waitForFunction(({ selector, open }) => {
    const el = document.querySelector(selector);
    return el.classList.contains('show') === open && !el.classList.contains('collapsing');
  }, { selector, open });
}
async function capture(page, name, width, state, selector) {
  await page.mouse.move(0, 0);
  const path = `${directory}/${name}-${width}-${state}.png`;
  if (selector) await page.locator(selector).screenshot({ path });
  else await page.screenshot({ path, fullPage: state === 'full-page' });
  if (name === 'baseline') captures.push(`${width}-${state}`);
}
async function settleImages(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
  });
}
try {
  for (const width of widths) {
    const pair = [];
    for (const [name, port] of [['baseline', baselinePort], ['astro', astroPort]]) {
      // UK reference view: foreign-zone countdown differences are intentional fixes.
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', timezoneId: 'Europe/London' });
      const errors = [], failures = [], consoleErrors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !message.text().includes('net::ERR_FAILED')) consoleErrors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(`http://127.0.0.1:${port}`)) failures.push(`${response.status()} ${response.url()}`); });
      await page.route('**/*googletagmanager.com/**', route => route.abort());
      // Stabilize autoplay for screenshot runs only; test real autoplay separately.
      await page.route(`http://127.0.0.1:${port}/`, async route => {
        const response = await route.fetch();
        await route.fulfill({ response, body: (await response.text()).replace('data-bs-interval="3000"', 'data-bs-interval="3600000"') });
      });
      await page.clock.setFixedTime(new Date('2026-02-01T12:00:00Z'));
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('#accordion2026 .accordion-item') && !document.querySelector('#next-title').textContent.includes('Loading'));
      await settleImages(page);
      await page.addStyleTag({ content: '*,*::before,*::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
      const inventory = await page.evaluate(() => {
        const tidy = text => text.replace(/\s+/g, ' ').trim();
        return [...document.querySelectorAll('section, footer')].map(section => ({
          id: section.id || 'footer', height: section.getBoundingClientRect().height,
          width: section.getBoundingClientRect().width, text: tidy(section.textContent),
          structure: [...section.querySelectorAll('*')].map(el => ({ tag: el.tagName, id: el.id, class: el.className })),
          links: [...section.querySelectorAll('a')].map(el => ({ href: el.getAttribute('href'), text: tidy(el.textContent), target: el.target })),
          images: [...section.querySelectorAll('img')].map(el => ({ alt: el.alt, loaded: el.complete && el.naturalWidth > 0, width: el.width, height: el.height, naturalWidth: el.naturalWidth })),
        }));
      });
      assert.deepEqual(inventory.map(item => item.id), [...sections, 'footer']);
      assert(inventory.every(item => item.images.every(image => image.loaded)), `${name}: missing images`);
      await capture(page, name, width, 'hero');
      await capture(page, name, width, 'full-page');
      for (const id of sections.slice(1)) await capture(page, name, width, id, `#${id}`);
      await capture(page, name, width, 'footer', 'footer');
      for (const id of sections) {
        if (width < 1400) {
          await page.getByRole('button', { name: 'Toggle navigation' }).click();
          await waitCollapse(page, '#navbarNav', true);
          if (id === 'home') await capture(page, name, width, 'menu');
        }
        await page.locator(`.navbar-nav a[href="#${id}"]`).click();
        if (width < 1400) await waitCollapse(page, '#navbarNav', false);
        assert.equal(new URL(page.url()).hash, `#${id}`);
      }
      const waitSlide = index => page.waitForFunction(index => {
        const slides = [...document.querySelectorAll('#aboutUsCarousel .carousel-item')];
        return slides.findIndex(el => el.classList.contains('active')) === index && !document.querySelector('.carousel-item-next,.carousel-item-prev');
      }, index);
      for (let index = 1; index <= 6; index++) {
        await page.locator('#aboutUsCarousel .carousel-control-next').click();
        await waitSlide(index % 6);
        assert.equal(await page.locator('.carousel-indicators-container .indicator').evaluateAll(els => els.findIndex(el => el.classList.contains('active'))), index % 6);
      }
      await page.locator('#aboutUsCarousel .carousel-control-prev').click();
      await waitSlide(5);
      await capture(page, name, width, 'carousel-last', '#about-us');
      await page.locator('.carousel-indicators-container .indicator').nth(2).click();
      await waitSlide(2);
      await capture(page, name, width, 'carousel-third', '#about-us');
      for (const section of ['what-we-do', 'faq']) {
        const buttons = page.locator(`#${section} .accordion-button`);
        for (let index = 0; index < await buttons.count(); index++) {
          const button = buttons.nth(index);
          const target = await button.getAttribute('data-bs-target');
          await button.focus();
          await page.keyboard.press('Space');
          await waitCollapse(page, target, true);
          assert.equal(await button.getAttribute('aria-expanded'), 'true');
          assert.equal(await page.locator(`#${section} .accordion-collapse.show`).count(), 1);
          await capture(page, name, width, `${section}-answer-${index + 1}`, `#${section}`);
          await button.click();
          await waitCollapse(page, target, false);
        }
      }
      for (const [buttonId, accordionId] of [['showRegular', 'accordionRegular'], ['showLonger', 'accordion2026'], ['showArchived2025', 'accordion2025'], ['showArchived2024', 'accordion2024']]) {
        if (buttonId.startsWith('showArchived')) {
          await page.locator('#archivedDropdownBtn').click();
          assert.equal(await page.locator('#archivedDropdownBtn').getAttribute('aria-expanded'), 'true');
        }
        await page.locator(`#${buttonId}`).click();
        assert.equal(await page.locator(`#${accordionId}`).isVisible(), true);
        assert.equal(await page.locator('#ride-diary .accordion:not(.d-none)').count(), 1);
        await capture(page, name, width, `rides-${accordionId}`, '#ride-diary');
        const buttons = page.locator(`#${accordionId} .accordion-button`);
        assert(await buttons.count() > 0);
        const target = await buttons.first().getAttribute('data-bs-target');
        await buttons.first().click();
        await waitCollapse(page, target, true);
        await settleImages(page);
        await capture(page, name, width, `rides-${accordionId}-expanded`, '#ride-diary');
        if (await buttons.count() > 1) {
          const nextTarget = await buttons.nth(1).getAttribute('data-bs-target');
          await buttons.nth(1).click();
          await waitCollapse(page, nextTarget, true);
          await waitCollapse(page, target, false);
        }
      }
      for (let index = 0; index < await page.locator('#photos .dropdown-toggle').count(); index++) {
        const button = page.locator('#photos .dropdown-toggle').nth(index);
        await button.click();
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        const menu = page.locator('#photos .dropdown-menu').nth(index);
        assert.equal(await menu.isVisible(), true);
        assert(await menu.locator('a[href^="https://app.box.com/"]').count() > 0);
        await capture(page, name, width, `photos-menu-${index + 1}`, '#photos');
        await page.keyboard.press('Escape');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
      }
      await page.locator('footer a[href="#home"]').click();
      assert.equal(new URL(page.url()).hash, '#home');
      assert.deepEqual(failures, [], `${name}: failed local resources`);
      assert.deepEqual(errors, [], `${name}: JavaScript exceptions`);
      assert.deepEqual(consoleErrors, [], `${name}: console errors`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      pair.push({ name, width, inventory, errors, failures, overflow });
      await page.close();
    }
    writeFileSync(`${directory}/latest-pair.json`, JSON.stringify(pair, null, 2));
    assert.deepEqual(pair[1].inventory, pair[0].inventory, `Section DOM/content/geometry mismatch at ${width}px`);
    assert.equal(pair[1].overflow, pair[0].overflow, 'New horizontal overflow');
    results.push(...pair);
    console.log(`PASS ${width}px: every section, navigation, carousel, accordions, ride groups, photo dropdowns.`);
  }
  for (const port of [baselinePort, astroPort]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.route('**/*googletagmanager.com/**', route => route.abort());
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.waitForFunction(() => document.querySelectorAll('#aboutUsCarousel .carousel-item')[1].classList.contains('active'), null, { timeout: 10000 });
    await page.close();
  }
  writeFileSync(`${directory}/browser-results.json`, JSON.stringify(results, null, 2));
  writeFileSync(`${directory}/captures.json`, JSON.stringify(captures, null, 2));
  console.log(`PASS: ${captures.length} paired captures; autoplay passed for both builds.`);
} finally { await browser.close(); }
