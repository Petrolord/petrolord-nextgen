-- ============================================================================
-- crude GO-LIVE (HELD): Crude Assay & Blending flips to 'available', the first
-- course of the Commercial & Trading module, at path_order 48.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/crude.
--      The 78 lessons, the teaching lab and its three explorer panels (assay,
--      valuation and recipe) ship in the ZIP and NOT in this database, so a
--      flip before the upload puts a live catalogue tile in front of a route
--      that does not exist;
--   2. the Suite production upload carrying Suite main 1a71d9c90, the first
--      Suite main that carries everything this course teaches on the live
--      Crude Assay & Blending Studio and Product Blending Optimizer pages:
--      Suite #532 (3e5506561, fix/md1-0-crude-blend-app: the MD1-0 page
--      repairs, a blank box sent as absent, the stability band, the netback's
--      named gaps, the optimizer's price per unit and binding rows) and the
--      engines at e4d3b10 (MD1-1: a cut with no yield named, a property a
--      stream lacks left unformed, the partial-SARA message) and 13f0936, which
--      reached Suite main only inside #540. Suite production was e36846604
--      when this ladder was cut, which carries none of them.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (crude_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE, over the capstone records the prompts were rendered
--      from. The go-live first proves each shipped prompt is the rendered one
--      byte for byte. Route per field:
--        SQL closed form
--                         idama_blend_api, idama_blend_sulfur_wtpct,
--                         idama_blend_vanadium_ppm,
--                         idama_abiteye_mass_share_pct, idama_blend_cii,
--                         idama_opuama_kerosene_yield_pct,
--                         ogbele_blend_t50_f,
--                         ogbele_blend_kerosene_yield_pct,
--                         ogbele_blend_diesel_yield_pct,
--                         ogbele_gross_value_per_bbl,
--                         ogbele_loss_value_per_bbl, ogbele_netback_per_bbl
--                         (barrels and barrels x SG for the cargo; each
--                         crude's own yield blended on volume; T50 off the
--                         blended curve on the union of measured temperatures;
--                         the netback walked cut by cut);
--        the ORACLE's exact rational solution
--                         onne_total_cost_usd, onne_fcc_volume_bbl,
--                         onne_butane_volume_bbl,
--                         onne_sulfur_relief_usd_per_ppm,
--                         onne_rvp_relief_usd_per_psi,
--                         onne_ron_relief_usd_per_octane
--                         (an LP optimum is not re-solved in SQL: exact vertex
--                         enumeration, and relief by exact re-solve with the
--                         limit moved 1e-7 either way; each seeded relief must
--                         lie between the two one-sided quotients, and the two
--                         must agree within twice the tolerance);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_crudeassay.py, oracle_productblending.py),
--      written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NOTHING HELD IS GRADED. No graded key, label or unit names viscosity,
-- Refutas or Watson (FINDINGS C12 and C13, taught as limits), and no graded
-- value is within its tolerance of the engine's held figures on the capstone
-- records. The Expert prompt states the alkylate tank typed as 0 bbl.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (four decimals, graded at 5e-5),
-- with a label and a unit, and all of it is asserted here, on the rows as
-- seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_worst numeric := 0; v_worst_key text := '(none)';
  v_e jsonb; v_y numeric; v_vol numeric; v_mass numeric; v_share_total numeric;
  v_gross numeric; v_loss numeric;
  v_g_idama_blend_api numeric; v_s_idama_blend_api numeric;
  v_g_idama_blend_sulfur_wtpct numeric; v_s_idama_blend_sulfur_wtpct numeric;
  v_g_idama_blend_vanadium_ppm numeric; v_s_idama_blend_vanadium_ppm numeric;
  v_g_idama_abiteye_mass_share_pct numeric; v_s_idama_abiteye_mass_share_pct numeric;
  v_g_idama_blend_cii numeric; v_s_idama_blend_cii numeric;
  v_g_idama_opuama_kerosene_yield_pct numeric; v_s_idama_opuama_kerosene_yield_pct numeric;
  v_g_ogbele_blend_t50_f numeric; v_s_ogbele_blend_t50_f numeric;
  v_g_ogbele_blend_kerosene_yield_pct numeric; v_s_ogbele_blend_kerosene_yield_pct numeric;
  v_g_ogbele_blend_diesel_yield_pct numeric; v_s_ogbele_blend_diesel_yield_pct numeric;
  v_g_ogbele_gross_value_per_bbl numeric; v_s_ogbele_gross_value_per_bbl numeric;
  v_g_ogbele_loss_value_per_bbl numeric; v_s_ogbele_loss_value_per_bbl numeric;
  v_g_ogbele_netback_per_bbl numeric; v_s_ogbele_netback_per_bbl numeric;
  v_g_onne_total_cost_usd numeric; v_s_onne_total_cost_usd numeric;
  v_g_onne_fcc_volume_bbl numeric; v_s_onne_fcc_volume_bbl numeric;
  v_g_onne_butane_volume_bbl numeric; v_s_onne_butane_volume_bbl numeric;
  v_g_onne_sulfur_relief_usd_per_ppm numeric; v_s_onne_sulfur_relief_usd_per_ppm numeric;
  v_g_onne_rvp_relief_usd_per_psi numeric; v_s_onne_rvp_relief_usd_per_psi numeric;
  v_g_onne_ron_relief_usd_per_octane numeric; v_s_onne_ron_relief_usd_per_octane numeric;
  v_idama_barrels jsonb := '{"idl":408000,"opm":263000,"abh":125000}'::jsonb;
  v_idama_crudes jsonb := '[{"id":"idl","name":"Idama Light","api":42.3,"sulfurWtPct":0.07,"tanMgKohG":0.18,"nitrogenWtPct":0.04,"nickelPpm":1.9,"vanadiumPpm":1.1,"viscosityCSt":2.9,"sara":{"saturates":58.6,"aromatics":29.9,"resins":10.7,"asphaltenes":0.7},"curve":[{"volumePercent":0,"temperatureF":78},{"volumePercent":10,"temperatureF":175},{"volumePercent":30,"temperatureF":330},{"volumePercent":50,"temperatureF":485},{"volumePercent":70,"temperatureF":665},{"volumePercent":90,"temperatureF":960},{"volumePercent":100,"temperatureF":1290}]},{"id":"opm","name":"Opuama Medium","api":28.7,"sulfurWtPct":0.41,"tanMgKohG":0.55,"nitrogenWtPct":0.13,"nickelPpm":9.6,"vanadiumPpm":6.3,"viscosityCSt":13.8,"sara":{"saturates":41.3,"aromatics":38.4,"resins":17.1,"asphaltenes":3.4},"curve":[{"volumePercent":0,"temperatureF":92},{"volumePercent":10,"temperatureF":255},{"volumePercent":30,"temperatureF":465},{"volumePercent":50,"temperatureF":628},{"volumePercent":70,"temperatureF":835},{"volumePercent":90,"temperatureF":1175},{"volumePercent":100,"temperatureF":1455}]},{"id":"abh","name":"Abiteye Heavy","api":19.6,"sulfurWtPct":1.62,"tanMgKohG":1.15,"nitrogenWtPct":0.29,"nickelPpm":33.5,"vanadiumPpm":71.4,"viscosityCSt":385,"sara":{"saturates":30.7,"aromatics":36.9,"resins":22.6,"asphaltenes":9.8},"curve":[{"volumePercent":0,"temperatureF":115},{"volumePercent":10,"temperatureF":355},{"volumePercent":30,"temperatureF":585},{"volumePercent":50,"temperatureF":765},{"volumePercent":70,"temperatureF":975},{"volumePercent":90,"temperatureF":1295},{"volumePercent":100,"temperatureF":1545}]}]'::jsonb;
  v_idama_cut jsonb := '{"crude":"opm","cut":{"id":"kerosene","name":"Kerosene / Jet","fromF":350,"toF":500}}'::jsonb;
  v_ogbele_crudes jsonb := '[{"id":"ogl","name":"Ogbele Light","api":39.7,"sulfurWtPct":0.09,"curve":[{"volumePercent":0,"temperatureF":72},{"volumePercent":10,"temperatureF":182},{"volumePercent":30,"temperatureF":355},{"volumePercent":50,"temperatureF":515},{"volumePercent":70,"temperatureF":705},{"volumePercent":90,"temperatureF":1010},{"volumePercent":100,"temperatureF":1330}]},{"id":"omm","name":"Omoku Medium","api":26.2,"sulfurWtPct":0.44,"curve":[{"volumePercent":0,"temperatureF":98},{"volumePercent":10,"temperatureF":285},{"volumePercent":30,"temperatureF":505},{"volumePercent":50,"temperatureF":675},{"volumePercent":70,"temperatureF":885},{"volumePercent":90,"temperatureF":1225},{"volumePercent":100,"temperatureF":1490}]}]'::jsonb;
  v_ogbele_cuts jsonb := '[{"id":"lpg","name":"LPG / Light ends","fromF":null,"toF":90},{"id":"naphtha","name":"Naphtha","fromF":90,"toF":340},{"id":"kerosene","name":"Kerosene / DPK","fromF":340,"toF":470},{"id":"diesel","name":"Diesel / AGO","fromF":470,"toF":640},{"id":"residue","name":"Atmospheric residue","fromF":640,"toF":null}]'::jsonb;
  v_ogbele_shares jsonb := '{"ogl":62,"omm":38}'::jsonb;
  v_ogbele_valuation jsonb := '{"prices":{"lpg":46.5,"naphtha":71.2,"kerosene":94.6,"diesel":99.3,"residue":54.8},"processingCostPerBbl":7.35,"freightPerBbl":2.15,"lossPercent":1.1}'::jsonb;
  v_onne_pool jsonb := '[{"id":"ref","name":"Reformate","cost":95.3,"sg":0.812,"density":0.812,"ron":99.2,"mon":88.4,"sulfurPpm":3,"rvp":3.4,"minVolume":0,"maxVolume":4600},{"id":"fcc","name":"FCC gasoline","cost":86.2,"sg":0.742,"density":0.742,"ron":91.6,"mon":80.1,"sulfurPpm":140,"rvp":6.8,"minVolume":0,"maxVolume":5000},{"id":"lsr","name":"Light naphtha","cost":76.9,"sg":0.668,"density":0.668,"ron":68.5,"mon":66.2,"sulfurPpm":25,"rvp":11.8,"minVolume":0,"maxVolume":3000},{"id":"but","name":"Butane","cost":52.6,"sg":0.584,"density":0.584,"ron":93.5,"mon":89.6,"sulfurPpm":2,"rvp":51.5,"minVolume":0,"maxVolume":650},{"id":"alk","name":"Alkylate","cost":91.5,"sg":0.697,"density":0.697,"ron":95.8,"mon":93.2,"sulfurPpm":4,"rvp":4.6,"minVolume":0,"maxVolume":0}]'::jsonb;
  v_onne_specs jsonb := '[{"id":"ron","name":"RON","basis":"volume","min":91,"unit":""},{"id":"mon","name":"MON","basis":"volume","min":81,"unit":""},{"id":"sulfurPpm","name":"Sulfur","basis":"mass","max":50,"unit":"ppm"},{"id":"rvp","name":"RVP","basis":"index","max":9,"unit":"psi"},{"id":"density","name":"Density","basis":"volume","min":0.72,"max":0.775,"unit":"kg/l"}]'::jsonb;
  v_onne_target jsonb := '10000'::jsonb;
  v_tol_of jsonb := '{"idama_blend_api":5e-05,"idama_blend_sulfur_wtpct":5e-05,"idama_blend_vanadium_ppm":5e-05,"idama_abiteye_mass_share_pct":5e-05,"idama_blend_cii":5e-05,"idama_opuama_kerosene_yield_pct":5e-05,"ogbele_blend_t50_f":5e-05,"ogbele_blend_kerosene_yield_pct":5e-05,"ogbele_blend_diesel_yield_pct":5e-05,"ogbele_gross_value_per_bbl":5e-05,"ogbele_loss_value_per_bbl":5e-05,"ogbele_netback_per_bbl":5e-05,"onne_total_cost_usd":5e-05,"onne_fcc_volume_bbl":5e-05,"onne_butane_volume_bbl":5e-05,"onne_sulfur_relief_usd_per_ppm":5e-05,"onne_rvp_relief_usd_per_psi":5e-05,"onne_ron_relief_usd_per_octane":5e-05}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'crude' and active;
  if v_structures <> 3 then
    raise exception 'crude go-live refused: crude has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'crude';
  if v_questions <> 396 then
    raise exception 'crude go-live refused: crude has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'crude'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'crude' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'crude' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'crude'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'crude go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'crude' and s.active;
  if v_lessons <> 78 then
    raise exception 'crude go-live refused: crude carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'crude' and s.active;
  if v_modules <> 18 then
    raise exception 'crude go-live refused: crude carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'crude' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'crude';
  if v_capstones <> 3 then
    raise exception 'crude go-live refused: crude has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'crude';
  if v_graded <> 18 then
    raise exception 'crude go-live refused: crude has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'crude' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  -- ------------------------------------------------------------ catalogue
  if not exists (select 1 from public.academy_apps
                  where slug = 'crude' and module = 'commercial_trading'
                    and path_order = 48 and prereq_slug is null) then
    raise exception 'crude go-live refused: the crude catalogue row is not commercial_trading at path_order 48 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 48 and slug <> 'crude') then
    raise exception 'crude go-live refused: another course already holds path_order 48';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 49 and slug <> 'refinery') then
    raise exception 'crude go-live refused: path_order 49, the slot of the wave sibling refinery, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 50 and slug <> 'supply') then
    raise exception 'crude go-live refused: path_order 50, the slot of the wave sibling supply, is held by another course';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class (four decimals, 5e-5), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'crude go-live refused: % graded field(s) are not a number at their precision.json tolerance with a label and a unit: %', v_n, v_names;
  end if;

  select count(distinct f->>'key') into v_n
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude';
  if v_n <> 18 then
    raise exception 'crude go-live refused: the capstones grade % distinct keys, expected the 18 precision.json classifies', v_n;
  end if;

  -- ------------------------------------------------- nothing HELD is graded
  -- FINDINGS C12 (the Refutas viscosity index blended on mass) and C13 (Watson
  -- K on T50) are taught as limits. No graded key, label or unit may name them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude'
     and (f->>'key' ~* 'visc|refutas|watson|cst\b|blendindex' or f->>'label' ~* 'visc|refutas|watson|cst\b|blendindex' or f->>'unit' ~* 'visc|refutas|watson|cst\b|blendindex');
  if v_n <> 0 then
    raise exception 'crude go-live refused: % graded field(s) name a HELD quantity (Refutas viscosity C12, Watson K C13): %', v_n, v_names;
  end if;

  -- Nor may a graded value BE one of the engine's held figures on these
  -- records under another name: idama_blend_viscosity_cst_C12 7.936850956450447, idama_watson_k_at_t50_C13 11.823262940641923, ogbele_watson_k_at_t50_C13 11.870874139103334.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected') || ' is ' || h.k, ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         jsonb_each_text('{"idama_blend_viscosity_cst_C12":7.936850956450447,"idama_watson_k_at_t50_C13":11.823262940641923,"ogbele_watson_k_at_t50_C13":11.870874139103334}'::jsonb) h(k, v)
   where c.app_slug = 'crude'
     and abs(abs((f->>'expected')::numeric) - abs(h.v::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'crude go-live refused: % graded field(s) are a HELD figure: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads
  -- The Expert prompt states the alkylate tank typed as 0 bbl, once, and the
  -- record the second route reads types it so: a typed zero read as unlimited
  -- is a trap the course grades, and a prompt that hid the zero would grade a
  -- learner on a condition nobody stated.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'crude' and tier = 'advanced';
  if strpos(v_prompt, 'Alkylate: 91.5 dollars per bbl, SG 0.697 (density 0.697 kg/l), RON 95.8, MON 93.2, sulfur 4 ppm by mass, RVP 4.6 psi, tank typed as 0 bbl available.') = 0
     or length(v_prompt) - length(replace(v_prompt, 'typed as 0 bbl', '')) <> length('typed as 0 bbl') then
    raise exception 'crude go-live refused: the advanced prompt does not state, once, that the alkylate tank is typed as 0 bbl';
  end if;
  if (select count(*) from jsonb_array_elements(v_onne_pool) e
       where e->>'name' = 'Alkylate' and (e->>'maxVolume')::numeric = 0) <> 1 then
    raise exception 'crude go-live refused: the ONNE record does not type the alkylate tank as 0 bbl';
  end if;
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- crude_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'crude' and tier = 'beginner';
  if v_prompt is distinct from 'IDAMA EXPORT TERMINAL. Three field streams are commingled into one cargo. Every figure is invented and illustrative. Idama Light: 408000 bbl, API 42.3, sulfur 0.07 wt%, vanadium 1.1 ppm, nickel 1.9 ppm, TAN 0.18 mg KOH/g, viscosity 2.9 cSt, SARA saturates 58.6, aromatics 29.9, resins 10.7, asphaltenes 0.7 wt%, TBP curve 0 percent at 78 F, 10 percent at 175 F, 30 percent at 330 F, 50 percent at 485 F, 70 percent at 665 F, 90 percent at 960 F, 100 percent at 1290 F. Opuama Medium: 263000 bbl, API 28.7, sulfur 0.41 wt%, vanadium 6.3 ppm, nickel 9.6 ppm, TAN 0.55 mg KOH/g, viscosity 13.8 cSt, SARA saturates 41.3, aromatics 38.4, resins 17.1, asphaltenes 3.4 wt%, TBP curve 0 percent at 92 F, 10 percent at 255 F, 30 percent at 465 F, 50 percent at 628 F, 70 percent at 835 F, 90 percent at 1175 F, 100 percent at 1455 F. Abiteye Heavy: 125000 bbl, API 19.6, sulfur 1.62 wt%, vanadium 71.4 ppm, nickel 33.5 ppm, TAN 1.15 mg KOH/g, viscosity 385 cSt, SARA saturates 30.7, aromatics 36.9, resins 22.6, asphaltenes 9.8 wt%, TBP curve 0 percent at 115 F, 10 percent at 355 F, 30 percent at 585 F, 50 percent at 765 F, 70 percent at 975 F, 90 percent at 1295 F, 100 percent at 1545 F. Give six numbers, each to four decimals. (1) The API gravity of the cargo. (2) Its sulfur content in wt%. (3) Its vanadium content in ppm. (4) Abiteye Heavy''s share of the cargo by mass, in percent. (5) The cargo''s colloidal instability index. (6) The yield of the Kerosene / Jet cut, 350 F to 500 F, from Opuama Medium alone, in volume percent of that crude.' then
    raise exception 'crude go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'crude' and tier = 'intermediate';
  if v_prompt is distinct from 'OGBELE MODULAR REFINERY. The refinery is offered a blend of two crudes. Every figure is invented and illustrative. Ogbele Light: 62 percent of the blend by volume, API 39.7, TBP curve 0 percent at 72 F, 10 percent at 182 F, 30 percent at 355 F, 50 percent at 515 F, 70 percent at 705 F, 90 percent at 1010 F, 100 percent at 1330 F. Omoku Medium: 38 percent of the blend by volume, API 26.2, TBP curve 0 percent at 98 F, 10 percent at 285 F, 30 percent at 505 F, 50 percent at 675 F, 70 percent at 885 F, 90 percent at 1225 F, 100 percent at 1490 F. The refinery''s cut set and product prices: LPG / Light ends up to 90 F, priced at 46.5 dollars per bbl; Naphtha 90 F to 340 F, priced at 71.2 dollars per bbl; Kerosene / DPK 340 F to 470 F, priced at 94.6 dollars per bbl; Diesel / AGO 470 F to 640 F, priced at 99.3 dollars per bbl; Atmospheric residue 640 F to the end of the curve, priced at 54.8 dollars per bbl. Processing costs 7.35 dollars per bbl of crude, freight to the refinery 2.15 dollars per bbl, and losses are 1.1 percent, taken on the product side. Give six numbers, each to four decimals. (1) The temperature at which the blend''s own TBP curve reaches 50 percent, in F. (2) The blend''s Kerosene / DPK yield, in volume percent. (3) The blend''s Diesel / AGO yield, in volume percent. (4) The gross product value per bbl of blend. (5) The value lost to losses per bbl of blend. (6) The netback per bbl of blend.' then
    raise exception 'crude go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'crude' and tier = 'advanced';
  if v_prompt is distinct from 'ONNE BLENDING TERMINAL. A 10000 bbl PMS cargo is to be blended at least cost. Every figure is invented and illustrative. The components: Reformate: 95.3 dollars per bbl, SG 0.812 (density 0.812 kg/l), RON 99.2, MON 88.4, sulfur 3 ppm by mass, RVP 3.4 psi, up to 4600 bbl available. FCC gasoline: 86.2 dollars per bbl, SG 0.742 (density 0.742 kg/l), RON 91.6, MON 80.1, sulfur 140 ppm by mass, RVP 6.8 psi, up to 5000 bbl available. Light naphtha: 76.9 dollars per bbl, SG 0.668 (density 0.668 kg/l), RON 68.5, MON 66.2, sulfur 25 ppm by mass, RVP 11.8 psi, up to 3000 bbl available. Butane: 52.6 dollars per bbl, SG 0.584 (density 0.584 kg/l), RON 93.5, MON 89.6, sulfur 2 ppm by mass, RVP 51.5 psi, up to 650 bbl available. Alkylate: 91.5 dollars per bbl, SG 0.697 (density 0.697 kg/l), RON 95.8, MON 93.2, sulfur 4 ppm by mass, RVP 4.6 psi, tank typed as 0 bbl available. The buyer''s specification: RON at least 91 (blends on volume); MON at least 81 (blends on volume); Sulfur at most 50 ppm (blends on mass); RVP at most 9 psi (blends through the RVP index); Density between 0.72 and 0.775 kg/l (blends on volume). Give six numbers, each to four decimals. (1) The least total cost of the cargo, in dollars. (2) The barrels of FCC gasoline in the least-cost recipe. (3) The barrels of butane in it. (4) The value of relief on the sulfur limit at the least-cost recipe, as a shadow price: the cost saved per ppm the limit is relaxed, at the margin, in dollars per ppm. (5) The same for the RVP limit, in dollars per psi. (6) The same for the RON minimum, in dollars per octane number.' then
    raise exception 'crude go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_idama_blend_api
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_blend_api';
  select (f->>'expected')::numeric into v_g_idama_blend_sulfur_wtpct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_blend_sulfur_wtpct';
  select (f->>'expected')::numeric into v_g_idama_blend_vanadium_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_blend_vanadium_ppm';
  select (f->>'expected')::numeric into v_g_idama_abiteye_mass_share_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_abiteye_mass_share_pct';
  select (f->>'expected')::numeric into v_g_idama_blend_cii
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_blend_cii';
  select (f->>'expected')::numeric into v_g_idama_opuama_kerosene_yield_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'beginner' and f->>'key' = 'idama_opuama_kerosene_yield_pct';
  select (f->>'expected')::numeric into v_g_ogbele_blend_t50_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_blend_t50_f';
  select (f->>'expected')::numeric into v_g_ogbele_blend_kerosene_yield_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_blend_kerosene_yield_pct';
  select (f->>'expected')::numeric into v_g_ogbele_blend_diesel_yield_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_blend_diesel_yield_pct';
  select (f->>'expected')::numeric into v_g_ogbele_gross_value_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_gross_value_per_bbl';
  select (f->>'expected')::numeric into v_g_ogbele_loss_value_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_loss_value_per_bbl';
  select (f->>'expected')::numeric into v_g_ogbele_netback_per_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'intermediate' and f->>'key' = 'ogbele_netback_per_bbl';
  select (f->>'expected')::numeric into v_g_onne_total_cost_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_total_cost_usd';
  select (f->>'expected')::numeric into v_g_onne_fcc_volume_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_fcc_volume_bbl';
  select (f->>'expected')::numeric into v_g_onne_butane_volume_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_butane_volume_bbl';
  select (f->>'expected')::numeric into v_g_onne_sulfur_relief_usd_per_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_sulfur_relief_usd_per_ppm';
  select (f->>'expected')::numeric into v_g_onne_rvp_relief_usd_per_psi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_rvp_relief_usd_per_psi';
  select (f->>'expected')::numeric into v_g_onne_ron_relief_usd_per_octane
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude' and c.tier = 'advanced' and f->>'key' = 'onne_ron_relief_usd_per_octane';
  if v_g_idama_blend_api is null
     or v_g_idama_blend_sulfur_wtpct is null
     or v_g_idama_blend_vanadium_ppm is null
     or v_g_idama_abiteye_mass_share_pct is null
     or v_g_idama_blend_cii is null
     or v_g_idama_opuama_kerosene_yield_pct is null
     or v_g_ogbele_blend_t50_f is null
     or v_g_ogbele_blend_kerosene_yield_pct is null
     or v_g_ogbele_blend_diesel_yield_pct is null
     or v_g_ogbele_gross_value_per_bbl is null
     or v_g_ogbele_loss_value_per_bbl is null
     or v_g_ogbele_netback_per_bbl is null
     or v_g_onne_total_cost_usd is null
     or v_g_onne_fcc_volume_bbl is null
     or v_g_onne_butane_volume_bbl is null
     or v_g_onne_sulfur_relief_usd_per_ppm is null
     or v_g_onne_rvp_relief_usd_per_psi is null
     or v_g_onne_ron_relief_usd_per_octane is null then
    raise exception 'crude go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is within
  -- its tolerance of a number token in any prompt, dataset, title, label or
  -- unit, and no token with a decimal is a rounding of one. No token with a
  -- decimal is a rounding of any of the 64 engine-derived
  -- intermediates gate_promptleak.py lists. (A token with no decimal is a
  -- stated condition, and at most the integer part of a four-decimal answer
  -- graded at 5e-5, which hands over nothing a grader accepts.)
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg((x->>'label') || ' ' || (x->>'unit'), ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where c.app_slug = 'crude' and p.app_slug = 'crude'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or ((case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end) >= 1
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end))));
  if v_n <> 0 then
    raise exception 'crude go-live refused: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg((x->>'label') || ' ' || (x->>'unit'), ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         jsonb_each_text('{"IDAMA blend SG":0.8561977424098375,"IDAMA volume fraction Idama Light":0.5125628140703518,"IDAMA mass fraction Idama Light":0.48739344579748956,"IDAMA volume percent Idama Light":51.256281407035175,"IDAMA volume fraction Opuama Medium":0.33040201005025127,"IDAMA mass fraction Opuama Medium":0.3408493973730106,"IDAMA volume percent Opuama Medium":33.040201005025125,"IDAMA volume fraction Abiteye Heavy":0.157035175879397,"IDAMA mass fraction Abiteye Heavy":0.17175715682949974,"IDAMA volume percent Abiteye Heavy":15.7035175879397,"IDAMA blend sulfurWtPct":0.45211238819254823,"IDAMA blend tanMgKohG":0.47271871915262864,"IDAMA blend nitrogenWtPct":0.11361573497094589,"IDAMA blend nickelPpm":9.952066515584374,"IDAMA blend vanadiumPpm":14.946944991453488,"IDAMA blend viscosityCSt":7.936850956450447,"IDAMA blended saturates":47.91128074990387,"IDAMA blended aromatics":33.999519975477085,"IDAMA blended resins":14.925346309458314,"IDAMA blended asphaltenes":3.1832835000555764,"OGBELE blend SG":0.8534054442067336,"OGBELE blend API":34.306301050174994,"OGBELE blend curve at 98":1.4654545454545456,"OGBELE blend curve at 182":7.906951871657754,"OGBELE blend curve at 285":17.382658959537572,"OGBELE blend curve at 355":24.81818181818182,"OGBELE blend curve at 505":41.625,"OGBELE blend curve at 515":42.84705882352941,"OGBELE blend curve at 675":60.44210526315789,"OGBELE blend curve at 705":63.48571428571428,"OGBELE blend curve at 885":77.31803278688525,"OGBELE blend curve at 1010":85.19411764705882,"OGBELE blend curve at 1225":94.165625,"OGBELE blend curve at 1330":97.7056603773585,"OGBELE blend curve at 1490":100,"OGBELE blend yield LPG / Light ends":1.0145454545454546,"OGBELE blend yield Naphtha":22.210310036784026,"OGBELE blend yield Kerosene / DPK":14.478553599579609,"OGBELE blend yield Diesel / AGO":18.889779763580073,"OGBELE blend yield Atmospheric residue":43.40681114551084,"OGBELE value per bbl LPG / Light ends":0.4717636363636364,"OGBELE value per bbl Naphtha":15.813740746190227,"OGBELE value per bbl Kerosene / DPK":13.696711705202308,"OGBELE value per bbl Diesel / AGO":18.757551305235012,"OGBELE value per bbl Atmospheric residue":23.786932507739937,"ONNE volume Reformate":4544.0933492911045,"ONNE cost Reformate":433052.09618744225,"ONNE volume FCC gasoline":3228.160923653412,"ONNE cost FCC gasoline":278267.4716189241,"ONNE volume Light naphtha":1790.7130534407117,"ONNE cost Light naphtha":137705.83380959075,"ONNE volume Butane":437.0326736147707,"ONNE cost Butane":22987.91863213694,"ONNE achieved RON":91,"ONNE achieved MON":81.79768737556307,"ONNE achieved Sulfur":49.99999999999999,"ONNE achieved RVP":8.999999999999998,"ONNE achieved Density":0.7536522606064632,"ONNE rowPrice Total volume":87.2013320248094,"ONNE rowPrice RON minimum":0.403263083816783,"ONNE rowPrice Sulfur maximum":-0.03931649010183458,"ONNE rowPrice RVP maximum":-0.2999966430806375,"ONNE unit cost":87.20133202480942,"ONNE marginal barrel":87.2013320248094}'::jsonb) d(k, v)
   where p.app_slug = 'crude'
     and (case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end) >= 1
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end));
  if v_n <> 0 then
    raise exception 'crude go-live refused: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (191), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where p.app_slug = 'crude';
  if v_n <> 191 then
    raise exception 'crude go-live refused: the prompt sweep read % number tokens, and gen_course.py read 191 from the same prompts', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'crude') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'crude') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'crude go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (605 distinct values, read by
  -- the regex -?[0-9]+[.]?[0-9]*): a graded field that is a figure the digest
  -- prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'crude'
     and exists (select 1 from unnest(array[0, 0.0014, 0.002, 0.0037, 0.0049, 0.0052, 0.0055, 0.0063, 0.01, 0.0154, 0.0162, 0.0203, 0.0207, 0.0225, 0.0298, 0.03, 0.05, 0.0696, 0.07, 0.072, 0.0888, 0.0914, 0.098, 0.1, 0.1015, 0.1029, 0.11, 0.1123, 0.14, 0.143, 0.15, 0.151, 0.1559, 0.16, 0.1636, 0.1677, 0.1731, 0.1846, 0.1932, 0.2, 0.2001, 0.2104, 0.2162, 0.22, 0.2268, 0.2569, 0.259, 0.26, 0.2642, 0.2674, 0.2708, 0.2931, 0.3, 0.3063, 0.34, 0.3443, 0.35, 0.36, 0.3654, 0.386, 0.3915, 0.4, 0.4106, 0.4167, 0.4414, 0.4615, 0.4775, 0.48, 0.5, 0.5223, 0.58, 0.582, 0.584, 0.5939, 0.596, 0.6, 0.6026, 0.6138, 0.6167, 0.6192, 0.62, 0.6346, 0.65, 0.66, 0.662, 0.6634, 0.6671, 0.6702, 0.6951, 0.7, 0.7141, 0.7161, 0.7174, 0.72, 0.748, 0.75, 0.7536, 0.7547, 0.7603, 0.7668, 0.775, 0.795, 0.8, 0.805, 0.82, 0.8251, 0.8328, 0.8408, 0.845, 0.846, 0.85, 0.856, 0.8595, 0.8611, 0.866, 0.8686, 0.8727, 0.8762, 0.8783, 0.8795, 0.8804, 0.8922, 0.899, 0.9, 0.9163, 0.921, 0.934, 0.95, 0.9516, 0.991, 1, 1.0036, 1.005, 1.1, 1.1598, 1.25, 1.2681, 1.3, 1.3043, 1.4, 1.5, 1.5761, 1.7, 1.7614, 1.85, 1.9, 1.9718, 2, 2.0889, 2.1651, 2.4422, 2.7, 2.8571, 2.9207, 2.9518, 3, 3.0036, 3.2, 3.245, 3.2518, 3.3184, 3.4833, 3.4928, 3.5, 3.501, 3.5217, 3.8, 3.955, 4, 4.0673, 4.1448, 4.2799, 4.5, 4.5307, 4.6, 5, 5.0376, 5.1429, 5.7143, 6, 6.2, 6.455, 6.5056, 6.598, 6.7035, 6.8, 6.8074, 6.875, 6.9, 7, 7.3107, 7.4474, 7.4743, 7.5527, 8, 8.0714, 8.2748, 8.3458, 8.5, 8.7, 8.8324, 8.8462, 9, 9.2, 9.2484, 9.2496, 9.4791, 9.7834, 10, 10.2308, 10.4044, 10.9, 10.9576, 10.975, 11, 11.4498, 11.5886, 11.7452, 11.7917, 11.8135, 11.9, 12, 12.0043, 12.0447, 12.5, 12.8, 12.9, 13, 13.55, 13.6364, 13.7736, 13.9535, 14, 14.0097, 14.2202, 14.5, 14.534, 14.5833, 14.8897, 15, 15.01, 15.146, 15.2137, 15.5885, 16, 16.01, 16.0465, 16.1124, 16.2136, 16.286, 16.3586, 16.3636, 16.3881, 16.5914, 16.6342, 16.6604, 16.7449, 16.951, 16.9626, 17, 17.0344, 17.0528, 17.2, 17.2861, 17.4474, 17.8571, 18, 18.1944, 18.2484, 18.3333, 18.5704, 18.7143, 18.7403, 18.8084, 18.8816, 18.9972, 19, 19.2202, 19.3849, 19.4, 19.404, 19.5153, 19.7674, 19.8, 20, 20.1987, 20.2703, 20.4189, 20.5591, 21, 21.5, 21.75, 21.8467, 22, 22.1456, 22.51, 22.6185, 22.7807, 23, 23.1429, 23.5747, 24, 24.0861, 24.1607, 24.2512, 24.4225, 24.4477, 24.54, 24.7639, 24.99, 25, 25.259, 25.3953, 25.711, 25.7222, 25.9, 26, 26.694, 26.8621, 27, 27.1, 27.5, 27.5437, 27.7681, 28.1533, 29, 29.224, 29.3808, 29.61, 30, 30.6451, 31.4, 31.5, 32.2493, 32.8173, 32.985, 33.1219, 33.1962, 33.5, 33.6742, 33.8111, 34.1, 34.9706, 35, 35.01, 35.5556, 35.8824, 35.9, 36, 36.6357, 36.8, 37.2, 37.3684, 37.4, 37.5625, 37.9879, 38.015, 38.4, 38.7563, 39.0657, 40, 40.1548, 40.6036, 41, 41.3109, 42.6, 43.0526, 43.2685, 43.6471, 43.75, 44, 45, 45.375, 46, 46.5909, 48, 48.3393, 49, 49.7012, 50, 51, 52, 52.5974, 52.8, 53.1579, 54, 54.1, 54.6, 55, 55.0114, 55.3608, 56.6667, 56.9474, 57, 57.0828, 57.1667, 60, 62.6316, 62.6816, 63.6676, 64, 64.9473, 65, 65.0169, 65.5412, 65.9944, 66, 67.4412, 67.6471, 69.1466, 69.7334, 70, 71.2903, 72.5, 72.8571, 72.9512, 73.7403, 74, 74.2412, 74.9677, 75, 75.2968, 76.3376, 76.6165, 79.0323, 80, 80.6, 81, 84, 84.4928, 84.9, 85, 85.4, 85.4516, 85.5, 86, 86.1228, 86.4, 87, 87.3072, 87.3377, 87.5108, 87.6, 87.9, 88, 88.2, 89, 89.1, 90, 90.3, 91, 91.452, 92, 92.3, 92.9219, 93, 93.8, 94, 94.501, 95, 95.3125, 95.5556, 96, 98, 98.6, 99, 99.1202, 100, 101, 101.5, 107.2, 110, 112, 120, 122.8888, 124, 131.5, 140, 141.5, 142.0756, 142.3287, 181, 190, 205, 212.2121, 230, 232.9041, 240, 265, 266, 280, 300, 320, 324.3561, 330, 330.31, 339.5596, 339.934, 343.75, 350, 370, 380, 390, 400, 411.6294, 414.8506, 430, 438.1863, 459.67, 480, 500, 516.0028, 530, 537.5403, 548, 551.6796, 551.8026, 551.9256, 578.9052, 584, 586.0503, 587.3184, 590, 600, 610, 612, 614.2222, 617.1429, 624.0271, 650, 668, 690, 700, 720, 742, 760, 784.1881, 790, 796.5882, 848.8889, 860, 880, 920, 1000, 1030, 1060, 1133.0737, 1159.3909, 1200, 1220, 1230, 1320, 1350, 1380, 1470, 1480, 1500, 1505.9222, 1560, 1800, 2000, 2054.8893, 2670.0508, 3000, 3284.6899, 3500, 3531.1221, 3651.3942, 4000, 4448.9659, 4751.5037, 5000, 5070, 6000, 6037.3872, 7112, 7152, 7157, 8000, 8001, 11176.9355, 16804.7174, 21640, 35000, 53915.9391, 69165.3861, 86122.771, 108360, 161434.8562, 271010.1523, 299792.2634, 308103.9109, 350000, 594720.9475, 650000, 695050.1663, 695245.0644, 698149.8809, 698569.3341, 698701.5605, 698909.549, 699253.4861, 703453.0642, 710560.2149, 852453.4687]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'crude go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  -- The seeded value is the engine's return at full precision, exactly.
  if v_g_idama_blend_api <> 33.76556073569742 then
    raise exception 'crude go-live refused: the seeded value % is not the 33.76556073569742 the engine returned through crude_capstone.mjs [graded field: beginner/idama_blend_api]', v_g_idama_blend_api;
  end if;
  if v_g_idama_blend_sulfur_wtpct <> 0.45211238819254823 then
    raise exception 'crude go-live refused: the seeded value % is not the 0.45211238819254823 the engine returned through crude_capstone.mjs [graded field: beginner/idama_blend_sulfur_wtpct]', v_g_idama_blend_sulfur_wtpct;
  end if;
  if v_g_idama_blend_vanadium_ppm <> 14.946944991453488 then
    raise exception 'crude go-live refused: the seeded value % is not the 14.946944991453488 the engine returned through crude_capstone.mjs [graded field: beginner/idama_blend_vanadium_ppm]', v_g_idama_blend_vanadium_ppm;
  end if;
  if v_g_idama_abiteye_mass_share_pct <> 17.175715682949974 then
    raise exception 'crude go-live refused: the seeded value % is not the 17.175715682949974 the engine returned through crude_capstone.mjs [graded field: beginner/idama_abiteye_mass_share_pct]', v_g_idama_abiteye_mass_share_pct;
  end if;
  if v_g_idama_blend_cii <> 1.0443475502291177 then
    raise exception 'crude go-live refused: the seeded value % is not the 1.0443475502291177 the engine returned through crude_capstone.mjs [graded field: beginner/idama_blend_cii]', v_g_idama_blend_cii;
  end if;
  if v_g_idama_opuama_kerosene_yield_pct <> 15.246859479988313 then
    raise exception 'crude go-live refused: the seeded value % is not the 15.246859479988313 the engine returned through crude_capstone.mjs [graded field: beginner/idama_opuama_kerosene_yield_pct]', v_g_idama_opuama_kerosene_yield_pct;
  end if;
  if v_g_ogbele_blend_t50_f <> 580.0450450450451 then
    raise exception 'crude go-live refused: the seeded value % is not the 580.0450450450451 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_blend_t50_f]', v_g_ogbele_blend_t50_f;
  end if;
  if v_g_ogbele_blend_kerosene_yield_pct <> 14.478553599579609 then
    raise exception 'crude go-live refused: the seeded value % is not the 14.478553599579609 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_blend_kerosene_yield_pct]', v_g_ogbele_blend_kerosene_yield_pct;
  end if;
  if v_g_ogbele_blend_diesel_yield_pct <> 18.889779763580073 then
    raise exception 'crude go-live refused: the seeded value % is not the 18.889779763580073 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_blend_diesel_yield_pct]', v_g_ogbele_blend_diesel_yield_pct;
  end if;
  if v_g_ogbele_gross_value_per_bbl <> 72.52669990073112 then
    raise exception 'crude go-live refused: the seeded value % is not the 72.52669990073112 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_gross_value_per_bbl]', v_g_ogbele_gross_value_per_bbl;
  end if;
  if v_g_ogbele_loss_value_per_bbl <> 0.7977936989080376 then
    raise exception 'crude go-live refused: the seeded value % is not the 0.7977936989080376 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_loss_value_per_bbl]', v_g_ogbele_loss_value_per_bbl;
  end if;
  if v_g_ogbele_netback_per_bbl <> 62.22890620182309 then
    raise exception 'crude go-live refused: the seeded value % is not the 62.22890620182309 the engine returned through crude_capstone.mjs [graded field: intermediate/ogbele_netback_per_bbl]', v_g_ogbele_netback_per_bbl;
  end if;
  if v_g_onne_total_cost_usd <> 872013.320248094 then
    raise exception 'crude go-live refused: the seeded value % is not the 872013.320248094 the engine returned through crude_capstone.mjs [graded field: advanced/onne_total_cost_usd]', v_g_onne_total_cost_usd;
  end if;
  if v_g_onne_fcc_volume_bbl <> 3228.160923653412 then
    raise exception 'crude go-live refused: the seeded value % is not the 3228.160923653412 the engine returned through crude_capstone.mjs [graded field: advanced/onne_fcc_volume_bbl]', v_g_onne_fcc_volume_bbl;
  end if;
  if v_g_onne_butane_volume_bbl <> 437.0326736147707 then
    raise exception 'crude go-live refused: the seeded value % is not the 437.0326736147707 the engine returned through crude_capstone.mjs [graded field: advanced/onne_butane_volume_bbl]', v_g_onne_butane_volume_bbl;
  end if;
  if v_g_onne_sulfur_relief_usd_per_ppm <> 296.3096164435926 then
    raise exception 'crude go-live refused: the seeded value % is not the 296.3096164435926 the engine returned through crude_capstone.mjs [graded field: advanced/onne_sulfur_relief_usd_per_ppm]', v_g_onne_sulfur_relief_usd_per_ppm;
  end if;
  if v_g_onne_rvp_relief_usd_per_psi <> 6495.117849392539 then
    raise exception 'crude go-live refused: the seeded value % is not the 6495.117849392539 the engine returned through crude_capstone.mjs [graded field: advanced/onne_rvp_relief_usd_per_psi]', v_g_onne_rvp_relief_usd_per_psi;
  end if;
  if v_g_onne_ron_relief_usd_per_octane <> 4032.630838167829 then
    raise exception 'crude go-live refused: the seeded value % is not the 4032.630838167829 the engine returned through crude_capstone.mjs [graded field: advanced/onne_ron_relief_usd_per_octane]', v_g_onne_ron_relief_usd_per_octane;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IDAMA. Each stream is loaded in BARRELS and in barrels x SG, a
  -- quantity proportional to its mass; no fraction is formed. SG = 141.5 /
  -- (API + 131.5). The cargo's SG is its barrels x SG over its barrels and its
  -- API is 141.5 / SG - 131.5 (API is never averaged). Sulfur and vanadium are
  -- per-mass properties weighted by barrels x SG; Abiteye Heavy's share by mass
  -- is its barrels x SG over the cargo's, in percent; the CII is the
  -- mass-weighted (saturates + asphaltenes) over the mass-weighted (aromatics +
  -- resins), with no blended SARA formed.
  select sum(x.b), sum(x.b * x.sg),
         sum(x.b * x.sg * x.s) / sum(x.b * x.sg),
         sum(x.b * x.sg * x.vn) / sum(x.b * x.sg),
         100.0 * sum(case when x.id = 'abh' then x.b * x.sg else 0 end) / sum(x.b * x.sg),
         sum(x.b * x.sg * (x.sat + x.asph)) / sum(x.b * x.sg * (x.aro + x.res))
    into v_vol, v_mass, v_s_idama_blend_sulfur_wtpct, v_s_idama_blend_vanadium_ppm,
         v_s_idama_abiteye_mass_share_pct, v_s_idama_blend_cii
    from (select c->>'id' id, (v_idama_barrels->>(c->>'id'))::numeric b,
                 141.5 / ((c->>'api')::numeric + 131.5) sg,
                 (c->>'sulfurWtPct')::numeric s, (c->>'vanadiumPpm')::numeric vn,
                 (c#>>'{sara,saturates}')::numeric sat, (c#>>'{sara,aromatics}')::numeric aro,
                 (c#>>'{sara,resins}')::numeric res, (c#>>'{sara,asphaltenes}')::numeric asph
            from jsonb_array_elements(v_idama_crudes) c) x;
  v_s_idama_blend_api := 141.5 / (v_mass / v_vol) - 131.5;

  -- The Opuama Medium kerosene: the crude's own curve read at the cut's upper
  -- bound, less the reading at its lower bound, each by linear interpolation
  -- between the measured points either side.
  v_s_idama_opuama_kerosene_yield_pct :=
    (select case when ((v_idama_cut #>> '{cut,toF}')::numeric) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end) when ((v_idama_cut #>> '{cut,toF}')::numeric) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end) else (select case when _hi.t = _lo.t then _lo.v else _lo.v + (((v_idama_cut #>> '{cut,toF}')::numeric) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end from (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _y where _y.t <= ((v_idama_cut #>> '{cut,toF}')::numeric) order by _y.t desc limit 1) _lo, (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _y where _y.t >= ((v_idama_cut #>> '{cut,toF}')::numeric) order by _y.t asc limit 1) _hi) end from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _x)
    - (select case when ((v_idama_cut #>> '{cut,fromF}')::numeric) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end) when ((v_idama_cut #>> '{cut,fromF}')::numeric) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end) else (select case when _hi.t = _lo.t then _lo.v else _lo.v + (((v_idama_cut #>> '{cut,fromF}')::numeric) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end from (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _y where _y.t <= ((v_idama_cut #>> '{cut,fromF}')::numeric) order by _y.t desc limit 1) _lo, (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _y where _y.t >= ((v_idama_cut #>> '{cut,fromF}')::numeric) order by _y.t asc limit 1) _hi) end from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements((select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')) _p) _x);

  -- PROFESSIONAL, OGBELE. The shares are volume shares of their sum.
  select sum(value::numeric) into v_share_total from jsonb_each_text(v_ogbele_shares);

  -- T50 off the blended curve: at every temperature either crude measured, the
  -- blend has distilled the volume-weighted sum of the two readings (a
  -- temperature at which a crude's curve says nothing is left out); the first
  -- point at 50 percent, else the first segment that crosses it, read linearly.
  with tg as (
    select distinct (p->>'temperatureF')::numeric t
      from jsonb_array_elements(v_ogbele_crudes) cc0, jsonb_array_elements(cc0->'curve') p),
  bc as (
    select tg.t, (select case when bool_or(zz.r is null) then null else sum(zz.f * zz.r) end
                    from (select z.f, (select case when (tg.t) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end) when (tg.t) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end) else (select case when _hi.t = _lo.t then _lo.v else _lo.v + ((tg.t) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end from (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t <= (tg.t) order by _y.t desc limit 1) _lo, (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t >= (tg.t) order by _y.t asc limit 1) _hi) end from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _x) r from (select (v_ogbele_shares->>(cc->>'id'))::numeric / v_share_total f, cc->'curve' crv from jsonb_array_elements(v_ogbele_crudes) cc) z) zz) b
      from tg),
  seg as (
    select t, b, lead(t) over (order by t) t2, lead(b) over (order by t) b2 from bc where b is not null)
  select coalesce((select min(t) from seg where b = 50),
                  (select t + (50 - b) * (t2 - t) / (b2 - b) from seg where b < 50 and b2 > 50 order by t limit 1))
    into v_s_ogbele_blend_t50_f;

  -- Every cut's yield is EACH CRUDE'S OWN YIELD (its curve at the upper bound
  -- less at the lower, an open bound reading 0 or 100) blended on volume. The
  -- gross is the sum of yield / 100 x price over all five cuts; the losses are
  -- that gross times the loss percent, on the product side; the netback is the
  -- gross less the losses, processing and freight.
  v_gross := 0;
  for v_e in select e from jsonb_array_elements(v_ogbele_cuts) e loop
    select case when bool_or(zz.y is null) then null else sum(zz.f * zz.y) end into v_y
      from (select z.f, (case when v_e->>'toF' is null then 100::numeric else (select case when ((v_e->>'toF')::numeric) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end) when ((v_e->>'toF')::numeric) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end) else (select case when _hi.t = _lo.t then _lo.v else _lo.v + (((v_e->>'toF')::numeric) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end from (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t <= ((v_e->>'toF')::numeric) order by _y.t desc limit 1) _lo, (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t >= ((v_e->>'toF')::numeric) order by _y.t asc limit 1) _hi) end from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _x) end) - (case when v_e->>'fromF' is null then 0::numeric else (select case when ((v_e->>'fromF')::numeric) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end) when ((v_e->>'fromF')::numeric) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end) else (select case when _hi.t = _lo.t then _lo.v else _lo.v + (((v_e->>'fromF')::numeric) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end from (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t <= ((v_e->>'fromF')::numeric) order by _y.t desc limit 1) _lo, (select * from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _y where _y.t >= ((v_e->>'fromF')::numeric) order by _y.t asc limit 1) _hi) end from (select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v from jsonb_array_elements(z.crv) _p) _x) end) y from (select (v_ogbele_shares->>(cc->>'id'))::numeric / v_share_total f, cc->'curve' crv from jsonb_array_elements(v_ogbele_crudes) cc) z) zz;
    if v_y is null then
      raise exception 'crude go-live refused: the SQL route cannot read the OGBELE cut % off both curves', v_e->>'name';
    end if;
    v_gross := v_gross + v_y / 100.0 * (v_ogbele_valuation #>> array['prices', v_e->>'id'])::numeric;
    if v_e->>'id' = 'kerosene' then v_s_ogbele_blend_kerosene_yield_pct := v_y; end if;
    if v_e->>'id' = 'diesel' then v_s_ogbele_blend_diesel_yield_pct := v_y; end if;
  end loop;
  v_loss := v_gross * (v_ogbele_valuation #>> '{lossPercent}')::numeric / 100.0;
  v_s_ogbele_gross_value_per_bbl := v_gross;
  v_s_ogbele_loss_value_per_bbl := v_loss;
  v_s_ogbele_netback_per_bbl := v_gross - v_loss - (v_ogbele_valuation #>> '{processingCostPerBbl}')::numeric
                                - (v_ogbele_valuation #>> '{freightPerBbl}')::numeric;

  if v_s_idama_blend_api is null or abs(v_s_idama_blend_api - v_g_idama_blend_api) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_api]', v_s_idama_blend_api, v_g_idama_blend_api;
  end if;
  if abs(v_s_idama_blend_api - v_g_idama_blend_api) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_blend_api - v_g_idama_blend_api) / 5e-05; v_worst_key := 'beginner/idama_blend_api';
  end if;
  if v_s_idama_blend_sulfur_wtpct is null or abs(v_s_idama_blend_sulfur_wtpct - v_g_idama_blend_sulfur_wtpct) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_sulfur_wtpct]', v_s_idama_blend_sulfur_wtpct, v_g_idama_blend_sulfur_wtpct;
  end if;
  if abs(v_s_idama_blend_sulfur_wtpct - v_g_idama_blend_sulfur_wtpct) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_blend_sulfur_wtpct - v_g_idama_blend_sulfur_wtpct) / 5e-05; v_worst_key := 'beginner/idama_blend_sulfur_wtpct';
  end if;
  if v_s_idama_blend_vanadium_ppm is null or abs(v_s_idama_blend_vanadium_ppm - v_g_idama_blend_vanadium_ppm) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_vanadium_ppm]', v_s_idama_blend_vanadium_ppm, v_g_idama_blend_vanadium_ppm;
  end if;
  if abs(v_s_idama_blend_vanadium_ppm - v_g_idama_blend_vanadium_ppm) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_blend_vanadium_ppm - v_g_idama_blend_vanadium_ppm) / 5e-05; v_worst_key := 'beginner/idama_blend_vanadium_ppm';
  end if;
  if v_s_idama_abiteye_mass_share_pct is null or abs(v_s_idama_abiteye_mass_share_pct - v_g_idama_abiteye_mass_share_pct) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_abiteye_mass_share_pct]', v_s_idama_abiteye_mass_share_pct, v_g_idama_abiteye_mass_share_pct;
  end if;
  if abs(v_s_idama_abiteye_mass_share_pct - v_g_idama_abiteye_mass_share_pct) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_abiteye_mass_share_pct - v_g_idama_abiteye_mass_share_pct) / 5e-05; v_worst_key := 'beginner/idama_abiteye_mass_share_pct';
  end if;
  if v_s_idama_blend_cii is null or abs(v_s_idama_blend_cii - v_g_idama_blend_cii) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_cii]', v_s_idama_blend_cii, v_g_idama_blend_cii;
  end if;
  if abs(v_s_idama_blend_cii - v_g_idama_blend_cii) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_blend_cii - v_g_idama_blend_cii) / 5e-05; v_worst_key := 'beginner/idama_blend_cii';
  end if;
  if v_s_idama_opuama_kerosene_yield_pct is null or abs(v_s_idama_opuama_kerosene_yield_pct - v_g_idama_opuama_kerosene_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: beginner/idama_opuama_kerosene_yield_pct]', v_s_idama_opuama_kerosene_yield_pct, v_g_idama_opuama_kerosene_yield_pct;
  end if;
  if abs(v_s_idama_opuama_kerosene_yield_pct - v_g_idama_opuama_kerosene_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(v_s_idama_opuama_kerosene_yield_pct - v_g_idama_opuama_kerosene_yield_pct) / 5e-05; v_worst_key := 'beginner/idama_opuama_kerosene_yield_pct';
  end if;
  if v_s_ogbele_blend_t50_f is null or abs(v_s_ogbele_blend_t50_f - v_g_ogbele_blend_t50_f) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_t50_f]', v_s_ogbele_blend_t50_f, v_g_ogbele_blend_t50_f;
  end if;
  if abs(v_s_ogbele_blend_t50_f - v_g_ogbele_blend_t50_f) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_blend_t50_f - v_g_ogbele_blend_t50_f) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_t50_f';
  end if;
  if v_s_ogbele_blend_kerosene_yield_pct is null or abs(v_s_ogbele_blend_kerosene_yield_pct - v_g_ogbele_blend_kerosene_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_kerosene_yield_pct]', v_s_ogbele_blend_kerosene_yield_pct, v_g_ogbele_blend_kerosene_yield_pct;
  end if;
  if abs(v_s_ogbele_blend_kerosene_yield_pct - v_g_ogbele_blend_kerosene_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_blend_kerosene_yield_pct - v_g_ogbele_blend_kerosene_yield_pct) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_kerosene_yield_pct';
  end if;
  if v_s_ogbele_blend_diesel_yield_pct is null or abs(v_s_ogbele_blend_diesel_yield_pct - v_g_ogbele_blend_diesel_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_diesel_yield_pct]', v_s_ogbele_blend_diesel_yield_pct, v_g_ogbele_blend_diesel_yield_pct;
  end if;
  if abs(v_s_ogbele_blend_diesel_yield_pct - v_g_ogbele_blend_diesel_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_blend_diesel_yield_pct - v_g_ogbele_blend_diesel_yield_pct) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_diesel_yield_pct';
  end if;
  if v_s_ogbele_gross_value_per_bbl is null or abs(v_s_ogbele_gross_value_per_bbl - v_g_ogbele_gross_value_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_gross_value_per_bbl]', v_s_ogbele_gross_value_per_bbl, v_g_ogbele_gross_value_per_bbl;
  end if;
  if abs(v_s_ogbele_gross_value_per_bbl - v_g_ogbele_gross_value_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_gross_value_per_bbl - v_g_ogbele_gross_value_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_gross_value_per_bbl';
  end if;
  if v_s_ogbele_loss_value_per_bbl is null or abs(v_s_ogbele_loss_value_per_bbl - v_g_ogbele_loss_value_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_loss_value_per_bbl]', v_s_ogbele_loss_value_per_bbl, v_g_ogbele_loss_value_per_bbl;
  end if;
  if abs(v_s_ogbele_loss_value_per_bbl - v_g_ogbele_loss_value_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_loss_value_per_bbl - v_g_ogbele_loss_value_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_loss_value_per_bbl';
  end if;
  if v_s_ogbele_netback_per_bbl is null or abs(v_s_ogbele_netback_per_bbl - v_g_ogbele_netback_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the second route in SQL gives % over the capstone records, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_netback_per_bbl]', v_s_ogbele_netback_per_bbl, v_g_ogbele_netback_per_bbl;
  end if;
  if abs(v_s_ogbele_netback_per_bbl - v_g_ogbele_netback_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(v_s_ogbele_netback_per_bbl - v_g_ogbele_netback_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_netback_per_bbl';
  end if;
  raise notice 'crude go-live: second route in SQL, 12 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated. The value and the
  -- oracle function it came from are written in; for the six Expert fields it is
  -- the only second route.
  v_worst := 0; v_worst_key := '(none)';
  -- idama_blend_api: oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds
  if abs(33.76556073569742 - v_g_idama_blend_api) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 33.76556073569742, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_api]', v_g_idama_blend_api;
  end if;
  if abs(33.76556073569742 - v_g_idama_blend_api) / 5e-05 > v_worst then
    v_worst := abs(33.76556073569742 - v_g_idama_blend_api) / 5e-05; v_worst_key := 'beginner/idama_blend_api';
  end if;
  -- idama_blend_sulfur_wtpct: oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds
  if abs(0.45211238819254823 - v_g_idama_blend_sulfur_wtpct) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 0.45211238819254823, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_sulfur_wtpct]', v_g_idama_blend_sulfur_wtpct;
  end if;
  if abs(0.45211238819254823 - v_g_idama_blend_sulfur_wtpct) / 5e-05 > v_worst then
    v_worst := abs(0.45211238819254823 - v_g_idama_blend_sulfur_wtpct) / 5e-05; v_worst_key := 'beginner/idama_blend_sulfur_wtpct';
  end if;
  -- idama_blend_vanadium_ppm: oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds
  if abs(14.946944991453488 - v_g_idama_blend_vanadium_ppm) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 14.946944991453488, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_vanadium_ppm]', v_g_idama_blend_vanadium_ppm;
  end if;
  if abs(14.946944991453488 - v_g_idama_blend_vanadium_ppm) / 5e-05 > v_worst then
    v_worst := abs(14.946944991453488 - v_g_idama_blend_vanadium_ppm) / 5e-05; v_worst_key := 'beginner/idama_blend_vanadium_ppm';
  end if;
  -- idama_abiteye_mass_share_pct: oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds
  if abs(17.175715682949974 - v_g_idama_abiteye_mass_share_pct) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 17.175715682949974, not within 5e-05 of the seeded % [graded field: beginner/idama_abiteye_mass_share_pct]', v_g_idama_abiteye_mass_share_pct;
  end if;
  if abs(17.175715682949974 - v_g_idama_abiteye_mass_share_pct) / 5e-05 > v_worst then
    v_worst := abs(17.175715682949974 - v_g_idama_abiteye_mass_share_pct) / 5e-05; v_worst_key := 'beginner/idama_abiteye_mass_share_pct';
  end if;
  -- idama_blend_cii: oracle_crudeassay.blend_cargo, the cargo loaded in barrels and pounds
  if abs(1.044347550229118 - v_g_idama_blend_cii) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 1.044347550229118, not within 5e-05 of the seeded % [graded field: beginner/idama_blend_cii]', v_g_idama_blend_cii;
  end if;
  if abs(1.044347550229118 - v_g_idama_blend_cii) / 5e-05 > v_worst then
    v_worst := abs(1.044347550229118 - v_g_idama_blend_cii) / 5e-05; v_worst_key := 'beginner/idama_blend_cii';
  end if;
  -- idama_opuama_kerosene_yield_pct: oracle_crudeassay.cut_yield by segment overlap on the Opuama Medium curve
  if abs(15.246859479988313 - v_g_idama_opuama_kerosene_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 15.246859479988313, not within 5e-05 of the seeded % [graded field: beginner/idama_opuama_kerosene_yield_pct]', v_g_idama_opuama_kerosene_yield_pct;
  end if;
  if abs(15.246859479988313 - v_g_idama_opuama_kerosene_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(15.246859479988313 - v_g_idama_opuama_kerosene_yield_pct) / 5e-05; v_worst_key := 'beginner/idama_opuama_kerosene_yield_pct';
  end if;
  -- ogbele_blend_t50_f: oracle_crudeassay.t_at(blended_curve, 50) by bisection
  if abs(580.0450450450451 - v_g_ogbele_blend_t50_f) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 580.0450450450451, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_t50_f]', v_g_ogbele_blend_t50_f;
  end if;
  if abs(580.0450450450451 - v_g_ogbele_blend_t50_f) / 5e-05 > v_worst then
    v_worst := abs(580.0450450450451 - v_g_ogbele_blend_t50_f) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_t50_f';
  end if;
  -- ogbele_blend_kerosene_yield_pct: oracle_crudeassay.cut_yield on blended_curve (barrels distilled)
  if abs(14.478553599579609 - v_g_ogbele_blend_kerosene_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 14.478553599579609, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_kerosene_yield_pct]', v_g_ogbele_blend_kerosene_yield_pct;
  end if;
  if abs(14.478553599579609 - v_g_ogbele_blend_kerosene_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(14.478553599579609 - v_g_ogbele_blend_kerosene_yield_pct) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_kerosene_yield_pct';
  end if;
  -- ogbele_blend_diesel_yield_pct: oracle_crudeassay.cut_yield on blended_curve (barrels distilled)
  if abs(18.889779763580073 - v_g_ogbele_blend_diesel_yield_pct) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 18.889779763580073, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_blend_diesel_yield_pct]', v_g_ogbele_blend_diesel_yield_pct;
  end if;
  if abs(18.889779763580073 - v_g_ogbele_blend_diesel_yield_pct) / 5e-05 > v_worst then
    v_worst := abs(18.889779763580073 - v_g_ogbele_blend_diesel_yield_pct) / 5e-05; v_worst_key := 'intermediate/ogbele_blend_diesel_yield_pct';
  end if;
  -- ogbele_gross_value_per_bbl: oracle_crudeassay.netback_cargo, a 100,000 bbl account
  if abs(72.52669990073112 - v_g_ogbele_gross_value_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 72.52669990073112, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_gross_value_per_bbl]', v_g_ogbele_gross_value_per_bbl;
  end if;
  if abs(72.52669990073112 - v_g_ogbele_gross_value_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(72.52669990073112 - v_g_ogbele_gross_value_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_gross_value_per_bbl';
  end if;
  -- ogbele_loss_value_per_bbl: oracle_crudeassay.netback_cargo, a 100,000 bbl account
  if abs(0.7977936989080423 - v_g_ogbele_loss_value_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 0.7977936989080423, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_loss_value_per_bbl]', v_g_ogbele_loss_value_per_bbl;
  end if;
  if abs(0.7977936989080423 - v_g_ogbele_loss_value_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(0.7977936989080423 - v_g_ogbele_loss_value_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_loss_value_per_bbl';
  end if;
  -- ogbele_netback_per_bbl: oracle_crudeassay.netback_cargo, a 100,000 bbl account
  if abs(62.22890620182307 - v_g_ogbele_netback_per_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 62.22890620182307, not within 5e-05 of the seeded % [graded field: intermediate/ogbele_netback_per_bbl]', v_g_ogbele_netback_per_bbl;
  end if;
  if abs(62.22890620182307 - v_g_ogbele_netback_per_bbl) / 5e-05 > v_worst then
    v_worst := abs(62.22890620182307 - v_g_ogbele_netback_per_bbl) / 5e-05; v_worst_key := 'intermediate/ogbele_netback_per_bbl';
  end if;
  -- onne_total_cost_usd: oracle_productblending.case, exact rational vertex enumeration on physically built rows
  if abs(872013.3202480942 - v_g_onne_total_cost_usd) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 872013.3202480942, not within 5e-05 of the seeded % [graded field: advanced/onne_total_cost_usd]', v_g_onne_total_cost_usd;
  end if;
  if abs(872013.3202480942 - v_g_onne_total_cost_usd) / 5e-05 > v_worst then
    v_worst := abs(872013.3202480942 - v_g_onne_total_cost_usd) / 5e-05; v_worst_key := 'advanced/onne_total_cost_usd';
  end if;
  -- onne_fcc_volume_bbl: oracle_productblending.case, exact rational vertex enumeration on physically built rows
  if abs(3228.1609236534123 - v_g_onne_fcc_volume_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 3228.1609236534123, not within 5e-05 of the seeded % [graded field: advanced/onne_fcc_volume_bbl]', v_g_onne_fcc_volume_bbl;
  end if;
  if abs(3228.1609236534123 - v_g_onne_fcc_volume_bbl) / 5e-05 > v_worst then
    v_worst := abs(3228.1609236534123 - v_g_onne_fcc_volume_bbl) / 5e-05; v_worst_key := 'advanced/onne_fcc_volume_bbl';
  end if;
  -- onne_butane_volume_bbl: oracle_productblending.case, exact rational vertex enumeration on physically built rows
  if abs(437.0326736147711 - v_g_onne_butane_volume_bbl) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 437.0326736147711, not within 5e-05 of the seeded % [graded field: advanced/onne_butane_volume_bbl]', v_g_onne_butane_volume_bbl;
  end if;
  if abs(437.0326736147711 - v_g_onne_butane_volume_bbl) / 5e-05 > v_worst then
    v_worst := abs(437.0326736147711 - v_g_onne_butane_volume_bbl) / 5e-05; v_worst_key := 'advanced/onne_butane_volume_bbl';
  end if;
  -- onne_sulfur_relief_usd_per_ppm: oracle_productblending.case, exact re-solve with the sulfur limit moved 1e-7 either way
  if abs(296.30961644359314 - v_g_onne_sulfur_relief_usd_per_ppm) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 296.30961644359314, not within 5e-05 of the seeded % [graded field: advanced/onne_sulfur_relief_usd_per_ppm]', v_g_onne_sulfur_relief_usd_per_ppm;
  end if;
  if abs(296.30961644359314 - v_g_onne_sulfur_relief_usd_per_ppm) / 5e-05 > v_worst then
    v_worst := abs(296.30961644359314 - v_g_onne_sulfur_relief_usd_per_ppm) / 5e-05; v_worst_key := 'advanced/onne_sulfur_relief_usd_per_ppm';
  end if;
  -- The value of relief AT THE MARGIN lies between the oracle's two exact
  -- one-sided quotients (relax 296.30961643433, tighten 296.3096164528563),
  -- widened by 2.96e-07, 1e-9 of its size; and the two agree within twice the
  -- tolerance, so the row is not dual degenerate and one answer is right.
  if v_g_onne_sulfur_relief_usd_per_ppm < 296.30961643433 - 2.963096164435926e-07 or v_g_onne_sulfur_relief_usd_per_ppm > 296.3096164528563 + 2.963096164435926e-07 then
    raise exception 'crude go-live refused: the seeded relief % is not between the oracle''s one-sided quotients 296.30961643433 and 296.3096164528563 [graded field: advanced/onne_sulfur_relief_usd_per_ppm]', v_g_onne_sulfur_relief_usd_per_ppm;
  end if;
  if 296.3096164528563 - 296.30961643433 > 2 * 5e-05 then
    raise exception 'crude go-live refused: the oracle''s one-sided quotients differ by more than twice the tolerance, so the row is dual degenerate [graded field: advanced/onne_sulfur_relief_usd_per_ppm]';
  end if;
  -- onne_rvp_relief_usd_per_psi: oracle_productblending.case, exact re-solve with the RVP limit moved 1e-7 either way
  if abs(6495.117820564159 - v_g_onne_rvp_relief_usd_per_psi) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 6495.117820564159, not within 5e-05 of the seeded % [graded field: advanced/onne_rvp_relief_usd_per_psi]', v_g_onne_rvp_relief_usd_per_psi;
  end if;
  if abs(6495.117820564159 - v_g_onne_rvp_relief_usd_per_psi) / 5e-05 > v_worst then
    v_worst := abs(6495.117820564159 - v_g_onne_rvp_relief_usd_per_psi) / 5e-05; v_worst_key := 'advanced/onne_rvp_relief_usd_per_psi';
  end if;
  -- The value of relief AT THE MARGIN lies between the oracle's two exact
  -- one-sided quotients (relax 6495.1177905644945, tighten 6495.117850563824),
  -- widened by 6.5e-06, 1e-9 of its size; and the two agree within twice the
  -- tolerance, so the row is not dual degenerate and one answer is right.
  if v_g_onne_rvp_relief_usd_per_psi < 6495.1177905644945 - 6.495117849392539e-06 or v_g_onne_rvp_relief_usd_per_psi > 6495.117850563824 + 6.495117849392539e-06 then
    raise exception 'crude go-live refused: the seeded relief % is not between the oracle''s one-sided quotients 6495.1177905644945 and 6495.117850563824 [graded field: advanced/onne_rvp_relief_usd_per_psi]', v_g_onne_rvp_relief_usd_per_psi;
  end if;
  if 6495.117850563824 - 6495.1177905644945 > 2 * 5e-05 then
    raise exception 'crude go-live refused: the oracle''s one-sided quotients differ by more than twice the tolerance, so the row is dual degenerate [graded field: advanced/onne_rvp_relief_usd_per_psi]';
  end if;
  -- onne_ron_relief_usd_per_octane: oracle_productblending.case, exact re-solve with the RON minimum moved 1e-7 either way
  if abs(4032.6308381678386 - v_g_onne_ron_relief_usd_per_octane) > 5e-05 then
    raise exception 'crude go-live refused: the oracle gives 4032.6308381678386, not within 5e-05 of the seeded % [graded field: advanced/onne_ron_relief_usd_per_octane]', v_g_onne_ron_relief_usd_per_octane;
  end if;
  if abs(4032.6308381678386 - v_g_onne_ron_relief_usd_per_octane) / 5e-05 > v_worst then
    v_worst := abs(4032.6308381678386 - v_g_onne_ron_relief_usd_per_octane) / 5e-05; v_worst_key := 'advanced/onne_ron_relief_usd_per_octane';
  end if;
  -- The value of relief AT THE MARGIN lies between the oracle's two exact
  -- one-sided quotients (relax 4032.6308381678386, tighten 4032.6308381678386),
  -- widened by 4.03e-06, 1e-9 of its size; and the two agree within twice the
  -- tolerance, so the row is not dual degenerate and one answer is right.
  if v_g_onne_ron_relief_usd_per_octane < 4032.6308381678386 - 4.032630838167829e-06 or v_g_onne_ron_relief_usd_per_octane > 4032.6308381678386 + 4.032630838167829e-06 then
    raise exception 'crude go-live refused: the seeded relief % is not between the oracle''s one-sided quotients 4032.6308381678386 and 4032.6308381678386 [graded field: advanced/onne_ron_relief_usd_per_octane]', v_g_onne_ron_relief_usd_per_octane;
  end if;
  if 4032.6308381678386 - 4032.6308381678386 > 2 * 5e-05 then
    raise exception 'crude go-live refused: the oracle''s one-sided quotients differ by more than twice the tolerance, so the row is dual degenerate [graded field: advanced/onne_ron_relief_usd_per_octane]';
  end if;
  raise notice 'crude go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ------------------------------------------------- 4. the traps bite
  -- Each is the wrong route discriminate.mjs swept through the engine that
  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or
  -- the field does not discriminate the trap it is for.
  if abs(34.24183417085427 - v_g_idama_blend_api) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (api numbers averaged on volume) reads 34.24183417085427, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_blend_api]', v_g_idama_blend_api;
  end if;
  if abs(0.42574120603015075 - v_g_idama_blend_sulfur_wtpct) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (sulfur blended on volume) reads 0.42574120603015075, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_blend_sulfur_wtpct]', v_g_idama_blend_sulfur_wtpct;
  end if;
  if abs(13.857663316582917 - v_g_idama_blend_vanadium_ppm) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (vanadium blended on volume) reads 13.857663316582917, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_blend_vanadium_ppm]', v_g_idama_blend_vanadium_ppm;
  end if;
  if abs(15.7035175879397 - v_g_idama_abiteye_mass_share_pct) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (volume share given as mass share) reads 15.7035175879397, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_abiteye_mass_share_pct]', v_g_idama_abiteye_mass_share_pct;
  end if;
  if abs(1.0625459858855715 - v_g_idama_blend_cii) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (sara blended on volume) reads 1.0625459858855715, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_blend_cii]', v_g_idama_blend_cii;
  end if;
  if abs(16.833102312335285 - v_g_idama_opuama_kerosene_yield_pct) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (the cargos blended kerosene instead) reads 16.833102312335285, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idama_opuama_kerosene_yield_pct]', v_g_idama_opuama_kerosene_yield_pct;
  end if;
  if abs(578.9253208868145 - v_g_ogbele_blend_t50_f) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (crudes t50s averaged on mass) reads 578.9253208868145, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_blend_t50_f]', v_g_ogbele_blend_t50_f;
  end if;
  if abs(14.394737919185514 - v_g_ogbele_blend_kerosene_yield_pct) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (crudes yields averaged on mass) reads 14.394737919185514, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_blend_kerosene_yield_pct]', v_g_ogbele_blend_kerosene_yield_pct;
  end if;
  if abs(18.89527400710889 - v_g_ogbele_blend_diesel_yield_pct) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (crudes yields averaged on mass) reads 18.89527400710889, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_blend_diesel_yield_pct]', v_g_ogbele_blend_diesel_yield_pct;
  end if;
  if abs(72.46118449879555 - v_g_ogbele_gross_value_per_bbl) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (yields averaged on mass) reads 72.46118449879555, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_gross_value_per_bbl]', v_g_ogbele_gross_value_per_bbl;
  end if;
  if abs(0.7970730294867536 - v_g_ogbele_loss_value_per_bbl) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (yields averaged on mass) reads 0.7970730294867536, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_loss_value_per_bbl]', v_g_ogbele_loss_value_per_bbl;
  end if;
  if abs(62.1641114693088 - v_g_ogbele_netback_per_bbl) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (yields averaged on mass) reads 62.1641114693088, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogbele_netback_per_bbl]', v_g_ogbele_netback_per_bbl;
  end if;
  if abs(866656.6288396909 - v_g_onne_total_cost_usd) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (typed zero tank read as unlimited) reads 866656.6288396909, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_total_cost_usd]', v_g_onne_total_cost_usd;
  end if;
  if abs(3218.0327293947685 - v_g_onne_fcc_volume_bbl) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (rvp index blended on mass) reads 3218.0327293947685, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_fcc_volume_bbl]', v_g_onne_fcc_volume_bbl;
  end if;
  if abs(433.5629830304941 - v_g_onne_butane_volume_bbl) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (typed zero tank read as unlimited) reads 433.5629830304941, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_butane_volume_bbl]', v_g_onne_butane_volume_bbl;
  end if;
  if abs(296.21701392158866 - v_g_onne_sulfur_relief_usd_per_ppm) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (one whole ppm re solved) reads 296.21701392158866, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_sulfur_relief_usd_per_ppm]', v_g_onne_sulfur_relief_usd_per_ppm;
  end if;
  if abs(6582.936834690045 - v_g_onne_rvp_relief_usd_per_psi) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (one whole psi re solved) reads 6582.936834690045, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_rvp_relief_usd_per_psi]', v_g_onne_rvp_relief_usd_per_psi;
  end if;
  if abs(3457.8149763836177 - v_g_onne_ron_relief_usd_per_octane) <= 5e-05 then
    raise exception 'crude go-live refused: the trap (typed zero tank read as unlimited) reads 3457.8149763836177, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/onne_ron_relief_usd_per_octane]', v_g_onne_ron_relief_usd_per_octane;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'crude';
  if not exists (select 1 from public.academy_apps where slug = 'crude' and status = 'available') then
    raise exception 'crude go-live refused: crude did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'crude go-live: crude available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
