const fs = require('fs');

const pimpinanPath = 'src/app/pimpinan/ckp/[id]/page.tsx';
const pegawaiPath = 'src/app/pegawai/ckp/[id]/page.tsx';

let pimpinanContent = fs.readFileSync(pimpinanPath, 'utf8');
let pegawaiContent = fs.readFileSync(pegawaiPath, 'utf8');

// 1. Extract EntryCard and EntryCardSkeleton from pimpinan
const entryCardStart = '// ── Entry Activity Card ────────────────────────────────────';
const entryCardEnd = '// ── Main page ──────────────────────────────────────────────';

const pimpinanStartIdx = pimpinanContent.indexOf(entryCardStart);
const pimpinanEndIdx = pimpinanContent.indexOf(entryCardEnd);
if (pimpinanStartIdx === -1 || pimpinanEndIdx === -1) throw new Error("Could not find EntryCard in pimpinan");

const pimpinanEntryCards = pimpinanContent.substring(pimpinanStartIdx, pimpinanEndIdx);

const pegawaiStartIdx = pegawaiContent.indexOf(entryCardStart);
const pegawaiEndIdx = pegawaiContent.indexOf(entryCardEnd);
if (pegawaiStartIdx === -1 || pegawaiEndIdx === -1) throw new Error("Could not find EntryCard in pegawai");

pegawaiContent = pegawaiContent.substring(0, pegawaiStartIdx) + pimpinanEntryCards + pegawaiContent.substring(pegawaiEndIdx);

// 2. Remove Pagination logic in pegawai
pegawaiContent = pegawaiContent.replace('const [currentPage, setCurrentPage] = useState(1);', '');
pegawaiContent = pegawaiContent.replace('const PAGE_SIZE = 10;', '');
pegawaiContent = pegawaiContent.replace(/const totalPages\s*=\s*Math\.ceil\(filteredEntries\.length \/ PAGE_SIZE\);\n\s*const pagedEntries\s*=\s*filteredEntries\.slice\(\(currentPage - 1\) \* PAGE_SIZE, currentPage \* PAGE_SIZE\);/, 'const pagedEntries = filteredEntries;');

// Remove pagination UI properly
const paginationUIStart = '          {/* Pagination */}';
const paginationUIEnd = '        {/* ── Riwayat Review ────────────────────────── */}';
const pUIStartIdx = pegawaiContent.indexOf(paginationUIStart);
const pUIEndIdx = pegawaiContent.indexOf(paginationUIEnd);
if (pUIStartIdx !== -1 && pUIEndIdx !== -1) {
  // Wait, there is a `</div>` for the container and a `</div>` for the pagination. Let's just remove the block carefully.
  // Actually, the original is:
  //           {/* Pagination */}
  //           {totalPages > 1 && (
  //             <div className="flex items-center justify-between mt-6 pt-4"...
  //               ...
  //             </div>
  //           )}
  //         </div>
  //
  //         {/* ── Riwayat Review ────────────────────────── */}
  pegawaiContent = pegawaiContent.substring(0, pUIStartIdx) + '        </div>\n\n' + pegawaiContent.substring(pUIEndIdx);
}

// Update index passed to EntryCard
pegawaiContent = pegawaiContent.replace(/index=\{\(currentPage - 1\) \* PAGE_SIZE \+ i\}/g, 'index={i}');
pegawaiContent = pegawaiContent.replace(/setCurrentPage\(1\);/g, '');

// 3. Replace router.back() with Link
pegawaiContent = pegawaiContent.replace(
  '<button\n          onClick={() => router.back()}\n          className="flex items-center gap-2 text-[13px] font-medium transition-colors"\n          style={{ color: \'var(--text-secondary)\' }}\n          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = \'var(--text-primary)\'; }}\n          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = \'var(--text-secondary)\'; }}\n        >\n          <ArrowLeft size={14} /> Kembali\n        </button>',
  '<Link href="/pegawai" className="flex items-center gap-2 text-[13px] font-medium transition-colors text-slate-500 hover:text-slate-800">\n          <ArrowLeft size={14} /> Kembali\n        </Link>'
);
pegawaiContent = pegawaiContent.replace(
  '<button onClick={() => router.back()} className="btn-secondary mt-4">\n            <ArrowLeft size={14} /> Kembali\n          </button>',
  '<Link href="/pegawai" className="btn-secondary mt-4 inline-flex items-center gap-2">\n            <ArrowLeft size={14} /> Kembali\n          </Link>'
);

pimpinanContent = pimpinanContent.replace(
  '<button\n          onClick={() => router.back()}\n          className="flex items-center gap-2 text-[13px] font-medium transition-colors"\n          style={{ color: \'var(--text-secondary)\' }}\n          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = \'var(--text-primary)\'; }}\n          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = \'var(--text-secondary)\'; }}\n        >\n          <ArrowLeft size={14} /> Kembali ke Dashboard\n        </button>',
  '<Link href="/pimpinan" className="flex items-center gap-2 text-[13px] font-medium transition-colors text-slate-500 hover:text-slate-800">\n          <ArrowLeft size={14} /> Kembali ke Dashboard\n        </Link>'
);
pimpinanContent = pimpinanContent.replace(
  '<button onClick={() => router.back()} className="btn-secondary mt-4">\n            <ArrowLeft size={14} /> Kembali\n          </button>',
  '<Link href="/pimpinan" className="btn-secondary mt-4 inline-flex items-center gap-2">\n            <ArrowLeft size={14} /> Kembali\n          </Link>'
);

// 4. Update KPI Cards to use Lucide Icons instead of Emojis
function updateKPICards(content) {
  if (!content.includes('FileText')) content = content.replace("import {", "import {\\n  FileText, TrendingUp, CheckCircle2, Folder, Clock, Users,");
  else {
    content = content.replace("FileText,", "FileText, TrendingUp, CheckCircle2, Folder, Clock, Users,");
  }

  content = content.replace(
    /function KPICard\(\{ emoji, value, label, sub, iconBg \}: \{\s*emoji: string; value: string \| number; label: string; sub\?: string; iconBg: string;\s*\}\) \{/,
    `function KPICard({ icon, value, label, sub, iconBg }: {
  icon: React.ReactNode; value: string | number; label: string; sub?: string; iconBg: string;
}) {`
  );
  content = content.replace(
    /\{emoji\}/,
    `{icon}`
  );

  content = content.replace(/emoji="📄"/g, 'icon={<FileText size={18} style={{ color: "#2563EB" }} />}');
  content = content.replace(/emoji="📈"/g, 'icon={<TrendingUp size={18} style={{ color: "#16A34A" }} />}');
  content = content.replace(/emoji="✅"/g, 'icon={<CheckCircle2 size={18} style={{ color: "#059669" }} />}');
  content = content.replace(/emoji="📁"/g, 'icon={<Folder size={18} style={{ color: "#7C3AED" }} />}');
  content = content.replace(/emoji="⏳"/g, 'icon={<Clock size={18} style={{ color: "#D97706" }} />}');
  content = content.replace(/emoji="👥"/g, 'icon={<Users size={18} style={{ color: "#2563EB" }} />}');

  return content;
}

pegawaiContent = updateKPICards(pegawaiContent);
pimpinanContent = updateKPICards(pimpinanContent);

const pegawaiPagePath = 'src/app/pegawai/page.tsx';
let pegawaiPageContent = fs.readFileSync(pegawaiPagePath, 'utf8');
pegawaiPageContent = updateKPICards(pegawaiPageContent);
fs.writeFileSync(pegawaiPagePath, pegawaiPageContent);

const pimpinanPagePath = 'src/app/pimpinan/page.tsx';
let pimpinanPageContent = fs.readFileSync(pimpinanPagePath, 'utf8');
pimpinanPageContent = updateKPICards(pimpinanPageContent);
fs.writeFileSync(pimpinanPagePath, pimpinanPageContent);

fs.writeFileSync(pegawaiPath, pegawaiContent);
fs.writeFileSync(pimpinanPath, pimpinanContent);

console.log("Done updating files!");
