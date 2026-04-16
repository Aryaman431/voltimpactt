import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <SignIn
          appearance={{
            variables: {
              colorBackground: "#0f0f0f",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.5)",
              colorInputBackground: "rgba(255,255,255,0.05)",
              colorInputText: "#ffffff",
              colorPrimary: "#7c3aed",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "shadow-2xl border border-white/10",
              headerTitle: "text-white",
              headerSubtitle: "text-white/50",
              socialButtonsBlockButton: "border-white/10 hover:bg-white/5",
              formFieldInput: "border-white/10 focus:border-violet-500/50",
              footerActionLink: "text-violet-400 hover:text-violet-300",
            },
          }}
        />
      </div>
    </div>
  );
}
