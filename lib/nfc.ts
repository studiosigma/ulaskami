import { SITE_CONFIG } from "./config";

export interface NfcChipSpec {
  name: string;
  userMemoryBytes: number;
  maxNdefBytes: number;
}

export const NFC_CHIP_SPECS: Record<string, NfcChipSpec> = {
  NTAG213: {
    name: "NTAG213 (Standar Ulaskami)",
    userMemoryBytes: 144,
    maxNdefBytes: 137,
  },
  NTAG215: {
    name: "NTAG215 (Memori Menengah)",
    userMemoryBytes: 504,
    maxNdefBytes: 492,
  },
  NTAG216: {
    name: "NTAG216 (Memori Ekstra Besar)",
    userMemoryBytes: 888,
    maxNdefBytes: 872,
  },
};

export interface NfcPayloadAnalysis {
  url: string;
  urlByteLength: number;
  ndefEstimatedBytes: number;
  chip: {
    ntag213: {
      capacity: number;
      used: number;
      free: number;
      percentUsed: number;
      isCompatible: boolean;
    };
  };
}

/**
 * Menghasilkan URL target tap NFC untuk serial plate tertentu
 */
export function getNfcTargetUrl(code: string): string {
  const cleanCode = (code || "").trim().toUpperCase();
  return SITE_CONFIG.getNfcRedirectUrl(cleanCode);
}

/**
 * Menghitung estimasi konsumsi byte NDEF pada chip NTAG213 (144 bytes)
 * Format NDEF URI Record menggunakan prefix byte 0x04 untuk "https://"
 */
export function analyzeNfcPayload(url: string): NfcPayloadAnalysis {
  const trimmed = url.trim();
  const rawByteLength = Buffer.byteLength(trimmed, "utf-8");

  // Jika URL diawali "https://", NDEF URI record menyingkatnya menjadi 1 identifier byte (0x04)
  let payloadBytes = rawByteLength;
  if (trimmed.startsWith("https://")) {
    payloadBytes = Buffer.byteLength(trimmed.replace(/^https:\/\//, ""), "utf-8") + 1;
  } else if (trimmed.startsWith("http://")) {
    payloadBytes = Buffer.byteLength(trimmed.replace(/^http:\/\//, ""), "utf-8") + 1;
  }

  // Overhead NDEF Message:
  // - 1 byte TLV Tag (0x03)
  // - 1 byte TLV Length
  // - 1 byte NDEF Header (MB=1, ME=1, SR=1, TNF=0x01)
  // - 1 byte Type Length (1)
  // - 1 byte Payload Length
  // - 1 byte Type ('U')
  // - 1 byte Terminator TLV (0xFE)
  const ndefEstimatedBytes = payloadBytes + 7;

  const ntag213Capacity = NFC_CHIP_SPECS.NTAG213.userMemoryBytes;
  const isCompatible = ndefEstimatedBytes <= NFC_CHIP_SPECS.NTAG213.maxNdefBytes;
  const percentUsed = Math.min(100, Math.round((ndefEstimatedBytes / ntag213Capacity) * 100));

  return {
    url: trimmed,
    urlByteLength: rawByteLength,
    ndefEstimatedBytes,
    chip: {
      ntag213: {
        capacity: ntag213Capacity,
        used: ndefEstimatedBytes,
        free: Math.max(0, ntag213Capacity - ndefEstimatedBytes),
        percentUsed,
        isCompatible,
      },
    },
  };
}

/**
 * Panduan SOP teknis penulisan chip NFC untuk staf operasional dan percetakan
 */
export const NFC_FLASHING_SOP = {
  recommendedApp: "NFC Tools (Gratis di Google Play Store & Apple App Store)",
  desktopHardware: "ACR122U USB NFC Reader/Writer (Opsional untuk produksi massal)",
  steps: [
    {
      step: 1,
      title: "Buka Aplikasi NFC Tools",
      desc: "Pilih menu 'Write' (Tulis) -> 'Add a record' (Tambah catatan).",
    },
    {
      step: 2,
      title: "Pilih Tipe Record 'Custom URL / URI'",
      desc: "Masukkan URL tap pendek plate: https://ulaskami.com/r/[KODE_PLATE].",
    },
    {
      step: 3,
      title: "Tempelkan Smartphone ke Chip NFC",
      desc: "Tekan 'Write / Simpan' dan tempelkan bagian belakang ponsel ke stiker atau stand akrilik sampai muncul centang hijau.",
    },
    {
      step: 4,
      title: "Verifikasi Tap & Lock (Opsional)",
      desc: "Uji tap dengan iPhone/Android lain untuk memastikan redirect berjalan instan. Untuk produksi komersial, kunci chip (Set Read-Only) agar URL tidak bisa ditimpa pihak lain.",
    },
  ],
};
