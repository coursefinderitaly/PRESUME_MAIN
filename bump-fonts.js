const fs = require('fs');

function bumpFonts(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace rem sizes
    content = content.replace(/([0-9.]+)rem/g, (match, p1) => {
        let val = parseFloat(p1);
        if (val < 1.0) val += 0.15; // e.g. 0.85 -> 1.0, 0.8 -> 0.95
        else if (val >= 1.0 && val < 2.0) val += 0.1; // e.g. 1.05 -> 1.15
        return val.toFixed(2).replace(/\.?0+$/, '') + 'rem';
    });
    
    fs.writeFileSync(filePath, content);
}

bumpFonts('/home/raag/Desktop/presume/src/Dashboard.css');
bumpFonts('/home/raag/Desktop/presume/src/components/StudentDetails.jsx');
bumpFonts('/home/raag/Desktop/presume/src/components/DocumentUpload.jsx');
console.log('Fonts bumped.');
