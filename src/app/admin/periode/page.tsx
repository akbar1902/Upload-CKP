"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { RefreshCw, Lock, Unlock } from 'lucide-react';
import { togglePeriodeLock } from '@/app/actions/admin';
import { toast } from 'sonner';
import { getBulanName } from '@/lib/utils';

export default function AdminPeriodePage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: periodeData, isPending, refetch } = useQuery({
    queryKey: ['admin-periode', selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('periode_ckp')
        .select('*')
        .eq('tahun', selectedYear);

      if (error && error.code !== '42P01') throw error; // ignore relation does not exist if migration not run yet
      return data ?? [];
    },
  });

  const periodes = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 12; i++) {
      const p = periodeData?.find(d => d.bulan === i && d.tahun === selectedYear);
      list.push({
        bulan: i,
        tahun: selectedYear,
        is_locked: p ? p.is_locked : false,
        locked_by: p?.locked_by,
        locked_at: p?.locked_at,
      });
    }
    return list;
  }, [periodeData, selectedYear]);

  const handleToggleLock = async (bulan: number, is_locked: boolean) => {
    if (!user) return;
    const action = is_locked ? 'mengunci' : 'membuka';
    if (confirm(`Yakin ingin ${action} periode ${getBulanName(bulan)} ${selectedYear}?`)) {
      const res = await togglePeriodeLock(bulan, selectedYear, is_locked, user.id);
      if (res.success) {
        toast.success(`Periode berhasil di${action}`);
        refetch();
      } else {
        toast.error(`Gagal ${action} periode: ` + res.error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Pengaturan Periode CKP
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Kunci atau buka periode agar pegawai tidak bisa mengunggah / mengubah CKP.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border rounded-xl text-[14px] outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center p-12">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {periodes.map(p => (
              <div key={p.bulan} className="activity-card p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
                      {getBulanName(p.bulan)} {p.tahun}
                    </h3>
                    <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Status: {p.is_locked ? 'Terkunci' : 'Terbuka'}
                    </p>
                  </div>
                  {p.is_locked ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                      <Lock size={18} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                      <Unlock size={18} />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleToggleLock(p.bulan, !p.is_locked)}
                  className={`w-full py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    p.is_locked 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50'
                  }`}
                >
                  {p.is_locked ? 'Buka Periode' : 'Kunci Periode'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
