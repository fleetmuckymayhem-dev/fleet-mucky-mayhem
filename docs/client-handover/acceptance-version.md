# Local acceptance version record

Candidate label: **FMM-LOCAL-ACCEPTANCE-2026-11-05-01**. Status: **locally accepted by Martin on 5 November 2026**; final client acceptance remains at the later new-account GitHub Pages stage. No approval for publication, clean-copy creation or IONOS cutover is implied.

| Version | Meaning |
| --- | --- |
| Tested website | `b12fc29e5ca3cf037af597e747d47edd23484569` — QR-layout fix, with the fresh-source checks recorded in [final-local-acceptance.md](final-local-acceptance.md). |
| Documentation candidate accepted locally | be5efc2e52e289579b48b522e70d5a7abe97001f — reviewed guides, acceptance evidence and matching release/undo PDFs. Subsequent evidence commits record the guided results without changing the accepted website. |
| Shared workspace | `/home/martin/projects/fleet-mucky-mayhem`, FMM-Dev, branch `docs/local-readiness`. Martin confirmed this alignment on 5 November 2026; the P: copies are references only. |
| Human acceptance | Functional and content checks completed by Martin on 5 November 2026: desktop checks in Chrome, Chromium, Edge and Firefox; mobile-menu/Ride Diary/Photos/FAQ keyboard checks; ride/FAQ/contact/disclaimer wording; all 43 Box shares; four maps; four sponsors; two cycling articles; Relive playback; laptop and Huawei Outlook email handling; WhatsApp invitation; physical QR scan; Huawei Mate 20 X 5G/Chrome portrait, landscape and touch checks; and the isolated populated upcoming-ride/countdown demonstration. Martin explicitly approved local acceptance of be5efc2e52e289579b48b522e70d5a7abe97001f on 5 November 2026. Final authorised client sign-off is deferred to the new-account GitHub Pages remote acceptance stage; see [acceptance-session.md](acceptance-session.md). The temporary phone server/firewall rule and countdown demo server were removed/stopped after testing. |

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

## Preparation evidence at candidate be5efc2 — 5 November 2026

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

Document checks also passed: relative Markdown file links resolve, external-evidence JSON parses, all 43 Box/four map result rows were present and pending at candidate preparation; the later guided results are now recorded in acceptance-session.md, and `git diff --check` reports no whitespace errors. Existing website test results are retained; this documentation-only task does not claim a new website build/test run.

## Local acceptance approval and evidence

Martin approved local acceptance in the shared chat on 5 November 2026 after explicitly confirming all guided checks. His approval applies to candidate be5efc2e52e289579b48b522e70d5a7abe97001f with unchanged tested website b12fc29e5ca3cf037af597e747d47edd23484569. Final client acceptance takes place at the later new-account GitHub Pages stage.

The evidence commit updates Markdown records only. It does not create the clean handover copy, remove history, publish, or change IONOS. Resolve its SHA after committing with:

```bash
git log -1 --format=%H -- docs/client-handover/acceptance-session.md
```
