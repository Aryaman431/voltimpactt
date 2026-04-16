"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, Hash, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shell/PageHeader";
import { useVoltUser } from "@/hooks/useUser";
import { useHoursLedger } from "@/hooks/useDashboard";
import HoursChart from "@/components/dashboard/HoursChart";
import { MOCK_LEDGER, MOCK_USER } from "@/lib/mock-data";
import { formatHours } from "@/lib/utils";

export default function LedgerPage() {
  const { user } = useVoltUser();
  const { entries, loading } = useHoursLedger(user?.id);

  const displayUser    = user ?? MOCK_USER;
  const displayEntries = entries.length > 0 ? entries : MOCK_LEDGER;
  const totalVerified  = displayEntries.filter((e) => e.verified).reduce((s, e) => s + e.hours, 0);

  return (
    <div className="p-5 lg:p-8 max-w-4xl">
      <PageHeader title="Hours Ledger" subtitle="Your Proof of Impact record" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total hours", value: formatHours(displayUser.total_hours), color: "var(--violet)" },
          { label: "Verified",    value: `${totalVerified}h`,                  color: "#4ade80" },
          { label: "Entries",     value: displayEntries.length.toString(),      color: "#60a5fa" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bento-card p-4">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-5 h-52">
        <HoursChart entries={displayEntries} loading={false} />
      </div>

      {/* Table */}
      <div className="bento-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Transaction history</h3>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{displayEntries.length} entries</span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : (
          <div>
            {displayEntries.map((entry, i) => (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: entry.verified ? "rgba(74,222,128,0.1)" : "var(--bg-surface)",
                    border: `1px solid ${entry.verified ? "rgba(74,222,128,0.2)" : "var(--border-subtle)"}`,
                  }}>
                  {entry.verified
                    ? <CheckCircle2 className="w-4 h-4" style={{ color: "#4ade80" }} />
                    : <Clock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {entry.description}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {format(parseISO(entry.created_at), "MMM d, yyyy")}
                    </span>
                    {entry.proof_hash && (
                      <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                        <Hash className="w-2.5 h-2.5" />{entry.proof_hash}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold" style={{ color: "var(--violet)" }}>+{entry.hours}h</span>
                  <div className="text-[10px] mt-0.5" style={{ color: entry.verified ? "#4ade80" : "var(--text-muted)" }}>
                    {entry.verified ? "Verified" : "Pending"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
