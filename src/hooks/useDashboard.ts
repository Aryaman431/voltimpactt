"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  BadgeWithDetails,
  EventWithParticipation,
  HoursLedgerEntry,
  LeaderboardEntry,
  Event,
} from "@/types";

export function useBadges(userId: string | undefined) {
  const [badges, setBadges] = useState<BadgeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function load() {
      const { data } = await supabase
        .from("user_badges")
        .select("*, badge:badges(*)")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      setBadges((data as BadgeWithDetails[]) ?? []);
      setLoading(false);
    }
    load();
  }, [userId]);

  return { badges, loading };
}

export function useUpcomingEvents(userId: string | undefined) {
  const [events, setEvents] = useState<EventWithParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function load() {
      const now = new Date().toISOString();

      const { data: participations } = await supabase
        .from("event_participants")
        .select("event_id, checked_in")
        .eq("user_id", userId);

      const parts = (participations ?? []) as { event_id: string; checked_in: boolean }[];
      const registeredIds = new Set(parts.map((p) => p.event_id));
      const checkedInIds = new Set(parts.filter((p) => p.checked_in).map((p) => p.event_id));

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("start_time", now)
        .order("start_time", { ascending: true })
        .limit(10);

      const enriched: EventWithParticipation[] = ((eventsData ?? []) as Event[]).map((e) => ({
        ...e,
        is_registered: registeredIds.has(e.id),
        is_checked_in: checkedInIds.has(e.id),
      }));

      setEvents(enriched.filter((e) => e.is_registered));
      setLoading(false);
    }
    load();
  }, [userId]);

  return { events, loading };
}

export function useHoursLedger(userId: string | undefined) {
  const [entries, setEntries] = useState<HoursLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    async function load() {
      const { data } = await supabase
        .from("hours_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      setEntries((data as HoursLedgerEntry[]) ?? []);
      setLoading(false);
    }
    load();
  }, [userId]);

  return { entries, loading };
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("users")
        .select("id, name, avatar_url, tier, total_hours, impact_score")
        .order("total_hours", { ascending: false })
        .limit(20);

      const rows = (data ?? []) as {
        id: string;
        name: string;
        avatar_url: string | null;
        tier: string;
        total_hours: number;
        impact_score: number;
      }[];

      setEntries(
        rows.map((u, i) => ({
          rank: i + 1,
          user: { id: u.id, name: u.name, avatar_url: u.avatar_url, tier: u.tier },
          total_hours: u.total_hours,
          impact_score: u.impact_score,
        }))
      );
      setLoading(false);
    }
    load();
  }, []);

  return { entries, loading };
}

export function useEventCount(userId: string | undefined) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      const { count: c } = await supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("checked_in", true);

      setCount(c ?? 0);
    }
    load();
  }, [userId]);

  return count;
}
