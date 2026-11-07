import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Download,
  FilePlus2,
  Lightbulb,
  Puzzle,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { SectionHeading } from './_guide';

/** Versi extension yang dibagikan dari /download/CKP-Companion.zip. */
export const COMPANION_VERSION = '0.5.0';

type Step = { title: string; detail: ReactNode };

// Kelas ditulis utuh agar ikut dibangun Tailwind (tidak bisa dirakit dinamis).
const KOLOM: Record<number, string> = {
  4: 'sm:grid-cols-2 xl:grid-cols-4',
  5: 'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5',
};

function Steps({ steps, compact }: { steps: Step[]; compact?: boolean }) {
  return (
    <ol className={cn('grid gap-3', compact ? 'sm:grid-cols-2' : KOLOM[steps.length] ?? 'sm:grid-cols-2')}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex gap-3 rounded-2xl border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
        >
          <span
            className="grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-extrabold"
            style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {step.title}
            </p>
            <div className="mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {step.detail}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Tip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="flex gap-3 rounded-2xl border px-4 py-3.5"
      style={{ borderColor: 'var(--border)', background: 'var(--sand-subtle)' }}
    >
      <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} aria-hidden="true" />
      <div className="min-w-0 text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

function Kode({ children }: { children: ReactNode }) {
  return (
    <code
      className="rounded-md px-1.5 py-0.5 font-mono text-[11px]"
      style={{ background: 'var(--sand-subtle)', color: 'var(--text-primary)' }}
    >
      {children}
    </code>
  );
}

export function BuatCkpGuide() {
  return (
    <section id="buat-ckp" className="scroll-mt-28 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeading
          eyebrow="Langkah 1 · tiap bulan"
          title="Susun dan submit CKP di SIKAP"
          description="Unggah foto bukti dukung, periksa draft yang tersusun otomatis, lalu submit. Tidak perlu memasang aplikasi apa pun."
        />
        <Link href="/pegawai/buat-ckp" className={buttonVariants({ variant: 'default', size: 'default' })}>
          <FilePlus2 size={16} /> Buka Buat CKP
        </Link>
      </div>

      <Steps
        steps={[
          {
            title: 'Buka menu Buat CKP',
            detail: 'Ada di sidebar kiri. Periode CKP yang sedang berjalan terpilih otomatis; ganti di kanan atas bila perlu.',
          },
          {
            title: 'Hubungkan Google Drive',
            detail: (
              <>
                Pakai akun Google <strong>pribadi</strong>. Foto disimpan di Drive Anda, folder{' '}
                <Kode>CKP SIKAP/2026-11 November</Kode>.
              </>
            ),
          },
          {
            title: 'Unggah bukti dukung',
            detail: 'Pilih ZIP, satu folder, atau beberapa foto sekaligus. Foto dikompres otomatis (kualitas Standar) lalu masuk ke draft.',
          },
          {
            title: 'Periksa draft',
            detail: (
              <>
                Cek tanggal, kegiatan, dan Rencana Kinerja tiap baris. Buka filter <strong>Perlu dicek</strong> untuk baris
                yang RK atau tanggalnya belum yakin.
              </>
            ),
          },
          {
            title: 'Submit ke SIKAP',
            detail: 'Tombol aktif setelah semua baris valid. CKP langsung masuk antrean penilaian ketua tim.',
          },
        ]}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Tip title="Beri nama file seperti ini agar terbaca otomatis">
          <Kode>21 Oktober_Melakukan pelayanan PST.jpg</Kode> atau <Kode>20-27 Oktober_Pelatihan PES.pdf</Kode>. Tanggal di
          depan, garis bawah, lalu nama kegiatan. Singkatan seperti PST dikembangkan otomatis.
        </Tip>
        <Tip title="Biar RK terpilih otomatis">
          Buka <strong>Pengaturan</strong> di halaman Buat CKP → <strong>Kata kunci RK</strong>. Contoh: kata kunci{' '}
          <Kode>SE</Kode> → Sub-RK Sensus Ekonomi. Draft tersimpan otomatis, jadi bisa dilanjutkan dari HP atau laptop lain.
        </Tip>
      </div>
    </section>
  );
}

export function CompanionGuide() {
  return (
    <section id="companion" className="scroll-mt-28 space-y-4">
      <SectionHeading
        eyebrow="Langkah 2 · cukup sekali"
        title="Pasang CKP Companion di Chrome"
        description="Extension yang mengisi kegiatan CKP ke KipApp secara otomatis, langsung dari data SIKAP."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <article className="activity-card flex flex-col p-5 sm:p-6" style={{ borderColor: 'var(--primary-ring)', transform: 'none' }}>
          <div className="flex items-center gap-3">
            <span
              className="grid size-11 shrink-0 place-items-center rounded-2xl"
              style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
            >
              <Puzzle size={20} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-tertiary)' }}>
                Extension Chrome
              </p>
              <h3 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                CKP Companion v{COMPANION_VERSION}
              </h3>
            </div>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Ambil CKP dari SIKAP, lalu isi dan simpan semua kegiatan di KipApp dengan satu tombol.
          </p>
          <a
            href="/download/CKP-Companion.zip"
            download={`CKP-Companion-${COMPANION_VERSION}.zip`}
            className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'mt-5 w-full')}
          >
            <Download size={16} /> Unduh CKP Companion
          </a>
          <p className="mt-2 text-center text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            ZIP ± 360 KB · Google Chrome
          </p>
        </article>

        <Steps
          compact
          steps={[
            {
              title: 'Ekstrak ZIP',
              detail: (
                <>
                  Klik kanan file ZIP → <strong>Extract All</strong>. Simpan foldernya di tempat tetap, misalnya{' '}
                  <Kode>Documents\ckp-companion</Kode>. Jangan dihapus setelah dipasang.
                </>
              ),
            },
            {
              title: 'Buka halaman extension',
              detail: (
                <>
                  Ketik <Kode>chrome://extensions</Kode> di address bar, lalu aktifkan <strong>Developer mode</strong> di
                  kanan atas.
                </>
              ),
            },
            {
              title: 'Load unpacked',
              detail: (
                <>
                  Klik <strong>Load unpacked</strong> → pilih folder <Kode>ckp-companion</Kode> (yang berisi{' '}
                  <Kode>manifest.json</Kode>).
                </>
              ),
            },
            {
              title: 'Sematkan ikonnya',
              detail: 'Klik ikon puzzle di toolbar Chrome → pin CKP Companion agar mudah dibuka.',
            },
          ]}
        />
      </div>

      <Tip title="Memperbarui ke versi baru">
        Unduh ZIP terbaru, timpa isi folder <Kode>ckp-companion</Kode> yang lama, lalu klik <strong>Reload</strong> pada kartu
        CKP Companion di <Kode>chrome://extensions</Kode>. Sambungan SIKAP dan progres pengisian tetap tersimpan.
      </Tip>
    </section>
  );
}

export function KipappGuide() {
  return (
    <section id="kipapp" className="scroll-mt-28 space-y-4">
      <SectionHeading
        eyebrow="Langkah 3 · tiap bulan"
        title="Isi KipApp otomatis dari SIKAP"
        description="Setelah CKP tersubmit di SIKAP, kegiatannya bisa langsung diisi ke KipApp tanpa mengetik ulang."
      />

      <Steps
        steps={[
          {
            title: 'Hubungkan SIKAP (sekali)',
            detail: (
              <>
                Klik ikon CKP Companion → <strong>Hubungkan SIKAP</strong>. Di tab SIKAP yang terbuka, klik{' '}
                <strong>Setujui &amp; hubungkan</strong>.
              </>
            ),
          },
          {
            title: 'Ambil kegiatan',
            detail: (
              <>
                Pilih <strong>CKP bulan</strong> yang mau diisi, lalu klik <strong>Ambil kegiatan</strong>. Daftar kegiatan
                muncul di panel.
              </>
            ),
          },
          {
            title: 'Buka tabel Pelaksanaan Kinerja',
            detail: (
              <>
                Login ke <Kode>kipapp.bps.go.id</Kode> lalu buka tabel <strong>Pelaksanaan Kinerja</strong> bulan yang sama.
              </>
            ),
          },
          {
            title: 'Isi & simpan semua',
            detail: (
              <>
                Klik <strong>Isi &amp; simpan semua kegiatan</strong>. Biarkan tab KipApp tetap terbuka sampai selesai.
              </>
            ),
          },
        ]}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Tip title="Kalau proses berhenti di satu kegiatan">
          Periksa form di KipApp. Bila kegiatan itu sudah tersimpan, klik <strong>Sudah disimpan · lanjut</strong> di panel.
          Bila belum, lengkapi lalu simpan, kemudian lanjutkan.
        </Tip>
        <Tip title="Mengambil bulan yang sama lagi">
          Bila sebagian kegiatan sudah tersimpan, panel menawarkan <strong>lanjutkan progres</strong> agar tidak ada
          kegiatan yang tersimpan dua kali di KipApp.
        </Tip>
      </div>
    </section>
  );
}

const faqs: Array<{ q: string; a: ReactNode }> = [
  {
    q: 'Muncul “Akses diblokir: SIKAP belum menyelesaikan proses verifikasi Google”.',
    a: 'Akun Google Anda belum didaftarkan sebagai pengguna uji coba. Hubungi admin SIKAP dan sebutkan email Google pribadi Anda.',
  },
  {
    q: 'Foto bukti dukung saya disimpan di mana?',
    a: (
      <>
        Di Google Drive Anda sendiri, folder <Kode>CKP SIKAP/&lt;tahun&gt;-&lt;bulan&gt;</Kode>. File bisa dibuka siapa
        saja yang punya link supaya penilai bisa melihatnya. SIKAP hanya menyimpan link-nya.
      </>
    ),
  },
  {
    q: 'Login Google habis di tengah unggah.',
    a: 'Klik Hubungkan ulang di kartu unggah, lalu Ulangi yang gagal. File yang sudah masuk draft tidak diunggah ulang.',
  },
  {
    q: 'Rencana Kinerja yang saya cari tidak ada di daftar.',
    a: 'Daftar berisi Sub-RK milik Anda di SIKAP. Tambahkan lewat menu Rencana Kinerja atau minta ketua tim. Nama kegiatan dari CKP lama ada di bagian “pilihan lain” paling bawah daftar.',
  },
  {
    q: 'Tanggal atau kegiatan tidak terbaca dari nama file.',
    a: 'Baris itu ditandai Perlu dicek. Isi tanggal dan kegiatannya langsung di tabel draft. Untuk bulan berikutnya, pakai format nama file di Langkah 1.',
  },
  {
    q: 'Saya salah submit.',
    a: 'Buat lagi lewat Buat CKP lalu submit. SIKAP menyimpannya sebagai versi baru dan versi lama diarsipkan. CKP yang sudah disetujui pimpinan terkunci.',
  },
  {
    q: 'Apakah CKP App lama masih bisa dipakai?',
    a: 'Masih, selama masa transisi. Panduannya ada di bagian “Cara lama” di bawah. Untuk pegawai baru, gunakan Buat CKP dan CKP Companion.',
  },
];

export function PanduanFaq() {
  return (
    <section id="faq" className="scroll-mt-28 space-y-4">
      <SectionHeading eyebrow="Bantuan" title="Pertanyaan umum" />
      <div className="space-y-2">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
          >
            <summary
              className="flex cursor-pointer list-none items-center gap-3 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="min-w-0 flex-1">{item.q}</span>
              <ChevronDown
                size={16}
                className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: 'var(--text-tertiary)' }}
                aria-hidden="true"
              />
            </summary>
            <div className="mt-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Alur bulanan ringkas untuk hero halaman. */
export const alurBulanan = [
  { icon: FilePlus2, title: 'Buat CKP', detail: 'unggah foto, periksa, submit' },
  { icon: Puzzle, title: 'CKP Companion', detail: 'pasang sekali di Chrome' },
  { icon: Send, title: 'Isi KipApp', detail: 'ambil dari SIKAP, satu klik' },
];
