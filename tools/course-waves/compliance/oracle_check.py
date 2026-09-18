#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
already carries a stdlib Python oracle per module, written from the rules
rather than from the JavaScript, and its goldens show each graded EXPORT is
covered. That is not yet proof that the oracle reaches the same answer on
THESE records. So this gate imports the vendored oracles themselves and
computes each graded field from the capstone conditions with the oracle's own
functions, then compares with fields.json exactly.

The capstone conditions are read out of compliance_fields_capstone.mjs by node
and handed over as JSON, so nothing is retyped here. The request sequence on
the UTAPATE plan is decided by the ORACLE's own canRemoveCheckpoint and
canDecideCheckpoint models, so a request the engine and the oracle judge
differently would move the field and fail.

It also runs the teaching digest's own coverage and readiness case through the
ISO oracle and compares the counts the digest prints, as a second population.

Negative control: --plant flips one oracle answer by one and the gate must go
red on exactly that field.
"""
import datetime as dt
import json
import os
import subprocess
import sys

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('AS_ENGINES', '/root/wt-as-compliance-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'assurance'))
import oracle_calendar as OC  # noqa: E402
import oracle_compliance as OCS  # noqa: E402
import oracle_documents as ODC  # noqa: E402
import oracle_quality as OQ  # noqa: E402
import oracle_audit as OA  # noqa: E402
import oracle_iso as OI  # noqa: E402

K = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{WAVE}/compliance_fields_capstone.mjs');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && !(v instanceof Date)) out[k] = v;
console.log(JSON.stringify(out));
"""], capture_output=True, text=True, check=True).stdout)

T = dt.date.fromisoformat(K['AS_OF_YMD'])


def days(d):
    return (d - T).days


def by_id(rows):
    return {r['id']: r for r in rows}


# ------------------------------ EKPE -------------------------------
ob = by_id(K['EKPE_OBLIGATIONS'])
e1, e2, e3, e4 = ob['e1'], ob['e2'], ob['e3'], ob['e4']
e4r = dict(e4, due_date=OCS.roll(e4['due_date'], e4['frequency']).isoformat(),
           last_submitted_date=K['EKPE_FILINGS']['e4'])
ed1, ed2 = K['EKPE_DOCUMENTS']

# ----------------------------- UTAPATE ------------------------------
plan = K['UTAPATE_PLAN']
pts = [dict(p) for p in K['UTAPATE_CHECKPOINTS']]
for rq in K['UTAPATE_REQUESTS']:
    cp = next(p for p in pts if p['id'] == rq['item'])
    if rq['kind'] == 'remove':
        if OQ.o_can_remove_checkpoint(cp, plan)['ok']:
            pts = [p for p in pts if p['id'] != rq['item']]
    else:
        if OQ.o_can_decide(cp, rq['status'], rq['patch'])['ok']:
            pts = [dict(p, **rq['patch'], status=rq['status']) if p['id'] == rq['item'] else p for p in pts]
qs = OQ.o_summarise({'plans': [plan], 'checkpoints': K['UTAPATE_CHECKPOINTS'], 'ncrs': K['UTAPATE_NCRS'], 'capas': []}, T)

# ----------------------------- OBEAKPU ------------------------------
data = {'clauses': K['OBEAKPU_CLAUSES'], 'findings': K['OBEAKPU_FINDINGS'], 'actions': K['OBEAKPU_ACTIONS'],
        'audits': K['OBEAKPU_AUDITS'], 'auditClauses': K['OBEAKPU_AUDIT_CLAUSES']}
ready = OI.certification_readiness(K['OBEAKPU_STANDARD'], data, T)


def cov(ref):
    return next(r for r in ready['coverage'] if r['clause_ref'] == ref)


f1 = next(f for f in K['OBEAKPU_FINDINGS'] if f['id'] == 'of1')

ORACLE = {
    'ekpe_emissions_permit_next_action_days': OCS.explain(e1, T)['daysUntil'],
    'ekpe_community_report_next_due_days': days(OCS.roll(e2['due_date'], e2['frequency'])),
    'ekpe_waste_return_period_start_days': days(OCS.period_start(e3['due_date'], e3['frequency'])),
    'ekpe_abstraction_next_action_after_filing_days': OCS.explain(e4r, T)['daysUntil'],
    'ekpe_slug_catcher_procedure_review_days': days(ODC.next_review(ed1['issue_date'], ed1['review_period_months'])),
    'ekpe_emergency_plan_review_days': days(ODC.next_review(ed2['issue_date'], ed2['review_period_months'])),
    'utapate_itp_progress_pct': OQ.o_plan_progress(K['UTAPATE_CHECKPOINTS'])['percent'],
    'utapate_itp_progress_after_requests_pct': OQ.o_plan_progress(pts)['percent'],
    'utapate_oldest_open_ncr_days': qs['oldestOpenNcrDays'],
    'utapate_mean_open_ncr_age_days': qs['meanOpenNcrAgeDays'],
    'utapate_checklist_progress_pct': OA.checklist_progress(K['UTAPATE_ITEMS'], K['UTAPATE_RESPONSES'])['percent'],
    'utapate_programme_delivered_pct': OA.programme_progress(K['UTAPATE_AUDITS'], T)['percent'],
    'obeakpu_clause_812_last_examined_days': days(dt.date.fromisoformat(cov('8.1.2')['lastExaminedOn'])),
    'obeakpu_clause_93_last_examined_days': days(dt.date.fromisoformat(cov('9.3')['lastExaminedOn'])),
    'obeakpu_closed_major_finding_age_days': OI.finding_age(f1, T),
    'obeakpu_evidenced_claims': ready['counts']['evidenced'],
    'obeakpu_certificate_days': ready['counts']['certificateDays'],
    'obeakpu_clauses_covered': ready['counts']['covered'],
}
if '--plant' in sys.argv:
    ORACLE['utapate_mean_open_ncr_age_days'] += 1




def main():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    bad = []
    print(f'  oracle modules: {", ".join(m.__name__ for m in (OC, OCS, ODC, OQ, OA, OI))}')
    for tier, key, value, tol in fields:
        o = ORACLE.get(key)
        same = o is not None and abs(o - value) <= tol
        print(f"  {'OK  ' if same else 'DIFF'} {tier:<13} {key:<48} engine {value:>6}  oracle {o}")
        if not same:
            bad.append(key)
    # The exact-half guard is RETIRED after ASC-0: every percent now rounds
    # half up on the exact rational in the engine and the oracle alike, and
    # the per-field comparison above would catch any divergence directly.
    halves = []
    # A second population: the teaching digest's own ORASHI readiness counts.
    sys.path.insert(0, WAVE)
    F = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const F = await import('{WAVE}/compliance_fields.mjs');
console.log(JSON.stringify({{ std: F.ORASHI_STANDARD, clauses: F.ORASHI_CLAUSES, findings: F.ORASHI_FINDINGS, actions: F.ORASHI_ACTIONS, audits: F.ORASHI_AUDITS, auditClauses: F.ORASHI_AUDIT_CLAUSES }}));
"""], capture_output=True, text=True, check=True).stdout)
    tr = OI.certification_readiness(F['std'], F, T)
    digest = open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    teach_bad = [k for k, v in tr['counts'].items() if f'| {k} | {"null" if v is None else str(v).lower()} |' not in digest]
    print(f"  teaching ORASHI readiness counts checked against the ISO oracle: {len(tr['counts'])}, disagreeing: {len(teach_bad)} {teach_bad}")
    if len(fields) != 18:
        print('  GATE REFUSES: fields.json does not hold eighteen fields')
        return 2
    print(f'  graded fields the oracle reproduces: {18 - len(bad)} of 18')
    return 1 if (bad or halves or teach_bad) else 0


sys.exit(main())
