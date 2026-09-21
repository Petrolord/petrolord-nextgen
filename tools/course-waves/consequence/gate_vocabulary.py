#!/usr/bin/env python3
"""GATE: the words digest section 34 legislates, and the cross-course leakage
terms, over everything a learner reads.

VOCABULARY (section 34):
  * bare "flux" is always qualified: heat flux, burning flux, evaporation flux
    or mass flux.
  * bare "beta" appears only inside "k beta", the Babrauskas product.
  * bare "dose" is always "thermal dose", "toxic dose", "toxic load" or
    "lethal dose".
  * "severity" and "likelihood" are never used: this course computes effects
    and no frequency.
  * bare "radiation" is always "heat radiation" or "thermal radiation".

LEAKAGE (the seams the course must never grade, digest section 22):
  * the quantitative risk course's words: individual risk, societal risk, PLL,
    potential loss of life, F-N, ALARP, ICAF;
  * the risk and change course's risk matrix;
  * the Facilities courses' point source radiation model, API 521, its
    customary radiation levels and the setbacks they imply;
  * the produced water, storage and emissions courses' words: BTEX, oil in
    water, OIW, tank venting or breathing, greenhouse gas, GHG, CO2e, emissions.
  These may be NAMED only where the seam is taught: digest sections 1, 22, 31
  and 34, and the lessons and banks listed in SEAM_LESSONS below. Anywhere
  else a hit is a breach. The four API 521 level figures are a breach
  EVERYWHERE, seam lessons included, because a figure is a graded answer in
  another course.

SWEPT: the digest (section 34 set aside for the vocabulary rules, since its
table names the bare words), the learner-facing text of the lab, the three
panels, their shared bits and the learning page, every lesson body and
manifest title, and every bank JSON under the wave's banks directory.

    python3 gate_vocabulary.py [--plant] [--no-app]

--plant is THE NEGATIVE CONTROL: it plants one bare flux, one bare beta, one
bare dose, one severity, one likelihood, one bare radiation, one individual
risk and one API 521 level in the digest text in memory and must exit 1 with
all eight caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('H4_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('H4_REPO', '/root/wt-h4-nextgen')
COURSE = os.environ.get('H4_COURSE', os.path.join(REPO, 'src/content/courses/consequence'))
APP = [os.path.join(REPO, 'src/components/course/panels/consequence', f) for f in
       ('ReleaseExplorer.jsx', 'FireExplorer.jsx', 'HarmExplorer.jsx', 'panelBits.jsx', 'consequenceLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/ConsequenceLearningPage.jsx')]

RULES = [
    ('bare flux', re.compile(r'(?<!heat )(?<!burning )(?<!evaporation )(?<!mass )\bflux(es)?\b', re.I)),
    ('bare beta', re.compile(r'(?<!k )\bbeta\b', re.I)),
    ('bare dose', re.compile(r'(?<!thermal )(?<!toxic )(?<!lethal )\bdoses?\b', re.I)),
    ('severity', re.compile(r'\bseverity\b', re.I)),
    ('likelihood', re.compile(r'\blikelihood\b', re.I)),
    ('bare radiation', re.compile(r'(?<!heat )(?<!thermal )\bradiation\b', re.I)),
]
LEAK = [
    ('leak: quantitative risk', re.compile(r'\bindividual risk\b|\bsocietal risk\b|\bPLL\b|\bpotential loss of life\b|\bF-?N\b(?! ?=)|\bALARP\b|\bICAF\b', re.I)),
    ('leak: risk matrix', re.compile(r'\brisk matri(x|ces)\b', re.I)),
    ('leak: point source', re.compile(r'\bpoint source\b|\bAPI 521\b|\bsetbacks?\b', re.I)),
    ('leak: produced water and emissions', re.compile(r'\bBTEX\b|\boil in water\b|\bOIW\b|\btank (venting|breathing)\b|\bgreenhouse\b|\bGHG\b|\bCO2e\b|\bemissions?\b', re.I)),
]
LEVELS = ('leak: an API 521 level figure', re.compile(r'(?<![\d.])(1\.58|4\.73|6\.31|9\.46)(?!\d)'))
SIL4 = re.compile(r'(?!x)x')
# Lessons (relative to the course directory, without .md) and banks where a seam
# may be NAMED. A figure from LEVELS is a breach even here.
SEAM_LESSONS = [
    'beginner/m01-what-a-consequence-model-computes/l01-effects-before-frequencies',
    'intermediate/m05-transmissivity-and-the-heat-flux/l04-the-point-source-belongs-elsewhere',
    'advanced/m05-what-the-engine-does-not-do/l02-fires-and-blasts-it-does-not-model',
    'advanced/m05-what-the-engine-does-not-do/l03-harm-it-does-not-model',
    'advanced/m06-judgement-end-to-end/l02-what-belongs-to-other-courses',
    'advanced/m06-judgement-end-to-end/l03-writing-the-consequence-note',
]
SEAM_BANKS = ['intermediate-m05', 'advanced-m05', 'advanced-m06']
SEAM_SECTIONS = (1, 22, 31, 34)

# VERBATIM ENGINE TEXT, blanked before matching. A DEAD entry fails the gate.
EXEMPT = [
    # the engine's refusal for the generic probit, quoted in the refusal table
    "dose: must be above 0: ln(0) has no probit",
    # the engine's own field name, quoted in the refusal table
    "`dose`",
    # the engine's plume model string, quoted in the plume section
    "continuous point source Gaussian plume",
]
EXEMPT_HIT = set()

# A string literal that IS an engine argument name is a property key in code,
# such as up('beta') or the key list a panel copies inputs by. It is never
# printed to a learner. Only a literal that is EXACTLY one of these is skipped,
# and the count skipped is printed.
ENGINE_KEYS = set()
ENGINE_KEYS_SEEN = {}


def unwrap(text):
    return re.sub(r'(?<=\S)\n(?=[^\n#|\-*>{\d])', ' ', text)


def sweep(label, text, hits, prose=True, vocab=True, seam=False):
    """vocab: apply the section 34 rules; seam: this text may NAME a seam."""
    body = unwrap(text) if prose else text
    for e in EXEMPT:
        if e in body:
            EXEMPT_HIT.add(e)
            body = body.replace(e, ' ' * len(e))
    rules = (RULES if vocab else []) + ([] if seam else LEAK) + [LEVELS]
    for i, line in enumerate(body.split('\n'), 1):
        for name, rx in rules:
            for _ in rx.finditer(line):
                hits.append((label, i, name, line.strip()[:120]))
    return 0


def learner_text(src):
    """The text a learner can read in a JS or JSX source: string literals and
    JSX text, with comments removed. Identifiers such as the engine argument
    `beta` are code, never copy, so they are not swept; the words a panel
    PRINTS are. Measured, not assumed: main() prints how many literals it read."""
    code = re.sub(r'/\*[\s\S]*?\*/', ' ', src)
    code = re.sub(r'(?m)(^|[^:])//.*$', r'\1', code)
    out = []
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", code):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        if t in ENGINE_KEYS:
            ENGINE_KEYS_SEEN[t] = ENGINE_KEYS_SEEN.get(t, 0) + 1
            continue
        out.append(re.sub(r'\$\{[^}]*\}', ' ', t))
    for m in re.finditer(r'>([^<>{}]*[A-Za-z][^<>{}]*)<', code):
        out.append(m.group(1))
    return out


def main():
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('  GATE REFUSES: no digest.txt')
        return 2
    digest = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        digest = ('A planted flux line, a planted beta line, a planted dose line, a planted severity line, '
                  'a planted likelihood line, a planted radiation line, a planted individual risk line '
                  'and a planted 4.73 line.\n' + digest)
    parts = re.split(r'(?m)^(# SECTION \d+:.*)$', digest)
    if len(parts) < 60:
        print('  GATE REFUSES: the digest carries too few sections to be swept by section')
        return 2
    hits, lines, files = [], 0, 0
    sweep('digest.txt (header)', parts[0], hits)
    for k in range(1, len(parts), 2):
        n = int(re.match(r'# SECTION (\d+):', parts[k]).group(1))
        sweep(f'digest.txt section {n}', parts[k] + '\n' + parts[k + 1], hits,
              vocab=(n != 34), seam=(n in SEAM_SECTIONS))
    if not any(re.match(r'# SECTION 34: Vocabulary', parts[k]) for k in range(1, len(parts), 2)):
        print('  GATE REFUSES: the vocabulary section 34 is not in the digest, so the rule has no source')
        return 2
    lines += digest.count('\n') + 1
    files += 1
    app_files = 0
    app_literals = [0]
    if '--no-app' in sys.argv:
        print('  --no-app DECLARED: the lab, the panels and the page were NOT swept')
    else:
        for p in APP:
            if not os.path.exists(p):
                print(f'  GATE REFUSES: the app source {p} is missing')
                return 2
            t = open(p, encoding='utf-8').read()
            texts = learner_text(t)
            app_literals[0] += len(texts)
            sweep(os.path.relpath(p, REPO), '\n'.join(texts), hits, prose=False)
            lines += t.count('\n') + 1
            files += 1
            app_files += 1
    lesson_files = 0
    seam_seen = set()
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                rel = os.path.relpath(p, COURSE)
                if n.endswith('.md'):
                    t = open(p, encoding='utf-8').read()
                    key = rel[:-3]
                    if key in SEAM_LESSONS:
                        seam_seen.add(key)
                    sweep(rel, t, hits, seam=key in SEAM_LESSONS)
                    lesson_files += 1
                    lines += t.count('\n') + 1
                elif n == 'manifest.json':
                    m = json.load(open(p))
                    titles = [mm['title'] for mm in m.get('modules', [])] + \
                             [l['title'] for mm in m.get('modules', []) for l in mm.get('lessons', [])]
                    sweep(rel, '\n'.join(titles), hits, seam=True)
    bank_texts = 0
    bdir = os.path.join(HERE, 'banks')
    if os.path.isdir(bdir):
        for n in sorted(os.listdir(bdir)):
            if not n.endswith('.json'):
                continue
            seam = any(n.startswith(b) for b in SEAM_BANKS)
            qs = json.load(open(os.path.join(bdir, n)))
            qs = qs if isinstance(qs, list) else qs.get('questions', [])
            for k, q in enumerate(qs):
                for t in [q.get('prompt'), q.get('explanation')] + list(q.get('options') or []):
                    if isinstance(t, str):
                        bank_texts += 1
                        sweep(f'{n}#{k}', t, hits, seam=seam)
    print(f'  files examined: {files} (digest and {app_files} app sources, {app_literals[0]} learner-facing strings read out of them), lesson bodies: {lesson_files}, bank texts: {bank_texts}')
    if app_files and app_literals[0] < 100:
        print('  GATE REFUSES: too few learner-facing strings were read out of the app sources to have checked them')
        return 2
    missing_seam = [k for k in SEAM_LESSONS if lesson_files and k not in seam_seen]
    print(f'  seam lessons declared: {len(SEAM_LESSONS)}, missing on disk: {missing_seam}')
    print(f'  lines examined: {lines}')
    print(f'  BREACHES: {len(hits)}')
    for h in hits[:60]:
        print(f'   {h[2].upper()} {h[0]}:{h[1]}  {h[3]}')
    if lines < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    dead = [e for e in EXEMPT if e not in EXEMPT_HIT]
    print(f'  exemptions declared: {len(EXEMPT)}, dead: {dead}')
    if '--plant' in sys.argv:
        planted = {h[2] for h in hits if h[3].startswith('A planted')}
        want = {'bare flux', 'bare beta', 'bare dose', 'severity', 'likelihood', 'bare radiation',
                'leak: quantitative risk', 'leak: an API 521 level figure'}
        print(f'  NEGATIVE CONTROL: expected {sorted(want)} caught; got {sorted(planted)}')
        return 1 if planted == want else 2
    if dead or missing_seam:
        print('  GATE FAILS: an exemption that clears nothing, or a seam lesson that does not exist, is a dead row')
        return 1
    return 1 if hits else 0


sys.exit(main())
