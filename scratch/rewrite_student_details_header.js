const fs = require('fs');
const file = 'src/components/StudentDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find student-details header which might not be using dash-header
content = content.replace(
  /<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>/g,
  '<div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px", marginBottom: "20px" }}>'
);

fs.writeFileSync(file, content, 'utf8');
console.log(`Updated ${file}`);
