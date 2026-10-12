"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ULASKAMI
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-sm leading-relaxed">
              NFC + QR Review Plate untuk bisnis Anda. Beli sekali, pasang di lokasi bisnis, dan permudah pelanggan memberikan ulasan langsung di Google Review.
            </p>
            <p className="mt-3 text-xs font-semibold text-green-400">
              &ldquo;Buat Bisnismu Semakin Direkomendasikan di Google Maps&rdquo;
            </p>
          </div>

          {/* Column 1: Produk & Fitur */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Produk
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#produk" className="hover:text-white transition-colors">
                  Ulaskami Review Plate
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="hover:text-white transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/#harga" className="hover:text-white transition-colors">
                  Daftar Harga
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Paket & Diskon Bundle
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Pelanggan & Aktivasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/activate" className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition-colors">
                  Aktivasi Plate
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Panduan Pemasangan
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Masuk Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Kontak & Bantuan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Bantuan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={SITE_CONFIG.getWhatsAppLink(
                    "Halo Ulaskami, saya butuh bantuan informasi produk"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  WhatsApp Support
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </li>
              <li>
                <span className="text-xs text-gray-500 block">
                  Senin - Sabtu: 09:00 - 18:00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Compliance */}
        <div className="mt-12 pt-8 border-t border-gray-800/80 text-xs text-gray-400 leading-relaxed">
          <p>
            <strong className="text-gray-300">Disclaimer:</strong> Google, Google Review, Google Maps, dan Google Business Profile adalah merek dagang terdaftar milik Google LLC. Ulaskami adalah penyedia perangkat NFC dan QR code mandiri dan tidak terafiliasi, disponsori, atau didukung secara langsung oleh Google LLC. Ulaskami bertujuan mempermudah navigasi pelanggan menuju tautan review resmi tanpa manipulasi sistem penilaian.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} Ulaskami (ulaskami.com). Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-2">
            <span>Dibuat untuk memajukan UMKM Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
