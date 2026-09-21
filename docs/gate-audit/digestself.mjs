// A teaching digest must agree with ITSELF.
//
// A digest has two halves with different provenance: GENERATED lines, which a
// script printed from engine output and which carry ' = ', and PROSE, which a
// human or an agent typed to introduce them. Every long number in the prose is
// therefore a hand-copied number, and a hand-copied number can be stale.
//
// PD1 shipped a digest whose prose header gave ESCRAVOS-9's three operating
// point slopes as -0.28613307, -0.45150345 and +0.16537038 while its own
// generated block gave -0.28613256, -0.45150309 and +0.16537053. Same well,
// same point, same quantities, disagreeing in the seventh significant figure.
// numsweep could not catch it: it sweeps the LESSONS against the digest, and
// both halves of the digest are in the digest.
//
//   node digestself.mjs <wave_dir> [digest filename, default digest.txt]
import * as fs from 'fs';
import * as path from 'path';

const WAVE = process.argv[2];
const NAME = process.argv[3] || 'digest.txt';
if (!WAVE || !fs.existsSync(path.join(WAVE, NAME))) {
  console.error('usage: digestself.mjs <wave_dir> [digest filename]');
  process.exit(2);
}

const lines = fs.readFileSync(path.join(WAVE, NAME), 'utf8').split('\n');
const NUM = /-?\d+\.?\d*(?:[eE][-+]?\d+)?/g;
const sig = (s) => s.replace(/[-.]/g, '').replace(/^0+/, '').length;

// WHICH LINES ARE PROSE depends on how the wave's dump script writes.
//
// Some waves mark every commentary line with a leading '#' and print generated
// values in full sentences ("the TRUE residual at the shipped answer is X psi,
// which is Y times ..."). Others carry an unmarked prose header and print every
// generated value as "label = value". Using the wrong rule on a wave makes the
// gate report hundreds of false disagreements, which is exactly the wall of
// noise the numeric sweep taught us to distrust, so pick the rule from the file.
const hashMarked = lines.some((l) => /^\s*#/.test(l));
const isProse = (line) => (hashMarked ? /^\s*#/.test(line) : !line.includes(' = '));

const generated = new Set();
for (const line of lines) {
  if (isProse(line)) continue;
  for (const n of line.match(NUM) || []) generated.add(Math.abs(parseFloat(n)));
}

// Prose may ROUND a generated value, it may not invent one. A prose literal
// matches if some generated value rounds to it at the prose literal's own
// printed precision, which is why a stale seventh digit is caught and an
// honest four decimal summary is not.
const decimals = (s) => (s.split('.')[1] || '').length;
const genList = [...generated];
const matches = (n) => {
  const v = Math.abs(parseFloat(n));
  if (generated.has(v)) return true;
  const d = decimals(n);
  return genList.some((g) => Number(g.toFixed(d)) === Number(v.toFixed(d)));
};

let checked = 0;
const bad = [];
lines.forEach((line, i) => {
  if (!isProse(line)) return;
  for (const n of line.match(NUM) || []) {
    if (sig(n) < 6) continue;
    checked += 1;
    if (!matches(n)) bad.push({ line: i + 1, n, text: line.trim() });
  }
});

console.log(`\n${NAME}: ${generated.size} distinct generated values, ` +
            `${checked} prose literals of 6+ significant figures checked`);
for (const b of bad) console.log(`  PROSE NOT IN THE GENERATED BLOCK  line ${b.line}: ${b.n}\n     ${b.text}`);
console.log(bad.length ? `\nDIGEST DISAGREES WITH ITSELF: ${bad.length}\n` : '\nthe digest agrees with itself\n');
process.exit(bad.length ? 1 : 0);
