const fs = require('fs');
const code = fs.readFileSync('src/components/StudentDetails.jsx', 'utf-8');

let depth = 0;
let lines = code.split('\n');
for (let i = 450; i < 1412; i++) {
  let line = lines[i];
  let opens = (line.match(/<div/g) || []).length;
  let closes = (line.match(/<\/div>/g) || []).length;
  depth += (opens - closes);
  if (i >= 1350) {
    console.log(i + 1, ":", depth, line.trim());
  }
}
