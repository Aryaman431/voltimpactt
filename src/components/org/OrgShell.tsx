"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap, LayoutDashboard, Calendar, Users,
  QrCode, BarChart3, Settings, Menu, X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/org/dashboard",    icon: LayoutDashboard, label: "Overview"     },
  { href: "/org/events",       icon: Calendar,        label: "My Events"    },
  { href: "/org/participants",  icon: Users,           label: "Participants" },
  { href: "/org/verify",       icon: QrCode,          label: "Verify"       },
  { href: "/org/analytics",    icon: BarChart3,       label: "Analytics"    },
];

function Logo() {
  return (
    <Link href="/org/dashboard" className="flex items-center gap-2.5 group">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
        style={{ background: "linear-gradient(135deg, #a78bfa, #6366f1)" }}
      >
        <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div>
        <span className="font-semibold tracking-tight text-sm text-white block leading-none">
          VoltImpact
        </span>
        <span className="text-[10px] font-medium" style={{ color: "#a78bfa" }}>
          Organizer
        </span>
      </div>
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
      style={{ color: active ? "white" : "rgba(255,255,255,0.4)" }}
    >
      {active && (
        <motion.div
          layoutId="org-nav-bg"
          className="absolute inset-0 rounded-xl"
          style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {active && (
        <motion.div
          layoutId="org-nav-bar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
          style={{ background: "#a78bfa" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      <item.icon
        className="w-4 h-4 shrink-0 relative z-10"
        style={{ color: active ? "#a78bfa" : undefined }}
      />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export default function OrgShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} onClick={() => setMobileOpen(false)} />
        ))}
      </nav>
      <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors hover:bg-white/5 mb-2"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          ← Switch to Volunteer view
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 cursor-pointer">
          <UserButton />
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Account</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#0f1115" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-40"
        style={{ background: "#12141a", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
        style={{ background: "rgba(15,17,21,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Logo />
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: "rgba(255,255,255,0.6)" }}>
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/70" style={{ backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col"
              style={{ width: "min(280px,82vw)", background: "#12141a", borderRight: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5" style={{ color: "rgba(255,255,255,0.4)" }} onClick={() => setMobileOpen(false)}>
                <X className="w-4 h-4" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-60 min-h-screen" style={{ paddingTop: "3.5rem" }}>
        <style>{`@media (min-width: 1024px) { main { padding-top: 0 !important; } }`}</style>
        {children}
      </main>
    </div>
  );
}
