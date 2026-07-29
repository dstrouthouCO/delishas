import type { Metadata } from "next";
import { Archivo_Black, Poppins } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DELISHAS — Coming Soon",
  description:
    "Something healthy. Something yummy. Something for everyone. DELISHAS is coming soon — be the first to know when we go live.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "DELISHAS — Coming Soon",
    description: "Something healthy. Something yummy. Something for everyone.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
