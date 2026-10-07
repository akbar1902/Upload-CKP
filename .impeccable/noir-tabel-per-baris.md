# Noir — Spec Tabel Per-Baris: `ketua_tim/rk/[id]/_client.tsx`

Sumber terbaca lengkap: `src/app/ketua_tim/rk/[id]/_client.tsx` — **888 baris**.
Stack: Next.js + Tailwind + CSS var (`--primary`, `--card-bg`, `--border`, `--sand-subtle`, `--sand-border`, `--text-primary/secondary/tertiary`, `--success-*`, `--warning-*`).

## 1. Model baris (flatten, bukan kartu-bersarang)

Satu baris = **1 pasangan pegawai × RK Anggota**. 1 orang dengan 3 RK = 3 baris, nama diulang di tiap baris.

```ts
type RowBaris = {
  userId: string;
  nama: string;            // user.full_name || 'Pegawai'
  rkName: string;          // entry.rencana_kinerja || '(Tanpa RK)'
  entries: CKPEntry[];     // sudah sort bulan lalu row_number (logika lama, dipertahankan)
  uploads: (CKPUpload & { user?: User })[]; // uploads milik user tsb (untuk monthly breakdown triwulan)
  defaultScore: number | null; // rata-rata dibulatkan, hanya jika SEMUA entries sudah dinilai (logika lama)
  canReview: boolean;      // !isTriwulan && !isApproved && !isOwnGroup && ada upload non-draft (logika lama)
  isOwnGroup: boolean;
};
```

Flatten dilakukan di `useMemo` yang sama (baris ±502–588), **setelah** sub-group `rkMap` per user selesai dibangun. Jangan ubah logika `rkMap`, `defaultScore`, `canReview`, sort entries.

## 2. Struktur kolom persis

Tabel 3 kolom: **Nama | Nama RK (+ sub-meta) | Nilai (+ aksi expand)**.

Header tabel (desktop):

| Kolom | Header | Isi sel |
|---|---|---|
| 1 | Nama | `user.full_name` (bold, `truncate`, `title={nama}` untuk tooltip). **Tanpa avatar lingkaran, tanpa NIP.** |
| 2 | Nama RK | `rkName` (line-clamp-2 di mobile, full di desktop, `title={rkName}`) + sub-meta satu baris: `{entries.length} kegiatan • Capaian: {avgProgres}%` + badge `Dinilai` bila `allScored` (semua entries `nilai !== null`). |
| 3 | Nilai | Label kecil `NILAI` + input inline (bila `canReview`) atau teks `defaultScore ?? '—'` (read-only) + tombol chevron expand/collapse detail. |

Aturan layout:

- Desktop (`sm+`): `<table>` atau `grid grid-cols-[minmax(160px,1fr)_minmax(0,2fr)_110px]` — kolom 1 fixed-ish, kolom 2 fleksibel (`min-w-0`), kolom 3 sempit rata kanan.
- Header row sticky opsional, `text-[10px] uppercase tracking-wider` warna `var(--text-tertiary)`.
- Zebra/hover: `hover:bg-[var(--sand-subtle)]`; baris `border-b` warna `var(--border)`; baris `allScored` boleh `border-l-2` / `borderColor: var(--primary)` seperti kartu lama (baris 144).
- Kolom Nilai selalu `text-right`, input `w-16 text-center` (kelas lama dipertahankan, lihat §8).
- Expand detail = **full-width row di bawah baris** (`col-span-full`), bukan kolom ke-4. Isi = blok detail lama persis (triwulan breakdown + grid kegiatan, baris 223–297).

## 3. Sort final (menggantikan sort lama)

Sort lama (baris 577–583): pegawai belum-lengkap di atas, lalu nama A-Z. **Dihapus.**

Sort baru — pada level **baris** (bukan section):

1. `nama.localeCompare(nama, 'id')` A-Z (case-insensitive, kosong = `''`).
2. Bila nama sama → `rkName.localeCompare(rkName, 'id')` A-Z.

Tidak ada lagi pemisah "belum-dinilai di atas". Badge `Dinilai` / `x/y` tetap memberi sinyal visual sebagai gantinya. Sort entries di dalam satu RK **tetap**: bulan lalu `row_number` (baris 532–538).

## 4. NIP — dihapus dari mana saja

Hapus dari **semua render visual**:

- `PegawaiSection` header baris ±348: `<span>NIP. {user.nip}</span>` + fallback `'NIP tidak tersedia'` → **hapus seluruh `<span>` NIP**. Sisa sub-meta pegawai hilang bersama kartu pegawai (kartu pegawai tidak ada lagi — hanya nama di kolom 1).
- Tidak ada kolom NIP di tabel, tidak ada NIP di judul/tooltip/mobile/expand detail.
- Search matching baris ±563 `user.nip?.toLowerCase().includes(q)` → **hapus**, agar konsisten ( user tidak bisa mencari hal yang tak terlihat).

**Tidak dihapus**: export Excel `handleExportExcel` (baris 640–681) — header `['No','Nama Pegawai','NIP','RK Anggota','Jml Kegiatan','Capaian (%)','Nilai']` dan sel `sec.user.nip || '-'` **tetap persis**.

## 5. Jumlah kegiatan — tampil di mana

Tetap tampil di 4 tempat:

1. **Kolom 2 sub-meta** tiap baris: `{entries.length} kegiatan • Capaian: {avgProgres}%` (`avgProgres` = rata-rata `e.progres`, `.toFixed(0)` — rumus lama baris 79–81).
2. **Expand detail**: grid `Detail Kegiatan` per entry (kegiatan, capaian, `#row_number`, tanggal, `DataDukungLink`, progres, nilai, `catatan_koreksi`) — markup lama baris 240–295 dipindah utuh ke full-width row.
3. **KPI** `Total RK Anggota` = `totalRkAnggota` (jumlah baris) — definisi tetap.
4. **Export Excel** kolom `Jml Kegiatan` + `Capaian (%)` — rumus tetap.

## 6. Yang dipertahankan

- **Badge**: per-baris `Dinilai` (hijau, bila semua entries RK tsb dinilai); badge per-pegawai lama (`Semua RK Dinilai`, `{scored}/{total} RK Dinilai`, `Dinilai pimpinan` untuk kartu milik sendiri) **diganti padanannya di level baris**: `Dinilai` bila `defaultScore !== null`; bila `isOwnGroup` tampilkan badge `Dinilai pimpinan` + read-only. Tidak ada badge baru selain ini.
- **Progress**: teks `{scoredRkCount}/{rkGroups.length}` per pegawai **dihapus bersama kartu pegawai**; sebagai gantinya tiap baris menunjukkan `defaultScore ?? '—'` + badge. KPI `Pegawai Selesai` + `Rata-rata Nilai` tetap (rumus §6.1).
- **Search**: satu input, placeholder `Cari pegawai atau RK...`, filter case-insensitive atas `nama`, `rkName`, `kegiatan`, `capaian`. `forceExpanded={!!searchQuery.trim()}` tetap membuka kartu/baris hasil — tapi **hanya level baris** (detail RK di dalam tetap manual, sesuai komentar baris 67–68 & 326–327).
- **KPI (4 kartu, rumus tetap)**:
  1. `Total Pegawai` = `new Set(uploads.map(u => u.user_id)).size`.
  2. `Total RK Anggota` = jumlah baris (`totalRkAnggota`).
  3. `Pegawai Selesai` = user yang **semua** entries-nya `nilai !== null`.
  4. `Rata-rata Nilai` = rata-rata dari rata-rata per-user atas scored entries (baris 610–624); triwulan `Math.round`, bulanan `.toFixed(1)`.

## 7. Perilaku input nilai (tetap, pindah ke kolom 3)

- State per baris (`score`, `saving`) + `useEffect` sinkron `defaultScore` — logika lama baris 70–75.
- Simpan saat **blur** (`handleBlur`): kosong → `null`; validasi `0–100` integer (`toast.error('Nilai harus berupa angka 0-100')` + revert); skip bila sama dengan tersimpan; `saving` → spinner `RefreshCw animate-spin`, input `disabled`.
- **Enter** = blur + fokus ke `.score-input` berikutnya (`querySelectorAll('.score-input:not(:disabled)')`, focus + select) — kelas `score-input` wajib dipertahankan persis agar navigasi antar-baris jalan.
- `onSaveScore(uploadIds, score, rkAnggotaName)` → `handleSaveScore` dengan optimistic update + `gradeRencanaKinerjaAction(uploadIds, rkAnggotaName, score, rkId)` + invalidate `['rk-detail']`, `['ketua-tim-uploads']`, `['ckp-detail']`, `['pegawai-uploads']`, `['pimpinan-uploads']` + rollback + toast gagal. **Tidak boleh diubah.**
- Read-only bila `!canReview` (triwulan / approved / kartu sendiri): tampilkan teks tebal `defaultScore ?? '—'` (hijau bila ada nilai, `var(--text-tertiary)` bila belum).
- `onClick={e => e.stopPropagation()}` pada wrapper input agar tidak toggle expand.

## 8. Expand detail

- Toggle via klik baris (kecuali area input) atau tombol chevron (`ChevronUp/Down size 14–16`, kelas tombol lama `p-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400/500`).
- State `expandedState` per baris, default tutup; search tidak memaksa detail terbuka.
- Isi = blok lama utuh: triwulan monthly breakdown (bila `isTriwulan && monthlyScores.length`), judul `Detail Kegiatan`, grid `grid-cols-1 md:grid-cols-2` kartu entry, tombol `AlertTriangle` tandai-perbaiki (bila `canReview && onMarkEntryClick`), modal `entryToMark` tidak berubah.

## 9. Responsive mobile

- `<640px`: tabel jadi **daftar baris kartu** — tiap baris `display:block`, kolom 1 (nama) + kolom 3 (nilai + chevron) satu baris atas, kolom 2 (RK + sub-meta) di bawahnya full-width. Judul RK `line-clamp-2`, ketuk judul toggle clamp (handler lama baris 160–166 dipertahankan).
- Input nilai `w-16` tetap; tidak boleh overflow horizontal (`min-w-0`, `truncate`/`break-words` seperti lama).
- KPI grid tetap `grid-cols-2 lg:grid-cols-4`.

## 10. A11y keyboard

- Baris toggle = `<button>` atau `tabIndex={0}` + `onKeyDown` Enter/Space; chevron button punya `aria-expanded` + `aria-label="Tampilkan detail kegiatan"`.
- Input nilai: `type="number" min=0 max=100`, `placeholder="—"`, `title="Tekan Enter atau klik di luar untuk menyimpan"`, `aria-label={`Nilai ${rkName} milik ${nama}`}`.
- Pertahankan `focus:ring-2 focus:ring-[var(--primary-ring)]` pada input dan search.

---

## 11. Kontrak untuk Homelander (implementasi)

**Komponen yang boleh dibentuk ulang:**

| Nama | Props | Keterangan |
|---|---|---|
| `RkBarisRow` (baru, pengganti render `RkAnggotaGroup` sebagai kartu) | `{ nama, rkName, entries, uploads, canReview, defaultScore, isOwnGroup, isTriwulan, bulan, onSaveScore, onMarkEntryClick, forceExpanded }` — subset props `RkAnggotaGroup` lama + `nama` | Logika input/expand/monthly dipindah utuh; kelas `score-input` wajib ada di `<input>` |
| `PegawaiSection` | **hapus** (diganti tabel flat). Bila dipertahankan sebagai grup visual, harus render tanpa NIP | Preferensi Noir: hapus |
| `KPICard`, `Header`, modal `entryToMark`, tombol back, `Export Excel` | props & markup tetap | Jangan restyle |

**Kelas yang wajib dipertahankan persis:** `score-input`, `kpi-card`, `activity-card` (bila dipakai), `animate-fade-in`, `line-clamp-2`.

**YANG TIDAK BOLEH DIUBAH (kontrak keras):**

1. `gradeRencanaKinerjaAction(uploadIds, rkAnggotaName, score, rkId)` — signature + pemanggilan di `handleSaveScore`.
2. `handleExportExcel` — header, kolom (termasuk NIP), `ws['!cols']`, nama file, toast. Tanpa perubahan.
3. Query keys: `['rk-detail', rkId, bulan, tahun]` (+ `staleTime 2 mnt`, `keepPreviousData`, `networkMode 'always'`), invalidate 5 keys di `handleSaveScore`, `refetch()` setelah tandai-entry.
4. Logika scoring: `defaultScore` (rata-rata bulat hanya bila semua entries dinilai), `canReview`, `isOwnGroup` read-only, sort entries (bulan → row_number), `avgProgress`/`avgScoreRaw`, triwulan `monthlyScores` + mode terkunci.
5. `markEntryAction` + modal catatan koreksi.
6. Search matching hanya dikurangi NIP; cakupan nama/RK/kegiatan/capaian tetap.

**Checklist verifikasi Homelander:** `pnpm tsc --noEmit` hijau; tidak ada string `nip` (case-insensitive) di JSX render (kecuali `handleExportExcel`); tiap baris menampilkan `kegiatan` count + capaian; sort A-Z nama lalu RK; Enter pindah fokus antar input; tidak ada query key baru.
