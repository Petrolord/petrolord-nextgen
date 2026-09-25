#!/usr/bin/env python3
"""Generate the D4 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on tools/course-waves/facies/gen_course.py (D3):

1. THE ENGINE IS RUN HERE. `node d4_capstone.mjs --json` is executed through the
   vendored engines/dataai/forecast.js (with engines/dca/arps.js and lib/stats,
   D4_ENGINES) and the one tolerance module (D4_TOLERANCE), and this file
   REFUSES unless fields.json carries exactly what that run returned: the same
   tier, key and value to the last bit, and the tolerance gradedTolerance.js
   derives. gen_golive.py imports this module and takes its engine ledger from
   THIS run.

2. THE DATA TRAVELS AS CASE FILES. A D4 capstone is set on a field of two
   producing wells (84, 98 and 97 monthly rates), which no prompt can carry
   readably. So `d4_capstone.mjs --inputs` is rendered into one CSV case file
   per field under src/content/capstone-cases/forecastml/ (the dataqc, mlcore
   and facies pattern: the capstone card offers them for download and no panel
   preloads them): a `well` column, the month counted from 0, and the monthly
   average oil rate in bbl/d, the rows in the order the engine ran them. The
   generator's decline inputs (qi, Di, b, noise) are NEVER written. A self
   check re-reads every case file and proves every series the engine ran is in
   it, value for value and in order.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 25) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: P90 is written with (low) and P10 with (high), a
   percentile is never "the 90th percentile", no AI claim; and the copy rule:
   no em or en dash, no "X, not Y" contrastive.

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every D4 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED.

Usage: python3 gen_course.py
   D4_WAVE        the wave directory (default /root/dai-wip-forecastml)
   D4_REPO        the nextgen clone   (default /root/wt-dai-d4-nextgen)
   D4_ENGINES     packages/engines to run the capstone through
   D4_TOLERANCE   gradedTolerance.js
   D4_COURSE_OUT  where to write the migration
   D4_CASES_OUT   where to write the case files (default $D4_REPO/src/content/capstone-cases/forecastml)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration and the case files.
"""
import csv
import io
import json
import os
import re
import subprocess
import sys

W = os.environ.get('D4_WAVE', '/root/dai-wip-forecastml')
REPO = os.environ.get('D4_REPO', '/root/wt-dai-d4-nextgen')
ENGINES = os.environ.get('D4_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'D4_TOLERANCE', f'{REPO}/src/components/course/panels/forecastml/gradedTolerance.js')
DATE = '20261103'
OUT = os.environ.get('D4_COURSE_OUT', f'{REPO}/migrations/{DATE}_d4_forecastml_course.sql')
CASES_OUT = os.environ.get('D4_CASES_OUT', f'{REPO}/src/content/capstone-cases/forecastml')

SLUG, MODULE, PATH_ORDER = 'forecastml', 'data_ai', 69
NAME = 'Data-Driven Production Forecasting'
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
bad = []

for what, got, want in (('slug', wave['slug'], SLUG), ('module', wave['module'], MODULE),
                        ('pathOrder', wave['pathOrder'], PATH_ORDER), ('name', wave['name'], NAME),
                        ('prerequisite', wave['prerequisite'], None)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# THE ENGINE RUN, through the vendored engine the committed tree carries.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, D4_ENGINES=ENGINES, D4_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/d4_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/d4_capstone.mjs'))
TOLS = json.loads(node('--input-type=module', '-e',
                       'const M = await import(%s); console.log(JSON.stringify(Object.fromEntries('
                       'M.GRADED_FIELDS.map(([, k]) => [k, M.gradedTolerance(k)]))));' % json.dumps(TOLPATH)))

ENGINE = {(r['tier'], r['key']): r['value'] for r in ENGINE_ROWS}
if len(ENGINE_ROWS) != 18 or len(fields) != 18:
    bad.append(f'the engine returned {len(ENGINE_ROWS)} rows and fields.json carries {len(fields)}; expected 18 and 18')
for (t, k, v, tol), r in zip(fields, ENGINE_ROWS):
    if (t, k) != (r['tier'], r['key']):
        bad.append(f'fields.json row {t}/{k} sits where the engine returned {r["tier"]}/{r["key"]}')
    elif v != r['value'] or type(v) is not float:
        bad.append(f'{t}/{k}: fields.json says {v!r} and the engine returned {r["value"]!r}')
    if tol != TOLS.get(k):
        bad.append(f'{t}/{k}: fields.json grades at {tol!r} and gradedTolerance.js derives {TOLS.get(k)!r}')
KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
if len(set(KEYS)) != 18:
    bad.append('two graded fields share a key')

AG, NK, UM = INPUTS['AGULU'], INPUTS['NANKA'], INPUTS['UMUNZE']
AGS, NKS, UMS = AG['stated'], NK['stated'], UM['stated']


def n(x):
    """A number as the case file and the prompt write it: the shortest decimal
    that reads back to the value the engine ran, a whole number without a point."""
    if x is None:
        return 'null'
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    if 'e' in s or float(s) != x:
        sys.exit(f'REFUSED: {x!r} does not print as a plain decimal that reads back to itself')
    return s


def series(fld, wid):
    return next(w['rate'] for w in fld['field']['wells'] if w['well'] == wid)


def spec(fld, wid):
    return next(w['spec'] for w in fld['field']['wells'] if w['well'] == wid)


# ---------------------------------------------------------------------------
# THE CASE FILES, rendered from the engine's own inputs: one per field, every
# month of every well in the order the engine ran it. The generator's decline
# inputs are never written.
# ---------------------------------------------------------------------------
HEAD = ['well', 'month', 'rate_bopd']


def case_text(fld):
    buf = io.StringIO()
    wr = csv.writer(buf, lineterminator='\n')
    wr.writerow(HEAD)
    for w in fld['field']['wells']:
        for t, v in enumerate(w['rate']):
            wr.writerow([w['well'], t, n(v)])
    return buf.getvalue()


CASE_NAME = {'beginner': 'agulu_rates.csv', 'intermediate': 'nanka_rates.csv', 'advanced': 'umunze_rates.csv'}
FIELD_OF = {'beginner': AG, 'intermediate': NK, 'advanced': UM}
CASES = {t: [(CASE_NAME[t], case_text(FIELD_OF[t]))] for t in TIERS}

# EVERY SERIES THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order.
SERIES_CHECKED = 0
for t in TIERS:
    fld = FIELD_OF[t]
    rows = list(csv.DictReader(io.StringIO(CASES[t][0][1])))
    for w in fld['field']['wells']:
        got = [(int(r['month']), float(r['rate_bopd'])) for r in rows if r['well'] == w['well']]
        want = [(i, float(v)) for i, v in enumerate(w['rate'])]
        if got != want:
            bad.append(f'{CASE_NAME[t]}: {w["well"]} is not the series the engine ran')
        SERIES_CHECKED += 1
    if len(rows) != sum(len(w['rate']) for w in fld['field']['wells']):
        bad.append(f'{CASE_NAME[t]}: a row that no well the engine ran carries')
    if [r['well'] for r in rows] != [w['well'] for w in fld['field']['wells'] for _ in w['rate']]:
        bad.append(f'{CASE_NAME[t]}: the rows are not in well order and month order')
# THE GENERATOR'S DECLINE INPUTS NEVER TRAVEL: no case file or prompt carries a
# qi, Di, b or noise figure (checked on the prompts below).
SPEC_NUMS = {float(w['spec'][k]) for fld in (AG, NK, UM) for w in fld['field']['wells'] for k in ('qi', 'Di', 'b', 'noise')}

AG1, AG2 = series(AG, 'AGULU-1'), series(AG, 'AGULU-2')
NK1, NK2 = series(NK, 'NANKA-1'), series(NK, 'NANKA-2')
UM1, UM2 = series(UM, 'UMUNZE-1'), series(UM, 'UMUNZE-2')
NK1_SHUT, UM2_SHUT = spec(NK, 'NANKA-1')['shutIn'], spec(UM, 'UMUNZE-2')['shutIn']
for wid, y, sh in (('NANKA-1', NK1, NK1_SHUT), ('UMUNZE-2', UM2, UM2_SHUT)):
    zeros = [i for i, v in enumerate(y) if v == 0]
    if zeros != list(range(sh[0], sh[1] + 1)):
        bad.append(f'{wid} holds 0 at months {zeros}, and the prompt names {sh[0]} to {sh[1]}')
for wid, y in (('AGULU-1', AG1), ('AGULU-2', AG2), ('NANKA-2', NK2), ('UMUNZE-1', UM1)):
    if any(v == 0 for v in y):
        bad.append(f'{wid} holds a 0, and the prompt says only the named shut-ins do')
if NKS['train'] + NKS['h'] != len(NK1):
    bad.append('the Nanka hold-out does not end at the last month of NANKA-1, as the prompt says')

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LAST_TRAIN = NKS['train'] - 1
HOLD = f"months {n(NKS['train'])} to {n(NKS['train'] + NKS['h'] - 1)}"
LABELS = {
    'agulu2_ses_alpha': ('The alpha simple exponential smoothing fits on AGULU-2', 'dimensionless'),
    'agulu1_holt_fixed_mse_bopd2': (f"The MSE of holt on AGULU-1 with alpha {n(AGS['alpha'])} and beta {n(AGS['beta'])} given", '(bbl/d)^2'),
    'agulu1_holt_beta': ('The beta holt fits on AGULU-1, alpha and beta left free', 'dimensionless'),
    'agulu1_holt_forecast_h12_bopd': (f"The fitted holt forecast of AGULU-1 at step {n(AGS['hHolt'])}", 'bbl/d'),
    'agulu1_damped_phi': ('The phi the damped trend fits on AGULU-1, every parameter left free', 'dimensionless'),
    'agulu1_damped_forecast_h24_bopd': (f"The fitted damped forecast of AGULU-1 at step {n(AGS['hDamped'])}", 'bbl/d'),
    'nanka1_holdout_damped_smape_pct': (f'The sMAPE of the damped forecast of NANKA-1 over {HOLD}', 'percent'),
    'nanka1_holdout_damped_mase': ('The MASE of that forecast, m 1', 'dimensionless'),
    'nanka1_holdout_damped_me_bopd': ('The mean error of that forecast', 'bbl/d'),
    'nanka2_backtest_holt_rmse_bopd': ('The pooled RMSE of the refitted holt backtest of NANKA-2', 'bbl/d'),
    'nanka2_backtest_holt_held_mase': ('The pooled MASE of the same backtest with refit false', 'dimensionless'),
    'nanka2_backtest_holt_step6_mae_bopd': (f"The MAE at step {n(NKS['horizon'])} of the refitted backtest", 'bbl/d'),
    'umunze1_damped_p90_h12_bopd': (f"The P90 (low) at step {n(UMS['h'])} of the damped bootstrap of UMUNZE-1", 'bbl/d'),
    'umunze1_damped_p10_h12_bopd': (f"The P10 (high) at step {n(UMS['h'])} of the same bootstrap", 'bbl/d'),
    'umunze1_damped_p50_h6_bopd': ('The P50 at step 6 of the same bootstrap', 'bbl/d'),
    'umunze1_arps_di_per_month': ('The Arps Di of UMUNZE-1, Auto-Select', 'per month'),
    'umunze2_compare_arps_mase': ('The MASE of the arps row in the comparison on UMUNZE-2', 'dimensionless'),
    'umunze2_compare_best_mase': ('The MASE of the method the comparison ranks first', 'dimensionless'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')
P50_STEP = 6  # the step of the graded P50, read by d4_capstone.mjs as P50[5]
if not re.search(r'P50\[5\]', open(f'{W}/d4_capstone.mjs', encoding='utf-8').read()):
    bad.append('d4_capstone.mjs no longer grades the P50 at step 6, which the prompt states')

N_SIMS_DEFAULT = int(node('--input-type=module', '-e',
                          'const F = await import(%s); console.log(F.DEFAULTS.N_SIMS);'
                          % json.dumps(f'{ENGINES}/engines/dataai/forecast.js')).strip())
if N_SIMS_DEFAULT != UMS['nSims']:
    bad.append(f'the stated nSims {UMS["nSims"]} is not the engine default {N_SIMS_DEFAULT}; the prompt says both')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
LAYOUT = 'the well name, the month counted from 0, and the monthly average oil rate in bbl/d'


def field_text(name, fld, fname, extra):
    ws = fld['field']['wells']
    lens = [len(w['rate']) for w in ws]
    total = sum(lens)
    per = (f'{n(lens[0])} months each' if len(set(lens)) == 1
           else ' and '.join(f"{n(len(w['rate']))} months of {w['well']}" for w in ws))
    return (f"{name}, a field of {len(ws)} producing wells, {' and '.join(w['well'] for w in ws)}, with {per} "
            f"of monthly average oil rate in bbl/d, oldest month first. One case file comes with this capstone. "
            f"{fname} carries {n(total)} rows, in well order and in month order within each well: {LAYOUT}. "
            f"{extra}")


AGULU_TEXT = field_text('AGULU', AG, CASE_NAME['beginner'], 'No month is missing and no month is 0.')
NANKA_TEXT = field_text(
    'NANKA', NK, CASE_NAME['intermediate'],
    f"NANKA-1 was shut in for months {n(NK1_SHUT[0])} and {n(NK1_SHUT[1])}, at rate 0; no other month is missing or 0.")
UMUNZE_TEXT = field_text(
    'UMUNZE', UM, CASE_NAME['advanced'],
    f"UMUNZE-2 was shut in for months {n(UM2_SHUT[0])} to {n(UM2_SHUT[1])}, at rate 0, and restarted after a "
    f"workover; no other month is missing or 0.")

TIER = {
    'beginner': (
        'associate',
        f"AGULU, {len(AG['field']['wells'])} producing wells, {n(len(AG1))} months each",
        'Smoothing a rate series into a forecast',
        AGULU_TEXT + f" Fit on every month of the well named, with only the parameters stated here given. Report six "
                     f"values: the alpha that simple exponential smoothing fits on AGULU-2; the MSE, in (bbl/d)^2, of "
                     f"Holt's linear trend on AGULU-1 with alpha {n(AGS['alpha'])} and beta {n(AGS['beta'])} given; "
                     f"the beta that Holt's linear trend fits on AGULU-1 with alpha and beta both left free; that "
                     f"fitted Holt forecast at step {n(AGS['hHolt'])}, in bbl/d; the phi that the damped trend fits "
                     f"on AGULU-1 with alpha, beta and phi all left free; and that fitted damped forecast at step "
                     f"{n(AGS['hDamped'])}, in bbl/d. All six to six decimals."),
    'intermediate': (
        'professional',
        f"NANKA, {len(NK['field']['wells'])} producing wells, one shut in",
        'Testing a forecast honestly',
        NANKA_TEXT + f" Report six values. First, the sMAPE, in percent, of the damped trend fitted on NANKA-1 "
                     f"months 0 to {n(LAST_TRAIN)}, every parameter left free, forecasting {n(NKS['h'])} steps and "
                     f"scored against {HOLD}. Second, the MASE of the same forecast with months 0 to {n(LAST_TRAIN)} "
                     f"as the in-sample series and m 1. Third, its mean error, actual minus forecast, in bbl/d. "
                     f"Fourth, the pooled RMSE, in bbl/d, of a rolling-origin backtest of Holt's linear trend on "
                     f"NANKA-2 from first origin {n(NKS['firstOrigin'])}, horizon {n(NKS['horizon'])}, step "
                     f"{n(NKS['step'])}, refitted at every origin, m 1. Fifth, the pooled MASE of the same backtest "
                     f"with refit false, the parameters held from the first window. Sixth, the MAE, in bbl/d, at step "
                     f"{n(NKS['horizon'])} ahead of the refitted backtest. All six to six decimals."),
    'advanced': (
        'expert',
        f"UMUNZE, {len(UM['field']['wells'])} producing wells, one shut in and restarted",
        'Uncertainty, the Arps baseline and the engine\'s rules',
        UMUNZE_TEXT + f" Report six values. First, the P90 (low) at step {n(UMS['h'])} of the residual bootstrap of "
                      f"the damped trend fitted on all of UMUNZE-1, every parameter left free, h {n(UMS['h'])}, "
                      f"{n(UMS['nSims'])} paths, seed {n(UMS['seed'])}, nonNegative true. Second, the P10 (high) at "
                      f"step {n(UMS['h'])} of the same run. Third, the P50 at step {n(P50_STEP)} of the same run. "
                      f"Fourth, the Di, per month, of the Arps baseline fitted on all of UMUNZE-1 with the model "
                      f"Auto-Select. Fifth and sixth, from a comparison of ses, holt and damped with the Arps baseline "
                      f"on UMUNZE-2, first origin {n(UMS['firstOrigin'])}, horizon {n(UMS['horizon'])}, step "
                      f"{n(UMS['step'])}, refit true, m 1, the Arps model Auto-Select, ranked by MASE: the MASE of "
                      f"the arps row, and the MASE of the method the ranking puts first. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = f"""-- ============================================================================
-- D4: Data-Driven Production Forecasting joins the catalogue, the FOURTH
-- course of the Data & AI module.
--
-- Catalogue row (module 'data_ai'; path_order {PATH_ORDER}, directly above D3
-- facies at 68; prereq_slug NULL, as D1, D2 and D3 carry it: whether D4
-- requires an earlier course is a go-live decision; school left at its
-- default) plus the three capstones and their eighteen graded fields,
-- generated by tools/course-waves/forecastml/gen_course.py from the ENGINE'S
-- OWN RUN (d4_capstone.mjs through the vendored engines/dataai/forecast.js and
-- engines/dca/arps.js), which it refuses to write unless fields.json carries
-- exactly that run's values and the tolerance gradedTolerance.js derives. Deep
-- seeds are three separate migrations; the go-live is a fifth and is HELD
-- until a NextGen production upload carries the route
-- /dashboard/apps/forecastml, because the 78 lessons, the teaching lab
-- (forecastLab.js), its three explorer panels and the capstone case files ship
-- in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A data-driven forecast extends a rate series
-- from its own history, and it is worth something only when it is tested on
-- months it never saw, so the course teaches smoothing a rate series into a
-- forecast (Associate), testing a forecast honestly (Professional), and
-- uncertainty, the Arps baseline and the engine's rules (Expert), and grades
-- each tier on its own question with numbers the engine returns.
--
-- THE ENGINE. engines/dataai/forecast.js, vendored sha-identical with
-- petrolord-engines 1dfdd60, with engines/dca/arps.js for the Arps baseline
-- and lib/stats for mulberry32 and the quantile. Simple, Holt and damped
-- exponential smoothing start at the first observation and fit by the least
-- one-step SSE (a grid, then a compass search, phi fitted in 0.8 to 0.98); an
-- error is actual minus forecast; MASE divides by the in-sample lag-m naive
-- MAE of the training months; the residual bootstrap draws the scored
-- residuals without centring on one mulberry32 stream; P90 is the low case.
--
-- WHAT IS GRADED. AGULU (Associate) grades a fitted ses alpha, a Holt MSE with
-- its parameters given, a fitted Holt beta and forecast, and a fitted damped
-- phi and forecast; NANKA (Professional) grades a hold-out sMAPE, MASE and
-- mean error through a shut-in, a refitted backtest's pooled RMSE, the held
-- backtest's pooled MASE and a by-horizon MAE; UMUNZE (Expert) grades a
-- bootstrap P90 (low), P10 (high) and P50, an Arps Di per month, and a
-- comparison's arps MASE and best MASE. Every value is a return value of the
-- engine, and the data it was run on is in the case file the prompt names.
--
-- All eighteen graded values were swept against every number the digest
-- prints and against every number handed to a learner in a prompt, a label or
-- a case file, at each field's own shipped tolerance: 0 collisions, and 0
-- pairwise. No prompt states another tier's graded value.
-- ============================================================================"""

lines = [HEADER, '',
         'insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)',
         f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title, prompt = TIER[tier]
    fl = [f for f in fields if f[0] == tier]
    if len(fl) != 6:
        bad.append(f'{tier} has {len(fl)} fields')
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[k][0])},"
        f" 'unit',{q(LABELS[k][1])}, 'expected',{repr(v)}, 'tol',{repr(tol)})"
        for _t, k, v, tol in fl)
    blocks.append(f"(\n  {q(SLUG)}, {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
SQL = '\n'.join(lines) + '\n'


def ident(fname):
    return re.sub(r'[^a-z0-9]', '_', fname[:-4])


INDEX_JS = ("// The forecastml capstone case files, generated by tools/course-waves/forecastml/gen_course.py\n"
            "// from the engine's own inputs (d4_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const FORECASTML_CASE_FILES = {\n'
for tier in TIERS:
    INDEX_JS += f'  {tier}: [\n'
    for fname, _ in CASES[tier]:
        INDEX_JS += f"    {{ name: '{fname}', text: {ident(fname)} }},\n"
    INDEX_JS += '  ],\n'
INDEX_JS += '};\n'

# --------------------------------------------------------------- self checks
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')

# EVERY SCALAR THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, and every case
# file is named in it.
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
for tier, pairs in (('beginner', [(k, AGS[k]) for k in ('alpha', 'beta', 'hHolt', 'hDamped')] + [('months', len(AG1))]),
                    ('intermediate', [(k, NKS[k]) for k in ('h', 'firstOrigin', 'horizon', 'step')]
                     + [('last training month', LAST_TRAIN), ('shut-in', NK1_SHUT[0]), ('shut-in end', NK1_SHUT[1])]),
                    ('advanced', [(k, UMS[k]) for k in ('h', 'nSims', 'seed', 'firstOrigin', 'horizon', 'step')]
                     + [('P50 step', P50_STEP), ('shut-in', UM2_SHUT[0]), ('shut-in end', UM2_SHUT[1])])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for tier in TIERS:
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')
    for w in FIELD_OF[tier]['field']['wells']:
        if w['well'] not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not name {w["well"]}')

# THE VOCABULARY AND THE COPY RULE, over every prompt, dataset, title and label.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    for m in re.finditer(r'\bP(90|10)\b', text):
        want = '(low)' if m.group(1) == '90' else '(high)'
        if not text[m.end():m.end() + 7].startswith(' ' + want):
            out.append(f'{label} carries a P{m.group(1)} without {want}')
    if re.search(r'\b\d+(?:st|nd|rd|th) percentile', text):
        out.append(f'{label} names a percentile by its ordinal')
    if re.search(r'\bAI\b|AI-powered|artificial intelligence', text, re.I):
        out.append(f'{label} carries an AI claim')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('the P90 figure', 'P label'), ('the 90th percentile of the paths', 'ordinal'),
                    ('an AI-powered model', 'AI claim'),
                    ('a split — whole', 'dash'), ('the test months, not the training months', 'contrastive')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')

for tier in TIERS:
    if PROMPTS[tier].count('Report six values') != 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')

# NUMBERS HANDED TO A LEARNER: every prompt, dataset, title, label and case
# file, against every graded value of EVERY tier, at the shipped tolerance.
NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall(PROMPTS[t])]
handed += [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall(TIER[t][1] + ' ' + TIER[t][2])]
handed += [(TIER_OF[k], abs(float(tok))) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]))]
handed += [(t, abs(float(tok))) for t in TIERS for _f, text in CASES[t] for tok in NUM.findall(text)]
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} capstone text or case files')
for a in range(len(fields)):
    for b in range(a + 1, len(fields)):
        if abs(abs(fields[a][2]) - abs(fields[b][2])) <= max(fields[a][3], fields[b][3]):
            bad.append(f'pairwise: {fields[a][1]} and {fields[b][1]}')
# The generator's decline inputs are never handed in a prompt, label or title
# (0 and 1 aside, and a stated setting that coincides with one, such as alpha 0.4).
PROMPT_NUMS = {abs(float(tok)) for t in TIERS for tok in NUM.findall(PROMPTS[t] + TIER[t][1] + TIER[t][2])}
PROMPT_NUMS |= {abs(float(tok)) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]))}
STATED_NUMS = {abs(float(v)) for st in (AGS, NKS, UMS) for v in st.values()}
leak = sorted(x for x in SPEC_NUMS & PROMPT_NUMS if x not in (0.0, 1.0) and x not in STATED_NUMS)
if leak:
    bad.append(f'a generator decline input is handed in a prompt or label: {leak}')

# EVERY NUMBER THE DIGEST PRINTS.
DIGEST_NUMS = sorted({abs(float(tok)) for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read())})
if len(DIGEST_NUMS) < 300:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST ASK FOR EXACTLY THE DECIMALS ITS FIELDS ARE GRADED TO.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', PROMPTS[tier]) if w in WORD_N})
    needed = set()
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes')
            continue
        dp = precision[cls[0]]['decimals']
        needed.add(dp)
        if tol < 0.5 * 10 ** -dp * (1 - 1e-12):
            bad.append(f'{tier}.{key} is graded at {tol}, below the half unit of the {dp} decimals its class prints')
    if asked != sorted(needed):
        bad.append(f'{tier} prompt asks for {asked} decimals and its fields are graded to {sorted(needed)}')

RENDERED = SQL

if __name__ == '__main__':
    if bad:
        for b in bad:
            print('  REFUSED:', b)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(SQL)
    os.makedirs(CASES_OUT, exist_ok=True)
    for tier in TIERS:
        for fname, text in CASES[tier]:
            open(f'{CASES_OUT}/{fname}', 'w').write(text)
    open(f'{CASES_OUT}/index.js', 'w').write(INDEX_JS)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print(f'wrote {CASES_OUT}: {sum(len(v) for v in CASES.values())} case files and index.js')
    print(f'engine run: 18 of 18 fields.json values equal what d4_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'case-file series re-read and equal to the engine run: {SERIES_CHECKED}')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in prompts, labels and case files: {len(handed)}')
    print('handed + pairwise + digest collisions + decline inputs + precision + vocabulary + copy rule: 0')
