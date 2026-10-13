"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Layers, Palette, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export type PlaqueTheme = "google_signature" | "dark_luxury" | "frost_gold";
export type MountType = "table_stand" | "glass_counter";

interface ProductMockupProps {
  allowCustomization?: boolean;
}

export function ProductMockup({
  allowCustomization = true,
}: ProductMockupProps) {
  const [selectedTheme, setSelectedTheme] = useState<PlaqueTheme>("google_signature");
  const [mountType, setMountType] = useState<MountType>("table_stand");

  return (
    <div className="w-full max-w-[500px] mx-auto select-none flex flex-col items-center">
      {/* 1. Selector Model Fisik Akrilik (Stand Meja Kasir vs Tempel Kaca) */}
      {allowCustomization && (
        <div className="w-full mb-3.5 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Pilihan Model Fisik Akrilik:</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 w-full bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200/90 shadow-2xs">
            {/* Opsi 1: Stand Meja Kasir (Gambar 2) */}
            <button
              type="button"
              onClick={() => setMountType("table_stand")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mountType === "table_stand"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/90 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  mountType === "table_stand" ? "bg-[#1A73E8]" : "bg-gray-300"
                }`}
              />
              <span>Stand Meja Kasir (Model L)</span>
            </button>

            {/* Opsi 2: Tempel Kaca / Etalase (Gambar 1) */}
            <button
              type="button"
              onClick={() => setMountType("glass_counter")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mountType === "glass_counter"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/90 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  mountType === "glass_counter" ? "bg-[#34A853]" : "bg-gray-300"
                }`}
              />
              <span>Tempel Kaca / Etalase (1:1)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Selector Varian Warna / Desain */}
      {allowCustomization && (
        <div className="w-full mb-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            <Palette className="w-3.5 h-3.5 text-[#EA4335]" />
            <span>Pilihan Varian Tema:</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-full bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200/90 shadow-2xs">
            {/* Varian A: Google 4-Color Signature (Ready Stock) */}
            <button
              type="button"
              onClick={() => setSelectedTheme("google_signature")}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                selectedTheme === "google_signature"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/90 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-0.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </div>
              <span className="leading-tight">Google 4-Color</span>
              <span className="text-[8.5px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md mt-0.5 border border-emerald-100">
                Ready Stock
              </span>
            </button>

            {/* Varian B: Dark Luxury (Coming Soon) */}
            <button
              type="button"
              onClick={() => setSelectedTheme("dark_luxury")}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                selectedTheme === "dark_luxury"
                  ? "bg-gray-900 text-white shadow-sm border border-gray-800"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-0.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700" />
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>
              <span className="leading-tight">Dark Luxury</span>
              <span className="text-[8.5px] font-bold text-amber-500 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded-md mt-0.5">
                Coming Soon
              </span>
            </button>

            {/* Varian C: Frost White & Gold (Coming Soon) */}
            <button
              type="button"
              onClick={() => setSelectedTheme("frost_gold")}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                selectedTheme === "frost_gold"
                  ? "bg-gradient-to-b from-amber-50 to-white text-amber-950 shadow-sm border border-amber-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-0.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-amber-200" />
                <span className="w-2 h-2 rounded-full bg-white border border-amber-300" />
              </div>
              <span className="leading-tight">Frost &amp; Gold</span>
              <span className="text-[8.5px] font-bold text-amber-700 bg-amber-100/80 border border-amber-300/50 px-1.5 py-0.2 rounded-md mt-0.5">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Showcase Container Utama */}
      <div className="relative w-full flex flex-col items-center">
        {/* Ambient Subtle Glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/15 via-red-500/10 to-amber-500/15 rounded-[36px] blur-2xl -z-10 transition-all duration-300" />

        {/* Floating Top Badge: NFC + QR */}
        <div className="absolute -top-3 -left-2 sm:-left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/80 flex items-center gap-2 text-xs font-semibold text-gray-800">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34A853]"></span>
          </span>
          <span>Dual Tech: NFC + Laser QR</span>
        </div>

        {/* Floating Top Badge Kanan: Ready Stock vs Pre-Order */}
        <div className="absolute -top-3 -right-2 sm:-right-4 z-20">
          {selectedTheme === "google_signature" ? (
            <div className="bg-emerald-600 text-white font-bold text-[11px] tracking-wide px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Ready Stock</span>
            </div>
          ) : (
            <div className="bg-amber-500 text-slate-950 font-black text-[10.5px] tracking-wide px-3 py-1.5 rounded-full shadow-md border border-amber-300 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>Segera Hadir / Pre-Order</span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAMPILAN FOTO FISIK ASLI (GOOGLE 4-COLOR SIGNATURE)            */}
        {/* ------------------------------------------------------------- */}
        {selectedTheme === "google_signature" && (
          <div className="w-full flex flex-col items-center pt-2 pb-1 animate-in fade-in zoom-in-95 duration-200">
            {/* Card Frame Bersih & Mewah */}
            <div className="relative w-full bg-white rounded-3xl p-3 sm:p-4 border border-gray-200/80 shadow-xl overflow-hidden flex flex-col items-center justify-center">
              {/* GAMBAR 2: MODEL STAND MEJA KASIR (MODEL L) */}
              {mountType === "table_stand" && (
                <div className="relative w-full flex flex-col items-center group">
                  <div className="relative w-full max-w-[420px] aspect-[1024/764] overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                    <Image
                      src="/products/model-stand-kasir.jpg"
                      alt="Model Stand Meja Kasir Akrilik - Ulaskami Google Review Plate"
                      width={1024}
                      height={764}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>

                  {/* Keterangan Model di Bawah Foto */}
                  <div className="w-full mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left px-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                        <span>Model Stand Meja Kasir (Model L)</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Dudukan akrilik tekuk solid, berdiri kokoh di meja kasir tanpa butuh lem.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 px-2 py-1 rounded-md shrink-0 border border-blue-100">
                      Foto Fisik Asli
                    </span>
                  </div>
                </div>
              )}

              {/* GAMBAR 1: MODEL TEMPEL KACA / ETALASE (1:1 SQUARE) */}
              {mountType === "glass_counter" && (
                <div className="relative w-full flex flex-col items-center group">
                  <div className="relative w-full max-w-[360px] aspect-square overflow-hidden rounded-3xl bg-white flex items-center justify-center p-2">
                    <Image
                      src="/products/model-tempel-kaca.jpg"
                      alt="Model Tempel Kaca dan Etalase Akrilik - Ulaskami Google Review Plate"
                      width={1024}
                      height={1024}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />
                  </div>

                  {/* Keterangan Model di Bawah Foto */}
                  <div className="w-full mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left px-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                        <span>Model Tempel Kaca / Etalase (1:1)</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Dilengkapi perekat bening nano 3M untuk kaca pintu masuk &amp; etalase.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#34A853] bg-emerald-50 px-2 py-1 rounded-md shrink-0 border border-emerald-100">
                      Foto Fisik Asli
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAMPILAN PREVIEW TEMA B & C (COMING SOON / PRE-ORDER)          */}
        {/* ------------------------------------------------------------- */}
        {selectedTheme !== "google_signature" && (
          <div className="w-full flex flex-col items-center pt-2 pb-1 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`relative w-full rounded-3xl p-6 sm:p-8 border shadow-xl overflow-hidden flex flex-col items-center justify-center text-center ${
                selectedTheme === "dark_luxury"
                  ? "bg-gradient-to-b from-[#161821] to-[#0d0e14] border-zinc-800 text-white"
                  : "bg-gradient-to-b from-amber-50/90 via-white to-amber-100/50 border-amber-200/90 text-stone-900"
              }`}
            >
              {/* Icon Status */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md ${
                  selectedTheme === "dark_luxury"
                    ? "bg-zinc-800/80 border border-zinc-700 text-amber-400"
                    : "bg-amber-100 border border-amber-300 text-amber-700"
                }`}
              >
                <Sparkles className="w-7 h-7" />
              </div>

              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
                  selectedTheme === "dark_luxury"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-amber-200/80 text-amber-900 border border-amber-300"
                }`}
              >
                Tahap Produksi • Segera Hadir
              </span>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                {selectedTheme === "dark_luxury"
                  ? "Edisi Dark Luxury (Matte Black)"
                  : "Edisi Frost White & Gold Accent"}
              </h3>

              <p
                className={`text-xs sm:text-sm max-w-sm leading-relaxed mb-6 ${
                  selectedTheme === "dark_luxury" ? "text-zinc-300" : "text-stone-600"
                }`}
              >
                {selectedTheme === "dark_luxury"
                  ? "Latar akrilik hitam doff (matte black) elegan dengan aksen tajam. Sangat cocok untuk barbershop, cafe industrial, lounge, dan steakhouse."
                  : "Akrilik semi-transparan frosted glass dengan sentuhan aksen emas berkilau. Dirancang khusus untuk klinik kecantikan, spa, dan hotel boutique."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xs">
                <a
                  href={SITE_CONFIG.getWhatsAppLink(
                    `Halo Ulaskami, saya tertarik dengan varian ${
                      selectedTheme === "dark_luxury" ? "Dark Luxury" : "Frost White & Gold"
                    } dan ingin Pre-Order!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-md transition-all text-center"
                >
                  Pre-Order via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("google_signature")}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    selectedTheme === "dark_luxury"
                      ? "border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700"
                      : "border-amber-300 bg-white text-stone-800 hover:bg-amber-50"
                  }`}
                >
                  Lihat Foto Ready Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Micro-Features Bottom Strip */}
        <div className="mt-3 text-center flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Cast Acrylic Premium</span>
          </span>
          <span className="text-gray-300">•</span>
          <span>Tahan Air &amp; Anti Gores</span>
          <span className="text-gray-300">•</span>
          <span>Aktivasi Mandiri &lt; 2 Menit</span>
        </div>
      </div>
    </div>
  );
}
