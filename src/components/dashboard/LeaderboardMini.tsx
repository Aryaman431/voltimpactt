"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatHours } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

const RANK_COLORS: Record<number, string> = {
  1: "#f59e0b",
  2: "#94a3b8",
  3: "#b45309",
};

interface LeaderboardMiniProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  loading?: boolean;
}

export default function LeaderboardMini({ entries, currentUserId, loading }: LeaderboardMiniProps) {
  if (loading) {
    return (
      <div className="bento-card p-5 h-full">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bento-card p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Leaderboard</h3>
        <Link
          href="/dashboard/leaderboard"
          className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-0.5 flex-1">
        {entries.slice(0, 7).map((entry, i) => {
          const isMe = entry.user.id === currentUserId;
          return (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors"
              style={{
                background: isMe ? "rgba(139,92,246,0.1)" : "transparent",
                border: isMe ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
              }}
            >
              {/* Rank */}
              <div className="w-5 text-center shrink-0">
                {entry.rank <= 3
                  ? <Crown className="w-3.5 h-3.5 mx-auto" style={{ color: RANK_COLORS[entry.rank] }} />
                  : <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{entry.rank}</span>
                }
              </div>

              {/* Avatar */}
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={entry.user.avatar_url ?? undefined} />
                <AvatarFallback className="text-[10px]" style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}>
                  {entry.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: isMe ? "#c4b5fd" : "var(--text-secondary)" }}>
                  {entry.user.name.split(" ")[0]}
                  {isMe && <span className="ml-1 opacity-50">(you)</span>}
                </p>
              </div>

              {/* Hours */}
              <span className="text-xs font-semibold shrink-0" style={{ color: "var(--text-tertiary)" }}>
                {formatHours(entry.total_hours)}h
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
