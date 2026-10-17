import { motion } from 'framer-motion';
import { Building2, Gauge, Globe, Layers, TrendingUp, Video, type LucideIcon } from 'lucide-react';
import { achievements, projects, type Project } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';

/**
 * Career Highlights — one row, six cards, no second row to fall into.
 *
 * Before: a 5-up grid of 6 cards, which meant the last highlight sat alone on a
 * row of its own and the layout had a special case to centre it. It also leaned
 * on a pair of laurel wreaths and a gold gradient, which read as decoration
 * rather than as evidence.
 *
 * Now: a single row of six at desktop widths (2-up on tablets, 1-up on phones),
 * each card built from the same parts so they read as a set — a gold hairline, a
 * label, an icon for what the highlight measures, the headline number, the
 * organisation, the evidence, and the way through to the case study. The laurels
 * are gone; the icon badge carries the honour instead, and the numbers do the
 * talking.
 */

/** What each highlight measures, by id — the icon is a fact about the row, not decoration. */
const ICONS: Record<string, LucideIcon> = {
  'underwriting-37': TrendingUp,
  tenure: Gauge,
  domains: Globe,
  'seven-roles': Layers,
  govtech: Building2,
  atsc: Video,
};

const GOLD = '#d9b46a';

export default function Achievements({ onOpen }: { onOpen?: (p: Project) => void }) {
  /** A highlight that names a platform on the CV can open that Original as a case study. */
  const projectFor = (id?: string) => (id ? projects.find((p) => p.id === id) : undefined);

  return (
    <>
      <SectionHeading
        script="the moments that landed"
        kicker="Signature impact"
        title="Career Highlights"
        aside={<p className="max-w-xs text-sm text-mist">The outcomes the CV calls out — measured impact, tenure and the platforms behind them. Open any one for the full case study.</p>}
      />

      <div className="gutter grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 [perspective:1400px]">
        {achievements.map((a, i) => {
          const Icon = ICONS[a.id] ?? Gauge;
          const project = projectFor(a.projectId);

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            >
              <Tilt max={6} className="group h-full rounded-2xl">
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#15130f,#0a0908)] p-5 ring-1 ring-white/[0.08] transition duration-500 group-hover:ring-[#d9b46a]/45"
                >
                  {/* gold hairline + a glow that only appears on hover */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b46a]/70 to-transparent" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d9b46a]/10 opacity-0 blur-3xl transition duration-700 group-hover:opacity-100"
                  />

                  <div className="relative flex items-center justify-between gap-2">
                    <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.2em] text-[#d9b46a]">{a.laurel}</p>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${GOLD}1a`, boxShadow: `inset 0 0 0 1px ${GOLD}38` }}
                    >
                      <Icon size={15} strokeWidth={1.7} style={{ color: GOLD }} aria-hidden />
                    </span>
                  </div>

                  <h3 className="relative mt-4 font-display text-[1.7rem] leading-[0.95] tracking-wide text-bone">{a.title}</h3>
                  <p className="relative mt-1.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-[#d9b46a]/90">
                    {a.org}
                  </p>
                  <p className="relative mt-3 text-[12.5px] leading-relaxed text-bone/65">{a.detail}</p>

                  <div className="relative mt-auto pt-5">
                    {onOpen && project ? (
                      <button
                        type="button"
                        data-cursor="view"
                        onClick={() => onOpen(project)}
                        aria-label={`Open ${project.title} as a case study`}
                        className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#d9b46a]/35 px-3 text-[10px] font-bold tracking-[0.14em] text-bone transition hover:border-[#d9b46a]/80 hover:bg-[#d9b46a]/10"
                      >
                        ▶ OPEN CASE STUDY
                      </button>
                    ) : a.link ? (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="link"
                        className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[#d9b46a]/35 px-3 text-[10px] font-bold tracking-[0.14em] text-bone transition hover:border-[#d9b46a]/80 hover:bg-[#d9b46a]/10"
                      >
                        View certificate ↗
                      </a>
                    ) : (
                      // No destination for this highlight: hold the row's baseline rather
                      // than leaving one card visibly shorter than the rest.
                      <span aria-hidden className="block h-10" />
                    )}
                  </div>
                </article>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
