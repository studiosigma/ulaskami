import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Harga Ulaskami Review Plate — Tanpa Biaya Bulanan",
  description: "Daftar harga Ulaskami NFC & QR Review Plate untuk bisnis Anda. Pembelian satu kali, tanpa biaya langganan, masa pakai selamanya.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
