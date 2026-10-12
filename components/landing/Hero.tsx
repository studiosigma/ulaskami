"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white">
      {/* Google 4-Color Subtle Radial Ambient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-b from-blue-50/40 via-amber-50/20 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-[#FBBC05]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-36 left-1/3 w-80 h-80 bg-[#EA4335]/8 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-1/3 w-80 h-80 bg-[#34A853]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Google 4-Color Pill Badge with Custom Pin Logo */}
            <div className="inline-flex items-center gap-2 self-start bg-white/95 border border-slate-200/90 pl-2.5 pr-4 py-1.5 rounded-full mb-6 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs">
              <Image
                src="/logo-icon.png"
                alt="Ulaskami Logo Pin"
                width={18}
                height={21}
                className="w-4.5 h-auto object-contain shrink-0"
                priority
              />
              <span>NFC + QR Google Review Plate untuk Bisnis Anda</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.12]">
              Buat Bisnismu Semakin Direkomendasikan di{" "}
              <span className="text-[#1A73E8]">Google Maps</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl">
              NFC + QR Review Plate untuk bisnis Anda. Cukup tap atau scan,
              pelanggan langsung menuju halaman Google Review bisnis Anda dalam 1 detik.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/#harga"
                className="inline-flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all duration-200 active:scale-98"
              >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activate"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base px-6 py-3.5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
              >
                <span>Sudah punya Plate? Aktivasi</span>
              </Link>
            </div>

            {/* Micro Trust Bullets Styled with Google Colors */}
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#34A853] shrink-0" />
                <span>Beli Sekali Tanpa Bulanan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Zap className="w-4.5 h-4.5 text-[#1A73E8] shrink-0" />
                <span>Aktivasi Mandiri &lt; 2 Menit</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Shield className="w-4.5 h-4.5 text-[#FBBC05] shrink-0" />
                <span>100% Aman &amp; Sesuai Aturan</span>
              </div>
            </div>

            {/* Target Business tags */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span className="font-medium text-gray-400">Cocok untuk:</span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">Restoran &amp; Kafe</span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">Salon &amp; Barbershop</span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">Klinik Gigi &amp; Estetika</span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">Toko Retail</span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">Hotel &amp; Homestay</span>
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
