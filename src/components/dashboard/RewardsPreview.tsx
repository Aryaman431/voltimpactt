"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const REWARDS = [
  { id: "1", title: "Coffee Voucher",  emoji: "☕", cost: 10 },
  { id: "2", title: "Museum Pass",     emoji: "🎨", cost: 25 },
  { id: "3", title: "VoltImpact Hoodie", emoji: "👕", cost: 50 },
];

interface RewardsPreviewProps {
  userHours: number;
  loading?: boolean;
}

export default function RewardsPreview({ userHours, loading }: RewardsPreviewProps) {
  if (loading) {
    return (
      <div className="bento-card p-5 h-full">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bento-card p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Rewards</h3>
        <Link href="/dashboard/rewards" className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 flex-1">
        {REWARDS.map((r, i) => {
          const canRedeem = userHours >= r.cost;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${canRedeem ? "var(--border-subtle)" : "var(--border-subtle)"}`,
                opacity: canRedeem ? 1 : 0.5,
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: "var(--bg-overlay)" }}>
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{r.title}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-bold" style={{ color: "var(--violet)" }}>{r.cost}h</div>
                {!canRedeem && <Lock className="w-3 h-3 ml-auto mt-0.5" style={{ color: "var(--text-muted)" }} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--violet)", fontWeight: 600 }}>{userHours}h</span> available
        </p>
      </div>
    </motion.div>
  );
}
