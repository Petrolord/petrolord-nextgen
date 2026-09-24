#!/usr/bin/env python3
"""Generate the D3 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on tools/course-waves/mlcore/gen_course.py (D2):

1. THE ENGINE IS RUN HERE. `node d3_capstone.mjs --json` is executed through the
   vendored engines/dataai/cluster.js and ml.js (D3_ENGINES) and the one
   tolerance module (D3_TOLERANCE), and this file REFUSES unless fields.json
   carries exactly what that run returned: the same tier, key and value to the
   last bit, and the tolerance gradedTolerance.js derives. gen_golive.py
   imports this module and takes its engine ledger from THIS run.

2. THE DATA TRAVELS AS CASE FILES. A D3 capstone is set on a field of wells
   (150, 168 and 175 rows), which no prompt can carry readably. So
   `d3_capstone.mjs --inputs` is rendered into one CSV case file per field
   under src/content/capstone-cases/facies/ (the dataqc and mlcore pattern: the
   capstone card offers them for download and no panel preloads them), with
   the header the explorer panels read (a `well` column, the numeric columns,
   then FACIES), the rows in the order the engine ran them. The uncored well's
   FACIES is written `null`, which the panels read as missing; the facies the
   generator drew for it (`withheld`) is NEVER written. A self check re-reads
   every case file and proves every column the engine ran is in it, value for
   value and in order.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 28) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: a standard deviation names its divisor, no P label,
   no AI claim; and the copy rule: no em or en dash, no "X, not Y" contrastive.

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every D3 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED.

Usage: python3 gen_course.py
   D3_WAVE        the wave directory (default /root/dai-wip-facies)
   D3_REPO        the nextgen clone   (default /root/wt-dai-d3-nextgen)
   D3_ENGINES     packages/engines to run the capstone through
   D3_TOLERANCE   gradedTolerance.js
   D3_COURSE_OUT  where to write the migration
   D3_CASES_OUT   where to write the case files (default $D3_REPO/src/content/capstone-cases/facies)
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

W = os.environ.get('D3_WAVE', '/root/dai-wip-facies')
REPO = os.environ.get('D3_REPO', '/root/wt-dai-d3-nextgen')
ENGINES = os.environ.get('D3_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'D3_TOLERANCE', f'{REPO}/src/components/course/panels/facies/gradedTolerance.js')
DATE = '20261102'
OUT = os.environ.get('D3_COURSE_OUT', f'{REPO}/migrations/{DATE}_d3_facies_course.sql')
CASES_OUT = os.environ.get('D3_CASES_OUT', f'{REPO}/src/content/capstone-cases/facies')

SLUG, MODULE, PATH_ORDER = 'facies', 'data_ai', 68
NAME = 'Electrofacies'
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
ENV = dict(os.environ, D3_ENGINES=ENGINES, D3_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/d3_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/d3_capstone.mjs'))
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

IH, NK, OG = INPUTS['IHIALA'], INPUTS['NKWELLE'], INPUTS['OGBUNIKE']
IHS, NKS, OGS = IH['stated'], NK['stated'], OG['stated']


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
# row in the order the engine ran it. The withheld facies is never written.
# ---------------------------------------------------------------------------
CHANNELS = ['depth', 'GR', 'RHOB', 'NPHI', 'PEF', 'CALI']
HEAD = ['well', *CHANNELS, 'FACIES']


def case_text(field):
    buf = io.StringIO()
    wr = csv.writer(buf, lineterminator='\n')
    wr.writerow(HEAD)
    for r in field['rows']:
        wr.writerow([r['well'], *[n(r[c]) for c in CHANNELS], 'null' if r['FACIES'] is None else r['FACIES']])
    return buf.getvalue()


CASE_NAME = {'beginner': 'ihiala_wells.csv', 'intermediate': 'nkwelle_wells.csv', 'advanced': 'ogbunike_wells.csv'}
FIELD_OF = {'beginner': IH['field'], 'intermediate': NK['field'], 'advanced': OG['field']}
CASES = {t: [(CASE_NAME[t], case_text(FIELD_OF[t]))] for t in TIERS}

# EVERY COLUMN THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order.
SERIES_CHECKED = 0
for t in TIERS:
    fld = FIELD_OF[t]
    rows = list(csv.DictReader(io.StringIO(CASES[t][0][1])))
    if [r['well'] for r in rows] != [r['well'] for r in fld['rows']]:
        bad.append(f'{CASE_NAME[t]}: the well column is not the rows the engine ran, in order')
    for c in CHANNELS:
        got = [float(r[c]) for r in rows]
        want = [float(r[c]) for r in fld['rows']]
        if got != want:
            bad.append(f'{CASE_NAME[t]} column {c} is not the series the engine ran')
        SERIES_CHECKED += 1
    if [None if r['FACIES'] == 'null' else r['FACIES'] for r in rows] != [r['FACIES'] for r in fld['rows']]:
        bad.append(f'{CASE_NAME[t]} column FACIES is not the core facies the engine ran')
    SERIES_CHECKED += 1
    if len(fld['wells']) != len(set(r['well'] for r in fld['rows'])):
        bad.append(f'{CASE_NAME[t]}: a well without rows')
# THE WITHHELD FACIES NEVER TRAVELS: no case file carries a facies for a row
# whose core facies is null.
for t in TIERS:
    for r, fr in zip(csv.DictReader(io.StringIO(CASES[t][0][1])), FIELD_OF[t]['rows']):
        if fr['FACIES'] is None and r['FACIES'] != 'null':
            bad.append(f'{CASE_NAME[t]}: an uncored row carries a facies')
            break

IH_NW, NK_NW, OG_NW = len(IH['field']['wells']), len(NK['field']['wells']), len(OG['field']['wells'])
IH_N, NK_N, OG_N = len(IH['field']['rows']), len(NK['field']['rows']), len(OG['field']['rows'])
IH_PER, NK_PER, OG_PER = IH_N // IH_NW, NK_N // NK_NW, OG_N // OG_NW
OG_CORED = sum(1 for r in OG['field']['rows'] if r['FACIES'] is not None)
UNCORED = sorted({r['well'] for r in OG['field']['rows'] if r['FACIES'] is None})
if UNCORED != [OGS['uncored']]:
    bad.append(f'the Ogbunike uncored wells are {UNCORED}, and the prompt names {OGS["uncored"]}')
if any(r['FACIES'] is None for r in IH['field']['rows'] + NK['field']['rows']):
    bad.append('an Ihiala or Nkwelle row has no core facies, and the prompts say every well is cored')
if IH_N % IH_NW or NK_N % NK_NW or OG_N % OG_NW:
    bad.append('a field does not carry the same number of rows in every well')
CR = IHS['centreRow']
if IH['field']['rows'][CR]['well'] != 'IHIALA-1' or IH['field']['rows'][CR + 1]['well'] != 'IHIALA-2':
    bad.append(f'Ihiala row {CR} is not the last row of IHIALA-1, as the prompt says')

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'ihiala_gr_scale_gapi': ('The scale of GR, the population standard deviation (n)', 'gAPI'),
    'ihiala_pc1_ratio': ('The explained variance ratio of the first principal component, correlation matrix', 'dimensionless'),
    'ihiala_pc1_nphi_loading': ('The loading of NPHI on the first principal component', 'dimensionless'),
    'ihiala_pc1_score_first_row': ('The score of row 0 on the first principal component', 'dimensionless'),
    'ihiala_kmeans_inertia': (f"The inertia of k-means at k {n(IHS['k'])}, seed {n(IHS['seed'])}", 'standard units squared'),
    'ihiala_row24_cluster_gr_centre_gapi': (f'The GR of the centre of the cluster row {CR} sits in', 'gAPI'),
    'nkwelle_elbow_drop_fraction_k4': (f"The drop fraction of the elbow at k {n(NKS['k'])}", 'dimensionless'),
    'nkwelle_ward_silhouette': (f"The mean silhouette of the Ward cut at k {n(NKS['k'])}", 'dimensionless'),
    'nkwelle_ward_height_above_cut': (f"The height of the next Ward merge above the cut at k {n(NKS['k'])}", 'standard units'),
    'nkwelle_complete_ari': (f"The adjusted Rand index of the complete-linkage cut at k {n(NKS['k'])} against the core facies", 'dimensionless'),
    'nkwelle_one_to_one_macro_f1': (f"The macro F1 of one-to-one matching of k-means at k {n(NKS['k'])}", 'dimensionless'),
    'nkwelle_majority_accuracy_k6': (f"The accuracy of majority matching of k-means at k {n(NKS['kOver'])}", 'dimensionless'),
    'ogbunike_knn_heldout_accuracy': (f"The kNN accuracy on {OGS['heldOut']}", 'dimensionless'),
    'ogbunike_knn_nearest_distance': (f"The distance from row 0 of {OGS['heldOut']} to its nearest training row", 'standard units'),
    'ogbunike_cart_node2_gini': ('The Gini impurity of node 2', 'dimensionless'),
    'ogbunike_cart_nphi_importance': ('The importance of NPHI in the tree', 'dimensionless'),
    'ogbunike_cart_depth3_heldout_accuracy': (f"The accuracy on {OGS['heldOut']} of the tree of maxDepth {n(OGS['depth'])}", 'dimensionless'),
    'ogbunike_uncored_gr_minmax_max': (f"The highest GR of {OGS['uncored']}, min-max scaled on the cored rows", 'dimensionless'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# The stated settings, read off the capstone generator's own stated block and
# checked against what this prompt text assumes.
LOGS = ['GR', 'RHOB', 'NPHI', 'PEF']
for what, got, want in (
        ('Ihiala logs', IHS['logs'], LOGS), ('Nkwelle logs', NKS['logs'], LOGS), ('Ogbunike logs', OGS['logs'], LOGS),
        ('Ogbunike channels', OGS['channels'], LOGS + ['CALI']), ('Nkwelle kMax', NKS['kMax'], 8)):
    if got != want:
        bad.append(f'{what} is {got!r}; the prompt text is written for {want!r}')
MAXDEPTH_DEFAULT = int(node('--input-type=module', '-e',
                            'const C = await import(%s); console.log(C.DEFAULTS.CART_MAX_DEPTH);'
                            % json.dumps(f'{ENGINES}/engines/dataai/cluster.js')).strip())
NINIT_DEFAULT = int(node('--input-type=module', '-e',
                         'const C = await import(%s); console.log(C.DEFAULTS.KMEANS_N_INIT);'
                         % json.dumps(f'{ENGINES}/engines/dataai/cluster.js')).strip())

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
LAYOUT = ("the well name, the depth in ft, GR in gAPI, RHOB in g/cm3, NPHI in v/v, PEF in b/e, CALI in in, and "
          "the core FACIES")
OTHER5 = [w['id'] for w in OG['field']['wells'] if w['id'] not in (OGS['heldOut'], OGS['uncored'])]
IHIALA_TEXT = (
    f"IHIALA, a field of {IH_NW} cored wells, IHIALA-1 to IHIALA-{IH_NW}, each logged at a one foot step. One case "
    f"file comes with this capstone. ihiala_wells.csv carries {IH_N} rows, {IH_PER} a well, in well order and in "
    f"depth order within each well: {LAYOUT}. Use the four logs GR, RHOB, NPHI and PEF on all {IH_N} rows, rows "
    f"counted from 0 in the order of the file, so row {CR} is the last row of IHIALA-1.")
NKWELLE_TEXT = (
    f"NKWELLE, a field of {NK_NW} cored wells, NKWELLE-1 to NKWELLE-{NK_NW}, each logged at a one foot step. One case "
    f"file comes with this capstone. nkwelle_wells.csv carries {NK_N} rows, {NK_PER} a well, in well order and in "
    f"depth order within each well: {LAYOUT}. Use the four logs GR, RHOB, NPHI and PEF on all {NK_N} rows, with "
    f"standard scaling throughout.")
OGBUNIKE_TEXT = (
    f"OGBUNIKE, a field of {OG_NW} wells, OGBUNIKE-1 to OGBUNIKE-{OG_NW}, each logged at a one foot step. One case "
    f"file comes with this capstone. ogbunike_wells.csv carries {OG_N} rows, {OG_PER} a well, in well order and in "
    f"depth order within each well: {LAYOUT}. {OGS['uncored']} was not cored, and its FACIES is written null on "
    f"every row; it was logged with a gamma ray tool that reads {n(OGS['hotAdd'])} gAPI high on every row. The "
    f"other {OG_NW - 1} wells are cored, {OG_CORED} rows.")

TIER = {
    'beginner': (
        'associate',
        f'IHIALA, {IH_NW} cored wells, {IH_N} rows',
        'Grouping logs into electrofacies',
        IHIALA_TEXT + f" Report six values: the scale of GR that standard scaling fits on those rows, the population "
                      f"standard deviation (n), in gAPI; the explained variance ratio of the first principal component "
                      f"of the correlation matrix; the loading of NPHI on that component, with the engine's sign "
                      f"convention; the score of row 0 on that component; the inertia, in squared standard units, of "
                      f"k-means with k {n(IHS['k'])}, seed {n(IHS['seed'])} and {NINIT_DEFAULT} starts, standard "
                      f"scaling; and the GR, in gAPI, of the centre of the cluster row {CR} sits in under that "
                      f"clustering. All six to six decimals."),
    'intermediate': (
        'professional',
        f'NKWELLE, {NK_NW} cored wells, {NK_N} rows',
        'Judging groups against core',
        NKWELLE_TEXT + f" Report six values. First, the drop fraction at k {n(NKS['k'])} of the elbow over k 1 to "
                       f"{n(NKS['kMax'])} with seed {n(NKS['seed'])} and {NINIT_DEFAULT} starts. Second, the mean "
                       f"silhouette of the Ward linkage cut at k {n(NKS['k'])}, scored on the standardised logs. "
                       f"Third, the height, in standard units, of the next merge above that Ward cut, the first merge "
                       f"the cut undoes. Fourth, the adjusted Rand index of the complete linkage cut at k "
                       f"{n(NKS['k'])} against the core facies. Fifth, the macro F1 of one-to-one matching of k-means "
                       f"at k {n(NKS['k'])}, seed {n(NKS['seed'])} and {NINIT_DEFAULT} starts, against the core "
                       f"facies. Sixth, the accuracy of majority matching of k-means at k {n(NKS['kOver'])}, seed "
                       f"{n(NKS['seed'])} and {NINIT_DEFAULT} starts, against the core facies. All six to six "
                       f"decimals."),
    'advanced': (
        'expert',
        f'OGBUNIKE, {OG_NW} wells, one of them uncored',
        'Predicting facies and the engine\'s own rules',
        OGBUNIKE_TEXT + f" Report six values. First, the accuracy on {OGS['heldOut']} of kNN with k {n(OGS['k'])} on "
                        f"the four logs GR, RHOB, NPHI and PEF, standard scaling fitted on the training rows, trained "
                        f"on the other {len(OTHER5)} cored wells, {', '.join(OTHER5)}. Second, the distance, in "
                        f"standard units, from row 0 of {OGS['heldOut']}, its shallowest row, rows counted from 0 "
                        f"within the well, to its nearest training row in that run. Third, the Gini impurity of node "
                        f"2, the node the root sends right, of the classification tree grown on all {OG_CORED} cored "
                        f"rows at the default maxDepth {MAXDEPTH_DEFAULT}, with the five channels in the column order "
                        f"GR, RHOB, NPHI, PEF, CALI. Fourth, the importance of NPHI in that tree. Fifth, the accuracy "
                        f"on {OGS['heldOut']} of a tree of maxDepth {n(OGS['depth'])} grown on the other "
                        f"{len(OTHER5)} cored wells with the same five channels in the same order. Sixth, the highest "
                        f"GR of {OGS['uncored']} after min-max scaling fitted on the four logs of the {OG_CORED} cored "
                        f"rows. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = f"""-- ============================================================================
-- D3: Electrofacies joins the catalogue, the THIRD course of the Data & AI
-- module.
--
-- Catalogue row (module 'data_ai'; path_order {PATH_ORDER}, directly above D2
-- mlcore at 67; prereq_slug NULL, as D1 and D2 carry it: whether D3 requires
-- D2 is a go-live decision; school left at its default) plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/facies/gen_course.py from the ENGINE'S OWN RUN
-- (d3_capstone.mjs through the vendored engines/dataai/cluster.js and ml.js),
-- which it refuses to write unless fields.json carries exactly that run's
-- values and the tolerance gradedTolerance.js derives. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/facies, because the 78
-- lessons, the teaching lab (faciesLab.js), its three explorer panels and the
-- capstone case files ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. An electrofacies is a group of depth samples
-- whose logs look alike, and it is worth something only when it is checked
-- against the rock, so the course teaches grouping logs into electrofacies
-- (Associate), judging the groups against core (Professional), and predicting
-- facies with the engine's own rules (Expert), and grades each tier on its own
-- question with numbers the engine returns.
--
-- THE ENGINE. engines/dataai/cluster.js, vendored sha-identical with
-- petrolord-engines ef4058f (engines #253 and #254), with the scalers and
-- classificationReport of ml.js. Scaling for clustering is fitted on the rows
-- passed with the population standard deviation; PCA on the correlation
-- matrix uses the sample standard deviation and a stated sign rule; k-means
-- seeds with k-means++ on one mulberry32 stream and keeps the lowest inertia
-- of its starts; distance and merge ties are judged in a 1e-12 relative band.
--
-- WHAT IS GRADED. IHIALA (Associate) grades a scaler's scale, the first
-- component's share, a loading and a score, a k-means inertia and a centre in
-- log units; NKWELLE (Professional) grades an elbow drop fraction, a Ward
-- silhouette and merge height, an adjusted Rand index, a one-to-one macro F1
-- and a majority accuracy; OGBUNIKE (Expert) grades a held-out kNN accuracy, a
-- nearest distance, the Gini of the node a tied root sends right, an
-- importance, a held-out tree accuracy and a range check on an uncored well.
-- Every value is a return value of the engine, and the data it was run on is
-- in the case file the prompt names.
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


INDEX_JS = ("// The facies capstone case files, generated by tools/course-waves/facies/gen_course.py\n"
            "// from the engine's own inputs (d3_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const FACIES_CASE_FILES = {\n'
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
for tier, pairs in (('beginner', [('k', IHS['k']), ('seed', IHS['seed']), ('centreRow', IHS['centreRow']), ('nInit', NINIT_DEFAULT)]),
                    ('intermediate', [(k, NKS[k]) for k in ('kMax', 'seed', 'k', 'kOver')] + [('nInit', NINIT_DEFAULT)]),
                    ('advanced', [(k, OGS[k]) for k in ('k', 'hotAdd', 'depth')] + [('maxDepth', MAXDEPTH_DEFAULT)])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for s_ in (OGS['heldOut'], OGS['uncored']):
    if s_ not in PROMPTS['advanced']:
        bad.append(f'the advanced prompt does not name {s_}')
for tier in TIERS:
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')

# THE VOCABULARY AND THE COPY RULE, over every prompt, dataset, title and label.
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
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('the P90 figure', 'P label'), ('an AI-powered model', 'AI claim'),
                    ('the standard deviation of GR', 'divisor'),
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
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w').write(SQL)
    os.makedirs(CASES_OUT, exist_ok=True)
    for tier in TIERS:
        for fname, text in CASES[tier]:
            open(f'{CASES_OUT}/{fname}', 'w').write(text)
    open(f'{CASES_OUT}/index.js', 'w').write(INDEX_JS)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print(f'wrote {CASES_OUT}: {sum(len(v) for v in CASES.values())} case files and index.js')
    print(f'engine run: 18 of 18 fields.json values equal what d3_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'case-file columns re-read and equal to the engine run: {SERIES_CHECKED}')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in prompts, labels and case files: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
