import { generatePlateSvg, escapeXml } from "../lib/utils/artwork";
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

  // Group 1: SVG Master Artwork Generator Tests
  console.log("[Group 1: Master Physical Artwork Generator (Google 4-Color Signature)]");

  const badgeSvg1 = await generatePlateSvg({
    code: "ULK-000001",
    style: "google_color_badge",
  });

  assert(badgeSvg1.includes("<svg") && badgeSvg1.includes("</svg>"), "SVG markup is well-formed");
  assert(badgeSvg1.includes("data:image/jpeg;base64,") || badgeSvg1.includes("#4285F4"), "Badge SVG contains authentic master artwork template");
  assert(badgeSvg1.includes("ULK-000001"), "Badge SVG contains unique serial code for plate 1");
  assert(badgeSvg1.includes('shape-rendering="crispEdges"'), "Badge SVG renders high-precision vector QR barcode");

  // Dynamic Barcode Test: Generate for a different code (e.g. L5GKPCRZ)
  const badgeSvg2 = await generatePlateSvg({
    code: "L5GKPCRZ",
    style: "google_color_badge",
  });

  assert(badgeSvg2.includes("L5GKPCRZ"), "Badge SVG dynamically renders serial code L5GKPCRZ");
  assert(!badgeSvg2.includes("ULK-000001"), "Barcode output is unique per plate serial");

  // Test XML Escaping for Ampersand & XSS tags
  const escapedSvg = await generatePlateSvg({
    code: "ULK-000003",
  });
  assert(escapedSvg.includes("ULK-000003"), "Standard code is safely integrated into SVG");
  assert(escapeXml("Tom & Jerry") === "Tom &amp; Jerry", "Ampersands are XML-escaped");
  assert(escapeXml("<script>") === "&lt;script&gt;", "Raw script tags are XML-escaped");

  // Group 2: Batch Inventory & Serial Registration Tests
  console.log("\n[Group 2: Batch Inventory & Serial Registration]");

  const initialHighest = await getHighestPlateNumber();
  assert(initialHighest >= 5, `Initial highest plate number is >= 5 (current: ${initialHighest})`);

  // Generate 5 new codes
  const generatedCodes = generatePlateCodes(initialHighest + 1, 5);
  assert(generatedCodes.length === 5, "generatePlateCodes generated exactly 5 serials");
  assert(
    generatedCodes[0] === `ULK-${String(initialHighest + 1).padStart(6, "0")}`,
    `First generated serial is ${generatedCodes[0]}`
  );

  // Register the batch into the system
  const newPlates = await registerNewPlateBatch(generatedCodes);
  assert(newPlates.length === 5, "registerNewPlateBatch created 5 plates");
  assert(newPlates.every((p) => !p.isActive), "Generated plates are unactivated (ready for production)");

  const updatedHighest = await getHighestPlateNumber();
  assert(
    updatedHighest === initialHighest + 5,
    `New highest plate number updated to ${updatedHighest}`
  );

  // Verify retrievability
  const samplePlate = await getPlateByCode(generatedCodes[2]);
  assert(
    samplePlate !== null && samplePlate.code === generatedCodes[2],
    `Newly generated plate ${generatedCodes[2]} retrievable from data layer`
  );

  console.log(`\n======================================================`);
  console.log(`Result: ${passed}/${total} Hardware & Print Operations Tests Passed`);
  console.log(`======================================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
