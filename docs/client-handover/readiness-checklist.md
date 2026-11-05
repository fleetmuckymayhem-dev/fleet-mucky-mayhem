# Readiness before production cutover

Fleet Mucky Mayhem | 23 October 2026; dependency task updated 5 November 2026

Carried forward from [documentation PR #2](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/2), commit `01e0c06a0c105fec93b503cbb13e386735d41735`, because this checklist was absent from staging. Only the dependency task below is updated here; the other dated status records remain as supplied by that PR.

## Agreed boundary

The existing client website continues to run on IONOS. Leave its deployment, hosting, domain, DNS, redirects, email records and certificates unchanged while we build, test and document the replacement.

The production cutover is a separate future task. Completing this checklist is evidence for a readiness review, not permission to switch the live website. The client must explicitly authorise a cutover plan and timing. The client remains responsible for merging approved production releases once that process is installed and rehearsed.

## Confirmed so far

- [x] Public client source repository: https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem, with permanent `main` and `staging` branches.
- [x] Public generated staging repository: https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem, with Martin added as collaborator.
- [x] Client development environment: Windows VS Code → WSL Ubuntu 24.04, Linux user `fmmdev`, project `~/projects/fleet-mucky-mayhem`, Node 24.22.1 and npm 11.19.1.
- [x] Client local checks: zero diagnostics, all 18 tests passed, and a successful static production build.
- [x] PR checks on GitHub Ubuntu: code check, tests, production build and staging build all passed for [setup PR #1](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/1).
- [x] Dedicated deployment key installed: public key on the staging publishing repository; private key in the source repository's `FMM_STAGING_DEPLOY_KEY` Actions secret.
- [x] First automatic staging publication succeeded: [source workflow](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/39934925112), source commit `057d65de1f160cc6cba398f268e7539b7d1f7336`.
- [x] GitHub Pages enabled from the staging publishing repository's `main` branch, root folder, without a custom domain. [First Pages deployment](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem/actions/runs/39935780700) succeeded and the client confirmed the page is visible.
- [x] Initial browser smoke check of [staging](https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/): homepage renders, Longer Rides shows the 2027 coming-soon message, the 2026 archive loads, an archived ride expands with its details, and current/archive photo menus open. This is not the full browser acceptance test.
- [x] Initial live HTTP check: all 28 published files checked returned HTTP 200, the staging subdirectory asset prefix and `noindex, nofollow` tag were present, and `staging-version.json` matched source commit `057d65de1f160cc6cba398f268e7539b7d1f7336`. No source/dependency folders or production `CNAME` were found in the publishing repository. HTTP availability does not prove image rendering or external link permissions.
- [x] Local publisher integration: first publication, unchanged files, updates, obsolete-file removal and branch/missing-secret/custom-domain guards passed against a temporary local Git repository.

## Complete before the readiness review

- [x] Resolve and recheck dependency audit findings: fresh audit found three affected packages (one high, two moderate): `vite-baseline`/Vite 5.4.21, nested esbuild 0.21.5 and fast-uri 3.1.8. Retired the historical comparison build and updated transitive fast-uri to 3.1.9. Full audit now reports zero vulnerabilities, including development dependencies. Clean install, code check, 18 tests, both builds and local staging browser verification passed. See [cleanup evidence and limits](dependency-security-cleanup.md). Review and acceptance of this change remain pending; no merge or deployment is authorised by these checks.
- [ ] Configure branch protection and required PR checks on `staging` and `main`; confirm the client can approve and perform the intended release merge without bypassing protections. Keep both branches permanent and retain merge commits for releases.
- [ ] Verify all staging assets, images and JSON load at the correct subdirectory, with no JavaScript errors. Confirm `noindex, nofollow` and that `staging-version.json` matches the successful source workflow.
- [ ] Complete phone and desktop testing of navigation, all Ride Diary modes and archive years, Photos controls, FAQs, contact links, external destinations and shared-folder permissions. Include real devices and keyboard use; record browsers, sizes, results and any known limitations.
- [ ] Rehearse a small requested update through a change PR, checks, staging deployment, client testing and approval of a specific version.
- [ ] Prepare and validate the production build configuration and proposed deployment workflow without deploying to the production domain or changing IONOS. Rehearse release and undo in an isolated test destination, then record the evidence and recovery steps.
- [ ] Review the existing site's required behaviour/content with the client and record acceptance of the replacement.
- [ ] Record the named client release approver, support channel/contact, account ownership and recovery arrangements. Store credentials and recovery codes outside the public repository.
- [ ] Finalise the illustrated update/publish and undo guides, keeping Markdown and PDF copies consistent with the rehearsed workflow. The current printable versions describe a planned production process.
- [ ] Review a proposed future cutover and recovery plan, including any domain verification, HTTPS, bare/www redirects and preservation of email records. Planning does not authorise applying those changes.

## Separate production go-ahead

Once the readiness work is complete, present the results and remaining limitations to the client. Agree the exact cutover changes, who performs them, timing, verification and recovery plan. Obtain explicit authorisation before touching the current IONOS deployment or any domain/DNS settings. Record that authorisation separately from approval of an individual staging change.

After the separately authorised cutover, routine production publication will follow [Update, preview and publish](update-preview-publish.md): support prepares and checks the release PR, the client approves and merges it, and support verifies the published result.
