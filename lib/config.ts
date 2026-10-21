export const SITE_CONFIG = {
  appName: "Ulaskami",
  tagline: "NFC + QR Review Plate untuk Bisnis Anda",
  domain: "ulaskami.com",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://ulaskami.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
  supportEmail: "halo@ulaskami.com",

  /**
   * Mengembalikan URL tap NFC dan QR resmi
   */
  getNfcRedirectUrl(code: string): string {
    const base = (process.env.NEXT_PUBLIC_APP_URL || "https://ulaskami.com").replace(/\/$/, "");
    return `${base}/r/${code}`;
  },

  /**
   * Helper untuk membuat link WhatsApp langsung dengan pesan terenkripsi
   */
  getWhatsAppLink(message: string): string {
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
    return SITE_CONFIG.createCustomWhatsAppLink(rawNumber, message);
  },

  /**
   * Helper untuk membuat link WhatsApp ke nomor spesifik dengan normalisasi nomor Indonesia
   */
  createCustomWhatsAppLink(phoneNumber: string, message: string): string {
    let clean = (phoneNumber || "").replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    if (!clean.startsWith("62") && clean.length > 8) {
      clean = "62" + clean;
    }
    const finalNumber = clean || "6281234567890";
    return `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
  },
};

