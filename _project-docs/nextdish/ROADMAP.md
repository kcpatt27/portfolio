# NextDish Roadmap

## Vision Statement

**What is the ultimate goal of this project?**

NextDish aims to become the premier AI-powered culinary platform that connects recipe creators with home cooks worldwide. We're building a two-sided marketplace where creators can grow their audience and monetize their content, while consumers discover diverse, high-quality recipes through intelligent AI-powered tools.

**What problem does it solve?**

- **For Home Cooks:** Finding quality recipes is overwhelming—too many ads, unreliable sources, and difficulty adapting recipes to available ingredients. Food waste is a major concern.
- **For Recipe Creators:** Reaching engaged audiences is challenging, and existing platforms don't provide specialized tools for culinary content management and monetization.

**Who is it for?**

- **Primary Customers:** Recipe creators (home cooks, food bloggers, culinary influencers) who want to build their audience and potentially monetize their content.
- **End Users:** Home cooks of all skill levels seeking diverse, reliable recipes with AI-powered assistance for ingredient substitution, meal planning, and waste reduction.

**What success looks like in 1-2 years?**

- **Year 1:** 10,000+ active users, 5,000+ recipes published, 50+ active creators, positive unit economics
- **Year 2:** 100,000+ active users, 50,000+ recipes, 500+ creators, sustainable revenue from premium features and marketplace
- **Platform Maturity:** Recognized as the go-to platform for recipe discovery, creator monetization, and AI-powered culinary assistance

---

## Current Status

**Latest Version:** Beta (v0.1.0)  
**Release Date:** Pre-release (75% complete)  
**Project Status:** Active development, private beta  
**Team Size:** Solo developer  
**Last Updated:** January 2026

### Project Status Summary

**Status:** 75% Complete (Core features shipped, working on production hardening & UX improvements)

**Progress:** `███████████████████░░░` 75%

**Completed Features:**
- ✅ Landing page & waitlist system
- ✅ Authentication (OAuth + email/password)
- ✅ Recipe CRUD operations with comprehensive creation form
- ✅ Social features (likes, comments, saves, shares, follows)
- ✅ Real-time messaging system
- ✅ TikTok-style recipe reel with infinite scroll
- ✅ Recipe posts with step-by-step photos
- ✅ Client-side AI (Llama 3.2 text-to-recipe generation)
- ✅ UI consistency system with centralized theme
- ✅ Database security (RLS policies optimized)
- ✅ PWA with service worker caching

**In Progress:**
- 🔄 Production hardening & monitoring (ETA: 2-3 weeks)
- 🔄 PostHog analytics & A/B testing fix (ETA: 1-2 weeks)
- 🔄 AI feature enhancement - YOLOv8n integration (ETA: 4-5 weeks)
- 🔄 User account bug fixes (ETA: 1-2 weeks)
- 🔄 CSS & UI consistency improvements (ETA: ongoing)

---

### Key Milestones Completed

✅ **Phase 1: Foundation (COMPLETED)**
- Landing page deployed to Cloudflare Pages
- Waitlist system operational with email collection
- Authentication system (OAuth + email/password) working in production
- Database schema with Prisma ORM
- Edge runtime compatibility across all routes

✅ **Phase 2: Core Features (COMPLETED)**
- Recipe CRUD operations with comprehensive creation form
- Social features (likes, comments, saves, shares, follows)
- Real-time messaging system with SSE
- User profiles and collections
- Recipe discovery (search, filtering, recommendations)

✅ **Phase 3: Advanced Features (COMPLETED)**
- TikTok-style recipe reel with infinite scroll
- Enhanced recipe posts with step-by-step photos
- Client-side AI (Llama 3.2 for text-to-recipe generation)
- PWA with service worker caching for offline access
- UI consistency system with centralized theme

✅ **Phase 4: Security & Performance (COMPLETED)**
- Row Level Security (RLS) policies optimized and applied
- Database performance optimization (cached auth pattern)
- Content Security Policy (CSP) implementation
- Safe user deletion with audit logging
- Email system with branded templates

### Current Metrics

- **Build Success Rate:** 100%
- **Deployment Success:** 100% (Cloudflare Pages)
- **API Functionality:** 100% (all core endpoints operational)
- **Database Performance:** Optimized (RLS policies consolidated, unused indexes removed)
- **Waitlist Signups:** Tracking in progress
- **User Engagement:** To be measured post-public launch

---

## Priority Roadmap (Immediate Focus)

**Current Focus:** Core MVP features and platform stability.

### Top 5 Priorities

#### 1. Continue Social Features
**Status:** IN PROGRESS | **Priority:** HIGH | **Effort:** 2-3 weeks

**Tasks:** Complete Following/Users feature implementation; follower/following lists UI; user profile enhancements; comprehensive testing (unit, integration, E2E); integrate with existing social interaction system.

**Dependencies:** None | **Blockers:** None

#### 2. Recipe Reel Feature
**Status:** COMPLETED | **Priority:** HIGH

**Completed:** TikTok-style vertical recipe discovery; native infinite scroll (Intersection Observer); scroll-snapping and gesture controls; pagination and API integration; recipe interaction overlays (like, save, share); edge runtime compatibility; loading states and error handling.

#### 3. Test/Update Security Implementation
**Status:** PENDING | **Priority:** HIGH | **Effort:** 1-2 weeks

**Tasks:** Execute RLS policy tests (`scripts/test-rls-policies.js`); validate security in production; test edge runtime auth compatibility; verify user isolation and data protection; run security test suite.

**Dependencies:** None | **Blockers:** None

#### 4. Production Hardening
**Status:** PENDING | **Priority:** HIGH | **Effort:** 2-3 weeks

**Tasks:** Apply RLS policies to production database; configure OAuth providers in Supabase; set up monitoring and alerting; deploy Durable Object for rate limiting; configure production env vars; security monitoring and incident response.

**Dependencies:** Security implementation testing | **Blockers:** None

#### 5. AI Feature Enhancement
**Status:** PENDING | **Priority:** HIGH | **Effort:** 4-5 weeks

**Tasks:** Complete YOLOv8n integration for ingredient detection; refine Llama 3.2 prompt engineering; server-side AI for premium features; ingredient substitution improvements; image-to-recipe workflow enhancements; optimize AI model performance and caching.

**Dependencies:** None | **Blockers:** None

### Secondary Priorities (Medium Focus)

- **PostHog Analytics & A/B Testing** (PENDING, 1-2 weeks): Fix event capture, debug analytics config, A/B testing infrastructure, conversion tracking, dashboards. Blockers: PostHog configuration issues.
- **Deploy Durable Object** (PENDING, 1 day): Deploy Cloudflare Pages Functions to provision `RATE_LIMITER_DO`; verify rate limiting; test edge runtime compatibility.
- **Email Verification** (PENDING, 1-2 days): Confirm Supabase "Require email confirmation"; test flow; verify API gating.

### Technical Debt & Known Issues

**High:** PostHog analytics event capture unreliable; edge runtime DB access (mock data vs production); Prisma CLI migration commands hanging with Supabase.

**Medium:** React 19/Radix UI compatibility (console errors with select components); date handling in API responses; error boundaries need improvement.

**Low:** Console errors (React 19 compatibility); YOLOv8n uses general COCO labels; Llama 3.2 output quality needs refinement.

**Notes:** PostHog deferred to secondary priority; Node 20 in use for wrangler; email system operational; RLS policies ready for production; infrastructure stable.

---

## Now (Next 4 Weeks)

### Feature 1: Production Hardening & Monitoring
**Why:** Solves critical production readiness gap. Without error tracking and performance monitoring, we're blind to production issues. Needed by 100% of users for platform stability.

**Impact:** Enables data-driven decision making, reduces downtime, improves user experience. Estimated 30% reduction in time-to-resolution for production issues.

**Status:** In progress

**Tasks:**
- Set up error monitoring (Sentry or similar)
- Implement performance monitoring dashboards
- Configure alerting for critical metrics
- Deploy Durable Object for rate limiting
- Complete environment variable audit

---

### Feature 2: PostHog Analytics & A/B Testing Fix
**Why:** Solves conversion optimization blind spot. PostHog event capture is broken, preventing data-driven landing page optimization. Needed for measuring impact of CTA changes and user behavior analysis.

**Impact:** Enables conversion rate optimization, A/B testing infrastructure, and user behavior insights. Estimated 20% improvement in landing page conversion through data-driven optimization.

**Status:** Planned

**Tasks:**
- Debug PostHog event capture issues
- Fix CSP allowlist for PostHog domains
- Implement A/B testing infrastructure
- Set up conversion tracking funnels
- Create analytics dashboards

---

### Feature 3: AI Feature Enhancement
**Why:** Solves incomplete AI capabilities. YOLOv8n integration is in progress, and Llama 3.2 prompts need refinement. Needed by users seeking advanced AI-powered recipe assistance.

**Impact:** Completes core value proposition of AI-powered platform. Estimated 40% improvement in recipe generation quality and ingredient detection accuracy.

**Status:** Planned

**Tasks:**
- Complete YOLOv8n integration for ingredient detection
- Refine Llama 3.2 prompt engineering
- Improve structured output parsing
- Optimize AI model performance and caching
- Add image-to-recipe workflow enhancements

---

### Feature 4: User Account Bug Fixes
**Why:** Solves user experience friction. Various account-related bugs identified in testing need resolution before public launch. Needed by all users for smooth onboarding and account management.

**Impact:** Reduces user frustration, improves retention. Estimated 15% improvement in user activation rate.

**Status:** Planned

**Tasks:**
- Fix profile update issues
- Resolve authentication edge cases
- Improve error messages for account operations
- Enhance email confirmation UX
- Test complete user lifecycle flows

---

### Feature 5: CSS & UI Consistency Fixes
**Why:** Solves visual inconsistencies that impact user trust and experience. Various CSS bugs and styling inconsistencies identified across pages. Needed for professional appearance.

**Impact:** Improves perceived quality and user trust. Estimated 10% improvement in user engagement metrics.

**Status:** In progress

**Tasks:**
- Fix mobile responsive issues
- Standardize color schemes across all pages
- Resolve dark mode inconsistencies
- Improve accessibility (ARIA labels, keyboard navigation)
- Optimize component styling

---

## Next (Months 2-3)

### Feature 6: Comprehensive AI Chat Overhaul
**Why:** Solves limited AI interaction capabilities. Current AI chat is basic and needs enhancement for better user experience. Needed by users seeking advanced recipe assistance.

**Impact:** Increases AI feature adoption and user engagement. Estimated 25% increase in daily active users using AI features.

**Status:** Planned

**Tasks:**
- Redesign AI chat interface
- Add conversation history
- Implement context-aware responses
- Add recipe saving from AI chat
- Improve streaming output UX

---

### Feature 7: Recommendation Engine
**Why:** Solves discovery problem. Users need personalized recipe recommendations based on preferences, history, and behavior. Needed by 80% of users for content discovery.

**Impact:** Increases recipe engagement and user retention. Estimated 35% improvement in recipes viewed per session.

**Status:** Planned

**Tasks:**
- Implement collaborative filtering algorithm
- Add content-based recommendations
- Create user preference learning system
- Build recommendation API endpoints
- Add recommendation UI components

---

### Feature 8: AI "Add to Post" Feature
**Why:** Solves creator workflow friction. Creators want to easily add AI-generated recipes to their posts. Needed by recipe creators for content creation efficiency.

**Impact:** Increases creator productivity and content volume. Estimated 50% reduction in recipe creation time for creators.

**Status:** Planned

**Tasks:**
- Integrate AI generation into recipe creation flow
- Add "Generate with AI" button to post creation
- Implement recipe editing from AI output
- Add image generation suggestions
- Create creator workflow optimizations

---

### Feature 9: User Preferences System
**Why:** Solves personalization gap. Users need to set dietary restrictions, skill levels, and cuisine preferences for better recommendations. Needed by 70% of users for personalized experience.

**Impact:** Improves recommendation accuracy and user satisfaction. Estimated 30% improvement in recipe save rate.

**Status:** Planned

**Tasks:**
- Build preferences UI components
- Create preferences API endpoints
- Integrate preferences into recommendation engine
- Add preference-based filtering
- Implement preference learning from behavior

---

### Feature 10: Social Feature Integration Enhancement
**Why:** Solves incomplete social experience. Basic social features exist but need better integration and UX improvements. Needed by 60% of users for community engagement.

**Impact:** Increases social engagement and platform stickiness. Estimated 40% improvement in daily active users.

**Status:** Planned

**Tasks:**
- Enhance follower/following UI
- Improve notification system
- Add activity feed
- Create social discovery features
- Implement social sharing enhancements

---

### Feature 11: Create Recipe Post Enhancement
**Why:** Solves creator content creation workflow. Recipe creation form exists but needs enhancements for better creator experience. Needed by recipe creators.

**Impact:** Increases creator satisfaction and content quality. Estimated 20% increase in recipes published per creator.

**Status:** Planned

**Tasks:**
- Add recipe templates
- Implement bulk ingredient import
- Enhance image upload workflow
- Add recipe scheduling
- Create recipe analytics for creators

---

## Later (Exploratory/Future)

### Feature 12: Meal Planning System
**Priority:** Medium  
**Description:** Calendar-based meal planning with shopping list generation. Helps users plan weekly meals and reduce food waste.

**Why:** Addresses meal planning pain point for busy home cooks. Reduces decision fatigue and food waste.

---

### Feature 13: Server-Side AI (Premium Tier)
**Priority:** High (Revenue)  
**Description:** Premium features using OpenRouter API for advanced AI capabilities (GPT-4, Claude) for complex recipe generation and analysis.

**Why:** Enables monetization and provides advanced AI features beyond client-side limitations.

---

### Feature 14: Mobile App (React Native)
**Priority:** Medium  
**Description:** Native mobile app for iOS and Android with shared business logic.

**Why:** Expands platform reach and improves mobile user experience beyond PWA.

---

### Feature 15: Advanced Search with Embeddings
**Priority:** Medium  
**Description:** Semantic search using vector embeddings for more intuitive recipe discovery.

**Why:** Improves search accuracy and user experience beyond keyword matching.

---

### Feature 16: Recipe Marketplace
**Priority:** Low (Long-term)  
**Description:** Platform for creators to monetize premium recipes and cooking courses.

**Why:** Creates revenue stream for creators and platform, but requires significant user base first.

---

### Feature 17: API Access for Developers
**Priority:** Low  
**Description:** Public API for third-party developers to integrate NextDish recipes.

**Why:** Expands platform reach and creates ecosystem, but not critical for MVP.

---

### Feature 18: Internationalization (i18n)
**Priority:** Low  
**Description:** Multi-language support for global expansion.

**Why:** Enables international growth, but requires significant user base in target markets first.

---

### Feature 19: Advanced Analytics Dashboard
**Priority:** Medium  
**Description:** Comprehensive analytics for creators (views, engagement, audience insights).

**Why:** Provides value to creators and differentiates platform from competitors.

---

### Feature 20: Step-by-Step Recipe Images
**Priority:** Medium  
**Description:** Add support for multiple images per recipe step (carousel/slideshow per step) to provide visual guidance during cooking.

**Why:** Enhances recipe clarity and reduces cooking errors. Visual learners benefit from seeing each step. Estimated 25% improvement in recipe completion rate.

---

### Feature 21: Video Support (Short & Long Form)
**Priority:** High  
**Description:** Support for two video formats per post: short-form reels (15-60s) and long-form recipe videos (up to 10 minutes). Includes video hosting, thumbnail generation, and transcoding.

**Why:** Video content drives 5x more engagement than static posts. Supports diverse creator content styles and increases platform stickiness. Critical for competing with TikTok/Instagram.

**Tasks:**
- Choose video hosting provider (Cloudflare Stream, Supabase Storage, or S3)
- Implement video upload API with presigned URLs
- Add automatic thumbnail generation
- Build video player with quality settings
- Add video to post creation flow

---

### Feature 22: Flexible Recipe Delete Options
**Priority:** Low  
**Description:** Enhanced delete flow offering users three options when deleting recipes used in posts: (1) Set posts to draft and delete recipe, (2) Delete posts and recipe, or (3) Cancel and manage posts manually.

**Why:** Provides flexibility for power users while maintaining data integrity. Reduces accidental deletions and improves creator control. MVP includes option 1 only.

---

### Feature 23: Recipe Versioning
**Priority:** Low  
**Description:** Track recipe edit history, allowing users to view previous versions and revert changes if needed. Each version maintains its own engagement metrics.

**Why:** Enables experimentation without losing original recipes. Useful for A/B testing recipe variations. Estimated 15% increase in recipe iterations by creators.

---

### Feature 24: Smart Notifications for Recipe Changes
**Priority:** Medium  
**Description:** Notify users when recipes they've saved are deleted or significantly edited. Offer "Create your own version" (remix) to preserve their cookbook if original is removed.

**Why:** Prevents broken cookbook entries and maintains user trust. Estimated 20% reduction in user frustration from deleted content.

**Tasks:**
- Build notification system infrastructure
- Implement recipe change detection
- Add "Remix this recipe" quick action
- Create notification preferences UI
- Add email digest for recipe changes

---

### Feature --: Payment Integration (Lemon Squeezy)
**Priority:** Medium (Revenue)  
**Description:** Payment processing for premium features and marketplace transactions.

**Why:** Enables monetization strategy, but requires premium features to be built first.

---

## Decision Framework

### How Priorities Are Set

**1. User Feedback (40% weight)**
- Direct user requests from waitlist signups
- User testing feedback
- Support tickets and feature requests
- Community discussions

**2. Business Metrics (30% weight)**
- Impact on user acquisition
- Impact on user retention
- Revenue potential (for premium features)
- Creator satisfaction and content volume

**3. Technical Debt (20% weight)**
- Security and stability issues (highest priority)
- Performance bottlenecks
- Code quality and maintainability
- Infrastructure improvements

**4. Developer Experience (10% weight)**
- Development velocity improvements
- Tooling and automation
- Documentation and testing
- Code reusability

### Priority Tiers

- **Critical:** Security, stability, production readiness (always prioritized)
- **High:** Core MVP features, user-facing improvements, revenue-generating features
- **Medium:** Platform enhancements, creator tools, advanced features
- **Low:** Nice-to-haves, exploratory features, long-term vision

---

## Risks & Dependencies

### External Dependencies

**1. Supabase Service Availability**
- **Risk:** Platform downtime or API changes could impact core functionality
- **Mitigation:** Monitor Supabase status, have backup database migration plan, use connection pooling
- **Impact:** High (affects all database operations)

**2. Cloudflare Pages/Workers**
- **Risk:** Edge runtime limitations or service changes
- **Mitigation:** Stay updated on Cloudflare announcements, test edge runtime compatibility regularly
- **Impact:** High (affects all API routes)

**3. AI Model Availability**
- **Risk:** Hugging Face model repository changes or model deprecation
- **Mitigation:** Cache models locally, have backup model options, version pin models
- **Impact:** Medium (affects AI features only)

**4. Email Service (Resend)**
- **Risk:** Email delivery issues or API changes
- **Mitigation:** Monitor email delivery rates, have fallback email service option
- **Impact:** Medium (affects user onboarding and notifications)

### Resource Constraints

**1. Solo Developer Time**
- **Risk:** Limited bandwidth for feature development and maintenance
- **Mitigation:** Prioritize ruthlessly, automate repetitive tasks, focus on high-impact features
- **Impact:** High (affects all development velocity)

**2. Infrastructure Costs**
- **Risk:** Scaling costs could exceed budget
- **Mitigation:** Monitor usage, optimize costs, use free tiers where possible, plan for premium features
- **Impact:** Medium (affects growth rate)

### Unknown Technical Challenges

**1. Database Performance at Scale**
- **Risk:** Performance degradation with 10k+ users or 100k+ recipes
- **Mitigation:** Already optimized RLS policies, monitor query performance, plan for read replicas if needed
- **Impact:** Medium (affects user experience at scale)

**2. AI Model Quality**
- **Risk:** Client-side models may not meet quality expectations
- **Mitigation:** Continuous prompt engineering, user feedback loops, plan for server-side premium tier
- **Impact:** Medium (affects core value proposition)

**3. Edge Runtime Compatibility**
- **Risk:** Some npm packages may not work with edge runtime
- **Mitigation:** Test all dependencies, use edge-compatible alternatives, maintain compatibility checklist
- **Impact:** Low (most issues already resolved)

---

## Success Metrics

### User Growth Rate

**Target:** 1,000 users in first 3 months post-launch
- **Current:** Pre-launch (waitlist signups tracking)
- **Measurement:** Monthly active users (MAU), new signups per week
- **Tracking:** PostHog analytics (once fixed), Supabase database queries

### Feature Adoption

**Target:** 60% of users engage with AI features within first week
- **Current:** AI features available but adoption not yet measured
- **Measurement:** Feature usage events, user engagement funnels
- **Tracking:** PostHog event tracking, database analytics

### Performance Benchmarks

**Target:** 
- API response time: <200ms (p95)
- Page load time: <2s (First Contentful Paint)
- Core Web Vitals: All "Good" ratings

**Current:** 
- API response time: ✅ Meeting target (edge runtime)
- Page load time: ⚠️ Needs measurement
- Core Web Vitals: ⚠️ Needs measurement

**Measurement:** Cloudflare Analytics, PostHog (when fixed), Lighthouse CI

### Community Feedback

**Target:** 4.5+ star rating from early users, positive feedback on core features
- **Current:** Pre-launch, no user feedback yet
- **Measurement:** User surveys, support tickets, social media sentiment
- **Tracking:** Manual collection initially, automated feedback system (future)

### Business Metrics (Post-Launch)

**Target:** 
- Creator retention: 70% of creators publish 5+ recipes
- Consumer engagement: 10+ recipes saved per active user
- Conversion rate: 5% waitlist-to-signup conversion

**Current:** Pre-launch, metrics to be established
**Measurement:** Database analytics, user behavior tracking
**Tracking:** PostHog funnels, custom analytics dashboards

---

## Feedback & Iteration

### How Users Influence This Roadmap

**1. Feature Request Channels**
- **GitHub Issues:** Primary channel for technical feature requests and bug reports
- **Email:** Direct feedback via support email (to be established)
- **In-App Feedback:** Feedback widget in application (planned)
- **Waitlist Survey:** Periodic surveys to waitlist signups

**2. Review Frequency**
- **Weekly:** Review GitHub issues and support requests
- **Monthly:** Analyze user metrics and feature adoption
- **Quarterly:** Major roadmap review and priority adjustment

**3. Community Input Weight**
- **High Weight:** Security issues, critical bugs, core feature requests from 10+ users
- **Medium Weight:** Feature requests from 5-10 users, UX improvements
- **Low Weight:** Nice-to-have features, single-user requests (unless high-value)

**4. Feedback Processing**
1. **Collection:** Gather feedback from all channels
2. **Categorization:** Group by feature area and priority
3. **Evaluation:** Assess against decision framework (user feedback, metrics, technical debt)
4. **Prioritization:** Add to appropriate roadmap section (Now/Next/Later)
5. **Communication:** Update roadmap and communicate changes to community

### How to Give Feedback

- **GitHub Issues:** [Create an issue](https://github.com/[your-repo]/issues) for bugs and feature requests
- **Email:** [Your email] for direct feedback
- **Waitlist:** Join the waitlist and participate in surveys
- **Social Media:** [Links if applicable]

---

## How This Roadmap Gets Updated

**Review Schedule:**
- **Weekly:** Quick review of priorities and blockers
- **Monthly:** Comprehensive review with metrics analysis
- **Quarterly:** Major roadmap revision based on user feedback and business goals

**Update Triggers:**
- Major feature completion
- Significant user feedback
- Technical debt accumulation
- Business model changes
- Competitive landscape shifts

**Transparency:**
- Roadmap is public and updated regularly
- Major changes communicated via changelog
- Completed features moved to "Completed" section
- Delayed features explained with reasoning

**Flexibility:**
- Roadmap is a living document, not a contract
- Priorities can shift based on new information
- Features can be deprioritized or removed if no longer relevant
- New opportunities can be added as they arise

---

## Conclusion

This roadmap reflects NextDish's journey from a 75% complete beta to a fully-featured, production-ready platform. Our focus remains on delivering core value to both recipe creators and home cooks while building a sustainable, scalable business.

We're committed to transparency, user feedback, and data-driven decision making. As we learn from our users and the market, this roadmap will evolve to reflect what matters most for NextDish's success.

**Current Focus:** Production hardening, monitoring, and completing core MVP features to prepare for public launch.

**Next Milestone:** Public beta launch with 1,000+ users and core features operational.

---

*Last Updated: January 2026*  
*Next Review: February 2026*
