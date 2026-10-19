import { londonDeparture, parseDate, validateTime } from './dates.ts';

export interface MeetPoint { name: string; googleMapsUrl?: string; note?: string }
export interface Ride {
  id: string; title: string; date: string | null; year: number; startTime?: string;
  meetPoint: MeetPoint; destination?: string; distanceMiles?: number;
  overallTime?: string; rideTime?: string; routeMapImage?: string;
  guidance?: string | string[]; notes?: string[]; photosUrl?: string; reliveUrl?: string;
}
export interface RideData { programmeYear?: number; longerRides: Ride[]; archivedRides: Ride[] }
type RecordValue = Record<string, unknown>;
function object(value: unknown, label: string): asserts value is RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: expected object`);
}
function text(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label}: expected nonempty text`);
}
function list(value: unknown, label: string): asserts value is unknown[] {
  if (!Array.isArray(value)) throw new Error(`${label}: expected array`);
}
function validateRide(value: unknown, label: string): asserts value is Ride {
  object(value, label);
  text(value.id, `${label}.id`); text(value.title, `${label}.title`);
  if (value.date !== null) { text(value.date, `${label}.date (use null for TBD)`); parseDate(value.date); }
  if (!Number.isInteger(value.year)) throw new Error(`${label}: invalid year`);
  if (typeof value.date === 'string' && Number(value.date.slice(0, 4)) !== value.year) throw new Error(`${label}: year/date mismatch`);
  if (value.startTime !== undefined) { text(value.startTime, `${label}.startTime`); validateTime(value.startTime); }
  if (typeof value.date === 'string') londonDeparture(value.date, value.startTime as string | undefined);
  object(value.meetPoint, `${label}.meetPoint`); text(value.meetPoint.name, `${label}.meetPoint.name`);
  for (const key of ['googleMapsUrl', 'note']) if (value.meetPoint[key] !== undefined) text(value.meetPoint[key], `${label}.meetPoint.${key}`);
  for (const key of ['destination', 'overallTime', 'rideTime', 'routeMapImage', 'photosUrl', 'reliveUrl']) if (value[key] !== undefined) {
    // Preserve compatibility with historical single-item URL arrays.
    if (['routeMapImage', 'photosUrl', 'reliveUrl'].includes(key) && Array.isArray(value[key]) && value[key].length === 1) value[key] = value[key][0];
    text(value[key], `${label}.${key}`);
  }
  if (value.distanceMiles !== undefined && (typeof value.distanceMiles !== 'number' || !Number.isFinite(value.distanceMiles) || value.distanceMiles < 0)) throw new Error(`${label}: invalid distance`);
  for (const key of ['guidance', 'notes']) if (value[key] !== undefined) {
    if (key === 'guidance' && typeof value[key] === 'string') continue;
    list(value[key], `${label}.${key}`);
    if (value[key].some(item => typeof item !== 'string')) throw new Error(`${label}.${key}: expected text array`);
  }
}
export function parseRideData(value: unknown): RideData {
  value = structuredClone(value);
  object(value, 'rides');
  if (value.programmeYear !== undefined && (!Number.isInteger(value.programmeYear) || Number(value.programmeYear) < 1)) {
    throw new Error('rides: invalid programmeYear');
  }
  for (const key of ['longerRides', 'archivedRides']) {
    list(value[key], key);
    value[key].forEach((ride, index) => validateRide(ride, `${key}[${index}]`));
  }
  const data = value as unknown as RideData;
  const rides = [...data.longerRides, ...data.archivedRides];
  if (new Set(rides.map(ride => ride.id)).size !== rides.length) throw new Error('rides: duplicate IDs');
  return data;
}
let rideRequest: Promise<RideData> | undefined;
export function loadRideData(): Promise<RideData> {
  return rideRequest ??= fetch('data/longer-rides.json').then(async response => {
    if (!response.ok) throw new Error(`longer-rides.json: HTTP ${response.status}`);
    return parseRideData(await response.json());
  }).catch(error => { rideRequest = undefined; throw error; });
}
