import { useEffect, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside an open overlay. Dialogs in this project move focus in and back
 * out themselves; this adds the missing piece — the loop.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const all = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.tabIndex !== -1 && (el.offsetParent !== null || el === document.activeElement),
      );
      if (all.length === 0) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [ref, active]);
}
