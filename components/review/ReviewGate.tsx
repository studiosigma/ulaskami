"use client";

import React, { useState } from "react";
import { Star, MessageSquare, ExternalLink, ThumbsUp, CheckCircle2, Store, HeartHandshake } from "lucide-react";
import { Plate } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/config";

interface ReviewGateProps {
  plate: Plate;
}

const RATING_FEEDBACK = {
  5: {
    label: "Luar Biasa! Sangat Puas 😍",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  4: {
    label: "Puas & Menyenangkan 😊",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  3: {
    label: "Cukup Baik 🙂",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  2: {
    label: "Kurang Memuaskan 🙁",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  1: {
    label: "Sangat Mengecewakan 😞",
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
};

export default function ReviewGate({ plate }: ReviewGateProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const minGoogleRating = plate.minGoogleRating || 4;
  const isPositive = rating !== null && rating >= minGoogleRating;
  const isNegative = rating !== null && rating < minGoogleRating;

  const activeStarCount = hoverRating || rating || 0;

  // WhatsApp link untuk keluhan privat
  const targetWhatsapp = plate.feedbackWhatsapp || SITE_CONFIG.whatsappNumber;
  const whatsappComplaintMessage = `Halo pengelola ${plate.businessName}, saya pelanggan yang baru saja berkunjung (Rating ${rating}/5). Saya ingin menyampaikan masukan terkait layanan:`;
  const whatsappUrl = SITE_CONFIG.createCustomWhatsAppLink(targetWhatsapp, whatsappComplaintMessage);

  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateFeedback.trim()) return;

    setIsSubmittingFeedback(true);
    // Simulasikan pencatatan masukan internal
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header & Branding */}
      <header className="w-full max-w-md mx-auto pt-4 pb-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Ulaskami Smart Review
        </div>
      </header>

      {/* Main Review Card */}
      <main className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 transition-all">
        {/* Business Info Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-200">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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
                        ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                        : "text-slate-300 hover:text-amber-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Emotional Label */}
          {rating ? (
            <div
              className={`mt-4 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border animate-in fade-in zoom-in-95 duration-200 ${
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
          <div className="mt-2 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1 text-sm sm:text-base">
              <ThumbsUp className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Terima kasih banyak!</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              Dukungan ulasan bintang 5 Anda di Google Maps sangat berharga bagi kelangsungan usaha kami.
            </p>
            <a
              href={plate.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all transform active:scale-98 text-sm sm:text-base"
            >
              <span>Tulis Ulasan di Google Maps</span>
              <ExternalLink className="w-4 h-4" />
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

            {/* Tombol Pengaduan Langsung via WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all transform active:scale-98 text-sm mb-3"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Sampaikan via WhatsApp Pengelola</span>
            </a>

            {/* Form Masukan Internal Alternatif */}
            {!feedbackSubmitted ? (
              <form onSubmit={handleSubmitPrivateFeedback} className="mt-3 pt-3 border-t border-amber-100">
                <label htmlFor="privateFeedback" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Atau tuliskan masukan langsung di sini:
                </label>
                <textarea
                  id="privateFeedback"
                  rows={2}
                  value={privateFeedback}
                  onChange={(e) => setPrivateFeedback(e.target.value)}
                  placeholder="Misal: Rasa makanan, waktu tunggu pesanan, dll..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={!privateFeedback.trim() || isSubmittingFeedback}
                  className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  {isSubmittingFeedback ? "Mengirim Masukan..." : "Kirim Masukan Internal"}
                </button>
              </form>
            ) : (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Masukan Telah Diterima
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Terima kasih banyak, kritik & saran Anda akan menjadi prioritas evaluasi kami.
                </p>
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
