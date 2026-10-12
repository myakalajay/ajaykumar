import { experience, seasons } from '../data/portfolio';

/**
 * The career spine: every role on the CV as an equal-width card, so no company name
 * is starved or truncated just because its tenure was short. Duration still reads —
 * it lives in the meta line under each card and in the tenure text on touch — but the
 * cards themselves share the row evenly. Mobile gets the same data as a readable list.
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
    const start = toMonth(from);
    const end = toMonth(to);
    const season = seasons.length - 2 - i;
    return {
      key: x.company,
      company: x.company,
      role: x.role,
      period: x.period,
      season,
      accent: seasons[season]?.episodes[0]?.palette.accent ?? '#e5132b',
      months: Math.max(1, end - start),
      start,
      end,
    };
  });

const NEXT_SEASON = seasons.length - 1;

/** Every card is the same size now, so both rows just divide the space evenly. */
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
    <div className="gutter mb-9" aria-label="Career timeline">
      {/* ── desktop: equal-width cards ────────────────────────────── */}
      <div className="hidden md:block">
        <div className="flex items-stretch gap-2">
          {CHRONO.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.season)}
              aria-pressed={active === s.season}
              title={`${s.company} — ${s.role} (${s.period})`}
              style={{ ...equal, background: `linear-gradient(165deg, ${s.accent}26, transparent 72%)` }}
              /* padding lives on the inner spans, not the button: with border-box,
                 a padded button floors its flex base at the padding and the band then
                 distributes space differently from the axis row below, drifting the
                 year labels off their cards. min-w-0 lets truncate actually clamp. */
              className={`group relative min-w-0 rounded-lg py-2.5 text-left ring-1 transition duration-300 ${
                active === s.season ? 'ring-white/40' : 'ring-white/10 hover:ring-white/25'
              }`}
            >
              <span className="block px-3 text-[10px] font-bold tracking-[0.2em]" style={{ color: s.accent }}>
                S{String(s.season + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block truncate px-3 text-[12px] font-semibold text-bone">{s.company}</span>
              <span className="mt-0.5 block truncate px-3 text-[10px] text-smoke">
                {s.period} · {tenure(s.months)}
              </span>
              {/* With equal widths a long name still may not fit, and the card has a
                  transparent background, so an overflowing name would just paint over
                  its neighbour. The full name lives in an opaque popover that clears
                  the band. It reveals on hover, on keyboard focus, and stays pinned while
                  the card is the selected one — so a clipped name is always recoverable. */}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden max-w-[80vw] -translate-x-1/2 truncate rounded-md bg-ink-3 px-2.5 py-1.5 text-[11px] font-semibold text-bone shadow-[0_8px_24px_rgba(0,0,0,0.55)] ring-1 ring-white/15 group-hover:block group-focus-visible:block group-aria-pressed:block"
              >
                {s.company}
                <span className="ml-1.5 font-normal text-smoke">{s.period}</span>
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => onSelect(NEXT_SEASON)}
            aria-pressed={active === NEXT_SEASON}
            title="What's Next — the open chapter"
            style={equal}
            className={`group relative min-w-0 rounded-lg border border-dashed py-2.5 text-left transition duration-300 ${
              active === NEXT_SEASON ? 'border-crimson-2/80 bg-crimson/10' : 'border-white/20 hover:border-white/40'
            }`}
          >
            <span className="block px-3 text-[10px] font-bold tracking-[0.2em] text-crimson-2">S{String(NEXT_SEASON + 1).padStart(2, '0')}</span>
            <span className="mt-1 block truncate px-3 text-[12px] font-semibold text-bone">What&apos;s Next</span>
            <span className="mt-0.5 block truncate px-3 text-[10px] text-smoke">Open</span>
            {/* Same popover as the dated cards, so the open chapter reads the same way
                on hover / focus / selection instead of silently losing the affordance. */}
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-3 px-2.5 py-1.5 text-[11px] font-semibold text-bone shadow-[0_8px_24px_rgba(0,0,0,0.55)] ring-1 ring-white/15 group-hover:block group-focus-visible:block group-aria-pressed:block"
            >
              What&apos;s Next
              <span className="ml-1.5 font-normal text-smoke">Open</span>
            </span>
          </button>
        </div>

        {/* Year axis — mirrors the card row exactly (same flex, same gap, same min-w-0)
            so each label stays centred under its own card. A card that spans a year
            boundary shows both years; one that doesn't shows the year it starts in. */}
        <div className="mt-2 flex items-start gap-2" aria-hidden>
          {CHRONO.map((s) => {
            const ticks = Array.from(
              new Set([Math.floor(s.start / 12), Math.floor((s.end - 1) / 12)]),
            );
            return (
              <div key={s.key} className="flex min-w-0 items-start justify-center gap-3" style={equal}>
                {ticks.map((y) => (
                  <span key={y} className="text-[10px] font-semibold tracking-[0.16em] text-smoke">
                    {y}
                  </span>
                ))}
              </div>
            );
          })}
          <div className="min-w-0" style={equal} />
        </div>
      </div>

      {/* ── touch: the same spans as a list ────────────────────────── */}
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
                <span className="truncate text-[13px] font-semibold text-bone">{s.company}</span>
                <span className="shrink-0 text-[10px] font-bold tracking-[0.18em]" style={{ color: s.accent }}>
                  S{String(s.season + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="mt-0.5 flex items-baseline gap-1.5 text-[11px] text-mist">
                <span className="truncate">{s.role}</span>
                <span className="shrink-0 text-smoke">·</span>
                <span className="shrink-0">{tenure(s.months)}</span>
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
              <span className="truncate text-[13px] font-semibold text-bone">What&apos;s Next</span>
              <span className="shrink-0 text-[10px] font-bold tracking-[0.18em] text-crimson-2">S{String(NEXT_SEASON + 1).padStart(2, '0')}</span>
            </span>
            <span className="mt-0.5 block text-[11px] text-mist">The open chapter</span>
          </button>
        </li>
      </ol>
    </div>
  );
}
