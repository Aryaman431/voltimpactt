import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VoltImpact — Turn Your Time Into Impact",
  description:
    "Track, verify, and showcase your real-world volunteer contributions. Powered by the Proof of Impact Ledger.",
  keywords: ["volunteering", "impact", "community", "social good", "gamification"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "VoltImpact",
    description: "Turn Your Time Into Impact",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${mono.variable} dark`}
        suppressHydrationWarning
      >
        <body className="font-sans antialiased min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
