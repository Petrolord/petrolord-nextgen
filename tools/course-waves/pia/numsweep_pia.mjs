#!/usr/bin/env node
// THE EC7 NUMSWEEP: the kit's numsweep.mjs, run per tier, with ONE exemption and
// ONE extra rule, both about engine reason strings.
//
// WHY. The engine prints every figure in a message or a basis as the shortest
// decimal that reads back to its field, so a computed figure can print every
// digit (the digest prints the extraction reason "64.7 differs from 64.6 by
// 0.10000000000000853, above the tolerance 0.05" beside the field it explains).
// LESSON_TASK.md lets a lesson quote a reason ONLY verbatim, in double quotation
// marks or as a blockquote line, as the engine's own words. The kit numsweep
// cannot tell such a quote from a bare serialised float, so:
//
//   THE EXEMPTION. A quoted span ("..." on one line, or the text of a `> `
//   blockquote line) whose text is EXACTLY a reason string the digest prints
//   is blanked before the kit sweep runs. Nothing else is blanked: a bare
//   number, a quote that differs from the digest by one character, or a quote
//   of something that is not a printed reason is swept as before.
//
//   THE EXTRA RULE. Any literal of more than fifteen significant figures in a
//   lesson (a serialised float) FAILS unless it sits inside such an exact
//   quoted reason. The kit sweep alone would pass a bare 2.9999999999999996,
//   because the truth file harvested from the digest resolves it; a figure a
//   lesson reasons with is quoted from the numeric field at six decimals.
//
// WHAT A "PRINTED REASON" IS, read from digest.txt: every double-quoted span
// in a digest line, every blockquote line, every cell of a table column
// whose header names a reason or the engine's message, every line the digest
// indents by four spaces, and every backtick span of eight characters or more.
// (The indented-line and backtick rules are D3's, kept: a lesson may show an
// engine string only verbatim, in an indented block or in backticks, exactly as
// the digest prints it.)
//
//   node numsweep_pia.mjs [--tier beginner|intermediate|advanced] [--content DIR]
//   node numsweep_pia.mjs --banks DIR   the 21 bank JSON files instead of the
//                                             lessons: every prompt, option and
//                                             explanation string, with the same
//                                             exemption and extra rule, then the
//                                             kit numsweep --banks on the result
//   node numsweep_pia.mjs --selftest     the negative controls
//
// Exit 0 clean, 1 a finding, 2 could not run.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const KIT = process.env.EC7_KIT || '/root/dc-wavekit';
const REPO = process.env.EC7_REPO || '/root/wt-ec7-nextgen';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const argv = process.argv.slice(2);
const opt = (f) => { const i = argv.indexOf(f); return i === -1 ? null : argv[i + 1]; };
const die = (m) => { console.log(`numsweep_pia REFUSES: ${m}`); process.exit(2); };

const NUM = /-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g;
const sig = (raw) => raw.replace(/[-.eE+]/g, '').replace(/^0+/, '').length;

export const printedReasons = (digest) => {
  const out = new Set();
  const lines = digest.split('\n');
  let reasonCols = null;
  lines.forEach((l) => {
    if (l.startsWith('#')) { reasonCols = null; return; }
    for (const m of l.matchAll(/"([^"]{8,})"/g)) out.add(m[1]);
    for (const m of l.matchAll(/`([^`]{8,})`/g)) out.add(m[1]);
    if (l.startsWith('> ')) out.add(l.slice(2));
    if (/^ {4}\S/.test(l)) out.add(l.slice(4));
    if (l.startsWith('|')) {
      const cells = l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      if (reasonCols === null) {
        reasonCols = cells.map((c, i) => (/reason|message/i.test(c) ? i : -1)).filter((i) => i >= 0);
      } else if (!/^-+$/.test(cells[0])) {
        reasonCols.forEach((i) => { if (cells[i]) cells[i].split('; ').forEach((c) => out.add(c)); });
      }
    } else reasonCols = null;
  });
  return out;
};

/** Every quoted span of a lesson line: "..." spans, and a blockquote's text. */
const spans = (line) => {
  const out = [];
  for (const m of line.matchAll(/"([^"]+)"/g)) out.push({ start: m.index, end: m.index + m[0].length, text: m[1] });
  for (const m of line.matchAll(/`([^`]+)`/g)) out.push({ start: m.index, end: m.index + m[0].length, text: m[1] });
  if (line.startsWith('> ')) out.push({ start: 0, end: line.length, text: line.slice(2) });
  if (/^ {4}\S/.test(line)) out.push({ start: 0, end: line.length, text: line.slice(4) });
  return out;
};

export const scan = (text, reasons) => {
  const blanked = [];
  const noise = [];
  let exempt = 0;
  text.split('\n').forEach((line, i) => {
    let b = line;
    const ok = spans(line).filter((s) => reasons.has(s.text) || reasons.has(s.text.replace(/[.,;:]$/, '')));
    ok.forEach((s) => { exempt += 1; b = b.slice(0, s.start) + ' '.repeat(s.end - s.start) + b.slice(s.end); });
    for (const m of line.matchAll(NUM)) {
      if (sig(m[0]) <= 15) continue;
      const inside = ok.some((s) => m.index >= s.start && m.index < s.end);
      if (!inside) noise.push({ line: i + 1, raw: m[0] });
    }
    blanked.push(b);
  });
  return { blanked: blanked.join('\n'), noise, exempt };
};

const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : (e.name.endsWith('.md') ? [path.join(d, e.name)] : [])));

const run = (content, tiers, reasons) => {
  let bad = 0;
  tiers.forEach((tier) => {
    const src = path.join(content, tier);
    if (!fs.existsSync(src)) die(`no tier directory ${src}`);
    const files = walk(src);
    if (!files.length) die(`the tier ${tier} holds no lesson`);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `ec7ns-${tier}-`));
    const dst = path.join(tmp, tier);
    let exempt = 0;
    const noise = [];
    files.forEach((f) => {
      const rel = path.relative(src, f);
      const r = scan(fs.readFileSync(f, 'utf8'), reasons);
      exempt += r.exempt;
      r.noise.forEach((n) => noise.push(`${tier}/${rel}:${n.line} ${n.raw}`));
      fs.mkdirSync(path.dirname(path.join(dst, rel)), { recursive: true });
      fs.writeFileSync(path.join(dst, rel), r.blanked);
    });
    let out = '';
    let code = 0;
    try {
      out = execFileSync('node', [path.join(KIT, 'numsweep.mjs'), HERE, '--content', dst], { encoding: 'utf8' });
    } catch (e) { out = (e.stdout || '') + (e.stderr || ''); code = e.status; }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`== ${tier}: ${files.length} lessons, ${exempt} exact reason quote(s) exempted`);
    console.log(out.trim().split('\n').map((l) => `   ${l}`).join('\n'));
    console.log(`   serialised floats outside an exact reason quote: ${noise.length}`);
    noise.forEach((n) => console.log(`     FLOAT NOISE ${n}`));
    if (code !== 0 || noise.length) bad += 1;
  });
  return bad;
};

/** Every string inside a bank JSON value, rewritten through scan(). */
const mapStrings = (v, f) => (typeof v === 'string' ? f(v) : Array.isArray(v) ? v.map((x) => mapStrings(x, f))
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapStrings(x, f)])) : v);

const runBanks = (dir, reasons) => {
  if (!fs.existsSync(dir)) die(`no bank directory ${dir}`);
  const files = fs.readdirSync(dir).filter((f) => /^ec7[bia]_.*\.json$/.test(f)).sort();
  if (files.length !== 21) die(`expected 21 ec7 bank JSON files in ${dir}, found ${files.length}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ec7ns-banks-'));
  let exempt = 0;
  const noise = [];
  files.forEach((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const out = mapStrings(data, (str) => {
      const r = scan(str, reasons);
      exempt += r.exempt;
      r.noise.forEach((n) => noise.push(`${f}: ${n.raw}`));
      return r.blanked;
    });
    fs.writeFileSync(path.join(tmp, f), JSON.stringify(out, null, 1));
  });
  let out = '';
  let code = 0;
  try {
    out = execFileSync('node', [path.join(KIT, 'numsweep.mjs'), HERE, '--banks', tmp], { encoding: 'utf8' });
  } catch (e) { out = (e.stdout || '') + (e.stderr || ''); code = e.status; }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`== banks: ${files.length} bank files, ${exempt} exact reason quote(s) exempted`);
  console.log(out.trim().split('\n').map((l) => `   ${l}`).join('\n'));
  console.log(`   serialised floats outside an exact reason quote: ${noise.length}`);
  noise.forEach((n) => console.log(`     FLOAT NOISE ${n}`));
  return code !== 0 || noise.length ? 1 : 0;
};

const selftest = () => {
  const reasons = printedReasons('# SECTION 1: x (owned by Associate m01)\n\nThe flag reads, verbatim: "value 1 has z = 2.9999999999999996, beyond the threshold 2.9".\n');
  const ok1 = scan('It reads "value 1 has z = 2.9999999999999996, beyond the threshold 2.9".', reasons);
  const ok2 = scan('> value 1 has z = 2.9999999999999996, beyond the threshold 2.9', reasons);
  const bad1 = scan('The statistic is 2.9999999999999996.', reasons);
  const bad2 = scan('It reads "value 1 has z = 2.9999999999999996, beyond the threshold 3".', reasons);
  const treeReasons = printedReasons('# SECTION 2: y (owned by Expert m02)\n\n    |   |   |--- RHOB <= 2.3810000000000002\n');
  const ok3 = scan('    |   |   |--- RHOB <= 2.3810000000000002', treeReasons);
  const ok4 = scan('The line reads `|   |   |--- RHOB <= 2.3810000000000002`.', treeReasons);
  const bad3 = scan('The threshold is 2.3810000000000002.', treeReasons);
  const bad4 = scan('    |   |   |--- RHOB <= 2.3810000000000003', treeReasons);
  const checks = [
    ['an exact printed tree line, indented, is exempt', ok3.noise.length === 0 && ok3.exempt === 1],
    ['an exact printed tree line in backticks is exempt', ok4.noise.length === 0 && ok4.exempt === 1],
    ['a bare threshold with its binary tail is FLOAT NOISE', bad3.noise.length === 1],
    ['a tree line one digit off the digest is NOT exempt', bad4.noise.length === 1 && bad4.exempt === 0],
    ['an exact quoted reason is exempt', ok1.noise.length === 0 && ok1.exempt === 1 && !/2\.9999/.test(ok1.blanked)],
    ['an exact blockquote reason is exempt', ok2.noise.length === 0 && ok2.exempt === 1],
    ['a bare serialised float is FLOAT NOISE', bad1.noise.length === 1 && /2\.9999/.test(bad1.blanked)],
    ['a quote that differs from the printed reason is NOT exempt', bad2.noise.length === 1 && bad2.exempt === 0],
  ];
  checks.forEach(([n, c]) => console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}`));
  const pass = checks.every(([, c]) => c);
  console.log(`numsweep_pia selftest ${pass ? 'OK' : 'FAILED'}`);
  return pass ? 0 : 1;
};

if (argv.includes('--selftest')) process.exit(selftest());
const content = opt('--content') || path.join(REPO, 'src/content/courses/pia');
const tier = opt('--tier');
if (tier && !TIERS.includes(tier)) die(`unknown tier ${tier}`);
const digest = fs.readFileSync(path.join(HERE, 'digest.txt'), 'utf8');
if (!fs.readdirSync(HERE).some((f) => /^truth-.*\.json$/.test(f))) die('no truth-*.json in the wave directory; harvest it first');
const reasons = printedReasons(digest);
if (reasons.size < 40) die(`only ${reasons.size} printed reason strings read from the digest`);
console.log(`[numsweep_pia] ${reasons.size} engine reason and message strings read from digest.txt`);
const banksDir = opt('--banks');
const bad = banksDir ? runBanks(banksDir, reasons) : run(content, tier ? [tier] : TIERS, reasons);
process.exit(bad ? 1 : 0);
