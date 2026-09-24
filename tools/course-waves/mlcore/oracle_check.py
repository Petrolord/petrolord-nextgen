#!/usr/bin/env python3
"""THE EIGHTEEN GRADED D2 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/dataai/oracle_ml.py (python
standard library only: exact Fractions for the scaler, the splits' integer
mulberry32 and the least squares normal equations; Decimal at 60 digits for
ridge, the logistic Newton iteration and the log loss), which was written
independently of the engine from the published equations, and requires every
graded value to agree to 1e-10 relative AND to a thousandth of its own
grading tolerance absolute, so no graded value rests on float noise the
tolerance could not absorb. It also re-checks, on the oracle's side, every
scenario claim the capstone generator asserts on the engine's side.

The oracle's logistic reports the converged coefficients at its own 60-digit
optimum, and the three-update field as its own third Newton iterate, so the
comparison also proves the engine's stopping rule does not move a graded
value.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys

HERE = os.environ.get('D2_WAVE_DIR', '/root/dai-wip-mlcore')
ENG = os.environ.get('D2_ENGINES', '/root/wt-dai-d2-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'dataai'))
try:
    import oracle_ml as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported ({e}).')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ, D2_ENGINES=ENG)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'd2_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=env).stdout)
AK, OB, IS = inp['AKPARA'], inp['OBORIA'], inp['ISUAMA']
LOGS = ['GR', 'RHOB', 'NPHI']
ATTRS = ['easting', 'northing', 'kb', 'mudWeight']


def xof(F, rows, feats):
    W = {w['id']: w for w in F['wells']}
    return [[r[f] if f in r else W[r['well']][f] for f in feats] for r in rows]


def sonic(F):
    return [r for r in F['field']['rows'] if r['DT'] is not None]


def pick(a, idx):
    return [a[i] for i in idx]


# ---- AKPARA
ak = AK['field']
aks = sonic(AK)
akX = xof(ak, aks, LOGS)
akY = [r['DT'] for r in aks]
akG = [r['well'] for r in aks]
sp = O.o_group_split(akG, AK['stated']['seed'], AK['stated']['testFraction'])
sc = O.o_scaler(akX, sp['trainIndices'], LOGS)
ol = O.o_ols(pick(akX, sp['trainIndices']), pick(akY, sp['trainIndices']), LOGS)
pv, _ = O.o_predict_values(ol, pick(akX, sp['testIndices']))
am = O.o_regression_metrics(pick(akY, sp['testIndices']), pv)

# ---- OBORIA
ob = OB['field']
obS = OB['stated']
obs = sonic(OB)
obXL = xof(ob, obs, LOGS)
obXA = xof(ob, obs, LOGS + ATTRS)
obY = [r['DT'] for r in obs]
obG = [r['well'] for r in obs]
osp = O.o_group_split(obG, obS['seed'], obS['testFraction'])
rd = O.o_ridge(pick(obXA, osp['trainIndices']), pick(obY, osp['trainIndices']), obS['lambda'], LOGS + ATTRS)
kf = O.o_group_kfold(obG, obS['k'], obS['seed'])
fo = kf['folds'][obS['fold']]
fol = O.o_ols(pick(obXL, fo['trainIndices']), pick(obY, fo['trainIndices']), LOGS)
fpv, _ = O.o_predict_values(fol, pick(obXL, fo['testIndices']))
fm = O.o_regression_metrics(pick(obY, fo['testIndices']), fpv)
lk = O.o_leakage(obXA, obY, obG, {'kind': 'ols'}, obS['testFraction'], obS['seed'], 'rmse')
obR = ob['rows']
obXP = xof(ob, obR, obS['payFeatures'])
obP = [r['PAY'] for r in obR]
psp = O.o_group_split([r['well'] for r in obR], obS['paySeed'], obS['testFraction'])
lg, _ = O.o_logistic(pick(obXP, psp['trainIndices']), pick(obP, psp['trainIndices']), names=obS['payFeatures'], check_margin=False)
ppr, pcl = O.o_predict_values(lg, pick(obXP, psp['testIndices']))
yt = pick(obP, psp['testIndices'])
rep = O.o_report(yt, pcl)
f1 = [c for c in rep['perClass'] if c['label'] == 1][0]['f1']
ll = O.o_logloss(yt, [float(v) for v in ppr])

# ---- ISUAMA
is_ = IS['field']
isS = IS['stated']
iss = sonic(IS)
isXA = xof(is_, iss, LOGS + ATTRS)
isXL = xof(is_, iss, LOGS)
isXC = xof(is_, iss, LOGS + ['CALI'])
isY = [r['DT'] for r in iss]
isG = [r['well'] for r in iss]
cond = O.o_ols(isXA, isY, LOGS + ATTRS)
hc = [r for r in is_['rows'] if r['RT'] >= isS['rtCut']]
sep, _ = O.o_logistic([[r['PHIC']] for r in hc], [r['PAY'] for r in hc], l2=isS['l2'], names=['PHIC'], check_margin=False)
isXP = xof(is_, is_['rows'], isS['payFeatures'])
isP = [r['PAY'] for r in is_['rows']]
it3, it3r = O.o_logistic(isXP, isP, names=isS['payFeatures'], max_iter=isS['maxIter'], check_margin=False)
isp = O.o_group_split(isG, isS['seed'], isS['testFraction'])
oc = O.o_ols(pick(isXC, isp['trainIndices']), pick(isY, isp['trainIndices']), LOGS + ['CALI'])
pim = O.o_perm_importance(oc, pick(isXC, isp['testIndices']), pick(isY, isp['testIndices']), 'rmse', isS['nRepeats'], isS['seed'])
nphi = [im for im in pim['importances'] if im['feature'] == 'NPHI'][0]['mean']
lc = O.o_learning_curve(isXL, isY, isG, {'kind': 'ols'}, isS['counts'], isS['seed'], 'rmse', test_fraction=isS['testFraction'])
lc3 = lc['points'][isS['countIndex']]
rf = O.o_ridge(isXL, isY, isS['lambda'], LOGS)
nos = [r for r in is_['rows'] if r['DT'] is None]
pn, _ = O.o_predict_values(rf, xof(is_, nos, LOGS))

ORACLE = {
    'akpara_rhob_train_centre_g_cm3': sc['centre'][1],
    'akpara_gr_train_scale_gapi': sc['scale'][0],
    'akpara_ols_nphi_coef_us_ft_per_vv': ol['coefficients'][3],
    'akpara_ols_residual_se_us_ft': ol['residualSE'],
    'akpara_test_rmse_us_ft': am['rmse'],
    'akpara_test_r2': am['r2'],
    'oboria_ridge_gr_coef_us_ft_per_gapi': rd['coefficients'][1],
    'oboria_fold2_test_rmse_us_ft': fm['rmse'],
    'oboria_leak_optimism_rmse_us_ft': lk['optimism'],
    'oboria_logistic_rt_coef_per_ohmm': lg['coefficients'][3],
    'oboria_pay_f1': f1,
    'oboria_test_log_loss': ll['logLoss'],
    'isuama_scaled_condition_attrs': cond['scaledConditionNumber'],
    'isuama_l2_phic_coef_per_vv': sep['coefficients'][1],
    'isuama_nphi_coef_after_three_updates_per_vv': it3['coefficients'][2],
    'isuama_perm_nphi_mean_drop_us_ft': nphi,
    'isuama_lc_test_rmse_three_wells_us_ft': lc3['testScore'],
    'isuama_pred_dt_first_row_us_ft': float(pn[0]),
}
if set(ORACLE) != set(graded):
    print('REFUSED: the oracle map and fields.json name different fields')
    sys.exit(2)

bad = []
worst = 0.0
worst_tol = 0.0
for k, want in ORACLE.items():
    got, tol = graded[k]
    want = float(want)
    if PLANT and k == 'oboria_logistic_rt_coef_per_ohmm':
        got = got + 10 * tol
    rel = abs(got - want) / abs(want)
    in_tol = abs(got - want) / tol
    worst = max(worst, rel)
    worst_tol = max(worst_tol, in_tol)
    flag = 'ok' if rel <= 1e-10 and in_tol <= 1e-3 else 'DISAGREES'
    if flag != 'ok':
        bad.append(k)
    print(f'  {flag:9s} {k:46s} engine {got!r:24s} oracle {want!r:24s} rel {rel:.2e}  {in_tol:.1e} tol')

claims = [
    ('AKPARA the split holds out three wells', sp['nTestGroups'] == 3, sp['nTestGroups']),
    ('AKPARA the test R-squared is positive', am['r2'] > 0, am['r2']),
    ('OBORIA the split holds out two wells', osp['nTestGroups'] == 2, osp['nTestGroups']),
    ('OBORIA the random split flatters the attribute model', lk['optimism'] > 0, lk['optimism']),
    ('OBORIA the pay fit converged', lg['converged'], lg['converged']),
    ('ISUAMA the three-update fit stopped by maxIter', (not it3['converged']) and it3['iterations'] == 3, (it3['converged'], it3['iterations'])),
    ('ISUAMA the learning-curve point is the three-well point', lc3['nGroups'] == 3, lc3['nGroups']),
    ('ISUAMA the attribute design is below the default limit', cond.get('scaledConditionNumber', 1e99) < 1e8, cond.get('scaledConditionNumber')),
    ('ISUAMA the no-sonic well has 25 rows', len(nos) == 25, len(nos)),
]
for c, ok, v in claims:
    print(f'  {"ok" if ok else "FALSE":9s} {c}')
    if not ok:
        print(f'            {str(v)[:200]}')
        bad.append(c)
print(f'oracle_check: 18 graded fields replayed through the vendored oracle, worst relative difference '
      f'{worst:.2e}, worst in tolerances {worst_tol:.1e}; {len(claims)} scenario claims checked; {len(bad)} problem(s)')
if PLANT:
    print('NEGATIVE CONTROL: one field was perturbed by ten tolerances; this run must fail naming it.')
sys.exit(1 if bad else 0)
