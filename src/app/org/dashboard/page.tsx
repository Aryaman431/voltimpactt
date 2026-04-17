"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Plus, Calendar, Users, QrCode, TrendingUp,
  Clock, CheckCircle2, ArrowRight, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useVoltUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";

// ─── Mock org data ────────────────────────────────────────────────────────────
const MOCK_ORG_EVENTS = [
  {
    id: "oe_001", title: "Riverside Park Cleanup",  category: "Environment",
    date: new Date(Date.now() + 1000*60*60*48).toISOString(),
    participants: 12, max: 40, hours_credit: 3, check_in_hash: "PARK2026",
    checked_in: 0, status: "upcoming",
  },
  {
    id: "oe_002", title: "Youth Coding Workshop",   category: "Education",
    date: new Date(Date.now() + 1000*60*60*96).toISOString(),
    participants: 8,  max: 20, hours_credit: 4, check_in_hash: "CODE2026",
    checked_in: 0, status: "upcoming",
  },
  {
    id: "oe_003", title: "Beach Cleanup Drive",     category: "Environment",
    date: new Date(Date.now() - 1000*60*60*72).toISOString(),
    participants: 34, max: 50, hours_credit: 3, check_in_hash: "BEACH2026",
    checked_in: 34, status: "completed",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "#22c55e", Education: "#3b82f6",
  Community: "#f59e0b", Animals: "#a78bfa", Health: "#f43f5e",
};

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "#12141a", border: "1px solid rgba(255,255,255,0.07)" }}
      whileHover={{ y: -3, borderColor: `${accent}30` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</div>}
      </div>
      <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
    </motion.div>
  );
}

function HashCopy({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors hover:bg-white/5"
      style={{ color: copied ? "#00d4aa" : "rgba(255,255,255,0.3)" }}>
      <span className="font-mono text-xs">{hash}</span>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function OrgDashboardPage() {
  const { user } = useVoltUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", organization: "", description: "",
    location: "", category: "Community",
    date: "", hours_credit: "2", max_participants: "",
  });
  const [creating, setCreating] = useState(false);
  const [created, setCreated]   = useState(false);

  const totalParticipants = MOCK_ORG_EVENTS.reduce((s, e) => s + e.participants, 0);
  const totalHoursGiven   = MOCK_ORG_EVENTS.reduce((s, e) => s + e.checked_in * e.hours_credit, 0);
  const upcomingCount     = MOCK_ORG_EVENTS.filter((e) => e.status === "upcoming").length;

  const handleCreate = async () => {
    if (!form.title || !form.date) return;
    setCreating(true);
    const hash = form.title.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 4) + "2026";
    await supabase.from("events").insert({
      id: crypto.randomUUID(),
      organizer_id: user?.id ?? null,
      title: form.title,
      organization: form.organization || user?.name || "My Org",
      description: form.description,
      location: form.location,
      category: form.category,
      start_time: new Date(form.date).toISOString(),
      end_time: new Date(new Date(form.date).getTime() + parseInt(form.hours_credit) * 3600000).toISOString(),
      hours_credit: parseInt(form.hours_credit),
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      check_in_hash: hash,
    });
    setCreating(false);
    setCreated(true);
    setTimeout(() => { setCreated(false); setCreateOpen(false); setForm({ title:"",organization:"",description:"",location:"",category:"Community",date:"",hours_credit:"2",max_participants:"" }); }, 1500);
  };

  return (
    <div className="p-5 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight text-white">
            Organizer Dashboard
          </motion.h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Manage your events and volunteers
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar}    label="Total events"    value={String(MOCK_ORG_EVENTS.length)} sub="created"          accent="#a78bfa" />
        <StatCard icon={Users}       label="Participants"    value={String(totalParticipants)}       sub="across all events" accent="#00d4aa" />
        <StatCard icon={Clock}       label="Hours given"     value={`${totalHoursGiven}h`}           sub="verified"          accent="#3b82f6" />
        <StatCard icon={TrendingUp}  label="Upcoming"        value={String(upcomingCount)}           sub="events"            accent="#f59e0b" />
      </div>

      {/* Events list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#12141a", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white">Your Events</h2>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{MOCK_ORG_EVENTS.length} events</span>
        </div>

        <div>
          {MOCK_ORG_EVENTS.map((event, i) => {
            const color = CATEGORY_COLORS[event.category] ?? "#8b5cf6";
            const isPast = event.status === "completed";
            return (
              <motion.div key={event.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

                {/* Color dot */}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.participants}{event.max ? `/${event.max}` : ""}
                    </span>
                    <span style={{ color: "#a78bfa" }}>+{event.hours_credit}h</span>
                  </div>
                </div>

                {/* Check-in hash */}
                <HashCopy hash={event.check_in_hash} />

                {/* Status */}
                {isPast ? (
                  <div className="flex items-center gap-1 text-xs font-medium shrink-0" style={{ color: "#4ade80" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {event.checked_in} checked in
                  </div>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.2)" }}>
                    Upcoming
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create event modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
            <DialogDescription>Fill in the details. A unique check-in code will be generated.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {[
              { key: "title",        label: "Event title *",    placeholder: "Riverside Park Cleanup" },
              { key: "organization", label: "Organization",     placeholder: "Green City Initiative" },
              { key: "location",     label: "Location",         placeholder: "Central Park, New York" },
              { key: "description",  label: "Description",      placeholder: "Brief description of the event…", multiline: true },
            ].map(({ key, label, placeholder, multiline }) => (
              <div key={key}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
                {multiline ? (
                  <textarea
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={2}
                    className="input-base w-full px-3 py-2.5 text-sm resize-none"
                  />
                ) : (
                  <input
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input-base w-full px-3 py-2.5 text-sm"
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Date & time *</label>
                <input type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="input-base w-full px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Hours credit</label>
                <input type="number" min="1" max="12" value={form.hours_credit} onChange={(e) => setForm((f) => ({ ...f, hours_credit: e.target.value }))}
                  className="input-base w-full px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Max spots</label>
                <input type="number" min="1" placeholder="∞" value={form.max_participants} onChange={(e) => setForm((f) => ({ ...f, max_participants: e.target.value }))}
                  className="input-base w-full px-3 py-2.5 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="input-base w-full px-3 py-2.5 text-sm">
                {["Community","Environment","Education","Health","Animals"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate} disabled={creating || created || !form.title || !form.date}>
              {created ? <><CheckCircle2 className="w-3.5 h-3.5" /> Created!</> : creating ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
