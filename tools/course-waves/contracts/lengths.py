#!/usr/bin/env python3
"""SC5 contracts lesson length gate (adapted from EC11 prms, itself EC10 to D1
and H1): PROSE WORDS per lesson, against that lesson's own floor and the wave
ceiling, with the tiers rankable by est_minutes.

    python3 lengths.py                 # all three tiers
    python3 lengths.py --tier advanced # ONE tier
    python3 lengths.py --selftest

WHAT IS COUNTED, MEASURED FROM THE CODE BELOW. Excluded: front matter and
markdown TABLE ROWS (a line starting with a pipe); a practice course carries
no panel line, and one would be excluded too. HEADINGS ARE COUNTED.

THE FLOOR IS PER LESSON AND IT IS READ FROM THE MANIFEST. structure.py declares
420 at 12 estimated minutes, 460 at 13 and 500 at 14, and the scaffold writes
them into every lesson as `min_prose_words` with `max_prose_words` beside it.

At the FOUNDATION every one of the 78 lessons is a stub (its H1 alone), so this
gate exits 1 with 78 UNDER lines; run_gates.py expects exactly that.
"""
import io
import json
import os
import sys

CONTENT = os.environ.get(
    'SC5_CONTENT', '/root/wt-sc5-nextgen/src/content/courses/contracts')
TIERS = ('beginner', 'intermediate', 'advanced')


def prose_words(text):
    """The measure, in one place. Front matter, table rows and panel lines out."""
    if text.startswith('---'):
        parts = text.split('---', 2)
        if len(parts) == 3:
            text = parts[2]
    body = [ln for ln in text.splitlines()
            if not ln.startswith('|') and not ln.startswith('{{panel')]
    return len(' '.join(body).split())


def read_tier(root, tier):
    man = json.load(io.open(f'{root}/{tier}/manifest.json', encoding='utf-8'))
    rows = []
    for mod in man['modules']:
        for les in mod['lessons']:
            path = f"{root}/{tier}/{mod['key']}/{les['key']}.md"
            name = f"{mod['key']}/{les['key']}"
            if not os.path.exists(path):
                rows.append((les['est_minutes'], None, name, les['min_prose_words'],
                             les['max_prose_words']))
                continue
            words = prose_words(io.open(path, encoding='utf-8').read())
            rows.append((les['est_minutes'], words, name, les['min_prose_words'],
                         les['max_prose_words']))
    return rows


def report(root, tiers, out=print):
    bad = 0
    unwritten = 0
    for tier in tiers:
        rows = read_tier(root, tier)
        done = [r for r in rows if r[1] is not None]
        unwritten += len(rows) - len(done)
        out(f'{tier}: {len(done)}/{len(rows)} written')
        for mins, words, name, lo, hi in sorted(done):
            flag = ''
            if words < lo:
                flag = f'  UNDER ITS OWN FLOOR OF {lo}'
            elif words > hi:
                flag = f'  OVER THE CEILING OF {hi}'
            if flag:
                bad += 1
            out(f'  {mins:>2} {words:>4} (floor {lo}) {name}{flag}')
        for mins, words, name, lo, _ in rows:
            if words is None:
                out(f'  {mins:>2}    . (floor {lo}) {name}  NOT WRITTEN YET')
        by = {}
        for mins, words, _, _, _ in done:
            by.setdefault(mins, []).append(words)
        means = [(k, sum(v) / len(v)) for k, v in sorted(by.items())]
        out('  mean by minutes: ' + ' '.join(f'{k}:{v:.0f}' for k, v in means))
        if len(means) > 1 and [m for _, m in means] != sorted(m for _, m in means):
            out('  RANK PROBLEM: the mean length does not rise with est_minutes')
            bad += 1
    out(f'tiers read: {len(tiers)}  out of band: {bad}  not written yet: {unwritten}')
    return bad


def selftest():
    """Both controls fire, and the second is the one the flat floor missed."""
    assert prose_words('---\na: b\n---\n# Head\n\nOne two three.\n| a | b |\n'
                       '{{panel:x}}\n') == 5, 'the heading was not counted'
    assert prose_words('| a | b |\n{{panel:x}}\n') == 0, 'a table row was counted'
    import tempfile
    root = tempfile.mkdtemp(prefix="sc5-lengths-")
    os.makedirs(f'{root}/advanced/m01', exist_ok=True)
    man = {'modules': [{'key': 'm01', 'lessons': [
        {'key': 'l01', 'est_minutes': 14, 'min_prose_words': 500, 'max_prose_words': 560},
        {'key': 'l02', 'est_minutes': 12, 'min_prose_words': 420, 'max_prose_words': 560}]}]}
    io.open(f'{root}/advanced/manifest.json', 'w', encoding='utf-8').write(json.dumps(man))
    io.open(f'{root}/advanced/m01/l01.md', 'w', encoding='utf-8').write('w ' * 430)
    lines = []
    bad = report(root, ('advanced',), out=lines.append)
    joined = '\n'.join(lines)
    assert bad == 1, f'the per-lesson floor did not fire on 430 words at 14 minutes:\n{joined}'
    assert 'UNDER ITS OWN FLOOR OF 500' in joined, joined
    assert 'NOT WRITTEN YET' in joined, 'an unwritten lesson was not reported: ' + joined
    assert 'not written yet: 1' in joined, joined
    print('lengths.py selftest OK: a heading counts, a table row does not, a 430 word '
          'lesson at fourteen minutes is UNDER its own floor of 500 where a flat 420 '
          'floor passed it, and an unwritten lesson is named rather than skipped')
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    tiers = TIERS
    if '--tier' in argv:
        i = argv.index('--tier')
        if i + 1 >= len(argv):
            print('REFUSES: --tier needs a value. Refusing rather than reading all three.')
            return 2
        tier = argv[i + 1]
        if tier not in TIERS:
            print(f'REFUSES: unknown tier "{tier}". Declared: {", ".join(TIERS)}')
            return 2
        tiers = (tier,)
    for tier in tiers:
        if not os.path.exists(f'{CONTENT}/{tier}/manifest.json'):
            print(f'REFUSES: no manifest for {tier} under {CONTENT}')
            return 2
    print(f'[lengths] {CONTENT}, tier(s): {", ".join(tiers)}')
    return 1 if report(CONTENT, tiers) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
