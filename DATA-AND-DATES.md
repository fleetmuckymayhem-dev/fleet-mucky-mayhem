# Typed content and countdown milestone

Implemented 17 October 2026. No HTML, Sass, fonts, content files, or original-repository files were changed.

## Changes

- Runtime-validated TypeScript models for longer/archived rides, calendar index entries (single and recurring), event details, and meet points. Validation covers dates, times, required fields, duplicate IDs, year consistency, recurrence, and optional field types. Build validation also checks index/detail references and matching schedules.
- Historical single-item URL arrays are normalized to strings without mutating input JSON; multiple-item values are rejected. No content rewrite was needed.
- A shared promise cache loads and validates JSON once per page. The ride diary and countdown share a request; failures are evicted so a later request can retry. Calendar loaders use the same pipeline, but its hidden UI remains outside this milestone's browser coverage.
- Shared calendar-date formatting/sorting and London departure conversion. Display dates retain the original DD-MMM-YY format without the prior possibility of shifting a day for visitors west of UTC.
- One typed countdown controller replaces both legacy timer implementations. The theme module no longer writes countdown values. The controller reselects after a departure and refreshes on visibility/pageshow, including after tab suspension. Repeated initialization stops the previous interval; asynchronous generations cannot install a stale second interval.

## Explicit behavior decisions

Ride start times belong to Europe/London, not the viewer's local timezone. Missing times default to 09:30. At the exact departure instant, a ride is no longer upcoming, so the next dated ride is selected; when none remains the existing TBD/zero presentation is used. The countdown uses actual elapsed seconds across UK daylight-saving transitions. A spring-skipped wall time is invalid; an autumn-repeated wall time selects the first occurrence. These decisions affect data/timing behavior, not the design.

The real data currently ends on 17 October 2026. Browser rollover tests add a test-only December ride to exercise advancement; actual-data tests separately verify TBD at the final departure. Tests never write that fixture to public content.

## Verification

- Unit tests: **12 passing** (date formatting, invalid dates/times, GMT/BST, 23/25-hour transition days, skipped/repeated times, selection/expiry, sorting/TBD, schemas, URL normalization, request deduplication and retry).
- Data validation: **31 rides and 29 index entries**, plus all associated detail files and index/detail schedule consistency, pass.
- Astro diagnostics and production static build pass. Production builds validate content automatically.
- Countdown browser checks pass in **Europe/London, America/Los_Angeles, and Asia/Tokyo**: two seconds before departure, next tick, exact departure rollover, one countdown interval, one shared ride request, and no JavaScript exceptions.
- Actual-data last-departure/exhausted schedule, empty schedule, invalid data, and HTTP 503 scenarios produce TBD/zero/fallback-map state without uncaught exceptions.
- Full regression checks pass at **390, 768, 1399, 1400, and 1440px**, covering the existing navigation, carousel/autoplay, overview/FAQ answers, ride groups, and photo dropdowns. The UK reference timezone is explicit in both builds because foreign-zone countdown differences are intentional corrections.
- Final rebuilt-page run: **213 screenshot pairs, 185 exact and 28 within one 8-bit colour level per channel**, with no pixels exceeding that tolerance. Structure, content, links, and section dimensions also match under the fixed UK reference date. Exact-match counts can vary slightly between runs because of low-level rendering rounding; raw per-capture results are retained.

Evidence: `artifacts/countdown/browser-results.json`, `artifacts/parity/browser-results.json`, `artifacts/parity/visual-results.json`, and the paired screenshots. Run commands are in README.md. `ASTRO_QA_URL` and `BASELINE_QA_URL` can point the browser harnesses at dedicated preview ports when the user's development server is already running.

## Remaining scope

No deployment or analytics changes were made. Calendar rendering/export timezone behavior remains legacy and is not claimed as verified. Additional navigation logic corrections, full legacy-JavaScript typing, and production release checks remain separate work. Runtime validation failure preserves the diary's static fallback and uses TBD in the next-ride panel; build validation prevents publishing those malformed files through the normal build command.
