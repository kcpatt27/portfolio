# Kalen Patterson - portfolio

**Live:** https://kcpatt27.github.io/portfolio/

A static site built as an evidence register: each project record says what shipped, what was measured, and what it does not do. No framework, no trackers, no build step required to read a page.

## Pages

| Path | What it is |
| --- | --- |
| `index.html` | Thesis, three featured records, field note, six latest timeline entries |
| `timeline.html` | The full record: eight dated entries, newest first |
| `vision.html` | Direction and the principles behind the work |
| `resume.html` | HTML CV; downloads `assets/Kalen-Patterson-CV.pdf` |
| `work/*.html` | Case studies: Fixture, Living State Machine, mcp-weight, eyewright, Global Information Portal, MemVid |
| `papers/` | Living State Machine technical report (HTML, PDF, LaTeX) and arXiv notes |
| `404.html`, `docs.html` | Fallback and a pointer to the case studies |

## Stack

- Hand-written HTML and CSS. One optional script, `assets/contour-motion.js`, draws the animated isolines.
- Node 20+ for the content pipeline and checks; `tsx` runs the TypeScript scripts. No runtime dependencies.
- GitHub Actions runs checks and deploys Pages.
- Fonts: Fraunces is self-hosted in `assets/fonts/`; Karla loads from Google Fonts.
- Code is MIT (`LICENSE`); page copy and the CV are CC BY 4.0 (`LICENSE-CONTENT.md`).

## Local development

Any static server works; the site is plain files.

```powershell
npm install
npm run build      # sync metadata, gate it, copy docs, re-check
npm run check:static
python -m http.server 8000
```

Open `http://127.0.0.1:8000/`. There is no dev server and no hot reload; refresh the browser.

## Scripts

| Command | Does |
| --- | --- |
| `npm run sync` | Rebuilds `metadata/projects.config.json` from the shared-docs evidence store |
| `npm run check:publish` | Fail-closed publication gate over project metadata |
| `npm run symlink-docs` | Copies the publishable docs into `_project-docs/` and scrubs roadmap/PRD text |
| `npm run build` | `prebuild` + docs copy + `check:output` |
| `npm run check:html` | `html-validate` over every page |
| `npm run check:links` | Relative links and `#anchors` exist locally |
| `npm run check:static` | Publish gate + HTML + local links |
| `npm run smoke` | Live-site check, including leak probes for retired pages |

## Publishing rules

`_project-docs/` is generated. Do not hand-edit it; `scripts/symlink-project-docs.ts` recreates it on every build.

A project appears only when its shared-docs summary has frontmatter with `publish: public` and is not commercial. A missing block, `private`, `embargoed`, or `commercial: true` keeps it off the site. The gate runs before the copy and again over the output, so a bad state fails the build instead of shipping.

Roadmap, PRD, and specification files are never published. If a forbidden heading appears inside an otherwise publishable README, the copy is scrubbed before it lands in `_project-docs/`.

## Deploy

`.github/workflows/pages.yml` uploads the repository root as the Pages artifact and deploys it on every push to `main`. `.github/workflows/ci.yml` runs the publish gate, build, HTML validation, and local link check on pushes and pull requests. `smoke.yml` checks the live site on a schedule.

Pages source is the Actions workflow, not a branch. Do not switch it back to the legacy builder; that path cancels its own deploys.

## Motion and accessibility

The isolines honor `prefers-reduced-motion`. When motion is allowed they animate; when it is reduced they render one static frame. The circular control in the navbar shows a diagonal flow glyph, top left to bottom right, with four lines blurred and offset into wisps just past the ring. It drifts slowly at 1/8 speed when the site is on, and runs at full speed under the pointer when the site is off. The choice is remembered per browser.

Pages are readable with JavaScript off. Keyboard focus is visible, the skip link is first in the tab order, and status is written in text as well as shown in the margin marks.
