import { skillCategories } from '../data/portfolio';
import { skillIconFor } from '../data/skillIcons';
import { SectionHeading } from './fx';

/**
 * Capability Universe — the CV's skill map as a capability sheet.
 *
 * The previous attempt put a discipline rail down the left and then a board of
 * cards on the right, which meant every discipline was printed twice (once as a
 * nav item, once as a card header) and the same list had to be read in two
 * places. It was cluttered, it scrolled for seven screens, and the rail's
 * "active" state was the only thing it did.
 *
 * This is one pass instead: each discipline is a heading with its flagship
 * capability's icon, followed by that discipline's capabilities as compact
 * chips. Two columns on desktop, one on phones. Nothing is duplicated, nothing
 * is hidden behind a click, and the whole universe fits in about a screen and a
 * half.
 *
 * Reading order is deliberate: the icon identifies the discipline, the count
 * sets expectations, and the chips carry the CV's own vocabulary. The `Core`
 * marker is the only emphasis — it marks the capabilities the CV foregrounds.
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
            Every capability on the CV, grouped by discipline. {skillCategories.length} disciplines, one screen and a
            half — nothing hidden behind a click.
          </p>
        }
      />

      <div className="gutter grid gap-x-12 gap-y-9 lg:grid-cols-2">
        {skillCategories.map((cat) => {
          // The discipline wears its flagship capability's icon: the mapping is
          // the CV's own, so a group heading can never drift from its contents.
          const Icon = skillIconFor(cat.skills[0]?.name ?? '');

          return (
            <section key={cat.id} id={`category-${cat.id}`} aria-labelledby={`h-${cat.id}`} className="min-w-0">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-crimson/10 ring-1 ring-white/10">
                  {Icon ? (
                    <Icon size={17} strokeWidth={1.6} className="text-crimson-2" aria-hidden />
                  ) : (
                    <span className="font-display text-sm font-bold text-bone">{cat.id.slice(0, 2).toUpperCase()}</span>
                  )}
                </span>
                <h3 id={`h-${cat.id}`} className="font-display text-xl leading-none tracking-wide text-bone">
                  {cat.title}
                </h3>
                <span className="text-[10px] font-bold tabular-nums tracking-[0.18em] text-smoke">{cat.skills.length}</span>
                <span className="ml-auto hidden truncate text-[11px] text-mist sm:block">{cat.subtitle}</span>
              </div>

              <ul className="mt-3 flex list-none flex-wrap gap-1.5 p-0">
                {/* Separators instead of per-item pills keeps the group legible at a
                    glance; the pill is the *skill*, the comma is the list. */}
                {cat.skills.map((skill, i) => (
                  <li key={skill.name} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden className="text-white/15">·</span>}
                    <span className="flex items-center gap-1.5 text-[13px] leading-snug text-bone/80">
                      {skill.name}
                      {skill.note && (
                        <span className="rounded-full bg-crimson/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-crimson-2">
                          {skill.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
