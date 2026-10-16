import { useEffect, useRef, useState } from 'react';
import { skillCategories, type Skill } from '../data/portfolio';
import { skillIconFor } from '../data/skillIcons';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { SectionHeading } from './fx';

/**
 * Capability Universe — the CV's skill map, grouped by discipline.
 *
 * Every skill carries a scalable vector icon, its name and its discipline, so
 * the whole universe can be scanned without a horizontal rail.
 *
 * Layout decisions
 *   • Two columns on desktop: the discipline rail on the left, the category
 *     board on the right. The rail is a real navigator — it scrolls to a group
 *     and marks the one you are reading — rather than a decorative index. Both
 *     live inside the same grid, so the board starts beside the rail instead of
 *     below it.
 *   • The icon is the identity, not a coloured badge: one stroke weight, cream
 *     text, and the crimson accent reserved for the "Core" markers.
 *   • On phones the rail becomes a compact sticky strip of chips above the board.
 */
export default function Skills() {
  const { scrollTo } = useSmoothScroll();
  const [active, setActive] = useState(skillCategories[0]?.id ?? '');
  const board = useRef<HTMLDivElement>(null);

  // Mark the discipline whose group is closest to the top of the viewport, so
  // the rail reflects where the reader actually is.
  useEffect(() => {
    const groups = skillCategories
      .map((c) => document.getElementById(`category-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!groups.length) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) ratios.set(e.target.id, e.intersectionRatio);
          else ratios.delete(e.target.id);
        }
        const lead = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (lead) setActive(lead[0].replace('category-', ''));
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    groups.forEach((g) => observer.observe(g));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    setActive(id);
    const el = document.getElementById(`category-${id}`);
    if (!el) return;
    // Offset for the fixed seek bar plus the section's own top padding.
    scrollTo(el.getBoundingClientRect().top + window.scrollY, { offset: -96 });
  };

  return (
    <>
      <SectionHeading
        kicker="Genres"
        title="My Capability Universe"
        script="every skill, staged"
        aside={
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            Every capability on the CV, grouped by discipline. Pick a discipline to
            jump to it — the full list stays on screen so the map can be read in one pass.
          </p>
        }
      />

      {/* `grid-cols-1` + `min-w-0` on both children is load-bearing: an auto track
          sizes to its items' min-content, and the chip strip below contributes its
          full unwrapped width. Without the explicit column and the min-width:0 the
          single track grew to ~1790px inside a 390px viewport and the whole page
          scrolled sideways on phones. */}
      <div className="gutter grid grid-cols-1 gap-8 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-12">
        {/* discipline navigator */}
        <nav
          aria-label="Skill disciplines"
          className="min-w-0 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pb-2"
        >
          {/* The strip is a horizontal scroller on phones and a vertical rail on
              desktop; the wrapper clips the former so it never widens the page. */}
          <div className="overflow-x-auto lg:overflow-visible">
          <ul className="flex w-max gap-2 pb-2 lg:w-full lg:flex-col lg:gap-1 lg:pb-0">
            {skillCategories.map((cat) => (
              <li key={cat.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => jump(cat.id)}
                  aria-current={active === cat.id ? 'true' : undefined}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active === cat.id ? 'bg-white/[0.07] ring-1 ring-white/15' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-crimson/10 ring-1 ring-white/10">
                      <span className="font-display text-sm font-bold tracking-wider text-bone">
                        {cat.id.slice(0, 2).toUpperCase()}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className={`block whitespace-nowrap text-sm font-semibold lg:whitespace-normal ${active === cat.id ? 'text-bone' : 'text-bone/80'}`}>
                        {cat.title}
                      </span>
                      <span className="hidden truncate text-xs text-mist lg:block">{cat.subtitle}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-bold tabular-nums tracking-[0.16em] text-mist">{cat.skills.length}</span>
                </button>
              </li>
            ))}
          </ul>
          </div>
        </nav>

        {/* category board */}
        <div ref={board} className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((cat) => (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              aria-label={`${cat.title} — ${cat.skills.length} capabilities`}
              className="scroll-mt-24 self-start rounded-xl bg-ink-2 ring-1 ring-white/5"
            >
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-crimson/15 ring-1 ring-white/12">
                  <span className="font-display text-sm font-bold tracking-wider text-bone">{cat.id.slice(0, 2).toUpperCase()}</span>
                </span>
                <h3 className="text-sm font-semibold text-bone">{cat.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">{cat.skills.length}</span>
              </div>

              <ul className="space-y-1.5 px-3 py-3">
                {cat.skills.map((skill) => (
                  <SkillRow key={skill.name} skill={skill} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

/** A single capability. Static by design: the whole board is visible, so nothing hides behind a click. */
function SkillRow({ skill }: { skill: Skill }) {
  const Icon = skillIconFor(skill.name);

  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.04]">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-crimson/10 ring-1 ring-white/10">
        {Icon ? <Icon size={17} strokeWidth={1.6} className="text-bone/90" aria-hidden /> : <span className="font-display text-sm font-bold text-bone/90">{skill.mono}</span>}
      </span>
      <span className="min-w-0 flex-1 text-[13px] leading-snug text-bone/85">{skill.name}</span>
      {skill.note && (
        <span className="shrink-0 rounded-full bg-crimson/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-crimson-2">
          {skill.note}
        </span>
      )}
    </li>
  );
}
