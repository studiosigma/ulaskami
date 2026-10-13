import { NextRequest, NextResponse } from "next/server";
import { updatePlateUrl, getPlateByCode } from "@/lib/db/plates";
import { validateGoogleReviewUrl } from "@/lib/utils/url";
import { getCurrentSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Sesi telah berakhir. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, googleReviewUrl, businessName, routingMode, feedbackWhatsapp, webhookUrl, minGoogleRating } = body;

    if (!code || !googleReviewUrl) {
      return NextResponse.json(
        { error: "Kode plate dan tautan Google Review wajib diisi." },
        { status: 400 }
      );
    }

    const plate = await getPlateByCode(code);
    if (!plate) {
      return NextResponse.json(
        { error: "Plate tidak ditemukan." },
        { status: 404 }
      );
    }

    // Verifikasi kepemilikan plate
    if (plate.ownerEmail && plate.ownerEmail.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Anda tidak memiliki hak akses untuk mengubah plate ini." },
        { status: 403 }
      );
    }

    const urlValidation = validateGoogleReviewUrl(googleReviewUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: urlValidation.error || "Tautan Google Review tidak valid." },
        { status: 400 }
      );
    }

    // Normalisasi nomor WhatsApp jika diisi
    let cleanWhatsapp: string | undefined = undefined;
    if (feedbackWhatsapp !== undefined) {
      let raw = (feedbackWhatsapp || "").replace(/[^0-9]/g, "");
      if (raw.startsWith("0")) {
        raw = "62" + raw.slice(1);
      }
      cleanWhatsapp = raw;
    }

    const cleanWebhook = webhookUrl !== undefined ? String(webhookUrl).trim() : undefined;

    const updated = await updatePlateUrl({
      code: code.trim(),
      googleReviewUrl: urlValidation.normalizedUrl || googleReviewUrl.trim(),
      businessName: businessName ? businessName.trim() : undefined,
      routingMode: routingMode === "direct" ? "direct" : routingMode === "smart_filter" ? "smart_filter" : undefined,
      feedbackWhatsapp: cleanWhatsapp,
      webhookUrl: cleanWebhook,
      minGoogleRating: minGoogleRating ? Number(minGoogleRating) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Plate tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tautan Google Review berhasil diperbarui!",
      plate: updated,
    });
  } catch (err: unknown) {
    console.error("[Update Plate API Error]:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data plate." },
      { status: 500 }
    );
  }
}
