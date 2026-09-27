#!/usr/bin/env python3
"""WRITE concepts.json: every sentence the SC3 digest quotes, with its citation,
the course's paraphrase and an EXACT excerpt of the public text it was read from.

The texts (sources/ in this wave directory, never in the repository), every one
read 2026-09-27:
  HARRIS  F. W. Harris, "How Many Parts to Make at Once", Factory, The Magazine
          of Management 10(2), February 1913, pp. 135-136, 152 (the 1913 text is
          public domain in the US; read in the Operations Research 38(6) 1990
          reprint, pp. 947-950, whose typesetting is not quoted, only the 1913
          words), harris1913.txt
  MIL     MIL-HDBK-338B, Electronic Reliability Design Handbook, 1 October 1998,
          section 5.3.8 and example 5.3.8.1, p. 5-27 (US DoD handbook, public
          domain, distribution A), mil338_pp109.txt

NEVER QUOTED, used for their NUMBERS and LECTURE AND SLIDE NUMBERS only:
  * C. Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lectures 7, 8, 11,
    12 and 13 (MIT OpenCourseWare, CC BY-NC-SA 4.0: non-commercial, and this
    course is sold, so its figures are cited by lecture and slide and no slide
    or slide text is reproduced).
gate_no_ocw_prose.py refuses any run of eight words of the lecture text in
anything a learner reads, and no concept here names it.

Each quote is checked here against its text with whitespace collapsed and
NOTHING else normalised, and the script REFUSES to write if one is not found.
quote_check.py re-checks every quote and that the digest prints each one
exactly.

    python3 make_concepts.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sources')
TEXTS = {'HARRIS': ['harris1913.txt'], 'MIL': ['mil338_pp109.txt']}


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def body_of(text):
    return ' '.join(norm(open(os.path.join(SRC, f), encoding='utf-8').read()) for f in TEXTS[text])


H = 'Harris (1913), Factory 10(2), read in the 1990 reprint'
M = 'MIL-HDBK-338B (1 October 1998)'
# (id, text, cite, quote, paraphrase)
C = [
    ('harris_square_root', 'HARRIS', f'{H} p. 948',
     'the value for X that will give the minimum value to Y, reduces to the square root of (240MS divided by C).',
     'Harris writes the lot size that keeps the combined set-up and carrying cost lowest as a square root, with M the monthly movement, S the set-up cost and C the unit cost; the 240 folds together the twelve months of a year and his ten per cent a year for interest and depreciation.'),
    ('harris_first_lot', 'HARRIS', f'{H} p. 948',
     'Applying the formula, it is found that the theoretical economical size of lot is 2,190 units.',
     'His first worked example, a movement of 1,000 units a month, a set-up cost of two dollars and a unit cost of ten cents, gives a lot he prints as 2,190.'),
    ('harris_stud', 'HARRIS', f'{H} p. 949',
     'The correct quantity is 48.5 or, say, 49.',
     'For the stud of his Figure III he prints the lot and then rounds it to a whole number, a rounding rule stated in words.'),
    ('harris_four_fold', 'HARRIS', f'{H} p. 950',
     'it is of value to know that this consumption must increase four fold to warrant doubling the manufacturing quantities.',
     'Because the lot grows with the square root of demand, the demand must rise four times over before the lot doubles.'),
    ('mil_r_or_fewer', 'MIL', f'{M} section 5.3.8, eq. 5.58',
     'In the case of redundant equipments, the R(t) might be desired in terms of the probability of r or fewer failures in time t.',
     'The handbook states the chance that no more than a stated number of failures happen in a stated time, which is the Poisson cumulative probability.'),
    ('mil_projector', 'MIL', f'{M} example 5.3.8.1, p. 5-27',
     'A slide projector is needed for 500 hours of operation. Replacement of failed lamps is permitted, but there are only two spare bulbs on hand.',
     'The handbook example holds two spares for a mission of a stated length.'),
    ('mil_lamp_rate', 'MIL', f'{M} example 5.3.8.1, p. 5-27',
     'If the lamp failure rate is 0.001 failures per hour, what is the reliability for the mission (i.e., the probability that no more than two lamp failures will occur)?',
     'With a stated failure rate, the question is the chance that the two spares are enough for the whole mission.'),
]


def main():
    body = {k: body_of(k) for k in TEXTS}
    out, bad = [], []
    ids = set()
    for cid, text, cite, quote, para in C:
        q = norm(quote)
        if cid in ids:
            bad.append(f'{cid}: repeated id')
        ids.add(cid)
        n = len(q.split())
        if not (6 <= n <= 50):
            bad.append(f'{cid}: {n} words (6 to 50)')
        if q not in body[text]:
            bad.append(f'{cid}: NOT FOUND in {text}: {q[:90]}')
        if re.search('[—–]', para) or re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b', para, re.I):
            bad.append(f'{cid}: the paraphrase breaks the copy rule')
        if re.search(r'\bCaplice\b|\bESD\.260|OpenCourseWare|\bMIT\b', cite + quote, re.I):
            bad.append(f'{cid}: a licensed text (MIT OpenCourseWare) is never quoted')
        out.append({'id': cid, 'text': text, 'source': ', '.join(TEXTS[text]), 'cite': cite, 'quote': q, 'paraphrase': para, 'found': True})
    if bad:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ' + b)
        sys.exit(1)
    json.dump(out, open(os.path.join(HERE, 'concepts.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    open(os.path.join(HERE, 'concepts.json'), 'a').write('\n')
    per = {}
    for c in out:
        per[c['text']] = per.get(c['text'], 0) + 1
    print(f'concepts.json: {len(out)} quotations, every one found in its text: {per}')


main()
