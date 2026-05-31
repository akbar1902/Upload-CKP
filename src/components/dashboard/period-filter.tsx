"use client";

import React from 'react';
import { Select } from '@/components/ui/select';
import { BULAN_NAMES } from '@/lib/utils';

interface PeriodFilterProps {
  bulan: number;
  tahun: number;
  onBulanChange: (bulan: number) => void;
  onTahunChange: (tahun: number) => void;
}

export function PeriodFilter({ bulan, tahun, onBulanChange, onTahunChange }: PeriodFilterProps) {
  const bulanOptions = BULAN_NAMES.map((name, index) => ({
    value: String(index + 1),
    label: name,
  }));

  const currentYear = new Date().getFullYear();
  const tahunOptions = Array.from({ length: 7 }, (_, i) => ({
    value: String(currentYear - 3 + i),
    label: String(currentYear - 3 + i),
  }));

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-[140px]">
        <Select
          options={bulanOptions}
          value={String(bulan)}
          onChange={(e) => onBulanChange(Number(e.target.value))}
        />
      </div>
      <div className="min-w-[100px]">
        <Select
          options={tahunOptions}
          value={String(tahun)}
          onChange={(e) => onTahunChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
