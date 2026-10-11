// Builds optimized portrait assets from the original photo in the project root.
// ajay.jpg = true-colour photo (28k+ colours), ajay.png = the background-removed
// cutout of the same framing. The PNG alone is an 8-bit indexed file, so its RGB is
// posterised/dithered; we take only its alpha mask and apply it to the JPEG, then
// trim the light-background fringe from the mask edge.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets';
const PHOTO = 'ajay.jpg';
const MASK = 'ajay.png';
const WIDTHS = [640, 420, 300];
mkdirSync(OUT, { recursive: true });

const { width, height } = await sharp(PHOTO).metadata();

// --- alpha mask from the cutout, resized to the photo and de-fringed ---
const raw = await sharp(MASK)
  .ensureAlpha()
  .extractChannel('alpha')
  .resize(width, height, { kernel: 'lanczos3' })
  .blur(0.6)
  .raw()
  .toBuffer();

// Contrast-stretch the mask: drop the faint halo the light backdrop leaves behind,
// keep fully opaque interiors, keep the gradient through hair/spill.
const LO = 24;
const HI = 232;
const scale = 255 / (HI - LO);
const alpha = Buffer.alloc(width * height);
for (let i = 0; i < alpha.length; i++) {
  const v = raw[i];
  alpha[i] = v <= LO ? 0 : v >= HI ? 255 : Math.round((v - LO) * scale);
}

const rgb = await sharp(PHOTO).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = alpha[i];
}
const cutout = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();

for (const w of WIDTHS) {
  // never upscale past the source
  if (w > width) continue;
  await sharp(cutout).resize({ width: w }).webp({ quality: 90, alphaQuality: 92 }).toFile(`${OUT}/portrait-${w}.webp`);
}

// Social share image (1200x630) on a dark backdrop
const portrait = await sharp(cutout).resize({ height: 600 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#07070a' } })
  .composite([
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs><radialGradient id="g" cx="78%" cy="45%" r="45%"><stop offset="0" stop-color="#e5132b" stop-opacity="0.45"/><stop offset="1" stop-color="#e5132b" stop-opacity="0"/></radialGradient></defs>
        <rect width="1200" height="630" fill="url(#g)"/>
      </svg>`),
    },
    { input: portrait, gravity: 'southeast' },
    {
      input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <text x="72" y="282" font-family="Impact, 'Arial Narrow', sans-serif" font-size="92" fill="#f4f1ec" letter-spacing="3">AJAY KUMAR</text>
        <text x="72" y="370" font-family="Impact, 'Arial Narrow', sans-serif" font-size="92" fill="#f4f1ec" letter-spacing="3">MYAKALA</text>
        <text x="76" y="412" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="20" fill="#ff3d5a" letter-spacing="8">THE SERIES</text>
        <text x="76" y="452" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="16" fill="#a7a6ad" letter-spacing="2">PRODUCT STRATEGY &amp; DESIGN · AI-ENABLED PRODUCT DEVELOPMENT</text>
      </svg>`),
    },
  ])
  .jpeg({ quality: 85 })
  .toFile(`${OUT}/og-image.jpg`);
console.log(`images built from ${PHOTO} + ${MASK} mask (${width}x${height})`);
