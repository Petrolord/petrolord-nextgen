#!/usr/bin/env node
// THE D2 NUMSWEEP: the kit's numsweep.mjs, run per tier, with ONE exemption and
// ONE extra rule, both about engine reason strings.
//
// WHY. The engine prints every figure in a flag's `reason` as the shortest
// decimal that reads back to its field, so a computed statistic prints every
// digit ("value 1 has z = 2.9999999999999996, beyond the threshold 2.9").
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
// in a digest line, every blockquote line, and every cell of a table column
// whose header names a reason or the engine's message.
//
//   node numsweep_mlcore.mjs [--tier beginner|intermediate|advanced] [--content DIR]
//   node numsweep_mlcore.mjs --selftest     the negative controls
//
// Exit 0 clean, 1 a finding, 2 could not run.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const KIT = process.env.D2_KIT || '/root/dc-wavekit';
const REPO = process.env.D2_REPO || '/root/wt-dai-d2-nextgen';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const argv = process.argv.slice(2);
const opt = (f) => { const i = argv.indexOf(f); return i === -1 ? null : argv[i + 1]; };
const die = (m) => { console.log(`numsweep_mlcore REFUSES: ${m}`); process.exit(2); };

const NUM = /-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g;
const sig = (raw) => raw.replace(/[-.eE+]/g, '').replace(/^0+/, '').length;

export const printedReasons = (digest) => {
  const out = new Set();
  const lines = digest.split('\n');
  let reasonCols = null;
  lines.forEach((l) => {
    if (l.startsWith('#')) { reasonCols = null; return; }
    for (const m of l.matchAll(/"([^"]{8,})"/g)) out.add(m[1]);
    if (l.startsWith('> ')) out.add(l.slice(2));
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
  if (line.startsWith('> ')) out.push({ start: 0, end: line.length, text: line.slice(2) });
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
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `d2ns-${tier}-`));
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

const selftest = () => {
  const reasons = printedReasons('# SECTION 1: x (owned by Associate m01)\n\nThe flag reads, verbatim: "value 1 has z = 2.9999999999999996, beyond the threshold 2.9".\n');
  const ok1 = scan('It reads "value 1 has z = 2.9999999999999996, beyond the threshold 2.9".', reasons);
  const ok2 = scan('> value 1 has z = 2.9999999999999996, beyond the threshold 2.9', reasons);
  const bad1 = scan('The statistic is 2.9999999999999996.', reasons);
  const bad2 = scan('It reads "value 1 has z = 2.9999999999999996, beyond the threshold 3".', reasons);
  const checks = [
    ['an exact quoted reason is exempt', ok1.noise.length === 0 && ok1.exempt === 1 && !/2\.9999/.test(ok1.blanked)],
    ['an exact blockquote reason is exempt', ok2.noise.length === 0 && ok2.exempt === 1],
    ['a bare serialised float is FLOAT NOISE', bad1.noise.length === 1 && /2\.9999/.test(bad1.blanked)],
    ['a quote that differs from the printed reason is NOT exempt', bad2.noise.length === 1 && bad2.exempt === 0],
  ];
  checks.forEach(([n, c]) => console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}`));
  const pass = checks.every(([, c]) => c);
  console.log(`numsweep_mlcore selftest ${pass ? 'OK' : 'FAILED'}`);
  return pass ? 0 : 1;
};

if (argv.includes('--selftest')) process.exit(selftest());
const content = opt('--content') || path.join(REPO, 'src/content/courses/mlcore');
const tier = opt('--tier');
if (tier && !TIERS.includes(tier)) die(`unknown tier ${tier}`);
const digest = fs.readFileSync(path.join(HERE, 'digest.txt'), 'utf8');
if (!fs.readdirSync(HERE).some((f) => /^truth-.*\.json$/.test(f))) die('no truth-*.json in the wave directory; harvest it first');
const reasons = printedReasons(digest);
if (reasons.size < 40) die(`only ${reasons.size} printed reason strings read from the digest`);
console.log(`[numsweep_mlcore] ${reasons.size} engine reason and message strings read from digest.txt`);
const bad = run(content, tier ? [tier] : TIERS, reasons);
process.exit(bad ? 1 : 0);
