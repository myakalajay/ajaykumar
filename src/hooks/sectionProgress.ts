import { useEffect, useSyncExternalStore, type RefObject } from 'react';

/**
 * Tracks how much of each section the visitor has actually watched (0–1),
 * so the "Continue Exploring" progress bars reflect real viewing, not fake numbers.
 */
const progress: Record<string, number> = {};
const listeners = new Set<() => void>();
let snapshot = { ...progress };

function set(id: string, value: number) {
  if ((progress[id] ?? 0) >= value) return;
  progress[id] = value;
  snapshot = { ...progress };
  listeners.forEach((l) => l());
}

/** Module-level so its identity is stable across renders. */
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return snapshot;
}

export function useWatchProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useTrackProgress(id: string, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const seen = (vh - r.top) / (r.height + vh * 0.25);
      set(id, Math.min(1, Math.max(0, seen)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, [id, ref]);
}
