"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap, LayoutDashboard, Map, Calendar,
  Trophy, Gift, Award, Users, User, Menu, X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Overview"    },
  { href: "/discover",    icon: Map,             label: "Discover"    },
  { href: "/events",      icon: Calendar,        label: "Events"      },
  { href: "/rewards",     icon: Gift,            label: "Rewards"     },
  { href: "/badges",      icon: Award,           label: "Badges"      },
  { href: "/leaderboard", icon: Trophy,          label: "Leaderboard" },
  { href: "/community",   icon: Users,           label: "Community"   },
  { href: "/profile",     icon: User,            label: "Profile"     },
];

const BOTTOM_NAV = NAV.slice(0, 5);

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
      >
        <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-semibold tracking-tight text-sm" style={{ color: "var(--text-primary)" }}>
        VoltImpact
      </span>
    </Link>
  );
}

function NavLink({ item, active }: { item: typeof NAV[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
        active ? "text-white" : "hover:text-white/80"
      )}
      style={{ color: active ? "var(--text-primary)" : "var(--text-tertiary)" }}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {active && (
        <motion.div
          layoutId="sidebar-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
          style={{ background: "var(--violet)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <item.icon
        className="w-4 h-4 shrink-0 relative z-10 transition-colors"
        style={{ color: active ? "var(--violet)" : undefined }}
      />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/4 cursor-pointer">
          <UserButton />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Account</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-40"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: "rgba(15,17,21,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50"
              style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--border-subtle)" }}
              onClick={() => setMobileOpen(false)}
            >
              <button
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5"
                style={{ color: "var(--text-tertiary)" }}
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 mt-14 lg:mt-0 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-1 py-2"
        style={{ background: "rgba(15,17,21,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border-subtle)" }}
      >
        {BOTTOM_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
              style={{ color: active ? "var(--violet)" : "var(--text-muted)" }}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
