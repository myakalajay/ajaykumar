/**
 * Admin portal API + static fallback.
 *
 * Serves /api/* (auth, analytics, users, messages, content) and hands every
 * other request to the static assets (the Vite portfolio + /admin UI).
 *
 * Bindings:
 *   env.DB                  D1 database (see schema.sql)
 *   env.ADMIN_PASSWORD_HASH sha256 hex of the admin password (secret)
 *   env.SESSION_SECRET      random 32+ char string for signing sessions (secret)
 */

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
}

/* ───────────────────────── helpers ───────────────────────── */

const enc = new TextEncoder();

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

const unauthorized = () => json({ error: 'Unauthorized' }, 401);
const badRequest = (msg: string) => json({ error: msg }, 400);
const notFound = () => json({ error: 'Not found' }, 404);

/**
 * The interactions the site is allowed to report. An allowlist, not free text:
 * the value becomes an events.type, which the admin analytics groups by.
 */
const TRACK_EVENTS = new Set(['cta', 'outbound', 'cv-download', 'contact', 'project-open', 'profile-switch']);

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time string comparison. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

/** Sessions are signed tokens ("exp.sig") stored in an HttpOnly cookie. */
const SESSION_COOKIE = 'ap_session';
const SESSION_TTL_S = 60 * 60 * 12; // 12h

async function issueSession(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  const sig = await hmacSign(secret, String(exp));
  return `${exp}.${sig}`;
}

async function sessionValid(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expRaw, sig] = token.split('.');
  const exp = Number(expRaw);
  if (!exp || !sig || exp * 1000 < Date.now()) return false;
  return timingSafeEqual(sig, await hmacSign(secret, expRaw));
}

function sessionFrom(req: Request): string | undefined {
  const cookie = req.headers.get('cookie') ?? '';
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return m?.[1];
}

/**
 * Reject cross-origin mutations outright: state-changing /api routes must come
 * from our own origin, not a hostile page replaying requests.
 */
function sameOrigin(req: Request): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;
  const origin = req.headers.get('origin');
  if (!origin) return true; // same-origin fetches from our SPA always send it in browsers, but beacons may not
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

/** Minimal UA classification for the visitors table. */
function classifyUa(ua: string): { device: string; browser: string; os: string } {
  const u = ua.toLowerCase();
  const device = /ipad|tablet/i.test(u) ? 'tablet' : /mobi|android|iphone/i.test(u) ? 'mobile' : 'desktop';
  const browser = /edg\//i.test(u) ? 'Edge' : /opr\//i.test(u) ? 'Opera' : /chrome\//i.test(u) ? 'Chrome' : /safari\//i.test(u) ? 'Safari' : /firefox\//i.test(u) ? 'Firefox' : 'Other';
  const os = /windows/i.test(u) ? 'Windows' : /android/i.test(u) ? 'Android' : /iphone|ipad|ios/i.test(u) ? 'iOS' : /mac os/i.test(u) ? 'macOS' : /linux/i.test(u) ? 'Linux' : 'Other';
  return { device, browser, os };
}

/** Normalize a browser language tag ("en-US", "ja") to a bare ISO-639-1 code ("ja"). */
function normalizeLang(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toLowerCase().split(/[-_]/)[0];
  return /^[a-z]{2,3}$/.test(code) ? code : null;
}

/**
 * Primary language per country/region, used when the browser doesn't report one
 * (or to geo-localise). Covers the regions this portfolio is seen from most.
 */
const COUNTRY_LANG: Record<string, string> = {
  AE: 'ar', SA: 'ar', QA: 'ar', KW: 'ar', OM: 'ar', BH: 'ar', JO: 'ar', EG: 'ar',
  JP: 'ja', KR: 'ko', CN: 'zh', TW: 'zh', HK: 'zh',
  DE: 'de', AT: 'de', CH: 'de', FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es', CL: 'es', CO: 'es',
  PT: 'pt', BR: 'pt', IT: 'it', NL: 'nl', RU: 'ru', TR: 'tr', IL: 'he',
  IN: 'en', US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en', SG: 'en',
  SE: 'sv', NO: 'no', DA: 'da', DK: 'da', FI: 'fi', PL: 'pl', CZ: 'cs', VN: 'vi', TH: 'th', ID: 'id',
};

/** Fall back to English for unmapped countries so the client always gets a usable code. */
function langFromCountry(country: string | null | undefined): string {
  if (!country) return 'en';
  return COUNTRY_LANG[country.toUpperCase()] ?? 'en';
}

const nowIso = () => new Date().toISOString();

/** In-memory login throttle (per-isolate, best effort). */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
function throttled(ip: string): boolean {
  const rec = loginAttempts.get(ip);
  if (!rec) return false;
  if (rec.resetAt < Date.now()) {
    loginAttempts.delete(ip);
    return false;
  }
  return rec.count >= 5;
}
function recordAttempt(ip: string) {
  const rec = loginAttempts.get(ip);
  const now = Date.now();
  if (!rec || rec.resetAt < now) loginAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
  else rec.count++;
}

/* ───────────────────── schema bootstrap ───────────────────── */

/**
 * DDL for every table the API reads/writes, mirroring schema.sql. All statements
 * are IF NOT EXISTS so this is safe to run on every isolate start. We create the
 * schema from the Worker itself so the deployed D1 is self-provisioning and does
 * not depend on an out-of-band `wrangler d1` push (which needs a Cloudflare API
 * token the runtime host does not have).
 */
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  visitor_id   TEXT PRIMARY KEY,
  first_seen   TEXT NOT NULL,
  last_seen    TEXT NOT NULL,
  visits       INTEGER NOT NULL DEFAULT 0,
  page_views   INTEGER NOT NULL DEFAULT 0,
  total_ms     INTEGER NOT NULL DEFAULT 0,
  referrer     TEXT,
  country      TEXT,
  city         TEXT,
  lang         TEXT,
  device       TEXT,
  browser      TEXT,
  os           TEXT,
  landing_path TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  type       TEXT NOT NULL,
  path       TEXT NOT NULL,
  section    TEXT,
  referrer   TEXT,
  ts         TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_ts      ON events(ts);
CREATE TABLE IF NOT EXISTS messages (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  subject   TEXT,
  body      TEXT NOT NULL,
  read      INTEGER NOT NULL DEFAULT 0,
  createdat TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS content (
  key       TEXT PRIMARY KEY,
  value     TEXT NOT NULL,
  updatedat TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS experience (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  org        TEXT NOT NULL,
  place      TEXT,
  period     TEXT,
  tagline    TEXT,
  url        TEXT,
  highlight  TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  createdat  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS certifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  issuer     TEXT,
  issued     TEXT,
  url        TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  createdat  TEXT NOT NULL
);
`;

/**
 * Per-isolate memo of the ensure-schema promise. Isolates are reused across
 * requests, so the DDL runs at most once per isolate; the promise is cached so
 * concurrent first requests don't each fire the batch.
 */
let schemaReady: Promise<void> | null = null;
function ensureSchema(db: D1Database): Promise<void> {
  if (!schemaReady) {
    // Clear the cache on failure so a later request retries instead of caching a rejection.
    schemaReady = db
      .batch(SCHEMA_SQL.split(';').map((s) => s.trim()).filter(Boolean).map((s) => db.prepare(s)))
      .then(() => migrate(db))
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

/** Coerce an untrusted JSON value to a trimmed string, or null when empty. */
function str(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 2000) : null;
}

/**
 * Additive migrations, run after the create-table batch.
 *
 * `CREATE TABLE IF NOT EXISTS` cannot widen a table that already exists, so a
 * column added to the DDL later never reaches a database provisioned before it.
 * Each column is probed first, which makes a repeat run a no-op rather than a
 * hard D1 error.
 *
 * The indexes live here rather than in the DDL above for the same reason:
 * `CREATE INDEX ... ON experience(sort_order)` fails outright on a database whose
 * `experience` table predates that column — and since the DDL is one batch, that
 * single failure took every /api route down with it.
 */
async function migrate(db: D1Database): Promise<void> {
  await addColumnsIfMissing(db, 'users', [['lang', 'TEXT']]);
  await addColumnsIfMissing(db, 'experience', [
    ['place', 'TEXT'],
    ['period', 'TEXT'],
    ['sort_order', 'INTEGER NOT NULL DEFAULT 0'],
  ]);
  await addColumnsIfMissing(db, 'certifications', [['sort_order', 'INTEGER NOT NULL DEFAULT 0']]);
  await db.batch([
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_certifications_issued ON certifications(issued)`),
  ]);
}

/** D1 has no `ADD COLUMN IF NOT EXISTS`; read the table once, then add what is absent. */
async function addColumnsIfMissing(db: D1Database, table: string, columns: [string, string][]): Promise<void> {
  const info = await db.prepare(`PRAGMA table_info(${table})`).all();
  const present = new Set((info.results as { name: string }[]).map((c) => c.name));
  for (const [column, type] of columns) {
    if (!present.has(column)) await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
  }
}

/* ───────────────────────── routing ───────────────────────── */

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith('/api/')) {
      if (!sameOrigin(req)) return json({ error: 'Forbidden origin' }, 403);
      try {
        // Provision tables before any handler touches D1 (no-op once created).
        await ensureSchema(env.DB);
        return await handleApi(req, env, url);
      } catch (err) {
        console.error('api error', err);
        return json({ error: 'Internal error' }, 500);
      }
    }
    // Serve the admin portal at the clean /admin path (assets are served as
    // static files; a directory URL has no index unless we rewrite it here).
    if (path === '/admin') {
      const rewrite = new Request(new URL('/admin/index.html', req.url), req);
      return env.ASSETS.fetch(rewrite);
    }
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;

async function handleApi(req: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;
  const method = req.method;

  /* ── public: login ── */
  if (pathname === '/api/auth/login' && method === 'POST') {
    const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
    if (throttled(ip)) return json({ error: 'Too many attempts — try again later' }, 429);
    recordAttempt(ip);

    const body = (await req.json().catch(() => null)) as { password?: string } | null;
    if (!body?.password) return badRequest('Password required');

    const hash = await sha256Hex(body.password);
    const expected = (env.ADMIN_PASSWORD_HASH ?? '').toLowerCase();
    if (!expected || !timingSafeEqual(hash, expected)) return json({ error: 'Invalid password' }, 401);

    const token = await issueSession(env.SESSION_SECRET);
    return json({ ok: true }, 200, {
      'set-cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_S}`,
    });
  }

  /* ── public: session check + logout ── */
  if (pathname === '/api/auth/me' && method === 'POST') {
    const ok = await sessionValid(env.SESSION_SECRET, sessionFrom(req));
    return json({ authenticated: ok });
  }
  if (pathname === '/api/auth/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'set-cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` });
  }

  /* ── public: track a visit (beacon from the site) ── */
  if (pathname === '/api/track' && method === 'POST') {
    const body = (await req.json().catch(() => null)) as
      | {
          visitorId?: string;
          path?: string;
          section?: string;
          referrer?: string;
          dwellMs?: number;
          lang?: string;
          event?: string;
          detail?: string;
        }
      | null;
    if (!body?.visitorId || !body.path) return badRequest('visitorId and path required');

    // Named interactions arrive in their own field and are stored as their own
    // event type: they must never be counted as pageviews. An unrecognised name
    // is still an interaction, not an arrival, so it is stored as a plain 'event'
    // rather than silently falling through to a pageview.
    const rawEvent = typeof body.event === 'string' ? body.event.slice(0, 40) : undefined;
    const event = rawEvent && TRACK_EVENTS.has(rawEvent) ? rawEvent : undefined;
    const kind = event ?? (rawEvent ? 'event' : body.dwellMs ? 'dwell' : 'pageview');

    const visitorId = String(body.visitorId).slice(0, 64);
    const page = String(body.path).slice(0, 2048);
    const referrer = (body.referrer ?? req.headers.get('referrer') ?? '').slice(0, 2048);
    const cf = (req as Request & { cf?: { country?: string; city?: string } }).cf ?? {};
    const ua = classifyUa(req.headers.get('user-agent') ?? '');
    // Prefer the browser-reported language, else fall back to Cloudflare's country-derived language.
    const lang = normalizeLang(body.lang) ?? langFromCountry(cf.country);
    const ts = nowIso();

    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO events (visitor_id, type, path, section, referrer, ts)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(
        visitorId,
        kind,
        page,
        (event && body.detail ? `${event}:${String(body.detail).slice(0, 120)}` : body.section) ?? null,
        referrer || null,
        ts,
      ),
      env.DB.prepare(
        `INSERT INTO users (visitor_id, first_seen, last_seen, visits, page_views, total_ms, referrer, country, city, lang, device, browser, os, landing_path)
         VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(visitor_id) DO UPDATE SET
           last_seen  = excluded.last_seen,
           visits     = CASE WHEN excluded.page_views > users.page_views THEN users.visits + 1 ELSE users.visits END,
           page_views = MAX(users.page_views, excluded.page_views),
           total_ms   = users.total_ms + excluded.total_ms,
           country    = COALESCE(excluded.country, users.country),
           city       = COALESCE(excluded.city, users.city),
           lang       = COALESCE(excluded.lang, users.lang)`,
      ).bind(
        visitorId,
        ts,
        ts,
        kind === 'pageview' ? 1 : 0,
        Math.min(Math.max(Math.round(body.dwellMs ?? 0), 0), 24 * 3600 * 1000),
        referrer || null,
        cf.country ?? null,
        cf.city ?? null,
        lang,
        ua.device,
        ua.browser,
        ua.os,
        page,
      ),
    ]);
    return json({ ok: true });
  }

  /* ── public: geo + language, for client-side localisation ── */
  if (pathname === '/api/geo' && method === 'GET') {
    const cf = (req as Request & { cf?: { country?: string; city?: string; continent?: string } }).cf ?? {};
    const country = cf.country ?? null;
    return json({
      country,
      city: cf.city ?? null,
      continent: cf.continent ?? null,
      lang: langFromCountry(country),
    });
  }

  /* ── public: contact form ── */
  if (pathname === '/api/contact' && method === 'POST') {
    const body = (await req.json().catch(() => null)) as
      | { name?: string; email?: string; subject?: string; body?: string }
      | null;
    if (!body?.name || !body.email || !body.body) return badRequest('name, email and body are required');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) return badRequest('Invalid email');
    if (body.body.length > 5000 || body.name.length > 200) return badRequest('Message too long');

    await env.DB.prepare(
      `INSERT INTO messages (name, email, subject, body, createdat) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(body.name.slice(0, 200), body.email.slice(0, 320), (body.subject ?? '').slice(0, 300) || null, body.body.slice(0, 5000), nowIso())
      .run();
    return json({ ok: true }, 201);
  }

  /* ── public: the published CV module ──
     The site renders these; the admin portal writes them. Serving them from D1
     is what lets the CV be edited without a redeploy. When nothing has been
     published the site falls back to its bundled defaults. */
  if (pathname === '/api/cv' && method === 'GET') {
    const row = await env.DB.prepare(`SELECT value, updatedat FROM content WHERE key = 'cv'`).first<{
      value: string;
      updatedat: string;
    }>();
    let cv: unknown = null;
    if (row) {
      try {
        cv = JSON.parse(row.value);
      } catch {
        cv = null; // malformed row: fall back to the bundled default
      }
    }
    return json({ cv, updatedat: row?.updatedat ?? null }, 200, { 'cache-control': 'public, max-age=60' });
  }

  if (pathname === '/api/experience' && method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT id, title, org, tagline, url, highlight, period, place, createdat
       FROM experience ORDER BY sort_order, id`,
    ).all();
    return json({ experience: rows.results }, 200, { 'cache-control': 'public, max-age=60' });
  }

  if (pathname === '/api/certifications' && method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT id, title, issuer, issued, url, createdat FROM certifications ORDER BY issued DESC, id`,
    ).all();
    return json({ certifications: rows.results }, 200, { 'cache-control': 'public, max-age=60' });
  }

  /* ── everything below requires an authenticated admin ── */
  const isSessionOk = await sessionValid(env.SESSION_SECRET, sessionFrom(req));
  if (!isSessionOk) return unauthorized();

  if (pathname === '/api/admin/stats' && method === 'GET') {
    const [totals, byDay, topPaths, recent, byCountry, byLang, byDevice, topCities, byEvent, bySection] = await Promise.all([
      env.DB.prepare(
        `SELECT
           (SELECT COUNT(*) FROM users)                          AS visitors,
           (SELECT COUNT(*) FROM events WHERE type='pageview')   AS pageviews,
           (SELECT COUNT(*) FROM events WHERE ts >= datetime('now','-7 days'))  AS views_7d,
           (SELECT COUNT(*) FROM events WHERE ts >= datetime('now','-30 days')) AS views_30d,
           (SELECT COUNT(*) FROM messages)                       AS messages,
           (SELECT COUNT(*) FROM messages WHERE read = 0)        AS unread,
           (SELECT COUNT(*) FROM users WHERE last_seen >= datetime('now','-7 days'))  AS active_7d,
           (SELECT COUNT(DISTINCT country) FROM users WHERE country IS NOT NULL)      AS countries,
           (SELECT IFNULL(AVG(total_ms),0) FROM users)           AS avg_ms`,
      ).first(),
      env.DB.prepare(
        `SELECT substr(ts,1,10) AS day, COUNT(*) AS views
         FROM events WHERE type='pageview' AND ts >= datetime('now','-30 days')
         GROUP BY day ORDER BY day`,
      ).all(),
      env.DB.prepare(
        `SELECT path, COUNT(*) AS views FROM events WHERE type='pageview'
         GROUP BY path ORDER BY views DESC LIMIT 10`,
      ).all(),
      env.DB.prepare(
        `SELECT id, name, email, subject, read, createdat FROM messages
         ORDER BY createdat DESC LIMIT 5`,
      ).all(),
      // Where in the world the audience is — visitors, views and share per country.
      env.DB.prepare(
        `SELECT country, COUNT(*) AS visitors, SUM(page_views) AS views
         FROM users WHERE country IS NOT NULL
         GROUP BY country ORDER BY visitors DESC LIMIT 15`,
      ).all(),
      // Preferred language per visitor — powers the locale feature.
      env.DB.prepare(
        `SELECT lang, COUNT(*) AS visitors FROM users WHERE lang IS NOT NULL
         GROUP BY lang ORDER BY visitors DESC LIMIT 12`,
      ).all(),
      env.DB.prepare(
        `SELECT device, COUNT(*) AS visitors FROM users WHERE device IS NOT NULL
         GROUP BY device ORDER BY visitors DESC`,
      ).all(),
      env.DB.prepare(
        `SELECT city, country, COUNT(*) AS visitors FROM users
         WHERE city IS NOT NULL GROUP BY city, country ORDER BY visitors DESC LIMIT 12`,
      ).all(),
      // What visitors actually did: presses, not just arrivals. Named events are
      // stored as their own type, so `pageview`/`dwell` never appear here.
      env.DB.prepare(
        `SELECT type, COUNT(*) AS count, COUNT(DISTINCT visitor_id) AS visitors
         FROM events WHERE type NOT IN ('pageview','dwell')
         GROUP BY type ORDER BY count DESC`,
      ).all(),
      // Which sections hold attention.
      env.DB.prepare(
        `SELECT section, COUNT(*) AS views FROM events
         WHERE type = 'pageview' AND section IS NOT NULL
         GROUP BY section ORDER BY views DESC LIMIT 12`,
      ).all(),
    ]);
    return json({
      totals,
      byDay: byDay.results,
      topPaths: topPaths.results,
      recentMessages: recent.results,
      byCountry: byCountry.results,
      byLang: byLang.results,
      byDevice: byDevice.results,
      topCities: topCities.results,
      byEvent: byEvent.results,
      bySection: bySection.results,
    });
  }

  if (pathname === '/api/admin/users' && method === 'GET') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200);
    const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);
    const q = url.searchParams.get('q')?.trim();
    const where = q ? `WHERE visitor_id LIKE ?1 OR country LIKE ?1 OR city LIKE ?1 OR os LIKE ?1 OR browser LIKE ?1` : '';
    const args = q ? [`%${q}%`, limit, offset] : [limit, offset];
    const rows = await env.DB.prepare(
      `SELECT * FROM users ${where} ORDER BY last_seen DESC LIMIT ?${q ? 2 : 1} OFFSET ?${q ? 3 : 2}`,
    )
      .bind(...args)
      .all();
    const total = await env.DB.prepare(`SELECT COUNT(*) AS n FROM users ${where ? 'WHERE visitor_id LIKE ?1 OR country LIKE ?1 OR city LIKE ?1 OR os LIKE ?1 OR browser LIKE ?1' : ''}`)
      .bind(...(q ? [`%${q}%`] : []))
      .first();
    return json({ users: rows.results, total: total?.n ?? 0 });
  }

  if (pathname.startsWith('/api/admin/users/') && method === 'GET') {
    const id = decodeURIComponent(pathname.split('/').pop() ?? '');
    if (!id) return badRequest('Missing visitor id');
    const user = await env.DB.prepare(`SELECT * FROM users WHERE visitor_id = ?`).bind(id).first();
    if (!user) return notFound();
    const events = await env.DB.prepare(
      `SELECT type, path, section, ts FROM events WHERE visitor_id = ? ORDER BY ts DESC LIMIT 100`,
    )
      .bind(id)
      .all();
    return json({ user, events: events.results });
  }

  if (pathname === '/api/admin/messages' && method === 'GET') {
    const rows = await env.DB.prepare(`SELECT * FROM messages ORDER BY createdat DESC LIMIT 200`).all();
    return json({ messages: rows.results });
  }

  if (pathname.startsWith('/api/admin/messages/') && method === 'PATCH') {
    const id = Number(pathname.split('/').pop());
    if (!Number.isFinite(id)) return badRequest('Bad id');
    const body = (await req.json().catch(() => null)) as { read?: boolean } | null;
    if (typeof body?.read !== 'boolean') return badRequest('read required');
    await env.DB.prepare(`UPDATE messages SET read = ? WHERE id = ?`).bind(body.read ? 1 : 0, id).run();
    return json({ ok: true });
  }

  if (pathname.startsWith('/api/admin/messages/') && method === 'DELETE') {
    const id = Number(pathname.split('/').pop());
    if (!Number.isFinite(id)) return badRequest('Bad id');
    await env.DB.prepare(`DELETE FROM messages WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  }

  if (pathname === '/api/admin/content' && method === 'GET') {
    const rows = await env.DB.prepare(`SELECT key, value, updatedat FROM content`).all();
    const out: Record<string, unknown> = {};
    for (const r of rows.results as { key: string; value: string }[]) {
      try {
        out[r.key] = JSON.parse(r.value);
      } catch {
        /* skip malformed */
      }
    }
    return json({ content: out });
  }

  /* ── admin: experience ──
     The career history the site renders in the Résumé module. One row per role;
     `sort_order` keeps the CV order (newest first) regardless of insertion order. */
  if (pathname === '/api/admin/experience' && method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT id, title, org, place, period, tagline, url, highlight, sort_order, createdat
       FROM experience ORDER BY sort_order, id`,
    ).all();
    return json({ experience: rows.results });
  }

  if (pathname === '/api/admin/experience' && method === 'POST') {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const title = str(body?.title);
    const org = str(body?.org);
    if (!title || !org) return badRequest('title and org are required');
    const next = await env.DB.prepare(`SELECT IFNULL(MAX(sort_order), -1) + 1 AS n FROM experience`).first<{ n: number }>();
    const res = await env.DB.prepare(
      `INSERT INTO experience (title, org, place, period, tagline, url, highlight, sort_order, createdat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(title, org, str(body?.place), str(body?.period), str(body?.tagline), str(body?.url), str(body?.highlight), next?.n ?? 0, nowIso())
      .run();
    return json({ ok: true, id: res.meta.last_row_id }, 201);
  }

  if (pathname.startsWith('/api/admin/experience/') && (method === 'PUT' || method === 'DELETE')) {
    const id = Number(pathname.split('/').pop());
    if (!Number.isInteger(id)) return badRequest('Bad id');
    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM experience WHERE id = ?`).bind(id).run();
      return json({ ok: true });
    }
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest('Body required');
    const existing = await env.DB.prepare(`SELECT * FROM experience WHERE id = ?`).bind(id).first<Record<string, unknown>>();
    if (!existing) return notFound();
    const pick = (key: string) => (key in body ? str(body[key]) : (existing[key] as string | null));
    const title = pick('title');
    const org = pick('org');
    if (!title || !org) return badRequest('title and org are required');
    await env.DB.prepare(
      `UPDATE experience SET title=?, org=?, place=?, period=?, tagline=?, url=?, highlight=? WHERE id=?`,
    )
      .bind(title, org, pick('place'), pick('period'), pick('tagline'), pick('url'), pick('highlight'), id)
      .run();
    return json({ ok: true });
  }

  /* ── admin: certifications ── */
  if (pathname === '/api/admin/certifications' && method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT id, title, issuer, issued, url, sort_order, createdat FROM certifications ORDER BY sort_order, id`,
    ).all();
    return json({ certifications: rows.results });
  }

  if (pathname === '/api/admin/certifications' && method === 'POST') {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const title = str(body?.title);
    if (!title) return badRequest('title is required');
    const next = await env.DB.prepare(`SELECT IFNULL(MAX(sort_order), -1) + 1 AS n FROM certifications`).first<{ n: number }>();
    const res = await env.DB.prepare(
      `INSERT INTO certifications (title, issuer, issued, url, sort_order, createdat) VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(title, str(body?.issuer), str(body?.issued), str(body?.url), next?.n ?? 0, nowIso())
      .run();
    return json({ ok: true, id: res.meta.last_row_id }, 201);
  }

  if (pathname.startsWith('/api/admin/certifications/') && (method === 'PUT' || method === 'DELETE')) {
    const id = Number(pathname.split('/').pop());
    if (!Number.isInteger(id)) return badRequest('Bad id');
    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM certifications WHERE id = ?`).bind(id).run();
      return json({ ok: true });
    }
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return badRequest('Body required');
    const existing = await env.DB.prepare(`SELECT * FROM certifications WHERE id = ?`).bind(id).first<Record<string, unknown>>();
    if (!existing) return notFound();
    const pick = (key: string) => (key in body ? str(body[key]) : (existing[key] as string | null));
    const title = pick('title');
    if (!title) return badRequest('title is required');
    await env.DB.prepare(`UPDATE certifications SET title=?, issuer=?, issued=?, url=? WHERE id=?`)
      .bind(title, pick('issuer'), pick('issued'), pick('url'), id)
      .run();
    return json({ ok: true });
  }

  if (pathname.startsWith('/api/admin/content/') && method === 'PUT') {
    const key = decodeURIComponent(pathname.split('/').pop() ?? '');
    if (!/^[a-z][a-z0-9-]{0,40}$/.test(key)) return badRequest('Bad key');
    const body = (await req.json().catch(() => null)) as { value?: unknown } | null;
    if (body?.value === undefined) return badRequest('value required');
    const serialized = JSON.stringify(body.value);
    if (serialized.length > 100_000) return badRequest('Content too large');
    await env.DB.prepare(
      `INSERT INTO content (key, value, updatedat) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedat = excluded.updatedat`,
    )
      .bind(key, serialized, nowIso())
      .run();
    return json({ ok: true });
  }

  return notFound();
}
