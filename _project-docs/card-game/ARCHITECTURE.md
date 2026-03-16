# Dusts of Reality (DoR) — Architecture

## 1. Overview

**Dusts of Reality** (*DoR*) is a tactical, team-based card game built for a future mobile release. The current implementation runs in the browser as a vanilla TypeScript application. Players choose a class, configure teams (human + AI allies vs AI opponents), and play turn-based matches where cards are played into an **Aether Surge**, contribute elemental energy, then move to a **Waste** pile after effect resolution. The game enforces strict hand composition by class (e.g., Gladiator = 2 Attack, 1 Defense), supports card targeting, and uses Redux as the single source of truth for match state, progression, and cosmetics.

End-to-end flow: the user interacts with **index.html** and **UIManager** (scripts), which subscribe to the Redux store and drive **vanilla-cosmetics** components (Battlefield, PlayerHand, Card, PlayerAvatar). Game actions (play card, select target, pass, resolve effects, end surge) are dispatched into **gameSlice**; **gameLogic** (matchInit, turnFlow, effectUtils, playerActions, perkRunner) and **AI** (strategies, logic) operate on that state. Progression (unlocked classes, cosmetics, loadouts, saved decks) is persisted to **localStorage** via the progression module; there is no backend or database yet.

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  User (Browser)                                                              │
│  — Opens index.html, uses setup modal, drags cards, clicks targets           │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Presentation / UI Layer                                                     │
│  — index.html (markup, game board, modals, surge bar, waste icons)           │
│  — scripts/ui-manager.js (subscribes to Redux, maps state → DOM, drag/drop,  │
│    targeting, dispatches actions, calls Battlefield.updateSurge, AI trigger)│
│  — scripts/main.js (wires UIManager, game setup)                             │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ DOM updates, dispatch(actions)
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Vanilla Cosmetics (Component Layer)                                         │
│  — Battlefield.ts (drop zones, surge area, updateSurge, target highlights)   │
│  — Card.ts, PlayerHand.ts, PlayerAvatar.ts (render from state, animations)  │
│  — CosmeticStore (pub/sub), CosmeticInventory, DeckBuilder                    │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ read state, call component APIs
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  State Layer (Redux)                                                         │
│  — store.ts (game + cosmetics reducers)                                      │
│  — gameSlice.ts (currentMatch, progression, cardPool; match/turn/surge/waste)│
│  — progression.ts (load/save to localStorage)                               │
│  — slices/cosmeticsSlice.ts (inventory, equipped)                           │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ actions in, state out
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Business Logic Layer                                                        │
│  — gameLogic/matchInit.ts (initialize teams, decks, hands, match state)      │
│  — gameLogic/turnFlow.ts (advanceTurn, phase transitions)                   │
│  — gameLogic/playerActions.ts (playCards, hand removal)                     │
│  — gameLogic/effectUtils.ts (resolveEffects — damage/heal/buff/debuff)        │
│  — gameLogic/matchUtils.ts (checkWinCondition, isDraw)                       │
│  — gameLogic/perkRunner.ts (evaluatePerks on play)                          │
│  — gameLogic/classUnlocking.ts (handleFirstGameCompletion)                 │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│  AI Module                    │   │  Data Layer (static)           │
│  — ai/index.ts (handleAITurn) │   │  — data/cards.ts (allCards)    │
│  — ai/logic.ts, strategies.ts │   │  — data/classes.ts            │
│  — ai/types.ts                │   │  — data/abilities.ts, perks.ts │
└───────────────────────────────┘   └───────────────────────────────┘
                │
                │ dispatch(playCardAction, effectsResolved, endAetherSurgeAction, …)
                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Entry / Bridge                                                              │
│  — src/entry/browserStore.ts (exposes store, actions, buildTeamsFromSetup,   │
│    startMatchFromSetup, handleAITurn, vanilla components on window)           │
│  — Consumed by index.html via dist/game-bundle.js (esbuild)                  │
└─────────────────────────────────────────────────────────────────────────────┘

                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Data / Persistence                                                          │
│  — localStorage (progression: unlockedClasses, playerLevel, cosmeticInventory,│
│    loadouts, savedDecks, firstGameCompleted, currency)                       │
│  — No backend, no DB, no external APIs (all planned)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Data flow (simplified):** User drags card → UIManager handles drop → dispatches `playCardAction` (or `selectTargetAction` if targeting) → gameSlice updates `currentMatch` (hand, activeSurge, phase, pendingAction, validTargets) → UIManager re-renders hand/battlefield/surge from store. When phase is `ResolvingEffects`, UIManager (or AI path) dispatches `effectsResolved` then `endAetherSurgeAction` → cards move to waste, turn may advance → AI may run via `handleAITurn` and dispatch its own actions.

---

## 3. Component Descriptions

### 3.1 Presentation / UI (index.html + scripts)

- **Name:** Presentation / UI layer  
- **Purpose:** Renders the game board, setup modal, surge bar, waste icons, and player hand; handles user input and bridges to Redux and vanilla components.  
- **Technology:** HTML5, CSS, vanilla JavaScript (scripts/ui-manager.js, scripts/main.js).  
- **Key responsibilities:**
  - Subscribe to Redux store and map state to DOM (hand, battlefield, turn indicator, surge bar).
  - Implement drag-and-drop and targeting (valid targets, cancel).
  - Dispatch game actions (playCardAction, selectTargetAction, cancelTargetingAction, playerPassAction, effectsResolved, endAetherSurgeAction).
  - Call Battlefield.updateSurge and animation hooks; trigger handleAITurn when phase is EnemyTurn.
  - Game setup: read form, call startMatchFromSetup (via window).
- **Dependencies:** Redux store and actions, Battlefield/PlayerHand/PlayerAvatar, startMatchFromSetup, handleAITurn (all provided by dist/game-bundle.js).  
- **Failure mode:** If the bundle or store is missing, UI shows a warning and game actions no-op; match state does not change.

### 3.2 Vanilla Cosmetics (component layer)

- **Name:** Vanilla Cosmetics  
- **Purpose:** TypeScript components that render game objects (cards, hand, battlefield, surge area, avatars) and cosmetics (inventory, deck builder) without a framework.  
- **Technology:** TypeScript, vanilla DOM, CSS (including component styles).  
- **Key responsibilities:**
  - Battlefield: drop zones, surge area, updateSurge (add/remove surging cards), target highlighting, removeSurgeComponentReference.
  - Card: render card data, drag start, animateToSurge / animateFromSurge, flip animations.
  - PlayerHand: render list of cards for a player.
  - PlayerAvatar: represent player/team.
  - CosmeticStore (pub/sub), CosmeticInventory, DeckBuilder for cosmetics and deck UI.
- **Dependencies:** Redux state (consumed indirectly via UIManager); core types from src/types/game.ts; cosmetic types from vanilla-cosmetics/types.  
- **Failure mode:** Component errors can leave DOM out of sync with state or break drag/targeting; surge animations may not run if lifecycle hooks are not called in order.

### 3.3 State layer (Redux)

- **Name:** State layer  
- **Purpose:** Single source of truth for match (teams, turn, phase, surge, waste, history), progression (unlocked classes, level, cosmetics, loadouts, saved decks), and cosmetics (inventory, equipped).  
- **Technology:** Redux Toolkit, TypeScript.  
- **Key responsibilities:**
  - gameSlice: startNewMatch, playCardAction, selectTargetAction, cancelTargetingAction, playerPassAction, effectsResolved, endAetherSurgeAction; thunks loadInitialProgression, updateProgression; setCardPool.
  - progression: loadProgression / saveProgression (localStorage).
  - cosmeticsSlice: loadCosmeticsFromProgression, equip items, inventory.
- **Dependencies:** gameLogic (matchInit, turnFlow, effectUtils, playerActions, perkRunner, matchUtils, classUnlocking), data (cards, classes, abilities), types/game.  
- **Failure mode:** If reducers throw or state is corrupted, the UI can freeze or show stale data; persistence failures leave progression only in memory.

### 3.4 Business logic (gameLogic)

- **Name:** Game logic layer  
- **Purpose:** Match initialization, turn advancement, card play, effect resolution, win condition, perks, and class unlocking.  
- **Technology:** TypeScript, pure functions and small modules.  
- **Key responsibilities:**
  - matchInit: build initial MatchState (teams, decks, hands, empty surge/waste, turn order).
  - turnFlow: advanceTurn (next player/team, phase transitions).
  - playerActions: playCards (remove from hand, validate), PlayedCardsInfo.
  - effectUtils: resolveEffects (damage/heal/buff/debuff from card/ability/perk).
  - matchUtils: checkWinCondition, isDraw.
  - perkRunner: evaluatePerks (on_play_card, on_play_red, etc.).
  - classUnlocking: handleFirstGameCompletion (unlock medium classes).
- **Dependencies:** src/types/game, data/abilities, data/perks, data/classes.  
- **Failure mode:** Bugs here can desync state (e.g., wrong phase, cards not removed, effects not applied); win condition or turn order can be wrong.

### 3.5 AI module

- **Name:** AI module  
- **Purpose:** Decide and execute AI opponent turns (card plays, targeting, pass).  
- **Technology:** TypeScript, strategy-style heuristics.  
- **Key responsibilities:**
  - handleAITurn(store): read currentMatch, if EnemyTurn pick actions and dispatch playCardAction / selectTargetAction / effectsResolved / endAetherSurgeAction / playerPassAction as needed.
  - Strategies and scoring (e.g., default strategy) in logic.ts / strategies.ts.
- **Dependencies:** Redux store, gameSlice actions, game types, data (cards, classes).  
- **Failure mode:** AI can make invalid moves if state is misinterpreted; if AI never dispatches endAetherSurgeAction or pass, turn can stall.

### 3.6 Data layer (static)

- **Name:** Data layer (static)  
- **Purpose:** Provide card definitions, classes, hand compositions, abilities, and perks.  
- **Technology:** TypeScript, static modules (no DB).  
- **Key responsibilities:**
  - cards: allCards (card pool for deck building and match init).
  - classes: CLASSES_BY_ID, MEDIUM_CLASSES, hand compositions.
  - abilities: ABILITIES_BY_ID (for loadouts).
  - perks: perk definitions for perkRunner.
- **Dependencies:** src/types/game.  
- **Failure mode:** Missing or invalid data can cause matchInit or effect resolution to fail or produce incorrect decks/effects.

### 3.7 Entry / bridge (browserStore)

- **Name:** Entry / bridge  
- **Purpose:** Build the browser bundle and expose store, actions, and vanilla components on `window` so index.html and UIManager can use them without a separate module loader.  
- **Technology:** TypeScript, esbuild (IIFE bundle).  
- **Key responsibilities:**
  - Export store, startNewMatch, buildTeamsFromSetup, startMatchFromSetup, game actions, handleAITurn, Battlefield, PlayerHand, PlayerAvatar to window.
  - Single entry: src/entry/browserStore.ts → dist/game-bundle.js.
- **Dependencies:** state/store, gameSlice, vanilla-cosmetics components, ai/index, data/classes, types.  
- **Failure mode:** Build errors or missing exports prevent the game from loading in the browser.

### 3.8 Persistence (localStorage)

- **Name:** Persistence  
- **Purpose:** Save and load progression so unlocked classes, level, cosmetics, loadouts, and saved decks survive reloads.  
- **Technology:** Browser localStorage, progression.ts API.  
- **Key responsibilities:**
  - loadProgression / saveProgression; used by loadInitialProgression and updateProgression thunks.
- **Dependencies:** None (browser API).  
- **Failure mode:** Quota or privacy restrictions can prevent save; data is device-specific and can be cleared by user.

---

## 4. Data Model

### 4.1 Key entities (in-memory; no DB)

- **Card:** id, name, type (Attack/Defense/Buff/Debuff), color (Black/White/Red/Blue/Green/Yellow), description, requiresTarget?, effectType?, effectValue?.  
- **Player:** id, name, isAI, class (GameClass), deck, hand, stats (e.g. health).  
- **Team:** id, name?, players[].  
- **MatchState:** teams, turnOrder, currentTurnTeamId, currentPlayerId, playedCardsThisTurn, activeSurge (card → playerId), wastePiles (playerId → Card[]), winnerTeamId, matchPhase, pendingAction, validTargets, gameHistory, surgeEnergy?, abilityCooldowns?.  
- **GameClass / HandComposition:** class id, difficulty, handComposition (Attack/Defense/Buff/Debuff counts).  
- **ProgressionState:** unlockedClasses, playerLevel, firstGameCompleted, cosmeticInventory, currency, loadouts, currentLoadoutId, savedDecks.  
- **CosmeticInventory:** battlefieldSkins, cardFaces, cardGlyphs, cardSleeves, cardEffects, playerAvatars, avatarAccessories; equipped (ids for each slot).  
- **Loadout:** id, name, deckId, abilityIds, perkIds, slotSplit (3P2A | 2P3A).  
- **SavedDeck:** id, name, cardIds, classId.

### 4.2 Relationships

- MatchState references Team[] and, through teams, Player[]; each Player has deck and hand (Card[]). activeSurge and wastePiles key by playerId.  
- ProgressionState holds CosmeticInventory and Loadout[]; Loadout references deckId and ability/perk ids. SavedDeck references classId and cardIds.  
- Card pool is global (cardPool in GameState); matchInit builds decks from it (and class rules).

### 4.3 Schema rationale

- **Single MatchState object:** Fits Redux (single tree); phases and pendingAction keep UI and AI in sync.  
- **activeSurge as Record:** Quick lookup by card id for targeting and surge-end; playerId tracks ownership for waste.  
- **wastePiles by playerId:** Each player has their own discard pile for future “Reclaim”/“Compress” mechanics.  
- **Progression in localStorage:** No backend yet; progression is local and loaded on app init.  
- **CosmeticInventory as records keyed by id:** Easy equip/lookup; denormalized for simplicity.

### 4.4 Denormalization / caching

- cardPool is set once (setCardPool(allCards)) and reused for deck building and match init.  
- No server or shared cache; all “caching” is in-memory Redux state and static data modules.

---

## 5. Technology Decisions

| Choice | Why | Alternatives considered |
|--------|-----|---------------------------|
| **TypeScript** | Type safety, better refactors, clearer contracts between gameLogic/state/UI. | JavaScript; Flow. |
| **Redux Toolkit** | Predictable state, devtools, good fit for turn-based game state and progression. | MobX, Context API, framework-specific state. |
| **Vanilla TS + DOM for current UI** | Browser-first MVP without committing to a mobile framework; logic stays in TS and can be reused. | React/React Native from day one (chosen for later). |
| **esbuild for bundle** | Fast single bundle (game-bundle.js), IIFE for script tag, no extra config. | Webpack, Vite, Parcel (Vite recommended for future). |
| **UIManager in plain JS** | Quick iteration with index.html and script tags without importing Redux in a second bundle. | Full TS app with single entry and module UI. |
| **localStorage for progression** | No backend yet; sufficient for single-device persistence. | IndexedDB (more space; deferred), backend (planned). |
| **Static data (cards, classes, abilities, perks)** | No content server; all definitions in code. | JSON/DB (when backend exists). |
| **Strategy-style AI** | Swappable behaviors, testable; good enough for MVP. | Full ECS, behavior trees (considered for later). |
| **Immutable match state updates** | Redux and predictability; no accidental mutations. | Mutable state (rejected). |
| **REST + WebSockets (planned)** | Standard HTTP + real-time for future multiplayer. | GraphQL, gRPC. |
| **Backend: monolith first (planned)** | Simpler MVP; can split later. | Microservices from start. |

---

## 6. Scalability

- **Current:** Single-user, single tab, no backend. “Scale” is local (match state size, number of cards/players).  
- **Horizontal scaling:** N/A until backend exists.  
- **Caching:** No CDN or API cache; static assets are just local files.  
- **Database:** No DB; progression is localStorage (size limits ~5–10 MB per origin).  
- **API rate limiting:** N/A.  
- **Future:** Backend will need session/match storage, possibly Redis for presence; WebSockets for real-time sync; DB for users, progression, and match history.

---

## 7. Security

- **Authentication / authorization:** None yet; no user accounts. Planned: JWT, server-side validation.  
- **Encryption:** No sensitive data at rest beyond what the browser stores; HTTPS for future hosted build.  
- **Secrets:** No server secrets in this repo; any API keys would be env/config (not committed).  
- **Access control:** N/A for current single-player/local setup.  
- **Game integrity:** Effect resolution and win condition run in client only; future multiplayer will require server-side validation to prevent cheating.

---

## 8. Deployment

- **Environments:** Development (local server + `npm run build` / `npm run watch`); no formal staging/prod yet.  
- **CI/CD:** No pipeline in repo yet; GitHub Actions mentioned in techContext for future (tests, builds, TestFlight/Play).  
- **Infrastructure:** Static HTML + JS + dist/game-bundle.js; can be served by any static host (e.g. GitHub Pages, Vercel, or file:// for local).  
- **Monitoring / alerting:** None; optional future: Sentry, Firebase Crashlytics, analytics.

---

## 9. Future Improvements

- **Effect resolution:** Replace placeholders with full effect pipeline and clearer targeting/ability/perk ordering.  
- **Aether Surge energy UI:** Show surge energy calculation and feedback (e.g. bar/meter).  
- **Waste pile UI:** Scrollable view and Compress/Reclaim interactions.  
- **AI:** Consider Surge/Waste in strategy; fix any remaining render/state bugs for multiple AI players.  
- **Deck building UI:** Full create/edit flow using cardPool and SavedDeck.  
- **Tutorial:** Onboarding that explains Surge/Waste and classes.  
- **Backend + multiplayer:** Matchmaking, WebSockets, server-authoritative validation, user accounts.  
- **Mobile:** React Native (or chosen framework) with shared core logic and new UI layer.  
- **Bundler:** Move to Vite for dev server, HMR, and cleaner browser build.  
- **Testing:** Higher unit/integration coverage; E2E for critical flows.

See [ROADMAP.md](ROADMAP.md) and memory-bank/progress.md for current priorities and known issues.
