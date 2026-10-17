import { loadRideData, type Ride } from '../lib/data.ts';
import { countdownParts, formatRideDate, londonDeparture, nextRide } from '../lib/dates.ts';
const fallback = 'img/ride-maps/no-map-provided.png';
let stop: (() => void) | undefined;
let generation = 0;
function text(id: string, value: string | number) { const el = document.getElementById(id); if (el) el.textContent = String(value); }
function celebrationMode(enabled: boolean) {
  for (const id of ['next-countdown', 'next-intro', 'next-details', 'next-start-point-row', 'next-distance-row', 'next-overall-time-row', 'next-route-caption']) {
    const el = document.getElementById(id);
    if (el) el.hidden = enabled;
  }
}
function renderRide(ride: Ride | null) {
  celebrationMode(false);
  text('next-title', ride?.title ?? 'TBD');
  text('next-date', formatRideDate(ride?.date));
  text('next-start-time', ride ? (ride.startTime ?? '09:30') : '--');
  text('next-start-point-name', ride ? ride.meetPoint.name : 'Check WhatsApp');
  text('next-destination', ride?.destination ?? '--');
  text('next-distance', ride?.distanceMiles ?? '--');
  text('next-overall-time', ride?.overallTime ?? '--');
  const link = document.getElementById('next-start-point-link');
  if (link instanceof HTMLAnchorElement) {
    const url = ride?.meetPoint.googleMapsUrl;
    link.style.display = url ? 'inline' : 'none';
    if (url) link.href = url; else link.removeAttribute('href');
  }
  const image = document.getElementById('next-route-map');
  if (image instanceof HTMLImageElement) {
    image.src = ride?.routeMapImage ?? fallback;
    image.alt = ride ? `${ride.title} Route Map` : 'No route map provided';
  }
}
function renderCelebration() {
  renderRide(null);
  celebrationMode(true);
  text('next-title', 'The Muckies Midwinter Celebration');
  text('next-date', '1st December 2026');
  text('next-start-time', '19:00');
  text('next-destination', 'The Prince of Wales');
  const image = document.getElementById('next-route-map');
  if (image instanceof HTMLImageElement) {
    image.src = 'img/muckies-midwinter-celebration-2026.png';
    image.alt = 'The Muckies Midwinter Celebration, 1st December 2026: festive bicycles beside a warmly lit pub';
  }
}
function renderClock(target: number | null) {
  const clock = countdownParts(target);
  for (const [id, value] of Object.entries({ days: clock.days, hours: clock.hours, min: clock.minutes, sec: clock.seconds })) text(id, String(value).padStart(2, '0'));
}
export async function initWhereToNext(): Promise<void> {
  const request = ++generation;
  stop?.(); stop = undefined;
  if (!document.getElementById('where-to-next')) return;
  try {
    const data = await loadRideData();
    if (request !== generation) return;
    let selected: Ride | null | undefined;
    const tick = () => {
      const ride = nextRide(data.longerRides);
      if (ride !== selected) {
        if (ride) renderRide(ride); else renderCelebration();
        selected = ride;
      }
      renderClock(ride?.date ? londonDeparture(ride.date, ride.startTime) : null);
    };
    tick();
    // One owner: also reselect after departures, clock changes, and tab suspension.
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('pageshow', tick);
    stop = () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); window.removeEventListener('pageshow', tick); };
  } catch (error) {
    if (request !== generation) return;
    console.error('Where To Next initialization failed:', error);
    renderRide(null); renderClock(null);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void initWhereToNext(), { once: true });
else void initWhereToNext();
