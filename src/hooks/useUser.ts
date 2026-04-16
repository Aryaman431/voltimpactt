"use client";

import { useState, useEffect } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

export function useVoltUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          // New user — create record
          const newUser = {
            id: crypto.randomUUID(),
            clerk_id: clerkUser!.id,
            name: clerkUser!.fullName ?? clerkUser!.username ?? "Volunteer",
            email: clerkUser!.primaryEmailAddress?.emailAddress ?? "",
            avatar_url: clerkUser!.imageUrl ?? null,
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
          setUser(created as User);
        } else if (fetchError) {
          throw fetchError;
        } else {
          setUser(data as User);
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
    if (data) setUser(data as User);
  };

  return { user, loading, error, refreshUser };
}
