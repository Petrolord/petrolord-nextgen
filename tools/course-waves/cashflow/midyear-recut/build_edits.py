#!/usr/bin/env python3
"""EC1 MID-YEAR RECUT: the edits manifest, built from git and never typed.

OLD is the served course: the committed bank JSON at BASE (nextgen origin/main
d2f15b28f, which the 2026-10-14 read-only dump of production matched row for row
on prompt, options, keyed index and explanation, 396 of 396) and the served
Professional capstone at BASE (tools/course-waves/cashflow/capstones.json).
NEW is the working tree: the re-emitted bank JSON and the regenerated
capstones.json. Every question row that differs in any field is written, with
its address (tier, scope, module_key, ord) and both states.

    python3 build_edits.py           write edits.json beside this file
    python3 build_edits.py --check   exit 1 if edits.json is not what this writes
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
BASE = os.environ.get('MY_BASE', 'd2f15b28f19aca34984943eef988694f59a2c052')
OUT = os.path.join(HERE, 'edits.json')
TIER = {'b': 'beginner', 'i': 'intermediate', 'a': 'advanced'}


def at_base(rel):
    return subprocess.run(['git', 'show', f'{BASE}:{rel}'], cwd=REPO, capture_output=True, text=True, check=True).stdout


def module_keys(tier):
    man = json.load(open(os.path.join(REPO, 'src/content/courses/cashflow', tier, 'manifest.json')))
    return {m['key'].split('-')[0]: m['key'] for m in man['modules']}


def row(q):
    return {'prompt': q['prompt'], 'options': q['options'], 'answer_index': q['answer'], 'explanation': q['explanation']}


def build():
    qs = []
    for tl in ('b', 'i', 'a'):
        tier = TIER[tl]
        mk = module_keys(tier)
        d = os.path.join(REPO, 'tools/course-banks/cashflow', tier)
        for fn in sorted(os.listdir(d)):
            if not fn.endswith('.json'):
                continue
            bank = fn[:-5].split('_')[1]
            rel = f'tools/course-banks/cashflow/{tier}/{fn}'
            old = json.loads(at_base(rel))
            new = json.load(open(os.path.join(REPO, rel)))
            if len(old) != len(new):
                sys.exit(f'REFUSED: {rel} changed its question count {len(old)} -> {len(new)}')
            for i, (o, n) in enumerate(zip(old, new)):
                if o == n:
                    continue
                if o['answer'] != n['answer']:
                    sys.exit(f'REFUSED: {rel} Q{i + 1} moved its keyed index; this recut never moves a key position')
                fields = [f for f in ('prompt', 'explanation') if o[f] != n[f]] + \
                         [f'options[{k}]' + (' (keyed)' if k == n['answer'] else '') for k in range(4) if o['options'][k] != n['options'][k]]
                qs.append({
                    'slug': 'cashflow', 'tier': tier,
                    'scope': 'final' if bank == 'exam' else 'module',
                    'module_key': None if bank == 'exam' else mk[bank],
                    'ord': i + 1, 'bank': fn[:-5], 'fields': fields,
                    'old': row(o), 'new': row(n),
                })
    caps_old = {c['tier']: c for c in json.loads(at_base('tools/course-waves/cashflow/capstones.json'))}
    caps_new = {c['tier']: c for c in json.load(open(os.path.join(REPO, 'tools/course-waves/cashflow/capstones.json')))}
    caps = []
    for t in ('beginner', 'intermediate', 'advanced'):
        o, n = caps_old[t], caps_new[t]
        if o == n:
            continue
        for k in ('app_slug', 'cert_tier', 'title', 'dataset'):
            if o[k] != n[k]:
                sys.exit(f'REFUSED: capstone {t}.{k} moved; this recut moves only the prompt and the mid-year field')
        if [f['key'] for f in o['fields']] != [f['key'] for f in n['fields']]:
            sys.exit(f'REFUSED: capstone {t} changed its field keys')
        caps.append({'tier': t, 'old': {'prompt': o['prompt'], 'fields': o['fields']}, 'new': {'prompt': n['prompt'], 'fields': n['fields']},
                     'moved_fields': [f['key'] for f, g in zip(o['fields'], n['fields']) if f != g],
                     'prompt_changed': o['prompt'] != n['prompt']})
    counts = {t: sum(1 for q in qs if q['tier'] == t) for t in TIER.values()}
    return {'course': 'cashflow', 'recut': 'EC1 mid-year discounting, engines 3.12.3 (owner decision 2026-10-14)',
            'base': BASE, 'counts': counts, 'questions': qs, 'capstones': caps}


if __name__ == '__main__':
    txt = json.dumps(build(), indent=1, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        ok = os.path.exists(OUT) and open(OUT, encoding='utf-8').read() == txt
        print('edits.json reproduces' if ok else 'edits.json DIFFERS from what build_edits.py writes')
        sys.exit(0 if ok else 1)
    open(OUT, 'w', encoding='utf-8').write(txt)
    d = json.loads(txt)
    print(f"edits.json written: {len(d['questions'])} question rows {d['counts']}, {len(d['capstones'])} capstone(s)")
