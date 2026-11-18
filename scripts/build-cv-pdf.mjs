/**
 * Builds the downloadable CV PDF straight from the site's own résumé data.
 *
 *   npm run cv-pdf
 *
 * Output: public/assets/Ajay_Kumar_Myakala_CV.pdf
 *
 * Why a script instead of a hand-exported file: the PDF used to be a separate
 * design that drifted from the site every time the CV changed. This typesets the
 * same `cv` object the résumé sheet renders (plus the domains and toolchain from
 * portfolio.ts), so "Download CV" can never fall behind the page again.
 *
 * Implementation notes:
 *  - The data modules are TypeScript, so they are loaded through Vite's SSR
 *    module runner rather than duplicated here.
 *  - Rendering is pdfmake with the fonts it ships (embedded as base64 in the
 *    library), so the PDF needs no headless browser, no system fonts and no
 *    fontconfig — it builds identically on a bare CI box or a laptop.
 */
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { createServer } from 'vite';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const OUT = resolve('public/assets/Ajay_Kumar_Myakala_CV.pdf');

const INK = '#1a1a20';
const BODY = '#33333c';
const MUTED = '#55555f';
const RULE = '#dcdce2';
const CRIMSON = '#c8102e';

const PAGE = { left: 46, right: 46, top: 40, bottom: 46 };

pdfMake.addVirtualFileSystem(pdfFonts);
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

/** Load the same modules the site renders, through Vite so plain TS works on Node 18+. */
async function loadContent() {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
  try {
    const { cv } = await server.ssrLoadModule('/src/data/cv.ts');
    const { industries, toolbox } = await server.ssrLoadModule('/src/data/portfolio.ts');
    return { cv, industries, toolbox };
  } finally {
    await server.close();
  }
}

/** A section heading with a hairline under it — the only structural device on the sheet. */
function heading(text) {
  return {
    margin: [0, 12, 0, 6],
    table: {
      widths: ['*'],
      body: [[{ text: text.toUpperCase(), characterSpacing: 1.5, bold: true, fontSize: 7.4, color: CRIMSON }]],
    },
    layout: {
      hLineWidth: (i) => (i === 1 ? 0.6 : 0),
      vLineWidth: () => 0,
      hLineColor: () => RULE,
      paddingTop: () => 0,
      paddingBottom: () => 3,
      paddingLeft: () => 0,
      paddingRight: () => 0,
    },
  };
}

/** "Product Strategy — product vision…" → bold lead, then the rest. */
function splitLead(line) {
  const [lead, ...rest] = String(line).split(' — ');
  return { lead, rest: rest.join(' — ') };
}

function documentDefinition({ cv, industries, toolbox }) {
  const c = cv.contact;
  const toolGroups = [...new Set(toolbox.map((t) => t.group))];

  const experience = cv.experience.map((x) => ({
    unbreakable: true,
    margin: [0, 0, 0, 9],
    stack: [
      {
        columns: [
          { width: '*', text: x.org, bold: true, fontSize: 10.2, color: INK },
          { width: 'auto', text: x.period, fontSize: 8, bold: true, color: MUTED },
        ],
      },
      {
        margin: [0, 1, 0, 0],
        text: [{ text: x.title, bold: true, color: CRIMSON, fontSize: 8.9 }, { text: x.place ? ` · ${x.place}` : '', color: '#75757f', fontSize: 8.6 }],
      },
      { margin: [0, 2, 0, 0], text: x.highlight, fontSize: 8.9, color: BODY },
    ],
  }));

  return {
    pageSize: 'A4',
    pageMargins: [PAGE.left, PAGE.top, PAGE.right, PAGE.bottom],
    defaultStyle: { font: 'Roboto', fontSize: 9, color: BODY, lineHeight: 1.32 },
    info: {
      title: `${c.displayName} — ${cv.heading}`,
      author: c.displayName,
      subject: cv.role,
      keywords: 'Lead Product Designer, UX Strategy, Enterprise Product Experience, Design Leadership',
      creator: 'npm run cv-pdf',
    },
    footer: (current, total) => ({
      margin: [PAGE.left, 0, PAGE.right, 0],
      columns: [
        { text: `${c.displayName} · ${c.email}`, fontSize: 7, color: '#8a8a94' },
        { text: `${current} / ${total}`, fontSize: 7, color: '#8a8a94', alignment: 'right' },
      ],
    }),
    content: [
      // ── header ────────────────────────────────────────────────────────────
      {
        columns: [
          { width: '*', text: c.displayName, fontSize: 27, bold: true, color: INK, lineHeight: 1 },
          {
            width: 'auto',
            alignment: 'right',
            margin: [12, 1, 0, 0],
            stack: [
              { text: c.location, fontSize: 8.2, color: MUTED, lineHeight: 1.28 },
              { text: c.email, link: `mailto:${c.email}`, fontSize: 8.2, color: INK, lineHeight: 1.28 },
              { text: c.phone, fontSize: 8.2, color: MUTED, lineHeight: 1.28 },
              { text: 'linkedin.com/in/ajaykumarmyakala', link: c.linkedin, fontSize: 8.2, color: MUTED, lineHeight: 1.28 },
            ],
          },
        ],
        columnGap: 18,
      },
      // Full width so the four-part designation sets on one line instead of wrapping mid-phrase.
      {
        margin: [0, 5, 0, 0],
        text: cv.role.toUpperCase(),
        fontSize: 7.3,
        bold: true,
        characterSpacing: 1.25,
        color: CRIMSON,
      },
      {
        margin: [0, 7, 0, 0],
        canvas: [
          { type: 'rect', x: 0, y: 0, w: 62, h: 2, color: CRIMSON },
          { type: 'rect', x: 62, y: 0.6, w: 431, h: 0.8, color: RULE },
        ],
      },

      // ── profile ───────────────────────────────────────────────────────────
      heading('Profile'),
      { text: cv.intro, fontSize: 9.3, lineHeight: 1.45, color: BODY },
      {
        margin: [0, 5, 0, 0],
        text: [
          { text: `${cv.experience.length} roles`, bold: true, color: INK },
          { text: ` across ${industries.length} industries`, color: MUTED },
          { text: ' · ', color: MUTED },
          { text: '5-member design team', bold: true, color: INK },
          { text: ' led · ', color: MUTED },
          { text: '37%', bold: true, color: INK },
          { text: ' faster underwriting decisions', color: MUTED },
        ],
        fontSize: 8.4,
      },

      // ── capabilities ──────────────────────────────────────────────────────
      heading('Leadership & Design Capabilities'),
      {
        columns: [
          {
            width: '*',
            stack: cv.highlights.slice(0, Math.ceil(cv.highlights.length / 2)).map((line) => {
              const { lead, rest } = splitLead(line);
              return {
                margin: [0, 0, 10, 3.2],
                fontSize: 8.5,
                text: [{ text: lead, bold: true, color: INK }, { text: rest ? ` — ${rest}` : '', color: BODY }],
              };
            }),
          },
          {
            width: '*',
            stack: cv.highlights.slice(Math.ceil(cv.highlights.length / 2)).map((line) => {
              const { lead, rest } = splitLead(line);
              return {
                margin: [0, 0, 0, 3.2],
                fontSize: 8.5,
                text: [{ text: lead, bold: true, color: INK }, { text: rest ? ` — ${rest}` : '', color: BODY }],
              };
            }),
          },
        ],
        columnGap: 14,
      },

      // ── experience ────────────────────────────────────────────────────────
      heading('Professional Experience'),
      ...experience,

      // ── domains + technology ──────────────────────────────────────────────
      heading('Domain Experience'),
      { text: industries.join('  ·  '), fontSize: 8.7, color: BODY },

      heading('Design & Technology'),
      {
        columns: [
          {
            width: '*',
            stack: toolGroups.slice(0, 4).map((g) => ({
              margin: [0, 0, 12, 2.4],
              fontSize: 8.5,
              text: [
                { text: `${g}: `, bold: true, color: INK },
                { text: toolbox.filter((t) => t.group === g).map((t) => t.name).join(', '), color: BODY },
              ],
            })),
          },
          {
            width: '*',
            stack: toolGroups.slice(4).map((g) => ({
              margin: [0, 0, 0, 2.4],
              fontSize: 8.5,
              text: [
                { text: `${g}: `, bold: true, color: INK },
                { text: toolbox.filter((t) => t.group === g).map((t) => t.name).join(', '), color: BODY },
              ],
            })),
          },
        ],
        columnGap: 14,
      },

      // ── education + certification ─────────────────────────────────────────
      {
        columns: [
          {
            width: '*',
            stack: [
              heading('Education'),
              ...cv.education.map((e) => ({
                margin: [0, 0, 12, 5],
                stack: [
                  { text: e.title, bold: true, fontSize: 8.9, color: INK },
                  { text: e.detail, fontSize: 8.3, color: MUTED },
                ],
              })),
            ],
          },
          {
            width: '*',
            stack: [
              heading('Certification'),
              ...cv.certifications.map((x) => ({
                stack: [
                  { text: x.title, bold: true, fontSize: 8.9, color: INK },
                  { text: `${x.issuer}${x.issued ? ` · ${x.issued}` : ''}`, fontSize: 8.3, color: MUTED },
                ],
              })),
            ],
          },
        ],
        columnGap: 14,
      },

      // ── closing ───────────────────────────────────────────────────────────
      {
        margin: [0, 14, 0, 0],
        table: { widths: ['*'], body: [[{ text: cv.closing, italics: true, fontSize: 9.6, color: MUTED }]] },
        layout: {
          hLineWidth: (i) => (i === 0 ? 0.7 : 0),
          vLineWidth: () => 0,
          hLineColor: () => RULE,
          paddingTop: () => 7,
          paddingBottom: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
        },
      },
    ],
  };
}

const content = await loadContent();
const buffer = await pdfMake.createPdf(documentDefinition(content)).getBuffer();

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, buffer);
console.log(`CV PDF written: ${OUT} (${(buffer.length / 1024).toFixed(0)} KB)`);
