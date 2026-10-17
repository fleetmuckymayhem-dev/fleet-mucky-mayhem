import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadRideData, parseRideData } from '../src/lib/data.ts';
const read = (file: string): unknown => JSON.parse(readFileSync(new URL(`../public/data/${file}`, import.meta.url), 'utf8'));
const fixture = () => structuredClone(parseRideData(read('longer-rides.json')));
test('all current data files satisfy the runtime schemas', () => {
  assert.equal(fixture().longerRides.length, 11);
  assert.equal(fixture().archivedRides.length, 20);
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
  delete data.longerRides[0]!.rideTime;
  assert.equal(parseRideData(data).longerRides[0]!.rideTime, undefined);
  data.longerRides[0]!.rideTime = '2-3 hours';
  assert.equal(parseRideData(data).longerRides[0]!.rideTime, '2-3 hours');
  for (const invalid of ['', '   ', null, 3, ['2 hours']]) {
    const malformed = structuredClone(data) as unknown as { longerRides: Record<string, unknown>[] };
    malformed.longerRides[0]!.rideTime = invalid;
    assert.throws(() => parseRideData(malformed), /rideTime/);
  }
});
test('ride schema still rejects missing dates, meet points, and malformed notes', () => {
  for (const corrupt of [
    (ride: Record<string, unknown>) => { delete ride.date; },
    (ride: Record<string, unknown>) => { delete ride.meetPoint; },
    (ride: Record<string, unknown>) => { ride.notes = [42]; },
  ]) {
    const data = fixture() as unknown as { longerRides: Record<string, unknown>[] };
    corrupt(data.longerRides[0]!);
    assert.throws(() => parseRideData(data));
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
