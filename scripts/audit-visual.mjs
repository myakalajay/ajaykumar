/**
 * Visual audit — walks the whole series and captures one screenshot per section
 * at desktop and mobile, plus the case-study case study modal, while collecting
 * layout health: broken images, horizontal drag, and text left invisible by a
 * reveal animation that never ran.
 *
 * Usage:  npm run dev   (in another shell)
 *         node scripts/audit-visual.mjs
 *
 * Output: reports/design-audit/*.png (local only — see .gitignore) and a JSON
 * summary on stdout. Exit code 1 if any section has a broken image, horizontal
 * drag, or invisible text, so it can be wired into CI later.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5173/';
const OUT = process.env.OUT ?? 'reports/design-audit';
mkdirSync(OUT, { recursive: true });

const SECTIONS = ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story', 'contact'];

async function enter(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const skip = page.getByRole('button', { name: /SKIP INTRO/i });
  await skip.waitFor({ timeout: 20000 });
  await skip.click();
  const pick = page.getByRole('button', { name: /The full series, in order/i });
  await pick.waitFor({ timeout: 20000 });
  await pick.click();
  await page.locator('#main').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500);
}

async function audit(page, label) {
  const report = [];
  for (const id of SECTIONS) {
    if (!(await page.locator(`#${id}`).count())) {
      report.push({ id, missing: true });
      continue;
    }
    await page.evaluate((sid) => {
      const el = document.getElementById(sid);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, id);
    await page.waitForTimeout(1600);

    report.push(
      await page.evaluate((sid) => {
        const root = document.getElementById(sid);
        const invisible = [];
        root.querySelectorAll('*').forEach((n) => {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const ownText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 2);
          if (ownText && parseFloat(cs.opacity) < 0.05) invisible.push(n.tagName + '.' + String(n.className).slice(0, 40));
        });
        const imgs = [...root.querySelectorAll('img')];
        return {
          id: sid,
          h: Math.round(root.getBoundingClientRect().height),
          words: root.innerText.replace(/\s+/g, ' ').trim().split(' ').length,
          images: imgs.length,
          broken: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src),
          invisibleText: [...new Set(invisible)].slice(0, 8),
          drag: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      }, id),
    );
    await page.screenshot({ path: `${OUT}/${label}-${id}.png` });
  }
  return report;
}

const browser = await chromium.launch();
const results = {};

for (const [label, viewport] of [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text().slice(0, 200)));

  await enter(page);
  results[label] = await audit(page, label);
  results[`${label}Errors`] = errors;

  if (label === 'desktop') {
    await page.evaluate(() => document.getElementById('originals').scrollIntoView());
    await page.waitForTimeout(1200);
    await page.locator('#originals [data-cursor], #originals button').first().click();
    await page.waitForTimeout(1800);
    results.modal = await page.evaluate(() => {
      const d = document.querySelector('[role=dialog]');
      if (!d) return { open: false };
      const imgs = [...d.querySelectorAll('img')];
      return {
        open: true,
        icons: d.querySelectorAll('svg').length,
        headings: [...d.querySelectorAll('h2,h3,h4')].map((h) => h.innerText.replace(/\s+/g, ' ').slice(0, 40)),
        broken: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src),
      };
    });
    await page.screenshot({ path: `${OUT}/desktop-modal-top.png` });
    await page.evaluate(() => {
      const d = document.querySelector('[role=dialog]');
      const sc = [...d.querySelectorAll('*')].find((n) => n.scrollHeight > n.clientHeight + 40);
      if (sc) sc.scrollTop = sc.scrollHeight * 0.42;
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/desktop-modal-mid.png` });
  }
  await page.close();
}

await browser.close();

const flat = [...results.desktop, ...results.mobile].filter((s) => s && !s.missing);
const failures = flat.filter((s) => s.broken.length || s.invisibleText.length || s.drag > 0);

console.log(JSON.stringify(results, null, 1));
if (failures.length) {
  console.error(`\nFAIL: ${failures.length} section(s) with broken images, invisible text or horizontal drag.`);
  process.exit(1);
}
console.log(`\nOK: ${flat.length} section views clean — no broken images, no invisible text, no horizontal drag.`);
