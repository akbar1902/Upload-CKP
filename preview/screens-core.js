/* ============================================================
   SIKAP — Redesign Preview
   screens-core.js : helper + layar inti
   (login, reset password, dashboard anggota, upload CKP,
    detail CKP, evaluasi penilaian)
   ============================================================ */

/* ── Helper bersama ─────────────────────────────────────── */
window.ui = (function () {
  var ic = function (name, cls) {
    return '<svg class="i ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  };

  var STATUS = {
    draft: { label: 'Draft', cls: 'draft', icon: 'file-text' },
    submitted: { label: 'Menunggu Review', cls: 'submitted', icon: 'clock' },
    scored: { label: 'Sudah Dinilai', cls: 'scored', icon: 'spark' },
    approved: { label: 'Disetujui', cls: 'approved', icon: 'check-circle' },
    rejected: { label: 'Ditolak', cls: 'rejected', icon: 'x' },
    revision_required: { label: 'Perlu Revisi', cls: 'revision', icon: 'alert' },
    superseded: { label: 'Diganti (Arsip)', cls: 'superseded', icon: 'archive' }
  };

  var badge = function (status, override) {
    var m = STATUS[status] || { label: 'Belum Lapor', cls: 'none', icon: 'circle-dot' };
    return '<span class="badge badge--' + m.cls + '" title="Status: ' + (override || m.label) + '">' +
      ic(m.icon) + (override || m.label) + '</span>';
  };

  var initials = function (name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  var avatar = function (name, cls) {
    var palette = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
    var h = 0;
    var s = String(name || '');
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
    return '<span class="avatar ' + (cls || '') + ' avatar--' + palette[h % palette.length] + '" aria-hidden="true">' +
      initials(name) + '</span>';
  };

  var progress = function (value, tone, extra) {
    var v = Math.max(0, Math.min(100, Number(value) || 0));
    return '<div class="progress ' + (tone ? 'progress--' + tone : '') + ' ' + (extra || '') + '">' +
      '<span style="width:' + v + '%"></span></div>';
  };

  var ring = function (value, label, opts) {
    opts = opts || {};
    var v = Math.max(0, Math.min(100, Number(value) || 0));
    return '<div class="ring ' + (opts.small ? 'ring--sm' : '') + '" style="--p:' + v + ';' +
      (opts.color ? '--ring-color:' + opts.color + ';' : '') + '">' +
      '<div class="ring__center"><div class="ring__value">' + (opts.text || v + '%') + '</div>' +
      (label ? '<div class="ring__label">' + label + '</div>' : '') + '</div></div>';
  };

  var person = function (name, sub, cls) {
    return '<div class="person">' + avatar(name, cls) +
      '<div class="person__meta"><div class="person__name">' + name + '</div>' +
      (sub ? '<div class="person__sub">' + sub + '</div>' : '') + '</div></div>';
  };

  var stat = function (o) {
    return '<div class="stat ' + (o.tone || '') + '">' +
      '<div class="stat__top"><div class="stat__label">' + o.label + '</div>' +
      (o.icon ? '<span class="stat__icon ' + (o.iconTone || '') + '">' + ic(o.icon) + '</span>' : '') + '</div>' +
      '<div class="stat__value">' + o.value + '</div>' +
      (o.sub ? '<div class="stat__sub">' + o.sub + '</div>' : '') +
      (o.spark ? '<div class="stat__spark">' + o.spark + '</div>' : '') +
      '</div>';
  };

  var alertBox = function (o) {
    return '<div class="alert alert--' + (o.tone || 'info') + '">' +
      '<span class="alert__icon">' + ic(o.icon || 'info') + '</span>' +
      '<div style="min-width:0"><div class="alert__title">' + o.title + '</div>' +
      (o.text ? '<div class="alert__text">' + o.text + '</div>' : '') + '</div>' +
      (o.action ? '<div class="alert__action">' + o.action + '</div>' : '') + '</div>';
  };

  var pageHead = function (o) {
    return '<div class="page-head"><div class="page-head__main">' +
      (o.eyebrow ? '<div class="eyebrow' + (o.eyebrowTone === 'teal' ? ' eyebrow--teal' : '') + '">' + o.eyebrow + '</div>' : '') +
      '<h1 class="page-title">' + o.title + '</h1>' +
      (o.sub ? '<div class="page-sub">' + o.sub + '</div>' : '') +
      '</div>' + (o.actions ? '<div class="page-actions">' + o.actions + '</div>' : '') + '</div>';
  };

  var sectionHead = function (o) {
    return '<div class="section-head"><div><div class="section-title">' + o.title + '</div>' +
      (o.sub ? '<div class="section-sub">' + o.sub + '</div>' : '') + '</div>' +
      (o.right ? '<div class="row">' + o.right + '</div>' : '') + '</div>';
  };

  var emptyState = function (o) {
    return '<div class="empty"><span class="empty__icon">' + ic(o.icon || 'inbox') + '</span>' +
      '<div class="empty__title">' + o.title + '</div>' +
      (o.text ? '<div class="empty__text">' + o.text + '</div>' : '') +
      (o.action || '') + '</div>';
  };

  var select = function (options, selected, extra) {
    var out = '<div class="select"><select ' + (extra || '') + '>';
    options.forEach(function (o) {
      out += '<option' + (String(o.value) === String(selected) ? ' selected' : '') + ' value="' + o.value + '">' + o.label + '</option>';
    });
    return out + '</select>' + ic('chevron-down') + '</div>';
  };

  var sparkline = function (points, color, fill) {
    var max = Math.max.apply(null, points);
    var min = Math.min.apply(null, points);
    var w = 92, h = 30;
    var step = w / (points.length - 1);
    var coords = points.map(function (p, i) {
      var x = (i * step).toFixed(1);
      var y = (h - ((p - min) / (max - min || 1)) * (h - 6) - 3).toFixed(1);
      return x + ',' + y;
    });
    return '<svg class="sparkline" viewBox="0 0 92 30" preserveAspectRatio="none">' +
      (fill ? '<polygon points="0,30 ' + coords.join(' ') + ' 92,30" fill="' + (fill || 'rgba(13,95,85,.12)') + '" stroke="none"/>' : '') +
      '<polyline points="' + coords.join(' ') + '" fill="none" stroke="' + (color || 'var(--teal)') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  };

  var evidence = function (label) {
    return '<a class="evidence-link" data-action="toast" data-toast="Membuka bukti dukung di tab baru (pratinjau)." href="#">' +
      ic('external') + (label || 'Lihat bukti dukung') + '</a>';
  };

  return {
    ic: ic, badge: badge, avatar: avatar, initials: initials, progress: progress, ring: ring,
    person: person, stat: stat, alertBox: alertBox, pageHead: pageHead, sectionHead: sectionHead,
    emptyState: emptyState, select: select, sparkline: sparkline, evidence: evidence, STATUS: STATUS
  };
})();

/* ============================================================
   SCREENS CORE
   ============================================================ */
(function () {
  var u = window.ui;
  var ic = u.ic, badge = u.badge, avatar = u.avatar, progress = u.progress, ring = u.ring;
  var pageHead = u.pageHead, sectionHead = u.sectionHead, alertBox = u.alertBox;
  var stat = u.stat, emptyState = u.emptyState, select = u.select, sparkline = u.sparkline, evidence = u.evidence;

  /* ─────────────────────────────────────────────────────────
     LOGIN
     ───────────────────────────────────────────────────────── */
  function login() {
    return '' +
    '<div class="login">' +
      '<div class="login__art">' +
        '<div class="art-aurora" aria-hidden="true"></div>' +
        '<div class="art-beam" aria-hidden="true"></div>' +
        '<div class="art-vignette" aria-hidden="true"></div>' +

        '<div class="login__art-top">' +
          '<img src="assets/sikap-logo-cream.svg" alt="SIKAP — BPS Kabupaten Belitung" />' +
          '<span class="login__art-tag">Portal Internal</span>' +
        '</div>' +

        '<div class="login__stage">' +
          '<div class="art-orbit" aria-hidden="true">' +
            '<span class="art-orbit__dot art-orbit__dot--a"></span>' +
            '<span class="art-orbit__dot art-orbit__dot--b"></span>' +
          '</div>' +

          '<article class="art-card art-card--a" aria-hidden="true">' +
            '<div class="art-card__head">' +
              '<span class="art-card__eyebrow">CKP September 2026</span>' +
              '<span class="art-card__pill art-card__pill--ok">' +
                '<svg class="i"><use href="#i-check-circle"/></svg>Disetujui</span>' +
            '</div>' +
            '<h3 class="art-card__title">Capaian Kinerja</h3>' +
            '<div class="art-card__rows">' +
              '<div class="art-row"><span class="art-row__val art-row__val--start">38 keg.</span>' +
                '<span class="art-row__bar"><span class="art-row__fill" style="width:96%"></span></span></div>' +
              '<div class="art-row"><span class="art-row__val art-row__val--start">Nilai</span>' +
                '<span class="art-row__bar art-row__bar--gold"><span class="art-row__fill" style="width:91%"></span></span>' +
                '<span class="art-row__val">91</span></div>' +
              '<div class="art-row"><span class="art-row__val art-row__val--start">Revisi</span>' +
                '<span class="art-row__bar art-row__bar--coral"><span class="art-row__fill" style="width:14%"></span></span>' +
                '<span class="art-row__val">0</span></div>' +
            '</div>' +
            '<p class="art-card__note">Tim Statistik Sosial &middot; 5 Rencana Kinerja</p>' +
          '</article>' +

          '<article class="art-card art-card--b" aria-hidden="true">' +
            '<div class="art-card__head">' +
              '<span class="art-card__eyebrow">Sudah Dinilai</span>' +
              '<span class="art-card__pill art-card__pill--gold">' +
                '<svg class="i"><use href="#i-spark"/></svg>Rata-rata 89,4</span>' +
            '</div>' +
            '<div class="art-card__rows art-card__rows--scores">' +
              '<div class="art-row"><span class="art-row__bar"><span class="art-row__fill" style="width:92%"></span></span><span class="art-row__val">92</span></div>' +
              '<div class="art-row"><span class="art-row__bar"><span class="art-row__fill" style="width:88%"></span></span><span class="art-row__val">88</span></div>' +
              '<div class="art-row"><span class="art-row__bar"><span class="art-row__fill" style="width:90%"></span></span><span class="art-row__val">90</span></div>' +
            '</div>' +
            '<p class="art-card__note art-card__note--ok">' +
              '<svg class="i"><use href="#i-shield"/></svg>Siap disetujui pimpinan</p>' +
          '</article>' +

          '<div class="art-seal" aria-hidden="true">' +
            '<span class="art-seal__ring"></span>' +
            '<span class="art-seal__dash"></span>' +
            '<span class="art-seal__core">' +
              '<strong>26<span>/32</span></strong>' +
              '<small>Pegawai Melapor</small>' +
            '</span>' +
          '</div>' +
        '</div>' +

        '<div class="login__quote">' +
          '<span class="login__quote-rule" aria-hidden="true"></span>' +
          '<h2>CKP sudah diunggah,<br /><em>Hati Tenang</em></h2>' +
        '</div>' +
      '</div>' +

      '<div class="login__panel">' +
        '<div class="login-card">' +
          '<div class="login-mobile-slogan"><span class="rule" aria-hidden="true"></span>' +
            '<p>CKP sudah diunggah, <em>Hati Tenang</em></p></div>' +
          '<div class="login-card__brand"><img src="assets/sikap-logo-light.svg" alt="SIKAP" /></div>' +
          '<span class="badge badge--teal">' + ic('shield') + 'Akses pegawai BPS Kabupaten Belitung</span>' +
          '<h1>Selamat datang<br /><em>kembali.</em></h1>' +
          '<p class="login-card__sub">Masuk ke akun Anda untuk melanjutkan pengelolaan CKP.</p>' +
          '<form class="login-form" id="login-form" novalidate>' +
            '<div class="field">' +
              '<label for="login-email">Email</label>' +
              '<div class="input-icon">' + ic('mail') +
                '<input class="input" id="login-email" type="email" placeholder="nama@bps.go.id" autocomplete="username" />' +
              '</div>' +
            '</div>' +
            '<div class="field">' +
              '<label for="login-password">Password</label>' +
              '<div class="input-affix">' +
                '<input class="input" id="login-password" type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autocomplete="current-password" />' +
                '<button class="affix-btn" type="button" data-action="toggle-password" aria-label="Tampilkan password">' + ic('eye') + '</button>' +
              '</div>' +
              '<p class="login-note">Lupa password? Hubungi <b>Admin Kepegawaian</b> untuk reset akun.</p>' +
            '</div>' +
            '<button class="btn btn-primary btn-lg btn-block" type="submit" id="login-submit">' + ic('logout') + 'Masuk</button>' +
          '</form>' +
          '<div class="login-helper">Pratinjau: pilih peran pada bilah atas, lalu klik <b>Masuk</b> untuk melihat dashboard.</div>' +
          '<div class="login-card__foot">' +
            '<p>&copy; 2026 BPS Kabupaten Belitung<br />Sistem Informasi Capaian Kinerja Pegawai (SIKAP)</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     RESET PASSWORD
     ───────────────────────────────────────────────────────── */
  function resetPassword() {
    return '<div class="auth-simple"><div class="login-card">' +
      '<div class="login-card__brand"><img src="assets/sikap-logo-light.svg" alt="SIKAP" /></div>' +
      '<span class="badge badge--approved">' + ic('check-circle') + 'Tautan verifikasi valid</span>' +
      '<h1>Atur password<br /><em>baru.</em></h1>' +
      '<p class="login-card__sub">Halaman ini dibuka dari tautan email pemulihan Supabase. Password minimal 6 karakter dan berbeda dari password lama.</p>' +
      '<form class="login-form">' +
        '<div class="field"><label for="rp-1">Password baru</label>' +
          '<div class="input-affix"><input class="input" id="rp-1" type="password" placeholder="Masukkan password baru" />' +
          '<button class="affix-btn" type="button" data-action="toggle-password">' + ic('eye') + '</button></div></div>' +
        '<div class="field"><label for="rp-2">Konfirmasi password baru</label>' +
          '<div class="input-affix"><input class="input" id="rp-2" type="password" placeholder="Ulangi password baru" />' +
          '<button class="affix-btn" type="button" data-action="toggle-password">' + ic('eye') + '</button></div></div>' +
        alertBox({ tone: 'warning', icon: 'alert', title: 'Tautan kedaluwarsa?', text: 'Jika tautan tidak berlaku, minta Admin Kepegawaian mengirim ulang email pemulihan.' }) +
        '<button class="btn btn-primary btn-lg btn-block" type="button" data-action="toast" data-toast="Password berhasil diubah (pratinjau). Silakan masuk kembali.">' + ic('key') + 'Simpan Password Baru</button>' +
      '</form>' +
      '<div class="login-card__foot"><p><span class="auth-link" data-screen="login">&lsaquo; Kembali ke halaman masuk</span></p></div>' +
    '</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DASHBOARD ANGGOTA
     ───────────────────────────────────────────────────────── */
  var uploads = [
    { bulan: 'SEP', bulanFull: 'September', tahun: 2026, status: 'approved', version: 3, file: 'CKP_Dwi_Lestari_September_2026.xlsx', entries: 38, avg: 96, score: '91,4', uploaded: '02 Okt 2026 &middot; 09.14', note: null, open: true },
    { bulan: 'AGU', bulanFull: 'Agustus', tahun: 2026, status: 'scored', version: 1, file: 'CKP_Dwi_Lestari_Agustus_2026.xlsx', entries: 40, avg: 100, score: '92,4', uploaded: '01 Sep 2026 &middot; 08.40', note: null },
    { bulan: 'JUL', bulanFull: 'Juli', tahun: 2026, status: 'revision_required', version: 2, file: 'CKP_Dwi_Lestari_Juli_2026_v2.xlsx', entries: 35, avg: 78, score: '81,5', uploaded: '02 Agu 2026 &middot; 10.05', note: 'Beberapa kegiatan belum dilengkapi tautan bukti dukung. Mohon perbaiki lalu unggah ulang.' },
    { bulan: 'JUN', bulanFull: 'Juni', tahun: 2026, status: 'approved', version: 1, file: 'CKP_Dwi_Lestari_Juni_2026.xlsx', entries: 36, avg: 95, score: '89,7', uploaded: '01 Jul 2026 &middot; 09.55', note: null },
    { bulan: 'MEI', bulanFull: 'Mei', tahun: 2026, status: 'superseded', version: 1, file: 'CKP_Dwi_Lestari_Mei_2026.xlsx', entries: 33, avg: 88, score: '84,1', uploaded: '03 Jun 2026 &middot; 11.20', note: null }
  ];

  function uploadRow(x) {
    var canDelete = x.status !== 'approved' && x.status !== 'superseded';
    var detail = '' +
      '<div class="upload-detail__grid">' +
        '<div><div class="mini-label">Periode</div><div class="mini-value">' + x.bulanFull + ' ' + x.tahun + '</div></div>' +
        '<div><div class="mini-label">Total kegiatan</div><div class="mini-value">' + x.entries + ' kegiatan</div></div>' +
        '<div><div class="mini-label">Rata-rata progres</div><div class="mini-value">' + x.avg + '%</div></div>' +
        '<div><div class="mini-label">Diupload</div><div class="mini-value">' + x.uploaded + '</div></div>' +
      '</div>' +
      (x.file ? '<div class="file-chip">' + ic('sheet') + x.file + '</div>' : '') +
      (x.note ? alertBox({ tone: 'warning', icon: 'message', title: 'Catatan Pimpinan', text: x.note }) : '') +
      '<div class="upload-detail__actions">' +
        '<a class="link" data-screen="detail-ckp" href="#">Lihat detail lengkap ' + ic('arrow-right') + '</a>' +
        (canDelete
          ? '<button class="btn btn-sm btn-danger" data-action="modal" data-modal="delete-ckp">' + ic('trash') + 'Hapus CKP</button>'
          : '<span class="tiny muted">' + ic('lock') + ' Terkunci karena status ' + (x.status === 'approved' ? 'disetujui' : 'arsip') + '</span>') +
      '</div>';

    return '<article class="upload-item' + (x.open ? ' is-open' : '') + '" data-search="' + x.bulanFull + ' ' + x.tahun + ' ' + x.file + '" data-status="' + x.status + '">' +
      '<div class="upload-summary" data-action="expand">' +
        '<div class="month-tile"><strong>' + x.tahun + '</strong><span>' + x.bulan + '</span></div>' +
        '<div><div class="upload-title"><h4>CKP ' + x.bulanFull + ' ' + x.tahun + '</h4>' + badge(x.status) +
          (x.version > 1 ? '<span class="badge badge--draft">v' + x.version + '</span>' : '') + '</div>' +
          '<div class="upload-file">' + ic('sheet') + x.file + '</div>' +
          '<div class="upload-meta">Diupload ' + x.uploaded + ' &middot; ' + x.entries + ' kegiatan</div>' +
        '</div>' +
        '<div class="upload-progress"><span class="val">' + x.avg + '%</span>' + progress(x.avg, x.avg >= 90 ? '' : x.avg >= 70 ? 'gold' : 'coral') + '</div>' +
        ic('chevron-down', 'upload-chev') +
      '</div>' +
      '<div class="upload-detail">' + detail + '</div>' +
    '</article>';
  }

  function uploadGridCard(x) {
    return '<div class="grid-card" data-search="' + x.bulanFull + ' ' + x.tahun + '" data-status="' + x.status + '">' +
      '<div class="grid-card__top"><span class="grid-card__period">' + x.bulanFull + ' ' + x.tahun + '</span>' + badge(x.status) + '</div>' +
      '<div><div class="strong" style="font-size:12.5px">' + x.file + '</div>' +
      '<div class="tiny muted mt-1">' + x.entries + ' kegiatan &middot; v' + x.version + '</div></div>' +
      '<div><div class="row" style="justify-content:space-between"><span class="tiny muted">Progres</span><span class="strong tnum">' + x.avg + '%</span></div>' +
      '<div class="mt-1">' + progress(x.avg) + '</div></div>' +
      '<a class="btn btn-sm btn-soft" data-screen="detail-ckp">Lihat Detail ' + ic('arrow-right') + '</a>' +
    '</div>';
  }

  function dashboardAnggota() {
    return '' +
    pageHead({
      eyebrow: 'Dashboard Anggota &middot; Minggu, 18 Oktober 2026',
      title: 'Selamat pagi, <em>Dwi.</em>',
      sub: 'NIP 199203142015022003 <span class="dot"></span> Statistisi Ahli Muda <span class="badge badge--draft">III/b</span> <span class="badge badge--teal">' + ic('users') + 'Tim Statistik Sosial</span>',
      actions: '<button class="btn btn-secondary" data-action="toast" data-toast="Panduan format file CKP dibuka (pratinjau).">' + ic('file-text') + 'Panduan Format</button>' +
        '<button class="btn btn-primary" data-screen="upload-ckp">' + ic('plus') + 'Upload CKP</button>'
    }) +
    alertBox({
      tone: 'attention', icon: 'info',
      title: 'CKP Oktober 2026 belum diunggah',
      text: 'Batas unggah tanggal 25 Oktober 2026 &middot; periode triwulan IV.',
      action: '<button class="btn btn-sm btn-primary" data-screen="upload-ckp">Upload sekarang</button>'
    }) +
    alertBox({
      tone: 'danger', icon: 'alert',
      title: '1 CKP perlu revisi',
      text: 'CKP Juli 2026 dikembalikan pimpinan: beberapa kegiatan belum dilengkapi bukti dukung.',
      action: '<button class="btn btn-sm btn-danger" data-screen="detail-ckp">Lihat CKP</button>'
    }) +

    '<div class="stat-grid">' +
      stat({ label: 'Total Upload', value: '12', sub: 'semua periode', icon: 'file-text' }) +
      stat({ label: 'Rata-rata Progres', value: '89<small>%</small>', sub: 'dari seluruh kegiatan', icon: 'trending-up', iconTone: 'stat__icon--sage', spark: sparkline([62, 74, 70, 82, 86, 89], 'var(--sage)') }) +
      stat({ label: 'Disetujui', value: '9', sub: 'dari 12 upload', icon: 'check-circle', iconTone: 'stat__icon--sage' }) +
      stat({ label: 'Menunggu Review', value: '2', sub: 'belum diproses', icon: 'clock', iconTone: 'stat__icon--coral' }) +
    '</div>' +

    '<div class="dash-split">' +
      '<div class="card">' +
        sectionHead({
          title: 'Riwayat Upload CKP',
          sub: '5 upload ditampilkan dari 12 tercatat',
          right:
            '<div class="search-field" style="width:230px">' + ic('search') +
              '<input type="search" placeholder="Cari periode atau file…" data-filter="#history-area" aria-label="Cari upload" /></div>' +
            select([{ value: 'all', label: 'Semua Status' }, { value: 'submitted', label: 'Menunggu Review' }, { value: 'scored', label: 'Sudah Dinilai' }, { value: 'approved', label: 'Disetujui' }, { value: 'revision_required', label: 'Perlu Revisi' }], 'all', 'data-status-filter="#history-area" style="width:170px;height:42px;border-radius:11px;border:1px solid var(--line);background:var(--surface);padding:0 34px 0 13px;font-size:12.5px;font-weight:600"') +
            '<button class="btn btn-secondary btn-sm" data-action="sort" data-target="#history-area">' + ic('sliders') + 'Urutkan</button>' +
            '<div class="seg" data-view-group="uploads">' +
              '<button class="seg__btn is-active" data-view="list">' + ic('list') + 'List</button>' +
              '<button class="seg__btn" data-view="grid">' + ic('grid') + 'Grid</button>' +
            '</div>'
        }) +
        '<div id="history-area">' +
          '<div class="upload-list" data-view-pane="list">' + uploads.map(uploadRow).join('') + '</div>' +
          '<div class="upload-grid" data-view-pane="grid">' + uploads.map(uploadGridCard).join('') + '</div>' +
          '<div class="empty is-hidden" data-empty-for="#history-area">' + ic('folder') + '<div class="empty__title">Tidak ada hasil</div><div class="empty__text">Coba ubah kata kunci atau filter status.</div></div>' +
        '</div>' +
      '</div>' +

      '<div class="stack">' +
        '<div class="card focus-card">' +
          ring(0, 'Oktober', { text: '0/1' }) +
          '<h3>Fokus bulan ini</h3>' +
          '<p>1 periode menunggu diunggah. Batas waktu <b>25 Oktober 2026</b>.</p>' +
          '<div class="focus-list">' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Siapkan file Excel CKP Oktober 2026 (format .xlsx, maks 5 MB).</span></div>' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Periksa cakupan hari kerja pada preview kalender.</span></div>' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Pantau status penilaian pada riwayat upload di bawah.</span></div>' +
          '</div>' +
          '<button class="btn btn-primary btn-block" data-screen="upload-ckp">' + ic('upload') + 'Mulai Upload CKP</button>' +
        '</div>' +

        '<div class="card">' +
          '<div class="card-head"><div class="card-head__main"><div class="card-title">Aktivitas Terakhir</div>' +
          '<div class="card-desc">Jejak review terbaru pada CKP Anda</div></div>' + ic('activity') + '</div>' +
          '<div class="card-body" style="padding-top:16px">' +
            '<div class="timeline">' +
              '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('check-circle') + '</span><span class="timeline__line"></span></div>' +
                '<div><div class="timeline__title">CKP September 2026 disetujui</div><div class="timeline__time">02 Okt 2026 &middot; 09.14 &middot; oleh Radina Kartika</div></div></div>' +
              '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('spark') + '</span><span class="timeline__line"></span></div>' +
                '<div><div class="timeline__title">Nilai CKP Agustus 2026 keluar: 92,4</div><div class="timeline__time">05 Sep 2026 &middot; 14.20 &middot; Aditya Pratama</div></div></div>' +
              '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--coral">' + ic('alert') + '</span><span class="timeline__line"></span></div>' +
                '<div><div class="timeline__title">Revisi CKP Juli 2026 diminta</div><div class="timeline__time">02 Agu 2026 &middot; 10.42 &middot; Radina Kartika</div></div></div>' +
              '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--gold">' + ic('send') + '</span></div>' +
                '<div><div class="timeline__title">CKP Juni 2026 diunggah (v1)</div><div class="timeline__time">01 Jul 2026 &middot; 09.55</div></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     UPLOAD CKP (wizard 3 langkah)
     ───────────────────────────────────────────────────────── */
  function calendarGrid(month, year, opts) {
    opts = opts || {};
    var filled = opts.filled || [];
    var empty = opts.empty || [];
    var off = opts.off || [];
    var out = opts.out || [];
    var days = opts.days || 31;
    var lead = opts.lead || 0; /* jumlah sel kosong sebelum tanggal 1 */
    var cells = '';
    var i;
    for (i = 0; i < lead; i++) cells += '<div class="cal-day cal-day--out"><span class="cal-day__num">&nbsp;</span></div>';
    for (i = 1; i <= days; i++) {
      var isOff = off.indexOf(i) !== -1;
      var isFilled = filled.indexOf(i) !== -1;
      var isEmpty = empty.indexOf(i) !== -1;
      var cls = 'cal-day';
      if (isOff) cls += ' cal-day--off';
      if (isFilled) cls += ' cal-day--filled';
      if (isEmpty) cls += ' cal-day--empty';
      var dots = '';
      if (isFilled) {
        var n = 1 + (i % 3);
        for (var d = 0; d < n; d++) dots += '<i></i>';
      }
      var tag = isFilled ? '<span class="cal-day__tag">Terisi</span>' : (isEmpty ? '<span class="cal-day__tag">Kosong</span>' : '');
      cells += '<div class="' + cls + '"><span class="cal-day__num">' + i + '</span>' +
        '<div class="cal-day__dots">' + dots + '</div>' + tag + '</div>';
    }
    var total = lead + days;
    var tail = (7 - (total % 7)) % 7;
    for (i = 0; i < tail; i++) cells += '<div class="cal-day cal-day--out"><span class="cal-day__num">&nbsp;</span></div>';

    return '<div class="calendar">' +
      '<div class="calendar__head">' +
        '<div class="calendar__title">' + ic('calendar') + (opts.title || 'Kalender Hari Kerja') +
          '<span class="tiny muted">(' + (opts.periodLabel || '') + ')</span></div>' +
        '<div class="calendar__legend">' +
          '<span>' + (opts.filledCount || 0) + ' dari ' + (opts.workDays || 0) + ' hari kerja terisi</span>' +
          (opts.emptyCount
            ? '<span class="badge badge--muted">' + ic('clock') + opts.emptyCount + ' belum terisi</span>'
            : '<span class="badge badge--approved">' + ic('check') + 'Lengkap</span>') +
        '</div>' +
      '</div>' +
      '<div class="calendar__weekdays"><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span></div>' +
      '<div class="calendar__grid">' + cells + '</div>' +
    '</div>';
  }

  var previewRows = [
    ['Meningkatnya kualitas data statistik sosial', 'Pendataan lapangan Survei Sosial Ekonomi Nasional (Susenas) Oktober 2026', '01 Okt 2026', '04 Okt 2026', 100, 'drive.google.com/susenas-okt'],
    ['Meningkatnya kualitas data statistik sosial', 'Rekonsiliasi data hasil pendataan dengan Dinas Sosial', '05 Okt 2026', '07 Okt 2026', 90, 'drive.google.com/rekon-sosial'],
    ['Penguatan metadata statistik', 'Penyusunan kamus variabel kegiatan statistik triwulan IV', '06 Okt 2026', '10 Okt 2026', 85, 'drive.google.com/kamus-var'],
    ['Penguatan metadata statistik', 'Validasi struktur data kegiatan statistik', '08 Okt 2026', '09 Okt 2026', 100, 'drive.google.com/validasi'],
    ['Peningkatan diseminasi data', 'Penyusunan bahan rilis Berita Resmi Statistik', '09 Okt 2026', '13 Okt 2026', 75, 'drive.google.com/brs-okt'],
    ['Peningkatan diseminasi data', 'Uji petik kualitas data publikasi', '12 Okt 2026', '14 Okt 2026', 80, '&mdash;'],
    ['Perencanaan dan penganggaran', 'Monitoring realisasi anggaran triwulan IV', '13 Okt 2026', '16 Okt 2026', 100, 'drive.google.com/realisasi'],
    ['Perencanaan dan penganggaran', 'Penyusunan laporan kinerja bulanan', '15 Okt 2026', '16 Okt 2026', 60, 'drive.google.com/lapkin'],
    ['Meningkatnya kualitas data statistik sosial', 'Supervisi petugas pendataan kecamatan Sijuk', '16 Okt 2026', '16 Okt 2026', 100, 'drive.google.com/supervisi'],
    ['Pengelolaan kepegawaian', 'Penyiapan laporan administrasi kepegawaian', '17 Okt 2026', '19 Okt 2026', 40, '&mdash;']
  ];

  function uploadCkp() {
    var rows = previewRows.map(function (r, i) {
      return '<tr>' +
        '<td class="center tnum">' + (i + 1) + '</td>' +
        '<td><div style="font-size:12px;line-height:1.5">' + r[0] + '</div></td>' +
        '<td><div style="font-size:12px;line-height:1.5">' + r[1] + '</div></td>' +
        '<td class="tiny">Mulai: ' + r[2] + '<br />Selesai: ' + r[3] + '</td>' +
        '<td class="center"><span class="badge badge--teal">' + r[4] + '%</span></td>' +
        '<td>' + (String(r[5]).indexOf('drive') === 0 ? '<a class="link" href="#" data-action="toast" data-toast="Membuka tautan bukti dukung (pratinjau).">' + ic('external') + ' Lihat bukti</a>' : '<span class="tiny muted">' + r[5] + '</span>') + '</td>' +
      '</tr>';
    }).join('');

    return '' +
    '<div class="row mb-3"><a class="btn btn-sm btn-ghost" data-screen="dashboard-anggota" href="#">' + ic('arrow-left') + 'Kembali ke Dashboard</a></div>' +
    pageHead({
      eyebrow: 'Upload CKP &middot; Langkah 1&ndash;3',
      title: 'Upload <em>CKP</em> Anda',
      sub: 'Periode aktif: <b>Oktober 2026</b> <span class="dot"></span> triwulan IV',
      actions: '<span class="badge badge--approved">' + ic('unlock') + 'Periode terbuka</span>'
    }) +

    '<div class="stepper" id="upload-stepper">' +
      '<button class="step is-done" data-step="1"><span class="step__num">' + ic('check') + '</span><span class="step__label">Periode &amp; File</span></button>' +
      '<span class="step-div"></span>' +
      '<button class="step is-active" data-step="2"><span class="step__num">2</span><span class="step__label">Preview &amp; Kalender</span></button>' +
      '<span class="step-div"></span>' +
      '<button class="step" data-step="3"><span class="step__num">3</span><span class="step__label">Petakan RK (bila perlu)</span></button>' +
    '</div>' +

    /* Step 1 */
    '<div class="wizard-pane" data-step-pane="1"><div class="dash-split">' +
      '<div class="stack">' +
        '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">1. Periode &amp; File CKP</div>' +
          '<div class="card-desc">Pilih bulan/tahun, lalu unggah file Excel CKP (.xlsx / .xls).</div></div></div>' +
          '<div class="card-body stack">' +
            '<div class="period-row">' +
              '<div class="field"><label>Bulan</label>' + select([{ value: '10', label: 'Oktober' }, { value: '9', label: 'September' }, { value: '11', label: 'November' }], '10', 'style="height:42px"') + '</div>' +
              '<div class="field field--year"><label>Tahun</label>' + select([{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }], '2026', 'style="height:42px"') + '</div>' +
            '</div>' +
            alertBox({ tone: 'info', icon: 'info', title: 'Belum ada unggahan untuk periode ini', text: 'Submit akan mencatat <b>v1</b>. Bila kemudian perlu revisi, unggahan berikutnya menjadi v2 dan nilai lama dipertahankan bila susunan kegiatan sama.' }) +
            '<div class="field"><label>File Excel CKP</label>' +
              '<div class="dropzone dropzone--filled"><input type="file" accept=".xlsx,.xls" aria-label="Pilih file Excel CKP" />' +
                '<span class="dropzone__icon">' + ic('sheet') + '</span>' +
                '<div class="dropzone__title">CKP_Dwi_Lestari_Okt_2026.xlsx</div>' +
                '<div class="dropzone__text">84,2 KB &middot; file berhasil dibaca</div>' +
                '<div class="mt-2"><button class="btn btn-sm btn-secondary" type="button" data-action="toast" data-toast="Pilih file lain (pratinjau).">Ganti File</button></div>' +
              '</div>' +
            '</div>' +
            alertBox({ tone: 'success', icon: 'check-circle', title: 'File terbaca: 42 baris siap dipreview', text: 'Kolom wajib "Kegiatan" terdeteksi. Kolom tambahan disimpan sebagai extra column.' }) +
            '<div class="row" style="justify-content:flex-end"><button class="btn btn-primary" data-action="step" data-step="2">Lanjut ke Preview ' + ic('arrow-right') + '</button></div>' +
          '</div></div>' +
      '</div>' +
      '<div class="stack">' +
        '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Panduan Singkat</div>' +
          '<div class="card-desc">Agar berkas diterima sistem</div></div>' + ic('info') + '</div>' +
          '<div class="card-body stack" style="padding-top:16px">' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Gunakan template CKP resmi dengan sheet pertama berisi data harian.</span></div>' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Kolom wajib: <b>Kegiatan</b>; kolom lain dikenali fleksibel.</span></div>' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Ukuran maksimal 5 MB, format .xlsx atau .xls.</span></div>' +
            '<div class="checkline"><span class="tick">' + ic('check') + '</span><span>Baris di luar periode triwulan akan diabaikan otomatis.</span></div>' +
            '<hr class="hr" /><div class="tiny muted">Periode bulan ke-3 triwulan (Oktober): 26 September &ndash; 31 Oktober 2026.</div>' +
          '</div></div>' +
        '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Ketentuan Versi</div>' +
          '<div class="card-desc">Jumlah versi &amp; preservasi nilai</div></div></div>' +
          '<div class="card-body" style="padding-top:16px"><div class="timeline">' +
            '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('upload') + '</span><span class="timeline__line"></span></div>' +
              '<div><div class="timeline__title">v1 &middot; unggahan pertama</div><div class="timeline__time">42 baris siap disubmit</div></div></div>' +
            '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--gold">' + ic('refresh') + '</span></div>' +
              '<div><div class="timeline__title">v2 &middot; bila revisi diperlukan</div><div class="timeline__time">versi lama otomatis diarsipkan</div></div></div>' +
          '</div></div></div>' +
      '</div>' +
    '</div></div>' +

    /* Step 2 */
    '<div class="wizard-pane is-active" data-step-pane="2"><div class="stack">' +
      '<div class="row" style="justify-content:space-between">' +
        '<button class="btn btn-sm btn-secondary" data-action="step" data-step="1">' + ic('arrow-left') + 'Kembali / Upload Ulang</button>' +
        '<span class="tiny muted">Periode: Oktober 2026 &middot; 42 baris terbaca</span>' +
      '</div>' +
      '<div class="card"><div class="card-head"><div class="card-head__main">' +
        '<div class="card-title">' + ic('sheet') + ' Preview Data Kegiatan</div>' +
        '<div class="card-desc">Periksa data yang terbaca dari file Excel. Menampilkan 10 dari 42 baris pertama; keseluruhan data tetap akan diunggah.</div></div>' +
        '<span class="badge badge--approved">' + ic('check-circle') + '42 baris valid</span></div>' +
        '<div class="preview-table-wrap"><table class="data"><thead><tr>' +
          '<th class="center" style="width:48px">No</th><th style="width:24%">Rencana Kinerja</th><th style="width:30%">Kegiatan</th><th style="width:150px">Tanggal</th><th class="center" style="width:92px">Progres</th><th>Bukti Dukung</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</div>' +

      '<div class="card"><div class="card-head"><div class="card-head__main">' +
        '<div class="card-title">' + ic('calendar') + ' Preview Kalender Kerja Periode</div>' +
        '<div class="card-desc">Pastikan tidak ada kegiatan harian yang terlewat pada hari kerja.</div></div></div>' +
        '<div class="card-body">' +
          calendarGrid(10, 2026, {
            title: 'Kalender Hari Kerja', periodLabel: '26 September &ndash; 31 Oktober 2026',
            workDays: 22, filledCount: 19, emptyCount: 3,
            lead: 2, days: 31,
            off: [3, 4, 10, 11, 17, 18, 24, 25, 31],
            filled: [1, 2, 5, 7, 8, 9, 12, 13, 15, 16, 19, 20, 22, 23, 26, 27, 28, 29, 30],
            empty: [6, 14, 21]
          }) +
          '<div class="row mt-3" style="justify-content:space-between">' +
            '<span class="small muted">' + ic('alert') + ' Terdapat <b>3 hari kerja belum terisi</b> &mdash; tetap dapat disubmit jika merupakan tanggal merah/libur.</span>' +
            '<button class="btn btn-primary btn-lg" data-action="modal" data-modal="upload-progress">' + ic('send') + 'Submit CKP Oktober 2026</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></div>' +

    /* Step 3 */
    '<div class="wizard-pane" data-step-pane="3"><div class="stack">' +
      alertBox({ tone: 'warning', icon: 'alert', title: '1 Rencana Kinerja belum dikenali', text: 'RK dengan teks di bawah tidak cocok otomatis (exact, sub-RK, maupun fuzzy). Petakan manual ke Tim Kerja dan RK Master sebelum melanjutkan.' }) +
      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">Mapping Tim Kerja</div>' +
        '<div class="card-desc">Beberapa RK belum memiliki tim kerja.</div></div></div>' +
        '<div class="card-body">' +
          '<div style="border:1px solid var(--line);border-radius:14px;padding:16px">' +
            '<div class="strong small mb-2">Teks yang tidak dikenali: "Koordinasi dan supervisi kegiatan statistik wilayah"</div>' +
            '<div class="grid-2">' +
              '<div class="field"><label>1. Pilih Tim Kerja</label>' + select([{ value: '', label: '-- Pilih Tim --' }, { value: 'sosial', label: 'Statistik Sosial' }, { value: 'produksi', label: 'Statistik Produksi' }, { value: 'distribusi', label: 'Statistik Distribusi &amp; Jasa' }], 'sosial', 'style="height:42px"') + '</div>' +
              '<div class="field"><label>2. Pilih Rencana Kinerja Master</label>' + select([{ value: '', label: '-- Pilih RK Master --' }, { value: 'rk1', label: 'Meningkatnya kualitas data statistik sosial' }, { value: 'rk2', label: 'Penguatan metadata statistik' }], '', 'style="height:42px"') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="row mt-3" style="justify-content:flex-end">' +
            '<button class="btn btn-secondary" data-action="step" data-step="2">' + ic('arrow-left') + 'Kembali</button>' +
            '<button class="btn btn-primary" data-action="toast" data-toast="Mapping tersimpan. Melanjutkan proses upload…">Lanjutkan Upload ' + ic('arrow-right') + '</button>' +
          '</div>' +
        '</div></div>' +
    '</div></div>';
  }

  /* ─────────────────────────────────────────────────────────
     DETAIL CKP
     ───────────────────────────────────────────────────────── */
  var detailEntries = [
    { day: '06', mon: 'JUL', rk: 'Meningkatnya kualitas data statistik sosial', title: 'Pendataan Survei Sosial Ekonomi Nasional (Susenas) Juli 2026', outcome: '320 rumah tangga selesai didata (100% dari target sampel kecamatan)', date: '06 Jul 2026', time: '08.00 &ndash; 15.30', progress: 100, score: '92', evidence: 'drive.google.com/susenas-jul', flag: null, open: true },
    { day: '09', mon: 'JUL', rk: 'Penguatan metadata statistik', title: 'Penyusunan kamus variabel kegiatan statistik triwulan III', outcome: 'Draf kamus variabel 48 indikator selesai direview internal', date: '09 Jul 2026', time: '09.00 &ndash; 14.00', progress: 78, score: '81', evidence: null, flag: 'Lengkapi tautan bukti dukung dan unggah ulang pada versi berikutnya.' },
    { day: '13', mon: 'JUL', rk: 'Meningkatnya kualitas data statistik sosial', title: 'Rekonsiliasi data hasil pendataan dengan Dinas Sosial', outcome: 'Data 12 desa tervalidasi; 3 anomali diselesaikan bersama mitra', date: '13 Jul 2026', time: '08.30 &ndash; 12.00', progress: 90, score: '88', evidence: 'drive.google.com/rekon-jul', flag: null },
    { day: '17', mon: 'JUL', rk: 'Peningkatan diseminasi data', title: 'Penyusunan bahan rilis Berita Resmi Statistik Juli 2026', outcome: 'Bahan rilis 6 indikator strategis disetujui koordinator', date: '17 Jul 2026', time: '08.00 &ndash; 16.00', progress: 65, score: '76', evidence: 'drive.google.com/brs-jul', flag: null }
  ];

  function entryCard(e, i) {
    return '<article class="entry' + (e.flag ? ' entry--flagged' : '') + (e.open ? ' is-open' : '') + '">' +
      '<div class="entry__main" data-action="expand">' +
        '<div class="date-tile"><strong>' + e.day + '</strong><span>' + e.mon + '</span></div>' +
        '<div><div class="entry__rk"><span class="rk-name" title="' + e.rk + '">' + e.rk + '</span>' +
          (e.flag ? badge('revision', 'Perlu perbaikan') : '') + '</div>' +
          '<div class="entry__title">' + e.title + '</div>' +
          '<div class="entry__outcome">' + e.outcome + '</div>' +
          '<div class="entry__meta"><span>' + ic('calendar') + e.date + '</span><span>' + ic('clock') + e.time + '</span><span>Baris #' + (i + 1) + '</span></div>' +
        '</div>' +
        '<div class="entry__score"><div class="v">' + (e.score || '&mdash;') + '</div><div class="l">Nilai SKP</div></div>' +
        '<div class="entry__progress"><span class="v">' + e.progress + '%</span>' + progress(e.progress, e.progress >= 100 ? '' : 'gold') + '</div>' +
        ic('chevron-down', 'entry__toggle') +
      '</div>' +
      '<div class="entry__detail">' +
        (e.evidence ? '<div class="mb-2">' + evidence() + '</div>' : '<div class="tiny muted mb-2">Tidak ada bukti dukung.</div>') +
        (e.flag ? '<div class="note-flag">' + ic('alert') + '<div><b>Catatan Perbaikan</b><br />' + e.flag + '</div></div>' : '') +
        '<div class="entry__detail-grid mt-2">' +
          '<div><div class="mini-label">Tanggal</div><div class="mini-value">' + e.date + '</div></div>' +
          '<div><div class="mini-label">Waktu</div><div class="mini-value">' + e.time + '</div></div>' +
          '<div><div class="mini-label">Progres</div><div class="mini-value">' + e.progress + '%</div></div>' +
          '<div><div class="mini-label">No. Baris</div><div class="mini-value">#' + (i + 1) + '</div></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function detailCkp() {
    return '' +
    '<div class="row mb-3"><a class="btn btn-sm btn-ghost" href="#" data-screen="dashboard-anggota">' + ic('arrow-left') + 'Kembali</a></div>' +
    pageHead({
      eyebrow: 'Dashboard &rsaquo; CKP &rsaquo; Juli 2026',
      title: 'CKP <em>Juli</em> 2026',
      sub: badge('revision_required') + '<span class="badge badge--draft">v2</span> <span class="dot"></span> Diunggah 02 Agu 2026 &middot; 10.05 <span class="dot"></span> Terakhir diperbarui 02 Agu 2026 &middot; 10.42',
      actions:
        '<button class="btn btn-primary" data-action="toast" data-toast="File Excel detail CKP berhasil diunduh (pratinjau).">' + ic('download') + 'Export Excel</button>' +
        '<button class="btn btn-secondary" data-screen="upload-ckp">' + ic('refresh') + 'Upload Ulang</button>' +
        '<button class="btn btn-danger" data-action="modal" data-modal="delete-ckp">' + ic('trash') + 'Hapus CKP</button>'
    }) +
    alertBox({ tone: 'warning', icon: 'message', title: 'Catatan Pimpinan', text: 'Beberapa kegiatan belum dilengkapi tautan bukti dukung. Mohon perbaiki lalu unggah ulang.' }) +
    alertBox({ tone: 'danger', icon: 'alert', title: 'CKP ini perlu revisi', text: 'Perbaiki berkas sesuai catatan, lalu unggah ulang. Nilai versi lama akan dipertahankan bila susunan kegiatan sama.', action: '<button class="btn btn-sm btn-danger" data-screen="upload-ckp">Upload Ulang</button>' }) +

    '<div class="stat-grid">' +
      stat({ label: 'Total Kegiatan', value: '35', sub: 'rencana kegiatan periode ini', icon: 'list-checks' }) +
      stat({ label: 'Rata-rata Progres', value: '78<small>%</small>', sub: 'rata-rata seluruh kegiatan', icon: 'trending-up', iconTone: 'stat__icon--gold', spark: sparkline([54, 66, 62, 74, 72, 78], 'var(--gold)') }) +
      stat({ label: 'Dokumen Pendukung', value: '12', sub: 'bukti dukung diunggah', icon: 'folder', iconTone: 'stat__icon--info' }) +
      stat({ label: 'Rata-rata Nilai', value: '82,0', sub: 'nilai capaian SKP', icon: 'award', iconTone: 'stat__icon--sage' }) +
    '</div>' +

    sectionHead({
      title: 'Daftar Kegiatan',
      sub: 'Menampilkan 4 dari 35 kegiatan',
      right:
        '<div class="seg" data-view-group="detail">' +
          '<button class="seg__btn is-active" data-view="list">' + ic('list') + 'List</button>' +
          '<button class="seg__btn" data-view="calendar">' + ic('calendar') + 'Kalender</button>' +
        '</div>' +
        '<div class="search-field" style="width:240px">' + ic('search') + '<input type="search" placeholder="Cari kegiatan…" data-filter="#entry-area" /></div>' +
        '<button class="btn btn-secondary btn-sm" data-action="toast" data-toast="Filter lanjutan dibuka (pratinjau).">' + ic('sliders') + 'Filter</button>'
    }) +
    '<div id="entry-area">' +
      '<div class="entry-list" data-view-pane="list">' + detailEntries.map(entryCard).join('') + '</div>' +
      '<div data-view-pane="calendar" class="is-hidden">' +
        calendarGrid(7, 2026, {
          title: 'Kalender Hari Kerja', periodLabel: '26 Juni &ndash; 31 Juli 2026',
          workDays: 23, filledCount: 18, emptyCount: 5,
          lead: 2, days: 31,
          off: [4, 5, 11, 12, 18, 19, 25, 26],
          filled: [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24],
          empty: [27, 28, 29, 30, 31]
        }) +
      '</div>' +
      '<div class="empty is-hidden" data-empty-for="#entry-area"><span class="empty__icon">' + ic('search') + '</span><div class="empty__title">Tidak ada kegiatan ditemukan</div><div class="empty__text">Coba kata kunci lain.</div></div>' +
    '</div>' +

    '<div class="grid-2 mt-4">' +
      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">' + ic('message') + ' Riwayat Review</div>' +
        '<div class="card-desc">Tindakan pimpinan terhadap CKP ini</div></div></div>' +
        '<div class="card-body pt-0" style="padding-top:16px"><div class="timeline">' +
          '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--coral">' + ic('alert') + '</span><span class="timeline__line"></span></div>' +
            '<div><div class="timeline__title">Perlu Revisi</div><div class="timeline__time">02 Agu 2026 &middot; 10.42 &middot; oleh Dra. Radina Kartika, M.Si.</div>' +
            '<div class="note-flag" style="margin-top:8px">' + ic('message') + '<div>Beberapa kegiatan belum dilengkapi tautan bukti dukung. Mohon perbaiki lalu unggah ulang.</div></div></div></div>' +
          '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot timeline__dot--gold">' + ic('unlock') + '</span><span class="timeline__line"></span></div>' +
            '<div><div class="timeline__title">Dibuka Kembali</div><div class="timeline__time">02 Agu 2026 &middot; 10.38 &middot; oleh Dra. Radina Kartika, M.Si.</div></div></div>' +
          '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('check-circle') + '</span><span class="timeline__line"></span></div>' +
            '<div><div class="timeline__title">Disetujui (v1)</div><div class="timeline__time">30 Jul 2026 &middot; 15.20 &middot; oleh Dra. Radina Kartika, M.Si.</div></div></div>' +
          '<div class="timeline__item"><div class="timeline__rail"><span class="timeline__dot">' + ic('send') + '</span></div>' +
            '<div><div class="timeline__title">Dikirim (v1)</div><div class="timeline__time">28 Jul 2026 &middot; 09.10 &middot; oleh Dwi Lestari</div></div></div>' +
        '</div></div></div>' +

      '<div class="card"><div class="card-head"><div class="card-head__main"><div class="card-title">' + ic('info') + ' Ringkasan Berkas</div>' +
        '<div class="card-desc">Informasi teknis unggahan periode ini</div></div></div>' +
        '<div class="card-body stack" style="padding-top:16px">' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Nama file</span><span class="small strong truncate" style="max-width:230px">CKP_Dwi_Lestari_Juli_2026_v2.xlsx</span></div>' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Versi</span><span class="small strong">v2 (versi terbaru)</span></div>' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Ukuran</span><span class="small strong">96,4 KB</span></div>' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Disimpan di Storage</span><span class="small strong">ckp-files/{userId}/2026/7</span></div>' +
          '<hr class="hr" />' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Pemilik RK</span><span class="small strong">Aditya Pratama</span></div>' +
          '<div class="row" style="justify-content:space-between"><span class="small muted">Status penguncian</span>' + badge('revision_required') + '</div>' +
          '<button class="btn btn-secondary btn-block" data-action="toast" data-toast="Berkas asli diunduh dari Storage (pratinjau).">' + ic('download') + 'Unduh berkas asli</button>' +
        '</div></div>' +
    '</div>';
  }

  /* ─────────────────────────────────────────────────────────
     EVALUASI PENILAIAN (dokumen resmi)
     ───────────────────────────────────────────────────────── */
  var evalGroups = [
    {
      rk: 'Meningkatnya kualitas data statistik sosial',
      items: [
        'Pendataan lapangan Survei Sosial Ekonomi Nasional (Susenas) September 2026 (100%)',
        'Rekonsiliasi data hasil pendataan dengan Dinas Sosial Kabupaten Belitung (100%)',
        'Supervisi petugas pendataan kecamatan Sijuk dan Badau (100%)'
      ],
      label: 'Diatas Ekspektasi', tone: 'up', score: '99,0'
    },
    {
      rk: 'Penguatan metadata statistik',
      items: [
        'Penyusunan kamus variabel kegiatan statistik triwulan III (100%)',
        'Validasi struktur data kegiatan statistik (100%)'
      ],
      label: 'Sesuai Ekspektasi', tone: 'ok', score: '94,0'
    },
    {
      rk: 'Peningkatan diseminasi data',
      items: [
        'Penyusunan bahan rilis Berita Resmi Statistik September 2026 (100%)',
        'Diseminasi data melalui kanal resmi BPS (100%)'
      ],
      label: 'Sesuai Ekspektasi', tone: 'ok', score: '91,5'
    },
    {
      rk: 'Perencanaan dan penganggaran',
      items: [
        'Monitoring realisasi anggaran triwulan III (100%)',
        'Penyusunan laporan kinerja bulanan (100%)'
      ],
      label: 'Sesuai Ekspektasi', tone: 'ok', score: '90,0'
    },
    {
      rk: 'Pengelolaan kepegawaian',
      items: [
        'Penyiapan laporan administrasi kepegawaian (100%)'
      ],
      label: 'Dibawah Ekspektasi', tone: 'low', score: '78,0'
    }
  ];

  function evaluationDoc() {
    var rows = evalGroups.map(function (g, i) {
      return '<tr>' +
        '<td class="center" style="font-weight:700">' + (i + 1) + '</td>' +
        '<td class="rk-cell">' + g.rk + '</td>' +
        '<td><div class="row" style="gap:6px;flex-direction:column;align-items:flex-start">' +
          g.items.map(function (it) { return '<span>' + it + '</span>'; }).join('') +
        '</div><div class="tiny" style="color:#5B6560;margin-top:5px">Bukti dukung: drive.google.com/ckp-dwi-sep2026</div></td>' +
        '<td class="feed"><span class="doc-feedback doc-feedback--' + g.tone + '">' +
          (g.tone === 'low' ? ic('frown') : ic('smile')) + g.label + '</span>' +
          '<div class="tiny" style="margin-top:5px;font-weight:700;color:#5B6560">Nilai: ' + g.score + '</div></td>' +
      '</tr>';
    }).join('');

    return '' +
    pageHead({
      eyebrow: 'Evaluasi Penilaian &middot; semua peran',
      title: 'Evaluasi <em>Penilaian</em> Bulanan',
      sub: 'Rekap evaluasi kinerja bulanan pegawai resmi pejabat penilai kinerja.',
      actions:
        '<div data-roles="pimpinan admin"><button class="btn btn-soft" data-action="toast" data-toast="Menyiapkan ZIP evaluasi 26 pegawai… (pratinjau)">' + ic('archive') + 'Download Semua (26 ZIP)</button></div>' +
        '<button class="btn btn-primary" data-action="toast" data-toast="PDF evalusi kinerja berhasil diunduh (pratinjau).">' + ic('download') + 'Download PDF</button>' +
        '<button class="btn btn-secondary" data-action="print">' + ic('printer') + 'Cetak / Print</button>'
    }) +

    '<div class="card mb-4 no-print"><div class="card-body">' +
      '<div class="grid-4" style="align-items:end">' +
        '<div class="field"><label>Bulan</label>' + select([{ value: '9', label: 'September' }, { value: '8', label: 'Agustus' }, { value: '10', label: 'Oktober' }], '9', 'style="height:42px"') + '</div>' +
        '<div class="field"><label>Tahun</label>' + select([{ value: '2026', label: '2026' }, { value: '2025', label: '2025' }], '2026', 'style="height:42px"') + '</div>' +
        '<div class="field" data-roles="pimpinan admin"><label>Pilih Pegawai</label>' + select([{ value: 'dwi', label: 'Dwi Lestari — Statistisi Ahli Muda ✓' }, { value: 'fajar', label: 'Fajar Nugroho ✓' }, { value: 'intan', label: 'Intan Permata (belum ada CKP)' }], 'dwi', 'style="height:42px"') + '</div>' +
        '<div class="field"><label>Tanggal Cetak Dokumen</label><input class="input" value="18 Oktober 2026" /></div>' +
      '</div>' +
      '<div class="mt-3">' + alertBox({ tone: 'success', icon: 'check-circle', title: 'Ditemukan CKP versi 3 (38 kegiatan, 5 Rencana Kinerja) &mdash; Disetujui 02 Oktober 2026' }) + '</div>' +
    '</div></div>' +

    '<div class="doc-sheet" id="eval-doc">' +
      '<div class="doc-sheet__head">' +
        '<h2>Evaluasi Kinerja Pegawai</h2>' +
        '<h3>Pendekatan Hasil Kerja Kualitatif</h3>' +
        '<p>Periode: Bulan September 2026</p>' +
      '</div>' +
      '<div class="doc-sheet__meta"><span class="strong" style="color:#12201C">Badan Pusat Statistik</span>' +
        '<span>Periode Penilaian: 26 Agustus s.d. 30 September 2026</span></div>' +

      '<table class="doc-table mb-4"><thead><tr>' +
        '<th style="width:40px">No</th><th colspan="2">Pegawai yang Dinilai</th><th style="width:40px">No</th><th colspan="2">Pejabat Penilai Kinerja</th>' +
      '</tr></thead><tbody>' +
        '<tr><td class="center">1</td><td class="lbl">Nama</td><td style="font-weight:800">Dwi Lestari, S.Stat.</td><td class="center">1</td><td class="lbl">Nama</td><td style="font-weight:800">Dra. Radina Kartika, M.Si.</td></tr>' +
        '<tr><td class="center">2</td><td class="lbl">NIP</td><td>199203142015022003</td><td class="center">2</td><td class="lbl">NIP</td><td>197505121999032001</td></tr>' +
        '<tr><td class="center">3</td><td class="lbl">Pangkat / Golongan</td><td>Penata Muda Tk.I, III/b</td><td class="center">3</td><td class="lbl">Pangkat / Golongan</td><td>Pembina Tk.I, IV/b</td></tr>' +
        '<tr><td class="center">4</td><td class="lbl">Jabatan</td><td>Statistisi Ahli Muda</td><td class="center">4</td><td class="lbl">Jabatan</td><td>Kepala BPS Kabupaten Belitung</td></tr>' +
        '<tr><td class="center">5</td><td class="lbl">Unit Kerja</td><td>BPS Kabupaten Belitung</td><td class="center">5</td><td class="lbl">Unit Kerja</td><td>BPS Kabupaten Belitung</td></tr>' +
      '</tbody></table>' +

      '<h4 style="font-size:12.5px;font-weight:800;color:#0D5F55;margin-bottom:9px">Hasil Kerja dan Umpan Balik Berkelanjutan:</h4>' +
      '<table class="doc-table"><thead><tr>' +
        '<th style="width:36px">No</th><th style="width:26%">Rencana Kinerja</th><th style="width:48%">Kegiatan</th><th>Umpan Balik Berkelanjutan<br />Berdasarkan Bukti Dukung</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>' +

      '<div class="doc-sig"><div class="doc-sig__box">' +
        '<p>Belitung, 18 Oktober 2026</p>' +
        '<p style="font-weight:700;margin-top:2px">Pejabat Penilai Kinerja,</p>' +
        '<p class="tiny" style="color:#5B6560">Kepala BPS Kabupaten Belitung</p>' +
        '<div class="space"></div>' +
        '<p class="doc-sig__name">Dra. Radina Kartika, M.Si.</p>' +
        '<p class="tiny">NIP. 197505121999032001</p>' +
      '</div></div>' +
    '</div>' +

    '<div class="card mt-4 no-print"><div class="card-body row" style="justify-content:space-between">' +
      '<div class="row"><span class="stat__icon">' + ic('info') + '</span><span class="strong small">Keterangan Batas Nilai</span></div>' +
      '<div class="doc-legend">' +
        '<span class="doc-legend__item"><b>99 &ndash; 100 :</b><span class="doc-feedback doc-feedback--up">' + ic('smile') + 'Diatas Ekspektasi</span></span>' +
        '<span class="doc-legend__item"><b>80 &ndash; 98 :</b><span class="doc-feedback doc-feedback--ok">' + ic('smile') + 'Sesuai Ekspektasi</span></span>' +
        '<span class="doc-legend__item"><b>0 &ndash; 79 :</b><span class="doc-feedback doc-feedback--low">' + ic('frown') + 'Dibawah Ekspektasi</span></span>' +
      '</div>' +
    '</div></div>';
  }

  window.SIKAP_SCREENS = Object.assign(window.SIKAP_SCREENS || {}, {
    'login': { auth: true, content: login },
    'reset-password': { auth: true, content: resetPassword },
    'dashboard-anggota': { content: dashboardAnggota },
    'upload-ckp': { content: uploadCkp },
    'detail-ckp': { content: detailCkp },
    'evaluasi-penilaian': { content: evaluationDoc }
  });
})();
