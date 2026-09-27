"""Read and write the EC4 decision bank sources as data.

load(tier, bank) runs the source with a capturing q() and returns its questions
as dicts in ord order ({ord, prompt, options, answer, explanation}, options in
served order). save(tier, bank, qs) writes the source back in the one layout
make_bank_sources.py uses, and the JSON beside it through the course-banks
serialisation contract, so a source and its JSON never part.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
ROOT = os.path.join(REPO, 'tools/course-waves/ec45-recut/banks/decision')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
sys.path.insert(0, os.path.join(REPO, 'tools/course-banks'))
import emit_contract  # noqa: E402

MODULE_KEYS = {}


def path(tier, bank, ext):
    return os.path.join(ROOT, tier, f'ec4{LETTER[tier]}_{bank}.{ext}')


def load(tier, bank):
    src = open(path(tier, bank, 'py'), encoding='utf-8').read()
    Q = []
    head = src.split('\n# ord 1\n', 1)[0] + '\n'
    body = src[len(head):].rsplit('\nemit(', 1)[0]
    ns = {'Q': Q, 'q': lambda k, p, c, ds, e: Q.append((k, p, c, ds, e))}
    exec(compile(body, path(tier, bank, 'py'), 'exec'), ns)
    out = []
    for i, (k, p, c, ds, e) in enumerate(Q, 1):
        opts = list(ds)
        opts.insert(k, c)
        out.append({'ord': i, 'prompt': p, 'options': opts, 'answer': k, 'explanation': e})
    return out, head


def save(tier, bank, qs, head):
    L = lambda s: json.dumps(s, ensure_ascii=False)
    out_json = path(tier, bank, 'json')
    name = f'ec4{LETTER[tier]}_{bank}'
    lines = [head.rstrip('\n'), '']
    for x in qs:
        k = x['answer']
        opts = list(x['options'])
        assert len(opts) == 4 and len(set(opts)) == 4, (tier, bank, x['ord'])
        key = opts.pop(k)
        lines += [f"# ord {x['ord']}", f"q({k}, {L(x['prompt'])},", f" {L(key)},",
                  f" [{L(opts[0])},", f"  {L(opts[1])},", f"  {L(opts[2])}],", f" {L(x['explanation'])})", '']
    lines += [f"emit(Q, {L(out_json)}, label={L(name)}, expect_n={len(qs)})", 'finish()']
    open(path(tier, bank, 'py'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    Q = []
    for x in qs:
        opts = list(x['options']); key = opts.pop(x['answer'])
        Q.append((x['answer'], x['prompt'], key, opts, x['explanation']))
    emit_contract.emit(Q, out_json, label=name, expect_n=len(qs))


def show(tier, bank, ords):
    qs, _ = load(tier, bank)
    for x in qs:
        if x['ord'] in ords:
            print(f"--- {tier} {bank} ord {x['ord']}  key={x['answer']}")
            print('P:', x['prompt'])
            for i, o in enumerate(x['options']):
                print(f"  [{i}]{'*' if i == x['answer'] else ' '} {o}")
            print('E:', x['explanation'])
