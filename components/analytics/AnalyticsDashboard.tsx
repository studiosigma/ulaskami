"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Clock,
  Smartphone,
  Download,
  Calendar,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Plate, PlateAnalytics, DailyScanPoint } from "@/lib/types";

interface AnalyticsDashboardProps {
  plates: Plate[];
  initialSelectedCode?: string;
}

export default function AnalyticsDashboard({
  plates,
  initialSelectedCode,
}: AnalyticsDashboardProps) {
  const activePlates = plates.filter((p) => p.isActive);
  const defaultCode = initialSelectedCode || activePlates[0]?.code || plates[0]?.code || "";

  const [userSelectedCode, setUserSelectedCode] = useState<string>("");
  const selectedCode = userSelectedCode || defaultCode;
  const [daysRange, setDaysRange] = useState<7 | 30>(30);
  const [data, setData] = useState<{
    code: string;
    days: number;
    analytics: PlateAnalytics;
  } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DailyScanPoint | null>(null);

  const isLoading = !data || data.code !== selectedCode || data.days !== daysRange;
  const analytics = data?.analytics || null;

  // Fetch analytics data
  useEffect(() => {
    if (!selectedCode) return;

    let ignore = false;

    fetch(`/api/plates/${selectedCode}/analytics?days=${daysRange}`)
      .then((res) => res.json())
      .then((resData) => {
        if (!ignore && resData?.analytics) {
          setData({
            code: selectedCode,
            days: daysRange,
            analytics: resData.analytics,
          });
        }
      })
      .catch((err) => {
        console.error("Gagal memuat analitik:", err);
      });

    return () => {
      ignore = true;
    };
  }, [selectedCode, daysRange]);

  if (plates.length === 0 || !selectedCode) {
    return null;
  }

  const currentPlate = plates.find((p) => p.code === selectedCode);
  const exportCsvUrl = `/api/plates/${selectedCode}/export-scans`;

  // Max value calculation for Daily Trend Chart
  const dailyCounts = analytics?.dailyTrends.map((d) => d.count) || [0];
  const maxDailyCount = Math.max(...dailyCounts, 5);

  // Max value calculation for Hourly Peak Chart
  const hourlyCounts = analytics?.hourlyPeaks.map((h) => h.count) || [0];
  const maxHourlyCount = Math.max(...hourlyCounts, 3);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-8 mb-10 transition-all relative overflow-hidden">
      {/* Top Google 4-Color Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

      {/* Top Header & Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-semibold text-[#1A73E8]">
            <BarChart3 className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Wawasan & Analisis Performa Review</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Tren Kunjungan & Deteksi Jam Sibuk
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Outlet: <strong className="text-gray-800">{analytics?.businessName || currentPlate?.businessName || selectedCode}</strong>{" "}
            <span className="font-mono text-gray-400">({selectedCode})</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch Plate Selector jika punya lebih dari 1 plate */}
          {activePlates.length > 1 && (
            <div className="relative">
              <select
                value={selectedCode}
                onChange={(e) => setUserSelectedCode(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 focus:outline-hidden cursor-pointer"
              >
                {activePlates.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.businessName || "Tanpa Nama"}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          )}

          {/* Timeframe Toggle: 7 Hari vs 30 Hari */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setDaysRange(7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                daysRange === 7
                  ? "bg-white text-[#1A73E8] shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => setDaysRange(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                daysRange === 30
                  ? "bg-white text-[#1A73E8] shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              30 Hari
            </button>
          </div>

          {/* Export CSV Button */}
          <a
            href={exportCsvUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-[#1A73E8] bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
            title="Unduh seluruh data log mentah dalam format CSV"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Ekspor CSV</span>
          </a>
        </div>
      </div>

      {/* Metric Overview Cards: Google 4-Color Styled */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tap (Google Blue) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-100 shadow-2xs">
          <div className="flex items-center justify-between text-[#1A73E8] mb-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Total Tap / Scan</span>
            <TrendingUp className="w-4 h-4 text-[#1A73E8]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isLoading ? "..." : analytics?.totalScans || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {daysRange === 7 ? "7 hari terakhir" : "Sepanjang waktu"}
          </p>
        </div>

        {/* Card 2: Rata-rata Harian (Google Green) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-100 shadow-2xs">
          <div className="flex items-center justify-between text-[#34A853] mb-2">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Rata-rata Harian</span>
            <Calendar className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isLoading ? "..." : `${analytics?.averageDailyScans || 0}`}
            <span className="text-sm font-semibold text-slate-400 ml-1">/ hari</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Kunjungan aktif ulasan
          </p>
        </div>

        {/* Card 3: Jam Sibuk (Google Yellow / Amber) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Jam Paling Ramai</span>
            <Clock className="w-4 h-4 text-[#FBBC05]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 flex items-center gap-1.5">
            {isLoading ? "..." : analytics?.busiestHour.label || "13:00"}
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Peak
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Waktu ulasan tertinggi ({analytics?.busiestHour.count || 0} scan)
          </p>
        </div>

        {/* Card 4: Platform Terbanyak (Google Red Accent) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50/40 via-white to-white border border-red-100/70 shadow-2xs">
          <div className="flex items-center justify-between text-[#EA4335] mb-2">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider">Perangkat Pelanggan</span>
            <Smartphone className="w-4 h-4 text-[#EA4335]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isLoading ? "..." : `${analytics?.deviceBreakdown.iosPercentage || 60}%`}
            <span className="text-xs font-semibold text-slate-500 ml-1">iOS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {analytics?.deviceBreakdown.androidPercentage || 40}% Android
          </p>
        </div>
      </div>

      {/* Main Section: Daily Trend Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>Grafik Pertumbuhan Scan Harian</span>
            <span className="text-xs font-normal text-gray-400">({daysRange} hari terakhir)</span>
          </h3>

          {hoveredPoint && (
            <div className="text-xs font-bold text-[#1A73E8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full animate-in fade-in duration-150">
              {hoveredPoint.dayLabel}: <strong>{hoveredPoint.count} scan</strong>
            </div>
          )}
        </div>

        {/* Interactive SVG Bar & Area Chart */}
        <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/70">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              Memuat grafik tren...
            </div>
          ) : analytics?.dailyTrends && analytics.dailyTrends.length > 0 ? (
            <div className="space-y-2">
              <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6">
                {analytics.dailyTrends.map((point) => {
                  const heightPercent = Math.max(
                    Math.round((point.count / maxDailyCount) * 100),
                    point.count > 0 ? 12 : 4
                  );
                  const isHovered = hoveredPoint?.date === point.date;

                  return (
                    <div
                      key={point.date}
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                    >
                      {/* Floating tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-7 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-md z-10 pointer-events-none whitespace-nowrap">
                          {point.count} scan
                        </div>
                      )}

                      {/* Bar Fill: Google Blue */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-200 ${
                          point.count > 0
                            ? isHovered
                              ? "bg-[#1A73E8] shadow-md shadow-blue-300"
                              : "bg-[#4285F4] hover:bg-[#1A73E8]"
                            : "bg-slate-200/60"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Labels */}
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-slate-200">
                <span>{analytics.dailyTrends[0]?.dayLabel}</span>
                {daysRange === 30 && (
                  <span className="hidden sm:inline">
                    {analytics.dailyTrends[Math.floor(analytics.dailyTrends.length / 2)]?.dayLabel}
                  </span>
                )}
                <span>{analytics.dailyTrends[analytics.dailyTrends.length - 1]?.dayLabel}</span>
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              Belum ada data scan pada periode ini.
            </div>
          )}
        </div>
      </div>

      {/* Secondary Section: Peak Hours Analysis & Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 24-Hours Peak Distribution */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Peta Jam Sibuk Ulasan (24 Jam)</span>
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Distribusi per jam (WIB)</span>
          </div>

          <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
            <div className="h-32 flex items-end gap-1 sm:gap-1.5 pt-4">
              {analytics?.hourlyPeaks.map((peak) => {
                const heightPercent = Math.max(
                  Math.round((peak.count / maxHourlyCount) * 100),
                  peak.count > 0 ? 14 : 4
                );
                return (
                  <div
                    key={peak.hour}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    title={`${peak.label}: ${peak.count} scan`}
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all ${
                        peak.isPeak
                          ? "bg-[#FBBC05] shadow-xs"
                          : peak.count > 0
                          ? "bg-amber-300/80 hover:bg-amber-400"
                          : "bg-slate-200/50"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Hours X-Axis markers */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-200">
              <span>00:00</span>
              <span>06:00</span>
              <span className="font-bold text-amber-700">12:00 (Siang)</span>
              <span className="font-bold text-amber-700">18:00 (Malam)</span>
              <span>23:00</span>
            </div>
          </div>
        </div>

        {/* Right: Strategic Recommendation Banner */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Rekomendasi Waktu Review</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengunjung paling aktif memberikan rating pada pukul{" "}
              <strong className="text-amber-900 font-bold">{analytics?.busiestHour.label}</strong>{" "}
              (dengan konsentrasi ulasan jam makan siang & makan malam).
            </p>
            <div className="text-[11px] text-slate-500 bg-white/80 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853] shrink-0 mt-0.5" />
              <span>
                <strong>Tips Operasional:</strong> Ingatkan barista/kasir Anda untuk menyapa dan meminta ulasan ramah pada jam-jam puncak tersebut!
              </span>
            </div>
          </div>

          {/* Device Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Platform HP</span>
              <span className="text-[11px] font-normal text-slate-400">
                {analytics?.deviceBreakdown.total || 0} scan terdeteksi
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{ width: `${analytics?.deviceBreakdown.iosPercentage || 50}%` }}
                className="bg-[#1A73E8] h-full"
                title={`Apple iOS: ${analytics?.deviceBreakdown.iosPercentage || 0}%`}
              />
              <div
                style={{ width: `${analytics?.deviceBreakdown.androidPercentage || 50}%` }}
                className="bg-[#34A853] h-full"
                title={`Google Android: ${analytics?.deviceBreakdown.androidPercentage || 0}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1A73E8]"></span>
                <span>iOS ({analytics?.deviceBreakdown.iosPercentage || 0}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
                <span>Android ({analytics?.deviceBreakdown.androidPercentage || 0}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
