"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white">
      {/* Subtle radial background tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-green-50/70 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start bg-green-50 border border-green-200/80 px-3.5 py-1.5 rounded-full mb-6 text-xs sm:text-sm font-semibold text-green-800 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-green-600" />
              <span>NFC + QR Review Plate untuk Bisnis Anda</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12]">
              Buat Bisnismu Semakin Direkomendasikan di Google Maps
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl">
              NFC + QR Review Plate untuk bisnis Anda. Cukup tap atau scan,
              pelanggan langsung menuju halaman Google Review bisnis Anda.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/#harga"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-200 active:scale-98"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activate"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base px-6 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <span>Sudah punya Plate? Aktivasi</span>
              </Link>
            </div>

            {/* Micro Trust Bullets */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Beli Sekali Tanpa Bulanan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-green-600 shrink-0" />
                <span>Aktivasi Mandiri &lt; 2 Menit</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% Aman & Sesuai Aturan</span>
              </div>
            </div>

            {/* Target Business tags */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span className="font-medium text-gray-400">Cocok untuk:</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">Restoran & Kafe</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">Salon & Barbershop</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">Klinik</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">Toko Retail</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">Hotel & Homestay</span>
            </div>
          </div>

          {/* Right Column: Physical Product Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
