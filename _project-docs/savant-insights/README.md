# Savant Insights: Neurodivergent Finance Newsletter

A specialized finance newsletter platform that delivers accessible, actionable financial content designed specifically for neurodivergent audiences using automated data pipelines and AI-powered content generation.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage / Getting Started](#usage--getting-started)
- [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [FAQ](#faq)

## Overview

Savant Insights exists to solve a critical problem: traditional financial content is overwhelming and inaccessible for neurodivergent individuals. The platform delivers practical finance and investing content specifically designed for neurodivergent audiences, featuring multi-format content delivery, advanced accessibility standards, and executive function support.

**Who is this for?**
- Neurodivergent individuals seeking accessible financial information
- Investors who need clear, actionable insights without cognitive overload
- Content creators looking for automated newsletter generation workflows

**What problem does it solve?**
- Market information overload that creates decision paralysis
- Financial content that doesn't account for diverse cognitive needs
- Lack of multi-format content delivery (text, visual, audio, checklists)
- Manual content creation processes that don't scale

The project started as an automated finance information source and evolved into a hands-off newsletter system. Currently in BETA at approximately 60% completion, with core features operational while automation workflows continue to be refined.

## Key Features

- **Automated Data Pipeline**: n8n workflows collect and standardize financial news and market data from multiple sources, storing everything in Notion as the canonical backend
- **AI Multi-Agent Content System**: Centralized system using n8n AI Agent nodes for research, summarization, and multi-format content generation (text, visual, audio, checklists)
- **Neurodivergent-First Design**: Adheres to WCAG 2.1 AA/AAA standards with chunked content, visual systems, and predictable navigation to reduce cognitive load
- **Multi-Format Content Delivery**: Financial news, guides, and analysis delivered in text, visual, audio, and checklist formats to accommodate diverse learning preferences
- **Executive Function Support**: Templates, automations, and visual systems designed to reduce cognitive load and support decision-making
- **Platform-Optimized Social Content**: Modular, multi-agent system for generating and adapting content for X, LinkedIn, Instagram, YouTube, TikTok, and other platforms
- **Notion-Based Workflow Management**: All data, workflows, and content templates stored in Notion for easy access, editing, and collaboration

## Tech Stack

- **Automation/Orchestration**: n8n (workflow automation with AI Agent nodes)
- **Database/Backend**: Notion (canonical data storage and workflow management)
- **AI Services**: OpenAI APIs, Claude API, OpenRouter (accessed via n8n tool workflows)
- **Frontend**: Astro (static site generation for landing pages and content delivery)
- **Languages**: JavaScript (within n8n workflows and frontend), TypeScript (for type safety)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Content Formats**: Markdown (for newsletters and documentation), JSON (for workflow configurations)
- **Design Tools**: Canva, Figma (for visual templates and assets)

## Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **n8n**: Self-hosted instance or n8n Cloud account
- **Notion Account**: With API access enabled
- **API Keys**: OpenAI API key, Claude API key (optional), OpenRouter API key (optional)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-newsletter
   ```

2. **Install frontend dependencies**
   ```bash
   cd savant-insights
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `savant-insights` directory:
   ```bash
   # Notion API
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_database_id
   
   # OpenAI (for AI content generation)
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional: Claude API
   ANTHROPIC_API_KEY=your_claude_api_key
   
   # Optional: OpenRouter
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Set up n8n workflows**
   
   - Import workflow JSON files from `n8n workflows/` directory into your n8n instance
   - Configure n8n credentials for:
     - Notion API
     - OpenAI API
     - Any other required services
   - Set up workflow triggers (scheduled, webhook, or manual)

5. **Configure Notion databases**
   
   - Import Notion templates from `notion-templates/` directory
   - Set up required databases according to the schema in `memory-bank/notion-templates/notion-schema.md`
   - Grant n8n access to your Notion workspace

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:4321`

## Usage / Getting Started

### Basic Example: Generating a Newsletter

The system uses n8n workflows to automate newsletter generation. Here's how it works:

1. **Trigger the workflow** (scheduled or manual)
   - n8n workflow collects financial news from configured sources
   - Data is standardized and stored in Notion

2. **AI agents process the data**
   - Research agent summarizes key financial events
   - Content generation agent creates newsletter content
   - Formatting agent adapts content for different formats

3. **Content is stored in Notion**
   - Newsletter content appears in your Notion database
   - Ready for review, editing, or direct publishing

4. **View generated content**
   ```bash
   # Start the dev server
   npm run dev
   
   # Navigate to the newsletter page
   # Content is pulled from Notion and displayed
   ```

### Example Workflow Output

When a newsletter is generated, you'll see:
- **Text format**: Full newsletter article in markdown
- **Visual format**: Key points formatted as infographics
- **Audio script**: Text formatted for audio narration
- **Checklist format**: Action items extracted from content

All formats are stored in Notion and can be accessed via the frontend or directly in Notion.

### Running the Frontend Locally

```bash
cd savant-insights
npm run dev
```

Visit `http://localhost:4321` to see the landing page and newsletter content.

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## Architecture Overview

Savant Insights uses a workflow-driven architecture centered around n8n for automation and Notion as the canonical data store. The system collects financial data from multiple sources, processes it through AI agents, and generates multi-format content that's stored in Notion and displayed via an Astro frontend.

The architecture follows a data pipeline model: external data sources feed into n8n workflows, which standardize and enrich data before storing it in Notion. AI agents then process this data to generate newsletters and social media content. The Astro frontend reads from Notion to display content to end users.

```
┌─────────────────┐
│  Data Sources   │  Financial news APIs, market data feeds
│  (External)     │
└────────┬────────┘
         │
┌────────▼────────────────────────┐
│      n8n Workflows               │
│  ┌──────────────────────────┐   │
│  │  Data Collection          │   │  Collects & standardizes data
│  └──────────┬────────────────┘   │
│             │                      │
│  ┌──────────▼────────────────┐   │
│  │  AI Agent System           │   │  Research, summarization,
│  │  - Research Agent          │   │  content generation
│  │  - Content Agent          │   │
│  │  - Formatting Agent       │   │
│  └──────────┬────────────────┘   │
└────────────┼──────────────────────┘
             │
┌────────────▼────────────┐
│    Notion (Backend)     │  Canonical data store
│  - News Database        │  All workflows read/write here
│  - Newsletter Database  │
│  - Content Templates    │
│  - Social Media Queue   │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│   Astro Frontend        │  Static site generation
│  - Landing Page         │  Reads from Notion API
│  - Newsletter Display   │  Displays content to users
│  - Content Pages        │
└─────────────────────────┘
```

**Data Flow:**
1. External APIs provide financial news and market data
2. n8n workflows collect, validate, and standardize data
3. Standardized data is stored in Notion databases
4. AI agents read from Notion, process data, and generate content
5. Generated content is written back to Notion
6. Astro frontend reads from Notion API and displays content
7. Social media content is generated and queued for publishing

**Key Components:**
- **n8n Workflows**: Handle all automation, data collection, and AI agent orchestration
- **Notion**: Serves as both database and content management system
- **AI Agents**: Modular tools within n8n that handle research, content generation, and formatting
- **Astro Frontend**: Lightweight static site that displays content from Notion

## Contributing

This project is currently in active development. If you're interested in contributing:

1. Review the project structure and documentation in the `memory-bank/` directory
2. Check `ROADMAP.md` for planned features and current priorities
3. Review `ARCHITECTURE.md` for system design decisions
4. For workflow contributions, see `docs/building-workflows-n8n.md`

**Areas where contributions are welcome:**
- Improving n8n workflow reliability and error handling
- Enhancing accessibility features
- Adding new content format generators
- Improving AI prompt engineering for better content quality
- Frontend UI/UX improvements

Please contact reishi for contribution guidelines and access.

## Roadmap

**Project Status:** 60% Complete (Core features shipped, working on automation refinement & testing)

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
- ✅ Comprehensive documentation

**In Progress:**
- Pipeline testing & refinement (ETA: 2-3 weeks)
- Social content workflow improvements (ETA: 2 weeks)
- Notion integration & memory system (ETA: 1-2 weeks)
- Video pipeline configuration (ETA: 1 week)

**Stats:**
- Workflow completion: 6/10 core workflows operational
- Data sources: 8+ integrated
- Content formats: 2/4 operational (text, visual)
- Automation level: ~60%
- Last updated: Early Fall 2025

**Planned/Roadmap:** [See full roadmap](ROADMAP.md) for detailed Now/Next/Later priorities.

**Now (Active Development):**
- Refining n8n automation workflows for reliability
- Improving AI content generation quality
- Enhancing Notion schema and data organization

**Next (Planned):**
- Complete automation pipeline for hands-off newsletter generation
- Enhanced social media content system
- Community engagement features

**Later (Future):**
- Interactive market dashboards
- Premium subscriber features
- Dedicated community platform

## License

[License type to be determined - contact reishi for details]

## FAQ

**Q: Why Notion instead of a traditional database?**
A: Notion serves as both a database and content management system, allowing for easy content review, editing, and collaboration without needing separate admin interfaces. It also provides a familiar interface for non-technical team members.

**Q: How reliable is the automated content generation?**
A: The automation system is currently in BETA. While core workflows are functional, some manual review and refinement is still recommended. The system is designed to improve over time as prompts and workflows are refined.

**Q: What makes this newsletter "neurodivergent-friendly"?**
A: The content follows neurodivergent accessibility principles: chunked information, clear action steps, multiple format options (text, visual, audio, checklist), predictable structure, and reduced cognitive load through visual systems and templates.

**Q: Can I use this for my own newsletter?**
A: The project is currently in active development. Contact reishi for information about usage, licensing, or collaboration opportunities.

**Q: What APIs do I need access to?**
A: At minimum, you'll need Notion API access and OpenAI API access. Optional services include Claude API and OpenRouter for additional AI model options.

**Q: How do I set up n8n workflows?**
A: Import the JSON workflow files from the `n8n workflows/` directory into your n8n instance, configure credentials, and set up the required Notion databases according to the schema documentation.

**Q: Is there a mobile app?**
A: Not currently. The frontend is web-based and mobile-responsive. A mobile app may be considered in the future based on user needs.

**Q: How often are newsletters generated?**
A: Newsletter generation frequency is configurable in n8n workflows. You can set up scheduled triggers for daily, weekly, or custom intervals based on your needs.

---

For detailed project context, see the `memory-bank/` directory. For technical architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md). For feature planning, see [ROADMAP.md](ROADMAP.md).
