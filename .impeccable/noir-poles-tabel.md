# Noir — Kenapa tabel per-baris terasa "kurang puas" + usulan poles

Layar: `src/app/ketua_tim/rk/[id]/_client.tsx` — `RkBarisRow`, 1 baris = 1 pegawai × RK Anggota.
Grid desktop `1fr / 2fr / 110px`, tiap baris kartu `rounded-xl border` sendiri, header terpisah di atas.

## Kenapa terasa kurang (bukan logic, murni visual)

1. **Tiga bold berebut perhatian.** Nama `13px bold`, judul RK `13px semibold`, nilai `14px bold` — ketiganya sama besar, sama gelap. Mata nggak dikasih tahu mana yang penting di satu baris.
2. **Bukan tabel, bukan kartu — nanggung di tengah.** Tiap baris kartu `rounded-xl border` terpisah (`space-y-2.5`), sementara headernya kartu kecil lain yang nggak nempel dan nggak sticky. Hasilnya: header berasa jauh, baris berasa tumpukan kartu lepas, bukan satu tabel yang bisa di-scan ke bawah.
3. **Meta numpuk di kolom RK.** `X kegiatan • Capaian: Y%` + badge pill `Dinilai` dijejelin satu bungkus `flex-wrap`. Data netral (jumlah kegiatan) campur status (Dinilai) campur progres — semuanya teriak bareng.
4. **Avatar generik = noise.** Semua lingkaran isinya ikon `UserIcon` yang sama. Elemen visual yang paling menonjol di kolom Nama justru yang paling nggak informatif.
5. **Label "NILAI" dobel.** Header kolom udah bilang NILAI, tiap baris ngulang label `NILAI` uppercase di atas angkanya. Satu angka `95` jadi butuh dua baris vertikal.
6. **Detail bocor.** Tombol chevron hardcode `bg-slate-50 text-slate-400` — di dark mode (CSS var system) warnanya asing sendiri. Hover `sand-subtle` terlalu samar buat kasih feedback.

## Usulan poles (urut dampak)

1. **Satukan baris jadi satu tabel beneran.** Bungkus semua baris dalam satu container `rounded-2xl border`, baris-barisnya jadi divider (`divide-y` / `border-b`) bukan kartu terpisah. Header nempel di atas container. Dampak terbesar: langsung berasa rapi dan scannable.
2. **Satu hero tipografi per baris.** Nama tetap `bold 13px`. Judul RK turun ke `medium 13px` (boleh `text-secondary` kalau berani). Nilai naik jadi satu-satunya angka besar `tabular-nums extrabold 15px`. Hapus label `NILAI` per-baris — header kolom udah cukup.
3. **Avatar inisial, bukan ikon.** Lingkaran tetap `w-8`, isinya 2 huruf inisial nama (`font-bold 12px`, `bg primary-soft`, teks `primary`). NIP kecil mono di bawah nama (`10px text-tertiary`) biar kolom Nama punya identitas. *Satu-satunya usulan yang butuh tambah prop `nip` ke `RowBaris` — operan data doang, logic nilai/expand/search nggak kesenggol.*
4. **Meta satu baris, status dipisah.** Format: `X kegiatan · Capaian Y%` dalam satu `11px text-secondary`, badge `Dinilai` jadi titik hijau + teks (tanpa pill) atau pill outline super kecil. Data dan status berhenti berebut gaya.
5. **Kasih skema baca ke baris.** Hover yang kerasa dikit + `shadow-sm` halus saat hover, baris yang `allScored` dikasih `border-l-2 primary` (kode lama kartu pernah punya ini). Zebra opsional di desktop. Chevron ikut CSS var, buang `slate-50` hardcode.
6. **Density: napas dikit.** `px-2.5 py-2` → `px-3.5 py-2.5`, `gap-x-2` → `gap-x-3`, `space-y-2.5` → antar-baris jadi divider (usulan 1) atau `space-y-1.5`. Header `sticky top-0`, huruf kecil normal-case `11px semibold secondary` ganti uppercase yang jaraknya jauh.

## Aman tanpa ubah logic

- Usulan **1, 2, 4, 5, 6: 100% markup + class + style.** State `score/saving/expanded`, `handleBlur`, navigasi Enter antar `.score-input`, optimistic update, sort, search, KPI, export Excel — nggak ada yang kesenggol. Kelas `score-input` jangan diganti (navigasi Enter bergantung padanya).
- Usulan **3: tambah prop `nip` doang** (dari `sec.user.nip` yang udah ada di memo). Render + search nggak berubah.
