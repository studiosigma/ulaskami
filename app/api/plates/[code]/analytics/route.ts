import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { getPlateByCode, getPlateAnalytics } from "@/lib/db/plates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sesi telah berakhir. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

    const plate = await getPlateByCode(code);
    if (!plate) {
      return NextResponse.json({ error: "Plate tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi kepemilikan plate
    if (plate.ownerEmail && plate.ownerEmail.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk melihat analitik plate ini." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const analytics = await getPlateAnalytics(code, days);
    if (!analytics) {
      return NextResponse.json({ error: "Gagal memproses analitik." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (err: unknown) {
    console.error("[Plate Analytics API Error]:", err);
    return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 });
  }
}
