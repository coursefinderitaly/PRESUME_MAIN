const fs = require('fs');
const { execSync } = require('child_process');

function restoreRemLines(filePath) {
    const currentLines = fs.readFileSync(filePath, 'utf8').split('\n');
    const headContent = execSync(`git show HEAD:${filePath}`).toString();
    const headLines = headContent.split('\n');
    
    let restoredCount = 0;
    
    for (let i = 0; i < currentLines.length; i++) {
        let currLine = currentLines[i];
        if (currLine.includes('rem')) {
            let currStripped = currLine.replace(/[0-9.]+rem/g, 'Xrem');
            
            // find matching line in headLines
            for (let j = Math.max(0, i - 100); j < Math.min(headLines.length, i + 100); j++) {
                let headLine = headLines[j];
                let headStripped = headLine.replace(/[0-9.]+rem/g, 'Xrem');
                if (currStripped === headStripped) {
                    if (headLine !== currLine) {
                        currentLines[i] = headLine;
                        restoredCount++;
                    }
                    break;
                }
            }
        }
    }
    
    fs.writeFileSync(filePath, currentLines.join('\n'));
    console.log(`Restored ${restoredCount} lines in ${filePath}`);
}

restoreRemLines('src/Dashboard.css');
restoreRemLines('src/components/DocumentUpload.jsx');
restoreRemLines('src/components/SearchProgram.jsx');
restoreRemLines('src/components/StudentDetails.jsx');
