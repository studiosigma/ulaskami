"use client";

import React from "react";
import { ShoppingBag, KeyRound, Link2, MapPin, Smartphone, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Beli Plate",
      description: "Pesan Ulaskami Plate sesuai kebutuhan bisnis Anda.",
      icon: ShoppingBag,
      note: "Pilih paket sesuai jumlah meja / cabang",
    },
    {
      step: "02",
      title: "Aktivasi",
      description: "Masukkan kode plate dan buat akun Ulaskami.",
      icon: KeyRound,
      note: "Kode unik tertera di bawah plate (ULK-XXXXXX)",
    },
    {
      step: "03",
      title: "Hubungkan Google Review",
      description: "Masukkan link Google Review bisnis Anda.",
      icon: Link2,
      note: "URL langsung diarahkan ke form review Google",
    },
    {
      step: "04",
      title: "Pasang",
      description: "Letakkan Ulaskami di meja kasir, meja pelanggan, atau area strategis.",
      icon: MapPin,
      note: "Bahan akrilik kokoh & elegan langsung pasang",
    },
    {
      step: "05",
      title: "Tap atau Scan",
      description: "Pelanggan cukup Tap NFC atau Scan QR untuk membuka Google Review.",
      icon: Smartphone,
      note: "Review masuk langsung ke profil Google Bisnis Anda",
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200/80 text-xs font-semibold text-green-800 mb-4">
            <span>5 Langkah Praktis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Cara Kerja Ulaskami
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Dari kemasan sampai menerima review pertama, prosesnya hanya butuh waktu kurang dari 5 menit.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-green-700 font-mono">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Subtext info */}
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 italic">
                  {item.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Dynamic Redirect Flow Demonstration */}
        <div className="mt-14 max-w-4xl mx-auto bg-green-50/70 border border-green-200/80 rounded-2xl p-6 sm:p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-green-800 mb-3 text-center sm:text-left">
            Alur Teknologi Redirect Dinamis
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
            <div className="bg-white p-4 rounded-xl border border-green-200 shadow-xs">
              <span className="text-xs text-gray-400 font-mono block">1. Pelanggan</span>
              <span className="font-bold text-sm text-gray-900">Tap NFC / Scan QR</span>
              <span className="text-xs text-green-700 block mt-1">Plate Fisik</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="text-xs font-mono font-medium hidden sm:inline">diarahkan ke</span>
              <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-green-200 shadow-xs">
              <span className="text-xs text-gray-400 font-mono block">2. Cloud Ulaskami</span>
              <span className="font-bold text-sm text-gray-900">ulaskami.com/r/ULK-...</span>
              <span className="text-xs text-green-700 block mt-1">Cari Google Review URL</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm">
              <span>➔ 3. Langsung terbuka form review Google bisnis Anda (Instan &lt; 0.5s)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
