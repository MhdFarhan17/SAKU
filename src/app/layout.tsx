import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
import Providers from "./providers";
import { I18nProvider } from "@/components/i18n-provider";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | SAKU',
    default: 'SAKU - Aplikasi Pencatat Keuangan Pribadi',
  },
  description: 'Catat pemasukan dan pengeluaran Anda dengan mudah, aman, dan rapi menggunakan SAKU.',
  keywords: ['Pencatat Keuangan', 'Money Tracker', 'Aplikasi Keuangan', 'SAKU', 'Keuangan Pribadi', 'Budgeting'],
  authors: [{ name: 'SAKU Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://saku.mdfarhan.site',
    title: 'SAKU - Aplikasi Pencatat Keuangan Pribadi',
    description: 'Catat pemasukan dan pengeluaran Anda dengan mudah, aman, dan rapi menggunakan SAKU.',
    siteName: 'SAKU',
    images: [
      {
        url: '/logo.svg', // Idealnya pakai file png ukuran 1200x630, tapi pakai logo SVG dulu
        width: 800,
        height: 600,
        alt: 'SAKU Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAKU - Aplikasi Pencatat Keuangan Pribadi',
    description: 'Catat pemasukan dan pengeluaran Anda dengan mudah, aman, dan rapi menggunakan SAKU.',
    images: ['/logo.svg'],
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              let theme = localStorage.getItem('saku.theme');
              if (theme === 'system') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              } else if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body
        className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <I18nProvider>
          <Providers>
            <ThemeProvider defaultTheme="light" storageKey="saku.theme">
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
