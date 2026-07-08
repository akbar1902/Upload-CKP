"use client";

import React from 'react';
import { isValidUrl, isGoogleDriveLink } from '@/lib/utils';
import { ExternalLink, FileText } from 'lucide-react';

interface DataDukungLinkProps {
  value: string | null;
}

export function DataDukungLink({ value }: DataDukungLinkProps) {
  if (!value || value.trim().length === 0) {
    return <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>-</span>;
  }

  const trimmed = value.trim();

  if (!isValidUrl(trimmed)) {
    return <span className="text-[14px]" style={{ color: 'var(--text-primary)' }}>{trimmed}</span>;
  }

  const isGDrive = isGoogleDriveLink(trimmed);

  return (
    <a
      href={trimmed}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-all duration-200 group"
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
          <span className="truncate max-w-[120px]">Bukti Dukung</span>
        </>
      ) : (
        <>
          <FileText className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate max-w-[120px]">Lihat Bukti</span>
        </>
      )}
      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </a>
  );
}
