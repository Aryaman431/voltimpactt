"use client";

import { motion } from "framer-motion";
import { Clock, Zap, Calendar, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatHours } from "@/lib/utils";
import type { User } from "@/types";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bento-card card-hover p-5 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {value}
        </div>
        {sub && (
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</div>
        )}
      </div>
      <div className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>{label}</div>
    </motion.div>
  );
}

interface ImpactStatsProps {
  user: User | null;
  eventsCount: number;
  loading?: boolean;
}

export default function ImpactStats({ user, eventsCount, loading }: ImpactStatsProps) {
  if (loading || !user) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bento-card p-5 space-y-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </>
    );
  }

  const stats: StatCardProps[] = [
    { icon: Clock,      label: "Total hours",    value: formatHours(user.total_hours), sub: "verified",       accent: "#8b5cf6" },
    { icon: Zap,        label: "Impact score",   value: user.impact_score.toLocaleString(), sub: "points",    accent: "#6366f1" },
    { icon: Calendar,   label: "Events",         value: eventsCount.toString(), sub: "attended",              accent: "#22c55e" },
    { icon: TrendingUp, label: "This month",     value: "12h", sub: "+3h vs last month",                      accent: "#f59e0b" },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 0.05} />
      ))}
    </>
  );
}
