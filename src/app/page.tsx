import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PreviewSection from "@/components/landing/PreviewSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative" style={{ background: "var(--bg-base)" }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <PreviewSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}
