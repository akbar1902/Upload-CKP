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
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
          dragOver && "border-blue-500 bg-blue-50/50 scale-[1.02]",
          displayError && "border-red-300 bg-red-50/30",
          !dragOver && !displayError && "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30",
          disabled && "opacity-50 cursor-not-allowed",
          selectedFile && !displayError && "border-emerald-300 bg-emerald-50/30"
        )}
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
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="text-slate-400 hover:text-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Ganti File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
              dragOver ? "bg-blue-100" : "bg-slate-100"
            )}>
              <Upload className={cn(
                "h-7 w-7 transition-colors",
                dragOver ? "text-blue-600" : "text-slate-400"
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {dragOver ? 'Lepaskan file di sini' : 'Seret file Excel ke sini'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                atau klik untuk memilih file • .xlsx, .xls • Maks 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}
    </div>
  );
}
