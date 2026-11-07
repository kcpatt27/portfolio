# Architecture

A static portfolio with a fail-closed content pipeline. The pages are plain HTML; Node scripts prepare metadata and copy approved project docs; GitHub Actions gates and deploys the result.

## Constraints

- **Static only.** No server, database, or client framework. Every page works from `file://` except the paths that need a web server for module/HTTP behavior.
- **Readable without JavaScript.** Content, navigation, and links are HTML. The isolines are the only scripted visual, and the CSS mask is the no-JS fallback.
- **Default-deny publishing.** A project reaches the site only through explicit `publish: public` frontmatter and a passing gate.
- **No hand-edited generated content.** `_project-docs/` and `metadata/projects.config.json` are outputs. Edits belong in shared-docs or the overlay.

## Page map

```
index.html          hero, 3 featured records, field note, 6 timeline entries
timeline.html       8 dated entries, newest first
vision.html         direction + principles
resume.html         HTML CV, links the PDF in assets/
work/               case studies (one file per record)
   fixture-cad.html
   living-state-machine.html
   mcp-weight.html
   eyewright.html
   global-info-portal.html   (noindex archive)
   memvid-mcp.html           (noindex archive)
papers/             LSM technical report (HTML, PDF, LaTeX source)
docs.html           pointer to the case studies
404.html            static fallback
```

Shared chrome lives in each page: `.site-head`, `.site-nav`, `.site-foot`. There is no templating layer, so a nav or footer change is a multi-file edit. That is deliberate: the site has no build step for HTML and no runtime dependency.

## Assets

- `assets/site.css` - one stylesheet. Tokens are CSS custom properties on `:root`, with a dark palette under `prefers-color-scheme: dark`. Layout is a two-column register (`.margin` + `.body`) inside `.row`, collapsing to one column under 680px.
- `assets/contour-motion.js` - marching-squares isolines on a canvas. Three field modes (`hero`, `timeline`, `vision`) share one renderer, and the navbar icon uses the vision field rotated 45 degrees. It reads `prefers-reduced-motion`, paints one synchronous frame when motion is reduced, and animates otherwise. The circular navbar control overrides the system setting per browser via `localStorage`.
- `assets/contour*.svg` - static masks used as the no-JS and reduced-motion fallback.
- `assets/fonts/` - self-hosted Fraunces (OFL). Karla comes from Google Fonts.

## Content pipeline

```
shared-docs/<project>/summary-for-career.md   (frontmatter: publish, commercial, portfolio_id)
        │
        ├─ scripts/sync-from-shared-docs.ts  → metadata/projects.config.json
        │        (falls back to the committed config when shared-docs is absent, e.g. CI)
        │
        ├─ scripts/check-publish.ts          → fail the build on any non-public project
        │
        ├─ scripts/symlink-project-docs.ts   → _project-docs/<id>/{README,ARCHITECTURE}.md
        │        (copies only `publishable` files; scrubs roadmap/PRD/spec headings)
        │
        └─ scripts/check-publish.ts --scan-output → re-check the copied output
```

`metadata/portfolio-overlay.json` holds presentation-only fields (description, local path, technologies, live URL) so shared-docs stays the evidence source. `metadata/projects.config.json` is generated and committed so CI and deploys have a stable config.

The pipeline is intentionally copy-based, not symlink-based. Earlier symlinks broke the GitHub Pages build; the copy step plus `.nojekyll` is the fix.

## Checks

| Check | Scope |
| --- | --- |
| `check:publish` | Metadata gate: public, non-commercial, allowed files only |
| `check:output` | Same gate over `_project-docs/` after copying |
| `check:html` | `html-validate` on every page |
| `check:links` | Relative `href`/`src` targets and same-page anchors |
| `smoke` | Live status codes, including probes confirming retired pages and private docs stay 404 |

## CI and deploy

- `.github/workflows/ci.yml` - on push/PR: install, publish gate, build, HTML validation, local links.
- `.github/workflows/pages.yml` - on push to `main`: upload the repository root as the Pages artifact, deploy with `actions/deploy-pages`.
- `.github/workflows/smoke.yml` - scheduled live check of the deployed site.

Pages must stay on the Actions source. The legacy branch builder repeatedly cancelled its own deployments on this repository.

## Decisions

- **No framework.** A handful of content pages and six case studies do not justify a generator or a client bundle. Hand-written HTML keeps the deploy a file copy.
- **Copy, don't symlink.** GitHub Pages rejected the symlinked docs tree; copied files are also the place to scrub restricted sections.
- **Generated docs are committed.** CI has no shared-docs checkout, so the committed copies are what deploy. The sync script keeps those files when the source is missing rather than emptying the directory.
- **Motion is opt-in per site.** The system preference is the default; the navbar control is the explicit override. This keeps the site usable for visitors who need reduced motion without forcing static art on everyone.
- **Status is text plus mark.** Margin marks are decorative (`aria-hidden`), and every record states its status in words.

## Adding a record

1. Add or update the project summary in shared-docs with `publish: public` frontmatter.
2. Add an overlay entry in `metadata/portfolio-overlay.json`.
3. Run `npm run build`; confirm `_project-docs/<id>/` contains only allowed files.
4. Add `work/<id>.html`, a record on `index.html`, an entry on `timeline.html`, and a `sitemap.xml` URL.
5. Add the page to `check:html` and `check:links`; run `npm run check:static` and `npm run smoke`.

## Known limits

- `check:links` only validates local targets; external URLs are covered by the scheduled smoke run.
- `smoke.mjs` hardcodes leak probes for retired paths. Add one when a project is retired.
- The case studies are static prose. There is no per-project data feed and no CMS.
