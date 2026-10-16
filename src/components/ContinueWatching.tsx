import { motion } from 'framer-motion';
import { useMedia } from '../hooks/useMedia';
import { Apple, Monitor } from 'lucide-react';

/**
 * ContinueWatching — WATCHING NOW hero.
 *
 * Desktop/lap: a long horizontal strip of fuzzy image cards scrolling on
 * repeat, with a single call-to-action inside the last card.
 * Mobile: a compact, universally readable variant with a dated “now
 * playing / watching now” state instead of the wide strip.
 *
 * Two-article constraint is enforced in the data model
 * (src/data/originalsExtras.ts), where each entry carries a “continue”
 * flag that is true only for the two-element set we want to surface here.
 */

export function ContinueWatching() {
  const isMobile = useMedia('(max-width: 900px)');

  return (
    <>
      {isMobile ? (
        <section className="mw-270 min-h-[82svh] flex flex-col" aria-label="Watch now">
          <div className="flex-1 relative">
            <div className="absolute inset-0 squeeze" />
            <motion.div
              animate={{ x: [-100, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-[18vw] items-center px-6"
            >
              <div className="flex-shrink-0 w-[72vw] aspect-[21/9] overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#121216_0%,#000_100%)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black tracking-[0.32em] text-white/25 select-none">
                    ON FINAL TEASER · 11.14.26
                  </span>
                </div>
                <img
                  src="/assets/continue_watching_1x.png"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#121216_0%,#000_100%)] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black tracking-[0.32em] text-white/25 select-none">
                    POSTPONE NOT GATE
                  </span>
                </div>
                <img
                  src="/assets/continue_watching_2x.png"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center pb-10">
            <span className="btn btn-primary">
              <Apple className="mr-3 h-4 w-4" />
              Watch now
            </span>
          </div>
        </section>
      ) : (
        // ── desktop / lap ──
        <section className="mw-180 min-h-[86svh] relative isolate" aria-label="Continue watching">
          {/* tritone sky */}
          <Tritone />

          {/* Two atmospheric backdrop layers, blurred to different depths so the
              frame edges read as depth rather than as a flat panel. */}
          <Sky blur={18} seed={1} />
          <Sky blur={38} seed={2} />

          {/* left frame */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 overflow-hidden rounded-l-[3.4vw] shadow-2xl shadow-[#2a0018]/60">
            <img
              src="/assets/continue_watching_left.jpg"
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            <img
              src="/assets/continue_watching_left@2x.jpg"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="hidden h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-[0.85em] font-medium text-[#ffd166] tracking-[0.32em] uppercase">
                  WATCHING NOW
                </p>
                <h1 className="text-8xl font-black text-white mt-2 tracking-[0.22em] max-w-[90%] leading-[1.04]">
                  ‘RESIDUE’
                </h1>
                <p className="text-sm font-medium text-[#d1d5db] tracking-[0.2em] uppercase mt-3">
                  The finale arrives 11.12.26
                </p>
              </div>
            </div>
          </div>

          {/* right frame */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 ml-auto overflow-hidden rounded-r-[3.4vw] shadow-2xl shadow-[#18000d]/60">
            <img
              src="/assets/continue_watching_right.jpg"
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
            <img
              src="/assets/continue_watching_right@2x.jpg"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="hidden h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-[0.85em] font-medium text-[#ffd166] tracking-[0.32em] uppercase">
                  PREMIERES DECEMBER 2026
                </p>
                <h1 className="text-7xl font-black text-white mt-2 tracking-[0.2em] max-w-[90%] leading-[1.06]">
                  ‘ORIGINS’
                </h1>
                <p className="text-sm font-medium text-[#d1d5db] tracking-[0.2em] uppercase mt-3">
                  The world before the line
                </p>
              </div>
            </div>
          </div>

          {/* CTA pill inside right frame */}
          <a
            href="#cta"
            className="absolute bottom-5 right-4 z-10 flex items-center gap-3 px-5 py-3 rounded-full bg-white text-[#0b0b0d] font-semibold text-sm tracking-widest hover:bg-[#f4f1ec] transition"
          >
            <Monitor className="h-4 w-4" />
            Watch now
          </a>

          {/* subtle vignette */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#000]/10 via-transparent to-transparent" />
          </div>
        </section>
      )}
    </>
  );
}

function Tritone() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0" style={{
        background:
          'radial-gradient(60% 40% at 50% 50%, #2a0018 0%, #000 60%)',
      }} />
    </div>
  );
}

/**
 * A drawn atmosphere layer.
 *
 * This used to be a remote stock-photo request (picsum.photos), which meant the
 * hero pulled two third-party images of whatever the service felt like serving:
 * off-brand subject matter, an unpredictable network dependency and a layout
 * shift on every load. The sky is now generated in the browser instead — a few
 * layered gradients, deterministic from `seed`, and free.
 */
function Sky({ blur, seed }: { blur: number; seed: number }) {
  // Each layer places three off-centre light pools; different seeds move them
  // so the two layers never stack into the same shape.
  const pools = [
    [18 + seed * 9, 30, 34],
    [62 - seed * 5, 18, 26],
    [46, 74 - seed * 6, 44],
  ];
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-[-20%]"
        style={{
          filter: `blur(${blur}px)`,
          background: pools
            .map(
              ([x, y, r], i) =>
                `radial-gradient(${r}% ${r}% at ${x}% ${y}%, rgba(255,175,190,${0.1 + i * 0.03}) 0%, transparent 70%)`,
            )
            .join(', '),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 40%, rgba(0,0,0,0.08) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
