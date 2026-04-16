"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useVoltStore } from "@/lib/store";
import { getTierFromHours } from "@/lib/utils";
import type { MockReward } from "@/lib/mock-data";
import confetti from "canvas-confetti";

const TIER_ORDER = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
const TIER_LABELS = { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" };

const CATEGORY_META: Record<string, { color: string; bg: string; label: string }> = {
  food:       { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Food & Drink" },
  charity:    { color: "#ec4899", bg: "rgba(236,72,153,0.1)",  label: "Charity" },
  culture:    { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  label: "Culture" },
  experience: { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   label: "Experience" },
  wellness:   { color: "#14b8a6", bg: "rgba(20,184,166,0.1)",  label: "Wellness" },
  merch:      { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  label: "Merch" },
  digital:    { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  label: "Digital" },
};

export default function RewardsPage() {
  const user          = useVoltStore((s) => s.user);
  const rewards       = useVoltStore((s) => s.rewards);
  const redeemReward  = useVoltStore((s) => s.redeemReward);

  const redeemed = useMemo(
    () => rewards.filter((r) => user.redeemed_reward_ids.includes(r.id)),
    [rewards, user.redeemed_reward_ids]
  );

  const userHours = user.total_hours;
  const userTier  = user.tier;
  const tierInfo  = getTierFromHours(userHours);

  const [selected, setSelected]   = useState<MockReward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [filter, setFilter]       = useState<"all" | "available" | "locked">("all");

  const canRedeem = (r: MockReward) => {
    const hoursOk = userHours >= r.cost_hours;
    const tierOk  = !r.tier_required || TIER_ORDER[userTier] >= TIER_ORDER[r.tier_required];
    return hoursOk && tierOk;
  };

  const filtered = rewards.filter((r) => {
    if (filter === "available") return canRedeem(r) && !user.redeemed_reward_ids.includes(r.id);
    if (filter === "locked")    return !canRedeem(r);
    return true;
  });

  const availableCount = rewards.filter((r) => canRedeem(r) && !user.redeemed_reward_ids.includes(r.id)).length;

  const handleRedeem = async () => {
    if (!selected) return;
    setRedeeming(true);
    await new Promise((r) => setTimeout(r, 700));
    redeemReward(selected.id);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#8b5cf6", "#6366f1", "#a78bfa", "#fbbf24"] });
    setSelected(null);
    setRedeeming(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="px-5 lg:px-8 pt-7 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Rewards</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Redeem your volunteer hours for real-world rewards</p>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-6xl">
        {/* Balance card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>⚡</div>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>Available balance</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{userHours}</span>
                  <span className="text-base" style={{ color: "var(--text-tertiary)" }}>hours</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 self-center" style={{ background: "var(--border-subtle)" }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Current tier</p>
              <span className="text-sm font-bold capitalize px-3 py-1 rounded-full"
                style={{ background: "rgba(139,92,246,0.12)", color: "var(--violet)", border: "1px solid rgba(139,92,246,0.2)" }}>
                {TIER_LABELS[userTier]}
              </span>
            </div>
            <div className="hidden sm:block w-px h-12 self-center" style={{ background: "var(--border-subtle)" }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Redeemed</p>
              <span className="text-2xl font-bold" style={{ color: "#4ade80" }}>{redeemed.length}</span>
              <span className="text-sm ml-1.5" style={{ color: "var(--text-tertiary)" }}>rewards</span>
            </div>
            {tierInfo.nextTier && (
              <div className="sm:ml-auto sm:w-48">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                  <span>{TIER_LABELS[userTier]}</span>
                  <span>{Math.round(tierInfo.progress)}%</span>
                </div>
                <Progress value={tierInfo.progress} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(["all", "available", "locked"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all"
                style={{
                  background: filter === f ? "var(--violet)" : "var(--bg-surface)",
                  color: filter === f ? "#fff" : "var(--text-tertiary)",
                  border: `1px solid ${filter === f ? "transparent" : "var(--border-subtle)"}`,
                }}>
                {f}
                {f === "available" && availableCount > 0 && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: filter === f ? "rgba(255,255,255,0.2)" : "rgba(74,222,128,0.15)", color: filter === f ? "#fff" : "#4ade80" }}>
                    {availableCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{filtered.length} rewards</p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((reward, i) => {
            const unlocked    = canRedeem(reward);
            const isRedeemed  = user.redeemed_reward_ids.includes(reward.id);
            const cat         = CATEGORY_META[reward.category] ?? { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", label: reward.category };

            return (
              <motion.div key={reward.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl flex flex-col overflow-hidden relative"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", opacity: unlocked ? 1 : 0.55 }}
                whileHover={unlocked ? { y: -4, boxShadow: `0 0 0 1px ${cat.color}30, 0 12px 32px rgba(0,0,0,0.4)`, borderColor: `${cat.color}40` } : {}}>

                {!unlocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl"
                    style={{ background: "rgba(15,17,21,0.5)", backdropFilter: "blur(3px)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
                      <Lock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    </div>
                    <p className="text-xs font-medium text-center px-4" style={{ color: "var(--text-muted)" }}>
                      {reward.tier_required && TIER_ORDER[userTier] < TIER_ORDER[reward.tier_required]
                        ? `Requires ${TIER_LABELS[reward.tier_required]} tier`
                        : `Need ${reward.cost_hours - userHours}h more`}
                    </p>
                  </div>
                )}

                <div className="h-1" style={{ background: `linear-gradient(90deg, ${cat.color}80, ${cat.color}20)` }} />
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: cat.bg, border: `1px solid ${cat.color}25` }}>
                      {reward.emoji}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{reward.title}</h3>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{reward.description}</p>
                  </div>
                  <div className="rounded-xl p-3 flex items-center justify-between"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                    <div>
                      <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Required</p>
                      <p className="text-sm font-bold" style={{ color: "var(--violet)" }}>{reward.cost_hours}h</p>
                    </div>
                    {reward.tier_required && (
                      <div className="text-right">
                        <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Min tier</p>
                        <p className="text-xs font-semibold capitalize" style={{ color: "var(--text-secondary)" }}>
                          {TIER_LABELS[reward.tier_required]}
                        </p>
                      </div>
                    )}
                  </div>
                  {isRedeemed ? (
                    <div className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                      <CheckCircle2 className="w-4 h-4" /> Redeemed
                    </div>
                  ) : (
                    <Button size="sm" variant={unlocked ? "default" : "ghost"} className="w-full"
                      disabled={!unlocked} onClick={() => unlocked && setSelected(reward)}>
                      {unlocked ? <><Gift className="w-3.5 h-3.5" /> Redeem now</> : "Locked"}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirm modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm redemption</DialogTitle>
            <DialogDescription>This will use {selected?.cost_hours} hours from your balance.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{selected.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{selected.description}</p>
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            {[
              { label: "Your balance", value: `${userHours}h`,                  color: "var(--text-primary)" },
              { label: "Cost",         value: `−${selected?.cost_hours ?? 0}h`, color: "#f87171" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span style={{ color: "var(--text-tertiary)" }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <span style={{ color: "var(--text-tertiary)" }}>Remaining after</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{userHours - (selected?.cost_hours ?? 0)}h</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
            <Button size="sm" onClick={handleRedeem} disabled={redeeming}>{redeeming ? "Processing…" : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
