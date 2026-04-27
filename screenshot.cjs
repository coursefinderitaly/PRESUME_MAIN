const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'mobile_preview_scroll.png', fullPage: true });
  await browser.close();
})();
