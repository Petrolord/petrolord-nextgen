// W2 (B5 follow-on): THE INPUTS A CAPSTONE NOW PUBLISHES MUST REPRODUCE ITS KEY.
//
// Wave 2 of docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md publishes, in the
// capstone prompt or in a lesson, the inputs that used to live only in a
// generator: the KESTREL A-7 rows and plugs, the MERLIN A-12 case, the NEMBE-14
// tubing constants, z per station on IMIRINGI-7, E x I, the two pressures at
// the stimulation job depth, the ADANGA yard, the 15.56 C crude reference, the
// three gas transmission forms and the shells-in-series conversion. Each
// course's spec, docs/graded-field-audit/w2/<course>.json, records the inputs
// (taken from the capstone's fixture or a vendored engine return, never typed),
// the prompt and lesson edits that print them, and the live key of every field
// they unlock.
//
// This gate proves, on the committed spec and the committed files:
//   1. the published inputs reproduce every key through the VENDORED ENGINES
//      (docs/graded-field-audit/w2/reproduce.mjs only shapes the inputs into
//      each engine call; no graded formula is restated there or here);
//   2. every published number is in the W2 prompt the migration writes, and
//      every lesson insertion is in its lesson file;
//   3. the fields a spec leaves for a later wave are exactly the documented
//      ones (wellcost's three seeded Monte Carlo fields are the Suite's, W3;
//      nodal's two lift gas fields need a panel mode, W4).
// Negative controls: a perturbed input must break the reproduction of some key
// on every tier, and a number dropped from the prompt must be caught.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPRODUCE } from '../../docs/graded-field-audit/w2/reproduce.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SPECS = path.join(ROOT, 'docs/graded-field-audit/w2');
const specs = fs.readdirSync(SPECS).filter((f) => /^[a-z]+\.json$/.test(f))
  .map((f) => JSON.parse(fs.readFileSync(path.join(SPECS, f), 'utf8')));

const LEFT_FOR_LATER = {
  'wellcost/advanced': ['mc_cost_p10_usd', 'mc_cost_p90_usd', 'mc_days_p50'],
  'nodal/intermediate': ['liftgas_valve_pwf_psia', 'liftgas_mid_pmf_psia'],
};

// The W2 prompt a migration writes, read back out of its SQL literal.
const w2Prompt = (course, tier) => {
  const sql = fs.readFileSync(path.join(ROOT, 'migrations', `20261025a_w2_${course}.sql`), 'utf8');
  const m = [...sql.matchAll(/set prompt = '((?:[^']|'')*)'\n\s+where app_slug = '([a-z]+)' and tier = '([a-z]+)'/g)]
    .find((x) => x[2] === course && x[3] === tier);
  expect(m, `no W2 prompt for ${course}/${tier} in 20261025a_w2_${course}.sql`).toBeTruthy();
  return m[1].replace(/''/g, "'");
};

// Every number a tier publishes, as the prompt prints it.
const numbers = (v, out = []) => {
  if (typeof v === 'number') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => numbers(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => numbers(x, out));
  return out;
};
// A thousands comma in the existing copy and trailing zeros (2.750) print the
// same number.
const flatten = (text) => text.replace(/(\d),(\d{3})/g, '$1$2');
const printed = (text, x) => {
  const s = String(x);
  const tail = s.includes('.') || s.includes('e') ? '0*' : '(\\.0+)?';
  const re = new RegExp(`(^|[^0-9.])${s.replace(/[.+-]/g, (c) => `\\${c}`)}${tail}($|[^0-9])`);
  return re.test(flatten(text));
};
const missingNumbers = (text, inputs) => [...new Set(numbers(inputs))].filter((x) => !printed(text, x));

const reproducesAll = (course, tier, t, inputs) => {
  const got = REPRODUCE[course][tier](inputs, t.method || {});
  const left = LEFT_FOR_LATER[`${course}/${tier}`] || [];
  return Object.entries(t.expected).filter(([k]) => !left.includes(k))
    .every(([k, e]) => Number.isFinite(got[k]) && Math.abs(got[k] - e.expected) <= e.tol);
};

describe('W2: the specs are all there', () => {
  it('ten courses, 74 graded fields, none of them an empty spec', () => {
    expect(specs.map((s) => s.course).sort()).toEqual(['cementing', 'gaswell', 'heattransfer', 'integrity', 'linesizing',
      'nodal', 'producedwater', 'separation', 'stimulation', 'wellcost']);
    const n = specs.reduce((a, s) => a + Object.values(s.tiers).reduce((b, t) => b + Object.keys(t.expected).length, 0), 0);
    expect(n).toBe(74);
  });
});

for (const spec of specs) {
  describe(`W2 ${spec.course}`, () => {
    for (const [tier, t] of Object.entries(spec.tiers)) {
      const left = LEFT_FOR_LATER[`${spec.course}/${tier}`] || [];

      it(`${tier}: the published inputs reproduce every key through the vendored engines`, () => {
        const got = REPRODUCE[spec.course][tier](t.inputs, t.method || {});
        for (const [k, e] of Object.entries(t.expected)) {
          if (left.includes(k)) continue;
          expect(Number.isFinite(got[k]), `${k} not reproduced`).toBe(true);
          expect(Math.abs(got[k] - e.expected), `${k}: ${got[k]} against the key ${e.expected}`).toBeLessThanOrEqual(e.tol);
        }
      });

      it(`${tier}: only the documented fields are left for a later wave`, () => {
        const unreproduced = Object.entries(t.expected).filter(([, e]) => e.reproduced == null).map(([k]) => k);
        expect(unreproduced.sort()).toEqual([...left].sort());
      });

      it(`${tier}: a perturbed input breaks the reproduction (negative control)`, () => {
        const leaves = [];
        const walk = (v, p) => {
          if (typeof v === 'number') leaves.push(p);
          else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, [...p, k]));
        };
        walk(t.inputs, []);
        let caught = 0;
        for (const p of leaves) {
          const bad = JSON.parse(JSON.stringify(t.inputs));
          let o = bad;
          for (const k of p.slice(0, -1)) o = o[k];
          const k = p[p.length - 1];
          o[k] = o[k] === 0 ? 1e-3 : o[k] * 1.001;
          try { if (!reproducesAll(spec.course, tier, t, bad)) caught += 1; } catch { caught += 1; }
        }
        expect(leaves.length).toBeGreaterThan(0);
        expect(caught, `no single published input moves a key on ${spec.course}/${tier}`).toBeGreaterThan(0);
      });

      if ((t.prompt_edits || []).length) {
        it(`${tier}: every published number is in the W2 prompt the migration writes`, () => {
          const text = w2Prompt(spec.course, tier);
          for (const [, b] of t.prompt_edits) expect(text.includes(b)).toBe(true);
          expect(missingNumbers(text, t.inputs)).toEqual([]);
          // control: the same check catches a number dropped from the prompt
          const one = t.prompt_edits.map(([, b]) => b).join(' ');
          const x = numbers(t.inputs).find((v) => printed(one, v) && String(v).length > 2);
          expect(x, 'no distinctive published number to drop').toBeDefined();
          const cut = flatten(text).split(String(x)).join('#');
          expect(missingNumbers(cut, t.inputs)).toContain(x);
        });
      }

      for (const [file, anchor, insertion] of t.lesson_edits || []) {
        it(`${tier}: ${path.basename(file)} carries its W2 insertion`, () => {
          const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
          expect(text.includes(anchor + insertion)).toBe(true);
          expect(/[–—]/.test(insertion)).toBe(false);
        });
      }
    }
  });
}
