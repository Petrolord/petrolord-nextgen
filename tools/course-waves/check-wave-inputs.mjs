#!/usr/bin/env node
// THE COMMITTED WAVE INPUTS, AGAINST THE WAVE'S OWN COMMITTED GENERATORS.
//
// Every course suite under src/components/course/panels now reads its digest
// and its graded answer file from tools/course-waves/<wave>/. That is what
// makes the suites runnable on a CI runner, and it introduces the one failure
// mode the absolute paths did not have: THE COMMITTED COPY CAN GO STALE. A
// digest regenerated in a wave directory and not mirrored leaves the repository
// pinning numbers nothing produces any more, and every gate stays green,
// because a gate compares the lab with the file it was given.
//
// So the committed copy is checked against itself, three ways:
//
//   PRESENCE   every input the manifest lists is there and carries bytes.
//   CONTENT    digest.txt and fields.json are pinned by sha256 in waves.json.
//              A wave that is re-cut must re-pin in the same commit, which puts
//              the change in front of a reviewer instead of inside a data file.
//   STRUCTURE  every section heading the digest prints, and every graded field
//              name fields.json carries, is SPELLED BY A COMMITTED GENERATOR in
//              the same directory. This is the half that ties the data to the
//              code that makes it: swap in a digest from a different cut of the
//              dump and its headings stop matching.
//
// Known exceptions are recorded per wave in waves.json, with a count, so a NEW
// one fails while the recorded ones stay visible. Nothing here is tolerated
// silently.
//
//   node tools/course-waves/check-wave-inputs.mjs           check, exit 1 on drift
//   node tools/course-waves/check-wave-inputs.mjs --update  re-pin, printing every change
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(HERE, 'waves.json');
const UPDATE = process.argv.includes('--update');

const waves = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const SECTION = /^#?\s*SECTION\s+\d+[^\n]*/gm;

let failures = 0;
let updated = 0;
const fail = (msg) => { failures += 1; console.log(`  FAIL ${msg}`); };

console.log(`[course-waves] ${Object.keys(waves).length} wave(s) committed under ${HERE}\n`);

for (const [wave, entry] of Object.entries(waves)) {
  const dir = path.join(HERE, wave);
  console.log(`--- ${wave} (${entry.course}), kit: ${entry.kit}`);
  if (!fs.existsSync(dir)) { fail(`${wave} has no committed directory at ${dir}`); continue; }

  // PRESENCE.
  let missing = 0;
  for (const f of entry.inputs) {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) { fail(`${wave}/${f} is listed in waves.json and is not committed`); missing += 1; continue; }
    const size = fs.statSync(p).size;
    if (size === 0) { fail(`${wave}/${f} is committed empty`); missing += 1; continue; }
    console.log(`  ok   ${f.padEnd(26)} ${String(size).padStart(8)} bytes  ${sha(p).slice(0, 12)}`);
  }
  if (missing) continue;

  // CONTENT. The two files every suite pins its numbers against.
  const pinned = entry.pins || {};
  const nextPins = {};
  for (const f of ['digest.txt', 'fields.json']) {
    const got = sha(path.join(dir, f));
    nextPins[f] = got;
    if (pinned[f] === got) {
      console.log(`  ok   ${f} matches its pinned sha256`);
    } else if (UPDATE) {
      console.log(`  PIN  ${f} ${pinned[f] ? `${pinned[f].slice(0, 12)} -> ` : 'now pinned at '}${got.slice(0, 12)}`);
      updated += 1;
    } else {
      fail(`${wave}/${f} is ${got.slice(0, 12)} and waves.json pins ${pinned[f] ? pinned[f].slice(0, 12) : 'nothing'}. `
        + 'If the wave was re-cut, re-pin it in the same commit with --update.');
    }
  }
  entry.pins = UPDATE ? nextPins : entry.pins;

  // STRUCTURE. Every generator this wave commits, as one haystack.
  const generators = fs.readdirSync(dir).filter((f) => f.endsWith('.mjs') || f.endsWith('.py'));
  // A generator writing a heading inside a quoted string escapes the apostrophe
  // in it, so the source spells engine\'s where the digest prints engine's. The
  // escape is removed before the comparison, which is about the prose and not
  // about how a language quotes it.
  const haystack = generators
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
    .join('\n')
    .replace(/\\(['"`])/g, '$1');

  const digest = fs.readFileSync(path.join(dir, 'digest.txt'), 'utf8');
  const headings = digest.match(SECTION) || [];
  if (headings.length < 10) fail(`${wave}/digest.txt prints ${headings.length} section headings, which is too few to be a whole digest`);
  // A WAVE MAY BUILD ITS OWNER CLAUSE RATHER THAN TYPE IT, AND THAT IS STRICTER
  // RATHER THAN LOOSER. FC9's clauses were 25 hand-typed string literals with
  // nothing linking them to structure.py, and four of them named a module that
  // does not teach the section: one named a tier that does not either, which is
  // a forward leak waiting to happen. Its generator now RENDERS the clause from
  // structure.py and REFUSES at build time on an unknown tier, an unknown module
  // or a lesson that is not in the module beside it. The cost is that the whole
  // heading string is no longer a literal anywhere, so the test below stopped
  // finding 23 of them.
  //
  // The point of this check is that a heading comes out of a COMMITTED GENERATOR
  // rather than out of a hand-edited digest, and a heading whose TITLE is spelled
  // by a generator that also carries a clause builder still satisfies that. So a
  // heading is spelled when the generator carries it whole, or when the generator
  // carries its title AND builds section headings AND builds owner clauses. All
  // three are required: a generator that does neither cannot clear anything.
  const CLAUSE_TAIL = /\s*\((?:owned|shared|binding)\b[^)]*\)\s*$/i;
  const buildsHeadings = /# SECTION \$\{/.test(haystack);
  const buildsClauses = /\(owned by \$\{/.test(haystack);
  let assembled = 0;
  const unspelled = headings.map((h) => h.replace(/^#?\s*/, '').trim()).filter((h) => {
    if (haystack.includes(h)) return false;
    if (!buildsHeadings || !buildsClauses) return true;
    const title = h.replace(/^SECTION\s+\d+\s*:\s*/i, '').replace(CLAUSE_TAIL, '').trim();
    if (title && title !== h && haystack.includes(title)) { assembled += 1; return false; }
    return true;
  });
  const allowedHeadings = entry.headingsNoGeneratorSpells || 0;
  console.log(`  ok   digest.txt: ${headings.length} section heading(s), ${headings.length - unspelled.length} spelled by `
    + `${generators.length} committed generator(s)`
    + (assembled ? `, ${assembled} of them as a generator-written TITLE with an owner clause the generator BUILDS from the curriculum rather than types` : ''));
  if (unspelled.length !== allowedHeadings) {
    fail(`${wave}/digest.txt has ${unspelled.length} section heading(s) no committed generator spells, `
      + `and waves.json records ${allowedHeadings}. The headings: ${unspelled.map((h) => h.slice(0, 60)).join(' | ')}`);
  } else if (allowedHeadings) {
    console.log(`  note ${allowedHeadings} heading(s) are assembled by the dump rather than written out, as recorded`);
  }

  const fields = JSON.parse(fs.readFileSync(path.join(dir, 'fields.json'), 'utf8'));
  if (fields.length !== 18) fail(`${wave}/fields.json carries ${fields.length} graded fields and every wave grades 18`);
  const names = fields.map((f) => f[1]);
  const unspelledFields = names.filter((n) => !haystack.includes(n));
  const allowedFields = entry.fieldsNoGeneratorSpells || [];
  console.log(`  ok   fields.json: ${names.length} graded field name(s), ${names.length - unspelledFields.length} spelled by a committed generator`);
  const unexpected = unspelledFields.filter((n) => !allowedFields.includes(n));
  const goneStale = allowedFields.filter((n) => !unspelledFields.includes(n));
  if (unexpected.length) {
    fail(`${wave}/fields.json grades ${unexpected.join(', ')}, which no committed generator in ${wave} spells. `
      + 'Either the generator is not mirrored or the field name was written by hand.');
  }
  if (goneStale.length) {
    fail(`waves.json records ${goneStale.join(', ')} as spelled by no generator in ${wave}, and a generator now spells it. `
      + 'Remove it from fieldsNoGeneratorSpells.');
  }
  if (allowedFields.length) {
    console.log(`  note ${allowedFields.length} graded field name(s) are spelled by no committed generator, as recorded: ${allowedFields.join(', ')}`);
  }
  console.log('');
}

if (UPDATE) {
  fs.writeFileSync(MANIFEST, `${JSON.stringify(waves, null, 2)}\n`);
  console.log(`[course-waves] re-pinned ${updated} file digest(s) in waves.json`);
}
if (failures) {
  console.log(`[course-waves] ${failures} problem(s). The committed wave inputs are what every course gate reads, so this is a red build.`);
  process.exit(1);
}
console.log('[course-waves] every committed wave input is present, pinned and spelled by a committed generator.');
