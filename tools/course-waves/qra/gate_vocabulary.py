#!/usr/bin/env python3
"""GATE: the words digest section 34 legislates, AND THE SEAMS, over everything a
learner reads.

THE WORDS.
  * "severity" and "likelihood" belong to the risk matrix course (and
    "likelihood" to the Bayesian decision course). Never used here.
  * "NPV", "IRR" and "payback" belong to the economics courses. This course
    says "present value".
  * "risk score" and "risk rating" are matrix words. Never used.

THE SEAMS. The cross-course leakage rule: this course takes a probability of
death and a frequency as INPUTS and grades nothing another course owns. So a
word another course owns may appear only in a SENTENCE THAT NAMES THE SEAM,
that is, a sentence that also says where the thing belongs or that this course
takes it as given. Each owner has its own words and its own seam markers:

  H4 consequence   probit, dose, dispersion, source term, plume, view factor,
                   solid flame, toxic load, emissive power, TNT, Gaussian
                   -> "consequence course", "consequence modelling", "H4",
                      "input", "stated", "given", "belongs"
  H3 LOPA          LOPA, SIL, PFDavg, IPL, TMEL, safety instrumented
                   -> "LOPA course", "H3", "belongs"
  the risk matrix  risk matrix, matrix
                   -> "risk and change course", "never", "belongs"
  FC1 and FC5      API 521, point source, flare radiation, setback
                   -> "facilities course", "FC1", "FC5", "belongs"
  EC economics     (NPV and IRR are never used at all; see above)

A sentence is split on ". ", "? ", "! " and line ends after markdown is
unwrapped, so a seam word and its marker have to share the sentence a learner
reads. This is a guard against GRADING or TEACHING another course's method,
and it is deliberately strict: a lesson that wants to say "the probit" says in
the same sentence that it belongs to the consequence course.

SWEPT: the digest (EXCEPT section 34, whose table has to name the bare words
it legislates), the LEARNER-FACING TEXT of the lab, the three panels, their
shared bits and the learning page (string literals and JSX text), every lesson
body and manifest title under the course directory, and every bank JSON under
the wave's banks directory.

ENGINE TEXT. An engine string the digest quotes verbatim is exempted BY EXACT
STRING below, and a DEAD exemption fails the gate.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant] [--no-app]

--plant is THE NEGATIVE CONTROL: it plants one "severity", one stray
"likelihood", one "NPV", one H4 word with no seam marker, one H3 word with no
seam marker, one matrix word with no seam marker and one FC word with no seam
marker, and must exit 1 with all seven caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('H5_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('H5_REPO', '/root/wt-h5-nextgen')
COURSE = os.environ.get('H5_COURSE', os.path.join(REPO, 'src/content/courses/qra'))
APP = [os.path.join(REPO, 'src/components/course/panels/qra', f) for f in
       ('EventTreeExplorer.jsx', 'SocietalExplorer.jsx', 'AlarpExplorer.jsx', 'panelBits.jsx', 'qraLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/QraLearningPage.jsx')]

WORDS = [
    ('severity', re.compile(r'\bseverit(y|ies)\b', re.I)),
    ('likelihood', re.compile(r'\blikelihoods?\b', re.I)),
    # the acronyms case-sensitively (the engine's code name `npv` is not the word),
    # the spelled-out forms in any case
    ('NPV or IRR', re.compile(r'\b(NPV|IRR)\b|(?i:\b(net present value|internal rate of return|payback)\b)')),
    ('risk score', re.compile(r'\brisk (score|rating)s?\b', re.I)),
]
SEAMS = [
    ('H4 consequence', re.compile(r'\b(probits?|doses?|dispersion|source terms?|plumes?|view factors?|solid flame|toxic load|emissive power|TNT|gaussian)\b', re.I),
     re.compile(r'consequence (course|modelling|engine|model)|\bH4\b|\binputs?\b|\bstated\b|\bgiven\b|\bbelongs?\b', re.I)),
    ('H3 LOPA', re.compile(r'\b(LOPA|SIL|SILs|PFDavg|IPLs?|TMEL|safety instrumented)\b'),
     re.compile(r'LOPA course|\bH3\b|\bbelongs?\b', re.I)),
    ('risk matrix', re.compile(r'\b(risk )?matri(x|ces)\b', re.I),
     re.compile(r'risk and change course|\bnever\b|\bbelongs?\b', re.I)),
    ('FC1 and FC5', re.compile(r'\b(API 521|point source|flare radiation|setbacks?)\b', re.I),
     re.compile(r'facilities courses?|\bFC1\b|\bFC5\b|\bbelongs?\b', re.I)),
]

# VERBATIM ENGINE TEXT, blanked before matching. A DEAD entry fails the gate.
EXEMPT = [
    # the engine's QRA_SOURCES key for its discounting source, quoted in the
    # sources table of section 1
    '| NPV | engines/economics/cashflow.ts npv (year-end discounting) |',
]
EXEMPT_HIT = set()
SEAM_CHECKED = {}


def unwrap(text):
    return re.sub(r'(?<=\S)\n(?=[^\n#|\-*>{\d])', ' ', text)


def sentences(line):
    return re.split(r'(?<=[.?!])\s+(?=[A-Z`"(\[])', line)


def sweep(label, text, hits, prose=True):
    body = unwrap(text) if prose else text
    for e in EXEMPT:
        if e in body:
            EXEMPT_HIT.add(e)
            body = body.replace(e, ' ' * len(e))
    for i, line in enumerate(body.split('\n'), 1):
        for name, rx in WORDS:
            for _ in rx.finditer(line):
                hits.append((label, i, name, line.strip()[:140]))
        for s in sentences(line):
            for name, word, marker in SEAMS:
                if word.search(s):
                    SEAM_CHECKED[name] = SEAM_CHECKED.get(name, 0) + 1
                    if not marker.search(s):
                        hits.append((label, i, f'{name} word with no seam marker', s.strip()[:140]))


def learner_text(src):
    """The text a learner can read in a JS or JSX source: string literals and
    JSX text, with comments removed. Identifiers are code, never copy."""
    code = re.sub(r'/\*[\s\S]*?\*/', ' ', src)
    code = re.sub(r'(?m)(^|[^:])//.*$', r'\1', code)
    out = []
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", code):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        if re.fullmatch(r'[\w./@-]*', t):
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
        digest = ('A planted severity line. A planted likelihood line. A planted NPV line. '
                  'A planted probit line. A planted SIL line. A planted matrix line. A planted setback line.\n' + digest)
    parts = re.split(r'(?m)^(# SECTION 34:.*)$', digest)
    if len(parts) < 3:
        print('  GATE REFUSES: the vocabulary section 34 is not in the digest, so the rule has no source')
        return 2
    swept_digest = parts[0] + (parts[3] if len(parts) > 3 else '')
    hits, lines, files = [], 0, 0
    sweep('digest.txt (section 34 set aside)', swept_digest, hits)
    lines += swept_digest.count('\n') + 1
    files += 1
    app_files = 0
    app_literals = 0
    if '--no-app' in sys.argv:
        print('  --no-app DECLARED: the lab, the panels and the page were NOT swept')
    else:
        for p in APP:
            if not os.path.exists(p):
                print(f'  GATE REFUSES: the app source {p} is missing')
                return 2
            t = open(p, encoding='utf-8').read()
            texts = learner_text(t)
            app_literals += len(texts)
            sweep(os.path.relpath(p, REPO), '\n'.join(texts), hits, prose=False)
            lines += t.count('\n') + 1
            files += 1
            app_files += 1
    lesson_files = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                if n.endswith('.md'):
                    t = open(p, encoding='utf-8').read()
                    sweep(os.path.relpath(p, COURSE), t, hits)
                    lesson_files += 1
                    lines += t.count('\n') + 1
                elif n == 'manifest.json':
                    m = json.load(open(p))
                    titles = [mm['title'] for mm in m.get('modules', [])] + \
                             [l['title'] for mm in m.get('modules', []) for l in mm.get('lessons', [])]
                    sweep(os.path.relpath(p, COURSE), '\n'.join(titles), hits)
    bank_texts = 0
    bdir = os.path.join(HERE, 'banks')
    if os.path.isdir(bdir):
        for n in sorted(os.listdir(bdir)):
            if not n.endswith('.json'):
                continue
            qs = json.load(open(os.path.join(bdir, n)))
            qs = qs if isinstance(qs, list) else qs.get('questions', [])
            for k, q in enumerate(qs):
                for t in [q.get('prompt'), q.get('explanation')] + list(q.get('options') or []):
                    if isinstance(t, str):
                        bank_texts += 1
                        sweep(f'{n}#{k}', t, hits)
    print(f'  files examined: {files} (digest and {app_files} app sources, {app_literals} learner-facing strings read out of them), lesson bodies: {lesson_files}, bank texts: {bank_texts}')
    if app_files and app_literals < 100:
        print('  GATE REFUSES: too few learner-facing strings were read out of the app sources to have checked them')
        return 2
    print(f'  lines examined: {lines}')
    print(f'  seam sentences checked, by owner: {SEAM_CHECKED}')
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
        want = {'severity', 'likelihood', 'NPV or IRR', 'H4 consequence word with no seam marker',
                'H3 LOPA word with no seam marker', 'risk matrix word with no seam marker', 'FC1 and FC5 word with no seam marker'}
        print(f'  NEGATIVE CONTROL: expected {sorted(want)} caught; got {sorted(planted)}')
        return 1 if planted == want else 2
    if dead:
        print('  GATE FAILS: an exemption that clears nothing is a dead row')
        return 1
    return 1 if hits else 0


sys.exit(main())
