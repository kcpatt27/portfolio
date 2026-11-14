# Next

Active work only. Completed items are in `DONE.md`; the shipped log is in `ROADMAP.md`.

Updated 2026-11-06.

## Portfolio

- [ ] **Per-case-study OG images.** One `assets/social-card.png` is reused for every page. Generate one per case study and point `og:image` at it.
- [ ] **Mobile case-study diagrams.** The Fixture and eyewright diagrams pan horizontally under 680px. Either scale them down or add a static mobile summary.
- [ ] **Archive decision.** GIP and MemVid are `noindex`. Decide: keep as archived records, or move them behind an archive index and drop them from `work/`.
- [ ] **Snapshot refresh.** Fixture's public-flip download numbers still need a manual recheck; mcp-weight downloads and eyewright versions now refresh weekly.
- [ ] **Publication gate.** Add mcp-weight and eyewright to the shared-docs gate when their release metadata is ready, then run `npm run build` and confirm the copied docs.
- [ ] **Cross-browser pass.** Edge, Firefox, WebKit; then axe on every page. Record what failed.

## Research (LSM)

- [ ] Work through `papers/ARXIV.md`: citation pass, figures, endorsement, raw-run verification.
- [ ] Link the paper from the LSM case study once the arXiv path is settled.
- [ ] Keep the paper labelled "preprint in preparation" until a public ID exists.

## After each deploy

- [ ] `npm run smoke` passes.
- [ ] New routes return 200; retired routes return 404.
- [ ] `sitemap.xml` matches the pages that exist.
