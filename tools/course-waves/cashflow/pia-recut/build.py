#!/usr/bin/env python3
"""CASHFLOW PIA RE-CUT, THE QUESTION BANKS: served rows + writers' rows -> banks and edits.

Cashflow has no committed bank sources (no tools/course-banks/cashflow). The
served rows are what the applied migrations leave: the fiscal kit's
replay_banks.sh replays every migration that writes the cashflow and fiscal
banks on a LOCAL scratch Postgres (never production) and dumps them;
docs/pia-recut/served/cashflow_questions.json is the cashflow half of that dump
(396 active rows), and docs/pia-recut/served/cashflow_capstones.json the three
capstones (with the B5 half-cent tolerance on the Professional breakeven).

Writers change a question by giving its FULL new row in rows_<tier>[_<part>].json:
  {tier, scope, module_key, ord, prompt, options, answer_index, explanation, why}
This script REFUSES a row that is not served, a moved answer_index, an option
count other than four, options that are no longer distinct, an em or en dash,
an "X, not Y" contrastive in any changed field, a row that changes nothing, and
a row given twice. It writes:

  banks/ec1{b,i,a}_{m01..m06,exam}.json   the whole after-state, bankkit shape
                                          ({prompt, options, answer, explanation}),
                                          for the gates (lengthtails, dupaxes,
                                          numsweep --banks, copy rule)
  docs/pia-recut/cashflow_after.json      all 396 rows after the re-cut, served shape
  tools/course-banks/cashflow/<tier>/     the committed bank source pairs (.py emits .json)
  docs/pia-recut/cashflow_edits.json      every changed row, old and new in full,
                                          and the capstone and graded-field changes

    python3 build.py [--check]     (--check writes nothing and fails on drift)
"""
import glob, json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
TIERS = ['beginner', 'intermediate', 'advanced']
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w', re.I)
EDITS = os.path.join(REPO, 'docs', 'pia-recut', 'cashflow_edits.json')
SERVED = os.path.join(REPO, 'docs', 'pia-recut', 'served', 'cashflow_questions.json')
AFTER = os.path.join(REPO, 'docs', 'pia-recut', 'cashflow_after.json')
SERVED_CAPS = os.path.join(REPO, 'docs', 'pia-recut', 'served', 'cashflow_capstones.json')
KIT_CAPS = os.path.join(REPO, 'tools', 'course-waves', 'cashflow', 'capstones.json')


def key(r):
    return (r['tier'], r['scope'], r['module_key'], int(r['ord']))


def label(k):
    t, s, m, o = k
    return f"cashflow {t} {'final' if s == 'final' else 'module ' + m} ord {o}"


def capstone_changes():
    """Every capstone whose served row differs from the kit's capstones.json
    (ec1_capstone.mjs renders it from the engine inputs): old and new in full,
    with the graded keys that leave and arrive. The Associate and Professional
    capstones must not differ at all."""
    served = {c['tier']: c for c in json.load(open(SERVED_CAPS))}
    kit = {c['tier']: c for c in json.load(open(KIT_CAPS))}
    out = []
    for t in TIERS:
        s, k = served[t], kit[t]
        cols = ('cert_tier', 'title', 'dataset', 'prompt', 'fields')
        diff = [c for c in cols if s[c] != k[c]]
        if not diff:
            continue
        if t != 'advanced':
            sys.exit(f'REFUSED: the {t} capstone differs from its served row ({", ".join(diff)})')
        sk = [f['key'] for f in s['fields']]; kk = [f['key'] for f in k['fields']]
        out.append({'slug': 'cashflow', 'tier': t, 'changed': diff,
                    'graded_keys_removed': [x for x in sk if x not in kk],
                    'graded_keys_added': [x for x in kk if x not in sk],
                    'graded_keys_kept_value_moved': [f['key'] for f in k['fields'] if f['key'] in sk and
                                                     next(g for g in s['fields'] if g['key'] == f['key'])['expected'] != f['expected']],
                    'attempts': 'existing attempts and certificates stand as issued; only new attempts use the new keys (lead L1): the migration guards on attempts',
                    'old': {c: s[c] for c in cols}, 'new': {c: k[c] for c in cols}})
    return out


def main():
    check = '--check' in sys.argv
    served = {key(r): r for r in json.load(open(SERVED))}
    if len(served) != 396:
        sys.exit(f'REFUSED: served cashflow_questions.json holds {len(served)} rows, expected 396')
    new, why = {}, {}
    for t in TIERS:
        # one file per writer: rows_<tier>.json or rows_<tier>_<part>.json
        files = sorted(glob.glob(os.path.join(HERE, f'rows_{t}.json')) + glob.glob(os.path.join(HERE, f'rows_{t}_*.json')))
        rows = [r for p in files for r in json.load(open(p))]
        for r in rows:
            k = key(r)
            if r['tier'] != t:
                sys.exit(f'REFUSED: {label(k)} sits in a rows_{t} file')
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
        man = json.load(open(os.path.join(REPO, 'src/content/courses/cashflow', t, 'manifest.json')))
        banks = [(f"ec1{LETTER[t]}_{m['key'].split('-')[0]}.json", 'module', m['key']) for m in man['modules']]
        banks.append((f'ec1{LETTER[t]}_exam.json', 'final', None))
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
        'course': 'cashflow', 'recut': 'PIA 2021 re-cut, phase 2 (branch fix/cashflow-fiscal-pia-recut)',
        'served': 'docs/pia-recut/served/cashflow_questions.json and cashflow_capstones.json (tools/course-waves/fiscal/pia-recut/replay_banks.sh on a local scratch database)',
        'digest': 'tools/course-waves/cashflow/digest.txt (md5 950a84dbee7d53c4d98bf9be0a5ebba1)',
        'counts': dict(collections.Counter(k[0] for k in new)),
        'questions': [
            {'slug': 'cashflow', 'tier': k[0], 'scope': k[1], 'module_key': k[2], 'ord': k[3],
             'fields': [f for f in ('prompt', 'explanation') if new[k][f] != served[k][f]]
                       + [f'options[{i}]' + (' (keyed)' if i == served[k]['answer_index'] else '')
                          for i in range(4) if new[k]['options'][i] != served[k]['options'][i]],
             'why': why[k],
             'old': {f: served[k][f] for f in ('prompt', 'options', 'answer_index', 'explanation')},
             'new': new[k]}
            for k in sorted(new, key=order)],
        'capstones': capstone_changes(),
    }
    edits_txt = json.dumps(edits, ensure_ascii=False, indent=1) + '\n'
    # The whole after-state, served shape (for the answer-length audit and the ship step).
    after = [dict(app_slug='cashflow', tier=k[0], scope=k[1], module_key=k[2], ord=k[3],
                  **{f: new.get(k, served[k])[f] for f in ('prompt', 'options', 'answer_index', 'explanation')})
             for k in sorted(served, key=order)]
    after_txt = json.dumps(after, ensure_ascii=False, indent=1) + '\n'
    # The committed bank SOURCE pairs under tools/course-banks/cashflow/<tier>/:
    # a .py that holds the questions and emits the .json beside it through the
    # emit contract (check-bank-sources.py runs every .py and compares bytes).
    pairs = {}
    for t in TIERS:
        man = json.load(open(os.path.join(REPO, 'src/content/courses/cashflow', t, 'manifest.json')))
        banks = [(f"ec1{LETTER[t]}_{m['key'].split('-')[0]}", 'module', m['key'], m.get('title', m['key'])) for m in man['modules']]
        banks.append((f'ec1{LETTER[t]}_exam', 'final', None, 'final exam'))
        for stem, scope, mk, title in banks:
            rel = f'tools/course-banks/cashflow/{t}/{stem}'
            rows = [new.get(k, served[k]) for k in sorted((k for k in served if k[:3] == (t, scope, mk)), key=lambda k: k[3])]
            src = ["import sys; sys.path.insert(0, '/root/dc-wavekit')",
                   'from bankkit import emit, finish',
                   'Q=[]',
                   'def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))',
                   '',
                   f'# EC1 cashflow, {t} tier, {title}. Reconstructed from the served rows (the applied',
                   '# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;',
                   '# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.',
                   '']
            for r in rows:
                a = r['answer_index']
                ds = [o for i, o in enumerate(r['options']) if i != a]
                src.append(f"q({a},\n {json.dumps(r['prompt'], ensure_ascii=False)},\n {json.dumps(r['options'][a], ensure_ascii=False)},\n ["
                           + ',\n  '.join(json.dumps(d, ensure_ascii=False) for d in ds) + f"],\n {json.dumps(r['explanation'], ensure_ascii=False)})\n")
            src += [f"emit(Q, '/root/wt-ec7-recut/{rel}.json', expect_n={len(rows)})", 'finish()', '']
            out_json = [{'prompt': r['prompt'], 'options': r['options'], 'answer': r['answer_index'], 'explanation': r['explanation']} for r in rows]
            pairs[rel + '.py'] = '\n'.join(src)
            pairs[rel + '.json'] = json.dumps(out_json, indent=1, ensure_ascii=False)
    bank_dir = os.path.join(HERE, 'banks')
    if check:
        bad = [fn for fn, txt in out.items()
               if not os.path.exists(os.path.join(bank_dir, fn)) or open(os.path.join(bank_dir, fn)).read() != txt]
        if not os.path.exists(EDITS) or open(EDITS).read() != edits_txt:
            bad.append('cashflow_edits.json')
        if not os.path.exists(AFTER) or open(AFTER).read() != after_txt:
            bad.append('cashflow_after.json')
        for rel, txt in pairs.items():
            p = os.path.join(REPO, rel)
            if not os.path.exists(p) or open(p).read() != txt:
                bad.append(rel)
        if bad:
            sys.exit('DRIFT: ' + ', '.join(bad))
        print(f'build --check: clean, {len(new)} changed rows')
        return
    os.makedirs(bank_dir, exist_ok=True)
    for fn, txt in out.items():
        open(os.path.join(bank_dir, fn), 'w').write(txt)
    open(EDITS, 'w').write(edits_txt)
    open(AFTER, 'w').write(after_txt)
    for rel, txt in pairs.items():
        os.makedirs(os.path.dirname(os.path.join(REPO, rel)), exist_ok=True)
        open(os.path.join(REPO, rel), 'w').write(txt)
    print(f'wrote {len(out)} banks and {len(new)} changed rows: ' + ', '.join(f'{t} {edits["counts"].get(t, 0)}' for t in TIERS))


if __name__ == '__main__':
    main()
