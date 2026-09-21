#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record name, operator or tank id appears in digest.txt,
     supply_dump.mjs or supply_fields.mjs; no teaching record name, operator or
     tank id appears in supply_fields_capstone.mjs or in a capstone prompt.
  2. DERIVED FIGURES. No graded value and no engine-derived intermediate on the
     way to one (read from the engine through supply_capstone.mjs --json, never
     typed) is printed by the digest, in any rounding of three or more
     significant figures, so a learner cannot look one up there.
  3. CONDITION SETS. No capstone tank, rack, farm tank, lane or cargo carries
     the same defining inputs as a teaching record (a shared record is a shared
     answer, whatever it is called).
  4. THE GOLDENS. No golden case in the vendored downstream goldens carries a
     capstone record's defining inputs together in one case: FC4's repair took
     a capstone's exact conditions for a golden row, and the published file
     handed back a graded answer.

Negative control: --plant copies the capstone rack into the teaching cases in
memory and one derived figure into the digest text, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-supply-nextgen/packages/engines')


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src], capture_output=True, text=True, check=True).stdout)


def exports(mod):
    return node_json(f"""
const K = await import('{W}/{mod}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));""")


K = exports('supply_fields_capstone.mjs')
F = exports('supply_fields.mjs')
OUT = json.loads(subprocess.run(['node', f'{W}/supply_capstone.mjs', '--json'], capture_output=True, text=True, check=True).stdout)
CAP_NAMES = [r'\bOKOMU\b', r'\bOkomu\b', r'\bOGWASHI\b', r'\bOgwashi\b', r'\bORON\b', r'\bOron\b', r'Ologbo', r'Anioma',
             r'Cross River Estuary', r'\bOK-[12]\b', r'\bOG-[123]\b']
TEACH_NAMES = [r'\bAKODO\b', r'\bAkodo\b', r'\bIBAFO\b', r'\bIbafo\b', r'\bBADAGRY\b', r'\bBadagry\b', r'Gberefu',
               r'\bAK-0[123]\b', r'\bIB-T[1-4]\b']


def sig(tok):
    return len(tok.lstrip('-').replace('.', '').lstrip('0'))


def main():
    plant = '--plant' in sys.argv
    bad = []
    digest = open(os.path.join(W, 'digest.txt'), encoding='utf-8').read()
    if plant:
        digest += f"\nplanted {OUT['derived']['oron_cf_usd']:.2f}\n"
        F['IBAFO_RACK'] = dict(K['OGWASHI_RACK'])
    # 1. names
    teaching_side = {'digest.txt': digest,
                     'supply_dump.mjs': open(os.path.join(W, 'supply_dump.mjs')).read(),
                     'supply_fields.mjs': open(os.path.join(W, 'supply_fields.mjs')).read()}
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    capstone_side = {'supply_fields_capstone.mjs': open(os.path.join(W, 'supply_fields_capstone.mjs')).read(),
                     **{f'capstone.json {t}': v['prompt'] for t, v in cap['tiers'].items()}}
    n1 = 0
    for name, text in teaching_side.items():
        for pat in CAP_NAMES:
            n1 += 1
            if re.search(pat, text):
                bad.append(f'names: {name} carries the capstone name {pat}')
    for name, text in capstone_side.items():
        for pat in TEACH_NAMES:
            n1 += 1
            if re.search(pat, text):
                bad.append(f'names: {name} carries the teaching name {pat}')
    print(f'  1. names: {n1} name-by-file checks over {len(teaching_side)} teaching and {len(capstone_side)} capstone texts')
    # 2. derived figures in the digest
    toks = [t for t in re.findall(r'-?\d+\.\d+|-?\d+', digest) if sig(t) >= 3]
    figures = {f['key']: f['value'] for f in OUT['fields']}
    figures.update(OUT['derived'])
    n2 = 0
    for k, v in figures.items():
        for t in toks:
            n2 += 1
            dec = len(t.split('.')[1]) if '.' in t else 0
            if dec >= 1 and abs(abs(float(t)) - abs(v)) <= 0.5 * 10 ** -dec + 1e-12:
                bad.append(f'derived: the digest prints {t}, a rounding of the capstone figure {k} ({v})')
    print(f'  2. derived figures: {len(figures)} capstone figures against {len(toks)} digest tokens of three or more significant figures ({n2} comparisons)')
    # 3. condition sets
    def tank_key(t):
        return (t['diameterM'], t['dipMm'], t['waterMm'])
    sets = [
        ('tank', [tank_key(t) for t in F['AKODO_TANKS']], [tank_key(K['OKOMU_T1']), tank_key(K['OKOMU_T2'])]),
        ('rack', [tuple(F['IBAFO_RACK'].values())], [tuple(K['OGWASHI_RACK'].values())]),
        ('farm tank', [(t['capacityM3'], t['heelM3'], t['stockM3']) for t in F['IBAFO_TANKS']],
         [(t['capacityM3'], t['heelM3'], t['stockM3']) for t in K['OGWASHI_TANKS']]),
        ('lane', [(F['IBAFO_LANE']['distanceKm'], F['IBAFO_LANE']['payloadLitres'], F['IBAFO_LANE']['averageSpeedKmh'])],
         [(K['OGWASHI_LANE']['distanceKm'], K['OGWASHI_LANE']['payloadLitres'], K['OGWASHI_LANE']['averageSpeedKmh'])]),
        ('cargo', [(F['BADAGRY_CARGO']['quantity'], F['BADAGRY_CARGO']['densityKgM3'], F['BADAGRY_CARGO']['fobPrice'])],
         [(K['ORON_CARGO']['quantity'], K['ORON_CARGO']['densityKgM3'], K['ORON_CARGO']['fobPrice'])]),
        ('day', [(F['AKODO_DAY']['openingM3'], F['AKODO_DAY']['receiptsM3'], F['AKODO_DAY']['deliveriesM3'])],
         [(K['OKOMU_DAY']['openingM3'], K['OKOMU_DAY']['receiptsM3'], K['OKOMU_DAY']['deliveriesM3'])]),
    ]
    n3 = 0
    for kind, teach, capst in sets:
        for c in capst:
            for t in teach:
                n3 += 1
                if tuple(c) == tuple(t):
                    bad.append(f'condition set: a capstone {kind} {c} is also a teaching {kind}')
    print(f'  3. condition sets: {n3} capstone-against-teaching record comparisons over {len(sets)} kinds')
    # 4. goldens
    G = os.path.join(ENG, 'test-data', 'downstream', 'goldens')
    td = json.load(open(os.path.join(G, 'terminaldepot_cases.json')))
    fp = json.load(open(os.path.join(G, 'fuelpricing_cases.json')))
    n4 = 0
    for q in td['queues']:
        n4 += 1
        if (q['arrivalsPerHour'], q['loadMinutes'], q['bays']) == (K['OGWASHI_RACK']['arrivalsPerHour'], K['OGWASHI_RACK']['loadMinutes'], K['OGWASHI_RACK']['bays']):
            bad.append(f'golden: queue "{q["name"]}" is the capstone rack')
    for d in td['dips']:
        for t in (K['OKOMU_T1'], K['OKOMU_T2']):
            n4 += 1
            if (d['dip'], d['water']) == (t['dipMm'], t['waterMm']):
                bad.append(f'golden: dip "{d["name"]}" carries {t["id"]}\'s dip and water')
    for d in td['days']:
        n4 += 1
        if (d['openingM3'], d['receiptsM3'], d['deliveriesM3']) == (K['OKOMU_DAY']['openingM3'], K['OKOMU_DAY']['receiptsM3'], K['OKOMU_DAY']['deliveriesM3']):
            bad.append(f'golden: day "{d["name"]}" is the capstone day')
    for t in td['farm']['tanks']:
        for c in K['OGWASHI_TANKS']:
            n4 += 1
            if (t['capacityM3'], t['heelM3'], t['stockM3']) == (c['capacityM3'], c['heelM3'], c['stockM3']):
                bad.append(f'golden: a farm tank is capstone tank {c["id"]}')
    for name, case in fp['landed'].items():
        q = case['quantities']
        n4 += 1
        if abs(q['tonnes'] - K['ORON_CARGO']['quantity']) < 1e-9 and abs(q['tonnes'] * 1000 / q['m3'] - K['ORON_CARGO']['densityKgM3']) < 1e-6:
            bad.append(f'golden: landed case {name} is the capstone cargo')
    lane = fp['lane']['inputs']
    n4 += 1
    if (lane['distanceKm'], lane['payloadLitres'], lane['averageSpeedKmh']) == (K['OGWASHI_LANE']['distanceKm'], K['OGWASHI_LANE']['payloadLitres'], K['OGWASHI_LANE']['averageSpeedKmh']):
        bad.append('golden: the golden lane is the capstone lane')
    n4 += 1
    if fp['fleet']['demandLitresPerDay'] == K['OGWASHI_DEMAND_L_PER_DAY']:
        bad.append('golden: the golden fleet demand is the capstone demand')
    n4 += 1
    if fp['pump']['cap'] == K['ORON_CAP']:
        bad.append('golden: the golden pump cap is the capstone cap')
    print(f'  4. goldens: {n4} golden-case comparisons across terminaldepot_cases.json and fuelpricing_cases.json')
    for b in bad:
        print(f'  LEAK {b}')
    if n1 < 50 or n2 < 1000 or n3 < 5 or n4 < 10:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
