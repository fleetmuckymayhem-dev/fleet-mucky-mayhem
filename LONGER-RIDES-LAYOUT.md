# Longer Rides: General Info layout

Implemented 17 October 2026 from the supplied old/new layout references. Existing fonts, colours, Bootstrap tables, aligned labels/values, and map links are retained.

## Result

General Info shows Destination, Distance, and Departure Time/meeting point first. After a gap, "Timings below are for guidance only!" introduces Overall Time and Ride Time. Ride Time is estimated cycling time excluding stops; Overall Time remains the existing outing estimate. Missing cycling estimates display TBC. No estimates were invented or added to the 31 actual ride entries.

The shared renderer applies to all 11 current Longer Rides and 20 archived rides. Regular Rides, the next-ride panel, calendar UI, and countdown calculations are unchanged. Mobile retains the existing table arrangement with wrapping labels/values. No global CSS changes were needed.

## Editing content

Add optional nonempty text to a ride in `public/data/longer-rides.json`, for example:

```json
"overallTime": "4 hours",
"rideTime": "2-3 hours"
```

Omit `rideTime` when unknown; it displays TBC. Validation rejects null, numbers, empty text, and arrays. The new field is rendered as text, not HTML. The ride-entry template documents this field and now names the correct content file. Existing overall-time values remain unchanged.

## Verification

- All 13 unit tests, content validation, Astro diagnostics, and production build passed.
- Every current/archived General Info table has the expected field order, timing guidance and missing-estimate fallback at 390, 768, 1399, 1400, and 1440px.
- All existing navigation, carousel/autoplay, overview/FAQ accordions, ride-group switching and photo dropdown checks passed at those widths.
- Against the saved pre-change Astro v2.0.0 build, all 198 unchanged screenshot states passed with the existing one-level colour-rounding tolerance. Fifteen expanded Longer Ride states are intentionally redesigned and explicitly identified in `expected-changes.json`.
- Separate browser checks at 390 and 1440px verified supplied cycling-time values, text escaping, unchanged overall time, departure/meeting notes, Google Maps destinations, archive coverage, no Regular Ride table changes, and table bounds within the viewport.
- Mobile and desktop captures were visually inspected after waiting for accordion transitions to finish.

Generated evidence is in ignored `artifacts/longer-rides/`: pre-change `baseline/`, full comparisons in `parity/`, and `populated-390.png`/`populated-1440.png` with **test-only** estimates and departure notes. Those fixture values are not written to production content.

## Comparing future changes

For this redesign, the original `baseline/src/` is retained as historical migration evidence. Regression comparisons instead used the previous Astro build (Git commit `cb21ceb`) so the v2 footer and prior intentional behavior fixes were already present.

Before making a later layout change, save the current build into an ignored reference directory, then rebuild the changed code. `scripts/preview-snapshot.mjs <saved-build-directory> <port>` serves that reference. `ASTRO_QA_URL`, `BASELINE_QA_URL`, and `QA_ARTIFACT_DIR` select the comparison URLs and output directory for `verify-full-browser.mjs`. Use the same `QA_ARTIFACT_DIR` when running `compare-screenshots.py`. Run `verify-general-info.mjs` with `ASTRO_QA_URL` for populated-field checks.

Only the specific General Info tables are normalized out of the initial structural comparison; surrounding ride content and every other section remain compared. Only the fifteen named expanded Longer Ride screenshots are excluded from pixel equality; their field order/data and responsive layout receive the separate browser checks above. Raw paired screenshots remain available for review.

Later cleanup: comparisons now include the General Info tables and all 213 states by default. Set `QA_GENERAL_INFO_CHANGE=1` only to reproduce the historical pre-redesign comparison described above. The abandoned calendar has since been removed; current cleanup comparisons use an up-to-date pre-cleanup Astro build as the reference.

The TypeScript configuration excludes generated `artifacts/` so saved compiled bundles do not enter source diagnostics. Reference PNGs supplied by the user are left untracked and unchanged.
