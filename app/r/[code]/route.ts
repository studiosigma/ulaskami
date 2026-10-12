import { NextRequest, NextResponse } from "next/server";
import { getPlateByCode, recordPlateScan } from "@/lib/db/plates";
import { validateGoogleReviewUrl } from "@/lib/utils/url";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

  // 1. Validasi format kode plate (harus ULK-XXXXXX)
  const codeRegex = /^ULK-[A-Z0-9]{6}$/i;
  if (!codeRegex.test(code)) {
    const errorUrl = new URL(`/activate?code=${encodeURIComponent(code)}&status=invalid`, request.url);
    return NextResponse.redirect(errorUrl, { status: 307 });
  }

  // 2. Ambil data plate
  const plate = await getPlateByCode(code);

  // 3. Jika plate ada dan sudah diaktifkan dengan URL Google Review
  if (plate && plate.isActive && plate.googleReviewUrl) {
    const urlValidation = validateGoogleReviewUrl(plate.googleReviewUrl);

    if (urlValidation.isValid && urlValidation.normalizedUrl) {
      // Catat hit scan secara asynchronous dengan proteksi anti-spam IP
      const userAgent = request.headers.get("user-agent") || undefined;
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        undefined;
      recordPlateScan(code, userAgent, clientIp).catch((err) => {
        console.error("[Ulaskami Scan Record Error]:", err);
      });

      // 3a. Jika plate menggunakan mode Smart Filter, arahkan ke Customer Feedback Gate
      if (plate.routingMode !== "direct") {
        const reviewGateUrl = new URL(`/review/${encodeURIComponent(code)}`, request.url);
        return NextResponse.redirect(reviewGateUrl, {
          status: 307,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
      }

      // 3b. Direct Mode: Langsung dialihkan ke Google Review URL
      return NextResponse.redirect(urlValidation.normalizedUrl, {
        status: 307,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }
  }

  // 4. Jika plate belum diaktifkan, arahkan ke onboarding aktivasi
  const activateUrl = new URL(
    `/activate?code=${encodeURIComponent(code)}&status=unactivated`,
    request.url
  );
  return NextResponse.redirect(activateUrl, { status: 307 });
}
