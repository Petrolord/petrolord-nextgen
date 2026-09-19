-- ============================================================================
-- gasvalue GO-LIVE (HELD): Flare Gas to Value & LPG/CNG flips to 'available',
-- the first course of the Energy Transition module, at path_order 51.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route
--      /dashboard/apps/gasvalue. The 78 lessons, the teaching lab and its three
--      explorer panels (flare, route and rollout) ship in the ZIP and NOT in
--      this database, so a flip before the upload puts a live catalogue tile in
--      front of a route that does not exist;
--   2. the Suite production upload carrying Suite main 06aef5d63 (Suite #543
--      MD5-0, #545 MD4-0, #546 MD45-1: the Flare Gas to Value and LPG & CNG
--      Rollout page repairs this course teaches, with the engines at df31f53
--      those pages run on). Until it is uploaded the live pages a learner opens
--      beside the course still count every unburned carbon as methane, credit a
--      plant with the whole flare, and read a gauge pressure as absolute: the
--      traps the course is built on.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (gasvalue_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the sixteen fields with a closed form. The go-live
--      first proves each shipped prompt is the rendered one byte for byte.
--      Route per field:
--        SQL closed form  eriemu_ghv_btu_scf, eriemu_gpm_c3plus,
--                         eriemu_c3plus_kg_per_mscf (the gas scaled to one and
--                         read by the mole), eriemu_flare_co2_t,
--                         eriemu_flare_ch4_t, eriemu_flare_co2e_t (40 CFR
--                         98.233(n)), adibawa_capital_usd (the modular power
--                         law), adibawa_cng_kg_per_year, adibawa_value_per_mscf,
--                         adibawa_avoided_co2e_t, adibawa_net_abatement_t,
--                         adibawa_breakeven_credit_usd_per_t (closed form),
--                         asaba_usable_lpg_t (filling density on water
--                         capacity), asaba_vaporizer_design_kw (latent heat on
--                         mass fractions), asaba_carousel_wait_min (Erlang C
--                         by the factorial form, not the engine's Erlang B
--                         recursion), asaba_payback_years;
--        the ORACLE       asaba_bank_mass_kg and asaba_left_in_banks_kg, which
--                         rest on real-gas Z by Dranchuk-Abou-Kassem, a root
--                         found by iteration and not a closed form, so they
--                         are not re-solved here: their second route is the
--                         oracle's (DAK by bisection where the engine uses
--                         Newton; the cascade as a mass ledger by false
--                         position, conservation asserted; route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_flaretovalue.py, oracle_lpgcng.py, exact
--      rationals where they can be, with the exact pound), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine (or the pre-MD4-0 engine
--      at 13f0936) that lands closest to the graded value, which must lie
--      outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NO DATE. Neither engine on this path reads a clock or a date, and nothing
-- here does: this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for; the tonnes of a flare or an abatement at ten units, 0.01 t,
-- the wave's ruling on the engine's nine-figure pound), with a label and a
-- unit, and all of it is asserted here, on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_worst numeric := 0; v_worst_key text := '(none)';
  v_sum numeric; v_hc numeric; v_yco2 numeric; v_ych4 numeric; v_lbmol numeric;
  v_co2 numeric; v_ch4 numeric; v_co2e numeric; v_mscf numeric; v_margin numeric;
  v_vsum numeric; v_msum numeric; v_latent numeric;
  v_lambda numeric; v_mu numeric; v_a numeric; v_c int; v_s numeric; v_t numeric; v_k int;
  v_nc numeric; v_saving numeric;
  v_g_eriemu_ghv_btu_scf numeric; v_s_eriemu_ghv_btu_scf numeric;
  v_g_eriemu_gpm_c3plus numeric; v_s_eriemu_gpm_c3plus numeric;
  v_g_eriemu_c3plus_kg_per_mscf numeric; v_s_eriemu_c3plus_kg_per_mscf numeric;
  v_g_eriemu_flare_co2_t numeric; v_s_eriemu_flare_co2_t numeric;
  v_g_eriemu_flare_ch4_t numeric; v_s_eriemu_flare_ch4_t numeric;
  v_g_eriemu_flare_co2e_t numeric; v_s_eriemu_flare_co2e_t numeric;
  v_g_adibawa_capital_usd numeric; v_s_adibawa_capital_usd numeric;
  v_g_adibawa_cng_kg_per_year numeric; v_s_adibawa_cng_kg_per_year numeric;
  v_g_adibawa_value_per_mscf numeric; v_s_adibawa_value_per_mscf numeric;
  v_g_adibawa_avoided_co2e_t numeric; v_s_adibawa_avoided_co2e_t numeric;
  v_g_adibawa_net_abatement_t numeric; v_s_adibawa_net_abatement_t numeric;
  v_g_adibawa_breakeven_credit_usd_per_t numeric; v_s_adibawa_breakeven_credit_usd_per_t numeric;
  v_g_asaba_usable_lpg_t numeric; v_s_asaba_usable_lpg_t numeric;
  v_g_asaba_vaporizer_design_kw numeric; v_s_asaba_vaporizer_design_kw numeric;
  v_g_asaba_carousel_wait_min numeric; v_s_asaba_carousel_wait_min numeric;
  v_g_asaba_bank_mass_kg numeric; v_s_asaba_bank_mass_kg numeric;
  v_g_asaba_left_in_banks_kg numeric; v_s_asaba_left_in_banks_kg numeric;
  v_g_asaba_payback_years numeric; v_s_asaba_payback_years numeric;
  v_adibawa_counterfactual jsonb := '{"counterfactualLabel":"CNG displacing diesel in Port Harcourt haulage","productCombustionTonnesCo2ePerYear":236000,"displacedFuelTonnesCo2ePerYear":281000}'::jsonb;
  v_adibawa_credits jsonb := '{"creditPrices":[30,10,20,15],"hurdleMarginPerYear":39500000}'::jsonb;
  v_adibawa_flare jsonb := '{"volumeMMscfd":16.8,"onstreamDays":342,"flareDestructionEfficiency":0.968,"flareCombustionEfficiency":0.952,"gwpMethane":27.9}'::jsonb;
  v_adibawa_gas jsonb := '[["C1",0.801],["C2",0.071],["C3",0.041],["IC4",0.009],["NC4",0.015],["C5",0.008],["N2",0.027],["CO2",0.028]]'::jsonb;
  v_adibawa_route jsonb := '{"id":"cng","productUnitPerMscf":17.2,"productUnitLabel":"kg CNG","recoveryFraction":0.87,"pricePerProductUnit":0.43,"referenceCapitalCost":27000000,"referenceCapacityMMscfd":7,"fixedOpexPerYear":2100000,"variableOpexPerMscf":0.38}'::jsonb;
  v_asaba_bottling jsonb := '{"cylindersPerDay":4100,"fillMinutesPerCylinder":2.3,"positions":20,"shiftHoursPerDay":11,"availabilityFraction":0.93}'::jsonb;
  v_asaba_cascade jsonb := '{"banks":[{"label":"Low","volumeM3":2.5,"gaugeBar":180},{"label":"Mid","volumeM3":2.5,"gaugeBar":225},{"label":"High","volumeM3":2.5,"gaugeBar":260}],"vehicleTankM3":0.075,"vehicleStartGaugeBar":15,"vehicleTargetGaugeBar":200}'::jsonb;
  v_asaba_cng jsonb := '{"gasSg":0.63,"temperatureC":34,"atmosphereBar":1.013}'::jsonb;
  v_asaba_conversion jsonb := '{"annualDistanceKm":62000,"baseFuel":{"label":"PMS","consumptionPer100Km":11,"pricePerUnit":820,"energyPerUnitMJ":32.2},"newFuel":{"label":"CNG","pricePerUnit":410,"energyPerUnitMJ":47.1,"efficiencyRatio":0.9},"conversionCost":1350000,"annualExtraMaintenance":72000}'::jsonb;
  v_asaba_lpg jsonb := '[{"code":"propane","volumeFraction":0.32,"liquidDensityKgM3":506,"molarMassKgKmol":44.096,"latentHeatKJkg":428},{"code":"butane","volumeFraction":0.68,"liquidDensityKgM3":581,"molarMassKgKmol":58.122,"latentHeatKJkg":383}]'::jsonb;
  v_asaba_storage_bank jsonb := '{"volumeM3":3,"gaugeBar":245}'::jsonb;
  v_asaba_vaporizer jsonb := '{"massFlowKgHr":780,"liquidCpKJkgK":2.5,"inletTempC":21,"boilingPointC":41,"vapourCpKJkgK":1.7,"outletTempC":58,"designMarginPercent":12}'::jsonb;
  v_asaba_vessel jsonb := '{"vesselCapacityM3":220,"maxFillRatio":0.43,"fillRatioBasis":"water_capacity_mass","demandTonnesPerDay":11,"deliveryTonnes":25,"leadTimeDays":4,"safetyDays":2}'::jsonb;
  v_eriemu_flare jsonb := '{"volumeMMscfd":12.4,"onstreamDays":347,"flareDestructionEfficiency":0.976,"flareCombustionEfficiency":0.961,"gwpMethane":28.7}'::jsonb;
  v_eriemu_gas jsonb := '[["C1",0.7215],["C2",0.0968],["C3",0.0634],["IC4",0.0142],["NC4",0.0236],["C5",0.0127],["N2",0.0231],["CO2",0.0367]]'::jsonb;
  v_eriemu_components jsonb := '[{"code":"C1","moleFraction":0.7215,"c":1,"molarMassLbLbmol":16.043,"ghvBtuScf":1010,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":false},{"code":"C2","moleFraction":0.0968,"c":2,"molarMassLbLbmol":30.07,"ghvBtuScf":1770,"liquidDensityLbGal":2.971,"recoverableAsNgl":true,"inert":false},{"code":"C3","moleFraction":0.0634,"c":3,"molarMassLbLbmol":44.096,"ghvBtuScf":2516,"liquidDensityLbGal":4.233,"recoverableAsNgl":true,"inert":false},{"code":"IC4","moleFraction":0.0142,"c":4,"molarMassLbLbmol":58.122,"ghvBtuScf":3252,"liquidDensityLbGal":4.695,"recoverableAsNgl":true,"inert":false},{"code":"NC4","moleFraction":0.0236,"c":4,"molarMassLbLbmol":58.122,"ghvBtuScf":3263,"liquidDensityLbGal":4.872,"recoverableAsNgl":true,"inert":false},{"code":"C5","moleFraction":0.0127,"c":5,"molarMassLbLbmol":72.15,"ghvBtuScf":4010,"liquidDensityLbGal":5.253,"recoverableAsNgl":true,"inert":false},{"code":"N2","moleFraction":0.0231,"c":0,"molarMassLbLbmol":28.014,"ghvBtuScf":0,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":true},{"code":"CO2","moleFraction":0.0367,"c":1,"molarMassLbLbmol":44.01,"ghvBtuScf":0,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":true}]'::jsonb;
  v_adibawa_components jsonb := '[{"code":"C1","moleFraction":0.801,"c":1,"molarMassLbLbmol":16.043,"ghvBtuScf":1010,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":false},{"code":"C2","moleFraction":0.071,"c":2,"molarMassLbLbmol":30.07,"ghvBtuScf":1770,"liquidDensityLbGal":2.971,"recoverableAsNgl":true,"inert":false},{"code":"C3","moleFraction":0.041,"c":3,"molarMassLbLbmol":44.096,"ghvBtuScf":2516,"liquidDensityLbGal":4.233,"recoverableAsNgl":true,"inert":false},{"code":"IC4","moleFraction":0.009,"c":4,"molarMassLbLbmol":58.122,"ghvBtuScf":3252,"liquidDensityLbGal":4.695,"recoverableAsNgl":true,"inert":false},{"code":"NC4","moleFraction":0.015,"c":4,"molarMassLbLbmol":58.122,"ghvBtuScf":3263,"liquidDensityLbGal":4.872,"recoverableAsNgl":true,"inert":false},{"code":"C5","moleFraction":0.008,"c":5,"molarMassLbLbmol":72.15,"ghvBtuScf":4010,"liquidDensityLbGal":5.253,"recoverableAsNgl":true,"inert":false},{"code":"N2","moleFraction":0.027,"c":0,"molarMassLbLbmol":28.014,"ghvBtuScf":0,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":true},{"code":"CO2","moleFraction":0.028,"c":1,"molarMassLbLbmol":44.01,"ghvBtuScf":0,"liquidDensityLbGal":null,"recoverableAsNgl":false,"inert":true}]'::jsonb;
  v_constants jsonb := '{"scfPerLbmol":379.49,"lbPerKg":2.20462262,"co2MolarMass":44.009,"ch4MolarMass":16.043,"modularExponent":0.9,"waterKgM3":999.1}'::jsonb;
  v_tol_of jsonb := '{"eriemu_ghv_btu_scf":0.0001,"eriemu_gpm_c3plus":0.0001,"eriemu_c3plus_kg_per_mscf":0.0001,"eriemu_flare_co2_t":0.01,"eriemu_flare_ch4_t":0.01,"eriemu_flare_co2e_t":0.01,"adibawa_capital_usd":0.01,"adibawa_cng_kg_per_year":0.0001,"adibawa_value_per_mscf":0.0001,"adibawa_avoided_co2e_t":0.01,"adibawa_net_abatement_t":0.01,"adibawa_breakeven_credit_usd_per_t":0.0001,"asaba_usable_lpg_t":0.0001,"asaba_vaporizer_design_kw":0.0001,"asaba_carousel_wait_min":0.0001,"asaba_bank_mass_kg":0.0001,"asaba_left_in_banks_kg":0.001,"asaba_payback_years":0.0001}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'gasvalue' and active;
  if v_structures <> 3 then
    raise exception 'gasvalue go-live refused: gasvalue has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'gasvalue';
  if v_questions <> 396 then
    raise exception 'gasvalue go-live refused: gasvalue has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'gasvalue'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'gasvalue' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'gasvalue' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'gasvalue'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'gasvalue' and s.active;
  if v_lessons <> 78 then
    raise exception 'gasvalue go-live refused: gasvalue carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'gasvalue' and s.active;
  if v_modules <> 18 then
    raise exception 'gasvalue go-live refused: gasvalue carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'gasvalue' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'gasvalue';
  if v_capstones <> 3 then
    raise exception 'gasvalue go-live refused: gasvalue has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'gasvalue';
  if v_graded <> 18 then
    raise exception 'gasvalue go-live refused: gasvalue has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'gasvalue' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  -- ------------------------------------------------------------ catalogue
  if not exists (select 1 from public.academy_apps
                  where slug = 'gasvalue' and module = 'energy_transition'
                    and path_order = 51 and prereq_slug is null) then
    raise exception 'gasvalue go-live refused: the gasvalue catalogue row is not energy_transition at path_order 51 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 51 and slug <> 'gasvalue') then
    raise exception 'gasvalue go-live refused: another course already holds path_order 51';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 52 and slug <> 'carbon') then
    raise exception 'gasvalue go-live refused: path_order 52, the slot of the wave sibling carbon, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 48 and slug <> 'crude') then
    raise exception 'gasvalue go-live refused: path_order 48, the slot of the live course crude, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 49 and slug <> 'refinery') then
    raise exception 'gasvalue go-live refused: path_order 49, the slot of the live course refinery, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 50 and slug <> 'supply') then
    raise exception 'gasvalue go-live refused: path_order 50, the slot of the live course supply, is held by another course';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class, with a label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % graded field(s) are not a number at their precision.json tolerance with a label and a unit: %', v_n, v_names;
  end if;

  select count(distinct f->>'key') into v_n
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue';
  if v_n <> 18 then
    raise exception 'gasvalue go-live refused: the capstones grade % distinct keys, expected the 18 precision.json classifies', v_n;
  end if;


  -- ---------------------------------------- the prompts the learner reads
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- gasvalue_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gasvalue' and tier = 'beginner';
  if v_prompt is distinct from 'ERIEMU FLOW STATION. The station flares its associated gas. Every figure is invented and illustrative. The laboratory sheet, as mole fractions with the component figures to use: Methane (C1) 0.7215: 1 carbon per molecule, molar mass 16.043 lb/lbmol, heating value 1010 Btu/scf; Ethane (C2) 0.0968: 2 carbon per molecule, molar mass 30.07 lb/lbmol, heating value 1770 Btu/scf, liquid density 2.971 lb/gal; Propane (C3) 0.0634: 3 carbon per molecule, molar mass 44.096 lb/lbmol, heating value 2516 Btu/scf, liquid density 4.233 lb/gal; Iso-butane (IC4) 0.0142: 4 carbon per molecule, molar mass 58.122 lb/lbmol, heating value 3252 Btu/scf, liquid density 4.695 lb/gal; n-Butane (NC4) 0.0236: 4 carbon per molecule, molar mass 58.122 lb/lbmol, heating value 3263 Btu/scf, liquid density 4.872 lb/gal; Pentanes plus (C5) 0.0127: 5 carbon per molecule, molar mass 72.15 lb/lbmol, heating value 4010 Btu/scf, liquid density 5.253 lb/gal; Nitrogen (N2) 0.0231: 0 carbon per molecule, molar mass 28.014 lb/lbmol, heating value 0 Btu/scf; Carbon dioxide (CO2) 0.0367: 1 carbon per molecule, molar mass 44.01 lb/lbmol, heating value 0 Btu/scf. The sheet is used as reported: scale it to one before using it. Take one lb-mol as 379.49 scf and one kg as 2.20462262 lb. The station flares 12.4 MMscfd on 347 days a year. The flare study gives a destruction efficiency of 0.976 and a combustion efficiency of 0.961, and uses a methane global warming potential of 28.7. Work the flare by 40 CFR 98.233(n) with CO2 at 44.009 and methane at 16.043 kg/kmol. Give six numbers. (1) The gas''s gross heating value in Btu/scf. (2) Its liquids content, propane and heavier, in gallons per Mscf. (3) The mass of propane and heavier in one Mscf, in kg. (4) The flare''s CO2 in tonnes a year. (5) Its methane in tonnes a year. (6) Its CO2e in tonnes a year. Quote (1) to (3) to 4 decimals and (4) to (6) to 3.' then
    raise exception 'gasvalue go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gasvalue' and tier = 'intermediate';
  if v_prompt is distinct from 'ADIBAWA GAS PARCEL. A developer bids to take a flared parcel as CNG. Every figure is invented and illustrative. The gas, as mole fractions with the component figures to use: Methane (C1) 0.801: 1 carbon per molecule, molar mass 16.043 lb/lbmol, heating value 1010 Btu/scf; Ethane (C2) 0.071: 2 carbon per molecule, molar mass 30.07 lb/lbmol, heating value 1770 Btu/scf, liquid density 2.971 lb/gal; Propane (C3) 0.041: 3 carbon per molecule, molar mass 44.096 lb/lbmol, heating value 2516 Btu/scf, liquid density 4.233 lb/gal; Iso-butane (IC4) 0.009: 4 carbon per molecule, molar mass 58.122 lb/lbmol, heating value 3252 Btu/scf, liquid density 4.695 lb/gal; n-Butane (NC4) 0.015: 4 carbon per molecule, molar mass 58.122 lb/lbmol, heating value 3263 Btu/scf, liquid density 4.872 lb/gal; Pentanes plus (C5) 0.008: 5 carbon per molecule, molar mass 72.15 lb/lbmol, heating value 4010 Btu/scf, liquid density 5.253 lb/gal; Nitrogen (N2) 0.027: 0 carbon per molecule, molar mass 28.014 lb/lbmol, heating value 0 Btu/scf; Carbon dioxide (CO2) 0.028: 1 carbon per molecule, molar mass 44.01 lb/lbmol, heating value 0 Btu/scf. Take one lb-mol as 379.49 scf and one kg as 2.20462262 lb. The parcel is 16.8 MMscfd on 342 days a year. The flare today has a destruction efficiency of 0.968 and a combustion efficiency of 0.952; use a methane global warming potential of 27.9, CO2 at 44.009 and methane at 16.043 kg/kmol, and 40 CFR 98.233(n). The CNG plant yields 17.2 kg of CNG per Mscf processed and recovers 0.87 of the parcel; CNG sells at 0.43 dollars per kg. A reference plant of 7 MMscfd cost 27000000 dollars; scale it by the modular power law with an exponent of 0.9. Fixed operating cost is 2100000 dollars a year and variable operating cost 0.38 dollars per Mscf of the parcel. The declared counterfactual: cng displacing diesel in port harcourt haulage; burning the CNG emits 236000 tCO2e a year and the diesel it displaces would have emitted 281000 tCO2e a year. The bid team typed credit prices of 30, 10, 20, 15 dollars per tonne, in that order, against a hurdle margin of 39500000 dollars a year. Give six numbers. (1) The plant''s capital cost in dollars, to 2 decimals. (2) The CNG it makes in kg a year, to 4 decimals. (3) Its gross margin per Mscf of the parcel in dollars, to 4 decimals. (4) The flare CO2e the plant avoids in tonnes a year, to 3 decimals. (5) The net abatement against the counterfactual in tonnes a year, to 3 decimals. (6) The credit price at which the route just clears the hurdle, in dollars per tonne, to 4 decimals.' then
    raise exception 'gasvalue go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gasvalue' and tier = 'advanced';
  if v_prompt is distinct from 'ASABA ENERGY HUB. An LPG depot and a CNG station share a site. Every figure is invented and illustrative. The LPG is propane 0.32 by liquid volume (density 506 kg/m3, molar mass 44.096 kg/kmol, latent heat 428 kJ/kg) and butane 0.68 by liquid volume (density 581 kg/m3, molar mass 58.122 kg/kmol, latent heat 383 kJ/kg). The vessel holds 220 m3 of water capacity and its code limit is a filling density of 0.43 of the water capacity by weight, with water at 15 C taken as 999.1 kg/m3. The vaporizer takes 780 kg/h of that LPG entering at 21 C (liquid heat capacity 2.5 kJ/kg K); at the vaporizer''s pressure it boils at 41 C, and the vapour leaves at 58 C (vapour heat capacity 1.7 kJ/kg K); add a design margin of 12 percent. The bottling carousel fills 4100 cylinders a day over a 11 hour shift, 2.3 minutes a cylinder, on 20 positions each available 0.93 of the time; run the queue on the positions wholly working. The CNG is gas of specific gravity 0.63 at 34 C, and every pressure below is read on a gauge; the site''s atmosphere is 1.013 bar. A storage bank of 3 m3 reads 245 bar. The cascade: Low bank 2.5 m3 at 180 bar, Mid bank 2.5 m3 at 225 bar, High bank 2.5 m3 at 260 bar; each taxi tank is 0.075 m3 and arrives at 15 bar and is filled to 200 bar, isothermally, equalising with the lowest bank first; use real-gas Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. A taxi covers 62000 km a year on 11 litres of PMS per 100 km at 820 naira a litre (32.2 MJ a litre); CNG costs 410 naira a kg (47.1 MJ a kg), no measured consumption on CNG exists, and the converted engine turns CNG energy into distance 0.9 times as well as PMS energy. The conversion costs 1350000 naira and adds 72000 naira a year of maintenance. Give six numbers. (1) The usable LPG in the vessel, in tonnes, to 4 decimals. (2) The vaporizer''s design duty in kW, to 4 decimals. (3) The average wait of a cylinder for a position, in minutes, to 4 decimals. (4) The gas in the storage bank, in kg, to 4 decimals. (5) The gas left in the three cascade banks when the next taxi can no longer be filled to target, in kg, to 3 decimals. (6) The taxi''s simple payback in years, undiscounted, to 4 decimals.' then
    raise exception 'gasvalue go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_eriemu_ghv_btu_scf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_ghv_btu_scf';
  select (f->>'expected')::numeric into v_g_eriemu_gpm_c3plus
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_gpm_c3plus';
  select (f->>'expected')::numeric into v_g_eriemu_c3plus_kg_per_mscf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_c3plus_kg_per_mscf';
  select (f->>'expected')::numeric into v_g_eriemu_flare_co2_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_flare_co2_t';
  select (f->>'expected')::numeric into v_g_eriemu_flare_ch4_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_flare_ch4_t';
  select (f->>'expected')::numeric into v_g_eriemu_flare_co2e_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'beginner' and f->>'key' = 'eriemu_flare_co2e_t';
  select (f->>'expected')::numeric into v_g_adibawa_capital_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_capital_usd';
  select (f->>'expected')::numeric into v_g_adibawa_cng_kg_per_year
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_cng_kg_per_year';
  select (f->>'expected')::numeric into v_g_adibawa_value_per_mscf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_value_per_mscf';
  select (f->>'expected')::numeric into v_g_adibawa_avoided_co2e_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_avoided_co2e_t';
  select (f->>'expected')::numeric into v_g_adibawa_net_abatement_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_net_abatement_t';
  select (f->>'expected')::numeric into v_g_adibawa_breakeven_credit_usd_per_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'intermediate' and f->>'key' = 'adibawa_breakeven_credit_usd_per_t';
  select (f->>'expected')::numeric into v_g_asaba_usable_lpg_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_usable_lpg_t';
  select (f->>'expected')::numeric into v_g_asaba_vaporizer_design_kw
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_vaporizer_design_kw';
  select (f->>'expected')::numeric into v_g_asaba_carousel_wait_min
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_carousel_wait_min';
  select (f->>'expected')::numeric into v_g_asaba_bank_mass_kg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_bank_mass_kg';
  select (f->>'expected')::numeric into v_g_asaba_left_in_banks_kg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_left_in_banks_kg';
  select (f->>'expected')::numeric into v_g_asaba_payback_years
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue' and c.tier = 'advanced' and f->>'key' = 'asaba_payback_years';
  if v_g_eriemu_ghv_btu_scf is null
     or v_g_eriemu_gpm_c3plus is null
     or v_g_eriemu_c3plus_kg_per_mscf is null
     or v_g_eriemu_flare_co2_t is null
     or v_g_eriemu_flare_ch4_t is null
     or v_g_eriemu_flare_co2e_t is null
     or v_g_adibawa_capital_usd is null
     or v_g_adibawa_cng_kg_per_year is null
     or v_g_adibawa_value_per_mscf is null
     or v_g_adibawa_avoided_co2e_t is null
     or v_g_adibawa_net_abatement_t is null
     or v_g_adibawa_breakeven_credit_usd_per_t is null
     or v_g_asaba_usable_lpg_t is null
     or v_g_asaba_vaporizer_design_kw is null
     or v_g_asaba_carousel_wait_min is null
     or v_g_asaba_bank_mass_kg is null
     or v_g_asaba_left_in_banks_kg is null
     or v_g_asaba_payback_years is null then
    raise exception 'gasvalue go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is a number
  -- token in any prompt, dataset, title or label: not within its own
  -- tolerance, and not, as a token with decimals, its own rounding. None of the
  -- 111 engine-derived intermediates on the way to a graded field is
  -- printed as its own rounding (a token with decimals), and neither of the
  -- derived counts is printed as a whole number.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where c.app_slug = 'gasvalue' and p.app_slug = 'gasvalue'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or ((case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end) > 0
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end))));
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         jsonb_each_text('{"ERIEMU normalised C1":0.72731855,"ERIEMU normalised C2":0.09758065,"ERIEMU normalised C3":0.06391129,"ERIEMU normalised IC4":0.01431452,"ERIEMU normalised NC4":0.02379032,"ERIEMU normalised C5":0.01280242,"ERIEMU normalised N2":0.02328629,"ERIEMU normalised CO2":0.03699597,"ERIEMU co2MoleFraction":0.03699597,"ERIEMU methaneMoleFraction":0.72731855,"ERIEMU ghvBtuScf":1243.6266,"ERIEMU inertMoleFraction":0.06028226,"ERIEMU carbonPerMol":1.36764113,"ERIEMU hydrocarbonCarbonPerMol":1.33064516,"ERIEMU molarMassLbLbmol":22.839812,"ERIEMU kgPerMscf":27.29970393,"ERIEMU c3PlusKgPerMscf":7.11980244,"ERIEMU gpmC2Plus":6.035125,"ERIEMU gpmC3Plus":3.432605,"ERIEMU scfPerYear":4302800000,"ERIEMU flareCo2Tonnes":297803.716,"ERIEMU flareCh4Tonnes":1440.251,"ERIEMU flareCo2eTonnes":339138.908,"ERIEMU methaneShareOfFlareCo2e":0.121883,"ADIBAWA ghvBtuScf":1148.129,"ADIBAWA inertMoleFraction":0.055,"ADIBAWA carbonPerMol":1.23,"ADIBAWA hydrocarbonCarbonPerMol":1.202,"ADIBAWA molarMassLbLbmol":20.754135,"ADIBAWA kgPerMscf":24.80675984,"ADIBAWA c3PlusKgPerMscf":4.5181907,"ADIBAWA gpmC2Plus":4.073761,"ADIBAWA gpmC3Plus":2.180158,"ADIBAWA mscfPerYear":5745600,"ADIBAWA productPerYear":85977158.4,"ADIBAWA revenuePerYear":36970178.11,"ADIBAWA operatingCostPerYear":4283328,"ADIBAWA grossMarginPerYear":32686850.11,"ADIBAWA valuePerMscf":5.689023,"ADIBAWA capitalCost":59368200.01,"ADIBAWA yieldCeilingPerMscf":24.80675984,"ADIBAWA scfPerYear":5745600000,"ADIBAWA flareCo2Tonnes":354309.29,"ADIBAWA flareCh4Tonnes":2824.027,"ADIBAWA flareCo2eTonnes":433099.648,"ADIBAWA avoidedFlareCo2eTonnes":376796.694,"ADIBAWA netAbatementTonnesCo2ePerYear":421796.694,"ADIBAWA breakeven":16.152687,"ADIBAWA credit revenue at 30":12653900.82,"ADIBAWA total margin at 30":45340750.93,"ADIBAWA credit revenue at 10":4217966.94,"ADIBAWA total margin at 10":36904817.05,"ADIBAWA credit revenue at 20":8435933.88,"ADIBAWA total margin at 20":41122783.99,"ADIBAWA credit revenue at 15":6326950.41,"ADIBAWA total margin at 15":39013800.52,"ASABA blend density":557,"ASABA blend latent heat":396.081508,"ASABA blend molar mass":53.202593,"ASABA mass fraction propane":0.2907,"ASABA mass fraction butane":0.7093,"ASABA vessel usableM3":169.6856,"ASABA vessel usableTonnes":94.5149,"ASABA vessel vapourSpaceM3":50.3144,"ASABA vessel coverDays":8.592,"ASABA vessel reorderAtTonnes":66,"ASABA vessel ullageAtReorderTonnes":28.5149,"ASABA vaporizer Warm the liquid to boiling":10.833333,"ASABA vaporizer Boil it":85.81766,"ASABA vaporizer Superheat the vapour":6.261667,"ASABA vaporizer duty":102.91266,"ASABA vaporizer design duty":115.262179,"ASABA arrivals per hour":372.7273,"ASABA effective positions":18.6,"ASABA queue offered":14.287878787878787,"ASABA queue utilisation":0.7937710437710437,"ASABA queue probabilityOfWaiting":0.2651151157681734,"ASABA queue averageWaitMinutes":0.1642631615249336,"ASABA queue queueLength":1.0204226700791321,"ASABA throughput capacity":5337.39,"ASABA storage bank bar(a)":246.013,"ASABA Low bar(a)":181.013,"ASABA Mid bar(a)":226.013,"ASABA High bar(a)":261.013,"ASABA vehicle start bar(a)":16.012999999999998,"ASABA vehicle target bar(a)":201.013,"ASABA bank z":0.83684,"ASABA bank ppr":5.3031,"ASABA bank tpr":1.5357,"ASABA bank massKg":630.12764,"ASABA bank idealMassKg":527.31631,"ASABA bank realVersusIdeal":1.194971,"ASABA cascade kgPerFill":12.5503,"ASABA cascade deliveredKg":602.413,"ASABA cascade storedKg":1447.711,"ASABA cascade leftInBanksKg":845.298,"ASABA cascade cascadeEfficiency":0.416114,"ASABA cascade nextVehicleReachesBar":200.308,"ASABA cascade end Low":60.107,"ASABA cascade end Mid":122.874,"ASABA cascade end High":203.11,"ASABA switch newFuelConsumptionPer100Km":8.355744,"ASABA switch annualSaving":3396369.8,"ASABA switch savingPerKm":54.780158,"ASABA switch simplePaybackYears":0.397483,"ASABA switch baseFuel unitsPerYear":6820,"ASABA switch baseFuel costPerYear":5592400,"ASABA switch baseFuel costPerKm":90.2,"ASABA switch newFuel unitsPerYear":5180.561,"ASABA switch newFuel costPerYear":2124030.2,"ASABA switch newFuel costPerKm":34.258552}'::jsonb) d(k, v)
   where p.app_slug = 'gasvalue'
     and (case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end) > 0
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end));
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         jsonb_each_text('{"ASABA positions wholly working":18,"ASABA minimum positions":16,"ASABA fills before recharge":48}'::jsonb) d(k, v)
   where p.app_slug = 'gasvalue'
     and (case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end) = 0
     and (m[1])::numeric = d.v::numeric;
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % engine-derived count(s) are printed as a whole number in a capstone a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (195), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where p.app_slug = 'gasvalue';
  if v_n <> 195 then
    raise exception 'gasvalue go-live refused: the prompt sweep read % number tokens, and gen_course.py read 195 from the same prompts', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'gasvalue') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'gasvalue') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (486 distinct values, read by
  -- the regex -?[0-9]+[.]?[0-9]*): a graded field that is a figure the digest
  -- prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasvalue'
     and exists (select 1 from unnest(array[0, 0.001, 0.002, 0.003, 0.0045, 0.0052, 0.005582, 0.0056, 0.0067, 0.008, 0.01, 0.012, 0.0122, 0.013, 0.0132, 0.014, 0.015, 0.0175, 0.018, 0.0183, 0.02, 0.021, 0.0213, 0.0222, 0.0255, 0.0267, 0.027, 0.028, 0.02831684659, 0.0284, 0.031, 0.04, 0.045, 0.046, 0.0466, 0.05, 0.0526, 0.0565, 0.06, 0.0601, 0.061, 0.0619, 0.062, 0.0633, 0.08, 0.085, 0.09, 0.0912, 0.1, 0.102, 0.1031, 0.1036, 0.104, 0.1078, 0.111, 0.1111, 0.1505, 0.1548, 0.1568, 0.1667, 0.1769, 0.1998, 0.2, 0.2024, 0.2189, 0.2376, 0.2496, 0.28, 0.3, 0.3004, 0.303, 0.3035, 0.3137, 0.319, 0.3421, 0.35, 0.3548, 0.3659, 0.3671, 0.3965, 0.4, 0.42, 0.4241, 0.4343, 0.4473, 0.45, 0.4577, 0.4667, 0.4775, 0.4866, 0.489, 0.5, 0.55, 0.5556, 0.5765, 0.6, 0.62, 0.6329, 0.65, 0.6602, 0.681, 0.7, 0.72, 0.73, 0.7333, 0.7411, 0.742, 0.7476, 0.7588, 0.78, 0.8, 0.8062, 0.8181, 0.82, 0.8268, 0.8368, 0.8369, 0.8421, 0.85, 0.8584, 0.86, 0.88, 0.9, 0.92, 0.925, 0.94, 0.95, 0.955, 0.97, 0.9727, 0.9798, 0.98, 0.985, 0.99, 1, 1.013, 1.043, 1.058, 1.1, 1.1649, 1.1949, 1.2, 1.2054, 1.2205, 1.2224, 1.2408, 1.25, 1.28, 1.3, 1.3157, 1.332, 1.36, 1.5, 1.5266, 1.68, 1.7019, 1.8, 1.8329, 2, 2.2, 2.20462262, 2.3, 2.4003, 2.45, 2.5, 2.6723, 2.6894, 2.75, 2.7737, 2.8321, 2.971, 3, 3.2205, 4, 4.233, 4.2447, 4.5, 4.695, 4.872, 4.9479, 5, 5.0897, 5.1567, 5.253, 5.3782, 5.5819, 5.7647, 5.8084, 5.9942, 6, 6.6647, 7, 7.2, 7.480519, 7.5, 7.8679, 7.868, 7.8904, 8, 8.2404, 8.604, 8.8472, 8.8836, 8.884, 9, 9.3333, 9.5, 10, 10.1449, 11, 11.6667, 11.7333, 12, 13, 13.362, 14, 14.4, 14.503773773, 14.696, 15, 16, 16.0133, 16.0152, 16.02, 16.043, 16.56, 17, 17.588, 18, 18.5, 19, 19.1757, 20, 21, 21.0224, 21.3303, 22, 22.3436, 22.5, 22.9433, 23, 24, 25, 25.4954, 26, 26.7066, 26.706618, 27, 27.8271, 28, 28.014, 28.5, 29, 29.8, 30, 30.07, 31, 31.0685, 32, 33, 33.4842, 34, 35, 35.1162, 35.707, 35.9417, 36, 37, 37.077, 38, 38.5507, 40, 42, 44.009, 44.01, 44.096, 45, 48, 52.0456, 52.6038, 52.7066, 52.7681, 53, 55, 57, 58, 58.122, 58.911, 60, 60.1959, 62.9433, 69.5584, 71.0685, 71.8176, 72.15, 72.5189, 80, 85.8215, 95.422, 98.233, 98.6948, 100, 109.2, 112.923, 118.335, 127.5, 150, 195.564, 197.759, 200, 202.647, 224.186, 230, 248.411, 249, 250, 250.013, 255, 270, 288.8768, 298.411, 320, 327.7131, 350, 355, 356.2099, 366, 367, 370, 378.83, 379.49, 380, 384.7067, 385, 395, 397.7592, 399, 399.6821, 400, 400.5918, 410, 424.4393, 425, 425.6293, 425.6447, 430, 448.1628, 455, 470, 500, 508, 515, 542.689, 553.6, 557.4, 575, 584, 590, 608.505, 650, 665.879, 780, 950, 999.1, 1000, 1010, 1035.605, 1084.729, 1100, 1136.49, 1210.78, 1248.411, 1274.384, 1308.6069, 1531.658, 1537.2878, 1770, 1894.151, 2010.348, 2083.055, 2086.427, 2365.8, 2400, 2516, 2798.285, 2798.286, 3200, 3252, 3263, 3600, 3788.301, 4010, 4516.36, 5579.71, 7296, 7700, 11352.9, 25913.573, 40070.625, 55000, 60000, 62032.865, 91200, 98496, 100000, 128000, 133751.879, 140054.324, 153913.573, 156000, 171818.645, 181146.263, 182079.024, 184877.31, 188608.357, 190032.865, 190473.881, 191681.16, 199897.495, 202989.652, 204808.832, 205000, 212733.75, 215946.438, 218032.865, 218744.723, 227538.64, 237591.952, 284710.023, 931875, 1200000, 1744262.92, 1899679.94, 1900000, 1990363, 2120289.86, 2600000, 2616394.38, 2625000, 2643920.39, 2662500, 2831875, 3345500, 3412141.6331, 3491850, 3507666.67, 3600000, 3825710.14, 3995333.33, 4360657.3, 4798125, 4959777.43, 5200000, 5335863, 6006000, 6930625, 7540432.5, 8721314.6, 9909377.93, 11301509.38, 12338557.5, 18232134.38, 20000000, 21008150, 22752412.92, 23624544.38, 23840025, 24000000, 24500000, 25368807.3, 27438303.12, 29331801.26, 29337983.06, 29729464.6, 31975721.65, 32753824.67, 37713602.1, 38000000, 42870938.5, 43345500, 50000000, 52780316.43, 80000000, 2625000000, 2662500000, 2745000000]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'gasvalue go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  -- The seeded value is the engine's return at full precision, exactly.
  if v_g_eriemu_ghv_btu_scf <> 1243.6266 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 1243.6266 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_ghv_btu_scf]', v_g_eriemu_ghv_btu_scf;
  end if;
  if v_g_eriemu_gpm_c3plus <> 3.432605 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 3.432605 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_gpm_c3plus]', v_g_eriemu_gpm_c3plus;
  end if;
  if v_g_eriemu_c3plus_kg_per_mscf <> 7.11980244 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 7.11980244 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_c3plus_kg_per_mscf]', v_g_eriemu_c3plus_kg_per_mscf;
  end if;
  if v_g_eriemu_flare_co2_t <> 297803.716 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 297803.716 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_flare_co2_t]', v_g_eriemu_flare_co2_t;
  end if;
  if v_g_eriemu_flare_ch4_t <> 1440.251 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 1440.251 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_flare_ch4_t]', v_g_eriemu_flare_ch4_t;
  end if;
  if v_g_eriemu_flare_co2e_t <> 339138.908 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 339138.908 the engine returned through gasvalue_capstone.mjs [graded field: beginner/eriemu_flare_co2e_t]', v_g_eriemu_flare_co2e_t;
  end if;
  if v_g_adibawa_capital_usd <> 59368200.01 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 59368200.01 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_capital_usd]', v_g_adibawa_capital_usd;
  end if;
  if v_g_adibawa_cng_kg_per_year <> 85977158.4 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 85977158.4 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_cng_kg_per_year]', v_g_adibawa_cng_kg_per_year;
  end if;
  if v_g_adibawa_value_per_mscf <> 5.689023 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 5.689023 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_value_per_mscf]', v_g_adibawa_value_per_mscf;
  end if;
  if v_g_adibawa_avoided_co2e_t <> 376796.694 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 376796.694 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_avoided_co2e_t]', v_g_adibawa_avoided_co2e_t;
  end if;
  if v_g_adibawa_net_abatement_t <> 421796.694 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 421796.694 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_net_abatement_t]', v_g_adibawa_net_abatement_t;
  end if;
  if v_g_adibawa_breakeven_credit_usd_per_t <> 16.152687 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 16.152687 the engine returned through gasvalue_capstone.mjs [graded field: intermediate/adibawa_breakeven_credit_usd_per_t]', v_g_adibawa_breakeven_credit_usd_per_t;
  end if;
  if v_g_asaba_usable_lpg_t <> 94.5149 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 94.5149 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_usable_lpg_t]', v_g_asaba_usable_lpg_t;
  end if;
  if v_g_asaba_vaporizer_design_kw <> 115.262179 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 115.262179 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_vaporizer_design_kw]', v_g_asaba_vaporizer_design_kw;
  end if;
  if v_g_asaba_carousel_wait_min <> 0.1642631615249336 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 0.1642631615249336 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_carousel_wait_min]', v_g_asaba_carousel_wait_min;
  end if;
  if v_g_asaba_bank_mass_kg <> 630.12764 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 630.12764 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_bank_mass_kg]', v_g_asaba_bank_mass_kg;
  end if;
  if v_g_asaba_left_in_banks_kg <> 845.298 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 845.298 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_left_in_banks_kg]', v_g_asaba_left_in_banks_kg;
  end if;
  if v_g_asaba_payback_years <> 0.397483 then
    raise exception 'gasvalue go-live refused: the seeded value % is not the 0.397483 the engine returned through gasvalue_capstone.mjs [graded field: advanced/asaba_payback_years]', v_g_asaba_payback_years;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, ERIEMU. The sheet is scaled to one. The heating value is the
  -- mole-weighted sum of the component heating values; a thousand scf is
  -- 1000 / (scf a lb-mol) lb-mol; the C3+ liquids are, component by component,
  -- lb-mol times mole fraction times molar mass over the liquid density in
  -- lb/gal, and the C3+ mass is the same pounds over the stated pound a kg.
  -- The flare by 40 CFR 98.233(n): the CO2 in the gas passes through, the
  -- hydrocarbon carbon burns to CO2 at the COMBUSTION efficiency, the methane
  -- escapes at one less the DESTRUCTION efficiency, and CO2e adds the methane
  -- at the stated GWP; kg by the stated pound, tonnes over 1000.

  select sum((e->>'moleFraction')::numeric) into v_sum from jsonb_array_elements(v_eriemu_components) e;
  select sum((e->>'moleFraction')::numeric / v_sum * (e->>'c')::numeric) into v_hc from jsonb_array_elements(v_eriemu_components) e
   where not (e->>'inert')::boolean and e->>'code' <> 'CO2';
  select coalesce(sum((e->>'moleFraction')::numeric / v_sum), 0) into v_yco2 from jsonb_array_elements(v_eriemu_components) e where e->>'code' = 'CO2';
  select coalesce(sum((e->>'moleFraction')::numeric / v_sum), 0) into v_ych4 from jsonb_array_elements(v_eriemu_components) e where e->>'code' = 'C1';
  select sum((e->>'moleFraction')::numeric / v_sum * (e->>'ghvBtuScf')::numeric) into v_s_eriemu_ghv_btu_scf
    from jsonb_array_elements(v_eriemu_components) e;
  select sum(1000.0 / (v_constants->>'scfPerLbmol')::numeric * (e->>'moleFraction')::numeric / v_sum * (e->>'molarMassLbLbmol')::numeric / (e->>'liquidDensityLbGal')::numeric)
    into v_s_eriemu_gpm_c3plus from jsonb_array_elements(v_eriemu_components) e where e->>'code' in ('C3', 'IC4', 'NC4', 'C5') and (e->>'recoverableAsNgl')::boolean;
  select sum(1000.0 / (v_constants->>'scfPerLbmol')::numeric * (e->>'moleFraction')::numeric / v_sum * (e->>'molarMassLbLbmol')::numeric) / (v_constants->>'lbPerKg')::numeric
    into v_s_eriemu_c3plus_kg_per_mscf from jsonb_array_elements(v_eriemu_components) e where e->>'code' in ('C3', 'IC4', 'NC4', 'C5') and (e->>'recoverableAsNgl')::boolean;

  v_lbmol := (v_eriemu_flare->>'volumeMMscfd')::numeric * 1000000.0 * (v_eriemu_flare->>'onstreamDays')::numeric / (v_constants->>'scfPerLbmol')::numeric;
  v_co2 := v_lbmol * ((v_eriemu_flare->>'flareCombustionEfficiency')::numeric * v_hc + v_yco2) * (v_constants->>'co2MolarMass')::numeric / (v_constants->>'lbPerKg')::numeric / 1000.0;
  v_ch4 := v_lbmol * v_ych4 * (1 - (v_eriemu_flare->>'flareDestructionEfficiency')::numeric) * (v_constants->>'ch4MolarMass')::numeric / (v_constants->>'lbPerKg')::numeric / 1000.0;
  v_co2e := v_co2 + v_ch4 * (v_eriemu_flare->>'gwpMethane')::numeric;
  v_s_eriemu_flare_co2_t := v_co2;
  v_s_eriemu_flare_ch4_t := v_ch4;
  v_s_eriemu_flare_co2e_t := v_co2e;

  -- PROFESSIONAL, ADIBAWA. The parcel's Mscf a year; the CNG is that times the
  -- yield times the recovery; the margin is revenue less the fixed and the
  -- variable operating cost, and per Mscf it is over the parcel's Mscf; the
  -- capital scales the reference plant by (capacity / reference) to the
  -- modular exponent. The plant avoids only the share of the flare it
  -- recovers; the net abatement takes off what burning the CNG emits and adds
  -- what the displaced diesel would have; the breakeven credit price is the
  -- margin short of the hurdle over the net tonnes, in closed form.
  v_mscf := (v_adibawa_flare->>'volumeMMscfd')::numeric * 1000.0 * (v_adibawa_flare->>'onstreamDays')::numeric;
  v_s_adibawa_cng_kg_per_year := v_mscf * (v_adibawa_route->>'productUnitPerMscf')::numeric * (v_adibawa_route->>'recoveryFraction')::numeric;
  v_margin := v_s_adibawa_cng_kg_per_year * (v_adibawa_route->>'pricePerProductUnit')::numeric
              - ((v_adibawa_route->>'fixedOpexPerYear')::numeric + v_mscf * (v_adibawa_route->>'variableOpexPerMscf')::numeric);
  v_s_adibawa_value_per_mscf := v_margin / v_mscf;
  v_s_adibawa_capital_usd := (v_adibawa_route->>'referenceCapitalCost')::numeric
      * power((v_adibawa_flare->>'volumeMMscfd')::numeric / (v_adibawa_route->>'referenceCapacityMMscfd')::numeric, (v_constants->>'modularExponent')::numeric);

  select sum((e->>'moleFraction')::numeric) into v_sum from jsonb_array_elements(v_adibawa_components) e;
  select sum((e->>'moleFraction')::numeric / v_sum * (e->>'c')::numeric) into v_hc from jsonb_array_elements(v_adibawa_components) e
   where not (e->>'inert')::boolean and e->>'code' <> 'CO2';
  select coalesce(sum((e->>'moleFraction')::numeric / v_sum), 0) into v_yco2 from jsonb_array_elements(v_adibawa_components) e where e->>'code' = 'CO2';
  select coalesce(sum((e->>'moleFraction')::numeric / v_sum), 0) into v_ych4 from jsonb_array_elements(v_adibawa_components) e where e->>'code' = 'C1';

  v_lbmol := (v_adibawa_flare->>'volumeMMscfd')::numeric * 1000000.0 * (v_adibawa_flare->>'onstreamDays')::numeric / (v_constants->>'scfPerLbmol')::numeric;
  v_co2 := v_lbmol * ((v_adibawa_flare->>'flareCombustionEfficiency')::numeric * v_hc + v_yco2) * (v_constants->>'co2MolarMass')::numeric / (v_constants->>'lbPerKg')::numeric / 1000.0;
  v_ch4 := v_lbmol * v_ych4 * (1 - (v_adibawa_flare->>'flareDestructionEfficiency')::numeric) * (v_constants->>'ch4MolarMass')::numeric / (v_constants->>'lbPerKg')::numeric / 1000.0;
  v_co2e := v_co2 + v_ch4 * (v_adibawa_flare->>'gwpMethane')::numeric;
  v_s_adibawa_avoided_co2e_t := v_co2e * (v_adibawa_route->>'recoveryFraction')::numeric;
  v_s_adibawa_net_abatement_t := v_s_adibawa_avoided_co2e_t - (v_adibawa_counterfactual->>'productCombustionTonnesCo2ePerYear')::numeric
                                 + (v_adibawa_counterfactual->>'displacedFuelTonnesCo2ePerYear')::numeric;
  if not (v_margin < (v_adibawa_credits->>'hurdleMarginPerYear')::numeric and v_s_adibawa_net_abatement_t > 0) then
    raise exception 'gasvalue go-live refused: the SQL route finds the route standing alone or abating nothing, so its breakeven is not a price [graded field: intermediate/adibawa_breakeven_credit_usd_per_t]';
  end if;
  v_s_adibawa_breakeven_credit_usd_per_t := ((v_adibawa_credits->>'hurdleMarginPerYear')::numeric - v_margin)
                                            / v_s_adibawa_net_abatement_t;

  -- EXPERT, ASABA. The fill limit is a filling density on the WATER capacity
  -- by weight: usable tonnes = water capacity x water density x the limit /
  -- 1000, whatever the blend. The blend's latent heat is on MASS fractions,
  -- the volume fractions carried through the component densities. The
  -- vaporizer warms the liquid to the boiling point at its pressure, boils it
  -- and superheats the vapour, kJ/h over 3600, plus the margin.
  v_s_asaba_usable_lpg_t := (v_asaba_vessel->>'vesselCapacityM3')::numeric * (v_constants->>'waterKgM3')::numeric
                            * (v_asaba_vessel->>'maxFillRatio')::numeric / 1000.0;
  select sum((e->>'volumeFraction')::numeric) into v_vsum from jsonb_array_elements(v_asaba_lpg) e;
  select sum((e->>'volumeFraction')::numeric / v_vsum * (e->>'liquidDensityKgM3')::numeric) into v_msum
    from jsonb_array_elements(v_asaba_lpg) e;
  select sum((e->>'volumeFraction')::numeric / v_vsum * (e->>'liquidDensityKgM3')::numeric / v_msum
             * (e->>'latentHeatKJkg')::numeric) into v_latent
    from jsonb_array_elements(v_asaba_lpg) e;
  v_s_asaba_vaporizer_design_kw := (v_asaba_vaporizer->>'massFlowKgHr')::numeric * ((v_asaba_vaporizer->>'liquidCpKJkgK')::numeric * ((v_asaba_vaporizer->>'boilingPointC')::numeric - (v_asaba_vaporizer->>'inletTempC')::numeric)
                                   + v_latent + (v_asaba_vaporizer->>'vapourCpKJkgK')::numeric * ((v_asaba_vaporizer->>'outletTempC')::numeric - (v_asaba_vaporizer->>'boilingPointC')::numeric))
                                   / 3600.0 * (1 + (v_asaba_vaporizer->>'designMarginPercent')::numeric / 100.0);

  -- The carousel is a queue on the positions WHOLLY working, the floor of
  -- positions x availability. Erlang C by the FACTORIAL form, a different
  -- algorithm from the engine's Erlang B recursion: lambda = cylinders over
  -- the shift hours, mu = 60 / fill minutes, A = lambda / mu; P(wait) =
  -- [A^c / c! * c / (c - A)] / [sum over k < c of A^k / k! + A^c / c! * c /
  -- (c - A)]; the mean wait is P(wait) / (c mu - lambda) hours, in minutes.
  v_lambda := (v_asaba_bottling->>'cylindersPerDay')::numeric / (v_asaba_bottling->>'shiftHoursPerDay')::numeric;
  v_mu := 60.0 / (v_asaba_bottling->>'fillMinutesPerCylinder')::numeric;
  v_a := v_lambda / v_mu;
  v_c := floor((v_asaba_bottling->>'positions')::numeric * (v_asaba_bottling->>'availabilityFraction')::numeric)::int;
  if not (v_c >= 1 and v_a < v_c) then
    raise exception 'gasvalue go-live refused: the SQL route finds the carousel with no stable queue on % positions [graded field: advanced/asaba_carousel_wait_min]', v_c;
  end if;
  v_s := 0;
  for v_k in 0 .. v_c - 1 loop
    v_s := v_s + power(v_a, v_k) / factorial(v_k);
  end loop;
  v_t := power(v_a, v_c) / factorial(v_c) * v_c / (v_c - v_a);
  v_s_asaba_carousel_wait_min := v_t / (v_s + v_t) / (v_c * v_mu - v_lambda) * 60.0;

  -- The taxi. No measured consumption on CNG exists, so it follows from
  -- energy equivalence: CNG a 100 km = PMS a 100 km x PMS energy / (CNG energy
  -- x the efficiency ratio). The saving a year is the PMS cost less the CNG
  -- cost less the extra maintenance, and the simple payback is the conversion
  -- cost over it, undiscounted.
  v_nc := (v_asaba_conversion->'baseFuel'->>'consumptionPer100Km')::numeric * (v_asaba_conversion->'baseFuel'->>'energyPerUnitMJ')::numeric
          / ((v_asaba_conversion->'newFuel'->>'energyPerUnitMJ')::numeric * (v_asaba_conversion->'newFuel'->>'efficiencyRatio')::numeric);
  v_saving := (v_asaba_conversion->'baseFuel'->>'consumptionPer100Km')::numeric / 100.0 * (v_asaba_conversion->>'annualDistanceKm')::numeric
              * (v_asaba_conversion->'baseFuel'->>'pricePerUnit')::numeric
              - v_nc / 100.0 * (v_asaba_conversion->>'annualDistanceKm')::numeric * (v_asaba_conversion->'newFuel'->>'pricePerUnit')::numeric
              - (v_asaba_conversion->>'annualExtraMaintenance')::numeric;
  if not (v_saving > 0) then
    raise exception 'gasvalue go-live refused: the SQL route finds the conversion saving nothing, so there is no payback [graded field: advanced/asaba_payback_years]';
  end if;
  v_s_asaba_payback_years := (v_asaba_conversion->>'conversionCost')::numeric / v_saving;

  if v_s_eriemu_ghv_btu_scf is null or abs(v_s_eriemu_ghv_btu_scf - v_g_eriemu_ghv_btu_scf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: beginner/eriemu_ghv_btu_scf]', v_s_eriemu_ghv_btu_scf, v_g_eriemu_ghv_btu_scf;
  end if;
  if abs(v_s_eriemu_ghv_btu_scf - v_g_eriemu_ghv_btu_scf) / 0.0001 > v_worst then
    v_worst := abs(v_s_eriemu_ghv_btu_scf - v_g_eriemu_ghv_btu_scf) / 0.0001; v_worst_key := 'beginner/eriemu_ghv_btu_scf';
  end if;
  if v_s_eriemu_gpm_c3plus is null or abs(v_s_eriemu_gpm_c3plus - v_g_eriemu_gpm_c3plus) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: beginner/eriemu_gpm_c3plus]', v_s_eriemu_gpm_c3plus, v_g_eriemu_gpm_c3plus;
  end if;
  if abs(v_s_eriemu_gpm_c3plus - v_g_eriemu_gpm_c3plus) / 0.0001 > v_worst then
    v_worst := abs(v_s_eriemu_gpm_c3plus - v_g_eriemu_gpm_c3plus) / 0.0001; v_worst_key := 'beginner/eriemu_gpm_c3plus';
  end if;
  if v_s_eriemu_c3plus_kg_per_mscf is null or abs(v_s_eriemu_c3plus_kg_per_mscf - v_g_eriemu_c3plus_kg_per_mscf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: beginner/eriemu_c3plus_kg_per_mscf]', v_s_eriemu_c3plus_kg_per_mscf, v_g_eriemu_c3plus_kg_per_mscf;
  end if;
  if abs(v_s_eriemu_c3plus_kg_per_mscf - v_g_eriemu_c3plus_kg_per_mscf) / 0.0001 > v_worst then
    v_worst := abs(v_s_eriemu_c3plus_kg_per_mscf - v_g_eriemu_c3plus_kg_per_mscf) / 0.0001; v_worst_key := 'beginner/eriemu_c3plus_kg_per_mscf';
  end if;
  if v_s_eriemu_flare_co2_t is null or abs(v_s_eriemu_flare_co2_t - v_g_eriemu_flare_co2_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_co2_t]', v_s_eriemu_flare_co2_t, v_g_eriemu_flare_co2_t;
  end if;
  if abs(v_s_eriemu_flare_co2_t - v_g_eriemu_flare_co2_t) / 0.01 > v_worst then
    v_worst := abs(v_s_eriemu_flare_co2_t - v_g_eriemu_flare_co2_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_co2_t';
  end if;
  if v_s_eriemu_flare_ch4_t is null or abs(v_s_eriemu_flare_ch4_t - v_g_eriemu_flare_ch4_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_ch4_t]', v_s_eriemu_flare_ch4_t, v_g_eriemu_flare_ch4_t;
  end if;
  if abs(v_s_eriemu_flare_ch4_t - v_g_eriemu_flare_ch4_t) / 0.01 > v_worst then
    v_worst := abs(v_s_eriemu_flare_ch4_t - v_g_eriemu_flare_ch4_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_ch4_t';
  end if;
  if v_s_eriemu_flare_co2e_t is null or abs(v_s_eriemu_flare_co2e_t - v_g_eriemu_flare_co2e_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_co2e_t]', v_s_eriemu_flare_co2e_t, v_g_eriemu_flare_co2e_t;
  end if;
  if abs(v_s_eriemu_flare_co2e_t - v_g_eriemu_flare_co2e_t) / 0.01 > v_worst then
    v_worst := abs(v_s_eriemu_flare_co2e_t - v_g_eriemu_flare_co2e_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_co2e_t';
  end if;
  if v_s_adibawa_capital_usd is null or abs(v_s_adibawa_capital_usd - v_g_adibawa_capital_usd) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/adibawa_capital_usd]', v_s_adibawa_capital_usd, v_g_adibawa_capital_usd;
  end if;
  if abs(v_s_adibawa_capital_usd - v_g_adibawa_capital_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_adibawa_capital_usd - v_g_adibawa_capital_usd) / 0.01; v_worst_key := 'intermediate/adibawa_capital_usd';
  end if;
  if v_s_adibawa_cng_kg_per_year is null or abs(v_s_adibawa_cng_kg_per_year - v_g_adibawa_cng_kg_per_year) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_cng_kg_per_year]', v_s_adibawa_cng_kg_per_year, v_g_adibawa_cng_kg_per_year;
  end if;
  if abs(v_s_adibawa_cng_kg_per_year - v_g_adibawa_cng_kg_per_year) / 0.0001 > v_worst then
    v_worst := abs(v_s_adibawa_cng_kg_per_year - v_g_adibawa_cng_kg_per_year) / 0.0001; v_worst_key := 'intermediate/adibawa_cng_kg_per_year';
  end if;
  if v_s_adibawa_value_per_mscf is null or abs(v_s_adibawa_value_per_mscf - v_g_adibawa_value_per_mscf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_value_per_mscf]', v_s_adibawa_value_per_mscf, v_g_adibawa_value_per_mscf;
  end if;
  if abs(v_s_adibawa_value_per_mscf - v_g_adibawa_value_per_mscf) / 0.0001 > v_worst then
    v_worst := abs(v_s_adibawa_value_per_mscf - v_g_adibawa_value_per_mscf) / 0.0001; v_worst_key := 'intermediate/adibawa_value_per_mscf';
  end if;
  if v_s_adibawa_avoided_co2e_t is null or abs(v_s_adibawa_avoided_co2e_t - v_g_adibawa_avoided_co2e_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/adibawa_avoided_co2e_t]', v_s_adibawa_avoided_co2e_t, v_g_adibawa_avoided_co2e_t;
  end if;
  if abs(v_s_adibawa_avoided_co2e_t - v_g_adibawa_avoided_co2e_t) / 0.01 > v_worst then
    v_worst := abs(v_s_adibawa_avoided_co2e_t - v_g_adibawa_avoided_co2e_t) / 0.01; v_worst_key := 'intermediate/adibawa_avoided_co2e_t';
  end if;
  if v_s_adibawa_net_abatement_t is null or abs(v_s_adibawa_net_abatement_t - v_g_adibawa_net_abatement_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/adibawa_net_abatement_t]', v_s_adibawa_net_abatement_t, v_g_adibawa_net_abatement_t;
  end if;
  if abs(v_s_adibawa_net_abatement_t - v_g_adibawa_net_abatement_t) / 0.01 > v_worst then
    v_worst := abs(v_s_adibawa_net_abatement_t - v_g_adibawa_net_abatement_t) / 0.01; v_worst_key := 'intermediate/adibawa_net_abatement_t';
  end if;
  if v_s_adibawa_breakeven_credit_usd_per_t is null or abs(v_s_adibawa_breakeven_credit_usd_per_t - v_g_adibawa_breakeven_credit_usd_per_t) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_breakeven_credit_usd_per_t]', v_s_adibawa_breakeven_credit_usd_per_t, v_g_adibawa_breakeven_credit_usd_per_t;
  end if;
  if abs(v_s_adibawa_breakeven_credit_usd_per_t - v_g_adibawa_breakeven_credit_usd_per_t) / 0.0001 > v_worst then
    v_worst := abs(v_s_adibawa_breakeven_credit_usd_per_t - v_g_adibawa_breakeven_credit_usd_per_t) / 0.0001; v_worst_key := 'intermediate/adibawa_breakeven_credit_usd_per_t';
  end if;
  if v_s_asaba_usable_lpg_t is null or abs(v_s_asaba_usable_lpg_t - v_g_asaba_usable_lpg_t) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/asaba_usable_lpg_t]', v_s_asaba_usable_lpg_t, v_g_asaba_usable_lpg_t;
  end if;
  if abs(v_s_asaba_usable_lpg_t - v_g_asaba_usable_lpg_t) / 0.0001 > v_worst then
    v_worst := abs(v_s_asaba_usable_lpg_t - v_g_asaba_usable_lpg_t) / 0.0001; v_worst_key := 'advanced/asaba_usable_lpg_t';
  end if;
  if v_s_asaba_vaporizer_design_kw is null or abs(v_s_asaba_vaporizer_design_kw - v_g_asaba_vaporizer_design_kw) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/asaba_vaporizer_design_kw]', v_s_asaba_vaporizer_design_kw, v_g_asaba_vaporizer_design_kw;
  end if;
  if abs(v_s_asaba_vaporizer_design_kw - v_g_asaba_vaporizer_design_kw) / 0.0001 > v_worst then
    v_worst := abs(v_s_asaba_vaporizer_design_kw - v_g_asaba_vaporizer_design_kw) / 0.0001; v_worst_key := 'advanced/asaba_vaporizer_design_kw';
  end if;
  if v_s_asaba_carousel_wait_min is null or abs(v_s_asaba_carousel_wait_min - v_g_asaba_carousel_wait_min) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/asaba_carousel_wait_min]', v_s_asaba_carousel_wait_min, v_g_asaba_carousel_wait_min;
  end if;
  if abs(v_s_asaba_carousel_wait_min - v_g_asaba_carousel_wait_min) / 0.0001 > v_worst then
    v_worst := abs(v_s_asaba_carousel_wait_min - v_g_asaba_carousel_wait_min) / 0.0001; v_worst_key := 'advanced/asaba_carousel_wait_min';
  end if;
  if v_s_asaba_payback_years is null or abs(v_s_asaba_payback_years - v_g_asaba_payback_years) > 0.0001 then
    raise exception 'gasvalue go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/asaba_payback_years]', v_s_asaba_payback_years, v_g_asaba_payback_years;
  end if;
  if abs(v_s_asaba_payback_years - v_g_asaba_payback_years) / 0.0001 > v_worst then
    v_worst := abs(v_s_asaba_payback_years - v_g_asaba_payback_years) / 0.0001; v_worst_key := 'advanced/asaba_payback_years';
  end if;
  raise notice 'gasvalue go-live: second route in SQL, 16 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated. The value and the
  -- oracle function it came from are written in; asaba_bank_mass_kg and
  -- asaba_left_in_banks_kg have no other second route.
  v_worst := 0; v_worst_key := '(none)';
  -- eriemu_ghv_btu_scf: oracle_flaretovalue.characterise (exact rationals, on moles after scaling to one)
  if abs(1243.6266129032258 - v_g_eriemu_ghv_btu_scf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 1243.6266129032258, not within 0.0001 of the seeded % [graded field: beginner/eriemu_ghv_btu_scf]', v_g_eriemu_ghv_btu_scf;
  end if;
  if abs(1243.6266129032258 - v_g_eriemu_ghv_btu_scf) / 0.0001 > v_worst then
    v_worst := abs(1243.6266129032258 - v_g_eriemu_ghv_btu_scf) / 0.0001; v_worst_key := 'beginner/eriemu_ghv_btu_scf';
  end if;
  -- eriemu_gpm_c3plus: oracle_flaretovalue.characterise (liquids from composition and liquid density)
  if abs(3.432604511236892 - v_g_eriemu_gpm_c3plus) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 3.432604511236892, not within 0.0001 of the seeded % [graded field: beginner/eriemu_gpm_c3plus]', v_g_eriemu_gpm_c3plus;
  end if;
  if abs(3.432604511236892 - v_g_eriemu_gpm_c3plus) / 0.0001 > v_worst then
    v_worst := abs(3.432604511236892 - v_g_eriemu_gpm_c3plus) / 0.0001; v_worst_key := 'beginner/eriemu_gpm_c3plus';
  end if;
  -- eriemu_c3plus_kg_per_mscf: oracle_flaretovalue.characterise (C3+ mass carried in kg)
  if abs(7.119802434089996 - v_g_eriemu_c3plus_kg_per_mscf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 7.119802434089996, not within 0.0001 of the seeded % [graded field: beginner/eriemu_c3plus_kg_per_mscf]', v_g_eriemu_c3plus_kg_per_mscf;
  end if;
  if abs(7.119802434089996 - v_g_eriemu_c3plus_kg_per_mscf) / 0.0001 > v_worst then
    v_worst := abs(7.119802434089996 - v_g_eriemu_c3plus_kg_per_mscf) / 0.0001; v_worst_key := 'beginner/eriemu_c3plus_kg_per_mscf';
  end if;
  -- eriemu_flare_co2_t: oracle_flaretovalue.flare (40 CFR 98.233(n) by moles, exact pound)
  if abs(297803.71587571246 - v_g_eriemu_flare_co2_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 297803.71587571246, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_co2_t]', v_g_eriemu_flare_co2_t;
  end if;
  if abs(297803.71587571246 - v_g_eriemu_flare_co2_t) / 0.01 > v_worst then
    v_worst := abs(297803.71587571246 - v_g_eriemu_flare_co2_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_co2_t';
  end if;
  -- eriemu_flare_ch4_t: oracle_flaretovalue.flare (methane at one less the destruction efficiency)
  if abs(1440.2505600646527 - v_g_eriemu_flare_ch4_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 1440.2505600646527, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_ch4_t]', v_g_eriemu_flare_ch4_t;
  end if;
  if abs(1440.2505600646527 - v_g_eriemu_flare_ch4_t) / 0.01 > v_worst then
    v_worst := abs(1440.2505600646527 - v_g_eriemu_flare_ch4_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_ch4_t';
  end if;
  -- eriemu_flare_co2e_t: oracle_flaretovalue.flare (CO2 plus methane times the stated GWP)
  if abs(339138.90694956796 - v_g_eriemu_flare_co2e_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 339138.90694956796, not within 0.01 of the seeded % [graded field: beginner/eriemu_flare_co2e_t]', v_g_eriemu_flare_co2e_t;
  end if;
  if abs(339138.90694956796 - v_g_eriemu_flare_co2e_t) / 0.01 > v_worst then
    v_worst := abs(339138.90694956796 - v_g_eriemu_flare_co2e_t) / 0.01; v_worst_key := 'beginner/eriemu_flare_co2e_t';
  end if;
  -- adibawa_capital_usd: oracle_flaretovalue.economics (the 0.9 power law)
  if abs(59368200.008457735 - v_g_adibawa_capital_usd) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 59368200.008457735, not within 0.01 of the seeded % [graded field: intermediate/adibawa_capital_usd]', v_g_adibawa_capital_usd;
  end if;
  if abs(59368200.008457735 - v_g_adibawa_capital_usd) / 0.01 > v_worst then
    v_worst := abs(59368200.008457735 - v_g_adibawa_capital_usd) / 0.01; v_worst_key := 'intermediate/adibawa_capital_usd';
  end if;
  -- adibawa_cng_kg_per_year: oracle_flaretovalue.economics (product a year)
  if abs(85977158.4 - v_g_adibawa_cng_kg_per_year) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 85977158.4, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_cng_kg_per_year]', v_g_adibawa_cng_kg_per_year;
  end if;
  if abs(85977158.4 - v_g_adibawa_cng_kg_per_year) / 0.0001 > v_worst then
    v_worst := abs(85977158.4 - v_g_adibawa_cng_kg_per_year) / 0.0001; v_worst_key := 'intermediate/adibawa_cng_kg_per_year';
  end if;
  -- adibawa_value_per_mscf: oracle_flaretovalue.economics (margin per Mscf of the parcel)
  if abs(5.689022923976609 - v_g_adibawa_value_per_mscf) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 5.689022923976609, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_value_per_mscf]', v_g_adibawa_value_per_mscf;
  end if;
  if abs(5.689022923976609 - v_g_adibawa_value_per_mscf) / 0.0001 > v_worst then
    v_worst := abs(5.689022923976609 - v_g_adibawa_value_per_mscf) / 0.0001; v_worst_key := 'intermediate/adibawa_value_per_mscf';
  end if;
  -- adibawa_avoided_co2e_t: oracle_flaretovalue.flare (the recovered share of the flare CO2e)
  if abs(376796.69341909775 - v_g_adibawa_avoided_co2e_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 376796.69341909775, not within 0.01 of the seeded % [graded field: intermediate/adibawa_avoided_co2e_t]', v_g_adibawa_avoided_co2e_t;
  end if;
  if abs(376796.69341909775 - v_g_adibawa_avoided_co2e_t) / 0.01 > v_worst then
    v_worst := abs(376796.69341909775 - v_g_adibawa_avoided_co2e_t) / 0.01; v_worst_key := 'intermediate/adibawa_avoided_co2e_t';
  end if;
  -- adibawa_net_abatement_t: oracle_flaretovalue.net_abatement (avoided, less product combustion, plus displaced fuel)
  if abs(421796.69341909775 - v_g_adibawa_net_abatement_t) > 0.01 then
    raise exception 'gasvalue go-live refused: the oracle gives 421796.69341909775, not within 0.01 of the seeded % [graded field: intermediate/adibawa_net_abatement_t]', v_g_adibawa_net_abatement_t;
  end if;
  if abs(421796.69341909775 - v_g_adibawa_net_abatement_t) / 0.01 > v_worst then
    v_worst := abs(421796.69341909775 - v_g_adibawa_net_abatement_t) / 0.01; v_worst_key := 'intermediate/adibawa_net_abatement_t';
  end if;
  -- adibawa_breakeven_credit_usd_per_t: oracle_flaretovalue.credits (closed form on the oracle's own margin and net abatement)
  if abs(16.152686814048696 - v_g_adibawa_breakeven_credit_usd_per_t) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 16.152686814048696, not within 0.0001 of the seeded % [graded field: intermediate/adibawa_breakeven_credit_usd_per_t]', v_g_adibawa_breakeven_credit_usd_per_t;
  end if;
  if abs(16.152686814048696 - v_g_adibawa_breakeven_credit_usd_per_t) / 0.0001 > v_worst then
    v_worst := abs(16.152686814048696 - v_g_adibawa_breakeven_credit_usd_per_t) / 0.0001; v_worst_key := 'intermediate/adibawa_breakeven_credit_usd_per_t';
  end if;
  -- asaba_usable_lpg_t: oracle_lpgcng.storage (filling density on water capacity by weight)
  if abs(94.51486 - v_g_asaba_usable_lpg_t) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 94.51486, not within 0.0001 of the seeded % [graded field: advanced/asaba_usable_lpg_t]', v_g_asaba_usable_lpg_t;
  end if;
  if abs(94.51486 - v_g_asaba_usable_lpg_t) / 0.0001 > v_worst then
    v_worst := abs(94.51486 - v_g_asaba_usable_lpg_t) / 0.0001; v_worst_key := 'advanced/asaba_usable_lpg_t';
  end if;
  -- asaba_vaporizer_design_kw: oracle_lpgcng.vaporizer (three terms, latent heat of the blend on mass)
  if abs(115.26217929383604 - v_g_asaba_vaporizer_design_kw) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 115.26217929383604, not within 0.0001 of the seeded % [graded field: advanced/asaba_vaporizer_design_kw]', v_g_asaba_vaporizer_design_kw;
  end if;
  if abs(115.26217929383604 - v_g_asaba_vaporizer_design_kw) / 0.0001 > v_worst then
    v_worst := abs(115.26217929383604 - v_g_asaba_vaporizer_design_kw) / 0.0001; v_worst_key := 'advanced/asaba_vaporizer_design_kw';
  end if;
  -- asaba_carousel_wait_min: oracle_lpgcng.erlang_c (exact Erlang C in rationals on the floored positions)
  if abs(0.16426316152493364 - v_g_asaba_carousel_wait_min) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 0.16426316152493364, not within 0.0001 of the seeded % [graded field: advanced/asaba_carousel_wait_min]', v_g_asaba_carousel_wait_min;
  end if;
  if abs(0.16426316152493364 - v_g_asaba_carousel_wait_min) / 0.0001 > v_worst then
    v_worst := abs(0.16426316152493364 - v_g_asaba_carousel_wait_min) / 0.0001; v_worst_key := 'advanced/asaba_carousel_wait_min';
  end if;
  -- asaba_bank_mass_kg: oracle_lpgcng.mass (DAK by bisection on reduced density, gauge plus atmosphere)
  if abs(630.1276397784709 - v_g_asaba_bank_mass_kg) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 630.1276397784709, not within 0.0001 of the seeded % [graded field: advanced/asaba_bank_mass_kg]', v_g_asaba_bank_mass_kg;
  end if;
  if abs(630.1276397784709 - v_g_asaba_bank_mass_kg) / 0.0001 > v_worst then
    v_worst := abs(630.1276397784709 - v_g_asaba_bank_mass_kg) / 0.0001; v_worst_key := 'advanced/asaba_bank_mass_kg';
  end if;
  -- asaba_left_in_banks_kg: oracle_lpgcng.cascade (a mass ledger by false position, conservation asserted)
  if abs(845.2975649558092 - v_g_asaba_left_in_banks_kg) > 0.001 then
    raise exception 'gasvalue go-live refused: the oracle gives 845.2975649558092, not within 0.001 of the seeded % [graded field: advanced/asaba_left_in_banks_kg]', v_g_asaba_left_in_banks_kg;
  end if;
  if abs(845.2975649558092 - v_g_asaba_left_in_banks_kg) / 0.001 > v_worst then
    v_worst := abs(845.2975649558092 - v_g_asaba_left_in_banks_kg) / 0.001; v_worst_key := 'advanced/asaba_left_in_banks_kg';
  end if;
  -- asaba_payback_years: oracle_lpgcng.conversion (undiscounted simple payback)
  if abs(0.3974832182087259 - v_g_asaba_payback_years) > 0.0001 then
    raise exception 'gasvalue go-live refused: the oracle gives 0.3974832182087259, not within 0.0001 of the seeded % [graded field: advanced/asaba_payback_years]', v_g_asaba_payback_years;
  end if;
  if abs(0.3974832182087259 - v_g_asaba_payback_years) / 0.0001 > v_worst then
    v_worst := abs(0.3974832182087259 - v_g_asaba_payback_years) / 0.0001; v_worst_key := 'advanced/asaba_payback_years';
  end if;
  raise notice 'gasvalue go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ------------------------------------------------- 4. the traps bite
  -- Each is the wrong route discriminate.mjs swept through the engine that
  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or
  -- the field does not discriminate the trap it is for.
  if abs(1233.6775999999998 - v_g_eriemu_ghv_btu_scf) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (sheet used without scaling to one) reads 1233.6775999999998, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_ghv_btu_scf]', v_g_eriemu_ghv_btu_scf;
  end if;
  if abs(3.4051441600000003 - v_g_eriemu_gpm_c3plus) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (sheet used without scaling to one) reads 3.4051441600000003, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_gpm_c3plus]', v_g_eriemu_gpm_c3plus;
  end if;
  if abs(7.06284402048 - v_g_eriemu_c3plus_kg_per_mscf) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (sheet used without scaling to one) reads 7.06284402048, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_c3plus_kg_per_mscf]', v_g_eriemu_c3plus_kg_per_mscf;
  end if;
  if abs(297477.146 - v_g_eriemu_flare_co2_t) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (co2 in the gas treated as fuel) reads 297477.146, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_flare_co2_t]', v_g_eriemu_flare_co2_t;
  end if;
  if abs(2340.407 - v_g_eriemu_flare_ch4_t) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (combustion efficiency used for the methane) reads 2340.407, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_flare_ch4_t]', v_g_eriemu_flare_ch4_t;
  end if;
  if abs(343656.547 - v_g_eriemu_flare_co2e_t) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (destruction efficiency standing in for combustion) reads 343656.547, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/eriemu_flare_co2e_t]', v_g_eriemu_flare_co2e_t;
  end if;
  if abs(64800000 - v_g_adibawa_capital_usd) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (scaled linearly) reads 64800000, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_capital_usd]', v_g_adibawa_capital_usd;
  end if;
  if abs(91759248 - v_g_adibawa_cng_kg_per_year) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (a 365 day year) reads 91759248, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_cng_kg_per_year]', v_g_adibawa_cng_kg_per_year;
  end if;
  if abs(6.05452 - v_g_adibawa_value_per_mscf) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (fixed cost left blank) reads 6.05452, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_value_per_mscf]', v_g_adibawa_value_per_mscf;
  end if;
  if abs(376443.298 - v_g_adibawa_avoided_co2e_t) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (co2 in the gas treated as fuel) reads 376443.298, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_avoided_co2e_t]', v_g_adibawa_avoided_co2e_t;
  end if;
  if abs(433099.648 - v_g_adibawa_net_abatement_t) <= 0.01 then
    raise exception 'gasvalue go-live refused: the trap (gross flare claimed) reads 433099.648, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_net_abatement_t]', v_g_adibawa_net_abatement_t;
  end if;
  if abs(15.731136983052918 - v_g_adibawa_breakeven_credit_usd_per_t) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (gross flare tonnes) reads 15.731136983052918, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/adibawa_breakeven_credit_usd_per_t]', v_g_adibawa_breakeven_credit_usd_per_t;
  end if;
  if abs(94.6 - v_g_asaba_usable_lpg_t) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (water taken as 1000) reads 94.6, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_usable_lpg_t]', v_g_asaba_usable_lpg_t;
  end if;
  if abs(115.582133 - v_g_asaba_vaporizer_design_kw) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (latent heat blended on volume) reads 115.582133, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_vaporizer_design_kw]', v_g_asaba_vaporizer_design_kw;
  end if;
  if abs(0.08470101296901766 - v_g_asaba_carousel_wait_min) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (pre md4 engine positions rounded to nearest) reads 0.08470101296901766, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_carousel_wait_min]', v_g_asaba_carousel_wait_min;
  end if;
  if abs(628.269193 - v_g_asaba_bank_mass_kg) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (gauge read as absolute) reads 628.269193, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_bank_mass_kg]', v_g_asaba_bank_mass_kg;
  end if;
  if abs(840.045 - v_g_asaba_left_in_banks_kg) <= 0.001 then
    raise exception 'gasvalue go-live refused: the trap (gauge read as absolute) reads 840.045, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_left_in_banks_kg]', v_g_asaba_left_in_banks_kg;
  end if;
  if abs(0.389232 - v_g_asaba_payback_years) <= 0.0001 then
    raise exception 'gasvalue go-live refused: the trap (extra maintenance left out) reads 0.389232, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/asaba_payback_years]', v_g_asaba_payback_years;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'gasvalue';
  if not exists (select 1 from public.academy_apps where slug = 'gasvalue' and status = 'available') then
    raise exception 'gasvalue go-live refused: gasvalue did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'gasvalue go-live: gasvalue available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
