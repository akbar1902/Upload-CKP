'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BookA, KeyRound, Plus, Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { saveBuatCkpSettingsAction, type AturanKunci, type KamusEntry } from '@/app/actions/buat-ckp';
import { RkPicker } from './_rk-picker';

type Props = {
  open: boolean;
  onClose: () => void;
  kamus: KamusEntry[];
  rkKeywords: AturanKunci[];
  /** Sub-RK resmi pegawai (pilihan utama) dan pilihan lain. */
  rkList: string[];
  rkLain: string[];
  onSaved: (value: { kamus: KamusEntry[]; rkKeywords: AturanKunci[] }) => void;
};

type Tab = 'kunci' | 'kamus';
type AturanEdit = AturanKunci & { key: string };
type KamusEdit = KamusEntry & { key: string };

let seq = 0;
const kunciBaru = () => `k${(seq += 1)}`;

/** Kolom isian kata kunci: tekan Enter atau koma untuk menambah chip. */
function KunciInput({ kunci, onChange }: { kunci: string[]; onChange: (kunci: string[]) => void }) {
  const [draft, setDraft] = useState('');

  function tambah(raw: string) {
    const baru = raw
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
      .filter((k) => !kunci.some((x) => x.toLowerCase() === k.toLowerCase()));
    if (baru.length) onChange([...kunci, ...baru]);
    setDraft('');
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-[var(--sand-border)] bg-[var(--card-bg)] px-2 py-1.5 focus-within:border-[var(--primary)]">
      {kunci.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] py-1 pl-3 pr-1 text-sm font-medium text-[var(--primary)]"
        >
          {k}
          <button
            type="button"
            aria-label={`Hapus kata kunci ${k}`}
            onClick={() => onChange(kunci.filter((x) => x !== k))}
            className="rounded-full p-0.5 hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => {
          const v = event.target.value;
          if (v.includes(',')) tambah(v);
          else setDraft(v);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            tambah(draft);
          } else if (event.key === 'Backspace' && !draft && kunci.length) {
            onChange(kunci.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && tambah(draft)}
        placeholder={kunci.length ? '+ kata' : 'Ketik kata kunci, Enter'}
        className="h-8 min-w-[72px] flex-1 bg-transparent px-1 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
      />
    </div>
  );
}

export function SettingsDialog({ open, onClose, kamus, rkKeywords, rkList, rkLain, onSaved }: Props) {
  const [tab, setTab] = useState<Tab>('kunci');
  const [aturan, setAturan] = useState<AturanEdit[]>(() => rkKeywords.map((a) => ({ ...a, key: kunciBaru() })));
  const [entri, setEntri] = useState<KamusEdit[]>(() => kamus.map((e) => ({ ...e, key: kunciBaru() })));
  const [cari, setCari] = useState('');
  const [saving, setSaving] = useState(false);

  const entriTampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return entri;
    return entri.filter((e) => e.singkatan.toLowerCase().includes(q) || e.ekspansi.toLowerCase().includes(q));
  }, [entri, cari]);

  function ubahAturan(key: string, change: Partial<AturanKunci>) {
    setAturan((list) => list.map((a) => (a.key === key ? { ...a, ...change } : a)));
  }

  function ubahEntri(key: string, change: Partial<KamusEntry>) {
    setEntri((list) => list.map((e) => (e.key === key ? { ...e, ...change } : e)));
  }

  async function importProfil(file: File | undefined) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const bundle = data?.bundle ?? data;
      const k = Array.isArray(bundle?.kamus) ? (bundle.kamus as KamusEntry[]) : [];
      const a = Array.isArray(bundle?.kunci) ? (bundle.kunci as AturanKunci[]) : [];
      if (!k.length && !a.length) throw new Error('kosong');
      if (k.length) setEntri(k.map((e) => ({ ...e, key: kunciBaru() })));
      if (a.length) setAturan(a.map((x) => ({ ...x, key: kunciBaru() })));
      toast.success(`Diimpor ${a.length} aturan kata kunci dan ${k.length} singkatan. Klik Simpan.`);
    } catch {
      toast.error('File bukan ekspor profil CKP App (ckp-profil-*.json).');
    }
  }

  async function save() {
    const bersihAturan = aturan.map(({ rk, kunci }) => ({ rk: rk.trim(), kunci })).filter((a) => a.rk && a.kunci.length);
    const tidakLengkap = aturan.length - bersihAturan.length;
    const bersihKamus = entri
      .map(({ singkatan, ekspansi }) => ({ singkatan: singkatan.trim(), ekspansi: ekspansi.trim() }))
      .filter((e) => e.singkatan && e.ekspansi);
    setSaving(true);
    const result = await saveBuatCkpSettingsAction({ kamus: bersihKamus, rkKeywords: bersihAturan });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onSaved({ kamus: result.kamus, rkKeywords: result.rkKeywords });
    toast.success(tidakLengkap ? `Disimpan. ${tidakLengkap} aturan tanpa RK atau kata kunci dilewati.` : 'Pengaturan disimpan.');
    onClose();
  }

  const tabButton = (id: Tab, label: string, jumlah: number, Icon: typeof KeyRound) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
        tab === id
          ? 'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span className="rounded-full bg-[var(--sand-subtle)] px-2 text-xs tabular-nums text-[var(--text-secondary)]">{jumlah}</span>
    </button>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pengaturan penyusun draft</DialogTitle>
          <DialogDescription>Dipakai saat file diunggah dan saat Anda menekan Hitung ulang RK.</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5 pt-2">
          <div role="tablist" className="flex gap-1 rounded-xl bg-[var(--sand-subtle)] p-1">
            {tabButton('kunci', 'Kata kunci RK', aturan.length, KeyRound)}
            {tabButton('kamus', 'Kamus singkatan', entri.length, BookA)}
          </div>

          {tab === 'kunci' ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Bila nama file memuat salah satu kata kunci, Sub-RK di barisnya langsung dipilih. Kata dicocokkan utuh,
                jadi <strong className="text-[var(--text-primary)]">SE</strong> tidak ikut cocok dengan <em>Susenas</em>.
              </p>

              {aturan.length === 0 && (
                <div className="rounded-xl border border-dashed border-[var(--sand-border)] p-6 text-center text-sm text-[var(--text-secondary)]">
                  Belum ada aturan kata kunci.
                </div>
              )}

              {aturan.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-[var(--sand-border)]">
                  <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,3fr)_36px] gap-3 bg-[var(--sand-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] sm:grid">
                    <span>Kata kunci di nama file</span>
                    <span>Sub-RK yang dipilih</span>
                    <span />
                  </div>
                  <ul>
                    {aturan.map((a, i) => (
                      <li
                        key={a.key}
                        className="grid grid-cols-[minmax(0,1fr)_36px] gap-x-3 gap-y-2 border-t border-[var(--sand-border)] p-3 first:border-t-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_36px] sm:first:border-t"
                      >
                        <KunciInput kunci={a.kunci} onChange={(kunci) => ubahAturan(a.key, { kunci })} />
                        <div className="col-span-1 col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1">
                          <RkPicker
                            value={a.rk}
                            options={rkList}
                            extraOptions={rkLain}
                            invalid={Boolean(a.rk) && !rkList.includes(a.rk) && !rkLain.includes(a.rk)}
                            onChange={(rk) => ubahAturan(a.key, { rk })}
                            placeholder="Pilih Sub-RK tujuan…"
                          />
                        </div>
                        <div className="col-start-2 row-start-1 sm:col-start-3">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Hapus aturan ${i + 1}`}
                            onClick={() => setAturan((list) => list.filter((x) => x.key !== a.key))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={() => setAturan((list) => [...list, { rk: '', kunci: [], key: kunciBaru() }])}>
                <Plus className="h-4 w-4" /> Tambah aturan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Singkatan di nama file dikembangkan otomatis di kolom Kegiatan. Contoh: <strong className="text-[var(--text-primary)]">PST</strong>{' '}
                menjadi <em>Pelayanan Statistik Terpadu (PST)</em>.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--sand-border)] bg-[var(--card-bg)] px-3 focus-within:border-[var(--primary)]">
                  <Search className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                  <input
                    value={cari}
                    onChange={(event) => setCari(event.target.value)}
                    placeholder="Cari singkatan…"
                    className="h-full w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCari('');
                    setEntri((list) => [{ singkatan: '', ekspansi: '', key: kunciBaru() }, ...list]);
                  }}
                >
                  <Plus className="h-4 w-4" /> Tambah singkatan
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[var(--sand-border)]">
                <table className="w-full table-fixed text-sm">
                  <thead className="bg-[var(--sand-subtle)] text-left text-xs font-medium text-[var(--text-secondary)]">
                    <tr>
                      <th className="w-32 px-3 py-2 sm:w-40">Singkatan</th>
                      <th className="px-3 py-2">Kepanjangan</th>
                      <th className="w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {entriTampil.map((e) => (
                      <tr key={e.key} className="border-t border-[var(--sand-border)]">
                        <td className="px-2 py-1.5">
                          <input
                            aria-label="Singkatan"
                            value={e.singkatan}
                            onChange={(event) => ubahEntri(e.key, { singkatan: event.target.value })}
                            placeholder="PST"
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 font-semibold text-[var(--text-primary)] outline-none hover:border-[var(--sand-border)] focus:border-[var(--primary)] focus:bg-[var(--card-bg)]"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            aria-label="Kepanjangan"
                            value={e.ekspansi}
                            onChange={(event) => ubahEntri(e.key, { ekspansi: event.target.value })}
                            placeholder="Pelayanan Statistik Terpadu (PST)"
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 text-[var(--text-primary)] outline-none hover:border-[var(--sand-border)] focus:border-[var(--primary)] focus:bg-[var(--card-bg)]"
                          />
                        </td>
                        <td className="pr-2 text-right">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Hapus ${e.singkatan || 'baris'}`}
                            onClick={() => setEntri((list) => list.filter((x) => x.key !== e.key))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {entriTampil.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-6 text-center text-[var(--text-secondary)]">
                          {cari ? 'Tidak ada singkatan yang cocok.' : 'Kamus masih kosong.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]">
            <Upload className="h-4 w-4" /> Impor dari CKP App
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                void importProfil(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </label>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={save} loading={saving}>
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
