const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Actually, onlinejyotish has a free API or we can just fetch the HTML and parse it?
  // Let's just calculate it ourselves with another astrology library to see if there's any difference.
  console.log("Not running puppeteer, too slow. Let's think.");
  
  await browser.close();
})();
