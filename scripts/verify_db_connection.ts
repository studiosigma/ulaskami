import { isDatabaseConfigured, testConnection, query } from "../lib/db/client";
import { initDatabaseSchema } from "../lib/db/schema";

async function verifyDatabase() {
  console.log("\n============================================================");
  console.log("       ULASKAMI — DIAGNOSA KONEKSI CLOUD POSTGRESQL         ");
  console.log("============================================================\n");

  const configured = isDatabaseConfigured();
  console.log(`[1] Konfigurasi DATABASE_URL: ${configured ? "✓ DITEMUKAN" : "✗ BELUM DIKONFIGURASI"}`);

  if (!configured) {
    console.log("\n⚠️  DATABASE_URL belum diatur atau masih menggunakan placeholder default.");
    console.log("    Aplikasi saat ini berjalan dalam mode: 'In-Memory Hybrid (Safe Fallback)'.");
    console.log("    Untuk menghubungkan ke PostgreSQL PAAS.ID / Neon / Supabase, tambahkan baris berikut ke .env.local:\n");
    console.log("    DATABASE_URL=\"postgresql://username:password@db.paas.id:5432/ulaskami_db?sslmode=require\"\n");
    console.log("============================================================\n");
    return;
  }

  console.log("[2] Menguji koneksi & mengukur latensi...");
  const startTime = Date.now();
  const testRes = await testConnection();
  const latency = Date.now() - startTime;

  if (!testRes.connected) {
    console.error(`\n✗ GAGAL TERHUBUNG KE POSTGRESQL!`);
    console.error(`  Pesan Error: ${testRes.error}`);
    console.log("\n============================================================\n");
    process.exitCode = 1;
    return;
  }

  console.log(`✓ Berhasil terhubung ke PostgreSQL! (Latensi: ${latency} ms)`);

  console.log("\n[3] Memeriksa versi database PostgreSQL...");
  const versionRes = await query<{ version: string }>("SELECT version();");
  if (versionRes && versionRes.rows[0]) {
    const rawVer = versionRes.rows[0].version.split(" on ")[0];
    console.log(`✓ Versi Server: ${rawVer}`);
  }

  console.log("\n[4] Memverifikasi skema tabel & auto-migration...");
  await initDatabaseSchema();
  console.log("✓ Skema tabel ('plates', 'scan_logs', 'merchants') aktif & terindeks.");

  console.log("\n[5] Menghitung data inventaris di database:");
  const platesRes = await query<{ count: string }>("SELECT COUNT(*) as count FROM plates;");
  const activeRes = await query<{ count: string }>("SELECT COUNT(*) as count FROM plates WHERE is_active = TRUE;");
  const logsRes = await query<{ count: string }>("SELECT COUNT(*) as count FROM scan_logs;");
  const merchantsRes = await query<{ count: string }>("SELECT COUNT(*) as count FROM merchants;");

  console.log(`  - Total Plate Terdaftar : ${platesRes?.rows[0]?.count || 0}`);
  console.log(`  - Plate Aktif (Merchant): ${activeRes?.rows[0]?.count || 0}`);
  console.log(`  - Riwayat Scan Tercatat : ${logsRes?.rows[0]?.count || 0}`);
  console.log(`  - Akun Merchant         : ${merchantsRes?.rows[0]?.count || 0}`);

  console.log("\n============================================================");
  console.log("✓ KESIMPULAN: DATABASE CLOUD SIAP UNTUK PRODUKSI GO-LIVE!    ");
  console.log("============================================================\n");
}

verifyDatabase().catch((err) => {
  console.error("Terjadi kegagalan saat menjalankan diagnosa:", err);
  process.exit(1);
});
