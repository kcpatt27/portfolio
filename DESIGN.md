# Design system

## Direction

An evidence register, not a landing page. The work is the subject; every claim has a place to be checked. The visual signature is a topographic isoline field in the hero, drawn in code so the lines move, over a warm paper-and-ink palette with drawn status marks in the margin.

Rejected directions: the 3D cyberpunk/space hero, service pricing, and lead-gen forms. They belonged to an earlier concept and are not part of this system.

## Tokens

All tokens are CSS custom properties on `:root` in `assets/site.css`.

| Token | Light | Dark |
| --- | --- | --- |
| `--paper` | `#f3efe6` | `#1a1815` |
| `--paper-deep` | `#ece5d7` | `#221f1a` |
| `--ink` | `#201d19` | `#e9e1d2` |
| `--muted` | `#544e44` | `#b3a993` |
| `--rule` | `#cfc7b6` | `#3d382f` |
| `--rule-soft` | `#ddd6c6` | `#2c2822` |
| `--moss` | `#3c4932` | `#a9bd8f` |
| `--clay` | `#7a3d22` | `#d99a76` |

Layout tokens: `--gutter` (margin column, `clamp(62px, 10vw, 146px)`) and `--pad` (`clamp(20px, 5vw, 56px)`).

`moss` is the default link and live-state color. `clay` is the hover/attention color. `muted` carries secondary copy, dates, and stack lines.

## Type

- Display and entry titles: Fraunces 400/500, self-hosted woff2, fallback Iowan Old Style / Palatino.
- Body and UI: Karla 400/500/600 from Google Fonts, fallback Helvetica Neue / Arial.
- Body text 16px / 1.6. Small caps labels use 0.64–0.72rem with 0.12–0.18em tracking and uppercase.

## Layout

The page is a register: a narrow margin column (`.margin`) beside a wide body (`.body`) inside `.row`. The margin carries the section key and accession number, plus a decorative status mark. The body carries the content.

Breakpoints:

- **900px** - hide the vision contour strip.
- **820px** - entries and principles collapse to one column.
- **680px** - the margin column becomes a horizontal label bar; hero proof cards stack; the gutter is zero.
- **560px** - tighter head spacing; field rows stack.
- **380px** - compact nav (smaller type, tighter gaps) so all four links plus the motion control stay on one row.

## Motion

The hero, timeline spine, and vision strip use canvas isolines from `assets/contour-motion.js`. The navbar control is a 34px circle with no visible label and a small isoline glyph drawn from the same field. The header stays solid; the glyph is the only animated element in it.

- `prefers-reduced-motion: reduce`: one synchronous static frame, no animation loop.
- Otherwise: slow animation, paused when the tab is hidden or the element is off-screen.
- Off state: gray ring, glyph at rest. On state: moss ring with a soft 12px glow, glyph still.
- Hover, when the site is off: three contour levels from the page field drift through the circle. The glyph canvas is larger than the ring and masked, and its edge segments get one soft blurred pass, so the lines dissolve into wisps just past the ring. Hover does nothing when the site is on.
- The ring grows from 0 to 4px with a faint gray or white glow on hover.
- Field canvases animate at about 30fps on desktop and 20fps on small screens.
- The circle is the only control that writes a preference; everything else follows the system.

Motion must never be required to read content. The `.contour*.svg` masks remain the no-JS fallback.

## Status marks

Margin marks are decorative (`aria-hidden`); status is always written in text.

- Solid + terminal mark: complete or published.
- Double mark: usable.
- Dashed mark: in progress or growing.
- Diagonal-cut mark: archived.

## Interaction

- Focus: 2px `--clay` outline with 4px offset, plus a visible focus style on the `MOTION` pill.
- Links: moss, underline offset 4px, hover to clay.
- Nav links: uppercase, 0.7rem, bottom border on hover and on the current page.
- Touch targets: nav links and the pill keep a 44px minimum height.
- The motion control gets a slow conic shine around its ring on hover, only while the site is off.

## Rules

- No claim without a place to check it. Numbers carry a date or a gate.
- No private or planned work presented as shipped. Say "private" or "walk-through available".
- No stock imagery. The isolines, marks, and type carry the page.
- No second accent color. Moss and clay only.
- No animation that ignores reduced motion, and no autoplay media.
