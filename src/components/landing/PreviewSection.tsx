"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import {
  Map, Calendar, Gift, Award, Users, Lock,
  ArrowRight, Clock, MapPin, CheckCircle2, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Static preview data — shown on landing page
const PREVIEW_EVENTS = [
  { title: "Riverside Park Cleanup",  org: "Green City Initiative", category: "Environment", color: "#22c55e", emoji: "🌿", hours: 3, date: "Sat, May 3" },
  { title: "Youth Coding Workshop",   org: "Code for Kids",         category: "Education",   color: "#3b82f6", emoji: "📚", hours: 4, date: "Mon, May 5" },
  { title: "Animal Shelter Walk",     org: "Paws & Hearts",         category: "Animals",     color: "#a78bfa", emoji: "🐾", hours: 2, date: "Sun, May 4" },
];

const PREVIEW_BADGES = [
  { icon: "🌱", name: "First Step",       rarity: "common",    earned: true  },
  { icon: "⏰", name: "Ten Hours",        rarity: "common",    earned: true  },
  { icon: "🏘️", name: "Community Builder",rarity: "rare",      earned: true  },
  { icon: "🎯", name: "Half Century",     rarity: "rare",      earned: true  },
  { icon: "🔥", name: "Streak Master",    rarity: "rare",      earned: false },
  { icon: "💯", name: "Century Club",     rarity: "epic",      earned: false },
  { icon: "🥇", name: "Impact Leader",    rarity: "epic",      earned: false },
  { icon: "💎", name: "Platinum",         rarity: "legendary", earned: false },
];

const PREVIEW_REWARDS = [
  { emoji: "☕", title: "Coffee Voucher",    cost: 10,  unlocked: true  },
  { emoji: "💝", title: "Charity Donation",  cost: 20,  unlocked: true  },
  { emoji: "🎨", title: "Museum Pass",       cost: 25,  unlocked: false },
  { emoji: "👕", title: "VoltImpact Hoodie", cost: 50,  unlocked: false },
];

const RARITY_COLORS: Record<string, string> = {
  common: "#94a3b8", rare: "#60a5fa", epic: "#a78bfa", legendary: "#fbbf24",
};

function AuthGate({ href, label }: { href: string; label: string }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? (
    <Link href={href}>
      <Button size="sm" className="group">
        {label} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </Link>
  ) : (
    <Link href="/sign-up">
      <Button size="sm" variant="secondary" className="group">
        <Lock className="w-3.5 h-3.5" /> Sign up to access
      </Button>
    </Link>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, href, linkLabel }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; subtitle: string; href: string; linkLabel: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4" style={{ color: "var(--violet)" }} />
          <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{title}</h2>
        </div>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{subtitle}</p>
      </div>
      <AuthGate href={href} label={linkLabel} />
    </div>
  );
}

export default function PreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* ── Events preview ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            icon={Calendar}
            title="Upcoming Events"
            subtitle="Volunteer opportunities near you, verified and ready to join."
            href="/events"
            linkLabel="Browse all events"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            {PREVIEW_EVENTS.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                whileHover={{ y: -4, borderColor: `${event.color}35`, boxShadow: `0 0 0 1px ${event.color}20, 0 12px 32px rgba(0,0,0,0.4)` }}
              >
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${event.color}80, ${event.color}20)` }} />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${event.color}15`, border: `1px solid ${event.color}25` }}>
                      {event.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{event.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{event.org}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.date}</span>
                    <span className="font-bold" style={{ color: "var(--violet)" }}>+{event.hours}h</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Badges preview ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <SectionHeader
            icon={Award}
            title="Badges & Achievements"
            subtitle="Earn recognition as your impact grows. 12 badges across 4 rarity tiers."
            href="/badges"
            linkLabel="View all badges"
          />
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {PREVIEW_BADGES.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.04, type: "spring", stiffness: 300, damping: 22 }}
                title={badge.name}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-default"
                style={{
                  background: badge.earned ? `${RARITY_COLORS[badge.rarity]}12` : "var(--bg-surface)",
                  border: `1px solid ${badge.earned ? `${RARITY_COLORS[badge.rarity]}30` : "var(--border-subtle)"}`,
                  opacity: badge.earned ? 1 : 0.35,
                  filter: badge.earned ? "none" : "grayscale(0.8)",
                }}
                whileHover={badge.earned ? { y: -4, scale: 1.06 } : {}}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[9px] font-medium text-center leading-tight px-1"
                  style={{ color: badge.earned ? RARITY_COLORS[badge.rarity] : "var(--text-muted)" }}>
                  {badge.name.split(" ")[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Rewards preview ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <SectionHeader
            icon={Gift}
            title="Rewards"
            subtitle="Redeem your volunteer hours for real-world perks and experiences."
            href="/rewards"
            linkLabel="See all rewards"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PREVIEW_REWARDS.map((reward, i) => (
              <motion.div
                key={reward.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  opacity: reward.unlocked ? 1 : 0.5,
                }}
                whileHover={reward.unlocked ? { y: -4, boxShadow: "0 0 0 1px rgba(139,92,246,0.2), 0 12px 32px rgba(0,0,0,0.4)" } : {}}
              >
                {!reward.unlocked && (
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                    style={{ background: "rgba(15,17,21,0.45)", backdropFilter: "blur(2px)" }}>
                    <Lock className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </div>
                )}
                <span className="text-3xl">{reward.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{reward.title}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--violet)", fontWeight: 600 }}>{reward.cost}h required</p>
                </div>
                {reward.unlocked ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#4ade80" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Lock className="w-3 h-3" /> Locked
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Community preview ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <SectionHeader
            icon={Users}
            title="Community Feed"
            subtitle="See what volunteers around the world are doing right now."
            href="/community"
            linkLabel="Join the community"
          />
          <div className="space-y-3">
            {[
              { name: "Jordan Lee",   tier: "platinum", action: "checked in to Riverside Park Cleanup",  hours: 3,  time: "2m ago" },
              { name: "Maya Patel",   tier: "gold",     action: "earned the Century Club badge 🏅",      hours: null, time: "1h ago" },
              { name: "Sam Rivera",   tier: "gold",     action: "checked in to Youth Coding Workshop",   hours: 4,  time: "3h ago" },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: "rgba(139,92,246,0.15)", color: "var(--violet)" }}>
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.name}</span>
                    {" "}{item.action}
                    {item.hours && (
                      <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ background: "rgba(139,92,246,0.1)", color: "var(--violet)" }}>
                        <Zap className="w-2.5 h-2.5" />+{item.hours}h
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
