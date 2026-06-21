/* ============================================================
   VantaUI build — bundle src/vantaui.css into dist/ with LightningCSS.
   Inlines the local @import graph, keeps cascade layers, adds vendor
   prefixes for the browserslist targets, and emits both a readable
   bundle and a minified one.

   The remote Google Fonts @import can't be inlined (it isn't a local
   file), so we strip it from a temporary entry before bundling and
   re-insert it after the leading @layer statement — the one spot where
   @import is still valid.
     node scripts/build.mjs

     Claude Generated because it's good at it, verified by hand and it's okay.
   ============================================================ */

import {bundle} from 'lightningcss';
import {buildSync as esbuild} from 'esbuild';
import {mkdirSync, writeFileSync, readFileSync, rmSync, copyFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve, basename} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcDir = resolve(root, 'src');
const entry = resolve(srcDir, 'vantaui.css');
const tmpEntry = resolve(srcDir, '__vantaui_build_entry.css');
const outDir = resolve(root, 'dist');
const docsDir = resolve(root, 'docs');
const docsDistDir = resolve(docsDir, 'dist');

// ============================================================
// Docs coverage gate — every shipping component must be documented.
//
// The LLM docs in docs/ are hand-curated prose and silently drift from src/
// (a third of the library once shipped undocumented). This makes that a build
// error: each src/components/*.css must (a) have an entry here mapping it to
// the term(s) the docs use for it — a filename ≠ the user-facing name (e.g.
// `appshell` → "App frame") — and (b) be findable by at least one of those
// terms in BOTH a topic file (docs/llms-<topic>.txt) and the single-file
// docs/llms-full.txt. Adding a new component with no entry here fails the
// build, forcing you to document it. See CLAUDE.md.
// ============================================================
const DOC_TERMS = {
  alert: ['alert', '[role="status"]'],
  appshell: ['app frame'],
  avatar: ['avatar'],
  badge: ['badge'],
  button: ['button'],
  carousel: ['carousel'],
  'empty-state': ['empty state', '.empty'],
  footer: ['footer'],
  forms: ['field', '<input>', 'checkbox'],
  gauge: ['gauge'],
  header: ['app bar', 'header'],
  lists: ['description list', '<dl>'],
  menu: ['dropdown', 'action menu'],
  meter: ['meter'],
  navigation: ['side rail', 'breadcrumb', 'drawer'],
  overlay: ['modal', 'key/value', 'divider', 'tooltip'],
  pagination: ['pagination'],
  panel: ['panel'],
  rating: ['rating'],
  segmented: ['segmented'],
  skeleton: ['skeleton'],
  spinner: ['spinner'],
  stepper: ['stepper'],
  table: ['table'],
  tabs: ['tab strip', 'role="tab"'],
  timeline: ['timeline'],
  toast: ['toast'],
  toolbar: ['toolbar'],
  tree: ['tree'],
};

function checkDocsCoverage() {
  const components = readdirSync(resolve(srcDir, 'components'))
    .filter(f => f.endsWith('.css'))
    .map(f => basename(f, '.css'));

  const docFiles = readdirSync(docsDir).filter(f => /^llms.*\.txt$/.test(f));
  const read = f => readFileSync(resolve(docsDir, f), 'utf8').toLowerCase();
  const topicText = docFiles
    .filter(f => f !== 'llms.txt' && f !== 'llms-full.txt')
    .map(read)
    .join('\n');
  const fullText = docFiles.includes('llms-full.txt') ? read('llms-full.txt') : '';

  const hit = (terms, hay) => terms.some(t => hay.includes(t.toLowerCase()));
  const problems = [];

  for (const name of components) {
    const terms = DOC_TERMS[name];
    if (!terms) {
      problems.push(
        `• "${name}" (src/components/${name}.css) has no DOC_TERMS entry — document it in docs/llms-*.txt, then add a mapping in scripts/build.mjs.`,
      );
      continue;
    }
    if (!hit(terms, topicText))
      problems.push(
        `• "${name}" not found in any topic file (docs/llms-<topic>.txt). Expected one of: ${terms.join(', ')}`,
      );
    if (fullText && !hit(terms, fullText))
      problems.push(
        `• "${name}" missing from docs/llms-full.txt. Expected one of: ${terms.join(', ')}`,
      );
  }

  // A stale mapping (term for a component that no longer exists) is also a smell.
  for (const name of Object.keys(DOC_TERMS)) {
    if (!components.includes(name))
      problems.push(
        `• DOC_TERMS has "${name}" but src/components/${name}.css does not exist — remove the stale mapping.`,
      );
  }

  if (problems.length) {
    throw new Error(`Docs coverage check failed (${problems.length}):\n${problems.join('\n')}`);
  }
  console.log(`✔ docs coverage   ${components.length} components documented`);
}

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

// Generate the classic-script build from the ES module. js/vantaui.js is the
// single source of truth; the module already auto-inits and assigns window.vui,
// so an ESM→IIFE conversion is all the plain-<script> / file:// build needs.
// (Same browser floor as the CSS targets above.)
function buildGlobal() {
  const srcJs = resolve(root, 'js', 'vantaui.js');
  const destJs = resolve(root, 'js', 'vantaui.global.js');
  const banner =
    '/* GENERATED from js/vantaui.js by scripts/build.mjs — do not edit by hand.\n' +
    '   Classic-script build: plain <script src="vantaui.global.js"> (works over\n' +
    '   file:// too). Exposes window.vui and auto-inits. The CSS works without it. */';
  esbuild({
    entryPoints: [srcJs],
    outfile: destJs,
    bundle: true,
    format: 'iife',
    target: ['chrome111', 'edge111', 'firefox121', 'safari16.4'],
    banner: {js: banner},
    legalComments: 'inline',
  });
  const bytes = readFileSync(destJs).length;
  console.log(`✔ ${'js/vantaui.global.js'.padEnd(16)} ${(bytes / 1024).toFixed(1)} kB`);
}

console.log('VantaUI — building dist/ …');
checkDocsCoverage();
try {
  build({minify: false, outFile: 'vantaui.css'});
  build({minify: true, outFile: 'vantaui.min.css'});
  buildGlobal();
  mkdirSync(docsDistDir, {recursive: true});
  copyFileSync(resolve(outDir, 'vantaui.min.css'), resolve(docsDistDir, 'vantaui.min.css'));
  console.log('✔ docs/dist/vantaui.min.css');
  const docsJsDir = resolve(root, 'docs', 'js');
  mkdirSync(docsJsDir, {recursive: true});
  copyFileSync(resolve(root, 'js', 'vantaui.js'), resolve(docsJsDir, 'vantaui.js'));
  console.log('✔ docs/js/vantaui.js');
  console.log('Done.');
} finally {
  rmSync(tmpEntry, {force: true});
}
