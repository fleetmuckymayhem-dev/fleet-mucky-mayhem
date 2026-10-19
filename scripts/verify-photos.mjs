import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { parsePhotoData, photoCollections } from '../src/lib/photos.ts';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const data = parsePhotoData(JSON.parse(readFileSync('public/data/photos.json', 'utf8')));
const referenceTime = Date.parse('2026-10-19T12:00:00Z');
const { current, archived } = photoCollections(data, referenceTime);
const years = [...(current ? [current] : []), ...archived];
const browser = await chromium.launch({ channel: 'msedge', headless: true });
mkdirSync('artifacts/photos', { recursive: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(new Date(referenceTime));
    await page.goto(process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#photos[data-photos-ready="2026"]');
    const section = page.locator('#photos');
    const buttons = section.locator('button.dropdown-toggle');
    assert.deepEqual((await buttons.allTextContents()).map(text => text.trim()), ['Photos for 2026', 'Archive Photos']);
    assert.equal(await section.locator('a').first().getAttribute('href'), data.loanBikesUrl);
    const expected = [{ label: 'Loan Bikes', url: data.loanBikesUrl }, ...years.flatMap(year => [
      ...(year.regularRidesUrl ? [{ label: `${year.year} Regular Rides`, url: year.regularRidesUrl }] : []),
      ...(year.statisticsUrl ? [{ label: `${year.year} Ride Statistics`, url: year.statisticsUrl }] : []),
      ...year.albums,
    ])];
    const actual = await section.locator('a').evaluateAll(links => links.map(link => ({
      label: link.textContent.replace(/\s+/g, ' ').trim(), url: link.getAttribute('href'),
    })));
    assert.deepEqual(actual, expected);
    // Optional one-time comparison with the pre-migration links.
    if (process.env.QA_PHOTOS_BASELINE) assert.deepEqual(actual, JSON.parse(readFileSync(process.env.QA_PHOTOS_BASELINE, 'utf8')));
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: `artifacts/photos/section-${width}.png` });
    const currentButton = section.locator('#currentPhotosBtn');
    await currentButton.focus();
    await page.keyboard.press('Space');
    assert.equal(await currentButton.getAttribute('aria-expanded'), 'true');
    await section.screenshot({ path: 'artifacts/photos/current-' + width + '.png' });
    await page.keyboard.press('Escape');
    const archiveButton = section.locator('#archivePhotosBtn');
    await archiveButton.click();
    assert.deepEqual(await section.locator('summary').allTextContents().then(texts => texts.map(text => text.replace('▾', '').trim())), archived.map(year => String(year.year)));
    const archiveMenu = section.locator('ul[aria-labelledby="archivePhotosBtn"]');
    for (let index = 0; index < archived.length; index++) {
      const summary = section.locator('summary').nth(index);
      await summary.focus();
      await page.keyboard.press('Enter');
      assert.equal(await summary.evaluate(el => el.parentElement.open), true);
      assert.equal(await section.locator('details[open]').count(), 1);
      assert.equal(await archiveButton.getAttribute('aria-expanded'), 'true', 'selecting a year must keep the archive open');
      await page.keyboard.press('Tab');
      assert.equal(await summary.evaluate(el => el.parentElement.querySelector('a') === document.activeElement), true);
      const bounds = await archiveMenu.boundingBox();
      assert(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, 'Archive overflows the viewport');
      assert(bounds.height <= 652, 'Archive must stay scrollable within the viewport');
      await section.screenshot({ path: 'artifacts/photos/archive-' + archived[index].year + '-' + width + '.png' });
    }
    await page.keyboard.press('Escape');
    assert.equal(await archiveButton.getAttribute('aria-expanded'), 'false');
    assert.equal(await archiveButton.evaluate(el => el === document.activeElement), true);
    await archiveButton.click();
    await section.locator('h2').click();
    assert.equal(await archiveButton.getAttribute('aria-expanded'), 'false', 'outside click closes archive');
    assert.equal(await section.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    await page.close();
  }
  // The same static build must select the UK's year for visitors in any timezone.
  for (const timezoneId of ['Europe/London', 'America/Los_Angeles', 'Asia/Tokyo']) {
    for (const [instant, year, archives] of [
      ['2026-12-31T23:59:59Z', 2026, ['2025', '2024']],
      ['2027-01-01T00:00:00Z', 2027, ['2026', '2025', '2024']],
      ['2028-01-01T00:00:00Z', 2028, ['2026', '2025', '2024']],
    ]) {
      const page = await browser.newPage({ timezoneId });
      await page.clock.setFixedTime(new Date(instant));
      await page.goto(process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
      await page.waitForSelector('#photos[data-photos-ready="' + year + '"]');
      assert.deepEqual(await page.locator('#archivePhotosMenu summary').allTextContents().then(texts => texts.map(text => text.replace('▾', '').trim())), archives);
      if (year > 2026) {
        assert.equal(await page.locator('#currentPhotosMenu a').count(), 0);
        assert((await page.locator('#currentPhotosMenu').textContent()).includes('Photos for ' + year + ' will be available here soon.'));
      }
      await page.close();
    }
  }
  console.log('PASS: photo year ordering, all links/labels, keyboard dropdown controls, flyer, and mobile/desktop layout.');
} finally {
  await browser.close();
}
