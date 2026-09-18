// THE COMPLIANCE CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines at the wave's one as-of date and writes the eighteen graded
// fields, six a tier, with their tolerances, plus the draft capstone prompts.
//
// Nothing here is read by compliance_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, reached through the same
// clock gate as the digest (clockguard.mjs), so no graded value can have come
// from the machine clock. None is arithmetic performed here: a date is graded
// as the engine's own daysUntil from the as-of date, a percent is the engine's
// own rounded percent, a count is the engine's count. The only thing this file
// does itself is apply the capstone's stated requests to a copy of the plan in
// the order they arrive, and each request is decided by the ENGINE
// (canRemoveCheckpoint, canDecideCheckpoint); a refused request changes nothing.
//
// TOLERANCES. Every field is an integer the engine returns, and every one is
// graded at 0.5 (lead ruling after ASC-0, the same as riskchange): half a unit
// of the zero decimals the course prints an integer at. Around an integer that
// band holds exactly one integer, so it accepts the one right answer and
// nothing else, and it is the band gradeprecision.py asks a zero-decimal class
// for. The academy grader compares numbers, so a learner types the integer.
export const TOLERANCE = 0.5;
//
// Usage: node compliance_capstone.mjs [--json]
import fs from 'fs';
import * as K from './compliance_fields_capstone.mjs';
import { loadGuarded } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.AS_ENGINES || '/root/wt-as-compliance-nextgen/packages/engines';
const AS_OF = K.AS_OF;
const { G } = await loadGuarded(ROOT, AS_OF);
const CAL = G.calendar; const C = G.complianceStatus; const D = G.documentControl;
const Q = G.qualityAssurance; const I = G.isoCompliance; const A = G.auditManagement;

const du = (d) => {
  const v = CAL.daysUntil(d, AS_OF);
  if (!Number.isInteger(v)) throw new Error(`daysUntil gave ${v}`);
  return v;
};
const byId = (rows) => new Map(rows.map((r) => [r.id, r]));

/* ---------------------------- EKPE ---------------------------- */
const ob = byId(K.EKPE_OBLIGATIONS);
const e1 = ob.get('e1'); const e2 = ob.get('e2'); const e3 = ob.get('e3'); const e4 = ob.get('e4');
const e4Rolled = { ...e4, due_date: CAL.toDateOnlyString(C.rollForward(e4.due_date, e4.frequency)), last_submitted_date: K.EKPE_FILINGS.e4 };
const [ed1, ed2] = K.EKPE_DOCUMENTS;

/* --------------------------- UTAPATE --------------------------- */
const applyRequests = (plan, points, requests) => {
  let pts = points.map((p) => ({ ...p }));
  const log = [];
  for (const rq of requests) {
    const cp = pts.find((p) => p.id === rq.item);
    if (rq.kind === 'remove') {
      const v = Q.canRemoveCheckpoint(cp, plan);
      log.push({ ...rq, ok: v.ok, reason: v.reason || null });
      if (v.ok) pts = pts.filter((p) => p.id !== rq.item);
    } else {
      const v = Q.canDecideCheckpoint(cp, rq.status, rq.patch);
      log.push({ ...rq, ok: v.ok, reason: v.reason || null });
      if (v.ok) pts = pts.map((p) => (p.id === rq.item ? { ...p, ...rq.patch, status: rq.status } : p));
    }
  }
  return { pts, log };
};
const req = applyRequests(K.UTAPATE_PLAN, K.UTAPATE_CHECKPOINTS, K.UTAPATE_REQUESTS);
const qs = Q.summarise({ plans: [K.UTAPATE_PLAN], checkpoints: K.UTAPATE_CHECKPOINTS, ncrs: K.UTAPATE_NCRS, capas: [] }, AS_OF);

/* --------------------------- OBEAKPU --------------------------- */
const obData = { clauses: K.OBEAKPU_CLAUSES, findings: K.OBEAKPU_FINDINGS, actions: K.OBEAKPU_ACTIONS, audits: K.OBEAKPU_AUDITS, auditClauses: K.OBEAKPU_AUDIT_CLAUSES };
const ready = I.certificationReadiness(K.OBEAKPU_STANDARD, obData, AS_OF);
const covRow = (ref) => ready.coverage.find((r) => r.clause_ref === ref);
const f1 = K.OBEAKPU_FINDINGS.find((f) => f.id === 'of1');

export const FIELDS = [
  ['beginner', 'ekpe_emissions_permit_next_action_days', C.explainStatus(e1, AS_OF).daysUntil],
  ['beginner', 'ekpe_community_report_next_due_days', du(C.rollForward(e2.due_date, e2.frequency))],
  ['beginner', 'ekpe_waste_return_period_start_days', du(C.periodStart(e3.due_date, e3.frequency))],
  ['beginner', 'ekpe_abstraction_next_action_after_filing_days', C.explainStatus(e4Rolled, AS_OF).daysUntil],
  ['beginner', 'ekpe_slug_catcher_procedure_review_days', du(D.nextReviewDate(ed1.issue_date, ed1.review_period_months))],
  ['beginner', 'ekpe_emergency_plan_review_days', du(D.nextReviewDate(ed2.issue_date, ed2.review_period_months))],
  ['intermediate', 'utapate_itp_progress_pct', Q.planProgress(K.UTAPATE_CHECKPOINTS).percent],
  ['intermediate', 'utapate_itp_progress_after_requests_pct', Q.planProgress(req.pts).percent],
  ['intermediate', 'utapate_oldest_open_ncr_days', qs.oldestOpenNcrDays],
  ['intermediate', 'utapate_mean_open_ncr_age_days', qs.meanOpenNcrAgeDays],
  ['intermediate', 'utapate_checklist_progress_pct', A.checklistProgress(K.UTAPATE_ITEMS, K.UTAPATE_RESPONSES).percent],
  ['intermediate', 'utapate_programme_delivered_pct', A.programmeProgress(K.UTAPATE_AUDITS, AS_OF).percent],
  ['advanced', 'obeakpu_clause_812_last_examined_days', du(covRow('8.1.2').lastExaminedOn)],
  ['advanced', 'obeakpu_clause_93_last_examined_days', du(covRow('9.3').lastExaminedOn)],
  ['advanced', 'obeakpu_closed_major_finding_age_days', I.findingAgeDays(f1, AS_OF)],
  ['advanced', 'obeakpu_evidenced_claims', ready.counts.evidenced],
  ['advanced', 'obeakpu_certificate_days', ready.counts.certificateDays],
  ['advanced', 'obeakpu_clauses_covered', ready.counts.covered],
].map(([tier, key, value]) => [tier, key, value, TOLERANCE]);

for (const [tier, key, v] of FIELDS) {
  if (!Number.isInteger(v)) throw new Error(`${tier}.${key} is ${v}, which is not an integer the engine returned`);
  if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
}
if (FIELDS.length !== 18 || new Set(FIELDS.map((f) => f[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((f) => f[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}
// The request log is asserted, so the prompt can never describe a request the
// engine decided differently from the way this file applied it.
const EXPECT = [false, true, false, true, true, false];
req.log.forEach((l, i) => { if (l.ok !== EXPECT[i]) throw new Error(`request ${i + 1} (${l.kind} ${l.item}) came back ok=${l.ok}`); });

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value, or the date whose daysUntil is graded, in any rendering.
const dateWords = (s) => s; // conditions are given as YYYY-MM-DD, exactly as the apps store them
const ekpeTable = K.EKPE_OBLIGATIONS.map((o) => `${o.code} ${o.title}: ${o.frequency}, due ${o.due_date}${o.expiry_date ? `, permit expiry ${o.expiry_date}` : ''}${o.lead_time_days ? `, lead time ${o.lead_time_days} days` : ''}${o.last_submitted_date ? `, last filed ${o.last_submitted_date}` : ', nothing filed yet'}.`).join(' ');
export const PROMPTS = {
  beginner: `EKPE GAS PLANT, Obolo Midstream Ltd. The as-of date is ${K.AS_OF_YMD}. Work in whole calendar days from the as-of date: a date in the past is a negative number. The obligation register: ${ekpeTable} The document library: ${ed1.document_number} ${ed1.title}, issued ${dateWords(ed1.issue_date)} on a ${ed1.review_period_months} month review period, a correction re-published on ${ed1.corrected_on}; ${ed2.document_number} ${ed2.title}, issued ${ed2.issue_date} on a ${ed2.review_period_months} month review period. Give six whole numbers. (1) For REG-2026-041, the days until its next action date. (2) REG-2026-042 is filed on ${K.EKPE_FILINGS.e2} and the filing is recorded: the days until its next due date. (3) For REG-2026-043, the days until the start of the period a filing must fall in to count towards Compliant. (4) REG-2026-044 is filed on ${K.EKPE_FILINGS.e4} and the filing is recorded: the days until its next action date. (5) The days until ${ed1.document_number}'s review date. (6) The days until ${ed2.document_number}'s review date.`,
  intermediate: `UTAPATE MANIFOLD REPLACEMENT. The as-of date is ${K.AS_OF_YMD}. The quality plan ${K.UTAPATE_PLAN.plan_code} is ${K.UTAPATE_PLAN.status}. Its inspection and test plan, item by item: ${K.UTAPATE_CHECKPOINTS.map((c) => `${c.item_no} ${c.point_type} ${c.status}${c.remarks ? ' (reason recorded)' : ''}${c.result_date ? ' (date and verifier recorded)' : ''}`).join('; ')}. The site then sends six requests, in this order: remove ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u15').item_no}; remove ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u16').item_no}; waive ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u17').item_no} with a date and a verifier and no reason; set ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u14').item_no} Not applicable with a date, a named certifying authority surveyor and a reason; set ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u19').item_no} Not applicable with nothing recorded; pass ${K.UTAPATE_CHECKPOINTS.find((c) => c.id === 'u18').item_no} with a date and no verifier. The NCRs: ${K.UTAPATE_NCRS.map((n) => `${n.ncr_code} ${n.severity}, ${n.status}, raised ${n.raised_date}${n.closed_date ? `, closed ${n.closed_date}` : ''}`).join('; ')}. The contractor HSE audit checklist has ${K.UTAPATE_ITEMS.length} questions; the answers recorded are ${K.UTAPATE_RESPONSES.filter((r) => r.result === 'Conformant').length} Conformant, ${K.UTAPATE_RESPONSES.filter((r) => r.result === 'Nonconformant').length} Nonconformant with notes, ${K.UTAPATE_RESPONSES.filter((r) => r.result === 'Observation').length} Observations with notes, ${K.UTAPATE_RESPONSES.filter((r) => r.result === 'Not applicable' && String(r.note || '').trim()).length} Not applicable with a written reason and ${K.UTAPATE_RESPONSES.filter((r) => r.result === 'Not applicable' && !String(r.note || '').trim()).length} Not applicable with the reason left blank, and the remaining questions have no answer. The 2026 audit programme: ${K.UTAPATE_AUDITS.map((a) => `${a.audit_code} ${a.status}${a.cancellation_reason ? ' (reason recorded)' : ''}`).join('; ')}. Give six whole numbers. (1) The plan's progress percent as recorded. (2) Its progress percent once the six requests have been put to the rules in order. (3) The age in days of the oldest open NCR. (4) The mean age in days of the open NCRs, as the dashboard rounds it. (5) The checklist's progress percent. (6) The programme's delivered percent.`,
  advanced: `OBEAKPU TERMINAL, ISO 45001:2018. The as-of date is ${K.AS_OF_YMD}. The standard: ${K.OBEAKPU_STANDARD.certification_status}, certification cycle ${K.OBEAKPU_STANDARD.cycle_years} years, certificate expiry ${K.OBEAKPU_STANDARD.certificate_expires}. The clause register (${K.OBEAKPU_CLAUSES.length} clauses): every clause is Applicable and Conformant with an evidence reference, an assessed date and an assessor, except ${Object.keys({ '8.1.4.3': 1, '6.1.3': 1, '7.2': 1, '7.4.3': 1, '5.4': 1, '9.1.2': 1 }).join(', ')}, which read: 8.1.4.3 Not applicable with its justification; 6.1.3 Nonconformant, assessed with a date and an assessor, no evidence reference; 7.2 Conformant with a date and an assessor and no evidence reference; 7.4.3 Partially conformant with an evidence reference and a date and no assessor; 5.4 Not assessed; 9.1.2 Partially conformant with an evidence reference, a date and an assessor. The audits: ${K.OBEAKPU_AUDITS.map((a) => `${a.audit_code} ${a.audit_type} ${a.status}`).join('; ')}. Examinations: ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2025').audit_code} examined every clause Conformant except 8.1.4.3, 4.4, 6.1.4, 7.5.2, 10.3 and 5.3, all on 2025-03-19; ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2026').audit_code} examined 8.1.1, 8.1.2, 8.1.3, 8.2, 9.1.1 and 10.2 Conformant on 2026-03-25, 6.1.3 Nonconformant on 2026-03-26, and recorded 9.3 as Not examined on 2026-03-27; ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2026b').audit_code} examined 8.1.2 on 2026-09-30 and 6.1.4 on 2026-09-29; ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-cb').audit_code} examined 8.1.2 on 2026-07-15 and 7.5.2 on 2026-07-16; ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2025x').audit_code} examined 10.3 on 2025-08-20; ${K.OBEAKPU_AUDITS.find((a) => a.id === 'ob-2023').audit_code} examined 4.4 and 5.3 on 2023-06-14. The findings: ${K.OBEAKPU_FINDINGS.map((f) => `${f.finding_code} ${f.finding_type}, ${f.status}, raised ${f.raised_date}${f.closed_date ? `, closed ${f.closed_date}` : ''}`).join('; ')}. Give six whole numbers, in whole calendar days from the as-of date where a date is asked for (negative for the past). (1) The days until the last examination of 8.1.2 that counts towards coverage. (2) The same for 9.3. (3) The age in days of ${f1.finding_code}. (4) How many applicable clauses carry an evidenced conformity claim. (5) The certificate's days as the readiness counts give them. (6) How many applicable clauses are covered.`,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.CQ_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.CQ_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.CQ_CAPSTONE_OUT || `${HERE}capstone.json`;
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })))}\n`);
} else {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const cls = (re) => `^(?:${FIELDS.map((f) => f[1]).filter((k) => re.test(k)).join('|')})$`;
  fs.writeFileSync(precOut, `${JSON.stringify({
    days: { decimals: 0, match: cls(/_days$/) },
    percent: { decimals: 0, match: cls(/_pct$/) },
    count: { decimals: 0, match: cls(/_(claims|covered)$/) },
  }, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    asOf: K.AS_OF_YMD,
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'EKPE', intermediate: 'UTAPATE', advanced: 'OBEAKPU' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((f) => f[0] === t).map(([, key, , tol]) => ({ key, source: K.FIELD_SOURCES[key], tol })),
    }])),
    requestLog: req.log.map(({ kind, item, status, ok, reason }) => ({ kind, item, status: status || null, ok, reason })),
  }, null, 1)}\n`);
  for (const [t, k, v] of FIELDS) process.stdout.write(`${t.padEnd(13)} ${k.padEnd(48)} ${v}\n`);
}
