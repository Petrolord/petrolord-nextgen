// QUESTION TEXT MAY NOT NAME THE INTERNAL DIGEST, ITS SECTIONS OR ITS GENERATOR.
//
// The digest is the course authors' internal reference file
// (tools/course-waves/<slug>/digest.txt). Learners never see it, its numbered
// SECTIONs or the generator script that wrote it, so a question that says "the
// digest prints", "SECTION 12 prints" or "the generator asserts" points at
// something that does not exist for them. The lesson copy has its own gate
// (noInternalDigestCopy.test.js); this one covers what a learner is QUIZZED on.
//
// WHAT IS SWEPT
//   * every committed question bank, tools/course-banks/<slug>/<tier>/*.json:
//     each question's prompt, four options and explanation;
//   * every deep seed that has NOT been applied, meaning a
//     migrations/*_deep.sql file that MIGRATIONS.md does not log. Those are
//     held seeds that will still be applied, so what they carry is what
//     learners will read. An applied seed is history and is never edited; its
//     live rows are corrected by a guarded recut instead;
//   * the NEW side of every digest-copy recut (migrations/*_dg_recut_*.sql):
//     the text each `update ... set` writes. The OLD side is the published text
//     the guard must recognise, and is expected to carry the old wording.
//
// It refuses an empty sweep: a minimum number of banks and questions, and each
// recut file must yield at least one update.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BANKS = path.join(ROOT, 'tools/course-banks');
const MIGRATIONS = path.join(ROOT, 'migrations');
const LOG = fs.readFileSync(path.join(ROOT, 'MIGRATIONS.md'), 'utf8');

const MIN_BANKS = 400;
const MIN_QUESTIONS = 8000;

// The same three patterns as the lesson gate. A published document's section
// ("NIOSH 2016-106 section 8.1") and an engine's random number generator pass.
const PATTERNS = [
  /digest/i,
  /\bSECTIONS? \d|\((?:SECTIONS?|[Ss]ections?) \d+(?:(?:,| and| or| to) \d+)*\)/,
  /\b(?:the|a) generator (?:now )?(?:asserts|types|holds|measures|built while)\b|\b(?:course's|capstone) generator\b|\bgenerator behind (?:this|the) course\b|\bthe generator's own\b/i,
];
export const internal = (text) => PATTERNS.some((re) => re.test(text));

/** Every single-quoted SQL string literal outside comments, unescaped. */
export const sqlLiterals = (sql) => {
  const out = [];
  let i = 0;
  while (i < sql.length) {
    if (sql.startsWith('--', i)) { const j = sql.indexOf('\n', i); i = j < 0 ? sql.length : j; continue; }
    if (sql.startsWith('/*', i)) { const j = sql.indexOf('*/', i + 2); i = j < 0 ? sql.length : j + 2; continue; }
    if (sql[i] === "'") {
      let j = i + 1; let s = '';
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j + 1] === "'") { s += "'"; j += 2; continue; }
        if (sql[j] === "'") break;
        s += sql[j]; j += 1;
      }
      out.push(s); i = j + 1; continue;
    }
    i += 1;
  }
  return out;
};

/** The literals an update statement writes: everything between `set` and `where`. */
export const recutNewText = (sql) => [...sql.matchAll(/update public\.academy_quiz_questions\s+set ([\s\S]*?)\n\s*where /g)]
  .flatMap((m) => sqlLiterals(m[1]));

const walk = (dir, keep, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, keep, out); else if (keep(e.name)) out.push(p);
  }
  return out;
};

const banks = walk(BANKS, (f) => f.endsWith('.json'));
const migrationFiles = fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort();
const heldSeeds = migrationFiles.filter((f) => f.endsWith('_deep.sql') && !LOG.includes(f.replace(/\.sql$/, '')));
const recuts = migrationFiles.filter((f) => /_dg_recut_/.test(f));

describe('question text never names the internal digest, its sections or its generator', () => {
  it('REFUSES AN EMPTY SWEEP: the banks and their questions are all there', () => {
    const n = banks.reduce((a, f) => a + JSON.parse(fs.readFileSync(f, 'utf8')).length, 0);
    expect(banks.length).toBeGreaterThanOrEqual(MIN_BANKS);
    expect(n).toBeGreaterThanOrEqual(MIN_QUESTIONS);
  });

  it('no committed bank question says it, in its prompt, options or explanation', () => {
    const hits = banks.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')).flatMap((q, i) => [q.prompt, ...q.options, q.explanation]
      .filter((t) => internal(t)).map((t) => `${path.relative(ROOT, f)} Q${i + 1}: ${t.slice(0, 140)}`)));
    expect(hits.join('\n')).toBe('');
  });

  it('no held (unapplied) deep seed carries it in any string it writes', () => {
    const hits = heldSeeds.flatMap((f) => sqlLiterals(fs.readFileSync(path.join(MIGRATIONS, f), 'utf8'))
      .filter(internal).map((t) => `${f}: ${t.slice(0, 140)}`));
    console.log(`[digest bank gate] ${banks.length} banks, ${heldSeeds.length} held deep seeds, ${recuts.length} recut files`);
    expect(hits.join('\n')).toBe('');
  });

  it('every digest-copy recut writes only clean text, and writes something', () => {
    expect(recuts.length).toBeGreaterThan(0);
    const hits = recuts.flatMap((f) => {
      const written = recutNewText(fs.readFileSync(path.join(MIGRATIONS, f), 'utf8'));
      expect(written.length, `${f} writes nothing`).toBeGreaterThan(0);
      return written.filter(internal).map((t) => `${f}: ${t.slice(0, 140)}`);
    });
    expect(hits.join('\n')).toBe('');
  });
});

describe('the bank gate itself (negative controls)', () => {
  it('GOES RED on a planted bank question', () => {
    const q = { prompt: 'What does the digest print?', options: ['a', 'b', 'c', 'd'], explanation: 'SECTION 12 prints it.' };
    expect([q.prompt, ...q.options, q.explanation].filter(internal)).toHaveLength(2);
    expect(internal('The generator asserts that ordering.')).toBe(true);
    expect(internal('The course prints it.')).toBe(false);
    expect(internal('the NIOSH 2016-106 section 8.1 equation')).toBe(false);
    expect(internal('A generator built from an integer seed you supply.')).toBe(false);
  });

  it('reads SQL literals and skips comments, so a planted seed row goes red and a comment does not', () => {
    const sql = "-- the digest prints this, in a comment\ninsert into t values ('x', 'The digest''s table pairs it.');";
    expect(sqlLiterals(sql)).toEqual(['x', "The digest's table pairs it."]);
    expect(sqlLiterals(sql).filter(internal)).toHaveLength(1);
  });

  it('reads the NEW side of a recut and ignores its OLD guard', () => {
    const sql = [
      "  select case when prompt = 'What does the digest say?' then 'old' end",
      "    update public.academy_quiz_questions set prompt = 'What does the course say?', explanation = 'SECTION 4 prints it.'",
      "     where app_slug = 'x' and ord = 1;",
    ].join('\n');
    expect(recutNewText(sql)).toEqual(['What does the course say?', 'SECTION 4 prints it.']);
    expect(recutNewText(sql).filter(internal)).toHaveLength(1);
  });

  it('a planted line in a REAL held seed or bank is caught by the same readers', () => {
    const bank = JSON.parse(fs.readFileSync(banks[0], 'utf8'));
    expect([bank[0].prompt, ...bank[0].options, bank[0].explanation].filter(internal)).toHaveLength(0);
    bank[0].explanation += ' The digest prints the answer.';
    expect([bank[0].prompt, ...bank[0].options, bank[0].explanation].filter(internal)).toHaveLength(1);
    if (heldSeeds.length) {
      const sql = fs.readFileSync(path.join(MIGRATIONS, heldSeeds[0]), 'utf8');
      expect(sqlLiterals(sql).filter(internal)).toHaveLength(0);
      expect(sqlLiterals(`${sql}\nselect 'SECTION 9 prints it';`).filter(internal)).toHaveLength(1);
    }
  });
});
