"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImpactGlobe = dynamic(() => import("@/components/three/ImpactGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full animate-pulse" style={{ background: "rgba(139,92,246,0.08)" }} />
    </div>
  ),
});

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Deterministic particle data — fixed values so SSR and client match exactly
const PARTICLE_DATA = [
  { w: 2.4, h: 1.8, l: 5.5,  t: 30.8, c: "#8b5cf6",           dur: 5.2, delay: 0.0 },
  { w: 1.6, h: 2.8, l: 31.4, t: 67.4, c: "#6366f1",           dur: 6.8, delay: 1.2 },
  { w: 3.2, h: 1.4, l: 47.4, t: 52.3, c: "rgba(255,255,255,0.3)", dur: 4.5, delay: 2.4 },
  { w: 2.1, h: 3.1, l: 9.2,  t: 92.0, c: "#8b5cf6",           dur: 7.1, delay: 0.8 },
  { w: 1.9, h: 2.5, l: 92.3, t: 22.0, c: "#6366f1",           dur: 5.8, delay: 3.1 },
  { w: 2.8, h: 1.6, l: 25.7, t: 31.8, c: "rgba(255,255,255,0.3)", dur: 6.2, delay: 1.7 },
  { w: 1.4, h: 2.2, l: 48.0, t: 23.2, c: "#8b5cf6",           dur: 4.9, delay: 4.0 },
  { w: 3.0, h: 1.9, l: 78.2, t: 78.1, c: "#6366f1",           dur: 7.4, delay: 0.3 },
  { w: 2.6, h: 3.4, l: 88.2, t: 4.6,  c: "rgba(255,255,255,0.3)", dur: 5.5, delay: 2.9 },
  { w: 1.8, h: 2.9, l: 59.7, t: 33.7, c: "#8b5cf6",           dur: 6.0, delay: 1.5 },
  { w: 2.3, h: 2.7, l: 87.3, t: 70.5, c: "#6366f1",           dur: 4.7, delay: 3.6 },
  { w: 1.5, h: 2.0, l: 47.1, t: 85.7, c: "rgba(255,255,255,0.3)", dur: 7.8, delay: 0.6 },
  { w: 2.9, h: 2.4, l: 81.0, t: 75.9, c: "#8b5cf6",           dur: 5.3, delay: 2.1 },
  { w: 2.0, h: 2.6, l: 53.8, t: 34.4, c: "#6366f1",           dur: 6.5, delay: 4.4 },
  { w: 1.3, h: 2.3, l: 95.2, t: 93.3, c: "rgba(255,255,255,0.3)", dur: 5.0, delay: 1.0 },
  { w: 1.4, h: 2.4, l: 94.4, t: 91.7, c: "#8b5cf6",           dur: 7.2, delay: 3.3 },
  { w: 3.0, h: 1.6, l: 96.9, t: 86.4, c: "#6366f1",           dur: 4.8, delay: 0.9 },
  { w: 1.6, h: 2.2, l: 60.6, t: 72.3, c: "rgba(255,255,255,0.3)", dur: 6.3, delay: 2.7 },
  { w: 3.6, h: 1.7, l: 19.8, t: 7.6,  c: "#8b5cf6",           dur: 5.7, delay: 1.4 },
  { w: 2.5, h: 2.4, l: 39.2, t: 31.0, c: "#6366f1",           dur: 6.9, delay: 3.8 },
] as const;

// Floating micro-particles — deterministic to avoid SSR/client hydration mismatch
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.w, height: p.h, left: `${p.l}%`, top: `${p.t}%`, background: p.c }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.55, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-[700px] h-[700px] top-1/4 left-1/2 -translate-x-1/2" style={{ background: "rgba(139,92,246,0.07)" }} />
        <div className="orb w-[400px] h-[400px] top-1/3 left-1/4" style={{ background: "rgba(99,102,241,0.05)" }} />
        <div className="orb w-[300px] h-[300px] bottom-1/4 right-1/4" style={{ background: "rgba(139,92,246,0.04)" }} />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <Particles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-6rem)]">

          {/* Left */}
          <div className="flex flex-col justify-center">
            <FadeUp delay={0} className="w-fit mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd" }}>
                <Sparkles className="w-3 h-3" />
                Proof of Impact Ledger — Now Live
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              {/* Light sweep on headline */}
              <div className="relative mb-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                  Turn Your Time
                  <br />
                  <span className="text-gradient relative">
                    Into Impact
                    {/* Sweep effect */}
                    <motion.span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    />
                  </span>
                </h1>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-lg leading-relaxed max-w-md mb-10" style={{ color: "var(--text-secondary)" }}>
                Track, verify, and showcase your real-world contributions.
                Every hour you give is recorded on the Proof of Impact Ledger —
                immutable, transparent, yours.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-3">
                <Link href="/sign-up">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="secondary">Explore Events</Button>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex items-center gap-8 mt-12 pt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                {[
                  { value: "12,400+", label: "Volunteers" },
                  { value: "84,000+", label: "Hours logged" },
                  { value: "340+",    label: "Organizations" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="orb w-80 h-80" style={{ background: "rgba(139,92,246,0.08)" }} />
            </div>

            <ImpactGlobe />

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute left-0 top-1/3 glass rounded-xl px-4 py-3 hidden lg:block"
            >
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Live impact</div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>+24 hours</div>
              <div className="text-xs" style={{ color: "var(--violet)" }}>logged today</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute right-0 bottom-1/3 glass rounded-xl px-4 py-3 hidden lg:block"
            >
              <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>New badge</div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>🏆 Century Club</div>
              <div className="text-xs" style={{ color: "var(--violet)" }}>100 hours milestone</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent"
        />
      </motion.div>
    </section>
  );
}
