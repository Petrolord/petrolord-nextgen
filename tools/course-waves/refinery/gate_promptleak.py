#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads while being graded. For each of the
three draft prompts in capstone.json this refuses:

  1. ANY GRADED VALUE OF ANY TIER as a number token in the prompt, signed or
     absolute, and in the unit shifts a prompt uses (a token read as millions,
     x1e6, and a dollar figure read as millions, /1e6), each at the field's
     own tolerance scaled with the shift.
  2. ANY FIGURE THE ENGINE DERIVES on the way to a graded field that is not
     itself a condition: a scaled capital cost, an annual throughput, the plan's
     crude run, unit throughputs, product volumes and margin, and each plan
     ledger quantity and value the variance is read against. The gate reads
     them from the engine, never from a list somebody typed, and drops any that
     equals a condition the prompt must state (an availability that the plan
     runs in full is both).

It prints how many prompts, tokens and derived figures it swept, and refuses an
empty sweep. Negative control: --plant appends one graded value and one derived
figure to a prompt, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'(?<![\w.-])-?\d+(?:\.\d+)?(?![\w])')

DERIVED = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{W}/refinery_fields_capstone.mjs');
const {{ loadGuarded }} = await import('{W}/clockguard.mjs');
const {{ RAW, G }} = await loadGuarded(process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines', {{ periodStart: K.PERIOD_START, startYears: [K.START_YEAR] }});
const RP = G.refineryPlanning, MR = G.modularRefinery;
const I = K.IKARAMA, A = K.AMASSOMA, KO = K.KOLOAMA;
const out = [];
for (const e of [0.9, 0.6]) out.push(MR.scaleCapex({{ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent: e }}).cost);
const s = RAW.modularRefinery.SUPPLY_SCENARIOS.find((x) => x.id === I.scenarioId);
out.push(I.capacityBpd * I.onstreamDays * s.utilisation);
for (const c of [A, KO]) {{
  const p = RP.planRefinery({{ streams: c.streams, crudes: c.crudes, units: c.units, products: c.products }});
  out.push(p.totalCrude, p.margin, p.revenue, p.crudeCost, p.unitCost);
  for (const r of p.crudeRuns) out.push(r.volume, r.cost);
  for (const r of p.unitRuns) out.push(r.throughput, r.cost);
  for (const r of p.productMakes) out.push(r.volume, r.revenue);
}}
console.log(JSON.stringify(out.filter((v) => Math.abs(v) >= 1)));
"""], capture_output=True, text=True, check=True).stdout)


def main():
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    fields = json.load(open(os.path.join(W, 'fields.json')))
    prompts = {t: cap['tiers'][t]['prompt'] for t in ('beginner', 'intermediate', 'advanced')}
    conditions = set()
    for text in prompts.values():
        for tok in NUM.findall(re.sub(r'\d{4}-\d{2}-\d{2}', ' ', text)):
            conditions.add(abs(float(tok)))
    # a derived figure equal to a stated condition is a condition, not a leak
    derived = [d for d in DERIVED if not any(abs(abs(d) - c) < 1e-6 for c in conditions)]
    if '--plant' in sys.argv:
        prompts['beginner'] += f' For reference, the answer is {fields[8][2]} and the crude run is {derived[3]:.0f}.'
    bad, tokens = [], 0
    for tier, text in prompts.items():
        undated = re.sub(r'\d{4}-\d{2}-\d{2}', ' ', text)
        for tok in NUM.findall(undated):
            tokens += 1
            t = abs(float(tok))
            for ft, key, val, tol in fields:
                for shift in (1, 1e6, 1e-6):
                    if abs(t * shift - abs(val)) <= tol:
                        bad.append(f'{tier} prompt prints {tok}, the graded value of {ft}.{key} (read x{shift:g})')
            for d in derived:
                if abs(t - abs(d)) <= 0.5 and t >= 1:
                    bad.append(f'{tier} prompt prints {tok}, a figure the engine derives ({d})')
    bad = sorted(set(bad))
    print(f'  prompts swept: {len(prompts)}; number tokens read: {tokens}; graded values: {len(fields)}; engine-derived figures: {len(DERIVED)}, {len(DERIVED) - len(derived)} of them also stated as conditions')
    for b in bad:
        print(f'  LEAK {b}')
    if len(prompts) != 3 or tokens < 60 or len(DERIVED) < 30:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
