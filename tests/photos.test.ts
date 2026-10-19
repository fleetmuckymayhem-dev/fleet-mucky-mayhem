import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parsePhotoData, visiblePhotoYears, photoCollections, currentPhotoYear } from '../src/lib/photos.ts';
const fixture = () => JSON.parse(readFileSync(new URL('../public/data/photos.json', import.meta.url), 'utf8'));

test('photo data preserves the existing yearly collections', () => {
  const data = parsePhotoData(fixture());
  assert.deepEqual(visiblePhotoYears(data).map(year => year.year), [2026, 2025, 2024]);
  assert.equal(data.years.reduce((total, year) => total + year.albums.length, 0), 37);
});

test('adding a published year needs only data; empty drafts stay hidden', () => {
  const data = parsePhotoData(fixture());
  data.years.push({ year: 2028, albums: [] });
  data.years.push({ year: 2027, albums: [{ label: 'First 2027 ride', url: 'https://example.com/album' }] });
  assert.deepEqual(visiblePhotoYears(data).map(year => year.year), [2027, 2026, 2025, 2024]);
  assert.equal(data.years.at(-1)!.year, 2027, 'sorting must not reorder the source data');
});

test('photo validation rejects duplicate years, invalid years, labels and unsafe links', () => {
  for (const corrupt of [
    (data: ReturnType<typeof fixture>) => { data.years.push(data.years[0]); },
    (data: ReturnType<typeof fixture>) => { data.years[0].year = '2027'; },
    (data: ReturnType<typeof fixture>) => { data.years[0].albums[0].label = ''; },
    (data: ReturnType<typeof fixture>) => { data.years[0].albums[0].url = 'javascript:alert(1)'; },
    (data: ReturnType<typeof fixture>) => { data.loanBikesUrl = 'not a URL'; },
    (data: ReturnType<typeof fixture>) => { data.years[0].statisticsUrl = ''; },
  ]) {
    const data = fixture();
    corrupt(data);
    assert.throws(() => parsePhotoData(data));
  }
});

test('photo rollover follows UK New Year without changing data or rebuilding', () => {
  const data = parsePhotoData(fixture());
  const before = Date.parse('2026-12-31T23:59:59Z');
  const after = Date.parse('2027-01-01T00:00:00Z');
  assert.equal(currentPhotoYear(before), 2026);
  assert.equal(currentPhotoYear(after), 2027);
  assert.equal(photoCollections(data, before).current!.year, 2026);
  assert.deepEqual(photoCollections(data, before).archived.map(year => year.year), [2025, 2024]);
  assert.equal(photoCollections(data, after).current, undefined);
  assert.deepEqual(photoCollections(data, after).archived.map(year => year.year), [2026, 2025, 2024]);
  data.years.push({ year: 2027, albums: [] });
  assert.equal(photoCollections(data, before).current!.year, 2026, 'preparing 2027 must not change the selected year');
  assert.equal(photoCollections(data, after).current!.albums.length, 0);
  data.years.at(-1)!.albums.push({ label: '2027 ride', url: 'https://example.com/photos' });
  assert.equal(photoCollections(data, after).current!.albums.length, 1);
  assert.deepEqual(photoCollections(data, Date.parse('2028-01-01T00:00:00Z')).archived.map(year => year.year), [2027, 2026, 2025, 2024]);
});
