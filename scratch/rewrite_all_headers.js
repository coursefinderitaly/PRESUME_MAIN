const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/**/*.jsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content;

  // We want to remove any inline style that conflicts with the centralized CSS dash-header centering,
  // or adjust them to match if needed. We mainly need to remove `style={{ ... }}` from `<header className="dash-header"`
  // and let the CSS handle the alignment.

  updated = updated.replace(/<header className="dash-header"[^>]*>/g, '<header className="dash-header" style={{ marginBottom: "20px" }}>');

  // Let's also check StudentDetails.jsx, maybe it uses a different header class
  
  if (content !== updated) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated ${file}`);
  }
});
