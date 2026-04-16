"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, QrCode, BarChart3, Award } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find an event",
    description: "Browse verified volunteer opportunities from trusted organizations in your area.",
  },
  {
    number: "02",
    icon: QrCode,
    title: "Check in with PoI",
    description: "Use the unique event hash to verify your attendance. Your hours are logged instantly.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Track your impact",
    description: "Watch your hours accumulate on the ledger. Every contribution is transparent and verifiable.",
  },
  {
    number: "04",
    icon: Award,
    title: "Earn recognition",
    description: "Unlock badges, climb tiers, and redeem rewards as your impact grows.",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-32 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-6">
            Simple by design
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            From discovery to recognition in four steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number + icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-900/20 border border-violet-800/30 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-violet-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white/40">{step.number}</span>
                </div>
              </div>

              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
