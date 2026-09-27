#!/usr/bin/env python3
"""PORTFOLIO (EC5) RE-CUT, THE QUESTION BANKS: served rows + writers' rows -> banks and edits.

Portfolio had no committed bank sources (no tools/course-banks/portfolio). The
served rows are what the applied migrations leave: tools/course-waves/ec45-recut/
replay_banks.sh replays every migration that writes the decision and portfolio
banks on a LOCAL scratch Postgres (never production) and dumps them;
docs/ec45-recut/served/questions.json carries both courses and this script reads
the 396 portfolio rows, docs/ec45-recut/served/capstones.json the capstones.

W3 (20261026_w3_portfolio) rewrote the three capstone PROMPTS only and no
question row, so every question's pre-W3 and post-W3 served text is the same
text; the edits file says so per row. The one capstone change (the Expert
dataset line) is recorded with the prompt in both its pre-W3 and post-W3 forms.

Writers change a question by giving its FULL new row in rows_<tier>[_<part>].json:
  {tier, scope, module_key, ord, prompt, options, answer_index, explanation, why}
This script REFUSES a row that is not served, a moved answer_index, an option
count other than four, options that are no longer distinct, an em or en dash,
an "X, not Y" contrastive in any changed field, a row that changes nothing, and
a row given twice. It writes:

  banks/ec5{b,i,a}_{m01..m06,exam}.json     the whole after-state, bankkit shape
  docs/ec45-recut/portfolio_after.json      all 396 rows after the re-cut, served shape
  tools/course-banks/portfolio/<tier>/      the committed bank source pairs (.py emits .json)
  docs/ec45-recut/portfolio_edits.json      every changed row, old (pre- and post-W3)
                                            and new in full, and the capstone edit

    python3 build.py [--check]     (--check writes nothing and fails on drift)
"""
import glob, json, os, re, sys, collections, hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
TIERS = ['beginner', 'intermediate', 'advanced']
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
DASH = re.compile('[—–]')
CONTRAST = re.compile(r',\s+not\s+\w', re.I)
EDITS = os.path.join(REPO, 'docs', 'ec45-recut', 'portfolio_edits.json')
SERVED = os.path.join(REPO, 'docs', 'ec45-recut', 'served', 'questions.json')
AFTER = os.path.join(REPO, 'docs', 'ec45-recut', 'portfolio_after.json')
SERVED_CAPS = os.path.join(REPO, 'docs', 'ec45-recut', 'served', 'capstones.json')
DIGEST = os.path.join(REPO, 'tools', 'course-waves', 'portfolio', 'digest.txt')
W3_APPENDED = (' Read the figures in the Capital Portfolio Studio with its Full precision switch on (at the top of the '
               'page): it prints them to the precision this capstone grades, with no digit grouping.')
# The one capstone change (lead decision 3): the Expert dataset line loses "repaired".
CAPSTONE_EDIT = {'tier': 'advanced', 'field': 'dataset',
                 'old': 'the IDOHO inventory and the IDOHO-2 AFE, read through the repaired risk summary and the partner split',
                 'new': 'the IDOHO inventory and the IDOHO-2 AFE, read through the risk summary and the partner split'}


def key(r):
    return (r['tier'], r['scope'], r['module_key'], int(r['ord']))


def label(k):
    t, s, m, o = k
    return f"portfolio {t} {'final' if s == 'final' else 'module ' + m} ord {o}"


def md5(s):
    return hashlib.md5(s.encode('utf-8')).hexdigest()


def capstone_changes():
    caps = [c for c in json.load(open(SERVED_CAPS)) if c['app_slug'] == 'portfolio']
    c = next(x for x in caps if x['tier'] == CAPSTONE_EDIT['tier'])
    if c[CAPSTONE_EDIT['field']] != CAPSTONE_EDIT['old']:
        sys.exit('REFUSED: the served Expert capstone dataset is not the text this edit replaces')
    post = c['prompt']
    if not post.endswith(W3_APPENDED):
        sys.exit('REFUSED: the served Expert capstone prompt does not carry the W3 sentence')
    pre = post[:-len(W3_APPENDED)]
    return [{
        'slug': 'portfolio', 'tier': 'advanced', 'cert_tier': c['cert_tier'], 'title': c['title'],
        'changed': ['dataset'],
        'why': 'Lead decision 3: the one-word Expert capstone edit; "repaired" is repair history in learner text.',
        'graded_fields': 'unchanged: fields (keys, labels, units, expected, tolerances, order) byte-identical; attempts and certificates stand as issued',
        'old': {'dataset': CAPSTONE_EDIT['old']},
        'new': {'dataset': CAPSTONE_EDIT['new']},
        'prompt_unchanged': {
            'note': 'The prompt is not edited. W3 appended one sentence to it; a guard may match either form.',
            'pre_w3': pre, 'pre_w3_md5': md5(pre),
            'post_w3': post, 'post_w3_md5': md5(post),
        },
        'fields': c['fields'],
    }]


def main():
    check = '--check' in sys.argv
    served = {key(r): r for r in json.load(open(SERVED)) if r['app_slug'] == 'portfolio'}
    if len(served) != 396:
        sys.exit(f'REFUSED: served questions.json holds {len(served)} portfolio rows, expected 396')
    new, why = {}, {}
    for t in TIERS:
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

    def banks_of(t):
        man = json.load(open(os.path.join(REPO, 'src/content/courses/portfolio', t, 'manifest.json')))
        out = [(f"ec5{LETTER[t]}_{m['key'].split('-')[0]}", 'module', m['key'], m.get('title', m['key'])) for m in man['modules']]
        out.append((f'ec5{LETTER[t]}_exam', 'final', None, 'final exam'))
        return out

    out = {}
    for t in TIERS:
        for stem, scope, mk, _ in banks_of(t):
            ords = sorted(k[3] for k in served if k[:3] == (t, scope, mk))
            want = 15 if scope == 'module' else 42
            if ords != list(range(1, want + 1)):
                sys.exit(f'REFUSED: {t} {stem} served ords are not 1..{want}')
            bank = []
            for o in ords:
                k = (t, scope, mk, o)
                r = new.get(k, served[k])
                bank.append({'prompt': r['prompt'], 'options': r['options'],
                             'answer': r['answer_index'], 'explanation': r['explanation']})
            out[stem + '.json'] = json.dumps(bank, ensure_ascii=False, indent=1) + '\n'

    order = lambda k: (TIERS.index(k[0]), k[1] != 'final', k[2] or '', k[3])
    F = ('prompt', 'options', 'answer_index', 'explanation')
    edits = {
        'course': 'portfolio',
        'recut': 'EC5 re-cut onto engines fb5a363, phase 2 (branch fix/decision-portfolio-recut)',
        'served': 'docs/ec45-recut/served/questions.json and capstones.json (tools/course-waves/ec45-recut/replay_banks.sh on a local scratch database)',
        'digest': f'tools/course-waves/portfolio/digest.txt (md5 {md5(open(DIGEST).read())})',
        'w3': 'W3 (20261026_w3_portfolio) wrote capstone prompts only; every question row below has one old text, '
              'the same before and after W3 (old_pre_w3 and old_post_w3 are carried and equal).',
        'counts': dict(collections.Counter(k[0] for k in new)),
        'questions': [
            {'slug': 'portfolio', 'tier': k[0], 'scope': k[1], 'module_key': k[2], 'ord': k[3],
             'fields': [f for f in ('prompt', 'explanation') if new[k][f] != served[k][f]]
                       + [f'options[{i}]' + (' (keyed)' if i == served[k]['answer_index'] else '')
                          for i in range(4) if new[k]['options'][i] != served[k]['options'][i]],
             'why': why[k],
             'old_pre_w3': {f: served[k][f] for f in F},
             'old_post_w3': {f: served[k][f] for f in F},
             'new': new[k]}
            for k in sorted(new, key=order)],
        'capstones': capstone_changes(),
    }
    edits_txt = json.dumps(edits, ensure_ascii=False, indent=1) + '\n'
    after = [dict(app_slug='portfolio', tier=k[0], scope=k[1], module_key=k[2], ord=k[3],
                  **{f: new.get(k, served[k])[f] for f in F})
             for k in sorted(served, key=order)]
    after_txt = json.dumps(after, ensure_ascii=False, indent=1) + '\n'
    pairs = {}
    for t in TIERS:
        for stem, scope, mk, title in banks_of(t):
            rel = f'tools/course-banks/portfolio/{t}/{stem}'
            rows = [new.get(k, served[k]) for k in sorted((k for k in served if k[:3] == (t, scope, mk)), key=lambda k: k[3])]
            src = ["import sys; sys.path.insert(0, '/root/dc-wavekit')",
                   'from bankkit import emit, finish',
                   'Q=[]',
                   'def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))',
                   '',
                   f'# EC5 portfolio, {t} tier, {title}. Reconstructed from the served rows (the applied',
                   '# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;',
                   '# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.',
                   '']
            for r in rows:
                a = r['answer_index']
                ds = [o for i, o in enumerate(r['options']) if i != a]
                src.append(f"q({a},\n {json.dumps(r['prompt'], ensure_ascii=False)},\n {json.dumps(r['options'][a], ensure_ascii=False)},\n ["
                           + ',\n  '.join(json.dumps(d, ensure_ascii=False) for d in ds) + f"],\n {json.dumps(r['explanation'], ensure_ascii=False)})\n")
            src += [f"emit(Q, '/root/wt-ec45-recut/{rel}.json', expect_n={len(rows)})", 'finish()', '']
            out_json = [{'prompt': r['prompt'], 'options': r['options'], 'answer': r['answer_index'], 'explanation': r['explanation']} for r in rows]
            pairs[rel + '.py'] = '\n'.join(src)
            pairs[rel + '.json'] = json.dumps(out_json, indent=1, ensure_ascii=False)
    bank_dir = os.path.join(HERE, 'banks')
    if check:
        bad = [fn for fn, txt in out.items()
               if not os.path.exists(os.path.join(bank_dir, fn)) or open(os.path.join(bank_dir, fn)).read() != txt]
        if not os.path.exists(EDITS) or open(EDITS).read() != edits_txt:
            bad.append('portfolio_edits.json')
        if not os.path.exists(AFTER) or open(AFTER).read() != after_txt:
            bad.append('portfolio_after.json')
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
