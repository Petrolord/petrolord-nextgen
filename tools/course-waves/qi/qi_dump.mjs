// THE QI TEACHING DIGEST GENERATOR. Writes digest.txt to stdout, and nothing
// at all if any section throws (so a failed build leaves the previous digest
// in place: build through a temp file, see build_digest.sh).
//
// Sections 1 to 21 are the Associate tier (qi_dump_a.mjs), 22 to 41 the
// Professional tier (qi_dump_p.mjs), 42 to 59 the Expert tier
// (qi_dump_e.mjs), and section 60 the vocabulary (qi_dump_v.mjs). Every part
// prints from the teaching lab's return values (qiLab.js, through
// qi_engine.mjs).
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { register } from 'node:module';

register('./qi_loader.mjs', import.meta.url);
const { REPO } = await import('./qi_engine.mjs');
const { sectionsA } = await import('./qi_dump_a.mjs');

const parts = [];
const ctx = {
  suiteCommit: process.env.QI_SUITE_COMMIT || execFileSync('git', ['-C', process.env.QI_SUITE_CHECKOUT || '/root/wt-qi-suitekit', 'rev-parse', 'HEAD']).toString().trim(),
};
const optional = async (file, fn) => (fs.existsSync(new URL(file, import.meta.url)) ? (await import(file))[fn](ctx) : []);

const header = `# QI TEACHING DIGEST: Quantitative Interpretation

# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The kit's 10-qi truth file, the engines' oracles and goldens, the engine source comments, the videos and their storyboards are PROVENANCE; none of them is teaching truth.

# PRECISION. Every depth (ft), velocity (m/s), density (kg/m3), impedance, modulus, frequency (Hz), time (ms), amplitude, reflection coefficient, intercept, gradient, slope, ratio, fraction, saturation, porosity, probability, percentage and distance prints to SIX decimals; whole counts (samples, traces, wells, pairs, blocks, interfaces, levels, lines) and whole inputs print as whole numbers; a stated input prints as it was stated; an engine message is printed verbatim between double quotation marks.

# THE ENGINES. engines/qi/*, engines/rockphysics/*, lib/waveform.js and lib/gridding/closure.js, vendored sha-identical from petrolord-engines at their canonical paths in the NextGen repository, and called through the course's teaching lab, src/components/course/panels/qi/qiLab.js, which this digest is printed from.

# AN APP COURSE. The Suite app for this course is QI Studio, in the Suite's Geoscience module, which runs these same engines. Every practical also runs in the course's own four explorer panels, so a learner without a Suite seat can work every exercise.

# THE DATA. The Ekene field is SYNTHETIC, generated for this platform by a stated script (section 3). No real well, company or survey appears.

# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone case and no graded answer. The capstones run their own held-out synthetic cases and the digest never names them.

# NO SOURCE PROSE. The course cites its references by author, year and equation and writes every explanation in its own words (section 2).

# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engines do today.
`;
parts.push(header);
parts.push(...sectionsA(ctx));
parts.push(...(await optional('./qi_dump_p.mjs', 'sectionsP')));
parts.push(...(await optional('./qi_dump_e.mjs', 'sectionsE')));
parts.push(...(await optional('./qi_dump_v.mjs', 'sectionsV')));
const text = parts.join('\n');
if (/[–—]/.test(text)) throw new Error('the digest carries a dash character');
process.stdout.write(text.endsWith('\n') ? text : `${text}\n`);
void REPO;
