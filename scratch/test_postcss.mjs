import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

const css = fs.readFileSync('./src/Dashboard.css', 'utf8');

postcss([tailwindcss])
  .process(css, { from: './src/Dashboard.css' })
  .then(result => {
    console.log('Success!');
  })
  .catch(err => {
    console.error('Error during compile:');
    console.error(err.message);
    console.error(err.stack);
  });
