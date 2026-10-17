import { chromium } from 'playwright';
(async () => {
  const b = await chromium.launch();
  for (const url of ['http://127.0.0.1:5173/', 'http://127.0.0.1:5173/#homeratesyard']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(4000);
    const r = await p.evaluate(() => {
      const drag = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const imgs = [...document.querySelectorAll('img')].map(i => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 }));
      const hidden = [...document.querySelectorAll('body *')].filter(n => getComputedStyle(n).display === 'none').length;
      return { drag, brokenImg: imgs.filter(i => !i.ok).map(i => i.src), hidden, bodyText: document.body.innerText.replace(/\s+/g,' ').slice(0,120) };
    });
    console.log('---', url, '---');
    console.log(JSON.stringify(r, null, 1));
    await p.close();
  }
  await b.close();
})();
