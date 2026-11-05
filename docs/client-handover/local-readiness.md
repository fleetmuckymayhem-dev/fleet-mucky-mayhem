# Local development and testing readiness

Fleet Mucky Mayhem | Verified 5 November 2026 | **Local development can continue**

The final destination GitHub account and repositories are not available. Destination branch protection, account ownership, independent reviewers and the named client release approver are **deferred pending availability**, not blockers to local development. Account/admin coordination and protection implementation have stopped. No production release or cutover is authorised.

## Checkout and preserved work

Working checkout: `/home/martin/projects/fleet-mucky-mayhem` in WSL/Linux, user `martin`. Local branch: `docs/local-readiness`, created from fetched `origin/staging` at `1bad312fe06e266ab6b2e2ef5335f717edbc4d79`. The checkout was clean before switching. The existing `maintenance/dependency-audit-cleanup` branch remains at `dbdd02671781050e052edd0f3ca3608d1ed0c7e6`; its application source, public files, dependency manifests, scripts and tests match this staging baseline. No unfinished work was discarded. No applicable `AGENTS.md` was found in the project or ancestors.

Git identity remains Martin Ferrero-Thompson. The configured `origin` still points to `fleetmuckymayhem-dev/fleet-mucky-mayhem`; that existing repository and its historical staging setup are not confirmation of the eventual destination. Remote refs were fetched for an accurate local baseline; no push or settings change followed the local-only instruction. Neither `main` nor `staging` was merged or rewritten.

PR [#5](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/5) remains an unmerged future protection proposal at reviewed commit `2857436c85b15abf65f7ed423c3cc650bd5aad94`. PR [#6](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/6), containing preparation and dependency records, was opened immediately before the local-only instruction and was also left unmerged. No further remote mutations were made. Those materials are preparation for eventual destination review, not prerequisites for local work.

## Actual local results

| Verification | Result |
| --- | --- |
| Supported toolchain | Node **24.22.1**, npm **11.19.1**, from the Linux nvm installation; matches the documented setup. |
| Clean installation | `npm ci` succeeded: 281 packages installed, 282 audited. No dependency or lockfile edits. |
| Current dependency audit | `npm audit --json`: **0 vulnerabilities**, including development dependencies. This is the registry result on this date, not a future guarantee. |
| Code checks | `npm run check`: **0 errors, 0 warnings, 0 hints**, 41 files. |
| Unit tests | `npm test`: **18 passed**, 0 failed/skipped. |
| Production build | `npm run build`: passed; generated local static `dist/`. No deployment. |
| Local staging build | `FMM_STAGING_SITE=https://fleetmuckymayhem-dev.github.io npm run build:staging`: passed; output in `artifacts/staging-site/`, correct subdirectory asset prefix and `noindex, nofollow`. The existing site value is a build fixture, not a destination selection or publication. |
| Data validation | 31 rides and 3 photo years validated during both builds. |
| Local served files | Production: **27/27** files; staging: **28/28** files returned HTTP 200 and matched on-disk bytes. Both builds' ride and photo JSON matched source bytes. |
| Staging browser smoke test | Existing `scripts/verify-staging.mjs` passed at **390px and 1440px** using headless Chromium. Images, navigation, Longer Rides/2027 placeholder, 2026 archive, Photos menus, indexing tag and no horizontal overflow checked. |
| Production browser verification | Both widths passed the equivalent smoke checks plus all archive years **2026, 2025, 2024**, expected ride counts, every archived title/destination/note, exact served ride JSON and opening a ride's General Info panel per year. Production HTML has no staging indexing tag. |
| Browser diagnostics | No observed console errors, page exceptions, failed requests or local HTTP errors in either two-width smoke test. |
| Screenshot inspection | Mobile and desktop production screenshots reviewed; mobile Contact Us image distortion identified below and reproduced on staging. |

npm reports `@parcel/watcher@2.6.0` has an install script not covered by its `allowScripts` policy. `npm install-scripts ls` confirmed the notice. No script approval or policy change was made. Installation, code checks, tests and both static builds passed with the existing policy. Long-running development/watch behavior was not exercised in this review.

## Preview method and evidence

Both previews were served only on loopback using `scripts/preview-snapshot.mjs`: production on port 4348, staging on 4347 under `/staging-fleet-mucky-mayhem/`. These temporary verification servers were stopped after testing. Browser tooling was reused from `/tmp/fmm-browser-qa` (Playwright 1.64.1), with cached Chromium and previously downloaded local shared libraries under `/tmp/fmm-browser-libs`. No browser dependencies were added to the application or installed system-wide. This external QA tooling is environment-specific and must be supplied again on a new machine.

Logs, supplemental verification scripts, screenshots and contact measurements are retained locally in `artifacts/local-readiness-2026-11-05/` (Git-ignored). Key files: `install.log`, `audit.json`, `check.log`, `tests.log`, `production-build.log`, `staging-build.log`, `staging-browser.log`, `production-browser.log`, `local-files.log`, `contact-results.json`, `production-390.png`, `production-1440.png` and `contact-{production,staging}-{390,1440}.png`. These are fresh local results; earlier deployed evidence in the readiness checklist remains historical.

For routine local work, use the Linux terminal in the project root: `npm run dev` for editing and `npm run preview` after a production build. The staging build command above prepares files without calling a publisher. Never run publisher scripts as part of local verification.

## Gaps and recommended next local task

**Next task: fix the mobile Contact Us layout and recheck it locally.** At a 390px viewport the QR image's natural size is 450 × 604px, but it renders at **20.125 × 400px** in both builds. At 1440px it renders at approximately **298 × 400px**. The image loads successfully; HTTP and no-overflow checks therefore do not detect this visual defect. `ContactUs.astro` uses two unqualified Bootstrap `.col` elements and `src/scss/pages/contact-us.scss` fixes image height at 400px. Review responsive stacking and proportional sizing, then verify contact links and the complete QR artwork at mobile/tablet/desktop sizes. This review documents the issue without changing application code.

Remaining acceptance coverage: physical phones/tablets and desktop browsers beyond this Chromium run; keyboard/focus behavior and wider accessibility review; every FAQ and regular-ride interaction; external link destinations, WhatsApp access and shared-folder permissions; and development-server/watch behavior under the current install-script policy. No claim of full website acceptance or destination readiness is made. The empty 2027 programme is the current data state, not a rendering failure.

## Deferred destination setup

When the final account and repositories are available, separately confirm the owner-controller identity, Andy's individual GitHub login, the named client release approver and independent review availability. Reassess the proposal against that destination, rehearse its protections without deployment capability, and only then apply and verify controls. Existing source/publishing repositories and automation were left unchanged.

Production automation, release/undo deployment rehearsal and cutover remain separate future work. No GitHub settings, staging automation, hosting, IONOS, domain, DNS, email or certificate changes were made in this local review. No commits were pushed, PRs merged, websites published or production operations performed after the local-only instruction.
