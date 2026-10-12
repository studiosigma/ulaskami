"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0D1117] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
          {/* Top Google 4-Color Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

          {/* Google 4-Color Ambient Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-[#4285F4]/18 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-96 h-96 rounded-full bg-[#EA4335]/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FBBC05]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#34A853]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 mb-6 backdrop-blur-sm shadow-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
              <span>Beli Sekali. Pasang. Terima Review.</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Buat bisnismu semakin direkomendasikan di{" "}
              <span className="text-[#4285F4]">Google Maps</span> mulai hari ini.
            </h2>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Tinggalkan cara lama yang canggung saat meminta ulasan. Berikan
              kemudahan satu sentuhan bagi pelanggan Anda dengan Ulaskami Plate.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#harga"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all duration-200 active:scale-98"
              >
                <span>Pesan Ulaskami Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base px-7 py-4 rounded-xl border border-slate-700 transition-all duration-200"
              >
                <span>Sudah Punya? Aktivasi Plate</span>
              </Link>
            </div>

            {/* Bullets with Google 4-Color Accents */}
            <div className="mt-8 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4285F4]" />
                Tanpa Biaya Bulanan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                Garansi Fisik Pengiriman
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FBBC05]" />
                Support Ramah via WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
