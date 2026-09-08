# CodeNova Academy

CodeNova Academy is a polished, static-first programming academy frontend built around the promise **Learn • Build • Create**. It is intentionally designed to feel like a real learning product rather than a video landing page: courses, lesson viewing, learning paths, projects, practice challenges, achievements, a progress dashboard, and a validated contact flow are all represented in the first release.

## Stack and architecture

The project uses React 19 with Vite and TypeScript in the WebDev static scaffold. The UI is client-only and does not require a backend or database. Course and lesson data are modeled as JavaScript/TypeScript objects inside `client/src/App.tsx`, while progress and completed lessons are persisted in browser `localStorage`. The interface is styled with a custom CSS system in `client/src/index.css`, using Space Grotesk, Manrope, and DM Mono to create a dark developer aesthetic with cyan accents, quiet glass surfaces, technical grids, and restrained motion.

The current experience is implemented as a single scrollable academy surface so users can reach every core section without dead ends. The component structure is intentionally easy to split into routes later: `CourseCard`, `CourseModal`, `RoadmapNode`, and `Achievement` are already isolated primitives, while the data arrays can move to a future API layer without changing the interaction contracts.

## Included experience

The home experience includes sticky navigation with a mobile menu, a code-editor hero, Why CodeNova feature cards, searchable and filterable course cards, course detail and lesson modal UI, a learning roadmap, AI-assisted learning explanation, project gallery, practice challenge, local progress dashboard, achievements, placeholder academy statistics, validated contact form, and footer navigation. Course modal interactions include lesson switching, progress indicators, mark-complete behavior, previous/next controls, and a clear “what you will build” list.

## EmailJS setup

The form currently demonstrates required-field validation, email validation, minimum message length, loading state, success state, and error state without exposing credentials. To connect EmailJS later, add the following values in the project configuration and replace the submit stub in `client/src/App.tsx` with `emailjs.sendForm`:

- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`

No real keys are included in this repository. The EmailJS browser CDN is already referenced in `client/index.html` for the future integration.

## Development commands

```bash
pnpm dev
pnpm check
pnpm build
```

The production build is currently clean. Vite reports only the standard bundle-size advisory because the complete interactive academy is shipped as one client bundle; this can be addressed later with route-level dynamic imports if the project grows into multiple pages.

## Future expansion

The next natural step is to move the course and lesson objects behind a backend or headless CMS, add authenticated user profiles, upload real lesson media, and split the current surface into `/courses`, `/course/:id`, `/projects`, and `/contact` routes. The UI already avoids hard-coded progress assumptions and keeps the local-first behavior isolated, so this migration can happen without redesigning the experience.
