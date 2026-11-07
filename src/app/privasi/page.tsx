import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi SIKAP BPS Kabupaten Belitung, termasuk penggunaan Google Drive pada fitur Buat CKP.',
};

const DIPERBARUI = '8 November 2026';

function Bagian({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {judul}
      </h2>
      <div className="space-y-2 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivasiPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6" style={{ background: 'var(--page-bg, var(--sand-subtle))' }}>
      <article
        className="mx-auto max-w-3xl space-y-8 rounded-3xl border p-6 sm:p-10"
        style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
      >
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
            SIKAP · BPS Kabupaten Belitung
          </p>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Kebijakan Privasi
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Terakhir diperbarui {DIPERBARUI}
          </p>
        </header>

        <Bagian judul="Tentang SIKAP">
          <p>
            SIKAP (Sistem Informasi Rekap Capaian Kinerja Pegawai) adalah aplikasi internal BPS Kabupaten Belitung untuk
            menyusun, mengirim, menilai, dan merekap Capaian Kinerja Pegawai (CKP). Aplikasi hanya dipakai oleh pegawai
            yang memiliki akun SIKAP.
          </p>
        </Bagian>

        <Bagian judul="Data yang kami simpan">
          <ul className="list-disc space-y-1 pl-5">
            <li>Identitas akun pegawai: nama, NIP, email kantor, jabatan, dan unit kerja.</li>
            <li>Isi CKP: tanggal, kegiatan, Rencana Kinerja, capaian, nilai, dan catatan penilaian.</li>
            <li>Tautan (link) ke file bukti dukung di Google Drive, bukan isi filenya.</li>
            <li>Draft CKP dan pengaturan penyusun draft (kamus singkatan, kata kunci Rencana Kinerja).</li>
          </ul>
        </Bagian>

        <Bagian judul="Penggunaan Google Drive">
          <p>
            Fitur <strong>Buat CKP</strong> meminta izin Google dengan cakupan{' '}
            <code className="rounded bg-black/5 px-1.5 py-0.5 text-[13px]">drive.file</code>. Dengan izin ini SIKAP
            <strong> hanya dapat mengakses file dan folder yang dibuat oleh SIKAP sendiri</strong>; file lain di Google Drive
            Anda tidak dapat dilihat, diubah, atau dihapus oleh SIKAP.
          </p>
          <p>SIKAP memakai izin tersebut untuk:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>membuat folder <em>CKP SIKAP</em> dan subfolder per bulan di Google Drive Anda;</li>
            <li>mengunggah foto atau dokumen bukti dukung yang Anda pilih sendiri;</li>
            <li>
              mengatur file bukti dukung tersebut agar dapat dibuka oleh siapa saja yang memiliki tautannya, supaya ketua tim
              dan pimpinan dapat memeriksanya saat menilai CKP;
            </li>
            <li>membaca alamat email akun Google yang terhubung untuk ditampilkan kepada Anda.</li>
          </ul>
          <p>
            Foto dikompres di browser Anda sebelum diunggah dan dikirim langsung dari browser ke Google Drive. Isi file tidak
            disimpan di server SIKAP. Token akses Google hanya disimpan sementara di tab browser yang sedang terbuka dan
            tidak dikirim ke server SIKAP.
          </p>
          <p>
            Penggunaan dan pemindahan informasi yang diterima dari Google API mematuhi{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2"
              style={{ color: 'var(--primary)' }}
            >
              Kebijakan Data Pengguna Layanan Google API
            </a>
            , termasuk persyaratan Penggunaan Terbatas (Limited Use).
          </p>
        </Bagian>

        <Bagian judul="Berbagi data">
          <p>
            Data CKP hanya dapat dilihat oleh pegawai yang bersangkutan, ketua tim yang menilai, pimpinan, dan admin SIKAP
            sesuai perannya. SIKAP tidak menjual, menyewakan, atau membagikan data kepada pihak ketiga, dan tidak memakai data
            Google untuk iklan.
          </p>
        </Bagian>

        <Bagian judul="Extension CKP Companion">
          <p>
            Extension Chrome CKP Companion membaca CKP milik Anda dari SIKAP setelah Anda menyetujui sambungannya, lalu
            mengisi form kegiatan di KipApp di browser Anda. Sambungan memakai token yang dapat dicabut kapan saja di SIKAP
            → All in CKP App.
          </p>
        </Bagian>

        <Bagian judul="Mencabut akses dan menghapus data">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Cabut izin Google Drive kapan saja di{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2"
                style={{ color: 'var(--primary)' }}
              >
                myaccount.google.com/permissions
              </a>
              . File yang sudah diunggah tetap berada di Google Drive Anda dan dapat Anda hapus sendiri.
            </li>
            <li>Draft CKP dapat dihapus dari halaman Buat CKP.</li>
            <li>
              Penghapusan data CKP yang sudah disubmit mengikuti ketentuan arsip kinerja kantor; hubungi admin SIKAP BPS
              Kabupaten Belitung.
            </li>
          </ul>
        </Bagian>

        <Bagian judul="Kontak">
          <p>Pertanyaan tentang kebijakan ini dapat disampaikan kepada admin SIKAP di BPS Kabupaten Belitung.</p>
        </Bagian>

        <footer className="border-t pt-6 text-sm" style={{ borderColor: 'var(--border)' }}>
          <Link href="/login" className="underline underline-offset-2" style={{ color: 'var(--primary)' }}>
            Kembali ke SIKAP
          </Link>
        </footer>
      </article>
    </main>
  );
}
