export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

const ALLOWED_HOSTS = [
  "maps.app.goo.gl",
  "g.page",
  "search.google.com",
  "maps.google.com",
  "goo.gl",
];

/**
 * Memvalidasi apakah URL yang dimasukkan merupakan tautan Google Review yang sah
 * dan mencegah celah keamanan open redirect ke situs berbahaya/phishing.
 */
export function validateGoogleReviewUrl(rawUrl: string): UrlValidationResult {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) {
    return { isValid: false, error: "Tautan Google Review tidak boleh kosong." };
  }

  // Cegah skema berbahaya seperti javascript:, data:, dsb
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return { isValid: false, error: "Skema URL tidak diizinkan." };
  }

  // Tambahkan protokol https:// jika belum ada
  let urlToParse = trimmed;
  if (!/^https?:\/\//i.test(urlToParse)) {
    urlToParse = `https://${urlToParse}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlToParse);
  } catch {
    return { isValid: false, error: "Format tautan tidak valid." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { isValid: false, error: "Protokol tautan harus menggunakan http atau https." };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Periksa domain terpercaya Google
  const isDirectAllowedHost = ALLOWED_HOSTS.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`)
  );

  const isGoogleDomain =
    hostname === "google.com" ||
    hostname.endsWith(".google.com") ||
    hostname === "google.co.id" ||
    hostname.endsWith(".google.co.id");

  if (!isDirectAllowedHost && !isGoogleDomain) {
    return {
      isValid: false,
      error:
        "Tautan harus merupakan tautan resmi Google Review (contoh: g.page, maps.app.goo.gl, atau search.google.com).",
    };
  }

  // Jika domain google umum, pastikan mengarah ke Maps/Local Review
  if (isGoogleDomain && !isDirectAllowedHost) {
    const validPaths = ["/maps", "/search", "/local"];
    const pathMatches = validPaths.some((p) => parsed.pathname.startsWith(p));
    if (!pathMatches) {
      return {
        isValid: false,
        error:
          "Tautan Google harus mengarah ke halaman Maps atau Review bisnis Anda.",
      };
    }
  }

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
  };
}
