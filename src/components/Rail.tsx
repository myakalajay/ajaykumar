import { useEffect, useState, type RefObject } from 'react';

/** Desktop arrow controls for a horizontal rail. Hidden on touch, where swiping is native. */
export function RailButtons({ rail, watch }: { rail: RefObject<HTMLDivElement | null>; watch?: unknown }) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // The rail's box size doesn't change when its *contents* change
    // (e.g. switching viewing profiles), so re-measure on a `watch` dep too.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, [rail, watch]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const base =
    'absolute top-8 bottom-8 z-20 hidden w-[var(--gutter)] min-w-10 items-center justify-center bg-gradient-to-r text-3xl text-bone opacity-0 transition duration-300 group-hover/rail:opacity-100 hover:text-white [@media(hover:hover)]:flex';

  return (
    <>
      {canLeft && (
        <button type="button" aria-label="Scroll left" onClick={() => page(-1)} className={`${base} left-0 from-ink/90 to-transparent`}>
          ‹
        </button>
      )}
      {canRight && (
        <button type="button" aria-label="Scroll right" onClick={() => page(1)} className={`${base} right-0 from-transparent to-ink/90`}>
          ›
        </button>
      )}
    </>
  );
}
