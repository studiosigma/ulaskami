import { NextRequest, NextResponse } from "next/server";
import { getPlateByCode } from "@/lib/db/plates";
import { getCurrentSession, isUserAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

  const plate = await getPlateByCode(code);
  if (!plate) {
    return NextResponse.json(
      { error: "Plate tidak ditemukan atau format kode salah." },
      { status: 404 }
    );
  }

  const session = await getCurrentSession();
  const isOwnerOrAdmin =
    session &&
    ((plate.ownerEmail && plate.ownerEmail.toLowerCase() === session.email.toLowerCase()) ||
      isUserAdmin(session.email));

  if (isOwnerOrAdmin) {
    return NextResponse.json({ plate });
  }

  // Sanitasi data untuk panggilan publik (misal: onboarding form di /activate)
  const sanitizedPlate = {
    code: plate.code,
    businessName: plate.businessName,
    googleReviewUrl: plate.googleReviewUrl,
    isActive: plate.isActive,
    routingMode: plate.routingMode,
    minGoogleRating: plate.minGoogleRating,
  };

  return NextResponse.json({ plate: sanitizedPlate });
}
