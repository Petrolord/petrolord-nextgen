-- ============================================================================
-- FC8 GO-LIVE (HELD): Metering, Control Valves & Storage flips to 'available',
-- a Facilities course at path_order 46.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/metering. The 78 lessons, the teaching lab
-- (meteringLab.js) and its four explorer panels (the meter run, the choking,
-- the venting and the withheld) ship in the ZIP and NOT in this database, so a
-- flip before the upload puts a live catalogue tile in front of a route that
-- does not exist. Every Facilities and Drilling wave on this programme has held
-- its go-live behind one verified upload, and this file is written, dry-run and
-- left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and a Python check proving the same identity cannot
-- see it. The generator that wrote this file refuses to emit a division with a
-- bare integer denominator, and refuses a malformed numeric literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE ASSERTED BY EXACT CLOSED FORM from the
-- conditions the prompts state. The two the capstone generator BISECTS on a
-- word the engine returns, the gravity at which the water test takes the
-- bottom course and the draw rate at which vacuum takes the venting case, are
-- ALSO asserted as the roots they are: the two thicknesses meet at the graded
-- gravity, and the two venting totals meet at the graded draw rate.
--
-- AND ELEVEN ARE ASSERTED A SECOND TIME, by a route with nothing in common
-- with the first, because a gate that restates the formula validates nothing:
--
--   * the transmitter percent of reading against the graded flow turndown,
--     which is the same rule written in two quantities;
--   * the total uncertainty against the bounds of its own six contributions;
--   * the gross turbine volume multiplied back out to the pulse count;
--   * the valve coefficient squared back out to the stated flow;
--   * sigma multiplied back out to the inlet less the vapour pressure;
--   * the normal travel inverted through the characteristic to the required
--     coefficient;
--   * the two roots above; and the working capacity as a fraction of the
--     nominal, which is the level over the shell and nothing else;
--   * and the capstones' own premises: the valve IS choked, the meter run IS
--     inside its turndown limit and its proving screen, the tank IS below its
--     stated proportional limit and on the pressure side at its stated draw.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message, so a reader is never left looking at the trusting half of a
-- disagreeing pair.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_names text;
  v_b4 double precision; v_total double precision; v_lever double precision;
  v_tdesign double precision; v_ttest double precision;
  v_nominal double precision; v_thermal double precision;
  v_in double precision; v_out double precision;
  v_g_krakama_beta_ratio double precision;
  v_g_krakama_differential_psi double precision;
  v_g_krakama_transmitter_uncertainty_pct double precision;
  v_g_krakama_flow_turndown_ratio double precision;
  v_g_krakama_total_uncertainty_pct double precision;
  v_g_krakama_turbine_gross_bbl double precision;
  v_g_utonana_ff_critical_ratio double precision;
  v_g_utonana_allowable_drop_psi double precision;
  v_g_utonana_liquid_cv double precision;
  v_g_utonana_cavitation_sigma double precision;
  v_g_utonana_valve_authority double precision;
  v_g_utonana_normal_travel_pct double precision;
  v_g_saghara_bottom_course_required_in double precision;
  v_g_saghara_sg_at_which_test_governs double precision;
  v_g_saghara_inbreathing_scfh double precision;
  v_g_saghara_vacuum_governing_draw_bblhr double precision;
  v_g_saghara_working_capacity_bbl double precision;
  v_g_saghara_recovery_saved_lb_yr double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'metering' and active;
  if v_structures <> 3 then
    raise exception 'FC8 go-live refused: metering has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'metering';
  if v_questions <> 396 then
    raise exception 'FC8 go-live refused: metering has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'metering'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'metering' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'metering' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'metering'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'metering';
  if v_capstones <> 3 then
    raise exception 'FC8 go-live refused: metering has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'metering' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC8 go-live refused: metering carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'metering' and s.active;
  if v_modules <> 18 then
    raise exception 'FC8 go-live refused: metering carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner will ever be served.
  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'metering' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'metering';
  if v_graded <> 18 then
    raise exception 'FC8 go-live refused: metering has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'metering' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'metering' and module = 'facilities'
                    and path_order = 46 and prereq_slug is null) then
    raise exception 'FC8 go-live refused: the metering catalogue row is not facilities at path_order 46 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 46 and slug <> 'metering') then
    raise exception 'FC8 go-live refused: another course already holds path_order 46';
  end if;


  -- ------------------------------------------- the held and withheld gates
  -- ON THE NAME. A graded field that NAMES a held, uncited or withheld path is
  -- refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['regime', 'noise', 'band', 'vent_scfh', 'fire', 'emergency', 'straight_run', 'net_standard', 'ctl', 'cpl', 'reynolds_factor', 'verdict', 'characteristic', 'style', 'turnover', 'standing_loss', 'working_loss']) frag
   where c.app_slug = 'metering' and (f->>'key') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) name a held or withheld path: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['regime', 'noise band', 'vent capacity', 'straight run', 'straight-run', 'net standard', 'verdict', 'turnover', 'emergency', 'style table']) frag
   where c.app_slug = 'metering' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field label(s) name a held or withheld path: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a number an engine calls its own
  -- stated data, within its own shipped tolerance, is a lookup of that data.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.05, 0.075, 0.1, 0.15, 0.1875, 0.2, 0.2, 0.25, 0.3, 0.3, 0.338, 0.38, 0.5, 0.55, 0.55, 0.566, 0.6, 0.66, 0.68, 0.72, 0.75, 0.75, 0.8, 0.82, 0.9, 0.9, 0.97, 1.0, 2.0, 2.8, 3.0, 4.0, 5.0, 8.0, 9.0, 10.0, 10.0, 12.0, 13.0, 14.0, 16.0, 18.0, 19.0, 22.0, 24.0, 26.0, 30.0, 36.0, 42.0, 44.0, 60.0, 90.0, 98.0, 200.0, 1000.0, 2800.0, 20000.0, 21000.0, 23200.0, 24900.0, 199300.0, 963400.0], array['the default bore uncertainty', 'the default transmitter accuracy', 'the default pipe uncertainty, and the lower published beta edge', 'a valve style table xT, stated table data', 'the default minimum plate thickness', 'a valve style table xT, stated table data', 'the default expansibility uncertainty', 'the poor authority boundary, a stated screen', 'a valve style table xT, stated table data', 'the default density uncertainty', 'a fire heat input band exponent', 'a valve style table xT, stated table data', 'the good authority boundary, a stated screen', 'a valve style table FL, stated table data', 'a valve style table xT, stated table data', 'a fire heat input band exponent', 'the high beta trade threshold, and the default low-volatility factor', 'a valve style table FL, stated table data', 'a valve style table FL, stated table data', 'a valve style table xT, stated table data', 'a valve style table xT, stated table data', 'the upper published beta edge', 'a valve style table FL, stated table data', 'a fire heat input band exponent', 'a valve style table FL, stated table data', 'a valve style table xT, stated table data', 'a valve style table FL, stated table data', 'the quiet stream power band, 1 kW', 'the cavitating sigma threshold, a stated screen', 'the small bore threshold', 'the incipient sigma threshold, a stated screen', 'the high noise pressure ratio band', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'the differential turndown limit the engine holds', 'a straight-run table value, stated table data', 'the severe noise pressure ratio band', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'the factor between the two withheld vent relations', 'a straight-run table value, stated table data', 'the wetted height cap', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a straight-run table value, stated table data', 'a customary control efficiency, typed rather than computed', 'a customary control efficiency, typed rather than computed', 'a customary control efficiency, typed rather than computed', 'a fire heat input band edge', 'the loud stream power band, 1000 kW', 'a fire heat input band edge', 'the default proportional limit, and a fire band constant', 'a fire heat input band constant', 'the default design allowable stress', 'the default test allowable stress', 'a fire heat input band constant', 'a fire heat input band constant']) as h(val, lab)
   where c.app_slug = 'metering'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) land on a quantity an engine holds or calls its own stated data: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS, at each field's SHIPPED tolerance.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 3.6e-05, 0.001, 0.0013365, 0.00134, 0.005, 0.01, 0.010209, 0.010425, 0.011463, 0.0121, 0.02, 0.027086, 0.0361273, 0.03892, 0.04, 0.04048, 0.042556, 0.048062, 0.05, 0.061253, 0.06255, 0.068449, 0.072666, 0.075, 0.08, 0.083333, 0.084375, 0.1, 0.105732, 0.112297, 0.114632, 0.114676, 0.117555, 0.129233, 0.15, 0.152729, 0.163341, 0.166801, 0.176059, 0.176226, 0.1875, 0.189955, 0.199723, 0.2, 0.208333, 0.214385, 0.218926, 0.234968, 0.235, 0.23511, 0.25, 0.270214, 0.3, 0.306197, 0.333333, 0.35, 0.375, 0.38, 0.397545, 0.4, 0.42, 0.432969, 0.452033, 0.458333, 0.482523, 0.5, 0.549831, 0.55, 0.554475, 0.570278, 0.571236, 0.573965, 0.581059, 0.583333, 0.586772, 0.589541, 0.595385, 0.595531, 0.596108, 0.596125, 0.596209, 0.596214, 0.596243, 0.596272, 0.596382, 0.596626, 0.596784, 0.596849, 0.596906, 0.597067, 0.59711, 0.597614, 0.598299, 0.598697, 0.598718, 0.598908, 0.598985, 0.599062, 0.599138, 0.599531, 0.6, 0.600481, 0.601691, 0.601766, 0.60181, 0.602223, 0.602287, 0.602488, 0.602677, 0.60295, 0.60304, 0.603075, 0.603134, 0.603149, 0.603172, 0.603296, 0.603746, 0.603886, 0.604015, 0.604059, 0.604249, 0.604313, 0.604689, 0.604875, 0.606466, 0.606719, 0.60734, 0.608174, 0.61, 0.611016, 0.612008, 0.613342, 0.614193, 0.61528, 0.615976, 0.621539, 0.626708, 0.629688, 0.63548, 0.641608, 0.643281, 0.646679, 0.65, 0.653961, 0.654638, 0.66, 0.666667, 0.66805, 0.67, 0.67524, 0.68, 0.680357, 0.688654, 0.705281, 0.708333, 0.716484, 0.72, 0.728341, 0.733463, 0.73725, 0.75, 0.757503, 0.781537, 0.785714, 0.787872, 0.797489, 0.8, 0.833333, 0.841, 0.845243, 0.849982, 0.85, 0.857143, 0.862647, 0.878, 0.878493, 0.892161, 0.9, 0.906933, 0.907143, 0.9124, 0.915403, 0.921639, 0.927022, 0.928571, 0.931717, 0.931727, 0.934872, 0.9375, 0.941507, 0.949509, 0.95, 0.953338, 0.953438, 0.9568, 0.95971, 0.96, 0.965716, 0.966464, 0.97, 0.973165, 0.975324, 0.977162, 0.978745, 0.981991, 0.985, 0.986608, 0.987705, 0.988145, 0.988636, 0.989436, 0.99, 0.99107, 0.99331, 0.993863, 0.994331, 0.994733, 0.995, 0.995553, 0.996657, 0.996934, 0.997169, 0.99737, 0.997781, 0.998329, 0.998468, 0.998585, 0.998686, 0.998892, 0.999181, 0.999666, 0.999694, 0.999717, 0.999737, 0.999779, 0.999941, 1.0, 1.000819, 1.0021, 1.003692, 1.005, 1.01, 1.015, 1.021201, 1.04, 1.040462, 1.049, 1.071429, 1.074452, 1.092173, 1.1, 1.107209, 1.122048, 1.15, 1.154701, 1.185714, 1.2, 1.217275, 1.25, 1.27, 1.3, 1.30713, 1.326854, 1.333333, 1.4, 1.414214, 1.593572, 1.60431, 1.66, 1.763636, 1.77, 1.770536, 1.898734, 2.0, 2.00788, 2.040786, 2.067, 2.114632, 2.186003, 2.236068, 2.304922, 2.37, 2.469, 2.6, 2.6178, 2.8, 2.828427, 2.885714, 2.9265, 3.0, 3.068, 3.1, 3.134796, 3.311074, 3.333333, 3.535534, 3.651484, 3.725084, 3.7251, 3.779645, 3.792929, 4.0, 4.026, 4.082483, 4.092988, 4.2, 4.651599, 5.0, 5.614583333333333, 6.0, 6.065, 6.25, 6.324555, 6.664105, 7.0, 7.425, 7.5, 8.0, 9.0, 10.0, 10.02, 10.6, 11.0, 11.111111, 11.847298, 12.0, 12.3, 12.5, 13.0, 14.0, 14.285714, 14.7, 15.0, 15.4, 16.0, 16.666667, 16.862007, 17.0, 17.821626, 17.9, 18.0, 18.06, 18.5, 18.6, 18.750935, 19.0, 19.14848, 19.842638, 20.0, 20.1414, 21.0, 21.909166, 22.0, 22.222222, 23.0, 24.0, 24.79355, 25.0, 26.0, 26.6, 26.74, 27.0, 28.0, 28.74, 28.839688, 29.0, 29.482661, 30.0, 31.0, 32.0, 34.203954, 34.6, 35.0, 35.079209, 36.0, 37.222222, 37.431838, 37.515548, 38.5714, 40.0, 40.174094, 40.4, 42.0, 44.0, 45.995017, 46.0, 46.794924, 46.9, 46.985858, 47.689171, 47.86523, 47.95643, 48.0, 50.0, 50.259168, 54.676029, 55.0, 55.036882, 60.0, 60.414116, 60.822938, 62.198316, 62.4, 63.043643, 63.8, 67.679968, 69.0, 69.644319, 70.0, 74.045614, 74.73777, 75.0, 75.6, 75.887372, 76.614127, 76.871791, 76.9, 78.919821, 80.0, 83.997848, 85.0, 87.419021, 90.0, 95.0, 97.749176, 98.0, 100.0, 106.9, 110.0, 120.0, 136.9, 137.82, 140.0, 150.0, 151.964887, 152.218918, 154.079391, 161.189447, 166.9, 171.3, 174.18, 177.668417, 179.220032, 186.9, 199.0, 200.0, 206.9, 211.406903, 218.16, 226.9, 230.0, 238.0, 250.0, 326.8, 330.485071, 400.0, 500.0, 544.6801, 640.0, 650.0, 762.5522, 815.2, 848.2, 900.0, 999.0, 1000.0, 1083.0319, 1200.0, 1542.8563, 1600.0, 1800.0, 2000.0, 2312.85, 2400.0, 2480.0, 2487.4395, 2799.0, 2800.0, 3058.152, 3065.7864, 3081.3487, 3096.9111, 3112.4735, 3119.0097, 3128.0358, 3143.5982, 3159.1606, 3236.9724, 3537.6108, 3593.3333, 3857.1408, 4200.0, 4902.1211, 5167.0, 5881.0614, 7714.2817, 9398.0952, 11765.0907, 12844.2382, 13924.1667, 14706.3634, 18845.9323, 19285.7042, 19608.4845, 20000.0, 20731.4012, 21854.3178, 23201.8178, 24602.3337, 24622.4751, 24661.6095, 25689.2574, 26345.9845, 27848.3333, 28591.8178, 30857.1267, 33083.4845, 34486.0, 42000.0, 46285.69, 57857.1125, 60534.0, 69428.535, 70067.5951, 73285.6759, 73605.2059, 75599.9604, 77142.8167, 110093.4703, 484000.0, 2117151.4444, 2400000.0, 2640000.0, 3980000.0, 3998437.1717, 3998437.174, 3999999.996, 7723340.1783, 7767732.0754, 9937139.0067, 9942767.8295, 9949623.3831, 9949623.3865, 12136368.3356, 14089282.6074, 14089282.6189, 14089436.422, 14091137.6199, 18124708.1759, 19646433.0614, 25892440.2513]) pub
   where c.app_slug = 'metering'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;

  -- EVERY NUMBER A LEARNER IS HANDED, read by POSTGRES out of the shipped
  -- prompt rather than out of a generator's copy of it.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\.?[0-9]*', 'g') as m
   where c.app_slug = 'metering' and p.app_slug = 'metering'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'metering') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'metering') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'metering') gg
   where c.app_slug = 'metering' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_krakama_beta_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_beta_ratio';
  select (f->>'expected')::double precision into v_g_krakama_differential_psi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_differential_psi';
  select (f->>'expected')::double precision into v_g_krakama_transmitter_uncertainty_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_transmitter_uncertainty_pct';
  select (f->>'expected')::double precision into v_g_krakama_flow_turndown_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_flow_turndown_ratio';
  select (f->>'expected')::double precision into v_g_krakama_total_uncertainty_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_total_uncertainty_pct';
  select (f->>'expected')::double precision into v_g_krakama_turbine_gross_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'beginner' and f->>'key' = 'krakama_turbine_gross_bbl';
  select (f->>'expected')::double precision into v_g_utonana_ff_critical_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_ff_critical_ratio';
  select (f->>'expected')::double precision into v_g_utonana_allowable_drop_psi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_allowable_drop_psi';
  select (f->>'expected')::double precision into v_g_utonana_liquid_cv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_liquid_cv';
  select (f->>'expected')::double precision into v_g_utonana_cavitation_sigma
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_cavitation_sigma';
  select (f->>'expected')::double precision into v_g_utonana_valve_authority
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_valve_authority';
  select (f->>'expected')::double precision into v_g_utonana_normal_travel_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'intermediate' and f->>'key' = 'utonana_normal_travel_pct';
  select (f->>'expected')::double precision into v_g_saghara_bottom_course_required_in
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_bottom_course_required_in';
  select (f->>'expected')::double precision into v_g_saghara_sg_at_which_test_governs
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_sg_at_which_test_governs';
  select (f->>'expected')::double precision into v_g_saghara_inbreathing_scfh
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_inbreathing_scfh';
  select (f->>'expected')::double precision into v_g_saghara_vacuum_governing_draw_bblhr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_vacuum_governing_draw_bblhr';
  select (f->>'expected')::double precision into v_g_saghara_working_capacity_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_working_capacity_bbl';
  select (f->>'expected')::double precision into v_g_saghara_recovery_saved_lb_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'metering' and c.tier = 'advanced' and f->>'key' = 'saghara_recovery_saved_lb_yr';
  if v_g_krakama_beta_ratio is null or v_g_krakama_differential_psi is null or v_g_krakama_transmitter_uncertainty_pct is null or v_g_krakama_flow_turndown_ratio is null or v_g_krakama_total_uncertainty_pct is null or v_g_krakama_turbine_gross_bbl is null or v_g_utonana_ff_critical_ratio is null or v_g_utonana_allowable_drop_psi is null or v_g_utonana_liquid_cv is null or v_g_utonana_cavitation_sigma is null or v_g_utonana_valve_authority is null or v_g_utonana_normal_travel_pct is null or v_g_saghara_bottom_course_required_in is null or v_g_saghara_sg_at_which_test_governs is null or v_g_saghara_inbreathing_scfh is null or v_g_saghara_vacuum_governing_draw_bblhr is null or v_g_saghara_working_capacity_bbl is null or v_g_saghara_recovery_saved_lb_yr is null then
    raise exception 'FC8 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.krakama_beta_ratio, beginner.krakama_differential_psi, beginner.krakama_transmitter_uncertainty_pct, beginner.krakama_flow_turndown_ratio, beginner.krakama_total_uncertainty_pct, beginner.krakama_turbine_gross_bbl, intermediate.utonana_ff_critical_ratio, intermediate.utonana_allowable_drop_psi, intermediate.utonana_liquid_cv, intermediate.utonana_cavitation_sigma, intermediate.utonana_valve_authority, intermediate.utonana_normal_travel_pct, advanced.saghara_bottom_course_required_in, advanced.saghara_sg_at_which_test_governs, advanced.saghara_inbreathing_scfh, advanced.saghara_vacuum_governing_draw_bblhr, advanced.saghara_working_capacity_bbl, advanced.saghara_recovery_saved_lb_yr]';
  end if;

  -- ------------------------------------------------- the Associate, KRAKAMA
  if abs(v_g_krakama_beta_ratio - 3.8747 / 7.981) > 1e-15 then
    raise exception 'FC8 go-live refused: the beta of % is not the stated bore of % in over the stated pipe of % in [graded field: beginner.krakama_beta_ratio]', v_g_krakama_beta_ratio, 3.8747, 7.981;
  end if;
  if not (v_g_krakama_beta_ratio > 0.1 and v_g_krakama_beta_ratio < 0.75) then
    raise exception 'FC8 go-live refused: the beta of % is outside the published range the digest measures, so the graded coefficient chain is an extrapolation [graded field: beginner.krakama_beta_ratio]', v_g_krakama_beta_ratio;
  end if;

  -- The differential passes through the ONE engine constant the digest measures.
  if abs(v_g_krakama_differential_psi - 87.43 * 0.0361273) > 1e-12 then
    raise exception 'FC8 go-live refused: the differential of % psi is not the stated % in H2O at the measured % psi per in H2O [graded field: beginner.krakama_differential_psi]', v_g_krakama_differential_psi, 87.43, 0.0361273;
  end if;
  if not (v_g_krakama_differential_psi < 614.7) then
    raise exception 'FC8 go-live refused: the differential of % psi is at or above the static pressure, which the engine refuses [graded field: beginner.krakama_differential_psi]', v_g_krakama_differential_psi;
  end if;

  if abs(v_g_krakama_transmitter_uncertainty_pct - 0.072 * 425.0 / 87.43) > 1e-13 then
    raise exception 'FC8 go-live refused: the transmitter uncertainty of % percent is not % percent of a % in H2O span read at % in H2O [graded field: beginner.krakama_transmitter_uncertainty_pct]', v_g_krakama_transmitter_uncertainty_pct, 0.072, 425.0, 87.43;
  end if;
  if abs(v_g_krakama_flow_turndown_ratio - sqrt(425.0 / 87.43)) > 1e-13 then
    raise exception 'FC8 go-live refused: the flow turndown of % is not the square root of the span over the reading [graded field: beginner.krakama_flow_turndown_ratio]', v_g_krakama_flow_turndown_ratio;
  end if;
  -- THE PAIR AGAINST EACH OTHER. Percent of reading is the accuracy times the
  -- DIFFERENTIAL turndown, which is the flow turndown squared.
  if abs(0.072 * v_g_krakama_flow_turndown_ratio ^ 2.0 - v_g_krakama_transmitter_uncertainty_pct) > 1e-12 then
    raise exception 'FC8 go-live refused: % percent at a flow turndown of % is not the accuracy times the turndown squared [graded field: beginner.krakama_flow_turndown_ratio, beginner.krakama_transmitter_uncertainty_pct]', v_g_krakama_transmitter_uncertainty_pct, v_g_krakama_flow_turndown_ratio;
  end if;
  if not (v_g_krakama_flow_turndown_ratio < 3.0) then
    raise exception 'FC8 go-live refused: the flow turndown of % is past the limit, so the graded pair is a warning number [graded field: beginner.krakama_flow_turndown_ratio]', v_g_krakama_flow_turndown_ratio;
  end if;

  -- THE BUDGET, from the graded beta and the graded transmitter figure.
  v_b4 := v_g_krakama_beta_ratio ^ 4.0;
  v_total := sqrt(0.47 ^ 2.0 + 0.18 ^ 2.0
               + ((2.0 + 2.0 * v_b4 / (1.0 - v_b4)) * 0.043) ^ 2.0
               + ((2.0 * v_b4 / (1.0 - v_b4)) * 0.11) ^ 2.0
               + (0.5 * v_g_krakama_transmitter_uncertainty_pct) ^ 2.0
               + (0.5 * 0.28) ^ 2.0);
  if abs(v_g_krakama_total_uncertainty_pct - v_total) > 1e-13 then
    raise exception 'FC8 go-live refused: the total uncertainty of % percent is not the root sum of squares % of the six stated terms [graded field: beginner.krakama_total_uncertainty_pct]', v_g_krakama_total_uncertainty_pct, v_total;
  end if;
  if not (v_g_krakama_total_uncertainty_pct >= 0.47
          and v_g_krakama_total_uncertainty_pct <= 0.47 + 0.18 + (2.0 + 2.0 * v_b4 / (1.0 - v_b4)) * 0.043
             + (2.0 * v_b4 / (1.0 - v_b4)) * 0.11 + 0.5 * v_g_krakama_transmitter_uncertainty_pct + 0.5 * 0.28) then
    raise exception 'FC8 go-live refused: the total uncertainty of % percent lies outside the bounds of its own contributions [graded field: beginner.krakama_total_uncertainty_pct, beginner.krakama_transmitter_uncertainty_pct]', v_g_krakama_total_uncertainty_pct;
  end if;

  if abs(v_g_krakama_turbine_gross_bbl - 4187233.0 / 912.47 * 1.0034) > 1e-9 then
    raise exception 'FC8 go-live refused: the gross volume of % bbl is not % pulses over % pulses per bbl times a meter factor of % [graded field: beginner.krakama_turbine_gross_bbl]', v_g_krakama_turbine_gross_bbl, 4187233.0, 912.47, 1.0034;
  end if;
  if abs(v_g_krakama_turbine_gross_bbl / 1.0034 * 912.47 - 4187233.0) > 1e-6 then
    raise exception 'FC8 go-live refused: the gross volume of % bbl does not multiply back out to the % pulses counted [graded field: beginner.krakama_turbine_gross_bbl]', v_g_krakama_turbine_gross_bbl, 4187233.0;
  end if;
  if abs(1.0034 - 1.0) > 0.01 then
    raise exception 'FC8 go-live refused: the stated meter factor is outside the proving screen, so the graded volume carries a warning';
  end if;

  -- ---------------------------------------------- the Professional, UTONANA
  if abs(v_g_utonana_ff_critical_ratio - (0.96 - 0.28 * sqrt(41.62 / 566.8))) > 1e-15 then
    raise exception 'FC8 go-live refused: FF of % is not the critical pressure ratio factor at a vapour pressure of % and a critical pressure of % psia [graded field: intermediate.utonana_ff_critical_ratio]', v_g_utonana_ff_critical_ratio, 41.62, 566.8;
  end if;
  if abs(v_g_utonana_allowable_drop_psi - 0.93 ^ 2.0 * (428.3 - v_g_utonana_ff_critical_ratio * 41.62)) > 1e-11 then
    raise exception 'FC8 go-live refused: the allowable drop of % psi is not the stated FL squared times the inlet less the graded FF of % times the vapour pressure [graded field: intermediate.utonana_allowable_drop_psi, intermediate.utonana_ff_critical_ratio]', v_g_utonana_allowable_drop_psi, v_g_utonana_ff_critical_ratio;
  end if;
  -- THE PREMISE. The Professional capstone is a CHOKED valve on purpose.
  if not (v_g_utonana_allowable_drop_psi < 428.3 - 72.4) then
    raise exception 'FC8 go-live refused: the allowable drop of % psi is not below the stated drop, so the valve is not choked and the tier teaches nothing [graded field: intermediate.utonana_allowable_drop_psi]', v_g_utonana_allowable_drop_psi;
  end if;
  if abs(v_g_utonana_liquid_cv - 742.6 * sqrt(0.7134 / v_g_utonana_allowable_drop_psi)) > 1e-12 then
    raise exception 'FC8 go-live refused: the coefficient of % is not the stated flow sized on the graded allowable drop of % psi [graded field: intermediate.utonana_liquid_cv, intermediate.utonana_allowable_drop_psi]', v_g_utonana_liquid_cv, v_g_utonana_allowable_drop_psi;
  end if;
  if abs(v_g_utonana_liquid_cv ^ 2.0 * v_g_utonana_allowable_drop_psi / 0.7134 - 742.6 ^ 2.0) > 1e-6 then
    raise exception 'FC8 go-live refused: the coefficient of % on the drop of % psi does not square back out to the stated flow [graded field: intermediate.utonana_liquid_cv, intermediate.utonana_allowable_drop_psi]', v_g_utonana_liquid_cv, v_g_utonana_allowable_drop_psi;
  end if;
  if abs(v_g_utonana_cavitation_sigma - (428.3 - 41.62) / v_g_utonana_allowable_drop_psi) > 1e-13 then
    raise exception 'FC8 go-live refused: sigma of % is not the inlet less the vapour pressure over the graded drop used of % psi [graded field: intermediate.utonana_cavitation_sigma, intermediate.utonana_allowable_drop_psi]', v_g_utonana_cavitation_sigma, v_g_utonana_allowable_drop_psi;
  end if;
  if abs(v_g_utonana_cavitation_sigma * v_g_utonana_allowable_drop_psi - (428.3 - 41.62)) > 1e-10 then
    raise exception 'FC8 go-live refused: sigma of % times the drop of % psi does not give back the inlet less the vapour pressure [graded field: intermediate.utonana_cavitation_sigma, intermediate.utonana_allowable_drop_psi]', v_g_utonana_cavitation_sigma, v_g_utonana_allowable_drop_psi;
  end if;
  if abs(v_g_utonana_valve_authority - (428.3 - 72.4) / 452.8) > 1e-15 then
    raise exception 'FC8 go-live refused: the authority of % is not the valve drop over the stated system drop of % psi [graded field: intermediate.utonana_valve_authority]', v_g_utonana_valve_authority, 452.8;
  end if;
  if abs(v_g_utonana_normal_travel_pct - 100.0 * (1.0 + ln(34.62 / 88.0) / ln(42.5))) > 1e-11 then
    raise exception 'FC8 go-live refused: the normal travel of % percent is not the equal percentage travel of a required % on a rated % at a rangeability of % [graded field: intermediate.utonana_normal_travel_pct]', v_g_utonana_normal_travel_pct, 34.62, 88.0, 42.5;
  end if;
  if abs(88.0 * 42.5 ^ (v_g_utonana_normal_travel_pct / 100.0 - 1.0) - 34.62) > 1e-10 then
    raise exception 'FC8 go-live refused: the travel of % percent does not invert through the characteristic to the required coefficient of % [graded field: intermediate.utonana_normal_travel_pct]', v_g_utonana_normal_travel_pct, 34.62;
  end if;

  -- ----------------------------------------------------- the Expert, SAGHARA
  v_lever := 2.6 * 78.4 * (42.6 - 1.0);
  v_tdesign := v_lever * 0.8312 / 25300.0 + 0.0625;
  v_ttest := v_lever / 27000.0;
  if abs(v_g_saghara_bottom_course_required_in - greatest(v_tdesign, v_ttest, 0.25)) > 1e-15 then
    raise exception 'FC8 go-live refused: the bottom course of % in is not the largest of the design %, the test % and the stated minimum [graded field: advanced.saghara_bottom_course_required_in]', v_g_saghara_bottom_course_required_in, v_tdesign, v_ttest;
  end if;
  if not (v_tdesign > greatest(v_ttest, 0.25)) then
    raise exception 'FC8 go-live refused: the product does not govern the bottom course at the stated gravity, so the crossover is not the inversion the tier asks for';
  end if;
  if abs(v_g_saghara_sg_at_which_test_governs - (25300.0 / 27000.0 - 0.0625 * 25300.0 / v_lever)) > 1e-12 then
    raise exception 'FC8 go-live refused: the crossover gravity of % is not the closed form of the two thicknesses meeting [graded field: advanced.saghara_sg_at_which_test_governs]', v_g_saghara_sg_at_which_test_governs;
  end if;
  if abs(v_lever * v_g_saghara_sg_at_which_test_governs / 25300.0 + 0.0625 - v_ttest) > 1e-12 then
    raise exception 'FC8 go-live refused: at the graded crossover gravity of % the design thickness does not meet the test thickness of % in [graded field: advanced.saghara_sg_at_which_test_governs]', v_g_saghara_sg_at_which_test_governs, v_ttest;
  end if;

  v_nominal := pi() * 78.4 ^ 2.0 / 4.0 * 44.0 / 5.614583333333333;
  if not (v_nominal < 41500.0) then
    raise exception 'FC8 go-live refused: the nominal capacity of % bbl is above the stated proportional limit, so the graded inbreathing is an extrapolation', v_nominal;
  end if;
  v_thermal := v_nominal * 1.12 * 1.08;
  v_in := v_thermal + 1150.0 * 5.614583333333333;
  v_out := 0.58 * v_thermal + 4820.0 * 5.614583333333333;
  if abs(v_g_saghara_inbreathing_scfh - v_in) > 1e-7 then
    raise exception 'FC8 go-live refused: the inbreathing of % scfh is not the stated thermal rate on the nominal capacity plus the draw displacement, % [graded field: advanced.saghara_inbreathing_scfh]', v_g_saghara_inbreathing_scfh, v_in;
  end if;
  if not (v_in < v_out) then
    raise exception 'FC8 go-live refused: the tank is already on vacuum at the stated draw, so the crossover is not the inversion the tier asks for';
  end if;
  if abs(v_g_saghara_vacuum_governing_draw_bblhr - (v_out - v_thermal) / 5.614583333333333) > 1e-7 then
    raise exception 'FC8 go-live refused: the crossover draw of % bbl/hr is not the closed form of the two totals meeting [graded field: advanced.saghara_vacuum_governing_draw_bblhr]', v_g_saghara_vacuum_governing_draw_bblhr;
  end if;
  if abs(v_thermal + v_g_saghara_vacuum_governing_draw_bblhr * 5.614583333333333 - v_out) > 1e-6 then
    raise exception 'FC8 go-live refused: at the graded crossover draw of % bbl/hr the inbreathing does not meet the outbreathing of % scfh [graded field: advanced.saghara_vacuum_governing_draw_bblhr]', v_g_saghara_vacuum_governing_draw_bblhr, v_out;
  end if;
  if abs(v_g_saghara_working_capacity_bbl - pi() * 78.4 ^ 2.0 / 4.0 * 42.6 / 5.614583333333333) > 1e-8 then
    raise exception 'FC8 go-live refused: the working capacity of % bbl is not the cross section to the design liquid level in exact barrels [graded field: advanced.saghara_working_capacity_bbl]', v_g_saghara_working_capacity_bbl;
  end if;
  if abs(v_g_saghara_working_capacity_bbl / v_nominal - 42.6 / 44.0) > 1e-14 then
    raise exception 'FC8 go-live refused: the working capacity of % bbl is not the level over the shell as a fraction of the nominal % bbl [graded field: advanced.saghara_working_capacity_bbl]', v_g_saghara_working_capacity_bbl, v_nominal;
  end if;
  if abs(v_g_saghara_recovery_saved_lb_yr - 214860.0 * 93.4 / 100.0) > 1e-8 then
    raise exception 'FC8 go-live refused: the saving of % lb/yr is not the stated measured loss of % at the quoted % percent [graded field: advanced.saghara_recovery_saved_lb_yr]', v_g_saghara_recovery_saved_lb_yr, 214860.0, 93.4;
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'metering';
  if not exists (select 1 from public.academy_apps
                  where slug = 'metering' and status = 'available') then
    raise exception 'FC8 go-live refused: metering did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC8 go-live: metering available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
