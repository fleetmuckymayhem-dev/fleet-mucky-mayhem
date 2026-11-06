import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? process.env.QA_PACKAGE_ROOT + '/package.json' : import.meta.url);
const { chromium } = require('playwright');
const evidence = resolve(process.env.QA_ARTIFACT_DIR || 'artifacts/code-review-2026-11-05');
mkdirSync(evidence, { recursive: true });
const data = JSON.parse(readFileSync('public/data/longer-rides.json', 'utf8'));
const records = [];
async function serve(directory, base = '/') {
  const root = resolve(directory);
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
      let file = resolve(root, '.' + '/' + pathname.slice(base.length));
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      res.setHeader('Content-Type', ({ '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.woff':'font/woff', '.woff2':'font/woff2' })[extname(file)] || 'application/octet-stream');
      res.end(await readFile(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return { server, url: 'http://127.0.0.1:' + server.address().port + base };
}
const production = await serve('dist');
const staging = await serve('artifacts/staging-site', '/staging-fleet-mucky-mayhem/');
const browser = await chromium.launch({ channel: process.env.QA_BROWSER_CHANNEL || 'msedge', headless: true });
console.log('Browser:', browser.version());
async function ready(page, url, payload) {
  const errors = [], failures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', req => failures.push(req.url() + ' ' + req.failure()?.errorText));
  page.on('response', res => { if (res.status() >= 400) failures.push(res.status() + ' ' + res.url()); });
  if (payload) await page.route('**/data/longer-rides.json', route => route.fulfill({ json: payload }));
  await page.clock.setFixedTime(new Date('2026-11-05T12:00:00Z'));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#photos[data-photos-ready]');
  await page.waitForFunction(() => !document.querySelector('#accordionLonger').textContent.includes('Loading'));
  // Stop autoplay while controls are exercised. User hover normally pauses this carousel.
  await page.locator('#aboutUsCarousel').dispatchEvent('mouseenter');
  return { errors, failures };
}
async function expand(page, button) {
  await button.click();
  const target = await button.getAttribute('data-bs-target');
  await page.waitForFunction(selector => document.querySelector(selector).classList.contains('show') && !document.querySelector(selector).classList.contains('collapsing'), target);
  assert.equal(await button.getAttribute('aria-expanded'), 'true');
}
try {
  for (const [build, target] of [['production', production], ['staging', staging]]) {
    for (const width of [390, 768, 1399, 1400, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const observed = await ready(page, target.url);
      assert.equal(await page.locator('meta[name="robots"]').count(), build === 'staging' ? 1 : 0);
      const duplicateIds = await page.locator('[id]').evaluateAll(elements => elements.map(el => el.id).filter((id, i, ids) => ids.indexOf(id) !== i));
      assert.deepEqual(duplicateIds, []);
      // Exercise every navigation link and mobile collapse without disturbing carousel state.
      for (const link of await page.locator('nav .nav-link').all()) {
        if (width < 1400) {
          await page.locator('.navbar-toggler').click();
          await page.waitForFunction(() => document.querySelector('#navbarNav').classList.contains('show'));
        }
        const hash = await link.getAttribute('href');
        await link.click();
        await page.waitForFunction(hash => location.hash === hash, hash);
        if (width < 1400) {
          await page.waitForFunction(() => !document.querySelector('#navbarNav').classList.contains('show') && !document.querySelector('#navbarNav').classList.contains('collapsing'));
          assert.equal(await page.locator('.navbar-toggler').getAttribute('aria-expanded'), 'false');
        }
        assert.equal(await page.locator('#aboutUsCarousel .carousel-item.active').count(), 1);
        assert.equal(await page.locator('#aboutUsCarousel .indicator.active').count(), 1);
      }
      // Scrolling must highlight actual sections even without a pre-existing active link.
      await page.evaluate(() => {
        document.querySelectorAll('nav .active').forEach(el => el.classList.remove('active'));
        window.scrollTo({ top: document.querySelector('#about-us').offsetTop, behavior: 'instant' });
      });
      await page.waitForFunction(() => document.querySelector('nav a[href="#about-us"]').classList.contains('active'));
      assert.equal(await page.locator('nav [aria-current="location"]').count(), 1);
      await page.locator('.carousel-control-next').click();
      await page.waitForFunction(() => document.querySelectorAll('#aboutUsCarousel .carousel-item.active').length === 1 && !document.querySelector('#aboutUsCarousel .carousel-item-next'));
      const slideIndex = await page.locator('#aboutUsCarousel .carousel-item').evaluateAll(items => items.findIndex(el => el.classList.contains('active')));
      assert.equal(await page.locator('#aboutUsCarousel .indicator.active').getAttribute('data-bs-slide-to'), String(slideIndex));
      // Every What We Do and FAQ accordion must open, with only one answer per group.
      for (const group of ['#ride-types', '#faq']) {
        const buttons = page.locator(group + ' .accordion-button');
        for (const button of await buttons.all()) {
          await expand(page, button);
          assert.equal(await page.locator(group + ' .accordion-collapse.show').count(), 1);
        }
      }
      // All regular and 31 archived rides must be usable.
      for (const year of ['Regular', '2026', '2025', '2024']) {
        if (year === 'Regular') await page.locator('#showRegular').click();
        else {
          await page.locator('#archivedDropdownBtn').click();
          await page.locator('#showArchived' + year).click();
        }
        const group = '#accordion' + year;
        const buttons = page.locator(group + ' .accordion-button');
        for (const button of await buttons.all()) {
          await expand(page, button);
          await page.waitForFunction(selector => !document.querySelector(selector + ' .collapsing'), group);
          assert.equal(await page.locator(group + ' .accordion-collapse.show').count(), 1);
        }
      }
      await page.locator('#showLonger').click();
      assert.match(await page.locator('#accordionLonger').textContent(), /2027 Longer Rides programme/);
      // Rapid clicks previously left two panels open.
      await page.locator('#showRegular').click();
      const regular = page.locator('#accordionRegular .accordion-button');
      await regular.nth(0).click();
      await regular.nth(1).dispatchEvent('click');
      await page.waitForFunction(() => !document.querySelector('#accordionRegular .collapsing'));
      assert.equal(await page.locator('#accordionRegular .accordion-collapse.show').count(), 1);
      await page.locator('#showLonger').click();
      await page.locator('#showRegular').click();
      await page.waitForFunction(() => !document.querySelector('#accordionRegular .collapsing'));
      assert.equal(await page.locator('#accordionRegular .accordion-collapse.show').count(), 0);
      // Repeated group changes while a panel closes must not leave a listener
      // that immediately hides that panel on its next deliberate opening.
      await expand(page, regular.nth(0));
      await page.locator('#showRegular').dispatchEvent('click');
      await page.locator('#showRegular').dispatchEvent('click');
      await page.waitForFunction(() => !document.querySelector('#accordionRegular .collapsing'));
      await expand(page, regular.nth(0));
      await page.waitForFunction(() => !document.querySelector('#accordionRegular .collapsing'));
      assert.equal(await page.locator('#accordionRegular .accordion-collapse.show').count(), 1);
      // Keyboard dropdown controls and return focus.
      await page.locator('#currentPhotosBtn').focus();
      await page.keyboard.press('Space');
      assert.equal(await page.locator('#currentPhotosMenu').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#currentPhotosBtn').evaluate(el => el === document.activeElement), true);
      await page.locator('#archivePhotosBtn').click();
      await page.locator('#archivePhotosMenu summary').first().click();
      assert.equal(await page.locator('#archivePhotosMenu details[open]').count(), 1);
      await page.keyboard.press('Escape');
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await Promise.all([...document.images].map(image => image.complete ? null : new Promise(r => { image.onload = r; image.onerror = r; })));
      });
      assert.deepEqual(await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src)), []);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(observed.errors, []);
      assert.deepEqual(observed.failures, []);
      await page.locator('#contact-us').screenshot({ path: evidence + '/' + build + '-contact-' + width + '.png' });
      records.push({ build, width, status: 'pass', ...observed });
      console.log('PASS', build, width, 'navigation, carousel, all panels, rapid clicks, keyboard, images, overflow and runtime');
      await page.close();
    }
  }
  // Optional fields are genuinely optional, plain text cannot become markup,
  // and author-written notes/guidance retain supported rich content.
  const optional = { programmeYear: 2027, longerRides: [{
    id: 'review-optional', title: 'Angles <test> & "quotes"', date: '2027-01-23', year: 2027,
    meetPoint: { name: 'Wharf <test>', note: 'Use the side entrance' },
    guidance: '<strong>Review guidance</strong>', notes: ['<em>Review note</em>'],
  }], archivedRides: [] };
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }); });
  const observed = await ready(page, production.url, optional);
  await page.locator('#showLonger').click();
  await expand(page, page.locator('#accordionLonger .accordion-button'));
  assert.match(await page.locator('#accordionLonger').textContent(), /Angles <test> & "quotes"/);
  assert.equal(await page.locator('#accordionLonger test').count(), 0);
  assert.doesNotMatch(await page.locator('#accordionLonger').textContent(), /undefined/);
  assert.match(await page.locator('#accordionLonger').textContent(), /09:30 Wharf <test> Use the side entrance/);
  assert.equal(await page.locator('#accordionLonger strong').textContent(), 'Review guidance');
  assert.match(await page.locator('#accordionLonger').textContent(), /Photos will be available/);
  assert.equal(await page.locator('a[href="undefined"]').count(), 0);
  assert.deepEqual(observed.errors, []);
  assert.deepEqual(observed.failures, []);
  records.push({ scenario: 'optional fields, literal text, HTML notes, unavailable storage', status: 'pass', ...observed });
  await page.close();
  // Reuse established edge-case suites against both root and prefixed builds.
  await browser.close();
  for (const target of [production, staging]) {
    for (const script of ['verify-countdown', 'verify-ride-rollover', 'verify-photos', 'verify-general-info']) {
      await new Promise((done, reject) => {
        const child = spawn(process.execPath, ['scripts/' + script + '.mjs'], {
          env: { ...process.env, ASTRO_QA_URL: target.url }, stdio: 'inherit',
        });
        child.on('error', reject);
        child.on('exit', code => code === 0 ? done() : reject(new Error(script + ' exited ' + code)));
      });
      records.push({ scenario: script, url: target.url, status: 'pass' });
    }
  }
} finally {
  await browser.close();
  await Promise.all([production, staging].map(({server}) => new Promise(r => { server.closeAllConnections(); server.close(r); })));
  writeFileSync(evidence + '/browser-results.json', JSON.stringify({ browser: browser.version(), records }, null, 2));
}
