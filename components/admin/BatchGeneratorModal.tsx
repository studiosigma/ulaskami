"use client";

import React, { useState } from "react";
import { X, Sparkles, Download, Printer, CheckCircle2, Box, Loader2, Smartphone } from "lucide-react";
import { Plate } from "@/lib/types";

interface BatchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BatchGeneratorModal({ isOpen, onClose, onSuccess }: BatchGeneratorModalProps) {
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<{
    count: number;
    startCode: string;
    endCode: string;
    plates: Plate[];
    csvContent: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/plates/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
        onSuccess();
      } else {
        setError(data.error || "Gagal menghasilkan batch plate.");
      }
    } catch (err) {
      console.error("Gagal generate batch:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!result?.csvContent) return;
    const blob = new Blob([result.csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ulaskami_batch_${result.startCode}_to_${result.endCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSheet = () => {
    if (!result?.plates) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cardsHtml = result.plates
      .map(
        (p) => `
        <div class="sticker-card">
          <div class="brand">ULASKAMI SMART PLATE</div>
          <div class="qr-container">
            <img src="/api/plates/${p.code}/artwork?style=google_color_badge&format=square_100" />
          </div>
          <div class="serial">${p.code}</div>
          <div class="url">/r/${p.code}</div>
        </div>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Master Sheet Stiker - Batch ${result.startCode} s/d ${result.endCode}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8mm;
            }
            .sticker-card {
              border: 1px dashed #cbd5e1;
              border-radius: 8px;
              padding: 4mm;
              text-align: center;
              box-sizing: border-box;
            }
            .brand {
              font-size: 8pt;
              font-weight: 800;
              color: #475569;
              letter-spacing: 0.5px;
              margin-bottom: 2mm;
            }
            .qr-container img {
              width: 48mm;
              height: 48mm;
              display: block;
              margin: 0 auto;
            }
            .serial {
              font-family: monospace;
              font-size: 10pt;
              font-weight: 800;
              color: #0f172a;
              margin-top: 2mm;
            }
            .url {
              font-size: 7pt;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="grid">
            ${cardsHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Batch Inventory Generator
              </h2>
              <p className="text-xs text-slate-500">
                Buat dan daftarkan serial fisik baru untuk produksi plate & pemrograman chip NFC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!result ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Jumlah Plate Fisik Baru yang Ingin Didaftarkan
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`py-3 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                        count === num
                          ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {num} Plate
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Alur Produksi Otomatis:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
                  <li>Sistem akan mencari nomor serial terakhir dan melanjutkan penomoran secara berurutan.</li>
                  <li>Plate yang dihasilkan berstatus belum diaktifkan (siap diprogram & dikirim ke merchant).</li>
                  <li>Payload URL dioptimalkan untuk chip NFC NTAG213 (144 bytes) dengan respon instan iPhone & Android.</li>
                  <li>Anda dapat langsung mengunduh Master CSV untuk mesin writer chip NFC NTAG213.</li>
                </ul>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium">{error}</p>
              )}

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Serial Baru...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Daftarkan {count} Serial Plate Baru Sekarang</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">
                    Batch Serial Berhasil Didaftarkan!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Sebanyak <strong>{result.count} plate</strong> telah berhasil didaftarkan:
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-800 mt-1">
                    {result.startCode} s/d {result.endCode}
                  </p>
                </div>
              </div>

              {/* NTAG213 NFC Hardware Specs */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kesesuaian Chip NFC NTAG213</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Sangat Ringan (~25% Memori)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Payload tap: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">https://ulaskami.com/r/{result.startCode}</code> (~36 dari 144 bytes NTAG213).
                </p>
                <p className="text-[11px] text-slate-500">
                  Aplikasi Flashing: <strong>NFC Tools</strong> (Android / iOS) atau ACR122U USB Writer.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Unduh Master CSV (Mesin Writer NFC)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSheet}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>Cetak Lembar Stiker A4 (Sheet Grid)</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
