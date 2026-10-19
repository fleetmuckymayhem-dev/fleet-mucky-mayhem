import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const data = JSON.parse(readFileSync('public/data/longer-rides.json', 'utf8'));
const url = process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/';
mkdirSync('artifacts/ride-rollover', { recursive: true });

async function open(payload, width = 1440, status = 200) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, timezoneId: 'Europe/London', reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let requests = 0;
  await page.route('**/data/longer-rides.json', route => { requests++; return route.fulfill({ json: payload, status }); });
  await page.clock.setFixedTime(new Date('2026-10-19T12:00:00Z'));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.querySelector('#accordionLonger').textContent.includes('Loading'));
  return { page, errors, requests: () => requests };
}

async function selectArchive(page, year) {
  await page.locator('#archivedDropdownBtn').click();
  await page.locator(`#showArchived${year}`).click();
  assert.equal(await page.locator(`#accordion${year}`).isVisible(), true);
  assert.equal(await page.locator('#ride-diary .accordion:not(.d-none)').count(), 1);
  assert.match(await page.locator('#archivedDropdownBtn').getAttribute('class'), /btn-warning/);
}

async function expand(page, button) {
  await button.click();
  await page.waitForFunction(selector => {
    const el = document.querySelector(selector);
    return el.classList.contains('show') && !el.classList.contains('collapsing');
  }, await button.getAttribute('data-bs-target'));
}

try {
  for (const width of [390, 1440]) {
    const { page, errors, requests } = await open(data, width);
    assert.equal(await page.locator('#accordionRegular').isVisible(), true);
    assert.deepEqual(await page.locator('#archivedRidesMenu .dropdown-item').allTextContents(), ['2026', '2025', '2024']);
    await page.locator('#showLonger').click();
    assert.equal((await page.locator('#accordionLonger').textContent()).trim(), 'The 2027 Longer Rides programme will be published here soon.');
    assert.equal(await page.locator('#accordionLonger .accordion-item').count(), 0);
    assert.equal(await page.locator('#next-details').isVisible(), false);
    assert.match(await page.locator('#next-route-map').getAttribute('src'), /muckies-midwinter-celebration-2026/);
    await page.locator('#ride-diary').screenshot({ path: `artifacts/ride-rollover/awaiting-2027-${width}.png` });
    for (const year of [2026, 2025, 2024]) {
      await selectArchive(page, year);
      const buttons = page.locator(`#accordion${year} .accordion-button`);
      assert.equal(await buttons.count(), data.archivedRides.filter(ride => ride.year === year).length);
      await expand(page, buttons.first());
      await expand(page, buttons.nth(1));
      assert.equal(await page.locator(`#accordion${year} .accordion-collapse.show`).count(), 1);
      if (year === 2026) await page.locator('#ride-diary').screenshot({ path: `artifacts/ride-rollover/archive-2026-${width}.png` });
    }
    await page.locator('#showRegular').click();
    assert.equal(await page.locator('#accordionRegular').isVisible(), true);
    assert.match(await page.locator('#archivedDropdownBtn').getAttribute('class'), /btn-secondary/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    assert.equal(requests(), 1);
    await page.close();
  }

  // New programmes and archive years require data changes only. Also test TBD sorting.
  const payload = structuredClone(data);
  const ride = payload.archivedRides[0];
  payload.longerRides = [
    { ...ride, id: 'test-tbd', title: 'Undecided ride', date: null, year: 2027 },
    { ...ride, id: 'test-later', title: 'Later ride', date: '2027-03-20', year: 2027 },
    { ...ride, id: 'test-first', title: 'First ride', date: '2027-02-20', year: 2027 },
  ];
  payload.archivedRides.push({ ...ride, id: 'test-older', date: '2023-02-18', year: 2023 });
  const { page, errors } = await open(payload);
  await page.locator('#showLonger').click();
  assert.deepEqual((await page.locator('#accordionLonger .accordion-button').allTextContents()).map(text => text.trim()), [
    '20-Feb-27 | First ride', '20-Mar-27 | Later ride', 'TBD | Undecided ride',
  ]);
  assert.equal(await page.locator('#next-title').textContent(), 'First ride');
  assert.equal(await page.locator('#next-details').isVisible(), true);
  assert.equal(await page.locator('#next-countdown').isVisible(), true);
  await expand(page, page.locator('#accordionLonger .accordion-button').first());
  await selectArchive(page, 2023);
  assert.equal(await page.locator('#accordion2023 .accordion-item').count(), 1);
  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  assert.deepEqual(duplicateIds, []);
  assert.deepEqual(errors, []);
  await page.close();

  for (const [payload, status, message] of [
    [{ longerRides: [], archivedRides: [] }, 200, 'The next Longer Rides programme will be published here soon.'],
    [{}, 503, 'Unable to load Longer Rides. Please try refreshing the page.'],
  ]) {
    const { page, errors } = await open(payload, 390, status);
    await page.locator('#showLonger').click();
    assert.equal((await page.locator('#accordionLonger').textContent()).trim(), message);
    assert.equal(await page.locator('#archivedDropdownBtn').isDisabled(), true);
    await page.locator('#showRegular').click();
    assert.equal(await page.locator('#accordionRegular').isVisible(), true);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('PASS: mobile/desktop rollover, all archives and controls, empty/error states, future programme rendering, TBD ordering, dynamic archive years, unique IDs, and Where To Next.');
} finally {
  await browser.close();
}
