#!/usr/bin/env python3
"""THE CASHFLOW PIA RE-CUT GATES, in one run. Every gate prints what it examined.

Baseline = the served course: lessons at BASE (origin/main before the re-cut
branch) and the served rows (docs/pia-recut/served/cashflow_questions.json).
Rules that the served course already breaks in text this re-cut does not touch
(the "X, not Y" contrastive regex, dupaxes pairs, out-of-band lesson lengths)
are gated as NO NEW HIT: every hit in a changed lesson line or a changed row
fails, and the untouched hits are counted and reported.

    python3 run_gates.py            exit 0 only if every gate passes
"""
import glob, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(KIT, '..', '..', '..'))
BASE = os.environ.get('CF_BASE', '08f17b61d')
WK = '/root/dc-wavekit'
COURSE = os.path.join(REPO, 'src/content/courses/cashflow')
results = []


def sh(cmd, cwd=REPO, env=None):
    p = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, env={**os.environ, **(env or {})})
    return p.returncode, (p.stdout + p.stderr)


def gate(name, ok, detail):
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {detail}")


def tail(s, n=1):
    return ' | '.join(l.strip() for l in s.strip().splitlines()[-n:])


# ---------------------------------------------------------------- baseline
base = tempfile.mkdtemp(prefix='cfbase.')
subprocess.run(f'git archive {BASE} src/content/courses/cashflow | tar -x -C {base}', cwd=REPO, shell=True, check=True)
BASEC = os.path.join(base, 'src/content/courses/cashflow')
lesson_files = sorted(glob.glob(f'{COURSE}/*/*/*.md')) + sorted(glob.glob(f'{COURSE}/*/manifest.json'))
changed_lines = {}
for p in lesson_files:
    rel = os.path.relpath(p, COURSE)
    bp = os.path.join(BASEC, rel)
    old = set(open(bp).read().splitlines()) if os.path.exists(bp) else set()
    new = [(i, l) for i, l in enumerate(open(p).read().splitlines(), 1) if l not in old]
    if new:
        changed_lines[rel] = new
served = json.load(open(os.path.join(REPO, 'docs/pia-recut/served/cashflow_questions.json')))
after = json.load(open(os.path.join(REPO, 'docs/pia-recut/cashflow_after.json')))
edits = json.load(open(os.path.join(REPO, 'docs/pia-recut/cashflow_edits.json')))
changed_rows = edits['questions']
print(f'examined: {len(lesson_files)} lesson/manifest files, {len(changed_lines)} changed '
      f'({sum(len(v) for v in changed_lines.values())} changed lines); {len(after)} rows, {len(changed_rows)} changed\n')

# ---------------------------------------------------------------- 1 build
rc, out = sh('python3 build.py --check', cwd=HERE)
gate('build --check (banks, pairs, after-state and edits reproduce from the rows)', rc == 0, tail(out))

# ---------------------------------------------------------------- 2 key truth
rc, out = sh('node keytruth.mjs', cwd=HERE)
gate('key truth by engine call', rc == 0, tail(out))
rc, out = sh('node keytruth.mjs --plant', cwd=HERE)
gate('key truth negative control (--plant)', rc == 0, tail(out))

# ---------------------------------------------------------------- 3 numsweep
rc, out = sh(f'node {WK}/numsweep.mjs {HERE}')
m = re.search(r'unresolved: (\d+)', out)
gate('numsweep, lessons (every 7+ figure literal resolves to the digest or a golden)', rc == 0 and m and m.group(1) == '0',
     tail(out))
rc, out = sh(f'node {WK}/numsweep.mjs {HERE} --banks {HERE}/banks')
m = re.search(r'unresolved: (\d+)', out)
unres = [l for l in out.splitlines() if 'UNRESOLVED' in l]
gate('numsweep, banks', rc == 0 and m and m.group(1) == '0', tail(out) + ('' if not unres else f' first: {unres[0].strip()}'))

# ---------------------------------------------------------------- 4 copy rule + no section cites + no repair history
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w')
SECTION = re.compile(r'\b[Ss]ection \d+')
HISTORY = re.compile(r'since engines?|engine used to|3\.10\.0|3\.9\.0|before the (audit|repair)|was repaired|pre-audit|'
                     r'2026-09-15|used to (report|hand|lose|travel|stand|name|do)|the engine now|no longer (hides|reports|scales)', re.I)
new_hits, old_hits = [], 0
for rel, lines in changed_lines.items():
    for i, l in lines:
        for R, lab in ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'digest section cited'), (HISTORY, 'repair history')):
            if R.search(l):
                new_hits.append(f'{rel}:{i} {lab} "{R.search(l).group(0)}"')
for e in changed_rows:
    n, o = e['new'], e['old']
    for f, a, b in [('prompt', o['prompt'], n['prompt']), ('explanation', o['explanation'], n['explanation'])] + \
                   [(f'option {i}', o['options'][i], n['options'][i]) for i in range(4)]:
        if a == b:
            continue
        for R, lab in ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'digest section cited'), (HISTORY, 'repair history')):
            if R.search(b):
                new_hits.append(f"{e['tier']} {e['scope']} {e['module_key']} {e['ord']} {f} {lab} \"{R.search(b).group(0)}\"")
# history and section cites anywhere (L5 is in scope for the whole course)
hist_any = []
for p in lesson_files:
    for i, l in enumerate(open(p).read().splitlines(), 1):
        if HISTORY.search(l) or SECTION.search(l) or DASH.search(l) or CONTRAST.search(l):
            hist_any.append(f'{os.path.relpath(p, COURSE)}:{i}')
for r in after:
    for t in [r['prompt'], r['explanation']] + r['options']:
        if HISTORY.search(t) or SECTION.search(t) or DASH.search(t) or CONTRAST.search(t):
            hist_any.append(f"{r['tier']} {r['scope']} {r['module_key']} {r['ord']}")
for c in json.load(open(os.path.join(KIT, 'capstones.json'))):
    for t in (c['title'], c['dataset'], c['prompt']):
        if HISTORY.search(t) or SECTION.search(t) or DASH.search(t) or CONTRAST.search(t):
            hist_any.append(f"capstone {c['tier']}")
gate('copy rule on every changed line and row (no dash, no contrastive, no section cite, no repair history)',
     not new_hits, f'{len(new_hits)} hit(s)' + (f'; first: {new_hits[:3]}' if new_hits else ''))
gate('course-wide copy rule: no dash, no "X, not Y" contrastive, no digest section cite, no repair history (L5) in any lesson, row or capstone',
     not hist_any, f'{len(hist_any)} hit(s)' + (f'; first: {hist_any[:5]}' if hist_any else ''))

# ---------------------------------------------------------------- 5 lesson lengths
rc, out = sh('python3 lengths.py', cwd=HERE)
bad = [l.strip() for l in out.splitlines() if 'OUT OF BAND' in l]
tiers_out = {}
cur = None
for l in out.splitlines():
    if l.endswith('written'):
        cur = l.split(':')[0]
    elif 'OUT OF BAND' in l:
        tiers_out.setdefault(cur, []).append(l.split()[2])
BASE_OUT = {'beginner': {'m01-what-a-cash-flow-is/l02-what-this-engine-models', 'm04-the-joint-venture-cascade/l02-depreciation-is-not-a-cash-flow',
                         'm03-prices/l03-differentials-and-scales', 'm06-the-associate-reading/l02-working-the-capstone'},
            'intermediate': {'m02-real-and-nominal/l01-inflation-in-the-ledger', 'm01-why-time-matters/l03-end-year-and-mid-year',
                             'm02-real-and-nominal/l04-the-valuation-year'}}
new_out = [f'{t}/{x}' for t, xs in tiers_out.items() for x in xs if x not in BASE_OUT.get(t, set())]
gate('lesson lengths 420..560 prose words (no lesson newly out of band; 7 pre-existing Associate/Professional)',
     not new_out, f'{len(bad)} out of band, new: {new_out or "none"}')

# ---------------------------------------------------------------- 6 answer length
rc, out = sh(f'python3 {WK}/lengthtails.py {HERE}/banks --prefix ec1')
gate('lengthtails (no single length strategy above 40 percent on any bank)', rc == 0, tail(out))
rc, out = sh('python3 tools/answer-length-audit/audit.py --json docs/pia-recut/cashflow_after.json --min-rows 396')
gate('answer-length audit on the after-state (rank band 12..40 percent, with its negative control)', rc == 0, tail(out))

# ---------------------------------------------------------------- 7 dupaxes: no new pair
sb = tempfile.mkdtemp(prefix='cfserved.')
L = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
banks = {}
for q in sorted(served, key=lambda q: q['ord']):
    fn = f"ec1{L[q['tier']]}_{'exam' if q['scope'] == 'final' else q['module_key'].split('-')[0]}.json"
    banks.setdefault(fn, []).append({'prompt': q['prompt'], 'options': q['options'], 'answer': q['answer_index'], 'explanation': q['explanation']})
for fn, v in banks.items():
    json.dump(v, open(os.path.join(sb, fn), 'w'), indent=1, ensure_ascii=False)
pair = re.compile(r'^\s*([\d.]+)\s+(\S+)\s+(\S+)\s+(\S+ Q\d+) versus (\S+ Q\d+)')
def pairs(d):
    rc, out = sh(f'python3 {WK}/dupaxes.py {d} --prefix ec1')
    return {(m.group(4), m.group(5)) for m in map(pair.match, out.splitlines()) if m}, tail(out)
old_p, _ = pairs(sb)
new_p, t = pairs(HERE + '/banks')
fresh = sorted(new_p - old_p)
gate('dupaxes (no near-duplicate pair at Jaccard 0.45 that the served banks did not already have)', not fresh,
     f'{t}; new pairs: {fresh or "none"}')

# ---------------------------------------------------------------- 8 bank sources
rc, out = sh('python3 tools/course-banks/check-bank-sources.py cashflow')
gate('check-bank-sources cashflow (every committed .py reproduces its .json)', rc == 0, tail(out))

# ---------------------------------------------------------------- 9 capstone
rc, out = sh('node discriminate_expert.mjs', cwd=KIT)
gate('discriminate_expert (one right answer; no field depends on the stated new-PML rate; L3 field moved by two methods)', rc == 0, tail(out))
rc, out = sh('node ec1_capstone.mjs --check ../../../docs/pia-recut/served/cashflow_capstones.json', cwd=KIT)
gate('capstone prompts rendered by the kit; Associate byte-identical, Professional fields byte-identical to served', rc == 0, tail(out))
rc, out = sh('git diff --quiet -- tools/course-waves/cashflow/capstones.json tools/course-waves/cashflow/fields.json')
gate('capstones.json and fields.json as committed after the regeneration', rc == 0, 'clean' if rc == 0 else 'regenerated files differ from the committed ones')

# ---------------------------------------------------------------- 10 capstone leak
fields = json.load(open(os.path.join(KIT, 'fields.json')))
forms = {}
for t, k, x, tol in fields:
    fs = {f'{x:.2f}', f'{x:,.2f}', f'{x:.6f}', f'{x:.4f}'}
    if abs(x) >= 1000:
        fs |= {f'{round(x):,}', f'{round(x)}'}
    forms[k] = {f for f in fs if len(f.replace(',', '').replace('.', '').strip('0-')) >= 5}
texts = [(os.path.relpath(p, REPO), open(p).read()) for p in lesson_files]
texts += [(f"row {r['tier']} {r['scope']} {r['module_key']} {r['ord']}", ' '.join([r['prompt'], r['explanation']] + r['options'])) for r in after]
texts += [(os.path.relpath(p, REPO), open(p).read()) for p in glob.glob(f'{REPO}/src/components/course/panels/cashflow/*.jsx')]
leaks = [f'{k} "{f}" in {name}' for name, txt in texts for k, fs in forms.items() for f in fs if re.search(r'(?<![\d.,])' + re.escape(f) + r'(?![\d])', txt)]
IKPOTO = [r for r in after if 'IKPOTO' in r['prompt'] + r['explanation'] + ''.join(r['options'])]
gate('capstone leak (no graded value at any printed rounding in lessons, rows or panels)', not leaks,
     f'{len(forms)} fields x {len(texts)} texts; {len(leaks)} leak(s)' + (f': {leaks[:3]}' if leaks else '')
     + f'; rows naming IKPOTO: {len(IKPOTO)}')

# ---------------------------------------------------------------- 11 wave inputs + vitest
rc, out = sh('node tools/course-waves/check-wave-inputs.mjs')
gate('check-wave-inputs (digest and fields pinned and spelled by committed generators)', rc == 0, tail(out))
rc, out = sh('npx vitest run src/components/course/panels/cashflow')
m = re.search(r'Tests\s+(.*)', out)
gate('vitest src/components/course/panels/cashflow', rc == 0, m.group(1).strip() if m else tail(out, 3))

print()
failed = [n for n, ok, _ in results if not ok]
print(f'{len(results)} gates, {len(results) - len(failed)} pass, {len(failed)} fail')
sys.exit(1 if failed else 0)
