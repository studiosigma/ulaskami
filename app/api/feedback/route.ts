import { NextRequest, NextResponse } from "next/server";
import { saveCustomerFeedback, getFeedbacksByOwner, getPlateByCode } from "@/lib/db/plates";
import { getCurrentSession } from "@/lib/auth";
import { createOwnerAlertWhatsappLink } from "@/lib/utils/whatsapp";

/**
 * POST /api/feedback
 * Menerima masukan dari pelanggan (Smart Filter Rating 1-3)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plateCode, rating, feedbackText, customerName, customerPhone } = body;

    if (!plateCode || typeof plateCode !== "string") {
      return NextResponse.json(
        { error: "Kode plate fisik wajib diisi." },
        { status: 400 }
      );
    }

    if (!feedbackText || typeof feedbackText !== "string" || feedbackText.trim().length === 0) {
      return NextResponse.json(
        { error: "Isi masukan atau kritik wajib diisi." },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Skor rating tidak valid (harus 1 sampai 5)." },
        { status: 400 }
      );
    }

    // Ambil data plate untuk mendapatkan nomor WhatsApp pengelola toko
    const plate = await getPlateByCode(plateCode);
    if (!plate) {
      return NextResponse.json(
        { error: "Plate tidak ditemukan dalam sistem." },
        { status: 404 }
      );
    }

    // Simpan feedback & kirim webhook otomatis jika webhookUrl terkonfigurasi
    const feedback = await saveCustomerFeedback({
      plateCode,
      rating: numericRating,
      feedbackText: feedbackText.trim(),
      customerName: customerName ? String(customerName).trim() : undefined,
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
    });

    // Buat link WhatsApp notifikasi darurat langsung ke pengelola
    const ownerWhatsapp = plate.feedbackWhatsapp || "";
    const whatsappAlertUrl = createOwnerAlertWhatsappLink(ownerWhatsapp, {
      businessName: plate.businessName,
      plateCode: plate.code,
      rating: numericRating,
      feedbackText: feedbackText.trim(),
      customerName: customerName ? String(customerName).trim() : undefined,
      customerPhone: customerPhone ? String(customerPhone).trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      feedback,
      whatsappAlertUrl,
      notifiedViaWebhook: feedback.notifiedViaWebhook,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    console.error("[POST /api/feedback Error]:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/feedback
 * Mengambil seluruh masukan ulasan milik merchant yang sedang login
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterPlate = searchParams.get("plateCode");

    const feedbacks = await getFeedbacksByOwner(session.email);

    const filtered = filterPlate
      ? feedbacks.filter((f) => f.plateCode === filterPlate.toUpperCase().trim())
      : feedbacks;

    return NextResponse.json({
      success: true,
      feedbacks: filtered,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memuat feedback";
    console.error("[GET /api/feedback Error]:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
