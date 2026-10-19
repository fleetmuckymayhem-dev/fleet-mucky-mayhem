import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const original = JSON.parse(readFileSync('public/data/longer-rides.json', 'utf8'));
original.longerRides = original.archivedRides.filter(ride => ride.year === 2026);
original.archivedRides = original.archivedRides.filter(ride => ride.year !== 2026);
const results = [];
mkdirSync('artifacts/longer-rides', { recursive: true });
try {
  for (const width of [390, 1440]) {
    const payload = structuredClone(original);
    payload.longerRides[0].rideTime = '2-3 hours';
    payload.longerRides[0].meetPoint.note = 'NOTE EARLIER START';
    payload.longerRides[1].rideTime = '<b>3 hours</b>';
    const page = await browser.newPage({ viewport: { width, height: 900 }, timezoneId: 'Europe/London' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/data/longer-rides.json', route => route.fulfill({ json: payload }));
    await page.goto(process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelectorAll('.ride-general-info').length === 31);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#showLonger').click();
    await page.locator('#accordionLonger .accordion-button').first().click();
    await page.waitForFunction(() => {
      const panel = document.querySelector('#accordionLonger .accordion-collapse');
      return panel.classList.contains('show') && !panel.classList.contains('collapsing');
    });
    const table = page.locator('#accordionLonger .ride-general-info').first();
    await table.waitFor({ state: 'visible' });
    assert.deepEqual(await table.locator('th').allTextContents(), ['DESTINATION:', 'DISTANCE:', 'DEPARTURE TIME:', 'OVERALL TIME:', 'RIDE TIME:']);
    assert.equal((await table.locator('tr').last().locator('td').textContent()).trim(), '2-3 hours');
    assert.equal((await table.locator('tr').nth(4).locator('td').textContent()).trim(), payload.longerRides[0].overallTime);
    const departure = await table.locator('tr').nth(2).textContent();
    assert(departure.includes('09:30') && departure.includes(payload.longerRides[0].meetPoint.name) && departure.includes('NOTE EARLIER START'));
    assert.equal(await table.locator('a').getAttribute('href'), payload.longerRides[0].meetPoint.googleMapsUrl);
    const escaped = page.locator('#accordionLonger .ride-general-info').nth(1).locator('tr').last().locator('td');
    assert.equal((await escaped.textContent()).trim(), '<b>3 hours</b>');
    assert.equal(await escaped.locator('b').count(), 0);
    assert.equal(await page.locator('#accordionRegular .ride-general-info').count(), 0);
    assert.equal(await page.locator('#accordion2025 .ride-general-info').count(), 10);
    assert.equal(await page.locator('#accordion2024 .ride-general-info').count(), 10);
    const bounds = await table.boundingBox();
    assert(bounds.x >= 0 && bounds.x + bounds.width <= width, 'General Info table overflows the viewport');
    await table.screenshot({ path: `artifacts/longer-rides/populated-${width}.png` });
    assert.deepEqual(errors, []);
    results.push({ width, suppliedRideTime: '2-3 hours', overallTime: payload.longerRides[0].overallTime, tableBounds: bounds, errors });
    await page.close();
  }
  writeFileSync('artifacts/longer-rides/populated-results.json', JSON.stringify(results, null, 2));
  console.log('PASS: supplied and escaped ride times, overall/departure/map preservation, archive coverage, regular-ride isolation, and mobile/desktop table bounds.');
} finally { await browser.close(); }
