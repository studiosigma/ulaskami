import {
  Plate,
  ScanLog,
  ActivatePlateInput,
  UpdatePlateInput,
  MerchantRecord,
  RoutingMode,
  PlateAnalytics,
  DailyScanPoint,
  HourlyPeakPoint,
  DeviceBreakdown,
  FeedbackRecord,
  CreateFeedbackInput,
  FeedbackStatus,
} from "../types";
import { query, isDatabaseConfigured } from "./client";
import { initDatabaseSchema, INITIAL_PLATES_SEED, INITIAL_DEMO_MERCHANT } from "./schema";
import { hashPassword } from "../auth";
import { dispatchFeedbackWebhook } from "../utils/webhook";

interface PlateDbRow {
  id: string;
  code: string;
  business_name: string;
  google_review_url: string;
  is_active: boolean;
  scan_count: number;
  routing_mode?: string;
  feedback_whatsapp?: string;
  webhook_url?: string;
  min_google_rating?: number;
  owner_email: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface FeedbackDbRow {
  id: string;
  plate_code: string;
  business_name: string;
  rating: number;
  feedback_text: string;
  customer_name: string | null;
  customer_phone: string | null;
  status: string;
  notified_via_webhook: boolean;
  webhook_response_status: number | null;
  created_at: Date | string;
}

interface MerchantDbRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
  created_at: Date | string;
  updated_at: Date | string;
}

function mapRowToPlate(row: PlateDbRow): Plate {
  return {
    id: row.id,
    code: row.code,
    businessName: row.business_name || "",
    googleReviewUrl: row.google_review_url || "",
    isActive: Boolean(row.is_active),
    scanCount: Number(row.scan_count || 0),
    routingMode: (row.routing_mode as RoutingMode) || "smart_filter",
    feedbackWhatsapp: row.feedback_whatsapp || "",
    webhookUrl: row.webhook_url || "",
    minGoogleRating: Number(row.min_google_rating || 4),
    ownerEmail: row.owner_email || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapRowToFeedback(row: FeedbackDbRow): FeedbackRecord {
  return {
    id: row.id,
    plateCode: row.plate_code,
    businessName: row.business_name || "",
    rating: Number(row.rating),
    feedbackText: row.feedback_text || "",
    customerName: row.customer_name || undefined,
    customerPhone: row.customer_phone || undefined,
    status: (row.status as FeedbackStatus) || "unread",
    notifiedViaWebhook: Boolean(row.notified_via_webhook),
    webhookResponseStatus: row.webhook_response_status || undefined,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapRowToMerchant(row: MerchantDbRow): MerchantRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// In-Memory store pre-seeded from INITIAL_PLATES_SEED for local dev / fallback
function createInitialStore(): Record<string, Plate> {
  const store: Record<string, Plate> = {};
  const now = new Date().toISOString();

  for (const item of INITIAL_PLATES_SEED) {
    store[item.code] = {
      id: item.id,
      code: item.code,
      businessName: item.businessName,
      googleReviewUrl: item.googleReviewUrl,
      isActive: item.isActive,
      scanCount: item.scanCount,
      routingMode: item.routingMode || "smart_filter",
      feedbackWhatsapp: item.feedbackWhatsapp || "",
      webhookUrl: (item as unknown as { webhookUrl?: string }).webhookUrl || "",
      minGoogleRating: item.minGoogleRating || 4,
      ownerEmail: item.ownerEmail,
      createdAt: item.isActive ? new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() : now,
      updatedAt: now,
    };
  }
  return store;
}

const INITIAL_DEMO_FEEDBACKS: FeedbackRecord[] = [
  {
    id: "fb-001",
    plateCode: "ULK-000001",
    businessName: "Kopi Kenangan Senopati (Demo)",
    rating: 2,
    feedbackText: "Waktu tunggu es kopi kenangan mantan agak lama di jam istirahat siang, kasir ramah tapi antrean barista menumpuk.",
    customerName: "Rian Pratama",
    customerPhone: "081298765432",
    status: "unread",
    notifiedViaWebhook: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "fb-002",
    plateCode: "ULK-000001",
    businessName: "Kopi Kenangan Senopati (Demo)",
    rating: 3,
    feedbackText: "Suasana nyaman tapi AC di lantai 2 agak kurang dingin saat matahari terik.",
    customerName: "Maya Putri",
    customerPhone: "081234567891",
    status: "resolved",
    notifiedViaWebhook: true,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
];

function createInitialMerchantStore(): Record<string, MerchantRecord> {
  const { hash, salt } = hashPassword(INITIAL_DEMO_MERCHANT.passwordPlain);
  const now = new Date().toISOString();
  return {
    [INITIAL_DEMO_MERCHANT.email.toLowerCase()]: {
      id: INITIAL_DEMO_MERCHANT.id,
      name: INITIAL_DEMO_MERCHANT.name,
      email: INITIAL_DEMO_MERCHANT.email.toLowerCase(),
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: now,
      updatedAt: now,
    },
  };
}

declare global {
  var __ulaskami_plates_store__: Record<string, Plate> | undefined;
  var __ulaskami_scans_store__: ScanLog[] | undefined;
  var __ulaskami_merchants_store__: Record<string, MerchantRecord> | undefined;
  var __ulaskami_feedbacks_store__: FeedbackRecord[] | undefined;
}

function getFeedbackStore(): FeedbackRecord[] {
  if (!globalThis.__ulaskami_feedbacks_store__) {
    globalThis.__ulaskami_feedbacks_store__ = [...INITIAL_DEMO_FEEDBACKS];
  }
  return globalThis.__ulaskami_feedbacks_store__;
}

function getMemoryStore(): Record<string, Plate> {
  if (!globalThis.__ulaskami_plates_store__) {
    globalThis.__ulaskami_plates_store__ = createInitialStore();
  }
  return globalThis.__ulaskami_plates_store__;
}

function createInitialScansStore(): ScanLog[] {
  const logs: ScanLog[] = [];
  const demoCode = "ULK-000001";
  const now = Date.now();

  const userAgents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.122 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.165 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  ];

  // Bobot jam makan siang (12-14) dan malam (18-21) yang realistis untuk kafe/resto
  const peakHours = [12, 12, 13, 13, 13, 14, 18, 19, 19, 20, 20, 21, 10, 11, 15, 16, 17];

  for (let i = 0; i < 128; i++) {
    // Tersebar di 14 hari terakhir
    const dayOffset = (i * 7 + 3) % 14;
    const hour = peakHours[(i * 3 + 5) % peakHours.length];
    const minute = (i * 13 + 17) % 60;
    const second = (i * 23 + 41) % 60;

    const logDate = new Date(now - dayOffset * 24 * 60 * 60 * 1000);
    logDate.setHours(hour, minute, second, 0);

    // 60% iPhone, 35% Android, 5% desktop/other
    const uaIdx = i % 10 < 6 ? (i % 2 === 0 ? 0 : 1) : i % 20 === 19 ? 4 : (i % 2 === 0 ? 2 : 3);

    logs.push({
      id: `scan-seed-${1000 + i}`,
      plateCode: demoCode,
      userAgent: userAgents[uaIdx],
      ipHash: `hash-${(100000 + i * 31).toString(36)}`,
      timestamp: logDate.toISOString(),
    });
  }

  // Urutkan kronologis
  logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return logs;
}

function getScansStore(): ScanLog[] {
  if (!globalThis.__ulaskami_scans_store__) {
    globalThis.__ulaskami_scans_store__ = createInitialScansStore();
  }
  return globalThis.__ulaskami_scans_store__;
}

function getMerchantsStore(): Record<string, MerchantRecord> {
  if (!globalThis.__ulaskami_merchants_store__) {
    globalThis.__ulaskami_merchants_store__ = createInitialMerchantStore();
  }
  return globalThis.__ulaskami_merchants_store__;
}

/**
 * Mengambil plate berdasarkan kode unik (e.g. ULK-000001)
 * Menolak kode liar yang tidak terdaftar dalam inventori resmi.
 */
export async function getPlateByCode(rawCode: string): Promise<Plate | null> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return null;

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<PlateDbRow>(
        `SELECT id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, webhook_url, min_google_rating, owner_email, created_at, updated_at
         FROM plates WHERE code = $1 LIMIT 1;`,
        [code]
      );
      if (res && res.rows.length > 0) {
        return mapRowToPlate(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.error("[getPlateByCode PostgreSQL Error, falling back to memory]:", err);
    }
  }

  // Fallback memory store: hanya kembalikan jika kode memang ada dalam inventori resmi
  const store = getMemoryStore();
  return store[code] || null;
}

const scanCooldownMap = new Map<string, number>();

/**
 * Mencatat penambahan scan count & log device dengan proteksi rate limit spam
 */
export async function recordPlateScan(
  rawCode: string,
  userAgent?: string,
  ipHash?: string
): Promise<void> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return;

  // Proteksi Debounce/Anti-Spam: Cegah spam hit bertubi-tubi dalam jeda < 2 detik untuk IP/kode yang sama
  const spamKey = `${code}:${ipHash || userAgent || "anon"}`;
  const now = Date.now();
  const lastScanTime = scanCooldownMap.get(spamKey);
  if (lastScanTime && now - lastScanTime < 2000) {
    return;
  }
  scanCooldownMap.set(spamKey, now);

  // Bersihkan cache map lama jika melebihi batas 1000 entri
  if (scanCooldownMap.size > 1000) {
    for (const [k, timestamp] of scanCooldownMap.entries()) {
      if (now - timestamp > 60000) {
        scanCooldownMap.delete(k);
      }
    }
  }

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      await query(
        `UPDATE plates SET scan_count = scan_count + 1, updated_at = NOW() WHERE code = $1;`,
        [code]
      );
      const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await query(
        `INSERT INTO scan_logs (id, plate_code, user_agent, ip_hash, timestamp) VALUES ($1, $2, $3, $4, NOW());`,
        [scanId, code, userAgent || null, ipHash || null]
      );
      return;
    } catch (err) {
      console.error("[recordPlateScan PostgreSQL Error, falling back to memory]:", err);
    }
  }

  // Fallback memory store dengan proteksi memori (maksimal 500 log)
  const store = getMemoryStore();
  const plate = store[code];

  if (plate) {
    plate.scanCount += 1;
    plate.updatedAt = new Date().toISOString();

    const scans = getScansStore();
    scans.push({
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      plateCode: code,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    // Batasi ukuran log di memori agar tidak memicu memory leak
    while (scans.length > 500) {
      scans.shift();
    }
  }
}

/**
 * Mengaktifkan plate baru (dengan proteksi Anti-Hijacking)
 */
export async function activatePlate(
  input: ActivatePlateInput
): Promise<Plate> {
  const code = input.code.trim().toUpperCase();
  const businessName = input.businessName.trim();
  const googleReviewUrl = input.googleReviewUrl.trim();
  const routingMode = input.routingMode || "smart_filter";
  const feedbackWhatsapp = input.feedbackWhatsapp?.trim() || "";
  const minGoogleRating = Number(input.minGoogleRating || 4);
  const ownerEmail = input.ownerEmail?.trim().toLowerCase() || null;
  const webhookUrl = input.webhookUrl?.trim() || "";

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      // Periksa apakah plate sudah ada di inventori
      const existing = await query<PlateDbRow>(
        `SELECT id, is_active, owner_email FROM plates WHERE code = $1 LIMIT 1;`,
        [code]
      );

      if (existing && existing.rows.length > 0) {
        const existingPlate = existing.rows[0];
        // Proteksi Anti-Hijacking: jika plate sudah aktif, cegah penimpaan oleh anonim atau merchant lain
        if (existingPlate.is_active) {
          if (!ownerEmail) {
            throw new Error("Plate ini sudah aktif. Masuk ke akun merchant pemilik untuk mengubah konfigurasi.");
          }
          if (existingPlate.owner_email && existingPlate.owner_email.toLowerCase() !== ownerEmail) {
            throw new Error("Plate ini sudah aktif dan dimiliki oleh akun merchant lain.");
          }
        }

        const updateRes = await query<PlateDbRow>(
          `UPDATE plates
           SET business_name = $1, google_review_url = $2, is_active = true, owner_email = COALESCE($3, owner_email),
               routing_mode = $4, feedback_whatsapp = $5, min_google_rating = $6, webhook_url = $7, updated_at = NOW()
           WHERE code = $8
           RETURNING *;`,
          [businessName, googleReviewUrl, ownerEmail, routingMode, feedbackWhatsapp, minGoogleRating, webhookUrl, code]
        );
        return mapRowToPlate(updateRes!.rows[0]);
      } else {
        const newId = `plate-${Date.now()}`;
        const insertRes = await query<PlateDbRow>(
          `INSERT INTO plates (id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, min_google_rating, owner_email, webhook_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, true, 0, $5, $6, $7, $8, $9, NOW(), NOW())
           RETURNING *;`,
          [newId, code, businessName, googleReviewUrl, routingMode, feedbackWhatsapp, minGoogleRating, ownerEmail, webhookUrl]
        );
        return mapRowToPlate(insertRes!.rows[0]);
      }
    } catch (err) {
      console.error("[activatePlate PostgreSQL Error, falling back to memory]:", err);
      if (err instanceof Error && err.message.includes("sudah aktif")) {
        throw err;
      }
    }
  }

  // Fallback memory store
  const store = getMemoryStore();
  const now = new Date().toISOString();
  let plate = store[code];

  if (plate && plate.isActive) {
    if (!ownerEmail) {
      throw new Error("Plate ini sudah aktif. Masuk ke akun merchant pemilik untuk mengubah konfigurasi.");
    }
    if (plate.ownerEmail && plate.ownerEmail.toLowerCase() !== ownerEmail) {
      throw new Error("Plate ini sudah aktif dan dimiliki oleh akun merchant lain.");
    }
  }

  if (!plate) {
    plate = {
      id: `plate-${Date.now()}`,
      code,
      businessName,
      googleReviewUrl,
      isActive: true,
      scanCount: 0,
      routingMode,
      feedbackWhatsapp,
      webhookUrl,
      minGoogleRating,
      ownerEmail: ownerEmail || undefined,
      createdAt: now,
      updatedAt: now,
    };
  } else {
    plate.businessName = businessName;
    plate.googleReviewUrl = googleReviewUrl;
    plate.isActive = true;
    plate.routingMode = routingMode;
    plate.feedbackWhatsapp = feedbackWhatsapp;
    plate.webhookUrl = webhookUrl;
    plate.minGoogleRating = minGoogleRating;
    if (ownerEmail) {
      plate.ownerEmail = ownerEmail;
    }
    plate.updatedAt = now;
  }

  store[code] = plate;
  return plate;
}

/**
 * Memperbarui link Google Review dan konfigurasi routing plate yang sudah aktif
 */
export async function updatePlateUrl(
  input: UpdatePlateInput
): Promise<Plate | null> {
  const code = input.code.trim().toUpperCase();
  const googleReviewUrl = input.googleReviewUrl.trim();
  const businessName = input.businessName?.trim() || null;
  const routingMode = input.routingMode || null;
  const feedbackWhatsapp = input.feedbackWhatsapp !== undefined ? input.feedbackWhatsapp.trim() : null;
  const webhookUrl = input.webhookUrl !== undefined ? input.webhookUrl.trim() : null;
  const minGoogleRating = input.minGoogleRating !== undefined ? Number(input.minGoogleRating) : null;

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<PlateDbRow>(
        `UPDATE plates
         SET google_review_url = $1,
             business_name = COALESCE($2, business_name),
             routing_mode = COALESCE($3, routing_mode),
             feedback_whatsapp = COALESCE($4, feedback_whatsapp),
             min_google_rating = COALESCE($5, min_google_rating),
             webhook_url = COALESCE($6, webhook_url),
             updated_at = NOW()
         WHERE code = $7
         RETURNING *;`,
        [googleReviewUrl, businessName, routingMode, feedbackWhatsapp, minGoogleRating, webhookUrl, code]
      );
      if (res && res.rows.length > 0) {
        return mapRowToPlate(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.error("[updatePlateUrl PostgreSQL Error, falling back to memory]:", err);
    }
  }

  // Fallback memory store
  const store = getMemoryStore();
  const plate = store[code];

  if (!plate) {
    return null;
  }

  plate.googleReviewUrl = googleReviewUrl;
  if (businessName) {
    plate.businessName = businessName;
  }
  if (input.routingMode) {
    plate.routingMode = input.routingMode;
  }
  if (input.feedbackWhatsapp !== undefined) {
    plate.feedbackWhatsapp = input.feedbackWhatsapp;
  }
  if (input.webhookUrl !== undefined) {
    plate.webhookUrl = input.webhookUrl;
  }
  if (input.minGoogleRating !== undefined) {
    plate.minGoogleRating = input.minGoogleRating;
  }
  plate.updatedAt = new Date().toISOString();

  return plate;
}

/**
 * Mengambil semua plate untuk kebutuhan audit / admin internal
 */
export async function getAllPlates(): Promise<Plate[]> {
  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<PlateDbRow>(
        `SELECT id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, webhook_url, min_google_rating, owner_email, created_at, updated_at
         FROM plates
         ORDER BY created_at ASC;`
      );
      if (res && res.rows.length > 0) {
        return res.rows.map(mapRowToPlate);
      }
    } catch (err) {
      console.error("[getAllPlates PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const store = getMemoryStore();
  return Object.values(store);
}

/**
 * Mengambil plate hanya milik akun merchant tertentu (Multi-Tenancy Isolation)
 */
export async function getPlatesByOwner(ownerEmail: string): Promise<Plate[]> {
  const cleanEmail = (ownerEmail || "").trim().toLowerCase();
  if (!cleanEmail) return [];

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<PlateDbRow>(
        `SELECT id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, webhook_url, min_google_rating, owner_email, created_at, updated_at
         FROM plates
         WHERE LOWER(owner_email) = $1
         ORDER BY created_at ASC;`,
        [cleanEmail]
      );
      if (res) {
        return res.rows.map(mapRowToPlate);
      }
    } catch (err) {
      console.error("[getPlatesByOwner PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const store = getMemoryStore();
  return Object.values(store).filter(
    (p) => p.ownerEmail && p.ownerEmail.toLowerCase() === cleanEmail
  );
}

/**
 * Mencari merchant berdasarkan email
 */
export async function findMerchantByEmail(email: string): Promise<MerchantRecord | null> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) return null;

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<MerchantDbRow>(
        `SELECT id, name, email, password_hash, password_salt, created_at, updated_at
         FROM merchants
         WHERE LOWER(email) = $1
         LIMIT 1;`,
        [cleanEmail]
      );
      if (res && res.rows.length > 0) {
        return mapRowToMerchant(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.error("[findMerchantByEmail PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const store = getMerchantsStore();
  return store[cleanEmail] || null;
}

/**
 * Mendaftarkan akun merchant baru
 */
export async function createMerchant(data: {
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}): Promise<MerchantRecord> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.name.trim();
  const id = `merchant-${Date.now()}`;
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<MerchantDbRow>(
        `INSERT INTO merchants (id, name, email, password_hash, password_salt, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *;`,
        [id, cleanName, cleanEmail, data.passwordHash, data.passwordSalt]
      );
      if (res && res.rows.length > 0) {
        return mapRowToMerchant(res.rows[0]);
      }
    } catch (err) {
      console.error("[createMerchant PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const store = getMerchantsStore();
  const merchant: MerchantRecord = {
    id,
    name: cleanName,
    email: cleanEmail,
    passwordHash: data.passwordHash,
    passwordSalt: data.passwordSalt,
    createdAt: now,
    updatedAt: now,
  };
  store[cleanEmail] = merchant;
  return merchant;
}

/**
 * Informasi status data layer untuk visualisasi dashboard
 */
export async function getDataLayerInfo(): Promise<{
  mode: "postgres" | "memory";
  databaseUrlConfigured: boolean;
  label: string;
}> {
  const isConfigured = isDatabaseConfigured();
  let label = "In-Memory Hybrid (Safe Fallback)";
  if (isConfigured) {
    const url = process.env.DATABASE_URL || "";
    if (url.includes("neon.tech")) label = "Neon PostgreSQL Cloud";
    else if (url.includes("supabase.co") || url.includes("supabase.com")) label = "Supabase PostgreSQL Cloud";
    else if (url.includes("paas.id")) label = "PaaS.ID PostgreSQL Cloud";
    else label = "PostgreSQL Cloud Database";
  }
  return {
    mode: isConfigured ? "postgres" : "memory",
    databaseUrlConfigured: isConfigured,
    label,
  };
}

const INDONESIA_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/**
 * Mengambil seluruh catatan riwayat scan untuk plate tertentu
 */
export async function getPlateScanLogs(rawCode: string): Promise<ScanLog[]> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return [];

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<{
        id: string;
        plate_code: string;
        user_agent: string | null;
        ip_hash: string | null;
        timestamp: Date | string;
      }>(
        `SELECT id, plate_code, user_agent, ip_hash, timestamp
         FROM scan_logs
         WHERE plate_code = $1
         ORDER BY timestamp DESC;`,
        [code]
      );
      if (res && res.rows) {
        return res.rows.map((r) => ({
          id: r.id,
          plateCode: r.plate_code,
          userAgent: r.user_agent || undefined,
          ipHash: r.ip_hash || undefined,
          timestamp: new Date(r.timestamp).toISOString(),
        }));
      }
    } catch (err) {
      console.error("[getPlateScanLogs PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const scans = getScansStore();
  return scans
    .filter((s) => s.plateCode.toUpperCase() === code)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Mengambil ringkasan analitik cerdas untuk plate (tren harian, deteksi jam sibuk, dan breakdown perangkat)
 */
export async function getPlateAnalytics(
  rawCode: string,
  daysRange: number = 30
): Promise<PlateAnalytics | null> {
  const code = (rawCode || "").trim().toUpperCase();
  const plate = await getPlateByCode(code);
  if (!plate) return null;

  const logs = await getPlateScanLogs(code);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let scansLast7Days = 0;
  let scansLast30Days = 0;

  // 1. Device counters
  let ios = 0;
  let android = 0;
  let other = 0;

  // 2. Hourly counters (0 - 23)
  const hourlyCounts = new Array(24).fill(0);

  // 3. Daily map for the requested range (e.g. 7 or 30 days)
  const dailyMap: Record<string, number> = {};
  const rangeLimit = Math.min(Math.max(daysRange, 7), 30);

  for (let i = rangeLimit - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
    dailyMap[dateKey] = 0;
  }

  for (const log of logs) {
    const logDate = new Date(log.timestamp);

    if (logDate >= sevenDaysAgo) scansLast7Days++;
    if (logDate >= thirtyDaysAgo) scansLast30Days++;

    // User Agent classification
    const ua = log.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) {
      ios++;
    } else if (/Android/i.test(ua)) {
      android++;
    } else {
      other++;
    }

    // Hourly distribution (0 - 23)
    const hour = logDate.getHours();
    if (hour >= 0 && hour <= 23) {
      hourlyCounts[hour]++;
    }

    // Daily distribution
    const dateKey = logDate.toISOString().split("T")[0];
    if (dailyMap[dateKey] !== undefined) {
      dailyMap[dateKey]++;
    }
  }

  // Format DailyScanPoints
  const dailyTrends: DailyScanPoint[] = Object.keys(dailyMap).map((dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    const dayName = INDONESIA_DAYS[d.getDay()] || "";
    const dayLabel = `${dayName} ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
    return {
      date: dateKey,
      dayLabel,
      count: dailyMap[dateKey] || 0,
    };
  });

  // Calculate HourlyPeaks & Busiest Hour
  let maxHourCount = 0;
  let busiestHour = 13; // default 13:00

  for (let h = 0; h < 24; h++) {
    if (hourlyCounts[h] > maxHourCount) {
      maxHourCount = hourlyCounts[h];
      busiestHour = h;
    }
  }

  const hourlyPeaks: HourlyPeakPoint[] = hourlyCounts.map((count, hour) => ({
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    count,
    isPeak: maxHourCount > 0 && count >= Math.max(2, maxHourCount * 0.7),
  }));

  const totalLogs = logs.length;
  const totalScans = Math.max(plate.scanCount, totalLogs);
  const validTotal = totalLogs > 0 ? totalLogs : 1;

  const iosPercentage = Math.round((ios / validTotal) * 100);
  const androidPercentage = Math.round((android / validTotal) * 100);
  const otherPercentage = Math.max(0, 100 - iosPercentage - androidPercentage);

  const deviceBreakdown: DeviceBreakdown = {
    ios,
    android,
    other,
    total: totalLogs,
    iosPercentage,
    androidPercentage,
    otherPercentage,
  };

  const averageDailyScans = Math.round(scansLast7Days / 7) || Math.round(totalScans / 30) || 0;

  return {
    plateCode: plate.code,
    businessName: plate.businessName || "Bisnis Anda",
    totalScans,
    scansLast7Days,
    scansLast30Days,
    averageDailyScans,
    dailyTrends,
    hourlyPeaks,
    busiestHour: {
      hour: busiestHour,
      label: `${String(busiestHour).padStart(2, "0")}:00`,
      count: maxHourCount,
    },
    deviceBreakdown,
  };
}

/**
 * Menyimpan masukan/komplain privat dari Smart Review Filter (Rating 1-3)
 * Sekaligus mendispatch notifikasi webhook otomatis jika plate memiliki webhookUrl
 */
export async function saveCustomerFeedback(
  input: CreateFeedbackInput
): Promise<FeedbackRecord> {
  const plateCode = input.plateCode.trim().toUpperCase();
  const rating = Math.max(1, Math.min(5, Number(input.rating)));
  const feedbackText = input.feedbackText.trim();
  const customerName = input.customerName?.trim() || "";
  const customerPhone = input.customerPhone?.trim() || "";
  const newId = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Ambil data plate untuk mendapatkan nama bisnis & webhookUrl
  const plate = await getPlateByCode(plateCode);
  const businessName = plate?.businessName || "Bisnis Kami";

  const feedbackRecord: FeedbackRecord = {
    id: newId,
    plateCode,
    businessName,
    rating,
    feedbackText,
    customerName: customerName || undefined,
    customerPhone: customerPhone || undefined,
    status: "unread",
    notifiedViaWebhook: false,
    createdAt: now,
  };

  // Dispatch webhook otomatis jika plate terpasang webhookUrl
  if (plate?.webhookUrl) {
    try {
      const webhookRes = await dispatchFeedbackWebhook(plate.webhookUrl, feedbackRecord);
      feedbackRecord.notifiedViaWebhook = webhookRes.success;
      feedbackRecord.webhookResponseStatus = webhookRes.statusCode;
    } catch (whErr) {
      console.error("[Webhook Dispatch Error]:", whErr);
    }
  }

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const insertRes = await query<FeedbackDbRow>(
        `INSERT INTO feedbacks (
          id, plate_code, business_name, rating, feedback_text, customer_name, customer_phone,
          status, notified_via_webhook, webhook_response_status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *;`,
        [
          feedbackRecord.id,
          feedbackRecord.plateCode,
          feedbackRecord.businessName,
          feedbackRecord.rating,
          feedbackRecord.feedbackText,
          customerName || null,
          customerPhone || null,
          feedbackRecord.status,
          feedbackRecord.notifiedViaWebhook,
          feedbackRecord.webhookResponseStatus || null,
        ]
      );
      if (insertRes && insertRes.rows.length > 0) {
        return mapRowToFeedback(insertRes.rows[0]);
      }
    } catch (err) {
      console.error("[saveCustomerFeedback PostgreSQL Error, falling back to memory]:", err);
    }
  }

  // Fallback memory store
  const feedbacks = getFeedbackStore();
  feedbacks.unshift(feedbackRecord);
  return feedbackRecord;
}

/**
 * Mengambil daftar masukan/komplain berdasarkan kode plate
 */
export async function getFeedbacksByPlate(plateCode: string): Promise<FeedbackRecord[]> {
  const cleanCode = plateCode.trim().toUpperCase();
  if (!cleanCode) return [];

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<FeedbackDbRow>(
        `SELECT id, plate_code, business_name, rating, feedback_text, customer_name, customer_phone,
                status, notified_via_webhook, webhook_response_status, created_at
         FROM feedbacks
         WHERE plate_code = $1
         ORDER BY created_at DESC;`,
        [cleanCode]
      );
      if (res) {
        return res.rows.map(mapRowToFeedback);
      }
    } catch (err) {
      console.error("[getFeedbacksByPlate PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const feedbacks = getFeedbackStore();
  return feedbacks.filter((f) => f.plateCode === cleanCode);
}

/**
 * Mengambil daftar masukan untuk semua outlet milik seorang merchant
 */
export async function getFeedbacksByOwner(ownerEmail: string): Promise<FeedbackRecord[]> {
  const cleanEmail = ownerEmail.trim().toLowerCase();
  if (!cleanEmail) return [];

  // Ambil semua kode plate milik merchant
  const ownerPlates = await getPlatesByOwner(cleanEmail);
  const plateCodes = ownerPlates.map((p) => p.code);

  if (plateCodes.length === 0) {
    return [];
  }

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      const res = await query<FeedbackDbRow>(
        `SELECT id, plate_code, business_name, rating, feedback_text, customer_name, customer_phone,
                status, notified_via_webhook, webhook_response_status, created_at
         FROM feedbacks
         WHERE plate_code = ANY($1)
         ORDER BY created_at DESC;`,
        [plateCodes]
      );
      if (res) {
        return res.rows.map(mapRowToFeedback);
      }
    } catch (err) {
      console.error("[getFeedbacksByOwner PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const feedbacks = getFeedbackStore();
  return feedbacks.filter((f) => plateCodes.includes(f.plateCode));
}

/**
 * Memperbarui status feedback (unread / resolved / archived)
 * Dilengkapi verifikasi kepemilikan merchant untuk mencegah celah BOLA/IDOR.
 */
export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
  userEmail?: string,
  isAdmin?: boolean
): Promise<FeedbackRecord | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;
  const cleanEmail = (userEmail || "").trim().toLowerCase();

  if (isDatabaseConfigured()) {
    try {
      await initDatabaseSchema();
      let res;
      if (isAdmin || !cleanEmail) {
        res = await query<FeedbackDbRow>(
          `UPDATE feedbacks
           SET status = $1
           WHERE id = $2
           RETURNING *;`,
          [status, cleanId]
        );
      } else {
        res = await query<FeedbackDbRow>(
          `UPDATE feedbacks
           SET status = $1
           WHERE id = $2
             AND plate_code IN (
               SELECT code FROM plates WHERE LOWER(owner_email) = $3
             )
           RETURNING *;`,
          [status, cleanId, cleanEmail]
        );
      }
      if (res && res.rows.length > 0) {
        return mapRowToFeedback(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.error("[updateFeedbackStatus PostgreSQL Error, falling back to memory]:", err);
    }
  }

  const feedbacks = getFeedbackStore();
  const target = feedbacks.find((f) => f.id === cleanId);
  if (!target) return null;

  // Verifikasi kepemilikan di memory fallback
  if (!isAdmin && cleanEmail) {
    const store = getMemoryStore();
    const plate = store[target.plateCode];
    if (!plate || !plate.ownerEmail || plate.ownerEmail.toLowerCase() !== cleanEmail) {
      return null;
    }
  }

  target.status = status;
  return target;
}


