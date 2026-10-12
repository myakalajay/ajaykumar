import { useId, type ReactNode } from 'react';
import type { Motif as MotifName, Palette, Project } from '../data/portfolio';

/**
 * Generated "key art" for thumbnails — layered gradients, light falloff and a motif.
 * No stock imagery: every card is art-directed from its palette.
 */
export function PosterBackdrop({ palette, children, className = '' }: { palette: Palette; children?: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, ${palette.via} 0%, transparent 60%),
          radial-gradient(90% 80% at 0% 100%, ${palette.from} 0%, transparent 70%),
          linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[70%] rotate-[18deg] opacity-40 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)` }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />
      {children}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
    </div>
  );
}

/** The line-art illustration for each Original, drawn from that platform's own subject matter. */
function Motif({ motif, a }: { motif: MotifName; a: string }) {
  const stroke = { fill: 'none', stroke: a } as const;

  switch (motif) {
    /* Mortgage & lending — a home with an approval meter. */
    case 'lending':
      return (
        <g transform="translate(200 46)" {...stroke}>
          <path d="M6 62 L82 4 L158 62" strokeWidth="2.5" strokeOpacity="0.85" />
          <path d="M22 58 V144 H142 V58" strokeWidth="2" strokeOpacity="0.7" />
          <path d="M62 144 V100 H102 V144" strokeWidth="1.6" strokeOpacity="0.5" />
          <path d="M44 84 H86" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.35" />
          <path d="M44 100 H74" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25" />
          <path d="M22 174 H142" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.18" />
          <path d="M22 174 H104" strokeWidth="4" strokeLinecap="round" />
          <circle cx="104" cy="174" r="8" fill={a} fillOpacity="0.9" stroke="none" />
          <path d="M100.5 174.5 l2.5 3.5 l6 -8" stroke="#0b0710" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );

    /* Procurement & supplier diversity — vendor tiles with a rising spend chart. */
    case 'supplier':
      return (
        <g transform="translate(198 34)" {...stroke}>
          {[0, 1].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 80}
                y={r * 62}
                width="68"
                height="50"
                rx="9"
                strokeWidth="1.8"
                strokeOpacity={0.3 + (r + c) * 0.2}
              />
            )),
          )}
          <path d="M16 30 l8 9 l18 -24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" />
          <g transform="translate(0 152)">
            <path d="M0 60 h176" strokeWidth="2" strokeOpacity="0.4" />
            <rect x="12" y="30" width="22" height="30" rx="4" fill={a} fillOpacity="0.22" stroke="none" />
            <rect x="54" y="12" width="22" height="48" rx="4" fill={a} fillOpacity="0.38" stroke="none" />
            <rect x="96" y="0" width="22" height="60" rx="4" fill={a} fillOpacity="0.55" stroke="none" />
            <rect x="138" y="-26" width="22" height="86" rx="4" fill={a} fillOpacity="0.8" stroke="none" />
          </g>
        </g>
      );

    /* GovTech & citizen services — a civic building on stepped ground. */
    case 'civic':
      return (
        <g transform="translate(202 50)" {...stroke}>
          <path d="M0 52 L86 0 L172 52 Z" strokeWidth="2.5" strokeOpacity="0.85" />
          <path d="M0 52 H172" strokeWidth="2" strokeOpacity="0.6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${18 + i * 34} 68 V154`} strokeWidth="7" strokeOpacity="0.5" />
          ))}
          <path d="M0 170 H172" strokeWidth="3" strokeOpacity="0.5" />
          <path d="M-12 188 H184" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M0 206 H172" strokeWidth="3" strokeOpacity="0.18" />
        </g>
      );

    /* Broadcasting & media — a transmitter with radiating signal arcs. */
    case 'broadcast':
      return (
        <g transform="translate(232 44)" {...stroke}>
          <path d="M2 20 A50 50 0 0 1 102 20" strokeWidth="2" strokeOpacity="0.22" />
          <path d="M14 20 A38 38 0 0 1 90 20" strokeWidth="2" strokeOpacity="0.45" />
          <path d="M26 20 A26 26 0 0 1 78 20" strokeWidth="2" strokeOpacity="0.75" />
          <circle cx="52" cy="20" r="5" fill={a} fillOpacity="0.9" stroke="none" />
          <path d="M52 20 V168" strokeWidth="2.5" strokeOpacity="0.8" />
          <path d="M22 168 L52 82 L82 168" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M32 140 H72 M40 112 H64" strokeWidth="1.6" strokeOpacity="0.4" />
        </g>
      );

    /* Audience platforms — concentric audience rings over a segmentation chart. */
    case 'audience':
      return (
        <g transform="translate(210 34)" {...stroke}>
          <circle cx="80" cy="72" r="68" strokeWidth="1.5" strokeOpacity="0.2" />
          <circle cx="80" cy="72" r="46" strokeWidth="1.8" strokeOpacity="0.4" />
          <circle cx="80" cy="72" r="24" strokeWidth="2" strokeOpacity="0.65" />
          <circle cx="80" cy="72" r="8" fill={a} fillOpacity="0.85" stroke="none" />
          {[
            [80, 4],
            [148, 60],
            [80, 140],
            [12, 60],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill={a} fillOpacity="0.6" stroke="none" />
          ))}
          <g transform="translate(0 176)">
            <path d="M0 56 h160" strokeWidth="2" strokeOpacity="0.35" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={i * 27}
                y={[26, 34, 10, 20, 4, 16][i]}
                width="16"
                height={[30, 22, 46, 36, 52, 40][i]}
                rx="3"
                fill={a}
                fillOpacity={0.18 + i * 0.1}
                stroke="none"
              />
            ))}
          </g>
        </g>
      );

    /* Recruitment & communication products — candidate cards with a message thread. */
    case 'recruit':
      return (
        <g transform="translate(202 46)" {...stroke}>
          <rect x="0" y="0" width="72" height="86" rx="10" strokeWidth="2" strokeOpacity="0.8" />
          <circle cx="36" cy="30" r="13" strokeWidth="1.8" strokeOpacity="0.7" />
          <path d="M16 70 a20 20 0 0 1 40 0" strokeWidth="1.8" strokeOpacity="0.5" />
          <rect x="104" y="0" width="72" height="86" rx="10" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="140" cy="30" r="13" strokeWidth="1.8" strokeOpacity="0.35" />
          <path d="M120 70 a20 20 0 0 1 40 0" strokeWidth="1.8" strokeOpacity="0.3" />
          <path d="M80 44 H96" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="5 5" />
          <path d="M0 112 H176" strokeWidth="2" strokeOpacity="0.35" />
          <path d="M12 140 H108 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 H46 l-16 14 v-14 H12 a10 10 0 0 1 -10 -10 v-26 a10 10 0 0 1 10 -10 Z" strokeWidth="1.8" strokeOpacity="0.55" />
          <path d="M22 162 H82 M22 176 H60" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.3" />
        </g>
      );

    /* Precision engineering & CAD — a drafting grid with an exploded fastener. */
    case 'engineering':
      return (
        <g transform="translate(198 40)" {...stroke}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={`v${i}`} d={`M${i * 32} 0 V150`} strokeWidth="1" strokeOpacity="0.12" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`h${i}`} d={`M0 ${i * 32} H160`} strokeWidth="1" strokeOpacity="0.12" />
          ))}
          <circle cx="80" cy="52" r="30" strokeWidth="2" strokeOpacity="0.75" />
          <circle cx="80" cy="52" r="12" strokeWidth="2" strokeOpacity="0.5" />
          <path d="M80 22 V10 M80 82 V94 M50 52 H38 M110 52 H122" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.45" />
          <path d="M64 100 H96 V118 H64 Z" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M70 118 V138 M80 118 V138 M90 118 V138" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
          <circle cx="80" cy="52" r="4" fill={a} fillOpacity="0.9" stroke="none" />
          <path d="M8 150 H152" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25" />
        </g>
      );

    /* AI video intelligence — a camera frame with a scan beam over a detected box. */
    case 'vision':
      return (
        <g transform="translate(198 44)" {...stroke}>
          <path d="M0 24 H20 V12 H52 V24 H150 a12 12 0 0 1 12 12 V120 a12 12 0 0 1 -12 12 H12 a12 12 0 0 1 -12 -12 V36 a12 12 0 0 1 12 -12 Z" strokeWidth="2" strokeOpacity="0.7" />
          <path d="M0 60 H162 M0 96 H162" strokeWidth="1" strokeOpacity="0.18" />
          <path d="M54 24 V132 M108 24 V132" strokeWidth="1" strokeOpacity="0.18" />
          <rect x="60" y="52" width="46" height="52" rx="4" strokeWidth="2.5" strokeOpacity="0.9" />
          <circle cx="83" cy="66" r="7" fill={a} fillOpacity="0.85" stroke="none" />
          <path d="M70 92 a13 13 0 0 1 26 0" strokeWidth="2" strokeOpacity="0.6" />
          <path d="M14 40 H148" strokeWidth="3" strokeLinecap="round" stroke={a} strokeOpacity="0.9" />
          <circle cx="150" cy="40" r="5" fill={a} fillOpacity="0.9" stroke="none" />
        </g>
      );

    default:
      return null;
  }
}

export function ProjectArt({ project, className = '' }: { project: Project; className?: string }) {
  const a = project.palette.accent;
  // The same project art renders in several places at once (card, modal, "more like this"),
  // so the gradient needs a per-instance id to avoid duplicate DOM ids.
  const gradientId = `g-${project.id}-${useId().replace(/:/g, '')}`;
  return (
    <PosterBackdrop palette={project.palette} className={className}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a} stopOpacity="0.55" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="290" cy="120" r="130" fill={`url(#${gradientId})`} />
        <Motif motif={project.motif} a={a} />
      </svg>
    </PosterBackdrop>
  );
}

/**
 * The AM monogram — Ajay Myakala's initials drawn as one geometric mark.
 * Used alone (favicon, footer) or with the platform wordmark beside it.
 */
export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex aspect-square items-center justify-center rounded-md bg-white/[0.06] ring-1 ring-white/15 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-[68%] w-[68%]" aria-hidden>
        <g fill="none" stroke="#e5132b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 46 L20 19 L31 46" />
          <path d="M14 38 H26" />
          <path d="M36 46 V19 L44 32 L52 19 V46" />
        </g>
      </svg>
    </span>
  );
}

/** The mark + wordmark lockup used in the nav, hero and footer. */
export function SeriesMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram className="h-[1.5em] w-auto text-[0.9em]" />
      <span className="flex flex-col items-start leading-none">
        <span className="font-sans text-[0.62em] font-bold tracking-[0.34em] text-bone">SERIES</span>
        <span className="mt-[0.35em] font-sans text-[0.46em] font-semibold tracking-[0.2em] text-smoke">A MYAKALA ORIGINAL</span>
      </span>
    </span>
  );
}
