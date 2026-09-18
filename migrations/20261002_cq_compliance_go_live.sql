-- ============================================================================
-- compliance GO-LIVE (HELD): Compliance, Audit & Quality flips to 'available',
-- the second course of the Assurance module, at path_order 60.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/compliance. The 78 lessons, the teaching lab
-- (complianceLab.js) and its three explorer panels (register, plan and
-- readiness) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (compliance_capstone.mjs --json), so a capstone row an earlier
--      seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from: the go-live first proves each shipped prompt is the
--      rendered one byte for byte, then recomputes all eighteen values from
--      those records with the engine rules written out in SQL, including the
--      six requests decided in order by the checkpoint rules;
--   3. by the TRAPS the course is built on, one for every field, each of which
--      must bite on these records: the reading a learner who missed the lesson
--      would give is computed and refused if it equals the graded value.
--
-- THE AS-OF DATE IS 2026-10-15, the one date every capstone prompt states. It is a
-- literal below and never current_date, so this file gives the same verdict on
-- whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a whole-number expected value at
-- tolerance 0.5 with a label and a unit, and all of it is asserted here, on
-- the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_wrong numeric;
  v_rq jsonb; v_cp jsonb; v_next jsonb; v_ok boolean; v_ver boolean;
  v_log jsonb := '[]'::jsonb; v_pts jsonb; v_pts_sent jsonb; v_cutoff date;
  v_asof date := date '2026-10-15';
  v_g_ekpe_emissions_permit_next_action_days numeric; v_s_ekpe_emissions_permit_next_action_days numeric;
  v_g_ekpe_community_report_next_due_days numeric; v_s_ekpe_community_report_next_due_days numeric;
  v_g_ekpe_waste_return_period_start_days numeric; v_s_ekpe_waste_return_period_start_days numeric;
  v_g_ekpe_abstraction_next_action_after_filing_days numeric; v_s_ekpe_abstraction_next_action_after_filing_days numeric;
  v_g_ekpe_slug_catcher_procedure_review_days numeric; v_s_ekpe_slug_catcher_procedure_review_days numeric;
  v_g_ekpe_emergency_plan_review_days numeric; v_s_ekpe_emergency_plan_review_days numeric;
  v_g_utapate_itp_progress_pct numeric; v_s_utapate_itp_progress_pct numeric;
  v_g_utapate_itp_progress_after_requests_pct numeric; v_s_utapate_itp_progress_after_requests_pct numeric;
  v_g_utapate_oldest_open_ncr_days numeric; v_s_utapate_oldest_open_ncr_days numeric;
  v_g_utapate_mean_open_ncr_age_days numeric; v_s_utapate_mean_open_ncr_age_days numeric;
  v_g_utapate_checklist_progress_pct numeric; v_s_utapate_checklist_progress_pct numeric;
  v_g_utapate_programme_delivered_pct numeric; v_s_utapate_programme_delivered_pct numeric;
  v_g_obeakpu_clause_812_last_examined_days numeric; v_s_obeakpu_clause_812_last_examined_days numeric;
  v_g_obeakpu_clause_93_last_examined_days numeric; v_s_obeakpu_clause_93_last_examined_days numeric;
  v_g_obeakpu_closed_major_finding_age_days numeric; v_s_obeakpu_closed_major_finding_age_days numeric;
  v_g_obeakpu_evidenced_claims numeric; v_s_obeakpu_evidenced_claims numeric;
  v_g_obeakpu_certificate_days numeric; v_s_obeakpu_certificate_days numeric;
  v_g_obeakpu_clauses_covered numeric; v_s_obeakpu_clauses_covered numeric;
  v_ekpe_obligations jsonb := '[{"id":"e1","code":"REG-2026-041","title":"Gas plant air emissions permit","frequency":"Annual","obligation_type":"Permit","regime":"Environmental","due_date":"2027-02-28","expiry_date":"2026-12-19","lead_time_days":60,"lifecycle":"Active"},{"id":"e2","code":"REG-2026-042","title":"Semi-annual host community report","frequency":"Semi-annual","obligation_type":"Periodic report","regime":"Reporting","due_date":"2026-10-31","lifecycle":"Active"},{"id":"e3","code":"REG-2026-043","title":"Semi-annual waste consignment return","frequency":"Semi-annual","obligation_type":"Periodic report","regime":"Environmental","due_date":"2026-12-31","last_submitted_date":"2026-06-24","lifecycle":"Active"},{"id":"e4","code":"REG-2026-044","title":"Quarterly water abstraction return","frequency":"Quarterly","obligation_type":"Periodic report","regime":"Environmental","due_date":"2026-09-20","expiry_date":"2026-12-28","lifecycle":"Active"}]'::jsonb;
  v_ekpe_filings jsonb := '{"e2":"2026-10-06","e4":"2026-10-09"}'::jsonb;
  v_ekpe_documents jsonb := '[{"id":"ed1","document_number":"OPS-PRO-0031","title":"Slug catcher operating procedure","status":"Published","issue_date":"2025-01-31","review_period_months":30,"corrected_on":"2026-06-12","revision":"04"},{"id":"ed2","document_number":"HSE-PLA-0009","title":"Plant emergency response plan","status":"Published","issue_date":"2024-05-31","review_period_months":16,"revision":"11"}]'::jsonb;
  v_utapate_plan jsonb := '{"id":"p-uta","plan_code":"QAP-2026-022","title":"Utapate manifold replacement","status":"Active"}'::jsonb;
  v_utapate_checkpoints jsonb := '[{"id":"u01","plan_id":"p-uta","item_no":"H-01","point_type":"Hold point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u02","plan_id":"p-uta","item_no":"W-02","point_type":"Witness point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u03","plan_id":"p-uta","item_no":"H-03","point_type":"Hold point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u04","plan_id":"p-uta","item_no":"R-04","point_type":"Review point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u05","plan_id":"p-uta","item_no":"W-05","point_type":"Witness point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u06","plan_id":"p-uta","item_no":"H-06","point_type":"Hold point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u07","plan_id":"p-uta","item_no":"M-07","point_type":"Monitor point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u08","plan_id":"p-uta","item_no":"W-08","point_type":"Witness point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u09","plan_id":"p-uta","item_no":"R-09","point_type":"Review point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u10","plan_id":"p-uta","item_no":"W-10","point_type":"Witness point","status":"Waived","result_date":"2026-09-18","verified_by":"u-amaka","remarks":"Client inspector stood down; vendor record accepted."},{"id":"u11","plan_id":"p-uta","item_no":"M-11","point_type":"Monitor point","status":"Not applicable"},{"id":"u12","plan_id":"p-uta","item_no":"H-12","point_type":"Hold point","status":"Not applicable","result_date":"2026-09-18","verified_by":"u-amaka","remarks":"Spool supplied pre-tested by the manufacturer."},{"id":"u13","plan_id":"p-uta","item_no":"H-13","point_type":"Hold point","status":"Failed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u14","plan_id":"p-uta","item_no":"H-14","point_type":"Hold point","status":"Pending"},{"id":"u15","plan_id":"p-uta","item_no":"H-15","point_type":"Hold point","status":"Pending"},{"id":"u16","plan_id":"p-uta","item_no":"W-16","point_type":"Witness point","status":"Pending"},{"id":"u17","plan_id":"p-uta","item_no":"W-17","point_type":"Witness point","status":"Pending"},{"id":"u18","plan_id":"p-uta","item_no":"S-18","point_type":"Surveillance point","status":"Notified"},{"id":"u19","plan_id":"p-uta","item_no":"M-19","point_type":"Monitor point","status":"In progress"},{"id":"u20","plan_id":"p-uta","item_no":"W-20","point_type":"Witness point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"},{"id":"u21","plan_id":"p-uta","item_no":"R-21","point_type":"Review point","status":"Passed","result_date":"2026-09-18","verified_by":"u-amaka"}]'::jsonb;
  v_utapate_requests jsonb := '[{"kind":"remove","item":"u15"},{"kind":"remove","item":"u16"},{"kind":"decide","item":"u17","status":"Waived","patch":{"result_date":"2026-10-14","verified_by":"u-amaka"}},{"kind":"decide","item":"u14","status":"Not applicable","patch":{"result_date":"2026-10-14","verifier_name":"Certifying authority surveyor","remarks":"Line isolated and blinded; test moved to the next campaign."}},{"kind":"decide","item":"u19","status":"Not applicable","patch":{}},{"kind":"decide","item":"u18","status":"Passed","patch":{"result_date":"2026-10-14"}}]'::jsonb;
  v_utapate_ncrs jsonb := '[{"id":"un1","ncr_code":"NCR-2026-044","plan_id":"p-uta","severity":"Major","status":"Actions in progress","raised_date":"2026-05-06","due_date":"2026-07-06"},{"id":"un2","ncr_code":"NCR-2026-051","plan_id":"p-uta","severity":"Minor","status":"Open","raised_date":"2026-07-19","due_date":"2026-10-27"},{"id":"un3","ncr_code":"NCR-2026-063","plan_id":"p-uta","severity":"Critical","status":"Under investigation","raised_date":"2026-09-22","due_date":"2026-10-22"},{"id":"un4","ncr_code":"NCR-2026-060","plan_id":"p-uta","severity":"Minor","status":"Disposition agreed","raised_date":"2026-09-04","due_date":"2026-11-04"},{"id":"un5","ncr_code":"NCR-2026-035","plan_id":"p-uta","severity":"Observation","status":"Closed","raised_date":"2026-02-11","closed_date":"2026-03-30"},{"id":"un6","ncr_code":"NCR-2026-029","plan_id":"p-uta","severity":"Major","status":"Voided","raised_date":"2026-01-05","closed_date":"2026-01-09"}]'::jsonb;
  v_utapate_items jsonb := '[{"id":"q01","item_no":"1","criticality":"Critical"},{"id":"q02","item_no":"2","criticality":"Major"},{"id":"q03","item_no":"3","criticality":"Minor"},{"id":"q04","item_no":"4","criticality":"Critical"},{"id":"q05","item_no":"5","criticality":"Major"},{"id":"q06","item_no":"6","criticality":"Minor"},{"id":"q07","item_no":"7","criticality":"Critical"},{"id":"q08","item_no":"8","criticality":"Major"},{"id":"q09","item_no":"9","criticality":"Minor"},{"id":"q10","item_no":"10","criticality":"Critical"},{"id":"q11","item_no":"11","criticality":"Major"},{"id":"q12","item_no":"12","criticality":"Minor"},{"id":"q13","item_no":"13","criticality":"Critical"},{"id":"q14","item_no":"14","criticality":"Major"},{"id":"q15","item_no":"15","criticality":"Minor"},{"id":"q16","item_no":"16","criticality":"Critical"},{"id":"q17","item_no":"17","criticality":"Major"},{"id":"q18","item_no":"18","criticality":"Minor"},{"id":"q19","item_no":"19","criticality":"Critical"},{"id":"q20","item_no":"20","criticality":"Major"},{"id":"q21","item_no":"21","criticality":"Minor"},{"id":"q22","item_no":"22","criticality":"Critical"},{"id":"q23","item_no":"23","criticality":"Major"},{"id":"q24","item_no":"24","criticality":"Minor"},{"id":"q25","item_no":"25","criticality":"Critical"},{"id":"q26","item_no":"26","criticality":"Major"},{"id":"q27","item_no":"27","criticality":"Minor"}]'::jsonb;
  v_utapate_responses jsonb := '[{"id":"qa01","item_id":"q01","result":"Conformant"},{"id":"qa02","item_id":"q02","result":"Conformant"},{"id":"qa03","item_id":"q03","result":"Conformant"},{"id":"qa04","item_id":"q04","result":"Conformant"},{"id":"qa05","item_id":"q05","result":"Conformant"},{"id":"qa06","item_id":"q06","result":"Conformant"},{"id":"qa07","item_id":"q07","result":"Conformant"},{"id":"qa08","item_id":"q08","result":"Conformant"},{"id":"qa09","item_id":"q09","result":"Conformant"},{"id":"qa10","item_id":"q10","result":"Conformant"},{"id":"qa11","item_id":"q11","result":"Conformant"},{"id":"qa12","item_id":"q12","result":"Conformant"},{"id":"qa13","item_id":"q13","result":"Conformant"},{"id":"qa14","item_id":"q14","result":"Nonconformant","note":"Lifting register out of date."},{"id":"qa15","item_id":"q15","result":"Nonconformant","note":"No fire watch at the tie-in."},{"id":"qa16","item_id":"q16","result":"Nonconformant","note":"Two expired gas detector calibrations."},{"id":"qa17","item_id":"q17","result":"Observation","note":"Toolbox talk signed after the task started."},{"id":"qa18","item_id":"q18","result":"Observation","note":"Waste bins unlabelled."},{"id":"qa19","item_id":"q19","result":"Not applicable","note":"No diving on this scope."},{"id":"qa20","item_id":"q20","result":"Not applicable","note":"No radiography this week."},{"id":"qa21","item_id":"q21","result":"Not applicable","note":""},{"id":"qa22","item_id":"q22","result":"Not applicable","note":"  "}]'::jsonb;
  v_utapate_audits jsonb := '[{"id":"ua1","audit_code":"AUD-2026-101","status":"Closed"},{"id":"ua2","audit_code":"AUD-2026-102","status":"Reported"},{"id":"ua3","audit_code":"AUD-2026-103","status":"Reported"},{"id":"ua4","audit_code":"AUD-2026-104","status":"Cancelled","cancellation_reason":"Contractor demobilised before the audit window."},{"id":"ua5","audit_code":"AUD-2026-105","status":"Closed"},{"id":"ua6","audit_code":"AUD-2026-106","status":"Reported"},{"id":"ua7","audit_code":"AUD-2026-107","status":"Cancelled","cancellation_reason":"Scope merged into AUD-2026-108."},{"id":"ua8","audit_code":"AUD-2026-108","status":"Reported"},{"id":"ua9","audit_code":"AUD-2026-109","status":"Fieldwork complete"},{"id":"ua10","audit_code":"AUD-2026-110","status":"In progress"},{"id":"ua11","audit_code":"AUD-2026-111","status":"Planned"}]'::jsonb;
  v_obeakpu_standard jsonb := '{"id":"s-45001","code":"ISO 45001:2018","certification_status":"Certified","cycle_years":3,"certificate_expires":"2026-08-27"}'::jsonb;
  v_obeakpu_clauses jsonb := '[{"id":"ob-4-1","standard_id":"s-45001","clause_ref":"4.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-4-2","standard_id":"s-45001","clause_ref":"4.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-4-3","standard_id":"s-45001","clause_ref":"4.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-4-4","standard_id":"s-45001","clause_ref":"4.4","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-5-1","standard_id":"s-45001","clause_ref":"5.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-5-2","standard_id":"s-45001","clause_ref":"5.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-5-3","standard_id":"s-45001","clause_ref":"5.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-5-4","standard_id":"s-45001","clause_ref":"5.4","applicability":"Applicable","owner_id":"u-owner","status":"Not assessed","evidence_reference":"","assessed_date":null,"assessed_by":null},{"id":"ob-6-1-1","standard_id":"s-45001","clause_ref":"6.1.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-1-2-1","standard_id":"s-45001","clause_ref":"6.1.2.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-1-2-2","standard_id":"s-45001","clause_ref":"6.1.2.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-1-2-3","standard_id":"s-45001","clause_ref":"6.1.2.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-1-3","standard_id":"s-45001","clause_ref":"6.1.3","applicability":"Applicable","owner_id":"u-owner","status":"Nonconformant","evidence_reference":"","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-1-4","standard_id":"s-45001","clause_ref":"6.1.4","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-2-1","standard_id":"s-45001","clause_ref":"6.2.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-6-2-2","standard_id":"s-45001","clause_ref":"6.2.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-1","standard_id":"s-45001","clause_ref":"7.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-2","standard_id":"s-45001","clause_ref":"7.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-3","standard_id":"s-45001","clause_ref":"7.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-4-1","standard_id":"s-45001","clause_ref":"7.4.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-4-2","standard_id":"s-45001","clause_ref":"7.4.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-4-3","standard_id":"s-45001","clause_ref":"7.4.3","applicability":"Applicable","owner_id":"u-owner","status":"Partially conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":null,"assessor_name":""},{"id":"ob-7-5-1","standard_id":"s-45001","clause_ref":"7.5.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-5-2","standard_id":"s-45001","clause_ref":"7.5.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-7-5-3","standard_id":"s-45001","clause_ref":"7.5.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-1","standard_id":"s-45001","clause_ref":"8.1.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-2","standard_id":"s-45001","clause_ref":"8.1.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-3","standard_id":"s-45001","clause_ref":"8.1.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-4-1","standard_id":"s-45001","clause_ref":"8.1.4.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-4-2","standard_id":"s-45001","clause_ref":"8.1.4.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-8-1-4-3","standard_id":"s-45001","clause_ref":"8.1.4.3","applicability":"Not applicable","owner_id":"u-owner","status":"Not applicable","evidence_reference":"","assessed_date":null,"assessed_by":null,"applicability_justification":"No outsourced processes within the certified scope."},{"id":"ob-8-2","standard_id":"s-45001","clause_ref":"8.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-9-1-1","standard_id":"s-45001","clause_ref":"9.1.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-9-1-2","standard_id":"s-45001","clause_ref":"9.1.2","applicability":"Applicable","owner_id":"u-owner","status":"Partially conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-9-2-1","standard_id":"s-45001","clause_ref":"9.2.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-9-2-2","standard_id":"s-45001","clause_ref":"9.2.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-9-3","standard_id":"s-45001","clause_ref":"9.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-10-1","standard_id":"s-45001","clause_ref":"10.1","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-10-2","standard_id":"s-45001","clause_ref":"10.2","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"},{"id":"ob-10-3","standard_id":"s-45001","clause_ref":"10.3","applicability":"Applicable","owner_id":"u-owner","status":"Conformant","evidence_reference":"OHS-REC","assessed_date":"2026-04-20","assessed_by":"u-zainab"}]'::jsonb;
  v_obeakpu_audits jsonb := '[{"id":"ob-2023","audit_code":"OSA-2023-002","audit_type":"Internal","status":"Closed","actual_end":"2023-06-16"},{"id":"ob-2025","audit_code":"OSA-2025-001","audit_type":"Internal","status":"Closed","actual_end":"2025-03-21"},{"id":"ob-2026","audit_code":"OSA-2026-001","audit_type":"Internal","status":"Reported","actual_end":"2026-03-27"},{"id":"ob-2026b","audit_code":"OSA-2026-002","audit_type":"Internal","status":"In progress"},{"id":"ob-2025x","audit_code":"OSA-2025-004","audit_type":"Internal","status":"Cancelled","cancellation_reason":"Turnaround moved the audit window."},{"id":"ob-cb","audit_code":"OSA-2026-S02","audit_type":"Surveillance","status":"Closed","actual_end":"2026-07-17"}]'::jsonb;
  v_obeakpu_audit_clauses jsonb := '[{"audit_id":"ob-2025","clause_id":"ob-4-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-4-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-4-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-5-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-5-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-5-4","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-1-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-1-2-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-1-2-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-1-2-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-1-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-2-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-6-2-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-4-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-4-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-4-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-5-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-7-5-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-1-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-1-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-1-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-1-4-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-1-4-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-8-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-9-1-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-9-1-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-9-2-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-9-2-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-9-3","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-10-1","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2025","clause_id":"ob-10-2","result":"Conformant","examined_on":"2025-03-19"},{"audit_id":"ob-2026","clause_id":"ob-8-1-1","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-8-1-2","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-8-1-3","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-8-2","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-9-1-1","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-10-2","result":"Conformant","examined_on":"2026-03-25"},{"audit_id":"ob-2026","clause_id":"ob-9-3","result":"Not examined","examined_on":"2026-03-27"},{"audit_id":"ob-2026","clause_id":"ob-6-1-3","result":"Nonconformant","examined_on":"2026-03-26"},{"audit_id":"ob-2026b","clause_id":"ob-8-1-2","result":"Conformant","examined_on":"2026-09-30"},{"audit_id":"ob-2026b","clause_id":"ob-6-1-4","result":"Conformant","examined_on":"2026-09-29"},{"audit_id":"ob-cb","clause_id":"ob-8-1-2","result":"Conformant","examined_on":"2026-07-15"},{"audit_id":"ob-cb","clause_id":"ob-7-5-2","result":"Conformant","examined_on":"2026-07-16"},{"audit_id":"ob-2025x","clause_id":"ob-10-3","result":"Conformant","examined_on":"2025-08-20"},{"audit_id":"ob-2023","clause_id":"ob-4-4","result":"Conformant","examined_on":"2023-06-14"},{"audit_id":"ob-2023","clause_id":"ob-5-3","result":"Conformant","examined_on":"2023-06-14"}]'::jsonb;
  v_obeakpu_findings jsonb := '[{"id":"of1","finding_code":"OSF-2026-002","audit_id":"ob-2026","standard_id":"s-45001","finding_type":"Major nonconformity","status":"Closed","raised_date":"2026-01-19","due_date":"2026-04-19","closed_date":"2026-05-04","correction":"Permit board restored.","root_cause":"No custodian for the permit board."},{"id":"of2","finding_code":"OSF-2026-007","audit_id":"ob-2026","standard_id":"s-45001","finding_type":"Major nonconformity","status":"Action in progress","raised_date":"2026-03-26","due_date":"2026-06-26"},{"id":"of3","finding_code":"OSF-2026-009","audit_id":"ob-2026","standard_id":"s-45001","finding_type":"Minor nonconformity","status":"Open","raised_date":"2026-06-03","due_date":"2026-08-31"}]'::jsonb;
  v_request_log jsonb := '[false,true,false,true,true,false]'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'compliance' and active;
  if v_structures <> 3 then
    raise exception 'compliance go-live refused: compliance has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'compliance';
  if v_questions <> 396 then
    raise exception 'compliance go-live refused: compliance has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'compliance'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'compliance' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'compliance' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'compliance'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'compliance' and s.active;
  if v_lessons <> 78 then
    raise exception 'compliance go-live refused: compliance carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'compliance' and s.active;
  if v_modules <> 18 then
    raise exception 'compliance go-live refused: compliance carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'compliance' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'compliance';
  if v_capstones <> 3 then
    raise exception 'compliance go-live refused: compliance has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'compliance';
  if v_graded <> 18 then
    raise exception 'compliance go-live refused: compliance has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'compliance' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'compliance' and module = 'assurance'
                    and path_order = 60 and prereq_slug is null) then
    raise exception 'compliance go-live refused: the compliance catalogue row is not assurance at path_order 60 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 60 and slug <> 'compliance') then
    raise exception 'compliance go-live refused: another course already holds path_order 60';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 59 and slug <> 'riskchange') then
    raise exception 'compliance go-live refused: path_order 59, the Assurance sibling slot, is held by a course other than riskchange';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a whole number at 0.5, with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> 0.5
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are not a whole number at tolerance 0.5 with a label and a unit: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- compliance_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'compliance' and tier = 'beginner';
  if v_prompt is distinct from 'EKPE GAS PLANT, Obolo Midstream Ltd. The as-of date is 2026-10-15. Work in whole calendar days from the as-of date: a date in the past is a negative number. The obligation register: REG-2026-041 Gas plant air emissions permit: Annual, due 2027-02-28, permit expiry 2026-12-19, lead time 60 days, nothing filed yet. REG-2026-042 Semi-annual host community report: Semi-annual, due 2026-10-31, nothing filed yet. REG-2026-043 Semi-annual waste consignment return: Semi-annual, due 2026-12-31, last filed 2026-06-24. REG-2026-044 Quarterly water abstraction return: Quarterly, due 2026-09-20, permit expiry 2026-12-28, nothing filed yet. The document library: OPS-PRO-0031 Slug catcher operating procedure, issued 2025-01-31 on a 30 month review period, a correction re-published on 2026-06-12; HSE-PLA-0009 Plant emergency response plan, issued 2024-05-31 on a 16 month review period. Give six whole numbers. (1) For REG-2026-041, the days until its next action date. (2) REG-2026-042 is filed on 2026-10-06 and the filing is recorded: the days until its next due date. (3) For REG-2026-043, the days until the start of the period a filing must fall in to count towards Compliant. (4) REG-2026-044 is filed on 2026-10-09 and the filing is recorded: the days until its next action date. (5) The days until OPS-PRO-0031''s review date. (6) The days until HSE-PLA-0009''s review date.' then
    raise exception 'compliance go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'compliance' and tier = 'intermediate';
  if v_prompt is distinct from 'UTAPATE MANIFOLD REPLACEMENT. The as-of date is 2026-10-15. The quality plan QAP-2026-022 is Active. Its inspection and test plan, item by item: H-01 Hold point Passed (date and verifier recorded); W-02 Witness point Passed (date and verifier recorded); H-03 Hold point Passed (date and verifier recorded); R-04 Review point Passed (date and verifier recorded); W-05 Witness point Passed (date and verifier recorded); H-06 Hold point Passed (date and verifier recorded); M-07 Monitor point Passed (date and verifier recorded); W-08 Witness point Passed (date and verifier recorded); R-09 Review point Passed (date and verifier recorded); W-10 Witness point Waived (reason recorded) (date and verifier recorded); M-11 Monitor point Not applicable; H-12 Hold point Not applicable (reason recorded) (date and verifier recorded); H-13 Hold point Failed (date and verifier recorded); H-14 Hold point Pending; H-15 Hold point Pending; W-16 Witness point Pending; W-17 Witness point Pending; S-18 Surveillance point Notified; M-19 Monitor point In progress; W-20 Witness point Passed (date and verifier recorded); R-21 Review point Passed (date and verifier recorded). The site then sends six requests, in this order: remove H-15; remove W-16; waive W-17 with a date and a verifier and no reason; set H-14 Not applicable with a date, a named certifying authority surveyor and a reason; set M-19 Not applicable with nothing recorded; pass S-18 with a date and no verifier. The NCRs: NCR-2026-044 Major, Actions in progress, raised 2026-05-06; NCR-2026-051 Minor, Open, raised 2026-07-19; NCR-2026-063 Critical, Under investigation, raised 2026-09-22; NCR-2026-060 Minor, Disposition agreed, raised 2026-09-04; NCR-2026-035 Observation, Closed, raised 2026-02-11, closed 2026-03-30; NCR-2026-029 Major, Voided, raised 2026-01-05, closed 2026-01-09. The contractor HSE audit checklist has 27 questions; the answers recorded are 13 Conformant, 3 Nonconformant with notes, 2 Observations with notes, 2 Not applicable with a written reason and 2 Not applicable with the reason left blank, and the remaining questions have no answer. The 2026 audit programme: AUD-2026-101 Closed; AUD-2026-102 Reported; AUD-2026-103 Reported; AUD-2026-104 Cancelled (reason recorded); AUD-2026-105 Closed; AUD-2026-106 Reported; AUD-2026-107 Cancelled (reason recorded); AUD-2026-108 Reported; AUD-2026-109 Fieldwork complete; AUD-2026-110 In progress; AUD-2026-111 Planned. Give six whole numbers. (1) The plan''s progress percent as recorded. (2) Its progress percent once the six requests have been put to the rules in order. (3) The age in days of the oldest open NCR. (4) The mean age in days of the open NCRs, as the dashboard rounds it. (5) The checklist''s progress percent. (6) The programme''s delivered percent.' then
    raise exception 'compliance go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'compliance' and tier = 'advanced';
  if v_prompt is distinct from 'OBEAKPU TERMINAL, ISO 45001:2018. The as-of date is 2026-10-15. The standard: Certified, certification cycle 3 years, certificate expiry 2026-08-27. The clause register (40 clauses): every clause is Applicable and Conformant with an evidence reference, an assessed date and an assessor, except 8.1.4.3, 6.1.3, 7.2, 7.4.3, 5.4, 9.1.2, which read: 8.1.4.3 Not applicable with its justification; 6.1.3 Nonconformant, assessed with a date and an assessor, no evidence reference; 7.2 Conformant with a date and an assessor and no evidence reference; 7.4.3 Partially conformant with an evidence reference and a date and no assessor; 5.4 Not assessed; 9.1.2 Partially conformant with an evidence reference, a date and an assessor. The audits: OSA-2023-002 Internal Closed; OSA-2025-001 Internal Closed; OSA-2026-001 Internal Reported; OSA-2026-002 Internal In progress; OSA-2025-004 Internal Cancelled; OSA-2026-S02 Surveillance Closed. Examinations: OSA-2025-001 examined every clause Conformant except 8.1.4.3, 4.4, 6.1.4, 7.5.2, 10.3, 5.3, 7.1 and 7.3, all on 2025-03-19; OSA-2026-001 examined 8.1.1, 8.1.2, 8.1.3, 8.2, 9.1.1 and 10.2 Conformant on 2026-03-25, 6.1.3 Nonconformant on 2026-03-26, and recorded 9.3 as Not examined on 2026-03-27; OSA-2026-002 examined 8.1.2 on 2026-09-30 and 6.1.4 on 2026-09-29; OSA-2026-S02 examined 8.1.2 on 2026-07-15 and 7.5.2 on 2026-07-16; OSA-2025-004 examined 10.3 on 2025-08-20; OSA-2023-002 examined 4.4 and 5.3 on 2023-06-14. The findings: OSF-2026-002 Major nonconformity, Closed, raised 2026-01-19, closed 2026-05-04; OSF-2026-007 Major nonconformity, Action in progress, raised 2026-03-26; OSF-2026-009 Minor nonconformity, Open, raised 2026-06-03. Give six whole numbers, in whole calendar days from the as-of date where a date is asked for (negative for the past). (1) The days until the last examination of 8.1.2 that counts towards coverage. (2) The same for 9.3. (3) The age in days of OSF-2026-002. (4) How many applicable clauses carry an evidenced conformity claim. (5) The certificate''s days as the readiness counts give them. (6) How many applicable clauses are covered.' then
    raise exception 'compliance go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_ekpe_emissions_permit_next_action_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_emissions_permit_next_action_days';
  select (f->>'expected')::numeric into v_g_ekpe_community_report_next_due_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_community_report_next_due_days';
  select (f->>'expected')::numeric into v_g_ekpe_waste_return_period_start_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_waste_return_period_start_days';
  select (f->>'expected')::numeric into v_g_ekpe_abstraction_next_action_after_filing_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_abstraction_next_action_after_filing_days';
  select (f->>'expected')::numeric into v_g_ekpe_slug_catcher_procedure_review_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_slug_catcher_procedure_review_days';
  select (f->>'expected')::numeric into v_g_ekpe_emergency_plan_review_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'beginner' and f->>'key' = 'ekpe_emergency_plan_review_days';
  select (f->>'expected')::numeric into v_g_utapate_itp_progress_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_itp_progress_pct';
  select (f->>'expected')::numeric into v_g_utapate_itp_progress_after_requests_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_itp_progress_after_requests_pct';
  select (f->>'expected')::numeric into v_g_utapate_oldest_open_ncr_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_oldest_open_ncr_days';
  select (f->>'expected')::numeric into v_g_utapate_mean_open_ncr_age_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_mean_open_ncr_age_days';
  select (f->>'expected')::numeric into v_g_utapate_checklist_progress_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_checklist_progress_pct';
  select (f->>'expected')::numeric into v_g_utapate_programme_delivered_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'intermediate' and f->>'key' = 'utapate_programme_delivered_pct';
  select (f->>'expected')::numeric into v_g_obeakpu_clause_812_last_examined_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_clause_812_last_examined_days';
  select (f->>'expected')::numeric into v_g_obeakpu_clause_93_last_examined_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_clause_93_last_examined_days';
  select (f->>'expected')::numeric into v_g_obeakpu_closed_major_finding_age_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_closed_major_finding_age_days';
  select (f->>'expected')::numeric into v_g_obeakpu_evidenced_claims
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_evidenced_claims';
  select (f->>'expected')::numeric into v_g_obeakpu_certificate_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_certificate_days';
  select (f->>'expected')::numeric into v_g_obeakpu_clauses_covered
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance' and c.tier = 'advanced' and f->>'key' = 'obeakpu_clauses_covered';
  if v_g_ekpe_emissions_permit_next_action_days is null
     or v_g_ekpe_community_report_next_due_days is null
     or v_g_ekpe_waste_return_period_start_days is null
     or v_g_ekpe_abstraction_next_action_after_filing_days is null
     or v_g_ekpe_slug_catcher_procedure_review_days is null
     or v_g_ekpe_emergency_plan_review_days is null
     or v_g_utapate_itp_progress_pct is null
     or v_g_utapate_itp_progress_after_requests_pct is null
     or v_g_utapate_oldest_open_ncr_days is null
     or v_g_utapate_mean_open_ncr_age_days is null
     or v_g_utapate_checklist_progress_pct is null
     or v_g_utapate_programme_delivered_pct is null
     or v_g_obeakpu_clause_812_last_examined_days is null
     or v_g_obeakpu_clause_93_last_examined_days is null
     or v_g_obeakpu_closed_major_finding_age_days is null
     or v_g_obeakpu_evidenced_claims is null
     or v_g_obeakpu_certificate_days is null
     or v_g_obeakpu_clauses_covered is null then
    raise exception 'compliance go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- PROMPTS. No graded value of any tier is a number token in any prompt once
  -- its YYYY-MM-DD conditions are taken out, signed or absolute, and none of
  -- the five dates the engine derives on the way to a graded day count is
  -- printed in any prompt, label, dataset or title.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           regexp_replace(p.prompt, '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'),
           '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_.])', 'g') as m
   where c.app_slug = 'compliance' and p.app_slug = 'compliance'
     and abs(abs((f->>'expected')::numeric) - abs((m[1])::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are printed in a prompt: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (46), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(
           regexp_replace(p.prompt, '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'),
           '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_.])', 'g') as m
   where p.app_slug = 'compliance';
  if v_n <> 46 then
    raise exception 'compliance go-live refused: the prompt sweep read % number tokens, and gen_course.py read 46 from the same prompts', v_n;
  end if;

  select count(*), string_agg(d || ' in the ' || p.tier || ' capstone', ', ')
    into v_n, v_names
    from public.academy_capstones p,
         unnest(array['2027-04-30', '2026-06-30', '2026-12-20', '2027-07-31', '2025-09-30']) d
   where p.app_slug = 'compliance'
     and strpos(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || p.fields::text, d) > 0;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % engine-derived date(s) are printed in a capstone: %', v_n, v_names;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'compliance') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'compliance') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (120 distinct values, dates
  -- included, read by the regex -?[0-9]+[.]?[0-9]*): a graded field that is a
  -- figure the digest prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'compliance'
     and exists (select 1 from unnest(array[0, 1, 2, 3, 4, 4.1, 4.3, 4.4, 5, 5.2, 6, 6.1, 7, 7.2, 7.5, 8, 8.1, 8.2, 9, 9.1, 9.2, 10, 10.2, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 36, 38, 40, 43, 44, 46, 48, 50, 57, 58, 59, 60, 61, 62, 63, 64, 71, 75, 76, 77, 85, 90, 91, 99, 100, 102, 103, 108, 117, 125, 126, 127, 128, 129, 130, 136, 150, 167, 168, 171, 181, 200, 201, 212, 213, 224, 229, 235, 240, 258, 320, 349, 422, 594, 647, 686, 714, 882, 1121, 2015, 2018, 2020, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2474, 9001, 14001, 19011, 45001]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  if v_g_ekpe_emissions_permit_next_action_days <> 65 then
    raise exception 'compliance go-live refused: the seeded value % is not the 65 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_emissions_permit_next_action_days]', v_g_ekpe_emissions_permit_next_action_days;
  end if;
  if v_g_ekpe_community_report_next_due_days <> 197 then
    raise exception 'compliance go-live refused: the seeded value % is not the 197 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_community_report_next_due_days]', v_g_ekpe_community_report_next_due_days;
  end if;
  if v_g_ekpe_waste_return_period_start_days <> -107 then
    raise exception 'compliance go-live refused: the seeded value % is not the -107 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_waste_return_period_start_days]', v_g_ekpe_waste_return_period_start_days;
  end if;
  if v_g_ekpe_abstraction_next_action_after_filing_days <> 66 then
    raise exception 'compliance go-live refused: the seeded value % is not the 66 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_abstraction_next_action_after_filing_days]', v_g_ekpe_abstraction_next_action_after_filing_days;
  end if;
  if v_g_ekpe_slug_catcher_procedure_review_days <> 289 then
    raise exception 'compliance go-live refused: the seeded value % is not the 289 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_slug_catcher_procedure_review_days]', v_g_ekpe_slug_catcher_procedure_review_days;
  end if;
  if v_g_ekpe_emergency_plan_review_days <> -380 then
    raise exception 'compliance go-live refused: the seeded value % is not the -380 the engine returned through compliance_capstone.mjs [graded field: beginner/ekpe_emergency_plan_review_days]', v_g_ekpe_emergency_plan_review_days;
  end if;
  if v_g_utapate_itp_progress_pct <> 67 then
    raise exception 'compliance go-live refused: the seeded value % is not the 67 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_itp_progress_pct]', v_g_utapate_itp_progress_pct;
  end if;
  if v_g_utapate_itp_progress_after_requests_pct <> 80 then
    raise exception 'compliance go-live refused: the seeded value % is not the 80 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_itp_progress_after_requests_pct]', v_g_utapate_itp_progress_after_requests_pct;
  end if;
  if v_g_utapate_oldest_open_ncr_days <> 162 then
    raise exception 'compliance go-live refused: the seeded value % is not the 162 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_oldest_open_ncr_days]', v_g_utapate_oldest_open_ncr_days;
  end if;
  if v_g_utapate_mean_open_ncr_age_days <> 79 then
    raise exception 'compliance go-live refused: the seeded value % is not the 79 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_mean_open_ncr_age_days]', v_g_utapate_mean_open_ncr_age_days;
  end if;
  if v_g_utapate_checklist_progress_pct <> 74 then
    raise exception 'compliance go-live refused: the seeded value % is not the 74 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_checklist_progress_pct]', v_g_utapate_checklist_progress_pct;
  end if;
  if v_g_utapate_programme_delivered_pct <> 55 then
    raise exception 'compliance go-live refused: the seeded value % is not the 55 the engine returned through compliance_capstone.mjs [graded field: intermediate/utapate_programme_delivered_pct]', v_g_utapate_programme_delivered_pct;
  end if;
  if v_g_obeakpu_clause_812_last_examined_days <> -204 then
    raise exception 'compliance go-live refused: the seeded value % is not the -204 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_clause_812_last_examined_days]', v_g_obeakpu_clause_812_last_examined_days;
  end if;
  if v_g_obeakpu_clause_93_last_examined_days <> -575 then
    raise exception 'compliance go-live refused: the seeded value % is not the -575 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_clause_93_last_examined_days]', v_g_obeakpu_clause_93_last_examined_days;
  end if;
  if v_g_obeakpu_closed_major_finding_age_days <> 105 then
    raise exception 'compliance go-live refused: the seeded value % is not the 105 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_closed_major_finding_age_days]', v_g_obeakpu_closed_major_finding_age_days;
  end if;
  if v_g_obeakpu_evidenced_claims <> 35 then
    raise exception 'compliance go-live refused: the seeded value % is not the 35 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_evidenced_claims]', v_g_obeakpu_evidenced_claims;
  end if;
  if v_g_obeakpu_certificate_days <> -49 then
    raise exception 'compliance go-live refused: the seeded value % is not the -49 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_certificate_days]', v_g_obeakpu_certificate_days;
  end if;
  if v_g_obeakpu_clauses_covered <> 32 then
    raise exception 'compliance go-live refused: the seeded value % is not the 32 the engine returned through compliance_capstone.mjs [graded field: advanced/obeakpu_clauses_covered]', v_g_obeakpu_clauses_covered;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, EKPE. The next action date is the earlier of the due date and
  -- the permit expiry. A filing rolls the schedule forward from the date that
  -- was DUE by the frequency's months, and the month-end is pulled back (date +
  -- interval in Postgres). The period a filing must fall in starts the same
  -- months back. A document's review date runs from its ISSUE date, never from
  -- a correction. Whole days are a date minus the as-of date.
  v_s_ekpe_emissions_permit_next_action_days := (case when (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'due_date')::date is not null and (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'expiry_date')::date is not null then least((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'due_date')::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'expiry_date')::date) else coalesce((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'due_date')::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'expiry_date')::date) end) - v_asof;
  v_s_ekpe_community_report_next_due_days :=
    (((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-042'))->>'due_date')::date) + make_interval(months => (case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-042'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date - v_asof;
  v_s_ekpe_waste_return_period_start_days :=
    (((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-043'))->>'due_date')::date) + make_interval(months => -(case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-043'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date - v_asof;
  v_s_ekpe_abstraction_next_action_after_filing_days :=
    (case when (((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date) + make_interval(months => (case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date is not null and (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date is not null then least((((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date) + make_interval(months => (case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date) else coalesce((((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date) + make_interval(months => (case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date) end) - v_asof;
  v_s_ekpe_slug_catcher_procedure_review_days :=
    (((((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'OPS-PRO-0031'))->>'issue_date')::date) + make_interval(months => (((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'OPS-PRO-0031'))->>'review_period_months')::int))::date - v_asof;
  v_s_ekpe_emergency_plan_review_days :=
    (((((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'HSE-PLA-0009'))->>'issue_date')::date) + make_interval(months => (((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'HSE-PLA-0009'))->>'review_period_months')::int))::date - v_asof;

  -- PROFESSIONAL, UTAPATE. A point is resolved when it is Passed, Waived or Not
  -- applicable; Failed is the most outstanding thing on a plan. Every percent
  -- is floor((200n + d) / 2d). The six requests are decided IN ORDER by the
  -- engine's rules: a point is removed only while nothing is recorded on it and,
  -- once the plan has left Draft, never a hold point; Passed, Failed and Waived
  -- need a date and a verifier; Waived needs a reason; a hold point set Not
  -- applicable needs the date, the verifier and the reason. A refused request
  -- changes nothing. v_pts_sent applies every request as sent, for the trap.
  v_s_utapate_itp_progress_pct := floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_checkpoints) p where p->>'status' in ('Passed', 'Waived', 'Not applicable'))) + (jsonb_array_length(v_utapate_checkpoints)))::numeric / (2 * (jsonb_array_length(v_utapate_checkpoints)))::numeric);
  v_pts := v_utapate_checkpoints;
  v_pts_sent := v_utapate_checkpoints;
  for v_rq in select e.value from jsonb_array_elements(v_utapate_requests) with ordinality e(value, o) order by e.o loop
    select p into v_cp from jsonb_array_elements(v_pts) p where p->>'id' = v_rq->>'item';
    if v_rq->>'kind' = 'remove' then
      v_ok := v_utapate_plan->>'status' not in ('Superseded', 'Closed', 'Cancelled')
              and coalesce(v_cp->>'status', 'Pending') in ('Pending', 'Notified', 'In progress')
              and coalesce(v_cp->>'result_date', '') = ''
              and not (v_cp->>'point_type' = 'Hold point' and v_utapate_plan->>'status' <> 'Draft');
      if v_ok then
        select coalesce(jsonb_agg(e.p order by e.o), '[]'::jsonb) into v_pts
          from jsonb_array_elements(v_pts) with ordinality e(p, o) where e.p->>'id' <> v_rq->>'item';
      end if;
      select coalesce(jsonb_agg(e.p order by e.o), '[]'::jsonb) into v_pts_sent
        from jsonb_array_elements(v_pts_sent) with ordinality e(p, o) where e.p->>'id' <> v_rq->>'item';
    else
      v_next := v_cp || coalesce(v_rq->'patch', '{}'::jsonb) || jsonb_build_object('status', v_rq->>'status');
      v_ver := coalesce(v_next->>'result_date', '') <> ''
               and (coalesce(v_next->>'verified_by', '') <> '' or btrim(coalesce(v_next->>'verifier_name', '')) <> '');
      v_ok := not (v_next->>'status' in ('Passed', 'Failed', 'Waived') and not v_ver)
              and not (v_next->>'status' = 'Not applicable' and v_next->>'point_type' = 'Hold point'
                       and (not v_ver or btrim(coalesce(v_next->>'remarks', '')) = ''))
              and not (v_next->>'status' = 'Waived' and btrim(coalesce(v_next->>'remarks', '')) = '');
      if v_ok then
        select jsonb_agg(case when e.p->>'id' = v_rq->>'item' then v_next else e.p end order by e.o) into v_pts
          from jsonb_array_elements(v_pts) with ordinality e(p, o);
      end if;
      select jsonb_agg(case when e.p->>'id' = v_rq->>'item'
                            then e.p || coalesce(v_rq->'patch', '{}'::jsonb) || jsonb_build_object('status', v_rq->>'status')
                            else e.p end order by e.o) into v_pts_sent
        from jsonb_array_elements(v_pts_sent) with ordinality e(p, o);
    end if;
    v_log := v_log || to_jsonb(v_ok);
  end loop;
  if v_log <> v_request_log then
    raise exception 'compliance go-live refused: the checkpoint rules in SQL decide the six requests as %, and the engine decided them as % in capstone.json [graded field: intermediate/utapate_itp_progress_after_requests_pct]', v_log, v_request_log;
  end if;
  v_s_utapate_itp_progress_after_requests_pct := floor((200 * ((select count(*) from jsonb_array_elements(v_pts) p where p->>'status' in ('Passed', 'Waived', 'Not applicable'))) + (jsonb_array_length(v_pts)))::numeric / (2 * (jsonb_array_length(v_pts)))::numeric);

  -- An NCR is open in five statuses; a closed or voided one stops ageing. The
  -- mean is Math.round of the mean, half up.
  select max(v_asof - (n->>'raised_date')::date), floor(avg(v_asof - (n->>'raised_date')::date) + 0.5)
    into v_s_utapate_oldest_open_ncr_days, v_s_utapate_mean_open_ncr_age_days
    from jsonb_array_elements(v_utapate_ncrs) n where n->>'status' in ('Open', 'Under investigation', 'Disposition agreed', 'Actions in progress', 'Verification');

  -- A question is answered by a recorded result, and a Not applicable only with
  -- its written reason. A delivered audit is Reported or Closed; a cancellation,
  -- with or without its reason, is not a delivered audit.
  v_s_utapate_checklist_progress_pct := floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_items) i join jsonb_array_elements(v_utapate_responses) r on r->>'item_id' = i->>'id' where r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and (r->>'result' <> 'Not applicable' or btrim(coalesce(r->>'note', '')) <> '' or false))) + (jsonb_array_length(v_utapate_items)))::numeric / (2 * (jsonb_array_length(v_utapate_items)))::numeric);
  v_s_utapate_programme_delivered_pct := floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_audits) a where a->>'status' in ('Reported', 'Closed'))) + (jsonb_array_length(v_utapate_audits)))::numeric / (2 * (jsonb_array_length(v_utapate_audits)))::numeric);

  -- EXPERT, OBEAKPU. An examination counts towards coverage only from an
  -- INTERNAL audit that is Reported or Closed, only when its result is an
  -- examination (a Not examined row is nothing), dated by its own examined_on
  -- and else the audit's actual end. A clause is covered when its last counting
  -- examination is on or after the same day cycle_years back (month-end pulled
  -- back). An evidenced claim is an applicable clause claiming Conformant or
  -- Partially conformant with an evidence reference, an assessed date and an
  -- assessor. A closed finding stops ageing at its closed date.
  v_cutoff := (v_asof - make_interval(years => coalesce((v_obeakpu_standard->>'cycle_years')::int, 3)))::date;
  v_s_obeakpu_clause_812_last_examined_days := (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' join jsonb_array_elements(v_obeakpu_clauses) c on c->>'id' = r->>'clause_id' where c->>'clause_ref' = '8.1.2' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and a->>'audit_type' in ('Internal') and a->>'status' in ('Reported', 'Closed')) - v_asof;
  v_s_obeakpu_clause_93_last_examined_days := (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' join jsonb_array_elements(v_obeakpu_clauses) c on c->>'id' = r->>'clause_id' where c->>'clause_ref' = '9.3' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and a->>'audit_type' in ('Internal') and a->>'status' in ('Reported', 'Closed')) - v_asof;
  select greatest(0, case when f->>'status' not in ('Open', 'Correction proposed', 'Action in progress', 'Verification') and coalesce(f->>'closed_date', '') <> ''
                          then (f->>'closed_date')::date else v_asof end - (f->>'raised_date')::date)
    into v_s_obeakpu_closed_major_finding_age_days from (select f from jsonb_array_elements(v_obeakpu_findings) f where f->>'finding_code' = 'OSF-2026-002') x(f);
  select count(*) into v_s_obeakpu_evidenced_claims from jsonb_array_elements(v_obeakpu_clauses) c
   where coalesce(c->>'applicability', '') <> 'Not applicable' and c->>'status' in ('Conformant', 'Partially conformant') and (btrim(coalesce(c->>'evidence_reference', '')) <> '' and coalesce(c->>'assessed_date', '') <> '' and (coalesce(c->>'assessed_by', '') <> '' or btrim(coalesce(c->>'assessor_name', '')) <> ''));
  v_s_obeakpu_certificate_days := (v_obeakpu_standard->>'certificate_expires')::date - v_asof;
  v_s_obeakpu_clauses_covered := (select count(*) from jsonb_array_elements(v_obeakpu_clauses) c where coalesce(c->>'applicability', '') <> 'Not applicable' and (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' where r->>'clause_id' = c->>'id' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and a->>'audit_type' in ('Internal') and a->>'status' in ('Reported', 'Closed')) >= v_cutoff);

  if v_s_ekpe_emissions_permit_next_action_days is distinct from v_g_ekpe_emissions_permit_next_action_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_emissions_permit_next_action_days]', v_s_ekpe_emissions_permit_next_action_days, v_g_ekpe_emissions_permit_next_action_days;
  end if;
  if v_s_ekpe_community_report_next_due_days is distinct from v_g_ekpe_community_report_next_due_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_community_report_next_due_days]', v_s_ekpe_community_report_next_due_days, v_g_ekpe_community_report_next_due_days;
  end if;
  if v_s_ekpe_waste_return_period_start_days is distinct from v_g_ekpe_waste_return_period_start_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_waste_return_period_start_days]', v_s_ekpe_waste_return_period_start_days, v_g_ekpe_waste_return_period_start_days;
  end if;
  if v_s_ekpe_abstraction_next_action_after_filing_days is distinct from v_g_ekpe_abstraction_next_action_after_filing_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_abstraction_next_action_after_filing_days]', v_s_ekpe_abstraction_next_action_after_filing_days, v_g_ekpe_abstraction_next_action_after_filing_days;
  end if;
  if v_s_ekpe_slug_catcher_procedure_review_days is distinct from v_g_ekpe_slug_catcher_procedure_review_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_slug_catcher_procedure_review_days]', v_s_ekpe_slug_catcher_procedure_review_days, v_g_ekpe_slug_catcher_procedure_review_days;
  end if;
  if v_s_ekpe_emergency_plan_review_days is distinct from v_g_ekpe_emergency_plan_review_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ekpe_emergency_plan_review_days]', v_s_ekpe_emergency_plan_review_days, v_g_ekpe_emergency_plan_review_days;
  end if;
  if v_s_utapate_itp_progress_pct is distinct from v_g_utapate_itp_progress_pct then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_itp_progress_pct]', v_s_utapate_itp_progress_pct, v_g_utapate_itp_progress_pct;
  end if;
  if v_s_utapate_itp_progress_after_requests_pct is distinct from v_g_utapate_itp_progress_after_requests_pct then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_itp_progress_after_requests_pct]', v_s_utapate_itp_progress_after_requests_pct, v_g_utapate_itp_progress_after_requests_pct;
  end if;
  if v_s_utapate_oldest_open_ncr_days is distinct from v_g_utapate_oldest_open_ncr_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_oldest_open_ncr_days]', v_s_utapate_oldest_open_ncr_days, v_g_utapate_oldest_open_ncr_days;
  end if;
  if v_s_utapate_mean_open_ncr_age_days is distinct from v_g_utapate_mean_open_ncr_age_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_mean_open_ncr_age_days]', v_s_utapate_mean_open_ncr_age_days, v_g_utapate_mean_open_ncr_age_days;
  end if;
  if v_s_utapate_checklist_progress_pct is distinct from v_g_utapate_checklist_progress_pct then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_checklist_progress_pct]', v_s_utapate_checklist_progress_pct, v_g_utapate_checklist_progress_pct;
  end if;
  if v_s_utapate_programme_delivered_pct is distinct from v_g_utapate_programme_delivered_pct then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/utapate_programme_delivered_pct]', v_s_utapate_programme_delivered_pct, v_g_utapate_programme_delivered_pct;
  end if;
  if v_s_obeakpu_clause_812_last_examined_days is distinct from v_g_obeakpu_clause_812_last_examined_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_clause_812_last_examined_days]', v_s_obeakpu_clause_812_last_examined_days, v_g_obeakpu_clause_812_last_examined_days;
  end if;
  if v_s_obeakpu_clause_93_last_examined_days is distinct from v_g_obeakpu_clause_93_last_examined_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_clause_93_last_examined_days]', v_s_obeakpu_clause_93_last_examined_days, v_g_obeakpu_clause_93_last_examined_days;
  end if;
  if v_s_obeakpu_closed_major_finding_age_days is distinct from v_g_obeakpu_closed_major_finding_age_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_closed_major_finding_age_days]', v_s_obeakpu_closed_major_finding_age_days, v_g_obeakpu_closed_major_finding_age_days;
  end if;
  if v_s_obeakpu_evidenced_claims is distinct from v_g_obeakpu_evidenced_claims then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_evidenced_claims]', v_s_obeakpu_evidenced_claims, v_g_obeakpu_evidenced_claims;
  end if;
  if v_s_obeakpu_certificate_days is distinct from v_g_obeakpu_certificate_days then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_certificate_days]', v_s_obeakpu_certificate_days, v_g_obeakpu_certificate_days;
  end if;
  if v_s_obeakpu_clauses_covered is distinct from v_g_obeakpu_clauses_covered then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/obeakpu_clauses_covered]', v_s_obeakpu_clauses_covered, v_g_obeakpu_clauses_covered;
  end if;

  -- ------------------------------------------------- 3. the traps bite
  -- Each wrong reading is computed over the same records and must MISS the
  -- graded value, or the field does not discriminate the trap it is for.
  select (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-041'))->>'due_date')::date - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_emissions_permit_next_action_days then
    raise exception 'compliance go-live refused: counting to the due date and missing the permit that expires first gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_emissions_permit_next_action_days]', v_wrong;
  end if;
  select ((date '2026-10-06') + make_interval(months => (case ((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-042'))->>'frequency' when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6 when 'Annual' then 12 when 'Biennial' then 24 end)))::date - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_community_report_next_due_days then
    raise exception 'compliance go-live refused: rolling the schedule forward from the filing date instead of the date that was due gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_community_report_next_due_days]', v_wrong;
  end if;
  select (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-043'))->>'last_submitted_date')::date - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_waste_return_period_start_days then
    raise exception 'compliance go-live refused: taking the last filing as the start of the period gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_waste_return_period_start_days]', v_wrong;
  end if;
  select (case when (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date is not null and (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date is not null then least((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date) else coalesce((((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'due_date')::date, (((select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = 'REG-2026-044'))->>'expiry_date')::date) end) - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_abstraction_next_action_after_filing_days then
    raise exception 'compliance go-live refused: leaving the filed return unrolled gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_abstraction_next_action_after_filing_days]', v_wrong;
  end if;
  select (((((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'OPS-PRO-0031'))->>'corrected_on')::date) + make_interval(months => (((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'OPS-PRO-0031'))->>'review_period_months')::int))::date - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_slug_catcher_procedure_review_days then
    raise exception 'compliance go-live refused: counting the review period from the correction instead of the issue gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_slug_catcher_procedure_review_days]', v_wrong;
  end if;
  select (((((select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = 'HSE-PLA-0009'))->>'issue_date')::date) + make_interval(months => 24))::date - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_ekpe_emergency_plan_review_days then
    raise exception 'compliance go-live refused: the default 24 month review period used instead of the document''s own gives %, so the field does not discriminate the trap [graded field: beginner/ekpe_emergency_plan_review_days]', v_wrong;
  end if;
  select floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_checkpoints) p where p->>'status' in ('Passed', 'Waived', 'Not applicable', 'Failed'))) + (jsonb_array_length(v_utapate_checkpoints)))::numeric / (2 * (jsonb_array_length(v_utapate_checkpoints)))::numeric) into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_itp_progress_pct then
    raise exception 'compliance go-live refused: a failed point counted as done gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_itp_progress_pct]', v_wrong;
  end if;
  select floor((200 * ((select count(*) from jsonb_array_elements(v_pts_sent) p where p->>'status' in ('Passed', 'Waived', 'Not applicable'))) + (jsonb_array_length(v_pts_sent)))::numeric / (2 * (jsonb_array_length(v_pts_sent)))::numeric) into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_itp_progress_after_requests_pct then
    raise exception 'compliance go-live refused: every request applied as sent, the refused ones included gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_itp_progress_after_requests_pct]', v_wrong;
  end if;
  select max(v_asof - (n->>'raised_date')::date) from jsonb_array_elements(v_utapate_ncrs) n into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_oldest_open_ncr_days then
    raise exception 'compliance go-live refused: the voided and closed NCRs aged to the as-of date gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_oldest_open_ncr_days]', v_wrong;
  end if;
  select floor(avg(coalesce(case when n->>'status' in ('Open', 'Under investigation', 'Disposition agreed', 'Actions in progress', 'Verification') then v_asof end, (n->>'closed_date')::date, v_asof) - (n->>'raised_date')::date) + 0.5) from jsonb_array_elements(v_utapate_ncrs) n into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_mean_open_ncr_age_days then
    raise exception 'compliance go-live refused: the closed and voided NCRs averaged in at their closed dates gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_mean_open_ncr_age_days]', v_wrong;
  end if;
  select floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_items) i join jsonb_array_elements(v_utapate_responses) r on r->>'item_id' = i->>'id' where r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and (r->>'result' <> 'Not applicable' or btrim(coalesce(r->>'note', '')) <> '' or true))) + (jsonb_array_length(v_utapate_items)))::numeric / (2 * (jsonb_array_length(v_utapate_items)))::numeric) into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_checklist_progress_pct then
    raise exception 'compliance go-live refused: a Not applicable with its reason left blank counted as answered gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_checklist_progress_pct]', v_wrong;
  end if;
  select floor((200 * ((select count(*) from jsonb_array_elements(v_utapate_audits) a where a->>'status' in ('Reported', 'Closed', 'Cancelled'))) + (jsonb_array_length(v_utapate_audits)))::numeric / (2 * (jsonb_array_length(v_utapate_audits)))::numeric) into v_wrong;
  if v_wrong is null or v_wrong = v_g_utapate_programme_delivered_pct then
    raise exception 'compliance go-live refused: the cancelled audits counted as delivered gives %, so the field does not discriminate the trap [graded field: intermediate/utapate_programme_delivered_pct]', v_wrong;
  end if;
  select (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' join jsonb_array_elements(v_obeakpu_clauses) c on c->>'id' = r->>'clause_id' where c->>'clause_ref' = '8.1.2' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and a->>'audit_type' in ('Internal') and a->>'status' in ('Reported', 'Closed', 'In progress')) - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_clause_812_last_examined_days then
    raise exception 'compliance go-live refused: the examination in the audit still In progress counted gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_clause_812_last_examined_days]', v_wrong;
  end if;
  select (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' join jsonb_array_elements(v_obeakpu_clauses) c on c->>'id' = r->>'clause_id' where c->>'clause_ref' = '9.3' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable', 'Not examined') and a->>'audit_type' in ('Internal') and a->>'status' in ('Reported', 'Closed')) - v_asof into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_clause_93_last_examined_days then
    raise exception 'compliance go-live refused: the Not examined row counted as an examination gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_clause_93_last_examined_days]', v_wrong;
  end if;
  select v_asof - (f->>'raised_date')::date from (select f from jsonb_array_elements(v_obeakpu_findings) f where f->>'finding_code' = 'OSF-2026-002') x(f) into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_closed_major_finding_age_days then
    raise exception 'compliance go-live refused: the closed finding aged to the as-of date gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_closed_major_finding_age_days]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_obeakpu_clauses) c where coalesce(c->>'applicability', '') <> 'Not applicable' and c->>'status' in ('Conformant', 'Partially conformant') into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_evidenced_claims then
    raise exception 'compliance go-live refused: every conformity claim counted whether or not its evidence record is whole gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_evidenced_claims]', v_wrong;
  end if;
  select abs((v_obeakpu_standard->>'certificate_expires')::date - v_asof) into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_certificate_days then
    raise exception 'compliance go-live refused: the days since the certificate expired given as a positive count gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_certificate_days]', v_wrong;
  end if;
  select (select count(*) from jsonb_array_elements(v_obeakpu_clauses) c where coalesce(c->>'applicability', '') <> 'Not applicable' and (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date)) from jsonb_array_elements(v_obeakpu_audit_clauses) r join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id' where r->>'clause_id' = c->>'id' and r->>'result' in ('Conformant', 'Nonconformant', 'Observation', 'Not applicable') and a->>'audit_type' in ('Internal', 'Surveillance') and a->>'status' in ('Reported', 'Closed')) >= v_cutoff) into v_wrong;
  if v_wrong is null or v_wrong = v_g_obeakpu_clauses_covered then
    raise exception 'compliance go-live refused: the certification body''s surveillance audit counted as internal audit coverage gives %, so the field does not discriminate the trap [graded field: advanced/obeakpu_clauses_covered]', v_wrong;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'compliance';
  if not exists (select 1 from public.academy_apps where slug = 'compliance' and status = 'available') then
    raise exception 'compliance go-live refused: compliance did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'compliance go-live: compliance available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
