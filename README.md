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
- No raw HTML snapshots or `set:html` fragments remain in the page. The abandoned calendar, modal, navigation placeholder, and calendar-only assets/data have been removed.
- Existing browser modules remain under `src/js/`; countdown ownership is in `src/scripts/where-to-next.ts`. All load from `src/scripts/site.ts`, which imports Bootstrap directly to preserve dropdowns, accordions, the carousel, and navigation. Data/date modules are type checked; legacy JavaScript is not yet fully type checked. CSS is imported by the layout.
- Bootstrap remains locked to 5.3.8. FullCalendar and its unused Preact dependency have been removed. Package installation is reproducible with `npm ci`.
- Original image bytes and JSON are retained. Source images used in Sass are under `src/img`; runtime/static images are under `public/img`. This duplication is intentional for the prototype and can be consolidated later.
- No calendar code is shipped in the current application. Removing this previously hidden feature does not change the visible navigation or page sections.
- Astro requires valid template syntax. Existing malformed tags were expressed as explicit browser-equivalent markup: line breaks, empty paragraphs surrounding block headings, misnested anchor/icon closing tags, missing list-item/container closings, and a stray footer span closing tag. Empty photo list items are deliberately retained because browsers render them in the original dropdowns. Section DOM structure and geometry are compared with the baseline.
- Analytics scripts and the tracking noscript iframe are omitted from the prototype so local review does not send production page views. Restore the agreed production analytics setup during the full migration.
- `src/lib/data.ts` defines runtime-validated ride types and a shared request cache. The diary and countdown share one ride-data request. Calendar-only event models, loaders, recurrence validation, and tests were removed; Longer Ride validation is retained.
- `src/lib/dates.ts` formats calendar dates without viewer-timezone drift, sorts dates, converts departures in Europe/London, selects the next ride, and calculates elapsed countdown time.
- The fixed February timer has been removed from `utils.js`, which retains only theme behavior. The new countdown uses one interval, reselects at departure, and catches up on visibility/pageshow events. Departure means strictly future: at the exact start instant, it selects the next dated ride or shows TBD/zeros. Missing start times default to 09:30. Spring-skipped London times are rejected; autumn-repeated times use the first occurrence.
- `npm.cmd run validate:data` validates all current and archived entries in `public/data/longer-rides.json`. Production builds run it automatically. Regular Rides remain defined directly in `RideDiary.astro`; their calendar-only JSON was not used by the visible diary and has been removed. The Longer Ride entry template remains. `npm.cmd test` exercises schema and date logic using Node's test runner (Node 24 recommended).

## Verification

See [VERIFICATION.md](VERIFICATION.md) for the latest complete-page comparison results and limits.

`baseline/src/` is a migration comparison copy based on the original source. The abandoned calendar has also been removed from this copy so it can still build without FullCalendar. The remaining comparison copy uses Vite 5.4.21, Bootstrap 5.3.8, and the same Sass compiler as the Astro project. Its configuration copies runtime assets and skips imagemin optimization to compare original image bytes. It is not an untouched original archive or a verified copy of the deployed live site; the original repository is separate and unchanged.

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

`QA_PACKAGE_ROOT` can point to an existing node_modules directory containing Playwright. Otherwise the browser script resolves a locally installed Playwright package. Install Playwright separately if needed. Full-page screenshots and JSON results are written to ignored `artifacts/parity/`; the earlier prototype evidence remains under `artifacts/`. Browser checks use isolated headless Edge profiles and block Google Tag Manager requests. They do not interact with a personal browser profile. Use `scripts/verify-full-browser.mjs` for complete-page browser checks.

## Next stage

Longer Rides now group Destination, Distance, and Departure Time above the guidance-only timing note, followed by Overall Time and Ride Time. Optional `rideTime` is a readable cycling-time estimate excluding stops (for example `"2-3 hours"`) in `public/data/longer-rides.json`; omitted values display **TBC**. The layout applies to current and archived Longer Rides, and leaves Regular Rides, Where To Next, and calendar displays unchanged. See LONGER-RIDES-LAYOUT.md for validation and the updated comparison workflow.

The typed data/shared date layer and countdown fix are implemented, and the abandoned calendar has been removed. Next prepare release configuration: production metadata/static verification files, analytics, repository-prefix deployment, and a live-site comparison. Further legacy-module conversion and other audited cleanup items remain separate milestones. See DATA-AND-DATES.md for the earlier behavior-change evidence.

Calendar-removal checks: all 13 unit tests, ride validation, Astro diagnostics, production build, and comparison-copy build passed. The complete pre-cleanup comparison covered all 213 screenshots at five widths without layout exclusions (195 exact, 18 differing by at most one 8-bit colour level per channel). Navigation, carousel/autoplay, FAQ/overview accordions, ride groups/archives, photo dropdowns, and three-timezone countdown/error handling passed. Generated evidence is under `artifacts/calendar-removal/` and `artifacts/countdown/`. Built JavaScript reduced from 296,084 to 93,160 bytes; actual ride data and templates were preserved. Historical evidence in ignored artifacts and the separate original repository are not deleted by this cleanup.
