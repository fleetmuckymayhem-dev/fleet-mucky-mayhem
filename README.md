# Fleet Mucky Mayhem — Astro migration

Version **2.0.0**. This project has its own Git repository and starts from one new root commit; no Git history from the original repository is imported. The `baseline/` directory contains comparison source files only, not the original `.git` directory or its commits.

Local component migration of the original single-page site, without a redesign. Source snapshot: `Martin-Ferrero-Thompson/fleet-mucky-mayhem`, commit `7c284bb` (v1.11.2). The original checkout and deployment are untouched.

## Run

Requires a Node version supported by the locked Astro release (verified with Node 24.14.1).

```powershell
npm.cmd ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run dev
```

Open http://127.0.0.1:4321/. For a production preview, run `npm.cmd run build` then `npm.cmd run preview`. `npm.cmd run check` runs Astro/TypeScript diagnostics. On other platforms use `npm` rather than `npm.cmd` and your shell's environment-variable syntax.

## Migration boundaries

- Every visible section, navigation, and footer is now an Astro template under `src/components/`, composed by `src/pages/index.astro`, with no additional DOM wrappers.
- `src/layouts/SiteLayout.astro` preserves the metadata, external fonts/icons, dark theme, and global stylesheet order: Bootstrap first, original Sass second.
- No raw HTML snapshots or `set:html` fragments remain in the page. `EventCalendar.astro` preserves the original disabled calendar and modal together as an HTML comment.
- Existing browser modules remain under `src/js/`; countdown ownership is now in `src/scripts/where-to-next.ts`. All load from `src/scripts/site.ts`. The new data/date modules are type checked; legacy JavaScript is not yet fully type checked. `main.js` provides the Bootstrap compatibility export; CSS is imported by the layout.
- Bootstrap is locked to 5.3.8 and FullCalendar to 6.1.20 to match the source lockfile. Package installation is reproducible with `npm ci`.
- Original image bytes and JSON are retained. Source images used in Sass are under `src/img`; runtime/static images are under `public/img`. This duplication is intentional for the prototype and can be consolidated later.
- The original calendar section is commented out; it remains hidden. No new navigation links or UI controls were added.
- Astro requires valid template syntax. Existing malformed tags were expressed as explicit browser-equivalent markup: line breaks, empty paragraphs surrounding block headings, misnested anchor/icon closing tags, missing list-item/container closings, and a stray footer span closing tag. Empty photo list items are deliberately retained because browsers render them in the original dropdowns. Section DOM structure and geometry are compared with the baseline.
- Analytics scripts and the tracking noscript iframe are omitted from the prototype so local review does not send production page views. Restore the agreed production analytics setup during the full migration.
- `src/lib/data.ts` defines runtime-validated ride/event types and a shared request cache. The diary and countdown share one ride-data request. Calendar consumers also use the validated loaders, although the calendar remains hidden and its UI is not release-verified.
- `src/lib/dates.ts` formats calendar dates without viewer-timezone drift, sorts dates, converts departures in Europe/London, selects the next ride, and calculates elapsed countdown time.
- The fixed February timer has been removed from `utils.js`, which retains only theme behavior. The new countdown uses one interval, reselects at departure, and catches up on visibility/pageshow events. Departure means strictly future: at the exact start instant, it selects the next dated ride or shows TBD/zeros. Missing start times default to 09:30. Spring-skipped London times are rejected; autumn-repeated times use the first occurrence.
- `npm.cmd run validate:data` validates all five content files and index/detail consistency. Production builds run it automatically. `npm.cmd test` exercises schema and date logic using Node's test runner (Node 24 recommended).

## Verification

See [VERIFICATION.md](VERIFICATION.md) for the latest complete-page comparison results and limits.

`baseline/src/` is a separate untouched snapshot of the original source. The baseline uses Vite 5.4.21, the original locked Bootstrap/FullCalendar versions, and the same Sass compiler as the prototype. Its comparison configuration copies runtime assets, but intentionally skips imagemin optimization to compare original image bytes without native optimization dependencies. It is a source baseline, not a verified copy of the deployed live site.

To reproduce browser checks:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd run baseline:build
npm.cmd run build
# Start these in separate terminals:
npm.cmd run baseline:preview
npm.cmd run preview
# With Playwright available (and Edge installed):
node scripts/verify-full-browser.mjs
node scripts/verify-countdown.mjs
# With Python and Pillow available:
python scripts/compare-screenshots.py
```

`QA_PACKAGE_ROOT` can point to an existing node_modules directory containing Playwright. Otherwise the browser script resolves a locally installed Playwright package. Install Playwright separately if needed. Full-page screenshots and JSON results are written to ignored `artifacts/parity/`; the earlier prototype evidence remains under `artifacts/`. Browser checks use isolated headless Edge profiles and block Google Tag Manager requests. They do not interact with a personal browser profile. `scripts/verify-browser.mjs` retains the earlier narrow prototype check; use `verify-full-browser.mjs` for this milestone.

## Next stage

Longer Rides now group Destination, Distance, and Departure Time above the guidance-only timing note, followed by Overall Time and Ride Time. Optional `rideTime` is a readable cycling-time estimate excluding stops (for example `"2-3 hours"`) in `public/data/longer-rides.json`; omitted values display **TBC**. The layout applies to current and archived Longer Rides, and leaves Regular Rides, Where To Next, and calendar displays unchanged. See LONGER-RIDES-LAYOUT.md for validation and the updated comparison workflow.

The typed data/shared date layer and countdown fix are implemented. Next prepare release configuration: production metadata/static verification files, analytics, repository-prefix deployment, and a live-site comparison. Further legacy-module conversion and calendar re-enablement should be separate milestones. See DATA-AND-DATES.md for the behavior change and evidence.
