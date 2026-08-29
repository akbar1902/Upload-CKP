'use client';

import React, { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
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
      const dataUrl = await htmlToImage.toPng(targetElement, {
        quality: 1,
        pixelRatio: 2, // High resolution
        backgroundColor: '#f8faf9', // match app bg
        style: {
          transform: 'none', // Prevent some glitching
        },
        cacheBust: true, // Prevents caching issues with images
      });

      // Convert to image and download
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
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
      title={size === 'icon' ? "Ambil Screenshot" : undefined}
    >
      {isCapturing 
        ? <Loader2 className={`w-4 h-4 ${size === 'icon' ? '' : 'mr-2'} animate-spin`} /> 
        : <Camera className={`w-4 h-4 ${size === 'icon' ? '' : 'mr-2'}`} />
      }
      {size !== 'icon' && (children || 'Screenshot')}
    </Button>
  );
}
