"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Users, TrendingUp, MessageCircle, Flame, Globe, Award, Gift } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useVoltStore } from "@/lib/store";
import { formatHours } from "@/lib/utils";
import type { FeedItem } from "@/lib/store";
import { useState } from "react";

const TIER_BADGE_VARIANT = {
  bronze: "bronze", silver: "silver", gold: "gold", platinum: "platinum",
} as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function actionText(item: FeedItem): React.ReactNode {
  switch (item.action_type) {
    case "check_in":
      return (
        <>
          checked in to{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.event_title}</span>
          {item.hours && (
            <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: "rgba(139,92,246,0.1)", color: "var(--violet)", border: "1px solid rgba(139,92,246,0.18)" }}>
              <Zap className="w-2.5 h-2.5" />+{item.hours}h
            </span>
          )}
        </>
      );
    case "badge_earned":
      return (
        <>
          earned the{" "}
          <span className="font-semibold" style={{ color: "#fbbf24" }}>{item.badge_name}</span>
          {" "}badge 🏅
        </>
      );
    case "reward_redeemed":
      return (
        <>
          redeemed{" "}
          <span className="font-semibold" style={{ color: "#4ade80" }}>{item.reward_title}</span>
          {" "}🎁
        </>
      );
    case "joined":
      return (
        <>
          joined{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.event_title}</span>
        </>
      );
    default:
      return null;
  }
}

function actionIcon(type: FeedItem["action_type"]) {
  switch (type) {
    case "check_in":       return <Zap className="w-3.5 h-3.5" style={{ color: "var(--violet)" }} />;
    case "badge_earned":   return <Award className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />;
    case "reward_redeemed":return <Gift className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />;
    case "joined":         return <Users className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />;
  }
}

export default function CommunityPage() {
  const feed        = useVoltStore((s) => s.feed);
  const toggleLike  = useVoltStore((s) => s.toggleLike);
  const user        = useVoltStore((s) => s.user);
  const leaderboard = useVoltStore((s) => s.leaderboard);
  const [activeFilter, setActiveFilter] = useState<"latest" | "trending">("latest");

  const sorted = [...feed].sort((a, b) =>
    activeFilter === "trending"
      ? b.likes - a.likes
      : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div className="px-5 lg:px-8 pt-7 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Community</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Live activity from volunteers around you</p>
      </div>

      <div className="px-5 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">

          {/* Feed */}
          <div className="flex-1 min-w-0">
            {/* Filter */}
            <div className="flex gap-2 mb-5">
              {([
                { key: "latest",   label: "Latest",   icon: Globe },
                { key: "trending", label: "Trending", icon: Flame },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveFilter(key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: activeFilter === key ? "var(--violet)" : "var(--bg-surface)",
                    color: activeFilter === key ? "#fff" : "var(--text-tertiary)",
                    border: `1px solid ${activeFilter === key ? "transparent" : "var(--border-subtle)"}`,
                  }}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sorted.map((item, i) => {
                  const isLiked = item.liked_by.includes(user.id);
                  const isMe    = item.user_id === user.id;
                  return (
                    <motion.article key={item.id} layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-2xl p-5"
                      style={{ background: "var(--bg-elevated)", border: isMe ? "1px solid rgba(139,92,246,0.2)" : "1px solid var(--border-subtle)" }}
                      whileHover={{ y: -2, borderColor: "var(--border-default)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>

                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm font-bold"
                              style={{ background: isMe ? "rgba(139,92,246,0.2)" : "var(--bg-overlay)", color: isMe ? "var(--violet)" : "var(--text-secondary)" }}>
                              {item.user_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Action type icon */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
                            {actionIcon(item.action_type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold" style={{ color: isMe ? "#c4b5fd" : "var(--text-primary)" }}>
                              {item.user_name}{isMe && <span className="text-xs opacity-40 ml-1">(you)</span>}
                            </span>
                            <Badge variant={TIER_BADGE_VARIANT[item.user_tier as keyof typeof TIER_BADGE_VARIANT]}>
                              {item.user_tier}
                            </Badge>
                            <span className="text-xs ml-auto shrink-0" style={{ color: "var(--text-muted)" }}>
                              {timeAgo(item.timestamp)}
                            </span>
                          </div>

                          <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {actionText(item)}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                            <motion.button
                              onClick={() => toggleLike(item.id)}
                              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                              style={{ color: isLiked ? "#f87171" : "var(--text-muted)" }}
                              whileTap={{ scale: 0.88 }}>
                              <Heart className={`w-4 h-4 transition-all duration-150 ${isLiked ? "fill-red-400" : ""}`} />
                              {item.likes}
                            </motion.button>
                            <button className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                              style={{ color: "var(--text-muted)" }}>
                              <MessageCircle className="w-4 h-4" />
                              Reply
                            </button>
                            {item.likes > 15 && (
                              <span className="ml-auto flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                                <Flame className="w-3 h-3" /> Trending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-4">
            {/* Stats */}
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Community Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: Users,      label: "Total volunteers", value: "12,400" },
                  { icon: Zap,        label: "Hours logged",     value: "84,000" },
                  { icon: TrendingUp, label: "Active today",     value: "47" },
                  { icon: Globe,      label: "Cities reached",   value: "28" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}>
                      <stat.icon className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <p className="text-xs flex-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Top Contributors</h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, i) => {
                  const isMe = entry.id === user.id;
                  return (
                    <div key={entry.id} className="flex items-center gap-3 py-1.5 px-2 rounded-xl transition-colors"
                      style={{ background: isMe ? "rgba(139,92,246,0.07)" : "transparent" }}>
                      <span className="text-xs font-bold w-5 text-center shrink-0"
                        style={{ color: i < 3 ? ["#f59e0b","#94a3b8","#b45309"][i] : "var(--text-muted)" }}>
                        {i + 1}
                      </span>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[10px] font-bold"
                          style={{ background: isMe ? "rgba(139,92,246,0.2)" : "var(--bg-overlay)", color: isMe ? "var(--violet)" : "var(--text-secondary)" }}>
                          {entry.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium flex-1 truncate" style={{ color: isMe ? "#c4b5fd" : "var(--text-primary)" }}>
                        {entry.name.split(" ")[0]}{isMe && <span className="opacity-40 ml-1">(you)</span>}
                      </p>
                      <span className="text-xs font-semibold shrink-0" style={{ color: "var(--violet)" }}>
                        {formatHours(entry.total_hours)}h
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
