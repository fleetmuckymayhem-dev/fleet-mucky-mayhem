# Final local acceptance readiness

Verified 5 November 2026. **Ready to begin final local acceptance with Martin and Ines; not yet approved for creating the clean handover copy or publication.** No new website defect was established in this review. The existing Contact Us QR fix is included and reverified. The tested website is unchanged. The acceptance candidate adds reviewed documentation and matching release/undo PDFs; see [version record](acceptance-version.md).

## Source and scope

- Tested source: **`b12fc29e5ca3cf037af597e747d47edd23484569`**, “Fix Contact Us QR proportions and responsive layout”.
- Available checkout: `/home/martin/projects/fleet-mucky-mayhem`, branch `docs/local-readiness`, tracking `origin/docs/local-readiness`. It was clean before this review. `origin` fetch/push is `https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem.git`; no `client` remote exists here.
- Recorded client staging baseline: `origin/staging` at `1bad312fe06e266ab6b2e2ef5335f717edbc4d79`. At website-test time the branch was two commits ahead: local-readiness documentation and the QR fix. Website differences from that baseline are confined to `ContactUs.astro` and its stylesheet. No checkout switching, reset, fetch, merge or remote mutation was performed.
- **Workspace alignment resolved by Martin:** Martin, Ines and Lleizar now share this existing FMM-Dev checkout. Martin verified branch `docs/local-readiness`, website commit `b12fc29`, pending documentation and acceptance evidence. The P: checkouts are reference copies only; no independent reconciliation or development there is required for acceptance. See [shared-workspace instructions](shared-workspace.md). The older `astro-prototype` was not used as a baseline.
- A temporary source snapshot was extracted with `git archive HEAD` into `/tmp/fmm-acceptance-source`, without copying installed dependencies or generated builds. This is a disposable verification fixture, **not** the final handover folder. No repository was initialised and no existing Git history was removed.

## Reproducibility and checks

The documented Linux/WSL toolchain, Node **24.22.1** and npm **11.19.1**, plus committed `package-lock.json` v3 were sufficient for fresh installation and both builds. The lockfile resolves public npm-registry packages; no private registry or application build secret was required. Direct dependencies are exact versions. There is no `.nvmrc`, `engines` or `packageManager` enforcement: use the documented versions rather than assuming older Node will execute the TypeScript test/validation commands. CI currently selects Node major `24`, not an exact patch/npm version. The tested platform is Linux; native Windows installation is not certified.

| Check on fresh source | Result |
| --- | --- |
| `npm ci` | Passed, 281 packages installed; no manifest/lockfile changes. |
| `npm audit --json` | Passed, zero vulnerabilities including development dependencies, as reported on this date. |
| `npm run check` | Passed: 41 files, zero errors/warnings/hints. |
| `npm test` | Passed: **18 individual tests**, zero failed/skipped. |
| `npm run build` | Passed, validates 31 rides and three photo years, creates production `dist/`. |
| `FMM_STAGING_SITE=https://fleetmuckymayhem-dev.github.io npm run build:staging` | Passed, separate staging output with `/staging-fleet-mucky-mayhem/` asset prefix. |
| HTTP/file verification | Production **27/27**, staging **28/28** files returned 200 and matched disk bytes; both JSON files matched source bytes. |
| Indexing | Staging has `noindex, nofollow`; production has no staging robots meta tag. Neither build contains `CNAME`. |

The restricted runner initially reported only three test-file wrappers; the test command was repeated with subprocess access and confirmed all 18 named cases. Audit network resolution and loopback servers also required sandbox escalation and then succeeded. npm retains its existing `@parcel/watcher` install-script-policy warning; builds passed without changing script approval policy. Hot reload/watch operation was not tested.

## Built-site browser coverage

Headless Chromium via externally installed Playwright 1.64.1, served on loopback only: production port 4348, staging port 4347 under its actual subdirectory. Phone testing here means **simulated viewport testing**, not a physical phone or a claim about Safari/iOS/Android browsers.

- Production and staging smoke checks at 390px and 1440px: every navigation destination, all images loaded, ride JSON loaded, programme placeholder, archive selection, Photos controls, no observed browser console errors, uncaught exceptions, failed requests, local HTTP errors or horizontal overflow.
- Production: archives **2026, 2025 and 2024**, all 31 ride titles/destinations/notes and expected counts matched source data; General Info panels opened.
- Existing Photos verification: all labels/destinations match JSON, current and archive menus, every photo-year control, keyboard Space/Enter/Tab/Escape, focus restoration on Escape, outside-click dismissal, menu bounds/scrollability and UK year rollover across London/Los Angeles/Tokyo timezones.
- Existing ride-rollover verification: Regular/Longer/Archived modes, all archive years, one expanded panel, empty 2027 message and celebration image, populated future programme, TBD ordering, a newly added archive year, unique IDs, empty programme and failed JSON responses. Fixtures were browser-intercepted; published JSON was not edited.
- Existing countdown verification: three timezones, departure rollover, one timer/shared request, valid upcoming ride and route/map visibility, exhausted/empty programme celebration fallback, malformed data/HTTP failure TBD fallback. Expected diagnostic messages for injected failures are separate from normal-load browser errors.
- Existing General Info verification: supplied/missing/escaped ride times, preserved overall/departure/map content, archive coverage, unchanged regular rides and table bounds at phone/desktop widths.
- Supplementary keyboard/responsive check at 390px, 768px and 1440px in both builds: menu toggler and first navigation link, every Regular Ride and all 13 FAQ panels using Enter/Space, Longer/archive keyboard selection, contact hrefs/focusability, QR proportions, no overflow or console/page errors. The harness waits for Bootstrap transitions before the next key; initial rapid-transition timeouts were harness issues, not confirmed website defects.
- The mobile menu closes after keyboard activation; Chromium then reports focus on `BODY`. Check the next Tab/Shift+Tab position and focus visibility during human acceptance; no promise of focus moving to the destination heading is made.
- Production full-page screenshots at phone/desktop widths were visually inspected: readable stacked sections, programme fallback, photo artwork, FAQ layout, contact QR and desktop columns. This is a visual review, not client content approval or a full accessibility audit.

The supplemental run completed all six viewport/build assertions and wrote its result JSON, but the process ended with status 143 during browser shutdown. Its pass lines support the individual checks; this is not recorded as a clean process exit.

QA reused existing scripts, with temporary copies selecting installed Chromium in place of their hard-coded Edge channel. No QA dependency was added to the application. Logs, screenshots and the supplemental scripts are saved in Git-ignored `artifacts/final-local-acceptance/`. Browser tooling and shared libraries from `/tmp/fmm-browser-qa` and `/tmp/fmm-browser-libs` must be supplied separately on a new machine. The staging browser command is:

```bash
QA_PACKAGE_ROOT=/path/to/browser-tools QA_BROWSER_CHANNEL=chromium \
STAGING_QA_URL=http://127.0.0.1:4347/staging-fleet-mucky-mayhem/ \
node scripts/verify-staging.mjs
```

## External destinations and permissions

Read-only unauthenticated GETs checked **55 unique HTTPS destinations**, extracted from generated homepage anchors and both ride/photo data files: **all returned HTTP 200** after redirects. Inventory/results are in [external-destinations.json](external-destinations.json). Breakdown: 43 Box shares, four Google Maps links, two Total Women's Cycling articles, WhatsApp, four sponsors and one Relive recording. Relive redirects from `relive.cc` to `relive.com` successfully.

No definite broken HTTP link was found. **Folder permissions/content are unconfirmed:** all 43 Box responses have a generic “Box” title; HTTP availability does not prove that actual photos/statistics can be viewed by the intended audience. Martin/client must open every share signed out or with an ordinary intended user's account, verify the intended folder/year/ride and open a representative image/document. Record access-denied, expired, empty or wrong-folder results before approval. Login text on WhatsApp, Strada and Relive is not by itself evidence of a broken link.

No WhatsApp group was joined, message/email sent, or external account changed. Confirm the invite still reaches the correct group, scan the QR with a physical phone, and test that `mailto:fleetmuckymayhem@gmail.com` opens the right address in the user's configured mail application. Map destination correctness and sponsor relevance require human confirmation.

## Portability for the later clean copy

| File/setting | Configure or confirm for the final destination |
| --- | --- |
| `.github/workflows/staging.yml` | Exact repository guard `fleetmuckymayhem-dev/fleet-mucky-mayhem`, `staging` trigger, `FMM_STAGING_SITE`, preview summary URL, source-version evidence, deployment-secret scope. Leave unchanged during this review. |
| `scripts/publish-client-staging.sh` | Exact source-repository/ref guard, SSH destination `fleetmuckymayhem-dev/staging-fleet-mucky-mayhem`, target branch `main`, generated-files-only publication, host-key verification and `CNAME` guard. |
| `.github/workflows/check.yml` | Rehearsal `FMM_STAGING_SITE`, Node/npm policy, destination branch checks. No production workflow currently exists. |
| `astro.config.mjs`, `scripts/build-staging.mjs` | Staging origin defaults to Martin's historical account unless overridden. Staging base path is hard-coded and build validation expects that path. Change both together if the final preview repository has another name. |
| GitHub Pages | Decide source/generated repository names and Pages publication method for the new client account. Existing rehearsal uses generated repository `main` at root, no custom domain. Recreate permissions/protections, collaborators, independent reviewer, release approver and recovery/support ownership on the actual destination. These settings do not travel with source files. |
| Secrets | New destination-specific `FMM_STAGING_DEPLOY_KEY` private key in Actions, matching scoped public deploy key on the publishing repository, if retaining this publisher. Never copy personal Git credentials, `.env`, SSH keys, caches or tokens into the handover. Existing Actions secrets are not in source and will not migrate with a file copy. |
| `scripts/publish-staging.ps1` | Historical Martin-account publisher. Do not use for final publication; retire or replace deliberately in the handover version. Browser scripts also default to historical local ports/Edge and need QA tooling. |
| Production URLs/indexing | Current production build assumes root deployment. A project Pages remote-UAT URL needs its repository prefix; use the staging build or intentionally configure a matching UAT base. Keep remote UAT `noindex`. For eventual custom-domain production, rebuild at `/` with staging disabled and verify images/JSON/fonts/navigation plus removal of `noindex`. Do not reuse staging-generated HTML as production. |
| Domain/identity | No `CNAME` shipped; do not add one before cutover agreement. Confirm `fleetmuckymayhem.com`, bare/www redirects, HTTPS and recovery plan later while preserving email. Review the inherited Bing verification tag in `SiteLayout.astro`; it is a public ownership token, not a private secret. Confirm contact mailbox, WhatsApp ownership, Box shares and artwork rights remain client-controlled. |
| Handover documents | Replace rehearsal account/repository/preview paths, machine-specific folder examples and historical version links where they are active instructions; label retained rehearsal records clearly. Keep new repository provenance/approved-source mapping in the handover record without importing old Git history. |

Tracked filenames and content were checked for obvious private-key/token/environment files; no obvious committed private credential was identified. This bounded review cannot certify all historical Git objects or external account access. The later handover must use an approved source-file list and omit `.git`, `node_modules`, `dist`, `.astro`, `artifacts`, local environment files and machine credentials. Preserve the original checkout/history independently.

## Documentation reconciliation

README, readiness checklist, local-readiness record, staging setup, update/publish and undo Markdown guides now state the agreed five-stage sequence and label rehearsal evidence. Completed PR/deployment/device-exercise records are preserved. No current Markdown instruction to rename a Martin-owned repository or transfer ownership later was found; these routes are now explicitly superseded so earlier off-repository plans cannot be mistaken for the agreement.

**Matching PDF revisions completed in this acceptance candidate:** `update-preview-publish.pdf` and `undo-release.pdf` were regenerated from the revised Markdown guides, rendered to page images and visually inspected. See the [version and PDF verification record](acceptance-version.md). The code walkthrough PDF/PPTX and supporting JSON/notes concern code rather than deployment, but should receive a consistency review for checkout names, retired tooling and destination references before final handover. The code-walkthrough binaries were not edited or fully inspected in this review; their consistency review remains pending.

## Joint acceptance and results

Use the short [Martin and Lleizar acceptance session](acceptance-session.md). It separates agent checks from human checks and includes results tables for each acceptance item, all 43 Box shares and all four map destinations. Human checks remain pending until Martin reports device/browser, result, issue and date. The earlier Notes-exercise device acceptance is historical and does not approve this candidate.

Before creating the clean handover copy: complete local acceptance and resolve/document permission/content issues, approve and freeze an exact source version, agree the separate laptop folder and included source files, and review the remaining code-walkthrough guides. Workspace alignment is complete and the two release/undo PDFs now match. **Do not create the copy in this stage.** At the later authorised stage, initialise fresh history only in that copy and fully retest it before publishing to the new client account. Destination configuration and remote acceptance then precede the separately agreed IONOS-domain cutover.
