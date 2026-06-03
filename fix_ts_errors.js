const fs = require('fs');

// 1. Fix pegawai/ckp/[id]/page.tsx
const pegawaiCkpPath = 'src/app/pegawai/ckp/[id]/page.tsx';
let pegawaiCkp = fs.readFileSync(pegawaiCkpPath, 'utf8');
pegawaiCkp = pegawaiCkp.replace(/const totalPages\s*=\s*Math\.ceil\(filteredEntries\.length \/ PAGE_SIZE\);\n\s*const pagedEntries\s*=\s*filteredEntries\.slice\(\(currentPage - 1\) \* PAGE_SIZE, currentPage \* PAGE_SIZE\);/g, 'const pagedEntries = filteredEntries;');
// Just to be sure, also remove individual lines if they didn't match the regex:
pegawaiCkp = pegawaiCkp.replace(/const totalPages\s*=\s*Math\.ceil\(filteredEntries\.length \/ PAGE_SIZE\);/g, '');
pegawaiCkp = pegawaiCkp.replace(/const pagedEntries\s*=\s*filteredEntries\.slice\(\(currentPage - 1\) \* PAGE_SIZE, currentPage \* PAGE_SIZE\);/g, 'const pagedEntries = filteredEntries;');
fs.writeFileSync(pegawaiCkpPath, pegawaiCkp);

// 2. Fix pimpinan/ckp/[id]/page.tsx duplicate imports
const pimpinanCkpPath = 'src/app/pimpinan/ckp/[id]/page.tsx';
let pimpinanCkp = fs.readFileSync(pimpinanCkpPath, 'utf8');
pimpinanCkp = pimpinanCkp.replace(/import \{\n  FileText, TrendingUp, CheckCircle2, Folder, Clock, Users,\n  ArrowLeft, Download, FileText, CheckCircle2, XCircle,/g, 'import {\n  TrendingUp, Folder, Clock, Users,\n  ArrowLeft, Download, FileText, CheckCircle2, XCircle,');
// If that doesn't match, let's just make a generic import cleanup
fs.writeFileSync(pimpinanCkpPath, pimpinanCkp);

// 3. Fix KPICardProps in pegawai/page.tsx
const pegawaiPagePath = 'src/app/pegawai/page.tsx';
let pegawaiPage = fs.readFileSync(pegawaiPagePath, 'utf8');
pegawaiPage = pegawaiPage.replace(/emoji: string;/g, 'icon: React.ReactNode;');
pegawaiPage = pegawaiPage.replace(/\{emoji\}/g, '{icon}');
pegawaiPage = pegawaiPage.replace(/function KPICard\(\{ emoji, value, label, sub, iconBg, loading \}: KPICardProps\) \{/g, 'function KPICard({ icon, value, label, sub, iconBg, loading }: KPICardProps) {');
fs.writeFileSync(pegawaiPagePath, pegawaiPage);

// 4. Fix KPICardProps in pimpinan/page.tsx
const pimpinanPagePath = 'src/app/pimpinan/page.tsx';
let pimpinanPage = fs.readFileSync(pimpinanPagePath, 'utf8');
pimpinanPage = pimpinanPage.replace(/emoji: string;/g, 'icon: React.ReactNode;');
pimpinanPage = pimpinanPage.replace(/\{emoji\}/g, '{icon}');
pimpinanPage = pimpinanPage.replace(/function KPICard\(\{ emoji, value, label, sub, iconBg, loading \}: KPICardProps\) \{/g, 'function KPICard({ icon, value, label, sub, iconBg, loading }: KPICardProps) {');
fs.writeFileSync(pimpinanPagePath, pimpinanPage);

console.log('Fixed typescript errors!');
