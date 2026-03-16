# Dusts of Reality (DoR)

**A tactical, team-based card game for browser (and future mobile) where you build decks, pick from seven classes, and play turn-based matches with Aether Surge and Waste mechanics.**

---

## Table of Contents

- [Overview / Motivation](#overview--motivation)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage / Getting Started](#usage--getting-started)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [FAQ](#faq)

---

## Overview / Motivation

**Dusts of Reality** is a browser-based recreation and evolution of a Unity mobile card game. It exists to fill a gap for **strategic mobile-style card games** that balance depth and accessibility: 10–15 minute sessions, team-based play (1v1 up to 4v4), and fair progression (cosmetics-first, not pay-to-win). The project targets strategy enthusiasts (18–35), casual mobile gamers (13+), and players who want meaningful cooperation without long time commitments. The current build is a **single-player prototype** with AI opponents; backend and multiplayer are planned later.

---

## Key Features

- **Turn-based card combat** — Play cards into an Aether Surge, resolve effects, then move cards to Waste; strict phase flow (PlayerTurn → ResolvingEffects → EnemyTurn).
- **Seven character classes** — Each class has a fixed hand composition (e.g. Gladiator: 2 Attack, 1 Defense); classes unlock after your first completed game.
- **Aether Surge & Waste** — Cards contribute to a surge phase before resolution; waste piles track used cards with future Compress/Reclaim interactions planned.
- **Drag-and-drop + targeting** — Select cards, choose valid targets with highlight UI, cancel or confirm; AI uses the same actions via strategy-based logic.
- **Redux-driven state** — Single source of truth for match state, progression, and cosmetics; predictable state and DevTools-friendly.
- **Progression persistence** — Unlocked classes, loadouts, saved decks, and cosmetic inventory saved to `localStorage` (no backend yet).
- **Vanilla TypeScript + esbuild** — No React/Vue in the game bundle; shared core logic is ready for a future mobile build (e.g. React Native).

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| **Frontend** | Vanilla TypeScript, HTML5, CSS |
| **State**    | Redux Toolkit (`gameSlice`, `cosmeticsSlice`) |
| **Build**    | esbuild (single IIFE bundle → `dist/game-bundle.js`) |
| **Persistence** | `localStorage` via `progression.ts` (no backend/DB) |
| **Backend / APIs** | None (planned: Node.js, REST + WebSockets) |

**Dependencies:** `@reduxjs/toolkit`; **dev:** `esbuild`.

---

## Installation

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- No environment variables required for local play

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mobile-card-game
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the game bundle**

   ```bash
   npm run build
   ```

   This produces `dist/game-bundle.js` (TypeScript + Redux entry compiled for the browser).

4. **Run locally**

   - **Option A:** Open `index.html` directly in your browser (file protocol). Some browsers may restrict script loading; if the game does not load, use Option B.
   - **Option B:** Serve the project root with any static server, then open the given URL (e.g. `http://localhost:8080`):

   ```bash
   npx serve .
   ```

   Or with Python:

   ```bash
   python -m http.server 8000
   ```

   Then open `http://localhost:8000` in your browser.

**Watch mode (development):** `npm run watch` — rebuilds the bundle on file changes.

---

## Usage / Getting Started

1. Open the game (via `index.html` or a static server as above).
2. In the setup modal, choose your **player class** and **team size** (e.g. 1v1 or 2v2).
3. Click **Start Game**. Your hand appears at the bottom; the opponent team is at the top.
4. **Your turn:** Drag a card into the surge area (or use the play area as instructed). If the card requires a target, click a valid enemy (highlighted). When done with your plays, click **End Turn** (or **Pass** if you have no plays).
5. **Resolution:** Effects resolve (damage/heal/buff/debuff); cards move to Waste and the surge ends.
6. **Enemy turn:** The AI plays its cards; when it passes or finishes, the turn advances back to you.
7. Play continues until one team has no characters left — you win or lose.

**Example: quick 1v1**

- Class: **Gladiator** (2 Attack, 1 Defense).
- Team size: **1v1**.
- Start → play an attack card → select the enemy avatar as target → End Turn → wait for AI → repeat until victory or defeat.

---

## Architecture Overview

The app is a **single-page, client-only** game. The **UI layer** (`index.html`, `scripts/ui-manager.js`, `scripts/main.js`) subscribes to the Redux store and drives **vanilla-cosmetics** components (Battlefield, PlayerHand, Card, PlayerAvatar). User actions (play card, select target, pass, resolve effects, end surge) are dispatched into **gameSlice**. **Game logic** (match init, turn flow, effect utils, perk runner) and **AI** (strategies, logic) operate on that state. Progression is persisted to **localStorage** via the progression module; there is no server or database.

**Data flow:** User drags a card → UIManager handles drop → dispatches `playCardAction` (or `selectTargetAction`) → gameSlice updates `currentMatch` (hand, activeSurge, phase, pendingAction, validTargets) → UIManager re-renders from the store. When the phase is `ResolvingEffects`, the UI (or AI path) dispatches `effectsResolved` then `endAetherSurgeAction` → cards move to waste, turn may advance → AI runs via `handleAITurn` and dispatches its own actions.

```
┌─────────────────────────────────────────────────────────────────┐
│  User (Browser) — index.html, setup modal, drag cards, targets  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  UI Layer — scripts/ui-manager.js, main.js                       │
│  Subscribe to Redux, DOM updates, dispatch(actions), AI trigger  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Components — Battlefield, Card, PlayerHand, PlayerAvatar        │
│  (src/vanilla-cosmetics/components/)                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  State — Redux store (gameSlice, cosmeticsSlice), progression   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Game Logic — matchInit, turnFlow, effectUtils, perkRunner      │
│  AI — ai/index.ts, logic.ts, strategies.ts                      │
│  Data — data/cards.ts, classes.ts, abilities.ts, perks.ts       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Persistence — localStorage (progression, loadouts, decks)      │
└─────────────────────────────────────────────────────────────────┘
```

For full component descriptions and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## API Documentation

There is **no REST or public API** in this project. The game runs entirely in the browser. The only “API” is the **Redux store and actions** exposed for the UI and the **entry bridge** (`src/entry/browserStore.ts`) consumed by `index.html` via `dist/game-bundle.js`. For internal usage, see `src/state/gameSlice.ts` and `src/state/store.ts`.

---

## Contributing

This is currently a **private, solo-developed** prototype. If the project is opened for contributions later, contribution guidelines (branching, PRs, code style) will be added here or in a separate `CONTRIBUTING.md`.

---

## Roadmap

See **[ROADMAP.md](./ROADMAP.md)** for the full product roadmap.

**Summary:**

- **Now (next ~4 weeks):** Effect resolution pipeline (real damage/heal/buff/debuff), basic deck builder UI, tutorial/onboarding overlay, targeting and single-player polish.
- **Next:** Aether Surge energy UI, Waste Compress/Reclaim, full deck builder, AI strategy refinement, backend + multiplayer (matchmaking, WebSockets), mobile build.
- **Later:** Card acquisition, cosmetics Phase 2+, seasonal content, community features.

---

## License

Private project; no public license specified. All rights reserved. See repository or contact the maintainer for usage terms.

---

## FAQ

**Do I need a backend or account to play?**  
No. The game runs entirely in the browser. Progression is stored in `localStorage` on your device.

**Why does the game not load when I open index.html directly?**  
Some browsers block script loading via `file://`. Use a local static server (e.g. `npx serve .` or `python -m http.server 8000`) and open the URL in your browser.

**Where is the game state stored?**  
In memory (Redux) during a session, and in `localStorage` for progression (unlocked classes, loadouts, saved decks, cosmetic inventory). No cloud or database.

**Is effect damage/heal actually applied yet?**  
Effect resolution is in progress; some damage/heal/buff/debuff may still be placeholders. See [PROJECT_SPECS.md](./PROJECT_SPECS.md) and [ROADMAP.md](./ROADMAP.md) for current status.

**Can I play multiplayer?**  
Not yet. Multiplayer (matchmaking, WebSockets, server-authoritative validation) is planned after the single-player MVP.

**What Node version do I need?**  
Node 18+ (LTS recommended). The build uses esbuild and has no special Node API requirements.
