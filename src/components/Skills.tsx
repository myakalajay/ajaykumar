import { skillCategories } from '../data/portfolio';
import { skillIconFor } from '../data/skillIcons';
import { SectionHeading } from './fx';

/**
 * My Capability Universe — deliberately plain.
 *
 * This section has now been three things: a rail beside a board of cards (the
 * same disciplines printed twice), a dense list of chips, and a bento grid with
 * accent washes, watermarks and a spectrum bar. All three were trying to make a
 * list look like a product surface. A capability map is reference material — it
 * should be quiet, scannable and complete.
 *
 * So: a two-column spec sheet. Each discipline is a heading with a small icon
 * and its count, followed by its capabilities as a single run of text. The only
 * emphasis is brightness — the capabilities the CV foregrounds read at full
 * strength, the rest sit a step back. No cards, no pills, no colour coding, no
 * interaction to discover.
 */
export default function Skills() {
  return (
    <>
      <SectionHeading
        kicker="Genres"
        title="My Capability Universe"
        script="every skill, staged"
        aside={
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            Every capability on the CV, grouped by discipline — the full list, nothing hidden behind a click.
          </p>
        }
      />

      <div className="gutter grid gap-x-16 gap-y-8 md:grid-cols-2">
        {skillCategories.map((cat) => {
          const Icon = skillIconFor(cat.skills[0]?.name ?? '');

          return (
            <section key={cat.id} id={`category-${cat.id}`} aria-labelledby={`h-${cat.id}`} className="min-w-0">
              <h3 id={`h-${cat.id}`} className="flex items-center gap-2 border-b border-white/10 pb-2 text-[15px] font-semibold text-bone">
                {Icon ? (
                  <Icon size={15} strokeWidth={1.6} className="shrink-0 text-crimson-2" aria-hidden />
                ) : (
                  <span aria-hidden className="font-display text-[13px] tracking-wide text-crimson-2">
                    {cat.id.slice(0, 2).toUpperCase()}
                  </span>
                )}
                {cat.title}
                <span className="ml-auto text-[11px] font-normal tabular-nums tracking-wider text-smoke">{cat.skills.length}</span>
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-mist">
                {cat.skills.map((skill, i) => (
                  <span key={skill.name}>
                    {i > 0 && <span className="text-white/20"> · </span>}
                    <span className={skill.note ? 'text-bone' : undefined}>{skill.name}</span>
                  </span>
                ))}
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
}
