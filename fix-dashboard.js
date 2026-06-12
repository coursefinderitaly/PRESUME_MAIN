const fs = require('fs');

let css = fs.readFileSync('src/Dashboard.css', 'utf8');

// 1. Fix Palette Translucency (Darker glass for better contrast)
css = css.replace('--card-bg-solid: rgba(255, 255, 255, 0.04);', '--card-bg-solid: rgba(20, 20, 25, 0.65);');
css = css.replace('--glass-bg: rgba(255, 255, 255, 0.03);', '--glass-bg: rgba(15, 15, 20, 0.55);');

// 2. Fix Dropdown Menus (options)
if (!css.includes('.dash-universe select option')) {
  css += `\n.dash-universe select option { background: #1c1c1e !important; color: #fff !important; text-shadow: none !important; }\n`;
}

// 3. Fix text shadow breaking gradient text
css = css.replace('.dash-universe h1, .dash-universe h2, .dash-universe h3, .dash-universe h4, .dash-universe label, .dash-universe span, .dash-universe p {', 
                  '.dash-universe h1, .dash-universe h2, .dash-universe h3, .dash-universe h4, .dash-universe label, .dash-universe p {');

fs.writeFileSync('src/Dashboard.css', css);

// 4. Fix Profile Completion background in DashboardHome.jsx
let jsx = fs.readFileSync('src/components/DashboardHome.jsx', 'utf8');
jsx = jsx.replace("background: 'var(--bg-primary)'", "background: 'rgba(255,255,255,0.03)'");
fs.writeFileSync('src/components/DashboardHome.jsx', jsx);

console.log('Dashboard fixes applied');
