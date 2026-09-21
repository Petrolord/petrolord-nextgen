#!/usr/bin/env python3
"""THE EIGHTEEN GRADED H3 ANSWERS, RECOMPUTED BY THE VENDORED PYTHON ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone scenarios through tools/validation/hse/oracle_lopa.py, which was
written independently of the engine (stdlib only, EXACT RATIONAL arithmetic on
the decimal spellings of the inputs, the Annex B group-failure construction for
every PFDavg, the exact cubic in T1 for every longest interval) and requires
every graded value to agree to 1e-10 relative. It also checks the claims the
capstone prompts make that are DECISIONS rather than numbers, in exact
arithmetic with no decade snap:

  * AKPO export: the required RRF is EXACTLY 100 as a rational, so the exact
    oracle bands it SIL 1 with no snap at all (that the IEEE double the engine
    computes lands strictly above 100 is asserted by h3_capstone.mjs, since a
    rational cannot show it);
  * AKPO tank and compressor: SIL 2; AKPO separator: SIL 1;
  * AKPO export with the SIL 1 catalogue SIF misses the TMEL, and the compressor
    with its proposed SIF meets it, both decided exactly;
  * YOHO transmitter: the target is UNACHIEVABLE at every interval.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
from fractions import Fraction as Fr

HERE = os.environ.get('H3_WAVE_DIR', '/root/hse-wip-lopa')
ENG = os.environ.get('H3_ENGINES', '/root/wt-h3-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'hse'))
try:
    import oracle_lopa as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'h3_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True).stdout)
A, U, Y = inp['AKPO'], inp['USAN'], inp['YOHO']


def pairs(xs):
    return [(x['name'], x['probability']) for x in xs]


def lopa(s, sif=None):
    return O.lopa(s['initiatingEventFrequencyPerYr'], s['tmelPerYr'], pairs(s['enablingConditions']),
                  pairs(s['conditionalModifiers']), s['ipls'], sif)


def pfd(p, t1=None):
    return O.route_a(p, t1)[0]


def stretch(p):
    q = dict(p)
    q['proofTestIntervalHours'] = Y['stretchedIntervalHours']
    return q


sep, tank = lopa(A['separator']), lopa(A['tank'])
comp = lopa(A['compressor'], A['compressor']['sifPfdAvg'])
exp0 = lopa(A['export'])
exp1 = lopa(A['export'], A['export']['catalogue']['sil1'])
us_sum = pfd(U['transmitters']) + pfd(U['logicSolver']) + pfd(U['valves'])
us_row = lopa(U['lopaRow'], us_sum)
yo3 = pfd(stretch(Y['transmitters2oo3'])) + pfd(stretch(Y['logicSolver'])) + pfd(stretch(Y['valves']))
floor = O.max_interval(Y['transmitter'], Y['transmitterTargetPfdAvg'])

ORACLE = {
    'akpo_separator_unmitigated_frequency_per_yr': sep['unmitigatedFrequencyPerYr'],
    'akpo_separator_required_rrf': sep['requiredRrf'],
    'akpo_tank_mitigated_frequency_without_sif_per_yr': tank['mitigatedFrequencyWithoutSifPerYr'],
    'akpo_tank_required_sif_pfdavg': tank['requiredSifPfdAvg'],
    'akpo_compressor_mitigated_frequency_with_sif_per_yr': comp['mitigatedFrequencyPerYr'],
    'akpo_export_catalogue_sif_mitigated_frequency_per_yr': exp1['mitigatedFrequencyPerYr'],
    'usan_transmitters_2oo3_pfdavg': float(pfd(U['transmitters'])),
    'usan_logic_solver_1oo1_pfdavg': float(pfd(U['logicSolver'])),
    'usan_valves_1oo2_pfdavg': float(pfd(U['valves'])),
    'usan_sif_rrf': float(1 / us_sum),
    'usan_proposed_2oo2_transmitters_pfdavg': float(pfd(U['proposed2oo2'])),
    'usan_mitigated_frequency_with_sif_per_yr': us_row['mitigatedFrequencyPerYr'],
    'yoho_valves_1oo2_max_interval_hours': O.max_interval(Y['valves'], Y['valveBudgetPfdAvg'])['proofTestIntervalHours'],
    'yoho_valve_1oo1_ptc_pfdavg': float(pfd(Y['singleValve'])),
    'yoho_valve_1oo1_ptc_max_interval_hours': O.max_interval(Y['singleValve'], Y['singleValveTargetPfdAvg'])['proofTestIntervalHours'],
    'yoho_transmitter_ptc_floor_pfdavg': floor.get('floorPfdAvg', float('nan')),
    'yoho_sif_rrf_at_three_year_interval': float(1 / yo3),
    'yoho_transmitters_2oo3_max_interval_hours': O.max_interval(Y['transmitters2oo3'], Y['transmitterBudgetPfdAvg'])['proofTestIntervalHours'],
}
if set(ORACLE) != set(graded):
    print('REFUSED: the oracle replay does not cover exactly the eighteen graded keys')
    sys.exit(2)

problems = []
worst = (0.0, None)
planted = None
if PLANT:
    planted = fields[7][1]
for k, (v, tol) in graded.items():
    ov = ORACLE[k]
    if planted == k:
        v = v + 10 * tol
    rel = abs(v - ov) / abs(ov)
    if rel > worst[0]:
        worst = (rel, k)
    if not rel <= 1e-10:
        problems.append(f'{k}: engine (fields.json) {v!r} against oracle {ov!r}, relative {rel:.3e}')

# the decisions, exactly
claims = []


def claim(name, cond):
    claims.append(name)
    if not cond:
        problems.append(f'CLAIM FAILED: {name}')


exact_rrf = Fr(exp0['requiredRrfExact'].split('/')[0]) / Fr(exp0['requiredRrfExact'].split('/')[1])
claim('Akpo export: the required RRF is exactly 100 as a rational', exact_rrf == 100)
claim('Akpo export: the exact oracle bands it SIL 1 with no snap', exp0['outcome'] == 'SIL1')
claim('Akpo export with the SIL 1 catalogue SIF misses the TMEL, decided exactly', exp1['meetsTmel'] is False)
claim('Akpo compressor with its proposed SIF meets the TMEL, decided exactly', comp['meetsTmel'] is True)
claim('Akpo separator is SIL 1, the tank and the compressor SIL 2',
      sep['outcome'] == 'SIL1' and tank['outcome'] == 'SIL2' and comp['outcome'] == 'SIL2')
claim('Akpo: the non-independent IPLs are not credited by the oracle either',
      sep['notCredited'] and tank['notCredited'] and exp0['notCredited'])
claim('Usan LOPA row: SIL 2, and the verified SIF meets the TMEL', us_row['outcome'] == 'SIL2' and us_row['meetsTmel'] is True)
claim('Yoho transmitter: UNACHIEVABLE at every interval', floor['state'] == 'UNACHIEVABLE')

print(f'oracle_check: oracle {os.path.join(ENG, "tools/validation/hse/oracle_lopa.py")}')
print(f'  graded fields replayed: {len(ORACLE)}, worst relative difference {worst[0]:.2e} ({worst[1]})')
print(f'  decisions checked in exact arithmetic: {len(claims)}')
if PLANT:
    caught = [p for p in problems if p.startswith(planted)]
    print(f'  NEGATIVE CONTROL: {planted} perturbed by ten tolerances; caught {len(caught)}')
    sys.exit(1 if caught else 2)
for p in problems:
    print(f'   {p}')
print(f'oracle_check: 18 graded fields replayed through the vendored oracle, worst relative difference {worst[0]:.2e}; '
      f'{len(claims)} decisions checked exactly; {len(problems)} problem(s)')
sys.exit(1 if problems else 0)
