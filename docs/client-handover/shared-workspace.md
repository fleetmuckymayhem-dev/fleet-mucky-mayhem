# Shared development workspace

Agreed 5 November 2026 by Martin: Martin, Ines and Lleizar use the same existing FMM-Dev checkout for ongoing development and local acceptance.

- WSL distribution: FMM-Dev.
- Active folder: /home/martin/projects/fleet-mucky-mayhem.
- Windows view: \\wsl.localhost\FMM-Dev\home\martin\projects\fleet-mucky-mayhem.
- At transition: branch docs/local-readiness; committed source b12fc29e5ca3cf037af597e747d47edd23484569 plus Ines's pending documentation and acceptance evidence.
- Here origin is https://github.com/fleetmuckymayhem-dev/fleet-mucky-mayhem.git. The P: copies used different remote names.
- The P: astro-prototype and staging-integration-review checkouts are retained as reference copies; do not continue independent development there.

Use VS Code connected to WSL: FMM-Dev. Run Git, Node and npm inside this distribution and active folder. Use the documented Node 24.22.1/npm 11.19.1 environment for acceptance; do not share installed dependencies between Windows and Linux runtimes.

One person edits at a time during acceptance. Coordinate branch switches, dependency installations, commits and builds before starting. Reviewers may read and test while the writer is idle. Check pwd, branch, HEAD and git status at the start of each work session. Saved files are shared; separate chat histories are not.

Read final-local-acceptance.md for remaining physical-device, external-content and approval checks. Preserve pending changes until reviewed; the source SHA alone does not identify the uncommitted documentation.

The existing GitHub account and staging site remain rehearsal infrastructure. Final local acceptance precedes a separate clean handover copy, fresh history in that copy, full retesting, the new client GitHub destination, remote acceptance, and separately authorised IONOS cutover. Workspace alignment does not approve the release or authorise publication, Git history removal, or IONOS changes.

The coordinated acceptance-document candidate is recorded in [acceptance-version.md](acceptance-version.md). Martin and Lleizar use [acceptance-session.md](acceptance-session.md) for the numbered steps and pending results. After Ines reports the local commit SHA, the workspace reservation ends; coordinate the next writer before further changes.
