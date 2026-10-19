# Architecture

## Shape

This is a static site, not an application:

```
index.html ─┐
timeline.html ├─ assets/site.css
vision.html  │  assets/favicon.svg
docs.html ───┘  metadata/projects.config.json
                _project-docs/<id>/{README,ARCHITECTURE}.md
```

There is no framework, bundler, client router, database, or server-side runtime. A clone can be opened with any static file server. GitHub Pages serves the repository root; `.nojekyll` disables Jekyll processing.

## Pages

| Page | Responsibility |
|---|---|
| `index.html` | Work: thesis, method note, working principles, three project records, a short record strip, direction link. |
| `timeline.html` | The record of shipped and retired work. No future plans. |
| `vision.html` | The conceptual direction: proposal versus proof, working principles, limits. |
| `docs.html` | A reader for the public README and architecture files. The project list comes from `metadata/projects.config.json`; Markdown is rendered in the browser with `marked` and sanitised with `DOMPurify`. |

## Design system

`assets/site.css` is the single visual source of truth.

- **Primitives:** paper `#f3efe6`, ink `#201d19`, moss `#3c4932`, clay `#7a3d22`, rules, and a fluid gutter.
- **Semantic roles:** page canvas, body text, muted annotations, links, status marks, hairlines.
- **Components:** skip link, site header, row/register layout, section heads, project records, evidence fields, record log, prose, docs shell, tabs, footer.
- **Type:** Fraunces (display), Karla (text), system mono for notation.
- **Motion:** one entrance pass (720 ms) and link transitions (500 ms); no loops, parallax, or scroll effects. `prefers-reduced-motion: reduce` reduces all durations to 0.01 ms.
- **Accessibility:** semantic landmarks, one `h1` per page, skip links, `:focus-visible` outlines, 24 px minimum targets, and text contrast checked at 4.5:1 in the rendered pages.

## Content pipeline

`scripts/sync-from-shared-docs.ts` reads `summary-for-career*.md` frontmatter from `shared-docs`:

- `publish` must be `public`;
- `commercial` must be false;
- a matching overlay must exist in `metadata/portfolio-overlay.json`.

`scripts/check-publish.ts` is the fail-closed gate. It rejects projects with a missing release block, non-public visibility, commercial status, an empty publishable list, a file listed as both publishable and never, or any publishable `ROADMAP.md`/`project_specs.md`. With `--scan-output` it also walks `_project-docs` for forbidden filenames.

`scripts/aggregate-projects.ts` writes `_aggregated/portfolio-metadata.json`; `scripts/symlink-project-docs.ts` copies only the whitelisted files into `_project-docs/`.

The docs viewer adds a second, content-level guard: it removes roadmap/PRD/spec headings, blocks, and links before rendering. The filename gate cannot see a roadmap section inside an otherwise publishable README.

## Publication rules

- Public, non-commercial projects only.
- No roadmaps, PRDs, specs, pricing, services, or inquiry forms.
- Retired work is labelled and kept; unfinished work is not presented as shipped.
- Project numbers and claims must come from the approved copy and the project's own README/architecture files.

## Deployment and checks

- `npm run build` — sync, gate, aggregate, copy, output scan.
- `npm run smoke` — live GitHub Pages checks, including known private/roadmap paths that must return 404.
- CI (`.github/workflows/ci.yml`) runs the gate and build on push and pull request.
- The smoke workflow runs on demand and on a daily schedule.

Nothing in this repository requires a build to be viewed. The build exists to keep the published subset honest, not to render the site.
