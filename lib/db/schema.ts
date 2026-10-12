import { query, isDatabaseConfigured } from "./client";
import { hashPassword } from "../auth";

export const INITIAL_PLATES_SEED = [
  {
    id: "plate-001",
    code: "ULK-000001",
    businessName: "Kopi Kenangan Senopati (Demo)",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    isActive: true,
    scanCount: 128,
    routingMode: "smart_filter" as const,
    feedbackWhatsapp: "6281234567890",
    minGoogleRating: 4,
    ownerEmail: "budi@kopikenangan.id",
  },
  {
    id: "plate-002",
    code: "ULK-000002",
    businessName: "",
    googleReviewUrl: "",
    isActive: false,
    scanCount: 0,
    routingMode: "smart_filter" as const,
    feedbackWhatsapp: "",
    minGoogleRating: 4,
    ownerEmail: undefined,
  },
  {
    id: "plate-003",
    code: "ULK-000003",
    businessName: "",
    googleReviewUrl: "",
    isActive: false,
    scanCount: 0,
    routingMode: "smart_filter" as const,
    feedbackWhatsapp: "",
    minGoogleRating: 4,
    ownerEmail: undefined,
  },
  {
    id: "plate-004",
    code: "ULK-000004",
    businessName: "",
    googleReviewUrl: "",
    isActive: false,
    scanCount: 0,
    routingMode: "smart_filter" as const,
    feedbackWhatsapp: "",
    minGoogleRating: 4,
    ownerEmail: undefined,
  },
  {
    id: "plate-005",
    code: "ULK-000005",
    businessName: "",
    googleReviewUrl: "",
    isActive: false,
    scanCount: 0,
    routingMode: "smart_filter" as const,
    feedbackWhatsapp: "",
    minGoogleRating: 4,
    ownerEmail: undefined,
  },
];

export const INITIAL_DEMO_MERCHANT = {
  id: "merchant-001",
  name: "Budi Santoso",
  email: "budi@kopikenangan.id",
  passwordPlain: "password123",
};

let initPromise: Promise<void> | null = null;

/**
 * Inisialisasi otomatis skema database PostgreSQL PAAS.ID (Auto-migration & Seeding)
 */
export async function initDatabaseSchema(): Promise<void> {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // 1. Buat tabel plates
      await query(`
        CREATE TABLE IF NOT EXISTS plates (
          id VARCHAR(64) PRIMARY KEY,
          code VARCHAR(20) UNIQUE NOT NULL,
          business_name VARCHAR(255) DEFAULT '',
          google_review_url TEXT DEFAULT '',
          is_active BOOLEAN DEFAULT FALSE,
          scan_count INTEGER DEFAULT 0,
          routing_mode VARCHAR(20) DEFAULT 'smart_filter',
          feedback_whatsapp VARCHAR(30) DEFAULT '',
          min_google_rating INTEGER DEFAULT 4,
          owner_email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 1b. Auto-migration jika tabel plates sudah ada sebelumnya tapi belum memiliki kolom routing
      await query(`ALTER TABLE plates ADD COLUMN IF NOT EXISTS routing_mode VARCHAR(20) DEFAULT 'smart_filter';`);
      await query(`ALTER TABLE plates ADD COLUMN IF NOT EXISTS feedback_whatsapp VARCHAR(30) DEFAULT '';`);
      await query(`ALTER TABLE plates ADD COLUMN IF NOT EXISTS min_google_rating INTEGER DEFAULT 4;`);

      // 2. Buat tabel scan_logs
      await query(`
        CREATE TABLE IF NOT EXISTS scan_logs (
          id VARCHAR(64) PRIMARY KEY,
          plate_code VARCHAR(20) NOT NULL,
          user_agent TEXT,
          ip_hash VARCHAR(64),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 3. Buat tabel merchants untuk sistem autentikasi
      await query(`
        CREATE TABLE IF NOT EXISTS merchants (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          password_salt VARCHAR(64) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 4. Buat indeks untuk performa pencarian
      await query(`CREATE INDEX IF NOT EXISTS idx_plates_code ON plates(code);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_plates_owner_email ON plates(owner_email);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_scan_logs_plate_code ON scan_logs(plate_code);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_merchants_email ON merchants(email);`);

      // 5. Periksa apakah tabel plates kosong, jika ya, isi dengan seed batch awal
      const countRes = await query<{ count: string }>(`SELECT COUNT(*) FROM plates;`);
      const rowCount = countRes && countRes.rows[0] ? parseInt(countRes.rows[0].count, 10) : 0;

      if (rowCount === 0) {
        for (const p of INITIAL_PLATES_SEED) {
          await query(
            `
            INSERT INTO plates (id, code, business_name, google_review_url, is_active, scan_count, routing_mode, feedback_whatsapp, min_google_rating, owner_email, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            ON CONFLICT (code) DO NOTHING;
          `,
            [p.id, p.code, p.businessName, p.googleReviewUrl, p.isActive, p.scanCount, p.routingMode, p.feedbackWhatsapp, p.minGoogleRating, p.ownerEmail || null]
          );
        }
      }

      // 6. Periksa dan seed akun merchant demo
      const merchantCountRes = await query<{ count: string }>(`SELECT COUNT(*) FROM merchants;`);
      const merchantCount = merchantCountRes && merchantCountRes.rows[0] ? parseInt(merchantCountRes.rows[0].count, 10) : 0;

      if (merchantCount === 0) {
        const { hash, salt } = hashPassword(INITIAL_DEMO_MERCHANT.passwordPlain);
        await query(
          `
          INSERT INTO merchants (id, name, email, password_hash, password_salt, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
          ON CONFLICT (email) DO NOTHING;
        `,
          [INITIAL_DEMO_MERCHANT.id, INITIAL_DEMO_MERCHANT.name, INITIAL_DEMO_MERCHANT.email, hash, salt]
        );
      }
    } catch (err) {
      console.error("[PostgreSQL Schema Initialization Error]:", err);
      // Reset promise jika gagal agar dapat dicoba lagi pada query berikutnya
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}
