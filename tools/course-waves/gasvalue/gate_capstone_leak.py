#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record name (ERIEMU, ADIBAWA, ASABA, and the Port
     Harcourt counterfactual) appears in digest.txt, gasvalue_dump.mjs or
     gasvalue_fields.mjs; no teaching record name (EGBEMA, OGUTA, KANO, IBAFO)
     appears in gasvalue_fields_capstone.mjs or in a capstone prompt.
  2. CONDITION SETS. No capstone gas analysis is a teaching analysis (or the
     studio's, or a golden's), no capstone LPG blend is a teaching blend, no
     capstone vessel, vaporizer, carousel, bank set or switch shares its
     defining figures with a teaching one: a shared record is a shared answer,
     whatever it is called.
  3. THE GOLDENS. No golden case in the vendored downstream goldens
     (flaretovalue_cases.json, lpgcng_cases.json) carries a capstone gas
     analysis, a capstone cascade bank set or a capstone carousel, and no
     number the goldens print is within tolerance of a graded value.
  4. THE ANSWERS. No graded value, at its printed decimals, is printed by the
     digest or the teaching case file.

Negative control: --plant copies one capstone gas into the teaching cases in
memory and one capstone name into the digest text, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('ET_ENGINES', '/root/wt-et-gasvalue-nextgen/packages/engines')


def exports(path):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{path}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));"""], capture_output=True, text=True, check=True).stdout)


K = exports(f'{W}/gasvalue_fields_capstone.mjs')
T = exports(f'{W}/gasvalue_fields.mjs')
read = lambda p: open(os.path.join(W, p), encoding='utf-8').read()  # noqa: E731
FIELDS = json.load(open(os.path.join(W, 'fields.json')))
DEC = {k: v['decimals'] for k, v in json.load(open(os.path.join(W, 'precision.json'))).items()}
PREC = json.load(open(os.path.join(W, 'precision.json')))


def decimals_of(key):
    return [c['decimals'] for c in PREC.values() if re.match(c['match'], key)][0]


def gas_key(rows):
    return tuple(sorted((c, round(float(y), 9)) for c, y in rows))


def main():
    problems = []
    plant = '--plant' in sys.argv
    digest = read('digest.txt')
    teach_src = read('gasvalue_dump.mjs') + read('gasvalue_fields.mjs')
    cap_src = read('gasvalue_fields_capstone.mjs')
    prompts = ' '.join(v['prompt'] for v in json.load(open(os.path.join(W, 'capstone.json')))['tiers'].values())
    if plant:
        digest += '\nERIEMU planted.'
        T['EGBEMA_SHORT_GAS'] = K['ERIEMU_GAS']

    # 1. names
    cap_names = ['ERIEMU', 'ADIBAWA', 'ASABA', 'Port Harcourt']
    teach_names = ['EGBEMA', 'OGUTA', 'KANO', 'IBAFO']
    for n in cap_names:
        for where, text in (('digest.txt', digest), ('the teaching generator and cases', teach_src)):
            if re.search(n, text, re.I):
                problems.append(f'capstone name {n} appears in {where}')
    for n in teach_names:
        for where, text in (('gasvalue_fields_capstone.mjs', cap_src), ('a capstone prompt', prompts)):
            if re.search(n, text, re.I):
                problems.append(f'teaching name {n} appears in {where}')
    print(f'  names: {len(cap_names)} capstone names against the digest and the teaching sources; {len(teach_names)} teaching names against the capstone source and prompts')

    # 2. condition sets
    teach_gases = {name: gas_key(v) for name, v in T.items() if name.endswith('_GAS') and isinstance(v, list)}
    teach_gases['SUITE_FLARE.gas'] = gas_key(T['SUITE_FLARE']['gas'])
    cap_gases = {'ERIEMU_GAS': gas_key(K['ERIEMU_GAS']), 'ADIBAWA_GAS': gas_key(K['ADIBAWA_GAS'])}
    for cn, ck in cap_gases.items():
        for tn, tk in teach_gases.items():
            if ck == tk:
                problems.append(f'capstone {cn} is the teaching analysis {tn}')
    cap_blend = tuple(sorted((c['code'], c['volumeFraction']) for c in K['ASABA_LPG']))
    teach_blends = [tuple(sorted(T['KANO_BLEND'].items())), (('butane', 0.6), ('propane', 0.4))]
    if cap_blend in teach_blends:
        problems.append('the ASABA LPG blend is a teaching blend')
    pairs = [
        ('vessel capacity and fill limit', (K['ASABA_VESSEL']['vesselCapacityM3'], K['ASABA_VESSEL']['maxFillRatio']),
         [(T['KANO_VESSEL']['vesselCapacityM3'], f['maxFillRatio']) for f in T['KANO_FILL_LIMITS']]),
        ('vaporizer flow, inlet and boiling point', (K['ASABA_VAPORIZER']['massFlowKgHr'], K['ASABA_VAPORIZER']['inletTempC'], K['ASABA_VAPORIZER']['boilingPointC']),
         [(T['KANO_VAPORIZER']['massFlowKgHr'], T['KANO_VAPORIZER']['inletTempC'], T['KANO_VAPORIZER']['boilingPointC'])]),
        ('carousel demand, fill time and positions', (K['ASABA_BOTTLING']['cylindersPerDay'], K['ASABA_BOTTLING']['fillMinutesPerCylinder'], K['ASABA_BOTTLING']['positions']),
         [(T['KANO_BOTTLING']['cylindersPerDay'], T['KANO_BOTTLING']['fillMinutesPerCylinder'], T['KANO_BOTTLING']['positions']),
          (T['SUITE_ROLLOUT']['bottling']['cylindersPerDay'], T['SUITE_ROLLOUT']['bottling']['fillMinutesPerCylinder'], T['SUITE_ROLLOUT']['bottling']['positions'])]),
        ('cascade bank set', tuple((b['volumeM3'], b['gaugeBar']) for b in K['ASABA_CASCADE']['banks']),
         [tuple((b['volumeM3'], b['pressureBar']) for b in T['IBAFO_BANKS']), tuple((b['volumeM3'], b['pressureBar']) for b in T['SUITE_ROLLOUT']['banks'])]),
        ('switch distance and prices', (K['ASABA_CONVERSION']['annualDistanceKm'], K['ASABA_CONVERSION']['baseFuel']['pricePerUnit'], K['ASABA_CONVERSION']['newFuel']['pricePerUnit']),
         [(T['IBAFO_CONVERSION']['annualDistanceKm'], T['IBAFO_CONVERSION']['baseFuel']['pricePerUnit'], T['IBAFO_CONVERSION']['newFuel']['pricePerUnit'])]),
    ]
    for what, cap, teach in pairs:
        if cap in teach:
            problems.append(f'the ASABA {what} is a teaching record\'s')
    print(f'  condition sets: {len(cap_gases)} capstone analyses against {len(teach_gases)} teaching ones; 1 blend; {len(pairs)} equipment records')

    # 3. goldens
    gold_nums, gold_cases = [], 0
    golden_gases = []
    golden_banks = []
    for name in ('flaretovalue_cases.json', 'lpgcng_cases.json'):
        doc = json.load(open(os.path.join(ENG, 'test-data', 'downstream', 'goldens', name)))
        text = json.dumps(doc)
        gold_nums += [abs(float(t)) for t in re.findall(r'-?\d+\.?\d*(?:[eE][-+]?\d+)?', text)]
        for g in doc.get('gases', []):
            gold_cases += 1
            golden_gases.append(gas_key([(c['code'], c['moleFraction']) for c in g['components'] if c['moleFraction'] not in ('', None)]))
        for c in doc.get('cascades', []):
            gold_cases += 1
            golden_banks.append(tuple((b['volumeM3'], b['pressureBar']) for b in c['banks']))
    for cn, ck in cap_gases.items():
        if ck in golden_gases:
            problems.append(f'a golden carries the capstone analysis {cn}')
    cb = K['ASABA_CASCADE']['banks']
    cap_banks_abs = tuple((b['volumeM3'], b['gaugeBar'] + K['ASABA_CNG']['atmosphereBar']) for b in cb)
    if cap_banks_abs in golden_banks or tuple((b['volumeM3'], b['gaugeBar']) for b in cb) in golden_banks:
        problems.append('a golden carries the ASABA cascade')
    near = 0
    for tier, key, val, tol in FIELDS:
        for g in gold_nums:
            if abs(abs(val) - g) <= tol:
                near += 1
                problems.append(f'a golden prints {g}, within {tol} of {tier}.{key} = {val}')
                break
    print(f'  goldens: {gold_cases} gas and cascade cases and {len(gold_nums)} numbers swept against 18 graded values')

    # 4. answers
    for tier, key, val, tol in FIELDS:
        s = f'{val:.{decimals_of(key)}f}'
        for where, text in (('digest.txt', digest), ('gasvalue_fields.mjs', read('gasvalue_fields.mjs'))):
            if s in text:
                problems.append(f'{where} prints {s}, the graded value of {tier}.{key}')
    print('  answers: 18 graded values at their printed decimals against the digest and the teaching cases')

    for p in problems:
        print(f'  LEAK {p}')
    print(f'  problems: {len(problems)}')
    return 1 if problems else 0


sys.exit(main())
