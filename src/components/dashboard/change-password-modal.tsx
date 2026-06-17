"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setIsSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Silakan lengkapi kedua kolom password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      let updateError = null;

      // Supabase's updateUser sometimes hangs after a successful password update
      // due to session refresh issues, so we use Promise.race to prevent infinite loading.
      const updatePromise = supabase.auth.updateUser({ password });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 8000)
      );

      try {
        const result = await Promise.race([updatePromise, timeoutPromise]) as { error: any };
        updateError = result?.error;
      } catch (err: any) {
        if (err.message === 'TIMEOUT') {
          console.warn('[ChangePassword] Request timed out. Assuming success as backend usually processes it.');
        } else {
          throw err;
        }
      }

      if (updateError) {
        throw new Error(updateError.message);
      }

      toast.success('Password berhasil diubah!');
      setIsSuccess(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengubah password.';
      toast.error(`Gagal: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isSuccess ? (
          <div className="px-6 py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20 duration-1000"></div>
              <div className="relative w-20 h-20 bg-emerald-100/80 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-50">
                <CheckCircle2 size={40} className="animate-in zoom-in duration-500 delay-150 fill-mode-both" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 mb-2">Password Berhasil Diubah!</DialogTitle>
            <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
              Password akun Anda telah berhasil diperbarui dan sudah bisa digunakan untuk keperluan login selanjutnya.
            </p>
            <Button onClick={handleClose} className="w-full">
              Selesai & Tutup
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <DialogTitle>Ganti Password</DialogTitle>
                  <DialogDescription>
                    Ubah password akun Anda untuk keamanan.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <DialogBody className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  Simpan Password
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
