#!/usr/bin/env python3
"""Generate the D1 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no condition and no data point is
retyped.

Modelled on tools/course-waves/safetystats/gen_course.py (H1), with the
differences D1 forces:

1. THE ENGINE IS RUN HERE. `node d1_capstone.mjs --json` is executed through the
   vendored engines/dataai/quality.js (D1_ENGINES) and the one tolerance module
   (D1_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. gen_golive.py imports this module and
   takes its engine ledger from THIS run.

2. THE DATA TRAVELS AS CASE FILES. A D1 capstone is set on whole series (a
   180-entry log, a 49-entry SCADA index, 60 days of production, 17 plugs, an
   80-sample interval, a 36-row cloud, 66 days of pressure), which no prompt can
   carry readably. So `d1_capstone.mjs --inputs` is rendered into CSV case
   files under src/content/capstone-cases/dataqc/ (the welltest pattern: the
   capstone card offers them for download and no panel preloads them), and the
   prompt names each file and states every scalar the engine ran with. A self
   check re-reads every case file and proves every series the engine ran is in
   it, value for value and in order, so a file cannot drift from what was
   graded. A missing value is written `null`, which the panels read as missing,
   and the log's LAS sentinel -999.25 is left in place, as delivered.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 32) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: no P label, no AI claim, sigma always with its
   source named; and the copy rule: no em or en dash, no "X, not Y" contrastive.

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every D1 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships.

Usage: python3 gen_course.py
   D1_WAVE        the wave directory (default /root/dai-wip-dataqc)
   D1_REPO        the nextgen clone   (default /root/wt-dai-d1-nextgen)
   D1_ENGINES     packages/engines to run the capstone through
   D1_TOLERANCE   gradedTolerance.js
   D1_COURSE_OUT  where to write the migration
   D1_CASES_OUT   where to write the case files (default $D1_REPO/src/content/capstone-cases/dataqc)
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

W = os.environ.get('D1_WAVE', '/root/dai-wip-dataqc')
REPO = os.environ.get('D1_REPO', '/root/wt-dai-d1-nextgen')
ENGINES = os.environ.get('D1_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'D1_TOLERANCE', f'{REPO}/src/components/course/panels/dataqc/gradedTolerance.js')
DATE = '20261031'
OUT = os.environ.get('D1_COURSE_OUT', f'{REPO}/migrations/{DATE}_d1_dataqc_course.sql')
CASES_OUT = os.environ.get('D1_CASES_OUT', f'{REPO}/src/content/capstone-cases/dataqc')

SLUG, MODULE, PATH_ORDER = 'dataqc', 'data_ai', 66
NAME = 'Oilfield Data Quality'
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
ENV = dict(os.environ, D1_ENGINES=ENGINES, D1_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/d1_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/d1_capstone.mjs'))
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

OD, IK, AM = INPUTS['ODUDU'], INPUTS['IKORO'], INPUTS['AMASIRI']


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


def words(k):
    return {3: 'three', 2: 'two', 6: 'six'}[k]


# ---------------------------------------------------------------------------
# THE CASE FILES, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
def table(head, rows):
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator='\n')
    w.writerow(head)
    for r in rows:
        w.writerow([n(x) for x in r])
    return buf.getvalue()


lg, pr = OD['log'], OD['production']
CASES = {
    'beginner': [
        ('odudu2_log.csv', table(['entry', 'depth_ft', 'rhob_g_cm3', 'nphi_v_v'],
                                 [(i, d, r, p) for i, (d, r, p) in enumerate(zip(lg['depth'], lg['rhob'], lg['nphi']))])),
        ('odudu2_scada_index.csv', table(['entry', 'time_min'], list(enumerate(OD['scada']['minutes'])))),
        ('odudu2_production.csv', table(['day', 'oil_bbl_d', 'water_bbl_d', 'gross_bbl_d', 'water_cut_v_v', 'cum_oil_bbl'],
                                        [(d + 1, pr['oil'][d], pr['water'][d], pr['gross'][d], pr['waterCut'][d], pr['cumOil'][d])
                                         for d in range(len(pr['oil']))])),
    ],
    'intermediate': [
        ('ikoro5_core_porosity.csv', table(['entry', 'porosity_v_v'], list(enumerate(IK['core'])))),
        ('ikoro5_density.csv', table(['entry', 'rhob_g_cm3'], list(enumerate(IK['rhob'])))),
        ('ikoro5_density_neutron.csv', table(['row', 'rhob_g_cm3', 'nphi_v_v'], [(i, a, b) for i, (a, b) in enumerate(IK['cloud'])])),
    ],
    'advanced': [
        ('amasiri1_phase_one.csv', table(['day', 'pressure_psig'], [(d + 1, v) for d, v in enumerate(AM['phase1'])])),
        ('amasiri1_phase_two.csv', table(['day', 'pressure_psig'], [(d + 1, v) for d, v in enumerate(AM['phase2'])])),
    ],
}


def column(text, name):
    rows = list(csv.DictReader(io.StringIO(text)))
    return [None if r[name] == 'null' else float(r[name]) for r in rows]


# EVERY SERIES THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order.
FILE = {t: dict(files) for t, files in CASES.items()}
for tier, fname, col, want in (
        ('beginner', 'odudu2_log.csv', 'depth_ft', lg['depth']), ('beginner', 'odudu2_log.csv', 'rhob_g_cm3', lg['rhob']),
        ('beginner', 'odudu2_log.csv', 'nphi_v_v', lg['nphi']),
        ('beginner', 'odudu2_scada_index.csv', 'time_min', OD['scada']['minutes']),
        ('beginner', 'odudu2_production.csv', 'oil_bbl_d', pr['oil']), ('beginner', 'odudu2_production.csv', 'water_bbl_d', pr['water']),
        ('beginner', 'odudu2_production.csv', 'gross_bbl_d', pr['gross']),
        ('beginner', 'odudu2_production.csv', 'water_cut_v_v', pr['waterCut']),
        ('beginner', 'odudu2_production.csv', 'cum_oil_bbl', pr['cumOil']),
        ('intermediate', 'ikoro5_core_porosity.csv', 'porosity_v_v', IK['core']),
        ('intermediate', 'ikoro5_density.csv', 'rhob_g_cm3', IK['rhob']),
        ('intermediate', 'ikoro5_density_neutron.csv', 'rhob_g_cm3', [r[0] for r in IK['cloud']]),
        ('intermediate', 'ikoro5_density_neutron.csv', 'nphi_v_v', [r[1] for r in IK['cloud']]),
        ('advanced', 'amasiri1_phase_one.csv', 'pressure_psig', AM['phase1']),
        ('advanced', 'amasiri1_phase_two.csv', 'pressure_psig', AM['phase2'])):
    got = column(FILE[tier][fname], col)
    if got != [None if v is None else float(v) for v in want]:
        bad.append(f'{fname} column {col} is not the series the engine ran')
SERIES_CHECKED = 15

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'odudu_rhob_completeness': ('The completeness of the density column as delivered, present over n', 'fraction'),
    'odudu_nphi_coverage': (f"The coverage of {n(lg['coverageStart'])} to {n(lg['coverageEnd'])} ft by the neutron column at a maxStep of {n(lg['maxStep'])} ft", 'fraction'),
    'odudu_scada_expected_step_min': ('The expected step the index check infers for the SCADA time index', 'minutes'),
    'odudu_water_cut_day23': ('The liquid-basis water cut computed from the rates for day 23', 'fraction'),
    'odudu_cumulative_drop_bbl': ('The drop the cumulative check reports', 'bbl'),
    'odudu_phase_sum_allowed_day44_bbl_d': ('The allowed difference on the day the phase-sum check flags', 'bbl/d'),
    'ikoro_core_max_abs_z': ('The largest |z| among the core plugs, with the sample standard deviation', 'dimensionless'),
    'ikoro_core_max_abs_modified_z': ('The largest |modified z| among the core plugs', 'dimensionless'),
    'ikoro_rhob_upper_fence_g_cm3': ('The upper Tukey fence of the density interval at the defaults', 'g/cm3'),
    'ikoro_rhob_hampel_threshold_entry57_g_cm3': ('The Hampel threshold at entry 57 of the density interval', 'g/cm3'),
    'ikoro_core_grubbs_critical': (f"The two-sided Grubbs critical value for the core plugs at alpha {n(IK['alpha'])}", 'dimensionless'),
    'ikoro_max_mahalanobis_d2': ('The largest squared Mahalanobis distance in the density-neutron cloud', 'dimensionless'),
    'amasiri_phase1_individuals_ucl_psig': ('The phase one individuals chart upper limit', 'psig'),
    'amasiri_phase1_mr_ucl_psig': ('The phase one moving range chart upper limit', 'psi'),
    'amasiri_ewma_day14_psig': ('The EWMA on day 14 of phase two', 'psig'),
    'amasiri_ewma_exact_ucl_day2_psig': ('The exact EWMA upper limit on day 2 of phase two', 'psig'),
    'amasiri_cusum_upper_day18_psi': ('The upper CUSUM, S_hi, on day 18 of phase two', 'psi'),
    'amasiri_scorecard_total': ('The scorecard total at the stated weights', 'score'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
DIMS = AM['scorecard']['dimensions']
WTS = AM['scorecard']['weights']
dims_text = ', '.join(f"{d['name']} {d['failed']} failed of {d['checked']} checked" for d in DIMS[:-1]) \
    + f", and {DIMS[-1]['name']} {DIMS[-1]['failed']} failed of {DIMS[-1]['checked']} checked"
wts_text = ', '.join(n(WTS[d['name']]) for d in DIMS[:-1]) + f" and {n(WTS[DIMS[-1]['name']])}"

ODUDU_TEXT = (
    f"ODUDU-2, a development well, and the data delivered with it. Three case files come with this "
    f"capstone. odudu2_log.csv carries {len(lg['depth'])} entries of a density and neutron log at a "
    f"half-foot step, counted from entry 0, with the depth in feet; a missing sample is written null, "
    f"and the file is left exactly as it was delivered. odudu2_scada_index.csv carries "
    f"{len(OD['scada']['minutes'])} entries of a SCADA time index in minutes, counted from entry 0. "
    f"odudu2_production.csv carries {len(pr['oil'])} days of production, day 1 to day {len(pr['oil'])}: "
    f"oil, water and the gross liquid total in bbl/d, the water cut as reported, and the cumulative oil "
    f"in bbl, with a lost reading written null. Work at the engine's defaults unless a setting is stated.")
IKORO_TEXT = (
    f"IKORO-5, a cored appraisal well. Three case files come with this capstone. "
    f"ikoro5_core_porosity.csv carries {len(IK['core'])} core plug porosities in v/v, counted from "
    f"entry 0. ikoro5_density.csv carries a {len(IK['rhob'])}-sample bulk density interval in g/cm3, "
    f"counted from entry 0, with a missing sample written null. ikoro5_density_neutron.csv carries "
    f"{len(IK['cloud'])} rows of bulk density and neutron porosity from one sand. Work at the engine's "
    f"defaults unless a setting is stated.")
AMASIRI_TEXT = (
    f"AMASIRI-1, a gas well whose casing pressure is read daily. Two case files come with this "
    f"capstone. amasiri1_phase_one.csv carries {len(AM['phase1'])} in-control days of casing pressure in "
    f"psig. amasiri1_phase_two.csv carries {len(AM['phase2'])} monitored days, day 1 to day "
    f"{len(AM['phase2'])}. Chart phase one on an individuals and moving range chart from its own "
    f"averages, and take phase two's target and sigma from it: the phase one centre as the target, and "
    f"sigma as MRbar / 1.128 from the phase one moving ranges. Run phase two on an EWMA chart with lambda "
    f"{n(AM['lambda'])} and L {n(AM['L'])}, and on a tabular CUSUM with k {n(AM['k'])} and h {n(AM['h'])} "
    f"in sigma units. The well's data sheet was scored on five dimensions: {dims_text}, weighted "
    f"{wts_text} in that order.")

TIER = {
    'beginner': (
        'associate',
        'ODUDU-2, a density and neutron log, a SCADA time index and sixty days of production, as delivered',
        'Whether the data are fit to use',
        ODUDU_TEXT + f" Report six values: the completeness of the density column as delivered; the "
                     f"coverage of the interval {n(lg['coverageStart'])} to {n(lg['coverageEnd'])} ft by "
                     f"the neutron column, at a maxStep of {n(lg['maxStep'])} ft; the expected step the "
                     f"index check infers for the SCADA time index, in minutes; the liquid-basis water cut "
                     f"computed from the rates for day 23; the drop the cumulative check reports, in bbl; "
                     f"and the allowed difference, in bbl/d, on the day the phase-sum check flags. All six "
                     f"to six decimals."),
    'intermediate': (
        'professional',
        'IKORO-5, core plug porosities, a bulk density interval and a density-neutron cloud',
        'Which values stand apart, and by which measure',
        IKORO_TEXT + f" Report six values: the largest |z| among the core plugs, with the sample standard "
                     f"deviation; the largest |modified z| among the core plugs; the upper Tukey fence of "
                     f"the density interval; the Hampel threshold at entry 57 of the density interval, with "
                     f"a half window of {n(IK['halfWindow'])} and nSigma {n(IK['nSigma'])}; the two-sided "
                     f"Grubbs critical value for the core plugs at alpha {n(IK['alpha'])}; and the largest "
                     f"squared Mahalanobis distance in the density-neutron cloud. All six to six decimals."),
    'advanced': (
        'expert',
        'AMASIRI-1, a casing pressure in two phases and a scored data sheet',
        'Whether the process has changed, and the score of the sheet',
        AMASIRI_TEXT + " Report six values: the phase one individuals chart upper limit; the phase one "
                       "moving range chart upper limit; the EWMA on day 14 of phase two; the exact EWMA upper "
                       "limit on day 2 of phase two; the upper CUSUM, S_hi, on day 18 of phase two; and the "
                       "scorecard total at those weights. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = f"""-- ============================================================================
-- D1: Oilfield Data Quality joins the catalogue, the FIRST course of the
-- Data & AI module.
--
-- Catalogue row (module 'data_ai'; path_order {PATH_ORDER}, directly above the HSE
-- module's qra at 65; prereq_slug NULL, the carried-over answer "no hard
-- prerequisite inside a module"; school left at its default, as every
-- Facilities, Economics, Assurance and HSE course leaves it) plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/dataqc/gen_course.py from the ENGINE'S OWN RUN
-- (d1_capstone.mjs through the vendored engines/dataai/quality.js), which it
-- refuses to write unless fields.json carries exactly that run's values and
-- the tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/dataqc, because the 78 lessons, the
-- teaching lab (dataqcLab.js), its three explorer panels and the capstone case
-- files ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. Data quality is a set of stated rules applied
-- to a well log or a production series, every flag carrying the rule that
-- fired and its reason, so the course teaches whether the data are fit to use
-- (Associate), which values stand apart and by which measure (Professional)
-- and whether the process that makes the data has changed (Expert), and grades
-- each tier on its own question with numbers the engine returns.
--
-- THE ENGINE. engines/dataai/quality.js, vendored sha-identical with
-- petrolord-engines c7eba2270f (engines #248, #249, #251). Missing is null,
-- undefined or NaN and a sentinel is a present value; limits are definitional
-- and units are never converted; every statistical flag fires strictly beyond
-- its limit; the z-score uses the sample standard deviation; EWMA takes its
-- target and sigma from history and CUSUM needs k and h in stated units.
--
-- WHAT IS GRADED. ODUDU (Associate) grades completeness, coverage, an inferred
-- index step, a liquid-basis water cut, a cumulative drop and a phase-sum
-- allowance; IKORO (Professional) grades a z ceiling case, a modified z, a
-- Tukey fence, a Hampel threshold, a Grubbs critical value and a Mahalanobis
-- distance; AMASIRI (Expert) grades phase-one limits, an EWMA, an exact EWMA
-- limit, a CUSUM and a weighted scorecard. Every value is a return value of the
-- engine, and the data it was run on is in the case files the prompt names.
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

INDEX_JS = ("// The dataqc capstone case files, generated by tools/course-waves/dataqc/gen_course.py\n"
            "// from the engine's own inputs (d1_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {re.sub(r'[^a-z0-9]', '_', fname[:-4])} from './{fname}?raw';\n"
INDEX_JS += '\nexport const DATAQC_CASE_FILES = {\n'
for tier in TIERS:
    INDEX_JS += f'  {tier}: [\n'
    for fname, _ in CASES[tier]:
        INDEX_JS += f"    {{ name: '{fname}', text: {re.sub(r'[^a-z0-9]', '_', fname[:-4])} }},\n"
    INDEX_JS += '  ],\n'
INDEX_JS += '};\n'

# --------------------------------------------------------------- self checks
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')

# EVERY SCALAR THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, and every case
# file is named in it.
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?![\d.])', PROMPTS[t]) for t in TIERS}
for tier, pairs in (('beginner', [('coverageStart', lg['coverageStart']), ('coverageEnd', lg['coverageEnd']), ('maxStep', lg['maxStep'])]),
                    ('intermediate', [('halfWindow', IK['halfWindow']), ('nSigma', IK['nSigma']), ('alpha', IK['alpha'])]),
                    ('advanced', [('lambda', AM['lambda']), ('L', AM['L']), ('k', AM['k']), ('h', AM['h'])]
                     + [(f"{d['name']} checked", d['checked']) for d in DIMS] + [(f"{d['name']} failed", d['failed']) for d in DIMS]
                     + [(f'{k} weight', v) for k, v in WTS.items()])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for tier in TIERS:
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')

# THE VOCABULARY (digest section 32) AND THE COPY RULE, over every prompt,
# dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    if re.search(r'\bP(?:5|10|50|90|95)\b', text):
        out.append(f'{label} carries a P label')
    if re.search(r'\bAI\b|AI-powered|artificial intelligence|machine learning', text, re.I):
        out.append(f'{label} carries an AI claim')
    for m in re.finditer(r'\bsigma\b', text):
        near = text[max(0, m.start() - 80):m.end() + 80]
        if not re.search(r'MRbar|sigma units|phase one', near):
            out.append(f'{label} carries a sigma with no source named')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('the P90 figure', 'P label'), ('an AI-powered check', 'AI claim'),
                    ('a sigma of 3', 'sigma'), ('a limit — wide', 'dash'), ('the median, not the mean', 'contrastive')):
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
    print(f'engine run: 18 of 18 fields.json values equal what d1_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'case-file series re-read and equal to the engine run: {SERIES_CHECKED}')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in prompts, labels and case files: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
