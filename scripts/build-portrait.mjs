// Turns a full-length source photo into the site's half-body cutout portrait.
//
//   portrait-source.jpg  ->  ajay.jpg (true-colour crop) + ajay.png (alpha mask, same crop)
//
// Run `npm run images` afterwards to emit public/assets/portrait-*.webp + og-image.jpg.
// Usage: node scripts/build-portrait.mjs [source]   (default: portrait-source.<ext>)
import sharp from 'sharp';
import { existsSync, readFileSync } from 'node:fs';
import { removeBackground } from '@imgly/background-removal-node';

const CANDIDATES = [
  process.argv[2],
  'portrait-source.jpg',
  'portrait-source.jpeg',
  'portrait-source.png',
  'portrait-source.webp',
].filter(Boolean);

const source = CANDIDATES.find((p) => existsSync(p));
if (!source) {
  console.error(`No source photo found. Tried: ${CANDIDATES.join(', ')}`);
  process.exit(1);
}

// Framing: keep the head plus roughly the top 62% of the person, in a 2:3 portrait crop.
const BODY_FRACTION = 0.62;
const ASPECT = 2 / 3; // width / height
const OUT_WIDTH = 640;

const original = readFileSync(source);
const meta = await sharp(original).metadata();
console.log(`source ${source} (${meta.width}x${meta.height})`);

// 1. Cut the subject out. A source that already carries a real alpha channel is used as-is
// (re-running the model on a clean cutout only softens the edges).
const srcAlpha = meta.hasAlpha
  ? (await sharp(original).ensureAlpha().extractChannel('alpha').stats()).channels[0]
  : null;
const alreadyCut = srcAlpha ? srcAlpha.min < 200 : false;
let cutBytes;
if (alreadyCut) {
  console.log('source already has transparency — skipping background removal');
  cutBytes = original;
} else {
  const type = `image/${meta.format === 'jpeg' ? 'jpeg' : meta.format}`;
  cutBytes = Buffer.from(await (await removeBackground(new Blob([original], { type }))).arrayBuffer());
}
const cutMeta = await sharp(cutBytes).metadata();

// 2. Find the subject so the crop follows the body rather than the frame centre.
const { info } = await sharp(cutBytes).ensureAlpha().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
const { width: aw, height: ah } = info;
const alpha = await sharp(cutBytes).ensureAlpha().extractChannel('alpha').raw().toBuffer();
let minX = aw, minY = ah, maxX = -1, maxY = -1;
for (let y = 0; y < ah; y++) {
  for (let x = 0; x < aw; x++) {
    if (alpha[y * aw + x] > 16) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (maxX < 0) {
  console.error('Background removal produced no subject pixels.');
  process.exit(1);
}

const subjH = maxY - minY + 1;
const subjCx = (minX + maxX) / 2;
console.log(`subject bbox ${maxX - minX + 1}x${subjH} at (${minX},${minY})`);

// 3. Half-body crop: 2:3, head near the top, centred on the subject.
let cropH = Math.round(Math.min(subjH * BODY_FRACTION, ah));
let cropW = Math.round(cropH * ASPECT);
if (cropW > aw) {
  cropW = aw;
  cropH = Math.round(cropW / ASPECT);
}
let left = Math.round(subjCx - cropW / 2);
left = Math.max(0, Math.min(left, aw - cropW));
let top = Math.round(minY - subjH * 0.015);
top = Math.max(0, Math.min(top, ah - cropH));
if (top < 0) top = 0;

// 4. Cutout mask at the final size, then the same rectangle from the true-colour photo.
const outHeight = Math.round((OUT_WIDTH * cropH) / cropW);
const mask = await sharp(cutBytes)
  .extract({ left, top, width: cropW, height: cropH })
  .resize(OUT_WIDTH, outHeight, { kernel: 'lanczos3' })
  .png({ compressionLevel: 9 })
  .toBuffer();
await sharp(mask).toFile('ajay.png');

await sharp(original)
  .extract({
    left: Math.round((left * meta.width) / cutMeta.width),
    top: Math.round((top * meta.height) / cutMeta.height),
    width: Math.round((cropW * meta.width) / cutMeta.width),
    height: Math.round((cropH * meta.height) / cutMeta.height),
  })
  .resize(OUT_WIDTH, outHeight, { kernel: 'lanczos3' })
  .flatten({ background: '#ffffff' })
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
  .toFile('ajay.jpg');

console.log(`wrote ajay.jpg + ajay.png at ${OUT_WIDTH}x${outHeight} (crop ${cropW}x${cropH} from ${left},${top})`);
