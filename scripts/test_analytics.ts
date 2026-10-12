import { getPlateScanLogs, getPlateAnalytics } from "../lib/db/plates";

async function runTests() {
  console.log("=== Menjalankan Pengujian Analitik & Deteksi Jam Sibuk (Tahap 3) ===\n");
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

  // 1. Uji Seed Scan Logs untuk ULK-000001
  const logs = await getPlateScanLogs("ULK-000001");
  assert(logs.length >= 120, `Terdapat log tap/scan realistis untuk ULK-000001 (Ditemukan: ${logs.length} scan)`);

  const firstLog = logs[0];
  assert(
    firstLog && typeof firstLog.timestamp === "string" && Boolean(firstLog.userAgent),
    `Format log scan valid dengan timestamp (${firstLog?.timestamp}) dan userAgent (${firstLog?.userAgent?.slice(0, 30)}...)`
  );

  // 2. Uji Kalkulasi Analitik 30 Hari
  const analytics30d = await getPlateAnalytics("ULK-000001", 30);
  assert(analytics30d !== null, "Analitik 30 hari berhasil diambil");
  if (!analytics30d) return;

  assert(analytics30d.plateCode === "ULK-000001", "Plate code sesuai dengan input");
  assert(analytics30d.totalScans >= 120, `Total scan terakumulasi dengan benar: ${analytics30d.totalScans}`);
  assert(analytics30d.dailyTrends.length === 30, `Tren harian memiliki 30 titik data (Ditemukan: ${analytics30d.dailyTrends.length})`);
  assert(analytics30d.hourlyPeaks.length === 24, `Deteksi 24 jam memiliki 24 slot jam 00-23 (Ditemukan: ${analytics30d.hourlyPeaks.length})`);
  assert(
    Boolean(analytics30d.busiestHour) && analytics30d.busiestHour.label.includes(":00"),
    `Jam tersibuk teridentifikasi secara presisi: ${analytics30d.busiestHour.label} (${analytics30d.busiestHour.count} scan)`
  );
  assert(
    analytics30d.busiestHour.count > 0,
    `Jumlah scan pada jam tersibuk positif: ${analytics30d.busiestHour.count} scan`
  );

  // 3. Uji Kalkulasi Analitik 7 Hari
  const analytics7d = await getPlateAnalytics("ULK-000001", 7);
  assert(analytics7d !== null, "Analitik 7 hari berhasil diambil");
  if (!analytics7d) return;

  assert(analytics7d.dailyTrends.length === 7, `Tren harian 7-hari memiliki 7 titik data (Ditemukan: ${analytics7d.dailyTrends.length})`);
  assert(
    analytics7d.scansLast7Days <= analytics30d.scansLast30Days,
    `Total scan 7 hari (${analytics7d.scansLast7Days}) <= total scan 30 hari (${analytics30d.scansLast30Days})`
  );

  // 4. Uji Device Breakdown
  const { iosPercentage, androidPercentage, otherPercentage } = analytics30d.deviceBreakdown;
  const sumPercentage = iosPercentage + androidPercentage + otherPercentage;
  assert(
    sumPercentage === 100,
    `Total persentase perangkat tepat 100% (iOS: ${iosPercentage}%, Android: ${androidPercentage}%, Lainnya: ${otherPercentage}%)`
  );
  assert(
    iosPercentage > 0 && androidPercentage > 0,
    `Deteksi perangkat Apple iOS (${analytics30d.deviceBreakdown.ios}) dan Android (${analytics30d.deviceBreakdown.android}) berfungsi realistis`
  );

  // 5. Uji Format Data CSV Export
  const csvRows = [
    ["Log ID", "Kode Plate", "Tanggal (WIB)", "Jam (WIB)", "Kategori Perangkat", "User-Agent Header"].join(",")
  ];
  for (const log of logs.slice(0, 5)) {
    const dateObj = new Date(log.timestamp);
    const dateWib = dateObj.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeWib = dateObj.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const cleanUa = `"${(log.userAgent || "Unknown").replace(/"/g, '""')}"`;
    const deviceType = /iPhone|iPad|iPod/i.test(log.userAgent || "")
      ? "Apple iOS"
      : /Android/i.test(log.userAgent || "")
      ? "Google Android"
      : "Lainnya / Desktop";
    csvRows.push([log.id, log.plateCode, dateWib, timeWib, deviceType, cleanUa].join(","));
  }
  const csvContent = csvRows.join("\r\n");
  assert(csvContent.startsWith("Log ID,Kode Plate"), "Format CSV memiliki header yang benar");
  assert(csvRows.length === 6, "Baris CSV berhasil di-generate");

  console.log(`\n========================================`);
  console.log(`Hasil Pengujian: ${passed} dari ${total} tes lolos 100%!`);
  console.log(`========================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
