import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const url = process.env.STAGING_QA_URL || 'http://127.0.0.1:4324/staging-fleet-mucky-mayhem/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [], failures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(new URL(url).origin) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.waitForSelector('#photos[data-photos-ready]');
    await page.waitForFunction(() => document.querySelector('#accordion2026 .accordion-item'));
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = 'eager';
      await Promise.all([...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      })));
    });
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, [], 'Images must load from the staging subdirectory');
    await page.locator('#showLonger').click();
    assert.match(await page.locator('#accordionLonger').textContent(), /2027 Longer Rides programme/);
    await page.locator('#archivedDropdownBtn').click();
    await page.locator('#showArchived2026').click();
    assert.equal(await page.locator('#accordion2026').isVisible(), true);
    await page.locator('#currentPhotosBtn').click();
    assert.equal(await page.locator('#currentPhotosMenu').isVisible(), true);
    await page.keyboard.press('Escape');
    await page.locator('#archivePhotosBtn').click();
    await page.locator('#archivePhotosMenu summary').first().click();
    assert.equal(await page.locator('#archivePhotosMenu details[open]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log(`PASS ${width}px: staging assets, ride data, all images, Photos controls, indexing tag and JavaScript.`);
    await page.close();
  }
} finally { await browser.close(); }
