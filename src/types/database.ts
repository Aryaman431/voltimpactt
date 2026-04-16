export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          total_hours: number;
          tier: "bronze" | "silver" | "gold" | "platinum";
          impact_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      events: {
        Row: {
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
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      hours_ledger: {
        Row: {
          id: string;
          user_id: string;
          event_id: string | null;
          hours: number;
          description: string;
          verified: boolean;
          proof_hash: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["hours_ledger"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["hours_ledger"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          requirement_type: "hours" | "events" | "streak" | "special";
          requirement_value: number;
          rarity: "common" | "rare" | "epic" | "legendary";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["badges"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "earned_at">;
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
      event_participants: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          checked_in: boolean;
          check_in_time: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["event_participants"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["event_participants"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type HoursLedgerEntry = Database["public"]["Tables"]["hours_ledger"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type EventParticipant = Database["public"]["Tables"]["event_participants"]["Row"];

export type BadgeWithDetails = UserBadge & { badge: Badge };
export type EventWithParticipation = Event & { is_registered?: boolean; is_checked_in?: boolean };
