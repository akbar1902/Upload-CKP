import React from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { QueryProvider } from "@/components/providers/query-provider";
import { RecoveryManager } from "@/components/providers/recovery-manager";
import { KeepAliveManager } from "@/components/providers/keepalive-manager";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommandPaletteProvider } from "@/components/layout/command-palette";
import { PageTransition } from "@/components/layout/page-transition";
import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: {
    default: "SIKAP — BPS Kabupaten Belitung",
    template: "%s | SIKAP",
  },
  description: "Sistem Rekap Capaian Kinerja Pegawai (CKP) BPS Kabupaten Belitung. Upload, review, dan kelola kinerja pegawai secara digital.",
  keywords: "CKP, BPS, Belitung, kinerja pegawai, capaian kinerja",
  robots: { index: false, follow: false },
  openGraph: {
    title: "SIKAP — BPS Kabupaten Belitung",
    description: "Sistem Rekap Capaian Kinerja Pegawai BPS Kabupaten Belitung",
    type: "website",
    locale: "id_ID",
  },
  appleWebApp: {
    capable: true,
    title: "SIKAP",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Selaras dengan --bg-base di globals.css (light) dan --sidebar-bg (dark).
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F6F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B2A24" },
  ],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--sikap-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <body className="antialiased">
        <NextTopLoader
          color="#0F766E"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 8px rgba(15,118,110,0.3)"
        />
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <CommandPaletteProvider>
                  <RecoveryManager>
                    <PageTransition>{children}</PageTransition>
                  </RecoveryManager>
                  <KeepAliveManager />
                  {/* Memantau kecepatan halaman nyata (tanpa cookie, tanpa data pribadi) */}
                  <SpeedInsights />
                  <Toaster
                    position="top-right"
                    closeButton
                    toastOptions={{
                      style: {
                        fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif",
                        borderRadius: '16px',
                        fontSize: '14px',
                        background: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-card)',
                      },
                    }}
                  />
                </CommandPaletteProvider>
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
