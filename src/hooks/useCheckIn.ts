"use client";

import { supabase } from "@/lib/supabase";
import { getTierFromHours } from "@/lib/utils";
import type { Event } from "@/types";

export function useCheckIn(userId: string | undefined) {
  async function checkIn(eventId: string, providedHash: string): Promise<void> {
    if (!userId) throw new Error("Not authenticated");

    // Fetch event
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !eventData) throw new Error("Event not found");
    const event = eventData as Event;

    // Validate check-in hash (case-insensitive)
    if (event.check_in_hash.toUpperCase() !== providedHash.toUpperCase()) {
      throw new Error("Invalid check-in code");
    }

    // Check if already checked in
    const { data: existing } = await supabase
      .from("event_participants")
      .select("id, checked_in")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    if (existing?.checked_in) {
      throw new Error("Already checked in to this event");
    }

    if (existing) {
      await supabase
        .from("event_participants")
        .update({ checked_in: true, check_in_time: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("event_participants").insert({
        id: crypto.randomUUID(),
        event_id: eventId,
        user_id: userId,
        checked_in: true,
        check_in_time: new Date().toISOString(),
      });
    }

    // Record in Proof of Impact ledger
    const proofHash = btoa(`${eventId}:${userId}:${Date.now()}`).slice(0, 16);
    await supabase.from("hours_ledger").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      event_id: eventId,
      hours: event.hours_credit,
      description: `Attended: ${event.title}`,
      verified: true,
      proof_hash: proofHash,
    });

    // Update user total hours + tier
    const { data: currentUser } = await supabase
      .from("users")
      .select("total_hours, impact_score")
      .eq("id", userId)
      .single();

    if (currentUser) {
      const newHours = (currentUser.total_hours as number) + event.hours_credit;
      const newScore = (currentUser.impact_score as number) + event.hours_credit * 10;
      const { tier } = getTierFromHours(newHours);

      await supabase
        .from("users")
        .update({
          total_hours: newHours,
          impact_score: newScore,
          tier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }
  }

  return { checkIn };
}
