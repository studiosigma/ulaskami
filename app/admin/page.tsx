"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Box,
  RefreshCw,
  Search,
  ExternalLink,
  Printer,
  Smartphone,
  Layers,
  LogOut,
  Store,
  CheckCircle2,
  Clock,
  Database,
  Radio,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Plate, SessionUser } from "@/lib/types";
import StandArtworkModal from "@/components/print/StandArtworkModal";
import BatchGeneratorModal from "@/components/admin/BatchGeneratorModal";
import NfcProgrammingModal from "@/components/admin/NfcProgrammingModal";

interface AdminStats {
  totalPlates: number;
  activePlates: number;
  unactivatedPlates: number;
  totalScans: number;
  uniqueOwners: number;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dataLayer, setDataLayer] = useState<{
    mode: string;
    label: string;
    databaseUrlConfigured: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unactivated">("all");
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [artworkPlate, setArtworkPlate] = useState<Plate | null>(null);

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/plates");
      if (res.status === 401) {
        router.push("/login?redirect=/admin");
        return;
      }
      if (res.status === 403) {
        setAuthError(
          "Akses Ditolak. Akun Anda tidak terdaftar sebagai Super Administrator. Hubungi administrator sistem atau atur ADMIN_EMAILS."
        );
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setPlates(data.plates || []);
        setStats(data.stats || null);
        setDataLayer(data.dataLayer || null);
      } else {
        setAuthError(data.error || "Gagal memuat data administrator.");
      }
    } catch (err) {
      console.error("[Admin fetch error]:", err);
      setAuthError("Gagal menghubungi server administrator.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/plates")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/admin");
          return null;
        }
        if (res.status === 403) {
          if (!ignore) {
            setAuthError(
              "Akses Ditolak. Akun Anda tidak terdaftar sebagai Super Administrator. Hubungi administrator sistem atau atur ADMIN_EMAILS."
            );
            setIsLoading(false);
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data || ignore) return;
        setCurrentUser(data.user);
        setPlates(data.plates || []);
        setStats(data.stats || null);
        setDataLayer(data.dataLayer || null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!ignore) {
          console.error("[Admin fetch error]:", err);
          setAuthError("Gagal menghubungi server administrator.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const filteredPlates = plates.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.businessName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ownerEmail || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "active") return p.isActive;
    if (statusFilter === "unactivated") return !p.isActive;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-semibold text-[#1A73E8] mb-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                </div>
                <span>Konsol Super Admin &amp; Manufaktur</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Audit Inventaris &amp; Produksi Plate
              </h1>
              {currentUser && (
                <p className="text-sm text-gray-600 mt-1">
                  Login sebagai: <strong className="text-gray-900">{currentUser.name}</strong>{" "}
                  <span className="text-blue-700 font-mono text-xs">({currentUser.email})</span>
                </p>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={fetchAdminData}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
                title="Segarkan data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] transition-colors shadow-sm cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>+ Buat Batch Plate Baru</span>
              </button>

              <button
                onClick={() => setIsNfcModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-gray-200 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
                title="Buka SOP dan Tool Pemrograman Chip NFC"
              >
                <Radio className="w-4 h-4 text-[#1A73E8]" />
                <span>SOP &amp; Pemrograman NFC</span>
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-2xs"
              >
                <Store className="w-4 h-4 text-gray-500" />
                <span>Dashboard Toko</span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-red-700 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Access Denied Warning */}
          {authError && (
            <div className="mb-8 p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-[#EA4335] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base">Hak Akses Super Admin Diperlukan</h3>
                <p className="text-sm text-red-700 mt-1 leading-relaxed">{authError}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-xs font-bold bg-[#EA4335] text-white px-3.5 py-2 rounded-lg"
                  >
                    Masuk dengan Akun Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-red-800 underline"
                  >
                    Kembali ke Dashboard Merchant
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* KPI Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Card 1: Total Plate */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#4285F4]" />
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>TOTAL PRODUKSI</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#4285F4] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">{stats.totalPlates}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {stats.uniqueOwners} Merchant terdaftar
                </div>
              </div>

              {/* Card 2: Active Plates */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#34A853]" />
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>PLATE AKTIF DI TOKO</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#34A853] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">{stats.activePlates}</div>
                <div className="text-xs text-[#2E7D32] mt-1 font-semibold flex items-center gap-1">
                  <span>{((stats.activePlates / (stats.totalPlates || 1)) * 100).toFixed(0)}% terpasang di meja</span>
                </div>
              </div>

              {/* Card 3: Unactivated Inventory */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FBBC05]" />
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>STOK SIAP JUAL</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">{stats.unactivatedPlates}</div>
                <div className="text-xs text-amber-700 mt-1 font-medium">
                  Belum diaktivasi pembeli
                </div>
              </div>

              {/* Card 4: Total Scans */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#EA4335]" />
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>TOTAL TAP &amp; SCAN</span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-[#EA4335] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">{stats.totalScans}</div>
                <div className="text-xs text-red-700 mt-1 font-medium">
                  Total interaksi review
                </div>
              </div>
            </div>
          )}

          {/* Database Layer Status */}
          {dataLayer && (
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Database className="w-4 h-4 text-[#1A73E8]" />
                <span>
                  Status Database: <strong className="text-slate-900">{dataLayer.label}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono text-[11px]">{dataLayer.mode}</span>
              </div>
              <div className="text-slate-500">
                Auto-persist ke Cloud Storage &amp; fallback memory aman
              </div>
            </div>
          )}

          {/* Inventory Table Container */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kode seri (ULK-...), nama toko, atau email merchant..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-blue-500 bg-gray-50/50"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Semua ({plates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "active"
                      ? "bg-white text-emerald-800 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Aktif ({plates.filter((p) => p.isActive).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("unactivated")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "unactivated"
                      ? "bg-white text-amber-800 shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Stok Siap Jual ({plates.filter((p) => !p.isActive).length})
                </button>
              </div>
            </div>

            {/* Plates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-gray-100 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Kode Seri Plate</th>
                    <th className="py-3.5 px-4">Nama Usaha / Toko</th>
                    <th className="py-3.5 px-4">Pemilik (Merchant)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Mode Routing</th>
                    <th className="py-3.5 px-4 text-center">Total Scan</th>
                    <th className="py-3.5 px-4 text-right">Aksi Produksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPlates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        Tidak ada plate yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredPlates.map((plate) => (
                      <tr key={plate.code} className="hover:bg-slate-50/50 transition-colors">
                        {/* Serial Code */}
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-900">
                          <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                            {plate.code}
                          </span>
                        </td>

                        {/* Business Name */}
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          {plate.businessName || (
                            <span className="text-gray-400 italic font-normal">
                              Belum terhubung
                            </span>
                          )}
                        </td>

                        {/* Merchant Email */}
                        <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                          {plate.ownerEmail || (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Belum diaktivasi
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {plate.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Stok Siap Jual
                            </span>
                          )}
                        </td>

                        {/* Routing Mode */}
                        <td className="py-3.5 px-4 text-center font-medium">
                          {plate.routingMode === "smart_filter" ? (
                            <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 text-[10.5px]">
                              Smart Filter ⭐
                            </span>
                          ) : (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 text-[10.5px]">
                              Langsung Google
                            </span>
                          )}
                        </td>

                        {/* Total Scans */}
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {plate.scanCount || 0}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setArtworkPlate(plate)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                              title="Lihat & Download Artwork Cetak Vektor"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`/r/${plate.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-green-600 hover:bg-green-50 border border-slate-200 transition-colors"
                              title="Test URL Redirect Tap NFC"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            {!plate.isActive && (
                              <Link
                                href={`/activate?code=${plate.code}`}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                              >
                                Test Aktivasi
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <span>Menampilkan {filteredPlates.length} dari {plates.length} total plates</span>
              <span>Ulaskami v1.0.0 Hardware Console</span>
            </div>
          </div>
        </div>
      </main>

      {/* Stand Artwork Modal */}
      {artworkPlate && (
        <StandArtworkModal
          plate={artworkPlate}
          isOpen={!!artworkPlate}
          onClose={() => setArtworkPlate(null)}
        />
      )}

      {/* Batch Generator Modal */}
      <BatchGeneratorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={() => {
          setIsBatchModalOpen(false);
          fetchAdminData();
        }}
      />

      {/* NFC Programming SOP & Tool Modal */}
      {isNfcModalOpen && (
        <NfcProgrammingModal
          isOpen={isNfcModalOpen}
          onClose={() => setIsNfcModalOpen(false)}
          plates={plates}
        />
      )}

      <Footer />
    </div>
  );
}
