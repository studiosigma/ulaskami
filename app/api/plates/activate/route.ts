import { NextRequest, NextResponse } from "next/server";
import { activatePlate, getPlateByCode } from "@/lib/db/plates";
import { validateGoogleReviewUrl } from "@/lib/utils/url";
import { getCurrentSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await request.json();
    const { code, businessName, googleReviewUrl, ownerEmail } = body;

    if (!code || !businessName || !googleReviewUrl) {
      return NextResponse.json(
        { error: "Kode plate, nama bisnis, dan tautan Google Review wajib diisi." },
        { status: 400 }
      );
    }

    const regex = /^ULK-[A-Z0-9]{6}$/i;
    if (!regex.test(code.trim())) {
      return NextResponse.json(
        { error: "Format kode plate tidak valid. Contoh format: ULK-000001" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await getPlateByCode(cleanCode);
    const effectiveEmail = session ? session.email : ownerEmail ? ownerEmail.trim().toLowerCase() : undefined;

    // Proteksi Anti-Hijacking: jika plate sudah aktif dan memiliki pemilik berbeda, tolak
    if (
      existing &&
      existing.isActive &&
      existing.ownerEmail &&
      effectiveEmail &&
      existing.ownerEmail.toLowerCase() !== effectiveEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Plate ini sudah aktif dan terdaftar pada akun merchant lain." },
        { status: 400 }
      );
    }

    const urlValidation = validateGoogleReviewUrl(googleReviewUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: urlValidation.error || "Tautan Google Review tidak valid." },
        { status: 400 }
      );
    }

    const activatedPlate = await activatePlate({
      code: cleanCode,
      businessName: businessName.trim(),
      googleReviewUrl: urlValidation.normalizedUrl || googleReviewUrl.trim(),
      routingMode: body.routingMode || "smart_filter",
      feedbackWhatsapp: body.feedbackWhatsapp || "",
      ownerEmail: effectiveEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Plate berhasil diaktivasi!",
      plate: activatedPlate,
    });
  } catch (err: unknown) {
    console.error("[Activation API Error]:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat mengaktivasi plate." },
      { status: 500 }
    );
  }
}
