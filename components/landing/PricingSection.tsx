"use client";

import React from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, Palette } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function PricingSection() {
  // Mudah diedit untuk penyesuaian harga komersial
  const pricingPlans = [
    {
      id: "single",
      name: "Ulaskami Single Plate",
      badge: "Diskon 50%",
      isPopular: false,
      price: "Rp 75.000",
      originalPrice: "Rp 149.000",
      description: "Ideal untuk 1 meja kasir, reception desk, atau area kasir utama bisnis Anda.",
      features: [
        "1x Ulaskami NFC + QR Acrylic Plate",
        "Tema Utama: Google 4-Color (Signature Ready Stock)",
        "Matte Black & Frost Gold (Pre-Order / Coming Soon)",
        "Dudukan akrilik elegan (Stand included)",
        "NFC Chip respons instan",
        "Custom laser QR code resolusi tinggi",
        "Aktivasi mandiri instan (< 2 menit)",
        "Lifetime usage (Milik Anda selamanya)",
        "Link Google Review bisa diubah kapan saja",
        "Tanpa biaya bulanan / Tanpa langganan",
      ],
      ctaText: "Beli Sekarang",
      ctaLink: SITE_CONFIG.getWhatsAppLink(
        "Halo Ulaskami, saya ingin memesan 1 Ulaskami Review Plate (Promo Rp 75.000)"
      ),
    },
    {
      id: "bundle-3",
      name: "Paket 3 Plates (Cafe & Resto)",
      badge: "Paling Populer • Hemat 46%",
      isPopular: true,
      price: "Rp 210.000",
      originalPrice: "Rp 389.000",
      description: "Pilihan terbaik untuk kafe, resto, atau klinik dengan beberapa meja & kasir.",
      features: [
        "3x Ulaskami NFC + QR Acrylic Plate",
        "Desain Google 4-Color Signature (Ready Stock)",
        "Bebas PO Matte Black & Frost Gold (Coming Soon)",
        "3x Dudukan akrilik solid",
        "NFC Chip respons instan di tiap plate",
        "QR code unik per plate / batch",
        "Aktivasi masing-masing atau satu link sama",
        "Lifetime usage tanpa batas waktu",
        "Link Google Review bisa diubah kapan saja",
        "Tanpa biaya bulanan / Tanpa langganan",
      ],
      ctaText: "Beli Paket 3 Plate",
      ctaLink: SITE_CONFIG.getWhatsAppLink(
        "Halo Ulaskami, saya ingin memesan Paket 3 Ulaskami Plate (Promo Rp 210.000)"
      ),
    },
    {
      id: "multi-branch",
      name: "Paket Multi Cabang",
      badge: "Custom Batch",
      isPopular: false,
      price: "Hubungi Kami",
      originalPrice: undefined,
      description: "Untuk bisnis waralaba, hotel, atau jaringan ritel dengan 10+ cabang.",
      features: [
        "Jumlah plate fleksibel (10+ pcs)",
        "Batch code terintegrasi",
        "Dashboard pengelolaan multi-plate",
        "Prioritas pengiriman",
        "Panduan penempatan strategis untuk staff",
        "Lifetime usage",
        "Tanpa biaya bulanan / Tanpa langganan",
      ],
      ctaText: "Konsultasi Kebutuhan",
      ctaLink: SITE_CONFIG.getWhatsAppLink(
        "Halo Ulaskami, saya ingin konsultasi pesanan banyak untuk cabang"
      ),
    },
  ];

  return (
    <section id="harga" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span>Transparan & Sekali Bayar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Investasi Sekali. Panen Review Selamanya.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Tanpa biaya bulanan. Tanpa potongan per review. Beli plate fisik, dan sistem digitalnya gratis digunakan selamanya.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.isPopular
                  ? "bg-white border-2 border-green-600 shadow-xl shadow-green-950/10 ring-4 ring-green-600/10"
                  : "bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Top Badge for Popular Plan */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      plan.isPopular
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Plan Title & Price */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div className="mb-6 pb-6 border-b border-gray-100">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-400 line-through">
                        {plan.originalPrice}
                      </span>
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        Hemat Spesial
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded mt-2 inline-block">
                    One-time purchase (Beli Sekali)
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <a
                  href={plan.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.isPopular
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 active:scale-98"
                      : "bg-gray-900 hover:bg-black text-white active:scale-98"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-gray-400">
                    Garansi fisik 100% jika chip rusak saat pengiriman
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Themes Banner */}
        <div className="mt-12 max-w-2xl mx-auto text-center bg-gray-50 border border-gray-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Pilihan Tema Desain:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-700">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs font-semibold flex items-center gap-1.5 text-gray-900">
              <span>🎨 Google 4-Color</span>
              <span className="text-[10px] text-green-700 bg-green-50 font-bold px-1.5 py-0.2 rounded">
                Ready Stock
              </span>
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs font-semibold flex items-center gap-1.5 text-gray-600">
              <span>🖤 Dark Luxury Matte</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-1.5 py-0.2 rounded">
                Coming Soon
              </span>
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs font-semibold flex items-center gap-1.5 text-gray-600">
              <span>⭐ Frost White &amp; Gold</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-1.5 py-0.2 rounded">
                Coming Soon
              </span>
            </span>
          </div>
        </div>

        {/* Bottom guarantee strip */}
        <div className="mt-6 text-center text-xs text-gray-500 max-w-xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <span>Pengiriman ke seluruh Indonesia via JNE, J&T, SiCepat &amp; Anteraja.</span>
        </div>
      </div>
    </section>
  );
}
