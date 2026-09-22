-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): fluid.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/fluid.json. The new
-- keys come from docs/graded-field-audit/w5b/fluid.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The story-so-far and working lessons printed every answer and the
--   correlation explorer opened on the Ekene oil. Re-cased on a stated second
--   oil the learner types.
--   ekene_pb_standing_psia (1912.1923059028293, tol 0.05)
--       -> ekene_pb_standing_psia 'Standing bubble point at 480 scf/stb' psia, expected 2300.0408722832944, tol 0.05
--   ekene_bo_at_designed_rs (1.2407824121407645, tol 0.0005)
--       -> ekene_bo_at_designed_rs 'Standing saturated Bo at 480 scf/stb' rb/stb, expected 1.283936228388159, tol 0.0005
--   ekene_muod_beal_cp (2.3437444714709295, tol 0.0005)
--       -> ekene_muod_beal_cp 'Beal dead oil viscosity' cp, expected 1.5460324253882518, tol 0.0005
--   ekene_z_hy_at_pi (0.8577529684232971, tol 0.0005)
--       -> ekene_z_hy_at_pi 'Hall-Yarborough z at 3600 psia' -, expected 0.9052822188344655, tol 0.0005
--   ekene_bg_at_pi_rb_scf (0.0008633118643757966, tol 5E-7)
--       -> ekene_bg_at_pi_rb_scf 'Gas FVF at 3600 psia' rb/scf, expected 0.0008289024138552641, tol 5e-07
--   ekene_z_correlation_gap_pct (-0.3303055462323185, tol 0.002)
--       -> ekene_z_correlation_gap_pct 'z disagreement, HY against DAK' percent, expected -0.28438199270689335, tol 0.002
--   DATASET was: the designed Ekene fluid (32 API, gas gravity 0.75, 180 F,
--   bubble point 2000 psia, initial pressure 3200 psia, 400 scf/stb)
--   DATASET now: a stated black oil (34 API, gas gravity 0.70, 195 F, 480
--   scf/stb, initial pressure 3600 psia)
--   PROMPT now: Produce a black-oil description of a second fluid from the Ekene
--   field from the correlations the engine carries. The fluid is 34 API with a
--   gas gravity of 0.70 at a reservoir temperature of 195 F, its designed bubble
--   point is 2400 psia, its designed solution gas ratio is 480 scf/stb and its
--   initial pressure is 3600 psia. Report the bubble point Standing's
--   correlation returns for the DESIGNED 480 scf/stb; the SATURATED formation
--   volume factor Standing returns at that same designed solution gas ratio,
--   with no undersaturated correction applied; the dead oil viscosity Beal's
--   correlation returns, with no dissolved gas in it; the gas z factor
--   Hall-Yarborough returns at the INITIAL pressure of 3600 psia on Sutton
--   pseudo-criticals; the gas formation volume factor at that pressure on that
--   same z; and the percentage by which the Hall-Yarborough z differs from the
--   Dranchuk-Abou-Kassem z at the same state, taken relative to
--   Dranchuk-Abou-Kassem. The correlation explorer opens on the Ekene oil; type
--   this fluid in.
--
-- INTERMEDIATE: pick A (re-case)
--   The lessons printed every answer and the study explorer opened on the 100
--   psig test at 220 F. Re-cased on the 200 psig separator test, a saturation
--   temperature of 180 F and a stated plus-fraction sensitivity; the
--   saturation-pressure bias against the lab becomes the GOR bias, because the
--   lab measured the bubble point at 220 F only.
--   good_oil_c7plus_tc_r (1324.2385574932478, tol 0.05)
--       -> plus_tc_r 'Plus-fraction critical temperature, stated MW and SG' degR, expected 1295.7891123916502, tol 0.05
--   good_oil_untuned_psat_psia (2791.100735294379, tol 0.5)
--       -> untuned_psat_case_psia 'Untuned saturation pressure at the stated temperature' psia, expected 2637.752970132605, tol 0.5
--   good_oil_psat_bias_pct (5.938198064045652, tol 0.02)
--       -> gor_bias_pct 'Untuned total GOR above the lab value' percent, expected 2.978994905404897, tol 0.02
--   good_oil_untuned_gor_scf_stb (793.8042771796476, tol 1)
--       -> good_oil_untuned_gor_scf_stb 'Untuned total gas-oil ratio' scf/stb, expected 803.2361602621583, tol 1.0
--   good_oil_untuned_sto_api (31.8056416463794, tol 0.05)
--       -> good_oil_untuned_sto_api 'Untuned stock tank gravity' API, expected 31.581245628852542, tol 0.05
--   good_oil_api_bias (-8.894358353620603, tol 0.05)
--       -> good_oil_api_bias 'Gravity minus the lab value' API, expected -8.818754371147456, tol 0.05
--   DATASET was: Good Oil Co. Well No. 4, Core Laboratories RFL 88001 (11
--   components, C7+ MW 218 / SG 0.8515, 220 F, bubble point 2634.65 psia)
--   DATASET now: Good Oil Co. Well No. 4, 200 psig separator test; saturation at
--   180 F; a stated C7+ (MW 205, SG 0.840)
--   PROMPT now: Run an untuned Peng-Robinson model against a published
--   laboratory study and quantify the gaps on a read of your own. The fluid is
--   Good Oil Co. Well No. 4 as Core Laboratories reported it: eleven components
--   with a C7+ fraction of molecular weight 218 and specific gravity 0.8515, at
--   a reservoir temperature of 220 F and a measured bubble point of 2634.65
--   psia. Use its separator test at 200 psig and 75 F, which is 214.65 psia, to
--   a stock tank at 14.65 psia and 75 F; that test measured a total gas-oil
--   ratio of 780 scf/stb and a stock tank gravity of 40.4 API. First
--   characterize a heavier-cut plus fraction of molecular weight 205 and
--   specific gravity 0.840, as a sensitivity, and report the critical
--   temperature it is given in degrees Rankine. Then run the model on the
--   REPORTED composition, WITHOUT tuning anything and WITH the stock tank stage
--   appended to the separator stage, and report its saturation pressure at 180
--   F; the percentage by which its total gas-oil ratio exceeds the measured 780
--   scf/stb; the total gas-oil ratio the separator train produces; the stock
--   tank gravity it produces; and the difference between that gravity and the
--   laboratory's in API. The study explorer opens on the 100 psig test at 220 F;
--   set this read in.
--
-- ADVANCED: pick A (re-case)
--   The lessons printed every answer and the tuning explorer opened on the 100
--   psig regression. Re-cased on the regression against the 200 psig test; the
--   tuned saturation pressure becomes the tuned Bo, because any regression lands
--   the saturation pressure within a fraction of a psi of the 2634.65 target it
--   fits, which is the teaching answer too.
--   good_oil_tuned_psat_psia (2632.64216695564, tol 0.5)
--       -> good_oil_tuned_bo_rb_stb 'Tuned formation volume factor' rb/stb, expected 1.4621628562343378, tol 0.001
--   good_oil_tuned_gor_scf_stb (761.7262989883229, tol 1)
--       -> good_oil_tuned_gor_scf_stb 'Tuned total gas-oil ratio' scf/stb, expected 773.1821351682468, tol 1.0
--   good_oil_tuned_sto_api (38.755039373806255, tol 0.05)
--       -> good_oil_tuned_sto_api 'Tuned stock tank gravity' API, expected 38.24766599188635, tol 0.05
--   tuned_splus_knob (0.12266364195926757, tol 0.0005)
--       -> tuned_splus_knob 'Tuned C7+ volume shift' -, expected 0.0939927272825379, tol 0.0005
--   tuned_kc1_knob (0.050325447877585576, tol 0.0005)
--       -> tuned_kc1_knob 'Tuned C1 to C7+ interaction parameter' -, expected 0.03999571242790525, tol 0.0005
--   tuning_ssr_reduction (23.157104602764026, tol 0.05)
--       -> tuning_ssr_reduction 'Residual reduction factor' times, expected 16.599912822394707, tol 0.05
--   DATASET was: Good Oil Co. Well No. 4 tuned: four bounded C7+ knobs against
--   four measured targets
--   DATASET now: Good Oil Co. Well No. 4 tuned against the 200 psig separator
--   test
--   PROMPT now: Tune the compositional model to the Good Oil Co. Well No. 4
--   study against its 200 psig separator test and report both the result and its
--   price. Regress the four bounded knobs on the C7+ pseudo-component and
--   NOTHING else, jointly against all four measurements at once: the saturation
--   pressure of 2634.65 psia at 220 F, and the total gas-oil ratio of 780
--   scf/stb, the stock tank gravity of 40.4 API and the formation volume factor
--   of 1.483 rb/stb from the separator test at 214.65 psia and 75 F, with the
--   stock tank stage at 14.65 psia and 75 F appended to it. Report the formation
--   volume factor, the total gas-oil ratio and the stock tank gravity the TUNED
--   model produces; the values the regression lands on for the C7+ volume shift
--   and for the C1 to C7+ binary interaction parameter; and the factor by which
--   the sum of squared residuals falls, being the value before the fit divided
--   by the value after it. Every field asks for a value AFTER the regression.
--   The tuning explorer opens on the 100 psig regression; choose this test.
--
-- ATTEMPTS. Tiers whose graded keys move: fluid/beginner, fluid/intermediate,
-- fluid/advanced. Before it writes, the file counts academy_capstone_attempts
-- on each and REFUSES if any exist, unless D5 allowlists that tier with the
-- exact attempt ids (allowlist: empty). Stored scores are never touched.
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
  -- fluid / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'fluid' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b fluid refused: fluid/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '47748bc1218f0c0462c01ad1c93ad1a9' and md5(coalesce(title, '')) = '2efdd0ff72ed5c132c3e5b11ccde52ac' and md5(coalesce(dataset, '')) = 'f3fae9b4d6c6fe2bad38f06023b189c5' and fields = '[{"key": "ekene_pb_standing_psia", "tol": 0.05, "unit": "psia", "label": "Standing bubble point at 400 scf/stb", "expected": 1912.1923059028293}, {"key": "ekene_bo_at_designed_rs", "tol": 0.0005, "unit": "rb/stb", "label": "Standing saturated Bo at 400 scf/stb", "expected": 1.2407824121407645}, {"key": "ekene_muod_beal_cp", "tol": 0.0005, "unit": "cp", "label": "Beal dead oil viscosity", "expected": 2.3437444714709295}, {"key": "ekene_z_hy_at_pi", "tol": 0.0005, "unit": "-", "label": "Hall-Yarborough z at 3200 psia", "expected": 0.8577529684232971}, {"key": "ekene_bg_at_pi_rb_scf", "tol": 5E-7, "unit": "rb/scf", "label": "Gas FVF at 3200 psia", "expected": 0.0008633118643757966}, {"key": "ekene_z_correlation_gap_pct", "tol": 0.002, "unit": "percent", "label": "z disagreement, HY against DAK", "expected": -0.3303055462323185}]'::jsonb then 'old'
              when md5(prompt) = '0ea41b84dd2adf397fd413c9f64ae75e' and md5(coalesce(title, '')) = '2efdd0ff72ed5c132c3e5b11ccde52ac' and md5(coalesce(dataset, '')) = 'ab288b0dd8230b7ffd6447f753d1e0b0' and fields = '[{"key": "ekene_pb_standing_psia", "tol": 0.05, "unit": "psia", "label": "Standing bubble point at 480 scf/stb", "expected": 2300.0408722832944}, {"key": "ekene_bo_at_designed_rs", "tol": 0.0005, "unit": "rb/stb", "label": "Standing saturated Bo at 480 scf/stb", "expected": 1.283936228388159}, {"key": "ekene_muod_beal_cp", "tol": 0.0005, "unit": "cp", "label": "Beal dead oil viscosity", "expected": 1.5460324253882518}, {"key": "ekene_z_hy_at_pi", "tol": 0.0005, "unit": "-", "label": "Hall-Yarborough z at 3600 psia", "expected": 0.9052822188344655}, {"key": "ekene_bg_at_pi_rb_scf", "tol": 5e-07, "unit": "rb/scf", "label": "Gas FVF at 3600 psia", "expected": 0.0008289024138552641}, {"key": "ekene_z_correlation_gap_pct", "tol": 0.002, "unit": "percent", "label": "z disagreement, HY against DAK", "expected": -0.28438199270689335}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'fluid' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b fluid refused: fluid/beginner matches neither its post-W1 form (prompt md5 47748bc1218f0c0462c01ad1c93ad1a9) nor its W5 form (prompt md5 0ea41b84dd2adf397fd413c9f64ae75e), with the fields this file was generated against';
  end if;

  -- fluid / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'fluid' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b fluid refused: fluid/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '3f7abe6a61283cb6be5c4066abffda2a' and md5(coalesce(title, '')) = '1e2dc11ac195a45b090d2a067be7a119' and md5(coalesce(dataset, '')) = '7405f3b4bfaed38c3312a86c887dcd3f' and fields = '[{"key": "good_oil_c7plus_tc_r", "tol": 0.05, "unit": "degR", "label": "C7+ critical temperature", "expected": 1324.2385574932478}, {"key": "good_oil_untuned_psat_psia", "tol": 0.5, "unit": "psia", "label": "Untuned saturation pressure", "expected": 2791.100735294379}, {"key": "good_oil_psat_bias_pct", "tol": 0.02, "unit": "percent", "label": "Saturation pressure above the lab value", "expected": 5.938198064045652}, {"key": "good_oil_untuned_gor_scf_stb", "tol": 1, "unit": "scf/stb", "label": "Untuned total gas-oil ratio", "expected": 793.8042771796476}, {"key": "good_oil_untuned_sto_api", "tol": 0.05, "unit": "API", "label": "Untuned stock tank gravity", "expected": 31.8056416463794}, {"key": "good_oil_api_bias", "tol": 0.05, "unit": "API", "label": "Gravity minus the lab value", "expected": -8.894358353620603}]'::jsonb then 'old'
              when md5(prompt) = 'd25fbaf2de03660ce46359922e9e4a37' and md5(coalesce(title, '')) = '1e2dc11ac195a45b090d2a067be7a119' and md5(coalesce(dataset, '')) = '11649d72fa7f5f61437943e8f29604d4' and fields = '[{"key": "plus_tc_r", "tol": 0.05, "unit": "degR", "label": "Plus-fraction critical temperature, stated MW and SG", "expected": 1295.7891123916502}, {"key": "untuned_psat_case_psia", "tol": 0.5, "unit": "psia", "label": "Untuned saturation pressure at the stated temperature", "expected": 2637.752970132605}, {"key": "gor_bias_pct", "tol": 0.02, "unit": "percent", "label": "Untuned total GOR above the lab value", "expected": 2.978994905404897}, {"key": "good_oil_untuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Untuned total gas-oil ratio", "expected": 803.2361602621583}, {"key": "good_oil_untuned_sto_api", "tol": 0.05, "unit": "API", "label": "Untuned stock tank gravity", "expected": 31.581245628852542}, {"key": "good_oil_api_bias", "tol": 0.05, "unit": "API", "label": "Gravity minus the lab value", "expected": -8.818754371147456}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'fluid' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b fluid refused: fluid/intermediate matches neither its post-W1 form (prompt md5 3f7abe6a61283cb6be5c4066abffda2a) nor its W5 form (prompt md5 d25fbaf2de03660ce46359922e9e4a37), with the fields this file was generated against';
  end if;

  -- fluid / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'fluid' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b fluid refused: fluid/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '332a0e7774027e1383ae1316983e822f' and md5(coalesce(title, '')) = '0bee89a184ca6992530f00a5c7aa81f6' and md5(coalesce(dataset, '')) = '7a1e31db3bd1f50cc67e0803d248bc13' and fields = '[{"key": "good_oil_tuned_psat_psia", "tol": 0.5, "unit": "psia", "label": "Tuned saturation pressure", "expected": 2632.64216695564}, {"key": "good_oil_tuned_gor_scf_stb", "tol": 1, "unit": "scf/stb", "label": "Tuned total gas-oil ratio", "expected": 761.7262989883229}, {"key": "good_oil_tuned_sto_api", "tol": 0.05, "unit": "API", "label": "Tuned stock tank gravity", "expected": 38.755039373806255}, {"key": "tuned_splus_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C7+ volume shift", "expected": 0.12266364195926757}, {"key": "tuned_kc1_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C1 to C7+ interaction parameter", "expected": 0.050325447877585576}, {"key": "tuning_ssr_reduction", "tol": 0.05, "unit": "times", "label": "Residual reduction factor", "expected": 23.157104602764026}]'::jsonb then 'old'
              when md5(prompt) = '2bd0c682bb0aade2ff2acc9918e3e0bd' and md5(coalesce(title, '')) = '0bee89a184ca6992530f00a5c7aa81f6' and md5(coalesce(dataset, '')) = 'e14f9ee7e011804027efe37cc51cd4dd' and fields = '[{"key": "good_oil_tuned_bo_rb_stb", "tol": 0.001, "unit": "rb/stb", "label": "Tuned formation volume factor", "expected": 1.4621628562343378}, {"key": "good_oil_tuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Tuned total gas-oil ratio", "expected": 773.1821351682468}, {"key": "good_oil_tuned_sto_api", "tol": 0.05, "unit": "API", "label": "Tuned stock tank gravity", "expected": 38.24766599188635}, {"key": "tuned_splus_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C7+ volume shift", "expected": 0.0939927272825379}, {"key": "tuned_kc1_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C1 to C7+ interaction parameter", "expected": 0.03999571242790525}, {"key": "tuning_ssr_reduction", "tol": 0.05, "unit": "times", "label": "Residual reduction factor", "expected": 16.599912822394707}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'fluid' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b fluid refused: fluid/advanced matches neither its post-W1 form (prompt md5 332a0e7774027e1383ae1316983e822f) nor its W5 form (prompt md5 2bd0c682bb0aade2ff2acc9918e3e0bd), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b fluid: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'fluid' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'fluid/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'fluid/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b fluid refused: fluid/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b fluid: fluid/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b fluid refused: fluid/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'fluid' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'fluid/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'fluid/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b fluid refused: fluid/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b fluid: fluid/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b fluid refused: fluid/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'fluid' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'fluid/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'fluid/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b fluid refused: fluid/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b fluid: fluid/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b fluid refused: fluid/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Produce a black-oil description of a second fluid from the Ekene field from the correlations the engine carries. The fluid is 34 API with a gas gravity of 0.70 at a reservoir temperature of 195 F, its designed bubble point is 2400 psia, its designed solution gas ratio is 480 scf/stb and its initial pressure is 3600 psia. Report the bubble point Standing''s correlation returns for the DESIGNED 480 scf/stb; the SATURATED formation volume factor Standing returns at that same designed solution gas ratio, with no undersaturated correction applied; the dead oil viscosity Beal''s correlation returns, with no dissolved gas in it; the gas z factor Hall-Yarborough returns at the INITIAL pressure of 3600 psia on Sutton pseudo-criticals; the gas formation volume factor at that pressure on that same z; and the percentage by which the Hall-Yarborough z differs from the Dranchuk-Abou-Kassem z at the same state, taken relative to Dranchuk-Abou-Kassem. The correlation explorer opens on the Ekene oil; type this fluid in.',
           title = 'Work the correlations',
           dataset = 'a stated black oil (34 API, gas gravity 0.70, 195 F, 480 scf/stb, initial pressure 3600 psia)',
           fields = '[{"key": "ekene_pb_standing_psia", "tol": 0.05, "unit": "psia", "label": "Standing bubble point at 480 scf/stb", "expected": 2300.0408722832944}, {"key": "ekene_bo_at_designed_rs", "tol": 0.0005, "unit": "rb/stb", "label": "Standing saturated Bo at 480 scf/stb", "expected": 1.283936228388159}, {"key": "ekene_muod_beal_cp", "tol": 0.0005, "unit": "cp", "label": "Beal dead oil viscosity", "expected": 1.5460324253882518}, {"key": "ekene_z_hy_at_pi", "tol": 0.0005, "unit": "-", "label": "Hall-Yarborough z at 3600 psia", "expected": 0.9052822188344655}, {"key": "ekene_bg_at_pi_rb_scf", "tol": 5e-07, "unit": "rb/scf", "label": "Gas FVF at 3600 psia", "expected": 0.0008289024138552641}, {"key": "ekene_z_correlation_gap_pct", "tol": 0.002, "unit": "percent", "label": "z disagreement, HY against DAK", "expected": -0.28438199270689335}]'::jsonb
     where app_slug = 'fluid' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b fluid refused: fluid/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '0ea41b84dd2adf397fd413c9f64ae75e' and md5(coalesce(title, '')) = '2efdd0ff72ed5c132c3e5b11ccde52ac' and md5(coalesce(dataset, '')) = 'ab288b0dd8230b7ffd6447f753d1e0b0' and fields = '[{"key": "ekene_pb_standing_psia", "tol": 0.05, "unit": "psia", "label": "Standing bubble point at 480 scf/stb", "expected": 2300.0408722832944}, {"key": "ekene_bo_at_designed_rs", "tol": 0.0005, "unit": "rb/stb", "label": "Standing saturated Bo at 480 scf/stb", "expected": 1.283936228388159}, {"key": "ekene_muod_beal_cp", "tol": 0.0005, "unit": "cp", "label": "Beal dead oil viscosity", "expected": 1.5460324253882518}, {"key": "ekene_z_hy_at_pi", "tol": 0.0005, "unit": "-", "label": "Hall-Yarborough z at 3600 psia", "expected": 0.9052822188344655}, {"key": "ekene_bg_at_pi_rb_scf", "tol": 5e-07, "unit": "rb/scf", "label": "Gas FVF at 3600 psia", "expected": 0.0008289024138552641}, {"key": "ekene_z_correlation_gap_pct", "tol": 0.002, "unit": "percent", "label": "z disagreement, HY against DAK", "expected": -0.28438199270689335}]'::jsonb) from public.academy_capstones where app_slug = 'fluid' and tier = 'beginner' and active) is not true then
    raise exception 'w5b fluid refused: fluid/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Run an untuned Peng-Robinson model against a published laboratory study and quantify the gaps on a read of your own. The fluid is Good Oil Co. Well No. 4 as Core Laboratories reported it: eleven components with a C7+ fraction of molecular weight 218 and specific gravity 0.8515, at a reservoir temperature of 220 F and a measured bubble point of 2634.65 psia. Use its separator test at 200 psig and 75 F, which is 214.65 psia, to a stock tank at 14.65 psia and 75 F; that test measured a total gas-oil ratio of 780 scf/stb and a stock tank gravity of 40.4 API. First characterize a heavier-cut plus fraction of molecular weight 205 and specific gravity 0.840, as a sensitivity, and report the critical temperature it is given in degrees Rankine. Then run the model on the REPORTED composition, WITHOUT tuning anything and WITH the stock tank stage appended to the separator stage, and report its saturation pressure at 180 F; the percentage by which its total gas-oil ratio exceeds the measured 780 scf/stb; the total gas-oil ratio the separator train produces; the stock tank gravity it produces; and the difference between that gravity and the laboratory''s in API. The study explorer opens on the 100 psig test at 220 F; set this read in.',
           title = 'Read a real study against an untuned model',
           dataset = 'Good Oil Co. Well No. 4, 200 psig separator test; saturation at 180 F; a stated C7+ (MW 205, SG 0.840)',
           fields = '[{"key": "plus_tc_r", "tol": 0.05, "unit": "degR", "label": "Plus-fraction critical temperature, stated MW and SG", "expected": 1295.7891123916502}, {"key": "untuned_psat_case_psia", "tol": 0.5, "unit": "psia", "label": "Untuned saturation pressure at the stated temperature", "expected": 2637.752970132605}, {"key": "gor_bias_pct", "tol": 0.02, "unit": "percent", "label": "Untuned total GOR above the lab value", "expected": 2.978994905404897}, {"key": "good_oil_untuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Untuned total gas-oil ratio", "expected": 803.2361602621583}, {"key": "good_oil_untuned_sto_api", "tol": 0.05, "unit": "API", "label": "Untuned stock tank gravity", "expected": 31.581245628852542}, {"key": "good_oil_api_bias", "tol": 0.05, "unit": "API", "label": "Gravity minus the lab value", "expected": -8.818754371147456}]'::jsonb
     where app_slug = 'fluid' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b fluid refused: fluid/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'd25fbaf2de03660ce46359922e9e4a37' and md5(coalesce(title, '')) = '1e2dc11ac195a45b090d2a067be7a119' and md5(coalesce(dataset, '')) = '11649d72fa7f5f61437943e8f29604d4' and fields = '[{"key": "plus_tc_r", "tol": 0.05, "unit": "degR", "label": "Plus-fraction critical temperature, stated MW and SG", "expected": 1295.7891123916502}, {"key": "untuned_psat_case_psia", "tol": 0.5, "unit": "psia", "label": "Untuned saturation pressure at the stated temperature", "expected": 2637.752970132605}, {"key": "gor_bias_pct", "tol": 0.02, "unit": "percent", "label": "Untuned total GOR above the lab value", "expected": 2.978994905404897}, {"key": "good_oil_untuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Untuned total gas-oil ratio", "expected": 803.2361602621583}, {"key": "good_oil_untuned_sto_api", "tol": 0.05, "unit": "API", "label": "Untuned stock tank gravity", "expected": 31.581245628852542}, {"key": "good_oil_api_bias", "tol": 0.05, "unit": "API", "label": "Gravity minus the lab value", "expected": -8.818754371147456}]'::jsonb) from public.academy_capstones where app_slug = 'fluid' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b fluid refused: fluid/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Tune the compositional model to the Good Oil Co. Well No. 4 study against its 200 psig separator test and report both the result and its price. Regress the four bounded knobs on the C7+ pseudo-component and NOTHING else, jointly against all four measurements at once: the saturation pressure of 2634.65 psia at 220 F, and the total gas-oil ratio of 780 scf/stb, the stock tank gravity of 40.4 API and the formation volume factor of 1.483 rb/stb from the separator test at 214.65 psia and 75 F, with the stock tank stage at 14.65 psia and 75 F appended to it. Report the formation volume factor, the total gas-oil ratio and the stock tank gravity the TUNED model produces; the values the regression lands on for the C7+ volume shift and for the C1 to C7+ binary interaction parameter; and the factor by which the sum of squared residuals falls, being the value before the fit divided by the value after it. Every field asks for a value AFTER the regression. The tuning explorer opens on the 100 psig regression; choose this test.',
           title = 'Tune it, and report what the tuning cost',
           dataset = 'Good Oil Co. Well No. 4 tuned against the 200 psig separator test',
           fields = '[{"key": "good_oil_tuned_bo_rb_stb", "tol": 0.001, "unit": "rb/stb", "label": "Tuned formation volume factor", "expected": 1.4621628562343378}, {"key": "good_oil_tuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Tuned total gas-oil ratio", "expected": 773.1821351682468}, {"key": "good_oil_tuned_sto_api", "tol": 0.05, "unit": "API", "label": "Tuned stock tank gravity", "expected": 38.24766599188635}, {"key": "tuned_splus_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C7+ volume shift", "expected": 0.0939927272825379}, {"key": "tuned_kc1_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C1 to C7+ interaction parameter", "expected": 0.03999571242790525}, {"key": "tuning_ssr_reduction", "tol": 0.05, "unit": "times", "label": "Residual reduction factor", "expected": 16.599912822394707}]'::jsonb
     where app_slug = 'fluid' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b fluid refused: fluid/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '2bd0c682bb0aade2ff2acc9918e3e0bd' and md5(coalesce(title, '')) = '0bee89a184ca6992530f00a5c7aa81f6' and md5(coalesce(dataset, '')) = 'e14f9ee7e011804027efe37cc51cd4dd' and fields = '[{"key": "good_oil_tuned_bo_rb_stb", "tol": 0.001, "unit": "rb/stb", "label": "Tuned formation volume factor", "expected": 1.4621628562343378}, {"key": "good_oil_tuned_gor_scf_stb", "tol": 1.0, "unit": "scf/stb", "label": "Tuned total gas-oil ratio", "expected": 773.1821351682468}, {"key": "good_oil_tuned_sto_api", "tol": 0.05, "unit": "API", "label": "Tuned stock tank gravity", "expected": 38.24766599188635}, {"key": "tuned_splus_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C7+ volume shift", "expected": 0.0939927272825379}, {"key": "tuned_kc1_knob", "tol": 0.0005, "unit": "-", "label": "Tuned C1 to C7+ interaction parameter", "expected": 0.03999571242790525}, {"key": "tuning_ssr_reduction", "tol": 0.05, "unit": "times", "label": "Residual reduction factor", "expected": 16.599912822394707}]'::jsonb) from public.academy_capstones where app_slug = 'fluid' and tier = 'advanced' and active) is not true then
    raise exception 'w5b fluid refused: fluid/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b fluid: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
