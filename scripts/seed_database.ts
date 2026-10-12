import { isDatabaseConfigured } from "../lib/db/client";
import { initDatabaseSchema, INITIAL_PLATES_SEED } from "../lib/db/schema";
import { getHighestPlateNumber, generatePlateCodes, registerNewPlateBatch } from "../lib/db/seed";

async function runSeed() {
  console.log("\n============================================================");
  console.log("       ULASKAMI — SEEDER INVENTARIS PRODUKSI DATABASE        ");
  console.log("============================================================\n");

  const isConfigured = isDatabaseConfigured();
  console.log(`Status Penyimpanan: ${isConfigured ? "PostgreSQL Cloud Database" : "In-Memory Store"}`);

  // Inisialisasi skema tabel & seed default
  await initDatabaseSchema();
  console.log("✓ Skema tabel siap & batch default telah diinisialisasi.");

  const highest = await getHighestPlateNumber();
  console.log(`✓ Serial tertinggi saat ini: ULK-${String(highest).padStart(6, "0")}`);

  // Opsi argumen batch tambahan dari CLI (misal: tsx scripts/seed_database.ts 20)
  const argCount = parseInt(process.argv[2] || "0", 10);
  if (argCount > 0) {
    console.log(`\nMenambahkan batch ${argCount} plate baru...`);
    const newCodes = generatePlateCodes(highest + 1, argCount);
    const created = await registerNewPlateBatch(newCodes);
    console.log(`✓ Berhasil mendaftarkan ${created.length} plate baru:`);
    console.log(`  Mulai  : ${newCodes[0]}`);
    console.log(`  Selesai: ${newCodes[newCodes.length - 1]}`);
  } else {
    console.log(`\nDefault seeds terdaftar (${INITIAL_PLATES_SEED.length} plate):`);
    for (const p of INITIAL_PLATES_SEED) {
      console.log(`  - [${p.code}] ${p.businessName || "Belum Teraktivasi"} (Aktif: ${p.isActive})`);
    }
    console.log("\nTips: Untuk mendaftarkan batch serial tambahan, jalankan:");
    console.log("  npx tsx scripts/seed_database.ts <jumlah_plate>");
    console.log("  Contoh: npx tsx scripts/seed_database.ts 50\n");
  }

  console.log("============================================================\n");
}

runSeed().catch((err) => {
  console.error("Gagal melakukan seeding:", err);
  process.exit(1);
});
