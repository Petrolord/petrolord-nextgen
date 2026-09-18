#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads while being graded. For each of the
three draft prompts in capstone.json this refuses:

  1. ANY GRADED VALUE OF ANY TIER as a number token in the prompt, signed or
     absolute (a prompt that says "49 days" has handed over -49 as well).
  2. ANY DATE THE ENGINE DERIVED on the way to a graded day count: the rolled
     due date, the period start, the review date. A prompt that prints the
     rolled date has turned the field into counting days on a calendar. The
     dates the learner is GIVEN (a due date, an expiry, an examination date)
     are conditions and belong in the prompt; the gate reads the derived ones
     from the engine rather than from a list somebody typed.

It prints how many prompts, tokens and derived dates it swept, and refuses an
empty sweep. Negative control: --plant appends one graded value and one derived
date to a prompt, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'(?<![\w.-])-?\d+(?:\.\d+)?(?![\w.])')

DERIVED = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{W}/compliance_fields_capstone.mjs');
const {{ loadGuarded }} = await import('{W}/clockguard.mjs');
const {{ G }} = await loadGuarded('/root/wt-as-compliance-nextgen/packages/engines', K.AS_OF);
const C = G.complianceStatus, D = G.documentControl, CAL = G.calendar;
const o = Object.fromEntries(K.EKPE_OBLIGATIONS.map((x) => [x.id, x]));
const [d1, d2] = K.EKPE_DOCUMENTS;
const out = [
  C.rollForward(o.e2.due_date, o.e2.frequency),
  C.periodStart(o.e3.due_date, o.e3.frequency),
  C.rollForward(o.e4.due_date, o.e4.frequency),
  D.nextReviewDate(d1.issue_date, d1.review_period_months),
  D.nextReviewDate(d2.issue_date, d2.review_period_months),
].map((d) => CAL.toDateOnlyString(d));
console.log(JSON.stringify(out));
"""], capture_output=True, text=True, check=True).stdout)


def main():
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    fields = json.load(open(os.path.join(W, 'fields.json')))
    graded = {abs(v): f'{t}.{k}' for t, k, v, _ in fields}
    prompts = {t: cap['tiers'][t]['prompt'] for t in ('beginner', 'intermediate', 'advanced')}
    if '--plant' in sys.argv:
        prompts['beginner'] += f' For reference, the answer is {fields[7][2]} and the rolled date is {DERIVED[0]}.'
    bad, tokens = [], 0
    for tier, text in prompts.items():
        # dates are conditions; strip them before reading number tokens, then
        # check the derived dates separately
        undated = re.sub(r'\d{4}-\d{2}-\d{2}', ' ', text)
        for tok in NUM.findall(undated):
            tokens += 1
            if abs(float(tok)) in graded:
                bad.append(f'{tier} prompt prints {tok}, the graded value of {graded[abs(float(tok))]}')
        for d in DERIVED:
            if d in text:
                bad.append(f'{tier} prompt prints {d}, a date the engine derives on the way to a graded field')
    print(f'  prompts swept: {len(prompts)}; number tokens read: {tokens}; graded values: {len(graded)}; engine-derived dates: {len(DERIVED)} {DERIVED}')
    for b in bad:
        print(f'  LEAK {b}')
    if len(prompts) != 3 or tokens < 30 or len(DERIVED) != 5:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
