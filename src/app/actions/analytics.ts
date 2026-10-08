"use server";

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';

// ============================================================
// Analitik CKP — agregat siap-pakai untuk halaman /analitik
// (khusus role pimpinan & admin).
//
// Catatan teknis:
//   * Semua query memakai adminClient (bypass RLS) SETELAH sesi + role
//     diverifikasi lewat createServerSupabaseClient.
//   * Supabase membatasi 1000 baris per request, jadi setiap pembacaan
//     tabel memakai helper `fetchAllRows` (loop .range(0..999)).
//   * Query selalu di-order by `id` agar paginasi deterministik.
// ============================================================

export interface AnalyticsRingkasan {
  totalPegawaiAktif: number;
  jumlahUpload: number;
  jumlahPegawaiMelapor: number;
  jumlahApproved: number;
  /** Persentase upload periode yang sudah approved (0–100, 1 desimal). */
  persenApproved: number;
  /** Rata-rata avg_progres upload periode (0–100, 1 desimal). */
  rataRataProgres: number;
  /** Rata-rata nilai; null bila belum ada upload yang dinilai. */
  rataRataNilai: number | null;
}

export interface AnalyticsTrenBulan {
  bulan: number;
  label: string;
  jumlahUpload: number;
  jumlahApproved: number;
  persenApproved: number;
  rataRataProgres: number;
  rataRataNilai: number | null;
}

export interface AnalyticsDistribusiStatus {
  status: string;
  label: string;
  jumlah: number;
}

export interface AnalyticsKetuaTimRow {
  ketuaTimId: string;
  nama: string;
  nip: string | null;
  /** Jumlah RK pada mastar RK yang dipetakan ke ketua tim ini (tahun terpilih). */
  jumlahRk: number;
  /** Entri dengan nilai NULL pada upload periode yang sudah dikirim. */
  entriBelumDinilai: number;
  /** Jumlah upload (distinct) yang masih memuat entri belum dinilai. */
  uploadMenunggu: number;
}

export interface AnalyticsSla {
  /** Rata-rata hari dari uploaded_at → approved_at (null bila tak ada data). */
  rataRataHari: number | null;
  /** Jumlah upload approved pada tahun terpilih. */
  jumlahApproved: number;
  /** Jumlah upload approved yang punya kedua tanggal (basis perhitungan SLA). */
  jumlahAdaData: number;
}

export interface AnalyticsOverview {
  bulan: number | string;
  tahun: number;
  ringkasan: AnalyticsRingkasan;
  tren: AnalyticsTrenBulan[];
  distribusiStatus: AnalyticsDistribusiStatus[];
  perKetuaTim: AnalyticsKetuaTimRow[];
  sla: AnalyticsSla;
}

export interface AnalyticsActionResult {
  success: boolean;
  data: AnalyticsOverview | null;
  error: string | null;
}

// ── Konstanta lokal (tidak diekspor: file "use server" hanya boleh
//    mengekspor async function + tipe) ─────────────────────────
const TRIWULAN_MAP: Record<string, number[]> = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
  T4: [10, 11, 12],
};

const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const STATUS_ORDER = [
  'draft',
  'submitted',
  'scored',
  'approved',
  'rejected',
  'revision_required',
  'superseded',
] as const;

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Menunggu Review',
  scored: 'Sudah Dinilai',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  revision_required: 'Perlu Revisi',
  superseded: 'Diganti (Arsip)',
};

/**
 * Status upload yang masih "berjalan" di alur penilaian — dipakai untuk
 * menghitung tunggakan (konsisten dengan getPendingScoringKetuaTim).
 */
const STATUS_PENILAIAN_AKTIF = ['submitted', 'scored', 'revision_required'];

// ── Tipe baris database (subset kolom yang dibaca) ───────────
interface UploadRow {
  id: string;
  user_id: string;
  bulan: number;
  tahun: number;
  status: string;
  total_entries: number | null;
  avg_progres: number | null;
  rata_rata_nilai: number | null;
  uploaded_at: string | null;
  approved_at: string | null;
}

interface EntryRow {
  id: string;
  upload_id: string;
  rencana_kinerja: string | null;
  rk_ketua_tim_id: string | null;
  nilai: number | null;
}

interface MappingRow {
  id: string;
  rencana_kinerja: string;
  ketua_tim_id: string | null;
  tim_kerja: string | null;
  tahun: number | null;
  is_active: boolean | null;
}

interface KetuaTimUserRow {
  id: string;
  full_name: string | null;
  nip: string | null;
}

// ── Helper: paginasi semua baris (batas 1000/request) ────────
type RangePage<T> = {
  data: T[] | null;
  error: { message?: string } | null;
};

async function fetchAllRows<T>(
  page: (from: number, to: number) => PromiseLike<RangePage<T>>
): Promise<T[]> {
  const PAGE_SIZE = 1000;
  const rows: T[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1);
    if (error) {
      throw new Error(error.message || 'Gagal memuat data dari database');
    }
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }

  return rows;
}

// ── Helper: statistik kecil & konversi periode ───────────────
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Mengubah `bulan` (1–12 atau 'T1'–'T4') menjadi daftar nomor bulan. */
function resolveMonthNumbers(bulan: number | string): number[] | null {
  if (typeof bulan === 'string' && bulan.startsWith('T')) {
    return TRIWULAN_MAP[bulan] ?? null;
  }
  const parsed = typeof bulan === 'string' ? parseInt(bulan, 10) : bulan;
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) return null;
  return [parsed];
}

// ============================================================
// Server action utama
// ============================================================
export async function getAnalyticsOverviewAction(
  bulan: number | string,
  tahun: number
): Promise<AnalyticsActionResult> {
  try {
    // ── 1. Verifikasi sesi ─────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, data: null, error: 'Sesi berakhir. Silakan login ulang.' };
    }

    // ── 2. Verifikasi role (pimpinan/admin) ────────────────
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = dbUser?.role ?? (user.user_metadata?.role as string | undefined);
    if (role !== 'pimpinan' && role !== 'admin') {
      return {
        success: false,
        data: null,
        error: 'Hanya pimpinan/admin yang dapat mengakses halaman analitik.',
      };
    }

    // ── 3. Validasi periode ────────────────────────────────
    const tahunNum = Number(tahun);
    if (!Number.isInteger(tahunNum) || tahunNum < 2020 || tahunNum > 2100) {
      return { success: false, data: null, error: 'Tahun tidak valid (2020–2100).' };
    }

    const monthNumbers = resolveMonthNumbers(bulan);
    if (!monthNumbers) {
      return { success: false, data: null, error: 'Periode bulan tidak valid (1–12 atau T1–T4).' };
    }

    const admin = createAdminClient();

    // ── 4. Ambil semua upload tahun terpilih (sekali fetch) ─
    // Menjadi basis ringkasan, distribusi, tren 12 bulan, dan SLA.
    const yearUploads = await fetchAllRows<UploadRow>((from, to) =>
      admin
        .from('ckp_uploads')
        .select(
          'id, user_id, bulan, tahun, status, total_entries, avg_progres, rata_rata_nilai, uploaded_at, approved_at'
        )
        .eq('tahun', tahunNum)
        .neq('status', 'superseded')
        .order('id', { ascending: true })
        .range(from, to)
    );

    const periodUploads = yearUploads.filter((u) => monthNumbers.includes(u.bulan));

    // ── 5. Pegawai aktif (anggota + ketua tim) ─────────────
    const activeEmployees = await fetchAllRows<{ id: string }>((from, to) =>
      admin
        .from('users')
        .select('id')
        .in('role', ['anggota', 'ketua_tim'])
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(from, to)
    );

    // ── 6. Ringkasan periode ───────────────────────────────
    const jumlahUpload = periodUploads.length;
    const jumlahApproved = periodUploads.filter((u) => u.status === 'approved').length;
    const progresValues = periodUploads.map((u) => Number(u.avg_progres) || 0);
    // rata_rata_nilai berdefault 0 di DB saat belum ada nilai, sehingga
    // hanya nilai > 0 yang dianggap sudah dinilai (nilai asli 0 tidak mungkin).
    const nilaiValues = periodUploads
      .map((u) => Number(u.rata_rata_nilai) || 0)
      .filter((v) => v > 0);
    const rataRataNilai = mean(nilaiValues);
    const rataRataProgres = mean(progresValues);

    const ringkasan: AnalyticsRingkasan = {
      totalPegawaiAktif: activeEmployees.length,
      jumlahUpload,
      jumlahPegawaiMelapor: new Set(periodUploads.map((u) => u.user_id)).size,
      jumlahApproved,
      persenApproved: jumlahUpload > 0 ? round1((jumlahApproved / jumlahUpload) * 100) : 0,
      rataRataProgres: rataRataProgres === null ? 0 : round1(rataRataProgres),
      rataRataNilai: rataRataNilai === null ? null : round1(rataRataNilai),
    };

    // ── 7. Distribusi status periode terpilih (7 status) ───
    const distribusiStatus: AnalyticsDistribusiStatus[] = STATUS_ORDER.map((status) => ({
      status,
      label: STATUS_LABELS[status] ?? status,
      jumlah: periodUploads.filter((u) => u.status === status).length,
    }));

    // ── 8. Tren 12 bulan pada tahun terpilih ───────────────
    const tren: AnalyticsTrenBulan[] = BULAN_SINGKAT.map((label, index) => {
      const bulanKe = index + 1;
      const uploadsBulan = yearUploads.filter((u) => u.bulan === bulanKe);
      const approvedBulan = uploadsBulan.filter((u) => u.status === 'approved').length;
      const nilaiBulan = uploadsBulan
        .map((u) => Number(u.rata_rata_nilai) || 0)
        .filter((v) => v > 0);
      const progresBulan = uploadsBulan.map((u) => Number(u.avg_progres) || 0);
      const avgNilai = mean(nilaiBulan);
      const avgProgres = mean(progresBulan);

      return {
        bulan: bulanKe,
        label,
        jumlahUpload: uploadsBulan.length,
        jumlahApproved: approvedBulan,
        persenApproved: uploadsBulan.length > 0 ? round1((approvedBulan / uploadsBulan.length) * 100) : 0,
        rataRataProgres: avgProgres === null ? 0 : round1(avgProgres),
        rataRataNilai: avgNilai === null ? null : round1(avgNilai),
      };
    });

    // ── 9. Beban & tunggakan per ketua tim ─────────────────
    const ketuaUsers = await fetchAllRows<KetuaTimUserRow>((from, to) =>
      admin
        .from('users')
        .select('id, full_name, nip')
        .eq('role', 'ketua_tim')
        .order('full_name', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)
    );

    const mappings = await fetchAllRows<MappingRow>((from, to) =>
      admin
        .from('rk_ketua_tim_mapping')
        .select('id, rencana_kinerja, ketua_tim_id, tim_kerja, tahun, is_active')
        .order('id', { ascending: true })
        .range(from, to)
    );

    // Entri belum dinilai hanya dihitung pada upload yang sudah dikirim
    // (submitted/scored/revision_required) — draft belum relevan dinilai.
    const scoringUploads = periodUploads.filter((u) =>
      STATUS_PENILAIAN_AKTIF.includes(u.status)
    );
    const scoringUploadIds = scoringUploads.map((u) => u.id);

    const pendingEntries: EntryRow[] = [];
    const CHUNK_SIZE = 200; // jaga panjang URL filter .in()
    for (let i = 0; i < scoringUploadIds.length; i += CHUNK_SIZE) {
      const chunk = scoringUploadIds.slice(i, i + CHUNK_SIZE);
      const rows = await fetchAllRows<EntryRow>((from, to) =>
        admin
          .from('ckp_entries')
          .select('id, upload_id, rencana_kinerja, rk_ketua_tim_id, nilai')
          .in('upload_id', chunk)
          .is('nilai', null)
          .order('id', { ascending: true })
          .range(from, to)
      );
      pendingEntries.push(...rows);
    }

    const mappingById = new Map<string, MappingRow>();
    for (const m of mappings) mappingById.set(m.id, m);

    // Fallback data lama: entri tanpa rk_ketua_tim_id dicocokkan lewat nama
    // rencana_kinerja. Utamakan mapping aktif pada tahun terpilih.
    const mappingByName = new Map<string, { row: MappingRow; score: number }>();
    for (const m of mappings) {
      if (!m.rencana_kinerja || !m.ketua_tim_id) continue;
      const score = (m.is_active ? 2 : 0) + (m.tahun === tahunNum ? 1 : 0);
      const existing = mappingByName.get(m.rencana_kinerja);
      if (!existing || score > existing.score) {
        mappingByName.set(m.rencana_kinerja, { row: m, score });
      }
    }

    const ketuaIdSet = new Set(ketuaUsers.map((k) => k.id));
    const aggrByKetua = new Map<string, { entriBelumDinilai: number; uploads: Set<string> }>();

    for (const entry of pendingEntries) {
      const mapping = entry.rk_ketua_tim_id
        ? mappingById.get(entry.rk_ketua_tim_id)
        : mappingByName.get(entry.rencana_kinerja ?? '')?.row;
      const ketuaId = mapping?.ketua_tim_id;
      if (!ketuaId || !ketuaIdSet.has(ketuaId)) continue;

      let aggr = aggrByKetua.get(ketuaId);
      if (!aggr) {
        aggr = { entriBelumDinilai: 0, uploads: new Set<string>() };
        aggrByKetua.set(ketuaId, aggr);
      }
      aggr.entriBelumDinilai += 1;
      aggr.uploads.add(entry.upload_id);
    }

    const perKetuaTim: AnalyticsKetuaTimRow[] = ketuaUsers
      .map((ketua) => {
        const aggr = aggrByKetua.get(ketua.id);
        const jumlahRk = mappings.filter(
          (m) => m.ketua_tim_id === ketua.id && m.tahun === tahunNum && m.is_active === true
        ).length;

        return {
          ketuaTimId: ketua.id,
          nama: ketua.full_name || 'Tanpa Nama',
          nip: ketua.nip,
          jumlahRk,
          entriBelumDinilai: aggr?.entriBelumDinilai ?? 0,
          uploadMenunggu: aggr?.uploads.size ?? 0,
        };
      })
      .sort(
        (a, b) =>
          b.entriBelumDinilai - a.entriBelumDinilai ||
          b.jumlahRk - a.jumlahRk ||
          a.nama.localeCompare(b.nama)
      );

    // ── 10. SLA sederhana (uploaded_at → approved_at) ──────
    const approvedYear = yearUploads.filter((u) => u.status === 'approved');
    const slaDays = approvedYear
      .filter((u) => u.approved_at && u.uploaded_at)
      .map((u) => {
        const start = new Date(u.uploaded_at as string).getTime();
        const end = new Date(u.approved_at as string).getTime();
        if (!Number.isFinite(start) || !Number.isFinite(end)) return NaN;
        return Math.max(0, (end - start) / 86_400_000);
      })
      .filter((days) => Number.isFinite(days));

    const rataRataHari = mean(slaDays);
    const sla: AnalyticsSla = {
      rataRataHari: rataRataHari === null ? null : round1(rataRataHari),
      jumlahApproved: approvedYear.length,
      jumlahAdaData: slaDays.length,
    };

    return {
      success: true,
      data: {
        bulan,
        tahun: tahunNum,
        ringkasan,
        tren,
        distribusiStatus,
        perKetuaTim,
        sla,
      },
      error: null,
    };
  } catch (err: unknown) {
    console.error('getAnalyticsOverviewAction Error:', err);
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data analitik.';
    return { success: false, data: null, error: message };
  }
}
