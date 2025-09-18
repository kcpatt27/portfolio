# v0 AI Prompt Templates (use after form answers)

**Prompt A — Project Setup**
```
You are an expert web developer. Based on the following catering business intake answers, generate the scaffolding for a responsive frontend using [React/Next.js + TailwindCSS].

INTAKE ANSWERS:
[Paste their Google Form responses here]

TASKS:
1. Create a file/folder structure for pages: Home, About, Services/Menu, Gallery, Contact.
2. Use their branding (colors, fonts, logo if provided).
3. Implement navigation bar + footer with contact info.
4. Set up placeholders for text and images (mark clearly where content goes).
5. Use clean, accessible HTML semantics and Tailwind classes.

OUTPUT: Complete file structure and starter code.
```

**Prompt B — Page Builder**
```
You are a UI/UX frontend generator. Based on this intake data:

[Paste responses relevant to content/images here]

Generate Tailwind + React components for each page:

- Home: hero image or carousel, tagline, call-to-action button.
- About: business story + team photo placeholders.
- Menu/Services: list or cards for catering services/menus.
- Gallery: responsive image grid with lightbox support.
- Contact: form with specified fields, form validation, and email/db handler placeholder.

Focus on clean UI, mobile-first, minimal clutter. Include responsive grid layouts and spacing.
```

**Prompt C — Forms & Functionality**
```
You are a forms & backend integration assistant. Based on this intake form data:

[Paste form answers relevant to forms/quote request]

TASK:
1. Generate React + Tailwind form components.
2. Include fields exactly as requested.
3. Add validation (required fields, email format, phone pattern).
4. Configure submission behavior:
   - If email only → use placeholder email handler function.
   - If database/spreadsheet → prepare integration points (e.g., Supabase/Airtable).
5. Include success + error states (styled with Tailwind).
```

**Prompt D — Training Docs**
```
You are a documentation generator. Based on this intake info and the final codebase, write a plain-English admin guide for non-technical business owners.

Include:
- How to log in/edit content (if CMS is used).
- How to upload/replace gallery images.
- How to update menu/services text.
- How to view form submissions.
- How to request future edits.

Keep it concise and friendly, step-by-step.
```
