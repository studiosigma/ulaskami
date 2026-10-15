"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Radio,
  Lock,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  QrCode
} from "lucide-react";
import { Plate } from "@/lib/types";

interface NfcProgrammingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plates: Plate[];
}

export default function NfcProgrammingModal({
  isOpen,
  onClose,
  plates,
}: NfcProgrammingModalProps) {
  const [activeTab, setActiveTab] = useState<"sop" | "batch_tool">("sop");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedPlateCode, setSelectedPlateCode] = useState<string>(
    plates[0]?.code || "ULK-000001"
  );
  const [testedPlates, setTestedPlates] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentPlate = plates.find((p) => p.code === selectedPlateCode) || plates[0];
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://ulaskami.id";
  const targetUrl = currentPlate ? `${baseUrl}/r/${currentPlate.code}` : `${baseUrl}/r/ULK-000001`;

  const handleCopyUrl = (url: string, code: string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const togglePlateTested = (code: string) => {
    setTestedPlates((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#1A73E8] flex items-center justify-center shadow-2xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>SOP &amp; Tool Pemrograman Chip NFC (NTAG213)</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Hardware QC Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Panduan operasional teknis penulisan chip dan perakitan fisik plakat akrilik.
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

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-white border-b border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("sop")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "sop"
                ? "border-[#1A73E8] text-[#1A73E8]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SOP Standar Perakitan &amp; Pemrograman</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("batch_tool")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "batch_tool"
                ? "border-[#1A73E8] text-[#1A73E8]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Quick NFC Encoder &amp; QC Checklist ({plates.length} Plat)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* TAB 1: SOP DETAIL */}
          {activeTab === "sop" && (
            <div className="space-y-6">
              {/* Box Info Ringkas */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-200/80 flex items-start gap-3.5">
                <Smartphone className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block font-bold mb-0.5">
                    Spesifikasi Chip Fisik: NTAG213 (13.56 MHz, 144 Bytes User Memory)
                  </strong>
                  Chip NTAG213 adalah chip standar global yang kompatibel dengan 100% smartphone NFC (iPhone 7 ke atas &amp; seluruh HP Android ber-NFC). Penulisan memakan waktu rata-rata <strong>~3 detik per plat</strong>.
                </div>
              </div>

              {/* Step by Step Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Langkah 1 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#1A73E8] font-black text-xs flex items-center justify-center mb-2.5">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Download Aplikasi Pemrogram di HP
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Install aplikasi gratis <strong>&ldquo;NFC Tools&rdquo;</strong> (tersedia gratis di Google Play Store &amp; Apple App Store). Nyalakan fitur NFC di pengaturan HP Anda.
                  </p>
                </div>

                {/* Langkah 2 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-100/50 relative">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#1A73E8] font-black text-xs flex items-center justify-center mb-2.5">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Format URL Tautan Plat
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buka <strong>NFC Tools</strong> &rarr; Pilih tab <strong>Write</strong> &rarr; <strong>Add a record</strong> &rarr; Pilih <strong>URL / URI</strong>. Masukkan URL resmi plat masing-masing:
                  </p>
                  <div className="mt-2 p-2 bg-slate-100 rounded-lg font-mono text-[11px] font-bold text-blue-700">
                    https://ulaskami.id/r/[KODE_PLAT]
                  </div>
                </div>

                {/* Langkah 3 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-[#1A73E8] font-black text-xs flex items-center justify-center mb-2.5">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Dekatkan Stiker Chip ke Punggung HP
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tekan tombol <strong>&ldquo;Write / 28 Bytes&rdquo;</strong> di layar aplikasi, lalu dekatkan stiker chip NTAG213 ke sensor NFC di punggung HP Anda sampai berbunyi <em>bip</em> dan muncul centang hijau sukses.
                  </p>
                </div>

                {/* Langkah 4 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center mb-2.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Kunci Chip (Lock Tag / Read-Only)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Di aplikasi NFC Tools, buka menu <strong>Other tasks &rarr; Lock tag</strong>. Langkah ini wajib dilakukan agar chip tidak bisa ditimpa / diubah URL-nya oleh orang lain saat sudah terpasang di meja kasir.
                  </p>
                </div>

                {/* Langkah 5 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mb-2.5">
                    5
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Posisi Penempelan pada Akrilik
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lepas lapisan perekat stiker chip NFC. Tempelkan stiker di bagian <strong>belakang akrilik</strong> tepat di area logo lingkaran <strong>`TAP YOUR PHONE`</strong> agar saat pelanggan mendekatkan HP ke ikon tersebut, sensor langsung terpicu seketika.
                  </p>
                </div>

                {/* Langkah 6 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs relative">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center mb-2.5">
                    6
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    Pengujian Akhir (QC Tap Test)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Uji menggunakan HP lain tanpa membuka aplikasi apa pun. Cukup dekatkan HP ke plat &rarr; browser HP harus langsung membuka halaman review dalam &lt; 1 detik. Plat siap dimasukkan ke kemasan!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUICK ENCODER HELPER */}
          {activeTab === "batch_tool" && (
            <div className="space-y-5">
              {/* Selector & Quick Copy Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Pilih Kode Seri Plat yang Sedang Diprogram:
                  </label>
                  <select
                    value={selectedPlateCode}
                    onChange={(e) => setSelectedPlateCode(e.target.value)}
                    className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {plates.map((p) => (
                      <tr key={p.code}>
                        <option value={p.code}>
                          {p.code} {testedPlates[p.code] ? "✓ (QC Passed)" : "• (Belum QC)"}
                        </option>
                      </tr>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(targetUrl, currentPlate?.code || "")}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors shadow-sm cursor-pointer"
                  >
                    {copiedCode === currentPlate?.code ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>URL Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin URL NFC</span>
                      </>
                    )}
                  </button>

                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
                    title="Uji Buka URL di Browser"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Uji Link</span>
                  </a>
                </div>
              </div>

              {/* Detail Tautan yang Harus Ditulis ke Chip */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Teks URL Lengkap (NDEF URI):
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Byte Size: ~34 Bytes (Muat di NTAG213 144B)
                  </span>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-800 break-all select-all font-semibold">
                  {targetUrl}
                </div>
              </div>

              {/* Tabel Checklist QC Cepat Batch */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Daftar Verifikasi QC Batch ({plates.length} Plat)</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    Lolos QC: {Object.values(testedPlates).filter(Boolean).length} / {plates.length}
                  </span>
                </h4>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4">Serial Plat</th>
                        <th className="py-2.5 px-4">Tautan Redirect NFC</th>
                        <th className="py-2.5 px-4 text-center">Status QC Tap</th>
                        <th className="py-2.5 px-4 text-right">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {plates.map((plate) => {
                        const pUrl = `${baseUrl}/r/${plate.code}`;
                        const isTested = Boolean(testedPlates[plate.code]);
                        return (
                          <tr key={plate.code} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                              {plate.code}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                              /r/{plate.code}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => togglePlateTested(plate.code)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold cursor-pointer transition-all ${
                                  isTested
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
                                }`}
                              >
                                {isTested ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>QC PASSED</span>
                                  </>
                                ) : (
                                  <span>Tandai Lolos QC</span>
                                )}
                              </button>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(pUrl, plate.code)}
                                className="px-2 py-1 rounded-lg text-[10.5px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                              >
                                {copiedCode === plate.code ? "Tersalin!" : "Salin URL"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            SOP ini memastikan 100% plat yang dikirim ke pelanggan dapat langsung berfungsi tanpa kendala.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
