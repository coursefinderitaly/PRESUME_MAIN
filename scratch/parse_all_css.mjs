import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

const files = [
  './src/index.css',
  './src/components/ModernFeatures.css',
  './src/components/DashGallery.css',
  './src/Dashboard.css',
  './src/coupon_generator/coupon.css'
];

for (const file of files) {
  try {
    const css = fs.readFileSync(file, 'utf8');
    postcss([]).process(css, { from: file }).sync();
    console.log(`Successfully parsed ${file}`);
  } catch (err) {
    console.error(`PostCSS Parsing Error in ${file}:`);
    console.error(err.message);
  }
}
