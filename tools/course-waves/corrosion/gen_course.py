#!/usr/bin/env python3
"""Generate the FC9 course + capstone migration from fields.json and the
capstone conditions, so no expected value is retyped.

Modelled on tools/course-waves/heattransfer/gen_course.py (FC6), with the
differences FC9 forces:

1. THE CONDITIONS LIVE IN fc9_capstone.mjs AND ARE READ OUT OF IT, NOT RETYPED.
   FC6 kept its conditions in a separate exported module. FC9's live in three
   frozen objects inside the capstone generator (OBIGBO, NEMBE, SOKU), so this
   file parses those three objects and REFUSES if any number it states in a
   prompt is not the number that generator ran the engine at. A prompt that
   drifted from its own generator would grade a learner against conditions
   nobody was handed.

2. NOT ONE GRADED FIELD IS A CORROSION RATE THE CORRELATION PRODUCED. The
   Associate grades stream bookkeeping, this module's Reynolds number as a
   definition and the corrosion inhibitor arithmetic; the Professional and the
   Expert state their uninhibited rate from an inspection survey. The label
   sweep below refuses any label that names a held quantity.

3. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json. The
   Associate grades two classes (the Reynolds number to four decimals, the rest
   to six) and asks for both; the other two tiers grade six throughout.

THE TOLERANCES ARE READ, NEVER DECLARED. fields.json carries the tolerances the
lab ships, which for fifteen of the eighteen fields are RAISED to the printed
floor by make_fields.mjs. Every sweep below runs at the tolerance in
fields.json, because a sweep at a tighter stated tolerance would pass a
collision the shipped grade would hit.

Usage: python3 gen_course.py
   FC9_WAVE       the wave directory (default /root/fc-wip-corrosion)
   FC9_REPO       the nextgen clone   (default /root/wt-fc9-nextgen)
   FC9_COURSE_OUT where to write      (default $FC9_REPO/migrations/...)
"""
import json
import os
import re
import sys

# THE WAVE AND THE OUTPUT ARE BOTH OVERRIDABLE, so gen_seeds.sh can point this
# at a STAGED COPY OF THE COMMITTED TREE rather than at a working tree.
W = os.environ.get('FC9_WAVE', '/root/fc-wip-corrosion')
REPO = os.environ.get('FC9_REPO', '/root/wt-fc9-nextgen')
OUT = os.environ.get('FC9_COURSE_OUT', f'{REPO}/migrations/20260925_fc9_corrosion_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The capstone conditions, parsed out of the generator that computed the
# answers. Only the three frozen objects are read.
# ---------------------------------------------------------------------------
CAP = open(f'{W}/fc9_capstone.mjs', encoding='utf-8').read()


def frozen(name):
    m = re.search(r'const ' + name + r' = Object\.freeze\(\{(.*?)\}\);', CAP, re.S)
    if not m:
        sys.exit(f'REFUSED: {name} is not a frozen object in fc9_capstone.mjs')
    out = {}
    for k, v in re.findall(r'(\w+):\s*([^,\n]+)', re.sub(r'//[^\n]*', '', m.group(1))):
        v = v.strip()
        out[k] = v.strip("'") if v.startswith("'") else float(v)
    return out


OBIGBO, NEMBE, SOKU = frozen('OBIGBO'), frozen('NEMBE'), frozen('SOKU')


def n(x):
    """A condition as a learner reads it: no trailing zeros, no exponent."""
    s = repr(float(x))
    if 'e' in s:
        sys.exit(f'REFUSED: condition {x} would print in exponent form')
    return s[:-2] if s.endswith('.0') else s


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where the
# course turns on it, WHICH of two same-unit quantities it is: a required
# allowance and a reinstating allowance are both mm and answer different
# questions, and so are a credited life and a stripped one.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'obigbo_co2_partial_pressure_bar'):
        ('The CO2 partial pressure, the total pressure times the mole fraction', 'bar'),
    ('beginner', 'obigbo_h2s_partial_pressure_psia'):
        ("The H2S partial pressure, converted by the engine's bar to psia factor", 'psia'),
    ('beginner', 'obigbo_h2s_to_co2_mole_ratio'):
        ('The H2S to CO2 mole ratio', 'ratio'),
    ('beginner', 'obigbo_reynolds_number'):
        ("This module's Reynolds number, density times velocity times diameter over viscosity", 'dimensionless'),
    ('beginner', 'obigbo_effective_inhibition_pct'):
        ('The effective corrosion inhibition the programme delivers', 'percent'),
    ('beginner', 'obigbo_metal_loss_ratio_vs_datasheet'):
        ('The metal loss against what the datasheet efficiency alone would give', 'ratio'),
    ('intermediate', 'nembe_retained_metal_loss_fraction'):
        ('The fraction of the metal loss the programme leaves', 'fraction'),
    ('intermediate', 'nembe_inhibitor_shortfall_pp'):
        ('The corrosion inhibitor shortfall against the datasheet efficiency', 'percentage points'),
    ('intermediate', 'nembe_inhibited_rate_mmyr'):
        ('The inhibited rate on the surveyed line', 'mm/yr'),
    ('intermediate', 'nembe_remaining_life_yr'):
        ('The remaining life at that inhibited rate', 'yr'),
    ('intermediate', 'nembe_required_allowance_mm'):
        ('The allowance the design life demands at that rate, which ignores what has gone', 'mm'),
    ('intermediate', 'nembe_life_lost_to_availability_yr'):
        ('The years of life the availability costs against full availability', 'yr'),
    ('advanced', 'soku_tolerable_rate_mmyr'):
        ('The largest rate at which the remaining allowance still meets the design life', 'mm/yr'),
    ('advanced', 'soku_required_availability_pct'):
        ('The availability at which the effective protection first reaches the target', 'percent'),
    ('advanced', 'soku_availability_for_design_life_pct'):
        ('The availability at which the credited rate meets the design life', 'percent'),
    ('advanced', 'soku_allowance_to_reinstate_mm'):
        ('The total allowance that reinstates the design life, consumed depth unchanged', 'mm'),
    ('advanced', 'soku_stripped_film_life_yr'):
        ('The remaining life at the uninhibited rate the stripped film leaves', 'yr'),
    ('advanced', 'soku_film_credit_life_ratio'):
        ('How many times longer the life at the credited rate is than the stripped life', 'ratio'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'FC9 field keys are meant to be globally unique'

# NO LABEL MAY NAME A HELD QUANTITY. A label is what a learner reads beside the
# box, and a label saying "category" or "fugacity" would teach that the course
# grades one. The guard is proved to fire on a planted label below.
FORBIDDEN_LABEL_FRAGMENTS = [
    'category', 'band', 'regime', 'severity', 'region', 'material', 'fugacity',
    'friction factor', 'wall shear', 'onset', 'de waard', 'threshold', 'scale factor',
]

# ---------------------------------------------------------------------------
# The prompts. Every condition is STATED in the engine's units, every number is
# the one the capstone generator ran, and nothing that IS an answer is stated.
# ---------------------------------------------------------------------------
O, N, S = OBIGBO, NEMBE, SOKU
OBIGBO_TEXT = (
    f"OBIGBO, a wet gas gathering line into the Obigbo manifold. Every condition here is "
    f"stated in the engine's own units, so nothing is converted through the studio. The line "
    f"runs at {n(O['tC'])} degC and a total pressure of {n(O['pTotalBar'])} bar absolute. The "
    f"gas carries a CO2 mole fraction of {n(O['co2MolFrac'])} and an H2S mole fraction of "
    f"{n(O['h2sMolFrac'])}, and the in-situ pH is {n(O['ph'])}. The liquid moves at "
    f"{n(O['velocityMS'])} m/s in a line of {n(O['diameterM'])} m inside diameter, with a "
    f"density of {n(O['densityKgM3'])} kg/m3 and a viscosity of {n(O['viscosityPaS'])} Pa s, "
    f"and the line is water wet at a water cut of {n(O['waterCutFrac'])}. The corrosion "
    f"inhibitor is {n(O['inhibitorEfficiencyPct'])} percent efficient on its datasheet and is "
    f"available {n(O['inhibitorAvailabilityPct'])} percent of the time.")
NEMBE_TEXT = (
    f"NEMBE CREEK, an oil line whose wall-loss rate came off a two-year ultrasonic survey. "
    f"The survey gives an uninhibited rate of {n(N['surveyedUninhibitedMmYr'])} mm/yr. The line "
    f"carries a corrosion allowance of {n(N['corrosionAllowanceMm'])} mm, of which "
    f"{n(N['consumedMm'])} mm is already consumed, against a design life of "
    f"{n(N['designLifeYears'])} years. The corrosion inhibitor is "
    f"{n(N['inhibitorEfficiencyPct'])} percent efficient on its datasheet and is available "
    f"{n(N['inhibitorAvailabilityPct'])} percent of the time. The engine's own chain runs at "
    f"{n(N['tC'])} degC, {n(N['pTotalBar'])} bar absolute, a CO2 mole fraction of "
    f"{n(N['co2MolFrac'])}, an in-situ pH of {n(N['ph'])}, {n(N['velocityMS'])} m/s and a "
    f"{n(N['diameterM'])} m inside diameter, water wet, and none of those conditions moves any "
    f"value asked for below.")
SOKU_TEXT = (
    f"SOKU, a gas line where the wall shear has already stripped the corrosion inhibitor film, "
    f"so the datasheet efficiency is not what the line sees. The operator's inspection record "
    f"gives an uninhibited rate of {n(S['surveyedUninhibitedMmYr'])} mm/yr. The line carries a "
    f"corrosion allowance of {n(S['corrosionAllowanceMm'])} mm, of which {n(S['consumedMm'])} mm "
    f"is already consumed, against a design life of {n(S['designLifeYears'])} years. The "
    f"corrosion inhibitor is {n(S['inhibitorEfficiencyPct'])} percent efficient on its datasheet "
    f"and is available {n(S['inhibitorAvailabilityPct'])} percent of the time, and the target "
    f"effective protection is {n(S['targetEffectiveProtectionPct'])} percent. The engine's own "
    f"chain runs at {n(S['tC'])} degC, {n(S['pTotalBar'])} bar absolute, a CO2 mole fraction of "
    f"{n(S['co2MolFrac'])}, an in-situ pH of {n(S['ph'])}, {n(S['velocityMS'])} m/s and a "
    f"{n(S['diameterM'])} m inside diameter, water wet, and none of those conditions moves any "
    f"value asked for below.")

TIER = {
    'beginner': (
        'associate',
        'OBIGBO, a wet gas gathering line read from its composition to its corrosion inhibitor programme',
        'What is in the stream, how fast it moves, and what the programme delivers',
        OBIGBO_TEXT + " Report six values: the CO2 partial pressure; the H2S partial pressure in "
                      "psia, converted by the bar to psia factor the engine exports; the H2S "
                      "to CO2 mole ratio; this module's Reynolds number, bearing in mind that the "
                      "Pipeline & Line Sizing course computes its own and the two will not agree; "
                      "the effective corrosion inhibition; and the metal loss as a ratio against "
                      "what the datasheet efficiency alone would give. The Reynolds number to four "
                      "decimals. The partial pressures in bar and psia, the inhibition in percent "
                      "and both ratios to six decimals."),
    'intermediate': (
        'professional',
        'NEMBE CREEK, an oil line on a surveyed rate, read through its corrosion inhibitor programme to its allowance',
        'The time average that eats the wall',
        NEMBE_TEXT + " Report six values: the fraction of the metal loss the programme leaves; the "
                     "corrosion inhibitor shortfall against the datasheet efficiency; the "
                     "inhibited rate on the surveyed line; the remaining life at that rate; the "
                     "allowance the design life demands at that rate; and the years of life the "
                     "availability costs against the same corrosion inhibitor at full "
                     "availability. The fraction as a plain number, the shortfall in percentage "
                     "points, the rate in mm/yr, the allowance in mm and both lives in years, all "
                     "to six decimals."),
    'advanced': (
        'expert',
        'SOKU, a gas line with its film stripped, worked back from its design life',
        'Inversion against the engine\'s own verdict',
        SOKU_TEXT + " Report six values: the largest rate at which the remaining allowance still "
                    "meets the design life; the availability at which the effective protection "
                    "first reaches the target, at the datasheet efficiency; the availability at "
                    "which the programme, with its credit kept, brings the surveyed rate low "
                    "enough to meet the design life; the total corrosion allowance that meets the "
                    "design life at that credited rate, with the consumed depth unchanged; the "
                    "remaining life at the uninhibited rate the stripped film leaves; and how many "
                    "times longer the life at the credited rate is than that stripped life. Rates "
                    "in mm/yr, availabilities in percent, the allowance in mm, the life in years "
                    "and the ratio as a plain number, all to six decimals."),
}

HEADER = """-- ============================================================================
-- FC9: Corrosion & Integrity joins the catalog, the NINTH Facilities course.
--
-- Catalog row (module 'facilities'; path_order 47, directly above FC8 at 46,
-- FC7 at 45, FC6 heattransfer at 44, FC5 at 43, FC4 gasprocessing at 42, FC3
-- rotating at 41, FC2 linesizing at 40 and FC1 separation at 39; prereq_slug
-- NULL, the carried-over answer "no hard prerequisite inside a module") plus
-- the three capstones and their eighteen graded fields, generated by
-- tools/course-waves/corrosion/gen_course.py from fields.json, precision.json
-- and the capstone conditions in fc9_capstone.mjs. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/corrosion, because the
-- 78 lessons, the teaching lab (corrosionLab.js) and its three explorer panels
-- ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. This engine is a CO2 corrosion rate screen
-- with a remaining-life division on the end of it, most of its numbers have no
-- source, and the discipline is grading only what it can stand behind.
--
-- THE ENGINE. engines/facilities/corrosion.js, vendored sha-identical with
-- engines d4c19ad (the FC9-0 repair and the WITHDRAWAL of the invented
-- sour-service severity region). It imports nothing. `regionProvided` and
-- `materialGuidanceProvided` come back false on every screening.
--
-- NOTHING GRADED IS A CORROSION RATE THE CORRELATION PRODUCED, and each held
-- item is cleared by CONSTRUCTION, IDENTITY, CANCELLATION or EXCLUSION, each
-- one measured in fc9_capstone.mjs rather than asserted. OBIGBO grades the
-- partial pressures, a mole ratio, this module's Reynolds number (a definition,
-- upstream of the held Blasius pair) and the corrosion inhibitor arithmetic;
-- NEMBE CREEK and SOKU state their uninhibited rate from an inspection survey,
-- so no de Waard-Milliams constant, no scale factor and no pH correction is in
-- any graded chain, and every capstone sits below its own computed film onset
-- so the unresolved placement of the scale factor cannot move a bit. No field
-- is a band label, a threshold verdict, a region or a material.
--
-- All eighteen graded values were swept against every number the digest prints
-- and against every number handed to a learner in a prompt, at each field's own
-- shipped tolerance: 0 collisions, and 0 pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('corrosion', 'Corrosion & Integrity', 'facilities', 47, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title, prompt = TIER[tier]
    fl = [f for f in fields if f[0] == tier]
    assert len(fl) == 6, f'{tier} has {len(fl)} fields'
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[(t, k)][0])},"
        f" 'unit',{q(LABELS[(t, k)][1])}, 'expected',{repr(v)}, 'tol',{repr(tol)})"
        for t, k, v, tol in fl)
    blocks.append(f"(\n  'corrosion', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
bad = []
odd = [ln for ln, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
dashes = len(re.findall('[–—]', sql))

# EVERY CONDITION A PROMPT STATES IS THE GENERATOR'S. Each frozen value must
# appear, as a learner reads it, in its own tier's prompt.
for tier, obj in (('beginner', OBIGBO), ('intermediate', NEMBE), ('advanced', SOKU)):
    for k, v in obj.items():
        if isinstance(v, float) and n(v) not in TIER[tier][3]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which fc9_capstone.mjs ran')

for (t, k), (label, _u) in LABELS.items():
    for frag in FORBIDDEN_LABEL_FRAGMENTS:
        if frag in label.lower():
            bad.append(f'{t}.{k} label names a held quantity through "{frag}": {label}')
if not any(frag in 'the rate category of the stream' for frag in FORBIDDEN_LABEL_FRAGMENTS):
    bad.append('the forbidden-label sweep does not catch a planted "category" label')

NUM = re.compile(r'-?\d+\.?\d*')
handed = []
for tier in TIERS:
    for tok in NUM.findall(TIER[tier][3]):
        try:
            handed.append((tier, abs(float(tok))))
        except ValueError:
            pass
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} prompt')
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of one
# of them is a lookup rather than a calculation.
digest_nums = set()
for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        digest_nums.add(abs(float(tok)))
    except ValueError:
        pass
for ftier, key, val, tol in fields:
    for d in digest_nums:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST NOT ASK FOR FEWER DIGITS THAN A FIELD IS GRADED AT. The rule
# is per CLASS and not per prompt, because a tier may state two precisions.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', TIER[tier][3])
                    if w in WORD_N})
    if not asked:
        bad.append(f'{tier} prompt asks for no precision at all')
        continue
    needed = {}
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes, not exactly one')
            continue
        dp = precision[cls[0]]['decimals']
        needed.setdefault(dp, []).append(key)
        if tol < 0.5 * 10 ** -dp:
            bad.append(f'{tier}.{key} is graded at {tol}, below the half-unit of the {dp} '
                       f'decimals its class {cls[0]} prints')
    for dp, keys in sorted(needed.items()):
        if dp not in asked:
            bad.append(f'{tier} prompt asks for {asked} decimals and never for {dp}, which is '
                       f'what {", ".join(keys)} are graded to')
    for a in asked:
        if a not in needed:
            bad.append(f'{tier} prompt asks for {a} decimals, which no field it grades uses')

# THE VOCABULARY RULES THIS WAVE LEGISLATED (digest section 22). No bare
# "inhibitor", and no Reynolds number without the line sizing seam named.
for tier in TIERS:
    text = TIER[tier][3]
    for m in re.finditer(r'\binhibitor\b', text):
        if not text[max(0, m.start() - 10):m.start()].endswith('corrosion '):
            bad.append(f'{tier} prompt carries a bare "inhibitor" at {m.start()}')
    if 'Reynolds' in text and 'Line Sizing' not in text:
        bad.append(f'{tier} prompt names a Reynolds number without the line sizing seam')
    if len(text) < 400 or 'Report' not in text:
        bad.append(f'{tier} prompt is {len(text)} chars and promptleak would not sweep it')

if bad or odd or dashes:
    for b in bad:
        print('  REFUSED:', b)
    print('odd-quote lines:', odd, '| en/em dashes:', dashes)
    print('NOTHING WRITTEN.')
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines: [] | en/em dashes: 0')
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIERS})
print(f'conditions read out of fc9_capstone.mjs and found in their prompts: '
      f'{sum(1 for o in (OBIGBO, NEMBE, SOKU) for v in o.values() if isinstance(v, float))}')
print(f'digest numbers swept: {len(digest_nums)} | handed-in-prompt values: {len(handed)}')
print('handed-in-prompt + pairwise + digest collisions + precision + labels + vocabulary: 0')
