#!/usr/bin/env python3
"""Generate the D5 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on tools/course-waves/forecastml/gen_course.py (D4) and
tools/course-waves/facies/gen_course.py (D3), rewritten for D5 appliedai: the
three capstones are ORLU (Associate), NNEWI (Professional) and AWKA (Expert),
built by d5_capstone.mjs through the vendored engines/dataai/evaluate.js.

1. THE ENGINE IS RUN HERE. `node d5_capstone.mjs --json` is executed through the
   vendored engines/dataai/evaluate.js (with lib/stats and ml.js, D5_ENGINES)
   and the one tolerance module (D5_TOLERANCE), and this file REFUSES unless
   fields.json carries exactly what that run returned: the same tier, key and
   value to the last bit, and the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A D5 capstone is set on a document set, its
   queries and judgments, answers with citations, runs, extraction records,
   rating pairs or calibration rows, which no prompt can carry readably. So
   `d5_capstone.mjs --inputs` is rendered into one JSON case file per tier
   under src/content/capstone-cases/appliedai/ (the dataqc, mlcore, facies and
   forecastml pattern: the capstone card offers them for download and no panel
   preloads them). The generator seeds that drew each dataset are NEVER
   written. A self check re-reads every case file and proves it carries
   exactly the inputs the engine ran, value for value and in order.

3. EVERY SETTING IS STATED. Each prompt states every setting its six values
   were computed at (method, k, k1, b, stop list, tf, threshold, gain,
   no-relevant rule, numericRelTol, seed, replicates, level, pairing, labels,
   weights, bins and the bin-edge rule), read from the engine's stated inputs,
   and a self check refuses a prompt that omits one.

4. THE VOCABULARY AND THE COPY RULE (digest section 24, BRIEF.md) ARE ENFORCED
   ON EVERY PROMPT, TITLE AND LABEL: no AI claim, no em or en dash, no "X, not
   Y" contrastive. WBC is named as Stephenson, Coelho and Jolliffe (2008) label
   it in their eq. 7: the fifth term, factor 2 included, twice the pooled
   within-bin covariance.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every D5 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, id, query, answer and value.

Usage: python3 gen_course.py
   D5_WAVE        the wave directory (default /root/dai-wip-appliedai)
   D5_REPO        the nextgen clone   (default /root/wt-dai-d5-nextgen)
   D5_ENGINES     packages/engines to run the capstone through
   D5_TOLERANCE   gradedTolerance.js
   D5_COURSE_OUT  where to write the migration
   D5_CASES_OUT   where to write the case files (default $D5_REPO/src/content/capstone-cases/appliedai)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration and the case files.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('D5_WAVE', '/root/dai-wip-appliedai')
REPO = os.environ.get('D5_REPO', '/root/wt-dai-d5-nextgen')
ENGINES = os.environ.get('D5_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'D5_TOLERANCE', f'{REPO}/src/components/course/panels/appliedai/gradedTolerance.js')
DATE = '20261104'
OUT = os.environ.get('D5_COURSE_OUT', f'{REPO}/migrations/{DATE}_d5_appliedai_course.sql')
CASES_OUT = os.environ.get('D5_CASES_OUT', f'{REPO}/src/content/capstone-cases/appliedai')

SLUG, MODULE, PATH_ORDER = 'appliedai', 'data_ai', 70
NAME = 'Applied AI and Language Models'
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
ENV = dict(os.environ, D5_ENGINES=ENGINES, D5_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/d5_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/d5_capstone.mjs'))
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

OR, NN, AW = INPUTS['ORLU'], INPUTS['NNEWI'], INPUTS['AWKA']
ORS, NNS, AWS = OR['stated'], NN['stated'], AW['stated']
GEN_SEEDS = {OR['seed'], NN['seed'], AW['seed']}


def n(x):
    """A number as the prompt writes it: the shortest decimal that reads back to
    the value the engine ran, a whole number without a point."""
    if x is None:
        return 'null'
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    if 'e' in s or float(s) != x:
        sys.exit(f'REFUSED: {x!r} does not print as a plain decimal that reads back to itself')
    return s


def ids(rows, key='id'):
    return [r[key] for r in rows]


def span(rows, key='id'):
    xs = ids(rows, key)
    return f'{xs[0]} to {xs[-1]}'


# ---------------------------------------------------------------------------
# THE CASE FILES, rendered from the engine's own inputs: one JSON file a tier,
# in the order the engine ran every list. The generator seeds are never written.
# ---------------------------------------------------------------------------
def orlu_case():
    return {
        'dataset': 'ORLU (synthetic)',
        'passages': OR['documents'],
        'queries': OR['queries'],
        'judgments': OR['judgments'],
        'answers': [{'query': a['query'], 'text': a['text'], 'citations': a['citations']} for a in OR['answers']],
        'retrieved': {a['query']: a['retrieved'] for a in OR['answers']},
    }


def nnewi_case():
    return {
        'dataset': 'NNEWI (synthetic)',
        'passages': NN['documents'],
        'queries': NN['queries'],
        'judgments': NN['judgments'],
        'runs': NN['runs'],
        'shortAnswers': NN['shorts'],
        'extraction': NN['extraction'],
        'answers': NN['answers'],
    }


def awka_case():
    return {
        'dataset': 'AWKA (synthetic)',
        'ratings': AW['ratings'],
        'calibration': AW['calibration'],
    }


CASE_NAME = {'beginner': 'orlu_case.json', 'intermediate': 'nnewi_case.json', 'advanced': 'awka_case.json'}
CASE_OBJ = {'beginner': orlu_case(), 'intermediate': nnewi_case(), 'advanced': awka_case()}
CASES = {t: [(CASE_NAME[t], json.dumps(CASE_OBJ[t], indent=1, ensure_ascii=False) + '\n')] for t in TIERS}

# EVERY INPUT THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order;
# nothing else is, and no generator seed is.
CHECKED = 0
for t, want in (('beginner', {k: OR[k] for k in ('documents', 'queries', 'judgments')}),
                ('intermediate', {k: NN[k] for k in ('documents', 'queries', 'judgments', 'runs', 'shorts', 'extraction', 'answers')}),
                ('advanced', {k: AW[k] for k in ('ratings', 'calibration')})):
    got = json.loads(CASES[t][0][1])
    rename = {'documents': 'passages', 'shorts': 'shortAnswers'}
    for k, v in want.items():
        if got.get(rename.get(k, k)) != v:
            bad.append(f'{CASE_NAME[t]}: {k} is not what the engine ran')
        CHECKED += 1
    if 'seed' in got or any(str(s) in CASES[t][0][1] for s in GEN_SEEDS):
        bad.append(f'{CASE_NAME[t]}: a generator seed is written')
orc = json.loads(CASES['beginner'][0][1])
if [dict(a, retrieved=orc['retrieved'][a['query']]) for a in orc['answers']] != OR['answers']:
    bad.append('orlu_case.json: the answers or their retrieved lists are not what the engine ran')
CHECKED += 1

# THE SCENARIO THE PROMPTS DESCRIBE, checked on the engine's inputs.
if [a['query'] for a in OR['answers']] != ids(OR['queries']):
    bad.append('ORLU: the answers are not one to each query, in query order')
if [a['query'] for a in NN['answers']] != ids(NN['queries']) or [s['query'] for s in NN['shorts']] != ids(NN['queries']):
    bad.append('NNEWI: the cited or short answers are not one to each query, in query order')
if set(NN['runs']) != {'P', 'Q'} or any(len(v) != NNS['k'] for r in NN['runs'].values() for v in r.values()):
    bad.append(f"NNEWI: the runs are not P and Q, each cut at {NNS['k']}")
if any(len(v) != ORS['k'] for v in orc['retrieved'].values()):
    bad.append(f"ORLU: a retrieved list is not cut at {ORS['k']}")
if len(AW['ratings']['a']) != len(AW['ratings']['b']):
    bad.append('AWKA: the raters grade different numbers of items')
if len(AW['calibration']['yTrue']) != len(AW['calibration']['probabilities']):
    bad.append('AWKA: outcomes and probabilities differ in number')
if sorted(set(AW['ratings']['a'] + AW['ratings']['b'])) != AWS['labels'] and not set(AW['ratings']['a'] + AW['ratings']['b']) <= set(AWS['labels']):
    bad.append('AWKA: a grade outside the stated labels')
N_EXT_PRED = len(NN['extraction']['predictions'])
N_EXT_LAB = len(NN['extraction']['labels'])
EXT_FIELDS = NN['extraction']['fields']
NUM_FIELDS = [f for f in EXT_FIELDS if f['type'] == 'number']

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
WBC_NAME = ('WBC as Stephenson, Coelho and Jolliffe (2008) label it in their eq. 7 (the fifth term, '
            'factor 2 included, so twice the pooled within-bin covariance)')
LABELS = {
    'orlu_bm25_idf_pressure': (f"The BM25 idf of \"{ORS['idfTerm']}\" over the ORLU passages", 'dimensionless'),
    'orlu_o1_bm25_top_score': (f"The top BM25 score for {ORS['topQuery']}", 'BM25 score'),
    'orlu_o4_tfidf_top_cosine': (f"The top TF-IDF cosine for {ORS['cosQuery']}", 'cosine'),
    'orlu_bm25_mean_recall_at4': (f"The mean recall at {n(ORS['k'])} of the BM25 runs", 'fraction'),
    'orlu_bm25_mrr_at4': (f"The MRR at {n(ORS['k'])} of the BM25 runs", 'dimensionless'),
    'orlu_answers_supported_fraction': ('The pooled supported fraction of the ORLU answers', 'fraction'),
    'nnewi_p_map_at5_grade2': (f"P's MAP at {n(NNS['k'])}, relevant at grade {n(NNS['mapGrade'])} or more", 'dimensionless'),
    'nnewi_q_ndcg_at5_exponential': (f"Q's mean nDCG at {n(NNS['k'])}, exponential gain", 'dimensionless'),
    'nnewi_short_mean_token_f1': ('The mean token F1 of the short answers', 'fraction'),
    'nnewi_extraction_macro_f1': ('The extraction macro F1', 'fraction'),
    'nnewi_paired_ndcg_upper': ('The upper bound of the paired nDCG interval, P minus Q', 'nDCG difference'),
    'nnewi_q_supported_fraction': ("The pooled supported fraction of Q's answers", 'fraction'),
    'awka_kappa_unweighted': ("Cohen's kappa, unweighted", 'dimensionless'),
    'awka_kappa_linear': ("Cohen's kappa, linear weights", 'dimensionless'),
    'awka_brier': ('The Brier score', 'dimensionless'),
    'awka_reliability_bins8': (f"The reliability REL at {n(AWS['bins'])} bins", 'dimensionless'),
    'awka_resolution_bins8': (f"The resolution RES at {n(AWS['bins'])} bins", 'dimensionless'),
    'awka_wbc_bins8': (f"The within-bin covariance term WBC at {n(AWS['bins'])} bins (twice the pooled within-bin covariance)", 'dimensionless'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
ONOFF = {False: 'off', True: 'on'}
UNJUDGED = 'a passage not listed for a query is unjudged and counts as grade 0'

ORLU_TEXT = (
    f"ORLU is a synthetic document set of {n(len(OR['documents']))} short field passages, "
    f"{span(OR['documents'])}, with {n(len(OR['queries']))} worded queries, {span(OR['queries'])}, graded 0 to 3 "
    f"for relevance, and one cited answer to each query. No language model wrote any of it. One case file comes "
    f"with this capstone. {CASE_NAME['beginner']} carries the passages (id and text), the queries (id and text), "
    f"the judgments (query id to passage id and grade; {UNJUDGED}), the answers (query, text and the passages "
    f"each cites) and, for each answer, the passages its system retrieved, which are that query's BM25 top "
    f"{n(ORS['k'])} at the settings below. The settings: the stop list {ONOFF[ORS['stopWords']]}; BM25 with k1 "
    f"{n(ORS['k1'])} and b {n(ORS['b'])}; TF-IDF with {ORS['tfidf']}; cutoff k {n(ORS['k'])}; relevant at grade "
    f"{n(ORS['relevantGrade'])} or more; numericRelTol {n(ORS['numericRelTol'])}.")
NNEWI_TEXT = (
    f"NNEWI is a synthetic document set of {n(len(NN['documents']))} short field passages, "
    f"{span(NN['documents'])}, with {n(len(NN['queries']))} worded queries, {span(NN['queries'])}, graded 0 to 3, "
    f"and the ranked runs of two fixed systems cut at {n(NNS['k'])}: P, BM25 with k1 {n(NNS['P']['k1'])} and b "
    f"{n(NNS['P']['b'])}, and Q, TF-IDF with sublinear tf {ONOFF[NNS['Q']['sublinearTf']]}, both with the stop "
    f"list {ONOFF[NNS['P']['stopWords']]}. No language model wrote any of it. One case file comes with this "
    f"capstone. {CASE_NAME['intermediate']} carries the passages, the queries, the judgments ({UNJUDGED}), the "
    f"runs of P and Q (query id to ranked passage ids, best first), a short answer and its reference to each "
    f"query, an extraction set ({n(len(EXT_FIELDS))} fields with their types, the number fields with their "
    f"absolute tolerances; {n(N_EXT_LAB)} labelled records, {span(NN['extraction']['labels'])}; "
    f"{n(N_EXT_PRED)} predicted records, a record with no prediction being one the system did not extract), and "
    f"Q's cited answer to each query, whose retrieved passages are Q's run for that query. A query with no "
    f"relevant passage is {NNS['noRelevant']}d from every mean; none is.")
AWKA_TEXT = (
    f"AWKA is a synthetic trust set: {n(len(AW['ratings']['a']))} relevance grades given to the same query and "
    f"passage pairs by two annotators, rater a and rater b, on the scale 0 to 3, and "
    f"{n(len(AW['calibration']['yTrue']))} calibration rows, each an outcome (1 relevant, 0 not) and a stated "
    f"probability. No language model wrote any of it. One case file comes with this capstone. "
    f"{CASE_NAME['advanced']} carries the two raters' grades, item by item in the same order, and the calibration "
    f"outcomes and probabilities, row by row in the same order.")

TIER = {
    'beginner': (
        'associate',
        f"ORLU, {n(len(OR['documents']))} passages, {n(len(OR['queries']))} queries and their cited answers",
        'Retrieving passages and checking cited answers',
        ORLU_TEXT + f" Report six values: the BM25 idf of the term \"{ORS['idfTerm']}\" over the ORLU passages; the "
                    f"top BM25 score for query {ORS['topQuery']}; the top TF-IDF cosine for query {ORS['cosQuery']}; "
                    f"the mean recall at {n(ORS['k'])} of the BM25 runs over the {n(len(OR['queries']))} queries; "
                    f"the MRR at {n(ORS['k'])} of those runs; and the pooled supported fraction of the "
                    f"{n(len(OR['answers']))} answers, each claim checked against the passages the answer cites and "
                    f"retrieved. All six to six decimals."),
    'intermediate': (
        'professional',
        f"NNEWI, {n(len(NN['documents']))} passages, {n(len(NN['queries']))} queries and two fixed systems",
        'Scoring retrieval and answers honestly',
        NNEWI_TEXT + f" Report six values. First, P's MAP at {n(NNS['k'])} with relevant at grade "
                     f"{n(NNS['mapGrade'])} or more. Second, Q's mean nDCG at {n(NNS['k'])} with {NNS['ndcgGain']} "
                     f"gain (2^grade - 1), the ideal DCG from every judged grade. Third, the mean SQuAD token F1 of "
                     f"the {n(len(NN['shorts']))} short answers against their references. Fourth, the extraction "
                     f"macro F1 over the {n(len(EXT_FIELDS))} fields. Fifth, the upper bound of the paired bootstrap "
                     f"percentile interval of per-query {NNS['bootMetric']}, P minus Q, seed {n(NNS['bootSeed'])}, "
                     f"{n(NNS['nBoot'])} replicates, level {n(NNS['level'])}. Sixth, the pooled supported fraction "
                     f"of Q's answers, numericRelTol {n(NNS['numericRelTol'])}. All six to six decimals."),
    'advanced': (
        'expert',
        f"AWKA, {n(len(AW['ratings']['a']))} rating pairs and {n(len(AW['calibration']['yTrue']))} calibration rows",
        'Agreement and calibration',
        AWKA_TEXT + f" Report six values. First, Cohen's kappa of the two raters, unweighted, with the labels "
                    f"{', '.join(n(x) for x in AWS['labels'][:-1])} and {n(AWS['labels'][-1])}. Second, the same "
                    f"kappa with {AWS['weights'][1]} weights. Third, the Brier score of the calibration rows. Fourth, "
                    f"fifth and sixth, from the Murphy decomposition at {n(AWS['bins'])} equal-width bins (the edge "
                    f"rule: {AWS['edgeRule']}, and 1 closes the last bin): the reliability REL, the resolution RES, and "
                    f"{WBC_NAME}. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = f"""-- ============================================================================
-- D5: Applied AI and Language Models joins the catalogue, the FIFTH course of
-- the Data & AI module.
--
-- Catalogue row (module 'data_ai'; path_order {PATH_ORDER}, directly above D4
-- forecastml at 69; prereq_slug NULL, as D1 to D4 carry it: whether D5
-- requires an earlier course is a go-live decision; school left at its
-- default) plus the three capstones and their eighteen graded fields,
-- generated by tools/course-waves/appliedai/gen_course.py from the ENGINE'S
-- OWN RUN (d5_capstone.mjs through the vendored engines/dataai/evaluate.js),
-- which it refuses to write unless fields.json carries exactly that run's
-- values and the tolerance gradedTolerance.js derives. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/appliedai, because the
-- 78 lessons, the teaching lab (evaluateLab.js), its three explorer panels
-- and the capstone case files ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A copilot's retrieval, answers and
-- extractions can be scored deterministically against judged references, so
-- the course teaches retrieving passages and checking cited answers
-- (Associate), scoring retrieval and answers honestly (Professional), and
-- agreement, calibration and the engine's rules (Expert), and grades each
-- tier on its own question with numbers the engine returns. No graded value
-- depends on language-model output; no model runs anywhere in the course.
--
-- THE ENGINE. engines/dataai/evaluate.js, vendored sha-identical with
-- petrolord-engines f50251d, with lib/stats for mulberry32 and the quantile
-- and engines/dataai/ml.js for log loss. Tokens lowercase ASCII split outside
-- [a-z0-9]; TF-IDF as scikit-learn's default; Okapi BM25 with the Lucene idf;
-- ties at 12 significant digits go to the id ascending; recall and AP divide
-- by every relevant judged passage; the ideal DCG uses every judged grade;
-- SQuAD exact match and token F1; groundedness against passages cited AND
-- retrieved; Cohen's kappa; Brier, the reliability table and the Murphy
-- decomposition with the within-bin terms (Stephenson, Coelho and Jolliffe
-- 2008 eq. 7, WBC twice the pooled within-bin covariance); one seeded
-- bootstrap stream.
--
-- WHAT IS GRADED. ORLU (Associate) grades a BM25 idf, a BM25 top score, a
-- TF-IDF top cosine, a mean recall and an MRR at 4, and a pooled supported
-- fraction; NNEWI (Professional) grades a MAP at grade 2, an exponential-gain
-- mean nDCG, a mean token F1, an extraction macro F1, a paired-bootstrap upper
-- bound and a pooled supported fraction; AWKA (Expert) grades unweighted and
-- linear kappa, the Brier score, and REL, RES and WBC at 8 bins. Every value
-- is a return value of the engine, and the data it was run on is in the case
-- file the prompt names.
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
    return re.sub(r'[^a-z0-9]', '_', fname.rsplit('.', 1)[0])


INDEX_JS = ("// The appliedai capstone case files, generated by tools/course-waves/appliedai/gen_course.py\n"
            "// from the engine's own inputs (d5_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const APPLIEDAI_CASE_FILES = {\n'
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

# EVERY SETTING THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, and every
# case file is named in it exactly once.
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
for tier, pairs in (('beginner', [(k, ORS[k]) for k in ('k', 'k1', 'b', 'relevantGrade', 'numericRelTol')]),
                    ('intermediate', [(k, NNS[k]) for k in ('k', 'mapGrade', 'bootSeed', 'nBoot', 'level', 'numericRelTol')]
                     + [('P k1', NNS['P']['k1']), ('P b', NNS['P']['b'])]),
                    ('advanced', [('bins', AWS['bins'])] + [(f'label {x}', x) for x in AWS['labels']])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for tier, words in (('beginner', [f"stop list {ONOFF[ORS['stopWords']]}", ORS['tfidf'], ORS['idfTerm'],
                                  f"query {ORS['topQuery']}", f"query {ORS['cosQuery']}", 'cites and retrieved']),
                    ('intermediate', [f"sublinear tf {ONOFF[NNS['Q']['sublinearTf']]}", f"stop list {ONOFF[NNS['P']['stopWords']]}",
                                      f"{NNS['ndcgGain']} gain", NNS['bootMetric'], 'paired', 'P minus Q',
                                      f"{NNS['noRelevant']}d", "Q's run"]),
                    ('advanced', ['unweighted', f"{AWS['weights'][1]} weights", 'equal-width', AWS['edgeRule'],
                                  '1 closes the last bin', 'eq. 7', 'factor 2', 'twice the pooled within-bin covariance'])):
    for w in words:
        if w not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not state "{w}"')
if AWS['weights'][0] != 'none' or len(AWS['weights']) != 2:
    bad.append(f"AWKA weights {AWS['weights']} are not none and one weighted form, as the prompt says")
if not NNS['paired'] or NNS['ndcgGrade'] != 1 or 'grade 1' not in NNS['bootMetric']:
    bad.append('NNEWI bootstrap settings differ from the prompt')
for tier in TIERS:
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')

# WBC IS NAMED AS THE PAPER LABELS IT, never as the covariance itself.
for label, text in [('advanced prompt', PROMPTS['advanced']), ('awka_wbc_bins8 label', LABELS['awka_wbc_bins8'][0])]:
    if 'twice the pooled within-bin covariance' not in text:
        bad.append(f'{label} does not name WBC as twice the pooled within-bin covariance')
    if re.search(r'2\s*WBC|WBC\s*/\s*2', text):
        bad.append(f'{label} writes the identity or WBC with a further 2')

# THE VOCABULARY AND THE COPY RULE, over every prompt, dataset, title and label.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    if re.search(r'\bAI\b|AI-powered|artificial intelligence', text, re.I):
        out.append(f'{label} carries an AI claim')
    if re.search(r'\bhallucinat', text, re.I):
        out.append(f'{label} says hallucination where the course says unsupported claim')
    if re.search(r'\bprobability score|score is a probability', text, re.I):
        out.append(f'{label} calls a probability a score')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered model', 'AI claim'), ('a hallucination rate', 'hallucination'),
                    ('a split — whole', 'dash'), ('the test queries, not the training queries', 'contrastive')):
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
# The generator seeds are never handed in a prompt, label or title.
PROMPT_NUMS = {abs(float(tok)) for t in TIERS for tok in NUM.findall(PROMPTS[t] + TIER[t][1] + TIER[t][2])}
PROMPT_NUMS |= {abs(float(tok)) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]))}
leak = sorted(float(s) for s in GEN_SEEDS if float(s) in PROMPT_NUMS)
if leak:
    bad.append(f'a generator seed is handed in a prompt or label: {leak}')

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
    print(f'engine run: 18 of 18 fields.json values equal what d5_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'case-file inputs re-read and equal to the engine run: {CHECKED}')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in prompts, labels and case files: {len(handed)}')
    print('handed + pairwise + digest collisions + generator seeds + settings + WBC labelling + precision + vocabulary + copy rule: 0')
