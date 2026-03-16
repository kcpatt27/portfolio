# IQ Up! Roadmap

## Vision Statement

**IQ Up!** aims to become the most effective browser-based training platform for improving performance on Raven's Progressive Matrices and Mensa-style intelligence tests. Our ultimate goal is to help test-takers systematically improve their pattern recognition skills through structured practice, intelligent spaced repetition, and actionable analytics.

**What problem does it solve?** Traditional test preparation for visual-spatial intelligence tests lacks structured practice, feedback loops, and adaptive learning. Users often practice with static question banks that don't adapt to their weaknesses or track long-term progress.

**Who is it for?** Test-takers preparing for Mensa admission, students studying cognitive pattern recognition, professionals seeking to improve analytical reasoning, and anyone interested in systematic visual-spatial skill development.

**What success looks like in 1-2 years?** 
- Thousands of active users completing regular practice sessions
- Measurable improvement in user performance over time (tracked via analytics)
- Community recognition as a go-to resource for Raven's/Mensa preparation
- Feature-complete platform with advanced analytics, progress tracking, and personalized training plans
- Potential expansion to mobile apps or additional test formats

## Project Status Summary

**Status**: 30% Complete (MVP core features shipped; much still missing)

**Progress**: `██████░░░░░░░░░░░░░░░░` 30%

**Completed Features**:
- ✅ Core MVP functionality (Phases 1-7): Database, generator, test runner, results, review system, calendar
- ✅ Test coverage & verification (Phase 8): 85 tests passing, automated accessibility checks
- ✅ UI polish & design system (Phase 10): Tailwind utilities, dark mode, responsive layouts
- ✅ Advanced question generation (Phase 11): 14 shapes, 10 rule families, near-infinite variations

**In Progress**:
- Performance optimization (ETA: 2 weeks)
- Documentation & onboarding improvements (ETA: 3 weeks)

**Planned**: Enhanced analytics dashboard, export/import functionality, difficulty calibration — [See full roadmap](#now-next-4-weeks)

**Stats**:
- Test coverage: 85 tests passing (< 10s execution)
- Documentation: Complete (README, ARCHITECTURE, ROADMAP, SCHEMA)
- Performance: < 50ms median API response time
- Last updated: January 2025

---

## Current Status

**Version:** MVP (Pre-release)  
**Last Updated:** January 2025  
**Availability:** Private (development/testing phase)  
**Team Size:** Solo developer

### Key Milestones Completed

- ✅ **Phases 1-7**: Core MVP functionality delivered
  - D1 database setup with repositories for all entities
  - Deterministic question generator with seeded RNG
  - Test runner (timed/drill modes) with HTMX fragments
  - Results page with accuracy, latency, and error categorization
  - Spaced repetition review system (SM-2-lite algorithm)
  - 6-week training calendar with completion tracking
  - Comprehensive test suite (85 tests, all passing)

- ✅ **Phase 8**: Test coverage and verification
  - Keyboard shortcuts and HTMX enrichment
  - Negative route handling
  - Error classification persistence
  - Automated accessibility checks (axe-core)

- ✅ **Phase 10**: UI polish and design system
  - Tailwind CSS design tokens and utilities
  - Responsive layouts across all pages
  - Dark mode support (prefers-color-scheme)
  - Accessibility compliance (no critical violations)

- ✅ **Phase 11**: Advanced question generation
  - 14 primitive shapes and 10 advanced rule families
  - Near-infinite 3x3 question variations
  - Backward compatibility with 2x2 drill mode

### Current Metrics

- **Test Coverage**: 85 tests passing, < 10s execution time
- **Accessibility**: Zero critical violations (axe-core verified)
- **Performance**: < 50ms median API response time (edge computing)
- **Question Variety**: 14 shapes × 10 rule families = extensive variation
- **User Base**: Pre-release (not yet public)

## Now (Next 4 weeks)

### Enhanced Analytics Dashboard

**Why**: Users need to see progress over time, not just per-session results. Current analytics only show single-session stats. Long-term tracking will help users identify improvement patterns and adjust their training strategy.

**Impact**: Estimated 40% increase in user engagement and retention. Users who can see their progress are more likely to continue practicing regularly.

**Status**: Planned

**Details**:
- Historical accuracy trends (line chart over time)
- Average latency trends
- Error category frequency over time
- Streak tracking (consecutive days practiced)
- Best performance records

### Export/Import Functionality

**Why**: Users want to save their practice data, share results, or analyze performance externally. Currently, all data is stored in browser/D1 with no export capability.

**Impact**: Enables users to track progress across devices, share results with tutors/coaches, and perform custom analysis. Estimated 25% improvement in user satisfaction.

**Status**: Planned

**Details**:
- Export session results as JSON/CSV
- Export review queue status
- Import previous data (for multi-device users)
- PDF report generation for results

### Question Difficulty Calibration

**Why**: Current difficulty levels are fixed. Users need adaptive difficulty that adjusts based on their performance to maintain optimal challenge level (not too easy, not too hard).

**Impact**: More effective training sessions. Users stay engaged when questions match their skill level. Estimated 30% improvement in practice session completion rates.

**Status**: Planned

**Details**:
- Track user performance per difficulty level
- Suggest optimal difficulty based on accuracy
- Adaptive question selection in drill mode
- Difficulty progression recommendations

### Performance Optimization

**Why**: As question complexity increases (3x3 with advanced rules), generation time may become noticeable. Optimization ensures sub-50ms response times even for complex questions.

**Impact**: Smoother user experience, especially on slower devices. Maintains competitive edge with fast, responsive interactions.

**Status**: In progress

**Details**:
- Cache frequently used rule combinations
- Optimize SVG rendering for complex glyphs
- Lazy-load question data where possible
- Database query optimization

### Documentation & Onboarding

**Why**: New users need clear guidance on how to use the platform effectively. Current documentation is technical (README) but lacks user-facing tutorials.

**Impact**: Reduces learning curve, increases user retention. Well-documented features are more likely to be discovered and used.

**Status**: Planned

**Details**:
- Interactive tutorial for first-time users
- Keyboard shortcuts reference page
- Best practices guide for effective training
- FAQ section addressing common questions

## Next (Months 2-3)

### Advanced Progress Tracking

**Why**: Users want detailed insights into their improvement journey. Current tracking is session-based; long-term analytics will show trends, plateaus, and breakthrough moments.

**Impact**: Data-driven training decisions. Users can identify which question types need more practice and adjust their focus accordingly.

**Status**: Planned

**Details**:
- Performance heatmaps (accuracy by question type)
- Improvement velocity metrics
- Weakness identification and recommendations
- Comparison to baseline performance

### Custom Training Plans

**Why**: The 6-week calendar is currently static. Users need personalized plans based on their goals, available time, and current skill level.

**Impact**: Higher adherence to training schedules. Personalized plans are more likely to be followed than generic templates.

**Status**: Planned

**Details**:
- Goal-based plan generation (e.g., "Prepare for test in 4 weeks")
- Time-based customization (daily practice duration)
- Focus area selection (specific rule families to emphasize)
- Adaptive plan adjustments based on progress

### Social Features (Optional)

**Why**: Some users benefit from community support and friendly competition. Leaderboards and progress sharing can motivate continued practice.

**Impact**: Increased engagement through social motivation. However, this may conflict with anonymous-first design, so it's marked as optional.

**Status**: Exploratory

**Details**:
- Anonymous leaderboards (accuracy, speed)
- Progress sharing (optional, opt-in)
- Achievement badges for milestones
- Community challenges

### Mobile-Optimized Experience

**Why**: While the web app works on mobile, a dedicated mobile-optimized experience would improve usability for on-the-go practice.

**Impact**: Increased accessibility and convenience. Mobile users represent a significant portion of potential user base.

**Status**: Planned

**Details**:
- Responsive design improvements for small screens
- Touch-optimized interactions
- Mobile-specific keyboard shortcuts
- Offline capability (Service Workers)

### Question Bank Curation

**Why**: While the generator creates infinite variations, curated question sets for specific scenarios (e.g., "Rotation patterns only", "Advanced 3x3") would help users focus their practice.

**Impact**: More targeted practice sessions. Users can focus on specific weaknesses identified in analytics.

**Status**: Planned

**Details**:
- Pre-defined question sets by rule family
- Difficulty-graded question collections
- Practice modes (e.g., "Speed training", "Accuracy focus")
- Custom question set builder

## Later (Exploratory/Future)

### Native Mobile Apps

**Priority**: Medium  
**Description**: Native iOS/Android apps for better performance and offline capabilities. Would require React Native or Flutter development, or a separate mobile codebase.

### AI-Powered Personalized Coaching

**Priority**: Low  
**Description**: Machine learning model that analyzes user patterns and provides personalized tips, identifies learning styles, and suggests optimal practice strategies.

### Multi-User Support & Authentication

**Priority**: Low  
**Description**: User accounts, authentication, and data persistence across devices. Currently anonymous-first design works for MVP, but multi-user would enable cloud sync and progress tracking.

### Advanced Gamification

**Priority**: Low  
**Description**: Points, levels, achievements, streaks, and challenges to increase engagement. May conflict with focused training approach, so low priority.

### Question Explanation System

**Priority**: Medium  
**Description**: After answering, show why the correct answer is correct and why other choices are wrong. Educational value for learning pattern recognition rules.

### Practice Mode Variations

**Priority**: Medium  
**Description**: Additional practice modes beyond timed/drill: "Speed rounds", "Accuracy focus", "Mixed difficulty", "Rule-specific training".

### Integration with Test Prep Platforms

**Priority**: Low  
**Description**: API or integration with other test preparation platforms, educational institutions, or tutoring services.

### Advanced Analytics & Reporting

**Priority**: Medium  
**Description**: Detailed statistical analysis, percentile rankings, performance predictions, and comprehensive progress reports suitable for sharing with educators or coaches.

### Question Generator Expansion

**Priority**: Low  
**Description**: Support for additional test formats beyond Raven's-style matrices (e.g., number sequences, verbal analogies, spatial reasoning).

### Offline-First Architecture

**Priority**: Medium  
**Description**: Full offline capability using Service Workers and local storage, enabling practice without internet connection.

## Decision Framework

Priorities are set based on the following criteria, weighted by importance:

1. **User Value** (40%): Does this solve a real problem users face? Is it frequently requested?
2. **Technical Feasibility** (25%): Can we build this with current resources? Are there blocking dependencies?
3. **Strategic Alignment** (20%): Does this align with our vision of effective, accessible training?
4. **Maintenance Cost** (10%): Will this add significant ongoing maintenance burden?
5. **Differentiation** (5%): Does this make us unique or better than alternatives?

**Process**:
- Features are evaluated against these criteria
- High-value, low-effort items are prioritized
- User feedback (when available) heavily influences "Now" priorities
- Technical debt is addressed proactively to avoid blocking future work

## Risks & Dependencies

### External Dependencies

**Cloudflare Platform Changes**
- **Risk**: Cloudflare Workers/D1 API changes could break functionality
- **Mitigation**: Monitor Cloudflare changelog, maintain test coverage, have migration plan ready
- **Impact**: Medium (platform is stable, but changes are possible)

**No External APIs Currently**: Application is self-contained, reducing external dependency risk.

### Resource Constraints

**Solo Developer Time**
- **Risk**: Limited time for feature development and maintenance
- **Mitigation**: Focus on high-impact features, automate testing, prioritize maintainable code
- **Impact**: High (affects development velocity)

**No User Feedback Yet**
- **Risk**: Building features users don't want
- **Mitigation**: Launch MVP to gather feedback, iterate based on real usage patterns
- **Impact**: Medium (will be addressed after public release)

### Technical Challenges

**D1 Write Concurrency Limits**
- **Risk**: SQLite limitations may become an issue with high concurrent usage
- **Mitigation**: Current single-user design avoids this. If scaling needed, consider Durable Objects or external database
- **Impact**: Low (current scale doesn't require this)

**Question Generation Performance**
- **Risk**: Complex 3x3 questions with multiple rules may slow down generation
- **Mitigation**: Caching, optimization, and performance monitoring. Already addressed in "Now" phase.
- **Impact**: Low (already being addressed)

**Browser Compatibility**
- **Risk**: HTMX and modern CSS features may not work in older browsers
- **Mitigation**: Progressive enhancement ensures basic functionality works everywhere. Modern browsers are target.
- **Impact**: Low (target audience uses modern browsers)

### Unknown Technical Challenges

**Mobile Performance**
- **Risk**: Complex SVG rendering may be slow on mobile devices
- **Mitigation**: Performance testing on real devices, optimization as needed
- **Impact**: Medium (will be discovered during mobile optimization)

**Data Migration**
- **Risk**: Schema changes may require data migration for existing users
- **Mitigation**: Version schema, plan migrations carefully, test thoroughly
- **Impact**: Low (MVP has no users yet, but future consideration)

## Success Metrics

### User Growth

- **Target**: 100+ active users within 3 months of public release
- **Measurement**: Unique sessions per month, returning user rate
- **Current**: Pre-release (baseline: 0)

### Feature Adoption

- **Target**: 70%+ of users complete at least one full test session
- **Measurement**: Session completion rate, average questions answered per session
- **Current**: N/A (no public users yet)

### Performance Benchmarks

- **Target**: Maintain < 50ms median API response time
- **Measurement**: Cloudflare Analytics, edge response times
- **Current**: ✅ Meeting target (< 50ms)

- **Target**: 95%+ test pass rate, < 10s test execution
- **Measurement**: CI/CD test results
- **Current**: ✅ Meeting target (85/85 tests passing, < 10s)

### User Engagement

- **Target**: 40%+ of users return within 7 days
- **Measurement**: Returning user rate, session frequency
- **Current**: N/A (no public users yet)

- **Target**: Average 3+ practice sessions per week per active user
- **Measurement**: Session count per user over time
- **Current**: N/A (no public users yet)

### Community Feedback

- **Target**: Positive feedback on usability and effectiveness
- **Measurement**: User surveys, GitHub issues/discussions, direct feedback
- **Current**: N/A (pre-release)

## Feedback & Iteration

### How Users Can Submit Feedback

**GitHub Issues** (Primary):
- Feature requests: Tagged with `enhancement`
- Bug reports: Tagged with `bug`
- Questions: Tagged with `question`
- Repository: [GitHub repository URL - to be added when public]

**Direct Contact** (Future):
- Email: [To be added when public]
- Contact form: [To be added on website]

**In-App Feedback** (Planned):
- Feedback button in application
- Quick survey after completing sessions
- Optional feedback prompts

### Review & Update Frequency

**Weekly Reviews**: 
- Review GitHub issues and feedback
- Assess feature requests against decision framework
- Update "Now" priorities if high-value items emerge

**Monthly Updates**:
- Update roadmap based on user feedback and technical learnings
- Adjust priorities in "Next" and "Later" sections
- Publish roadmap updates to keep community informed

**Quarterly Planning**:
- Major roadmap revisions
- Strategic direction assessment
- Resource allocation planning

### How Community Input is Weighted

1. **Frequency**: Features requested by multiple users are prioritized higher
2. **Impact**: High-impact features (affecting many users) are prioritized over niche requests
3. **Feasibility**: Requests that are technically feasible and align with vision are prioritized
4. **Strategic Value**: Features that differentiate the platform or solve core problems are prioritized

**Transparency**: All feature requests are acknowledged, and decisions are documented in GitHub issues with rationale.

### Iteration Philosophy

- **Ship Early, Iterate Often**: MVP-first approach, then refine based on real usage
- **Data-Driven**: Decisions based on metrics and user feedback, not assumptions
- **Maintain Quality**: Don't sacrifice code quality or accessibility for speed
- **User-Centric**: Features are evaluated from user perspective, not just technical interest

---

**Last Updated**: January 2025  
**Next Review**: Weekly (every Monday)  
**Roadmap Version**: 1.0

**Note**: This roadmap is a living document. Priorities may shift based on user feedback, technical discoveries, and strategic considerations. Major changes will be documented in roadmap updates.
