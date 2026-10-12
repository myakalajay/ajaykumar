import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, projects, toolbox } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { DotList, EASE, Magnetic, Particles } from './fx';

/**
 * The signature moment — an opening title sequence cut like a film leader:
 *
 *   black → projector flicker → countdown leader (3·2·1) → studio card
 *   → AJAY (letter-by-letter) → THE SERIES → metadata strap → ▶ PLAY
 *
 * The portrait carries the centre of the frame, so the metadata strap lives at
 * the top of the picture (clear of the subject) and a light-white Bengaluru
 * skyline silhouettes the floor.
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

/** Split into letters so the title can reveal one glyph at a time. */
const NAME_LETTERS = profile.firstName.split('');

/**
 * A seamless Bengaluru skyline tile — Vidhana Soudha's dome and colonnade,
 * the Palace's turrets, UB City's tower and a few of the garden city's trees.
 * Drawn on a 720×300 ground-level baseline so `repeat-x` joins the ends flat.
 */
const BENGALURU_SKYLINE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300" fill="rgba(255,255,255,0.20)">
  <rect x="0" y="292" width="720" height="8"/>
  <rect x="24" y="262" width="44" height="38"/><polygon points="18,262 46,238 74,262"/>
  <circle cx="104" cy="268" r="15"/><rect x="101" y="268" width="6" height="30"/>
  <rect x="132" y="274" width="10" height="24"/>
  <rect x="140" y="278" width="240" height="14"/><rect x="150" y="266" width="220" height="12"/>
  <rect x="158" y="254" width="204" height="10"/>
  <rect x="140" y="214" width="26" height="50"/><rect x="334" y="214" width="26" height="50"/>
  <rect x="162" y="186" width="196" height="12"/>
  <rect x="170" y="198" width="10" height="56"/><rect x="190" y="198" width="10" height="56"/>
  <rect x="210" y="198" width="10" height="56"/><rect x="230" y="198" width="10" height="56"/>
  <rect x="250" y="198" width="10" height="56"/><rect x="270" y="198" width="10" height="56"/>
  <rect x="290" y="198" width="10" height="56"/><rect x="310" y="198" width="10" height="56"/>
  <rect x="330" y="198" width="10" height="56"/>
  <rect x="240" y="164" width="44" height="22"/>
  <path d="M 240 164 A 22 22 0 0 1 284 164 Z"/>
  <rect x="260" y="134" width="4" height="12"/><circle cx="262" cy="130" r="4"/>
  <rect x="404" y="232" width="96" height="68"/>
  <rect x="404" y="224" width="6" height="8"/><rect x="416" y="224" width="6" height="8"/>
  <rect x="428" y="224" width="6" height="8"/><rect x="440" y="224" width="6" height="8"/>
  <rect x="452" y="224" width="6" height="8"/><rect x="464" y="224" width="6" height="8"/>
  <rect x="476" y="224" width="6" height="8"/><rect x="488" y="224" width="6" height="8"/>
  <rect x="398" y="222" width="14" height="78"/><polygon points="393,222 405,194 417,222"/>
  <rect x="444" y="206" width="16" height="94"/><polygon points="439,206 452,180 465,206"/>
  <rect x="492" y="222" width="14" height="78"/><polygon points="487,222 499,194 511,222"/>
  <circle cx="538" cy="270" r="14"/><rect x="535" y="270" width="6" height="28"/>
  <rect x="564" y="120" width="48" height="180"/>
  <rect x="572" y="104" width="32" height="16"/><rect x="586" y="74" width="3" height="30"/>
  <rect x="608" y="150" width="10" height="150"/>
  <rect x="622" y="208" width="36" height="92"/>
  <rect x="662" y="232" width="26" height="68"/>
</svg>`;

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const [beat, setBeat] = useState(reduced ? 6 : 0);
  const [progress, setProgress] = useState(reduced ? 1 : 0);
  const [count, setCount] = useState(3);

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
    const totalCs = Math.round(progress * TOTAL_MS * 10); // centiseconds
    const cs = totalCs % 100;
    const s = Math.floor(totalCs / 100) % 60;
    const m = Math.floor(totalCs / 6000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(m)}:${pad(s)}:${pad(cs)}`;
  }, [progress]);

  const dim = beat >= 6;

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: EASE }}
      role="dialog"
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

      {/* Bengaluru skyline silhouetting the floor — light white, behind the portrait */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[30vh] min-h-[150px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(BENGALURU_SKYLINE)}")`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: 'auto 100%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 3 ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      />

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

      {/* portrait */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-0 mx-auto flex h-[62vh] max-w-[900px] items-end justify-center"
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
          sizes="(max-width: 768px) 100vw, 900px"
          alt={profile.portrait.alt}
          className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_48%,transparent_92%)]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 z-[1] bg-[radial-gradient(70%_60%_at_50%_40%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* ── title ── */}
      {/* Top-anchored, not viewport-centred: a centred title always lands on the
          subject's face, because the portrait is bottom-anchored and its head sits
          near the vertical middle. This parks the name in the clear band between
          the metadata strap and the head, on every breakpoint. */}
      <div className="absolute inset-x-0 top-[calc(7vh+132px)] z-10 flex flex-col items-center px-4 text-center sm:top-[calc(7vh+112px)]">
        <h1
          className="relative flex justify-center font-display leading-[0.82] text-bone drop-shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
          style={{ fontSize: 'clamp(4.4rem, 16vw, 11rem)' }}
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
                {ch}
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

      </div>

      {/* metadata strap: tenure · scale · location — parked at the top of the frame,
          below the SKIP control, so it never crosses the subject the way an
          in-flow line under the title did. */}
      <motion.div
        className="absolute inset-x-0 top-[calc(7vh+68px)] z-20 flex justify-center px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={beat >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="flex max-w-[92vw] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/70 sm:text-xs">
          <span className="rounded border border-bone/25 px-1.5 py-px text-bone">{profile.tenure}</span>
          <span className="h-1 w-1 rounded-full bg-smoke" />
          <span>{projects.length} Originals</span>
          <span className="h-1 w-1 rounded-full bg-smoke" />
          <span>{toolbox.length} Tools</span>
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

      {/* ── tagline + play ── */}
      <div className="absolute inset-x-0 bottom-[9vh] z-20 flex flex-col items-center gap-6 px-4 text-center">
        <motion.p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/90 sm:text-sm sm:tracking-[0.4em]"
          initial={{ opacity: 0, y: 14 }}
          animate={beat >= 6 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <DotList items={profile.tagline} align="center" />
        </motion.p>
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
        className="absolute right-4 top-[calc(7vh+12px)] z-40 rounded-full border border-white/20 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.2em] text-mist transition hover:border-white/60 hover:text-bone"
      >
        SKIP INTRO
      </button>
    </motion.div>
  );
}
