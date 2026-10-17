# AJAY KUMAR MYAKALA — THE SERIES

A cinematic, streaming-inspired portfolio for **Ajay Kumar Myakala**: Product Strategy & Design Transformation Leader with 10+ years across enterprise SaaS, FinTech, mortgage, procurement, GovTech, media, AdTech and MarTech.
Every section is an episode, every platform is an Original, and the whole site plays like a series.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

## Run it locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

The static site is written to `dist/` and can be deployed as-is to Vercel, Netlify, GitHub Pages or any static host.

## Updating the content

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).** It was generated from the resume, and every component reads from it.

| To change… | Edit |
| --- | --- |
| Name, intro, email, phone, LinkedIn, photo | `profile` |
| A platform, or a new one | `projects` (add an object; it appears in Originals, the overlay, the resume sheet and the counts) |
| Career highlights / toolbox | `achievements`, `toolbox` |
| Industry domains & product models | `industries`, `productModels` |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| Seasons and episodes (My Journey) | `seasons` |
| Top 10 row | `topPicks` |
| ▶ Play Intro highlight reel | `introSlides` |
| Profile order (Recruiter / Product Lead / Design Lead) | `viewerProfiles` |
| Opening studio card text | `profile.originalLabel` |
| The CV's five value statements (About + resume sheet) | `strategicValue` |
| Career arc on the About poster | `careerArc` |
| Platform streams line | `platformStreams` |

Derived text is computed, never repeated: `profile.interests` is the titles of `strategicValue`, and every count on the site (`6 Originals`, `22 Tools`, `7 Seasons · 16 Episodes`, `8 industries`) is read from the arrays — so adding a project or tool updates the hero chips, Top Picks, section meta and the resume sheet at once.

> `continueWatching` is a new SectionId: the "Now streaming" cards live in the per-profile section order, so a profile switcher that includes it (`ajay`, `design`, `product`, `recruiter` after the edit) shows it as its own deep-linkable section instead of a hard-coded block.

**Resume:** replace `public/assets/Ajay_Kumar_Myakala_CV.pdf` (and `profile.resumeFile` if the filename changes).

**Photo:** replace `ajay.png` (background-removed cutout — the alpha channel is the mask), then run:

```bash
npm run images
```

This rebuilds the responsive WebP portraits and the social share image in `public/assets/`.

## What's inside

```
src/
  data/portfolio.ts        ← single source of truth (from the resume)
  App.tsx                  ← stages: opening → profile select → home; overlays
  components/
    OpeningSequence        ← black → studio card → AJAY → THE SERIES → portrait → ▶ PLAY
    ProfileSelector        ← "Who's watching?" (changes section order only)
    Navbar                 ← hide-on-scroll nav, profile switcher, mobile menu
    Hero                   ← billboard: parallax portrait, particles, light streaks, floating chips
    PlayIntro              ← ▶ Play Intro: zoom into portrait → highlight reel (pause, ← →, tap zones)
    ContinueWatching       ← "Now streaming" cards, a per-profile section
    About                  ← The Pilot
    Seasons / EpisodeCard  ← My Journey as seasons and episodes
    Originals / ProjectCard← pinned horizontal sequence on desktop, swipe rail on touch
    ProjectModal           ← full-screen project overlay with a shared-element transition
    TopPicks               ← Top 10-style row
    Skills                 ← skill genres; each card shows where the skill appears
    Achievements           ← highlight-poster cards (laurels, links into Originals) + toolbox rail
    JourneyTimeline        ← the career spine drawn to real dates; picks a season
    ResumeViewer/ResumeModal ← designed resume sheet, PDF viewer, download, Print CV
    SeekBar                ← streaming scrubber: chapter marks, click to jump
    FinalCTA               ← TO BE CONTINUED… + contact links
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, 3D tilt, text reveals, particles
  hooks/                   ← Lenis smooth scroll + scroll lock, media queries, watch progress, focus trap
  utils/print.ts           ← "Print CV" — typesets the resume sheet on its own
scripts/build-images.mjs   ← portrait/share-image pipeline (sharp)
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11, Lenis.

## Layout constraints worth knowing before you edit CSS

- **Never put `overflow-x` on `html`** — `hidden` *or* `clip`. The Originals section pins
  (`position: sticky`) and slides sideways by translating an inner track; with `overflow-x` on the
  root the pin resolves against that element's scrollport instead of the viewport, and the panel
  stops sticking (measured: sticky `top` goes from `0` to `-600px`). `body { overflow-x: hidden }`
  is fine and is what actually stops phones panning sideways.
- **Don't add `scale` or `filter` to the home wrapper** in `App.tsx`. Either one makes the wrapper
  the containing block for its `position: fixed` children, so the seek bar and navbar would scroll
  away with the page. The entrance uses opacity only for this reason.
- Horizontal rails (`.rail`) and the pre-reveal slide-in are clipped by their own container, not by
  the document, so an un-revealed rail can't widen the page.

## Accessibility and performance

- `prefers-reduced-motion` is respected: smooth scroll, the custom cursor, tilt, particles, grain and the pinned horizontal scroll turn off, and the opening jumps straight to its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays close with Esc, and the highlight reel supports Space and the ← → keys. Project and
  resume overlays also trap Tab, so focus can't wander to the page behind them.
- The timeline, seek bar and season picker are real buttons with `aria-pressed`, so the whole series
  is navigable by keyboard alone.
- Portraits are responsive WebP files (24–167 KB) built from a single 640×959 cutout. Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Opening:** Enter or Esc skips it.
- **Play Intro:** Space pauses, ← and → change slides, Esc closes.
- **Project and resume overlays:** Esc closes.
