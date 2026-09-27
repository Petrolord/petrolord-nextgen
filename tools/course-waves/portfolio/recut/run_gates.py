#!/usr/bin/env python3
"""THE PORTFOLIO (EC5) RE-CUT GATES, in one run. Every gate prints what it examined.

Baseline = the served course: lessons at BASE (origin/main before the re-cut
branch) and the served rows (docs/ec45-recut/served/questions.json).
The copy rule is gated two ways: every changed lesson line and changed row must
carry no dash, no contrastive ("X, not Y", "rather than", ", never",
"instead of"), no digest section cite and no repair history; and the whole
course (every lesson, row and the capstone text) must carry no dash, no digest
section cite and no repair history. Contrastive hits the re-cut does not touch
are counted and reported.

    python3 run_gates.py            exit 0 only if every gate passes
"""
import glob, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(KIT, '..', '..', '..'))
BASE = os.environ.get('PF_BASE', '2e05030f9')
WK = '/root/dc-wavekit'
COURSE = os.path.join(REPO, 'src/content/courses/portfolio')
results = []


def sh(cmd, cwd=REPO, env=None):
    p = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, env={**os.environ, **(env or {})})
    return p.returncode, (p.stdout + p.stderr)


def gate(name, ok, detail):
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {detail}", flush=True)


def tail(s, n=1):
    return ' | '.join(l.strip() for l in s.strip().splitlines()[-n:])


# ---------------------------------------------------------------- baseline
base = tempfile.mkdtemp(prefix='pfbase.')
subprocess.run(f'git archive {BASE} src/content/courses/portfolio | tar -x -C {base}', cwd=REPO, shell=True, check=True)
BASEC = os.path.join(base, 'src/content/courses/portfolio')
lesson_files = sorted(glob.glob(f'{COURSE}/*/*/*.md')) + sorted(glob.glob(f'{COURSE}/*/manifest.json'))
changed_lines = {}
for p in lesson_files:
    rel = os.path.relpath(p, COURSE)
    bp = os.path.join(BASEC, rel)
    old = set(open(bp).read().splitlines()) if os.path.exists(bp) else set()
    new = [(i, l) for i, l in enumerate(open(p).read().splitlines(), 1) if l not in old]
    if new:
        changed_lines[rel] = new
served = [r for r in json.load(open(os.path.join(REPO, 'docs/ec45-recut/served/questions.json'))) if r['app_slug'] == 'portfolio']
after = json.load(open(os.path.join(REPO, 'docs/ec45-recut/portfolio_after.json')))
edits = json.load(open(os.path.join(REPO, 'docs/ec45-recut/portfolio_edits.json')))
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
gate('key truth negative control (--plant: every perturbed printed figure goes red)', rc == 0, tail(out))
rc, out = sh('node keytruth.mjs --plant-engine', cwd=HERE)
gate('key truth negative control (--plant-engine: every check moves under a planted engine defect, no self-comparisons)', rc == 0, tail(out))

# ---------------------------------------------------------------- 3 numsweep
rc, out = sh(f'node {WK}/numsweep.mjs {HERE}')
m = re.search(r'unresolved: (\d+)', out)
unres = [l for l in out.splitlines() if 'UNRESOLVED' in l]
gate('numsweep, lessons (every 7+ figure literal resolves to the digest or a golden)', rc == 0 and m and m.group(1) == '0',
     tail(out) + ('' if not unres else f' first: {unres[0].strip()}'))
rc, out = sh(f'node {WK}/numsweep.mjs {HERE} --banks {HERE}/banks')
m = re.search(r'unresolved: (\d+)', out)
unres = [l for l in out.splitlines() if 'UNRESOLVED' in l]
gate('numsweep, banks', rc == 0 and m and m.group(1) == '0', tail(out) + ('' if not unres else f' first: {unres[0].strip()}'))

# ---------------------------------------------------------------- 4 copy rule
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b', re.I)
SECTION = re.compile(r'\b[Ss]ection \d+')
HISTORY = re.compile(r'EC5-\d|EC4-\d|before the (audit|repair|fix)|was repaired|were repaired|\brepaired\b|\bthe repair\b|'
                     r'pre-audit|since engines?|engine used to|used to (read|report|hand|fund|charge|clamp|count|draw|round|name|say|be)|'
                     r'the engine now|\bno longer\b|\bretired\b|\bfinding [A-Z]?\d|\bnot repaired\b|old normal approximation|'
                     r'\bbefore EC5|\bafter EC5', re.I)
RULES = ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'digest section cited'), (HISTORY, 'repair history'))
new_hits = []
for rel, lines in changed_lines.items():
    for i, l in lines:
        for R, lab in RULES:
            if R.search(l):
                new_hits.append(f'{rel}:{i} {lab} "{R.search(l).group(0)}"')
for e in changed_rows:
    n, o = e['new'], e['old_post_w3']
    for f, a, b in [('prompt', o['prompt'], n['prompt']), ('explanation', o['explanation'], n['explanation'])] + \
                   [(f'option {i}', o['options'][i], n['options'][i]) for i in range(4)]:
        if a == b:
            continue
        for R, lab in RULES:
            if R.search(b):
                new_hits.append(f"{e['tier']} {e['scope']} {e['module_key']} {e['ord']} {f} {lab} \"{R.search(b).group(0)}\"")
hard_any, contrast_any = [], []
caps = [c for c in json.load(open(os.path.join(REPO, 'docs/ec45-recut/served/capstones.json'))) if c['app_slug'] == 'portfolio']
cap_new = {c['tier']: c for c in edits['capstones']}
texts = []
for p in lesson_files:
    for i, l in enumerate(open(p).read().splitlines(), 1):
        # a manifest "key" is an identifier (progress rows and bank locators hang on it), never shown to a learner
        if p.endswith('manifest.json') and re.match(r'\s*"key":', l):
            continue
        texts.append((f'{os.path.relpath(p, COURSE)}:{i}', l))
for r in after:
    for t in [r['prompt'], r['explanation']] + r['options']:
        texts.append((f"{r['tier']} {r['scope']} {r['module_key']} {r['ord']}", t))
for c in caps:
    ds = cap_new[c['tier']]['new']['dataset'] if c['tier'] in cap_new else c['dataset']
    for t in (c['title'], ds, c['prompt']):
        texts.append((f"capstone {c['tier']}", t))
for where, t in texts:
    if DASH.search(t) or SECTION.search(t) or HISTORY.search(t):
        hard_any.append(f'{where} "{(DASH.search(t) or SECTION.search(t) or HISTORY.search(t)).group(0)}"')
    if CONTRAST.search(t):
        contrast_any.append(where)
gate('copy rule on every changed line and row (no dash, no contrastive incl. "rather than", ", never", "instead of", no section cite, no repair history)',
     not new_hits, f'{len(new_hits)} hit(s)' + (f'; first: {new_hits[:4]}' if new_hits else ''))
gate('course-wide: no dash, no digest section cite, no repair history in any lesson, row or capstone text',
     not hard_any, f'{len(hard_any)} hit(s)' + (f'; first: {hard_any[:5]}' if hard_any else '')
     + f'; untouched contrastive hits reported: {len(contrast_any)}')

# ---------------------------------------------------------------- 5 lesson lengths
rc, out = sh('python3 lengths.py', cwd=HERE)
bad = [l.strip() for l in out.splitlines() if 'OUT OF BAND' in l]
gate('lesson lengths 420..560 prose words (none out of band; the served course has none)', not bad and rc == 0,
     f'{len(bad)} out of band' + (f': {bad[:4]}' if bad else ''))

# ---------------------------------------------------------------- 6 answer length
rc, out = sh(f'python3 {WK}/lengthtails.py {HERE}/banks --prefix ec5')
gate('lengthtails (no single length strategy above 40 percent on any bank)', rc == 0, tail(out))
rc, out = sh('python3 tools/answer-length-audit/audit.py --json docs/ec45-recut/portfolio_after.json --min-rows 396')
gate('answer-length audit on the after-state (rank band, with its negative control)', rc == 0, tail(out))

# ---------------------------------------------------------------- 7 dupaxes: no new pair
sb = tempfile.mkdtemp(prefix='pfserved.')
L = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
banks = {}
for q in sorted(served, key=lambda q: q['ord']):
    fn = f"ec5{L[q['tier']]}_{'exam' if q['scope'] == 'final' else q['module_key'].split('-')[0]}.json"
    banks.setdefault(fn, []).append({'prompt': q['prompt'], 'options': q['options'], 'answer': q['answer_index'], 'explanation': q['explanation']})
for fn, v in banks.items():
    json.dump(v, open(os.path.join(sb, fn), 'w'), indent=1, ensure_ascii=False)
pair = re.compile(r'^\s*([\d.]+)\s+(\S+)\s+(\S+)\s+(\S+ Q\d+) versus (\S+ Q\d+)')
def pairs(d):
    rc, out = sh(f'python3 {WK}/dupaxes.py {d} --prefix ec5')
    return {(m.group(4), m.group(5)) for m in map(pair.match, out.splitlines()) if m}, tail(out)
old_p, _ = pairs(sb)
new_p, t = pairs(HERE + '/banks')
fresh = sorted(new_p - old_p)
gate('dupaxes (no near-duplicate pair at Jaccard 0.45 that the served banks did not already have)', not fresh,
     f'{t}; new pairs: {fresh or "none"}')

# ---------------------------------------------------------------- 8 bank sources
rc, out = sh('python3 tools/course-banks/check-bank-sources.py portfolio')
gate('check-bank-sources portfolio (every committed .py reproduces its .json)', rc == 0, tail(out))

# ---------------------------------------------------------------- 9 capstones: fields unchanged
rc, out = sh(f'EC5_ENGINES={REPO}/packages/engines node --input-type=module -e "'
             f'const m=await import(\'{KIT}/ec5_fields.mjs\'); process.stdout.write(JSON.stringify(m.FIELDS))" 2>/dev/null')
try:
    engine_fields = json.loads(out.strip().splitlines()[-1])
except Exception:
    engine_fields = None
kit_fields = json.load(open(os.path.join(KIT, 'fields.json')))
served_fields = [[c['tier'], f['key'], f['expected'], f['tol']] for t in ('beginner', 'intermediate', 'advanced')
                 for c in caps if c['tier'] == t for f in c['fields']]
same = engine_fields is not None and json.dumps(engine_fields) == json.dumps(kit_fields) and \
    json.dumps(served_fields) == json.dumps(kit_fields) and all(
        json.dumps(x['fields']) == json.dumps(next(c for c in caps if c['tier'] == x['tier'])['fields']) for x in edits['capstones'])
gate('graded fields: the engine (ec5_fields.mjs), fields.json and the served capstones agree byte for byte; the capstone edit carries them unchanged',
     same, f'{len(kit_fields)} fields' + ('' if engine_fields is not None else f'; ec5_fields did not run: {tail(out, 2)}'))
rc, out = sh('git diff --quiet origin/main -- tools/course-waves/portfolio/fields.json tools/course-waves/portfolio/ec5_fields.mjs')
gate('fields.json and ec5_fields.mjs unchanged from origin/main', rc == 0, 'clean' if rc == 0 else 'differ')

# ---------------------------------------------------------------- 10 capstone leak
forms = {}
for t, k, x, tol in kit_fields:
    fs_ = {f'{x:.2f}', f'{x:,.2f}', f'{x:.6f}', f'{x:.4f}', f'{x:.3f}', f'{x:.5f}'}
    if abs(x) >= 1000:
        fs_ |= {f'{round(x):,}', f'{round(x)}'}
    forms[k] = {f for f in fs_ if len(f.replace(',', '').replace('.', '').strip('0-')) >= 5}
ltexts = [(os.path.relpath(p, REPO), open(p).read()) for p in lesson_files]
ltexts += [(f"row {r['tier']} {r['scope']} {r['module_key']} {r['ord']}", ' '.join([r['prompt'], r['explanation']] + r['options'])) for r in after]
ltexts += [(os.path.relpath(p, REPO), open(p).read()) for p in glob.glob(f'{REPO}/src/components/course/panels/portfolio/*.js*') if '.test.' not in p]
leaks = [f'{k} "{f}" in {name}' for name, txt in ltexts for k, fs_ in forms.items() for f in fs_ if re.search(r'(?<![\d.,])' + re.escape(f) + r'(?![\d])', txt)]
IDOHO = [r for r in after if 'IDOHO' in r['prompt'] + r['explanation'] + ''.join(r['options'])]
gate('capstone leak (no graded value at any printed rounding in lessons, rows or panels; no row names IDOHO)', not leaks and not IDOHO,
     f'{len(forms)} fields x {len(ltexts)} texts; {len(leaks)} leak(s)' + (f': {leaks[:3]}' if leaks else '')
     + f'; rows naming IDOHO: {len(IDOHO)}')

# ---------------------------------------------------------------- 11 wave inputs + vitest
rc, out = sh('node tools/course-waves/check-wave-inputs.mjs')
gate('check-wave-inputs (digest and fields pinned and spelled by committed generators)', rc == 0, tail(out))
rc, out = sh('npx vitest run src/components/course/panels/portfolio')
m = re.search(r'Tests\s+(.*)', out)
gate('vitest src/components/course/panels/portfolio (portfolioLab.test.js, percentileWords.test.jsx, panelCapstoneGuard)', rc == 0,
     m.group(1).strip() if m else tail(out, 3))

print()
failed = [n for n, ok, _ in results if not ok]
print(f'{len(results)} gates, {len(results) - len(failed)} pass, {len(failed)} fail')
sys.exit(1 if failed else 0)
