#!/usr/bin/env python3
"""GATE: the capstone and the teaching cases are two separate roads.

Four checks, each printing what it examined:

  1. NAMES. No capstone record name (EKPE, UTAPATE, OBEAKPU) and no capstone
     record code appears in digest.txt, compliance_dump.mjs or
     compliance_fields.mjs; no teaching record name (IKORO, ABAM, ORASHI) and
     no teaching record code appears in compliance_fields_capstone.mjs or in a
     capstone prompt.
  2. DERIVED ANSWER DATES. No date the engine derives on the way to a graded
     day count (read from the engine, never typed) is printed by the digest,
     so a learner cannot look one up there.
  3. CONDITION SETS. No capstone obligation, document, NCR, finding or audit
     carries the same defining dates as a teaching record (a shared record is
     a shared answer, whatever it is called).
  4. THE GOLDENS. No golden case in the vendored assurance goldens carries a
     capstone record's defining dates together in one case, in either
     direction: FC4's repair took a capstone's exact conditions for a golden
     row, and the published file handed back a graded answer.

Negative control: --plant copies one capstone obligation's dates into the
teaching register in memory and one derived date into the digest text, and the
gate must name both.
"""
import glob
import json
import os
import re
import subprocess
import sys

W = os.path.dirname(os.path.abspath(__file__))
ENG = '/root/wt-as-compliance-nextgen/packages/engines'


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


K = node_json(f"""
const K = await import('{W}/compliance_fields_capstone.mjs');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && !(v instanceof Date)) out[k] = v;
console.log(JSON.stringify(out));""")
F = node_json(f"""
const F = await import('{W}/compliance_fields.mjs');
const out = {{}};
for (const [k, v] of Object.entries(F)) if (typeof v !== 'function' && !(v instanceof Date)) out[k] = v;
console.log(JSON.stringify(out));""")
DERIVED = node_json(f"""
const K = await import('{W}/compliance_fields_capstone.mjs');
const {{ loadGuarded }} = await import('{W}/clockguard.mjs');
const {{ G }} = await loadGuarded('{ENG}', K.AS_OF);
const C = G.complianceStatus, D = G.documentControl, CAL = G.calendar;
const o = Object.fromEntries(K.EKPE_OBLIGATIONS.map((x) => [x.id, x]));
const [d1, d2] = K.EKPE_DOCUMENTS;
console.log(JSON.stringify([
  C.rollForward(o.e2.due_date, o.e2.frequency), C.periodStart(o.e3.due_date, o.e3.frequency),
  C.rollForward(o.e4.due_date, o.e4.frequency), D.nextReviewDate(d1.issue_date, d1.review_period_months),
  D.nextReviewDate(d2.issue_date, d2.review_period_months)].map((d) => CAL.toDateOnlyString(d))));""")

DATE = re.compile(r'\d{4}-\d{2}-\d{2}')


def dates_of(rec):
    return frozenset(v for v in rec.values() if isinstance(v, str) and DATE.fullmatch(v))


def records(d, keys):
    out = []
    for k in keys:
        for r in d.get(k, []):
            out.append((k, r))
    return out


def main():
    plant = '--plant' in sys.argv
    digest = open(os.path.join(W, 'digest.txt'), encoding='utf-8').read()
    dump = open(os.path.join(W, 'compliance_dump.mjs'), encoding='utf-8').read()
    teach_src = open(os.path.join(W, 'compliance_fields.mjs'), encoding='utf-8').read()
    cap_src = open(os.path.join(W, 'compliance_fields_capstone.mjs'), encoding='utf-8').read()
    prompts = ' '.join(t['prompt'] for t in json.load(open(os.path.join(W, 'capstone.json')))['tiers'].values())
    if plant:
        digest += f'\nplanted {DERIVED[0]}\n'
        F['IKORO_OBLIGATIONS'] = F['IKORO_OBLIGATIONS'] + [dict(K['EKPE_OBLIGATIONS'][0], id='planted')]
    bad = []

    # 1. names and codes
    cap_names = ['EKPE', 'UTAPATE', 'OBEAKPU']
    teach_names = ['IKORO', 'ABAM', 'ORASHI']
    cap_codes = sorted({r.get(c) for _, r in records(K, ['EKPE_OBLIGATIONS', 'EKPE_DOCUMENTS', 'UTAPATE_NCRS', 'UTAPATE_AUDITS', 'OBEAKPU_AUDITS', 'OBEAKPU_FINDINGS'])
                        for c in ('code', 'document_number', 'ncr_code', 'audit_code', 'finding_code') if r.get(c)}
                       | {K['UTAPATE_PLAN']['plan_code']})
    teach_codes = sorted({r.get(c) for _, r in records(F, ['IKORO_OBLIGATIONS', 'IKORO_DOCUMENTS', 'ABAM_NCRS', 'ABAM_PROGRAMME_AUDITS', 'ORASHI_AUDITS', 'ORASHI_FINDINGS'])
                          for c in ('code', 'document_number', 'ncr_code', 'audit_code', 'finding_code') if r.get(c)}
                         | {F['ABAM_PLAN']['plan_code'], F['ABAM_AUDIT']['audit_code']})
    for n in cap_names + cap_codes:
        for where, text in (('digest.txt', digest), ('compliance_dump.mjs', dump), ('compliance_fields.mjs', teach_src)):
            if re.search(r'\b' + re.escape(n) + r'\b', text, re.I if n in cap_names else 0):
                bad.append(f'capstone name or code {n} appears in {where}')
    for n in teach_names + teach_codes:
        for where, text in (('compliance_fields_capstone.mjs', cap_src), ('the capstone prompts', prompts)):
            if re.search(r'\b' + re.escape(n) + r'\b', text, re.I if n in teach_names else 0):
                bad.append(f'teaching name or code {n} appears in {where}')

    # 2. derived answer dates
    for d in DERIVED:
        if d in digest:
            bad.append(f'the engine-derived answer date {d} is printed by the digest')

    # 3. condition sets against the teaching records
    tkeys = ['IKORO_OBLIGATIONS', 'IKORO_DOCUMENTS', 'ABAM_NCRS', 'ABAM_CHECKPOINTS', 'ABAM_PROGRAMME_AUDITS', 'ORASHI_AUDITS', 'ORASHI_FINDINGS', 'ORASHI_ACTIONS']
    ckeys = ['EKPE_OBLIGATIONS', 'EKPE_DOCUMENTS', 'UTAPATE_NCRS', 'UTAPATE_CHECKPOINTS', 'OBEAKPU_AUDITS', 'OBEAKPU_FINDINGS', 'OBEAKPU_ACTIONS']
    tsets = [(k, r.get('id'), dates_of(r)) for k, r in records(F, tkeys) if dates_of(r)]
    csets = [(k, r.get('id'), dates_of(r)) for k, r in records(K, ckeys) if len(dates_of(r)) >= 2]
    pairs = 0
    for ck, cid, cd in csets:
        for tk, tid, td in tsets:
            pairs += 1
            if cd <= td:
                bad.append(f'capstone {ck}.{cid} dates {sorted(cd)} are all carried by teaching {tk}.{tid}')

    # 4. the goldens
    goldens = sorted(glob.glob(os.path.join(ENG, 'test-data', 'assurance', 'goldens', '*.json')))
    gcases = 0
    for g in goldens:
        for case in json.load(open(g))['cases']:
            gcases += 1
            text = json.dumps(case)
            for ck, cid, cd in csets:
                if all(d in text for d in cd):
                    bad.append(f'golden {os.path.basename(g)} case {case.get("id")} carries every date of capstone {ck}.{cid}')

    print(f'  names and codes swept: {len(cap_names) + len(cap_codes)} capstone, {len(teach_names) + len(teach_codes)} teaching')
    print(f'  engine-derived answer dates swept against the digest: {len(DERIVED)}')
    print(f'  capstone condition sets: {len(csets)} against {len(tsets)} teaching records ({pairs} pairs)')
    print(f'  golden files: {len(goldens)}, cases: {gcases}')
    for b in bad:
        print(f'  LEAK {b}')
    if len(goldens) < 6 or gcases < 500 or len(csets) < 10 or len(cap_codes) < 10:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
