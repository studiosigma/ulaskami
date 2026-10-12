"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Store,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { GoogleReviewHelper } from "@/components/activate/GoogleReviewHelper";
import { validateGoogleReviewUrl } from "@/lib/utils/url";

function ActivateWizard() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialStatus = searchParams.get("status") || "";

  const initialClean = initialCode.toUpperCase().trim();
  const isValidInitial = /^ULK-[A-Z0-9]{6}$/i.test(initialClean);

  // Wizard Steps: 1 = Plate Code, 2 = Business Details & Google Review, 3 = Activated Success
  const [step, setStep] = useState<1 | 2 | 3>(isValidInitial ? 2 : 1);

  // Form states
  const [plateCode, setPlateCode] = useState(isValidInitial ? initialClean : initialCode.toUpperCase());
  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTested, setIsTested] = useState(false);

  // Async fetch plate info if initial valid code was passed in URL
  useEffect(() => {
    if (!isValidInitial) return;
    let ignore = false;

    fetch(`/api/plates/${initialClean}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data?.plate) {
          if (data.plate.businessName) setBusinessName(data.plate.businessName);
          if (data.plate.googleReviewUrl) setGoogleReviewUrl(data.plate.googleReviewUrl);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [isValidInitial, initialClean]);

  // Code formatting: ULK-XXXXXX
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (!val.startsWith("ULK-") && val.length > 0) {
      if (val.startsWith("ULK")) {
        val = "ULK-" + val.slice(3).replace(/-/g, "");
      } else {
        val = "ULK-" + val.replace(/-/g, "");
      }
    }
    if (val.length <= 10) {
      setPlateCode(val);
      setError(null);
    }
  };

  // Step 1: Validate Code
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = plateCode.trim();
    const regex = /^ULK-[A-Z0-9]{6}$/i;

    if (!clean) {
      setError("Silakan masukkan kode plate Anda.");
      return;
    }
    if (!regex.test(clean)) {
      setError("Format kode tidak valid. Contoh yang benar: ULK-000001");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Check existing plate data
    fetch(`/api/plates/${clean}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if (data.plate) {
          if (data.plate.businessName) setBusinessName(data.plate.businessName);
          if (data.plate.googleReviewUrl) setGoogleReviewUrl(data.plate.googleReviewUrl);
        }
        setStep(2);
      })
      .catch(() => {
        setIsLoading(false);
        setStep(2);
      });
  };

  // Step 2: Test Review URL
  const handleTestReviewUrl = () => {
    const validation = validateGoogleReviewUrl(googleReviewUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      setError(validation.error || "Masukkan tautan Google Review yang sah.");
      return;
    }
    window.open(validation.normalizedUrl, "_blank", "noopener,noreferrer");
    setIsTested(true);
    setError(null);
  };

  // Step 2: Submit Activation
  const handleCompleteActivation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      setError("Nama bisnis wajib diisi.");
      return;
    }
    if (!googleReviewUrl.trim()) {
      setError("Tautan Google Review bisnis wajib diisi.");
      return;
    }

    const validation = validateGoogleReviewUrl(googleReviewUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      setError(validation.error || "Tautan Google Review tidak valid.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/plates/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: plateCode,
          businessName,
          googleReviewUrl: validation.normalizedUrl,
          ownerEmail: ownerEmail || undefined,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.error || "Gagal mengaktivasi plate.");
        return;
      }

      setStep(3);
    } catch {
      setIsLoading(false);
      setError("Terjadi gangguan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Redirect Notification Banner (if redirected from /r/[code]) */}
      {initialStatus === "unactivated" && step !== 3 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold text-sm text-amber-950">
              Plate {plateCode || "Anda"} Siap Diaktifkan!
            </p>
            <p className="mt-0.5 text-amber-800">
              Plate fisik ini baru saja di-tap/scan dan belum terhubung ke profil Google Review bisnis mana pun. Selesaikan aktivasi di bawah dalam 2 menit.
            </p>
          </div>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1
                ? "bg-green-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            1
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>
            Kode Plate
          </span>
        </div>

        <div className={`h-0.5 flex-1 mx-3 transition-colors ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`} />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 2
                ? "bg-green-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
          <span className={`text-xs font-semibold ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}>
            Data Bisnis
          </span>
        </div>

        <div className={`h-0.5 flex-1 mx-3 transition-colors ${step === 3 ? "bg-green-600" : "bg-gray-200"}`} />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 3
                ? "bg-green-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            3
          </div>
          <span className={`text-xs font-semibold ${step === 3 ? "text-gray-900" : "text-gray-400"}`}>
            Selesai
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-gray-200/90 shadow-xl shadow-green-950/5">
        {/* ================= STEP 1: KODE PLATE ================= */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-center mx-auto mb-4 font-bold shadow-xs">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Aktivasi Ulaskami Plate
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Masukkan kode unik yang tertera pada bagian bawah plate fisik Anda.
              </p>
            </div>

            <form onSubmit={handleProceedToStep2} className="space-y-5">
              <div>
                <label
                  htmlFor="plateCode"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 text-center"
                >
                  Kode Plate Fisik
                </label>
                <input
                  id="plateCode"
                  type="text"
                  value={plateCode}
                  onChange={handleCodeChange}
                  placeholder="ULK-000001"
                  className={`w-full px-4 py-3.5 text-center text-xl font-mono font-bold tracking-widest rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-100 text-gray-900"
                  }`}
                  maxLength={10}
                  autoComplete="off"
                  autoFocus
                />

                {error ? (
                  <p className="mt-2 text-xs text-red-600 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-gray-400 text-center">
                    Format: ULK- diikuti 6 karakter (Contoh: ULK-000001)
                  </p>
                )}
              </div>

              {/* Demo Fillers */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPlateCode("ULK-000001");
                    setError(null);
                  }}
                  className="text-green-700 hover:text-green-800 underline font-medium"
                >
                  Demo Plate 1 (Aktif): ULK-000001
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setPlateCode("ULK-000002");
                    setError(null);
                  }}
                  className="text-green-700 hover:text-green-800 underline font-medium"
                >
                  Demo Plate 2 (Baru): ULK-000002
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Memeriksa kode...</span>
                ) : (
                  <>
                    <span>Lanjutkan ke Data Bisnis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: DATA BISNIS & GOOGLE REVIEW ================= */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                  Langkah 2 dari 3
                </span>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Hubungkan ke Google Review
                </h2>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-mono font-bold text-gray-700">
                {plateCode}
              </div>
            </div>

            <form onSubmit={handleCompleteActivation} className="space-y-5">
              {/* Nama Bisnis */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nama Bisnis / Toko
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Kopi Kenangan Senopati"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                  />
                </div>
              </div>

              {/* Helper Tutorial Component */}
              <GoogleReviewHelper onSelectSampleUrl={(url) => setGoogleReviewUrl(url)} />

              {/* Link Google Review */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tautan Google Review
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    required
                    value={googleReviewUrl}
                    onChange={(e) => {
                      setGoogleReviewUrl(e.target.value);
                      setIsTested(false);
                      setError(null);
                    }}
                    placeholder="https://g.page/r/.../review atau https://maps.app.goo.gl/..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleTestReviewUrl}
                    className={`shrink-0 px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isTested
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {isTested ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span>Link Teruji ✓</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Uji Buka Link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Uji link terlebih dahulu untuk memastikan halaman ulasan langsung terbuka di tab baru.
                </p>
              </div>

              {/* Email Bisnis / Pemilik (Opsional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email Pemilik Bisnis <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="budi@bisnisanda.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-4 rounded-xl font-bold text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Menyimpan aktivasi...</span>
                  ) : (
                    <>
                      <span>Aktifkan Plate Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: SUKSES AKTIVASI ================= */}
        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              Plate Aktif & Siap Digunakan
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Aktivasi Berhasil!
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Ulaskami Plate <strong>{plateCode}</strong> kini telah resmi terhubung ke Google Review <strong>{businessName}</strong>.
            </p>

            {/* Plate Live Preview Card */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Target Bisnis:</span>
                <span className="text-xs font-bold text-gray-900">{businessName}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Link Redirect Dinamis:</span>
                <span className="text-xs font-mono font-bold text-green-700">
                  /r/{plateCode}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-medium block mb-1">
                  Google Review URL Terhubung:
                </span>
                <p className="text-[11px] font-mono text-gray-700 truncate bg-white p-2 rounded-lg border border-gray-200">
                  {googleReviewUrl}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              {/* Test Live Redirect */}
              <a
                href={`/r/${plateCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Uji Coba Tap Sekarang (/r/{plateCode})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/dashboard"
                className="py-3.5 px-5 rounded-xl font-bold text-sm text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ke Dashboard</span>
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
              <RotateCcw className="w-3.5 h-3.5" />
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPlateCode("");
                  setBusinessName("");
                  setGoogleReviewUrl("");
                  setIsTested(false);
                }}
                className="text-green-700 hover:underline font-semibold"
              >
                Aktivasi plate lainnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guarantee badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Tautan Google Review dapat Anda ubah kapan saja tanpa mengganti plate fisik.</span>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 md:pt-36 md:pb-24">
        <Suspense fallback={<div className="text-center py-20 text-gray-500">Memuat alur aktivasi...</div>}>
          <ActivateWizard />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
