#!/usr/bin/env python3
"""Generate the D2 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on tools/course-waves/dataqc/gen_course.py (D1), with the differences
D2 forces:

1. THE ENGINE IS RUN HERE. `node d2_capstone.mjs --json` is executed through the
   vendored engines/dataai/ml.js (D2_ENGINES) and the one tolerance module
   (D2_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. gen_golive.py imports this module and
   takes its engine ledger from THIS run.

2. THE DATA TRAVELS AS CASE FILES. A D2 capstone is set on a field of wells
   (168, 200 and 225 rows), which no prompt can carry readably. So
   `d2_capstone.mjs --inputs` is rendered into one CSV case file per field
   under src/content/capstone-cases/mlcore/ (the dataqc pattern: the capstone
   card offers them for download and no panel preloads them), with the header
   the explorer panels read (a `well` column, then numeric columns), the rows
   in the order the engine ran them, and the four well-level attributes joined
   onto every row. A missing sonic is written `null`, which the panels read as
   missing. A self check re-reads every case file and proves every column the
   engine ran is in it, value for value and in order.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 26) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: no P label, no AI claim, a standard deviation names
   its divisor, an R-squared names its reference mean; and the copy rule: no em
   or en dash, no "X, not Y" contrastive.

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every D2 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships.

Usage: python3 gen_course.py
   D2_WAVE        the wave directory (default /root/dai-wip-mlcore)
   D2_REPO        the nextgen clone   (default /root/wt-dai-d2-nextgen)
   D2_ENGINES     packages/engines to run the capstone through
   D2_TOLERANCE   gradedTolerance.js
   D2_COURSE_OUT  where to write the migration
   D2_CASES_OUT   where to write the case files (default $D2_REPO/src/content/capstone-cases/mlcore)
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

W = os.environ.get('D2_WAVE', '/root/dai-wip-mlcore')
REPO = os.environ.get('D2_REPO', '/root/wt-dai-d2-nextgen')
ENGINES = os.environ.get('D2_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'D2_TOLERANCE', f'{REPO}/src/components/course/panels/mlcore/gradedTolerance.js')
DATE = '20261101'
OUT = os.environ.get('D2_COURSE_OUT', f'{REPO}/migrations/{DATE}_d2_mlcore_course.sql')
CASES_OUT = os.environ.get('D2_CASES_OUT', f'{REPO}/src/content/capstone-cases/mlcore')

SLUG, MODULE, PATH_ORDER = 'mlcore', 'data_ai', 67
NAME = 'Machine Learning on Well Data'
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
ENV = dict(os.environ, D2_ENGINES=ENGINES, D2_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/d2_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/d2_capstone.mjs'))
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

AK, OB, IS = INPUTS['AKPARA'], INPUTS['OBORIA'], INPUTS['ISUAMA']
AKS, OBS, ISS = AK['stated'], OB['stated'], IS['stated']


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


# ---------------------------------------------------------------------------
# THE CASE FILES, rendered from the engine's own inputs: one per field, every
# row in the order the engine ran it, the well-level attributes joined on.
# ---------------------------------------------------------------------------
CHANNELS = ['depth', 'GR', 'RHOB', 'NPHI', 'RT', 'CALI', 'DT', 'PHIC', 'PAY']
ATTRS = ['easting', 'northing', 'kb', 'mudWeight']
HEAD = ['well', *CHANNELS, *ATTRS]


def case_text(field):
    wells = {w['id']: w for w in field['wells']}
    buf = io.StringIO()
    wr = csv.writer(buf, lineterminator='\n')
    wr.writerow(HEAD)
    for r in field['rows']:
        wr.writerow([r['well'], *[n(r[c]) for c in CHANNELS], *[n(wells[r['well']][a]) for a in ATTRS]])
    return buf.getvalue()


CASE_NAME = {'beginner': 'akpara_wells.csv', 'intermediate': 'oboria_wells.csv', 'advanced': 'isuama_wells.csv'}
FIELD_OF = {'beginner': AK['field'], 'intermediate': OB['field'], 'advanced': IS['field']}
CASES = {t: [(CASE_NAME[t], case_text(FIELD_OF[t]))] for t in TIERS}

# EVERY COLUMN THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order.
SERIES_CHECKED = 0
for t in TIERS:
    fld = FIELD_OF[t]
    rows = list(csv.DictReader(io.StringIO(CASES[t][0][1])))
    wells = {w['id']: w for w in fld['wells']}
    if [r['well'] for r in rows] != [r['well'] for r in fld['rows']]:
        bad.append(f'{CASE_NAME[t]}: the well column is not the rows the engine ran, in order')
    for c in CHANNELS:
        got = [None if r[c] == 'null' else float(r[c]) for r in rows]
        want = [None if r[c] is None else float(r[c]) for r in fld['rows']]
        if got != want:
            bad.append(f'{CASE_NAME[t]} column {c} is not the series the engine ran')
        SERIES_CHECKED += 1
    for a in ATTRS:
        got = [float(r[a]) for r in rows]
        want = [float(wells[r['well']][a]) for r in fld['rows']]
        if got != want:
            bad.append(f'{CASE_NAME[t]} column {a} is not the attribute the engine ran')
        SERIES_CHECKED += 1
    if len(fld['wells']) != len(set(r['well'] for r in fld['rows'])):
        bad.append(f'{CASE_NAME[t]}: a well without rows')

AK_NW, OB_NW, IS_NW = len(AK['field']['wells']), len(OB['field']['wells']), len(IS['field']['wells'])
AK_PER = len(AK['field']['rows']) // AK_NW
OB_PER = len(OB['field']['rows']) // OB_NW
IS_PER = len(IS['field']['rows']) // IS_NW
NOSONIC = sorted({r['well'] for r in IS['field']['rows'] if r['DT'] is None})
if NOSONIC != [f'ISUAMA-{IS_NW}']:
    bad.append(f'the Isuama no-sonic well is {NOSONIC}, and the prompt names ISUAMA-{IS_NW}')
if any(r['DT'] is None for r in AK['field']['rows'] + OB['field']['rows']):
    bad.append('an Akpara or Oboria row has no sonic, and the prompts say every well has one')

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'akpara_rhob_train_centre_g_cm3': ('The centre of RHOB fitted on the training rows', 'g/cm3'),
    'akpara_gr_train_scale_gapi': ('The scale of GR fitted on the training rows, the population standard deviation', 'gAPI'),
    'akpara_ols_nphi_coef_us_ft_per_vv': ('The NPHI coefficient of the least squares fit', 'us/ft per v/v'),
    'akpara_ols_residual_se_us_ft': ('The residual standard error of the least squares fit', 'us/ft'),
    'akpara_test_rmse_us_ft': ('The RMSE on the test wells', 'us/ft'),
    'akpara_test_r2': ('The R-squared on the test wells, about the mean of the test targets', 'dimensionless'),
    'oboria_ridge_gr_coef_us_ft_per_gapi': (f"The GR coefficient of ridge at lambda {n(OBS['lambda'])}", 'us/ft per gAPI'),
    'oboria_fold2_test_rmse_us_ft': (f"The test RMSE of fold {n(OBS['fold'])} of the k-fold by wells, folds counted from 0", 'us/ft'),
    'oboria_leak_optimism_rmse_us_ft': ('The optimism of the random-row split, in RMSE', 'us/ft'),
    'oboria_logistic_rt_coef_per_ohmm': ('The RT coefficient of the logistic fit, in log odds per ohm.m', 'per ohm.m'),
    'oboria_pay_f1': ('The F1 of pay, label 1, on the test wells', 'dimensionless'),
    'oboria_test_log_loss': ('The log loss on the test wells', 'dimensionless'),
    'isuama_scaled_condition_attrs': ('The scaled condition number of the attribute design', 'dimensionless'),
    'isuama_l2_phic_coef_per_vv': (f"The PHIC coefficient of the logistic fit at l2 {n(ISS['l2'])}", 'per v/v'),
    'isuama_nphi_coef_after_three_updates_per_vv': (f"The NPHI coefficient after maxIter {n(ISS['maxIter'])}", 'per v/v'),
    'isuama_perm_nphi_mean_drop_us_ft': ('The mean permutation drop of NPHI, in RMSE', 'us/ft'),
    'isuama_lc_test_rmse_three_wells_us_ft': ('The learning curve test RMSE at three training wells', 'us/ft'),
    'isuama_pred_dt_first_row_us_ft': (f'The predicted DT of row 0 of ISUAMA-{IS_NW}', 'us/ft'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# The stated settings, read off the capstone generator's own stated block and
# checked against what this prompt text assumes.
for what, got, want in (
        ('Akpara features', AKS['features'], ['GR', 'RHOB', 'NPHI']), ('Akpara target', AKS['target'], 'DT'),
        ('Oboria fold', OBS['fold'], 2), ('Oboria pay features', OBS['payFeatures'], ['RHOB', 'NPHI', 'RT']),
        ('Isuama pay features', ISS['payFeatures'], ['RHOB', 'NPHI', 'RT']),
        ('Isuama counts', ISS['counts'], [1, 2, 3, 4, 5, 6]), ('Isuama count index', ISS['countIndex'], 2)):
    if got != want:
        bad.append(f'{what} is {got!r}; the prompt text is written for {want!r}')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
LAYOUT = (
    "the well name, the depth in ft, GR in gAPI, RHOB in g/cm3, NPHI in v/v, RT in ohm.m, CALI in in, DT in "
    "us/ft, the core porosity PHIC in v/v and the PAY label, then the four well-level attributes, easting and "
    "northing in km, kb in m and mudWeight in ppg, each constant down its well")


def payrule(phic, rt):
    return f"PAY is 1 when PHIC is at least {n(phic)} and RT is at least {n(rt)} ohm.m, and 0 otherwise"


# The pay rules are re-derived from the rows, so a prompt cannot state a rule
# the data do not follow.
PAYRULE = {'AKPARA': (0.17, 11), 'OBORIA': (0.18, 12), 'ISUAMA': (0.17, 12)}
for fname, (pp, rr) in PAYRULE.items():
    for r in INPUTS[fname]['field']['rows']:
        if r['PAY'] != (1 if (r['PHIC'] >= pp and r['RT'] >= rr) else 0):
            bad.append(f'{fname}: a row does not follow the stated pay rule PHIC >= {pp}, RT >= {rr}')
            break

AKPARA_TEXT = (
    f"AKPARA, a field of {AK_NW} wells, AKPARA-1 to AKPARA-{AK_NW}, each logged at a one foot step. One case file "
    f"comes with this capstone. akpara_wells.csv carries {len(AK['field']['rows'])} rows, {AK_PER} a well, in well "
    f"order and in depth order within each well: {LAYOUT}. {payrule(*PAYRULE['AKPARA'])}. Every well has a sonic. "
    f"The model is least squares with an intercept, target DT, features GR, RHOB and NPHI. Split the rows by whole "
    f"wells with groupSplit at test fraction {n(AKS['testFraction'])} and seed {n(AKS['seed'])}, and fit the scaler "
    f"and the model on the training rows only.")
OBORIA_TEXT = (
    f"OBORIA, a field of {OB_NW} wells, OBORIA-1 to OBORIA-{OB_NW}, each logged at a one foot step. One case file "
    f"comes with this capstone. oboria_wells.csv carries {len(OB['field']['rows'])} rows, {OB_PER} a well, in well "
    f"order and in depth order within each well: {LAYOUT}. {payrule(*PAYRULE['OBORIA'])}. Every well has a sonic.")
ISUAMA_TEXT = (
    f"ISUAMA, a field of {IS_NW} wells, ISUAMA-1 to ISUAMA-{IS_NW}, each logged at a one foot step. One case file "
    f"comes with this capstone. isuama_wells.csv carries {len(IS['field']['rows'])} rows, {IS_PER} a well, in well "
    f"order and in depth order within each well: {LAYOUT}. {payrule(*PAYRULE['ISUAMA'])}. ISUAMA-{IS_NW} was logged "
    f"without a sonic, and its DT is written null; every other well has one.")

TIER = {
    'beginner': (
        'associate',
        f'AKPARA, {AK_NW} wells with a sonic, and a whole-well split',
        'A model and its test',
        AKPARA_TEXT + " Report six values: the centre of RHOB fitted on the training rows, in g/cm3; the scale of GR "
                      "fitted on the training rows, the population standard deviation, in gAPI; the NPHI coefficient "
                      "of the fit, in us/ft per v/v; the residual standard error of the fit, in us/ft; the RMSE on the "
                      "test wells, in us/ft; and the R-squared on the test wells, about the mean of the test targets. "
                      "All six to six decimals."),
    'intermediate': (
        'professional',
        f'OBORIA, {OB_NW} wells with a sonic, well-level attributes and a stated pay rule',
        'Validating a model',
        OBORIA_TEXT + f" Report six values. First, the GR coefficient, in us/ft per gAPI, of ridge at lambda "
                      f"{n(OBS['lambda'])}, target DT, features GR, RHOB, NPHI, easting, northing, kb and mudWeight, "
                      f"fitted on the training rows of groupSplit at test fraction {n(OBS['testFraction'])} and seed "
                      f"{n(OBS['seed'])}. Second, the test RMSE, in us/ft, of fold {n(OBS['fold'])} of groupKFold with "
                      f"k {n(OBS['k'])} and seed {n(OBS['seed'])}, folds counted from 0 as the engine numbers them: "
                      f"least squares with an intercept, target DT, features GR, RHOB and NPHI, fitted on that fold's "
                      f"training rows and scored on its test wells. Third, the optimism, in us/ft, that leakageDemo "
                      f"returns for least squares on GR, RHOB, NPHI and the four attributes, target DT, metric RMSE, at "
                      f"test fraction {n(OBS['testFraction'])} and seed {n(OBS['seed'])}. Fourth, the RT coefficient, "
                      f"in log odds per ohm.m, of logistic regression of PAY on RHOB, NPHI and RT with no penalty, "
                      f"fitted on the training wells of groupSplit over all {OB_NW} wells at test fraction "
                      f"{n(OBS['testFraction'])} and seed {n(OBS['paySeed'])}. Fifth, the F1 of pay, label 1, on that "
                      f"split's test wells, with the engine's class threshold. Sixth, the log loss on those test "
                      f"wells. All six to six decimals."),
    'advanced': (
        'expert',
        f'ISUAMA, {IS_NW} wells, one of them without a sonic',
        'When the engine refuses, stops or extrapolates',
        ISUAMA_TEXT + f" Report six values. First, the scaled condition number of least squares with an intercept, "
                      f"target DT, features GR, RHOB, NPHI, easting, northing, kb and mudWeight, over every row with a "
                      f"sonic. Second, the PHIC coefficient, per v/v, of logistic regression of PAY on PHIC alone with "
                      f"l2 {n(ISS['l2'])}, over the rows of all {IS_NW} wells with RT at or above {n(ISS['rtCut'])} "
                      f"ohm.m. Third, the NPHI coefficient, per v/v, of logistic regression of PAY on RHOB, NPHI and RT "
                      f"over all {len(IS['field']['rows'])} rows with no penalty and maxIter {n(ISS['maxIter'])}. "
                      f"Fourth, the mean drop in RMSE, in us/ft, that permutationImportance returns for NPHI with "
                      f"{n(ISS['nRepeats'])} repeats and seed {n(ISS['seed'])}, for least squares on GR, RHOB, NPHI "
                      f"and CALI, target DT, fitted on the training wells of groupSplit over the {IS_NW - 1} wells with "
                      f"a sonic at test fraction {n(ISS['testFraction'])} and seed {n(ISS['seed'])}, and scored on "
                      f"that split's test wells. Fifth, the test RMSE, in us/ft, that learningCurve returns at three "
                      f"training wells for least squares on GR, RHOB and NPHI, target DT, over the {IS_NW - 1} wells "
                      f"with a sonic, at test fraction {n(ISS['testFraction'])} and seed {n(ISS['seed'])}, with "
                      f"trainGroupCounts {', '.join(n(c) for c in ISS['counts'])}. Sixth, the DT, in us/ft, that "
                      f"ridge at lambda {n(ISS['lambda'])} on GR, RHOB and NPHI, fitted on every row with a sonic, "
                      f"predicts for row 0 of ISUAMA-{IS_NW}, its shallowest row, counting rows from 0. All six to six "
                      f"decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = f"""-- ============================================================================
-- D2: Machine Learning on Well Data joins the catalogue, the SECOND course of
-- the Data & AI module.
--
-- Catalogue row (module 'data_ai'; path_order {PATH_ORDER}, directly above D1
-- dataqc at 66; prereq_slug NULL, as D1 carries it: whether D2 requires D1 is
-- a go-live decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by
-- tools/course-waves/mlcore/gen_course.py from the ENGINE'S OWN RUN
-- (d2_capstone.mjs through the vendored engines/dataai/ml.js), which it refuses
-- to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/mlcore, because the 78 lessons, the
-- teaching lab (mlcoreLab.js), its three explorer panels and the capstone case
-- files ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A model is a rule fitted to some wells and
-- judged on wells it has never seen, so the course teaches how to split by
-- whole wells, scale on the training rows, fit least squares and read what it
-- returns (Associate), how to penalise, cross-validate by wells, catch leakage
-- and score a classifier (Professional), and when the engine refuses, stops or
-- extrapolates (Expert), and grades each tier on its own question with numbers
-- the engine returns.
--
-- THE ENGINE. engines/dataai/ml.js, vendored sha-identical with
-- petrolord-engines 966bb9e (engines #252). Scaling is fitted on the training
-- rows with the population standard deviation; splits shuffle sorted well names
-- with one seeded mulberry32 stream; least squares and ridge refuse a scaled
-- condition number above 1e8; logistic regression tests for separation before
-- any Newton step and stops when the largest full step is at most tol.
--
-- WHAT IS GRADED. AKPARA (Associate) grades a training-row centre and scale, a
-- least squares coefficient and residual standard error, and the held-out
-- wells' RMSE and R-squared; OBORIA (Professional) grades a ridge coefficient,
-- a whole-well fold, the optimism of a random-row split, a logistic
-- coefficient, the F1 of pay and a test log loss; ISUAMA (Expert) grades a
-- scaled condition number, a penalised coefficient on separated rows, a
-- coefficient after three Newton updates, a permutation importance, a
-- learning-curve point and a written-back prediction. Every value is a return
-- value of the engine, and the data it was run on is in the case file the
-- prompt names.
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


INDEX_JS = ("// The mlcore capstone case files, generated by tools/course-waves/mlcore/gen_course.py\n"
            "// from the engine's own inputs (d2_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const MLCORE_CASE_FILES = {\n'
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
for tier, pairs in (('beginner', [('testFraction', AKS['testFraction']), ('seed', AKS['seed'])]),
                    ('intermediate', [(k, OBS[k]) for k in ('testFraction', 'seed', 'lambda', 'k', 'fold', 'paySeed')]),
                    ('advanced', [(k, ISS[k]) for k in ('l2', 'rtCut', 'maxIter', 'testFraction', 'seed', 'nRepeats', 'lambda')]
                     + [(f'count {c}', c) for c in ISS['counts']])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for tier in TIERS:
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')

# THE VOCABULARY (digest section 26) AND THE COPY RULE, over every prompt,
# dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    if re.search(r'\bP(?:5|10|50|90|95)\b', text):
        out.append(f'{label} carries a P label')
    if re.search(r'\bAI\b|AI-powered|artificial intelligence', text, re.I):
        out.append(f'{label} carries an AI claim')
    for m in re.finditer(r'standard deviation', text):
        near = text[max(0, m.start() - 60):m.end() + 20]
        if not re.search(r'population|sample', near):
            out.append(f'{label} carries a standard deviation with no divisor named')
    for m in re.finditer(r'R-squared', text):
        near = text[m.end():m.end() + 80]
        if not re.search(r'about the (?:mean|training mean)', near):
            out.append(f'{label} carries an R-squared with no reference mean named')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('the P90 figure', 'P label'), ('an AI-powered model', 'AI claim'),
                    ('the standard deviation of GR', 'divisor'), ('the R-squared of the fit', 'reference'),
                    ('a split — whole', 'dash'), ('the test wells, not the training rows', 'contrastive')):
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
    open(OUT, 'w').write(SQL)
    os.makedirs(CASES_OUT, exist_ok=True)
    for tier in TIERS:
        for fname, text in CASES[tier]:
            open(f'{CASES_OUT}/{fname}', 'w').write(text)
    open(f'{CASES_OUT}/index.js', 'w').write(INDEX_JS)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print(f'wrote {CASES_OUT}: {sum(len(v) for v in CASES.values())} case files and index.js')
    print(f'engine run: 18 of 18 fields.json values equal what d2_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'case-file columns re-read and equal to the engine run: {SERIES_CHECKED}')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in prompts, labels and case files: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
