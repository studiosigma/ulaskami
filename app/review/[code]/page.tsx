import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getPlateByCode } from "@/lib/db/plates";
import { validateGoogleReviewUrl } from "@/lib/utils/url";
import ReviewGate from "@/components/review/ReviewGate";

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();
  const plate = await getPlateByCode(code);
  return {
    title: plate?.businessName ? `Ulas ${plate.businessName} - Ulaskami` : "Ulas Pengalaman Anda - Ulaskami",
    description: "Bagikan pengalaman kunjungan Anda bersama kami.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

  // Validasi format kode plate
  const codeRegex = /^ULK-[A-Z0-9]{6}$/i;
  if (!codeRegex.test(code)) {
    redirect(`/activate?code=${encodeURIComponent(code)}&status=invalid`);
  }

  const plate = await getPlateByCode(code);

  // Jika belum aktif, arahkan ke halaman aktivasi
  if (!plate || !plate.isActive || !plate.googleReviewUrl) {
    redirect(`/activate?code=${encodeURIComponent(code)}&status=unactivated`);
  }

  // Jika plate diset ke mode direct, langsung dialihkan ke URL Google Review
  if (plate.routingMode === "direct") {
    const urlValidation = validateGoogleReviewUrl(plate.googleReviewUrl);
    if (urlValidation.isValid && urlValidation.normalizedUrl) {
      redirect(urlValidation.normalizedUrl);
    }
  }

  return <ReviewGate plate={plate} />;
}
