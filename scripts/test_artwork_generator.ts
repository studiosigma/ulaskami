import { generatePlateSvg } from "../lib/utils/artwork";
import { generatePlateCodes, getHighestPlateNumber, registerNewPlateBatch } from "../lib/db/seed";
import { getPlateByCode } from "../lib/db/plates";

async function runTests() {
  console.log("=== Running Hardware & Printing Operations Tests ===\n");
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

  // Group 1: SVG Artwork Generator Tests
  console.log("[Group 1: SVG Vector Stand Generator]");

  const badgeSvg = await generatePlateSvg({
    code: "ULK-000001",
    businessName: "Kopi Kenangan Senopati",
    style: "google_color_badge",
    format: "square_100",
  });

  assert(badgeSvg.includes("<svg") && badgeSvg.includes("</svg>"), "SVG markup is well-formed");
  assert(badgeSvg.includes("#4285F4") && badgeSvg.includes("#EA4335") && badgeSvg.includes("#FBBC05") && badgeSvg.includes("#34A853"), "Badge SVG contains official Google 4-color palette");
  assert(badgeSvg.includes("ULK-000001"), "Badge SVG contains technical serial code");
  assert(badgeSvg.includes("Kopi Kenangan Senopati"), "Badge SVG includes merchant business name");
  assert(badgeSvg.includes("TAP HP ANDA") && badgeSvg.includes("SCAN QR"), "Badge SVG contains dual action columns (NFC & QR)");
  assert(badgeSvg.includes('Powered by <tspan fill="#2563eb" font-weight="700">ulaskami.id</tspan>'), "Badge SVG formats 'ulaskami.id' in hyperlink blue (#2563eb)");

  const clearStandSvg = await generatePlateSvg({
    code: "ULK-000001",
    businessName: "Kopi Kenangan Senopati",
    style: "minimal_clear",
    format: "square_100",
  });

  assert(clearStandSvg.includes("Ulas Kami di Google"), "Clear Stand SVG contains headline");
  assert(clearStandSvg.includes("#FBBC05"), "Clear Stand SVG contains 5 gold stars");
  assert(clearStandSvg.includes('Powered by <tspan fill="#2563eb" font-weight="700">ulaskami.id</tspan>'), "Clear Stand SVG also includes 'ulaskami.id' in hyperlink blue (#2563eb)");

  // Test Tema B: Dark Luxury / Matte Black
  const darkLuxurySvg = await generatePlateSvg({
    code: "ULK-000001",
    businessName: "Barbershop Barokah",
    style: "dark_luxury",
    format: "square_100",
  });
  assert(darkLuxurySvg.includes("#0f1117") && darkLuxurySvg.includes("#181a22"), "Dark Luxury SVG includes obsidian dark palette");
  assert(darkLuxurySvg.includes("Barbershop Barokah"), "Dark Luxury SVG includes business name");
  assert(darkLuxurySvg.includes('Powered by <tspan fill="#38bdf8" font-weight="700">ulaskami.id</tspan>'), "Dark Luxury SVG includes neon cyan ulaskami.id link");

  // Test Tema C: Frost White & Gold Accent
  const frostGoldSvg = await generatePlateSvg({
    code: "ULK-000001",
    businessName: "Klinik Medika Estetika",
    style: "frost_gold",
    format: "square_100",
  });
  assert(frostGoldSvg.includes("#faf8f5") && frostGoldSvg.includes("#d4af37"), "Frost Gold SVG includes pearlescent & gold accents");
  assert(frostGoldSvg.includes("Klinik Medika Estetika"), "Frost Gold SVG includes clinic business name");
  assert(frostGoldSvg.includes('Powered by <tspan fill="#d97706" font-weight="700">ulaskami.id</tspan>'), "Frost Gold SVG includes amber gold ulaskami.id link");

  // Test XML Escaping for Ampersand & XSS tags
  const escapedSvg = await generatePlateSvg({
    code: "ULK-000001",
    businessName: "Kopi & Toast <script>alert(1)</script>",
    style: "google_color_badge",
    format: "square_100",
  });
  assert(escapedSvg.includes("Kopi &amp; Toast &lt;script&gt;"), "Ampersands and HTML tags are safely XML-escaped");
  assert(!escapedSvg.includes("<script>"), "Raw script tags are never injected into SVG");

  // Group 2: Admin Batch Inventory Tests
  console.log("\n[Group 2: Batch Inventory & Serial Registration]");

  const initialHighest = await getHighestPlateNumber();
  assert(initialHighest >= 5, `Initial highest plate number is >= 5 (current: ${initialHighest})`);

  const nextCodes = generatePlateCodes(initialHighest + 1, 5);
  assert(nextCodes.length === 5, "generatePlateCodes generated exactly 5 serials");
  assert(nextCodes[0] === `ULK-${String(initialHighest + 1).padStart(6, "0")}`, `First generated serial is ULK-${String(initialHighest + 1).padStart(6, "0")}`);

  const createdPlates = await registerNewPlateBatch(nextCodes);
  assert(createdPlates.length === 5, "registerNewPlateBatch created 5 plates");
  assert(createdPlates[0].isActive === false, "Generated plates are unactivated (ready for production)");

  const newHighest = await getHighestPlateNumber();
  assert(newHighest === initialHighest + 5, `New highest plate number updated to ${initialHighest + 5}`);

  const checkPlate = await getPlateByCode(nextCodes[2]);
  assert(checkPlate !== null && checkPlate.code === nextCodes[2], `Newly generated plate ${nextCodes[2]} retrievable from data layer`);

  console.log(`\n======================================================`);
  console.log(`Result: ${passed}/${total} Hardware & Print Operations Tests Passed`);
  console.log(`======================================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
