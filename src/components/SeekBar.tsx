import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { sectionMeta, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';

/**
 * The seek bar: a streaming-style scrubber pinned to the top of the page.
 * It shows how far through the series you are, marks every chapter, and doubles
 * as a jump-to-chapter control.
 */
export default function SeekBar({ order }: { order: SectionId[] }) {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  const { scrollTo } = useSmoothScroll();
  // Chapter marks are positioned from measured layout, so they start empty and
  // fill in once the sections have settled.
  const [marks, setMarks] = useState<{ id: string; label: string; at: number }[]>([]);

  const chapters = useMemo(() => ['top', ...order, 'contact'], [order]);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setMarks(
        chapters.map((id) => {
          const el = document.getElementById(id);
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          const label = id === 'top' ? 'Home' : id === 'contact' ? "Let's Build" : sectionMeta[id as SectionId].nav;
          return { id, label, at: Math.min(1, Math.max(0, top / max)) };
        }),
      );
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const t = window.setTimeout(measure, 1200); // after fonts/images settle
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [chapters]);

  const jump = (at: number) =>
    scrollTo(Math.round(at * (document.documentElement.scrollHeight - window.innerHeight)), { offset: 0 });

  return (
    <div className="fixed inset-x-0 top-0 z-[70]" data-no-print>
      <div className="relative h-[3px] w-full bg-white/10">
        <motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-crimson to-crimson-2" style={{ scaleX: fill }} />
        {marks.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => jump(m.at)}
            title={`Jump to ${m.label}`}
            aria-label={`Jump to ${m.label}`}
            className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${m.at * 100}%` }}
          >
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-smoke transition duration-300 hover:scale-150 hover:bg-bone" />
          </button>
        ))}
      </div>
    </div>
  );
}
