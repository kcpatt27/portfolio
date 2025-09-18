# System Patterns: Portfolio Website Architecture

## Overall Architecture
Single-page application (SPA) built with vanilla HTML/CSS/JavaScript + Three.js for 3D elements. The architecture prioritizes maintainability, performance, and memorable user experiences.

## Key Technical Decisions
- **Hybrid Stack**: HTML5, CSS3, JavaScript + Three.js for 3D elements
- **CSS Custom Properties**: CSS variables for cosmic color theming and easy customization
- **Mobile-First Performance**: Responsive design optimized for mobile with desktop wow factor
- **Semantic HTML**: Proper HTML5 semantic elements for accessibility and SEO
- **Progressive Enhancement**: Base functionality works without JavaScript, enhanced with 3D

## Design Patterns
- **Component-Based CSS**: Modular CSS classes with cosmic theming
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with 3D
- **Graceful Degradation**: Fallbacks for older browsers and mobile devices
- **Performance Optimization**: Mobile-first approach with desktop enhancements
- **3D Layering**: CSS transforms for performance, Three.js for wow factor

## Component Structure
```
Cosmic Cyberpunk Portfolio
├── Header (Navigation + Space Branding)
├── Hero Section (Space Environment + Value Proposition)
├── Current Reality (Real Development Work)
├── Future Vision (Space/Robot Dreams)
├── Services Section (Cosmic Pricing Tiers)
└── Footer (Contact + Secondary CTA)
```

## Key Technical Patterns
- **CSS Grid/Flexbox**: Modern layout techniques for responsive design
- **CSS Custom Properties**: Centralized cosmic theming system
- **3D Transforms**: CSS-based 3D effects for performance
- **Three.js Integration**: Selective 3D elements for wow factor
- **Form Integration**: Google Forms embedding with cyberpunk styling
- **Image Optimization**: Responsive images with proper alt text
- **Progressive Loading**: Critical CSS inlined, 3D elements loaded asynchronously

## Integration Points
- **Google Forms**: Primary order collection mechanism
- **External Images**: Unsplash integration for portfolio examples
- **Email Integration**: Contact form routing to business email
- **Analytics Ready**: Structure prepared for Google Analytics integration

## Maintenance Patterns
- **Single File Structure**: All code in one HTML file for easy deployment
- **Clear Separation**: CSS, HTML, and JavaScript clearly separated within the file
- **Documentation**: Inline comments explaining key sections
- **Version Control**: Git-friendly structure for easy updates

## Scalability Considerations
- **Modular CSS**: Easy to extract into separate stylesheet if needed
- **Component Extraction**: Sections can be converted to separate files if site grows
- **Database Integration**: Structure ready for backend integration if needed
- **CMS Integration**: Layout supports content management system integration
