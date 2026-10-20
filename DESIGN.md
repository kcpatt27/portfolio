# Design system

## Direction

An evidence register, not a landing page. The work is the subject; every claim has a place to be checked. The visual signature is a dense **topographic isoline field** in the hero — now redrawn in code so the lines themselves move — with a warm paper/ink palette and a drawn status-rule system in the margin.

## Tokens

Light:

- paper `#f3efe6`
- paper-deep `#ece5d7`
- ink `#201d19`
- muted `#544e44`
- rule `#cfc7b6`
- rule-soft `#ddd6c6`
- moss `#3c4932`
- clay `#7a3d22`

Dark (`prefers-color-scheme: dark`):

- paper `#1a1815`
- paper-deep `#221f1a`
- ink `#e9e1d2`
- muted `#b3a993`
- rule `#3d382f`
- rule-soft `#2c2822`
- moss `#a9bd8f`
- clay `#d99a76`

Minimum semantic contrast: **7.18 light / 7.45 dark** (tokens against paper). Do not add a third chromatic accent.

## Type

- **Fraunces** 400/500/italic — self-hosted from `assets/fonts/` (OFL, see `OFL.txt`). Static instances avoid a WebKit bug where the variable font defaulted to 900.
- **Karla** — body and metadata, loaded from Google Fonts with `display=swap`.
- Display: `clamp(2.45rem, 5.7vw, 4.9rem)`, line-height `1.02`, max 17ch.
- Body measure: ~54ch for lede, ~66ch for prose.

## Layout

- Work first: hero → work → method note/principles → record → direction.
- A continuous left rule carries the page. Section and project numbers sit in the margin.
- Project records use the accession stem: `No. 01`, a 2 px connector, then a drawn status rule.
- Four pages share `assets/site.css`; no framework, no build step to view.

## Contour field

`assets/contour.svg` remains the static engraving: an alpha mask of 214 nested isolines, generated from domain-warped flow bands with a radial fade. It is the no-JavaScript and reduced-motion fallback:

```css
.hero-contour {
  position: absolute;
  inset: 0;
  background-color: var(--rule);
  opacity: .5;
  -webkit-mask: url("contour.svg") center / 100% 100% no-repeat;
  mask: url("contour.svg") center / 100% 100% no-repeat;
}
```

When motion is allowed, `assets/contour-motion.js` replaces the token layer with a canvas field: five slowly moving Gaussian hills, contoured every frame with marching squares, twelve levels, and a CSS gradient fade. The field is sampled from `--rule`, so dark mode is automatic. It pauses offscreen and on hidden tabs, caps at about 18 fps on desktop and 12 fps on phones, and never runs under `prefers-reduced-motion: reduce` — the static SVG mask stays in place instead.

The Vision page uses a right-edge strip with a left fade and now runs the full height of the page; the Timeline uses a margin spine. Both use the same engine and the same static fallback.

## Status rules

The botanical drawings are retired. Status is a drawn rule in the margin, 32 × 11 px, not a badge:

- **Completed / live** — solid rule with a terminal tick (GIP).
- **Live / usable** — double rule (SQWease).
- **Archived** — dashed rule in clay (MemVid).

The status word remains in the record head, so the rule is never the only signal. The rule is decorative (`aria-hidden`); it does not replace the word. On phones the rule hides and the status word remains.

## Motion

- Hero entrance: 720 ms.
- Link transitions: 500 ms.
- Isolines: a code-driven scalar field, not a transform drift. Field cycles run roughly 25–50 s; contours redraw at 18 fps desktop / 12 fps mobile.
- No loops, parallax, autoplay, or scroll-jacking.
- `prefers-reduced-motion: reduce` never starts the canvas; the static mask and entrance animations are disabled.

## Accessibility

- Semantic landmarks, one `h1` per page, skip links.
- `:focus-visible` outlines in clay.
- WCAG 2.2 AA target: 24 px minimum; inline README links are exempt.
- Axe (WCAG 2.2 AA) clean on all eight pages, including the three case studies, light and dark.
- Dark mode follows the system; no toggle.

## Change rules

- Keep the palette to the tokens above; no neon, gradient hero, glass, bento, or dashboard chrome.
- One pattern family: isolines. Echo it at different scale/density; do not mix contour, stipple, and flow lines in the same view.
- Verify light and dark, 1440 and 390, and WebKit + Firefox + Chromium before shipping.
- The publication gate is content-level as well as filename-level; raw docs must not contain roadmap/PRD/spec language.

## Learned language (for future editions)

Observed owner preferences, 2026-10-19 → 20:

- Warm mineral paper, dark warm ink, moss/clay; no neon, cool blue, or pure black.
- Editorial serif display with a technical sans; type carries identity, not decoration.
- One dense isoline field as the signature; it must fade and never sit behind body copy.
- Work first. The first screen must show real projects and hard evidence, not just a thesis.
- Asymmetry is welcome when it balances and directs; it is not a cognitive-performance trick.
- Abstract status rules are welcome as marginalia, but the word must remain; botanical drawings did not survive review.
- Animated isolines must be code-driven, not a CSS drift; the static engraving is the fallback.
- Reject: card grids, badges, dashboard tiles, terminal cosplay, gradient hero, botanical markers, transform-only drift, hairlines below 1.5 px.

Future agents should start from this language, then vary one axis at a time. Do not re-derive the palette or the contour field from scratch.
