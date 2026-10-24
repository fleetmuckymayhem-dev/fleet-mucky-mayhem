# Collaborator Notes exercise

Started 24 October 2026. This exercise reproduces two already approved production Notes updates in the Astro project and ends with approval of a specific staging version.

## Scope and environment

Leave the current IONOS deployment, hosting and every domain/DNS setting untouched. Do not merge into the source repository's `main` branch or deploy production. Production cutover requires separate explicit authorisation. Do not change dependencies or run `npm audit fix`; the legacy vite-baseline/esbuild and fast-uri findings are separate work.

- WSL2 distribution: dedicated Ubuntu 24.04 `FMM-Dev`, stored at `P:\WSL\FMM-Dev`.
- Linux user: `martin`; project: `/home/martin/projects/fleet-mucky-mayhem`.
- Verified tools: Node `24.22.1`, npm `11.19.1`.
- Collaborator account supplied by the user: `Martin-Ferrero-Thompson`. Git commit identity and GitHub authentication are separate; a configured commit name does not prove push access.
- [Source repository](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem).
- [Staging publishing repository](https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem).
- [Staging website](https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/).

## 1. Inspect before editing

Run these from the project directory:

```bash
git status --short --branch
git branch -vv
git remote -v
git config --show-origin --get user.name
git config --show-origin --get user.email
```

The status shows uncommitted changes; branch information shows where work will go; the remote identifies the repository; the identity identifies the author of future commits.

Verified at the start: clean checkout on `update/longer-ride-notes`, already created at `057d65d`, with no commits different from local `staging`. Origin matches the source repository. Repository-local commit identity is configured as Martin Ferrero-Thompson with the user's email. No identity or branch changes were needed. Remote freshness still needs checking before the content commit.

[Documentation PR #2](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/pull/2) was checked on 24 October: open, unmerged, targeting `staging`, with successful Website checks ([run](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/actions/runs/39937685872)). Its [readiness checklist](https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem/blob/01e0c06a0c105fec93b503cbb13e386735d41735/docs/client-handover/readiness-checklist.md) was read at commit `01e0c06a0c105fec93b503cbb13e386735d41735` because it is absent from local staging. The environment above supersedes that checklist's earlier `fmmdev` user for this exercise. This exercise does not merge or modify PR #2.

## 2. Prepare the change branch

Normally, start from a clean, current staging branch:

```bash
git fetch origin
git switch staging
git pull --ff-only origin staging
git switch -c update/longer-ride-notes
```

These are instructions for a new exercise, not commands to repeat blindly: this branch already exists. Fetch first, compare the current branch with `origin/staging`, and inspect any differences before deciding whether an update is needed. Keep both permanent source branches, `staging` and `main`.

## 3. Apply the exact approved Notes

Match the supplied title and date to the correct entry in `public/data/longer-rides.json`, including `archivedRides`. Change only the two `notes` values; preserve approved spelling, punctuation, spacing and paragraph boundaries. A Notes array represents separate text entries/paragraphs. Do not edit the historical `baseline` copy.

First approved text received: **War of the Worlds, 26 September 2026**, ID `war-of-the-worlds-2026-09-26`, in `archivedRides`. All four supplied paragraphs were compared with the existing Notes. The first three already matched; the fourth was changed from `Only one person... fell over... the joys of being clipped in!` to `Only one person fell over... the joys of being clipped in!`. The four array entries preserve the supplied paragraph boundaries. Exact comparison against all four supplied strings passed, and the parsed JSON differs from HEAD only in this ride's Notes. Whitespace diff check passed.

Second approved text received: **Lock, Stock and Barrel, 17 October 2026**, ID `lock-stock-and-barrel-2026-10-17`, also in `archivedRides`. The weather and towpath sentences now form separate paragraphs, and `value... Full` is now `value...Full`. The six supplied paragraphs match exactly after excluding spaces at the ends of pasted paragraphs, which were treated as formatting. No other wording was changed.

Both Notes arrays passed exact comparison with the supplied text. Comparing parsed JSON with HEAD after replacing only these two arrays confirmed all other data is unchanged. The reviewed data diff contains four added and three removed lines. `git diff --check` passed.

`git fetch origin` succeeded with sandbox approval; refreshed `origin/staging` remains at `057d65d`, with zero differing commits from this branch before the exercise commit. GitHub connector authentication was confirmed as `Martin-Ferrero-Thompson`.

## 4. Review the diff

```bash
git diff -- public/data/longer-rides.json
git diff -- docs/client-handover/collaborator-notes-exercise.md
git diff --check
git status --short
```

Compare both Notes against the supplied text. Confirm ride dates, routes, links, dependencies and unrelated content have not changed. Review this workflow log too. Explain and resolve any unexpected differences before committing.

## 5. Check locally

```bash
npm run check
npm test
npm run build
npm run build:staging
```

The code check catches diagnostics, tests check existing behaviour, and the builds validate data and prepare static files. A local production build does not publish anything. The staging build also checks the Pages asset prefix and `noindex, nofollow` tag. Record actual results for this change; the earlier zero diagnostics/18 passing tests/build success are historical evidence only.

Preview with `npm run dev` at `http://127.0.0.1:4321`, open the relevant archived years and rides, and inspect Notes at phone and desktop widths. Stop the server with Ctrl+C.

## 6. Commit, push and open the PR

### One-time FMM-Dev HTTPS authentication

The user chose to configure WSL Git authentication. The agent's initial noninteractive installation attempt stopped because `sudo` requires the user's Linux password. The user then installed GitHub CLI and completed browser sign-in locally. Verified installed version: `gh 2.103.2`.

Run these in the user's own FMM-Dev terminal, one at a time:

```bash
sudo apt-get install gh
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git --hostname github.com
gh api user --jq .login
```

The first command installs the GitHub CLI; enter the Linux password locally. The second starts browser sign-in: accept authentication for Git if prompted, and authorise as `Martin-Ferrero-Thompson`. If the browser does not open automatically, open the displayed URL in the Windows browser and enter the device code shown in the terminal. The third configures Git to obtain GitHub credentials through the CLI. The final command should print `Martin-Ferrero-Thompson`; it verifies the account without displaying a token. Do not paste passwords or tokens into chat or tracked files. The CLI uses a credential store when available and otherwise can store its token in its configuration file; do not share that file.

References: [GitHub HTTPS credential setup](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git?platform=linux), [CLI browser sign-in](https://cli.github.com/manual/gh_auth_login), [Git helper setup](https://cli.github.com/manual/gh_auth_setup-git).

Authentication verified on 24 October: `gh api user --jq .login` returned `Martin-Ferrero-Thompson`; global Git configuration already uses `/usr/bin/gh auth git-credential` for GitHub HTTPS. No additional helper configuration was needed. Browser auto-launch was unavailable, but manual browser sign-in succeeded. The CLI reported plain-text credential storage; no credential file or token was read into this log or chat. Remote references were refreshed successfully after sign-in. Next: commit this workflow evidence update, push the exercise branch and open its staging PR.

Once content and checks are reviewed, stage the two intended files explicitly, inspect the staged diff, then commit and push:

```bash
git add public/data/longer-rides.json docs/client-handover/collaborator-notes-exercise.md
git diff --cached --check
git diff --cached
git commit -m "Update approved longer ride notes and document staging exercise"
git push -u origin update/longer-ride-notes
```

Open a PR in the source repository with base **staging** and compare **update/longer-ride-notes**. Describe the two rides, exact content change, local validation and staging-only scope. Pushing this change branch does not publish staging. Record the PR URL and commit here when available.

## 7. Automated review and staging publication

Wait for **Website checks / Check, test and build** on the PR. It runs code checks, tests and both builds. Investigate failures and obtain any required review; do not bypass protections. After the reviewed PR is merged into **staging**, **Publish staging** repeats checks and publishes generated files to the publishing repository's `main` branch. That generated-file branch is distinct from the source repository's `main`; the workflow must not be redirected.

Watch the publishing repository's Pages deployment too. A successful source publication means files were pushed; a successful Pages deployment and live verification confirm the preview is available. Do not claim publication from a merge alone.

## 8. Verify and obtain staging approval

Open the staging website and its `staging-version.json`. Match the `commit` field to the successful source **Publish staging** run. Fetch the live `data/longer-rides.json` and compare both Notes with the approved text. Open both rides in the browser and verify paragraphs, archive navigation, images and nearby layout at phone and desktop widths. Record browser/device, results, PR, workflow links and source version, distinguishing automated checks from human visual acceptance.

Ask the user to approve the identified version **for staging**. Record the response accurately; successful checks do not imply user approval. Stop here. No release PR into source `main`, production deployment, IONOS change or domain/DNS change is part of this exercise.

## Exercise evidence

- Exact Notes supplied: both received and applied, with four and six paragraphs respectively.
- Content edits and diff review: exact text comparison and scope comparison passed; whitespace diff check passed.
- Local checks: zero errors, warnings or hints across 41 files; all 18 individual tests passed; production and client staging builds passed; both generated ride JSON files match source byte for byte. The initial sandbox test run only reported three file results; the full 18-test result was obtained by rerunning with subprocess access outside the sandbox.
- Browser preview: pending. No browser/Playwright installation was available in this environment. Phone and desktop visual acceptance must be recorded separately.
- Local commit: `0e9482f2429b1f02e13050bef8b581aa6f25beb8`, containing only the Notes data file and this workflow log. Staged whitespace review passed.
- Authentication: verified as `Martin-Ferrero-Thompson`, with the GitHub CLI HTTPS credential helper configured. The first push failed before authentication was set up; it created no remote branch or PR. Fetching the public repository alone did not prove write access.
- Push and staging PR: pending retry after authentication.
- PR checks and merge into staging: pending.
- Source publication and Pages deployment: pending.
- Live content/version verification: pending.
- User staging approval: pending.
