import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import JourneyTimeline from './JourneyTimeline';
import { RailButtons } from './Rail';

const PANEL_ID = 'season-panel';

/**
 * My Journey — one selector, one panel.
 *
 * The season pills that used to sit above the panel are gone: the timeline cards
 * are the selector, so there is a single place to click and a single source of
 * truth for `active`. The panel also no longer slides in from the side — the
 * horizontal translate widened the section while it ran, which let the page be
 * dragged sideways on every desktop — it fades and lifts instead.
 */
export default function Seasons() {
  const [active, setActive] = useState(seasons.length - 2);
  const season = seasons[active];
  const rail = useRef<HTMLDivElement>(null);

  const select = useCallback((i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <SectionHeading
        kicker={`${seasons.length} Seasons`}
        title="My Journey"
        script="seven seasons, one arc"
        aside={<p className="max-w-xs text-sm text-mist">Pick a season to read its episodes. The seven cards below are the whole career — nothing else to navigate.</p>}
      />

      <JourneyTimeline active={active} onSelect={select} />

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          id={PANEL_ID}
          role="region"
          aria-label={`Season ${season.number}: ${season.title}`}
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: EASE }}
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
