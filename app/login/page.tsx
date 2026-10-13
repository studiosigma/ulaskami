"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, AlertCircle, UserCheck } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

function LoginForm() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.error || "Gagal masuk ke akun.");
        return;
      }

      router.push(codeParam ? `/activate?code=${encodeURIComponent(codeParam)}` : "/dashboard");
    } catch {
      setIsLoading(false);
      setError("Terjadi gangguan jaringan. Silakan coba lagi.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleFillDemo = () => {
    setEmail("budi@kopikenangan.id");
    setPassword("password123");
    setError(null);
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
          Masuk ke Akun
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Kelola plate dan tautan Google Review bisnis Anda.
        </p>
        {codeParam && (
          <div className="mt-3 inline-block bg-blue-50 text-[#1A73E8] text-xs px-3 py-1 rounded-full font-mono border border-blue-200">
            Aktivasi Plate: {codeParam}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Demo Login Box */}
      <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#1A73E8] shrink-0" />
          <div>
            <span className="font-bold">Akun Merchant Demo:</span>
            <span className="block text-[11px] text-slate-500 font-mono">budi@kopikenangan.id</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold text-[#1A73E8] hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
        >
          Isi Cepat
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="nama@bisnisanda.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#1A73E8] focus:ring-2 focus:ring-blue-100 outline-hidden bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Kata Sandi
            </label>
            <span className="text-[11px] text-gray-400 font-mono">
              Demo: password123
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            <span>Memeriksa kredensial...</span>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
        Belum punya akun?{" "}
        <Link
          href={`/register${codeParam ? `?code=${encodeURIComponent(codeParam)}` : ""}`}
          className="font-bold text-[#1A73E8] hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
