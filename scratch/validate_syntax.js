const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const files = ['src/components/AdminPortal.jsx', 'src/components/StudentDetails.jsx', 'src/components/RazorpayGateway.jsx'];

const Parser = acorn.Parser.extend(jsx());

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        Parser.parse(content, {
            sourceType: 'module',
            ecmaVersion: 2020
        });
        console.log(`${file}: OK`);
    } catch (err) {
        console.log(`${file}: ERROR at ${err.loc.line}:${err.loc.column} - ${err.message}`);
        // Read lines around the error
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        const start = Math.max(0, err.loc.line - 5);
        const end = Math.min(lines.length, err.loc.line + 5);
        console.log('--- Context ---');
        for (let i = start; i < end; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        console.log('---------------');
    }
});
