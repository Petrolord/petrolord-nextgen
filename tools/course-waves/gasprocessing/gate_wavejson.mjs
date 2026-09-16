// GATE: wave.json must not outlive the digest it describes.
//
// It gave two answers for its own digest in one file: a `digest` block saying
// 675 lines and 19 sections, and a `gates` entry saying 721 and 20. A plan
// that outlives its engine is a named failure mode on this programme, and a
// plan that contradicts ITSELF is the same failure with the evidence already
// in the room.
//
// Every claim wave.json makes that can be checked against a file is checked
// here, and the gate refuses if it found nothing to check.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const W = '/root/fc-wip-gasprocessing';
const w = JSON.parse(fs.readFileSync(`${W}/wave.json`, 'utf8'));
const D = fs.readFileSync(`${W}/digest.txt`, 'utf8').split('\n');

const bad = [];
let checked = 0;
const ck = (name, ok, detail) => { checked += 1; if (!ok) bad.push(`${name}: ${detail}`); };

// --- the digest's own measurements, wherever wave.json states them ---
const lines = D.length - (D[D.length - 1] === '' ? 1 : 0);
const sections = D.filter((l) => /^# SECTION \d+:/.test(l)).length;
ck('digest.lines', w.digest.lines === lines, `wave.json says ${w.digest.lines}, digest has ${lines}`);
ck('digest.sections', w.digest.sections === sections, `wave.json says ${w.digest.sections}, digest has ${sections}`);

// The SAME two numbers appear inside the gates prose. A file that states a
// figure twice must state it the same way both times.
const prose = JSON.stringify(w.gates);
const restated = [...prose.matchAll(/(\d+)\s+lines/g)].map((m) => Number(m[1]));
restated.forEach((n, i) => ck(`gates prose line count ${i + 1}`, n === lines, `says ${n}, digest has ${lines}`));
const restatedSec = [...prose.matchAll(/(\d+)\s+section titles/g)].map((m) => Number(m[1]));
restatedSec.forEach((n, i) => ck(`gates prose section count ${i + 1}`, n === sections, `says ${n}, digest has ${sections}`));

// --- the prose gate's warning count, which wave.json quotes ---
const out = execFileSync('node', ['/root/dc-wavekit/digestprose.mjs', `${W}/digest.txt`, '--rules', W], { encoding: 'utf8' });
const warned = Number(/(\d+) warned for a human read/.exec(out)[1]);
const pins = Number(/(\d+) engine pin\(s\)/.exec(out)[1]);
const quotedWarn = /(\d+) warned/.exec(prose);
if (quotedWarn) ck('gates prose warning count', Number(quotedWarn[1]) === warned, `says ${quotedWarn[1]}, gate reports ${warned}`);
const quotedPins = /(\d+) ENGINE FRAGMENTS PINNED|(\d+) engine fragments pinned/i.exec(prose);
if (quotedPins) {
  const n = Number(quotedPins[1] || quotedPins[2]);
  ck('gates prose pin count', n === pins, `says ${n}, gate reports ${pins}`);
}

// --- the structure claims ---
const structOut = execFileSync('python3', [`${W}/structure.py`], { encoding: 'utf8' });
const lessons = Number(/total\s+(\d+) lessons/.exec(structOut)[1]);
ck('lessonsPerTier x 3', w.plan.lessonsPerTier * 3 === lessons, `wave.json implies ${w.plan.lessonsPerTier * 3}, structure has ${lessons}`);

// --- the capstone field count ---
const fields = JSON.parse(fs.readFileSync(`${W}/fields.json`, 'utf8'));
ck('capstone field count', w.plan.capstones.count * w.plan.capstones.gradedFieldsEach === fields.length,
  `wave.json implies ${w.plan.capstones.count * w.plan.capstones.gradedFieldsEach}, fields.json has ${fields.length}`);

// --- every declared constant must actually appear in the digest ---
const digestText = D.join('\n');
const missing = Object.keys(w.constants).filter((v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return false;
  return !digestText.includes(v) && !digestText.includes(n.toFixed(6)) && !digestText.includes(n.toFixed(9))
      && !digestText.includes(n.toFixed(12)) && !digestText.includes(String(n));
});
ck('declared constants appear in the digest', missing.length === 0, `absent from the digest: ${missing.join(', ')}`);
checked += Object.keys(w.constants).length - 1;

// --- the route and slug ---
ck('route matches the slug', w.plan.route === `/dashboard/apps/${w.slug}`, `${w.plan.route} against the slug ${w.slug}`);

console.log(`gate_wavejson: ${checked} claim(s) in wave.json checked against the files they describe; ${bad.length} stale`);
bad.forEach((b) => console.log(`   STALE ${b}`));
if (checked < 10) { console.log('  GATE REFUSES: it examined too little to have checked anything'); process.exit(2); }
process.exit(bad.length ? 1 : 0);
