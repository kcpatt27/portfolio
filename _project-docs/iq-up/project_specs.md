# IQ Up! Specifications

## Project Vision

A browser-based training platform for individuals preparing for Raven's Progressive Matrices and Mensa-style intelligence tests. IQ Up! helps users improve pattern recognition speed and accuracy through structured practice, spaced repetition, performance analytics, and a 6-week training calendar.

## Current Status

- **Version:** 0.1.0 (Pre-release)
- **Completion:** ~30% complete
- **Last Updated:** February 2026
- **Availability:** Private (development/testing phase)

## Technology Stack

- **Backend:** TypeScript, Hono — routing and request handling on Cloudflare Workers
- **Frontend:** HTML with htmx for progressive enhancement, Tailwind CSS (CLI build) for styling
- **Database:** Cloudflare D1 (SQLite) — sessions, questions, answers, review queue, calendar plans
- **External APIs:** None
- **Hosting:** Cloudflare Pages + Workers (edge computing)
- **AI Tools Used:** Cursor (Claude for scaffolding)

## Key Features (Completed)

- [x] Deterministic question generator — reproducible Raven's-style matrix problems with 14 shapes and 10 rule families, exactly one correct answer per item
- [x] Test runner — timed and drill modes with session persistence, keyboard shortcuts (1–8, Enter, F, arrows)
- [x] Results and analytics — accuracy, latency, error categorization, flagged items, enqueue incorrect to review
- [x] Spaced repetition review — SM-2-lite algorithm, grade items (Hard/Good/Easy), list due items
- [x] 6-week training calendar — Monday-aligned grid, toggle daily completion
- [x] UI and accessibility — Tailwind design system, dark mode, responsive layouts, axe-verified a11y, keyboard-first
- [x] Test suite — 85 tests passing (< 10s), snapshot and route coverage

## Features In Progress

- [ ] Performance optimization (ETA: ~2 weeks) — cache rule combinations, optimize SVG rendering, query tuning
- [ ] Documentation and onboarding (ETA: ~3 weeks) — user-facing tutorials, shortcuts reference, FAQ

## Planned Features

- [ ] Enhanced analytics dashboard — historical accuracy/latency trends, streak tracking, best performance records
- [ ] Export/import — session results as JSON/CSV, review queue status, PDF reports
- [ ] Question difficulty calibration — adaptive difficulty based on performance, optimal challenge level
- [ ] Custom training plans — goal-based and time-based plan generation, focus area selection
- [ ] Advanced progress tracking — heatmaps by question type, improvement velocity, weakness recommendations

## Key Decisions

- **Why Cloudflare edge?** Global low latency, serverless scale, and D1 (SQLite) for simple persistence without managing servers.
- **Why HTML-over-the-wire (htmx)?** Minimal client-side JavaScript, fast accessible interactions, and progressive enhancement without a heavy frontend framework.
- **Why Tailwind-only for MVP?** Full control over design tokens and a11y while keeping CSS lean; optional component library later if needed.
- **Why deterministic seeded RNG?** Reproducible practice sessions, consistent difficulty, and the ability to retry or review the same question.

## Success Metrics

- 85 tests passing in < 10s; zero critical accessibility violations (axe-core)
- < 50ms median API response time (edge)
- Thousands of active users and measurable improvement over time (post-launch)
- Community recognition as a go-to resource for Raven's/Mensa preparation (long-term)

## Known Limitations

- Training tool only — not an official Mensa or Raven's test; for actual Mensa admission, users must take the official exam.
- Web-only — no dedicated mobile app; interface is responsive and works in mobile browsers.
- Single-user, anonymous-first — no multi-user auth; data is session/local D1 based.
- No offline support — requires network for all operations.

## Important URLs/Credentials

- Local dev: http://127.0.0.1:8787 (or port printed by `wrangler dev`)
- Schema: `schema.sql`; apply locally with `npm run db:apply`
- (Leave repo, staging, and API doc URLs blank or add when applicable.)
