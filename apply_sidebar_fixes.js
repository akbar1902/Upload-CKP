const fs = require('fs');
const path = 'src/components/layout/sidebar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Clean up NavItem interface
content = content.replace(/,\s*emoji:\s*'[^']+'/g, "");
content = content.replace(/emoji:\s*string;/g, "");

// Replace emoji rendering with Icon
content = content.replace(
  /<span className="text-base flex-shrink-0" aria-hidden="true">\s*\{item\.emoji\}\s*<\/span>/,
  '<Icon size={18} className="flex-shrink-0" aria-hidden="true" />'
);

// Simplify sidebar background
content = content.replace(/background: 'linear-gradient\(180deg, #0F172A 0%, #1A2744 50%, #1E293B 100%\)'/g, "background: '#0F172A'");
content = content.replace(/background: 'linear-gradient\(180deg, #0F172A 0%, #1E293B 100%\)'/g, "background: '#0F172A'");

// Make avatar simpler
content = content.replace(/const AVATAR_GRADIENTS = \[[\s\S]*?\];/g, "const AVATAR_GRADIENTS = ['#1E293B'];");

fs.writeFileSync(path, content);
console.log("Sidebar updated!");
