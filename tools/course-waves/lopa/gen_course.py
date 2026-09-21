#!/usr/bin/env python3
"""Generate the H3 course + capstone migration from the ENGINE'S OWN RUN, so no
expected value and no condition is retyped.

Modelled on tools/course-waves/safetystats/gen_course.py (H1), with the
differences H3 forces:

1. THE ENGINE IS RUN HERE. `node h3_capstone.mjs --json` is executed through the
   vendored engines/hse/lopa.js (H3_ENGINES) and the one tolerance module
   (H3_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. gen_golive.py imports this module and
   takes its engine values from THIS run, which is the engine ledger the
   go-live checks the seeded rows against.

2. THE CONDITIONS ARE READ OUT OF THE SAME GENERATOR. `h3_capstone.mjs --inputs`
   prints the three frozen facilities the engine was run on (AKPO, USAN, YOHO),
   and every prompt below is RENDERED from them, one fragment per input. A self
   check then proves every number and every name the engine ran on is stated in
   its own tier's prompt, as a learner reads it, and every IPL's flag beside its
   name, so a prompt cannot drift from what was graded.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 32) IS ENFORCED ON EVERY
   PROMPT, TITLE AND LABEL: "beta factor" (or betaD) and never a bare beta;
   PFDavg or IPL PFD and never a bare PFD; never "severity"; "likelihood" only
   inside "tolerable mitigated event likelihood"; never "risk reduction ratio".
   The copy rule too: no em or en dash and no "X, not Y" contrastive. Every
   rule is planted once and must be caught.

4. TWO PRECISIONS. Frequencies and PFDavg values print to TWELVE decimals, risk
   reduction factors and hours to SIX (precision.json). Each prompt asks for
   exactly the decimals its fields are graded to, and each tolerance is at
   least half a unit in the last printed place.

FAILURE RATES ARE ILLUSTRATIVE. Every capstone that carries a failure rate says
so in its prompt.

THE TOLERANCES ARE READ, NEVER DECLARED. Every sweep below runs at the tolerance
fields.json ships.

Usage: python3 gen_course.py
   H3_WAVE        the wave directory (default /root/hse-wip-lopa)
   H3_REPO        the nextgen clone   (default /root/wt-h3-nextgen)
   H3_ENGINES     packages/engines to run the capstone through (default $H3_REPO/packages/engines)
   H3_TOLERANCE   gradedTolerance.js (default the one in $H3_REPO)
   H3_COURSE_OUT  where to write      (default $H3_REPO/migrations/...)
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('H3_WAVE', '/root/hse-wip-lopa')
REPO = os.environ.get('H3_REPO', '/root/wt-h3-nextgen')
ENGINES = os.environ.get('H3_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'H3_TOLERANCE', f'{REPO}/src/components/course/panels/lopa/gradedTolerance.js')
OUT = os.environ.get('H3_COURSE_OUT', f'{REPO}/migrations/20261005_h3_lopa_course.sql')

SLUG, MODULE, PATH_ORDER = 'lopa', 'hse', 63
NAME = 'Process Safety: LOPA & SIL Determination'
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
ENV = dict(os.environ, H3_ENGINES=ENGINES, H3_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/h3_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/h3_capstone.mjs'))
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

AK, US, YO = INPUTS['AKPO'], INPUTS['USAN'], INPUTS['YOHO']


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


def plist(items, noun):
    """Named probabilities: 'ignition' 0.42 and 'operator in the area' 0.18."""
    parts = [f"'{it['name']}' {n(it['probability'])}" for it in items]
    if not parts:
        return f'no {noun}'
    return ' and '.join(parts) if len(parts) < 3 else ', '.join(parts[:-1]) + ' and ' + parts[-1]


def ipl(it):
    flag = 'flagged independent' if it['independent'] is True else 'flagged not independent'
    return f"'{it['name']}', IPL PFD {n(it['pfd'])}, {flag}"


def lopa_row(label, what, s, extra=''):
    ecs = s['enablingConditions']
    return (f"{label}, {what}: initiating event frequency {n(s['initiatingEventFrequencyPerYr'])} per year; "
            f"{plist(ecs, 'enabling condition') if not ecs else ('enabling condition ' if len(ecs) == 1 else 'enabling conditions ') + plist(ecs, 'enabling condition')}; "
            f"{'conditional modifier' if len(s['conditionalModifiers']) == 1 else 'conditional modifiers'} "
            f"{plist(s['conditionalModifiers'], 'conditional modifier')}; "
            f"{'IPL' if len(s['ipls']) == 1 else 'IPLs'} {' and '.join(ipl(i) for i in s['ipls'])}; "
            f"TMEL {n(s['tmelPerYr'])} per year{extra}.")


def rates(p):
    if p.get('lambdaDdPerHour'):
        return f"lambdaDU {n(p['lambdaDuPerHour'])} and lambdaDD {n(p['lambdaDdPerHour'])} per hour"
    return f"lambdaDU {n(p['lambdaDuPerHour'])} per hour and no detected failures"


def times(p):
    if 'mttrHours' in p:
        return f"MTTR {n(p['mttrHours'])} hours and MRT {n(p['mrtHours'])} hours"
    return f"MRT {n(p['mrtHours'])} hours"


def betas(p):
    if 'betaD' in p:
        return f", beta factor {n(p['beta'])} and betaD {n(p['betaD'])}"
    if 'beta' in p:
        return f", beta factor {n(p['beta'])}"
    return ''


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where a tier
# grades two of the same unit, WHICH one.
# ---------------------------------------------------------------------------
LABELS = {
    'akpo_separator_unmitigated_frequency_per_yr':
        ("The separator row's unmitigated frequency", 'per year'),
    'akpo_separator_required_rrf':
        ("The separator row's required risk reduction factor", 'RRF'),
    'akpo_tank_mitigated_frequency_without_sif_per_yr':
        ("The tank row's mitigated frequency without a SIF", 'per year'),
    'akpo_tank_required_sif_pfdavg':
        ("The tank row's required PFDavg for its SIF", 'PFDavg'),
    'akpo_compressor_mitigated_frequency_with_sif_per_yr':
        ("The compressor row's mitigated frequency with its proposed SIF", 'per year'),
    'akpo_export_catalogue_sif_mitigated_frequency_per_yr':
        ("The export row's mitigated frequency with the catalogue design for the SIL it requires", 'per year'),
    'usan_transmitters_2oo3_pfdavg':
        ('The PFDavg of the 2oo3 transmitters', 'PFDavg'),
    'usan_logic_solver_1oo1_pfdavg':
        ('The PFDavg of the 1oo1 logic solver', 'PFDavg'),
    'usan_valves_1oo2_pfdavg':
        ('The PFDavg of the 1oo2 valves', 'PFDavg'),
    'usan_sif_rrf':
        ('The risk reduction factor of the SIF built from those three subsystems', 'RRF'),
    'usan_proposed_2oo2_transmitters_pfdavg':
        ('The PFDavg of the proposed 2oo2 transmitters', 'PFDavg'),
    'usan_mitigated_frequency_with_sif_per_yr':
        ("The LOPA row's mitigated frequency with the SIF", 'per year'),
    'yoho_valves_1oo2_max_interval_hours':
        ('The longest proof test interval of the 1oo2 valves that holds their budget', 'hours'),
    'yoho_valve_1oo1_ptc_pfdavg':
        ('The PFDavg of the single valve at its present proof test interval', 'PFDavg'),
    'yoho_valve_1oo1_ptc_max_interval_hours':
        ('The longest proof test interval of the single valve that holds its target', 'hours'),
    'yoho_transmitter_ptc_floor_pfdavg':
        ('The floor PFDavg of the single transmitter, below which no proof test interval brings it', 'PFDavg'),
    'yoho_sif_rrf_at_three_year_interval':
        ('The risk reduction factor of the function with every proof test interval stretched', 'RRF'),
    'yoho_transmitters_2oo3_max_interval_hours':
        ('The longest proof test interval of the 2oo3 transmitters that holds their budget', 'hours'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs, one fragment per input.
# gen_golive.py checks every fragment is in the shipped prompt with strpos.
# ---------------------------------------------------------------------------
cat = AK['export']['catalogue']
FRAG = {
    'beginner': [
        'AKPO, a gas plant, and four rows of its LOPA worksheet. Every frequency is per year, every '
        'probability and IPL PFD is a fraction, every row carries its TMEL, the tolerable mitigated event '
        'likelihood, as a frequency per year, and every IPL is credited only as its flags allow.',
        lopa_row('SEPARATOR', 'overpressure of the inlet separator', AK['separator']),
        lopa_row('TANK', 'overfill of the condensate tank', AK['tank']),
        lopa_row('COMPRESSOR', 'a compressor seal failure', AK['compressor'],
                 f"; and a proposed SIF with a PFDavg of {n(AK['compressor']['sifPfdAvg'])}"),
        lopa_row('EXPORT', 'overpressure of the export pump', AK['export']),
        f"The site SIF catalogue holds one standard design per SIL band: SIL 1 at a PFDavg of {n(cat['sil1'])}, "
        f"SIL 2 at {n(cat['sil2'])} and SIL 3 at {n(cat['sil3'])}.",
    ],
    'intermediate': [
        'USAN, a high pressure trip on a gas export line. The failure rates below are illustrative, chosen for '
        'this exercise. Rates are per hour per channel and times are in hours.',
        f"TRANSMITTERS: {US['transmitters']['architecture']}, {rates(US['transmitters'])}, proof tested every "
        f"{n(US['transmitters']['proofTestIntervalHours'])} hours, {times(US['transmitters'])}{betas(US['transmitters'])}.",
        f"LOGIC SOLVER: a {US['logicSolver']['architecture']} safety PLC, {rates(US['logicSolver'])}, proof tested every "
        f"{n(US['logicSolver']['proofTestIntervalHours'])} hours, {times(US['logicSolver'])}.",
        f"VALVES: two shutdown valves {US['valves']['architecture']}, {rates(US['valves'])}, proof tested every "
        f"{n(US['valves']['proofTestIntervalHours'])} hours, {times(US['valves'])}{betas(US['valves'])}.",
        f"PROPOSED: a {US['proposed2oo2']['architecture']} vote of the same transmitters, to cut spurious trips, on the "
        f"same data sheet: {rates(US['proposed2oo2'])}, proof tested every "
        f"{n(US['proposed2oo2']['proofTestIntervalHours'])} hours, {times(US['proposed2oo2'])}, carrying the "
        f"beta factor {n(US['proposed2oo2']['beta'])} and betaD {n(US['proposed2oo2']['betaD'])} of the 2oo3 set.",
        lopa_row('THE LOPA ROW the SIF answers', 'overpressure of the export line', US['lopaRow']).replace(
            '; TMEL ', '; TMEL, the tolerable mitigated event likelihood, '),
        'Use the IEC 61508-6 Annex B forms, with the mean repair time after a proof test (MRT) as stated.',
    ],
    'advanced': [
        'YOHO, proof testing on a crude oil stabiliser. The failure rates below are illustrative, chosen for '
        'this exercise. Rates are per hour per channel, times are in hours, and a year is 8760 hours.',
        f"VALVES: two shutdown valves {YO['valves']['architecture']}, {rates(YO['valves'])}, {times(YO['valves'])}"
        f"{betas(YO['valves'])}, proof tested every {n(YO['valves']['proofTestIntervalHours'])} hours today; "
        f"their allocated PFDavg budget is {n(YO['valveBudgetPfdAvg'])}.",
        f"SINGLE VALVE: a {YO['singleValve']['architecture']} valve, {rates(YO['singleValve'])}, "
        f"{times(YO['singleValve'])}, proof tested every {n(YO['singleValve']['proofTestIntervalHours'])} hours with a "
        f"proof test coverage of {n(YO['singleValve']['proofTestCoverage'])}; the failures the test misses are found "
        f"only at overhaul, a lifetime of {n(YO['singleValve']['lifetimeHours'])} hours. Its target PFDavg is "
        f"{n(YO['singleValveTargetPfdAvg'])}.",
        f"SINGLE TRANSMITTER: a {YO['transmitter']['architecture']} transmitter, {rates(YO['transmitter'])}, "
        f"{times(YO['transmitter'])}, proof tested every {n(YO['transmitter']['proofTestIntervalHours'])} hours with a "
        f"proof test coverage of {n(YO['transmitter']['proofTestCoverage'])} and a lifetime of "
        f"{n(YO['transmitter']['lifetimeHours'])} hours. Its target PFDavg is {n(YO['transmitterTargetPfdAvg'])}.",
        f"THE FUNCTION: {YO['transmitters2oo3']['architecture']} transmitters, {rates(YO['transmitters2oo3'])}, "
        f"{times(YO['transmitters2oo3'])}{betas(YO['transmitters2oo3'])}, allocated a PFDavg budget of "
        f"{n(YO['transmitterBudgetPfdAvg'])}; a {YO['logicSolver']['architecture']} logic solver, "
        f"{rates(YO['logicSolver'])}, {times(YO['logicSolver'])}; and the "
        f"{YO['valves']['architecture']} valves above. Each is proof tested every "
        f"{n(YO['transmitters2oo3']['proofTestIntervalHours'])} hours today, and it is proposed to stretch every "
        f"proof test interval in the function to {n(YO['stretchedIntervalHours'])} hours.",
    ],
}
for p in (YO['transmitters2oo3'], YO['logicSolver'], YO['valves']):
    if p['proofTestIntervalHours'] != YO['transmitters2oo3']['proofTestIntervalHours']:
        bad.append('the YOHO function does not share one proof test interval, and its prompt says it does')
for p in (US['transmitters'], US['logicSolver'], US['valves'], US['proposed2oo2']):
    if 'mttrHours' in p and p['mrtHours'] != p['mttrHours']:
        bad.append('a USAN subsystem with detected failures has MRT unequal to MTTR, which the capstone evidence forbids')

ASK = {
    'beginner': (
        ' Report six values: the separator row\'s unmitigated frequency per year; the separator row\'s required '
        'risk reduction factor; the tank row\'s mitigated frequency per year without a SIF; the tank row\'s '
        'required PFDavg for its SIF; the compressor row\'s mitigated frequency per year with its proposed SIF; '
        'and the export row\'s mitigated frequency per year with the catalogue design for the SIL that row '
        'requires. The frequencies and the PFDavg to twelve decimals, the risk reduction factor to six decimals.'),
    'intermediate': (
        ' Report six values: the PFDavg of the 2oo3 transmitters; the PFDavg of the 1oo1 logic solver; the '
        'PFDavg of the 1oo2 valves; the risk reduction factor of the SIF built from those three subsystems; the '
        'PFDavg of the proposed 2oo2 transmitters; and the LOPA row\'s mitigated frequency per year with the '
        'SIF. The PFDavg values and the frequency to twelve decimals, the risk reduction factor to six decimals.'),
    'advanced': (
        ' Report six values: the longest proof test interval of the 1oo2 valves that holds their budget, in '
        'hours; the PFDavg of the single valve at its present proof test interval; the longest proof test '
        'interval of the single valve that holds its target, in hours; the floor PFDavg of the single '
        'transmitter, below which no proof test interval brings it; the risk reduction factor of the function '
        'with every proof test interval stretched as proposed; and the longest proof test interval of the 2oo3 '
        'transmitters that holds their budget, in hours. The PFDavg values to twelve decimals, the hours and '
        'the risk reduction factor to six decimals.'),
}
PROMPTS = {t: ' '.join(FRAG[t]) + ASK[t] for t in TIERS}

TIER = {
    'beginner': ('associate', 'AKPO, a gas plant LOPA worksheet of four scenarios',
                 'How much risk reduction each row is missing', PROMPTS['beginner']),
    'intermediate': ('professional', 'USAN, a high pressure trip SIF on a gas export line',
                     'What the SIF achieves, subsystem by subsystem, and whether the row closes', PROMPTS['intermediate']),
    'advanced': ('expert', 'YOHO, proof testing on a crude oil stabiliser',
                 'How long each proof test may run, and where no interval helps', PROMPTS['advanced']),
}

HEADER = """-- ============================================================================
-- H3: Process Safety: LOPA & SIL Determination joins the catalogue, the THIRD
-- course of the HSE module.
--
-- Catalogue row (module 'hse'; path_order 63, directly above H2 hygiene at 62
-- and H1 safetystats at 61; prereq_slug NULL, the carried-over answer "no hard
-- prerequisite inside a module"; school left at its default, as every
-- Facilities, Economics, Assurance and HSE course leaves it, so the fees are
-- the published school-level rows) plus the three capstones and their eighteen
-- graded fields, generated by tools/course-waves/lopa/gen_course.py from the
-- ENGINE'S OWN RUN (h3_capstone.mjs through the vendored engines/hse/lopa.js),
-- which it refuses to write unless fields.json carries exactly that run's
-- values and the tolerance gradedTolerance.js derives. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/lopa, because the 78
-- lessons, the teaching lab (lopaLab.js) and its three explorer panels ship in
-- the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A layer of protection analysis finds how much
-- risk reduction a scenario still needs, and a safety instrumented function has
-- to supply it, so the course teaches how much is missing (Associate), what a
-- SIF achieves (Professional) and how long its proof test may run and what the
-- engine does not know (Expert), and grades each tier on its own question with
-- numbers the engine returns.
--
-- THE ENGINE. engines/hse/lopa.js, vendored sha-identical with
-- petrolord-engines 6703c00. Nothing is invented: every frequency, probability,
-- IPL PFD, failure rate and TMEL is an input. An IPL is credited once and only
-- when flagged independent; an exact decade belongs to the lower SIL; the
-- full IEC 61508-6 Annex B form; two out of two carries no beta factor term; a
-- SIF is the series sum of its subsystems; the longest interval has explicit
-- states.
--
-- WHAT IS GRADED. AKPO (Associate) grades frequencies, a required RRF, a
-- required PFDavg, the loop through a proposed SIF and the exact decade; USAN
-- (Professional) grades three subsystem PFDavg values, the SIF's RRF, a
-- proposed 2oo2 and the loop back to the TMEL; YOHO (Expert) grades three
-- longest intervals, a PFDavg under imperfect proof test coverage, a coverage
-- floor and a SIF stretched to a longer interval. Every value is a return
-- value of the engine, and every prompt is rendered from the inputs the engine
-- was run on. Failure rates are illustrative, and each prompt says so.
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
for tier, obj in (('beginner', AK), ('intermediate', US), ('advanced', YO)):
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
for tier, rows_ in (('beginner', AK.values()), ('intermediate', [US['lopaRow']])):
    for s in rows_:
        for i_ in s['ipls']:
            if ipl(i_) not in PROMPTS[tier]:
                bad.append(f'{tier}: the IPL {i_["name"]!r} is not stated with its flag')

# THE VOCABULARY (digest section 32) AND THE COPY RULE, over every prompt,
# dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    for m in re.finditer(r'\bbeta\b', text, re.I):
        if not re.match(r'beta factor', text[m.start():], re.I):
            out.append(f'{label} carries a bare "beta"')
    for m in re.finditer(r'\bPFD\b', text):
        if not text[max(0, m.start() - 4):m.start()] == 'IPL ':
            out.append(f'{label} carries a bare "PFD"')
    if re.search(r'\bseverity\b', text, re.I):
        out.append(f'{label} carries "severity"')
    for m in re.finditer(r'\blikelihood\b', text, re.I):
        if not text[max(0, m.start() - 26):m.start()].lower().endswith('tolerable mitigated event '):
            out.append(f'{label} carries "likelihood" outside the TMEL\'s name')
    if re.search(r'risk reduction ratio', text, re.I):
        out.append(f'{label} carries "risk reduction ratio"')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
# The guard must be able to fire: every rule is planted once and must be caught.
for plant, rule in (('a beta of 0.1', 'beta'), ('the PFD of the valve', 'PFD'),
                    ('the severity of it', 'severity'), ('a likelihood score', 'likelihood'),
                    ('the risk reduction ratio', 'RRF'), ('a band — pooled', 'dash'),
                    ('the required PFDavg, not the band', 'contrastive')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')
for clean in ('a beta factor of 0.1 and betaD 0.05', 'an IPL PFD of 0.1', 'the tolerable mitigated event likelihood'):
    if vocabulary('clean', clean):
        bad.append(f'the vocabulary sweep fires on clean text: {clean!r}')

for tier in TIERS:
    if not PROMPTS[tier].count('Report six values') == 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')
    if tier != 'beginner' and 'illustrative' not in PROMPTS[tier]:
        bad.append(f'{tier} prompt carries failure rates and does not say they are illustrative')

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
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
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
    print(f'engine run: 18 of 18 fields.json values equal what h3_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'engine conditions found in their own prompts: {INPUT_COUNT} inputs (numbers, names and flags)')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in the capstone text: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
