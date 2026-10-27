import type { ReactNode } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Download,
  ExternalLink,
  FileText,
  HardDriveDownload,
  Package,
  Puzzle,
  RefreshCw,
  Send,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  VisualConnect,
  VisualDrive,
  VisualFolder,
  VisualNodeJs,
  VisualSend,
} from './_visuals';

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <p
        className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
        style={{ color: 'var(--primary)' }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-1.5 text-[21px] font-bold leading-tight sm:text-[24px]"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-2 text-[13px] leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function DownloadCard({
  langkah,
  icon: Icon,
  badge,
  title,
  description,
  meta,
  href,
  action,
  external,
  primary,
}: {
  langkah: string;
  icon: typeof Download;
  badge: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  action: string;
  external?: boolean;
  primary?: boolean;
}) {
  return (
    <article
      className="activity-card flex h-full flex-col p-5 sm:p-6"
      style={primary ? { borderColor: 'var(--primary-ring)' } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-2xl"
            style={{
              background: primary ? 'var(--primary)' : 'var(--primary-soft)',
              color: primary ? 'var(--on-primary)' : 'var(--primary)',
            }}
          >
            <Icon size={20} />
          </span>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Unduhan {langkah}
            </p>
            <h3
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
        >
          {badge}
        </span>
      </div>

      <p
        className="mt-3 text-[12.5px] leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>

      <p
        className="mt-3 flex items-center gap-1.5 text-[11px]"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <HardDriveDownload size={13} />
        {meta}
      </p>

      <div className="mt-5 pt-1">
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : { download: 'CKP-App.zip' })}
          className={cn(
            buttonVariants({ variant: primary ? 'default' : 'outline', size: 'default' }),
            'w-full sm:w-auto'
          )}
        >
          {primary ? <Download size={16} /> : <ExternalLink size={15} />}
          {action}
        </a>
      </div>
    </article>
  );
}

export function DownloadSection() {
  return (
    <section id="unduh" className="scroll-mt-28 space-y-4">
      <SectionHeading
        eyebrow="Unduhan"
        title="Hanya dua file yang perlu diunduh"
        description="Unduh Node.js lebih dulu, lalu paket CKP App. Keduanya cukup sekali; simpan folder data di dalam CKP App agar profil dan token tidak hilang saat memperbarui."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DownloadCard
          langkah="1"
          icon={HardDriveDownload}
          badge="Wajib"
          title="Node.js LTS"
          description="Mesin yang menjalankan CKP App di komputer. Pilih versi LTS, lalu Windows Installer (.msi)."
          meta="Sekali pasang · penginstal resmi nodejs.org"
          href="https://nodejs.org/en/download"
          action="Buka halaman unduh Node.js"
          external
        />
        <DownloadCard
          langkah="2"
          icon={Package}
          badge="Wajib"
          title="CKP App"
          description="Satu paket berisi CKP App, rclone portable, extension CKP Companion, dan panduan BACA-DULU."
          meta="±30 MB · Windows · versi 1.1.0"
          href="/download/CKP-App.zip"
          action="Unduh CKP App (.zip)"
          primary
        />
      </div>

      <div
        className="flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[12px] leading-relaxed"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--sand-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <BookOpen size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
        <p>
          <strong style={{ color: 'var(--text-primary)' }}>Tidak perlu unduh rclone atau extension lagi.</strong>{' '}
          Keduanya sudah ada di dalam paket CKP App; rclone cukup diatur sekali di langkah 3.
          Panduan teks lengkap juga tersedia di{' '}
          <code className="font-mono text-[11.5px]">BACA-DULU.txt</code> setelah ZIP diekstrak.
        </p>
      </div>
    </section>
  );
}

const steps: Array<{
  number: string;
  title: string;
  body: string;
  bullets: ReactNode;
  note: ReactNode;
  visual: ReactNode;
}> = [
  {
    number: '1',
    title: 'Pasang Node.js',
    body: 'Pasang sekali di komputer yang akan dipakai untuk menyusun CKP.',
    bullets: (
      <>
        <li>Buka halaman unduh Node.js, lalu pilih kartu <strong>LTS</strong>.</li>
        <li>Klik <strong>Windows Installer (.msi)</strong> dan jalankan file unduhannya.</li>
        <li>Klik <strong>Next</strong> sampai selesai. Pastikan opsi <strong>Add to PATH</strong> tercentang.</li>
      </>
    ),
    note: (
      <>
        Sudah pernah memasang Node.js? Cek lewat <strong>Command Prompt</strong> dengan perintah{' '}
        <code className="font-mono text-[11.5px]">node -v</code>. Kalau muncul nomor versi, lewati langkah ini.
      </>
    ),
    visual: <VisualNodeJs />,
  },
  {
    number: '2',
    title: 'Ekstrak & jalankan CKP App',
    body: 'Setelah ZIP diunduh, simpan CKP App di folder yang mudah diingat.',
    bullets: (
      <>
        <li>Klik kanan file ZIP → <strong>Extract All</strong> → pilih folder, misalnya <code className="font-mono text-[11.5px]">D:\CKP-App</code>.</li>
        <li>Buka folder hasil ekstrak, lalu <strong>double-click Jalankan CKP.bat</strong>.</li>
        <li>Tunggu proses pertama (butuh internet). Browser akan terbuka otomatis di <code className="font-mono text-[11.5px]">localhost:3230</code>.</li>
      </>
    ),
    note: (
      <>
        Jangan menjalankan file dari dalam ZIP. Windows akan membuka salinan sementara dan data CKP App bisa hilang.
        Biarkan jendela hitam tetap terbuka selama CKP App dipakai. Setelah muncul, jangan hapus folder{' '}
        <code className="font-mono text-[11.5px]">data</code> — isinya profil, draft, dan token Anda.
      </>
    ),
    visual: <VisualFolder />,
  },
  {
    number: '3',
    title: 'Hubungkan Google Drive',
    body: 'Sekali saja, agar foto dan dokumen bukti dukung bisa diunggah ke Drive Anda.',
    bullets: (
      <>
        <li>Buka <strong>Command Prompt</strong> di folder CKP App. Dari File Explorer, klik address bar, ketik <code className="font-mono text-[11.5px]">cmd</code>, lalu Enter.</li>
        <li>Jalankan <code className="font-mono text-[11.5px]">tools\rclone\rclone.exe config</code>. Pilih <strong>n</strong> (new remote), beri nama <strong>gdrive</strong>, pilih <strong>Google Drive</strong>, lalu ikuti login di browser.</li>
        <li>Setelah selesai, jalankan <code className="font-mono text-[11.5px]">tools\rclone\rclone.exe listremotes</code>. Hasilnya harus memuat <code className="font-mono text-[11.5px]">gdrive:</code>. Kalau sudah ada, lewati pengaturan ulang.</li>
        <li>Buka CKP App. Status <strong>rclone</strong> di sidebar harus hijau.</li>
      </>
    ),
    note: (
      <>
        Setiap pegawai memakai akun Google Drive-nya sendiri. Jangan memakai akun orang lain.
        Foto tetap di Drive Anda; SIKAP hanya menerima file Excel. Kalau status rclone belum hijau,
        tutup CKP App lalu jalankan <strong>Jalankan CKP.bat</strong> lagi.
      </>
    ),
    visual: <VisualDrive />,
  },
  {
    number: '4',
    title: 'Hubungkan ke SIKAP',
    body: 'Sekali klik, tanpa menyalin token dan tanpa menyamakan RK secara manual.',
    bullets: (
      <>
        <li>Di CKP App, buka <strong>Profil &amp; rekan</strong> → pastikan profil Anda sudah dibuat/dipilih (nama &amp; NIP). Kalau belum, klik <strong>Tambah pegawai</strong>.</li>
        <li>Di kartu <strong>Integrasi SIKAP</strong>, isi <strong>Alamat SIKAP</strong> (cukup sekali), lalu klik <strong>Hubungkan SIKAP</strong>.</li>
        <li>Tab SIKAP terbuka → login jika diminta → klik <strong>Setujui &amp; hubungkan CKP App</strong>.</li>
        <li>Kembali ke CKP App. Status berubah <strong>terhubung</strong> dan daftar RK ikut tersinkron.</li>
      </>
    ),
    note: (
      <>
        <p>
          Baru pertama kali? Di <strong>Profil &amp; rekan</strong>, klik{' '}
          <strong>Impor semua pegawai</strong> di kartu <strong>Dataset RK kantor</strong> lalu pilih nama Anda
          di pemilih profil kanan atas. Atau klik <strong>Tambah pegawai</strong> → isi nama/NIP →{' '}
          <strong>Buat profil &amp; pakai</strong>.
        </p>
        <p className="mt-1.5">
          Alamat SIKAP bisa disalin dari bagian <a href="#hubungkan" className="font-semibold underline underline-offset-2" style={{ color: 'var(--primary)' }}>Hubungkan CKP App</a> di bawah. Kalau RK belum muncul, klik <strong>Hubungkan ulang</strong> di kartu Integrasi SIKAP.
        </p>
      </>
    ),
    // Visual langkah 4 diisi oleh StepGuide agar memakai origin SIKAP yang aktual.
    visual: null,
  },
  {
    number: '5',
    title: 'Kirim CKP ke SIKAP',
    body: 'Mulai sekarang, hasil CKP bisa masuk ke SIKAP tanpa download-upload Excel.',
    bullets: (
      <>
        <li>Pastikan draft sudah lengkap: tanggal, kegiatan, dan RK sudah benar.</li>
        <li>Buka halaman <strong>Export</strong> di CKP App → klik <strong>Kirim ke SIKAP</strong>.</li>
        <li>SIKAP membuat versi baru dan menampilkan statusnya di dashboard.</li>
        <li>Foto bukti dukung tetap di Google Drive. Yang dikirim ke SIKAP hanya file Excel.</li>
      </>
    ),
    note: (
      <>
        Aman diklik ulang saat jaringan terputus. SIKAP mengenali kiriman yang sama, jadi tidak membuat data ganda.
      </>
    ),
    visual: <VisualSend />,
  },
];

export function StepGuide({ origin }: { origin: string }) {
  const renderedSteps = steps.map((step) =>
    step.number === '4'
      ? { ...step, visual: <VisualConnect origin={origin || 'https://sikap.bps.go.id'} /> }
      : step,
  );

  return (
    <section id="panduan" className="scroll-mt-28 space-y-4">
      <SectionHeading
        eyebrow="Panduan"
        title="Lima langkah, sekitar tujuh menit"
        description="Ikuti dari atas ke bawah. Bagian yang bergambar adalah ilustrasi, jadi tampilan di komputer Anda bisa sedikit berbeda."
      />

      <div className="space-y-5">
        {renderedSteps.map((step, index) => (
          <article
            key={step.number}
            className="activity-card overflow-hidden"
            style={{ transform: 'none' }}
          >
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)]">
              <div className="p-5 sm:p-7">
                <div className="flex items-start gap-3.5">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-2xl text-[15px] font-extrabold"
                    style={{
                      background: index === 0 ? 'var(--primary)' : 'var(--primary-soft)',
                      color: index === 0 ? 'var(--on-primary)' : 'var(--primary)',
                    }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Langkah {step.number}
                    </p>
                    <h3
                      className="mt-0.5 text-[17px] font-bold leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-1.5 text-[12.5px] leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5 pl-1">
                  {step.bullets}
                </ul>

                <div
                  className="mt-4 rounded-xl px-3.5 py-3 text-[11.5px] leading-relaxed"
                  style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
                >
                  {step.note}
                </div>
              </div>

              <div
                className="flex items-center justify-center border-t p-5 lg:border-l lg:border-t-0"
                style={{ background: 'var(--sand-subtle)', borderColor: 'var(--border)' }}
              >
                {step.visual}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const dailyFlow = [
  { icon: UploadCloud, title: 'Upload ZIP', detail: 'Foto & dokumen bukti dukung' },
  { icon: RefreshCw, title: 'Sinkron Drive', detail: 'Unggah bukti dukung ke Drive' },
  { icon: FileText, title: 'Koreksi draft', detail: 'Tanggal, kegiatan, RK' },
  { icon: Send, title: 'Kirim ke SIKAP', detail: 'Satu klik dari Export' },
];

export function DailyFlow() {
  return (
    <section
      className="activity-card overflow-hidden p-5 sm:p-6"
      aria-labelledby="alur-harian"
      style={{ transform: 'none' }}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--primary)' }}
          >
            Setelah terhubung
          </p>
          <h2
            id="alur-harian"
            className="mt-1 text-[17px] font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Alur kerja harian di CKP App
          </h2>
        </div>
        <p className="text-[11.5px]" style={{ color: 'var(--text-tertiary)' }}>
          Empat langkah yang sama setiap bulan.
        </p>
      </div>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dailyFlow.map((item, index) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="relative rounded-2xl border p-3.5"
              style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-xl"
                  style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}
                >
                  <Icon size={15} />
                </span>
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  0{index + 1}
                </span>
                {index < dailyFlow.length - 1 && (
                  <ArrowRight
                    size={13}
                    className="ml-auto hidden xl:block"
                    style={{ color: 'var(--border-hover)' }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <p
                className="mt-2 text-[12.5px] font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.title}
              </p>
              <p className="mt-0.5 text-[10.5px]" style={{ color: 'var(--text-secondary)' }}>
                {item.detail}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ExtensionGuide() {
  const langkah = [
    { title: 'Buka halaman extension', detail: 'Di Chrome ketik chrome://extensions; di Edge ketik edge://extensions.' },
    { title: 'Aktifkan Developer mode', detail: 'Sakelar di kanan atas halaman extension.' },
    { title: 'Klik Load unpacked', detail: 'Pilih folder chrome-extension\\ckp-companion di dalam paket CKP App.' },
  ];

  return (
    <details
      className="group activity-card overflow-hidden p-0"
      style={{ transform: 'none' }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary-ring)] sm:px-6">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl"
          style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
        >
          <Puzzle size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--text-tertiary)' }}>
            Opsional
          </p>
          <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Pasang extension CKP Companion untuk mengisi KipApp
          </p>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform duration-200 group-open:rotate-180"
          style={{ color: 'var(--text-tertiary)' }}
          aria-hidden="true"
        />
      </summary>
      <div className="border-t px-5 pb-5 pt-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Extension membantu mengisi kegiatan ke KipApp. Tanpa extension, CKP App tetap bisa
          menyusun draft, export Excel, dan mengirim CKP ke SIKAP.
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {langkah.map((item, index) => (
            <div
              key={item.title}
              className="rounded-xl border p-3"
              style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
            >
              <span
                className="grid size-6 place-items-center rounded-full text-[10px] font-extrabold"
                style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <p className="mt-2 text-[11.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10.5px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          Folder extension sudah ada di dalam ZIP CKP App. Setelah dipasang, buka{' '}
          <code className="font-mono text-[10px]">kipapp.bps.go.id</code>. Dari CKP App, buka{' '}
          <strong style={{ color: 'var(--text-secondary)' }}>Export → Kirim ke KipApp</strong> agar profil muncul
          di panel extension, lalu pilih profil pegawai di sana.
        </p>
      </div>
    </details>
  );
}

const faqs = [
  {
    q: 'Apakah Node.js wajib dipasang?',
    a: 'Ya, sekali saja. CKP App berjalan di komputer melalui Node.js. Setelah terpasang, Anda tidak perlu memasangnya lagi saat memakai CKP App setiap hari.',
  },
  {
    q: 'Kenapa perlu menghubungkan Google Drive?',
    a: 'Foto dan dokumen bukti dukung disimpan di Google Drive Anda. CKP App memakai rclone untuk mengunggahnya. SIKAP hanya menerima file Excel, jadi Drive tetap menjadi tempat penyimpanan bukti dukung.',
  },
  {
    q: 'Windows menampilkan peringatan saat membuka Jalankan CKP.bat.',
    a: 'Peringatan itu muncul karena file .bat berasal dari folder unduhan. Pilih More info → Run anyway (Informasi selengkapnya → Jalankan saja). Pastikan paket diunduh dari halaman SIKAP ini, bukan dari sumber yang tidak dikenal.',
  },
  {
    q: 'CKP App tidak terbuka atau localhost:3230 error.',
    a: 'Pastikan Node.js sudah terpasang, lalu jalankan ulang Jalankan CKP.bat. Jangan tutup jendela hitam selama CKP App dipakai. Pastikan port 3230 tidak dipakai aplikasi lain. Untuk memastikan Node.js terbaca, buka Command Prompt dan ketik node -v.',
  },
  {
    q: 'Muncul pesan “rclone tidak ditemukan”.',
    a: 'Paket dari halaman ini sudah berisi rclone di folder tools\\rclone. Buka Command Prompt di folder CKP App, lalu jalankan tools\\rclone\\rclone.exe version. Kalau versi muncul, lanjutkan ke langkah 3 untuk mengatur remote gdrive. Kalau file tidak ada, unduh ulang paket CKP App.',
  },
  {
    q: 'Tab SIKAP tidak terbuka saat klik Hubungkan SIKAP.',
    a: 'Izinkan pop-up untuk alamat CKP App di browser, lalu klik Hubungkan SIKAP lagi. Di CKP App juga tersedia tombol Buka tab SIKAP yang bisa diklik manual.',
  },
  {
    q: 'Apa saja yang dikirim ke SIKAP? Apakah aman?',
    a: 'Hanya file Excel CKP. Foto dan dokumen bukti dukung tetap di Google Drive. Token integrasi mewakili akun Anda, tidak bisa dilihat ulang, dan bisa dicabut kapan saja dari bagian Perangkat terhubung.',
  },
  {
    q: 'Bagaimana kalau saya ganti laptop?',
    a: 'Unduh paket CKP App di laptop baru, lalu hubungkan ulang lewat Integrasi SIKAP. Setelah itu cabut token perangkat lama di bagian Perangkat terhubung agar tidak aktif lagi. Jangan menyalin folder data yang berisi token ke laptop baru.',
  },
  {
    q: 'Kalau belum ingin menghubungkan CKP App, bisa upload manual?',
    a: 'Bisa. Buka halaman Upload CKP lalu unggah file Excel seperti biasa. Integrasi CKP App hanya menghilangkan langkah download-upload Excel manual, bukan mengganti cara upload yang sudah ada.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-28 space-y-4">
      <SectionHeading
        eyebrow="Pertanyaan umum"
        title="Kalau ada yang tidak berjalan"
        description="Masalah yang paling sering muncul saat memasang CKP App pertama kali."
      />

      <div className="space-y-2.5">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border px-4 py-3.5 transition-colors sm:px-5"
            style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]">
              <CircleHelp size={16} className="shrink-0" style={{ color: 'var(--primary)' }} />
              <span className="min-w-0 flex-1" style={{ color: 'var(--text-primary)' }}>
                {item.q}
              </span>
              <ChevronDown
                size={16}
                className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: 'var(--text-tertiary)' }}
                aria-hidden="true"
              />
            </summary>
            <p
              className="mt-2.5 pl-7 text-[12.5px] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div
        className="flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--primary-ring)', background: 'var(--primary-soft)' }}
      >
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
          <div>
            <p className="text-[12.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Panduan ini juga tersedia offline
            </p>
            <p className="mt-0.5 text-[11.5px]" style={{ color: 'var(--text-secondary)' }}>
              Setelah ZIP diekstrak, buka <code className="font-mono text-[11px]">BACA-DULU.txt</code> di folder CKP App.
            </p>
          </div>
        </div>
        <a
          href="#unduh"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')}
        >
          <Download size={14} /> Kembali ke unduhan
        </a>
      </div>
    </section>
  );
}
