#!/usr/bin/env python3
"""Generate the QI course migration (catalogue row plus the three capstones and
their eighteen graded fields) from the ENGINE'S OWN RUN and the CASE FILES, so no expected value, no setting and no data point is
retyped. Adapted from SC4 marine's gen_course.py.

1. THE ENGINE IS RUN HERE. Every tier's capstone generator (qi_capstone.mjs,
   qi_capstone_e.mjs; the Professional fields are in qi_capstone.mjs) runs through the teaching lab and the
   vendored engines, and this file REFUSES unless fields.json carries exactly
   what that run returned for every DECLARED field: the same tier, key and value
   to the last bit, and the tolerance gradedTolerance.js derives.

2. ALL THREE CAPSTONES RIDE IN THE COURSE MIGRATION. A tier's capstone is
   written only when all six of its fields are declared in gradedTolerance.js
   (its engines passed the extraction gate), and the course migration refuses
   to be written until all three tiers are declared. The capstone card's
   handout list (src/content/capstone-cases/qi/index.js) is written beside it.

3. EVERY SETTING IS STATED. Each prompt states, from the case file, every
   choice its six values rest on, and a self check refuses a prompt that omits
   one. The data travel in the case file the prompt names (written by
   qi_cases*.mjs into src/content/capstone-cases/qi); the prompt never repeats
   the data.

4. THE COPY RULE AND THE VOCABULARY ON EVERY PROMPT, TITLE AND LABEL: no em or
   en dash, no "X, not Y" contrastive or its cousins, no repair history, no
   artificial intelligence claim (AI in this course is acoustic impedance).

5. NO NUMBER HANDED TO A LEARNER sits within its tolerance of any graded value
   of any tier, and no graded value sits within its tolerance of a digest number.

Usage:
   python3 gen_course.py                 self checks only; writes nothing
   python3 gen_course.py --migration     write the course migration and the case-file index
   QI_WAVE, QI_REPO, QI_TOLERANCE, QI_COURSE_OUT (directory for the migrations)
Importing this module runs the engine and the self checks and writes nothing.
"""
import datetime
import json
import os
import re
import subprocess
import sys

W = os.environ.get('QI_WAVE', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('QI_REPO', '/root/wt-qi-nextgen')
TOLPATH = os.environ.get('QI_TOLERANCE', f'{REPO}/src/components/course/panels/qi/gradedTolerance.js')
OUTDIR = os.environ.get('QI_COURSE_OUT', f'{REPO}/migrations')
CASES = os.environ.get('QI_CASES', f'{REPO}/src/content/capstone-cases/qi')
CASES_OUT = os.environ.get('QI_CASES_OUT', CASES)

SLUG, MODULE, PATH_ORDER, PREREQ, COURSE_TYPE = 'qi', 'geoscience', 80, 'welldata', 'app'
NAME = 'Quantitative Interpretation'
TIERS = ('beginner', 'intermediate', 'advanced')
CERT = {'beginner': 'associate', 'intermediate': 'professional', 'advanced': 'expert'}
GENERATOR = {'beginner': 'qi_capstone.mjs', 'intermediate': 'qi_capstone.mjs', 'advanced': 'qi_capstone_e.mjs'}
CASE_NAME = {'beginner': 'tamberlo_case.json', 'intermediate': 'quarvin_case.json', 'advanced': 'delsholm_case.json'}

bad = []
names = json.load(open(f'{W}/ship_names.json'))
fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
for what, got, want in (('slug', wave.get('slug'), SLUG), ('module', wave.get('module'), MODULE),
                        ('pathOrder', wave.get('pathOrder'), PATH_ORDER), ('name', wave.get('name'), NAME),
                        ('prerequisite', wave.get('prerequisite'), PREREQ), ('courseType', wave.get('courseType'), COURSE_TYPE)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


ENV = dict(os.environ, QI_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args):
    r = subprocess.run(['node', *args], capture_output=True, text=True, env=ENV, cwd=W)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {(r.stdout + r.stderr).strip()[-400:]}')
    return r.stdout


TOLS = json.loads(node('--input-type=module', '-e',
                       'const M = await import(%s); console.log(JSON.stringify(Object.fromEntries('
                       'M.GRADED_FIELDS.map(([t, k]) => [k, [t, M.gradedTolerance(k)]]))));' % json.dumps(TOLPATH)))
DECLARED = [k for k in TOLS]
# The tiers whose six fields are all declared.
PRESENT = [t for t in TIERS if sum(1 for k in DECLARED if TOLS[k][0] == t) == 6]
PARTIAL = [t for t in TIERS if 0 < sum(1 for k in DECLARED if TOLS[k][0] == t) < 6]
if PARTIAL:
    bad.append(f'gradedTolerance.js declares some but not all six fields of {PARTIAL}')
if PRESENT != list(TIERS):
    bad.append(f'the course migration carries all three capstones, and gradedTolerance.js declares only {PRESENT}')

ENGINE = {}
for t in PRESENT:
    for r in json.loads(node(f'{W}/{GENERATOR[t]}', '--json')):
        ENGINE[r['key']] = r
if [f[1] for f in fields] != DECLARED:
    bad.append(f'fields.json carries {[f[1] for f in fields]} and gradedTolerance.js declares {DECLARED}')
for t, k, v, tol in fields:
    r = ENGINE.get(k)
    if r is None or r['tier'] != t:
        bad.append(f'{t}/{k}: the engine run returned no such field for that tier')
    elif v != r['value'] or type(v) is not float:
        bad.append(f'{t}/{k}: fields.json says {v!r} and the engine returned {r["value"]!r}')
    if tol != TOLS[k][1]:
        bad.append(f'{t}/{k}: fields.json grades at {tol!r} and gradedTolerance.js derives {TOLS[k][1]!r}')
KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}

CASE = {t: json.load(open(f'{CASES}/{CASE_NAME[t]}')) for t in TIERS if os.path.exists(f'{CASES}/{CASE_NAME[t]}')}
for t in PRESENT:
    if t not in CASE:
        bad.append(f'{t}: the case file {CASE_NAME[t]} is not in {CASES}')
INDEX_JS = ("// The QI capstone case files: held-out synthetic cases, never the Ekene field,\n"
            "// written by the wave's qi_cases*.mjs; this index is generated by\n"
            "// tools/course-waves/qi/gen_course.py. Only the capstone card imports this\n"
            "// module: no panel preloads a case, and the graded answers are not stored\n"
            "// anywhere in the app.\n")
for t in PRESENT:
    INDEX_JS += f"import {CASE_NAME[t][:-5]} from './{CASE_NAME[t]}?raw';\n"
INDEX_JS += '\nexport const QI_CASE_FILES = {\n'
for t in TIERS:
    if t in PRESENT:
        INDEX_JS += f"  {t}: [\n    {{ name: '{CASE_NAME[t]}', text: {CASE_NAME[t][:-5]} }},\n  ],\n"
    else:
        INDEX_JS += f'  {t}: [],\n'
INDEX_JS += '};\n'


def n(x):
    """A number as a prompt writes it: the shortest decimal that reads back to itself."""
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    if 'e' in s or float(s) != x:
        sys.exit(f'REFUSED: {x!r} does not print as a plain decimal that reads back to itself')
    return s


# ---------------------------------------------------------------------------
# The labels of every field this course grades or will grade.
# ---------------------------------------------------------------------------
LABELS = {
    'tamberlo_low6_hz': ("The -6 dB low edge of the case traces' mean spectrum", 'Hz'),
    'tamberlo_centroid_hz': ("The centroid of the case traces' mean spectrum", 'Hz'),
    'tamberlo_shear_slope': ('The slope of the local shear trend on the water-leg net sand', 'm/s of Vs per km/s of Vp'),
    'tamberlo_ai_brine': ('The acoustic impedance of the stated sample after substitution to brine', 'kg/(m2 s)'),
    'tamberlo_vpvs_brine': ('The Vp/Vs of the stated sample after substitution to brine', 'ratio'),
    'tamberlo_wet_distance': ('The signed distance of the top interface from the fitted wet trend', 'distance on the intercept-gradient plane'),
    'quarvin_dix_vint': ('The Dix interval velocity of the stated layer', 'm/s'),
    'quarvin_walden_deg': ("Walden's angle at the stated offset and time", 'degrees'),
    'quarvin_nmo_stretch': ('The NMO stretch at the stated offset and time', 'fraction'),
    'quarvin_far_stack_amp': ('The far partial-stack amplitude at the target sample', 'trace amplitude'),
    'quarvin_shuey_a': ('The Shuey intercept at the target sample', 'trace amplitude'),
    'quarvin_one_scale': ('The one scale from modelled to seismic amplitude over the four wells', 'trace amplitude per unit reflection coefficient'),
    'delsholm_lfm_lnai_b': ('The low-frequency model ln(AI) at the stated sample of position B', 'ln of kg/(m2 s)'),
    'delsholm_mb_ai': ('The model-based acoustic impedance at the stated sample of trace A', 'kg/(m2 s)'),
    'delsholm_sim_vpvs': ('The simultaneous-inversion Vp/Vs at the stated sample of trace A', 'ratio'),
    'delsholm_phi_q90': ('The upper bound of the porosity interval at the stated impedance', 'fraction'),
    'delsholm_p_oil': ('The posterior probability of the oil-sand facies at the stated impedance', 'probability'),
    'delsholm_column_ft': ('The closure column height of the mapped trap', 'ft'),
}
for k in KEYS:
    if k not in LABELS:
        bad.append(f'{k} has no label in gen_course.py')

# ---------------------------------------------------------------------------
# The prompts, rendered from the case files' own stated choices.
# ---------------------------------------------------------------------------
FREE = ("Every input a value needs is in the case file or stated here, and no value is a random draw; "
        "the engines hold no default for any choice named above.")


def prompt_beginner(c):
    st, co, wl, tr = c['stated'], c['conditions'], c['well'], c['traces']
    md = [r[0] for r in wl['rows']]
    return (f"{c['case']}, a held-out synthetic feasibility case (synthetic, written for this capstone; it is not the Ekene field). "
            f"One case file comes with this capstone: {CASE_NAME['beginner']}; paste it into the feasibility explorer (Data: paste a case file) "
            f"and read each value in the view that computes it. The case carries {n(tr['count'])} seismic traces of {n(tr['samples'])} samples "
            f"every {n(tr['dt_ms'])} ms, and one well, {wl['name']}, logged every half foot from {n(md[0])} to {n(md[-1])} ft: the top of the "
            f"reservoir at {n(wl['topFt'])} ft, its base at {n(wl['baseFt'])} ft and the oil-water contact at {n(wl['owcFt'])} ft. "
            f"The stated choices: the mean spectrum of all {n(tr['count'])} traces over their whole length with a Tukey taper of {n(st['taper'])}; "
            f"net sand is Vsh at or below {n(st['netSandVshCut'])}; the local shear trend is the {st['shearForm']} least squares fit of Vs on Vp "
            f"over the water-leg net sand; the conditions are {n(co['tF'])} degF, {n(co['pPsia'])} psia, a brine salinity of {n(co['salinity'])} "
            f"(weight fraction of NaCl), oil of {n(co['api'])} API, a gas-oil ratio of {n(co['gorScfStb'])} scf/stb and a gas gravity of {n(co['gasSg'])}; "
            f"the mineral is {st['minerals']} and the pore fluid {st['poreFluid']}; the substituted sample is the one at {n(st['substitutionSampleFt'])} ft, "
            f"taken to brine (Sw 1) by Gassmann; the cap rock is the {n(st['shaleAboveFt'])} ft of log above the top of the reservoir, read as one "
            f"layer by its means, and the top interface is the cap rock over the mean of the oil-leg net sand; the wet trend takes every sample with "
            f"Sw below 1 to brine, blocks the log every {n(st['trendBlockFt'])} ft and fits the fluid line through the origin by total least squares; "
            f"the distance is signed, negative on the hydrocarbon side, and read from that fitted line. {FREE} "
            "Report six values: the -6 dB low edge of the mean spectrum, in Hz; the centroid of the mean spectrum, in Hz; the slope of the local "
            "shear trend, in m/s of Vs per km/s of Vp; the acoustic impedance of the stated sample after substitution, in kg/(m2 s); its Vp/Vs "
            "after substitution; and the distance of the top interface from the fitted wet trend. All six to six decimals.")


def prompt_intermediate(c):
    st, g = c['stated'], c['gather']
    return (f"{c['case']}, a held-out synthetic prestack case (synthetic, written for this capstone; it is not the Ekene field). "
            f"One case file comes with this capstone: {CASE_NAME['intermediate']}; paste it into the prestack explorer (Data: paste a case file). "
            f"It carries an RMS velocity table, one NMO-corrected CDP gather of {n(len(g['offsets_m']))} offsets every {n(g['dt_ms'])} ms from "
            f"{n(g['t0_ms'])} ms, and the modelled and seismic intercepts and gradients at {n(len(c['wells']))} wells. The stated choices: the Dix "
            f"layer runs from {n(st['dixLayer']['fromMs'])} to {n(st['dixLayer']['toMs'])} ms; Walden's angle and the NMO stretch are read at an "
            f"offset of {n(st['offsetM'])} m and a time of {n(st['timeMs'])} ms with {st['nmoVelocity']}; the angle bins have the edges "
            f"{', '.join(n(x) for x in st['angleEdges'])} degrees and the far partial stack is bins {', '.join(n(x) for x in st['farBins'])}; "
            f"the Shuey fit takes {n(st['shueyTerms'])} terms over the partial stacks at {', '.join(n(x) for x in st['stackAngles'])} degrees at "
            f"the target sample, {n(st['targetMs'])} ms; the one scale is the {st['oneScale']}. {FREE} "
            "Report six values: the Dix interval velocity of the stated layer, in m/s; Walden's angle, in degrees; the NMO stretch, as a "
            "fraction; the far partial-stack amplitude at the target sample; the Shuey intercept at the target sample; and the one scale over "
            "the wells. All six to six decimals.")


def prompt_advanced(c):
    st = c['stated']
    return (f"{c['case']}, a held-out synthetic inversion and prospect case (synthetic, written for this capstone; it is not the Ekene field). "
            f"One case file comes with this capstone: {CASE_NAME['advanced']}; paste it into the inversion explorer for the first three values and "
            f"into the prospect explorer for the last three (in each, Data: paste a case file). It carries {n(len(c['wells']))} wells with their low-passed impedance logs in time "
            f"and horizon times, a target trace A with its full and angle stacks, wavelets and low-frequency models, a position B, calibration "
            f"samples and a depth grid. The stated choices: the low-frequency model at position B uses inverse distance weighting of power "
            f"{n(st['lfm']['power'])} and is read at sample {n(st['lfm']['sampleB'])}; the model-based inversion of trace A uses eps "
            f"{n(st['modelBased']['eps'])} and {n(st['modelBased']['iters'])} iterations and is read at sample {n(st['modelBased']['sampleA'])}; "
            f"the simultaneous inversion uses eps {', '.join(n(x) for x in st['simultaneous']['eps'])} and {n(st['simultaneous']['iters'])} "
            f"iterations and is read at sample {n(st['simultaneous']['sampleA'])}; the porosity transform's interval is at the "
            f"{n(st['porosity']['level'])} level at an impedance of {n(st['porosity']['atAi'])} kg/(m2 s); the facies model is {st['facies']['kind']} "
            f"with {st['facies']['priors']} as priors, read for {st['facies']['class']} at {n(st['facies']['atAi'])} kg/(m2 s); the closure is read "
            f"from {st['closure']['crest']} to {st['closure']['contact']}. {FREE} "
            "Report six values: the low-frequency model ln(AI) at position B; the model-based acoustic impedance at trace A, in kg/(m2 s); the "
            "simultaneous-inversion Vp/Vs at trace A; the upper bound of the porosity interval; the posterior probability of the oil-sand "
            "facies; and the closure column height, in ft. All six to six decimals.")


BUILD = {'beginner': prompt_beginner, 'intermediate': prompt_intermediate, 'advanced': prompt_advanced}
TITLE = {'beginner': 'Feasibility: can this seismic see this fluid',
         'intermediate': 'From the tie to AVO on the seismic',
         'advanced': 'Inversion, properties and the decision'}
TIER = {}
for t in PRESENT:
    if t in CASE:
        c = CASE[t]
        TIER[t] = (CERT[t], f"{c['case']}, a held-out synthetic case (synthetic)", TITLE[t], BUILD[t](c))

# --------------------------------------------------------------- self checks
NUMRE = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w.]*\d)')


def stated_numbers(t, c):
    if t == 'beginner':
        st, co, wl, tr = c['stated'], c['conditions'], c['well'], c['traces']
        return [tr['count'], tr['samples'], tr['dt_ms'], wl['topFt'], wl['baseFt'], wl['owcFt'], st['taper'], st['netSandVshCut'],
                co['tF'], co['pPsia'], co['salinity'], co['api'], co['gorScfStb'], co['gasSg'], st['substitutionSampleFt'],
                st['shaleAboveFt'], st['trendBlockFt']]
    if t == 'intermediate':
        st = c['stated']
        return [st['dixLayer']['fromMs'], st['dixLayer']['toMs'], st['offsetM'], st['timeMs'], *st['angleEdges'], *st['farBins'],
                st['shueyTerms'], *st['stackAngles'], st['targetMs']]
    st = c['stated']
    return [st['lfm']['power'], st['lfm']['sampleB'], st['modelBased']['eps'], st['modelBased']['iters'], st['modelBased']['sampleA'],
            *st['simultaneous']['eps'], st['simultaneous']['iters'], st['porosity']['level'], st['porosity']['atAi'], st['facies']['atAi']]


for t, (_c, dataset, title, prompt) in TIER.items():
    nums = set(re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', prompt))
    for v in stated_numbers(t, CASE[t]):
        if n(v) not in nums:
            bad.append(f'{t} prompt does not state {n(v)}, which the case file states')
    if prompt.count(CASE_NAME[t]) != 1:
        bad.append(f'{t} prompt does not name its case file exactly once')
    if prompt.count('Report six values') != 1 or 'All six to six decimals' not in prompt or FREE not in prompt:
        bad.append(f'{t} prompt does not carry the report sentence, the precision sentence and the stated-inputs sentence exactly')


def vocabulary(label, text):
    out = []
    if re.search(r'artificial intelligence|AI-powered', text, re.I):
        out.append(f'{label} carries an artificial intelligence claim')
    if re.search(r'\bused to\b|\bno longer\b|pre-audit|legacy', text, re.I):
        out.append(f'{label} frames repair history')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b', text, re.I):
        out.append(f'{label} carries a contrastive')
    return out


READ = [(f'{t} prompt', v[3]) for t, v in TIER.items()] + [(f'{t} dataset', v[1]) for t, v in TIER.items()] + \
       [(f'{t} title', v[2]) for t, v in TIER.items()] + [(f'{k} label', ' '.join(LABELS[k])) for k in KEYS]
for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered study', 'claim'), ('the engine used to round', 'history'), ('a case — new', 'dash'),
                    ('the fitted line, not the published one', 'contrastive'), ('the oil leg rather than the water leg', 'rather than')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')

# Numbers handed to a learner (prompt, dataset, title, labels, case files)
# against every graded value of every PRESENT tier at its tolerance.
NUM = re.compile(r'-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')
handed = [(t, abs(float(tok))) for t, v in TIER.items() for tok in NUM.findall(v[3] + ' ' + v[1] + ' ' + v[2])]
handed += [(TIER_OF[k], abs(float(tok))) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]))]
handed_case = [(t, abs(float(tok))) for t in TIER for tok in NUM.findall(json.dumps(CASE[t]))]
for ftier, key, val, tol in fields:
    for htier, h in handed + handed_case:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} is within its tolerance of a number handed in the {htier} capstone text or case file')
for a in range(len(fields)):
    for b in range(a + 1, len(fields)):
        if abs(abs(fields[a][2]) - abs(fields[b][2])) <= max(fields[a][3], fields[b][3]):
            bad.append(f'pairwise: {fields[a][1]} and {fields[b][1]}')
DIGEST_NUMS = sorted({abs(float(tok)) for tok in NUM.findall(re.sub(r'(\d),(?=\d{3}(?!\d))', r'\1', open(f'{W}/digest.txt', encoding='utf-8').read()))})
if len(DIGEST_NUMS) < 1000:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} is within its tolerance of a number the digest prints')
for t in TIER:
    for _ft, key, _val, tol in [f for f in fields if f[0] == t]:
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes')
        elif precision[cls[0]]['decimals'] != 6 or tol < 5e-7 * (1 - 1e-12):
            bad.append(f'{key}: the prompt asks for six decimals and the field is graded at {tol} with {precision[cls[0]]["decimals"]} printed')


def capstone_rows(tiers):
    blocks = []
    for t in tiers:
        cert, dataset, title, prompt = TIER[t]
        fl = [f for f in fields if f[0] == t]
        if len(fl) != 6:
            bad.append(f'{t} has {len(fl)} fields')
        objs = ',\n'.join(
            f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[k][0])},"
            f" 'unit',{q(LABELS[k][1])}, 'expected',{repr(v)}, 'tol',{repr(tol)})"
            for _t, k, v, tol in fl)
        blocks.append(f"(\n  {q(SLUG)}, {q(t)}, {q(cert)},\n  {q(dataset)},\n"
                      f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
    return ['insert into public.academy_capstones', '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)', 'values',
            ',\n'.join(blocks), 'on conflict (app_slug, tier) do nothing;']


HEADER = f"""-- ============================================================================
-- QI: Quantitative Interpretation joins the catalogue in the Geoscience module.
-- AN APP COURSE: the Suite app is QI Studio (tile qi-studio), with Rock Physics
-- Studio beside it, which run the same engines; the practicals also run in the
-- course's own four explorer panels.
--
-- Catalogue row (module '{MODULE}'; path_order {PATH_ORDER}; prereq_slug
-- '{PREREQ}', owner decision D1 of 2026-10-11; course_type '{COURSE_TYPE}';
-- suite_module left NULL, because the academy key and the Suite module slug
-- agree for geoscience; school left at its default) plus the three capstones
-- and their eighteen graded fields, generated by
-- tools/course-waves/qi/gen_course.py from the ENGINES' OWN RUN
-- (qi_capstone.mjs, qi_capstone_p.mjs and qi_capstone_e.mjs through the
-- teaching lab and the vendored engines), which it refuses to write unless
-- fields.json carries exactly that run's values and the tolerance
-- gradedTolerance.js derives.
--
-- WHAT IS GRADED. Every capstone is a held-out synthetic case (owner decision
-- D2: the members-only videos speak the Ekene answers, so no capstone is set on
-- Ekene), handed to the learner as a case file.
--   TAMBERLO (Associate): the -6 dB low edge and the centroid of the mean
--   spectrum, the local shear slope, the acoustic impedance and Vp/Vs of a
--   stated sample after substitution to brine, and the signed distance of the
--   top interface from the fitted wet trend.
--   QUARVIN (Professional): a Dix interval velocity, Walden's angle, the NMO
--   stretch, the far partial-stack amplitude, the Shuey intercept and the one
--   scale from modelled to seismic amplitude over four wells.
--   DELSHOLM (Expert): a low-frequency model ln(AI), a model-based impedance, a
--   simultaneous-inversion Vp/Vs, the upper bound of a porosity interval, an
--   oil-sand posterior and a closure column height.
--
-- Deep seeds are three separate migrations; the go-live is HELD until a
-- NextGen production upload serves the route /dashboard/apps/qi.
-- NO BEGIN OR COMMIT: apply_qi.sh wraps this file in one transaction.
-- ============================================================================"""


def course_sql():
    lines = [HEADER, '',
             'insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug, course_type)',
             f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', {q(PREREQ)}, {q(COURSE_TYPE)})",
             'on conflict (slug) do nothing;', '']
    lines += capstone_rows(list(TIER))
    return '\n'.join(lines) + '\n'


SQL = {}
if PRESENT == list(TIERS) and all(t in TIER for t in TIERS):
    SQL['course'] = course_sql()
for k, sql in SQL.items():
    odd = [ln for ln, l in enumerate(sql.splitlines(), 1)
           if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
    if odd:
        bad.append(f'{k}: odd-quote code lines {odd[:5]}')
    if re.search(r'(?im)^\s*(begin|commit|rollback)\s*;', sql):
        bad.append(f'{k}: a transaction line of its own')

PROMPTS = {t: v[3] for t, v in TIER.items()}

if __name__ == '__main__':
    if bad:
        for b in bad:
            print('  REFUSED:', b)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    wrote = []
    if '--migration' in sys.argv:
        os.makedirs(OUTDIR, exist_ok=True)
        for k, sql in SQL.items():
            p = f'{OUTDIR}/{names[k]}.sql'
            open(p, 'w').write(sql)
            wrote.append(f'{p}: {len(sql.splitlines())} lines')
        os.makedirs(CASES_OUT, exist_ok=True)
        open(f'{CASES_OUT}/index.js', 'w').write(INDEX_JS)
        wrote.append(f'{CASES_OUT}/index.js: {len(PRESENT)} case files listed')
    for x in wrote:
        print(f'wrote {x}')
    print(f'gen_course: three capstones {PRESENT}; {len(fields)} fields equal the engine run and gradedTolerance.js; '
          f'prompt lengths {({t: len(p) for t, p in PROMPTS.items()})}; digest numbers swept {len(DIGEST_NUMS)}; '
          f'numbers handed {len(handed) + len(handed_case)}; collisions, settings, vocabulary and copy rule: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
