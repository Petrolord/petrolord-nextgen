-- ============================================================================
-- FC5 GO-LIVE (HELD): Relief & Flare Systems flips to 'available'. The FIFTH
-- Facilities course, at path_order 43, above FC4 gasprocessing at 42, FC3
-- rotating at 41, FC2 linesizing at 40 and FC1 separation at 39, and below FC6
-- heattransfer at 44.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/relief. The 78 lessons, the teaching lab (reliefLab.js)
-- and its three explorer panels (the sizing, the fire and drum, and the
-- blowdown) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- Every Facilities wave on this programme holds its go-live behind one verified
-- upload, and this file is written, dry-run and left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator that wrote this file refuses to emit
-- a division with a bare integer denominator or a malformed numeric literal.
--
-- SEVENTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM
-- from the conditions the prompts state. The eighteenth is the blowdown time,
-- which the engine MARCHES at a 0.1 s step. It is asserted against the exact
-- integral of the same balance at 5e-5 s, because the march sits 3.98e-5 s from
-- it. That is the one assertion here looser than a one-part-in-1e7 move, and
-- the field's shipped tolerance of 1e-4 is set so that both routes grade
-- correct.
--
-- AND TEN ARE ASSERTED A SECOND TIME, BY ROUTES WITH NOTHING IN COMMON: the
-- critical ratio as the argmax of the nozzle flux; C from the graded ratio; the
-- three API 520 areas as products; the horizontal wetted area through the half
-- chord; the liquid area fraction by the arccos segment formula; the wider drum
-- against the first by the exact diameter ratio; the end temperature against
-- the graded inventory through the gas law; and the intensity against the
-- setback by the inverse square.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message, so a reader of a refusal sees both halves of a disagreeing pair.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_names text;
  v_k double precision; v_x double precision; v_u double precision; v_n double precision;
  v_p1 double precision; v_t double precision; v_r double precision; v_f2 double precision;
  v_dp double precision; v_rgas double precision; v_c double precision; v_a double precision;
  v_g_kolocreek_critical_pressure_ratio double precision;
  v_g_kolocreek_gas_coefficient_c double precision;
  v_g_kolocreek_gas_critical_area_in2 double precision;
  v_g_kolocreek_gas_subcritical_area_in2 double precision;
  v_g_kolocreek_liquid_area_in2 double precision;
  v_g_kolocreek_steam_area_in2 double precision;
  v_g_ogbainbiri_wetted_area_ft2 double precision;
  v_g_ogbainbiri_tower_wetted_area_ft2 double precision;
  v_g_ogbainbiri_liquid_area_fraction double precision;
  v_g_ogbainbiri_vapor_velocity_fts double precision;
  v_g_ogbainbiri_drum_length_ft double precision;
  v_g_ogbainbiri_drum_length_wider_ft double precision;
  v_g_gbaran_initial_mass_lb double precision;
  v_g_gbaran_blowdown_time_s double precision;
  v_g_gbaran_final_temperature_degr double precision;
  v_g_gbaran_choked_floor_psia double precision;
  v_g_gbaran_radiant_intensity_kwm2 double precision;
  v_g_gbaran_setback_distance_m double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'relief' and active;
  if v_structures <> 3 then
    raise exception 'FC5 go-live refused: relief has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'relief';
  if v_questions <> 396 then
    raise exception 'FC5 go-live refused: relief has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'relief'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'relief' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'relief' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'relief'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'relief';
  if v_capstones <> 3 then
    raise exception 'FC5 go-live refused: relief has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'relief' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC5 go-live refused: relief carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'relief' and s.active;
  if v_modules <> 18 then
    raise exception 'FC5 go-live refused: relief carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner will ever be served.
  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'relief' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'relief';
  if v_graded <> 18 then
    raise exception 'FC5 go-live refused: relief has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'relief' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'relief' and module = 'facilities'
                    and path_order = 43 and prereq_slug is null) then
    raise exception 'FC5 go-live refused: the relief catalogue row is not facilities at path_order 43 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 43 and slug <> 'relief') then
    raise exception 'FC5 go-live refused: another course already holds path_order 43';
  end if;


  -- ------------------------------------------- the held-for-literature gates
  -- ON THE NAME. A graded field that NAMES a quantity this module holds for the
  -- literature is refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['orifice', 'letter', 'margin', 'duty', 'btu', 'heat_input', 'relief_load', 'kv_', 'reynolds', 'dropout', 'drag', 'napier', 'kn_', 'ksh', 'kb_', 'kw_', 'allowable_level', 'customary']) frag
   where c.app_slug = 'relief' and (f->>'key') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['orifice letter', 'fire duty', 'heat input', 'relief load', 'viscosity correction', 'reynolds number', 'dropout velocity', 'drag coefficient', 'napier', 'superheat factor', 'bellows', 'customary']) frag
   where c.app_slug = 'relief' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a held number, within its own
  -- shipped tolerance, is a lookup of a quantity this module refuses to source.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.11, 0.196, 0.307, 0.34, 0.503, 0.785, 0.82, 0.9935, 1.15, 1.1547005383792515, 1.287, 1.5, 1.58, 1.838, 2.853, 2.878, 3.0, 3.6, 4.34, 4.73, 6.31, 6.38, 9.46, 11.05, 16.0, 24.0, 25.0, 26.0, 240.0, 342.75, 1500.0, 3200.0, 21000.0, 34500.0], array['an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'the sphere-drag constant, held for literature', 'an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'the pool fire exponent, held for literature', 'the Kv fit leading coefficient, held for literature', 'the printed settling coefficient, held for literature', 'the exact settling coefficient, held for literature', 'an API 526 orifice area, a typed published table', 'the Kv fit exponent, held for literature', 'a customary allowable intensity, held for literature', 'an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'the Kv fit second coefficient, held for literature', 'the sphere-drag 3/sqrt(Re) term, held for literature', 'an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'a customary allowable intensity, held for literature', 'a customary allowable intensity, held for literature', 'an API 526 orifice area, a typed published table', 'a customary allowable intensity, held for literature', 'an API 526 orifice area, a typed published table', 'an API 526 orifice area, a typed published table', 'the sphere-drag 24/Re term, held for literature', 'the wetted-height limit, a stated limit the caller applies', 'an API 526 orifice area, a typed published table', 'the sphere-drag low-Reynolds cap, held for literature', 'the Kv fit third coefficient, held for literature', 'the Napier threshold, held for literature', 'the top of the published Napier range, held for literature', 'the pool fire constant with drainage, held for literature', 'the pool fire constant without drainage, held for literature']) as h(val, lab)
   where c.app_slug = 'relief'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A graded field within its own
  -- tolerance of one of them is a lookup rather than a calculation, and the
  -- tolerance used is the SHIPPED one, which for five of the eighteen is raised
  -- to half a unit of the printed class and for the blowdown time is 1e-4.
  -- Sweeping at the stated tolerance would pass a collision the shipped grade
  -- would hit.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 2e-06, 4e-06, 7.510303e-06, 1.1e-05, 2.7894862e-05, 0.000140743657, 0.000288, 0.000335, 0.000343, 0.001693, 0.00199, 0.002015907907, 0.002086, 0.004322364699, 0.005254, 0.006501, 0.006587, 0.009101, 0.01, 0.011, 0.011518, 0.012, 0.0125, 0.012694, 0.0135, 0.015, 0.02, 0.025, 0.02878, 0.029283, 0.05, 0.052044, 0.052545, 0.052692, 0.053819, 0.058566, 0.063662, 0.065962, 0.078479, 0.09, 0.095933, 0.1, 0.104182271364, 0.104258, 0.107675, 0.11, 0.110001, 0.119366, 0.124385, 0.138133, 0.15, 0.166161, 0.167677, 0.167721, 0.175395, 0.185663, 0.185791, 0.18584, 0.195501, 0.196, 0.2, 0.230929, 0.249724, 0.25, 0.250000182473, 0.252316, 0.277403, 0.3, 0.300052, 0.307, 0.310799, 0.32, 0.322665, 0.35, 0.379644, 0.388415, 0.4, 0.432854, 0.439183, 0.445401, 0.45, 0.46761, 0.469042, 0.473481, 0.475609, 0.491251, 0.496765, 0.5, 0.503, 0.503001, 0.512, 0.525449, 0.528282, 0.544155, 0.545728, 0.551207, 0.551208, 0.551209, 0.564474, 0.567839, 0.578639, 0.581104, 0.584679, 0.586835, 0.594542, 0.595386, 0.595745, 0.6, 0.632423, 0.65, 0.674035, 0.68, 0.682646, 0.698038, 0.69852, 0.699297, 0.7, 0.71381, 0.72, 0.727142, 0.735763, 0.75, 0.776678, 0.777462, 0.78077, 0.785, 0.791767, 0.795774715459, 0.8, 0.801154, 0.804499, 0.808025, 0.813004, 0.814362, 0.815911, 0.82, 0.825349, 0.825485, 0.83, 0.831588132635, 0.833956, 0.84, 0.85, 0.850608, 0.851784, 0.857357, 0.857982, 0.868947, 0.87, 0.875668, 0.878343, 0.88, 0.882496, 0.886483, 0.891961, 0.893603, 0.894028, 0.899884, 0.9, 0.907336, 0.910104, 0.910457, 0.911517, 0.92, 0.921543, 0.931629, 0.932192, 0.939468, 0.947956, 0.949984, 0.95, 0.95048, 0.952641, 0.954079, 0.965548, 0.975, 0.977878, 0.984776, 0.984858, 0.98719, 0.988162, 0.99, 0.9935, 0.99484, 0.995677635301, 0.99595, 0.996733, 0.997395, 0.998307, 0.998342, 0.998366, 0.999983, 0.999995, 0.999999232099, 0.999999894249, 0.999999911186, 0.999999938032, 1.0, 1.000000004994, 1.000000027016, 1.000000103923, 1.000000389388, 1.000001488532, 1.000007510303, 1.000083905751, 1.001095, 1.001245, 1.003995, 1.006, 1.006251, 1.006542523506, 1.013078, 1.015459516779, 1.021727, 1.026414, 1.026599, 1.026884, 1.027982, 1.028016, 1.05, 1.06, 1.061, 1.062, 1.065, 1.066434, 1.071, 1.072746, 1.1, 1.113106, 1.114288, 1.118414, 1.128544, 1.144559, 1.14676, 1.15, 1.164566, 1.16737, 1.167438, 1.168748, 1.171, 1.18, 1.183722, 1.184858, 1.186, 1.190866, 1.2, 1.202998, 1.202999, 1.204819277108, 1.205556, 1.209776, 1.22, 1.235644, 1.248029, 1.25, 1.26183, 1.27, 1.28, 1.282951, 1.282951083345, 1.286474, 1.287, 1.29066, 1.3, 1.306, 1.310146, 1.324638, 1.325102, 1.333333333333, 1.337174, 1.337941, 1.35, 1.354759, 1.357936, 1.358296, 1.379956, 1.398501724833, 1.4, 1.401330610749, 1.402, 1.4265, 1.427138, 1.428127, 1.428678, 1.429064, 1.442191, 1.442393, 1.447964, 1.470046, 1.5, 1.5275, 1.544193, 1.544395, 1.551237, 1.552231, 1.560633, 1.560636, 1.566327, 1.578271, 1.58, 1.6, 1.602405, 1.609, 1.625, 1.638436, 1.63949, 1.642857142857, 1.645, 1.666666542759, 1.666666666667, 1.728783, 1.73, 1.731975, 1.738915, 1.738917, 1.745141, 1.747521, 1.751, 1.756732, 1.76464, 1.781802, 1.781818, 1.8, 1.838, 1.839323, 1.846109, 1.846802, 1.867601, 1.867758, 1.872044, 1.904951, 1.964194, 1.987, 1.99, 1.995916, 2.0, 2.027301, 2.028271, 2.030426, 2.08591, 2.112125, 2.2, 2.211679, 2.223779, 2.224962, 2.237461, 2.244651, 2.25, 2.290224, 2.290831, 2.295843, 2.333266, 2.334502, 2.352545, 2.353644, 2.353646, 2.4, 2.416716, 2.5, 2.51276, 2.529018, 2.52902, 2.529694, 2.5598, 2.562519, 2.585, 2.588, 2.592873, 2.65, 2.654, 2.658695, 2.658695041098, 2.659, 2.691988, 2.693414, 2.697, 2.7, 2.79719, 2.853, 2.878, 3.0, 3.088582, 3.106702, 3.195807278241, 3.218, 3.303904, 3.310897, 3.313197, 3.318423022984, 3.3318, 3.333333333333, 3.340002, 3.444154, 3.502, 3.504623, 3.523372, 3.6, 3.618375, 3.72983, 3.730822, 3.75, 3.796612, 3.797018, 3.981, 4.0, 4.00501, 4.151655, 4.2, 4.317999814064, 4.318, 4.34, 4.370609, 4.4, 4.406172, 4.467129, 4.470141, 4.47365, 4.5, 4.51731, 4.574231, 4.574721, 4.73, 4.8, 4.927214, 5.0, 5.014, 5.064, 5.116, 5.270195, 5.295, 5.306597, 5.534386, 5.65371, 5.654, 5.835288, 5.876, 6.0, 6.3, 6.31, 6.324234, 6.38, 6.680004, 6.75, 6.990078, 6.997154, 7.0, 7.026927, 7.125904, 7.2, 7.384438, 7.505603, 7.55, 7.681229, 7.769971, 7.8, 7.9, 7.905293, 7.984159, 7.987529, 8.0, 8.1, 8.226, 8.322, 8.4, 8.63, 8.676, 8.91, 8.95, 9.0, 9.034621, 9.46, 9.597904, 9.6, 9.635, 10.0, 10.05104, 10.291794, 10.332911, 10.346904, 10.481166, 10.540391, 10.767472, 10.8, 10.838707, 11.0, 11.039649, 11.05, 12.0, 12.426804, 12.437243, 12.566370614359, 12.648469, 13.0, 13.159863, 13.594845, 14.0, 14.117118, 14.421645, 14.473498, 14.696, 14.7, 15.0, 16.0, 17.0, 17.084312, 17.274356, 17.482435, 17.8224, 18.0, 19.0, 20.0, 20.5, 21.0, 21.212138, 22.0, 22.6195, 23.0, 24.0, 25.0, 25.504827, 25.999999, 26.0, 26.000001, 26.0001, 26.758009, 26.8, 27.0, 27.486039, 27.96031, 28.0, 29.0, 30.0, 31.2, 31.808626, 33.0, 34.0, 34.158667, 35.0, 36.5, 37.347773, 38.0, 39.0, 39.600545, 40.0, 42.0, 43.7, 44.0, 44.344927, 45.0, 45.2389, 46.600653, 47.565614, 49.0, 49.7, 50.0, 51.180008, 51.5, 60.0, 60.306354, 63.617251, 64.176478, 67.017258, 67.088404, 67.104843, 70.0, 72.066751, 75.733072, 79.0, 80.0, 83.838356, 85.0, 87.5, 90.0, 90.4779, 90.6111, 92.0, 92.428866, 94.5715, 100.0, 104.3929, 104.851161, 104.851242, 105.0, 108.7333, 110.0, 113.4858, 114.7, 118.862017, 120.0, 125.2715, 127.7073, 128.0, 130.0, 133.645325, 140.0, 145.0, 150.0, 153.2488, 153.996263, 158.3363, 160.0, 160.435652, 165.495773, 170.0, 177.955718, 180.0, 185.0, 186.4021, 190.0, 191.464951, 194.213269, 200.0, 202.535037, 206.121355, 210.0, 212.481739, 214.7, 220.0, 220.103588, 222.032848, 226.1947, 227.6583, 230.0, 231.6604, 232.0117, 239.318504, 240.0, 243.5545, 250.0, 257.134963, 258.109813, 260.0, 266.98981, 268.068607, 268.353614, 268.418973, 268.418974, 268.418975, 268.418981, 268.419002, 268.419078, 268.419373, 268.42099, 270.0, 275.0, 278.552096, 289.5755, 294.0531, 299.234348, 300.0, 300.806087, 301.0, 310.0, 314.7, 317.2, 321.187587, 321.794669, 321.794698, 323.253352, 325.049729, 326.747329, 333.1803, 336.0, 337.236209, 338.611469, 340.807983, 341.0, 342.75, 345.325271, 346.976423, 347.45, 347.4906, 350.808529, 351.480172, 354.644554, 356.060357, 356.423432, 361.9115, 362.174225, 364.564134, 366.839263, 366.839286, 368.065331, 372.55129, 374.101352, 376.9911, 380.287079, 380.316049, 383.936928, 386.627505, 387.182334, 393.127831, 399.79348, 400.0, 405.931108, 406.630105, 407.1504, 411.800027, 413.643606, 418.879, 419.404662, 420.0, 420.840135, 425.511333, 428.226118, 435.808264, 443.59358, 446.20169, 450.0, 451.589391, 452.3893, 454.1771, 459.803355, 462.482817, 464.976597, 467.0, 468.243479, 471.2389, 476.7, 476.918145, 483.820806, 485.836122, 488.650558, 489.170126, 495.006596, 500.0, 500.7394, 501.9, 504.439191, 514.14399, 514.7, 519.67, 520.0, 521.0, 522.9, 524.131571, 524.991018, 526.0, 534.413026, 539.7, 540.397236, 545.0, 560.0, 560.1633, 570.084018, 580.0, 600.0, 610.0, 619.0, 619.5143, 628.3, 628.3185, 640.0, 648.7449, 672.0, 673.744535, 683.696, 720.0, 733.291697, 735.0, 745.608268, 798.734021, 800.0, 848.23, 860.0, 870.718948, 900.0, 949.972166, 1000.0, 1012.764, 1014.7, 1031.7419, 1037.307957, 1049.0, 1133.641018, 1193.11787, 1195.7206, 1200.0, 1223.138436, 1240.0, 1250.0, 1343.0, 1348.9694, 1400.0, 1500.0, 1500.000000000007, 1514.7, 1520.0, 1545.349, 1550.0, 1580.0, 1580.3, 1580.310880829016, 1580.310881, 1600.0, 1677.618587, 1696.46, 1740.0, 1782.2441, 1800.0, 1865.0, 1928.7, 1973.354184, 2000.0, 2014.7, 2464.2579, 2500.0, 2634.968451, 2685.0, 2800.0, 3000.0, 3100.0, 3200.0, 3200.000000000003, 3469.2925, 4031.815814, 4195.0, 4363.001745200682, 4533.1981, 4629.144851657922, 4885.09033, 5000.0, 5135.587, 5196.2288, 5369.0, 6000.0, 6056.4662, 6861.2729, 6884.065258, 7199.999985603571, 7457.0, 7773.0255, 9166.8325, 10000.0, 10384.9568, 10392.4576, 10439.1529, 10737.0, 11762.0177, 12000.0, 14780.3842, 16777.0, 17320.7627, 17412.317969, 17546.394776, 19400.0, 21000.0, 21474.0, 22170.5763, 24770.456, 25000.0, 27586.7834, 29445.2967, 29560.7684, 34500.0, 34641.5255, 44341.1526, 48544.2301, 49267.9473, 49999.0, 50000.0, 56911.0776, 60000.0, 60882.958012, 68000.0, 73901.921, 74421.009125, 77615.1962, 77615.1963, 80000.0, 87240.6737, 90492.1482, 91126.5036, 94000.0, 99999.9999, 100000.0, 120000.0, 147803.842, 150000.0, 196000.0, 196282.56135481442, 210000.0, 298288.711198, 300000.0, 519247.8396, 665117.2892, 676986.4532, 677104.9976, 916683.2477, 1092692.6894, 1193971.5392, 1330234.5784, 1336211.5771, 1491443.55599, 1943256.3783, 2185385.3787, 2217057.6306, 2959866.538047, 3170618.3714, 3430636.4553, 3642308.9645, 3768997.972, 4137293.0505, 4138017.5155, 4434115.2612, 6056466.1566, 6191925.2397, 6213661.4471, 6791329.6724, 6796981.4402, 7284617.9291, 10000000.0, 10147123.8325, 10155568.3036, 12838967.5692, 22665990.2852, 100000000.0]) pub
   where c.app_slug = 'relief'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;

  -- EVERY NUMBER A LEARNER IS HANDED, read by POSTGRES out of the shipped
  -- prompt rather than out of a generator's copy of it.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\.?[0-9]*', 'g') as m
   where c.app_slug = 'relief' and p.app_slug = 'relief'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'relief') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'relief') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'relief') gg
   where c.app_slug = 'relief' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_kolocreek_critical_pressure_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_critical_pressure_ratio';
  select (f->>'expected')::double precision into v_g_kolocreek_gas_coefficient_c
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_gas_coefficient_c';
  select (f->>'expected')::double precision into v_g_kolocreek_gas_critical_area_in2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_gas_critical_area_in2';
  select (f->>'expected')::double precision into v_g_kolocreek_gas_subcritical_area_in2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_gas_subcritical_area_in2';
  select (f->>'expected')::double precision into v_g_kolocreek_liquid_area_in2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_liquid_area_in2';
  select (f->>'expected')::double precision into v_g_kolocreek_steam_area_in2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'beginner' and f->>'key' = 'kolocreek_steam_area_in2';
  select (f->>'expected')::double precision into v_g_ogbainbiri_wetted_area_ft2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_wetted_area_ft2';
  select (f->>'expected')::double precision into v_g_ogbainbiri_tower_wetted_area_ft2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_tower_wetted_area_ft2';
  select (f->>'expected')::double precision into v_g_ogbainbiri_liquid_area_fraction
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_liquid_area_fraction';
  select (f->>'expected')::double precision into v_g_ogbainbiri_vapor_velocity_fts
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_vapor_velocity_fts';
  select (f->>'expected')::double precision into v_g_ogbainbiri_drum_length_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_drum_length_ft';
  select (f->>'expected')::double precision into v_g_ogbainbiri_drum_length_wider_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'intermediate' and f->>'key' = 'ogbainbiri_drum_length_wider_ft';
  select (f->>'expected')::double precision into v_g_gbaran_initial_mass_lb
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_initial_mass_lb';
  select (f->>'expected')::double precision into v_g_gbaran_blowdown_time_s
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_blowdown_time_s';
  select (f->>'expected')::double precision into v_g_gbaran_final_temperature_degr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_final_temperature_degr';
  select (f->>'expected')::double precision into v_g_gbaran_choked_floor_psia
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_choked_floor_psia';
  select (f->>'expected')::double precision into v_g_gbaran_radiant_intensity_kwm2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_radiant_intensity_kwm2';
  select (f->>'expected')::double precision into v_g_gbaran_setback_distance_m
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'relief' and c.tier = 'advanced' and f->>'key' = 'gbaran_setback_distance_m';
  if v_g_kolocreek_critical_pressure_ratio is null
     or v_g_kolocreek_gas_coefficient_c is null
     or v_g_kolocreek_gas_critical_area_in2 is null
     or v_g_kolocreek_gas_subcritical_area_in2 is null
     or v_g_kolocreek_liquid_area_in2 is null
     or v_g_kolocreek_steam_area_in2 is null
     or v_g_ogbainbiri_wetted_area_ft2 is null
     or v_g_ogbainbiri_tower_wetted_area_ft2 is null
     or v_g_ogbainbiri_liquid_area_fraction is null
     or v_g_ogbainbiri_vapor_velocity_fts is null
     or v_g_ogbainbiri_drum_length_ft is null
     or v_g_ogbainbiri_drum_length_wider_ft is null
     or v_g_gbaran_initial_mass_lb is null
     or v_g_gbaran_blowdown_time_s is null
     or v_g_gbaran_final_temperature_degr is null
     or v_g_gbaran_choked_floor_psia is null
     or v_g_gbaran_radiant_intensity_kwm2 is null
     or v_g_gbaran_setback_distance_m is null then
    raise exception 'FC5 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.kolocreek_critical_pressure_ratio, beginner.kolocreek_gas_coefficient_c, beginner.kolocreek_gas_critical_area_in2, beginner.kolocreek_gas_subcritical_area_in2, beginner.kolocreek_liquid_area_in2, beginner.kolocreek_steam_area_in2, intermediate.ogbainbiri_wetted_area_ft2, intermediate.ogbainbiri_tower_wetted_area_ft2, intermediate.ogbainbiri_liquid_area_fraction, intermediate.ogbainbiri_vapor_velocity_fts, intermediate.ogbainbiri_drum_length_ft, intermediate.ogbainbiri_drum_length_wider_ft, advanced.gbaran_initial_mass_lb, advanced.gbaran_blowdown_time_s, advanced.gbaran_final_temperature_degr, advanced.gbaran_choked_floor_psia, advanced.gbaran_radiant_intensity_kwm2, advanced.gbaran_setback_distance_m]';
  end if;

  -- -------------------------------------------- the Associate, KOLO CREEK
  -- The critical ratio off k alone.
  v_k := 1.31;
  if abs(v_g_kolocreek_critical_pressure_ratio - power(2.0 / (v_k + 1.0), v_k / (v_k - 1.0))) > 1e-14 then
    raise exception 'FC5 go-live refused: the critical ratio of % is not (2/(k+1))^(k/(k-1)) at k = % [graded field: beginner.kolocreek_critical_pressure_ratio]', v_g_kolocreek_critical_pressure_ratio, v_k;
  end if;

  -- AND BY ITS DEFINING PROPERTY. The critical ratio is where the nozzle mass
  -- flux peaks, so the slope of r^(2/k) - r^((k+1)/k) is zero there. This is a
  -- fact about the flux, and no rearrangement of the closed form supplies it.
  v_x := (2.0 / v_k) * power(v_g_kolocreek_critical_pressure_ratio, 2.0 / v_k - 1.0)
         - ((v_k + 1.0) / v_k) * power(v_g_kolocreek_critical_pressure_ratio, 1.0 / v_k);
  if abs(v_x) > 1e-12 then
    raise exception 'FC5 go-live refused: the critical ratio of % leaves a nozzle flux slope of %, so it is not where the flux peaks [graded field: beginner.kolocreek_critical_pressure_ratio]', v_g_kolocreek_critical_pressure_ratio, v_x;
  end if;

  if abs(v_g_kolocreek_gas_coefficient_c - 520.0 * sqrt(v_k * power(2.0 / (v_k + 1.0), (v_k + 1.0) / (v_k - 1.0)))) > 1e-11 then
    raise exception 'FC5 go-live refused: C of % is not the USC coefficient at k = % [graded field: beginner.kolocreek_gas_coefficient_c]', v_g_kolocreek_gas_coefficient_c, v_k;
  end if;

  -- C AGAIN FROM THE GRADED RATIO, which ties the two fields together: the
  -- exponent (k+1)/(k-1) on 2/(k+1) is the ratio raised to (k+1)/k.
  if abs(v_g_kolocreek_gas_coefficient_c - 520.0 * sqrt(v_k * power(v_g_kolocreek_critical_pressure_ratio, (v_k + 1.0) / v_k))) > 1e-10 then
    raise exception 'FC5 go-live refused: C of % does not follow from the graded critical ratio of % [graded field: beginner.kolocreek_gas_coefficient_c, beginner.kolocreek_critical_pressure_ratio]', v_g_kolocreek_gas_coefficient_c, v_g_kolocreek_critical_pressure_ratio;
  end if;

  -- The relieving pressure is the set pressure with its overpressure, made
  -- absolute. The flare header case is CRITICAL and under the 0.3 ratio, so Kb
  -- is 1 by the standard; the pressured header case is SUBCRITICAL, so F2
  -- carries it and Kb is not read.
  v_p1 := 385.0 * 1.1 + 14.7;
  v_t := 165.0 + 459.67;
  if not (55.0 / v_p1 <= v_g_kolocreek_critical_pressure_ratio and 55.0 / v_p1 < 0.3) then
    raise exception 'FC5 go-live refused: the flare header case at % psia against % psia is not critical under the 0.3 ratio, so the graded critical ratio % would be read on the wrong branch [graded field: beginner.kolocreek_critical_pressure_ratio]', 55.0, v_p1, v_g_kolocreek_critical_pressure_ratio;
  end if;
  if not (330.0 / v_p1 > v_g_kolocreek_critical_pressure_ratio) then
    raise exception 'FC5 go-live refused: the pressured header case at % psia is not subcritical against the graded ratio % [graded field: beginner.kolocreek_critical_pressure_ratio]', 330.0, v_g_kolocreek_critical_pressure_ratio;
  end if;

  if abs(v_g_kolocreek_gas_critical_area_in2 - 37500.0 * sqrt(v_t * 0.89 / 23.5)
         / (v_g_kolocreek_gas_coefficient_c * 0.975 * v_p1 * 1.0 * 1.0)) > 1e-13 then
    raise exception 'FC5 go-live refused: the critical gas area of % in2 is not the API 520 critical area on the graded C of % [graded field: beginner.kolocreek_gas_critical_area_in2, beginner.kolocreek_gas_coefficient_c]', v_g_kolocreek_gas_critical_area_in2, v_g_kolocreek_gas_coefficient_c;
  end if;
  -- AND AS A PRODUCT, the sizing equation read forwards.
  if abs(v_g_kolocreek_gas_critical_area_in2 * v_g_kolocreek_gas_coefficient_c * 0.975 * v_p1 * 1.0 * 1.0
         - 37500.0 * sqrt(v_t * 0.89 / 23.5)) > 1e-9 then
    raise exception 'FC5 go-live refused: the graded area % in2 times C % does not pass the stated % lb an hour [graded field: beginner.kolocreek_gas_critical_area_in2, beginner.kolocreek_gas_coefficient_c]', v_g_kolocreek_gas_critical_area_in2, v_g_kolocreek_gas_coefficient_c, 37500.0;
  end if;

  v_r := 330.0 / v_p1;
  v_f2 := sqrt((v_k / (v_k - 1.0)) * power(v_r, 2.0 / v_k) * ((1.0 - power(v_r, (v_k - 1.0) / v_k)) / (1.0 - v_r)));
  if abs(v_g_kolocreek_gas_subcritical_area_in2 - (37500.0 / (735.0 * v_f2 * 0.975 * 1.0))
         * sqrt((v_t * 0.89) / (23.5 * v_p1 * (v_p1 - 330.0)))) > 1e-13 then
    raise exception 'FC5 go-live refused: the subcritical gas area of % in2 is not the API 520 subcritical area at F2 = % [graded field: beginner.kolocreek_gas_subcritical_area_in2]', v_g_kolocreek_gas_subcritical_area_in2, v_f2;
  end if;
  -- A PRESSURED HEADER NEEDS THE BIGGER VALVE, or the branch teaches nothing.
  if not v_g_kolocreek_gas_subcritical_area_in2 > v_g_kolocreek_gas_critical_area_in2 then
    raise exception 'FC5 go-live refused: the subcritical area % in2 is not larger than the critical area % in2 [graded field: beginner.kolocreek_gas_subcritical_area_in2, beginner.kolocreek_gas_critical_area_in2]', v_g_kolocreek_gas_subcritical_area_in2, v_g_kolocreek_gas_critical_area_in2;
  end if;

  -- The liquid route on the DIFFERENCE of two gauge pressures, inviscid, so Kv
  -- is exactly 1 and no Kv fit constant enters.
  v_dp := 295.0 * 1.1 - 65.0;
  if abs(v_g_kolocreek_liquid_area_in2 - 640.0 * sqrt(0.79)
         / (38.0 * 0.65 * 1.0 * 1.0 * sqrt(v_dp))) > 1e-13 then
    raise exception 'FC5 go-live refused: the liquid area of % in2 is not the API 520 liquid area across % psi [graded field: beginner.kolocreek_liquid_area_in2]', v_g_kolocreek_liquid_area_in2, v_dp;
  end if;
  if abs(v_g_kolocreek_liquid_area_in2 * 38.0 * 0.65 * 1.0 * 1.0 * sqrt(v_dp)
         - 640.0 * sqrt(0.79)) > 1e-10 then
    raise exception 'FC5 go-live refused: the graded liquid area % in2 does not pass the stated % gpm [graded field: beginner.kolocreek_liquid_area_in2]', v_g_kolocreek_liquid_area_in2, 640.0;
  end if;

  -- Steam far below the Napier threshold, so KN is exactly 1.
  v_p1 := 585.0 * 1.1 + 14.7;
  if v_p1 > 1500.0 then
    raise exception 'FC5 go-live refused: the steam case relieves at % psia, at or past the Napier threshold', v_p1;
  end if;
  if abs(v_g_kolocreek_steam_area_in2 - 78000.0 / (51.5 * v_p1 * 0.975 * 1.0 * 1.0 * 1.0)) > 1e-13 then
    raise exception 'FC5 go-live refused: the steam area of % in2 is not the API 520 steam area at % psia [graded field: beginner.kolocreek_steam_area_in2]', v_g_kolocreek_steam_area_in2, v_p1;
  end if;
  if abs(v_g_kolocreek_steam_area_in2 * 51.5 * v_p1 * 0.975 * 1.0 * 1.0 * 1.0 - 78000.0) > 1e-8 then
    raise exception 'FC5 go-live refused: the graded steam area % in2 does not pass the stated % lb an hour [graded field: beginner.kolocreek_steam_area_in2]', v_g_kolocreek_steam_area_in2, 78000.0;
  end if;


  -- ------------------------------------------ the Professional, OGBAINBIRI
  -- The horizontal vessel as an exact circular segment, heads ignored.
  v_r := 9.5 / 2.0;
  if abs(v_g_ogbainbiri_wetted_area_ft2 - v_r * (2.0 * acos((v_r - 3.4) / v_r)) * 37.0) > 1e-10 then
    raise exception 'FC5 go-live refused: the horizontal wetted area of % ft2 is not the wetted arc times the length [graded field: intermediate.ogbainbiri_wetted_area_ft2]', v_g_ogbainbiri_wetted_area_ft2;
  end if;
  -- AGAIN THROUGH THE HALF CHORD. atan2 of the half chord over the depth below
  -- the centre shares no arithmetic with the arc cosine above.
  if abs(v_g_ogbainbiri_wetted_area_ft2 - 2.0 * v_r * 37.0
         * atan2(sqrt(3.4 * (2.0 * v_r - 3.4)), v_r - 3.4)) > 1e-10 then
    raise exception 'FC5 go-live refused: the horizontal wetted area of % ft2 disagrees with the half-chord route [graded field: intermediate.ogbainbiri_wetted_area_ft2]', v_g_ogbainbiri_wetted_area_ft2;
  end if;

  if abs(v_g_ogbainbiri_tower_wetted_area_ft2 - pi() * 7.2 * least(14.5, 32.0)) > 1e-10 then
    raise exception 'FC5 go-live refused: the tower wetted area of % ft2 is not the circumference times the wetted height [graded field: intermediate.ogbainbiri_tower_wetted_area_ft2]', v_g_ogbainbiri_tower_wetted_area_ft2;
  end if;
  if not (14.5 < 25.0 and 9.5 < 25.0) then
    raise exception 'FC5 go-live refused: a wetted height reaches the 25 ft limit, which is the caller''s truncation and not graded here';
  end if;

  -- The drum. The fraction of the cross-section below the level.
  v_x := 2.0 * acos(1.0 - 2.0 * 0.35);
  if abs(v_g_ogbainbiri_liquid_area_fraction - (v_x - sin(v_x)) / (2.0 * pi())) > 1e-14 then
    raise exception 'FC5 go-live refused: the liquid area fraction of % is not the circular segment at a level of % of the diameter [graded field: intermediate.ogbainbiri_liquid_area_fraction]', v_g_ogbainbiri_liquid_area_fraction, 0.35;
  end if;
  -- AGAIN BY THE ARCCOS SEGMENT FORMULA on a unit diameter, a different route.
  v_u := 1.0 - 2.0 * 0.35;
  if abs(v_g_ogbainbiri_liquid_area_fraction - (acos(v_u) - v_u * sqrt(1.0 - v_u * v_u)) / pi()) > 1e-14 then
    raise exception 'FC5 go-live refused: the liquid area fraction of % disagrees with the arccos segment formula [graded field: intermediate.ogbainbiri_liquid_area_fraction]', v_g_ogbainbiri_liquid_area_fraction;
  end if;

  if abs(v_g_ogbainbiri_vapor_velocity_fts - 168.0 / ((pi() * 8.5 * 8.5 / 4.0) * (1.0 - v_g_ogbainbiri_liquid_area_fraction))) > 1e-13 then
    raise exception 'FC5 go-live refused: the vapour velocity of % ft/s is not the stated rate over the vapour area above the graded fraction % [graded field: intermediate.ogbainbiri_vapor_velocity_fts, intermediate.ogbainbiri_liquid_area_fraction]', v_g_ogbainbiri_vapor_velocity_fts, v_g_ogbainbiri_liquid_area_fraction;
  end if;

  -- The length the vapour must travel while a droplet falls the VAPOUR DEPTH.
  if abs(v_g_ogbainbiri_drum_length_ft - v_g_ogbainbiri_vapor_velocity_fts * (8.5 * (1.0 - 0.35)) / 2.05) > 1e-12 then
    raise exception 'FC5 go-live refused: the drum length of % ft is not the graded velocity % times the fall time [graded field: intermediate.ogbainbiri_drum_length_ft, intermediate.ogbainbiri_vapor_velocity_fts]', v_g_ogbainbiri_drum_length_ft, v_g_ogbainbiri_vapor_velocity_fts;
  end if;

  if abs(v_g_ogbainbiri_drum_length_wider_ft
         - (168.0 / ((pi() * 10.5 * 10.5 / 4.0) * (1.0 - v_g_ogbainbiri_liquid_area_fraction)))
           * (10.5 * (1.0 - 0.35)) / 2.05) > 1e-12 then
    raise exception 'FC5 go-live refused: the wider drum length of % ft is not the same balance at % ft [graded field: intermediate.ogbainbiri_drum_length_wider_ft, intermediate.ogbainbiri_liquid_area_fraction]', v_g_ogbainbiri_drum_length_wider_ft, 10.5;
  end if;
  -- THE EXACT RATIO. At one level fraction the vapour area goes as D squared
  -- and the fall as D, so the length goes as 1/D. Two graded lengths, one
  -- identity, and nothing in common with the balance above.
  if abs(v_g_ogbainbiri_drum_length_wider_ft / v_g_ogbainbiri_drum_length_ft - 8.5 / 10.5) > 1e-14 then
    raise exception 'FC5 go-live refused: the wider length % over the first % is not the diameter ratio % [graded field: intermediate.ogbainbiri_drum_length_wider_ft, intermediate.ogbainbiri_drum_length_ft]', v_g_ogbainbiri_drum_length_wider_ft, v_g_ogbainbiri_drum_length_ft, 8.5 / 10.5;
  end if;


  -- ------------------------------------------------------ the Expert, GBARAN
  v_rgas := 1545.349 / 21.5;
  if abs(v_g_gbaran_initial_mass_lb - 1185.0 * 144.0 * 640.0 / (0.87 * v_rgas * 555.0)) > 1e-10 then
    raise exception 'FC5 go-live refused: the inventory of % lb is not the gas law at the stated start state [graded field: advanced.gbaran_initial_mass_lb]', v_g_gbaran_initial_mass_lb;
  end if;
  if abs(v_g_gbaran_initial_mass_lb * 0.87 * v_rgas * 555.0 / (144.0 * 640.0) - 1185.0) > 1e-10 then
    raise exception 'FC5 go-live refused: the graded inventory of % lb does not return the stated start pressure [graded field: advanced.gbaran_initial_mass_lb]', v_g_gbaran_initial_mass_lb;
  end if;

  -- THE TIME, AGAINST THE EXACT INTEGRAL OF THE SAME BALANCE. With z held and
  -- the flow choked, the mass leaves at a rate proportional to m^((k+1)/2), so
  -- the time between two masses is closed form. The engine MARCHES this at a
  -- 0.1 s step and sits 3.98e-5 s from the integral, so the epsilon is 5e-5 s,
  -- the one assertion in this file looser than a one-part-in-1e7 move. The
  -- field's shipped tolerance is 1e-4 so that both routes grade correct.
  v_k := 1.26;
  v_c := 520.0 * sqrt(v_k * power(2.0 / (v_k + 1.0), (v_k + 1.0) / (v_k - 1.0)));
  v_a := (0.84 * (pi() / 4.0) * power(1.375 / 12.0, 2.0) * 144.0);
  v_x := (v_c * v_a * sqrt(21.5 / 0.87) / 3600.0) * (0.87 * v_rgas / (144.0 * 640.0))
         * sqrt(555.0) * power(v_g_gbaran_initial_mass_lb, -(v_k - 1.0) / 2.0);
  v_n := (v_k + 1.0) / 2.0;
  v_u := v_g_gbaran_initial_mass_lb * power(165.0 / 1185.0, 1.0 / v_k);
  v_t := (power(v_u, 1.0 - v_n) - power(v_g_gbaran_initial_mass_lb, 1.0 - v_n)) / (v_x * (v_n - 1.0));
  if abs(v_g_gbaran_blowdown_time_s - v_t) > 5e-05 then
    raise exception 'FC5 go-live refused: the blowdown time of % s is % s from the exact integral of the same balance, % s, past the march''s own step error [graded field: advanced.gbaran_blowdown_time_s]', v_g_gbaran_blowdown_time_s, abs(v_g_gbaran_blowdown_time_s - v_t), v_t;
  end if;

  -- The end temperature is fixed by the pressure ratio alone.
  if abs(v_g_gbaran_final_temperature_degr - 555.0 * power(165.0 / 1185.0, (v_k - 1.0) / v_k)) > 1e-9 then
    raise exception 'FC5 go-live refused: the end temperature of % degR is not the isentropic temperature at the stated pressure ratio [graded field: advanced.gbaran_final_temperature_degr]', v_g_gbaran_final_temperature_degr;
  end if;
  -- AGAIN THROUGH THE GAS LAW, against the graded inventory: the end mass the
  -- gas law gives at the graded temperature must be the start mass times the
  -- temperature ratio to the 1/(k-1).
  v_x := 165.0 * 144.0 * 640.0 / (0.87 * v_rgas * v_g_gbaran_final_temperature_degr);
  if abs(v_x / v_g_gbaran_initial_mass_lb - power(v_g_gbaran_final_temperature_degr / 555.0, 1.0 / (v_k - 1.0))) > 1e-12 then
    raise exception 'FC5 go-live refused: the graded end temperature % degR and the graded inventory % lb do not satisfy the gas law and the isentropic mass relation together [graded field: advanced.gbaran_initial_mass_lb, advanced.gbaran_final_temperature_degr]', v_g_gbaran_final_temperature_degr, v_g_gbaran_initial_mass_lb;
  end if;

  if abs(v_g_gbaran_choked_floor_psia - 16.5 / power(2.0 / (v_k + 1.0), v_k / (v_k - 1.0))) > 1e-11 then
    raise exception 'FC5 go-live refused: the choked floor of % psia is not the back pressure over the critical ratio [graded field: advanced.gbaran_choked_floor_psia]', v_g_gbaran_choked_floor_psia;
  end if;
  if not 165.0 > 3.0 * v_g_gbaran_choked_floor_psia then
    raise exception 'FC5 go-live refused: the end pressure is not three times the choked floor of % psia, so the graded time carries a model caveat [graded field: advanced.gbaran_choked_floor_psia]', v_g_gbaran_choked_floor_psia;
  end if;

  if abs(v_g_gbaran_radiant_intensity_kwm2 - 0.91 * 0.27 * 742000.0 / (4.0 * pi() * power(118.0, 2.0))) > 1e-13 then
    raise exception 'FC5 go-live refused: the intensity of % kW/m2 is not the point source at the stated distance [graded field: advanced.gbaran_radiant_intensity_kwm2]', v_g_gbaran_radiant_intensity_kwm2;
  end if;
  if abs(v_g_gbaran_setback_distance_m - sqrt(0.91 * 0.27 * 742000.0 / (4.0 * pi() * 5.25))) > 1e-11 then
    raise exception 'FC5 go-live refused: the setback of % m is not the point source solved for the project allowable [graded field: advanced.gbaran_setback_distance_m]', v_g_gbaran_setback_distance_m;
  end if;
  -- THE INVERSE SQUARE, between the two graded values and nothing else.
  if abs(v_g_gbaran_radiant_intensity_kwm2 * power(118.0, 2.0) - 5.25 * power(v_g_gbaran_setback_distance_m, 2.0)) > 1e-8 then
    raise exception 'FC5 go-live refused: the graded intensity % at % m and the graded setback % m do not keep the inverse square [graded field: advanced.gbaran_radiant_intensity_kwm2, advanced.gbaran_setback_distance_m]', v_g_gbaran_radiant_intensity_kwm2, 118.0, v_g_gbaran_setback_distance_m;
  end if;
  if 5.25 in (1.58, 4.73, 6.31, 9.46) then
    raise exception 'FC5 go-live refused: the project allowable is one of the four customary values, which are held for literature';
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'relief';
  if not exists (select 1 from public.academy_apps
                  where slug = 'relief' and status = 'available') then
    raise exception 'FC5 go-live refused: relief did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC5 go-live: relief available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
