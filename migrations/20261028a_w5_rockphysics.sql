-- ============================================================================
-- B5 FOLLOW-ON W5A (leak re-case and strip): rockphysics.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/rockphysics.json. The new
-- keys come from tools/course-waves/w5/rockphysics/fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   Every field leaked: the walkthrough printed all six at full precision and
--   the fluid explorer opened on the capstone case. The capstone moves to the
--   UQUO sand, whose conditions, oil, frame and saturation the learner types
--   into the fluid explorer; the panel opens on the Ekene teaching case.
--   brine_rho (1017.8249875, tol 0.5)
--       -> uquo_brine_rho 'Brine density' kg/m3, expected 1021.265271544, tol 0.05
--   brine_k_gpa (2.6978112899395996, tol 0.005)
--       -> uquo_brine_k_gpa 'Brine bulk modulus' GPa, expected 2.8088703086980726, tol 0.0005
--   gas_k_mpa (55.71865290286663, tol 0.1)
--       -> uquo_gas_k_mpa 'Gas bulk modulus' MPa, expected 77.87656016365912, tol 0.01
--   oil_rho (777.0630099023522, tol 0.5)
--       -> uquo_oil_rho 'Live-oil density' kg/m3, expected 761.2776518976759, tol 0.05
--   vrh_k_gpa (30.87940062475596, tol 0.05)
--       -> uquo_vrh_k_gpa 'Frame K, VRH 82/18 quartz/clay' GPa, expected 33.007289977240156, tol 0.005
--   wood_k_mpa (257.3340919366766, tol 0.5)
--       -> uquo_wood_k_mpa 'Wood mixed-fluid K at Sw 0.7' MPa, expected 243.81557049231546, tol 0.05
--   TITLE was: Reservoir fluids and the mineral frame
--   TITLE now: Reservoir fluids and the mineral frame: the UQUO sand
--   DATASET was: rockphysics/goldens (Batzle-Wang fixture points)
--   DATASET now: rockphysics/UQUO case (W5 re-case; every input is stated in the
--   brief)
--   PROMPT now: The UQUO sand sits at 78 degC and 31 MPa with 50,000 ppm brine,
--   a 0.68-gravity gas and a live oil of stock-tank density 0.87 g/cc at GOR 72
--   L/L. Its mineral frame is 82 percent quartz and 18 percent clay, and its
--   pore fluid is mixed at Sw 0.7. Type this case into the fluid explorer (it
--   opens on the Ekene sand, which is the teaching case), then report the brine
--   density and bulk modulus, the gas bulk modulus, the live-oil density, the
--   Voigt-Reuss-Hill frame bulk modulus and the Wood mixed-fluid bulk modulus.
--   Mind the units: brine and frame moduli in GPa, gas and mixed-fluid moduli in
--   MPa.
--
-- INTERMEDIATE: pick A (re-case)
--   Every field leaked: the walkthrough and four module lessons printed them and
--   the substitution explorer opened on the capstone case. The capstone moves to
--   the logged UQUO sand with its own porosity, mineral modulus and fluid
--   conditions, typed into the substitution explorer; the Greenberg-Castagna
--   estimate moves to 2860 m/s on a 60/40 split.
--   mu_gpa (7.29, tol 0.01)
--       -> uquo_mu_gpa 'Shear modulus (fluid-blind)' GPa, expected 8.530021, tol 0.001
--   ksat_insitu (13.32, tol 0.01)
--       -> uquo_ksat_insitu 'In-situ saturated K' GPa, expected 14.788514666666666, tol 0.001
--   kdry_gpa (7.350343061720982, tol 0.01)
--       -> uquo_kdry_gpa 'Dry-frame K (inverse Gassmann)' GPa, expected 8.689430192271049, tol 0.001
--   gas_vp (2905.6972280296195, tol 1)
--       -> uquo_gas_vp 'Gas-case vp' m/s, expected 3097.9059863959733, tol 0.1
--   gas_rho (2038.7104517793223, tol 0.5)
--       -> uquo_gas_rho 'Gas-case density' kg/m3, expected 2108.4251095303703, tol 0.05
--   gc_vs (1521.197276567149, tol 1)
--       -> uquo_gc_vs 'Greenberg-Castagna vs at vp 2860, 60/40' m/s, expected 1398.9411689336698, tol 0.1
--   TITLE was: Gassmann substitution on the Ekene SAND
--   TITLE now: Gassmann substitution on the UQUO sand
--   DATASET was: rockphysics/goldens (log-domain Gassmann fixture)
--   DATASET now: rockphysics/UQUO case (W5 re-case; every input is stated in the
--   brief)
--   PROMPT now: The logged UQUO sand is brine-saturated at vp 3380 m/s, vs 1930
--   m/s and density 2290 kg/m3, with porosity 0.22 and a mineral modulus of 36
--   GPa. Its fluids sit at 70 degC and 28 MPa, with 45,000 ppm brine and a
--   0.64-gravity gas. Type the case into the substitution explorer (it opens on
--   the Ekene sand, which is the teaching case), recover the dry frame with
--   inverse Gassmann and substitute to full gas (Sw 0). Report the shear
--   modulus, the in-situ saturated bulk modulus and the dry-frame bulk modulus
--   in GPa, and the gas-case vp and density. Where the sonic has no shear,
--   predict vs at vp 2860 m/s with Greenberg-Castagna for a 60/40 sand/shale
--   mix.
--
-- ADVANCED: pick A (re-case)
--   Every field leaked: the walkthrough and the m02 to m05 lessons printed them
--   and the AVO explorer opened on the capstone interface. The capstone moves to
--   the UQUO shale over the UQUO sand and its gas twin, all stated in the brief
--   and typed into the AVO explorer, with tuning at 32 Hz. W1's
--   brine_max_shuey_err (which replaced gas_class) is carried as
--   uquo_brine_max_shuey_err on the new case.
--   brine_intercept (0.03434399848203321, tol 0.001)
--       -> uquo_brine_intercept 'Brine-case Shuey intercept A' ratio, expected 0.0463745160154875, tol 0.0002
--   brine_gradient (-0.16766246414664518, tol 0.001)
--       -> uquo_brine_gradient 'Brine-case Shuey gradient B' ratio, expected -0.19829138800891705, tol 0.0002
--   gas_intercept (-0.06282494068620303, tol 0.001)
--       -> uquo_gas_intercept 'Gas-case Shuey intercept A' ratio, expected -0.04722349798537935, tol 0.0002
--   gas_gradient (-0.2565633444602355, tol 0.001)
--       -> uquo_gas_gradient 'Gas-case Shuey gradient B' ratio, expected -0.2894539563550345, tol 0.0002
--   brine_max_shuey_err (0.005972095765271403, tol 0.0001)
--       -> uquo_brine_max_shuey_err 'Largest Shuey error, brine case, 0 to 40 deg' ratio, expected 0.007543857206650099, tol 2e-05
--   zoep30 (-0.12239091302671612, tol 0.001)
--       -> uquo_zoep30 'Exact Zoeppritz Rpp at 30 deg, gas' ratio, expected -0.11353586245965772, tol 0.0002
--   tuning_ms (16, tol 0)
--       -> uquo_tuning_ms 'Wedge tuning thickness at 32 Hz' ms, expected 12, tol 0.0
--   TITLE was: Fluid substitution flips the AVO class
--   TITLE now: Fluid substitution flips the AVO class: the UQUO sand
--   DATASET was: rockphysics/ekene shale-over-sand + wedge
--   DATASET now: rockphysics/UQUO case (W5 re-case; every input is stated in the
--   brief)
--   PROMPT now: Put the UQUO shale (vp 2750 m/s, vs 1400 m/s, density 2455
--   kg/m3) over the UQUO sand and screen both cases: the logged brine sand (vp
--   3250 m/s, vs 1850 m/s, density 2280 kg/m3) and its gas twin (vp 2964.0 m/s,
--   vs 1940.8 m/s, density 2071.7 kg/m3, which is the full-gas Gassmann
--   substitution at porosity 0.25 and a 38 GPa mineral modulus, to 0.1). Type
--   the interface into the AVO explorer (it opens on the Ekene shale and sand,
--   which are the teaching case). Report the Shuey intercept and gradient for
--   each case, the largest absolute gap between Shuey and exact Zoeppritz on the
--   brine case at whole degrees from 0 to 40, the exact Zoeppritz Rpp at 30
--   degrees for the gas case, and the wedge tuning thickness at 32 Hz.
--
-- ATTEMPTS. Tiers whose graded keys move: rockphysics/beginner,
-- rockphysics/intermediate, rockphysics/advanced. Before it writes, the file
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
  -- rockphysics / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'rockphysics' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5a rockphysics refused: rockphysics/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'd638351b30507cdaee8d80ba6d99cdc6' and md5(coalesce(title, '')) = 'd3f384c2738d16bd356168f93ac9bb30' and md5(coalesce(dataset, '')) = '60973380d9472e653a8a0ff22e23a6f4' and fields = '[{"key": "brine_rho", "tol": 0.5, "unit": "kg/m3", "label": "Brine density", "expected": 1017.8249875}, {"key": "brine_k_gpa", "tol": 0.005, "unit": "GPa", "label": "Brine bulk modulus", "expected": 2.6978112899395996}, {"key": "gas_k_mpa", "tol": 0.1, "unit": "MPa", "label": "Gas bulk modulus", "expected": 55.71865290286663}, {"key": "oil_rho", "tol": 0.5, "unit": "kg/m3", "label": "Live-oil density", "expected": 777.0630099023522}, {"key": "vrh_k_gpa", "tol": 0.05, "unit": "GPa", "label": "Frame K, VRH 70/30 quartz/clay", "expected": 30.87940062475596}, {"key": "wood_k_mpa", "tol": 0.5, "unit": "MPa", "label": "Wood mixed-fluid K at Sw 0.8", "expected": 257.3340919366766}]'::jsonb then 'old'
              when md5(prompt) = 'ccfb0fc4b0ffeb2abfa67d14bfffdba3' and md5(coalesce(title, '')) = 'f4ec39bc94cf211c2f16fb7f42149abe' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_brine_rho", "tol": 0.05, "unit": "kg/m3", "label": "Brine density", "expected": 1021.265271544}, {"key": "uquo_brine_k_gpa", "tol": 0.0005, "unit": "GPa", "label": "Brine bulk modulus", "expected": 2.8088703086980726}, {"key": "uquo_gas_k_mpa", "tol": 0.01, "unit": "MPa", "label": "Gas bulk modulus", "expected": 77.87656016365912}, {"key": "uquo_oil_rho", "tol": 0.05, "unit": "kg/m3", "label": "Live-oil density", "expected": 761.2776518976759}, {"key": "uquo_vrh_k_gpa", "tol": 0.005, "unit": "GPa", "label": "Frame K, VRH 82/18 quartz/clay", "expected": 33.007289977240156}, {"key": "uquo_wood_k_mpa", "tol": 0.05, "unit": "MPa", "label": "Wood mixed-fluid K at Sw 0.7", "expected": 243.81557049231546}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'rockphysics' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5a rockphysics refused: rockphysics/beginner matches neither its post-W1 form (prompt md5 d638351b30507cdaee8d80ba6d99cdc6) nor its W5 form (prompt md5 ccfb0fc4b0ffeb2abfa67d14bfffdba3), with the fields this file was generated against';
  end if;

  -- rockphysics / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'rockphysics' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5a rockphysics refused: rockphysics/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '3608d6b89745865f6a60a0314c898dee' and md5(coalesce(title, '')) = '81573ce3731ffcb5e070368ace1b324b' and md5(coalesce(dataset, '')) = '337d86744ad341ca5b02ee98747d2441' and fields = '[{"key": "mu_gpa", "tol": 0.01, "unit": "GPa", "label": "Shear modulus (fluid-blind)", "expected": 7.29}, {"key": "ksat_insitu", "tol": 0.01, "unit": "GPa", "label": "In-situ saturated K", "expected": 13.32}, {"key": "kdry_gpa", "tol": 0.01, "unit": "GPa", "label": "Dry-frame K (inverse Gassmann)", "expected": 7.350343061720982}, {"key": "gas_vp", "tol": 1, "unit": "m/s", "label": "Gas-case vp", "expected": 2905.6972280296195}, {"key": "gas_rho", "tol": 0.5, "unit": "kg/m3", "label": "Gas-case density", "expected": 2038.7104517793223}, {"key": "gc_vs", "tol": 1, "unit": "m/s", "label": "Greenberg-Castagna vs at vp 3000", "expected": 1521.197276567149}]'::jsonb then 'old'
              when md5(prompt) = 'df4b9e938906d8bd24615def10e25640' and md5(coalesce(title, '')) = 'ab6dd02387c1a8a97cc9831a533dd991' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_mu_gpa", "tol": 0.001, "unit": "GPa", "label": "Shear modulus (fluid-blind)", "expected": 8.530021}, {"key": "uquo_ksat_insitu", "tol": 0.001, "unit": "GPa", "label": "In-situ saturated K", "expected": 14.788514666666666}, {"key": "uquo_kdry_gpa", "tol": 0.001, "unit": "GPa", "label": "Dry-frame K (inverse Gassmann)", "expected": 8.689430192271049}, {"key": "uquo_gas_vp", "tol": 0.1, "unit": "m/s", "label": "Gas-case vp", "expected": 3097.9059863959733}, {"key": "uquo_gas_rho", "tol": 0.05, "unit": "kg/m3", "label": "Gas-case density", "expected": 2108.4251095303703}, {"key": "uquo_gc_vs", "tol": 0.1, "unit": "m/s", "label": "Greenberg-Castagna vs at vp 2860, 60/40", "expected": 1398.9411689336698}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'rockphysics' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5a rockphysics refused: rockphysics/intermediate matches neither its post-W1 form (prompt md5 3608d6b89745865f6a60a0314c898dee) nor its W5 form (prompt md5 df4b9e938906d8bd24615def10e25640), with the fields this file was generated against';
  end if;

  -- rockphysics / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'rockphysics' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5a rockphysics refused: rockphysics/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '37f9c72d59288939d322371f9971e284' and md5(coalesce(title, '')) = '1a728568bd6b8480db5e780baae1ee48' and md5(coalesce(dataset, '')) = '00771dda8abb2b64b8b4c8f74ee00ff7' and fields = '[{"key": "brine_intercept", "tol": 0.001, "unit": "ratio", "label": "Brine-case Shuey intercept A", "expected": 0.03434399848203321}, {"key": "brine_gradient", "tol": 0.001, "unit": "ratio", "label": "Brine-case Shuey gradient B", "expected": -0.16766246414664518}, {"key": "gas_intercept", "tol": 0.001, "unit": "ratio", "label": "Gas-case Shuey intercept A", "expected": -0.06282494068620303}, {"key": "gas_gradient", "tol": 0.001, "unit": "ratio", "label": "Gas-case Shuey gradient B", "expected": -0.2565633444602355}, {"key": "brine_max_shuey_err", "tol": 0.0001, "unit": "ratio", "label": "Largest Shuey error, brine case, 0 to 40 deg", "expected": 0.005972095765271403}, {"key": "zoep30", "tol": 0.001, "unit": "ratio", "label": "Exact Zoeppritz Rpp at 30 deg, gas", "expected": -0.12239091302671612}, {"key": "tuning_ms", "tol": 0, "unit": "ms", "label": "Wedge tuning thickness at 25 Hz", "expected": 16}]'::jsonb then 'old'
              when md5(prompt) = '4cdb36b49f0194c14b1e2c827893521e' and md5(coalesce(title, '')) = '9f9055a9bdc75d333bed9866bb024251' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_brine_intercept", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey intercept A", "expected": 0.0463745160154875}, {"key": "uquo_brine_gradient", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey gradient B", "expected": -0.19829138800891705}, {"key": "uquo_gas_intercept", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey intercept A", "expected": -0.04722349798537935}, {"key": "uquo_gas_gradient", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey gradient B", "expected": -0.2894539563550345}, {"key": "uquo_brine_max_shuey_err", "tol": 2e-05, "unit": "ratio", "label": "Largest Shuey error, brine case, 0 to 40 deg", "expected": 0.007543857206650099}, {"key": "uquo_zoep30", "tol": 0.0002, "unit": "ratio", "label": "Exact Zoeppritz Rpp at 30 deg, gas", "expected": -0.11353586245965772}, {"key": "uquo_tuning_ms", "tol": 0.0, "unit": "ms", "label": "Wedge tuning thickness at 32 Hz", "expected": 12}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'rockphysics' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5a rockphysics refused: rockphysics/advanced matches neither its post-W1 form (prompt md5 37f9c72d59288939d322371f9971e284) nor its W5 form (prompt md5 4cdb36b49f0194c14b1e2c827893521e), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5a rockphysics: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'rockphysics' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'rockphysics/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'rockphysics/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a rockphysics refused: rockphysics/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a rockphysics: rockphysics/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a rockphysics refused: rockphysics/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'rockphysics' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'rockphysics/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'rockphysics/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a rockphysics refused: rockphysics/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a rockphysics: rockphysics/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a rockphysics refused: rockphysics/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'rockphysics' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'rockphysics/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'rockphysics/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a rockphysics refused: rockphysics/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a rockphysics: rockphysics/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a rockphysics refused: rockphysics/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'The UQUO sand sits at 78 degC and 31 MPa with 50,000 ppm brine, a 0.68-gravity gas and a live oil of stock-tank density 0.87 g/cc at GOR 72 L/L. Its mineral frame is 82 percent quartz and 18 percent clay, and its pore fluid is mixed at Sw 0.7. Type this case into the fluid explorer (it opens on the Ekene sand, which is the teaching case), then report the brine density and bulk modulus, the gas bulk modulus, the live-oil density, the Voigt-Reuss-Hill frame bulk modulus and the Wood mixed-fluid bulk modulus. Mind the units: brine and frame moduli in GPa, gas and mixed-fluid moduli in MPa.',
           title = 'Reservoir fluids and the mineral frame: the UQUO sand',
           dataset = 'rockphysics/UQUO case (W5 re-case; every input is stated in the brief)',
           fields = '[{"key": "uquo_brine_rho", "tol": 0.05, "unit": "kg/m3", "label": "Brine density", "expected": 1021.265271544}, {"key": "uquo_brine_k_gpa", "tol": 0.0005, "unit": "GPa", "label": "Brine bulk modulus", "expected": 2.8088703086980726}, {"key": "uquo_gas_k_mpa", "tol": 0.01, "unit": "MPa", "label": "Gas bulk modulus", "expected": 77.87656016365912}, {"key": "uquo_oil_rho", "tol": 0.05, "unit": "kg/m3", "label": "Live-oil density", "expected": 761.2776518976759}, {"key": "uquo_vrh_k_gpa", "tol": 0.005, "unit": "GPa", "label": "Frame K, VRH 82/18 quartz/clay", "expected": 33.007289977240156}, {"key": "uquo_wood_k_mpa", "tol": 0.05, "unit": "MPa", "label": "Wood mixed-fluid K at Sw 0.7", "expected": 243.81557049231546}]'::jsonb
     where app_slug = 'rockphysics' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a rockphysics refused: rockphysics/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'ccfb0fc4b0ffeb2abfa67d14bfffdba3' and md5(coalesce(title, '')) = 'f4ec39bc94cf211c2f16fb7f42149abe' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_brine_rho", "tol": 0.05, "unit": "kg/m3", "label": "Brine density", "expected": 1021.265271544}, {"key": "uquo_brine_k_gpa", "tol": 0.0005, "unit": "GPa", "label": "Brine bulk modulus", "expected": 2.8088703086980726}, {"key": "uquo_gas_k_mpa", "tol": 0.01, "unit": "MPa", "label": "Gas bulk modulus", "expected": 77.87656016365912}, {"key": "uquo_oil_rho", "tol": 0.05, "unit": "kg/m3", "label": "Live-oil density", "expected": 761.2776518976759}, {"key": "uquo_vrh_k_gpa", "tol": 0.005, "unit": "GPa", "label": "Frame K, VRH 82/18 quartz/clay", "expected": 33.007289977240156}, {"key": "uquo_wood_k_mpa", "tol": 0.05, "unit": "MPa", "label": "Wood mixed-fluid K at Sw 0.7", "expected": 243.81557049231546}]'::jsonb) from public.academy_capstones where app_slug = 'rockphysics' and tier = 'beginner' and active) is not true then
    raise exception 'w5a rockphysics refused: rockphysics/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'The logged UQUO sand is brine-saturated at vp 3380 m/s, vs 1930 m/s and density 2290 kg/m3, with porosity 0.22 and a mineral modulus of 36 GPa. Its fluids sit at 70 degC and 28 MPa, with 45,000 ppm brine and a 0.64-gravity gas. Type the case into the substitution explorer (it opens on the Ekene sand, which is the teaching case), recover the dry frame with inverse Gassmann and substitute to full gas (Sw 0). Report the shear modulus, the in-situ saturated bulk modulus and the dry-frame bulk modulus in GPa, and the gas-case vp and density. Where the sonic has no shear, predict vs at vp 2860 m/s with Greenberg-Castagna for a 60/40 sand/shale mix.',
           title = 'Gassmann substitution on the UQUO sand',
           dataset = 'rockphysics/UQUO case (W5 re-case; every input is stated in the brief)',
           fields = '[{"key": "uquo_mu_gpa", "tol": 0.001, "unit": "GPa", "label": "Shear modulus (fluid-blind)", "expected": 8.530021}, {"key": "uquo_ksat_insitu", "tol": 0.001, "unit": "GPa", "label": "In-situ saturated K", "expected": 14.788514666666666}, {"key": "uquo_kdry_gpa", "tol": 0.001, "unit": "GPa", "label": "Dry-frame K (inverse Gassmann)", "expected": 8.689430192271049}, {"key": "uquo_gas_vp", "tol": 0.1, "unit": "m/s", "label": "Gas-case vp", "expected": 3097.9059863959733}, {"key": "uquo_gas_rho", "tol": 0.05, "unit": "kg/m3", "label": "Gas-case density", "expected": 2108.4251095303703}, {"key": "uquo_gc_vs", "tol": 0.1, "unit": "m/s", "label": "Greenberg-Castagna vs at vp 2860, 60/40", "expected": 1398.9411689336698}]'::jsonb
     where app_slug = 'rockphysics' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a rockphysics refused: rockphysics/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'df4b9e938906d8bd24615def10e25640' and md5(coalesce(title, '')) = 'ab6dd02387c1a8a97cc9831a533dd991' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_mu_gpa", "tol": 0.001, "unit": "GPa", "label": "Shear modulus (fluid-blind)", "expected": 8.530021}, {"key": "uquo_ksat_insitu", "tol": 0.001, "unit": "GPa", "label": "In-situ saturated K", "expected": 14.788514666666666}, {"key": "uquo_kdry_gpa", "tol": 0.001, "unit": "GPa", "label": "Dry-frame K (inverse Gassmann)", "expected": 8.689430192271049}, {"key": "uquo_gas_vp", "tol": 0.1, "unit": "m/s", "label": "Gas-case vp", "expected": 3097.9059863959733}, {"key": "uquo_gas_rho", "tol": 0.05, "unit": "kg/m3", "label": "Gas-case density", "expected": 2108.4251095303703}, {"key": "uquo_gc_vs", "tol": 0.1, "unit": "m/s", "label": "Greenberg-Castagna vs at vp 2860, 60/40", "expected": 1398.9411689336698}]'::jsonb) from public.academy_capstones where app_slug = 'rockphysics' and tier = 'intermediate' and active) is not true then
    raise exception 'w5a rockphysics refused: rockphysics/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Put the UQUO shale (vp 2750 m/s, vs 1400 m/s, density 2455 kg/m3) over the UQUO sand and screen both cases: the logged brine sand (vp 3250 m/s, vs 1850 m/s, density 2280 kg/m3) and its gas twin (vp 2964.0 m/s, vs 1940.8 m/s, density 2071.7 kg/m3, which is the full-gas Gassmann substitution at porosity 0.25 and a 38 GPa mineral modulus, to 0.1). Type the interface into the AVO explorer (it opens on the Ekene shale and sand, which are the teaching case). Report the Shuey intercept and gradient for each case, the largest absolute gap between Shuey and exact Zoeppritz on the brine case at whole degrees from 0 to 40, the exact Zoeppritz Rpp at 30 degrees for the gas case, and the wedge tuning thickness at 32 Hz.',
           title = 'Fluid substitution flips the AVO class: the UQUO sand',
           dataset = 'rockphysics/UQUO case (W5 re-case; every input is stated in the brief)',
           fields = '[{"key": "uquo_brine_intercept", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey intercept A", "expected": 0.0463745160154875}, {"key": "uquo_brine_gradient", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey gradient B", "expected": -0.19829138800891705}, {"key": "uquo_gas_intercept", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey intercept A", "expected": -0.04722349798537935}, {"key": "uquo_gas_gradient", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey gradient B", "expected": -0.2894539563550345}, {"key": "uquo_brine_max_shuey_err", "tol": 2e-05, "unit": "ratio", "label": "Largest Shuey error, brine case, 0 to 40 deg", "expected": 0.007543857206650099}, {"key": "uquo_zoep30", "tol": 0.0002, "unit": "ratio", "label": "Exact Zoeppritz Rpp at 30 deg, gas", "expected": -0.11353586245965772}, {"key": "uquo_tuning_ms", "tol": 0.0, "unit": "ms", "label": "Wedge tuning thickness at 32 Hz", "expected": 12}]'::jsonb
     where app_slug = 'rockphysics' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a rockphysics refused: rockphysics/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '4cdb36b49f0194c14b1e2c827893521e' and md5(coalesce(title, '')) = '9f9055a9bdc75d333bed9866bb024251' and md5(coalesce(dataset, '')) = '14dd1ec1ec21fb58f9f33338e826dc27' and fields = '[{"key": "uquo_brine_intercept", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey intercept A", "expected": 0.0463745160154875}, {"key": "uquo_brine_gradient", "tol": 0.0002, "unit": "ratio", "label": "Brine-case Shuey gradient B", "expected": -0.19829138800891705}, {"key": "uquo_gas_intercept", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey intercept A", "expected": -0.04722349798537935}, {"key": "uquo_gas_gradient", "tol": 0.0002, "unit": "ratio", "label": "Gas-case Shuey gradient B", "expected": -0.2894539563550345}, {"key": "uquo_brine_max_shuey_err", "tol": 2e-05, "unit": "ratio", "label": "Largest Shuey error, brine case, 0 to 40 deg", "expected": 0.007543857206650099}, {"key": "uquo_zoep30", "tol": 0.0002, "unit": "ratio", "label": "Exact Zoeppritz Rpp at 30 deg, gas", "expected": -0.11353586245965772}, {"key": "uquo_tuning_ms", "tol": 0.0, "unit": "ms", "label": "Wedge tuning thickness at 32 Hz", "expected": 12}]'::jsonb) from public.academy_capstones where app_slug = 'rockphysics' and tier = 'advanced' and active) is not true then
    raise exception 'w5a rockphysics refused: rockphysics/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5a rockphysics: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
