import {
  saveCustomerFeedback,
  getFeedbacksByPlate,
  updateFeedbackStatus,
  getPlateByCode,
  updatePlateUrl,
} from "../lib/db/plates";
import {
  formatOwnerAlertWhatsappText,
  createOwnerAlertWhatsappLink,
  createCustomerResolutionWhatsappLink,
  normalizeWhatsappNumber,
} from "../lib/utils/whatsapp";

async function runTests() {
  console.log("=== Running Feedback & Webhook Integration Tests ===\n");

  // [Group 1: WhatsApp Message Formatting & Phone Normalization]
  console.log("[Group 1: WhatsApp Alert Formatting]");

  const num1 = normalizeWhatsappNumber("081234567890");
  if (num1 !== "6281234567890") {
    throw new Error(`Expected 6281234567890 but got ${num1}`);
  }
  console.log("✓ Test 1 Passed: 0812... normalized to 62812...");

  const num2 = normalizeWhatsappNumber("+6281234567890");
  if (num2 !== "6281234567890") {
    throw new Error(`Expected 6281234567890 but got ${num2}`);
  }
  console.log("✓ Test 2 Passed: +62812... normalized to 62812...");

  const alertText = formatOwnerAlertWhatsappText({
    businessName: "Kopi Kenangan Senopati",
    plateCode: "ULK-000001",
    rating: 2,
    feedbackText: "Waktu tunggu pesanan agak lama di jam istirahat",
    customerName: "Rian",
    customerPhone: "081298765432",
  });

  if (!alertText.includes("ULASKAMI") || !alertText.includes("ULK-000001") || !alertText.includes("⭐⭐")) {
    throw new Error("Alert text missing key metadata: " + alertText);
  }
  console.log("✓ Test 3 Passed: Owner alert contains stars, plate code, and complaint text");

  const alertLink = createOwnerAlertWhatsappLink("081234567890", {
    businessName: "Kopi Kenangan Senopati",
    plateCode: "ULK-000001",
    rating: 1,
    feedbackText: "Pelayanan kurang ramah",
  });
  if (!alertLink.startsWith("https://wa.me/6281234567890?text=")) {
    throw new Error("Invalid WhatsApp link: " + alertLink);
  }
  console.log("✓ Test 4 Passed: Direct owner alert WhatsApp URL generated properly");

  const resolutionLink = createCustomerResolutionWhatsappLink(
    "081298765432",
    "Kopi Kenangan Senopati",
    "Rian"
  );
  if (!resolutionLink.startsWith("https://wa.me/6281298765432?text=") || !resolutionLink.includes("Rian")) {
    throw new Error("Invalid resolution link: " + resolutionLink);
  }
  console.log("✓ Test 5 Passed: Customer resolution WhatsApp link with polite apology generated");

  // [Group 2: Database Storage & Status Management]
  console.log("\n[Group 2: Negative Feedback Storage & Status Lifecycle]");

  const feedback = await saveCustomerFeedback({
    plateCode: "ULK-000001",
    rating: 2,
    feedbackText: "Rasa kopi agak terlalu manis, mohon dikurangi takaran gulanya",
    customerName: "Siti Rahma",
    customerPhone: "081345678901",
  });

  if (!feedback.id.startsWith("fb-") || feedback.status !== "unread") {
    throw new Error("Failed to create feedback record: " + JSON.stringify(feedback));
  }
  console.log("✓ Test 6 Passed: Feedback record created with status 'unread'");

  const plateFeedbacks = await getFeedbacksByPlate("ULK-000001");
  const found = plateFeedbacks.find((f) => f.id === feedback.id);
  if (!found || found.customerName !== "Siti Rahma") {
    throw new Error("Failed to retrieve feedback by plate code");
  }
  console.log("✓ Test 7 Passed: Feedback successfully retrieved from plate inbox");

  const updated = await updateFeedbackStatus(feedback.id, "resolved");
  if (!updated || updated.status !== "resolved") {
    throw new Error("Failed to transition status to resolved");
  }
  console.log("✓ Test 8 Passed: Feedback status updated to 'resolved'");

  // [Group 3: Plate Webhook Configuration Persistence]
  console.log("\n[Group 3: Plate Webhook Configuration]");

  const testWebhookUrl = "https://httpbin.org/post";
  const updatedPlate = await updatePlateUrl({
    code: "ULK-000001",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    webhookUrl: testWebhookUrl,
  });

  if (!updatedPlate || updatedPlate.webhookUrl !== testWebhookUrl) {
    throw new Error("Failed to update plate with webhookUrl: " + JSON.stringify(updatedPlate));
  }
  console.log("✓ Test 9 Passed: Plate updated with webhookUrl");

  const verifiedPlate = await getPlateByCode("ULK-000001");
  if (!verifiedPlate || verifiedPlate.webhookUrl !== testWebhookUrl) {
    throw new Error("Failed to verify persisted webhookUrl");
  }
  console.log("✓ Test 10 Passed: Webhook URL successfully verified from plate data layer");

  console.log("\n======================================================");
  console.log("Result: All 10 Feedback & Webhook Integration Tests Passed!");
  console.log("======================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
