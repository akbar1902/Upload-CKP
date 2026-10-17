/* ============================================================
   SIKAP — Redesign Preview
   screens-review.js : layar ketua tim, penilaian, pimpinan
   (dashboard ketua tim, detail RK, penilaian CKP,
    dashboard pimpinan + admin, persetujuan cepat,
    monitoring penilaian, direktori & detail pegawai)
   ============================================================ */

(function () {
  var u = window.ui;
  var ic = u.ic, badge = u.badge, avatar = u.avatar, progress = u.progress, ring = u.ring;
  var pageHead = u.pageHead, sectionHead = u.sectionHead, alertBox = u.alertBox;
  var stat = u.stat, emptyState = u.emptyState, select = u.select, sparkline = u.sparkline, evidence = u.evidence;
  var person = u.person;

  /* ─────────────────────────────────────────────────────────
     DASHBOARD KETUA TIM
     ───────────────────────────────────────────────────────── */
  var ketuaRks = [
    { rk: 'Meningkatnya kualitas data statistik sosial', team: 'Statistik Sosial', pegawai: 8, entries: 42, score: '91,2', state: 'selesai' },
    { rk: 'Tersedianya data statistik produksi yang akurat dan tepat waktu', team: 'Statistik Produksi', pegawai: 5, entries: 28, score: '87,4', state: 'perlu' },
    { rk: 'Penguatan metadata statistik', team: 'Statistik Sosial', pegawai: 4, entries: 16, score: null, state: 'belum' },
    { rk: 'Peningkatan diseminasi dan layanan data statistik', team: 'Distribusi &amp; Jasa', pegawai: 6, entries: 24, score: '88,9', state: 'perlu' },
    { rk: 'Pengelolaan kepegawaian dan organisasi', team: 'Umum', pegawai: 3, entries: 12, score: '90,1', state: 'selesai' },
    { rk: 'Perencanaan, penganggaran, dan pelaporan kinerja', team: 'Umum', pegawai: 4, entries: 18, score: null, state: 'belum' }
  ];

  function rkCard(r) {
    var accent = r.state === 'selesai' ? 'var(--success)' : r.state === 'perlu' ? 'var(--coral)' : 'var(--line-strong)';
    var stateBadge = r.state === 'selesai'
      ? '<span class="badge badge--approved">' + ic('check-circle') + 'Selesai Dinilai</span>'
      : r.state === 'perlu'
        ? '<span class="badge badge--submitted">' + ic('clock') + 'Perlu Dinilai</span>'
        : '<span class="badge badge--muted">' + ic('inbox') + 'Belum Ada Laporan</span>';
    return '<a class="rk-card" href="#" data-screen="detail-rk" style="--team-accent:' + accent + ';text-decoration:none">' +
      '<div class="row" style="justify-content:space-between;align-items:flex-start">' +
        '<span class="badge badge--muted">' + ic('users') + r.team + '</span>' + stateBadge +
      '</div>' +
      '<div class="rk-card__title mt-2">' + r.rk + '</div>' +
      '<div class="row mt-3" style="justify-content:space-between;border-top:1px solid var(--line-soft);padding-top:13px">' +
        '<div class="row" style="gap:22px">' +
          '<div><div class="mini-label">Pegawai</div><div class="mini-value">' + r.pegawai + '</div></div>' +
          '<div><div class="mini-label">Kegiatan</div><div class="mini-value">' + r.entries + '</div></div>' +
          '<div><div class="mini-label">Rata2 Nilai</div><div class="mini-value" style="color:' + (r.score ? 'var(--teal)' : 'var(--ink-4)') + '">' + (r.score || '&mdash;') + '</div></div>' +
        '</div>' +
        '<span class="stat__icon" style="width:34px;height:34px">' + ic('arrow-right') + '</span>' +
      '</div>' +
    '</a>';
  }

  function dashboardKetua() {
    return '' +
    pageHead({
      eyebrow: 'Dashboard Ketua Tim &middot; Oktober 2026',
      title: 'Rencana kinerja yang <em>Anda nilai.</em>',
      sub: 'Oktober 2026 <span class="dot"></span> 6 RK &middot; 2 menunggu penilaian',
      actions:
        '<button class="btn btn-secondary" data-action="toast" data-toast="Rekap nilai RK berhasil diekspor ke Excel (pratinjau).">' + ic('download') + 'Export Rekap</button>' +
        '<div class="row row--tight">' +
          '<div style="width:190px">' + select([{ value: 'T4', label: 'Triwulan IV (Okt-Des)' }, { value: '10', label: 'Oktober' }, { value: '9', label: 'September' }], '10', 'style="height:40px"') + '</div>' +
          '<div style="width:96px">' + select([{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }], '2026', 'style="height:40px"') + '</div>' +
        '</div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Data periode dimuat ulang (pratinjau)." title="Muat ulang">' + ic('refresh') + '</button>'
    }) +

    alertBox({
      tone: 'attention', icon: 'clock',
      title: '2 Rencana Kinerja menunggu penilaian',
      text: 'Statistik Produksi dan Distribusi &amp; Jasa belum selesai dinilai untuk periode Oktober 2026.',
      action: '<button class="btn btn-sm btn-primary" data-screen="detail-rk">Mulai menilai</button>'
    }) +

    '<div class="stat-grid">' +
      stat({ label: 'Total Rencana Kinerja', value: '6', sub: 'tanggung jawab Anda', icon: 'layers' }) +
      stat({ label: 'RK Aktif', value: '4', sub: 'ada laporan bulan ini', icon: 'file-check', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Menunggu Nilai', value: '2', sub: 'RK belum dinilai penuh', icon: 'clock', iconTone: 'stat__icon--coral' }) +
      stat({ label: 'Rata-rata Capaian', value: '88<small>%</small>', sub: 'seluruh RK aktif', icon: 'trending-up', spark: sparkline([78, 82, 80, 86, 84, 88], 'var(--teal)') }) +
    '</div>' +

    sectionHead({
      title: 'Daftar Rencana Kinerja',
      sub: '6 RK ditampilkan &middot; diurutkan dari yang perlu dinilai',
      right:
        '<div class="search-field" style="width:290px">' + ic('search') + '<input type="search" placeholder="Cari Rencana Kinerja atau Tim Kerja…" data-filter="#rk-list" /></div>' +
        select([{ value: 'semua', label: 'Semua Status' }, { value: 'perlu', label: 'Perlu Dinilai' }, { value: 'selesai', label: 'Selesai Dinilai' }, { value: 'belum', label: 'Belum Ada Laporan' }], 'semua', 'data-card-filter="#rk-list" style="width:170px;height:42px"') +
        select([{ value: '', label: 'Pilih RK di sini…' }, { value: '1', label: 'Meningkatnya kualitas data statistik sosial' }, { value: '2', label: 'Penguatan metadata statistik' }], '', 'style="width:220px;height:42px"')
    }) +
    '<div id="rk-list" class="rk-cards">' + ketuaRks.map(rkCard).join('') + '</div>' +
    '<div class="empty is-hidden" data-empty-for="#rk-list"><span class="empty__icon">' + ic('search') + '</span>' +
      '<div class="empty__title">Tidak ada RK ditemukan</div><div class="empty__text">Coba ubah filter atau kata kunci pencarian Anda.</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DETAIL RK (penilaian per pegawai)
     ───────────────────────────────────────────────────────── */
  var rkRows = [
    { name: 'Dwi Lestari', nip: '199203142015022003', rk: 'Pendataan Survei Sosial Ekonomi Nasional (Susenas) Oktober 2026', entries: 4, capaian: 92, score: '92', own: false, open: true },
    { name: 'Fajar Nugroho', nip: '199008222014031005', rk: 'Rekonsiliasi data hasil pendataan dengan Dinas Sosial', entries: 3, capaian: 88, score: '88', own: false },
    { name: 'Intan Permata', nip: '199404112017022004', rk: 'Penyusunan kamus variabel kegiatan statistik', entries: 2, capaian: 85, score: '', own: false },
    { name: 'Bayu Saputra', nip: '198706152010011002', rk: 'Supervisi petugas pendataan kecamatan Sijuk', entries: 5, capaian: 90, score: '90', own: true },
    { name: 'Maya Sari', nip: '199510302018012006', rk: 'Validasi struktur data kegiatan statistik', entries: 2, capaian: 95, score: '', own: false }
  ];

  function rkRow(r) {
    var entries = [
      { t: 'Pendataan lapangan Susenas Oktober 2026 di 6 desa', c: '312 rumah tangga selesai didata (98% target)', p: 98, e: true },
      { t: 'Pemeriksaan konsistensi isian kuesioner', c: '24 kuesioner direkonsiliasi', p: 100, e: false },
      { t: 'Pelaporan harian progres pendataan', c: 'Laporan harian terkirim 18/18 hari', p: 100, e: false }
    ];
    return '<div class="rk-row' + (r.open ? ' is-open' : '') + '">' +
      '<div class="rk-row__main" data-action="expand">' +
        '<div class="row" style="gap:9px;min-width:0">' + avatar(r.name, 'avatar--sm') +
          '<div style="min-width:0"><div class="strong small truncate">' + r.name + '</div>' +
          '<div class="tiny muted truncate">NIP. ' + r.nip + '</div>' +
          (r.own ? '<span class="badge badge--gold" style="margin-top:4px">Dinilai pimpinan</span>' : '') + '</div></div>' +
        '<div style="min-width:0"><div class="small strong" style="line-height:1.5">' + r.rk + '</div>' +
          '<div class="tiny muted mt-1">' + r.entries + ' kegiatan &middot; Capaian: ' + r.capaian + '% ' +
          (r.score ? '<span class="badge badge--approved" style="margin-left:6px">' + ic('check') + 'Dinilai</span>' : '') + '</div></div>' +
        '<div class="rk-row__score"><div class="mini-label">Nilai</div>' +
          (r.own ? '<div class="strong">' + r.score + '</div>'
                 : '<input class="score-input" value="' + r.score + '" placeholder="&mdash;" aria-label="Nilai ' + r.name + '" />') + '</div>' +
        ic('chevron-down', 'entry__toggle') +
      '</div>' +
      '<div class="rk-row__detail">' +
        '<div class="tiny muted mb-2">Tekan Enter atau klik di luar untuk menyimpan; fokus otomatis pindah ke baris berikutnya.</div>' +
        '<div class="rk-group__grid">' + entries.map(function (e) {
          return '<div class="rk-entry"><div class="rk-entry__text">' + e.t + '</div>' +
            '<div class="rk-entry__outcome">' + e.c + '</div>' +
            '<div class="rk-entry__foot"><span class="tiny muted">Progres <b>' + e.p + '%</b></span>' +
            '<span class="row row--tight">' + (e.e ? evidence('Bukti') : '') +
            '<button class="btn btn-sm btn-amber" data-action="modal" data-modal="mark-entry">' + ic('alert') + 'Tandai perlu diperbaiki</button></span></div></div>';
        }).join('') + '</div>' +
      '</div>' +
    '</div>';
  }

  function detailRk() {
    return '' +
    '<div class="row mb-3"><button class="btn btn-sm btn-secondary" data-screen="dashboard-ketua">' + ic('arrow-left') + 'Kembali ke Dashboard</button></div>' +
    pageHead({
      eyebrow: 'Detail Penilaian RK &middot; Oktober 2026',
      title: 'Meningkatnya kualitas data <em>statistik sosial</em>',
      sub: '<span class="badge badge--muted">' + ic('users') + 'Tim: Statistik Sosial</span> <span class="dot"></span> 12 RK Anggota &middot; 8 pegawai',
      actions: '<button class="btn btn-ink" data-action="toast" data-toast="Rekap nilai RK berhasil diekspor ke Excel (pratinjau).">' + ic('download') + 'Export Excel</button>'
    }) +

    '<div class="stat-grid">' +
      stat({ label: 'Total Pegawai', value: '8', icon: 'users' }) +
      stat({ label: 'Total RK Anggota', value: '12', sub: 'yang perlu dinilai', icon: 'layers', iconTone: 'stat__icon--gold' }) +
      stat({ label: 'Pegawai Selesai', value: '5', sub: 'seluruh RK-nya dinilai', icon: 'user-check', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Rata-rata Nilai', value: '87,6', icon: 'award', tone: 'stat--ink' }) +
    '</div>' +

    sectionHead({
      title: 'Daftar Pegawai (8)',
      sub: 'Nilai setiap <b>RK Anggota</b> yang disubmit masing-masing pegawai.',
      right: '<div class="search-field" style="width:250px">' + ic('search') + '<input type="search" placeholder="Cari pegawai atau RK…" data-filter="#rk-rows" /></div>'
    }) +
    '<div class="rk-head"><span>Nama</span><span>Rencana Kinerja</span><span class="text-right">Nilai</span><span></span></div>' +
    '<div class="rk-table" id="rk-rows">' + rkRows.map(rkRow).join('') + '</div>' +
    '<div class="empty is-hidden" data-empty-for="#rk-rows"><span class="empty__icon">' + ic('user') + '</span>' +
      '<div class="empty__title">Tidak ada pegawai yang ditemukan</div><div class="empty__text">Belum ada pegawai yang mengunggah CKP untuk RK ini pada periode ini.</div></div>' +

    '<div class="sticky-grade"><div class="sticky-grade__progress">' +
      '<span class="sticky-grade__count">3/5 baris dinilai</span>' + progress(60) +
      '<span class="small muted">rata-rata <b class="strong" style="color:var(--ink)">90,0</b></span></div>' +
      '<button class="btn btn-sm btn-secondary" data-action="toast" data-toast="Nilai tersimpan otomatis saat input kehilangan fokus.">' + ic('save') + 'Simpan otomatis</button>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     PENILAIAN CKP (review + approval)
     ───────────────────────────────────────────────────────── */
  var reviewGroups = [
    { rk: 'Meningkatnya kualitas data statistik sosial', parent: null, entries: 18, score: '92', open: true },
    { rk: 'Penguatan metadata statistik', parent: null, entries: 9, score: '88' },
    { rk: 'Peningkatan diseminasi dan layanan data statistik', parent: null, entries: 7, score: '85' },
    { rk: 'Perencanaan, penganggaran, dan pelaporan kinerja', parent: null, entries: 5, score: '90' },
    { rk: 'Pengelolaan kepegawaian dan organisasi', parent: null, entries: 3, score: '91' }
  ];

  function reviewEntry(t, c, p, row, hasEvidence) {
    return '<div class="rk-entry">' +
      '<div><div class="rk-entry__text">' + t + '</div>' +
      '<div class="rk-entry__outcome">Capaian: ' + c + '</div></div>' +
      '<div class="rk-entry__foot">' +
        '<span class="tiny muted">Baris #' + row + ' &middot; Progres <b>' + p + '%</b></span>' +
        '<span class="row row--tight">' + (hasEvidence ? evidence() : '') +
        '<button class="btn btn-sm btn-soft" data-action="modal" data-modal="move-rk" title="Pindah / koreksi RK">' + ic('swap') + '</button></span>' +
      '</div></div>';
  }

  function reviewGroup(g) {
    return '<div class="rk-group' + (g.open ? ' is-open is-saved' : '') + '">' +
      '<div class="rk-group__head" data-action="expand">' +
        '<div><div class="mini-label">Rencana Kinerja</div>' +
          '<div class="rk-group__title">' + g.rk + '</div>' +
          '<div class="rk-group__meta"><span>' + ic('list-checks') + g.entries + ' kegiatan</span>' +
            '<span class="badge badge--approved">' + ic('check') + 'Telah dinilai</span></div>' +
        '</div>' +
        '<div class="rk-group__score"><div class="l">Nilai RK</div>' +
          '<input class="score-input" value="' + g.score + '" min="0" max="100" aria-label="Nilai RK" />' +
          '<div class="score-saved">' + ic('check-circle') + 'Tersimpan</div></div>' +
        ic('chevron-down', 'entry__toggle') +
      '</div>' +
      '<div class="rk-group__body">' +
        '<div class="tiny muted">' + ic('info') + ' Nilai berlaku untuk seluruh kegiatan pada RK ini. Tekan Enter atau klik di luar input untuk menyimpan.</div>' +
        '<div class="rk-group__grid">' +
          reviewEntry('Pendataan lapangan Survei Sosial Ekonomi Nasional (Susenas) Oktober 2026', '312 rumah tangga selesai didata (98% target)', 98, 1, true) +
          reviewEntry('Rekonsiliasi data hasil pendataan dengan Dinas Sosial Kabupaten Belitung', '12 desa tervalidasi; 3 anomali diselesaikan', 100, 2, true) +
          reviewEntry('Supervisi petugas pendataan kecamatan Sijuk dan Badau', '6 petugas tersupervisi, 2 temuan tindak lanjut', 95, 3, false) +
          reviewEntry('Pelaporan harian progres pendataan', 'Laporan harian terkirim 18/18 hari', 100, 4, false) +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function penilaianCkp() {
    return '' +
    '<div class="row mb-3"><button class="btn btn-sm btn-ghost" data-screen="dashboard-ketua">' + ic('arrow-left') + 'Kembali</button></div>' +
    pageHead({
      eyebrow: 'Dashboard &rsaquo; Review CKP &rsaquo; Oktober 2026',
      title: 'Review CKP <em>Oktober</em> 2026',
      sub: badge('submitted') + '<span class="badge badge--draft">v2</span> <span class="dot"></span> 5 RK &middot; 42 kegiatan',
      actions:
        '<button class="btn btn-secondary" data-action="toast" data-toast="File Excel detail CKP berhasil diunduh (pratinjau).">' + ic('download') + 'Export</button>' +
        '<button class="btn btn-primary" data-action="modal" data-modal="approval">' + ic('check-circle') + 'Approval Pimpinan</button>'
    }) +

    '<div class="card mb-4"><div class="card-body row" style="justify-content:space-between;gap:16px">' +
      '<div class="row" style="gap:13px;min-width:0">' + avatar('Dwi Lestari', 'avatar--lg') +
        '<div style="min-width:0"><div class="strong" style="font-size:15px">Dwi Lestari</div>' +
        '<div class="small muted">NIP: 199203142015022003 &middot; Statistisi Ahli Muda &middot; Tim Statistik Sosial</div></div></div>' +
      '<span class="badge badge--outline">' + ic('calendar') + 'Periode: Oktober 2026</span>' +
    '</div></div>' +

    alertBox({ tone: 'warning', icon: 'message', title: 'Catatan Pimpinan (versi sebelumnya)', text: 'Perhatikan kelengkapan tautan bukti dukung pada kegiatan administrasi.' }) +

    '<div class="stat-grid">' +
      stat({ label: 'Total Rencana Kinerja', value: '5', icon: 'layers' }) +
      stat({ label: 'Total Kegiatan', value: '42', icon: 'list-checks' }) +
      stat({ label: 'Rata-rata Progres', value: '92<small>%</small>', icon: 'trending-up', spark: sparkline([76, 82, 88, 90, 92], 'var(--teal)') }) +
      stat({ label: 'Rata-rata Nilai SKP', value: '89,2', icon: 'award', tone: 'stat--coral' }) +
    '</div>' +

    sectionHead({
      title: 'Daftar Kegiatan',
      sub: 'Berikan nilai pada level Rencana Kinerja. Nilai berlaku untuk seluruh kegiatan di bawahnya.',
      right:
        '<div class="seg" data-view-group="review">' +
          '<button class="seg__btn is-active" data-view="list">' + ic('list') + 'List</button>' +
          '<button class="seg__btn" data-view="calendar">' + ic('calendar') + 'Kalender</button>' +
        '</div>' +
        '<div class="search-field" style="width:250px">' + ic('search') + '<input type="search" placeholder="Cari RK atau kegiatan…" data-filter="#review-list" /></div>'
    }) +
    '<div id="review-list">' +
      '<div data-view-pane="list">' + reviewGroups.map(reviewGroup).join('') + '</div>' +
      '<div data-view-pane="calendar" class="is-hidden"><div class="card"><div class="card-body">' +
        ('<div class="calendar"><div class="calendar__head"><div class="calendar__title">' + ic('calendar') + 'Kalender Oktober 2026</div>' +
        '<div class="calendar__legend"><span>19 dari 22 hari kerja terisi</span><span class="badge badge--muted">3 belum terisi</span></div></div>' +
        '<div class="calendar__weekdays"><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span></div>' +
        '<div class="calendar__grid" id="review-cal"></div></div>') +
      '</div></div></div>' +
      '<div class="empty is-hidden" data-empty-for="#review-list"><span class="empty__icon">' + ic('search') + '</span><div class="empty__title">Tidak ada RK yang cocok</div><div class="empty__text">Hapus kata kunci pencarian untuk melihat semua RK.</div></div>' +
    '</div>' +

    '<div class="sticky-grade">' +
      '<div class="sticky-grade__progress"><span class="sticky-grade__count">5/5 RK</span>' + progress(100) +
        '<span class="small muted">rata-rata <b class="strong" style="color:var(--ink)">89,2</b></span></div>' +
      '<span class="badge badge--approved">' + ic('check-circle') + 'Semua RK sudah dinilai</span>' +
      '<button class="btn btn-primary" data-action="modal" data-modal="approval">' + ic('check-circle') + 'Approve</button>' +
    '</div>' +

    '<div class="card mt-4"><div class="card-head"><div class="card-head__main"><div class="card-title">' + ic('history') + ' Riwayat Persetujuan</div>' +
      '<div class="card-desc">Tindakan pimpinan pada CKP ini</div></div></div>' +
      '<div class="card-body" style="padding-top:16px"><div class="timeline">' +
        '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--gold">' + ic('unlock') + '</span><span class="timeline__line"></span></div>' +
          '<div><div class="timeline__title">Dibuka Kembali</div><div class="timeline__time">12 Okt 2026 &middot; 11.05 &middot; oleh Dra. Radina Kartika, M.Si.</div>' +
          '<div class="note-flag" style="margin-top:8px">' + ic('message') + '<div>Perhatikan kelengkapan tautan bukti dukung pada kegiatan administrasi.</div></div></div></div>' +
        '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('check-circle') + '</span><span class="timeline__line"></span></div>' +
          '<div><div class="timeline__title">Disetujui (v1)</div><div class="timeline__time">08 Okt 2026 &middot; 14.20 &middot; oleh Dra. Radina Kartika, M.Si.</div></div></div>' +
        '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('send') + '</span></div>' +
          '<div><div class="timeline__title">Dikirim (v2)</div><div class="timeline__time">06 Okt 2026 &middot; 09.12 &middot; oleh Dwi Lestari</div></div></div>' +
      '</div></div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DASHBOARD PIMPINAN / ADMIN
     ───────────────────────────────────────────────────────── */
  var pegawaiRows = [
    { name: 'Dwi Lestari', unit: 'Tim Statistik Sosial', status: 'submitted', entries: 42, avg: 92, score: '88,4' },
    { name: 'Fajar Nugroho', unit: 'Tim Statistik Sosial', status: 'submitted', entries: 36, avg: 95, score: '91,2' },
    { name: 'Intan Permata', unit: 'Tim Statistik Produksi', status: 'scored', entries: 40, avg: 98, score: '94,6' },
    { name: 'Bayu Saputra', unit: 'Tim Statistik Produksi', status: 'approved', entries: 34, avg: 96, score: '90,1' },
    { name: 'Maya Sari', unit: 'Tim Distribusi &amp; Jasa', status: 'revision_required', entries: 30, avg: 74, score: '79,5' },
    { name: 'Hendra Wijaya', unit: 'Tim Neraca Wilayah', status: 'approved', entries: 28, avg: 92, score: '88,9' },
    { name: 'Putri Ramadhani', unit: 'Tim Statistik Sosial', status: 'submitted', entries: 33, avg: 89, score: '&mdash;' },
    { name: 'Andi Kurniawan', unit: 'Subbagian Umum', status: null, entries: 0, avg: 0, score: '&mdash;' }
  ];

  function pegawaiCard(p) {
    var bar = p.avg >= 80 ? '' : p.avg >= 50 ? 'gold' : 'coral';
    return '<article class="pegawai-card" data-search="' + p.name + ' ' + p.unit + '" data-status="' + (p.status || 'none') + '">' +
      '<div class="row" style="justify-content:space-between;align-items:flex-start">' +
        person(p.name, p.unit) +
        (p.status ? badge(p.status) : '<span class="badge badge--none">Belum Lapor</span>') +
      '</div>' +
      '<div class="pegawai-card__stats">' +
        '<div class="pegawai-card__stat"><div class="l">Kegiatan</div><div class="v">' + p.entries + '</div></div>' +
        '<div class="pegawai-card__stat"><div class="l">Capaian</div><div class="v" style="color:' + (p.avg >= 80 ? 'var(--teal)' : p.avg > 0 ? 'var(--gold)' : 'var(--ink-4)') + '">' + p.avg + '%</div></div>' +
        '<div class="pegawai-card__stat"><div class="l">Skor</div><div class="v">' + p.score + '</div></div>' +
      '</div>' +
      (p.avg > 0 ? '<div>' + progress(p.avg, bar) + '</div>' : '') +
      (p.status
        ? '<button class="btn btn-sm btn-soft btn-block" data-screen="penilaian-ckp">Lihat Detail Log ' + ic('arrow-right') + '</button>'
        : '<button class="btn btn-sm btn-secondary btn-block is-disabled" disabled>Belum ada data</button>') +
    '</article>';
  }

  function dashboardPimpinan(variant) {
    var admin = variant === 'admin';
    return '' +
    pageHead({
      eyebrow: (admin ? 'Monitoring CKP &middot; Admin' : 'Dashboard Pimpinan') + ' &middot; Oktober 2026',
      title: admin ? 'Monitoring <em>CKP</em> pegawai.' : 'Kinerja pegawai, <em>satu pandangan.</em>',
      sub: 'Oktober 2026 <span class="badge badge--gold">' + ic('filter') + 'Filter aktif</span> <span class="dot"></span> diperbarui otomatis via realtime',
      actions:
        '<button class="btn btn-primary" data-screen="persetujuan-cepat">' + ic('zap') + 'Persetujuan Cepat <span class="badge badge--outline" style="border-color:rgba(255,255,255,.4);color:#fff;margin-left:2px">7</span></button>' +
        '<button class="btn btn-secondary" data-screen="monitoring-penilaian">' + ic('users') + 'Monitoring Penilaian</button>' +
        '<div class="row row--tight">' +
          '<div style="width:120px">' + select([{ value: '10', label: 'Oktober' }, { value: 'T4', label: 'Triwulan IV' }, { value: '9', label: 'September' }], '10', 'style="height:40px"') + '</div>' +
          '<div style="width:92px">' + select([{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }], '2026', 'style="height:40px"') + '</div>' +
        '</div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Data periode dimuat ulang (pratinjau)." title="Refresh data">' + ic('refresh') + '</button>' +
        '<button class="icon-btn" data-action="toast" data-toast="Rekap Excel berhasil diunduh (pratinjau)." title="Export rekap ke Excel">' + ic('download') + '</button>' +
        '<button class="icon-btn" data-action="toast" data-toast="Menyiapkan ZIP berkas asli CKP… (pratinjau)." title="Download semua berkas asli (ZIP)">' + ic('archive') + '</button>' +
        '<button class="icon-btn" data-action="toast" data-toast="Screenshot rekap pegawai disimpan sebagai PNG (pratinjau)." title="Screenshot bagian ini">' + ic('copy') + '</button>'
    }) +

    '<div class="stat-grid">' +
      stat({
        label: 'Tingkat Pelaporan', tone: 'stat--ink', value: '26<small style="color:rgba(242,235,217,.6)">/32</small>',
        sub: 'pegawai melapor periode ini', icon: 'users',
        spark: '<div style="display:flex;gap:3px;align-items:flex-end;height:34px">' +
          [10, 14, 9, 16, 12, 18, 15, 22, 19, 24, 21, 26].map(function (v) {
            return '<span style="width:5px;height:' + v + 'px;border-radius:2px;background:rgba(154,214,198,.55)"></span>';
          }).join('') + '</div>'
      }) +
      stat({ label: 'Menunggu Review', value: '7', sub: 'perlu diproses', icon: 'clock', iconTone: 'stat__icon--coral', tone: 'stat--coral' }) +
      stat({ label: 'Disetujui', value: '18', sub: 'dari 32 pegawai', icon: 'check-circle', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Rata-rata Capaian', value: '91<small>%</small>', sub: 'tim bulan ini', icon: 'trending-up', spark: sparkline([82, 85, 84, 88, 90, 91], 'var(--teal)') }) +
    '</div>' +

    '<div class="card mb-4"><div class="card-body">' +
      '<div class="row" style="justify-content:space-between;margin-bottom:11px">' +
        '<span class="small strong">Distribusi status pelaporan periode ini</span>' +
        '<span class="tiny muted">32 pegawai aktif</span></div>' +
      '<div class="segbar">' +
        '<span style="width:56%;background:var(--success)" title="Disetujui 18"></span>' +
        '<span style="width:12.5%;background:var(--gold)" title="Sudah dinilai 4"></span>' +
        '<span style="width:9.4%;background:var(--coral)" title="Menunggu review 3"></span>' +
        '<span style="width:6.3%;background:var(--danger)" title="Perlu revisi 2"></span>' +
        '<span style="width:15.6%;background:var(--surface-4)" title="Belum lapor 5"></span>' +
      '</div>' +
      '<div class="legend mt-2">' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--success)"></span>Disetujui 18</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--gold)"></span>Sudah Dinilai 4</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--coral)"></span>Menunggu Review 3</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--danger)"></span>Perlu Revisi 2</span>' +
        '<span class="legend__item"><span class="legend__swatch" style="background:var(--surface-4)"></span>Belum Lapor 5</span>' +
      '</div>' +
    '</div></div>' +

    '<div class="card"><div class="card-body">' +
      sectionHead({
        title: 'Rekap per Pegawai',
        sub: '<span id="pegawai-count">8 pegawai ditampilkan</span>',
        right: '<span class="link" data-screen="data-pegawai">Lihat tabel lengkap ' + ic('arrow-right') + '</span>'
      }) +
      '<div class="toolbar mb-3">' +
        '<div class="search-field" style="width:260px">' + ic('search') + '<input type="search" placeholder="Cari pegawai…" data-filter="#pegawai-grid" /></div>' +
        '<div class="row row--tight" data-chip-group="#pegawai-grid">' +
          '<button class="chip is-active" data-chip="all">Semua <span class="count">32</span></button>' +
          '<button class="chip chip--attention" data-chip="submitted">Menunggu Review <span class="count">3</span></button>' +
          '<button class="chip" data-chip="scored">Sudah Dinilai <span class="count">4</span></button>' +
          '<button class="chip chip--attention" data-chip="revision_required">Perlu Revisi <span class="count">2</span></button>' +
          '<button class="chip" data-chip="approved">Disetujui <span class="count">18</span></button>' +
          '<button class="chip" data-chip="none">Belum Lapor <span class="count">5</span></button>' +
        '</div>' +
        '<div class="toolbar__spacer"></div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Screenshot rekap pegawai disimpan (pratinjau)." title="Screenshot">' + ic('copy') + '</button>' +
      '</div>' +
      '<div class="pegawai-grid" id="pegawai-grid">' + pegawaiRows.map(pegawaiCard).join('') + '</div>' +
      '<div class="empty is-hidden" data-empty-for="#pegawai-grid"><span class="empty__icon">' + ic('search') + '</span>' +
        '<div class="empty__title">Tidak ada pegawai ditemukan</div><div class="empty__text">Coba kata kunci lain atau hapus filter status.</div></div>' +
    '</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     PERSETUJUAN CEPAT
     ───────────────────────────────────────────────────────── */
  function persetujuanCepat() {
    var rows = [
      { name: 'Dwi Lestari', unit: 'Tim Statistik Sosial', avg: 92, score: '88,4', ready: true, pending: 0 },
      { name: 'Fajar Nugroho', unit: 'Tim Statistik Sosial', avg: 95, score: '91,2', ready: true, pending: 0 },
      { name: 'Intan Permata', unit: 'Tim Statistik Produksi', avg: 98, score: '94,6', ready: true, pending: 0 },
      { name: 'Maya Sari', unit: 'Tim Distribusi &amp; Jasa', avg: 74, score: '&mdash;', ready: false, pending: 2 },
      { name: 'Bayu Saputra', unit: 'Tim Statistik Produksi', avg: 96, score: '90,1', ready: true, pending: 0 }
    ];
    var tbody = rows.map(function (r) {
      return '<tr data-search="' + r.name + ' ' + r.unit + '">' +
        '<td>' + person(r.name, r.unit) + '</td>' +
        '<td class="center"><div class="row row--tight" style="justify-content:center"><span class="strong tnum">' + r.avg + '%</span>' +
          '<div style="width:64px">' + progress(r.avg, r.avg >= 80 ? '' : 'gold') + '</div></div></td>' +
        '<td class="center strong tnum">' + r.score + '</td>' +
        '<td>' + (r.ready
          ? '<div class="table-actions">' +
              '<button class="btn btn-sm btn-soft" data-action="modal" data-modal="approval">' + ic('check-circle') + 'Approve</button>' +
              '<button class="btn btn-sm btn-secondary" data-screen="penilaian-ckp">' + ic('search') + 'Detail</button></div>'
          : '<div class="table-actions" style="flex-direction:column;align-items:flex-end;gap:4px">' +
              '<div class="row row--tight"><button class="btn btn-sm btn-secondary is-disabled" disabled title="Ketua Tim belum selesai menilai semua RK">' + ic('lock') + 'Approve</button>' +
              '<button class="btn btn-sm btn-secondary" data-screen="penilaian-ckp">' + ic('search') + 'Detail</button></div>' +
              '<span class="tiny muted">' + r.pending + ' RK belum dinilai</span></div>') + '</td>' +
      '</tr>';
    }).join('');

    return '' +
    '<div class="row mb-3"><button class="btn btn-sm btn-ghost" data-screen="dashboard-pimpinan">' + ic('arrow-left') + 'Kembali ke Dashboard</button></div>' +
    pageHead({
      eyebrow: 'Persetujuan Cepat &middot; Oktober 2026',
      title: 'Antrean <em>persetujuan</em> CKP.',
      sub: 'Lakukan review dan persetujuan cepat untuk CKP berstatus Menunggu Review / Sudah Dinilai.',
      actions:
        '<div class="row row--tight"><div style="width:140px">' + select([{ value: '10', label: 'Oktober' }, { value: 'T4', label: 'Triwulan IV' }], '10', 'style="height:40px"') + '</div>' +
        '<div style="width:92px">' + select([{ value: '2026', label: '2026' }], '2026', 'style="height:40px"') + '</div></div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Daftar persetujuan dimuat ulang (pratinjau)." title="Refresh">' + ic('refresh') + '</button>'
    }) +

    alertBox({ tone: 'info', icon: 'shield', title: 'Gate penilaian aktif', text: 'Tombol <b>Approve</b> hanya aktif setelah seluruh RK pada CKP dinilai oleh ketua tim. Gunakan tombol Detail untuk memeriksa.' }) +

    '<div class="card">' +
      '<div class="card-body toolbar" style="border-bottom:1px solid var(--line-soft)">' +
        '<div class="search-field" style="width:300px">' + ic('search') + '<input type="search" placeholder="Cari nama atau NIP pegawai…" data-filter="#approval-table" /></div>' +
        '<div class="toolbar__spacer"></div>' +
        '<button class="btn btn-soft" data-action="modal" data-modal="bulk-approve">' + ic('check-circle') + 'Setujui Semua yang Siap (4)</button>' +
      '</div>' +
      '<div class="table-wrap" style="border:0;border-radius:0">' +
        '<table class="data" id="approval-table"><thead><tr>' +
          '<th>Pegawai</th><th class="center">Rata-rata Capaian</th><th class="center">Skor Penilaian</th><th class="text-right">Aksi Cepat</th>' +
        '</tr></thead><tbody>' + tbody + '</tbody></table>' +
      '</div>' +
      '<div class="card-foot"><span class="tiny muted">5 CKP menunggu persetujuan pada periode ini</span>' +
        '<span class="tiny muted">' + ic('info') + ' Persetujuan tercatat pada audit log &amp; riwayat CKP</span></div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     MONITORING PENILAIAN
     ───────────────────────────────────────────────────────── */
  function monitoringPenilaian() {
    function employeeBlock(name, unit, count, rks) {
      return '<div class="acc__inner"><div class="acc__inner-head" data-action="expand-acc">' +
        person(name, unit) +
        '<span class="badge badge--gold" style="margin-left:auto">' + ic('file-text') + count + ' RK</span>' +
        ic('chevron-down', 'acc__chev') + '</div>' +
        '<ul class="acc__list">' + rks.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>';
    }
    function ketuaBlock(name, nip, count, body, open) {
      return '<div class="acc' + (open ? ' is-open' : '') + '"><div class="acc__head" data-action="expand-acc">' +
        avatar(name, 'avatar--lg') +
        '<div><div class="acc__title">' + name + '</div><div class="acc__sub">NIP: ' + nip + '</div></div>' +
        '<div class="acc__count"><div class="v">' + count + '</div><div class="l">RK belum dinilai</div></div>' +
        ic('chevron-down', 'acc__chev') + '</div>' +
        '<div class="acc__body"><div class="row mb-2" style="gap:8px">' + ic('users') + '<span class="small strong">Daftar Anggota Tim</span></div>' + body + '</div></div>';
    }

    return '' +
    pageHead({
      eyebrow: 'Monitoring Penilaian &middot; Oktober 2026',
      title: 'Ketua tim yang <em>menunggak</em> nilai.',
      sub: 'Pantau progres ketua tim yang belum menyelesaikan penilaian pada Oktober 2026.',
      actions:
        '<div class="row row--tight"><div style="width:140px">' + select([{ value: '10', label: 'Oktober' }, { value: 'T4', label: 'Triwulan IV' }], '10', 'style="height:40px"') + '</div>' +
        '<div style="width:92px">' + select([{ value: '2026', label: '2026' }], '2026', 'style="height:40px"') + '</div></div>' +
        '<button class="icon-btn" data-action="toast" data-toast="Data monitoring dimuat ulang (pratinjau)." title="Refresh">' + ic('refresh') + '</button>' +
        '<button class="icon-btn" data-action="toast" data-toast="Screenshot monitoring disimpan sebagai PNG (pratinjau)." title="Screenshot">' + ic('copy') + '</button>'
    }) +

    ketuaBlock('Aditya Pratama, S.S.T., M.Stat.', '198711052012011004', 3,
      employeeBlock('Fajar Nugroho', 'Tim Statistik Sosial', 2, [
        'Rekonsiliasi data hasil pendataan dengan Dinas Sosial &middot; Tim: Statistik Sosial',
        'Supervisi petugas pendataan kecamatan Sijuk &middot; Tim: Statistik Sosial'
      ]) +
      employeeBlock('Intan Permata', 'Tim Statistik Sosial', 1, [
        'Validasi struktur data kegiatan statistik &middot; Tim: Statistik Sosial'
      ]), true) +

    ketuaBlock('Nurul Aini, S.Si., M.Si.', '198903182013012003', 1,
      employeeBlock('Dwi Lestari', 'Tim Statistik Produksi', 1, [
        'Penyusunan kamus variabel kegiatan statistik &middot; Tim: Statistik Produksi'
      ]), false) +

    '<div class="empty mt-3" style="padding:32px"><span class="empty__icon" style="background:var(--success-soft);color:var(--success)">' + ic('check-circle') + '</span>' +
      '<div class="empty__title">Ketua tim lain sudah selesai</div><div class="empty__text">Tidak ada tunggakan penilaian pada periode ini selain dua ketua tim di atas.</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DIREKTORI PEGAWAI
     ───────────────────────────────────────────────────────── */
  var staff = [
    { name: 'Dwi Lestari', jabatan: 'Statistisi Ahli Muda', gol: 'III/b', nip: '199203142015022003', unit: 'Tim Statistik Sosial', email: 'dwi.lestari@bps.go.id' },
    { name: 'Fajar Nugroho', jabatan: 'Statistisi Mahir', gol: 'II/d', nip: '199008222014031005', unit: 'Tim Statistik Sosial', email: 'fajar.nugroho@bps.go.id' },
    { name: 'Intan Permata', jabatan: 'Statistisi Ahli Pertama', gol: 'III/a', nip: '199404112017022004', unit: 'Tim Statistik Produksi', email: 'intan.permata@bps.go.id' },
    { name: 'Bayu Saputra', jabatan: 'Statistisi Penyelia', gol: 'II/c', nip: '198706152010011002', unit: 'Tim Statistik Produksi', email: 'bayu.saputra@bps.go.id' },
    { name: 'Maya Sari', jabatan: 'Statistisi Ahli Muda', gol: 'III/c', nip: '199510302018012006', unit: 'Tim Distribusi &amp; Jasa', email: 'maya.sari@bps.go.id' },
    { name: 'Hendra Wijaya', jabatan: 'Pranata Komputer Mahir', gol: 'II/d', nip: '199201092015031004', unit: 'Tim Neraca Wilayah', email: 'hendra.wijaya@bps.go.id' },
    { name: 'Putri Ramadhani', jabatan: 'Statistisi Terampil', gol: 'II/b', nip: '199611182019022007', unit: 'Tim Statistik Sosial', email: 'putri.ramadhani@bps.go.id' },
    { name: 'Andi Kurniawan', jabatan: 'Pengelola Umum Operasional', gol: 'II/a', nip: '199801252020011003', unit: 'Subbagian Umum', email: 'andi.kurniawan@bps.go.id' }
  ];

  function dataPegawai() {
    var cards = staff.map(function (s) {
      return '<article class="pegawai-card" data-search="' + s.name + ' ' + s.nip + ' ' + s.unit + ' ' + s.email + '">' +
        '<div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px">' +
          '<div class="row" style="gap:12px;min-width:0">' + avatar(s.name, 'avatar--lg') +
            '<div style="min-width:0"><div class="row row--tight"><span class="strong">' + s.name + '</span>' +
            '<span class="badge badge--approved">' + ic('shield') + 'Aktif</span></div>' +
            '<div class="small muted mt-1">' + s.jabatan + ' <span class="badge badge--draft" style="margin-left:4px">' + s.gol + '</span></div>' +
            '<div class="tiny mono muted mt-1">' + s.nip + '</div></div></div>' +
          '<button class="btn btn-sm btn-soft" data-screen="detail-pegawai">Lihat CKP ' + ic('arrow-right') + '</button>' +
        '</div>' +
        '<div class="grid-2" style="gap:8px;border-top:1px solid var(--line-soft);padding-top:12px">' +
          '<span class="tiny muted truncate">' + ic('briefcase') + ' ' + s.unit + '</span>' +
          '<span class="tiny muted truncate">' + ic('mail') + ' ' + s.email + '</span>' +
        '</div>' +
      '</article>';
    }).join('');

    return '' +
    pageHead({
      eyebrow: 'Direktori Pegawai',
      title: 'Semua orang, <em>satu direktori.</em>',
      sub: '<span id="staff-count">' + staff.length + '</span> dari 32 pegawai aktif &middot; data profil tersinkron dengan Supabase',
      actions: '<div class="search-field" style="width:310px">' + ic('search') + '<input type="search" placeholder="Cari nama, NIP, unit, atau email…" data-filter="#staff-list" /></div>'
    }) +
    '<div class="staff-list stack" id="staff-list">' + cards + '</div>' +
    '<div class="empty is-hidden" data-empty-for="#staff-list"><span class="empty__icon">' + ic('search') + '</span>' +
      '<div class="empty__title">Tidak ada pegawai ditemukan</div><div class="empty__text">Coba kata kunci yang berbeda.</div>' +
      '<button class="btn btn-secondary" data-action="clear-filter" data-target="#staff-list">Hapus pencarian</button></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DETAIL PEGAWAI (pimpinan)
     ───────────────────────────────────────────────────────── */
  function detailPegawai() {
    var history = [
      { p: 'Oktober 2026', v: 2, entries: 42, avg: 92, status: 'submitted', at: '06 Okt 2026 &middot; 09.12' },
      { p: 'September 2026', v: 3, entries: 38, avg: 96, status: 'approved', at: '02 Okt 2026 &middot; 09.14' },
      { p: 'Agustus 2026', v: 1, entries: 40, avg: 100, status: 'scored', at: '01 Sep 2026 &middot; 08.40' },
      { p: 'Juli 2026', v: 2, entries: 35, avg: 78, status: 'revision_required', at: '02 Agu 2026 &middot; 10.05' },
      { p: 'Juni 2026', v: 1, entries: 36, avg: 95, status: 'approved', at: '01 Jul 2026 &middot; 09.55' }
    ].map(function (h) {
      return '<tr>' +
        '<td class="strong">CKP ' + h.p + '</td>' +
        '<td class="center">v' + h.v + '</td>' +
        '<td class="center tnum">' + h.entries + '</td>' +
        '<td><div class="row row--tight" style="justify-content:center"><span class="tnum strong">' + h.avg + '%</span><div style="width:56px">' + progress(h.avg) + '</div></div></td>' +
        '<td class="center">' + badge(h.status) + '</td>' +
        '<td class="tiny muted">' + h.at + '</td>' +
        '<td class="text-right"><button class="btn btn-sm btn-secondary" data-screen="penilaian-ckp">Review ' + ic('arrow-right') + '</button></td>' +
      '</tr>';
    }).join('');

    return '' +
    '<div class="row mb-3"><button class="btn btn-sm btn-ghost" data-screen="data-pegawai">' + ic('arrow-left') + 'Kembali</button></div>' +
    '<div class="card mb-4" style="background:linear-gradient(150deg,#0D3B33,#0B2A24);border-color:transparent;color:#F2EBD9">' +
      '<div class="card-body row" style="gap:18px;align-items:flex-start">' +
        '<span class="avatar avatar--xl" style="background:rgba(255,255,255,.12)">DL</span>' +
        '<div style="min-width:0;flex:1">' +
          '<div class="row row--tight"><h2 style="font-family:var(--font-display);font-weight:400;font-size:30px">Dwi Lestari, S.Stat.</h2>' +
          '<span class="badge" style="background:rgba(255,255,255,.14);color:#F2EBD9">Statistisi Ahli Muda</span>' +
          '<span class="badge" style="background:rgba(255,255,255,.1);color:rgba(242,235,217,.8)">Gol. III/b</span></div>' +
          '<div class="row mt-2" style="gap:16px;color:rgba(242,235,217,.75);font-size:12px">' +
            '<span>' + ic('user') + ' NIP: 199203142015022003</span>' +
            '<span>' + ic('briefcase') + ' Tim Statistik Sosial</span>' +
            '<span>' + ic('mail') + ' dwi.lestari@bps.go.id</span>' +
          '</div>' +
        '</div>' +
        '<div class="row row--tight"><span class="badge badge--approved">' + ic('shield') + 'Akun aktif</span>' +
        '<button class="btn btn-sm" style="background:rgba(255,255,255,.12);color:#F2EBD9" data-action="toast" data-toast="Email dikirim ke pegawai (pratinjau).">' + ic('mail') + 'Hubungi</button></div>' +
      '</div>' +
    '</div>' +

    '<div class="stat-grid stat-grid--3">' +
      stat({ label: 'Total Upload CKP', value: '12', sub: 'sejak Januari 2026', icon: 'file-text' }) +
      stat({ label: 'Rata-rata Progres', value: '91<small>%</small>', sub: 'seluruh periode', icon: 'trending-up' }) +
      stat({ label: 'Rata-rata Nilai', value: '88,9', sub: 'penilaian ketua tim', icon: 'award', iconTone: 'stat__icon--gold' }) +
    '</div>' +

    '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">' + ic('calendar') + ' Riwayat CKP</div>' +
      '<div class="card-desc">Seluruh unggahan pegawai beserta status terakhir</div></div>' +
      '<button class="btn btn-sm btn-soft" data-screen="evaluasi-penilaian">Evaluasi Penilaian ' + ic('arrow-right') + '</button></div>' +
      '<div class="table-wrap" style="border:0"><table class="data"><thead><tr>' +
        '<th>Periode</th><th class="center">Versi</th><th class="center">Kegiatan</th><th class="center">Progres</th><th class="center">Status</th><th>Diupload</th><th class="text-right">Aksi</th>' +
      '</tr></thead><tbody>' + history + '</tbody></table></div>' +
    '</div>';
  }

  window.SIKAP_SCREENS = Object.assign(window.SIKAP_SCREENS || {}, {
    'dashboard-ketua': { content: dashboardKetua },
    'detail-rk': { content: detailRk },
    'penilaian-ckp': { content: penilaianCkp },
    'dashboard-pimpinan': { content: function () { return dashboardPimpinan('pimpinan'); } },
    'monitoring-admin': { content: function () { return dashboardPimpinan('admin'); } },
    'persetujuan-cepat': { content: persetujuanCepat },
    'monitoring-penilaian': { content: monitoringPenilaian },
    'data-pegawai': { content: dataPegawai },
    'detail-pegawai': { content: detailPegawai }
  });
})();
