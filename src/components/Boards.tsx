import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Board } from '../data/originalsExtras';
import { ShowcaseItem } from './OriginalShowcase';

/**
 * Galleries for the real artifacts of a case study — shipped screens and
 * photographed hand-drawn flow boards.
 *
 * Why these are shown apart from the drawn reconstructions: these are the actual
 * artifacts, so they keep their own colours on their own paper instead of being
 * restyled into the site's palette. Their text is the content, which is why each
 * one opens full-screen rather than sitting in a thumbnail — and why the caption
 * and alt text spell out what is on it, for anyone who cannot read the image.
 */
export function BoardGallery({
  boards,
  columns = 2,
  onOpen,
}: {
  boards: Board[];
  /** One per row for screens that need reading; two for a set you scan. */
  columns?: 1 | 2;
  onOpen: (i: number) => void;
}) {
  return (
    <div className={`grid gap-6 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {boards.map((b, i) => (
        <ShowcaseItem
          key={b.src}
          index={i}
          label={
            <>
              <span className="font-semibold text-bone">{b.title}</span> — {b.caption}
            </>
          }
        >
          <button
            type="button"
            onClick={() => onOpen(i)}
            data-cursor="view"
            aria-label={`Open “${b.title}” full screen`}
            className="group relative block w-full overflow-hidden rounded-xl bg-[#f5f2ec] ring-1 ring-white/12 transition hover:ring-crimson-2/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-2"
          >
            {/* The box is sized from the image's own dimensions, so a board never
                shifts the page as it loads. */}
            <span className="block w-full" style={{ aspectRatio: `${b.w} / ${b.h}` }}>
              <img
                src={b.src}
                alt={b.alt}
                width={b.w}
                height={b.h}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-bone opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              Enlarge
            </span>
          </button>
        </ShowcaseItem>
      ))}
    </div>
  );
}

/**
 * One board, full screen.
 *
 * Escape and the arrow keys are handled here in the capture phase: the case
 * study behind this overlay closes itself on Escape, and the board has to win
 * that race — otherwise closing the zoom would throw the reader out of the whole
 * case study.
 */
export function BoardLightbox({
  boards,
  index,
  kicker,
  onClose,
  onNav,
}: {
  boards: Board[];
  index: number;
  /** What this set is, for the counter — e.g. "Screen" or "Hand-drawn flow". */
  kicker: string;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const board = boards[index];
  const closeBtn = useRef<HTMLButtonElement>(null);
  const current = useRef(index);
  current.current = index;

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNav((current.current + 1) % boards.length);
      } else if (e.key === 'ArrowLeft') {
        onNav((current.current - 1 + boards.length) % boards.length);
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [boards.length, onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[160] flex flex-col bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={board.title}
      onClick={onClose}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <img src={board.src} alt={board.alt} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
      </div>

      <div className="shrink-0 border-t border-white/10 bg-ink-2/95 px-4 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">
            {kicker} · {index + 1} / {boards.length}
          </p>
          <p className="mt-1 font-display text-2xl leading-tight tracking-wide text-bone">{board.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{board.caption}</p>
        </div>
      </div>

      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close the board"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-lg text-bone backdrop-blur transition hover:bg-black"
      >
        ✕
      </button>

      {boards.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index - 1 + boards.length) % boards.length);
            }}
            aria-label="Previous board"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-bone backdrop-blur transition hover:bg-black"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index + 1) % boards.length);
            }}
            aria-label="Next board"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-bone backdrop-blur transition hover:bg-black"
          >
            ›
          </button>
        </>
      )}
    </motion.div>
  );
}
