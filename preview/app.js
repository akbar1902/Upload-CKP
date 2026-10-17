/* ============================================================
   SIKAP — Redesign Preview
   app.js : shell, navigasi, role, modal, dan interaksi
   ============================================================ */

(function () {
  'use strict';

  /* ── Metadata layar ─────────────────────────────────────── */
  var META = {
    'login': { title: 'Masuk', group: 'Autentikasi', role: 'auth', icon: 'logout', desc: 'Form email + password, lupa password, tampilkan sandi.' },
    'reset-password': { title: 'Reset Password', group: 'Autentikasi', role: 'auth', icon: 'key', desc: 'Atur password baru dari tautan pemulihan email.' },

    'dashboard-anggota': { title: 'Dashboard Anggota', group: 'Ruang Kerja', role: 'anggota', icon: 'dashboard', desc: 'Sapaan, KPI, alert periode, riwayat upload, list/grid, hapus.' },
    'upload-ckp': { title: 'Upload CKP', group: 'Ruang Kerja', role: 'anggota', icon: 'upload', desc: 'Wizard 3 langkah: periode + file, preview & kalender, mapping RK.' },
    'detail-ckp': { title: 'Detail CKP', group: 'Ruang Kerja', role: 'anggota', icon: 'file-text', desc: 'Rincian entri, catatan koreksi, bukti dukung, riwayat review.' },

    'dashboard-ketua': { title: 'Dashboard Ketua Tim', group: 'Ruang Kerja', role: 'ketua_tim', icon: 'users', desc: 'KPI RK, kartu RK per tim, pencarian, filter, dan lompat ke RK.' },
    'detail-rk': { title: 'Detail RK', group: 'Ruang Kerja', role: 'ketua_tim', icon: 'list-checks', desc: 'Tabel nilai per pegawai, simpan Enter, tandai perlu diperbaiki.' },
    'penilaian-ckp': { title: 'Penilaian CKP', group: 'Ruang Kerja', role: 'ketua_tim', icon: 'check-circle', desc: 'Nilai per RK, pindah RK, kalender, approval & buka kembali.' },

    'dashboard-pimpinan': { title: 'Dashboard Pimpinan', group: 'Ruang Kerja', role: 'pimpinan', icon: 'dashboard', desc: 'Tingkat pelaporan, distribusi status, rekap per pegawai, export.' },
    'persetujuan-cepat': { title: 'Persetujuan Cepat', group: 'Ruang Kerja', role: 'pimpinan', icon: 'zap', desc: 'Antrean approval, gate penilaian, setujui semua yang siap.' },
    'monitoring-penilaian': { title: 'Monitoring Penilaian', group: 'Ruang Kerja', role: 'pimpinan', icon: 'gauge', desc: 'Tunggakan penilaian per ketua tim dan daftar RK anggota.' },
    'data-pegawai': { title: 'Data Pegawai', group: 'Ruang Kerja', role: 'pimpinan', icon: 'users', desc: 'Direktori pegawai aktif dengan pencarian dan profil.' },
    'detail-pegawai': { title: 'Detail Pegawai', group: 'Ruang Kerja', role: 'pimpinan', icon: 'user', desc: 'Profil pegawai, ringkasan, dan riwayat CKP per periode.' },

    'monitoring-admin': { title: 'Monitoring CKP', group: 'Ruang Kerja', role: 'admin', icon: 'dashboard', desc: 'Dashboard pimpinan versi admin untuk memantau seluruh CKP.' },
    'kepegawaian': { title: 'Kepegawaian', group: 'Administrasi', role: 'admin', icon: 'user-check', desc: 'Tambah/edit/hapus, reset password, nonaktifkan, ganti ketua tim.' },
    'manajemen-rk': { title: 'Manajemen RK', group: 'Administrasi', role: 'admin', icon: 'layers', desc: 'RK per tim kerja, Sub-RK, tahun aktif & arsip, kelola tahun.' },
    'import-rk': { title: 'Import RK', group: 'Administrasi', role: 'admin', icon: 'database', desc: 'Dataset ZIP, Excel, JSON, dry-run, dan simpan ke database.' },
    'pengaturan-periode': { title: 'Pengaturan Periode', group: 'Administrasi', role: 'admin', icon: 'lock', desc: 'Kunci/buka 12 bulan per tahun dengan konfirmasi.' },
    'log-aktivitas': { title: 'Log Aktivitas', group: 'Administrasi', role: 'admin', icon: 'activity', desc: '200 audit log terbaru, filter entitas, pencarian nama/aksi.' },
    'analitik': { title: 'Analitik CKP', group: 'Insight', role: 'admin', icon: 'chart', desc: 'Tren 12 bulan, distribusi status, SLA, dan tunggakan.' },

    'evaluasi-penilaian': { title: 'Evaluasi Penilaian', group: 'Lainnya', role: 'all', icon: 'printer', desc: 'Dokumen resmi evaluasi kinerja, PDF, ZIP, cetak, batas nilai.' },
    'rencana-kinerja': { title: 'Rencana Kinerja', group: 'Lainnya', role: 'all', icon: 'folder', desc: 'Daftar RK per tim (mode lihat-saja untuk anggota).' },
    'komponen': { title: 'Panduan Visual', group: 'Referensi', role: 'all', icon: 'spark', desc: 'Token warna, tipografi, tombol, badge lifecycle, dan modal.' }
  };

  var ORDER = ['login', 'reset-password', 'dashboard-anggota', 'upload-ckp', 'detail-ckp', 'dashboard-ketua', 'detail-rk', 'penilaian-ckp', 'dashboard-pimpinan', 'persetujuan-cepat', 'monitoring-penilaian', 'data-pegawai', 'detail-pegawai', 'monitoring-admin', 'kepegawaian', 'manajemen-rk', 'import-rk', 'pengaturan-periode', 'log-aktivitas', 'analitik', 'evaluasi-penilaian', 'rencana-kinerja', 'komponen'];

  /* ── Navigasi per peran ─────────────────────────────────── */
  var NAV = {
    anggota: [
      { label: 'Ruang Kerja', items: [['dashboard-anggota', 'Dashboard'], ['upload-ckp', 'Upload CKP'], ['detail-ckp', 'Detail CKP'], ['rencana-kinerja', 'Rencana Kinerja']] },
      { label: 'Penilaian', items: [['evaluasi-penilaian', 'Evaluasi Penilaian']] }
    ],
    ketua_tim: [
      { label: 'Penilaian Tim', items: [['dashboard-ketua', 'Dashboard Ketua Tim'], ['detail-rk', 'Detail RK'], ['penilaian-ckp', 'Penilaian CKP']] },
      { label: 'Ruang Pribadi', items: [['dashboard-anggota', 'Dashboard Anggota'], ['upload-ckp', 'Upload CKP'], ['rencana-kinerja', 'Rencana Kinerja'], ['evaluasi-penilaian', 'Evaluasi Penilaian']] }
    ],
    pimpinan: [
      { label: 'Pantauan', items: [['dashboard-pimpinan', 'Dashboard Pimpinan'], ['persetujuan-cepat', 'Persetujuan Cepat'], ['monitoring-penilaian', 'Monitoring Penilaian'], ['data-pegawai', 'Data Pegawai'], ['detail-pegawai', 'Detail Pegawai']] },
      { label: 'Penilaian', items: [['penilaian-ckp', 'Penilaian CKP'], ['detail-rk', 'Detail RK'], ['dashboard-ketua', 'Dashboard Ketua Tim'], ['evaluasi-penilaian', 'Evaluasi Penilaian']] },
      { label: 'Insight', items: [['analitik', 'Analitik CKP'], ['rencana-kinerja', 'Rencana Kinerja']] }
    ],
    admin: [
      { label: 'Pantauan', items: [['monitoring-admin', 'Monitoring CKP'], ['persetujuan-cepat', 'Persetujuan Cepat'], ['monitoring-penilaian', 'Monitoring Penilaian']] },
      { label: 'Administrasi', items: [['kepegawaian', 'Kepegawaian'], ['manajemen-rk', 'Manajemen RK'], ['import-rk', 'Import RK'], ['pengaturan-periode', 'Pengaturan Periode'], ['log-aktivitas', 'Log Aktivitas']] },
      { label: 'Insight & Lainnya', items: [['analitik', 'Analitik CKP'], ['data-pegawai', 'Data Pegawai'], ['penilaian-ckp', 'Penilaian CKP'], ['evaluasi-penilaian', 'Evaluasi Penilaian'], ['rencana-kinerja', 'Rencana Kinerja']] }
    ]
  };

  /* ── Persona per peran ──────────────────────────────────── */
  var PERSONA = {
    anggota: { name: 'Dwi Lestari', role: 'Statistisi Ahli Muda', initials: 'DL', home: 'dashboard-anggota' },
    ketua_tim: { name: 'Aditya Pratama', role: 'Ketua Tim Statistik Sosial', initials: 'AP', home: 'dashboard-ketua' },
    pimpinan: { name: 'Dra. Radina Kartika', role: 'Kepala BPS Kabupaten Belitung', initials: 'RK', home: 'dashboard-pimpinan' },
    admin: { name: 'Yoga Prasetyo', role: 'Admin Kepegawaian', initials: 'YP', home: 'monitoring-admin' }
  };

  /* ── State ──────────────────────────────────────────────── */
  var state = {
    role: 'anggota',
    screen: 'login',
    theme: 'light',
    sb: false
  };
  try {
    var saved = JSON.parse(localStorage.getItem('sikap-preview') || '{}');
    if (saved.role && PERSONA[saved.role]) state.role = saved.role;
    if (saved.theme) state.theme = saved.theme;
  } catch (e) { /* abaikan */ }
  try {
    var hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (hash.get('r') && PERSONA[hash.get('r')]) state.role = hash.get('r');
    if (hash.get('s') && META[hash.get('s')]) state.screen = hash.get('s');
  } catch (e) { /* abaikan */ }

  function persist() {
    try {
      localStorage.setItem('sikap-preview', JSON.stringify({ role: state.role, theme: state.theme }));
    } catch (e) { /* abaikan */ }
  }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ── Toast ──────────────────────────────────────────────── */
  function showToast(message, tone, title) {
    var stack = $('#toast-stack');
    if (!stack) return;
    tone = tone || 'success';
    var icons = { success: 'check-circle', error: 'alert', info: 'info', warning: 'alert' };
    var el = document.createElement('div');
    el.className = 'toast toast--' + tone;
    el.innerHTML = '<span class="toast__icon">' + window.ui.ic(icons[tone] || 'info') + '</span>' +
      '<div><div class="toast__title">' + (title || (tone === 'error' ? 'Gagal' : tone === 'info' ? 'Info' : 'Berhasil')) + '</div>' +
      '<div class="toast__text">' + message + '</div></div>';
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 240);
    }, 3200);
  }

  /* ── Tema ───────────────────────────────────────────────── */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    $$('.theme-icon').forEach(function (el) {
      el.querySelector('use').setAttribute('href', state.theme === 'dark' ? '#i-sun' : '#i-moon');
    });
  }

  /* ── Sidebar ────────────────────────────────────────────── */
  function renderNav() {
    var groups = NAV[state.role] || NAV.anggota;
    var html = groups.map(function (g) {
      return '<div class="nav-label">' + g.label + '</div>' +
        g.items.map(function (it) {
          var m = META[it[0]];
          return '<button class="nav-item' + (state.screen === it[0] ? ' is-active' : '') + '" data-screen="' + it[0] + '">' +
            window.ui.ic(m.icon) + '<span>' + it[1] + '</span>' +
            (it[0] === 'persetujuan-cepat' && (state.role === 'pimpinan' || state.role === 'admin') ? '<span class="nav-item__count">7</span>' : '') +
            '</button>';
        }).join('');
    }).join('');
    html += '<div class="nav-label">Referensi</div>' +
      '<button class="nav-item' + (state.screen === 'komponen' ? ' is-active' : '') + '" data-screen="komponen">' +
      window.ui.ic('spark') + '<span>Panduan Visual</span></button>' +
      '<button class="nav-item" data-action="index">' + window.ui.ic('grid') + '<span>Semua Layar (23)</span></button>';
    $('#sidebar-nav').innerHTML = html;
  }

  function renderPersona() {
    var p = PERSONA[state.role];
    $('#sidebar-name').textContent = p.name;
    $('#sidebar-role').textContent = p.role;
    $('#sidebar-avatar').textContent = p.initials;
    $('#topbar-name').textContent = p.name;
    $('#topbar-role').textContent = state.role === 'ketua_tim' ? 'Ketua Tim' : state.role.charAt(0).toUpperCase() + state.role.slice(1);
    $('#topbar-avatar').textContent = p.initials;
    $$('.preview-role').forEach(function (b) { b.classList.toggle('is-active', b.dataset.role === state.role); });
  }

  /* ── Notifikasi ─────────────────────────────────────────── */
  function renderNotif() {
    var panel = $('#notif-panel');
    panel.innerHTML =
      '<div class="popover__head"><span class="popover__title">Notifikasi</span>' +
      '<button class="link tiny" data-action="read-all">' + window.ui.ic('check') + ' Tandai dibaca</button></div>' +
      '<div class="popover__list">' +
        '<button class="notif is-unread" data-screen="penilaian-ckp"><span class="notif__dot"></span><span><span class="notif__title">CKP Oktober 2026 menunggu review</span>' +
          '<span class="notif__body">Dwi Lestari mengirim CKP v2 dengan 42 kegiatan.</span><span class="notif__time">12 menit lalu</span></span></button>' +
        '<button class="notif is-unread" data-screen="detail-ckp"><span class="notif__dot"></span><span><span class="notif__title">Perlu revisi pada CKP Juli 2026</span>' +
          '<span class="notif__body">Lengkapi tautan bukti dukung kegiatan administrasi.</span><span class="notif__time">2 jam lalu</span></span></button>' +
        '<button class="notif is-unread" data-screen="persetujuan-cepat"><span class="notif__dot"></span><span><span class="notif__title">4 CKP siap disetujui</span>' +
          '<span class="notif__body">Seluruh RK sudah dinilai oleh ketua tim.</span><span class="notif__time">Kemarin</span></span></button>' +
        '<button class="notif" data-screen="dashboard-anggota"><span><span class="notif__title">CKP September 2026 disetujui</span>' +
          '<span class="notif__body">Nilai akhir 91,4 &mdash; diatas ekspektasi.</span><span class="notif__time">2 Okt 2026</span></span></button>' +
      '</div>' +
      '<div class="popover__foot" data-screen="dashboard-anggota">Lihat dashboard</div>';
  }

  /* ── Header ─────────────────────────────────────────────── */
  function renderHeader(screenId) {
    var m = META[screenId] || { title: 'SIKAP' };
    var group = m.group || 'SIKAP';
    $('#topbar-crumbs').innerHTML = '<span>' + group + '</span><span class="sep">/</span><span class="current">' + m.title + '</span>';
    document.title = m.title + ' — SIKAP (Preview)';
  }

  /* ── Modal ──────────────────────────────────────────────── */
  function modalWrap(o) {
    return '<div class="modal ' + (o.size ? 'modal--' + o.size : '') + '" role="dialog" aria-modal="true" aria-label="' + o.title + '">' +
      '<div class="modal__head">' +
        '<span class="modal__icon ' + (o.iconTone ? 'modal__icon--' + o.iconTone : '') + '">' + window.ui.ic(o.icon || 'info') + '</span>' +
        '<div style="min-width:0"><div class="modal__title">' + o.title + '</div>' +
        (o.desc ? '<div class="modal__desc">' + o.desc + '</div>' : '') + '</div>' +
        '<button class="modal__close" data-action="close-modal" aria-label="Tutup">' + window.ui.ic('x') + '</button>' +
      '</div>' +
      '<div class="modal__body">' + o.body + '</div>' +
      '<div class="modal__foot">' + o.foot + '</div>' +
    '</div>';
  }

  function MODALS() {
    var ic = window.ui.ic;
    var opt = window.ui.select;
    return {
      'approval': modalWrap({
        title: 'Review CKP', desc: 'Dwi Lestari &mdash; Oktober 2026', icon: 'check-circle',
        body:
          '<div class="field mb-3"><label>Pilih Tindakan</label>' +
            '<div class="grid-3">' +
              '<button class="card" style="padding:14px;text-align:center;border-color:var(--success);background:var(--success-soft)"><span class="stat__icon stat__icon--sage" style="margin:0 auto 6px">' + ic('check-circle') + '</span><div class="strong small">Setujui</div></button>' +
              '<button class="card" style="padding:14px;text-align:center"><span class="stat__icon stat__icon--coral" style="margin:0 auto 6px">' + ic('x') + '</span><div class="strong small">Tolak</div></button>' +
              '<button class="card" style="padding:14px;text-align:center"><span class="stat__icon stat__icon--gold" style="margin:0 auto 6px">' + ic('refresh') + '</span><div class="strong small">Minta Revisi</div></button>' +
            '</div></div>' +
          '<div class="field"><label>Catatan</label><textarea class="textarea" placeholder="Catatan opsional untuk approve; wajib untuk tolak/revisi…"></textarea></div>' +
          '<div class="mt-3">' + alertBoxMini('Semua 5 RK sudah dinilai. Persetujuan akan mengunci nilai CKP dan mencatat approved_at.') + '</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="CKP berhasil disetujui (pratinjau).">' + ic('check-circle') + 'Setujui CKP</button>'
      }),
      'bulk-approve': modalWrap({
        title: 'Setujui Semua yang Siap?', size: 'sm', icon: 'zap', iconTone: 'gold',
        desc: '4 CKP dengan seluruh RK sudah dinilai akan langsung disetujui.',
        body: '<div class="grid-3">' + [['CKP', '4'], ['RK dinilai', '21'], ['Gagal', '0']].map(function (x) {
          return '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body" style="padding:12px"><div class="mini-label">' + x[0] + '</div><div class="stat__value" style="font-size:24px;margin-top:2px">' + x[1] + '</div></div></div>';
        }).join('') + '</div>' +
          '<p class="small muted mt-3">Tindakan ini tidak dapat dibatalkan dan tercatat pada audit log.</p>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="4 CKP berhasil disetujui (pratinjau).">' + ic('check-circle') + 'Setujui 4 CKP</button>'
      }),
      'change-password': modalWrap({
        title: 'Ganti Password', size: 'sm', icon: 'key',
        desc: 'Ubah password akun Anda untuk keamanan.',
        body:
          '<div class="field mb-3"><label>Password Baru</label><div class="input-affix"><input class="input" type="password" placeholder="Masukkan password baru" />' +
          '<button class="affix-btn" data-action="toggle-password">' + ic('eye') + '</button></div></div>' +
          '<div class="field"><label>Konfirmasi Password Baru</label><input class="input" type="password" placeholder="Ulangi password baru" /></div>' +
          '<div class="tiny muted mt-2">Minimal 6 karakter dan berbeda dari password lama.</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Password berhasil diubah (pratinjau).">' + ic('key') + 'Simpan Password</button>'
      }),
      'upload-progress': modalWrap({
        title: 'Memproses Upload…', size: 'sm', icon: 'upload',
        desc: 'Mohon jangan menutup halaman ini.',
        body:
          '<div class="row" style="justify-content:center;margin:6px 0 18px">' + window.ui.ring(68, 'selesai', { text: '68%', color: 'var(--teal)' }) + '</div>' +
          '<div class="stack" style="gap:10px">' +
            checkLine('Persiapan data…', true) +
            checkLine('Mengunggah file Excel ke Storage…', true) +
            checkLine('Menyiapkan versi CKP…', false) +
            checkLine('Menyimpan informasi CKP…', false) +
            checkLine('Menyimpan detail kegiatan…', false) +
          '</div>',
        foot: '<span class="tiny muted push">Estimasi 4 detik lagi</span>' +
          '<button class="btn btn-danger btn-sm" data-action="close-modal">Batalkan Upload</button>'
      }),
      'delete-ckp': confirmModal('Hapus CKP ini?', 'Seluruh entri kegiatan pada CKP ini akan ikut terhapus permanen dan tidak dapat dikembalikan.', 'Hapus CKP', 'delete'),
      'delete-employee': confirmModal('Hapus pegawai permanen?', 'Semua data CKP, entri, approval, dan riwayat milik pegawai ini ikut terhapus dan tidak dapat dikembalikan.', 'Hapus Pegawai', 'delete'),
      'reset-password': confirmModal('Reset password ke default?', 'Kata sandi pegawai akan direset menjadi "Password123!" dan wajib diganti saat masuk berikutnya.', 'Reset Password', 'warning'),
      'toggle-employee': confirmModal('Ubah status akun?', 'Menonaktifkan akun memblokir akses login tanpa menghapus data CKP yang sudah ada.', 'Ya, Ubah Status', 'warning'),
      'delete-rk': confirmModal('Hapus RK ini?', 'Sub-RK dan penugasan anggota di bawahnya ikut terhapus. Tindakan tercatat pada audit log.', 'Hapus RK', 'delete'),
      'delete-year': confirmModal('Hapus seluruh RK tahun 2025?', 'Data RK tahun 2025 beserta Sub-RK-nya akan dihapus permanen. Data CKP yang sudah tersimpan tidak terpengaruh.', 'Hapus Tahun 2025', 'delete'),
      'lock-period': modalWrap({
        title: 'Kunci periode November 2026?', size: 'sm', icon: 'lock', iconTone: 'danger',
        desc: 'Yakin ingin mengunci periode November 2026?',
        body: alertBoxMini('Saat terkunci, pegawai tidak dapat mengunggah atau mengubah CKP. Pimpinan tetap dapat melakukan approval.'),
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-danger" data-action="submit-modal" data-toast="Periode November 2026 berhasil dikunci (pratinjau).">' + ic('lock') + 'Ya, Kunci</button>'
      }),
      'reopen': modalWrap({
        title: 'Buka kembali penilaian?', size: 'sm', icon: 'unlock', iconTone: 'gold',
        desc: 'Dwi Lestari &mdash; Oktober 2026',
        body:
          '<p class="small" style="color:var(--ink-2);line-height:1.65">Semua nilai pada CKP ini akan <b style="color:var(--ink)">terbuka untuk dinilai ulang</b> oleh ketua tim dan pimpinan, dan status CKP kembali ke tahap penilaian.</p>' +
          '<div class="tiny muted mt-3">Tindakan ini tercatat pada riwayat persetujuan dan pegawai akan menerima notifikasi.</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-ink" data-action="submit-modal" data-toast="CKP berhasil dibuka kembali (pratinjau).">' + ic('unlock') + 'Ya, Buka Kembali</button>'
      }),
      'move-rk': modalWrap({
        title: 'Pindah / Koreksi Rencana Kinerja', size: 'sm', icon: 'swap',
        desc: 'Kegiatan akan langsung dipindahkan ke grup RK yang baru.',
        body:
          '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body">' +
            '<div class="mini-label">Kegiatan</div><div class="small strong">Pendataan lapangan Susenas Oktober 2026</div>' +
            '<div class="mini-label mt-2">RK Awal (Salah)</div><div class="small" style="color:var(--danger)">Meningkatnya kualitas data statistik sosial</div>' +
          '</div></div>' +
          '<div class="field mt-3"><label>Pilih RK Induk Baru</label><input class="input" list="master-rk-list" placeholder="Ketik atau pilih Rencana Kinerja…" value="Penguatan metadata statistik" />' +
          '<datalist id="master-rk-list"><option value="Penguatan metadata statistik"></option><option value="Peningkatan diseminasi data"></option></datalist></div>' +
          '<div class="tiny muted mt-2">Pilih dari daftar RK atau ketik manual bila belum ada di daftar.</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Kegiatan berhasil dipindah ke RK baru (pratinjau).">Simpan Perubahan</button>'
      }),
      'mark-entry': modalWrap({
        title: 'Tandai Perlu Diperbaiki', size: 'sm', icon: 'alert', iconTone: 'gold',
        desc: 'Catatan akan terlihat oleh pegawai saat memperbaiki file Excel.',
        body:
          '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body">' +
            '<div class="mini-label">Kegiatan</div><div class="small">Penyusunan kamus variabel kegiatan statistik</div></div></div>' +
          '<div class="field mt-3"><label>Catatan Perbaikan</label><textarea class="textarea" placeholder="Contoh: Kegiatan ini seharusnya masuk ke Rencana Kinerja X…"></textarea></div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-ink" data-action="submit-modal" data-toast="Catatan perbaikan tersimpan &amp; pegawai menerima notifikasi (pratinjau).">Simpan Catatan</button>'
      }),
      'add-employee': modalWrap({
        title: 'Tambah Pegawai Baru', icon: 'plus',
        desc: 'Akun, profil, dan peran dibuat sekaligus.',
        body:
          '<div class="field mb-3"><label>Nama Lengkap</label><input class="input" placeholder="Nama lengkap pegawai" /></div>' +
          '<div class="grid-2 mb-3"><div class="field"><label>NIP</label><input class="input" placeholder="18 digit NIP" /></div>' +
          '<div class="field"><label>Email</label><input class="input" type="email" placeholder="nama@bps.go.id" /></div></div>' +
          '<div class="grid-2 mb-3"><div class="field"><label>Jabatan</label><input class="input" list="jab-list" placeholder="Contoh: Statistisi Ahli Muda" /></div>' +
          '<div class="field"><label>Pangkat / Golongan</label><input class="input" list="gol-list" placeholder="Contoh: Penata Tk.I, III/d" /></div></div>' +
          '<div class="grid-2 mb-3"><div class="field"><label>Unit Kerja</label><input class="input" placeholder="Tim Statistik Sosial" /></div>' +
          '<div class="field"><label>Peran (Role)</label>' + opt([{ value: 'anggota', label: 'Pegawai' }, { value: 'ketua_tim', label: 'Ketua Tim' }, { value: 'pimpinan', label: 'Pimpinan' }, { value: 'admin', label: 'Admin' }], 'anggota', 'style="height:42px"') + '</div></div>' +
          '<div class="field"><label>Password Default</label><input class="input" value="Password123!" /></div>' +
          '<datalist id="jab-list"><option value="Statistisi Ahli Madya"></option><option value="Statistisi Ahli Muda"></option><option value="Statistisi Ahli Pertama"></option><option value="Pranata Komputer Mahir"></option><option value="Pelaksana"></option></datalist>' +
          '<datalist id="gol-list"><option value="Pembina, IV/a"></option><option value="Penata Tk.I, III/d"></option><option value="Penata Muda Tk.I, III/b"></option><option value="Pengatur, II/c"></option></datalist>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Pegawai berhasil ditambahkan (pratinjau).">Simpan Pegawai</button>'
      }),
      'edit-employee': modalWrap({
        title: 'Edit Profil Pegawai', icon: 'pencil',
        desc: 'Ubah nama, NIP, jabatan, golongan, unit, atau peran.',
        body:
          '<div class="field mb-3"><label>Nama Lengkap</label><input class="input" value="Dwi Lestari" /></div>' +
          '<div class="grid-2 mb-3"><div class="field"><label>NIP</label><input class="input" value="199203142015022003" /></div>' +
          '<div class="field"><label>Email (hanya baca)</label><input class="input" value="dwi.lestari@bps.go.id" disabled /></div></div>' +
          '<div class="grid-2 mb-3"><div class="field"><label>Jabatan</label><input class="input" value="Statistisi Ahli Muda" /></div>' +
          '<div class="field"><label>Pangkat / Golongan</label><input class="input" value="Penata Muda Tk.I, III/b" /></div></div>' +
          '<div class="grid-2"><div class="field"><label>Unit Kerja</label><input class="input" value="Tim Statistik Sosial" /></div>' +
          '<div class="field"><label>Peran (Role)</label>' + opt([{ value: 'anggota', label: 'Pegawai' }, { value: 'ketua_tim', label: 'Ketua Tim' }, { value: 'pimpinan', label: 'Pimpinan' }, { value: 'admin', label: 'Admin' }], 'anggota', 'style="height:42px"') + '</div></div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Profil pegawai berhasil diperbarui (pratinjau).">Simpan Perubahan</button>'
      }),
      'replace-ketua': modalWrap({
        title: 'Ganti Ketua Tim', icon: 'swap',
        desc: 'Semua Rencana Kinerja tim ini akan dipindahkan ke pengganti.',
        body:
          '<div class="field mb-3"><label>Pilih Tim</label>' + opt([{ value: '', label: '-- Pilih Tim --' }, { value: 'sosial', label: 'Statistik Sosial — saat ini: Aditya Pratama' }, { value: 'produksi', label: 'Statistik Produksi — saat ini: Nurul Aini' }], '', 'style="height:42px"') + '</div>' +
          '<div class="field"><label>Pegawai Pengganti</label>' + opt([{ value: '', label: '-- Pilih Pegawai Aktif --' }, { value: '1', label: 'Fajar Nugroho (Ketua Tim)' }, { value: '2', label: 'Intan Permata' }, { value: '3', label: 'Bayu Saputra' }], '', 'style="height:42px"') + '</div>' +
          '<div class="tiny muted mt-2">Pegawai pengganti akan di-promote menjadi ketua tim; mapping RK lama dipindahkan.</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Ketua Tim berhasil diganti (pratinjau).">Simpan Perubahan</button>'
      }),
      'add-rk': modalWrap({
        title: 'Tambah RK Utama', icon: 'plus',
        desc: 'RK akan tercatat pada tahun aktif 2026.',
        body:
          '<div class="field mb-3"><label>Nama Rencana Kinerja</label><textarea class="textarea" placeholder="Ketik nama RK…"></textarea></div>' +
          '<div class="grid-2"><div class="field"><label>Tim Kerja</label><input class="input" placeholder="Misal: Statistik Sosial" /></div>' +
          '<div class="field"><label>Ketua Tim</label>' + opt([{ value: '', label: '-- Pilih Ketua Tim --' }, { value: '1', label: 'Aditya Pratama (Statistik Sosial)' }, { value: '2', label: 'Nurul Aini (Statistik Produksi)' }], '', 'style="height:42px"') + '</div></div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="RK berhasil ditambahkan (pratinjau).">Simpan RK</button>'
      }),
      'add-sub-rk': modalWrap({
        title: 'Tambah Sub-RK', size: 'sm', icon: 'plus',
        desc: 'Sub-RK adalah kegiatan anggota di bawah RK utama.',
        body:
          '<div class="card" style="box-shadow:none;background:var(--teal-tint)"><div class="card-body"><div class="mini-label">RK Utama</div><div class="small strong">Meningkatnya kualitas data statistik sosial</div></div></div>' +
          '<div class="field mt-3"><label>Nama Sub-RK / Kegiatan</label><textarea class="textarea" placeholder="Ketik nama kegiatan…"></textarea></div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Sub-RK berhasil ditambahkan (pratinjau).">Simpan Sub-RK</button>'
      }),
      'move-sub-rk': modalWrap({
        title: 'Pindah Induk RK', size: 'sm', icon: 'swap', iconTone: 'gold',
        desc: 'Sub-RK akan dipindahkan ke RK utama yang dipilih.',
        body:
          '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body"><div class="mini-label">Sub-RK</div>' +
          '<div class="small strong">Supervisi petugas pendataan kecamatan</div></div></div>' +
          '<div class="field mt-3"><label>RK Utama Tujuan</label>' + opt([{ value: '', label: '-- Pilih RK --' }, { value: '1', label: 'Penguatan metadata statistik' }, { value: '2', label: 'Peningkatan diseminasi data' }], '', 'style="height:42px"') + '</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Sub-RK berhasil dipindahkan (pratinjau).">Simpan Perubahan</button>'
      }),
      'import-confirm': modalWrap({
        title: 'Simpan dataset ke database?', icon: 'database',
        desc: 'Data akan disimpan sebagai RK tahun 2026.',
        body:
          '<div class="grid-3 mb-3">' + [['Tim', '14'], ['RK Ketua Tim', '28'], ['Sub-RK', '112']].map(function (x) {
            return '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body" style="padding:12px"><div class="mini-label">' + x[0] + '</div><div class="stat__value" style="font-size:24px;margin-top:2px">' + x[1] + '</div></div></div>';
          }).join('') + '</div>' +
          '<div class="stack" style="gap:9px">' +
            miniCheck('28 RK Ketua Tim dan 112 Sub-RK akan diimpor untuk tahun 2026.') +
            miniCheck('RK tahun sebelumnya diarsipkan, tidak dihapus.') +
            miniCheck('3 mapping ketua tim dipertahankan sesuai keputusan admin.') +
          '</div>',
        foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
          '<button class="btn btn-primary" data-action="submit-modal" data-toast="Dataset RK tahun 2026 berhasil disimpan (pratinjau).">' + ic('database') + 'Ya, Simpan</button>'
      }),
      'screen-index': null
    };
  }

  function alertBoxMini(text) {
    return '<div class="alert alert--info" style="margin:0"><span class="alert__icon">' + window.ui.ic('info') + '</span>' +
      '<div class="alert__text">' + text + '</div></div>';
  }
  function checkLine(text, done) {
    return '<div class="row" style="gap:10px">' +
      (done ? '<span class="badge badge--approved">' + window.ui.ic('check') + '</span>' : '<span class="badge badge--muted">' + window.ui.ic('clock') + '</span>') +
      '<span class="small" style="color:' + (done ? 'var(--ink)' : 'var(--ink-3)') + '">' + text + '</span></div>';
  }
  function miniCheck(text) {
    return '<div class="checkline"><span class="tick">' + window.ui.ic('check') + '</span><span>' + text + '</span></div>';
  }
  function confirmModal(title, desc, confirmLabel, tone) {
    var iconTone = tone === 'delete' ? 'danger' : 'gold';
    var btnClass = tone === 'delete' ? 'btn-danger' : 'btn-ink';
    return modalWrap({
      title: title, desc: desc, size: 'sm', icon: 'alert', iconTone: iconTone,
      body: '<div class="tiny muted">Tindakan ini tercatat pada audit log dan riwayat persetujuan.</div>',
      foot: '<button class="btn btn-secondary" data-action="close-modal">Batal</button>' +
        '<button class="btn ' + btnClass + '" data-action="submit-modal" data-toast="' + title.replace(/\?$/, '') + ' — berhasil diproses (pratinjau).">' + confirmLabel + '</button>'
    });
  }

  function openModal(name) {
    var modals = MODALS();
    if (!modals[name]) return;
    var root = $('#modal-root');
    root.innerHTML = modals[name];
    root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    var root = $('#modal-root');
    root.classList.remove('is-open');
    root.innerHTML = '';
    if (!$('#cmd-root').classList.contains('is-open')) document.body.style.overflow = '';
  }

  /* ── Screen index ───────────────────────────────────────── */
  function openIndex() {
    var groups = {};
    ORDER.forEach(function (id) {
      var m = META[id];
      var g = m.group;
      (groups[g] = groups[g] || []).push(id);
    });
    var order = ['Autentikasi', 'Ruang Kerja', 'Administrasi', 'Insight', 'Lainnya', 'Referensi'];
    var body = order.filter(function (g) { return groups[g]; }).map(function (g) {
      return '<div class="mini-label mt-3" style="margin-bottom:9px">' + g + '</div>' +
        '<div class="index-grid">' + groups[g].map(function (id) {
          var m = META[id];
          var roleLabel = m.role === 'all' ? 'Semua peran' : m.role === 'auth' ? 'Publik' : m.role.replace('_', ' ');
          return '<button class="index-card" data-action="index-go" data-screen="' + id + '">' +
            '<span class="index-card__icon">' + window.ui.ic(m.icon) + '</span>' +
            '<span style="min-width:0"><span class="index-card__name">' + m.title + '</span>' +
            '<span class="index-card__desc">' + m.desc + '</span>' +
            '<span class="index-card__role">' + roleLabel + '</span></span></button>';
        }).join('') + '</div>';
    }).join('');

    var root = $('#modal-root');
    root.innerHTML = '<div class="modal modal--xl" role="dialog" aria-modal="true" aria-label="Daftar layar">' +
      '<div class="modal__head"><span class="modal__icon">' + window.ui.ic('grid') + '</span>' +
        '<div><div class="modal__title">Semua Layar Pratinjau</div>' +
        '<div class="modal__desc">23 layar mencakup seluruh peran dan alur SIKAP — pilih untuk membuka &amp; berpindah peran otomatis.</div></div>' +
        '<button class="modal__close" data-action="close-modal">' + window.ui.ic('x') + '</button></div>' +
      '<div class="modal__body">' + body + '</div>' +
      '<div class="modal__foot"><button class="btn btn-secondary" data-action="close-modal">Tutup</button></div>' +
    '</div>';
    root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /* ── Command palette ────────────────────────────────────── */
  var cmdItems = [];
  function buildCmdItems() {
    cmdItems = ORDER.map(function (id) {
      var m = META[id];
      return { id: id, label: m.title, group: m.group, icon: m.icon, hint: 'Layar' };
    });
    cmdItems.push({ id: 'cmd-theme', label: 'Ganti tema terang / gelap', group: 'Aksi', icon: 'moon', hint: 'Aksi' });
    cmdItems.push({ id: 'cmd-password', label: 'Ganti password', group: 'Aksi', icon: 'key', hint: 'Aksi' });
    cmdItems.push({ id: 'cmd-index', label: 'Buka daftar semua layar', group: 'Aksi', icon: 'grid', hint: 'Aksi' });
    cmdItems.push({ id: 'cmd-logout', label: 'Keluar dari akun', group: 'Aksi', icon: 'logout', hint: 'Aksi' });
  }

  function renderCmd(query) {
    var list = $('#cmd-list');
    if (!list) return;
    var q = (query || '').trim().toLowerCase();
    var filtered = cmdItems.filter(function (it) {
      return !q || (it.label + ' ' + it.group).toLowerCase().indexOf(q) !== -1;
    });
    if (!filtered.length) {
      list.innerHTML = '<div class="cmd__empty">Tidak ada hasil untuk "' + query + '".</div>';
      return;
    }
    var groups = {};
    filtered.forEach(function (it) { (groups[it.group] = groups[it.group] || []).push(it); });
    list.innerHTML = Object.keys(groups).map(function (g) {
      return '<div class="cmd__group">' + g + '</div>' + groups[g].map(function (it, idx) {
        return '<button class="cmd__item' + (idx === 0 && g === Object.keys(groups)[0] ? ' is-active' : '') + '" data-action="cmd-go" data-cmd="' + it.id + '">' +
          window.ui.ic(it.icon) + '<span>' + it.label + '</span><small>' + it.hint + '</small></button>';
      }).join('');
    }).join('');
  }

  function openCmd() {
    var root = $('#cmd-root');
    root.innerHTML = '<div class="cmd">' +
      '<div class="cmd__input">' + window.ui.ic('search') +
        '<input id="cmd-input" placeholder="Cari layar atau aksi…" autocomplete="off" />' +
        '<span class="cmd__hint">ESC untuk menutup</span></div>' +
      '<div class="cmd__list" id="cmd-list"></div>' +
      '<div class="cmd__foot"><span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> navigasi</span><span><kbd>Enter</kbd> buka</span>' +
        '<span style="margin-left:auto">' + ORDER.length + ' layar &middot; 4 aksi</span></div>' +
    '</div>';
    root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    renderCmd('');
    setTimeout(function () { var i = $('#cmd-input'); if (i) i.focus(); }, 40);
  }
  function closeCmd() {
    var root = $('#cmd-root');
    root.classList.remove('is-open');
    root.innerHTML = '';
    if (!$('#modal-root').classList.contains('is-open')) document.body.style.overflow = '';
  }
  function runCmd(id) {
    if (id === 'cmd-theme') { toggleTheme(); return; }
    if (id === 'cmd-password') { closeCmd(); openModal('change-password'); return; }
    if (id === 'cmd-index') { closeCmd(); openIndex(); return; }
    if (id === 'cmd-logout') { closeCmd(); go('login'); showToast('Anda telah keluar (pratinjau).', 'info'); return; }
    closeCmd();
    var m = META[id];
    if (m && m.role !== 'all' && m.role !== 'auth' && PERSONA[m.role]) state.role = m.role;
    go(id);
    if (m && m.role !== 'all' && m.role !== 'auth') {
      var p = PERSONA[state.role];
      if (p.name.indexOf('Dwi') === 0) { /* persona sudah sesuai */ }
    }
  }

  /* ── Rendering ──────────────────────────────────────────── */
  function render() {
    var id = state.screen;
    var def = window.SIKAP_SCREENS[id] || (window.SIKAP_SCREENS['dashboard-anggota']);
    var m = META[id] || META['dashboard-anggota'];
    var isAuth = !!def.auth;

    var shell = $('#app-shell');
    var authRoot = $('#auth-root');

    if (isAuth) {
      shell.classList.remove('is-visible');
      authRoot.classList.add('is-visible');
      authRoot.innerHTML = def.content();
      document.title = m.title + ' — SIKAP (Preview)';
      applyRoleVisibility(authRoot);
      window.scrollTo(0, 0);
      return;
    }

    authRoot.classList.remove('is-visible');
    authRoot.innerHTML = '';
    shell.classList.add('is-visible');
    renderNav();
    renderPersona();
    renderHeader(id);
    $('#screen-root').innerHTML = def.content();
    applyRoleVisibility($('#screen-root'));
    afterRender();
    window.scrollTo(0, 0);
  }

  function applyRoleVisibility(root) {
    $$('[data-roles]', root).forEach(function (el) {
      var allowed = el.getAttribute('data-roles').split(/\s+/);
      el.classList.toggle('is-hidden', allowed.indexOf(state.role) === -1);
    });
  }

  function afterRender() {
    var cal = $('#review-cal');
    if (cal) fillCalendar(cal);
  }

  function fillCalendar(el) {
    var filled = [1, 2, 5, 7, 8, 9, 12, 13, 15, 16, 19, 20, 22, 23, 26, 27, 28, 29, 30];
    var empty = [6, 14, 21];
    var off = [3, 4, 10, 11, 17, 18, 24, 25, 31];
    var html = '';
    var lead = 2, days = 31;
    for (var i = 0; i < lead; i++) html += '<div class="cal-day cal-day--out"><span class="cal-day__num">&nbsp;</span></div>';
    for (var d = 1; d <= days; d++) {
      var cls = 'cal-day';
      if (off.indexOf(d) !== -1) cls += ' cal-day--off';
      if (filled.indexOf(d) !== -1) cls += ' cal-day--filled';
      if (empty.indexOf(d) !== -1) cls += ' cal-day--empty';
      var dots = '';
      if (filled.indexOf(d) !== -1) for (var k = 0; k < (1 + (d % 3)); k++) dots += '<i></i>';
      html += '<div class="' + cls + '"><span class="cal-day__num">' + d + '</span><div class="cal-day__dots">' + dots + '</div>' +
        (filled.indexOf(d) !== -1 ? '<span class="cal-day__tag">Terisi</span>' : empty.indexOf(d) !== -1 ? '<span class="cal-day__tag">Kosong</span>' : '') + '</div>';
    }
    var tail = (7 - ((lead + days) % 7)) % 7;
    for (var t = 0; t < tail; t++) html += '<div class="cal-day cal-day--out"><span class="cal-day__num">&nbsp;</span></div>';
    el.innerHTML = html;
  }

  function go(id, opts) {
    opts = opts || {};
    if (!META[id] && !window.SIKAP_SCREENS[id]) return;
    state.screen = id;
    if (opts.setRole && META[id] && META[id].role && META[id].role !== 'all' && META[id].role !== 'auth' && PERSONA[META[id].role]) {
      state.role = META[id].role;
    }
    try {
      history.replaceState(null, '', '#s=' + id + '&r=' + state.role);
    } catch (e) { /* abaikan */ }
    render();
  }

  function setRole(role, navigate) {
    if (!PERSONA[role]) return;
    state.role = role;
    persist();
    try { history.replaceState(null, '', '#s=' + state.screen + '&r=' + role); } catch (e) { /* abaikan */ }
    renderPersona();
    if (navigate) {
      go(PERSONA[role].home, { setRole: false });
    } else {
      render();
    }
  }

  /* ── Filter ─────────────────────────────────────────────── */
  function applySearch(targetSel, query) {
    var container = $(targetSel);
    if (!container) return;
    var q = (query || '').trim().toLowerCase();
    var items = $$('[data-search]', container);
    var shown = 0;
    if (!items.length) {
      items = $$('tbody tr', container);
      items.forEach(function (tr) {
        var txt = tr.textContent.toLowerCase();
        var ok = !q || txt.indexOf(q) !== -1;
        tr.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
    } else {
      items.forEach(function (el) {
        var txt = (el.getAttribute('data-search') || el.textContent).toLowerCase();
        var ok = !q || txt.indexOf(q) !== -1;
        el.classList.toggle('is-hidden', !ok);
        if (ok) shown++;
      });
    }
    var empty = $('[data-empty-for="' + targetSel + '"]');
    if (empty) empty.classList.toggle('is-hidden', shown !== 0 || !q);
    var count = $(targetSel + ' [data-count]');
    if (count) count.textContent = shown;
  }

  function applySelectFilter(targetSel, value) {
    var container = $(targetSel);
    if (!container) return;
    var v = (value || '').toLowerCase();
    var all = !v || v === 'all' || v === 'semua';
    var items = $$('[data-search]', container);
    var shown = 0;
    items.forEach(function (el) {
      var txt = (el.getAttribute('data-search') || el.textContent).toLowerCase();
      var ok = all || txt.indexOf(v) !== -1;
      el.classList.toggle('is-hidden', !ok);
      if (ok) shown++;
    });
    var empty = $('[data-empty-for="' + targetSel + '"]');
    if (empty) empty.classList.toggle('is-hidden', shown !== 0);
  }

  function applyStatusFilter(targetSel, value) {
    var container = $(targetSel);
    if (!container) return;
    var v = value || 'all';
    var items = $$('[data-status]', container);
    var shown = 0;
    items.forEach(function (el) {
      var s = el.getAttribute('data-status');
      var ok = v === 'all' || s === v || (v === 'rejected' && (s === 'rejected' || s === 'revision_required'));
      el.classList.toggle('is-hidden', !ok);
      if (ok) shown++;
    });
    var empty = $('[data-empty-for="' + targetSel + '"]');
    if (empty) empty.classList.toggle('is-hidden', shown !== 0);
  }

  /* ── Event delegation ───────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var t = e.target;

    /* Cegah default untuk anchor tiruan */
    var screenEl = t.closest && t.closest('[data-screen]');
    var actionEl = t.closest && t.closest('[data-action]');
    var chipEl = t.closest && t.closest('[data-chip]');
    var viewEl = t.closest && t.closest('[data-view]');
    var stepEl = t.closest && t.closest('[data-step]');
    var expandEl = t.closest && t.closest('[data-action="expand"], [data-action="expand-acc"], [data-action="expand-all"]');

    if (t.tagName === 'A' && (screenEl || actionEl)) e.preventDefault();

    /* Role switch */
    var roleBtn = t.closest && t.closest('[data-role]');
    if (roleBtn) {
      setRole(roleBtn.dataset.role, true);
      showToast('Pratinjau sebagai <b>' + (roleBtn.dataset.role === 'ketua_tim' ? 'Ketua Tim' : roleBtn.dataset.role) + '</b>.', 'info', 'Peran diganti');
      return;
    }

    /* Navigasi layar */
    if (screenEl && !actionEl) {
      go(screenEl.dataset.screen, { setRole: false });
      return;
    }

    /* Chips filter status */
    if (chipEl) {
      var group = chipEl.closest('[data-chip-group]');
      if (group) {
        $$('[data-chip]', group).forEach(function (c) { c.classList.toggle('is-active', c === chipEl); });
        var target = group.getAttribute('data-chip-group');
        var v = chipEl.getAttribute('data-chip');
        var container = $(target);
        if (container) {
          var items = $$('[data-status]', container);
          var shown = 0;
          items.forEach(function (el) {
            var s = el.getAttribute('data-status') || 'none';
            var ok = v === 'all' || s === v || (v === 'none' && (s === 'none' || !s));
            el.classList.toggle('is-hidden', !ok);
            if (ok) shown++;
          });
          var empty = $('[data-empty-for="' + target + '"]');
          if (empty) empty.classList.toggle('is-hidden', shown !== 0);
        }
      }
      return;
    }

    /* Toggle tampilan list/grid/kalender */
    if (viewEl) {
      var seg = viewEl.closest('[data-view-group]');
      var view = viewEl.getAttribute('data-view');
      $$('[data-view]', seg).forEach(function (b) { b.classList.toggle('is-active', b === viewEl); });
      var host = viewEl.closest('[data-screen]') || document;
      $$('[data-view-pane]', host).forEach(function (pane) {
        pane.classList.toggle('is-hidden', pane.getAttribute('data-view-pane') !== view);
      });
      var grid = $('.upload-grid', host);
      if (grid) {
        grid.classList.toggle('is-hidden', view !== 'grid');
        grid.classList.toggle('is-visible', view === 'grid');
      }
      var list = $('[data-view-pane="list"]', host);
      if (list) list.classList.toggle('is-hidden', view !== 'list');
      return;
    }

    /* Stepper upload */
    if (stepEl) {
      var step = stepEl.getAttribute('data-step');
      var stepper = $('#upload-stepper');
      if (stepper) {
        $$('.step', stepper).forEach(function (s) {
          var n = Number(s.getAttribute('data-step'));
          s.classList.toggle('is-active', String(n) === step);
          s.classList.toggle('is-done', n < Number(step));
        });
        var host2 = stepEl.closest('#screen-root') || document;
        $$('.wizard-pane', host2).forEach(function (pane) {
          pane.classList.toggle('is-active', pane.getAttribute('data-step-pane') === step);
        });
      }
      return;
    }

    if (!actionEl) return;
    var action = actionEl.getAttribute('data-action');

    switch (action) {
      case 'cmd': openCmd(); break;
      case 'index': openIndex(); break;
      case 'theme': toggleTheme(); break;
      case 'modal': openModal(actionEl.getAttribute('data-modal')); break;
      case 'close-modal': closeModal(); break;
      case 'submit-modal':
        closeModal();
        showToast(actionEl.getAttribute('data-toast') || 'Berhasil diproses (pratinjau).');
        break;
      case 'index-go':
        closeModal();
        go(actionEl.getAttribute('data-screen'), { setRole: true });
        break;
      case 'cmd-go':
        runCmd(actionEl.getAttribute('data-cmd'));
        break;
      case 'notif':
        var panel = $('#notif-panel');
        panel.classList.toggle('is-open');
        actionEl.setAttribute('aria-expanded', panel.classList.contains('is-open'));
        break;
      case 'read-all':
        $$('#notif-panel .notif').forEach(function (n) { n.classList.remove('is-unread'); });
        $('#notif-dot').classList.add('is-hidden');
        showToast('Semua notifikasi ditandai dibaca.', 'info');
        break;
      case 'menu':
        document.body.classList.toggle('sb-open');
        break;
      case 'close-sidebar':
        document.body.classList.remove('sb-open');
        break;
      case 'collapse':
        document.body.classList.toggle('sb-collapsed');
        break;
      case 'logout':
        go('login');
        document.body.classList.remove('sb-open');
        showToast('Anda telah keluar (pratinjau).', 'info', 'Sampai jumpa');
        break;
      case 'install':
        showToast('SIKAP siap dipasang sebagai aplikasi (PWA) pada browser yang mendukung.', 'info', 'Pasang aplikasi');
        break;
      case 'toggle-password': {
        var input = actionEl.parentElement.querySelector('input');
        if (input) {
          var show = input.type === 'password';
          input.type = show ? 'text' : 'password';
          var use = actionEl.querySelector('use');
          if (use) use.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
        }
        break;
      }
      case 'expand': {
        var card = actionEl.closest('.upload-item, .entry, .rk-group, .rk-row, .rk-card, .acc__inner');
        if (card) card.classList.toggle('is-open');
        break;
      }
      case 'expand-acc': {
        var acc = actionEl.closest('.acc, .acc__inner');
        if (acc) acc.classList.toggle('is-open');
        break;
      }
      case 'expand-all': {
        var target = $(actionEl.getAttribute('data-target'));
        if (target) {
          var cards = $$('.rk-card', target);
          var anyClosed = cards.some(function (c) { return !c.classList.contains('is-open'); });
          cards.forEach(function (c) { c.classList.toggle('is-open', anyClosed); });
        }
        break;
      }
      case 'sort': {
        var host3 = $(actionEl.getAttribute('data-target'));
        if (host3) {
          var list3 = $('.upload-list', host3);
          if (list3) {
            var kids = Array.prototype.slice.call(list3.children).reverse();
            kids.forEach(function (k) { list3.appendChild(k); });
          }
          showToast('Urutan diubah: ' + (actionEl.textContent.indexOf('Terbaru') !== -1 ? 'Terlama lebih dulu' : 'Terbaru lebih dulu') + ' (pratinjau).', 'info');
        }
        break;
      }
      case 'clear-filter': {
        var tgt = $(actionEl.getAttribute('data-target'));
        if (tgt) {
          $$('[data-search]', tgt).forEach(function (el) { el.classList.remove('is-hidden'); });
          var empty3 = $('[data-empty-for="' + actionEl.getAttribute('data-target') + '"]');
          if (empty3) empty3.classList.add('is-hidden');
        }
        break;
      }
      case 'print': window.print(); break;
      case 'toast':
        showToast(actionEl.getAttribute('data-toast') || 'Aksi dijalankan (pratinjau).');
        break;
      default:
        break;
    }
  });

  /* Input filter */
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.matches && el.matches('[data-filter]')) {
      applySearch(el.getAttribute('data-filter'), el.value);
    }
    if (el.id === 'cmd-input') {
      renderCmd(el.value);
    }
  });

  /* Select filter */
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.matches && el.matches('[data-status-filter]')) {
      applyStatusFilter(el.getAttribute('data-status-filter'), el.value);
    }
    if (el.matches && el.matches('[data-card-filter]')) {
      applySelectFilter(el.getAttribute('data-card-filter'), el.value);
    }
  });

  /* Login submit */
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    var btn = $('#login-submit');
    if (btn) {
      btn.classList.add('is-disabled');
      btn.innerHTML = window.ui.ic('refresh', 'spin') + 'Memverifikasi…';
    }
    setTimeout(function () {
      var home = PERSONA[state.role].home;
      go(home, { setRole: false });
      showToast('Selamat datang, <b>' + PERSONA[state.role].name + '</b>.', 'success', 'Masuk berhasil');
    }, 700);
  });

  /* Modal: klik backdrop */
  $('#modal-root').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  $('#cmd-root').addEventListener('click', function (e) {
    if (e.target === this) closeCmd();
  });

  /* Escape + shortcut */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($('#cmd-root').classList.contains('is-open')) closeCmd();
      else if ($('#modal-root').classList.contains('is-open')) closeModal();
      else if ($('#notif-panel').classList.contains('is-open')) $('#notif-panel').classList.remove('is-open');
      document.body.classList.remove('sb-open');
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if ($('#cmd-root').classList.contains('is-open')) closeCmd();
      else openCmd();
    }
  });

  document.addEventListener('click', function (e) {
    var panel = $('#notif-panel');
    if (!panel || !panel.classList.contains('is-open')) return;
    if (e.target.closest('#notif-panel') || e.target.closest('#notif-btn')) return;
    panel.classList.remove('is-open');
    var btn = $('#notif-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    persist();
    applyTheme();
    showToast('Tema <b>' + (state.theme === 'dark' ? 'gelap' : 'terang') + '</b> aktif.', 'info');
  }

  /* ── Boot ───────────────────────────────────────────────── */
  function boot() {
    applyTheme();
    renderNotif();
    buildCmdItems();
    renderPersona();
    if (!META[state.screen]) state.screen = 'login';
    go(state.screen, { setRole: !!META[state.screen] && META[state.screen].role !== 'auth' && META[state.screen].role !== 'all' && PERSONA[META[state.screen].role] ? false : false });
  }

  boot();
})();
