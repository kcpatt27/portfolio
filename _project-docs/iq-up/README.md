# IQ Up! – IQ Training Platform

A browser-based training application that helps users improve performance on Raven's Progressive Matrices and Mensa-style visual-spatial intelligence tests through simulated practice tests, spaced repetition review, performance analytics, and a structured 6-week training calendar.

## Table of Contents

- [Project Status](#project-status)
- [Overview](#overview)
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

## Project Status

**Status**: 30% Complete (MVP core features shipped; much still missing)

**Progress**: `██████░░░░░░░░░░░░░░░░` 30%

**Completed Features**:
- ✅ Core MVP: Database, deterministic question generator, test runner (timed/drill), results analytics, spaced repetition review, 6-week calendar
- ✅ Test coverage: 85 tests passing, automated accessibility checks
- ✅ UI polish: Tailwind design system, dark mode, responsive layouts
- ✅ Advanced generator: 14 primitive shapes, 10 rule families, near-infinite 3x3 variations

**In Progress**:
- Performance optimization (ETA: 2 weeks)
- Documentation & onboarding (ETA: 3 weeks)

**Planned**: Enhanced analytics, export/import, difficulty calibration — [See full roadmap](ROADMAP.md)

**Stats**:
- Test coverage: 85 tests passing (< 10s execution)
- Documentation: Complete (README, ARCHITECTURE, ROADMAP, SCHEMA)
- Performance: < 50ms median API response time
- Last updated: January 2025

## Overview

**IQ Up!** is designed for individuals preparing for intelligence tests like Raven's Progressive Matrices or Mensa admission exams. The platform provides a structured approach to improving pattern recognition speed and accuracy through:

- **Deterministic question generation** that ensures reproducible practice sessions
- **Timed and drill modes** for different training scenarios
- **Spaced repetition system (SRS)** that schedules review of incorrect answers using SM-2-lite algorithm
- **Performance analytics** that categorize errors and track improvement over time
- **6-week training calendar** that provides a structured daily practice plan

The application runs entirely on Cloudflare's edge infrastructure (Pages + Workers + D1), ensuring fast global performance with minimal operational overhead. It uses HTML-over-the-wire patterns (htmx) for progressive enhancement, keeping the frontend lightweight and accessible.

**Who is this for?** Test-takers preparing for intelligence assessments, students studying cognitive pattern recognition, or anyone looking to improve their visual-spatial reasoning skills through structured practice.

## Key Features

- **Deterministic Question Generator**: Creates reproducible Raven's-style matrix problems with exactly one correct answer per item, ensuring consistent practice conditions
- **Dual Test Modes**: Timed tests for realistic exam conditions, and drill mode for focused practice without time pressure
- **Keyboard-First Interface**: Full keyboard navigation with shortcuts (1-8 for choices, Enter to submit, F to flag, arrow keys for navigation)
- **Spaced Repetition Review**: SM-2-lite algorithm schedules incorrect answers for review, adapting intervals based on difficulty ratings (Hard/Good/Easy)
- **Performance Analytics**: Detailed results showing accuracy, response latency, error categorization, and flagged items
- **6-Week Training Calendar**: Visual calendar grid (Monday-aligned) with daily completion tracking
- **Progressive Enhancement**: Built with htmx for fast, accessible interactions without heavy JavaScript frameworks

## Tech Stack

- **Runtime**: Cloudflare Pages + Workers (edge computing)
- **Backend Framework**: Hono (TypeScript) for routing and request handling
- **Frontend**: HTML with htmx for progressive enhancement
- **Styling**: Tailwind CSS (CLI build) with custom design tokens
- **Database**: Cloudflare D1 (SQLite) for session storage, questions, answers, and review queue
- **Testing**: Vitest with snapshot testing for UI fragments
- **Deployment**: Cloudflare Pages/Workers with Wrangler CLI

## Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Cloudflare account**: For remote D1 database (optional for local development)

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd 10-up-IQ-booster
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the local database**:
   ```bash
   npm run db:apply
   ```
   This creates and applies the schema to a local D1 database (idempotent operation).

4. **Build CSS** (in a separate terminal for watch mode):
   ```bash
   npx tailwindcss -i ./styles/tailwind.css -o ./public/app.css --watch
   ```
   Or build once (minified):
   ```bash
   npx tailwindcss -i ./styles/tailwind.css -o ./public/app.css -m
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open the application**:
   Navigate to the URL printed by Wrangler (typically `http://127.0.0.1:8787` or `:8788`).

### Environment Setup

No environment variables are required for local development. The application uses:
- Local D1 database (automatically created with `npm run db:apply`)
- Cloudflare bindings configured in `wrangler.toml`

For production deployment, you'll need to:
1. Create a remote D1 database: `npm run db:create` (or `wrangler d1 create iq_booster`)
2. Update `wrangler.toml` with the `database_id` from the created database
3. Apply schema remotely: `npm run db:apply:remote`

## Usage / Getting Started

### Running Your First Test

1. **Start a test session**:
   - From the dashboard, click "Timed Test" or "Drill"
   - For timed mode, you'll have a time limit per question
   - For drill mode, take your time to analyze each pattern

2. **Answer questions**:
   - Use keyboard shortcuts: Press `1` through `8` to select an option
   - Press `Enter` to submit your answer
   - Press `F` to flag a question for later review
   - Use arrow keys to navigate between choices

3. **View results**:
   - After completing the test, you'll see accuracy, average response time, and error categorization
   - Incorrect answers are automatically added to your review queue

4. **Review incorrect answers**:
   - Navigate to the Review page to see items due for review
   - Grade each item as Hard, Good, or Easy
   - The SRS algorithm schedules the next review based on your rating

5. **Track progress with the calendar**:
   - View the 6-week training calendar
   - Toggle days to mark completion
   - Plan your daily practice schedule

### Example: Starting a Drill Session

```bash
# The application is running at http://127.0.0.1:8787

# 1. Navigate to the dashboard (GET /)
# 2. Click "Drill" button (POST /test/start with mode=drill)
# 3. Answer questions using keyboard shortcuts
# 4. Complete the test (POST /test/:id/finish)
# 5. Review results (GET /results/:id)
```

### Expected Output

After completing a test, you'll see:
- **Accuracy percentage**: Overall correct answers
- **Average latency**: Mean response time per question
- **Error breakdown**: Categories of mistakes (e.g., pattern recognition, spatial reasoning)
- **Flagged items**: Questions you marked for attention
- **Action buttons**: Add incorrect items to review queue, start a new test

## Architecture Overview

IQ Up! follows a serverless architecture pattern optimized for Cloudflare's edge network. The application uses HTML-over-the-wire principles to minimize client-side JavaScript while maintaining fast, interactive user experiences.

### System Components

```
┌─────────────┐
│   Browser   │  User accesses web app
└──────┬──────┘
       │ HTTPS
┌──────▼──────────────────┐
│  Cloudflare Pages       │  Static assets (HTML, CSS)
│  + Functions (Hono)     │  Server-side routing & logic
└──────┬──────────────────┘
       │
┌──────▼──────┐
│  Cloudflare │  SQLite database for sessions,
│     D1      │  questions, answers, review queue
└─────────────┘
```

### Data Flow

**Test Session Flow**:
1. User initiates test via POST `/test/start` (mode and question count)
2. Backend creates session in D1 and generates deterministic questions
3. Frontend renders first question panel via GET `/test/:id`
4. User submits answers via POST `/test/:id/answer` (htmx swaps next panel)
5. On completion, POST `/test/:id/finish` finalizes session and redirects to results

**Review Flow**:
1. Incorrect answers are enqueued into review queue (SRS table)
2. GET `/review` displays due items with prev/next navigation
3. POST `/review/:itemId/grade` updates SM-2-lite scheduling and shifts due dates

**Calendar Flow**:
1. GET `/calendar` renders 6-week grid (Monday-aligned)
2. POST `/calendar/:day/complete` toggles completion status (htmx swap)

### Key Design Decisions

- **Deterministic Generation**: Questions are generated from seeds, ensuring reproducible practice sessions and consistent difficulty
- **HTML-over-the-wire**: htmx enables dynamic interactions without heavy JavaScript, improving accessibility and performance
- **Edge-first**: Cloudflare Workers provide global low-latency responses without managing servers
- **SQLite (D1)**: Sufficient for MVP scale with simple relational data model; easy to migrate if needed

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## API Documentation

The application exposes RESTful endpoints for test sessions, results, review, and calendar management.

### Core Endpoints

| Method | Path | Purpose | Body Parameters |
|--------|------|---------|----------------|
| GET | `/` | Dashboard with quick actions | - |
| POST | `/test/start` | Create new test session | `mode=timed\|drill`, `question_count?` |
| GET | `/test/:id` | Render test runner (first panel) | - |
| POST | `/test/:id/answer` | Submit answer, get next panel (HTMX) | `choice`, `flagged?` |
| POST | `/test/:id/finish` | Finalize session, redirect to results | - |
| GET | `/results/:id` | Display accuracy, latency, errors | - |
| POST | `/results/:id/add-to-review` | Enqueue incorrect items to SRS | - |
| GET | `/review` | List due review items | - |
| POST | `/review/:itemId/grade` | Grade item, update SRS schedule | `grade=hard\|good\|easy` |
| GET | `/calendar` | 6-week calendar grid | - |
| POST | `/calendar/:day/complete` | Toggle day completion (HTMX) | - |

### Request/Response Examples

**Starting a Test**:
```bash
curl -X POST http://localhost:8787/test/start \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "mode=timed&question_count=20"
```

**Submitting an Answer** (HTMX):
```html
<form hx-post="/test/abc123/answer" hx-target="#panel-container">
  <input type="hidden" name="choice" value="3">
  <button type="submit">Submit</button>
</form>
```

**Grading a Review Item**:
```bash
curl -X POST http://localhost:8787/review/item456/grade \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grade=good"
```

### Keyboard Shortcuts (Runner Page)

- `1-8`: Select option
- `Enter`: Submit current selection
- `F`: Flag next answer
- `Arrow Keys`: Navigate between choices

## Contributing

This project is currently in active development. Contributions are welcome! Here's how to get started:

1. **Fork the repository** and clone your fork
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following existing code patterns
4. **Run tests**: `npm test` to ensure everything passes
5. **Test locally**: Use `npm run dev` to verify your changes work
6. **Submit a pull request** with a clear description of your changes

### Development Guidelines

- Follow TypeScript best practices and existing code style
- Write tests for new features (Vitest with snapshots for UI)
- Ensure accessibility (keyboard navigation, ARIA labels)
- Update documentation if adding new features or routes
- Keep commits focused and descriptive

### Testing

Run the test suite:
```bash
npm test          # Run once
npm run test:watch # Watch mode
```

Test coverage includes repositories, generator logic, route handlers, fragments, analytics, and SRS algorithms.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the complete roadmap. Current status:

**Completed (Phases 1-8)**:
- ✅ D1 database setup and repositories
- ✅ Deterministic question generator
- ✅ Test runner with HTMX fragments and keyboard shortcuts
- ✅ Results page with analytics and error categorization
- ✅ Spaced repetition review system (SM-2-lite)
- ✅ 6-week calendar with completion tracking
- ✅ Comprehensive test coverage

**In Progress**:
- Ongoing improvements to test coverage and edge cases

**Planned**:
- Enhanced analytics dashboard
- Additional question patterns and difficulty levels
- Export/import functionality for practice data
- Performance optimization for large question sets

## License

[Specify your license here - e.g., MIT, Apache 2.0, or proprietary]

## FAQ

### How does the deterministic question generator work?

Questions are generated from a seed value, ensuring that the same seed always produces the same question. This allows for reproducible practice sessions and consistent difficulty levels.

### Can I use this for actual Mensa preparation?

IQ Up! is designed to help improve pattern recognition skills similar to those tested in Raven's Progressive Matrices and Mensa exams. However, it's a training tool and not an official test. For actual Mensa admission, you'll need to take the official exam.

### Does the app work offline?

Currently, the application requires an internet connection as it runs on Cloudflare's edge infrastructure. Offline support is a potential future enhancement.

### How is my data stored?

All data is stored in Cloudflare D1 (SQLite) databases. For local development, data is stored in a local SQLite file. For production, data is stored in Cloudflare's managed D1 service.

### Can I customize the training calendar?

The calendar currently shows a fixed 6-week plan. Customizable calendar periods and training schedules are planned for future releases.

### What's the difference between Timed and Drill modes?

- **Timed mode**: Simulates exam conditions with time limits per question
- **Drill mode**: Allows unlimited time for careful analysis and learning

### How does the spaced repetition system work?

The SRS uses a simplified SM-2 algorithm. When you grade an item as Hard, Good, or Easy, it adjusts the interval until the next review. Easier items are scheduled further out, while harder items come up more frequently.

### Is there a mobile app?

Currently, IQ Up! is web-only. The interface is responsive and works on mobile browsers, but a dedicated mobile app is not in the current roadmap.

---

**Initial structure generated by Cursor AI, reviewed and refined manually.**
