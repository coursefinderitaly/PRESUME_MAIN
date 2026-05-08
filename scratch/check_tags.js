const fs = require('fs');
const content = fs.readFileSync('src/components/AdminPortal.jsx', 'utf8');

let divCount = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div(?![^>]*\/>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    divCount += opens;
    divCount -= closes;
    if (divCount < 0) {
        console.log(`Mismatch at line ${i + 1}: count is ${divCount}`);
    }
}
console.log(`Final div count: ${divCount}`);
