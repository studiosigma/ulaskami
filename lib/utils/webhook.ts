import { FeedbackRecord } from "../types";

export interface WebhookDispatchResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  responseBody?: string;
}

/**
 * Memvalidasi URL Webhook untuk mencegah Server-Side Request Forgery (SSRF)
 * ke host lokal, cloud instance metadata, maupun IP private jaringan internal.
 */
export function validateWebhookUrl(rawUrl: string): { isValid: boolean; error?: string } {
  const clean = (rawUrl || "").trim();
  if (!clean) {
    return { isValid: false, error: "URL webhook tidak boleh kosong." };
  }

  let parsed: URL;
  try {
    parsed = new URL(clean);
  } catch {
    return { isValid: false, error: "Format URL webhook tidak valid." };
  }

  // Protokol harus https:// di lingkungan produksi
  if (process.env.NODE_ENV === "production") {
    if (parsed.protocol !== "https:") {
      return { isValid: false, error: "URL Webhook produksi wajib menggunakan protokol aman HTTPS (https://)." };
    }
  } else {
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { isValid: false, error: "Protokol webhook harus http atau https." };
    }
  }

  const hostname = parsed.hostname.toLowerCase();

  // Cegah hostname lokal / loopback
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return { isValid: false, error: "URL webhook tidak boleh mengarah ke server lokal (localhost/internal)." };
  }

  // Cegah Cloud Instance Metadata Service (AWS/GCP/Azure/OpenStack)
  if (hostname.startsWith("169.254.")) {
    return { isValid: false, error: "Akses ke alamat metadata cloud instance dilarang." };
  }

  // Cegah IP privat RFC 1918 (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipMatch = hostname.match(ipv4Regex);
  if (ipMatch) {
    const p1 = parseInt(ipMatch[1], 10);
    const p2 = parseInt(ipMatch[2], 10);

    if (
      p1 === 10 || // 10.0.0.0/8
      (p1 === 172 && p2 >= 16 && p2 <= 31) || // 172.16.0.0/12
      (p1 === 192 && p2 === 168) || // 192.168.0.0/16
      p1 === 127 || // 127.0.0.0/8
      p1 === 0 // 0.0.0.0/8
    ) {
      return { isValid: false, error: "URL webhook tidak boleh mengarah ke rentang IP privat intranet." };
    }
  }

  return { isValid: true };
}

/**
 * Dispatch notifikasi webhook ke URL tujuan (Mendukung Discord, Slack, n8n, Zapier, Make, & Custom CRM)
 */
export async function dispatchFeedbackWebhook(
  webhookUrl: string,
  feedback: FeedbackRecord
): Promise<WebhookDispatchResult> {
  const cleanUrl = webhookUrl.trim();
  const validation = validateWebhookUrl(cleanUrl);
  if (!validation.isValid) {
    return { success: false, error: validation.error || "Format URL webhook tidak valid." };
  }

  const isDiscord = cleanUrl.includes("discord.com/api/webhooks");
  const isSlack = cleanUrl.includes("hooks.slack.com/services");

  const ratingStars = "⭐".repeat(Math.max(1, Math.min(5, feedback.rating)));
  const ratingColorHex = feedback.rating === 1 ? 0xea4335 : feedback.rating === 2 ? 0xfbbc05 : 0x4285f4;

  let requestBody: Record<string, unknown>;

  if (isDiscord) {
    // Discord Embed Payload
    requestBody = {
      username: "Ulaskami Alert Bot",
      avatar_url: "https://ulaskami.id/logo-icon.png",
      content: `🚨 **Peringatan Feedback Negatif Baru di ${feedback.businessName}**`,
      embeds: [
        {
          title: `Komplain Disaring: ${feedback.rating}/5 Bintang`,
          color: ratingColorHex,
          description: `"${feedback.feedbackText}"`,
          fields: [
            {
              name: "Outlet / Plate",
              value: `${feedback.businessName} (\`${feedback.plateCode}\`)`,
              inline: true,
            },
            {
              name: "Rating",
              value: `${feedback.rating}/5 ${ratingStars}`,
              inline: true,
            },
            {
              name: "Pelanggan",
              value: feedback.customerName || "Anonim",
              inline: true,
            },
            {
              name: "No. HP Pelanggan",
              value: feedback.customerPhone || "Tidak disertakan",
              inline: true,
            },
            {
              name: "Waktu",
              value: new Date(feedback.createdAt).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
              }) + " WIB",
              inline: true,
            },
            {
              name: "Status Review Publik",
              value: "✅ Aman (Disaring privat oleh Ulaskami Smart Gate)",
              inline: false,
            },
          ],
          footer: {
            text: "Ulaskami Smart Review Platform",
            icon_url: "https://ulaskami.id/logo-icon.png",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } else if (isSlack) {
    // Slack Incoming Webhook Payload
    requestBody = {
      text: `🚨 *[Ulaskami Alert]* Feedback negatif diterima untuk *${feedback.businessName}* (${feedback.rating}/5 Bintang)`,
      attachments: [
        {
          color: feedback.rating === 1 ? "#EA4335" : "#FBBC05",
          title: `Masukan Pelanggan: "${feedback.feedbackText}"`,
          fields: [
            {
              title: "Outlet",
              value: `${feedback.businessName} (${feedback.plateCode})`,
              short: true,
            },
            {
              title: "Rating",
              value: `${feedback.rating}/5 ${ratingStars}`,
              short: true,
            },
            {
              title: "Pelanggan",
              value: `${feedback.customerName || "Anonim"} (${feedback.customerPhone || "Tanpa No HP"})`,
              short: true,
            },
            {
              title: "Tindakan",
              value: "Hubungi pelanggan sebelum memberi review negatif di Google Maps.",
              short: false,
            },
          ],
          footer: "Ulaskami Notification System",
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };
  } else {
    // Standard Universal Webhook Payload (n8n, Make, Zapier, Custom CRM)
    requestBody = {
      event: "customer.negative_feedback",
      timestamp: feedback.createdAt,
      plate: {
        code: feedback.plateCode,
        businessName: feedback.businessName,
      },
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
        text: feedback.feedbackText,
        customerName: feedback.customerName || null,
        customerPhone: feedback.customerPhone || null,
        status: feedback.status,
      },
      meta: {
        source: "ulaskami_smart_filter",
        actionRequired: "Hubungi pelanggan sebelum memberikan review publik di Google Maps",
      },
    };
  }

  // 5 seconds timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(cleanUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Ulaskami-Webhook-Notifier/1.0",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const isOk = response.ok;
    let resText = "";
    try {
      resText = (await response.text()).slice(0, 300);
    } catch {
      // ignore
    }

    return {
      success: isOk,
      statusCode: response.status,
      responseBody: resText,
      error: isOk ? undefined : `Server merespon dengan status HTTP ${response.status}`,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: message.includes("abort") ? "Request webhook timeout (melebihi 6 detik)" : message,
    };
  }
}

/**
 * Uji coba ping webhook URL untuk memverifikasi koneksi di dashboard
 */
export async function testWebhookPing(
  webhookUrl: string,
  businessName = "Outlet Demo"
): Promise<WebhookDispatchResult> {
  const dummyFeedback: FeedbackRecord = {
    id: `test-fb-${Date.now()}`,
    plateCode: "ULK-TEST01",
    businessName: businessName || "Outlet Demo",
    rating: 2,
    feedbackText: "Ini adalah notifikasi uji coba (Test Ping) dari Ulaskami Smart Review Webhook.",
    customerName: "Budi (Tester)",
    customerPhone: "081234567890",
    status: "unread",
    notifiedViaWebhook: true,
    createdAt: new Date().toISOString(),
  };

  return dispatchFeedbackWebhook(webhookUrl, dummyFeedback);
}
