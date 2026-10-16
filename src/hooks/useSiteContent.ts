import { useEffect, useState } from 'react';
import { cv as defaultCv, isCvContent, type CvContent } from '../data/cv';

/**
 * Reads content published through the admin portal.
 *
 * The bundled default is returned immediately, so the page never waits on the
 * network and never renders empty: if the API is missing (local dev) or down,
 * the visitor sees the CV exactly as it shipped. A slower published revision
 * then swaps in, and `updatedat` lets the UI say when it was last edited.
 */

export type ContentState = {
  cv: CvContent;
  /** When the published revision was saved; null while running on the bundled default. */
  updatedAt: string | null;
  /** True once the API answered and its payload was accepted. */
  published: boolean;
};

const BUNDLED: ContentState = { cv: defaultCv, updatedAt: null, published: false };

/**
 * One in-flight request per page load, shared by every caller.
 *
 * The résumé sheet renders both inside the section and inside the modal, so
 * without this the same small JSON would be fetched twice.
 */
let inFlight: Promise<ContentState> | null = null;

function loadCv(): Promise<ContentState> {
  // In dev the Worker API is not running under the Vite server, so skip the
  // request rather than logging a 404 for every page load.
  if (import.meta.env.DEV) return Promise.resolve(BUNDLED);
  if (!inFlight) {
    inFlight = fetch('/api/cv', { headers: { accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) return BUNDLED;
        const data = (await res.json()) as { cv?: unknown; updatedat?: string | null };
        if (!isCvContent(data.cv)) return BUNDLED;
        return { cv: data.cv, updatedAt: data.updatedat ?? null, published: true };
      })
      .catch(() => BUNDLED);
  }
  return inFlight;
}

export function useCvContent(): ContentState {
  const [state, setState] = useState<ContentState>(BUNDLED);

  useEffect(() => {
    let live = true;
    void loadCv().then((next) => {
      if (live) setState(next);
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
