import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadRideData, parseDetails, parseEventIndex, parseRideData } from '../src/lib/data.ts';
const read = (file: string): unknown => JSON.parse(readFileSync(new URL(`../public/data/${file}`, import.meta.url), 'utf8'));
const fixture = () => structuredClone(parseRideData(read('longer-rides.json')));
test('all current data files satisfy the runtime schemas', () => {
  assert.equal(fixture().longerRides.length, 11);
  assert.equal(fixture().archivedRides.length, 20);
  assert.equal(parseEventIndex(read('events.json')).events.length, 29);
  for (const file of ['regular-rides.json', 'social-events.json', 'introductory-rides.json']) parseDetails(read(file));
});
test('ride schema rejects malformed dates, IDs, years, times, fields, and distance', () => {
  for (const corrupt of [
    (data: ReturnType<typeof fixture>) => { data.longerRides[0]!.date = '2026-02-30'; },
    (data: ReturnType<typeof fixture>) => { data.longerRides[0]!.startTime = '24:30'; },
    (data: ReturnType<typeof fixture>) => { data.longerRides[0]!.year = 2025; },
    (data: ReturnType<typeof fixture>) => { data.longerRides[0]!.distanceMiles = -1; },
    (data: ReturnType<typeof fixture>) => { data.longerRides[0]!.meetPoint.name = ''; },
    (data: ReturnType<typeof fixture>) => { data.longerRides.push(data.longerRides[0]!); },
  ]) { const data = fixture(); corrupt(data); assert.throws(() => parseRideData(data)); }
  assert.throws(() => parseRideData({ longerRides: [], archivedRides: 'not an array' }));
});
test('TBD dates and missing start times are accepted explicitly', () => {
  const data = fixture(); data.longerRides[0]!.date = null; delete data.longerRides[0]!.startTime;
  assert.equal(parseRideData(data).longerRides[0]!.date, null);
});
test('cycling-time estimates are optional and must be nonempty text when supplied', () => {
  const data = fixture();
  assert.equal(parseRideData(data).longerRides[0]!.rideTime, undefined);
  data.longerRides[0]!.rideTime = '2-3 hours';
  assert.equal(parseRideData(data).longerRides[0]!.rideTime, '2-3 hours');
  for (const invalid of ['', '   ', null, 3, ['2 hours']]) {
    const malformed = structuredClone(data) as unknown as { longerRides: Record<string, unknown>[] };
    malformed.longerRides[0]!.rideTime = invalid;
    assert.throws(() => parseRideData(malformed), /rideTime/);
  }
});
test('event schema rejects unknown types and malformed recurring events', () => {
  const sample = () => structuredClone(parseEventIndex(read('events.json')));
  const invalidType = sample(); (invalidType.events[0] as unknown as Record<string, unknown>).eventType = 'unknown';
  assert.throws(() => parseEventIndex(invalidType));
  for (const daysOfWeek of [[], [7], [-1], ['0']]) {
    const data = sample(); (data.events[0] as unknown as Record<string, unknown>).daysOfWeek = daysOfWeek;
    assert.throws(() => parseEventIndex(data));
  }
});
test('historical single-item URL arrays normalize without mutating source JSON', () => {
  const source = read('longer-rides.json');
  const parsed = parseRideData(source);
  assert.equal(parsed.longerRides[4]!.routeMapImage, 'img/ride-maps/jabberwocky.jpeg');
  assert(Array.isArray((source as { longerRides: Record<string, unknown>[] }).longerRides[4]!.routeMapImage));
  const invalid = fixture() as unknown as { longerRides: Record<string, unknown>[] };
  invalid.longerRides[0]!.photosUrl = ['one', 'two'];
  assert.throws(() => parseRideData(invalid));
});
test('concurrent ride consumers share a validated request; failed requests can retry', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response('{}', { status: 503 }); };
  try {
    await assert.rejects(Promise.all([loadRideData(), loadRideData()]), /503/);
    assert.equal(calls, 1);
    globalThis.fetch = async () => { calls++; return Response.json(fixture()); };
    const [first, second] = await Promise.all([loadRideData(), loadRideData()]);
    assert.equal(calls, 2); assert.equal(first, second);
  } finally { globalThis.fetch = original; }
});
