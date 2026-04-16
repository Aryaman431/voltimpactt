import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-white/80 text-sm">VoltImpact</span>
          </Link>

          <nav className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-white/20">
            © 2026 VoltImpact. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
