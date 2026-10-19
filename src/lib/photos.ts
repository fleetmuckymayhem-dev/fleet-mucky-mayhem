export interface PhotoAlbum { label: string; url: string }
export interface PhotoYear {
  year: number;
  regularRidesUrl?: string;
  statisticsUrl?: string;
  albums: PhotoAlbum[];
}
export interface PhotoData { loanBikesUrl: string; years: PhotoYear[] }

function object(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: expected object`);
}
function url(value: unknown, label: string): void {
  if (typeof value !== 'string') throw new Error(`${label}: expected HTTPS URL`);
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error(`${label}: expected HTTPS URL`); }
  if (parsed.protocol !== 'https:') throw new Error(`${label}: expected HTTPS URL`);
}

/** Validate photo content before rendering or building the site. */
export function parsePhotoData(value: unknown): PhotoData {
  object(value, 'photos');
  url(value.loanBikesUrl, 'photos.loanBikesUrl');
  if (!Array.isArray(value.years)) throw new Error('photos.years: expected array');
  const years = new Set<number>();
  value.years.forEach((entry: unknown, index: number) => {
    const label = `photos.years[${index}]`;
    object(entry, label);
    if (typeof entry.year !== 'number' || !Number.isInteger(entry.year) || entry.year < 1) throw new Error(`${label}: invalid year`);
    if (years.has(entry.year)) throw new Error(`${label}: duplicate year`);
    years.add(entry.year);
    for (const key of ['regularRidesUrl', 'statisticsUrl']) if (entry[key] !== undefined) url(entry[key], `${label}.${key}`);
    if (!Array.isArray(entry.albums)) throw new Error(`${label}.albums: expected array`);
    entry.albums.forEach((album: unknown, albumIndex: number) => {
      const albumLabel = `${label}.albums[${albumIndex}]`;
      object(album, albumLabel);
      if (typeof album.label !== 'string' || !album.label.trim()) throw new Error(`${albumLabel}.label: expected nonempty text`);
      url(album.url, `${albumLabel}.url`);
    });
  });
  return value as unknown as PhotoData;
}

/** Empty drafts stay hidden; photo years are independent of the ride programme. */
export function visiblePhotoYears(data: PhotoData): PhotoYear[] {
  return data.years.filter(year => year.regularRidesUrl || year.statisticsUrl || year.albums.length)
    .toSorted((a, b) => b.year - a.year);
}

/** Resolve the calendar year at viewing time, consistently for all visitors. */
export function currentPhotoYear(now = Date.now()): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric' }).format(now));
}

export function photoCollections(data: PhotoData, now = Date.now()) {
  const year = currentPhotoYear(now);
  return {
    current: data.years.find(collection => collection.year === year),
    archived: visiblePhotoYears(data).filter(collection => collection.year < year),
  };
}
