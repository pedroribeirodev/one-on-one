import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { PainPoints } from "@/components/PainPoints";
import { PricingTeaser } from "@/components/PricingTeaser";
import { SocialProof } from "@/components/SocialProof";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <HowItWorks />
      <PainPoints />
      <PricingTeaser />
      <Footer />
    </main>
  );
}
