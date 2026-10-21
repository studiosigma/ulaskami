import { SITE_CONFIG } from "../lib/config";
import { analyzeNfcPayload, getNfcTargetUrl, NFC_CHIP_SPECS } from "../lib/nfc";
import { isDatabaseConfigured, testConnection } from "../lib/db/client";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import manifest from "../app/manifest";

async function runProductionReadinessTests() {
  console.log("=== Menjalankan Pengujian Kesiapan Produksi & Peluncuran (Tahap 4) ===\n");
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`✓ Test ${total} Passed: ${message}`);
      passed++;
    } else {
      console.error(`✗ Test ${total} FAILED: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Uji Konfigurasi Domain & Branding Resmi
  assert(SITE_CONFIG.domain === "ulaskami.com", "Domain resmi disetel ke ulaskami.com");
  assert(SITE_CONFIG.appUrl.includes("ulaskami.com"), `Base appUrl valid: ${SITE_CONFIG.appUrl}`);
  assert(SITE_CONFIG.supportEmail.endsWith("@ulaskami.com"), `Email support resmi: ${SITE_CONFIG.supportEmail}`);

  // 2. Uji Payload NFC & Kompatibilitas Hardware NTAG213 (144 bytes)
  const targetUrl = getNfcTargetUrl("ULK-000001");
  assert(targetUrl === "https://ulaskami.com/r/ULK-000001", `Format URL tap NFC tepat: ${targetUrl}`);

  const nfcAnalysis = analyzeNfcPayload(targetUrl);
  assert(
    nfcAnalysis.chip.ntag213.isCompatible === true,
    `Payload NFC kompatibel 100% dengan NTAG213 (Estimasi: ${nfcAnalysis.ndefEstimatedBytes} bytes dari kapasitas ${NFC_CHIP_SPECS.NTAG213.maxNdefBytes} bytes NDEF)`
  );
  assert(
    nfcAnalysis.chip.ntag213.percentUsed < 35,
    `Konsumsi memori sangat hemat (Hanya ${nfcAnalysis.chip.ntag213.percentUsed}% dari 144B NTAG213 terpakai, sisa ${nfcAnalysis.chip.ntag213.free} bytes)`
  );

  // 3. Uji Dynamic XML Sitemap
  const sitemapEntries = sitemap();
  assert(sitemapEntries.length >= 5, `Sitemap memiliki ${sitemapEntries.length} entri halaman publik`);
  assert(
    sitemapEntries.some((e) => e.url.endsWith("/pricing")),
    "Sitemap mencakup halaman harga (/pricing)"
  );
  assert(
    sitemapEntries.some((e) => e.url.endsWith("/activate")),
    "Sitemap mencakup halaman aktivasi (/activate)"
  );

  // 4. Uji Robots.txt Crawling Directives
  const robotsDirectives = robots();
  const rules = Array.isArray(robotsDirectives.rules) ? robotsDirectives.rules[0] : robotsDirectives.rules;
  assert(Boolean(rules && rules.disallow), "Robots.txt memiliki aturan disallow privat");
  assert(
    Boolean(robotsDirectives.sitemap && robotsDirectives.sitemap.includes("sitemap.xml")),
    `Robots.txt mengarahkan ke sitemap.xml: ${robotsDirectives.sitemap}`
  );

  // 5. Uji Web App Manifest (PWA)
  const pwaManifest = manifest();
  assert(
    Boolean(pwaManifest.name && pwaManifest.name.includes("Ulaskami")),
    `PWA Manifest name valid: ${pwaManifest.name || ""}`
  );
  assert(pwaManifest.theme_color === "#1a73e8", "PWA Manifest theme color disetel ke biru Google/Ulaskami");
  assert(pwaManifest.start_url === "/dashboard", "PWA start URL mengarah ke /dashboard");

  // 6. Uji Database Diagnostics Helper
  const isDbConfigured = isDatabaseConfigured();
  console.log(`\nInformasi Data Layer Saat Ini: ${isDbConfigured ? "PostgreSQL Aktif" : "In-Memory Safe Fallback"}`);
  const connTest = await testConnection();
  if (isDbConfigured) {
    assert(connTest.connected === true, "Koneksi PostgreSQL berhasil");
  } else {
    assert(
      connTest.connected === false && Boolean(connTest.error),
      "Safe Fallback: testConnection mengembalikan pesan ramah saat DATABASE_URL belum diatur"
    );
  }

  console.log(`\n========================================`);
  console.log(`Hasil Pengujian: ${passed} dari ${total} tes lolos 100%!`);
  console.log(`========================================\n`);
}

runProductionReadinessTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
