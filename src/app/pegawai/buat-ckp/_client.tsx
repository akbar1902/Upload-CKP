'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderOpen,
  HardDrive,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  Settings2,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarPreview } from '@/components/ckp/calendar-preview';
import { cn } from '@/lib/utils';
import {
  deleteBuatCkpDraftAction,
  getBuatCkpContextAction,
  saveBuatCkpDraftAction,
  submitBuatCkpAction,
  type AturanKunci,
  type BuatCkpContext,
  type KamusEntry,
} from '@/app/actions/buat-ckp';
import { hitungUlangRk, masalahBaris, susunBaris, urutkanBaris, type DraftRow } from '@/lib/ckp-builder/draft.mjs';
import { BULAN } from '@/lib/ckp-builder/parser.mjs';
import {
  type DriveToken,
  DriveError,
  ensureFolder,
  folderLink,
  getDriveUser,
  preloadGoogle,
  requestDriveToken,
  shareAnyoneWithLink,
  uploadToDrive,
} from '@/lib/buat-ckp/google-drive';
import { PRESETS, type Preset, baseName, prepareFile } from '@/lib/buat-ckp/compress';
import { collectItems, type CollectResult, type SourceItem } from '@/lib/buat-ckp/source';
import { RkPicker } from './_rk-picker';
import { SettingsDialog } from './_settings-dialog';

const NAMA_BULAN = Object.values(BULAN).map((b) => b.nama);
const pad = (n: number) => String(n).padStart(2, '0');

/** Periode CKP yang sedang berjalan (bulan ke-1/2 triwulan berakhir tgl 25). */
function periodeSekarang() {
  const now = new Date();
  let bulan = now.getMonth() + 1;
  let tahun = now.getFullYear();
  if (now.getDate() > 25 && bulan % 3 !== 0) bulan += 1;
  if (bulan > 12) {
    bulan = 1;
    tahun += 1;
  }
  return { bulan, tahun };
}

/** Token Google tersisa < 2 menit (di luar komponen: Date.now tidak boleh dipanggil saat render). */
function tokenHampirHabis(token: DriveToken) {
  return token.expiresAt - Date.now() < 2 * 60 * 1000;
}

function tanggalPendek(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${Number(m[3])} ${NAMA_BULAN[Number(m[2]) - 1].slice(0, 3)} ${m[1]}` : '';
}

function pisahkanRk(ctx: BuatCkpContext | null) {
  const semua = ctx?.subRks ?? [];
  const resmi = [...new Set(semua.filter((s) => s.resmi).map((s) => s.kegiatan_nama))];
  const nama = [...new Set(semua.map((s) => s.kegiatan_nama))];
  // Tanpa Sub-RK resmi sama sekali (data lama), pakai semua agar tetap bisa memilih.
  const rkList = resmi.length ? resmi : nama;
  return { rkList, rkLain: nama.filter((n) => !rkList.includes(n)), rkSet: new Set(nama) };
}

type UploadStatus = 'waiting' | 'working' | 'done' | 'failed';
type UploadItem = { id: string; name: string; status: UploadStatus; error?: string };

export default function BuatCkpClient({ googleClientId }: { googleClientId: string }) {
  const router = useRouter();
  const [awal] = useState(periodeSekarang);
  const [bulan, setBulan] = useState(awal.bulan);
  const [tahun, setTahun] = useState(awal.tahun);
  const [ctx, setCtx] = useState<BuatCkpContext | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loadedKey, setLoadedKey] = useState('');
  const loading = loadedKey !== `${tahun}-${bulan}`;

  const [rows, setRows] = useState<DraftRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [driveFolderId, setDriveFolderId] = useState<string | null>(null);
  const [kamus, setKamus] = useState<KamusEntry[]>([]);
  const [rkKeywords, setRkKeywords] = useState<AturanKunci[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef(false);

  // ── Muat konteks per periode ─────────────────────────────────
  useEffect(() => {
    let batal = false;
    getBuatCkpContextAction(bulan, tahun).then((result) => {
      if (batal) return;
      setLoadedKey(`${tahun}-${bulan}`);
      if (!result.ok) {
        setCtx(null);
        setLoadError(result.error);
        return;
      }
      setLoadError('');
      const c = result.context;
      dirtyRef.current = false;
      setCtx(c);
      // Draft lama bisa berisi usulan RK dari nama kegiatan lama; susun ulang
      // usulan yang bukan pilihan manual memakai Sub-RK resmi saja.
      const { rkList: resmi } = pisahkanRk(c);
      const resmiSet = new Set(resmi);
      const perluUlang = c.draft.rows.some((r) => !r.rkManual && r.rk && !resmiSet.has(r.rk));
      if (perluUlang) {
        dirtyRef.current = true;
        setRows(hitungUlangRk(c.draft.rows, { rkList: resmi, aturanKustom: c.settings.rkKeywords }));
      } else {
        setRows(c.draft.rows);
      }
      setDriveFolderId(c.draft.driveFolderId);
      setSavedAt(c.draft.updatedAt);
      setKamus(c.settings.kamus);
      setRkKeywords(c.settings.rkKeywords);
      setSelected(new Set());
    });
    return () => {
      batal = true;
    };
  }, [bulan, tahun]);

  // Sub-RK resmi dipakai untuk pilihan utama + usulan otomatis. Sisanya (nama
  // kegiatan dari CKP lama yang ikut tercatat) hanya bisa dipilih manual.
  const { rkList, rkLain, rkSet } = useMemo(() => pisahkanRk(ctx), [ctx]);

  function ubahRows(updater: (prev: DraftRow[]) => DraftRow[]) {
    dirtyRef.current = true;
    setRows(updater);
  }

  // ── Simpan otomatis ──────────────────────────────────────────
  const latest = useRef({ rows, driveFolderId, bulan, tahun });
  useEffect(() => {
    latest.current = { rows, driveFolderId, bulan, tahun };
  }, [rows, driveFolderId, bulan, tahun]);

  async function simpanSekarang() {
    if (!dirtyRef.current) return true;
    dirtyRef.current = false;
    setSaving(true);
    const s = latest.current;
    const result = await saveBuatCkpDraftAction({ bulan: s.bulan, tahun: s.tahun, rows: s.rows, driveFolderId: s.driveFolderId });
    setSaving(false);
    if (!result.ok) {
      dirtyRef.current = true;
      toast.error(result.error);
      return false;
    }
    setSavedAt(result.updatedAt);
    return true;
  }

  useEffect(() => {
    if (!dirtyRef.current || !ctx) return;
    const timer = window.setTimeout(() => void simpanSekarang(), 1500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, driveFolderId]);

  async function gantiPeriode(nextBulan: number, nextTahun: number) {
    await simpanSekarang();
    setBulan(nextBulan);
    setTahun(nextTahun);
  }

  // ── Google Drive ─────────────────────────────────────────────
  const [token, setToken] = useState<DriveToken | null>(null);
  const [driveEmail, setDriveEmail] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (googleClientId) preloadGoogle();
  }, [googleClientId]);

  async function hubungkanDrive() {
    setConnecting(true);
    try {
      const next = await requestDriveToken(googleClientId, token ? '' : 'select_account');
      setToken(next);
      setDriveEmail((await getDriveUser(next)).email);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghubungkan Google Drive.');
    } finally {
      setConnecting(false);
    }
  }

  // ── Unggah bukti dukung ──────────────────────────────────────
  const [preset, setPreset] = useState<Preset>('standar');
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  // Peringatkan sebelum menutup tab bila draft belum tersimpan / unggah berjalan.
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current || uploading) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [uploading]);
  const sources = useRef(new Map<string, SourceItem>());
  const collectRef = useRef<CollectResult | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    folderInputRef.current?.setAttribute('webkitdirectory', '');
  }, []);
  useEffect(() => () => void collectRef.current?.close(), []);

  function patchUpload(id: string, change: Partial<UploadItem>) {
    setUploads((list) => list.map((u) => (u.id === id ? { ...u, ...change } : u)));
  }

  async function pilihFile(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length || !ctx) return;
    if (!token) {
      toast.error('Hubungkan Google Drive dulu.');
      return;
    }
    try {
      await collectRef.current?.close();
      const result = await collectItems(files);
      collectRef.current = result;
      const sudahAda = new Set(rows.map((r) => r.namaFile.toLowerCase()));
      const baru = result.items.filter((item) => !sudahAda.has(baseName(item.path).toLowerCase()));
      const dilewati = result.items.length - baru.length;
      if (dilewati) toast(`${dilewati} file sudah ada di draft, dilewati.`);
      if (!baru.length) return;
      sources.current = new Map(baru.map((item) => [item.id, item]));
      const daftar = baru.map((item) => ({ id: item.id, name: baseName(item.path), status: 'waiting' as const }));
      setUploads(daftar);
      void jalankan(daftar.map((d) => d.id));
    } catch (error) {
      toast.error(error instanceof Error ? `Gagal membaca file: ${error.message}` : 'Gagal membaca file.');
    }
  }

  async function jalankan(ids: string[]) {
    if (!token || !ctx) return;
    if (tokenHampirHabis(token)) {
      toast.error('Login Google hampir kedaluwarsa. Klik Hubungkan ulang dulu.');
      return;
    }
    setUploading(true);
    let stop = false;
    try {
      let folder = driveFolderId;
      if (!folder) {
        const root = await ensureFolder(token, 'CKP SIKAP');
        folder = await ensureFolder(token, `${tahun}-${pad(bulan)} ${NAMA_BULAN[bulan - 1]}`, root);
        dirtyRef.current = true;
        setDriveFolderId(folder);
      }
      const target = folder;
      const queue = [...ids];
      const ctxBaris = { kamus, rkList, aturanKustom: rkKeywords, tahunDefault: tahun };
      await Promise.all(
        Array.from({ length: Math.min(3, queue.length) }, async () => {
          while (queue.length && !stop) {
            const id = queue.shift();
            const source = id ? sources.current.get(id) : null;
            if (!id || !source) continue;
            patchUpload(id, { status: 'working', error: undefined });
            try {
              const prepared = await prepareFile(await source.read(), source.path, preset);
              const uploaded = await uploadToDrive(token, prepared.blob, prepared.name, target);
              await shareAnyoneWithLink(token, uploaded.id);
              const row = susunBaris(
                { namaFile: baseName(source.path), fileId: uploaded.id, link: uploaded.webViewLink },
                ctxBaris,
              );
              ubahRows((prev) => [...prev, row].sort(urutkanBaris));
              patchUpload(id, { status: 'done' });
            } catch (error) {
              if (error instanceof DriveError && error.status === 401) stop = true;
              patchUpload(id, { status: 'failed', error: error instanceof Error ? error.message : String(error) });
            }
          }
        }),
      );
      if (stop) toast.error('Login Google kedaluwarsa. Hubungkan ulang, lalu klik Ulangi.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyiapkan folder di Drive.');
    } finally {
      setUploading(false);
      void simpanSekarang();
    }
  }

  const uploadStats = useMemo(() => {
    const done = uploads.filter((u) => u.status === 'done').length;
    const failed = uploads.filter((u) => u.status === 'failed' || u.status === 'waiting').length;
    return { done, failed, total: uploads.length };
  }, [uploads]);

  // ── Draft ────────────────────────────────────────────────────
  const [filter, setFilter] = useState<'semua' | 'masalah'>('semua');
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [serverIssues, setServerIssues] = useState<Record<string, string[]>>({});

  const issues = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!ctx) return map;
    for (const row of rows) {
      const m = masalahBaris(row, { rkSet, periodeMulai: ctx.periode.mulai, periodeSelesai: ctx.periode.selesai });
      if (m.length) map.set(row.id, m);
    }
    return map;
  }, [rows, rkSet, ctx]);

  const tampil = filter === 'masalah' ? rows.filter((r) => issues.has(r.id) || r.perluReview) : rows;

  function ubahBaris(id: string, change: Partial<DraftRow>) {
    ubahRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...change, perluReview: false } : r)));
    setServerIssues((s) => {
      if (!s[id]) return s;
      const next = { ...s };
      delete next[id];
      return next;
    });
  }

  function hapusBaris(ids: string[]) {
    const set = new Set(ids);
    ubahRows((prev) => prev.filter((r) => !set.has(r.id)));
    setSelected(new Set());
  }

  function terapkanRk(rk: string) {
    ubahRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, rk, rkManual: true, perluReview: false } : r)));
    toast.success(`RK diterapkan ke ${selected.size} baris.`);
    setSelected(new Set());
  }

  function hitungUlang() {
    ubahRows((prev) => hitungUlangRk(prev, { rkList, aturanKustom: rkKeywords }));
    toast.success('Usulan RK disusun ulang (pilihan manual tidak diubah).');
  }

  async function hapusDraft() {
    if (!window.confirm('Hapus seluruh draft periode ini? File di Google Drive tidak ikut terhapus.')) return;
    const result = await deleteBuatCkpDraftAction(bulan, tahun);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    dirtyRef.current = false;
    setRows([]);
    setUploads([]);
    toast.success('Draft dihapus.');
  }

  // ── Submit ───────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const clientUploadId = useRef('');

  const ringkasanRk = useMemo(() => {
    const count = new Map<string, number>();
    for (const r of rows) count.set(r.rk, (count.get(r.rk) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const bisaSubmit = Boolean(ctx && rows.length > 0 && issues.size === 0 && !ctx.periode.locked && !uploading);

  async function submit() {
    if (!ctx) return;
    setSubmitting(true);
    await simpanSekarang();
    const result = await submitBuatCkpAction({ bulan, tahun, rows, clientUploadId: clientUploadId.current });
    setSubmitting(false);
    if (!result.ok) {
      setConfirmOpen(false);
      if (result.rowIssues) setServerIssues(Object.fromEntries(result.rowIssues.map((r) => [r.id, r.masalah])));
      toast.error(result.unmatchedRks?.length ? `${result.error} (${result.unmatchedRks.join('; ')})` : result.error);
      return;
    }
    dirtyRef.current = false;
    toast.success(result.duplicate ? 'CKP ini sudah pernah tersubmit.' : `CKP ${NAMA_BULAN[bulan - 1]} tersubmit (versi ${result.version ?? '-'}).`);
    router.push(`/pegawai/ckp/${result.uploadId}` as Route);
  }

  // ── Tampilan ─────────────────────────────────────────────────
  const opsiBulan = [tahun - 1, tahun, tahun + 1].flatMap((th) =>
    NAMA_BULAN.map((nama, i) => ({ value: `${th}-${i + 1}`, label: `${nama} ${th}` })),
  );
  const masalahCount = issues.size;
  const calendarEntries = rows.map((r) => ({
    tanggal_mulai: r.tanggalMulai || null,
    tanggal_selesai: r.tanggalSelesai || r.tanggalMulai || null,
    kegiatan: r.kegiatan,
    rencana_kinerja: r.rk,
    data_dukung: r.link,
  }));

  return (
    <>
      <Header />
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Buat CKP</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Unggah bukti dukung, periksa draft, lalu submit. Foto tersimpan di Google Drive Anda.
            </p>
          </div>
          <div className="w-56">
            <Select
              aria-label="Periode CKP"
              value={`${tahun}-${bulan}`}
              disabled={uploading || submitting}
              onChange={(event) => {
                const [th, bl] = event.target.value.split('-').map(Number);
                void gantiPeriode(bl, th);
              }}
              options={opsiBulan}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat data periode…
          </div>
        ) : loadError || !ctx ? (
          <div className="flex gap-3 rounded-xl border border-[var(--danger)] p-4 text-sm text-[var(--text-primary)]">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--danger)]" /> {loadError || 'Gagal memuat data.'}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--text-secondary)]">
              <span>
                Periode {NAMA_BULAN[bulan - 1]}: <strong className="text-[var(--text-primary)]">{tanggalPendek(ctx.periode.mulai)} – {tanggalPendek(ctx.periode.selesai)}</strong>
              </span>
              <span>{rkList.length} Sub-RK milik Anda</span>
              {ctx.lastUpload && (
                <span>
                  Sudah ada CKP versi {ctx.lastUpload.version} ({ctx.lastUpload.status}); submit akan membuat versi baru.
                </span>
              )}
            </div>

            {ctx.periode.locked && (
              <div className="flex gap-3 rounded-xl border border-[var(--warning)] p-4 text-sm text-[var(--text-primary)]">
                <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--warning)]" /> Periode ini dikunci admin. Draft tetap bisa
                disusun, tetapi belum bisa disubmit.
              </div>
            )}
            {rkList.length === 0 && (
              <div className="flex gap-3 rounded-xl border border-[var(--warning)] p-4 text-sm text-[var(--text-primary)]">
                <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--warning)]" /> Anda belum punya Sub-RK untuk tahun {tahun}.
                Tambahkan dulu di menu Rencana Kinerja atau hubungi ketua tim.
              </div>
            )}

            {/* 1. Unggah */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5" /> Unggah bukti dukung
                </CardTitle>
                <CardDescription>
                  Nama file dibaca jadi tanggal dan kegiatan, contoh <code>21 Oktober_Melakukan pelayanan PST.jpg</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!googleClientId ? (
                  <div className="text-sm text-[var(--warning)]">Google Client ID belum diatur oleh admin.</div>
                ) : token ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--secondary-strong)]" /> Drive: {driveEmail}
                    <Button size="sm" variant="ghost" onClick={hubungkanDrive} loading={connecting} disabled={uploading}>
                      Hubungkan ulang
                    </Button>
                    {driveFolderId && (
                      <a href={folderLink(driveFolderId)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--primary)] hover:underline">
                        <ExternalLink className="h-4 w-4" /> Folder Drive
                      </a>
                    )}
                  </div>
                ) : (
                  <Button onClick={hubungkanDrive} loading={connecting}>
                    <HardDrive className="h-4 w-4" /> Hubungkan Google Drive
                  </Button>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <label className={cn('inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-2 text-sm text-[var(--primary)]', (!token || uploading) && 'pointer-events-none opacity-50')}>
                    <UploadCloud className="h-4 w-4" /> Pilih ZIP / foto
                    <input
                      type="file"
                      multiple
                      accept=".zip,image/*,.heic,.heif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      className="sr-only"
                      onChange={(event) => {
                        void pilihFile(event.target.files);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <label className={cn('inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-2 text-sm text-[var(--primary)]', (!token || uploading) && 'pointer-events-none opacity-50')}>
                    <FolderOpen className="h-4 w-4" /> Pilih folder
                    <input
                      ref={folderInputRef}
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={(event) => {
                        void pilihFile(event.target.files);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <div className="w-64">
                    <Select
                      aria-label="Kualitas foto"
                      value={preset}
                      disabled={uploading}
                      onChange={(event) => setPreset(event.target.value as Preset)}
                      options={(Object.keys(PRESETS) as Preset[]).map((k) => ({ value: k, label: `Kualitas: ${PRESETS[k].label}` }))}
                    />
                  </div>
                </div>

                {uploads.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-primary)]">
                      {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {uploadStats.done} dari {uploadStats.total} file masuk draft
                      {!uploading && uploadStats.failed > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void jalankan(uploads.filter((u) => u.status !== 'done').map((u) => u.id))}
                        >
                          <RotateCcw className="h-4 w-4" /> Ulangi {uploadStats.failed} yang gagal
                        </Button>
                      )}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--sand-subtle)]">
                      <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${(uploadStats.done / uploadStats.total) * 100}%` }} />
                    </div>
                    {uploads.some((u) => u.status === 'failed') && (
                      <ul className="space-y-1 text-xs text-[var(--danger)]">
                        {uploads
                          .filter((u) => u.status === 'failed')
                          .slice(0, 10)
                          .map((u) => (
                            <li key={u.id}>
                              {u.name}: {u.error}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Draft */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Draft ({rows.length} baris)
                    </CardTitle>
                    <CardDescription>
                      {saving ? 'Menyimpan…' : savedAt ? `Tersimpan otomatis ${new Date(savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Belum ada draft.'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowSettings(true)}>
                      <Settings2 className="h-4 w-4" /> Pengaturan
                    </Button>
                    <Button size="sm" variant="outline" onClick={hitungUlang} disabled={!rows.length}>
                      <RefreshCw className="h-4 w-4" /> Hitung ulang RK
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCalendar((v) => !v)} disabled={!rows.length}>
                      <CalendarDays className="h-4 w-4" /> Kalender
                    </Button>
                    <Button size="sm" variant="ghost" onClick={hapusDraft} disabled={!rows.length || uploading}>
                      <Trash2 className="h-4 w-4" /> Hapus draft
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showCalendar && rows.length > 0 && <CalendarPreview bulan={bulan} tahun={tahun} entries={calendarEntries} />}

                {rows.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setFilter('semua')}
                      className={cn('rounded-full px-3 py-1', filter === 'semua' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--text-secondary)]')}
                    >
                      Semua ({rows.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilter('masalah')}
                      className={cn('rounded-full px-3 py-1', filter === 'masalah' ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--text-secondary)]')}
                    >
                      Perlu dicek ({rows.filter((r) => issues.has(r.id) || r.perluReview).length})
                    </button>
                    {selected.size > 0 && (
                      <div className="ml-auto flex flex-wrap items-center gap-2">
                        <span className="text-[var(--text-secondary)]">{selected.size} dipilih:</span>
                        <div className="w-full sm:w-96">
                          <RkPicker value="" options={rkList} extraOptions={rkLain} onChange={terapkanRk} placeholder="Terapkan RK ke baris terpilih…" />
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => hapusBaris([...selected])}>
                          <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {rows.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--sand-border)] p-8 text-center text-sm text-[var(--text-secondary)]">
                    Draft masih kosong. Unggah bukti dukung di atas.
                  </div>
                ) : (
                  <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[var(--sand-border)]">
                    {/* table-fixed + w-full: kolom selalu muat di lebar layar, tidak bisa digeser ke samping. */}
                    <table className="w-full table-fixed border-collapse text-left text-sm">
                      {/* Lebar kolom ditentukan di <th> (table-fixed). Di layar sempit kolom
                          Tanggal dan RK disembunyikan; isinya pindah ke sel Kegiatan. */}
                      <thead className="bg-[var(--sand-subtle)] text-xs text-[var(--text-secondary)]">
                        <tr>
                          <th className="w-10 px-3 py-2">
                            <input
                              type="checkbox"
                              aria-label="Pilih semua baris"
                              checked={tampil.length > 0 && tampil.every((r) => selected.has(r.id))}
                              onChange={(event) => setSelected(event.target.checked ? new Set(tampil.map((r) => r.id)) : new Set())}
                            />
                          </th>
                          <th className="w-[124px] px-2 py-2 font-medium max-md:hidden">Tanggal</th>
                          <th className="w-[32%] px-2 py-2 font-medium max-md:w-auto">
                            Kegiatan<span className="md:hidden"> &amp; Rencana Kinerja</span>
                          </th>
                          <th className="px-2 py-2 font-medium max-md:hidden">Rencana Kinerja (Sub-RK)</th>
                          <th className="w-11 px-2 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {tampil.map((row) => {
                          const m = [...(issues.get(row.id) ?? []), ...(serverIssues[row.id] ?? [])];
                          const tanggal = (
                            <div className="space-y-1">
                              <input
                                type="date"
                                aria-label="Tanggal mulai"
                                value={row.tanggalMulai}
                                onChange={(event) => ubahBaris(row.id, { tanggalMulai: event.target.value })}
                                className="w-full min-w-0 rounded-lg border border-[var(--sand-border)] bg-[var(--card-bg)] px-1.5 py-1 text-[var(--text-primary)]"
                              />
                              <input
                                type="date"
                                aria-label="Tanggal selesai"
                                value={row.tanggalSelesai}
                                onChange={(event) => ubahBaris(row.id, { tanggalSelesai: event.target.value })}
                                className="w-full min-w-0 rounded-lg border border-[var(--sand-border)] bg-[var(--card-bg)] px-1.5 py-1 text-xs text-[var(--text-secondary)]"
                              />
                            </div>
                          );
                          return (
                            <tr
                              key={row.id}
                              className={cn(
                                'border-t border-[var(--sand-border)] align-top',
                                m.length > 0 && 'bg-[color-mix(in_srgb,var(--danger)_6%,transparent)]',
                              )}
                            >
                              <td className="px-3 py-3">
                                <input
                                  type="checkbox"
                                  aria-label={`Pilih ${row.namaFile}`}
                                  checked={selected.has(row.id)}
                                  onChange={(event) =>
                                    setSelected((s) => {
                                      const next = new Set(s);
                                      if (event.target.checked) next.add(row.id);
                                      else next.delete(row.id);
                                      return next;
                                    })
                                  }
                                />
                              </td>
                              <td className="px-2 py-2 max-md:hidden">{tanggal}</td>
                              <td className="px-2 py-2">
                                {/* Di layar sempit kolom tanggal disembunyikan dan tanggal tampil di sini. */}
                                <div className="mb-2 md:hidden">{tanggal}</div>
                                <textarea
                                  aria-label="Kegiatan"
                                  value={row.kegiatan}
                                  rows={3}
                                  onChange={(event) => ubahBaris(row.id, { kegiatan: event.target.value })}
                                  className="block w-full resize-y rounded-lg border border-[var(--sand-border)] bg-[var(--card-bg)] px-2 py-1.5 text-[var(--text-primary)]"
                                />
                                {row.link ? (
                                  <a href={row.link} target="_blank" rel="noreferrer" className="mt-1 block truncate text-xs text-[var(--text-secondary)] hover:underline" title={row.namaFile}>
                                    {row.namaFile} ↗
                                  </a>
                                ) : (
                                  <span className="mt-1 block truncate text-xs text-[var(--text-secondary)]" title={row.namaFile}>
                                    {row.namaFile}
                                  </span>
                                )}
                                {(m.length > 0 || (row.perluReview && row.alasan)) && (
                                  <div className="mt-1 text-xs text-[var(--danger)]">{m.length ? m.join(' · ') : row.alasan}</div>
                                )}
                                <div className="mt-2 md:hidden">
                                  <RkPicker
                                    value={row.rk}
                                    options={rkList}
                                    extraOptions={rkLain}
                                    usulan={row.usulan}
                                    invalid={m.some((x) => x.startsWith('RK'))}
                                    onChange={(rk) => ubahBaris(row.id, { rk, rkManual: true })}
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-2 max-md:hidden">
                                <RkPicker
                                  value={row.rk}
                                  options={rkList}
                                  extraOptions={rkLain}
                                  usulan={row.usulan}
                                  invalid={m.some((x) => x.startsWith('RK'))}
                                  onChange={(rk) => ubahBaris(row.id, { rk, rkManual: true })}
                                />
                              </td>
                              <td className="px-1 py-2">
                                <Button size="icon-sm" variant="ghost" aria-label="Hapus baris" title="Hapus dari draft (file di Drive tetap ada)" onClick={() => hapusBaris([row.id])}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {rows.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sand-border)] pt-4">
                    <div className="text-sm text-[var(--text-secondary)]">
                      {masalahCount > 0 ? (
                        <span className="text-[var(--danger)]">{masalahCount} baris perlu diperbaiki sebelum submit.</span>
                      ) : (
                        <span className="text-[var(--secondary-strong)]">Semua baris valid.</span>
                      )}
                    </div>
                    <Button
                      disabled={!bisaSubmit}
                      onClick={() => {
                        clientUploadId.current = crypto.randomUUID();
                        setConfirmOpen(true);
                      }}
                    >
                      <Send className="h-4 w-4" /> Submit ke SIKAP
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {showSettings && (
        <SettingsDialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          kamus={kamus}
          rkKeywords={rkKeywords}
          rkList={rkList}
          rkLain={rkLain}
          onSaved={(value) => {
            setKamus(value.kamus);
            setRkKeywords(value.rkKeywords);
          }}
        />
      )}

      <Dialog open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit CKP {NAMA_BULAN[bulan - 1]} {tahun}?</DialogTitle>
            <DialogDescription>
              {rows.length} kegiatan akan masuk antrean penilaian ketua tim.
              {ctx?.lastUpload ? ` CKP versi ${ctx.lastUpload.version} akan diarsipkan.` : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="mb-2 flex justify-between px-3 text-xs font-medium text-[var(--text-secondary)]">
              <span>Rencana Kinerja (Sub-RK)</span>
              <span>Kegiatan</span>
            </div>
            <ul className="max-h-72 divide-y divide-[var(--sand-border)] overflow-y-auto rounded-xl border border-[var(--sand-border)] text-sm">
              {ringkasanRk.map(([rk, n]) => (
                <li key={rk} className="flex items-start justify-between gap-4 px-3 py-2 text-[var(--text-primary)]">
                  <span>{rk}</span>
                  <span className="min-w-6 shrink-0 rounded-full bg-[var(--sand-subtle)] px-2 text-center text-xs font-medium leading-6 tabular-nums">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button onClick={submit} loading={submitting}>
              <Send className="h-4 w-4" /> Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
