#!/usr/bin/env python3
"""Generate the compliance course + capstone migration from fields.json and
capstone.json, so no expected value, condition or prompt is retyped.

Modelled on tools/course-waves/heattransfer/gen_course.py (FC6) and on its
Assurance sibling tools/course-waves/riskchange/gen_course.py, with the
differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM. compliance_capstone.mjs writes
   the three prompts out of the capstone records (compliance_fields_capstone.mjs)
   into capstone.json, and every capstone gate on this wave (promptleak,
   capstone leak, copy rule) was run on exactly that text. So this generator
   types no prompt at all: it reads capstone.json and refuses a prompt that
   carries a newline, fails to state the as-of date, or does not end by asking
   for six whole numbers.

2. EVERY GRADED FIELD IS A WHOLE NUMBER AT TOLERANCE 0.5, because the NextGen
   grader (academy_submit_capstone) casts expected, tol and answer to numeric
   and compares |answer - expected| <= tol. No enum is graded and no date is
   graded as a date: a date the engine returns is graded as calendar.daysUntil
   from the as-of date. A tolerance other than 0.5 is refused here.

3. THE ENGINE IS RUN HERE, not remembered. `node compliance_capstone.mjs --json`
   re-derives all eighteen values through the vendored engines under the clock
   guard, and this refuses if fields.json disagrees with it by so much as one
   field. The same run yields the five dates the engine DERIVES on the way to a
   graded day count (a rolled due date, a period start, two review dates), which
   gate_promptleak.py forbids in any prompt, and the capstone records the
   go-live's second route in SQL reads. gen_golive.py imports all three from
   here, so the go-live is written from the same engine run.

4. THE COLLISION SWEEPS ARE THIS WAVE'S OWN, mirrored from its gates:
   gate_collisions.py (no graded value within its tolerance of the absolute
   value of ANY number token the digest prints, dates included, and no two
   graded values within the looser of their tolerances) and gate_promptleak.py
   (no graded value of any tier as a number token in any prompt once the
   YYYY-MM-DD conditions are taken out, and no engine-derived date in any
   prompt). This wave's rule is the strict FC6 one: its graded counts were
   moved onto a forty-clause register precisely so that they clear it.

Usage: python3 gen_course.py
   CQ_WAVE        the wave directory (default /root/as-wip-compliance)
   CQ_REPO        the nextgen clone   (default /root/wt-as-compliance-nextgen)
   CQ_ENGINES     packages/engines to run the capstone through
                  (default $CQ_REPO/packages/engines)
   CQ_COURSE_OUT  where to write      (default $CQ_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('CQ_WAVE', '/root/as-wip-compliance')
REPO = os.environ.get('CQ_REPO', '/root/wt-as-compliance-nextgen')
ENGINES = os.environ.get('CQ_ENGINES', f'{REPO}/packages/engines')
OUT = os.environ.get('CQ_COURSE_OUT', f'{REPO}/migrations/20261002_cq_compliance_course.sql')
SLUG, NAME, MODULE, PATH_ORDER = 'compliance', 'Compliance, Audit & Quality', 'assurance', 60
SIBLING_SLUG, SIBLING_PATH_ORDER = 'riskchange', 59
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
capstone = json.load(open(f'{W}/capstone.json'))
wave = json.load(open(f'{W}/wave.json'))
AS_OF = capstone['asOf']
PROMPTS = {t: capstone['tiers'][t]['prompt'] for t in TIERS}
bad = []


def q(s):
    return "'" + s.replace("'", "''") + "'"


def node(js):
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True,
                       cwd=W, env={**os.environ, 'AS_ENGINES': ENGINES})
    if r.returncode != 0:
        sys.exit('REFUSED: the engine run failed: ' + r.stderr[-600:])
    return json.loads(r.stdout)


# ---------------------------------------------------------------------------
# THE ENGINE RUN. The eighteen values, the five derived dates and the records.
# ---------------------------------------------------------------------------
_r = subprocess.run(['node', os.path.join(W, 'compliance_capstone.mjs'), '--json'],
                    capture_output=True, text=True, cwd=W, env={**os.environ, 'AS_ENGINES': ENGINES})
if _r.returncode != 0:
    sys.exit('REFUSED: compliance_capstone.mjs --json failed: ' + _r.stderr[-600:])
ENGINE = {f['key']: f['value'] for f in json.loads(_r.stdout)}

_side = node("""
const K = await import(%(caps)s);
const { loadGuarded } = await import(%(guard)s);
const { G } = await loadGuarded(process.env.AS_ENGINES, K.AS_OF);
const C = G.complianceStatus, D = G.documentControl, CAL = G.calendar;
const o = Object.fromEntries(K.EKPE_OBLIGATIONS.map((x) => [x.id, x]));
const [d1, d2] = K.EKPE_DOCUMENTS;
const derived = [
  C.rollForward(o.e2.due_date, o.e2.frequency),
  C.periodStart(o.e3.due_date, o.e3.frequency),
  C.rollForward(o.e4.due_date, o.e4.frequency),
  D.nextReviewDate(d1.issue_date, d1.review_period_months),
  D.nextReviewDate(d2.issue_date, d2.review_period_months),
].map((d) => CAL.toDateOnlyString(d));
const records = {};
for (const k of ['EKPE_OBLIGATIONS', 'EKPE_FILINGS', 'EKPE_DOCUMENTS', 'UTAPATE_PLAN', 'UTAPATE_CHECKPOINTS',
  'UTAPATE_REQUESTS', 'UTAPATE_NCRS', 'UTAPATE_ITEMS', 'UTAPATE_RESPONSES', 'UTAPATE_AUDITS', 'OBEAKPU_STANDARD',
  'OBEAKPU_CLAUSES', 'OBEAKPU_AUDITS', 'OBEAKPU_AUDIT_CLAUSES', 'OBEAKPU_FINDINGS']) records[k] = K[k];
console.log(JSON.stringify({ derived, records, asOf: K.AS_OF_YMD }));
""" % {'caps': json.dumps(os.path.join(W, 'compliance_fields_capstone.mjs')),
       'guard': json.dumps(os.path.join(W, 'clockguard.mjs'))})
DERIVED = _side['derived']
RECORDS = _side['records']
if _side['asOf'] != AS_OF or wave.get('asOf') != AS_OF:
    bad.append(f'the as-of dates disagree: capstone.json {AS_OF}, records {_side["asOf"]}, wave.json {wave.get("asOf")}')
if len(DERIVED) != 5 or not all(re.fullmatch(r'\d{4}-\d{2}-\d{2}', d or '') for d in DERIVED):
    bad.append(f'the engine derived {DERIVED}, expected five dates')

KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
F = {k: v for _t, k, v, _tol in fields}
if set(ENGINE) != set(KEYS):
    bad.append(f'the engine run and fields.json name different fields: {sorted(set(ENGINE) ^ set(KEYS))}')
for k in KEYS:
    if ENGINE.get(k) != F[k]:
        bad.append(f'{k}: fields.json says {F[k]} and the engine returns {ENGINE.get(k)}')
for t in TIERS:
    if [f['key'] for f in capstone['tiers'][t]['fields']] != [k for tt, k, _v, _tol in fields if tt == t]:
        bad.append(f'capstone.json and fields.json list the {t} fields differently')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer and never its sign. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'ekpe_emissions_permit_next_action_days'):
        ('Whole days from the as-of date to the next action date of REG-2026-041', 'days'),
    ('beginner', 'ekpe_community_report_next_due_days'):
        ('Whole days from the as-of date to the next due date of REG-2026-042 once its filing is recorded', 'days'),
    ('beginner', 'ekpe_waste_return_period_start_days'):
        ('Whole days from the as-of date to the start of the period a filing of REG-2026-043 must fall in', 'days'),
    ('beginner', 'ekpe_abstraction_next_action_after_filing_days'):
        ('Whole days from the as-of date to the next action date of REG-2026-044 once its filing is recorded', 'days'),
    ('beginner', 'ekpe_slug_catcher_procedure_review_days'):
        ('Whole days from the as-of date to the review date of OPS-PRO-0031', 'days'),
    ('beginner', 'ekpe_emergency_plan_review_days'):
        ('Whole days from the as-of date to the review date of HSE-PLA-0009', 'days'),
    ('intermediate', 'utapate_itp_progress_pct'):
        ('Progress of the inspection and test plan as recorded', 'percent'),
    ('intermediate', 'utapate_itp_progress_after_requests_pct'):
        ('Progress of the plan once the six requests are put to the rules in order', 'percent'),
    ('intermediate', 'utapate_oldest_open_ncr_days'):
        ('Age of the oldest open NCR', 'days'),
    ('intermediate', 'utapate_mean_open_ncr_age_days'):
        ('Mean age of the open NCRs, as the dashboard rounds it', 'days'),
    ('intermediate', 'utapate_checklist_progress_pct'):
        ('Progress of the contractor HSE audit checklist', 'percent'),
    ('intermediate', 'utapate_programme_delivered_pct'):
        ('Delivered share of the 2026 audit programme', 'percent'),
    ('advanced', 'obeakpu_clause_812_last_examined_days'):
        ('Whole days from the as-of date to the last examination of 8.1.2 that counts towards coverage', 'days'),
    ('advanced', 'obeakpu_clause_93_last_examined_days'):
        ('Whole days from the as-of date to the last examination of 9.3 that counts towards coverage', 'days'),
    ('advanced', 'obeakpu_closed_major_finding_age_days'):
        ('Age of OSF-2026-002', 'days'),
    ('advanced', 'obeakpu_evidenced_claims'):
        ('Applicable clauses carrying an evidenced conformity claim', 'clauses'),
    ('advanced', 'obeakpu_certificate_days'):
        ('The certificate days the readiness counts give', 'days'),
    ('advanced', 'obeakpu_clauses_covered'):
        ('Applicable clauses covered by internal audit', 'clauses'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'compliance field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'EKPE, a gas plant obligation register and document library read on 2026-10-15',
        'Next actions, rolled schedules and review dates'),
    'intermediate': (
        'professional',
        'UTAPATE, a manifold replacement quality plan with its NCRs, a contractor checklist and the audit programme, read on 2026-10-15',
        'Progress, ageing and delivery, each by its own rule'),
    'advanced': (
        'expert',
        'OBEAKPU, an ISO 45001:2018 terminal management system read on 2026-10-15 ahead of surveillance',
        'Coverage, evidence and the certificate'),
}

HEADER = """-- ============================================================================
-- compliance: Compliance, Audit & Quality joins the catalogue, the SECOND course
-- of the Assurance module.
--
-- Catalogue row (module 'assurance'; path_order 60, directly above its sibling
-- riskchange, Risk, Change & Learning, at 59 and the six Economics courses at
-- 53 to 58; prereq_slug NULL, the carried-over answer "no hard prerequisite
-- inside a module"; school left at its default, as riskchange and every
-- Facilities and Economics course leave it, so the fees are the published
-- school-level rows) plus the three capstones and their eighteen graded fields,
-- generated by tools/course-waves/compliance/gen_course.py from fields.json and
-- capstone.json, which compliance_capstone.mjs writes from the capstone records
-- in compliance_fields_capstone.mjs through the vendored engines. The three
-- tier structures (78 lesson keys) and the 396 questions are the three deep
-- seeds; the go-live is a fifth migration and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/compliance, because the
-- 78 lessons, the teaching lab (complianceLab.js) and its three explorer panels
-- ship in the zip and not in this database. This file does not depend on
-- riskchange: either course may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. Nothing in these five apps is typed as a
-- status: every status, count, age and verdict is derived from a dated record
-- read against one stated as-of date, and every gate refuses until the
-- evidence, the date and the named person it asks for are on the record.
--
-- THE ENGINES. engines/assurance/complianceStatus.js, documentControl.js,
-- qualityAssurance.js, auditManagement.js, isoCompliance.js and the calendar.js
-- they share, vendored sha-identical with engines ab3ce6a (ASC-1; the five recon
-- findings R1 to R5 were repaired upstream in ASC-0, 9d5d3b4), proved path by
-- path over the walked import closure of 53 paths.
--
-- EVERY GRADED FIELD IS A WHOLE NUMBER AT TOLERANCE 0.5. The grader
-- (academy_submit_capstone) casts expected, tol and answer to numeric and
-- accepts |answer - expected| <= tol, so 0.5 accepts exactly the one whole
-- number and no other. No enum is graded: a status, a verdict or a readiness
-- flag would test a typed code. A date the engine returns is graded as the
-- whole number of days calendar.daysUntil puts between it and the as-of date,
-- negative for the past.
--
-- EVERY GRADED ANSWER IS AN ANSWER ON 2026-10-15, the wave's one as-of date,
-- and every prompt states it. The engines default their date to the machine
-- clock; the capstone generator hands them the as-of date on every call, under
-- a clock guard that throws on any clock-reading export called without it.
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- nothing that hands over an answer. No graded value of any tier is a number in
-- any prompt, and none of the five dates the engine derives on the way to a
-- graded day count (the two rolled due dates, the period start and the two
-- review dates) is printed in any prompt. No graded value is within its
-- tolerance of any number the teaching digest prints, dates included, and no
-- two graded values are within the looser of their tolerances.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title = TIER[tier]
    prompt = PROMPTS[tier]
    fl = [f for f in fields if f[0] == tier]
    if len(fl) != 6:
        bad.append(f'{tier} has {len(fl)} fields')
    for t, k, v, tol in fl:
        if not isinstance(v, int) or isinstance(v, bool):
            bad.append(f'{t}.{k} = {v!r} is not a whole number, and the grader compares numbers')
        if tol != 0.5:
            bad.append(f'{t}.{k} is graded at {tol}, and every field on this wave is graded at 0.5')
    if '\n' in prompt:
        bad.append(f'the {tier} prompt carries a newline')
    if f'The as-of date is {AS_OF}.' not in prompt:
        bad.append(f'the {tier} prompt does not state the as-of date')
    if 'Give six whole numbers' not in prompt:
        bad.append(f'the {tier} prompt does not ask for six whole numbers')
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[(t, k)][0])},"
        f" 'unit',{q(LABELS[(t, k)][1])}, 'expected',{v}, 'tol',{tol!r})"
        for t, k, v, tol in fl)
    blocks.append(f"(\n  {q(SLUG)}, {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
code = '\n'.join(l for l in sql.splitlines() if not l.lstrip().startswith('--'))
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))

# 1. THE PROMPTS (gate_promptleak.py): no graded value of any tier as a number
#    token once the YYYY-MM-DD conditions are taken out, signed or absolute;
#    and no engine-derived date anywhere in any prompt.
PNUM = re.compile(r'(?<![\w.-])-?\d+(?:\.\d+)?(?![\w.])')
graded_abs = {abs(v): k for _t, k, v, _tol in fields}
prompt_tokens = 0
for tier in TIERS:
    undated = re.sub(r'\d{4}-\d{2}-\d{2}', ' ', PROMPTS[tier])
    for tok in PNUM.findall(undated):
        prompt_tokens += 1
        if abs(float(tok)) in graded_abs:
            bad.append(f'the {tier} prompt prints {tok}, the graded value of {graded_abs[abs(float(tok))]}')
    for d in DERIVED:
        if d in PROMPTS[tier]:
            bad.append(f'the {tier} prompt prints {d}, a date the engine derives on the way to a graded field')
    # The labels and titles are read beside the prompt, so they are held to it.
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        for tok in PNUM.findall(re.sub(r'\d{4}-\d{2}-\d{2}', ' ', text)):
            if abs(float(tok)) in graded_abs:
                bad.append(f'"{text}" prints {tok}, the graded value of {graded_abs[abs(float(tok))]}')
        for d in DERIVED:
            if d in text:
                bad.append(f'"{text}" prints the derived date {d}')

# 2. THE DIGEST (gate_collisions.py): every token -?\d+\.?\d*, made absolute.
DNUM = re.compile(r'-?\d+\.?\d*')
digest_nums = set()
for tok in DNUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        digest_nums.add(abs(float(tok)))
    except ValueError:
        pass
for ft, k, v, tol in fields:
    for d in digest_nums:
        if abs(abs(v) - d) <= tol:
            bad.append(f'{ft}.{k} = {v} is within {tol} of {d:g}, which the digest prints')

# 3. PAIRWISE.
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# 4. PRECISION. Every field matches exactly one class, and a class of 0
#    decimals is graded at exactly the half unit.
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
    elif precision[cls[0]]['decimals'] != 0 or tol != 0.5:
        bad.append(f'{k} is in class {cls[0]} at {precision[cls[0]]["decimals"]} decimals, graded at {tol}')

# 5. THE COPY RULE on everything this generator wrote that a learner reads.
for tier in TIERS:
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        if re.search(r',\s*not\b', text) or re.search('[–—]', text):
            bad.append(f'copy rule: "{text}"')

# 6. THE CATALOGUE ROW against wave.json, and the sibling's slot.
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite']),
                        ('sibling slug', SIBLING_SLUG, wave['sibling']['slug']),
                        ('sibling path_order', SIBLING_PATH_ORDER, wave['sibling']['pathOrder'])):
    if got != want:
        bad.append(f'catalogue {what}: {got!r} here and {want!r} in wave.json')

# The sweeps must be able to fire.
if prompt_tokens < 30 or len(digest_nums) < 50:
    bad.append(f'the sweeps read {prompt_tokens} prompt tokens and {len(digest_nums)} digest numbers, '
               'so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('engine run: 18 of 18 fields.json values equal compliance_capstone.mjs --json through the vendored engines')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived dates: {len(DERIVED)} {DERIVED} '
          f'| digest numbers: {len(digest_nums)}')
    print('prompt + derived-date + digest + pairwise + precision + copy + catalogue refusals: 0')
