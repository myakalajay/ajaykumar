-- schema.sql — the D1 schema for the admin-portal API.
--
-- Reference copy of the DDL the Worker runs at startup (SCHEMA_SQL in
-- worker/src/index.ts). The Worker creates these tables itself so a deploy is
-- self-provisioning; this file exists so the schema can be read, reviewed and
-- applied by hand (`wrangler d1 execute`). Keep the two in step.
--
-- "Users" here are site visitors identified by a stable anonymous visitor id.

CREATE TABLE IF NOT EXISTS users (
  visitor_id   TEXT PRIMARY KEY,            -- opaque id stored in the visitor's browser
  first_seen   TEXT NOT NULL,               -- ISO timestamp
  last_seen    TEXT NOT NULL,               -- ISO timestamp
  visits       INTEGER NOT NULL DEFAULT 0,
  page_views   INTEGER NOT NULL DEFAULT 0,
  total_ms     INTEGER NOT NULL DEFAULT 0,  -- cumulative time on site
  referrer     TEXT,
  country      TEXT,
  city         TEXT,
  lang         TEXT,                        -- ISO-639-1, from the browser or derived from country
  device       TEXT,                        -- desktop | mobile | tablet
  browser      TEXT,
  os           TEXT,
  landing_path TEXT
);

-- One row per reported interaction: 'pageview', 'dwell', or a named event
-- ('cta', 'cv-download', 'outbound', 'project-open', 'profile-switch', 'contact').
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  type       TEXT NOT NULL,
  path       TEXT NOT NULL,
  section    TEXT,                          -- in-app section id, or "<event>:<detail>"
  referrer   TEXT,
  ts         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_visitor ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_ts      ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_type    ON events(type);

CREATE TABLE IF NOT EXISTS messages (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  subject   TEXT,
  body      TEXT NOT NULL,
  read      INTEGER NOT NULL DEFAULT 0,
  createdat TEXT NOT NULL
);

-- Editable site content, stored as JSON blobs keyed by section.
-- The CV module lives under the key 'cv'; the site falls back to its bundled
-- defaults when the key is absent.
CREATE TABLE IF NOT EXISTS content (
  key       TEXT PRIMARY KEY,               -- e.g. 'about', 'hero', 'cv'
  value     TEXT NOT NULL,                  -- JSON string
  updatedat TEXT NOT NULL
);

-- ── Experience ──────────────────────────────────────────────────────────────
-- One row per career-history entry. Rendered by the Résumé module on the site
-- and editable in the admin portal; `sort_order` preserves the CV order.

CREATE TABLE IF NOT EXISTS experience (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,                 -- Job title
  org        TEXT NOT NULL,                 -- Organisation
  place      TEXT,                          -- Location, when the CV gives one
  period     TEXT,                          -- e.g. 'Apr 2024 – May 2026'
  tagline    TEXT,                          -- One-line descriptor shown inline
  url        TEXT,                          -- Case-study link (nullable)
  highlight  TEXT,                          -- 1–2 sentence impact statement
  sort_order INTEGER NOT NULL DEFAULT 0,
  createdat  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);

-- ── Certifications ──────────────────────────────────────────────────────────
-- One row per credential, rendered as a chip row under the Résumé intro.
-- The current CV lists none, so this table stays empty until one is added.

CREATE TABLE IF NOT EXISTS certifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,                 -- Credential name
  issuer     TEXT,                          -- Awarding body
  issued     TEXT,                          -- Year or date range
  url        TEXT,                          -- Landing page for the certificate (nullable)
  sort_order INTEGER NOT NULL DEFAULT 0,
  createdat  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_certifications_issued ON certifications(issued);
