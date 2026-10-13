"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.error || "Gagal membuat akun.");
        return;
      }

      router.push(codeParam ? `/activate?code=${encodeURIComponent(codeParam)}` : "/dashboard");
    } catch {
      setIsLoading(false);
      setError("Terjadi gangguan jaringan. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-10 border border-gray-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
      {/* Top Google 4-Color gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center">
          <Image
            src="/logo-icon.png"
            alt="Ulaskami Logo"
            width={52}
            height={60}
            className="w-auto h-13 object-contain drop-shadow-2xs"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Buat Akun Ulaskami
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Mulai aktivasi plate dan hubungkan ke Google Review Anda.
        </p>
        {codeParam && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-50 text-[#1A73E8] text-xs px-3.5 py-1 rounded-full font-mono border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Kode Terpilih: {codeParam}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Nama Lengkap / Pemilik Bisnis
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-blue-100 outline-hidden bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Email Bisnis
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@kopikenangan.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-blue-100 outline-hidden bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-blue-100 outline-hidden bg-gray-50/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#1A73E8] hover:bg-[#1557B0] shadow-md shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <span>Mendaftarkan akun...</span>
          ) : (
            <>
              <span>Daftar Akun</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
        Sudah memiliki akun?{" "}
        <Link
          href={`/login${codeParam ? `?code=${encodeURIComponent(codeParam)}` : ""}`}
          className="font-bold text-[#1A73E8] hover:underline"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Suspense fallback={<div className="text-center py-10">Memuat...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
