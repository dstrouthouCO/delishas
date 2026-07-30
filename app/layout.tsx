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

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
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
