import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5173/';
const browser = await chromium.launch();

async function audit(url, label) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(6000);

  const report = await page.evaluate(() => {
    const walk = (els) => {
      const out = [];
      for (const n of els) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden') { out.push(n.tagName + '.' + String(n.className).slice(0, 40)); continue; }
        if (n.children.length) out.push(...walk(n.children));
      }
      return out;
    };
    const imgs = [...document.querySelectorAll('img')];
    const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => (i.currentSrc || i.src));
    const drag = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const hidden = new Set(walk(document.querySelectorAll('body *')));
    const focusables = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')];
    return { broken, drag, hiddenCount: hidden.size, focusableCount: focusables.length };
  });

  console.log('===', label, '===');
  console.log('errors:', errors.length ? errors : 'none');
  console.log('broken:', report.broken.length ? report.broken : 'none');
  console.log('horizontal drag:', report.drag);
  console.log('hidden nodes:', report.hiddenCount);
  console.log('focusable:', report.focusableCount);
  await page.close();
}

await audit(BASE, 'index');
await browser.close();
console.log('done');
