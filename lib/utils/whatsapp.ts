import { SITE_CONFIG } from "../config";

export interface ComplaintMessageParams {
  businessName: string;
  plateCode: string;
  rating: number;
  feedbackText: string;
  customerName?: string;
  customerPhone?: string;
}

/**
 * Format nomor WhatsApp ke format internasional 62...
 */
export function normalizeWhatsappNumber(raw: string): string {
  let cleaned = raw.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("+62")) {
    cleaned = cleaned.slice(1);
  } else if (!cleaned.startsWith("62") && cleaned.length > 5) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

/**
 * Format teks notifikasi peringatan komplain untuk WhatsApp pengelola/owner
 */
export function formatOwnerAlertWhatsappText(params: ComplaintMessageParams): string {
  const ratingStars = "⭐".repeat(Math.max(1, Math.min(5, params.rating)));
  const senderInfo = params.customerName ? params.customerName : "Pelanggan Anonim";
  const phoneInfo = params.customerPhone ? params.customerPhone : "Tidak dicantumkan";

  return `🚨 *[ULASKAMI] ALERT PERINGATAN REVIEW NEGATIF* 🚨

🏪 *Outlet:* ${params.businessName} (${params.plateCode})
⭐ *Skor Rating:* ${params.rating}/5 ${ratingStars}
👤 *Pelanggan:* ${senderInfo}
📱 *No. HP Pelanggan:* ${phoneInfo}

💬 *Isi Masukan / Kritik:*
"${params.feedbackText.trim()}"

⚠️ *Tindakan Cepat Diperlukan:*
Masukan ini telah disaring secara privat oleh sistem Ulaskami sebelum masuk ke Google Maps publik. Segera tindak lanjuti dan hubungi pelanggan agar ulasan publik tetap terlindungi!`;
}

/**
 * Buat link WhatsApp langsung ke pengelola toko
 */
export function createOwnerAlertWhatsappLink(
  ownerPhone: string,
  params: ComplaintMessageParams
): string {
  const cleanPhone = normalizeWhatsappNumber(ownerPhone || SITE_CONFIG.whatsappNumber);
  const message = formatOwnerAlertWhatsappText(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Buat link WhatsApp bagi merchant untuk menghubungi & meminta maaf / memberi kompensasi ke pelanggan
 */
export function createCustomerResolutionWhatsappLink(
  customerPhone: string,
  businessName: string,
  customerName?: string
): string {
  const cleanPhone = normalizeWhatsappNumber(customerPhone);
  const greetingName = customerName ? `Kak ${customerName}` : "Kak";
  const message = `Halo ${greetingName}, salam hangat dari manajemen *${businessName}*.

Kami telah menerima masukan yang Anda sampaikan melalui Ulaskami Smart Review. Kami memohon maaf yang sebesar-besarnya atas ketidaknyamanan yang dialami saat berkunjung.

Kenyamanan dan kepuasan Anda adalah prioritas utama kami. Boleh kami tahu lebih detail bagaimana kami dapat memperbaiki pengalaman Anda ke depannya?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
