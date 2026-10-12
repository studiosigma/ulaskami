import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { getPlateByCode, getPlateScanLogs } from "@/lib/db/plates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { code: rawCode } = await params;
    const code = decodeURIComponent(rawCode || "").trim().toUpperCase();

    const plate = await getPlateByCode(code);
    if (!plate) {
      return new NextResponse("Plate tidak ditemukan", { status: 404 });
    }

    if (plate.ownerEmail && plate.ownerEmail.toLowerCase() !== session.email.toLowerCase()) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const logs = await getPlateScanLogs(code);

    // Siapkan baris CSV
    const rows = [
      ["Log ID", "Kode Plate", "Tanggal (WIB)", "Jam (WIB)", "Kategori Perangkat", "User-Agent Header"],
      ...logs.map((log) => {
        const d = new Date(log.timestamp);
        // Konversi ke format tanggal & waktu lokal Indonesia
        const dateStr = d.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Jakarta",
        });
        const timeStr = d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        });

        const ua = log.userAgent || "";
        const deviceType = /iPhone|iPad|iPod/i.test(ua)
          ? "Apple iOS"
          : /Android/i.test(ua)
          ? "Google Android"
          : "Lainnya / Desktop";

        return [log.id, log.plateCode, dateStr, timeStr, deviceType, ua];
      }),
    ];

    function sanitizeCsvCell(value: unknown): string {
      let str = String(value ?? "");
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    }

    const csvContent = rows
      .map((row) => row.map(sanitizeCsvCell).join(","))
      .join("\n");

    const filename = `${code}_scan_logs_${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    console.error("[Export Scan Logs Route Error]:", err);
    return new NextResponse("Terjadi kesalahan saat mengekspor data", { status: 500 });
  }
}
