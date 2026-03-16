# Savant Insights Roadmap

## Vision Statement

Savant Insights exists to become the leading financial resource for neurodivergent individuals, empowering them with accessible, actionable insights tailored to diverse cognitive needs. The platform solves the critical problem of information overload and cognitive barriers that prevent neurodivergent investors from effectively engaging with financial markets.

**What problem does it solve?**
Traditional financial content is overwhelming, inaccessible, and doesn't account for diverse cognitive processing styles. Neurodivergent individuals face decision paralysis from information overload, lack of multi-format content options, and financial content that doesn't support executive function needs.

**Who is it for?**
- Neurodivergent individuals seeking accessible financial information
- Investors who need clear, actionable insights without cognitive overload
- Content creators looking for automated newsletter generation workflows

**What success looks like in 1-2 years:**
- 10,000+ active subscribers receiving weekly newsletters
- Recognized as the go-to financial resource for neurodivergent communities
- Fully automated content pipeline requiring minimal human intervention
- Multi-format content delivery (text, visual, audio, checklists) achieving 80%+ user satisfaction
- Community platform with engaged members sharing success stories and strategies
- Sustainable monetization through premium subscriber features
- High-quality, accessible content that helps subscribers make informed financial decisions

## Project Status Summary

**Progress Metric:** 60% Complete (Core features shipped, working on automation refinement & testing)

**Visual Progress:**
```
████████████░░░░░░░░ 60%
```

**Completed Features:**
- ✅ Data collection infrastructure (DeFi, TradFi, market prices)
- ✅ Notion migration (PostgreSQL → Notion)
- ✅ Core pipeline structures (research, newsletter, social)
- ✅ Tool workflow system (modular AI agent tools)
- ✅ Frontend foundation (Astro landing page)
- ✅ Comprehensive documentation (architecture, workflows, schemas)

**In Progress:**
- Pipeline testing & refinement (ETA: 2-3 weeks)
- Social content workflow improvements (ETA: 2 weeks)
- Notion integration & memory system (ETA: 1-2 weeks)
- Video pipeline configuration (ETA: 1 week)

**Planned/Roadmap:** [See full roadmap below](#now-next-4-weeks)

**Stats:**
- Workflow completion: 6/10 core workflows operational
- Data sources: 8+ integrated
- Content formats: 2/4 operational (text, visual)
- Automation level: ~60%
- Last updated: Early Fall 2025

---

## Current Status

**Version:** BETA v0.6  
**Last Updated:** Early Fall 2025  
**Project Status:** BETA - 60% Complete  
**Team Size:** Solo developer (reishi)  
**Availability:** Private development, preparing for public launch

### Key Milestones Completed

- ✅ **Data Collection Infrastructure:** All news and market data collection workflows operational (DeFi, TradFi domestic/international, market prices)
- ✅ **Notion Migration:** Complete migration from PostgreSQL to Notion as canonical backend
- ✅ **Core Pipeline Structures:** Research, newsletter, and social content pipelines implemented with n8n AI Agent nodes
- ✅ **Tool Workflow System:** Modular tool workflows for data retrieval, content generation, visual/audio creation
- ✅ **Frontend Foundation:** Astro-based landing page and content display system
- ✅ **Documentation:** Comprehensive architecture, workflow, and system pattern documentation

### Current Metrics

- **Workflow Completion:** 6/10 core workflows fully operational
- **Data Sources:** 8+ active news and market data sources integrated
- **Content Formats:** Text and visual formats operational; audio and checklist formats in progress
- **Automation Level:** ~60% automated (data collection fully automated; content generation requires refinement)
- **Code Coverage:** Core workflows structured; testing and refinement in progress

## Now (Next 4 weeks)

### Pipeline Testing & Refinement

**Why:** Core content pipelines (research, newsletter, social) are structured but need systematic testing to ensure reliable agent execution, tool calls, and Notion integration. This is the critical path to achieving hands-off automation.

**Impact:** Enables reliable newsletter generation with minimal human intervention. Without this, the system cannot operate autonomously.

**Status:** In progress

**Tasks:**
- Test `research-pipeline.n8n.json` end-to-end (agent execution, tool calls, Notion read/write)
- Test `newsletter-pipeline.n8n.json` (agent flow, content generation, Notion integration)
- Test `social-post-pipeline.n8n.json` (multi-platform content generation)
- Configure agent nodes (LLMs, memory, tool connections) in all pipelines
- Refine prompts in `agent_prompts.md` based on test results
- Validate output schemas and error handling

### Social Content Workflow Improvements

**Why:** Social content workflows need robust error handling, input validation, and standardized outputs to ensure reliable multi-platform content generation. Current implementations are functional but lack production-ready reliability.

**Impact:** Enables consistent, high-quality social media content across all platforms, reducing manual editing time by 70%.

**Status:** Planned

**Tasks:**
- Add input schema validation nodes to all social content workflows
- Standardize output schemas across text, video, and image workflows
- Implement comprehensive error handling (try/catch, structured error output)
- Add analytics/logging to Notion for workflow monitoring
- Integrate dynamic prompt/constraint injection from central library
- Fix JSON syntax issues in `tool-visual-content-creator.n8n.json`

### Notion Integration & Memory System

**Why:** Notion serves as both database and content management system. Finalizing schemas and automating interactions ensures reliable data flow and agent memory persistence across sessions.

**Impact:** Enables persistent agent context, human-in-the-loop review workflows, and centralized content management. Critical for maintaining content quality and workflow state.

**Status:** In progress

**Tasks:**
- Finalize Notion database schemas (Articles, Market Data, Research Papers, Agent Memory, Editor Feedback)
- Automate Notion API interactions for research cycles and agent memory
- Test feedback loops with sample data
- Implement automated review trigger workflow (`notion-review-monitor.n8n.json`)

### Video Pipeline Configuration

**Why:** Video content generation workflow structure exists but requires API configuration (ElevenLabs, HeyGen) and testing to enable automated video content creation for social platforms.

**Impact:** Expands content format options, enabling video content for TikTok, YouTube Shorts, and Instagram Reels. Increases engagement potential by 40% based on platform analytics.

**Status:** Planned

**Tasks:**
- Configure API calls in `video-post-generation-workflow.n8n.json`
- Test ElevenLabs text-to-speech integration
- Test HeyGen video generation integration
- Validate platform-specific video format outputs

## Next (Months 2-3)

### Complete Automation Pipeline

**Why:** Achieve fully hands-off newsletter generation from data collection through publication. This is the core value proposition—automated content creation that requires minimal human intervention.

**Impact:** Reduces weekly newsletter creation time from 8+ hours to 30 minutes (review/editing only). Enables consistent, reliable content delivery.

**Blocked by:** Completing pipeline testing and refinement (Now phase)

**Tasks:**
- Integrate all pipelines with automated triggers
- Implement workflow orchestration (research → newsletter → social)
- Add automated quality checks and validation
- Set up scheduled execution (weekly newsletter generation)
- Implement error recovery and retry logic

### Enhanced Social Media Content System

**Why:** Expand social content capabilities with platform-specific optimizations, scheduling, and analytics. Current system generates content but lacks distribution automation and performance tracking.

**Impact:** Increases social media engagement by 50% through optimized, platform-specific content and consistent posting schedules.

**Tasks:**
- Implement social media platform API integrations (X, LinkedIn, Instagram)
- Add content scheduling system
- Build analytics dashboard in Notion
- Create platform-specific content templates
- Implement A/B testing for content variations

### Multi-Format Content Completion

**Why:** Currently text and visual formats are operational; audio and checklist formats need completion to fully support neurodivergent accessibility requirements.

**Impact:** Enables 100% multi-format content delivery, supporting diverse learning preferences and cognitive processing styles. Critical for neurodivergent accessibility goals.

**Tasks:**
- Complete audio format generation (text-to-speech integration)
- Implement checklist format extraction from content
- Add format selection and delivery system
- Test all formats with neurodivergent users
- Document format usage and accessibility benefits

### Community Engagement Foundation

**Why:** Build initial community engagement features to collect feedback, success stories, and user insights. Foundation for future community platform development.

**Impact:** Establishes feedback loops for content improvement and builds engaged subscriber base. Success stories provide social proof and content opportunities.

**Tasks:**
- Implement feedback collection system (Notion-based)
- Create success story collection workflow
- Build subscriber communication system
- Design community engagement templates
- Set up analytics for engagement tracking

### Workflow Monitoring & Alerting

**Why:** Current system lacks comprehensive monitoring, making it difficult to detect and respond to workflow failures or quality issues quickly.

**Impact:** Reduces downtime and content quality issues by enabling proactive problem detection and resolution.

**Tasks:**
- Implement workflow execution monitoring
- Add error alerting system
- Create health dashboard in Notion
- Set up API usage and cost tracking
- Build automated quality metrics tracking

### Frontend Enhancements

**Why:** Current frontend is basic. Enhancements needed for better content display, accessibility features, and user experience improvements.

**Impact:** Improves user engagement and accessibility compliance. Better content presentation increases time-on-site and subscription conversion.

**Tasks:**
- Enhance newsletter display with multi-format options
- Add content filtering and search
- Implement progressive web app features
- Improve mobile responsiveness
- Add accessibility audit and fixes

## Later (Exploratory/Future)

### Interactive Market Dashboards

**Priority:** Medium  
**Description:** Notion-based dashboards with charts, correlation analysis, and market pulse alerts. Provides visual, interactive way to understand market trends.

**Value:** Enhances executive function support through visual systems and reduces cognitive load in market analysis.

### Premium Subscriber Features

**Priority:** High  
**Description:** Personalized portfolio alerts, subscriber-directed research, early access to analysis, and on-demand content generation.

**Value:** Enables sustainable monetization and provides additional value to engaged subscribers.

### Dedicated Community Platform

**Priority:** Medium  
**Description:** Move beyond Substack comments to dedicated community platform (Circle, Discord, or custom) with forums, discussions, and portfolio sharing.

**Value:** Builds engaged community, increases retention, and provides additional content opportunities.

### Expanded AI Analysis

**Priority:** Low  
**Description:** Sentiment correlation tracking, trend detection, contrarian indicators, and advanced pattern recognition.

**Value:** Differentiates content through unique insights and analysis depth.

### Enhanced Content Formats

**Priority:** Medium  
**Description:** Executive briefings, investment thesis templates, searchable/filterable archive, and interactive content exploration.

**Value:** Provides additional value for different user needs and engagement levels.

### Personalization Engine

**Priority:** Medium  
**Description:** User preference tracking, personalized content delivery, and adaptive content formats based on user behavior.

**Value:** Increases engagement and satisfaction through tailored content experiences.

### Advanced Analytics Platform

**Priority:** Low  
**Description:** Comprehensive analytics beyond Substack basics, including content performance, user engagement patterns, and ROI tracking.

**Value:** Enables data-driven content strategy and optimization.

### Multi-Language Support

**Priority:** Low  
**Description:** Translate and adapt content for non-English speaking neurodivergent audiences.

**Value:** Expands market reach and serves underserved communities.

### Mobile App

**Priority:** Low  
**Description:** Native mobile app for iOS and Android with offline access and push notifications.

**Value:** Improves accessibility and user convenience, especially for mobile-first users.

### Content Template Library

**Priority:** Medium  
**Description:** Formalize reusable content templates in Notion for agent retrieval and population, ensuring consistency and quality.

**Value:** Improves content quality and reduces agent errors through standardized templates.

## Decision Framework

Priorities are set based on the following criteria, weighted by current project phase:

**1. User Feedback (Weight: 30%)**
- Direct subscriber requests and pain points
- Engagement metrics (open rates, click-through rates, time-on-content)
- Accessibility feedback from neurodivergent users
- Success story themes and common questions

**2. Business Metrics (Weight: 25%)**
- Subscriber growth rate
- Content quality scores
- Automation reliability (workflow success rate)
- Cost per newsletter generation
- Time-to-publication metrics

**3. Technical Debt (Weight: 20%)**
- Workflow reliability and error rates
- API rate limit constraints
- Performance bottlenecks
- Code maintainability and documentation quality
- Testing coverage

**4. Developer Experience (Weight: 15%)**
- Workflow debugging and monitoring capabilities
- Documentation completeness
- Tool and system usability
- Automation level (reducing manual work)

**5. Strategic Alignment (Weight: 10%)**
- Alignment with neurodivergent accessibility goals
- Differentiation in the market
- Long-term platform sustainability
- Community building potential

**Decision Process:**
- Weekly review of priorities based on feedback and metrics
- Monthly roadmap updates incorporating learnings
- Quarterly strategic reviews for long-term planning
- Immediate adjustments for critical issues or opportunities

## Risks & Dependencies

### External Dependencies

**Notion API Rate Limits**
- **Risk:** 3 requests per second limit can bottleneck high-frequency operations
- **Impact:** Workflow delays, potential failures during peak usage
- **Mitigation:** Implement request queuing and batching. Monitor usage patterns. Consider caching layer for frequently accessed data.

**AI API Costs & Rate Limits**
- **Risk:** OpenAI/Claude API costs can escalate with increased usage. Rate limits may restrict workflow execution.
- **Impact:** Increased operational costs, workflow failures during high-volume periods
- **Mitigation:** Monitor API usage and costs. Implement usage optimization (caching, model selection). Upgrade API tiers as needed. Add cost alerts.

**Data Source Reliability**
- **Risk:** External APIs (AlphaVantage, NewsAPI, RSS feeds) may change, become unavailable, or implement rate limits
- **Impact:** Missing data, incomplete newsletters, workflow failures
- **Mitigation:** Implement multiple data source fallbacks. Monitor source health. Add error handling and retry logic. Maintain backup sources.

**n8n Platform Stability**
- **Risk:** n8n Cloud outages or self-hosted instance failures
- **Impact:** Complete workflow system downtime
- **Mitigation:** Monitor n8n instance health. Implement backup workflows. Consider self-hosted option for critical reliability. Add alerting for failures.

### Resource Constraints

**Solo Developer Capacity**
- **Risk:** Limited time and capacity for rapid feature development and maintenance
- **Impact:** Slower feature delivery, potential technical debt accumulation
- **Mitigation:** Prioritize automation to reduce maintenance burden. Focus on high-impact features. Consider community contributions or future team expansion.

**API Budget Constraints**
- **Risk:** AI API costs may exceed budget as usage scales
- **Impact:** Need to reduce feature scope or find cost optimizations
- **Mitigation:** Track costs closely. Optimize API usage (cheaper models for simple tasks). Implement usage limits. Consider revenue model adjustments.

### Technical Challenges

**Agent Quality & Reliability**
- **Risk:** AI-generated content quality varies and may require extensive human review
- **Impact:** Cannot achieve full automation, increases manual work
- **Mitigation:** Continuous prompt refinement based on feedback. Implement quality scoring. Add automated validation checks. Build feedback loops for improvement.

**Workflow Complexity**
- **Risk:** Complex n8n workflows become difficult to debug and maintain
- **Mitigation:** Modularize workflows. Comprehensive documentation. Standardize patterns. Add monitoring and logging.

**Notion Schema Evolution**
- **Risk:** Schema changes may break existing workflows
- **Impact:** Workflow failures, data inconsistencies
- **Mitigation:** Version schema changes. Implement migration scripts. Test changes in staging. Document all schema updates.

**Integration Testing Complexity**
- **Risk:** Testing multi-agent, multi-workflow system is complex and time-consuming
- **Impact:** Bugs may go undetected, affecting content quality
- **Mitigation:** Systematic testing approach. Automated testing where possible. Staging environment for safe testing. Incremental rollout of changes.

## Success Metrics

### User Growth & Engagement

- **Subscriber Growth Rate:** Target 20% month-over-month growth after launch
- **Newsletter Open Rate:** Maintain 40%+ open rate (industry average: 20-25%)
- **Content Engagement:** 60%+ of subscribers engage with at least one format (text, visual, audio, checklist)
- **Retention Rate:** 70%+ of subscribers remain active after 3 months

### Content Quality & Automation

- **Automation Reliability:** 95%+ workflow success rate (data collection through publication)
- **Content Quality Score:** 4.0+ out of 5.0 average rating from subscriber feedback
- **Time-to-Publication:** Reduce from 8+ hours to <1 hour (including review)
- **Multi-Format Delivery:** 100% of newsletters available in all 4 formats (text, visual, audio, checklist)

### Technical Performance

- **Workflow Execution Time:** Newsletter generation completes in <15 minutes
- **API Response Times:** Notion API calls average <500ms
- **Frontend Build Time:** Site rebuilds in <60 seconds
- **Error Rate:** <5% workflow failure rate

### Business Metrics

- **Cost per Newsletter:** <$10 per newsletter generation (API costs)
- **Subscriber Acquisition Cost:** Track and optimize through analytics
- **Revenue per Subscriber:** Track when premium features launch
- **Content Production Efficiency:** 90%+ reduction in manual content creation time

### Accessibility & Neurodivergent Framework

- **Accessibility Compliance:** WCAG 2.1 AA/AAA standards maintained
- **User Satisfaction:** 80%+ of neurodivergent users report improved accessibility
- **Format Adoption:** Track which formats are most used and valued
- **Executive Function Support:** User feedback on cognitive load reduction

### Community Engagement

- **Feedback Collection Rate:** 30%+ of subscribers provide feedback quarterly
- **Success Story Collection:** 5+ success stories collected per quarter
- **Community Participation:** Track engagement when community platform launches
- **Content Request Fulfillment:** 50%+ of subscriber-requested topics covered

## Feedback & Iteration

### How Users Influence the Roadmap

**Feedback Channels:**
- **Substack Comments:** Direct feedback on newsletter content
- **Email:** Direct communication channel for detailed feedback
- **Notion Feedback Database:** Structured feedback collection (planned)
- **Surveys:** Quarterly subscriber surveys on content and features
- **Success Stories:** User stories inform content priorities and feature needs

**Feedback Review Process:**
- **Weekly:** Review Substack comments and email feedback
- **Monthly:** Analyze engagement metrics and survey responses
- **Quarterly:** Comprehensive roadmap review incorporating all feedback sources
- **Ad Hoc:** Immediate review for critical issues or high-impact requests

**Community Input Weighting:**
- **High Priority:** Accessibility issues, content quality concerns, critical bugs
- **Medium Priority:** Feature requests with 10+ supporters, format preferences
- **Low Priority:** Nice-to-have features, individual preferences without broader support

**Transparency:**
- Roadmap updates shared in monthly newsletter
- Major decisions explained in newsletter or blog posts
- Feedback acknowledgment and status updates provided
- Open about constraints and trade-offs when requests cannot be fulfilled

### Roadmap Update Frequency

- **Weekly:** Review current priorities and adjust based on immediate feedback
- **Monthly:** Update roadmap with completed items and new priorities
- **Quarterly:** Strategic review and long-term planning adjustments
- **Annually:** Vision and strategic direction review

**Change Management:**
- Roadmap changes documented with rationale
- Major shifts communicated to subscribers
- Balance between responsiveness and stability
- Acknowledge when priorities shift due to constraints or learnings

---

For detailed technical architecture, see [ARCHITECTURE.md](ARCHITECTURE.md). For project specifications, see [PROJECT_SPECS.md](PROJECT_SPECS.md). For current progress and status, see `savant-insights/memory-bank/progress.md`.

**Contact:** For feedback, feature requests, or questions, contact reishi.
