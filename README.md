# Kalen Patterson — portfolio

A static hiring showcase for AI systems engineering work, with the documentation that makes it checkable. Four pages, no framework, no build step required to view.

- **Work** (`index.html`) — the three public projects, with status, evidence, stack, and links.
- **Documentation** (`docs.html`) — public README and architecture files for those projects.
- **Timeline** (`timeline.html`) — what is done, including retired work.
- **Vision** (`vision.html`) — the direction behind the work.

## What this is not

No services, pricing, packages, inquiry forms, testimonials, analytics, roadmaps, PRDs, or in-progress percentages. Only public, non-commercial projects appear. Retired work is labelled as retired and kept as a case study.

## Local preview

```powershell
python -m http.server 8089
# http://127.0.0.1:8089/
```

The site is plain HTML, CSS, and a small amount of JavaScript for the docs viewer. It works on GitHub Pages without a build.

## Content pipeline

`shared-docs` is the source of truth. Each project summary carries frontmatter:

```yaml
publish: public | private | embargoed
commercial: true | false
portfolio_id: <id>
```

`npm run build` runs the fail-closed publication gate, syncs the public project list, copies only whitelisted README/architecture files, scrubs roadmap/PRD/spec content, and scans the output for forbidden files and content.

```powershell
npm ci
npm run check:publish   # gate only
npm run build           # sync + gate + scrub + copy + output scan
npm run smoke           # live-site smoke checks (after deployment)
```

The gate default-denies any project without a `release` block, any non-public or commercial project, and any publishable list containing `ROADMAP.md` or `project_specs.md`.

The build copy scrubs roadmap/PRD/spec sections and links before writing `_project-docs`; the docs viewer repeats the scrub as a second guard.

## Design

The visual system lives in `assets/site.css`:

- warm paper, ink, moss and clay accents;
- self-hosted Fraunces for display, Karla for text;
- a continuous left rule with specimen numbers, and project records with labelled evidence rows;
- slow entrance motion only, fully disabled under `prefers-reduced-motion: reduce`;
- visible focus styles, skip links, semantic headings, and 24 px minimum targets.

The direction is an evidence register, not a landing page: the work is the subject, and every claim has a place to be checked.

## Deployment

GitHub Pages serves the repository root. `.nojekyll` is present, so only the files in this repository are published. CI runs the publication gate and the content build; the smoke workflow checks the live pages and the known leak paths.
