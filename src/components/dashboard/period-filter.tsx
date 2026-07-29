"use client";

import React from 'react';
import { Select } from '@/components/ui/select';
import { BULAN_NAMES } from '@/lib/utils';

interface PeriodFilterProps {
  bulan: string | number;
  tahun: number;
  onBulanChange: (bulan: string | number) => void;
  onTahunChange: (tahun: number) => void;
}

export function PeriodFilter({ bulan, tahun, onBulanChange, onTahunChange }: PeriodFilterProps) {
  const bulanOptions = [
    { value: 'T1', label: 'Triwulan I (Jan-Mar)' },
    { value: 'T2', label: 'Triwulan II (Apr-Jun)' },
    { value: 'T3', label: 'Triwulan III (Jul-Sep)' },
    { value: 'T4', label: 'Triwulan IV (Okt-Des)' },
    ...BULAN_NAMES.map((name, index) => ({
      value: String(index + 1),
      label: name,
    }))
  ];

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
          onChange={(e) => {
            const val = e.target.value;
            onBulanChange(val.startsWith('T') ? val : Number(val));
          }}
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
