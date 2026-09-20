#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads while being graded. For each of the
three draft prompts in capstone.json this refuses:

  1. ANY GRADED VALUE OF ANY TIER as a number token in the prompt: a token
     within the field's own tolerance of its absolute value, or a token that is
     the value ROUNDED to however many decimals the token prints (a prompt that
     says "85.02" has handed over an efficiency of 85.0216 to two
     places, whatever the tolerance).
  2. ANY ENGINE-DERIVED INTERMEDIATE on the way to a graded field (the heater
     methane, the carbon kilomoles, the oxygen demand, the target efficiency,
     the absolute trap pressure, the pinch temperatures, the baseline, the
     end-year target, the capital recovery factor), read from the engine through
     carbon_capstone.mjs --json rather than typed, in any rounding of three or
     more significant figures. A prompt that prints the baseline has turned
     the gap into a subtraction.

It prints how many prompts, tokens, graded values and intermediates it swept,
and refuses an empty sweep. Negative control: --plant appends one graded value
and one intermediate to a prompt, and the gate must name both.
"""
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')
OUT = json.loads(subprocess.run(['node', f'{W}/carbon_capstone.mjs', '--json'], capture_output=True, text=True, check=True).stdout)
GRADED = [(f['tier'], f['key'], f['value'], f['tol']) for f in OUT['fields']]
DERIVED = OUT['derived']


def sig(tok):
    return len(tok.lstrip('-').replace('.', '').lstrip('0'))


def is_rounding(tok, value):
    dec = len(tok.split('.')[1]) if '.' in tok else 0
    return abs(abs(float(tok)) - abs(value)) <= 0.5 * 10 ** -dec + 1e-12


def main():
    cap = json.load(open(os.path.join(W, 'capstone.json')))
    prompts = {t: cap['tiers'][t]['prompt'] for t in ('beginner', 'intermediate', 'advanced')}
    if '--plant' in sys.argv:
        prompts['beginner'] += f' For reference: {GRADED[13][2]:.2f} and {DERIVED["igrita_trap_bar_a"]:.3f}.'
    bad, tokens = [], 0
    for tier, text in prompts.items():
        for tok in NUM.findall(text):
            tokens += 1
            v = float(tok)
            for t, k, val, tol in GRADED:
                if abs(abs(v) - abs(val)) <= tol or (sig(tok) >= 2 and is_rounding(tok, val)):
                    bad.append(f'{tier} prompt prints {tok}, the graded value of {t}.{k} ({val})')
            for k, val in DERIVED.items():
                if sig(tok) >= 3 and is_rounding(tok, val):
                    bad.append(f'{tier} prompt prints {tok}, the engine-derived {k} ({val})')
    print(f'  prompts swept: {len(prompts)}; number tokens read: {tokens}; graded values: {len(GRADED)}; '
          f'engine-derived intermediates: {len(DERIVED)}')
    for b in bad:
        print(f'  LEAK {b}')
    if len(prompts) != 3 or tokens < 60 or len(GRADED) != 18 or len(DERIVED) < 10:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
