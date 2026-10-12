"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function ProductSection() {
  const features = [
    {
      title: "NFC Chip Respons Cepat",
      description: "NTAG213 berkecepatan tinggi, cukup dekatkan smartphone pelanggan.",
      color: "bg-blue-50 text-[#4285F4] border border-blue-100",
      borderHover: "hover:border-[#4285F4]/50",
    },
    {
      title: "Laser-Sharp QR Code",
      description: "Resolusi tinggi tahan gores, mudah discan kamera HP dalam kondisi cahaya apa pun.",
      color: "bg-red-50 text-[#EA4335] border border-red-100",
      borderHover: "hover:border-[#EA4335]/50",
    },
    {
      title: "Acrylic Plate Premium",
      description: "Material akrilik tebal 3mm kokoh, tahan cipratan air, dan memberi kesan mewah.",
      color: "bg-amber-50 text-[#D97706] border border-amber-100",
      borderHover: "hover:border-[#FBBC05]/60",
    },
    {
      title: "Aktivasi Mandiri Instan",
      description: "Aktivasi mudah melalui browser HP Anda tanpa butuh install aplikasi khusus.",
      color: "bg-emerald-50 text-[#34A853] border border-emerald-100",
      borderHover: "hover:border-[#34A853]/50",
    },
    {
      title: "Link Dinamis",
      description: "Bebas ganti URL Google Review bisnis Anda kapan saja tanpa ganti plate fisik.",
      color: "bg-blue-50 text-[#4285F4] border border-blue-100",
      borderHover: "hover:border-[#4285F4]/50",
    },
    {
      title: "Tanpa Biaya Bulanan",
      description: "Murni bayar satu kali di awal. Tidak ada biaya langganan selamanya.",
      color: "bg-emerald-50 text-[#34A853] border border-emerald-100",
      borderHover: "hover:border-[#34A853]/50",
    },
  ];

  return (
    <section id="produk" className="py-20 sm:py-28 bg-slate-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Mockup Showcase */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <ProductMockup />
          </div>

          {/* Right Column: Product Detail & Features */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 shadow-2xs mb-4">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
              </div>
              <span>Spesifikasi Fisik &amp; Fitur</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Ulaskami Review Plate
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-normal leading-relaxed">
              Satu plate. Dua cara untuk membuka formulir ulasan Google Review.
            </p>

            {/* Features Checklist Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-4 rounded-xl border border-gray-200/90 shadow-2xs flex items-start gap-3 ${feature.borderHover} transition-colors`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feature.color}`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Material & Size badge */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Dimensi:</span>
                <span>Stand A6 (10.5 x 14.8 cm)</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Tebal:</span>
                <span>3mm Cast Acrylic Premium</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Dudukan:</span>
                <span>Solid Stand Included</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/#harga"
                className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-98"
              >
                <span>Pesan Ulaskami</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activate"
                className="text-sm font-semibold text-gray-600 hover:text-[#1A73E8] px-4 py-3 transition-colors"
              >
                Aktivasi Plate Anda →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
