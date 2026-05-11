const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'current_desk.png' });
  await browser.close();
})();
