"use client";

import React, { useState } from 'react';
import { isValidUrl, isGoogleDriveLink } from '@/lib/utils';
import { ExternalLink, FileText, Maximize2, RotateCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DataDukungLinkProps {
  value: string | null;
}

export function DataDukungLink({ value }: DataDukungLinkProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!value || value.trim().length === 0) {
    return <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>-</span>;
  }

  const trimmed = value.trim();

  if (!isValidUrl(trimmed)) {
    return <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>{trimmed}</span>;
  }

  const isGDrive = isGoogleDriveLink(trimmed);

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (isGDrive) {
      e.preventDefault();
      setIsPreviewOpen(true);
    }
  };

  const getDrivePreviewUrl = (url: string) => {
    try {
      // 1. Google Drive file link: /file/d/{id}/...
      const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }

      // 2. Google Docs / Sheets / Slides link
      const docsMatch = url.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
      if (docsMatch) {
        return `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`;
      }

      // 3. Google Drive ID query param: /open?id={id} or /uc?id={id}
      if (url.includes('drive.google.com')) {
        const urlObj = new URL(url);
        const idParam = urlObj.searchParams.get('id');
        if (idParam) {
          return `https://drive.google.com/file/d/${idParam}/preview`;
        }
      }

      // 4. Default fallback: replace /view or /edit with /preview
      return url.replace(/\/(view|edit).*$/, '/preview');
    } catch {
      return url.replace(/\/(view|edit).*$/, '/preview');
    }
  };

  return (
    <>
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handlePreviewClick}
        className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-all duration-200 group cursor-pointer"
        style={{ color: 'var(--primary)' }}
        title={trimmed}
      >
        {isGDrive ? (
          <>
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M4.433 22l-1.6-2.77L8.767 8.832l3.2 5.546L4.433 22z" fill="#4285F4"/>
              <path d="M19.567 22H12.1l3.2-5.546h7.467L19.567 22z" fill="#FBBC04"/>
              <path d="M8.767 8.832L5.567 3.286h6.866l3.2 5.546H8.767z" fill="#34A853"/>
              <path d="M15.3 16.454L8.767 8.832h6.866l3.2 5.546-3.533 2.076z" fill="#188038"/>
              <path d="M15.3 16.454l-3.2-5.546-3.333-2.076L12.433 3.286l6.134 10.622L15.3 16.454z" fill="#1967D2"/>
            </svg>
            <span className="truncate max-w-[120px] group-hover:underline">Bukti Dukung</span>
            <Maximize2 className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </>
        ) : (
          <>
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate max-w-[120px] group-hover:underline">Lihat Bukti</span>
            <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </>
        )}
      </a>

      {isGDrive && (
        <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          <DialogContent className="max-w-5xl w-[95vw] h-[88vh] p-0 flex flex-col overflow-hidden bg-[var(--bg-base)]">
            <DialogHeader className="px-4 py-3 border-b border-[var(--border)] flex flex-row items-center justify-between m-0">
              <DialogTitle className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Preview Bukti Dukung
              </DialogTitle>
              <div className="flex items-center gap-2 mr-6">
                <button
                  type="button"
                  onClick={() => setRefreshKey((prev) => prev + 1)}
                  className="text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sand-border)] hover:bg-[var(--sand-subtle)] transition-colors cursor-pointer"
                  style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
                  title="Muat ulang preview jika izin Drive baru saja diubah"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Muat Ulang
                </button>
                <a 
                  href={trimmed} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
                  style={{ fontWeight: 500 }}
                  title="Buka langsung di Google Drive tab baru untuk beralih akun jika diperlukan"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Buka di Tab Baru
                </a>
              </div>
            </DialogHeader>
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900/50 relative">
              <iframe
                key={refreshKey}
                src={getDrivePreviewUrl(trimmed)}
                className="w-full h-full border-0"
                allow="autoplay"
                title="Google Drive Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
