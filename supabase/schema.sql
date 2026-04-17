-- VoltImpact Database Schema
-- Run this in your Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id            TEXT        UNIQUE NOT NULL,
  name                TEXT        NOT NULL,
  email               TEXT        NOT NULL,
  avatar_url          TEXT,
  role                TEXT        NOT NULL DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organizer')),
  onboarding_complete BOOLEAN     NOT NULL DEFAULT FALSE,
  total_hours         INTEGER     NOT NULL DEFAULT 0,
  tier                TEXT        NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  impact_score        INTEGER     NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── EVENTS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
  title            TEXT        NOT NULL,
  organization     TEXT        NOT NULL,
  description      TEXT        NOT NULL DEFAULT '',
  location         TEXT        NOT NULL,
  lat              DECIMAL(10,8),
  lng              DECIMAL(11,8),
  start_time       TIMESTAMPTZ NOT NULL,
  end_time         TIMESTAMPTZ NOT NULL,
  hours_credit     INTEGER     NOT NULL DEFAULT 2,
  max_participants INTEGER,
  check_in_hash    TEXT        NOT NULL,
  category         TEXT        NOT NULL DEFAULT 'Community',
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── HOURS LEDGER ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hours_ledger (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id    UUID        REFERENCES events(id) ON DELETE SET NULL,
  hours       INTEGER     NOT NULL,
  description TEXT        NOT NULL,
  verified    BOOLEAN     NOT NULL DEFAULT FALSE,
  proof_hash  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BADGES ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT        NOT NULL,
  description         TEXT        NOT NULL,
  icon                TEXT        NOT NULL,
  requirement_type    TEXT        NOT NULL CHECK (requirement_type IN ('hours','events','streak','special')),
  requirement_value   INTEGER     NOT NULL,
  rarity              TEXT        NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── USER BADGES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id        UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id  UUID        NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ─── EVENT PARTICIPANTS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_participants (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id      UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checked_in    BOOLEAN     NOT NULL DEFAULT FALSE,
  check_in_time TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_clerk_id          ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_role              ON users(role);
CREATE INDEX IF NOT EXISTS idx_hours_ledger_user_id    ON hours_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id     ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id     ON user_badges(user_id);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE hours_ledger      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges            ENABLE ROW LEVEL SECURITY;

-- Permissive policies (tighten in production with auth.uid())
CREATE POLICY "Public read users"        ON users             FOR SELECT USING (true);
CREATE POLICY "Users insert own"         ON users             FOR INSERT WITH CHECK (true);
CREATE POLICY "Users update own"         ON users             FOR UPDATE USING (true);
CREATE POLICY "Public read events"       ON events            FOR SELECT USING (true);
CREATE POLICY "Organizers insert events" ON events            FOR INSERT WITH CHECK (true);
CREATE POLICY "Organizers update events" ON events            FOR UPDATE USING (true);
CREATE POLICY "Public read badges"       ON badges            FOR SELECT USING (true);
CREATE POLICY "Ledger read"              ON hours_ledger      FOR SELECT USING (true);
CREATE POLICY "Ledger insert"            ON hours_ledger      FOR INSERT WITH CHECK (true);
CREATE POLICY "User badges read"         ON user_badges       FOR SELECT USING (true);
CREATE POLICY "User badges insert"       ON user_badges       FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants read"        ON event_participants FOR SELECT USING (true);
CREATE POLICY "Participants insert"      ON event_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants update"      ON event_participants FOR UPDATE USING (true);

-- ─── SEED: BADGES ─────────────────────────────────────────────────────────────
INSERT INTO badges (name, description, icon, requirement_type, requirement_value, rarity) VALUES
  ('First Step',        'Complete your first volunteer event',  '🌱', 'events', 1,    'common'),
  ('Ten Hours',         'Log 10 verified volunteer hours',      '⏰', 'hours',  10,   'common'),
  ('Community Builder', 'Attend 5 events',                      '🏘️', 'events', 5,    'rare'),
  ('Half Century',      'Log 50 volunteer hours',               '🎯', 'hours',  50,   'rare'),
  ('Century Club',      'Log 100 volunteer hours',              '💯', 'hours',  100,  'epic'),
  ('Impact Leader',     'Reach Gold tier (200h)',               '🥇', 'hours',  200,  'epic'),
  ('Streak Master',     'Volunteer 7 weeks in a row',           '🔥', 'streak', 7,    'rare'),
  ('Platinum Volunteer','Reach Platinum tier (500h)',           '💎', 'hours',  500,  'legendary')
ON CONFLICT DO NOTHING;

-- ─── SEED: EVENTS ─────────────────────────────────────────────────────────────
INSERT INTO events (title, organization, description, location, lat, lng, start_time, end_time, hours_credit, check_in_hash, category) VALUES
  ('Riverside Park Cleanup',  'Green City Initiative', 'Morning cleanup at Riverside Park. Gloves provided.',          'Riverside Park, New York',      40.8005, -73.9580, NOW()+INTERVAL '2 days',  NOW()+INTERVAL '2 days' +INTERVAL '3 hours', 3, 'PARK2026', 'Environment'),
  ('Youth Coding Workshop',   'Code for Kids',         'Teach programming to children aged 8–12.',                    'Community Center, Brooklyn',    40.6782, -73.9442, NOW()+INTERVAL '4 days',  NOW()+INTERVAL '4 days' +INTERVAL '4 hours', 4, 'CODE2026', 'Education'),
  ('Food Bank Sorting',       'City Food Bank',        'Sort and package food donations for families in need.',       'City Food Bank, Queens',        40.7282, -73.7949, NOW()+INTERVAL '7 days',  NOW()+INTERVAL '7 days' +INTERVAL '2 hours', 2, 'FOOD2026', 'Community'),
  ('Senior Tech Help',        'Silver Connect',        'Assist seniors with smartphones and computers.',              'Senior Center, Manhattan',      40.7580, -73.9855, NOW()+INTERVAL '10 days', NOW()+INTERVAL '10 days'+INTERVAL '3 hours', 3, 'TECH2026', 'Community'),
  ('Animal Shelter Walk',     'Paws & Hearts',         'Walk and socialize dogs at the local animal shelter.',        'City Animal Shelter, Bronx',    40.8448, -73.8648, NOW()+INTERVAL '1 day',   NOW()+INTERVAL '1 day'  +INTERVAL '2 hours', 2, 'PAWS2026', 'Animals')
ON CONFLICT DO NOTHING;
