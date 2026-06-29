/* ============================================================
   VantaUI — compat reconciliation (facts vs prose).

   Reads the machine-derived facts (docs/compat-facts.json, produced by
   scripts/probe-css.mjs) and diffs them against the hand-curated catalog
   (docs/compat-data.js). It NEVER rewrites the prose: it surfaces every
   disagreement loudly so a human can decide. This is the gate that turns
   "AI mis-documented and nobody noticed" into a visible warning.

   What it flags, per component:
     • UNDECLARED MUTEX   probe proved a "pick one" group the catalog's
                          `conflicts` (the X ↔ Y lines) does not list
     • UNVERIFIED MUTEX   catalog declares X ↔ Y but the probe could not
                          confirm it (often a context-dependent helper that
                          is a no-op in isolation — informational, not fatal)
     • DEAD KNOB          catalog documents a --knob the CSS never reads
                          (hard drift — the knob does nothing)
     • NO-OP HELPER       catalog lists a helper with no measurable effect in
                          isolation (context-dependent, default-valued, or dead)
     • CROSS-KIND CLASH   probe saw two different-kind helpers fight over a
                          property (verify it is intended, e.g. glow replacing
                          a panel's elevation shadow)

   Exit code is non-zero only for HARD drift (dead knobs, undeclared mutex)
   unless --soft is passed; the rest are informational.

     node scripts/reconcile-compat.mjs            # report, fail on hard drift
     node scripts/reconcile-compat.mjs --soft     # report only, always exit 0
     node scripts/reconcile-compat.mjs --json out.json

   Claude Generated, verified by hand.
   ============================================================ */
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root = process.cwd();
const factsPath = resolve(root, 'docs', 'compat-facts.json');
const compatData = resolve(root, 'docs', 'compat-data.js');

const args = process.argv.slice(2);
const soft = args.includes('--soft');
const jsonOut = (() => {
  const i = args.indexOf('--json');
  return i !== -1 && args[i + 1] ? resolve(args[i + 1]) : null;
})();

// Parse the catalog's `conflicts` strings into declared mutex sets. Only the
// lines written as "a ↔ b ↔ c" are machine-comparable; free-prose gotchas are
// left for humans and ignored here.
function declaredMutexSets(conflicts = []) {
  const sets = [];
  for (const c of conflicts) {
    if (!c.includes('↔')) continue;
    const words = c
      .split('↔')
      .map(s => s.trim())
      // strip a leading lead-in like "tone words mutually exclusive" (no real words)
      .filter(w => /^[\w-]+$/.test(w));
    if (words.length >= 2) sets.push(words);
  }
  return sets;
}

// Is set A fully contained in some set of list B (order-independent)?
const subsetOfAny = (a, list) => {
  const has = b => a.every(x => b.includes(x));
  return list.some(has);
};

function main() {
  return Promise.all([
    readFile(factsPath, 'utf8').then(JSON.parse),
    import(pathToFileURL(compatData).href),
  ]).then(([facts, {COMPONENTS}]) => {
    const byId = Object.fromEntries(COMPONENTS.map(c => [c.id, c]));
    const report = {undeclaredMutex: [], unverifiedMutex: [], deadKnobs: [], noOpHelpers: [], crossKind: []};

    for (const [id, f] of Object.entries(facts.components)) {
      const cat = byId[id];
      if (!cat) continue;
      const declared = declaredMutexSets(cat.conflicts);
      const probed = f.mutexGroups || [];

      // probe found a group the catalog doesn't declare
      for (const g of probed) {
        if (g.length < 2) continue;
        if (!subsetOfAny(g, declared)) {
          report.undeclaredMutex.push({id, group: g});
        }
      }
      // catalog declares a set the probe didn't fully back up
      for (const d of declared) {
        const unverified = d.filter(w => !probed.some(g => g.includes(w)));
        if (unverified.length) report.unverifiedMutex.push({id, declared: d, unverified});
      }
      // dead knobs: documented but CSS never reads them
      for (const [k, info] of Object.entries(f.knobs || {})) {
        if (!info.consumed) report.deadKnobs.push({id, knob: k});
      }
      // no-op helpers the catalog still lists
      if (f.noOpHelpers && f.noOpHelpers.length) {
        report.noOpHelpers.push({id, helpers: f.noOpHelpers});
      }
      // cross-kind clashes (informational)
      for (const x of f.crossKindCollisions || []) {
        report.crossKind.push({id, pair: x.pair, kinds: x.kinds, over: x.over, winner: x.winner});
      }
    }

    // ---- console report ----
    const line = (label, n) => console.log(`\n${label} (${n})`);
    line('● UNDECLARED MUTEX — add to catalog conflicts', report.undeclaredMutex.length);
    for (const r of report.undeclaredMutex) console.log(`   ${r.id}: ${r.group.join(' ↔ ')}`);

    line('● DEAD KNOBS — documented but never read in CSS', report.deadKnobs.length);
    for (const r of report.deadKnobs) console.log(`   ${r.id}: ${r.knob}`);

    line('○ UNVERIFIED MUTEX — declared, probe could not confirm (likely context-dependent)', report.unverifiedMutex.length);
    for (const r of report.unverifiedMutex) console.log(`   ${r.id}: ${r.declared.join(' ↔ ')}  unconfirmed: ${r.unverified.join(', ')}`);

    line('○ NO-OP HELPERS — no measurable effect in isolation', report.noOpHelpers.length);
    for (const r of report.noOpHelpers) console.log(`   ${r.id}: ${r.helpers.join(', ')}`);

    line('○ CROSS-KIND CLASHES — verify intended', report.crossKind.length);
    for (const r of report.crossKind) console.log(`   ${r.id}: ${r.pair.join(' × ')} [${r.kinds.join('/')}] over ${r.over.join(',')} (${r.winner} wins)`);

    const hard = report.undeclaredMutex.length + report.deadKnobs.length;
    console.log(`\n${hard ? '✗' : '✓'} ${hard} hard drift item(s); ${report.unverifiedMutex.length + report.noOpHelpers.length + report.crossKind.length} informational.`);

    if (jsonOut) {
      return writeFile(jsonOut, JSON.stringify(report, null, 2)).then(() => {
        console.log('wrote', jsonOut);
        process.exit(soft ? 0 : hard ? 1 : 0);
      });
    }
    process.exit(soft ? 0 : hard ? 1 : 0);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
