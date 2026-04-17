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

// 5 items for bottom nav — most used
const BOTTOM_NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home"     },
  { href: "/discover",  icon: Map,             label: "Discover" },
  { href: "/events",    icon: Calendar,        label: "Events"   },
  { href: "/rewards",   icon: Gift,            label: "Rewards"  },
  { href: "/profile",   icon: User,            label: "Profile"  },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
        style={{ background: "linear-gradient(135deg, #00d4aa, #0099ff)" }}
      >
        <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-semibold tracking-tight text-sm" style={{ color: "var(--text-primary)" }}>
        VoltImpact
      </span>
    </Link>
  );
}

function NavLink({ item, active, onClick }: { item: typeof NAV[0]; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
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
          style={{ background: "var(--volt, #00d4aa)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <item.icon
        className="w-4 h-4 shrink-0 relative z-10"
        style={{ color: active ? "#00d4aa" : undefined }}
      />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            onClick={() => setMobileOpen(false)}
          />
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

      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-40"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--border-subtle)" }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{
          background: "rgba(15,17,21,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl transition-colors hover:bg-white/5 active:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/70"
              style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel — max 80vw so it never covers full screen */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col"
              style={{
                width: "min(280px, 82vw)",
                background: "var(--bg-elevated)",
                borderRight: "1px solid var(--border-subtle)",
                // Safe area for notched devices
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 active:bg-white/10 z-10"
                style={{ color: "var(--text-tertiary)" }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ────────────────────────────────────────── */}
      <main
        className="flex-1 lg:ml-60 min-h-screen w-full"
        style={{
          // Mobile: top bar (56px) + bottom nav (~64px + safe area)
          paddingTop: "3.5rem",   /* 56px = h-14 */
          paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Remove mobile padding on desktop */}
        <style>{`
          @media (min-width: 1024px) {
            main { padding-top: 0 !important; padding-bottom: 0 !important; }
          }
        `}</style>
        {children}
      </main>

      {/* ── Mobile bottom nav ───────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
        style={{
          background: "rgba(15,17,21,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border-subtle)",
          // Safe area inset for iPhone notch / home indicator
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
          paddingTop: "0.5rem",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
        }}
      >
        {BOTTOM_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all active:scale-95"
              style={{ color: active ? "#00d4aa" : "var(--text-muted)" }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                style={{
                  background: active ? "rgba(0,212,170,0.12)" : "transparent",
                }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? "#00d4aa" : "var(--text-muted)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
