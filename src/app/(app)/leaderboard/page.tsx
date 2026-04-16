"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useVoltStore } from "@/lib/store";
import { formatHours } from "@/lib/utils";

const TIER_BADGE_VARIANT = {
  bronze: "bronze", silver: "silver", gold: "gold", platinum: "platinum",
} as const;

const RANK_COLORS: Record<number, string> = { 1: "#f59e0b", 2: "#94a3b8", 3: "#b45309" };

export default function LeaderboardPage() {
  const leaderboard = useVoltStore((s) => s.leaderboard);
  const user        = useVoltStore((s) => s.user);

  const top3   = leaderboard.slice(0, 3);
  const podium = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
  const podiumHeights  = ["h-24", "h-32", "h-20"];
  const podiumRings    = ["rgba(148,163,184,0.4)", "rgba(245,158,11,0.5)", "rgba(180,83,9,0.4)"];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="px-5 lg:px-8 pt-7 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Top volunteers by verified hours</p>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-3xl">
        {/* Podium */}
        {top3.length >= 3 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-end justify-center gap-4 mb-10 h-52">
            {podium.map((entry, idx) => {
              const isFirst = idx === 1;
              const isMe    = entry.id === user.id;
              return (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2">
                  {isFirst && <Crown className="w-5 h-5 mb-1" style={{ color: "#f59e0b" }} />}
                  <Avatar className={`${isFirst ? "h-14 w-14" : "h-11 w-11"} ring-2`}
                    style={{ "--tw-ring-color": podiumRings[idx] } as React.CSSProperties}>
                    <AvatarFallback className="text-xs font-bold"
                      style={{ background: isMe ? "rgba(139,92,246,0.2)" : "var(--bg-overlay)", color: isMe ? "var(--violet)" : "var(--text-secondary)" }}>
                      {entry.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: isFirst ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {entry.name.split(" ")[0]}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{entry.total_hours}h</p>
                  </div>
                  <div className={`w-20 ${podiumHeights[idx]} rounded-t-xl flex items-end justify-center pb-2`}
                    style={{
                      background: isFirst ? "rgba(245,158,11,0.1)" : "var(--bg-surface)",
                      border: `1px solid ${isFirst ? "rgba(245,158,11,0.2)" : "var(--border-subtle)"}`,
                    }}>
                    <span className="font-bold text-lg" style={{ color: RANK_COLORS[entry.rank] ?? "var(--text-muted)" }}>
                      {entry.rank}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Full list */}
        <div className="bento-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>All rankings</h3>
          </div>
          <div>
            {leaderboard.map((entry, i) => {
              const isMe = entry.id === user.id;
              return (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                  style={{
                    background: isMe ? "rgba(139,92,246,0.06)" : "transparent",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                  <div className="w-8 text-center shrink-0">
                    {entry.rank <= 3
                      ? <Crown className="w-4 h-4 mx-auto" style={{ color: RANK_COLORS[entry.rank] }} />
                      : <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>{entry.rank}</span>
                    }
                  </div>
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs"
                      style={{ background: isMe ? "rgba(139,92,246,0.2)" : "var(--bg-overlay)", color: isMe ? "var(--violet)" : "var(--text-secondary)" }}>
                      {entry.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: isMe ? "#c4b5fd" : "var(--text-primary)" }}>
                        {entry.name}{isMe && <span className="ml-1 text-xs opacity-40">(you)</span>}
                      </p>
                      <Badge variant={TIER_BADGE_VARIANT[entry.tier as keyof typeof TIER_BADGE_VARIANT]}>
                        {entry.tier}
                      </Badge>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {entry.impact_score.toLocaleString()} pts
                    </p>
                  </div>
                  <span className="text-sm font-semibold shrink-0" style={{ color: "var(--text-secondary)" }}>
                    {formatHours(entry.total_hours)}h
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
