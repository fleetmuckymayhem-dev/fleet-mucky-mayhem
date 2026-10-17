# Complete component migration verification — 17 October 2026

This records the component-extraction milestone. The subsequent typed-content/countdown changes and latest test results are recorded in [DATA-AND-DATES.md](DATA-AND-DATES.md).

Later cleanup: the abandoned calendar was removed from both the application and migration comparison copy. Calendar and untouched-baseline statements below describe the earlier milestone, not the current code.

The page now composes every visible section, navigation, and footer from Astro templates. Raw HTML fragment imports have been removed. Styles, assets, browser behavior, and the original disabled calendar are preserved.

## Results

- Astro check: **0 errors, 0 warnings, 0 hints**.
- Astro 7.4.0 production static build: **passed**.
- Comparison baseline: original source at `7c284bb`, built with Vite 5.4.21.
- Headless Microsoft Edge comparisons at **390, 768, 1399, 1400, and 1440px**: **passed**. The final two adjacent sizes exercise the Bootstrap xxl navigation/carousel-column breakpoint.
- **213 screenshot pairs**: **193 pixel-identical**, including all five full-page captures. The remaining **20 differ by at most one 8-bit colour level per channel**. No pixel exceeds that tolerance; no screenshot dimensions differ.
- Every section and footer matched in initial rendered element structure (tag, ID, classes), normalized text, dimensions, link destinations/targets, image dimensions, alt text, and image-load state.
- **No page JavaScript exceptions, application console errors, or failed local HTTP resources** were observed during the tested interactions.
- No horizontal page overflow was observed in either build at the tested widths.
- Original repository remains unchanged (`git status --short` empty).

## Interaction coverage

At each width, in both builds:

- Every visible navigation anchor reached its original fragment. Below 1400px, the menu opened and closed on selection. Footer return-to-top also worked.
- All six carousel slides were traversed using next, including wrapping back to the first. Previous wrapping, direct indicator selection, and matching custom indicator state passed. Representative changed slides were captured.
- All four visible What We Do accordion answers and all thirteen FAQ answers were opened using keyboard Space, captured, and closed. Expanded ARIA state and one-open-answer behavior passed.
- Regular Rides, Longer Rides, and 2025/2024 archived rides selected the expected group. Each group was captured collapsed and with its first detail expanded. Opening a second item closed the first.
- All three photo-year dropdowns opened, contained the original Box link destinations, and closed with Escape. External destinations were inspected rather than opened.

Original 3-second carousel autoplay was tested separately, without the screenshot-only interval override, and advanced to the second slide in both builds.

## Conditions and limits

Screenshots used the same browser/environment, 900px viewport height, scale factor 1, fixed date/time of 1 February 2026 at 12:00 UTC, reduced motion, and disabled transitions/animations. All images, including lazy images, were loaded before capture, and fonts were awaited. Carousel autoplay was delayed only in the screenshot harness to stabilize captures; real autoplay received a separate check.

The one-level screenshot tolerance was introduced after inspecting the twenty non-identical pairs: their maximum channel difference was exactly 1/255 or less, with unchanged DOM and geometry. Raw difference counts and channel maxima are retained in the report rather than silently treating these as exact matches. These observations are consistent with compositor/gradient rounding; that cause is an inference.

This comparison uses the original source snapshot, not a verified production deployment. Both builds use original image bytes; the baseline omits native imagemin optimization and uses the same Sass compiler as the Astro build. Google Tag Manager requests were blocked during browser checks, and production analytics are absent from Astro's local layout.

The calendar remains commented out as it is in the original, so its modals, filters, recurrence, and iCalendar export are not release-verified. The countdown is compared at one fixed time; competing timers and date/time-zone boundary behavior remain separate corrective work. Expanded detail screenshots cover the first ride in each category, not every individual ride. External URLs were preserved but their availability was not verified. These checks do not establish universal pixel equality, performance improvement, or a completed production release.

Build output still includes Sass deprecation notices from unchanged `lighten()`/`darken()` calls. These are deferred maintenance, not build failures.

## Evidence and reproduction

- `artifacts/parity/browser-results.json`: initial section inventories and browser results.
- `artifacts/parity/captures.json`: manifest of all 213 compared states.
- `artifacts/parity/visual-results.json`: exact difference counts, channel maxima, and pixels exceeding tolerance.
- `artifacts/parity/baseline-*.png`, `astro-*.png`, and `diff-*.png`: captures and raw difference images.
- `scripts/verify-full-browser.mjs`: browser assertions and capture harness.
- `scripts/compare-screenshots.py`: image comparison, with a one-channel-level tolerance and explicit exact counts.
- `README.md`: installation, local preview, baseline, and reproduction commands.

## Next stage

Introduce typed ride/event schemas and shared date helpers, then fix the countdown's competing updates in a separate behavior change with date-boundary checks. Before production release, validate deployment paths, metadata/static verification files, analytics, and the live-site baseline. Re-enabling the calendar requires its own acceptance checks.
