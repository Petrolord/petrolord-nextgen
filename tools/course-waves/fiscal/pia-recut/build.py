#!/usr/bin/env python3
"""FISCAL PIA RE-CUT, THE QUESTION BANKS: served rows + writers' rows -> banks and edits.

Fiscal has no committed bank sources (no tools/course-banks/fiscal). The served
rows are what the applied migrations leave: replay_banks.sh replays every
migration that writes the fiscal banks on a LOCAL scratch Postgres (never
production) and dumps them; served_fiscal.json is that dump (396 active rows).

Writers change a question by giving its FULL new row in rows_<tier>.json:
  {tier, scope, module_key, ord, prompt, options, answer_index, explanation, why}
This script REFUSES a row that is not served, a moved answer_index, an option
count other than four, options that are no longer distinct, an em or en dash,
an "X, not Y" contrastive in any changed field, a row that changes nothing, and
a row given twice. It writes:

  banks/ec2{b,i,a}_{m01..m06,exam}.json   the whole after-state, bankkit shape
                                          ({prompt, options, answer, explanation}),
                                          for the gates (lengthtails, dupaxes,
                                          numsweep --banks, copy rule)
  docs/pia-recut/fiscal_edits.json        every changed row, old and new in full

    python3 build.py [--check]     (--check writes nothing and fails on drift)
"""
import json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
TIERS = ['beginner', 'intermediate', 'advanced']
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w', re.I)
EDITS = os.path.join(REPO, 'docs', 'pia-recut', 'fiscal_edits.json')
_CP = json.load(open(os.path.join(HERE, 'capstone_advanced_prompt.json')))
CAPSTONE_CHANGES = [{   # lead decision 4: the Expert prompt states the sweep plainly (and loses a contrastive)
    'slug': 'fiscal', 'tier': 'advanced', 'field': 'prompt', 'old': _CP['old'], 'new': _CP['new'],
    'why': 'no repair framing ("The sweep now reaches ...") and no "X, not Y" contrastive; graded fields unchanged'}]
# Graded-field changes the ship step writes into a guarded capstone migration.
GRADED_FIELD_CHANGES = [
    {'slug': 'fiscal', 'tier': 'beginner', 'key': 'con_payback_year_cum_ncf_musd',
     'expected': 14.740261270763284, 'old_tol': 0.001, 'new_tol': 0.0003,
     'why': ("lead decision (PIA re-cut leak gate): the Nigeria - PIA (2021) template's year 2 royalty on the "
             "Designer's default project, 14.739655314252133, sat 0.000606 from the answer, inside the 0.001 band; "
             "at 0.0003 it is 2.02 bands clear. Expected value unchanged. Precedent: psc_y8_royalty_musd, 2026-09-13 recut.")},
]


def key(r):
    return (r['tier'], r['scope'], r['module_key'], int(r['ord']))


def label(k):
    t, s, m, o = k
    return f"fiscal {t} {'final' if s == 'final' else 'module ' + m} ord {o}"


def main():
    check = '--check' in sys.argv
    served = {key(r): r for r in json.load(open(os.path.join(HERE, 'served_fiscal.json')))}
    if len(served) != 396:
        sys.exit(f'REFUSED: served_fiscal.json holds {len(served)} rows, expected 396')
    new, why = {}, {}
    for t in TIERS:
        p = os.path.join(HERE, f'rows_{t}.json')
        rows = json.load(open(p))
        for r in rows:
            k = key(r)
            if r['tier'] != t:
                sys.exit(f'REFUSED: {label(k)} sits in rows_{t}.json')
            if k not in served:
                sys.exit(f'REFUSED: no served row for {label(k)}')
            if k in new:
                sys.exit(f'REFUSED: {label(k)} given twice')
            o = served[k]
            if r['answer_index'] != o['answer_index']:
                sys.exit(f'REFUSED: {label(k)} moves answer_index {o["answer_index"]} -> {r["answer_index"]}')
            if len(r['options']) != 4:
                sys.exit(f'REFUSED: {label(k)} has {len(r["options"])} options')
            if len(set(r['options'])) != 4:
                sys.exit(f'REFUSED: {label(k)} options are not distinct')
            if not r.get('why'):
                sys.exit(f'REFUSED: {label(k)} carries no why')
            changed = False
            for f in ('prompt', 'explanation'):
                if r[f] != o[f]:
                    changed = True
                    if DASH.search(r[f]) or CONTRAST.search(r[f]):
                        sys.exit(f'REFUSED: {label(k)} {f} breaks the copy rule')
            for i, (a, b) in enumerate(zip(o['options'], r['options'])):
                if a != b:
                    changed = True
                    if DASH.search(b) or CONTRAST.search(b):
                        sys.exit(f'REFUSED: {label(k)} option {i} breaks the copy rule')
            if not changed:
                sys.exit(f'REFUSED: {label(k)} changes nothing')
            new[k] = {kk: r[kk] for kk in ('prompt', 'options', 'answer_index', 'explanation')}
            why[k] = r['why']

    # the after-state, bank by bank
    out = {}
    for t in TIERS:
        man = json.load(open(os.path.join(REPO, 'src/content/courses/fiscal', t, 'manifest.json')))
        banks = [(f"ec2{LETTER[t]}_{m['key'].split('-')[0]}.json", 'module', m['key']) for m in man['modules']]
        banks.append((f'ec2{LETTER[t]}_exam.json', 'final', None))
        for fn, scope, mk in banks:
            ords = sorted(k[3] for k in served if k[:3] == (t, scope, mk))
            want = 15 if scope == 'module' else 42
            if ords != list(range(1, want + 1)):
                sys.exit(f'REFUSED: {t} {fn} served ords are not 1..{want}')
            bank = []
            for o in ords:
                k = (t, scope, mk, o)
                r = new.get(k, served[k])
                bank.append({'prompt': r['prompt'], 'options': r['options'],
                             'answer': r['answer_index'], 'explanation': r['explanation']})
            out[fn] = json.dumps(bank, ensure_ascii=False, indent=1) + '\n'

    order = lambda k: (TIERS.index(k[0]), k[1] != 'final', k[2] or '', k[3])
    edits = {
        'course': 'fiscal', 'recut': 'PIA 2021 re-cut, phase 2 (branch fix/cashflow-fiscal-pia-recut)',
        'served': 'tools/course-waves/fiscal/pia-recut/served_fiscal.json (replay_banks.sh on a local scratch database)',
        'digest': 'tools/course-waves/fiscal/digest.txt',
        'counts': dict(collections.Counter(k[0] for k in new)),
        'questions': [
            {'slug': 'fiscal', 'tier': k[0], 'scope': k[1], 'module_key': k[2], 'ord': k[3],
             'fields': [f for f in ('prompt', 'explanation') if new[k][f] != served[k][f]]
                       + [f'options[{i}]' + (' (keyed)' if i == served[k]['answer_index'] else '')
                          for i in range(4) if new[k]['options'][i] != served[k]['options'][i]],
             'why': why[k],
             'old': {f: served[k][f] for f in ('prompt', 'options', 'answer_index', 'explanation')},
             'new': new[k]}
            for k in sorted(new, key=order)],
        'capstone_prompt_changes': CAPSTONE_CHANGES,
        'graded_field_changes': GRADED_FIELD_CHANGES,
        'lesson_title_changes': [  # manifest titles (lead decision 4, L5); the ship step carries them if the served structure holds titles
            {'tier': 'advanced', 'module_key': 'm03-the-capex-sweep', 'lesson_key': 'l02-the-point-the-loop-never-reaches',
             'old': 'The point the loop never reaches', 'new': 'The eighth point and the direct call'},
            {'tier': 'advanced', 'module_key': 'm05-numbers-to-distrust', 'lesson_key': 'l03-the-irr-that-reports-its-bracket',
             'old': 'The IRR that reports its bracket', 'new': 'The IRR that answers with a status'}],
    }
    edits_txt = json.dumps(edits, ensure_ascii=False, indent=1) + '\n'
    bank_dir = os.path.join(HERE, 'banks')
    if check:
        bad = [fn for fn, txt in out.items()
               if not os.path.exists(os.path.join(bank_dir, fn)) or open(os.path.join(bank_dir, fn)).read() != txt]
        if not os.path.exists(EDITS) or open(EDITS).read() != edits_txt:
            bad.append('fiscal_edits.json')
        if bad:
            sys.exit('DRIFT: ' + ', '.join(bad))
        print(f'build --check: clean, {len(new)} changed rows')
        return
    os.makedirs(bank_dir, exist_ok=True)
    for fn, txt in out.items():
        open(os.path.join(bank_dir, fn), 'w').write(txt)
    open(EDITS, 'w').write(edits_txt)
    print(f'wrote {len(out)} banks and {len(new)} changed rows: ' + ', '.join(f'{t} {edits["counts"].get(t, 0)}' for t in TIERS))


if __name__ == '__main__':
    main()
