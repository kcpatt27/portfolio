# Living State Machine — paper/report

- **Draft:** `living-state-machine.html`
- **PDF:** `living-state-machine.pdf` (7 pages, Letter)
- **Status:** technical report draft, not peer reviewed
- **Source basis:** the staged LSM research record in `shared-docs/living-state-machine/` (`summary-for-career.md`, `key-metrics.md`, `retrospective.md`)

## What the draft covers

- The per-turn wrapper architecture and dual state.
- Gated writes, the deterministic verifier, and the facts-backed state projector.
- The matched-budget headline bench, stress bench, ablations, writer precision, retrieval MRR, verifier calibration, and Phase 2 integration.
- Three negative results and the false-regression/harness diagnosis.
- Explicit limitations and an evidence map.

## Still needed before public release

- Reconcile every number against the repository's `docs/phase1_report.md`, `docs/phase2_report.md`, exit checklists, and run directories.
- Confirm the exact repository URL and license; the staged summary names `github.com/kcpatt27/living-state-machine`, which currently returns 404.
- Expand and verify the related-work citations; the current list is intentionally narrow.
- Decide on a target format (technical report, workshop paper, or blog companion) and add venue-specific figures.
- Add source/LOC/test-run metadata once the repo is available.
- Optional: convert the HTML to LaTeX or a venue template after the content review.

The draft is deliberately written as a technical report rather than a claim of publication. It keeps the negative results and non-claims visible.
