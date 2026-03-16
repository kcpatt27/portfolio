# NextDish Specifications

## Project Vision

An AI-powered culinary platform connecting recipe creators with home cooks worldwide. NextDish is a two-sided marketplace where creators can grow their audience and monetize their content, while consumers discover diverse, high-quality recipes through intelligent AI-powered tools.

**Core Goals:**
- Enable intuitive recipe discovery and creation through AI assistance
- Provide tools for recipe creators to publish, manage, and monetize content
- Build a community-driven platform for sharing and collaborating on recipes
- Reduce food waste through intelligent ingredient substitution and meal planning
- Create a modern, accessible, and visually appealing culinary experience

---

## Current Status

- **Version:** Beta (v0.1.0)
- **Completion:** 75% complete
- **Last Updated:** January 2026
- **Availability:** Private beta (pre-release)
- **Project Status:** Active development, core features operational
- **Team Size:** Solo developer

**Progress:** `███████████████████░░░` 75%

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS, PostCSS
- **Component Library:** Shadcn UI (Radix UI + Tailwind)
- **State Management:** Zustand (global), React Context (local)
- **Forms:** React Hook Form with Zod validation

### Backend & Data
- **Runtime:** Cloudflare Workers (Edge Runtime)
- **API Layer:** Next.js API Routes with Edge Runtime
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (beta) with Supabase Auth
- **Storage:** Supabase Storage (S3-compatible)

### AI/ML (Client-Side)
- **Text Generation:** `@huggingface/transformers` (v3.5.1) with ONNX Runtime Web
  - Model: `onnx-community/Llama-3.2-1B-Instruct` (ONNX format)
- **Image Detection:** `@tensorflow/tfjs` (v4.22.0)
  - Model: YOLOv8n (TensorFlow.js format)
  - Backends: WebGL, WASM, CPU

### Deployment & Infrastructure
- **Hosting:** Cloudflare Pages
- **Backend Services:** Supabase (PostgreSQL, Auth, Storage)
- **CI/CD:** GitHub Actions
- **Package Manager:** npm
- **Edge Runtime:** Cloudflare Workers compatibility

### Development Tools
- **Testing:** Jest (unit/integration), Cypress (E2E)
- **Linting:** ESLint, Prettier
- **Documentation:** Storybook
- **AI Tools Used:** Cursor, v0, Perplexity

### External APIs
- **Resend API:** Email delivery service
- **PostHog:** Analytics and A/B testing (integration in progress)
- **OpenRouter API:** Planned for premium server-side AI features

---

## Key Features (Completed)

- ✅ **Landing Page & Waitlist** — Professional marketing site with conversion-optimized CTA and email collection
- ✅ **Authentication System** — OAuth (Google) and email/password authentication with NextAuth.js
- ✅ **Recipe Management** — Full CRUD operations with comprehensive creation form
- ✅ **Recipe Discovery** — Advanced search and filtering by cuisine, dietary preferences, ingredients, and cooking time
- ✅ **Social Features** — Likes, comments, saves, shares, and user following system
- ✅ **Real-time Messaging** — Complete messaging system with conversations and Server-Sent Events (SSE)
- ✅ **User Profiles** — Customizable profiles with avatar support and collections
- ✅ **Recipe Collections** — User-created cookbooks for recipe organization
- ✅ **TikTok-Style Recipe Reel** — Vertical recipe discovery interface with infinite scroll
- ✅ **Enhanced Recipe Posts** — Recipe detail pages with step-by-step photos and performance optimizations
- ✅ **Client-Side AI** — Text-to-recipe generation using Llama 3.2 1B Instruct model
- ✅ **PWA Support** — Service worker caching for offline AI model access
- ✅ **UI Consistency System** — Centralized theme system with dark mode support
- ✅ **Database Security** — Row Level Security (RLS) policies optimized and applied
- ✅ **Email System** — Branded email templates with Cloudflare Worker integration

---

## Features In Progress

- 🔄 **Production Hardening & Monitoring** (ETA: 2-3 weeks)
  - Error tracking setup (Sentry or similar)
  - Performance monitoring dashboards
  - Alerting for critical metrics
  - Durable Object deployment for rate limiting

- 🔄 **PostHog Analytics & A/B Testing** (ETA: 1-2 weeks)
  - Fix PostHog event capture issues
  - Implement A/B testing infrastructure
  - Set up conversion tracking funnels

- 🔄 **AI Feature Enhancement** (ETA: 4-5 weeks)
  - Complete YOLOv8n integration for ingredient detection
  - Refine Llama 3.2 prompt engineering
  - Improve structured output parsing
  - Optimize AI model performance and caching

- 🔄 **User Account Bug Fixes** (ETA: 1-2 weeks)
  - Fix profile update issues
  - Resolve authentication edge cases
  - Improve error messages
  - Enhance email confirmation UX

- 🔄 **CSS & UI Consistency Fixes** (ETA: ongoing)
  - Fix mobile responsive issues
  - Resolve dark mode inconsistencies
  - Improve accessibility (ARIA labels, keyboard navigation)
  - Optimize component styling

---

## Planned Features

- 📋 **Comprehensive AI Chat Overhaul** — Redesigned interface with conversation history and context-aware responses
- 📋 **Recommendation Engine** — Personalized recipe recommendations based on preferences, history, and behavior
- 📋 **AI "Add to Post" Feature** — Integrate AI generation directly into recipe creation workflow
- 📋 **User Preferences System** — Dietary restrictions, skill levels, and cuisine preferences for personalization
- 📋 **Social Feature Integration Enhancement** — Improved follower/following UI, activity feed, and notifications
- 📋 **Meal Planning System** — Calendar-based meal organization with shopping list generation
- 📋 **Server-Side AI (Premium Tier)** — Advanced AI features using OpenRouter API (GPT-4, Claude)
- 📋 **Mobile App** — React Native app for iOS and Android
- 📋 **Advanced Search** — Semantic search using vector embeddings
- 📋 **Recipe Marketplace** — Platform for creators to monetize premium recipes and courses
- 📋 **API Access** — Public API for third-party developers
- 📋 **Payment Integration** — Lemon Squeezy for premium features and marketplace transactions
- 📋 **Internationalization (i18n)** — Multi-language support for global expansion
- 📋 **Advanced Analytics Dashboard** — Comprehensive analytics for creators (views, engagement, audience insights)

**See [ROADMAP.md](ROADMAP.md) for detailed feature plans and timelines.**

---

## Key Decisions

### Why YOLOv8n and ONNX?

**YOLOv8n (Image Detection):**
- **Mobile-First:** Optimized for browser-based inference with TensorFlow.js
- **Performance:** Lightweight model suitable for client-side processing
- **Compatibility:** Works with WebGL, WASM, and CPU backends for broad device support
- **Trade-off:** Uses general COCO labels (not culinary-specific), but sufficient for ingredient detection use case

**ONNX (Text Generation):**
- **Client-Side AI:** ONNX Runtime Web enables running AI models directly in the browser
- **Privacy:** User data never leaves their device
- **Cost:** No server costs for AI inference
- **Offline:** Works without internet after initial model download
- **Performance:** ONNX format optimized for web deployment with quantized models (int8)

### Why Supabase, Cloudflare, and Next.js?

**Supabase:**
- **Managed PostgreSQL:** Automatic backups, point-in-time recovery, connection pooling
- **Built-in Auth:** OAuth, email/password, magic links with minimal setup
- **Row Level Security:** Database-level security policies, not application-level
- **Real-time:** WebSocket support for live features (future)
- **Storage:** S3-compatible object storage for images
- **Developer Experience:** Excellent dashboard, SQL editor, migration tools

**Cloudflare Pages:**
- **Global Edge Network:** Sub-200ms response times worldwide
- **Zero Cold Starts:** Workers are always warm, unlike traditional serverless
- **Cost-Effective:** Generous free tier, pay-per-use pricing
- **Integrated Platform:** Pages, Workers, and CDN in one service
- **Security:** Built-in DDoS protection, WAF, and SSL

**Next.js:**
- **Unified Framework:** Single codebase for frontend and API routes
- **Server-Side Rendering:** SEO-friendly recipe pages with fast initial load
- **Edge Runtime Support:** Native compatibility with Cloudflare Workers
- **TypeScript Integration:** End-to-end type safety
- **Developer Experience:** Hot reloading, excellent tooling, large ecosystem

### Why Private for Now?

Building MVP before public launch to:
- Validate core features with early users
- Complete production hardening (monitoring, error tracking)
- Fix critical bugs and UX issues
- Establish stable infrastructure
- Gather user feedback for iteration

**Target:** Public beta launch with 1,000+ users and core features operational.

---

## Success Metrics

### User Growth
- **Year 1 Target:** 10,000+ active users, 5,000+ recipes published, 50+ active creators
- **Year 2 Target:** 100,000+ active users, 50,000+ recipes, 500+ creators
- **3-Month Post-Launch:** 1,000+ users

### Feature Adoption
- **AI Features:** 60% of users engage with AI features within first week
- **Social Features:** 40% improvement in daily active users
- **Creator Retention:** 70% of creators publish 5+ recipes

### Performance Benchmarks
- **API Response Time:** <200ms (p95) — ✅ Currently meeting target
- **Page Load Time:** <2s (First Contentful Paint) — ⚠️ Needs measurement
- **Core Web Vitals:** All "Good" ratings — ⚠️ Needs measurement
- **Uptime:** 99.9% target

### Business Metrics (Post-Launch)
- **Creator Retention:** 70% of creators publish 5+ recipes
- **Consumer Engagement:** 10+ recipes saved per active user
- **Conversion Rate:** 5% waitlist-to-signup conversion
- **Unit Economics:** Positive unit economics by end of Year 1

### Technical Metrics
- **Build Success Rate:** 100% ✅
- **Deployment Success:** 100% ✅
- **API Functionality:** 100% ✅
- **Database Performance:** Optimized (RLS policies consolidated) ✅

---

## Known Limitations

### Current Limitations

**AI & Performance:**
- YOLOv8n uses general COCO labels, not culinary-specific (may misidentify some ingredients)
- Large AI model files (~50MB) impact initial page load times (mitigated by service worker caching)
- Llama 3.2 output quality needs refinement through prompt engineering
- Client-side models limited to smaller models; advanced features require server-side AI (premium tier)

**Offline Support:**
- PWA caching works for AI models and static assets
- Saving recipes and social features require internet connection
- Full offline recipe browsing not yet implemented

**Mobile Experience:**
- Responsive design improvements needed
- Some UI components need mobile optimization
- Touch interactions could be enhanced

**Analytics & Monitoring:**
- PostHog event capture experiencing issues (needs debugging)
- No production error tracking yet (Sentry integration planned)
- Performance monitoring dashboards not yet set up

**Database & Infrastructure:**
- Prisma CLI migration commands sometimes hang with Supabase (requires manual SQL workarounds)
- Some edge runtime database operations use mock data (production solution needed)
- Migration history desync from manual migrations

**Development Experience:**
- React 19/Radix UI compatibility issues (console errors with select components)
- Date handling in API responses needs explicit conversion
- Error boundaries need more comprehensive coverage

### Planned Improvements

**Short-Term (Next 3 Months):**
- Complete YOLOv8n integration and refine AI prompts
- Fix PostHog analytics and implement A/B testing
- Set up error monitoring and performance dashboards
- Resolve mobile responsive issues
- Improve accessibility (ARIA labels, keyboard navigation)

**Medium-Term (6 Months):**
- Server-side AI for premium tier (OpenRouter API)
- Real-time features with WebSocket subscriptions
- Advanced recommendation engine
- Meal planning system
- Enhanced creator analytics

**Long-Term (12+ Months):**
- Mobile app (React Native)
- Recipe marketplace for monetization
- Internationalization (i18n)
- Advanced search with embeddings
- API access for developers

---

## Important URLs/Credentials

### Production
- **Production Site:** [nextdish.app](https://nextdish.app) (or configured custom domain)
- **Email Worker:** [email.nextdish.app](https://email.nextdish.app) (Cloudflare Worker)

### Development
- **Local Development:** `http://localhost:3000`
- **Staging:** [Configure if applicable]

### Documentation
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Roadmap:** [ROADMAP.md](ROADMAP.md)
- **Database Schema:** [SCHEMA.md](SCHEMA.md)
- **API Documentation:** See `src/app/api/` directory or [ARCHITECTURE.md](ARCHITECTURE.md)

### Services
- **Supabase Dashboard:** [Configure in Supabase]
- **Cloudflare Pages Dashboard:** [Configure in Cloudflare]
- **GitHub Repository:** [Private repository]

### Admin/Internal
- **Admin Dashboard:** [To be implemented]
- **Analytics Dashboard:** PostHog (when fixed)

---

## Project Timeline

**Start Date:** [Project start date]  
**Current Phase:** Beta (75% complete)  
**Target Public Launch:** [To be determined based on production hardening completion]

**Major Milestones:**
- ✅ Phase 1: Foundation (Landing page, waitlist, authentication)
- ✅ Phase 2: Core Features (Recipes, social, messaging)
- ✅ Phase 3: Advanced Features (Recipe reel, AI, PWA)
- ✅ Phase 4: Security & Performance (RLS, database optimization)
- 🔄 Phase 5: Production Hardening (Monitoring, bug fixes)
- 📋 Phase 6: Public Launch Preparation
- 📋 Phase 7: Post-Launch Growth & Optimization

---

*Last Updated: January 2026*  
*For the most current status, see [ROADMAP.md](ROADMAP.md) and [README.md](README.md)*
