import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
// Use a separately supplied Playwright installation, or a local one.
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
mkdirSync('artifacts', { recursive: true });
const results = [];
try {
  for (const width of [390, 768, 1440]) {
    const pair = [];
    for (const [name, port] of [['baseline', 4322], ['astro', 4321]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const errors = [];
      const failures = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(`http://127.0.0.1:${port}`)) failures.push(`${response.status()} ${response.url()}`); });
      await page.route('**/*googletagmanager.com/**', route => route.abort());
      await page.clock.install({ time: new Date('2026-02-01T12:00:00Z') });
      await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: '*,*::before,*::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
      await page.screenshot({ path: `artifacts/${name}-${width}-hero.png` });
      const hero = await page.locator('#home').evaluate(el => ({ html: el.innerHTML.replace(/\s+/g, ' ').trim(), height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width, font: getComputedStyle(el.querySelector('h2')).fontFamily }));
      const links = await page.locator('.navbar-nav .nav-link').evaluateAll(els => els.map(el => ({ text: el.textContent.trim(), targetExists: !!document.querySelector(el.getAttribute('href')) })));
      assert(links.every(link => link.targetExists), `${name}: missing navigation target`);
      // The site has ten visible sections.
      assert.equal(await page.locator('section').count(), 10);
      assert.deepEqual(failures, [], `${name}: local resource failures`);
      if (width < 1400) {
        await page.getByRole('button', { name: 'Toggle navigation' }).click();
        await page.waitForFunction(() => document.querySelector('#navbarNav').classList.contains('show'));
        await page.screenshot({ path: `artifacts/${name}-${width}-menu.png` });
        await page.locator('.navbar-nav a[href="#faq"]').click();
        await page.waitForFunction(() => !document.querySelector('#navbarNav').classList.contains('show'));
        assert.equal(new URL(page.url()).hash, '#faq');
      }
      await page.locator('#faq').scrollIntoViewIfNeeded();
      await page.locator('#faq').screenshot({ path: `artifacts/${name}-${width}-faq.png` });
      const question = page.locator('#faq .accordion-button').first();
      await question.click();
      await page.waitForFunction(() => document.querySelector('#question-one').classList.contains('show'));
      assert.equal(await question.getAttribute('aria-expanded'), 'true');
      await page.locator('#faq').screenshot({ path: `artifacts/${name}-${width}-faq-open.png` });
      await question.click();
      await page.waitForFunction(() => !document.querySelector('#question-one').classList.contains('show'));
      assert.equal(await question.getAttribute('aria-expanded'), 'false');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      pair.push({ name, width, hero, links, errors, overflow });
      await page.close();
    }
    assert.deepEqual(pair[1].hero, pair[0].hero, `Hero markup/geometry differs at ${width}px`);
    assert.deepEqual(pair[1].links, pair[0].links);
    assert.deepEqual(pair[1].errors, pair[0].errors, 'New browser errors');
    assert.equal(pair[1].overflow, pair[0].overflow, 'New horizontal overflow');
    results.push(...pair);
  }
  writeFileSync('artifacts/browser-results.json', JSON.stringify(results, null, 2));
  console.log('PASS: baseline and Astro hero geometry, navigation, FAQ toggles, resource responses, and runtime error parity at 390, 768, and 1440px.');
} finally { await browser.close(); }
