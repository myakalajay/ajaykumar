import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5173/';
const BROWSER = process.env.BROWSER ?? 'chromium';

async function audit(url, label, width) {
  const viewport = { width, height: 900 };
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: false });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 180)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 180)); });

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

  console.log(`--- ${label} @${width}px ---`);
  console.log('  page errors:', errors.length ? errors : 'none');
  console.log('  broken images:', report.broken.length ? report.broken : 'none');
  console.log('  horizontal drag:', report.drag);
  console.log('  hidden nodes:', report.hiddenCount);
  console.log('  focusable:', report.focusableCount);

  // 390px: explicitly check for violation
  if (width === 390) {
    console.log('  390px horizontal overflow:', report.drag > 0 ? 'VIOLATION' : 'ok');
    const vScroll = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, inner: window.innerWidth }));
    console.log('  viewport:', JSON.stringify(vScroll));
  }

  await page.close();
}

const browser = await chromium.launch();
try {
  await audit(BASE, 'desktop', 1440);
  await audit(BASE, 'desktop-lg', 1280);
  await audit(BASE, 'tablet', 1024);
  await audit(BASE, 'tablet-sm', 768);
  await audit(BASE, 'mobile', 390);
} finally {
  await browser.close();
}
console.log('DONE');
