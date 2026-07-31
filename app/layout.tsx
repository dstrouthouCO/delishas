import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SEO_TITLE = "Delishas: Healthy & Delicious Snacks | Coming Soon";
const SEO_DESCRIPTION =
  "Delishas is coming. Discover snacks that are truly delicious & guilt-free. Made with real, honest ingredients, born from a father's promise for his family.";
// Public site URL — used to turn the OG image into an absolute URL for social
// scrapers. Set NEXT_PUBLIC_SITE_URL to your real domain in production.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://delishas.com";
const OG_IMAGE = {
  url: "/og-image.png",
  width: 2400,
  height: 1260,
  alt: SEO_TITLE,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Delishas",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rethinkSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
