#!/usr/bin/env python3
"""THE EC1 MID-YEAR RECUT GATES, in one run. Every gate prints what it examined.

Baseline = the served course: lessons and banks at BASE (nextgen origin/main
d2f15b28f, which the read-only production dump of 2026-10-14 matched on every
one of the 396 cashflow rows). Rules the served course already breaks in text
this recut does not touch are gated as NO NEW HIT on changed lines and rows.

    python3 run_gates.py            exit 0 only if every gate passes

Needs the wave kit at /root/dc-wavekit (numsweep, harvest_digest, lengthtails)
and the repository's node_modules (esbuild, vitest).
"""
import glob, json, os, re, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(KIT, '..', '..', '..'))
BASE = os.environ.get('MY_BASE', 'd2f15b28f19aca34984943eef988694f59a2c052')
WK = os.environ.get('WAVEKIT', '/root/dc-wavekit')
COURSE = os.path.join(REPO, 'src/content/courses/cashflow')
TIERS = ('beginner', 'intermediate', 'advanced')
results = []


def sh(cmd, cwd=REPO, env=None):
    p = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, env={**os.environ, **(env or {})})
    return p.returncode, (p.stdout + p.stderr)


def gate(name, ok, detail):
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {detail}")


def tail(s, n=1):
    return ' | '.join(l.strip() for l in s.strip().splitlines()[-n:])


tmp = tempfile.mkdtemp(prefix='ec1mid.')
subprocess.run(f'git archive {BASE} src/content/courses/cashflow packages/engines | tar -x -C {tmp}', cwd=REPO, shell=True, check=True)
os.symlink(os.path.join(REPO, 'node_modules'), os.path.join(tmp, 'node_modules'))
BASEC = os.path.join(tmp, 'src/content/courses/cashflow')
lesson_files = sorted(glob.glob(f'{COURSE}/*/*/*.md'))
changed_lines = {}
for p in lesson_files:
    rel = os.path.relpath(p, COURSE)
    bp = os.path.join(BASEC, rel)
    old = set(open(bp).read().splitlines()) if os.path.exists(bp) else set()
    new = [(i, l) for i, l in enumerate(open(p).read().splitlines(), 1) if l not in old]
    if new:
        changed_lines[rel] = new
edits = json.load(open(os.path.join(HERE, 'edits.json')))
rows = edits['questions']
print(f'examined: {len(lesson_files)} lesson files, {len(changed_lines)} changed '
      f'({sum(len(v) for v in changed_lines.values())} changed lines); {len(rows)} changed rows, {len(edits["capstones"])} capstone\n')
if not lesson_files or not rows:
    print('REFUSED: nothing to examine'); sys.exit(2)

# ---------------------------------------------------------------- 1 the kit reproduces
scr = os.path.join(tmp, 'kit')
shutil.copytree(KIT, scr, ignore=shutil.ignore_patterns('scratch', 'midyear-recut', 'pia-recut'))
env = {'EC1_WAVE_DIR': scr, 'EC1_ENGINES': os.path.join(REPO, 'packages/engines'), 'EC1_REPO': REPO}
rc, out = sh('sh ./build_digest.sh > digest.tmp && mv digest.tmp digest.txt && node ./ec1_fields.mjs > /dev/null && node ./ec1_capstone.mjs', cwd=scr, env=env)
same = [f for f in ('digest.txt', 'fields.json', 'capstones.json') if rc == 0 and open(os.path.join(scr, f)).read() == open(os.path.join(KIT, f)).read()]
gate('digest, fields and capstones rebuild byte-identical from the engine', rc == 0 and len(same) == 3, f'{same} identical' + ('' if rc == 0 else ' ' + tail(out, 2)))
rc, out = sh('python3 build_edits.py --check', cwd=HERE)
gate('edits.json reproduces from git (BASE banks and capstones against the working tree)', rc == 0, tail(out))

# ---------------------------------------------------------------- 2 key truth
rc, out = sh('node keytruth.mjs', cwd=HERE)
gate('key truth by engine call (every changed row and the graded mid-year field)', rc == 0, tail(out))
rc, out = sh('node keytruth.mjs --plant', cwd=HERE)
gate('key truth negative control --plant', rc == 0, tail(out))
rc, out = sh('node keytruth.mjs --old-engine', cwd=HERE, env={'EC1_ENGINES': os.path.join(tmp, 'packages/engines')})
gate('key truth negative control --old-engine (the 3.12.0 engine must fail every new figure and claim)', rc == 0, tail(out))
sh('node -e 1', cwd=HERE)  # the next import rebuilds the bundle from the current engine
rc, out = sh('node keytruth.mjs', cwd=HERE)

# ---------------------------------------------------------------- 3 numsweep
wave = os.path.join(tmp, 'wave')
os.makedirs(os.path.join(wave, 'banks'))
json.dump({'slug': 'cashflow', 'prefix': 'ec1', 'name': 'Cash Flow & NPV', 'repo': REPO,
           'goldens': ['economics/goldens/cashflow_cases.json'],
           'constants': {'365': 'days per year', '366': 'days in a leap year', '6': 'Mscf of gas per barrel of oil equivalent', '100': 'percent'}},
          open(os.path.join(wave, 'wave.json'), 'w'))
shutil.copy(os.path.join(KIT, 'digest.txt'), os.path.join(wave, 'digest.txt'))
for t in TIERS:
    for f in glob.glob(os.path.join(REPO, 'tools/course-banks/cashflow', t, '*.json')):
        shutil.copy(f, os.path.join(wave, 'banks'))
rc, out = sh(f'python3 {WK}/harvest_digest.py {wave}')
rc, out = sh(f'node {WK}/numsweep.mjs {wave}')
m = re.search(r'unresolved: (\d+)', out)
gate('numsweep, lessons (every 7+ figure literal resolves to the rebuilt digest or a golden)', rc == 0 and m and m.group(1) == '0', tail(out))
rc, out = sh(f'node {WK}/numsweep.mjs {wave} --banks {wave}/banks')
m = re.search(r'unresolved: (\d+)', out)
unres = [l for l in out.splitlines() if 'UNRESOLVED' in l]
gate('numsweep, banks', rc == 0 and m and m.group(1) == '0', tail(out) + ('' if not unres else f' first: {unres[0].strip()}'))

# ---------------------------------------------------------------- 4 stale figures
STALE = ['69159247.46', '70188970.32', '115486897.55', '20586124.09', '11918282.37', '32504406.45', '212070544.45',
         '233779309.33', '20030970.83', '27516936.57', '16362392.88', '117206400.04', '16606015.11']
texts = [(os.path.relpath(p, REPO), open(p).read()) for p in lesson_files]
for t in TIERS:
    for f in glob.glob(os.path.join(REPO, 'tools/course-banks/cashflow', t, '*.json')):
        texts.append((os.path.relpath(f, REPO), open(f).read()))
texts += [(os.path.relpath(p, REPO), open(p).read()) for p in glob.glob(f'{REPO}/src/components/course/panels/cashflow/*.js*')]
texts += [('capstones.json', open(os.path.join(KIT, 'capstones.json')).read()), ('src/pages/apps/CashflowLearningPage.jsx', open(f'{REPO}/src/pages/apps/CashflowLearningPage.jsx').read())]
stale = [f'{n}: {s}' for n, t in texts for s in STALE if s in t]
gate('no old mid-year figure left in any lesson, bank, panel, page or capstone', not stale, f'{len(STALE)} figures x {len(texts)} texts; {len(stale)} hit(s)' + (f': {stale[:3]}' if stale else ''))
OLDRULE = re.compile(r'(?i)(divided|division) by the square root|mid-?year[^.]*\b(shrinks?|lower|cheaper|toward zero|adds? (one )?half|adding a half)')
oldrule = [f'{n}' for n, t in texts for _ in [0] if OLDRULE.search(t)]
gate('no statement of the old convention (mid-year divides, shrinks, adds a half)', not oldrule, f'{len(oldrule)} hit(s)' + (f': {oldrule[:3]}' if oldrule else ''))

# ---------------------------------------------------------------- 5 copy rule
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w')
SECTION = re.compile(r'\b[Ss]ection \d+')
HISTORY = re.compile(r'since engines?|engine used to|before the (audit|repair|recut)|was repaired|pre-audit|used to (report|divide|discount)|the engine now|no longer', re.I)
hits = []
for rel, lines in changed_lines.items():
    for i, l in lines:
        for R, lab in ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'section cite'), (HISTORY, 'repair history')):
            if R.search(l):
                hits.append(f'{rel}:{i} {lab}')
for e in rows:
    n, o = e['new'], e['old']
    for f, a, b in [('prompt', o['prompt'], n['prompt']), ('explanation', o['explanation'], n['explanation'])] + \
                   [(f'option {i}', o['options'][i], n['options'][i]) for i in range(4)]:
        if a != b:
            for R, lab in ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'section cite'), (HISTORY, 'repair history')):
                if R.search(b):
                    hits.append(f"{e['bank']} Q{e['ord']} {f} {lab}")
cap = edits['capstones'][0]
for R, lab in ((DASH, 'dash'), (CONTRAST, 'contrastive'), (SECTION, 'section cite'), (HISTORY, 'repair history')):
    if R.search(cap['new']['prompt']):
        hits.append(f'capstone prompt {lab}')
for rel in ('src/components/course/panels/cashflow/TimeExplorer.jsx',):
    d = subprocess.run(['git', 'diff', BASE, '--', rel], cwd=REPO, capture_output=True, text=True).stdout
    for l in d.splitlines():
        if l.startswith('+') and not l.startswith('+++') and (DASH.search(l) or CONTRAST.search(l)):
            hits.append(f'{rel} added line')
gate('copy rule on every changed line, row, panel line and the capstone prompt (no dash, no "X, not Y", no section cite, no repair history)',
     not hits, f'{len(hits)} hit(s)' + (f': {hits[:4]}' if hits else ''))

# ---------------------------------------------------------------- 6 lesson lengths
def lengths(root):
    out = {}
    for t in TIERS:
        man = json.load(open(os.path.join(root, t, 'manifest.json')))
        for m in man['modules']:
            for l in m['lessons']:
                p = os.path.join(root, t, m['key'], l['key'] + '.md')
                txt = open(p).read()
                if txt.startswith('---'):
                    txt = txt.split('---', 2)[2]
                body = [ln for ln in txt.splitlines() if not ln.startswith('|') and not ln.startswith('{{panel')]
                out[f"{t}/{m['key']}/{l['key']}"] = len(' '.join(body).split())
    return out
now, was = lengths(COURSE), lengths(BASEC)
new_out = [f'{k} {w}' for k, w in now.items() if not 420 <= w <= 560 and 420 <= was[k] <= 560]
changed_len = {k: (was[k], now[k]) for k in now if now[k] != was[k]}
gate('lesson lengths 420..560 prose words (no lesson newly out of band)', not new_out,
     f'{len(now)} lessons, {len(changed_len)} changed in length {changed_len}; newly out: {new_out or "none"}')

# ---------------------------------------------------------------- 7 answer length
rc, out = sh(f'python3 {WK}/lengthtails.py {wave}/banks --prefix ec1')
gate('lengthtails (no single length strategy above 40 percent on any bank)', rc == 0, tail(out))
after = []
for t in TIERS:
    man = {m['key'].split('-')[0]: m['key'] for m in json.load(open(os.path.join(COURSE, t, 'manifest.json')))['modules']}
    for f in sorted(glob.glob(os.path.join(REPO, 'tools/course-banks/cashflow', t, '*.json'))):
        bank = os.path.basename(f)[:-5].split('_')[1]
        for i, q in enumerate(json.load(open(f)), 1):
            after.append({'app_slug': 'cashflow', 'tier': t, 'scope': 'final' if bank == 'exam' else 'module',
                          'module_key': None if bank == 'exam' else man[bank], 'ord': i, 'prompt': q['prompt'],
                          'options': q['options'], 'answer_index': q['answer'], 'explanation': q['explanation']})
ap = os.path.join(tmp, 'after.json'); json.dump(after, open(ap, 'w'))
rc, out = sh(f'python3 tools/answer-length-audit/audit.py --json {ap} --min-rows 396')
gate('answer-length audit on the after-state, 396 rows (rank band 12..40 percent, with its negative control)', rc == 0, tail(out))

# ---------------------------------------------------------------- 8 bank sources
rc, out = sh('python3 tools/course-banks/check-bank-sources.py cashflow')
gate('check-bank-sources cashflow (every committed .py reproduces its .json)', rc == 0, tail(out))

# ---------------------------------------------------------------- 9 capstone leak
fields = json.load(open(os.path.join(KIT, 'fields.json')))
forms = {}
for t, k, x, tol in fields:
    fs = {f'{x:.2f}', f'{x:,.2f}', f'{x:.6f}', f'{x:.4f}'}
    if abs(x) >= 1000:
        fs |= {f'{round(x):,}', f'{round(x)}'}
    forms[k] = {f for f in fs if len(f.replace(',', '').replace('.', '').strip('0-')) >= 5}
leak_texts = [(n, t) for n, t in texts if n != 'capstones.json']
leaks = [f'{k} "{f}" in {name}' for name, txt in leak_texts for k, fs in forms.items() for f in fs
         if re.search(r'(?<![\d.,])' + re.escape(f) + r'(?![\d])', txt)]
gate('capstone leak (no graded value at any printed rounding in lessons, banks, panels or the page)', not leaks,
     f'{len(forms)} fields x {len(leak_texts)} texts; {len(leaks)} leak(s)' + (f': {leaks[:3]}' if leaks else ''))

# ---------------------------------------------------------------- 10 wave inputs, vitest
rc, out = sh('node tools/course-waves/check-wave-inputs.mjs')
gate('check-wave-inputs (digests and fields pinned and spelled by committed generators)', rc == 0, tail(out))
rc, out = sh('npx vitest run src/components/course/panels/cashflow src/components/course/panels/pia')
m = re.search(r'Tests\s+(.*)', out)
gate('vitest panels/cashflow and panels/pia', rc == 0, m.group(1).strip() if m else tail(out, 3))

shutil.rmtree(tmp, ignore_errors=True)
print()
failed = [n for n, ok, _ in results if not ok]
print(f'{len(results)} gates, {len(results) - len(failed)} pass, {len(failed)} fail')
sys.exit(1 if failed else 0)
