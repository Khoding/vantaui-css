/* ============================================================
   BatOS build — bundle src/batos.css into dist/ with LightningCSS.
   Inlines the local @import graph, keeps cascade layers, adds vendor
   prefixes for the browserslist targets, and emits both a readable
   bundle and a minified one.

   The remote Google Fonts @import can't be inlined (it isn't a local
   file), so we strip it from a temporary entry before bundling and
   re-insert it after the leading @layer statement — the one spot where
   @import is still valid.
     node scripts/build.mjs
   ============================================================ */

import {bundle} from 'lightningcss';
import {mkdirSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcDir = resolve(root, 'src');
const entry = resolve(srcDir, 'batos.css');
const tmpEntry = resolve(srcDir, '__batos_build_entry.css');
const outDir = resolve(root, 'dist');

// LightningCSS targets (major << 16 | minor << 8). This is the real feature
// floor for the library: oklch, color-mix, :has(), cascade layers, mask and
// conic-gradient all shipped together (~2023). Targeting it keeps OKLCH native
// (the hand-written hex fallbacks in src remain for anyone building older).
const targets = {
  chrome: 111 << 16,
  edge: 111 << 16,
  firefox: 121 << 16,
  safari: (16 << 16) | (4 << 8),
};

const REMOTE_IMPORT = /@import\s+url\(\s*["']https?:\/\/[^)]+["']\s*\)[^;]*;/g;
const LOCAL_FONTS_IMPORT = /@import\s+url\(\s*["'][^"']*fonts\.css["']\s*\)[^;]*;/g;

mkdirSync(outDir, {recursive: true});

// The remote Google Fonts @import lives inside tokens/fonts.css, which the
// entry pulls in locally. LightningCSS can't resolve a remote @import from
// disk, so we (a) drop the local fonts.css import from a temp entry, and
// (b) grab the remote @import out of fonts.css to re-inject into the bundle.
const entryText = readFileSync(entry, 'utf8');
const fontsCss = readFileSync(resolve(srcDir, 'tokens/fonts.css'), 'utf8');
const fontImports = fontsCss.match(REMOTE_IMPORT) || [];
writeFileSync(tmpEntry, entryText.replace(LOCAL_FONTS_IMPORT, ''));

// Re-insert the font import right after the leading `@layer …;` statement
// (still a legal position for @import), else at the very top.
function withFonts(code) {
  if (!fontImports.length) return code;
  const imports = fontImports.join('\n');
  const m = code.match(/@layer[^;{]*;/);
  if (m) {
    const at = m.index + m[0].length;
    return `${code.slice(0, at)}\n${imports}\n${code.slice(at)}`;
  }
  return `${imports}\n${code}`;
}

function build({minify, outFile}) {
  const {code} = bundle({filename: tmpEntry, minify, targets});
  const out = withFonts(code.toString());
  const dest = resolve(outDir, outFile);
  writeFileSync(dest, out);
  console.log(`✔ ${outFile.padEnd(16)} ${(out.length / 1024).toFixed(1)} kB`);
}

console.log('BatOS — building dist/ …');
try {
  build({minify: false, outFile: 'batos.css'});
  build({minify: true, outFile: 'batos.min.css'});
  console.log('Done.');
} finally {
  rmSync(tmpEntry, {force: true});
}
