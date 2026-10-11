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

/** Fire-and-forget: analytics must never break the page or block paint. */
function send(payload: TrackPayload) {
  try {
    const body = JSON.stringify({
      visitorId: visitorId(),
      path: payload.path,
      section: payload.section,
      referrer: document.referrer || undefined,
      dwellMs: payload.dwellMs,
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
