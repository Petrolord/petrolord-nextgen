-- ============================================================================
-- B5 FOLLOW-ON W5A (leak re-case and strip): mapping.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/mapping.json. The new
-- keys come from tools/course-waves/w5/mapping/fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   Every field leaked: the walkthrough and the module lessons printed them and
--   the map explorer opened on the capstone case. The capstone moves to the ADIM
--   well set on a 75 m cell, typed into the map explorer; the control-point
--   count (read off the brief) and the contour interval (a small answer set)
--   give way to the grid height and the mean mapped depth.
--   n_control_points (6, tol 0)
--       -> adim_grid_nx 'Grid width' nodes, expected 32, tol 0.0
--   grid_nx (25, tol 0)
--       -> adim_grid_ny 'Grid height' nodes, expected 24, tol 0.0
--   live_nodes (201, tol 0)
--       -> adim_live_nodes 'Mapped (live) grid nodes' count, expected 305, tol 0.0
--   crest_depth_m (1539.7181396484375, tol 0.5)
--       -> adim_crest_depth_m 'Crest (shallowest) depth' m, expected 1601.9686279296875, tol 0.005
--   depth_at_p1_m (1542.619873046875, tol 0.5)
--       -> adim_depth_at_prospect_m 'Depth at the prospect' m, expected 1604.5677490234373, tol 0.005
--   contour_step_m (10, tol 0)
--       -> adim_mean_depth_m 'Mean mapped depth' m, expected 1613.4646856589395, tol 0.005
--   TITLE was: Map the Ekene TOP_SAND surface
--   TITLE now: Map the ADIM TOP_SAND surface
--   DATASET was: mapping/ekene-topsand
--   DATASET now: mapping/ADIM wells (W5 re-case; every well is stated in the
--   brief)
--   PROMPT now: Map the ADIM TOP_SAND surface. The wells, as name, x, y,
--   TOP_SAND MD, BASE_SAND MD (one per line in the panel's Type a well set box):
--   Adim-1, 800, 900, 1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3, 1300,
--   1850, 1605, 1638; Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700, 1618,
--   1650; Adim-6, 1700, 1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642. Grid
--   TOP_SAND on a 75 m cell with the course's two-cell pad and 800 m
--   extrapolation limit, and read the map explorer (it opens on the Ekene wells,
--   which are the teaching case): report the grid width and height in nodes, how
--   many nodes were mapped, the crest depth, the depth at the prospect at (1500,
--   1900), and the mean mapped depth.
--
-- INTERMEDIATE: pick A (re-case)
--   Every field leaked: the walkthrough and the isochore lessons printed them
--   and the isochore explorer opened on the capstone case. The capstone moves to
--   the ADIM wells on a 75 m cell, typed into the isochore explorer. W1's
--   iso_nodes_above_well_mean is carried as adim_iso_nodes_above_well_mean.
--   iso_min_m (25, tol 0.1)
--       -> adim_iso_min_m 'Isochore minimum thickness' m, expected 28.653076171875, tol 0.005
--   iso_max_m (35.897705078125, tol 0.1)
--       -> adim_iso_max_m 'Isochore maximum thickness' m, expected 37.25341796875, tol 0.005
--   iso_mean_m (32.25429068038713, tol 0.1)
--       -> adim_iso_mean_m 'Isochore mean thickness' m, expected 33.869257492315576, tol 0.005
--   iso_at_p1_m (34.050048828125, tol 0.1)
--       -> adim_iso_at_prospect_m 'Thickness at the prospect' m, expected 33.89817979600694, tol 0.005
--   iso_nodes_above_well_mean (146.0, tol 0.0)
--       -> adim_iso_nodes_above_well_mean 'Live isochore nodes above the well mean' count, expected 207, tol 0.0
--   mean_well_thickness_m (31.166666666666668, tol 0.05)
--       -> adim_mean_well_thickness_m 'Mean of the seven well thicknesses' m, expected 32.57142857142857, tol 0.005
--   TITLE was: Isochore of the Ekene SAND
--   TITLE now: Isochore of the ADIM SAND
--   DATASET was: mapping/ekene-isochore
--   DATASET now: mapping/ADIM wells, isochore (W5 re-case; every well is stated
--   in the brief)
--   PROMPT now: Grid both ADIM SAND surfaces on a 75 m cell (two-cell pad, 800 m
--   extrapolation limit) and subtract them into an isochore. The wells, as name,
--   x, y, TOP_SAND MD, BASE_SAND MD (one per line in the panel's Type a well set
--   box): Adim-1, 800, 900, 1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3,
--   1300, 1850, 1605, 1638; Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700,
--   1618, 1650; Adim-6, 1700, 1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642.
--   Read the isochore explorer (it opens on the Ekene wells, which are the
--   teaching case): the isochore minimum, maximum and mean thickness, the
--   thickness at the prospect at (1500, 1900), how many live isochore nodes sit
--   above the plain mean of the seven well thicknesses, and that plain mean
--   itself.
--
-- ADVANCED: pick A (re-case)
--   Every field leaked: the walkthrough and the validation lessons printed them
--   and the validation explorer opened on the capstone case. The capstone moves
--   to the ADIM wells, the interior well Adim-7 and the appraisal well Adim-8,
--   typed into the validation explorer. W1's depth_at_p1_with_e7_m is carried as
--   adim_depth_at_prospect_with_adim8_m.
--   cross_validatable_wells (1, tol 0)
--       -> adim_cross_validatable_wells 'Wells that can be cross-validated' count, expected 3, tol 0.0
--   loo_resid_e6 (9.8438720703125, tol 0.1)
--       -> adim_loo_resid_adim7 'Leave-one-out residual at Adim-7' m, expected -3.47149658203125, tol 0.005
--   pred_at_e7 (1543.3271484375, tol 0.1)
--       -> adim_pred_at_adim8 'Seven-well grid prediction at Adim-8' m, expected 1614.8310546875, tol 0.005
--   blind_residual_e7 (-5.6728515625, tol 0.1)
--       -> adim_blind_residual_adim8 'Blind-test residual at Adim-8' m, expected 3.8310546875, tol 0.005
--   zmin_with_e7 (1540.70556640625, tol 0.1)
--       -> adim_crest_with_adim8 'Crest depth with Adim-8 included' m, expected 1601.9122314453125, tol 0.005
--   depth_at_p1_with_e7_m (1547.105224609375, tol 0.01)
--       -> adim_depth_at_prospect_with_adim8_m 'Depth at the prospect with Adim-8 included' m, expected 1603.4613037109375, tol 0.005
--   TITLE was: Validate the Ekene TOP_SAND grid
--   TITLE now: Validate the ADIM TOP_SAND grid
--   DATASET was: mapping/ekene-validation
--   DATASET now: mapping/ADIM wells, validation (W5 re-case; every well is
--   stated in the brief)
--   PROMPT now: Validate the ADIM TOP_SAND grid on a 100 m cell (two-cell pad,
--   800 m extrapolation limit). The wells, as name, x, y, TOP_SAND MD, BASE_SAND
--   MD (one per line in the panel's Type a well set box): Adim-1, 800, 900,
--   1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3, 1300, 1850, 1605, 1638;
--   Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700, 1618, 1650; Adim-6, 1700,
--   1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642. Cross-validate by
--   leave-one-out: only wells inside the control hull can be validated, because
--   the gridder masks to the hull. Report how many wells that is and the
--   residual at Adim-7 (predicted minus actual). Then blind-test the appraisal
--   well Adim-8 at (1900, 2000), actual pick 1611 m: the seven-well grid
--   prediction there, its residual, and the crest and the depth at the prospect
--   at (1500, 1900) after regridding with Adim-8 included. Type the case into
--   the validation explorer (it opens on the Ekene wells, which are the teaching
--   case).
--
-- ATTEMPTS. Tiers whose graded keys move: mapping/beginner,
-- mapping/intermediate, mapping/advanced. Before it writes, the file counts
-- academy_capstone_attempts on each and REFUSES if any exist, unless D5
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
  -- mapping / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'mapping' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5a mapping refused: mapping/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '88c13b25fa1b403bb725d17ead458a9e' and md5(coalesce(title, '')) = 'ab8d30f6b4cedb09d7ab9d4c3e627223' and md5(coalesce(dataset, '')) = '7b1e5311cfd34cd2419285fc182e6c4d' and fields = '[{"key": "n_control_points", "tol": 0, "unit": "count", "label": "Control points used", "expected": 6}, {"key": "grid_nx", "tol": 0, "unit": "nodes", "label": "Grid width", "expected": 25}, {"key": "live_nodes", "tol": 0, "unit": "count", "label": "Mapped (live) grid nodes", "expected": 201}, {"key": "crest_depth_m", "tol": 0.5, "unit": "m", "label": "Crest (shallowest) depth", "expected": 1539.7181396484375}, {"key": "depth_at_p1_m", "tol": 0.5, "unit": "m", "label": "Depth at prospect P-1", "expected": 1542.619873046875}, {"key": "contour_step_m", "tol": 0, "unit": "m", "label": "Contour interval", "expected": 10}]'::jsonb then 'old'
              when md5(prompt) = '86d9e1cfb755b088f64370887d8b3149' and md5(coalesce(title, '')) = '7bc60b7787a72c23276305c85133efc2' and md5(coalesce(dataset, '')) = 'b4b559776ed8d835186b80bc82081de9' and fields = '[{"key": "adim_grid_nx", "tol": 0.0, "unit": "nodes", "label": "Grid width", "expected": 32}, {"key": "adim_grid_ny", "tol": 0.0, "unit": "nodes", "label": "Grid height", "expected": 24}, {"key": "adim_live_nodes", "tol": 0.0, "unit": "count", "label": "Mapped (live) grid nodes", "expected": 305}, {"key": "adim_crest_depth_m", "tol": 0.005, "unit": "m", "label": "Crest (shallowest) depth", "expected": 1601.9686279296875}, {"key": "adim_depth_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect", "expected": 1604.5677490234373}, {"key": "adim_mean_depth_m", "tol": 0.005, "unit": "m", "label": "Mean mapped depth", "expected": 1613.4646856589395}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'mapping' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5a mapping refused: mapping/beginner matches neither its post-W1 form (prompt md5 88c13b25fa1b403bb725d17ead458a9e) nor its W5 form (prompt md5 86d9e1cfb755b088f64370887d8b3149), with the fields this file was generated against';
  end if;

  -- mapping / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'mapping' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5a mapping refused: mapping/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a908fe9a048d40be1e82bcfd451816d3' and md5(coalesce(title, '')) = '6e1bfacfacfd850dcea97d93ec6274ce' and md5(coalesce(dataset, '')) = 'a02546c712d499221c673eeec566bc5c' and fields = '[{"key": "iso_min_m", "tol": 0.1, "unit": "m", "label": "Isochore minimum thickness", "expected": 25}, {"key": "iso_max_m", "tol": 0.1, "unit": "m", "label": "Isochore maximum thickness", "expected": 35.897705078125}, {"key": "iso_mean_m", "tol": 0.1, "unit": "m", "label": "Isochore mean thickness", "expected": 32.25429068038713}, {"key": "iso_at_p1_m", "tol": 0.1, "unit": "m", "label": "Thickness at prospect P-1", "expected": 34.050048828125}, {"key": "iso_nodes_above_well_mean", "tol": 0.0, "unit": "count", "label": "Live isochore nodes above the well mean", "expected": 146.0}, {"key": "mean_well_thickness_m", "tol": 0.05, "unit": "m", "label": "Mean of the six well thicknesses", "expected": 31.166666666666668}]'::jsonb then 'old'
              when md5(prompt) = 'e1357e50d8140a485cd3639a50fe8fb4' and md5(coalesce(title, '')) = '640ae6cd46ea94df84eea2317cdd1f30' and md5(coalesce(dataset, '')) = 'de8925d900163f0ffecf312badc89252' and fields = '[{"key": "adim_iso_min_m", "tol": 0.005, "unit": "m", "label": "Isochore minimum thickness", "expected": 28.653076171875}, {"key": "adim_iso_max_m", "tol": 0.005, "unit": "m", "label": "Isochore maximum thickness", "expected": 37.25341796875}, {"key": "adim_iso_mean_m", "tol": 0.005, "unit": "m", "label": "Isochore mean thickness", "expected": 33.869257492315576}, {"key": "adim_iso_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Thickness at the prospect", "expected": 33.89817979600694}, {"key": "adim_iso_nodes_above_well_mean", "tol": 0.0, "unit": "count", "label": "Live isochore nodes above the well mean", "expected": 207}, {"key": "adim_mean_well_thickness_m", "tol": 0.005, "unit": "m", "label": "Mean of the seven well thicknesses", "expected": 32.57142857142857}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'mapping' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5a mapping refused: mapping/intermediate matches neither its post-W1 form (prompt md5 a908fe9a048d40be1e82bcfd451816d3) nor its W5 form (prompt md5 e1357e50d8140a485cd3639a50fe8fb4), with the fields this file was generated against';
  end if;

  -- mapping / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'mapping' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5a mapping refused: mapping/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a7faf6ea15ea17f1aca6dfc26b2decd3' and md5(coalesce(title, '')) = 'af1fe60c294cd24d8d028a1b0630da6e' and md5(coalesce(dataset, '')) = 'b656b8e1a9c44c5891c0e6099d1d1439' and fields = '[{"key": "cross_validatable_wells", "tol": 0, "unit": "count", "label": "Wells that can be cross-validated", "expected": 1}, {"key": "loo_resid_e6", "tol": 0.1, "unit": "m", "label": "Leave-one-out residual at Ekene-6", "expected": 9.8438720703125}, {"key": "pred_at_e7", "tol": 0.1, "unit": "m", "label": "Six-well grid prediction at Ekene-7", "expected": 1543.3271484375}, {"key": "blind_residual_e7", "tol": 0.1, "unit": "m", "label": "Blind-test residual at Ekene-7", "expected": -5.6728515625}, {"key": "zmin_with_e7", "tol": 0.1, "unit": "m", "label": "Crest depth with Ekene-7 included", "expected": 1540.70556640625}, {"key": "depth_at_p1_with_e7_m", "tol": 0.01, "unit": "m", "label": "Depth at prospect P-1 with Ekene-7 included", "expected": 1547.105224609375}]'::jsonb then 'old'
              when md5(prompt) = '1e63354d776d6b51b4bcedcc23d796b2' and md5(coalesce(title, '')) = '891b938d1ffc7c8db7b05da7827cb1f2' and md5(coalesce(dataset, '')) = 'a2cc58a3908035b69edc0fce95cab5b7' and fields = '[{"key": "adim_cross_validatable_wells", "tol": 0.0, "unit": "count", "label": "Wells that can be cross-validated", "expected": 3}, {"key": "adim_loo_resid_adim7", "tol": 0.005, "unit": "m", "label": "Leave-one-out residual at Adim-7", "expected": -3.47149658203125}, {"key": "adim_pred_at_adim8", "tol": 0.005, "unit": "m", "label": "Seven-well grid prediction at Adim-8", "expected": 1614.8310546875}, {"key": "adim_blind_residual_adim8", "tol": 0.005, "unit": "m", "label": "Blind-test residual at Adim-8", "expected": 3.8310546875}, {"key": "adim_crest_with_adim8", "tol": 0.005, "unit": "m", "label": "Crest depth with Adim-8 included", "expected": 1601.9122314453125}, {"key": "adim_depth_at_prospect_with_adim8_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect with Adim-8 included", "expected": 1603.4613037109375}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'mapping' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5a mapping refused: mapping/advanced matches neither its post-W1 form (prompt md5 a7faf6ea15ea17f1aca6dfc26b2decd3) nor its W5 form (prompt md5 1e63354d776d6b51b4bcedcc23d796b2), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5a mapping: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'mapping' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'mapping/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'mapping/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a mapping refused: mapping/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a mapping: mapping/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a mapping refused: mapping/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'mapping' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'mapping/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'mapping/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a mapping refused: mapping/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a mapping: mapping/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a mapping refused: mapping/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'mapping' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'mapping/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'mapping/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a mapping refused: mapping/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a mapping: mapping/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a mapping refused: mapping/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Map the ADIM TOP_SAND surface. The wells, as name, x, y, TOP_SAND MD, BASE_SAND MD (one per line in the panel''s Type a well set box): Adim-1, 800, 900, 1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3, 1300, 1850, 1605, 1638; Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700, 1618, 1650; Adim-6, 1700, 1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642. Grid TOP_SAND on a 75 m cell with the course''s two-cell pad and 800 m extrapolation limit, and read the map explorer (it opens on the Ekene wells, which are the teaching case): report the grid width and height in nodes, how many nodes were mapped, the crest depth, the depth at the prospect at (1500, 1900), and the mean mapped depth.',
           title = 'Map the ADIM TOP_SAND surface',
           dataset = 'mapping/ADIM wells (W5 re-case; every well is stated in the brief)',
           fields = '[{"key": "adim_grid_nx", "tol": 0.0, "unit": "nodes", "label": "Grid width", "expected": 32}, {"key": "adim_grid_ny", "tol": 0.0, "unit": "nodes", "label": "Grid height", "expected": 24}, {"key": "adim_live_nodes", "tol": 0.0, "unit": "count", "label": "Mapped (live) grid nodes", "expected": 305}, {"key": "adim_crest_depth_m", "tol": 0.005, "unit": "m", "label": "Crest (shallowest) depth", "expected": 1601.9686279296875}, {"key": "adim_depth_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect", "expected": 1604.5677490234373}, {"key": "adim_mean_depth_m", "tol": 0.005, "unit": "m", "label": "Mean mapped depth", "expected": 1613.4646856589395}]'::jsonb
     where app_slug = 'mapping' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a mapping refused: mapping/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '86d9e1cfb755b088f64370887d8b3149' and md5(coalesce(title, '')) = '7bc60b7787a72c23276305c85133efc2' and md5(coalesce(dataset, '')) = 'b4b559776ed8d835186b80bc82081de9' and fields = '[{"key": "adim_grid_nx", "tol": 0.0, "unit": "nodes", "label": "Grid width", "expected": 32}, {"key": "adim_grid_ny", "tol": 0.0, "unit": "nodes", "label": "Grid height", "expected": 24}, {"key": "adim_live_nodes", "tol": 0.0, "unit": "count", "label": "Mapped (live) grid nodes", "expected": 305}, {"key": "adim_crest_depth_m", "tol": 0.005, "unit": "m", "label": "Crest (shallowest) depth", "expected": 1601.9686279296875}, {"key": "adim_depth_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect", "expected": 1604.5677490234373}, {"key": "adim_mean_depth_m", "tol": 0.005, "unit": "m", "label": "Mean mapped depth", "expected": 1613.4646856589395}]'::jsonb) from public.academy_capstones where app_slug = 'mapping' and tier = 'beginner' and active) is not true then
    raise exception 'w5a mapping refused: mapping/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Grid both ADIM SAND surfaces on a 75 m cell (two-cell pad, 800 m extrapolation limit) and subtract them into an isochore. The wells, as name, x, y, TOP_SAND MD, BASE_SAND MD (one per line in the panel''s Type a well set box): Adim-1, 800, 900, 1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3, 1300, 1850, 1605, 1638; Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700, 1618, 1650; Adim-6, 1700, 1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642. Read the isochore explorer (it opens on the Ekene wells, which are the teaching case): the isochore minimum, maximum and mean thickness, the thickness at the prospect at (1500, 1900), how many live isochore nodes sit above the plain mean of the seven well thicknesses, and that plain mean itself.',
           title = 'Isochore of the ADIM SAND',
           dataset = 'mapping/ADIM wells, isochore (W5 re-case; every well is stated in the brief)',
           fields = '[{"key": "adim_iso_min_m", "tol": 0.005, "unit": "m", "label": "Isochore minimum thickness", "expected": 28.653076171875}, {"key": "adim_iso_max_m", "tol": 0.005, "unit": "m", "label": "Isochore maximum thickness", "expected": 37.25341796875}, {"key": "adim_iso_mean_m", "tol": 0.005, "unit": "m", "label": "Isochore mean thickness", "expected": 33.869257492315576}, {"key": "adim_iso_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Thickness at the prospect", "expected": 33.89817979600694}, {"key": "adim_iso_nodes_above_well_mean", "tol": 0.0, "unit": "count", "label": "Live isochore nodes above the well mean", "expected": 207}, {"key": "adim_mean_well_thickness_m", "tol": 0.005, "unit": "m", "label": "Mean of the seven well thicknesses", "expected": 32.57142857142857}]'::jsonb
     where app_slug = 'mapping' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a mapping refused: mapping/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'e1357e50d8140a485cd3639a50fe8fb4' and md5(coalesce(title, '')) = '640ae6cd46ea94df84eea2317cdd1f30' and md5(coalesce(dataset, '')) = 'de8925d900163f0ffecf312badc89252' and fields = '[{"key": "adim_iso_min_m", "tol": 0.005, "unit": "m", "label": "Isochore minimum thickness", "expected": 28.653076171875}, {"key": "adim_iso_max_m", "tol": 0.005, "unit": "m", "label": "Isochore maximum thickness", "expected": 37.25341796875}, {"key": "adim_iso_mean_m", "tol": 0.005, "unit": "m", "label": "Isochore mean thickness", "expected": 33.869257492315576}, {"key": "adim_iso_at_prospect_m", "tol": 0.005, "unit": "m", "label": "Thickness at the prospect", "expected": 33.89817979600694}, {"key": "adim_iso_nodes_above_well_mean", "tol": 0.0, "unit": "count", "label": "Live isochore nodes above the well mean", "expected": 207}, {"key": "adim_mean_well_thickness_m", "tol": 0.005, "unit": "m", "label": "Mean of the seven well thicknesses", "expected": 32.57142857142857}]'::jsonb) from public.academy_capstones where app_slug = 'mapping' and tier = 'intermediate' and active) is not true then
    raise exception 'w5a mapping refused: mapping/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Validate the ADIM TOP_SAND grid on a 100 m cell (two-cell pad, 800 m extrapolation limit). The wells, as name, x, y, TOP_SAND MD, BASE_SAND MD (one per line in the panel''s Type a well set box): Adim-1, 800, 900, 1612, 1641; Adim-2, 2100, 1000, 1630, 1666; Adim-3, 1300, 1850, 1605, 1638; Adim-4, 2500, 2300, 1648, 1676; Adim-5, 500, 1700, 1618, 1650; Adim-6, 1700, 1600, 1603, 1640; Adim-7, 1150, 1400, 1609, 1642. Cross-validate by leave-one-out: only wells inside the control hull can be validated, because the gridder masks to the hull. Report how many wells that is and the residual at Adim-7 (predicted minus actual). Then blind-test the appraisal well Adim-8 at (1900, 2000), actual pick 1611 m: the seven-well grid prediction there, its residual, and the crest and the depth at the prospect at (1500, 1900) after regridding with Adim-8 included. Type the case into the validation explorer (it opens on the Ekene wells, which are the teaching case).',
           title = 'Validate the ADIM TOP_SAND grid',
           dataset = 'mapping/ADIM wells, validation (W5 re-case; every well is stated in the brief)',
           fields = '[{"key": "adim_cross_validatable_wells", "tol": 0.0, "unit": "count", "label": "Wells that can be cross-validated", "expected": 3}, {"key": "adim_loo_resid_adim7", "tol": 0.005, "unit": "m", "label": "Leave-one-out residual at Adim-7", "expected": -3.47149658203125}, {"key": "adim_pred_at_adim8", "tol": 0.005, "unit": "m", "label": "Seven-well grid prediction at Adim-8", "expected": 1614.8310546875}, {"key": "adim_blind_residual_adim8", "tol": 0.005, "unit": "m", "label": "Blind-test residual at Adim-8", "expected": 3.8310546875}, {"key": "adim_crest_with_adim8", "tol": 0.005, "unit": "m", "label": "Crest depth with Adim-8 included", "expected": 1601.9122314453125}, {"key": "adim_depth_at_prospect_with_adim8_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect with Adim-8 included", "expected": 1603.4613037109375}]'::jsonb
     where app_slug = 'mapping' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a mapping refused: mapping/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '1e63354d776d6b51b4bcedcc23d796b2' and md5(coalesce(title, '')) = '891b938d1ffc7c8db7b05da7827cb1f2' and md5(coalesce(dataset, '')) = 'a2cc58a3908035b69edc0fce95cab5b7' and fields = '[{"key": "adim_cross_validatable_wells", "tol": 0.0, "unit": "count", "label": "Wells that can be cross-validated", "expected": 3}, {"key": "adim_loo_resid_adim7", "tol": 0.005, "unit": "m", "label": "Leave-one-out residual at Adim-7", "expected": -3.47149658203125}, {"key": "adim_pred_at_adim8", "tol": 0.005, "unit": "m", "label": "Seven-well grid prediction at Adim-8", "expected": 1614.8310546875}, {"key": "adim_blind_residual_adim8", "tol": 0.005, "unit": "m", "label": "Blind-test residual at Adim-8", "expected": 3.8310546875}, {"key": "adim_crest_with_adim8", "tol": 0.005, "unit": "m", "label": "Crest depth with Adim-8 included", "expected": 1601.9122314453125}, {"key": "adim_depth_at_prospect_with_adim8_m", "tol": 0.005, "unit": "m", "label": "Depth at the prospect with Adim-8 included", "expected": 1603.4613037109375}]'::jsonb) from public.academy_capstones where app_slug = 'mapping' and tier = 'advanced' and active) is not true then
    raise exception 'w5a mapping refused: mapping/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5a mapping: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
