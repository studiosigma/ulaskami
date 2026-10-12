"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function ProductSection() {
  const features = [
    {
      title: "NFC Chip Respons Cepat",
      description: "NTAG213 berkecepatan tinggi, cukup dekatkan smartphone pelanggan.",
    },
    {
      title: "Laser-Sharp QR Code",
      description: "Resolusi tinggi tahan gores, mudah discan kamera HP dalam kondisi cahaya apa pun.",
    },
    {
      title: "Acrylic Plate Premium",
      description: "Material akrilik tebal 3mm kokoh, tahan cipratan air, dan memberi kesan mewah.",
    },
    {
      title: "Aktivasi Mandiri Instan",
      description: "Aktivasi mudah melalui browser HP Anda tanpa butuh install aplikasi khusus.",
    },
    {
      title: "Link Dinamis",
      description: "Bebas ganti URL Google Review bisnis Anda kapan saja tanpa ganti plate fisik.",
    },
    {
      title: "Tanpa Biaya Bulanan",
      description: "Murni bayar satu kali di awal. Tidak ada biaya langganan selamanya.",
    },
  ];

  return (
    <section id="produk" className="py-20 sm:py-28 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Mockup Showcase */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <ProductMockup />
          </div>

          {/* Right Column: Product Detail & Features */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-green-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              <span>Spesifikasi Fisik & Fitur</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Ulaskami Review Plate
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-normal leading-relaxed">
              Satu plate. Dua cara untuk membuka Google Review.
            </p>

            {/* Features Checklist Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex items-start gap-3 hover:border-green-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Material & Size badge */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 bg-white p-3.5 rounded-xl border border-gray-200">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Dimensi:</span>
                <span>10 cm x 15 cm</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Tebal:</span>
                <span>3mm Cast Acrylic</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-800">Dudukan:</span>
                <span>Solid Stand Included</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/#harga"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-green-600/20 transition-all duration-200 active:scale-98"
              >
                <span>Pesan Ulaskami</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/activate"
                className="text-sm font-semibold text-gray-600 hover:text-green-700 px-4 py-3"
              >
                Aktivasi Plate Anda →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
