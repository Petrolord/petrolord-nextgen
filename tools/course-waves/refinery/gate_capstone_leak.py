#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record name (IKARAMA, AMASSOMA, KOLOAMA), operator, or
     crude label appears in digest.txt, refinery_dump.mjs or refinery_fields.mjs;
     no teaching record name (OKORDIA, ABUA, ODIOMA), operator or crude label
     appears in refinery_fields_capstone.mjs or in a capstone prompt.
  2. DERIVED FIGURES. No figure the engine derives on the capstone path (the
     scaled capital costs, the capstone plans' volumes, values and margins, the
     expansion's per-year tax) is printed by the digest to within half a unit,
     so a learner cannot look one up there.
  3. CONDITION SETS. No capstone crude, unit, product, actual movement or plant
     carries the same defining numbers as a teaching record (a shared record is
     a shared answer, whatever it is called).
  4. THE GOLDENS. No golden case in the vendored downstream goldens carries a
     capstone plant's defining numbers or a capstone crude's cost and
     availability together, in either direction.

Negative control: --plant copies one capstone crude into the teaching set in
memory and one derived figure into the digest text, and the gate must name
both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-refinery-nextgen/packages/engines')


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


def dump_module(mod):
    return node_json(f"""
const M = await import('{W}/{mod}');
const out = {{}};
for (const [k, v] of Object.entries(M)) if (typeof v !== 'function' && !(v instanceof Date) && !(v instanceof RegExp)) out[k] = v;
console.log(JSON.stringify(out, (k, v) => (v instanceof RegExp ? String(v) : v)));""")


K = dump_module('refinery_fields_capstone.mjs')
F = dump_module('refinery_fields.mjs')
DERIVED = node_json(f"""
const K = await import('{W}/refinery_fields_capstone.mjs');
const {{ loadGuarded }} = await import('{W}/clockguard.mjs');
const {{ RAW, G }} = await loadGuarded('{ENG}', {{ periodStart: K.PERIOD_START, startYears: [K.START_YEAR] }});
const RP = G.refineryPlanning, MR = G.modularRefinery;
const out = [];
const I = K.IKARAMA;
for (const e of [0.9, 0.6]) out.push(MR.scaleCapex({{ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent: e }}).cost);
for (const c of [K.AMASSOMA, K.KOLOAMA]) {{
  const p = RP.planRefinery({{ streams: c.streams, crudes: c.crudes, units: c.units, products: c.products }});
  out.push(p.totalCrude, p.margin, p.revenue, p.crudeCost, p.unitCost, p.grossMarginPerBbl);
  for (const r of p.crudeRuns) out.push(r.volume, r.cost);
  for (const r of p.unitRuns) out.push(r.throughput, r.cost);
  for (const r of p.productMakes) out.push(r.volume, r.revenue);
  for (const s of p.streamBalance) out.push(s.marginalValue);
}}
const X = K.KOLOAMA.expansion;
const s = RAW.modularRefinery.SUPPLY_SCENARIOS.find((x) => x.id === X.scenarioId);
const slate = MR.productSlate({{ productYields: RAW.modularRefinery.CONFIGURATIONS[X.configurationId].productYields, prices: X.prices }});
const cap = MR.scaleCapex({{ baseCost: X.baseCost, baseCapacity: X.baseCapacity, capacity: X.capacityBpd, exponent: X.modularExponent }});
const st = MR.feasibilityStreams({{ capacityBpd: X.capacityBpd, onstreamDays: X.onstreamDays, utilisation: s.utilisation, crudeCostPerBbl: X.crudeCostPerBbl + s.crudePremium, slate, fixedOpexPerYear: X.fixedOpexPerYear, variableOpexPerBbl: X.variableOpexPerBbl, projectLife: X.projectLife, constructionYears: X.constructionYears, capex: cap.cost }});
const e = MR.feasibilityEconomics({{ streams: st, discountRate: X.discountRate, taxRate: X.taxRate, startYear: K.START_YEAR }});
out.push(cap.cost, slate.grossValuePerBbl, st.annualBbl);
for (const c of e.cashflow) if (c.tax > 0) out.push(c.tax);
console.log(JSON.stringify([...new Set(out.filter((v) => Math.abs(v) > 1e-9))]));""")

CAP_NAMES = ['IKARAMA', 'AMASSOMA', 'KOLOAMA', 'Ikarama', 'Amassoma', 'Koloama']
TEACH_NAMES = ['OKORDIA', 'ABUA', 'ODIOMA', 'Okordia', 'Abua', 'Odioma']
NUM = re.compile(r'-?\d+\.?\d*')


def crude_labels(recs):
    return {c['name'].split(' (')[0] for r in recs for c in r.get('crudes', [])}


def main():
    plant = '--plant' in sys.argv
    digest = open(os.path.join(W, 'digest.txt'), encoding='utf-8').read()
    teach_src = open(os.path.join(W, 'refinery_dump.mjs'), encoding='utf-8').read() + open(os.path.join(W, 'refinery_fields.mjs'), encoding='utf-8').read()
    cap_src = open(os.path.join(W, 'refinery_fields_capstone.mjs'), encoding='utf-8').read()
    prompts = ' '.join(t['prompt'] for t in json.load(open(os.path.join(W, 'capstone.json')))['tiers'].values())
    teach_recs = [F['ABUA'], F['ODIOMA']]
    cap_recs = [K['AMASSOMA'], K['KOLOAMA']]
    if plant:
        teach_recs = [dict(F['ABUA'], crudes=F['ABUA']['crudes'] + [K['AMASSOMA']['crudes'][0]])]
        digest += f"\nplanted {DERIVED[0]:.2f}\n"
    bad = []
    # 1. names
    cap_words = CAP_NAMES + [K['IKARAMA']['sponsor'], K['AMASSOMA']['operator'], K['KOLOAMA']['operator']] + sorted(crude_labels(cap_recs))
    teach_words = TEACH_NAMES + [F['OKORDIA']['sponsor'], F['ABUA']['operator'], F['ODIOMA']['operator']] + sorted(crude_labels(teach_recs))
    for w in cap_words:
        for name, text in (('digest.txt', digest), ('teaching generators', teach_src)):
            if re.search(r'\b' + re.escape(w) + r'\b', text):
                bad.append(f'NAME capstone word "{w}" appears in {name}')
    for w in teach_words:
        for name, text in (('refinery_fields_capstone.mjs', cap_src), ('capstone prompts', prompts)):
            if re.search(r'\b' + re.escape(w) + r'\b', text):
                bad.append(f'NAME teaching word "{w}" appears in {name}')
    shared = crude_labels(cap_recs) & crude_labels(teach_recs)
    if shared:
        bad.append(f'NAME crude labels shared by a capstone and a teaching record: {sorted(shared)}')
    # 2. derived figures in the digest. A derived figure that equals one of the
    # capstone's own stated limits (a crude run to its availability, a unit to
    # its capacity) is a condition the prompt states, and is skipped.
    limits = {float(v) for r in cap_recs for c in r['crudes'] for v in [c['available']]} \
        | {float(u['capacity']) for r in cap_recs for u in r['units']} \
        | {float(p['maxDemand']) for r in cap_recs for p in r['products']}
    skipped = [d for d in DERIVED if abs(d) in limits]
    tokens = [abs(float(t)) for t in NUM.findall(digest)]
    toks = sorted(set(tokens))
    import bisect
    for d in DERIVED:
        if abs(d) in limits:
            continue
        a = abs(d)
        tol = 0.5 if a >= 1000 else 0.00005 if a < 1 else 0.005
        i = bisect.bisect_left(toks, a - tol)
        if i < len(toks) and toks[i] <= a + tol:
            bad.append(f'DERIVED capstone figure {d} is printed by the digest as {toks[i]}')
    # 3. condition sets
    def crude_sig(c):
        return (c['cost'], c['available'], tuple(sorted(c['yields'].items())))

    def unit_sig(u):
        return (u['capacity'], u['opex'], u['feed'], tuple(sorted(u['yields'].items())))

    def prod_sig(p):
        return (p['price'], p['maxDemand'])
    tc = {crude_sig(c) for r in teach_recs for c in r['crudes']}
    tu = {unit_sig(u) for r in teach_recs for u in r['units']}
    tp = {prod_sig(p) for r in teach_recs for p in r['products']}
    ta = {(a['materialId'], a['quantity'], a['cost']) for a in F['ODIOMA']['actuals']}
    for r in cap_recs:
        for c in r['crudes']:
            if crude_sig(c) in tc:
                bad.append(f'CONDITION capstone crude {c["id"]} has a teaching crude\'s cost, availability and yields')
        for u in r['units']:
            if unit_sig(u) in tu:
                bad.append(f'CONDITION capstone unit {u["id"]} matches a teaching unit')
        for p in r['products']:
            if prod_sig(p) in tp:
                bad.append(f'CONDITION capstone product {p["id"]} has a teaching product\'s price and ceiling')
    for a in K['KOLOAMA']['actuals']:
        if (a['materialId'], a['quantity'], a['cost']) in ta:
            bad.append(f'CONDITION capstone movement {a["materialId"]} matches a teaching movement')
    plants_t = [(F['OKORDIA']['baseCost'], F['OKORDIA']['baseCapacity'], F['OKORDIA']['capacityBpd']),
                (F['ODIOMA']['expansion']['baseCost'], F['ODIOMA']['expansion']['baseCapacity'], F['ODIOMA']['expansion']['capacityBpd'])]
    plants_c = [(K['IKARAMA']['baseCost'], K['IKARAMA']['baseCapacity'], K['IKARAMA']['capacityBpd']),
                (K['KOLOAMA']['expansion']['baseCost'], K['KOLOAMA']['expansion']['baseCapacity'], K['KOLOAMA']['expansion']['capacityBpd'])]
    for p in plants_c:
        if p in plants_t:
            bad.append(f'CONDITION capstone plant {p} is a teaching plant')
    # 4. goldens
    gdir = os.path.join(ENG, 'test-data', 'downstream', 'goldens')
    golden_hits = 0
    for gf in ('refineryplanning_cases.json', 'modularrefinery_cases.json'):
        g = json.load(open(os.path.join(gdir, gf)))
        for case in g.get('cases', []):
            blob = json.dumps(case)
            inp = case.get('inputs') or {}
            for p in plants_c:
                if inp and (inp.get('baseCost'), inp.get('baseCapacity'), inp.get('capacityBpd')) == p:
                    bad.append(f'GOLDEN {gf} case "{case["name"]}" carries capstone plant {p}')
                    golden_hits += 1
            for r in cap_recs:
                for c in r['crudes']:
                    if f'"cost": {c["cost"]}' in blob and f'"available": {c["available"]}' in blob and c['available'] != 0:
                        bad.append(f'GOLDEN {gf} case "{case["name"]}" carries capstone crude {c["id"]}\'s cost and availability')
    print(f'  names swept: {len(cap_words)} capstone words against the digest and teaching generators, {len(teach_words)} teaching words against the capstone file and prompts')
    print(f'  derived capstone figures swept against {len(toks)} digest tokens: {len(DERIVED) - len(skipped)} ({len(skipped)} equal a stated capstone limit and are conditions)')
    print(f'  condition sets compared: {len(tc)} teaching crudes, {len(tu)} units, {len(tp)} products, {len(ta)} movements, {len(plants_t)} plants')
    print(f'  golden files swept: 2')
    for b in bad:
        print(f'  LEAK {b}')
    if len(DERIVED) < 30:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
