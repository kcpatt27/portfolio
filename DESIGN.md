# Design system

## Direction

An evidence register, not a landing page. The work is the subject; every claim has a place to be checked. The visual signature is a dense **topographic isoline field** in the hero, with a warm paper/ink palette and a botanical status system growing from the register rule.

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
- Project records use the accession stem: `No. 01`, a 2 px connector, then a botanical marker.
- Four pages share `assets/site.css`; no framework, no build step to view.

## Contour field

`assets/contour.svg` is an alpha mask of 214 nested isolines, generated from domain-warped flow bands with a radial fade. It spans the whole hero and is masked into `--rule`:

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

The field is currently hidden on mobile (`max-width: 820px`). A lighter mobile variant is an open improvement.

## Botanical status

The marker grows left from the rule and is also the project bullet:

- **Flower** — completed and live (GIP).
- **Bud** — live and usable but still growing (SQWease, `Live · Usable`).
- **Sprout** — archived (MemVid, clay).

The marker is inside a 28 px paper disc with a 2 px stem. Status text remains visible, so the botanical is never the only signal. Flowers use a 900 ms bloom; reduced-motion disables it.

## Motion

- Hero entrance: 720 ms.
- Link transitions: 500 ms.
- Flower bloom: 900 ms.
- No loops, parallax, autoplay, or scroll-jacking.
- `prefers-reduced-motion: reduce` disables non-essential motion.

## Accessibility

- Semantic landmarks, one `h1` per page, skip links.
- `:focus-visible` outlines in clay.
- WCAG 2.2 AA target: 24 px minimum; inline README links are exempt.
- Axe (WCAG 2.2 AA) clean on all four pages, light and dark.
- Dark mode follows the system; no toggle.

## Change rules

- Keep the palette to the tokens above; no neon, gradient hero, glass, bento, or dashboard chrome.
- One pattern family: isolines. Echo it at different scale/density; do not mix contour, stipple, and flow lines in the same view.
- Verify light and dark, 1440 and 390, and WebKit + Firefox + Chromium before shipping.
- The publication gate is content-level as well as filename-level; raw docs must not contain roadmap/PRD/spec language.
