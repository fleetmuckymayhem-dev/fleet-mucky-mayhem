# Connect the client staging preview

This is a one-time technical setup for the support team and the client account owner. The normal update and release guides remain the client's day-to-day instructions.

**Status, 23 October 2026:** the deployment key and Actions secret are configured, the workflow is installed on the source `staging` branch, and the first staging publication and GitHub Pages deployment succeeded. The client confirmed the preview is visible. The steps below document the setup for future maintenance; do not generate another key just to follow them again.

**Production hold:** the client's current IONOS deployment and all related hosting and domain settings must remain untouched until the replacement is fully built, tested and documented. Any cutover requires a separate plan and explicit authorisation. See the [readiness checklist](readiness-checklist.md).

## Repositories and addresses

| Purpose | Location |
| --- | --- |
| Editable website code | https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem |
| Generated staging files | https://github.com/fleetmuckymayhem-dev/staging-fleet-mucky-mayhem |
| Staging preview, once enabled and deployed | https://fleetmuckymayhem-dev.github.io/staging-fleet-mucky-mayhem/ |
| Intended production domain | https://fleetmuckymayhem.com/ |

The staging workflow runs only on the client source repository's `staging` branch. It installs the locked dependencies, checks the code, runs the tests and builds the staging website. Only successful builds are copied into the staging publishing repository's `main` branch. GitHub Pages then publishes those files. The preview is public; `noindex, nofollow` discourages search indexing but does not restrict access.

This setup does not configure production deployment or change IONOS DNS. The client still publishes production by merging an approved release PR into the source repository's `main` branch once production automation has been configured and rehearsed.

## 1. Create a dedicated deployment key

In the client's Ubuntu terminal, outside the project, run:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "FMM staging publisher" -f ~/.ssh/fmm_staging_deploy
```

When asked for a passphrase, press Enter twice so the unattended workflow can use it. If this file already exists, stop rather than overwrite it.

Display the **public** key:

```bash
cat ~/.ssh/fmm_staging_deploy.pub
```

While signed into GitHub as `fleetmuckymayhem-dev`, open the **staging publishing repository**, then Settings → Deploy keys → Add deploy key:

- Title: `FMM staging publisher`
- Key: the complete public key line beginning `ssh-ed25519`
- Select **Allow write access** and add the key.

The key grants access to this one publishing repository. It does not grant access to the source repository or production publication.

## 2. Store the private key as a source repository secret

Display the private key locally:

```bash
cat ~/.ssh/fmm_staging_deploy
```

Copy the whole block, including its BEGIN and END lines, directly into GitHub. Do not paste it into chat, email or a tracked file.

Open the **source repository**, then Settings → Secrets and variables → Actions → New repository secret:

- Name: `FMM_STAGING_DEPLOY_KEY`
- Secret: the private key block.

The public key belongs in the publishing repository; the private secret belongs in the source repository. Removing the publishing repository's deploy key revokes access. To replace it, create a new pair and update both places. Keep any retained local private key out of Git and protected in the owner's account.

## 3. Install and run the workflows

The support team prepares a PR into `staging` with the workflow and build configuration changes. The `Website checks` workflow checks PRs into `main` and `staging`, without using a deployment secret.

After merging the setup PR into `staging`, open the source repository's Actions tab and follow **Publish staging**. Its first successful run creates the generated-file repository's `main` branch. Check that the commit message records the source commit that was built.

Subsequent merges into `staging` automatically rebuild and publish the preview. A manual rerun uses Actions → Publish staging → Run workflow, with **staging** selected. The workflow intentionally skips runs on `main` and on the maintainer's original repository.

## 4. Enable GitHub Pages

After the first generated-file commit exists, open the **staging publishing repository**, then Settings → Pages:

1. Source: **Deploy from a branch**.
2. Branch: **main**.
3. Folder: **/(root)**.
4. Save. Leave **Custom domain** empty.

Watch the publishing repository's Pages deployment in Actions. A successful source workflow means the files were pushed; it does not yet confirm that Pages has finished deploying them.

## 5. Verify the preview before client testing

The support team checks the preview at both phone and desktop widths, including images, ride data, menus and browser errors. Confirm that the preview URL's `staging-version.json` has the same `commit` as the successful source workflow. This identifies exactly which version the client is approving.

If a check or build fails, the publishing step is not run and the previous preview remains available. If Pages deployment fails after files are pushed, use the publishing repository's Actions log to investigate and rerun the deployment after resolving the error.

## Remaining handover work

- Review the legacy `vite-baseline` dependency audit findings separately; the active Astro build uses a separate Vite version.
- Configure branch protection using the **Check, test and build** check after its first successful run. Retain the permanent source `main` and `staging` branches.
- Configure production Pages and IONOS DNS, and rehearse client-controlled publication and rollback before cutover.
- Record the agreed support contact and named client release approver in the handover guides.

References: [GitHub deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys), [GitHub Pages publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
