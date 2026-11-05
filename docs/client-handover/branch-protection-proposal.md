# Branch protection proposal and implementation record

**Approved for implementation — not applied; owner-assisted rehearsal pending** | Fleet Mucky Mayhem | 5 November 2026

This records the approved proposal and implementation progress for the [client source repository](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem). The user has authorised rehearsal, protection work and staging documentation merges after reporting Lliezar’s approval of PR #5 at `2857436c85b15abf65f7ed423c3cc650bd5aad94`. This authorisation does not permit a main merge or production work. The [readiness task](readiness-checklist.md) remains open. Production automation, cutover, IONOS, hosting, DNS, domains, email and certificates remain outside this task.

## Implementation progress — 5 November 2026

**Incomplete: owner/admin participation and human identities are pending.** No rule IDs exist from this implementation attempt because no rules have been created. PR #5 remains open at its reviewed commit, with successful [Check, test and build](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41986286666/job/127107663256), auto-merge disabled, and no formal reviews or comments recorded on GitHub at reinspection. Lliezar’s independent review is recorded as reported by the user, not represented as a GitHub qualifying review.

Both original and isolated checkouts were clean; refreshed remote staging/main still point to `1bad312fe06e266ab6b2e2ef5335f717edbc4d79` and `18a38c3e574bc2df489434c853b488a408a2facb`. Both report unprotected. Ruleset listing including parents and both effective branch-rule endpoints again returned empty arrays. Merge settings are unchanged from the snapshot below. Both connector and CLI authenticate as Martin, with write access and no admin permission; the collaborator inventory still contains only Martin and the owner. Existing work and the reviewed proposal branch were preserved; preparation uses a separate descendant branch, `docs/branch-protection-implementation`.

The owner-controller identity, Andy’s GitHub login and the named client release approver cannot be established from current repository records. They have been requested separately, along with participation from the owner’s own signed-in session. No collaborator contact, invitation, review request, permission change, account switch or credential sharing was performed. Main activation remains conditional on confirming the independent reviewer arrangement.

Prepared an [owner-assisted rehearsal kit](branch-protection/README.md), four exact-target rule payloads (two fixture and two permanent), and a reproducible local fixture. Ran the fixture builder successfully at `/tmp/fmm-protection-fixture-20261105` from pinned staging `1bad312`. The generated tree has no Git metadata/remote, no publisher workflow or publisher scripts, only the PR check workflow with fixture-only base filters, a deterministic failure switch, read-only token permissions and no secret references. JSON parsing and offline checks confirmed exact targets, empty bypass lists, history rules and context/provider ID 15368. Fixture check-workflow SHA-256: `184cab4670958be44167c4072f81dbdcc462675f4fac96718304e12046a38fb3`. These are preparation results, **not GitHub enforcement tests**. Payloads have not been submitted to GitHub or server-validated.

| Verification | Actual result / remaining dependency |
| --- | --- |
| Current access, permanent refs, rulesets and merge settings | Re-read successfully; no change from initial audit |
| Existing PR check name/provider and check success | Verified PR #5 success; original check-run provider is GitHub Actions app 15368 |
| Isolated fixture and payload preparation | Completed locally; nothing published to fixture branches |
| Required check failing/passing and merge gating | Not executed against enforced rules; owner must create temporary rules |
| Independent approval, self-approval rejection and stale dismissal | Not rehearsed; requires owner and second account participation |
| Conversation resolution and strict current-base gating | Not rehearsed; requires enforced fixture rules |
| Merge-method and force-push/deletion/direct-push enforcement | Not rehearsed; permanent branches were never used for destructive probes |
| Staging protection / main protection and rule IDs | Neither applied; no rule IDs; owner required, main additionally awaits identities |
| Protected merge of PR #5 and staging publication | Pending successful rehearsal and staging activation; PR deliberately left unmerged |
| Readiness completion | Unchecked until both branches and intended human workflow are verified |

Continue using the kit once the owner participates. The approved settings below remain the implementation specification; they are not final effective settings. Do not claim the historical snapshots or offline payload checks establish enforcement. No repository settings, deployments or permanent branch heads changed during this preparation.

## Evidence and access limits

Read-only GitHub REST inspection on 5 November 2026, authenticated as `Martin-Ferrero-Thompson`, confirmed:

| Area | Observed result |
| --- | --- |
| Repository | Public, owned by personal account `fleetmuckymayhem-dev` (`User`), default branch `main`. This is not an organization. |
| Permanent branches | `staging`: `1bad312fe06e266ab6b2e2ef5335f717edbc4d79`; `main`: `18a38c3e574bc2df489434c853b488a408a2facb`. Both branch objects report `protected: false`. |
| Classic protection | GET `/branches/staging/protection` and `/branches/main/protection` each returned HTTP 404. Alone this would not establish absence: the inspecting account lacks administration permission. Together with `protected: false`, the evidence indicates neither branch currently has effective protection. Inactive or nonmatching classic definitions were not enumerated; owner confirmation remains necessary. |
| Rulesets, including parents | GET `/rulesets?includes_parents=true` returned HTTP 200 with `[]`; GET `/rules/branches/staging` and `/rules/branches/main` each returned HTTP 200 with `[]`. No repository or inherited rulesets or effective rules were exposed. There is no organization parent for this personal repository. |
| Merge settings | `allow_merge_commit`, `allow_squash_merge`, `allow_rebase_merge`: true. `allow_auto_merge`, `allow_update_branch`, `delete_branch_on_merge`: false. |
| Collaborators (all pages) | `Martin-Ferrero-Thompson`: `write`, push true, admin/maintain false. `fleetmuckymayhem-dev`: `admin`, push/admin true. Individual permission endpoints confirmed both roles. No third collaborator was listed. |
| Recent work | PRs [#2](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/2) and [#4](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/4) were authored and merged by Martin into `staging`. PR #4's reviews endpoint returned an empty list. This does not demonstrate client formal-review practice. |
| Existing required-check candidate | Actual check-run name **`Check, test and build`**, GitHub App **GitHub Actions**, slug `github-actions`, app ID **15368**. Successful [PR check run](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/41983404109/job/127098466890) at `2e348b505e8da57fee2349b3f5b68982a59bf0a0`. |

`.github/workflows/check.yml` names the workflow `Website checks`, job ID `check`, display name `Check, test and build`. It runs on PRs targeting both permanent branches, without path filters, and performs clean install, diagnostics, tests, production build and staging build. The required context is the actual check-run name above, not the workflow name or combined UI label. `.github/workflows/staging.yml` publishes only after a push to source `staging`; its post-merge `publish` check must not be required on a PR. Requiring it would wait for an event that cannot happen before merging. No production workflow is present in the inspected staging tree.

The owner's public profile does not expose its billing plan (`plan` unavailable); no paid subscription is claimed. Public-repository branch rulesets and classic protection are available on GitHub Free, so the proposed branch controls do not require a paid upgrade while this repository remains public. Recheck eligibility before changing visibility. See [GitHub ruleset availability and administration](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository).

The connector and CLI both identify Martin. He can push change branches, submit qualifying reviews of someone else's PR and merge eligible PRs, but cannot administer rules with the observed access. The owner can do those things and administer settings. Installed-app, deploy-key and private account recovery inventories were not audited; do not infer that only the two listed humans have every possible access path. No credentials or recovery material were inspected.

## Recommended configuration

Use **two branch rulesets**, with explicit branch targets, rather than adding overlapping classic rules. Names: `Protect staging` and `Protect main`; target `branch`, include respectively `refs/heads/staging` and `refs/heads/main`, no exclusions. Approved target enforcement: **Active**, after successful rehearsal; main additionally requires confirmed independent reviewer identities. Active rulesets layer with classic rules and other rulesets; all must be inspected again before implementation. See [GitHub rule layering](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

| Setting | `staging` | `main` | Reason |
| --- | --- | --- | --- |
| Require a pull request | On | On | Record changes and prevent ordinary direct pushes. |
| Required status check | `Check, test and build`, `integration_id: 15368` | Same | Bind the existing check to GitHub Actions; do not accept any provider. |
| Require branches up to date | On (`strict_required_status_checks_policy: true`) | On (same) | Test against the current target; refresh and rerun if the base moves. |
| Required approving reviews | **0** | **1** | Support can publish a preview without waiting for a client code review; a release needs the other account's formal approval. Two approvals are infeasible with only two accounts. |
| Dismiss stale approvals | Off | On | No required approval on staging; changed release content needs another review. |
| Require approval of latest reviewable push | Off | Off | Avoid an extra last-pusher constraint in a two-account team; main already dismisses stale approvals. Support should push release fixes before the client reviews. |
| Require conversation resolution | On | On | Resolve review threads before merging; this does not prove website acceptance. |
| Require Code Owner review | Off | Off | No verified independent code-owner arrangement; avoid another unavailable reviewer requirement. |
| Restrict deletions | On | On | Keep permanent source branches. |
| Block force pushes | On | On | Preserve release and revert history. |
| Bypass actors | Empty | Empty | Owners and administrators follow normal gates too; no standing emergency bypass. |
| Allowed PR merge methods | Merge, squash, rebase | **Merge only** | Keep everyday change flexibility; retain release merge commits for the documented undo. |
| Restrict updates / creations | Off / Off | Off / Off | Restrict updates would block ordinary merges without a bypass, defeating this workflow. Existing branches need no creation restriction. |
| Linear history / signed commits / deployment prerequisites / merge queue | Off | Off | Linear history conflicts with release merge commits; the other prerequisites are not installed or rehearsed. |

Rule semantics and per-branch merge methods are described in [GitHub's available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets). Keep repository-wide merge commits enabled, squash/rebase enabled for staging, auto-merge disabled, and automatic head-branch deletion disabled. Leave `allow_update_branch: false`; support can update a head branch locally through the normal PR process. There is no need to change repository-wide merge settings with this ruleset design.

Strict checks on `main` have a workflow cost: after a release or undo, `main` may have commits absent from `staging`. Reconcile `main` into `staging` through a checked PR, never rewrite either permanent branch. That staging merge republishes the preview and changes its source SHA; finish synchronization **before** the final acceptance record. Freeze the accepted staging head for the release, and recheck/reaccept if it changes. A successful PR check is separate from a successful staging deployment.

## Human acceptance, reviews and merge permissions

- **Website acceptance:** a named client tests the deployed preview and records its `staging-version.json` source SHA, deployment/run reference, scope and results. A message or PR comment can record acceptance; it is not a GitHub approving review.
- **Formal review:** an eligible account selects Approve and submits a review on the PR. Authors cannot approve their own PRs. Main needs one qualifying review by the other write/admin account; later changed content invalidates it. See [GitHub approving reviews](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews).
- **Merge permission:** write/admin access permits merging once gates pass. Approval does not grant write access or make the client the only person technically able to merge. Personal-repository collaborators have broad write permissions; see [GitHub personal-repository permissions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/permission-levels-for-a-personal-account-repository).

The README names **Andy** as the client's developer. Neither the collaborator list nor public owner profile establishes whether Andy controls `fleetmuckymayhem-dev`, uses a separate account, or is the named client release approver. Confirm that mapping and the client's release authority before implementing the one-review main gate. Do not share account credentials or assume two people using one login constitute independent reviewers.

| Scenario | PR author | Formal approving reviewer under proposal | Intended merger |
| --- | --- | --- | --- |
| Support change into staging | Martin (`Martin-Ferrero-Thompson`) | None required; owner may review voluntarily | Martin, after CI and resolved threads; then preview acceptance by client |
| Andy change into staging, **if Andy owns the client login** | `fleetmuckymayhem-dev` | None required; Martin can review | Martin/support after CI; client acceptance follows deployment |
| Release staging → main | Martin | `fleetmuckymayhem-dev`, **if confirmed as authorised client representative** | That client owner account, after separate production authorisation |
| Support-prepared undo branch → main | Martin | Authorised client owner account | Client owner account |
| Client-prepared emergency undo branch → main | Client owner account | Martin | Client owner account |

If Andy uses a different unlisted login, his qualifying review and merge access are **not established**. If the owner is unavailable, Martin cannot approve his own release or undo. If Martin is unavailable and the owner authors the undo, there is no verified independent reviewer. Do not set two required approvals or assume a third reviewer exists. If independent staging review is explicitly desired, the material alternative is one approval on staging too, accepting that every Martin-authored preview then waits for the owner. No collaborator invitations, role changes or review requests are part of this task.

Native branch rules target the **destination**, not a required PR source branch. Require ordinary production release PRs to originate from this repository's `staging` by the release checklist; these proposed rules cannot enforce that, nor can they require that the approving reviewer is specifically the client. An undo intentionally comes from a revert branch, consistent with [Undo a release](undo-release.md). A future source-check workflow would need an explicit reviewed undo exception and separate authorisation; none is added here. Likewise, both listed accounts technically retain merge permission on main. Client-only release merging is a procedural commitment with this personal-repository model. If technical client-only merge or named-client approval enforcement is mandatory, resolve that access-model decision before implementation rather than claiming this proposal provides it.

Use **Create a merge commit** for releases and undos into main. GitHub's [Revert procedure](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request) creates another PR to reverse a merge commit; conflicts can require support. Do not impose staging-only source enforcement that prevents that recovery route.

## Ordered implementation plan — authorised, prerequisites pending

1. Martin obtains independent review of this proposal. Confirm Andy's login, the named client release approver, reviewer availability, and acceptance of the procedural limits above. Record contact/recovery ownership without publishing private recovery information. Production remains on hold.
2. The owner (`fleetmuckymayhem-dev`, admin) re-reads current branch metadata, classic rules and rulesets, including inherited/overlapping definitions, merge settings and collaborators. Save a nonsecret before-state and rule identifiers. Martin's current write role cannot apply this plan.
3. Rehearse the proposed controls on temporary branches or an isolated test repository as below. Use the actual accounts, with no shared credentials. Confirm the check name/provider appears in the selector; refresh a PR check if necessary. Do not replace it with the post-merge publisher.
4. After approval and successful rehearsal, the owner creates the two exact-target rulesets with the table values and empty bypass lists, then activates them in an agreed maintenance window. Change no unrelated settings. Re-read effective rules on both branches and check for conflicts. An admin must remain available for recovery.
5. Use the proposal PR or a later genuine staging PR to inspect the real merge gate without merging a dummy change. Record rule IDs, evidence, accounts and limitations. Mark the readiness task complete only after intended users and gates are verified. Any eventual production workflow, release/undo deployment rehearsal and cutover require their own authorisation.

## Safe verification plan — not executed by this investigation

Perform behavioral testing against temporary targets whose names match neither permanent branch and trigger no deployment, or an isolated test repository. Temporary rules must explicitly mirror each proposed ruleset, targeting only the test branches; their creation is future settings work requiring owner approval. If using the source repository, its existing workflow does not run on temporary base branches: add the same check workflow for those targets only in the isolated test history, without merging it into staging/main, or use a test repository. Do not use `workflow_dispatch` as proof of a PR-event check.

1. Confirm the fixture has no publishing workflow, production secrets or deployment destination. Use both actual accounts; record base/head SHAs and check-run app ID.
2. Open a test PR with an intentionally failing check, confirm mergeability is blocked, then push a correction and confirm `Check, test and build` from app 15368 succeeds. A missing or wrong-provider result must not satisfy the required context. If wrong-provider testing cannot be performed safely, record that part as configuration inspection only.
3. With the main-equivalent gate, confirm passing CI without another account's approval remains blocked and the author cannot approve it. The other account approves: inspect that merge is available, **do not merge**. Push a content change; verify the old approval is dismissed and fresh approval/checks are needed.
4. Open a review thread and verify an unresolved conversation blocks merge until resolved. Advance the temporary base with a separate test commit and verify strict up-to-date gating; synchronize the test head, rerun checks and reapprove as needed.
5. With the staging-equivalent gate, verify Martin can reach merge-ready with passing checks, resolved conversations and zero approvals. For the main-equivalent fixture, verify the owner can reach merge-ready on Martin's PR and Martin can review an owner-authored undo-shaped PR. Inspect merge-only availability for main's fixture.
6. Test direct-push rejection, force-push rejection and deletion rejection **only on expendable fixture branches**, including the owner with the empty bypass list. Record exact outcomes. Never attempt these operations against permanent branches; a dry-run push alone is not proof of server enforcement.
7. On real staging/main, inspect effective rules and a genuine PR's checks/review/merge state without merging it. This establishes targeting plus rehearsed behavior, not proof of a completed production deployment. Close unused fixture PRs; clean up temporary branches/rules only after their scope is checked and cleanup is authorised. Keep both permanent branches intact.

## Recovery if legitimate work is blocked

First inspect the failing requirement: exact check context/provider, pending/failed run, stale base, missing independent approval, unresolved thread or conflicting rule. Prefer fixing the PR, rerunning the existing check or obtaining the eligible review. Do not remove gates to work around ordinary failures.

For a confirmed misconfiguration or urgent authorised undo with no available independent reviewer, the **client owner only** may make the smallest time-limited rule change after explicit client authorisation naming the PR, reason and permitted action. Record the before-state, scope and expiry in the PR/incident record; keep force-push and deletion blocks, avoid direct pushes, and never treat this as production cutover permission. Restore and re-read the original rules immediately after the authorised operation and obtain retrospective independent review. There is no standing bypass actor. An empty bypass list does not remove the owner's ability to edit rules. If owner access is unavailable, support pauses the blocked merge and uses the privately held account recovery process; no credentials or recovery codes belong here.

## Initial investigation and documentation validation

The original checkout was clean on `maintenance/dependency-audit-cleanup` at `dbdd026`; its `.git` directory is read-only. Its branches and unfinished-work state were preserved. Work used an isolated clone at `/tmp/fmm-branch-protection-review`: fetched, switched to `staging`, and pulled with `--ff-only`; staging was exactly `1bad312fe06e266ab6b2e2ef5335f717edbc4d79`, satisfying the required ancestry check without divergence. Created `docs/branch-protection-proposal` from that tip. Original Git author identity was inspected and reused for this documentation commit. No applicable `AGENTS.md` was found in the checkout or ancestor directories.

Read README, readiness checklist, update/publish, undo, staging setup and current PR/publisher workflows. Reviewed the two-file documentation diff, Markdown links and whitespace. Existing PR CI remains required to run for this proposal; no dependencies, application code, workflow files or PDFs are changed. Behavioral verification above is a future plan, not a claim that rules have been applied or tested. This task changes neither repository settings nor deployments and opens only an unmerged proposal PR into staging.
