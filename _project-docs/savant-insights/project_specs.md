# Savant Insights Specifications

## Project Vision

A specialized finance newsletter platform that delivers accessible, actionable financial content designed specifically for neurodivergent audiences. The platform solves the critical problem of information overload and cognitive barriers that prevent neurodivergent investors from effectively engaging with financial markets through automated data pipelines and AI-powered multi-format content generation.

**Who uses it?**
- Neurodivergent individuals seeking accessible financial information
- Investors who need clear, actionable insights without cognitive overload
- Content creators looking for automated newsletter generation workflows

## Current Status

- **Version:** BETA v0.6
- **Completion:** 60% complete
- **Last Updated:** Early Fall 2025
- **Availability:** Private development, preparing for public launch

## Technology Stack

- **Backend:** Notion (canonical data storage and workflow management via API)
- **Frontend:** Astro (static site generation for landing pages and content delivery)
- **Automation/Orchestration:** n8n (workflow automation with AI Agent nodes)
- **Database:** Notion (replaced PostgreSQL/TimescaleDB - serves as both database and CMS)
- **External APIs:** 
  - OpenAI APIs (GPT-4 for content generation)
  - Claude API (Anthropic - optional)
  - OpenRouter (optional AI model routing)
  - AlphaVantage (financial news and market data)
  - NewsAPI.org (international news)
  - ElevenLabs (text-to-speech - optional)
  - HeyGen (video generation - optional)
- **Hosting:** 
  - Frontend: Vercel or similar static site host
  - n8n: n8n Cloud or self-hosted instance
  - Notion: SaaS platform
- **Languages:** JavaScript (within n8n workflows and frontend), TypeScript (for type safety)
- **Styling:** Tailwind CSS (utility-first CSS framework)
- **AI Tools Used:** Cursor (Claude 3.5 for scaffolding), n8n AI Agent nodes

## Key Features (Completed)

- ✅ **Data Collection Infrastructure** — All news and market data collection workflows operational (DeFi, TradFi domestic/international, market prices for crypto, ETFs, commodities)
- ✅ **Notion Migration** — Complete migration from PostgreSQL to Notion as canonical backend
- ✅ **Core Pipeline Structures** — Research, newsletter, and social content pipelines implemented with n8n AI Agent nodes
- ✅ **Tool Workflow System** — Modular tool workflows for data retrieval, content generation, visual/audio creation
- ✅ **Frontend Foundation** — Astro-based landing page and content display system
- ✅ **Comprehensive Documentation** — Architecture, workflow, system patterns, and schema documentation

## Features In Progress

- 🔄 **Pipeline Testing & Refinement** (ETA: 2-3 weeks) — Systematic testing of research, newsletter, and social content pipelines for reliable agent execution and Notion integration
- 🔄 **Social Content Workflow Improvements** (ETA: 2 weeks) — Adding robust error handling, input validation, and standardized outputs for production-ready reliability
- 🔄 **Notion Integration & Memory System** (ETA: 1-2 weeks) — Finalizing schemas and automating interactions for agent memory persistence and feedback loops
- 🔄 **Video Pipeline Configuration** (ETA: 1 week) — Configuring ElevenLabs and HeyGen API integrations for automated video content creation

## Planned Features

- **Complete Automation Pipeline** — Fully hands-off newsletter generation from data collection through publication (blocked by pipeline testing completion)
- **Enhanced Social Media Content System** — Platform-specific optimizations, scheduling, and analytics for X, LinkedIn, Instagram, TikTok
- **Multi-Format Content Completion** — Complete audio and checklist format generation to achieve 100% multi-format delivery
- **Community Engagement Foundation** — Feedback collection, success story workflows, and subscriber communication systems
- **Workflow Monitoring & Alerting** — Comprehensive monitoring, error alerting, and health dashboards
- **Frontend Enhancements** — Multi-format display options, content filtering, progressive web app features
- **Interactive Market Dashboards** — Notion-based dashboards with charts, correlation analysis, and market pulse alerts
- **Premium Subscriber Features** — Personalized portfolio alerts, subscriber-directed research, early access, on-demand content generation
- **Dedicated Community Platform** — Move beyond Substack to Circle, Discord, or custom platform with forums and discussions

## Key Decisions

- **Why Notion instead of PostgreSQL?** Notion serves dual purposes: it's both a database (via API) and a content management system (via UI). This eliminates the need for separate admin interfaces and allows non-technical team members to review and edit content directly. The relational model supports complex content relationships, and built-in search/filtering provides powerful data access without custom tooling. Trade-off: API rate limits (3 req/sec) and less performant than SQL for complex queries.

- **Why n8n for orchestration?** n8n provides a visual workflow builder that makes complex automation accessible without extensive coding. Native AI Agent nodes integrate seamlessly with LLM APIs, eliminating the need for custom agent frameworks. Self-hosted option provides control over data and API usage. Trade-off: Workflows can become complex and harder to debug at scale.

- **Why Astro for frontend?** Astro excels at content-heavy sites with minimal interactivity, matching the newsletter's primary use case. The "islands architecture" loads minimal JavaScript, improving performance and accessibility. Build-time data fetching integrates well with Notion API, generating static pages that load quickly. Trade-off: Less ecosystem support than Next.js, dynamic features require more work.

- **Why multi-agent AI system?** Specialized agents (Research, Content, Formatting) produce higher-quality outputs by focusing on specific tasks. Modular design allows independent improvement of each agent. Tool workflows abstract technical complexity from agents, enabling natural language tool calls. Trade-off: Requires more orchestration and can have higher latency (sequential agent calls).

- **Why private for now?** Building BETA version and refining automation workflows before public launch. Need to achieve reliable hands-off newsletter generation and validate content quality with neurodivergent users before scaling.

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

## Known Limitations

- **Automation Reliability:** n8n workflows can fail silently or with unclear error messages. Agent interactions are complex and hard to debug. Current mitigation: Implementing comprehensive error handling, structured logging to Notion, and workflow health monitoring.

- **Notion API Rate Limits:** 3 requests per second limit can bottleneck high-frequency operations. Current mitigation: Implementing request queuing and batching. Consider caching layer for frequently accessed data.

- **Agent Quality Variability:** AI-generated content quality varies and requires human review. Current mitigation: Continuous prompt refinement based on feedback, quality scoring system, automated validation checks.

- **Content Format Completion:** Audio and checklist formats are partially implemented. Text and visual formats are operational. Planned completion in next phase.

- **Workflow Complexity:** Complex n8n workflows become difficult to debug and maintain. Current mitigation: Modularizing workflows, comprehensive documentation, standardized patterns, monitoring and logging.

- **No Mobile App:** Frontend is web-based and mobile-responsive. Mobile app may be considered in the future based on user needs.

- **Limited Real-time Features:** Frontend uses static site generation. Real-time updates require full rebuild. Consider incremental static regeneration or on-demand ISR for future.

- **API Cost Constraints:** AI API costs can escalate with increased usage. Current mitigation: Monitor usage and costs, optimize API usage (cheaper models for simple tasks), implement usage limits.

- **Solo Developer Capacity:** Limited time and capacity for rapid feature development. Current mitigation: Prioritize automation to reduce maintenance burden, focus on high-impact features.

## Important URLs/Credentials

- **GitHub repo:** [Private - contact reishi for access]
- **Staging site:** [To be configured]
- **Production site:** [To be configured]
- **n8n Instance:** [Self-hosted or n8n Cloud - private]
- **Notion Workspace:** [Private workspace]
- **API Documentation:** See [ARCHITECTURE.md](ARCHITECTURE.md) and [SCHEMA.md](SCHEMA.md)
- **Admin dashboard:** Notion serves as admin interface (no separate dashboard needed)

---

For detailed technical architecture, see [ARCHITECTURE.md](ARCHITECTURE.md). For feature roadmap, see [ROADMAP.md](ROADMAP.md). For database schema, see [SCHEMA.md](SCHEMA.md).
