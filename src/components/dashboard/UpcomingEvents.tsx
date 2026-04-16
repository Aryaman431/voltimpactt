"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Clock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import type { EventWithParticipation } from "@/types";
import confetti from "canvas-confetti";

interface UpcomingEventsProps {
  events: EventWithParticipation[];
  loading?: boolean;
  onCheckIn?: (eventId: string, hash: string) => Promise<void>;
}

export default function UpcomingEvents({ events, loading, onCheckIn }: UpcomingEventsProps) {
  const [selected, setSelected] = useState<EventWithParticipation | null>(null);
  const [hash, setHash] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    if (!selected || !hash.trim()) { setError("Enter the check-in code"); return; }
    setChecking(true);
    setError("");
    try {
      await onCheckIn?.(selected.id, hash.trim().toUpperCase());
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#8b5cf6", "#6366f1", "#a78bfa"] });
      setSelected(null);
      setHash("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="bento-card p-5 h-full">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bento-card p-5 h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Upcoming Events</h3>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{events.length} registered</span>
        </div>

        {events.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>No upcoming events</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto">
            {events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ x: 2 }}
                className="p-3.5 rounded-xl transition-all cursor-default"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {event.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {event.organization}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                        <Clock className="w-3 h-3" />
                        {format(parseISO(event.start_time), "MMM d, h:mm a")}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--violet)" }}>
                        <Zap className="w-3 h-3" />
                        {event.hours_credit}h
                      </span>
                    </div>
                  </div>

                  {event.is_checked_in ? (
                    <div className="flex items-center gap-1 text-xs shrink-0" style={{ color: "#4ade80" }}>
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shrink-0 text-xs h-7 px-2.5"
                      onClick={() => setSelected(event)}
                    >
                      Check in
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setHash(""); setError(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check in to event</DialogTitle>
            <DialogDescription>Enter the code provided at the venue.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{selected.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{selected.organization}</p>
            </div>
          )}
          <div>
            <label className="text-xs mb-2 block" style={{ color: "var(--text-tertiary)" }}>Check-in code</label>
            <input
              value={hash}
              onChange={(e) => setHash(e.target.value.toUpperCase())}
              placeholder="e.g. PARK2026"
              className="input-base w-full px-3 py-2.5 text-sm font-mono tracking-widest"
            />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
            <Button size="sm" onClick={handleCheckIn} disabled={checking}>
              {checking ? "Verifying…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
