/* ============================================================
   BatOS palette → OKLCH generator.
   Converts the hand-tuned sRGB palette to OKLCH so colour tokens
   can ship as `oklch(...)` (with a hex/rgba fallback). Run with:
     node scripts/palette-oklch.mjs
   Pure stdlib, no deps. sRGB D65 → linear → OKLab → OKLCH.
   ============================================================ */

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklch(r, g, b) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  let C = Math.sqrt(A * A + B * B);
  let H = Math.atan2(B, A) * 180 / Math.PI;
  if (H < 0) H += 360;
  return [L * 100, C, H];
}

const hexToRgb = (h) => {
  h = h.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const fmt = ([L, C, H], a) => {
  const Ls = L.toFixed(1).replace(/\.0$/, "") + "%";
  const Cs = C.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  const Hs = H.toFixed(1).replace(/\.0$/, "");
  return a == null ? `oklch(${Ls} ${Cs} ${Hs})` : `oklch(${Ls} ${Cs} ${Hs} / ${a})`;
};

const solids = {
  "ink-1000": "#03070c", "ink-900": "#060b12", "ink-800": "#0a1019", "ink-700": "#0e1722",
  "ink-600": "#13202e", "ink-500": "#1b2c3d", "ink-400": "#28415a",
  "cyan-50": "#e9fbff", "cyan-200": "#a8ecff", "cyan-400": "#42e3ff", "cyan-500": "#18cdf2",
  "cyan-600": "#0aa6cc", "cyan-700": "#0b7d9c",
  "amber-300": "#ffce7a", "amber-400": "#ffae3b", "amber-500": "#ff8a1a", "amber-600": "#d96a0c",
  "red-400": "#ff5a64", "red-500": "#ff2e3f", "red-600": "#cc1828",
  "green-400": "#57f5a3", "green-500": "#21d97e", "green-600": "#12a861",
  "slate-50": "#eaf4ff", "slate-200": "#c2d6e8", "slate-300": "#9fb6c9",
  "slate-400": "#74909f", "slate-500": "#51697a", "slate-600": "#38505f",
};

const alphas = [
  ["cyan-glow", 66, 227, 255, 0.55], ["amber-glow", 255, 138, 26, 0.5],
  ["red-glow", 255, 46, 63, 0.5], ["green-glow", 33, 217, 126, 0.45],
  ["hairline", 120, 196, 240, 0.16], ["hairline-strong", 120, 196, 240, 0.32],
  ["hairline-accent", 66, 227, 255, 0.45], ["scrim", 2, 6, 11, 0.72],
];

console.log("/* --- solids --- */");
for (const [k, v] of Object.entries(solids)) {
  const [r, g, b] = hexToRgb(v);
  console.log(`  --${k}: ${v};\n  --${k}: ${fmt(rgbToOklch(r, g, b))};`);
}
console.log("/* --- alpha --- */");
for (const [k, r, g, b, a] of alphas) {
  console.log(`  --${k}: rgba(${r}, ${g}, ${b}, ${a});\n  --${k}: ${fmt(rgbToOklch(r, g, b), a)};`);
}
