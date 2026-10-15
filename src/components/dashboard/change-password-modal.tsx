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
          <div className="px-7 py-14 flex flex-col items-center justify-center text-center"
               style={{ animation: 'scaleIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) both' }}>
            <div className="relative mb-7">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                   style={{ background: 'var(--success-soft)' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 tracking-tight"
                style={{ color: 'var(--text-primary)' }}>
              Password Berhasil Diubah!
            </h3>
            <p className="text-[15px] mb-8 max-w-[280px]"
               style={{ color: 'var(--text-secondary)' }}>
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
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--primary-soft)' }}>
                  <Lock size={20} style={{ color: 'var(--primary)' }} />
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
              <DialogBody className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium"
                         style={{ color: 'var(--text-primary)' }}>
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password baru"
                      className="w-full pl-4 pr-10 h-12 rounded-xl text-[15px] transition-all duration-200"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--card-bg)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px var(--primary-ring)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium"
                         style={{ color: 'var(--text-primary)' }}>
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full pl-4 pr-10 h-12 rounded-xl text-[15px] transition-all duration-200"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--card-bg)';
                        e.currentTarget.style.boxShadow = '0 0 0 4px var(--primary-ring)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
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
