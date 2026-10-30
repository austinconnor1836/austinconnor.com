import type { Metadata, Viewport } from "next";
import { Gentium_Book_Plus, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";

import { site } from "@/content/site";
import "./globals.css";

// Gentium covers polytonic Greek, so headings and any Greek in the body render
// in one face instead of falling back mid-word.
const serif = Gentium_Book_Plus({
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "greek", "greek-ext"],
  display: "swap",
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "greek"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f151a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
