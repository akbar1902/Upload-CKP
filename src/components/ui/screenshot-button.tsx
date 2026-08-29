'use client';

import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ScreenshotButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function ScreenshotButton({ 
  targetId, 
  filename = 'screenshot', 
  className,
  variant = 'outline',
  size = 'default',
  children
}: ScreenshotButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
      toast.error(`Elemen dengan ID "${targetId}" tidak ditemukan.`);
      return;
    }

    try {
      setIsCapturing(true);
      
      const canvas = await html2canvas(targetElement, {
        scale: 2, // Higher resolution
        useCORS: true, // Allow external images
        logging: false,
        backgroundColor: '#f8faf9' // match app bg
      });

      // Convert to image and download
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = image;
      link.click();
      
      toast.success('Screenshot berhasil disimpan!');
    } catch (error) {
      console.error('Screenshot error:', error);
      toast.error('Gagal mengambil screenshot');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={handleCapture}
      disabled={isCapturing}
    >
      {isCapturing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
      {children || 'Screenshot'}
    </Button>
  );
}
