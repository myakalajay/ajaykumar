import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import JourneyTimeline from './JourneyTimeline';
import { RailButtons } from './Rail';

const PANEL_ID = 'season-panel';
const tabId = (i: number) => `season-tab-${i}`;

export default function Seasons() {
  const [active, setActive] = useState(seasons.length - 2);
  const season = seasons[active];
  const rail = useRef<HTMLDivElement>(null);
  const tablist = useRef<HTMLDivElement>(null);

  // The pill row is a real scroller (it holds all 7 seasons, far wider than a
  // phone). When the selection changes — from a pill, the timeline span, or the
  // arrow keys — bring that pill into view so the active state is never off-screen.
  useEffect(() => {
    const row = tablist.current;
    const tab = row?.querySelector<HTMLElement>(`#${CSS.escape(tabId(active))}`);
    if (!row || !tab) return;
    const left = tab.offsetLeft - row.clientWidth / 2 + tab.offsetWidth / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  /** Arrow keys / Home / End move the selection, per the ARIA tabs pattern. */
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = seasons.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
    document.getElementById(tabId(next))?.focus();
  };

  return (
    <>
      <SectionHeading
        kicker={`${seasons.length} Seasons`}
        title="My Journey"
        script="seven seasons, one arc"
        aside={<p className="max-w-xs text-sm text-mist">Every stage of the resume, told as a season — select one to see its episodes.</p>}
      />

      <JourneyTimeline active={active} onSelect={select} />

      {/* season selector */}
      <div ref={tablist} className="rail gutter mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Seasons">
        {seasons.map((s, i) => (
          <button
            key={s.number}
            id={tabId(i)}
            role="tab"
            aria-selected={i === active}
            aria-controls={PANEL_ID}
            tabIndex={i === active ? 0 : -1}
            type="button"
            onClick={() => select(i)}
            onKeyDown={(e) => onTabKeyDown(e, i)}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition ${i === active ? 'text-ink' : 'text-mist hover:text-bone'}`}
          >
            {i === active && <motion.span layoutId="season-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">SEASON {String(s.number).padStart(2, '0')}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
              <span className="text-outline mr-3">S{String(season.number).padStart(2, '0')}</span>
              {season.title}
            </h3>
            <span className="text-sm text-mist">
              {season.period} · {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
            </span>
          </div>
          <p className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
