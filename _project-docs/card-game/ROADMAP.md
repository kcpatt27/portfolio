# DoR (Dusts of Reality) — Product Roadmap

## 1. Vision Statement

**DoR** (*Dust of Reality*) is a tactical, team-based card game built for a future mobile release. The ultimate goal is to create an engaging, accessible card game that offers depth for seasoned players while remaining approachable for newcomers—fostering a community around team play, strategic decision-making, and deck customization.

- **What problem does it solve?**  
  Fills a gap for strategic mobile card games that balance depth and accessibility; offers real-time team-based play (vs. single-player or async), 10–15 minute sessions, and fair progression (cosmetics-first monetization, not pay-to-win).

- **Who is it for?**  
  Strategy enthusiasts (18–35), casual mobile gamers (13+), and players who want meaningful cooperation and session-length-friendly matches.

- **What success looks like in 1–2 years?**  
  A playable browser MVP, then a mobile build (iOS/Android) with single-player and early multiplayer; a sustainable player base, clear path to cosmetics monetization, and a foundation for seasonal content and community features.

---

## 2. Current Status

- **Version:** v0.1.0 (pre-release)
- **Release date:** N/A (pre-alpha, internal/solo development)
- **Availability:** Private, browser-only prototype

**Key milestones completed**

- Core game state (Redux), turn flow, class system (7 classes, hand composition, unlocking)
- Aether Surge & Waste state logic and basic UI (surge zone, animations, waste icons)
- Card play flow: drag-and-drop, targeting UI (highlights, cancel), play → surge → effectsResolved → endAetherSurge
- AI opponent (strategy-based, passes correctly, turn advancement fixed)
- Vanilla components: Card, PlayerHand, Battlefield, PlayerAvatar; CosmeticStore; progression persisted to localStorage
- Bug fix pass: MatchState imports, unique card instance IDs, AI phase/trigger, pendingAction/targeting, Immer/state updates, UIManager payload, dead reducer removal

**Metrics (current)**

- No users yet (solo dev, no launch)
- Core loop: play card → surge → resolve → waste → advance turn — functional in browser
- Progression: unlocked classes, loadouts, saved decks, cosmetic inventory (localStorage)

---

## 3. Now (Next 4 Weeks)

Priorities for the next month: finish the single-player MVP loop, real effect resolution, and basic deck/tutorial UX.

### Effect Resolution Pipeline

**Why:** Right now effects are placeholders; damage/heal/buff/debuff don’t change game state. Needed for meaningful matches and win/loss.

**Impact:** Enables real single-player games, AI that plays for effect, and a foundation for balance and future abilities.

**Status:** In progress (Phase 1 in activeContext: minimal effect types + `resolveEffects` + UI feedback)

---

### Deck Builder UI (Basic)

**Why:** Players need to view the card pool, build/edit decks, and save loadouts. Required for progression and testing.

**Impact:** Unlocks “collection + deck building” loop and validates class/composition rules in real use.

**Status:** Planned (Phase 2 in implementation plan)

---

### Tutorial / Onboarding Overlay

**Why:** New players need a clear explanation of Surge, Waste, and basic flow. Reduces confusion and supports retention.

**Impact:** Better first-run experience and fewer “what do I do?” drop-offs.

**Status:** Planned (Phase 3 in implementation plan)

---

### Targeting & Single-Player Polish

**Why:** Targeting UI is in place but needs testing and polish; temporary immediate dispatch of `effectsResolved`/`endAetherSurgeAction` should be replaced by proper timing.

**Impact:** Reliable, predictable single-player sessions and fewer state/UI bugs.

**Status:** In progress

---

### Single-Player MVP Loop Closure

**Why:** Tie together: setup → match → play → resolve effects → surge → waste → win/loss → progression save. Defines “playable MVP.”

**Impact:** Delivers a shippable offline single-player experience and a clear milestone for alpha.

**Status:** In progress (blocked by effect resolution and polish)

---

## 4. Next (Months 2–3)

Items that follow once the “Now” phase is in good shape.

### Aether Surge Energy UI

**Why:** Surge energy calculation exists in design; players need visible feedback (bar/meter) for strategic decisions.

**Impact:** Makes elemental/surge strategy readable and increases depth perception.

**Status:** Planned (pending idea generation in progress)

---

### Waste Pile Scrollable View

**Why:** Waste is currently icon-only; Compress/Reclaim and future mechanics need a clear view of discarded cards.

**Impact:** Enables Waste interaction and future card recovery mechanics.

**Status:** Planned (pending idea generation)

---

### Deck Builder & Collection Viewer (Full)

**Why:** Extend basic deck UI with filtering, sorting, and a simple collection view tied to progression.

**Impact:** Completes the “build deck → play → progress” loop and prepares for card acquisition.

**Status:** Planned

---

### AI Strategy Refinement

**Why:** AI should consider Surge/Waste, targeting value, and simple team play; multi-AI rendering bug may need fixing.

**Impact:** More satisfying single-player and better test bed for balance.

**Status:** In progress (partial), refinement planned

---

### Effect Visualizations (Placeholders → Real Feedback)

**Why:** Replace placeholders with clear damage/heal/buff/debuff feedback (numbers, highlights, simple VFX).

**Impact:** Better feel and clarity without full art pipeline.

**Status:** Planned (Phase 4 in implementation plan)

---

### Class / Element Pairing Effects

**Why:** Draft pairing effects (Synergistic/Parasitic/Neutral) exist; selection and implementation add class identity.

**Impact:** Deeper class differentiation and replay value.

**Status:** Drafts complete, review/selection pending

---

### Vite + Dev Experience

**Why:** Current esbuild script is minimal; Vite gives dev server, HMR, and a cleaner path to future React/mobile.

**Impact:** Faster iteration and easier onboarding.

**Status:** Recommended in techContext, not started

---

### Testing & Stability

**Why:** Unit/integration coverage is partial; E2E not started. Needed before alpha and multiplayer.

**Impact:** Fewer regressions and safer refactors.

**Status:** In progress (unit ~45%, integration ~20%)

---

## 5. Later (Exploratory / Future)

Nice-to-haves and longer-term bets.

| Item | Description | Rough priority |
|------|-------------|----------------|
| **Backend + Multiplayer** | Matchmaking, WebSockets, server-authoritative validation, user accounts | P0 (post-MVP) |
| **Mobile build** | React Native (or chosen framework) with shared core logic and new UI | P0 |
| **Card acquisition / pack opening** | Fragment Emergence / Aetheric Resonance thematics, discovery UX | P1 |
| **Cosmetics Phase 2+** | Player Avatars, full cosmetic integration, monetization hooks | P1 |
| **Social features** | Friends, chat, guilds/clans (deferred post-MVP) | P2 |
| **Campaign / story mode** | Structure and content (documented, deferred) | P2 |
| **Battle pass / virtual currency** | Monetization (deferred post-MVP) | P2 |
| **Objective-based victory** | Alternative win conditions (idea generation pending) | P2 |
| **Full ECS for card behaviors** | Extensibility for complex effects (evaluated, hybrid for MVP) | P3 |
| **Analytics & monitoring** | Event taxonomy, Sentry/Firebase, performance | P2 |

---

## 6. Decision Framework

Priorities are set by:

1. **MVP completeness** — Does it unblock “play a full single-player match and feel the loop?” (effect resolution, deck builder, tutorial, save/load.)
2. **User experience** — Clarity of Surge/Waste, targeting, and feedback over extra features.
3. **Technical debt** — Fixing bugs and state/UI consistency before adding scope (e.g. 10-bug fix pass).
4. **Future-proofing** — Choices that keep a path to mobile and multiplayer (e.g. Redux, platform-agnostic gameLogic).
5. **Solo capacity** — Scope that one developer can ship and maintain (browser first, then mobile; backend when needed).

---

## 7. Risks & Dependencies

| Risk / dependency | Mitigation |
|-------------------|------------|
| **No backend yet** | Single-player and localStorage progression are sufficient for MVP; backend when multiplayer or accounts are needed. |
| **Effect resolution complexity** | Start with minimal effect types (damage, heal, buff/debuff); expand incrementally. |
| **Vanilla → mobile migration** | Keep gameLogic and state in platform-agnostic TS; treat DOM/vanilla UI as replaceable layer; React Native recommended. |
| **Solo resource constraint** | Clear “Now” vs “Next” vs “Later”; defer social, battle pass, and advanced monetization. |
| **AI / multi-player rendering** | Fix in “Next”; single-player MVP works with current AI. |
| **Performance (animations, many cards)** | Profile on target devices; simplify or throttle animations if needed; 60 FPS target. |
| **localStorage limits** | Acceptable for MVP; plan migration to backend or IndexedDB when progression outgrows it. |

---

## 8. Success Metrics

- **MVP (next ~4 weeks):** Full single-player match playable (setup → play → resolve → surge → waste → win/loss), progression save/load, basic deck builder and tutorial.
- **Stability:** No critical regressions in play/targeting/turn flow; build and smoke test passing.
- **Code health:** Unit coverage for gameLogic and state; key flows covered by integration tests.
- **Later:** User growth and retention (when launched); feature adoption (deck builder, cosmetics); performance (frame rate, load time) and community feedback.

---

## 9. Feedback & Iteration

- **Internal:** Memory bank (`activeContext.md`, `progress.md`) and plan docs (e.g. `.cursor/plans/`) drive what gets built next; review and update as work completes.
- **No external users yet:** When the game is shared (alpha/beta), feedback will be collected via GitHub issues, Discord, or in-app and weighted by impact on core loop and retention.
- **Review cadence:** Roadmap and “Now” priorities reviewed when a phase completes or when scope/constraints change; “Next” and “Later” updated accordingly.

---

*Honest note: This roadmap reflects a solo, pre-alpha project. Dates are directional; “Now” is the next 4 weeks of focus, “Next” is 2–3 months after that, and “Later” is exploratory. Priorities will shift with learnings and capacity.*
