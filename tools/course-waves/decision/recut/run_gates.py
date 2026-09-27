#!/usr/bin/env python3
"""THE DECISION (EC4) RE-CUT GATES, in one run. Every gate prints what it examined.

Baseline = the served course: lessons, manifests and panels at BASE (origin/main
before the re-cut branch) and the served rows (docs/ec45-recut/served/questions.json,
emitted byte for byte by the baseline bank sources at BANK_BASE).

  lengths          every lesson's prose words in 420..560
  copy rule        every CHANGED lesson line, manifest title, panel line and bank
                   row: no em or en dash, no contrastive (", not X", "rather than",
                   ", never", "instead of"), no digest section cite, no repair
                   history. The WHOLE learner surface: no dash; contrastive hits
                   the re-cut does not touch are counted and reported.
                   --plant control: planted defects in a changed row must be caught.
  numsweep         lessons and banks, every 7+ figure literal resolves to the
                   digest (harvested) or the goldens; the kit's own --selftest
  answer shape     bankkit audit (key spread, length ranks, prompt Jaccard) on
                   every bank; lengthtails refuses a read-nothing score above 40
  dupaxes          no near-duplicate pair (0.45) that the served banks did not have
  bank sources     check-bank-sources reproduces all 21 banks byte for byte
  key truth        keytruth.mjs, --plant and --plant-engine
  edits file       decision_edits.json matches the banks
  graded fields    fields.json byte-identical to BASE (and the lab test pins it)
  vitest           the decision lab, panels and capstone guard

    python3 run_gates.py            exit 0 only if every gate passes
"""
import glob, io, json, os, re, shutil, subprocess, sys, tempfile, contextlib

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
BASE = os.environ.get('EC4_BASE', '2e05030f9')
BANK_BASE = os.environ.get('EC4_BANK_BASE', 'ffb16dce2')
WK = '/root/dc-wavekit'
COURSE = os.path.join(REPO, 'src/content/courses/decision')
BANKS = os.path.join(REPO, 'tools/course-waves/ec45-recut/banks/decision')
APP = ['src/components/course/panels/decision/TreeExplorer.jsx', 'src/components/course/panels/decision/InformationExplorer.jsx',
       'src/components/course/panels/decision/JudgementExplorer.jsx', 'src/components/course/panels/decision/decisionKit.jsx',
       'src/pages/apps/DecisionLearningPage.jsx']
results = []


def sh(cmd, env=None):
    p = subprocess.run(cmd, cwd=REPO, shell=True, capture_output=True, text=True, env={**os.environ, **(env or {})})
    return p.returncode, (p.stdout + p.stderr)


def gate(name, ok, detail):
    results.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {detail}", flush=True)


def tail(s, n=1):
    return ' | '.join(l.strip() for l in s.strip().splitlines()[-n:])


tmp = tempfile.mkdtemp(prefix='ec4gates.')
try:
    # ------------------------------------------------------------ baselines
    subprocess.run(f'git archive {BASE} src/content/courses/decision {" ".join(APP)} | tar -x -C {tmp}', cwd=REPO, shell=True, check=True)
    old_banks = os.path.join(tmp, 'oldbanks'); new_banks = os.path.join(tmp, 'newbanks')
    os.makedirs(old_banks); os.makedirs(new_banks)
    for f in subprocess.run(['git', 'ls-tree', '-r', '--name-only', BANK_BASE, 'tools/course-waves/ec45-recut/banks/decision'], cwd=REPO, capture_output=True, text=True).stdout.split():
        if f.endswith('.json'):
            open(os.path.join(old_banks, os.path.basename(f)), 'w').write(subprocess.run(['git', 'show', f'{BANK_BASE}:{f}'], cwd=REPO, capture_output=True, text=True).stdout)
    for f in glob.glob(os.path.join(BANKS, '*', '*.json')):
        shutil.copy(f, new_banks)
    served = [q for q in json.load(open(os.path.join(REPO, 'docs/ec45-recut/served/questions.json'))) if q['app_slug'] == 'decision']
    LET = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
    same_as_served = all(
        json.load(open(os.path.join(old_banks, f"ec4{LET[q['tier']]}_{'exam' if q['scope'] == 'final' else q['module_key'][:3]}.json")))[q['ord'] - 1]
        == {'prompt': q['prompt'], 'options': q['options'], 'answer': q['answer_index'], 'explanation': q['explanation']} for q in served)
    gate('baseline banks are the served rows', same_as_served and len(served) == 396, f'{len(served)} served rows, bank baseline {BANK_BASE}')

    # ------------------------------------------------------------ lengths
    bad, n = [], 0
    for tier in ['beginner', 'intermediate', 'advanced']:
        man = json.load(open(os.path.join(COURSE, tier, 'manifest.json')))
        for m in man['modules']:
            for l in m['lessons']:
                p = os.path.join(COURSE, tier, m['key'], l['key'] + '.md')
                txt = open(p).read()
                if txt.startswith('---'):
                    txt = txt.split('---', 2)[2]
                words = len(' '.join(x for x in txt.splitlines() if not x.startswith('|') and not x.startswith('{{panel')).split())
                n += 1
                if not 420 <= words <= 560:
                    bad.append(f'{tier}/{m["key"]}/{l["key"]} {words}')
    gate('lengths', n == 78 and not bad, f'{n} lessons, out of band {len(bad)} {bad}')

    # ------------------------------------------------------------ copy rule
    DASH = re.compile('[—–]')
    CONTRA = re.compile(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b', re.I)
    CITE = re.compile(r'\bSection \d+\b|\bthe digest\b|digest\.txt', re.I)
    HIST = re.compile(r'\brepaired\b|\bbefore the (EC4-0 )?repair\b|\bthe repair\b|\bEC4-\d|\bfinding D\d|\bpre-repair\b|\breconstructed\b|\bold build\b|\bhistory\b', re.I)

    def learner_lines(root):
        out = {}
        for p in sorted(glob.glob(os.path.join(root, 'src/content/courses/decision/*/*/*.md'))):
            out[os.path.relpath(p, root)] = open(p).read().splitlines()
        for p in sorted(glob.glob(os.path.join(root, 'src/content/courses/decision/*/manifest.json'))):
            m = json.load(open(p))
            out[os.path.relpath(p, root)] = [x['title'] for x in m['modules']] + [l['title'] for x in m['modules'] for l in x['lessons']]
        for a in APP:
            p = os.path.join(root, a)
            if os.path.exists(p):
                out[a] = open(p).read().splitlines()
        return out

    def bank_rows(d):
        out = {}
        for p in sorted(glob.glob(os.path.join(d, '*.json'))):
            for i, q in enumerate(json.load(open(p)), 1):
                out[f'{os.path.basename(p)} Q{i}'] = [q['prompt']] + q['options'] + [q['explanation']]
        return out

    def copy_rule(plant=False):
        new_l, old_l = learner_lines(REPO), learner_lines(tmp)
        new_b, old_b = bank_rows(new_banks), bank_rows(old_banks)
        changed = []
        for f, lines in new_l.items():
            old = set(old_l.get(f, []))
            changed += [(f, t) for t in lines if t not in old]
        changed_rows = [k for k in new_b if new_b[k] != old_b.get(k)]
        changed += [(k, t) for k in changed_rows for t in new_b[k]]
        if plant:
            changed.append(('PLANTED row', 'The median, not the mean — as it stood before the repair, see Section 11, rather than the mode.'))
        viol = []
        for where, t in changed:
            for name, rx in (('dash', DASH), ('contrastive', CONTRA), ('section cite', CITE), ('repair history', HIST)):
                if rx.search(t):
                    viol.append(f'{name}: {where}: {t.strip()[:100]}')
        whole = [(f, t) for f, ls in new_l.items() for t in ls] + [(k, t) for k, ts in new_b.items() for t in ts]
        dashes = [f'{f}: {t.strip()[:80]}' for f, t in whole if DASH.search(t)]
        untouched = sorted({f for f, t in whole if CONTRA.search(t)} - {w for w, _ in changed})
        return changed, changed_rows, viol, dashes, untouched, len(whole)

    changed, changed_rows, viol, dashes, untouched, nwhole = copy_rule()
    gate('copy rule, changed text', not viol and len(changed) > 100,
         f'{len(changed)} changed lines and strings ({len(changed_rows)} bank rows), violations {len(viol)}' + (f' {viol[:6]}' if viol else ''))
    gate('copy rule, whole surface dashes', not dashes and nwhole > 3000, f'{nwhole} lines and strings, dashes {len(dashes)} {dashes[:3]}')
    print(f'      untouched contrastive hits (reported, not re-cut): {len(untouched)} -> {untouched}')
    _, _, pviol, _, _, _ = copy_rule(plant=True)
    kinds = {v.split(':')[0] for v in pviol if 'PLANTED' in v}
    gate('copy rule --plant control', kinds == {'dash', 'contrastive', 'section cite', 'repair history'}, f'planted defects caught: {sorted(kinds)}')

    # ------------------------------------------------------------ numsweep
    wv = os.path.join(tmp, 'wave')
    os.makedirs(os.path.join(wv, 'banks'))
    w = json.load(open(os.path.join(REPO, 'tools/course-waves/decision/wave.json')))
    w['repo'] = REPO
    json.dump(w, open(os.path.join(wv, 'wave.json'), 'w'))
    shutil.copy(os.path.join(REPO, 'tools/course-waves/decision/digest.txt'), wv)
    for f in glob.glob(os.path.join(new_banks, '*.json')):
        shutil.copy(f, os.path.join(wv, 'banks'))
    rc, out = sh(f'python3 {WK}/harvest_digest.py {wv}')
    rc1, out1 = sh(f'node {WK}/numsweep.mjs {wv}')
    rc2, out2 = sh(f'node {WK}/numsweep.mjs {wv} --banks')
    rc3, out3 = sh(f'node {WK}/numsweep.mjs --selftest')
    gate('numsweep lessons', rc == 0 and rc1 == 0, tail(out1))
    gate('numsweep banks', rc2 == 0, tail(out2))
    gate('numsweep --selftest (negative control)', rc3 == 0, tail(out3))

    # ------------------------------------------------------------ answer shape
    sys.path.insert(0, WK)
    import bankkit
    fails = {}
    for p in sorted(glob.glob(os.path.join(new_banks, '*.json'))):
        qs = json.load(open(p))
        with contextlib.redirect_stdout(io.StringIO()):
            errs = bankkit.audit(qs, os.path.basename(p), 42 if 'exam' in p else 15)
        if errs:
            fails[os.path.basename(p)] = errs
    gate('bankkit answer-shape audit', not fails, f'21 banks, failing {len(fails)} {fails}')
    rc, out = sh(f'python3 {WK}/lengthtails.py {new_banks} --refuse 40')
    rcb, outb = sh(f'python3 {WK}/lengthtails.py {old_banks} --refuse 40')
    gate('lengthtails (answer length)', rc == 0, f'{tail(out)}; served baseline: {tail(outb)}')

    # ------------------------------------------------------------ dupaxes
    def pairs(d, p):
        _, o = sh(f'python3 {WK}/dupaxes.py {d} --prefix {p}')
        return {(m.group(2), m.group(4), m.group(5)) for m in re.finditer(r'^\s+([\d.]+)\s+(\w+)\s+([\w-]+)\s+(\S+ Q\d+) versus (\S+ Q\d+)', o, re.M)}, tail(o)
    newp = []
    summary = []
    for p in ['ec4b', 'ec4i', 'ec4a']:
        a, ta = pairs(new_banks, p)
        b, tb = pairs(old_banks, p)
        newp += sorted(a - b)
        summary.append(f'{p}: {len(a)} pairs at or above 0.45 (served {len(b)})')
    gate('dupaxes, no new near-duplicate pair', not newp, '; '.join(summary) + (f' NEW {newp}' if newp else ''))

    # ------------------------------------------------------------ bank sources
    rc, out = sh('python3 tools/course-banks/check-bank-sources.py --root tools/course-waves/ec45-recut/banks decision')
    gate('check-bank-sources', rc == 0, tail(out))

    # ------------------------------------------------------------ key truth
    kt = os.path.join(HERE, 'keytruth.mjs')
    rc, out = sh(f'node {kt}')
    gate('key truth by engine call', rc == 0, tail(out))
    rc, out = sh(f'node {kt} --plant')
    gate('key truth --plant (printed figures perturbed)', rc == 0, tail(out))
    rc, out = sh(f'node {kt} --plant-engine')
    gate('key truth --plant-engine (no self-comparisons)', rc == 0, tail(out))

    # ------------------------------------------------------------ edits file, graded fields
    rc, out = sh(f'python3 {os.path.join(HERE, "make_edits.py")} --check')
    gate('decision_edits.json matches the banks', rc == 0, tail(out))
    rc, out = sh(f'git diff --quiet {BASE} -- tools/course-waves/decision/fields.json tools/course-waves/decision/ec4_fields.mjs')
    gate('graded fields byte-identical to BASE', rc == 0, 'fields.json and ec4_fields.mjs unchanged since ' + BASE)

    # ------------------------------------------------------------ vitest
    rc, out = sh('npx vitest run src/components/course/panels/decision src/lib/noInternalDigestCopy.test.js src/lib/noInternalDigestBankCopy.test.js src/lib/courseContent.test.js')
    m = re.findall(r'Tests\s+(.*)', out)
    gate('vitest: decision lab, panels, capstone guard, content', rc == 0, m[-1].strip() if m else tail(out, 3))
finally:
    shutil.rmtree(tmp, ignore_errors=True)

bad = [r for r in results if not r[1]]
print(f'\n{len(results) - len(bad)} of {len(results)} gates pass')
sys.exit(1 if bad else 0)
