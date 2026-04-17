import { SignIn } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative px-4"
      style={{ background: "#0f1115" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 70%)",
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
        <span
          className="font-bold text-lg tracking-tight"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          VoltImpact
        </span>
      </Link>

      {/* Clerk card */}
      <div className="relative z-10 w-full max-w-sm">
        <SignIn
          appearance={{
            variables: {
              colorBackground: "#12141a",
              colorText: "#f5f5f5",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "#1c1f28",
              colorInputText: "#f5f5f5",
              colorPrimary: "#00d4aa",
              colorDanger: "#f87171",
              borderRadius: "12px",
              fontFamily: "inherit",
              fontSize: "14px",
            },
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border-0 bg-transparent p-0",
              headerTitle:
                "text-white font-bold text-xl",
              headerSubtitle:
                "text-white/50 text-sm",
              socialButtonsBlockButton:
                "bg-white/5 border border-white/10 text-white hover:bg-white/8 transition-colors rounded-xl h-11",
              socialButtonsBlockButtonText:
                "text-white font-medium text-sm",
              dividerLine: "bg-white/10",
              dividerText: "text-white/30 text-xs",
              formFieldLabel:
                "text-white/70 text-xs font-medium mb-1",
              formFieldInput:
                "bg-white/5 border border-white/10 text-white rounded-xl h-11 px-3 text-sm focus:border-[#00d4aa]/50 focus:ring-0 placeholder:text-white/20",
              formButtonPrimary:
                "bg-[#00d4aa] hover:bg-[#00bfa0] text-[#0f1115] font-semibold rounded-xl h-11 text-sm transition-all active:scale-[0.98] shadow-lg shadow-[#00d4aa]/20",
              footerActionLink:
                "text-[#00d4aa] hover:text-[#00bfa0] font-medium",
              footerActionText: "text-white/40 text-sm",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-[#00d4aa]",
              formFieldSuccessText: "text-[#00d4aa]",
              alertText: "text-white/80",
              otpCodeFieldInput:
                "bg-white/5 border border-white/10 text-white rounded-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
