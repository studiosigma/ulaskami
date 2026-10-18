import QRCode from "qrcode";
import fs from "fs";

export async function generateStandMejaKasirSvg(options: {
  code: string;
  businessName?: string;
  baseUrl?: string;
  includeCropMarks?: boolean;
}): Promise<string> {
  const {
    code = "ULK-000001",
    businessName = "Kopi Kenangan Senopati (Demo)",
    baseUrl = "https://ulaskami.id",
    includeCropMarks = true,
  } = options;

  const cleanCode = code.trim().toUpperCase();
  const cleanBusinessName = (businessName || "").trim();
  const targetUrl = `${baseUrl.replace(/\/$/, "")}/r/${encodeURIComponent(cleanCode)}`;

  const rawSvg = await QRCode.toString(targetUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "H",
    color: { dark: "#000000", light: "#00000000" },
  });

  const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const qrSize = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 33;
  const pathMatch = rawSvg.match(/<path[^>]*d="([^"]*)"/);
  const qrPath = pathMatch ? pathMatch[1] : "";

  // Dimensi Master A6: 10.5 cm x 14.8 cm (800 x 1130 px @ 200 DPI vector ratio)
  const width = 800;
  const height = 1130;
  const cardMarginX = 36;
  const cardMarginY = 48;
  const cardWidth = width - cardMarginX * 2;
  const cardHeight = height - cardMarginY * 2;

  const qrPixelTarget = 176;
  const qrScale = qrPixelTarget / qrSize;
  const midY = 560;

  const googleLogoSvg = `
    <g transform="scale(1.7)">
      <path d="M44.5 20 H24 V28.5 H35.8 C34.7 34.2 29.8 37.5 24 37.5 C16.5 37.5 10.5 31.5 10.5 24 C10.5 16.5 16.5 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C11.6 1.5 1.5 11.6 1.5 24 C1.5 36.4 11.6 46.5 24 46.5 C36.4 46.5 45 37.5 45 24 C45 22.6 44.8 21.3 44.5 20 Z" fill="#4285F4"/>
      <path d="M6.3 14.7 L13.3 19.8 C15.2 14.3 20.3 10.5 24 10.5 C27.3 10.5 30.2 11.7 32.5 13.8 L38.8 7.5 C34.9 3.8 29.8 1.5 24 1.5 C16.4 1.5 9.8 5.7 6.3 14.7 Z" fill="#34A853"/>
      <path d="M24 46.5 C29.8 46.5 34.8 44.4 38.6 40.8 L31.8 35.2 C29.8 36.6 27.1 37.5 24 37.5 C18.3 37.5 13.4 34.2 11.6 29.2 L4.6 34.6 C8.1 41.6 15.5 46.5 24 46.5 Z" fill="#FBBC05"/>
      <path d="M4.6 13.4 C3.6 16.6 3 20.2 3 24 C3 27.8 3.6 31.4 4.6 34.6 L11.6 29.2 C11.1 27.6 10.5 25.8 10.5 24 C10.5 22.2 11.1 20.4 11.6 18.8 L4.6 13.4 Z" fill="#EA4335"/>
    </g>
  `;

  const cropMarks = includeCropMarks
    ? `
    <g stroke="#94a3b8" stroke-width="1.2">
      <line x1="0" y1="30" x2="30" y2="30" />
      <line x1="30" y1="0" x2="30" y2="30" />
      <line x1="${width - 30}" y1="0" x2="${width - 30}" y2="30" />
      <line x1="${width - 30}" y1="30" x2="${width}" y2="30" />
      <line x1="0" y1="${height - 30}" x2="30" y2="${height - 30}" />
      <line x1="30" y1="${height - 30}" x2="30" y2="${height}" />
      <line x1="${width - 30}" y1="${height - 30}" x2="${width}" y2="${height - 30}" />
      <line x1="${width - 30}" y1="${height - 30}" x2="${width - 30}" y2="${height}" />
    </g>
  `
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="outer-stand-clip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="32" ry="32" />
    </clipPath>
    <filter id="stand-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.10" />
    </filter>
  </defs>

  <!-- Google 4-Color Signature Corners (Model L-Stand Meja Kasir Otentik) -->
  <g clip-path="url(#outer-stand-clip)">
    <!-- Top Left: Blue -->
    <rect x="0" y="0" width="${width * 0.48}" height="${height * 0.48}" fill="#4285F4" />
    <!-- Top Right: Red -->
    <rect x="${width * 0.48}" y="0" width="${width * 0.52}" height="${height * 0.40}" fill="#EA4335" />
    <!-- Bottom Right: Yellow -->
    <rect x="${width * 0.48}" y="${height * 0.40}" width="${width * 0.52}" height="${height * 0.60}" fill="#FBBC05" />
    <!-- Bottom Left: Green -->
    <rect x="0" y="${height * 0.48}" width="${width * 0.48}" height="${height * 0.52}" fill="#34A853" />
  </g>

  <!-- Kartu Tengah Putih Bersih dengan Sudut Membulat -->
  <rect x="${cardMarginX}" y="${cardMarginY}" width="${cardWidth}" height="${cardHeight}" rx="28" ry="28" fill="#FFFFFF" filter="url(#stand-shadow)" />

  <!-- Tab Bulat Logo Google di Bagian Atas Kartu -->
  <circle cx="${width / 2}" cy="${cardMarginY + 28}" r="58" fill="#FFFFFF" />

  <!-- Logo Google G Resmi -->
  <g transform="translate(${width / 2 - 40}, ${cardMarginY - 12})">
    ${googleLogoSvg}
  </g>

  <!-- Headline: review us on Google (Identik Foto Fisik Meja Kasir) -->
  <text x="${width / 2}" y="${cardMarginY + 128}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="28" font-weight="500" fill="#202124" letter-spacing="-0.3">
    review us
  </text>
  <text x="${width / 2}" y="${cardMarginY + 188}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', Roboto, sans-serif" font-size="56" font-weight="800" fill="#202124" letter-spacing="-1.2">
    on Google
  </text>

  <!-- Garis Pembagi Vertikal Antara NFC dan QR -->
  <line x1="${width / 2}" y1="${midY - 40}" x2="${width / 2}" y2="${midY + 170}" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round" />

  <!-- Badge 'OR' di Tengah Garis -->
  <rect x="${width / 2 - 20}" y="${midY + 50}" width="40" height="26" rx="6" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" />
  <text x="${width / 2}" y="${midY + 68}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="800" fill="#6B7280">
    OR
  </text>

  <!-- KOLOM KIRI: TAP YOUR PHONE -->
  <g transform="translate(${width * 0.27}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="800" fill="#202124" letter-spacing="0.5">
      TAP YOUR PHONE
    </text>

    <!-- Ikon Otentik: Gelombang NFC dalam Elips + Smartphone dipegang Tangan -->
    <g transform="translate(-74, 25)">
      <!-- Elips Gelombang NFC -->
      <ellipse cx="40" cy="54" rx="30" ry="38" fill="none" stroke="#202124" stroke-width="2.8" />
      <path d="M 32 36 A 22 22 0 0 1 32 72" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 42 43 A 14 14 0 0 1 42 65" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 52 50 A 6 6 0 0 1 52 58" fill="none" stroke="#202124" stroke-width="3.5" stroke-linecap="round" />

      <!-- Smartphone -->
      <rect x="80" y="24" width="34" height="66" rx="6" fill="#ffffff" stroke="#202124" stroke-width="2.8" />
      <line x1="91" y1="29" x2="103" y2="29" stroke="#202124" stroke-width="1.8" stroke-linecap="round" />
      <text x="97" y="48" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10" font-weight="800" fill="#202124" letter-spacing="0.3">
        NFC
      </text>

      <!-- Tangan memegang smartphone -->
      <path d="M 72 53 C 75 53 80 56 80 62 C 80 67 76 68 73 68 C 70 68 67 63 67 58 C 67 55 69 53 72 53 Z" fill="#ffffff" stroke="#202124" stroke-width="2.8" stroke-linejoin="round" />
      <path d="M 114 59 C 120 59 123 64 123 68 C 123 73 118 74 114 74" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round" />
      <path d="M 114 74 C 119 74 122 78 122 82 C 122 86 117 87 114 87" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round" />
    </g>

    <text x="0" y="145" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="600" fill="#64748B">
      Tempelkan ke sini
    </text>
  </g>

  <!-- KOLOM KANAN: SCAN QR -->
  <g transform="translate(${width * 0.73}, ${midY})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="800" fill="#202124" letter-spacing="0.5">
      SCAN QR
    </text>

    <!-- Kartu QR Barcode -->
    <rect x="${-qrPixelTarget / 2 - 12}" y="16" width="${qrPixelTarget + 24}" height="${qrPixelTarget + 24}" rx="14" fill="#FFFFFF" stroke="#D1D5DB" stroke-width="2" />
    <g transform="translate(${-qrPixelTarget / 2}, 28) scale(${qrScale})">
      <path d="${qrPath}" stroke="#000000" stroke-width="1" fill="none" shape-rendering="crispEdges" />
    </g>

    <!-- Kode Seri Plate -->
    <text x="0" y="${qrPixelTarget + 66}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, monospace, sans-serif" font-size="17" font-weight="700" fill="#1F2937" letter-spacing="1.2">
      ${cleanCode}
    </text>
  </g>

  <!-- Bagian Bawah: Nama Bisnis & Footer Powered by -->
  <g transform="translate(${width / 2}, ${cardMarginY + cardHeight - 64})">
    ${cleanBusinessName ? `<text x="0" y="-12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Google Sans', sans-serif" font-size="20" font-weight="700" fill="#111827">${cleanBusinessName}</text>` : ""}
    <text x="0" y="22" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" fill="#4B5563">
      powered by <tspan fill="#1A73E8" font-weight="800">ulaskami.id</tspan>
    </text>
  </g>

  <!-- Label Teknis Model di Margin Bawah -->
  <g transform="translate(${width / 2}, ${height - 12})">
    <text x="0" y="0" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10.5" font-weight="700" fill="#94A3B8" letter-spacing="1">
      MODEL STAND MEJA KASIR (L-STAND A6 &bull; 10.5 &times; 14.8 CM)
    </text>
  </g>

  ${cropMarks}
</svg>`;
}

async function main() {
  const svg = await generateStandMejaKasirSvg({
    code: "ULK-000001",
    businessName: "Kopi Kenangan Senopati (Demo)",
    includeCropMarks: true,
  });

  fs.writeFileSync("sample_stand_kasir_ULK-000001.svg", svg);
  fs.writeFileSync("/home/elly/.gemini/antigravity-ide/brain/25c49a78-12a4-4320-8c7e-72fc214b9227/sample_stand_kasir_ULK-000001.svg", svg);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Cetak Model Stand Meja Kasir (L-Stand A6) - ULK-000001</title>
  <style>
    @page {
      margin: 0;
      size: 105mm 148mm; /* Ukuran A6 Presisi */
    }
    body {
      margin: 0;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 520px;
      width: 100%;
    }
    .header-bar {
      margin-bottom: 16px;
      text-align: center;
      color: #94a3b8;
    }
    .header-bar h1 {
      font-size: 18px;
      color: #ffffff;
      margin: 0 0 6px 0;
      font-weight: 800;
    }
    .tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 4px;
    }
    .print-card {
      background: #ffffff;
      padding: 16px;
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      width: 100%;
      box-sizing: border-box;
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 12px;
    }
    .btn-print {
      margin-top: 20px;
      padding: 14px 32px;
      background: #1a73e8;
      color: #ffffff;
      font-weight: 700;
      font-size: 15px;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 10px 20px -5px rgba(26, 115, 232, 0.5);
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: #1557b0;
      transform: translateY(-1px);
    }
    .specs-box {
      margin-top: 16px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #cbd5e1;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.6;
    }
    .specs-box b {
      color: #f8fafc;
    }
    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .preview-container, .print-card {
        max-width: 100%;
        width: 100%;
        box-shadow: none;
        padding: 0;
      }
      .header-bar, .btn-print, .specs-box {
        display: none !important;
      }
      svg {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="header-bar">
      <div class="tag">MODEL STAND MEJA KASIR (L-STAND A6)</div>
      <h1>Master Cetak Dudukan Akrilik Kasir</h1>
      <div>Dimensi: 10.5 cm &times; 14.8 cm &bull; Standar Dudukan Meja Kasir Model L</div>
    </div>

    <div class="print-card">
      ${svg}
    </div>

    <button class="btn-print" onclick="window.print()">Cetak Model Stand Kasir (Print / PDF)</button>

    <div class="specs-box">
      <div><b>Format Model:</b> Stand Meja Kasir Model L (Portrait A6)</div>
      <div><b>Dimensi Fisik:</b> 105 mm &times; 148 mm (Tebal akrilik rekomendasi: 2mm &ndash; 3mm)</div>
      <div><b>Tindakan Fisik:</b> Dual Action (Tap NFC HP di sisi kiri &bull; Scan QR Barcode di sisi kanan)</div>
      <div><b>Teknis Dudukan:</b> Tekukan L kaki bawah 40mm&ndash;50mm ke belakang meja kasir</div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync("public/sample_stand_kasir_ULK-000001.html", html);
  console.log("Berhasil menghasilkan:");
  console.log("1. sample_stand_kasir_ULK-000001.svg");
  console.log("2. public/sample_stand_kasir_ULK-000001.html");
}

main().catch(console.error);
