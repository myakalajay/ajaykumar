import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { achievements, profile } from '../data/portfolio';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotionPref, useDesktop, useLandscapePhone, useMidPortrait, useShortPortrait, useTallPortrait } from '../hooks/useMedia';
import { greetingFor, useLocale } from '../i18n';
import { EASE, Magnetic, Particles } from './fx';

/**
 * The signature moment — an opening title sequence cut like a film leader:
 *
 *   black → projector flicker → countdown leader (3·2·1) → studio card
 *   → AJAY (letter-by-letter) → THE SERIES → designation → metadata → ▶ PLAY
 *
 * Three layouts, selected in JS (a media hook) rather than through arbitrary
 * media-query utilities, which Tailwind v4 drops when they chain `and`:
 *
 *   • Desktop (≥1024px) — a one-sheet: credits run down the left, portrait right.
 *   • Portrait phones — a stacked poster: title band on top, subject below.
 *   • Short landscape phones (≤480px tall) — a mini one-sheet: same split, tighter
 *     type, signature + stat dropped (decorative, no vertical room beside the HUD).
 *
 * Either way no key line ever crosses the face.
 *
 * Six beats, driven by TIMELINE. `TOTAL_MS` drives the timecode + chapter rail.
 * The component always calls `onDone` via PLAY / SKIP / Enter / Escape, and it
 * self-completes if the timers are ever throttled, so it can never hang.
 */
const TIMELINE = [
  { at: 260, beat: 1 }, // countdown leader starts
  { at: 1500, beat: 2 }, // studio card
  { at: 2500, beat: 3 }, // name, letter by letter
  { at: 3500, beat: 4 }, // THE SERIES
  { at: 4200, beat: 5 }, // portrait + metadata strap
  { at: 5000, beat: 6 }, // play button
];

/** Total runtime of the sequence, in ms — drives the timecode and progress rail. */
const TOTAL_MS = 5000;

/** The six chapters shown on the rail, one per beat. */
const CHAPTERS = ['Leader', 'Studio', 'Title', 'Series', 'Portrait', 'Watch'];

/** The display name, split into letters so the title can reveal one glyph at a time. */
const NAME_LETTERS = profile.firstName.split('');

/** The designation, split into two balanced lines — the intro's billing block. */
const ROLE_SEGMENTS = profile.role.split('·').map((s) => s.trim());
const ROLE_SPLIT = (() => {
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < ROLE_SEGMENTS.length; i++) {
    const top = ROLE_SEGMENTS.slice(0, i).join(' · ').length;
    const bottom = ROLE_SEGMENTS.slice(i).join(' · ').length;
    const diff = Math.abs(top - bottom);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return best;
})();
const ROLE_LINES = [ROLE_SEGMENTS.slice(0, ROLE_SPLIT).join(' · '), ROLE_SEGMENTS.slice(ROLE_SPLIT).join(' · ')];

/**
 * Bengaluru, drawn once across the full width.
 *
 * The previous version was a 720px tile repeated with `repeat-x`, so on any
 * laptop the same dome, the same tower and the same three trees appeared two or
 * three times across the frame — and the tile's trailing buildings were sliced
 * mid-shape wherever the repeat landed. This is a single composition instead: no
 * repeats, and `preserveAspectRatio="none"` stretches it to fill whatever width
 * it is given, so the silhouette always reaches both edges.
 *
 * Landmarks, left to right: an apartment block, a roadside water tank, Vidhana
 * Soudha's colonnade and dome, the elevated metro viaduct, Bangalore Palace's
 * turrets, UB City's tower, the Kempegowda watchtower, and the garden city's
 * trees between them — plus a flyover across the base for depth.
 */
const SKYLINE_BLOCKS: [number, number, number][] = [
  // [x, width, top y] — every entry a different footprint and height.
  [0, 52, 238], [60, 74, 196], [142, 26, 264],
  [176, 30, 252], [214, 62, 214], [284, 22, 276],
  [470, 58, 180], [536, 34, 244], [578, 44, 226], [630, 66, 198],
  [874, 44, 202], [926, 34, 258], [968, 26, 270],
  [1118, 52, 218], [1178, 24, 268],
  [1276, 48, 176], [1332, 38, 240], [1378, 34, 262],
  [1482, 66, 206],
  [1628, 22, 264], [1658, 34, 236],
  [1724, 58, 190], [1790, 34, 246],
  [1834, 30, 268], [1872, 48, 224],
];

/** Trees have their own rhythm — canopies never the same size twice in a row. */
const SKYLINE_TREES: [number, number][] = [
  [158, 17], [456, 13], [848, 19], [1102, 14], [1462, 18], [1706, 12], [1826, 16],
];

function BengaluruSkyline() {
  return (
    <svg viewBox="0 0 1920 320" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Bengaluru skyline">
      <g fill="rgba(255,255,255,0.10)">
        {/* flyover at the base, so the skyline sits on something */}
        <path d="M-10 306 Q 480 286 960 300 T 1930 292 L1930 320 L-10 320 Z" fill="rgba(255,255,255,0.06)" />

        {/* generic blocks, with a lighter band on the taller ones for texture */}
        {SKYLINE_BLOCKS.map(([x, w, y], i) => (
          <g key={`b${i}`}>
            <rect x={x} y={y} width={w} height={300 - y} />
            {y < 250 && <rect x={x + 4} y={y + 10} width={w - 8} height={3} fill="rgba(255,255,255,0.07)" />}
            {y < 220 && <rect x={x + 4} y={y + 24} width={w - 8} height={3} fill="rgba(255,255,255,0.05)" />}
          </g>
        ))}

        {/* trees */}
        {SKYLINE_TREES.map(([cx, r]) => (
          <g key={`t${cx}`}>
            <circle cx={cx} cy={300 - r * 2.2} r={r} />
            <rect x={cx - 2} y={300 - r * 2.2} width={4} height={r * 2.2} />
          </g>
        ))}

        {/* road-side water tank on legs */}
        <rect x={188} y={292} width={5} height={8} />
        <rect x={206} y={292} width={5} height={8} />
        <rect x={184} y={252} width={30} height={40} rx={3} />
        <path d="M184 252 A 15 12 0 0 1 214 252 Z" />
        <rect x={196} y={240} width={4} height={12} />

        {/* Vidhana Soudha — colonnade, entablature, drum and dome */}
        <rect x={296} y={240} width={158} height={60} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={`col${i}`} x={306 + i * 16} y={206} width={9} height={34} />
        ))}
        <rect x={290} y={192} width={170} height={14} />
        <rect x={348} y={170} width={54} height={22} />
        <path d="M348 170 A 27 27 0 0 1 402 170 Z" />
        <rect x={373} y={150} width={4} height={20} />
        <circle cx={375} cy={146} r={5} />

        {/* elevated metro viaduct with a station box */}
        <rect x={700} y={198} width={168} height={10} />
        {[712, 752, 792, 832].map((x) => (
          <rect key={`p${x}`} x={x} y={208} width={11} height={92} />
        ))}
        <rect x={758} y={168} width={62} height={30} rx={3} />

        {/* Bangalore Palace — three turrets on a crenellated facade */}
        {[1004, 1040, 1076].map((x, i) => (
          <g key={`tur${x}`}>
            <rect x={x} y={224 - i * 4} width={18} height={76 + i * 4} />
            <polygon points={`${x - 4},${224 - i * 4} ${x + 9},${196 - i * 4} ${x + 22},${224 - i * 4}`} />
          </g>
        ))}
        <rect x={1022} y={252} width={54} height={48} />
        {[1026, 1042, 1058, 1066].map((x) => (
          <rect key={`cr${x}`} x={x} y={244} width={6} height={8} />
        ))}

        {/* UB City — the tall setback tower and its shorter neighbour */}
        <rect x={1188} y={96} width={46} height={204} />
        <rect x={1196} y={76} width={30} height={20} />
        <rect x={1209} y={40} width={4} height={36} />
        <rect x={1240} y={152} width={30} height={148} />

        {/* Kempegowda watchtower — tapered stone, capped */}
        <polygon points="1444,300 1490,300 1479,182 1455,182" />
        <rect x={1449} y={170} width={26} height={12} rx={2} />
        <circle cx={1462} cy={162} r={6} />

        {/* tech-park slab with a setback crown */}
        <rect x={1560} y={214} width={54} height={86} />
        <rect x={1568} y={196} width={38} height={18} />
      </g>
    </svg>
  );
}

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const isDesktop = useDesktop();
  const isLandscapePhone = useLandscapePhone();
  const isShortPortrait = useShortPortrait();
  const isMidPortrait = useMidPortrait();
  const isTallPortrait = useTallPortrait();
  const [beat, setBeat] = useState(reduced ? 6 : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [count, setCount] = useState(3);
  const { lang } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  useFocusTrap(root);

  /** Layout mode: desktop one-sheet, landscape mini one-sheet, or stacked portrait poster. */
  const layout = isDesktop ? 'desktop' : isLandscapePhone ? 'landscape' : 'poster';

  /** The headline impact stat, pulled from the achievements that carry a % figure. */
  const headline = useMemo(() => achievements.find((a) => /%/.test(a.title)) ?? achievements[0], []);

  // Beat timers.
  useEffect(() => {
    if (reduced) return;
    const timers = TIMELINE.map(({ at, beat: b }) => window.setTimeout(() => setBeat(b), at));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  // Countdown numerals 3 → 2 → 1 during the leader (beat 1).
  useEffect(() => {
    if (reduced || beat !== 1) return;
    setCount(3);
    const t1 = window.setTimeout(() => setCount(2), 420);
    const t2 = window.setTimeout(() => setCount(1), 840);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced, beat]);

  // Smooth 0→1 progress across the whole intro, driving the timecode + rail.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setProgress(Math.min(1, (now - start) / TOTAL_MS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Safety net: if timers are throttled (background tab), never strand the viewer.
  useEffect(() => {
    if (reduced) return;
    const t = window.setTimeout(() => setBeat(6), TOTAL_MS + 700);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  // SMPTE-ish timecode readout derived from progress (00:00:00 → 00:05:00).
  const timecode = useMemo(() => {
    const totalCs = Math.round((progress * TOTAL_MS) / 10); // centiseconds
    const cs = totalCs % 100;
    const s = Math.floor(totalCs / 100) % 60;
    const m = Math.floor(totalCs / 6000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(m)}:${pad(s)}:${pad(cs)}`;
  }, [progress]);

  const dim = beat >= 6;
  const showSignature = layout !== 'landscape';
  const showStat = layout !== 'landscape';

  return (
    <motion.div
      ref={root}
      className="fixed inset-0 z-[120] overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="Opening titles"
    >
      {/* letterbox bars */}
      <motion.div
        className="absolute inset-x-0 top-0 z-30 h-[7vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: dim ? '-100%' : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 z-30 h-[7vh] bg-black"
        initial={{ y: 0 }}
        animate={{ y: dim ? '100%' : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* projector light sweep — a beam raking across the frame */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-[5] w-[45vw] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06)_45%,rgba(255,61,90,0.10)_55%,transparent)] mix-blend-screen"
        initial={{ x: '-60vw', opacity: 0 }}
        animate={{ x: '110vw', opacity: dim ? 0 : 1 }}
        transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2 }}
      />

      {/* drifting dust in the projector beam */}
      <Particles className="z-[2] opacity-70" count={38} />

      {/* Bengaluru skyline silhouetting the floor — light white, layered above the
          vignette and readability scrim so the silhouette actually reads */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[16] h-[26vh] min-h-[140px] max-h-[250px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 3 ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <BengaluruSkyline />
      </motion.div>

      {/* film scanlines + vignette texture */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6] opacity-[0.5] mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: dim ? 0 : 0.5 }}
        transition={{ duration: 0.8 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{ background: 'radial-gradient(75% 60% at 50% 45%, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* projector flicker light */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 55%, rgba(229,19,43,0.22), transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 3 ? [0, 0.9, 0.5, 1] : 0 }}
        transition={{ duration: 1.4 }}
      />

      {/* ── countdown leader ── */}
      <AnimatePresence>
        {beat === 1 && (
          <motion.div
            key="leader"
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex h-[42vmin] w-[42vmin] items-center justify-center">
              {/* crosshair */}
              <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/15" />
              <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/15" />
              {/* outer ring */}
              <span className="pointer-events-none absolute inset-0 rounded-full border border-white/20" />
              {/* rotating sweep hand */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(255,61,90,0.55), rgba(255,61,90,0) 90deg, rgba(255,61,90,0) 360deg)',
                  maskImage: 'radial-gradient(circle, transparent 58%, black 60%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 60%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.84, repeat: Infinity, ease: 'linear' }}
              />
              {/* numeral */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative font-display text-[24vmin] leading-none text-bone/90 tabular-nums"
                >
                  {count}
                </motion.span>
              </AnimatePresence>
              {/* corner ticks */}
              <span className="pointer-events-none absolute -left-2 -top-2 h-5 w-5 border-l border-t border-white/25" />
              <span className="pointer-events-none absolute -right-2 -top-2 h-5 w-5 border-r border-t border-white/25" />
              <span className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 border-b border-l border-white/25" />
              <span className="pointer-events-none absolute -bottom-2 -right-2 h-5 w-5 border-b border-r border-white/25" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── studio card ── */}
      <AnimatePresence>
        {beat === 2 && (
          <motion.div
            key="studio"
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative px-8 py-5 sm:px-14 sm:py-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="pointer-events-none absolute inset-0 border border-white/15"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: EASE }}
              />
              <motion.span
                className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-crimson-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-crimson-2"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.p
                className="font-sans text-xs font-semibold text-mist sm:text-sm"
                initial={{ letterSpacing: '0.2em', opacity: 0 }}
                animate={{ letterSpacing: '0.6em', opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE }}
              >
                {profile.originalLabel}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* portrait — the right column of the one-sheet on desktop/landscape, bottom-anchored
          poster subject on portrait phones. Height shrinks as the viewport shortens so the
          credit stack above never lands on the face. */}
      <motion.div
        className={`absolute bottom-0 z-0 flex items-end justify-center ${
          layout === 'desktop'
            ? 'right-0 left-auto h-[86vh] w-[48vw] max-w-none'
            : layout === 'landscape'
              ? 'right-0 left-auto h-[100vh] w-[46vw] max-w-none'
              : `inset-x-0 mx-auto max-w-[900px] ${
                  isShortPortrait ? 'h-[34vh]' : isMidPortrait ? 'h-[40vh]' : isTallPortrait ? 'h-[58vh]' : 'h-[50vh]'
                }`
        }`}
        initial={{ opacity: 0, scale: 1.12, filter: 'blur(18px) brightness(0.3)' }}
        animate={
          beat >= 5
            ? { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }
            : {}
        }
        transition={{ duration: 1.6, ease: EASE }}
      >
        <img
          src={profile.portrait.src}
          srcSet={profile.portrait.srcSet}
          sizes="(max-width: 1023px) 100vw, 48vw"
          alt={profile.portrait.alt}
          className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_48%,transparent_92%)]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 z-[1] bg-[radial-gradient(70%_60%_at_50%_40%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* ── title ── */}
      {/* Top-anchored on portrait phones (a centred title always lands on the face), and the
          left column of the one-sheet on desktop/landscape — left-aligned, so the whole credit
          block reads as one stack beside the subject. */}
      <div
        className={`z-10 flex flex-col text-center ${
          layout === 'desktop'
            ? 'absolute inset-y-0 left-0 top-0 h-full w-[52vw] items-start justify-center overflow-visible px-[6vw] pt-0 text-left'
            : layout === 'landscape'
              ? 'absolute left-0 top-[calc(3vh+48px)] w-[54vw] max-h-[calc(100vh-3vh-48px-56px)] items-start gap-y-1 overflow-visible px-6 pt-0 text-left'
              : `absolute inset-x-0 px-4 pt-2 items-center overflow-hidden ${
                  isTallPortrait ? 'top-[calc(7vh+104px)]' : 'top-[calc(7vh+116px)]'
                } max-h-[calc(88vh-7vh-116px)]`
        }`}
      >
        {/* localized greeting — welcomes the viewer in their own language */}
        <motion.p
          className="mb-1 font-sans text-xs font-semibold tracking-[0.3em] text-crimson-2 sm:text-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={beat >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {greetingFor(lang)}
        </motion.p>
        <h1
          className={`relative flex font-display leading-[0.82] text-bone drop-shadow-[0_8px_40px_rgba(0,0,0,0.8)] ${
            layout === 'landscape'
              ? 'justify-start text-[clamp(2.6rem,7vw,4rem)]'
              : layout === 'desktop'
                ? 'justify-start text-[clamp(3.5rem,8.4vw,9.5rem)]'
                : 'justify-center text-[clamp(3.6rem,12.5vw,9rem)]'
          }`}
          aria-label={profile.fullName}
        >
          {NAME_LETTERS.map((ch, i) => (
            <span key={`${ch}-${i}`} aria-hidden className="relative inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                animate={
                  beat >= 3
                    ? {
                        y: '0%',
                        opacity: 1,
                        filter: 'blur(0px)',
                      }
                    : {}
                }
                transition={{ duration: 0.85, ease: EASE, delay: i * 0.06 }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            </span>
          ))}
          {/* light sweep raking across the name as it settles */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.5),transparent)] mix-blend-overlay"
            initial={{ x: '-40%', opacity: 0 }}
            animate={beat >= 3 ? { x: '220%', opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.5 }}
          />
        </h1>

        {/* THE SERIES — the trailing letter-space is cancelled so the tracked line
            optically centres instead of drifting left */}
        <motion.p
          className="font-sans text-sm font-bold text-crimson-2 [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] sm:text-lg"
          initial={{ opacity: 0, letterSpacing: '1.4em' }}
          animate={
            beat >= 4
              ? { opacity: 1, letterSpacing: '0.7em' }
              : {}
          }
          transition={{ duration: 1.1, ease: EASE }}
        >
          {profile.seriesTag}
        </motion.p>

        {/* designation — two balanced, left-aligned lines: the poster billing block */}
        <motion.p
          aria-label={profile.role}
          className={`mt-4 max-w-full px-1 font-sans text-[11px] font-semibold uppercase leading-[1.9] tracking-[0.24em] text-bone/85 [text-shadow:0_2px_16px_rgba(0,0,0,0.95)] sm:text-xs sm:tracking-[0.3em] ${
            layout === 'poster' ? '' : 'text-left'
          } lg:mt-7 lg:tracking-[0.3em]`}
          initial={{ opacity: 0, y: 10 }}
          animate={beat >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {ROLE_LINES.map((line, i) => (
            <span key={line} aria-hidden className="block">
              {i > 0 && <span className="mr-3 hidden h-px w-6 translate-y-[-4px] bg-white/30 lg:inline-block" />}
              {line}
            </span>
          ))}
        </motion.p>

        {/* signature — a handwritten cursive accent that signs off the billing block */}
        {showSignature && (
          <motion.p
            aria-hidden
            className="pointer-events-none mt-2 select-none font-script text-[clamp(1.7rem,4.6vw,2.9rem)] leading-none text-bone/90 [text-shadow:0_2px_24px_rgba(0,0,0,0.85)] lg:mt-4"
            initial={{ opacity: 0, y: 14, rotate: -6, filter: 'blur(8px)' }}
            animate={beat >= 5 ? { opacity: 1, y: 0, rotate: -6, filter: 'blur(0px)' } : { opacity: 0, y: 14, rotate: -6, filter: 'blur(8px)' }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          >
            {profile.fullName}
          </motion.p>
        )}

        {/* headline impact stat — the CV's measured outcome, as a closing beat */}
        {showStat && (
          <motion.p
            className="mt-3 max-w-md font-sans text-sm leading-relaxed text-bone/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)] sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={beat >= 5 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          >
            <span className="font-display text-2xl tracking-wide text-crimson-2 sm:text-3xl">{headline.title}</span>
            <span className="ml-2 text-mist">— {headline.org}</span>
          </motion.p>
        )}
      </div>

      {/* metadata strap: tenure · scale · location — top-centre on portrait phones, and the
          top of the credit column on desktop/landscape, always clear of the subject. */}
      <motion.div
        className={`z-20 flex px-4 ${
          layout === 'desktop'
            ? 'absolute left-0 top-[calc(7vh+40px)] w-[52vw] justify-start px-0 pl-[6vw]'
            : layout === 'landscape'
              ? 'absolute left-0 top-[calc(3vh+16px)] w-[54vw] justify-start px-6'
              : 'absolute inset-x-0 top-[calc(7vh+68px)] justify-center'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={beat >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className={`flex max-w-[92vw] flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/70 sm:text-xs ${layout === 'poster' ? 'justify-center' : 'justify-start'}`}>
          {/* Tenure and place only. The chip counts that used to sit here (how many
              Originals, how many tools) were inventory, not a reason to keep
              reading — the line now says who and where, and nothing else. */}
          <span className="rounded border border-bone/25 px-1.5 py-px text-bone">{profile.tenure}</span>
          <span className="h-1 w-1 rounded-full bg-smoke" />
          <span>{profile.location}</span>
        </div>
      </motion.div>

      {/* readability scrim: dissolves the portrait's lower body into black before
          the tagline and PLAY, so the key lines never sit on the shirt */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[36vh] bg-gradient-to-t from-black via-black/85 to-transparent"
      />

      {/* ── play — bottom-centre on portrait phones, foot of the credit column on desktop,
          top-right (below SKIP) in landscape where the HUD owns the bottom edge.
          bottom-12vh keeps the pill clear of the timecode HUD during the beat-5 → 6 crossfade. ── */}
      <div
        className={`z-20 flex flex-col ${
          layout === 'desktop'
            ? 'absolute bottom-[12vh] left-0 w-[52vw] items-start px-[6vw] text-left'
            : layout === 'landscape'
              ? 'absolute right-6 top-[calc(7vh+52px)] w-auto items-end px-0 text-right'
              : 'absolute inset-x-0 bottom-[12vh] items-center px-4 text-center'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={beat >= 6 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Magnetic>
            <button
              type="button"
              data-cursor="play"
              onClick={onDone}
              tabIndex={beat >= 6 ? 0 : -1}
              className="group flex items-center gap-3 rounded-full bg-bone px-9 py-4 font-sans text-base font-bold tracking-wide text-ink shadow-[0_0_60px_rgba(229,19,43,0.45)] transition hover:bg-white"
            >
              <span className="text-lg transition-transform group-hover:scale-125">▶</span>
              PLAY
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* ── HUD: timecode + chapter rail ── */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[36] px-4 pb-[calc(7vh+10px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: dim ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <span className="font-sans text-[10px] font-semibold tabular-nums tracking-[0.2em] text-crimson-2">{timecode}</span>
          <div className="relative h-[3px] flex-1 bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-crimson to-crimson-2"
              style={{ width: `${progress * 100}%` }}
            />
            {/* chapter ticks */}
            {CHAPTERS.map((label, i) => {
              const at = i / (CHAPTERS.length - 1);
              const active = progress >= at - 0.001;
              return (
                <span
                  key={label}
                  title={label}
                  className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    left: `${at * 100}%`,
                    background: active ? 'var(--color-crimson-2)' : '#0b0b0f',
                    borderColor: active ? 'var(--color-crimson-2)' : 'rgba(255,255,255,0.25)',
                  }}
                />
              );
            })}
          </div>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-mist">
            {CHAPTERS[Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length))]}
          </span>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={onDone}
        className="absolute right-3 top-[calc(7vh+12px)] z-40 max-w-[calc(100vw-1.5rem)] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/20 px-3 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] text-mist transition hover:border-white/60 hover:text-bone sm:right-4 sm:px-4 sm:tracking-[0.2em]"
      >
        SKIP INTRO
      </button>
    </motion.div>
  );
}
