# Dependency security cleanup

5 November 2026. Implementation evidence below records the original pre-merge handoff. Martin subsequently authorised integration and acceptance; see the outcome immediately below.

## Review and integration outcome

PRs [#2](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/2) and [#4](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/4) are merged into `staging`. Documentation overlap was resolved while preserving the client workflow and patched audit results. Independent lockfile comparison confirmed exactly 51 removed historical entries, no added packages, and fast-uri as the only retained package version change. [Combined PR checks](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41983404109) passed; the clean installation reported zero vulnerabilities, diagnostics were clear, all 18 tests passed, and both builds succeeded.

Integration `572ad64f4a1d647cdf534522191c95383a90fa01` passed [staging publication](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41983506058) and [Pages deployment](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem/actions/runs/41983554449). Its live version file matched the source SHA/run. All 29 published files returned HTTP 200; live headless Edge checks passed at 390px and 1440px, including images, navigation, ride data, Photos, indexing tag, no observed browser errors and no horizontal overflow. Later documentation-only commits may advance the published version. Full real-device acceptance of this integration remains separate. Production, IONOS, DNS, domain, email and certificates were untouched. The remaining sections preserve the original implementation evidence; their pre-merge status statements are historical.

## Starting state and findings

Clean client checkout on `staging` at `395d9c261de5696ed79ea53f62f87c54e36ed813`; refreshed `origin/staging` matched. No applicable AGENTS.md files were found. Origin is `https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem.git`. GitHub authentication was verified as `Martin-Ferrero-Thompson`; the existing Git commit identity was retained. Work branch: `maintenance/dependency-audit-cleanup`, created from refreshed staging.

Fresh `npm audit --json` before edits reported **3 affected packages: 1 high, 2 moderate**, including development dependencies. These counts describe package findings, not individual advisory counts. The previous “two findings” wording missed fast-uri.

| Dependency | Before | After | Remediation |
| --- | --- | --- | --- |
| `vite-baseline` (npm alias for Vite) | 5.4.21, high | absent | Retired migration-only build |
| nested esbuild | 0.21.5, moderate | absent | Removed with historical Vite |
| fast-uri | 3.1.8, moderate | 3.1.9 | Targeted transitive lockfile refresh |
| active Astro / Vite | 7.4.0 / 8.3.4 | unchanged | No framework upgrade needed |

Full after-audit: **0 vulnerabilities** at every severity, including development dependencies. Raw [before audit](dependency-audit/before.json), [after audit](dependency-audit/after.json), [before tree](dependency-audit/tree-before.txt) and [after tree](dependency-audit/tree-after.txt) are retained for independent review.

The current fast-uri advisories were checked: [scheme decoding](https://github.com/advisories/GHSA-w74x-v6f9-j3xg), [path equivalence](https://github.com/advisories/GHSA-xhq7-xmqj-769h), [host canonicalization](https://github.com/advisories/GHSA-wjr9-j795-jxcr) and [suffix scheme injection](https://github.com/advisories/GHSA-333x-w4r6-6crp). Their patched 3.x release is 3.1.9. The raw audit also records the historical Vite and esbuild advisory URLs and affected ranges.

fast-uri remains under `@astrojs/check → @astrojs/language-server → volar-service-yaml → yaml-language-server → ajv`. AJV 8.20.0 permits `fast-uri: ^3.0.1`; `npm update fast-uri --package-lock-only --ignore-scripts` selected 3.1.9. No direct dependency, override or forced audit fix was introduced.

## Retirement and lockfile review

Only the removed package commands/configuration used the Vite alias; the Astro build, staging build, browser scripts and CI did not. Removed `baseline/` and its two npm commands, plus obsolete ignore/type-check exclusions. Active `src/`, `public/`, ride content and visitor behaviour are unchanged.

Retained the saved-build comparison scripts: `verify-full-browser.mjs`, `compare-screenshots.py` and `preview-snapshot.mjs` also support Astro-to-Astro layout regression comparisons, documented in LONGER-RIDES-LAYOUT.md. The countdown, General Info, Photos, rollover and staging verification scripts remain. The staging verifier now accepts `QA_BROWSER_CHANNEL` (default Edge retained) and explicitly checks all navigation links, console errors and failed requests.

The lockfile contains exactly one changed package version, fast-uri 3.1.8 → 3.1.9. The other changes remove 51 historical-build package entries, including the alias, Rollup 4 and platform binaries, and nested esbuild/platform binaries. All retained package entries except the root manifest and fast-uri are identical to the starting lockfile. An unrelated optional lzma entry pruned by npm was restored before final validation. `git diff --histogram -- package-lock.json` makes this removal-heavy diff easier to inspect.

Historical reports remain milestone records. [Recovery instructions](../../VERIFICATION.md#historical-comparison-retirement) identify the full client snapshot `395d9c261de5696ed79ea53f62f87c54e36ed813`: recover with `git archive` into a separate directory, or inspect individual files with `git show <commit>:<path>`. This recovers baseline source, package manifests, scripts and committed reports. Generated ignored screenshots/reports under `artifacts/` were never in Git; existing local artifacts are preserved. The old `7c284bb` migration reference belongs to the original repository's independent history.

The readiness checklist was copied from open PR #2 at `01e0c06a0c105fec93b503cbb13e386735d41735`; only its dependency task was changed. Coordinate the overlapping checklist/staging-setup edits when reviewing PR #2; this task does not merge that PR. No matching PDF exists for the checklist or staging setup, and the update/publish, undo and presentation guides are unchanged, so no PDF regeneration is required. README explains that older walkthrough baseline references describe the archived workspace.

## Validation

Environment: supported Node **24.22.1**, npm **11.19.1**, Ubuntu/WSL. All checks below passed after the dependency changes.

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 281 installed packages; zero vulnerabilities |
| `npm audit --json` | Exit 0; zero vulnerabilities including dev dependencies |
| `npm run check` | 41 files; zero errors, warnings or hints |
| `npm test` | 18 passed; zero failed/skipped |
| `npm run build` | Static production build passed |
| `npm run build:staging` | Passed, including subdirectory and noindex assertions |
| Dependency tree / lockfile | Alias and vulnerable esbuild absent; fast-uri 3.1.9; other retained entries identical |
| Local staging browser | Passed at 390px and 1440px in headless Chromium 156: images/assets/JSON loaded under `/staging-fleet-mucky-mayhem/`; all ten navigation links, Longer Rides, 2026 archive and Photos controls worked; no console errors, page exceptions, failed requests or HTTP errors; no horizontal overflow |
| Walkthrough verifier | 27 slides, source paths, presenter guide and example data checks passed |
| Diff whitespace | `git diff --check` passed |

npm ci reports an existing npm install-script approval warning for `@parcel/watcher@2.6.0`; no approval settings were changed. The clean install and builds passed with that warning. The earlier milestone's Sass warnings were not emitted by these builds.

Browser reproduction: install Playwright externally, provide its package root in `QA_PACKAGE_ROOT`, and install its Chromium browser. Serve a temporary parent directory containing a `staging-fleet-mucky-mayhem` symlink to `artifacts/staging-site` using `node scripts/preview-snapshot.mjs <parent> 4324`. Run `QA_PACKAGE_ROOT=<external-package-root> QA_BROWSER_CHANNEL=chromium node scripts/verify-staging.mjs`. Default URL is `http://127.0.0.1:4324/staging-fleet-mucky-mayhem/`. This environment lacked browser runtime libraries; libnspr4, libnss3 and libasound2t64 were downloaded/extracted under `/tmp` and supplied through `LD_LIBRARY_PATH`, without system installation or project dependency changes.

Browser checks cover local Chromium, not real-device or live-deployment acceptance. Other readiness tasks remain unchecked. No merge, auto-merge, staging publication, production configuration, IONOS, DNS, domain, email or certificate changes were made.
