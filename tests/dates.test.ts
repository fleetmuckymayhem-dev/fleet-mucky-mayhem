import test from 'node:test';
import assert from 'node:assert/strict';
import { compareRideDates, countdownParts, formatRideDate, londonDeparture, londonToday, nextRide, parseDate } from '../src/lib/dates.ts';
test('calendar dates format without viewer timezone shifts and validate leap dates', () => {
  assert.equal(formatRideDate('2026-02-21'), '21-Feb-26');
  assert.equal(formatRideDate(null), 'TBD');
  assert.equal(formatRideDate('2024-02-29'), '29-Feb-24');
  for (const value of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-1-1', 'invalid']) assert.throws(() => parseDate(value));
});
test('London departures use GMT in winter, BST in summer, and a consistent default start', () => {
  assert.equal(new Date(londonDeparture('2026-02-21')).toISOString(), '2026-02-21T09:30:00.000Z');
  assert.equal(new Date(londonDeparture('2026-07-04', '08:30')).toISOString(), '2026-07-04T07:30:00.000Z');
  assert.throws(() => londonDeparture('2026-07-04', '25:00'));
});
test('UK spring/autumn transitions use actual elapsed time', () => {
  assert.equal(londonDeparture('2026-03-29') - londonDeparture('2026-03-28'), 23 * 3600000);
  assert.equal(londonDeparture('2026-10-25') - londonDeparture('2026-10-24'), 25 * 3600000);
  assert.throws(() => londonDeparture('2026-03-29', '01:30'), /Nonexistent/);
  assert.equal(new Date(londonDeparture('2026-10-25', '01:30')).toISOString(), '2026-10-25T00:30:00.000Z');
  assert.equal(londonToday(Date.parse('2026-07-01T23:30:00Z')), '2026-07-02');
});
test('next ride skips past/TBD entries, sorts without mutation, and rolls at departure', () => {
  const first = { date: '2026-03-29', startTime: '09:30' };
  const later = { date: '2026-04-04', startTime: '09:30' };
  const rides = [later, { date: null }, first];
  const departure = londonDeparture(first.date, first.startTime);
  assert.equal(nextRide(rides, departure - 1), first);
  assert.equal(nextRide(rides, departure), later);
  assert.equal(nextRide(rides, londonDeparture(later.date, later.startTime)), null);
  assert.equal(nextRide([], departure), null);
  assert.equal(rides[0], later);
});
test('countdown clamps expiry and calculates days/hours/minutes/seconds', () => {
  assert.deepEqual(countdownParts(90061000, 0), { days: 1, hours: 1, minutes: 1, seconds: 1 });
  for (const target of [null, 0, -1000]) assert.deepEqual(countdownParts(target, 0), { days: 0, hours: 0, minutes: 0, seconds: 0 });
});
test('ride date sorting retains calendar ordering with TBD entries last', () => {
  const dates = [null, '2026-10-17', '2026-02-21', null];
  assert.deepEqual([...dates].sort((a, b) => compareRideDates(a, b)), ['2026-02-21', '2026-10-17', null, null]);
  assert.deepEqual([...dates].sort((a, b) => compareRideDates(a, b, true)), ['2026-10-17', '2026-02-21', null, null]);
});
