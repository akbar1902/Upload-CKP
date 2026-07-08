"use client";

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  error?: string;
}

const ACCEPTED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function UploadDropzone({ onFileSelected, disabled, error }: UploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return 'Format file tidak didukung. Gunakan file .xlsx atau .xls';
    }
    if (file.size > MAX_SIZE) {
      return `Ukuran file terlalu besar. Maksimal ${MAX_SIZE / (1024 * 1024)}MB`;
    }
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    onFileSelected(file);
  }, [validateFile, onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const displayError = fileError || error;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{
          borderColor: dragOver ? 'var(--primary)' : displayError ? 'var(--danger)' : selectedFile && !displayError ? 'var(--success)' : 'var(--border)',
          background: dragOver ? 'var(--primary-soft)' : displayError ? 'var(--danger-soft)' : selectedFile && !displayError ? 'var(--success-soft)' : 'var(--bg-secondary)',
          transform: dragOver ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {selectedFile && !displayError ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background: 'var(--success-soft)' }}>
              <FileSpreadsheet className="h-7 w-7" style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{selectedFile.name}</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
            >
              <X className="h-4 w-4 mr-1" />
              Ganti File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                 style={{ background: dragOver ? 'var(--primary-soft)' : 'var(--bg-secondary)' }}>
              <Upload className="h-7 w-7 transition-colors"
                      style={{ color: dragOver ? 'var(--primary)' : 'var(--text-tertiary)' }} />
            </div>
            <div>
              <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {dragOver ? 'Lepaskan file di sini' : 'Seret file Excel ke sini'}
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                atau klik untuk memilih file • .xlsx, .xls • Maks 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl"
             style={{ background: 'var(--danger-soft)', border: '1px solid rgba(255,59,48,0.08)' }}>
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
          <p className="text-[14px]" style={{ color: 'var(--danger)' }}>{displayError}</p>
        </div>
      )}
    </div>
  );
}
