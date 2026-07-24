import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { QueryProvider } from "@/components/providers/query-provider";
import { RecoveryManager } from "@/components/providers/recovery-manager";
import { KeepAliveManager } from "@/components/providers/keepalive-manager";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: {
    default: "CKP Digital — BPS Kabupaten Belitung",
    template: "%s | CKP Digital",
  },
  description: "Sistem Rekap Capaian Kinerja Pegawai (CKP) BPS Kabupaten Belitung. Upload, review, dan kelola kinerja pegawai secara digital.",
  keywords: "CKP, BPS, Belitung, kinerja pegawai, capaian kinerja",
  robots: { index: false, follow: false },
  openGraph: {
    title: "CKP Digital — BPS Kabupaten Belitung",
    description: "Sistem Rekap Capaian Kinerja Pegawai BPS Kabupaten Belitung",
    type: "website",
    locale: "id_ID",
  },
  appleWebApp: {
    capable: true,
    title: "CKP Digital",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NextTopLoader
          color="#0071E3"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 8px rgba(0,113,227,0.3)"
        />
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <RecoveryManager>
                  {children}
                </RecoveryManager>
                <KeepAliveManager />
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{
                    style: {
                      fontFamily: "-apple-system, 'SF Pro Display', 'Inter', sans-serif",
                      borderRadius: '16px',
                      fontSize: '14px',
                    },
                  }}
                />
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
