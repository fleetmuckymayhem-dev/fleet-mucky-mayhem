#!/usr/bin/env bash
set -euo pipefail

# Only the trusted client staging branch may publish. No credentials are used on PRs.
if [[ "${GITHUB_REPOSITORY:-}" != 'fleetmuckymayhem-dev/fleet-mucky-mayhem' || "${GITHUB_REF:-}" != 'refs/heads/staging' ]]; then
  echo 'Publishing is restricted to the client repository staging branch.' >&2
  exit 1
fi
if [[ -z "${FMM_STAGING_DEPLOY_KEY:-}" ]]; then
  echo 'Add the FMM_STAGING_DEPLOY_KEY Actions secret before publishing.' >&2
  exit 1
fi
build="$PWD/artifacts/staging-site"
test -f "$build/index.html"
test -f "$build/.nojekyll"
test -f "$build/staging-version.json"
if [[ -e "$build/CNAME" ]]; then
  echo 'Staging must not contain a production custom domain.' >&2
  exit 1
fi

umask 077
key_file=$(mktemp)
hosts_file=$(mktemp)
trap 'rm -f "$key_file" "$hosts_file"' EXIT
printf '%s\n' "$FMM_STAGING_DEPLOY_KEY" > "$key_file"
unset FMM_STAGING_DEPLOY_KEY
# GitHub's published Ed25519 host key; do not accept unverified ssh-keyscan output.
# https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints
printf '%s\n' 'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl' > "$hosts_file"
export GIT_SSH_COMMAND="ssh -i '$key_file' -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile='$hosts_file'"
export GIT_TERMINAL_PROMPT=0

publish_dir=$(mktemp -d)
git clone --no-checkout git@github.com:fleetmuckymayhem-dev/staging-fleet-mucky-mayhem.git "$publish_dir"
if git -C "$publish_dir" show-ref --verify --quiet refs/remotes/origin/main; then
  git -C "$publish_dir" checkout -B main origin/main
else
  git -C "$publish_dir" checkout --orphan main
fi
# The target is a fresh temporary clone containing generated files only.
rsync -a --delete --exclude='.git/' "$build/" "$publish_dir/"
git -C "$publish_dir" add --all
if git -C "$publish_dir" diff --cached --quiet; then
  echo 'Staging files are already current.'
  exit 0
fi
git -C "$publish_dir" -c user.name='github-actions[bot]' -c user.email='41898282+github-actions[bot]@users.noreply.github.com' commit -m "Publish staging from ${GITHUB_SHA:?}"
git -C "$publish_dir" push origin HEAD:main
