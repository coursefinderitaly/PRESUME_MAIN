const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:5173/coupon...');
  await page.goto('http://localhost:5173/coupon', { waitUntil: 'networkidle2' });
  
  console.log('Filling in details...');
  // Fill Passenger Name
  await page.type('input[placeholder="Passenger Name"]', 'Jane Doe');
  
  // Fill Email Address
  const email = `jane.doe.${Date.now()}@example.com`;
  await page.type('input[placeholder="Email Address"]', email);
  
  console.log('Clicking the generate button...');
  await page.click('.upm-generate-btn-circle');
  
  console.log('Waiting for the coupon printing animation...');
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'coupon_printed.png' });
  
  console.log('Screenshot saved as coupon_printed.png');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
