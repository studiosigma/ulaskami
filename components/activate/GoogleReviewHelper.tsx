"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface GoogleReviewHelperProps {
  onSelectSampleUrl?: (url: string) => void;
}

export function GoogleReviewHelper({ onSelectSampleUrl }: GoogleReviewHelperProps) {
  const [activeTab, setActiveTab] = useState<"mobile" | "desktop">("mobile");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const sampleDemoUrl =
    "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4";

  const handleCopySample = () => {
    if (onSelectSampleUrl) {
      onSelectSampleUrl(sampleDemoUrl);
    }
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-green-200/90 bg-green-50/50 p-4 sm:p-5 transition-all">
      {/* Header bar with toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>Panduan: Cara Mendapatkan Link Google Review Bisnis Anda</span>
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Klik di sini untuk melihat 3 langkah mudah menyalin tautan resmi.
            </p>
          </div>
        </div>
        <div className="text-gray-500 p-1 rounded-lg hover:bg-green-100/60 transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-green-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-green-700" />
          )}
        </div>
      </button>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-green-200/60 space-y-4 animate-in fade-in duration-200">
          {/* Platform Tab Switcher */}
          <div className="flex rounded-xl bg-white p-1 border border-green-200/70 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("mobile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === "mobile"
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Lewat HP (Google Maps)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === "desktop"
                  ? "bg-green-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Lewat Komputer (Google Search)</span>
            </button>
          </div>

          {/* Guide Content: Mobile */}
          {activeTab === "mobile" && (
            <div className="bg-white rounded-xl p-4 border border-green-200/80 space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Buka aplikasi Google Maps</p>
                  <p className="text-gray-500 mt-0.5">
                    Cari profil bisnis Anda, lalu ketuk nama bisnis untuk membuka detailnya.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Cari tombol &ldquo;Minta Ulasan&rdquo; (Ask for reviews)
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Pada tab Beranda bisnis atau bagian Ulasan, ketuk tombol <strong>&ldquo;Minta ulasan&rdquo;</strong> dengan ikon bagikan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Salin Tautan</p>
                  <p className="text-gray-500 mt-0.5">
                    Ketuk tombol <strong>&ldquo;Salin ke papan klip&rdquo;</strong> (Copy link), lalu tempel tautan tersebut pada kolom formulir di bawah.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guide Content: Desktop */}
          {activeTab === "desktop" && (
            <div className="bg-white rounded-xl p-4 border border-green-200/80 space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Ketik &ldquo;Bisnis Saya&rdquo; di Google Search
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Pastikan Anda login dengan akun Google yang mengelola Profil Bisnis Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Pilih menu &ldquo;Minta Ulasan&rdquo;
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Klik tombol <strong>&ldquo;Minta ulasan&rdquo;</strong> yang muncul di kotak dasbor Google Bisnis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Salin Shortlink</p>
                  <p className="text-gray-500 mt-0.5">
                    Salin link yang berformat <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">https://g.page/r/.../review</code> dan tempel ke kolom formulir di bawah.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Format information & Quick Demo Filler */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>Format didukung: g.page, maps.app.goo.gl, search.google.com</span>
            </div>

            <button
              type="button"
              onClick={handleCopySample}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 bg-white px-3 py-1.5 rounded-lg border border-green-200 hover:border-green-300 transition-colors shadow-2xs"
            >
              {copiedSample ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>Link Demo Ditempel!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Gunakan Link Contoh Demo</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
