"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Printer, Sparkles, Layers, Check } from "lucide-react";
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
  const [overrideBusinessName, setOverrideBusinessName] = useState<string | null>(null);
  const [includeCropMarks, setIncludeCropMarks] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [loadedKey, setLoadedKey] = useState<string>("");

  const businessName = overrideBusinessName !== null ? overrideBusinessName : (plate?.businessName || "Bisnis Kami");
  const currentKey = plate ? `${plate.code}_${style}_${format}_${includeCropMarks}_${businessName}` : "";
  const isLoading = Boolean(isOpen && plate && loadedKey !== currentKey);

  useEffect(() => {
    if (!isOpen || !plate) return;

    let ignore = false;
    const query = new URLSearchParams({
      style,
      format,
      cropMarks: includeCropMarks ? "true" : "false",
      businessName,
    });

    fetch(`/api/plates/${plate.code}/artwork?${query.toString()}`)
      .then((res) => res.text())
      .then((svg) => {
        if (!ignore) {
          setSvgContent(svg);
          setLoadedKey(`${plate.code}_${style}_${format}_${includeCropMarks}_${businessName}`);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat preview SVG:", err);
      });

    return () => {
      ignore = true;
    };
  }, [isOpen, plate, style, format, includeCropMarks, businessName]);

  if (!isOpen || !plate) return null;

  const downloadUrl = `/api/plates/${plate.code}/artwork?style=${style}&format=${format}&cropMarks=${includeCropMarks}&businessName=${encodeURIComponent(businessName)}&download=true`;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Stand - ${plate.code}</title>
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Desain Cetak Stand Akrilik Siap Pakai
              </h2>
              <p className="text-xs text-slate-500">
                Serial Plat: <span className="font-mono font-bold text-slate-700">{plate.code}</span>
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
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100/70 rounded-2xl p-4 sm:p-6 border border-slate-200/60 min-h-[340px]">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pratinjau Vektor Presisi (Skalabilitas 100%)</span>
            </div>

            {isLoading ? (
              <div className="py-20 text-xs text-slate-400 animate-pulse">
                Memproses matriks QR code vektor...
              </div>
            ) : svgContent ? (
              <div
                className="w-full max-w-[340px] aspect-square rounded-2xl shadow-lg bg-white overflow-hidden p-2 transition-transform transform hover:scale-[1.02]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : null}

            <p className="text-[11px] text-slate-400 text-center mt-3">
              QR Code aktif & mengarah ke:{" "}
              <span className="font-mono text-slate-600">/r/{plate.code}</span>
            </p>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-5 space-y-4">
            {/* Style Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Model Desain
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setStyle("google_color_badge")}
                  className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    style === "google_color_badge"
                      ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/40"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center border-indigo-600 bg-indigo-600 text-white shrink-0">
                    {style === "google_color_badge" && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Opsi 2: Badge 4-Warna Google
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sangat cocok ditempel di etalase kaca display atau meja kasir.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStyle("minimal_clear")}
                  className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    style === "minimal_clear"
                      ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/40"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center border-indigo-600 bg-indigo-600 text-white shrink-0">
                    {style === "minimal_clear" && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Opsi 1: Stand Meja Minimalis Bening
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Cocok diletakkan di meja kafe/restoran dengan balok dudukan kayu.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Format / Dimensi Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ukuran Fisik Stand
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "square_100", label: "10 x 10 cm", desc: "Standar" },
                  { id: "square_120", label: "12 x 12 cm", desc: "Besar" },
                  { id: "tent_a6", label: "A6 Portrait", desc: "Tent-Card" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id as ArtworkFormat)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      format === item.id
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs"
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Bisnis Input */}
            <div>
              <label htmlFor="businessNameInput" className="block text-xs font-bold text-slate-700 mb-1">
                Teks Nama Bisnis pada Stand
              </label>
              <input
                id="businessNameInput"
                type="text"
                value={businessName}
                onChange={(e) => setOverrideBusinessName(e.target.value)}
                placeholder="Nama bisnis Anda..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Crop Marks Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCropMarks}
                  onChange={(e) => setIncludeCropMarks(e.target.checked)}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Sertakan garis panduan potong (*crop marks*) percetakan</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
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
