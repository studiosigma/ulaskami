"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Printer, Sparkles, CheckCircle2, ShieldCheck, QrCode, Store, Square } from "lucide-react";
import { Plate } from "@/lib/types";
import { ArtworkFormat } from "@/lib/utils/artwork";

interface StandArtworkModalProps {
  plate: Plate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StandArtworkModal({ plate, isOpen, onClose }: StandArtworkModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ArtworkFormat>("tent_a6");
  const [includeCropMarks, setIncludeCropMarks] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [loadedKey, setLoadedKey] = useState<string>("");

  const currentKey = plate ? `${plate.code}_${selectedFormat}_${includeCropMarks}` : "";
  const isLoading = Boolean(isOpen && plate && loadedKey !== currentKey);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !plate) return;

    let ignore = false;
    const query = new URLSearchParams({
      style: "google_color_badge",
      format: selectedFormat,
      cropMarks: includeCropMarks ? "true" : "false",
    });

    fetch(`/api/plates/${plate.code}/artwork?${query.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(errMsg || `Gagal memuat template (${res.status})`);
        }
        return res.text();
      })
      .then((svg) => {
        if (!ignore) {
          setFetchError(null);
          setSvgContent(svg);
          setLoadedKey(`${plate.code}_${selectedFormat}_${includeCropMarks}`);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Gagal memuat preview SVG:", err);
          setFetchError(err instanceof Error ? err.message : "Gagal memuat preview desain SVG");
        }
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, plate, selectedFormat, includeCropMarks]);

  if (!isOpen || !plate) return null;

  const downloadUrl = `/api/plates/${plate.code}/artwork?style=google_color_badge&format=${selectedFormat}&cropMarks=${includeCropMarks}&download=true`;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const pageSize = selectedFormat === "tent_a6" ? "105mm 148mm" : "100mm 100mm";
    const modelTitle = selectedFormat === "tent_a6" ? "Stand Meja Kasir Model L" : "Tempel Kaca Etalase";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Plakat Akrilik - ${plate.code} - ${modelTitle}</title>
          <style>
            @page {
              margin: 0;
              size: ${pageSize};
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
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1A73E8] flex items-center justify-center shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Master Cetak Plakat Akrilik</span>
                <span className="text-[10px] font-bold text-[#1A73E8] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  Format Resmi 100% Sesuai Foto
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Barcode unik aktif untuk kode seri:{" "}
                <span className="font-mono font-bold text-slate-800">{plate.code}</span>
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

        {/* Model Selector Bar */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600">Pilih Model Fisik Plakat:</span>
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setSelectedFormat("tent_a6")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "tent_a6"
                  ? "bg-[#1A73E8] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Stand Meja Kasir (L-Stand A6)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("square_100")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "square_100"
                  ? "bg-[#1A73E8] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Tempel Kaca (Kotak 1:1)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100/80 rounded-2xl p-4 sm:p-6 border border-slate-200/70 min-h-[380px]">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>
                {selectedFormat === "tent_a6"
                  ? "Pratinjau Master Stand Meja Kasir (10.5 × 14.8 cm)"
                  : "Pratinjau Master Tempel Kaca (1024 × 1024 px)"}
              </span>
            </div>

            {isLoading ? (
              <div className="py-24 text-xs text-slate-400 animate-pulse flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Menyiapkan barcode matriks presisi...</span>
              </div>
            ) : fetchError ? (
              <div className="py-20 text-xs text-red-600 flex flex-col items-center gap-2 text-center px-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                  !
                </div>
                <span className="font-semibold">{fetchError}</span>
                <span className="text-slate-400">Silakan periksa koneksi atau coba muat ulang.</span>
              </div>
            ) : svgContent ? (
              <div
                className={`w-full ${
                  selectedFormat === "tent_a6" ? "max-w-[270px] aspect-[800/1130]" : "max-w-[320px] aspect-square"
                } rounded-2xl shadow-xl bg-white overflow-hidden p-1.5 transition-transform transform hover:scale-[1.02]`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : null}

            <p className="text-[11px] text-slate-500 text-center mt-3 font-medium">
              Barcode / QR Code ini otomatis aktif &amp; langsung mengarah ke:{" "}
              <span className="font-mono font-bold text-blue-600">/r/{plate.code}</span>
            </p>
          </div>

          {/* Right Column: Spesifikasi Cetak & Keterangan Produksi */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Box Info Spesifikasi Produksi */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#34A853]" />
                  <span>Standar Cetak Produksi Akrilik</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500">Model Fisik:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedFormat === "tent_a6"
                        ? "Stand Meja Kasir L (A6)"
                        : "Tempel Kaca & Etalase (1:1)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500">Dimensi Akrilik:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedFormat === "tent_a6" ? "10.5 × 14.8 cm" : "10.0 × 10.0 cm"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500">Kode Barcode / QR:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {plate.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500">Desain Master:</span>
                    <span className="font-semibold text-slate-800">Google 4-Color Signature</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Resolusi Vektor:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedFormat === "tent_a6"
                        ? "800 × 1130 px (HD Vektor)"
                        : "1024 × 1024 px (HD 300+ DPI)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Penjelasan Perbedaan Tiap Cetakan */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl text-xs text-blue-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#1A73E8]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedFormat === "tent_a6"
                      ? "Stand Kasir L-Stand Otentik"
                      : "Plat Tempel Kaca Universal"}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  {selectedFormat === "tent_a6"
                    ? "Dudukan kasir berdiri dengan kemiringan ergonomis. Pelanggan dapat menempelkan HP (NFC) di kiri atau scan QR di kanan secara instan."
                    : "Plat akrilik flat 10x10 cm untuk ditempel di pintu kaca, etalase, atau cermin kasir dengan double tape foam transparan."}
                </p>
              </div>

              {/* Crop Marks Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCropMarks}
                    onChange={(e) => setIncludeCropMarks(e.target.checked)}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Sertakan garis panduan potong (*crop marks*) percetakan</span>
                </label>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
              💡 File SVG ini siap diimpor langsung ke CorelDraw, Adobe Illustrator, atau software mesin UV Flatbed Print.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            Siap cetak untuk {selectedFormat === "tent_a6" ? "Stand Meja Kasir Model L (10.5 × 14.8 cm)" : "Tempel Kaca / Etalase (10 × 10 cm)"}.
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
