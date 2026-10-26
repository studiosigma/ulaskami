import { Pool, QueryResult, QueryResultRow } from "pg";

declare global {
  var __ulaskami_pg_pool__: Pool | undefined;
}

/**
 * Memeriksa apakah variabel DATABASE_URL telah dikonfigurasi
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  return Boolean(
    url &&
    url.length > 0 &&
    !url.includes("username:password@host.paas.id") &&
    url !== "value"
  );
}

/**
 * Mengambil atau menginisialisasi Connection Pool PostgreSQL
 */
export function getPool(): Pool | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!globalThis.__ulaskami_pg_pool__) {
    const connectionString = process.env.DATABASE_URL!.trim();
    const isSslRequired =
      connectionString.includes("sslmode=require") ||
      connectionString.includes(".paas.id") ||
      connectionString.includes(".supabase.co") ||
      connectionString.includes(".pooler.supabase.com") ||
      connectionString.includes(".render.com") ||
      connectionString.includes("neon.tech") ||
      connectionString.includes("vercel-storage.com") ||
      connectionString.includes("aivencloud.com") ||
      Boolean(process.env.VERCEL && !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1"));

    globalThis.__ulaskami_pg_pool__ = new Pool({
      connectionString,
      ssl: isSslRequired ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    globalThis.__ulaskami_pg_pool__.on("error", (err) => {
      console.error("[PostgreSQL Client Pool Error]:", err);
    });
  }

  return globalThis.__ulaskami_pg_pool__;
}

/**
 * Menjalankan SQL query dengan penanganan error yang aman
 */
export async function query<R extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<R> | null> {
  const pool = getPool();
  if (!pool) return null;

  try {
    return await pool.query<R>(text, params);
  } catch (error) {
    console.error("[PostgreSQL Query Execution Error]:", error);
    throw error;
  }
}

/**
 * Menguji koneksi aktif ke PostgreSQL
 */
export async function testConnection(): Promise<{ connected: boolean; error?: string }> {
  const pool = getPool();
  if (!pool) {
    return { connected: false, error: "DATABASE_URL belum dikonfigurasi di file environment." };
  }

  try {
    const res = await pool.query("SELECT NOW()");
    return { connected: res.rowCount !== null && res.rowCount > 0 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { connected: false, error: message };
  }
}
