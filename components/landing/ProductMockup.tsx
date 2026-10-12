"use client";

import React from "react";
import { Wifi, Star, CheckCircle2 } from "lucide-react";

export function ProductMockup() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Soft ambient green backlight / glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-green-500/15 via-emerald-400/10 to-transparent rounded-3xl blur-2xl -z-10" />

      {/* Floating Info Pill 1 - Top Left */}
      <div className="absolute -top-3 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-800 animate-bounce duration-1000">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
        </span>
        <span>NFC Tap & Scan QR</span>
      </div>

      {/* Floating Info Pill 2 - Bottom Right */}
      <div className="absolute -bottom-2 -right-3 sm:-right-6 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-800">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span>Beli Sekali Tanpa Langganan</span>
      </div>

      {/* Acrylic Plate Container */}
      <div className="relative mx-auto rounded-[24px] p-1 bg-gradient-to-b from-white/90 via-white/50 to-white/70 shadow-2xl shadow-green-950/15 border border-white/80">
        {/* Main Acrylic Body */}
        <div className="relative rounded-[22px] bg-white border border-gray-200/80 p-6 sm:p-7 overflow-hidden text-center shadow-inner">
          {/* Subtle glossy glass reflection diagonal across the plate */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-white/60 via-green-50/20 to-transparent rotate-45 pointer-events-none transform" />

          {/* Top Brand & NFC Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center text-white text-xs font-black">
                U
              </div>
              <span className="font-bold text-xs tracking-wider text-gray-800">
                ULASKAMI
              </span>
            </div>

            {/* NFC Contactless Symbol */}
            <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-green-200/70">
              <Wifi className="w-3.5 h-3.5 rotate-90" />
              <span>NFC</span>
            </div>
          </div>

          {/* Google Official "G" & Rating Visual */}
          <div className="flex flex-col items-center justify-center my-3">
            {/* Google "G" Icon (SVG Multi-color) */}
            <div className="w-11 h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            {/* Neutral, Compliant Copy: "Bagikan pengalaman Anda" */}
            <h4 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Bagikan pengalaman Anda
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">di Google Review</p>

            {/* 5 Stars Visual */}
            <div className="flex items-center gap-1 mt-2.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>

          {/* QR Code Container with High Precision Styling */}
          <div className="relative my-4 inline-block bg-white p-3 rounded-2xl border-2 border-gray-900/10 shadow-sm">
            {/* SVG Crisp QR Code Representation */}
            <svg
              className="w-36 h-36 sm:w-40 sm:h-40 mx-auto text-gray-900"
              viewBox="0 0 120 120"
              fill="currentColor"
            >
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="30" height="30" rx="4" />
              <rect x="14" y="14" width="22" height="22" rx="2" fill="white" />
              <rect x="18" y="18" width="14" height="14" rx="2" />

              {/* Top-Right Finder */}
              <rect x="80" y="10" width="30" height="30" rx="4" />
              <rect x="84" y="14" width="22" height="22" rx="2" fill="white" />
              <rect x="88" y="18" width="14" height="14" rx="2" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="80" width="30" height="30" rx="4" />
              <rect x="14" y="84" width="22" height="22" rx="2" fill="white" />
              <rect x="18" y="88" width="14" height="14" rx="2" />

              {/* Grid Data Pattern Simulation */}
              <rect x="46" y="12" width="6" height="6" rx="1" />
              <rect x="58" y="12" width="6" height="6" rx="1" />
              <rect x="68" y="12" width="6" height="6" rx="1" />
              <rect x="46" y="24" width="6" height="6" rx="1" />
              <rect x="68" y="24" width="6" height="6" rx="1" />
              <rect x="58" y="34" width="6" height="6" rx="1" />

              <rect x="12" y="46" width="6" height="6" rx="1" />
              <rect x="24" y="46" width="6" height="6" rx="1" />
              <rect x="36" y="46" width="6" height="6" rx="1" />
              <rect x="12" y="58" width="6" height="6" rx="1" />
              <rect x="28" y="66" width="6" height="6" rx="1" />

              <rect x="82" y="48" width="6" height="6" rx="1" />
              <rect x="94" y="48" width="6" height="6" rx="1" />
              <rect x="102" y="58" width="6" height="6" rx="1" />
              <rect x="86" y="66" width="6" height="6" rx="1" />

              <rect x="46" y="80" width="6" height="6" rx="1" />
              <rect x="58" y="80" width="6" height="6" rx="1" />
              <rect x="46" y="94" width="6" height="6" rx="1" />
              <rect x="62" y="102" width="6" height="6" rx="1" />
              <rect x="74" y="86" width="6" height="6" rx="1" />
              <rect x="90" y="86" width="6" height="6" rx="1" />
              <rect x="100" y="96" width="6" height="6" rx="1" />

              {/* Center Logo Cutout with green badge */}
              <circle cx="60" cy="60" r="14" fill="white" />
              <circle cx="60" cy="60" r="11" fill="#16A34A" />
              <path
                d="M57 55v10m6-10v10M57 65h6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Tap or Scan Callout */}
            <div className="mt-1 text-[11px] font-semibold text-gray-700 tracking-tight">
              Tap NFC atau Scan QR
            </div>
          </div>

          {/* Bottom Plate Info */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span>ulaskami.com</span>
            <span className="font-semibold text-gray-600">ID: ULK-000001</span>
          </div>
        </div>
      </div>

      {/* Realistic Solid Stand Base (Birch / Acrylic Block) */}
      <div className="relative -mt-2.5 mx-auto w-4/5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-b-xl border-t border-gray-300 shadow-md flex items-center justify-center">
        <div className="w-16 h-1 bg-gray-400/40 rounded-full" />
      </div>

      {/* Subtle floor contact shadow */}
      <div className="w-3/4 mx-auto h-3 bg-gray-900/10 rounded-full blur-md mt-1" />
    </div>
  );
}
