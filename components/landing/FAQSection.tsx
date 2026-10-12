"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Apa itu Ulaskami?",
      answer:
        "Ulaskami adalah produk fisik berupa Review Plate akrilik yang dilengkapi chip NFC dan QR Code pintar. Tujuannya mempermudah pelanggan bisnis Anda membuka halaman ulasan Google Review resmi hanya dengan satu tap atau scan kamera smartphone.",
    },
    {
      question: "Bagaimana cara kerjanya?",
      answer:
        "Sederhana: Pelanggan mendekatkan smartphone (NFC) atau memindai QR code pada plate. Sistem Ulaskami secara instan (<0.5 detik) mengarahkan pelanggan langsung ke formulir Google Review bisnis Anda, sehingga mereka bisa langsung menulis ulasan tanpa harus mencari nama toko Anda secara manual.",
    },
    {
      question: "Apakah ada biaya bulanan?",
      answer:
        "Sama sekali tidak ada. Ulaskami adalah sistem Beli Sekali (One-time purchase). Tidak ada biaya langganan, tidak ada biaya bulanan, dan tidak ada biaya per review. Plate dan fitur redirect dinamis aktif selamanya.",
    },
    {
      question: "Bagaimana cara aktivasi?",
      answer:
        "Setelah menerima paket Ulaskami, buka halaman /activate di browser smartphone atau laptop Anda. Masukkan kode unik yang tertera di plate (contoh: ULK-000001), buat akun, lalu masukkan link Google Review bisnis Anda. Plate langsung aktif seketika.",
    },
    {
      question: "Apakah NFC dan QR bisa digunakan bersamaan?",
      answer:
        "Ya, keduanya aktif bersamaan pada satu plate. Keduanya mengarah ke tujuan yang sama persis. Pengguna iPhone & Android modern bisa langsung tap NFC, sedangkan pengguna yang NFC-nya nonaktif dapat memindai QR Code dengan aplikasi kamera biasa.",
    },
    {
      question: "Bagaimana jika Google Review link berubah?",
      answer:
        "Anda tidak perlu mengganti plate fisik. Karena plate Ulaskami menggunakan sistem redirect dinamis, Anda cukup masuk ke Dashboard Ulaskami dan memperbarui link Google Review bisnis Anda. Plate lama akan otomatis mengarahkan ke link baru.",
    },
    {
      question: "Apakah bisa digunakan di semua bisnis?",
      answer:
        "Bisa digunakan di semua jenis bisnis yang memiliki profil Google Business / Google Maps. Sangat cocok untuk restoran, coffee shop, salon, barbershop, klinik gigi/estetika, laundry, toko retail, hotel, bengkel, hingga kantor jasa profesional.",
    },
    {
      question: "Apakah pelanggan harus menggunakan aplikasi khusus?",
      answer:
        "Tidak perlu sama sekali. NFC langsung memicu notifikasi di sistem bawaan iOS & Android, sedangkan QR Code bisa dipindai dengan kamera bawaan handphone tanpa perlu install aplikasi apapun.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50/50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 shadow-2xs mb-4">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Segala hal yang perlu Anda ketahui mengenai Ulaskami Plate.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#1A73E8]/50 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg text-gray-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-blue-50 text-[#1A73E8] rotate-180"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center text-sm text-gray-600">
          Punya pertanyaan lain yang belum terjawab?{" "}
          <a
            href={SITE_CONFIG.getWhatsAppLink(
              "Halo Ulaskami, saya ada pertanyaan tentang produk"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1A73E8] font-semibold underline hover:text-[#1557B0]"
          >
            Hubungi Tim Support kami via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
