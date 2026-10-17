import { readFileSync } from 'node:fs';
import { parseRideData } from '../src/lib/data.ts';
export function validateSiteData() {
  const data = JSON.parse(readFileSync(new URL('../public/data/longer-rides.json', import.meta.url), 'utf8'));
  const rides = parseRideData(data);
  return { rides: rides.longerRides.length + rides.archivedRides.length };
}
console.log('Validated site data:', validateSiteData());
