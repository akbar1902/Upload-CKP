/* ============================================================
   SIKAP — Redesign Preview
   screens-admin.js : layar administrasi + analitik + komponen
   (kepegawaian, RK, import RK, periode, log, analitik,
    galeri komponen & status)
   ============================================================ */

(function () {
  var u = window.ui;
  var ic = u.ic, badge = u.badge, avatar = u.avatar, progress = u.progress, ring = u.ring;
  var pageHead = u.pageHead, sectionHead = u.sectionHead, alertBox = u.alertBox;
  var stat = u.stat, emptyState = u.emptyState, select = u.select, sparkline = u.sparkline, evidence = u.evidence;
  var person = u.person;

  /* ─────────────────────────────────────────────────────────
     KEPEGAWAIAN (admin)
     ───────────────────────────────────────────────────────── */
  var users = [
    { name: 'Dwi Lestari', nip: '199203142015022003', email: 'dwi.lestari@bps.go.id', role: 'Pegawai', jabatan: 'Statistisi Ahli Muda', gol: 'III/b', active: true },
    { name: 'Fajar Nugroho', nip: '199008222014031005', email: 'fajar.nugroho@bps.go.id', role: 'Pegawai', jabatan: 'Statistisi Mahir', gol: 'II/d', active: true },
    { name: 'Aditya Pratama', nip: '198711052012011004', email: 'aditya.pratama@bps.go.id', role: 'Ketua Tim', managed: 'Statistik Sosial', jabatan: 'Statistisi Ahli Madya', gol: 'III/d', active: true },
    { name: 'Intan Permata', nip: '199404112017022004', email: 'intan.permata@bps.go.id', role: 'Pegawai', jabatan: 'Statistisi Ahli Pertama', gol: 'III/a', active: true },
    { name: 'Nurul Aini', nip: '198903182013012003', email: 'nurul.aini@bps.go.id', role: 'Ketua Tim', managed: 'Statistik Produksi', jabatan: 'Statistisi Ahli Muda', gol: 'III/c', active: true },
    { name: 'Dra. Radina Kartika', nip: '197505121999032001', email: 'radina.kartika@bps.go.id', role: 'Pimpinan', jabatan: 'Kepala BPS Kabupaten Belitung', gol: 'IV/b', active: true },
    { name: 'Yoga Prasetyo', nip: '199001172014031002', email: 'yoga.prasetyo@bps.go.id', role: 'Admin', jabatan: 'Pranata Komputer Ahli Pertama', gol: 'III/a', active: true },
    { name: 'Maya Sari', nip: '199510302018012006', email: 'maya.sari@bps.go.id', role: 'Pegawai', jabatan: 'Statistisi Ahli Muda', gol: 'III/c', active: false }
  ];

  function kepegawaian() {
    var rows = users.map(function (x) {
      var roleBadge = x.role === 'Ketua Tim'
        ? '<span class="badge badge--teal">' + ic('users') + 'Ketua Tim — ' + x.managed + '</span>'
        : x.role === 'Pimpinan'
          ? '<span class="badge badge--gold">' + ic('shield') + 'Pimpinan</span>'
          : x.role === 'Admin'
            ? '<span class="badge badge--info">' + ic('server') + 'Admin</span>'
            : '<span class="badge badge--muted">' + ic('user') + 'Pegawai</span>';
      return '<tr data-search="' + x.name + ' ' + x.nip + ' ' + x.email + ' ' + x.jabatan + ' ' + x.role + '" style="' + (x.active ? '' : 'opacity:.62') + '">' +
        '<td><div class="row" style="gap:11px;min-width:0">' + avatar(x.name) +
          '<div style="min-width:0"><div class="strong small">' + x.name + '</div>' +
          '<div class="tiny muted">' + x.nip + ' &bull; ' + x.email + '</div>' +
          '<div class="tiny" style="color:var(--teal);margin-top:2px">' + ic('briefcase') + ' ' + x.jabatan + ' <span class="muted">(' + x.gol + ')</span></div></div></div></td>' +
        '<td>' + roleBadge + '</td>' +
        '<td class="center">' + (x.active
          ? '<span class="badge badge--approved"><span class="pulse"></span>Aktif</span>'
          : '<span class="badge badge--muted"><span class="pulse"></span>Non-Aktif</span>') + '</td>' +
        '<td><div class="table-actions row-actions">' +
          '<button class="icon-btn" title="Edit profil &amp; jabatan" data-action="modal" data-modal="edit-employee">' + ic('pencil') + '</button>' +
          (x.role === 'Ketua Tim' && x.active ? '<button class="icon-btn" title="Ganti Ketua Tim" data-action="modal" data-modal="replace-ketua">' + ic('swap') + '</button>' : '') +
          '<button class="icon-btn" title="' + (x.active ? 'Nonaktifkan akun' : 'Aktifkan akun') + '" data-action="modal" data-modal="toggle-employee">' + (x.active ? ic('x') : ic('check')) + '</button>' +
          '<button class="icon-btn" title="Reset password ke default" data-action="modal" data-modal="reset-password">' + ic('key') + '</button>' +
          '<button class="icon-btn" title="Hapus permanen" data-action="modal" data-modal="delete-employee">' + ic('trash') + '</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    return '' +
    pageHead({
      eyebrow: 'Manajemen Kepegawaian',
      title: 'Akun &amp; peran <em>pegawai.</em>',
      sub: '8 dari 32 akun ditampilkan &middot; aktif diurutkan paling atas',
      actions:
        '<div class="search-field" style="width:250px">' + ic('search') + '<input type="search" placeholder="Cari nama, NIP, email…" data-filter="#user-table" /></div>' +
        '<button class="btn btn-secondary" data-action="modal" data-modal="replace-ketua">' + ic('swap') + 'Ganti Ketua Tim</button>' +
        '<button class="btn btn-primary" data-action="modal" data-modal="add-employee">' + ic('plus') + 'Tambah Pegawai</button>'
    }) +

    alertBox({ tone: 'info', icon: 'shield', title: 'Akun &amp; selera data', text: 'Menghapus pegawai juga menghapus seluruh upload, entri, approval, dan riwayat CKP-nya. Nonaktifkan akun untuk memblokir akses tanpa kehilangan data.' }) +

    '<div class="card"><div class="table-wrap" style="border:0"><table class="data" id="user-table"><thead><tr>' +
      '<th>Pegawai</th><th>Peran (Role)</th><th class="center">Status Akun</th><th class="text-right">Tindakan</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="card-foot"><span class="tiny muted">Menampilkan 8 akun</span><span class="tiny muted">Reset password default: <b>Password123!</b></span></div></div>' +

    '<div class="empty is-hidden" data-empty-for="#user-table"><span class="empty__icon">' + ic('search') + '</span>' +
      '<div class="empty__title">Tidak ada pegawai ditemukan</div><div class="empty__text">Coba gunakan kata kunci pencarian yang lain.</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     RENCANA KINERJA (admin &amp; read-only)
     ───────────────────────────────────────────────────────── */
  var rkTeams = [
    {
      team: 'Statistik Sosial', accent: '#0F766E',
      items: [
        { rk: 'Meningkatnya kualitas data statistik sosial', ketua: 'Aditya Pratama', subs: ['Pendataan lapangan Survei Sosial Ekonomi Nasional (Susenas)', 'Rekonsiliasi data hasil pendataan dengan Dinas Sosial', 'Supervisi petugas pendataan kecamatan', 'Pelaporan harian progres pendataan'] },
        { rk: 'Penguatan metadata statistik', ketua: 'Aditya Pratama', subs: ['Penyusunan kamus variabel kegiatan statistik', 'Validasi struktur data kegiatan statistik', 'Pemutakhiran direktori usaha dan perusahaan'] }
      ]
    },
    {
      team: 'Statistik Produksi', accent: '#8A6F4E',
      items: [
        { rk: 'Tersedianya data statistik produksi yang akurat dan tepat waktu', ketua: 'Nurul Aini', subs: ['Pendataan Survei Pertanian', 'Pengolahan data produksi padi dan palawija', 'Uji kualitas data produksi'] },
        { rk: 'Peningkatan kualitas data industri dan konstruksi', ketua: 'Nurul Aini', subs: ['Pendataan industri mikro dan kecil', 'Verifikasi data konstruksi triwulanan'] }
      ]
    },
    {
      team: 'Distribusi &amp; Jasa', accent: '#C96F4F',
      items: [
        { rk: 'Peningkatan diseminasi dan layanan data statistik', ketua: 'Rizky Hidayat', subs: ['Penyusunan bahan rilis Berita Resmi Statistik', 'Diseminasi data melalui kanal resmi BPS', 'Layanan konsultasi statistik daring'] }
      ]
    }
  ];

  function rkManagement(canEdit) {
    var stats = [
      { label: 'Tim Kerja', value: 14 },
      { label: 'RK Utama', value: 28 },
      { label: 'Sub-RK Anggota', value: 112 },
      { label: 'Ketua Tim', value: 14 }
    ];
    return '' +
    pageHead({
      eyebrow: canEdit ? 'Manajemen Rencana Kinerja' : 'Rencana Kinerja',
      title: canEdit ? 'Peta RK per <em>tim kerja.</em>' : 'Rencana kinerja <em>Anda.</em>',
      sub: 'Daftar Rencana Kinerja Utama, Sub-RK Anggota, dan Tim Kerja per tahun.',
      actions: canEdit
        ? '<button class="btn btn-secondary" data-screen="import-rk">' + ic('sheet') + 'Upload Dataset / Excel</button>' +
          '<button class="btn btn-primary" data-action="modal" data-modal="add-rk">' + ic('plus') + 'Tambah RK</button>'
        : '<button class="btn btn-secondary" data-action="toast" data-toast="RK disalin ke papan kerja (pratinjau).">' + ic('copy') + 'Salin daftar</button>'
    }) +

    '<div class="stat-grid">' + stats.map(function (s) {
      return '<div class="stat" style="padding:16px 18px"><div class="stat__top"><div class="stat__label">' + s.label + '</div></div>' +
        '<div class="stat__value" style="font-size:32px">' + s.value + '</div></div>';
    }).join('') + '</div>' +

    '<div class="card mb-4"><div class="card-body">' +
      '<div class="toolbar">' +
        '<div class="search-field" style="flex:1;min-width:260px">' + ic('search') + '<input type="search" placeholder="Cari RK, tim kerja, ketua tim, atau Sub-RK…" data-filter="#rk-teams" /></div>' +
        select([{ value: '', label: 'Semua Tim Kerja' }, { value: 'sosial', label: 'Statistik Sosial' }, { value: 'produksi', label: 'Statistik Produksi' }, { value: 'distribusi', label: 'Distribusi &amp; Jasa' }], '', 'data-card-filter="#rk-teams" style="width:220px;height:42px"') +
        '<button class="icon-btn" data-action="toast" data-toast="Memuat ulang data RK (pratinjau)." title="Muat ulang">' + ic('refresh') + '</button>' +
      '</div>' +
      '<div class="row mt-3"><span class="tiny strong muted">Tahun</span>' +
        '<button class="chip is-active">2026 <span class="count">Aktif</span></button>' +
        '<button class="chip">2025</button><button class="chip">2024</button>' +
        (canEdit ? '<button class="btn btn-sm btn-danger" style="margin-left:auto" data-action="modal" data-modal="delete-year">' + ic('trash') + 'Hapus tahun 2025</button>' : '') +
      '</div>' +
      alertBox({ tone: 'warning', icon: 'archive', title: 'Mode arsip 2025', text: 'Data arsip tetap tersimpan dan tidak dipakai pada penilaian tahun berjalan.' }) +
    '</div></div>' +

    '<div id="rk-teams" class="stack">' +
      rkTeams.map(function (t, ti) {
        return '<section class="rk-section" data-search="' + t.team + ' ' + t.items.map(function (i) { return i.rk; }).join(' ') + '">' +
          '<div class="rk-section__head"><span class="rk-section__dot" style="background:' + t.accent + '"></span>' +
            '<span class="rk-section__title">' + t.team + '</span>' +
            '<span class="rk-section__meta">' + t.items.length + ' RK &middot; ' + t.items.reduce(function (n, i) { return n + i.subs.length; }, 0) + ' Sub-RK</span>' +
            '<button class="btn btn-sm btn-secondary" style="margin-left:auto" data-action="expand-all" data-target="#rk-teams">' + ic('chevron-down') + 'Buka semua</button>' +
          '</div>' +
          '<div class="rk-cards">' +
            t.items.map(function (r, ri) {
              return '<article class="rk-card' + (ti === 0 && ri === 0 ? ' is-open' : '') + '" style="--team-accent:' + t.accent + '" data-search="' + r.rk + ' ' + r.ketua + ' ' + r.subs.join(' ') + '">' +
                '<div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px">' +
                  '<div class="rk-card__title">' + r.rk + '</div>' +
                  (canEdit ? '<div class="row row--tight">' +
                    '<button class="icon-btn" data-action="modal" data-modal="add-sub-rk" title="Tambah Sub-RK">' + ic('plus') + '</button>' +
                    '<button class="icon-btn" data-action="modal" data-modal="delete-rk" title="Hapus RK">' + ic('trash') + '</button></div>' : '') +
                '</div>' +
                '<div class="rk-card__meta">' +
                  '<span class="row row--tight" style="gap:6px">' + avatar(r.ketua, 'avatar--sm') + r.ketua + '</span>' +
                  '<span>&middot;</span><span class="tnum">' + r.subs.length + ' Sub-RK</span>' +
                '</div>' +
                '<button class="btn btn-sm btn-secondary btn-block mt-3" data-action="expand">' + ic('chevron-down') + 'Lihat ' + r.subs.length + ' kegiatan</button>' +
                '<div class="rk-sub-list">' +
                  r.subs.map(function (s, si) {
                    return '<div class="rk-sub"><span class="rk-sub__idx">' + String(si + 1).padStart(2, '0') + '</span>' +
                      '<span style="min-width:0">' + s + '</span>' +
                      (canEdit ? '<span class="rk-sub__actions">' +
                        '<button class="icon-btn" data-action="modal" data-modal="move-sub-rk" title="Pindah induk RK">' + ic('swap') + '</button>' +
                        '<button class="icon-btn" data-action="modal" data-modal="delete-rk" title="Hapus Sub-RK">' + ic('trash') + '</button></span>' : '') +
                    '</div>';
                  }).join('') +
                '</div>' +
              '</article>';
            }).join('') +
          '</div>' +
        '</section>';
      }).join('') +
    '</div>' +
    '<div class="empty is-hidden" data-empty-for="#rk-teams"><span class="empty__icon">' + ic('search') + '</span>' +
      '<div class="empty__title">Tidak ada Rencana Kinerja</div><div class="empty__text">Ubah filter tahun/tim atau kata kunci, atau tambahkan RK baru.</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     IMPORT RK
     ───────────────────────────────────────────────────────── */
  function importRk() {
    return '' +
    '<div class="row mb-3"><button class="btn btn-sm btn-ghost" data-screen="manajemen-rk">' + ic('arrow-left') + 'Kembali</button></div>' +
    pageHead({
      eyebrow: 'Import Rencana Kinerja &middot; tahun 2026',
      title: 'Muat <em>dataset</em> RK tahunan.',
      sub: 'Unggah Dataset RK (.zip) tahunan, atau Excel/JSON RK Utama + Sub-RK.',
      actions: '<button class="btn btn-ink" data-action="modal" data-modal="import-confirm">' + ic('database') + 'Simpan ke Database</button>'
    }) +

    '<div class="card mb-4"><div class="card-body">' +
      '<div class="toolbar" style="justify-content:space-between">' +
        '<div class="row"><span class="stat__icon stat__icon--sage">' + ic('check-circle') + '</span>' +
          '<div><div class="strong small">Dataset RK terbaca</div><div class="tiny muted">14 tim &middot; 28 RK Ketua Tim &middot; 112 Sub-RK</div></div></div>' +
        '<div class="row row--tight">' +
          '<button class="btn btn-secondary" data-action="toast" data-toast="Dataset dibatalkan (pratinjau).">' + ic('x') + 'Batal</button>' +
          '<button class="btn btn-secondary" data-action="toast" data-toast="Dry-run selesai: 28 RK, 112 Sub-RK, 134 penugasan akan diproses.">' + ic('play') + 'Periksa (dry-run)</button>' +
          '<button class="btn btn-primary" data-action="modal" data-modal="import-confirm">' + ic('database') + 'Simpan ke Database</button>' +
        '</div>' +
      '</div>' +
      '<div class="mt-3">' + alertBox({ tone: 'warning', icon: 'alert', title: '2 peringatan parse', text: 'Nama ketua tim tidak ditemukan pada 1 file; baris tanpa Sub-RK dilewati otomatis.' }) + '</div>' +
    '</div></div>' +

    '<div class="card mb-4"><div class="card-head"><div class="card-head__main"><div class="card-title">Preview Per Tim</div>' +
      '<div class="card-desc">Hasil pembacaan file Dataset RK.zip (sheet Matriks)</div></div></div>' +
      '<div class="table-wrap" style="border:0"><table class="data"><thead><tr>' +
        '<th>Tim (nama file)</th><th>Ketua Tim</th><th class="num">RK Ketua</th><th class="num">Sub-RK</th>' +
      '</tr></thead><tbody>' +
      [['01_Statistik_Sosial.xlsx', 'Aditya Pratama', 2, 7],
       ['02_Statistik_Produksi.xlsx', 'Nurul Aini', 2, 5],
       ['03_Distribusi_Jasa.xlsx', 'Rizky Hidayat', 2, 6],
       ['04_Neraca_Wilayah.xlsx', 'Sari Melati', 2, 8],
       ['05_Umum.xlsx', '&mdash;', 2, 4]].map(function (r) {
        return '<tr><td class="strong" style="color:var(--teal)">' + r[0] + '</td><td>' + r[1] + '</td>' +
          '<td class="num">' + r[2] + '</td><td class="num">' + r[3] + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
    '</div>' +

    '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Laporan Impor &mdash; Tahun 2026</div>' +
      '<div class="card-desc">Ringkasan dampak sebelum penyimpanan final</div></div><span class="badge badge--gold">dry-run (belum disimpan)</span></div>' +
      '<div class="card-body">' +
        '<div class="grid-4">' +
          ['Tim|14', 'RK Ketua Tim|28', 'Sub-RK Anggota|112', 'Penugasan|134'].map(function (x) {
            var p = x.split('|');
            return '<div class="card" style="box-shadow:none;background:var(--surface-2)"><div class="card-body">' +
              '<div class="mini-label">' + p[0] + '</div><div class="stat__value" style="font-size:30px;margin-top:4px">' + p[1] + '</div></div></div>';
          }).join('') +
        '</div>' +
        '<div class="mt-3">' + alertBox({ tone: 'plain', icon: 'info', title: '3 RK ketua tim dipertahankan', text: 'Mapping ketua tim tidak ditimpa oleh dataset; pegawai tidak ditemukan akan dilewati.' }) + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="card mt-4"><div class="card-head"><div class="card-head__main"><div class="card-title">Sumber Data Lain</div>' +
      '<div class="card-desc">Format alternatif bila tidak memakai Dataset RK.zip</div></div></div>' +
      '<div class="card-body">' +
        '<div class="tabs mb-3" data-tab-group="import">' +
          '<button class="tab is-active" data-tab="zip">Dataset RK (.zip)</button>' +
          '<button class="tab" data-tab="excel">Upload via Excel</button>' +
          '<button class="tab" data-tab="json">Upload via JSON</button>' +
        '</div>' +
        '<div class="tab-pane is-active" data-tab-pane="zip">' +
          '<div class="row"><div class="field" style="width:140px"><label>Tahun RK</label><input class="input" value="2026" /></div>' +
          '<button class="btn btn-primary" style="align-self:flex-end" data-action="toast" data-toast="Pilih Dataset RK.zip (pratinjau).">' + ic('upload') + 'Pilih Dataset RK.zip</button></div>' +
        '</div>' +
        '<div class="tab-pane" data-tab-pane="excel">' +
          '<p class="small muted mb-3">Gunakan template standar agar sistem membaca data dengan benar. Kolom wajib: <b>Tim Kerja</b> dan <b>RK Utama</b>.</p>' +
          '<div class="row row--tight"><button class="btn btn-secondary" data-action="toast" data-toast="Template Excel diunduh (pratinjau).">' + ic('download') + 'Download Template</button>' +
          '<button class="btn btn-primary" data-action="toast" data-toast="Pilih file Excel (pratinjau).">' + ic('upload') + 'Pilih File Excel</button></div>' +
        '</div>' +
        '<div class="tab-pane" data-tab-pane="json">' +
          '<pre class="mono tiny" style="background:var(--surface-3);padding:14px;border-radius:12px;overflow:auto">[\n  {\n    "tim_kerja": "Statistik Sosial",\n    "rk_utama": "Terlaksananya Survei Nasional",\n    "sub_rk": "Melakukan pendataan lapangan"\n  }\n]</pre>' +
          '<button class="btn btn-primary mt-2" data-action="toast" data-toast="Pilih file JSON (pratinjau).">' + ic('upload') + 'Pilih File JSON</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     PENGATURAN PERIODE
     ───────────────────────────────────────────────────────── */
  function pengaturanPeriode() {
    var locked = { 9: true, 10: true, 11: true };
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var cards = months.map(function (m, i) {
      var isLocked = !!locked[i + 1];
      return '<div class="periode-card">' +
        '<div class="periode-card__top"><div>' +
          '<div class="periode-card__month">' + m + ' 2026</div>' +
          '<div class="periode-card__state">Status: <b>' + (isLocked ? 'Terkunci' : 'Terbuka') + '</b></div>' +
        '</div>' +
        '<span class="lock-orb ' + (isLocked ? 'lock-orb--locked' : 'lock-orb--open') + '">' + ic(isLocked ? 'lock' : 'unlock') + '</span></div>' +
        (isLocked ? '<div class="tiny muted">' + ic('user') + ' Dikunci oleh Yoga Prasetyo &middot; 01 ' + m.slice(0, 3) + ' 2026</div>' : '<div class="tiny muted">Pegawai dapat mengunggah &amp; mengubah CKP.</div>') +
        '<button class="btn ' + (isLocked ? 'btn-secondary' : 'btn-danger') + ' btn-block" data-action="modal" data-modal="lock-period">' +
          (isLocked ? ic('unlock') + 'Buka Periode' : ic('lock') + 'Kunci Periode') + '</button>' +
      '</div>';
    }).join('');

    return '' +
    pageHead({
      eyebrow: 'Pengaturan Periode CKP',
      title: 'Kunci periode, <em>jaga data.</em>',
      sub: 'Kunci atau buka periode agar pegawai tidak bisa mengunggah / mengubah CKP. Tanpa baris data = Terbuka.',
      actions: '<div style="width:120px">' + select([{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }, { value: '2027', label: '2027' }], '2026', 'style="height:40px"') + '</div>'
    }) +
    '<div class="stat-grid stat-grid--3">' +
      stat({ label: 'Periode Terbuka', value: '9', sub: 'dapat menerima unggahan', icon: 'unlock', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Periode Terkunci', value: '3', sub: 'September &ndash; November 2026', icon: 'lock', iconTone: 'stat__icon--coral', tone: 'stat--ink' }) +
      stat({ label: 'Total Periode', value: '12', sub: 'satu tahun anggaran', icon: 'calendar' }) +
    '</div>' +
    '<div class="periode-grid">' + cards + '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     LOG AKTIVITAS
     ───────────────────────────────────────────────────────── */
  function logAktivitas() {
    var logs = [
      { t: '18 Okt 2026 &middot; 09.41', u: 'Dwi Lestari', e: 'ckp_uploads', a: 'Unggah CKP Oktober 2026 (v2)' },
      { t: '18 Okt 2026 &middot; 09.12', u: 'Aditya Pratama', e: 'ckp_entries', a: 'Menyimpan nilai RK Statistik Sosial' },
      { t: '17 Okt 2026 &middot; 16.08', u: 'Dra. Radina Kartika', e: 'ckp_uploads', a: 'Menyetujui CKP September — Intan Permata' },
      { t: '17 Okt 2026 &middot; 14.55', u: 'Yoga Prasetyo', e: 'periode_ckp', a: 'Mengunci periode November 2026' },
      { t: '17 Okt 2026 &middot; 11.20', u: 'Nurul Aini', e: 'rencana_kinerja', a: 'Menambah Sub-RK Statistik Produksi' },
      { t: '16 Okt 2026 &middot; 15.37', u: 'Dra. Radina Kartika', e: 'ckp_uploads', a: 'Meminta revisi CKP Juli — Maya Sari' },
      { t: '16 Okt 2026 &middot; 10.02', u: 'Yoga Prasetyo', e: 'users', a: 'Menambah akun pegawai baru' },
      { t: '15 Okt 2026 &middot; 09.18', u: 'Fajar Nugroho', e: 'ckp_entries', a: 'Menandai kegiatan perlu diperbaiki' }
    ];
    var rows = logs.map(function (l) {
      return '<tr data-search="' + l.u + ' ' + l.a + ' ' + l.e + '">' +
        '<td class="tiny muted" style="white-space:nowrap">' + ic('clock') + ' ' + l.t + '</td>' +
        '<td>' + person(l.u, l.e) + '</td>' +
        '<td><span class="badge badge--muted">' + l.e + '</span></td>' +
        '<td>' + ic('activity') + ' ' + l.a + '</td>' +
      '</tr>';
    }).join('');

    return '' +
    pageHead({
      eyebrow: 'Log Aktivitas Sistem',
      title: 'Jejak audit yang <em>transparan.</em>',
      sub: 'Pantau aktivitas penting yang dilakukan pegawai dan pimpinan.',
      actions: '<button class="btn btn-secondary" data-action="toast" data-toast="Log aktivitas dimuat ulang (pratinjau).">' + ic('refresh') + 'Refresh</button>'
    }) +
    '<div class="card"><div class="card-body">' +
      '<div class="toolbar mb-3">' +
        '<div class="search-field" style="width:320px">' + ic('search') + '<input type="search" placeholder="Cari aktivitas atau nama user…" data-filter="#log-table" /></div>' +
        select([{ value: 'all', label: 'Semua Entitas' }, { value: 'ckp_uploads', label: 'CKP Uploads' }, { value: 'ckp_entries', label: 'CKP Entries (Nilai)' }, { value: 'rencana_kinerja', label: 'Rencana Kinerja' }, { value: 'users', label: 'Users' }, { value: 'periode_ckp', label: 'Periode CKP' }], 'all', 'data-card-filter="#log-table" style="width:210px;height:42px"') +
      '</div>' +
      '<div class="table-wrap" style="border:0"><table class="data" id="log-table"><thead><tr>' +
        '<th>Waktu</th><th>User</th><th>Entitas</th><th>Aksi</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="row mt-3" style="justify-content:space-between"><span class="tiny muted">Menampilkan 8 dari 200 log yang dimuat</span>' +
        '<span class="tiny muted">Server hanya memuat 200 log terbaru (limit query)</span></div>' +
    '</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     ANALITIK CKP
     ───────────────────────────────────────────────────────── */
  function trendChart() {
    var nilai = [86, 88, 84, 87, 90, 89, 91, 90, 92, 89, 91, 90];
    var progres = [78, 82, 80, 85, 88, 86, 90, 89, 91, 90, 92, 91];
    var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    var W = 860, H = 250, L = 38, R = 14, T = 16, B = 30;
    var iw = W - L - R, ih = H - T - B;
    var step = iw / (nilai.length - 1);
    var all = nilai.concat(progres);
    var lo = Math.floor((Math.min.apply(null, all) - 4) / 10) * 10;
    var hi = Math.ceil((Math.max.apply(null, all) + 2) / 10) * 10;
    function pts(arr) {
      return arr.map(function (v, i) {
        return [(L + i * step).toFixed(1), (T + (1 - (v - lo) / (hi - lo)) * ih).toFixed(1)];
      });
    }
    var p1 = pts(nilai), p2 = pts(progres);
    var line1 = p1.map(function (p) { return p.join(','); }).join(' ');
    var line2 = p2.map(function (p) { return p.join(','); }).join(' ');
    var area = 'M' + p1[0][0] + ',' + p1[0][1] + ' ' + p1.slice(1).map(function (p) { return 'L' + p[0] + ',' + p[1]; }).join(' ') +
      ' L' + p1[p1.length - 1][0] + ',' + (T + ih) + ' L' + p1[0][0] + ',' + (T + ih) + ' Z';
    var gridVals = [];
    for (var gv = lo; gv <= hi; gv += 10) gridVals.push(gv);
    var grid = gridVals.map(function (v) {
      var y = (T + (1 - (v - lo) / (hi - lo)) * ih).toFixed(1);
      return '<line x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y + '" stroke="var(--line-soft)" stroke-width="1"/>' +
        '<text x="' + (L - 8) + '" y="' + (+y + 4) + '" text-anchor="end" font-size="10" fill="var(--ink-4)">' + v + '</text>';
    }).join('');
    var xlabels = labels.map(function (l, i) {
      return '<text x="' + (L + i * step).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="var(--ink-4)">' + l + '</text>';
    }).join('');
    var dots = p1.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="var(--teal)"/>'; }).join('');

    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Tren rata-rata nilai dan progres 12 bulan">' +
      '<defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="var(--teal)" stop-opacity="0.18"/>' +
        '<stop offset="100%" stop-color="var(--teal)" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path d="' + area + '" fill="url(#areaFill)" stroke="none"/>' +
      '<polyline points="' + line2 + '" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 5" stroke-linecap="round"/>' +
      '<polyline points="' + line1 + '" fill="none" stroke="var(--teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      dots + xlabels +
    '</svg>';
  }

  function analitik() {
    var tunggakan = [
      { l: 'Aditya Pratama', v: 3 }, { l: 'Nurul Aini', v: 1 }, { l: 'Rizky Hidayat', v: 0 }, { l: 'Sari Melati', v: 2 }
    ];
    return '' +
    pageHead({
      eyebrow: 'Analitik CKP &middot; Oktober 2026',
      title: 'Angka yang <em>menjelaskan.</em>',
      sub: 'Oktober 2026 &middot; ringkasan, tren, dan tunggakan penilaian',
      actions:
        '<div class="row row--tight"><div style="width:140px">' + select([{ value: '10', label: 'Oktober' }, { value: 'T4', label: 'Triwulan IV' }], '10', 'style="height:40px"') + '</div>' +
        '<div style="width:92px">' + select([{ value: '2026', label: '2026' }], '2026', 'style="height:40px"') + '</div></div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Data analitik dimuat ulang (pratinjau)." title="Refresh">' + ic('refresh') + '</button>'
    }) +

    '<div class="stat-grid stat-grid--5">' +
      stat({ label: 'Pegawai Aktif', value: '32', sub: 'anggota &amp; ketua tim', icon: 'users' }) +
      stat({ label: 'Upload Periode', value: '26', sub: '26 pegawai melapor', icon: 'upload', iconTone: 'stat__icon--info' }) +
      stat({ label: 'Sudah Disetujui', value: '69<small>%</small>', sub: '18 dari 26 upload', icon: 'check-circle', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Rata-rata Progres', value: '91<small>%</small>', sub: 'capaian periode ini', icon: 'trending-up' }) +
      stat({ label: 'Rata-rata Nilai', value: '89,4', sub: 'penilaian ketua tim', icon: 'award', iconTone: 'stat__icon--gold', tone: 'stat--coral' }) +
    '</div>' +

    '<div class="grid-2 mb-4" style="grid-template-columns:2fr 1fr">' +
      '<div class="card chart-card"><div class="chart-head">' +
        '<div><div class="section-title">Tren 12 Bulan 2026</div><div class="section-sub">Rata-rata nilai vs rata-rata progres per bulan</div></div>' +
        '<div class="row row--tight"><span class="legend__item"><span class="legend__swatch" style="background:var(--teal)"></span>Rata-rata Nilai</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--gold)"></span>Rata-rata Progres</span></div>' +
      '</div>' + trendChart() + '</div>' +

      '<div class="card chart-card"><div class="section-title">Distribusi Status</div>' +
        '<div class="section-sub mb-3">Oktober 2026 &middot; 26 upload</div>' +
        '<div class="row" style="justify-content:center"><div class="ring" style="--p:69;width:158px;height:158px;--ring-color:var(--success)">' +
          '<div class="ring__center"><div class="ring__value">26</div><div class="ring__label">upload</div></div></div></div>' +
        '<div class="stack mt-3" style="gap:9px">' +
          '<div class="stackrow"><span class="l">Disetujui</span><div>' + progress(69, 'sage') + '</div><span class="v">18</span></div>' +
          '<div class="stackrow"><span class="l">Sudah Dinilai</span><div>' + progress(15, 'gold') + '</div><span class="v">4</span></div>' +
          '<div class="stackrow"><span class="l">Menunggu Review</span><div>' + progress(12, 'coral') + '</div><span class="v">3</span></div>' +
          '<div class="stackrow"><span class="l">Perlu Revisi</span><div>' + progress(8, 'coral') + '</div><span class="v">1</span></div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="grid-2 mb-4">' +
      '<div class="card chart-card"><div class="row" style="gap:9px"><span class="stat__icon">' + ic('clock') + '</span>' +
        '<div><div class="section-title">SLA Persetujuan 2026</div><div class="section-sub">Rata-rata waktu dari unggah sampai disetujui</div></div></div>' +
        '<div class="stat__value" style="font-size:clamp(30px,3vw,40px);margin-top:16px">4,2 <small>hari</small></div>' +
        '<div class="small muted mt-2">21 dari 26 upload approved memiliki data tanggal lengkap</div>' +
        '<div class="mt-3">' + u.sparkline([6, 5.5, 5, 4.8, 4.4, 4.2], 'var(--teal)', 'rgba(13,95,85,.12)') + '</div>' +
      '</div>' +
      '<div class="card chart-card"><div class="section-title">Tunggakan per Ketua Tim</div>' +
        '<div class="section-sub mb-3">Entri yang belum diberi nilai pada periode ini</div>' +
        '<div class="mini-bars">' + tunggakan.map(function (t) {
          var w = t.v === 0 ? 0 : Math.max(8, t.v * 22);
          return '<div class="mini-bar"><div><div class="mini-bar__label">' + t.l + '</div>' +
            '<div class="progress"><span style="width:' + w + '%;background:' + (t.v === 0 ? 'var(--success)' : 'var(--coral)') + '"></span></div></div>' +
            '<span class="mini-bar__val">' + (t.v === 0 ? 'Beres' : t.v + ' entri') + '</span></div>';
        }).join('') + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Beban &amp; Tunggakan per Ketua Tim</div>' +
      '<div class="card-desc">RK mapping tahun 2026 &middot; entri belum dinilai pada upload yang sudah dikirim</div></div></div>' +
      '<div class="table-wrap" style="border:0"><table class="data"><thead><tr>' +
        '<th>Ketua Tim</th><th class="num">RK Mapping</th><th class="num">Entri Belum Dinilai</th><th class="num">Upload Menunggu</th>' +
      '</tr></thead><tbody>' +
      [['Aditya Pratama', '198711052012011004', 6, 3, 2],
       ['Nurul Aini', '198903182013012003', 5, 1, 1],
       ['Rizky Hidayat', '199103212015031006', 5, 0, 0],
       ['Sari Melati', '199207142015022005', 4, 2, 2]].map(function (r) {
        return '<tr><td>' + person(r[0], 'NIP ' + r[1]) + '</td>' +
          '<td class="num">' + r[2] + '</td>' +
          '<td class="num" style="' + (r[3] > 0 ? 'color:var(--coral);font-weight:800' : 'color:var(--ink-3)') + '">' + r[3] + '</td>' +
          '<td class="num">' + r[4] + '</td></tr>';
      }).join('') +
      '</tbody></table></div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     GALERI KOMPONEN &amp; STATUS
     ───────────────────────────────────────────────────────── */
  function komponen() {
    var colors = [
      ['Teal', 'var(--teal)', '#0D5F55'], ['Deep Teal', 'var(--teal-deep)', '#083F38'],
      ['Coral', 'var(--coral)', '#BF5B3B'], ['Gold', 'var(--gold)', '#A8792B'],
      ['Sage', 'var(--sage)', '#5E7355'], ['Success', 'var(--success)', '#2C6A50'],
      ['Danger', 'var(--danger)', '#A5432F'], ['Info', 'var(--info)', '#2E6B78'],
      ['Canvas', 'var(--bg)', '#F4F2EB'], ['Surface', 'var(--surface)', '#FFFFFF'],
      ['Ink', 'var(--ink)', '#15211D'], ['Line', 'var(--line)', '#E3DFD3']
    ];
    return '' +
    pageHead({
      eyebrow: 'Panduan Visual',
      title: 'Komponen &amp; <em>status.</em>',
      sub: 'Token warna, tipografi, tombol, badge lifecycle, dan modal — semua fungsi lama tetap ada.'
    }) +

    '<div class="ds-grid mb-4">' +
      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Warna &amp; Token</div>' +
      '<div class="card-desc">Palet earthy-teal dipertahankan dengan permukaan netral yang lebih bersih.</div></div></div>' +
      '<div class="card-body"><div class="swatches">' + colors.map(function (c) {
        return '<div class="swatch"><div class="swatch__chip" style="background:' + c[1] + '"></div>' +
          '<div class="swatch__meta"><div class="swatch__name">' + c[0] + '</div><div class="swatch__val">' + c[2] + '</div></div></div>';
      }).join('') + '</div></div></div>' +

      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Tipografi</div>' +
      '<div class="card-desc">Instrument Serif untuk angka &amp; judul; Plus Jakarta Sans untuk UI.</div></div></div>' +
      '<div class="card-body"><div class="type-sample">' +
        '<div class="type-row"><div class="meta">Display / 44</div><div style="font-family:var(--font-display);font-size:42px;line-height:1">Capaian kinerja <em style="color:var(--teal)">bulanan</em></div></div>' +
        '<div class="type-row"><div class="meta">Heading / 20</div><div style="font-size:20px;font-weight:800">Daftar Rencana Kinerja</div></div>' +
        '<div class="type-row"><div class="meta">Body / 13,5</div><div style="font-size:13.5px;color:var(--ink-2)">Nilai berlaku untuk seluruh kegiatan pada Rencana Kinerja ini.</div></div>' +
        '<div class="type-row"><div class="meta">Label / 10</div><div class="mini-label" style="margin:0">TOTAL KEGIATAN</div></div>' +
        '<div class="type-row"><div class="meta">Mono / 12</div><div class="mono" style="font-size:12px">199203142015022003</div></div>' +
      '</div></div></div>' +
    '</div>' +

    '<div class="ds-grid mb-4">' +
      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Tombol</div>' +
      '<div class="card-desc">Primary, secondary, soft, danger, dan varian ikon.</div></div></div>' +
      '<div class="card-body stack">' +
        '<div class="row"><button class="btn btn-primary">' + ic('upload') + 'Upload CKP</button>' +
        '<button class="btn btn-secondary">' + ic('download') + 'Export</button>' +
        '<button class="btn btn-soft">' + ic('spark') + 'Nilai otomatis</button>' +
        '<button class="btn btn-danger">' + ic('trash') + 'Hapus</button>' +
        '<button class="btn btn-ink">' + ic('database') + 'Simpan</button></div>' +
        '<div class="row"><button class="btn btn-sm btn-primary">Small</button>' +
        '<button class="btn btn-lg btn-primary">Large</button>' +
        '<button class="btn btn-primary is-disabled" disabled>' + ic('lock') + 'Disabled</button>' +
        '<button class="icon-btn">' + ic('refresh') + '</button>' +
        '<button class="chip is-active">Filter aktif <span class="count">12</span></button>' +
        '<button class="chip">Filter</button></div>' +
        '<div class="row">' + ['eye', 'search', 'bell', 'key', 'logout', 'calendar', 'printer', 'archive', 'zap', 'pencil', 'swap', 'shield'].map(function (n) {
          return '<span class="icon-btn">' + ic(n) + '</span>';
        }).join('') + '</div>' +
      '</div></div>' +

      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Form &amp; Input</div>' +
      '<div class="card-desc">Termasuk input nilai 0&ndash;100 dengan simpan otomatis.</div></div></div>' +
      '<div class="card-body stack">' +
        '<div class="field"><label>Nama Rencana Kinerja</label><input class="input" value="Meningkatnya kualitas data statistik sosial" /></div>' +
        '<div class="grid-2"><div class="field"><label>Bulan</label>' + select([{ value: '10', label: 'Oktober' }], '10', 'style="height:42px"') + '</div>' +
        '<div class="field"><label>Tahun</label>' + select([{ value: '2026', label: '2026' }], '2026', 'style="height:42px"') + '</div></div>' +
        '<div class="field"><label>Catatan koreksi (wajib bila bukan approve)</label><textarea class="textarea" placeholder="Jelaskan kegiatan yang perlu diperbaiki…"></textarea></div>' +
        '<div class="row"><div class="field" style="width:110px"><label>Nilai RK</label><input class="score-input" value="92" /></div>' +
        '<span class="score-saved" style="display:inline-flex">' + ic('check-circle') + 'Tersimpan</span>' +
        '<div class="search-field" style="flex:1">' + ic('search') + '<input placeholder="Cari RK atau kegiatan…" /></div></div>' +
      '</div></div>' +
    '</div>' +

    '<div class="ds-grid">' +
      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Badge Status</div>' +
      '<div class="card-desc">Tujuh status lifecycle CKP.</div></div></div>' +
      '<div class="card-body stack">' +
        '<div class="row">' + badge('draft') + badge('submitted') + badge('scored') + badge('approved') + badge('rejected') + badge('revision_required') + badge('superseded') + '<span class="badge badge--none">Belum Lapor</span></div>' +
        '<div class="flow">' +
          '<span class="flow__node">Draft</span><span class="flow__arrow">' + ic('arrow-right') + '</span>' +
          '<span class="flow__node flow__node--info">Menunggu Review</span><span class="flow__arrow">' + ic('arrow-right') + '</span>' +
          '<span class="flow__node flow__node--warn">Sudah Dinilai</span><span class="flow__arrow">' + ic('arrow-right') + '</span>' +
          '<span class="flow__node flow__node--ok">Disetujui</span>' +
        '</div>' +
        '<div class="flow">' +
          '<span class="flow__node flow__node--bad">Ditolak</span>' +
          '<span class="flow__node flow__node--bad">Perlu Revisi</span>' +
          '<span class="flow__node">Diganti (Arsip)</span>' +
          '<span class="flow__node flow__node--warn">Dibuka Kembali</span>' +
        '</div>' +
        '<div class="tiny muted">Status upload &amp; approval dihitung ulang otomatis: masih ada entri null &rarr; submitted; semua bernilai &rarr; scored.</div>' +
      '</div></div>' +

      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Alert, Progress &amp; Modal</div>' +
      '<div class="card-desc">Termasuk modal persetujuan, ganti password, dan komando cepat.</div></div></div>' +
      '<div class="card-body stack">' +
        alertBox({ tone: 'info', icon: 'info', title: 'Info', text: 'Periode CKP terbuka untuk diunggah.' }) +
        alertBox({ tone: 'attention', icon: 'clock', title: 'Perhatian', text: 'CKP menunggu review ketua tim.' }) +
        alertBox({ tone: 'danger', icon: 'alert', title: 'Bahaya', text: 'CKP perlu revisi sebelum dapat dinilai ulang.' }) +
        alertBox({ tone: 'danger', icon: 'lock', title: 'Periode dikunci', text: 'Pegawai tidak dapat mengunggah / mengubah CKP pada periode ini.' }) +
        alertBox({ tone: 'warning', icon: 'alert', title: 'Pegawai belum mengunggah CKP', text: 'Dokumen evaluasi menampilkan struktur kosong sampai CKP diunggah.' }) +
        '<div><div class="row" style="justify-content:space-between"><span class="tiny muted">Progres kegiatan</span><span class="strong tnum">78%</span></div>' +
        '<div class="mt-1">' + progress(78, 'gold') + '</div></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" data-action="modal" data-modal="approval">' + ic('check-circle') + 'Modal Persetujuan</button>' +
          '<button class="btn btn-secondary" data-action="modal" data-modal="reopen">' + ic('unlock') + 'Buka Kembali</button>' +
          '<button class="btn btn-secondary" data-action="modal" data-modal="change-password">' + ic('key') + 'Ganti Password</button>' +
          '<button class="btn btn-secondary" data-action="cmd">' + ic('search') + 'Command Palette</button>' +
          '<button class="btn btn-secondary" data-action="index">' + ic('grid') + 'Daftar Layar</button>' +
          '<button class="btn btn-secondary" data-action="modal" data-modal="upload-progress">' + ic('upload') + 'Progress Upload</button>' +
        '</div>' +
        '<hr class="hr" />' +
        '<div class="section-title">Mode Triwulan (T1&ndash;T4)</div>' +
        '<div class="tiny muted">Agregasi 3 bulan per pegawai; nilai triwulan terkunci dan dinilai per bulan.</div>' +
        '<div class="grid-3 mt-2">' +
          [['Januari', '24 kegiatan', '90'], ['Februari', '26 kegiatan', '92'], ['Maret', '22 kegiatan', '91']].map(function (m) {
            return '<div class="card" style="box-shadow:none;background:var(--teal-tint)"><div class="card-body" style="padding:13px">' +
              '<div class="strong small">' + m[0] + '</div><div class="tiny muted">' + m[1] + '</div>' +
              '<div class="stat__value" style="font-size:26px;margin-top:6px">' + m[2] + '</div></div></div>';
          }).join('') +
        '</div>' +
        '<div class="row mt-2"><span class="badge badge--gold">' + ic('lock') + 'Nilai triwulan terkunci</span>' +
        '<span class="badge badge--teal">' + ic('layers') + 'Triwulan I (Jan&ndash;Mar)' + '</span></div>' +
      '</div></div>' +
    '</div>';
  }

  window.SIKAP_SCREENS = Object.assign(window.SIKAP_SCREENS || {}, {
    'kepegawaian': { content: kepegawaian },
    'manajemen-rk': { content: function () { return rkManagement(true); } },
    'rencana-kinerja': { content: function () { return rkManagement(false); } },
    'import-rk': { content: importRk },
    'pengaturan-periode': { content: pengaturanPeriode },
    'log-aktivitas': { content: logAktivitas },
    'analitik': { content: analitik },
    'komponen': { content: komponen }
  });
})();
