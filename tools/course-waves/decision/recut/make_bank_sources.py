#!/usr/bin/env python3
"""ONE-TIME BASELINE: write the served EC4 decision banks as bank SOURCES.

The EC4 banks were seeded before the course-banks discipline, and later
migrations (20261021b_b4_fix_decision and friends) edited served rows in SQL, so
no committed source reproduces what a learner is served. This writes one source
per bank from the scratch replay of every migration that writes them
(docs/ec45-recut/served/questions.json, tools/course-waves/ec45-recut/replay_banks.sh):

    tools/course-waves/ec45-recut/banks/decision/<tier>/ec4<b|i|a>_<m01..m06|exam>.py

Each source is the served bank, question for question in ord order, as
q(key_index, prompt, keyed option, [the three other options in served order],
explanation); emit() inserts the key at its index, so the emitted options are the
served options byte for byte. The JSON beside each source is written by
emit_banks.py. The re-cut edits the sources after this baseline commit, so the
git history of each source is the history of the re-cut.

    python3 make_bank_sources.py [--check]   (--check: refuse if a source differs)
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SERVED = os.path.join(REPO, 'docs/ec45-recut/served/questions.json')
OUT = os.path.join(REPO, 'tools/course-waves/ec45-recut/banks/decision')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}

rows = [q for q in json.load(open(SERVED, encoding='utf-8')) if q['app_slug'] == 'decision']
if len(rows) != 396:
    sys.exit(f'REFUSED: {len(rows)} served decision rows, expected 396')
banks = {}
for q in rows:
    bank = 'exam' if q['scope'] == 'final' else q['module_key'].split('-')[0]
    banks.setdefault((q['tier'], bank, q['module_key']), []).append(q)

L = lambda s: json.dumps(s, ensure_ascii=False)
diff = 0
for (tier, bank, mkey), qs in sorted(banks.items()):
    qs.sort(key=lambda x: x['ord'])
    if [x['ord'] for x in qs] != list(range(1, len(qs) + 1)):
        sys.exit(f'REFUSED: {tier} {bank} ords are not 1..n')
    name = f'ec4{LETTER[tier]}_{bank}'
    d = os.path.join(OUT, tier)
    os.makedirs(d, exist_ok=True)
    out_json = os.path.join(d, name + '.json')
    lines = [
        "import sys; sys.path.insert(0, '/root/dc-wavekit')",
        'from bankkit import emit, finish',
        'Q=[]',
        'def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))',
        '',
        f'# EC4 decision, {tier}, {"final exam" if bank == "exam" else "module " + mkey}.',
        '# One q() per served question, in ord order (ord = position, from 1).',
        '',
    ]
    for x in qs:
        k = x['answer_index']
        opts = list(x['options'])
        key = opts.pop(k)
        lines.append(f"# ord {x['ord']}")
        lines.append(f"q({k}, {L(x['prompt'])},")
        lines.append(f" {L(key)},")
        lines.append(f" [{L(opts[0])},")
        lines.append(f"  {L(opts[1])},")
        lines.append(f"  {L(opts[2])}],")
        lines.append(f" {L(x['explanation'])})")
        lines.append('')
    lines.append(f"emit(Q, {L(out_json)}, label={L(name)}, expect_n={len(qs)})")
    lines.append('finish()')
    src = '\n'.join(lines) + '\n'
    p = os.path.join(d, name + '.py')
    if '--check' in sys.argv:
        if not os.path.exists(p) or open(p, encoding='utf-8').read() != src:
            print(f'DIFFERS {p}'); diff += 1
    else:
        open(p, 'w', encoding='utf-8').write(src)
print(f'{len(banks)} banks, {len(rows)} questions' + (f', {diff} differ' if '--check' in sys.argv else ' written'))
sys.exit(1 if diff else 0)
