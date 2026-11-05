# Contact Us QR image — local fix and verification

Fleet Mucky Mayhem | 5 November 2026 | Local branch `docs/local-readiness`

Readiness documentation was preserved first in local commit `9150c97aae65661e9c50fc47668d8f8949536e86`. This follow-up fixes only Contact Us image sizing, responsive columns and location-independent wording, with documentation/evidence updates. No dependency, image asset, link destination, workflow or remote setting changed. PRs #5 and #6 were untouched.

## Reproduction and cause

The QR artwork's natural size is **450 × 604px**. The previous two Bootstrap `.col` elements competed for space at 390px: the image column measured 44.125px including padding, leaving only **20px** of content width. The computed image size was **20.125 × 400px**, `max-width: 100%`, `object-fit: fill`. The stylesheet fixed height at 400px while width remained constrained by the column, distorting the aspect ratio by about 93%. HTTP loading and horizontal-overflow checks still passed.

## Change

Both columns now use `col-12 col-lg-6`: stacked below 992px and equal side-by-side columns on desktop. `g-4` gives 24px spacing between stacked columns; desktop keeps vertical centering. The image has `width: 100%`, `max-width: 298px`, `height: auto`, block display and centered inline margins. Its existing desktop size is retained, it can shrink with its container, and HTML width/height attributes record the natural 450:604 proportions. The text now says **“or scan the QR code.”**

## Measurements in both local builds

Production and staging gave the same results at each viewport. Column content widths exclude padding; image dimensions are browser bounding-box measurements.

| Viewport | Before: available width / rendered image | After: available width / rendered image | After layout |
| --- | --- | --- | --- |
| 390px | 20px / 20.125 × 400px | 334px / 298 × 399.969px | Stacked, 24px gap |
| 768px | 320px / 298 × 400px | 664px / 298 × 399.969px | Stacked, 24px gap |
| 1440px | 620px / 298 × 400px | 620px / 298 × 399.969px | Equal columns, vertically centered |

The after-fix aspect-ratio error is under 0.01% (subpixel rounding). All three requested sizes fit the image and text within their columns, with no horizontal page overflow. Computed paragraph sizes are at least 16px. Both WhatsApp links and the email link remain visible, focusable, within the viewport and point to their original destinations. The complete QR artwork, contact text, spacing and desktop balance were inspected in screenshots. External WhatsApp membership, email delivery and physical-device QR scanning were not exercised.

## Before/after screenshots and measurements

Representative production screenshots are committed below; all six staging screenshots and verification logs/scripts are also retained locally under Git-ignored `artifacts/contact-qr-fix-2026-11-05/`.

| Width | Before | After |
| --- | --- | --- |
| 390px | [Before](contact-qr-fix/before-390.png) | [After](contact-qr-fix/after-390.png) |
| 768px | [Before](contact-qr-fix/before-768.png) | [After](contact-qr-fix/after-768.png) |
| 1440px | [Before](contact-qr-fix/before-1440.png) | [After](contact-qr-fix/after-1440.png) |

Detailed browser measurements, computed styles, column/link bounds and diagnostics for **both builds at all three widths**: [before results](contact-qr-fix/before-results.json), [after results](contact-qr-fix/after-results.json).

## Validation performed

- `npm run check`: 41 files, zero errors, warnings or hints.
- `npm test`: all 18 tests passed.
- `npm run build`: passed, including source-data validation (31 rides, 3 photo years).
- `FMM_STAGING_SITE=https://fleetmuckymayhem-dev.github.io npm run build:staging`: passed, including the staging prefix/indexing guard. This existing site value is a local build fixture, not destination setup or publication.
- Local static previews served on loopback ports 4351 (production) and 4352 (staging subdirectory). Headless Chromium via external Playwright 1.64.1 checked each build at 390px, 768px and 1440px. Assertions covered natural proportions, container fit, stacking/gap, desktop alignment, readable text sizes, unchanged link targets, visibility/focus, viewport bounds, horizontal overflow and browser/request errors. All six after-fix scenarios passed with no observed console errors, page exceptions, failed requests or HTTP errors.
- Before/after screenshots recorded at all six build/viewport combinations; production screenshots visually inspected at every requested width.
- Documentation links and `git diff --check` passed. Temporary preview servers stopped after testing.

Physical devices, additional browser engines and the remaining broader acceptance checks in [local readiness](local-readiness.md) are still future work. No push, merge, publication, GitHub settings, existing staging automation, hosting, IONOS or DNS change was performed.
