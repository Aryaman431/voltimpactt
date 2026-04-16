"use client";

import { useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Clock, Zap, Calendar, Hash, CheckCircle2, Award, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  useVoltStore,
  selectUserRank,
} from "@/lib/store";
import { getTierFromHours, formatHours } from "@/lib/utils";

const ProfileCard3D = dynamic(() => import("@/components/three/ProfileCard3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full skeleton rounded-2xl" />,
});

const TIER_STYLES = {
  bronze:   { text: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  label: "Bronze"   },
  silver:   { text: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)", label: "Silver"   },
  gold:     { text: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  label: "Gold"     },
  platinum: { text: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", label: "Platinum" },
};

const SKILLS = ["Community Building", "Environmental Action", "Youth Education", "Health & Wellness", "Tech for Good", "Animal Care", "Food Security"];

const CERTS = [
  { title: "First Aid & CPR Certified",  issuer: "American Red Cross",   date: "2024-03-15", icon: "🏥" },
  { title: "Food Safety Handler",        issuer: "City Health Dept.",    date: "2024-06-01", icon: "🍽️" },
  { title: "Youth Mentorship Training",  issuer: "Code for Kids",        date: "2024-11-20", icon: "👨‍🏫" },
  { title: "Environmental Stewardship", issuer: "Green City Initiative", date: "2025-01-10", icon: "🌿" },
];

export default function ProfilePage() {
  const user          = useVoltStore((s) => s.user);
  const ledger        = useVoltStore((s) => s.ledger);
  const allBadges     = useVoltStore((s) => s.badges);
  const allEvents     = useVoltStore((s) => s.events);
  const allRewards    = useVoltStore((s) => s.rewards);
  const userRank      = useVoltStore(selectUserRank);

  const earnedBadges  = useMemo(() => allBadges.filter((b) => b.earned), [allBadges]);
  const attendedEvts  = useMemo(() => allEvents.filter((e) => user.attended_event_ids.includes(e.id)), [allEvents, user.attended_event_ids]);
  const redeemedRwds  = useMemo(() => allRewards.filter((r) => user.redeemed_reward_ids.includes(r.id)), [allRewards, user.redeemed_reward_ids]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "certs">("overview");

  const tierInfo   = getTierFromHours(user.total_hours);
  const tierStyle  = TIER_STYLES[user.tier];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top)  / rect.height - 0.5) * 7,
      y: ((e.clientX - rect.left) / rect.width  - 0.5) * -7,
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 100%)" }} />

        <div className="relative px-5 lg:px-8 pt-7 pb-8 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 3D card */}
            <motion.div ref={cardRef}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 200ms ease" }}
              className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden shrink-0">
              <ProfileCard3D tier={user.tier} />
            </motion.div>

            {/* User info */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2" style={{ "--tw-ring-color": "var(--border-default)" } as React.CSSProperties}>
                    <AvatarFallback className="text-xl font-bold"
                      style={{ background: "rgba(139,92,246,0.15)", color: "var(--violet)" }}>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{user.name}</h1>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>{user.email}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      Member since {format(parseISO(user.created_at), "MMMM yyyy")}
                      {userRank && <span className="ml-2">· Rank #{userRank}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-sm font-bold"
                    style={{ background: tierStyle.bg, color: tierStyle.text, border: `1px solid ${tierStyle.border}` }}>
                    {tierStyle.label}
                  </span>
                  <Button variant="secondary" size="sm"><Share2 className="w-3.5 h-3.5" /> Share</Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-5">
                {[
                  { label: "Total hours",  value: formatHours(user.total_hours), color: "var(--violet)" },
                  { label: "Events",       value: String(attendedEvts.length),   color: "#22c55e" },
                  { label: "Impact score", value: user.impact_score.toLocaleString(), color: "#f59e0b" },
                  { label: "Badges",       value: String(earnedBadges.length),   color: "#60a5fa" },
                  { label: "Redeemed",     value: String(redeemedRwds.length),   color: "#ec4899" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Tier progress */}
              {tierInfo.nextTier ? (
                <div className="max-w-sm">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                    <span>{tierStyle.label} tier</span>
                    <span>{tierInfo.nextTier - user.total_hours}h to next tier</span>
                  </div>
                  <Progress value={tierInfo.progress} />
                </div>
              ) : (
                <p className="text-xs font-semibold" style={{ color: "var(--violet)" }}>✦ Maximum tier achieved</p>
              )}
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 p-1 rounded-xl w-fit" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            {(["overview", "activity", "certs"] as const).map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: activeTab === t ? "var(--bg-overlay)" : "transparent",
                  color: activeTab === t ? "var(--text-primary)" : "var(--text-tertiary)",
                  border: activeTab === t ? "1px solid var(--border-default)" : "1px solid transparent",
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-5 lg:px-8 py-6 max-w-5xl">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-5">
            {/* Badges */}
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Award className="w-4 h-4 text-violet-400" /> Earned Badges
                </h2>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{earnedBadges.length} earned</span>
              </div>
              {earnedBadges.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>Complete events to earn badges</p>
              ) : (
                <div className="grid grid-cols-5 gap-2.5">
                  {earnedBadges.map((b) => (
                    <div key={b.id} title={`${b.name}: ${b.description}`}
                      className="aspect-square rounded-xl flex items-center justify-center text-2xl cursor-default transition-all hover:scale-110 hover:-translate-y-1"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      {b.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <h2 className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Areas of Impact</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Attended events */}
            <div className="rounded-2xl p-5 lg:col-span-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <h2 className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Events Attended</h2>
              {attendedEvts.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>No events attended yet</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {attendedEvts.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>✅</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{event.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{event.organization}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Clock className="w-3 h-3" />
                          {format(parseISO(event.start_time), "MMM d, yyyy")}
                          <span className="ml-auto font-semibold" style={{ color: "var(--violet)" }}>+{event.hours_credit}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Redeemed rewards */}
            {redeemedRwds.length > 0 && (
              <div className="rounded-2xl p-5 lg:col-span-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                <h2 className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Redeemed Rewards</h2>
                <div className="flex flex-wrap gap-3">
                  {redeemedRwds.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <span className="text-lg">{r.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{r.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ACTIVITY */}
        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Activity Timeline</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{ledger.length} entries · all verified contributions</p>
              </div>
              <div className="relative">
                <div className="absolute left-[2.75rem] top-0 bottom-0 w-px" style={{ background: "var(--border-subtle)" }} />
                {ledger.map((entry, i) => (
                  <div key={entry.id} className="flex items-start gap-4 px-5 py-4 relative"
                    style={{ borderBottom: i < ledger.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative z-10"
                      style={{
                        background: entry.verified ? "rgba(74,222,128,0.12)" : "var(--bg-surface)",
                        border: `2px solid ${entry.verified ? "rgba(74,222,128,0.3)" : "var(--border-subtle)"}`,
                      }}>
                      {entry.verified
                        ? <CheckCircle2 className="w-4 h-4" style={{ color: "#4ade80" }} />
                        : <Clock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{entry.description}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {format(parseISO(entry.created_at), "MMMM d, yyyy")}
                        </span>
                        {entry.proof_hash && (
                          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-lg"
                            style={{ background: "var(--bg-surface)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                            <Hash className="w-2.5 h-2.5" />{entry.proof_hash}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: entry.verified ? "rgba(74,222,128,0.1)" : "var(--bg-surface)",
                            color: entry.verified ? "#4ade80" : "var(--text-muted)",
                            border: `1px solid ${entry.verified ? "rgba(74,222,128,0.2)" : "var(--border-subtle)"}`,
                          }}>
                          {entry.verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 pt-1">
                      <span className="text-base font-bold" style={{ color: "var(--violet)" }}>+{entry.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CERTS */}
        {activeTab === "certs" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid sm:grid-cols-2 gap-4">
              {CERTS.map((cert, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-5 flex items-start gap-4"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                  whileHover={{ y: -3, borderColor: "var(--border-default)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    {cert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{cert.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{cert.issuer}</p>
                    <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                      Issued {format(parseISO(cert.date), "MMMM yyyy")}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#4ade80" }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
