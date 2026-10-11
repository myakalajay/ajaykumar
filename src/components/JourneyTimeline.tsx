import { experience, seasons } from '../data/portfolio';

/**
 * The career spine: every role on the CV drawn to scale, so a decade reads at a
 * glance. Clicking a span selects that season, and the widths are the real dates —
 * nothing here is decorative. Mobile gets the same data as a readable list.
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

const START = CHRONO[0].start;
const LAST = CHRONO[CHRONO.length - 1].end;
const TAIL = 8; // the open "next chapter" slot, in months
const DOMAIN = LAST + TAIL - START;
const NEXT_SEASON = seasons.length - 1;

const span = (from: number, to: number) => ({
  flexGrow: to - from,
  flexBasis: 0,
});

export default function JourneyTimeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const firstYear = Math.ceil(START / 12);
  const lastYear = Math.floor(LAST / 12);
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);

  return (
    <div className="gutter mb-9" aria-label="Career timeline">
      {/* ── desktop: a band drawn to scale ─────────────────────────── */}
      <div className="hidden md:block">
        <div className="flex items-stretch gap-1">
          {CHRONO.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.season)}
              aria-pressed={active === s.season}
              title={`${s.company} — ${s.role} (${s.period})`}
              style={{ ...span(s.start, s.end), background: `linear-gradient(165deg, ${s.accent}26, transparent 72%)` }}
              /* padding lives on the inner spans, not the button: with border-box,
                 a padded button floors its flex base at the padding (20px) and the
                 band then distributes space differently from the axis row below,
                 drifting the year ticks off their cards. */
              className={`group relative min-w-[58px] rounded-lg py-2 text-left ring-1 transition duration-300 ${
                active === s.season ? 'ring-white/40' : 'ring-white/10 hover:ring-white/25'
              }`}
            >
              <span className="block px-2.5 text-[10px] font-bold tracking-[0.2em]" style={{ color: s.accent }}>
                S{String(s.season + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block truncate px-2.5 text-[11px] font-semibold text-bone">{s.company}</span>
              <span className="block truncate px-2.5 text-[10px] text-smoke">{s.period}</span>
              {/* The to-scale box is too narrow for long company names and has a
                  transparent background, so an overflowing name would just paint over
                  its neighbour. Instead the full name lives in an opaque popover that
                  clears the band. It reveals on hover, on keyboard focus, and stays
                  pinned while the card is the selected one — so a clipped name is
                  always recoverable, by mouse, keyboard or tap. */}
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-3 px-2.5 py-1.5 text-[11px] font-semibold text-bone shadow-[0_8px_24px_rgba(0,0,0,0.55)] ring-1 ring-white/15 group-hover:block group-focus-visible:block group-aria-pressed:block"
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
            style={span(LAST, LAST + TAIL)}
            className={`group relative min-w-[70px] rounded-lg border border-dashed py-2 text-left transition duration-300 ${
              active === NEXT_SEASON ? 'border-crimson-2/80 bg-crimson/10' : 'border-white/20 hover:border-white/40'
            }`}
          >
            <span className="block px-2.5 text-[10px] font-bold tracking-[0.2em] text-crimson-2">S{String(NEXT_SEASON + 1).padStart(2, '0')}</span>
            <span className="mt-1 block truncate px-2.5 text-[11px] font-semibold text-bone">What&apos;s Next</span>
            <span className="block truncate px-2.5 text-[10px] text-smoke">Open</span>
            {/* Same popover as the dated spans, so the open chapter reads the same way
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

        {/* year axis — mirrors the card row's flex layout (same flex values,
            same min-widths, same gaps) so each tick lands inside its own span
            instead of drifting off the cards as the row redistributes space. */}
        <div className="mt-2 flex items-start gap-1" aria-hidden>
          {CHRONO.map((s) => (
            <div key={s.key} className="relative h-4 min-w-[58px]" style={span(s.start, s.end)}>
              {years
                .filter((y) => y * 12 >= s.start && y * 12 < s.end)
                .map((y) => (
                  <span
                    key={y}
                    className="absolute top-0 -translate-x-1/2 text-[10px] font-semibold tracking-[0.16em] text-smoke"
                    style={{ left: `${(((y * 12) - s.start) / (s.end - s.start)) * 100}%` }}
                  >
                    {y}
                  </span>
                ))}
            </div>
          ))}
          <div className="relative h-4 min-w-[70px]" style={span(LAST, LAST + TAIL)}>
            {years
              .filter((y) => y * 12 >= LAST && y * 12 < LAST + TAIL)
              .map((y) => (
                <span
                  key={y}
                  className="absolute top-0 -translate-x-1/2 text-[10px] font-semibold tracking-[0.16em] text-smoke"
                  style={{ left: `${(((y * 12) - LAST) / TAIL) * 100}%` }}
                >
                  {y}
                </span>
              ))}
          </div>
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
              <span className="mt-0.5 block truncate text-[11px] text-mist">
                {s.role} · {s.period}
              </span>
              <span className="mt-2 block h-1 w-full overflow-hidden rounded bg-white/10">
                <span className="block h-full rounded" style={{ width: `${(s.months / DOMAIN) * 100}%`, background: s.accent }} />
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
