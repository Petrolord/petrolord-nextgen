-- ============================================================================
-- riskchange GO-LIVE (HELD): Risk, Change & Learning flips to 'available', the
-- first course of the Assurance module, at path_order 59.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/riskchange. The 78 lessons, the teaching lab
-- (riskchangeLab.js) and its three explorer panels (risk, change and review)
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE'S OWN CALL LEDGER (capstone_calls.json, the calls
--      oracle_bridge.py replays through the Python oracles), so a capstone row
--      an earlier seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL over the very records the learner is handed:
--      the go-live first proves every rendered record line is in the shipped
--      prompt of its tier, then recomputes all eighteen values from those
--      records with the engine rules written out in SQL;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      records: the reading a learner who missed the trap would give is
--      computed and refused if it equals the graded value.
--
-- THE AS-OF DATE IS 2026-10-01, the one date every capstone prompt states. It is a
-- literal below and never current_date, so this file gives the same verdict on
-- whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a whole-number expected value at
-- tolerance 0.5, and the two date fields must be real calendar dates written
-- YYYYMMDD. All of it is asserted here, on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_prose text; v_wrong numeric;
  v_asof date := date '2026-10-01';
  v_g_igbara_i03_inherent_score numeric; v_s_igbara_i03_inherent_score numeric;
  v_g_igbara_i03_residual_score numeric; v_s_igbara_i03_residual_score numeric;
  v_g_igbara_live_residual_critical numeric; v_s_igbara_live_residual_critical numeric;
  v_g_igbara_live_inherent_high numeric; v_s_igbara_live_inherent_high numeric;
  v_g_igbara_i06_days_to_review numeric; v_s_igbara_i06_days_to_review numeric;
  v_g_igbara_i12_days_to_review numeric; v_s_igbara_i12_days_to_review numeric;
  v_g_okomu_ok01_ratify_due_yyyymmdd numeric; v_s_okomu_ok01_ratify_due_yyyymmdd numeric;
  v_g_okomu_register_expiring_soon numeric; v_s_okomu_register_expiring_soon numeric;
  v_g_okomu_register_expired numeric; v_s_okomu_register_expired numeric;
  v_g_okomu_register_open_actions numeric; v_s_okomu_register_open_actions numeric;
  v_g_okomu_register_overdue_actions numeric; v_s_okomu_register_overdue_actions numeric;
  v_g_okomu_register_ratification_overdue numeric; v_s_okomu_register_ratification_overdue numeric;
  v_g_etim_review_blocking numeric; v_s_etim_review_blocking numeric;
  v_g_etim_review_open_comments numeric; v_s_etim_review_open_comments numeric;
  v_g_etim_lesson_applied numeric; v_s_etim_lesson_applied numeric;
  v_g_etim_lesson_last_applied_yyyymmdd numeric; v_s_etim_lesson_last_applied_yyyymmdd numeric;
  v_g_etim_lesson_age_days numeric; v_s_etim_lesson_age_days numeric;
  v_g_etim_register_reviews_due_soon numeric; v_s_etim_register_reviews_due_soon numeric;
  v_igbara_risks jsonb := '[{"id":"IG-01","title":"Gas blow-by from the inlet separator to the tank farm","status":"Open","likelihood":5,"impact":4,"residual_likelihood":null,"residual_impact":null,"target_score":12,"next_review_date":"2026-12-01"},{"id":"IG-02","title":"Corrosion under insulation on the crude header","status":"Open","likelihood":4,"impact":4,"residual_likelihood":3,"residual_impact":4,"target_score":9,"next_review_date":"2026-11-20"},{"id":"IG-03","title":"Overpressure of production separator V-100","status":"Open","likelihood":4,"impact":5,"residual_likelihood":2,"residual_impact":"","target_score":8,"next_review_date":"2026-10-20"},{"id":"IG-04","title":"Community access road blocked during flooding","status":"Under Review","likelihood":3,"impact":5,"residual_likelihood":3,"residual_impact":5,"target_score":10,"next_review_date":"2027-01-10"},{"id":"IG-05","title":"Loss of containment at the test manifold","status":"Mitigated","likelihood":5,"impact":5,"residual_likelihood":2,"residual_impact":5,"target_score":10,"next_review_date":"2026-12-15"},{"id":"IG-06","title":"Generator exhaust fire in the power house","status":"Realized","likelihood":3,"impact":4,"residual_likelihood":2,"residual_impact":3,"target_score":6,"next_review_date":"2026-11-03"},{"id":"IG-07","title":"Chemical injection pump seal leak","status":"Draft","likelihood":3,"impact":4,"residual_likelihood":null,"residual_impact":null,"target_score":null,"next_review_date":null},{"id":"IG-08","title":"Dropped load on the flowline bridge","status":"Open","likelihood":3,"impact":4,"residual_likelihood":2.5,"residual_impact":4,"target_score":6,"next_review_date":"2026-12-20"},{"id":"IG-09","title":"Old saver pit overflow","status":"Closed","likelihood":4,"impact":5,"residual_likelihood":4,"residual_impact":5,"target_score":10,"next_review_date":"2026-06-30"},{"id":"IG-10","title":"Lightning strike on the flare stack","status":"Open","likelihood":2,"impact":5,"residual_likelihood":1,"residual_impact":5,"target_score":5,"next_review_date":"2027-02-01"},{"id":"IG-11","title":"Sand erosion of the choke valves","status":"Open","likelihood":2,"impact":3,"residual_likelihood":null,"residual_impact":null,"target_score":6,"next_review_date":"2026-12-31"},{"id":"IG-12","title":"Night driving between the flow station and the jetty","status":"Open","likelihood":3,"impact":4,"residual_likelihood":1,"residual_impact":4,"target_score":4,"next_review_date":"2026-09-13"}]'::jsonb;
  v_okomu_mocs jsonb := '[{"id":"OK-01","moc_number":"MOC-OK-01","title":"Replace the anti-surge valve positioner on compressor K-301","type":"Emergency","stage":"Implementation","actual_implementation_date":"2026-09-28","expiry_date":"2026-12-15","originator_id":"u-dayo"},{"id":"OK-02","moc_number":"MOC-OK-02","title":"Temporary bypass of the suction scrubber level trip","type":"Temporary","stage":"Implementation","expiry_date":"2026-10-15"},{"id":"OK-03","moc_number":"MOC-OK-03","title":"Temporary strainer in the lube oil return","type":"Temporary","stage":"Implementation","expiry_date":"2026-10-16"},{"id":"OK-04","moc_number":"MOC-OK-04","title":"Temporary hose to the fuel gas skid","type":"Temporary","stage":"Implementation","expiry_date":"2026-10-01"},{"id":"OK-05","moc_number":"MOC-OK-05","title":"Temporary relaxation of the discharge temperature alarm","type":"Temporary","stage":"Review","expiry_date":"2026-10-04"},{"id":"OK-06","moc_number":"MOC-OK-06","title":"Clamp on the cooler header","type":"Emergency","stage":"Implementation","actual_implementation_date":"2026-09-23","expiry_date":"2026-10-08"},{"id":"OK-07","moc_number":"MOC-OK-07","title":"Temporary generator for the control room","type":"Temporary","stage":"Implementation","expiry_date":"2026-09-30"},{"id":"OK-08","moc_number":"MOC-OK-08","title":"Temporary blind on the recycle line","type":"Temporary","stage":"Closed","expiry_date":"2026-09-01"},{"id":"OK-09","moc_number":"MOC-OK-09","title":"Temporary scaffold at the aftercooler","type":"Temporary","stage":"Screening","expiry_date":"2026-09-15"},{"id":"OK-10","moc_number":"MOC-OK-10","title":"Emergency isolation of a vibration probe","type":"Emergency","stage":"Implementation","actual_implementation_date":"2026-09-24","expiry_date":"2026-09-29"},{"id":"OK-11","moc_number":"MOC-OK-11","title":"New compressor wash procedure","type":"Permanent","stage":"Implementation","expiry_date":"2026-09-01"},{"id":"OK-12","moc_number":"MOC-OK-12","title":"Emergency repair to the gas detector loop","type":"Emergency","stage":"Implementation","expiry_date":"2026-11-30"},{"id":"OK-13","moc_number":"MOC-OK-13","title":"Emergency jumper on the instrument air header","type":"Emergency","stage":"Implementation","actual_implementation_date":"2026-09-10","expiry_date":"2026-09-20"},{"id":"OK-14","moc_number":"MOC-OK-14","title":"Emergency override of a seal gas alarm","type":"Emergency","stage":"Approval","expiry_date":"2026-10-03"},{"id":"OK-15","moc_number":"MOC-OK-15","title":"Temporary pressure gauge on the interstage line","type":"Temporary","stage":"Implementation","expiry_date":"2026-09-25"},{"id":"OK-16","moc_number":"MOC-OK-16","title":"Temporary crane on the compressor deck","type":"Temporary","stage":"Cancelled","expiry_date":"2026-09-10"},{"id":"OK-17","moc_number":"MOC-OK-17","title":"Temporary pipe support at the knockout drum","type":"Temporary","stage":"Implementation","expiry_date":"2026-09-12"},{"id":"OK-19","moc_number":"MOC-OK-19","title":"Emergency replacement of a relief valve spring","type":"Emergency","stage":"Implementation","actual_implementation_date":"2026-09-18","expiry_date":"2026-12-31"},{"id":"OK-20","moc_number":"MOC-OK-20","title":"Temporary spool at the fuel gas filter","type":"Temporary","stage":"Implementation","expiry_date":"2026-10-09"},{"id":"OK-21","moc_number":"MOC-OK-21","title":"Temporary lighting tower at the laydown yard","type":"Temporary","stage":"Implementation","expiry_date":"2026-10-12"},{"id":"OK-22","moc_number":"MOC-OK-22","title":"Temporary drain line to the closed drain drum","type":"Temporary","stage":"Closed","expiry_date":"2026-10-10"},{"id":"OK-23","moc_number":"MOC-OK-23","title":"Permanent change to the start-up sequence","type":"Permanent","stage":"Implementation","expiry_date":"2026-10-06"},{"id":"OK-24","moc_number":"MOC-OK-24","title":"Temporary hand valve on the purge line","type":"Temporary","stage":"Implementation","expiry_date":"2026-08-31"}]'::jsonb;
  v_okomu_approvals jsonb := '[{"id":"OA-01","moc_id":"OK-01","level":1,"status":"Approved","approver_id":"u-sade","decided_on":"2026-09-27"},{"id":"OA-02","moc_id":"OK-01","level":2,"status":"Pending","approver_id":"u-obi"},{"id":"OA-03","moc_id":"OK-06","level":1,"status":"Approved","approver_id":"u-sade"},{"id":"OA-04","moc_id":"OK-06","level":2,"status":"Pending","approver_id":"u-obi"},{"id":"OA-05","moc_id":"OK-10","level":1,"status":"Approved","approver_id":"u-sade"},{"id":"OA-06","moc_id":"OK-10","level":2,"status":"Pending","approver_id":"u-obi"},{"id":"OA-07","moc_id":"OK-12","level":1,"status":"Approved","approver_id":"u-sade"},{"id":"OA-08","moc_id":"OK-12","level":2,"status":"Pending","approver_id":"u-obi"},{"id":"OA-09","moc_id":"OK-13","level":1,"status":"Approved","approver_id":"u-sade"},{"id":"OA-10","moc_id":"OK-13","level":2,"status":"Approved","approver_id":"u-obi"},{"id":"OA-11","moc_id":"OK-14","level":1,"status":"Pending","approver_id":"u-sade"},{"id":"OA-12","moc_id":"OK-19","level":1,"status":"Approved","approver_id":"u-sade"},{"id":"OA-13","moc_id":"OK-19","level":2,"status":"Approved","approver_id":"u-obi"},{"id":"OA-14","moc_id":"OK-19","level":3,"status":"Pending","approver_id":"u-lara"}]'::jsonb;
  v_okomu_actions jsonb := '[{"id":"OX-01","moc_id":"OK-01","action_type":"Post-implementation","status":"Open","due_date":"2026-10-10"},{"id":"OX-02","moc_id":"OK-02","action_type":"Post-implementation","status":"In progress","due_date":"2026-10-02"},{"id":"OX-03","moc_id":"OK-03","action_type":"Implementation","status":"Complete","due_date":"2026-09-20"},{"id":"OX-04","moc_id":"OK-05","action_type":"Pre-implementation","status":"Open","due_date":"2026-10-01"},{"id":"OX-05","moc_id":"OK-07","action_type":"Post-implementation","status":"Cancelled","due_date":"2026-09-15"},{"id":"OX-06","moc_id":"OK-08","action_type":"Post-implementation","status":"Open","due_date":"2026-09-05"},{"id":"OX-07","moc_id":"OK-16","action_type":"Pre-implementation","status":"In progress","due_date":"2026-09-01"},{"id":"OX-08","moc_id":"OK-99","action_type":"Implementation","status":"Open","due_date":"2026-09-29"},{"id":"OX-09","moc_id":"OK-12","action_type":"Implementation","status":"Open","due_date":"2026-10-20"},{"id":"OX-10","moc_id":"OK-13","action_type":"Post-implementation","status":"In progress","due_date":"2026-10-02"},{"id":"OX-11","moc_id":"OK-09","action_type":"Pre-implementation","status":"Open","due_date":"2026-10-03"},{"id":"OX-12","moc_id":"OK-19","action_type":"Post-implementation","status":"Open","due_date":"2026-10-15"},{"id":"OX-13","moc_id":"OK-06","action_type":"Post-implementation","status":"In progress","due_date":"2026-10-08"},{"id":"OX-14","moc_id":"OK-21","action_type":"Post-implementation","status":"Open","due_date":"2026-10-12"},{"id":"OX-15","moc_id":"OK-14","action_type":"Pre-implementation","status":"Open","due_date":"2026-10-02"}]'::jsonb;
  v_etim_comments jsonb := '[{"id":"EC-01","review_id":"ET-R1","severity":"Critical","status":"Open","created_at":"2026-09-02T08:00:00Z"},{"id":"EC-02","review_id":"ET-R1","severity":"Critical","status":"Open","created_at":"2026-09-03T08:00:00Z"},{"id":"EC-03","review_id":"ET-R1","severity":"Critical","status":"Responded","response_text":"Response recorded.","created_at":"2026-09-03T08:00:00Z"},{"id":"EC-04","review_id":"ET-R1","severity":"Major","status":"Open","created_at":"2026-09-04T08:00:00Z"},{"id":"EC-05","review_id":"ET-R1","severity":"Major","status":"Responded","response_text":"Response recorded.","created_at":"2026-09-04T08:00:00Z"},{"id":"EC-06","review_id":"ET-R1","severity":"Major","status":"Rejected","response_text":"Response recorded.","created_at":"2026-09-05T08:00:00Z"},{"id":"EC-07","review_id":"ET-R1","severity":"Major","status":"Rejected","response_text":"Response recorded.","created_at":"2026-09-05T08:00:00Z"},{"id":"EC-08","review_id":"ET-R1","severity":"Major","status":"Verified","response_text":"Response recorded.","created_at":"2026-09-06T08:00:00Z"},{"id":"EC-09","review_id":"ET-R1","severity":"Critical","status":"Closed","response_text":"Response recorded.","created_at":"2026-09-06T08:00:00Z"},{"id":"EC-10","review_id":"ET-R1","severity":"Major","status":"Withdrawn","response_text":"Response recorded.","created_at":"2026-09-07T08:00:00Z"},{"id":"EC-11","review_id":"ET-R1","severity":"Minor","status":"Open","created_at":"2026-09-07T08:00:00Z"},{"id":"EC-12","review_id":"ET-R1","severity":"Minor","status":"Open","created_at":"2026-09-08T08:00:00Z"},{"id":"EC-13","review_id":"ET-R1","severity":"Editorial","status":"Open","created_at":"2026-09-08T08:00:00Z"},{"id":"EC-14","review_id":"ET-R1","severity":null,"status":"Open","created_at":"2026-09-09T08:00:00Z"},{"id":"EC-15","review_id":"ET-R1","severity":"Minor","status":"Rejected","response_text":"Response recorded.","created_at":"2026-09-09T08:00:00Z"}]'::jsonb;
  v_etim_applications jsonb := '[{"id":"EA-01","lesson_id":"EL-01","target_type":"Risk register","outcome":"Adopted","applied_on":"2026-04-30","target_risk_id":"ETR-14"},{"id":"EA-02","lesson_id":"EL-01","target_type":"Procedure","outcome":"Adapted","applied_on":"2026-05-05","reference":"Trip test procedure rev 7"},{"id":"EA-03","lesson_id":"EL-01","target_type":"Maintenance plan","outcome":"Adopted","applied_on":"2026-05-20","reference":"Valve stroke test routine"},{"id":"EA-04","lesson_id":"EL-01","target_type":"Management of change","outcome":"Adopted","applied_on":"2026-06-02","target_moc_id":"ETM-03"},{"id":"EA-05","lesson_id":"EL-01","target_type":"Design standard","outcome":"Adapted","applied_on":"2026-06-25","reference":"Actuator sizing standard"},{"id":"EA-06","lesson_id":"EL-01","target_type":"Training","outcome":"Rejected","applied_on":"2026-07-01","reference":"Control room course","notes":"Covered by the new simulator module."},{"id":"EA-07","lesson_id":"EL-01","target_type":"Contract or tender","outcome":"Adopted","applied_on":"2026-07-15","reference":"Valve supply tender"},{"id":"EA-08","lesson_id":"EL-01","target_type":"Procedure","outcome":"Adopted","applied_on":"2026-08-03","reference":"Isolation procedure rev 3"},{"id":"EA-09","lesson_id":"EL-01","target_type":"Maintenance plan","outcome":"Adapted","applied_on":"2026-08-19","reference":"Partial stroke test interval"},{"id":"EA-10","lesson_id":"EL-01","target_type":"Other","outcome":"Rejected","applied_on":"2026-09-12","reference":"Sister vessel","notes":"Different valve make."}]'::jsonb;
  v_etim_lessons jsonb := '[{"id":"EL-01","lesson_code":"LL-EL-01","title":"ESD valve failed to close on demand during a trip test","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-bassey","event_date":"2026-04-11","created_at":"2026-04-14T09:00:00Z","validated_at":"2026-04-28","validated_by":"u-edet","review_due":"2026-10-01"},{"id":"EL-02","lesson_code":"LL-EL-02","title":"Lesson EL-02","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-31"},{"id":"EL-03","lesson_code":"LL-EL-03","title":"Lesson EL-03","status":"Embedded","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-15"},{"id":"EL-04","lesson_code":"LL-EL-04","title":"Lesson EL-04","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-02"},{"id":"EL-05","lesson_code":"LL-EL-05","title":"Lesson EL-05","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-10"},{"id":"EL-06","lesson_code":"LL-EL-06","title":"Lesson EL-06","status":"Embedded","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-20"},{"id":"EL-07","lesson_code":"LL-EL-07","title":"Lesson EL-07","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-25"},{"id":"EL-08","lesson_code":"LL-EL-08","title":"Lesson EL-08","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-04"},{"id":"EL-09","lesson_code":"LL-EL-09","title":"Lesson EL-09","status":"Embedded","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-30"},{"id":"EL-10","lesson_code":"LL-EL-10","title":"Lesson EL-10","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-11-01"},{"id":"EL-11","lesson_code":"LL-EL-11","title":"Lesson EL-11","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-09-30"},{"id":"EL-12","lesson_code":"LL-EL-12","title":"Lesson EL-12","status":"Validated","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-12"},{"id":"EL-13","lesson_code":"LL-EL-13","title":"Lesson EL-13","status":"Archived","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01","review_due":"2026-10-08"},{"id":"EL-14","lesson_code":"LL-EL-14","title":"Lesson EL-14","status":"Published","description":"Recorded.","root_cause":"Recorded.","recommendation":"Recorded.","author_id":"u-edet","event_date":"2026-03-01"}]'::jsonb;
  v_igbara_live text[] := array['Open', 'Under Review', 'Mitigated', 'Realized'];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'riskchange' and active;
  if v_structures <> 3 then
    raise exception 'riskchange go-live refused: riskchange has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'riskchange';
  if v_questions <> 396 then
    raise exception 'riskchange go-live refused: riskchange has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'riskchange'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'riskchange' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'riskchange' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'riskchange'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'riskchange' and s.active;
  if v_lessons <> 78 then
    raise exception 'riskchange go-live refused: riskchange carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'riskchange' and s.active;
  if v_modules <> 18 then
    raise exception 'riskchange go-live refused: riskchange carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'riskchange' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'riskchange';
  if v_capstones <> 3 then
    raise exception 'riskchange go-live refused: riskchange has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'riskchange';
  if v_graded <> 18 then
    raise exception 'riskchange go-live refused: riskchange has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'riskchange' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'riskchange' and module = 'assurance'
                    and path_order = 59 and prereq_slug is null) then
    raise exception 'riskchange go-live refused: the riskchange catalogue row is not assurance at path_order 59 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 59 and slug <> 'riskchange') then
    raise exception 'riskchange go-live refused: another course already holds path_order 59';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a whole number at 0.5, with a label and a unit, and the two
  -- date fields real calendar dates written YYYYMMDD.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> 0.5
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are not a whole number at tolerance 0.5 with a label and a unit: %', v_n, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and f->>'key' like '%yyyymmdd'
     and (f->>'expected' !~ '^20[0-9]{6}$'
          or to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYYMMDD') <> f->>'expected');
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % date field(s) are not a real calendar date written YYYYMMDD: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads

  -- beginner: the prose verbatim, every record line present, and no other.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'riskchange' and tier = 'beginner';
  if split_part(v_prompt, E'\n\n', 1) <> 'IGBARA flow station, risk register, read on 2026-10-01. The table lists every risk with its status, likelihood, impact, residual likelihood, residual impact (a blank cell was left blank on the form, null was never assessed), target score and next review date. The register still carries the risks whose status is Open, Under Review, Mitigated or Realized. Give: the inherent score of IG-03; the residual score of IG-03; how many of the risks the register still carries are Critical on their residual score; how many of them are High on their inherent score; the whole days from the as-of date to the next review of IG-06; and the whole days from the as-of date to the next review of IG-12, negative if it has passed.' then
    raise exception 'riskchange go-live refused: the beginner prompt prose is not the prose PROMPTS carries';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[
      'IG-01 | title Gas blow-by from the inlet separator to the tank farm | status Open | likelihood 5 | impact 4 | residual likelihood null | residual impact null | target score 12 | next review date 2026-12-01.',
      'IG-02 | title Corrosion under insulation on the crude header | status Open | likelihood 4 | impact 4 | residual likelihood 3 | residual impact 4 | target score 9 | next review date 2026-11-20.',
      'IG-03 | title Overpressure of production separator V-100 | status Open | likelihood 4 | impact 5 | residual likelihood 2 | residual impact blank | target score 8 | next review date 2026-10-20.',
      'IG-04 | title Community access road blocked during flooding | status Under Review | likelihood 3 | impact 5 | residual likelihood 3 | residual impact 5 | target score 10 | next review date 2027-01-10.',
      'IG-05 | title Loss of containment at the test manifold | status Mitigated | likelihood 5 | impact 5 | residual likelihood 2 | residual impact 5 | target score 10 | next review date 2026-12-15.',
      'IG-06 | title Generator exhaust fire in the power house | status Realized | likelihood 3 | impact 4 | residual likelihood 2 | residual impact 3 | target score 6 | next review date 2026-11-03.',
      'IG-07 | title Chemical injection pump seal leak | status Draft | likelihood 3 | impact 4 | residual likelihood null | residual impact null | target score null | next review date null.',
      'IG-08 | title Dropped load on the flowline bridge | status Open | likelihood 3 | impact 4 | residual likelihood 2.5 | residual impact 4 | target score 6 | next review date 2026-12-20.',
      'IG-09 | title Old saver pit overflow | status Closed | likelihood 4 | impact 5 | residual likelihood 4 | residual impact 5 | target score 10 | next review date 2026-06-30.',
      'IG-10 | title Lightning strike on the flare stack | status Open | likelihood 2 | impact 5 | residual likelihood 1 | residual impact 5 | target score 5 | next review date 2027-02-01.',
      'IG-11 | title Sand erosion of the choke valves | status Open | likelihood 2 | impact 3 | residual likelihood null | residual impact null | target score 6 | next review date 2026-12-31.',
      'IG-12 | title Night driving between the flow station and the jetty | status Open | likelihood 3 | impact 4 | residual likelihood 1 | residual impact 4 | target score 4 | next review date 2026-09-13.']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % beginner record line(s) the second route reads are not in the shipped prompt: %', v_n, v_names;
  end if;
  select count(*) into v_n
    from regexp_split_to_table(v_prompt, E'\n') l
   where l ~ '^[A-Z]{2}-[A-Z]?[0-9]+ [|]';
  if v_n <> 12 then
    raise exception 'riskchange go-live refused: the beginner prompt carries % record lines, expected 12', v_n;
  end if;


  -- intermediate: the prose verbatim, every record line present, and no other.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'riskchange' and tier = 'intermediate';
  if split_part(v_prompt, E'\n\n', 1) <> 'OKOMU compression station, change register, read on 2026-10-01. The tables list every change with its type, stage, expiry date and actual implementation date, every approval row with its change, level and status, and every action with its change, type, status and due date. Give: the date by which every remaining approval level of OK-01 must have signed, written as eight digits year month day; how many changes read Expiring soon; how many read Expired; how many actions are open work; how many open actions are past their due date; and how many changes read Ratification overdue.' then
    raise exception 'riskchange go-live refused: the intermediate prompt prose is not the prose PROMPTS carries';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[
      'OK-01 | moc number MOC-OK-01 | title Replace the anti-surge valve positioner on compressor K-301 | type Emergency | stage Implementation | expiry date 2026-12-15 | actual implementation date 2026-09-28 | originator id u-dayo.',
      'OK-02 | moc number MOC-OK-02 | title Temporary bypass of the suction scrubber level trip | type Temporary | stage Implementation | expiry date 2026-10-15.',
      'OK-03 | moc number MOC-OK-03 | title Temporary strainer in the lube oil return | type Temporary | stage Implementation | expiry date 2026-10-16.',
      'OK-04 | moc number MOC-OK-04 | title Temporary hose to the fuel gas skid | type Temporary | stage Implementation | expiry date 2026-10-01.',
      'OK-05 | moc number MOC-OK-05 | title Temporary relaxation of the discharge temperature alarm | type Temporary | stage Review | expiry date 2026-10-04.',
      'OK-06 | moc number MOC-OK-06 | title Clamp on the cooler header | type Emergency | stage Implementation | expiry date 2026-10-08 | actual implementation date 2026-09-23.',
      'OK-07 | moc number MOC-OK-07 | title Temporary generator for the control room | type Temporary | stage Implementation | expiry date 2026-09-30.',
      'OK-08 | moc number MOC-OK-08 | title Temporary blind on the recycle line | type Temporary | stage Closed | expiry date 2026-09-01.',
      'OK-09 | moc number MOC-OK-09 | title Temporary scaffold at the aftercooler | type Temporary | stage Screening | expiry date 2026-09-15.',
      'OK-10 | moc number MOC-OK-10 | title Emergency isolation of a vibration probe | type Emergency | stage Implementation | expiry date 2026-09-29 | actual implementation date 2026-09-24.',
      'OK-11 | moc number MOC-OK-11 | title New compressor wash procedure | type Permanent | stage Implementation | expiry date 2026-09-01.',
      'OK-12 | moc number MOC-OK-12 | title Emergency repair to the gas detector loop | type Emergency | stage Implementation | expiry date 2026-11-30.',
      'OK-13 | moc number MOC-OK-13 | title Emergency jumper on the instrument air header | type Emergency | stage Implementation | expiry date 2026-09-20 | actual implementation date 2026-09-10.',
      'OK-14 | moc number MOC-OK-14 | title Emergency override of a seal gas alarm | type Emergency | stage Approval | expiry date 2026-10-03.',
      'OK-15 | moc number MOC-OK-15 | title Temporary pressure gauge on the interstage line | type Temporary | stage Implementation | expiry date 2026-09-25.',
      'OK-16 | moc number MOC-OK-16 | title Temporary crane on the compressor deck | type Temporary | stage Cancelled | expiry date 2026-09-10.',
      'OK-17 | moc number MOC-OK-17 | title Temporary pipe support at the knockout drum | type Temporary | stage Implementation | expiry date 2026-09-12.',
      'OK-19 | moc number MOC-OK-19 | title Emergency replacement of a relief valve spring | type Emergency | stage Implementation | expiry date 2026-12-31 | actual implementation date 2026-09-18.',
      'OK-20 | moc number MOC-OK-20 | title Temporary spool at the fuel gas filter | type Temporary | stage Implementation | expiry date 2026-10-09.',
      'OK-21 | moc number MOC-OK-21 | title Temporary lighting tower at the laydown yard | type Temporary | stage Implementation | expiry date 2026-10-12.',
      'OK-22 | moc number MOC-OK-22 | title Temporary drain line to the closed drain drum | type Temporary | stage Closed | expiry date 2026-10-10.',
      'OK-23 | moc number MOC-OK-23 | title Permanent change to the start-up sequence | type Permanent | stage Implementation | expiry date 2026-10-06.',
      'OK-24 | moc number MOC-OK-24 | title Temporary hand valve on the purge line | type Temporary | stage Implementation | expiry date 2026-08-31.',
      'OA-01 | moc id OK-01 | level 1 | status Approved | approver id u-sade | decided on 2026-09-27.',
      'OA-02 | moc id OK-01 | level 2 | status Pending | approver id u-obi.',
      'OA-03 | moc id OK-06 | level 1 | status Approved | approver id u-sade.',
      'OA-04 | moc id OK-06 | level 2 | status Pending | approver id u-obi.',
      'OA-05 | moc id OK-10 | level 1 | status Approved | approver id u-sade.',
      'OA-06 | moc id OK-10 | level 2 | status Pending | approver id u-obi.',
      'OA-07 | moc id OK-12 | level 1 | status Approved | approver id u-sade.',
      'OA-08 | moc id OK-12 | level 2 | status Pending | approver id u-obi.',
      'OA-09 | moc id OK-13 | level 1 | status Approved | approver id u-sade.',
      'OA-10 | moc id OK-13 | level 2 | status Approved | approver id u-obi.',
      'OA-11 | moc id OK-14 | level 1 | status Pending | approver id u-sade.',
      'OA-12 | moc id OK-19 | level 1 | status Approved | approver id u-sade.',
      'OA-13 | moc id OK-19 | level 2 | status Approved | approver id u-obi.',
      'OA-14 | moc id OK-19 | level 3 | status Pending | approver id u-lara.',
      'OX-01 | moc id OK-01 | action type Post-implementation | status Open | due date 2026-10-10.',
      'OX-02 | moc id OK-02 | action type Post-implementation | status In progress | due date 2026-10-02.',
      'OX-03 | moc id OK-03 | action type Implementation | status Complete | due date 2026-09-20.',
      'OX-04 | moc id OK-05 | action type Pre-implementation | status Open | due date 2026-10-01.',
      'OX-05 | moc id OK-07 | action type Post-implementation | status Cancelled | due date 2026-09-15.',
      'OX-06 | moc id OK-08 | action type Post-implementation | status Open | due date 2026-09-05.',
      'OX-07 | moc id OK-16 | action type Pre-implementation | status In progress | due date 2026-09-01.',
      'OX-08 | moc id OK-99 | action type Implementation | status Open | due date 2026-09-29.',
      'OX-09 | moc id OK-12 | action type Implementation | status Open | due date 2026-10-20.',
      'OX-10 | moc id OK-13 | action type Post-implementation | status In progress | due date 2026-10-02.',
      'OX-11 | moc id OK-09 | action type Pre-implementation | status Open | due date 2026-10-03.',
      'OX-12 | moc id OK-19 | action type Post-implementation | status Open | due date 2026-10-15.',
      'OX-13 | moc id OK-06 | action type Post-implementation | status In progress | due date 2026-10-08.',
      'OX-14 | moc id OK-21 | action type Post-implementation | status Open | due date 2026-10-12.',
      'OX-15 | moc id OK-14 | action type Pre-implementation | status Open | due date 2026-10-02.']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % intermediate record line(s) the second route reads are not in the shipped prompt: %', v_n, v_names;
  end if;
  select count(*) into v_n
    from regexp_split_to_table(v_prompt, E'\n') l
   where l ~ '^[A-Z]{2}-[A-Z]?[0-9]+ [|]';
  if v_n <> 52 then
    raise exception 'riskchange go-live refused: the intermediate prompt carries % record lines, expected 52', v_n;
  end if;


  -- advanced: the prose verbatim, every record line present, and no other.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'riskchange' and tier = 'advanced';
  if split_part(v_prompt, E'\n\n', 1) <> 'ETIM floating production unit, read on 2026-10-01. The first table is the comment log of review ET-R1 with each comment severity and disposition. The second is every application recorded for lesson EL-01 with its target, outcome and date; EL-01 records its event date. The third is the lessons register with each lesson status and review date. Give: how many comments block the closure of ET-R1; how many comments on ET-R1 are open; how many applications of EL-01 changed something; the date EL-01 was last applied, written as eight digits year month day; the age of EL-01 in whole days; and how many lessons on the register read review due soon.' then
    raise exception 'riskchange go-live refused: the advanced prompt prose is not the prose PROMPTS carries';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[
      'EC-01 | review id ET-R1 | severity Critical | status Open | created at 2026-09-02T08:00:00Z.',
      'EC-02 | review id ET-R1 | severity Critical | status Open | created at 2026-09-03T08:00:00Z.',
      'EC-03 | review id ET-R1 | severity Critical | status Responded | response text Response recorded. | created at 2026-09-03T08:00:00Z.',
      'EC-04 | review id ET-R1 | severity Major | status Open | created at 2026-09-04T08:00:00Z.',
      'EC-05 | review id ET-R1 | severity Major | status Responded | response text Response recorded. | created at 2026-09-04T08:00:00Z.',
      'EC-06 | review id ET-R1 | severity Major | status Rejected | response text Response recorded. | created at 2026-09-05T08:00:00Z.',
      'EC-07 | review id ET-R1 | severity Major | status Rejected | response text Response recorded. | created at 2026-09-05T08:00:00Z.',
      'EC-08 | review id ET-R1 | severity Major | status Verified | response text Response recorded. | created at 2026-09-06T08:00:00Z.',
      'EC-09 | review id ET-R1 | severity Critical | status Closed | response text Response recorded. | created at 2026-09-06T08:00:00Z.',
      'EC-10 | review id ET-R1 | severity Major | status Withdrawn | response text Response recorded. | created at 2026-09-07T08:00:00Z.',
      'EC-11 | review id ET-R1 | severity Minor | status Open | created at 2026-09-07T08:00:00Z.',
      'EC-12 | review id ET-R1 | severity Minor | status Open | created at 2026-09-08T08:00:00Z.',
      'EC-13 | review id ET-R1 | severity Editorial | status Open | created at 2026-09-08T08:00:00Z.',
      'EC-14 | review id ET-R1 | severity null | status Open | created at 2026-09-09T08:00:00Z.',
      'EC-15 | review id ET-R1 | severity Minor | status Rejected | response text Response recorded. | created at 2026-09-09T08:00:00Z.',
      'EA-01 | lesson id EL-01 | target type Risk register | outcome Adopted | applied on 2026-04-30 | target risk id ETR-14.',
      'EA-02 | lesson id EL-01 | target type Procedure | outcome Adapted | applied on 2026-05-05 | reference Trip test procedure rev 7.',
      'EA-03 | lesson id EL-01 | target type Maintenance plan | outcome Adopted | applied on 2026-05-20 | reference Valve stroke test routine.',
      'EA-04 | lesson id EL-01 | target type Management of change | outcome Adopted | applied on 2026-06-02 | target moc id ETM-03.',
      'EA-05 | lesson id EL-01 | target type Design standard | outcome Adapted | applied on 2026-06-25 | reference Actuator sizing standard.',
      'EA-06 | lesson id EL-01 | target type Training | outcome Rejected | applied on 2026-07-01 | reference Control room course | notes Covered by the new simulator module..',
      'EA-07 | lesson id EL-01 | target type Contract or tender | outcome Adopted | applied on 2026-07-15 | reference Valve supply tender.',
      'EA-08 | lesson id EL-01 | target type Procedure | outcome Adopted | applied on 2026-08-03 | reference Isolation procedure rev 3.',
      'EA-09 | lesson id EL-01 | target type Maintenance plan | outcome Adapted | applied on 2026-08-19 | reference Partial stroke test interval.',
      'EA-10 | lesson id EL-01 | target type Other | outcome Rejected | applied on 2026-09-12 | reference Sister vessel | notes Different valve make..',
      'EL-01 | lesson code LL-EL-01 | title ESD valve failed to close on demand during a trip test | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-bassey | event date 2026-04-11 | created at 2026-04-14T09:00:00Z | validated at 2026-04-28 | validated by u-edet | review due 2026-10-01.',
      'EL-02 | lesson code LL-EL-02 | title Lesson EL-02 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-31.',
      'EL-03 | lesson code LL-EL-03 | title Lesson EL-03 | status Embedded | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-15.',
      'EL-04 | lesson code LL-EL-04 | title Lesson EL-04 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-02.',
      'EL-05 | lesson code LL-EL-05 | title Lesson EL-05 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-10.',
      'EL-06 | lesson code LL-EL-06 | title Lesson EL-06 | status Embedded | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-20.',
      'EL-07 | lesson code LL-EL-07 | title Lesson EL-07 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-25.',
      'EL-08 | lesson code LL-EL-08 | title Lesson EL-08 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-04.',
      'EL-09 | lesson code LL-EL-09 | title Lesson EL-09 | status Embedded | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-30.',
      'EL-10 | lesson code LL-EL-10 | title Lesson EL-10 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-11-01.',
      'EL-11 | lesson code LL-EL-11 | title Lesson EL-11 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-09-30.',
      'EL-12 | lesson code LL-EL-12 | title Lesson EL-12 | status Validated | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-12.',
      'EL-13 | lesson code LL-EL-13 | title Lesson EL-13 | status Archived | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01 | review due 2026-10-08.',
      'EL-14 | lesson code LL-EL-14 | title Lesson EL-14 | status Published | description Recorded. | root cause Recorded. | recommendation Recorded. | author id u-edet | event date 2026-03-01.']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % advanced record line(s) the second route reads are not in the shipped prompt: %', v_n, v_names;
  end if;
  select count(*) into v_n
    from regexp_split_to_table(v_prompt, E'\n') l
   where l ~ '^[A-Z]{2}-[A-Z]?[0-9]+ [|]';
  if v_n <> 39 then
    raise exception 'riskchange go-live refused: the advanced prompt carries % record lines, expected 39', v_n;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_igbara_i03_inherent_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_i03_inherent_score';
  select (f->>'expected')::numeric into v_g_igbara_i03_residual_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_i03_residual_score';
  select (f->>'expected')::numeric into v_g_igbara_live_residual_critical
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_live_residual_critical';
  select (f->>'expected')::numeric into v_g_igbara_live_inherent_high
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_live_inherent_high';
  select (f->>'expected')::numeric into v_g_igbara_i06_days_to_review
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_i06_days_to_review';
  select (f->>'expected')::numeric into v_g_igbara_i12_days_to_review
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'beginner' and f->>'key' = 'igbara_i12_days_to_review';
  select (f->>'expected')::numeric into v_g_okomu_ok01_ratify_due_yyyymmdd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_ok01_ratify_due_yyyymmdd';
  select (f->>'expected')::numeric into v_g_okomu_register_expiring_soon
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_register_expiring_soon';
  select (f->>'expected')::numeric into v_g_okomu_register_expired
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_register_expired';
  select (f->>'expected')::numeric into v_g_okomu_register_open_actions
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_register_open_actions';
  select (f->>'expected')::numeric into v_g_okomu_register_overdue_actions
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_register_overdue_actions';
  select (f->>'expected')::numeric into v_g_okomu_register_ratification_overdue
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'intermediate' and f->>'key' = 'okomu_register_ratification_overdue';
  select (f->>'expected')::numeric into v_g_etim_review_blocking
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_review_blocking';
  select (f->>'expected')::numeric into v_g_etim_review_open_comments
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_review_open_comments';
  select (f->>'expected')::numeric into v_g_etim_lesson_applied
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_lesson_applied';
  select (f->>'expected')::numeric into v_g_etim_lesson_last_applied_yyyymmdd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_lesson_last_applied_yyyymmdd';
  select (f->>'expected')::numeric into v_g_etim_lesson_age_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_lesson_age_days';
  select (f->>'expected')::numeric into v_g_etim_register_reviews_due_soon
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange' and c.tier = 'advanced' and f->>'key' = 'etim_register_reviews_due_soon';
  if v_g_igbara_i03_inherent_score is null
     or v_g_igbara_i03_residual_score is null
     or v_g_igbara_live_residual_critical is null
     or v_g_igbara_live_inherent_high is null
     or v_g_igbara_i06_days_to_review is null
     or v_g_igbara_i12_days_to_review is null
     or v_g_okomu_ok01_ratify_due_yyyymmdd is null
     or v_g_okomu_register_expiring_soon is null
     or v_g_okomu_register_expired is null
     or v_g_okomu_register_open_actions is null
     or v_g_okomu_register_overdue_actions is null
     or v_g_okomu_register_ratification_overdue is null
     or v_g_etim_review_blocking is null
     or v_g_etim_review_open_comments is null
     or v_g_etim_lesson_applied is null
     or v_g_etim_lesson_last_applied_yyyymmdd is null
     or v_g_etim_lesson_age_days is null
     or v_g_etim_register_reviews_due_soon is null then
    raise exception 'riskchange go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- PROSE. No graded value of any tier in any prompt's first paragraph, once
  -- record ids and the as-of date are taken out.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prose', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(regexp_replace(split_part(p.prompt, E'\n\n', 1), '[A-Z]{2}-[A-Z]?[0-9]+', ' ', 'g'), '2026-10-01', ' '),
           '(-?[0-9]+(\.[0-9]+)?)', 'g') as m
   where c.app_slug = 'riskchange' and p.app_slug = 'riskchange'
     and abs((f->>'expected')::numeric - (m[1])::numeric) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are stated in a prompt''s prose: %', v_n, v_names;
  end if;

  -- DATES. A graded date appears in no prompt in either spelling, except the
  -- one selection date, exactly once, in its declared column.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p
   where c.app_slug = 'riskchange' and p.app_slug = 'riskchange' and f->>'key' like '%yyyymmdd'
     and f->>'key' <> 'etim_lesson_last_applied_yyyymmdd'
     and (strpos(p.prompt, f->>'expected') > 0
          or strpos(p.prompt, to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYY-MM-DD')) > 0);
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded date(s) are printed in a prompt: %', v_n, v_names;
  end if;

  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, to_char(to_date(v_g_etim_lesson_last_applied_yyyymmdd::text, 'YYYYMMDD'), 'YYYY-MM-DD'), 'g') m
   where p.app_slug = 'riskchange';
  if v_n <> 1 or strpos((select prompt from public.academy_capstones where app_slug = 'riskchange' and tier = 'advanced'),
                        'applied on ' || to_char(to_date(v_g_etim_lesson_last_applied_yyyymmdd::text, 'YYYYMMDD'), 'YYYY-MM-DD')) = 0
     or strpos((select string_agg(prompt, ' ') from public.academy_capstones where app_slug = 'riskchange'),
               v_g_etim_lesson_last_applied_yyyymmdd::text) > 0 then
    raise exception 'riskchange go-live refused: the selection date % is printed % time(s) across the prompts, and must appear exactly once, in the advanced applications table as its applied on date, and never as eight digits [graded field: advanced/etim_lesson_last_applied_yyyymmdd]', v_g_etim_lesson_last_applied_yyyymmdd, v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'riskchange') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'riskchange') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded date is a date the teaching digest prints, and no DISTINCTIVE
  -- graded integer (below 0, or 25 and above) is an integer it prints. A small
  -- count is exempt by construction: the digest prints the numeral 2 many times
  -- over, and a count of two is not a lookup of any of them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'riskchange'
     and ((f->>'key' like '%yyyymmdd'
           and to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYY-MM-DD') = any (array['2025-02-01', '2025-06-01', '2025-10-01', '2026-01-20', '2026-02-30', '2026-03-12', '2026-05-02', '2026-05-30', '2026-06-05', '2026-06-10', '2026-07-01', '2026-07-14', '2026-07-20', '2026-08-01', '2026-08-10', '2026-08-14', '2026-08-15', '2026-08-20', '2026-09-01', '2026-09-08', '2026-09-10', '2026-09-15', '2026-09-18', '2026-09-20', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-10', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-20', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-15', '2026-11-29', '2026-11-30', '2026-12-01', '2026-12-15', '2026-12-31', '2026-13-01', '2027-01-01', '2027-01-15', '2027-03-31']))
       or (f->>'key' not like '%yyyymmdd'
           and ((f->>'expected')::numeric < 0 or (f->>'expected')::numeric >= 25)
           and (f->>'expected')::numeric = any (array[-365, -30, -16, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 29, 30, 31, 34, 36, 38, 40, 45, 48, 60, 61, 69, 75, 77, 92, 106, 118, 124, 140, 181, 184, 203, 212, 254, 291, 345, 487, 607, 1037, 2025, 2026, 2027]::numeric[])));
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are a date or a distinctive integer the digest prints: %', v_n, v_names;
  end if;


  -- ------------------------------------ 1. against the engine call ledger
  if v_g_igbara_i03_inherent_score <> 20 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 20 the engine returned in capstone_calls.json [graded field: beginner/igbara_i03_inherent_score]', v_g_igbara_i03_inherent_score;
  end if;
  if v_g_igbara_i03_residual_score <> 10 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 10 the engine returned in capstone_calls.json [graded field: beginner/igbara_i03_residual_score]', v_g_igbara_i03_residual_score;
  end if;
  if v_g_igbara_live_residual_critical <> 2 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 2 the engine returned in capstone_calls.json [graded field: beginner/igbara_live_residual_critical]', v_g_igbara_live_residual_critical;
  end if;
  if v_g_igbara_live_inherent_high <> 4 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 4 the engine returned in capstone_calls.json [graded field: beginner/igbara_live_inherent_high]', v_g_igbara_live_inherent_high;
  end if;
  if v_g_igbara_i06_days_to_review <> 33 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 33 the engine returned in capstone_calls.json [graded field: beginner/igbara_i06_days_to_review]', v_g_igbara_i06_days_to_review;
  end if;
  if v_g_igbara_i12_days_to_review <> -18 then
    raise exception 'riskchange go-live refused: the seeded value % is not the -18 the engine returned in capstone_calls.json [graded field: beginner/igbara_i12_days_to_review]', v_g_igbara_i12_days_to_review;
  end if;
  if v_g_okomu_ok01_ratify_due_yyyymmdd <> 20261005 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 20261005 the engine returned in capstone_calls.json [graded field: intermediate/okomu_ok01_ratify_due_yyyymmdd]', v_g_okomu_ok01_ratify_due_yyyymmdd;
  end if;
  if v_g_okomu_register_expiring_soon <> 5 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 5 the engine returned in capstone_calls.json [graded field: intermediate/okomu_register_expiring_soon]', v_g_okomu_register_expiring_soon;
  end if;
  if v_g_okomu_register_expired <> 6 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 6 the engine returned in capstone_calls.json [graded field: intermediate/okomu_register_expired]', v_g_okomu_register_expired;
  end if;
  if v_g_okomu_register_open_actions <> 11 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 11 the engine returned in capstone_calls.json [graded field: intermediate/okomu_register_open_actions]', v_g_okomu_register_open_actions;
  end if;
  if v_g_okomu_register_overdue_actions <> 1 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 1 the engine returned in capstone_calls.json [graded field: intermediate/okomu_register_overdue_actions]', v_g_okomu_register_overdue_actions;
  end if;
  if v_g_okomu_register_ratification_overdue <> 3 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 3 the engine returned in capstone_calls.json [graded field: intermediate/okomu_register_ratification_overdue]', v_g_okomu_register_ratification_overdue;
  end if;
  if v_g_etim_review_blocking <> 7 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 7 the engine returned in capstone_calls.json [graded field: advanced/etim_review_blocking]', v_g_etim_review_blocking;
  end if;
  if v_g_etim_review_open_comments <> 12 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 12 the engine returned in capstone_calls.json [graded field: advanced/etim_review_open_comments]', v_g_etim_review_open_comments;
  end if;
  if v_g_etim_lesson_applied <> 8 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 8 the engine returned in capstone_calls.json [graded field: advanced/etim_lesson_applied]', v_g_etim_lesson_applied;
  end if;
  if v_g_etim_lesson_last_applied_yyyymmdd <> 20260819 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 20260819 the engine returned in capstone_calls.json [graded field: advanced/etim_lesson_last_applied_yyyymmdd]', v_g_etim_lesson_last_applied_yyyymmdd;
  end if;
  if v_g_etim_lesson_age_days <> 173 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 173 the engine returned in capstone_calls.json [graded field: advanced/etim_lesson_age_days]', v_g_etim_lesson_age_days;
  end if;
  if v_g_etim_register_reviews_due_soon <> 9 then
    raise exception 'riskchange go-live refused: the seeded value % is not the 9 the engine returned in capstone_calls.json [graded field: advanced/etim_register_reviews_due_soon]', v_g_etim_register_reviews_due_soon;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IGBARA. A level is a whole number from 1 to 5 or it is unscored;
  -- a score is the product of two levels, or 0 when either is unscored; the
  -- residual falls back to the inherent level ONE AXIS AT A TIME when its own
  -- cell is blank or null; a band is found by its lower edge alone.
  select coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0), coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0)
    into v_s_igbara_i03_inherent_score, v_s_igbara_i03_residual_score
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-03';
  select count(*) filter (where (case when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 15 then 'Critical' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 10 then 'High' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 5 then 'Medium' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 1 then 'Low' else 'None' end) = 'Critical'),
         count(*) filter (where (case when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 15 then 'Critical' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 10 then 'High' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 5 then 'Medium' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 1 then 'Low' else 'None' end) = 'High')
    into v_s_igbara_live_residual_critical, v_s_igbara_live_inherent_high
    from jsonb_array_elements(v_igbara_risks) r where r->>'status' = any (v_igbara_live);
  select ((r->>'next_review_date')::date - v_asof) into v_s_igbara_i06_days_to_review
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-06';
  select ((r->>'next_review_date')::date - v_asof) into v_s_igbara_i12_days_to_review
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-12';

  -- PROFESSIONAL, OKOMU. Expiry is read only for a Temporary or Emergency
  -- change IN EFFECT and not closed out, with the 14-day lead counted
  -- inclusively. Ratification is owed by an Emergency change in effect whose
  -- approval levels are not all signed without a rejection; it is due seven
  -- days after the ACTUAL implementation date, and with no such date it is
  -- overdue because the window cannot be shown open. Actions on a change in a
  -- terminal stage are not open work; an action on a change the register does
  -- not hold still is.
  select to_char((r->>'actual_implementation_date')::date + 7, 'YYYYMMDD')::numeric
    into v_s_okomu_ok01_ratify_due_yyyymmdd
    from jsonb_array_elements(v_okomu_mocs) r where r->>'id' = 'OK-01';
  select count(*) filter (where d between 0 and 14), count(*) filter (where d < 0)
    into v_s_okomu_register_expiring_soon, v_s_okomu_register_expired
    from (select ((r->>'expiry_date')::date - v_asof) d from jsonb_array_elements(v_okomu_mocs) r
           where r->>'type' in ('Temporary', 'Emergency') and r->>'stage' = 'Implementation'
             and r->>'expiry_date' is not null) t;
  select count(*) filter (where true),
         count(*) filter (where ((r->>'due_date')::date - v_asof) < 0)
    into v_s_okomu_register_open_actions, v_s_okomu_register_overdue_actions
    from jsonb_array_elements(v_okomu_actions) r
   where r->>'status' not in ('Complete', 'Cancelled')
     and not exists (select 1 from jsonb_array_elements(v_okomu_mocs) m
                      where m->>'id' = r->>'moc_id' and m->>'stage' in ('Closed', 'Rejected', 'Cancelled'));
  select count(*) into v_s_okomu_register_ratification_overdue
    from jsonb_array_elements(v_okomu_mocs) m
   where m->>'type' = 'Emergency' and m->>'stage' in ('Implementation', 'Closed')
     and not (
       exists (select 1 from jsonb_array_elements(v_okomu_approvals) a where a->>'moc_id' = m->>'id')
       and not exists (select 1 from jsonb_array_elements(v_okomu_approvals) a
                        where a->>'moc_id' = m->>'id' and a->>'status' = 'Rejected')
       and not exists (
         select 1 from (select distinct coalesce((a->>'level')::int, 1) lvl
                          from jsonb_array_elements(v_okomu_approvals) a where a->>'moc_id' = m->>'id') l
          where not exists (select 1 from jsonb_array_elements(v_okomu_approvals) a
                             where a->>'moc_id' = m->>'id' and coalesce((a->>'level')::int, 1) = l.lvl
                               and a->>'status' = 'Approved')))
     and (m->>'actual_implementation_date' is null
          or (m->>'actual_implementation_date')::date + 7 < v_asof);

  -- EXPERT, ETIM. A comment blocks when its severity is Critical or Major and
  -- it is not Verified, Closed or Withdrawn; it is open when it is none of
  -- those three and its review (ET-R1, in Verification) is not finished.
  -- An application changed something when it was Adopted or Adapted. The age
  -- runs from the event date. A review is due soon on a Published or Embedded
  -- lesson whose review date is 0 to 30 days away, both ends counted.
  select count(*) filter (where r->>'severity' in ('Critical', 'Major')
                            and r->>'status' not in ('Verified', 'Closed', 'Withdrawn')),
         count(*) filter (where r->>'status' not in ('Verified', 'Closed', 'Withdrawn')
                            and 'Verification' not in ('Closed', 'Cancelled'))
    into v_s_etim_review_blocking, v_s_etim_review_open_comments
    from jsonb_array_elements(v_etim_comments) r where r->>'review_id' = 'ET-R1';
  select count(*), to_char(max((r->>'applied_on')::date), 'YYYYMMDD')::numeric
    into v_s_etim_lesson_applied, v_s_etim_lesson_last_applied_yyyymmdd
    from jsonb_array_elements(v_etim_applications) r
   where r->>'lesson_id' = 'EL-01' and r->>'outcome' in ('Adopted', 'Adapted');
  select greatest(0, v_asof - (r->>'event_date')::date) into v_s_etim_lesson_age_days
    from jsonb_array_elements(v_etim_lessons) r where r->>'id' = 'EL-01';
  select count(*) into v_s_etim_register_reviews_due_soon
    from jsonb_array_elements(v_etim_lessons) r
   where r->>'status' in ('Published', 'Embedded') and r->>'review_due' is not null
     and ((r->>'review_due')::date - v_asof) between 0 and 30;

  if v_s_igbara_i03_inherent_score is distinct from v_g_igbara_i03_inherent_score then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_i03_inherent_score]', v_s_igbara_i03_inherent_score, v_g_igbara_i03_inherent_score;
  end if;
  if v_s_igbara_i03_residual_score is distinct from v_g_igbara_i03_residual_score then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_i03_residual_score]', v_s_igbara_i03_residual_score, v_g_igbara_i03_residual_score;
  end if;
  if v_s_igbara_live_residual_critical is distinct from v_g_igbara_live_residual_critical then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_live_residual_critical]', v_s_igbara_live_residual_critical, v_g_igbara_live_residual_critical;
  end if;
  if v_s_igbara_live_inherent_high is distinct from v_g_igbara_live_inherent_high then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_live_inherent_high]', v_s_igbara_live_inherent_high, v_g_igbara_live_inherent_high;
  end if;
  if v_s_igbara_i06_days_to_review is distinct from v_g_igbara_i06_days_to_review then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_i06_days_to_review]', v_s_igbara_i06_days_to_review, v_g_igbara_i06_days_to_review;
  end if;
  if v_s_igbara_i12_days_to_review is distinct from v_g_igbara_i12_days_to_review then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: beginner/igbara_i12_days_to_review]', v_s_igbara_i12_days_to_review, v_g_igbara_i12_days_to_review;
  end if;
  if v_s_okomu_ok01_ratify_due_yyyymmdd is distinct from v_g_okomu_ok01_ratify_due_yyyymmdd then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_ok01_ratify_due_yyyymmdd]', v_s_okomu_ok01_ratify_due_yyyymmdd, v_g_okomu_ok01_ratify_due_yyyymmdd;
  end if;
  if v_s_okomu_register_expiring_soon is distinct from v_g_okomu_register_expiring_soon then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_register_expiring_soon]', v_s_okomu_register_expiring_soon, v_g_okomu_register_expiring_soon;
  end if;
  if v_s_okomu_register_expired is distinct from v_g_okomu_register_expired then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_register_expired]', v_s_okomu_register_expired, v_g_okomu_register_expired;
  end if;
  if v_s_okomu_register_open_actions is distinct from v_g_okomu_register_open_actions then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_register_open_actions]', v_s_okomu_register_open_actions, v_g_okomu_register_open_actions;
  end if;
  if v_s_okomu_register_overdue_actions is distinct from v_g_okomu_register_overdue_actions then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_register_overdue_actions]', v_s_okomu_register_overdue_actions, v_g_okomu_register_overdue_actions;
  end if;
  if v_s_okomu_register_ratification_overdue is distinct from v_g_okomu_register_ratification_overdue then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: intermediate/okomu_register_ratification_overdue]', v_s_okomu_register_ratification_overdue, v_g_okomu_register_ratification_overdue;
  end if;
  if v_s_etim_review_blocking is distinct from v_g_etim_review_blocking then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_review_blocking]', v_s_etim_review_blocking, v_g_etim_review_blocking;
  end if;
  if v_s_etim_review_open_comments is distinct from v_g_etim_review_open_comments then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_review_open_comments]', v_s_etim_review_open_comments, v_g_etim_review_open_comments;
  end if;
  if v_s_etim_lesson_applied is distinct from v_g_etim_lesson_applied then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_lesson_applied]', v_s_etim_lesson_applied, v_g_etim_lesson_applied;
  end if;
  if v_s_etim_lesson_last_applied_yyyymmdd is distinct from v_g_etim_lesson_last_applied_yyyymmdd then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_lesson_last_applied_yyyymmdd]', v_s_etim_lesson_last_applied_yyyymmdd, v_g_etim_lesson_last_applied_yyyymmdd;
  end if;
  if v_s_etim_lesson_age_days is distinct from v_g_etim_lesson_age_days then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_lesson_age_days]', v_s_etim_lesson_age_days, v_g_etim_lesson_age_days;
  end if;
  if v_s_etim_register_reviews_due_soon is distinct from v_g_etim_register_reviews_due_soon then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded % [graded field: advanced/etim_register_reviews_due_soon]', v_s_etim_register_reviews_due_soon, v_g_etim_register_reviews_due_soon;
  end if;

  -- ------------------------------------------------- 3. the traps bite
  -- Each wrong reading is computed over the same records and must MISS the
  -- graded value, or the field does not discriminate the trap it is for.
  select 0::numeric into v_wrong;
  if v_wrong is not distinct from v_g_igbara_i03_residual_score then
    raise exception 'riskchange go-live refused: a blank residual impact read as unscored rather than falling back to the inherent impact also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_i03_residual_score]', v_wrong;
  end if;
  select coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-03' into v_wrong;
  if v_wrong is not distinct from v_g_igbara_i03_residual_score then
    raise exception 'riskchange go-live refused: the residual read as the inherent score also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_i03_residual_score]', v_wrong;
  end if;
  select count(*) filter (where (case when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 15 then 'Critical' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 10 then 'High' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 5 then 'Medium' when coalesce((case when jsonb_typeof((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end)) = 'number' and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric = trunc(((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric) and ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric between 1 and 5 then ((case when r->'residual_likelihood' is null or jsonb_typeof(r->'residual_likelihood') = 'null' or r->>'residual_likelihood' = '' then r->'likelihood' else r->'residual_likelihood' end))::text::numeric end) * (case when jsonb_typeof((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end)) = 'number' and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric = trunc(((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric) and ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric between 1 and 5 then ((case when r->'residual_impact' is null or jsonb_typeof(r->'residual_impact') = 'null' or r->>'residual_impact' = '' then r->'impact' else r->'residual_impact' end))::text::numeric end), 0) >= 1 then 'Low' else 'None' end) = 'Critical') from jsonb_array_elements(v_igbara_risks) r into v_wrong;
  if v_wrong is not distinct from v_g_igbara_live_residual_critical then
    raise exception 'riskchange go-live refused: the Critical residual count taken over every record instead of the live ones also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_live_residual_critical]', v_wrong;
  end if;
  select count(*) filter (where (case when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 15 then 'Critical' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 10 then 'High' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 5 then 'Medium' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 1 then 'Low' else 'None' end) = 'Critical') from jsonb_array_elements(v_igbara_risks) r where r->>'status' = any (v_igbara_live) into v_wrong;
  if v_wrong is not distinct from v_g_igbara_live_residual_critical then
    raise exception 'riskchange go-live refused: the Critical count taken on the inherent score instead of the residual also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_live_residual_critical]', v_wrong;
  end if;
  select count(*) filter (where (case when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 15 then 'Critical' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 10 then 'High' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 5 then 'Medium' when coalesce((case when jsonb_typeof(r->'likelihood') = 'number' and (r->'likelihood')::text::numeric = trunc((r->'likelihood')::text::numeric) and (r->'likelihood')::text::numeric between 1 and 5 then (r->'likelihood')::text::numeric end) * (case when jsonb_typeof(r->'impact') = 'number' and (r->'impact')::text::numeric = trunc((r->'impact')::text::numeric) and (r->'impact')::text::numeric between 1 and 5 then (r->'impact')::text::numeric end), 0) >= 1 then 'Low' else 'None' end) = 'High') from jsonb_array_elements(v_igbara_risks) r into v_wrong;
  if v_wrong is not distinct from v_g_igbara_live_inherent_high then
    raise exception 'riskchange go-live refused: the High inherent count taken over every record instead of the live ones also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_live_inherent_high]', v_wrong;
  end if;
  select abs(((r->>'next_review_date')::date - v_asof)) from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-12' into v_wrong;
  if v_wrong is not distinct from v_g_igbara_i12_days_to_review then
    raise exception 'riskchange go-live refused: a passed review date read as a distance without its sign also gives %, so the field does not discriminate the trap [graded field: beginner/igbara_i12_days_to_review]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_okomu_mocs) r where r->>'type' in ('Temporary', 'Emergency') and r->>'stage' = 'Implementation' and r->>'expiry_date' is not null and ((r->>'expiry_date')::date - v_asof) between 0 and 13 into v_wrong;
  if v_wrong is not distinct from v_g_okomu_register_expiring_soon then
    raise exception 'riskchange go-live refused: the 14-day lead counted exclusively also gives %, so the field does not discriminate the trap [graded field: intermediate/okomu_register_expiring_soon]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_okomu_mocs) r where r->>'type' in ('Temporary', 'Emergency') and r->>'expiry_date' is not null and ((r->>'expiry_date')::date - v_asof) < 0 into v_wrong;
  if v_wrong is not distinct from v_g_okomu_register_expired then
    raise exception 'riskchange go-live refused: expiry read on every Temporary or Emergency change whatever its stage also gives %, so the field does not discriminate the trap [graded field: intermediate/okomu_register_expired]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_okomu_actions) r where r->>'status' not in ('Complete', 'Cancelled') into v_wrong;
  if v_wrong is not distinct from v_g_okomu_register_open_actions then
    raise exception 'riskchange go-live refused: actions on a finished change counted as open work also gives %, so the field does not discriminate the trap [graded field: intermediate/okomu_register_open_actions]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_okomu_actions) r where r->>'status' not in ('Complete', 'Cancelled') and ((r->>'due_date')::date - v_asof) < 0 into v_wrong;
  if v_wrong is not distinct from v_g_okomu_register_overdue_actions then
    raise exception 'riskchange go-live refused: overdue actions counted including those on a finished change also gives %, so the field does not discriminate the trap [graded field: intermediate/okomu_register_overdue_actions]', v_wrong;
  end if;
  select v_s_okomu_register_ratification_overdue - count(*) from jsonb_array_elements(v_okomu_mocs) m where m->>'type' = 'Emergency' and m->>'stage' = 'Implementation' and m->>'actual_implementation_date' is null into v_wrong;
  if v_wrong is not distinct from v_g_okomu_register_ratification_overdue then
    raise exception 'riskchange go-live refused: an emergency change with no implementation date left out of the overdue count also gives %, so the field does not discriminate the trap [graded field: intermediate/okomu_register_ratification_overdue]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_etim_comments) r where r->>'severity' in ('Critical', 'Major') and r->>'status' = 'Open' into v_wrong;
  if v_wrong is not distinct from v_g_etim_review_blocking then
    raise exception 'riskchange go-live refused: only the Open comments read as blocking also gives %, so the field does not discriminate the trap [graded field: advanced/etim_review_blocking]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_etim_comments) r where r->>'status' = 'Open' into v_wrong;
  if v_wrong is not distinct from v_g_etim_review_open_comments then
    raise exception 'riskchange go-live refused: only the comments whose status is Open counted as open also gives %, so the field does not discriminate the trap [graded field: advanced/etim_review_open_comments]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_etim_applications) r where r->>'lesson_id' = 'EL-01' into v_wrong;
  if v_wrong is not distinct from v_g_etim_lesson_applied then
    raise exception 'riskchange go-live refused: every application counted, the rejections included also gives %, so the field does not discriminate the trap [graded field: advanced/etim_lesson_applied]', v_wrong;
  end if;
  select to_char(max((r->>'applied_on')::date), 'YYYYMMDD')::numeric from jsonb_array_elements(v_etim_applications) r where r->>'lesson_id' = 'EL-01' into v_wrong;
  if v_wrong is not distinct from v_g_etim_lesson_last_applied_yyyymmdd then
    raise exception 'riskchange go-live refused: the latest application of any outcome, a rejection included also gives %, so the field does not discriminate the trap [graded field: advanced/etim_lesson_last_applied_yyyymmdd]', v_wrong;
  end if;
  select v_asof - (r->>'created_at')::date from jsonb_array_elements(v_etim_lessons) r where r->>'id' = 'EL-01' into v_wrong;
  if v_wrong is not distinct from v_g_etim_lesson_age_days then
    raise exception 'riskchange go-live refused: the age counted from the date the record was created instead of the event date also gives %, so the field does not discriminate the trap [graded field: advanced/etim_lesson_age_days]', v_wrong;
  end if;
  select count(*) from jsonb_array_elements(v_etim_lessons) r where r->>'review_due' is not null and ((r->>'review_due')::date - v_asof) between 0 and 30 into v_wrong;
  if v_wrong is not distinct from v_g_etim_register_reviews_due_soon then
    raise exception 'riskchange go-live refused: review due soon read on every lesson whatever its status also gives %, so the field does not discriminate the trap [graded field: advanced/etim_register_reviews_due_soon]', v_wrong;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'riskchange';
  if not exists (select 1 from public.academy_apps where slug = 'riskchange' and status = 'available') then
    raise exception 'riskchange go-live refused: riskchange did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'riskchange go-live: riskchange available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
