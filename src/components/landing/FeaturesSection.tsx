"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  BarChart3,
  Trophy,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Proof of Impact Ledger",
    description:
      "Every volunteer hour is cryptographically verified and recorded. Your contributions are immutable and portable.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track your impact over time with beautiful charts. See trends, milestones, and your contribution to the community.",
    color: "blue",
  },
  {
    icon: Trophy,
    title: "Tiered Recognition",
    description:
      "Progress from Bronze to Platinum as you accumulate hours. Each tier unlocks exclusive badges and rewards.",
    color: "amber",
  },
  {
    icon: Users,
    title: "Community Events",
    description:
      "Discover and join verified volunteer events near you. Check in with a unique hash to log your hours instantly.",
    color: "green",
  },
  {
    icon: Clock,
    title: "Hours Ledger",
    description:
      "A transparent, auditable record of every hour you've contributed. Share it with employers, schools, or anyone.",
    color: "indigo",
  },
  {
    icon: Sparkles,
    title: "Gamified Experience",
    description:
      "Earn badges, climb leaderboards, and redeem rewards. Volunteering has never felt this rewarding.",
    color: "purple",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-900/20 text-violet-400 border-violet-800/30",
  blue: "bg-blue-900/20 text-blue-400 border-blue-800/30",
  amber: "bg-amber-900/20 text-amber-400 border-amber-800/30",
  green: "bg-green-900/20 text-green-400 border-green-800/30",
  indigo: "bg-indigo-900/20 text-indigo-400 border-indigo-800/30",
  purple: "bg-purple-900/20 text-purple-400 border-purple-800/30",
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-6">
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Built for real impact
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            A complete platform for volunteers who want their contributions to matter — and to be recognized.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bento-card p-6 group cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[feature.color]}`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
