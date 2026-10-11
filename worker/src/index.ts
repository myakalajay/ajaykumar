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
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
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
      | { visitorId?: string; path?: string; section?: string; referrer?: string; dwellMs?: number }
      | null;
    if (!body?.visitorId || !body.path) return badRequest('visitorId and path required');

    const visitorId = String(body.visitorId).slice(0, 64);
    const page = String(body.path).slice(0, 2048);
    const referrer = (body.referrer ?? req.headers.get('referrer') ?? '').slice(0, 2048);
    const cf = (req as Request & { cf?: { country?: string; city?: string } }).cf ?? {};
    const ua = classifyUa(req.headers.get('user-agent') ?? '');
    const ts = nowIso();

    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO events (visitor_id, type, path, section, referrer, ts)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(
        visitorId,
        body.dwellMs ? 'dwell' : 'pageview',
        page,
        body.section ?? null,
        referrer || null,
        ts,
      ),
      env.DB.prepare(
        `INSERT INTO users (visitor_id, first_seen, last_seen, visits, page_views, total_ms, referrer, country, city, device, browser, os, landing_path)
         VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(visitor_id) DO UPDATE SET
           last_seen  = excluded.last_seen,
           visits     = CASE WHEN excluded.page_views > users.page_views THEN users.visits + 1 ELSE users.visits END,
           page_views = MAX(users.page_views, excluded.page_views),
           total_ms   = users.total_ms + excluded.total_ms,
           country    = COALESCE(excluded.country, users.country),
           city       = COALESCE(excluded.city, users.city)`,
      ).bind(
        visitorId,
        ts,
        ts,
        body.dwellMs ? 0 : 1,
        Math.min(Math.max(Math.round(body.dwellMs ?? 0), 0), 24 * 3600 * 1000),
        referrer || null,
        cf.country ?? null,
        cf.city ?? null,
        ua.device,
        ua.browser,
        ua.os,
        page,
      ),
    ]);
    return json({ ok: true });
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

  /* ── everything below requires an authenticated admin ── */
  const isSessionOk = await sessionValid(env.SESSION_SECRET, sessionFrom(req));
  if (!isSessionOk) return unauthorized();

  if (pathname === '/api/admin/stats' && method === 'GET') {
    const [totals, byDay, topPaths, recent] = await Promise.all([
      env.DB.prepare(
        `SELECT
           (SELECT COUNT(*) FROM users)                          AS visitors,
           (SELECT COUNT(*) FROM events WHERE type='pageview')   AS pageviews,
           (SELECT COUNT(*) FROM events WHERE ts >= datetime('now','-7 days'))  AS views_7d,
           (SELECT COUNT(*) FROM events WHERE ts >= datetime('now','-30 days')) AS views_30d,
           (SELECT COUNT(*) FROM messages)                       AS messages,
           (SELECT COUNT(*) FROM messages WHERE read = 0)        AS unread,
           (SELECT COUNT(*) FROM users WHERE last_seen >= datetime('now','-7 days'))  AS active_7d,
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
    ]);
    return json({
      totals,
      byDay: byDay.results,
      topPaths: topPaths.results,
      recentMessages: recent.results,
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
