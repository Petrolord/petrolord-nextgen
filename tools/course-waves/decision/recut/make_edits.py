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
# The one capstone change (lead decision 2: no repair history in learner text): the
# Expert dataset line loses "repaired". Prompt and fields do not move; W3 appended one
# sentence to the prompt, so the guard carries both prompt forms (md5s cross-checked
# against the literals 20261026_w3_decision.sql guards on).
import hashlib, re
SERVED_CAPS = os.path.join(REPO, 'docs/ec45-recut/served/capstones.json')
W3_FILE = os.path.join(REPO, 'migrations/20261026_w3_decision.sql')
W3_APPENDED = (' Read the figures in the Decision Tree Builder and the Decision Studio with their Full precision switch '
               'on (at the top of each page): they print them to the precision this capstone grades, with no digit grouping.')
CAP_OLD = 'the ABALAMA tree, lottery and surveys, read through Decision Studio and the repaired VOI Analyzer'
CAP_NEW = 'the ABALAMA tree, lottery and surveys, read through Decision Studio and the VOI Analyzer'
cap = next(c for c in json.load(open(SERVED_CAPS, encoding='utf-8')) if c['app_slug'] == 'decision' and c['tier'] == 'advanced')
if cap['dataset'] != CAP_OLD:
    sys.exit('REFUSED: the served decision Expert dataset is not the text this edit replaces')
if not cap['prompt'].endswith(W3_APPENDED):
    sys.exit('REFUSED: the served decision Expert prompt does not carry the W3 sentence')
md5 = lambda t: hashlib.md5(t.encode('utf-8')).hexdigest()
pre, post = cap['prompt'][:-len(W3_APPENDED)], cap['prompt']
w3 = open(W3_FILE, encoding='utf-8').read().split('-- decision / advanced', 1)[1]
w3_md5s = re.findall(r"md5\(prompt\) = '([0-9a-f]{32})'", w3)[:2]
if w3_md5s != [md5(pre), md5(post)]:
    sys.exit(f'REFUSED: the prompt forms do not match the W3 guard md5s {w3_md5s}')
capstones = [{
    'slug': 'decision', 'tier': 'advanced', 'cert_tier': cap['cert_tier'], 'title': cap['title'],
    'changed': ['dataset'],
    'why': 'Lead decision 2: "repaired" is repair history in learner text; the Expert dataset line loses it.',
    'graded_fields': 'unchanged: fields (keys, labels, units, expected, tolerances, order) byte-identical; attempts and certificates stand as issued',
    'old': {'dataset': CAP_OLD},
    'new': {'dataset': CAP_NEW},
    'fields': cap['fields'],
    'prompt_unchanged': {'note': 'The prompt is not edited. W3 appended one sentence to it; the guard matches either form.',
                         'pre_w3': pre, 'pre_w3_md5': md5(pre), 'post_w3': post, 'post_w3_md5': md5(post)},
}]
order = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
edits.sort(key=lambda e: (order[e['tier']], e['scope'] != 'module', e['module_key'] or '', e['ord']))
doc = {
    'description': ('EC4 decision question rows changed by the ec45 re-cut (engines fb5a363: reported ties, '
                    'six-place thirds accepted, money refused by node label, one rounded net VOI, no repair history). '
                    'Identity is slug/tier/scope/module_key/ord as served after 20260916_ec4_decision_*, '
                    '20261021b_b4_fix_decision and 20261026_w3_decision. old is the served row; W3 writes no question '
                    'row, so pre-W3 and post-W3 question text are identical (old_pre_w3 null, w3_differs false). '
                    'new is the emitted bank source JSON under tools/course-waves/ec45-recut/banks/decision. '
                    'Every graded field is unchanged; the one capstone edit is the Expert dataset line (no "repaired"), '
                    'prompt and fields untouched.'),
    'counts': {t: sum(1 for e in edits if e['tier'] == t) for t in order},
    'keys_moved': sum(1 for e in edits if e['key_moved']),
    'questions': edits,
    'capstones': capstones,
}
text = json.dumps(doc, indent=1, ensure_ascii=False) + '\n'
if '--check' in sys.argv:
    ok = os.path.exists(OUT) and open(OUT, encoding='utf-8').read() == text
    print('decision_edits.json ' + ('matches the banks' if ok else 'DIFFERS from the banks'))
    sys.exit(0 if ok else 1)
open(OUT, 'w', encoding='utf-8').write(text)
print(f"{len(edits)} changed rows {doc['counts']}, keys moved {doc['keys_moved']}")
