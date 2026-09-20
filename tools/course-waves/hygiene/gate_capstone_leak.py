#!/usr/bin/env python3
"""GATE: nothing the H2 capstone grades, and no condition it is set on, reaches
the digest, the digest generator, the teaching records, the teaching lab, or the
banks. Adapted from FC9's gate_capstone_leak.py.

DIRECTIONS, all checked and all counted:

  1. every DISTINCTIVE CONDITION in the three frozen scenarios of
     h2_capstone.mjs (a stated level, duration, concentration, NRR, readout or
     rate) must be absent, as a whole numeric token, from digest.txt, h2_dump.mjs
     and h2_fields.mjs, unless it is declared in SHARED with the reason it is a
     universal number rather than a condition of a site;
  1b. every capstone INPUT RECORD (a level and a duration together, a
     concentration and a duration together) must be absent as a PAIR from the
     digest's table rows, whatever SHARED says about either half;
  2. every GRADED VALUE must be absent from digest.txt at FOUR renderings: the
     full double, twelve significant digits, nine, and the decimals the course
     prints that class at;
  3. NEITHER FILE READS THE OTHER: h2_dump.mjs and h2_fields.mjs must not name
     h2_capstone.mjs, fields.json or a capstone site, and h2_capstone.mjs must not
     name h2_dump.mjs, h2_fields.mjs or digest.txt;
  4. NO CAPSTONE SITE NAME appears in the digest, the dump, the teaching records
     or the teaching lab;
  7. THE BANKS: every distinctive condition, every graded value at four
     renderings and every site name against every prompt, option and
     explanation under --banks. At the foundation phase there are no banks, and
     the run must SAY so with --no-banks rather than print a zero.

  8. THE LESSONS. Every .md file under --lessons (default
     <NextGen>/src/content/courses/hygiene, recursive), front matter included,
     read with thousands commas removed (so 6,690.8 is read as 6690.8): no
     capstone site name; no capstone INPUT RECORD (both values of one record on
     one line); no capstone count SERIES (the five weekly LEX values, joined);
     no DISTINCTIVE capstone CONDITION as a whole numeric token, plain or at the
     six decimals the course prints (SHARED conditions are excused with the
     reason written beside them, and the run says how many it excused); no
     graded value at the four renderings; and no numeric literal within TEN
     tolerances of a graded value at any unit scale wave.json leakScales names
     (x1, x1e3, x1e-3, x1e2, x1e-2, x60, x1/60). A missing lessons directory, or
     one with no .md file, is a REFUSAL unless the run declares --no-lessons.
     LESSON_TASK.md has always said this gate covers the lessons; until
     direction 8 it read none of them (H1 found the same hole: its direction 10).
     A FINDING NEVER PRINTS THE VALUE IT FOUND, only the field key, the file
     and the rendering or scale: finalise.py pins this gate's output into
     wave.json, and a finding that quoted the answer would put it back there.
  9. THE BRIEFS AND wave.json. wave.json and every writer brief (BRIEF.md,
     LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md, PANELS.md): no graded value
     at the four renderings, no numeric literal within TEN tolerances of a graded
     value at the leakScales, and not the capstone's T6 weekly-factor margin
     (read from h2_capstone.mjs --evidence) at its renderings. wave.json once
     printed two Expert graded answers inside a negative-control result string
     and the margin under decisions; a brief is read by every writer, so a
     graded value there is a leak into every tier at once.

Two CONTROLS run every time: a graded value planted into a copy of the digest,
and a condition planted into a copy of the digest, must both be caught.

    python3 gate_capstone_leak.py [--banks DIR] [--no-banks] [--lessons DIR] [--no-lessons]
    python3 gate_capstone_leak.py --no-banks --plant-lesson
        THE LESSONS CONTROL: appends, in memory, to the first lesson file read,
        a literal three tolerances off a graded value (a near miss, so no
        rendering matches and only the numeric comparison can catch it); must
        exit 1 with a [8 lessons numeric] finding naming that file.
    python3 gate_capstone_leak.py --no-banks --plant-brief
        THE BRIEFS CONTROL: appends, in memory, to wave.json the six-decimal
        rendering of an Expert graded value, the exact shape of the defect this
        direction was built for; must exit 1 with a [9 briefs] finding naming
        wave.json.

Exit 0 clean, 1 on a leak, 2 if it cannot do its job.
"""
import io, json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = sys.argv[1:]
BANKS = os.path.join(HERE, 'banks')
SWEEP_BANKS = True
if '--banks' in ARGS:
    BANKS = ARGS[ARGS.index('--banks') + 1]
if '--no-banks' in ARGS:
    SWEEP_BANKS = False
NG = os.environ.get('H2_NEXTGEN', '/root/wt-h2-nextgen')
LESSONS = os.path.join(NG, 'src/content/courses/hygiene')
SWEEP_LESSONS = '--no-lessons' not in ARGS
if '--lessons' in ARGS:
    LESSONS = ARGS[ARGS.index('--lessons') + 1]
PLANT_LESSON = '--plant-lesson' in ARGS
PLANT_BRIEF = '--plant-brief' in ARGS
# THIS GATE USED TO PRINT THE CAPSTONE CONDITION VALUES IT FOUND, and the whole
# point of the gate is that nobody outside h2_capstone.mjs may read them. The
# "table-only coincidences" line printed "<site>.<condition> = <value>" for each
# one, so a green run wrote a site name and a stated condition into a terminal,
# a CI log and every transcript that quoted it: the gate leaked exactly what it
# exists to stop. The line now names the CONDITION KEYS only, with no site and
# no value, which is all a reader needs to know what coincided. --show-
# coincidences restores the detail for someone debugging the gate on purpose,
# and it is never used by finalise.py.
SHOW_COINCIDENCES = '--show-coincidences' in ARGS
VALUE_FLAGS = ('--banks', '--lessons')
for i, a in enumerate(ARGS):
    if i > 0 and ARGS[i - 1] in VALUE_FLAGS:
        continue
    if a.startswith('--') and a not in ('--banks', '--no-banks', '--lessons', '--no-lessons', '--plant-lesson', '--plant-brief', '--show-coincidences'):
        print(f'  GATE REFUSES: unknown option {a}')
        sys.exit(2)
LAB = os.environ.get('H2_LAB', '/root/wt-h2-nextgen/src/components/course/panels/hygiene/hygieneLab.js')


def need(p, what):
    if not os.path.exists(p):
        print(f'  GATE REFUSES: no {what} at {p}')
        sys.exit(2)
    return io.open(p, encoding='utf-8').read()


DIGEST = need(os.path.join(HERE, 'digest.txt'), 'digest')
DUMP = need(os.path.join(HERE, 'h2_dump.mjs'), 'digest generator')
REC = need(os.path.join(HERE, 'h2_fields.mjs'), 'teaching records')
CAP = need(os.path.join(HERE, 'h2_capstone.mjs'), 'capstone generator')
FIELDS = json.loads(need(os.path.join(HERE, 'fields.json'), 'answer key'))
PRECISION = json.loads(need(os.path.join(HERE, 'precision.json'), 'precision declaration'))
LABSRC = need(LAB, 'teaching lab')
if len(FIELDS) != 18:
    print(f'  GATE REFUSES: fields.json carries {len(FIELDS)} fields')
    sys.exit(2)

SITES = ['UTOROGU', 'AMUKPE', 'OSIOKA']
SITE_WORDS = re.compile(r'\b(utorogu|amukpe|osioka)\w*', re.I)
COINCIDENCES = []

# Numbers a capstone states that are universal rather than a condition of a site.
SHARED = {
    '100': 'a public OSHA limit (xylene) typed as an input, and the round limit every reduction-factor table uses',
    '200': 'a public OSHA limit (toluene) typed as an input',
    '300': 'a public OSHA limit (cyclohexane) typed as an input',
    '500': 'a public OSHA limit (n-hexane) typed as an input',
    '15': 'a duration in minutes of one period; also the STEL window, a universal',
    '22': 'a duration in minutes of one heat period; the digest carries it only as a concentration in an unrelated sample',
    '23': 'a duration in minutes of one heat period; the digest carries it only inside a longer number or a count',
    '29': 'the NRR on the label of one earmuff; NRR labels are round whole numbers and the digest sweeps NRR 25 to 33',
    '6': 'a duration in minutes of one STEL period; a small count everywhere',
    '0.8': 'a duration in hours of one benzene sample; the digest carries it as the duration of an unrelated OBEN period',
    '0.35': 'a duration in hours of one task; also the ESTA and golden records carry short durations of this kind',
    '0.7': 'a duration in hours of one task; also a WBGT weight printed in section 3',
    '1.6': 'a duration in hours of one period, carried by no digest record as a level-duration pair',
    '2.1': 'a duration in hours of one period; the OLOMORO record carries a 2.1 hour period at a different level',
    '1.65': 'a duration in hours of one period, carried by no digest record as a level-duration pair',
    '1.8': 'a duration in hours of one task; the EVWRENI record carries a 1.8 hour task at a different level',
    '3.4': 'a duration in hours of one period, carried by no digest record as a level-duration pair',
    '2.4': 'a duration in hours of one benzene sample, carried by no digest record as a pair',
    '3.3': 'a duration in hours of one period, carried by no digest record as a pair',
    '2.2': 'a duration in hours of one period; the EVWRENI record carries a 2.2 hour task at a different level',
    '45': 'the hours a week of the Expert roster, spelled in words in the prompt, and a duration in minutes in the digest refusal examples',
    '0.55': 'a duration in hours of one period, carried by no digest record as a pair',
    '1.3': 'a duration in hours of one period, carried by no digest record as a pair',
    '2.35': 'a duration in hours of one period, carried by no digest record as a pair',
    '3.15': 'a duration in hours of one benzene sample, carried by no digest record as a pair',
    '3.9': 'a duration in hours of one task, carried by no digest record as a pair',
    '2.45': 'a duration in hours of one task, carried by no digest record as a pair',
    '5.5': 'a duration in minutes of one STEL period, carried by no digest record as a pair',
}

NUMTOK = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])(?!\.\d)')


def tokens(text):
    out = set()
    for m in NUMTOK.finditer(text):
        s = m.group(0)
        out.add(s)
        try:
            v = float(s)
            out.add(repr(v).rstrip('0').rstrip('.') if '.' in repr(v) else repr(v))
            out.add(('%.6f' % v))
        except ValueError:
            pass
    return out


def scenario(name):
    m = re.search(r'const ' + name + r' = Object\.freeze\(\{(.*?)\n\}\);', CAP, re.S)
    if not m:
        print(f'  GATE REFUSES: cannot find the frozen {name} scenario in h2_capstone.mjs')
        sys.exit(2)
    body = m.group(1)
    conds = [(k, v) for k, v in re.findall(r'(\w+):\s*(-?[\d.]+)', body)]
    recs = []
    for r in re.findall(r'Object\.freeze\(\{([^}]*)\}\)', body):
        d = dict(re.findall(r'(\w+):\s*(-?[\d.]+)', r))
        if len(d) >= 2:
            recs.append(d)
    return conds, recs


def norm(s):
    v = float(s)
    return ('%.6f' % v)


def renderings(value, dp):
    def trim(s):
        return s.rstrip('0').rstrip('.') if '.' in s else s
    out = [('full', repr(value)), ('twelve', trim('%.12g' % value)), ('nine', trim('%.9g' % value)), ('printed', '%.*f' % (dp, value))]
    return [(k, s) for k, s in out if '.' in s and 'e' not in s and len(s) >= 6]


def decimals_of(key):
    for c in PRECISION.values():
        if re.match(c['match'], key):
            return c['decimals']
    print(f'  GATE REFUSES: precision.json does not classify {key}')
    sys.exit(2)


def sweep(digest, label='digest'):
    findings = []
    # PROSE and TABLES are judged differently. A condition's number printed in
    # prose is a leak. The same number inside a published or swept TABLE is a
    # coincidence of arithmetic (Table A-1 prints every TWA from 80 to 106 dBA to
    # one decimal, so every one-decimal level is in it as a TWA); a table ROW that
    # carries a whole capstone RECORD is the leak, and direction 1b catches it.
    ptoks = tokens('\n'.join(l for l in digest.split('\n') if not l.startswith('|')))
    ttoks = tokens('\n'.join(l for l in digest.split('\n') if l.startswith('|')))
    # 1. distinctive conditions
    for name in SITES:
        conds, _ = scenario(name)
        for k, v in conds:
            if v in SHARED:
                continue
            for where, toks in ((label, ptoks), ('h2_dump.mjs', tokens(DUMP)), ('h2_fields.mjs', tokens(REC))):
                if v in toks or norm(v) in toks:
                    findings.append(f'DIRECTION 1: {name}.{k} = {v} is in {where}')
            if (v in ttoks or norm(v) in ttoks) and not (v in ptoks or norm(v) in ptoks):
                COINCIDENCES.append((name, k, v))
    # 1b. whole records as pairs in table rows
    rows = [l for l in digest.split('\n') if l.startswith('|')]
    for name in SITES:
        _, recs = scenario(name)
        for rec in recs:
            vals = [norm(v) for v in rec.values()]
            for l in rows:
                cells = {c.strip() for c in l.strip('|').split('|')}
                if all(v in cells for v in vals):
                    findings.append(f'DIRECTION 1b: a {name} record {rec} is a {label} table row: {l[:90]}')
    # 2. graded values
    for tier, key, value, tol in FIELDS:
        for shape, s in renderings(value, decimals_of(key)):
            if s in digest:
                findings.append(f'DIRECTION 2: {key} at its {shape} rendering is in {label}')
    # 4. site names
    if SITE_WORDS.search(digest):
        findings.append(f'DIRECTION 4: a capstone site is named in {label}')
    return findings


findings = sweep(DIGEST)
real_coincidences = sorted(set(COINCIDENCES))
# Redacted by default: the KEYS, deduplicated, and how many sites they cover.
# No site name and no value reaches stdout unless --show-coincidences asks.
coincidence_keys = sorted({k for _n, k, _v in real_coincidences})
coincidence_sites = len({n for n, _k, _v in real_coincidences})
if SHOW_COINCIDENCES:
    coincidence_note = (f'{len(real_coincidences)}: '
                        + ', '.join(f'{n}.{k} = {v}' for n, k, v in real_coincidences)
                        + '  (--show-coincidences: these are capstone condition values, '
                          'do not paste this line anywhere a learner reads)')
else:
    coincidence_note = (f'{len(real_coincidences)} across {coincidence_sites} site(s), on the '
                        f'condition(s) {", ".join(coincidence_keys) if coincidence_keys else "none"}. '
                        f'The site and the value are WITHHELD, because this gate exists to keep them '
                        f'out of everything a learner can read and a log is one of those things. '
                        f'--show-coincidences prints them.')
# 3. neither file reads the other
for f, text, banned in (('h2_dump.mjs', DUMP, ['h2_capstone', 'fields.json']), ('h2_fields.mjs', REC, ['h2_capstone', 'fields.json']),
                        ('h2_capstone.mjs', CAP, ['h2_dump', 'h2_fields', 'digest.txt'])):
    code = re.sub(r'//[^\n]*', '', text)
    for b in banned:
        if b in code:
            findings.append(f'DIRECTION 3: {f} names {b} outside a comment')
for f, text in (('h2_dump.mjs', DUMP), ('h2_fields.mjs', REC), ('hygieneLab.js', LABSRC)):
    if SITE_WORDS.search(re.sub(r'//[^\n]*', '', text)):
        findings.append(f'DIRECTION 4: {f} names a capstone site outside a comment')

# SHARED must clear something, or it is a dead row
cond_vals = {v for name in SITES for _, v in scenario(name)[0]}
dead = sorted(k for k in SHARED if k not in cond_vals)

# 7. banks
bank_note = 'NOT SWEPT: --no-banks declares this run is not sweeping them (foundation phase: no banks exist yet)'
if SWEEP_BANKS:
    files = sorted(glob.glob(os.path.join(BANKS, '**', '*.json'), recursive=True))
    if not files:
        print(f'  GATE REFUSES: no bank JSON under {BANKS}. Pass --no-banks to declare that this run is not sweeping banks.')
        sys.exit(2)
    texts = 0
    for p in files:
        data = json.load(open(p, encoding='utf-8'))
        qs = data if isinstance(data, list) else data.get('questions', [])
        for q in qs:
            parts = [q.get('prompt', ''), q.get('explanation', '')] + [str(o) for o in q.get('options', [])]
            texts += len(parts)
            findings += [f'{os.path.basename(p)}: {x}' for x in sweep('\n'.join(parts), label='bank')
                         if not x.startswith('DIRECTION 1:') or 'bank' in x]
    bank_note = f'{len(files)} bank files, {texts} field texts swept'

# THE UNIT SCALES, from wave.json leakScales, the same list leakage.mjs uses.
SCALE_OF = {'1': 1.0, 'x1e3': 1e3, 'x1e-3': 1e-3, 'x1e2': 1e2, 'x1e-2': 1e-2, 'x60': 60.0, 'x1/60': 1 / 60}
WAVE_TEXT = need(os.path.join(HERE, 'wave.json'), 'wave.json')
LEAK_SCALES = json.loads(WAVE_TEXT).get('leakScales')
if not isinstance(LEAK_SCALES, list) or '1' not in LEAK_SCALES or any(l not in SCALE_OF for l in LEAK_SCALES):
    print(f'  GATE REFUSES: wave.json leakScales {LEAK_SCALES} is missing, lacks "1" or names a scale this gate does not know')
    sys.exit(2)
SCALES = [(l, SCALE_OF[l]) for l in LEAK_SCALES]
N_TOL = 10
PLAIN_COMMAS = re.compile(r'(\d),(?=\d{3}(?!\d))')


def literals(text):
    out = []
    for m in NUMTOK.finditer(text):
        try:
            out.append(float(m.group(0)))
        except ValueError:
            pass
    return out


def numeric_hits(lits):
    """(literal, key, scale label) for every literal within N_TOL tolerances of a graded value at a scale."""
    hits = []
    for tier, key, value, tol in FIELDS:
        for label, f in SCALES:
            target, band = value * f, N_TOL * tol * f
            for x in lits:
                if abs(x - target) <= band:
                    hits.append((x, key, label))
    return hits


def series_of(name):
    m = re.search(r'const ' + name + r' = Object\.freeze\(\{(.*?)\n\}\);', CAP, re.S)
    return [(k, [x.strip() for x in arr.split(',') if x.strip()])
            for k, arr in re.findall(r'(\w+):\s*Object\.freeze\(\[([-\d.,\s]+)\]\)', m.group(1))]


# 8. THE LESSONS
lesson_note = 'NOT SWEPT: --no-lessons declares this run says NOTHING about any lesson'
lesson_files, planted_in, excused_shared, plant_extra = [], None, set(), []
if SWEEP_LESSONS:
    if not os.path.isdir(LESSONS):
        print(f'  GATE REFUSES: no lessons directory at {LESSONS}. Pass --no-lessons to declare that this run does not sweep lessons.')
        sys.exit(2)
    lesson_files = sorted(glob.glob(os.path.join(LESSONS, '**', '*.md'), recursive=True))
    if not lesson_files:
        print(f'  GATE REFUSES: the lessons directory {LESSONS} holds no .md file')
        sys.exit(2)
    conds = [(n, k, v) for n in SITES for k, v in scenario(n)[0]]
    distinctive_conds = [c for c in conds if c[2] not in SHARED]
    recs = [(n, r) for n in SITES for r in scenario(n)[1]]
    series = [(n, k, arr) for n in SITES for k, arr in series_of(n)]
    if not series:
        print('  GATE REFUSES: no capstone count series parsed out of h2_capstone.mjs')
        sys.exit(2)
    n_lits = n_lines = 0

    def lesson_findings(rel, text):
        global n_lits, n_lines
        out = []
        plain = PLAIN_COMMAS.sub(r'\1', text)
        toks = tokens(plain)
        if SITE_WORDS.search(plain):
            out.append(f'[8 lessons] {rel} names a capstone site ({SITE_WORDS.search(plain).group(0)})')
        for n, k, v in conds:
            if v in toks or norm(v) in toks:
                if v in SHARED:
                    excused_shared.add(v)
                else:
                    out.append(f'[8 lessons] {rel} carries the capstone condition {n}.{k} = {v}')
        for line in plain.split('\n'):
            n_lines += 1
            ltoks = tokens(line)
            for n, r in recs:
                if all(v in ltoks or norm(v) in ltoks for v in r.values()):
                    out.append(f'[8 lessons] {rel} carries a whole {n} input record {r} on one line')
        for n, k, arr in series:
            if ', '.join(arr) in plain or ','.join(arr) in plain:
                out.append(f'[8 lessons] {rel} carries the {n}.{k} series')
        for tier, key, value, tol in FIELDS:
            for shape, s_ in renderings(value, decimals_of(key)):
                if s_ in plain:
                    out.append(f'[8 lessons] {rel} carries {key} at its {shape} rendering')
        lits = literals(plain)
        n_lits += len(lits)
        for x, key, label in numeric_hits(lits):
            out.append(f'[8 lessons numeric] {rel} carries a literal within {N_TOL} tolerances of {key} at {label}')
        return out

    for fi, p in enumerate(lesson_files):
        rel = os.path.relpath(p, LESSONS)
        text = io.open(p, encoding='utf-8').read()
        found = lesson_findings(rel, text)
        findings += found
        if fi == 0 and PLANT_LESSON:
            # THE CONTROL: the same file again with a near miss appended, in
            # memory. It is caught only if it adds a numeric finding the clean
            # file does not have, so a pre-existing finding cannot satisfy it.
            k0 = FIELDS[2]
            planted = lesson_findings(rel, text + f'\nA planted near miss: {k0[2] - 3 * k0[3]:.7f}.\n')
            plant_extra = [f for f in planted if f not in found and f.startswith(f'[8 lessons numeric] {rel} ')]
            planted_in = rel
    lesson_note = (f'{len(lesson_files)} lesson files under {LESSONS}, {n_lines} lines, {n_lits} numeric literals '
                   f'compared against 18 graded values at {len(SCALES)} scales ({", ".join(l for l, _ in SCALES)}) within {N_TOL} tolerances; '
                   f'{len(conds)} capstone conditions ({len(distinctive_conds)} distinctive swept, {len(excused_shared)} SHARED seen and excused: '
                   f'{", ".join(sorted(excused_shared, key=float)) or "none"}), {len(recs)} input records, {len(series)} series')

# 9. THE BRIEFS AND wave.json
BRIEFS = ['wave.json', 'BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md']
import subprocess
_ev = subprocess.run(['node', os.path.join(HERE, 'h2_capstone.mjs'), '--evidence'], cwd=HERE, capture_output=True, text=True)
try:
    T6 = float(json.loads(_ev.stdout)['t6MarginRf'])
except Exception:
    print('  GATE REFUSES: cannot read t6MarginRf from h2_capstone.mjs --evidence')
    sys.exit(2)
t6_renderings = [s_ for _, s_ in renderings(T6, 6)] + ['%.4f' % T6, ('%.4f' % T6).rstrip('0')]
brief_lits = 0


def brief_findings(b, text):
    global brief_lits
    out = []
    plain = PLAIN_COMMAS.sub(r'\1', text)
    for tier, key, value, tol in FIELDS:
        for shape, s_ in renderings(value, decimals_of(key)):
            if s_ in plain:
                out.append(f'[9 briefs] {b} carries {key} at its {shape} rendering')
    for s_ in sorted(set(t6_renderings)):
        if re.search(r'(?<![\d.])' + re.escape(s_) + r'(?!\d)', plain):
            out.append(f'[9 briefs] {b} carries the capstone T6 weekly-factor margin at a {len(s_.split(".")[-1])}-decimal rendering')
    lits = literals(plain)
    brief_lits += len(lits)
    for x, key, label in numeric_hits(lits):
        out.append(f'[9 briefs numeric] {b} carries a literal within {N_TOL} tolerances of {key} at {label}')
    return out


brief_plant_extra = []
for b in BRIEFS:
    text = need(os.path.join(HERE, b), b)
    found = brief_findings(b, text)
    findings += found
    if b == 'wave.json' and PLANT_BRIEF:
        # THE CONTROL: the shape of the original defect, appended in memory.
        planted = brief_findings(b, text + f'\n"planted": "the finest answer a learner can give is {FIELDS[16][2]:.6f}"\n')
        brief_plant_extra = [f for f in planted if f not in found or planted.count(f) > found.count(f)]
brief_note = f'{len(BRIEFS)} files ({", ".join(BRIEFS)}), {brief_lits} numeric literals, 18 graded values and the T6 margin'

# CONTROLS
ctl1 = sweep(DIGEST + f'\nplanted {FIELDS[4][2]!r}\n')
distinctive = [v for n in SITES for _, v in scenario(n)[0] if v not in SHARED]
ctl2 = sweep(DIGEST + f'\nplanted {distinctive[0]} in prose\n')
if not any('DIRECTION 2' in c for c in ctl1) or not any('DIRECTION 1' in c for c in ctl2):
    print('  GATE REFUSES: a control did not fire, so this gate cannot do its job')
    sys.exit(2)

nconds = sum(len(scenario(n)[0]) for n in SITES)
nrecs = sum(len(scenario(n)[1]) for n in SITES)
print(f'gate_capstone_leak EXAMINED: {nconds} stated conditions ({nconds - sum(1 for n in SITES for _, v in scenario(n)[0] if v in SHARED)} distinctive, '
      f'{len(SHARED)} SHARED with a reason, {len(dead)} dead) and {nrecs} input records across 3 sites; '
      f'18 graded values at up to four renderings; digest {len(DIGEST.splitlines())} lines; dump, records and lab sources; banks: {bank_note}.')
print(f'  table-only coincidences (a condition value printed inside a published or swept table, never in prose, never as a whole record): {coincidence_note}')
print(f'  direction 8 lessons: {lesson_note}.')
print(f'  direction 9 briefs: {brief_note}.')
print(f'  CONTROLS FIRED: a planted graded value and a planted condition were both caught.')
if dead:
    print(f'  GATE FAILS: SHARED rows that clear nothing: {dead}')
    sys.exit(1)
for f in findings:
    print(f'  {f}')
if PLANT_LESSON or PLANT_BRIEF:
    if PLANT_LESSON:
        want = '[8 lessons numeric]'
        caught = planted_in is not None and bool(plant_extra)
        print(f'  planted in {planted_in}: {plant_extra[:1]}')
    else:
        want = '[9 briefs]'
        caught = any(f.startswith('[9 briefs') and ' wave.json ' in f for f in brief_plant_extra)
        print(f'  planted in wave.json: {brief_plant_extra[:2]}')
    print(f'  NEGATIVE CONTROL {"--plant-lesson" if PLANT_LESSON else "--plant-brief"}: expected a {want} finding, {"caught" if caught else "NOT CAUGHT"}')
    sys.exit(1 if caught else 2)
print(f'gate_capstone_leak: {len(findings)} finding(s).')
sys.exit(1 if findings else 0)
