#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads while being graded. For each of the
three draft prompts in capstone.json this refuses:

  1. ANY GRADED VALUE OF ANY TIER, as any number token in the prompt that IS a
     rounding of it (a token with d decimals within half a unit in its d-th
     place of the value, signed or absolute). "33.81" hands over an API of
     33.8061 as surely as "33.8061" does.
  2. ANY INTERMEDIATE THE ENGINE DERIVES on the way to a graded field, read from
     the engine rather than typed: the blend's specific gravity and its volume
     and mass fractions, every point of the blend's own curve, the blend's other
     cut yields, the recipe's other volumes and achieved properties, the unit
     cost, the marginal barrel and every row price. A prompt that prints one has
     done a step of the calculation for the learner.

It prints how many prompts, tokens and derived figures it swept, and refuses an
empty sweep. Negative control: --plant appends one graded value rounded to two
decimals and one derived figure to a prompt, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')

DERIVED = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{W}/crude_fields_capstone.mjs');
const {{ withIndex }} = await import('{W}/crude_capstone.mjs');
const E = process.env.MD_ENGINES || '/root/wt-md-crude-nextgen/packages/engines';
const C = await import(E + '/engines/downstream/crudeAssay.js');
const P = await import(E + '/engines/downstream/productBlending.js');
const out = [];
const id = C.blendCrudes(K.IDAMA_CRUDES.map((c) => ({{ ...c, volumeFraction: K.IDAMA_BARRELS[c.id] }})));
out.push(['IDAMA blend SG', id.properties.sg]);
id.fractions.forEach((f) => {{ out.push(['IDAMA volume fraction ' + f.name, f.volumeFraction]); out.push(['IDAMA mass fraction ' + f.name, f.massFraction]); out.push(['IDAMA volume percent ' + f.name, 100 * f.volumeFraction]); }});
for (const k of ['sulfurWtPct', 'tanMgKohG', 'nitrogenWtPct', 'nickelPpm', 'vanadiumPpm', 'viscosityCSt']) out.push(['IDAMA blend ' + k, id.properties[k]]);
for (const [k, v] of Object.entries(id.stability.blendedSara)) out.push(['IDAMA blended ' + k, v]);
const og = C.blendCrudes(K.OGBELE_CRUDES.map((c) => ({{ ...c, volumeFraction: K.OGBELE_SHARES[c.id] }})));
out.push(['OGBELE blend SG', og.properties.sg]); out.push(['OGBELE blend API', og.properties.api]);
const crv = C.blendDistillationCurves(K.OGBELE_CRUDES, og.fractions.map((f) => f.volumeFraction));
crv.forEach((p) => out.push(['OGBELE blend curve at ' + p.temperatureF, p.volumePercent]));
const y = C.cutYields({{ curve: crv, cuts: K.OGBELE_CUTS }});
y.cuts.forEach((r) => out.push(['OGBELE blend yield ' + r.name, r.yieldVolPercent]));
const n = C.netbackValue({{ cuts: y.cuts, ...K.OGBELE_VALUATION }});
n.rows.forEach((r) => out.push(['OGBELE value per bbl ' + r.name, r.valuePerBblCrude]));
const r = P.optimiseBlend({{ components: K.ONNE_POOL, specs: withIndex(K.ONNE_SPECS), targetVolume: K.ONNE_TARGET }});
r.recipe.forEach((x) => {{ if (x.volume > 0) out.push(['ONNE volume ' + x.name, x.volume]); if (x.cost > 0) out.push(['ONNE cost ' + x.name, x.cost]); }});
r.achieved.forEach((a) => out.push(['ONNE achieved ' + a.name, a.value]));
r.shadowPrices.forEach((s) => {{ out.push(['ONNE rowPrice ' + s.name, s.rowPrice]); }});
out.push(['ONNE unit cost', r.unitCost]); out.push(['ONNE marginal barrel', r.shadowPrices[0].price]);
console.log(JSON.stringify(out.filter(([, v]) => Number.isFinite(v) && Math.abs(v) > 1e-9)));
"""], capture_output=True, text=True, check=True).stdout)


def decimals(tok):
    return len(tok.split('.')[1]) if '.' in tok else 0


def rounds_to(tok, v):
    t = float(tok)
    half = 0.5 * 10 ** -decimals(tok)
    return abs(abs(t) - abs(v)) <= half


def main():
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    fields = json.load(open(os.path.join(W, 'fields.json')))
    prompts = {t: cap['tiers'][t]['prompt'] for t in ('beginner', 'intermediate', 'advanced')}
    if '--plant' in sys.argv:
        prompts['beginner'] += f' For reference, the answer is {fields[7][2]:.2f} and the blend SG is {DERIVED[0][1]:.4f}.'
    bad, tokens = [], 0
    for tier, text in prompts.items():
        for tok in NUM.findall(text):
            tokens += 1
            # A token with no decimals is a stated condition (barrels, a share,
            # a temperature) and at most the integer part of a four-decimal
            # answer graded at 5e-5, which hands over nothing a grader accepts.
            # Every token with one decimal or more is checked, which is 2,000
            # tolerances wide at its coarsest: a condition that happens to
            # round a graded or derived figure is moved, never excused.
            if decimals(tok) == 0:
                continue
            for t, k, v, _ in fields:
                if rounds_to(tok, v):
                    bad.append(f'{tier} prompt prints {tok}, a rounding of the graded value of {t}.{k} ({v})')
            if True:
                for name, v in DERIVED:
                    if rounds_to(tok, v):
                        bad.append(f'{tier} prompt prints {tok}, a rounding of {name} ({v}), which the engine derives')
    print(f'  prompts swept: {len(prompts)}; number tokens read: {tokens}; graded values: {len(fields)}; engine-derived intermediates: {len(DERIVED)}')
    for b in bad:
        print(f'  LEAK {b}')
    if len(prompts) != 3 or tokens < 60 or len(DERIVED) < 40:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


# Importable: gen_course.py and gen_golive.py read DERIVED from here, so the
# go-live's SQL sweep checks exactly the intermediates this gate checks.
if __name__ == '__main__':
    sys.exit(main())
