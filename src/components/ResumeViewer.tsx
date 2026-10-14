import { useState } from 'react';
import { motion } from 'framer-motion';
import { experience, industries, profile, productModels, projects, skillCategories, toolbox } from '../data/portfolio';
import { EASE, Magnetic, SectionHeading } from './fx';
import { printCv } from '../utils/print';

/** THE FULL STORY — a designed CV preview plus view / download actions. */
export default function ResumeSection({ onView }: { onView: () => void }) {
  const stats = [
    { v: profile.tenure.replace(' years', ''), k: 'Years' },
    { v: String(experience.length), k: 'Roles' },
    { v: String(industries.length), k: 'Industries' },
  ];

  return (
    <>
      <SectionHeading kicker="The screenplay" title="The Full Story" script="the whole story" />
      <div className="gutter grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ transformPerspective: 1600 }}
        >
          <CollapsibleSheet />
        </motion.div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-serif text-3xl italic leading-tight text-bone">Every episode, on one page.</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            {profile.tenure} across {experience.length} roles, {industries.length} industries, {projects.length} platforms and {toolbox.length} tools — view the CV
            here or take a copy with you.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Magnetic className="w-full">
              <button
                type="button"
                data-cursor="view"
                onClick={onView}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
              >
                ▶ View Resume
              </button>
            </Magnetic>
            <Magnetic className="w-full">
              <a
                href={profile.resumePdf}
                download={profile.resumeFile}
                data-cursor="link"
                className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
              >
                ⤓ Download CV
              </a>
            </Magnetic>
            <Magnetic className="w-full">
              <button
                type="button"
                onClick={printCv}
                data-cursor="view"
                className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
              >
                ⎙ Print CV
              </button>
            </Magnetic>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-smoke">
            “Print CV” typesets the sheet on its own, straight from the live data — the original PDF is one click away above.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 text-center">
            {stats.map((s) => (
              // <dt> must precede its <dd>; column-reverse keeps the value on top visually.
              <div key={s.k} className="flex flex-col-reverse bg-ink-2 px-2 py-4">
                <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">{s.k}</dt>
                <dd className="font-display text-3xl leading-none text-bone">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

/** On phones the sheet starts as a teaser so the page keeps its pace; desktop shows it in full. */
function CollapsibleSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className={`overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-cine)] md:max-h-none ${open ? 'max-h-[9000px]' : 'max-h-[560px]'}`}>
        <ResumeSheet />
      </div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-48 items-end justify-center rounded-b-2xl bg-gradient-to-t from-ink via-ink/85 to-transparent pb-4 md:hidden">
          <button type="button" onClick={() => setOpen(true)} className="glass min-h-11 rounded-full px-5 text-sm font-semibold text-bone">
            Read the full story ↓
          </button>
        </div>
      )}
    </div>
  );
}

function H({ children }: { children: string }) {
  return <h3 className="mb-3 mt-7 border-b border-white/10 pb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2 first:mt-0">{children}</h3>;
}

export function ResumeSheet() {
  const toolGroups = Array.from(new Set(toolbox.map((t) => t.group)));

  return (
    <article className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#121218,#0c0c11)] p-6 ring-1 ring-white/10 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/70 to-transparent" />
      {/* Stacked on phones: side-by-side put the ~430px role run underneath the contact
          block, where it overlapped "LinkedIn". Full width on its own line lets it wrap free. */}
      <header className="mb-8 flex flex-col items-start gap-5 border-b border-white/10 pb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        {/* This title block gets a real pixel floor and is excluded from flex-shrink: the role
            line is one long uppercase run (~430px). Letting it shrink made the line box collapse
            to 14px and the article's overflow-hidden clipped the tail of the title.
            The floor is scoped to sm+ (≥640px, where ~528px of room exists for the 416px floor):
            below that the floor itself exceeded the viewport, widened the sheet's min-content
            past the screen and the same overflow-hidden clipped every line in the sheet. */}
        <div className="min-w-0 grow basis-0 sm:min-w-[26rem] sm:shrink-0">
          <p className="text-[10px] font-bold tracking-[0.34em] text-smoke">STARRING</p>
          <h3 className="mt-1 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.9] tracking-wide text-bone">{profile.fullName}</h3>
          {/* max-w-sm (384px) not max-w-md: the role line is a single ~430px uppercase run. At
              max-w-md it fit on one line inside the cap, then overflowed the narrower flex item and
              the article's overflow-hidden clipped its tail. Capping below the available width forces
              a clean two-line wrap instead. */}
          <p className="mt-2 max-w-sm text-[11px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-crimson-2">{profile.role}</p>
        </div>
        <div className="text-xs leading-relaxed text-mist sm:text-right">
          <a href={`mailto:${profile.email}`} className="block hover:text-bone">
            {profile.email}
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="block hover:text-bone">
            {profile.phone}
          </a>
          <span className="block">{profile.location}</span>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-bone">
            LinkedIn ↗
          </a>
        </div>
      </header>

      <div className="grid gap-x-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <H>Profile</H>
          <p className="mb-4 text-xs leading-relaxed text-mist">{profile.intro}</p>

          <H>Work Experience</H>
          {experience.map((x) => (
            <div key={x.company} className="mb-5">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {x.company} — {x.role}
                </p>
                <p className="text-xs text-smoke">{x.period}</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {x.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-relaxed text-mist">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <H>Platforms</H>
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="text-xs text-smoke">{p.year}</p>
              </div>
              <p className="text-xs text-mist">{p.stack.join(', ')}</p>
            </div>
          ))}
        </div>

        <div>
          <H>Strategic Value</H>
          <ul className="mb-4 space-y-2">
            {profile.interests.map((s) => (
              <li key={s} className="flex gap-2 text-xs leading-relaxed text-mist">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
                {s}
              </li>
            ))}
          </ul>

          <H>Capabilities</H>
          <div className="space-y-2">
            {skillCategories
              .filter((c) => c.id !== 'domains' && c.id !== 'models' && c.id !== 'tools')
              .map((c) => (
                <p key={c.id} className="text-xs leading-relaxed text-mist">
                  <span className="font-semibold text-bone">{c.title}: </span>
                  {c.skills.map((s) => s.name).join(', ')}
                </p>
              ))}
          </div>

          <H>Domains & Models</H>
          <p className="text-xs leading-relaxed text-mist">
            <span className="font-semibold text-bone">Industry domains: </span>
            {industries.join(', ')}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-mist">
            <span className="font-semibold text-bone">Product models: </span>
            {productModels.join(', ')}
          </p>

          <H>Technical Fluency</H>
          {toolGroups.map((g) => (
            <p key={g} className="mb-2 text-xs leading-relaxed text-mist">
              <span className="font-semibold text-bone">{g}: </span>
              {toolbox
                .filter((t) => t.group === g)
                .map((t) => t.name)
                .join(', ')}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
