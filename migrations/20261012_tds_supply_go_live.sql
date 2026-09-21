-- ============================================================================
-- supply GO-LIVE (HELD): Terminals, Depots & Fuel Supply flips to 'available',
-- the first course of the Supply Chain & Logistics module, at path_order 50.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/supply.
--      The 78 lessons, the teaching lab and its three explorer panels (tank,
--      depot and price) ship in the ZIP and NOT in this database, so a flip
--      before the upload puts a live catalogue tile in front of a route that
--      does not exist;
--   2. the Suite production upload carrying Suite main 1a71d9c90 (Suite #540,
--      fix/md3-0-supply-apps: the Terminal & Depot page repairs this course
--      teaches, an opening stock input so a day's reconciliation can show a
--      gap, days of cover on liftings and only a loss counted to air, with the
--      engines at 13f0936 that page and the Fuel Pricing page run on). Until
--      it is uploaded the live Terminal & Depot page a learner opens beside the
--      course still takes the opening stock from today's own dip, so every day
--      balances: the trap the course teaches.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (supply_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the seventeen fields with a closed form. The go-live
--      first proves each shipped prompt is the rendered one byte for byte.
--      Route per field:
--        SQL closed form  okomu_t1_gross_m3, okomu_t1_standard_m3,
--                         okomu_t2_standard_m3, okomu_expected_closing_m3,
--                         okomu_unaccounted_m3, okomu_tolerance_m3,
--                         ogwashi_rack_probability_of_waiting and
--                         ogwashi_rack_mean_wait_min (Erlang C by the factorial
--                         form, not the engine's recursion),
--                         ogwashi_pumpable_stock_m3, ogwashi_days_of_cover,
--                         ogwashi_cost_per_litre_delivered_ngn,
--                         ogwashi_trucks_required, oron_cif_usd,
--                         oron_landed_total_usd, oron_landed_per_litre_ngn,
--                         oron_pump_price_ngn, oron_government_share_ngn;
--        the ORACLE       oron_breakeven_fx, which the engine finds by bisection
--                         over the whole chain re-priced at each rate, so it is
--                         not re-solved here: its second route is the oracle's
--                         closed form by linearity (route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_terminaldepot.py, oracle_fuelpricing.py, exact
--      rationals where they can be), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for, 0.5 for the one whole number, which must be whole), with a
-- label and a unit, and all of it is asserted here, on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_worst numeric := 0; v_worst_key text := '(none)';
  v_e jsonb; v_amt numeric; v_rate numeric; v_basis text; v_sum_cif numeric;
  v_a numeric; v_c int; v_mu numeric; v_s numeric; v_t numeric; v_k int;
  v_cycle numeric; v_trips_day numeric; v_trips_year numeric; v_cost numeric; v_deliv numeric;
  v_m3 numeric; v_q_m3 numeric; v_q_l numeric; v_q_t numeric; v_fob numeric; v_cf numeric; v_cif numeric;
  v_run numeric; v_outturn numeric; v_landed numeric; v_line numeric; v_gov numeric;
  v_g_okomu_t1_gross_m3 numeric; v_s_okomu_t1_gross_m3 numeric;
  v_g_okomu_t1_standard_m3 numeric; v_s_okomu_t1_standard_m3 numeric;
  v_g_okomu_t2_standard_m3 numeric; v_s_okomu_t2_standard_m3 numeric;
  v_g_okomu_expected_closing_m3 numeric; v_s_okomu_expected_closing_m3 numeric;
  v_g_okomu_unaccounted_m3 numeric; v_s_okomu_unaccounted_m3 numeric;
  v_g_okomu_tolerance_m3 numeric; v_s_okomu_tolerance_m3 numeric;
  v_g_ogwashi_rack_probability_of_waiting numeric; v_s_ogwashi_rack_probability_of_waiting numeric;
  v_g_ogwashi_rack_mean_wait_min numeric; v_s_ogwashi_rack_mean_wait_min numeric;
  v_g_ogwashi_pumpable_stock_m3 numeric; v_s_ogwashi_pumpable_stock_m3 numeric;
  v_g_ogwashi_days_of_cover numeric; v_s_ogwashi_days_of_cover numeric;
  v_g_ogwashi_cost_per_litre_delivered_ngn numeric; v_s_ogwashi_cost_per_litre_delivered_ngn numeric;
  v_g_ogwashi_trucks_required numeric; v_s_ogwashi_trucks_required numeric;
  v_g_oron_cif_usd numeric; v_s_oron_cif_usd numeric;
  v_g_oron_landed_total_usd numeric; v_s_oron_landed_total_usd numeric;
  v_g_oron_landed_per_litre_ngn numeric; v_s_oron_landed_per_litre_ngn numeric;
  v_g_oron_pump_price_ngn numeric; v_s_oron_pump_price_ngn numeric;
  v_g_oron_government_share_ngn numeric; v_s_oron_government_share_ngn numeric;
  v_g_oron_breakeven_fx numeric; v_s_oron_breakeven_fx numeric;
  v_ogwashi_demand_l_per_day jsonb := '2350000'::jsonb;
  v_ogwashi_lane jsonb := '{"distanceKm":238,"payloadLitres":42000,"averageSpeedKmh":43,"loadHours":1.75,"dischargeHours":1.25,"queueHours":2.5,"fuelConsumptionLPer100Km":41,"dieselPricePerLitre":1285,"driverCostPerTrip":72500,"maintenancePerKm":52,"tyresPerKm":31,"overheadPerTrip":46000,"tollsAndLeviesPerTrip":33500,"truckCapitalCost":118000000,"truckLifeYears":7,"workingHoursPerDay":14,"workingDaysPerYear":310,"transitLossPercent":0.25}'::jsonb;
  v_ogwashi_liftings_m3 jsonb := '1760'::jsonb;
  v_ogwashi_rack jsonb := '{"arrivalsPerHour":14,"loadMinutes":26,"bays":7}'::jsonb;
  v_ogwashi_receipts_m3 jsonb := '1240'::jsonb;
  v_ogwashi_tanks jsonb := '[{"id":"OG-1 (PMS)","capacityM3":6200,"heelM3":180,"stockM3":4127.5},{"id":"OG-2 (PMS)","capacityM3":4400,"heelM3":140,"stockM3":18.6},{"id":"OG-3 (AGO)","capacityM3":2800,"heelM3":92,"stockM3":1873.9}]'::jsonb;
  v_okomu_day jsonb := '{"openingM3":2498.45,"receiptsM3":1180,"deliveriesM3":1352.6,"knownLossM3":1.4,"tolerancePercentOfThroughput":0.18}'::jsonb;
  v_okomu_t1 jsonb := '{"id":"OK-1","product":"AGO","shape":"vertical","diameterM":18.6,"topMm":14400,"stepMm":200,"dipMm":8437,"waterMm":143,"densityKgM3":842.7,"temperatureC":31,"vcfTyped":0.9868}'::jsonb;
  v_okomu_t1_table jsonb := '[{"heightMm":0,"volumeM3":0},{"heightMm":200,"volumeM3":54.343},{"heightMm":400,"volumeM3":108.687},{"heightMm":600,"volumeM3":163.03},{"heightMm":800,"volumeM3":217.373},{"heightMm":1000,"volumeM3":271.716},{"heightMm":1200,"volumeM3":326.06},{"heightMm":1400,"volumeM3":380.403},{"heightMm":1600,"volumeM3":434.746},{"heightMm":1800,"volumeM3":489.089},{"heightMm":2000,"volumeM3":543.433},{"heightMm":2200,"volumeM3":597.776},{"heightMm":2400,"volumeM3":652.119},{"heightMm":2600,"volumeM3":706.463},{"heightMm":2800,"volumeM3":760.806},{"heightMm":3000,"volumeM3":815.149},{"heightMm":3200,"volumeM3":869.492},{"heightMm":3400,"volumeM3":923.836},{"heightMm":3600,"volumeM3":978.179},{"heightMm":3800,"volumeM3":1032.522},{"heightMm":4000,"volumeM3":1086.865},{"heightMm":4200,"volumeM3":1141.209},{"heightMm":4400,"volumeM3":1195.552},{"heightMm":4600,"volumeM3":1249.895},{"heightMm":4800,"volumeM3":1304.238},{"heightMm":5000,"volumeM3":1358.582},{"heightMm":5200,"volumeM3":1412.925},{"heightMm":5400,"volumeM3":1467.268},{"heightMm":5600,"volumeM3":1521.612},{"heightMm":5800,"volumeM3":1575.955},{"heightMm":6000,"volumeM3":1630.298},{"heightMm":6200,"volumeM3":1684.641},{"heightMm":6400,"volumeM3":1738.985},{"heightMm":6600,"volumeM3":1793.328},{"heightMm":6800,"volumeM3":1847.671},{"heightMm":7000,"volumeM3":1902.014},{"heightMm":7200,"volumeM3":1956.358},{"heightMm":7400,"volumeM3":2010.701},{"heightMm":7600,"volumeM3":2065.044},{"heightMm":7800,"volumeM3":2119.388},{"heightMm":8000,"volumeM3":2173.731},{"heightMm":8200,"volumeM3":2228.074},{"heightMm":8400,"volumeM3":2282.417},{"heightMm":8600,"volumeM3":2336.761},{"heightMm":8800,"volumeM3":2391.104},{"heightMm":9000,"volumeM3":2445.447},{"heightMm":9200,"volumeM3":2499.79},{"heightMm":9400,"volumeM3":2554.134},{"heightMm":9600,"volumeM3":2608.477},{"heightMm":9800,"volumeM3":2662.82},{"heightMm":10000,"volumeM3":2717.163},{"heightMm":10200,"volumeM3":2771.507},{"heightMm":10400,"volumeM3":2825.85},{"heightMm":10600,"volumeM3":2880.193},{"heightMm":10800,"volumeM3":2934.537},{"heightMm":11000,"volumeM3":2988.88},{"heightMm":11200,"volumeM3":3043.223},{"heightMm":11400,"volumeM3":3097.566},{"heightMm":11600,"volumeM3":3151.91},{"heightMm":11800,"volumeM3":3206.253},{"heightMm":12000,"volumeM3":3260.596},{"heightMm":12200,"volumeM3":3314.939},{"heightMm":12400,"volumeM3":3369.283},{"heightMm":12600,"volumeM3":3423.626},{"heightMm":12800,"volumeM3":3477.969},{"heightMm":13000,"volumeM3":3532.313},{"heightMm":13200,"volumeM3":3586.656},{"heightMm":13400,"volumeM3":3640.999},{"heightMm":13600,"volumeM3":3695.342},{"heightMm":13800,"volumeM3":3749.686},{"heightMm":14000,"volumeM3":3804.029},{"heightMm":14200,"volumeM3":3858.372},{"heightMm":14400,"volumeM3":3912.715}]'::jsonb;
  v_okomu_t2 jsonb := '{"id":"OK-2","product":"PMS","shape":"horizontal","diameterM":3.4,"lengthM":15.2,"stepMm":100,"dipMm":2265,"waterMm":38,"densityKgM3":739.4,"temperatureC":30.5,"vcfTyped":0.9811}'::jsonb;
  v_okomu_t2_table jsonb := '[{"heightMm":0,"volumeM3":0},{"heightMm":100,"volumeM3":1.171},{"heightMm":200,"volumeM3":3.283},{"heightMm":300,"volumeM3":5.975},{"heightMm":400,"volumeM3":9.113},{"heightMm":500,"volumeM3":12.613},{"heightMm":600,"volumeM3":16.417},{"heightMm":700,"volumeM3":20.48},{"heightMm":800,"volumeM3":24.765},{"heightMm":900,"volumeM3":29.239},{"heightMm":1000,"volumeM3":33.876},{"heightMm":1100,"volumeM3":38.65},{"heightMm":1200,"volumeM3":43.539},{"heightMm":1300,"volumeM3":48.522},{"heightMm":1400,"volumeM3":53.579},{"heightMm":1500,"volumeM3":58.69},{"heightMm":1600,"volumeM3":63.837},{"heightMm":1700,"volumeM3":69.002},{"heightMm":1800,"volumeM3":74.167},{"heightMm":1900,"volumeM3":79.314},{"heightMm":2000,"volumeM3":84.425},{"heightMm":2100,"volumeM3":89.482},{"heightMm":2200,"volumeM3":94.464},{"heightMm":2300,"volumeM3":99.354},{"heightMm":2400,"volumeM3":104.128},{"heightMm":2500,"volumeM3":108.765},{"heightMm":2600,"volumeM3":113.239},{"heightMm":2700,"volumeM3":117.524},{"heightMm":2800,"volumeM3":121.587},{"heightMm":2900,"volumeM3":125.391},{"heightMm":3000,"volumeM3":128.891},{"heightMm":3100,"volumeM3":132.029},{"heightMm":3200,"volumeM3":134.721},{"heightMm":3300,"volumeM3":136.833},{"heightMm":3400,"volumeM3":138.004}]'::jsonb;
  v_oron_cap jsonb := '1390'::jsonb;
  v_oron_cargo jsonb := '{"quantity":28500,"quantityUnit":"tonne","densityKgM3":838.2,"fobPrice":742.5,"fobBasis":"per_tonne","oceanLossPercent":0.35,"fxRate":1487.6}'::jsonb;
  v_oron_elements jsonb := '{"depot":18.5,"bridging":26,"transport":22.75,"marketer":17.25,"dealer":29.5,"levies":8.4,"vat":5.5}'::jsonb;
  v_oron_fx_values jsonb := '[1200,1300,1400,1500,1600,1700,1800]'::jsonb;
  v_oron_insurance_basis jsonb := '"percent_of_cif"'::jsonb;
  v_oron_rates jsonb := '{"freight":31.4,"insurance":0.175,"duty":6.25,"port":2.85,"regulator":0.0019,"jetty":1.35,"storage":2.1,"finance":1.25,"demurrage":48000}'::jsonb;
  v_import_template jsonb := '[{"id":"freight","label":"Ocean freight","basis":"per_tonne","stage":"freight"},{"id":"insurance","label":"Marine insurance","basis":"percent_of_cf","stage":"insurance"},{"id":"duty","label":"Import duty","basis":"percent_of_cif","stage":"landed"},{"id":"port","label":"Port and harbour charges","basis":"per_tonne","stage":"landed"},{"id":"regulator","label":"Regulatory and inspection charges","basis":"per_litre","stage":"landed"},{"id":"jetty","label":"Jetty throughput and discharge","basis":"per_m3","stage":"landed"},{"id":"storage","label":"Storage and handling","basis":"per_m3","stage":"landed"},{"id":"finance","label":"Financing and letter of credit","basis":"percent_of_cif","stage":"landed"},{"id":"demurrage","label":"Demurrage provision","basis":"per_cargo","stage":"landed"}]'::jsonb;
  v_pump_template jsonb := '[{"id":"depot","label":"Depot and terminal margin","basis":"per_litre","recipient":"Terminal"},{"id":"bridging","label":"Bridging or equalisation","basis":"per_litre","recipient":"Chain"},{"id":"transport","label":"Transport to station","basis":"per_litre","recipient":"Transporter"},{"id":"marketer","label":"Marketer margin","basis":"per_litre","recipient":"Marketer"},{"id":"dealer","label":"Dealer margin","basis":"per_litre","recipient":"Dealer"},{"id":"levies","label":"Statutory levies at the pump","basis":"per_litre","recipient":"Government"},{"id":"vat","label":"Value added tax","basis":"percent_of_running","recipient":"Government"}]'::jsonb;
  v_tol_of jsonb := '{"okomu_t1_gross_m3":0.01,"okomu_t1_standard_m3":0.01,"okomu_t2_standard_m3":0.01,"okomu_expected_closing_m3":0.01,"okomu_unaccounted_m3":0.01,"okomu_tolerance_m3":0.01,"ogwashi_rack_probability_of_waiting":0.0001,"ogwashi_rack_mean_wait_min":0.01,"ogwashi_pumpable_stock_m3":0.01,"ogwashi_days_of_cover":0.01,"ogwashi_cost_per_litre_delivered_ngn":0.0001,"ogwashi_trucks_required":0.5,"oron_cif_usd":0.01,"oron_landed_total_usd":0.01,"oron_landed_per_litre_ngn":0.0001,"oron_pump_price_ngn":0.0001,"oron_government_share_ngn":0.0001,"oron_breakeven_fx":0.01}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'supply' and active;
  if v_structures <> 3 then
    raise exception 'supply go-live refused: supply has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'supply';
  if v_questions <> 396 then
    raise exception 'supply go-live refused: supply has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'supply'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'supply' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'supply' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'supply'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'supply go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'supply' and s.active;
  if v_lessons <> 78 then
    raise exception 'supply go-live refused: supply carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'supply' and s.active;
  if v_modules <> 18 then
    raise exception 'supply go-live refused: supply carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'supply' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'supply';
  if v_capstones <> 3 then
    raise exception 'supply go-live refused: supply has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'supply';
  if v_graded <> 18 then
    raise exception 'supply go-live refused: supply has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'supply' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  -- ------------------------------------------------------------ catalogue
  if not exists (select 1 from public.academy_apps
                  where slug = 'supply' and module = 'supply_chain'
                    and path_order = 50 and prereq_slug is null) then
    raise exception 'supply go-live refused: the supply catalogue row is not supply_chain at path_order 50 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 50 and slug <> 'supply') then
    raise exception 'supply go-live refused: another course already holds path_order 50';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 48 and slug <> 'crude') then
    raise exception 'supply go-live refused: path_order 48, the slot of the wave sibling crude, is held by another course';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 49 and slug <> 'refinery') then
    raise exception 'supply go-live refused: path_order 49, the slot of the wave sibling refinery, is held by another course';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class, with a label and a unit; the one field graded at 0.5 is
  -- a whole number.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
          or ((f->>'tol')::numeric = 0.5 and (f->>'expected')::numeric <> round((f->>'expected')::numeric))
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'supply go-live refused: % graded field(s) are not a number at their precision.json tolerance with a label and a unit: %', v_n, v_names;
  end if;

  select count(distinct f->>'key') into v_n
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply';
  if v_n <> 18 then
    raise exception 'supply go-live refused: the capstones grade % distinct keys, expected the 18 precision.json classifies', v_n;
  end if;


  -- ---------------------------------------- the prompts the learner reads
  -- Each shipped prompt is capstone.json's, byte for byte, which
  -- supply_capstone.mjs rendered from the records the second route reads.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'supply' and tier = 'beginner';
  if v_prompt is distinct from 'OKOMU DEPOT, Ologbo Energy Depots Ltd (an invented record). Tank OK-1 is a vertical AGO tank whose strapping table starts at the empty tank (0 mm, 0.000 m3) and is linear between entries; the entries either side of this morning''s dip are 8400 mm 2282.417 m3 and 8600 mm 2336.761 m3, and either side of the water cut 0 mm 0.000 m3 and 200 mm 54.343 m3. Dip 8437 mm, water cut 143 mm, VCF 0.9868 read off the depot''s own tables. Tank OK-2 is a horizontal PMS bullet whose table also starts at the empty tank; the entries either side of the dip are 2200 mm 94.464 m3 and 2300 mm 99.354 m3, and either side of the water cut 0 mm 0.000 m3 and 100 mm 1.171 m3. Dip 2265 mm, water cut 38 mm, VCF 0.9811 off the same tables. The day, all at standard: yesterday''s closing stock 2498.45 m3, receipts 1180 m3, deliveries 1352.6 m3, known losses 1.4 m3; the closing dip is the two tanks'' standard volumes together; the tolerance is 0.18 percent of throughput. Give six numbers in m3, each to two decimals, a loss as a negative number. (1) OK-1''s gross observed volume. (2) OK-1''s standard volume. (3) OK-2''s standard volume. (4) The expected closing stock. (5) The unaccounted figure. (6) The tolerance.' then
    raise exception 'supply go-live refused: the beginner prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'supply' and tier = 'intermediate';
  if v_prompt is distinct from 'OGWASHI DEPOT, Anioma Fuel Logistics Ltd (an invented record). The loading rack: trucks arrive at random at 14 an hour, a load takes 26 minutes on average, and there are 7 bays. The tank farm: OG-1 (PMS) capacity 6200 m3, heel 180 m3, stock 4127.5 m3; OG-2 (PMS) capacity 4400 m3, heel 140 m3, stock 18.6 m3; OG-3 (AGO) capacity 2800 m3, heel 92 m3, stock 1873.9 m3. The farm''s liftings are 1760 m3 a day, and it receives 1240 m3 a day by pipeline. The lane to its stations, every cost in naira and invented for the course: 238 km each way, a 42000 litre payload, 43 km/h average, 1.75 h to load, 1.25 h to discharge, 2.5 h queueing, diesel at 41 litres per 100 km and 1285 a litre, driver 72500 a trip, maintenance 52 and tyres 31 a km, tolls and levies 33500 a trip, overhead 46000 a trip, a truck costing 118000000 over 7 years, 14 working hours a day and 310 days a year, a transit loss of 0.25 percent. The stations take 2350000 litres a day. Give six numbers. (1) The probability that an arriving truck waits for a bay, to four decimals. (2) The mean wait for a bay in minutes, to two decimals. (3) The farm''s pumpable stock in m3, to two decimals. (4) The farm''s days of cover on its liftings, to two decimals. (5) The lane''s cost per litre delivered in naira, to four decimals. (6) The number of trucks the lane needs, a whole number.' then
    raise exception 'supply go-live refused: the intermediate prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'supply' and tier = 'advanced';
  if v_prompt is distinct from 'ORON JETTY, Cross River Estuary Energy Ltd (an invented record). An AGO cargo of 28500 tonnes at 838.2 kg/m3, FOB 742.5 USD a tonne, ocean loss 0.35 percent, 1487.6 naira to the dollar. Every rate is INVENTED for the course and none is a published figure: Ocean freight 31.4 USD per tonne; Marine insurance 0.175 percent of CIF; Import duty 6.25 percent of CIF; Port and harbour charges 2.85 USD per tonne; Regulatory and inspection charges 0.0019 USD per litre; Jetty throughput and discharge 1.35 USD per m3; Storage and handling 2.1 USD per m3; Financing and letter of credit 1.25 percent of CIF; Demurrage provision 48000 USD for the cargo. Freight builds C&F, insurance builds CIF, and every other line is levied on landing; a percent-of-CIF insurance is part of the value it is charged on. The pump build-up starts from the landed cost per litre sold as the app carries it, to four decimals, and adds in order, every element invented: Depot and terminal margin (Terminal) 18.5 naira a litre; Bridging or equalisation (Chain) 26 naira a litre; Transport to station (Transporter) 22.75 naira a litre; Marketer margin (Marketer) 17.25 naira a litre; Dealer margin (Dealer) 29.5 naira a litre; Statutory levies at the pump (Government) 8.4 naira a litre; Value added tax (Government) 5.5 percent of the running total. The price cap is 1390 naira a litre. Give six numbers. (1) CIF in USD, to two decimals. (2) The landed total in USD, to two decimals. (3) The landed cost per litre sold in naira, to four decimals. (4) The pump price in naira a litre, to four decimals. (5) The government''s share of that price in naira a litre, to four decimals. (6) The exchange rate, searched between 1200 and 1800 naira to the dollar, at which the pump price meets the cap, to two decimals.' then
    raise exception 'supply go-live refused: the advanced prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::numeric into v_g_okomu_t1_gross_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_t1_gross_m3';
  select (f->>'expected')::numeric into v_g_okomu_t1_standard_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_t1_standard_m3';
  select (f->>'expected')::numeric into v_g_okomu_t2_standard_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_t2_standard_m3';
  select (f->>'expected')::numeric into v_g_okomu_expected_closing_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_expected_closing_m3';
  select (f->>'expected')::numeric into v_g_okomu_unaccounted_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_unaccounted_m3';
  select (f->>'expected')::numeric into v_g_okomu_tolerance_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'beginner' and f->>'key' = 'okomu_tolerance_m3';
  select (f->>'expected')::numeric into v_g_ogwashi_rack_probability_of_waiting
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_rack_probability_of_waiting';
  select (f->>'expected')::numeric into v_g_ogwashi_rack_mean_wait_min
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_rack_mean_wait_min';
  select (f->>'expected')::numeric into v_g_ogwashi_pumpable_stock_m3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_pumpable_stock_m3';
  select (f->>'expected')::numeric into v_g_ogwashi_days_of_cover
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_days_of_cover';
  select (f->>'expected')::numeric into v_g_ogwashi_cost_per_litre_delivered_ngn
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_cost_per_litre_delivered_ngn';
  select (f->>'expected')::numeric into v_g_ogwashi_trucks_required
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'intermediate' and f->>'key' = 'ogwashi_trucks_required';
  select (f->>'expected')::numeric into v_g_oron_cif_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_cif_usd';
  select (f->>'expected')::numeric into v_g_oron_landed_total_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_landed_total_usd';
  select (f->>'expected')::numeric into v_g_oron_landed_per_litre_ngn
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_landed_per_litre_ngn';
  select (f->>'expected')::numeric into v_g_oron_pump_price_ngn
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_pump_price_ngn';
  select (f->>'expected')::numeric into v_g_oron_government_share_ngn
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_government_share_ngn';
  select (f->>'expected')::numeric into v_g_oron_breakeven_fx
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply' and c.tier = 'advanced' and f->>'key' = 'oron_breakeven_fx';
  if v_g_okomu_t1_gross_m3 is null
     or v_g_okomu_t1_standard_m3 is null
     or v_g_okomu_t2_standard_m3 is null
     or v_g_okomu_expected_closing_m3 is null
     or v_g_okomu_unaccounted_m3 is null
     or v_g_okomu_tolerance_m3 is null
     or v_g_ogwashi_rack_probability_of_waiting is null
     or v_g_ogwashi_rack_mean_wait_min is null
     or v_g_ogwashi_pumpable_stock_m3 is null
     or v_g_ogwashi_days_of_cover is null
     or v_g_ogwashi_cost_per_litre_delivered_ngn is null
     or v_g_ogwashi_trucks_required is null
     or v_g_oron_cif_usd is null
     or v_g_oron_landed_total_usd is null
     or v_g_oron_landed_per_litre_ngn is null
     or v_g_oron_pump_price_ngn is null
     or v_g_oron_government_share_ngn is null
     or v_g_oron_breakeven_fx is null then
    raise exception 'supply go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is a number
  -- token in any prompt, dataset, title or label: not within its tolerance, and
  -- not as its own rounding at two or more significant figures. None of the
  -- 18 engine-derived intermediates on the way to a graded field is
  -- printed as its own rounding at three or more.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where c.app_slug = 'supply' and p.app_slug = 'supply'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or (length(ltrim(replace(replace(m[1], '-', ''), '.', ''), '0')) >= 2
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)) + 1e-12));
  if v_n <> 0 then
    raise exception 'supply go-live refused: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), ''), '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m,
         jsonb_each_text('{"okomu_t1_water_m3":38.855245000000004,"okomu_t2_gross_m3":97.19752,"okomu_t2_water_m3":0.44498000000000004,"okomu_closing_m3":2319.2281586579998,"okomu_throughput_m3":2532.6,"ogwashi_offered_erlangs":6.066666666666667,"ogwashi_utilisation":0.8666666666666668,"ogwashi_queue_length":4.138344561828809,"ogwashi_farm_stock_m3":6020,"ogwashi_farm_heel_m3":412,"ogwashi_cycle_hours":16.57,"ogwashi_trips_per_day":0.844912,"ogwashi_cost_per_trip":506647.8,"ogwashi_trips_needed":55.952381,"oron_cf_usd":22056150,"oron_fob_usd":21161250,"oron_outturn_litres":33882426.63,"oron_per_litre_usd":0.710193}'::jsonb) d(k, v)
   where p.app_slug = 'supply'
     and length(ltrim(replace(replace(m[1], '-', ''), '.', ''), '0')) >= 3
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)) + 1e-12;
  if v_n <> 0 then
    raise exception 'supply go-live refused: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts (113), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, '(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])', 'g') as m
   where p.app_slug = 'supply';
  if v_n <> 113 then
    raise exception 'supply go-live refused: the prompt sweep read % number tokens, and gen_course.py read 113 from the same prompts', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'supply') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'supply') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'supply go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;


  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints (515 distinct values, read by
  -- the regex -?[0-9]+[.]?[0-9]*): a graded field that is a figure the digest
  -- prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'supply'
     and exists (select 1 from unnest(array[0, 0.000854, 0.000975309, 0.001080514, 0.001152, 0.001195545, 0.001205, 0.001350036, 0.001489796, 0.002276, 0.0024, 0.002411, 0.002662, 0.007, 0.007476, 0.008932, 0.017119, 0.018422, 0.019538, 0.019773, 0.022794, 0.029075, 0.030704, 0.0494, 0.05, 0.061033, 0.069965, 0.086243, 0.0913, 0.1, 0.12, 0.138706, 0.1399, 0.15, 0.158987294928, 0.16, 0.1801, 0.196566, 0.2, 0.206107, 0.209905, 0.22, 0.238991, 0.25, 0.270685, 0.287043, 0.2948, 0.3, 0.300939, 0.341, 0.345262, 0.392371, 0.410394, 0.428654, 0.45, 0.48294, 0.5, 0.509434, 0.513357, 0.514286, 0.5311, 0.579252, 0.580413, 0.58187, 0.585103, 0.596432, 0.6, 0.6088, 0.64216, 0.658717, 0.66426, 0.688454, 0.688546, 0.7, 0.72, 0.75, 0.75282, 0.787753, 0.8, 0.823088, 0.825, 0.878289, 0.891419, 0.9, 0.940897, 0.945114, 0.95, 0.965932, 0.971248, 0.972793, 0.975, 0.975246, 0.977583, 0.980162, 0.9803, 0.98208, 0.983832, 0.986447, 0.9876, 0.9884, 0.991038, 0.992594, 0.993236, 1, 1.006736, 1.04, 1.053947, 1.0553, 1.063584, 1.2, 1.25, 1.317434, 1.4, 1.481061, 1.5, 1.75, 1.89, 1.9, 1.9657, 2, 2.2083, 2.342, 2.35, 2.4, 2.5, 2.65, 2.8, 2.8704, 3, 3.05, 3.091, 3.1, 3.2, 3.4279, 3.6, 3.8, 3.8345, 3.9, 4, 4.1, 4.2, 4.3056, 4.6, 5, 5.137, 5.2, 5.3, 5.75, 6, 6.183, 6.5, 6.8, 7, 7.0353, 7.0898, 7.2, 7.8, 8, 8.5731, 8.648, 9, 9.3, 9.5, 9.5336, 9.6, 10, 10.1887, 11, 11.1, 11.283, 11.5, 12, 12.365, 13, 13.2401, 13.3075, 14, 15, 15.0704, 16, 16.1, 17, 17.893, 18, 18.065, 18.4, 18.547, 19, 19.101, 19.8, 20, 20.1822, 20.6072, 21, 22, 23, 24, 24.5, 24.848, 25, 26, 26.5, 27.2, 29, 30, 30.913, 31, 31.25, 31.5, 32, 34.8249, 35, 38, 38.181818, 38.52708, 40, 41, 44.1108, 46, 47.2652, 47.517, 49, 50.925, 51.126, 51.556, 52.161, 52.501, 52.508, 54.279, 58, 60, 63.0816, 65.5996, 68.7548, 71.2652, 73.39, 74.4281, 75.1751, 75.1996, 80.1013, 80.425, 80.588, 81.289, 85, 85.7746, 87.8167, 91, 91.4478, 95, 95.033, 97.121, 98.0908, 100, 106.9703, 114.04, 120, 125, 135, 150, 156, 164.7, 180, 180.7706, 191.0445, 199.278, 210, 211.7551, 212, 216, 221, 224, 224.64, 225, 243.285, 245.7297, 250, 273.7243, 283.9982, 300, 301, 312, 365, 400, 420, 468, 500, 520, 545, 580, 624, 640, 655, 688, 698.2441, 700, 720, 741.6, 742.8, 745, 745.2, 775, 785.5246, 796.8, 800, 820, 840, 846.3, 850, 860, 872.8052, 876.2757, 880.6943, 882.4592, 884.6753, 889.5902, 900, 905.6753, 920, 930.1753, 936, 949.9753, 960, 960.0857, 968.3753, 969.2294, 999.6253, 1000, 1006.516, 1009.2253, 1010, 1031.3197, 1040, 1047.3662, 1054.599, 1055.575, 1062.1833, 1066.7292, 1067.84, 1074.8249, 1086.941, 1097.4, 1105.841, 1123, 1125, 1134.6467, 1150, 1155.137, 1200, 1221.9272, 1248.0908, 1250, 1292, 1300, 1341.0445, 1350, 1377, 1433.9982, 1500, 1520.4, 1641.7105, 1650, 1800, 1806, 1847, 1900, 1950, 2100, 2211.6, 2412.743, 2500, 2640, 2870, 2913.732, 3000, 3010, 3312.5, 3393.298, 3461.488, 3461.489, 3516.228, 3542.077, 3611.261, 3752.6, 3902.6, 4380.25, 4499.452, 4499.453, 4508.1, 4581.49, 4600, 4825.85, 4855.5, 4945.052, 4953.7, 4954.2, 4988, 5000, 5045.6, 5078.4, 5250, 5288.4, 5301.1, 5406, 5453.1, 5500, 5606.957, 5870, 5925, 6010, 6050, 6105, 6180, 6182.5, 6240, 6250, 6310, 6395, 7335.3, 7500, 8125, 9106, 9250, 9318, 9400, 9500, 10000, 10077.7, 10123, 10732.7, 11393.64, 11767.3, 11875, 12000, 12010, 14388, 14750, 14800, 20280, 20592, 21000, 21845, 22500, 28125, 30000, 31875, 32901, 33000, 33750, 33999.7701, 33999.9616, 34000, 35416.667, 36000, 37500, 37608.7, 38868.8, 38931.09, 40000, 40476.19, 40560, 42500, 45566.774, 45637.584, 45772.442, 45772.7, 45772.752, 52500, 54927.3, 55085, 58000, 60217.39, 60840, 62385.321, 82826.09, 103700, 109854.6, 121297.79, 139276.8, 278553.6, 287900, 287901.6215, 287901.947, 313665.5, 330000, 340647.04, 417830.4, 437830.99, 495830.99, 660000, 677996.49, 901000, 1260000, 1399082.46, 1399086.04, 1739733.07, 1980000, 23392000, 24293000, 24331868.8, 24331931.09, 24774210.79, 25114857.82, 26513877.12, 26513943.86, 35416666.67, 40476190.48, 42500000, 45315024.23, 45566774.37, 45637583.89, 45681206.25, 45772442.21, 45772700, 45772751.75, 62385321.1]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'supply go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;


  -- ---------------------------------------------------- 1. against the engine
  -- The seeded value is the engine's return at full precision, exactly.
  if v_g_okomu_t1_gross_m3 <> 2253.615395 then
    raise exception 'supply go-live refused: the seeded value % is not the 2253.615395 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_t1_gross_m3]', v_g_okomu_t1_gross_m3;
  end if;
  if v_g_okomu_t1_standard_m3 <> 2223.867671786 then
    raise exception 'supply go-live refused: the seeded value % is not the 2223.867671786 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_t1_standard_m3]', v_g_okomu_t1_standard_m3;
  end if;
  if v_g_okomu_t2_standard_m3 <> 95.360486872 then
    raise exception 'supply go-live refused: the seeded value % is not the 95.360486872 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_t2_standard_m3]', v_g_okomu_t2_standard_m3;
  end if;
  if v_g_okomu_expected_closing_m3 <> 2324.45 then
    raise exception 'supply go-live refused: the seeded value % is not the 2324.45 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_expected_closing_m3]', v_g_okomu_expected_closing_m3;
  end if;
  if v_g_okomu_unaccounted_m3 <> -5.221841342000062 then
    raise exception 'supply go-live refused: the seeded value % is not the -5.221841342000062 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_unaccounted_m3]', v_g_okomu_unaccounted_m3;
  end if;
  if v_g_okomu_tolerance_m3 <> 4.55868 then
    raise exception 'supply go-live refused: the seeded value % is not the 4.55868 the engine returned through supply_capstone.mjs [graded field: beginner/okomu_tolerance_m3]', v_g_okomu_tolerance_m3;
  end if;
  if v_g_ogwashi_rack_probability_of_waiting <> 0.6366683941275083 then
    raise exception 'supply go-live refused: the seeded value % is not the 0.6366683941275083 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_rack_probability_of_waiting]', v_g_ogwashi_rack_probability_of_waiting;
  end if;
  if v_g_ogwashi_rack_mean_wait_min <> 17.735762407837736 then
    raise exception 'supply go-live refused: the seeded value % is not the 17.735762407837736 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_rack_mean_wait_min]', v_g_ogwashi_rack_mean_wait_min;
  end if;
  if v_g_ogwashi_pumpable_stock_m3 <> 5729.4 then
    raise exception 'supply go-live refused: the seeded value % is not the 5729.4 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_pumpable_stock_m3]', v_g_ogwashi_pumpable_stock_m3;
  end if;
  if v_g_ogwashi_days_of_cover <> 3.2553409090909087 then
    raise exception 'supply go-live refused: the seeded value % is not the 3.2553409090909087 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_days_of_cover]', v_g_ogwashi_days_of_cover;
  end if;
  if v_g_ogwashi_cost_per_litre_delivered_ngn <> 12.093276 then
    raise exception 'supply go-live refused: the seeded value % is not the 12.093276 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_cost_per_litre_delivered_ngn]', v_g_ogwashi_cost_per_litre_delivered_ngn;
  end if;
  if v_g_ogwashi_trucks_required <> 67 then
    raise exception 'supply go-live refused: the seeded value % is not the 67 the engine returned through supply_capstone.mjs [graded field: intermediate/ogwashi_trucks_required]', v_g_ogwashi_trucks_required;
  end if;
  if v_g_oron_cif_usd <> 22094815.93 then
    raise exception 'supply go-live refused: the seeded value % is not the 22094815.93 the engine returned through supply_capstone.mjs [graded field: advanced/oron_cif_usd]', v_g_oron_cif_usd;
  end if;
  if v_g_oron_landed_total_usd <> 24063059.78 then
    raise exception 'supply go-live refused: the seeded value % is not the 24063059.78 the engine returned through supply_capstone.mjs [graded field: advanced/oron_landed_total_usd]', v_g_oron_landed_total_usd;
  end if;
  if v_g_oron_landed_per_litre_ngn <> 1056.483 then
    raise exception 'supply go-live refused: the seeded value % is not the 1056.483 the engine returned through supply_capstone.mjs [graded field: advanced/oron_landed_per_litre_ngn]', v_g_oron_landed_per_litre_ngn;
  end if;
  if v_g_oron_pump_price_ngn <> 1243.7216 then
    raise exception 'supply go-live refused: the seeded value % is not the 1243.7216 the engine returned through supply_capstone.mjs [graded field: advanced/oron_pump_price_ngn]', v_g_oron_pump_price_ngn;
  end if;
  if v_g_oron_government_share_ngn <> 73.2386 then
    raise exception 'supply go-live refused: the seeded value % is not the 73.2386 the engine returned through supply_capstone.mjs [graded field: advanced/oron_government_share_ngn]', v_g_oron_government_share_ngn;
  end if;
  if v_g_oron_breakeven_fx <> 1682.8320980072021 then
    raise exception 'supply go-live refused: the seeded value % is not the 1682.8320980072021 the engine returned through supply_capstone.mjs [graded field: advanced/oron_breakeven_fx]', v_g_oron_breakeven_fx;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OKOMU. A height is read between the two strapping entries either
  -- side of it, linearly; the water cut is read through the same table and
  -- taken off; the gross times the VCF typed off the depot's own tables is the
  -- standard volume. The day closes from yesterday's closing stock: expected =
  -- opening + receipts - deliveries - known losses; the closing dip is the two
  -- standard volumes together; unaccounted = dipped - expected; the tolerance
  -- is the stated percent of receipts plus deliveries.
  v_s_okomu_t1_gross_m3 := ((select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'dipMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'dipMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'dipMm')::numeric order by 1 asc limit 1) hi) - (select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'waterMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'waterMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'waterMm')::numeric order by 1 asc limit 1) hi));
  v_s_okomu_t1_standard_m3 := (((select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'dipMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'dipMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'dipMm')::numeric order by 1 asc limit 1) hi) - (select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'waterMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'waterMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'waterMm')::numeric order by 1 asc limit 1) hi)) * (v_okomu_t1->>'vcfTyped')::numeric);
  v_s_okomu_t2_standard_m3 := (((select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t2->>'dipMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric <= (v_okomu_t2->>'dipMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric >= (v_okomu_t2->>'dipMm')::numeric order by 1 asc limit 1) hi) - (select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t2->>'waterMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric <= (v_okomu_t2->>'waterMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric >= (v_okomu_t2->>'waterMm')::numeric order by 1 asc limit 1) hi)) * (v_okomu_t2->>'vcfTyped')::numeric);
  v_s_okomu_expected_closing_m3 := ((v_okomu_day->>'openingM3')::numeric + (v_okomu_day->>'receiptsM3')::numeric - (v_okomu_day->>'deliveriesM3')::numeric - (v_okomu_day->>'knownLossM3')::numeric);
  v_s_okomu_unaccounted_m3 := ((((select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'dipMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'dipMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'dipMm')::numeric order by 1 asc limit 1) hi) - (select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t1->>'waterMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric <= (v_okomu_t1->>'waterMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t1_table) e where (e->>'heightMm')::numeric >= (v_okomu_t1->>'waterMm')::numeric order by 1 asc limit 1) hi)) * (v_okomu_t1->>'vcfTyped')::numeric) + (((select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t2->>'dipMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric <= (v_okomu_t2->>'dipMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric >= (v_okomu_t2->>'dipMm')::numeric order by 1 asc limit 1) hi) - (select case when hi.h = lo.h then lo.v else lo.v + ((v_okomu_t2->>'waterMm')::numeric - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end from (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric <= (v_okomu_t2->>'waterMm')::numeric order by 1 desc limit 1) lo, (select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v from jsonb_array_elements(v_okomu_t2_table) e where (e->>'heightMm')::numeric >= (v_okomu_t2->>'waterMm')::numeric order by 1 asc limit 1) hi)) * (v_okomu_t2->>'vcfTyped')::numeric)) - ((v_okomu_day->>'openingM3')::numeric + (v_okomu_day->>'receiptsM3')::numeric - (v_okomu_day->>'deliveriesM3')::numeric - (v_okomu_day->>'knownLossM3')::numeric);
  v_s_okomu_tolerance_m3 := ((v_okomu_day->>'receiptsM3')::numeric + (v_okomu_day->>'deliveriesM3')::numeric)
                            * abs((v_okomu_day->>'tolerancePercentOfThroughput')::numeric) / 100.0;

  -- PROFESSIONAL, OGWASHI. Erlang C by the FACTORIAL form, a different algorithm
  -- from the engine's Erlang B recursion: offered load A = lambda / mu, with
  -- mu = 60 / load minutes a bay an hour; P(wait) = [A^c / c! * c / (c - A)] /
  -- [sum over k < c of A^k / k! + A^c / c! * c / (c - A)]; the mean wait is
  -- P(wait) / (c mu - lambda) hours, in minutes.
  v_mu := 60.0 / (v_ogwashi_rack->>'loadMinutes')::numeric;
  v_a := (v_ogwashi_rack->>'arrivalsPerHour')::numeric / v_mu;
  v_c := ((v_ogwashi_rack->>'bays')::numeric)::int;
  v_s := 0;
  for v_k in 0 .. v_c - 1 loop
    v_s := v_s + power(v_a, v_k) / factorial(v_k);
  end loop;
  v_t := power(v_a, v_c) / factorial(v_c) * v_c / (v_c - v_a);
  v_s_ogwashi_rack_probability_of_waiting := v_t / (v_s + v_t);
  v_s_ogwashi_rack_mean_wait_min := v_s_ogwashi_rack_probability_of_waiting
                                    / (v_c * v_mu - (v_ogwashi_rack->>'arrivalsPerHour')::numeric) * 60.0;

  -- Pumpable stock is tank by tank: a tank below its heel lends nothing to
  -- another. Days of cover are that stock over the LIFTINGS.
  select sum(greatest(0, (t->>'stockM3')::numeric - (t->>'heelM3')::numeric))
    into v_s_ogwashi_pumpable_stock_m3 from jsonb_array_elements(v_ogwashi_tanks) t;
  v_s_ogwashi_days_of_cover := v_s_ogwashi_pumpable_stock_m3 / (v_ogwashi_liftings_m3 #>> '{}')::numeric;

  -- The lane. The cycle is the round trip at the average speed plus loading,
  -- discharge and queueing; the trips a truck makes a day are the working hours
  -- over the cycle; depreciation is spread over the trips a year the cycle
  -- gives; the trip costs diesel on the round trip, the driver, maintenance and
  -- tyres on the round trip, tolls and levies, overhead and depreciation; the
  -- litres delivered are the payload less the transit loss; the engine rounds
  -- the cost per litre to six decimals and the trips a day to six, and the fleet
  -- is the ceiling of the trips needed over those trips.
  v_cycle := 2 * (v_ogwashi_lane->>'distanceKm')::numeric / (v_ogwashi_lane->>'averageSpeedKmh')::numeric + (v_ogwashi_lane->>'loadHours')::numeric + (v_ogwashi_lane->>'dischargeHours')::numeric + (v_ogwashi_lane->>'queueHours')::numeric;
  v_trips_day := (v_ogwashi_lane->>'workingHoursPerDay')::numeric / v_cycle;
  v_trips_year := v_trips_day * (v_ogwashi_lane->>'workingDaysPerYear')::numeric;
  v_cost := (v_ogwashi_lane->>'fuelConsumptionLPer100Km')::numeric / 100.0 * 2 * (v_ogwashi_lane->>'distanceKm')::numeric * (v_ogwashi_lane->>'dieselPricePerLitre')::numeric
            + (v_ogwashi_lane->>'driverCostPerTrip')::numeric
            + ((v_ogwashi_lane->>'maintenancePerKm')::numeric + (v_ogwashi_lane->>'tyresPerKm')::numeric) * 2 * (v_ogwashi_lane->>'distanceKm')::numeric
            + (v_ogwashi_lane->>'tollsAndLeviesPerTrip')::numeric + (v_ogwashi_lane->>'overheadPerTrip')::numeric
            + (v_ogwashi_lane->>'truckCapitalCost')::numeric / ((v_ogwashi_lane->>'truckLifeYears')::numeric * v_trips_year);
  v_deliv := (v_ogwashi_lane->>'payloadLitres')::numeric * (1 - (v_ogwashi_lane->>'transitLossPercent')::numeric / 100.0);
  v_s_ogwashi_cost_per_litre_delivered_ngn := round(v_cost / v_deliv, 6);
  v_s_ogwashi_trucks_required := ceil(((v_ogwashi_demand_l_per_day #>> '{}')::numeric / (v_ogwashi_lane->>'payloadLitres')::numeric) / round(v_trips_day, 6));

  -- EXPERT, ORON. The cargo every way at the engine's roundings (m3 to four,
  -- litres to two, tonnes to four); FOB on the tonnes; freight builds C&F;
  -- insurance quoted on CIF is part of the value it is charged on, so CIF =
  -- C&F / (1 - the CIF rates); every landed line on its own basis, the
  -- percent-of-CIF lines on that CIF; the cost per litre sold is the total over
  -- the OUTTURN litres (the bill of lading less the ocean loss), in naira at the
  -- exchange rate, to four decimals as the app carries it.
  v_m3 := (v_oron_cargo->>'quantity')::numeric * 1000.0 / (v_oron_cargo->>'densityKgM3')::numeric;
  v_q_m3 := round(v_m3, 4);
  v_q_l := round(v_m3 * 1000, 2);
  v_q_t := round(v_m3 * (v_oron_cargo->>'densityKgM3')::numeric / 1000.0, 4);
  v_fob := (v_oron_cargo->>'fobPrice')::numeric * v_q_t;
  v_cf := v_fob; v_cif := v_fob; v_run := v_fob;
  for v_e in select e from jsonb_array_elements(v_import_template) e where e->>'stage' = 'freight' loop
    v_basis := (case when v_e->>'id' = 'insurance' then v_oron_insurance_basis #>> '{}' else v_e->>'basis' end); v_rate := (v_oron_rates->>(v_e->>'id'))::numeric;
    v_run := v_run + (case v_basis when 'per_tonne' then v_rate * v_q_t when 'per_m3' then v_rate * v_q_m3 when 'per_litre' then v_rate * v_q_l when 'per_cargo' then v_rate when 'percent_of_fob' then v_rate / 100.0 * v_fob when 'percent_of_cf' then v_rate / 100.0 * v_cf when 'percent_of_cif' then v_rate / 100.0 * v_cif end);
  end loop;
  v_cf := v_run; v_cif := v_run;
  v_sum_cif := 0;
  for v_e in select e from jsonb_array_elements(v_import_template) e where e->>'stage' = 'insurance' loop
    v_basis := (case when v_e->>'id' = 'insurance' then v_oron_insurance_basis #>> '{}' else v_e->>'basis' end); v_rate := (v_oron_rates->>(v_e->>'id'))::numeric;
    if v_basis = 'percent_of_cif' then
      v_sum_cif := v_sum_cif + v_rate / 100.0;
    else
      v_run := v_run + (case v_basis when 'per_tonne' then v_rate * v_q_t when 'per_m3' then v_rate * v_q_m3 when 'per_litre' then v_rate * v_q_l when 'per_cargo' then v_rate when 'percent_of_fob' then v_rate / 100.0 * v_fob when 'percent_of_cf' then v_rate / 100.0 * v_cf when 'percent_of_cif' then v_rate / 100.0 * v_cif end);
    end if;
  end loop;
  v_run := v_run / (1 - v_sum_cif);
  v_cif := v_run;
  for v_e in select e from jsonb_array_elements(v_import_template) e where coalesce(e->>'stage', 'landed') = 'landed' loop
    v_basis := (case when v_e->>'id' = 'insurance' then v_oron_insurance_basis #>> '{}' else v_e->>'basis' end); v_rate := (v_oron_rates->>(v_e->>'id'))::numeric;
    v_run := v_run + (case v_basis when 'per_tonne' then v_rate * v_q_t when 'per_m3' then v_rate * v_q_m3 when 'per_litre' then v_rate * v_q_l when 'per_cargo' then v_rate when 'percent_of_fob' then v_rate / 100.0 * v_fob when 'percent_of_cf' then v_rate / 100.0 * v_cf when 'percent_of_cif' then v_rate / 100.0 * v_cif end);
  end loop;
  v_s_oron_cif_usd := v_cif;
  v_s_oron_landed_total_usd := v_run;
  v_outturn := v_q_l * (1 - (v_oron_cargo->>'oceanLossPercent')::numeric / 100.0);
  v_landed := round(v_run / v_outturn * (v_oron_cargo->>'fxRate')::numeric, 4);
  v_s_oron_landed_per_litre_ngn := v_landed;

  -- The pump build-up starts from that landed cost per litre and adds each
  -- element in order: a per-litre element as it stands, a percent-of-running
  -- element on everything below it. The engine rounds each line to four
  -- decimals and the price to four, and the Government share is the sum of the
  -- rounded Government lines.
  v_run := v_landed; v_gov := 0;
  for v_e in select e from jsonb_array_elements(v_pump_template) e loop
    v_rate := (v_oron_elements->>(v_e->>'id'))::numeric;
    v_line := case v_e->>'basis' when 'percent_of_running' then v_rate / 100.0 * v_run
                                 when 'percent_of_landed' then v_rate / 100.0 * v_landed
                                 else v_rate end;
    v_run := v_run + v_line;
    if v_e->>'recipient' = 'Government' then v_gov := v_gov + round(v_line, 4); end if;
  end loop;
  v_s_oron_pump_price_ngn := round(v_run, 4);
  v_s_oron_government_share_ngn := round(v_gov, 4);

  if v_s_okomu_t1_gross_m3 is null or abs(v_s_okomu_t1_gross_m3 - v_g_okomu_t1_gross_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_t1_gross_m3]', v_s_okomu_t1_gross_m3, v_g_okomu_t1_gross_m3;
  end if;
  if abs(v_s_okomu_t1_gross_m3 - v_g_okomu_t1_gross_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_t1_gross_m3 - v_g_okomu_t1_gross_m3) / 0.01; v_worst_key := 'beginner/okomu_t1_gross_m3';
  end if;
  if v_s_okomu_t1_standard_m3 is null or abs(v_s_okomu_t1_standard_m3 - v_g_okomu_t1_standard_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_t1_standard_m3]', v_s_okomu_t1_standard_m3, v_g_okomu_t1_standard_m3;
  end if;
  if abs(v_s_okomu_t1_standard_m3 - v_g_okomu_t1_standard_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_t1_standard_m3 - v_g_okomu_t1_standard_m3) / 0.01; v_worst_key := 'beginner/okomu_t1_standard_m3';
  end if;
  if v_s_okomu_t2_standard_m3 is null or abs(v_s_okomu_t2_standard_m3 - v_g_okomu_t2_standard_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_t2_standard_m3]', v_s_okomu_t2_standard_m3, v_g_okomu_t2_standard_m3;
  end if;
  if abs(v_s_okomu_t2_standard_m3 - v_g_okomu_t2_standard_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_t2_standard_m3 - v_g_okomu_t2_standard_m3) / 0.01; v_worst_key := 'beginner/okomu_t2_standard_m3';
  end if;
  if v_s_okomu_expected_closing_m3 is null or abs(v_s_okomu_expected_closing_m3 - v_g_okomu_expected_closing_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_expected_closing_m3]', v_s_okomu_expected_closing_m3, v_g_okomu_expected_closing_m3;
  end if;
  if abs(v_s_okomu_expected_closing_m3 - v_g_okomu_expected_closing_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_expected_closing_m3 - v_g_okomu_expected_closing_m3) / 0.01; v_worst_key := 'beginner/okomu_expected_closing_m3';
  end if;
  if v_s_okomu_unaccounted_m3 is null or abs(v_s_okomu_unaccounted_m3 - v_g_okomu_unaccounted_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_unaccounted_m3]', v_s_okomu_unaccounted_m3, v_g_okomu_unaccounted_m3;
  end if;
  if abs(v_s_okomu_unaccounted_m3 - v_g_okomu_unaccounted_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_unaccounted_m3 - v_g_okomu_unaccounted_m3) / 0.01; v_worst_key := 'beginner/okomu_unaccounted_m3';
  end if;
  if v_s_okomu_tolerance_m3 is null or abs(v_s_okomu_tolerance_m3 - v_g_okomu_tolerance_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: beginner/okomu_tolerance_m3]', v_s_okomu_tolerance_m3, v_g_okomu_tolerance_m3;
  end if;
  if abs(v_s_okomu_tolerance_m3 - v_g_okomu_tolerance_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_okomu_tolerance_m3 - v_g_okomu_tolerance_m3) / 0.01; v_worst_key := 'beginner/okomu_tolerance_m3';
  end if;
  if v_s_ogwashi_rack_probability_of_waiting is null or abs(v_s_ogwashi_rack_probability_of_waiting - v_g_ogwashi_rack_probability_of_waiting) > 0.0001 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/ogwashi_rack_probability_of_waiting]', v_s_ogwashi_rack_probability_of_waiting, v_g_ogwashi_rack_probability_of_waiting;
  end if;
  if abs(v_s_ogwashi_rack_probability_of_waiting - v_g_ogwashi_rack_probability_of_waiting) / 0.0001 > v_worst then
    v_worst := abs(v_s_ogwashi_rack_probability_of_waiting - v_g_ogwashi_rack_probability_of_waiting) / 0.0001; v_worst_key := 'intermediate/ogwashi_rack_probability_of_waiting';
  end if;
  if v_s_ogwashi_rack_mean_wait_min is null or abs(v_s_ogwashi_rack_mean_wait_min - v_g_ogwashi_rack_mean_wait_min) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_rack_mean_wait_min]', v_s_ogwashi_rack_mean_wait_min, v_g_ogwashi_rack_mean_wait_min;
  end if;
  if abs(v_s_ogwashi_rack_mean_wait_min - v_g_ogwashi_rack_mean_wait_min) / 0.01 > v_worst then
    v_worst := abs(v_s_ogwashi_rack_mean_wait_min - v_g_ogwashi_rack_mean_wait_min) / 0.01; v_worst_key := 'intermediate/ogwashi_rack_mean_wait_min';
  end if;
  if v_s_ogwashi_pumpable_stock_m3 is null or abs(v_s_ogwashi_pumpable_stock_m3 - v_g_ogwashi_pumpable_stock_m3) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_pumpable_stock_m3]', v_s_ogwashi_pumpable_stock_m3, v_g_ogwashi_pumpable_stock_m3;
  end if;
  if abs(v_s_ogwashi_pumpable_stock_m3 - v_g_ogwashi_pumpable_stock_m3) / 0.01 > v_worst then
    v_worst := abs(v_s_ogwashi_pumpable_stock_m3 - v_g_ogwashi_pumpable_stock_m3) / 0.01; v_worst_key := 'intermediate/ogwashi_pumpable_stock_m3';
  end if;
  if v_s_ogwashi_days_of_cover is null or abs(v_s_ogwashi_days_of_cover - v_g_ogwashi_days_of_cover) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_days_of_cover]', v_s_ogwashi_days_of_cover, v_g_ogwashi_days_of_cover;
  end if;
  if abs(v_s_ogwashi_days_of_cover - v_g_ogwashi_days_of_cover) / 0.01 > v_worst then
    v_worst := abs(v_s_ogwashi_days_of_cover - v_g_ogwashi_days_of_cover) / 0.01; v_worst_key := 'intermediate/ogwashi_days_of_cover';
  end if;
  if v_s_ogwashi_cost_per_litre_delivered_ngn is null or abs(v_s_ogwashi_cost_per_litre_delivered_ngn - v_g_ogwashi_cost_per_litre_delivered_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: intermediate/ogwashi_cost_per_litre_delivered_ngn]', v_s_ogwashi_cost_per_litre_delivered_ngn, v_g_ogwashi_cost_per_litre_delivered_ngn;
  end if;
  if abs(v_s_ogwashi_cost_per_litre_delivered_ngn - v_g_ogwashi_cost_per_litre_delivered_ngn) / 0.0001 > v_worst then
    v_worst := abs(v_s_ogwashi_cost_per_litre_delivered_ngn - v_g_ogwashi_cost_per_litre_delivered_ngn) / 0.0001; v_worst_key := 'intermediate/ogwashi_cost_per_litre_delivered_ngn';
  end if;
  if v_s_ogwashi_trucks_required is null or abs(v_s_ogwashi_trucks_required - v_g_ogwashi_trucks_required) > 0.5 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.5 of the seeded % [graded field: intermediate/ogwashi_trucks_required]', v_s_ogwashi_trucks_required, v_g_ogwashi_trucks_required;
  end if;
  if abs(v_s_ogwashi_trucks_required - v_g_ogwashi_trucks_required) / 0.5 > v_worst then
    v_worst := abs(v_s_ogwashi_trucks_required - v_g_ogwashi_trucks_required) / 0.5; v_worst_key := 'intermediate/ogwashi_trucks_required';
  end if;
  if v_s_oron_cif_usd is null or abs(v_s_oron_cif_usd - v_g_oron_cif_usd) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/oron_cif_usd]', v_s_oron_cif_usd, v_g_oron_cif_usd;
  end if;
  if abs(v_s_oron_cif_usd - v_g_oron_cif_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_oron_cif_usd - v_g_oron_cif_usd) / 0.01; v_worst_key := 'advanced/oron_cif_usd';
  end if;
  if v_s_oron_landed_total_usd is null or abs(v_s_oron_landed_total_usd - v_g_oron_landed_total_usd) > 0.01 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.01 of the seeded % [graded field: advanced/oron_landed_total_usd]', v_s_oron_landed_total_usd, v_g_oron_landed_total_usd;
  end if;
  if abs(v_s_oron_landed_total_usd - v_g_oron_landed_total_usd) / 0.01 > v_worst then
    v_worst := abs(v_s_oron_landed_total_usd - v_g_oron_landed_total_usd) / 0.01; v_worst_key := 'advanced/oron_landed_total_usd';
  end if;
  if v_s_oron_landed_per_litre_ngn is null or abs(v_s_oron_landed_per_litre_ngn - v_g_oron_landed_per_litre_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/oron_landed_per_litre_ngn]', v_s_oron_landed_per_litre_ngn, v_g_oron_landed_per_litre_ngn;
  end if;
  if abs(v_s_oron_landed_per_litre_ngn - v_g_oron_landed_per_litre_ngn) / 0.0001 > v_worst then
    v_worst := abs(v_s_oron_landed_per_litre_ngn - v_g_oron_landed_per_litre_ngn) / 0.0001; v_worst_key := 'advanced/oron_landed_per_litre_ngn';
  end if;
  if v_s_oron_pump_price_ngn is null or abs(v_s_oron_pump_price_ngn - v_g_oron_pump_price_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/oron_pump_price_ngn]', v_s_oron_pump_price_ngn, v_g_oron_pump_price_ngn;
  end if;
  if abs(v_s_oron_pump_price_ngn - v_g_oron_pump_price_ngn) / 0.0001 > v_worst then
    v_worst := abs(v_s_oron_pump_price_ngn - v_g_oron_pump_price_ngn) / 0.0001; v_worst_key := 'advanced/oron_pump_price_ngn';
  end if;
  if v_s_oron_government_share_ngn is null or abs(v_s_oron_government_share_ngn - v_g_oron_government_share_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within 0.0001 of the seeded % [graded field: advanced/oron_government_share_ngn]', v_s_oron_government_share_ngn, v_g_oron_government_share_ngn;
  end if;
  if abs(v_s_oron_government_share_ngn - v_g_oron_government_share_ngn) / 0.0001 > v_worst then
    v_worst := abs(v_s_oron_government_share_ngn - v_g_oron_government_share_ngn) / 0.0001; v_worst_key := 'advanced/oron_government_share_ngn';
  end if;
  raise notice 'supply go-live: second route in SQL, 17 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated. The value and the
  -- oracle function it came from are written in; oron_breakeven_fx has no
  -- other second route.
  v_worst := 0; v_worst_key := '(none)';
  -- okomu_t1_gross_m3: oracle_terminaldepot.interp
  if abs(2253.615395 - v_g_okomu_t1_gross_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 2253.615395, not within 0.01 of the seeded % [graded field: beginner/okomu_t1_gross_m3]', v_g_okomu_t1_gross_m3;
  end if;
  if abs(2253.615395 - v_g_okomu_t1_gross_m3) / 0.01 > v_worst then
    v_worst := abs(2253.615395 - v_g_okomu_t1_gross_m3) / 0.01; v_worst_key := 'beginner/okomu_t1_gross_m3';
  end if;
  -- okomu_t1_standard_m3: oracle_terminaldepot.interp x the typed VCF
  if abs(2223.867671786 - v_g_okomu_t1_standard_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 2223.867671786, not within 0.01 of the seeded % [graded field: beginner/okomu_t1_standard_m3]', v_g_okomu_t1_standard_m3;
  end if;
  if abs(2223.867671786 - v_g_okomu_t1_standard_m3) / 0.01 > v_worst then
    v_worst := abs(2223.867671786 - v_g_okomu_t1_standard_m3) / 0.01; v_worst_key := 'beginner/okomu_t1_standard_m3';
  end if;
  -- okomu_t2_standard_m3: oracle_terminaldepot.interp x the typed VCF
  if abs(95.360486872 - v_g_okomu_t2_standard_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 95.360486872, not within 0.01 of the seeded % [graded field: beginner/okomu_t2_standard_m3]', v_g_okomu_t2_standard_m3;
  end if;
  if abs(95.360486872 - v_g_okomu_t2_standard_m3) / 0.01 > v_worst then
    v_worst := abs(95.360486872 - v_g_okomu_t2_standard_m3) / 0.01; v_worst_key := 'beginner/okomu_t2_standard_m3';
  end if;
  -- okomu_expected_closing_m3: oracle_terminaldepot.day_ledger
  if abs(2324.45 - v_g_okomu_expected_closing_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 2324.45, not within 0.01 of the seeded % [graded field: beginner/okomu_expected_closing_m3]', v_g_okomu_expected_closing_m3;
  end if;
  if abs(2324.45 - v_g_okomu_expected_closing_m3) / 0.01 > v_worst then
    v_worst := abs(2324.45 - v_g_okomu_expected_closing_m3) / 0.01; v_worst_key := 'beginner/okomu_expected_closing_m3';
  end if;
  -- okomu_unaccounted_m3: oracle_terminaldepot.day_ledger on the interp stocks
  if abs(-5.221841342000062 - v_g_okomu_unaccounted_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives -5.221841342000062, not within 0.01 of the seeded % [graded field: beginner/okomu_unaccounted_m3]', v_g_okomu_unaccounted_m3;
  end if;
  if abs(-5.221841342000062 - v_g_okomu_unaccounted_m3) / 0.01 > v_worst then
    v_worst := abs(-5.221841342000062 - v_g_okomu_unaccounted_m3) / 0.01; v_worst_key := 'beginner/okomu_unaccounted_m3';
  end if;
  -- okomu_tolerance_m3: oracle_terminaldepot.day_ledger tolerance rule
  if abs(4.55868 - v_g_okomu_tolerance_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 4.55868, not within 0.01 of the seeded % [graded field: beginner/okomu_tolerance_m3]', v_g_okomu_tolerance_m3;
  end if;
  if abs(4.55868 - v_g_okomu_tolerance_m3) / 0.01 > v_worst then
    v_worst := abs(4.55868 - v_g_okomu_tolerance_m3) / 0.01; v_worst_key := 'beginner/okomu_tolerance_m3';
  end if;
  -- ogwashi_rack_probability_of_waiting: oracle_terminaldepot.erlang_exact
  if abs(0.6366683941275079 - v_g_ogwashi_rack_probability_of_waiting) > 0.0001 then
    raise exception 'supply go-live refused: the oracle gives 0.6366683941275079, not within 0.0001 of the seeded % [graded field: intermediate/ogwashi_rack_probability_of_waiting]', v_g_ogwashi_rack_probability_of_waiting;
  end if;
  if abs(0.6366683941275079 - v_g_ogwashi_rack_probability_of_waiting) / 0.0001 > v_worst then
    v_worst := abs(0.6366683941275079 - v_g_ogwashi_rack_probability_of_waiting) / 0.0001; v_worst_key := 'intermediate/ogwashi_rack_probability_of_waiting';
  end if;
  -- ogwashi_rack_mean_wait_min: oracle_terminaldepot.erlang_exact
  if abs(17.73576240783772 - v_g_ogwashi_rack_mean_wait_min) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 17.73576240783772, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_rack_mean_wait_min]', v_g_ogwashi_rack_mean_wait_min;
  end if;
  if abs(17.73576240783772 - v_g_ogwashi_rack_mean_wait_min) / 0.01 > v_worst then
    v_worst := abs(17.73576240783772 - v_g_ogwashi_rack_mean_wait_min) / 0.01; v_worst_key := 'intermediate/ogwashi_rack_mean_wait_min';
  end if;
  -- ogwashi_pumpable_stock_m3: oracle_terminaldepot.farm_cover
  if abs(5729.4 - v_g_ogwashi_pumpable_stock_m3) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 5729.4, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_pumpable_stock_m3]', v_g_ogwashi_pumpable_stock_m3;
  end if;
  if abs(5729.4 - v_g_ogwashi_pumpable_stock_m3) / 0.01 > v_worst then
    v_worst := abs(5729.4 - v_g_ogwashi_pumpable_stock_m3) / 0.01; v_worst_key := 'intermediate/ogwashi_pumpable_stock_m3';
  end if;
  -- ogwashi_days_of_cover: oracle_terminaldepot.farm_cover
  if abs(3.2553409090909087 - v_g_ogwashi_days_of_cover) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 3.2553409090909087, not within 0.01 of the seeded % [graded field: intermediate/ogwashi_days_of_cover]', v_g_ogwashi_days_of_cover;
  end if;
  if abs(3.2553409090909087 - v_g_ogwashi_days_of_cover) / 0.01 > v_worst then
    v_worst := abs(3.2553409090909087 - v_g_ogwashi_days_of_cover) / 0.01; v_worst_key := 'intermediate/ogwashi_days_of_cover';
  end if;
  -- ogwashi_cost_per_litre_delivered_ngn: oracle_fuelpricing.lane_ledger
  if abs(12.093276096083287 - v_g_ogwashi_cost_per_litre_delivered_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the oracle gives 12.093276096083287, not within 0.0001 of the seeded % [graded field: intermediate/ogwashi_cost_per_litre_delivered_ngn]', v_g_ogwashi_cost_per_litre_delivered_ngn;
  end if;
  if abs(12.093276096083287 - v_g_ogwashi_cost_per_litre_delivered_ngn) / 0.0001 > v_worst then
    v_worst := abs(12.093276096083287 - v_g_ogwashi_cost_per_litre_delivered_ngn) / 0.0001; v_worst_key := 'intermediate/ogwashi_cost_per_litre_delivered_ngn';
  end if;
  -- ogwashi_trucks_required: oracle_fuelpricing.fleet_search
  if abs(67.0 - v_g_ogwashi_trucks_required) > 0.5 then
    raise exception 'supply go-live refused: the oracle gives 67.0, not within 0.5 of the seeded % [graded field: intermediate/ogwashi_trucks_required]', v_g_ogwashi_trucks_required;
  end if;
  if abs(67.0 - v_g_ogwashi_trucks_required) / 0.5 > v_worst then
    v_worst := abs(67.0 - v_g_ogwashi_trucks_required) / 0.5; v_worst_key := 'intermediate/ogwashi_trucks_required';
  end if;
  -- oron_cif_usd: oracle_fuelpricing.invoice, insurance by fixed point
  if abs(22094815.92787378 - v_g_oron_cif_usd) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 22094815.92787378, not within 0.01 of the seeded % [graded field: advanced/oron_cif_usd]', v_g_oron_cif_usd;
  end if;
  if abs(22094815.92787378 - v_g_oron_cif_usd) / 0.01 > v_worst then
    v_worst := abs(22094815.92787378 - v_g_oron_cif_usd) / 0.01; v_worst_key := 'advanced/oron_cif_usd';
  end if;
  -- oron_landed_total_usd: oracle_fuelpricing.invoice
  if abs(24063059.781734176 - v_g_oron_landed_total_usd) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 24063059.781734176, not within 0.01 of the seeded % [graded field: advanced/oron_landed_total_usd]', v_g_oron_landed_total_usd;
  end if;
  if abs(24063059.781734176 - v_g_oron_landed_total_usd) / 0.01 > v_worst then
    v_worst := abs(24063059.781734176 - v_g_oron_landed_total_usd) / 0.01; v_worst_key := 'advanced/oron_landed_total_usd';
  end if;
  -- oron_landed_per_litre_ngn: oracle_fuelpricing.invoice over outturn litres
  if abs(1056.482999987048 - v_g_oron_landed_per_litre_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the oracle gives 1056.482999987048, not within 0.0001 of the seeded % [graded field: advanced/oron_landed_per_litre_ngn]', v_g_oron_landed_per_litre_ngn;
  end if;
  if abs(1056.482999987048 - v_g_oron_landed_per_litre_ngn) / 0.0001 > v_worst then
    v_worst := abs(1056.482999987048 - v_g_oron_landed_per_litre_ngn) / 0.0001; v_worst_key := 'advanced/oron_landed_per_litre_ngn';
  end if;
  -- oron_pump_price_ngn: oracle_fuelpricing.pump
  if abs(1243.721565 - v_g_oron_pump_price_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the oracle gives 1243.721565, not within 0.0001 of the seeded % [graded field: advanced/oron_pump_price_ngn]', v_g_oron_pump_price_ngn;
  end if;
  if abs(1243.721565 - v_g_oron_pump_price_ngn) / 0.0001 > v_worst then
    v_worst := abs(1243.721565 - v_g_oron_pump_price_ngn) / 0.0001; v_worst_key := 'advanced/oron_pump_price_ngn';
  end if;
  -- oron_government_share_ngn: oracle_fuelpricing.pump byRecipient Government
  if abs(73.23856500000001 - v_g_oron_government_share_ngn) > 0.0001 then
    raise exception 'supply go-live refused: the oracle gives 73.23856500000001, not within 0.0001 of the seeded % [graded field: advanced/oron_government_share_ngn]', v_g_oron_government_share_ngn;
  end if;
  if abs(73.23856500000001 - v_g_oron_government_share_ngn) / 0.0001 > v_worst then
    v_worst := abs(73.23856500000001 - v_g_oron_government_share_ngn) / 0.0001; v_worst_key := 'advanced/oron_government_share_ngn';
  end if;
  -- oron_breakeven_fx: closed form on oracle_fuelpricing.invoice and pump
  if abs(1682.8322242752943 - v_g_oron_breakeven_fx) > 0.01 then
    raise exception 'supply go-live refused: the oracle gives 1682.8322242752943, not within 0.01 of the seeded % [graded field: advanced/oron_breakeven_fx]', v_g_oron_breakeven_fx;
  end if;
  if abs(1682.8322242752943 - v_g_oron_breakeven_fx) / 0.01 > v_worst then
    v_worst := abs(1682.8322242752943 - v_g_oron_breakeven_fx) / 0.01; v_worst_key := 'advanced/oron_breakeven_fx';
  end if;
  raise notice 'supply go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;

  -- ------------------------------------------------- 4. the traps bite
  -- Each is the wrong route discriminate.mjs swept through the engine that
  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or
  -- the field does not discriminate the trap it is for.
  if abs(2243.5617549999997 - v_g_okomu_t1_gross_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (dip read at the entry below) reads 2243.5617549999997, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_t1_gross_m3]', v_g_okomu_t1_gross_m3;
  end if;
  if abs(2211.0220640344996 - v_g_okomu_t1_standard_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (the other tanks vcf) reads 2211.0220640344996, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_t1_standard_m3]', v_g_okomu_t1_standard_m3;
  end if;
  if abs(95.53797113390263 - v_g_okomu_t2_standard_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (the bullet geometry instead of the table) reads 95.53797113390263, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_t2_standard_m3]', v_g_okomu_t2_standard_m3;
  end if;
  if abs(2325.85 - v_g_okomu_expected_closing_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (known loss left out) reads 2325.85, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_expected_closing_m3]', v_g_okomu_expected_closing_m3;
  end if;
  if abs(-8.021841342000243 - v_g_okomu_unaccounted_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (known loss added) reads -8.021841342000243, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_unaccounted_m3]', v_g_okomu_unaccounted_m3;
  end if;
  if abs(4.174610685584399 - v_g_okomu_tolerance_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (on the closing stock) reads 4.174610685584399, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okomu_tolerance_m3]', v_g_okomu_tolerance_m3;
  end if;
  if abs(0.8666666666666668 - v_g_ogwashi_rack_probability_of_waiting) <= 0.0001 then
    raise exception 'supply go-live refused: the trap (utilisation read as the probability) reads 0.8666666666666668, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_rack_probability_of_waiting]', v_g_ogwashi_rack_probability_of_waiting;
  end if;
  if abs(16.553378247315216 - v_g_ogwashi_rack_mean_wait_min) <= 0.01 then
    raise exception 'supply go-live refused: the trap (probability times the load time) reads 16.553378247315216, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_rack_mean_wait_min]', v_g_ogwashi_rack_mean_wait_min;
  end if;
  if abs(5608 - v_g_ogwashi_pumpable_stock_m3) <= 0.01 then
    raise exception 'supply go-live refused: the trap (heel netted across the farm) reads 5608, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_pumpable_stock_m3]', v_g_ogwashi_pumpable_stock_m3;
  end if;
  if abs(3.1863636363636365 - v_g_ogwashi_days_of_cover) <= 0.01 then
    raise exception 'supply go-live refused: the trap (heel netted across the farm) reads 3.1863636363636365, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_days_of_cover]', v_g_ogwashi_days_of_cover;
  end if;
  if abs(12.063042857142857 - v_g_ogwashi_cost_per_litre_delivered_ngn) <= 0.0001 then
    raise exception 'supply go-live refused: the trap (divided by the payload loaded) reads 12.063042857142857, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_cost_per_litre_delivered_ngn]', v_g_ogwashi_cost_per_litre_delivered_ngn;
  end if;
  if abs(66 - v_g_ogwashi_trucks_required) <= 0.5 then
    raise exception 'supply go-live refused: the trap (trips rounded down) reads 66, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogwashi_trucks_required]', v_g_ogwashi_trucks_required;
  end if;
  if abs(22094748.26 - v_g_oron_cif_usd) <= 0.01 then
    raise exception 'supply go-live refused: the trap (insurance on c and f) reads 22094748.26, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_cif_usd]', v_g_oron_cif_usd;
  end if;
  if abs(24062987.04 - v_g_oron_landed_total_usd) <= 0.01 then
    raise exception 'supply go-live refused: the trap (insurance on c and f) reads 24062987.04, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_landed_total_usd]', v_g_oron_landed_total_usd;
  end if;
  if abs(1056.4798 - v_g_oron_landed_per_litre_ngn) <= 0.0001 then
    raise exception 'supply go-live refused: the trap (insurance on c and f) reads 1056.4798, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_landed_per_litre_ngn]', v_g_oron_landed_per_litre_ngn;
  end if;
  if abs(1243.708 - v_g_oron_pump_price_ngn) <= 0.0001 then
    raise exception 'supply go-live refused: the trap (ocean loss added upstream) reads 1243.708, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_pump_price_ngn]', v_g_oron_pump_price_ngn;
  end if;
  if abs(66.5066 - v_g_oron_government_share_ngn) <= 0.0001 then
    raise exception 'supply go-live refused: the trap (vat on the landed cost only) reads 66.5066, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_government_share_ngn]', v_g_oron_government_share_ngn;
  end if;
  if abs(1700 - v_g_oron_breakeven_fx) <= 0.01 then
    raise exception 'supply go-live refused: the trap (the first rate in the table the cap fails) reads 1700, inside the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/oron_breakeven_fx]', v_g_oron_breakeven_fx;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'supply';
  if not exists (select 1 from public.academy_apps where slug = 'supply' and status = 'available') then
    raise exception 'supply go-live refused: supply did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'supply go-live: supply available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
