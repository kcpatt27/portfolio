# NextDish Architecture

## Overview

NextDish is a modern, AI-powered culinary platform built on a serverless edge computing architecture. The system connects recipe creators with home cooks through an intelligent discovery engine, social features, and client-side AI capabilities. The architecture prioritizes performance, privacy, and scalability by leveraging Cloudflare's global edge network for low-latency API responses and running AI models directly in the browser to reduce server costs and improve user privacy.

The application follows a two-sided platform model where recipe creators publish and manage content while consumers discover, save, and interact with recipes. All dynamic routes run on Cloudflare Workers edge runtime, ensuring sub-200ms response times globally. The backend uses Supabase for managed PostgreSQL database, authentication, and object storage, providing a unified data layer with Row Level Security (RLS) policies that enforce user data isolation at the database level.

Client-side AI processing is a core architectural decision. The system uses ONNX Runtime Web to run Llama 3.2 1B Instruct for text-to-recipe generation and TensorFlow.js for YOLOv8n image analysis, both executing entirely in the browser. A Progressive Web App (PWA) with service worker caching ensures these models are available offline after the initial visit, creating a seamless user experience that works without constant server communication.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              User Browser                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   React UI        │  │   AI Models      │  │   Service        │   │
│  │   (Next.js)       │  │   (Client-Side)  │  │   Worker (PWA)    │   │
│  │                   │  │                  │  │                  │   │
│  │ - Recipe Reel     │  │ - Llama 3.2      │  │ - Model Cache    │   │
│  │ - Search           │  │   (Text Gen)     │  │ - Asset Cache    │   │
│  │ - AI Chat          │  │ - YOLOv8n       │  │ - Offline Support│   │
│  │ - User Profile     │  │   (Image Det.)  │  │                  │   │
│  │ - Messaging        │  │                  │  │                  │   │
│  └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘   │
└────────────┼──────────────────────┼──────────────────────┼────────────┘
             │                      │                      │
             │ HTTPS                │ Local Cache           │ PWA Cache
             │                      │                      │
┌────────────▼───────────────────────────────────────────────────────────┐
│                    Cloudflare Pages (Edge Runtime)                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │         Next.js API Routes (Edge Functions)                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │ Auth Routes  │  │ Recipe APIs  │  │ Social APIs  │          │   │
│  │  │ - Signin     │  │ - CRUD       │  │ - Follow     │          │   │
│  │  │ - Callback   │  │ - Search     │  │ - Messages   │          │   │
│  │  │ - Session    │  │ - Analytics  │  │ - Notifications│        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │ Waitlist API│  │ Email API    │  │ CSP Monitor  │          │   │
│  │  │ - Signup    │  │ - Templates  │  │ - Violations │          │   │
│  │  │ - Confirm   │  │ - Worker Proxy│  │             │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  └───────────────────────────┬───────────────────────────────────────┘   │
└───────────────────────────────┼───────────────────────────────────────────┘
                                │
                                │ HTTPS (Edge Client)
                                │
┌───────────────────────────────▼───────────────────────────────────────────┐
│                         Cloudflare Email Worker                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Email Service (Resend API Integration)                         │   │
│  │  - Confirmation Emails                                          │   │
│  │  - Password Reset                                                │   │
│  │  - Notification Emails                                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
                                │ HTTPS
                                │
┌───────────────────────────────▼───────────────────────────────────────────┐
│                            Supabase Platform                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │  PostgreSQL      │  │  Auth Service   │  │  Storage         │        │
│  │  Database        │  │                  │  │                  │        │
│  │                  │  │ - OAuth          │  │ - Avatars        │        │
│  │ - User Data      │  │ - Email/Pass    │  │ - Recipe Images  │        │
│  │ - Recipes        │  │ - Sessions      │  │ - Media Files    │        │
│  │ - Social Graph   │  │ - RLS Policies  │  │                  │        │
│  │ - Messages       │  │                  │  │                  │        │
│  │ - Analytics      │  │                  │  │                  │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                │ (Future)
                                │
┌───────────────────────────────▼───────────────────────────────────────────┐
│                      External Services (Future)                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │  OpenRouter API  │  │  PostHog         │  │  Stripe          │        │
│  │  (Premium AI)    │  │  Analytics       │  │  Payments        │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### Frontend Layer (Next.js React Application)

**Name:** Next.js Frontend Application  
**Purpose:** Provides the user interface for recipe discovery, creation, social interaction, and AI-powered features.  
**Technology:** Next.js 15.3.2 (App Router), React 18, TypeScript, Tailwind CSS, Shadcn UI  
**Key Responsibilities:**
- Render recipe feeds, search results, and user profiles with server-side rendering for SEO
- Manage client-side state with Zustand (global) and React Context (local)
- Handle form validation and user input with React Hook Form and Zod
- Provide responsive, accessible UI components using Shadcn UI design system
- Integrate with client-side AI models for recipe generation and image analysis
- Implement infinite scroll and lazy loading for performance optimization

**Dependencies:**
- Cloudflare Pages API routes for data fetching
- Supabase client for real-time subscriptions (future)
- Service Worker for PWA caching
- PostHog for analytics and A/B testing

**Failure Mode:** If the frontend fails, users cannot interact with the application. The PWA service worker provides offline access to cached AI models and previously loaded content, allowing limited functionality even during outages.

---

### API Layer (Next.js Edge Routes)

**Name:** Cloudflare Workers API Routes  
**Purpose:** Handle all server-side logic including authentication, data validation, database operations, and external service integration.  
**Technology:** Next.js API Routes with Edge Runtime, TypeScript, Supabase Client  
**Key Responsibilities:**
- Authenticate users via NextAuth.js and Supabase Auth
- Validate and process recipe CRUD operations with Zod schemas
- Manage social features (follows, messages, notifications)
- Proxy email requests to Cloudflare Email Worker
- Enforce Content Security Policy and monitor violations
- Handle waitlist signups and email confirmations

**Dependencies:**
- Supabase database for data persistence
- Supabase Auth for authentication
- Cloudflare Email Worker for email delivery
- Environment variables from Cloudflare Pages

**Failure Mode:** API route failures return appropriate HTTP status codes (401, 403, 500) with error messages. The frontend handles these gracefully with user-friendly error states. Critical failures are logged to Cloudflare's analytics for monitoring.

---

### Database Layer (Supabase PostgreSQL)

**Name:** Supabase PostgreSQL Database  
**Purpose:** Stores all application data including users, recipes, social interactions, and analytics.  
**Technology:** PostgreSQL 15+, Prisma ORM, Row Level Security (RLS)  
**Key Responsibilities:**
- Persist user accounts, profiles, and authentication sessions
- Store recipes with JSON fields for flexible ingredient/instruction data
- Manage social graph (follows, messages, conversations)
- Track analytics (views, likes, saves) for recommendation engine
- Enforce data isolation through RLS policies at the database level
- Provide connection pooling for edge runtime compatibility

**Dependencies:**
- Supabase Auth service for user authentication context
- Prisma migrations for schema management
- Cloudflare Pages API routes for data access

**Failure Mode:** Database failures result in 500 errors from API routes. The application uses connection pooling to handle transient failures. Critical operations have retry logic. Supabase provides automatic backups and point-in-time recovery.

---

### Authentication Service (Supabase Auth + NextAuth.js)

**Name:** Authentication Service  
**Purpose:** Manages user authentication, authorization, and session management.  
**Technology:** Supabase Auth, NextAuth.js v5 (beta), OAuth providers (Google)  
**Key Responsibilities:**
- Handle email/password authentication
- Manage OAuth flows (Google, future: GitHub, Apple)
- Generate and validate JWT tokens for sessions
- Enforce email verification for new accounts
- Provide user context to RLS policies via `auth.uid()`
- Manage password reset and account recovery flows

**Dependencies:**
- Supabase Auth service
- Email Worker for confirmation emails
- Database for user profile storage

**Failure Mode:** Authentication failures prevent users from accessing protected features. The system falls back to read-only public content. Session tokens are validated on each request, and expired sessions redirect to signin page.

---

### AI Service Layer (Client-Side)

**Name:** Client-Side AI Service  
**Purpose:** Provides AI-powered recipe generation and image analysis without server communication.  
**Technology:** Transformers.js (v3.5.1), TensorFlow.js (v4.22.0), ONNX Runtime Web  
**Key Responsibilities:**
- Initialize and manage Llama 3.2 1B Instruct model for text-to-recipe generation
- Process image uploads with YOLOv8n for ingredient detection
- Stream AI responses for real-time user feedback
- Parse structured Markdown output into recipe objects
- Cache model files via service worker for offline access
- Handle model loading errors and fallback scenarios

**Dependencies:**
- Service Worker for model caching
- Browser WebAssembly support
- Transformers.js and TensorFlow.js libraries

**Failure Mode:** If AI models fail to load, users see error messages and can retry. The service worker ensures models are cached after first load. If WebAssembly is unavailable, the system gracefully degrades with user-friendly error messages.

---

### Email Service (Cloudflare Email Worker)

**Name:** Email Worker Service  
**Purpose:** Handles all email delivery including confirmations, password resets, and notifications.  
**Technology:** Cloudflare Workers, Resend API  
**Key Responsibilities:**
- Send email confirmation links for new accounts
- Deliver password reset emails
- Send notification emails for social interactions
- Render branded email templates matching NextDish design
- Handle email delivery failures and retries
- Log email events for debugging and monitoring

**Dependencies:**
- Resend API for email delivery
- Cloudflare Pages API routes for email triggers
- Supabase for user data

**Failure Mode:** Email delivery failures are logged but don't block user actions. Users can request new confirmation emails. Critical emails (password reset) have retry logic with exponential backoff.

---

### Storage Service (Supabase Storage)

**Name:** Supabase Object Storage  
**Purpose:** Stores user-uploaded images and media files.  
**Technology:** Supabase Storage (S3-compatible)  
**Key Responsibilities:**
- Store user profile avatars
- Host recipe images and step-by-step photos
- Manage file uploads with size and type validation
- Provide CDN URLs for fast image delivery
- Enforce storage quotas and access policies

**Dependencies:**
- Supabase Storage service
- API routes for upload handling

**Failure Mode:** Storage failures prevent image uploads but don't block recipe creation. Users can add images later. Existing images continue to serve from CDN cache.

---

## Data Model

### Key Entities

The database schema is defined in `prisma/schema.prisma` and consists of 20+ tables organized around core entities:

**User & Authentication:**
- `User` — Core user accounts with profile information, preferences, and role
- `Account` — OAuth provider accounts linked to users
- `Session` — Active user sessions for authentication

**Recipe Management:**
- `Recipe` — Recipe data with JSON fields for ingredients, instructions, dietary info
- `Collection` — User-created recipe collections (cookbooks)
- `Analytics` — Recipe performance metrics (views, likes, shares)

**Social Features:**
- `UserFollow` — Following relationships between users
- `Conversation` — Direct message conversations
- `Message` — Individual messages within conversations
- `Like` — Recipe likes
- `Comment` — Recipe comments
- `UserRecipeSave` — Saved recipes (bookmarks)

**User Engagement:**
- `UserEngagement` — Event tracking for recommendation engine
- `RecipeView` — Recipe view tracking with duration
- `UserPreference` — User dietary preferences and skill level

**Platform Features:**
- `Waitlist` — Early access signups with email confirmation

### Entity Relationships

```
User (1) ──< (N) Recipe
User (1) ──< (N) Collection
User (1) ──< (N) Message (sent)
User (N) >──< (N) Conversation (participants)
User (N) >──< (N) User (via UserFollow: following/followers)
User (1) ──< (1) UserPreference
User (1) ──< (N) UserRecipeSave
User (1) ──< (N) Like
User (1) ──< (N) Comment

Recipe (1) ──< (1) Analytics
Recipe (1) ──< (N) RecipeView
Recipe (1) ──< (N) Comment
Recipe (1) ──< (N) Like
Recipe (1) ──< (N) UserRecipeSave
Recipe (N) >──< (N) Collection (many-to-many)
```

### Schema Design Decisions

**Why JSON Fields for Recipe Data?**
- **Flexibility:** Ingredients, instructions, and dietary info vary significantly between recipes
- **Performance:** Avoids complex joins for nested data
- **Simplicity:** Easier to work with in frontend (direct JSON mapping)
- **Trade-off:** Less queryable than normalized tables, but full-text search via PostgreSQL handles most use cases

**Why CUID for Primary Keys?**
- **Security:** Non-sequential IDs prevent enumeration attacks
- **Distributed:** Can generate IDs without database round-trip
- **URL-Safe:** Works well in URLs and API endpoints

**Why Denormalized Analytics Table?**
- **Performance:** Pre-aggregated metrics avoid expensive COUNT queries
- **Scalability:** Analytics updates don't lock recipe table
- **Trade-off:** Requires careful update logic to keep data consistent

**Caching Decisions:**
- **Service Worker:** Caches AI model files (~50MB) for offline access
- **React Query:** Client-side caching of API responses (5-minute stale time)
- **No Server-Side Cache:** Edge runtime doesn't support traditional caching layers; relies on Cloudflare's global CDN

---

## Technology Decisions

### Why Next.js with App Router?

**What:** Next.js 15.3.2 with App Router for full-stack React application  
**Why:**
- **Unified Framework:** Single codebase for frontend and API routes
- **Server-Side Rendering:** SEO-friendly recipe pages with fast initial load
- **Edge Runtime Support:** Native compatibility with Cloudflare Workers
- **TypeScript Integration:** End-to-end type safety
- **Developer Experience:** Hot reloading, excellent tooling, large ecosystem

**Alternatives Considered:**
- **Remix:** Similar features but smaller ecosystem
- **SvelteKit:** Different paradigm, team familiarity with React
- **Vite + Express:** More setup complexity, lose SSR benefits

**Trade-offs:**
- App Router is relatively new (migration from Pages Router required)
- Some third-party libraries not yet compatible with App Router
- Learning curve for React Server Components

---

### Why Cloudflare Pages + Workers?

**What:** Cloudflare Pages for hosting, Workers for edge runtime  
**Why:**
- **Global Edge Network:** Sub-200ms response times worldwide
- **Zero Cold Starts:** Workers are always warm, unlike traditional serverless
- **Cost-Effective:** Generous free tier, pay-per-use pricing
- **Integrated Platform:** Pages, Workers, and CDN in one service
- **Security:** Built-in DDoS protection, WAF, and SSL

**Alternatives Considered:**
- **Vercel:** Excellent DX but more expensive, less global edge presence
- **AWS Lambda + CloudFront:** More complex setup, higher costs
- **Self-Hosted:** Requires infrastructure management, scaling challenges

**Trade-offs:**
- Edge runtime has limitations (no Node.js APIs, smaller execution time)
- Environment variable access requires `getRequestContext()` wrapper
- Some npm packages incompatible with edge runtime

---

### Why Supabase?

**What:** Supabase for PostgreSQL database, authentication, and storage  
**Why:**
- **Managed PostgreSQL:** Automatic backups, point-in-time recovery, connection pooling
- **Built-in Auth:** OAuth, email/password, magic links with minimal setup
- **Row Level Security:** Database-level security policies, not application-level
- **Real-time Subscriptions:** WebSocket support for live features (future)
- **Storage:** S3-compatible object storage for images
- **Developer Experience:** Excellent dashboard, SQL editor, migration tools

**Alternatives Considered:**
- **PlanetScale:** Serverless MySQL, but no built-in auth
- **Firebase:** NoSQL, different data model, vendor lock-in concerns
- **Self-Hosted PostgreSQL:** Requires infrastructure management

**Trade-offs:**
- Vendor lock-in to Supabase (though PostgreSQL is standard)
- RLS policies can be complex for multi-tenant scenarios
- Some advanced PostgreSQL features require direct database access

---

### Why Client-Side AI?

**What:** Llama 3.2 1B Instruct and YOLOv8n running in browser  
**Why:**
- **Privacy:** User data never leaves their device
- **Cost:** No server costs for AI inference
- **Offline:** Works without internet after initial model download
- **Latency:** No network round-trip, instant responses
- **Scalability:** Each user's device handles their own AI processing

**Alternatives Considered:**
- **Server-Side AI (OpenAI API):** Higher costs, privacy concerns, requires internet
- **Hybrid Approach:** Client-side for basic, server-side for premium (planned)

**Trade-offs:**
- Model size (~50MB) increases initial page load
- Limited to smaller models that fit in browser memory
- Browser compatibility requirements (WebAssembly support)
- Initial model load time (mitigated by service worker caching)

---

### Why Prisma ORM?

**What:** Prisma for type-safe database access  
**Why:**
- **Type Safety:** Generated TypeScript types from schema
- **Migration System:** Version-controlled schema changes
- **Developer Experience:** Excellent tooling, auto-completion, query builder
- **Edge Compatible:** Works with edge runtime via adapter pattern

**Alternatives Considered:**
- **Drizzle ORM:** Lighter weight but less mature
- **TypeORM:** More features but heavier, less edge-compatible
- **Raw SQL:** More control but no type safety, more boilerplate

**Trade-offs:**
- Learning curve for Prisma query syntax
- Some complex queries easier with raw SQL
- Migration conflicts require careful coordination

---

## Scalability

### Horizontal Scaling Strategy

**Frontend & API:**
- **Cloudflare Pages:** Automatically scales globally via edge network
- **No Server Management:** Serverless architecture eliminates scaling concerns
- **Edge Functions:** Each request handled independently, no shared state

**Database:**
- **Connection Pooling:** Supabase manages connection pools for edge runtime
- **Read Replicas:** Supabase provides read replicas for scaling reads (future)
- **Partitioning:** Large tables (Recipe, Message) can be partitioned by date/user if needed

### Caching Layer

**Client-Side:**
- **React Query:** Caches API responses with 5-minute stale time
- **Service Worker:** Caches AI models and static assets for offline access
- **Browser Cache:** Standard HTTP caching for static assets via Cloudflare CDN

**Server-Side:**
- **Cloudflare CDN:** Automatic caching of static assets globally
- **No Application Cache:** Edge runtime doesn't support Redis/Memcached
- **Future:** Consider Cloudflare KV for session storage if needed

### Database Optimization

**Indexing Strategy:**
- **User Lookups:** Indexed on `username`, `email`
- **Recipe Queries:** Indexed on `userId`, `cuisine`, `createdAt`
- **Social Graph:** Composite indexes on `UserFollow` (followerId, followingId)
- **Messaging:** Indexed on `conversationId`, `senderId`, `createdAt`
- **Analytics:** Pre-aggregated in `Analytics` table to avoid COUNT queries

**Query Optimization:**
- **RLS Performance:** Cached `auth.uid()` pattern eliminates repeated auth calls
- **Policy Consolidation:** Single efficient policy per table/action
- **JSON Queries:** PostgreSQL full-text search on JSON fields for recipe search
- **Pagination:** Cursor-based pagination for infinite scroll (avoids OFFSET)

### API Rate Limiting

**Current:** No explicit rate limiting (relies on Cloudflare's default protection)  
**Future:**
- Implement rate limiting per user/IP for API routes
- Use Cloudflare Workers rate limiting for DDoS protection
- Consider Cloudflare Rate Limiting rules for specific endpoints

### CDN Usage

**Static Assets:**
- All static files (images, fonts, CSS, JS) served via Cloudflare CDN
- Automatic compression (Brotli, Gzip)
- Image optimization via Cloudflare Images (future)

**API Responses:**
- Edge runtime ensures API responses come from nearest data center
- No additional CDN needed for API routes (they're already at the edge)

---

## Security

### Authentication & Authorization

**Authentication Approach:**
- **Supabase Auth:** Battle-tested authentication service with OAuth support
- **NextAuth.js:** Provides session management and middleware integration
- **JWT Tokens:** Stateless session tokens validated on each request
- **Email Verification:** Required for new accounts before full access

**Authorization Pattern:**
- **Row Level Security (RLS):** Database-level policies enforce user data isolation
- **Policy Pattern:** `auth.uid() = userId` for user-owned data
- **Cached Auth:** `(SELECT auth.uid())` pattern eliminates repeated auth calls
- **Service Role Key:** Never exposed to client, only used in secure server contexts

**Example RLS Policy:**
```sql
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT USING (auth.uid() = id);
```

### Data Encryption

**In Transit:**
- **HTTPS/TLS:** All traffic encrypted via Cloudflare's SSL/TLS
- **Database Connections:** Supabase uses SSL for all PostgreSQL connections
- **API Routes:** All API communication over HTTPS

**At Rest:**
- **Database:** Supabase encrypts PostgreSQL data at rest
- **Storage:** Supabase Storage (S3-compatible) encrypts uploaded files
- **Secrets:** Environment variables stored securely in Cloudflare Pages dashboard

### Secrets Management

**Environment Variables:**
- **Cloudflare Pages:** Environment variables configured in dashboard
- **Access Pattern:** `getRequestContext()` for edge runtime, `process.env` for local dev
- **Secrets:** Never committed to repository, managed via Cloudflare dashboard
- **Rotation:** Manual rotation process (future: automated rotation)

**API Keys:**
- **Supabase Keys:** Only `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed to client
- **Service Role Key:** Never exposed, only used in secure server contexts
- **Email API:** Resend API key stored in Cloudflare Worker environment

### Access Control Patterns

**Content Security Policy (CSP):**
- **Nonce-Based:** Dynamic nonce generation per request
- **Strict Policy:** `style-src 'self'` disallows inline styles
- **Violation Reporting:** `/api/csp-violations` endpoint logs violations
- **Edge Compatible:** CSP middleware runs on edge runtime

**Input Validation:**
- **Zod Schemas:** All API inputs validated with Zod
- **SQL Injection Prevention:** Prisma ORM prevents SQL injection
- **XSS Prevention:** React automatically escapes user input
- **File Upload Validation:** Size limits, type checking, virus scanning (future)

**User Data Isolation:**
- **RLS Policies:** Every table has RLS enabled with user-specific policies
- **Automatic Enforcement:** Database enforces isolation, not application code
- **Multi-Tenant Safe:** Each user can only access their own data

---

## Deployment

### Environments

**Development:**
- **Local Setup:** `npm run dev` for local development
- **Environment:** Uses `process.env` for local environment variables
- **Database:** Can connect to Supabase development database or local PostgreSQL
- **Hot Reloading:** Next.js fast refresh for instant updates

**Staging:**
- **Cloudflare Pages Preview:** Automatic preview deployments for PRs
- **Environment:** Separate Supabase project for staging data
- **Testing:** E2E tests run against staging environment

**Production:**
- **Cloudflare Pages:** Main production deployment
- **Domain:** `nextdish.app` (or configured custom domain)
- **Database:** Production Supabase PostgreSQL instance
- **Monitoring:** Cloudflare Analytics + PostHog for error tracking

### CI/CD Pipeline

**GitHub Actions Workflows:**

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`):
   - **Trigger:** Push to `main` branch or pull requests
   - **Steps:**
     - Checkout code
     - Set up Node.js 18.x
     - Install dependencies (`npm ci`)
     - Run tests (currently disabled)
     - Build application (`npm run build`)
   - **Status:** Currently disabled (`if: false`)

2. **Deploy Workflow** (`.github/workflows/deploy.yml`):
   - **Trigger:** Push to `main` branch
   - **Steps:**
     - Checkout code
     - Set up Node.js 20.x
     - Install dependencies
     - Build frontend (`npm run build`)
     - Deploy to Cloudflare Pages (via `wrangler pages deploy`)
   - **Status:** Enabled (`if: true`)

3. **CodeQL Analysis** (`.github/workflows/codeql-analysis.yml`):
   - **Trigger:** Push to `main` or pull requests
   - **Purpose:** Security vulnerability scanning
   - **Status:** Currently disabled (`if: false`)

**Deployment Process:**
1. Developer pushes to `main` branch
2. GitHub Actions triggers deploy workflow
3. Application builds with production environment variables
4. Cloudflare Pages deploys new version
5. Zero-downtime deployment (Cloudflare handles rollover)
6. Health checks verify deployment success

### Infrastructure

**Cloudflare Pages:**
- **Build Command:** `npm run pages:build` (uses `@cloudflare/next-on-pages`)
- **Output Directory:** `.vercel/output/static`
- **Environment Variables:** Configured in Cloudflare Pages dashboard
- **Custom Domain:** Configured via Cloudflare DNS

**Supabase:**
- **Database:** Managed PostgreSQL 15+ instance
- **Connection Pooling:** PgBouncer for edge runtime compatibility
- **Backups:** Automatic daily backups with point-in-time recovery
- **Storage:** S3-compatible object storage with CDN

**Email Worker:**
- **Deployment:** Separate Cloudflare Worker for email service
- **Domain:** `email.nextdish.app` (custom domain required)
- **Configuration:** `wrangler.toml` with production environment

### Monitoring & Alerting

**Current Monitoring:**
- **Cloudflare Analytics:** Request metrics, error rates, response times
- **PostHog:** User analytics, feature flags, A/B testing (event capture issues being resolved)
- **Supabase Dashboard:** Database performance, query analytics, connection metrics

**Error Tracking:**
- **CSP Violations:** Logged to `/api/csp-violations` endpoint
- **API Errors:** Returned as HTTP status codes with error messages
- **Client Errors:** Console logging (future: Sentry integration)

**Alerting:**
- **Manual Monitoring:** Regular checks of Cloudflare and Supabase dashboards
- **Future:** Automated alerts for error rate spikes, database performance issues

**Performance Monitoring:**
- **Core Web Vitals:** Tracked via PostHog (when working)
- **API Response Times:** Cloudflare Analytics shows edge response times
- **Database Query Performance:** Supabase dashboard shows slow queries

---

## Future Improvements

### Known Limitations

**Current Limitations:**
1. **AI Model Size:** 50MB initial download impacts first-time users (mitigated by service worker caching)
2. **Edge Runtime Constraints:** Some npm packages incompatible with edge runtime
3. **Database Queries:** Complex queries may require optimization as data grows
4. **Email Delivery:** No retry queue for failed email deliveries
5. **Real-time Features:** WebSocket support planned but not yet implemented
6. **PostHog Integration:** Event capture experiencing issues, needs debugging

**Scaling Bottlenecks:**
1. **Database Connections:** May need read replicas as user base grows
2. **Image Storage:** May need CDN optimization for high-traffic recipe images
3. **AI Processing:** Client-side models limited to smaller models; premium tier will use server-side
4. **Message System:** May need message queue for high-volume messaging

### Planned Refactors

**Short-Term (Next 3 Months):**
- **PostHog Fix:** Resolve event capture issues for reliable analytics
- **Error Monitoring:** Integrate Sentry or similar for production error tracking
- **Rate Limiting:** Implement API rate limiting per user/IP
- **Email Queue:** Add retry queue for failed email deliveries
- **Database Indexing:** Review and optimize indexes based on query patterns

**Medium-Term (6 Months):**
- **Real-time Features:** Implement WebSocket subscriptions for live messaging
- **Server-Side AI:** Add premium tier with OpenRouter API for advanced AI features
- **Image Optimization:** Integrate Cloudflare Images for automatic optimization
- **Caching Layer:** Evaluate Cloudflare KV for session storage if needed
- **Database Partitioning:** Partition large tables (Recipe, Message) by date if needed

**Long-Term (12+ Months):**
- **Microservices:** Consider splitting email worker into separate service
- **GraphQL API:** Evaluate GraphQL for more flexible data fetching
- **Mobile App:** React Native app with shared business logic
- **Internationalization:** Multi-language support for global expansion

### Architecture Evolution

**Current:** Monolithic Next.js app with edge runtime  
**Future Considerations:**
- **Microservices:** Only if specific services need different scaling characteristics
- **GraphQL:** If frontend data requirements become too complex for REST
- **Event-Driven:** Add message queue for async processing (emails, notifications)
- **Multi-Region:** Expand beyond Cloudflare's edge if specific regions need dedicated infrastructure

**Migration Path:**
- All changes maintain backward compatibility
- Database migrations applied via Prisma
- Feature flags for gradual rollouts
- A/B testing for major architectural changes

---

## Conclusion

NextDish's architecture prioritizes performance, privacy, and developer experience through a modern serverless edge computing stack. The combination of Cloudflare Pages, Supabase, and client-side AI creates a scalable foundation that can grow from MVP to production without major architectural changes. The use of Row Level Security ensures data isolation at the database level, while edge runtime provides global low-latency responses.

The architecture is designed to evolve incrementally, with clear paths for adding real-time features, premium AI capabilities, and mobile support. The focus on client-side AI processing reduces costs and improves privacy, while the edge-first approach ensures excellent performance for users worldwide.

For detailed implementation patterns and code examples, see [systemPatterns.md](memory-bank/systemPatterns.md) in the memory bank.
