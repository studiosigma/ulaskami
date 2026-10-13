"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw,
} from "lucide-react";
import { FeedbackRecord, FeedbackStatus } from "@/lib/types";
import { createCustomerResolutionWhatsappLink } from "@/lib/utils/whatsapp";

interface FeedbackInboxProps {
  feedbacks: FeedbackRecord[];
  onFeedbackStatusChange?: (id: string, newStatus: FeedbackStatus) => void;
}

export default function FeedbackInbox({
  feedbacks,
  onFeedbackStatusChange,
}: FeedbackInboxProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "resolved">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const unreadCount = feedbacks.filter((f) => f.status === "unread").length;
  const resolvedCount = feedbacks.filter((f) => f.status === "resolved").length;

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter === "unread") return f.status === "unread";
    if (filter === "resolved") return f.status === "resolved";
    return true;
  });

  const handleToggleStatus = async (item: FeedbackRecord) => {
    const nextStatus: FeedbackStatus = item.status === "unread" ? "resolved" : "unread";
    setUpdatingId(item.id);

    try {
      const res = await fetch(`/api/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok && onFeedbackStatusChange) {
        onFeedbackStatusChange(item.id, nextStatus);
      }
    } catch (err) {
      console.error("Gagal memperbarui status feedback:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden mb-10 relative">
      {/* Top Google 4-Color Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

      {/* Header & Tabs */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EA4335]" />
              <span>Inbox Masukan & Komplain (Smart Filter)</span>
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-[#EA4335]">
                {unreadCount} Baru
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Keluhan bintang 1–3 yang disaring secara privat sebelum terbit di Google Maps.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-2xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Semua ({feedbacks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-white text-[#EA4335] shadow-2xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Belum Ditanggapi ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "resolved"
                ? "bg-white text-[#34A853] shadow-2xs font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Selesai ({resolvedCount})
          </button>
        </div>
      </div>

      {/* List Feedbacks */}
      {filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#34A853] flex items-center justify-center mx-auto mb-2 border border-green-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-800">
            {filter === "unread"
              ? "Semua masukan telah ditangani dengan baik!"
              : "Belum ada feedback negatif yang masuk."}
          </p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Rating outlet Anda berjalan lancar. Ulasan bintang 4 & 5 langsung terhubung ke Google Maps.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredFeedbacks.map((item) => {
            const isUnread = item.status === "unread";
            const ratingColor =
              item.rating === 1
                ? "text-[#EA4335] bg-red-50 border-red-200"
                : item.rating === 2
                ? "text-amber-800 bg-amber-50 border-amber-200"
                : "text-[#1A73E8] bg-blue-50 border-blue-200";

            const waResolutionLink = item.customerPhone
              ? createCustomerResolutionWhatsappLink(
                  item.customerPhone,
                  item.businessName,
                  item.customerName
                )
              : null;

            const formattedDate = new Date(item.createdAt).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                className={`p-5 sm:p-6 transition-colors ${
                  isUnread ? "bg-amber-50/20" : "bg-white hover:bg-gray-50/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Rating, Outlet, & Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${ratingColor}`}
                      >
                        <span>{item.rating}/5</span>
                        <span>{"⭐".repeat(item.rating)}</span>
                      </span>

                      <span className="text-xs font-mono font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md">
                        {item.plateCode}
                      </span>

                      <span className="text-xs font-bold text-gray-800">
                        {item.businessName}
                      </span>

                      <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3" />
                        <span>{formattedDate} WIB</span>
                      </span>

                      {item.notifiedViaWebhook && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Webhook Alert Terkirim</span>
                        </span>
                      )}
                    </div>

                    {/* Complaint Text */}
                    <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/70 text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                      &ldquo;{item.feedbackText}&rdquo;
                    </div>

                    {/* Customer Identification Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                      <span>
                        Pengirim:{" "}
                        <strong className="text-gray-800">
                          {item.customerName || "Pelanggan Anonim"}
                        </strong>
                      </span>
                      {item.customerPhone && (
                        <>
                          <span>•</span>
                          <span>
                            No. WhatsApp:{" "}
                            <strong className="text-gray-800 font-mono">
                              {item.customerPhone}
                            </strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                    {waResolutionLink && (
                      <a
                        href={waResolutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all active:scale-98"
                        title="Buka chat WhatsApp pelanggan untuk meminta maaf atau menawarkan kompensasi"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Hubungi Pelanggan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={updatingId === item.id}
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isUnread
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                          : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {updatingId === item.id ? (
                        <span>Menyimpan...</span>
                      ) : isUnread ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-gray-500" />
                          <span>Tandai Selesai</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-green-600" />
                          <span>Selesai (Kembalikan)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
