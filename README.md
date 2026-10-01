# Ajay Kumar Myakala — Product Design Portfolio

Senior Product Designer portfolio focused on complex enterprise products, design systems and AI-enabled experiences. Single-page React application with full-screen case-study overlays.

**Live:** https://ajay-kumar-portfolio-steel.vercel.app

## Stack

- **React 19 + TypeScript** (strict mode) + **Vite 6**
- **framer-motion** for motion (reveal, transitions, layout animations)
- **lucide-react** icons (single consistent icon family)
- Hand-written CSS design system in [`src/index.css`](src/index.css) — tokens-first, no CSS framework
- Self-hosted variable fonts: Geist (primary), Inter, Bricolage Grotesque (display)

## Architecture

```
src/
  main.tsx         entry + global error boundary
  App.tsx          page composition: header, hero, work, demos, about, contact + case-study overlay
  data.ts          single source of truth: projects, case-study content, filters, experience, links
  blocks.tsx       reusable presentation blocks (reveals, diagrams, lightbox, prototype player)
  interactive.tsx  live demos (mortgage, supplier, commerce, AI loop), recruiter modal, design-system section
  systems.tsx      "Systems I build" module, shared-workplaces concept, /systems documentation overlay
  mocks.tsx        HTML/CSS product mock components (browser/phone/desktop frames, UI screens)
  index.css        design tokens + all styling (8px spacing scale, type scale, breakpoints)
```

- All project/case content is **data-driven** from `data.ts` — no hardcoded project markup.
- Design tokens: ivory `#faf9f6` ground, near-black ink, single orange accent `#e4572e`, restrained semantic green/amber/red. 8px spacing scale (`--space-1…10`), 1280px container, unified responsive gutters (48/24/16px).

## Commands

```bash
npm install     # install dependencies
npm run dev     # dev server on :3000
npm run lint    # type-check (tsc --noEmit, strict)
npm run build   # production build to dist/
npm run preview # serve the production build locally
```

## Content rules

Only CV-documented evidence appears as metrics (e.g. the 37% underwriting decision-time reduction on case 01). Everything else is labelled as scope, objective, or illustrative/prototype data. Interactive demos use conceptual data and say so.

## Deployment

Vercel auto-deploys on push to `main`.
