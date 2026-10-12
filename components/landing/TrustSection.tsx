"use client";

import React from "react";
import { CreditCard, UserCheck, Smartphone, RefreshCw, Sparkles } from "lucide-react";

export function TrustSection() {
  const benefits = [
    {
      number: "01",
      title: "Sekali Beli",
      description:
        "Tanpa biaya bulanan. Beli plate satu kali, gunakan selamanya tanpa tagihan tersembunyi atau langganan.",
      icon: CreditCard,
      highlight: "Tanpa biaya bulanan",
    },
    {
      number: "02",
      title: "Aktivasi Sendiri",
      description:
        "Tidak perlu menunggu kami mengatur plate Anda. Buka kemasan, masukkan kode plate, dan selesai dalam 2 menit.",
      icon: UserCheck,
      highlight: "Siap pakai seketika",
    },
    {
      number: "03",
      title: "NFC + QR",
      description:
        "Pelanggan bisa Tap smartphone atau Scan QR code. Kompatibel dengan semua tipe ponsel pintar iOS & Android.",
      icon: Smartphone,
      highlight: "Dua cara mudah",
    },
    {
      number: "04",
      title: "Link Bisa Diubah",
      description:
        "Tidak perlu mengganti plate fisik jika link Google Review berubah. Cukup update melalui dashboard akun Anda.",
      icon: RefreshCw,
      highlight: "Investasi jangka panjang",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gray-50/60 border-y border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200/80 text-xs font-semibold text-green-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
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

        {/* 4 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.number}
                className="group relative bg-white rounded-2xl p-7 border border-gray-200/90 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black tracking-tight text-gray-300 group-hover:text-green-600 transition-colors">
                      {benefit.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all duration-200">
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
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                  {benefit.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro-callout / Comparison note */}
        <div className="mt-12 bg-white rounded-xl p-5 border border-gray-200/80 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">Bukan Kertas Laminating:</span>{" "}
            Plate akrilik mewah tahan gores & air, memberikan kesan profesional di meja kasir Anda.
          </div>
          <div className="shrink-0 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
            Kesan Eksklusif & Rapi
          </div>
        </div>
      </div>
    </section>
  );
}
