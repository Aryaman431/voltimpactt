"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isPast, isFuture, formatDistanceToNow } from "date-fns";
import { Clock, MapPin, CheckCircle2, Search, Building2, Calendar, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  useVoltStore,
} from "@/lib/store";
import confetti from "canvas-confetti";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Community", "Animals"];

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  Environment: { emoji: "🌿", color: "#22c55e" },
  Education:   { emoji: "📚", color: "#3b82f6" },
  Health:      { emoji: "❤️", color: "#f43f5e" },
  Community:   { emoji: "🏘️", color: "#f59e0b" },
  Animals:     { emoji: "🐾", color: "#a78bfa" },
  default:     { emoji: "⚡", color: "#8b5cf6" },
};

export default function EventsPage() {
  const checkInToEvent = useVoltStore((s) => s.checkInToEvent);
  const joinEvent      = useVoltStore((s) => s.joinEvent);
  const user           = useVoltStore((s) => s.user);
  const allEvents      = useVoltStore((s) => s.events);

  const upcoming = useMemo(
    () => allEvents.filter((e) => new Date(e.end_time) > new Date()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEvents]
  );
  const attended = useMemo(
    () => allEvents.filter((e) => user.attended_event_ids.includes(e.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEvents, user.attended_event_ids]
  );

  const [tab, setTab]               = useState<"upcoming" | "attended">("upcoming");
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [checkInEvent, setCheckInEvent] = useState<typeof upcoming[0] | null>(null);
  const [detailEvent, setDetailEvent]   = useState<typeof upcoming[0] | null>(null);
  const [hash, setHash]             = useState("");
  const [checking, setChecking]     = useState(false);
  const [error, setError]           = useState("");

  const source = tab === "upcoming" ? upcoming : attended;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return source.filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(q) || e.organization.toLowerCase().includes(q);
      const matchCat    = category === "All" || e.category === category;
      return matchSearch && matchCat;
    });
  }, [source, search, category]);

  const handleCheckIn = async () => {
    if (!checkInEvent) return;
    setChecking(true); setError("");
    await new Promise((r) => setTimeout(r, 700));
    if (hash.toUpperCase() === checkInEvent.check_in_hash.toUpperCase()) {
      checkInToEvent(checkInEvent.id);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#8b5cf6", "#6366f1", "#a78bfa"] });
      setCheckInEvent(null); setHash("");
    } else {
      setError("Invalid code. The hint is shown above.");
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div className="px-5 lg:px-8 pt-7 pb-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Events</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Discover, join, and track your volunteer events
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 p-1 rounded-xl w-fit" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          {(["upcoming", "attended"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{
                background: tab === t ? "var(--bg-overlay)" : "transparent",
                color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)",
                border: tab === t ? "1px solid var(--border-default)" : "1px solid transparent",
              }}>
              {t === "upcoming" ? <Calendar className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {t}
              <span className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: tab === t ? "rgba(139,92,246,0.2)" : "var(--bg-overlay)", color: tab === t ? "var(--violet)" : "var(--text-muted)" }}>
                {t === "upcoming" ? upcoming.length : attended.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-8 py-5 max-w-6xl">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events…"
              className="input-base w-full pl-9 pr-3 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat] ?? CATEGORY_META.default;
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: category === cat ? "var(--violet)" : "var(--bg-surface)",
                    color: category === cat ? "#fff" : "var(--text-tertiary)",
                    border: `1px solid ${category === cat ? "transparent" : "var(--border-subtle)"}`,
                  }}>
                  {cat !== "All" && <span>{meta.emoji}</span>}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">{tab === "upcoming" ? "📅" : "✅"}</div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {tab === "upcoming" ? "No upcoming events" : "No attended events yet"}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {tab === "upcoming" ? "Try adjusting your filters." : "Check in to events to see them here."}
              </p>
            </motion.div>
          ) : (
            <motion.div key={`${tab}-${category}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((event, i) => {
                const isAttended = user.attended_event_ids.includes(event.id);
                const isJoined   = user.joined_event_ids.includes(event.id);
                const past       = isPast(parseISO(event.end_time));
                const meta       = CATEGORY_META[event.category] ?? CATEGORY_META.default;
                const timeLabel  = past
                  ? `Ended ${formatDistanceToNow(parseISO(event.end_time), { addSuffix: true })}`
                  : `Starts ${formatDistanceToNow(parseISO(event.start_time), { addSuffix: true })}`;

                return (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl flex flex-col overflow-hidden cursor-pointer"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                    whileHover={{ y: -4, boxShadow: `0 0 0 1px ${meta.color}25, 0 12px 32px rgba(0,0,0,0.4)`, borderColor: `${meta.color}35` }}
                    onClick={() => setDetailEvent(event)}>
                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${meta.color}70, ${meta.color}20)` }} />
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}>
                          {meta.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>{event.title}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
                            <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{event.organization}</p>
                          </div>
                        </div>
                        {isAttended && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)" }}>
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                          </div>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: "var(--text-secondary)" }}>
                        {event.description}
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {format(parseISO(event.start_time), "EEE, MMM d · h:mm a")}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          {event.participant_ids.length} participants
                          {event.max_participants && ` / ${event.max_participants} max`}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <div>
                          <span className="text-base font-bold" style={{ color: "var(--violet)" }}>+{event.hours_credit}h</span>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{timeLabel}</p>
                        </div>
                        {isAttended ? (
                          <span className="text-xs font-medium" style={{ color: "#4ade80" }}>✓ Attended</span>
                        ) : past ? (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Ended</span>
                        ) : isJoined ? (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); setCheckInEvent(event); }}>
                            <Zap className="w-3.5 h-3.5" /> Check in
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); joinEvent(event.id); }}>
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <Dialog open={!!detailEvent} onOpenChange={() => setDetailEvent(null)}>
        <DialogContent className="max-w-lg">
          {detailEvent && (() => {
            const meta = CATEGORY_META[detailEvent.category] ?? CATEGORY_META.default;
            const isAttended = user.attended_event_ids.includes(detailEvent.id);
            const isJoined   = user.joined_event_ids.includes(detailEvent.id);
            const past       = isPast(parseISO(detailEvent.end_time));
            return (
              <>
                <div className="h-1 w-full rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}40)` }} />
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}>
                      {detailEvent.category}
                    </span>
                  </div>
                  <DialogTitle>{detailEvent.title}</DialogTitle>
                  <DialogDescription>{detailEvent.organization}</DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{detailEvent.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Clock,  label: "Date & time",  value: format(parseISO(detailEvent.start_time), "MMM d, h:mm a") },
                    { icon: Zap,    label: "Hours credit",  value: `+${detailEvent.hours_credit} hours` },
                    { icon: MapPin, label: "Location",      value: detailEvent.location },
                    { icon: Users,  label: "Participants",  value: `${detailEvent.participant_ids.length}${detailEvent.max_participants ? ` / ${detailEvent.max_participants}` : ""}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <item.icon className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="ghost" size="sm" onClick={() => setDetailEvent(null)}>Close</Button>
                  {isAttended ? (
                    <span className="text-sm font-medium" style={{ color: "#4ade80" }}>✓ You attended this event</span>
                  ) : !past && isJoined ? (
                    <Button size="sm" onClick={() => { setCheckInEvent(detailEvent); setDetailEvent(null); }}>
                      <Zap className="w-3.5 h-3.5" /> Check in
                    </Button>
                  ) : !past && !isJoined ? (
                    <Button size="sm" variant="secondary" onClick={() => { joinEvent(detailEvent.id); setDetailEvent(null); }}>
                      Join event
                    </Button>
                  ) : null}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Check-in modal */}
      <Dialog open={!!checkInEvent} onOpenChange={() => { setCheckInEvent(null); setHash(""); setError(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check in to event</DialogTitle>
            <DialogDescription>Enter the unique code displayed at the venue.</DialogDescription>
          </DialogHeader>
          {checkInEvent && (
            <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{checkInEvent.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{checkInEvent.organization}</p>
              <p className="text-xs mt-2 font-mono px-2 py-1 rounded-lg w-fit"
                style={{ background: "var(--bg-overlay)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                Hint: {checkInEvent.check_in_hash}
              </p>
            </div>
          )}
          <div>
            <label className="text-xs mb-2 block font-medium" style={{ color: "var(--text-tertiary)" }}>Check-in code</label>
            <input value={hash} onChange={(e) => setHash(e.target.value.toUpperCase())} placeholder="Enter code…"
              className="input-base w-full px-3 py-2.5 text-sm font-mono tracking-widest" />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setCheckInEvent(null)}>Cancel</Button>
            <Button size="sm" onClick={handleCheckIn} disabled={checking}>{checking ? "Verifying…" : "Confirm check-in"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
