import { readFileSync } from 'node:fs';
import { EVENT_FILES, parseDetails, parseEventIndex, parseRideData } from '../src/lib/data.ts';
export function validateSiteData() {
  const read = (name: string): unknown => JSON.parse(readFileSync(new URL(`../public/data/${name}`, import.meta.url), 'utf8'));
  const rides = parseRideData(read('longer-rides.json'));
  const index = parseEventIndex(read('events.json'));
  const details = new Map(Object.entries(EVENT_FILES).map(([type, file]) => [type,
    type === 'Longer-Ride' ? [...rides.longerRides, ...rides.archivedRides] : parseDetails(read(file)).events,
  ]));
  for (const event of index.events) {
    const detail = details.get(event.eventType)?.find(detail => detail.id === event.id);
    if (!detail) throw new Error(`${event.id}: missing ${event.eventType} details`);
    for (const key of ['title', 'date', 'startTime', 'startRecur', 'endRecur', 'duration', 'daysOfWeek'] as const) {
      if (JSON.stringify(event[key]) !== JSON.stringify(detail[key])) throw new Error(`${event.id}: index/details disagree on ${key}`);
    }
  }
  return { rides: rides.longerRides.length + rides.archivedRides.length, events: index.events.length };
}
console.log('Validated site data:', validateSiteData());
