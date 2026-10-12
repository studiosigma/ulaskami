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
      note: "Pilih paket sesuai jumlah meja / kasir",
      color: {
        text: "text-[#4285F4]",
        iconBg: "bg-blue-50 text-[#1A73E8] border-blue-100",
        borderHover: "hover:border-[#4285F4]/60",
        accentBar: "bg-[#4285F4]",
      },
    },
    {
      step: "02",
      title: "Aktivasi",
      description: "Masukkan kode plate dan buat akun Ulaskami.",
      icon: KeyRound,
      note: "Kode unik tertera di bawah plate (ULK-XXXXXX)",
      color: {
        text: "text-[#EA4335]",
        iconBg: "bg-red-50 text-[#EA4335] border-red-100",
        borderHover: "hover:border-[#EA4335]/60",
        accentBar: "bg-[#EA4335]",
      },
    },
    {
      step: "03",
      title: "Hubungkan Google Review",
      description: "Masukkan link Google Review bisnis Anda.",
      icon: Link2,
      note: "URL langsung diarahkan ke form review Google",
      color: {
        text: "text-[#F4B400]",
        iconBg: "bg-amber-50 text-[#D97706] border-amber-100",
        borderHover: "hover:border-[#FBBC05]/70",
        accentBar: "bg-[#FBBC05]",
      },
    },
    {
      step: "04",
      title: "Pasang",
      description: "Letakkan Ulaskami di meja kasir, meja pelanggan, atau area strategis.",
      icon: MapPin,
      note: "Bahan akrilik kokoh & elegan langsung pasang",
      color: {
        text: "text-[#34A853]",
        iconBg: "bg-emerald-50 text-[#34A853] border-emerald-100",
        borderHover: "hover:border-[#34A853]/60",
        accentBar: "bg-[#34A853]",
      },
    },
    {
      step: "05",
      title: "Tap atau Scan",
      description: "Pelanggan cukup Tap NFC atau Scan QR untuk membuka Google Review.",
      icon: Smartphone,
      note: "Review masuk langsung ke profil Google Bisnis Anda",
      color: {
        text: "text-[#1A73E8]",
        iconBg: "bg-blue-50 text-[#1A73E8] border-blue-100",
        borderHover: "hover:border-blue-400",
        accentBar: "bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]",
      },
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs mb-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
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
                className={`group relative bg-white rounded-2xl p-6 border border-gray-200 ${item.color.borderHover} hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle top indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${item.color.accentBar} opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-black ${item.color.text} font-mono`}>
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color.iconBg}`}>
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
        <div className="mt-14 max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xs">
          {/* Top Google 4-Color gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
              <span>Alur Teknologi Redirect Dinamis</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Auto-route dalam &lt; 0.5 detik</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-gray-400 font-mono block">1. Pelanggan</span>
              <span className="font-bold text-sm text-gray-900">Tap NFC / Scan QR</span>
              <span className="text-xs text-[#1A73E8] font-semibold block mt-1">Plate Fisik</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="text-xs font-mono font-medium hidden sm:inline text-slate-500">diarahkan ke</span>
              <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0 text-[#1A73E8]" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-gray-400 font-mono block">2. Cloud Ulaskami</span>
              <span className="font-bold text-sm text-gray-900">ulaskami.com/r/ULK-...</span>
              <span className="text-xs text-[#34A853] font-semibold block mt-1">Cari Google Review URL</span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20">
              <span>➔ 3. Langsung terbuka form review resmi Google Maps bisnis Anda (Instan)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
