# Local readiness and future production cutover

Fleet Mucky Mayhem | Readiness reviewed 5 November 2026

## Current local scope — 5 November 2026

**Local development can continue.** The final destination GitHub account and repositories are not available. Destination protections, account ownership and release-approver configuration are deferred pending availability; they do not block local development or testing. Account/admin coordination and protection implementation have stopped. Existing staging automation and all hosting/domain settings remain unchanged.

The local checkout is on `docs/local-readiness`, based on staging `1bad312fe06e266ab6b2e2ef5335f717edbc4d79`; previous work is preserved. Fresh verification passed: clean install with Node 24.22.1/npm 11.19.1, zero audit vulnerabilities, zero code diagnostics, 18 tests, production and local staging builds, and 390px/1440px browser smoke checks. All 27 production and 28 staging files served correctly over localhost. **A mobile Contact Us QR-image distortion remains:** approximately 20px wide × 400px high at 390px. See [local results, evidence, limitations and next task](local-readiness.md). Passing automation is not full visual acceptance.

PR [#5](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/5) remains an unmerged proposal for future destination setup. Preparation PR [#6](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/6) was opened before the local-only instruction and is also left unmerged. No pushes, merges or publication form part of this local review. Historical destination/deployment evidence below is retained as history, not confirmation that the eventual destination is available.

Documentation [PR #2](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/2) and dependency cleanup [PR #4](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/4) are merged into `staging`. Their checklist overlap was resolved by retaining the patched dependency results and the client workflow guidance. Martin authorised this staging integration and checklist update on 5 November 2026; production cutover remains separate.

## Agreed boundary

The existing client website continues to run on IONOS. Leave its deployment, hosting, domain, DNS, redirects, email records and certificates unchanged while we build, test and document the replacement.

The production cutover is a separate future task. Completing this checklist is evidence for a readiness review, not permission to switch the live website. The client must explicitly authorise a cutover plan and timing. The client remains responsible for merging approved production releases once that process is installed and rehearsed.

## Confirmed so far

- [x] Public client source repository: https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem, with permanent `main` and `staging` branches.
- [x] Public generated staging repository: https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem, with Martin added as collaborator.
- [x] Development environments: the client setup uses Windows VS Code → WSL Ubuntu 24.04, Linux user `fmmdev`, project `~/projects/fleet-mucky-mayhem`. Martin's collaborator setup uses WSL `FMM-Dev`, Linux user `martin`, project `/home/martin/projects/fleet-mucky-mayhem`. Node 24.22.1 and npm 11.19.1 passed the recorded checks. These are separate checkouts.
- [x] Client local checks: zero diagnostics, all 18 tests passed, and a successful static production build.
- [x] PR checks on GitHub Ubuntu: code check, tests, production build and staging build all passed for [setup PR #1](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/1).
- [x] Dedicated deployment key installed: public key on the staging publishing repository; private key in the source repository's `FMM_STAGING_DEPLOY_KEY` Actions secret.
- [x] First automatic staging publication succeeded: [source workflow](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/39934925112), source commit `057d65de1f160cc6cba398f268e7539b7d1f7336`.
- [x] GitHub Pages enabled from the staging publishing repository's `main` branch, root folder, without a custom domain. [First Pages deployment](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem/actions/runs/39935780700) succeeded and the client confirmed the page is visible.
- [x] Initial browser smoke check of [staging](https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/): homepage renders, Longer Rides shows the 2027 coming-soon message, the 2026 archive loads, an archived ride expands with its details, and current/archive photo menus open. This is not the full browser acceptance test.
- [x] Initial live HTTP check: all 28 published files checked returned HTTP 200, the staging subdirectory asset prefix and `noindex, nofollow` tag were present, and `staging-version.json` matched source commit `057d65de1f160cc6cba398f268e7539b7d1f7336`. No source/dependency folders or production `CNAME` were found in the publishing repository. HTTP availability does not prove image rendering or external link permissions.
- [x] Local publisher integration: first publication, unchanged files, updates, obsolete-file removal and branch/missing-secret/custom-domain guards passed against a temporary local Git repository.

## Integration and deployed verification — 5 November 2026

- Combined PR checks passed at `2e348b505e8da57fee2349b3f5b68982a59bf0a0`: clean install, zero diagnostics, 18 tests, production and staging builds. [Check run](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41983404109).
- Accepted integration commit: `572ad64f4a1d647cdf534522191c95383a90fa01`. [Source publication](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41983506058) and [Pages deployment](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem/actions/runs/41983554449) succeeded. Live `staging-version.json` matched that source SHA and run ID.
- All 29 published files returned HTTP 200. Live headless Edge verification at 390px and 1440px passed: all images loaded, ride data and navigation worked, Longer Rides/2026 archive and Photos controls worked, the indexing tag was present, and no console errors, page exceptions, failed requests, HTTP errors or horizontal overflow were observed. This does not establish all external destinations, folder permissions, keyboard coverage or real-device acceptance of this new version.
- Website `src/`, `public/` and deployment workflows are unchanged by this integration. Subsequent checklist-only commits produce a new staging version; the SHA above identifies the tested website integration, not a permanently current deployment.

## Remaining local acceptance and documentation work

- [x] Resolve and recheck dependency audit findings: three affected packages (one high, two moderate) reduced to zero, including development dependencies. Retired `vite-baseline`/Vite 5.4.21 and nested esbuild 0.21.5; updated transitive fast-uri 3.1.8 to 3.1.9. Independent lockfile review confirmed 51 historical entries removed, no new packages and no unrelated retained-package changes. Reviewed, accepted and merged through PR #4; combined checks and staging publication passed. See [cleanup evidence and limits](dependency-security-cleanup.md).
- [x] Verify staging assets, images and JSON at the correct subdirectory, without observed JavaScript errors; confirm `noindex, nofollow` and matching published source version. Completed for integration `572ad64` as recorded above. Repeat after changes affecting website behaviour or build configuration.
- [ ] Fix and recheck the mobile Contact Us QR-image layout documented in [local readiness](local-readiness.md). Keep image proportions and verify mobile/tablet/desktop presentation.
- [ ] Complete phone and desktop testing of navigation, all Ride Diary modes and archive years, Photos controls, FAQs, contact links, external destinations and shared-folder permissions. Include real devices and keyboard use; record browsers, sizes, results and any known limitations.
- [x] Rehearse a small requested update: the two archived ride Notes changes passed through [PR #3](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/3), checks and staging deployment at `395d9c2`. Martin reported laptop/mobile testing across browsers and recorded acceptance on that PR. Hands-on practice with the review/merge buttons remains a training follow-up; the agent performed that merge.
- [ ] Review the existing site's required behaviour/content with the client and record acceptance of the replacement.

## Deferred destination setup — not local development blockers

- [ ] **Deferred pending destination availability:** configure and rehearse branch protection and required checks on destination `staging` and `main`. Confirm the client approval/merge workflow, permanent branches and release merge commits. Use [PR #5](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/5) as preparation, then revalidate against the actual destination. This is not a blocker to local development.
- [ ] **Deferred destination/deployment work:** prepare the production automation and isolated release/undo deployment rehearsal once the destination is available and that work is authorised. The static production and staging builds have already passed locally; this does not authorise deployment.
- [ ] **Deferred pending destination availability:** separately confirm account ownership/controller, Andy’s GitHub identity, independent reviewer availability and the named client release approver; record support/recovery arrangements privately. This is not a blocker to local development.
- [ ] Finalise the illustrated update/publish and undo guides, keeping Markdown and PDF copies consistent with the rehearsed workflow. The current printable versions describe a planned production process.
- [ ] Review a proposed future cutover and recovery plan, including any domain verification, HTTPS, bare/www redirects and preservation of email records. Planning does not authorise applying those changes.

## Separate production go-ahead

Once the readiness work is complete, present the results and remaining limitations to the client. Agree the exact cutover changes, who performs them, timing, verification and recovery plan. Obtain explicit authorisation before touching the current IONOS deployment or any domain/DNS settings. Record that authorisation separately from approval of an individual staging change.

After the separately authorised cutover, routine production publication will follow [Update, preview and publish](update-preview-publish.md): support prepares and checks the release PR, the client approves and merges it, and support verifies the published result.
