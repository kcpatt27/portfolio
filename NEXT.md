# Next actions

Updated 2026-10-20. This is the working backlog for the portfolio and the job-search build.

## Launch blockers

- [ ] **eyewright demo + public repo.** Record the 60–90 s walkthrough, upload it, add the demo and GitHub links to the Work record and case study. The current machine has the PyPI package but not the private source tree or the `laya` demo service; the recording kit is in `video/eyewright-demo/`.
- [ ] **eyewright repo flip.** `gh repo edit eyewright/eyewright --visibility public` after the demo and the outstanding security/CI issues are closed. Then add the repo link to the case study.
- [ ] **LSM paper review + public repo.** The draft is in `papers/living-state-machine.html` and `.pdf`. Reconcile claims against the repo, finish citations/figures, then link it from the LSM record when the repo is public.
- [ ] **Third-record decision.** SQWease stays until `living-state-machine` has a public repository. Then swap SQWease for LSM and add its case study. Do not feature an unbuilt plan.

## Job-search system

- [ ] **Cover letter generator.** Inputs: job description, CV, selected project evidence, tone. Outputs: one-page letter, Markdown + PDF, and a claim ledger that refuses unsupported assertions.
- [ ] **Application tracker.** Local-first table for role, company, source, date, status, contact, next action, and follow-up. No accounts, no telemetry.
- [ ] **Application kit.** Reusable answers for “tell me about yourself,” project STAR stories, salary/availability language, and a short portfolio walkthrough.
- [ ] **Weekly review.** A small CLI/report that surfaces stale applications, upcoming follow-ups, and which project evidence is being used.

## Portfolio polish

- [x] Code-animated isolines with static/reduced-motion fallback.
- [x] Distinct Work / Timeline / Vision contour topologies.
- [x] Status rules: solid + terminal, double, dashed in-progress, diagonal-cut archive.
- [x] Footer contour echo.
- [x] Eyewright + mcp-weight featured; GIP/MemVid retained as noindex archive.
- [x] Live download snapshots (eyewright 143/week; mcp-weight 517/30d), date-stamped.
- [x] Timeline headings link to case studies.
- [x] Content pass and CV meta correction.
- [ ] Per-case-study social/OG images.
- [ ] Mobile diagram summaries (the diagrams currently pan horizontally).
- [ ] Refresh download snapshots on launch day.
- [ ] Add mcp-weight and eyewright to the shared-docs publication gate once their metadata is ready.
- [ ] Optional archive index for retired case studies.
- [ ] Final launch pass: link check, sitemap, axe, reduced motion, Edge/Firefox/WebKit, CV PDF.

## Research

- [x] LSM technical report draft from the staged docs: `papers/living-state-machine.pdf` (7 pages).
- [x] Eyewright recording kit: `video/eyewright-demo/` (script, commands, checklist).
- [x] LSM table reconciliation against the `phase1_report.md` / `phase2_report.md` in the DT-001 checkout (2026-10-20).
- [ ] Recheck the tables against raw run IDs/artifacts; not all run directories are present in the checkout.
- [ ] Convert the LSM report to LaTeX and run the arXiv checklist in `papers/ARXIV.md`.
- [ ] Get an arXiv endorsement (first paper/new category).
- [ ] Citation pass and related-work expansion.
- [ ] Paper figure(s) and a clean PDF/arXiv-style layout.
- [ ] LSM repository public + paper link in the case study.
- [ ] Optional: parallelize the association-trace scan and rerun the Stentor-vs-minimal comparison on matched compute.

## Definition of done for launch

- Public, inspectable artifact for every featured record.
- No private or planned work presented as shipped.
- Every number traceable to a dated source.
- Mobile, dark mode, reduced motion, keyboard, and axe clean.
- CV, case studies, and Work records agree.
- One owner review, then push.
