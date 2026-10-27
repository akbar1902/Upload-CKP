import {
  ArrowDown,
  Check,
  CheckCircle2,
  FileText,
  Folder,
  HardDrive,
  Info,
  Link2,
  Lock,
  MousePointerClick,
  Send,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Ilustrasi panduan.
 *
 * Semua "tangkapan layar" di bawah digambar dengan HTML/CSS, bukan gambar
 * statis: tetap tajam di layar retina, ikut tema terang/gelap, dan tidak
 * menambah berat halaman. Teks di dalamnya sengaja diberi aria-hidden agar
 * pembaca layar hanya mendengar keterangan langkahnya, bukan isi mockup.
 */

function MockChrome({
  url,
  children,
  className,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-full max-w-[420px] overflow-hidden rounded-2xl border bg-[var(--card-bg)] shadow-[var(--shadow-card)]',
        className
      )}
      style={{ borderColor: 'var(--border)' }}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{ background: 'var(--sand-subtle)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: '#E5A28B' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#E8C87A' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#9CC0A4' }} />
        <span
          className="ml-2 flex min-w-0 flex-1 items-center gap-1 truncate rounded-md px-2 py-1 text-[9px] font-medium"
          style={{ background: 'var(--card-bg)', color: 'var(--text-tertiary)' }}
        >
          <Lock size={8} className="flex-shrink-0" />
          <span className="truncate">{url}</span>
        </span>
      </div>
      {children}
    </div>
  );
}

export function VisualNodeJs() {
  return (
    <div
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Ilustrasi halaman unduh Node.js. Pilih versi LTS, lalu Windows Installer."
    >
      <MockChrome url="nodejs.org/en/download">
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-[#5FA04E] text-[10px] font-black text-white">
              JS
            </span>
            <div>
              <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Node.js
              </p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                Download Node.js®
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-xl border-2 p-2.5"
              style={{ borderColor: 'var(--primary)', background: 'var(--primary-soft)' }}
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  LTS
                </p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[7.5px] font-bold"
                  style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
                >
                  Disarankan
                </span>
              </div>
              <p className="mt-1 text-[8px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Stabil untuk dipakai harian
              </p>
              <div
                className="mt-2 rounded-md px-2 py-1 text-[8px] font-semibold"
                style={{ background: 'var(--card-bg)', color: 'var(--primary)' }}
              >
                Windows Installer (.msi)
              </div>
            </div>
            <div
              className="rounded-xl border p-2.5 opacity-50"
              style={{ borderColor: 'var(--border)' }}
            >
              <p className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Current
              </p>
              <p className="mt-1 text-[8px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Fitur terbaru, belum tentu stabil
              </p>
              <div
                className="mt-2 rounded-md px-2 py-1 text-[8px] font-semibold"
                style={{ background: 'var(--sand-subtle)', color: 'var(--text-tertiary)' }}
              >
                Windows Installer (.msi)
              </div>
            </div>
          </div>

          <div
            className="flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-[8px] leading-relaxed"
            style={{ background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }}
          >
            <Info size={10} className="mt-0.5 flex-shrink-0" />
            <span>Centang “Add to PATH” saat memasang, lalu klik Next sampai selesai.</span>
          </div>
        </div>
      </MockChrome>
      <p
        className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold"
        style={{ color: 'var(--primary)' }}
        aria-hidden="true"
      >
        <MousePointerClick size={12} /> Pilih kartu LTS
      </p>
    </div>
  );
}

export function VisualFolder() {
  const files = [
    { name: 'chrome-extension', icon: Folder, meta: 'Folder' },
    { name: 'public', icon: Folder, meta: 'Folder' },
    { name: 'src', icon: Folder, meta: 'Folder' },
    { name: 'tools', icon: Folder, meta: 'Folder' },
    { name: 'BACA-DULU.txt', icon: FileText, meta: 'Teks' },
  ];

  return (
    <div
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Ilustrasi folder CKP App yang sudah diekstrak. Double-click Jalankan CKP.bat."
    >
      <div
        className="overflow-hidden rounded-2xl border bg-[var(--card-bg)] shadow-[var(--shadow-card)]"
        style={{ borderColor: 'var(--border)' }}
        aria-hidden="true"
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: 'var(--sand-subtle)', borderBottom: '1px solid var(--border)' }}
        >
          <Folder size={13} style={{ color: 'var(--primary)' }} />
          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            CKP-App
          </span>
          <span className="ml-auto text-[8px]" style={{ color: 'var(--text-tertiary)' }}>
            File Explorer
          </span>
        </div>

        <div className="flex">
          <div
            className="hidden w-24 flex-shrink-0 space-y-1.5 p-2 sm:block"
            style={{ background: 'var(--sand-subtle)', borderRight: '1px solid var(--border)' }}
          >
            {['Home', 'Desktop', 'Documents', 'Downloads'].map((item) => (
              <div
                key={item}
                className="rounded px-1.5 py-1 text-[7.5px]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {item}
              </div>
            ))}
            <div
              className="rounded px-1.5 py-1 text-[7.5px] font-semibold"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              CKP-App
            </div>
          </div>

          <div className="min-w-0 flex-1 p-2">
            <div
              className="mb-2 flex items-center gap-1 rounded-md border px-2 py-1 text-[8px]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
            >
              <HardDrive size={9} />
              <span className="truncate">D:\CKP-App</span>
            </div>

            <div className="space-y-0.5">
              {files.slice(0, 4).map((file) => {
                const Icon = file.icon;
                return (
                  <div key={file.name} className="flex items-center gap-2 rounded px-2 py-1">
                    <Icon size={11} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[8.5px]" style={{ color: 'var(--text-secondary)' }}>
                      {file.name}
                    </span>
                  </div>
                );
              })}

              <div
                className="flex items-center gap-2 rounded-lg border-2 px-2 py-1.5"
                style={{
                  borderColor: 'var(--primary)',
                  background: 'var(--primary-soft)',
                }}
              >
                <FileText size={12} style={{ color: 'var(--primary)' }} />
                <span className="text-[8.5px] font-bold" style={{ color: 'var(--primary)' }}>
                  Jalankan CKP.bat
                </span>
                <span
                  className="ml-auto rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                  style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
                >
                  2× klik
                </span>
              </div>

              {files.slice(4).map((file) => {
                const Icon = file.icon;
                return (
                  <div key={file.name} className="flex items-center gap-2 rounded px-2 py-1">
                    <Icon size={11} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[8.5px]" style={{ color: 'var(--text-secondary)' }}>
                      {file.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <p
        className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold"
        style={{ color: 'var(--primary)' }}
        aria-hidden="true"
      >
        <MousePointerClick size={12} /> Double-click file yang disorot
      </p>
      <p
        className="mt-1 text-center font-mono text-[9.5px]"
        style={{ color: 'var(--text-tertiary)' }}
        aria-hidden="true"
      >
        Browser terbuka di localhost:3230
      </p>
    </div>
  );
}

export function VisualDrive() {
  return (
    <div
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Ilustrasi Command Prompt untuk mengatur rclone dengan remote bernama gdrive."
    >
      <div
        className="overflow-hidden rounded-2xl border shadow-[var(--shadow-card)]"
        style={{ borderColor: '#1F322C', background: '#0E1B18' }}
        aria-hidden="true"
      >
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Terminal size={12} style={{ color: '#8FE3C0' }} />
          <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.64)' }}>
            Command Prompt — CKP-App
          </span>
        </div>
        <div className="space-y-1.5 p-4 font-mono text-[9px] leading-relaxed">
          <p style={{ color: 'rgba(255,255,255,0.50)' }}>
            D:\CKP-App&gt; <span style={{ color: '#FFFFFF' }}>tools\rclone\rclone.exe config</span>
          </p>
          <p style={{ color: '#8FE3C0' }}>n) New remote</p>
          <p style={{ color: 'rgba(255,255,255,0.76)' }}>
            name&gt; <span className="font-bold text-white">gdrive</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.76)' }}>
            Storage&gt; <span className="font-bold text-white">Google Drive</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.46)' }}>… ikuti login di browser …</p>
          <p style={{ color: 'rgba(255,255,255,0.76)' }}>
            gdrive&gt; <span className="font-bold text-white">q</span>
          </p>
          <p className="pt-1.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
            D:\CKP-App&gt; <span style={{ color: '#FFFFFF' }}>tools\rclone\rclone.exe listremotes</span>
          </p>
          <p className="font-bold" style={{ color: '#8FE3C0' }}>
            gdrive:
          </p>
        </div>
      </div>
      <p
        className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold"
        style={{ color: 'var(--primary)' }}
        aria-hidden="true"
      >
        <CheckCircle2 size={12} /> Harus muncul gdrive:
      </p>
    </div>
  );
}

export function VisualConnect({ origin }: { origin: string }) {
  return (
    <div
      className="w-full max-w-[420px] space-y-2"
      role="img"
      aria-label="Ilustrasi menghubungkan CKP App ke SIKAP: klik Hubungkan SIKAP, lalu setujui di tab SIKAP."
    >
      <div
        className="rounded-2xl border bg-[var(--card-bg)] p-3.5 shadow-[var(--shadow-card)]"
        style={{ borderColor: 'var(--border)' }}
        aria-hidden="true"
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className="flex items-center gap-1.5 text-[10px] font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            <Link2 size={11} style={{ color: 'var(--accent)' }} /> Integrasi SIKAP
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[7.5px] font-bold"
            style={{ background: 'var(--sand-subtle)', color: 'var(--text-tertiary)' }}
          >
            belum
          </span>
        </div>
        <div
          className="mt-2 truncate rounded-lg border px-2 py-1.5 font-mono text-[8px]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
        >
          {origin || 'https://sikap.bps.go.id'}
        </div>
        <div
          className="mt-2 rounded-lg px-2 py-1.5 text-center text-[9px] font-bold"
          style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          Hubungkan SIKAP
        </div>
        <p className="mt-1.5 text-center text-[7.5px]" style={{ color: 'var(--text-tertiary)' }}>
          Alamat cukup diisi sekali
        </p>
      </div>

      <div className="flex justify-center" aria-hidden="true">
        <span
          className="grid size-6 place-items-center rounded-full border bg-[var(--card-bg)]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
        >
          <ArrowDown size={11} />
        </span>
      </div>

      <div
        className="rounded-2xl border bg-[var(--card-bg)] p-3.5 shadow-[var(--shadow-card)]"
        style={{ borderColor: 'var(--border)' }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span
            className="grid size-6 place-items-center rounded-lg text-[7px] font-black"
            style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
          >
            S
          </span>
          <div>
            <p className="text-[9px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Tab SIKAP terbuka
            </p>
            <p className="text-[7.5px]" style={{ color: 'var(--text-tertiary)' }}>
              Login jika diminta
            </p>
          </div>
        </div>
        <div className="mt-2 rounded-lg px-2 py-2" style={{ background: 'var(--sand-subtle)' }}>
          <p className="text-[7.5px]" style={{ color: 'var(--text-secondary)' }}>
            Kode pairing
          </p>
          <p
            className="font-mono text-[15px] font-extrabold tracking-[0.18em]"
            style={{ color: 'var(--text-primary)' }}
          >
            K7PQ2M9X
          </p>
        </div>
        <div
          className="mt-2 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-[8.5px] font-bold"
          style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
        >
          <ShieldCheck size={10} />
          <span>Setujui &amp; hubungkan</span>
        </div>
      </div>
    </div>
  );
}

export function VisualSend() {
  return (
    <div
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Ilustrasi halaman Export CKP App dengan tombol Kirim ke SIKAP dan status terkirim."
    >
      <MockChrome url="localhost:3230">
        <div className="space-y-2.5 p-4" aria-hidden="true">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Export CKP
              </p>
              <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>
                Oktober 2026 · 12 kegiatan siap
              </p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[7.5px] font-bold"
              style={{ background: 'var(--success-soft)', color: 'var(--success-text)' }}
            >
              Siap
            </span>
          </div>

          <div className="rounded-xl border p-2.5" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <span
                className="grid size-6 place-items-center rounded-full"
                style={{ background: 'var(--success-soft)', color: 'var(--success-text)' }}
              >
                <Check size={11} />
              </span>
              <div>
                <p className="text-[9px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  Kirim ke SIKAP
                </p>
                <p className="text-[7.5px]" style={{ color: 'var(--text-secondary)' }}>
                  Excel dibuat otomatis
                </p>
              </div>
            </div>
            <div
              className="mt-2 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-bold"
              style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
            >
              <Send size={10} /> Kirim ke SIKAP
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[8px] font-semibold"
            style={{ background: 'var(--success-soft)', color: 'var(--success-text)' }}
          >
            <CheckCircle2 size={11} /> Terkirim · versi 3 · menunggu persetujuan
          </div>

          <p className="text-center text-[7.5px]" style={{ color: 'var(--text-tertiary)' }}>
            Foto tetap di Google Drive — yang dikirim hanya Excel.
          </p>
        </div>
      </MockChrome>
      <p
        className="mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold"
        style={{ color: 'var(--primary)' }}
        aria-hidden="true"
      >
        <MousePointerClick size={12} /> Selesai dalam satu klik
      </p>
    </div>
  );
}
