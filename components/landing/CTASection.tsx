"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl shadow-green-950/20">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-green-700/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-green-800/80 border border-green-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-green-200 mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              <span>Beli Sekali. Pasang. Terima Review.</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Buat bisnismu semakin direkomendasikan di Google Maps mulai hari ini.
            </h2>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-green-100/90 leading-relaxed max-w-2xl mx-auto">
              Tinggalkan cara lama yang canggung saat meminta ulasan. Berikan
              kemudahan satu sentuhan bagi pelanggan Anda dengan Ulaskami Plate.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#harga"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-green-900 font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98"
              >
                <span>Pesan Ulaskami Sekarang</span>
                <ArrowRight className="w-4 h-4 text-green-800" />
              </Link>
              <Link
                href="/activate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-800/60 hover:bg-green-800 text-white font-semibold text-base px-7 py-4 rounded-xl border border-green-700/80 transition-all duration-200"
              >
                <span>Sudah Punya? Aktivasi Plate</span>
              </Link>
            </div>

            {/* Bullets */}
            <div className="mt-8 pt-8 border-t border-green-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-green-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Tanpa Biaya Bulanan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Garansi Fisik Pengiriman
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Support Ramah via WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
