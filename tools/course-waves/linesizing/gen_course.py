#!/usr/bin/env python3
"""Generate the FC2 course + capstone migration.

WHAT THIS READS, AND WHY IT READS TWO THINGS RATHER THAN ONE.

  scratch/prompts_draft.sql  the capstone PROSE: cert tier, dataset line,
                             title and the prompt itself. This is the exact
                             text promptleak.py swept in the foundation
                             phase, so generating the migration from it is
                             what makes the swept text and the shipped text
                             the same text.
  fields.json                every expected value and every tolerance,
                             written by fc2_capstone.mjs out of the engines.

The draft ALSO carries expected values and tolerances, because it has to be
a real academy_capstones row for the prompt gate to sweep it. They are never
trusted: this script parses them out and REFUSES unless every one of the
eighteen agrees with fields.json exactly, repr for repr. That is the drift
control. A capstone recut that touched one file and not the other does not
get a migration out of this script.

Modelled on /root/fc-wip-separation/gen_course.py (FC1), with one difference
forced by what FC2 is: FC1 retyped its conditions into the generator as
Python strings, so the generator and the swept draft were two copies of one
paragraph. Here the prompt has exactly one copy.

NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE ITEM. IMO-1 states its own
site erosional c factor, BRASS states its transmission efficiency, every
Reynolds number in the graded set is above 20000 so the held 2100 to 4000
transition band cannot reach one, and every bore, roughness, resistance sum
and location class is stated rather than looked up.

Usage: python3 /root/fc-wip-linesizing/gen_course.py
"""
import json
import re
import sys

W = '/root/fc-wip-linesizing'
REPO = '/root/wt-fc2-nextgen'
OUT = f'{REPO}/migrations/20260922_fc2_linesizing_course.sql'

SLUG = 'linesizing'
NAME = 'Pipeline & Line Sizing'
MODULE = 'facilities'
PATH_ORDER = 40

fields = json.load(open(f'{W}/fields.json'))
wave = json.load(open(f'{W}/wave.json'))
assert wave['pathOrder'] == PATH_ORDER, f"wave.json says path_order {wave['pathOrder']}, this script says {PATH_ORDER}"
assert wave['module'] == MODULE and wave['slug'] == SLUG


def q(s):
    return "'" + s.replace("'", "''") + "'"


def unq(s):
    return s[1:-1].replace("''", "'")


# --------------------------------------------------------------- the draft
draft = open(f'{W}/scratch/prompts_draft.sql', encoding='utf-8').read()

ROW = re.compile(
    r"\(\s*'linesizing',\s*'(?P<tier>\w+)',\s*'(?P<cert>\w+)',\s*"
    r"(?P<dataset>'(?:[^']|'')*'),\s*"
    r"(?P<title>'(?:[^']|'')*'),\s*"
    r"(?P<prompt>'(?:[^']|'')*'),\s*"
    r"jsonb_build_array\((?P<fields>.*?)\n\s*\)\s*\)", re.S)

OBJ = re.compile(
    r"jsonb_build_object\('key',(?P<key>'(?:[^']|'')*'), 'label',(?P<label>'(?:[^']|'')*'), "
    r"'unit',(?P<unit>'(?:[^']|'')*'), 'expected',(?P<exp>[-\d.eE+]+), 'tol',(?P<tol>[-\d.eE+]+)\)")

rows = {}
for m in ROW.finditer(draft):
    fl = []
    for o in OBJ.finditer(m.group('fields')):
        fl.append((unq(o.group('key')), unq(o.group('label')), unq(o.group('unit')),
                   float(o.group('exp')), float(o.group('tol'))))
    rows[m.group('tier')] = dict(
        cert=m.group('cert'), dataset=unq(m.group('dataset')),
        title=unq(m.group('title')), prompt=unq(m.group('prompt')), fields=fl)

TIERS = ('beginner', 'intermediate', 'advanced')
refused = []
if set(rows) != set(TIERS):
    refused.append(f'the draft parsed to tiers {sorted(rows)}, expected {sorted(TIERS)}')

# ------------------------------------------------- THE DRIFT CONTROL
# fields.json is the authority on every number. The draft is the authority on
# every word. Where they overlap they must agree exactly or nothing is
# written. `repr` and not `==` on the value, because a capstone recut that
# moved a field in the sixteenth significant figure is still a recut.
by_key = {}
for tier, key, val, tol in fields:
    by_key[key] = (tier, val, tol)
for tier in TIERS:
    if tier not in rows:
        continue
    fl = rows[tier]['fields']
    if len(fl) != 6:
        refused.append(f'{tier} draft grades {len(fl)} fields, expected 6')
    for key, label, unit, exp, tol in fl:
        if key not in by_key:
            refused.append(f'{tier}.{key} is in the draft and not in fields.json')
            continue
        ftier, fval, ftol = by_key[key]
        if ftier != tier:
            refused.append(f'{key} is {tier} in the draft and {ftier} in fields.json')
        # repr(float(...)) on both sides: it is exact to the last bit, so a
        # sixteenth-significant-figure recut still reports DISAGREE, while an
        # integer tolerance written 1000 in JSON and 1000 in SQL is the same
        # tolerance and is not reported as drift.
        if repr(exp) != repr(float(fval)):
            refused.append(f'{key} expected {exp!r} in the draft and {float(fval)!r} in fields.json: DISAGREE')
        if repr(tol) != repr(float(ftol)):
            refused.append(f'{key} tol {tol!r} in the draft and {float(ftol)!r} in fields.json: DISAGREE')
drafted = {k for t in TIERS if t in rows for k, *_ in rows[t]['fields']}
for key in by_key:
    if key not in drafted:
        refused.append(f'{key} is in fields.json and not in the draft')

HEADER = f"""-- ============================================================================
-- FC2: Pipeline & Line Sizing joins the catalog, the SECOND Facilities
-- course and the second row the `facilities` module carries.
--
-- Catalog row (module '{MODULE}'; path_order {PATH_ORDER}, the slot directly above
-- FC1 separation's 39 and below Economics' 53; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module"; school left at
-- its default, so the fees are the published school-level rows in
-- academy_fees and this course adds none of its own) plus the three capstones
-- and their eighteen graded fields, generated by
-- /root/fc-wip-linesizing/gen_course.py from fields.json and the capstone
-- prose in scratch/prompts_draft.sql. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/linesizing, because the 78
-- lessons, the teaching lab and its three explorer panels ship in the zip and
-- not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A line is sized by the limit that binds
-- first, and every one of those limits is a different equation with a
-- different domain, so the discipline is knowing which limit you are standing
-- on and whether the equation you reached for is still honest there.
--
-- THE ENGINES. engines/facilities/lineHydraulics.js (the liquid line closed
-- form end to end, Colebrook with its laminar branch and the band between
-- them that has no correlation, the erosional limit, the four published gas
-- transmission forms sharing one elevation group, the bisection that solves
-- an outlet pressure, the B31.8 wall and its rating, and the pigging family),
-- with engines/production/pipeSchedule.js for the bores and
-- engines/production/chokePerformance.js where the erosional limit is kept,
-- as repaired in FC2-0 (engines #196) and vendored at NextGen 27de8d90.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE ITEM, and it is arranged
-- that way rather than argued. The API RP 14E c factor is held, so IMO-1 is
-- quoted its OWN site c factor of 120, which is not one of the three
-- published rows. The transmission-form efficiency E is an unsourced
-- multiplier and is held, so BRASS states E as a condition. The transition
-- band from Reynolds 2100 to 4000 is held, so every graded friction factor
-- sits above Reynolds 20000. No graded value reads the pipe schedule, the
-- roughness table, the fitting K table, the RP 14E rows or the B31.8 class
-- table: every bore, roughness, resistance sum and location class is stated.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: that the
-- three losses stay apart and only one of them is what a bigger pipe fixes;
-- that four published forms answer one question and disagree; that the
-- elevation group is shared by all four and is the only static column in the
-- method; that an outlet pressure came out of a solver and not a formula;
-- that a wall is what a code demands and a rating is what the mill rolled;
-- and that a pigging interval is a slug volume against a catcher. All
-- eighteen graded values were swept against every number the digest and the
-- goldens publish and against every number handed to a learner in a prompt,
-- at each field's own tolerance: 0 collisions, and 0 pairwise.
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
    r = rows[tier]
    objs = ',\n'.join(
        "    jsonb_build_object('key',{}, 'label',{}, 'unit',{}, 'expected',{}, 'tol',{})".format(
            q(key), q(label), q(unit), repr(by_key[key][1]), repr(by_key[key][2]))
        for key, label, unit, _e, _t in r['fields'])
    blocks.append("(\n  {}, {}, {},\n  {},\n  {},\n  {},\n  jsonb_build_array(\n{}\n  )\n)".format(
        q(SLUG), q(tier), q(r['cert']), q(r['dataset']), q(r['title']), q(r['prompt']), objs))
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
odd = [n for n, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
dashes = len(re.findall('[–—]', sql))

# A graded value may not be a number the learner is handed in its own prompt,
# nor in any other tier's prompt, nor within tolerance of another graded
# value. Run all three here, in Python, before SQL runs them at go-live.
NUM = re.compile(r'-?\d+\.?\d*')
handed = []
for tier in TIERS:
    for tok in NUM.findall(rows[tier]['prompt']):
        try:
            handed.append((tier, abs(float(tok))))
        except ValueError:
            pass
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} prompt')
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            refused.append(f'pairwise: {fields[i][1]} and {fields[j][1]}')

if refused or odd or dashes:
    print('REFUSED, nothing written:')
    for b in refused:
        print('  ', b)
    if odd:
        print('   odd-quote lines:', odd)
    if dashes:
        print('   en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('drift control: all 18 expected values and tolerances agree repr-for-repr between the draft and fields.json')
print('odd-quote lines: 0 | en/em dashes: 0')
print('prompt lengths:', {t: len(rows[t]['prompt']) for t in TIERS})
print('handed-in-prompt + pairwise collisions: 0')
