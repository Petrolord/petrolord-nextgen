-- ============================================================================
-- B5 FOLLOW-ON W5A (leak re-case and strip): wellcorrelation.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/wellcorrelation.json. The new
-- keys come from tools/course-waves/w5/wellcorrelation/fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The walkthrough and the module lessons printed the graded values and the
--   section explorer opened on the capstone section (W1 labelled the tier open
--   book, in part). The capstone moves to the UMUDI section, picks to 0.1 m,
--   typed into the section explorer. W1's TOP_B reading on a second datum is
--   carried on the new case.
--   w2_shift_m (-65, tol 0.01)
--       -> umudi2_shift_m 'Umudi-2: flattening shift' m, expected -33.09999999999991, tol 0.005
--   w3_sand_thickness_m (29, tol 0.01)
--       -> umudi3_sand_thickness_m 'Umudi-3: SAND zone thickness' m, expected 29.59999999999991, tol 0.005
--   w4_base_sand_displayed_m (1525, tol 0.01)
--       -> umudi4_base_sand_displayed_m 'Umudi-4: BASE_SAND displayed depth (flattened)' m, expected 1546.5, tol 0.005
--   sand_relief_m (49, tol 0.01)
--       -> umudi_sand_relief_m 'TOP_SAND structural relief across the section' m, expected 57.299999999999955, tol 0.005
--   w3_top_b_displayed_base_1560_m (1618.0, tol 0.5)
--       -> umudi3_top_b_displayed_base_1575_m 'Umudi-3: TOP_B displayed depth, flattened on BASE_SAND at 1575 m' m, expected 1634.6, tol 0.005
--   w1_top_b_displayed_m (1592, tol 0.01)
--       -> umudi1_top_b_displayed_m 'Umudi-1: TOP_B displayed depth (flattened)' m, expected 1611.6000000000001, tol 0.005
--   TITLE was: Correlate the Ekene section
--   TITLE now: Correlate the UMUDI section
--   DATASET was: correlation/ekene-section
--   DATASET now: correlation/UMUDI section (W5 re-case; every pick is stated in
--   the brief)
--   PROMPT now: Correlate the UMUDI section. Its wells, as name, TOP_A,
--   TOP_SAND, BASE_SAND, TOP_B in MD (one per line in the panels' Type a section
--   box, a dash where the well stops above a top): Umudi-1, 1487.4, 1531.8,
--   1566.3, 1623.4; Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9,
--   1522.4, 1552.0, 1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Flatten the
--   section on TOP_SAND at a 1520 m datum and read the section explorer (it
--   opens on the Ekene wells, which are the teaching case): report Umudi-2's
--   flattening shift, Umudi-3's SAND zone thickness, Umudi-4's BASE_SAND
--   displayed depth, the structural relief on TOP_SAND, Umudi-1's TOP_B
--   displayed depth, and Umudi-3's TOP_B displayed depth once the section is
--   re-flattened on BASE_SAND at a 1575 m datum.
--
-- INTERMEDIATE: pick A (re-case)
--   The walkthrough and the growth lessons printed the graded values and the
--   flatten explorer opened on the capstone datum (W1 labelled the tier open
--   book, in part). The capstone moves to the UMUDI section, picks to 0.1 m,
--   with datums of its own. W1's shallowest-displayed reading on a second datum
--   is carried on the new case.
--   w4_shift_m (-80, tol 0.01)
--       -> umudi4_shift_m 'Umudi-4: flattening shift' m, expected -60.299999999999955, tol 0.005
--   w2_topsand_displayed_m (1503, tol 0.01)
--       -> umudi2_topsand_displayed_m 'Umudi-2: TOP_SAND displayed depth' m, expected 1510.5, tol 0.005
--   a_to_sand_w4_m (60, tol 0.01)
--       -> umudi4_a_to_sand_m 'Umudi-4: TOP_A to TOP_SAND interval' m, expected 59.40000000000009, tol 0.005
--   growth_range_m (14, tol 0.01)
--       -> umudi_growth_range_m 'A-to-SAND growth range (max minus min)' m, expected 16.90000000000009, tol 0.005
--   shallowest_displayed_sand_1480_m (1420.0, tol 0.5)
--       -> umudi_shallowest_displayed_sand_1495_m 'Shallowest displayed depth, flattened on TOP_SAND at 1495 m' m, expected 1435.6, tol 0.005
--   displayed_span_m (150, tol 0.01)
--       -> umudi_displayed_span_m 'Displayed depth span of the section' m, expected 147.60000000000014, tol 0.005
--   TITLE was: Growth analysis of the Ekene section
--   TITLE now: Growth analysis of the UMUDI section
--   DATASET was: correlation/ekene-section
--   DATASET now: correlation/UMUDI section (W5 re-case; every pick is stated in
--   the brief)
--   PROMPT now: Flatten the UMUDI section on TOP_A at a 1460 m datum and study
--   the A-to-SAND interval. Its wells, as name, TOP_A, TOP_SAND, BASE_SAND,
--   TOP_B in MD (one per line in the panels' Type a section box, a dash where
--   the well stops above a top): Umudi-1, 1487.4, 1531.8, 1566.3, 1623.4;
--   Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9, 1522.4, 1552.0,
--   1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Type the section into the
--   flatten explorer (it opens on the Ekene wells, which are the teaching case)
--   and report Umudi-4's flattening shift, Umudi-2's displayed TOP_SAND,
--   Umudi-4's TOP_A to TOP_SAND interval, the growth range across the section,
--   the shallowest displayed depth once the section is re-flattened on TOP_SAND
--   at a 1495 m datum, and the displayed depth span of the section back on the
--   TOP_A datum.
--
-- ADVANCED: pick A (re-case)
--   Every field leaked: the walkthrough and the prediction lessons printed them
--   and the prediction explorer opened on the capstone section. The capstone
--   moves to the UMUDI section, picks to 0.1 m, typed into the prediction
--   explorer.
--   a_to_b_mean (141, tol 0.01)
--       -> umudi_a_to_b_mean 'Mean TOP_A to TOP_B interval' m, expected 138.4333333333333, tol 0.005
--   sand_to_b_mean (92, tol 0.01)
--       -> umudi_sand_to_b_mean 'Mean TOP_SAND to TOP_B interval' m, expected 92.63333333333337, tol 0.005
--   w4_topb_layercake (1671, tol 0.01)
--       -> umudi4_topb_layercake 'Umudi-4 TOP_B, layer-cake estimate' m, expected 1658.7333333333333, tol 0.005
--   w4_topb_from_sand (1682, tol 0.01)
--       -> umudi4_topb_from_sand 'Umudi-4 TOP_B, from TOP_SAND' m, expected 1672.3333333333335, tol 0.005
--   prediction_spread (11, tol 0.01)
--       -> umudi_prediction_spread 'Spread between the two estimates' m, expected 13.600000000000136, tol 0.005
--   topb_relief (34, tol 0.01)
--       -> umudi_topb_relief 'TOP_B structural relief where it is drilled' m, expected 38.600000000000136, tol 0.005
--   TITLE was: Predict the missing TOP_B in Ekene-4
--   TITLE now: Predict the missing TOP_B in Umudi-4
--   DATASET was: correlation/ekene-section
--   DATASET now: correlation/UMUDI section (W5 re-case; every pick is stated in
--   the brief)
--   PROMPT now: Umudi-4 reached TD above TOP_B. Its wells, as name, TOP_A,
--   TOP_SAND, BASE_SAND, TOP_B in MD (one per line in the panels' Type a section
--   box, a dash where the well stops above a top): Umudi-1, 1487.4, 1531.8,
--   1566.3, 1623.4; Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9,
--   1522.4, 1552.0, 1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Predict the
--   missing pick two ways from the three wells that carry it: project the mean
--   TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the
--   mean TOP_SAND to TOP_B interval down from TOP_SAND. Type the section into
--   the prediction explorer (it opens on the Ekene wells, which are the teaching
--   case) and report both predictions, their spread (the growth uncertainty),
--   the two mean intervals, and the structural relief of TOP_B where it is
--   drilled.
--
-- ATTEMPTS. Tiers whose graded keys move: wellcorrelation/beginner,
-- wellcorrelation/intermediate, wellcorrelation/advanced. Before it writes,
-- the file counts academy_capstone_attempts on each and REFUSES if any exist,
-- unless D5 allowlists that tier with the exact attempt ids (allowlist:
-- empty). Stored scores are never touched.
--
-- GUARDS. Each row must hold EITHER its post-W1 form (prompt, title and
-- dataset by md5, fields as exact jsonb), which is rewritten, OR its W5 form,
-- which is left alone. Anything else raises and the whole file rolls back.
-- Generated by docs/graded-field-audit/w5_capstones.py. SAFE TO RE-RUN: a
-- second run writes nothing.
--
-- NOT A DB STEP. The lessons and panels that go with this file ship in the
-- NextGen zip, which must go live at nearly the same time as this apply.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_ids      jsonb;
  v_extra    jsonb;
  v_idtxt    text;
  v_allow    jsonb := '{}'::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off
  v_s0       text;
  v_s1       text;
  v_s2       text;
begin
  -- wellcorrelation / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'b4026fc2b6e46a77a171906c69e1d6f4' and md5(coalesce(title, '')) = 'c10c6b206eea00e276a399cd66e82762' and md5(coalesce(dataset, '')) = '6457b2e6e7fde6d3d179854455bdaca7' and fields = '[{"key": "w2_shift_m", "tol": 0.01, "unit": "m", "label": "Ekene-2: flattening shift", "expected": -65}, {"key": "w3_sand_thickness_m", "tol": 0.01, "unit": "m", "label": "Ekene-3: SAND zone thickness", "expected": 29}, {"key": "w4_base_sand_displayed_m", "tol": 0.01, "unit": "m", "label": "Ekene-4: BASE_SAND displayed depth (flattened)", "expected": 1525}, {"key": "sand_relief_m", "tol": 0.01, "unit": "m", "label": "TOP_SAND structural relief across the section", "expected": 49}, {"key": "w3_top_b_displayed_base_1560_m", "tol": 0.5, "unit": "m", "label": "Ekene-3: TOP_B displayed depth, flattened on BASE_SAND at 1560 m", "expected": 1618.0}, {"key": "w1_top_b_displayed_m", "tol": 0.01, "unit": "m", "label": "Ekene-1: TOP_B displayed depth (flattened)", "expected": 1592}]'::jsonb then 'old'
              when md5(prompt) = 'e58fc3dc6ceb6a8ceb0d003c520f371c' and md5(coalesce(title, '')) = '600e479f8ff8def65c7ce8025c0a5229' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi2_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: flattening shift", "expected": -33.09999999999991}, {"key": "umudi3_sand_thickness_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: SAND zone thickness", "expected": 29.59999999999991}, {"key": "umudi4_base_sand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: BASE_SAND displayed depth (flattened)", "expected": 1546.5}, {"key": "umudi_sand_relief_m", "tol": 0.005, "unit": "m", "label": "TOP_SAND structural relief across the section", "expected": 57.299999999999955}, {"key": "umudi3_top_b_displayed_base_1575_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: TOP_B displayed depth, flattened on BASE_SAND at 1575 m", "expected": 1634.6}, {"key": "umudi1_top_b_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-1: TOP_B displayed depth (flattened)", "expected": 1611.6000000000001}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner matches neither its post-W1 form (prompt md5 b4026fc2b6e46a77a171906c69e1d6f4) nor its W5 form (prompt md5 e58fc3dc6ceb6a8ceb0d003c520f371c), with the fields this file was generated against';
  end if;

  -- wellcorrelation / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '06340559816bd341fd61af8b492e735a' and md5(coalesce(title, '')) = '34b67988c3f589b5adde1f1b043085f5' and md5(coalesce(dataset, '')) = '6457b2e6e7fde6d3d179854455bdaca7' and fields = '[{"key": "w4_shift_m", "tol": 0.01, "unit": "m", "label": "Ekene-4: flattening shift", "expected": -80}, {"key": "w2_topsand_displayed_m", "tol": 0.01, "unit": "m", "label": "Ekene-2: TOP_SAND displayed depth", "expected": 1503}, {"key": "a_to_sand_w4_m", "tol": 0.01, "unit": "m", "label": "Ekene-4: TOP_A→TOP_SAND interval", "expected": 60}, {"key": "growth_range_m", "tol": 0.01, "unit": "m", "label": "A-to-SAND growth range (max − min)", "expected": 14}, {"key": "shallowest_displayed_sand_1480_m", "tol": 0.5, "unit": "m", "label": "Shallowest displayed depth, flattened on TOP_SAND at 1480 m", "expected": 1420.0}, {"key": "displayed_span_m", "tol": 0.01, "unit": "m", "label": "Displayed depth span of the section", "expected": 150}]'::jsonb then 'old'
              when md5(prompt) = '5e24c704810ba434cfbbdbf4ab8c29c7' and md5(coalesce(title, '')) = '49b95a3f1ef92d4996d8bb238505235e' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi4_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: flattening shift", "expected": -60.299999999999955}, {"key": "umudi2_topsand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: TOP_SAND displayed depth", "expected": 1510.5}, {"key": "umudi4_a_to_sand_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: TOP_A to TOP_SAND interval", "expected": 59.40000000000009}, {"key": "umudi_growth_range_m", "tol": 0.005, "unit": "m", "label": "A-to-SAND growth range (max minus min)", "expected": 16.90000000000009}, {"key": "umudi_shallowest_displayed_sand_1495_m", "tol": 0.005, "unit": "m", "label": "Shallowest displayed depth, flattened on TOP_SAND at 1495 m", "expected": 1435.6}, {"key": "umudi_displayed_span_m", "tol": 0.005, "unit": "m", "label": "Displayed depth span of the section", "expected": 147.60000000000014}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate matches neither its post-W1 form (prompt md5 06340559816bd341fd61af8b492e735a) nor its W5 form (prompt md5 5e24c704810ba434cfbbdbf4ab8c29c7), with the fields this file was generated against';
  end if;

  -- wellcorrelation / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '2038aeb4f2423dab918bd6668bc91cc3' and md5(coalesce(title, '')) = '376e84bcff0d7d9fcc706c61b766a0c0' and md5(coalesce(dataset, '')) = '6457b2e6e7fde6d3d179854455bdaca7' and fields = '[{"key": "a_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 141}, {"key": "sand_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92}, {"key": "w4_topb_layercake", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, layer-cake estimate", "expected": 1671}, {"key": "w4_topb_from_sand", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, from TOP_SAND", "expected": 1682}, {"key": "prediction_spread", "tol": 0.01, "unit": "m", "label": "Spread between the two estimates", "expected": 11}, {"key": "topb_relief", "tol": 0.01, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 34}]'::jsonb then 'old'
              when md5(prompt) = '9a8c10c34311982b3d9544937b196604' and md5(coalesce(title, '')) = 'f3b53499530457c1ea48891b5393ca0b' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi_a_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 138.4333333333333}, {"key": "umudi_sand_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92.63333333333337}, {"key": "umudi4_topb_layercake", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, layer-cake estimate", "expected": 1658.7333333333333}, {"key": "umudi4_topb_from_sand", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, from TOP_SAND", "expected": 1672.3333333333335}, {"key": "umudi_prediction_spread", "tol": 0.005, "unit": "m", "label": "Spread between the two estimates", "expected": 13.600000000000136}, {"key": "umudi_topb_relief", "tol": 0.005, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 38.600000000000136}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced matches neither its post-W1 form (prompt md5 2038aeb4f2423dab918bd6668bc91cc3) nor its W5 form (prompt md5 9a8c10c34311982b3d9544937b196604), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5a wellcorrelation: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'wellcorrelation' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'wellcorrelation/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'wellcorrelation/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a wellcorrelation: wellcorrelation/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'wellcorrelation' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'wellcorrelation/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'wellcorrelation/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a wellcorrelation: wellcorrelation/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'wellcorrelation' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'wellcorrelation/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'wellcorrelation/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a wellcorrelation: wellcorrelation/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Correlate the UMUDI section. Its wells, as name, TOP_A, TOP_SAND, BASE_SAND, TOP_B in MD (one per line in the panels'' Type a section box, a dash where the well stops above a top): Umudi-1, 1487.4, 1531.8, 1566.3, 1623.4; Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9, 1522.4, 1552.0, 1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Flatten the section on TOP_SAND at a 1520 m datum and read the section explorer (it opens on the Ekene wells, which are the teaching case): report Umudi-2''s flattening shift, Umudi-3''s SAND zone thickness, Umudi-4''s BASE_SAND displayed depth, the structural relief on TOP_SAND, Umudi-1''s TOP_B displayed depth, and Umudi-3''s TOP_B displayed depth once the section is re-flattened on BASE_SAND at a 1575 m datum.',
           title = 'Correlate the UMUDI section',
           dataset = 'correlation/UMUDI section (W5 re-case; every pick is stated in the brief)',
           fields = '[{"key": "umudi2_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: flattening shift", "expected": -33.09999999999991}, {"key": "umudi3_sand_thickness_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: SAND zone thickness", "expected": 29.59999999999991}, {"key": "umudi4_base_sand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: BASE_SAND displayed depth (flattened)", "expected": 1546.5}, {"key": "umudi_sand_relief_m", "tol": 0.005, "unit": "m", "label": "TOP_SAND structural relief across the section", "expected": 57.299999999999955}, {"key": "umudi3_top_b_displayed_base_1575_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: TOP_B displayed depth, flattened on BASE_SAND at 1575 m", "expected": 1634.6}, {"key": "umudi1_top_b_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-1: TOP_B displayed depth (flattened)", "expected": 1611.6000000000001}]'::jsonb
     where app_slug = 'wellcorrelation' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'e58fc3dc6ceb6a8ceb0d003c520f371c' and md5(coalesce(title, '')) = '600e479f8ff8def65c7ce8025c0a5229' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi2_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: flattening shift", "expected": -33.09999999999991}, {"key": "umudi3_sand_thickness_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: SAND zone thickness", "expected": 29.59999999999991}, {"key": "umudi4_base_sand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: BASE_SAND displayed depth (flattened)", "expected": 1546.5}, {"key": "umudi_sand_relief_m", "tol": 0.005, "unit": "m", "label": "TOP_SAND structural relief across the section", "expected": 57.299999999999955}, {"key": "umudi3_top_b_displayed_base_1575_m", "tol": 0.005, "unit": "m", "label": "Umudi-3: TOP_B displayed depth, flattened on BASE_SAND at 1575 m", "expected": 1634.6}, {"key": "umudi1_top_b_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-1: TOP_B displayed depth (flattened)", "expected": 1611.6000000000001}]'::jsonb) from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'beginner' and active) is not true then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Flatten the UMUDI section on TOP_A at a 1460 m datum and study the A-to-SAND interval. Its wells, as name, TOP_A, TOP_SAND, BASE_SAND, TOP_B in MD (one per line in the panels'' Type a section box, a dash where the well stops above a top): Umudi-1, 1487.4, 1531.8, 1566.3, 1623.4; Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9, 1522.4, 1552.0, 1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Type the section into the flatten explorer (it opens on the Ekene wells, which are the teaching case) and report Umudi-4''s flattening shift, Umudi-2''s displayed TOP_SAND, Umudi-4''s TOP_A to TOP_SAND interval, the growth range across the section, the shallowest displayed depth once the section is re-flattened on TOP_SAND at a 1495 m datum, and the displayed depth span of the section back on the TOP_A datum.',
           title = 'Growth analysis of the UMUDI section',
           dataset = 'correlation/UMUDI section (W5 re-case; every pick is stated in the brief)',
           fields = '[{"key": "umudi4_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: flattening shift", "expected": -60.299999999999955}, {"key": "umudi2_topsand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: TOP_SAND displayed depth", "expected": 1510.5}, {"key": "umudi4_a_to_sand_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: TOP_A to TOP_SAND interval", "expected": 59.40000000000009}, {"key": "umudi_growth_range_m", "tol": 0.005, "unit": "m", "label": "A-to-SAND growth range (max minus min)", "expected": 16.90000000000009}, {"key": "umudi_shallowest_displayed_sand_1495_m", "tol": 0.005, "unit": "m", "label": "Shallowest displayed depth, flattened on TOP_SAND at 1495 m", "expected": 1435.6}, {"key": "umudi_displayed_span_m", "tol": 0.005, "unit": "m", "label": "Displayed depth span of the section", "expected": 147.60000000000014}]'::jsonb
     where app_slug = 'wellcorrelation' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '5e24c704810ba434cfbbdbf4ab8c29c7' and md5(coalesce(title, '')) = '49b95a3f1ef92d4996d8bb238505235e' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi4_shift_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: flattening shift", "expected": -60.299999999999955}, {"key": "umudi2_topsand_displayed_m", "tol": 0.005, "unit": "m", "label": "Umudi-2: TOP_SAND displayed depth", "expected": 1510.5}, {"key": "umudi4_a_to_sand_m", "tol": 0.005, "unit": "m", "label": "Umudi-4: TOP_A to TOP_SAND interval", "expected": 59.40000000000009}, {"key": "umudi_growth_range_m", "tol": 0.005, "unit": "m", "label": "A-to-SAND growth range (max minus min)", "expected": 16.90000000000009}, {"key": "umudi_shallowest_displayed_sand_1495_m", "tol": 0.005, "unit": "m", "label": "Shallowest displayed depth, flattened on TOP_SAND at 1495 m", "expected": 1435.6}, {"key": "umudi_displayed_span_m", "tol": 0.005, "unit": "m", "label": "Displayed depth span of the section", "expected": 147.60000000000014}]'::jsonb) from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'intermediate' and active) is not true then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Umudi-4 reached TD above TOP_B. Its wells, as name, TOP_A, TOP_SAND, BASE_SAND, TOP_B in MD (one per line in the panels'' Type a section box, a dash where the well stops above a top): Umudi-1, 1487.4, 1531.8, 1566.3, 1623.4; Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2; Umudi-3, 1479.9, 1522.4, 1552.0, 1611.6; Umudi-4, 1520.3, 1579.7, 1606.2, -. Predict the missing pick two ways from the three wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the mean TOP_SAND to TOP_B interval down from TOP_SAND. Type the section into the prediction explorer (it opens on the Ekene wells, which are the teaching case) and report both predictions, their spread (the growth uncertainty), the two mean intervals, and the structural relief of TOP_B where it is drilled.',
           title = 'Predict the missing TOP_B in Umudi-4',
           dataset = 'correlation/UMUDI section (W5 re-case; every pick is stated in the brief)',
           fields = '[{"key": "umudi_a_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 138.4333333333333}, {"key": "umudi_sand_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92.63333333333337}, {"key": "umudi4_topb_layercake", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, layer-cake estimate", "expected": 1658.7333333333333}, {"key": "umudi4_topb_from_sand", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, from TOP_SAND", "expected": 1672.3333333333335}, {"key": "umudi_prediction_spread", "tol": 0.005, "unit": "m", "label": "Spread between the two estimates", "expected": 13.600000000000136}, {"key": "umudi_topb_relief", "tol": 0.005, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 38.600000000000136}]'::jsonb
     where app_slug = 'wellcorrelation' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '9a8c10c34311982b3d9544937b196604' and md5(coalesce(title, '')) = 'f3b53499530457c1ea48891b5393ca0b' and md5(coalesce(dataset, '')) = 'ee7d808ffb960d59be0f266f041cfda8' and fields = '[{"key": "umudi_a_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 138.4333333333333}, {"key": "umudi_sand_to_b_mean", "tol": 0.005, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92.63333333333337}, {"key": "umudi4_topb_layercake", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, layer-cake estimate", "expected": 1658.7333333333333}, {"key": "umudi4_topb_from_sand", "tol": 0.005, "unit": "m", "label": "Umudi-4 TOP_B, from TOP_SAND", "expected": 1672.3333333333335}, {"key": "umudi_prediction_spread", "tol": 0.005, "unit": "m", "label": "Spread between the two estimates", "expected": 13.600000000000136}, {"key": "umudi_topb_relief", "tol": 0.005, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 38.600000000000136}]'::jsonb) from public.academy_capstones where app_slug = 'wellcorrelation' and tier = 'advanced' and active) is not true then
    raise exception 'w5a wellcorrelation refused: wellcorrelation/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5a wellcorrelation: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
