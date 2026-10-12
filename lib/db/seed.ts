import { Plate } from "../types";
import { query, isDatabaseConfigured } from "./client";
import { getAllPlates } from "./plates";

/**
 * Menghasilkan serial plate kode berurutan (misal: ULK-000006 s/d ULK-000015)
 */
export function generatePlateCodes(startNum: number, count: number): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const numStr = String(startNum + i).padStart(6, "0");
    codes.push(`ULK-${numStr}`);
  }
  return codes;
}

/**
 * Menemukan nomor serial tertinggi yang sudah terdaftar
 */
export async function getHighestPlateNumber(): Promise<number> {
  if (isDatabaseConfigured()) {
    try {
      const res = await query<{ code: string }>(
        `SELECT code FROM plates ORDER BY code DESC LIMIT 1;`
      );
      if (res && res.rows.length > 0 && res.rows[0].code) {
        const match = res.rows[0].code.match(/ULK-(\d+)/i);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
    } catch (err) {
      console.error("[getHighestPlateNumber error]:", err);
    }
  }

  // Fallback ke in-memory store
  const allPlates = await getAllPlates();
  let max = 5;
  for (const p of allPlates) {
    const match = p.code.match(/ULK-(\d+)/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  return max;
}

/**
 * Menambahkan batch serial plate fisik baru ke database inventori
 */
export async function registerNewPlateBatch(codes: string[]): Promise<Plate[]> {
  const createdPlates: Plate[] = [];
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    for (const code of codes) {
      const clean = code.trim().toUpperCase();
      const id = `plate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await query(
        `
        INSERT INTO plates (id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, min_google_rating, created_at, updated_at)
        VALUES ($1, $2, '', '', false, 0, 'smart_filter', '', 4, NOW(), NOW())
        ON CONFLICT (code) DO NOTHING;
      `,
        [id, clean]
      );
      createdPlates.push({
        id,
        code: clean,
        businessName: "",
        googleReviewUrl: "",
        isActive: false,
        scanCount: 0,
        routingMode: "smart_filter",
        feedbackWhatsapp: "",
        minGoogleRating: 4,
        createdAt: now,
        updatedAt: now,
      });
    }
  } else {
    // In-memory fallback
    if (!globalThis.__ulaskami_plates_store__) {
      await getAllPlates();
    }
    const store = globalThis.__ulaskami_plates_store__ || {};
    for (const code of codes) {
      const clean = code.trim().toUpperCase();
      const id = `plate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newPlate: Plate = {
        id,
        code: clean,
        businessName: "",
        googleReviewUrl: "",
        isActive: false,
        scanCount: 0,
        routingMode: "smart_filter",
        feedbackWhatsapp: "",
        minGoogleRating: 4,
        createdAt: now,
        updatedAt: now,
      };
      store[clean] = newPlate;
      createdPlates.push(newPlate);
    }
  }

  return createdPlates;
}
