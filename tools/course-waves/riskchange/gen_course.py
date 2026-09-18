#!/usr/bin/env python3
"""Generate the riskchange course + capstone migration from fields.json and the
capstone records, so no expected value, condition or record is retyped.

Modelled on tools/course-waves/heattransfer/gen_course.py (FC6), with the three
differences this wave forces:

1. THE CONDITIONS ARE RECORDS, NOT A PARAGRAPH OF NUMBERS. Every graded field
   is a rule over a register (a risk register, a change register, a review log
   and a lessons register), so the learner has to be handed the register. The
   prose of each prompt is PROMPTS[tier] out of riskchange_fields_capstone.mjs
   VERBATIM, and the records follow it as one line per record, rendered here
   from the same module's PROMPT_TABLES: only the INPUT columns
   gate_promptleak.py allows, in its column order. Nothing is typed twice, and
   the go-live proves every rendered line is in the shipped prompt.

2. EVERY GRADED FIELD IS A WHOLE NUMBER AT TOLERANCE 0.5, because the NextGen
   grader (academy_submit_capstone) casts expected, tol and answer to numeric
   and compares |answer - expected| <= tol. No enum is graded; a date is graded
   as the integer YYYYMMDD. A tolerance other than 0.5 is refused here.

3. THE COLLISION SWEEPS ARE THE WAVE'S OWN, not FC6's. FC6 swept every number
   the digest prints, which on a course whose answers are small counts would
   refuse on the numeral 2. This wave's rules, mirrored from gate_promptleak.py
   and gate_capstone_leak.py: no graded value in any prompt's PROSE; no graded
   date anywhere in any prompt except the one selection date in its one
   declared column; no DISTINCTIVE graded integer (below 0 or 25 and above) and
   no graded date printed in the digest; and no two graded values within the
   looser of their tolerances.

Usage: python3 gen_course.py
   RC_WAVE       the wave directory (default /root/as-wip-riskchange)
   RC_REPO       the nextgen clone   (default /root/wt-as-riskchange-nextgen)
   RC_COURSE_OUT where to write      (default $RC_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('RC_WAVE', '/root/as-wip-riskchange')
REPO = os.environ.get('RC_REPO', '/root/wt-as-riskchange-nextgen')
OUT = os.environ.get('RC_COURSE_OUT', f'{REPO}/migrations/20261001_asrc_riskchange_course.sql')
SLUG, NAME, MODULE, PATH_ORDER = 'riskchange', 'Risk, Change & Learning', 'assurance', 59
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))


def q(s):
    return "'" + s.replace("'", "''") + "'"


def load_capstone(wave):
    """PROMPTS, PROMPT_TABLES and every table's records, out of the module."""
    js = ("const M = await import(%s); const t = {};"
          " for (const [tier, tabs] of Object.entries(M.PROMPT_TABLES))"
          " { t[tier] = tabs.map(([name, cols]) => [name, cols, [].concat(M[name])]); }"
          " console.log(JSON.stringify({ prompts: M.PROMPTS, tables: t, asOf: M.AS_OF_ISO,"
          " live: M.IGBARA_LIVE }));"
          % json.dumps(os.path.join(wave, 'riskchange_fields_capstone.mjs')))
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit('REFUSED: could not read the capstone records: ' + r.stderr[-400:])
    return json.loads(r.stdout)


CAP = load_capstone(W)

# THE TABLE HEADINGS a learner reads, one per table, in the order the prose
# describes them. The words are the prose's own, so a heading cannot promise a
# column the table does not carry.
HEADING = {
    'IGBARA_RISKS': 'THE IGBARA RISK REGISTER, one line per risk',
    'OKOMU_MOCS': 'TABLE 1, THE OKOMU CHANGES, one line per change',
    'OKOMU_APPROVALS': 'TABLE 2, THE APPROVAL ROWS, one line per row',
    'OKOMU_ACTIONS': 'TABLE 3, THE ACTIONS, one line per action',
    'ETIM_COMMENTS': 'TABLE 1, THE COMMENT LOG OF REVIEW ET-R1, one line per comment',
    'ETIM_APPLICATIONS': 'TABLE 2, THE APPLICATIONS RECORDED FOR LESSON EL-01, one line per application',
    'ETIM_LESSONS': 'TABLE 3, THE LESSONS REGISTER, one line per lesson',
}


def cell(v):
    """A cell as the learner reads it. The two kinds of empty are kept apart,
    because the prose says so: a blank cell was left blank on the form, and
    null was never assessed."""
    if v is None:
        return 'null'
    if v == '':
        return 'blank'
    return str(v)


def render_line(cols, rec):
    """One record, one line: the id first, then every other INPUT column the
    record carries, as `column value`, in PROMPT_TABLES order. A column the
    record does not carry is left out rather than printed as empty, because an
    absent key and a null are different inputs to the engine."""
    parts = [rec['id']]
    for c in cols:
        if c == 'id' or c not in rec:
            continue
        parts.append(f'{c.replace("_", " ")} {cell(rec[c])}')
    extra = [k for k in rec if k not in cols]
    if extra:
        sys.exit(f'REFUSED: record {rec["id"]} carries {extra}, outside its declared input columns')
    return ' | '.join(parts) + '.'


def render_prompt(tier):
    prose = CAP['prompts'][tier]
    if '\n' in prose:
        sys.exit(f'REFUSED: the {tier} prose carries a newline, and the go-live reads the prose as the first paragraph')
    blocks = [prose]
    lines = []
    for name, cols, recs in CAP['tables'][tier]:
        body = [render_line(cols, r) for r in recs]
        lines += [(name, r['id'], l) for r, l in zip(recs, body)]
        blocks.append(HEADING[name] + ':\n' + '\n'.join(body))
    return '\n\n'.join(blocks), lines


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record or the population
# and the rule, never the answer. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'igbara_i03_inherent_score'): ('The inherent score of IG-03', 'score'),
    ('beginner', 'igbara_i03_residual_score'): ('The residual score of IG-03', 'score'),
    ('beginner', 'igbara_live_residual_critical'):
        ('Risks the register still carries that are Critical on their residual score', 'risks'),
    ('beginner', 'igbara_live_inherent_high'):
        ('Risks the register still carries that are High on their inherent score', 'risks'),
    ('beginner', 'igbara_i06_days_to_review'): ('Whole days to the next review of IG-06', 'days'),
    ('beginner', 'igbara_i12_days_to_review'):
        ('Whole days to the next review of IG-12, negative if it has passed', 'days'),
    ('intermediate', 'okomu_ok01_ratify_due_yyyymmdd'):
        ('The date every remaining approval level of OK-01 must have signed by', 'YYYYMMDD'),
    ('intermediate', 'okomu_register_expiring_soon'): ('Changes that read Expiring soon', 'changes'),
    ('intermediate', 'okomu_register_expired'): ('Changes that read Expired', 'changes'),
    ('intermediate', 'okomu_register_open_actions'): ('Actions that are open work', 'actions'),
    ('intermediate', 'okomu_register_overdue_actions'): ('Open actions past their due date', 'actions'),
    ('intermediate', 'okomu_register_ratification_overdue'):
        ('Changes that read Ratification overdue', 'changes'),
    ('advanced', 'etim_review_blocking'): ('Comments that block the closure of ET-R1', 'comments'),
    ('advanced', 'etim_review_open_comments'): ('Comments on ET-R1 that are open', 'comments'),
    ('advanced', 'etim_lesson_applied'): ('Applications of EL-01 that changed something', 'applications'),
    ('advanced', 'etim_lesson_last_applied_yyyymmdd'): ('The date EL-01 was last applied', 'YYYYMMDD'),
    ('advanced', 'etim_lesson_age_days'): ('The age of EL-01', 'days'),
    ('advanced', 'etim_register_reviews_due_soon'):
        ('Lessons on the register that read review due soon', 'lessons'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'riskchange field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'IGBARA, a flow station risk register read on 2026-10-01',
        'The score, the band and the date on one register'),
    'intermediate': (
        'professional',
        'OKOMU, a compression station change register read on 2026-10-01',
        'Signatures, expiry and the work still open'),
    'advanced': (
        'expert',
        'ETIM, a floating production unit review log and lessons register read on 2026-10-01',
        'Closure, proof of use and the review dates'),
}

HEADER = """-- ============================================================================
-- riskchange: Risk, Change & Learning joins the catalogue, the FIRST course of
-- the Assurance module.
--
-- Catalogue row (module 'assurance'; path_order 59, directly above the six
-- Economics courses at 53 to 58; prereq_slug NULL, the carried-over answer "no
-- hard prerequisite inside a module"; school left at its default, as every
-- Facilities and Economics course leaves it, so the fees are the published
-- school-level rows) plus the three capstones and their eighteen graded fields,
-- generated by tools/course-waves/riskchange/gen_course.py from fields.json,
-- precision.json and the capstone records in riskchange_fields_capstone.mjs.
-- The three tier structures (78 lesson keys) and the 396 questions are the three
-- deep seeds; the go-live is a fifth migration and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/riskchange, because the
-- 78 lessons, the teaching lab (riskchangeLab.js) and its three explorer panels
-- ship in the zip and not in this database. Its sibling, compliance (Compliance,
-- Audit & Quality), is planned at path_order 60 and is not touched here.
--
-- THE ONE SENTENCE THE COURSE IS. In assurance a status is earned by a rule over
-- scores, dates and independent signatures, so the discipline is reading which
-- rule decided each band, gate, verdict and lesson, and on which date.
--
-- THE ENGINES. engines/assurance/riskScoring.js, managementOfChange.js,
-- peerReview.js, lessonsLearned.js and the calendar.js they share, vendored
-- sha-identical with engines ab3ce6a (ASC-1; nothing this course reads moved
-- from 9d5d3b4, ASC-0), proved path by path over the walked import closure.
--
-- EVERY GRADED FIELD IS A WHOLE NUMBER AT TOLERANCE 0.5. The grader
-- (academy_submit_capstone) casts expected, tol and answer to numeric and
-- accepts |answer - expected| <= tol, so 0.5 accepts exactly the one whole
-- number and no other. No enum is graded: a band, an appetite verdict or an
-- expiry state would test a typed code. A date is graded as the integer
-- YYYYMMDD of the date the engine returns.
--
-- EVERY GRADED DATE-DEPENDENT ANSWER IS AN ANSWER ON 2026-10-01, the wave's one
-- as-of date, and every prompt states it. The engines default their date to the
-- machine clock; the capstone generator hands them the as-of date on every
-- call, under a clock trap that throws on new Date() with no argument.
--
-- THE PROMPTS. Each prompt's first paragraph is its prose, verbatim from
-- PROMPTS in riskchange_fields_capstone.mjs. The records follow it one line per
-- record, carrying only the INPUT columns PROMPT_TABLES allows: no score, band,
-- appetite, due date, state, blocking flag or count is printed beside its
-- question. A blank residual axis prints as `blank` and a never-assessed one as
-- `null`, as the prose says.
--
-- HELD ITEMS ARE NEUTRALISED BY CONSTRUCTION. The change overdue test (RC-3),
-- the peer review cross-review count (RC-4) and isReviewOverdue are on no
-- graded path: OKOMU grades action due dates and never a change's overdue flag,
-- ETIM grades one review's own log, and the two IGBARA day counts are daysUntil
-- on live risks' review dates.
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
RENDERED = {}
bad = []
for tier in TIERS:
    cert, dataset, title = TIER[tier]
    prompt, rec_lines = render_prompt(tier)
    RENDERED[tier] = (prompt, rec_lines)
    fl = [f for f in fields if f[0] == tier]
    if len(fl) != 6:
        bad.append(f'{tier} has {len(fl)} fields')
    for t, k, v, tol in fl:
        if not isinstance(v, int) or isinstance(v, bool):
            bad.append(f'{t}.{k} = {v!r} is not a whole number, and the grader compares numbers')
        if tol != 0.5:
            bad.append(f'{t}.{k} is graded at {tol}, and every field on this wave is graded at 0.5')
        if k.endswith('_yyyymmdd') and not re.fullmatch(r'20\d{6}', str(v)):
            bad.append(f'{t}.{k} = {v} is not a YYYYMMDD date')
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
# Odd quotes are counted per STATEMENT LINE only where the line is not inside a
# multi-line literal; the prompts span lines, so the check is on the whole file:
# every literal must close. A literal that does not close is found by pairing.
code = '\n'.join(l for l in sql.splitlines() if not l.lstrip().startswith('--'))
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))

NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')
RECORD_ID = re.compile(r'\b[A-Z]{2}-[A-Z]?\d+\b')

# 1. PROSE. No graded value of ANY tier in any prompt's prose, after record ids
#    and the as-of date are taken out.
prose_numbers = 0
for tier in TIERS:
    prose = RECORD_ID.sub(' ', CAP['prompts'][tier].replace(CAP['asOf'], ' '))
    for m in NUM.finditer(prose):
        prose_numbers += 1
        for ft, k, v, tol in fields:
            if abs(float(m.group()) - v) <= tol:
                bad.append(f'{tier} prose states {m.group()}, which is graded {ft}.{k} = {v}')

# 2. DATES. A graded date appears in no prompt in either spelling, except the
#    one SELECTION date, once, on the record line gate_promptleak.py declares.
SELECTION = {'etim_lesson_last_applied_yyyymmdd': ('advanced', 'ETIM_APPLICATIONS', 'applied on')}
date_forms = 0
for ft, k, v, tol in fields:
    if not k.endswith('_yyyymmdd'):
        continue
    s = str(v)
    for form in (s, f'{s[:4]}-{s[4:6]}-{s[6:]}'):
        date_forms += 1
        for tier in TIERS:
            prompt, rec_lines = RENDERED[tier]
            n = prompt.count(form)
            if k in SELECTION and tier == SELECTION[k][0] and '-' in form:
                holders = [l for name, _id, l in rec_lines
                           if name == SELECTION[k][1] and f'{SELECTION[k][2]} {form}' in l]
                if n != 1 or len(holders) != 1:
                    bad.append(f'selection date {form} ({k}) appears {n} times in the {tier} prompt, '
                               f'{len(holders)} of them in its declared column; expected exactly once there')
            elif n:
                bad.append(f'graded date {form} ({k}) appears in the {tier} prompt')

# 3. THE DIGEST. No graded date in either spelling, and no DISTINCTIVE graded
#    integer (below 0, or 25 and above), is printed in the digest.
digest = open(f'{W}/digest.txt', encoding='utf-8').read()
distinctive = 0
for ft, k, v, tol in fields:
    if k.endswith('_yyyymmdd'):
        s = str(v)
        for form in (s, f'{s[:4]}-{s[4:6]}-{s[6:]}'):
            if form in digest:
                bad.append(f'graded date {k} appears as {form} in the digest')
    elif v < 0 or v >= 25:
        distinctive += 1
        if re.search(r'(?<![\w.-])' + re.escape(str(v)) + r'(?![\w.])', digest):
            bad.append(f'distinctive graded integer {k} = {v} is printed in the digest')

# 4. PAIRWISE.
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# 5. PRECISION. Every field matches exactly one precision class, and a class of
#    0 decimals is graded at exactly the half unit.
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
    elif precision[cls[0]]['decimals'] != 0 or tol != 0.5:
        bad.append(f'{k} is in class {cls[0]} at {precision[cls[0]]["decimals"]} decimals, graded at {tol}')

# 6. THE COPY RULE on everything this generator wrote that a learner reads.
for tier in TIERS:
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        if re.search(r',\s*not\b', text) or re.search('[–—]', text):
            bad.append(f'copy rule: "{text}"')
    if CAP['asOf'] not in CAP['prompts'][tier]:
        bad.append(f'the {tier} prose does not state the as-of date')

if not (prose_numbers >= 0 and date_forms == 4 and distinctive == 3):
    bad.append(f'the sweeps examined {date_forms} date spellings and {distinctive} distinctive integers, '
               'expected 4 and 3, so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('prompt lengths:', {t: len(RENDERED[t][0]) for t in TIERS},
          '| record lines:', {t: len(RENDERED[t][1]) for t in TIERS})
    print(f'prose numbers swept: {prose_numbers} | graded date spellings: {date_forms} '
          f'| distinctive integers against the digest: {distinctive}')
    print('prose + dates + digest + pairwise + precision + copy refusals: 0')
