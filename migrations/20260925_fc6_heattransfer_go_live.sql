-- ============================================================================
-- FC6 GO-LIVE (HELD): Heat Exchange & Cooling flips to 'available'. The SIXTH
-- Facilities course, above FC5 at path_order 43, FC4 gasprocessing at 42, FC3
-- rotating at 41, FC2 linesizing at 40 and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/heattransfer. The 78 lessons, the teaching lab
-- (heattransferLab.js) and its three explorer panels (the exchanger, the
-- coefficient and the rating) ship in the ZIP and NOT in this database, so a
-- flip before the upload puts a live catalogue tile in front of a route that
-- does not exist. Every Facilities and Drilling wave on this programme has held
-- its go-live behind one verified upload, and this file is written, dry-run and
-- left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost a
-- third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this. It
-- matters more here than on any sibling, because this ladder divides a TUBE
-- COUNT by a PASS COUNT and takes a ceiling of the result, and an integer
-- division there would silently give the right answer on an even count and the
-- wrong one on an odd count, which is exactly the case the capstone is built
-- on. The generator that wrote this file refuses to emit a division with a bare
-- integer denominator, and refuses a malformed numeric literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM. That is a
-- measurement, not an ambition: nothing on a graded path in this module is
-- solved iteratively, so no graded field here is a root a solver had to find.
-- A sibling reached thirteen of eighteen and asserted three by the equation
-- they are a root of, because its compressibility came out of a Newton
-- iteration. The one field here that keeps that shape is the equivalent
-- single-shell P at two shells: the engine reaches it in closed form through an
-- intermediate, but it IS the root of the shell-series relation, so it is
-- asserted THAT way rather than by restating the engine's own algebra for it.
--
-- AND SEVEN OF THE EIGHTEEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN
-- COMMON, because a gate that restates the formula validates nothing:
--
--   * the duty, again from the COLD side of the balance rather than the hot;
--   * the cold outlet, which that cold-side check reads;
--   * the log mean, again against the mathematical fact that it lies strictly
--     between the geometric and the arithmetic mean of its two end
--     differences, which no rearrangement of its own formula can supply;
--   * the area, again by multiplying it back out through U and the log mean;
--   * the fouling penalty, again from the two GRADED coefficients rather than
--     from the resistance stack that produced them;
--   * and the UA, the effectiveness and the hot-day outlet, again by THE
--     SECOND METHOD, q = UA x LMTD at the hot-day terminals. That identity is
--     the reason the FC6-0 repair exists: before it the engine satisfied
--     NEITHER method, and the disagreement is what found the defect.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message. An assertion between two graded values reads both, and a refusal
-- naming only one leaves a reader looking at the trusting half of a disagreeing
-- pair, which is where the bug is not.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_names text;
  v_dt1 double precision; v_dt2 double precision;
  v_ncover double precision; v_ntubes double precision;
  v_p double precision; v_r double precision; v_root double precision;
  v_rout double precision; v_rwall double precision; v_rin double precision;
  v_rfoulin double precision; v_clean double precision; v_total double precision;
  v_top double precision; v_next double precision;
  v_cmin double precision; v_cmax double precision; v_cprocess double precision;
  v_cair double precision; v_q2 double precision; v_rise2 double precision;
  v_e1 double precision; v_e2 double precision; v_lm2 double precision;
  v_g_amenam_duty_btu_hr double precision;
  v_g_amenam_cold_outlet_f double precision;
  v_g_amenam_lmtd_f double precision;
  v_g_amenam_area_ft2 double precision;
  v_g_amenam_area_per_tube_ft2 double precision;
  v_g_amenam_area_margin_pct double precision;
  v_g_ubit_f_correction double precision;
  v_g_ubit_p1_two_shells double precision;
  v_g_ubit_u_clean double precision;
  v_g_ubit_u_dirty double precision;
  v_g_ubit_fouling_penalty_pct double precision;
  v_g_ubit_controlling_margin_pct double precision;
  v_g_okwori_design_lmtd_f double precision;
  v_g_okwori_design_effectiveness double precision;
  v_g_okwori_capacity_ratio double precision;
  v_g_okwori_ua_btu_hr_f double precision;
  v_g_okwori_hotday_ntu double precision;
  v_g_okwori_hotday_process_out_f double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'heattransfer' and active;
  if v_structures <> 3 then
    raise exception 'FC6 go-live refused: heattransfer has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'heattransfer';
  if v_questions <> 396 then
    raise exception 'FC6 go-live refused: heattransfer has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'heattransfer'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'heattransfer' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'heattransfer' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'heattransfer'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'heattransfer';
  if v_capstones <> 3 then
    raise exception 'FC6 go-live refused: heattransfer has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'heattransfer' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC6 go-live refused: heattransfer carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'heattransfer' and s.active;
  if v_modules <> 18 then
    raise exception 'FC6 go-live refused: heattransfer carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner will ever be served.
  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'heattransfer' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'heattransfer';
  if v_graded <> 18 then
    raise exception 'FC6 go-live refused: heattransfer has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'heattransfer' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'heattransfer' and module = 'facilities'
                    and path_order = 44 and prereq_slug is null) then
    raise exception 'FC6 go-live refused: the heattransfer catalogue row is not facilities at path_order 44 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 44 and slug <> 'heattransfer') then
    raise exception 'FC6 go-live refused: another course already holds path_order 44';
  end if;


  -- ------------------------------------------- the held-for-literature gates
  -- ON THE NAME. A graded field that NAMES a quantity this module holds for the
  -- literature is refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['bundle_diameter', 'shell_diameter', 'fan_bhp', 'fan_hp', 'motor_hp', 'acfm', 'air_density', 'reynolds', 'prandtl', 'nusselt', 'film_coefficient', 'cross_flow_f']) frag
   where c.app_slug = 'heattransfer' and (f->>'key') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['bundle diameter', 'shell diameter', 'fan horsepower', 'motor horsepower', 'cross-flow correction', 'reynolds number', 'prandtl number', 'nusselt number', 'dittus', 'sieder', 'air density']) frag
   where c.app_slug = 'heattransfer' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a held number, within its own
  -- shipped tolerance, is a lookup of a quantity this module refuses to source.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.023, 0.0402, 0.0743, 0.14, 0.156, 0.158, 0.175, 0.215, 0.249, 0.319, 0.4, 0.6, 0.65, 0.8, 0.92, 2.142, 2.207, 2.207, 2.263, 2.285, 2.291, 2.499, 2.617, 3.66, 26.0, 2300.0, 6356.0, 10000.0], array['the Dittus-Boelter coefficient', 'a held bundle constant on the 45 and 90 degree layout', 'a held bundle constant on the 30 degree layout', 'the Sieder-Tate viscosity ratio exponent', 'a held bundle constant on the 45 and 90 degree layout', 'a held bundle constant on the 45 and 90 degree layout', 'a held bundle constant on the 30 degree layout', 'a held bundle constant on the 45 and 90 degree layout', 'a held bundle constant on the 30 degree layout', 'a held bundle constant on the 30 degree layout', 'the Dittus-Boelter Prandtl exponent, the heating form', 'the default fan static pressure, which names no machine', 'the default fan efficiency', 'the Dittus-Boelter Reynolds exponent', 'the default motor efficiency', 'a held bundle exponent on the 30 degree layout', 'a held bundle exponent on the 30 degree layout', 'a held bundle exponent on the 45 and 90 degree layout', 'a held bundle exponent on the 45 and 90 degree layout', 'a held bundle exponent on the 30 degree layout', 'a held bundle exponent on the 45 and 90 degree layout', 'a held bundle exponent on the 30 degree layout', 'a held bundle exponent on the 45 and 90 degree layout', 'the laminar constant-wall-temperature Nusselt number', 'the default wall conductivity, which names no material', 'the lower edge of the transition band', 'the fan constant', 'the upper edge of the transition band']) as h(val, lab)
   where c.app_slug = 'heattransfer'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A graded field within its own
  -- tolerance of one of them is a lookup rather than a calculation, and the
  -- tolerance used is the SHIPPED one, which for six of the eighteen is the
  -- widened 5e-7 and not the stated 1e-9. Sweeping at the stated tolerance
  -- would pass a collision the shipped grade would hit.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 2.604e-06, 2.609e-06, 6.41e-06, 6.423e-06, 1.3021e-05, 1.3153e-05, 1.8519e-05, 1.8556e-05, 3.2051e-05, 3.2376e-05, 4.5573e-05, 4.7247e-05, 9.2593e-05, 9.3531e-05, 0.0001, 0.000112179, 0.000116299, 0.000141927, 0.000160091, 0.000228791, 0.000324074, 0.000335975, 0.000349359, 0.000394071, 0.001, 0.001009259, 0.001138428, 0.001825609, 0.002, 0.002208398, 0.002419355, 0.005, 0.0051, 0.01, 0.010856543, 0.023, 0.035, 0.05, 0.05807317, 0.063880487, 0.067854412, 0.068439697, 0.069203861, 0.071139633, 0.071524401, 0.0763416, 0.092603, 0.1, 0.109, 0.14, 0.171875, 0.196735, 0.198351, 0.2, 0.204107, 0.204853, 0.205991, 0.207144, 0.211516, 0.212184, 0.21284, 0.213502, 0.216806, 0.219343, 0.221199, 0.24, 0.25, 0.271401, 0.3, 0.310086, 0.31606, 0.31628, 0.32, 0.337662, 0.34375, 0.35, 0.361625, 0.377589, 0.388435, 0.4, 0.407158, 0.428571, 0.430237, 0.433686, 0.445221, 0.45, 0.461685, 0.469595, 0.471623, 0.481287, 0.483917, 0.485576, 0.491489, 0.497242, 0.499938, 0.5, 0.517151, 0.517913, 0.52, 0.527633, 0.530965, 0.53994, 0.541514, 0.544585, 0.545902, 0.55, 0.562044, 0.564733, 0.568604, 0.573455, 0.58, 0.583333, 0.58495, 0.585781, 0.585786, 0.588924, 0.597755, 0.6, 0.605699, 0.606, 0.606059, 0.606061, 0.60721, 0.62, 0.628836, 0.634231, 0.643699, 0.645161, 0.65, 0.652, 0.654869, 0.65977, 0.676796, 0.695454, 0.7, 0.700802, 0.703518, 0.70356, 0.704, 0.710909, 0.718595, 0.72, 0.722222, 0.732, 0.739037, 0.740726, 0.740741, 0.75, 0.751428, 0.753403, 0.774194, 0.77687, 0.783246, 0.8, 0.800677, 0.802278, 0.809194, 0.810219, 0.812903, 0.813593, 0.818182, 0.82, 0.823843, 0.829902, 0.830054, 0.833333, 0.834, 0.83871, 0.85, 0.871782, 0.875, 0.882889, 0.888889, 0.890323, 0.89781, 0.897945, 0.899076, 0.9, 0.90087, 0.903226, 0.91, 0.916283, 0.92, 0.920456, 0.925726, 0.926208, 0.92881, 0.932636, 0.93866, 0.941935, 0.945353, 0.947601, 0.948089, 0.956204, 0.956604, 0.957197, 0.96445, 0.964693, 0.972592, 0.977841, 0.980645, 0.9811, 0.988891, 0.989954, 0.99, 0.990786, 0.992029, 0.996196, 0.996407, 0.997939, 0.998166, 0.999, 0.999228, 0.999587, 0.999665, 0.999948, 0.999971, 0.999983, 0.999985, 0.99999, 0.999993, 0.999999, 1.0, 1.000001, 1.000002134913, 1.000004832191, 1.002005, 1.010135, 1.019355, 1.036724, 1.043796, 1.054086, 1.058065, 1.064473, 1.087591, 1.089365, 1.127984, 1.172829, 1.2, 1.209677, 1.229097, 1.278498, 1.4, 1.445734, 1.5, 1.7, 1.960784, 2.0, 2.107398, 2.4, 2.416739, 2.419088, 2.4191, 2.5, 2.6, 2.909091, 3.0, 3.141593, 3.66, 4.0, 4.066024, 4.074796, 4.074815, 4.5, 5.0, 5.1, 5.235988, 5.667097, 6.0, 7.0, 7.559687, 8.0, 8.294057, 9.0, 9.211035, 9.899233, 10.0, 10.210712, 10.731577, 10.7316, 11.0, 12.0, 12.399233, 12.67893, 13.0, 13.2, 13.235036, 14.0, 14.039145, 14.3, 14.7, 15.0, 15.119375, 16.0, 16.235036, 16.742253, 17.0, 18.0, 18.669077, 19.0, 19.000124, 19.557352, 19.854977, 20.0, 20.307045, 20.341632, 20.698071, 20.833333, 21.0, 21.065693, 21.13039, 21.169077, 21.444352, 21.500124, 22.284762, 22.354977, 22.807045, 22.986286, 23.198071, 23.225806, 23.254065, 23.343066, 23.63039, 23.944352, 24.0, 24.387097, 24.861314, 25.16129, 25.48, 25.486286, 26.0, 26.27365, 26.709677, 27.096774, 27.1, 27.138686, 28.258065, 28.277372, 28.9625, 29.419355, 29.894634, 30.0, 30.23875, 30.580645, 31.0, 31.495796, 31.741935, 36.0, 37.0, 44.757033, 45.0, 45.45, 45.454545, 46.055174, 50.0, 51.612903, 56.0, 58.0, 60.0, 62.3033, 62.303335, 64.0, 65.625, 67.484127, 68.047035, 69.311296, 69.52119, 70.0, 71.970982, 72.0, 73.85, 74.0, 75.0, 75.912371, 80.0, 80.313089, 82.901805, 83.613627, 84.515865, 85.263896, 85.26409, 86.0, 86.879945, 86.914164, 88.498488, 90.0, 90.214702, 92.0, 92.110348, 92.518373, 94.0, 94.003933, 94.119941, 94.434723, 95.0, 95.09825, 98.0, 98.422851, 99.08825, 100.0, 102.178189, 103.531935, 104.0, 105.0, 106.971929, 107.70462, 109.696299, 110.0, 110.909091, 110.91, 112.0, 113.0, 114.011627, 117.741935, 118.0, 120.0, 120.58484, 122.0, 122.580645, 124.0, 125.0, 127.419355, 130.0, 130.06, 130.064846, 130.10839, 132.258065, 132.8125, 134.375, 134.45941, 137.0, 138.709677, 142.824087, 144.193548, 145.242063, 146.625908, 148.064516, 148.348423, 148.387097, 150.0, 151.255474, 151.935484, 154.627737, 155.0, 155.806452, 157.246707, 158.0, 159.677419, 159.7, 160.0, 160.967742, 161.372263, 165.0, 165.625, 165.868613, 166.129032, 167.515873, 168.709677, 170.0, 172.580645, 172.613139, 177.484127, 180.0, 183.60677, 183.6364, 185.448625, 190.0, 195.272975, 199.9, 200.0, 216.158486, 218.75, 220.0, 222.331111, 223.0, 228.530818, 229.543151, 232.0, 232.477856, 235.0, 249.017598, 250.0, 251.0, 260.0, 270.0, 274.0, 280.0, 286.311271, 298.0, 300.0, 309.843653, 309.844251, 312.0, 319.0, 320.0, 330.32756, 332.813879, 332.814522, 335.103216, 340.0, 345.692714, 459.67, 495.583267, 500.0, 502.654825, 547.762384, 559.901439, 578.703704, 583.078474, 600.0, 638.0, 647.823324, 755.96875, 757.644042, 800.0, 860.0, 860.796387, 900.0, 980.0, 991.166535, 994.597468, 1129.767467, 1129.769651, 1200.0, 1214.749159, 1431.684995, 1450.0, 1985.035182, 2000.0, 2004.336113, 2300.0, 2600.0, 3303.88845, 3304.0, 4377.0, 5212.574934, 6000.0, 6356.0, 6607.7769, 6608.0, 9843.591536, 10000.0, 11012.9615, 12000.0, 22025.923, 24779.163375, 27500.0, 30560.968162, 30561.115839, 33000.0, 33658.0518, 33658.214442, 36660.428319, 44051.846, 45000.0, 45275.508389, 45880.0, 45993.308239, 50000.0, 52125.749338, 54330.610066, 66077.769, 74000.0, 80000.0, 110580.3328, 110880.0, 112000.0, 120000.0, 125636.640925, 150000.0, 176729.1173, 186968.1844, 200000.0, 220259.229998, 234565.872, 400000.0, 581948.0744, 598226.3422, 647279.7513, 648078.5374, 666666.6667, 682288.662, 712886.3911, 1629918.301989, 2483974.359, 2750000.0, 2777777.7778, 3200000.0, 5000000.0, 5046800.0, 5200000.0, 6666666.6667, 6666666.6671, 8000000.0, 12558394.1606, 12740000.0, 12740000.0007, 13916058.3942, 14000000.0, 14821167.8832, 15483870.9677, 15483870.9691, 15500000.0, 16178832.1168, 16258064.5161, 16774193.5484, 16774193.5498, 16857664.2336, 17806451.6129, 18064516.129, 18064516.1306, 18838709.6774, 19612903.2258, 20000000.0, 20387096.7742, 21161290.3226]) pub
   where c.app_slug = 'heattransfer'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;

  -- EVERY NUMBER A LEARNER IS HANDED, read by POSTGRES out of the shipped
  -- prompt rather than out of a generator's copy of it.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\.?[0-9]*', 'g') as m
   where c.app_slug = 'heattransfer' and p.app_slug = 'heattransfer'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'heattransfer') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'heattransfer') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'heattransfer') gg
   where c.app_slug = 'heattransfer' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_amenam_duty_btu_hr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_duty_btu_hr';
  select (f->>'expected')::double precision into v_g_amenam_cold_outlet_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_cold_outlet_f';
  select (f->>'expected')::double precision into v_g_amenam_lmtd_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_lmtd_f';
  select (f->>'expected')::double precision into v_g_amenam_area_ft2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_area_ft2';
  select (f->>'expected')::double precision into v_g_amenam_area_per_tube_ft2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_area_per_tube_ft2';
  select (f->>'expected')::double precision into v_g_amenam_area_margin_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'beginner' and f->>'key' = 'amenam_area_margin_pct';
  select (f->>'expected')::double precision into v_g_ubit_f_correction
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_f_correction';
  select (f->>'expected')::double precision into v_g_ubit_p1_two_shells
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_p1_two_shells';
  select (f->>'expected')::double precision into v_g_ubit_u_clean
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_u_clean';
  select (f->>'expected')::double precision into v_g_ubit_u_dirty
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_u_dirty';
  select (f->>'expected')::double precision into v_g_ubit_fouling_penalty_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_fouling_penalty_pct';
  select (f->>'expected')::double precision into v_g_ubit_controlling_margin_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'intermediate' and f->>'key' = 'ubit_controlling_margin_pct';
  select (f->>'expected')::double precision into v_g_okwori_design_lmtd_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_design_lmtd_f';
  select (f->>'expected')::double precision into v_g_okwori_design_effectiveness
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_design_effectiveness';
  select (f->>'expected')::double precision into v_g_okwori_capacity_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_capacity_ratio';
  select (f->>'expected')::double precision into v_g_okwori_ua_btu_hr_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_ua_btu_hr_f';
  select (f->>'expected')::double precision into v_g_okwori_hotday_ntu
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_hotday_ntu';
  select (f->>'expected')::double precision into v_g_okwori_hotday_process_out_f
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'heattransfer' and c.tier = 'advanced' and f->>'key' = 'okwori_hotday_process_out_f';
  if v_g_amenam_duty_btu_hr is null
     or v_g_amenam_cold_outlet_f is null
     or v_g_amenam_lmtd_f is null
     or v_g_amenam_area_ft2 is null
     or v_g_amenam_area_per_tube_ft2 is null
     or v_g_amenam_area_margin_pct is null
     or v_g_ubit_f_correction is null
     or v_g_ubit_p1_two_shells is null
     or v_g_ubit_u_clean is null
     or v_g_ubit_u_dirty is null
     or v_g_ubit_fouling_penalty_pct is null
     or v_g_ubit_controlling_margin_pct is null
     or v_g_okwori_design_lmtd_f is null
     or v_g_okwori_design_effectiveness is null
     or v_g_okwori_capacity_ratio is null
     or v_g_okwori_ua_btu_hr_f is null
     or v_g_okwori_hotday_ntu is null
     or v_g_okwori_hotday_process_out_f is null then
    raise exception 'FC6 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.amenam_duty_btu_hr, beginner.amenam_cold_outlet_f, beginner.amenam_lmtd_f, beginner.amenam_area_ft2, beginner.amenam_area_per_tube_ft2, beginner.amenam_area_margin_pct, intermediate.ubit_f_correction, intermediate.ubit_p1_two_shells, intermediate.ubit_u_clean, intermediate.ubit_u_dirty, intermediate.ubit_fouling_penalty_pct, intermediate.ubit_controlling_margin_pct, advanced.okwori_design_lmtd_f, advanced.okwori_design_effectiveness, advanced.okwori_capacity_ratio, advanced.okwori_ua_btu_hr_f, advanced.okwori_hotday_ntu, advanced.okwori_hotday_process_out_f]';
  end if;

  -- -------------------------------------------------- the Associate, AMENAM
  -- The duty is the HOT capacity rate on the specified hot outlet. The outlet
  -- is stated, so the duty is an answer and not a condition.
  if abs(v_g_amenam_duty_btu_hr - 62000.0 * 0.58 * (328.0 - 214.0)) > 1e-06 then
    raise exception 'FC6 go-live refused: the duty of % Btu an hour is not the hot capacity rate of % lb an hour at % Btu per lb degF across the specified drop from % to % degF [graded field: beginner.amenam_duty_btu_hr]', v_g_amenam_duty_btu_hr, 62000.0, 0.58, 328.0, 214.0;
  end if;

  -- The cold outlet is that duty put into the cold stream.
  if abs(v_g_amenam_cold_outlet_f - (119.0 + v_g_amenam_duty_btu_hr / (91000.0 * 0.97))) > 1e-11 then
    raise exception 'FC6 go-live refused: the cold outlet of % degF is not the cold inlet of % degF plus the graded duty of % Btu an hour spread over the cold capacity rate [graded field: beginner.amenam_cold_outlet_f, beginner.amenam_duty_btu_hr]', v_g_amenam_cold_outlet_f, 119.0, v_g_amenam_duty_btu_hr;
  end if;

  -- THE SECOND ROUTE TO THE DUTY. The same heat read from the COLD side. This
  -- shares no arithmetic with the hot-side statement above, and it is the
  -- balance the whole tier is built on.
  if abs(91000.0 * 0.97 * (v_g_amenam_cold_outlet_f - 119.0) - v_g_amenam_duty_btu_hr) > 1e-06 then
    raise exception 'FC6 go-live refused: the cold stream carries % Btu an hour against the graded duty of %, so the two sides of the balance disagree [graded field: beginner.amenam_cold_outlet_f, beginner.amenam_duty_btu_hr]', 91000.0 * 0.97 * (v_g_amenam_cold_outlet_f - 119.0), v_g_amenam_duty_btu_hr;
  end if;

  -- The counter-current log mean, off the two END differences.
  v_dt1 := 328.0 - v_g_amenam_cold_outlet_f;
  v_dt2 := 214.0 - 119.0;
  if abs(v_g_amenam_lmtd_f - (v_dt1 - v_dt2) / ln(v_dt1 / v_dt2)) > 1e-11 then
    raise exception 'FC6 go-live refused: the log mean of % degF is not the counter-current mean of end differences % and % degF [graded field: beginner.amenam_lmtd_f]', v_g_amenam_lmtd_f, v_dt1, v_dt2;
  end if;

  -- AND A ROUTE ITS OWN FORMULA CANNOT SUPPLY. A log mean lies STRICTLY between
  -- the geometric and the arithmetic mean of its two end differences whenever
  -- those differ. No rearrangement of the log mean gives this; it is a fact
  -- about the three means, and it is what catches a log mean built on the wrong
  -- pairing of terminals.
  if not (v_g_amenam_lmtd_f > sqrt(v_dt1 * v_dt2)
          and v_g_amenam_lmtd_f < (v_dt1 + v_dt2) / 2.0) then
    raise exception 'FC6 go-live refused: the log mean of % degF does not lie between the geometric mean % and the arithmetic mean % of its own end differences, so it is not a log mean of this pairing [graded field: beginner.amenam_lmtd_f]', v_g_amenam_lmtd_f, sqrt(v_dt1 * v_dt2), (v_dt1 + v_dt2) / 2.0;
  end if;

  -- The surface, at the stated coefficient and an F of 1.
  if abs(v_g_amenam_area_ft2 - v_g_amenam_duty_btu_hr / (126.0 * v_g_amenam_lmtd_f)) > 1e-11 then
    raise exception 'FC6 go-live refused: the surface of % ft2 is not the graded duty of % over the stated coefficient of % Btu per hr ft2 degF and the graded log mean of % degF [graded field: beginner.amenam_area_ft2, beginner.amenam_duty_btu_hr, beginner.amenam_lmtd_f]', v_g_amenam_area_ft2, v_g_amenam_duty_btu_hr, 126.0, v_g_amenam_lmtd_f;
  end if;

  -- AND BACK THE OTHER WAY, which is the design equation read as a product
  -- rather than as a quotient.
  if abs(126.0 * v_g_amenam_area_ft2 * v_g_amenam_lmtd_f - v_g_amenam_duty_btu_hr) > 1e-06 then
    raise exception 'FC6 go-live refused: U times the graded area of % ft2 times the graded log mean of % degF gives % Btu an hour against the graded duty of % [graded field: beginner.amenam_area_ft2, beginner.amenam_lmtd_f, beginner.amenam_duty_btu_hr]', v_g_amenam_area_ft2, v_g_amenam_lmtd_f, 126.0 * v_g_amenam_area_ft2 * v_g_amenam_lmtd_f, v_g_amenam_duty_btu_hr;
  end if;

  -- One tube's OUTSIDE surface. The diameter is in inches and the length in
  -- feet, and the twelve is a float because this file will not divide an
  -- integer by an integer anywhere.
  if abs(v_g_amenam_area_per_tube_ft2 - pi() * (0.875 / 12.0) * 18.0) > 1e-12 then
    raise exception 'FC6 go-live refused: the surface of one tube, % ft2, is not pi times the % inch outside diameter in feet times the % ft length [graded field: beginner.amenam_area_per_tube_ft2]', v_g_amenam_area_per_tube_ft2, 0.875, 18.0;
  end if;

  -- THE TWO ROUNDINGS, which is what the tier is built on. The count is rounded
  -- UP to cover the surface, and then UP again to a whole multiple of the pass
  -- count, because a bundle divides its tubes equally between its passes.
  v_ncover := ceil(v_g_amenam_area_ft2 / v_g_amenam_area_per_tube_ft2);
  v_ntubes := ceil(v_ncover / 2.0) * 2.0;
  if abs(v_g_amenam_area_margin_pct - ((v_ntubes * v_g_amenam_area_per_tube_ft2 - v_g_amenam_area_ft2) / v_g_amenam_area_ft2) * 100.0) > 1e-12 then
    raise exception 'FC6 go-live refused: the surface margin of % percent is not the overshoot of % tubes at % ft2 each over the required % ft2 [graded field: beginner.amenam_area_margin_pct, beginner.amenam_area_per_tube_ft2, beginner.amenam_area_ft2]', v_g_amenam_area_margin_pct, v_ntubes, v_g_amenam_area_per_tube_ft2, v_g_amenam_area_ft2;
  end if;

  -- AND THE SECOND ROUNDING MUST BITE. If the covering count were already a
  -- whole multiple of the passes the margin would grade the first rounding
  -- only, and a candidate who skipped the second would score full marks.
  if v_ntubes = v_ncover then
    raise exception 'FC6 go-live refused: the covering count of % tubes is already a whole multiple of the pass count, so the graded surface margin of % percent does not discriminate the pass rounding at all [graded field: beginner.amenam_area_margin_pct]', v_ncover, v_g_amenam_area_margin_pct;
  end if;
  if v_g_amenam_area_margin_pct <= 0.0 then
    raise exception 'FC6 go-live refused: the surface margin of % percent is not positive, and a whole number of tubes cannot undershoot its own requirement [graded field: beginner.amenam_area_margin_pct]', v_g_amenam_area_margin_pct;
  end if;


  -- ------------------------------------------------- the Professional, UBIT
  -- P and R off the four terminals, then Bowman's closed form at ONE shell
  -- pass, where the equivalent single-shell P is P itself.
  v_p := (233.0 - 135.0) / (405.0 - 135.0);
  v_r := (405.0 - 265.0) / (233.0 - 135.0);
  v_root := sqrt(v_r * v_r + 1.0);
  if abs(v_g_ubit_f_correction
         - ((v_root / (v_r - 1.0)) * ln((1.0 - v_p) / (1.0 - v_p * v_r)))
           / ln((2.0 / v_p - 1.0 - v_r + v_root) / (2.0 / v_p - 1.0 - v_r - v_root))) > 1e-12 then
    raise exception 'FC6 go-live refused: the correction factor of % at one shell pass is not the closed form at P = % and R = % [graded field: intermediate.ubit_f_correction]', v_g_ubit_f_correction, v_p, v_r;
  end if;

  -- A correction factor is a fraction of the counter-current driving force, so
  -- it cannot exceed one, and below 0.8 the curve is too steep for the engine
  -- to answer without a warning. This capstone is built above that.
  if v_g_ubit_f_correction > 1.0 or v_g_ubit_f_correction < 0.8 then
    raise exception 'FC6 go-live refused: the correction factor of % is not between 0.8 and 1, so the case is either impossible or in the steep band the engine warns about [graded field: intermediate.ubit_f_correction]', v_g_ubit_f_correction;
  end if;

  -- THE EQUIVALENT SINGLE-SHELL P, ASSERTED BY THE EQUATION IT IS A ROOT OF.
  -- The engine reaches it in closed form through an intermediate. Restating
  -- that algebra here would validate nothing, so what is checked instead is the
  -- DEFINING relation: N shells in series carry the whole-unit P if and only if
  -- the per-shell group raised to the shell count returns it.
  if abs(power((1.0 - v_g_ubit_p1_two_shells * v_r) / (1.0 - v_g_ubit_p1_two_shells), 2.0)
         - (1.0 - v_p * v_r) / (1.0 - v_p)) > 1e-12 then
    raise exception 'FC6 go-live refused: the equivalent single-shell P of % is not a root of the shell-series relation at % shells, P = % and R = % [graded field: intermediate.ubit_p1_two_shells]', v_g_ubit_p1_two_shells, 2.0, v_p, v_r;
  end if;

  -- And it must sit BELOW the whole-unit P, which is the whole point of buying
  -- a second shell: each shell does less of the job.
  if not v_g_ubit_p1_two_shells < v_p then
    raise exception 'FC6 go-live refused: the equivalent single-shell P of % is not below the whole-unit P of %, so the second shell bought nothing [graded field: intermediate.ubit_p1_two_shells]', v_g_ubit_p1_two_shells, v_p;
  end if;

  -- THE FIVE NAMED RESISTANCES. Both films and the wall conductivity are STATED
  -- conditions of this study, so nothing here is looked up and no fitted
  -- correlation is read.
  v_rout := 1.0 / 265.0;
  v_rwall := (0.875 / 12.0) * ln(0.875 / 0.729) / (2.0 * 29.0);
  v_rin := (0.875 / 0.729) / 1120.0;
  v_rfoulin := (0.875 / 0.729) * 0.0025;
  v_clean := v_rout + v_rwall + v_rin;
  v_total := v_rout + 0.0015 + v_rwall + v_rin + v_rfoulin;

  if abs(v_g_ubit_u_clean - 1.0 / v_clean) > 1e-10 then
    raise exception 'FC6 go-live refused: the clean coefficient of % Btu per hr ft2 degF is not the reciprocal of the three clean resistances summing to % [graded field: intermediate.ubit_u_clean]', v_g_ubit_u_clean, v_clean;
  end if;
  if abs(v_g_ubit_u_dirty - 1.0 / v_total) > 1e-10 then
    raise exception 'FC6 go-live refused: the dirty coefficient of % Btu per hr ft2 degF is not the reciprocal of all five resistances summing to % [graded field: intermediate.ubit_u_dirty]', v_g_ubit_u_dirty, v_total;
  end if;

  -- THE FOULING PENALTY FROM THE TWO GRADED COEFFICIENTS, which is a route with
  -- nothing in common with the resistance stack that produced either of them.
  if abs(v_g_ubit_fouling_penalty_pct - (1.0 - v_g_ubit_u_dirty / v_g_ubit_u_clean) * 100.0) > 1e-11 then
    raise exception 'FC6 go-live refused: the fouling penalty of % percent is not what the graded dirty coefficient of % costs against the graded clean coefficient of % [graded field: intermediate.ubit_fouling_penalty_pct, intermediate.ubit_u_dirty, intermediate.ubit_u_clean]', v_g_ubit_fouling_penalty_pct, v_g_ubit_u_dirty, v_g_ubit_u_clean;
  end if;

  -- THE CONTROLLING MARGIN, off the ranked stack rather than off a hardcoded
  -- verdict. Which resistance leads is READ here, so a stack that reordered
  -- would be caught instead of being quietly graded against yesterday's winner.
  select r1, r2 into v_top, v_next from (
    select x as r1, lead(x) over (order by x desc) as r2
      from unnest(array[v_rout, 0.0015, v_rwall, v_rin, v_rfoulin]) x
     order by x desc limit 1) t;
  if abs(v_g_ubit_controlling_margin_pct - ((v_top - v_next) / v_top) * 100.0) > 1e-11 then
    raise exception 'FC6 go-live refused: the controlling margin of % percent is not how far the largest resistance % leads the runner up % [graded field: intermediate.ubit_controlling_margin_pct]', v_g_ubit_controlling_margin_pct, v_top, v_next;
  end if;

  -- A margin under the ten percent this module calls clear is a coin toss, and
  -- UBIT is built on a stack where the lead is clear.
  if v_g_ubit_controlling_margin_pct < 10.0 then
    raise exception 'FC6 go-live refused: the controlling resistance leads by only % percent, under the 10 percent this module calls clear, so the verdict the tier teaches is a coin toss on this case [graded field: intermediate.ubit_controlling_margin_pct]', v_g_ubit_controlling_margin_pct;
  end if;


  -- ------------------------------------------------------ the Expert, OKWORI
  -- The design log mean of the bay, against air that enters at the design
  -- ambient and leaves it by the stated rise.
  v_dt1 := 268.0 - (93.0 + 27.0);
  v_dt2 := 172.0 - 93.0;
  if abs(v_g_okwori_design_lmtd_f - (v_dt1 - v_dt2) / ln(v_dt1 / v_dt2)) > 1e-11 then
    raise exception 'FC6 go-live refused: the design log mean of % degF is not the mean of end differences % and % degF [graded field: advanced.okwori_design_lmtd_f]', v_g_okwori_design_lmtd_f, v_dt1, v_dt2;
  end if;

  -- The two capacity rates the bay is read through, each of them the stated
  -- duty over the stated span of its own stream.
  v_cprocess := 26400000.0 / (268.0 - 172.0);
  v_cair := 26400000.0 / 27.0;
  v_cmin := least(v_cprocess, v_cair);
  v_cmax := greatest(v_cprocess, v_cair);

  -- EFFECTIVENESS FROM ITS DEFINITION, which is the duty over the most the
  -- smaller capacity rate could ever carry against the air it is given. No
  -- arrangement and no correction factor is read, and that is the point: the
  -- cross-flow correction is the one quantity this bay declines to source.
  if abs(v_g_okwori_design_effectiveness - 26400000.0 / (v_cmin * (268.0 - 93.0))) > 1e-13 then
    raise exception 'FC6 go-live refused: the design effectiveness of % is not the stated duty over the smaller capacity rate % across the design approach of % degF [graded field: advanced.okwori_design_effectiveness]', v_g_okwori_design_effectiveness, v_cmin, 268.0 - 93.0;
  end if;
  if v_g_okwori_design_effectiveness <= 0.0 or v_g_okwori_design_effectiveness >= 1.0 then
    raise exception 'FC6 go-live refused: the design effectiveness of % is not a fraction between 0 and 1 [graded field: advanced.okwori_design_effectiveness]', v_g_okwori_design_effectiveness;
  end if;

  if abs(v_g_okwori_capacity_ratio - v_cmin / v_cmax) > 1e-13 then
    raise exception 'FC6 go-live refused: the capacity ratio of % is not the smaller capacity rate % over the larger % [graded field: advanced.okwori_capacity_ratio]', v_g_okwori_capacity_ratio, v_cmin, v_cmax;
  end if;

  -- THE UA THE BAY HOLDS. Fixed, which is what makes the hot day a rating
  -- question rather than a design one.
  if abs(v_g_okwori_ua_btu_hr_f - 26400000.0 / v_g_okwori_design_lmtd_f) > 1e-06 then
    raise exception 'FC6 go-live refused: the UA of % Btu per hr degF is not the stated duty over the graded design log mean of % degF [graded field: advanced.okwori_ua_btu_hr_f, advanced.okwori_design_lmtd_f]', v_g_okwori_ua_btu_hr_f, v_g_okwori_design_lmtd_f;
  end if;

  if abs(v_g_okwori_hotday_ntu - v_g_okwori_ua_btu_hr_f / v_cmin) > 1e-13 then
    raise exception 'FC6 go-live refused: the NTU of % is not the graded UA of % Btu per hr degF over the smaller capacity rate % [graded field: advanced.okwori_hotday_ntu, advanced.okwori_ua_btu_hr_f]', v_g_okwori_hotday_ntu, v_g_okwori_ua_btu_hr_f, v_cmin;
  end if;

  -- THE HOT DAY. The same effectiveness and the same air mass against a hotter
  -- approach, and the outlet that leaves.
  v_q2 := v_g_okwori_design_effectiveness * v_cmin * (268.0 - 113.0);
  if abs(v_g_okwori_hotday_process_out_f - (268.0 - v_q2 / v_cprocess)) > 1e-11 then
    raise exception 'FC6 go-live refused: the hot-day process outlet of % degF is not the inlet of % degF less the hot-day duty of % Btu an hour over the process capacity rate [graded field: advanced.okwori_hotday_process_out_f]', v_g_okwori_hotday_process_out_f, 268.0, v_q2;
  end if;

  -- AND IT MUST MISS THE DESIGN OUTLET, or the hot day is not a hot day and the
  -- tier's whole question does not arise.
  if v_g_okwori_hotday_process_out_f <= 172.0 then
    raise exception 'FC6 go-live refused: the bay still reaches its design outlet of % degF on the hot day, leaving at % degF, so the rating teaches nothing [graded field: advanced.okwori_hotday_process_out_f]', 172.0, v_g_okwori_hotday_process_out_f;
  end if;

  -- THE SECOND METHOD, AND IT IS THE REASON THE FC6-0 REPAIR EXISTS. The hot
  -- day has now been rated by effectiveness-NTU. Rate it AGAIN by the surface
  -- equation, q = UA x LMTD, at the same fixed UA and at the hot-day terminals,
  -- and the two must return the same duty. Before the repair the engine
  -- satisfied NEITHER, and it was this disagreement that found the defect. This
  -- single assertion reads the graded UA, the graded effectiveness and the
  -- graded hot-day outlet, and it shares no arithmetic with any of the three.
  v_rise2 := v_q2 / v_cair;
  v_e1 := 268.0 - (113.0 + v_rise2);
  v_e2 := v_g_okwori_hotday_process_out_f - 113.0;
  if not (v_e1 > 0.0 and v_e2 > 0.0) then
    raise exception 'FC6 go-live refused: the hot-day terminals cross, with end differences % and % degF, so the second method cannot be taken at all', v_e1, v_e2;
  end if;
  v_lm2 := (v_e1 - v_e2) / ln(v_e1 / v_e2);
  if abs(v_g_okwori_ua_btu_hr_f * v_lm2 - v_q2) > 1e-06 then
    raise exception 'FC6 go-live refused: THE SECOND METHOD DISAGREES. The graded UA of % Btu per hr degF across the hot-day log mean of % degF gives % Btu an hour, against the % the graded effectiveness of % and the graded hot-day outlet of % degF produce [graded field: advanced.okwori_ua_btu_hr_f, advanced.okwori_design_effectiveness, advanced.okwori_hotday_process_out_f]', v_g_okwori_ua_btu_hr_f, v_lm2, v_g_okwori_ua_btu_hr_f * v_lm2, v_q2, v_g_okwori_design_effectiveness, v_g_okwori_hotday_process_out_f;
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'heattransfer';
  if not exists (select 1 from public.academy_apps
                  where slug = 'heattransfer' and status = 'available') then
    raise exception 'FC6 go-live refused: heattransfer did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC6 go-live: heattransfer available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
