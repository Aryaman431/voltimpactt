"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Zap, Calendar, TrendingUp, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { useVoltStore, selectThisMonthHours, selectAttendedIds } from "@/lib/store";
import { getTierFromHours, formatHours, getGreeting } from "@/lib/utils";
import { useMemo } from "react";

const RANK_COLORS: Record<number, string> = { 1: "#f59e0b", 2: "#94a3b8", 3: "#b45309" };

function StatCard({
  icon: Icon, label, value, sub, accent, delay = 0,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string; sub?: string; accent: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bento-card card-hover p-5 flex flex-col gap-3"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{value}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>}
      </div>
      <div className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </motion.div>
  );
}

function MiniChart({ ledger }: { ledger: { hours: number; created_at: string }[] }) {
  const data = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      days[format(subDays(new Date(), i), "MMM d")] = 0;
    }
    ledger.forEach((e) => {
      const d = format(parseISO(e.created_at), "MMM d");
      if (d in days) days[d] += e.hours;
    });
    return Object.entries(days).map(([date, hours]) => ({ date, hours }));
  }, [ledger]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="rounded-xl px-3 py-2" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}>
                <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{payload[0].value}h</p>
              </div>
            ) : null
          }
          cursor={{ stroke: "rgba(255,255,255,0.04)" }}
        />
        <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#dg)" dot={false} activeDot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const user        = useVoltStore((s) => s.user);
  const leaderboard = useVoltStore((s) => s.leaderboard);
  const ledger      = useVoltStore((s) => s.ledger);
  const attendedIds = useVoltStore(selectAttendedIds);
  const monthHours  = useVoltStore(selectThisMonthHours);

  const attendedCount = useMemo(() => attendedIds ? attendedIds.split(",").filter(Boolean).length : 0, [attendedIds]);

  const tierInfo = getTierFromHours(user.total_hours);

  const quickLinks = [
    { href: "/discover",  label: "Find events",    emoji: "🗺️" },
    { href: "/rewards",   label: "Redeem rewards", emoji: "🎁" },
    { href: "/badges",    label: "View badges",    emoji: "🏅" },
    { href: "/community", label: "Community feed", emoji: "👥" },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      {/* Greeting */}
      <div className="mb-7">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {getGreeting()}, {user.name.split(" ")[0]} 👋
        </motion.h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Here's your impact at a glance
        </p>
      </div>

      {/* Tier progress banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="bento-card p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {formatHours(user.total_hours)}h
            </span>
            <span className="text-sm px-2.5 py-0.5 rounded-full font-semibold capitalize"
              style={{ background: "rgba(139,92,246,0.15)", color: "var(--violet)", border: "1px solid rgba(139,92,246,0.25)" }}>
              {tierInfo.label}
            </span>
            {user.streak_weeks > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                <Flame className="w-3 h-3" /> {user.streak_weeks}w streak
              </span>
            )}
          </div>
          {tierInfo.nextTier ? (
            <>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                <span>Progress to {tierInfo.tier === "bronze" ? "Silver" : tierInfo.tier === "silver" ? "Gold" : "Platinum"}</span>
                <span>{tierInfo.nextTier - user.total_hours}h remaining</span>
              </div>
              <Progress value={tierInfo.progress} />
            </>
          ) : (
            <p className="text-xs font-medium" style={{ color: "var(--violet)" }}>✦ Maximum tier achieved</p>
          )}
        </div>
        <Link href="/profile"
          className="flex items-center gap-1.5 text-sm font-medium shrink-0 transition-opacity hover:opacity-70"
          style={{ color: "var(--violet)" }}>
          View profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock}      label="Total hours"  value={formatHours(user.total_hours)}          sub="verified"                                    accent="#8b5cf6" delay={0.08} />
        <StatCard icon={Zap}        label="Impact score" value={user.impact_score.toLocaleString()}      sub="points"                                      accent="#6366f1" delay={0.12} />
        <StatCard icon={Calendar}   label="Events"       value={String(attendedCount)}                  sub="attended"                                    accent="#22c55e" delay={0.16} />
        <StatCard icon={TrendingUp} label="This month"   value={`${monthHours}h`}                        sub={monthHours > 0 ? "keep it up!" : "get started"} accent="#f59e0b" delay={0.20} />
      </div>

      {/* Chart + Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Hours chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="lg:col-span-2 bento-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Hours Ledger</h3>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Last 30 days</span>
          </div>
          <div style={{ height: 180 }}>
            <MiniChart ledger={ledger} />
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="bento-card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Leaderboard</h3>
            <Link href="/leaderboard" className="text-xs transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
              View all →
            </Link>
          </div>
          <div className="space-y-0.5 flex-1">
            {leaderboard.slice(0, 6).map((entry, i) => {
              const isMe = entry.id === user.id;
              return (
                <div key={entry.id}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors"
                  style={{ background: isMe ? "rgba(139,92,246,0.08)" : "transparent", border: isMe ? "1px solid rgba(139,92,246,0.15)" : "1px solid transparent" }}>
                  <div className="w-5 text-center shrink-0">
                    {entry.rank <= 3
                      ? <Crown className="w-3.5 h-3.5 mx-auto" style={{ color: RANK_COLORS[entry.rank] }} />
                      : <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{entry.rank}</span>
                    }
                  </div>
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarFallback className="text-[9px] font-bold" style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}>
                      {entry.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium flex-1 truncate" style={{ color: isMe ? "#c4b5fd" : "var(--text-secondary)" }}>
                    {entry.name.split(" ")[0]}{isMe && <span className="opacity-40 ml-1">(you)</span>}
                  </p>
                  <span className="text-xs font-semibold shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    {formatHours(entry.total_hours)}h
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <motion.div key={link.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <Link href={link.href} className="bento-card card-hover p-4 flex items-center gap-3 group">
                <span className="text-xl">{link.emoji}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
