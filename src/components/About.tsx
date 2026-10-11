import { motion } from 'framer-motion';
import { careerArc, experience, industries, platformStreams, profile, projects, strategicValue } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px' },
  transition: { duration: 0.8, delay, ease: EASE },
});

export default function About() {
  const facts = [
    { k: 'Now', v: experience[0].role, s: `${experience[0].company} · ${experience[0].period}` },
    { k: 'Track record', v: profile.tenure, s: `${experience.length} roles · ${projects.length} platforms` },
    { k: 'Focus', v: 'Enterprise transformation', s: 'Problem framing · product strategy · AIX' },
    { k: 'Based in', v: profile.location, s: `${industries.length} industries · ${industries.slice(0, 3).join(', ')} +` },
  ];

  return (
    <>
      <SectionHeading
        kicker="The Pilot"
        title="About Me"
        aside={<p className="max-w-sm text-[13px] leading-relaxed text-mist">{profile.headline}</p>}
      />

      <div className="gutter grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        {/* ── poster ────────────────────────────────────────────────── */}
        <motion.div
          className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none lg:self-start"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Tilt max={5} className="rounded-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,#5a0b1b,#14060a_60%,#07070a)]" />
              <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_28px)]" />
              <img
                src={profile.portrait.src}
                srcSet={profile.portrait.srcSet}
                sizes="(max-width: 1024px) 90vw, 34vw"
                alt={profile.portrait.alt}
                loading="lazy"
                className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-crimson-2">STARRING</p>
                  <p className="font-display text-3xl leading-none text-bone">{profile.displayName}</p>
                </div>
                <span className="rounded border border-white/30 px-1.5 text-[10px] font-bold text-bone">
                  S01–S{String(experience.length + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </Tilt>
          <p className="mt-3 text-[11px] leading-relaxed text-smoke">
            {profile.role} · {profile.location}
          </p>
        </motion.div>

        {/* ── story ─────────────────────────────────────────────────── */}
        <div>
          <motion.blockquote className="border-l-2 border-crimson/60 pl-5" {...rise()}>
            <p className="font-serif text-[clamp(1.4rem,2.4vw,2.05rem)] italic leading-[1.25] text-bone">
              “Career progression from UX/UI craft into product discovery, business problem framing, workflow transformation, solution
              strategy and cross-functional influence.”
            </p>
            <footer className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-smoke">
              Executive summary · {profile.fullName}
            </footer>
          </motion.blockquote>

          {/* career arc */}
          <motion.div className="mt-10" {...rise(0.05)}>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-smoke">The arc</h3>
            <ol className="relative border-l border-white/15 pl-6">
              {careerArc.map((stage, i) => (
                <li key={stage} className="relative pb-4 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[calc(1.5rem+5px)] top-[7px] h-2.5 w-2.5 rounded-full bg-crimson-2 ring-4 ring-ink"
                    style={{ opacity: 0.45 + (i / (careerArc.length - 1)) * 0.55 }}
                  />
                  <p className="text-sm font-semibold text-bone">{stage}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* facts */}
          <motion.dl
            className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.07 }}
          >
            {facts.map((f) => (
              <motion.div
                key={f.k}
                className="bg-ink-2 p-5"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">{f.k}</dt>
                <dd className="mt-2 text-base font-semibold text-bone">{f.v}</dd>
                <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* what I actually do — the CV's five statements, verbatim */}
          <motion.div className="mt-12" {...rise(0.05)}>
            <h3 className="mb-1 font-sans text-lg font-semibold text-bone sm:text-2xl">What I do</h3>
            <p className="mb-5 text-xs text-smoke">The CV's five value statements, word for word.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {strategicValue.map((v, i) => (
                <motion.article
                  key={v.title}
                  className="group relative overflow-hidden rounded-xl bg-ink-2 p-5 ring-1 ring-white/10 transition duration-500 hover:ring-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-6% 0px' }}
                  transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.06, ease: EASE }}
                >
                  <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-crimson/25 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
                  <p className="relative text-[10px] font-bold tracking-[0.28em] text-crimson-2">{String(i + 1).padStart(2, '0')}</p>
                  <h4 className="relative mt-2 font-display text-2xl leading-tight tracking-wide text-bone">{v.title}</h4>
                  <p className="relative mt-2 text-[13px] leading-relaxed text-mist">{v.detail}</p>
                </motion.article>
              ))}

              <motion.article
                className="rounded-xl border border-dashed border-white/15 p-5 sm:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-6% 0px' }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              >
                <p className="text-[10px] font-bold tracking-[0.28em] text-smoke">Platform streams</p>
                <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 text-[13px] text-mist">
                  {platformStreams.map((p, i) => (
                    <span key={p} className="whitespace-nowrap">
                      {p}
                      {i < platformStreams.length - 1 && <span aria-hidden className="ml-2 text-smoke">·</span>}
                    </span>
                  ))}
                </p>
              </motion.article>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
