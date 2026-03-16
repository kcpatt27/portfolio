# Dusts of Reality (DoR) — Project Specifications

## Project Vision

A tactical, team-based card game for mobile (and currently browser) where players build decks, choose from seven classes with strict hand composition, and play turn-based matches with Aether Surge and Waste mechanics—filling the gap for strategic mobile card games that balance depth and accessibility, with real-time team play and cosmetics-first (non–pay-to-win) progression. Target audience: strategy enthusiasts (18–35), casual mobile gamers (13+), and players who want 10–15 minute sessions and meaningful cooperation.

## Current Status

- **Version:** v0.1.0 (pre-release)
- **Completion:** ~40–50% (core engine, vanilla UI, class/progression done; effect resolution, deck builder, tutorial in progress)
- **Last Updated:** February 2025
- **Availability:** Private, browser-only prototype (no backend, no public deploy)

## Technology Stack

- **Frontend:** Vanilla TypeScript, HTML, CSS — browser-first MVP; Redux Toolkit for state
- **Build:** esbuild (single IIFE bundle → `dist/game-bundle.js`); Vite recommended for future (dev server, HMR)
- **State:** Redux Toolkit (gameSlice, cosmeticsSlice); progression persisted via `progression.ts` → localStorage
- **Backend:** None yet (planned: Node.js monolith, REST + WebSockets)
- **Database:** None (localStorage for progression); PostgreSQL or similar planned for backend
- **External APIs:** None
- **Hosting:** Local/static (e.g. `npm run build` + static server); GitHub Pages / Vercel possible for demo
- **AI Tools Used:** Cursor (Claude for scaffolding and implementation)

## Key Features (Completed)

- [x] Core game state (Redux), turn flow, phase transitions (PlayerTurn / EnemyTurn / ResolvingEffects, etc.)
- [x] Class system: 7 classes, strict hand composition (e.g. Gladiator 2 Atk / 1 Def), class unlocking after first game
- [x] Aether Surge & Waste state logic (activeSurge, wastePiles) and basic UI (surge zone, waste icons)
- [x] Card play flow: drag-and-drop, targeting UI (highlights, cancel), play → surge → effectsResolved → endAetherSurge
- [x] AI opponent (strategy-based, passes correctly, turn advancement)
- [x] Vanilla components: Card, PlayerHand, Battlefield, PlayerAvatar; CosmeticStore; card flip and surge animations
- [x] Progression: unlocked classes, loadouts, saved decks, cosmetic inventory persisted to localStorage
- [x] UIManager wired to Redux (subscribe, dispatch playCardAction, selectTargetAction, effectsResolved, endAetherSurgeAction)

## Features In Progress

- [ ] Effect resolution pipeline — real damage/heal/buff/debuff (resolveEffects); ETA: ~2–3 weeks
- [ ] Deck builder UI (basic view/edit, save loadouts) — ETA: ~2 weeks
- [ ] Tutorial / onboarding overlay (Surge, Waste, basic flow) — ETA: ~1–2 weeks
- [ ] Targeting & single-player polish (replace temporary immediate dispatch with proper timing)
- [ ] Single-player MVP loop closure (setup → play → resolve → surge → waste → win/loss → save)

## Planned Features

- [ ] Aether Surge energy UI (bar/meter for elemental contribution)
- [ ] Waste pile scrollable view and Compress/Reclaim interactions
- [ ] Full deck builder & collection viewer (filtering, sorting)
- [ ] AI strategy refinement (Surge/Waste, targeting value); fix multi-AI rendering if needed
- [ ] Effect visualizations (replace placeholders with damage/heal/buff/debuff feedback)
- [ ] Class / element pairing effects (drafts done; selection and implementation pending)
- [ ] Backend + multiplayer (matchmaking, WebSockets, server-authoritative validation, user accounts)
- [ ] Mobile build (React Native or chosen framework, shared core logic)
- [ ] Card acquisition / pack opening (Fragment Emergence / Aetheric Resonance thematics)
- [ ] Cosmetics Phase 2+ (Player Avatars, full integration, monetization hooks)

## Key Decisions

- **Why browser-first vanilla TS?** Ship MVP without committing to a mobile framework; gameLogic and state stay in TypeScript and can be reused for React Native later.
- **Why Redux Toolkit?** Predictable state, devtools, and a good fit for turn-based match state and progression.
- **Why esbuild for now?** Fast single bundle and IIFE for script tag; Vite recommended later for dev server and HMR.
- **Why localStorage for progression?** No backend yet; sufficient for single-device persistence until backend or IndexedDB.
- **Why private / pre-release?** Solo dev; building playable single-player MVP before any public launch or backend.

## Success Metrics

- **MVP (next ~4 weeks):** Full single-player match playable (setup → play → resolve → surge → waste → win/loss), progression save/load, basic deck builder and tutorial.
- **Stability:** No critical regressions in play/targeting/turn flow; build and smoke test passing.
- **Code health:** Unit coverage for gameLogic and state; key flows covered by integration tests.
- **Later:** User growth and retention (when launched); feature adoption (deck builder, cosmetics); performance (frame rate, load time); community feedback.

## Known Limitations

- No backend, no user accounts, no multiplayer (all planned post-MVP).
- Effect resolution is placeholder (damage/heal/buff/debuff not yet applied to game state).
- No offline-first beyond current single-tab localStorage; no cross-device sync.
- Deck building UI not yet implemented (view/edit/save flow).
- No tutorial; first-time experience is unguided.
- AI does not yet consider Surge/Waste in strategy; possible multi-AI render bug (to verify).
- Performance (e.g. many surge animations) not fully profiled; 60 FPS target.
- E2E tests not started; unit ~45%, integration ~20%.

## Important URLs / Credentials

- **Local run:** Open `index.html` (or serve static files) after `npm run build`; game bundle: `dist/game-bundle.js`.
- **Repo:** Private (no public URL).
- **Staging / API / Admin:** N/A (no backend).
