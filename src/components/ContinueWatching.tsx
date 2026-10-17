import { motion } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { ProjectArt } from './Poster';
import { useMedia } from '../hooks/useMedia';

/**
 * NOW STREAMING — the two most recent platforms, opened as case studies.
 *
 * What was here: two framed panels showing `/assets/continue_watching_left.jpg`
 * and `..._right.jpg`, with 'RESIDUE' and 'ORIGINS' typeset over them. None of
 * those six images (left/right at 1x and 2x, plus two for phones) exist in
 * public/assets — so the section rendered as broken image boxes with show titles
 * for programmes that do not exist, and "the finale arrives 11.12.26" promised a
 * premiere nobody could attend.
 *
 * It now shows the work: the two platforms with the latest date range on the CV,
 * drawn with the same generated key art the Originals cards use, each with its
 * own line and a real link into the case study. No stock photography, no dead
 * file paths, and nothing on screen that the CV cannot back up.
 */

/** The two platforms whose CV date range ends latest — this section is "now". */
const NOW_SHOWING = [...projects]
  .sort((a, b) => {
    const last = (p: Project) => Number((p.year.match(/\d{4}/g) ?? ['0']).slice(-1)[0]);
    return last(b) - last(a);
  })
  .slice(0, 2);

function Panel({ project, onOpen, index }: { project: Project; onOpen?: (p: Project) => void; index: number }) {
  return (
    <motion.article
      className="group relative min-w-0 flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 hover:ring-white/25"
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0">
        <div className="h-full w-full transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]">
          <ProjectArt project={project} />
        </div>
      </div>

      {/* Legibility scrim: the art is bright at the top, the copy sits at the bottom. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      <div className="relative flex min-h-[62svh] flex-col justify-end p-6 sm:min-h-[58vh] sm:p-8">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2">
          <span className="h-px w-6 bg-crimson-2" />
          {index === 0 ? 'Latest work' : 'Also showing'}
        </p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/70">{project.genre}</p>
        <h3 className="mt-1.5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[0.9] tracking-wide text-bone">{project.title}</h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/80 sm:text-[15px]">{project.logline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded border border-white/25 px-2 py-0.5 text-[10px] font-bold tracking-[0.16em] text-bone">{project.year}</span>
          {onOpen && (
            <button
              type="button"
              data-cursor="view"
              onClick={() => onOpen(project)}
              aria-label={`Open ${project.title}`}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-bone px-5 text-sm font-bold text-ink transition hover:bg-white"
            >
              ▶ Open case study
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ContinueWatching({ onOpen }: { onOpen?: (p: Project) => void }) {
  const isMobile = useMedia('(max-width: 900px)');

  return (
    <section
      className="mw-180 relative isolate px-4 py-10 sm:px-6"
      aria-label="Now streaming: latest work"
    >
      {/* Atmosphere: drawn, not fetched. Two blurred light pools keep the panels
          from floating on flat black. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-[-15%] blur-3xl" style={{ background: 'radial-gradient(38% 34% at 22% 30%, rgba(255,175,190,0.10) 0%, transparent 70%), radial-gradient(42% 38% at 78% 66%, rgba(140,120,255,0.10) 0%, transparent 70%)' }} />
      </div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-crimson-2">
            <span className="h-px w-8 bg-crimson-2" /> Now streaming
          </p>
          <h2 className="mt-2 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.9] tracking-wide text-bone">
            The work in progress
          </h2>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-mist">
          The two most recent platforms on the CV — open either one for the problem, the approach and the outcome.
        </p>
      </div>

      <div className={isMobile ? 'flex flex-col gap-4' : 'flex items-stretch gap-4'}>
        {NOW_SHOWING.map((p, i) => (
          <Panel key={p.id} project={p} onOpen={onOpen} index={i} />
        ))}
      </div>
    </section>
  );
}
