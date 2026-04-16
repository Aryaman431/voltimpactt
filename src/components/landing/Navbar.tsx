"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, LayoutDashboard, Map, Calendar, Gift, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";

const APP_LINKS = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Overview"  },
  { href: "/discover",    icon: Map,             label: "Discover"  },
  { href: "/events",      icon: Calendar,        label: "Events"    },
  { href: "/rewards",     icon: Gift,            label: "Rewards"   },
  { href: "/badges",      icon: Award,           label: "Badges"    },
  { href: "/community",   icon: Users,           label: "Community" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn }              = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(15,17,21,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--indigo))" }}>
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>VoltImpact</span>
        </Link>

        {/* Desktop nav — show app links if signed in, marketing links if not */}
        <nav className="hidden md:flex items-center gap-0.5">
          {isSignedIn ? (
            APP_LINKS.map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/5"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}>
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))
          ) : (
            ["Features", "How it works", "Leaderboard"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-2 text-sm rounded-xl transition-colors hover:bg-white/5"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}>
                {item}
              </Link>
            ))
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4"
            style={{ background: "rgba(15,17,21,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-subtle)" }}
          >
            <nav className="flex flex-col gap-1 pt-3">
              {isSignedIn ? (
                APP_LINKS.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-secondary)" }}
                    onClick={() => setMobileOpen(false)}>
                    <item.icon className="w-4 h-4" style={{ color: "var(--violet)" }} />
                    {item.label}
                  </Link>
                ))
              ) : (
                <>
                  {["Features", "How it works"].map((item) => (
                    <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-2.5 text-sm rounded-xl transition-colors hover:bg-white/5"
                      style={{ color: "var(--text-secondary)" }}
                      onClick={() => setMobileOpen(false)}>
                      {item}
                    </Link>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Link href="/sign-in" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">Sign in</Button>
                    </Link>
                    <Link href="/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
