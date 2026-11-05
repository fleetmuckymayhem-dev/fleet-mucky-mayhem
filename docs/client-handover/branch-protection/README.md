# Owner-assisted protection rehearsal

**Prepared; GitHub rehearsal not executed.** These files implement the approved proposal as reviewable inputs. All four JSON payloads specify **active** enforcement: posting one changes settings immediately. Do not post permanent-branch payloads before successful rehearsal; main also requires a confirmed independent reviewer arrangement.

## Participants and prerequisites

The authenticated agent is `Martin-Ferrero-Thompson` (write, not admin). The source owner `fleetmuckymayhem-dev` must operate from their own signed-in session. Confirm the person controlling that login, Andy's login and the named client release approver separately. Use individual credentials. User-reported approval by Lliezar at PR #5 commit `2857436c85b15abf65f7ed423c3cc650bd5aad94` authorises this work; it is not a GitHub review by a verified eligible client account.

Before any rule POST, owner checks `gh api user --jq .login` and `gh api repos/fleetmuckymayhem-dev/fleet-mucky-mayhem --jq .permissions.admin` locally. Expect their own authorised owner identity and `true`. Save current rulesets, branch rules and merge settings as nonsecret evidence. Recheck that no overlapping rule has appeared. No permission changes are needed or authorised.

## Prepare the fixture

From a clean checkout containing the pinned staging commit, run:

```bash
python3 docs/client-handover/branch-protection/prepare-fixture.py /tmp/fmm-owner-rehearsal
```

The destination must not exist. This only creates local files: no Git metadata, remote, publishing workflow, publisher scripts or credentials. It preserves the existing PR check and both builds, changes its PR targets to the two expendable branches, removes manual dispatch and adds a failure-switch step. Its token is read-only and checkout does not retain credentials. It does not reference secrets. `npm ci` needs ordinary package-download access. Do not copy `.git`, credentials, environment files, Actions secrets or a publishing workflow into the fixture.

Only the owner should now initialise this directory as a new Git repository, commit the fixture tree with their own identity, and add the client source repository remote. Publish **only** these two new branches from the fixture root, before applying the temporary rules:

- `rehearsal/2026-11-05/staging`
- `rehearsal/2026-11-05/main`

Do not push `main`, `staging`, tags or all branches. These fixture branches have isolated root history. Every fixture PR head must descend from this fixture root, never from a normal source branch, so no publisher workflow is reintroduced. Confirm the remote fixture tree has only `.github/workflows/check.yml` and no publisher scripts before opening PRs. The source repository's permanent staging push trigger does not match these names; the fixture PR workflow has no deployment action or credential. No changes are made in the generated-file repository.

## Apply only temporary rules and rehearse

Using the owner session, from the documentation checkout:

```bash
gh api --method POST repos/fleetmuckymayhem-dev/fleet-mucky-mayhem/rulesets --input docs/client-handover/branch-protection/rehearsal-staging.json
gh api --method POST repos/fleetmuckymayhem-dev/fleet-mucky-mayhem/rulesets --input docs/client-handover/branch-protection/rehearsal-main.json
```

Record each response's `id`, exact targets and settings. Stop on errors; do not repeatedly create duplicate rulesets. These payloads target only the two rehearsal branches, not permanent branches. Retrieve the returned rule IDs and effective branch rules to verify the server accepted all parameters. Offline JSON checks do not prove API acceptance or enforcement.

Martin fetches the fixture root into a separate checkout and opens PRs into each fixture base. The owner uses their own account for independent reviews and the owner-authored undo-shaped PR. Follow the detailed [behavioral verification plan](../branch-protection-proposal.md#safe-verification-plan--not-executed-by-this-investigation), recording evidence in the implementation record:

1. Add an empty tracked `FIXTURE_EXPECT_FAILURE` file on a candidate branch to cause a real failing PR job. Verify merge blocked. Remove it in a new commit; verify the exact check and app ID, then inspect merge readiness.
2. Test missing independent review, self-approval rejection, owner approval, changed content dismissing approval, and fresh approval. Never approve as a different person using the same login. Inspect readiness without merging the fixture PR.
3. Add an inline review thread; inspect blocked state, resolve it, and inspect readiness again. Test stale base by advancing the expendable base via a separate checked fixture PR if necessary (a fixture-only merge is permitted); never merge to a permanent branch for this test. Recheck current-base CI and required reapproval.
4. Inspect permitted merge methods and the zero-review staging gate. Test direct update, non-fast-forward update and deletion rejection only on expendable bases, as both Martin and owner. Use actual server operations, not just dry runs. Keep local backups of the fixture refs; any unexpected acceptance affects expendable history only and is a failed rehearsal to investigate.
5. If wrong-provider simulation is unavailable, explicitly record provider binding as API/configuration inspection, not a performed spoofing test. Capture check URLs, PRs, head/base SHAs, review/thread states and rejection messages without credentials.

Rules prevent fixture branch deletion too. After recording results, the owner removes only the temporary rule IDs, closes remaining fixture PRs and deletes only their expendable refs. Never weaken permanent protections as fixture cleanup.

## Apply permanent rules and finish staging work

After successful staging rehearsal, the owner posts `protect-staging.json` using the same POST endpoint above. Record its returned ID and re-read effective rules. **Only after successful main rehearsal and identity/reviewer confirmation**, post `protect-main.json`. Do not activate main based solely on proposal approval or the existence of two accounts. Main activation does not authorise merging into main.

Use [PR #5](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/5) as the genuine staging change: verify unchanged reviewed head, current-base CI, required provider and resolved threads under effective staging protection; merge it normally, without bypass or auto-merge. Follow `Publish staging`, then the generated repository's Pages run. Fetch the public preview's `staging-version.json` and match its commit/run to the new staging merge, recording those links and the result. A merge alone does not establish publication.

Rebase or merge current staging into the follow-up documentation branch if needed, without rewriting permanent history. Record actual rule IDs/settings/results and publish that record through a checked staging PR. Merge the record PR through the same protected process and verify its staging publication. Leave protection unchecked until both branches and the intended human workflow are verified. Keep production, IONOS and all domain/DNS work untouched.

If a rule blocks legitimate work, follow the [approved recovery procedure](../branch-protection-proposal.md#recovery-if-legitimate-work-is-blocked). Rule editing requires the owner's participation, not credential sharing or elevating Martin's permissions.

API fields were checked against [GitHub REST ruleset documentation](https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset); creation permission and availability against [GitHub ruleset administration](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository). The server response and behavioral rehearsal remain authoritative.
