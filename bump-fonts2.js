const fs = require('fs');
function bumpFonts(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/([0-9.]+)rem/g, (match, p1) => {
        let val = parseFloat(p1);
        if (val < 1.0) val += 0.15;
        else if (val >= 1.0 && val < 2.0) val += 0.1;
        return val.toFixed(2).replace(/\.?0+$/, '') + 'rem';
    });
    fs.writeFileSync(filePath, content);
}
bumpFonts('/home/raag/Desktop/presume/src/components/SearchProgram.jsx');
console.log('Fonts bumped in SearchProgram.jsx');
