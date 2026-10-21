import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ulaskami.com"),
  title: {
    default: "Ulaskami — Buat Bisnismu Semakin Direkomendasikan di Google Maps",
    template: "%s | Ulaskami",
  },
  description:
    "Permudah pelanggan memberikan ulasan di Google Maps dengan Ulaskami NFC + QR Review Plate. Buat bisnismu semakin direkomendasikan di Google Maps. Beli sekali, tanpa biaya bulanan.",
  keywords: [
    "Google Review",
    "Google Maps Review",
    "NFC Review Plate",
    "QR Code Google Review",
    "Ulaskami",
    "Review Bisnis UMKM",
    "NFC Bisnis",
    "Stand Akrilik Google Review",
  ],
  authors: [{ name: "Ulaskami", url: "https://ulaskami.com" }],
  creator: "Ulaskami",
  publisher: "Ulaskami",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://ulaskami.com",
    title: "Ulaskami — Buat Bisnismu Semakin Direkomendasikan di Google Maps",
    description:
      "Permudah pelanggan memberikan ulasan di Google Maps dengan Ulaskami NFC + QR Review Plate. Buat bisnismu semakin direkomendasikan di Google Maps.",
    siteName: "Ulaskami",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Ulaskami Google Review Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulaskami — Buat Bisnismu Semakin Direkomendasikan di Google Maps",
    description:
      "Permudah pelanggan memberikan ulasan di Google Maps dengan Ulaskami NFC + QR Review Plate. Buat bisnismu semakin direkomendasikan di Google Maps.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans selection:bg-[#4285F4] selection:text-white">
        {children}
      </body>
    </html>
  );
}
