"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data?.user) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-white/70 backdrop-blur-sm py-4 border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-base tracking-tighter">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-gray-900 leading-none">
                ULASKAMI
              </span>
              <span className="text-[10px] text-green-700 font-medium tracking-wide uppercase mt-0.5">
                NFC + QR Review Plate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#cara-kerja"
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Cara Kerja
            </Link>
            <Link
              href="/#produk"
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Produk
            </Link>
            <Link
              href="/#harga"
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Harga
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg transition-colors"
              >
                Dashboard Saya
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-500 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Masuk
              </Link>
            )}
            <Link
              href="/activate"
              className="text-sm font-semibold text-gray-700 hover:text-green-700 px-4 py-2 rounded-lg hover:bg-green-50/80 transition-colors"
            >
              Aktivasi Plate
            </Link>
            <Link
              href="/#harga"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/activate"
              className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-200"
            >
              Aktivasi
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-gray-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Cara Kerja
            </Link>
            <Link
              href="/#produk"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Detail Produk
            </Link>
            <Link
              href="/#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              Harga Plate
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              FAQ
            </Link>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-4 rounded-lg font-semibold text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200"
              >
                {isLoggedIn ? "Dashboard Saya" : "Masuk Akun Merchant"}
              </Link>
              <Link
                href="/activate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
              >
                Aktivasi Plate Saya
              </Link>
              <Link
                href="/#harga"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-green-600 hover:bg-green-700 shadow-sm"
              >
                Pesan Ulaskami Plate
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
