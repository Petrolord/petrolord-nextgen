-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): waterflood.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/waterflood.json. The new
-- keys come from docs/graded-field-audit/w5b/waterflood.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The working lesson printed every answer and the ledger explorer opened on
--   the frozen factor set and the 1.00 to 1.20 band. Re-cased on a revised
--   factor set, band and month, which the learner types.
--   field_cum_vrr (1.034899536109, tol 0.0005)
--       -> field_cum_vrr 'Field cumulative VRR' -, expected 1.0639811055975046, tol 0.0005
--   produced_voidage_rb (221736.43680913927, tol 50)
--       -> produced_voidage_rb 'Total produced voidage' rb, expected 213561.2936416994, tol 50.0
--   injected_voidage_rb (229474.93559224083, tol 50)
--       -> injected_voidage_rb 'Total injected voidage' rb, expected 227225.18132172863, tol 50.0
--   fillup_month_index (11, tol 0)
--       -> fillup_month_index 'Fill-up period index (zero-based)' index, expected 7, tol 0.0
--   months_under_target_band (4, tol 0)
--       -> months_under_target_band 'Periods under the 0.95 to 1.15 band' count, expected 2, tol 0.0
--   jan_produced_voidage_rb (5747.317402456214, tol 1)
--       -> month_produced_voidage_rb 'June 2024 produced voidage' rb, expected 6353.507278415295, tol 1.0
--   DATASET was: ekene-dynamic/waterflood.json (36 monthly field periods, frozen
--   factor set)
--   DATASET now: ekene-dynamic/waterflood.json (36 periods, factor set Bo 1.17 /
--   Bw 1.01 / Rs 360)
--   PROMPT now: Work the Ekene waterflood ledger over its 36 monthly periods,
--   2023-01 through 2025-12, on a revised frozen factor set: Bo 1.17, Bw 1.01,
--   Bg 0 and Rs 360 scf/stb. Report the cumulative voidage replacement ratio as
--   the ratio of the summed voidages, the total produced and injected voidage in
--   reservoir barrels, the zero-based index of the first period at which the
--   CUMULATIVE ratio reaches or exceeds 1.0, the number of periods whose
--   INSTANTANEOUS ratio falls below an operator target band of 0.95 to 1.15, and
--   the produced voidage of June 2024 alone. Only free produced gas adds
--   voidage: subtract the solution gas Rs*Np/1000 from the metered gas before
--   converting. The ledger explorer opens on the teaching factor set and band;
--   type the case in.
--
-- INTERMEDIATE: pick A (re-case)
--   The working and story-so-far lessons printed every answer and the pattern
--   explorer opened on the fixture matrix. Re-cased on a revised allocation
--   matrix, target and window, a Hall read to 2025-06-30 and a 5-point Chan
--   smoothing (the panel now carries both diagnostics). hall_ratio_e4 keeps the
--   W1 tolerance of 0.0005.
--   out_of_zone_bbl (26997.051246145966, tol 20)
--       -> out_of_zone_bbl 'Out-of-zone injection' bbl, expected 29246.80551665815, tol 20.0
--   north_cum_vrr (1.2024353717815623, tol 0.0005)
--       -> north_cum_vrr 'North element cumulative VRR' -, expected 1.1616748507042214, tol 0.0005
--   south_cum_vrr (0.6097477559533482, tol 0.0005)
--       -> south_cum_vrr 'South element cumulative VRR' -, expected 0.6307735406413947, tol 0.0005
--   south_recommended_wi (2683.051749612857, tol 2)
--       -> south_recommended_wi 'South recommended injection at target 1.10' bbl, expected 2915.665334186579, tol 2.0
--   hall_ratio_e4 (1.4285714285714286, tol 0.0005)
--       -> hall_ratio_e4 'Ekene-4 Hall slope ratio above the reference, rows to 2025-06-30' -, expected 1.303301717154095, tol 0.0005
--   chan_slope_e6 (2.348281726147951, tol 0.005)
--       -> chan_slope_case 'Ekene-6 Chan late-time slope, 5-point smoothing' -, expected 1.5358261835134785, tol 0.005
--   DATASET was: ekene-dynamic/waterflood.json (allocation matrix, two patterns,
--   surveillance rows)
--   DATASET now: ekene-dynamic/waterflood.json (a stated allocation matrix,
--   surveillance to 2025-06-30)
--   PROMPT now: Take the Ekene flood apart by geometry on a revised allocation
--   matrix: Ekene-2 to Ekene-6 0.40, Ekene-1 0.35 and Ekene-3 0.10, and Ekene-4
--   to Ekene-3 0.45, Ekene-6 0.30 and Ekene-5 0.15. The two elements are North,
--   holding Ekene-1 and Ekene-6, and South, holding Ekene-3 and Ekene-5. Report
--   the injected volume that lands on no producer, each element's cumulative VRR
--   on the frozen factor set, and the injection recommended for the South
--   element at a target VRR of 1.10 over a two-period trailing window, scaled
--   from the ALLOCATED injection into that element. Then two diagnostics on the
--   raw well data: the Hall plot slope ratio for Ekene-4 built on pressure ABOVE
--   the 2050 psia injection reference from the daily rows through 2025-06-30
--   only, and the late-time log-log slope of the water oil ratio derivative for
--   Ekene-6 with the derivative smoothed over 5 points. The pattern explorer
--   opens on the teaching matrix and read; type the case in.
--
-- ADVANCED: pick A (re-case)
--   The working lesson printed every answer and the design explorer opened on
--   the planted column and design case. Re-cased on a revised layer column, M,
--   rate and oil viscosity, and the Ekene-1 breakthrough for the back-out (the
--   panel now carries it).
--   dykstra_parsons_v (0.5, tol 0.001)
--       -> dykstra_parsons_v 'Dykstra-Parsons permeability variation V' -, expected 0.5108350057773658, tol 0.001
--   dp_coverage_first_bt (0.5146907350993352, tol 0.0005)
--       -> dp_coverage_first_bt 'Coverage at the first breakthrough, M 1.5' fraction, expected 0.53830773439402, tol 0.0005
--   stiles_wc_first_bt (0.5843728303284756, tol 0.0005)
--       -> stiles_wc_first_bt 'Stiles surface water cut at first BT' fraction, expected 0.6065200837842389, tol 0.0005
--   eabt_at_design_m (0.6573574366303985, tol 0.0005)
--       -> eabt_at_case_mu 'Areal sweep at breakthrough, 2.4 cp oil' fraction, expected 0.6187020568266292, tol 0.0005
--   design_breakthrough_days (639.1875, tol 2)
--       -> case_breakthrough_days 'Forecast breakthrough time' days, expected 760.9375, tol 2.0
--   implied_swept_fraction (0.014697005138728762, tol 0.0002)
--       -> implied_swept_fraction 'Implied contacted fraction of the element' fraction, expected 0.015390012446578026, tol 0.0002
--   DATASET was: ekene-dynamic/waterflood.json (five-layer column, five-spot
--   element, breakthrough date)
--   DATASET now: ekene-dynamic/waterflood.json (a stated layer column, M 1.5,
--   1600 rb/d, 2.4 cp oil, Ekene-1 breakthrough)
--   PROMPT now: Design and then check a flood on a revised layer column. The
--   sand is five non-communicating layers, given in DEPTH order with thicknesses
--   18, 22, 16, 14 and 14 ft and permeabilities 140, 520, 230, 95 and 410 md;
--   the endpoint mobility ratio is 1.5 and the frozen factors are Bo 1.21584 and
--   Bw 1.02. Report the Dykstra-Parsons permeability variation V, the vertical
--   coverage at the FIRST layer breakthrough at that mobility ratio, and the
--   Stiles surface water cut at the same stage using the capacity ratio A =
--   M*Bo/Bw. Then forecast the five-spot element of 208.8040473397547 acres and
--   34.585155812896204 ft net at porosity 0.2 for an oil of 2.4 cp, injecting
--   1600 rb/d with the vertical sweep taken from your own coverage answer and a
--   water oil ratio limit of 25: report the Craig five-spot areal sweep at
--   breakthrough the forecast reports and the breakthrough time as the engine
--   reports it, on whole monthly steps of 30.4375 days. Finally, invert the
--   pattern breakthrough condition on the injection the allocation routed to
--   Ekene-1 before its 2025-06-01 breakthrough, at that forecast's breakthrough
--   state, and report the contacted pore volume as a fraction of the WHOLE
--   element, 11205422.76570545 rb, computed without the vertical sweep
--   multiplier. The design explorer opens on the teaching column and design
--   case; type the case in.
--
-- ATTEMPTS. Tiers whose graded keys move: waterflood/beginner,
-- waterflood/intermediate, waterflood/advanced. Before it writes, the file
-- counts academy_capstone_attempts on each and REFUSES if any exist, unless D5
-- allowlists that tier with the exact attempt ids (allowlist: empty). Stored
-- scores are never touched.
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
  -- waterflood / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'waterflood' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b waterflood refused: waterflood/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '74f60dfa30099fe45a3022f85052b7bf' and md5(coalesce(title, '')) = '85c846f6ffcfd5552f58480dc9daa7ba' and md5(coalesce(dataset, '')) = 'c9750ecaf3bcc5abe890f3395a22f545' and fields = '[{"key": "field_cum_vrr", "tol": 0.0005, "unit": "-", "label": "Field cumulative VRR", "expected": 1.034899536109}, {"key": "produced_voidage_rb", "tol": 50, "unit": "rb", "label": "Total produced voidage", "expected": 221736.43680913927}, {"key": "injected_voidage_rb", "tol": 50, "unit": "rb", "label": "Total injected voidage", "expected": 229474.93559224083}, {"key": "fillup_month_index", "tol": 0, "unit": "index", "label": "Fill-up period index (zero-based)", "expected": 11}, {"key": "months_under_target_band", "tol": 0, "unit": "count", "label": "Periods under the 1.00 to 1.20 band", "expected": 4}, {"key": "jan_produced_voidage_rb", "tol": 1, "unit": "rb", "label": "January 2023 produced voidage", "expected": 5747.317402456214}]'::jsonb then 'old'
              when md5(prompt) = '8d366396065e8af514b92c982a9aa730' and md5(coalesce(title, '')) = '85c846f6ffcfd5552f58480dc9daa7ba' and md5(coalesce(dataset, '')) = '4dd5ade425a421b189fce0c3676afeae' and fields = '[{"key": "field_cum_vrr", "tol": 0.0005, "unit": "-", "label": "Field cumulative VRR", "expected": 1.0639811055975046}, {"key": "produced_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total produced voidage", "expected": 213561.2936416994}, {"key": "injected_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total injected voidage", "expected": 227225.18132172863}, {"key": "fillup_month_index", "tol": 0.0, "unit": "index", "label": "Fill-up period index (zero-based)", "expected": 7}, {"key": "months_under_target_band", "tol": 0.0, "unit": "count", "label": "Periods under the 0.95 to 1.15 band", "expected": 2}, {"key": "month_produced_voidage_rb", "tol": 1.0, "unit": "rb", "label": "June 2024 produced voidage", "expected": 6353.507278415295}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'waterflood' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b waterflood refused: waterflood/beginner matches neither its post-W1 form (prompt md5 74f60dfa30099fe45a3022f85052b7bf) nor its W5 form (prompt md5 8d366396065e8af514b92c982a9aa730), with the fields this file was generated against';
  end if;

  -- waterflood / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'waterflood' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b waterflood refused: waterflood/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '86d604bff13f405a61ea14ab3aba8f67' and md5(coalesce(title, '')) = '1bf8921f628481c257351e2e0f55b712' and md5(coalesce(dataset, '')) = '17904638ca2d56a632d427b7f8794a4f' and fields = '[{"key": "out_of_zone_bbl", "tol": 20, "unit": "bbl", "label": "Out-of-zone injection", "expected": 26997.051246145966}, {"key": "north_cum_vrr", "tol": 0.0005, "unit": "-", "label": "North element cumulative VRR", "expected": 1.2024353717815623}, {"key": "south_cum_vrr", "tol": 0.0005, "unit": "-", "label": "South element cumulative VRR", "expected": 0.6097477559533482}, {"key": "south_recommended_wi", "tol": 2, "unit": "bbl", "label": "South recommended injection at target 1.0", "expected": 2683.051749612857}, {"key": "hall_ratio_e4", "tol": 0.0005, "unit": "-", "label": "Ekene-4 Hall slope ratio above the reference", "expected": 1.4285714285714286}, {"key": "chan_slope_e6", "tol": 0.005, "unit": "-", "label": "Ekene-6 Chan late-time slope", "expected": 2.348281726147951}]'::jsonb then 'old'
              when md5(prompt) = '14c88f4727b34b3624ed143187b95fa1' and md5(coalesce(title, '')) = '1bf8921f628481c257351e2e0f55b712' and md5(coalesce(dataset, '')) = 'c834bf651cfa47e289aab4e8113f3a66' and fields = '[{"key": "out_of_zone_bbl", "tol": 20.0, "unit": "bbl", "label": "Out-of-zone injection", "expected": 29246.80551665815}, {"key": "north_cum_vrr", "tol": 0.0005, "unit": "-", "label": "North element cumulative VRR", "expected": 1.1616748507042214}, {"key": "south_cum_vrr", "tol": 0.0005, "unit": "-", "label": "South element cumulative VRR", "expected": 0.6307735406413947}, {"key": "south_recommended_wi", "tol": 2.0, "unit": "bbl", "label": "South recommended injection at target 1.10", "expected": 2915.665334186579}, {"key": "hall_ratio_e4", "tol": 0.0005, "unit": "-", "label": "Ekene-4 Hall slope ratio above the reference, rows to 2025-06-30", "expected": 1.303301717154095}, {"key": "chan_slope_case", "tol": 0.005, "unit": "-", "label": "Ekene-6 Chan late-time slope, 5-point smoothing", "expected": 1.5358261835134785}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'waterflood' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b waterflood refused: waterflood/intermediate matches neither its post-W1 form (prompt md5 86d604bff13f405a61ea14ab3aba8f67) nor its W5 form (prompt md5 14c88f4727b34b3624ed143187b95fa1), with the fields this file was generated against';
  end if;

  -- waterflood / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'waterflood' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b waterflood refused: waterflood/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '61a1e3b3679d2b2c40d89bc94fcfa1cd' and md5(coalesce(title, '')) = 'a1c5a08e762b76dc2fc42cede61b09b0' and md5(coalesce(dataset, '')) = '04d48650f11458f5f5d423ae3fbda992' and fields = '[{"key": "dykstra_parsons_v", "tol": 0.001, "unit": "-", "label": "Dykstra-Parsons permeability variation V", "expected": 0.5}, {"key": "dp_coverage_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Coverage at the first breakthrough", "expected": 0.5146907350993352}, {"key": "stiles_wc_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Stiles surface water cut at first BT", "expected": 0.5843728303284756}, {"key": "eabt_at_design_m", "tol": 0.0005, "unit": "fraction", "label": "Areal sweep at breakthrough at M = 1.2", "expected": 0.6573574366303985}, {"key": "design_breakthrough_days", "tol": 2, "unit": "days", "label": "Design-case breakthrough time", "expected": 639.1875}, {"key": "implied_swept_fraction", "tol": 0.0002, "unit": "fraction", "label": "Implied contacted fraction of the element", "expected": 0.014697005138728762}]'::jsonb then 'old'
              when md5(prompt) = '09f0564168f4fa423f863cc8ff1e1878' and md5(coalesce(title, '')) = 'a1c5a08e762b76dc2fc42cede61b09b0' and md5(coalesce(dataset, '')) = 'e2c09682e05696e8c958e566d49e9c56' and fields = '[{"key": "dykstra_parsons_v", "tol": 0.001, "unit": "-", "label": "Dykstra-Parsons permeability variation V", "expected": 0.5108350057773658}, {"key": "dp_coverage_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Coverage at the first breakthrough, M 1.5", "expected": 0.53830773439402}, {"key": "stiles_wc_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Stiles surface water cut at first BT", "expected": 0.6065200837842389}, {"key": "eabt_at_case_mu", "tol": 0.0005, "unit": "fraction", "label": "Areal sweep at breakthrough, 2.4 cp oil", "expected": 0.6187020568266292}, {"key": "case_breakthrough_days", "tol": 2.0, "unit": "days", "label": "Forecast breakthrough time", "expected": 760.9375}, {"key": "implied_swept_fraction", "tol": 0.0002, "unit": "fraction", "label": "Implied contacted fraction of the element", "expected": 0.015390012446578026}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'waterflood' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b waterflood refused: waterflood/advanced matches neither its post-W1 form (prompt md5 61a1e3b3679d2b2c40d89bc94fcfa1cd) nor its W5 form (prompt md5 09f0564168f4fa423f863cc8ff1e1878), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b waterflood: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'waterflood' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'waterflood/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'waterflood/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b waterflood refused: waterflood/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b waterflood: waterflood/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b waterflood refused: waterflood/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'waterflood' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'waterflood/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'waterflood/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b waterflood refused: waterflood/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b waterflood: waterflood/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b waterflood refused: waterflood/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'waterflood' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'waterflood/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'waterflood/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b waterflood refused: waterflood/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b waterflood: waterflood/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b waterflood refused: waterflood/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Work the Ekene waterflood ledger over its 36 monthly periods, 2023-01 through 2025-12, on a revised frozen factor set: Bo 1.17, Bw 1.01, Bg 0 and Rs 360 scf/stb. Report the cumulative voidage replacement ratio as the ratio of the summed voidages, the total produced and injected voidage in reservoir barrels, the zero-based index of the first period at which the CUMULATIVE ratio reaches or exceeds 1.0, the number of periods whose INSTANTANEOUS ratio falls below an operator target band of 0.95 to 1.15, and the produced voidage of June 2024 alone. Only free produced gas adds voidage: subtract the solution gas Rs*Np/1000 from the metered gas before converting. The ledger explorer opens on the teaching factor set and band; type the case in.',
           title = 'Read the flood ledger',
           dataset = 'ekene-dynamic/waterflood.json (36 periods, factor set Bo 1.17 / Bw 1.01 / Rs 360)',
           fields = '[{"key": "field_cum_vrr", "tol": 0.0005, "unit": "-", "label": "Field cumulative VRR", "expected": 1.0639811055975046}, {"key": "produced_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total produced voidage", "expected": 213561.2936416994}, {"key": "injected_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total injected voidage", "expected": 227225.18132172863}, {"key": "fillup_month_index", "tol": 0.0, "unit": "index", "label": "Fill-up period index (zero-based)", "expected": 7}, {"key": "months_under_target_band", "tol": 0.0, "unit": "count", "label": "Periods under the 0.95 to 1.15 band", "expected": 2}, {"key": "month_produced_voidage_rb", "tol": 1.0, "unit": "rb", "label": "June 2024 produced voidage", "expected": 6353.507278415295}]'::jsonb
     where app_slug = 'waterflood' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b waterflood refused: waterflood/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '8d366396065e8af514b92c982a9aa730' and md5(coalesce(title, '')) = '85c846f6ffcfd5552f58480dc9daa7ba' and md5(coalesce(dataset, '')) = '4dd5ade425a421b189fce0c3676afeae' and fields = '[{"key": "field_cum_vrr", "tol": 0.0005, "unit": "-", "label": "Field cumulative VRR", "expected": 1.0639811055975046}, {"key": "produced_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total produced voidage", "expected": 213561.2936416994}, {"key": "injected_voidage_rb", "tol": 50.0, "unit": "rb", "label": "Total injected voidage", "expected": 227225.18132172863}, {"key": "fillup_month_index", "tol": 0.0, "unit": "index", "label": "Fill-up period index (zero-based)", "expected": 7}, {"key": "months_under_target_band", "tol": 0.0, "unit": "count", "label": "Periods under the 0.95 to 1.15 band", "expected": 2}, {"key": "month_produced_voidage_rb", "tol": 1.0, "unit": "rb", "label": "June 2024 produced voidage", "expected": 6353.507278415295}]'::jsonb) from public.academy_capstones where app_slug = 'waterflood' and tier = 'beginner' and active) is not true then
    raise exception 'w5b waterflood refused: waterflood/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Take the Ekene flood apart by geometry on a revised allocation matrix: Ekene-2 to Ekene-6 0.40, Ekene-1 0.35 and Ekene-3 0.10, and Ekene-4 to Ekene-3 0.45, Ekene-6 0.30 and Ekene-5 0.15. The two elements are North, holding Ekene-1 and Ekene-6, and South, holding Ekene-3 and Ekene-5. Report the injected volume that lands on no producer, each element''s cumulative VRR on the frozen factor set, and the injection recommended for the South element at a target VRR of 1.10 over a two-period trailing window, scaled from the ALLOCATED injection into that element. Then two diagnostics on the raw well data: the Hall plot slope ratio for Ekene-4 built on pressure ABOVE the 2050 psia injection reference from the daily rows through 2025-06-30 only, and the late-time log-log slope of the water oil ratio derivative for Ekene-6 with the derivative smoothed over 5 points. The pattern explorer opens on the teaching matrix and read; type the case in.',
           title = 'Allocate, split, diagnose',
           dataset = 'ekene-dynamic/waterflood.json (a stated allocation matrix, surveillance to 2025-06-30)',
           fields = '[{"key": "out_of_zone_bbl", "tol": 20.0, "unit": "bbl", "label": "Out-of-zone injection", "expected": 29246.80551665815}, {"key": "north_cum_vrr", "tol": 0.0005, "unit": "-", "label": "North element cumulative VRR", "expected": 1.1616748507042214}, {"key": "south_cum_vrr", "tol": 0.0005, "unit": "-", "label": "South element cumulative VRR", "expected": 0.6307735406413947}, {"key": "south_recommended_wi", "tol": 2.0, "unit": "bbl", "label": "South recommended injection at target 1.10", "expected": 2915.665334186579}, {"key": "hall_ratio_e4", "tol": 0.0005, "unit": "-", "label": "Ekene-4 Hall slope ratio above the reference, rows to 2025-06-30", "expected": 1.303301717154095}, {"key": "chan_slope_case", "tol": 0.005, "unit": "-", "label": "Ekene-6 Chan late-time slope, 5-point smoothing", "expected": 1.5358261835134785}]'::jsonb
     where app_slug = 'waterflood' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b waterflood refused: waterflood/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '14c88f4727b34b3624ed143187b95fa1' and md5(coalesce(title, '')) = '1bf8921f628481c257351e2e0f55b712' and md5(coalesce(dataset, '')) = 'c834bf651cfa47e289aab4e8113f3a66' and fields = '[{"key": "out_of_zone_bbl", "tol": 20.0, "unit": "bbl", "label": "Out-of-zone injection", "expected": 29246.80551665815}, {"key": "north_cum_vrr", "tol": 0.0005, "unit": "-", "label": "North element cumulative VRR", "expected": 1.1616748507042214}, {"key": "south_cum_vrr", "tol": 0.0005, "unit": "-", "label": "South element cumulative VRR", "expected": 0.6307735406413947}, {"key": "south_recommended_wi", "tol": 2.0, "unit": "bbl", "label": "South recommended injection at target 1.10", "expected": 2915.665334186579}, {"key": "hall_ratio_e4", "tol": 0.0005, "unit": "-", "label": "Ekene-4 Hall slope ratio above the reference, rows to 2025-06-30", "expected": 1.303301717154095}, {"key": "chan_slope_case", "tol": 0.005, "unit": "-", "label": "Ekene-6 Chan late-time slope, 5-point smoothing", "expected": 1.5358261835134785}]'::jsonb) from public.academy_capstones where app_slug = 'waterflood' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b waterflood refused: waterflood/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Design and then check a flood on a revised layer column. The sand is five non-communicating layers, given in DEPTH order with thicknesses 18, 22, 16, 14 and 14 ft and permeabilities 140, 520, 230, 95 and 410 md; the endpoint mobility ratio is 1.5 and the frozen factors are Bo 1.21584 and Bw 1.02. Report the Dykstra-Parsons permeability variation V, the vertical coverage at the FIRST layer breakthrough at that mobility ratio, and the Stiles surface water cut at the same stage using the capacity ratio A = M*Bo/Bw. Then forecast the five-spot element of 208.8040473397547 acres and 34.585155812896204 ft net at porosity 0.2 for an oil of 2.4 cp, injecting 1600 rb/d with the vertical sweep taken from your own coverage answer and a water oil ratio limit of 25: report the Craig five-spot areal sweep at breakthrough the forecast reports and the breakthrough time as the engine reports it, on whole monthly steps of 30.4375 days. Finally, invert the pattern breakthrough condition on the injection the allocation routed to Ekene-1 before its 2025-06-01 breakthrough, at that forecast''s breakthrough state, and report the contacted pore volume as a fraction of the WHOLE element, 11205422.76570545 rb, computed without the vertical sweep multiplier. The design explorer opens on the teaching column and design case; type the case in.',
           title = 'Design the flood',
           dataset = 'ekene-dynamic/waterflood.json (a stated layer column, M 1.5, 1600 rb/d, 2.4 cp oil, Ekene-1 breakthrough)',
           fields = '[{"key": "dykstra_parsons_v", "tol": 0.001, "unit": "-", "label": "Dykstra-Parsons permeability variation V", "expected": 0.5108350057773658}, {"key": "dp_coverage_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Coverage at the first breakthrough, M 1.5", "expected": 0.53830773439402}, {"key": "stiles_wc_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Stiles surface water cut at first BT", "expected": 0.6065200837842389}, {"key": "eabt_at_case_mu", "tol": 0.0005, "unit": "fraction", "label": "Areal sweep at breakthrough, 2.4 cp oil", "expected": 0.6187020568266292}, {"key": "case_breakthrough_days", "tol": 2.0, "unit": "days", "label": "Forecast breakthrough time", "expected": 760.9375}, {"key": "implied_swept_fraction", "tol": 0.0002, "unit": "fraction", "label": "Implied contacted fraction of the element", "expected": 0.015390012446578026}]'::jsonb
     where app_slug = 'waterflood' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b waterflood refused: waterflood/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '09f0564168f4fa423f863cc8ff1e1878' and md5(coalesce(title, '')) = 'a1c5a08e762b76dc2fc42cede61b09b0' and md5(coalesce(dataset, '')) = 'e2c09682e05696e8c958e566d49e9c56' and fields = '[{"key": "dykstra_parsons_v", "tol": 0.001, "unit": "-", "label": "Dykstra-Parsons permeability variation V", "expected": 0.5108350057773658}, {"key": "dp_coverage_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Coverage at the first breakthrough, M 1.5", "expected": 0.53830773439402}, {"key": "stiles_wc_first_bt", "tol": 0.0005, "unit": "fraction", "label": "Stiles surface water cut at first BT", "expected": 0.6065200837842389}, {"key": "eabt_at_case_mu", "tol": 0.0005, "unit": "fraction", "label": "Areal sweep at breakthrough, 2.4 cp oil", "expected": 0.6187020568266292}, {"key": "case_breakthrough_days", "tol": 2.0, "unit": "days", "label": "Forecast breakthrough time", "expected": 760.9375}, {"key": "implied_swept_fraction", "tol": 0.0002, "unit": "fraction", "label": "Implied contacted fraction of the element", "expected": 0.015390012446578026}]'::jsonb) from public.academy_capstones where app_slug = 'waterflood' and tier = 'advanced' and active) is not true then
    raise exception 'w5b waterflood refused: waterflood/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b waterflood: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
