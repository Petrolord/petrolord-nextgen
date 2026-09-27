#!/usr/bin/env python3
"""Write docs/ec45-recut/decision_edits.json: every EC4 decision question row
the re-cut changes, old and new, for the phase-2 migration writer.

OLD is the served row from the scratch replay of every migration that writes the
decision banks (docs/ec45-recut/served/questions.json, W3 included). W3
(20261026_w3_decision.sql) writes capstone prompts only and no question row, so
the pre-W3 and post-W3 forms of every question are the same text; each edit
says so (old_pre_w3 is null and w3_differs false) and the capstones list is
empty because no decision capstone changes. NEW is the re-cut bank source's
emitted JSON (tools/course-waves/ec45-recut/banks/decision). Identity is
slug/tier/scope/module_key/ord.

    python3 make_edits.py [--check]
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SERVED = os.path.join(REPO, 'docs/ec45-recut/served/questions.json')
BANKS = os.path.join(REPO, 'tools/course-waves/ec45-recut/banks/decision')
OUT = os.path.join(REPO, 'docs/ec45-recut/decision_edits.json')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
FIELDS = ('prompt', 'options', 'answer_index', 'explanation')

served = [q for q in json.load(open(SERVED, encoding='utf-8')) if q['app_slug'] == 'decision']
edits = []
for q in served:
    bank = 'exam' if q['scope'] == 'final' else q['module_key'][:3]
    new = json.load(open(os.path.join(BANKS, q['tier'], f"ec4{LETTER[q['tier']]}_{bank}.json"), encoding='utf-8'))[q['ord'] - 1]
    new = {'prompt': new['prompt'], 'options': new['options'], 'answer_index': new['answer'], 'explanation': new['explanation']}
    old = {k: q[k] for k in FIELDS}
    if new == old:
        continue
    edits.append({
        'slug': 'decision', 'tier': q['tier'], 'scope': q['scope'], 'module_key': q['module_key'], 'ord': q['ord'],
        'changed_fields': [k for k in FIELDS if new[k] != old[k]],
        'key_moved': new['answer_index'] != old['answer_index'],
        'w3_differs': False, 'old_pre_w3': None,
        'old': old, 'new': new,
    })
order = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
edits.sort(key=lambda e: (order[e['tier']], e['scope'] != 'module', e['module_key'] or '', e['ord']))
doc = {
    'description': ('EC4 decision question rows changed by the ec45 re-cut (engines fb5a363: reported ties, '
                    'six-place thirds accepted, money refused by node label, one rounded net VOI, no repair history). '
                    'Identity is slug/tier/scope/module_key/ord as served after 20260916_ec4_decision_*, '
                    '20261021b_b4_fix_decision and 20261026_w3_decision. old is the served row; W3 writes no question '
                    'row, so pre-W3 and post-W3 question text are identical (old_pre_w3 null, w3_differs false). '
                    'new is the emitted bank source JSON under tools/course-waves/ec45-recut/banks/decision. '
                    'Every graded field and capstone is unchanged: capstones is empty.'),
    'counts': {t: sum(1 for e in edits if e['tier'] == t) for t in order},
    'keys_moved': sum(1 for e in edits if e['key_moved']),
    'questions': edits,
    'capstones': [],
}
text = json.dumps(doc, indent=1, ensure_ascii=False) + '\n'
if '--check' in sys.argv:
    ok = os.path.exists(OUT) and open(OUT, encoding='utf-8').read() == text
    print('decision_edits.json ' + ('matches the banks' if ok else 'DIFFERS from the banks'))
    sys.exit(0 if ok else 1)
open(OUT, 'w', encoding='utf-8').write(text)
print(f"{len(edits)} changed rows {doc['counts']}, keys moved {doc['keys_moved']}")
