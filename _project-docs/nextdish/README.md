# NextDish

**An AI-powered culinary platform connecting recipe creators with home cooks, featuring intelligent recipe discovery, meal planning assistance, and tools to reduce food waste.**

---

## Table of Contents

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

---

## Overview

NextDish solves two core problems in the culinary world:

**For Home Cooks:** Finding diverse, high-quality recipes without overwhelming research and ad-filled experiences. Uncertainty in substituting ingredients or adapting recipes. Significant food waste. The need for a centralized, reliable source for recipes and culinary inspiration.

**For Recipe Creators:** Difficulty reaching a dedicated and engaged audience. Lack of specialized tools to manage, showcase, and monetize their culinary content effectively.

NextDish is a two-sided platform that brings together recipe creators and home cooks through AI-powered discovery, social interaction, and intelligent tools that make cooking more accessible and enjoyable.

**Current Status:** Beta (75% complete) — Landing page deployed, core features in active development.

---

## Project Status

**Status:** 75% Complete (Core features shipped, working on production hardening & UX improvements)

**Progress:** `███████████████████░░░` 75%

### Completed Features
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

### In Progress
- 🔄 Production hardening & monitoring (ETA: 2-3 weeks)
- 🔄 PostHog analytics & A/B testing fix (ETA: 1-2 weeks)
- 🔄 AI feature enhancement - YOLOv8n integration (ETA: 4-5 weeks)
- 🔄 User account bug fixes (ETA: 1-2 weeks)
- 🔄 CSS & UI consistency improvements (ETA: ongoing)

### Planned
- 📋 See [full roadmap](ROADMAP.md) for detailed feature plans

**Last Updated:** January 2026

---

## Key Features

- **AI-Powered Recipe Generation** — Client-side text-to-recipe conversion using Llama 3.2 1B Instruct model (ONNX format) for instant recipe creation from descriptions
- **Intelligent Ingredient Detection** — Image analysis using YOLOv8n (TensorFlow.js) to identify ingredients from photos
- **Recipe Discovery & Search** — Advanced filtering by cuisine, dietary preferences, ingredients, and cooking time
- **Social Features** — Like, comment, save, and share recipes with the community
- **User Profiles & Digital Cookbooks** — Personalized collections and recipe management
- **Waitlist System** — Early access registration for both creators and consumers
- **Progressive Web App (PWA)** — Offline support with service worker caching for AI models and core assets

---

## Tech Stack

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
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (beta)

### AI/ML (Client-Side)
- **Text Generation:** `@huggingface/transformers` (v3.5.1) with ONNX Runtime Web
  - Model: `onnx-community/Llama-3.2-1B-Instruct` (ONNX `model_int8.onnx`)
- **Image Detection:** `@tensorflow/tfjs` (v4.22.0)
  - Model: YOLOv8n (TensorFlow.js format)
  - Backends: WebGL, WASM, CPU

### Deployment & Infrastructure
- **Hosting:** Cloudflare Pages
- **Backend Services:** Supabase (PostgreSQL, Auth, Storage)
- **CI/CD:** GitHub Actions
- **Package Manager:** npm

### Development Tools
- **Testing:** Jest, Cypress
- **Linting:** ESLint, Prettier
- **Documentation:** Storybook

---

## Installation

### Prerequisites

- **Node.js:** v20.0.0 or higher (v21+ not supported)
- **npm:** v9.0.0 or higher
- **Git:** For cloning the repository
- **Supabase Account:** For database and authentication services
- **Cloudflare Account:** For deployment (optional, for local development)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Cookbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the project root with the following variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Cloudflare (for production)
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_API_TOKEN=your_api_token
   ```

   **Note:** For local development, you can use `process.env` directly. For Cloudflare Pages deployment, configure these in the Cloudflare dashboard and access them via `getRequestContext()`.

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Building for Production

For Cloudflare Pages deployment:

```bash
# Build for Cloudflare Pages
npm run pages:build

# Preview locally
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

---

## Usage / Getting Started

### Basic Example: Creating a Recipe with AI

Once you have the application running, you can use the AI chat feature to generate recipes:

1. **Navigate to the AI Chat interface** (typically at `/ai-chat` or accessible from the main navigation)

2. **Enter a recipe description:**
   ```
   "I want to make a simple pasta dish with tomatoes and basil"
   ```

3. **The AI will generate a structured recipe** including:
   - Recipe title and cuisine type
   - Cooking time and difficulty
   - Ingredients list
   - Step-by-step instructions
   - Optional image prompt for recipe visualization

4. **Save or share the recipe** using the platform's social features

### Example: Using the Waitlist

1. **Visit the landing page** (root route `/`)

2. **Fill out the waitlist form** with your email and role (Creator or Consumer)

3. **Submit** — Your information is stored in Supabase and you'll receive confirmation

### Expected Output

When using the AI recipe generation, you'll receive a structured response like:

```json
{
  "summary": "A simple Italian pasta dish",
  "recipes": [
    {
      "title": "Fresh Tomato Basil Pasta",
      "cuisine": "Italian",
      "time": "20 minutes",
      "description": "Quick and fresh pasta with ripe tomatoes and basil",
      "ingredients": [
        "200g pasta",
        "4 ripe tomatoes",
        "Fresh basil leaves",
        "2 cloves garlic",
        "Olive oil"
      ],
      "instructions": [
        "Boil pasta according to package instructions",
        "Heat olive oil in a pan",
        "Add garlic and cook until fragrant",
        "Add chopped tomatoes and cook for 5 minutes",
        "Toss with pasta and fresh basil"
      ]
    }
  ]
}
```

---

## Architecture Overview

NextDish follows a modern serverless architecture optimized for edge computing and client-side AI processing.

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  AI Models   │  │ Service      │      │
│  │  (Next.js)   │  │  (Client)    │  │ Worker       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          │ HTTPS           │ Local Cache     │ PWA Cache
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼──────────────┐
│              Cloudflare Pages (Edge Runtime)                │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js API Routes (Edge Functions)        │    │
│  │  - Authentication (NextAuth.js)                    │    │
│  │  - Recipe CRUD operations                          │    │
│  │  - User management                                 │    │
│  └────────────────────┬───────────────────────────────┘    │
└───────────────────────┼────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
┌───────────────────────▼────────────────────────────────────┐
│                    Supabase                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Auth        │  │   Storage    │  │
│  │  Database    │  │   Service     │  │   (Images)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

**Recipe Creation Flow:**
1. User interacts with React UI in the browser
2. AI model (Llama 3.2) processes text input client-side
3. Generated recipe data is sent to Next.js API route (Cloudflare Worker)
4. API route validates and stores data in Supabase PostgreSQL
5. Response is returned to the client
6. UI updates with the new recipe

**Image Analysis Flow:**
1. User uploads an image through the React UI
2. YOLOv8n model (TensorFlow.js) analyzes the image client-side
3. Detected ingredients are extracted and displayed
4. User can use these ingredients to search or generate recipes

**Authentication Flow:**
1. User initiates login/signup through NextAuth.js
2. NextAuth.js communicates with Supabase Auth service
3. Session is established and stored
4. Protected routes are accessible based on session

### Key Architectural Decisions

- **Edge Runtime:** All API routes use Cloudflare Workers edge runtime for low latency and global distribution
- **Client-Side AI:** AI models run in the browser to reduce server costs and improve privacy
- **Service Worker Caching:** Critical AI model files are cached for offline use and faster subsequent loads
- **Supabase Integration:** Unified backend for database, authentication, and file storage
- **Prisma ORM:** Type-safe database access with migration support

---

## API Documentation

NextDish uses Next.js API routes (App Router) with edge runtime. All routes are located in `src/app/api/`.

### Authentication Endpoints

- `POST /api/auth/signin` — User sign-in
- `POST /api/auth/signout` — User sign-out
- `GET /api/auth/session` — Get current session

### Recipe Endpoints

- `GET /api/recipes` — List/search recipes with filters
- `GET /api/recipes/[id]` — Get a specific recipe
- `POST /api/recipes` — Create a new recipe (authenticated)
- `PATCH /api/recipes/[id]` — Update a recipe (authenticated, owner only)
- `DELETE /api/recipes/[id]` — Delete a recipe (authenticated, owner only)

### User Endpoints

- `GET /api/users/[id]` — Get user profile
- `PATCH /api/users/[id]` — Update user profile (authenticated)

### Waitlist Endpoint

- `POST /api/waitlist` — Add email to waitlist

**Note:** For detailed API documentation with request/response examples, see [ARCHITECTURE.md](ARCHITECTURE.md) or check the API route files in `src/app/api/`.

---

## Contributing

NextDish is currently in active development. While we're not accepting external contributions at this time, we welcome feedback and suggestions.

### How to Provide Feedback

- **GitHub Issues:** Open an issue to report bugs or suggest features
- **Email:** Contact the maintainer directly
- **Waitlist:** Join the waitlist to be notified of public beta access

### Development Guidelines (For Maintainers)

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features (Jest for unit tests, Cypress for E2E)
- Ensure edge runtime compatibility for all API routes
- Document significant architectural decisions

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the complete roadmap. Here's a high-level overview:

### Now (Next 2-4 weeks)
- User account bug fixes
- Create recipe post functionality
- User preferences system
- Social feature integration
- AI "Add to Post" feature
- Recommendation engine
- Comprehensive AI Chat overhaul
- CSS consistency fixes

### Next (Months 2-3)
- Enhanced meal planning features
- Advanced recipe analytics for creators
- Mobile app development (React Native)
- Premium features and monetization

### Later (Exploratory)
- API access for third-party integrations
- Marketplace for recipe creators
- Advanced AI features (server-side processing)
- Community challenges and events

---

## License

[Specify your license here — e.g., MIT, Apache 2.0, or Proprietary]

---

## FAQ

### What is NextDish?

NextDish is an AI-powered culinary platform that connects recipe creators with home cooks. It features intelligent recipe discovery, AI-powered recipe generation, and social features for sharing and collaborating on recipes.

### How does the AI recipe generation work?

NextDish uses a client-side AI model (Llama 3.2 1B Instruct) that runs directly in your browser. You describe what you want to cook, and the AI generates a complete recipe with ingredients, instructions, and cooking time. This happens entirely on your device for privacy and speed.

### Do I need to create an account?

For basic recipe browsing and AI generation, an account is not required. However, to save recipes, create your own recipes, and use social features (likes, comments, sharing), you'll need to sign up.

### Is NextDish free to use?

The core features are free. Premium features for recipe creators (analytics, monetization tools) may be available in the future.

### Can I use NextDish offline?

Yes! NextDish is a Progressive Web App (PWA) with service worker caching. Once you've loaded the AI models, you can generate recipes offline. However, saving recipes and social features require an internet connection.

### What browsers are supported?

NextDish works best in modern browsers that support:
- WebAssembly (for AI models)
- Service Workers (for offline support)
- ES2020+ JavaScript features

Recommended browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### How do I deploy NextDish to my own server?

See the [Installation](#installation) section for setup instructions. For Cloudflare Pages deployment, use `npm run deploy` after configuring your environment variables in the Cloudflare dashboard.

### Where can I report bugs or request features?

Open a GitHub issue or contact the maintainer directly. We appreciate your feedback!

---

**Built with ❤️ using Next.js, Supabase, and Cloudflare Pages**
