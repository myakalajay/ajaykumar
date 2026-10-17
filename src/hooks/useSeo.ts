import { useEffect } from 'react';
import type { SectionId } from '../data/portfolio';

/**
 * Search and social metadata for a single-page, section-scrolled site.
 *
 * The document keeps one canonical URL (a fragment is not a separate page), but
 * the title and description follow the section the visitor is watching so that
 * shares, browser tabs and reader views describe what is actually on screen.
 */

const BASE_TITLE = 'Ajay Kumar Myakala — Product Strategy & Design Transformation Leader';

const BASE_DESCRIPTION =
  'Ajay Kumar Myakala — Product Strategy & Design Transformation Leader with 10+ years across Enterprise SaaS, FinTech, mortgage and lending, procurement, GovTech, media, AdTech, MarTech and recruitment technology.';

/** The hero and the closing CTA frame the series but are not (SectionId)s. */
type SeoId = SectionId | 'top' | 'contact';

/** Section copy lives in data, next to the facts it describes — not in the hook. */
const SECTION_COPY: Record<SeoId, { title: string; description: string }> = {
  top: { title: BASE_TITLE, description: BASE_DESCRIPTION },
  contact: {
    title: `Let's build · ${BASE_TITLE}`,
    description:
      'Open to product strategy, design transformation and AI-enabled product work — start a conversation, or take the CV with you.',
  },
  about: {
    title: `About · ${BASE_TITLE}`,
    description: 'Ten years from UX/UI craft to product strategy — the positioning, focus and method behind the work.',
  },
  journey: {
    title: `Journey · ${BASE_TITLE}`,
    description: 'Six roles across eight industries, told as seasons: media and audience, broadcast, public service, procurement and mortgage.',
  },
  originals: {
    title: `Originals · ${BASE_TITLE}`,
    description:
      'Homeratesyard, CashTrax & DiversityTrax, ePragathi, broadcast monetisation, audience intelligence, JobsNProfiles and more — the platforms, told as case studies.',
  },
  picks: {
    title: `Top Picks · ${BASE_TITLE}`,
    description: 'The ten facts worth knowing first: 37% faster underwriting decisions, eight domains, seven companies.',
  },
  skills: {
    title: `Capabilities · ${BASE_TITLE}`,
    description:
      'Strategy and transformation, AI/ML/HCI, consulting and collaboration, product and experience, data and growth, and technical fluency.',
  },
  moments: {
    title: `Impact · ${BASE_TITLE}`,
    description: 'Signature outcomes and the toolchain behind them, from Figma and Miro to React, Next.js and analytics.',
  },
  continueWatching: {
    title: `Continue Watching · ${BASE_TITLE}`,
    description: 'The two most recent platforms on the CV, drawn with original key art and opened as case studies.',
  },
  story: {
    title: `Résumé · ${BASE_TITLE}`,
    description: 'View and download the full CV — product strategy and design transformation, 2016–2026.',
  },
};

function meta(selector: string, attr: 'name' | 'property', key: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, selector);
    document.head.appendChild(el);
  }
  el.setAttribute('content', key);
  return el;
}

function apply(title: string, description: string) {
  document.title = title;
  meta('description', 'name', description);
  meta('og:title', 'property', title);
  meta('og:description', 'property', description);
  meta('twitter:title', 'name', title);
  meta('twitter:description', 'name', description);
}

/** Reset the head to the site-level metadata (used before a profile is chosen). */
export function resetSeo() {
  apply(BASE_TITLE, BASE_DESCRIPTION);
}

/**
 * Follows the section in view.
 *
 * A single IntersectionObserver with a narrow centre band: the section crossing
 * the middle of the viewport wins. Sections are ordered by the viewer profile,
 * so the observer is rebuilt when the order changes.
 */
export function useSectionSeo(order: SectionId[], active: boolean) {
  useEffect(() => {
    if (!active) {
      resetSeo();
      return;
    }
    apply(SECTION_COPY.top.title, SECTION_COPY.top.description);

    // The hero (`top`) and the closing CTA (`contact`) are watched alongside the
    // profile's own section order, so scrolling to the top restores the site
    // title instead of leaving the first section's title stuck in the tab.
    const ids: SeoId[] = ['top', ...order, 'contact'];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // The band is a thin strip at the viewport centre; whichever section covers
    // it is the one being read. `rootMargin` uses negative margins to carve it.
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        const id = (top?.[0] ?? 'top') as SeoId;
        const copy = SECTION_COPY[id] ?? SECTION_COPY.top;
        apply(copy.title, copy.description);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [order, active]);
}

/** Canonical origin of this deployment, as configured at build time ('' when unset). */
export const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL as string | undefined) ?? '';
