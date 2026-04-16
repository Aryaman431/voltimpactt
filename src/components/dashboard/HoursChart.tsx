"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { HoursLedgerEntry } from "@/types";

interface HoursChartProps {
  entries: HoursLedgerEntry[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{payload[0].value}h</p>
    </div>
  );
}

export default function HoursChart({ entries, loading }: HoursChartProps) {
  const data = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      days[format(subDays(new Date(), i), "MMM d")] = 0;
    }
    entries.forEach((e) => {
      const d = format(parseISO(e.created_at), "MMM d");
      if (d in days) days[d] += e.hours;
    });
    return Object.entries(days).map(([date, hours]) => ({ date, hours }));
  }, [entries]);

  if (loading) {
    return (
      <div className="bento-card p-5 h-full">
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bento-card p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Hours Ledger</h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Last 30 days</span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
              axisLine={false} tickLine={false} interval={6}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.04)" }} />
            <Area
              type="monotone" dataKey="hours"
              stroke="#8b5cf6" strokeWidth={1.5}
              fill="url(#grad)" dot={false}
              activeDot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
