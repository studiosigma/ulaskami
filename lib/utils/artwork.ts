import QRCode from "qrcode";

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
 * Desain 100% identik dengan model fisik pada Landing Page (Google 4-Color Signature)
 */
export async function generatePlateSvg(options: GenerateArtworkOptions): Promise<string> {
  const {
    code,
    businessName = "",
    baseUrl = "https://ulaskami.id",
    style = "google_color_badge",
    format = "square_100",
    includeCropMarks = false,
  } = options;

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/r/${encodeURIComponent(code)}`;
  const { pathData: qrPath, viewBoxSize: qrSize } = await getQrSvgInnerPaths(targetUrl);

  const cleanBusinessName = escapeXml(businessName.trim());
  const cleanCode = escapeXml(code.trim().toUpperCase());

  // Dimensi dasar
  let width = 400;
  let height = 400;

  if (format === "square_120") {
    width = 480;
    height = 480;
  } else if (format === "tent_a6") {
    width = 400;
    height = 540;
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

  // -------------------------------------------------------------------------
  // TEMA A: GOOGLE 4-COLOR SIGNATURE (Persis Foto Fisik di Landing Page)
  // -------------------------------------------------------------------------
  if (style === "google_color_badge") {
    const isPortrait = format === "tent_a6";
    const cardMarginX = isPortrait ? 24 : 26;
    const cardMarginY = isPortrait ? 38 : 34;
    const cardWidth = width - cardMarginX * 2;
    const cardHeight = height - cardMarginY * 2;

    const qrPixelTarget = isPortrait ? 84 : 80;
    const qrScale = qrPixelTarget / qrSize;

    const midY = cardMarginY + (isPortrait ? 230 : 172);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="outer-plate-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="32" ry="32" />
    </clipPath>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.10" />
    </filter>
  </defs>

  <!-- Latar Belakang 4 Sudut Warna Google Persis Landing Page -->
  <g clip-path="url(#outer-plate-clip)">
    <!-- Sudut Kiri Atas: Biru Google (#4285F4) -->
    <rect x="0" y="0" width="${width / 2}" height="${height / 2}" fill="#4285F4" />
    <!-- Sudut Kanan Atas: Merah Google (#EA4335) -->
    <rect x="${width / 2}" y="0" width="${width / 2}" height="${height / 2}" fill="#EA4335" />
    <!-- Sudut Kanan Bawah: Kuning-Oranye Google (#FBBC05) -->
    <rect x="${width / 2}" y="${height / 2}" width="${width / 2}" height="${height / 2}" fill="#FBBC05" />
    <!-- Sudut Kiri Bawah: Hijau Google (#34A853) -->
    <rect x="0" y="${height / 2}" width="${width / 2}" height="${height / 2}" fill="#34A853" />
  </g>

  <!-- Kartu Tengah Putih Bersih dengan Sudut Membulat -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="24" ry="24" fill="#FFFFFF" filter="url(#card-shadow)" />

  <!-- Tab Bulat Logo Google di Bagian Atas Kartu -->
  <circle cx="${width / 2}" cy="${cardMarginY + 14}" r="34" fill="#FFFFFF" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${width / 2 - 20}, ${cardMarginY - 6})">
    ${googleLogoSvg}
  </g>

  <!-- Headline: review us on Google (Persis Foto Landing Page) -->
  <text x="${width / 2}" y="${cardMarginY + 68}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="16" font-weight="500" fill="#202124" letter-spacing="-0.2">
    review us
  </text>
  <text x="${width / 2}" y="${cardMarginY + 104}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="34" font-weight="800" fill="#202124" letter-spacing="-0.8">
    on Google
  </text>

  <!-- Garis Pembagi Vertikal Antara NFC dan QR -->
  <line x1="${width / 2}" y1="${midY - 10}" x2="${width / 2}" y2="${midY + 85}" stroke="#e0e0e0" stroke-width="1.2" stroke-linecap="round" />

  <!-- Badge 'OR' di Tengah Garis (Persis Foto Landing Page) -->
  <rect x="${width / 2 - 13}" y="${midY + 30}" width="26" height="16" rx="4" fill="#FFFFFF" />
  <text x="${width / 2}" y="${midY + 42}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="700" fill="#757575">
    OR
  </text>

  <!-- KOLOM KIRI: TAP YOUR PHONE (Persis Foto Landing Page) -->
  <g transform="translate(${width * 0.28}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#202124" letter-spacing="0.3">
      TAP YOUR PHONE
    </text>

    <!-- Ikon Otentik: Gelombang NFC dalam Elips + Smartphone dipegang Tangan -->
    <g transform="translate(-46, 12)">
      <!-- Elips Gelombang NFC -->
      <ellipse cx="26" cy="35" rx="19" ry="24" fill="none" stroke="#202124" stroke-width="1.8" />
      <path d="M 21 23 A 14 14 0 0 1 21 47" fill="none" stroke="#202124" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 27 28 A 9 9 0 0 1 27 42" fill="none" stroke="#202124" stroke-width="2.4" stroke-linecap="round" />
      <path d="M 33 32 A 4 4 0 0 1 33 38" fill="none" stroke="#202124" stroke-width="2.4" stroke-linecap="round" />

      <!-- Smartphone -->
      <rect x="52" y="15" width="22" height="42" rx="4" fill="#ffffff" stroke="#202124" stroke-width="1.8" />
      <line x1="59" y1="18" x2="67" y2="18" stroke="#202124" stroke-width="1.2" stroke-linecap="round" />
      <text x="63" y="30" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="6.5" font-weight="800" fill="#202124" letter-spacing="0.2">
        NFC
      </text>

      <!-- Tangan memegang smartphone (Persis Foto Landing Page) -->
      <!-- Ibu jari kiri -->
      <path d="M 46 34 C 48 34 52 36 52 40 C 52 43 49 44 47 44 C 45 44 43 41 43 37 C 43 35 44 34 46 34 Z" fill="#ffffff" stroke="#202124" stroke-width="1.8" stroke-linejoin="round" />
      <!-- Jari-jari samping kanan -->
      <path d="M 74 38 C 78 38 80 41 80 44 C 80 47 77 48 74 48" fill="none" stroke="#202124" stroke-width="1.8" stroke-linecap="round" />
      <path d="M 74 44 C 78 44 80 47 80 50 C 80 53 76 54 73 54" fill="none" stroke="#202124" stroke-width="1.8" stroke-linecap="round" />
      <!-- Pergelangan tangan / manset -->
      <path d="M 67 56 L 80 69 L 72 75 L 59 58" fill="#ffffff" stroke="#202124" stroke-width="1.8" stroke-linejoin="round" />
    </g>
  </g>

  <!-- KOLOM KANAN: SCAN QR (Persis Foto Landing Page) -->
  <g transform="translate(${width * 0.72}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#202124" letter-spacing="0.3">
      SCAN QR
    </text>

    <!-- Kotak QR Code dengan Border Halus -->
    <rect x="${-qrPixelTarget / 2 - 4}" y="12" width="${qrPixelTarget + 8}" height="${qrPixelTarget + 8}" rx="8" fill="#ffffff" stroke="#d6d6d6" stroke-width="1" />
    <g transform="translate(${-qrPixelTarget / 2}, 16) scale(${qrScale})">
      <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
    </g>

    <!-- Serial Code di Bawah QR (Persis Foto: e.g. L5GKPCRZ / ULK-XXXXXX) -->
    <text x="0" y="${qrPixelTarget + 31}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, monospace, sans-serif" font-size="9" font-weight="700" fill="#202124" letter-spacing="0.6">
      ${cleanCode}
    </text>
  </g>

  <!-- FOOTER: powered by ulaskami.id (Persis Foto Landing Page) -->
  <g transform="translate(${width / 2}, ${cardMarginY + cardHeight - 20})">
    ${cleanBusinessName ? `
    <text x="0" y="-12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="700" fill="#5f6368">
      ${cleanBusinessName}
    </text>` : ""}
    <text x="0" y="4" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" fill="#3c4043">
      powered by <tspan fill="#1A73E8" font-weight="700">ulaskami.id</tspan>
    </text>
  </g>

  ${cropMarks}
</svg>`;
  }

  // -------------------------------------------------------------
  // TEMA B: DARK LUXURY / MATTE BLACK (Barbershop, Lounge, Cafe)
  // -------------------------------------------------------------
  if (style === "dark_luxury") {
    const isPortrait = format === "tent_a6";
    const cardMarginX = isPortrait ? 24 : 26;
    const cardMarginY = isPortrait ? 38 : 34;
    const cardWidth = width - cardMarginX * 2;
    const cardHeight = height - cardMarginY * 2;

    const qrPixelTarget = isPortrait ? 84 : 80;
    const qrScale = qrPixelTarget / qrSize;
    const midY = cardMarginY + (isPortrait ? 230 : 172);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="outer-plate-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="32" ry="32" />
    </clipPath>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Latar Belakang Matte Black Akrilik -->
  <g clip-path="url(#outer-plate-clip)">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#0f1117" />
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="30" ry="30" fill="none" stroke="#2a2e39" stroke-width="2" />
  </g>

  <!-- Kartu Tengah Obsidian Doff -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="22" ry="22" fill="#181a22" stroke="#252936" stroke-width="1.5" filter="url(#card-shadow)" />

  <!-- Tab Bulat Logo Google di Atas Kartu -->
  <circle cx="${width / 2}" cy="${cardMarginY + 14}" r="34" fill="#1e222d" stroke="#2a2f3d" stroke-width="1.5" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${width / 2 - 20}, ${cardMarginY - 6})">
    ${googleLogoSvg}
  </g>

  <!-- Headline: review us on Google -->
  <text x="${width / 2}" y="${cardMarginY + 68}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="500" fill="#94a3b8" letter-spacing="-0.2">
    review us
  </text>
  <text x="${width / 2}" y="${cardMarginY + 104}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="-0.8">
    on Google
  </text>

  <!-- Garis Pembagi Vertikal -->
  <line x1="${width / 2}" y1="${midY - 10}" x2="${width / 2}" y2="${midY + 85}" stroke="#2a2f3d" stroke-width="1.5" stroke-linecap="round" />

  <!-- Badge 'OR' di Tengah -->
  <rect x="${width / 2 - 13}" y="${midY + 30}" width="26" height="16" rx="4" fill="#1e222d" stroke="#2a2f3d" stroke-width="1" />
  <text x="${width / 2}" y="${midY + 42}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="700" fill="#94a3b8">
    OR
  </text>

  <!-- Kolom Kiri: TAP YOUR PHONE -->
  <g transform="translate(${width * 0.28}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#e2e8f0" letter-spacing="0.3">
      TAP YOUR PHONE
    </text>

    <g transform="translate(-46, 12)">
      <ellipse cx="26" cy="35" rx="19" ry="24" fill="none" stroke="#38bdf8" stroke-width="1.8" />
      <path d="M 21 23 A 14 14 0 0 1 21 47" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 27 28 A 9 9 0 0 1 27 42" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 33 32 A 4 4 0 0 1 33 38" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />

      <rect x="52" y="15" width="22" height="42" rx="4" fill="#13151b" stroke="#38bdf8" stroke-width="1.8" />
      <line x1="59" y1="18" x2="67" y2="18" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round" />
      <text x="63" y="30" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="6.5" font-weight="800" fill="#38bdf8" letter-spacing="0.2">
        NFC
      </text>

      <path d="M 46 34 C 48 34 52 36 52 40 C 52 43 49 44 47 44 C 45 44 43 41 43 37 C 43 35 44 34 46 34 Z" fill="#181a22" stroke="#38bdf8" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M 74 38 C 78 38 80 41 80 44 C 80 47 77 48 74 48" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" />
      <path d="M 74 44 C 78 44 80 47 80 50 C 80 53 76 54 73 54" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" />
      <path d="M 67 56 L 80 69 L 72 75 L 59 58" fill="#181a22" stroke="#38bdf8" stroke-width="1.8" stroke-linejoin="round" />
    </g>
  </g>

  <!-- Kolom Kanan: SCAN QR -->
  <g transform="translate(${width * 0.72}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#e2e8f0" letter-spacing="0.3">
      SCAN QR
    </text>

    <rect x="${-qrPixelTarget / 2 - 4}" y="12" width="${qrPixelTarget + 8}" height="${qrPixelTarget + 8}" rx="8" fill="#ffffff" />
    <g transform="translate(${-qrPixelTarget / 2}, 16) scale(${qrScale})">
      <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
    </g>

    <text x="0" y="${qrPixelTarget + 31}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="700" fill="#94a3b8">
      ${cleanCode}
    </text>
  </g>

  <!-- Footer Bagian Bawah Kartu -->
  <g transform="translate(${width / 2}, ${cardMarginY + cardHeight - 20})">
    ${cleanBusinessName ? `
    <text x="0" y="-12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="700" fill="#94a3b8">
      ${cleanBusinessName}
    </text>` : ""}
    <text x="0" y="4" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" fill="#94a3b8">
      powered by <tspan fill="#38bdf8" font-weight="700">ulaskami.id</tspan>
    </text>
  </g>

  ${cropMarks}
</svg>`;
  }

  // -------------------------------------------------------------
  // TEMA C: FROST WHITE & GOLD ACCENT (Klinik Estetika, Salon, Spa)
  // -------------------------------------------------------------
  if (style === "frost_gold") {
    const isPortrait = format === "tent_a6";
    const cardMarginX = isPortrait ? 24 : 26;
    const cardMarginY = isPortrait ? 38 : 34;
    const cardWidth = width - cardMarginX * 2;
    const cardHeight = height - cardMarginY * 2;

    const qrPixelTarget = isPortrait ? 84 : 80;
    const qrScale = qrPixelTarget / qrSize;
    const midY = cardMarginY + (isPortrait ? 230 : 172);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="outer-plate-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="32" ry="32" />
    </clipPath>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#78350f" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Latar Belakang Frosted Pearlescent Ivory dengan Trim Emas -->
  <g clip-path="url(#outer-plate-clip)">
    <rect x="0" y="0" width="${width}" height="${height}" fill="#faf8f5" />
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="30" ry="30" fill="none" stroke="#e5c97b" stroke-width="2.5" />
  </g>

  <!-- Kartu Tengah Putih Mutiara -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="22" ry="22" fill="#ffffff" stroke="#f2e6cf" stroke-width="1.5" filter="url(#card-shadow)" />

  <!-- Tab Bulat Logo Google di Atas Kartu dengan Gold Ring -->
  <circle cx="${width / 2}" cy="${cardMarginY + 14}" r="34" fill="#fffdf9" stroke="#d4af37" stroke-width="1.8" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${width / 2 - 20}, ${cardMarginY - 6})">
    ${googleLogoSvg}
  </g>

  <!-- 5 Bintang Emas Berkilau -->
  <g transform="translate(${width / 2 - 38}, ${cardMarginY + 54})" fill="#f59e0b">
    <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 10,12 6,9 2,12 3.5,7.5 0,4.5 4.5,4.5" />
    <polygon points="22,0 23.5,4.5 28,4.5 24.5,7.5 26,12 22,9 18,12 19.5,7.5 16,4.5 20.5,4.5" />
    <polygon points="38,0 39.5,4.5 44,4.5 40.5,7.5 42,12 38,9 34,12 35.5,7.5 32,4.5 36.5,4.5" />
    <polygon points="54,0 55.5,4.5 60,4.5 56.5,7.5 58,12 54,9 50,12 51.5,7.5 48,4.5 52.5,4.5" />
    <polygon points="70,0 71.5,4.5 76,4.5 72.5,7.5 74,12 70,9 66,12 67.5,7.5 64,4.5 68.5,4.5" />
  </g>

  <!-- Headline: review us on Google -->
  <text x="${width / 2}" y="${cardMarginY + 84}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="500" fill="#78350f" letter-spacing="-0.2">
    ulas kami di
  </text>
  <text x="${width / 2}" y="${cardMarginY + 114}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="30" font-weight="800" fill="#451a03" letter-spacing="-0.6">
    Google
  </text>

  <!-- Garis Pembagi Vertikal -->
  <line x1="${width / 2}" y1="${midY - 10}" x2="${width / 2}" y2="${midY + 85}" stroke="#f2e6cf" stroke-width="1.5" stroke-linecap="round" />

  <!-- Badge 'ATAU' di Tengah -->
  <rect x="${width / 2 - 13}" y="${midY + 30}" width="26" height="16" rx="4" fill="#fffdfa" stroke="#e5c97b" stroke-width="1" />
  <text x="${width / 2}" y="${midY + 42}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9.5" font-weight="700" fill="#b45309">
    OR
  </text>

  <!-- Kolom Kiri: TAP YOUR PHONE -->
  <g transform="translate(${width * 0.28}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#451a03" letter-spacing="0.3">
      TAP YOUR PHONE
    </text>

    <g transform="translate(-46, 12)">
      <ellipse cx="26" cy="35" rx="19" ry="24" fill="none" stroke="#b45309" stroke-width="1.8" />
      <path d="M 21 23 A 14 14 0 0 1 21 47" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 27 28 A 9 9 0 0 1 27 42" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" />
      <path d="M 33 32 A 4 4 0 0 1 33 38" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" />

      <rect x="52" y="15" width="22" height="42" rx="4" fill="#fffdf9" stroke="#b45309" stroke-width="1.8" />
      <line x1="59" y1="18" x2="67" y2="18" stroke="#b45309" stroke-width="1.2" stroke-linecap="round" />
      <text x="63" y="30" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="6.5" font-weight="800" fill="#b45309" letter-spacing="0.2">
        NFC
      </text>

      <path d="M 46 34 C 48 34 52 36 52 40 C 52 43 49 44 47 44 C 45 44 43 41 43 37 C 43 35 44 34 46 34 Z" fill="#ffffff" stroke="#b45309" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M 74 38 C 78 38 80 41 80 44 C 80 47 77 48 74 48" fill="none" stroke="#b45309" stroke-width="1.8" stroke-linecap="round" />
      <path d="M 74 44 C 78 44 80 47 80 50 C 80 53 76 54 73 54" fill="none" stroke="#b45309" stroke-width="1.8" stroke-linecap="round" />
      <path d="M 67 56 L 80 69 L 72 75 L 59 58" fill="#ffffff" stroke="#b45309" stroke-width="1.8" stroke-linejoin="round" />
    </g>
  </g>

  <!-- Kolom Kanan: SCAN QR -->
  <g transform="translate(${width * 0.72}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="800" fill="#451a03" letter-spacing="0.3">
      SCAN QR
    </text>

    <rect x="${-qrPixelTarget / 2 - 4}" y="12" width="${qrPixelTarget + 8}" height="${qrPixelTarget + 8}" rx="8" fill="#ffffff" stroke="#e5c97b" stroke-width="1" />
    <g transform="translate(${-qrPixelTarget / 2}, 16) scale(${qrScale})">
      <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
    </g>

    <text x="0" y="${qrPixelTarget + 31}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="700" fill="#78350f">
      ${cleanCode}
    </text>
  </g>

  <!-- Footer Bagian Bawah Kartu -->
  <g transform="translate(${width / 2}, ${cardMarginY + cardHeight - 20})">
    ${cleanBusinessName ? `
    <text x="0" y="-12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="700" fill="#78350f">
      ${cleanBusinessName}
    </text>` : ""}
    <text x="0" y="4" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" fill="#78350f">
      powered by <tspan fill="#b45309" font-weight="700">ulaskami.id</tspan>
    </text>
  </g>

  ${cropMarks}
</svg>`;
  }

  // -------------------------------------------------------------
  // FALLBACK: MINIMAL CLEAR STAND
  // -------------------------------------------------------------
  const qrPixelTarget = 120;
  const qrScale = qrPixelTarget / qrSize;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="20" ry="20" fill="#FFFFFF" stroke="#e2e8f0" stroke-width="2" />

  <g transform="translate(${width / 2 - 20}, 32)">
    ${googleLogoSvg}
  </g>

  <text x="${width / 2}" y="104" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="500" fill="#202124">
    review us
  </text>
  <text x="${width / 2}" y="136" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="30" font-weight="800" fill="#202124">
    on Google
  </text>

  <g transform="translate(${width / 2 - qrPixelTarget / 2}, 160) scale(${qrScale})">
    <path d="${qrPath}" fill="#000000" shape-rendering="crispEdges" />
  </g>

  <text x="${width / 2}" y="320" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#475569">
    ${cleanCode}
  </text>

  <text x="${width / 2}" y="356" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11.5" fill="#64748b">
    powered by <tspan fill="#1A73E8" font-weight="700">ulaskami.id</tspan>
  </text>

  ${cropMarks}
</svg>`;
}
