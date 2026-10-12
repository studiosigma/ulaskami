import { getPlateByCode, updatePlateUrl, activatePlate, recordPlateScan } from "../lib/db/plates";
import { SITE_CONFIG } from "../lib/config";

async function runTests() {
  console.log("=== Running Smart Review Routing & Feedback Gate Tests ===\n");
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

  // Test 1: Plate default routing mode
  const plate1 = await getPlateByCode("ULK-000001");
  assert(plate1 !== null, "Plate ULK-000001 found");
  assert(plate1?.routingMode === "smart_filter", "ULK-000001 defaults to 'smart_filter' mode");
  assert(plate1?.minGoogleRating === 4, "ULK-000001 minGoogleRating defaults to 4");

  // Test 2: Update plate to direct mode
  const updatedToDirect = await updatePlateUrl({
    code: "ULK-000001",
    googleReviewUrl: "https://maps.app.goo.gl/abcdefg12345",
    routingMode: "direct",
  });
  assert(updatedToDirect !== null, "Plate updated to direct successfully");
  assert(updatedToDirect?.routingMode === "direct", "Plate routingMode is now 'direct'");

  // Test 3: Update plate back to smart_filter with feedback WhatsApp number
  const updatedToFilter = await updatePlateUrl({
    code: "ULK-000001",
    googleReviewUrl: "https://maps.app.goo.gl/abcdefg12345",
    routingMode: "smart_filter",
    feedbackWhatsapp: "081298765432",
    minGoogleRating: 4,
  });
  assert(updatedToFilter !== null, "Plate updated to smart_filter successfully");
  assert(updatedToFilter?.routingMode === "smart_filter", "Plate routingMode restored to 'smart_filter'");
  assert(updatedToFilter?.feedbackWhatsapp === "081298765432", "feedbackWhatsapp preserved");

  // Test 4: Activate unactivated plate with smart_filter mode
  const activated = await activatePlate({
    code: "ULK-000004",
    businessName: "Warung Makan Barokah",
    googleReviewUrl: "https://maps.app.goo.gl/barokah123",
    routingMode: "smart_filter",
    feedbackWhatsapp: "628555123456",
    ownerEmail: "owner@barokah.id",
  });
  assert(activated.isActive === true, "ULK-000004 activated");
  assert(activated.routingMode === "smart_filter", "ULK-000004 has routingMode 'smart_filter'");
  assert(activated.feedbackWhatsapp === "628555123456", "ULK-000004 has feedbackWhatsapp");
  assert(activated.businessName === "Warung Makan Barokah", "ULK-000004 businessName set");

  // Test 5: Test WhatsApp link generation and 08xx normalization
  const waLink = SITE_CONFIG.createCustomWhatsAppLink("081299998888", "Halo masukan saya");
  assert(waLink.startsWith("https://wa.me/6281299998888"), "createCustomWhatsAppLink normalizes 08xx to 628xx");
  assert(waLink.includes(encodeURIComponent("Halo masukan saya")), "createCustomWhatsAppLink encodes message parameter");

  // Test 6: Verify memory state persistence across getPlateByCode
  const refetched = await getPlateByCode("ULK-000004");
  assert(refetched?.code === "ULK-000004", "Refetched ULK-000004 matches");
  assert(refetched?.routingMode === "smart_filter", "Refetched ULK-000004 maintains routingMode");

  // Test 7: Verify scan debouncing
  const beforePlate = await getPlateByCode("ULK-000001");
  const beforeCount = beforePlate?.scanCount || 0;
  await recordPlateScan("ULK-000001", "Mozilla/5.0 Test", "127.0.0.1");
  await recordPlateScan("ULK-000001", "Mozilla/5.0 Test", "127.0.0.1"); // Should be debounced
  const afterPlate = await getPlateByCode("ULK-000001");
  assert(
    afterPlate?.scanCount === beforeCount + 1,
    `Anti-spam debouncing works: rapid repeated taps within cooldown incremented count only once (${beforeCount} -> ${afterPlate?.scanCount})`
  );

  console.log(`\n======================================================`);
  console.log(`Result: ${passed}/${total} Smart Review Routing Tests Passed`);
  console.log(`======================================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
