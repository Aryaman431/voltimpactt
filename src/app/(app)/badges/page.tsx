"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useVoltStore } from "@/lib/store";

const RARITY: Record<string, { bg: string; border: string; glow: string; color: string; label: string }> = {
  common:    { bg: "rgba(100,116,139,0.1)",  border: "rgba(100,116,139,0.22)", glow: "",                               color: "#94a3b8", label: "Common"    },
  rare:      { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",   glow: "0 0 20px rgba(59,130,246,0.2)",  color: "#60a5fa", label: "Rare"      },
  epic:      { bg: "rgba(139,92,246,0.14)",  border: "rgba(139,92,246,0.32)",  glow: "0 0 24px rgba(139,92,246,0.25)", color: "#a78bfa", label: "Epic"      },
  legendary: { bg: "rgba(245,158,11,0.14)",  border: "rgba(245,158,11,0.35)",  glow: "0 0 28px rgba(245,158,11,0.3)",  color: "#fbbf24", label: "Legendary" },
};

const FILTERS = ["All", "Earned", "Locked", "Common", "Rare", "Epic", "Legendary"] as const;

export default function BadgesPage() {
  const badges = useVoltStore((s) => s.badges);
  const user   = useVoltStore((s) => s.user);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [hovered, setHovered] = useState<string | null>(null);

  const earned = badges.filter((b) => b.earned).length;
  const total  = badges.length;
  const pct    = Math.round((earned / total) * 100);

  const filtered = badges.filter((b) => {
    if (filter === "Earned")    return b.earned;
    if (filter === "Locked")    return !b.earned;
    if (filter === "Common")    return b.rarity === "common";
    if (filter === "Rare")      return b.rarity === "rare";
    if (filter === "Epic")      return b.rarity === "epic";
    if (filter === "Legendary") return b.rarity === "legendary";
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="px-5 lg:px-8 pt-7 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Badges</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{earned} of {total} badges earned</p>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-5xl">
        {/* Progress card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Award className="w-5 h-5" style={{ color: "var(--violet)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Collection progress</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{earned} earned · {total - earned} remaining</p>
                </div>
              </div>
              <span className="text-2xl font-bold" style={{ color: "var(--violet)" }}>{pct}%</span>
            </div>
            <Progress value={pct} className="mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["common", "rare", "epic", "legendary"] as const).map((rarity) => {
                const earnedCount = badges.filter((b) => b.rarity === rarity && b.earned).length;
                const totalCount  = badges.filter((b) => b.rarity === rarity).length;
                const r = RARITY[rarity];
                return (
                  <div key={rarity} className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                    <div>
                      <p className="text-xs font-semibold capitalize" style={{ color: r.color }}>{rarity}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{earnedCount}/{totalCount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter === f ? "var(--violet)" : "var(--bg-surface)",
                color: filter === f ? "#fff" : "var(--text-tertiary)",
                border: `1px solid ${filter === f ? "transparent" : "var(--border-subtle)"}`,
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Badge grid */}
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filtered.map((badge, i) => {
              const r = RARITY[badge.rarity];
              return (
                <motion.div key={badge.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 280, damping: 22 }}
                  className="relative flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default select-none"
                  style={{
                    background: badge.earned ? r.bg : "var(--bg-surface)",
                    border: `1px solid ${badge.earned ? r.border : "var(--border-subtle)"}`,
                    boxShadow: badge.earned && hovered === badge.id ? r.glow : "none",
                    opacity: badge.earned ? 1 : 0.4,
                    filter: badge.earned ? "none" : "grayscale(0.6)",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={() => setHovered(badge.id)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={badge.earned ? { y: -5, scale: 1.03 } : {}}>

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{
                        background: badge.earned ? `${r.color}15` : "var(--bg-overlay)",
                        border: `1px solid ${badge.earned ? r.border : "var(--border-subtle)"}`,
                        filter: badge.earned ? "none" : "grayscale(1) opacity(0.35)",
                      }}>
                      {badge.icon}
                    </div>
                    {!badge.earned && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
                        <Lock className="w-2.5 h-2.5" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                    {badge.earned && (
                      <motion.div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: r.color, color: "#000" }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}>
                        ✓
                      </motion.div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-semibold leading-tight"
                      style={{ color: badge.earned ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {badge.name}
                    </p>
                    <p className="text-[10px] mt-0.5 font-medium" style={{ color: r.color }}>{r.label}</p>
                  </div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hovered === badge.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 w-48 rounded-2xl p-3.5 pointer-events-none"
                        style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)", boxShadow: "0 12px 32px rgba(0,0,0,0.6)" }}>
                        <p className="text-xs font-bold text-center" style={{ color: "var(--text-primary)" }}>{badge.name}</p>
                        <p className="text-[11px] text-center mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{badge.description}</p>
                        <div className="mt-2.5 pt-2.5 text-center" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                          {badge.earned ? (
                            <p className="text-[10px] font-medium" style={{ color: "#4ade80" }}>✓ Earned</p>
                          ) : (
                            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              Requires {badge.requirement_value}{badge.requirement_type === "hours" ? " hours" : " events"}
                              {badge.requirement_type === "hours" && ` (${Math.max(0, badge.requirement_value - user.total_hours)}h remaining)`}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
