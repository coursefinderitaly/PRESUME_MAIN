const fs = require('fs');

let css = fs.readFileSync('src/Dashboard.css', 'utf8');

// 1. Brighten the variables
css = css.replace('--text-muted: #d4d4d8;', '--text-muted: #f4f4f5;');
css = css.replace('--text-dim: #a1a1aa;', '--text-dim: #e4e4e7;');

// 2. Increase base font weight
css = css.replace('font-weight: 500;', 'font-weight: 500;'); // make sure we have a base
if (!css.includes('font-weight: 500; /* BASE WEIGHT */')) {
  css = css.replace(/letter-spacing: 0\.015em;/g, 'letter-spacing: 0.015em;\n  font-weight: 500; /* BASE WEIGHT */');
}

// 3. Remove the text-shadow injections to avoid fuzziness
css = css.replace(/text-shadow: 0 1px 2px rgba\(0,0,0,0\.8\);/g, 'text-shadow: none !important;');

fs.writeFileSync('src/Dashboard.css', css);
console.log('Visibility fixes applied');
