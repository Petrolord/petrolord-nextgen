#!/usr/bin/env python3
"""GATE: every QUOTED passage in the pack is word for word in its source text,
and only a source whose licence allows quotation is ever quoted.

For each passage of mode 'quote': its source carries a fetched text and a
quote_policy of 'quote' or 'short-quote'; the quotation, normalised the one
way packlib.norm normalises (typographic quotes made plain, soft hyphens and
line-break hyphens joined, whitespace collapsed), is a substring of the
normalised source text; a 'short-quote' passage is at most 40 words. A source
whose policy is 'concept' is never quoted.

    python3 gate_quotes.py [--plant]

--plant is THE NEGATIVE CONTROL: it changes one word of the first quoted
passage in memory and quotes a concept-only source, and must exit 1 with both
caught.

Exit 0 clean, 1 a breach, 2 could not run (no passage, no quotation, a text
missing).
"""
import sys
import packlib as K

SHORT_MAX = 40


def main():
    try:
        srcs = {s['id']: s for s in K.sources()}
        ps = K.passages()
    except FileNotFoundError as e:
        print(f'  GATE REFUSES: {e}')
        return 2
    quotes = [dict(p) for p in ps if p['mode'] == 'quote']
    plant = '--plant' in sys.argv
    if plant and quotes:
        words = quotes[0]['text'].split()
        words[len(words) // 2] = words[len(words) // 2] + 'x'
        quotes[0]['text'] = ' '.join(words)
        concept = next((s for s in srcs.values() if s['quote_policy'] == 'concept'), None)
        if concept:
            quotes.append({'id': 'PLANT', 'source': concept['id'], 'mode': 'quote', 'text': 'a planted quotation of a concept-only text', 'locator': 'x'})
    if not quotes:
        print('  GATE REFUSES: the pack holds no quoted passage, so nothing was checked')
        return 2
    cache, bad = {}, []
    for p in quotes:
        s = srcs.get(p['source'])
        if s is None:
            bad.append((p['id'], 'unknown source'))
            continue
        if s['quote_policy'] not in ('quote', 'short-quote'):
            bad.append((p['id'], f"{s['id']} is {s['quote_policy']}: it may not be quoted"))
            continue
        if s['quote_policy'] == 'short-quote' and len(p['text'].split()) > SHORT_MAX:
            bad.append((p['id'], f"{s['id']} allows only a short quotation, and this one is {len(p['text'].split())} words"))
        if s['id'] not in cache:
            try:
                t = K.source_text(s)
            except FileNotFoundError as e:
                print(f'  GATE REFUSES: {e}')
                return 2
            if t is None:
                bad.append((p['id'], f"{s['id']} has no fetched text to check a quotation against"))
                continue
            cache[s['id']] = K.norm(t)
        if K.norm(p['text']) not in cache[s['id']]:
            bad.append((p['id'], f"not found word for word in {s['id']} ({s.get('txt')})"))
    print(f'  quoted passages checked: {len(quotes)} across {len(cache)} source texts')
    print(f'  BREACHES: {len(bad)}')
    for pid, why in bad:
        print(f'   {pid}: {why}')
    if plant:
        caught = [b for b in bad if b[0] in (quotes[0]['id'], 'PLANT')]
        print(f'  NEGATIVE CONTROL: a changed word and a quoted concept-only text were planted; caught {len(caught)} of 2')
        return 1 if len(caught) == 2 else 2
    return 1 if bad else 0


sys.exit(main())
