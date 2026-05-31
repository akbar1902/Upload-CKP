"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusLabel } from '@/lib/utils';
import type { UploadStatus } from '@/types/database';

interface UploadStatusBadgeProps {
  status: UploadStatus;
  className?: string;
}

export function UploadStatusBadge({ status, className }: UploadStatusBadgeProps) {
  return (
    <Badge variant={status} className={className}>
      {getStatusLabel(status)}
    </Badge>
  );
}
