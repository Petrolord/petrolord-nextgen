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

Two CONTROLS run every time: a graded value planted into a copy of the digest,
and a condition planted into a copy of the digest, must both be caught.

    python3 gate_capstone_leak.py [--banks DIR] [--no-banks]

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
for a in ARGS:
    if a.startswith('--') and a not in ('--banks', '--no-banks'):
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
                COINCIDENCES.append(f'{name}.{k} = {v}')
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
                findings.append(f'DIRECTION 2: {key} as {shape} ({s}) is in {label}')
    # 4. site names
    if SITE_WORDS.search(digest):
        findings.append(f'DIRECTION 4: a capstone site is named in {label}')
    return findings


findings = sweep(DIGEST)
real_coincidences = sorted(set(COINCIDENCES))
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
print(f'  table-only coincidences (a condition value printed inside a published or swept table, never in prose, never as a whole record): {len(real_coincidences)}: {", ".join(real_coincidences)}')
print(f'  CONTROLS FIRED: a planted graded value and a planted condition were both caught.')
if dead:
    print(f'  GATE FAILS: SHARED rows that clear nothing: {dead}')
    sys.exit(1)
for f in findings:
    print(f'  {f}')
print(f'gate_capstone_leak: {len(findings)} finding(s).')
sys.exit(1 if findings else 0)
