#!/usr/bin/env python3
"""GATE: the five words digest section 32 legislates, over everything a learner reads.

  * bare "beta" already means a vapour fraction (fluid), an orifice diameter
    ratio (metering) and more. Every use here is "beta factor" (or the
    identifier betaD, which is one word and never matches).
  * bare "PFD" is always "PFDavg" for a SIF or a subsystem; an IPL's credited
    figure is "IPL PFD" (or "IPL PFDs"). PFDavg is one word and never matches.
  * "severity" is never used: LOPA is frequency based, and the academy's risk
    matrices own the word.
  * "likelihood" appears only inside "tolerable mitigated event likelihood",
    the TMEL; a matrix likelihood score and a Bayesian likelihood live in other
    courses.
  * "risk reduction ratio" is never used: RRF is the risk reduction FACTOR.
  * "SIL 4" and "SIL4" are REPORTED for a human read, because the rule ("no SIL
    4 SIF is ever proposed; SIL 4 appears only as a band, a table floor or the
    reason to redesign") is a judgement a regex cannot make.

SWEPT: the digest (EXCEPT section 32, whose table has to name the bare words
it legislates), the LEARNER-FACING TEXT of the lab, the three panels, their
shared bits and the learning page (string literals and JSX text; identifiers
such as the engine argument `beta` are code and are not swept), every lesson body and manifest title under the course directory, and
every bank JSON under the wave's banks directory. Markdown is unwrapped before
matching, so a word split across a hard wrap is still read.

ENGINE TEXT. The engine's own messages and formula strings use the bare words
(its refusal field is named `beta`, its formulas read "PFD = ..."). Those
strings are quoted VERBATIM as the engine's words, so each is exempted BY EXACT
STRING below, and a DEAD exemption fails the gate. A writer's own sentence
gets no exemption.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant] [--no-app]

--plant is THE NEGATIVE CONTROL: it plants one bare "beta", one bare "PFD",
one "severity", one stray "likelihood" and one "risk reduction ratio" in the
digest text in memory and must exit 1 with all five caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('H3_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('H3_REPO', '/root/wt-h3-nextgen')
COURSE = os.environ.get('H3_COURSE', os.path.join(REPO, 'src/content/courses/lopa'))
APP = [os.path.join(REPO, 'src/components/course/panels/lopa', f) for f in
       ('WorksheetExplorer.jsx', 'SifExplorer.jsx', 'ProofTestExplorer.jsx', 'panelBits.jsx', 'lopaLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/LopaLearningPage.jsx')]

RULES = [
    ('bare beta', re.compile(r'\bbeta\b(?!\s+factors?\b)', re.I)),
    ('bare PFD', re.compile(r'(?<!IPL )\bPFDs?\b')),
    ('severity', re.compile(r'\bseverity\b', re.I)),
    ('stray likelihood', re.compile(r'(?<!mitigated event )\blikelihood\b', re.I)),
    ('risk reduction ratio', re.compile(r'\brisk reduction ratio\b', re.I)),
]
SIL4 = re.compile(r'\bSIL ?4\b')

# VERBATIM ENGINE TEXT, blanked before matching. A DEAD entry fails the gate.
EXEMPT = [
    # refusal messages and warnings, quoted in the refusal and warning tables
    # (the longer string first: the shorter one is a substring of it)
    "subsystems[1].beta: is required for a redundant 1oo2 and must lie in [0, 1]: beta = 0 is a claim of no common cause and has to be typed",
    "beta: is required for a redundant 1oo2 and must lie in [0, 1]: beta = 0 is a claim of no common cause and has to be typed",
    "beta does not apply to 2oo2 and was ignored",
    "beta does not apply to 1oo1 and was ignored",
    "must have a PFD above 0 and no more than 1 (a PFD of 0 is a perfect layer, which none is)",
    # the engine's formula strings, quoted in the formula table
    "PFD = lD tCE",
    "PFD = 2((1-bD) lDD + (1-b) lDU)^2 tCE tGE + bD lDD MTTR + b lDU (T1/2 + MRT)",
    "PFD = 2 lD tCE (Annex B carries no beta term for 2oo2)",
    "PFD = 6((1-bD) lDD + (1-b) lDU)^2 tCE tGE + bD lDD MTTR + b lDU (T1/2 + MRT)",
    "PFD = 6((1-bD) lDD + (1-b) lDU)^3 tCE tG2E tGE + bD lDD MTTR + b lDU (T1/2 + MRT)",
    # the engine's method and units strings
    "prod(PFD of credited IPLs)",
    "PFD_SYS = PFD_S + PFD_L + PFD_FE",
    "probabilities and PFDs dimensionless",
    # the engine's band convention string, quoted in the band section
    "an exact decade belongs to the higher-PFD band",
    # the engine names the field `beta` in a refusal row
    "`beta`",
    "`subsystems[1].beta`",
]
EXEMPT_HIT = set()

# A string literal that IS an engine argument name is a property key in code,
# such as up('beta') or the key list a panel copies inputs by. It is never
# printed to a learner. Only a literal that is EXACTLY one of these is skipped,
# and the count skipped is printed.
ENGINE_KEYS = {'beta'}
ENGINE_KEYS_SEEN = {}


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
    return len(SIL4.findall(body))


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
        digest = ('A planted beta line, a planted PFD line, a planted severity line, a planted likelihood line '
                  'and a planted risk reduction ratio line.\n' + digest)
    parts = re.split(r'(?m)^(# SECTION 32:.*)$', digest)
    if len(parts) < 3:
        print('  GATE REFUSES: the vocabulary section 32 is not in the digest, so the rule has no source')
        return 2
    swept_digest = parts[0] + (parts[3] if len(parts) > 3 else '')
    hits, lines, sil4, files = [], 0, 0, 0
    sil4 += sweep('digest.txt (section 32 set aside)', swept_digest, hits)
    lines += swept_digest.count('\n') + 1
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
            sil4 += sweep(os.path.relpath(p, REPO), '\n'.join(texts), hits, prose=False)
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
                    sil4 += sweep(os.path.relpath(p, COURSE), t, hits)
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
    print(f'  files examined: {files} (digest and {app_files} app sources, {app_literals[0]} learner-facing strings read out of them), lesson bodies: {lesson_files}, bank texts: {bank_texts}')
    print(f'  string literals skipped as engine argument names: {ENGINE_KEYS_SEEN}')
    if app_files and app_literals[0] < 100:
        print('  GATE REFUSES: too few learner-facing strings were read out of the app sources to have checked them')
        return 2
    print(f'  lines examined: {lines}')
    print(f'  SIL 4 mentions, reported for a human read of "a band, a floor or a reason to redesign": {sil4}')
    print(f'  BREACHES: {len(hits)}')
    for h in hits[:40]:
        print(f'   {h[2].upper()} {h[0]}:{h[1]}  {h[3]}')
    if lines < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    dead = [e for e in EXEMPT if e not in EXEMPT_HIT]
    print(f'  exemptions declared: {len(EXEMPT)}, dead: {dead}')
    if '--plant' in sys.argv:
        planted = {h[2] for h in hits if h[3].startswith('A planted')}
        want = {'bare beta', 'bare PFD', 'severity', 'stray likelihood', 'risk reduction ratio'}
        print(f'  NEGATIVE CONTROL: expected {sorted(want)} caught; got {sorted(planted)}')
        return 1 if planted == want else 2
    if dead:
        print('  GATE FAILS: an exemption that clears nothing is a dead row')
        return 1
    return 1 if hits else 0


sys.exit(main())
