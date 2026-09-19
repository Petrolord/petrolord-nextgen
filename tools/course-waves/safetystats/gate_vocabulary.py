#!/usr/bin/env python3
"""GATE: the four words digest section 28 legislates, over everything a learner reads.

  * bare "Poisson" already means Poisson's ratio in six live courses. Every use
    here must be "Poisson distribution", "Poisson count model", "Poisson model"
    or "Poisson mean", and "Poisson's ratio" may not appear at all.
  * bare "severity" already means a risk-matrix category and a surveillance
    exception level. Every use here must be "severity rate" or "severity rates".
  * no P label (P10, P50, P90 and the like) anywhere: a confidence interval is an
    interval on an estimated rate, and the programme's percentile vocabulary is
    for distributions of outcomes.
  * "FAR" is not swept for a qualifier, because the rule is "observed FAR WHERE
    THE DIFFERENCE COULD MATTER", which is a judgement; the gate REPORTS the
    count of FAR uses so a reader can check them.

SWEPT: the digest (EXCEPT section 28, whose table has to name the bare words it
legislates), the lab, the three panels, their shared bits and the learning page,
every lesson body and manifest title under the course directory, and every bank
JSON under the wave's banks directory. Markdown is unwrapped before matching, so
a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one bare "Poisson", one bare
"severity" and one "P90" in the digest text in memory and must exit 1 with all
three caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('H1_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('H1_REPO', '/root/wt-h1-nextgen')
COURSE = os.environ.get('H1_COURSE', os.path.join(REPO, 'src/content/courses/safetystats'))
APP = [os.path.join(REPO, 'src/components/course/panels/safetystats', f) for f in
       ('RatesExplorer.jsx', 'IntervalsExplorer.jsx', 'UChartExplorer.jsx', 'panelBits.jsx', 'safetystatsLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/SafetyStatsLearningPage.jsx')]

RULES = [
    ('bare Poisson', re.compile(r"\bPoisson(?!\s+(?:distribution|count|model|mean))\b(?!'s)")),
    ("Poisson's ratio", re.compile(r"\bPoisson's\s+ratio\b", re.I)),
    ('bare severity', re.compile(r'\bseverity\b(?!\s+rates?\b)', re.I)),
    ('a P label', re.compile(r'\bP(?:5|10|50|90|95)\b')),
]
FAR = re.compile(r'\bFAR\b')

# VERBATIM NAMES THAT ARE NOT THIS COURSE'S PROSE, blanked before matching. A
# DEAD entry fails the gate.
#   the engine's own method string for the interval, quoted verbatim;
#   IOGP's name for its days-per-case quantity, which the digest names in order
#   to say it is a different quantity;
#   two golden case ids, which are identifiers in the vendored golden.
EXEMPT = [
    'Garwood (1936) exact Poisson interval',
    'LWDC severity',
    'severity-osha-base',
    'severity-million-base',
]
EXEMPT_HIT = set()


def unwrap(text):
    return re.sub(r'(?<=\S)\n(?=[^\n#|\-*>{\d])', ' ', text)


def sweep(label, text, hits, prose=True):
    body = unwrap(text) if prose else text
    for e in EXEMPT:
        if e in body:
            EXEMPT_HIT.add(e)
            body = body.replace(e, ' ' * len(e))
    for i, line in enumerate(body.split('\n'), 1):
        for name, rx in RULES:
            for _ in rx.finditer(line):
                hits.append((label, i, name, line.strip()[:120]))
    return len(FAR.findall(text))


def main():
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('  GATE REFUSES: no digest.txt')
        return 2
    digest = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        digest = 'A planted Poisson line, a planted severity line and a planted P90 line.\n' + digest
    # section 28 names the bare words it legislates, so it is set aside by heading
    parts = re.split(r'(?m)^(# SECTION 28:.*)$', digest)
    swept_digest = parts[0] + (parts[3] if len(parts) > 3 else '')
    if len(parts) < 3:
        print('  GATE REFUSES: the vocabulary section 28 is not in the digest, so the rule has no source')
        return 2
    hits, lines, fars, files = [], 0, 0, 0
    fars += sweep('digest.txt (section 28 set aside)', swept_digest, hits)
    lines += swept_digest.count('\n') + 1
    files += 1
    for p in APP:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: the app source {p} is missing')
            return 2
        t = open(p, encoding='utf-8').read()
        fars += sweep(os.path.relpath(p, REPO), t, hits, prose=False)
        lines += t.count('\n') + 1
        files += 1
    lesson_files = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                if n.endswith('.md'):
                    t = open(p, encoding='utf-8').read()
                    fars += sweep(os.path.relpath(p, COURSE), t, hits)
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
    print(f'  files examined: {files} (digest and app), lesson bodies: {lesson_files}, bank texts: {bank_texts}')
    print(f'  lines examined: {lines}')
    print(f'  FAR uses, reported for a human read of "observed FAR where it matters": {fars}')
    print(f'  BREACHES: {len(hits)}')
    for h in hits[:40]:
        print(f'   {h[2].upper()} {h[0]}:{h[1]}  {h[3]}')
    if lines < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    dead = [e for e in EXEMPT if e not in EXEMPT_HIT]
    print(f'  exemptions declared: {len(EXEMPT)}, dead: {dead}')
    if dead and '--plant' not in sys.argv:
        print('  GATE FAILS: an exemption that clears nothing is a dead row')
        return 1
    if '--plant' in sys.argv:
        planted = {h[2] for h in hits if h[3].startswith('A planted')}
        print(f'  NEGATIVE CONTROL: expected bare Poisson, bare severity and a P label caught; got {sorted(planted)}')
        return 1 if planted == {'bare Poisson', 'bare severity', 'a P label'} else 2
    return 1 if hits else 0


sys.exit(main())
