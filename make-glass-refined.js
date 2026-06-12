const fs = require('fs');

let css = fs.readFileSync('src/Dashboard.css', 'utf8');

css = css.replace(/text-shadow: 0 1px 4px rgba\(0,0,0,0\.6\);/g, 'text-shadow: 0 1px 2px rgba(0,0,0,0.8);');

fs.writeFileSync('src/Dashboard.css', css);
