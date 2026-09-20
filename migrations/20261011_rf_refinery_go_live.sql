-- ============================================================================
-- refinery GO-LIVE (HELD): Refinery Feasibility & Planning flips to 'available',
-- the second course of the Commercial & Trading module, at path_order 49.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/refinery. The 78 lessons, the teaching lab
-- (refineryLab.js) and its three explorer panels (screen, plan and variance)
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (refinery_capstone.mjs --json), exactly, so a capstone row an
--      earlier seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL wherever the field is closed form, over the
--      capstone records the prompts were rendered from (the go-live first
--      proves each shipped prompt is the rendered one byte for byte):
--        IKARAMA, all six fields: the scaling laws, the slate, the throughput,
--          the margin per barrel and the first year's revenue;
--        KOLOAMA, the four variance fields: line by line from the actuals and
--          a plan ledger of the ORACLE's plan, each line signed on margin;
--        KOLOAMA, the two tax fields: the expansion's accounts year by year,
--          construction losses pooled and carried forward;
--        AMASSOMA, crude run, crude unit utilisation, margin and margin per
--          barrel as arithmetic on the ORACLE's plan, after that plan is
--          proved feasible in SQL;
--   3. against the ORACLE's exact run for all eighteen, and this is the second
--      route of the two AMASSOMA stream values: an LP optimum is NOT re-solved
--      in SQL. oracle_check.py (the engines repo's Python oracles, the plan on
--      an exact rational simplex accepted only with a duality certificate)
--      computed these values; they are written into gen_golive.py, which
--      refuses to generate unless a fresh oracle run gives every one exactly;
--   4. by the TRAPS the course is built on: for every field the closest miss
--      among discriminate.mjs's wrong routes, run through the engine, must lie
--      outside the field's tolerance.
--   Routes 2 and 3 must agree with the seeded value to a thousandth of its
--   tolerance.
--
-- NO AS-OF DATE. The one date is the Expert plan's period, 2027-03-01 for 31
-- days, which the Expert prompt states; no graded value moves with it. This
-- file reads no clock and gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at its
-- precision class's tolerance (precision.json), with at most six places past
-- the graded place, a label and a unit. NO NPV AND NO IRR IS GRADED.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_wrong numeric;
  v_y int; v_build int; v_life int; v_pool numeric; v_inc numeric; v_tax numeric;
  v_bbl numeric; v_val numeric; v_capex numeric; v_crude numeric;
  v_g_ikarama_modular_capex_usd numeric; v_s_ikarama_modular_capex_usd numeric;
  v_g_ikarama_stick_built_capex_usd numeric; v_s_ikarama_stick_built_capex_usd numeric;
  v_g_ikarama_gross_value_per_bbl numeric; v_s_ikarama_gross_value_per_bbl numeric;
  v_g_ikarama_annual_throughput_bbl numeric; v_s_ikarama_annual_throughput_bbl numeric;
  v_g_ikarama_gross_margin_per_bbl numeric; v_s_ikarama_gross_margin_per_bbl numeric;
  v_g_ikarama_first_year_revenue_usd numeric; v_s_ikarama_first_year_revenue_usd numeric;
  v_g_amassoma_crude_run_bbl numeric; v_s_amassoma_crude_run_bbl numeric;
  v_g_amassoma_cdu_utilisation_pct numeric; v_s_amassoma_cdu_utilisation_pct numeric;
  v_g_amassoma_plan_margin_usd numeric; v_s_amassoma_plan_margin_usd numeric;
  v_g_amassoma_gross_margin_per_bbl numeric; v_s_amassoma_gross_margin_per_bbl numeric;
  v_g_amassoma_naphtha_value_per_bbl numeric; v_s_amassoma_naphtha_value_per_bbl numeric;
  v_g_amassoma_gasoil_value_per_bbl numeric; v_s_amassoma_gasoil_value_per_bbl numeric;
  v_g_koloama_usan_price_variance_usd numeric; v_s_koloama_usan_price_variance_usd numeric;
  v_g_koloama_diesel_volume_variance_usd numeric; v_s_koloama_diesel_volume_variance_usd numeric;
  v_g_koloama_margin_variance_usd numeric; v_s_koloama_margin_variance_usd numeric;
  v_g_koloama_cost_variance_usd numeric; v_s_koloama_cost_variance_usd numeric;
  v_g_koloama_first_tax_mm numeric; v_s_koloama_first_tax_mm numeric;
  v_g_koloama_lifetime_tax_mm numeric; v_s_koloama_lifetime_tax_mm numeric;
  v_ikarama jsonb := '{"sponsor":"Ikarama Petroleum Refinery Ltd","configurationId":"conversion","baseCost":150000000,"baseCapacity":12000,"capacityBpd":8000,"onstreamDays":335,"scenarioId":"tight","crudeCostPerBbl":71,"fixedOpexPerYear":9400000,"variableOpexPerBbl":4.1,"projectLife":20,"constructionYears":2,"prices":{"lpg":51.5,"gasoline":106.4,"kerosene":98.7,"diesel":102.9,"fuelOil":56.2}}'::jsonb;
  v_amassoma jsonb := '{"operator":"Amassoma River Refining Ltd","streams":["naphtha","reformate","kero","gasoil","ulsd","residue","offgas"],"crudes":[{"id":"amenam","name":"Amenam Blend (illustrative)","cost":79.4,"available":1600000,"yields":{"naphtha":0.24,"kero":0.16,"gasoil":0.3,"residue":0.27,"offgas":0.03}},{"id":"okono","name":"Okono (illustrative)","cost":76.1,"available":1200000,"yields":{"naphtha":0.17,"kero":0.14,"gasoil":0.33,"residue":0.34,"offgas":0.02}},{"id":"qua_iboe","name":"Qua Iboe (illustrative)","cost":75.2,"available":0,"yields":{"naphtha":0.25,"kero":0.15,"gasoil":0.31,"residue":0.26,"offgas":0.03}}],"units":[{"id":"cdu","name":"Crude distillation","capacity":2300000,"opex":1.35,"feed":"","yields":{}},{"id":"reformer","name":"Naphtha reformer","capacity":380000,"opex":2.85,"feed":"naphtha","yields":{"reformate":0.86,"offgas":0.09}},{"id":"dht","name":"Diesel hydrotreater","capacity":600000,"opex":1.9,"feed":"gasoil","yields":{"ulsd":0.97,"offgas":0.02}}],"products":[{"id":"gasoline","name":"Gasoline","price":109.5,"minDemand":0,"maxDemand":400000,"recipe":{"reformate":1}},{"id":"naphtha_export","name":"Naphtha export","price":71.8,"minDemand":0,"maxDemand":250000,"recipe":{"naphtha":1}},{"id":"jet","name":"Jet A-1","price":104.2,"minDemand":0,"maxDemand":350000,"recipe":{"kero":1}},{"id":"diesel","name":"Diesel (ULSD)","price":103.6,"minDemand":0,"maxDemand":700000,"recipe":{"ulsd":1}},{"id":"gasoil_export","name":"Gasoil export","price":88,"minDemand":0,"maxDemand":300000,"recipe":{"gasoil":1}},{"id":"fuel_oil","name":"Fuel oil","price":58.3,"minDemand":0,"maxDemand":900000,"recipe":{"residue":1}}]}'::jsonb;
  v_koloama jsonb := '{"operator":"Koloama Energy Refining Ltd","streams":["naphtha","reformate","kero","gasoil","residue","offgas"],"crudes":[{"id":"usan","name":"Usan (illustrative)","cost":77.7,"available":900000,"yields":{"naphtha":0.2,"kero":0.14,"gasoil":0.32,"residue":0.31,"offgas":0.03}},{"id":"yoho","name":"Yoho (illustrative)","cost":80.6,"available":500000,"yields":{"naphtha":0.27,"kero":0.16,"gasoil":0.3,"residue":0.24,"offgas":0.03}}],"units":[{"id":"cdu","name":"Crude distillation","capacity":1350000,"opex":1.3,"feed":"","yields":{}},{"id":"reformer","name":"Naphtha reformer","capacity":240000,"opex":2.95,"feed":"naphtha","yields":{"reformate":0.87,"offgas":0.08}}],"products":[{"id":"gasoline","name":"Gasoline","price":109.8,"minDemand":0,"maxDemand":260000,"recipe":{"reformate":1}},{"id":"jet","name":"Jet A-1","price":103.7,"minDemand":0,"maxDemand":200000,"recipe":{"kero":1}},{"id":"diesel","name":"Diesel","price":101.3,"minDemand":0,"maxDemand":450000,"recipe":{"gasoil":1}},{"id":"fuel_oil","name":"Fuel oil","price":59.4,"minDemand":0,"maxDemand":600000,"recipe":{"residue":1}}],"cargoSize":450000,"actuals":[{"materialId":"usan","type":"receipt","quantity":935000,"cost":73304000},{"materialId":"yoho","type":"receipt","quantity":205000,"cost":16676750},{"materialId":"cdu","type":"unit_run","quantity":1140000,"cost":1527600},{"materialId":"reformer","type":"unit_run","quantity":226500,"cost":684030},{"materialId":"gasoline","type":"delivery","quantity":197100,"cost":21799260},{"materialId":"jet","type":"delivery","quantity":158900,"cost":16358755},{"materialId":"diesel","type":"delivery","quantity":361200,"cost":36788220},{"materialId":"fuel_oil","type":"delivery","quantity":338400,"cost":19847160},{"materialId":"lpg","type":"delivery","quantity":7500,"cost":361500}],"expansion":{"configurationId":"hydroskimming","capacityBpd":7500,"onstreamDays":338,"scenarioId":"firm","crudeCostPerBbl":72.5,"baseCost":95000000,"baseCapacity":10000,"modularExponent":0.9,"fixedOpexPerYear":8800000,"variableOpexPerBbl":3.4,"projectLife":15,"constructionYears":2,"discountRate":10,"taxRate":30,"prices":{"lpg":50.8,"gasoline":107.1,"naphtha":74.6,"kerosene":99.3,"diesel":103.4,"fuelOil":57.6}}}'::jsonb;
  v_const jsonb := '{"SCALING_EXPONENT":{"STICK_BUILT":0.6,"MODULAR":0.9},"CONFIGURATIONS":{"topping":{"lpg":0.02,"naphtha":0.18,"kerosene":0.14,"diesel":0.3,"fuelOil":0.34,"loss":0.02},"hydroskimming":{"lpg":0.03,"gasoline":0.2,"kerosene":0.13,"diesel":0.32,"fuelOil":0.3,"loss":0.02},"conversion":{"lpg":0.05,"gasoline":0.34,"kerosene":0.12,"diesel":0.33,"fuelOil":0.14,"loss":0.02}},"SUPPLY_SCENARIOS":[{"id":"firm","name":"Firm supply","utilisation":0.92,"crudePremium":0},{"id":"tight","name":"Tight supply","utilisation":0.75,"crudePremium":3},{"id":"disrupted","name":"Disrupted supply","utilisation":0.5,"crudePremium":6}]}'::jsonb;
  v_oplan_a jsonb := '{"crudeRuns":[680000.0,1200000.0,0.0],"unitRuns":[1880000.0,367200.0,600000.0],"productMakes":[315792.0,0.0,276800.0,582000.0,0.0,591600.0],"margin":8170744.0}'::jsonb;
  v_oplan_k jsonb := '{"crudeRuns":[900000.0,222222.22222222222],"unitRuns":[1122222.2222222222,240000.0],"productMakes":[208800.0,161555.55555555556,354666.6666666667,332333.3333333333],"margin":5339884.444444444}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'refinery' and active;
  if v_structures <> 3 then
    raise exception 'refinery go-live refused: refinery has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'refinery';
  if v_questions <> 396 then
    raise exception 'refinery go-live refused: refinery has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'refinery'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'refinery' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'refinery' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'refinery'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'refinery' and s.active;
  if v_lessons <> 78 then
    raise exception 'refinery go-live refused: refinery carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'refinery' and s.active;
  if v_modules <> 18 then
    raise exception 'refinery go-live refused: refinery carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'refinery' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'refinery';
  if v_capstones <> 3 then
    raise exception 'refinery go-live refused: refinery has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'refinery';
  if v_graded <> 18 then
    raise exception 'refinery go-live refused: refinery has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'refinery' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'refinery' and module = 'commercial_trading'
                    and path_order = 49 and prereq_slug is null) then
    raise exception 'refinery go-live refused: the refinery catalogue row is not commercial_trading at path_order 49 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 49 and slug <> 'refinery') then
    raise exception 'refinery go-live refused: another course already holds path_order 49';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 48 and slug <> 'crude') then
    raise exception 'refinery go-live refused: path_order 48, the sibling slot of crude, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 50 and slug <> 'supply') then
    raise exception 'refinery go-live refused: path_order 50, the sibling slot of supply, is held by another course';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- NO NPV AND NO IRR IS GRADED: the Economics courses grade those.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery'
     and (coalesce(f->>'key', '') || ' ' || coalesce(f->>'label', '') || ' ' || coalesce(f->>'unit', ''))
         ~* '(npv|irr|net present|internal rate)';
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) name an NPV or an IRR, which this course does not grade: %', v_n, v_names;
  end if;

  -- Every field numeric at its precision class's tolerance (precision.json),
  -- no more than six places past the graded place, with a label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '?'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (case when f->>'key' = 'ikarama_modular_capex_usd' then 0.5 when f->>'key' = 'ikarama_stick_built_capex_usd' then 0.5 when f->>'key' = 'ikarama_gross_value_per_bbl' then 0.005 when f->>'key' = 'ikarama_annual_throughput_bbl' then 0.5 when f->>'key' = 'ikarama_gross_margin_per_bbl' then 0.005 when f->>'key' = 'ikarama_first_year_revenue_usd' then 0.5 when f->>'key' = 'amassoma_crude_run_bbl' then 0.5 when f->>'key' = 'amassoma_cdu_utilisation_pct' then 0.005 when f->>'key' = 'amassoma_plan_margin_usd' then 0.5 when f->>'key' = 'amassoma_gross_margin_per_bbl' then 0.005 when f->>'key' = 'amassoma_naphtha_value_per_bbl' then 0.005 when f->>'key' = 'amassoma_gasoil_value_per_bbl' then 0.005 when f->>'key' = 'koloama_usan_price_variance_usd' then 0.5 when f->>'key' = 'koloama_diesel_volume_variance_usd' then 0.5 when f->>'key' = 'koloama_margin_variance_usd' then 0.5 when f->>'key' = 'koloama_cost_variance_usd' then 0.5 when f->>'key' = 'koloama_first_tax_mm' then 0.00005 when f->>'key' = 'koloama_lifetime_tax_mm' then 0.00005 end) is null
          or (f->>'tol')::numeric <> (case when f->>'key' = 'ikarama_modular_capex_usd' then 0.5 when f->>'key' = 'ikarama_stick_built_capex_usd' then 0.5 when f->>'key' = 'ikarama_gross_value_per_bbl' then 0.005 when f->>'key' = 'ikarama_annual_throughput_bbl' then 0.5 when f->>'key' = 'ikarama_gross_margin_per_bbl' then 0.005 when f->>'key' = 'ikarama_first_year_revenue_usd' then 0.5 when f->>'key' = 'amassoma_crude_run_bbl' then 0.5 when f->>'key' = 'amassoma_cdu_utilisation_pct' then 0.005 when f->>'key' = 'amassoma_plan_margin_usd' then 0.5 when f->>'key' = 'amassoma_gross_margin_per_bbl' then 0.005 when f->>'key' = 'amassoma_naphtha_value_per_bbl' then 0.005 when f->>'key' = 'amassoma_gasoil_value_per_bbl' then 0.005 when f->>'key' = 'koloama_usan_price_variance_usd' then 0.5 when f->>'key' = 'koloama_diesel_volume_variance_usd' then 0.5 when f->>'key' = 'koloama_margin_variance_usd' then 0.5 when f->>'key' = 'koloama_cost_variance_usd' then 0.5 when f->>'key' = 'koloama_first_tax_mm' then 0.00005 when f->>'key' = 'koloama_lifetime_tax_mm' then 0.00005 end)
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric, case when f->>'key' = 'ikarama_modular_capex_usd' then 6 when f->>'key' = 'ikarama_stick_built_capex_usd' then 6 when f->>'key' = 'ikarama_gross_value_per_bbl' then 8 when f->>'key' = 'ikarama_annual_throughput_bbl' then 6 when f->>'key' = 'ikarama_gross_margin_per_bbl' then 8 when f->>'key' = 'ikarama_first_year_revenue_usd' then 6 when f->>'key' = 'amassoma_crude_run_bbl' then 6 when f->>'key' = 'amassoma_cdu_utilisation_pct' then 8 when f->>'key' = 'amassoma_plan_margin_usd' then 6 when f->>'key' = 'amassoma_gross_margin_per_bbl' then 8 when f->>'key' = 'amassoma_naphtha_value_per_bbl' then 8 when f->>'key' = 'amassoma_gasoil_value_per_bbl' then 8 when f->>'key' = 'koloama_usan_price_variance_usd' then 6 when f->>'key' = 'koloama_diesel_volume_variance_usd' then 6 when f->>'key' = 'koloama_margin_variance_usd' then 6 when f->>'key' = 'koloama_cost_variance_usd' then 6 when f->>'key' = 'koloama_first_tax_mm' then 10 when f->>'key' = 'koloama_lifetime_tax_mm' then 10 end)
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are not a number at their precision class tolerance with a label and a unit: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- refinery_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'refinery' and tier = 'beginner';
  if v_prompt is distinct from 'IKARAMA MODULAR REFINERY, Ikarama Petroleum Refinery Ltd. Every price is illustrative, in US dollars. A vendor quoted a 12000 bpd plant at 150 million dollars; the sponsor studies a conversion plant of 8000 bpd with the configuration''s screening yields, 335 on-stream days a year, under the tight supply scenario, crude at 71 dollars a barrel before any premium, a fixed operating cost of 9.4 million dollars a year, a variable operating cost of 4.1 dollars a barrel, 2 construction years and 20 operating years. Product prices a barrel: lpg 51.5, gasoline 106.4, kerosene 98.7, diesel 102.9, fuelOil 56.2. Give six numbers. (1) The capital cost by the modular scaling law, to the whole dollar. (2) The capital cost by the stick-built scaling law, to the whole dollar. (3) The gross value of the product slate per barrel of crude, to the cent. (4) The annual crude throughput under the scenario, to the whole barrel. (5) The gross margin per barrel of crude under the scenario, to the cent. (6) The revenue in the first operating year, to the whole dollar.' then
    raise exception 'refinery go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'refinery' and tier = 'intermediate';
  if v_prompt is distinct from 'AMASSOMA REFINERY, Amassoma River Refining Ltd: the plan for one month. Every price is illustrative, in US dollars; yields are volume fractions. Streams: naphtha, reformate, kero, gasoil, ulsd, residue, offgas. Crudes: Amenam Blend (illustrative) at 79.4 dollars a barrel, up to 1600000 barrels, yields naphtha 0.24, kero 0.16, gasoil 0.3, residue 0.27, offgas 0.03; Okono (illustrative) at 76.1 dollars a barrel, up to 1200000 barrels, yields naphtha 0.17, kero 0.14, gasoil 0.33, residue 0.34, offgas 0.02; Qua Iboe (illustrative) at 75.2 dollars a barrel, availability typed as 0 (the cargo was cancelled), yields naphtha 0.25, kero 0.15, gasoil 0.31, residue 0.26, offgas 0.03. Units: Crude distillation, capacity 2300000 barrels, operating cost 1.35 dollars a barrel, no feed (the crude unit); Naphtha reformer, capacity 380000 barrels, operating cost 2.85 dollars a barrel, feed naphtha, yields reformate 0.86, offgas 0.09; Diesel hydrotreater, capacity 600000 barrels, operating cost 1.9 dollars a barrel, feed gasoil, yields ulsd 0.97, offgas 0.02. Products: Gasoline at 109.5 dollars a barrel, up to 400000 barrels, made from reformate 1; Naphtha export at 71.8 dollars a barrel, up to 250000 barrels, made from naphtha 1; Jet A-1 at 104.2 dollars a barrel, up to 350000 barrels, made from kero 1; Diesel (ULSD) at 103.6 dollars a barrel, up to 700000 barrels, made from ulsd 1; Gasoil export at 88 dollars a barrel, up to 300000 barrels, made from gasoil 1; Fuel oil at 58.3 dollars a barrel, up to 900000 barrels, made from residue 1. Every demand floor is 0. Give six numbers from the optimal plan. (1) The total crude run, to the whole barrel. (2) The crude unit''s utilisation, in percent to two decimals. (3) The plan margin for the month, to the whole dollar. (4) The gross margin per barrel of crude, to the cent. (5) What one more barrel of naphtha is worth to the plan, in dollars a barrel to the cent. (6) What one more barrel of gasoil is worth to the plan, in dollars a barrel to the cent.' then
    raise exception 'refinery go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'refinery' and tier = 'advanced';
  if v_prompt is distinct from 'KOLOAMA REFINERY, Koloama Energy Refining Ltd. Every price is illustrative, in US dollars; yields are volume fractions. THE MONTH: the plan for the 31-day period starting 2027-03-01, cascaded with a cargo size of 450000 barrels, is the plan ledger. Streams: naphtha, reformate, kero, gasoil, residue, offgas. Crudes: Usan (illustrative) at 77.7 dollars a barrel, up to 900000 barrels, yields naphtha 0.2, kero 0.14, gasoil 0.32, residue 0.31, offgas 0.03; Yoho (illustrative) at 80.6 dollars a barrel, up to 500000 barrels, yields naphtha 0.27, kero 0.16, gasoil 0.3, residue 0.24, offgas 0.03. Units: Crude distillation, capacity 1350000 barrels, operating cost 1.3 dollars a barrel, no feed (the crude unit); Naphtha reformer, capacity 240000 barrels, operating cost 2.95 dollars a barrel, feed naphtha, yields reformate 0.87, offgas 0.08. Products: Gasoline at 109.8 dollars a barrel, up to 260000 barrels, made from reformate 1; Jet A-1 at 103.7 dollars a barrel, up to 200000 barrels, made from kero 1; Diesel at 101.3 dollars a barrel, up to 450000 barrels, made from gasoil 1; Fuel oil at 59.4 dollars a barrel, up to 600000 barrels, made from residue 1. Every demand floor is 0. What the month did, one movement a material and type (a delivery''s value is what it sold for): usan receipt 935000 barrels, 73304000 dollars; yoho receipt 205000 barrels, 16676750 dollars; cdu unit_run 1140000 barrels, 1527600 dollars; reformer unit_run 226500 barrels, 684030 dollars; gasoline delivery 197100 barrels, 21799260 dollars; jet delivery 158900 barrels, 16358755 dollars; diesel delivery 361200 barrels, 36788220 dollars; fuel_oil delivery 338400 barrels, 19847160 dollars; lpg delivery 7500 barrels, 361500 dollars. THE EXPANSION: a second hydroskimming train of 7500 bpd with the configuration''s screening yields, capital by the modular scaling law from a quotation of 95 million dollars for 10000 bpd, 338 on-stream days, firm supply, crude at 72.5 dollars a barrel, fixed operating cost 8.8 million dollars a year, variable operating cost 3.4 dollars a barrel, 2 construction years, 15 operating years, tax rate 30 percent, discount rate 10 percent, product prices a barrel lpg 50.8, gasoline 107.1, naphtha 74.6, kerosene 99.3, diesel 103.4, fuelOil 57.6, valued as the Modular Refinery Feasibility Studio values it. Give six numbers. (1) The price variance on the Usan crude receipts, to the whole dollar. (2) The volume variance on the diesel lifts, to the whole dollar. (3) The month''s total variance on margin across the matched lines, to the whole dollar. (4) The total variance on the cost lines as recorded, to the whole dollar. (5) The expansion''s tax in the first year it pays any, in millions of dollars to four decimals. (6) The expansion''s total tax over its life, in millions of dollars to four decimals.' then
    raise exception 'refinery go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  if strpos(v_prompt, 'the 31-day period starting 2027-03-01') = 0 then
    raise exception 'refinery go-live refused: the advanced prompt does not state the planning period (the 31-day period starting 2027-03-01)';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_ikarama_modular_capex_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_modular_capex_usd';
  select (f->>'expected')::numeric into v_g_ikarama_stick_built_capex_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_stick_built_capex_usd';
  select (f->>'expected')::numeric into v_g_ikarama_gross_value_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_gross_value_per_bbl';
  select (f->>'expected')::numeric into v_g_ikarama_annual_throughput_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_annual_throughput_bbl';
  select (f->>'expected')::numeric into v_g_ikarama_gross_margin_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_gross_margin_per_bbl';
  select (f->>'expected')::numeric into v_g_ikarama_first_year_revenue_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'beginner' and f->>'key' = 'ikarama_first_year_revenue_usd';
  select (f->>'expected')::numeric into v_g_amassoma_crude_run_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_crude_run_bbl';
  select (f->>'expected')::numeric into v_g_amassoma_cdu_utilisation_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_cdu_utilisation_pct';
  select (f->>'expected')::numeric into v_g_amassoma_plan_margin_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_plan_margin_usd';
  select (f->>'expected')::numeric into v_g_amassoma_gross_margin_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_gross_margin_per_bbl';
  select (f->>'expected')::numeric into v_g_amassoma_naphtha_value_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_naphtha_value_per_bbl';
  select (f->>'expected')::numeric into v_g_amassoma_gasoil_value_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'intermediate' and f->>'key' = 'amassoma_gasoil_value_per_bbl';
  select (f->>'expected')::numeric into v_g_koloama_usan_price_variance_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_usan_price_variance_usd';
  select (f->>'expected')::numeric into v_g_koloama_diesel_volume_variance_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_diesel_volume_variance_usd';
  select (f->>'expected')::numeric into v_g_koloama_margin_variance_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_margin_variance_usd';
  select (f->>'expected')::numeric into v_g_koloama_cost_variance_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_cost_variance_usd';
  select (f->>'expected')::numeric into v_g_koloama_first_tax_mm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_first_tax_mm';
  select (f->>'expected')::numeric into v_g_koloama_lifetime_tax_mm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery' and c.tier = 'advanced' and f->>'key' = 'koloama_lifetime_tax_mm';
  if v_g_ikarama_modular_capex_usd is null
     or v_g_ikarama_stick_built_capex_usd is null
     or v_g_ikarama_gross_value_per_bbl is null
     or v_g_ikarama_annual_throughput_bbl is null
     or v_g_ikarama_gross_margin_per_bbl is null
     or v_g_ikarama_first_year_revenue_usd is null
     or v_g_amassoma_crude_run_bbl is null
     or v_g_amassoma_cdu_utilisation_pct is null
     or v_g_amassoma_plan_margin_usd is null
     or v_g_amassoma_gross_margin_per_bbl is null
     or v_g_amassoma_naphtha_value_per_bbl is null
     or v_g_amassoma_gasoil_value_per_bbl is null
     or v_g_koloama_usan_price_variance_usd is null
     or v_g_koloama_diesel_volume_variance_usd is null
     or v_g_koloama_margin_variance_usd is null
     or v_g_koloama_cost_variance_usd is null
     or v_g_koloama_first_tax_mm is null
     or v_g_koloama_lifetime_tax_mm is null then
    raise exception 'refinery go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- PROMPTS. No graded value of any tier is a number token in any prompt once
  -- its YYYY-MM-DD conditions are taken out, signed or absolute, read as it
  -- stands, x1e6 or /1e6 (the prompts state money in millions).
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(regexp_replace(p.prompt, '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'), '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         unnest(array[1, 1e6, 0.000001]::numeric[]) sh
   where c.app_slug = 'refinery' and p.app_slug = 'refinery'
     and abs(abs((m[1])::numeric) * sh - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are printed in a prompt: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (152), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(regexp_replace(p.prompt, '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'), '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where p.app_slug = 'refinery';
  if v_n <> 152 then
    raise exception 'refinery go-live refused: the prompt sweep read % number tokens, and gen_course.py read 152 from the same prompts', v_n;
  end if;

  -- The dataset lines, titles and labels are read beside the prompt.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' beside the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(regexp_replace(p.dataset || ' ' || p.title || ' ' || (select string_agg(g->>'label', ' ') from jsonb_array_elements(p.fields) g), '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'), '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where c.app_slug = 'refinery' and p.app_slug = 'refinery'
     and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are printed in a dataset line, title or label: %', v_n, v_names;
  end if;

  -- DERIVED FIGURES. None of the 40 figures the engine derives on the way
  -- to a graded field that are not themselves stated conditions (a scaled
  -- capital cost, the annual throughput, each plan volume and ledger value) is
  -- a number in any prompt, dataset line, title or label.
  select count(*), string_agg(distinct d::text || ' in the ' || p.tier || ' capstone', ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(regexp_replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || (select string_agg(g->>'label', ' ') from jsonb_array_elements(p.fields) g), '[0-9]{4}-[0-9]{2}-[0-9]{2}', ' ', 'g'), '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         unnest(array[161555.555556, 208800, 222222.222222, 276800, 315792, 332333.333333, 354666.666667, 367200, 582000, 591600, 680000, 708000, 1046520, 1122222.222222, 1458888.888889, 1880000, 2010000, 2166888.888889, 2538000, 4724520, 5339884.444444, 8170744, 16753311.111111, 17911111.111111, 19740600, 22926240, 28842560, 34490280, 34579224, 35927733.333333, 53992000, 60295200, 69930000, 87841111.111111, 91320000, 95347884.444444, 104137974.399241, 117607902.252467, 145312000, 158207264]::numeric[]) d
   where p.app_slug = 'refinery'
     and abs((m[1])::numeric) >= 1 and abs(abs((m[1])::numeric) - d) <= 0.5;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % engine-derived figure(s) are printed in a capstone: %', v_n, v_names;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'refinery') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'refinery') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (461 distinct values, dates
  -- included, read by the regex -?[0-9]+[.]?[0-9]*): a graded field that is a
  -- figure the digest prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'refinery'
     and exists (select 1 from unnest(array[0, 0.01, 0.02, 0.03, 0.0438, 0.05, 0.1, 0.1158, 0.12, 0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.26, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.5, 0.577, 0.6, 0.617, 0.75, 0.8123, 0.8226, 0.85, 0.8736, 0.9, 0.92, 0.97, 1, 1.04, 1.1822, 1.2311, 1.25, 1.4, 1.41, 1.47, 1.5, 1.5157, 1.56, 1.59, 1.7118, 1.8, 2, 2.068157348, 2.0682, 2.26, 2.3061, 2.6, 2.6147, 2.75, 2.9, 2.9113, 2.9773, 3, 3.1, 3.2, 3.4445, 3.4883, 3.6041, 4, 4.2, 4.59, 4.7763, 5, 5.26, 5.43, 6, 7, 7.7, 7.7559, 8, 8.26, 8.43, 9, 10, 10.9559, 10.955933596, 11, 11.43, 11.5763808, 11.5764, 11.64, 12, 12.61, 13, 13.32, 13.58, 14, 14.01, 15, 15.7651, 16, 16.5, 17, 18, 18.7, 19, 20, 20.8, 21, 22, 23, 24, 25, 26, 27, 27.0116, 27.632, 28, 28.28, 29, 30, 30.3, 31, 32, 32.32, 33, 33.33, 34, 35, 35.3496, 35.36, 36, 37, 38, 38.5879, 38.587936, 39, 40, 40.656093348, 40.6561, 41, 52, 55, 58.915982674, 58.916, 59, 60.2, 61, 63.62, 64.844, 67.22, 68.95, 72.5, 73.5, 74, 76, 76.8, 76.94, 77.6, 78.04, 78.9, 79, 79.244, 79.244029348, 79.6607, 80.1, 80.2, 80.4, 81.19, 81.3, 82, 82.55, 83.6941, 83.79, 84.93, 87.23, 87.8029, 88.63, 88.6345, 89.5, 90, 90.63, 91.45, 92.21, 92.65, 94.1016, 97, 97.07, 98.4, 99.856, 100, 100.6, 101, 104, 104.0998, 104.8, 104.9, 105.5, 110.5, 111, 112.0895, 117.831965348, 117.832, 196.178, 231.5276, 291.7664, 307.5315, 307.53152, 330, 340, 346.119456, 346.1195, 366, 400, 500, 1000, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2500, 5000, 6251, 7351.67, 9000, 9700.59, 10000, 10700.27, 11143.05, 11942.82, 12000, 12800, 13100, 13718.7, 15035.12, 16889.7, 20000, 24366.77, 30000, 34800, 42607.14, 50740, 51450, 57670.97, 59000, 59545.39, 69305.16, 74035.71, 80980, 81535.48, 90000, 95572.87, 101200, 103638.71, 104000, 112660, 126100, 126625.81, 130000, 131000, 135000, 136000, 150000, 155118.26, 160000, 163400, 168000, 169800, 179070, 182900, 190000, 200000, 210000, 212000, 230175.48, 234000, 235150, 236452.9, 244000, 250000, 265000, 270710, 288354.84, 300000, 314000, 319550, 324178.57, 329032.26, 334000, 346525.81, 350000, 357000, 366666.67, 371000, 380000, 400000, 405806.45, 407677.42, 419200, 420000, 424264.71, 440000, 441000, 450000, 460000, 480000, 500000, 507258.06, 536800, 567857.14, 589000, 600000, 630500, 633129.03, 650000, 666608.7, 700000, 735000, 735294.12, 750000, 825000, 955500, 1000000, 1020050, 1080450, 1100000, 1148089.05, 1170000, 1182264.52, 1200000, 1237500, 1290760, 1400000, 1500000, 1518000, 1530000, 1650000, 1747826.09, 1900000, 2029032.26, 2082608.7, 2267857.14, 2536290.32, 2536290.33, 2600000, 3047230.44, 3650520, 3731500, 3753600, 3949690, 4030705.04, 4776300, 4857600, 4888554.84, 5011450, 5427700, 5452450, 5606770, 5929846.43, 6084287.1, 6092800, 6260800, 6653670.77, 6847760, 6863271.83, 7018390.09, 7077935.48, 7173508.35, 7470922.58, 7500000, 7692872.9, 9054000, 9590800, 9614225.81, 10534900, 10651500, 11607000, 12628000, 12810000, 13215280, 14000000, 14266400, 15035122.47, 15765120, 18055700, 18902800, 19390350, 20622400, 21333333.33, 24009600, 24120000, 24366770.42, 24572090, 24842800, 26750322.58, 28453333.33, 30421435.48, 30508000, 30720000, 32000000, 33600400, 34296750.8, 37354612.9, 38464364.52, 42224253.14, 44233150, 47340000, 48240000, 58915982.67, 58947000, 60423500, 60658650, 63475500, 64000000, 66076400, 67650000, 69126750, 74769750, 80049000, 84825300, 85360000, 95213250, 97005860.26, 97762500, 100000000, 103690125, 112154625, 115368000, 116794920, 117831965.35, 119428222.92, 127193220, 128000000, 137576340, 147033389.44, 160350322.58, 172316812.9, 187529987.3, 222860944.2, 321008180]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  if v_g_ikarama_modular_capex_usd <> 104137974.399241 then
    raise exception 'refinery go-live refused: the seeded value % is not the 104137974.399241 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_modular_capex_usd]', v_g_ikarama_modular_capex_usd;
  end if;
  if v_g_ikarama_stick_built_capex_usd <> 117607902.252467 then
    raise exception 'refinery go-live refused: the seeded value % is not the 117607902.252467 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_stick_built_capex_usd]', v_g_ikarama_stick_built_capex_usd;
  end if;
  if v_g_ikarama_gross_value_per_bbl <> 92.42 then
    raise exception 'refinery go-live refused: the seeded value % is not the 92.42 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_gross_value_per_bbl]', v_g_ikarama_gross_value_per_bbl;
  end if;
  if v_g_ikarama_annual_throughput_bbl <> 2010000 then
    raise exception 'refinery go-live refused: the seeded value % is not the 2010000 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_annual_throughput_bbl]', v_g_ikarama_annual_throughput_bbl;
  end if;
  if v_g_ikarama_gross_margin_per_bbl <> 14.32 then
    raise exception 'refinery go-live refused: the seeded value % is not the 14.32 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_gross_margin_per_bbl]', v_g_ikarama_gross_margin_per_bbl;
  end if;
  if v_g_ikarama_first_year_revenue_usd <> 185764200 then
    raise exception 'refinery go-live refused: the seeded value % is not the 185764200 the engine returned through refinery_capstone.mjs [graded field: beginner/ikarama_first_year_revenue_usd]', v_g_ikarama_first_year_revenue_usd;
  end if;
  if v_g_amassoma_crude_run_bbl <> 1880000 then
    raise exception 'refinery go-live refused: the seeded value % is not the 1880000 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_crude_run_bbl]', v_g_amassoma_crude_run_bbl;
  end if;
  if v_g_amassoma_cdu_utilisation_pct <> 81.73913043 then
    raise exception 'refinery go-live refused: the seeded value % is not the 81.73913043 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_cdu_utilisation_pct]', v_g_amassoma_cdu_utilisation_pct;
  end if;
  if v_g_amassoma_plan_margin_usd <> 8170744 then
    raise exception 'refinery go-live refused: the seeded value % is not the 8170744 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_plan_margin_usd]', v_g_amassoma_plan_margin_usd;
  end if;
  if v_g_amassoma_gross_margin_per_bbl <> 4.34614043 then
    raise exception 'refinery go-live refused: the seeded value % is not the 4.34614043 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_gross_margin_per_bbl]', v_g_amassoma_gross_margin_per_bbl;
  end if;
  if v_g_amassoma_naphtha_value_per_bbl <> 91.32 then
    raise exception 'refinery go-live refused: the seeded value % is not the 91.32 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_naphtha_value_per_bbl]', v_g_amassoma_naphtha_value_per_bbl;
  end if;
  if v_g_amassoma_gasoil_value_per_bbl <> 88.06733333 then
    raise exception 'refinery go-live refused: the seeded value % is not the 88.06733333 the engine returned through refinery_capstone.mjs [graded field: intermediate/amassoma_gasoil_value_per_bbl]', v_g_amassoma_gasoil_value_per_bbl;
  end if;
  if v_g_koloama_usan_price_variance_usd <> 654500 then
    raise exception 'refinery go-live refused: the seeded value % is not the 654500 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_usan_price_variance_usd]', v_g_koloama_usan_price_variance_usd;
  end if;
  if v_g_koloama_diesel_volume_variance_usd <> 661826.666667 then
    raise exception 'refinery go-live refused: the seeded value % is not the 661826.666667 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_diesel_volume_variance_usd]', v_g_koloama_diesel_volume_variance_usd;
  end if;
  if v_g_koloama_margin_variance_usd <> -2738869.444444 then
    raise exception 'refinery go-live refused: the seeded value % is not the -2738869.444444 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_margin_variance_usd]', v_g_koloama_margin_variance_usd;
  end if;
  if v_g_koloama_cost_variance_usd <> 2184380 then
    raise exception 'refinery go-live refused: the seeded value % is not the 2184380 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_cost_variance_usd]', v_g_koloama_cost_variance_usd;
  end if;
  if v_g_koloama_first_tax_mm <> 0.9071033584 then
    raise exception 'refinery go-live refused: the seeded value % is not the 0.9071033584 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_first_tax_mm]', v_g_koloama_first_tax_mm;
  end if;
  if v_g_koloama_lifetime_tax_mm <> 46.7190119584 then
    raise exception 'refinery go-live refused: the seeded value % is not the 46.7190119584 the engine returned through refinery_capstone.mjs [graded field: advanced/koloama_lifetime_tax_mm]', v_g_koloama_lifetime_tax_mm;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IKARAMA: the modular screen, closed form. Capital by a power
  -- law from the quotation (the engine's two exponents), the slate as the sum
  -- of each screening yield times its price (the loss is sold for nothing),
  -- the year's barrels as capacity x on-stream days x the scenario's
  -- utilisation, the margin per barrel as the slate less the crude with the
  -- scenario's premium and the variable cost, the first operating year's
  -- revenue as its barrels times the slate.
  v_s_ikarama_modular_capex_usd := ((v_ikarama->>'baseCost')::numeric * power((v_ikarama->>'capacityBpd')::numeric / (v_ikarama->>'baseCapacity')::numeric, (v_const->'SCALING_EXPONENT'->>'MODULAR')::numeric));
  v_s_ikarama_stick_built_capex_usd := ((v_ikarama->>'baseCost')::numeric * power((v_ikarama->>'capacityBpd')::numeric / (v_ikarama->>'baseCapacity')::numeric, (v_const->'SCALING_EXPONENT'->>'STICK_BUILT')::numeric));
  v_s_ikarama_gross_value_per_bbl := (select sum(y.value::numeric * (v_ikarama->'prices'->>y.key)::numeric) from jsonb_each_text((v_const->'CONFIGURATIONS'->(v_ikarama->>'configurationId'))) y where y.key <> 'loss' and (v_ikarama->'prices') ? y.key);
  v_s_ikarama_annual_throughput_bbl := ((v_ikarama->>'capacityBpd')::numeric * (v_ikarama->>'onstreamDays')::numeric * (select (s->>'utilisation')::numeric from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s where s->>'id' = v_ikarama->>'scenarioId'));
  v_s_ikarama_gross_margin_per_bbl := v_s_ikarama_gross_value_per_bbl
    - ((v_ikarama->>'crudeCostPerBbl')::numeric + (select (s->>'crudePremium')::numeric from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s where s->>'id' = v_ikarama->>'scenarioId')) - (v_ikarama->>'variableOpexPerBbl')::numeric;
  v_s_ikarama_first_year_revenue_usd := v_s_ikarama_annual_throughput_bbl * v_s_ikarama_gross_value_per_bbl;

  -- PROFESSIONAL, AMASSOMA. The LP is not re-solved here. The ORACLE's plan is
  -- first proved FEASIBLE on the records (every crude within its availability,
  -- every unit within its capacity, every product within its demand, nothing
  -- negative, every stream balance closing with nothing drawn that was not
  -- made, and the crude unit carrying every barrel of crude), then crude run,
  -- utilisation, margin and margin per barrel are read off it as arithmetic.
  select count(*) into v_n from (
    select 1 from jsonb_array_elements(v_amassoma->'crudes') with ordinality c(c, i)
      join jsonb_array_elements_text(v_oplan_a->'crudeRuns') with ordinality x(x, i) using (i)
     where x.x::numeric < 0 or x.x::numeric > (c.c->>'available')::numeric
    union all
    select 1 from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
      join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
     where x.x::numeric < 0 or x.x::numeric > (u.u->>'capacity')::numeric
    union all
    select 1 from jsonb_array_elements(v_amassoma->'products') with ordinality p(p, i)
      join jsonb_array_elements_text(v_oplan_a->'productMakes') with ordinality x(x, i) using (i)
     where x.x::numeric < (p.p->>'minDemand')::numeric or x.x::numeric > (p.p->>'maxDemand')::numeric
    union all
    select 1 from jsonb_array_elements_text(v_amassoma->'streams') s(s)
     where (select coalesce(sum(x.x::numeric * coalesce((c.c->'yields'->>s.s)::numeric, 0)), 0)
              from jsonb_array_elements(v_amassoma->'crudes') with ordinality c(c, i)
              join jsonb_array_elements_text(v_oplan_a->'crudeRuns') with ordinality x(x, i) using (i))
         + (select coalesce(sum(x.x::numeric * (coalesce((u.u->'yields'->>s.s)::numeric, 0)
                                             - case when u.u->>'feed' = s.s then 1 else 0 end)), 0)
              from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
              join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i))
         - (select coalesce(sum(x.x::numeric * coalesce((p.p->'recipe'->>s.s)::numeric, 0)), 0)
              from jsonb_array_elements(v_amassoma->'products') with ordinality p(p, i)
              join jsonb_array_elements_text(v_oplan_a->'productMakes') with ordinality x(x, i) using (i))
         < -0.000001) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: the oracle AMASSOMA plan breaks % bound(s) or stream balance(s) on the records [graded field: intermediate/amassoma_crude_run_bbl, intermediate/amassoma_plan_margin_usd]', v_n;
  end if;
  select sum(x.x::numeric) into v_s_amassoma_crude_run_bbl
    from jsonb_array_elements_text(v_oplan_a->'crudeRuns') x(x);
  select x.x::numeric / (u.u->>'capacity')::numeric * 100 into v_s_amassoma_cdu_utilisation_pct
    from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
    join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
   where coalesce(u.u->>'feed', '') = '';
  select x.x::numeric into v_wrong
    from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
    join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
   where coalesce(u.u->>'feed', '') = '';
  if v_wrong is null or abs(v_wrong - v_s_amassoma_crude_run_bbl) > 0.000001 then
    raise exception 'refinery go-live refused: the oracle plan runs % barrels through the crude unit and % of crude [graded field: intermediate/amassoma_crude_run_bbl]', v_wrong, v_s_amassoma_crude_run_bbl;
  end if;
  select sum(case t when 'delivery' then v else -v end) into v_s_amassoma_plan_margin_usd
    from (select c.c->>'id' m, 'receipt' t, x.x::numeric q, x.x::numeric * (c.c->>'cost')::numeric v
        from jsonb_array_elements(v_amassoma->'crudes') with ordinality c(c, i)
        join jsonb_array_elements_text(v_oplan_a->'crudeRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select u.u->>'id', 'unit_run', x.x::numeric, x.x::numeric * (u.u->>'opex')::numeric
        from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
        join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select p.p->>'id', 'delivery', x.x::numeric, x.x::numeric * (p.p->>'price')::numeric
        from jsonb_array_elements(v_amassoma->'products') with ordinality p(p, i)
        join jsonb_array_elements_text(v_oplan_a->'productMakes') with ordinality x(x, i) using (i)
       where x.x::numeric > 0) l;
  if abs(v_s_amassoma_plan_margin_usd - (v_oplan_a->>'margin')::numeric) > 0.0005 then
    raise exception 'refinery go-live refused: the oracle AMASSOMA plan is worth % on the records and the oracle says % [graded field: intermediate/amassoma_plan_margin_usd]', v_s_amassoma_plan_margin_usd, v_oplan_a->>'margin';
  end if;
  v_s_amassoma_gross_margin_per_bbl := v_s_amassoma_plan_margin_usd / v_s_amassoma_crude_run_bbl;
  -- The two stream values are an LP's shadow prices: their second route is the
  -- oracle's exact run (block 3), never an SQL re-solve, so this block does not
  -- check them.

  -- EXPERT, KOLOAMA, the month. The plan ledger is the ORACLE's plan: each
  -- crude received at its cost, each unit run at its operating cost, each
  -- product lifted at its price (a delivery's value is what it sold for). A
  -- line is a material and type present in both ledgers (the unplanned sale is
  -- no line). Volume variance = (actual - plan quantity) x plan unit value;
  -- price variance = (actual - plan unit value) x actual quantity; the total
  -- on margin signs each line by its direction (a delivery as it stands, a
  -- cost reversed); the cost total adds the cost lines as recorded.
  with plan as (select c.c->>'id' m, 'receipt' t, x.x::numeric q, x.x::numeric * (c.c->>'cost')::numeric v
        from jsonb_array_elements(v_koloama->'crudes') with ordinality c(c, i)
        join jsonb_array_elements_text(v_oplan_k->'crudeRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select u.u->>'id', 'unit_run', x.x::numeric, x.x::numeric * (u.u->>'opex')::numeric
        from jsonb_array_elements(v_koloama->'units') with ordinality u(u, i)
        join jsonb_array_elements_text(v_oplan_k->'unitRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select p.p->>'id', 'delivery', x.x::numeric, x.x::numeric * (p.p->>'price')::numeric
        from jsonb_array_elements(v_koloama->'products') with ordinality p(p, i)
        join jsonb_array_elements_text(v_oplan_k->'productMakes') with ordinality x(x, i) using (i)
       where x.x::numeric > 0),
       act as (select a->>'materialId' m, a->>'type' t, (a->>'quantity')::numeric q, (a->>'cost')::numeric v
                 from jsonb_array_elements(v_koloama->'actuals') a),
       lines as (select p.m, p.t, p.q pq, p.v pv, a.q aq, a.v av,
                        (a.q - p.q) * (p.v / p.q) vol, (a.v / a.q - p.v / p.q) * a.q price, a.v - p.v total,
                        case when p.t = 'delivery' then 1 else -1 end sgn
                   from plan p join act a using (m, t))
  select (select price from lines where m = 'usan' and t = 'receipt'),
         (select vol from lines where m = 'diesel' and t = 'delivery'),
         (select sum(sgn * total) from lines),
         (select sum(total) from lines where sgn = -1)
    into v_s_koloama_usan_price_variance_usd, v_s_koloama_diesel_volume_variance_usd,
         v_s_koloama_margin_variance_usd, v_s_koloama_cost_variance_usd;

  -- EXPERT, KOLOAMA, the expansion's tax. Its accounts in millions, year by
  -- year: construction years spend the modular capital in equal parts and sell
  -- nothing; each operating year sells its barrels at the slate and pays the
  -- crude (with the scenario's premium), the fixed and the variable cost.
  -- Capital is expensed in the year it is spent. A loss is pooled and set
  -- against later income before the rate applies (the refinery's loss carry
  -- forward); no royalty.
  v_build := (v_koloama->'expansion'->>'constructionYears')::int;
  v_life := (v_koloama->'expansion'->>'projectLife')::int;
  v_bbl := (v_koloama->'expansion'->>'capacityBpd')::numeric * (v_koloama->'expansion'->>'onstreamDays')::numeric
           * (select (s->>'utilisation')::numeric from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s where s->>'id' = (v_koloama->'expansion')->>'scenarioId');
  v_val := (select sum(y.value::numeric * ((v_koloama->'expansion')->'prices'->>y.key)::numeric) from jsonb_each_text((v_const->'CONFIGURATIONS'->((v_koloama->'expansion')->>'configurationId'))) y where y.key <> 'loss' and ((v_koloama->'expansion')->'prices') ? y.key);
  v_capex := (((v_koloama->'expansion')->>'baseCost')::numeric * power(((v_koloama->'expansion')->>'capacityBpd')::numeric / ((v_koloama->'expansion')->>'baseCapacity')::numeric, (v_koloama->'expansion'->>'modularExponent')::numeric));
  v_crude := (v_koloama->'expansion'->>'crudeCostPerBbl')::numeric + (select (s->>'crudePremium')::numeric from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s where s->>'id' = (v_koloama->'expansion')->>'scenarioId');
  v_pool := 0; v_s_koloama_lifetime_tax_mm := 0; v_s_koloama_first_tax_mm := null;
  for v_y in 0 .. v_build + v_life - 1 loop
    if v_y < v_build then
      v_inc := -(v_capex / v_build) / 1e6;
    else
      v_inc := (v_bbl * v_val - v_bbl * v_crude - (v_koloama->'expansion'->>'fixedOpexPerYear')::numeric
                - v_bbl * (v_koloama->'expansion'->>'variableOpexPerBbl')::numeric) / 1e6;
    end if;
    v_inc := v_inc - v_pool;
    v_pool := greatest(-v_inc, 0);
    v_tax := greatest(v_inc, 0) * (v_koloama->'expansion'->>'taxRate')::numeric / 100.0;
    if v_tax > 0 and v_s_koloama_first_tax_mm is null then
      v_s_koloama_first_tax_mm := v_tax;
    end if;
    v_s_koloama_lifetime_tax_mm := v_s_koloama_lifetime_tax_mm + v_tax;
  end loop;

  if v_s_ikarama_modular_capex_usd is null or abs(v_s_ikarama_modular_capex_usd - v_g_ikarama_modular_capex_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_modular_capex_usd]', v_s_ikarama_modular_capex_usd, v_g_ikarama_modular_capex_usd;
  end if;
  if v_s_ikarama_stick_built_capex_usd is null or abs(v_s_ikarama_stick_built_capex_usd - v_g_ikarama_stick_built_capex_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_stick_built_capex_usd]', v_s_ikarama_stick_built_capex_usd, v_g_ikarama_stick_built_capex_usd;
  end if;
  if v_s_ikarama_gross_value_per_bbl is null or abs(v_s_ikarama_gross_value_per_bbl - v_g_ikarama_gross_value_per_bbl) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_gross_value_per_bbl]', v_s_ikarama_gross_value_per_bbl, v_g_ikarama_gross_value_per_bbl;
  end if;
  if v_s_ikarama_annual_throughput_bbl is null or abs(v_s_ikarama_annual_throughput_bbl - v_g_ikarama_annual_throughput_bbl) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_annual_throughput_bbl]', v_s_ikarama_annual_throughput_bbl, v_g_ikarama_annual_throughput_bbl;
  end if;
  if v_s_ikarama_gross_margin_per_bbl is null or abs(v_s_ikarama_gross_margin_per_bbl - v_g_ikarama_gross_margin_per_bbl) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_gross_margin_per_bbl]', v_s_ikarama_gross_margin_per_bbl, v_g_ikarama_gross_margin_per_bbl;
  end if;
  if v_s_ikarama_first_year_revenue_usd is null or abs(v_s_ikarama_first_year_revenue_usd - v_g_ikarama_first_year_revenue_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: beginner/ikarama_first_year_revenue_usd]', v_s_ikarama_first_year_revenue_usd, v_g_ikarama_first_year_revenue_usd;
  end if;
  if v_s_amassoma_crude_run_bbl is null or abs(v_s_amassoma_crude_run_bbl - v_g_amassoma_crude_run_bbl) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/amassoma_crude_run_bbl]', v_s_amassoma_crude_run_bbl, v_g_amassoma_crude_run_bbl;
  end if;
  if v_s_amassoma_cdu_utilisation_pct is null or abs(v_s_amassoma_cdu_utilisation_pct - v_g_amassoma_cdu_utilisation_pct) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/amassoma_cdu_utilisation_pct]', v_s_amassoma_cdu_utilisation_pct, v_g_amassoma_cdu_utilisation_pct;
  end if;
  if v_s_amassoma_plan_margin_usd is null or abs(v_s_amassoma_plan_margin_usd - v_g_amassoma_plan_margin_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/amassoma_plan_margin_usd]', v_s_amassoma_plan_margin_usd, v_g_amassoma_plan_margin_usd;
  end if;
  if v_s_amassoma_gross_margin_per_bbl is null or abs(v_s_amassoma_gross_margin_per_bbl - v_g_amassoma_gross_margin_per_bbl) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: intermediate/amassoma_gross_margin_per_bbl]', v_s_amassoma_gross_margin_per_bbl, v_g_amassoma_gross_margin_per_bbl;
  end if;
  if v_s_koloama_usan_price_variance_usd is null or abs(v_s_koloama_usan_price_variance_usd - v_g_koloama_usan_price_variance_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_usan_price_variance_usd]', v_s_koloama_usan_price_variance_usd, v_g_koloama_usan_price_variance_usd;
  end if;
  if v_s_koloama_diesel_volume_variance_usd is null or abs(v_s_koloama_diesel_volume_variance_usd - v_g_koloama_diesel_volume_variance_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_diesel_volume_variance_usd]', v_s_koloama_diesel_volume_variance_usd, v_g_koloama_diesel_volume_variance_usd;
  end if;
  if v_s_koloama_margin_variance_usd is null or abs(v_s_koloama_margin_variance_usd - v_g_koloama_margin_variance_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_margin_variance_usd]', v_s_koloama_margin_variance_usd, v_g_koloama_margin_variance_usd;
  end if;
  if v_s_koloama_cost_variance_usd is null or abs(v_s_koloama_cost_variance_usd - v_g_koloama_cost_variance_usd) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_cost_variance_usd]', v_s_koloama_cost_variance_usd, v_g_koloama_cost_variance_usd;
  end if;
  if v_s_koloama_first_tax_mm is null or abs(v_s_koloama_first_tax_mm - v_g_koloama_first_tax_mm) > 0.00005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_first_tax_mm]', v_s_koloama_first_tax_mm, v_g_koloama_first_tax_mm;
  end if;
  if v_s_koloama_lifetime_tax_mm is null or abs(v_s_koloama_lifetime_tax_mm - v_g_koloama_lifetime_tax_mm) > 0.00005 / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded % [graded field: advanced/koloama_lifetime_tax_mm]', v_s_koloama_lifetime_tax_mm, v_g_koloama_lifetime_tax_mm;
  end if;

  -- ------------------------------------------------ 3. the oracle's exact run
  -- oracle_check.py's values, written into gen_golive.py and re-run there
  -- before this file was written. The two AMASSOMA stream values have no
  -- other second route: an LP optimum is not re-solved in SQL.
  if abs(v_g_ikarama_modular_capex_usd - 104137974.39924105) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 104137974.39924105, against the seeded % [graded field: beginner/ikarama_modular_capex_usd]', v_g_ikarama_modular_capex_usd;
  end if;
  if abs(v_g_ikarama_stick_built_capex_usd - 117607902.25246735) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 117607902.25246735, against the seeded % [graded field: beginner/ikarama_stick_built_capex_usd]', v_g_ikarama_stick_built_capex_usd;
  end if;
  if abs(v_g_ikarama_gross_value_per_bbl - 92.42) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 92.42, against the seeded % [graded field: beginner/ikarama_gross_value_per_bbl]', v_g_ikarama_gross_value_per_bbl;
  end if;
  if abs(v_g_ikarama_annual_throughput_bbl - 2010000) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 2010000, against the seeded % [graded field: beginner/ikarama_annual_throughput_bbl]', v_g_ikarama_annual_throughput_bbl;
  end if;
  if abs(v_g_ikarama_gross_margin_per_bbl - 14.32) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 14.32, against the seeded % [graded field: beginner/ikarama_gross_margin_per_bbl]', v_g_ikarama_gross_margin_per_bbl;
  end if;
  if abs(v_g_ikarama_first_year_revenue_usd - 185764200) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 185764200, against the seeded % [graded field: beginner/ikarama_first_year_revenue_usd]', v_g_ikarama_first_year_revenue_usd;
  end if;
  if abs(v_g_amassoma_crude_run_bbl - 1880000) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 1880000, against the seeded % [graded field: intermediate/amassoma_crude_run_bbl]', v_g_amassoma_crude_run_bbl;
  end if;
  if abs(v_g_amassoma_cdu_utilisation_pct - 81.73913043478261) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 81.73913043478261, against the seeded % [graded field: intermediate/amassoma_cdu_utilisation_pct]', v_g_amassoma_cdu_utilisation_pct;
  end if;
  if abs(v_g_amassoma_plan_margin_usd - 8170744) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 8170744, against the seeded % [graded field: intermediate/amassoma_plan_margin_usd]', v_g_amassoma_plan_margin_usd;
  end if;
  if abs(v_g_amassoma_gross_margin_per_bbl - 4.346140425531915) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 4.346140425531915, against the seeded % [graded field: intermediate/amassoma_gross_margin_per_bbl]', v_g_amassoma_gross_margin_per_bbl;
  end if;
  if abs(v_g_amassoma_naphtha_value_per_bbl - 91.32) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 91.32, against the seeded % [graded field: intermediate/amassoma_naphtha_value_per_bbl]', v_g_amassoma_naphtha_value_per_bbl;
  end if;
  if abs(v_g_amassoma_gasoil_value_per_bbl - 88.06733333333334) > 0.005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 88.06733333333334, against the seeded % [graded field: intermediate/amassoma_gasoil_value_per_bbl]', v_g_amassoma_gasoil_value_per_bbl;
  end if;
  if abs(v_g_koloama_usan_price_variance_usd - 654500.0000000027) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 654500.0000000027, against the seeded % [graded field: advanced/koloama_usan_price_variance_usd]', v_g_koloama_usan_price_variance_usd;
  end if;
  if abs(v_g_koloama_diesel_volume_variance_usd - 661826.6666666646) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 661826.6666666646, against the seeded % [graded field: advanced/koloama_diesel_volume_variance_usd]', v_g_koloama_diesel_volume_variance_usd;
  end if;
  if abs(v_g_koloama_margin_variance_usd - -2738869.4444444505) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives -2738869.4444444505, against the seeded % [graded field: advanced/koloama_margin_variance_usd]', v_g_koloama_margin_variance_usd;
  end if;
  if abs(v_g_koloama_cost_variance_usd - 2184380.000000003) > 0.5 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 2184380.000000003, against the seeded % [graded field: advanced/koloama_cost_variance_usd]', v_g_koloama_cost_variance_usd;
  end if;
  if abs(v_g_koloama_first_tax_mm - 0.9071033583782673) > 0.00005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 0.9071033583782673, against the seeded % [graded field: advanced/koloama_first_tax_mm]', v_g_koloama_first_tax_mm;
  end if;
  if abs(v_g_koloama_lifetime_tax_mm - 46.71901195837832) > 0.00005 / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives 46.71901195837832, against the seeded % [graded field: advanced/koloama_lifetime_tax_mm]', v_g_koloama_lifetime_tax_mm;
  end if;

  -- ------------------------------------------------- 4. the traps bite
  -- For each field the closest miss among discriminate.mjs's wrong routes,
  -- run through the engine, must lie OUTSIDE the tolerance, or the field
  -- does not discriminate the trap it is for.
  v_wrong := 100000000;
  if abs(v_wrong - v_g_ikarama_modular_capex_usd) <= 0.5 then
    raise exception 'refinery go-live refused: cost in proportion to capacity gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_modular_capex_usd]', v_wrong;
  end if;
  v_wrong := 104137974.39924105;
  if abs(v_wrong - v_g_ikarama_stick_built_capex_usd) <= 0.5 then
    raise exception 'refinery go-live refused: the modular exponent gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_stick_built_capex_usd]', v_wrong;
  end if;
  v_wrong := 93.54400000000001;
  if abs(v_wrong - v_g_ikarama_gross_value_per_bbl) <= 0.005 then
    raise exception 'refinery go-live refused: the loss valued as fuel oil gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_gross_value_per_bbl]', v_wrong;
  end if;
  v_wrong := 2190000;
  if abs(v_wrong - v_g_ikarama_annual_throughput_bbl) <= 0.5 then
    raise exception 'refinery go-live refused: a 365 day year gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_annual_throughput_bbl]', v_wrong;
  end if;
  v_wrong := 17.32;
  if abs(v_wrong - v_g_ikarama_gross_margin_per_bbl) <= 0.005 then
    raise exception 'refinery go-live refused: the supply premium left out gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_gross_margin_per_bbl]', v_wrong;
  end if;
  v_wrong := 202399800;
  if abs(v_wrong - v_g_ikarama_first_year_revenue_usd) <= 0.5 then
    raise exception 'refinery go-live refused: a 365 day year gives %, so the field does not discriminate the trap [graded field: beginner/ikarama_first_year_revenue_usd]', v_wrong;
  end if;
  v_wrong := 1935483.8709677414;
  if abs(v_wrong - v_g_amassoma_crude_run_bbl) <= 0.5 then
    raise exception 'refinery go-live refused: the typed zero read as no limit gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_crude_run_bbl]', v_wrong;
  end if;
  v_wrong := 84.15147265077137;
  if abs(v_wrong - v_g_amassoma_cdu_utilisation_pct) <= 0.005 then
    raise exception 'refinery go-live refused: the typed zero read as no limit gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_cdu_utilisation_pct]', v_wrong;
  end if;
  v_wrong := 10708743.99999991;
  if abs(v_wrong - v_g_amassoma_plan_margin_usd) <= 0.5 then
    raise exception 'refinery go-live refused: the crude unit cost not charged gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_plan_margin_usd]', v_wrong;
  end if;
  v_wrong := 4.626192395843664;
  if abs(v_wrong - v_g_amassoma_gross_margin_per_bbl) <= 0.005 then
    raise exception 'refinery go-live refused: per barrel of product sold gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_gross_margin_per_bbl]', v_wrong;
  end if;
  v_wrong := 85.7791666666667;
  if abs(v_wrong - v_g_amassoma_naphtha_value_per_bbl) <= 0.005 then
    raise exception 'refinery go-live refused: the crude unit left out of the plan gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_naphtha_value_per_bbl]', v_wrong;
  end if;
  v_wrong := 88;
  if abs(v_wrong - v_g_amassoma_gasoil_value_per_bbl) <= 0.005 then
    raise exception 'refinery go-live refused: the gasoil export price gives %, so the field does not discriminate the trap [graded field: intermediate/amassoma_gasoil_value_per_bbl]', v_wrong;
  end if;
  v_wrong := 630000.0000000026;
  if abs(v_wrong - v_g_koloama_usan_price_variance_usd) <= 0.5 then
    raise exception 'refinery go-live refused: priced on the plan quantity gives %, so the field does not discriminate the trap [graded field: advanced/koloama_usan_price_variance_usd]', v_wrong;
  end if;
  v_wrong := 665420.000000004;
  if abs(v_wrong - v_g_koloama_diesel_volume_variance_usd) <= 0.5 then
    raise exception 'refinery go-live refused: priced at the actual price gives %, so the field does not discriminate the trap [graded field: advanced/koloama_diesel_volume_variance_usd]', v_wrong;
  end if;
  v_wrong := -2377369.4444444478;
  if abs(v_wrong - v_g_koloama_margin_variance_usd) <= 0.5 then
    raise exception 'refinery go-live refused: the unmatched sale folded in gives %, so the field does not discriminate the trap [graded field: advanced/koloama_margin_variance_usd]', v_wrong;
  end if;
  v_wrong := 2139638.8888888843;
  if abs(v_wrong - v_g_koloama_cost_variance_usd) <= 0.5 then
    raise exception 'refinery go-live refused: the crude receipts only gives %, so the field does not discriminate the trap [graded field: advanced/koloama_cost_variance_usd]', v_wrong;
  end if;
  v_wrong := 0;
  if abs(v_wrong - v_g_koloama_first_tax_mm) <= 0.00005 then
    raise exception 'refinery go-live refused: the first operating year tax gives %, so the field does not discriminate the trap [graded field: advanced/koloama_first_tax_mm]', v_wrong;
  end if;
  v_wrong := 57.718437429189194;
  if abs(v_wrong - v_g_koloama_lifetime_tax_mm) <= 0.00005 then
    raise exception 'refinery go-live refused: only the latest year loss carried gives %, so the field does not discriminate the trap [graded field: advanced/koloama_lifetime_tax_mm]', v_wrong;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'refinery';
  if not exists (select 1 from public.academy_apps where slug = 'refinery' and status = 'available') then
    raise exception 'refinery go-live refused: refinery did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'refinery go-live: refinery available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
