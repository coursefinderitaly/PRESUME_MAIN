import fs from 'fs';
import postcss from 'postcss';

const css = fs.readFileSync('./src/Dashboard.css', 'utf8');

postcss([])
  .process(css, { from: './src/Dashboard.css' })
  .then(result => {
    console.log('PostCSS successfully parsed the CSS!');
  })
  .catch(err => {
    console.error('PostCSS Parsing Error:');
    console.error(err.message);
    console.error(err.stack);
  });
