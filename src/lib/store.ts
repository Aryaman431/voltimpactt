/**
 * VoltImpact — Central Zustand Store
 *
 * Single source of truth for all app state.
 * Every page reads from and writes to this store so actions
 * in one place (check-in, redeem, like) reflect everywhere.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTierFromHours } from "@/lib/utils";
import type { MockBadge, MockReward } from "@/lib/mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Tier = "bronze" | "silver" | "gold" | "platinum";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  total_hours: number;
  tier: Tier;
  impact_score: number;
  streak_weeks: number;
  joined_event_ids: string[];   // events user has joined/registered
  attended_event_ids: string[]; // events user has checked in to
  redeemed_reward_ids: string[];
  earned_badge_ids: string[];
  created_at: string;
}

export interface AppEvent {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  lat: number | null;
  lng: number | null;
  start_time: string;
  end_time: string;
  hours_credit: number;
  max_participants: number | null;
  check_in_hash: string;
  category: string;
  participant_ids: string[]; // all users who attended
}

export interface FeedItem {
  id: string;
  user_id: string;
  user_name: string;
  user_tier: Tier;
  action_type: "check_in" | "badge_earned" | "reward_redeemed" | "joined";
  event_title?: string;
  badge_name?: string;
  reward_title?: string;
  hours?: number;
  timestamp: string;
  likes: number;
  liked_by: string[]; // user ids who liked
}

export interface LedgerEntry {
  id: string;
  event_id: string | null;
  hours: number;
  description: string;
  verified: boolean;
  proof_hash: string | null;
  created_at: string;
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface VoltStore {
  // State
  user: AppUser;
  events: AppEvent[];
  badges: MockBadge[];
  rewards: MockReward[];
  feed: FeedItem[];
  ledger: LedgerEntry[];
  leaderboard: LeaderboardUser[];

  // Actions
  checkInToEvent: (eventId: string) => void;
  joinEvent: (eventId: string) => void;
  redeemReward: (rewardId: string) => void;
  toggleLike: (feedItemId: string) => void;
  addFeedItem: (item: Omit<FeedItem, "id" | "likes" | "liked_by">) => void;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  tier: Tier;
  total_hours: number;
  impact_score: number;
  avatar_url: string | null;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_USER: AppUser = {
  id: "usr_demo_001",
  name: "Alex Rivera",
  email: "alex@voltimpact.app",
  avatar_url: null,
  total_hours: 87,
  tier: "silver",
  impact_score: 2340,
  streak_weeks: 3,
  joined_event_ids: ["evt_001", "evt_002"],
  attended_event_ids: ["evt_006", "evt_007"],
  redeemed_reward_ids: [],
  earned_badge_ids: ["b01", "b02", "b03", "b04"],
  created_at: "2024-09-15T10:00:00Z",
};

const now = Date.now();

const INITIAL_EVENTS: AppEvent[] = [
  {
    id: "evt_001",
    title: "Riverside Park Cleanup",
    organization: "Green City Initiative",
    description: "Join us for a morning of cleaning up Riverside Park. Gloves and bags provided. All ages welcome.",
    location: "Riverside Park, New York",
    lat: 40.8005, lng: -73.9580,
    start_time: new Date(now + 1000 * 60 * 60 * 48).toISOString(),
    end_time:   new Date(now + 1000 * 60 * 60 * 51).toISOString(),
    hours_credit: 3, max_participants: 40, check_in_hash: "PARK2026",
    category: "Environment", participant_ids: ["usr_demo_001", "usr_002", "usr_003"],
  },
  {
    id: "evt_002",
    title: "Youth Coding Workshop",
    organization: "Code for Kids",
    description: "Teach basic programming to children aged 8–12. No prior teaching experience needed — just enthusiasm.",
    location: "Community Center, Brooklyn",
    lat: 40.6782, lng: -73.9442,
    start_time: new Date(now + 1000 * 60 * 60 * 96).toISOString(),
    end_time:   new Date(now + 1000 * 60 * 60 * 100).toISOString(),
    hours_credit: 4, max_participants: 20, check_in_hash: "CODE2026",
    category: "Education", participant_ids: ["usr_demo_001", "usr_004"],
  },
  {
    id: "evt_003",
    title: "Food Bank Sorting",
    organization: "City Food Bank",
    description: "Help sort and package food donations for distribution to families in need across the city.",
    location: "City Food Bank, Queens",
    lat: 40.7282, lng: -73.7949,
    start_time: new Date(now + 1000 * 60 * 60 * 168).toISOString(),
    end_time:   new Date(now + 1000 * 60 * 60 * 170).toISOString(),
    hours_credit: 2, max_participants: 30, check_in_hash: "FOOD2026",
    category: "Community", participant_ids: ["usr_002", "usr_005"],
  },
  {
    id: "evt_004",
    title: "Senior Tech Help",
    organization: "Silver Connect",
    description: "Assist seniors with smartphones, tablets, and computers. Patience and kindness are the only requirements.",
    location: "Senior Center, Manhattan",
    lat: 40.7580, lng: -73.9855,
    start_time: new Date(now + 1000 * 60 * 60 * 240).toISOString(),
    end_time:   new Date(now + 1000 * 60 * 60 * 243).toISOString(),
    hours_credit: 3, max_participants: 15, check_in_hash: "TECH2026",
    category: "Community", participant_ids: ["usr_003"],
  },
  {
    id: "evt_005",
    title: "Animal Shelter Walk",
    organization: "Paws & Hearts",
    description: "Walk and socialize dogs at the local animal shelter. Helps with their mental health and adoption chances.",
    location: "City Animal Shelter, Bronx",
    lat: 40.8448, lng: -73.8648,
    start_time: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
    end_time:   new Date(now + 1000 * 60 * 60 * 26).toISOString(),
    hours_credit: 2, max_participants: 25, check_in_hash: "PAWS2026",
    category: "Animals", participant_ids: ["usr_004", "usr_005"],
  },
  {
    id: "evt_006",
    title: "Beach Cleanup Drive",
    organization: "Ocean First",
    description: "Remove plastic and debris from Coney Island Beach. Equipment provided. Bring sunscreen.",
    location: "Coney Island Beach, Brooklyn",
    lat: 40.5755, lng: -73.9707,
    start_time: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    end_time:   new Date(now - 1000 * 60 * 60 * 69).toISOString(),
    hours_credit: 3, max_participants: 50, check_in_hash: "BEACH2026",
    category: "Environment", participant_ids: ["usr_demo_001", "usr_001", "usr_002", "usr_003"],
  },
  {
    id: "evt_007",
    title: "Literacy Tutoring",
    organization: "Read Together NYC",
    description: "One-on-one reading sessions with adults learning to read. Training provided beforehand.",
    location: "Public Library, Harlem",
    lat: 40.8116, lng: -73.9465,
    start_time: new Date(now - 1000 * 60 * 60 * 200).toISOString(),
    end_time:   new Date(now - 1000 * 60 * 60 * 197).toISOString(),
    hours_credit: 3, max_participants: 12, check_in_hash: "READ2026",
    category: "Education", participant_ids: ["usr_demo_001", "usr_004", "usr_005"],
  },
];

const INITIAL_BADGES: MockBadge[] = [
  { id: "b01", name: "First Step",         description: "Complete your first volunteer event",  icon: "🌱", requirement_type: "events", requirement_value: 1,    rarity: "common",    earned: true,  earned_at: "2024-09-20T10:00:00Z" },
  { id: "b02", name: "Ten Hours",          description: "Log 10 verified volunteer hours",       icon: "⏰", requirement_type: "hours",  requirement_value: 10,   rarity: "common",    earned: true,  earned_at: "2024-10-05T10:00:00Z" },
  { id: "b03", name: "Community Builder",  description: "Attend 5 different events",             icon: "🏘️", requirement_type: "events", requirement_value: 5,    rarity: "rare",      earned: true,  earned_at: "2024-11-12T10:00:00Z" },
  { id: "b04", name: "Half Century",       description: "Log 50 volunteer hours",                icon: "🎯", requirement_type: "hours",  requirement_value: 50,   rarity: "rare",      earned: true,  earned_at: "2025-01-08T10:00:00Z" },
  { id: "b05", name: "Streak Master",      description: "Volunteer 7 weeks in a row",            icon: "🔥", requirement_type: "streak", requirement_value: 7,    rarity: "rare",      earned: false },
  { id: "b06", name: "Century Club",       description: "Log 100 volunteer hours",               icon: "💯", requirement_type: "hours",  requirement_value: 100,  rarity: "epic",      earned: false },
  { id: "b07", name: "Impact Leader",      description: "Reach Gold tier (200h)",                icon: "🥇", requirement_type: "hours",  requirement_value: 200,  rarity: "epic",      earned: false },
  { id: "b08", name: "Platinum Volunteer", description: "Reach Platinum tier (500h)",            icon: "💎", requirement_type: "hours",  requirement_value: 500,  rarity: "legendary", earned: false },
  { id: "b09", name: "Green Thumb",        description: "Attend 3 environment events",           icon: "🌿", requirement_type: "special", requirement_value: 3,   rarity: "common",    earned: false },
  { id: "b10", name: "Educator",           description: "Attend 3 education events",             icon: "📚", requirement_type: "special", requirement_value: 3,   rarity: "common",    earned: false },
  { id: "b11", name: "Night Owl",          description: "Volunteer after 6pm",                   icon: "🦉", requirement_type: "special", requirement_value: 1,   rarity: "rare",      earned: false },
  { id: "b12", name: "Legend",             description: "Reach 1000 impact points",              icon: "⭐", requirement_type: "special", requirement_value: 1000, rarity: "legendary", earned: false },
];

const INITIAL_REWARDS: MockReward[] = [
  { id: "r01", title: "Coffee Voucher",    description: "$10 off at any partner café. Valid 30 days.",        cost_hours: 10,  tier_required: null,       category: "food",       emoji: "☕" },
  { id: "r02", title: "Charity Donation",  description: "$50 donated to a charity of your choice.",           cost_hours: 20,  tier_required: null,       category: "charity",    emoji: "💝" },
  { id: "r03", title: "Museum Pass",       description: "Free entry for 2 at participating museums.",         cost_hours: 25,  tier_required: "silver",   category: "culture",    emoji: "🎨" },
  { id: "r04", title: "Cooking Class",     description: "2-hour class for 1 at a partner studio.",           cost_hours: 30,  tier_required: "silver",   category: "experience", emoji: "🍳" },
  { id: "r05", title: "Yoga Month Pass",   description: "Unlimited classes for one month.",                   cost_hours: 40,  tier_required: "silver",   category: "wellness",   emoji: "🧘" },
  { id: "r06", title: "VoltImpact Hoodie", description: "Limited edition. Shipped to your address.",         cost_hours: 50,  tier_required: "gold",     category: "merch",      emoji: "👕" },
  { id: "r07", title: "Concert Tickets",   description: "2 tickets to a partner venue event.",               cost_hours: 75,  tier_required: "gold",     category: "experience", emoji: "🎵" },
  { id: "r08", title: "Platinum Badge",    description: "Exclusive digital badge for your profile.",         cost_hours: 100, tier_required: "platinum", category: "digital",    emoji: "🏆" },
];

const INITIAL_FEED: FeedItem[] = [
  { id: "f01", user_id: "usr_001", user_name: "Jordan Lee",   user_tier: "platinum", action_type: "check_in",       event_title: "Riverside Park Cleanup",  hours: 3, timestamp: new Date(now - 1000*60*25).toISOString(),   likes: 18, liked_by: [] },
  { id: "f02", user_id: "usr_002", user_name: "Maya Patel",   user_tier: "gold",     action_type: "check_in",       event_title: "Youth Coding Workshop",   hours: 4, timestamp: new Date(now - 1000*60*90).toISOString(),   likes: 11, liked_by: [] },
  { id: "f03", user_id: "usr_003", user_name: "Sam Rivera",   user_tier: "gold",     action_type: "badge_earned",   badge_name: "Century Club",                       timestamp: new Date(now - 1000*60*180).toISOString(),  likes: 27, liked_by: [] },
  { id: "f04", user_id: "usr_004", user_name: "Taylor Kim",   user_tier: "silver",   action_type: "check_in",       event_title: "Animal Shelter Walk",     hours: 2, timestamp: new Date(now - 1000*60*360).toISOString(),  likes: 6,  liked_by: [] },
  { id: "f05", user_id: "usr_005", user_name: "Chris Morgan", user_tier: "bronze",   action_type: "reward_redeemed",reward_title: "Coffee Voucher",                    timestamp: new Date(now - 1000*60*720).toISOString(),  likes: 14, liked_by: [] },
  { id: "f06", user_id: "usr_001", user_name: "Jordan Lee",   user_tier: "platinum", action_type: "check_in",       event_title: "Beach Cleanup Drive",     hours: 3, timestamp: new Date(now - 1000*60*60*26).toISOString(), likes: 9, liked_by: [] },
  { id: "f07", user_id: "usr_002", user_name: "Maya Patel",   user_tier: "gold",     action_type: "badge_earned",   badge_name: "Half Century",                       timestamp: new Date(now - 1000*60*60*48).toISOString(), likes: 4, liked_by: [] },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  { id: "l01", event_id: "evt_007", hours: 3,  description: "Attended: Literacy Tutoring",     verified: true,  proof_hash: "LIT7X9K2M4", created_at: new Date(now - 1000*60*60*200).toISOString() },
  { id: "l02", event_id: "evt_006", hours: 3,  description: "Attended: Beach Cleanup Drive",   verified: true,  proof_hash: "BCH3P8Q1N5", created_at: new Date(now - 1000*60*60*72).toISOString() },
  { id: "l03", event_id: null,      hours: 5,  description: "Manual: Community garden work",   verified: false, proof_hash: null,          created_at: new Date(now - 1000*60*60*400).toISOString() },
  { id: "l04", event_id: null,      hours: 4,  description: "Attended: Youth Coding Workshop", verified: true,  proof_hash: "COD9R2T6W8", created_at: new Date(now - 1000*60*60*600).toISOString() },
  { id: "l05", event_id: null,      hours: 2,  description: "Attended: Animal Shelter Walk",   verified: true,  proof_hash: "PAW5M3K7L1", created_at: new Date(now - 1000*60*60*800).toISOString() },
  { id: "l06", event_id: null,      hours: 3,  description: "Attended: Park Cleanup",          verified: true,  proof_hash: "PRK2N8V4X6", created_at: new Date(now - 1000*60*60*1000).toISOString() },
  { id: "l07", event_id: null,      hours: 10, description: "Attended: Food Bank Sorting",     verified: true,  proof_hash: "FDB6Q1T9R3", created_at: new Date(now - 1000*60*60*1200).toISOString() },
];

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, id: "usr_001", name: "Jordan Lee",   tier: "platinum", total_hours: 512, impact_score: 14200, avatar_url: null },
  { rank: 2, id: "usr_002", name: "Maya Patel",   tier: "gold",     total_hours: 284, impact_score: 8100,  avatar_url: null },
  { rank: 3, id: "usr_003", name: "Sam Rivera",   tier: "gold",     total_hours: 231, impact_score: 6800,  avatar_url: null },
  { rank: 4, id: "usr_demo_001", name: "Alex Rivera", tier: "silver", total_hours: 87, impact_score: 2340, avatar_url: null },
  { rank: 5, id: "usr_004", name: "Taylor Kim",   tier: "silver",   total_hours: 74,  impact_score: 2100,  avatar_url: null },
  { rank: 6, id: "usr_005", name: "Chris Morgan", tier: "bronze",   total_hours: 42,  impact_score: 1200,  avatar_url: null },
  { rank: 7, id: "usr_006", name: "Dana White",   tier: "bronze",   total_hours: 31,  impact_score: 890,   avatar_url: null },
];

// ─── Badge unlock logic ───────────────────────────────────────────────────────

function computeNewBadges(
  badges: MockBadge[],
  user: AppUser,
  attendedCount: number
): { updated: MockBadge[]; newlyEarned: MockBadge[] } {
  const newlyEarned: MockBadge[] = [];
  const updated = badges.map((b) => {
    if (b.earned) return b;
    let shouldEarn = false;
    if (b.requirement_type === "hours"  && user.total_hours >= b.requirement_value) shouldEarn = true;
    if (b.requirement_type === "events" && attendedCount >= b.requirement_value)    shouldEarn = true;
    if (shouldEarn) {
      newlyEarned.push(b);
      return { ...b, earned: true, earned_at: new Date().toISOString() };
    }
    return b;
  });
  return { updated, newlyEarned };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useVoltStore = create<VoltStore>()(
  persist(
    (set, get) => ({
      user:         INITIAL_USER,
      events:       INITIAL_EVENTS,
      badges:       INITIAL_BADGES,
      rewards:      INITIAL_REWARDS,
      feed:         INITIAL_FEED,
      ledger:       INITIAL_LEDGER,
      leaderboard:  INITIAL_LEADERBOARD,

      // ── Check in to an event ──────────────────────────────────────
      checkInToEvent: (eventId: string) => {
        const { user, events, badges, leaderboard, feed, ledger } = get();

        const event = events.find((e) => e.id === eventId);
        if (!event) return;
        if (user.attended_event_ids.includes(eventId)) return;

        const newHours       = user.total_hours + event.hours_credit;
        const newScore       = user.impact_score + event.hours_credit * 10;
        const { tier }       = getTierFromHours(newHours);
        const newAttended    = [...user.attended_event_ids, eventId];
        const newJoined      = user.joined_event_ids.includes(eventId)
          ? user.joined_event_ids
          : [...user.joined_event_ids, eventId];

        const updatedUser: AppUser = {
          ...user,
          total_hours: newHours,
          impact_score: newScore,
          tier,
          attended_event_ids: newAttended,
          joined_event_ids: newJoined,
        };

        // Check badge unlocks
        const { updated: updatedBadges, newlyEarned } = computeNewBadges(
          badges, updatedUser, newAttended.length
        );

        // Update event participants
        const updatedEvents = events.map((e) =>
          e.id === eventId && !e.participant_ids.includes(user.id)
            ? { ...e, participant_ids: [...e.participant_ids, user.id] }
            : e
        );

        // Update leaderboard
        const updatedLeaderboard = leaderboard
          .map((lb) => lb.id === user.id ? { ...lb, total_hours: newHours, impact_score: newScore, tier } : lb)
          .sort((a, b) => b.total_hours - a.total_hours)
          .map((lb, i) => ({ ...lb, rank: i + 1 }));

        // New ledger entry
        const proofHash = btoa(`${eventId}:${user.id}:${Date.now()}`).slice(0, 10).toUpperCase();
        const newLedgerEntry: LedgerEntry = {
          id: `l_${Date.now()}`,
          event_id: eventId,
          hours: event.hours_credit,
          description: `Attended: ${event.title}`,
          verified: true,
          proof_hash: proofHash,
          created_at: new Date().toISOString(),
        };

        // Feed entries
        const newFeedItems: FeedItem[] = [
          {
            id: `feed_${Date.now()}`,
            user_id: user.id,
            user_name: user.name,
            user_tier: tier,
            action_type: "check_in",
            event_title: event.title,
            hours: event.hours_credit,
            timestamp: new Date().toISOString(),
            likes: 0,
            liked_by: [],
          },
          ...newlyEarned.map((b, i) => ({
            id: `feed_badge_${Date.now()}_${i}`,
            user_id: user.id,
            user_name: user.name,
            user_tier: tier,
            action_type: "badge_earned" as const,
            badge_name: b.name,
            timestamp: new Date().toISOString(),
            likes: 0,
            liked_by: [],
          })),
        ];

        set({
          user: updatedUser,
          events: updatedEvents,
          badges: updatedBadges,
          leaderboard: updatedLeaderboard,
          ledger: [newLedgerEntry, ...ledger],
          feed: [...newFeedItems, ...feed],
        });
      },

      // ── Join (register for) an event ──────────────────────────────
      joinEvent: (eventId: string) => {
        const { user, events, feed } = get();
        if (user.joined_event_ids.includes(eventId)) return;

        const event = events.find((e) => e.id === eventId);
        if (!event) return;

        const newFeedItem: FeedItem = {
          id: `feed_join_${Date.now()}`,
          user_id: user.id,
          user_name: user.name,
          user_tier: user.tier,
          action_type: "joined",
          event_title: event.title,
          timestamp: new Date().toISOString(),
          likes: 0,
          liked_by: [],
        };

        set({
          user: { ...user, joined_event_ids: [...user.joined_event_ids, eventId] },
          feed: [newFeedItem, ...feed],
        });
      },

      // ── Redeem a reward ───────────────────────────────────────────
      redeemReward: (rewardId: string) => {
        const { user, rewards, feed } = get();
        if (user.redeemed_reward_ids.includes(rewardId)) return;

        const reward = rewards.find((r) => r.id === rewardId);
        if (!reward) return;

        const newFeedItem: FeedItem = {
          id: `feed_reward_${Date.now()}`,
          user_id: user.id,
          user_name: user.name,
          user_tier: user.tier,
          action_type: "reward_redeemed",
          reward_title: reward.title,
          timestamp: new Date().toISOString(),
          likes: 0,
          liked_by: [],
        };

        set({
          user: { ...user, redeemed_reward_ids: [...user.redeemed_reward_ids, rewardId] },
          feed: [newFeedItem, ...feed],
        });
      },

      // ── Toggle like on a feed item ────────────────────────────────
      toggleLike: (feedItemId: string) => {
        const { user, feed } = get();
        set({
          feed: feed.map((item) => {
            if (item.id !== feedItemId) return item;
            const alreadyLiked = item.liked_by.includes(user.id);
            return {
              ...item,
              likes: alreadyLiked ? item.likes - 1 : item.likes + 1,
              liked_by: alreadyLiked
                ? item.liked_by.filter((id) => id !== user.id)
                : [...item.liked_by, user.id],
            };
          }),
        });
      },

      // ── Add arbitrary feed item ───────────────────────────────────
      addFeedItem: (item) => {
        const { feed } = get();
        set({
          feed: [{ ...item, id: `feed_${Date.now()}`, likes: 0, liked_by: [] }, ...feed],
        });
      },
    }),
    {
      name: "voltimpact-store",
      // Only persist user state — events/feed are re-initialized fresh
      partialState: (state) => ({ user: state.user }),
    } as Parameters<typeof persist>[1]
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────
// These return PRIMITIVE values only — no new arrays/objects.
// Use useMemo in components for derived arrays to avoid infinite loops.

export const selectUserRank = (s: VoltStore) =>
  s.leaderboard.find((lb) => lb.id === s.user.id)?.rank ?? null;

export const selectThisMonthHours = (s: VoltStore) => {
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const startMs = start.getTime();
  return s.ledger
    .filter((e) => new Date(e.created_at).getTime() >= startMs)
    .reduce((sum, e) => sum + e.hours, 0);
};

// Stable ID-list selectors — return primitive strings, safe for useSyncExternalStore
export const selectAttendedIds  = (s: VoltStore) => s.user.attended_event_ids.join(",");
export const selectJoinedIds    = (s: VoltStore) => s.user.joined_event_ids.join(",");
export const selectRedeemedIds  = (s: VoltStore) => s.user.redeemed_reward_ids.join(",");
export const selectEarnedBadgeIds = (s: VoltStore) =>
  s.badges.filter((b) => b.earned).map((b) => b.id).join(",");
