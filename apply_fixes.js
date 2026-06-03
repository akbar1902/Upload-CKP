const fs = require('fs');

const pimpinanPath = 'src/app/pimpinan/ckp/[id]/page.tsx';
const pegawaiPath = 'src/app/pegawai/ckp/[id]/page.tsx';

let pimpinanContent = fs.readFileSync(pimpinanPath, 'utf8');
let pegawaiContent = fs.readFileSync(pegawaiPath, 'utf8');

// 1. Extract EntryCard and EntryCardSkeleton from pimpinan
const entryCardRegex = /(\/\/ ── Entry Activity Card ────────────────────────────────────[\s\S]*?)(?=\/\/ ── Main page ──────────────────────────────────────────────)/;
const match = pimpinanContent.match(entryCardRegex);
if (!match) throw new Error("Could not find EntryCard in pimpinan");

let pimpinanEntryCards = match[1];

// 2. Replace EntryCard and EntryCardSkeleton in pegawai
pegawaiContent = pegawaiContent.replace(
  /(\/\/ ── Entry Activity Card ────────────────────────────────────[\s\S]*?)(?=\/\/ ── Main page ──────────────────────────────────────────────)/,
  pimpinanEntryCards
);

// 3. Remove Pagination logic in pegawai
pegawaiContent = pegawaiContent.replace(/const \[currentPage, setCurrentPage\] = useState\(1\);\n\s*const PAGE_SIZE = 10;/, '');
pegawaiContent = pegawaiContent.replace(/const totalPages\s*=\s*Math\.ceil\(filteredEntries\.length \/ PAGE_SIZE\);\n\s*const pagedEntries\s*=\s*filteredEntries\.slice\(\(currentPage - 1\) \* PAGE_SIZE, currentPage \* PAGE_SIZE\);/, 'const pagedEntries = filteredEntries;');

// Replace pagination UI
pegawaiContent = pegawaiContent.replace(/\{\/\* Pagination \*\/\}\s*\{totalPages > 1 && \([\s\S]*?\)\}/, '');

// Update index passed to EntryCard
pegawaiContent = pegawaiContent.replace(/index=\{\(currentPage - 1\) \* PAGE_SIZE \+ i\}/g, 'index={i}');
pegawaiContent = pegawaiContent.replace(/setCurrentPage\(1\);/g, '');

// Replace router.back() with Link to dashboard to prevent white screen
pegawaiContent = pegawaiContent.replace(
  /<button\s+onClick=\{\(\) => router\.back\(\)\}[\s\S]*?Kembali\s*<\/button>/,
  `<Link href="/pegawai" className="flex items-center gap-2 text-[13px] font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>\n          <ArrowLeft size={14} /> Kembali ke Dashboard\n        </Link>`
);
// Also replace the other router.back() inside "CKP tidak ditemukan"
pegawaiContent = pegawaiContent.replace(
  /<button onClick=\{\(\) => router\.back\(\)\} className="btn-secondary mt-4">[\s\S]*?Kembali\s*<\/button>/,
  `<Link href="/pegawai" className="btn-secondary mt-4 inline-flex items-center gap-2">\n            <ArrowLeft size={14} /> Kembali\n          </Link>`
);

pimpinanContent = pimpinanContent.replace(
  /<button\s+onClick=\{\(\) => router\.back\(\)\}[\s\S]*?Kembali ke Dashboard\s*<\/button>/,
  `<Link href="/pimpinan" className="flex items-center gap-2 text-[13px] font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>\n          <ArrowLeft size={14} /> Kembali ke Dashboard\n        </Link>`
);
pimpinanContent = pimpinanContent.replace(
  /<button onClick=\{\(\) => router\.back\(\)\} className="btn-secondary mt-4">[\s\S]*?Kembali\s*<\/button>/,
  `<Link href="/pimpinan" className="btn-secondary mt-4 inline-flex items-center gap-2">\n            <ArrowLeft size={14} /> Kembali\n          </Link>`
);

// 4. Update KPI Cards to use Lucide Icons instead of Emojis
function updateKPICards(content) {
  // Update imports
  if (!content.includes('FileText')) content = content.replace("import {", "import {\n  FileText, TrendingUp, CheckCircle2, Folder,");
  else {
    content = content.replace("FileText,", "FileText, TrendingUp, CheckCircle2, Folder,");
  }

  // Update KPICard definition
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

  // Update KPICard usages
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

// Also update KPI cards in pegawai/page.tsx and pimpinan/page.tsx
const pegawaiPagePath = 'src/app/pegawai/page.tsx';
let pegawaiPageContent = fs.readFileSync(pegawaiPagePath, 'utf8');
pegawaiPageContent = updateKPICards(pegawaiPageContent);
// Make sure Clock and Users are imported
if (!pegawaiPageContent.includes('Clock')) {
  pegawaiPageContent = pegawaiPageContent.replace("import {", "import {\n  Clock, Users, TrendingUp, CheckCircle2, Folder,");
}
fs.writeFileSync(pegawaiPagePath, pegawaiPageContent);

const pimpinanPagePath = 'src/app/pimpinan/page.tsx';
let pimpinanPageContent = fs.readFileSync(pimpinanPagePath, 'utf8');
pimpinanPageContent = updateKPICards(pimpinanPageContent);
if (!pimpinanPageContent.includes('Folder')) {
  pimpinanPageContent = pimpinanPageContent.replace("import {", "import {\n  Folder, FileText,");
}
fs.writeFileSync(pimpinanPagePath, pimpinanPageContent);

// Fix router used inside imports if not used anymore
// It's ok to leave them if unused, or we can just leave it.

fs.writeFileSync(pegawaiPath, pegawaiContent);
fs.writeFileSync(pimpinanPath, pimpinanContent);

console.log("Done updating files!");
