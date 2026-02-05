# Portfolio Website — 3D Cyberpunk/Space Portfolio

A 3D cyberpunk/space-themed portfolio website that serves as both a showcase of web development work and a lead generation tool for potential clients. Combines futuristic aesthetics with professional functionality, featuring immersive 3D elements and streamlined order placement.

## Project Status

**Status:** 80% Complete (Core features shipped, working on content finalization and deployment)

```
████████░░ 80%
```

### Completed Features
- ✅ Project setup and file organization
- ✅ Comprehensive documentation structure (README, ARCHITECTURE, ROADMAP)
- ✅ Design system with cyberpunk/space theme implemented
- ✅ 3D elements integrated using Three.js
- ✅ Responsive layout with mobile-first approach
- ✅ Portfolio showcase section with real project examples
- ✅ Professional content structure (About, Work, Contact sections)
- ✅ Typography and color system finalized

### In Progress
- 🔄 Content personalization and updates (ETA: 2-3 days)
- 🔄 Google Forms integration (ETA: 3-5 days)
- 🔄 Cross-browser and device testing (ETA: 3-4 days)
- 🔄 Performance optimization (ETA: 2-3 days)
- 🔄 GitHub Pages deployment (ETA: 1 day)

### Planned/Roadmap
- [See full roadmap](ROADMAP.md) for detailed feature plans and timeline

### Stats
- **Lines of code:** 1,093 (main HTML file)
- **Documentation coverage:** 100% (README, ARCHITECTURE, ROADMAP complete)
- **Test coverage:** 0% (testing phase upcoming)
- **Last updated:** January 2026

## Table of Contents

- [Overview/Motivation](#overviewmotivation)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage/Getting Started](#usagegetting-started)
- [Architecture Overview](#architecture-overview)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [FAQ](#faq)

## Overview/Motivation

This portfolio website addresses the need for a memorable, artistic online presence that attracts clients who appreciate innovative design while maintaining professional functionality. It serves as a digital business card and lead generation tool for web development services, specifically targeting small businesses that need professional websites.

**Who is it for?**
- Tech-forward business owners who appreciate innovative design
- Fellow developers who understand technical creativity
- Creative entrepreneurs who value unique branding
- Space/tech enthusiasts who connect with the cosmic theme
- Budget-conscious clients who need clear pricing information

**What problem does it solve?**
- Provides a memorable, unique way for potential clients to discover services and place orders
- Showcases both technical work and creative vision to build trust
- Offers clear pricing tiers and easy order placement with futuristic presentation
- Establishes authority in web development services while standing out from competition
- Combines real development work with space/robot dreams to create unique positioning

## Key Features

- **Immersive 3D Experience**: Full-screen hero section with floating geometric objects and starfield background using Three.js
- **Cyberpunk/Space Theme**: Unique cosmic color palette with moonshadow purple, cosmic pink, and sunset orange gradients
- **Portfolio Showcase**: Dynamic display of real development projects with screenshots and descriptions
- **Service Pricing Tiers**: Three-tier pricing structure (Basic, Professional, Premium) with clear value propositions
- **Google Forms Integration**: Seamless order inquiry forms with cyberpunk styling
- **Mobile-First Design**: Responsive layout optimized for mobile performance while maintaining desktop wow factor
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with 3D elements when available

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js (r128) for selective 3D elements
- **Styling**: Vanilla CSS with CSS custom properties for theming
- **Typography**: Google Fonts (Space Grotesk, Inter, JetBrains Mono, Orbitron)
- **Images**: External sources (Unsplash) with responsive loading
- **Forms**: Google Forms integration
- **Hosting**: GitHub Pages (planned)
- **Version Control**: Git with GitHub integration

## Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge - latest versions)
- Git (for version control)
- Text editor (VS Code recommended)
- Local file server (optional, for development)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-page.git
   cd portfolio-page
   ```

2. **Open the project**
   - The main file is `index.html` (at the repo root)
   - You can open it directly in a browser, or use a local server

3. **Local Development Server (Optional)**
   
   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Using Node.js (with http-server):
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```
   
   Using VS Code:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **View the site**
   - Navigate to `http://localhost:8000/` or `http://localhost:8000/index.html` (or the port you specified)
   - Or simply open `index.html` directly in your browser

5. **Environment Setup**
   - No environment variables required
   - Google Forms URLs need to be configured in the HTML file
   - External image URLs (Unsplash) are already configured

6. **Link other projects' docs (optional)**
   - Clicking a project card loads that project's README and Roadmap from `_project-docs/<id>/`.
   - From the repo root, run: `npm run symlink-docs` to create symlinks from each project's `localPath` (see `metadata/projects.config.json`) into `_project-docs/<id>/README.md` and `ROADMAP.md`.
   - Ensure sibling project folders (e.g. `../Cookbook`, `../2D Global Info Portal`) exist so symlinks can be created.

## Usage/Getting Started

### Basic Example

The portfolio website is a single-page application. Simply open `index.html` in a browser to view the site.

**File Structure:**
```
portfolio-page/
├── index.html              # Main portfolio page
├── docs.html               # Project documentation viewer
├── roadmaps.html           # Project roadmaps viewer
├── blog.html               # Blog / insights
├── web-dev/
│   └── index.html          # Web development services page
├── examples/               # Example package pages
├── example-images/         # Design references
├── memory-bank/            # Project documentation
├── metadata/               # Project configuration (projects.config.json)
├── scripts/                # Build scripts (aggregate-projects.ts)
└── project-images/         # Portfolio project images
```

### Customization

1. **Update Personal Information**
   - Edit the `<title>` and meta description in `index.html`
   - Update the About section with your information
   - Replace contact email and social media links

2. **Add Portfolio Projects**
   - Update the Work section with your actual projects
   - Replace placeholder images with your project screenshots
   - Update project descriptions and links

3. **Configure Google Forms**
   - Create Google Forms for order inquiries
   - Replace placeholder form URLs in the HTML
   - Customize form styling to match the cyberpunk theme

4. **Customize Colors**
   - Edit CSS custom properties in the `:root` selector
   - Modify the cosmic color palette variables
   - Adjust gradient combinations

### Expected Output

When you open the site, you should see:
- Full-screen hero section with 3D geometric object and starfield background
- About section with professional information
- Work section showcasing portfolio projects
- Contact section with form integration
- Responsive design that adapts to different screen sizes

## Architecture Overview

The portfolio website is a client-side single-page application built with vanilla HTML, CSS, and JavaScript. It uses Three.js for 3D graphics and integrates with Google Forms for order collection.

### System Architecture

```
┌─────────────┐
│   Browser   │  User accesses portfolio website
└──────┬──────┘
       │ HTTPS
┌──────▼──────┐
│  Frontend   │  Single HTML file with embedded CSS/JS
│ (HTML/CSS/  │  - Three.js for 3D elements
│  Three.js)  │  - Google Fonts for typography
└──────┬──────┘  - Responsive CSS for mobile/desktop
       │
┌──────▼──────────────┐
│  External Services  │
│  - Google Forms      │  Order inquiry collection
│  - Google Fonts      │  Typography loading
│  - Unsplash         │  Portfolio images
└─────────────────────┘
```

### Key Components

**Frontend (Single HTML File)**
- **Purpose**: Complete portfolio website in one file
- **Technology**: HTML5, CSS3, JavaScript (ES6+), Three.js
- **Hosted on**: GitHub Pages (planned)
- **Key Features**:
  - 3D hero section with geometric objects
  - Portfolio project showcase
  - Responsive navigation
  - Contact form integration

**3D Graphics (Three.js)**
- **Purpose**: Create immersive 3D visual elements
- **Technology**: Three.js r128
- **Key Elements**:
  - Floating geometric objects in hero section
  - Starfield background animation
  - Camera positioning and lighting

**Styling (CSS)**
- **Purpose**: Cyberpunk/space theme implementation
- **Technology**: Vanilla CSS with custom properties
- **Key Features**:
  - Cosmic color palette (moonshadow purple, cosmic pink, sunset orange)
  - Responsive grid layouts
  - Smooth animations and transitions
  - Mobile-first design approach

### Data Flow

**Page Load**
1. Browser loads HTML file
2. CSS styles are applied immediately
3. JavaScript initializes Three.js scene
4. 3D objects are rendered in hero section
5. Portfolio projects are displayed from embedded data

**Form Submission**
1. User fills out order inquiry form
2. Form data is submitted to Google Forms
3. Google Forms processes and stores the submission
4. User is redirected to confirmation page

**Image Loading**
1. Portfolio images are loaded from external sources (Unsplash)
2. Responsive images adapt to screen size
3. Lazy loading improves initial page load performance

### Technology Decisions

**Why Vanilla HTML/CSS/JS?**
- Simplicity and performance (no build process needed)
- Easy maintenance and updates
- Fast loading times
- Full control over every aspect of the design

**Why Three.js?**
- Industry-standard 3D graphics library
- Excellent browser support
- Rich ecosystem and documentation
- Perfect for creating immersive 3D experiences

**Why Single File?**
- Easy deployment to GitHub Pages
- No build process required
- Simple version control
- Fast development iteration

**Why Google Forms?**
- No backend required
- Built-in form handling and storage
- Easy to customize and maintain
- Free and reliable

## API Documentation

This project does not include a custom API. It relies on external services:

- **Google Forms API**: Used for order inquiry form submissions
- **Google Fonts API**: Used for loading custom typography
- **Unsplash API**: Used for portfolio project images (optional, can be replaced with local images)

For Google Forms integration, create a form and embed it using an iframe or redirect users to the form URL.

## Contributing

This is a personal portfolio project. If you'd like to contribute or have suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your changes align with the cyberpunk/space theme and maintain the mobile-first responsive design.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed roadmap information.

### Current Phase (Now)
- ✅ Project setup and file organization
- ✅ Memory bank and documentation structure
- ✅ Design system implementation
- ✅ 3D elements integration
- 🔄 Content updates and personalization
- 🔄 Google Forms integration
- 🔄 Mobile optimization

### Next Phase
- Analytics setup and tracking
- Performance optimization
- SEO improvements
- Advanced 3D interactions

### Future Enhancements
- CMS integration for easier content updates
- Advanced analytics and conversion tracking
- A/B testing capabilities
- Additional 3D scene variations

## License

This project is private/personal. All rights reserved.

## FAQ

**Q: Do I need to install anything to run this locally?**  
A: No, you can simply open `index.html` in a browser. A local server is optional but recommended for development.

**Q: How do I customize the 3D objects?**  
A: Edit the Three.js scene setup in the JavaScript section of `index.html`. Modify camera position, object geometry, lighting, and materials.

**Q: Can I replace the external images with my own?**  
A: Yes, replace the Unsplash URLs with your own image URLs or use local images. Update the image paths in the HTML.

**Q: How do I set up Google Forms?**  
A: Create a Google Form, customize it to match your needs, and replace the form URL in the HTML file. You can embed it as an iframe or link to it directly.

**Q: Is this mobile-friendly?**  
A: Yes, the design is mobile-first and fully responsive. The 3D elements are optimized for performance on mobile devices.

**Q: Can I deploy this to platforms other than GitHub Pages?**  
A: Yes, since it's a static site, you can deploy it to any static hosting service (Vercel, Netlify, AWS S3, etc.).

**Q: How do I update the color scheme?**  
A: Edit the CSS custom properties in the `:root` selector at the top of the HTML file. All colors are defined as variables for easy customization.

**Q: Does this work without JavaScript?**  
A: The core content and styling work without JavaScript. The 3D elements require JavaScript to function, but the site degrades gracefully.

---

*Initial structure generated by Cursor AI, reviewed and customized manually.*
