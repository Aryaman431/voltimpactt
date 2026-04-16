"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Search, Clock, MapPin, X, ChevronRight,
  Users, Zap, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useVoltStore } from "@/lib/store";
import confetti from "canvas-confetti";

const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--violet) transparent transparent transparent" }} />
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading map…</p>
      </div>
    </div>
  ),
});

const CATEGORIES = ["All", "Environment", "Education", "Health", "Community", "Animals"];

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "#22c55e", Education: "#3b82f6", Health: "#f43f5e",
  Community: "#f59e0b", Animals: "#a78bfa", All: "#8b5cf6",
};

export default function DiscoverPage() {
  const events         = useVoltStore((s) => s.events);
  const user           = useVoltStore((s) => s.user);
  const checkInToEvent = useVoltStore((s) => s.checkInToEvent);
  const joinEvent      = useVoltStore((s) => s.joinEvent);
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All");
  const [selected, setSelected]         = useState<typeof events[0] | null>(null);
  const [checkInEvent, setCheckInEvent] = useState<typeof events[0] | null>(null);
  const [hash, setHash]                 = useState("");
  const [checking, setChecking]         = useState(false);
  const [error, setError]               = useState("");
  const [checkedIn, setCheckedIn]       = useState<Set<string>>(new Set());
  const [view, setView]                 = useState<"split" | "map" | "list">("split");

  const filtered = useMemo(() =>
    events.filter((e) => {
      const q = search.toLowerCase();
      return (
        (e.title.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)) &&
        (category === "All" || e.category === category)
      );
    }),
    [search, category]
  );

  const handleCheckIn = async () => {
    if (!checkInEvent) return;
    setChecking(true); setError("");
    await new Promise((r) => setTimeout(r, 700));
    if (hash.toUpperCase() === checkInEvent.check_in_hash.toUpperCase()) {
      checkInToEvent(checkInEvent.id);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#8b5cf6", "#6366f1", "#a78bfa"] });
      setCheckInEvent(null); setHash("");
    } else {
      setError("Invalid code. Check the event details for the hint.");
    }
    setChecking(false);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }} >
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Discover Events
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {filtered.length} events near you
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, orgs…"
              className="input-base w-full pl-9 pr-3 py-2 text-sm"
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--border-subtle)" }}>
            {(["split", "map", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-2 text-xs font-medium capitalize transition-colors"
                style={{
                  background: view === v ? "var(--bg-overlay)" : "transparent",
                  color: view === v ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────────────── */}
      <div
        className="shrink-0 flex gap-2 overflow-x-auto px-5 py-2.5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: category === cat ? "var(--violet)" : "var(--bg-surface)",
              color: category === cat ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${category === cat ? "transparent" : "var(--border-subtle)"}`,
            }}
          >
            {cat !== "All" && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
            )}
            {cat}
          </button>
        ))}
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Event list panel */}
        {view !== "map" && (
          <div
            className={`flex flex-col overflow-hidden ${view === "split" ? "w-full lg:w-[360px] xl:w-[400px] shrink-0" : "w-full"}`}
            style={{ borderRight: view === "split" ? "1px solid var(--border-subtle)" : "none" }}
          >
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No events found</p>
                </div>
              ) : (
                filtered.map((event) => {
                  const isSelected = selected?.id === event.id;
                  const isDone = checkedIn.has(event.id);
                  return (
                    <motion.button
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelected(isSelected ? null : event)}
                      className="w-full text-left p-4 rounded-2xl transition-all"
                      style={{
                        background: isSelected ? "var(--bg-overlay)" : "var(--bg-surface)",
                        border: `1px solid ${isSelected ? "rgba(139,92,246,0.4)" : "var(--border-subtle)"}`,
                        boxShadow: isSelected ? "0 0 0 1px rgba(139,92,246,0.15)" : "none",
                      }}
                      whileHover={{ y: -1 }}
                    >
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                            {event.title}
                          </p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-tertiary)" }}>
                            {event.organization}
                          </p>
                        </div>
                        <span
                          className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: `${CATEGORY_COLORS[event.category]}18`,
                            color: CATEGORY_COLORS[event.category],
                            border: `1px solid ${CATEGORY_COLORS[event.category]}30`,
                          }}
                        >
                          {event.category}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(event.start_time), "MMM d, h:mm a")}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {event.location.split(",")[0]}
                        </span>
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                          {event.max_participants && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.max_participants} spots
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isDone && (
                            <span className="text-[10px] font-medium" style={{ color: "#4ade80" }}>✓ Attended</span>
                          )}
                          <span className="text-xs font-bold" style={{ color: "var(--violet)" }}>
                            +{event.hours_credit}h
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Map panel */}
        {view !== "list" && (
          <div className="flex-1 relative min-h-0">
            <EventMap
              events={filtered.filter((e) => e.lat && e.lng)}
              selectedId={selected?.id ?? null}
              onSelect={(e) => setSelected(e as typeof filtered[0])}
            />

            {/* Selected event card overlay */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute bottom-5 left-4 right-4 lg:left-auto lg:right-5 lg:w-[340px] rounded-2xl p-5 z-[1000]"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  }}
                >
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Category tag */}
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full mb-3"
                    style={{
                      background: `${CATEGORY_COLORS[selected.category]}15`,
                      color: CATEGORY_COLORS[selected.category],
                      border: `1px solid ${CATEGORY_COLORS[selected.category]}25`,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[selected.category] }} />
                    {selected.category}
                  </span>

                  <h3 className="font-bold text-base pr-6 leading-tight" style={{ color: "var(--text-primary)" }}>
                    {selected.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {selected.organization}
                  </p>

                  <p className="text-xs mt-3 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {selected.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-xl p-2.5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Date & time</p>
                      <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {format(parseISO(selected.start_time), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>Hours credit</p>
                      <p className="text-xs font-bold" style={{ color: "var(--violet)" }}>
                        +{selected.hours_credit} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    {selected.location}
                  </div>

                  <Button
                    className="w-full mt-4"
                    size="sm"
                    disabled={user.attended_event_ids.includes(selected.id)}
                    onClick={() => { setCheckInEvent(selected); setSelected(null); }}
                  >
                    {user.attended_event_ids.includes(selected.id) ? "✓ Already checked in" : (
                      <><Zap className="w-3.5 h-3.5" /> Check in to this event</>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Check-in modal ──────────────────────────────────────────── */}
      <Dialog open={!!checkInEvent} onOpenChange={() => { setCheckInEvent(null); setHash(""); setError(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check in to event</DialogTitle>
            <DialogDescription>
              Enter the unique code displayed at the venue to verify your attendance.
            </DialogDescription>
          </DialogHeader>

          {checkInEvent && (
            <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{checkInEvent.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{checkInEvent.organization}</p>
              <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(parseISO(checkInEvent.start_time), "MMM d, h:mm a")}</span>
                <span className="font-semibold" style={{ color: "var(--violet)" }}>+{checkInEvent.hours_credit}h</span>
              </div>
              <p className="text-[11px] mt-2 font-mono px-2 py-1 rounded-lg w-fit"
                style={{ background: "var(--bg-overlay)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                Hint: {checkInEvent.check_in_hash}
              </p>
            </div>
          )}

          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: "var(--text-tertiary)" }}>
              Check-in code
            </label>
            <input
              value={hash}
              onChange={(e) => setHash(e.target.value.toUpperCase())}
              placeholder="e.g. PARK2026"
              className="input-base w-full px-3 py-2.5 text-sm font-mono tracking-widest"
            />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setCheckInEvent(null)}>Cancel</Button>
            <Button size="sm" onClick={handleCheckIn} disabled={checking}>
              {checking ? "Verifying…" : "Confirm check-in"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
