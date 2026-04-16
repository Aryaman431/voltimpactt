"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, LayoutDashboard, Calendar, Clock,
  Trophy, Gift, Settings, Map, Users, Menu, X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",             icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/discover",    icon: Map,             label: "Discover" },
  { href: "/dashboard/events",      icon: Calendar,        label: "Events" },
  { href: "/dashboard/ledger",      icon: Clock,           label: "Ledger" },
  { href: "/dashboard/leaderboard", icon: Trophy,          label: "Leaderboard" },
  { href: "/dashboard/rewards",     icon: Gift,            label: "Rewards" },
  { href: "/dashboard/community",   icon: Users,           label: "Community" },
  { href: "/dashboard/profile",     icon: Settings,        label: "Profile" },
];

function NavItem({ item, active }: { item: typeof navItems[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
        active
          ? "text-white"
          : "text-white/40 hover:text-white/80"
      )}
    >
      {active && (
        <motion.div
          layoutId="nav-bg"
          className="absolute inset-0 rounded-xl"
          style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {active && (
        <motion.div
          layoutId="nav-accent"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
          style={{ background: "var(--violet)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <item.icon
        className={cn(
          "w-4 h-4 shrink-0 relative z-10 transition-colors",
          active ? "text-violet-400" : "group-hover:text-white/60"
        )}
      />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--indigo))" }}>
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            VoltImpact
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} active={pathname === item.href} />
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/4 cursor-pointer">
          <UserButton />
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Account</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 w-60 flex-col z-40 hidden lg:flex"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: "rgba(15,17,21,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--indigo))" }}>
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm">VoltImpact</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: "var(--text-secondary)" }}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col"
              style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--border-subtle)" }}
              onClick={() => setMobileOpen(false)}
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: "rgba(15,17,21,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border-subtle)" }}
      >
        {navItems.slice(0, 5).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                active ? "text-violet-400" : "text-white/30"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
