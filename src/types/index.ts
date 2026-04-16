export * from "./database";

export interface ImpactStat {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    tier: string;
  };
  total_hours: number;
  impact_score: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost_hours: number;
  category: string;
  available: boolean;
  image_url?: string;
}
