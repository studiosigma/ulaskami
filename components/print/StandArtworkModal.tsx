"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Printer, Sparkles, Layers, Check, Palette } from "lucide-react";
import { Plate } from "@/lib/types";
import { ArtworkStyle, ArtworkFormat } from "@/lib/utils/artwork";

interface StandArtworkModalProps {
  plate: Plate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StandArtworkModal({ plate, isOpen, onClose }: StandArtworkModalProps) {
  const [style, setStyle] = useState<ArtworkStyle>("google_color_badge");
  const [format, setFormat] = useState<ArtworkFormat>("square_100");
  const [customBusinessName, setCustomBusinessName] = useState<string>("");
  const [includeBusinessName, setIncludeBusinessName] = useState<boolean>(false);
  const [includeCropMarks, setIncludeCropMarks] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [loadedKey, setLoadedKey] = useState<string>("");

  const effectiveBusinessName = includeBusinessName
    ? (customBusinessName.trim() || plate?.businessName || "")
    : "";

  const currentKey = plate
    ? `${plate.code}_${style}_${format}_${includeCropMarks}_${effectiveBusinessName}`
    : "";
  const isLoading = Boolean(isOpen && plate && loadedKey !== currentKey);

  useEffect(() => {
    if (!isOpen || !plate) return;

    let ignore = false;
    const query = new URLSearchParams({
      style,
      format,
      cropMarks: includeCropMarks ? "true" : "false",
      businessName: effectiveBusinessName,
    });

    fetch(`/api/plates/${plate.code}/artwork?${query.toString()}`)
      .then((res) => res.text())
      .then((svg) => {
        if (!ignore) {
          setSvgContent(svg);
          setLoadedKey(`${plate.code}_${style}_${format}_${includeCropMarks}_${effectiveBusinessName}`);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat preview SVG:", err);
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, plate, style, format, includeCropMarks, effectiveBusinessName]);

  if (!isOpen || !plate) return null;

  const downloadUrl = `/api/plates/${plate.code}/artwork?style=${style}&format=${format}&cropMarks=${includeCropMarks}&businessName=${encodeURIComponent(effectiveBusinessName)}&download=true`;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Plakat Akrilik - ${plate.code}</title>
          <style>
            @page {
              margin: 0;
              size: auto;
            }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #ffffff;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${svgContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1A73E8] flex items-center justify-center shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Desain Cetak Model Fisik Akrilik</span>
                <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  Sesuai Landing Page
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Serial Plakat: <span className="font-mono font-bold text-slate-800">{plate.code}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100/80 rounded-2xl p-4 sm:p-6 border border-slate-200/70 min-h-[380px]">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Pratinjau Vektor Presisi (Sesuai Desain Landing Page)</span>
            </div>

            {isLoading ? (
              <div className="py-24 text-xs text-slate-400 animate-pulse flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Menghasilkan matriks vektor presisi...</span>
              </div>
            ) : svgContent ? (
              <div
                className="w-full max-w-[340px] aspect-square rounded-2xl shadow-xl bg-white overflow-hidden p-2 transition-transform transform hover:scale-[1.02]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : null}

            <p className="text-[11px] text-slate-400 text-center mt-3">
              QR Code aktif & mengarah ke:{" "}
              <span className="font-mono font-semibold text-slate-600">/r/{plate.code}</span>
            </p>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Model Fisik Akrilik (Stand Meja Kasir vs Tempel Kaca) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Model Fisik Akrilik:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Opsi 1: Tempel Kaca / Etalase (1:1) */}
                <button
                  type="button"
                  onClick={() => setFormat("square_100")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    format === "square_100"
                      ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                    {format === "square_100" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Tempel Kaca / Etalase (1:1)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Model Square presisi
                  </p>
                </button>

                {/* Opsi 2: Stand Meja Kasir (Model L) */}
                <button
                  type="button"
                  onClick={() => setFormat("tent_a6")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    format === "tent_a6"
                      ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A73E8]" />
                    {format === "tent_a6" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    Stand Meja Kasir (Model L)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Model Stand Meja tekuk
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Pilihan Varian Tema */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Pilihan Varian Tema:</span>
              </label>
              <div className="space-y-2">
                {/* Tema A: Google 4-Color Signature */}
                <button
                  type="button"
                  onClick={() => setStyle("google_color_badge")}
                  className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    style === "google_color_badge"
                      ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center border-blue-600 bg-blue-600 text-white shrink-0">
                    {style === "google_color_badge" && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">
                        Google 4-Color Signature
                      </p>
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Ready Stock
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Desain otentik review us on Google dengan 4 sudut warna resmi Google.
                    </p>
                  </div>
                </button>

                {/* Tema B: Dark Luxury */}
                <button
                  type="button"
                  onClick={() => setStyle("dark_luxury")}
                  className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    style === "dark_luxury"
                      ? "bg-slate-900 text-white border-slate-800 ring-2 ring-slate-700"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center border-slate-400 text-white shrink-0">
                    {style === "dark_luxury" && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold ${style === "dark_luxury" ? "text-white" : "text-slate-900"}`}>
                        Dark Luxury / Matte Black
                      </p>
                      <span className="text-[9.5px] font-bold text-amber-500 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded">
                        Coming Soon
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${style === "dark_luxury" ? "text-slate-300" : "text-slate-500"}`}>
                      Akrilik hitam doff obsidian dengan aksen tajam maskulin.
                    </p>
                  </div>
                </button>

                {/* Tema C: Frost White & Gold Accent */}
                <button
                  type="button"
                  onClick={() => setStyle("frost_gold")}
                  className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    style === "frost_gold"
                      ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center border-amber-600 bg-amber-600 text-white shrink-0">
                    {style === "frost_gold" && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">
                        Frost White &amp; Gold Accent
                      </p>
                      <span className="text-[9.5px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Semi-transparan mutiara &amp; 5 bintang emas untuk klinik estetika &amp; spa.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Opsi Kustomisasi Nama Toko (Opsional) */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBusinessName}
                  onChange={(e) => setIncludeBusinessName(e.target.checked)}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Cetak nama bisnis di plakat (Default: Universal tanpa nama bisnis)</span>
              </label>

              {includeBusinessName && (
                <div className="mt-2 pl-5 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={customBusinessName}
                    onChange={(e) => setCustomBusinessName(e.target.value)}
                    placeholder={plate.businessName || "Ketik nama bisnis..."}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Nama bisnis akan dicetak tepat di atas &apos;powered by ulaskami.id&apos;.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Crop Marks Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCropMarks}
                  onChange={(e) => setIncludeCropMarks(e.target.checked)}
                  className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Sertakan garis panduan potong (*crop marks*) percetakan</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            File SVG vektor murni (300+ DPI) dapat langsung dibuka di CorelDraw, Illustrator, atau mesin UV Print.
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <a
              href={downloadUrl}
              download
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Vektor SVG</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
