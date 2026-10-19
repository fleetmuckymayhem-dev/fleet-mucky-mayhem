import { readFileSync } from 'node:fs';
import { parseRideData } from '../src/lib/data.ts';
import { parsePhotoData } from '../src/lib/photos.ts';
export function validateSiteData() {
  const data = JSON.parse(readFileSync(new URL('../public/data/longer-rides.json', import.meta.url), 'utf8'));
  const rides = parseRideData(data);
  const photos = parsePhotoData(JSON.parse(readFileSync(new URL('../public/data/photos.json', import.meta.url), 'utf8')));
  return { rides: rides.longerRides.length + rides.archivedRides.length, photoYears: photos.years.length };
}
console.log('Validated site data:', validateSiteData());
