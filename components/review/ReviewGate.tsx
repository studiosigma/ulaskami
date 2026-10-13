"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, ExternalLink, ThumbsUp, CheckCircle2, Store, HeartHandshake } from "lucide-react";
import { Plate } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/config";

interface ReviewGateProps {
  plate: Plate;
}

const RATING_FEEDBACK = {
  5: {
    label: "Luar Biasa! Sangat Puas 😍",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  4: {
    label: "Puas & Menyenangkan 😊",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  3: {
    label: "Cukup Baik 🙂",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  2: {
    label: "Kurang Memuaskan 🙁",
    color: "text-amber-800 bg-amber-50 border-amber-200",
  },
  1: {
    label: "Sangat Mengecewakan 😞",
    color: "text-[#EA4335] bg-red-50 border-red-200",
  },
};

export default function ReviewGate({ plate }: ReviewGateProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serverWhatsappAlertUrl, setServerWhatsappAlertUrl] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const minGoogleRating = plate.minGoogleRating || 4;
  const isPositive = rating !== null && rating >= minGoogleRating;
  const isNegative = rating !== null && rating < minGoogleRating;

  const activeStarCount = hoverRating || rating || 0;

  // WhatsApp link fallback untuk keluhan privat
  const targetWhatsapp = plate.feedbackWhatsapp || SITE_CONFIG.whatsappNumber;
  const whatsappComplaintMessage = `Halo pengelola ${plate.businessName}, saya pelanggan yang baru saja berkunjung (Rating ${rating}/5). Saya ingin menyampaikan masukan terkait layanan: "${privateFeedback.trim() || "..."}"`;
  const defaultWhatsappUrl = SITE_CONFIG.createCustomWhatsAppLink(targetWhatsapp, whatsappComplaintMessage);
  const effectiveWhatsappUrl = serverWhatsappAlertUrl || defaultWhatsappUrl;

  const handleSubmitPrivateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateFeedback.trim()) return;

    setIsSubmittingFeedback(true);
    setFeedbackError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plateCode: plate.code,
          rating: rating || 3,
          feedbackText: privateFeedback.trim(),
          customerName: customerName.trim() || undefined,
          customerPhone: customerPhone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim masukan.");
      }

      if (data.whatsappAlertUrl) {
        setServerWhatsappAlertUrl(data.whatsappAlertUrl);
      }
      setFeedbackSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim masukan.";
      setFeedbackError(message);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header & Branding */}
      <header className="w-full max-w-md mx-auto pt-4 pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs mb-4">
          <Image
            src="/logo-icon.png"
            alt="Ulaskami Logo"
            width={16}
            height={19}
            className="w-3.5 h-auto object-contain"
            priority
          />
          <span>Ulaskami Smart Review</span>
        </div>
      </header>

      {/* Main Review Card */}
      <main className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all relative overflow-hidden">
        {/* Top Google 4-Color Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        {/* Business Info Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#1A73E8] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {plate.businessName || "Bisnis Kami"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bagaimana pengalaman Anda bersama kami hari ini?
          </p>
        </div>

        {/* Star Rating Selector */}
        <div className="flex flex-col items-center justify-center py-2 mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isFilled = starIndex <= activeStarCount;
              return (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 sm:p-2 rounded-xl transition-all transform hover:scale-115 active:scale-95 focus:outline-hidden cursor-pointer"
                  aria-label={`Beri bintang ${starIndex}`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-11 sm:h-11 transition-colors duration-150 ${
                      isFilled
                        ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                        : "text-slate-200 hover:text-amber-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Emotional Label */}
          {rating ? (
            <div
              className={`mt-4 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border animate-in fade-in zoom-in-95 duration-200 ${
                RATING_FEEDBACK[rating as keyof typeof RATING_FEEDBACK].color
              }`}
            >
              {RATING_FEEDBACK[rating as keyof typeof RATING_FEEDBACK].label}
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-3 italic">
              Ketuk bintang untuk memberi penilaian
            </p>
          )}
        </div>

        {/* Action Panel Based on Rating */}
        {isPositive && (
          <div className="mt-2 p-5 bg-gradient-to-br from-blue-50/80 via-emerald-50/40 to-white border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-2 text-[#1A73E8] font-bold mb-1 text-sm sm:text-base">
              <ThumbsUp className="w-5 h-5 text-[#34A853] shrink-0" />
              <span>Terima kasih banyak!</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Dukungan ulasan bintang 5 Anda di Google Maps sangat berharga bagi kelangsungan usaha kami.
            </p>
            <a
              href={plate.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] shadow-md shadow-blue-600/25 transition-all transform active:scale-98 text-sm sm:text-base"
            >
              <Image
                src="/logo-icon.png"
                alt="Google Star Pin"
                width={20}
                height={24}
                className="w-4.5 h-auto object-contain shrink-0"
              />
              <span>Tulis Ulasan di Google Maps</span>
              <ExternalLink className="w-4 h-4 ml-0.5" />
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Hanya butuh 10 detik di aplikasi Google
            </p>
          </div>
        )}

        {isNegative && (
          <div className="mt-2 p-5 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 border border-amber-200/70 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-2 text-amber-900 font-semibold mb-1 text-sm sm:text-base">
              <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Mohon maaf atas ketidaknyamanan</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Kami ingin selalu memperbaiki layanan. Masukan Anda akan langsung kami sampaikan ke pihak manajemen pengelola.
            </p>

            {/* Form Masukan Internal */}
            {!feedbackSubmitted ? (
              <form onSubmit={handleSubmitPrivateFeedback} className="space-y-3">
                <div>
                  <label htmlFor="privateFeedback" className="block text-xs font-bold text-slate-700 mb-1">
                    Masukan atau Kritik Anda: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="privateFeedback"
                    rows={3}
                    required
                    value={privateFeedback}
                    onChange={(e) => setPrivateFeedback(e.target.value)}
                    placeholder="Contoh: Waktu tunggu pesanan agak lama, rasa makanan kurang asin, pelayanan kasir, dll..."
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-[#1A73E8] bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="customerName" className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Anda <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Misal: Budi"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-[#1A73E8] bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. WhatsApp Anda <span className="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0812xxxxxxx"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-[#1A73E8] bg-white font-mono"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-tight">
                  Nomor HP hanya digunakan bila pengelola ingin menyampaikan permohonan maaf atau voucher kompensasi.
                </p>

                {feedbackError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {feedbackError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!privateFeedback.trim() || isSubmittingFeedback}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] disabled:opacity-50 transition-all shadow-md shadow-blue-600/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingFeedback ? (
                    <span>Mengirimkan Masukan...</span>
                  ) : (
                    <>
                      <span>Kirim Masukan ke Pengelola</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Alternatif WhatsApp Langsung */}
                <div className="pt-2 text-center">
                  <a
                    href={effectiveWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Atau langsung chat WhatsApp pengelola</span>
                  </a>
                </div>
              </form>
            ) : (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Masukan Diterima Pengelola!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Terima kasih atas waktu dan kepedulian Anda. Kritik & saran ini telah diteruskan secara otomatis ke tim manajemen kami.
                  </p>
                </div>

                {/* Tombol Lanjutan ke WhatsApp bila pelanggan ingin kirim foto bukti */}
                <a
                  href={effectiveWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all transform active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan ke WhatsApp Pengelola</span>
                </a>
              </div>
            )}

            {/* Tautan Alternatif Google Maps untuk Kepatuhan Kebijakan Review Gating */}
            {plate.googleReviewUrl && (
              <div className="mt-3.5 pt-2.5 border-t border-amber-100 text-center">
                <a
                  href={plate.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Tetap ingin menulis ulasan di Google Maps? Klik di sini</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-md mx-auto pt-6 pb-2 text-center text-xs text-slate-400">
        <p>Ulaskami • Solusi NFC & QR Google Review Indonesia</p>
      </footer>
    </div>
  );
}
