import QRCode from "qrcode";

export type ArtworkStyle = "google_color_badge" | "minimal_clear";
export type ArtworkFormat = "square_100" | "square_120" | "tent_a6";

export interface GenerateArtworkOptions {
  code: string;
  businessName?: string;
  baseUrl?: string;
  style?: ArtworkStyle;
  format?: ArtworkFormat;
  includeCropMarks?: boolean;
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

  // Ambil viewBox size
  const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const size = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 33;

  // Ekstrak path d="..."
  const pathMatch = rawSvg.match(/<path[^>]*d="([^"]*)"/);
  const pathData = pathMatch ? pathMatch[1] : "";

  return { pathData, viewBoxSize: size };
}

/**
 * Menghasilkan markup SVG vektor siap cetak untuk plat akrilik
 */
export async function generatePlateSvg(options: GenerateArtworkOptions): Promise<string> {
  const {
    code,
    businessName = "Bisnis Anda",
    baseUrl = "https://ulaskami.id",
    style = "google_color_badge",
    format = "square_100",
    includeCropMarks = false,
  } = options;

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/r/${encodeURIComponent(code)}`;
  const { pathData: qrPath, viewBoxSize: qrSize } = await getQrSvgInnerPaths(targetUrl);

  const cleanBusinessName = escapeXml(businessName.trim() || "Bisnis Kami");
  const cleanCode = escapeXml(code.trim().toUpperCase());

  // Dimensi dasar
  let width = 400;
  let height = 400;

  if (format === "square_120") {
    width = 480;
    height = 480;
  } else if (format === "tent_a6") {
    width = 420;
    height = 592;
  }

  // Google G Official Logo Path SVG
  const googleLogoSvg = `
    <g transform="scale(0.85)">
      <!-- Google Blue -->
      <path d="M44.5 20 H24 V28.5 H35.8 C34.7 34.2 29.8 37.5 24 37.5 C16.5 37.5 10.5 31.5 10.5 24 C10.5 16.5 16.5 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C11.6 1.5 1.5 11.6 1.5 24 C1.5 36.4 11.6 46.5 24 46.5 C36.4 46.5 45 37.5 45 24 C45 22.6 44.8 21.3 44.5 20 Z" fill="#4285F4"/>
      <!-- Google Green -->
      <path d="M6.3 14.7 L13.3 19.8 C15.2 14.3 20.3 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C16.4 1.5 9.8 5.7 6.3 14.7 Z" fill="#34A853"/>
      <!-- Google Yellow -->
      <path d="M24 46.5 C29.8 46.5 34.8 44.4 38.6 40.8 L31.8 35.2 C29.8 36.6 27.1 37.5 24 37.5 C18.3 37.5 13.4 34.2 11.6 29.2 L4.6 34.6 C8.1 41.6 15.5 46.5 24 46.5 Z" fill="#FBBC05"/>
      <!-- Google Red -->
      <path d="M4.6 13.4 C3.6 16.6 3 20.2 3 24 C3 27.8 3.6 31.4 4.6 34.6 L11.6 29.2 C11.1 27.6 10.5 25.8 10.5 24 C10.5 22.2 11.1 20.4 11.6 18.8 L4.6 13.4 Z" fill="#EA4335"/>
    </g>
  `;

  // Crop marks jika diminta
  const cropMarks = includeCropMarks
    ? `
    <g stroke="#94a3b8" stroke-width="0.8">
      <line x1="0" y1="20" x2="20" y2="20" />
      <line x1="20" y1="0" x2="20" y2="20" />
      <line x1="${width - 20}" y1="0" x2="${width - 20}" y2="20" />
      <line x1="${width - 20}" y1="20" x2="${width}" y2="20" />
      <line x1="0" y1="${height - 20}" x2="20" y2="${height - 20}" />
      <line x1="20" y1="${height - 20}" x2="20" y2="${height}" />
      <line x1="${width - 20}" y1="${height - 20}" x2="${width}" y2="${height - 20}" />
      <line x1="${width - 20}" y1="${height - 20}" x2="${width - 20}" y2="${height}" />
    </g>
  `
    : "";

  // -------------------------------------------------------------
  // OPSI 2: GOOGLE 4-COLOR BADGE (Etalase Kaca & Meja Kasir)
  // -------------------------------------------------------------
  if (style === "google_color_badge") {
    const cardMarginX = 24;
    const cardMarginY = 32;
    const cardWidth = width - cardMarginX * 2;
    const cardHeight = height - cardMarginY * 2;

    const qrPixelTarget = 95;
    const qrScale = qrPixelTarget / qrSize;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="outer-plate-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="32" ry="32" />
    </clipPath>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Latar Belakang 4 Warna Ikonik Google -->
  <g clip-path="url(#outer-plate-clip)">
    <!-- Sudut Kiri Atas: Biru Google -->
    <rect x="0" y="0" width="${width / 2}" height="${height / 2}" fill="#4285F4" />
    <!-- Sudut Kanan Atas: Merah Google -->
    <rect x="${width / 2}" y="0" width="${width / 2}" height="${height / 2}" fill="#EA4335" />
    <!-- Sudut Kanan Bawah: Kuning-Oranye Google -->
    <rect x="${width / 2}" y="${height / 2}" width="${width / 2}" height="${height / 2}" fill="#FBBC05" />
    <!-- Sudut Kiri Bawah: Hijau Google -->
    <rect x="0" y="${height / 2}" width="${width / 2}" height="${height / 2}" fill="#34A853" />
  </g>

  <!-- Kartu Tengah Putih -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="22" ry="22" fill="#FFFFFF" filter="url(#card-shadow)" />

  <!-- Tab Bulat Logo Google di Atas Kartu -->
  <circle cx="${width / 2}" cy="${cardMarginY + 12}" r="32" fill="#FFFFFF" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${width / 2 - 20}, ${cardMarginY - 8})">
    ${googleLogoSvg}
  </g>

  <!-- Headline: review us on Google -->
  <text x="${width / 2}" y="${cardMarginY + 68}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#64748b" letter-spacing="0.4">
    ulas kami di
  </text>
  <text x="${width / 2}" y="${cardMarginY + 92}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#0f172a" letter-spacing="-0.5">
    Google
  </text>

  <!-- Garis Pembagi Vertikal -->
  <line x1="${width / 2}" y1="${cardMarginY + 115}" x2="${width / 2}" y2="${cardMarginY + 235}" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round" />

  <!-- Badge 'ATAU' di Tengah -->
  <rect x="${width / 2 - 14}" y="${cardMarginY + 165}" width="28" height="16" rx="4" fill="#FFFFFF" stroke="#e2e8f0" stroke-width="1" />
  <text x="${width / 2}" y="${cardMarginY + 177}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#94a3b8">
    ATAU
  </text>

  <!-- Kolom Kiri: TAP HP ANDA (NFC) -->
  <g transform="translate(${width / 4 + 8}, ${cardMarginY + 115})">
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9.5" font-weight="800" fill="#334155" letter-spacing="0.5">
      TAP HP ANDA
    </text>

    <!-- Ikon Smartphone + NFC Wave -->
    <g transform="translate(-18, 16)">
      <rect x="0" y="0" width="36" height="62" rx="7" fill="none" stroke="#2563eb" stroke-width="2.5" />
      <circle cx="18" cy="8" r="1.5" fill="#2563eb" />
      <rect x="10" y="52" width="16" height="2" rx="1" fill="#2563eb" />
      <text x="18" y="36" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9.5" font-weight="900" fill="#2563eb" letter-spacing="0.5">
        NFC
      </text>

      <!-- Gelombang NFC Kiri & Kanan -->
      <path d="M -8 24 A 14 14 0 0 0 -8 40" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" />
      <path d="M -14 18 A 22 22 0 0 0 -14 46" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 44 24 A 14 14 0 0 1 44 40" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 50 18 A 22 22 0 0 1 50 46" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" />
    </g>

    <text x="0" y="100" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="600" fill="#64748b">
      Tempelkan ke sini
    </text>
  </g>

  <!-- Kolom Kanan: SCAN QR -->
  <g transform="translate(${width * 0.75 - 8}, ${cardMarginY + 115})">
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9.5" font-weight="800" fill="#334155" letter-spacing="0.5">
      SCAN QR
    </text>

    <!-- Matriks QR Code Vektor Presisi Tinggi -->
    <g transform="translate(${-qrPixelTarget / 2}, 16) scale(${qrScale})">
      <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
    </g>

    <!-- Serial Code di Bawah QR -->
    <text x="0" y="125" text-anchor="middle" font-family="monospace" font-size="9" font-weight="700" fill="#475569">
      ${cleanCode}
    </text>
  </g>

  <!-- Footer Bagian Bawah Kartu -->
  <g transform="translate(${width / 2}, ${cardMarginY + cardHeight - 24})">
    <!-- Nama Bisnis -->
    <text x="0" y="-14" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11.5" font-weight="700" fill="#0f172a">
      ${cleanBusinessName}
    </text>

    <!-- Powered by ulaskami.id (ulaskami.id berwarna biru hyperlink) -->
    <text x="0" y="6" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9.5" fill="#64748b">
      Powered by <tspan fill="#2563eb" font-weight="700">ulaskami.id</tspan>
    </text>
  </g>

  ${cropMarks}
</svg>`;
  }

  // -------------------------------------------------------------
  // OPSI 1: TABLETOP STAND (Minimalis Bening Meja Kafe / Kasir)
  // -------------------------------------------------------------
  const qrPixelTarget = 140;
  const qrScale = qrPixelTarget / qrSize;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="stand-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="24" ry="24" />
    </clipPath>
  </defs>

  <!-- Background Akrilik Bersih dengan Border Tipis -->
  <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="20" ry="20" fill="#FFFFFF" stroke="#e2e8f0" stroke-width="2" />

  <!-- Logo Google G Resmi di Bagian Atas -->
  <g transform="translate(${width / 2 - 20}, 36)">
    ${googleLogoSvg}
  </g>

  <!-- 5 Bintang Emas -->
  <g transform="translate(${width / 2 - 45}, 86)" fill="#FBBC05">
    <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" />
    <polygon points="28,1 30,7 36,7 31,11 33,17 28,13 23,17 25,11 20,7 26,7" />
    <polygon points="46,1 48,7 54,7 49,11 51,17 46,13 41,17 43,11 38,7 44,7" />
    <polygon points="64,1 66,7 72,7 67,11 69,17 64,13 59,17 61,11 56,7 62,7" />
    <polygon points="82,1 84,7 90,7 85,11 87,17 82,13 77,17 79,11 74,7 80,7" />
  </g>

  <!-- Headline -->
  <text x="${width / 2}" y="122" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="800" fill="#0f172a" letter-spacing="-0.3">
    Ulas Kami di Google
  </text>
  <text x="${width / 2}" y="142" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="#64748b">
    Tap HP (NFC) atau Scan QR Code
  </text>

  <!-- Matriks QR Code Tengah -->
  <g transform="translate(${width / 2 - qrPixelTarget / 2}, 160) scale(${qrScale})">
    <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
  </g>

  <!-- NFC Wave Badge di Bawah QR -->
  <g transform="translate(${width / 2 - 40}, 312)">
    <rect x="0" y="0" width="80" height="24" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1" />
    <text x="40" y="16" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#2563eb">
      ((( NFC Tap )))
    </text>
  </g>

  <!-- Nama Bisnis & Serial Teknis -->
  <text x="${width / 2}" y="356" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">
    ${cleanBusinessName}
  </text>
  <text x="${width / 2}" y="372" text-anchor="middle" font-family="monospace" font-size="9" font-weight="600" fill="#94a3b8">
    ${cleanCode}
  </text>

  <!-- Footer Powered by ulaskami.id (warna biru hyperlink) -->
  <text x="${width / 2}" y="390" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9.5" fill="#64748b">
    Powered by <tspan fill="#2563eb" font-weight="700">ulaskami.id</tspan>
  </text>

  ${cropMarks}
</svg>`;
}
