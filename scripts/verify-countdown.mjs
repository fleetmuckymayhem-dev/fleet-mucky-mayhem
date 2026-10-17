import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(process.env.QA_PACKAGE_ROOT ? `${process.env.QA_PACKAGE_ROOT}/package.json` : import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const data = JSON.parse(readFileSync('public/data/longer-rides.json', 'utf8'));
const records = [];
const url = process.env.ASTRO_QA_URL || 'http://127.0.0.1:4321/';
async function open(timezoneId, now, payload = data, status = 200) {
  const page = await browser.newPage({ timezoneId });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let requests = 0;
  await page.route('**/data/longer-rides.json', async route => { requests++; await route.fulfill({ status, json: payload }); });
  const instrument = () => {
    const original = window.setInterval;
    window.countdownTimers = 0;
    window.setInterval = function (callback, delay, ...args) {
      if (delay === 1000) window.countdownTimers++;
      return original.call(this, callback, delay, ...args);
    };
  };
  // Inline instrumentation runs after Playwright installs its clock shims.
  await page.route(url, async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('<head>', `<head><script>(${instrument.toString()})()</script>`) });
  });
  await page.clock.install({ time: new Date(now) });
  await page.clock.pauseAt(new Date(now));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.querySelector('#next-title').textContent.includes('Loading'));
  return { page, errors, requests: () => requests };
}
async function state(page) {
  return page.evaluate(() => ({
    title: document.querySelector('#next-title').textContent,
    date: document.querySelector('#next-date').textContent,
    time: document.querySelector('#next-start-time').textContent,
    clock: ['days', 'hours', 'min', 'sec'].map(id => document.getElementById(id).textContent),
    timers: window.countdownTimers,
  }));
}
try {
  for (const timezone of ['Europe/London', 'America/Los_Angeles', 'Asia/Tokyo']) {
    // BST departure is 08:30 UTC, even for visitors outside the UK.
    const schedule = structuredClone(data);
    // The real schedule ends in October; add a test-only next ride to check rollover.
    schedule.longerRides.push({ ...data.longerRides[0], id: 'test-december-ride', date: '2026-12-19', year: 2026 });
    const { page, errors, requests } = await open(timezone, '2026-10-17T08:29:58Z', schedule);
    const before = await state(page);
    assert.equal(before.date, '17-Oct-26'); assert.equal(before.time, '09:30');
    assert.deepEqual(before.clock, ['00', '00', '00', '02']);
    assert.equal(await page.locator('#next-countdown').isVisible(), true);
    assert.equal(await page.locator('#next-start-point-row').isVisible(), true);
    assert.equal(await page.locator('#next-route-caption').isVisible(), true);
    assert.equal(before.timers, 1); assert.equal(requests(), 1);
    await page.clock.runFor(1000);
    assert.deepEqual((await state(page)).clock, ['00', '00', '00', '01']);
    await page.clock.runFor(1000);
    const after = await state(page);
    assert.equal(after.date, '19-Dec-26');
    assert.equal(after.timers, 1); assert.equal(requests(), 1);
    assert.notDeepEqual(after.clock, ['00', '00', '00', '00']);
    assert.deepEqual(errors, []);
    records.push({ timezone, before, after }); await page.close();
  }
  const scenarios = [
    ['last-ride-departure', data, 200, '2026-10-17T08:30:00Z'],
    ['no-future-rides', data, 200, '2027-01-01T00:00:00Z'],
    ['empty-rides', { longerRides: [], archivedRides: [] }, 200, '2026-01-01T00:00:00Z'],
    ['invalid-json-shape', { longerRides: 'invalid', archivedRides: [] }, 200, '2026-01-01T00:00:00Z'],
    ['http-failure', {}, 503, '2026-01-01T00:00:00Z'],
  ];
  for (const [name, payload, status, now] of scenarios) {
    const { page, errors, requests } = await open('Europe/London', now, payload, status);
    const actual = await state(page);
    const celebration = status === 200 && name !== 'invalid-json-shape';
    assert.equal(actual.title, celebration ? 'The Muckies Midwinter Celebration' : 'TBD');
    assert.deepEqual(actual.clock, ['00', '00', '00', '00']);
    assert.equal(await page.locator('#next-start-point-link').isVisible(), false);
    if (celebration) await checkCelebration(page);
    else assert.match(await page.locator('#next-route-map').getAttribute('src'), /no-map-provided/);
    assert.deepEqual(errors, []); assert.equal(requests(), 1);
    records.push({ name, actual }); await page.close();
  }
  // The final scheduled departure switches to the celebration without a reload.
  const finalRide = await open('Europe/London', '2026-10-17T08:29:59Z');
  assert.equal((await state(finalRide.page)).title, 'Lock, Stock and Barrel');
  await finalRide.page.clock.runFor(1000);
  await checkCelebration(finalRide.page);
  assert.equal((await state(finalRide.page)).timers, 1);
  assert.equal(finalRide.requests(), 1);
  assert.deepEqual(finalRide.errors, []);
  await finalRide.page.close();
  mkdirSync('artifacts/countdown', { recursive: true });
  for (const width of [390, 1440]) {
    const { page, errors } = await open('Europe/London', '2026-10-18T12:00:00Z');
    await page.setViewportSize({ width, height: 1000 });
    await checkCelebration(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('#where-to-next').screenshot({ path: `artifacts/countdown/celebration-${width}.png` });
    assert.deepEqual(errors, []);
    await page.close();
  }
  mkdirSync('artifacts/countdown', { recursive: true });
  writeFileSync('artifacts/countdown/browser-results.json', JSON.stringify(records, null, 2));
  console.log('PASS: three timezones, live departure rollover, single timer/request, celebration fallback at mobile/desktop widths, empty/exhausted schedules, invalid data, and HTTP failure.');
} finally { await browser.close(); }

async function checkCelebration(page) {
  assert.equal(await page.locator('#next-title').textContent(), 'The Muckies Midwinter Celebration');
  assert.equal(await page.locator('#next-date').textContent(), '1st December 2026');
  assert.equal(await page.locator('#next-start-time').textContent(), '19:00');
  assert.equal(await page.locator('#next-destination').textContent(), 'The Prince of Wales');
  for (const id of ['next-countdown', 'next-intro', 'next-start-point-row', 'next-distance-row', 'next-overall-time-row', 'next-route-caption']) {
    assert.equal(await page.locator(`#${id}`).isVisible(), false, `${id} should be hidden`);
  }
  assert.equal(await page.locator('#where-to-next h5:visible').count(), 4);
  assert.match(await page.locator('#next-route-map').getAttribute('src'), /muckies-midwinter-celebration-2026\.png$/);
  await page.waitForFunction(() => {
    const image = document.getElementById('next-route-map');
    return image.complete && image.naturalWidth > 0;
  });
}
