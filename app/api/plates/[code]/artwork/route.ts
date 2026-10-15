import { NextRequest, NextResponse } from "next/server";
import { getPlateByCode } from "@/lib/db/plates";
import { generatePlateSvg, ArtworkStyle, ArtworkFormat } from "@/lib/utils/artwork";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

    const plate = await getPlateByCode(code);
    if (!plate) {
      return new NextResponse("Plate tidak ditemukan", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const style = (searchParams.get("style") as ArtworkStyle) || "google_color_badge";
    const format = (searchParams.get("format") as ArtworkFormat) || "square_100";
    const includeCropMarks = searchParams.get("cropMarks") === "true";
    const businessNameOverride = searchParams.get("businessName") || plate.businessName;

    const origin = request.nextUrl.origin || "https://ulaskami.id";

    const svgString = await generatePlateSvg({
      code,
      businessName: businessNameOverride,
      baseUrl: origin,
      style,
      format,
      includeCropMarks,
    });

    const isDownload =
      searchParams.get("download") === "true" || searchParams.get("download") === "1";
    const filename = `${code}_${style}_${format}.svg`;

    const headers: Record<string, string> = {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    };

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(svgString, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    console.error("[Artwork Route Error]:", err);
    return new NextResponse("Terjadi kesalahan saat menghasilkan desain SVG", { status: 500 });
  }
}
