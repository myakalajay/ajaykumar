-- Admin portal data model.
-- One admin account (no table — the password hash lives in a Worker secret).
-- "Users" here are site visitors identified by a stable anonymous visitor id.

CREATE TABLE IF NOT EXISTS users (
  visitor_id   TEXT PRIMARY KEY,          -- opaque id stored in the visitor's browser
  first_seen   TEXT NOT NULL,             -- ISO timestamp
  last_seen    TEXT NOT NULL,             -- ISO timestamp
  visits       INTEGER NOT NULL DEFAULT 0,
  page_views   INTEGER NOT NULL DEFAULT 0,
  total_ms     INTEGER NOT NULL DEFAULT 0,-- cumulative time on site
  referrer     TEXT,
  country      TEXT,
  city         TEXT,
  lang         TEXT,                -- ISO-639-1, from the browser or derived from country
  device       TEXT,                      -- desktop | mobile | tablet
  browser      TEXT,
  os           TEXT,
  landing_path TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id TEXT NOT NULL,
  type       TEXT NOT NULL,               -- 'pageview' | 'dwell'
  path       TEXT NOT NULL,
  section    TEXT,                        -- in-app section id, when known
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
  read      INTEGER NOT NULL DEFAULT 0,   -- 0 | 1
  createdat TEXT NOT NULL
);

-- Editable site content, stored as JSON blobs keyed by section.
CREATE TABLE IF NOT EXISTS content (
  key       TEXT PRIMARY KEY,             -- e.g. 'about', 'hero'
  value     TEXT NOT NULL,                -- JSON string
  updatedat TEXT NOT NULL
);
