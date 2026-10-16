import { useEffect, useRef } from 'react';

/**
 * Privacy-preserving, first-party analytics.
 *
 * There is no third-party script and no cookie: the only identifier is a random
 * visitor id minted per browser and stored in localStorage, and the payload is
 * the path, the section, an optional event name and a dwell time. Everything is
 * collected by our own Worker at POST /api/track, so no data leaves the origin.
 */

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

/** The named interactions worth counting, beyond a plain pageview or dwell. */
export type TrackEventName = 'cta' | 'outbound' | 'cv-download' | 'contact' | 'project-open' | 'profile-switch';

export type TrackPayload = {
  path: string;
  section?: string;
  dwellMs?: number;
  /** Named interaction. Absent for pageviews and dwell events. */
  event?: TrackEventName;
  /** Free-form detail — a label, a project id, a destination host. */
  detail?: string;
};

/** The visitor's browser language, reported so the admin portal can break down by locale. */
function detectLang(): string | undefined {
  const raw = navigator.languages?.[0] ?? navigator.language;
  const code = raw?.trim().toLowerCase().split(/[-_]/)[0];
  return code && /^[a-z]{2,3}$/.test(code) ? code : undefined;
}

/**
 * Fire-and-forget: analytics must never break the page or block paint.
 *
 * Named events are sent in their own `event` field. The Worker stores them as
 * their own event type, so they never inflate the pageview count — "how many
 * people pressed the CV button" stays a different number from "how many people
 * landed on the site".
 */
function send(payload: TrackPayload) {
  // The /api/track endpoint only exists in the deployed Worker; skip it in local
  // dev so the console isn't spammed with 404s for a request that can't succeed.
  if (import.meta.env.DEV) return;
  try {
    const body = JSON.stringify({
      visitorId: visitorId(),
      path: payload.path,
      section: payload.section,
      event: payload.event,
      detail: payload.detail,
      referrer: document.referrer || undefined,
      dwellMs: payload.dwellMs,
      lang: detectLang(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* analytics is best-effort */
  }
}

/**
 * Records a named interaction. Safe to call from anywhere — it is a no-op in
 * dev, when storage is blocked, or on any error.
 *
 * The events recorded are cta, outbound, cv-download, contact, project-open and
 * profile-switch, which together answer "what did visitors actually do" rather
 * than only "how long did they stay".
 */
export function track(event: TrackEventName, detail?: string, section?: string) {
  send({
    path: window.location.pathname + window.location.search,
    section,
    event,
    detail: detail?.slice(0, 120),
  });
}

/**
 * Records a named interaction on a click without changing behaviour: the handler
 * runs synchronously, then the event is queued.
 */
export function trackClick(event: TrackEventName, detail?: string) {
  return () => {
    try {
      track(event, detail);
    } catch {
      /* never block the click */
    }
  };
}

/** Hostname-only detail for an outbound link, so no full URL is stored. */
export function outboundDetail(href: string): string {
  try {
    return new URL(href, window.location.origin).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
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
