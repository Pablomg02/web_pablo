// Builds the animated signature on the home page,
// src/_includes/partials/signature.njk, from scripts/signature/signature.svg.
//
//   npm run signature   (node scripts/build-signature.js)
//
// The source is a variable-width pen drawing exported as filled outlines: a
// chain of "ribbons", each a closed polygon whose first half runs along one
// edge of the stroke and whose second half comes back along the other. That
// is what makes the drawing animation possible. For each ribbon the script
// recovers its centre line (pairing the two edges by arc length) and writes
// the ribbon masked by that line, stroked wide enough to cover it. Growing
// the masks' dashes one after another, in the order the pen went, uncovers
// the signature as if it were being written; the stroke keeps its real
// thickness throughout, because what is drawn is the original outline.
//
// One mask per ribbon (rather than one per pen stroke) keeps a wide mask
// from uncovering a neighbouring part of the same stroke early, where the
// line doubles back on itself (the tip of the M).
//
// The timing goes into the markup as --d (delay) and --t (duration) on each
// mask line; style.css runs the animation, site.js starts it.

const fs = require("node:fs");
const path = require("node:path");

const source = path.join(__dirname, "signature", "signature.svg");
const output = path.join(__dirname, "..", "src", "_includes", "partials", "signature.njk");

// The pen strokes, as ranges of ribbon indices in the source, in the order
// they were written: the stem of the P, its bowl and bar, then the M, which
// runs on into the oval.
const STROKES = [[0, 5], [6, 18], [19, 66]];
// The dot in the source is the rounded tip of the M; it appears with the
// ribbon that turns there.
const DOT_RIBBON = 26;

// The oval starts where the M's last leg turns out to the right.
const OVAL_FROM = 30;

const TOTAL_SECONDS = 2.6; // pen on paper at an even pace, all strokes together
const OVAL_PACE = 0.5; // the oval takes this share of that pace's time
const LIFT_SECONDS = 0.14; // pen in the air between strokes
const SIMPLIFY = 0.22; // outline tolerance, in source units
const SAMPLES = 32; // points on each recovered centre line

const svg = fs.readFileSync(source, "utf8");
const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
const ribbons = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) =>
  [...m[1].matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((p) => [+p[1], +p[2]]));
const dot = svg.match(/<circle[^>]*>/)[0];

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const fmt = (n) => (Math.round(n * 10) / 10).toString();
const pointsToPath = (pts, close) =>
  "M" + pts.map((p) => fmt(p[0]) + "," + fmt(p[1])).join("L") + (close ? "Z" : "");

function length(pts) {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i]);
  return total;
}

function resample(pts, count) {
  const total = length(pts);
  const out = [pts[0]];
  let i = 1;
  let walked = 0;
  for (let k = 1; k < count - 1; k++) {
    const target = (total * k) / (count - 1);
    while (walked + dist(pts[i - 1], pts[i]) < target) walked += dist(pts[i - 1], pts[i++]);
    out.push(lerp(pts[i - 1], pts[i], (target - walked) / dist(pts[i - 1], pts[i])));
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// Ramer-Douglas-Peucker: drops the points that sit within `tolerance` of the
// line through their neighbours. The outlines come with a point every unit
// and a half; most of them are redundant.
function simplify(pts, tolerance) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const len = dist(a, b) || 1e-9;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / len;
    if (d > worst) [worst, index] = [d, i];
  }
  if (worst <= tolerance) return [a, b];
  return simplify(pts.slice(0, index + 1), tolerance).slice(0, -1)
    .concat(simplify(pts.slice(index), tolerance));
}

// The two edges of a ribbon. A full ribbon has 61 points per edge, and the
// first ribbon of a stroke 11 more closing its starting cap, which are left
// out. A ribbon that tapers to a point (the end of a stroke) turns at its
// tip, the point farthest from where it starts.
function edges(pts) {
  if (pts.length === 122 || pts.length === 133) {
    return [pts.slice(0, 61), pts.slice(61, 122).reverse()];
  }
  const start = lerp(pts[0], pts[pts.length - 1], 0.5);
  let tip = 0;
  pts.forEach((p, i) => { if (dist(p, start) > dist(pts[tip], start)) tip = i; });
  return [pts.slice(0, tip + 1), pts.slice(tip).reverse()];
}

const pieces = ribbons.map((pts, index) => {
  const [left, right] = edges(pts).map((edge) => resample(edge, SAMPLES));
  const centre = left.map((p, i) => lerp(p, right[i], 0.5));
  const width = Math.max(...left.map((p, i) => dist(p, right[i])));
  return { index, outline: simplify(pts, SIMPLIFY), centre, width, length: length(centre) };
});

// Within a stroke the pen speeds up and slows down (ease in and out); each
// ribbon's mask runs linearly over its share of that curve, so the motion is
// smooth across ribbons. A stroke's time is proportional to its length.
// The oval is a quick flourish: its ribbons count OVAL_PACE of their length,
// reached over its first few so the pen speeds up instead of jumping.
const ease = (u) => 0.4 * u + 0.6 * (u * u * (3 - 2 * u));
const inkLength = pieces.reduce((sum, p) => sum + p.length, 0);
const secondsPerUnit = TOTAL_SECONDS / inkLength;
const OVAL_RAMP = 4;
pieces.forEach((p) => {
  const into = Math.min(Math.max((p.index - OVAL_FROM + 1) / OVAL_RAMP, 0), 1);
  p.span = p.length * (1 - (1 - OVAL_PACE) * into);
});
const strokeSpans = STROKES.map(([a, b]) =>
  pieces.slice(a, b + 1).reduce((sum, p) => sum + p.span, 0));
let clock = 0;
STROKES.forEach(([a, b], s) => {
  const duration = secondsPerUnit * strokeSpans[s];
  let walked = 0;
  for (const piece of pieces.slice(a, b + 1)) {
    const from = ease(walked / strokeSpans[s]);
    walked += piece.span;
    const to = ease(walked / strokeSpans[s]);
    piece.delay = clock + duration * from;
    piece.duration = Math.max(duration * (to - from), 0.001);
  }
  clock += duration + LIFT_SECONDS;
});

// The mask line overshoots the ribbon at both ends by half its width, so the
// flat end of the dash never leaves a sliver of the ribbon's end uncovered.
function extend(centre, by) {
  const [a, b] = [centre[0], centre[1]];
  const [y, z] = [centre[centre.length - 2], centre[centre.length - 1]];
  const out = (p, q) => {
    const d = dist(p, q) || 1;
    return [q[0] + ((q[0] - p[0]) / d) * by, q[1] + ((q[1] - p[1]) / d) * by];
  };
  return [out(b, a), ...centre, out(y, z)];
}

const sec = (n) => (Math.round(n * 1000) / 1000) + "s";
const masks = pieces.map((p) => {
  const width = p.width + 8;
  return `<mask id="signature-m${p.index}" maskUnits="userSpaceOnUse">`
    + `<path class="signature__pen" fill="none" stroke="#fff" stroke-linejoin="round" d="${pointsToPath(extend(p.centre, width / 2), false)}"`
    + ` stroke-width="${fmt(width)}" pathLength="1" style="--d:${sec(p.delay)};--t:${sec(p.duration)}"/>`
    + `</mask>`;
}).join("\n");
const ink = pieces.map((p) => {
  const shape = `<path d="${pointsToPath(p.outline, true)}"/>`;
  const inner = p.index === DOT_RIBBON ? shape + dot.replace(/\s*\/?>$/, "/>") : shape;
  return p.index === DOT_RIBBON
    ? `<g mask="url(#signature-m${p.index})">${inner}</g>`
    : inner.replace("<path ", `<path mask="url(#signature-m${p.index})" `);
}).join("\n");

const result = `{#- Generated by scripts/build-signature.js from scripts/signature/signature.svg.
   Do not edit by hand: change the script or the source and run it again. -#}
<svg class="signature" data-signature viewBox="${viewBox}" aria-hidden="true" focusable="false">
<defs>
${masks}
</defs>
<g class="signature__ink">
${ink}
</g>
</svg>
`;

fs.writeFileSync(output, result);
console.log(`${path.relative(process.cwd(), output)}: ${(result.length / 1024).toFixed(1)} KB, `
  + `${pieces.length} ribbons, ${clock - LIFT_SECONDS > 0 ? (clock - LIFT_SECONDS).toFixed(2) : 0}s`);
