import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5173/';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(7000); // allow the SPA bundle to load and hydrate

  const dom = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    return {
      hasRequiredTitle: /Required Skills/.test(text),
      hasBlueprintsRow: /blueprinting tools/.test(text),
      hasMeetsRow: /meets requirement/.test(text),
      rowCount: (text.match(/Service Designer/g) || []).length,
      projectTitle: document.title,
      htmlReady: document.readyState,
    };
  });

  console.log('=== DOM check after hydration ===');
  console.log('project title:', dom.projectTitle);
  console.log('html ready state:', dom.htmlReady);
  console.log('has "Required Skills":', dom.hasRequiredTitle);
  console.log('has "blueprinting tools" row:', dom.hasBlueprintsRow);
  console.log('has "meets requirement" row:', dom.hasMeetsRow);
  console.log('occurrences of "Service Designer":', dom.rowCount);
  console.log('page errors:', errors.length ? errors : 'none');
} finally {
  await browser.close();
}
console.log('DONE');
