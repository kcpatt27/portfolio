# IQ Up! Architecture

## System Overview

IQ Up! is a serverless web application built on Cloudflare's edge infrastructure that helps users improve their performance on Raven's Progressive Matrices and Mensa-style intelligence tests. The system follows an HTML-over-the-wire architecture pattern, using htmx for progressive enhancement to deliver fast, accessible interactions without heavy JavaScript frameworks.

The application operates entirely on Cloudflare Workers (via Pages Functions), with all business logic, question generation, and template rendering happening at the edge. Users interact with server-rendered HTML pages that are progressively enhanced with htmx for dynamic content updates. The deterministic question generator creates reproducible practice questions from seed values, ensuring consistent difficulty and allowing users to retry specific patterns. Data persistence is handled by Cloudflare D1 (SQLite), which stores test sessions, questions, answers, review queue items, and calendar plans.

The system implements a spaced repetition algorithm (SM-2-lite) to schedule review of incorrect answers, and provides analytics that categorize errors to help users identify patterns in their mistakes. All interactions are keyboard-first accessible, with full ARIA support and automated accessibility testing.

## Architecture Diagram

```
┌─────────────┐
│   Browser   │  User accesses web app via HTTPS
└──────┬──────┘
       │ HTTPS Request
┌──────▼──────────────────────────────────────┐
│  Cloudflare Pages                           │  Static assets (HTML, CSS, JS)
│  + Functions (Hono Router)                  │  Server-side routing & logic
│                                             │  - Template rendering
│  ┌─────────────────────────────────────┐   │  - Question generation
│  │  Route Handlers (_worker.ts)        │   │  - Answer processing
│  │  - GET / (dashboard)                 │   │  - SRS scheduling
│  │  - POST /test/start                 │   │  - HTMX fragment responses
│  │  - GET /test/:id                    │   │
│  │  - POST /test/:id/answer            │   │
│  │  - GET /results/:id                 │   │
│  │  - GET /review                      │   │
│  │  - GET /calendar                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Business Logic Modules            │   │
│  │  - Generator (deterministic Q gen) │   │
│  │  - Analytics (error classification) │   │
│  │  - SRS (SM-2-lite algorithm)        │   │
│  │  - Template Renderer              │   │
│  └─────────────────────────────────────┘   │
└──────┬──────────────────────────────────────┘
       │ D1 Binding
┌──────▼──────┐
│  Cloudflare │  SQLite database
│     D1      │  - sessions
│             │  - questions
│             │  - answers
│             │  - review_queue
│             │  - calendar_plan
└─────────────┘
```

## Key Components

### Route Handler Layer (`_worker.ts`)

- **Purpose**: Central Hono router that handles all HTTP requests and coordinates between repositories, generators, and templates
- **Technology**: Hono framework (TypeScript), Cloudflare Workers runtime
- **Key Responsibilities**:
  - Route incoming requests to appropriate handlers (GET/POST endpoints)
  - Parse form data and URL parameters
  - Coordinate database operations via repository layer
  - Render HTML templates or return HTMX fragments
  - Handle redirects and error responses
  - Enforce business rules (e.g., answer submission order)
- **Dependencies**: Database client, repositories, generator, template renderer, analytics classifier
- **Failure Mode**: If the router fails, all requests return 500 errors. Cloudflare Workers automatically retry failed requests, and the stateless design allows requests to be routed to any available edge location.

### Question Generator (`src/generator/`)

- **Purpose**: Generates deterministic Raven's-style matrix problems with exactly one correct answer among 8 choices
- **Technology**: TypeScript, seeded pseudo-random number generator
- **Key Responsibilities**:
  - Generate reproducible questions from seed values
  - Create 2x2 or 3x3 matrix grids with visual patterns
  - Apply rule families (rotation, reflection, size, count, composite, boolean XOR, distribution, translation, angle, strokeCount, nesting, intersection, fill, layerOrder, dotOrbit)
  - Render 14 primitive shapes (triangle, square, circle, line, polyline, dot, ring, frame, diamond, star, arc, plus, cross, chevron, L, T, letter strokes)
  - Generate 8 choice options with exactly one correct answer
  - Convert glyphs to SVG for rendering
- **Dependencies**: Seeded RNG utility, geometry helpers, rule application logic
- **Failure Mode**: If generation fails, the session cannot proceed. Questions are generated on-demand and cached in the database, so regeneration attempts use the same seed to produce identical results.

### Repository Layer (`src/db/repositories/`)

- **Purpose**: Abstract database operations into type-safe, testable modules
- **Technology**: TypeScript, Cloudflare D1 (SQLite) via binding
- **Key Responsibilities**:
  - **Sessions**: Create, retrieve, and finalize test sessions
  - **Questions**: Store and retrieve generated questions by session and index
  - **Answers**: Record user answers with correctness, latency, flags, and error categories
  - **Review Queue**: Manage SRS items (enqueue, list due, grade, update intervals)
  - **Calendar**: Store and toggle daily training plan completion
- **Dependencies**: D1 database client binding
- **Failure Mode**: Database failures return error responses. The application uses idempotent operations where possible (e.g., question generation checks for existing records before creating new ones).

### Template Renderer (`src/templates/`)

- **Purpose**: Server-side HTML rendering with variable substitution
- **Technology**: TypeScript, file-based templates with `{{variable}}` placeholders
- **Key Responsibilities**:
  - Load and cache template files
  - Substitute variables in templates
  - Render full pages (base.html wrapper) or fragments (for HTMX)
  - Support nested template composition
- **Dependencies**: File system access (templates directory)
- **Failure Mode**: Template rendering failures result in 500 errors. Templates are loaded at startup and cached in memory, so file system issues only affect new deployments.

### Analytics Module (`src/analytics/`)

- **Purpose**: Classify errors and summarize session performance
- **Technology**: TypeScript, rule-based classification
- **Key Responsibilities**:
  - Analyze incorrect answers to categorize error types
  - Detect patterns in mistakes (e.g., rotation errors, size confusion)
  - Generate session summaries (accuracy, latency, flagged items)
  - Provide category breakdowns for results display
- **Dependencies**: Question generator types, answer data
- **Failure Mode**: Classification failures default to "unknown" category. Analytics are non-critical for core functionality, so failures don't block test completion.

### Spaced Repetition System (`src/srs/`)

- **Purpose**: Schedule review items using SM-2-lite algorithm
- **Technology**: TypeScript, SM-2-lite algorithm implementation
- **Key Responsibilities**:
  - Calculate next review date based on grade (Hard/Good/Easy)
  - Update easiness factor and interval days
  - Track repetition count
  - List items due for review
- **Dependencies**: Review queue repository
- **Failure Mode**: SRS failures prevent scheduling but don't block test completion. Users can still complete tests and view results even if review scheduling fails.

## Data Model

### Entity Relationships

```
sessions (1) ──< (many) questions
sessions (1) ──< (many) answers
sessions (1) ──< (many) review_queue
answers (many) ──> (1) questions [via session_id + item_index]
calendar_plan (standalone, no foreign keys)
```

### Key Tables

**sessions**
- `id` (TEXT PRIMARY KEY): Unique session identifier
- `mode` (TEXT): 'timed' or 'drill'
- `count` (INTEGER): Number of questions in session
- `created_at` (TEXT): ISO timestamp
- `completed_at` (TEXT, nullable): Completion timestamp

**questions**
- `session_id` (TEXT): Foreign key to sessions
- `item_index` (INTEGER): Question position (0-based)
- `seed` (TEXT): Deterministic seed for regeneration
- `payload_json` (TEXT): Serialized question data
- `created_at` (TEXT): ISO timestamp
- **Primary Key**: (session_id, item_index)
- **Index**: session_id for fast lookups

**answers**
- `session_id` (TEXT): Foreign key to sessions
- `item_index` (INTEGER): Question position
- `choice_index` (INTEGER): User's selected choice (0-7)
- `correct` (INTEGER): 0 or 1 boolean
- `latency_ms` (INTEGER): Response time in milliseconds
- `flagged` (INTEGER): 0 or 1 boolean
- `error_category` (TEXT, nullable): Classification result
- `created_at`, `updated_at` (TEXT): Timestamps
- **Primary Key**: (session_id, item_index)
- **Index**: session_id for aggregation queries

**review_queue**
- `id` (TEXT PRIMARY KEY): Unique review item ID
- `session_id` (TEXT): Source session
- `item_index` (INTEGER): Source question index
- `seed` (TEXT): Question seed for regeneration
- `easiness` (REAL): SM-2 easiness factor (default 2.5)
- `interval_days` (REAL): Days until next review
- `repetitions` (INTEGER): Number of successful reviews
- `due_at` (TEXT): Next review date (ISO)
- `created_at`, `updated_at` (TEXT): Timestamps
- **Indexes**: due_at (for listing due items), session_id (for lookups)

**calendar_plan**
- `id` (TEXT PRIMARY KEY): Unique plan entry ID
- `day_date` (TEXT): ISO date (YYYY-MM-DD)
- `session_type` (TEXT): 'timed', 'drill', or 'review'
- `planned_questions` (INTEGER, nullable): Target question count
- `planned_duration_min` (INTEGER, nullable): Target duration
- `completed` (INTEGER): 0 or 1 boolean
- `completed_at` (TEXT, nullable): Completion timestamp
- **Index**: day_date for date-based queries

### Schema Design Decisions

- **No Foreign Key Constraints**: D1 SQLite supports foreign keys, but we use application-level referential integrity for flexibility. The schema includes `PRAGMA foreign_keys = ON` for future enforcement.
- **JSON Storage for Questions**: Questions are stored as JSON strings rather than normalized tables because the question structure is complex and variable. This allows the generator to evolve without schema migrations.
- **Composite Primary Keys**: Sessions use TEXT UUIDs, but questions and answers use composite keys (session_id + item_index) to ensure one question/answer per position.
- **Index Strategy**: Indexes on session_id and due_at optimize the most common queries (listing session data, finding due review items).
- **No Denormalization**: Current scale doesn't require denormalization. All aggregations (e.g., session stats) are computed on-demand via SQL queries.

## Technology Decisions

### Why Cloudflare Workers/Pages?

- **Edge Computing**: Requests are handled at the nearest Cloudflare data center, reducing latency globally
- **Serverless**: No infrastructure management, automatic scaling, pay-per-use pricing
- **Single Runtime**: Both static assets and API logic run in the same environment, simplifying deployment
- **D1 Integration**: Native SQLite database binding with zero-config local development
- **Alternative Considered**: Vercel + separate API (rejected due to complexity and higher latency for global users)

### Why Hono?

- **Lightweight**: Minimal framework overhead compared to Express or Fastify
- **Edge-Optimized**: Designed for Cloudflare Workers with native Request/Response handling
- **TypeScript-First**: Excellent type safety and developer experience
- **Fast Routing**: Tree-based router with minimal overhead
- **Alternative Considered**: Itty Router (too minimal), Express (not optimized for Workers)

### Why htmx Instead of React/Vue?

- **Progressive Enhancement**: Works without JavaScript, accessible by default
- **Minimal Client Code**: No build step, no bundle size concerns
- **Server-Side Rendering**: Full control over HTML, SEO-friendly
- **Fast Interactions**: HTMX swaps are faster than full page reloads but simpler than SPA frameworks
- **Alternative Considered**: React (rejected due to bundle size and complexity for this use case)

### Why D1 (SQLite) Instead of PostgreSQL/MySQL?

- **Zero Configuration**: No separate database server, works out of the box
- **Local Development**: Identical database locally and in production
- **Cost**: Free tier sufficient for MVP, predictable pricing
- **Simplicity**: SQLite is sufficient for relational data at current scale
- **Limitation**: Not suitable for high write concurrency, but acceptable for single-user sessions
- **Alternative Considered**: PostgreSQL on Railway/Supabase (rejected due to added complexity and cost)

### Why Deterministic Question Generation?

- **Reproducibility**: Same seed always produces the same question, enabling retry and review
- **No Storage Overhead**: Questions generated on-demand from seeds, not pre-generated
- **Consistent Difficulty**: Seed-based generation ensures predictable difficulty levels
- **Alternative Considered**: Pre-generated question bank (rejected due to storage costs and lack of flexibility)

### Why Tailwind CSS Instead of Component Libraries?

- **Control**: Full control over design tokens and accessibility
- **Bundle Size**: Only used classes are included in final CSS
- **No JavaScript**: Pure CSS utilities, no runtime overhead
- **Customization**: Easy to extend with custom utilities and design system
- **Alternative Considered**: DaisyUI/Flowbite (rejected for MVP to avoid opinionated styles and potential CSS bloat)

## Scalability

### Current Capacity

- **Concurrent Users**: Limited by D1 write concurrency (SQLite), but acceptable for single-user sessions
- **Question Generation**: Unlimited (deterministic, stateless generation)
- **Storage**: D1 free tier: 5GB storage, 5M reads/month, 100K writes/month
- **API Response Time**: < 50ms median (edge computing, minimal processing)

### Scaling Strategy

1. **Horizontal Scaling**: Cloudflare Workers automatically scale horizontally across edge locations. No configuration needed.

2. **Database Optimization**:
   - Current: Single D1 database with indexes on high-traffic queries
   - Future: Read replicas if read-heavy (D1 supports this)
   - Future: Partition sessions by date for archival of old data

3. **Caching Layer**:
   - Current: Template files cached in memory
   - Future: Cache generated questions in D1 (already implemented)
   - Future: CDN caching for static assets (automatic via Cloudflare Pages)

4. **API Rate Limiting**:
   - Current: None (single-user sessions, low abuse risk)
   - Future: Cloudflare rate limiting rules if needed

5. **CDN Usage**:
   - Static assets (CSS, JS) served via Cloudflare CDN automatically
   - HTML pages are edge-rendered, so they benefit from global distribution

### Scaling Bottlenecks

- **D1 Write Concurrency**: SQLite doesn't handle high concurrent writes well. Mitigation: Sessions are single-user, so write conflicts are rare. If needed, move to Cloudflare Durable Objects or external database.
- **Question Generation CPU**: Complex 3x3 questions with multiple rules can be CPU-intensive. Mitigation: Generation is fast (< 10ms), and questions are cached after first generation.
- **Template Rendering**: Currently synchronous. Mitigation: Templates are simple, rendering is fast. If needed, could stream responses.

## Security

### Authentication/Authorization

- **Current**: Anonymous-first design. No user authentication required for MVP.
- **Future**: If multi-user support is added, Cloudflare Access or OAuth integration would be used.

### Data Encryption

- **In Transit**: HTTPS enforced by Cloudflare (automatic TLS termination)
- **At Rest**: D1 data encrypted at rest by Cloudflare (managed service)

### Secrets Management

- **Current**: No secrets required (anonymous sessions, no external APIs)
- **Future**: If API keys are needed, use Cloudflare Workers Secrets or environment variables

### Access Control

- **Current**: No access control (single-user, anonymous sessions)
- **Future**: Session-based authentication if multi-user support is added

### Input Validation

- **Form Data**: All form inputs are validated and sanitized (type coercion, range checks)
- **URL Parameters**: Parameter validation in route handlers (e.g., itemIndex bounds checking)
- **SQL Injection**: Parameterized queries via D1 prepared statements (all repositories use placeholders)

### XSS Prevention

- **Template Rendering**: Variables are HTML-escaped by default (Hono's template renderer)
- **User Content**: No user-generated content stored or displayed (questions are generated, not submitted)

## Deployment

### Environments

- **Local Development**: 
  - Wrangler dev server (`npm run dev`)
  - Local D1 database (SQLite file)
  - CSS watch mode for Tailwind
- **Production**: 
  - Cloudflare Pages deployment
  - Remote D1 database (Cloudflare-managed)
  - Minified CSS build

### CI/CD Pipeline

- **Current**: Manual deployment via `npm run deploy` or `npx wrangler pages deploy`
- **Future**: GitHub Actions workflow for automated deployment on push to main branch

### Infrastructure

- **Platform**: Cloudflare Pages + Workers (serverless, edge computing)
- **Database**: Cloudflare D1 (managed SQLite)
- **CDN**: Cloudflare CDN (automatic for static assets)
- **Monitoring**: Cloudflare Analytics (automatic request/error tracking)
- **No Servers**: Fully serverless, no infrastructure to manage

### Deployment Process

1. **Build CSS**: `npx tailwindcss -i ./styles/tailwind.css -o ./public/app.css -m`
2. **Apply Schema** (if changed): `npm run db:apply:remote`
3. **Deploy**: `npx wrangler pages deploy ./public` or `npm run deploy`
4. **Verify**: Check Cloudflare dashboard for deployment status

### Monitoring/Alerting

- **Current**: Cloudflare Analytics dashboard (request counts, error rates)
- **Future**: Custom error tracking (e.g., Sentry) if needed
- **Future**: Uptime monitoring (e.g., UptimeRobot) for availability alerts

## Future Improvements

### Known Limitations

1. **Single-User Design**: Current architecture assumes anonymous, single-user sessions. Multi-user support would require authentication and session isolation.
2. **D1 Write Concurrency**: SQLite limitations may become an issue with high concurrent writes. Consider Durable Objects or external database if needed.
3. **No Offline Support**: Application requires internet connection. Service Workers could enable offline question practice.
4. **Limited Analytics**: Basic error categorization exists, but advanced analytics (progress over time, difficulty curves) are not implemented.
5. **No Question Export**: Users cannot export questions or results for external analysis.

### Planned Refactors

1. **Repository Pattern Enhancement**: Extract common query patterns into base repository class to reduce duplication.
2. **Template Type Safety**: Generate TypeScript types from template variables to catch errors at compile time.
3. **Error Handling Middleware**: Centralized error handling in Hono middleware instead of per-route try/catch.
4. **Question Generation Optimization**: Cache frequently used rule combinations to speed up 3x3 generation.

### Scaling Bottlenecks to Address

1. **Database Partitioning**: Archive old sessions (> 90 days) to separate table or external storage to keep active database small.
2. **Question Pre-generation**: For common seeds, pre-generate and cache questions to reduce generation time.
3. **CDN for Generated SVGs**: Cache rendered question SVGs in Cloudflare KV or R2 for faster delivery.

### Architecture Evolution

If the application grows beyond MVP:

1. **Multi-User Support**: Add Cloudflare Access or OAuth, user table, session isolation
2. **Advanced Analytics**: Separate analytics service or data warehouse for long-term trend analysis
3. **Question Bank Management**: Admin interface to curate and manage question seeds
4. **API for Mobile Apps**: RESTful API layer for future mobile app integration
5. **Real-Time Collaboration**: WebSocket support for shared practice sessions (if desired)

---

**Initial structure generated by Cursor AI, reviewed and refined manually.**
