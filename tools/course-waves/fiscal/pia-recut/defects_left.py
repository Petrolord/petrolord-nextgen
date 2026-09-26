#!/usr/bin/env python3
"""Every question row the phase 1 audit flagged must be changed, and the flagged
live words must be gone from the field they were found in (or the row must carry
a stated reason in its `why` that the words are still true)."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
edits = {(e['tier'], e['scope'], e['module_key'] or 'final', e['ord']): e
         for e in json.load(open(os.path.join(REPO, 'docs/pia-recut/fiscal_edits.json')))['questions']}
# Audited words that are TRUE of the re-cut row, with the reason (checked by keytruth).
ALLOW = {('intermediate', 'final', 'final', 9, 'answer_index'):
         're-cut onto the PIA template on ODIDI, years 9 to 11: year 11 recovers exactly its own opex'}
left = 0; rows = set()
for l in open(os.path.join(REPO, 'docs/pia-recut/fiscal_banks.jsonl')):
    d = json.loads(l)
    if 'locator' not in d: continue
    m = re.match(r'fiscal/(\w+)/(\w+)/([\w-]+)/ord (\d+) field: (.+)', d['locator'])
    t, s, mk, o, f = m.groups(); k = (t, s, mk, int(o)); rows.add(k)
    e = edits.get(k)
    if not e:
        left += 1; print(f'UNCHANGED {t} {mk} ord {o} ({f}, {d["severity"]})'); continue
    n = e['new']
    txt = n['options'][int(f[8])] if f.startswith('options[') else (n['options'][n['answer_index']] if f == 'answer_index' else n[f])
    if d['quote'] in txt and (t, s, mk, int(o), f) not in ALLOW:
        left += 1; print(f'QUOTE STILL PRESENT {t} {mk} ord {o} {f}: {d["quote"][:80]}')
print(f'defects_left: {len(rows)} flagged rows, {left} open')
sys.exit(1 if left else 0)
