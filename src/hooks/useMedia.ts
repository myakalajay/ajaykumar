import { useCallback, useSyncExternalStore } from 'react';

export function useMedia(query: string, fallback = false) {
  // Keep subscribe/getSnapshot referentially stable for a given query — otherwise
  // useSyncExternalStore tears down and re-adds the listener on every render.
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

/** True on devices with a precise pointer (mouse / trackpad) — gates hover-only effects. */
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');
export const useReducedMotionPref = () => useMedia('(prefers-reduced-motion: reduce)');
export const useDesktop = () => useMedia('(min-width: 1024px)');

/** True on phones held sideways — the intro switches to a mini one-sheet there. */
export const useLandscapePhone = () => useMedia('(max-width: 1023px) and (orientation: landscape)');

/** Portrait phones below ~700px tall — the credit stack has to shrink to stay clear of the face. */
export const useShortPortrait = () => useMedia('(max-width: 1023px) and (orientation: portrait) and (max-height: 700px)');

/** Portrait phones in the 701–780px tall band — a middle shrink step. */
export const useMidPortrait = () =>
  useMedia('(max-width: 1023px) and (orientation: portrait) and (min-height: 701px) and (max-height: 780px)');

/** Larger portrait phones (≥640px wide) — slightly taller poster crop. */
export const useTallPortrait = () => useMedia('(min-width: 640px) and (orientation: portrait)');
