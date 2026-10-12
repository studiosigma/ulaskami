"use client";

import React from "react";
import { CreditCard, UserCheck, Smartphone, RefreshCw } from "lucide-react";

export function TrustSection() {
  const benefits = [
    {
      number: "01",
      title: "Sekali Beli",
      description:
        "Tanpa biaya bulanan. Beli plate satu kali, gunakan selamanya tanpa tagihan tersembunyi atau langganan.",
      icon: CreditCard,
      highlight: "Tanpa biaya bulanan",
      color: {
        text: "text-[#4285F4]",
        borderHover: "hover:border-[#4285F4]/60",
        iconBg: "bg-blue-50 text-[#1A73E8] border-blue-100 group-hover:bg-[#4285F4] group-hover:text-white",
        dotBg: "bg-[#4285F4]",
        accentBar: "bg-[#4285F4]",
        tagText: "text-[#1A73E8]",
      },
    },
    {
      number: "02",
      title: "Aktivasi Sendiri",
      description:
        "Tidak perlu menunggu kami mengatur plate Anda. Buka kemasan, masukkan kode plate, dan selesai dalam 2 menit.",
      icon: UserCheck,
      highlight: "Siap pakai seketika",
      color: {
        text: "text-[#EA4335]",
        borderHover: "hover:border-[#EA4335]/60",
        iconBg: "bg-red-50 text-[#EA4335] border-red-100 group-hover:bg-[#EA4335] group-hover:text-white",
        dotBg: "bg-[#EA4335]",
        accentBar: "bg-[#EA4335]",
        tagText: "text-[#EA4335]",
      },
    },
    {
      number: "03",
      title: "NFC + QR",
      description:
        "Pelanggan bisa Tap smartphone atau Scan QR code. Kompatibel dengan semua tipe ponsel pintar iOS & Android.",
      icon: Smartphone,
      highlight: "Dua cara mudah",
      color: {
        text: "text-[#F4B400]",
        borderHover: "hover:border-[#FBBC05]/70",
        iconBg: "bg-amber-50 text-[#D97706] border-amber-100 group-hover:bg-[#FBBC05] group-hover:text-slate-900",
        dotBg: "bg-[#FBBC05]",
        accentBar: "bg-[#FBBC05]",
        tagText: "text-[#B45309]",
      },
    },
    {
      number: "04",
      title: "Link Bisa Diubah",
      description:
        "Tidak perlu mengganti plate fisik jika link Google Review berubah. Cukup update melalui dashboard akun Anda.",
      icon: RefreshCw,
      highlight: "Investasi jangka panjang",
      color: {
        text: "text-[#34A853]",
        borderHover: "hover:border-[#34A853]/60",
        iconBg: "bg-emerald-50 text-[#34A853] border-emerald-100 group-hover:bg-[#34A853] group-hover:text-white",
        dotBg: "bg-[#34A853]",
        accentBar: "bg-[#34A853]",
        tagText: "text-[#2E7D32]",
      },
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-y border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs mb-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
            <span>Kelebihan Ulaskami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Sederhana untuk Anda. <br className="hidden sm:inline" />
            Mudah untuk pelanggan.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Fokus kami adalah satu: membantu bisnis Anda mengumpulkan ulasan asli
            sebanyak mungkin dengan cara yang paling praktis.
          </p>
        </div>

        {/* 4 Benefit Cards Grid with Google 4-Color Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.number}
                className={`group relative bg-white rounded-2xl p-7 border border-gray-200/90 shadow-xs hover:shadow-md ${benefit.color.borderHover} transition-all duration-200 flex flex-col justify-between overflow-hidden`}
              >
                {/* Top color bar indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${benefit.color.accentBar} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* Card Top: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-3xl font-black tracking-tight ${benefit.color.text} font-mono`}
                    >
                      {benefit.number}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 ${benefit.color.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom Highlight Tag */}
                <div
                  className={`mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold ${benefit.color.tagText}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${benefit.color.dotBg}`}
                  />
                  {benefit.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro-callout / Comparison note with subtle Google accent */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />
          <div className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">Bukan Kertas Laminating:</span>{" "}
            Plate akrilik mewah tahan gores & air, memberikan kesan profesional di meja kasir Anda.
          </div>
          <div className="shrink-0 text-xs font-bold text-[#1A73E8] bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-200">
            Kesan Eksklusif &amp; Rapi
          </div>
        </div>
      </div>
    </section>
  );
}
