import type { User, Event, Badge, HoursLedgerEntry } from "@/types";

// ─── MOCK USER ────────────────────────────────────────────────────────────────
export const MOCK_USER: User = {
  id: "usr_demo_001",
  clerk_id: "clerk_demo",
  name: "Alex Rivera",
  email: "alex@voltimpact.app",
  avatar_url: null,
  total_hours: 87,
  tier: "silver",
  impact_score: 2340,
  created_at: "2024-09-15T10:00:00Z",
  updated_at: "2025-04-10T14:30:00Z",
};

// ─── MOCK EVENTS ─────────────────────────────────────────────────────────────
export const MOCK_EVENTS: Event[] = [
  {
    id: "evt_001",
    title: "Riverside Park Cleanup",
    organization: "Green City Initiative",
    description: "Join us for a morning of cleaning up Riverside Park. Gloves and bags provided. All ages welcome.",
    location: "Riverside Park, New York",
    lat: 40.8005,
    lng: -73.9580,
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    end_time:   new Date(Date.now() + 1000 * 60 * 60 * 51).toISOString(),
    hours_credit: 3,
    max_participants: 40,
    check_in_hash: "PARK2026",
    category: "Environment",
    image_url: null,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "evt_002",
    title: "Youth Coding Workshop",
    organization: "Code for Kids",
    description: "Teach basic programming to children aged 8–12. No prior teaching experience needed — just enthusiasm.",
    location: "Community Center, Brooklyn",
    lat: 40.6782,
    lng: -73.9442,
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    end_time:   new Date(Date.now() + 1000 * 60 * 60 * 100).toISOString(),
    hours_credit: 4,
    max_participants: 20,
    check_in_hash: "CODE2026",
    category: "Education",
    image_url: null,
    created_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "evt_003",
    title: "Food Bank Sorting",
    organization: "City Food Bank",
    description: "Help sort and package food donations for distribution to families in need across the city.",
    location: "City Food Bank, Queens",
    lat: 40.7282,
    lng: -73.7949,
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 168).toISOString(),
    end_time:   new Date(Date.now() + 1000 * 60 * 60 * 170).toISOString(),
    hours_credit: 2,
    max_participants: 30,
    check_in_hash: "FOOD2026",
    category: "Community",
    image_url: null,
    created_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "evt_004",
    title: "Senior Tech Help",
    organization: "Silver Connect",
    description: "Assist seniors with smartphones, tablets, and computers. Patience and kindness are the only requirements.",
    location: "Senior Center, Manhattan",
    lat: 40.7580,
    lng: -73.9855,
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 240).toISOString(),
    end_time:   new Date(Date.now() + 1000 * 60 * 60 * 243).toISOString(),
    hours_credit: 3,
    max_participants: 15,
    check_in_hash: "TECH2026",
    category: "Community",
    image_url: null,
    created_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "evt_005",
    title: "Animal Shelter Walk",
    organization: "Paws & Hearts",
    description: "Walk and socialize dogs at the local animal shelter. Helps with their mental health and adoption chances.",
    location: "City Animal Shelter, Bronx",
    lat: 40.8448,
    lng: -73.8648,
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    end_time:   new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    hours_credit: 2,
    max_participants: 25,
    check_in_hash: "PAWS2026",
    category: "Animals",
    image_url: null,
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "evt_006",
    title: "Beach Cleanup Drive",
    organization: "Ocean First",
    description: "Remove plastic and debris from Coney Island Beach. Equipment provided. Bring sunscreen.",
    location: "Coney Island Beach, Brooklyn",
    lat: 40.5755,
    lng: -73.9707,
    start_time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    end_time:   new Date(Date.now() - 1000 * 60 * 60 * 69).toISOString(),
    hours_credit: 3,
    max_participants: 50,
    check_in_hash: "BEACH2026",
    category: "Environment",
    image_url: null,
    created_at: "2025-01-06T00:00:00Z",
  },
  {
    id: "evt_007",
    title: "Literacy Tutoring",
    organization: "Read Together NYC",
    description: "One-on-one reading sessions with adults learning to read. Training provided beforehand.",
    location: "Public Library, Harlem",
    lat: 40.8116,
    lng: -73.9465,
    start_time: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    end_time:   new Date(Date.now() - 1000 * 60 * 60 * 197).toISOString(),
    hours_credit: 3,
    max_participants: 12,
    check_in_hash: "READ2026",
    category: "Education",
    image_url: null,
    created_at: "2025-01-07T00:00:00Z",
  },
];

// ─── MOCK BADGES ─────────────────────────────────────────────────────────────
export interface MockBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: "hours" | "events" | "streak" | "special";
  requirement_value: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  earned: boolean;
  earned_at?: string;
}

export const MOCK_BADGES: MockBadge[] = [
  { id: "b01", name: "First Step",      description: "Complete your first volunteer event",  icon: "🌱", requirement_type: "events", requirement_value: 1,   rarity: "common",    earned: true,  earned_at: "2024-09-20T10:00:00Z" },
  { id: "b02", name: "Ten Hours",       description: "Log 10 verified volunteer hours",       icon: "⏰", requirement_type: "hours",  requirement_value: 10,  rarity: "common",    earned: true,  earned_at: "2024-10-05T10:00:00Z" },
  { id: "b03", name: "Community Builder", description: "Attend 5 different events",           icon: "🏘️", requirement_type: "events", requirement_value: 5,   rarity: "rare",      earned: true,  earned_at: "2024-11-12T10:00:00Z" },
  { id: "b04", name: "Half Century",    description: "Log 50 volunteer hours",                icon: "🎯", requirement_type: "hours",  requirement_value: 50,  rarity: "rare",      earned: true,  earned_at: "2025-01-08T10:00:00Z" },
  { id: "b05", name: "Streak Master",   description: "Volunteer 7 weeks in a row",            icon: "🔥", requirement_type: "streak", requirement_value: 7,   rarity: "rare",      earned: false },
  { id: "b06", name: "Century Club",    description: "Log 100 volunteer hours",               icon: "💯", requirement_type: "hours",  requirement_value: 100, rarity: "epic",      earned: false },
  { id: "b07", name: "Impact Leader",   description: "Reach Gold tier",                       icon: "🥇", requirement_type: "hours",  requirement_value: 200, rarity: "epic",      earned: false },
  { id: "b08", name: "Platinum Volunteer", description: "Reach Platinum tier",               icon: "💎", requirement_type: "hours",  requirement_value: 500, rarity: "legendary", earned: false },
  { id: "b09", name: "Green Thumb",     description: "Attend 3 environment events",           icon: "🌿", requirement_type: "special", requirement_value: 3,  rarity: "common",    earned: false },
  { id: "b10", name: "Educator",        description: "Attend 3 education events",             icon: "📚", requirement_type: "special", requirement_value: 3,  rarity: "common",    earned: false },
  { id: "b11", name: "Night Owl",       description: "Volunteer after 6pm",                   icon: "🦉", requirement_type: "special", requirement_value: 1,  rarity: "rare",      earned: false },
  { id: "b12", name: "Legend",          description: "1000 total impact points",              icon: "⭐", requirement_type: "special", requirement_value: 1000, rarity: "legendary", earned: false },
];

// ─── MOCK REWARDS ─────────────────────────────────────────────────────────────
export interface MockReward {
  id: string;
  title: string;
  description: string;
  cost_hours: number;
  tier_required: "bronze" | "silver" | "gold" | "platinum" | null;
  category: string;
  emoji: string;
}

export const MOCK_REWARDS: MockReward[] = [
  { id: "r01", title: "Coffee Voucher",      description: "$10 off at any partner café. Valid 30 days.",          cost_hours: 10,  tier_required: null,       category: "food",       emoji: "☕" },
  { id: "r02", title: "Charity Donation",    description: "$50 donated to a charity of your choice.",             cost_hours: 20,  tier_required: null,       category: "charity",    emoji: "💝" },
  { id: "r03", title: "Museum Pass",         description: "Free entry for 2 at participating museums.",           cost_hours: 25,  tier_required: "silver",   category: "culture",    emoji: "🎨" },
  { id: "r04", title: "Cooking Class",       description: "2-hour class for 1 at a partner studio.",             cost_hours: 30,  tier_required: "silver",   category: "experience", emoji: "🍳" },
  { id: "r05", title: "Yoga Month Pass",     description: "Unlimited classes for one month.",                     cost_hours: 40,  tier_required: "silver",   category: "wellness",   emoji: "🧘" },
  { id: "r06", title: "VoltImpact Hoodie",   description: "Limited edition. Shipped to your address.",           cost_hours: 50,  tier_required: "gold",     category: "merch",      emoji: "👕" },
  { id: "r07", title: "Concert Tickets",     description: "2 tickets to a partner venue event.",                 cost_hours: 75,  tier_required: "gold",     category: "experience", emoji: "🎵" },
  { id: "r08", title: "Platinum Badge",      description: "Exclusive digital badge for your profile.",           cost_hours: 100, tier_required: "platinum", category: "digital",    emoji: "🏆" },
];

// ─── MOCK LEDGER ─────────────────────────────────────────────────────────────
export const MOCK_LEDGER: HoursLedgerEntry[] = [
  { id: "l01", user_id: "usr_demo_001", event_id: "evt_007", hours: 3,  description: "Attended: Literacy Tutoring",    verified: true,  proof_hash: "LIT7X9K2M4",  created_at: new Date(Date.now() - 1000*60*60*200).toISOString() },
  { id: "l02", user_id: "usr_demo_001", event_id: "evt_006", hours: 3,  description: "Attended: Beach Cleanup Drive",  verified: true,  proof_hash: "BCH3P8Q1N5",  created_at: new Date(Date.now() - 1000*60*60*72).toISOString() },
  { id: "l03", user_id: "usr_demo_001", event_id: null,      hours: 5,  description: "Manual: Community garden work", verified: false, proof_hash: null,           created_at: new Date(Date.now() - 1000*60*60*400).toISOString() },
  { id: "l04", user_id: "usr_demo_001", event_id: null,      hours: 4,  description: "Attended: Youth Coding Workshop",verified: true,  proof_hash: "COD9R2T6W8",  created_at: new Date(Date.now() - 1000*60*60*600).toISOString() },
  { id: "l05", user_id: "usr_demo_001", event_id: null,      hours: 2,  description: "Attended: Animal Shelter Walk",  verified: true,  proof_hash: "PAW5M3K7L1",  created_at: new Date(Date.now() - 1000*60*60*800).toISOString() },
  { id: "l06", user_id: "usr_demo_001", event_id: null,      hours: 3,  description: "Attended: Park Cleanup",         verified: true,  proof_hash: "PRK2N8V4X6",  created_at: new Date(Date.now() - 1000*60*60*1000).toISOString() },
  { id: "l07", user_id: "usr_demo_001", event_id: null,      hours: 10, description: "Attended: Food Bank Sorting",    verified: true,  proof_hash: "FDB6Q1T9R3",  created_at: new Date(Date.now() - 1000*60*60*1200).toISOString() },
];

// ─── MOCK LEADERBOARD ────────────────────────────────────────────────────────
export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Jordan Lee",   tier: "platinum", hours: 512, score: 14200, avatar: null },
  { rank: 2, name: "Maya Patel",   tier: "gold",     hours: 284, score: 8100,  avatar: null },
  { rank: 3, name: "Sam Rivera",   tier: "gold",     hours: 231, score: 6800,  avatar: null },
  { rank: 4, name: "Alex Rivera",  tier: "silver",   hours: 87,  score: 2340,  avatar: null },
  { rank: 5, name: "Taylor Kim",   tier: "silver",   hours: 74,  score: 2100,  avatar: null },
  { rank: 6, name: "Chris Morgan", tier: "bronze",   hours: 42,  score: 1200,  avatar: null },
  { rank: 7, name: "Dana White",   tier: "bronze",   hours: 31,  score: 890,   avatar: null },
];

// ─── MOCK COMMUNITY FEED ─────────────────────────────────────────────────────
export const MOCK_FEED = [
  { id: "f01", user: { name: "Jordan Lee",   tier: "platinum", avatar: null }, event: "Riverside Park Cleanup",  org: "Green City Initiative", hours: 3, time: new Date(Date.now() - 1000*60*25).toISOString(),   likes: 18 },
  { id: "f02", user: { name: "Maya Patel",   tier: "gold",     avatar: null }, event: "Youth Coding Workshop",   org: "Code for Kids",         hours: 4, time: new Date(Date.now() - 1000*60*90).toISOString(),   likes: 11 },
  { id: "f03", user: { name: "Sam Rivera",   tier: "gold",     avatar: null }, event: "Food Bank Sorting",       org: "City Food Bank",        hours: 2, time: new Date(Date.now() - 1000*60*180).toISOString(),  likes: 27 },
  { id: "f04", user: { name: "Taylor Kim",   tier: "silver",   avatar: null }, event: "Animal Shelter Walk",     org: "Paws & Hearts",         hours: 2, time: new Date(Date.now() - 1000*60*360).toISOString(),  likes: 6  },
  { id: "f05", user: { name: "Chris Morgan", tier: "bronze",   avatar: null }, event: "Beach Cleanup Drive",     org: "Ocean First",           hours: 3, time: new Date(Date.now() - 1000*60*720).toISOString(),  likes: 14 },
];
