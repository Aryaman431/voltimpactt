"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { BadgeWithDetails } from "@/types";

const RARITY_STYLES: Record<string, { bg: string; border: string; glow: string }> = {
  common:    { bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.25)", glow: "" },
  rare:      { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",   glow: "0 0 12px rgba(59,130,246,0.2)" },
  epic:      { bg: "rgba(139,92,246,0.15)",  border: "rgba(139,92,246,0.35)",  glow: "0 0 16px rgba(139,92,246,0.25)" },
  legendary: { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.35)",  glow: "0 0 20px rgba(245,158,11,0.3)" },
};

interface BadgeShowcaseProps {
  badges: BadgeWithDetails[];
  loading?: boolean;
}

export default function BadgeShowcase({ badges, loading }: BadgeShowcaseProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bento-card p-5 h-full">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Badges</h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{badges.length} earned</span>
      </div>

      {badges.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Complete events to earn badges</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {badges.map((ub) => {
            const style = RARITY_STYLES[ub.badge.rarity] ?? RARITY_STYLES.common;
            return (
              <div key={ub.id} className="relative">
                <motion.div
                  className="aspect-square rounded-xl flex items-center justify-center text-xl cursor-default"
                  style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    boxShadow: style.glow,
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  onHoverStart={() => setHovered(ub.id)}
                  onHoverEnd={() => setHovered(null)}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {ub.badge.icon}
                </motion.div>

                <AnimatePresence>
                  {hovered === ub.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-36 rounded-xl p-2.5 pointer-events-none"
                      style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                    >
                      <p className="text-xs font-semibold text-center" style={{ color: "var(--text-primary)" }}>
                        {ub.badge.name}
                      </p>
                      <p className="text-[10px] text-center mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {ub.badge.description}
                      </p>
                      <div className="flex justify-center mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                          style={{ background: style.bg, border: `1px solid ${style.border}`, color: "var(--text-secondary)" }}>
                          {ub.badge.rarity}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
