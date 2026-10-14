import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile, viewerProfiles, type ProfileId } from '../data/portfolio';
import { EASE } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-2xl' : 'h-8 w-8 rounded-md';
  if (id === 'ajay') {
    return (
      <span className={`relative block overflow-hidden ${box}`} style={{ background: 'radial-gradient(circle at 50% 30%, #7a0f24, #1a0509)' }}>
        <img src="/assets/portrait-420.webp" alt="" className="absolute inset-x-0 bottom-0 mx-auto h-[115%] w-auto max-w-none -translate-x-[3%] object-cover object-top" />
        <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
      </span>
    );
  }
  const glyph = { recruiter: 'R', product: '◈', design: '✦' }[id];
  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden ${box}`}
      style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.color}, #0b0b10 115%)` }}
    >
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.28),transparent_70%)]" />
      <span className={`relative font-display text-bone drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-sm'}`}>{glyph}</span>
      <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
    </span>
  );
}

export default function ProfileSelector({ onPick }: { onPick: (id: ProfileId) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onPick('ajay');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPick]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-y-auto bg-ink px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: EASE }}
      role="dialog"
      aria-label="Who's watching?"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(229,19,43,0.16),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <motion.p
        className="relative mb-1 font-serif text-sm italic tracking-wide text-smoke"
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Choose your cut
      </motion.p>
      <motion.h2
        className="relative mb-12 text-center font-display text-4xl tracking-wide text-bone sm:text-6xl"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
      >
        Who&apos;s Watching
        <span className="ml-3 font-serif text-2xl italic text-crimson-2 sm:text-4xl">?</span>
      </motion.h2>
      <motion.ul
        className="relative grid grid-cols-2 gap-5 sm:flex sm:gap-8"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
      >
        {viewerProfiles.map((p) => (
          <motion.li key={p.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
            <button type="button" onClick={() => onPick(p.id)} data-cursor="play" className="group flex flex-col items-center gap-3 text-center">
              <span
                className="relative rounded-2xl transition duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
                style={{ filter: `drop-shadow(0 0 0 transparent)` }}
              >
                <span className="block transition duration-300 group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                  <ProfileAvatar id={p.id} />
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ boxShadow: `0 0 0 2px ${p.color}, 0 0 26px -2px ${p.color}` }}
                />
                {p.id === 'ajay' && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-crimson px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-white shadow-lg">MAIN</span>
                )}
              </span>
              <span className="font-sans text-sm font-medium text-mist transition group-hover:text-bone sm:text-base">{p.name}</span>
              <span className="max-w-[9rem] text-[11px] leading-snug text-smoke transition group-hover:text-mist">{p.blurb}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
      <p className="relative mt-12 max-w-md text-center text-xs leading-relaxed text-smoke">
        Every profile watches the same true story of {profile.displayName} — it only changes what plays first.
      </p>
    </motion.div>
  );
}
