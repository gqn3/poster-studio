import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "./preferences";

export const metadata: Metadata = {
  robots: { index: process.env.TAPNDO_INDEXABLE === 'true', follow: process.env.TAPNDO_INDEXABLE === 'true' },
  alternates: { canonical: '/' },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tapndo-poster-cxi5we.cranl.net'),
  title: "TapNDo Studio",
  description: "Design posters and social graphics in your browser.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: "TapNDo Studio",
    description: "Design posters and social graphics in your browser.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tapndo-poster-cxi5we.cranl.net',
    siteName: "TapNDo Studio",
    type: 'website',
  },
};

const umamiSrc =
  process.env.NEXT_PUBLIC_UMAMI_SRC ||
  (process.env.NEXT_PUBLIC_UMAMI_DOMAIN
    ? `${process.env.NEXT_PUBLIC_UMAMI_DOMAIN.replace(/\/$/, '')}/script.js`
    : '');
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {umamiSrc && umamiWebsiteId ? (
          <script defer src={umamiSrc} data-website-id={umamiWebsiteId}></script>
        ) : null}
      </head>
      <body suppressHydrationWarning>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
