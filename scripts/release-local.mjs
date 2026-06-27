/* ============================================================
   release-local.mjs — "release" the current build into a consumer
   project WITHOUT a git commit/tag/GitHub release.

   It copies exactly the files this package would publish (the
   `files` whitelist in package.json) over the consumer's installed
   copy at <target>/node_modules/vantaui-css/, then clears Vite's
   pre-bundle cache so JS entry points (vantaui-css/vue, /stats, /js)
   re-optimize on the next dev start. Pure-CSS changes show up on a
   plain reload; JS changes need that cache cleared (done here).

   Usage:
     node scripts/release-local.mjs                 # default targets
     node scripts/release-local.mjs <consumer-dir>  # one-off target
     npm run release:local                          # build + sync defaults

   The consumer's package.json is never touched — this is a drop-in
   over node_modules, reverted by a normal `npm install`.
   ============================================================ */
import {cpSync, rmSync, existsSync, readFileSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

// Default consumer projects in this workspace. Override with CLI args.
const DEFAULT_TARGETS = [''];

const targets = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_TARGETS;

const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const files = pkg.files; // ["dist","src","js","vue","nuxt","README.md","LICENSE"]

let synced = 0;
for (const target of targets) {
  const dest = join(resolve(target), 'node_modules', 'vantaui-css');
  if (!existsSync(dest)) {
    console.error(`✘ skip ${target} — no node_modules/vantaui-css (run npm install there first)`);
    continue;
  }

  // Copy each published entry; replace dirs wholesale so removed files vanish.
  for (const f of files) {
    const from = join(repoRoot, f);
    if (!existsSync(from)) continue;
    const to = join(dest, f);
    rmSync(to, {recursive: true, force: true});
    cpSync(from, to, {recursive: true});
  }
  // Always ship the current package.json (exports map, version).
  cpSync(join(repoRoot, 'package.json'), join(dest, 'package.json'));

  // Bust Vite's pre-bundle cache so JS entry points re-optimize next start.
  rmSync(join(resolve(target), 'node_modules', '.vite'), {recursive: true, force: true});

  console.log(`✔ synced → ${dest}`);
  synced++;
}

if (!synced) {
  console.error('Nothing synced.');
  process.exit(1);
}
console.log(`\nDone. Restart the consumer's dev server (vite) to pick up changes.`);
