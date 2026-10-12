import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://ulaskami.id").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/how-it-works", "/activate", "/login"],
        disallow: ["/api/", "/dashboard/", "/r/", "/review/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
