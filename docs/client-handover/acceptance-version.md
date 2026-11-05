# Local acceptance version record

Candidate label: **FMM-LOCAL-ACCEPTANCE-2026-11-05-01**. Status: documentation prepared; human acceptance **pending**. No approval for publication, clean-copy creation or IONOS cutover is implied.

| Version | Meaning |
| --- | --- |
| Tested website | `b12fc29e5ca3cf037af597e747d47edd23484569` — QR-layout fix, with the fresh-source checks recorded in [final-local-acceptance.md](final-local-acceptance.md). |
| Documentation candidate | The local commit containing this version record, the reviewed acceptance documents and matching release/undo PDFs. Resolve its exact SHA using the command below; a Git commit cannot contain its own SHA. Ines reports that same SHA after committing. |
| Shared workspace | `/home/martin/projects/fleet-mucky-mayhem`, FMM-Dev, branch `docs/local-readiness`. Martin confirmed this alignment on 5 November 2026; the P: copies are references only. |
| Human acceptance | Pending in [acceptance-session.md](acceptance-session.md), including individual results for all 43 Box shares and four Maps links. |

Resolve the immutable documentation candidate after the local commit:

```bash
git log -1 --diff-filter=A --format=%H -- docs/client-handover/acceptance-version.md
```

That is the documentation version, not a claim that website tests were run at a new source SHA. To check the candidate (substitute its reported SHA), use:

```bash
git show --stat CANDIDATE_SHA
git diff b12fc29e5ca3cf037af597e747d47edd23484569 CANDIDATE_SHA -- src public scripts tests package.json package-lock.json astro.config.mjs tsconfig.json .github
```

The second command must have no output for this documentation-only candidate. Future website edits require a new tested website SHA and affected checks. Record subsequent human results in later coordinated commits without silently changing the identity of this candidate.

## Review and PDF verification — 5 November 2026

- Reviewed the six pending Markdown changes and both acceptance-evidence files against the agreed five-stage release sequence and retained local logs. The external inventory contains 55 unique HTTP-200 responses, including 43 unique Box shares; account/content acceptance remains pending.
- Updated workspace status using Martin's report, without claiming device/account checks were performed. Preserved prior PR/deployment and test evidence as dated rehearsal history.
- Regenerated `update-preview-publish.pdf` and `undo-release.pdf` from their matching Markdown guides. Plain-text process flows are shared by both formats; there is no unrendered Mermaid code. The future independent reviewer cannot approve their own PR.
- PDF page counts, text parity and visual inspection are recorded below after rendering. Temporary rendering tools and page images live under `/tmp/fmm-document-tools` and Git-ignored `artifacts/acceptance-documents/`; no application dependency was added.

| PDF | Pages | Body-text parity | Visual result |
| --- | --- | --- | --- |
| `update-preview-publish.pdf` | 2 A4 | Passed against generated Markdown body, allowing typography, list numbering and page footers | Both pages inspected: readable text, no clipping/overlap, all seven steps and setup boundary present. |
| `undo-release.pdf` | 2 A4 | Passed against generated Markdown body, allowing typography, list numbering and page footers | Both pages inspected: readable text, no clipping/overlap; fallback and completion instructions together on page 2. |

Rendered with Chromium/Playwright; PDF pages rasterised with PDF.js using embedded glyph outlines. An initial rasteriser font-display problem was corrected before inspecting the final four page images. This was a rendering-tool issue, not accepted missing PDF text.

PDF SHA-256 values:


The candidate contains only acceptance/handover documentation and the two matching PDFs. No branch switch, push, publication, Git history removal, clean handover copy or IONOS change forms part of this task.

- `update-preview-publish.pdf`: `047457b9d2520f537160d71f9835116ca1fb3abe9df05bf412f615905cd2029b`.

- `undo-release.pdf`: `32a25e199bc43d1f301fe559e29aee26acc76f1284fe33ddabff218aed153614`.

Document checks also passed: relative Markdown file links resolve, external-evidence JSON parses, all 43 Box/four map result rows are present and pending, and `git diff --check` reports no whitespace errors. Existing website test results are retained; this documentation-only task does not claim a new website build/test run.
