import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accessibility,
  BarChart3,
  Boxes,
  Gauge,
  Globe,
  Layers,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { profile, projects, type Project } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EASE, Magnetic } from './fx';
import { ProjectArt } from './Poster';
import { DeviceMock, ScreenMock, WireframeMock, ShowcaseItem } from './OriginalShowcase';
import { BoardGallery, BoardLightbox } from './Boards';
import { originalDetails, type Board } from '../data/originalsExtras';

const block = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

/**
 * An icon per metric, chosen from what the label is actually measuring.
 *
 * The metrics are `{ value, label }` pairs, so the icon is resolved from the
 * label rather than stored per row: a tile reading "37% faster" gets a gauge, one
 * reading "AWS · Azure" gets a stack. Anything unrecognised falls back to a
 * target, so a new metric never renders blank.
 */
function metricIcon(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (/accessib|wcag|privacy|ethics/.test(l)) return Accessibility;
  if (/audience|user|role|team|stakeholder|c-suite|pod|reader|borrower|operator/.test(l)) return Users;
  if (/year|tenure|faster|time|decision|month|week/.test(l)) return Gauge;
  if (/%|lift|growth|optimis|conversion|reduc/.test(l)) return TrendingUp;
  if (/stage|phase|step|layer|workstream|journey|lifecycle/.test(l)) return Layers;
  if (/dashboard|data|analytic|report|insight|behaviour/.test(l)) return BarChart3;
  if (/mobile|responsive|discovery/.test(l)) return Smartphone;
  if (/domain|industry|market|sector|govtech|procurement/.test(l)) return Globe;
  if (/platform|brand|suite|marketplace|tool|stack|technology|saas|app/.test(l)) return Boxes;
  return Target;
}

/**
 * The problem, as an infographic.
 *
 * The left half is the problem's shape: separate boxes with gaps between them,
 * one per concern the approach went on to address. The right half is the answer:
 * a single continuous bar. The counts under each side are real — the number of
 * concerns comes from the length of the approach list, so the diagram can never
 * drift from the case study it illustrates.
 */
function ProblemDiagram({ project }: { project: Project }) {
  const concerns = project.approach.length;
  const accent = project.palette.accent;

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-4" aria-hidden>
      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-smoke">Before · disconnected</p>
        <div className="flex h-3 items-stretch gap-1.5">
          {Array.from({ length: concerns }, (_, i) => (
            <span
              key={i}
              className="flex-1 rounded-[3px]"
              style={{ background: `linear-gradient(180deg, ${accent}55, ${accent}22)`, transform: `translateY(${i % 2 ? 1.5 : -1.5}px)` }}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-mist">{concerns} separate concerns, no shared spine</p>
      </div>

      <div className="hidden items-center justify-center sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/15" style={{ background: `${accent}1a` }}>
          <span className="text-sm" style={{ color: accent }}>→</span>
        </span>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-smoke">After · one approach</p>
        <div className="h-3 overflow-hidden rounded-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}66)` }} />
        <p className="mt-2 text-[11px] text-mist">a single spine: {project.approach.length} steps, one direction</p>
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onClose, onSwitch }: { project: Project; onClose: () => void; onSwitch: (p: Project) => void }) {
  useScrollLock(true);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  /**
   * The board open full-screen, if any. One piece of state for both galleries:
   * a viewer holds its own list so previous/next work identically for the screens
   * and for the hand-drawn flows.
   */
  const [viewer, setViewer] = useState<{ boards: Board[]; index: number; kicker: string } | null>(null);
  useFocusTrap(panel);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    setViewer(null);
  }, [project.id]);

  const more = projects.filter((p) => p.id !== project.id);
  const detail = originalDetails[project.id];

  return (
    <motion.div ref={panel} className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-labelledby={`title-${project.id}-modal`}>
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={onClose}>
        <motion.div
          className="relative mx-auto min-h-full max-w-5xl bg-ink-2 shadow-2xl sm:my-10 sm:min-h-0 sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
        >
          {/* billboard */}
          <div className="relative h-[52vh] min-h-[340px] overflow-hidden sm:rounded-t-2xl">
            <motion.div layoutId={`art-${project.id}`} className="absolute inset-0" transition={{ duration: 0.7, ease: EASE }}>
              <ProjectArt project={project} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              data-cursor="close"
              aria-label="Close project"
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-lg text-bone backdrop-blur transition hover:bg-black"
            >
              ✕
            </button>
            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10">
              <motion.p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.34em] text-bone/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="font-display text-xl tracking-normal text-crimson-2">A</span> ORIGINAL
              </motion.p>
              <motion.h2
                id={`title-${project.id}-modal`}
                layoutId={`title-${project.id}`}
                className="font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.86] tracking-wide text-bone"
                transition={{ duration: 0.7, ease: EASE }}
              >
                {project.title}
              </motion.h2>
            </div>
          </div>

          <motion.div className="px-5 pb-12 sm:px-10" initial="hidden" animate="show" transition={{ staggerChildren: 0.08, delayChildren: 0.25 }}>
            <motion.div variants={block} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist">
              <span className="font-semibold text-[#46e3a8]">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>{project.genre}</span>
            </motion.div>

            <motion.p variants={block} className="mt-4 max-w-3xl text-lg leading-relaxed text-bone sm:text-xl">
              {project.logline}
            </motion.p>

            {/* at a glance — who it was for and what part of it was mine */}
            <motion.dl
              variants={block}
              className="mt-6 grid gap-px overflow-hidden rounded-xl bg-white/10 text-sm sm:grid-cols-2"
            >
              <div className="bg-ink-3 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-smoke">Client / Domain</dt>
                <dd className="mt-1.5 leading-relaxed text-bone">{project.client}</dd>
              </div>
              <div className="bg-ink-3 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-smoke">My Role</dt>
                <dd className="mt-1.5 leading-relaxed text-bone">{project.role}</dd>
              </div>
            </motion.dl>

            <motion.div variants={block} className="mt-6 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="flex min-h-12 items-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
                >
                  Discuss this work ↗
                </a>
              </Magnetic>
            </motion.div>

            {/* impact */}
            <motion.section variants={block} className="mt-12">
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Result / Impact</h3>
              {/* lg:grid-cols-4, not 5 — every project carries exactly 4 metrics, so a 5th
                  column left a dead empty cell at desktop. 2 → 4 keeps each row full. */}
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4">
                {project.metrics.map((m, i) => {
                  const Icon = metricIcon(m.label);
                  return (
                    <motion.div
                      key={m.label}
                      className="group/tile relative bg-ink p-4 sm:p-5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: EASE }}
                    >
                      <span
                        className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{ background: `${project.palette.accent}1f`, boxShadow: `inset 0 0 0 1px ${project.palette.accent}40` }}
                      >
                        <Icon size={16} strokeWidth={1.7} style={{ color: project.palette.accent }} aria-hidden />
                      </span>
                      <p className="font-display text-3xl leading-none text-bone sm:text-4xl">{m.value}</p>
                      <p className="mt-2 text-xs leading-snug text-mist">{m.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* visual design — the shipped screens, before any of the writing, because
                the work is the argument. Only Originals that supplied real screens
                have this section; the rest keep the drawn reconstructions below. */}
            {detail?.visualDesign && detail.visualDesign.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Visual Design</h3>
                <p className="mb-6 max-w-3xl text-xs leading-relaxed text-smoke">
                  The {detail.visualDesign.length} screens that carry the journey, from first sign-in to disbursement
                  confirmation. Shown as designed — open any screen full screen to read it. Applicant names, amounts
                  and reference numbers on the screens are sample data.
                </p>
                <BoardGallery
                  boards={detail.visualDesign}
                  columns={1}
                  onOpen={(i) => setViewer({ boards: detail.visualDesign!, index: i, kicker: 'Screen' })}
                />
              </motion.section>
            )}

            {/* the case study — problem, approach, outcome */}
            <motion.section variants={block} className="mt-12">
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">The Problem</h3>
              <div
                className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
                style={{
                  background: `linear-gradient(150deg, ${project.palette.from}, ${project.palette.to} 70%)`,
                  boxShadow: `inset 0 0 0 1px ${project.palette.accent}33`,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-6 -top-8 font-serif text-[9rem] leading-none opacity-[0.14]"
                  style={{ color: project.palette.accent }}
                >
                  “
                </span>
                <p className="relative max-w-3xl font-serif text-[clamp(1.15rem,2.1vw,1.55rem)] italic leading-[1.4] text-bone">
                  {project.problem}
                </p>
                <ProblemDiagram project={project} />
              </div>
            </motion.section>

            <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
              <motion.section variants={block}>
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">What I Did</h3>
                {/* A numbered process timeline: the connector line threads the steps together so
                    the work reads as a sequence, not a bullet pile. The last step drops its line. */}
                <ol className="relative space-y-5">
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-2 bottom-2 w-px"
                    style={{ background: `linear-gradient(${project.palette.accent}66, ${project.palette.accent}22)` }}
                  />
                  {project.approach.map((b, i) => (
                    <li key={b} className="relative flex gap-4">
                      <span
                        className="relative z-[1] mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full font-display text-[13px] tabular-nums"
                        style={{ background: `${project.palette.accent}1f`, color: project.palette.accent, boxShadow: `inset 0 0 0 1px ${project.palette.accent}55` }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="pt-1 text-[15px] leading-relaxed text-bone/85">{b}</span>
                    </li>
                  ))}
                </ol>
              </motion.section>
              <div className="space-y-10">
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Methods & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <span key={t} className="glass rounded-full px-3 py-1.5 text-sm font-medium text-bone">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.section>
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Highlights</h3>
                  <ul className="space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-bone/85">
                        <span className="text-crimson-2">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </div>
            </div>

            {/* product mockups — drawn screens inside device frames, for the Originals
                that have no real screens to show */}
            {detail?.screens && detail.screens.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Product Mockups</h3>
                <p className="mb-6 text-xs text-smoke">
                  Drawn reconstructions, framed as the devices they ran on — stylised renderings of the interface
                  families this case study describes, not photographs of a shipping product.
                </p>
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
                  <DeviceMock kind={detail.screens[0].kind} accent={project.palette.accent} title={detail.screens[0].title} device="laptop" />
                  {detail.screens[1] && (
                    <DeviceMock
                      kind={detail.screens[1].kind}
                      accent={project.palette.accent}
                      title={detail.screens[1].title}
                      device="phone"
                    />
                  )}
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
                  <figcaption className="text-[13px] leading-snug text-mist">
                    <span className="font-semibold text-bone">{detail.screens[0].title}</span> — {detail.screens[0].caption}
                  </figcaption>
                  {detail.screens[1] && (
                    <figcaption className="text-[13px] leading-snug text-mist">
                      <span className="font-semibold text-bone">{detail.screens[1].title}</span> — {detail.screens[1].caption}
                    </figcaption>
                  )}
                </div>
              </motion.section>
            )}

            {/* product screens — vector reconstructions of the interface families */}
            {detail?.screens && detail.screens.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Product Screens</h3>
                <p className="mb-5 text-xs text-smoke">
                  Vector reconstructions — stylised drawings of the interface families this work described, rendered in the platform&apos;s own palette, not screenshots of shipping products.
                </p>
                {/* Full width, one per row: these are the surfaces the case study is
                    about, so they get the width to be read rather than three-up
                    thumbnails. */}
                <div className="grid gap-8">
                  {detail.screens.map((s, i) => (
                    <ShowcaseItem key={s.title} index={i} label={<><span className="font-semibold text-bone">{s.title}</span> — {s.caption}</>}>
                      <ScreenMock kind={s.kind} accent={project.palette.accent} title={s.title} />
                    </ShowcaseItem>
                  ))}
                </div>
              </motion.section>
            )}

            {/* wireframes — the lo-fi artifacts behind the screens */}
            {detail?.wireframes && detail.wireframes.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Wireframes & Flows</h3>
                <p className="mb-5 text-xs text-smoke">The lo-fi work behind the UI — flows, architecture and layout studies, redrawn as diagrams.</p>
                {/* Two-up, not four-up: a flow diagram at a quarter of the width was
                    unreadable, and these are the artifacts that explain the thinking. */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {detail.wireframes.map((w, i) => (
                    <ShowcaseItem key={w.title} index={i} label={<><span className="font-semibold text-bone">{w.title}</span> — {w.caption}</>}>
                      <WireframeMock kind={w.kind} title={w.title} />
                    </ShowcaseItem>
                  ))}
                </div>
              </motion.section>
            )}

            {/* the flow boards — the hand-drawn artifacts, photographed */}
            {detail?.flows && detail.flows.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">User Flows · Hand-Drawn</h3>
                <p className="mb-6 max-w-3xl text-xs leading-relaxed text-smoke">
                  {detail.flows.length} boards from the journey mapping — the loan application drawn end to end, then
                  again from the borrower&apos;s side, at screen-by-screen depth, with the clarification and rejection
                  rails pulled out. Photographed as drawn; open any board full screen to read the writing on it. The
                  figures on the boards are the illustrative ones pencilled in during the exercise, not borrower data.
                </p>
                <BoardGallery
                  boards={detail.flows}
                  onOpen={(i) => setViewer({ boards: detail.flows!, index: i, kicker: 'Hand-drawn flow' })}
                />
              </motion.section>
            )}

            {/* deliverables — the tangible outputs */}
            {detail && detail.deliverables.length > 0 && (
              <motion.section variants={block} className="mt-14">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Deliverables</h3>
                <ul className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2">
                  {detail.deliverables.map((d, i) => (
                    <li
                      key={d}
                      className={`flex items-start gap-3 bg-ink-3 p-4 text-sm leading-relaxed text-bone/85 ${
                        detail.deliverables.length % 2 === 1 && i === detail.deliverables.length - 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: `${project.palette.accent}22`, color: project.palette.accent }}>
                        ▸
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* outcome — the closing statement, tinted with the project's own accent */}
            <motion.section
              variants={block}
              className="mt-12 rounded-xl border p-5 sm:p-7"
              style={{ borderColor: `${project.palette.accent}40`, background: `linear-gradient(135deg, ${project.palette.from}, transparent)` }}
            >
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: project.palette.accent }}>
                Outcome
              </h3>
              <p className="max-w-3xl text-[15px] leading-relaxed text-bone sm:text-base">{project.outcome}</p>
            </motion.section>

            {/* Every image on this page is labelled: what it is, and what it shows.
                The disclosure sits last, once the work has been seen. */}
            <motion.figure variants={block} className="mt-12 rounded-xl border border-white/10 bg-ink-3 p-4">
              <figcaption className="text-[10px] font-bold uppercase tracking-[0.24em] text-smoke">
                Key art · vector illustration
              </figcaption>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-bone/80">
                {detail?.keyArt ??
                  `The poster at the top of this page is drawn from ${project.title}’s own palette and subject matter rather than a stock photograph.`}
              </p>
            </motion.figure>

            {/* more like this */}
            <motion.section variants={block} className="mt-14 border-t border-white/10 pt-8">
              <h3 className="mb-4 font-sans text-lg font-semibold text-bone">More Originals</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {more.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-cursor="view"
                    onClick={() => onSwitch(p)}
                    className="group relative aspect-video overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition hover:ring-white/30"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <ProjectArt project={p} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mist">{p.genre}</p>
                      <p className="font-display text-3xl leading-none tracking-wide text-bone">{p.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>

      {/* The board viewer sits on the dialog itself rather than inside the scroller,
          so it is fixed to the viewport however far down the case study has scrolled. */}
      {viewer && (
        <BoardLightbox
          boards={viewer.boards}
          index={viewer.index}
          kicker={viewer.kicker}
          onClose={() => setViewer(null)}
          onNav={(index) => setViewer({ ...viewer, index })}
        />
      )}
    </motion.div>
  );
}
