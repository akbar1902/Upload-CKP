const fs = require('fs');

function fixKpiCards(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/emoji:\s*'📄'/g, 'icon: <FileText size={18} style={{ color: "#2563EB" }} />');
  content = content.replace(/emoji:\s*'📈'/g, 'icon: <TrendingUp size={18} style={{ color: "#16A34A" }} />');
  content = content.replace(/emoji:\s*'✅'/g, 'icon: <CheckCircle2 size={18} style={{ color: "#059669" }} />');
  content = content.replace(/emoji:\s*'⏳'/g, 'icon: <Clock size={18} style={{ color: "#D97706" }} />');
  content = content.replace(/emoji:\s*'👥'/g, 'icon: <Users size={18} style={{ color: "#2563EB" }} />');
  content = content.replace(/emoji:\s*'📁'/g, 'icon: <Folder size={18} style={{ color: "#7C3AED" }} />');
  fs.writeFileSync(path, content);
}

fixKpiCards('src/app/pegawai/page.tsx');
fixKpiCards('src/app/pimpinan/page.tsx');

// Also fix the duplicate CheckCircle2 import in pimpinan/ckp/[id]/page.tsx
const pimpinanCkpPath = 'src/app/pimpinan/ckp/[id]/page.tsx';
let pCkp = fs.readFileSync(pimpinanCkpPath, 'utf8');
pCkp = pCkp.replace(/CheckCircle2,\s*CheckCircle2/g, 'CheckCircle2');
// If that doesn't match precisely:
const importBlockStart = pCkp.indexOf("import {\n  TrendingUp, Folder, Clock, Users,");
if (importBlockStart !== -1) {
  const importBlockEnd = pCkp.indexOf("} from 'lucide-react';", importBlockStart);
  if (importBlockEnd !== -1) {
    let importBlock = pCkp.substring(importBlockStart, importBlockEnd);
    let uniqueImports = [...new Set(importBlock.split(',').map(s => s.trim().replace('import {', '')).filter(s => s))].join(', ');
    pCkp = pCkp.substring(0, importBlockStart) + "import { " + uniqueImports + " " + pCkp.substring(importBlockEnd);
  }
}
fs.writeFileSync(pimpinanCkpPath, pCkp);
console.log('Fixed kpiCards and imports!');
