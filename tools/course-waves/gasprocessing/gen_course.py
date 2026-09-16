#!/usr/bin/env python3
"""Generate the FC4 course + capstone migration from fields.json and the
capstone constants, so no expected value or condition is retyped.

Modelled on tools/course-waves/rotating/gen_course.py (FC3), with the two
differences FC4 forces:

1. FC4's FIELD KEYS ARE NOT GLOBALLY UNIQUE. `circGpm` is graded on the
   Associate as a glycol circulation of 7.266802818928299 gpm and on the
   Professional as an amine circulation of 734.5776758597356 gpm, and the two
   are arrived at by routes with nothing in common. That is the point of the
   Professional tier, so the keys stay as they are and everything downstream is
   keyed by (TIER, KEY) instead. FC3 could get away with a flat map and this
   file may not.

2. THE PRECISION SENTENCE IN EACH PROMPT IS THE ONE THE COURSE PRINTS, and it
   is checked against precision.json rather than written by hand. Every prompt
   is asserted to ask for at least the digits the tightest field in its tier
   needs, and never to ask for a precision no field in that tier uses.

   The Associate and the Professional each grade two classes and so ask for
   both. The Expert grades six decimals throughout and asks for six only.

Usage: python3 gen_course.py
   FC4_WAVE       the wave directory (default /root/fc-wip-gasprocessing)
   FC4_REPO       the nextgen clone   (default /root/wt-fc4-nextgen)
   FC4_COURSE_OUT where to write      (default $FC4_REPO/migrations/...)
"""
import json
import os
import re
import sys

# THE WAVE AND THE OUTPUT ARE BOTH OVERRIDABLE, so gen_seeds.sh can point this
# at a STAGED COPY OF THE COMMITTED TREE rather than at a working tree. A
# generator that can only read a working tree cannot be re-run to prove that
# what was committed is what the committed inputs produce.
W = os.environ.get('FC4_WAVE', '/root/fc-wip-gasprocessing')
REPO = os.environ.get('FC4_REPO', '/root/wt-fc4-nextgen')
OUT = os.environ.get('FC4_COURSE_OUT', f'{REPO}/migrations/20260924_fc4_gasprocessing_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The eighteen graded fields, KEYED BY (TIER, KEY). Each label names the
# quantity and, where the course's whole discipline turns on it, WHICH of two
# same-unit quantities it is: a glycol circulation and an amine circulation are
# both gpm and answer different questions.
# ---------------------------------------------------------------------------
LABELS = {
    # Associate: water, and what it costs to take out.
    ('beginner', 'inletLbMMscf'):
        ('Saturated water content of the gas at the contactor inlet', 'lb/MMscf'),
    ('beginner', 'waterLbDay'):
        ('Water the unit takes out, the content difference applied to the rate', 'lb/day'),
    ('beginner', 'circGpm'):
        ('Glycol circulation, the stated ratio applied to that water rate', 'gpm'),
    ('beginner', 'circGpd'):
        ('The same glycol circulation as a daily volume', 'gal/day'),
    ('beginner', 'sensiblePerGal'):
        ('Sensible heat per gallon circulated, built from the stated glycol properties', 'Btu/gal'),
    ('beginner', 'btexTonsYear'):
        ('BTEX carried to the still overhead', 'short tons/yr'),
    # Professional: stages, solvents and what a column costs.
    ('intermediate', 'fractionRemoved'):
        ('Fraction removed by the absorber at its stated working point', 'fraction'),
    ('intermediate', 'stagesNeeded'):
        ('Stages the contract removal demands at that same absorption factor', 'stages'),
    ('intermediate', 'acidMolesDay'):
        ('Acid gas the solution picks up, as moles', 'lbmol/day'),
    ('intermediate', 'circGpm'):
        ('Amine circulation, from the mole balance closed by the loading swing', 'gpm'),
    ('intermediate', 'reboilerMMBtuHr'):
        ('Regenerator duty on that circulation, at the stated duty per gallon', 'MMBtu/hr'),
    ('intermediate', 'circGpmRetuned'):
        ('Amine circulation again with the regenerator retuned to a leaner lean', 'gpm'),
    # Expert: the cold end, the overhead, and where the method stops.
    ('advanced', 'dzdT'):
        ('Compressibility temperature derivative at the skid inlet', 'per degR'),
    ('advanced', 'muFPerPsi'):
        ('Joule-Thomson coefficient at that inlet', 'degF/psi'),
    ('advanced', 'dropF'):
        ('Cooling across the let-down, marched rather than taken in one step', 'degF'),
    ('advanced', 't2F'):
        ('Temperature the gas reaches at the separator inlet', 'degF'),
    ('advanced', 'waterInLbMMscf'):
        ('Water the gas carries at the skid inlet', 'lb/MMscf'),
    ('advanced', 'waterOutLbMMscf'):
        ('Water the gas can still hold at the cold spot', 'lb/MMscf'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'

# ---------------------------------------------------------------------------
# The conditions, written out of fc4_fields_capstone.mjs. Every quantity that
# changes an answer is stated, so no graded value rides on a table default.
# Nothing that IS an answer is stated.
# ---------------------------------------------------------------------------
IKOT_ABASI = (
    "IKOT ABASI, the TEG dehydration train on a gas gathering station making pipeline spec. The "
    "contactor takes 47 MMscfd at 880 psia and 109 degF and has to leave at 5 lb a MMscf. The "
    "circulation ratio chosen for this unit is 3.6 gallons of glycol per pound of water, and the "
    "lean glycol is 99.4 weight percent TEG. The absorber runs at 109 degF and the reboiler at "
    "368 degF, with a reflux ratio of 0.22. The glycol has a heat capacity of 0.55 Btu per lb "
    "degF and weighs 9.3 lb a gallon, both stated, so they are conditions of the problem rather "
    "than lookups. The inlet carries 155 ppmv of BTEX, of which 0.12 is absorbed, at a molecular "
    "weight of 92.")

OTUMARA = (
    "OTUMARA, the sour gas train. The absorber's own working point is an absorption factor of "
    "1.85 over 5 stages, and the contract spec demands a removal of 0.94 of that same absorber. "
    "The amine unit takes 71 MMscfd carrying 6.4 mol percent CO2 and 0.78 mol percent H2S and "
    "has to leave at 2.5 and 0.0004. The solvent is DEA at 33 weight percent, circulating from a "
    "lean loading of 0.07 to a rich loading of 0.38. The regenerator is run at 920 Btu a gallon, "
    "stated rather than taken from any table. A retune would take the lean loading to 0.03 and "
    "leave every other condition where it is.")

ESCRAVOS = (
    "ESCRAVOS, the dew point skid. Gas at 935 psia and 87 degF lets down across a choke to 405 "
    "psia into a low temperature separator. The gas gravity is 0.67 and its molar heat capacity "
    "is 10.2 Btu per lbmol degF. The let-down begins below the pressure at which this engine "
    "warns that its water chart correction is out of its stated band, so nothing reported here "
    "leans on a quantity held for the literature.")

TIER = {
    'beginner': (
        'associate',
        'IKOT ABASI, a TEG dehydration train read from the line conditions to the still overhead',
        'One stream, one balance, end to end',
        IKOT_ABASI + " Report six values: the water the gas carries at the inlet, the water the "
                     "unit takes out, the glycol circulation as a rate and as a daily volume, the "
                     "sensible heat a gallon of that glycol costs, and the BTEX that reaches the "
                     "still overhead. Water contents in lb a MMscf, circulations in gpm and BTEX "
                     "in short tons a year, to six decimals. Daily masses in lb a day, daily "
                     "volumes in gallons a day and heat in Btu a gallon, to four decimals."),
    'intermediate': (
        'professional',
        'OTUMARA, a sour gas train read as a staged device and then as a mole balance',
        'The column, the solvent, and which question each number answers',
        OTUMARA + " Report six values: what the absorber removes at its stated working point, the "
                  "stages the contract removal demands of it, the acid gas the solution picks up "
                  "as moles, the amine circulation, the regenerator duty on that circulation, and "
                  "the circulation again after the retune. Removals as a fraction, stages, "
                  "circulations in gpm and the duty in MMBtu an hour, to six decimals. Moles in "
                  "lbmol a day, to four decimals."),
    'advanced': (
        'expert',
        'ESCRAVOS, a dew point skid from the compressibility derivative to the water left in the gas',
        'The cold end, marched rather than stepped',
        ESCRAVOS + " Report six values: the compressibility temperature derivative at the inlet, "
                   "the Joule-Thomson coefficient there, the cooling the let-down produces, the "
                   "temperature the gas reaches, and the water it carries at the inlet and can "
                   "still hold at the cold spot. The derivative per degR, the coefficient in degF "
                   "a psi, temperatures in degF and water contents in lb a MMscf, all to six "
                   "decimals."),
}

HEADER = """-- ============================================================================
-- FC4: Gas Processing joins the catalog, the FOURTH Facilities course.
--
-- Catalog row (module 'facilities'; path_order 42, directly above FC3 rotating
-- at 41, FC2 linesizing at 40 and FC1 separation at 39; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module") plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/gasprocessing/gen_course.py from fields.json,
-- precision.json and the capstone constants in fc4_fields_capstone.mjs. Deep
-- seeds are three separate migrations; the go-live is a fifth and is HELD until
-- a NextGen production upload carries the route /dashboard/apps/gasprocessing,
-- because the 78 lessons, the teaching lab (gasprocessingLab.js) and its three
-- explorer panels ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. Gas conditioning is three separate balances
-- over one stream, and the discipline is knowing which of the numbers in front
-- of you the engine COMPUTED, which one you CHOSE, and which one it simply kept
-- to itself.
--
-- THE ENGINE. engines/facilities/gasProcessing.js (the saturation fit and the
-- band it stands behind, the water balance, the glycol circulation, the
-- reboiler duty split into named parts, the still overhead, the Kremser
-- absorber, the amine mole balance and its loading swing, the contactor, the
-- compressibility and its temperature derivative, the Joule-Thomson
-- coefficient and the marched let-down) over engines/production/gasProperties.js
-- and engines/facilities/separatorSizing.js, which is where the repaired module
-- takes its DAK validity band from. Vendored at engines 82ec6d4, the FC4-0
-- repair wave, sha-identical over ten paths.
--
-- THE MODULE'S RETURN CONTRACT, which the Associate tier grades a reading of.
-- Nine exports are DOORS: each takes a named-argument object, answers with an
-- object, and puts a named string on an `error` key when it cannot answer. Four
-- are SCALAR HELPERS: each takes one positional value, answers with a bare
-- number or one row of a table, and reports no answer with a bare NaN or a
-- null. Every helper is consumed by a door, so no helper's no-answer reaches a
-- caller of a door. This module throws nothing at all.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY, and each one is
-- neutralised by construction rather than by hope. The McKetta and Wehe
-- real-gas correction is held, so IKOT ABASI sits BELOW the pressure at which
-- the engine warns and ESCRAVOS lets down from below it too. The water overhead
-- the reboiler pays for is a typed constant with no source, so no graded
-- Associate field reads a reboiler duty and the SENSIBLE half, built entirely
-- from stated inputs, is what is graded. The amine contactor's liquid density
-- is the wrong fluid for an amine, so no graded Professional field reads a
-- contactor diameter. The customary amine duty per gallon is held, so OTUMARA
-- states its own 920 Btu a gallon. The BTEX absorbed fraction and molecular
-- weight are operating values, so both are stated wherever a BTEX figure is
-- graded. The go-live asserts all five, on the labels and again on the values.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: that a
-- water content is intensive and a water rate is not, that a circulation ratio
-- is a choice the engine refuses to make, that a contactor is a staged device
-- with a ceiling no steel can buy past, that a glycol circulation and an amine
-- circulation carry the same unit and answer different questions, and that a
-- coefficient at the inlet applied across a whole let-down is not the drop.
-- All eighteen graded values were swept against every number the digest prints
-- and against every number handed to a learner in a prompt, at each field's own
-- tolerance: 0 collisions, and 0 pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('gasprocessing', 'Gas Processing', 'facilities', 42, 'coming_soon', null)",
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
    blocks.append(f"(\n  'gasprocessing', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'
open(OUT, 'w').write(sql)

# --------------------------------------------------------------- self checks
odd = [n for n, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
dashes = len(re.findall('[–—]', sql))

NUM = re.compile(r'-?\d+\.?\d*')
handed = []
for tier in TIERS:
    for tok in NUM.findall(TIER[tier][3]):
        try:
            handed.append((tier, abs(float(tok))))
        except ValueError:
            pass
bad = []
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} prompt')
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of
# one of them is a lookup rather than a calculation.
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

# THE PROMPT MUST NOT ASK FOR FEWER DIGITS THAN A FIELD IS GRADED AT, which is
# the defect that started this on a sibling wave: a learner told to quote six
# decimals and graded at 1e-9 fails by three hundred tolerances while doing
# exactly as told. The rule is per CLASS and not per prompt, because a tier may
# legitimately state two precisions: the Associate prints water contents,
# circulations and tons to six and daily masses, daily volumes and heat to four,
# and says both.
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

for tier in TIERS:
    if len(TIER[tier][3]) < 400 or 'Report' not in TIER[tier][3]:
        bad.append(f'{tier} prompt is {len(TIER[tier][3])} chars and promptleak would not sweep it')

print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines:', odd, '| en/em dashes:', dashes)
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIERS})
print(f'digest numbers swept: {len(digest_nums)} | handed-in-prompt values: {len(handed)}')
for b in bad:
    print('  REFUSED:', b)
print('handed-in-prompt + pairwise + digest collisions + precision:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
