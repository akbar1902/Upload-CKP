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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <NextTopLoader
          color="#3B82F6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3B82F6,0 0 5px #3B82F6"
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
                      fontFamily: 'Inter, sans-serif',
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
