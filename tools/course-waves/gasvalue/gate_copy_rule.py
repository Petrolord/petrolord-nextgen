#!/usr/bin/env python3
"""GATE: the owner copy rule over everything a learner or a writer reads in this
wave that the kit's digestprose does not already sweep.

No em dash, no en dash, and no "X, not Y" contrastive, in: the task files and
tier headers, the three draft capstone prompts, every module and lesson title in
structure.py, the three tier manifests and the 78 placeholder lessons in the
worktree. The digest itself is swept by digestprose.mjs. No engine string this
wave quotes carries the contrastive, so nothing is exempt but the rule's own
name, "X, not Y", where the task files state it.

Negative control: --plant adds one em dash and one contrastive to the swept
text and the gate must name both.
"""
import glob, json, os, re, sys
W = os.path.dirname(os.path.abspath(__file__))
REPO = '/root/wt-et-gasvalue-nextgen/src/content/courses/gasvalue'
# No engine string this wave quotes breaks the copy rule, so nothing is exempt
# but the rule's own name where the task files state it.
ENGINE_VERBATIM = None
CONTRAST = re.compile(r"\b\w+, not (a |an |the )?\w+", re.I)

def texts():
    for f in ['LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md', 'hdr_beginner.txt', 'hdr_intermediate.txt', 'hdr_advanced.txt']:
        yield f, open(os.path.join(W, f), encoding='utf-8').read()
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    for t, v in cap['tiers'].items():
        yield f'capstone.json {t} prompt', v['prompt']
    sys.path.insert(0, W)
    from structure import TIERS
    yield 'structure.py titles', '\n'.join([m[1] for mods in TIERS.values() for m in mods] + [l[1] for mods in TIERS.values() for m in mods for l in m[2]])
    for p in sorted(glob.glob(os.path.join(REPO, '*', 'manifest.json')) + glob.glob(os.path.join(REPO, '*', '*', '*.md'))):
        yield os.path.relpath(p, REPO), open(p, encoding='utf-8').read()

def main():
    bad, n, lines = [], 0, 0
    items = list(texts())
    if '--plant' in sys.argv:
        items.append(('planted', 'The flare is counted by the mole — never guessed.\nThe flare is counted by the mole, not guessed.'))
    for name, text in items:
        n += 1
        for i, line in enumerate(text.split('\n'), 1):
            lines += 1
            if '\u2014' in line or '\u2013' in line:
                bad.append(f'{name}:{i} dash: {line.strip()[:100]}')
        # A contrastive can wrap across a line break, so it is read per
        # paragraph with the lines joined. One thing is exempt BY TEXT: the
        # rule's own name, "X, not Y", where the task files state the rule.
        for para in re.split(r'\n\s*\n', text):
            flat = re.sub(r'\s+', ' ', para)
            probe = flat.replace('"X, not Y"', '')
            m = CONTRAST.search(probe)
            if m:
                bad.append(f'{name} contrastive: ...{probe[max(0, m.start() - 40):m.end() + 20]}...')
    print(f'  texts swept: {n}; lines: {lines}')
    for b in bad:
        print(f'  VIOLATION {b}')
    if n < 80:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  violations: {len(bad)}')
    return 1 if bad else 0

sys.exit(main())
