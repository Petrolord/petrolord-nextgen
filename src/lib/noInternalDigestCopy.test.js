// LEARNER COPY MAY NOT SAY "DIGEST".
//
// The digest is the course authors' internal reference file, the dump in
// tools/course-waves/<slug>/digest.txt that lesson writers quote from. No
// learner ever sees it, so a lesson that says "the digest prints 74.737770"
// points its reader at something that does not exist for them. Over 400
// lesson files across 27 courses said exactly that until they were rewritten
// to name what the learner really has: the lab, the worked example, the
// engine or the Studio. This gate stops it coming back.
//
// WHAT IS SWEPT
//   * every lesson file (src/content/courses/**/*.md), any occurrence at all;
//   * every tier manifest (src/content/courses/**/manifest.json), which carries
//     the module and lesson titles a learner reads;
//   * every course component under src/components/course (tests excluded) and
//     every course learning page (src/pages/apps/*LearningPage.jsx), after
//     comments are removed, as a whole word so identifiers such as
//     teachingDigestText or DIGEST_CUT_DATE pass.
//
// WHAT IS ALLOWED, BY EXACT TEXT: the few string literals in lab modules that
// no panel renders (the gas lift and nodal digest generators that the lab
// suites compare against, a repair-history label only a test reads, and two
// input guards whose errors the explorers catch). Each is listed below. A new
// occurrence anywhere else fails, including a new one in those same files.
//
// The gate refuses an empty sweep: it asserts a minimum number of files of
// each kind, so a moved directory cannot turn it into a pass over nothing.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COURSES = path.join(SRC, 'content/courses');
const COURSE_COMPONENTS = path.join(SRC, 'components/course');
const APP_PAGES = path.join(SRC, 'pages/apps');

// Minimums, well under today's counts (5071 lessons, 199 manifests, about 400
// component files, 65 learning pages), and far above zero.
const MIN_LESSONS = 4000;
const MIN_MANIFESTS = 150;
const MIN_COMPONENT_FILES = 200;
const MIN_LEARNING_PAGES = 40;

// Lesson copy. The word itself: any occurrence, in any case, inside any word.
const LESSON_WORD = /digest/i;
// A pointer into a numbered section of the internal file. The file's own style
// is capitals ("SECTION 13", "SECTIONS 12 and 14"), and lessons also wrote a
// bare section number in parentheses ("(Section 14)", "(section 29)"). A
// published document's section ("NIOSH 2016-106 section 8.1") and a casing
// string's "section 2" are neither, and pass.
const SECTION_POINTER = /\bSECTIONS? \d|\((?:SECTIONS?|[Ss]ections?) \d+(?:(?:,| and| or| to) \d+)*\)/;
// The authors' generator, the script that wrote the internal file and asserted
// its figures, named by what it did ("the generator asserts", "the numbers the
// generator holds", "the course's generator", "the capstone generator"). A
// random number generator, a seeded generator, a deck generator or a data
// set's generator is something the learner meets in the engine or the studio,
// and passes.
const AUTHORS_GENERATOR = /\b(?:the|a) generator (?:now )?(?:asserts|types|holds|measures|built while)\b|\b(?:course's|capstone) generator\b|\bgenerator behind (?:this|the) course\b|\bthe generator's own\b/i;
const LESSON_PATTERNS = [LESSON_WORD, SECTION_POINTER, AUTHORS_GENERATOR];

// Legitimate lines the generator pattern would otherwise catch, by exact
// trimmed text: a data set's generator the lesson describes to the learner.
const LESSON_ALLOWED = {
};
// Code: the word on its own, so identifiers pass.
const CODE_WORD = /(?<![A-Za-z0-9_$])digest(?:s|ed|ing)?(?![A-Za-z0-9_$])/i;

// Unrendered string literals, by exact trimmed line. Keyed by file relative to
// src/components/course.
const ALLOWED = {
  'panels/gaslift/gasLiftLab.js': [
    "w('PD2 Gas Lift Design: TEACHING DIGEST');",
    "w('a separate file that the generator of this digest never opens.');",
    "w('number in every line of this file, and rejects the digest if any number lands');",
    "w('away, on a PUBLISHED golden valve setting that this digest is obliged to carry.');",
    "w('derived injectionPoint, TOWARD. This digest builds a monotone cubic through the');",
    "w('END OF DIGEST');",
  ],
  'panels/nodal/nodalLab.js': [
    "head('CAPSTONE AUX: NEMBE-14. NOT FOR LESSONS, NOT FOR THE TEACHING DIGEST.');",
  ],
  'panels/relief/reliefLab.js': [
    "framedBy: 'digest section 29, whose own title and first line say it is repair history, and nothing follows it',",
  ],
  'panels/fdp/fdpLab.js': [
    "if (!ODUDU_AS_OF.includes(asOf)) throw new Error(`oduduAsOf: the digest's as-of dates only, not ${asOf}`);",
  ],
  'panels/portfolio/portfolioLab.js': [
    "throw new Error(`OFON-1 is read at the digest's as-of dates only (${OFON_AS_OF.join(', ')}); ${asOf} is not one`);",
  ],
};

const walk = (dir, keep, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, keep, out);
    else if (keep(e.name)) out.push(p);
  }
  return out;
};

/**
 * Blank out JavaScript comments, keeping line numbers. Strings, template
 * literals and regex literals are skipped over so a // or /* inside one is not
 * read as a comment. JSX text is left alone: an apostrophe in JSX text can
 * only make this keep MORE text, which fails loudly, never silently.
 */
export const stripComments = (src) => {
  let out = '';
  let i = 0;
  let prev = '';
  const n = src.length;
  const blank = (s) => s.replace(/[^\n]/g, ' ');
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') {
      const j = src.indexOf('\n', i);
      const end = j === -1 ? n : j;
      out += blank(src.slice(i, end));
      i = end;
    } else if (c === '/' && d === '*') {
      const j = src.indexOf('*/', i + 2);
      const end = j === -1 ? n : j + 2;
      out += blank(src.slice(i, end));
      i = end;
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') j += 1;
        else if (c !== '`' && src[j] === '\n') break;
        j += 1;
      }
      out += src.slice(i, j + 1);
      i = j + 1;
      prev = c;
    } else if (c === '/' && (prev === '' || '(,=:[!&|?{};+-*%<>~^'.includes(prev))) {
      let j = i + 1;
      let inClass = false;
      while (j < n && src[j] !== '\n') {
        if (src[j] === '\\') j += 1;
        else if (src[j] === '[') inClass = true;
        else if (src[j] === ']') inClass = false;
        else if (src[j] === '/' && !inClass) break;
        j += 1;
      }
      out += src.slice(i, j + 1);
      i = j + 1;
      prev = '/';
    } else {
      out += c;
      if (!/\s/.test(c)) prev = c;
      i += 1;
    }
  }
  return out;
};

/** Every learner-copy occurrence in one lesson or manifest text. */
export const lessonHits = (text, allowed = []) => text.split('\n')
  .map((line, k) => ({ line: k + 1, text: line.trim() }))
  .filter((h) => LESSON_PATTERNS.some((re) => re.test(h.text)) && !allowed.includes(h.text));

/** Every non-comment, non-identifier occurrence in one code file, less the allowed lines. */
export const codeHits = (src, allowed = []) => stripComments(src).split('\n')
  .map((line, k) => ({ line: k + 1, text: line.trim() }))
  .filter((h) => CODE_WORD.test(h.text) && !allowed.includes(h.text));

const lessons = walk(COURSES, (f) => f.endsWith('.md'));
const manifests = walk(COURSES, (f) => f === 'manifest.json');
const components = walk(COURSE_COMPONENTS, (f) => /\.(js|jsx)$/.test(f) && !/\.test\.(js|jsx)$/.test(f));
const pages = walk(APP_PAGES, (f) => /LearningPage\.jsx$/.test(f));

const report = (hits) => hits.map((h) => `${h.file}:${h.line}: ${h.text.slice(0, 160)}`).join('\n');

describe('learner copy never names the internal digest, its sections or its generator', () => {
  it('REFUSES AN EMPTY SWEEP: every surface has at least its minimum number of files', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(MIN_LESSONS);
    expect(manifests.length).toBeGreaterThanOrEqual(MIN_MANIFESTS);
    expect(components.length).toBeGreaterThanOrEqual(MIN_COMPONENT_FILES);
    expect(pages.length).toBeGreaterThanOrEqual(MIN_LEARNING_PAGES);
  });

  it('no lesson file and no tier manifest says digest, points at an internal SECTION or names the authors\' generator', () => {
    const hits = [...lessons, ...manifests].flatMap((f) => lessonHits(
      fs.readFileSync(f, 'utf8'), LESSON_ALLOWED[path.relative(COURSES, f).split(path.sep).join('/')] || [],
    ).map((h) => ({ ...h, file: path.relative(SRC, f) })));
    expect(report(hits)).toBe('');
  });

  it('no rendered string in a course component or learning page says digest', () => {
    const hits = [...components, ...pages].flatMap((f) => {
      const rel = path.relative(COURSE_COMPONENTS, f);
      return codeHits(fs.readFileSync(f, 'utf8'), ALLOWED[rel] || [])
        .map((h) => ({ ...h, file: path.relative(SRC, f) }));
    });
    expect(report(hits)).toBe('');
  });

  it('every allowed lesson line still exists, so the list cannot outlive what it excuses', () => {
    const stale = Object.entries(LESSON_ALLOWED).flatMap(([rel, lines]) => {
      const p = path.join(COURSES, rel);
      const have = fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').map((l) => l.trim()) : [];
      return lines.filter((l) => !have.includes(l)).map((l) => `${rel}: ${l}`);
    });
    expect(stale).toEqual([]);
  });

  it('every allowed line still exists, so the allowlist cannot outlive what it excuses', () => {
    const stale = Object.entries(ALLOWED).flatMap(([rel, lines]) => {
      const p = path.join(COURSE_COMPONENTS, rel);
      const have = fs.existsSync(p) ? stripComments(fs.readFileSync(p, 'utf8')).split('\n').map((l) => l.trim()) : [];
      return lines.filter((l) => !have.includes(l)).map((l) => `${rel}: ${l}`);
    });
    expect(stale).toEqual([]);
  });
});

describe('the digest gate itself (negative controls)', () => {
  it('GOES RED on a planted lesson occurrence, in any case and inside a word', () => {
    expect(lessonHits('# Title\n\nThe digest prints 74.737770.')).toHaveLength(1);
    expect(lessonHits('In the Digest\'s words.')).toHaveLength(1);
    expect(lessonHits('Line one.\nthe teachingdigest line.')).toHaveLength(1);
    expect(lessonHits('# Title\n\nThe lab prints 74.737770.')).toHaveLength(0);
  });

  it('GOES RED on planted JSX text, a JSX attribute and a string literal', () => {
    expect(codeHits('const A = () => <Lead>The digest&apos;s tries</Lead>;')).toHaveLength(1);
    expect(codeHits('<SelectField label="As of (the digest\'s dates only)" />')).toHaveLength(1);
    expect(codeHits("const s = `printed to the precision the teaching digest prints`;")).toHaveLength(1);
  });

  it('is not trigger happy: comments and identifiers pass', () => {
    const src = [
      '// the digest prints this',
      '/* the digest,',
      ' * over two lines */',
      'export const teachingDigestText = () => digestLines().join(DIGEST_SEP); // as the digest prints it',
      "const url = 'https://example.com/a'; // digest",
      'const re = /\\/\\/[a-z]+/; const x = 1; // digest',
    ].join('\n');
    expect(codeHits(src)).toEqual([]);
  });

  it('GOES RED on a planted internal SECTION pointer, in capitals or in parentheses', () => {
    expect(lessonHits('SECTION 13 prints the heater at its current reading.')).toHaveLength(1);
    expect(lessonHits('Read the refusals of SECTIONS 12 and 14.')).toHaveLength(1);
    expect(lessonHits('The independence rule allows one (Section 14).')).toHaveLength(1);
    expect(lessonHits('| the Lees toxic coefficients | the OSD/30 columns (section 29) | yes |')).toHaveLength(1);
  });

  it('GOES RED on the authors\' generator, and passes an ordinary one', () => {
    expect(lessonHits('The generator asserts that ordering on every rebuild.')).toHaveLength(1);
    expect(lessonHits("The count is the generator's own.")).toHaveLength(1);
    expect(lessonHits('The capstone generator measures that invariance.')).toHaveLength(1);
    expect(lessonHits("a literal typed in the course's generator")).toHaveLength(1);
    expect(lessonHits('That proves the engine holds what the generator holds.')).toHaveLength(1);
    expect(lessonHits('Every random draw goes through an injectable generator, so a seeded run repeats.')).toHaveLength(0);
    expect(lessonHits('The old engine called an unseeded generator.')).toHaveLength(0);
    expect(lessonHits('A generator built from an integer seed you supply.')).toHaveLength(0);
    expect(lessonHits('The tree it counts over is the assertion list the generator built while it ran.')).toHaveLength(1);
    expect(lessonHits("The generator's next three draws are 0.732031, 0.064278 and 0.391443.")).toHaveLength(0);
    expect(lessonHits('On planar data the trend IS the generator, so the gap is small.')).toHaveLength(0);
  });

  it('passes a published section and a casing section', () => {
    expect(lessonHits('which is the NIOSH 2016-106 section 8.1 equation')).toHaveLength(0);
    expect(lessonHits('works a pool fire from start to finish in section 6.6.3')).toHaveLength(0);
    expect(lessonHits('Section 2 on this case gives 1.2882443095792595.')).toHaveLength(0);
  });

  it('an allowed line passes only in its own exact text', () => {
    const line = "w('END OF DIGEST');";
    expect(codeHits(line, [line])).toEqual([]);
    expect(codeHits(`${line}\nw('END OF THE DIGEST');`, [line])).toHaveLength(1);
  });

  it('a planted occurrence in a REAL lesson file is caught by the same reader the sweep uses', () => {
    const real = lessons.find((f) => f.includes(`${path.sep}metering${path.sep}`)) || lessons[0];
    const text = fs.readFileSync(real, 'utf8');
    expect(lessonHits(text)).toHaveLength(0);
    expect(lessonHits(`${text}\nThe digest prints the answer.\n`)).toHaveLength(1);
  });
});
