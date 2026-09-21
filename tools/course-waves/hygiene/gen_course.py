#!/usr/bin/env python3
"""Generate the H2 course + capstone migration from the ENGINE'S OWN RUN, so no
expected value and no condition is retyped.

Modelled on tools/course-waves/safetystats/gen_course.py (H1, the sibling HSE
course), which is modelled on the Facilities and Assurance generators. The
differences H2 forces are all in what is ENFORCED, and they are these:

1. THE ENGINE IS RUN HERE. `node h2_capstone.mjs --json` is executed through the
   vendored engines/hse/exposure.js (H2_ENGINES) and the one tolerance module
   (H2_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. fields.json is written by
   make_fields.mjs from the same generator, so a disagreement means one of the
   two is stale, and a stale answer key is the one defect nothing downstream can
   see. gen_golive.py imports this module and takes its engine values from THIS
   run, which is the engine ledger the go-live checks the seeded rows against.

2. THE CONDITIONS ARE READ OUT OF THE SAME GENERATOR. `h2_capstone.mjs --inputs`
   prints the three frozen scenarios the engine was run on (UTOROGU, AMUKPE and
   OSIOKA), and every prompt below is RENDERED from them. A self check then
   proves that every number the engine was handed, down to each period's sound
   level, concentration, temperature, metabolic rate and duration, is stated as
   a learner reads it in its own tier's prompt, and that each period is stated
   with its own values TOGETHER, so a transposed period is refused and not only
   a missing number.

3. THE VOCABULARY DIGEST SECTION 24 LEGISLATES IS ENFORCED ON EVERY PROMPT,
   TITLE, DATASET AND LABEL, by the same seven rules gate_vocabulary.py applies
   to the lessons and the banks: never a bare "dose" (it is always a "noise
   dose"), never an unqualified "exposure", never a "noise level" or a "noise
   reading" for a reading (a reading is a sound level), never a bare "exchange
   rate" (it is a "decibel exchange rate"), never a bare "heat" (it is "heat
   stress"), and never a bare "REL" (there are two, the NIOSH noise REL and the
   NIOSH heat REL). Each rule is PLANTED once and must be caught, so a sweep
   that has stopped matching fails here rather than passing quietly. The copy
   rule is enforced beside it: no em dash, no en dash and no "X, not Y".

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json, and
   not assumed. Every H2 class (dba, pct, min, ppm, ratio, degC, watt) prints to
   six decimals, so every prompt asks for six and for nothing else, and a class
   whose printed precision could not satisfy its own tolerance is refused.

5. THE DOMAIN LINE THIS COURSE IS BUILT ON IS ENFORCED AS A RULE, not left to a
   reviewer: no graded field may pass through a NIOSH heat RAL or REL equation,
   a margin against either, an exceedance verdict, or a wet bulb globe
   temperature built from thermometer readings. The two heat fields are
   one-hour time weighted averages of STATED readouts. This file refuses a
   graded key, label or unit that names a limit, a margin or a verdict, and
   refuses a prompt that asks a learner for one.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships, because a sweep at a tighter stated tolerance would pass a
collision the shipped grade would hit.

Usage: python3 gen_course.py
   H2_WAVE        the wave directory (default /root/hse-wip-hygiene)
   H2_REPO        the nextgen clone   (default /root/wt-h2-nextgen)
   H2_ENGINES     packages/engines to run the capstone through (default $H2_REPO/packages/engines)
   H2_TOLERANCE   gradedTolerance.js (default the one in $H2_REPO)
   H2_COURSE_OUT  where to write      (default $H2_REPO/migrations/...)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('H2_WAVE', '/root/hse-wip-hygiene')
REPO = os.environ.get('H2_REPO', '/root/wt-h2-nextgen')
ENGINES = os.environ.get('H2_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'H2_TOLERANCE', f'{REPO}/src/components/course/panels/hygiene/gradedTolerance.js')
OUT = os.environ.get('H2_COURSE_OUT', f'{REPO}/migrations/20261004_h2_hygiene_course.sql')

SLUG, MODULE, PATH_ORDER = 'hygiene', 'hse', 62
NAME = 'Occupational Hygiene: Noise, Chemical & Heat Exposure'
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
bad = []

# The name is READ from wave.json and never retyped; NAME above is the value
# this generator was written against, and a disagreement is a refusal rather
# than a silent rename.
for what, got, want in (('slug', wave['slug'], SLUG), ('module', wave['module'], MODULE),
                        ('pathOrder', wave['pathOrder'], PATH_ORDER), ('name', wave['name'], NAME),
                        ('prefix', wave['prefix'], 'h2'), ('prerequisite', wave['prerequisite'], None)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# THE ENGINE RUN. Every call goes through the vendored engine the committed tree
# carries; the environment is passed explicitly so a run staged by gen_seeds.sh
# cannot reach back out to a working tree.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, H2_ENGINES=ENGINES, H2_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/h2_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/h2_capstone.mjs'))
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

U, A, OS = INPUTS['UTOROGU'], INPUTS['AMUKPE'], INPUTS['OSIOKA']


def n(x):
    """A measured quantity as a learner reads it: the shortest decimal that
    reads back as this exact number, with a whole number printed whole."""
    if isinstance(x, bool) or not isinstance(x, (int, float)):
        sys.exit(f'REFUSED: {x!r} is not a number and cannot be stated in a prompt')
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    return repr(float(x))


# ---------------------------------------------------------------------------
# THE PERIOD LINES, built once from the engine's own inputs and used BOTH to
# render the prompt and to check it. Each line carries the numbers of one
# period together, so a transposed period is caught and not only a missing one.
# ---------------------------------------------------------------------------
def lines(items, render):
    return [render(i, it) for i, it in enumerate(items, 1)]


U_PERIODS = lines(U['periods'], lambda i, p: f"period {i}, {n(p['levelDbA'])} dBA for {n(p['durationH'])} hours")
A_TASKS = lines(A['tasks'], lambda i, p: f"task {i}, {n(p['laeqDbA'])} dBA for {n(p['durationH'])} hours")
A_BENZ = lines(A['benzene'], lambda i, p: f"sample {i}, {n(p['concentration'])} ppm for {n(p['durationH'])} hours")
A_STEL = lines(A['tolueneShortTerm'], lambda i, p: f"reading {i}, {n(p['concentration'])} ppm for {n(p['durationMin'])} minutes")
A_MIX = lines(A['mixture'], lambda i, c: f"{c['name']} at {n(c['concentration'])} ppm against a limit of {n(c['limit'])} ppm")
OS_HEAT = [f"period {i}, {n(w['wbgtC'])} degrees C at {n(m['metabolicRateW'])} watts for {n(w['durationMin'])} minutes"
           for i, (w, m) in enumerate(zip(OS['wbgtReadouts'], OS['metabolic']), 1)]
OS_DOSI = lines(OS['dosimeter'], lambda i, p: f"period {i}, {n(p['levelDbA'])} dBA for {n(p['durationH'])} hours")
OS_SOLV = lines(OS['solvents'], lambda i, c: f"{c['name']} at {n(c['concentration'])} ppm against a limit of {n(c['limit'])} ppm")

for i, (w, m) in enumerate(zip(OS['wbgtReadouts'], OS['metabolic']), 1):
    if w['durationMin'] != m['durationMin']:
        bad.append(f'OSIOKA period {i} is logged for {w["durationMin"]} minutes of temperature and '
                   f'{m["durationMin"]} of metabolic rate, and one line states both')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity, says which of the
# three criteria or which of two same-unit quantities it is, and carries its
# unit beside it.
# ---------------------------------------------------------------------------
LABELS = {
    'utorogu_osha_pel_dose_pct':
        ('The noise dose of the day on the OSHA permissible exposure limit setup', 'percent'),
    'utorogu_osha_pel_twa_dba':
        ('The time weighted average sound level that noise dose corresponds to on the OSHA permissible exposure limit setup', 'dBA'),
    'utorogu_action_level_dose_pct':
        ('The noise dose of the same day on the OSHA action level setup', 'percent'),
    'utorogu_niosh_rel_dose_pct':
        ('The noise dose of the same day on the NIOSH noise REL setup', 'percent'),
    'utorogu_niosh_rel_twa_dba':
        ('The time weighted average sound level on the NIOSH noise REL setup', 'dBA'),
    'utorogu_pel_minutes_left_min':
        ('The minutes still available at the loudest sound level of the day once the OSHA permissible exposure limit noise dose is spent', 'minutes'),
    'amukpe_lex_8h_dba':
        ('The daily noise exposure level LEX,8h of the survey day', 'dBA'),
    'amukpe_lex_weekly_dba':
        ('The weekly noise exposure level over the five stated daily values', 'dBA'),
    'amukpe_field_derated_exposure_dba':
        ('The sound level under the earmuff by the OSHA fifty percent field derating', 'dBA'),
    'amukpe_benzene_twa8h_ppm':
        ('The eight-hour time weighted average benzene concentration', 'ppm'),
    'amukpe_toluene_stel_ppm':
        ('The fifteen-minute short term average toluene concentration', 'ppm'),
    'amukpe_mixture_index':
        ('The additive mixture index of the three solvents against the limits as typed', 'index'),
    'osioka_wbgt_twa_c':
        ('The one-hour time weighted average of the three stated wet bulb globe temperature readouts', 'degrees C'),
    'osioka_metabolic_twa_w':
        ('The one-hour time weighted average of the three stated metabolic rates', 'watts'),
    'osioka_extended_action_level_dba':
        ('The OSHA action level for this shift, which is longer than eight hours', 'dBA'),
    'osioka_extended_action_dose_pct':
        ('The noise dose of the whole shift on the OSHA action level setup', 'percent'),
    'osioka_adjusted_limit_ppm':
        ('The xylene limit multiplied by the governing Brief and Scala reduction factor', 'ppm'),
    'osioka_adjusted_mixture_index':
        ('The additive mixture index of the three solvents against the adjusted limits', 'index'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
UTOROGU_TEXT = (
    f"UTOROGU, a gas compressor house. One operator wore a dosimeter for a full shift of eight "
    f"hours, logged as five periods. Each period carries the A-weighted sound level the instrument "
    f"recorded and how long it lasted: {'; '.join(U_PERIODS)}. The loudest sound level of the day is "
    f"{n(U['loudestDbA'])} dBA. Read this one record three ways. The OSHA permissible exposure limit "
    f"setup has a criterion of 90 dBA, a decibel exchange rate of 5 dB and a threshold of 90 dBA. "
    f"The OSHA action level setup has the same criterion of 90 dBA and the same decibel exchange "
    f"rate of 5 dB, a threshold of 80 dBA and a limit of 50 percent. The NIOSH noise REL setup has a "
    f"criterion of 85 dBA, a decibel exchange rate of 3 dB and a threshold of 80 dBA. A period whose "
    f"sound level is under a setup's threshold is not integrated by that setup at all. The reference "
    f"duration at a sound level is eight hours divided by 2 raised to the level less the criterion "
    f"over the decibel exchange rate. Use the coefficients the sources print when you turn a noise "
    f"dose into a time weighted average sound level: 16.61 for the two OSHA setups and 10.0 for the "
    f"NIOSH noise REL setup.")
AMUKPE_TEXT = (
    f"AMUKPE, a maintenance crew on a floating production vessel. A task-based survey covered one "
    f"working day in five tasks, each with the A-weighted equivalent sound level and its length: "
    f"{'; '.join(A_TASKS)}. The daily figure wanted is LEX,8h, which counts every task, has no "
    f"threshold and normalises to eight hours whatever the day was. The same worker's five daily "
    f"values for the week are {', '.join(n(x) for x in A['weekLexDbA'][:-1])} and "
    f"{n(A['weekLexDbA'][-1])} dBA, and the weekly figure is taken over the statutory divisor of "
    f"five days. A dosimeter on the same worker returned an OSHA permissible exposure limit noise "
    f"dose of {n(A['dosimeterPelDosePct'])} percent; turn that into a time weighted average sound "
    f"level with the printed coefficient 16.61 on the criterion of 90 dBA before any protector "
    f"credit is taken. The earmuff issued carries a labelled noise reduction rating of "
    f"{n(A['earmuffNrrDb'])} dB, and the estimate wanted is the OSHA fifty percent field derating "
    f"for A-weighted data, which credits half of the labelled rating less seven. Three personal air "
    f"samples follow. Benzene, over part of the shift: {'; '.join(A_BENZ)}. The unsampled part of "
    f"the shift counts as zero and the divisor is the eight hours the regulation writes. Toluene, "
    f"short term: {'; '.join(A_STEL)}. The remainder of the fifteen-minute window counts as zero. "
    f"The mixture, each limit typed as an input: {'; '.join(A_MIX)}.")
OSIOKA_TEXT = (
    f"OSIOKA, a flow station turnaround in the hot season. The crew works shifts of "
    f"{n(OS['shiftHours'])} hours, four a week, so {n(OS['weeklyHours'])} hours in the week. The "
    f"hardest hour of the shift is logged as three work periods, each carrying the wet bulb globe "
    f"temperature the instrument read out and the metabolic rate the task table gives: "
    f"{'; '.join(OS_HEAT)}. Those readouts are stated, so nothing here has to be built from a globe, "
    f"a natural wet bulb and a dry bulb reading. A dosimeter covered the whole shift on the OSHA "
    f"action level setup, a criterion of 90 dBA, a decibel exchange rate of 5 dB and a threshold of "
    f"80 dBA: {'; '.join(OS_DOSI)}. The whole shift is summed as it stands, with no rescaling to "
    f"eight hours. For a shift longer than eight hours the OSHA action level is 16.61 times the "
    f"base 10 logarithm of 50 divided by 12.5 times the shift hours, plus 90. Full-shift average "
    f"concentrations of three solvents, each limit typed as an input: {'; '.join(OS_SOLV)}. The "
    f"xylene limit of {n(OS['xyleneLimitPpm'])} ppm is the one to adjust. The Brief and Scala daily "
    f"reduction factor is 8 over the shift hours, times 24 less the shift hours, over 16; the weekly factor is "
    f"40 over the weekly hours, times 168 less the weekly hours, over 128. Each factor is capped at "
    f"1 and the more protective of the two governs.")

TIER = {
    'beginner': (
        'associate',
        "UTOROGU, one operator's eight-hour dosimeter day in a gas compressor house",
        'What the noise dose is, once the criterion is named',
        UTOROGU_TEXT + " Report six values: the noise dose of the day on the OSHA permissible "
                       "exposure limit setup, as a percentage; the time weighted average sound "
                       "level that noise dose corresponds to on the same setup; the noise dose of "
                       "the same day on the OSHA action level setup; the noise dose of the same day "
                       "on the NIOSH noise REL setup; the time weighted average sound level on the "
                       "NIOSH noise REL setup; and the minutes still available at the loudest sound "
                       "level of the day once the OSHA permissible exposure limit noise dose is "
                       "spent, which is one less that noise dose as a fraction, times the reference "
                       "duration at that sound level, times sixty. The three noise doses as "
                       "percentages, the two sound levels in dBA and the last value in minutes, all "
                       "to six decimals."),
    'intermediate': (
        'professional',
        'AMUKPE, a maintenance crew on a floating production vessel, with a survey, a week of daily values and three personal air samples',
        'Protection and chemicals, each on the metric its own source prints',
        AMUKPE_TEXT + " Report six values: the daily LEX,8h of the survey day; the weekly value over "
                      "the five stated days; the sound level under the earmuff by the OSHA fifty "
                      "percent field derating; the eight-hour time weighted average benzene "
                      "concentration; the fifteen-minute short term average toluene concentration; "
                      "and the additive mixture index of the three solvents against the limits as "
                      "typed. The two LEX values and the derated sound level in dBA, the two "
                      "concentrations in ppm and the index as a plain number, all to six decimals."),
    'advanced': (
        'expert',
        'OSIOKA, a hot-season turnaround on extended shifts, with stated heat stress readouts and a full-shift dosimeter record',
        'The shift that is not eight hours, and the readings a heat stress assessment starts from',
        OSIOKA_TEXT + " Report six values: the one-hour time weighted average of the three stated "
                      "wet bulb globe temperature readouts; the one-hour time weighted average of "
                      "the three stated metabolic rates; the OSHA action level for this shift; the "
                      "noise dose of the whole shift on the OSHA action level setup; the xylene "
                      "limit multiplied by the governing Brief and Scala reduction factor; and the "
                      "additive mixture index of the three solvents against limits each multiplied "
                      "by that same governing factor. The temperature in degrees C, the metabolic "
                      "rate in watts, the action level in dBA, the noise dose as a percentage, the "
                      "adjusted limit in ppm and the index as a plain number, all to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = """-- ============================================================================
-- H2: Occupational Hygiene: Noise, Chemical & Heat Exposure joins the
-- catalogue, the SECOND course of the HSE module.
--
-- Catalogue row (module 'hse'; path_order 62, directly above the HSE module's
-- own safetystats at 61; prereq_slug NULL, the carried-over answer "no hard
-- prerequisite inside a module"; school left at its default, as every
-- Facilities, Economics, Assurance and HSE course leaves it, so the fees are
-- the published school-level rows) plus the three capstones and their eighteen
-- graded fields, generated by tools/course-waves/hygiene/gen_course.py from the
-- ENGINE'S OWN RUN (h2_capstone.mjs through the vendored engines/hse/exposure.js,
-- sha-identical with petrolord-engines b43f1d9), which it refuses to write
-- unless fields.json carries exactly that run's values and the tolerance
-- gradedTolerance.js derives. Deep seeds are three separate migrations; the
-- go-live is a fifth and is HELD until a NextGen production upload carries the
-- route /dashboard/apps/hygiene, because the 78 lessons, the teaching lab and
-- its three explorer panels ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. An exposure figure is a measurement read
-- against a criterion and it means nothing until the criterion is named, so the
-- course teaches what the noise dose is once the criterion is named
-- (Associate), how protection and chemical averages are each computed on the
-- metric their own source prints (Professional), and what a shift that is not
-- eight hours does to a trigger, a limit and a mixture (Expert).
--
-- THE ENGINE. engines/hse/exposure.js, vendored sha-identical with
-- petrolord-engines b43f1d9. It imports nothing and embeds no licensed limit
-- table: every limit in this course is typed as an input from a public OSHA or
-- NIOSH value. The reference duration, the noise dose, the printed
-- dose-to-average coefficients 16.61 and 10.0, the threshold that decides what
-- is integrated at all, LEX,8h, the protector methods, the chemical averages,
-- the mixture index and the Brief and Scala reduction factors are each
-- reproduced by a value their own source prints.
--
-- WHAT IS GRADED, AND THE LINE THIS COURSE DOES NOT CROSS. UTOROGU (Associate)
-- grades three noise doses under three named criteria, the two time weighted
-- average sound levels two of them correspond to, and the minutes still
-- available at the loudest sound level. AMUKPE (Professional) grades a daily
-- and a weekly LEX, the OSHA fifty percent field derated sound level, an
-- eight-hour and a fifteen-minute chemical average and a mixture index. OSIOKA
-- (Expert) grades two one-hour time weighted averages of STATED readouts, the
-- extended-shift action level, the whole-shift noise dose, one adjusted limit
-- and the mixture index against the adjusted limits.
--
-- NO graded field passes through a NIOSH heat recommended alert limit or
-- recommended exposure limit, a margin against either, an exceedance verdict,
-- or a wet bulb globe temperature built from thermometer readings. Those
-- equations and those weights are TAUGHT and checked for transcription only:
-- no public printed value reproduces them, and NIOSH's own worked example
-- disagrees with its own section 8.1 equation, so a learner following the
-- document's own figure would be marked wrong. The NIOSH derating by protector
-- type, OSHA dual protection and the Brief and Scala weekly factor on its own
-- are taught and graded nowhere. The generator refuses a key, a label, a unit
-- or a prompt that crosses that line.
--
-- All eighteen graded values were swept against every number the digest prints
-- and against every number handed to a learner in a prompt, a dataset, a title
-- or a label, at each field's own shipped tolerance: 0 collisions, and 0
-- pairwise. No prompt states another tier's graded value.
-- ============================================================================"""

lines_out = [HEADER, '',
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
lines_out.append(',\n'.join(blocks))
lines_out.append('on conflict (app_slug, tier) do nothing;')
SQL = '\n'.join(lines_out) + '\n'

# --------------------------------------------------------------- self checks
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')

# EVERY CONDITION THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, as a learner
# reads it. Every numeric leaf of the scenario is found as a standalone number in
# its own tier's prompt, and every named period is found with ITS OWN numbers
# together, so a transposed period is refused and not only a missing number.
SCENARIO = {'beginner': U, 'intermediate': A, 'advanced': OS}


def leaves(node, path='', out=None):
    out = [] if out is None else out
    if isinstance(node, dict):
        for k, v in node.items():
            leaves(v, f'{path}.{k}', out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            leaves(v, f'{path}[{i}]', out)
    else:
        out.append((path, node))
    return out


for tier in TIERS:
    text = PROMPTS[tier]
    for path, v in leaves(SCENARIO[tier]):
        if isinstance(v, str):
            if v not in text:
                bad.append(f'{tier} prompt does not name {path} = {v!r}, which the engine ran')
        elif not re.search(rf'(?<![\d.]){re.escape(n(v))}(?![\d.])', text):
            bad.append(f'{tier} prompt does not state {path} = {n(v)}, which the engine ran')

PERIOD_LINES = {
    'beginner': [('UTOROGU dosimeter', U_PERIODS, r'period \d+, [\d.]+ dBA for ')],
    'intermediate': [('AMUKPE tasks', A_TASKS, r'task \d+, [\d.]+ dBA for '),
                     ('AMUKPE benzene samples', A_BENZ, r'sample \d+, [\d.]+ ppm for '),
                     ('AMUKPE short term readings', A_STEL, r'reading \d+, [\d.]+ ppm for '),
                     ('AMUKPE mixture components', A_MIX, r'\bat [\d.]+ ppm against a limit of ')],
    'advanced': [('OSIOKA one-hour periods', OS_HEAT, r'period \d+, [\d.]+ degrees C at '),
                 ('OSIOKA dosimeter', OS_DOSI, r'period \d+, [\d.]+ dBA for '),
                 ('OSIOKA solvents', OS_SOLV, r'\bat [\d.]+ ppm against a limit of ')],
}
for tier, groups in PERIOD_LINES.items():
    for what, items, marker in groups:
        for line in items:
            if line not in PROMPTS[tier]:
                bad.append(f'{tier}: the {what} line {line!r} is not in the rendered prompt')
        if len(re.findall(marker, PROMPTS[tier])) != len(items):
            bad.append(f'{tier} prompt carries a different number of {what} from the engine run')

# THE LINE THIS COURSE DOES NOT CROSS (BRIEF.md, digest sections 9 and 23): no
# graded field may be a heat limit, a margin against one, an exceedance verdict,
# or a wet bulb globe temperature built from thermometer readings.
FORBIDDEN = [
    ('a NIOSH heat recommended alert limit', r'\bRAL\b|recommended alert limit'),
    ('a NIOSH heat REL or a margin against one', r'NIOSH heat REL|\bmargin\b'),
    ('an exceedance verdict', r'\bexceeds?\b|\bexceedance\b|\bverdict\b'),
    ('a wet bulb globe temperature built from thermometer readings',
     r'natural wet bulb|globe temperature (?:from|built)|dry bulb'),
]
for k in KEYS:
    hay = f'{k} {LABELS[k][0]} {LABELS[k][1]}'
    for what, rx in FORBIDDEN:
        if re.search(rx, hay, re.I):
            bad.append(f'{k} is graded and its key, label or unit reads as {what}, which this course never grades')
for tier in TIERS:
    ask = PROMPTS[tier].split('Report six values:', 1)[-1]
    for what, rx in FORBIDDEN:
        if re.search(rx, ask, re.I):
            bad.append(f'the {tier} prompt asks a learner for {what}, which this course never grades')

# THE VOCABULARY DIGEST SECTION 24 LEGISLATES, AND THE COPY RULE, over every
# prompt, dataset, title and label a learner reads. The seven rules are the
# seven gate_vocabulary.py applies to the lessons and the banks.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]

VOCAB = [
    ('bare dose', re.compile(r'(?<!noise )\bdoses?\b', re.I)),
    ('bare exposure', re.compile(
        r'(?<!noise )(?<!chemical )(?<!heat )\bexposures?\b'
        r'(?! (?:limits?|points|index|action values?|limit values?)\b)', re.I)),
    ('noise for a reading', re.compile(r'\bnoise (?:levels?|readings?)\b', re.I)),
    ('bare exchange rate', re.compile(r'(?<!decibel )\bexchange rates?\b(?! of \d+(?:\.\d+)? dB)', re.I)),
    ('bare heat', re.compile(r'\bheat\b(?! (?:stress|exposures?|REL)\b)', re.I)),
    ('bare REL', re.compile(r'(?<!noise )(?<!heat )\bRELs?\b')),
]
COPY = [('an en or em dash', re.compile('[–—]')),
        ('an "X, not Y" contrastive', re.compile(r',\s+not\s+\w'))]


def vocabulary(text):
    """Every section 24 rule and every copy rule this text breaks, by name."""
    return [rule for rule, rx in VOCAB + COPY if rx.search(text)]


for label, text in READ:
    for rule in vocabulary(text):
        bad.append(f'{label} carries {rule}, which digest section 24 or the copy rule forbids')
# THE SWEEP MUST BE ABLE TO FIRE: every rule is planted once and must be caught
# BY ITS OWN NAME, so a rule whose pattern has stopped matching fails here.
for plant, rule in (('the dose of the day', 'bare dose'),
                    ('a financial exposure of 40 million', 'bare exposure'),
                    ('the noise level the meter read', 'noise for a reading'),
                    ('the exchange rate is 5', 'bare exchange rate'),
                    ('the heat in the compressor house', 'bare heat'),
                    ('the REL is 85 dBA', 'bare REL'),
                    ('a sound level — pooled', 'an en or em dash'),
                    ('the sound level, not the reading', 'an "X, not Y" contrastive')):
    if rule not in vocabulary(plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')

for tier in TIERS:
    if PROMPTS[tier].count('Report six values') != 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')

# NUMBERS HANDED TO A LEARNER, every tier's prompt, dataset, title and label
# against every graded value of EVERY tier, at the shipped tolerance, with
# thousands separators stripped the way a learner would read them. A different
# tier is a leak; the same tier is a transcription. Both are refused.
NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall(PROMPTS[t].replace(',', ''))]
handed += [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall((TIER[t][1] + ' ' + TIER[t][2]).replace(',', ''))]
handed += [(TIER_OF[k], abs(float(tok))) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]).replace(',', ''))]
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} capstone text')
for a in range(len(fields)):
    for b in range(a + 1, len(fields)):
        if abs(abs(fields[a][2]) - abs(fields[b][2])) <= max(fields[a][3], fields[b][3]):
            bad.append(f'pairwise: {fields[a][1]} and {fields[b][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of one
# of them is a lookup rather than a calculation.
DIGEST_NUMS = sorted({abs(float(tok)) for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read())})
if len(DIGEST_NUMS) < 300:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read, so the digest sweep is reading the wrong thing')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST ASK FOR EXACTLY THE DECIMALS ITS FIELDS ARE GRADED TO, read
# out of precision.json and never assumed.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', PROMPTS[tier]) if w in WORD_N})
    needed = set()
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes, not exactly one')
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
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print(f'engine run: 18 of 18 fields.json values equal what h2_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'engine conditions found in their own prompts: '
          f'{sum(1 for t in TIERS for _p, v in leaves(SCENARIO[t]) if not isinstance(v, str))} numbers, '
          f'{sum(1 for t in TIERS for _p, v in leaves(SCENARIO[t]) if isinstance(v, str))} names and '
          f'{sum(len(items) for g in PERIOD_LINES.values() for _w, items, _m in g)} period lines')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in the capstone text: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule + the heat line: 0')
