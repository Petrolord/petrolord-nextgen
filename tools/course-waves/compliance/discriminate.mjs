// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it? A field
// no error moves grades nothing, whatever the prompt claims it tests.
//
// Every wrong route is the ENGINE asked the wrong question (the wrong date, the
// wrong record set, a rule skipped) or the one piece of arithmetic a learner
// most plausibly does instead, and each is named for the mistake. Every field
// here is an integer graded exactly, so a route is BLIND only when it lands on
// the right answer; the table also prints the CLOSEST MISS in whole units,
// because "it moved" and "it moved enough to be caught" are two claims, and for
// an exact integer the smallest possible miss is one.
//
// Usage: node discriminate.mjs   (exit 1 on any WEAK field, 2 on a refusal)
import fs from 'fs';
import * as K from './compliance_fields_capstone.mjs';
import { loadGuarded } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.AS_ENGINES || '/root/wt-as-compliance-nextgen/packages/engines';
const T = K.AS_OF;
const { G } = await loadGuarded(ROOT, T);
const CAL = G.calendar; const C = G.complianceStatus; const D = G.documentControl;
const Q = G.qualityAssurance; const I = G.isoCompliance; const A = G.auditManagement;
const du = (d) => CAL.daysUntil(d, T);
const ymd = (d) => CAL.toDateOnlyString(d);
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));
const byId = (rows) => new Map(rows.map((r) => [r.id, r]));
const pct = (n, d) => Math.round((n / d) * 100);
const addDays = (s, n) => { const d = CAL.parseDateOnly(s); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
/* JavaScript's own month arithmetic with no month-end pull-back: the route a
 * learner takes who adds months on a calendar and lets the 31st spill over. */
const addMonthsNoClamp = (s, m) => { const d = CAL.parseDateOnly(s); return new Date(d.getFullYear(), d.getMonth() + m, d.getDate()); };

/* ------------------------------ EKPE ------------------------------ */
const ob = byId(K.EKPE_OBLIGATIONS);
const e1 = ob.get('e1'); const e2 = ob.get('e2'); const e3 = ob.get('e3'); const e4 = ob.get('e4');
const [ed1, ed2] = K.EKPE_DOCUMENTS;
const e4Roll = C.rollForward(e4.due_date, e4.frequency);

/* ---------------------------- UTAPATE ----------------------------- */
const cps = K.UTAPATE_CHECKPOINTS;
const count = (pts, pred) => pts.filter(pred).length;
const resolved = (pts) => count(pts, (c) => Q.isResolved(c));
const applyAll = (pts, reqs, honour) => {
  let out = pts.map((p) => ({ ...p }));
  for (const rq of reqs) {
    const cp = out.find((p) => p.id === rq.item);
    const v = rq.kind === 'remove' ? Q.canRemoveCheckpoint(cp, K.UTAPATE_PLAN) : Q.canDecideCheckpoint(cp, rq.status, rq.patch);
    if (honour && !v.ok) continue;
    out = rq.kind === 'remove' ? out.filter((p) => p.id !== rq.item) : out.map((p) => (p.id === rq.item ? { ...p, ...rq.patch, status: rq.status } : p));
  }
  return out;
};
const after = applyAll(cps, K.UTAPATE_REQUESTS, true);
const ncrs = K.UTAPATE_NCRS;
const openAges = ncrs.filter((n) => Q.isNcrOpen(n)).map((n) => Q.ncrAgeDays(n, T));
const toToday = (n) => du(n.raised_date) * -1; // age to the as-of date whatever the status
const items = K.UTAPATE_ITEMS; const resp = K.UTAPATE_RESPONSES;
const prog = A.checklistProgress(items, resp);
const audits = K.UTAPATE_AUDITS;
const nStatus = (s) => audits.filter((a) => s.includes(a.status)).length;

/* ---------------------------- OBEAKPU ----------------------------- */
const std = K.OBEAKPU_STANDARD;
const data = { clauses: K.OBEAKPU_CLAUSES, findings: K.OBEAKPU_FINDINGS, actions: K.OBEAKPU_ACTIONS, audits: K.OBEAKPU_AUDITS, auditClauses: K.OBEAKPU_AUDIT_CLAUSES };
const ready = I.certificationReadiness(std, data, T);
const auditsAs = (patch) => K.OBEAKPU_AUDITS.map((a) => ({ ...a, ...(patch[a.id] || {}) }));
const readyWith = (audits2, extra = {}) => I.certificationReadiness({ ...std, ...extra }, { ...data, audits: audits2 }, T);
const lastOf = (r, ref) => r.coverage.find((x) => x.clause_ref === ref).lastExaminedOn;
const f1 = K.OBEAKPU_FINDINGS.find((f) => f.id === 'of1');
const cbAsInternal = { 'ob-cb': { audit_type: 'Internal' } };
const inProgressAsReported = { 'ob-2026b': { status: 'Reported' } };
const cancelledCounts = { 'ob-2025x': { status: 'Closed' } };
const allExaminationRows = (ref) => K.OBEAKPU_AUDIT_CLAUSES.filter((r) => r.clause_id === K.OBEAKPU_CLAUSES.find((c) => c.clause_ref === ref).id);
const latestRowAnyResult = (ref) => allExaminationRows(ref).filter((r) => ['ob-2023', 'ob-2025', 'ob-2026'].includes(r.audit_id))
  .map((r) => r.examined_on).sort().pop();
const claimsCount = K.OBEAKPU_CLAUSES.filter((c) => I.isApplicable(c) && I.claimsConformity(c)).length;
const withEvidenceRefOnly = K.OBEAKPU_CLAUSES.filter((c) => I.isApplicable(c) && I.claimsConformity(c) && String(c.evidence_reference || '').trim()).length;
const conformantOnlyEvidenced = K.OBEAKPU_CLAUSES.filter((c) => I.isApplicable(c) && c.status === 'Conformant' && I.hasEvidenceRecord(c)).length;

const TRUTH = {};
const WRONG = {
  ekpe_emissions_permit_next_action_days: {
    truth: C.explainStatus(e1, T).daysUntil,
    routes: {
      counted_to_the_due_date_not_the_expiry: du(e1.due_date),
      lead_time_taken_off_the_count: C.explainStatus(e1, T).daysUntil - e1.lead_time_days,
      counted_inclusive_of_both_days: du(e1.expiry_date) + 1,
    },
  },
  ekpe_community_report_next_due_days: {
    truth: du(C.rollForward(e2.due_date, e2.frequency)),
    routes: {
      rolled_from_the_filing_date: du(C.rollForward(K.EKPE_FILINGS.e2, e2.frequency)),
      six_months_with_no_month_end_pull_back: du(addMonthsNoClamp(e2.due_date, 6)),
      rolled_by_a_quarter: du(C.rollForward(e2.due_date, 'Quarterly')),
      one_hundred_and_eighty_two_days_added: du(addDays(e2.due_date, 182)),
    },
  },
  ekpe_waste_return_period_start_days: {
    truth: du(C.periodStart(e3.due_date, e3.frequency)),
    routes: {
      six_months_back_with_no_month_end_pull_back: du(addMonthsNoClamp(e3.due_date, -6)),
      period_taken_as_a_year: du(C.periodStart(e3.due_date, 'Annual')),
      the_last_filing_taken_as_the_period_start: du(e3.last_submitted_date),
      one_hundred_and_eighty_two_days_back: du(addDays(e3.due_date, -182)),
    },
  },
  ekpe_abstraction_next_action_after_filing_days: {
    truth: C.explainStatus({ ...e4, due_date: ymd(e4Roll), last_submitted_date: K.EKPE_FILINGS.e4 }, T).daysUntil,
    routes: {
      rolled_from_the_filing_date: C.explainStatus({ ...e4, due_date: ymd(C.rollForward(K.EKPE_FILINGS.e4, e4.frequency)) }, T).daysUntil,
      the_filing_not_rolled_at_all: C.explainStatus(e4, T).daysUntil,
      the_expiry_taken_as_the_next_action: du(e4.expiry_date),
      rolled_by_a_month: C.explainStatus({ ...e4, due_date: ymd(C.rollForward(e4.due_date, 'Monthly')) }, T).daysUntil,
    },
  },
  ekpe_slug_catcher_procedure_review_days: {
    truth: du(D.nextReviewDate(ed1.issue_date, ed1.review_period_months)),
    routes: {
      counted_from_the_correction: du(D.nextReviewDate(ed1.corrected_on, ed1.review_period_months)),
      default_period_used: du(D.nextReviewDate(ed1.issue_date, G.documentControl.DEFAULT_REVIEW_PERIOD_MONTHS)),
      counted_from_the_as_of_date: du(D.nextReviewDate(K.AS_OF_YMD, ed1.review_period_months)),
    },
  },
  ekpe_emergency_plan_review_days: {
    truth: du(D.nextReviewDate(ed2.issue_date, ed2.review_period_months)),
    routes: {
      no_month_end_pull_back: du(addMonthsNoClamp(ed2.issue_date, ed2.review_period_months)),
      default_period_used: du(D.nextReviewDate(ed2.issue_date, G.documentControl.DEFAULT_REVIEW_PERIOD_MONTHS)),
      period_read_as_twelve_months: du(D.nextReviewDate(ed2.issue_date, 12)),
    },
  },
  utapate_itp_progress_pct: {
    truth: Q.planProgress(cps).percent,
    routes: {
      failed_point_counted_as_done: pct(resolved(cps) + count(cps, (c) => c.status === 'Failed'), cps.length),
      not_applicable_left_out_of_the_denominator: pct(count(cps, (c) => ['Passed', 'Waived'].includes(c.status)), cps.length - count(cps, (c) => c.status === 'Not applicable')),
      only_passed_points_counted: pct(count(cps, (c) => c.status === 'Passed'), cps.length),
      hold_points_only: Q.planProgress(cps.filter((c) => Q.isBlockingPoint(c))).percent,
    },
  },
  utapate_itp_progress_after_requests_pct: {
    truth: Q.planProgress(after).percent,
    routes: {
      every_request_applied_as_sent: Q.planProgress(applyAll(cps, K.UTAPATE_REQUESTS, false)).percent,
      the_removals_ignored: Q.planProgress(applyAll(cps, K.UTAPATE_REQUESTS.filter((r) => r.kind !== 'remove'), true)).percent,
      the_plan_as_recorded: Q.planProgress(cps).percent,
      the_refused_waiver_applied: Q.planProgress(applyAll(cps, K.UTAPATE_REQUESTS.map((r) => (r.item === 'u17' ? { ...r, patch: { ...r.patch, remarks: 'x' } } : r)), true)).percent,
    },
  },
  utapate_oldest_open_ncr_days: {
    truth: Q.summarise({ ncrs, plans: [K.UTAPATE_PLAN] }, T).oldestOpenNcrDays,
    routes: {
      the_voided_ncr_aged_to_the_as_of_date: Math.max(...ncrs.map(toToday)),
      the_closed_ncr_aged_to_the_as_of_date: Math.max(...ncrs.filter((n) => n.status !== 'Voided').map(toToday)),
      counted_from_the_due_date: Math.max(...ncrs.filter((n) => Q.isNcrOpen(n)).map((n) => -du(n.due_date))),
    },
  },
  utapate_mean_open_ncr_age_days: {
    truth: Q.summarise({ ncrs, plans: [K.UTAPATE_PLAN] }, T).meanOpenNcrAgeDays,
    routes: {
      the_mean_truncated: Math.floor(openAges.reduce((a, b) => a + b, 0) / openAges.length),
      closed_and_voided_included_at_their_closed_dates: Math.round(ncrs.map((n) => Q.ncrAgeDays(n, T)).reduce((a, b) => a + b, 0) / ncrs.length),
      closed_and_voided_aged_to_the_as_of_date: Math.round(ncrs.map(toToday).reduce((a, b) => a + b, 0) / ncrs.length),
      the_median_open_age: [...openAges].sort((a, b) => a - b)[Math.floor(openAges.length / 2)],
    },
  },
  utapate_checklist_progress_pct: {
    truth: prog.percent,
    routes: {
      not_applicable_without_a_reason_counted: pct(resp.length, items.length),
      not_applicable_left_out_of_the_denominator: pct(prog.answered - prog.notApplicable + count(resp, (r) => r.result === 'Not applicable' && !String(r.note || '').trim()), items.length - prog.notApplicable),
      answered_over_the_recorded_rows: pct(prog.answered, resp.length),
      conformant_only: pct(prog.conformant, items.length),
    },
  },
  utapate_programme_delivered_pct: {
    truth: A.programmeProgress(audits, T).percent,
    routes: {
      cancelled_audits_counted_as_delivered: pct(nStatus(['Reported', 'Closed', 'Cancelled']), audits.length),
      cancelled_audits_left_out_of_the_denominator: pct(nStatus(['Reported', 'Closed']), audits.length - nStatus(['Cancelled'])),
      fieldwork_complete_counted_as_delivered: pct(nStatus(['Reported', 'Closed', 'Fieldwork complete']), audits.length),
    },
  },
  obeakpu_clause_812_last_examined_days: {
    truth: du(lastOf(ready, '8.1.2')),
    routes: {
      the_in_progress_audit_counted: du(lastOf(readyWith(auditsAs(inProgressAsReported)), '8.1.2')),
      the_certification_body_audit_counted: du(lastOf(readyWith(auditsAs(cbAsInternal)), '8.1.2')),
      the_audit_end_date_used_for_the_examination: du(K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2026').actual_end),
    },
  },
  obeakpu_clause_93_last_examined_days: {
    truth: du(lastOf(ready, '9.3')),
    routes: {
      the_not_examined_row_counted: du(latestRowAnyResult('9.3')),
      the_audit_end_date_used_for_the_examination: du(K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2025').actual_end),
      the_reported_audit_end_date: du(K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2026').actual_end),
    },
  },
  obeakpu_closed_major_finding_age_days: {
    truth: I.findingAgeDays(f1, T),
    routes: {
      aged_to_the_as_of_date: -du(f1.raised_date),
      stopped_at_the_due_date: du(f1.due_date) - du(f1.raised_date),
      counted_inclusive_of_both_days: I.findingAgeDays(f1, T) + 1,
    },
  },
  obeakpu_evidenced_claims: {
    truth: ready.counts.evidenced,
    routes: {
      every_conformity_claim_counted: claimsCount,
      an_evidence_reference_alone_counted: withEvidenceRefOnly,
      conformant_only_partial_left_out: conformantOnlyEvidenced,
      the_excluded_clause_counted: ready.counts.evidenced + 1,
    },
  },
  obeakpu_certificate_days: {
    truth: ready.counts.certificateDays,
    routes: {
      the_days_since_expiry_given_as_positive: -ready.counts.certificateDays,
      counted_inclusive_of_both_days: ready.counts.certificateDays - 1,
      the_certificate_read_from_the_surveillance_audit: du(K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-cb').actual_end),
    },
  },
  obeakpu_clauses_covered: {
    truth: ready.counts.covered,
    routes: {
      the_certification_body_audit_counted: readyWith(auditsAs(cbAsInternal)).counts.covered,
      the_in_progress_audit_counted: readyWith(auditsAs(inProgressAsReported)).counts.covered,
      the_cancelled_audit_counted: readyWith(auditsAs(cancelledCounts)).counts.covered,
      the_cycle_read_as_four_years: readyWith(K.OBEAKPU_AUDITS, { cycle_years: 4 }).counts.covered,
      every_clause_examined_at_all_counted: ready.counts.applicable - ready.counts.neverAudited,
    },
  },
};

// NEGATIVE CONTROL: --plant adds a route that lands on the right answer, and
// the sweep must then report exactly one WEAK field.
if (process.argv.includes('--plant')) WRONG.utapate_itp_progress_pct.routes.planted_identity = WRONG.utapate_itp_progress_pct.truth;
let weak = 0; let routes = 0; let closest = { miss: Infinity, key: null };
console.log('field                                            routes  moved  blind   closest miss');
for (const [key, { truth, routes: rs }] of Object.entries(WRONG)) {
  TRUTH[key] = truth;
  if (!fields[key]) { console.log(`  REFUSES: ${key} is not in fields.json`); process.exit(2); }
  if (fields[key][2] !== truth) { console.log(`  REFUSES: ${key} in fields.json is ${fields[key][2]} and this sweep computes ${truth}`); process.exit(2); }
  const tol = fields[key][3];
  const blind = []; let nearest = Infinity;
  for (const [name, got] of Object.entries(rs)) {
    routes += 1;
    if (!Number.isFinite(got)) { console.log(`  REFUSES: route ${key}.${name} produced ${got}`); process.exit(2); }
    const d = Math.abs(got - truth);
    if (d <= tol) blind.push(`${name} (lands on ${got})`); else nearest = Math.min(nearest, d);
  }
  if (blind.length) weak += 1;
  if (nearest < closest.miss) closest = { miss: nearest, key };
  const n = Object.keys(rs).length;
  console.log(`${key.padEnd(48)} ${String(n).padStart(6)} ${String(n - blind.length).padStart(6)} ${String(blind.length).padStart(6)}   ${nearest} unit(s)`);
  blind.forEach((b) => console.log(`    BLIND ${b}`));
}
if (Object.keys(WRONG).length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
console.log(`\ndiscriminate: 18 graded fields, ${routes} wrong routes swept, ${weak} WEAK field(s)`);
console.log(`the closest miss anywhere in the eighteen: ${closest.key} at ${closest.miss} unit(s), against an exact tolerance`);
if (routes < 18 * 3) { console.log('  GATE REFUSES: fewer than three wrong routes a field is not a sweep'); process.exit(2); }
process.exit(weak ? 1 : 0);
