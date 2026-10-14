/**
 * Vendors Microsoft Fluent Emoji 3D renders into public/assets/icons3d.
 * Run: node scripts/build-icons.mjs
 * Reads the icon file names out of src/data/skillIcons.ts.
 * Uses curl with bounded timeouts; 404s fall through to the Default/ folder
 * candidate instead of being retried (404 is not transient).
 */
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const RAW = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets';
const OUT = 'public/assets/icons3d';

const source = await readFile(new URL('../src/data/skillIcons.ts', import.meta.url), 'utf8');
const icons = [...new Set([...source.matchAll(/:\s*'([a-z0-9_]+)'/g)].map((m) => m[1]))].sort();

await mkdir(OUT, { recursive: true });
const have = new Set(existsSync(OUT) ? await readdir(OUT) : []);
const todo = icons.filter((n) => !have.has(`${n}.png`));

async function grab(name) {
  // Repo folders are sentence case: 'Alarm clock', 'Magnifying glass tilted left'.
  const label = name.replace(/_/g, ' ');
  const folder = label.charAt(0).toUpperCase() + label.slice(1);
  const candidates = [
    `${RAW}/${encodeURIComponent(folder)}/3D/${name}_3d.png`,
    `${RAW}/${encodeURIComponent(folder)}/Default/3D/${name}_3d.png`,
  ];
  for (const url of candidates) {
    try {
      await run('curl', ['-fsSL', '--connect-timeout', '5', '--max-time', '25', '--retry', '2', '--retry-delay', '1', '-o', `${OUT}/${name}.png`, url]);
      return true;
    } catch {
      /* try next candidate */
    }
  }
  try {
    const { unlink } = await import('node:fs/promises');
    await unlink(`${OUT}/${name}.png`);
  } catch {
    /* partial file, if any */
  }
  return false;
}

const CONCURRENCY = 8;
const failed = [];
let done = 0;
for (let i = 0; i < todo.length; i += CONCURRENCY) {
  const batch = todo.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map((n) => grab(n).then((ok) => ({ n, ok }))));
  for (const { n, ok } of results) {
    done++;
    if (!ok) failed.push(n);
    console.log(`${ok ? '✓' : '✗'} ${n} (${done}/${todo.length})`);
  }
}

console.log(`\n${todo.length - failed.length} downloaded, ${have.size} already present, ${failed.length} failed`);
if (failed.length) {
  console.error('Failed:', failed.join(', '));
  process.exit(1);
}
