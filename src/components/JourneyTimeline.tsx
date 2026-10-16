import { experience, seasons } from '../data/portfolio';

/**
 * The career spine — and the *only* season selector.
 *
 * What this replaced: equal-width cards whose company names were clipped and then
 * recovered through hover tooltips, a second row of year labels under them that
 * had to mirror the cards' flex maths exactly or drift off their columns, and a
 * separate row of season pills above the panel that duplicated the same seven
 * choices. Three controls for one decision, and the labels under the cards were
 * an axis nobody read.
 *
 * The rules now:
 *   • One selector. Clicking a season here is how you change the panel below.
 *   • Names are never hidden. Cards wrap the company name instead of truncating
 *     it, which is what made the tooltips necessary in the first place.
 *   • The period line carries the years, so there is no separate year axis.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toMonth(stamp: string) {
  const [mon, year] = stamp.trim().split(/\s+/);
  return Number(year) * 12 + MONTHS.indexOf(mon);
}

const CHRONO = [...experience]
  .reverse()
  .map((x, j) => {
    const i = experience.length - 1 - j;
    const [from, to] = x.period.split('–').map((s) => s.trim());
    const season = seasons.length - 2 - i;
    return {
      key: x.company,
      company: x.company,
      role: x.role,
      period: x.period,
      season,
      accent: seasons[season]?.episodes[0]?.palette.accent ?? '#e5132b',
      months: Math.max(1, toMonth(to) - toMonth(from)),
    };
  });

const NEXT_SEASON = seasons.length - 1;

/** Every card gets the same share of the row; content wraps rather than clips. */
const equal = { flex: '1 1 0' } as const;

/** The season's duration, phrased the way a person would say it. */
function tenure(months: number) {
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y} yr ${m} mo` : `${y} yr`;
}

export default function JourneyTimeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <div className="gutter mb-8" aria-label="Career timeline">
      {/* ── desktop: one row of seasons ───────────────────────────── */}
      <div className="hidden md:flex md:items-stretch md:gap-2">
        {CHRONO.map((s) => {
          const selected = active === s.season;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.season)}
              aria-pressed={selected}
              style={selected ? { background: `linear-gradient(165deg, ${s.accent}2e, transparent 78%)` } : undefined}
              className={`group relative min-w-0 rounded-lg px-3 py-2.5 text-left ring-1 transition duration-300 ${
                selected ? 'ring-white/40' : 'ring-white/10 hover:bg-white/[0.03] hover:ring-white/25'
              }`}
            >
              {/* The accent rule doubles as the selection indicator, so the card does
                  not need a second colour treatment to read as active. */}
              <span
                aria-hidden
                className="absolute inset-y-2.5 left-0 w-[3px] rounded-full transition-opacity duration-300"
                style={{ background: s.accent, opacity: selected ? 1 : 0.35 }}
              />
              <span className="block pl-2 text-[10px] font-bold tracking-[0.2em]" style={{ color: s.accent }}>
                S{String(s.season + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block pl-2 text-[12px] font-semibold leading-snug text-bone">{s.company}</span>
              <span className="mt-1 block pl-2 text-[10px] leading-snug text-smoke">
                {s.period} · {tenure(s.months)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onSelect(NEXT_SEASON)}
          aria-pressed={active === NEXT_SEASON}
          style={equal}
          className={`relative min-w-0 rounded-lg border border-dashed px-3 py-2.5 text-left transition duration-300 ${
            active === NEXT_SEASON ? 'border-crimson-2/80 bg-crimson/10' : 'border-white/20 hover:border-white/40'
          }`}
        >
          <span className="block text-[10px] font-bold tracking-[0.2em] text-crimson-2">S{String(NEXT_SEASON + 1).padStart(2, '0')}</span>
          <span className="mt-1 block text-[12px] font-semibold leading-snug text-bone">What&apos;s Next</span>
          <span className="mt-1 block text-[10px] leading-snug text-smoke">The open chapter</span>
        </button>
      </div>

      {/* ── touch: the same seasons as a list ─────────────────────── */}
      <ol className="space-y-1.5 md:hidden">
        {CHRONO.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => onSelect(s.season)}
              aria-pressed={active === s.season}
              className={`w-full rounded-lg px-3 py-2 text-left ring-1 transition ${
                active === s.season ? 'bg-white/[0.07] ring-white/30' : 'ring-white/10'
              }`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-semibold text-bone">{s.company}</span>
                <span className="shrink-0 text-[10px] font-bold tracking-[0.18em]" style={{ color: s.accent }}>
                  S{String(s.season + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="mt-0.5 flex flex-wrap items-baseline gap-1.5 text-[11px] text-mist">
                <span>{s.role}</span>
                <span className="text-smoke">·</span>
                <span>{tenure(s.months)}</span>
              </span>
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => onSelect(NEXT_SEASON)}
            aria-pressed={active === NEXT_SEASON}
            className={`w-full rounded-lg border border-dashed px-3 py-2 text-left transition ${
              active === NEXT_SEASON ? 'border-crimson-2/80 bg-crimson/10' : 'border-white/20'
            }`}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-semibold text-bone">What&apos;s Next</span>
              <span className="shrink-0 text-[10px] font-bold tracking-[0.18em] text-crimson-2">S{String(NEXT_SEASON + 1).padStart(2, '0')}</span>
            </span>
            <span className="mt-0.5 block text-[11px] text-mist">The open chapter</span>
          </button>
        </li>
      </ol>
    </div>
  );
}
