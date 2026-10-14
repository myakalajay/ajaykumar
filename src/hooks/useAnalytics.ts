import { useEffect, useRef } from 'react';

/** Stable anonymous visitor id, minted once per browser. */
function visitorId(): string {
  const KEY = 'ak-vid';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      const rand =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      id = rand;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Storage blocked — fall back to an ephemeral id for this page load.
    return `anon-${Math.random().toString(36).slice(2, 10)}`;
  }
}

type TrackPayload = { path: string; section?: string; dwellMs?: number };

/** The visitor's browser language, reported so the admin portal can break down by locale. */
function detectLang(): string | undefined {
  const raw = navigator.languages?.[0] ?? navigator.language;
  const code = raw?.trim().toLowerCase().split(/[-_]/)[0];
  return code && /^[a-z]{2,3}$/.test(code) ? code : undefined;
}

/** Fire-and-forget: analytics must never break the page or block paint. */
function send(payload: TrackPayload) {
  // The /api/track endpoint only exists in the deployed Worker; skip it in local
  // dev so the console isn't spammed with404s for a request that can't succeed.
  if (import.meta.env.DEV) return;
  try {
    const body = JSON.stringify({
      visitorId: visitorId(),
      path: payload.path,
      section: payload.section,
      referrer: document.referrer || undefined,
      dwellMs: payload.dwellMs,
      lang: detectLang(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      void fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics is best-effort */
  }
}

/**
 * Reports this visit to the admin portal: one pageview on mount, plus a dwell
 * event when the tab is hidden or unloaded so "time on site" is real.
 */
export function useAnalytics(section?: string) {
  const start = useRef<number>(Date.now());
  const sent = useRef(false);

  // Pageview.
  useEffect(() => {
    start.current = Date.now();
    sent.current = false;
    send({ path: window.location.pathname + window.location.search, section });
    return () => {};
  }, [section]);

  // Dwell, flushed when the tab is hidden or the page unloads.
  useEffect(() => {
    const flush = () => {
      if (sent.current) return;
      sent.current = true;
      const dwellMs = Date.now() - start.current;
      if (dwellMs < 1000) return; // ignore bounces under a second
      send({ path: window.location.pathname + window.location.search, section, dwellMs });
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', flush);
    };
  }, [section]);
}
