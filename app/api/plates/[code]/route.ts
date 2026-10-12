import { NextRequest, NextResponse } from "next/server";
import { getPlateByCode } from "@/lib/db/plates";

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

  return NextResponse.json({ plate });
}
