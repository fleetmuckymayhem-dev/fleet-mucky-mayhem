import { readFileSync, statSync } from 'node:fs';
import { parseRideData } from '../src/lib/data.ts';
import { parsePhotoData } from '../src/lib/photos.ts';
export function validateSiteData() {
  const data = JSON.parse(readFileSync(new URL('../public/data/longer-rides.json', import.meta.url), 'utf8'));
  const rides = parseRideData(data);
  for (const ride of [...rides.longerRides, ...rides.archivedRides]) {
    if (ride.routeMapImage) {
      const path = new URL('../public/' + ride.routeMapImage, import.meta.url);
      if (!statSync(path, { throwIfNoEntry: false })?.isFile()) throw new Error(ride.id + ': missing route-map image ' + ride.routeMapImage);
    }
  }
  const photos = parsePhotoData(JSON.parse(readFileSync(new URL('../public/data/photos.json', import.meta.url), 'utf8')));
  return { rides: rides.longerRides.length + rides.archivedRides.length, photoYears: photos.years.length };
}
console.log('Validated site data:', validateSiteData());
