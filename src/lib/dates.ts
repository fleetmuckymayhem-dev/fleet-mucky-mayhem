/** Ride dates are UK calendar dates; departure times belong to Europe/London. */
export const RIDE_TIME_ZONE = 'Europe/London';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function parseDate(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid date: ${value}`);
  const [year, month, day] = value.split('-').map(Number);
  const epoch = Date.UTC(year!, month! - 1, day);
  if (year! < 1000 || new Date(epoch).toISOString().slice(0, 10) !== value) throw new Error(`Invalid date: ${value}`);
  return epoch;
}
export function validateTime(value: string): void {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error(`Invalid time: ${value}`);
}
export function formatRideDate(value: string | null | undefined): string {
  if (!value) return 'TBD';
  parseDate(value);
  const [year, month, day] = value.split('-');
  return `${day}-${months[Number(month) - 1]}-${year!.slice(-2)}`;
}
const london = new Intl.DateTimeFormat('en-GB', {
  timeZone: RIDE_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
function wallTime(epoch: number): number {
  const parts = Object.fromEntries(london.formatToParts(epoch).map(part => [part.type, part.value]));
  return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
}
const instants = new Map<string, number>();
/** Reject skipped spring times. For repeated autumn times choose the first occurrence. */
export function londonDeparture(date: string, time = '09:30'): number {
  parseDate(date);
  validateTime(time);
  const key = `${date}T${time}`;
  const cached = instants.get(key);
  if (cached !== undefined) return cached;
  const wall = Date.parse(`${date}T${time}:00Z`);
  // Sample both sides of a clock change to obtain all possible London offsets.
  const offsets = new Set([-36, 0, 36].map(hours => {
    const probe = wall + hours * 3600000;
    return wallTime(probe) - probe;
  }));
  const matches = [...offsets].map(offset => wall - offset).filter(epoch => wallTime(epoch) === wall);
  if (!matches.length) throw new Error(`Nonexistent London departure: ${key}`);
  const epoch = Math.min(...matches);
  instants.set(key, epoch);
  return epoch;
}
export function londonToday(now = Date.now()): string {
  return new Date(wallTime(now)).toISOString().slice(0, 10);
}
export interface ScheduledRide { date: string | null; startTime?: string }
export function compareRideDates(first: string | null, second: string | null, newestFirst = false): number {
  if (!first && !second) return 0;
  if (!first) return 1;
  if (!second) return -1;
  return (parseDate(first) - parseDate(second)) * (newestFirst ? -1 : 1);
}
export function nextRide<T extends ScheduledRide>(rides: readonly T[], now = Date.now()): T | null {
  return rides.filter(ride => ride.date !== null)
    .map(ride => ({ ride, epoch: londonDeparture(ride.date!, ride.startTime) }))
    .filter(item => item.epoch > now)
    .sort((a, b) => a.epoch - b.epoch)[0]?.ride ?? null;
}
export function countdownParts(target: number | null, now = Date.now()) {
  const total = target === null ? 0 : Math.max(0, Math.floor((target - now) / 1000));
  return { days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
}
