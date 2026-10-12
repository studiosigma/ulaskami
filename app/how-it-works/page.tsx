import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Cara Kerja Ulaskami — Mudah untuk Anda & Pelanggan",
  description: "Pelajari 5 langkah mudah mengumpulkan Google Review dengan Ulaskami Plate. Dari unboxing, aktivasi mandiri, hingga pelanggan tap atau scan.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <HowItWorks />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
