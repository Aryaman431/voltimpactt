import { SignIn } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative px-4 py-8"
      style={{ background: "#0f1115" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,170,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 flex items-center gap-2.5 mb-8 group"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ background: "linear-gradient(135deg, #00d4aa, #0099ff)" }}
        >
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          VoltImpact
        </span>
      </Link>

      {/* Clerk card */}
      <div className="relative z-10 w-full max-w-sm">
        <SignIn
          appearance={{
            variables: {
              colorBackground:      "#12141a",
              colorText:            "#f0f0f0",
              colorTextSecondary:   "#a0a0a0",
              colorTextOnPrimaryBackground: "#0f1115",
              colorInputBackground: "#1c1f28",
              colorInputText:       "#f0f0f0",
              colorPrimary:         "#00d4aa",
              colorDanger:          "#f87171",
              colorNeutral:         "#f0f0f0",
              borderRadius:         "12px",
              fontFamily:           "inherit",
              fontSize:             "14px",
            },
            elements: {
              rootBox:    "w-full",
              card:       "w-full !bg-[#12141a] !border !border-white/10 !shadow-2xl !rounded-2xl",

              // Header
              headerTitle:    "!text-white !font-bold",
              headerSubtitle: "!text-[#a0a0a0]",

              // Social buttons
              socialButtonsBlockButton:
                "!bg-white/5 !border !border-white/10 !text-white hover:!bg-white/10 !rounded-xl !h-11 !transition-colors",
              socialButtonsBlockButtonText: "!text-white !font-medium",
              socialButtonsBlockButtonArrow: "!text-white/50",

              // Divider
              dividerLine: "!bg-white/10",
              dividerText: "!text-[#606060] !text-xs",

              // Form fields
              formFieldLabel:   "!text-[#c0c0c0] !text-xs !font-medium",
              formFieldInput:
                "!bg-[#1c1f28] !border !border-white/10 !text-white !rounded-xl !h-11 !px-3 !text-sm focus:!border-[#00d4aa]/60 !placeholder-white/20",
              formFieldInputShowPasswordButton: "!text-[#a0a0a0]",

              // Primary button
              formButtonPrimary:
                "!bg-[#00d4aa] hover:!bg-[#00bfa0] !text-[#0f1115] !font-semibold !rounded-xl !h-11 !text-sm !transition-all active:!scale-[0.98] !shadow-lg",

              // Footer
              footerActionText: "!text-[#808080] !text-sm",
              footerActionLink: "!text-[#00d4aa] hover:!text-[#00bfa0] !font-medium",
              footer:           "!bg-transparent",

              // Misc
              identityPreviewText:        "!text-white",
              identityPreviewEditButton:  "!text-[#00d4aa]",
              formFieldSuccessText:        "!text-[#00d4aa]",
              formFieldErrorText:          "!text-[#f87171]",
              alertText:                   "!text-white",
              badge:                       "!text-[#a0a0a0]",
              otpCodeFieldInput:
                "!bg-[#1c1f28] !border !border-white/10 !text-white !rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
