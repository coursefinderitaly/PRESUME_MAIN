const fs = require('fs');

let css = fs.readFileSync('src/Dashboard.css', 'utf8');

css += `
/* Global Glass Injection */
.dash-universe .file-box,
.dash-universe input:not([type="checkbox"]):not([type="radio"]),
.dash-universe select,
.dash-universe textarea,
.dash-universe .summary-box,
.dash-universe table th,
.dash-universe table td,
.dash-universe .search-input {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(16px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* Ensure text is extremely visible */
.dash-universe {
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.dash-universe h1, .dash-universe h2, .dash-universe h3, .dash-universe h4, .dash-universe label, .dash-universe span, .dash-universe p {
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

[data-theme='light'] .dash-universe {
  text-shadow: none !important;
}
[data-theme='light'] .dash-universe * {
  text-shadow: none !important;
}
`;

fs.writeFileSync('src/Dashboard.css', css);
console.log('Glass styles injected');
