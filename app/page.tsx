import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustSection } from "@/components/landing/TrustSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductSection } from "@/components/landing/ProductSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">
        <Hero />
        <TrustSection />
        <HowItWorks />
        <ProductSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
