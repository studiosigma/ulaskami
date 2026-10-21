import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export type ArtworkStyle =
  | "google_color_badge"
  | "dark_luxury"
  | "frost_gold"
  | "minimal_clear";
export type ArtworkFormat = "square_100" | "square_120" | "tent_a6";

export interface GenerateArtworkOptions {
  code: string;
  businessName?: string;
  baseUrl?: string;
  style?: ArtworkStyle;
  format?: ArtworkFormat;
  includeCropMarks?: boolean;
}

let cachedTemplateBase64: string | null = null;

function getMasterTemplateBase64(): string {
  if (cachedTemplateBase64) return cachedTemplateBase64;
  try {
    const templatePath = path.join(process.cwd(), "public", "products", "plate-master-template.jpg");
    if (fs.existsSync(templatePath)) {
      cachedTemplateBase64 = fs.readFileSync(templatePath).toString("base64");
      return cachedTemplateBase64;
    }
  } catch (err) {
    console.error("[Artwork Template Error]:", err);
  }
  return "";
}

/**
 * Mengonversi karakter khusus menjadi entitas XML yang aman
 * untuk mencegah error parsing XML pada nama dengan tanda '&' serta celah XSS pada SVG
 */
export function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Menghasilkan data path SVG dari QR Code murni (tanpa tag <svg> pembungkus)
 */
async function getQrSvgInnerPaths(url: string): Promise<{ pathData: string; viewBoxSize: number }> {
  const rawSvg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "H", // High tolerance 30%
    color: {
      dark: "#000000",
      light: "#00000000", // transparent
    },
  });

  const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const size = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 33;

  const pathMatch = rawSvg.match(/<path[^>]*d="([^"]*)"/);
  const pathData = pathMatch ? pathMatch[1] : "";

  return { pathData, viewBoxSize: size };
}

/**
 * Menghasilkan markup SVG vektor siap cetak untuk plat akrilik.
 * Desain master 100% identik dengan model fisik resmi Ulaskami,
 * dan hanya dibedakan pada barcode (QR code) dan kode seri teknis tiap cetakan.
 */
export async function generatePlateSvg(options: GenerateArtworkOptions): Promise<string> {
  const {
    code,
    baseUrl = "https://ulaskami.com",
    style = "google_color_badge",
    includeCropMarks = false,
  } = options;

  const cleanCode = escapeXml(code.trim().toUpperCase());
  const targetUrl = `${baseUrl.replace(/\/$/, "")}/r/${encodeURIComponent(cleanCode)}`;
  const { pathData: qrPath, viewBoxSize: qrSize } = await getQrSvgInnerPaths(targetUrl);

  const b64 = getMasterTemplateBase64();

  // Dimensi master 1024 x 1024
  const width = 1024;
  const height = 1024;

  // Ukuran dan posisi QR Barcode
  const qrPixelTarget = 144;
  const qrScale = qrPixelTarget / qrSize;
  const qrX = 630.5;
  const qrY = 615;

  // Crop marks percetakan jika diminta
  const cropMarks = includeCropMarks
    ? `
    <g stroke="#94a3b8" stroke-width="1.5">
      <line x1="0" y1="40" x2="40" y2="40" />
      <line x1="40" y1="0" x2="40" y2="40" />
      <line x1="${width - 40}" y1="0" x2="${width - 40}" y2="40" />
      <line x1="${width - 40}" y1="40" x2="${width}" y2="40" />
      <line x1="0" y1="${height - 40}" x2="40" y2="${height - 40}" />
      <line x1="40" y1="${height - 40}" x2="40" y2="${height}" />
      <line x1="${width - 40}" y1="${height - 40}" x2="${width}" y2="${height - 40}" />
      <line x1="${width - 40}" y1="${height - 40}" x2="${width - 40}" y2="${height}" />
    </g>
  `
    : "";

  // -------------------------------------------------------------------------
  // FORMAT 1: MODEL STAND MEJA KASIR (L-STAND A6: 10.5 x 14.8 CM)
  // -------------------------------------------------------------------------
  if (options.format === "tent_a6") {
    const standWidth = 800;
    const standHeight = 1130;
    const cardMarginX = 36;
    const cardMarginY = 48;
    const cardWidth = standWidth - cardMarginX * 2;
    const cardHeight = standHeight - cardMarginY * 2;

    const qrPixelTarget = 176;
    const qrScale = qrPixelTarget / qrSize;
    const midY = 560;
    const cleanBusinessName = escapeXml(options.businessName || "");

    const cropMarksStand = includeCropMarks
      ? `
      <g stroke="#94a3b8" stroke-width="1.2">
        <line x1="0" y1="30" x2="30" y2="30" />
        <line x1="30" y1="0" x2="30" y2="30" />
        <line x1="${standWidth - 30}" y1="0" x2="${standWidth - 30}" y2="30" />
        <line x1="${standWidth - 30}" y1="30" x2="${standWidth}" y2="30" />
        <line x1="0" y1="${standHeight - 30}" x2="30" y2="${standHeight - 30}" />
        <line x1="30" y1="${standHeight - 30}" x2="30" y2="${standHeight}" />
        <line x1="${standWidth - 30}" y1="${standHeight - 30}" x2="${standWidth}" y2="${standHeight - 30}" />
        <line x1="${standWidth - 30}" y1="${standHeight - 30}" x2="${standWidth - 30}" y2="${standHeight}" />
      </g>
    `
      : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${standWidth} ${standHeight}" width="${standWidth}" height="${standHeight}">
  <defs>
    <clipPath id="outer-stand-clip">
      <rect x="0" y="0" width="${standWidth}" height="${standHeight}" rx="32" ry="32" />
    </clipPath>
    <filter id="stand-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.10" />
    </filter>
  </defs>

  <!-- Google 4-Color Signature Corners (Model Stand Meja Kasir Otentik) -->
  <g clip-path="url(#outer-stand-clip)">
    <rect x="0" y="0" width="${standWidth * 0.48}" height="${standHeight * 0.48}" fill="#4285F4" />
    <rect x="${standWidth * 0.48}" y="0" width="${standWidth * 0.52}" height="${standHeight * 0.40}" fill="#EA4335" />
    <rect x="${standWidth * 0.48}" y="${standHeight * 0.40}" width="${standWidth * 0.52}" height="${standHeight * 0.60}" fill="#FBBC05" />
    <rect x="0" y="${standHeight * 0.48}" width="${standWidth * 0.48}" height="${standHeight * 0.52}" fill="#34A853" />
  </g>

  <!-- Kartu Tengah Putih Bersih dengan Sudut Membulat -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="28" ry="28" fill="#FFFFFF" filter="url(#stand-shadow)" />

  <!-- Tab Bulat Logo Google di Bagian Atas Kartu -->
  <circle cx="${standWidth / 2}" cy="${cardMarginY + 28}" r="58" fill="#FFFFFF" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${standWidth / 2 - 40}, ${cardMarginY - 12})">
    <g transform="scale(1.7)">
      <path d="M44.5 20 H24 V28.5 H35.8 C34.7 34.2 29.8 37.5 24 37.5 C16.5 37.5 10.5 31.5 10.5 24 C10.5 16.5 16.5 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C11.6 1.5 1.5 11.6 1.5 24 C1.5 36.4 11.6 46.5 24 46.5 C36.4 46.5 45 37.5 45 24 C45 22.6 44.8 21.3 44.5 20 Z" fill="#4285F4"/>
      <path d="M6.3 14.7 L13.3 19.8 C15.2 14.3 20.3 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C16.4 1.5 9.8 5.7 6.3 14.7 Z" fill="#34A853"/>
      <path d="M24 46.5 C29.8 46.5 34.8 44.4 38.6 40.8 L31.8 35.2 C29.8 36.6 27.1 37.5 24 37.5 C18.3 37.5 13.4 34.2 11.6 29.2 L4.6 34.6 C8.1 41.6 15.5 46.5 24 46.5 Z" fill="#FBBC05"/>
      <path d="M4.6 13.4 C3.6 16.6 3 20.2 3 24 C3 27.8 3.6 31.4 4.6 34.6 L11.6 29.2 C11.1 27.6 10.5 25.8 10.5 24 C10.5 22.2 11.1 20.4 11.6 18.8 L4.6 13.4 Z" fill="#EA4335"/>
    </g>
  </g>

  <!-- Headline: review us on Google -->
  <text x="${standWidth / 2}" y="${cardMarginY + 128}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="28" font-weight="500" fill="#202124" letter-spacing="-0.3">
    review us
  </text>
  <text x="${standWidth / 2}" y="${cardMarginY + 188}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="56" font-weight="800" fill="#202124" letter-spacing="-1.2">
    on Google
  </text>

  <!-- Garis Pembagi Vertikal Antara NFC dan QR -->
  <line x1="${standWidth / 2}" y1="${midY - 40}" x2="${standWidth / 2}" y2="${midY + 170}" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round" />

  <!-- Badge 'OR' di Tengah Garis -->
  <rect x="${standWidth / 2 - 20}" y="${midY + 50}" width="40" height="26" rx="6" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" />
  <text x="${standWidth / 2}" y="${midY + 68}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800" fill="#6B7280">
    OR
  </text>

  <!-- KOLOM KIRI: TAP YOUR PHONE -->
  <g transform="translate(${standWidth * 0.27}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="800" fill="#202124" letter-spacing="0.5">
      TAP YOUR PHONE
    </text>

    <!-- Ikon Otentik: Gelombang NFC dalam Elips + Smartphone dipegang Tangan -->
    <g transform="translate(-74, 25)">
      <ellipse cx="40" cy="54" rx="30" ry="38" fill="none" stroke="#202124" stroke-width="2.8" />
      <path d="M 32 36 A 22 22 0 0 1 32 72" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 42 43 A 14 14 0 0 1 42 65" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 52 50 A 6 6 0 0 1 52 58" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />

      <rect x="80" y="24" width="34" height="66" rx="6" fill="#ffffff" stroke="#202124" stroke-width="2.8" />
      <line x1="91" y1="29" x2="103" y2="29" stroke="#202124" stroke-width="1.8" stroke-linecap="round" />
      <text x="97" y="48" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="800" fill="#202124" letter-spacing="0.3">
        NFC
      </text>

      <path d="M 72 53 C 75 53 80 56 80 62 C 80 67 76 68 73 68 C 70 68 67 63 67 58 C 67 55 69 53 72 53 Z" fill="#ffffff" stroke="#202124" stroke-width="2.8" stroke-linejoin="round" />
      <path d="M 114 59 C 120 59 123 64 123 68 C 123 73 118 74 114 74" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round" />
      <path d="M 114 74 C 119 74 122 78 122 82 C 122 86 117 87 114 87" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round" />
    </g>

    <text x="0" y="145" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="600" fill="#64748B">
      Tempelkan ke sini
    </text>
  </g>

  <!-- KOLOM KANAN: SCAN QR -->
  <g transform="translate(${standWidth * 0.73}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="800" fill="#202124" letter-spacing="0.5">
      SCAN QR
    </text>

    <!-- Kartu QR Barcode -->
    <rect x="${-qrPixelTarget / 2 - 12}" y="16" width="${qrPixelTarget + 24}" height="${qrPixelTarget + 24}" rx="14" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" />
    <g transform="translate(${-qrPixelTarget / 2}, 28) scale(${qrScale})">
      <path d="${qrPath}" stroke="#000000" stroke-width="1" fill="none" shape-rendering="crispEdges" />
    </g>

    <text x="0" y="${qrPixelTarget + 66}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, monospace, sans-serif" font-size="17" font-weight="700" fill="#1F2937" letter-spacing="1.2">
      ${cleanCode}
    </text>
  </g>

  <!-- Bagian Bawah: Nama Bisnis & Footer Powered by -->
  <g transform="translate(${standWidth / 2}, ${cardMarginY + cardHeight - 64})">
    ${cleanBusinessName ? `<text x="0" y="-12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', sans-serif" font-size="20" font-weight="700" fill="#111827">${cleanBusinessName}</text>` : ""}
    <text x="0" y="22" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" fill="#4B5563">
      powered by <tspan fill="#1A73E8" font-weight="800">ulaskami.com</tspan>
    </text>
  </g>

  <!-- Label Teknis Model di Margin Bawah -->
  <g transform="translate(${standWidth / 2}, ${standHeight - 12})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="700" fill="#94A3B8" letter-spacing="1">
      MODEL STAND MEJA KASIR (L-STAND A6 &bull; 10.5 &times; 14.8 CM)
    </text>
  </g>

  ${cropMarksStand}
</svg>`;
  }

  // -------------------------------------------------------------------------
  // FORMAT 2: MODEL TEMPEL KACA & ETALASE (SQUARE 1:1 - 1024 x 1024)
  // -------------------------------------------------------------------------
  // Jika master template JPG tersedia, render desain otentik 100% dengan dynamic barcode
  if (b64 && (style === "google_color_badge" || !style)) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- Master Authentic Acrylic Artwork Template (Google 4-Color Signature) -->
  <image href="data:image/jpeg;base64,${b64}" x="0" y="0" width="${width}" height="${height}" />

  <!-- Dynamic Barcode / QR Code Box -->
  <rect x="616" y="596" width="173" height="182" rx="14" fill="#FFFFFF" stroke="#D7DADE" stroke-width="2" />

  <!-- Unique Vector QR Barcode for this specific plate -->
  <g transform="translate(${qrX}, ${qrY}) scale(${qrScale})">
    <path d="${qrPath}" stroke="#000000" stroke-width="1" fill="none" shape-rendering="crispEdges" />
  </g>

  <!-- Unique Serial Code for this specific plate -->
  <text x="702.5" y="802" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, monospace, sans-serif" font-size="19" font-weight="700" fill="#202124" letter-spacing="1.2">${cleanCode}</text>

  ${cropMarks}
</svg>`;
  }

  // Fallback Pure Vector SVG jika template base64 tidak terbaca
  const googleLogoSvg = `
    <g transform="scale(0.85)">
      <path d="M44.5 20 H24 V28.5 H35.8 C34.7 34.2 29.8 37.5 24 37.5 C16.5 37.5 10.5 31.5 10.5 24 C10.5 16.5 16.5 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C11.6 1.5 1.5 11.6 1.5 24 C1.5 36.4 11.6 46.5 24 46.5 C36.4 46.5 45 37.5 45 24 C45 22.6 44.8 21.3 44.5 20 Z" fill="#4285F4"/>
      <path d="M6.3 14.7 L13.3 19.8 C15.2 14.3 20.3 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C16.4 1.5 9.8 5.7 6.3 14.7 Z" fill="#34A853"/>
      <path d="M24 46.5 C29.8 46.5 34.8 44.4 38.6 40.8 L31.8 35.2 C29.8 36.6 27.1 37.5 24 37.5 C18.3 37.5 13.4 34.2 11.6 29.2 L4.6 34.6 C8.1 41.6 15.5 46.5 24 46.5 Z" fill="#FBBC05"/>
      <path d="M4.6 13.4 C3.6 16.6 3 20.2 3 24 C3 27.8 3.6 31.4 4.6 34.6 L11.6 29.2 C11.1 27.6 10.5 25.8 10.5 24 C10.5 22.2 11.1 20.4 11.6 18.8 L4.6 13.4 Z" fill="#EA4335"/>
    </g>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <clipPath id="outer-plate-clip">
      <rect x="0" y="0" width="400" height="400" rx="32" ry="32" />
    </clipPath>
  </defs>

  <g clip-path="url(#outer-plate-clip)">
    <rect x="0" y="0" width="200" height="200" fill="#4285F4" />
    <rect x="200" y="0" width="200" height="200" fill="#EA4335" />
    <rect x="200" y="200" width="200" height="200" fill="#FBBC05" />
    <rect x="0" y="200" width="200" height="200" fill="#34A853" />
  </g>

  <rect x="26" y="34" width="348" height="332" rx="24" ry="24" fill="#FFFFFF" />
  <circle cx="200" cy="48" r="34" fill="#FFFFFF" />

  <g transform="translate(180, 28)">
    ${googleLogoSvg}
  </g>

  <text x="200" y="102" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="16" font-weight="500" fill="#202124">review us</text>
  <text x="200" y="138" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="34" font-weight="800" fill="#202124" letter-spacing="-0.8">on Google</text>

  <line x1="200" y1="196" x2="200" y2="291" stroke="#e0e0e0" stroke-width="1.2" stroke-linecap="round" />
  <rect x="187" y="236" width="26" height="16" rx="4" fill="#FFFFFF" />
  <text x="200" y="248" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="700" fill="#757575">OR</text>

  <g transform="translate(112, 206)">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#202124">TAP YOUR PHONE</text>
  </g>

  <g transform="translate(288, 206)">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#202124">SCAN QR</text>
    <rect x="-44" y="12" width="88" height="88" rx="8" fill="#ffffff" stroke="#d6d6d6" stroke-width="1" />
    <g transform="translate(-40, 16) scale(${80 / qrSize})">
      <path d="${qrPath}" stroke="#000000" stroke-width="1" fill="none" shape-rendering="crispEdges" />
    </g>
    <text x="0" y="111" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, monospace, sans-serif" font-size="9" font-weight="700" fill="#202124">${cleanCode}</text>
  </g>

  <g transform="translate(200, 346)">
    <text x="0" y="4" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" fill="#3c4043">
      powered by <tspan fill="#1A73E8" font-weight="700">ulaskami.com</tspan>
    </text>
  </g>

  ${cropMarks}
</svg>`;
}
