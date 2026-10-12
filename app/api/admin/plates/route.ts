import { NextResponse } from "next/server";
import { getCurrentSession, isUserAdmin } from "@/lib/auth";
import { getAllPlates, getDataLayerInfo } from "@/lib/db/plates";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sesi tidak sah. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    if (!isUserAdmin(session.email)) {
      return NextResponse.json(
        { error: "Akses ditolak. Halaman ini hanya untuk Administrator Resmi." },
        { status: 403 }
      );
    }

    const [plates, dataLayer] = await Promise.all([
      getAllPlates(),
      getDataLayerInfo(),
    ]);

    const totalPlates = plates.length;
    const activePlates = plates.filter((p) => p.isActive).length;
    const unactivatedPlates = plates.filter((p) => !p.isActive).length;
    const totalScans = plates.reduce((sum, p) => sum + (p.scanCount || 0), 0);
    const uniqueOwners = Array.from(
      new Set(plates.map((p) => p.ownerEmail).filter(Boolean))
    ).length;

    return NextResponse.json({
      success: true,
      user: session,
      dataLayer,
      stats: {
        totalPlates,
        activePlates,
        unactivatedPlates,
        totalScans,
        uniqueOwners,
      },
      plates,
    });
  } catch (err) {
    console.error("[Admin Get All Plates API Error]:", err);
    return NextResponse.json(
      { error: "Gagal memuat data inventaris plate admin." },
      { status: 500 }
    );
  }
}
