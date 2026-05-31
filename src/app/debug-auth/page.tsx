"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

export default function DebugPage() {
  const { user, supabaseUser, loading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [dbUser, setDbUser] = useState<Record<string, unknown> | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [session, setSession] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      // Fetch session
      const { data: { session: sess } } = await supabase.auth.getSession();
      setSession(sess as unknown as Record<string, unknown>);

      // Fetch DB user
      if (supabaseUser) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (error) setDbError(error.message);
        else setDbUser(data as Record<string, unknown>);
      }
    };

    if (!loading) fetchDebugInfo();
  }, [loading, supabaseUser, supabase]);

  const jwtRole = supabaseUser?.user_metadata?.role;
  const dbRole = dbUser?.role;
  const isRoleMismatch = jwtRole !== dbRole;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-mono text-sm">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-1">🔍 Auth Debug Page</h1>
          <p className="text-slate-500 text-xs">Akses: <code>/debug-auth</code> — hapus halaman ini setelah selesai debug</p>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4">📊 Status Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${loading ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="text-xs font-semibold text-slate-500">Auth Loading</p>
              <p className="font-bold mt-1">{loading ? '⏳ Loading...' : '✅ Done'}</p>
            </div>
            <div className={`p-3 rounded-lg ${supabaseUser ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-semibold text-slate-500">Supabase Auth</p>
              <p className="font-bold mt-1">{supabaseUser ? '✅ Logged In' : '❌ Not Logged In'}</p>
            </div>
            <div className={`p-3 rounded-lg ${user ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-semibold text-slate-500">DB Profile</p>
              <p className="font-bold mt-1">{user ? '✅ Loaded' : '❌ Not Loaded'}</p>
            </div>
            <div className={`p-3 rounded-lg ${isRoleMismatch ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="text-xs font-semibold text-slate-500">Role Sync</p>
              <p className="font-bold mt-1">{isRoleMismatch ? '❌ MISMATCH!' : '✅ In Sync'}</p>
            </div>
          </div>
        </div>

        {/* Role Mismatch Alert */}
        {isRoleMismatch && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h2 className="font-bold text-red-700 mb-2">🚨 MASALAH TERDETEKSI: Role Tidak Sinkron!</h2>
            <p className="text-red-600 mb-3">
              Role di JWT metadata berbeda dengan role di database. Ini menyebabkan middleware salah redirect!
            </p>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-40">JWT Metadata Role:</span>
                <code className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                  {String(jwtRole ?? 'undefined / tidak ada')}
                </code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-40">Database Role:</span>
                <code className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                  {String(dbRole ?? 'undefined')}
                </code>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-red-700 font-semibold text-xs">SOLUSI:</p>
              <p className="text-red-600 text-xs mt-1">
                Jalankan file <code>supabase/fix_jwt_role_sync.sql</code> di Supabase SQL Editor untuk menyinkronkan role.
              </p>
            </div>
          </div>
        )}

        {/* JWT User Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4">🔑 JWT / Supabase Auth User</h2>
          {supabaseUser ? (
            <div className="space-y-2">
              <Row label="ID" value={supabaseUser.id} />
              <Row label="Email" value={supabaseUser.email ?? '-'} />
              <Row label="Role (JWT metadata)" value={String(supabaseUser.user_metadata?.role ?? '❌ TIDAK ADA')} highlight={!supabaseUser.user_metadata?.role} />
              <Row label="Full Name (JWT)" value={String(supabaseUser.user_metadata?.full_name ?? '-')} />
              <Row label="NIP (JWT)" value={String(supabaseUser.user_metadata?.nip ?? '-')} />
              <Row label="Raw Metadata" value={JSON.stringify(supabaseUser.user_metadata, null, 2)} code />
            </div>
          ) : (
            <p className="text-slate-400">Tidak ada sesi JWT aktif</p>
          )}
        </div>

        {/* DB Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4">🗄️ Database Profile (public.users)</h2>
          {dbError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-semibold">❌ Error membaca DB:</p>
              <code className="text-red-700 text-xs">{dbError}</code>
              <p className="text-red-500 text-xs mt-2">Kemungkinan RLS policy belum dijalankan. Jalankan fix_all_issues.sql</p>
            </div>
          ) : dbUser ? (
            <div className="space-y-2">
              <Row label="ID" value={String(dbUser.id)} />
              <Row label="Email" value={String(dbUser.email)} />
              <Row label="Full Name" value={String(dbUser.full_name)} />
              <Row label="Role (DB)" value={String(dbUser.role)} highlight={dbUser.role !== jwtRole} />
              <Row label="NIP" value={String(dbUser.nip ?? '-')} />
              <Row label="Unit Kerja" value={String(dbUser.unit_kerja ?? '-')} />
              <Row label="Is Active" value={String(dbUser.is_active)} />
            </div>
          ) : (
            <p className="text-slate-400">Memuat data...</p>
          )}
        </div>

        {/* Auth Hook User */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4">⚛️ useAuth() Hook Output</h2>
          {user ? (
            <div className="space-y-2">
              <Row label="Role" value={String(user.role)} />
              <Row label="Full Name" value={user.full_name} />
              <Row label="Email" value={user.email} />
              <Row label="isPimpinan" value={String(user.role === 'pimpinan' || user.role === 'admin')} />
            </div>
          ) : (
            <p className="text-slate-400">User belum loaded</p>
          )}
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4">🔐 Session Info</h2>
          {session ? (
            <pre className="text-xs text-slate-600 overflow-auto bg-slate-50 p-4 rounded-lg max-h-64">
              {JSON.stringify({
                access_token: '...[hidden]...',
                token_type: (session as { token_type?: string }).token_type,
                expires_at: (session as { expires_at?: number }).expires_at,
                user: {
                  id: (session as { user?: { id?: string; email?: string } }).user?.id,
                  email: (session as { user?: { id?: string; email?: string } }).user?.email,
                },
              }, null, 2)}
            </pre>
          ) : (
            <p className="text-slate-400">Tidak ada session aktif</p>
          )}
        </div>

        {/* Panduan Perbaikan */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="font-bold text-blue-700 mb-3">📋 Panduan Perbaikan</h2>
          <ol className="text-blue-600 text-xs space-y-2 list-decimal list-inside">
            <li>Buka <strong>Supabase Dashboard → SQL Editor</strong></li>
            <li>Jalankan <code className="bg-blue-100 px-1 rounded">supabase/fix_all_issues.sql</code> (fix RLS)</li>
            <li>Jalankan <code className="bg-blue-100 px-1 rounded">supabase/fix_jwt_role_sync.sql</code> (fix role sync)</li>
            <li>Setelah SQL berhasil, <strong>logout dan login ulang</strong></li>
            <li>Buka halaman ini lagi dan pastikan "Role Sync" menunjukkan ✅</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight, code }: { label: string; value: string; highlight?: boolean; code?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-400 w-44 flex-shrink-0 text-xs pt-0.5">{label}</span>
      {code ? (
        <pre className={`text-xs flex-1 overflow-auto bg-slate-50 p-2 rounded max-h-32 ${highlight ? 'bg-red-50 text-red-700' : 'text-slate-700'}`}>
          {value}
        </pre>
      ) : (
        <span className={`font-medium text-xs ${highlight ? 'text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded' : 'text-slate-800'}`}>
          {value}
        </span>
      )}
    </div>
  );
}
