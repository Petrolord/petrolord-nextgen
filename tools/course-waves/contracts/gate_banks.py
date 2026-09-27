#!/usr/bin/env python3
"""GATE: the 21 bank sources are the ones structure.py declares, each built to
be audited, and each in the state its stage requires.

For each of the 21 banks (six module banks of 15 and one exam of 42 a tier;
the Expert exam is the written-case bank): the source exists at
banks/<stem>.py; it emits to the LITERAL path /root/cat-wip-contracts/banks/
<stem>.json (the repository's check-bank-sources.py reads literal paths only)
with expect_n equal to the declared count, so bankkit's count gate compares
the bank against its plan; it keeps one passage trace per question (Q and
TRACE); and it is executed here with a stand-in bankkit, which writes nothing.

THE STAGE. At the foundation every bank is EMPTY (the bank writers fill it),
and this gate requires exactly that: a bank with questions before the bank
stage is out of sequence. From SC5_STAGE=banks every bank holds its declared
count, and the real bankkit (bankkit.py in /root/dc-wavekit: the count, key
spread, key pattern, length rank, duplicate and dash gates) is run over each
source and must write its JSON.

    python3 gate_banks.py [--plant]

--plant is THE NEGATIVE CONTROL: it declares one bank's count as 14 in memory
and must exit 1 with that bank named. Exit 0 clean, 1 a breach, 2 could not run.
"""
import os
import subprocess
import sys
import packlib as K


def main():
    plant = '--plant' in sys.argv
    fails, total_q = [], 0
    banks = K.S.banks()
    if len(banks) != 21:
        print(f'  GATE REFUSES: structure.py declares {len(banks)} banks')
        return 2
    for tier, bid, stem, n in banks:
        if plant and stem == 'sc5b_m01':
            n = 14
        py = os.path.join(K.BANKS, f'{stem}.py')
        if not os.path.exists(py):
            fails.append((stem, 'the source is missing'))
            continue
        b = K.read_bank(py)
        want = f'/root/cat-wip-contracts/banks/{stem}.json'
        if b['emit_path'] != want:
            fails.append((stem, f"emits to {b['emit_path']}, and the literal path must be {want}"))
        if b['expect_n'] != n:
            fails.append((stem, f"expect_n is {b['expect_n']}, and structure.py declares {n}"))
        if b['Q'] is None or b['TRACE'] is None or len(b['Q']) != len(b['TRACE']):
            fails.append((stem, 'Q and TRACE are not kept one for one'))
            continue
        total_q += len(b['Q'])
        if K.STAGE == 'foundation':
            if b['Q']:
                fails.append((stem, f"holds {len(b['Q'])} questions at the foundation, which is out of sequence"))
        else:
            if len(b['Q']) != n:
                fails.append((stem, f"holds {len(b['Q'])} of its {n} questions"))
            r = subprocess.run([sys.executable, py], capture_output=True, text=True, cwd=K.BANKS)
            if r.returncode != 0 or not os.path.exists(want):
                fails.append((stem, 'bankkit refused it: ' + ' | '.join((r.stdout + r.stderr).strip().split('\n')[-3:])))
    print(f'  banks declared and found: {len(banks)}; questions held: {total_q}; stage: {K.STAGE}')
    print(f'  BREACHES: {len(fails)}')
    for stem, why in fails:
        print(f'   {stem}: {why}')
    if plant:
        got = [f for f in fails if f[0] == 'sc5b_m01' and 'expect_n' in f[1]]
        print(f'  NEGATIVE CONTROL: sc5b_m01 declared at 14 in memory; caught {len(got)}')
        return 1 if got else 2
    return 1 if fails else 0


sys.exit(main())
