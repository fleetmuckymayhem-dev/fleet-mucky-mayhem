# Website code review - 5 November 2026

The local technical review passed after the fixes below. Production and staging builds complete, the unit suite passes, and no unexpected browser errors were observed in the tested scenarios. This is a bounded technical result for the reviewed working tree.

**Follow-up, 6 November 2026:** Martin authorised committing and pushing these fixes. The reviewed source was committed as `bcc32ce`. The later [functional scope decisions and seasonal follow-up](readiness-checklist.md#functional-scope-and-release-decisions--6-november-2026) supersede the indefinite seasonal fallback described below; the dated evidence in this report retains its original scope.

## Candidate and evidence

- Shared source: /home/martin/projects/fleet-mucky-mayhem, branch docs/local-readiness.
- Starting commit: 0018af932b69ef33b3a2c209dc28756b7e7ab79b. The review changes are local and uncommitted.
- The earlier human acceptance applies to its recorded candidate. These code changes have fresh technical evidence; no new physical-device or final client acceptance is claimed.
- The existing untracked Andy editing-guide draft was preserved.
- Exact source hashes for 75 website, build, workflow and test files are in artifacts/code-review-2026-11-05/source-manifest.json. Manifest SHA-256: 45c32c48b747e4c224a367627be49cbcd77c68ab833d152c0c692d8b87df6204.
- Local logs, browser records, screenshots, dependency audit and before/after bundle measurements are retained under artifacts/code-review-2026-11-05/. This ignored evidence directory is separate from the later handover source-file list.

## Findings and fixes

| Finding | Resulting behaviour |
| --- | --- |
| A global .active selector could remove the active About Us carousel slide when no navigation link was active. The separate scroll script selected a .section class absent from the section markup. | Navigation changes only its own links, tracks actual target sections on scroll, and sets aria-current. Scroll updates are scheduled once per animation frame. |
| Mobile navigation simulated a toggler click based on display state, including the desktop layout. | The mobile menu closes through Bootstrap Collapse only when expanded on mobile. Focus returns from a hidden link to the menu button. |
| Manual ride-panel class changes conflicted with Bootstrap transitions. Rapid clicks reproduced two open panels. | Regular and generated ride groups declare data-bs-parent. Bootstrap owns open/close state, with a transition guard and cleanup for repeated group switches during opening or closing. |
| Carousel indicators were updated separately on clicks and completed transitions. Controls lacked accessible names. | Completed slide transitions own indicator state. Previous/next and numbered photo controls have accessible labels and current-state markup. |
| Valid optional ride fields could display undefined, missing photo URLs could become broken links, and a meeting-point note disappeared when there was no map URL. | Unknown details display TBC, omitted departure time uses 09:30, missing photo links show a message, and meeting-point notes remain visible. Plain fields render as literal text while author-written guidance and notes retain their supported HTML. |
| Ride URLs and map paths were only checked as nonempty text; route-map existence was not checked at build time. | External ride links require HTTPS, route maps use image filenames under img/ride-maps/, and builds reject missing supplied map files. Historical single-item URL arrays still normalize correctly. |
| The browser loaded all Bootstrap modules plus an unused theme-storage script and broken duplicate scroll handler. Retired featured-ride markup and styles remained. | Only carousel, dropdown and collapse controls load. The unused scripts, commented featured-ride block, its unused styles/font request, and empty layout migration comments were removed. |

## Leaner output

Aggregate generated assets from the same local production build settings:

| Asset | Before, bytes | Reviewed, bytes | Reduction |
| --- | ---: | ---: | ---: |
| JavaScript | 94103 | 66456 | 29.4% |
| CSS | 234244 | 232418 | 0.8% |

The JavaScript gzip estimate changed from 28097 to 21943 bytes, calculated locally with the same compressor. This is an asset-size comparison; it does not claim a measured improvement in page-load timing.

## Verification

| Check | Result |
| --- | --- |
| Node/npm environment | WSL Node 24.22.1 / npm 11.19.1 |
| npm run check | 0 errors, 0 warnings, 0 hints |
| npm test | 19 passed, 0 failed |
| npm run build | Passed, including ride/photo validation and map-file checks |
| npm run build:staging with the rehearsal site origin | Passed at the configured Pages subdirectory |
| npm audit --json | 0 vulnerabilities, including development dependencies |
| Missing-map rejection | Passed in an isolated fixture; actual programme data was preserved |
| Browser matrix | Windows headless Edge 156.0.4314.58; production and staging at 390, 768, 1399, 1400 and 1440 pixels |
| Main interaction matrix | All navigation links, scroll highlighting, carousel/indicators, four What We Do panels, all 13 FAQs, seven Regular Ride panels, all 31 archived rides, current/archived Photos controls and keyboard dismissal |
| Transition regressions | Rapid panel clicks, resetting groups, repeated group selection during transitions and deliberate reopening passed |
| Optional-data fixture | Missing optional values, literal angle brackets/quotes, HTML notes/guidance, meeting-point notes without map URLs, and blocked localStorage passed |
| Assets and runtime | No broken rendered images, duplicate live IDs, horizontal overflow, unexpected console/page errors, failed requests or HTTP errors in the main matrix |
| Existing focused browser suites | Countdown, ride rollover, Photos and General Info suites passed against both builds |
| Time and failure cases | Three visitor timezones; UK clock changes covered by units; departure rollover; empty, future and TBD programmes; future archive years; photo-year rollover; malformed data and simulated HTTP failures |
| Development runtime | Astro dev page and mobile navigation passed; touching Hero.astro without changing content caused the expected source-watch page reload, with no browser errors |
| Workspace hygiene | git diff --check passed; temporary development and browser servers stopped |

Intentional failure fixtures log their expected data-loading diagnostics. They produced no unhandled page exceptions. The normal matrix observed no console errors.

## Walkthrough alignment

The canonical JSON, presenter guide and learner reference now use the shared FMM-Dev project instead of the retired P: prototype. The navigation example matches the scoped helper, and the maintenance notes explain the map-file build check.

Current exports:

- [Reviewed PowerPoint](../website-code-walkthrough/fleet-mucky-mayhem-code-walkthrough-reviewed-2026-11-05.pptx)
- [Matching reviewed PDF](../website-code-walkthrough/fleet-mucky-mayhem-code-walkthrough-reviewed-2026-11-05.pdf)
- [Presenter guide](../website-code-walkthrough/presenter-guide.md)
- [Learner reference](../website-code-walkthrough/learner-reference.md)

The 27-slide / 90-minute content verifier passed. PowerPoint package/layout checks and first-party reimport passed. The two changed slide layouts were inspected individually, the complete deck was visually scanned, unchanged slide text was preserved, speaker notes matched the canonical source, and all 27 PDF page images matched the reviewed slide renders. The unversioned October exports are retained as historical references.

## Reproduce the checks

From the shared project in its documented WSL Node environment:

```bash
npm run check
npm test
npm run build
FMM_STAGING_SITE=https://fleetmuckymayhem-dev.github.io npm run build:staging
node docs/website-code-walkthrough/verify-walkthrough.mjs
npm audit
```

The combined browser runner serves both built folders on temporary localhost ports and closes them on completion:

```powershell
$env:QA_PACKAGE_ROOT = 'C:/Users/marti/.cache/codex-runtimes/codex-primary-runtime/dependencies/node'
node scripts/verify-code-review.mjs
```

QA_PACKAGE_ROOT points to a separately installed Playwright package. The runner defaults to Edge; QA_BROWSER_CHANNEL can select another installed Chromium channel. The Node/npm application checks and builds run in WSL; the separate Windows browser tooling reads and serves their completed output.

## Coverage limits and ongoing maintenance

- This pass exercised Edge with desktop and emulated narrow viewports. The earlier recorded physical-phone and other-browser checks remain evidence for the earlier source. This pass does not claim a new Safari, Firefox or physical-device run.
- External Box/map/WhatsApp/email destinations were checked in the earlier guided session. This review verifies their rendering and interaction wiring; visitor permissions and destination content can change independently.
- The Midwinter Celebration fallback remains the agreed, explicitly coded 1 December 2026 event. It needs a deliberate seasonal content update.
- Guidance and notes remain trusted, repository-authored HTML. This workflow assumes code/content review before publication.
- Fonts and icons still depend on external services; they loaded successfully during the browser matrix.
- Destination-account setup, remote client acceptance and IONOS cutover remain later stages in the agreed handover sequence.
