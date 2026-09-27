#!/usr/bin/env python3
"""GATE: no run of eight words from a licensed or reserved text appears in
anything a learner reads, or in the pack a writer copies from.

WHICH TEXTS. Every source the pack holds a fetched text of whose quote policy
is 'concept' (licensed or all rights reserved: taught in the course's own
words) or 'short-quote' (quotable only briefly). A concept-only source with no
fetched text (the AIPN and LOGIC model contracts, FIDIC, ISO 44001, CIPS,
Kraljic's article) cannot be swept by its words, and is listed; the
vocabulary gate refuses any line framing a quotation as one of them.

HOW. Every text is reduced to lower-case word tokens, hyphens at a line break
joined; every run of EIGHT consecutive tokens of a held text is a fingerprint,
and any eight-token run of a swept file found among them fails with the file,
the line and the run.

PUBLIC WORDS ARE NOT LICENSED WORDS. A run that a quotable public text also
prints (the NCDMB copy of the content Act prints the words of the Act) is
removed from the fingerprints before the sweep.

A PERMITTED QUOTATION IS NOT A BREACH. The exact text of every QUOTED passage
(gate_quotes.py proves each is word for word from a source whose policy allows
it, and a short-quote passage at most 40 words) is masked wherever it appears
before the sweep, and so is each source's title, publisher, edition and the
licence statement it prints (the citation the pack must print). Nothing else is
masked.

SWEPT: the pack's BY CONCEPT passages and the rest of the pack, every lesson
body and manifest title, every bank string, the practice course pages and the
writer briefs (a brief copied into a lesson is a lesson).

    python3 gate_licensed_prose.py [--plant | --plant-lesson]

--plant appends twelve consecutive words of the first held text to the pack in
memory; --plant-lesson plants them in an in-memory lesson. Each must exit 1
with the plant caught. Exit 0 clean, 1 a breach, 2 could not run.
"""
import os
import re
import sys
import packlib as K

N = 8


def toks(t):
    t = t.replace('’', "'").replace('‘', "'")
    t = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', t)
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", t.lower())


def grams(ts):
    return {tuple(ts[i:i + N]) for i in range(len(ts) - N + 1)}


def main():
    srcs = K.sources()
    held = [s for s in srcs if s['quote_policy'] in ('concept', 'short-quote') and s.get('txt')]
    unheld = [s for s in srcs if s['quote_policy'] == 'concept' and not s.get('txt')]
    fp, owner, sample = set(), {}, None
    for s in held:
        ts = toks(K.source_text(s))
        g = grams(ts)
        fp |= g
        for x in g:
            owner.setdefault(x, s['id'])
        if sample is None and len(ts) > 400:
            sample = (s['id'], ' '.join(ts[300:312]))
    # PUBLIC WORDS ARE NOT LICENSED WORDS. An eight-word run that a quotable
    # public text also prints (the NCDMB copy of the content Act prints the
    # Act, which the FAOLEX copy prints too) is removed from the fingerprints.
    public = set()
    for s in srcs:
        if s['quote_policy'] == 'quote' and s.get('txt'):
            public |= grams(toks(K.source_text(s)))
    shared = len(fp & public)
    fp -= public
    masks = [p['text'] for p in K.passages() if p['mode'] == 'quote']
    # A CITATION IS NOT PROSE. A source's title, publisher, edition and the
    # licence statement it prints are bibliographic data the pack must print
    # to cite it; each is masked wherever it appears exactly.
    for s in srcs:
        masks += [s[k] for k in ('title', 'publisher', 'edition', 'licence') if s.get(k)]
    masks.sort(key=len, reverse=True)  # the longest first, so no mask breaks a longer one
    texts = [('PACK.md', open(os.path.join(K.HERE, 'PACK.md'), encoding='utf-8').read())]
    for tier, mkey, lkey, _title, _t, _p, text in K.lessons():
        if text is not None:
            texts.append((f'{tier}/{mkey}/{lkey}.md', text))
    texts += K.manifest_titles() + K.bank_strings()
    for p in K.APP_TEXT + K.BRIEFS:
        if os.path.exists(p):
            texts.append((os.path.basename(p), open(p, encoding='utf-8').read()))
    plant = next((a for a in sys.argv[1:] if a.startswith('--plant')), None)
    if plant:
        if not sample:
            print('  GATE REFUSES: no held licensed text long enough to plant from')
            return 2
        if plant == '--plant':
            texts[0] = (texts[0][0], texts[0][1] + '\n' + sample[1] + '\n')
        else:
            texts.append(('planted lesson', sample[1]))
    hits = []
    for label, t in texts:
        for m in masks:
            t = t.replace(m, ' ')
        for i, line in enumerate(t.split('\n'), 1):
            ts = toks(line)
            for j in range(len(ts) - N + 1):
                g = tuple(ts[j:j + N])
                if g in fp:
                    hits.append((label, i, owner[g], ' '.join(g)))
                    break
    print(f'  licensed or reserved texts held and fingerprinted: {len(held)} '
          f'({", ".join(s["id"] for s in held) or "none"}), {len(fp)} eight-word runs '
          f'({shared} runs a quotable public text also prints were removed)')
    print(f'  concept-only texts with no copy held (swept by the vocabulary gate only): '
          f'{", ".join(s["id"] for s in unheld) or "none"}')
    print(f'  swept: {len(texts)} texts; quoted passages masked: {len(masks)}')
    print(f'  BREACHES: {len(hits)}')
    for label, i, sid, run in hits[:40]:
        print(f'   {label}:{i} carries eight words of {sid}: "{run}"')
    if not held:
        print('  GATE REFUSES: no licensed or reserved text is held, so nothing could be fingerprinted')
        return 2
    if plant:
        want = 'PACK.md' if plant == '--plant' else 'planted lesson'
        got = [h for h in hits if h[0] == want]
        print(f'  NEGATIVE CONTROL {plant}: twelve words of {sample[0]} planted; caught {len(got)}')
        return 1 if got else 2
    return 1 if hits else 0


sys.exit(main())
