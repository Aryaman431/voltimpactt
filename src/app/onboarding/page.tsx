"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Building2, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { useVoltUser, type UserRole } from "@/hooks/useUser";

const ROLES = [
  {
    id: "volunteer" as UserRole,
    icon: Users,
    title: "Volunteer",
    subtitle: "Join events and make an impact",
    description: "Track your hours, earn badges, climb the leaderboard, and redeem rewards for your contributions.",
    features: ["Join verified events", "Earn badges & rewards", "Track your impact", "Community leaderboard"],
    accent: "#00d4aa",
    accentDim: "rgba(0,212,170,0.1)",
    accentBorder: "rgba(0,212,170,0.25)",
    gradient: "linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(0,153,255,0.08) 100%)",
  },
  {
    id: "organizer" as UserRole,
    icon: Building2,
    title: "Organizer",
    subtitle: "Host events and manage volunteers",
    description: "Create and manage volunteer events, verify check-ins, and build a community around your cause.",
    features: ["Create & manage events", "Verify check-ins", "View participants", "Impact analytics"],
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.1)",
    accentBorder: "rgba(167,139,250,0.25)",
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(99,102,241,0.08) 100%)",
  },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, setRole } = useVoltUser();
  const [selected, setSelected]   = useState<UserRole | null>(null);
  const [saving, setSaving]       = useState(false);

  // Already onboarded — redirect
  if (!loading && user?.onboarding_complete) {
    router.replace(user.role === "organizer" ? "/org/dashboard" : "/dashboard");
    return null;
  }

  const handleContinue = async () => {
    if (!selected || saving) return;
    setSaving(true);
    await setRole(selected);
    router.push(selected === "organizer" ? "/org/dashboard" : "/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{ background: "#0f1115" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0,212,170,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 mb-12"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #00d4aa, #0099ff)" }}
        >
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">VoltImpact</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center mb-10 max-w-md"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          How will you use VoltImpact?
        </h1>
        <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
          Choose your role to get started. You can always change this later.
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {ROLES.map((role, i) => {
          const isSelected = selected === role.id;
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300, damping: 28 }}
              onClick={() => setSelected(role.id)}
              className="relative text-left rounded-2xl p-6 transition-all duration-200 focus:outline-none"
              style={{
                background: isSelected ? role.gradient : "rgba(18,20,26,0.8)",
                border: `1px solid ${isSelected ? role.accentBorder : "rgba(255,255,255,0.08)"}`,
                boxShadow: isSelected
                  ? `0 0 0 1px ${role.accentBorder}, 0 16px 40px rgba(0,0,0,0.4), 0 0 32px ${role.accentDim}`
                  : "none",
              }}
              whileHover={{
                y: -4,
                borderColor: role.accentBorder,
                boxShadow: `0 0 0 1px ${role.accentBorder}, 0 16px 40px rgba(0,0,0,0.4)`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: role.accent }}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0f1115]" strokeWidth={2.5} />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: isSelected ? `${role.accent}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isSelected ? role.accentBorder : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <role.icon
                  className="w-6 h-6"
                  style={{ color: isSelected ? role.accent : "rgba(255,255,255,0.5)" }}
                />
              </div>

              {/* Text */}
              <h2
                className="text-lg font-bold mb-1"
                style={{ color: isSelected ? "#ffffff" : "rgba(255,255,255,0.85)" }}
              >
                {role.title}
              </h2>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: isSelected ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)" }}
              >
                {role.description}
              </p>

              {/* Feature list */}
              <ul className="space-y-2">
                {role.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: isSelected ? role.accent : "rgba(255,255,255,0.2)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl"
      >
        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{
            background: selected ? "#00d4aa" : "rgba(255,255,255,0.06)",
            color: selected ? "#0f1115" : "rgba(255,255,255,0.3)",
            boxShadow: selected ? "0 8px 24px rgba(0,212,170,0.2)" : "none",
          }}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Setting up your account…
            </>
          ) : (
            <>
              Continue as {selected ? (selected === "volunteer" ? "Volunteer" : "Organizer") : "…"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs mt-4"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        You can change your role anytime in settings
      </motion.p>
    </div>
  );
}
