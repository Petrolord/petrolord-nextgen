#!/usr/bin/env python3
"""THE EIGHTEEN GRADED D4 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/dataai/oracle_forecast.py (python
standard library only: the recursions in the ERROR-CORRECTION form in
Decimal(60) where the engine runs the component form in float; the fit by a
ZOOM GRID where the engine runs a compass search; metrics in Fractions;
mulberry32 in 32-bit integers with Decimal bootstrap paths and the
simple-statistics quantile rule; fitArpsModel's published algorithm in
Decimal), which was written independently of the engine from the published
definitions.

TWO KINDS OF FIELD, TWO AGREEMENTS. A field computed with every smoothing
parameter GIVEN, or not from a smoothing fit at all (the Arps Di), is
arithmetic, and must agree to 1e-10 relative AND to a thousandth of its own
grading tolerance absolute. A field that rests on FITTED parameters rests on
where two different searches stop on a flat SSE surface; the engine and the
oracle reach the same minimum by different roads, so such a field must agree
to a tenth of its grading tolerance absolute, which gradedTolerance.js sets
from this very measurement (10 x the worst disagreement, rounded up to a
power of ten) and this check proves is met with a margin.

The oracle's ambiguity guard is kept ON: where a float program could branch
differently from the exact one (two coarse-grid SSEs within 1e-9, two Arps
candidates within 1e-9, a ranking within 1e-9) the oracle raises, and this
check REFUSES rather than compare.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
import time
from fractions import Fraction as F

HERE = os.environ.get('D4_WAVE_DIR', '/root/dai-wip-forecastml')
ENG = os.environ.get('D4_ENGINES', '/root/wt-dai-d4-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'dataai'))
try:
    import oracle_forecast as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}).')
    sys.exit(2)

PLANT = '--plant' in sys.argv
T0 = time.time()
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ, D4_ENGINES=ENG)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'd4_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=env).stdout)
AG, NK, UM = inp['AGULU'], inp['NANKA'], inp['UMUNZE']


def rate_of(field, wid):
    return next(w['rate'] for w in field['wells'] if w['well'] == wid)


# Fields whose value rests on FITTED smoothing parameters (the rest are arithmetic).
FITTED = set()
got = {}
try:
    # ---- AGULU
    agS = AG['stated']
    ag1, ag2 = rate_of(AG['field'], 'AGULU-1'), rate_of(AG['field'], 'AGULU-2')
    got['agulu2_ses_alpha'] = O.o_fit(ag2, 'ses')[0]['params']['alpha']
    got['agulu1_holt_fixed_mse_bopd2'] = O.o_fit(ag1, 'holt', alpha=agS['alpha'], beta=agS['beta'])[0]['mse']
    h = O.o_fit(ag1, 'holt', h=agS['hHolt'])[0]
    got['agulu1_holt_beta'] = h['params']['beta']
    got['agulu1_holt_forecast_h12_bopd'] = h['forecast'][agS['hHolt'] - 1]
    d = O.o_fit(ag1, 'damped', h=agS['hDamped'])[0]
    got['agulu1_damped_phi'] = d['params']['phi']
    got['agulu1_damped_forecast_h24_bopd'] = d['forecast'][agS['hDamped'] - 1]
    FITTED |= {'agulu2_ses_alpha', 'agulu1_holt_beta', 'agulu1_holt_forecast_h12_bopd', 'agulu1_damped_phi', 'agulu1_damped_forecast_h24_bopd'}

    # ---- NANKA
    nkS = NK['stated']
    nk1, nk2 = rate_of(NK['field'], 'NANKA-1'), rate_of(NK['field'], 'NANKA-2')
    tr = nk1[:nkS['train']]
    fd = O.o_fit(tr, 'damped', h=nkS['h'])[0]
    acc = O.o_accuracy(nk1[nkS['train']:nkS['train'] + nkS['h']], fd['forecast'], insample=tr)
    got['nanka1_holdout_damped_smape_pct'] = acc['smape']
    got['nanka1_holdout_damped_mase'] = acc['mase']
    got['nanka1_holdout_damped_me_bopd'] = acc['me']
    bt = O.o_backtest(nk2, 'holt', nkS['firstOrigin'], nkS['horizon'], nkS['step'])
    got['nanka2_backtest_holt_rmse_bopd'] = bt['overall']['rmse']
    got['nanka2_backtest_holt_step6_mae_bopd'] = bt['byHorizon'][nkS['horizon'] - 1]['mae']
    bh = O.o_backtest(nk2, 'holt', nkS['firstOrigin'], nkS['horizon'], nkS['step'], refit=False)
    got['nanka2_backtest_holt_held_mase'] = bh['overall']['mase']
    FITTED |= {k for k in got if k.startswith('nanka')}

    # ---- UMUNZE
    umS = UM['stated']
    um1, um2 = rate_of(UM['field'], 'UMUNZE-1'), rate_of(UM['field'], 'UMUNZE-2')
    pi = O.o_intervals(um1, 'damped', umS['h'], umS['seed'], n_sims=umS['nSims'])
    got['umunze1_damped_p90_h12_bopd'] = pi['P90'][umS['h'] - 1]
    got['umunze1_damped_p10_h12_bopd'] = pi['P10'][umS['h'] - 1]
    got['umunze1_damped_p50_h6_bopd'] = pi['P50'][5]
    ar, reason = O.o_arps_forecast(um1)
    if reason:
        print(f'REFUSED: the oracle gives no Arps fit on UMUNZE-1 ({reason})'); sys.exit(2)
    got['umunze1_arps_di_per_month'] = ar['Di']
    cm = O.o_compare(um2, umS['firstOrigin'], umS['horizon'], umS['step'])
    got['umunze2_compare_arps_mase'] = next(r for r in cm['rows'] if r['method'] == 'arps')['mase']
    got['umunze2_compare_best_mase'] = next(r for r in cm['rows'] if r['method'] == cm['best'])['mase']
    FITTED |= {'umunze1_damped_p90_h12_bopd', 'umunze1_damped_p10_h12_bopd', 'umunze1_damped_p50_h6_bopd', 'umunze2_compare_best_mase'}
except O.Ambiguous as e:
    print(f'REFUSED: the oracle met an ambiguous case and will not write it ({e}); a graded value there would rest on rounding')
    sys.exit(2)

if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    k0 = 'nanka2_backtest_holt_rmse_bopd'
    got[k0] = got[k0] + 10 * graded[k0][1]

worst = 0.0
bad = []
print(f'{"field":46s} {"engine (fields.json)":>22s} {"oracle":>22s} {"relative":>10s} {"abs/tol":>9s}  kind     within')
for _, k, v, tol in fields:
    o = got[k]
    rel = abs(o - v) / max(abs(v), 1e-300)
    worst = max(worst, rel)
    ok = (abs(o - v) <= tol / 10) if k in FITTED else (rel <= 1e-10 and abs(o - v) <= tol / 1000)
    if not ok:
        bad.append(k)
    print(f'{k:46s} {v:22.15g} {o:22.15g} {rel:10.2e} {abs(o - v) / tol:9.2e}  {"fitted " if k in FITTED else "exact  "}  {"yes" if ok else "NO"}')
print(f'oracle_check: 18 graded values replayed through the stdlib oracle in {time.time() - T0:.0f} s; worst relative difference {worst:.2e}; disagreements: {len(bad)}')
if PLANT:
    print(f'NEGATIVE CONTROL: nanka2_backtest_holt_rmse_bopd was moved by ten tolerances; {"caught" if bad == ["nanka2_backtest_holt_rmse_bopd"] else "NOT CAUGHT as planted"}')
    sys.exit(1 if bad == ['nanka2_backtest_holt_rmse_bopd'] else 2)
sys.exit(1 if bad else 0)
