"use client";

import { useState, useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

export type UserRole = "volunteer" | "organizer";

export interface VoltUser {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  onboarding_complete: boolean;
  total_hours: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  impact_score: number;
  created_at: string;
  updated_at: string;
}

export function useVoltUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [user, setUser]       = useState<VoltUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) { setLoading(false); return; }

    async function fetchOrCreate() {
      try {
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkUser!.id)
          .single();

        if (fetchError?.code === "PGRST116") {
          // First-time user — create with defaults
          const newUser = {
            id: crypto.randomUUID(),
            clerk_id: clerkUser!.id,
            name: clerkUser!.fullName ?? clerkUser!.username ?? "Volunteer",
            email: clerkUser!.primaryEmailAddress?.emailAddress ?? "",
            avatar_url: clerkUser!.imageUrl ?? null,
            role: "volunteer" as UserRole,
            onboarding_complete: false,
            total_hours: 0,
            tier: "bronze" as const,
            impact_score: 0,
          };

          const { data: created, error: createError } = await supabase
            .from("users")
            .insert(newUser)
            .select()
            .single();

          if (createError) throw createError;
          setUser(created as VoltUser);
        } else if (fetchError) {
          throw fetchError;
        } else {
          setUser(data as VoltUser);
        }
      } catch (err) {
        console.error("useVoltUser error:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    fetchOrCreate();
  }, [clerkUser, isLoaded]);

  const refreshUser = async () => {
    if (!clerkUser) return;
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUser.id)
      .single();
    if (data) setUser(data as VoltUser);
  };

  const setRole = async (role: UserRole) => {
    if (!user) return;
    const { data } = await supabase
      .from("users")
      .update({ role, onboarding_complete: true, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (data) setUser(data as VoltUser);
  };

  return { user, loading, error, refreshUser, setRole };
}
