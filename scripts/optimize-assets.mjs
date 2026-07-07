// Asset pipeline: assets-src/models/*.glb → public/models/*.glb (Draco + meshopt + webp textures).
// Budget-enforced: fails the run if any output exceeds 1.5 MB (see CLAUDE.md asset table).
// KTX2 section textures require the `toktx` binary (KTX-Software); see README.
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'assets-src/models';
const OUT = 'public/models';
const BUDGET_BYTES = 1.5 * 1024 * 1024;

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith('.glb'));
if (files.length === 0) {
  console.log(`No .glb files in ${SRC}/ — nothing to do.`);
  process.exit(0);
}

let failed = false;
for (const file of files) {
  const input = join(SRC, file);
  const output = join(OUT, file.toLowerCase());
  execFileSync(
    'pnpm',
    [
      'exec', 'gltf-transform', 'optimize', input, output,
      '--compress', 'draco',
      '--texture-compress', 'webp',
      '--texture-size', '1024',
    ],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );
  const inSize = statSync(input).size;
  const outSize = statSync(output).size;
  const over = outSize > BUDGET_BYTES;
  if (over) failed = true;
  console.log(
    `${file}: ${(inSize / 1024).toFixed(0)} KB → ${(outSize / 1024).toFixed(0)} KB` +
      (over ? `  ✗ OVER BUDGET (${(BUDGET_BYTES / 1024).toFixed(0)} KB max — decimate or drop it)` : '  ✓'),
  );
}

process.exit(failed ? 1 : 0);
