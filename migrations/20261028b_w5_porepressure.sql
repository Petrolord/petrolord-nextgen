-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): porepressure.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/porepressure.json. The new
-- keys come from docs/graded-field-audit/w5b/porepressure.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The walkthrough printed all six answers and the frame explorer opened on the
--   golden well at TD. Re-cased on an appraisal setting of the same logs (250 m
--   of water, pore fluid 1040 kg/m3, and per tier the fit matrix, exponent,
--   threshold, Poisson ratio and Bowers inputs), which the learner types.
--   hydro_td_mpa (41.408579625, tol 0.01)
--       -> hydro_td_mpa 'Hydrostatic pressure at TD' MPa, expected 43.3086180625, tol 0.01
--   ob_td_mpa (91.12306695073282, tol 0.01)
--       -> ob_td_mpa 'Overburden stress at TD' MPa, expected 92.63083938823286, tol 0.01
--   gardner_rho (1960.612149304395, tol 0.5)
--       -> gardner_rho 'Gardner density at 1750 m/s' kg/m3, expected 2005.0315278060425, tol 0.5
--   nct_2500 (317.2847498247154, tol 0.5)
--       -> nct_case_depth 'NCT transit time at 2750 m' us/m, expected 303.7337601586488, tol 0.5
--   fit_dtml (650.0000000000014, tol 0.5)
--       -> fit_dtml 'Fitted NCT mudline transit time' us/m, expected 634.6745981683341, tol 0.5
--   fit_c_per_km (0.7000000000000015, tol 0.005)
--       -> fit_c_per_km 'Fitted compaction constant' 1/km, expected 0.6385297904636702, tol 0.005
--   DATASET was: porepressure/goldens (synthetic well + NCT picks)
--   DATASET now: porepressure/golden logs, 250 m water setting
--   PROMPT now: The same logs are re-used for an appraisal location in deeper
--   water: 250 m of seawater (1025 kg/m3) over the same 4000 m below-mudline
--   section, with a pore fluid of 1040 kg/m3. Type that setting into the frame
--   explorer (it opens on the golden well's header) and report hydrostatic and
--   overburden at TD, the Gardner density a sonic-only interval would use at
--   1750 m/s, the normal-compaction transit time at 2750 m on the well's trend
--   (656/220/0.0006), and the exact least-squares NCT fit through the twelve
--   shale picks with a matrix transit time of 210 us/m.
--
-- INTERMEDIATE: pick A (re-case)
--   The walkthrough printed all six answers and the Eaton explorer opened on the
--   n = 3 prognosis. Re-cased on an appraisal setting of the same logs (250 m of
--   water, pore fluid 1040 kg/m3, and per tier the fit matrix, exponent,
--   threshold, Poisson ratio and Bowers inputs), which the learner types.
--   onset_m (2520, tol 0)
--       -> onset_m 'Overpressure onset depth (0.25 MPa threshold)' m bml, expected 2590, tol 0.0
--   dtn_td (259.5530276341839, tol 0.5)
--       -> budget_td_mpa 'Overburden minus hydrostatic at TD' MPa, expected 49.322221325732855, tol 0.01
--   pp_3000_mpa (33.307730125, tol 0.01)
--       -> pp_3000_mpa 'Pore pressure at 3000 m' MPa, expected 34.57540894296633, tol 0.01
--   pp_td_mpa (47.408579625, tol 0.01)
--       -> pp_td_mpa 'Pore pressure at TD' MPa, expected 47.74799153175756, tol 0.01
--   op_td_mpa (6, tol 0.01)
--       -> op_td_mpa 'Overpressure at TD' MPa, expected 4.439373469257563, tol 0.01
--   fp_td_mpa (76.55157117548856, tol 0.01)
--       -> fp_td_mpa 'Fracture pressure at TD' MPa, expected 71.9156788390904, tol 0.01
--   DATASET was: porepressure/goldens (full Eaton prognosis)
--   DATASET now: porepressure/golden logs, Eaton n 2.2 setting
--   PROMPT now: Run the full pipeline over the same sonic and density logs at
--   the appraisal setting: 250 m of water, pore fluid 1040 kg/m3, Eaton n = 2.2
--   on the well's own NCT (656/220/0.0006) and coefficient-form fracture
--   pressure with Poisson's ratio 0.35. Type the setting into the Eaton explorer
--   (it opens on the golden well's header) and report the overpressure onset
--   (the first sample more than 0.25 MPa above hydrostatic), the overburden
--   minus hydrostatic at TD, pore pressure at 3000 m and at TD, the overpressure
--   at TD, and fracture pressure at TD.
--
-- ADVANCED: pick A (re-case)
--   The walkthrough printed all six answers and the window explorer opened on
--   the n = 3 window with the golden Bowers pair. Re-cased on an appraisal
--   setting of the same logs (250 m of water, pore fluid 1040 kg/m3, and per
--   tier the fit matrix, exponent, threshold, Poisson ratio and Bowers inputs),
--   which the learner types.
--   pp_emw_td (1179.1048116553065, tol 0.5)
--       -> pp_emw_td 'Pore pressure as EMW at TD' kg/m3, expected 1145.6329671074357, tol 0.5
--   fp_emw_td (1903.9238599165737, tol 0.5)
--       -> fp_emw_td 'Fracture pressure as EMW at TD' kg/m3, expected 1725.4960865772755, tol 0.5
--   window_td (724.8190482612672, tol 0.5)
--       -> window_td 'Mud-weight window at TD' kg/m3, expected 579.8631194698398, tol 0.5
--   bowers_v_5mpa (1949.944709834568, tol 0.5)
--       -> bowers_v_case 'Bowers loading velocity at 8 MPa' m/s, expected 2063.3848832274025, tol 0.5
--   bowers_sigma_mpa (10, tol 0.01)
--       -> bowers_sigma_mpa 'Bowers unloading stress at 2900 m/s' MPa, expected 10.113305897648297, tol 0.01
--   pp_td_n12_mpa (43.901549937778526, tol 0.01)
--       -> pp_td_alt_n_mpa 'Pore pressure at TD with n = 1.5' MPa, expected 46.38061545588117, tol 0.01
--   DATASET was: porepressure/goldens (mud window + Bowers)
--   DATASET now: porepressure/golden logs, mud window n 2.2 + Bowers 11/0.72
--   PROMPT now: Turn the appraisal prognosis (250 m of water, pore fluid 1040
--   kg/m3, Eaton n = 2.2, Poisson's ratio 0.35) into drilling numbers:
--   equivalent mud weight referenced to sea level (P divided by g times
--   depth-below-mudline plus water depth) for pore and fracture pressure at TD,
--   and the window between them. Cross-check the physics with Bowers (A 11, B
--   0.72): the loading velocity at 8 MPa effective stress, and the effective
--   stress the unloading form (sigma_max 45 MPa, U 3.5) reads from 2900 m/s.
--   Then probe the calibration lever: pore pressure at TD with Eaton n = 1.5.
--   Type all of it into the window explorer, which opens on the teaching case.
--
-- ATTEMPTS. Tiers whose graded keys move: porepressure/beginner,
-- porepressure/intermediate, porepressure/advanced. Before it writes, the file
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
  -- porepressure / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'porepressure' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b porepressure refused: porepressure/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '5a54f1b778a0fd58ee037e651fc66ee6' and md5(coalesce(title, '')) = '7f1984b1cf4ff5e858f1094555c08349' and md5(coalesce(dataset, '')) = '55bf141ec1eff00f0e260a6457abd0fa' and fields = '[{"key": "hydro_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Hydrostatic pressure at TD", "expected": 41.408579625}, {"key": "ob_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden stress at TD", "expected": 91.12306695073282}, {"key": "gardner_rho", "tol": 0.5, "unit": "kg/m3", "label": "Gardner density at 1600 m/s", "expected": 1960.612149304395}, {"key": "nct_2500", "tol": 0.5, "unit": "us/m", "label": "NCT transit time at 2500 m", "expected": 317.2847498247154}, {"key": "fit_dtml", "tol": 0.5, "unit": "us/m", "label": "Fitted NCT mudline transit time", "expected": 650.0000000000014}, {"key": "fit_c_per_km", "tol": 0.005, "unit": "1/km", "label": "Fitted compaction constant", "expected": 0.7000000000000015}]'::jsonb then 'old'
              when md5(prompt) = '25094958f97d3d70344f9381b989b2f2' and md5(coalesce(title, '')) = '7f1984b1cf4ff5e858f1094555c08349' and md5(coalesce(dataset, '')) = '6b09f5c7b8948b8ad9a4014230a2b69a' and fields = '[{"key": "hydro_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Hydrostatic pressure at TD", "expected": 43.3086180625}, {"key": "ob_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden stress at TD", "expected": 92.63083938823286}, {"key": "gardner_rho", "tol": 0.5, "unit": "kg/m3", "label": "Gardner density at 1750 m/s", "expected": 2005.0315278060425}, {"key": "nct_case_depth", "tol": 0.5, "unit": "us/m", "label": "NCT transit time at 2750 m", "expected": 303.7337601586488}, {"key": "fit_dtml", "tol": 0.5, "unit": "us/m", "label": "Fitted NCT mudline transit time", "expected": 634.6745981683341}, {"key": "fit_c_per_km", "tol": 0.005, "unit": "1/km", "label": "Fitted compaction constant", "expected": 0.6385297904636702}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'porepressure' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b porepressure refused: porepressure/beginner matches neither its post-W1 form (prompt md5 5a54f1b778a0fd58ee037e651fc66ee6) nor its W5 form (prompt md5 25094958f97d3d70344f9381b989b2f2), with the fields this file was generated against';
  end if;

  -- porepressure / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'porepressure' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b porepressure refused: porepressure/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'd3429a6bfebb24bbf86b33d7acaea0bd' and md5(coalesce(title, '')) = '64cccfac9b67cccea9877fa9fd378e6a' and md5(coalesce(dataset, '')) = '9a19615dbc8e49462d3732d6a791eb20' and fields = '[{"key": "onset_m", "tol": 0, "unit": "m bml", "label": "Overpressure onset depth", "expected": 2520}, {"key": "dtn_td", "tol": 0.5, "unit": "us/m", "label": "NCT transit time at TD", "expected": 259.5530276341839}, {"key": "pp_3000_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at 3000 m", "expected": 33.307730125}, {"key": "pp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD", "expected": 47.408579625}, {"key": "op_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overpressure at TD", "expected": 6}, {"key": "fp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Fracture pressure at TD", "expected": 76.55157117548856}]'::jsonb then 'old'
              when md5(prompt) = 'c68b207716b954413ac062970139fdbe' and md5(coalesce(title, '')) = '64cccfac9b67cccea9877fa9fd378e6a' and md5(coalesce(dataset, '')) = '1b5b2417e0db23683a17f5dfa2ea294e' and fields = '[{"key": "onset_m", "tol": 0.0, "unit": "m bml", "label": "Overpressure onset depth (0.25 MPa threshold)", "expected": 2590}, {"key": "budget_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden minus hydrostatic at TD", "expected": 49.322221325732855}, {"key": "pp_3000_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at 3000 m", "expected": 34.57540894296633}, {"key": "pp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD", "expected": 47.74799153175756}, {"key": "op_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overpressure at TD", "expected": 4.439373469257563}, {"key": "fp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Fracture pressure at TD", "expected": 71.9156788390904}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'porepressure' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b porepressure refused: porepressure/intermediate matches neither its post-W1 form (prompt md5 d3429a6bfebb24bbf86b33d7acaea0bd) nor its W5 form (prompt md5 c68b207716b954413ac062970139fdbe), with the fields this file was generated against';
  end if;

  -- porepressure / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'porepressure' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b porepressure refused: porepressure/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '4e6a35b11d2f999b38595707bcead8dc' and md5(coalesce(title, '')) = 'd0b8e7660508c2052150912d665c0f75' and md5(coalesce(dataset, '')) = '1f84616dd7fa0b25c5c12a8f2545ebd8' and fields = '[{"key": "pp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Pore pressure as EMW at TD", "expected": 1179.1048116553065}, {"key": "fp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Fracture pressure as EMW at TD", "expected": 1903.9238599165737}, {"key": "window_td", "tol": 0.5, "unit": "kg/m3", "label": "Mud-weight window at TD", "expected": 724.8190482612672}, {"key": "bowers_v_5mpa", "tol": 0.5, "unit": "m/s", "label": "Bowers loading velocity at 5 MPa", "expected": 1949.944709834568}, {"key": "bowers_sigma_mpa", "tol": 0.01, "unit": "MPa", "label": "Bowers unloading stress at 3125.8 m/s", "expected": 10}, {"key": "pp_td_n12_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD with n = 1.2", "expected": 43.901549937778526}]'::jsonb then 'old'
              when md5(prompt) = '1db7503c52505da0d5882a8df685552b' and md5(coalesce(title, '')) = 'd0b8e7660508c2052150912d665c0f75' and md5(coalesce(dataset, '')) = 'c22e870bfadf5110c8f914046419007f' and fields = '[{"key": "pp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Pore pressure as EMW at TD", "expected": 1145.6329671074357}, {"key": "fp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Fracture pressure as EMW at TD", "expected": 1725.4960865772755}, {"key": "window_td", "tol": 0.5, "unit": "kg/m3", "label": "Mud-weight window at TD", "expected": 579.8631194698398}, {"key": "bowers_v_case", "tol": 0.5, "unit": "m/s", "label": "Bowers loading velocity at 8 MPa", "expected": 2063.3848832274025}, {"key": "bowers_sigma_mpa", "tol": 0.01, "unit": "MPa", "label": "Bowers unloading stress at 2900 m/s", "expected": 10.113305897648297}, {"key": "pp_td_alt_n_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD with n = 1.5", "expected": 46.38061545588117}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'porepressure' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b porepressure refused: porepressure/advanced matches neither its post-W1 form (prompt md5 4e6a35b11d2f999b38595707bcead8dc) nor its W5 form (prompt md5 1db7503c52505da0d5882a8df685552b), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b porepressure: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'porepressure' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'porepressure/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'porepressure/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b porepressure refused: porepressure/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b porepressure: porepressure/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b porepressure refused: porepressure/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'porepressure' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'porepressure/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'porepressure/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b porepressure refused: porepressure/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b porepressure: porepressure/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b porepressure refused: porepressure/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'porepressure' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'porepressure/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'porepressure/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b porepressure refused: porepressure/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b porepressure: porepressure/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b porepressure refused: porepressure/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'The same logs are re-used for an appraisal location in deeper water: 250 m of seawater (1025 kg/m3) over the same 4000 m below-mudline section, with a pore fluid of 1040 kg/m3. Type that setting into the frame explorer (it opens on the golden well''s header) and report hydrostatic and overburden at TD, the Gardner density a sonic-only interval would use at 1750 m/s, the normal-compaction transit time at 2750 m on the well''s trend (656/220/0.0006), and the exact least-squares NCT fit through the twelve shale picks with a matrix transit time of 210 us/m.',
           title = 'The pressure frame of the synthetic well',
           dataset = 'porepressure/golden logs, 250 m water setting',
           fields = '[{"key": "hydro_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Hydrostatic pressure at TD", "expected": 43.3086180625}, {"key": "ob_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden stress at TD", "expected": 92.63083938823286}, {"key": "gardner_rho", "tol": 0.5, "unit": "kg/m3", "label": "Gardner density at 1750 m/s", "expected": 2005.0315278060425}, {"key": "nct_case_depth", "tol": 0.5, "unit": "us/m", "label": "NCT transit time at 2750 m", "expected": 303.7337601586488}, {"key": "fit_dtml", "tol": 0.5, "unit": "us/m", "label": "Fitted NCT mudline transit time", "expected": 634.6745981683341}, {"key": "fit_c_per_km", "tol": 0.005, "unit": "1/km", "label": "Fitted compaction constant", "expected": 0.6385297904636702}]'::jsonb
     where app_slug = 'porepressure' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b porepressure refused: porepressure/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '25094958f97d3d70344f9381b989b2f2' and md5(coalesce(title, '')) = '7f1984b1cf4ff5e858f1094555c08349' and md5(coalesce(dataset, '')) = '6b09f5c7b8948b8ad9a4014230a2b69a' and fields = '[{"key": "hydro_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Hydrostatic pressure at TD", "expected": 43.3086180625}, {"key": "ob_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden stress at TD", "expected": 92.63083938823286}, {"key": "gardner_rho", "tol": 0.5, "unit": "kg/m3", "label": "Gardner density at 1750 m/s", "expected": 2005.0315278060425}, {"key": "nct_case_depth", "tol": 0.5, "unit": "us/m", "label": "NCT transit time at 2750 m", "expected": 303.7337601586488}, {"key": "fit_dtml", "tol": 0.5, "unit": "us/m", "label": "Fitted NCT mudline transit time", "expected": 634.6745981683341}, {"key": "fit_c_per_km", "tol": 0.005, "unit": "1/km", "label": "Fitted compaction constant", "expected": 0.6385297904636702}]'::jsonb) from public.academy_capstones where app_slug = 'porepressure' and tier = 'beginner' and active) is not true then
    raise exception 'w5b porepressure refused: porepressure/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Run the full pipeline over the same sonic and density logs at the appraisal setting: 250 m of water, pore fluid 1040 kg/m3, Eaton n = 2.2 on the well''s own NCT (656/220/0.0006) and coefficient-form fracture pressure with Poisson''s ratio 0.35. Type the setting into the Eaton explorer (it opens on the golden well''s header) and report the overpressure onset (the first sample more than 0.25 MPa above hydrostatic), the overburden minus hydrostatic at TD, pore pressure at 3000 m and at TD, the overpressure at TD, and fracture pressure at TD.',
           title = 'Eaton prognosis on the golden sonic',
           dataset = 'porepressure/golden logs, Eaton n 2.2 setting',
           fields = '[{"key": "onset_m", "tol": 0.0, "unit": "m bml", "label": "Overpressure onset depth (0.25 MPa threshold)", "expected": 2590}, {"key": "budget_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden minus hydrostatic at TD", "expected": 49.322221325732855}, {"key": "pp_3000_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at 3000 m", "expected": 34.57540894296633}, {"key": "pp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD", "expected": 47.74799153175756}, {"key": "op_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overpressure at TD", "expected": 4.439373469257563}, {"key": "fp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Fracture pressure at TD", "expected": 71.9156788390904}]'::jsonb
     where app_slug = 'porepressure' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b porepressure refused: porepressure/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'c68b207716b954413ac062970139fdbe' and md5(coalesce(title, '')) = '64cccfac9b67cccea9877fa9fd378e6a' and md5(coalesce(dataset, '')) = '1b5b2417e0db23683a17f5dfa2ea294e' and fields = '[{"key": "onset_m", "tol": 0.0, "unit": "m bml", "label": "Overpressure onset depth (0.25 MPa threshold)", "expected": 2590}, {"key": "budget_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overburden minus hydrostatic at TD", "expected": 49.322221325732855}, {"key": "pp_3000_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at 3000 m", "expected": 34.57540894296633}, {"key": "pp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD", "expected": 47.74799153175756}, {"key": "op_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Overpressure at TD", "expected": 4.439373469257563}, {"key": "fp_td_mpa", "tol": 0.01, "unit": "MPa", "label": "Fracture pressure at TD", "expected": 71.9156788390904}]'::jsonb) from public.academy_capstones where app_slug = 'porepressure' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b porepressure refused: porepressure/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Turn the appraisal prognosis (250 m of water, pore fluid 1040 kg/m3, Eaton n = 2.2, Poisson''s ratio 0.35) into drilling numbers: equivalent mud weight referenced to sea level (P divided by g times depth-below-mudline plus water depth) for pore and fracture pressure at TD, and the window between them. Cross-check the physics with Bowers (A 11, B 0.72): the loading velocity at 8 MPa effective stress, and the effective stress the unloading form (sigma_max 45 MPa, U 3.5) reads from 2900 m/s. Then probe the calibration lever: pore pressure at TD with Eaton n = 1.5. Type all of it into the window explorer, which opens on the teaching case.',
           title = 'The mud-weight window at TD',
           dataset = 'porepressure/golden logs, mud window n 2.2 + Bowers 11/0.72',
           fields = '[{"key": "pp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Pore pressure as EMW at TD", "expected": 1145.6329671074357}, {"key": "fp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Fracture pressure as EMW at TD", "expected": 1725.4960865772755}, {"key": "window_td", "tol": 0.5, "unit": "kg/m3", "label": "Mud-weight window at TD", "expected": 579.8631194698398}, {"key": "bowers_v_case", "tol": 0.5, "unit": "m/s", "label": "Bowers loading velocity at 8 MPa", "expected": 2063.3848832274025}, {"key": "bowers_sigma_mpa", "tol": 0.01, "unit": "MPa", "label": "Bowers unloading stress at 2900 m/s", "expected": 10.113305897648297}, {"key": "pp_td_alt_n_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD with n = 1.5", "expected": 46.38061545588117}]'::jsonb
     where app_slug = 'porepressure' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b porepressure refused: porepressure/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '1db7503c52505da0d5882a8df685552b' and md5(coalesce(title, '')) = 'd0b8e7660508c2052150912d665c0f75' and md5(coalesce(dataset, '')) = 'c22e870bfadf5110c8f914046419007f' and fields = '[{"key": "pp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Pore pressure as EMW at TD", "expected": 1145.6329671074357}, {"key": "fp_emw_td", "tol": 0.5, "unit": "kg/m3", "label": "Fracture pressure as EMW at TD", "expected": 1725.4960865772755}, {"key": "window_td", "tol": 0.5, "unit": "kg/m3", "label": "Mud-weight window at TD", "expected": 579.8631194698398}, {"key": "bowers_v_case", "tol": 0.5, "unit": "m/s", "label": "Bowers loading velocity at 8 MPa", "expected": 2063.3848832274025}, {"key": "bowers_sigma_mpa", "tol": 0.01, "unit": "MPa", "label": "Bowers unloading stress at 2900 m/s", "expected": 10.113305897648297}, {"key": "pp_td_alt_n_mpa", "tol": 0.01, "unit": "MPa", "label": "Pore pressure at TD with n = 1.5", "expected": 46.38061545588117}]'::jsonb) from public.academy_capstones where app_slug = 'porepressure' and tier = 'advanced' and active) is not true then
    raise exception 'w5b porepressure refused: porepressure/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b porepressure: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
