# Undo a release

> **Stage boundary, 5 November 2026:** finish local acceptance first; then prepare a separate approved source copy with fresh Git history and fully test it; then publish to a new client GitHub account for GitHub Pages remote acceptance; only after acceptance and an agreed cutover plan connect the IONOS domain. Existing `fleetmuckymayhem-dev` and Martin-account repositories/previews are rehearsals. Do not use repository renaming or a later ownership transfer as the handover route. See the [current verification and acceptance checklist](final-local-acceptance.md). No push, merge, publishing/settings change, history removal or IONOS change is authorised in this local stage.

Fleet Mucky Mayhem | Client and support guide | Revised 5 November 2026

> **Planned workflow, pending setup and rehearsal.** This page applies to the automated release process in [Update, preview and publish](update-preview-publish.md).

Report problem → prepare and check undo PR → client approval → client merge → deployment → live verification.

**Printable guide:** the accompanying PDF is generated from this Markdown guide. Both describe the future process; neither authorises a release during local acceptance.

## Your first step

Message us with the live page link, what is wrong, when you noticed it and a screenshot if useful. Include the release reference from our completion message. **Example:** “Since release #24, the ride link is wrong. Please undo that release.” A clear request to undo authorises that specific reversal. Otherwise, we confirm the proposed reversal with you first.

## What we prepare and you publish

1. **Identify the cause.** We compare the live site with the last successful deployment. A failed build may mean the new version never published. Undoing code will not repair an unrelated DNS or hosting outage.
2. **Confirm the scope.** We identify the production release PR and explain what its reversal removes. Undoing a release can remove every change in it, including correct ones. We agree whether to undo it or make a small correction.
3. **Create the undo PR.** For the identified merged PR into `main`, we use GitHub's **Revert** action to propose the reversal. Creating this PR alone changes neither the live site nor `main`.
4. **You publish the undo.** We check the undo PR and send you its link. After the required checks and reviews pass, you merge it into `main`. The configured automation builds and publishes the reversed version. Tell us when you merge it.
5. **Verify and follow up.** We check the public website, send you the result and release reference, and reconcile `staging` with the reversal. Any corrected replacement goes through staging and your approval again.

## If we are unavailable

The client account owner, or an authorised collaborator with write access, can follow the rehearsed procedure: **Pull requests**, **Closed**, open the exact production release PR, then **Revert**. Confirm the new PR targets `main` and reverses the intended release. Wait for checks and the required independent approval, then **Merge pull request** and **Confirm merge**. Keep branch protection in place. If Revert is unavailable, there are conflicts, or the scope is unclear, stop and contact technical support. GitHub describes these limitations in its [revert guide](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request).

## Completion check

Confirm the production deployment succeeded and the expected content is back at **https://fleetmuckymayhem.com**. Record the undo PR/version and tell us so we can reconcile staging before the next release. Reversal preserves history. Do not delete branches, force-push, edit the generated staging repository or change IONOS DNS to undo an ordinary website update.
