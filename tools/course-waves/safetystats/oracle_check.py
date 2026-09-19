#!/usr/bin/env python3
"""THE EIGHTEEN GRADED H1 ANSWERS, RECOMPUTED BY THE VENDORED PYTHON ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone scenarios through tools/validation/hse/oracle_safetystats.py (scipy
plus a 50-digit mpmath arbiter), which was written independently of the engine,
and requires every graded value to agree to 1e-10 relative. It also checks the
two claims the capstone's comments make that the engine cannot check about
itself, because they are about a convention the engine does NOT use:

  * BONNY: scipy's binomtest (the minlike two-sided p-value, R's poisson.test
    convention) sits BELOW 0.05 on the same counts where the engine's central
    p-value sits above it.
  * the central p-value and the Clopper-Pearson rate-ratio interval agree on
    every comparison graded here (the oracle's own compare() asserts it).

    /root/hseenv/bin/python oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys

HERE = os.environ.get('H1_WAVE_DIR', '/root/hse-wip-safetystats')
ENG = os.environ.get('H1_ENGINES', '/root/wt-h1-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'hse'))
try:
    import oracle_safetystats as O  # noqa: E402
    from scipy.stats import binomtest  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}). Run with /root/hseenv/bin/python.')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'h1_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True).stdout)
OK, BN, FC = inp['OKRIKA'], inp['BONNY'], inp['FORCADOS']
B2, B6, B8 = 200000, 1000000, 100000000

hours = OK['employeeHours'] + OK['contractorHours']
fcu = O.uchart(FC['monthlyRecordables'], FC['monthlyHours'], B2)
kept = [i for i in range(12) if i not in fcu['outOfControl']]
fcr = O.uchart([FC['monthlyRecordables'][i] for i in kept], [FC['monthlyHours'][i] for i in kept], B2)


def half(idx):
    return sum(FC['monthlyRecordables'][i] for i in idx), sum(FC['monthlyHours'][i] for i in idx)


(bc, bh), (ac, ah), (oc, oh) = half(range(6)), half(range(6, 12)), half(range(5))
bn = O.compare(BN['alphaRecordables'], BN['alphaHours'], BN['betaRecordables'], BN['betaHours'], BN['confidence'])
fa = O.compare(ac, ah, bc, bh, FC['confidence'])
fo = O.compare(ac, ah, oc, oh, FC['confidence'])
ga = O.garwood(BN['alphaRecordables'], BN['alphaHours'], B2, BN['confidence'])
gz = O.garwood(BN['crewRecordables'], BN['crewHours'], B2, BN['confidence'])

ORACLE = {
    'okrika_combined_trir_per_200k': O.pooled([OK['employeeRecordables'], OK['contractorRecordables']],
                                              [OK['employeeHours'], OK['contractorHours']], B2)['rate'],
    'okrika_combined_ltir_per_1m': O.rate(OK['lostTimeInjuries'], hours, B6),
    'okrika_far_per_100m': O.rate(OK['fatalities'], hours, B8),
    'okrika_severity_rate_per_200k': O.rate(OK['daysLost'], hours, B2),
    'okrika_tier1_pse_rate_per_200k': O.rate(OK['tier1Pse'], hours, B2),
    'okrika_rolling12_trir_month14_per_200k': O.rolling(OK['monthlyRecordables'], OK['monthlyHours'], B2, 12)[-1]['rate'],
    'bonny_alpha_trir_lower95_per_200k': ga['lower'],
    'bonny_alpha_trir_upper95_per_200k': ga['upper'],
    'bonny_crew_zero_event_upper95_per_200k': gz['upper'],
    'bonny_rate_ratio_lower95': bn['rateRatioLower'],
    'bonny_rate_ratio_upper95': bn['rateRatioUpper'],
    'bonny_compare_p_value': bn['pValue'],
    'forcados_centre_per_200k': fcu['centre'],
    'forcados_ucl_month09_per_200k': fcu['points'][8]['ucl'],
    'forcados_lcl_month07_per_200k': fcu['points'][6]['lcl'],
    'forcados_revised_centre_per_200k': fcr['centre'],
    'forcados_before_after_p_value': fa['pValue'],
    'forcados_before_after_p_value_without_month06': fo['pValue'],
}
if set(ORACLE) != set(graded):
    print('REFUSED: the oracle map and fields.json name different fields')
    sys.exit(2)

bad = []
worst = 0.0
for k, want in ORACLE.items():
    got, tol = graded[k]
    if PLANT and k == 'bonny_compare_p_value':
        got = got + 10 * tol
    rel = abs(got - want) / abs(want)
    worst = max(worst, rel)
    flag = 'ok' if rel <= 1e-10 else 'DISAGREES'
    if flag != 'ok':
        bad.append(k)
    print(f'  {flag:9s} {k:48s} engine {got!r:24s} oracle {float(want)!r:24s} rel {rel:.2e}')

minlike = binomtest(BN['alphaRecordables'], BN['alphaRecordables'] + BN['betaRecordables'],
                    BN['alphaHours'] / (BN['alphaHours'] + BN['betaHours'])).pvalue
claims = [
    ('BONNY central p-value above 0.05', bn['pValue'] > 0.05, bn['pValue']),
    ('BONNY minlike (scipy binomtest) p-value below 0.05', minlike < 0.05, minlike),
    ('FORCADOS flags exactly month six', fcu['outOfControl'] == [5], fcu['outOfControl']),
    ('FORCADOS with month six: significant at 0.05', fa['pValue'] < 0.05, fa['pValue']),
    ('FORCADOS without month six: not significant', fo['pValue'] > 0.05, fo['pValue']),
]
for c, ok, v in claims:
    print(f'  {"ok" if ok else "FALSE":9s} {c}: {v}')
    if not ok:
        bad.append(c)
print(f'oracle_check: 18 graded fields replayed through the vendored oracle, worst relative difference '
      f'{worst:.2e}; {len(claims)} scenario claims checked; {len(bad)} problem(s)')
if PLANT:
    print('NEGATIVE CONTROL: one field was perturbed by ten tolerances; this run must fail naming it.')
sys.exit(1 if bad else 0)
