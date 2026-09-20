#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record name, operator or measure label appears in
     digest.txt, carbon_dump.mjs or carbon_fields.mjs; no teaching record name
     or operator appears in carbon_fields_capstone.mjs or in a capstone prompt.
  2. DERIVED FIGURES. No graded value and no engine-derived intermediate on the
     way to one (read from the engine through carbon_capstone.mjs --json, never
     typed) is printed by the digest, in any rounding of three or more
     significant figures, so a learner cannot look one up there.
  3. CONDITION SETS. No capstone combustion source, fuel gas, heater, trap,
     stream, measure, inventory line or saving carries the same defining
     inputs as a teaching record (a shared record is a shared answer, whatever
     it is called).
  4. THE GOLDENS AND THE PAGE. No golden case in the vendored downstream
     goldens (which carry the Suite pages' own defaults) carries a capstone
     record's defining inputs together in one case: FC4's repair took a
     capstone's exact conditions for a golden row, and the published file
     handed back a graded answer.

Negative control: --plant copies the capstone trap into the teaching cases in
memory and one derived figure into the digest text, and the gate must name
both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-et-carbon-nextgen/packages/engines')


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src], capture_output=True, text=True, check=True).stdout)


def exports(mod):
    return node_json(f"""
const K = await import('{W}/{mod}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));""")


K = exports('carbon_fields_capstone.mjs')
F = exports('carbon_fields.mjs')
OUT = json.loads(subprocess.run(['node', f'{W}/carbon_capstone.mjs', '--json'], capture_output=True, text=True, check=True).stdout)
CAP_NAMES = [r'\bOWAZA\b', r'\bOwaza\b', r'\bIGRITA\b', r'\bIgrita\b', r'\bIKORODU\b', r'\bIkorodu\b', r'Ukwa', r'Aluu',
             r'Lagoon Midstream', r'Waste heat recovery on the gas turbine', r'Economiser on the boilers', r'Tune the boilers']
TEACH_NAMES = [r'\bIGBOGENE\b', r'\bIgbogene\b', r'\bISIOKPO\b', r'\bIsiokpo\b', r'\bAGBOR\b', r'\bAgbor\b', r'Epie Creek',
               r'Ikwerre Midstream', r'Ika Energy']


def sig(tok):
    return len(tok.lstrip('-').replace('.', '').lstrip('0'))


def main():
    plant = '--plant' in sys.argv
    bad = []
    digest = open(os.path.join(W, 'digest.txt'), encoding='utf-8').read()
    if plant:
        digest += f"\nplanted {OUT['derived']['ikorodu_baseline_t']:.3f}\n"
        F['ISIOKPO_TRAP'] = {**F['ISIOKPO_TRAP'], 'orificeDiameterMm': K['IGRITA_TRAP']['orificeDiameterMm'],
                             'dischargeCoefficient': K['IGRITA_TRAP']['dischargeCoefficient'],
                             'steamDensityKgM3': K['IGRITA_TRAP']['steamDensityKgM3']}
    # 1. names
    teaching_side = {'digest.txt': digest,
                     'carbon_dump.mjs': open(os.path.join(W, 'carbon_dump.mjs')).read(),
                     'carbon_fields.mjs': open(os.path.join(W, 'carbon_fields.mjs')).read()}
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    capstone_side = {'carbon_fields_capstone.mjs': open(os.path.join(W, 'carbon_fields_capstone.mjs')).read(),
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
    comb = lambda r: (r['fuelKmolPerYear'], r['carbonPerKmolFuel'])  # noqa: E731
    meas = lambda m: (m['capitalCost'], m['annualSavings'], m['tonnesAbatedPerYear'])  # noqa: E731
    trap = lambda t: (t['orificeDiameterMm'], t['dischargeCoefficient'], t['steamDensityKgM3'])  # noqa: E731
    heat = lambda h: (h['stackTempC'], h['combustionAirTempC'], h['currentO2Percent'])  # noqa: E731
    strm = lambda s: (s['supplyC'], s['targetC'], s['cpKWperK'])  # noqa: E731
    sets = [
        ('combustion source', [comb(F['IGBOGENE_HEATERS']), comb(F['IGBOGENE_FLARE'])] + [comb(v) for v in F['AGBOR_SOURCES'].values()],
         [comb(K['OWAZA_HEATERS']), comb(K['OWAZA_FLARE'])]),
        ('fuel gas', [tuple(map(tuple, F['ISIOKPO_FUEL']))], [tuple(map(tuple, K['IGRITA_FUEL']))]),
        ('heater', [heat(F['ISIOKPO_HEATER'])], [heat(K['IGRITA_HEATER'])]),
        ('trap', [trap(F['ISIOKPO_TRAP'])], [trap(K['IGRITA_TRAP'])]),
        ('stream', [strm(s) for s in F['ISIOKPO_STREAMS']], [strm(s) for s in K['IGRITA_STREAMS']]),
        ('measure', [meas(m) for m in F['AGBOR_MEASURES']], [meas(m) for m in K['IKORODU_MEASURES']]),
        ('vented methane', [(F['IGBOGENE_VENT']['activity'],), (F['AGBOR_VENT_T_CH4'],)], [(K['OWAZA_VENT']['activity'],), (K['IKORODU_LINES']['ventCh4T'],)]),
        ('purchased power', [(F['IGBOGENE_POWER']['activity'], F['IGBOGENE_POWER']['factor']['value']), (F['AGBOR_POWER']['activity'], F['AGBOR_POWER']['factor'])],
         [(K['OWAZA_POWER']['activity'], K['OWAZA_POWER']['factor']['value']), (K['IKORODU_LINES']['powerMWh'], K['IKORODU_LINES']['powerFactor'])]),
        ('saving', [(F['AGBOR_SAVING']['energySavedGJ'], F['AGBOR_SAVING']['implementationCost'])], [(K['IKORODU_SAVING']['energySavedGJ'], K['IKORODU_SAVING']['implementationCost'])]),
    ]
    n3 = 0
    for kind, teach, capst in sets:
        for c in capst:
            for t in teach:
                n3 += 1
                if tuple(c) == tuple(t):
                    bad.append(f'condition set: a capstone {kind} {c} is also a teaching {kind}')
    print(f'  3. condition sets: {n3} capstone-against-teaching record comparisons over {len(sets)} kinds')
    # 4. goldens (the Suite page defaults are the goldens' first cases)
    G = os.path.join(ENG, 'test-data', 'downstream', 'goldens')
    ca = json.load(open(os.path.join(G, 'carbonabatement_cases.json')))
    ee = json.load(open(os.path.join(G, 'energyefficiency_cases.json')))
    n4 = 0
    for name, c in ca['combustion'].items():
        for cs in (K['OWAZA_HEATERS'], K['OWAZA_FLARE']):
            n4 += 1
            if (c['fuelKmolPerYear'], c['carbonPerKmolFuel']) == comb(cs):
                bad.append(f'golden: combustion case {name} is a capstone source')
    for m in ca['measures']:
        for cm in K['IKORODU_MEASURES']:
            n4 += 1
            if meas(m) == meas(cm):
                bad.append(f'golden: measure "{m["label"]}" is capstone measure "{cm["label"]}"')
    for name, s in ee['stoichiometry'].items():
        n4 += 1
        if [(x['code'], x['moleFraction']) for x in s['fuel']] == [tuple(x) for x in K['IGRITA_FUEL']]:
            bad.append(f'golden: fuel {name} is the capstone fuel gas')
    n4 += 1
    if (ee['heater']['stackTempC'], ee['heater']['combustionAirTempC']) == (K['IGRITA_HEATER']['stackTempC'], K['IGRITA_HEATER']['combustionAirTempC']):
        bad.append('golden: the golden heater is the capstone heater')
    for s in ee['pinchStreams']:
        for cs in K['IGRITA_STREAMS']:
            n4 += 1
            if strm(s) == strm(cs):
                bad.append(f'golden: pinch stream "{s["label"]}" is capstone stream "{cs["label"]}"')
    n4 += 1
    if ca['path']['startYear'] == K['IKORODU_PLAN']['startYear'] and ca['path']['endYear'] == K['IKORODU_PLAN']['endYear'] and ca['path']['targetPercent'] == K['IKORODU_PLAN']['targetReductionPercentByEnd']:
        bad.append('golden: the golden path plan is the capstone plan')
    print(f'  4. goldens: {n4} golden-case comparisons across carbonabatement_cases.json and energyefficiency_cases.json')
    for b in bad:
        print(f'  LEAK {b}')
    if n1 < 50 or n2 < 1000 or n3 < 20 or n4 < 20:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
