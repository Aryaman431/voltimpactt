-- VoltImpact Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  total_hours INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  impact_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENTS table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  hours_credit INTEGER NOT NULL DEFAULT 2,
  max_participants INTEGER,
  check_in_hash TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Community',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HOURS_LEDGER table (Proof of Impact)
CREATE TABLE IF NOT EXISTS hours_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  hours INTEGER NOT NULL,
  description TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  proof_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BADGES table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('hours', 'events', 'streak', 'special')),
  requirement_value INTEGER NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USER_BADGES junction table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- EVENT_PARTICIPANTS table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_hours_ledger_user_id ON hours_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_hours_ledger_created_at ON hours_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hours_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for anon key — tighten in production)
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (true);

CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);

CREATE POLICY "Users read own ledger" ON hours_ledger FOR SELECT USING (true);
CREATE POLICY "Users insert own ledger" ON hours_ledger FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read own badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users insert own badges" ON user_badges FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read participants" ON event_participants FOR SELECT USING (true);
CREATE POLICY "Users insert participants" ON event_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Users update participants" ON event_participants FOR UPDATE USING (true);

-- Seed data: Badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value, rarity) VALUES
  ('First Step', 'Complete your first volunteer event', '🌱', 'events', 1, 'common'),
  ('Ten Hours', 'Log 10 verified volunteer hours', '⏰', 'hours', 10, 'common'),
  ('Community Builder', 'Attend 5 events', '🏘️', 'events', 5, 'rare'),
  ('Century Club', 'Log 100 volunteer hours', '💯', 'hours', 100, 'epic'),
  ('Impact Leader', 'Reach Gold tier', '🥇', 'hours', 200, 'epic'),
  ('Platinum Volunteer', 'Reach Platinum tier', '💎', 'hours', 500, 'legendary'),
  ('Streak Master', 'Volunteer 7 weeks in a row', '🔥', 'streak', 7, 'rare'),
  ('Half Century', 'Log 50 volunteer hours', '🎯', 'hours', 50, 'rare')
ON CONFLICT DO NOTHING;

-- Seed data: Sample events
INSERT INTO events (title, organization, description, location, lat, lng, start_time, end_time, hours_credit, check_in_hash, category) VALUES
  ('Park Cleanup Drive', 'Green City Initiative', 'Join us for a morning of cleaning up Riverside Park. Gloves and bags provided.', 'Riverside Park, Main St', 40.7128, -74.0060, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '3 hours', 3, 'PARK2026', 'Environment'),
  ('Youth Coding Workshop', 'Code for Kids', 'Teach basic programming concepts to children aged 8-12. No experience needed.', 'Community Center, 5th Ave', 40.7580, -73.9855, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '4 hours', 4, 'CODE2026', 'Education'),
  ('Food Bank Sorting', 'City Food Bank', 'Help sort and package food donations for distribution to families in need.', 'City Food Bank, Oak St', 40.7282, -73.7949, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 2, 'FOOD2026', 'Community'),
  ('Senior Tech Help', 'Silver Connect', 'Assist seniors with smartphones, tablets, and computers at the community center.', 'Senior Center, Elm Ave', 40.6892, -74.0445, NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '3 hours', 3, 'TECH2026', 'Community'),
  ('Animal Shelter Walk', 'Paws & Hearts', 'Walk and socialize dogs at the local animal shelter. All breeds welcome.', 'City Animal Shelter', 40.7489, -73.9680, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 2, 'PAWS2026', 'Animals')
ON CONFLICT DO NOTHING;
