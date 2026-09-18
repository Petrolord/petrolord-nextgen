#!/usr/bin/env python3
"""WALK THE IMPORT CLOSURE of the FC8 metering, control valve and storage tank
family in the engines repository, then prove the vendored NextGen copy is
sha-identical PATH BY PATH.

Why a walker rather than a list. FC4's closure came out at TEN paths where four
were expected, because the repaired engine imported a validity band from a
second module which carried that module's golden, its oracle and its suite with
it. A list of files somebody expected is not a closure. This one starts from the
seeds, reads every ES import, every `export ... from`, every CommonJS require,
every dynamic import and every relative data-file read out of each file it
reaches, and keeps going until nothing new appears. It REFUSES if a seed is
missing, if an edge resolves to nothing, or if it resolved nothing at all.

FC8 IS THE FIRST WAVE IN THIS MODULE WITH THREE ENGINES AND TWO GOLDENS, and the
walk is what establishes that the family is ten paths rather than nine: the
tanksmetering suite imports TWO engines, so the metering and the storage tank
engines are one closure and not two. The recon said "nine paths plus three
Suite shims"; this re-walks it after FC8-0 rather than believing that.

THREE PROOFS, EACH INDEPENDENT OF THE OTHERS, per path:
  1. the git blob hash of the canonical file against the git blob hash of the
     vendored file, which is content addressing and knows nothing of the
     filesystem;
  2. an md5 of the two files on disk;
  3. a byte compare against the SUITE's own vendoring of the same repair, which
     is a third party that pulled the same commit through a different route
     (git subtree) on a different day.

    python3 vendor/closure.py [--json <out>]
"""
import json
import os
import re
import subprocess
import sys

ENGINES = os.environ.get('FC8_ENGINES_REPO', '/root/petrolord-engines')
VENDOR = os.environ.get('FC8_VENDOR', '/root/wt-fc8-nextgen/packages/engines')
# The Suite vendored the same engines commit through git subtree in its own PR.
# It is a THIRD ROUTE to the same bytes, not a second copy of ours.
SUITE = os.environ.get('FC8_SUITE', '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-suite')
SUITE_REF = os.environ.get('FC8_SUITE_REF', 'e63ed83bc')
WAVE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SEEDS = [
    'engines/facilities/metering.js',
    'engines/facilities/controlValve.js',
    'engines/facilities/storageTank.js',
    'test-data/facilities/goldens/tanksmetering_cases.json',
    'test-data/facilities/goldens/controlvalve_cases.json',
    '__tests__/facilities.tanksmetering.test.js',
    '__tests__/facilities.controlvalve.test.js',
    'tools/validation/facilities/oracle_tanksmetering.py',
    'tools/validation/facilities/oracle_controlvalve.py',
    'tools/validation/facilities/FINDINGS-metering.md',
]

IMP = re.compile(r"""(?:^|\n)\s*(?:import\s+(?:[\w*{}\s,]+\s+from\s+)?|export\s+[\w*{}\s,]+\s+from\s+)['"]([^'"]+)['"]""")
REQ = re.compile(r"""require\(\s*['"]([^'"]+)['"]\s*\)""")
DYN = re.compile(r"""import\(\s*[`'"]([^`'"$]+)[`'"]\s*\)""")
JOIN = re.compile(r"""path\.join\(\s*__dirname\s*,\s*((?:['"][^'"]+['"]\s*,?\s*)+)\)""")
PYJOIN = re.compile(r"""os\.path\.join\(\s*here\s*,\s*((?:"[^"]+"\s*,?\s*)+)\)""")


def read(rel):
    with open(os.path.join(ENGINES, rel), encoding='utf8', errors='replace') as fh:
        return fh.read()


def resolve(base_rel, spec):
    if not spec.startswith('.'):
        return None                      # a bare package name: not in this repo
    cand = os.path.normpath(os.path.join(os.path.dirname(base_rel), spec))
    for c in (cand, cand + '.js', os.path.join(cand, 'index.js')):
        if os.path.isfile(os.path.join(ENGINES, c)):
            return c
    raise SystemExit(f'CLOSURE REFUSES: {base_rel} imports {spec}, which resolves '
                     f'to nothing in {ENGINES}')


def data_edges(rel, src):
    """Relative data reads. A golden reached through path.join(__dirname, ...) or
    os.path.join(here, ...) is an edge exactly as an import is, and it is the
    edge that ties a suite and an oracle to the same published file."""
    out = []
    for m in list(JOIN.finditer(src)) + list(PYJOIN.finditer(src)):
        parts = re.findall(r"""['"]([^'"]+)['"]""", m.group(1))
        cand = os.path.normpath(os.path.join(os.path.dirname(rel), *parts))
        if os.path.isfile(os.path.join(ENGINES, cand)):
            out.append(cand)
    return out


def sh(args):
    return subprocess.run(args, capture_output=True, text=True)


def main():
    missing = [s for s in SEEDS if not os.path.isfile(os.path.join(ENGINES, s))]
    if missing:
        raise SystemExit(f'CLOSURE REFUSES: seed path(s) absent from the engines repo: {missing}')

    seen, queue, edges = set(), list(SEEDS), []
    while queue:
        rel = queue.pop(0)
        if rel in seen:
            continue
        seen.add(rel)
        if rel.endswith(('.json', '.md')):
            continue
        src = read(rel)
        found = set()
        for pat in (IMP, REQ, DYN):
            for m in pat.finditer(src):
                r = resolve(rel, m.group(1))
                if r:
                    found.add(r)
        for d in data_edges(rel, src):
            found.add(d)
        for f in sorted(found):
            edges.append((rel, f))
            if f not in seen:
                queue.append(f)

    closure = sorted(seen)
    if not closure:
        raise SystemExit('CLOSURE REFUSES: resolved nothing at all')
    if not edges:
        raise SystemExit('CLOSURE REFUSES: it walked no edge at all, which on a '
                         'family of two suites and two goldens cannot be right')

    head = sh(['git', '-C', ENGINES, 'rev-parse', 'HEAD']).stdout.strip()
    print(f'engines HEAD {head[:7]}  seeds {len(SEEDS)}  CLOSURE {len(closure)} path(s)')
    print(f'import/read edges walked: {len(edges)}')
    for a, b in edges:
        print(f'   {a} -> {b}')

    rows, bad, suite_checked = [], [], 0
    for rel in closure:
        can = sh(['git', '-C', ENGINES, 'rev-parse', f'HEAD:{rel}'])
        canonical = can.stdout.strip() if can.returncode == 0 else 'NOT-TRACKED'
        vp = os.path.join(VENDOR, rel)
        if os.path.isfile(vp):
            vend = sh(['git', 'hash-object', vp]).stdout.strip()
            md5v = sh(['md5sum', vp]).stdout.split()[0]
        else:
            vend, md5v = 'ABSENT', 'ABSENT'
        md5c = sh(['md5sum', os.path.join(ENGINES, rel)]).stdout.split()[0]
        # THE THIRD ROUTE. The Suite vendored the same engines commit by subtree.
        # A path it does not carry (the repair record) is reported as such rather
        # than counted as agreement.
        sref = sh(['git', '-C', SUITE, 'rev-parse', f'{SUITE_REF}:packages/engines/{rel}'])
        if sref.returncode == 0:
            suite_blob = sref.stdout.strip()
            suite_checked += 1
        else:
            suite_blob = 'NOT-IN-SUITE'
        same = canonical == vend and md5c == md5v
        if suite_blob not in ('NOT-IN-SUITE',) and suite_blob != canonical:
            same = False
        rows.append({'path': rel, 'canonicalBlob': canonical, 'vendoredBlob': vend,
                     'canonicalMd5': md5c, 'vendoredMd5': md5v,
                     'suiteBlob': suite_blob, 'identical': same})
        if not same:
            bad.append(rel)
        print(f"{'OK  ' if same else 'DIFF'} blob {canonical[:12]} {vend[:12]}  "
              f"md5 {md5c[:12]} {md5v[:12]}  suite {suite_blob[:12]}  {rel}")

    out = os.path.join(WAVE, 'vendor', 'closure.json')
    if '--json' in sys.argv:
        out = sys.argv[sys.argv.index('--json') + 1]
    json.dump({'enginesHead': head, 'suiteRef': SUITE_REF,
               'closure': rows, 'edges': edges},
              open(out, 'w'), indent=1)
    print(f'\n{len(closure) - len(bad)} of {len(closure)} closure paths are SHA-IDENTICAL '
          f'with engines {head[:7]}')
    print(f'of those, {suite_checked} were ALSO byte-compared against the Suite\'s own '
          f'subtree vendoring at {SUITE_REF}, which is a third route to the same bytes')
    if suite_checked < 9:
        print('CLOSURE REFUSES: the third route checked too few paths to be a proof')
        return 2
    if bad:
        print('NOT identical: ' + ', '.join(bad))
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
