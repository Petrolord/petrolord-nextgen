#!/usr/bin/env python3
"""Generate the H5 course + capstone migration from the ENGINE'S OWN RUN, so no
expected value and no condition is retyped.

Modelled on tools/course-waves/lopa/gen_course.py (H3), with the differences H5
forces:

1. THE ENGINE IS RUN HERE. `node h5_capstone.mjs --json` is executed through the
   vendored engines/hse/qra.js (H5_ENGINES, loaded through qra_engine.mjs) and
   the one tolerance module (H5_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. gen_golive.py imports this module and
   takes its engine values from THIS run, which is the engine ledger the
   go-live checks the seeded rows against.

2. THE CONDITIONS ARE READ OUT OF THE SAME GENERATOR. `h5_capstone.mjs --inputs`
   prints the three frozen facilities the engine was run on (UKPOKITI, OGINI,
   EBUGHU), and every prompt below is RENDERED from them, one fragment per
   input. A self check then proves every number and every name the engine ran
   on is stated in its own tier's prompt, as a learner reads it, so a prompt
   cannot drift from what was graded.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 34) AND THE SEAMS ARE
   ENFORCED ON EVERY PROMPT, TITLE AND LABEL: never "severity", "likelihood",
   "NPV" or "IRR"; a probit or a dose only beside the consequence study it
   comes from. The copy rule too: no em or en dash and no "X, not Y" or "X and
   not Y" contrastive. Every rule is planted once and must be caught.

4. THREE PRECISIONS. Per-year values print to TWELVE decimals, FAR, ratios and
   fatality counts to SIX, money to TWO (precision.json). Each prompt asks for
   exactly the decimals its fields are graded to, and each tolerance is at
   least half a unit in the last printed place.

EVERY PROBABILITY OF DEATH AND EVERY EXPECTED NUMBER OF DEATHS IS STATED, as a
figure from the facility's consequence study; producing one belongs to the
consequence course. EVERY VALUE OF PREVENTING A FATALITY IS STATED with its
price year, as the HSE's published illustration.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships.

Usage: python3 gen_course.py
   H5_WAVE        the wave directory (default /root/hse-wip-qra)
   H5_REPO        the nextgen clone   (default /root/wt-h5-nextgen)
   H5_ENGINES     packages/engines to run the capstone through (default $H5_REPO/packages/engines)
   H5_TOLERANCE   gradedTolerance.js (default the one in $H5_REPO)
   H5_COURSE_OUT  where to write      (default $H5_REPO/migrations/...)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('H5_WAVE', '/root/hse-wip-qra')
REPO = os.environ.get('H5_REPO', '/root/wt-h5-nextgen')
ENGINES = os.environ.get('H5_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'H5_TOLERANCE', f'{REPO}/src/components/course/panels/qra/gradedTolerance.js')
OUT = os.environ.get('H5_COURSE_OUT', f'{REPO}/migrations/20261007_h5_qra_course.sql')

SLUG, MODULE, PATH_ORDER = 'qra', 'hse', 65
NAME = 'Quantitative Risk Assessment'
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
bad = []

for what, got, want in (('slug', wave.get('slug'), SLUG), ('module', wave.get('module'), MODULE),
                        ('pathOrder', wave.get('pathOrder'), PATH_ORDER), ('name', wave.get('name'), NAME),
                        ('prerequisite', wave.get('prerequisite', 'MISSING'), None)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# THE ENGINE RUN, through the vendored engine the committed tree carries; the
# environment is passed explicitly so a run staged by gen_seeds.sh cannot reach
# back out to a working tree.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, H5_ENGINES=ENGINES, H5_TOLERANCE=TOLPATH, H5_REPO=os.environ.get('H5_ESBUILD_REPO', REPO), TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/h5_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/h5_capstone.mjs'))
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

UK, OG, EB = INPUTS['UKPOKITI'], INPUTS['OGINI'], INPUTS['EBUGHU']


def n(x):
    """A number as a learner reads it and as the digest prints stated inputs: a
    whole number with no separators; a small rate in exponent form with no
    padded exponent (6.3e-7); anything else as its shortest decimal."""
    if isinstance(x, bool):
        sys.exit(f'REFUSED: {x!r} is a flag, not a number')
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    m = re.fullmatch(r'(\d(?:\.\d+)?)e-0?(\d+)', s)
    if m:
        return f'{m.group(1)}e-{m.group(2)}'
    return s


def join_and(parts):
    parts = list(parts)
    return parts[0] if len(parts) == 1 else ', '.join(parts[:-1]) + ' and ' + parts[-1]


def branch(b):
    """One branch of an event tree as a learner reads it, its outcome named."""
    s = f"'{b['name']}' {n(b['probability'])}"
    if 'next' in b:
        return s + ', then ' + ' or '.join(branch(x) for x in b['next']['branches'])
    return s + f" (outcome '{b.get('outcome', b['name'])}')"


def pds(place):
    return join_and(f"'{k}' {n(v)}" for k, v in UK['deathProbability'][place].items())


def scen(s):
    return f"'{s['name']}' {n(s['frequencyPerYr'])} per year with N = {n(s['fatalities'])}"


def harms(m):
    hs = m.get('otherHarms') or []
    if not hs:
        return 'no other harm counted'
    return 'other harms prevented: ' + join_and(
        f"'{h['name']}' {n(h['expectedCasesPerYr'])} cases a year at {n(h['valuePerCase'])} GBP a case" for h in hs)


def rates(m):
    rb, rc, g = m.get('benefitDiscountRate', 0), m.get('costDiscountRate', 0), m.get('benefitGrowthRate', 0)
    if not (rb or rc or g):
        return 'undiscounted, every rate zero'
    s = f"benefits discounted at {n(rb)} a year and costs at {n(rc)} a year"
    if g:
        s += f", the benefit uprated by {n(g)} a year"
    return s + ', every flow at the end of its year'


def measure(label, what, m):
    cost = f"a capital cost of {n(m['capitalCost'])} GBP at year 0"
    if m.get('annualCost'):
        cost += f" and {n(m['annualCost'])} GBP at the end of each year"
    return (f"{label}, {what}: a PLL reduction of {n(m['deltaPllPerYr'])} fatalities per year, a VPF of {n(m['vpf'])} GBP, "
            f"{harms(m)}, a life of {n(m['lifetimeYears'])} years, {cost}, a disproportion factor of "
            f"{n(m['disproportionFactor'])}, {rates(m)}.")


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where a tier
# grades two of the same unit, WHICH one.
# ---------------------------------------------------------------------------
LABELS = {
    'ukpokiti_compressor_explosion_frequency_per_yr':
        ("The compressor release's explosion frequency", 'per year'),
    'ukpokiti_camp_exposure_frequency_per_yr':
        ("The sour gas release's camp exposure frequency, pooled over every path", 'per year'),
    'ukpokiti_control_room_lsir_per_yr':
        ('The LSIR in the control room', 'per year'),
    'ukpokiti_compressor_deck_lsir_per_yr':
        ('The LSIR on the compressor deck', 'per year'),
    'ukpokiti_operator_irpa_per_yr':
        ("The operator's IRPA", 'per year'),
    'ukpokiti_technician_irpa_per_yr':
        ("The technician's IRPA", 'per year'),
    'ogini_crew_pll_per_yr':
        ("The crew's PLL", 'fatalities per year'),
    'ogini_crew_far':
        ("The crew's FAR", 'per 100,000,000 exposed hours'),
    'ogini_village_frequency_ten_or_more_per_yr':
        ("The village's frequency of ten or more deaths", 'per year'),
    'ogini_village_vrom_max_ratio':
        ("The worst ratio of the village curve to the line", 'ratio'),
    'ogini_village_exceedance_from_fatalities':
        ('The N from which the village curve lies above the line on the stated step', 'fatalities'),
    'ogini_village_r2p2_point_ratio':
        ('The ratio of the village curve to the R2P2 point', 'ratio'),
    'ebughu_deluge_cost_to_benefit_ratio':
        ("The deluge's cost to benefit ratio", 'ratio'),
    'ebughu_deluge_icaf_gbp':
        ("The deluge's ICAF, its cost per fatality prevented", 'GBP'),
    'ebughu_deluge_maximum_reasonably_practicable_cost_gbp':
        ('The largest cost the deluge could carry and stay reasonably practicable', 'GBP'),
    'ebughu_blast_wall_cost_to_benefit_ratio':
        ("The blast wall's cost to benefit ratio", 'ratio'),
    'ebughu_blast_wall_icaf_gbp':
        ("The blast wall's ICAF, its cost per fatality prevented", 'GBP'),
    'ebughu_gas_detection_cost_to_benefit_ratio':
        ("The gas detection's cost to benefit ratio", 'ratio'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs, one fragment per input.
# gen_golive.py checks every fragment is in the shipped prompt with strpos.
# ---------------------------------------------------------------------------
C_ = UK['compressor']
S_ = UK['sourGas']
OP, TE = UK['operator'], UK['technician']
VR = OG['village']
FN_LINE = 'vrom-establishments'
FN_POINT = 'r2p2-para-136'
if OG['criterionPreset'] != FN_LINE or OG['pointPreset'] != FN_POINT:
    bad.append('the OGINI criteria are not the two presets this prompt describes')
FRAG = {
    'beginner': [
        'UKPOKITI, an onshore gas compression station with a workers\' camp. Every frequency is per year and every '
        'probability is a fraction. Every probability of death below is stated from the station\'s consequence '
        'study, for a person present outdoors and unprotected at the place, and this capstone takes it as given.',
        f"COMPRESSOR RELEASE: a continuous gas release in the compressor module at {n(C_['initiatingFrequencyPerYr'])} "
        f"per year. Immediate ignition probability {n(C_['immediateIgnitionProbability'])}, giving the outcome "
        f"'jet or pool fire'; delayed ignition probability {n(C_['delayedIgnitionProbability'])} GIVEN no immediate "
        f"ignition, a delayed ignition burning as a 'flash fire' with probability "
        f"{n(C_['vapourCloudSplit']['flashFire'])} or as an 'explosion' with probability "
        f"{n(C_['vapourCloudSplit']['explosion'])}; otherwise 'no ignition'.",
        f"SOUR GAS RELEASE: a sour gas release at the inlet manifold at {n(S_['initiatingFrequencyPerYr'])} per year, "
        f"with the branches {'; or '.join(branch(b) for b in S_['tree']['branches'])}.",
        f"PROBABILITY OF DEATH BY PLACE: in the control room {pds('controlRoom')}; on the compressor deck "
        f"{pds('compressorDeck')}; in the camp {pds('camp')}. An outcome not listed at a place kills no one there.",
        f"OPERATOR: {n(OP['compressorDeckHoursPerYr'])} hours a year on the compressor deck, "
        f"{n(OP['controlRoomHoursPerYr'])} hours in the control room and {n(OP['campHoursPerYr'])} hours in the camp. "
        f"TECHNICIAN: {n(TE['compressorDeckFraction'])} of the year on the compressor deck, "
        f"{n(TE['controlRoomHoursPerYr'])} hours in the control room and {n(TE['campHoursPerYr'])} hours in the camp. "
        'A year is 8760 hours, and no vulnerability factor is applied.',
    ],
    'intermediate': [
        'OGINI, a gas terminal beside a village. Every frequency is per year. The expected number of deaths of each '
        'scenario, N, is stated from the terminal\'s consequence study and need not be whole; this capstone takes it '
        'as given.',
        f"CREW: {'; '.join(scen(s) for s in OG['crew'])}. The crew roster is {n(OG['crewPersons'])} people, each "
        f"exposed {n(OG['crewHoursPerPersonPerYr'])} hours a year.",
        f"VILLAGE: {'; '.join(scen(s) for s in VR)}.",
        f"Compare the village curve with the line the engine calls {FN_LINE}, the Purple Book Figure 6.8 line "
        f"F = 0.001 / N^2 per year for N of 10 or more, on which the three Bevi points lie; and with the point the "
        f"engine calls {FN_POINT}, the single R2P2 point of 50 or more deaths at 1 in 5000 per year. Read the curve "
        f"as the frequency of N OR MORE deaths. The step of the village curve that ends at N = "
        f"{n(OG['exceedanceStepEndsAtFatalities'])} is the one the fifth value asks about.",
    ],
    'advanced': [
        'EBUGHU, a gas processing plant weighing three proposed risk reduction measures by the HSE gross '
        'disproportion test. Every PLL reduction is stated from the plant\'s own assessment. The values of preventing '
        'a fatality are the HSE\'s published figures, used here for illustration only: 1336800 GBP at 2003 prices '
        'and 1000000 GBP at 2001 prices.',
        measure('DELUGE', 'a deluge system on the compressor module', EB['deluge']),
        measure('BLAST WALL', 'a blast wall between the process area and the control building', EB['blastWall']),
        measure('GAS DETECTION', 'an upgrade of the gas detection', EB['gasDetection']),
        'Count the fatalities prevented undiscounted, the PLL reduction times the life in years.',
    ],
}

ASK = {
    'beginner': (
        " Report six values: the compressor release's explosion frequency per year; the sour gas release's camp "
        "exposure frequency per year, pooled over every path that reaches it; the LSIR in the control room per year; "
        "the LSIR on the compressor deck per year; the operator's IRPA per year; and the technician's IRPA per year. "
        'Every value to twelve decimals.'),
    'intermediate': (
        " Report six values: the crew's PLL, fatalities per year; the crew's FAR per 100,000,000 exposed hours; the "
        "village's frequency of ten or more deaths per year; the worst ratio of the village curve to the line; the N "
        "from which the village curve lies above the line on the step that ends at N = "
        f"{n(OG['exceedanceStepEndsAtFatalities'])}; and the ratio of the village curve to the R2P2 point. The PLL "
        'and the frequency to twelve decimals, the FAR, the ratios and the N to six decimals.'),
    'advanced': (
        " Report six values: the deluge's cost to benefit ratio; the deluge's ICAF, its cost per fatality "
        'prevented, in GBP; the largest cost the deluge could carry and stay reasonably practicable, in GBP; the '
        "blast wall's cost to benefit ratio; the blast wall's ICAF in GBP; and the gas detection's cost to benefit "
        'ratio. The ratios to six decimals, the GBP values to two decimals.'),
}
PROMPTS = {t: ' '.join(FRAG[t]) + ASK[t] for t in TIERS}

TIER = {
    'beginner': ('associate', 'UKPOKITI, an onshore gas compression station and its camp',
                 'How often each outcome happens, and what one person carries', PROMPTS['beginner']),
    'intermediate': ('professional', 'OGINI, a gas terminal beside a village',
                     'How many at once: the crew and the village', PROMPTS['intermediate']),
    'advanced': ('expert', 'EBUGHU, three proposed measures at a gas processing plant',
                 'Which measures are reasonably practicable', PROMPTS['advanced']),
}


HEADER = """-- ============================================================================
-- H5: Quantitative Risk Assessment joins the catalogue, the FIFTH and last
-- course of the HSE module.
--
-- Catalogue row (module 'hse'; path_order 65, above H4 consequence at 64 and H3
-- lopa at 63; prereq_slug NULL, the carried-over answer "no hard prerequisite
-- inside a module"; school left at its default, as every HSE course leaves it,
-- so the fees are the published school-level rows) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/qra/gen_course.py
-- from the ENGINE'S OWN RUN (h5_capstone.mjs through the vendored
-- engines/hse/qra.js), which it refuses to write unless fields.json carries
-- exactly that run's values and the tolerance gradedTolerance.js derives. Deep
-- seeds are three separate migrations; the go-live is a fifth and is HELD until
-- a NextGen production upload carries the route /dashboard/apps/qra, because
-- the 78 lessons, the teaching lab (qraLab.js) and its three explorer panels
-- ship in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A quantitative risk assessment turns scenario
-- frequencies and probabilities of death into one person's individual risk, a
-- population's societal risk and a test of whether a further measure is
-- reasonably practicable, so the course teaches how often and what one person
-- carries (Associate), how many die at once (Professional), and whether a
-- further measure is reasonably practicable and what the engine does not know
-- (Expert), and grades each tier on its own question with numbers the engine
-- returns.
--
-- THE ENGINE. engines/hse/qra.js at the canonical pin petrolord-engines
-- 16fd6c9. Nothing is invented: every frequency, probability, probability of
-- death, occupancy, VPF, DF and rate is an input. Every branch set sums to one
-- within 1e-9; F(N) is the frequency of N or more deaths; a value exactly at a
-- threshold belongs to the lower band; present values are year-end; the ICAF
-- counts fatalities prevented undiscounted.
--
-- WHAT IS GRADED. UKPOKITI (Associate) grades two event tree outcome
-- frequencies, two LSIRs and two IRPAs; OGINI (Professional) grades a crew's
-- PLL and FAR, a village's frequency of ten or more deaths, its worst ratio to
-- the Dutch line, where it exceeds on a stated step, and its ratio to the R2P2
-- point; EBUGHU (Expert) grades cost to benefit ratios, ICAFs and the largest
-- reasonably practicable cost of three measures under stated discounting.
-- Every value is a return value of the engine, and every prompt is rendered
-- from the inputs the engine was run on. Every probability of death and every
-- expected number of deaths is stated: producing one belongs to the
-- consequence course, which this course never grades.
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
for t in TIERS:
    for fr in FRAG[t]:
        if fr not in PROMPTS[t]:
            bad.append(f'{t}: a rendered fragment is missing from its own prompt')

# EVERY CONDITION THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, as a learner
# reads it: every number (as a whole token), every name, and every IPL with its
# flag beside it.
NUMTOK = re.compile(r'(?<![\w.])\d+(?:\.\d+)?(?:e-\d+)?(?![\w.]*\d)')


def walk(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f'{path}[{i}]')
    else:
        yield path, obj


INPUT_COUNT = 0
for tier, obj in (('beginner', UK), ('intermediate', OG), ('advanced', EB)):
    toks = set(NUMTOK.findall(PROMPTS[tier]))
    for path, v in walk(obj):
        INPUT_COUNT += 1
        if isinstance(v, bool):
            continue
        if isinstance(v, str):
            if v not in PROMPTS[tier]:
                bad.append(f'{tier} prompt does not state {path} = {v!r}, which the engine ran')
        elif n(v) not in toks:
            bad.append(f'{tier} prompt does not state {path} = {n(v)}, which the engine ran')

# THE VOCABULARY (digest section 34), THE SEAMS AND THE COPY RULE, over every
# prompt, dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    if re.search(r'\bseverit(y|ies)\b', text, re.I):
        out.append(f'{label} carries "severity"')
    if re.search(r'\blikelihoods?\b', text, re.I):
        out.append(f'{label} carries "likelihood"')
    if re.search(r'\b(NPV|IRR)\b', text) or re.search(r'net present value|internal rate of return|payback', text, re.I):
        out.append(f'{label} carries an economics measure this course never names')
    for s in re.split(r'(?<=[.;])\s+', text):
        if re.search(r'\b(probits?|doses?|dispersion|plumes?|source terms?)\b', s, re.I) and \
                not re.search(r'consequence (study|course|modelling)|\bstated\b|\bgiven\b', s, re.I):
            out.append(f'{label} names a consequence model with no seam beside it')
        if re.search(r'\b(LOPA|SIL|PFDavg|IPL|TMEL)\b', s):
            out.append(f'{label} names a LOPA quantity')
    if re.search('[\u2013\u2014]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w|\band not\b', text, re.I):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
# The guard must be able to fire: every rule is planted once and must be caught.
for plant, rule in (('the severity of it', 'severity'), ('a likelihood score', 'likelihood'),
                    ('the NPV of the measure', 'NPV'), ('the probit of the cloud.', 'seam'),
                    ('the SIL of the trip', 'LOPA'), ('a band \u2014 pooled', 'dash'),
                    ('the individual risk, not the PLL', 'contrastive'),
                    ('the LSIR and not the IRPA', 'contrastive and not')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')
for clean in ('a probability of death stated from the consequence study', 'the present value of the cost',
              'the frequency of N or more deaths'):
    if vocabulary('clean', clean):
        bad.append(f'the vocabulary sweep fires on clean text: {clean!r}')

for tier in TIERS:
    if not PROMPTS[tier].count('Report six values') == 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')
    if not re.search(r'consequence study|published figures', PROMPTS[tier]):
        bad.append(f'{tier} prompt does not say where its stated probabilities, deaths or values come from')

# NUMBERS HANDED TO A LEARNER, every tier's prompt against every graded value
# of EVERY tier, at the shipped tolerance. A different tier is a leak; the same
# tier is a transcription. Exponent spellings are read as the numbers they are.
NUM = re.compile(r'\d+(?:\.\d+)?(?:e-\d+)?')
handed = [(t, float(tok)) for t in TIERS for tok in NUM.findall(PROMPTS[t].replace(',', ''))]
handed += [(t, float(tok)) for t in TIERS for tok in NUM.findall((TIER[t][1] + ' ' + TIER[t][2]).replace(',', ''))]
handed += [(TIER_OF[k], float(tok)) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]).replace(',', ''))]
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
DNUM = re.compile(r'\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')
DIGEST_NUMS = sorted({float(tok) for tok in DNUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read())})
if len(DIGEST_NUMS) < 300:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read, so the digest sweep is reading the wrong thing')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST ASK FOR EXACTLY THE DECIMALS ITS FIELDS ARE GRADED TO.
WORD_N = {'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
          'eleven': 11, 'twelve': 12}
DP = {}
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
        DP[key] = dp
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
    print(f'engine run: 18 of 18 fields.json values equal what h5_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'engine conditions found in their own prompts: {INPUT_COUNT} inputs (numbers and names)')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in the capstone text: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
