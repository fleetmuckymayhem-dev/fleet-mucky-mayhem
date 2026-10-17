import { londonDeparture, parseDate, validateTime } from './dates.ts';
export const EVENT_TYPES = ['Social', 'Introductory-Ride', 'Regular-Ride', 'Longer-Ride'] as const;
export type EventType = typeof EVENT_TYPES[number];
export interface MeetPoint { name: string; googleMapsUrl?: string; note?: string }
export interface EventDetail {
  id: string; title: string; date?: string | null; startTime?: string;
  daysOfWeek?: number[]; startRecur?: string; endRecur?: string; duration?: string;
  meetPoint?: MeetPoint; destination?: string; distanceMiles?: number; overallTime?: string; rideTime?: string;
  routeMapImage?: string; guidance?: string | string[]; notes?: string[];
  photosUrl?: string; reliveUrl?: string; description?: string;
}
export interface Ride extends EventDetail { date: string | null; year: number; meetPoint: MeetPoint }
export interface RideData { longerRides: Ride[]; archivedRides: Ride[] }
interface BaseIndex { id: string; title: string; startTime: string; eventType: EventType; location: string }
export type IndexEvent = BaseIndex & (
  { date: string; daysOfWeek?: never; startRecur?: never; endRecur?: never; duration?: never } |
  { date?: never; daysOfWeek: number[]; startRecur: string; endRecur: string; duration: string }
);
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
function date(value: unknown, label: string) { text(value, label); parseDate(value); }
function time(value: unknown, label: string) { text(value, label); validateTime(value); }
function recurrence(row: RecordValue, label: string) {
  list(row.daysOfWeek, `${label}.daysOfWeek`);
  if (!row.daysOfWeek.length || row.daysOfWeek.some(day => !Number.isInteger(day) || Number(day) < 0 || Number(day) > 6)) throw new Error(`${label}: invalid weekdays`);
  date(row.startRecur, `${label}.startRecur`); date(row.endRecur, `${label}.endRecur`);
  if (String(row.endRecur) <= String(row.startRecur)) throw new Error(`${label}: invalid recurrence range`);
  text(row.duration, `${label}.duration`);
  if (!/^\d{2}:[0-5]\d$/.test(row.duration)) throw new Error(`${label}: invalid duration`);
  if (row.date !== undefined) throw new Error(`${label}: recurrence cannot also have a date`);
}
function detail(value: unknown, label: string): asserts value is EventDetail {
  object(value, label); text(value.id, `${label}.id`); text(value.title, `${label}.title`);
  if (value.date !== undefined && value.date !== null) date(value.date, `${label}.date`);
  if (value.startTime !== undefined) time(value.startTime, `${label}.startTime`);
  if (value.daysOfWeek !== undefined) { time(value.startTime, `${label}.startTime`); recurrence(value, label); }
  if (typeof value.date === 'string') londonDeparture(value.date, value.startTime as string | undefined);
  if (value.meetPoint !== undefined) {
    object(value.meetPoint, `${label}.meetPoint`); text(value.meetPoint.name, `${label}.meetPoint.name`);
    for (const key of ['googleMapsUrl', 'note']) if (value.meetPoint[key] !== undefined) text(value.meetPoint[key], `${label}.meetPoint.${key}`);
  }
  for (const key of ['destination', 'overallTime', 'rideTime', 'routeMapImage', 'photosUrl', 'reliveUrl', 'description']) if (value[key] !== undefined) {
    // Historical JSON has some URL fields wrapped in a single-item array.
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
function unique(rows: { id: string }[], label: string) {
  if (new Set(rows.map(row => row.id)).size !== rows.length) throw new Error(`${label}: duplicate IDs`);
}
export function parseRideData(value: unknown): RideData {
  value = structuredClone(value);
  object(value, 'rides');
  for (const key of ['longerRides', 'archivedRides']) {
    list(value[key], key);
    value[key].forEach((ride, index) => {
      const label = `${key}[${index}]`; detail(ride, label);
      if (ride.date === undefined) throw new Error(`${label}: missing date (use null for TBD)`);
      if (!Number.isInteger((ride as Ride).year)) throw new Error(`${label}: invalid year`);
      if (!ride.meetPoint) throw new Error(`${label}: missing meet point`);
      if (ride.date && Number(ride.date.slice(0, 4)) !== (ride as Ride).year) throw new Error(`${label}: year/date mismatch`);
    });
  }
  const data = value as unknown as RideData;
  unique([...data.longerRides, ...data.archivedRides], 'rides');
  return data;
}
export function parseEventIndex(value: unknown): { events: IndexEvent[] } {
  object(value, 'index'); list(value.events, 'index.events');
  value.events.forEach((row, index) => {
    const label = `events[${index}]`; object(row, label);
    text(row.id, `${label}.id`); text(row.title, `${label}.title`); text(row.location, `${label}.location`);
    time(row.startTime, `${label}.startTime`);
    if (!EVENT_TYPES.includes(row.eventType as EventType)) throw new Error(`${label}: unknown event type`);
    if (row.daysOfWeek !== undefined) recurrence(row, label);
    else { date(row.date, `${label}.date`); londonDeparture(row.date as string, row.startTime as string); }
  });
  const data = value as unknown as { events: IndexEvent[] }; unique(data.events, 'index'); return data;
}
export function parseDetails(value: unknown): { events: EventDetail[] } {
  value = structuredClone(value);
  object(value, 'details'); list(value.events, 'details.events');
  value.events.forEach((row, index) => detail(row, `details[${index}]`));
  const data = value as unknown as { events: EventDetail[] }; unique(data.events, 'details'); return data;
}
export const EVENT_FILES: Record<EventType, string> = {
  Social: 'social-events.json', 'Introductory-Ride': 'introductory-rides.json',
  'Regular-Ride': 'regular-rides.json', 'Longer-Ride': 'longer-rides.json',
};
const requests = new Map<string, Promise<unknown>>();
async function load<T>(file: string, parse: (value: unknown) => T): Promise<T> {
  let pending = requests.get(file);
  if (!pending) {
    pending = fetch(`data/${file}`).then(async response => {
      if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
      return parse(await response.json());
    }).catch(error => { requests.delete(file); throw error; });
    requests.set(file, pending);
  }
  return await pending as T;
}
export const loadRideData = () => load('longer-rides.json', parseRideData);
export const loadEventIndex = () => load('events.json', parseEventIndex);
export async function loadEventDetails(type: EventType): Promise<EventDetail[]> {
  if (type === 'Longer-Ride') { const data = await loadRideData(); return [...data.longerRides, ...data.archivedRides]; }
  if (!EVENT_FILES[type]) throw new Error(`Unknown event type: ${type}`);
  return (await load(EVENT_FILES[type], parseDetails)).events;
}
