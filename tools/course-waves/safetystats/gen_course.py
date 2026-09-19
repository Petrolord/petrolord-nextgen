#!/usr/bin/env python3
"""Generate the H1 course + capstone migration from the ENGINE'S OWN RUN, so no
expected value and no condition is retyped.

Modelled on tools/course-waves/corrosion/gen_course.py (FC9) and the Assurance
generators (riskchange, compliance), with the differences H1 forces:

1. THE ENGINE IS RUN HERE. `node h1_capstone.mjs --json` is executed through the
   vendored engines/hse/safetyStats.js (H1_ENGINES) and the one tolerance module
   (H1_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. fields.json is written by
   make_fields.mjs from the same generator, so a disagreement means one of the
   two is stale, and a stale answer key is the one defect nothing downstream
   can see. gen_golive.py imports this module and takes its engine values from
   THIS run, which is the engine ledger the go-live checks the seeded rows
   against.

2. THE CONDITIONS ARE READ OUT OF THE SAME GENERATOR. `h1_capstone.mjs
   --inputs` prints the three frozen scenarios the engine was run on (OKRIKA,
   BONNY, FORCADOS), and every prompt below is RENDERED from them. A self check
   then proves every count and every hour figure the engine ran is stated, as
   a learner reads it, in its own tier's prompt, so a prompt cannot drift from
   the numbers that were graded.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 28) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: never a bare "Poisson", never a bare "severity",
   no P label anywhere, and FAR written as the observed FAR. The copy rule too:
   no em or en dash and no "X, not Y" contrastive.

4. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every H1 class (rate, ratio, p) prints to six decimals, so every prompt asks
   for six and for nothing else.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships, because a sweep at a tighter stated tolerance would pass a
collision the shipped grade would hit.

Usage: python3 gen_course.py
   H1_WAVE        the wave directory (default /root/hse-wip-safetystats)
   H1_REPO        the nextgen clone   (default /root/wt-h1-nextgen)
   H1_ENGINES     packages/engines to run the capstone through (default $H1_REPO/packages/engines)
   H1_TOLERANCE   gradedTolerance.js (default the one in $H1_REPO)
   H1_COURSE_OUT  where to write      (default $H1_REPO/migrations/...)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('H1_WAVE', '/root/hse-wip-safetystats')
REPO = os.environ.get('H1_REPO', '/root/wt-h1-nextgen')
ENGINES = os.environ.get('H1_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'H1_TOLERANCE', f'{REPO}/src/components/course/panels/safetystats/gradedTolerance.js')
OUT = os.environ.get('H1_COURSE_OUT', f'{REPO}/migrations/20261003_h1_safetystats_course.sql')

SLUG, MODULE, PATH_ORDER = 'safetystats', 'hse', 61
NAME = 'Safety Performance Statistics & KPIs'
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
# THE ENGINE RUN. Both calls go through the vendored engine the committed tree
# carries; the environment is passed explicitly so a run staged by gen_seeds.sh
# cannot reach back out to a working tree.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, H1_ENGINES=ENGINES, H1_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *( [script] if script else [] ), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/h1_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/h1_capstone.mjs'))
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

O, B, FC = INPUTS['OKRIKA'], INPUTS['BONNY'], INPUTS['FORCADOS']


def i(x):
    """A count or an hour figure as a learner reads it: a whole number, no
    separators, exactly as the digest prints stated hours."""
    if not (isinstance(x, int) or float(x).is_integer()):
        sys.exit(f'REFUSED: {x} is not a whole number and would not print as one')
    return str(int(x))


def series(counts, hours):
    """Month 1 carries its nouns in full and every later month is read the same
    way: count, then hours."""
    first = (f'month 1, {i(counts[0])} recordable {"case" if counts[0] == 1 else "cases"} '
             f'in {i(hours[0])} hours')
    rest = [f'month {n}, {i(c)} in {i(h)}' for n, (c, h) in enumerate(zip(counts, hours), 1) if n > 1]
    return '; '.join([first] + rest)


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity, the base it is
# read on, and where the tier turns on it, WHICH of two same-unit quantities it
# is: an interval's lower limit and its upper, a centre line and its revision,
# a p-value with the flagged month and without it.
# ---------------------------------------------------------------------------
LABELS = {
    'okrika_combined_trir_per_200k':
        ('The combined recordable rate of employees and contractors per 200,000 hours', 'per 200,000 hours'),
    'okrika_combined_ltir_per_1m':
        ('The combined lost time injury rate per 1,000,000 hours', 'per 1,000,000 hours'),
    'okrika_far_per_100m':
        ('The observed FAR, fatalities per 100,000,000 hours', 'per 100,000,000 hours'),
    'okrika_severity_rate_per_200k':
        ('The severity rate, days lost per 200,000 hours', 'days per 200,000 hours'),
    'okrika_tier1_pse_rate_per_200k':
        ('The Tier 1 process safety event rate per 200,000 hours', 'per 200,000 hours'),
    'okrika_rolling12_trir_month14_per_200k':
        ('The rolling twelve-month recordable rate for the window that ends at month 14', 'per 200,000 hours'),
    'bonny_alpha_trir_lower95_per_200k':
        ("The lower limit of the 95 percent confidence interval on Alpha's recordable rate", 'per 200,000 hours'),
    'bonny_alpha_trir_upper95_per_200k':
        ("The upper limit of the 95 percent confidence interval on Alpha's recordable rate", 'per 200,000 hours'),
    'bonny_crew_zero_event_upper95_per_200k':
        ("The upper limit of the 95 percent confidence interval on the small crew's rate, with no recordable case", 'per 200,000 hours'),
    'bonny_rate_ratio_lower95':
        ("The lower limit of the 95 percent confidence interval on the rate ratio, Alpha's rate over Beta's", 'ratio'),
    'bonny_rate_ratio_upper95':
        ("The upper limit of the 95 percent confidence interval on the rate ratio, Alpha's rate over Beta's", 'ratio'),
    'bonny_compare_p_value':
        ('The two-sided p-value the engine reports for Alpha against Beta', 'probability'),
    'forcados_centre_per_200k':
        ('The u-chart centre line', 'per 200,000 hours'),
    'forcados_ucl_month09_per_200k':
        ('The upper control limit at month 9', 'per 200,000 hours'),
    'forcados_lcl_month07_per_200k':
        ('The lower control limit at month 7', 'per 200,000 hours'),
    'forcados_revised_centre_per_200k':
        ('The centre line recomputed without the month the chart signals on', 'per 200,000 hours'),
    'forcados_before_after_p_value':
        ('The two-sided p-value for months 7 to 12 against months 1 to 6', 'probability'),
    'forcados_before_after_p_value_without_month06':
        ('The same p-value with the signalling month left out of months 1 to 6', 'probability'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs.
# ---------------------------------------------------------------------------
OKRIKA_TEXT = (
    f"OKRIKA, an export terminal. Its annual safety report for the calendar year counts company "
    f"employees and contractors separately. Employees worked {i(O['employeeHours'])} hours and had "
    f"{i(O['employeeRecordables'])} recordable cases. Contractors worked {i(O['contractorHours'])} "
    f"hours and had {i(O['contractorRecordables'])} recordable cases. Across both workforces the year "
    f"had {i(O['lostTimeInjuries'])} lost time injuries, {i(O['fatalities'])} fatality, "
    f"{i(O['daysLost'])} days lost, {i(O['tier1Pse'])} Tier 1 process safety events and "
    f"{i(O['tier2Pse'])} Tier 2 process safety events, each event classified against API RP 754 "
    f"before it reached you. The fatality is already counted once among the recordable cases and "
    f"once among the lost time injuries, so it is added to neither count again. The terminal's "
    f"combined recordable cases and hours for fourteen months follow. Months 1 to 12 are the "
    f"calendar year above, and months 13 and 14 are the first two months of the next year: "
    f"{series(O['monthlyRecordables'], O['monthlyHours'])}.")
BONNY_TEXT = (
    f"BONNY, a terminal expansion where two contractor crews work the same scope and a small crew "
    f"works beside them. Crew Alpha recorded {i(B['alphaRecordables'])} recordable cases in "
    f"{i(B['alphaHours'])} hours. Crew Beta recorded {i(B['betaRecordables'])} recordable cases in "
    f"{i(B['betaHours'])} hours. The small crew recorded {i(B['crewRecordables'])} recordable cases in "
    f"{i(B['crewHours'])} hours. Treat each count as a draw from a Poisson count model, and work at "
    f"{i(round(B['confidence'] * 100))} percent confidence throughout.")
FORCADOS_TEXT = (
    f"FORCADOS, a producing field, charted month by month on a u-chart of recordable cases per "
    f"200,000 hours. Month 7 carried a turnaround and month 9 a shutdown, and an intervention went in "
    f"at the start of month 7. The twelve months, recordable cases then hours: "
    f"{series(FC['monthlyRecordables'], FC['monthlyHours'])}. The cause of any "
    f"month the chart signals on has been investigated and found, and it is one the intervention did "
    f"not produce. Compare the two halves at {i(round(FC['confidence'] * 100))} percent confidence.")

TIER = {
    'beginner': (
        'associate',
        "OKRIKA, an export terminal's annual safety report and fourteen months of recordable cases",
        'What the rate is, on the base the report names',
        OKRIKA_TEXT + " Report six values, each on the base named: the combined recordable rate of the "
                      "two workforces per 200,000 hours; the combined lost time injury rate per "
                      "1,000,000 hours; the observed FAR; the severity rate per 200,000 hours, with the "
                      "days lost as counted and no time charges added; the Tier 1 process safety event "
                      "rate per 200,000 hours; and the rolling twelve-month recordable rate per 200,000 "
                      "hours for the window that ends at month 14. All six to six decimals."),
    'intermediate': (
        'professional',
        'BONNY, two contractor crews on one scope and a small crew with no recordable case',
        'How sure each rate is, and whether the two crews differ',
        BONNY_TEXT + " Report six values: the lower limit of the confidence interval on Alpha's "
                     "recordable rate per 200,000 hours; the upper limit of that interval; the upper "
                     "limit of the confidence interval on the small crew's rate per 200,000 hours; the "
                     "lower limit of the confidence interval on the rate ratio, Alpha's rate over "
                     "Beta's; the upper limit of that interval; and the two-sided p-value the engine "
                     "reports for Alpha against Beta. The limits per 200,000 hours, the ratio limits as "
                     "plain numbers and the p-value as a probability, all to six decimals."),
    'advanced': (
        'expert',
        'FORCADOS, a year of monthly recordable cases on a u-chart around an intervention',
        'Whether anything is changing, and what one month does to the answer',
        FORCADOS_TEXT + " Report six values: the centre line; the upper control limit at month 9; the "
                        "lower control limit at month 7; the centre line recomputed without the month "
                        "the chart signals on; the two-sided p-value the engine reports for months 7 to "
                        "12 against months 1 to 6; and the same p-value with the signalling month left "
                        "out of months 1 to 6. The centre lines and limits per 200,000 hours and the "
                        "p-values as probabilities, all to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

HEADER = """-- ============================================================================
-- H1: Safety Performance Statistics & KPIs joins the catalogue, the FIRST
-- course of the HSE module.
--
-- Catalogue row (module 'hse'; path_order 61, directly above the Assurance
-- module's compliance at 60 and riskchange at 59; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module"; school left at
-- its default, as every Facilities, Economics and Assurance course leaves it,
-- so the fees are the published school-level rows) plus the three capstones
-- and their eighteen graded fields, generated by
-- tools/course-waves/safetystats/gen_course.py from the ENGINE'S OWN RUN
-- (h1_capstone.mjs through the vendored engines/hse/safetyStats.js), which it
-- refuses to write unless fields.json carries exactly that run's values and
-- the tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/safetystats, because the 78
-- lessons, the teaching lab (safetystatsLab.js) and its three explorer panels
-- ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A safety rate is a count divided by exposure
-- hours on a base somebody chose, so the course teaches what the rate is
-- (Associate), how sure it is (Professional) and whether anything is changing
-- (Expert), and grades each tier on its own question with numbers the engine
-- returns.
--
-- THE ENGINE. engines/hse/safetyStats.js, vendored sha-identical with
-- petrolord-engines 980199e. It imports nothing. The base is required, the
-- severity rate has no single standard, the API RP 754 tier is an input,
-- rates are summed then divided, the two-sided p-value is the CENTRAL one and
-- a signal lies strictly outside its limits.
--
-- WHAT IS GRADED. OKRIKA (Associate) grades six rates on stated bases and one
-- rolling window; BONNY (Professional) grades the Garwood limits, a zero-event
-- limit, a rate-ratio interval and the central p-value; FORCADOS (Expert)
-- grades a u-chart's centre and two limits, a revised centre and two
-- before-and-after p-values that disagree because of one month. Every value
-- is a return value of the engine, and every prompt is rendered from the
-- inputs the engine was run on.
--
-- All eighteen graded values were swept against every number the digest
-- prints and against every number handed to a learner in a prompt, at each
-- field's own shipped tolerance: 0 collisions, and 0 pairwise. No prompt
-- states another tier's graded value.
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

# --------------------------------------------------------------- self checks
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')

# EVERY CONDITION THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, as a learner
# reads it. The monthly series are checked pair by pair, so a transposed month
# is refused and not only a missing number.
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?![\d.])', PROMPTS[t].replace(',000', '000')) for t in TIERS}
for tier, obj in (('beginner', O), ('intermediate', B), ('advanced', FC)):
    for k, v in obj.items():
        if isinstance(v, list):
            continue
        want = i(round(v * 100)) if k == 'confidence' else i(v)
        if want not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {want}, which the engine ran')
for tier, obj in (('beginner', O), ('advanced', FC)):
    for n, (c, h) in enumerate(zip(obj['monthlyRecordables'], obj['monthlyHours']), 1):
        if not re.search(rf'month {n}, {c} (?:[a-z ]+ )?in {h}\b', PROMPTS[tier]):
            bad.append(f'{tier} prompt does not pair month {n} with {c} in {h}')
    if len(re.findall(r'\bmonth \d+, \d+ ', PROMPTS[tier])) != len(obj['monthlyHours']):
        bad.append(f'{tier} prompt carries a different number of months from the engine run')

# THE VOCABULARY (digest section 28) AND THE COPY RULE, over every prompt,
# dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    for m in re.finditer(r'\bPoisson\b', text):
        if not re.match(r'Poisson (distribution|count model)', text[m.start():]):
            out.append(f'{label} carries a bare "Poisson"')
    for m in re.finditer(r'\bseverity\b', text, re.I):
        if not re.match(r'severity rate', text[m.start():], re.I):
            out.append(f'{label} carries a bare "severity"')
    if re.search(r'\bP\s?\d{1,2}\b', text):
        out.append(f'{label} carries a P label')
    for m in re.finditer(r'\bFAR\b', text):
        if not text[max(0, m.start() - 9):m.start()].endswith('observed '):
            out.append(f'{label} writes FAR without "observed"')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
# The guard must be able to fire: every rule is planted once and must be caught.
for plant, rule in (('a Poisson draw', 'Poisson'), ('the severity of it', 'severity'),
                    ('the P90 figure', 'P label'), ('the FAR here', 'FAR'),
                    ('a rate — pooled', 'dash'), ('the pooled rate, not the mean', 'contrastive')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')

for tier in TIERS:
    if not PROMPTS[tier].count('Report six values') == 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')

# NUMBERS HANDED TO A LEARNER, every tier's prompt against every graded value
# of EVERY tier, at the shipped tolerance, with thousands separators stripped
# the way a learner would read them. A different tier is a leak; the same tier
# is a transcription.
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
    print(f'engine run: 18 of 18 fields.json values equal what h1_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'engine conditions found in their own prompts: '
          f'{sum(1 for o in (O, B, FC) for v in o.values() if not isinstance(v, list))} scalars and '
          f'{len(O["monthlyHours"]) + len(FC["monthlyHours"])} month pairs')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in the capstone text: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
