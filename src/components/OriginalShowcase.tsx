import { useId, type ReactNode } from 'react';
import type { ScreenKind, WireKind } from '../data/originalsExtras';
import { EASE } from './fx';
import { motion } from 'framer-motion';

/**
 * Vector reconstructions of the interface families each case study describes.
 * These are stylised UI mockups — not screenshots — drawn in the project's own
 * palette so every Original's gallery matches its poster art.
 */

const VIEW = '0 0 320 200';

function Chrome({ accent }: { accent: string }) {
  return (
    <g>
      <rect x="0" y="0" width="320" height="16" fill="rgba(255,255,255,0.05)" />
      <circle cx="10" cy="8" r="2.5" fill={accent} fillOpacity="0.9" />
      <circle cx="19" cy="8" r="2.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="28" cy="8" r="2.5" fill="rgba(255,255,255,0.25)" />
      <rect x="110" y="4" width="100" height="8" rx="4" fill="rgba(255,255,255,0.08)" />
    </g>
  );
}

function Bar({ x, y, w, h = 4, o = 0.18 }: { x: number; y: number; w: number; h?: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`rgba(255,255,255,${o})`} />;
}

function ScreenBody({ kind, a }: { kind: ScreenKind; a: string }) {
  switch (kind) {
    /* KPI command center: hero score, stat tiles, trend line. */
    case 'command':
      return (
        <g>
          <circle cx="58" cy="78" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
          <circle cx="58" cy="78" r="30" fill="none" stroke={a} strokeWidth="8" strokeDasharray="150 188" strokeLinecap="round" transform="rotate(-90 58 78)" />
          <text x="58" y="76" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">82</text>
          <text x="58" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6.5">HEALTH</text>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={104 + i * 68} y={52} width="60" height="40" rx="6" fill="rgba(255,255,255,0.06)" />
              <rect x={110 + i * 68} y={58} width="26" height="7" rx="3.5" fill={a} fillOpacity="0.8" />
              <Bar x={110 + i * 68} y={72} w={44} />
              <Bar x={110 + i * 68} y={82} w={30} o={0.12} />
            </g>
          ))}
          <rect x="104" y="102" width="196" height="64" rx="6" fill="rgba(255,255,255,0.05)" />
          <polyline points="112,152 140,138 168,144 196,124 224,130 252,112 284,118" fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="112,158 140,150 168,154 196,142 224,148 252,136 284,140" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="120" width="76" height="46" rx="6" fill="rgba(255,255,255,0.05)" />
          <rect x="22" y="126" width="34" height="6" rx="3" fill={a} fillOpacity="0.7" />
          <rect x="22" y="138" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.16)" />
          <rect x="22" y="148" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
          <rect x="22" y="158" width="58" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
        </g>
      );

    /* Sidebar dashboard: nav, chart area, data table. */
    case 'dashboard':
      return (
        <g>
          <rect x="0" y="16" width="58" height="184" fill="rgba(255,255,255,0.04)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x="10" y={30 + i * 18} width={i === 1 ? 38 : 30} height="6" rx="3" fill={i === 1 ? a : 'rgba(255,255,255,0.16)'} fillOpacity={i === 1 ? 0.9 : 1} />
            </g>
          ))}
          <rect x="70" y="26" width="110" height="9" rx="4" fill="rgba(255,255,255,0.22)" />
          <rect x="70" y="46" width="238" height="62" rx="6" fill="rgba(255,255,255,0.05)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const h = [22, 34, 28, 44, 38, 52, 46][i];
            return <rect key={i} x={82 + i * 30} y={98 - h} width="16" height={h} rx="3" fill={i === 5 ? a : 'rgba(255,255,255,0.14)'} fillOpacity={i === 5 ? 0.95 : 1} />;
          })}
          <rect x="70" y="118" width="238" height="68" rx="6" fill="rgba(255,255,255,0.05)" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx="84" cy={132 + i * 14} r="3.5" fill={i === 0 ? a : 'rgba(255,255,255,0.2)'} />
              <Bar x={96} y={129 + i * 14} w={70 + i * 24} />
              <Bar x={240} y={129 + i * 14} w={30} o={0.1} />
            </g>
          ))}
        </g>
      );

    /* Staged stepper with an approval rail. */
    case 'workflow':
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx={40 + i * 78} cy="46" r="11" fill={i < 2 ? a : 'rgba(255,255,255,0.1)'} fillOpacity={i < 2 ? 0.9 : 1} />
              {i < 2 && <path d={`M${36 + i * 78} 46 l3 3 l6 -6`} stroke="#0b0b0f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
              <Bar x={22 + i * 78} y={64} w={54} o={i < 2 ? 0.3 : 0.14} />
              {i < 3 && <path d={`M${52 + i * 78} 46 H${106 + i * 78}`} stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="4 4" />}
            </g>
          ))}
          <rect x="16" y="86" width="190" height="96" rx="6" fill="rgba(255,255,255,0.05)" />
          <Bar x={28} y={98} w={80} o={0.28} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="28" y={112 + i * 16} width="10" height="10" rx="2" fill={i < 3 ? a : 'none'} fillOpacity={i < 3 ? 0.8 : 1} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <Bar x={46} y={114 + i * 16} w={100 - i * 14} />
            </g>
          ))}
          <rect x="216" y="86" width="92" height="96" rx="6" fill="rgba(255,255,255,0.06)" />
          <rect x="226" y="96" width="48" height="7" rx="3.5" fill={a} fillOpacity="0.85" />
          <Bar x={226} y={112} w={72} />
          <Bar x={226} y={122} w={58} o={0.12} />
          <rect x="226" y="146" width="72" height="18" rx="9" fill={a} fillOpacity="0.9" />
          <rect x="242" y="153" width="40" height="4" rx="2" fill="#0b0b0f" fillOpacity="0.75" />
        </g>
      );

    /* Phone frame with a discovery feed. */
    case 'mobile':
      return (
        <g>
          <rect x="112" y="26" width="96" height="168" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <rect x="146" y="32" width="28" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          <rect x="122" y="44" width="76" height="8" rx="4" fill={a} fillOpacity="0.85" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="122" y={58 + i * 44} width="76" height="36" rx="6" fill="rgba(255,255,255,0.07)" />
              <rect x="126" y={62 + i * 44} width="28" height="28" rx="4" fill={i === 0 ? a : 'rgba(255,255,255,0.14)'} fillOpacity={i === 0 ? 0.5 : 1} />
              <Bar x={160} y={66 + i * 44} w={32} />
              <Bar x={160} y={76 + i * 44} w={24} o={0.12} />
              <Bar x={160} y={86 + i * 44} w={28} o={0.09} />
            </g>
          ))}
          <rect x="24" y="58" width="72" height="52" rx="6" fill="rgba(255,255,255,0.05)" />
          <Bar x={32} y={68} w={48} o={0.2} />
          <Bar x={32} y={80} w={36} />
          <Bar x={32} y={90} w={42} o={0.1} />
          <rect x="228" y="92" width="68" height="52" rx="6" fill="rgba(255,255,255,0.05)" />
          <circle cx="248" cy="112" r="10" fill={a} fillOpacity="0.6" />
          <Bar x={236} y={128} w={50} />
        </g>
      );

    /* Guided long form with contextual help rail. */
    case 'form':
      return (
        <g>
          <rect x="16" y="28" width="196" height="154" rx="6" fill="rgba(255,255,255,0.05)" />
          <Bar x={28} y={40} w={90} o={0.3} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <Bar x={28} y={58 + i * 24} w={52} o={0.16} />
              <rect x="28" y={66 + i * 24} width="172" height="13" rx="4" fill="rgba(255,255,255,0.08)" stroke={i === 2 ? a : 'rgba(255,255,255,0.14)'} strokeWidth={i === 2 ? 1.8 : 1} />
              {i === 2 && <circle cx="192" cy={72 + i * 24} r="3.5" fill={a} />}
            </g>
          ))}
          <rect x="28" y="166" width="70" height="14" rx="7" fill={a} fillOpacity="0.9" />
          <rect x="224" y="28" width="84" height="90" rx="6" fill="rgba(255,255,255,0.05)" />
          <rect x="234" y="38" width="40" height="6" rx="3" fill={a} fillOpacity="0.8" />
          <Bar x={234} y={52} w={64} />
          <Bar x={234} y={62} w={54} o={0.12} />
          <Bar x={234} y={72} w={60} o={0.12} />
          <Bar x={234} y={82} w={40} o={0.12} />
          <rect x="224" y="128" width="84" height="54" rx="6" fill="rgba(255,255,255,0.04)" stroke={a} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="266" y="158" textAnchor="middle" fill={a} fontSize="16" opacity="0.8">✓</text>
        </g>
      );

    /* Floor-plan canvas with heatmap layers. */
    case 'map':
      return (
        <g>
          <rect x="16" y="26" width="220" height="156" rx="6" fill="rgba(255,255,255,0.04)" />
          <path d="M40 54 H150 V92 H212 V160 H40 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <rect x="52" y="66" width="30" height="14" rx="3" fill="rgba(255,255,255,0.12)" />
          <rect x="96" y="66" width="30" height="14" rx="3" fill="rgba(255,255,255,0.12)" />
          <rect x="162" y="104" width="38" height="18" rx="3" fill="rgba(255,255,255,0.12)" />
          <rect x="56" y="116" width="46" height="30" rx="3" fill="rgba(255,255,255,0.1)" />
          <circle cx="120" cy="122" r="26" fill={a} fillOpacity="0.35" />
          <circle cx="120" cy="122" r="15" fill={a} fillOpacity="0.5" />
          <circle cx="176" cy="72" r="18" fill={a} fillOpacity="0.25" />
          <circle cx="86" cy="94" r="10" fill={a} fillOpacity="0.6" />
          <circle cx="120" cy="122" r="3.5" fill="#fff" />
          <rect x="248" y="26" width="60" height="156" rx="6" fill="rgba(255,255,255,0.05)" />
          {['#foot', '#dwell', '#conv', '#rev', '#staff'].map((k, i) => (
            <g key={k}>
              <rect x="256" y={40 + i * 26} width="10" height="10" rx="2" fill={a} fillOpacity={i === 1 ? 0.9 : 0.25} />
              <Bar x={272} y={42 + i * 26} w={i % 2 ? 24 : 30} o={i === 1 ? 0.3 : 0.12} />
            </g>
          ))}
        </g>
      );

    /* Onboarding portal: hero + numbered steps. */
    case 'portal':
      return (
        <g>
          <rect x="16" y="26" width="288" height="58" rx="6" fill="rgba(255,255,255,0.05)" />
          <rect x="28" y="38" width="120" height="10" rx="5" fill={a} fillOpacity="0.85" />
          <Bar x={28} y={56} w={160} o={0.16} />
          <Bar x={28} y={68} w={110} o={0.1} />
          <rect x="216" y="44" width="76" height="22" rx="11" fill={a} fillOpacity="0.9" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={16 + i * 74} y="96" width="66" height="84" rx="6" fill="rgba(255,255,255,0.05)" />
              <circle cx={34 + i * 74} cy="114" r="9" fill={i === 0 ? a : 'rgba(255,255,255,0.12)'} />
              <text x={34 + i * 74} y="117.5" textAnchor="middle" fill={i === 0 ? '#0b0b0f' : 'rgba(255,255,255,0.6)'} fontSize="9" fontWeight="700">
                {i + 1}
              </text>
              <Bar x={26 + i * 74} y={132} w={44} o={0.22} />
              <Bar x={26 + i * 74} y={144} w={34} o={0.12} />
              <Bar x={26 + i * 74} y={154} w={40} o={0.12} />
              <rect x={26 + i * 74} y={166} width={i === 0 ? 44 : 28} height="5" rx="2.5" fill={a} fillOpacity={i === 0 ? 0.8 : 0.3} />
            </g>
          ))}
        </g>
      );

    /* Copilot panel beside engineering content. */
    case 'copilot':
      return (
        <g>
          <rect x="16" y="26" width="188" height="156" rx="6" fill="rgba(255,255,255,0.05)" />
          <circle cx="70" cy="78" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle cx="70" cy="78" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <path d="M70 48 V38 M70 108 V118 M40 78 H30 M100 78 H110" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
          <path d="M56 92 H84 V104 H56 Z" fill="none" stroke={a} strokeWidth="2" />
          <path d="M62 104 V116 M70 104 V116 M78 104 V116" stroke={a} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
          <Bar x={124} y={46} w={66} o={0.2} />
          <Bar x={124} y={60} w={54} />
          <Bar x={124} y={72} w={62} o={0.12} />
          <Bar x={124} y={84} w={44} o={0.12} />
          <rect x="216" y="26" width="92" height="156" rx="8" fill="rgba(255,255,255,0.06)" stroke={a} strokeOpacity="0.45" strokeWidth="1.5" />
          <rect x="226" y="36" width="44" height="7" rx="3.5" fill={a} fillOpacity="0.9" />
          <rect x="226" y="52" width="72" height="30" rx="6" fill="rgba(255,255,255,0.08)" />
          <Bar x={232} y={58} w={56} o={0.2} />
          <Bar x={232} y={68} w={40} o={0.14} />
          <rect x="236" y="92" width="62" height="30" rx="6" fill={a} fillOpacity="0.16" />
          <Bar x={242} y={98} w={48} o={0.4} />
          <Bar x={242} y={108} w={34} o={0.3} />
          <rect x="226" y="156" width="72" height="16" rx="8" fill={a} fillOpacity="0.9" />
          <rect x="242" y="162" width="40" height="4" rx="2" fill="#0b0b0f" fillOpacity="0.7" />
        </g>
      );

    default:
      return null;
  }
}

/** A hi-fi screen reconstruction, framed like an app window. */
export function ScreenMock({ kind, accent, title }: { kind: ScreenKind; accent: string; title: string }) {
  const gid = `sm-${useId().replace(/:/g, '')}`;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
      <svg viewBox={VIEW} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
            <stop offset="100%" stopColor="#07070a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="#0c0c11" />
        <rect width="320" height="200" fill={`url(#${gid})`} />
        <Chrome accent={accent} />
        <ScreenBody kind={kind} a={accent} />
      </svg>
      {/* Named on the image itself so a screenshot is never mistaken for the
          interface — every surface in this gallery is a drawn reconstruction. */}
      <span className="pointer-events-none absolute bottom-2 right-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
        reconstruction
      </span>
    </div>
  );
}

/**
 * A product mockup: one of the project's own screens inside a device frame.
 *
 * Why the frame is drawn rather than photographed: these are enterprise systems
 * — mortgage underwriting, supplier compliance, broadcast operations — and there
 * is no photograph of them to license. Dropping generic stock imagery of
 * unrelated offices and laptops into a case study would imply a product and a
 * workplace that do not exist, which is exactly the mismatch this case study is
 * supposed to be free of. So the mockup is the real screen, framed: laptop for
 * wide surfaces, phone for the mobile ones, in the project's own palette.
 */
export function DeviceMock({
  kind,
  accent,
  title,
  device,
}: {
  kind: ScreenKind;
  accent: string;
  title: string;
  device: 'laptop' | 'phone';
}) {
  if (device === 'phone') {
    return (
      <div className="mx-auto w-full max-w-[280px] rounded-[2rem] bg-[#0d0d12] p-2.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/12">
        <div className="mb-1.5 flex justify-center">
          <span aria-hidden className="h-1.5 w-16 rounded-full bg-white/15" />
        </div>
        <div className="overflow-hidden rounded-[1.4rem] ring-1 ring-white/10">
          {/* Phones are portrait, so the same art is cropped taller rather than squeezed. */}
          <div className="relative aspect-[9/19] w-full overflow-hidden">
            <div className="absolute inset-0 scale-[1.5]">
              <ScreenMock kind={kind} accent={accent} title={title} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-t-xl bg-[#14141a] px-3 pt-3 ring-1 ring-white/10">
        <div className="mb-2 flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: `${accent}aa` }} />
          <span aria-hidden className="h-2 w-2 rounded-full bg-white/15" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-white/15" />
          <span aria-hidden className="ml-2 h-1.5 flex-1 rounded-full bg-white/[0.07]" />
        </div>
        <div className="overflow-hidden rounded-t-md ring-1 ring-white/10">
          <ScreenMock kind={kind} accent={accent} title={title} />
        </div>
      </div>
      {/* the deck and foot of the laptop, so the screen reads as a device */}
      <div className="mx-auto h-2 w-[106%] max-w-none rounded-b-xl bg-[#1b1b22] ring-1 ring-white/10" />
      <div aria-hidden className="mx-auto h-1 w-24 rounded-b-lg bg-white/10" />
    </div>
  );
}

function WireBody({ kind }: { kind: WireKind }) {
  const s = { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.6, fill: 'none' } as const;
  const box = (x: number, y: number, w: number, h: number, rx = 4) => <rect x={x} y={y} width={w} height={h} rx={rx} {...s} />;
  const cross = (x: number, y: number, w: number, h: number) => (
    <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.2">
      <path d={`M${x} ${y} L${x + w} ${y + h}`} />
      <path d={`M${x + w} ${y} L${x} ${y + h}`} />
    </g>
  );

  switch (kind) {
    case 'flow':
      return (
        <g>
          {box(16, 84, 60, 32)}
          {box(122, 34, 60, 32)}
          {box(122, 130, 60, 32)}
          {box(228, 84, 60, 32)}
          <path d="M76 100 H100 V50 H122" {...s} />
          <path d="M76 100 H100 V146 H122" {...s} />
          <path d="M182 50 H206 V100 H228" {...s} />
          <path d="M182 146 H206 V100" {...s} />
          <path d="M222 100 l6 -4 v8 Z" fill="rgba(255,255,255,0.4)" />
          <path d="M116 50 l-6 -4 v8 Z" fill="rgba(255,255,255,0.4)" transform="translate(6 0)" />
          <path d="M116 146 l-6 -4 v8 Z" fill="rgba(255,255,255,0.4)" transform="translate(6 0)" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Bar x={26} y={94 + i * 8} w={38} h={3} o={0.25} />
            </g>
          ))}
          {[0, 1].map((i) => (
            <Bar key={i} x={132} y={44 + i * 8} w={38} h={3} o={0.25} />
          ))}
        </g>
      );

    case 'ia':
      return (
        <g>
          {box(126, 26, 68, 26)}
          {[0, 1, 2, 3].map((i) => {
            const x = 22 + i * 74;
            return (
              <g key={i}>
                <path d={`M160 52 V68 H${x + 30} V84`} {...s} />
                {box(x, 84, 60, 24)}
                {[0, 1].map((j) => (
                  <g key={j}>
                    <path d={`M${x + 30} 108 V120 H${x + 16 + j * 30} V132`} {...s} strokeOpacity="0.55" />
                    {box(x + 2 + j * 30, 132, 28, 18, 3)}
                  </g>
                ))}
              </g>
            );
          })}
          <path d="M156 39 l-6 -4 v8 Z" fill="rgba(255,255,255,0.4)" transform="rotate(90 156 39)" />
        </g>
      );

    case 'screen':
      return (
        <g>
          {box(16, 20, 288, 164, 6)}
          <path d="M16 44 H304" {...s} />
          <path d="M92 44 V184" {...s} />
          {box(26, 27, 40, 10, 5)}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Bar x={28} y={58 + i * 16} w={44} h={5} o={0.22} />
            </g>
          ))}
          {box(104, 56, 96, 52)}
          {cross(104, 56, 96, 52)}
          {box(212, 56, 78, 52)}
          {cross(212, 56, 78, 52)}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Bar x={104} y={122 + i * 14} w={186 - i * 30} h={6} o={0.2} />
            </g>
          ))}
          {box(104, 162, 56, 14, 7)}
        </g>
      );

    case 'journey':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 14 + i * 60;
            return (
              <g key={i}>
                <path d={`M${x + 24} 30 V176`} {...s} strokeOpacity="0.2" strokeDasharray="4 5" />
                <circle cx={x + 24} cy="30" r="9" {...s} />
                <text x={x + 24} y="33.5" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="8.5">
                  {i + 1}
                </text>
                <Bar x={x + 4} y={48} w={40} h={5} o={0.3} />
                {box(x + 4, 62, 40, 30, 3)}
                {box(x + 4, 104, 40, 30, 3)}
                <Bar x={x + 4} y={146} w={28} h={4} o={0.18} />
              </g>
            );
          })}
          <path d="M24 98 C 60 118, 84 70, 120 92 S 200 130, 264 100" {...s} strokeDasharray="6 4" strokeOpacity="0.5" />
        </g>
      );

    default:
      return null;
  }
}

/** A lo-fi wireframe drawing, on a paper-grey canvas. */
export function WireframeMock({ kind, title }: { kind: WireKind; title: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
      <svg viewBox={VIEW} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" role="img" aria-label={title}>
        <WireBody kind={kind} />
      </svg>
      <span className="pointer-events-none absolute bottom-2 right-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">wireframe</span>
    </div>
  );
}

/** Staggered wrapper used by both galleries in the modal. */
export function ShowcaseItem({ index, children, label }: { index: number; children: ReactNode; label: ReactNode }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-4% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
      className="min-w-0"
    >
      {children}
      <figcaption className="mt-3 text-[13px] leading-snug text-mist">{label}</figcaption>
    </motion.figure>
  );
}
