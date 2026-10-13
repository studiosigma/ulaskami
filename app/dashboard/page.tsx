"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  ExternalLink,
  Edit2,
  Check,
  X,
  Plus,
  RefreshCw,
  Database,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Smartphone,
  LogOut,
  ShieldCheck,
  Printer,
  Box,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Plate, SessionUser, RoutingMode } from "@/lib/types";
import { validateGoogleReviewUrl } from "@/lib/utils/url";
import StandArtworkModal from "@/components/print/StandArtworkModal";
import BatchGeneratorModal from "@/components/admin/BatchGeneratorModal";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [plates, setPlates] = useState<Plate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [newReviewUrl, setNewReviewUrl] = useState("");
  const [newRoutingMode, setNewRoutingMode] = useState<RoutingMode>("smart_filter");
  const [newFeedbackWhatsapp, setNewFeedbackWhatsapp] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [artworkPlate, setArtworkPlate] = useState<Plate | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [dataLayerInfo, setDataLayerInfo] = useState<{
    mode: string;
    label: string;
    databaseUrlConfigured: boolean;
  } | null>(null);

  const refreshPlates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/plates");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.plates) {
        setPlates(data.plates);
      }
      if (data.user) {
        setCurrentUser(data.user);
      }
      if (data.dataLayer) {
        setDataLayerInfo(data.dataLayer);
      }
    } catch (err) {
      console.error("Gagal memuat plates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/plates")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data || ignore) return;
        if (data.plates) {
          setPlates(data.plates);
        }
        if (data.user) {
          setCurrentUser(data.user);
        }
        if (data.dataLayer) {
          setDataLayerInfo(data.dataLayer);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat plates:", err);
      })
      .finally(() => {
        if (!ignore) {
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
    } catch {
      // ignore
    }
    router.push("/login");
  };

  const startEdit = (plate: Plate) => {
    setEditingCode(plate.code);
    setNewReviewUrl(plate.googleReviewUrl);
    setNewRoutingMode(plate.routingMode || "smart_filter");
    setNewFeedbackWhatsapp(plate.feedbackWhatsapp || "");
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingCode(null);
    setNewReviewUrl("");
    setNewRoutingMode("smart_filter");
    setNewFeedbackWhatsapp("");
    setEditError(null);
  };

  const handleSaveUrl = async (code: string) => {
    if (!newReviewUrl.trim()) return;

    const validation = validateGoogleReviewUrl(newReviewUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      setEditError(validation.error || "Tautan Google Review tidak valid.");
      return;
    }

    setIsSaving(true);
    setEditError(null);
    try {
      const res = await fetch("/api/plates/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          googleReviewUrl: validation.normalizedUrl,
          routingMode: newRoutingMode,
          feedbackWhatsapp: newFeedbackWhatsapp.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(`Pengaturan untuk plate ${code} berhasil diperbarui!`);
        setTimeout(() => setSuccessMessage(null), 3500);
        cancelEdit();
        refreshPlates();
      } else {
        setEditError(data.error || "Gagal memperbarui pengaturan.");
      }
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      setEditError("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalScans = plates.reduce((sum, p) => sum + (p.scanCount || 0), 0);
  const activePlates = plates.filter((p) => p.isActive).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Heading */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold text-green-800 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-green-600" />
                <span>Dashboard Merchant Ulaskami</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Kelola Plate & Tautan Google Review
              </h1>
              {currentUser ? (
                <p className="text-sm text-gray-600 mt-1">
                  Merchant: <strong className="text-gray-900">{currentUser.name}</strong>{" "}
                  <span className="text-gray-400">({currentUser.email})</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-1">
                  Pantau performa tap NFC dan ubah link Google Review Anda kapan saja secara mandiri.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={refreshPlates}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
                title="Segarkan data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-green-700 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-200 transition-colors shadow-2xs cursor-pointer"
                title="Buka konsol batch inventory untuk mencetak stiker & memprogram chip NFC"
              >
                <Box className="w-4 h-4 text-green-600" />
                <span className="hidden sm:inline">Batch Generator</span>
              </button>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                title="Buka konsol Super Admin & Audit Inventaris Global"
              >
                <Layers className="w-4 h-4 text-[#1A73E8]" />
                <span className="hidden sm:inline">Super Admin</span>
              </Link>
              <Link
                href="/activate"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Aktivasi Plate Baru</span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-red-700 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors cursor-pointer"
                title="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Plate</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{plates.length}</p>
                <p className="text-[11px] text-green-700 mt-0.5">{activePlates} Plate Aktif</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                <Store className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Tap & Scan</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{totalScans}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Pengunjung membuka review</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Status Data Layer</p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {dataLayerInfo?.mode === "postgres" ? "PostgreSQL Cloud" : "In-Memory Safe Mode"}
                </p>
                <p className={`text-[11px] mt-0.5 ${dataLayerInfo?.mode === "postgres" ? "text-green-700 font-semibold" : "text-amber-700"}`}>
                  {dataLayerInfo?.label || "PostgreSQL Hybrid Mode"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Database className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Visual Analytics & Peak Hour Detection */}
          {!isLoading && plates.length > 0 && (
            <AnalyticsDashboard plates={plates} />
          )}

          {/* Plates Table / Card List */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden mb-10">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Daftar Ulaskami Plate</h2>
              <span className="text-xs text-gray-500">
                {plates.length} perangkat terdaftar
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-sm text-gray-500">
                Memuat data plate...
              </div>
            ) : plates.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <p className="text-sm font-bold text-gray-800">
                  Belum ada plate terdaftar untuk akun Anda.
                </p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Jika Anda telah membeli Ulaskami Plate fisik, aktifkan plate Anda sekarang untuk memantaunya di dashboard ini.
                </p>
                <div className="pt-2">
                  <Link
                    href="/activate"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 px-3.5 py-2 rounded-xl border border-green-200"
                  >
                    <span>Mulai Aktivasi Plate Baru →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {plates.map((plate) => (
                  <div key={plate.code} className="p-6 transition-colors hover:bg-gray-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Plate details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-bold text-xs text-gray-800 border border-gray-200">
                            {plate.code}
                          </span>

                          {plate.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Belum Diaktifkan
                            </span>
                          )}

                          {plate.isActive && (
                            plate.routingMode === "direct" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <Smartphone className="w-3 h-3 text-blue-500" />
                                Direct Mode
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                                Smart Filter Aktif
                              </span>
                            )
                          )}

                          <span className="text-xs text-gray-400 font-mono">
                            Total: {plate.scanCount || 0} scan
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {plate.businessName || "(Belum ada nama bisnis)"}
                          </h3>
                        </div>

                        {/* Review URL / Expanded Settings Edit */}
                        {editingCode === plate.code ? (
                          <div className="pt-3 pb-2 max-w-2xl bg-gray-50/90 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">
                                Tautan Google Review Resmi
                              </label>
                              <input
                                type="url"
                                value={newReviewUrl}
                                onChange={(e) => {
                                  setNewReviewUrl(e.target.value);
                                  setEditError(null);
                                }}
                                placeholder="https://maps.app.goo.gl/... atau https://search.google.com/local/writereview?placeid=..."
                                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-100 bg-white outline-none"
                                autoFocus
                              />
                            </div>

                            {/* Mode Routing Selector */}
                            <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Mode Routing Pengunjung
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => setNewRoutingMode("smart_filter")}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                    newRoutingMode === "smart_filter"
                                      ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400/40"
                                      : "bg-white border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>Smart Filter Bintang</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                                    Bintang 4–5 ke Google Maps. Bintang 1–3 disaring privat ke WhatsApp pengelola.
                                  </p>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setNewRoutingMode("direct")}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                    newRoutingMode === "direct"
                                      ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/40"
                                      : "bg-white border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Direct Mode (Langsung)</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                                    Pengunjung langsung diarahkan ke halaman Google Review tanpa layar seleksi.
                                  </p>
                                </button>
                              </div>
                            </div>

                            {/* WhatsApp Keluhan (Hanya jika Smart Filter aktif) */}
                            {newRoutingMode === "smart_filter" && (
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                  Nomor WhatsApp Pengaduan Masukan (Opsional)
                                </label>
                                <input
                                  type="tel"
                                  value={newFeedbackWhatsapp}
                                  onChange={(e) => setNewFeedbackWhatsapp(e.target.value)}
                                  placeholder="Misal: 08123456789 (default ke nomor utama jika dikosongkan)"
                                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-100 bg-white outline-none"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                  Pelanggan yang memilih bintang 1–3 akan diarahkan untuk mengirim keluhan ke nomor ini.
                                </p>
                              </div>
                            )}

                            {editError && (
                              <p className="text-xs text-red-600 font-medium">
                                {editError}
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleSaveUrl(plate.code)}
                                className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-xs transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-gray-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Batal</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs text-gray-500">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-gray-700">Target Google:</span>
                              <span className="font-mono truncate max-w-xs sm:max-w-md text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                {plate.googleReviewUrl || "(Belum ditentukan)"}
                              </span>
                              {plate.isActive && (
                                <button
                                  type="button"
                                  onClick={() => startEdit(plate)}
                                  className="text-green-700 hover:text-green-800 font-semibold inline-flex items-center gap-1 ml-1 hover:underline cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Ubah Pengaturan</span>
                                </button>
                              )}
                            </div>
                            {plate.isActive && plate.routingMode !== "direct" && plate.feedbackWhatsapp && (
                              <p className="text-[11px] text-gray-400">
                                WhatsApp Pengaduan Masukan: <span className="font-mono text-gray-600">{plate.feedbackWhatsapp}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 lg:pt-0 shrink-0">
                        {plate.isActive ? (
                          <>
                            <a
                              href={`/r/${plate.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-[#1A73E8] bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-colors shadow-2xs"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Tes Tap /r/{plate.code}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {plate.routingMode !== "direct" && (
                              <Link
                                href={`/review/${plate.code}`}
                                target="_blank"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Filter</span>
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => setArtworkPlate(plate)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] shadow-sm transition-colors cursor-pointer"
                              title="Buka generator desain cetak stand akrilik & stiker"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Desain Cetak</span>
                            </button>
                          </>
                        ) : (
                          <Link
                            href={`/activate?code=${plate.code}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] shadow-xs transition-colors"
                          >
                            <span>Aktifkan Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PAAS.ID PostgreSQL Integration Helper Card */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-green-300">
                  <Database className="w-3.5 h-3.5" />
                  <span>Koneksi Database Cloud PAAS.ID</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Hubungkan ke PostgreSQL PAAS.ID Kapan Saja
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Sistem saat ini aktif menggunakan in-memory persistence agar Anda dapat langsung menguji coba seluruh alur aktivasi dan tap redirect. Saat Anda siap menghubungkan PostgreSQL dari akun PAAS.ID Anda, cukup tempel connection string ke file <code className="bg-black/40 px-1.5 py-0.5 rounded text-green-300 font-mono">.env.local</code>.
                </p>
              </div>

              <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-gray-300 space-y-1">
                <p className="text-[11px] text-gray-400 font-sans font-semibold">Contoh format .env.local:</p>
                <p className="text-green-400">DATABASE_URL=&quot;postgresql://...&quot;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Desain Cetak Stand Akrilik */}
        <StandArtworkModal
          plate={artworkPlate}
          isOpen={Boolean(artworkPlate)}
          onClose={() => setArtworkPlate(null)}
        />

        {/* Modal Batch Inventory Generator */}
        <BatchGeneratorModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          onSuccess={refreshPlates}
        />
      </main>

      <Footer />
    </div>
  );
}
