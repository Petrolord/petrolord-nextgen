-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): sim.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/sim.json. The new
-- keys come from docs/graded-field-audit/w5b/sim.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The story-so-far and working lessons printed every answer and the panels
--   opened on the committed deck. Re-cased on the deck rebuilt at a regional
--   mean of 1566.5 m, read at three stated columns, the Ekene-2 column, the
--   EQUIL datum and a column count; the cell count, layer thickness and table
--   end points it replaces are fixed by the deck design and cannot move with any
--   setting.
--   deck_cell_count (4500, tol 0)
--       -> col_top_c_ft 'Top of the third stated column' ft, expected 5138.443568664314, tol 0.05
--   crest_top_ft (5055.774278215223, tol 0.05)
--       -> ekene2_top_ft 'Top of the Ekene-2 column' ft, expected 5131.9078703170535, tol 0.05
--   layer1_dz_ft (7.411104817049187, tol 0.001)
--       -> equil_datum_ft 'EQUIL datum depth' ft, expected 5123.841733185081, tol 0.05
--   swof_first_sw (0.35, tol 0.0005)
--       -> col_top_a_ft 'Top of the first stated column' ft, expected 5141.314073228021, tol 0.05
--   sgof_last_sg (0.65, tol 0.0005)
--       -> col_top_b_ft 'Top of the second stated column' ft, expected 5122.558807654924, tol 0.05
--   vertical_connection_count (5, tol 0)
--       -> columns_above_owc 'Columns with their top above the contact' count, expected 341, tol 0.0
--   DATASET was: ekene-dynamic/sim.json (940-line Eclipse-format deck, 30x30x5
--   grid, six sections)
--   DATASET now: ekene-dynamic/sim.json rebuilt at regional mean 1566.5 m
--   PROMPT now: A re-map moves the Ekene regional mean to 1566.5 m TVD; the
--   contact stays at 1560 m. Rebuild the deck at that mean (type it into the
--   deck and structure explorers, which open on the committed deck) and read it:
--   the top depth in feet of column (24, 6), of column (6, 26) and of column
--   (18, 3), the top of the Ekene-2 column in feet, the EQUIL datum depth in
--   feet, and how many of the 900 columns have their top above the contact.
--   Every one is read or counted from the rebuilt deck.
--
-- INTERMEDIATE: pick A (re-case)
--   The story-so-far lesson printed every answer and the structure explorer
--   opened on the committed deck. Re-cased on a deck rebuilt at a regional mean
--   of 1573.2 m and a 1562 m contact, and a stated oil for the correlation check
--   the panel now carries (the correlated Bo was unobtainable before).
--   deck_stoiip_stb (12132366.897955146, tol 5000)
--       -> deck_stoiip_stb 'Deck STOIIP, cell-centre rule' stb, expected 14102551.091138717, tol 5000.0
--   stoiip_vs_booking_pct (-0.05635630826191784, tol 0.005)
--       -> stoiip_vs_booking_pct 'Gap against the NG5 booking' percent, expected 16.17356722329737, tol 0.005
--   oil_cells_centre_rule (266, tol 0)
--       -> oil_cells_centre_rule 'Oil cells under the cell-centre rule' cells, expected 286, tol 0.0
--   ekene2_deck_top_m (1564.3183173003902, tol 0.005)
--       -> ekene2_deck_top_m 'Deck top depth at Ekene-2' m, expected 1564.4198361764543, tol 0.005
--   correlated_bo_at_pi (1.2292846175634324, tol 0.0005)
--       -> correlated_bo_at_pi 'Correlated Bo at initial pressure' rb/stb, expected 1.3084084939279073, tol 0.0005
--   correlated_rs_gap_pct (5.484806880676496, tol 0.02)
--       -> correlated_rs_gap_pct 'Correlated Rs above the designed 400' percent, expected 19.694177483394792, tol 0.02
--   DATASET was: ekene-dynamic/sim.json against field.json (NG5 booking), the
--   six mapped well tops and Standing correlations
--   DATASET now: ekene-dynamic/sim.json rebuilt at regional mean 1573.2 m,
--   contact 1562 m, a stated oil
--   PROMPT now: Audit a rebuilt Ekene deck against everything outside it: the
--   regional mean is 1573.2 m TVD and the contact 1562 m. Report the deck's
--   stock tank oil initially in place under the ECLIPSE CELL-CENTRE rule, where
--   a layer contributes oil only if its own centre depth lies above the contact;
--   the gap between that and the NG5 volumetric booking of 12139208.107496763
--   stb, as a percentage OF THE BOOKING, signed so a smaller deck reads
--   negative; the number of grid cells that rule assigns to oil; and the top
--   depth in metres the deck gives at Ekene-2, whose logged top is 1565 m at map
--   position (2200, 1150). Then run Standing's correlation for a 35 API oil with
--   450 scf/stb of designed solution gas, a gas gravity of 0.80, 195 degrees
--   Fahrenheit, a bubble point of 2200 psia and an initial pressure of 3400
--   psia: report the oil formation volume factor at the initial pressure and the
--   percentage by which the correlated solution gas at the bubble point exceeds
--   the designed 450 scf/stb. The structure explorer opens on the committed deck
--   and the teaching oil; type the setting in.
--
-- ADVANCED: pick A (re-case)
--   The story-so-far lesson printed every answer and the build explorer opened
--   on the EK6-ST toe. Re-cased on a toe at (1500, 1300), a booking target of
--   11500000 stb (the structure explorer now takes the regional mean, so the
--   bisection can be run), the 2024 history periods, the W1 validator message
--   count re-computed on the calibrated deck, and the datum at the calibrated
--   mean.
--   deviated_connection_count (11, tol 0)
--       -> deviated_connection_count 'Side-track merged connections' count, expected 17, tol 0.0
--   deviated_distinct_columns (8, tol 0)
--       -> deviated_distinct_columns 'Side-track distinct columns' count, expected 9, tol 0.0
--   calibration_regional_mean_m (1570.026311, tol 0.005)
--       -> calibration_regional_mean_m 'Calibrated kriging regional mean' m TVD, expected 1571.9123467151076, tol 0.005
--   history_total_oil_stb (176923.83644033302, tol 50)
--       -> history_oil_stb 'History oil total, 2024 periods, round trip' stb, expected 65203.29641281776, tol 50.0
--   validator_error_messages (8.0, tol 0.0)
--       -> validator_error_messages 'Validator error messages across the seven cases' count, expected 8, tol 0.0
--   equil_datum_depth_ft (5129.97013005754, tol 0.05)
--       -> equil_datum_depth_ft 'Equilibration datum depth' ft, expected 5133.247882750887, tol 0.05
--   DATASET was: ekene-dynamic/sim.json (deviated side-track, 36-period history,
--   seven broken specifications)
--   DATASET now: ekene-dynamic/sim.json (side-track toe (1500, 1300), booking
--   target 11500000 stb, 2024 history)
--   PROMPT now: Build the parts of the Ekene deck that require a decision. First
--   intersect a new side-track against the committed grid: it runs from
--   Ekene-6's heel at map position (1900, 1800) to a toe at (1500, 1300),
--   descending from the top of the sand to the base of the column, on a 100 m
--   grid whose origin sits half a cell south-west of the field origin. Report
--   the number of merged connections and the number of distinct (i, j) columns
--   they fall in. Then calibrate: bisect on the kriging regional mean, in metres
--   true vertical depth, until the deck's CELL-CENTRE oil volume at the 1560 m
--   contact crosses a revised booking of 11500000 stb, and report the mean you
--   converge on. Then take the history: convert the RC4 monthly ledger to rates
--   by each period's own calendar day count, and report the total oil the twelve
--   periods dated 2024-01-01 through 2024-12-01 carry when each rate is
--   multiplied back by the days it spans. Then count the error messages the
--   validator raises across the fixture's seven deliberately broken
--   specifications, rebuilt at your calibrated mean, every MESSAGE it lists
--   under each case. Finally report the equilibration datum depth in feet at
--   your calibrated mean, computed as the mean of all 900 column top depths.
--
-- ATTEMPTS. Tiers whose graded keys move: sim/beginner, sim/intermediate,
-- sim/advanced. Before it writes, the file counts academy_capstone_attempts on
-- each and REFUSES if any exist, unless D5 allowlists that tier with the exact
-- attempt ids (allowlist: empty). Stored scores are never touched.
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
  -- sim / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'sim' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b sim refused: sim/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '446aa8af1a6fca40ac1356cf6474ab31' and md5(coalesce(title, '')) = '4904bce8ccc5d2d2abfc33200b981f3b' and md5(coalesce(dataset, '')) = '5d35b7e85d8ae1385a765192532702b3' and fields = '[{"key": "deck_cell_count", "tol": 0, "unit": "cells", "label": "Total grid cells", "expected": 4500}, {"key": "crest_top_ft", "tol": 0.05, "unit": "ft", "label": "Shallowest column top", "expected": 5055.774278215223}, {"key": "layer1_dz_ft", "tol": 0.001, "unit": "ft", "label": "Layer 1 thickness", "expected": 7.411104817049187}, {"key": "swof_first_sw", "tol": 0.0005, "unit": "fraction", "label": "First SWOF water saturation", "expected": 0.35}, {"key": "sgof_last_sg", "tol": 0.0005, "unit": "fraction", "label": "Last SGOF gas saturation", "expected": 0.65}, {"key": "vertical_connection_count", "tol": 0, "unit": "count", "label": "Connections on a vertical producer", "expected": 5}]'::jsonb then 'old'
              when md5(prompt) = '6c6befa4bc4cb9ef1c90c92278c775b2' and md5(coalesce(title, '')) = '4904bce8ccc5d2d2abfc33200b981f3b' and md5(coalesce(dataset, '')) = '85b1ae69cc82b982211719480cb809b7' and fields = '[{"key": "col_top_c_ft", "tol": 0.05, "unit": "ft", "label": "Top of the third stated column", "expected": 5138.443568664314}, {"key": "ekene2_top_ft", "tol": 0.05, "unit": "ft", "label": "Top of the Ekene-2 column", "expected": 5131.9078703170535}, {"key": "equil_datum_ft", "tol": 0.05, "unit": "ft", "label": "EQUIL datum depth", "expected": 5123.841733185081}, {"key": "col_top_a_ft", "tol": 0.05, "unit": "ft", "label": "Top of the first stated column", "expected": 5141.314073228021}, {"key": "col_top_b_ft", "tol": 0.05, "unit": "ft", "label": "Top of the second stated column", "expected": 5122.558807654924}, {"key": "columns_above_owc", "tol": 0.0, "unit": "count", "label": "Columns with their top above the contact", "expected": 341}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'sim' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b sim refused: sim/beginner matches neither its post-W1 form (prompt md5 446aa8af1a6fca40ac1356cf6474ab31) nor its W5 form (prompt md5 6c6befa4bc4cb9ef1c90c92278c775b2), with the fields this file was generated against';
  end if;

  -- sim / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'sim' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b sim refused: sim/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a8481ee7644d6268a537348ecd1c3be5' and md5(coalesce(title, '')) = 'cf1761125f1956dabc052f48f7ac9148' and md5(coalesce(dataset, '')) = '269e69c78862527565094a922703ae34' and fields = '[{"key": "deck_stoiip_stb", "tol": 5000, "unit": "stb", "label": "Deck STOIIP, cell-centre rule", "expected": 12132366.897955146}, {"key": "stoiip_vs_booking_pct", "tol": 0.005, "unit": "percent", "label": "Gap against the NG5 booking", "expected": -0.05635630826191784}, {"key": "oil_cells_centre_rule", "tol": 0, "unit": "cells", "label": "Oil cells under the cell-centre rule", "expected": 266}, {"key": "ekene2_deck_top_m", "tol": 0.005, "unit": "m", "label": "Deck top depth at Ekene-2", "expected": 1564.3183173003902}, {"key": "correlated_bo_at_pi", "tol": 0.0005, "unit": "rb/stb", "label": "Correlated Bo at initial pressure", "expected": 1.2292846175634324}, {"key": "correlated_rs_gap_pct", "tol": 0.02, "unit": "percent", "label": "Correlated Rs above the designed 400", "expected": 5.484806880676496}]'::jsonb then 'old'
              when md5(prompt) = '668d85c9970e4c32ae9df9d7f67e32be' and md5(coalesce(title, '')) = 'cf1761125f1956dabc052f48f7ac9148' and md5(coalesce(dataset, '')) = '21fe6ce95b7f609c12710174c986e5d2' and fields = '[{"key": "deck_stoiip_stb", "tol": 5000.0, "unit": "stb", "label": "Deck STOIIP, cell-centre rule", "expected": 14102551.091138717}, {"key": "stoiip_vs_booking_pct", "tol": 0.005, "unit": "percent", "label": "Gap against the NG5 booking", "expected": 16.17356722329737}, {"key": "oil_cells_centre_rule", "tol": 0.0, "unit": "cells", "label": "Oil cells under the cell-centre rule", "expected": 286}, {"key": "ekene2_deck_top_m", "tol": 0.005, "unit": "m", "label": "Deck top depth at Ekene-2", "expected": 1564.4198361764543}, {"key": "correlated_bo_at_pi", "tol": 0.0005, "unit": "rb/stb", "label": "Correlated Bo at initial pressure", "expected": 1.3084084939279073}, {"key": "correlated_rs_gap_pct", "tol": 0.02, "unit": "percent", "label": "Correlated Rs above the designed 400", "expected": 19.694177483394792}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'sim' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b sim refused: sim/intermediate matches neither its post-W1 form (prompt md5 a8481ee7644d6268a537348ecd1c3be5) nor its W5 form (prompt md5 668d85c9970e4c32ae9df9d7f67e32be), with the fields this file was generated against';
  end if;

  -- sim / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'sim' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b sim refused: sim/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a5200f28c432cd79706513f80a818c70' and md5(coalesce(title, '')) = '50ba5aa1ce93a8f13613298240cd5a16' and md5(coalesce(dataset, '')) = '951d921af2926977a79adf8b6cd41533' and fields = '[{"key": "deviated_connection_count", "tol": 0, "unit": "count", "label": "Side-track merged connections", "expected": 11}, {"key": "deviated_distinct_columns", "tol": 0, "unit": "count", "label": "Side-track distinct columns", "expected": 8}, {"key": "calibration_regional_mean_m", "tol": 0.005, "unit": "m TVD", "label": "Calibrated kriging regional mean", "expected": 1570.026311}, {"key": "history_total_oil_stb", "tol": 50, "unit": "stb", "label": "History oil total, round trip", "expected": 176923.83644033302}, {"key": "validator_error_messages", "tol": 0.0, "unit": "count", "label": "Validator error messages across the seven cases", "expected": 8.0}, {"key": "equil_datum_depth_ft", "tol": 0.05, "unit": "ft", "label": "Equilibration datum depth", "expected": 5129.97013005754}]'::jsonb then 'old'
              when md5(prompt) = '4018b42ff043138f5992f196515824ed' and md5(coalesce(title, '')) = '50ba5aa1ce93a8f13613298240cd5a16' and md5(coalesce(dataset, '')) = '4bf60725400c75d518d1f71702e4ebf2' and fields = '[{"key": "deviated_connection_count", "tol": 0.0, "unit": "count", "label": "Side-track merged connections", "expected": 17}, {"key": "deviated_distinct_columns", "tol": 0.0, "unit": "count", "label": "Side-track distinct columns", "expected": 9}, {"key": "calibration_regional_mean_m", "tol": 0.005, "unit": "m TVD", "label": "Calibrated kriging regional mean", "expected": 1571.9123467151076}, {"key": "history_oil_stb", "tol": 50.0, "unit": "stb", "label": "History oil total, 2024 periods, round trip", "expected": 65203.29641281776}, {"key": "validator_error_messages", "tol": 0.0, "unit": "count", "label": "Validator error messages across the seven cases", "expected": 8}, {"key": "equil_datum_depth_ft", "tol": 0.05, "unit": "ft", "label": "Equilibration datum depth", "expected": 5133.247882750887}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'sim' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b sim refused: sim/advanced matches neither its post-W1 form (prompt md5 a5200f28c432cd79706513f80a818c70) nor its W5 form (prompt md5 4018b42ff043138f5992f196515824ed), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b sim: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'sim' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'sim/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'sim/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b sim refused: sim/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b sim: sim/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b sim refused: sim/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'sim' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'sim/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'sim/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b sim refused: sim/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b sim: sim/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b sim refused: sim/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'sim' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'sim/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'sim/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b sim refused: sim/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b sim: sim/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b sim refused: sim/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'A re-map moves the Ekene regional mean to 1566.5 m TVD; the contact stays at 1560 m. Rebuild the deck at that mean (type it into the deck and structure explorers, which open on the committed deck) and read it: the top depth in feet of column (24, 6), of column (6, 26) and of column (18, 3), the top of the Ekene-2 column in feet, the EQUIL datum depth in feet, and how many of the 900 columns have their top above the contact. Every one is read or counted from the rebuilt deck.',
           title = 'Read the deck',
           dataset = 'ekene-dynamic/sim.json rebuilt at regional mean 1566.5 m',
           fields = '[{"key": "col_top_c_ft", "tol": 0.05, "unit": "ft", "label": "Top of the third stated column", "expected": 5138.443568664314}, {"key": "ekene2_top_ft", "tol": 0.05, "unit": "ft", "label": "Top of the Ekene-2 column", "expected": 5131.9078703170535}, {"key": "equil_datum_ft", "tol": 0.05, "unit": "ft", "label": "EQUIL datum depth", "expected": 5123.841733185081}, {"key": "col_top_a_ft", "tol": 0.05, "unit": "ft", "label": "Top of the first stated column", "expected": 5141.314073228021}, {"key": "col_top_b_ft", "tol": 0.05, "unit": "ft", "label": "Top of the second stated column", "expected": 5122.558807654924}, {"key": "columns_above_owc", "tol": 0.0, "unit": "count", "label": "Columns with their top above the contact", "expected": 341}]'::jsonb
     where app_slug = 'sim' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b sim refused: sim/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '6c6befa4bc4cb9ef1c90c92278c775b2' and md5(coalesce(title, '')) = '4904bce8ccc5d2d2abfc33200b981f3b' and md5(coalesce(dataset, '')) = '85b1ae69cc82b982211719480cb809b7' and fields = '[{"key": "col_top_c_ft", "tol": 0.05, "unit": "ft", "label": "Top of the third stated column", "expected": 5138.443568664314}, {"key": "ekene2_top_ft", "tol": 0.05, "unit": "ft", "label": "Top of the Ekene-2 column", "expected": 5131.9078703170535}, {"key": "equil_datum_ft", "tol": 0.05, "unit": "ft", "label": "EQUIL datum depth", "expected": 5123.841733185081}, {"key": "col_top_a_ft", "tol": 0.05, "unit": "ft", "label": "Top of the first stated column", "expected": 5141.314073228021}, {"key": "col_top_b_ft", "tol": 0.05, "unit": "ft", "label": "Top of the second stated column", "expected": 5122.558807654924}, {"key": "columns_above_owc", "tol": 0.0, "unit": "count", "label": "Columns with their top above the contact", "expected": 341}]'::jsonb) from public.academy_capstones where app_slug = 'sim' and tier = 'beginner' and active) is not true then
    raise exception 'w5b sim refused: sim/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Audit a rebuilt Ekene deck against everything outside it: the regional mean is 1573.2 m TVD and the contact 1562 m. Report the deck''s stock tank oil initially in place under the ECLIPSE CELL-CENTRE rule, where a layer contributes oil only if its own centre depth lies above the contact; the gap between that and the NG5 volumetric booking of 12139208.107496763 stb, as a percentage OF THE BOOKING, signed so a smaller deck reads negative; the number of grid cells that rule assigns to oil; and the top depth in metres the deck gives at Ekene-2, whose logged top is 1565 m at map position (2200, 1150). Then run Standing''s correlation for a 35 API oil with 450 scf/stb of designed solution gas, a gas gravity of 0.80, 195 degrees Fahrenheit, a bubble point of 2200 psia and an initial pressure of 3400 psia: report the oil formation volume factor at the initial pressure and the percentage by which the correlated solution gas at the bubble point exceeds the designed 450 scf/stb. The structure explorer opens on the committed deck and the teaching oil; type the setting in.',
           title = 'Reconcile the model against the field',
           dataset = 'ekene-dynamic/sim.json rebuilt at regional mean 1573.2 m, contact 1562 m, a stated oil',
           fields = '[{"key": "deck_stoiip_stb", "tol": 5000.0, "unit": "stb", "label": "Deck STOIIP, cell-centre rule", "expected": 14102551.091138717}, {"key": "stoiip_vs_booking_pct", "tol": 0.005, "unit": "percent", "label": "Gap against the NG5 booking", "expected": 16.17356722329737}, {"key": "oil_cells_centre_rule", "tol": 0.0, "unit": "cells", "label": "Oil cells under the cell-centre rule", "expected": 286}, {"key": "ekene2_deck_top_m", "tol": 0.005, "unit": "m", "label": "Deck top depth at Ekene-2", "expected": 1564.4198361764543}, {"key": "correlated_bo_at_pi", "tol": 0.0005, "unit": "rb/stb", "label": "Correlated Bo at initial pressure", "expected": 1.3084084939279073}, {"key": "correlated_rs_gap_pct", "tol": 0.02, "unit": "percent", "label": "Correlated Rs above the designed 400", "expected": 19.694177483394792}]'::jsonb
     where app_slug = 'sim' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b sim refused: sim/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '668d85c9970e4c32ae9df9d7f67e32be' and md5(coalesce(title, '')) = 'cf1761125f1956dabc052f48f7ac9148' and md5(coalesce(dataset, '')) = '21fe6ce95b7f609c12710174c986e5d2' and fields = '[{"key": "deck_stoiip_stb", "tol": 5000.0, "unit": "stb", "label": "Deck STOIIP, cell-centre rule", "expected": 14102551.091138717}, {"key": "stoiip_vs_booking_pct", "tol": 0.005, "unit": "percent", "label": "Gap against the NG5 booking", "expected": 16.17356722329737}, {"key": "oil_cells_centre_rule", "tol": 0.0, "unit": "cells", "label": "Oil cells under the cell-centre rule", "expected": 286}, {"key": "ekene2_deck_top_m", "tol": 0.005, "unit": "m", "label": "Deck top depth at Ekene-2", "expected": 1564.4198361764543}, {"key": "correlated_bo_at_pi", "tol": 0.0005, "unit": "rb/stb", "label": "Correlated Bo at initial pressure", "expected": 1.3084084939279073}, {"key": "correlated_rs_gap_pct", "tol": 0.02, "unit": "percent", "label": "Correlated Rs above the designed 400", "expected": 19.694177483394792}]'::jsonb) from public.academy_capstones where app_slug = 'sim' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b sim refused: sim/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Build the parts of the Ekene deck that require a decision. First intersect a new side-track against the committed grid: it runs from Ekene-6''s heel at map position (1900, 1800) to a toe at (1500, 1300), descending from the top of the sand to the base of the column, on a 100 m grid whose origin sits half a cell south-west of the field origin. Report the number of merged connections and the number of distinct (i, j) columns they fall in. Then calibrate: bisect on the kriging regional mean, in metres true vertical depth, until the deck''s CELL-CENTRE oil volume at the 1560 m contact crosses a revised booking of 11500000 stb, and report the mean you converge on. Then take the history: convert the RC4 monthly ledger to rates by each period''s own calendar day count, and report the total oil the twelve periods dated 2024-01-01 through 2024-12-01 carry when each rate is multiplied back by the days it spans. Then count the error messages the validator raises across the fixture''s seven deliberately broken specifications, rebuilt at your calibrated mean, every MESSAGE it lists under each case. Finally report the equilibration datum depth in feet at your calibrated mean, computed as the mean of all 900 column top depths.',
           title = 'Build one and prove it',
           dataset = 'ekene-dynamic/sim.json (side-track toe (1500, 1300), booking target 11500000 stb, 2024 history)',
           fields = '[{"key": "deviated_connection_count", "tol": 0.0, "unit": "count", "label": "Side-track merged connections", "expected": 17}, {"key": "deviated_distinct_columns", "tol": 0.0, "unit": "count", "label": "Side-track distinct columns", "expected": 9}, {"key": "calibration_regional_mean_m", "tol": 0.005, "unit": "m TVD", "label": "Calibrated kriging regional mean", "expected": 1571.9123467151076}, {"key": "history_oil_stb", "tol": 50.0, "unit": "stb", "label": "History oil total, 2024 periods, round trip", "expected": 65203.29641281776}, {"key": "validator_error_messages", "tol": 0.0, "unit": "count", "label": "Validator error messages across the seven cases", "expected": 8}, {"key": "equil_datum_depth_ft", "tol": 0.05, "unit": "ft", "label": "Equilibration datum depth", "expected": 5133.247882750887}]'::jsonb
     where app_slug = 'sim' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b sim refused: sim/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '4018b42ff043138f5992f196515824ed' and md5(coalesce(title, '')) = '50ba5aa1ce93a8f13613298240cd5a16' and md5(coalesce(dataset, '')) = '4bf60725400c75d518d1f71702e4ebf2' and fields = '[{"key": "deviated_connection_count", "tol": 0.0, "unit": "count", "label": "Side-track merged connections", "expected": 17}, {"key": "deviated_distinct_columns", "tol": 0.0, "unit": "count", "label": "Side-track distinct columns", "expected": 9}, {"key": "calibration_regional_mean_m", "tol": 0.005, "unit": "m TVD", "label": "Calibrated kriging regional mean", "expected": 1571.9123467151076}, {"key": "history_oil_stb", "tol": 50.0, "unit": "stb", "label": "History oil total, 2024 periods, round trip", "expected": 65203.29641281776}, {"key": "validator_error_messages", "tol": 0.0, "unit": "count", "label": "Validator error messages across the seven cases", "expected": 8}, {"key": "equil_datum_depth_ft", "tol": 0.05, "unit": "ft", "label": "Equilibration datum depth", "expected": 5133.247882750887}]'::jsonb) from public.academy_capstones where app_slug = 'sim' and tier = 'advanced' and active) is not true then
    raise exception 'w5b sim refused: sim/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b sim: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
