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
    assert.equal(actual.title, 'TBD'); assert.deepEqual(actual.clock, ['00', '00', '00', '00']);
    assert.equal(await page.locator('#next-start-point-link').isVisible(), false);
    assert.match(await page.locator('#next-route-map').getAttribute('src'), /no-map-provided/);
    assert.deepEqual(errors, []); assert.equal(requests(), 1);
    records.push({ name, actual }); await page.close();
  }
  mkdirSync('artifacts/countdown', { recursive: true });
  writeFileSync('artifacts/countdown/browser-results.json', JSON.stringify(records, null, 2));
  console.log('PASS: three timezones, live departure rollover, single timer/request, empty/exhausted schedules, invalid data, and HTTP failure.');
} finally { await browser.close(); }
