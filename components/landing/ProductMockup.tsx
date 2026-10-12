"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles, Store, Layers } from "lucide-react";

interface ProductMockupProps {
  allowCustomization?: boolean;
  defaultBusinessName?: string;
}

export function ProductMockup({
  allowCustomization = true,
  defaultBusinessName = "Kopi Kenangan Senopati",
}: ProductMockupProps) {
  const [mountType, setMountType] = useState<"glass_counter" | "table_stand">("glass_counter");
  const [businessName, setBusinessName] = useState(defaultBusinessName);

  const sampleNames = [
    "Kopi Kenangan Senopati",
    "Putney Charcoal Cafe",
    "Bakso Pak Man",
    "Barbershop Barokah",
    "Klinik Medika",
  ];

  return (
    <div className="w-full max-w-[440px] mx-auto select-none flex flex-col items-center">
      {/* Mount Style Selector (Tempel Etalase Kaca vs Stand Meja) */}
      {allowCustomization && (
        <div className="w-full mb-4 flex flex-col items-center gap-2">
          <div className="inline-flex rounded-2xl bg-gray-100 p-1 border border-gray-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => setMountType("glass_counter")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mountType === "glass_counter"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Tempel Kaca / Etalase (Sesuai Foto)</span>
            </button>
            <button
              type="button"
              onClick={() => setMountType("table_stand")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mountType === "table_stand"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/60"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Stand Meja Kasir</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Plaque Container */}
      <div className="relative w-full flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-red-500/10 to-amber-500/20 rounded-[36px] blur-2xl -z-10" />

        {/* Floating Tag 1: NFC & QR */}
        <div className="absolute -top-3 -left-3 sm:-left-5 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-800">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
          </span>
          <span>Dual Tech: NFC + QR</span>
        </div>

        {/* Floating Tag 2: Beli Sekali */}
        <div className="absolute -bottom-2 -right-3 sm:-right-5 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-800">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Beli Sekali Tanpa Langganan</span>
        </div>

        {/* ========================================================================= */}
        {/* THE PHYSICAL PLAQUE (Recreated 1:1 From User Photo)                       */}
        {/* ========================================================================= */}
        <div className="relative w-[340px] h-[340px] sm:w-[360px] sm:h-[360px] rounded-[30px] p-2.5 overflow-hidden shadow-2xl shadow-slate-950/25 border border-white/60 select-none">
          {/* Acrylic Glass Bevel Reflection Effect */}
          <div className="absolute inset-0 rounded-[30px] border-2 border-white/40 pointer-events-none z-20" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-white/45 via-white/10 to-transparent rotate-45 pointer-events-none z-20" />

          {/* Latar Belakang 4 Warna Ikonik Google (Persis seperti Foto Produk Fisik) */}
          <div className="absolute inset-0 rounded-[30px] overflow-hidden -z-0">
            {/* Sudut Kiri Atas: Biru Google */}
            <div className="absolute top-0 left-0 w-[55%] h-[55%] bg-[#1A73E8]" />
            {/* Sudut Kanan Atas: Merah Google */}
            <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-[#EA4335]" />
            {/* Sudut Kiri Bawah: Hijau Google */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[55%] bg-[#34A853]" />
            {/* Sudut Kanan Bawah: Kuning-Oranye Google */}
            <div className="absolute bottom-0 right-0 w-[55%] h-[55%] bg-[#FBBC04]" />

            {/* Seamless blended wave center junction */}
            <div className="absolute inset-0 bg-radial from-transparent to-black/5" />
          </div>

          {/* Kartu Tengah Putih dengan Tab Kubah Atas Logo Google (White Die-Cut Card) */}
          <div className="relative z-10 w-full h-full rounded-[24px] bg-white shadow-xl shadow-black/10 flex flex-col justify-between p-4 sm:p-5 text-center overflow-hidden border border-white/90">
            {/* Tab Atas Logo Google G */}
            <div className="flex flex-col items-center -mt-1">
              {/* Google G Multi-Color Official Icon */}
              <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center p-2 mb-1 transform hover:scale-105 transition-transform">
                <svg className="w-9 h-9" viewBox="0 0 48 48">
                  <path
                    fill="#4285F4"
                    d="M44.5 20H24v8.5h11.8C34.7 34.2 29.8 37.5 24 37.5c-7.5 0-13.5-6-13.5-13.5s6-13.5 13.5-13.5c3.3 0 6.2 1.2 8.5 3.3l6.3-6.3C34.9 3.8 29.8 1.5 24 1.5 11.6 1.5 1.5 11.6 1.5 24S11.6 46.5 24 46.5c12.4 0 21-9 21-22.5 0-1.4-.2-2.7-.5-4z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.3 14.7l7 5.1C15.2 14.3 20.3 10.5 24 10.5c3.3 0 6.2 1.2 8.5 3.3l6.3-6.3C34.9 3.8 29.8 1.5 24 1.5 16.4 1.5 9.8 5.7 6.3 14.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 46.5c5.8 0 10.8-2.1 14.6-5.7l-6.8-5.6c-2 1.4-4.7 2.3-7.8 2.3-5.7 0-10.6-3.3-12.4-8.3l-7 5.4c3.5 7 10.9 11.9 19.4 11.9z"
                  />
                  <path
                    fill="#EA4335"
                    d="M4.6 13.4c-1 3.2-1.6 6.8-1.6 10.6s.6 7.4 1.6 10.6l7-5.4c-.5-1.6-1.1-3.4-1.1-5.2s.6-3.6 1.1-5.2l-7-5.4z"
                  />
                </svg>
              </div>

              {/* Headline persis seperti di foto: review us / on Google */}
              <div className="leading-tight">
                <span className="block text-xs sm:text-sm font-medium text-slate-600 tracking-normal">
                  review us
                </span>
                <span className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  on Google
                </span>
              </div>
            </div>

            {/* Bagian Interaksi Dua Kolom: TAP YOUR PHONE (Kiri) & SCAN QR (Kanan) */}
            <div className="relative my-2 py-2 grid grid-cols-2 items-center gap-1 border-t border-slate-100">
              {/* Garis Vertikal & Tulisan OR / ATAU */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-slate-200/90 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold text-slate-400">
                OR
              </div>

              {/* Kolom Kiri: TAP YOUR PHONE (Ilustrasi tangan memegang smartphone + NFC waves persis foto) */}
              <div className="flex flex-col items-center justify-center p-1">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold text-slate-800 tracking-wide uppercase mb-1">
                  TAP YOUR PHONE
                </span>

                <div className="flex items-center justify-center gap-1 py-1">
                  {/* NFC Waves */}
                  <div className="flex items-center text-slate-800">
                    <svg className="w-5 h-7 text-slate-800" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M 8 10 A 9 9 0 0 0 8 22" />
                      <path d="M 4 6 A 15 15 0 0 0 4 26" />
                      <path d="M 0 2 A 21 21 0 0 0 0 30" />
                    </svg>
                  </div>

                  {/* Phone being held with NFC badge on screen */}
                  <div className="relative w-8 h-13 rounded-md border-2 border-slate-800 bg-white flex flex-col items-center justify-center shadow-2xs">
                    <div className="w-1 h-1 rounded-full bg-slate-800 mb-1" />
                    <span className="text-[7.5px] font-black text-slate-800 border border-slate-800 px-0.5 rounded tracking-tighter">
                      NFC
                    </span>
                    <div className="w-2.5 h-0.5 rounded bg-slate-800 mt-1.5" />
                  </div>
                </div>

                <span className="text-[8.5px] text-slate-400 font-medium">
                  Dekatkan ponsel
                </span>
              </div>

              {/* Kolom Kanan: SCAN QR */}
              <div className="flex flex-col items-center justify-center p-1">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold text-slate-800 tracking-wide uppercase mb-1">
                  SCAN QR
                </span>

                {/* QR Code Vektor Tajam */}
                <div className="w-14 h-14 sm:w-15 sm:h-15 bg-white p-1 rounded-lg border border-slate-200/90 shadow-2xs flex items-center justify-center">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 120 120" fill="currentColor">
                    <rect x="8" y="8" width="32" height="32" rx="4" />
                    <rect x="14" y="14" width="20" height="20" rx="2" fill="white" />
                    <rect x="18" y="18" width="12" height="12" rx="1" />
                    <rect x="80" y="8" width="32" height="32" rx="4" />
                    <rect x="86" y="14" width="20" height="20" rx="2" fill="white" />
                    <rect x="90" y="18" width="12" height="12" rx="1" />
                    <rect x="8" y="80" width="32" height="32" rx="4" />
                    <rect x="14" y="86" width="20" height="20" rx="2" fill="white" />
                    <rect x="18" y="90" width="12" height="12" rx="1" />
                    {/* Matrix dots */}
                    <rect x="48" y="10" width="7" height="7" />
                    <rect x="62" y="10" width="7" height="7" />
                    <rect x="48" y="24" width="7" height="7" />
                    <rect x="62" y="38" width="7" height="7" />
                    <rect x="10" y="48" width="7" height="7" />
                    <rect x="24" y="48" width="7" height="7" />
                    <rect x="38" y="48" width="7" height="7" />
                    <rect x="24" y="62" width="7" height="7" />
                    <rect x="76" y="48" width="7" height="7" />
                    <rect x="90" y="48" width="7" height="7" />
                    <rect x="104" y="48" width="7" height="7" />
                    <rect x="90" y="62" width="7" height="7" />
                    <rect x="48" y="76" width="7" height="7" />
                    <rect x="62" y="76" width="7" height="7" />
                    <rect x="48" y="90" width="7" height="7" />
                    <rect x="62" y="104" width="7" height="7" />
                    <rect x="76" y="90" width="7" height="7" />
                    <rect x="90" y="104" width="7" height="7" />
                    <rect x="104" y="90" width="7" height="7" />
                  </svg>
                </div>

                <span className="text-[8.5px] font-mono text-slate-400 mt-0.5 font-bold">
                  ULK-000001
                </span>
              </div>
            </div>

            {/* Footer Bar: Nama Bisnis & Powered by */}
            <div className="pt-1 border-t border-slate-100 flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-black text-slate-900 tracking-tight line-clamp-1">
                {businessName || "Bisnis Anda"}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">
                powered by <strong className="text-slate-800 font-bold">ulaskami.id</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dudukan Stand Opsional (Jika Mode Meja Dipilih) */}
        {mountType === "table_stand" && (
          <>
            <div className="relative -mt-2.5 mx-auto w-4/5 h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-b-2xl border-t border-slate-300 shadow-md flex items-center justify-center animate-in fade-in duration-200">
              <div className="w-20 h-1.5 bg-slate-400/40 rounded-full" />
            </div>
            <div className="w-3/4 mx-auto h-3 bg-slate-900/10 rounded-full blur-md mt-1" />
          </>
        )}

        {/* Suction/Tape Mount Visual (Jika Mode Tempel Kaca Etalase Dipilih) */}
        {mountType === "glass_counter" && (
          <div className="mt-3 text-center animate-in fade-in duration-200">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Dilengkapi Perekat Bening Nano 3M untuk Etalase Kaca & Meja
            </span>
          </div>
        )}
      </div>

      {/* Live Customizer Input (Ketik Nama Bisnis Pelanggan) */}
      {allowCustomization && (
        <div className="w-full mt-6 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-green-600" />
              <span>Coba Ketik Nama Toko / Kafe Anda:</span>
            </span>
            <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-md">
              Pratinjau Langsung
            </span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Contoh: Kopi Kenangan Senopati"
            maxLength={32}
            className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-gray-300 focus:outline-hidden focus:border-green-600 focus:ring-2 focus:ring-green-100 bg-gray-50/50"
          />
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-gray-400">Contoh Cepat:</span>
            {sampleNames.map((sName) => (
              <button
                key={sName}
                type="button"
                onClick={() => setBusinessName(sName)}
                className="text-[10px] font-semibold text-gray-600 hover:text-green-700 bg-gray-100 hover:bg-green-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                {sName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
