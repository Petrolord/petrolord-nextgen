#!/usr/bin/env python3
"""THE EIGHTEEN GRADED D1 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/dataai/oracle_quality.py (python
standard library only: exact Fractions for means, medians, MADs, quantiles,
covariances and the chart recursions; a closed-form t distribution for
Grubbs; a closed-form chi-square for the Mahalanobis cutoff), which was written
independently of the engine from the published equations, and requires every
graded value to agree to 1e-10 relative. It also re-checks, on the oracle's
side, every scenario claim the capstone generator asserts on the engine's side.

The one quantity the oracle does not return is the phase-sum ALLOWED
difference; it is recomputed here from its stated definition,
max(absTolerance, relTolerance x |total|) with the engine defaults 0 and 0.005,
in exact Fractions.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
from fractions import Fraction as F

HERE = os.environ.get('D1_WAVE_DIR', '/root/dai-wip-dataqc')
ENG = os.environ.get('D1_ENGINES', '/root/wt-dai-d1-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'dataai'))
try:
    import oracle_quality as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}).')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ, D1_ENGINES=ENG)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'd1_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=env).stdout)
OD, IK, AM = inp['ODUDU'], inp['IKORO'], inp['AMASIRI']

# ---- ODUDU
comp = O.o_completeness(OD['log']['rhob'])
cov = O.o_coverage(OD['log']['depth'], OD['log']['nphi'], OD['log']['coverageStart'], OD['log']['coverageEnd'], OD['log']['maxStep'])
idx = O.o_index(OD['scada']['hours'])
prod = OD['production']
wc = O.o_watercut(prod['waterCut'], prod['oil'], prod['water'], 1e-4)
cum = O.o_cumulative(prod['cumOil'])
ph = O.o_phasesum({'oil': prod['oil'], 'water': prod['water']}, prod['gross'])
day44 = ph['flags'][0]['index'] if ph['flags'] else None
allowed44 = float(max(F(0), F('0.005') * abs(F(prod['gross'][day44])))) if day44 is not None else float('nan')

# ---- IKORO
z = O.o_z(IK['core'])
mz = O.o_modz(IK['core'])
fen = O.o_iqr(IK['rhob'])
ham = O.o_hampel(IK['rhob'], IK['halfWindow'], IK['nSigma'])
gr = O.o_grubbs(IK['core'], IK['alpha'])
ma = O.o_mahalanobis(IK['cloud'])
d2max = max(v for v in ma['d2'] if v is not None)

# ---- AMASIRI
p1 = O.o_individuals(AM['phase1'])
ew = O.o_ewma(AM['phase2'], AM['lambda'], p1['centre'], p1['sigma'], AM['L'])
ewx = O.o_ewma(AM['phase2'], AM['lambda'], p1['centre'], p1['sigma'], AM['L'], 'exact')
cu = O.o_cusum(AM['phase2'], p1['centre'], AM['k'], AM['h'], 'sigma', p1['sigma'])
sc = O.o_scorecard(AM['scorecard']['dimensions'], AM['scorecard']['weights'])

ORACLE = {
    'odudu_rhob_completeness': comp['completeness'],
    'odudu_nphi_coverage': cov['coverage'],
    'odudu_scada_expected_step_h': idx['expectedStep'],
    'odudu_water_cut_day23': wc['computed'][22],
    'odudu_cumulative_drop_bbl': cum['flags'][0]['drop'] if cum['flags'] else float('nan'),
    'odudu_phase_sum_allowed_day44_bbl_d': allowed44,
    'ikoro_core_max_abs_z': z['maxAbsZ'],
    'ikoro_core_max_abs_modified_z': max(abs(v) for v in mz['scores'] if v is not None),
    'ikoro_rhob_upper_fence_g_cm3': fen['upper'],
    'ikoro_rhob_hampel_threshold_entry57_g_cm3': ham['points'][57]['threshold'],
    'ikoro_core_grubbs_critical': gr['critical'],
    'ikoro_max_mahalanobis_d2': d2max,
    'amasiri_phase1_individuals_ucl_psig': p1['ucl'],
    'amasiri_phase1_mr_ucl_psig': p1['mrUcl'],
    'amasiri_ewma_day14_psig': ew['ewma'][13],
    'amasiri_ewma_exact_ucl_day2_psig': ewx['points'][1]['ucl'],
    'amasiri_cusum_upper_day18_psi': cu['points'][17]['sHigh'],
    'amasiri_scorecard_total': sc['total'],
}
if set(ORACLE) != set(graded):
    print('REFUSED: the oracle map and fields.json name different fields')
    sys.exit(2)

bad = []
worst = 0.0
for k, want in ORACLE.items():
    got, tol = graded[k]
    if PLANT and k == 'ikoro_core_grubbs_critical':
        got = got + 10 * tol
    rel = abs(got - want) / abs(want)
    worst = max(worst, rel)
    flag = 'ok' if rel <= 1e-10 else 'DISAGREES'
    if flag != 'ok':
        bad.append(k)
    print(f'  {flag:9s} {k:44s} engine {got!r:24s} oracle {float(want)!r:24s} rel {rel:.2e}')

claims = [
    ('ODUDU RHOB gap runs are nine, one and one', [r['length'] for r in comp['gapRuns']] == [9, 1, 1], comp['gapRuns']),
    ('ODUDU coverage leaves three holes', len(cov['uncovered']) == 3, cov['uncovered']),
    ('ODUDU SCADA index: two duplicates and one reversal', idx['duplicates'] == 2 and idx['reversals'] == 1, idx),
    ('ODUDU only day 23 is a water cut mismatch at 1e-4', [(f['index'], f['rule']) for f in wc['flags']] == [(22, 'water-cut-mismatch')], wc['flags']),
    ('ODUDU only day 39 falls, against day 37', [(f['index'], f['previousIndex']) for f in cum['flags']] == [(38, 36)], cum['flags']),
    ('ODUDU only day 44 fails the phase sum', [f['index'] for f in ph['flags']] == [43], ph['flags']),
    ('IKORO the modified z flags plug 12 (entry 11)', any(f['index'] == 11 for f in mz['flags']), mz['flags']),
    ('IKORO Hampel flags entry 57 on six present samples', any(f['index'] == 57 for f in ham['flags']) and ham['points'][57]['windowCount'] == 6, ham['points'][57]),
    ('IKORO Grubbs rejects entry 11', gr.get('reject') is True and gr.get('suspectIndex') == 11, {k: gr.get(k) for k in ('reject', 'suspectIndex')}),
    ('IKORO the largest d2 is row 23 and it is flagged', ma['d2'].index(d2max) == 23 and any(f['index'] == 23 for f in ma['flags']), ma['flags']),
    ('AMASIRI phase one is in control', p1['flags'] == [], p1['flags']),
    ('AMASIRI the upper CUSUM signals on or after day 12', cu['firstSignalHigh'] is not None and cu['firstSignalHigh'] >= 11, cu['firstSignalHigh']),
]
for c, ok, v in claims:
    print(f'  {"ok" if ok else "FALSE":9s} {c}')
    if not ok:
        print(f'            {str(v)[:200]}')
        bad.append(c)
print(f'oracle_check: 18 graded fields replayed through the vendored oracle, worst relative difference '
      f'{worst:.2e}; {len(claims)} scenario claims checked; {len(bad)} problem(s)')
if PLANT:
    print('NEGATIVE CONTROL: one field was perturbed by ten tolerances; this run must fail naming it.')
sys.exit(1 if bad else 0)
