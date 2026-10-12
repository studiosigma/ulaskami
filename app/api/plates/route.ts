import { NextResponse } from "next/server";
import { getPlatesByOwner, getDataLayerInfo } from "@/lib/db/plates";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const [plates, dataLayer] = await Promise.all([
      getPlatesByOwner(user.email),
      getDataLayerInfo(),
    ]);

    return NextResponse.json({ plates, user, dataLayer });
  } catch (err) {
    console.error("[Get Merchant Plates API Error]:", err);
    return NextResponse.json(
      { error: "Gagal memuat data plates merchant." },
      { status: 500 }
    );
  }
}
