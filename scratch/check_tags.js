const fs = require('fs');
const code = fs.readFileSync('src/components/PartnerApplications.jsx', 'utf8');
let braceDepth = 0;
let parenDepth = 0;
let lineNum = 1;
let colNum = 0;
let inString = false;
let stringChar = '';
let inComment = false;
let inRegex = false;

for (let i = 0; i < code.length; i++) {
  const char = code[i];
  if (char === '\n') {
    lineNum++;
    colNum = 0;
  } else {
    colNum++;
  }

  if (inComment) {
    if (char === '\n' && inComment === 'single') inComment = false;
    if (char === '*' && code[i+1] === '/' && inComment === 'multi') {
      inComment = false;
      i++;
    }
    continue;
  }

  if (inString) {
    if (char === stringChar && code[i-1] !== '\\') inString = false;
    continue;
  }

  if (char === '/' && code[i+1] === '/') { inComment = 'single'; continue; }
  if (char === '/' && code[i+1] === '*') { inComment = 'multi'; i++; continue; }

  if (char === "'" || char === '"' || char === '`') {
    inString = true;
    stringChar = char;
    continue;
  }

  if (char === '{') braceDepth++;
  if (char === '}') braceDepth--;
  if (char === '(') parenDepth++;
  if (char === ')') parenDepth--;

  if (braceDepth < 0) {
    console.log(`Extra closing brace at line ${lineNum}, col ${colNum}`);
    braceDepth = 0;
  }
  if (parenDepth < 0) {
    console.log(`Extra closing parenthesis at line ${lineNum}, col ${colNum}`);
    parenDepth = 0;
  }
}

console.log(`Final depths: brace=${braceDepth}, paren=${parenDepth}`);
