-- ============================================================================
-- carbon GO-LIVE (HELD): Carbon & Energy Efficiency flips to 'available', the
-- second course of the Energy Transition module, at path_order 52.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/carbon.
--      The 78 lessons, the teaching lab and its three explorer panels
--      (inventory, efficiency and abatement) ship in the ZIP and NOT in this
--      database, so a flip before the upload puts a live catalogue tile in
--      front of a route that does not exist;
--   2. the Suite production upload carrying Suite main 06aef5d63 (Suite #543
--      MD5-0, #545 MD4-0 and #546 MD45-1: the Carbon Studio and Efficiency
--      Studio page repairs this course teaches, a blank heater efficiency
--      refused, sources in CO2e, blanks passed as missing, the partial
--      inventory warning, the verdict labels, the trap exponent and the basis
--      select, on the engines at df31f53). Until it is uploaded the pages a
--      learner opens beside the course still run the pre-MD5-0 behaviour the
--      course teaches against.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (carbon_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the sixteen fields with a practical closed form. The
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte. Route per field:
--        SQL closed form  owaza_heater_co2_t, owaza_flare_co2_t,
--                         owaza_flare_ch4_t (carbon atoms times molar masses
--                         built from the atomic weights),
--                         owaza_flare_ch4_tco2e, owaza_scope1_tco2e,
--                         owaza_total_tco2e (the declared AR6 GWP100 fossil
--                         set, line by line), igrita_excess_air_pct (the dry
--                         flue gas balance over the atom counts),
--                         igrita_trap_t_per_yr (choked isentropic flow, the
--                         choking asserted at the stated conditions),
--                         igrita_pinch_hot_utility_kw (the problem table
--                         cascade), igrita_pinch_cold_utility_kw (the energy
--                         balance on the hot utility),
--                         ikorodu_boiler_tuning_cost_per_t_usd,
--                         ikorodu_waste_heat_cost_per_t_usd,
--                         ikorodu_flare_recovery_net_annual_cost_usd (the
--                         capital recovery factor),
--                         ikorodu_curve_weighted_average_usd_per_t (all six
--                         measures), ikorodu_path_final_gap_t (the baseline
--                         inventory and the straight-line target),
--                         ikorodu_saving_cost_per_t_usd;
--        the ORACLE       igrita_efficiency_lhv_pct (a loss ledger over the
--                         flue gas masses and the typical heating values) and
--                         igrita_tuning_saving_gj (the ratio of two such
--                         efficiencies, rounded by the engine to six decimals
--                         before it divides), which are not re-derived here:
--                         their second route is the oracle's exact value
--                         (route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_carbonabatement.py, oracle_energyefficiency.py,
--      exact rationals where they can be), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- THE TOLERANCE OF THE TUNING SAVING IS 1 GJ, and that is deliberate: the
-- prompt asks for the nearest whole GJ, the engine rounds both efficiencies to
-- six decimals before it takes their ratio, so the stored figure is a few
-- millionths off a whole number, and a learner who carries the efficiencies at
-- the four decimals the course prints lands up to about half a GJ away. Every
-- other field is graded at one unit in the last place its prompt asks for.
--
-- NOTHING HELD IS GRADED (FINDINGS-carbon H1 the report to file on, H2 the
-- typical methane heating value pair, H3 escaped carbon as methane, H4
-- combustion N2O), and the GWP set is named in every prompt whose figures it
-- moves: IPCC AR6 GWP100, fossil methane, CH4 29.8.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for), with a label and a unit, and all of it is asserted here,
-- on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_worst numeric := 0; v_worst_key text := '(none)';
  v_mw_co2 numeric; v_mw_ch4 numeric; v_gwp_ch4 numeric; v_carbon numeric; v_heater_ch4 numeric; v_vent numeric;
  v_ysum numeric; v_o2 numeric; v_co2 numeric; v_so2 numeric; v_fuel_n2 numeric; v_air numeric; v_dry numeric; v_f numeric;
  v_p numeric; v_p2 numeric; v_k numeric; v_crit numeric; v_flux numeric; v_area numeric;
  v_dt numeric; v_net numeric; v_hot_duty numeric; v_cold_duty numeric;
  v_r numeric; v_base numeric; v_target_end numeric; v_abated numeric; v_tco2 numeric; v_crf numeric;
  v_g_owaza_heater_co2_t numeric; v_s_owaza_heater_co2_t numeric;
  v_g_owaza_flare_co2_t numeric; v_s_owaza_flare_co2_t numeric;
  v_g_owaza_flare_ch4_t numeric; v_s_owaza_flare_ch4_t numeric;
  v_g_owaza_flare_ch4_tco2e numeric; v_s_owaza_flare_ch4_tco2e numeric;
  v_g_owaza_scope1_tco2e numeric; v_s_owaza_scope1_tco2e numeric;
  v_g_owaza_total_tco2e numeric; v_s_owaza_total_tco2e numeric;
  v_g_igrita_excess_air_pct numeric; v_s_igrita_excess_air_pct numeric;
  v_g_igrita_efficiency_lhv_pct numeric; v_s_igrita_efficiency_lhv_pct numeric;
  v_g_igrita_tuning_saving_gj numeric; v_s_igrita_tuning_saving_gj numeric;
  v_g_igrita_trap_t_per_yr numeric; v_s_igrita_trap_t_per_yr numeric;
  v_g_igrita_pinch_hot_utility_kw numeric; v_s_igrita_pinch_hot_utility_kw numeric;
  v_g_igrita_pinch_cold_utility_kw numeric; v_s_igrita_pinch_cold_utility_kw numeric;
  v_g_ikorodu_boiler_tuning_cost_per_t_usd numeric; v_s_ikorodu_boiler_tuning_cost_per_t_usd numeric;
  v_g_ikorodu_waste_heat_cost_per_t_usd numeric; v_s_ikorodu_waste_heat_cost_per_t_usd numeric;
  v_g_ikorodu_flare_recovery_net_annual_cost_usd numeric; v_s_ikorodu_flare_recovery_net_annual_cost_usd numeric;
  v_g_ikorodu_curve_weighted_average_usd_per_t numeric; v_s_ikorodu_curve_weighted_average_usd_per_t numeric;
  v_g_ikorodu_path_final_gap_t numeric; v_s_ikorodu_path_final_gap_t numeric;
  v_g_ikorodu_saving_cost_per_t_usd numeric; v_s_ikorodu_saving_cost_per_t_usd numeric;
  v_cap_gwp jsonb := '{"label":"IPCC AR6 GWP100, fossil methane","values":{"CH4":29.8,"N2O":273}}'::jsonb;
  v_igrita_dtmin jsonb := '12'::jsonb;
  v_igrita_fuel jsonb := '[["CH4",0.912],["C2H6",0.041],["C3H8",0.012],["CO2",0.021],["N2",0.014]]'::jsonb;
  v_igrita_heater jsonb := '{"stackTempC":251,"combustionAirTempC":31,"currentO2Percent":6.2,"targetO2Percent":3.1,"minimumSafeO2Percent":2.4,"radiationLossPercent":2.1,"unburnedLossPercent":0,"annualFuelEnergyGJ":365000}'::jsonb;
  v_igrita_streams jsonb := '[{"label":"H1 regeneration gas cooler","supplyC":187,"targetC":55,"cpKWperK":2.72},{"label":"H2 lean amine cooler","supplyC":124,"targetC":46,"cpKWperK":6.3},{"label":"C1 rich amine preheat","supplyC":36,"targetC":161,"cpKWperK":4.55},{"label":"C2 fuel gas heater","supplyC":29,"targetC":88,"cpKWperK":1.85}]'::jsonb;
  v_igrita_trap jsonb := '{"orificeDiameterMm":5,"upstreamPressureBarG":7.2,"atmosphereBarA":1.013,"dischargeCoefficient":0.68,"steamDensityKgM3":4.28,"specificHeatRatio":1.135,"hoursPerYear":8200}'::jsonb;
  v_ikorodu_discount_rate jsonb := '0.09'::jsonb;
  v_ikorodu_lines jsonb := '{"boilersCo2T":18650,"turbinesCo2T":23200,"flareCo2T":5270,"flareCh4T":118.4,"ventCh4T":64.2,"powerMWh":31200,"powerFactor":0.43}'::jsonb;
  v_ikorodu_measures jsonb := '[{"label":"Tune the boilers","capitalCost":26000,"annualSavings":118000,"annualCost":0,"tonnesAbatedPerYear":690,"lifeYears":4,"actsOn":["boilers"],"startYear":2027},{"label":"Waste heat recovery on the gas turbine exhausts","capitalCost":3450000,"annualSavings":520000,"annualCost":38000,"tonnesAbatedPerYear":4150,"lifeYears":18,"actsOn":["turbines"],"startYear":2030},{"label":"Repair the steam traps","capitalCost":52000,"annualSavings":176000,"annualCost":0,"tonnesAbatedPerYear":980,"lifeYears":3,"actsOn":["boilers"],"startYear":2027},{"label":"Flare gas recovery compressor","capitalCost":6100000,"annualSavings":410000,"annualCost":155000,"tonnesAbatedPerYear":5900,"lifeYears":15,"actsOn":["flare"],"startYear":2029},{"label":"Lighting and variable speed drives","capitalCost":390000,"annualSavings":88000,"annualCost":0,"tonnesAbatedPerYear":610,"lifeYears":10,"actsOn":["power"],"startYear":2028},{"label":"Vapour recovery on the condensate tanks","capitalCost":540000,"annualSavings":31000,"annualCost":12000,"tonnesAbatedPerYear":1400,"lifeYears":12,"actsOn":["vents"],"startYear":null}]'::jsonb;
  v_ikorodu_plan jsonb := '{"startYear":2026,"endYear":2034,"targetReductionPercentByEnd":35}'::jsonb;
  v_ikorodu_saving jsonb := '{"label":"Economiser on the boilers","energySavedGJ":9650,"fuelCostPerGJ":6.8,"emissionFactorKgCo2ePerGJ":56.1,"implementationCost":185000,"lifeYears":7,"discountRate":0.09}'::jsonb;
  v_owaza_flare jsonb := '{"fuelKmolPerYear":52800,"carbonPerKmolFuel":1.46,"destructionEfficiencyFraction":0.97}'::jsonb;
  v_owaza_heaters jsonb := '{"fuelKmolPerYear":356000,"carbonPerKmolFuel":1.07,"destructionEfficiencyFraction":0.995}'::jsonb;
  v_owaza_power jsonb := '{"label":"Purchased electricity","scope":2,"activity":18400,"activityUnit":"MWh","factor":{"label":"Grid electricity factor (SYNTHETIC)","value":0.387,"unit":"tCO2/MWh","gas":"CO2","source":"Distribution company statement (invented)","version":"2025","vintage":"2025"}}'::jsonb;
  v_owaza_vent jsonb := '{"label":"Vented and fugitive methane","scope":1,"activity":96.5,"activityUnit":"t CH4","factor":{"label":"Measured methane mass","value":1,"unit":"tCH4/t","gas":"CH4","source":"Ukwa leak survey (invented)","version":"2026 Q1","vintage":"2026"}}'::jsonb;
  v_igrita_atoms jsonb := '[{"code":"CH4","y":0.912,"c":1,"h":4,"o":0,"s":0,"n":0},{"code":"C2H6","y":0.041,"c":2,"h":6,"o":0,"s":0,"n":0},{"code":"C3H8","y":0.012,"c":3,"h":8,"o":0,"s":0,"n":0},{"code":"CO2","y":0.021,"c":1,"h":0,"o":2,"s":0,"n":0},{"code":"N2","y":0.014,"c":0,"h":0,"o":0,"s":0,"n":2}]'::jsonb;
  v_air_o2_fraction jsonb := '0.20946'::jsonb;
  v_atomic_weight jsonb := '{"C":12.011,"H":1.008,"O":15.999,"N":14.007,"S":32.06}'::jsonb;
  v_tol_of jsonb := '{"owaza_heater_co2_t":0.01,"owaza_flare_co2_t":0.01,"owaza_flare_ch4_t":0.01,"owaza_flare_ch4_tco2e":0.01,"owaza_scope1_tco2e":0.01,"owaza_total_tco2e":0.01,"igrita_excess_air_pct":0.0001,"igrita_efficiency_lhv_pct":0.0001,"igrita_tuning_saving_gj":1,"igrita_trap_t_per_yr":0.01,"igrita_pinch_hot_utility_kw":0.01,"igrita_pinch_cold_utility_kw":0.01,"ikorodu_boiler_tuning_cost_per_t_usd":0.01,"ikorodu_waste_heat_cost_per_t_usd":0.01,"ikorodu_flare_recovery_net_annual_cost_usd":0.01,"ikorodu_curve_weighted_average_usd_per_t":0.01,"ikorodu_path_final_gap_t":0.01,"ikorodu_saving_cost_per_t_usd":0.01}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'carbon' and active;
  if v_structures <> 3 then
    raise exception 'carbon go-live refused: carbon has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'carbon';
  if v_questions <> 396 then
    raise exception 'carbon go-live refused: carbon has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'carbon'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'carbon' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'carbon' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'carbon'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'carbon' and s.active;
  if v_lessons <> 78 then
    raise exception 'carbon go-live refused: carbon carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'carbon' and s.active;
  if v_modules <> 18 then
    raise exception 'carbon go-live refused: carbon carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'carbon' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'carbon';
  if v_capstones <> 3 then
    raise exception 'carbon go-live refused: carbon has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'carbon';
  if v_graded <> 18 then
    raise exception 'carbon go-live refused: carbon has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'carbon' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  -- ------------------------------------------------------------ catalogue
  if not exists (select 1 from public.academy_apps
                  where slug = 'carbon' and module = 'energy_transition'
                    and path_order = 52 and prereq_slug is null) then
    raise exception 'carbon go-live refused: the carbon catalogue row is not energy_transition at path_order 52 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 52 and slug <> 'carbon') then
    raise exception 'carbon go-live refused: another course already holds path_order 52';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 51 and slug <> 'gasvalue') then
    raise exception 'carbon go-live refused: path_order 51, the slot of the wave sibling gasvalue, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 48 and slug <> 'crude') then
    raise exception 'carbon go-live refused: path_order 48, the slot of the live course crude, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 49 and slug <> 'refinery') then
    raise exception 'carbon go-live refused: path_order 49, the slot of the live course refinery, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 50 and slug <> 'supply') then
    raise exception 'carbon go-live refused: path_order 50, the slot of the live course supply, is held by another course';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class (1 GJ for the tuning saving, the wave's ruling), with a
  -- label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % graded field(s) are not a number at their precision.json tolerance with a label and a unit: %', v_n, v_names;
  end if;

  select count(distinct f->>'key') into v_n
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon';
  if v_n <> 18 then
    raise exception 'carbon go-live refused: the capstones grade % distinct keys, expected the 18 precision.json classifies', v_n;
  end if;


  -- ------------------------------------------------- nothing HELD is graded
  -- FINDINGS-carbon H1 (which IPCC report to file on), H2 (the typical methane
  -- heating value pair), H3 (escaped carbon counted as methane) and H4
  -- (combustion N2O) are taught as stated limits. No graded key, label or unit
  -- may name them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon'
     and (f->>'key' ~* 'n2o|nitrous|non.?fossil|\yar5\y|heating value pair' or f->>'label' ~* 'n2o|nitrous|non.?fossil|\yar5\y|heating value pair' or f->>'unit' ~* 'n2o|nitrous|non.?fossil|\yar5\y|heating value pair');
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % graded field(s) name a HELD quantity (H1 to H4): %', v_n, v_names;
  end if;

  -- Nor may a graded value BE its own field on one of the three GWP sets the
  -- course prints and does not grade on (the choice of report is H1). The
  -- 12 figures, on AR6 non-fossil, AR5 fossil and AR5 non-fossil:
  -- ikorodu_path_final_gap_t_on_ar5Fossil, ikorodu_path_final_gap_t_on_ar5NonFossil, ikorodu_path_final_gap_t_on_ar6NonFossil, owaza_flare_ch4_tco2e_on_ar5Fossil, owaza_flare_ch4_tco2e_on_ar5NonFossil, owaza_flare_ch4_tco2e_on_ar6NonFossil, owaza_scope1_tco2e_on_ar5Fossil, owaza_scope1_tco2e_on_ar5NonFossil, owaza_scope1_tco2e_on_ar6NonFossil, owaza_total_tco2e_on_ar5Fossil, owaza_total_tco2e_on_ar5NonFossil, owaza_total_tco2e_on_ar6NonFossil.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected') || ' is ' || h.k, ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         jsonb_each_text('{"owaza_flare_ch4_tco2e_on_ar6NonFossil":1001.745468,"owaza_scope1_tco2e_on_ar6NonFossil":24403.121471,"owaza_total_tco2e_on_ar6NonFossil":31523.921471,"ikorodu_path_final_gap_t_on_ar6NonFossil":10583.17,"owaza_flare_ch4_tco2e_on_ar5Fossil":1113.05052,"owaza_scope1_tco2e_on_ar5Fossil":24895.593017,"owaza_total_tco2e_on_ar5Fossil":32016.393017,"ikorodu_path_final_gap_t_on_ar5Fossil":10774.9,"owaza_flare_ch4_tco2e_on_ar5NonFossil":1038.847152,"owaza_scope1_tco2e_on_ar5NonFossil":24567.278653,"owaza_total_tco2e_on_ar5NonFossil":31688.078653,"ikorodu_path_final_gap_t_on_ar5NonFossil":10647.08}'::jsonb) h(k, v)
   where c.app_slug = 'carbon'
     and abs(abs((f->>'expected')::numeric) - abs(h.v::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % graded field(s) are a HELD figure, a field on a GWP set the course does not grade on: %', v_n, v_names;
  end if;


  -- ------------------------------------------ the GWP set is named
  -- Every prompt whose graded figures the GWP set moves (Associate and Expert)
  -- names the declared set, its report, its horizon and its methane value.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'carbon' and tier = 'beginner';
  if v_prompt is null or strpos(v_prompt, 'IPCC AR6 GWP100, fossil methane') = 0 or strpos(v_prompt, 'IPCC Sixth Assessment Report, 100-year horizon') = 0 or strpos(v_prompt, 'methane 29.8') = 0 then
    raise exception 'carbon go-live refused: the beginner prompt does not name the GWP set its figures are graded on (IPCC AR6 GWP100, fossil methane, methane 29.8)';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'carbon' and tier = 'advanced';
  if v_prompt is null or strpos(v_prompt, 'IPCC AR6 GWP100, fossil methane') = 0 or strpos(v_prompt, 'IPCC Sixth Assessment Report, 100-year horizon') = 0 or strpos(v_prompt, 'methane 29.8') = 0 then
    raise exception 'carbon go-live refused: the advanced prompt does not name the GWP set its figures are graded on (IPCC AR6 GWP100, fossil methane, methane 29.8)';
  end if;

  -- ---------------------------------------- the prompts the learner reads
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- carbon_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'carbon' and tier = 'beginner';
  if v_prompt is distinct from 'OWAZA FLOW STATION, Ukwa Basin Energy Ltd (an invented record; every flow, factor and efficiency is invented for the course). Compute the inventory on the IPCC AR6 GWP100, fossil methane (IPCC Sixth Assessment Report, 100-year horizon): methane 29.8, nitrous oxide 273. The fired heaters burn 356000 kmol of fuel gas a year carrying 1.07 kmol of carbon per kmol, at a destruction efficiency of 0.995. The flare receives 52800 kmol a year carrying 1.46 kmol of carbon per kmol, and the operator''s flare study states a destruction efficiency of 0.97. Carbon that escapes a burner or the flare is counted as methane. A leak survey (referenced, version 2026 Q1) measured 96.5 t of vented and fugitive methane. The station buys 18400 MWh of electricity at a SYNTHETIC factor of 0.387 tCO2 per MWh from a referenced supplier statement (Scope 2). Every other line is Scope 1. Give six numbers, each to two decimals. (1) The fired heaters'' CO2 in tonnes. (2) The flare''s CO2 in tonnes. (3) The flare''s methane in tonnes. (4) The flare''s methane line in tCO2e. (5) Scope 1 in tCO2e. (6) The inventory total, Scope 1 and Scope 2, in tCO2e.' then
    raise exception 'carbon go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'carbon' and tier = 'intermediate';
  if v_prompt is distinct from 'IGRITA GAS CONDITIONING PLANT, Aluu Gas Services Ltd (an invented record; every figure is invented for the course). The fired heater burns a fuel gas of mole fractions CH4 0.912, C2H6 0.041, C3H8 0.012, CO2 0.021, N2 0.014, with the typical heating values the Efficiency Studio carries for each component. Stack 251 C, combustion air 31 C, a radiation and convection loss of 2.1 percent from the vendor''s chart, no unburned loss, the Studio''s typical flue gas and vapour specific heats and latent heat, efficiency on LHV. The dry stack oxygen reads 6.2 percent; a combustion test has declared 2.4 percent the minimum safe oxygen, and the plan is to tune to 3.1 percent. The heater burns 365000 GJ of fuel a year on LHV. A steam trap has failed open: a 5 mm orifice, the steam upstream at 7.2 bar on the gauge with the local atmosphere at 1.013 bar, a discharge coefficient of 0.68, dry saturated steam of density 4.28 kg/m3 and isentropic exponent 1.135, in service 8200 hours a year. Four process streams, at a minimum approach of 12 C: H1 regeneration gas cooler from 187 C to 55 C at 2.72 kW/K; H2 lean amine cooler from 124 C to 46 C at 6.3 kW/K; C1 rich amine preheat from 36 C to 161 C at 4.55 kW/K; C2 fuel gas heater from 29 C to 88 C at 1.85 kW/K. Give six numbers. (1) The excess air at the current oxygen, in percent, to four decimals. (2) The heater''s efficiency on LHV at the current oxygen, in percent, to four decimals. (3) The fuel saved a year by tuning to the target oxygen, in GJ, to the nearest whole GJ. (4) The steam lost through the trap in tonnes a year, to two decimals. (5) The minimum hot utility in kW, to two decimals. (6) The minimum cold utility in kW, to two decimals.' then
    raise exception 'carbon go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'carbon' and tier = 'advanced';
  if v_prompt is distinct from 'IKORODU GAS DISTRIBUTION AND POWER COMPLEX, Lagoon Midstream Holdings Ltd (an invented record; every cost, saving and factor is invented for the course, money in US dollars). The baseline inventory, on the IPCC AR6 GWP100, fossil methane (IPCC Sixth Assessment Report, 100-year horizon): methane 29.8, nitrous oxide 273: boilers 18650 tCO2, gas turbines 23200 tCO2, flaring 5270 tCO2 and 118.4 t of unburned methane, vented and fugitive methane 64.2 t (from a referenced leak survey), and 31200 MWh of purchased electricity at a SYNTHETIC factor of 0.43 tCO2 per MWh from a referenced supplier statement. Six measures, each annualised with a capital recovery factor at a discount rate of 0.09: Tune the boilers: capital 26000 USD, savings 118000 USD a year, running cost 0 USD a year, 690 tCO2e abated a year, a life of 4 years, acting on the boilers, starting in 2027; Waste heat recovery on the gas turbine exhausts: capital 3450000 USD, savings 520000 USD a year, running cost 38000 USD a year, 4150 tCO2e abated a year, a life of 18 years, acting on the turbines, starting in 2030; Repair the steam traps: capital 52000 USD, savings 176000 USD a year, running cost 0 USD a year, 980 tCO2e abated a year, a life of 3 years, acting on the boilers, starting in 2027; Flare gas recovery compressor: capital 6100000 USD, savings 410000 USD a year, running cost 155000 USD a year, 5900 tCO2e abated a year, a life of 15 years, acting on the flare, starting in 2029; Lighting and variable speed drives: capital 390000 USD, savings 88000 USD a year, running cost 0 USD a year, 610 tCO2e abated a year, a life of 10 years, acting on the power, starting in 2028; Vapour recovery on the condensate tanks: capital 540000 USD, savings 31000 USD a year, running cost 12000 USD a year, 1400 tCO2e abated a year, a life of 12 years, acting on the vents, no start year agreed yet. The target falls in a straight line from the baseline in 2026 to 35 percent below it in 2034, and each scheduled measure counts in full from its start year. One saving is priced separately: Economiser on the boilers, 9650 GJ a year at 6.8 USD a GJ, a SYNTHETIC factor of 56.1 kg CO2e per GJ, all on LHV, costing 185000 USD over 7 years at a rate of 0.09. Give six numbers, each to two decimals. (1) The cost per tonne of Tune the boilers, USD. (2) The cost per tonne of the waste heat recovery, USD. (3) The net annual cost of the flare gas recovery compressor, USD. (4) The curve''s weighted average cost per tonne over all six measures, USD. (5) The unabated gap in 2034, in tCO2e. (6) The economiser''s cost per tonne of CO2e, USD.' then
    raise exception 'carbon go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_owaza_heater_co2_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_heater_co2_t';
  select (f->>'expected')::numeric into v_g_owaza_flare_co2_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_flare_co2_t';
  select (f->>'expected')::numeric into v_g_owaza_flare_ch4_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_flare_ch4_t';
  select (f->>'expected')::numeric into v_g_owaza_flare_ch4_tco2e
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_flare_ch4_tco2e';
  select (f->>'expected')::numeric into v_g_owaza_scope1_tco2e
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_scope1_tco2e';
  select (f->>'expected')::numeric into v_g_owaza_total_tco2e
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'beginner' and f->>'key' = 'owaza_total_tco2e';
  select (f->>'expected')::numeric into v_g_igrita_excess_air_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_excess_air_pct';
  select (f->>'expected')::numeric into v_g_igrita_efficiency_lhv_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_efficiency_lhv_pct';
  select (f->>'expected')::numeric into v_g_igrita_tuning_saving_gj
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_tuning_saving_gj';
  select (f->>'expected')::numeric into v_g_igrita_trap_t_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_trap_t_per_yr';
  select (f->>'expected')::numeric into v_g_igrita_pinch_hot_utility_kw
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_pinch_hot_utility_kw';
  select (f->>'expected')::numeric into v_g_igrita_pinch_cold_utility_kw
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'intermediate' and f->>'key' = 'igrita_pinch_cold_utility_kw';
  select (f->>'expected')::numeric into v_g_ikorodu_boiler_tuning_cost_per_t_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_boiler_tuning_cost_per_t_usd';
  select (f->>'expected')::numeric into v_g_ikorodu_waste_heat_cost_per_t_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_waste_heat_cost_per_t_usd';
  select (f->>'expected')::numeric into v_g_ikorodu_flare_recovery_net_annual_cost_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_flare_recovery_net_annual_cost_usd';
  select (f->>'expected')::numeric into v_g_ikorodu_curve_weighted_average_usd_per_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_curve_weighted_average_usd_per_t';
  select (f->>'expected')::numeric into v_g_ikorodu_path_final_gap_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_path_final_gap_t';
  select (f->>'expected')::numeric into v_g_ikorodu_saving_cost_per_t_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon' and c.tier = 'advanced' and f->>'key' = 'ikorodu_saving_cost_per_t_usd';
  if v_g_owaza_heater_co2_t is null
     or v_g_owaza_flare_co2_t is null
     or v_g_owaza_flare_ch4_t is null
     or v_g_owaza_flare_ch4_tco2e is null
     or v_g_owaza_scope1_tco2e is null
     or v_g_owaza_total_tco2e is null
     or v_g_igrita_excess_air_pct is null
     or v_g_igrita_efficiency_lhv_pct is null
     or v_g_igrita_tuning_saving_gj is null
     or v_g_igrita_trap_t_per_yr is null
     or v_g_igrita_pinch_hot_utility_kw is null
     or v_g_igrita_pinch_cold_utility_kw is null
     or v_g_ikorodu_boiler_tuning_cost_per_t_usd is null
     or v_g_ikorodu_waste_heat_cost_per_t_usd is null
     or v_g_ikorodu_flare_recovery_net_annual_cost_usd is null
     or v_g_ikorodu_curve_weighted_average_usd_per_t is null
     or v_g_ikorodu_path_final_gap_t is null
     or v_g_ikorodu_saving_cost_per_t_usd is null then
    raise exception 'carbon go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is a number
  -- token in any prompt, dataset, title or label: not within its tolerance, and
  -- not as its own rounding at two or more significant figures. None of the
  -- 21 engine-derived intermediates on the way to a graded field is
  -- printed as its own rounding at three or more.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where c.app_slug = 'carbon' and p.app_slug = 'carbon'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or (length(ltrim(replace(replace(m[1], '-', ''), '.', ''), '0')) >= 2
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)) + 1e-12));
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         jsonb_each_text('{"owaza_heater_ch4_t":30.555498,"owaza_heater_carbon_kmol":380920,"owaza_flare_carbon_kmol":77088,"owaza_vent_tco2e":2875.7,"owaza_scope2_tco2e":7120.8,"igrita_o2_demand":2.0275,"igrita_stoich_air":9.67965244,"igrita_lhv":815.061,"igrita_target_eff":86.871362,"igrita_saving_pct":2.129315,"igrita_trap_bar_a":8.213000000000001,"igrita_trap_kgh":57.27902496,"igrita_pinch_cold_c":112,"igrita_heat_recovered":626.31,"ikorodu_baseline_t":65977.48,"ikorodu_target_end_t":42885.362,"ikorodu_total_abatement_t":13730,"ikorodu_net_annual_all":177541.0103,"ikorodu_saving_value":65620,"ikorodu_saving_tco2e":541.365,"ikorodu_waste_heat_crf":0.11421229}'::jsonb) d(k, v)
   where p.app_slug = 'carbon'
     and length(ltrim(replace(replace(m[1], '-', ''), '.', ''), '0')) >= 3
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)) + 1e-12;
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (124), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where p.app_slug = 'carbon';
  if v_n <> 124 then
    raise exception 'carbon go-live refused: the prompt sweep read % number tokens, and gen_course.py read 124 from the same prompts', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'carbon') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'carbon') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (513 distinct values, read by
  -- the regex -?[0-9]+[.]?[0-9]*): a graded field that is a figure the digest
  -- prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'carbon'
     and exists (select 1 from unnest(array[0, 1e-06, 0.00353836, 0.00535892, 0.00822761, 0.011315, 0.01176597, 0.0124609, 0.01444636, 0.015, 0.0164448058, 0.0164763814, 0.01781982, 0.021, 0.025, 0.04675, 0.051037, 0.071, 0.098534, 0.1, 0.105, 0.109464, 0.112583, 0.1126, 0.11745962, 0.13147378, 0.14676332, 0.16, 0.181468, 0.18744402, 0.20946, 0.2485, 0.25, 0.26379748, 0.300728, 0.321, 0.333333, 0.343467, 0.35, 0.4021148, 0.41, 0.538387, 0.5457, 0.55, 0.555556, 0.5774, 0.57743, 0.65, 0.666667, 0.6786, 0.72, 0.777778, 0.802, 0.83, 0.843786, 0.868, 0.888889, 0.9, 0.95, 0.9765, 0.98, 0.99, 0.995, 0.999, 1, 1.000001, 1.008, 1.01325, 1.040085, 1.049821, 1.05, 1.09, 1.098, 1.1, 1.135, 1.15, 1.2, 1.2718, 1.3, 1.32, 1.35, 1.5, 1.6445, 1.6476, 1.736, 1.8, 1.8088, 1.9, 1.95, 2, 2.016, 2.033, 2.0336, 2.0895, 2.1, 2.143077, 2.372881, 2.4, 2.5, 2.8, 3, 3.15, 3.5, 3.6, 4, 4.35, 4.5, 4.5228, 4.65, 5, 5.5, 5.7, 6, 6.75, 7, 7.5, 7.6, 7.7207, 7.886152, 8, 8.153, 8.429, 8.4741, 8.5436, 8.85, 8.999152, 9, 9.0262, 9.450327, 9.523, 9.949131, 9.975652, 9.9883, 10, 10.387757, 10.426827, 10.925631, 11, 11.032152, 11.123347, 11.245, 11.364257, 11.483327, 11.982131, 12, 12.011, 12.099847, 12.1524, 12.203563, 12.420757, 13, 13.156347, 13.180063, 13.5714, 13.5971, 13.9199, 14, 14.007, 14.236563, 14.2492, 14.5045, 14.560191, 15, 15.536691, 15.612763, 15.999, 16, 16.043, 16.306, 16.593191, 17, 17.724, 18, 18.015, 18.5068, 18.7868, 19, 20, 20.7657, 20.946, 21, 21.070448, 21.2938, 22, 22.046948, 22.05, 22.0712, 23, 23.103448, 24, 25, 25.95, 26, 26.8817, 27, 27.2581, 28, 28.014, 28.161, 28.9647, 29.051, 29.7913, 29.8, 30, 30.07, 31, 31.661, 31.998, 32, 32.06, 32.1223, 33.5, 34.2, 35, 35.4193, 36.6245, 37.5765, 39.5, 39.9, 40.5, 40.765, 41, 41.4785, 41.809, 42.143, 42.352, 43.129, 43.569, 44.009, 44.097, 44.4, 44.462, 45, 45.8573, 48, 50, 51.5129, 53, 55.7461, 56.1, 57, 58.124, 59.7, 60, 63.721, 64.058, 64.5, 65, 66.6667, 66.896, 73, 74.227, 77.9288, 78.1002, 79.2343, 81.531, 85.7029, 86.4029, 86.9933, 87.2029, 87.516, 87.8476, 87.985, 88.1965, 88.2, 92, 96.6, 98, 100, 103, 104, 106.3391, 108, 108.75, 110.5, 111.5, 118, 120.5882, 121.0076, 133.0435, 141, 142, 148.5, 150, 155.5, 156.439, 159.1304, 163, 167.4364, 168.9474, 183.5403, 195, 200, 204.6, 205.95, 216, 226, 228, 238, 240.15, 241.8, 242.961, 244.029, 265, 273, 273.9, 284.951, 285.8, 315.643, 316.7568, 348.419, 351.0222, 355.757, 363.6388, 371.004, 373.481, 400, 426, 440.265, 441.191, 443.257, 456.571, 485.922, 489.183, 494.298, 500, 527.25, 561, 585.15, 586.95, 629.8387, 659.4, 661.98, 680, 688.2353, 707.2581, 742.22, 760, 764.5161, 798.595, 801.15, 802.6, 815.785, 819.363, 823.3333, 840.9925, 862.5564, 890.8, 930.6273, 1000, 1135.851, 1150, 1192.439, 1214.805, 1300, 1370.083, 1372.285, 1428.6, 1470, 1480, 1560.7, 1850, 1910, 2012.884, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2043.1, 2100, 2124.711, 2191.807, 2214.172, 2219.2, 2236.537, 2429.61, 2442, 2457.133, 2622.4, 2650, 2657.3, 2677.729, 2782.362, 2877.5, 3220.083, 3339.515, 3400, 3834, 3976, 4010, 4231.6, 4260, 4442.493, 4748.35, 5214.422, 5310, 5923.008, 6189.848, 6200, 6742.37, 6976, 7160, 7410, 7562.133, 7826.65, 8216.58, 8337.934, 8400, 8760, 8784, 9000, 9260, 9400, 10988, 11800, 12000, 12060, 12915, 13230.304, 13610, 14000, 15460, 16830.083, 18000, 18095.17, 18660, 21000, 21212.338, 22176, 22272.955, 23005.841, 23098.327, 23121.448, 24394.189, 25799.177, 27353.048, 29587.52, 29745.826, 30030.777, 30062.438, 31500, 31578.593, 34927.743, 38000, 38500, 39270.193, 39363.24, 40268.048, 40320, 40640.276, 41000, 41674.491, 42490.276, 42502.52, 42660.826, 42945.777, 42977.438, 44078.788, 45000, 45112.276, 46483.086, 48447.11, 48690.276, 48887.383, 49136.76, 50820, 51291.681, 52090.276, 53695.978, 54190.276, 54432, 56100.276, 65525.62, 88500, 89525.62, 96000, 96300.31, 99227.28, 105000, 121403.28, 127251.65, 132000, 142000, 175835.28, 179904.83, 198000, 210000, 217300.31, 265000, 290443.84, 290443.85, 361552.89, 410000, 482000, 484221.51, 525380, 610000, 644221.51, 740000, 781000, 877000, 1240000, 1850000, 2410000, 2750000, 3650000, 4900000]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'carbon go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  -- The seeded value is the engine's return at full precision, exactly.
  if v_g_owaza_heater_co2_t <> 16680.088739 then
    raise exception 'carbon go-live refused: the seeded value % is not the 16680.088739 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_heater_co2_t]', v_g_owaza_heater_co2_t;
  end if;
  if v_g_owaza_flare_co2_t <> 3290.788818 then
    raise exception 'carbon go-live refused: the seeded value % is not the 3290.788818 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_flare_co2_t]', v_g_owaza_flare_co2_t;
  end if;
  if v_g_owaza_flare_ch4_t <> 37.101684 then
    raise exception 'carbon go-live refused: the seeded value % is not the 37.101684 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_flare_ch4_t]', v_g_owaza_flare_ch4_t;
  end if;
  if v_g_owaza_flare_ch4_tco2e <> 1105.630183 then
    raise exception 'carbon go-live refused: the seeded value % is not the 1105.630183 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_flare_ch4_tco2e]', v_g_owaza_flare_ch4_tco2e;
  end if;
  if v_g_owaza_scope1_tco2e <> 24862.76158 then
    raise exception 'carbon go-live refused: the seeded value % is not the 24862.76158 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_scope1_tco2e]', v_g_owaza_scope1_tco2e;
  end if;
  if v_g_owaza_total_tco2e <> 31983.56158 then
    raise exception 'carbon go-live refused: the seeded value % is not the 31983.56158 the engine returned through carbon_capstone.mjs [graded field: beginner/owaza_total_tco2e]', v_g_owaza_total_tco2e;
  end if;
  if v_g_igrita_excess_air_pct <> 37.86451 then
    raise exception 'carbon go-live refused: the seeded value % is not the 37.86451 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_excess_air_pct]', v_g_igrita_excess_air_pct;
  end if;
  if v_g_igrita_efficiency_lhv_pct <> 85.021597 then
    raise exception 'carbon go-live refused: the seeded value % is not the 85.021597 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_efficiency_lhv_pct]', v_g_igrita_efficiency_lhv_pct;
  end if;
  if v_g_igrita_tuning_saving_gj <> 7771.999995 then
    raise exception 'carbon go-live refused: the seeded value % is not the 7771.999995 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_tuning_saving_gj]', v_g_igrita_tuning_saving_gj;
  end if;
  if v_g_igrita_trap_t_per_yr <> 469.68800466 then
    raise exception 'carbon go-live refused: the seeded value % is not the 469.68800466 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_trap_t_per_yr]', v_g_igrita_trap_t_per_yr;
  end if;
  if v_g_igrita_pinch_hot_utility_kw <> 51.59 then
    raise exception 'carbon go-live refused: the seeded value % is not the 51.59 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_pinch_hot_utility_kw]', v_g_igrita_pinch_hot_utility_kw;
  end if;
  if v_g_igrita_pinch_cold_utility_kw <> 224.13 then
    raise exception 'carbon go-live refused: the seeded value % is not the 224.13 the engine returned through carbon_capstone.mjs [graded field: intermediate/igrita_pinch_cold_utility_kw]', v_g_igrita_pinch_cold_utility_kw;
  end if;
  if v_g_ikorodu_boiler_tuning_cost_per_t_usd <> -159.3835 then
    raise exception 'carbon go-live refused: the seeded value % is not the -159.3835 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_boiler_tuning_cost_per_t_usd]', v_g_ikorodu_boiler_tuning_cost_per_t_usd;
  end if;
  if v_g_ikorodu_waste_heat_cost_per_t_usd <> -21.197011 then
    raise exception 'carbon go-live refused: the seeded value % is not the -21.197011 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_waste_heat_cost_per_t_usd]', v_g_ikorodu_waste_heat_cost_per_t_usd;
  end if;
  if v_g_ikorodu_flare_recovery_net_annual_cost_usd <> 501759.1842 then
    raise exception 'carbon go-live refused: the seeded value % is not the 501759.1842 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_flare_recovery_net_annual_cost_usd]', v_g_ikorodu_flare_recovery_net_annual_cost_usd;
  end if;
  if v_g_ikorodu_curve_weighted_average_usd_per_t <> 12.930882 then
    raise exception 'carbon go-live refused: the seeded value % is not the 12.930882 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_curve_weighted_average_usd_per_t]', v_g_ikorodu_curve_weighted_average_usd_per_t;
  end if;
  if v_g_ikorodu_path_final_gap_t <> 10762.118 then
    raise exception 'carbon go-live refused: the seeded value % is not the 10762.118 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_path_final_gap_t]', v_g_ikorodu_path_final_gap_t;
  end if;
  if v_g_ikorodu_saving_cost_per_t_usd <> -53.313854 then
    raise exception 'carbon go-live refused: the seeded value % is not the -53.313854 the engine returned through carbon_capstone.mjs [graded field: advanced/ikorodu_saving_cost_per_t_usd]', v_g_ikorodu_saving_cost_per_t_usd;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OWAZA. Every carbon atom into a burner leaves as CO2 at the
  -- destruction efficiency, and what escapes leaves as methane (H3, stated in
  -- the prompt). The molar masses are BUILT from the atomic weights here (CO2
  -- is C plus two O, CH4 is C plus four H), not read from the engine. Each
  -- methane line is its tonnes times the declared set's methane potential; the
  -- vent is its measured tonnes through a factor of one; Scope 1 is every
  -- Scope 1 line, and the total adds the purchased power at its factor.
  v_mw_co2 := (v_atomic_weight->>'C')::numeric + 2 * (v_atomic_weight->>'O')::numeric;
  v_mw_ch4 := (v_atomic_weight->>'C')::numeric + 4 * (v_atomic_weight->>'H')::numeric;
  v_gwp_ch4 := (v_cap_gwp #>> '{values,CH4}')::numeric;
  v_carbon := (v_owaza_heaters->>'fuelKmolPerYear')::numeric * (v_owaza_heaters->>'carbonPerKmolFuel')::numeric;
  v_s_owaza_heater_co2_t := v_carbon * (v_owaza_heaters->>'destructionEfficiencyFraction')::numeric * v_mw_co2 / 1000.0;
  v_heater_ch4 := v_carbon * (1 - (v_owaza_heaters->>'destructionEfficiencyFraction')::numeric) * v_mw_ch4 / 1000.0;
  v_carbon := (v_owaza_flare->>'fuelKmolPerYear')::numeric * (v_owaza_flare->>'carbonPerKmolFuel')::numeric;
  v_s_owaza_flare_co2_t := v_carbon * (v_owaza_flare->>'destructionEfficiencyFraction')::numeric * v_mw_co2 / 1000.0;
  v_s_owaza_flare_ch4_t := v_carbon * (1 - (v_owaza_flare->>'destructionEfficiencyFraction')::numeric) * v_mw_ch4 / 1000.0;
  v_s_owaza_flare_ch4_tco2e := v_s_owaza_flare_ch4_t * v_gwp_ch4;
  v_vent := (v_owaza_vent->>'activity')::numeric * (v_owaza_vent #>> '{factor,value}')::numeric * v_gwp_ch4;
  v_s_owaza_scope1_tco2e := v_s_owaza_heater_co2_t + v_heater_ch4 * v_gwp_ch4
                            + v_s_owaza_flare_co2_t + v_s_owaza_flare_ch4_tco2e + v_vent;
  v_s_owaza_total_tco2e := v_s_owaza_scope1_tco2e
                           + (v_owaza_power->>'activity')::numeric * (v_owaza_power #>> '{factor,value}')::numeric;

  -- PROFESSIONAL, IGRITA. The oxygen a kilomole of fuel needs is the atom
  -- balance c + h/4 + s - o/2 over the mole fractions (normalised); air is
  -- that over the oxygen in dry air; the dry flue gas at stoichiometric is the
  -- CO2, the SO2, the air's nitrogen and the fuel's. Excess air E then solves
  -- E o2 / (dry + E air) = the dry stack oxygen: E = f dry / (o2 - f air).
  select sum((a->>'y')::numeric) into v_ysum from jsonb_array_elements(v_igrita_atoms) a;
  select sum((a->>'y')::numeric / v_ysum * ((a->>'c')::numeric + (a->>'h')::numeric / 4.0
                                           + (a->>'s')::numeric - (a->>'o')::numeric / 2.0)),
         sum((a->>'y')::numeric / v_ysum * (a->>'c')::numeric),
         sum((a->>'y')::numeric / v_ysum * (a->>'s')::numeric),
         sum((a->>'y')::numeric / v_ysum * (a->>'n')::numeric / 2.0)
    into v_o2, v_co2, v_so2, v_fuel_n2
    from jsonb_array_elements(v_igrita_atoms) a;
  v_air := v_o2 / (v_air_o2_fraction #>> '{}')::numeric;
  v_dry := v_co2 + v_so2 + v_air * (1 - (v_air_o2_fraction #>> '{}')::numeric) + v_fuel_n2;
  v_f := (v_igrita_heater->>'currentO2Percent')::numeric / 100.0;
  v_s_igrita_excess_air_pct := v_f * v_dry / (v_o2 - v_f * v_air) * 100;

  -- The trap. Upstream is the gauge reading plus the local atmosphere the
  -- prompt states; the trap vents to that atmosphere. The flow is CHOKED when
  -- the pressure ratio is at or below (2/(k+1))^(k/(k-1)), and it is asserted
  -- to be at the stated conditions; then the mass flux is
  -- Cd sqrt(k rho P (2/(k+1))^((k+1)/(k-1))) over the orifice, for the hours.
  v_p := (v_igrita_trap->>'upstreamPressureBarG')::numeric + (v_igrita_trap->>'atmosphereBarA')::numeric;
  v_p2 := (v_igrita_trap->>'atmosphereBarA')::numeric;
  v_k := (v_igrita_trap->>'specificHeatRatio')::numeric;
  v_crit := power(2 / (v_k + 1), v_k / (v_k - 1));
  if v_p2 / v_p > v_crit then
    raise exception 'carbon go-live refused: the IGRITA trap is not choked at the stated conditions (ratio % above the critical %), so its closed form does not hold [graded field: intermediate/igrita_trap_t_per_yr]', v_p2 / v_p, v_crit;
  end if;
  v_flux := (v_igrita_trap->>'dischargeCoefficient')::numeric
            * sqrt(v_k * (v_igrita_trap->>'steamDensityKgM3')::numeric * v_p * 100000.0 * power(2 / (v_k + 1), (v_k + 1) / (v_k - 1)));
  v_area := pi()::numeric * power((v_igrita_trap->>'orificeDiameterMm')::numeric / 1000.0, 2) / 4.0;
  v_s_igrita_trap_t_per_yr := v_flux * v_area * 3600.0 * (v_igrita_trap->>'hoursPerYear')::numeric / 1000.0;

  -- The problem table. Each stream is shifted by half the minimum approach (a
  -- hot one down, a cold one up); between each pair of shifted boundaries the
  -- surplus is (the hot CPs spanning it less the cold) times its width; the
  -- cascade from the top at zero reaches its most negative point, and the
  -- minimum hot utility is that deficit. The cold utility is then the energy
  -- balance on it: hot utility plus every hot stream's duty less every cold
  -- stream's.
  v_dt := (v_igrita_dtmin #>> '{}')::numeric;
  with s as (
    select (e->>'supplyC')::numeric sup, (e->>'targetC')::numeric tgt, (e->>'cpKWperK')::numeric cp,
           (e->>'supplyC')::numeric > (e->>'targetC')::numeric hot
      from jsonb_array_elements(v_igrita_streams) e
     where (e->>'supplyC')::numeric <> (e->>'targetC')::numeric and (e->>'cpKWperK')::numeric <> 0),
  sh as (
    select cp, hot, sup, tgt,
           greatest(sup, tgt) + case when hot then -v_dt / 2.0 else v_dt / 2.0 end hi,
           least(sup, tgt) + case when hot then -v_dt / 2.0 else v_dt / 2.0 end lo from s),
  b as (select distinct t from sh, lateral (values (sh.hi), (sh.lo)) v(t)),
  iv as (select t top, lead(t) over (order by t desc) bot from b),
  sur as (
    select iv.top, (coalesce((select sum(cp) from sh where hot and hi >= iv.top and lo <= iv.bot), 0)
                    - coalesce((select sum(cp) from sh where not hot and hi >= iv.top and lo <= iv.bot), 0))
                   * (iv.top - iv.bot) q
      from iv where iv.bot is not null),
  cas as (select sum(q) over (order by top desc) c from sur)
  select greatest(0, -min(c)) into v_s_igrita_pinch_hot_utility_kw from cas;
  select sum(case when hot then cp * (sup - tgt) else 0 end), sum(case when hot then 0 else cp * (tgt - sup) end)
    into v_hot_duty, v_cold_duty
    from (select (e->>'supplyC')::numeric sup, (e->>'targetC')::numeric tgt, (e->>'cpKWperK')::numeric cp,
                 (e->>'supplyC')::numeric > (e->>'targetC')::numeric hot
            from jsonb_array_elements(v_igrita_streams) e) x;
  v_s_igrita_pinch_cold_utility_kw := v_s_igrita_pinch_hot_utility_kw + v_hot_duty - v_cold_duty;

  -- EXPERT, IKORODU. A measure's capital is annualised over its life by the
  -- capital recovery factor r(1+r)^n / ((1+r)^n - 1); its net annual cost is
  -- that plus its running cost less its savings; its cost per tonne is the net
  -- over its tonnes a year. The curve's weighted average is the net annual cost
  -- of all six over their tonnes. The baseline is the inventory line by line
  -- on the declared set; the target falls in a straight line to the stated
  -- percent below it in the end year; every measure with a start year at or
  -- before the end year counts in full; the gap is what is left above the
  -- target. The economiser's tonnes are its GJ times its factor, its savings
  -- its GJ times the fuel price, annualised at its own rate and life.
  v_r := (v_ikorodu_discount_rate #>> '{}')::numeric;
  v_s_ikorodu_boiler_tuning_cost_per_t_usd := (select ((m->>'capitalCost')::numeric * (v_r * power(1 + v_r, (m->>'lifeYears')::numeric) / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1)) + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric) / (m->>'tonnesAbatedPerYear')::numeric from jsonb_array_elements(v_ikorodu_measures) m where m->>'label' = 'Tune the boilers');
  v_s_ikorodu_waste_heat_cost_per_t_usd := (select ((m->>'capitalCost')::numeric * (v_r * power(1 + v_r, (m->>'lifeYears')::numeric) / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1)) + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric) / (m->>'tonnesAbatedPerYear')::numeric from jsonb_array_elements(v_ikorodu_measures) m where m->>'label' = 'Waste heat recovery on the gas turbine exhausts');
  v_s_ikorodu_flare_recovery_net_annual_cost_usd := (select ((m->>'capitalCost')::numeric * (v_r * power(1 + v_r, (m->>'lifeYears')::numeric) / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1)) + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric) from jsonb_array_elements(v_ikorodu_measures) m where m->>'label' = 'Flare gas recovery compressor');
  select sum((m->>'capitalCost')::numeric * v_r * power(1 + v_r, (m->>'lifeYears')::numeric)
             / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1)
             + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric)
         / sum((m->>'tonnesAbatedPerYear')::numeric)
    into v_s_ikorodu_curve_weighted_average_usd_per_t
    from jsonb_array_elements(v_ikorodu_measures) m;
  v_base := (v_ikorodu_lines->>'boilersCo2T')::numeric + (v_ikorodu_lines->>'turbinesCo2T')::numeric + (v_ikorodu_lines->>'flareCo2T')::numeric
            + ((v_ikorodu_lines->>'flareCh4T')::numeric + (v_ikorodu_lines->>'ventCh4T')::numeric) * v_gwp_ch4
            + (v_ikorodu_lines->>'powerMWh')::numeric * (v_ikorodu_lines->>'powerFactor')::numeric;
  v_target_end := v_base * (1 - (v_ikorodu_plan->>'targetReductionPercentByEnd')::numeric / 100.0
                  * (((v_ikorodu_plan->>'endYear')::numeric - (v_ikorodu_plan->>'startYear')::numeric)
                     / ((v_ikorodu_plan->>'endYear')::numeric - (v_ikorodu_plan->>'startYear')::numeric)));
  select coalesce(sum((m->>'tonnesAbatedPerYear')::numeric), 0) into v_abated
    from jsonb_array_elements(v_ikorodu_measures) m
   where jsonb_typeof(m->'startYear') = 'number' and (m->>'startYear')::numeric <= (v_ikorodu_plan->>'endYear')::numeric;
  v_s_ikorodu_path_final_gap_t := greatest(0, v_base - v_abated - v_target_end);
  v_tco2 := (v_ikorodu_saving->>'energySavedGJ')::numeric * (v_ikorodu_saving->>'emissionFactorKgCo2ePerGJ')::numeric / 1000.0;
  v_crf := (v_ikorodu_saving->>'discountRate')::numeric * power(1 + (v_ikorodu_saving->>'discountRate')::numeric, (v_ikorodu_saving->>'lifeYears')::numeric)
           / (power(1 + (v_ikorodu_saving->>'discountRate')::numeric, (v_ikorodu_saving->>'lifeYears')::numeric) - 1);
  v_s_ikorodu_saving_cost_per_t_usd := ((v_ikorodu_saving->>'implementationCost')::numeric * v_crf
                                        - (v_ikorodu_saving->>'energySavedGJ')::numeric * (v_ikorodu_saving->>'fuelCostPerGJ')::numeric) / v_tco2;

  if v_s_owaza_heater_co2_t is null or abs(v_s_owaza_heater_co2_t - v_g_owaza_heater_co2_t) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_heater_co2_t]', v_s_owaza_heater_co2_t, v_g_owaza_heater_co2_t;
  end if;
  if abs(v_s_owaza_heater_co2_t - v_g_owaza_heater_co2_t) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_heater_co2_t - v_g_owaza_heater_co2_t) / 0.01; v_worst_key := 'beginner/owaza_heater_co2_t';
  end if;
  if v_s_owaza_flare_co2_t is null or abs(v_s_owaza_flare_co2_t - v_g_owaza_flare_co2_t) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_co2_t]', v_s_owaza_flare_co2_t, v_g_owaza_flare_co2_t;
  end if;
  if abs(v_s_owaza_flare_co2_t - v_g_owaza_flare_co2_t) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_flare_co2_t - v_g_owaza_flare_co2_t) / 0.01; v_worst_key := 'beginner/owaza_flare_co2_t';
  end if;
  if v_s_owaza_flare_ch4_t is null or abs(v_s_owaza_flare_ch4_t - v_g_owaza_flare_ch4_t) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_ch4_t]', v_s_owaza_flare_ch4_t, v_g_owaza_flare_ch4_t;
  end if;
  if abs(v_s_owaza_flare_ch4_t - v_g_owaza_flare_ch4_t) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_flare_ch4_t - v_g_owaza_flare_ch4_t) / 0.01; v_worst_key := 'beginner/owaza_flare_ch4_t';
  end if;
  if v_s_owaza_flare_ch4_tco2e is null or abs(v_s_owaza_flare_ch4_tco2e - v_g_owaza_flare_ch4_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_ch4_tco2e]', v_s_owaza_flare_ch4_tco2e, v_g_owaza_flare_ch4_tco2e;
  end if;
  if abs(v_s_owaza_flare_ch4_tco2e - v_g_owaza_flare_ch4_tco2e) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_flare_ch4_tco2e - v_g_owaza_flare_ch4_tco2e) / 0.01; v_worst_key := 'beginner/owaza_flare_ch4_tco2e';
  end if;
  if v_s_owaza_scope1_tco2e is null or abs(v_s_owaza_scope1_tco2e - v_g_owaza_scope1_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_scope1_tco2e]', v_s_owaza_scope1_tco2e, v_g_owaza_scope1_tco2e;
  end if;
  if abs(v_s_owaza_scope1_tco2e - v_g_owaza_scope1_tco2e) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_scope1_tco2e - v_g_owaza_scope1_tco2e) / 0.01; v_worst_key := 'beginner/owaza_scope1_tco2e';
  end if;
  if v_s_owaza_total_tco2e is null or abs(v_s_owaza_total_tco2e - v_g_owaza_total_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/owaza_total_tco2e]', v_s_owaza_total_tco2e, v_g_owaza_total_tco2e;
  end if;
  if abs(v_s_owaza_total_tco2e - v_g_owaza_total_tco2e) / 0.01 > v_worst then
    v_worst := abs(v_s_owaza_total_tco2e - v_g_owaza_total_tco2e) / 0.01; v_worst_key := 'beginner/owaza_total_tco2e';
  end if;
  if v_s_igrita_excess_air_pct is null or abs(v_s_igrita_excess_air_pct - v_g_igrita_excess_air_pct) > 0.0001 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/igrita_excess_air_pct]', v_s_igrita_excess_air_pct, v_g_igrita_excess_air_pct;
  end if;
  if abs(v_s_igrita_excess_air_pct - v_g_igrita_excess_air_pct) / 0.0001 > v_worst then
    v_worst := abs(v_s_igrita_excess_air_pct - v_g_igrita_excess_air_pct) / 0.0001; v_worst_key := 'intermediate/igrita_excess_air_pct';
  end if;
  if v_s_igrita_trap_t_per_yr is null or abs(v_s_igrita_trap_t_per_yr - v_g_igrita_trap_t_per_yr) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/igrita_trap_t_per_yr]', v_s_igrita_trap_t_per_yr, v_g_igrita_trap_t_per_yr;
  end if;
  if abs(v_s_igrita_trap_t_per_yr - v_g_igrita_trap_t_per_yr) / 0.01 > v_worst then
    v_worst := abs(v_s_igrita_trap_t_per_yr - v_g_igrita_trap_t_per_yr) / 0.01; v_worst_key := 'intermediate/igrita_trap_t_per_yr';
  end if;
  if v_s_igrita_pinch_hot_utility_kw is null or abs(v_s_igrita_pinch_hot_utility_kw - v_g_igrita_pinch_hot_utility_kw) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/igrita_pinch_hot_utility_kw]', v_s_igrita_pinch_hot_utility_kw, v_g_igrita_pinch_hot_utility_kw;
  end if;
  if abs(v_s_igrita_pinch_hot_utility_kw - v_g_igrita_pinch_hot_utility_kw) / 0.01 > v_worst then
    v_worst := abs(v_s_igrita_pinch_hot_utility_kw - v_g_igrita_pinch_hot_utility_kw) / 0.01; v_worst_key := 'intermediate/igrita_pinch_hot_utility_kw';
  end if;
  if v_s_igrita_pinch_cold_utility_kw is null or abs(v_s_igrita_pinch_cold_utility_kw - v_g_igrita_pinch_cold_utility_kw) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/igrita_pinch_cold_utility_kw]', v_s_igrita_pinch_cold_utility_kw, v_g_igrita_pinch_cold_utility_kw;
  end if;
  if abs(v_s_igrita_pinch_cold_utility_kw - v_g_igrita_pinch_cold_utility_kw) / 0.01 > v_worst then
    v_worst := abs(v_s_igrita_pinch_cold_utility_kw - v_g_igrita_pinch_cold_utility_kw) / 0.01; v_worst_key := 'intermediate/igrita_pinch_cold_utility_kw';
  end if;
  if v_s_ikorodu_boiler_tuning_cost_per_t_usd is null or abs(v_s_ikorodu_boiler_tuning_cost_per_t_usd - v_g_ikorodu_boiler_tuning_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_boiler_tuning_cost_per_t_usd]', v_s_ikorodu_boiler_tuning_cost_per_t_usd, v_g_ikorodu_boiler_tuning_cost_per_t_usd;
  end if;
  if abs(v_s_ikorodu_boiler_tuning_cost_per_t_usd - v_g_ikorodu_boiler_tuning_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_boiler_tuning_cost_per_t_usd - v_g_ikorodu_boiler_tuning_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_boiler_tuning_cost_per_t_usd';
  end if;
  if v_s_ikorodu_waste_heat_cost_per_t_usd is null or abs(v_s_ikorodu_waste_heat_cost_per_t_usd - v_g_ikorodu_waste_heat_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_waste_heat_cost_per_t_usd]', v_s_ikorodu_waste_heat_cost_per_t_usd, v_g_ikorodu_waste_heat_cost_per_t_usd;
  end if;
  if abs(v_s_ikorodu_waste_heat_cost_per_t_usd - v_g_ikorodu_waste_heat_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_waste_heat_cost_per_t_usd - v_g_ikorodu_waste_heat_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_waste_heat_cost_per_t_usd';
  end if;
  if v_s_ikorodu_flare_recovery_net_annual_cost_usd is null or abs(v_s_ikorodu_flare_recovery_net_annual_cost_usd - v_g_ikorodu_flare_recovery_net_annual_cost_usd) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_flare_recovery_net_annual_cost_usd]', v_s_ikorodu_flare_recovery_net_annual_cost_usd, v_g_ikorodu_flare_recovery_net_annual_cost_usd;
  end if;
  if abs(v_s_ikorodu_flare_recovery_net_annual_cost_usd - v_g_ikorodu_flare_recovery_net_annual_cost_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_flare_recovery_net_annual_cost_usd - v_g_ikorodu_flare_recovery_net_annual_cost_usd) / 0.01; v_worst_key := 'advanced/ikorodu_flare_recovery_net_annual_cost_usd';
  end if;
  if v_s_ikorodu_curve_weighted_average_usd_per_t is null or abs(v_s_ikorodu_curve_weighted_average_usd_per_t - v_g_ikorodu_curve_weighted_average_usd_per_t) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_curve_weighted_average_usd_per_t]', v_s_ikorodu_curve_weighted_average_usd_per_t, v_g_ikorodu_curve_weighted_average_usd_per_t;
  end if;
  if abs(v_s_ikorodu_curve_weighted_average_usd_per_t - v_g_ikorodu_curve_weighted_average_usd_per_t) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_curve_weighted_average_usd_per_t - v_g_ikorodu_curve_weighted_average_usd_per_t) / 0.01; v_worst_key := 'advanced/ikorodu_curve_weighted_average_usd_per_t';
  end if;
  if v_s_ikorodu_path_final_gap_t is null or abs(v_s_ikorodu_path_final_gap_t - v_g_ikorodu_path_final_gap_t) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_path_final_gap_t]', v_s_ikorodu_path_final_gap_t, v_g_ikorodu_path_final_gap_t;
  end if;
  if abs(v_s_ikorodu_path_final_gap_t - v_g_ikorodu_path_final_gap_t) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_path_final_gap_t - v_g_ikorodu_path_final_gap_t) / 0.01; v_worst_key := 'advanced/ikorodu_path_final_gap_t';
  end if;
  if v_s_ikorodu_saving_cost_per_t_usd is null or abs(v_s_ikorodu_saving_cost_per_t_usd - v_g_ikorodu_saving_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/ikorodu_saving_cost_per_t_usd]', v_s_ikorodu_saving_cost_per_t_usd, v_g_ikorodu_saving_cost_per_t_usd;
  end if;
  if abs(v_s_ikorodu_saving_cost_per_t_usd - v_g_ikorodu_saving_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_ikorodu_saving_cost_per_t_usd - v_g_ikorodu_saving_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_saving_cost_per_t_usd';
  end if;
  raise notice 'carbon go-live: second route in SQL, 16 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated. The value and the
  -- oracle function it came from are written in; igrita_efficiency_lhv_pct and
  -- igrita_tuning_saving_gj have no other second route.
  v_worst := 0; v_worst_key := '(none)';
  -- owaza_heater_co2_t: oracle_carbonabatement.combustion
  if abs(16680.0887386 - v_g_owaza_heater_co2_t) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 16680.0887386, not within 0.01 of the seeded % [graded field: beginner/owaza_heater_co2_t]', v_g_owaza_heater_co2_t;
  end if;
  if abs(16680.0887386 - v_g_owaza_heater_co2_t) / 0.01 > v_worst then
    v_worst := abs(16680.0887386 - v_g_owaza_heater_co2_t) / 0.01; v_worst_key := 'beginner/owaza_heater_co2_t';
  end if;
  -- owaza_flare_co2_t: oracle_carbonabatement.combustion
  if abs(3290.78881824 - v_g_owaza_flare_co2_t) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 3290.78881824, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_co2_t]', v_g_owaza_flare_co2_t;
  end if;
  if abs(3290.78881824 - v_g_owaza_flare_co2_t) / 0.01 > v_worst then
    v_worst := abs(3290.78881824 - v_g_owaza_flare_co2_t) / 0.01; v_worst_key := 'beginner/owaza_flare_co2_t';
  end if;
  -- owaza_flare_ch4_t: oracle_carbonabatement.combustion
  if abs(37.10168352 - v_g_owaza_flare_ch4_t) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 37.10168352, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_ch4_t]', v_g_owaza_flare_ch4_t;
  end if;
  if abs(37.10168352 - v_g_owaza_flare_ch4_t) / 0.01 > v_worst then
    v_worst := abs(37.10168352 - v_g_owaza_flare_ch4_t) / 0.01; v_worst_key := 'beginner/owaza_flare_ch4_t';
  end if;
  -- owaza_flare_ch4_tco2e: oracle_carbonabatement.inventory ledger line
  if abs(1105.630168896 - v_g_owaza_flare_ch4_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 1105.630168896, not within 0.01 of the seeded % [graded field: beginner/owaza_flare_ch4_tco2e]', v_g_owaza_flare_ch4_tco2e;
  end if;
  if abs(1105.630168896 - v_g_owaza_flare_ch4_tco2e) / 0.01 > v_worst then
    v_worst := abs(1105.630168896 - v_g_owaza_flare_ch4_tco2e) / 0.01; v_worst_key := 'beginner/owaza_flare_ch4_tco2e';
  end if;
  -- owaza_scope1_tco2e: oracle_carbonabatement.inventory
  if abs(24862.761560176 - v_g_owaza_scope1_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 24862.761560176, not within 0.01 of the seeded % [graded field: beginner/owaza_scope1_tco2e]', v_g_owaza_scope1_tco2e;
  end if;
  if abs(24862.761560176 - v_g_owaza_scope1_tco2e) / 0.01 > v_worst then
    v_worst := abs(24862.761560176 - v_g_owaza_scope1_tco2e) / 0.01; v_worst_key := 'beginner/owaza_scope1_tco2e';
  end if;
  -- owaza_total_tco2e: oracle_carbonabatement.inventory
  if abs(31983.561560176 - v_g_owaza_total_tco2e) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 31983.561560176, not within 0.01 of the seeded % [graded field: beginner/owaza_total_tco2e]', v_g_owaza_total_tco2e;
  end if;
  if abs(31983.561560176 - v_g_owaza_total_tco2e) / 0.01 > v_worst then
    v_worst := abs(31983.561560176 - v_g_owaza_total_tco2e) / 0.01; v_worst_key := 'beginner/owaza_total_tco2e';
  end if;
  -- igrita_excess_air_pct: oracle_energyefficiency.excess_by_bisection
  if abs(37.864509642356566 - v_g_igrita_excess_air_pct) > 0.0001 then
    raise exception 'carbon go-live refused: the oracle gives 37.864509642356566, not within 0.0001 of the seeded % [graded field: intermediate/igrita_excess_air_pct]', v_g_igrita_excess_air_pct;
  end if;
  if abs(37.864509642356566 - v_g_igrita_excess_air_pct) / 0.0001 > v_worst then
    v_worst := abs(37.864509642356566 - v_g_igrita_excess_air_pct) / 0.0001; v_worst_key := 'intermediate/igrita_excess_air_pct';
  end if;
  -- igrita_efficiency_lhv_pct: oracle_energyefficiency.efficiency (species ledger)
  if abs(85.02159709194139 - v_g_igrita_efficiency_lhv_pct) > 0.0001 then
    raise exception 'carbon go-live refused: the oracle gives 85.02159709194139, not within 0.0001 of the seeded % [graded field: intermediate/igrita_efficiency_lhv_pct]', v_g_igrita_efficiency_lhv_pct;
  end if;
  if abs(85.02159709194139 - v_g_igrita_efficiency_lhv_pct) / 0.0001 > v_worst then
    v_worst := abs(85.02159709194139 - v_g_igrita_efficiency_lhv_pct) / 0.0001; v_worst_key := 'intermediate/igrita_efficiency_lhv_pct';
  end if;
  -- igrita_tuning_saving_gj: oracle_energyefficiency.duty_ledger on its efficiency()
  if abs(7772.0007818097565 - v_g_igrita_tuning_saving_gj) > 1.0 then
    raise exception 'carbon go-live refused: the oracle gives 7772.0007818097565, not within 1.0 of the seeded % [graded field: intermediate/igrita_tuning_saving_gj]', v_g_igrita_tuning_saving_gj;
  end if;
  if abs(7772.0007818097565 - v_g_igrita_tuning_saving_gj) / 1.0 > v_worst then
    v_worst := abs(7772.0007818097565 - v_g_igrita_tuning_saving_gj) / 1.0; v_worst_key := 'intermediate/igrita_tuning_saving_gj';
  end if;
  -- igrita_trap_t_per_yr: oracle_energyefficiency.trap_nozzle
  if abs(469.68800466351036 - v_g_igrita_trap_t_per_yr) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 469.68800466351036, not within 0.01 of the seeded % [graded field: intermediate/igrita_trap_t_per_yr]', v_g_igrita_trap_t_per_yr;
  end if;
  if abs(469.68800466351036 - v_g_igrita_trap_t_per_yr) / 0.01 > v_worst then
    v_worst := abs(469.68800466351036 - v_g_igrita_trap_t_per_yr) / 0.01; v_worst_key := 'intermediate/igrita_trap_t_per_yr';
  end if;
  -- igrita_pinch_hot_utility_kw: oracle_energyefficiency.pinch_by_deficit
  if abs(51.59 - v_g_igrita_pinch_hot_utility_kw) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 51.59, not within 0.01 of the seeded % [graded field: intermediate/igrita_pinch_hot_utility_kw]', v_g_igrita_pinch_hot_utility_kw;
  end if;
  if abs(51.59 - v_g_igrita_pinch_hot_utility_kw) / 0.01 > v_worst then
    v_worst := abs(51.59 - v_g_igrita_pinch_hot_utility_kw) / 0.01; v_worst_key := 'intermediate/igrita_pinch_hot_utility_kw';
  end if;
  -- igrita_pinch_cold_utility_kw: oracle_energyefficiency.pinch_by_deficit
  if abs(224.13 - v_g_igrita_pinch_cold_utility_kw) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 224.13, not within 0.01 of the seeded % [graded field: intermediate/igrita_pinch_cold_utility_kw]', v_g_igrita_pinch_cold_utility_kw;
  end if;
  if abs(224.13 - v_g_igrita_pinch_cold_utility_kw) / 0.01 > v_worst then
    v_worst := abs(224.13 - v_g_igrita_pinch_cold_utility_kw) / 0.01; v_worst_key := 'intermediate/igrita_pinch_cold_utility_kw';
  end if;
  -- ikorodu_boiler_tuning_cost_per_t_usd: oracle_carbonabatement.levelised (PV ledger)
  if abs(-159.38349968932096 - v_g_ikorodu_boiler_tuning_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives -159.38349968932096, not within 0.01 of the seeded % [graded field: advanced/ikorodu_boiler_tuning_cost_per_t_usd]', v_g_ikorodu_boiler_tuning_cost_per_t_usd;
  end if;
  if abs(-159.38349968932096 - v_g_ikorodu_boiler_tuning_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(-159.38349968932096 - v_g_ikorodu_boiler_tuning_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_boiler_tuning_cost_per_t_usd';
  end if;
  -- ikorodu_waste_heat_cost_per_t_usd: oracle_carbonabatement.levelised (PV ledger)
  if abs(-21.197011370440322 - v_g_ikorodu_waste_heat_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives -21.197011370440322, not within 0.01 of the seeded % [graded field: advanced/ikorodu_waste_heat_cost_per_t_usd]', v_g_ikorodu_waste_heat_cost_per_t_usd;
  end if;
  if abs(-21.197011370440322 - v_g_ikorodu_waste_heat_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(-21.197011370440322 - v_g_ikorodu_waste_heat_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_waste_heat_cost_per_t_usd';
  end if;
  -- ikorodu_flare_recovery_net_annual_cost_usd: oracle_carbonabatement.levelised (PV over the annuity)
  if abs(501759.1841668915 - v_g_ikorodu_flare_recovery_net_annual_cost_usd) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 501759.1841668915, not within 0.01 of the seeded % [graded field: advanced/ikorodu_flare_recovery_net_annual_cost_usd]', v_g_ikorodu_flare_recovery_net_annual_cost_usd;
  end if;
  if abs(501759.1841668915 - v_g_ikorodu_flare_recovery_net_annual_cost_usd) / 0.01 > v_worst then
    v_worst := abs(501759.1841668915 - v_g_ikorodu_flare_recovery_net_annual_cost_usd) / 0.01; v_worst_key := 'advanced/ikorodu_flare_recovery_net_annual_cost_usd';
  end if;
  -- ikorodu_curve_weighted_average_usd_per_t: oracle_carbonabatement.curve on the levelised measures
  if abs(12.930882025716885 - v_g_ikorodu_curve_weighted_average_usd_per_t) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 12.930882025716885, not within 0.01 of the seeded % [graded field: advanced/ikorodu_curve_weighted_average_usd_per_t]', v_g_ikorodu_curve_weighted_average_usd_per_t;
  end if;
  if abs(12.930882025716885 - v_g_ikorodu_curve_weighted_average_usd_per_t) / 0.01 > v_worst then
    v_worst := abs(12.930882025716885 - v_g_ikorodu_curve_weighted_average_usd_per_t) / 0.01; v_worst_key := 'advanced/ikorodu_curve_weighted_average_usd_per_t';
  end if;
  -- ikorodu_path_final_gap_t: oracle_carbonabatement.path (year ledger)
  if abs(10762.118 - v_g_ikorodu_path_final_gap_t) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives 10762.118, not within 0.01 of the seeded % [graded field: advanced/ikorodu_path_final_gap_t]', v_g_ikorodu_path_final_gap_t;
  end if;
  if abs(10762.118 - v_g_ikorodu_path_final_gap_t) / 0.01 > v_worst then
    v_worst := abs(10762.118 - v_g_ikorodu_path_final_gap_t) / 0.01; v_worst_key := 'advanced/ikorodu_path_final_gap_t';
  end if;
  -- ikorodu_saving_cost_per_t_usd: oracle_energyefficiency.levelised (PV ledger)
  if abs(-53.3138536584103 - v_g_ikorodu_saving_cost_per_t_usd) > 0.01 then
    raise exception 'carbon go-live refused: the oracle gives -53.3138536584103, not within 0.01 of the seeded % [graded field: advanced/ikorodu_saving_cost_per_t_usd]', v_g_ikorodu_saving_cost_per_t_usd;
  end if;
  if abs(-53.3138536584103 - v_g_ikorodu_saving_cost_per_t_usd) / 0.01 > v_worst then
    v_worst := abs(-53.3138536584103 - v_g_ikorodu_saving_cost_per_t_usd) / 0.01; v_worst_key := 'advanced/ikorodu_saving_cost_per_t_usd';
  end if;
  raise notice 'carbon go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ------------------------------------------------- 4. the traps bite
  -- Each is the wrong route discriminate.mjs swept through the engine that
  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or
  -- the field does not discriminate the trap it is for.
  if abs(16680.467754 - v_g_owaza_heater_co2_t) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (co2 at a rounded 44 01) reads 16680.467754, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_heater_co2_t]', v_g_owaza_heater_co2_t;
  end if;
  if abs(3293.13177952 - v_g_owaza_flare_co2_t) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (carbon mass times 44 over 12) reads 3293.13177952, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_flare_co2_t]', v_g_owaza_flare_co2_t;
  end if;
  if abs(27.777119040000024 - v_g_owaza_flare_ch4_t) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (escaped carbon weighed as carbon) reads 27.777119040000024, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_flare_ch4_t]', v_g_owaza_flare_ch4_t;
  end if;
  if abs(1113.05052 - v_g_owaza_flare_ch4_tco2e) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (ar5 fossil 30) reads 1113.05052, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_flare_ch4_tco2e]', v_g_owaza_flare_ch4_tco2e;
  end if;
  if abs(24895.593017 - v_g_owaza_scope1_tco2e) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (ar5 fossil 30) reads 24895.593017, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_scope1_tco2e]', v_g_owaza_scope1_tco2e;
  end if;
  if abs(32016.393017 - v_g_owaza_total_tco2e) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (ar5 fossil 30) reads 32016.393017, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/owaza_total_tco2e]', v_g_owaza_total_tco2e;
  end if;
  if abs(37.817086 - v_g_igrita_excess_air_pct) <= 0.0001 then
    raise exception 'carbon go-live refused: the trap (co2 in the gas treated as fuel) reads 37.817086, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_excess_air_pct]', v_g_igrita_excess_air_pct;
  end if;
  if abs(85.06764238217585 - v_g_igrita_efficiency_lhv_pct) <= 0.0001 then
    raise exception 'carbon go-live refused: the trap (argon at the nitrogen molar mass) reads 85.06764238217585, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_efficiency_lhv_pct]', v_g_igrita_efficiency_lhv_pct;
  end if;
  if abs(7790.0981498468955 - v_g_igrita_tuning_saving_gj) <= 1.0 then
    raise exception 'carbon go-live refused: the trap (hhv efficiencies) reads 7790.0981498468955, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_tuning_saving_gj]', v_g_igrita_tuning_saving_gj;
  end if;
  if abs(493.08815872 - v_g_igrita_trap_t_per_yr) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (superheated exponent 1 3) reads 493.08815872, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_trap_t_per_yr]', v_g_igrita_trap_t_per_yr;
  end if;
  if abs(0 - v_g_igrita_pinch_hot_utility_kw) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (no temperature shift) reads 0, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_pinch_hot_utility_kw]', v_g_igrita_pinch_hot_utility_kw;
  end if;
  if abs(172.54000000000008 - v_g_igrita_pinch_cold_utility_kw) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (the energy balance alone) reads 172.54000000000008, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/igrita_pinch_cold_utility_kw]', v_g_igrita_pinch_cold_utility_kw;
  end if;
  if abs(-161.594203 - v_g_ikorodu_boiler_tuning_cost_per_t_usd) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (straight line at rate 0) reads -161.594203, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_boiler_tuning_cost_per_t_usd]', v_g_ikorodu_boiler_tuning_cost_per_t_usd;
  end if;
  if abs(-41.325301204819276 - v_g_ikorodu_waste_heat_cost_per_t_usd) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (interest only on the capital) reads -41.325301204819276, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_waste_heat_cost_per_t_usd]', v_g_ikorodu_waste_heat_cost_per_t_usd;
  end if;
  if abs(346759.1842 - v_g_ikorodu_flare_recovery_net_annual_cost_usd) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (running cost left out) reads 346759.1842, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_flare_recovery_net_annual_cost_usd]', v_g_ikorodu_flare_recovery_net_annual_cost_usd;
  end if;
  if abs(9.823978 - v_g_ikorodu_curve_weighted_average_usd_per_t) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (the unscheduled measure left out) reads 9.823978, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_curve_weighted_average_usd_per_t]', v_g_ikorodu_curve_weighted_average_usd_per_t;
  end if;
  if abs(10583.17 - v_g_ikorodu_path_final_gap_t) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (baseline on non fossil methane) reads 10583.17, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_path_final_gap_t]', v_g_ikorodu_path_final_gap_t;
  end if;
  if abs(-72.393724 - v_g_ikorodu_saving_cost_per_t_usd) <= 0.01 then
    raise exception 'carbon go-live refused: the trap (straight line at rate 0) reads -72.393724, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ikorodu_saving_cost_per_t_usd]', v_g_ikorodu_saving_cost_per_t_usd;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'carbon';
  if not exists (select 1 from public.academy_apps where slug = 'carbon' and status = 'available') then
    raise exception 'carbon go-live refused: carbon did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'carbon go-live: carbon available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
