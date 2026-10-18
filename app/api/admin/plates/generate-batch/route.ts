import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, isUserAdmin } from "@/lib/auth";
import { generatePlateCodes, getHighestPlateNumber, registerNewPlateBatch } from "@/lib/db/seed";

export async function POST(request: NextRequest) {
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
        { error: "Akses ditolak. Fitur Batch Generator hanya dapat diakses oleh administrator resmi." },
        { status: 403 }
      );
    }

    const body = await request.json();
    let count = parseInt(body.count || 10, 10);
    if (isNaN(count) || count < 1) count = 10;
    if (count > 100) count = 100; // batas wajar per batch

    let startNum = body.startNum ? parseInt(body.startNum, 10) : undefined;
    if (!startNum || isNaN(startNum) || startNum < 1) {
      const highest = await getHighestPlateNumber();
      startNum = highest + 1;
    }

    const codes = generatePlateCodes(startNum, count);
    const createdPlates = await registerNewPlateBatch(codes);

    // Siapkan data CSV untuk mesin writer NFC / vendor cetak
    const origin = request.nextUrl.origin || "https://ulaskami.id";
    const csvRows = [
      ["Serial Code", "Activation URL", "NFC Payload Tap URL", "Status"],
      ...createdPlates.map((p) => [
        p.code,
        `${origin}/activate?code=${p.code}`,
        `${origin}/r/${p.code}`,
        "Unactivated (Ready for Production)",
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    return NextResponse.json({
      success: true,
      count: createdPlates.length,
      startCode: codes[0],
      endCode: codes[codes.length - 1],
      plates: createdPlates,
      csvContent,
    });
  } catch (err: unknown) {
    console.error("[Batch Generation API Error]:", err);
    return NextResponse.json(
      { error: "Gagal membuat batch serial plate." },
      { status: 500 }
    );
  }
}
