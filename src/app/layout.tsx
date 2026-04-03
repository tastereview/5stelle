import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { ProgressBarProvider } from "@/components/shared/ProgressBarProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://5stelle.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "5stelle - Raccogli feedback dal tuo ristorante",
    template: "%s | 5stelle",
  },
  description:
    "Trasforma i feedback dei clienti in recensioni positive. QR code per raccogliere opinioni e indirizzare i clienti soddisfatti verso le piattaforme di recensioni.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "5stelle",
    title: "5stelle - Raccogli feedback dal tuo ristorante",
    description:
      "Trasforma i feedback dei clienti in recensioni positive. QR code per raccogliere opinioni e indirizzare i clienti soddisfatti verso le piattaforme di recensioni.",
    // images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "5stelle - Raccogli feedback dal tuo ristorante",
    description:
      "Trasforma i feedback dei clienti in recensioni positive. QR code per raccogliere opinioni e indirizzare i clienti soddisfatti verso le piattaforme di recensioni.",
    // images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBarProvider />
        {children}
        <Toaster position="bottom-right" richColors />
        <CookieBanner />
      </body>
    </html>
  );
}
