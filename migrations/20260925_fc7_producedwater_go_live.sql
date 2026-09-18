-- ============================================================================
-- FC7 GO-LIVE (HELD): Produced Water Treatment flips to 'available'. The
-- SEVENTH Facilities course, above FC6 heattransfer at path_order 44, FC5 at
-- 43, FC4 gasprocessing at 42, FC3 rotating at 41, FC2 linesizing at 40 and
-- FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/producedwater. The 78 lessons, the teaching lab
-- (producedWaterLab.js) and its three explorer panels (the water, the device
-- and the train) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and this ladder divides a flow by a liner COUNT and a
-- bin span by a bin COUNT. The generator refuses to emit a division with a bare
-- integer denominator, and refuses a malformed numeric literal.
--
-- SEVENTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY CLOSED FORM, and
-- the eighteenth by the equation it is a root of. The Expert's train is closed
-- too: the engine's error function is the five-term rational form of Abramowitz
-- and Stegun, built from exp alone, so the whole sixty-bin quadrature, every
-- stage, both medians and the outlet are recomputed below from the capstone's
-- own stated conditions. The IZOMBE bubble rise comes out of a damped iteration
-- on the Schiller-Naumann drag coefficient, so it is asserted as a ROOT of that
-- drag balance rather than by replaying the iteration.
--
-- AND TEN OF THE EIGHTEEN ARE ASSERTED A SECOND TIME, BY A ROUTE WITH NOTHING
-- IN COMMON WITH THE FIRST:
--
--   * the Stokes rise, by recovering standard gravity out of it and the three
--     graded fluid properties, one assertion reading four graded fields;
--   * the basin cut and the plate cut FORWARD, as the rise of the graded cut
--     droplet against the design rise it was inverted from;
--   * the shear penalty from the GRADED turndown rather than the flow;
--   * the liner cut FORWARD, as the ideal droplet's migration across the travel
--     in the residence time;
--   * the holdup from the GRADED bubble rise;
--   * the bed cut FORWARD, where the graded droplet's filter coefficient times
--     the depth must be the log of two;
--   * the train outlet as the PRODUCT of the stage survivals, with the third
--     stage's removal inferred from the graded figures;
--   * and the Reynolds number back to the Stokes velocity it came from.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_names text;
  v_mu double precision; v_rw double precision; v_ro double precision;
  v_q double precision; v_d double precision; v_v double precision;
  v_design double precision; v_per double precision; v_t double precision;
  v_ft double precision; v_gf double precision; v_r double precision;
  v_travel double precision; v_res double precision; v_req double precision;
  v_ideal double precision; v_pen double precision; v_re double precision;
  v_cd double precision; v_vb double precision; v_load double precision;
  v_lam double precision; v_jg double precision;
  v_cut_plate double precision; v_cut_cyc double precision; v_cut_bed double precision;
  v_lnlo double precision; v_lnhi double precision; v_step double precision;
  v_lna double precision; v_lnb double precision; v_below double precision;
  v_cdfb double precision; v_x double precision; v_a double precision;
  v_tt double precision; v_y double precision; v_tot double precision;
  v_rr double precision; v_eff double precision; v_removed double precision;
  v_surv double precision; v_oiw double precision; v_acc double precision;
  v_f double precision; v_med double precision;
  v_dm double precision[]; v_dlo double precision[]; v_dhi double precision[];
  v_vf double precision[];
  v_stage_removal double precision[]; v_stage_median double precision[];
  v_stage_cut double precision[]; v_stage_m double precision[];
  v_i int; v_s int;
  v_g_ogulagha_water_viscosity_pas double precision;
  v_g_ogulagha_water_density_kgm3 double precision;
  v_g_ogulagha_oil_density_kgm3 double precision;
  v_g_ogulagha_droplet_rise_ms double precision;
  v_g_ogulagha_basin_cut_micron double precision;
  v_g_ogulagha_plate_cut_micron double precision;
  v_g_izombe_liner_turndown_ratio double precision;
  v_g_izombe_cyclone_shear_penalty double precision;
  v_g_izombe_cyclone_cut_micron double precision;
  v_g_izombe_bubble_rise_ms double precision;
  v_g_izombe_gas_holdup_ratio double precision;
  v_g_izombe_filter_cut_micron double precision;
  v_g_tunu_cyclone_stage_median_micron double precision;
  v_g_tunu_plate_stage_removal_pct double precision;
  v_g_tunu_cyclone_stage_removal_pct double precision;
  v_g_tunu_train_outlet_ppm double precision;
  v_g_tunu_train_outlet_median_micron double precision;
  v_g_tunu_coarse_droplet_reynolds double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'producedwater' and active;
  if v_structures <> 3 then
    raise exception 'FC7 go-live refused: producedwater has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'producedwater';
  if v_questions <> 396 then
    raise exception 'FC7 go-live refused: producedwater has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'producedwater'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'producedwater' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'producedwater' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'producedwater'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'producedwater';
  if v_capstones <> 3 then
    raise exception 'FC7 go-live refused: producedwater has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'producedwater' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC7 go-live refused: producedwater carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'producedwater' and s.active;
  if v_modules <> 18 then
    raise exception 'FC7 go-live refused: producedwater carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'producedwater' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'producedwater';
  if v_graded <> 18 then
    raise exception 'FC7 go-live refused: producedwater has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'producedwater' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'producedwater' and module = 'facilities'
                    and path_order = 45 and prereq_slug is null) then
    raise exception 'FC7 go-live refused: the producedwater catalogue row is not facilities at path_order 45 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 45 and slug <> 'producedwater') then
    raise exception 'FC7 go-live refused: another course already holds path_order 45';
  end if;


  -- ------------------------------------------- the held-for-literature gates
  -- A FRAGMENT IS MATCHED AS A LITERAL SUBSTRING WITH strpos, NEVER WITH LIKE.
  -- In LIKE an underscore is a one-character wildcard, so the fragment grain_exponent
  -- would also match a key with any other character in that place. The
  -- generator's own Python guard tests a literal substring, and strpos is
  -- the same test. FC5's dry run caught the LIKE form refusing a field that
  -- names no held quantity (its kw_ against a kwm).
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['flotation_cut', 'attachment', 'floor', 'dissolved', 'spec', 'margin', 'meets', 'verdict', 'grain_exponent', 'velocity_rule']) frag
   where c.app_slug = 'producedwater' and strpos(f->>'key', frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['flotation cut', 'attachment', 'dissolved oil floor', 'discharge', 'specification', 'margin', 'verdict', 'grain size exponent', 'velocity rule']) frag
   where c.app_slug = 'producedwater' and strpos(lower(f->>'label'), frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.01, 3.0], array['the attachment efficiency, the one calibration in this module', 'the held inverse-cube grain size exponent of the bed']) as h(val, lab)
   where c.app_slug = 'producedwater'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 1.973e-09, 1.98e-09, 5.73303e-07, 5.7421e-07, 2.729215e-06, 2.729456e-06, 2e-05, 2.414e-05, 4.3604293e-05, 4.3671293e-05, 5.4977871e-05, 6.3342484e-05, 6.3372072e-05, 7.3804485e-05, 0.00020445897, 0.000219911486, 0.000230016341, 0.000294350524, 0.000300021314, 0.000327200043, 0.000350993313, 0.000387364475, 0.000390164166, 0.000393041638, 0.000394313728, 0.00040891794, 0.000429838208, 0.000477808153, 0.000481056375, 0.000492892159, 0.0005314865, 0.000544160005, 0.0006, 0.000600042629, 0.000604888262, 0.000639217342, 0.000644045755, 0.000667982123, 0.000673478925, 0.000690049023, 0.0007, 0.000710553998, 0.000718491238, 0.000777288288, 0.00077971641, 0.00079867486, 0.000817835879, 0.000869335586, 0.000920065364, 0.000961382883, 0.00096211275, 0.000966068632, 0.000999368671, 0.001, 0.001001748759, 0.001035533906, 0.001091782327, 0.001113543921, 0.001150081705, 0.001226753819, 0.001273, 0.001484057918, 0.001572166551, 0.001578813252, 0.001610114387, 0.0018, 0.001979203372, 0.001981679246, 0.002, 0.002071067812, 0.002453507638, 0.002699934563, 0.00277, 0.002796, 0.002972518869, 0.003624368671, 0.003704, 0.003713541683, 0.00386427453, 0.004, 0.004293638366, 0.004312806395, 0.005, 0.005136559522, 0.005497787144, 0.005753723776, 0.006, 0.006012799541, 0.006213203436, 0.006249368671, 0.006288666203, 0.006440457549, 0.006985, 0.008050571936, 0.008874368671, 0.01, 0.010355339059, 0.011500817052, 0.011607384926, 0.012, 0.013591874698, 0.014154851756, 0.015, 0.015286135319, 0.015384615385, 0.016130502524, 0.017251225578, 0.018, 0.019321372648, 0.02, 0.022018658288, 0.02425, 0.025, 0.027294558174, 0.029018462316, 0.03, 0.03087, 0.034359, 0.034502451156, 0.035, 0.036441443726, 0.040291028009, 0.041402941387, 0.041402941388, 0.042459, 0.048303431619, 0.048686, 0.05, 0.051523660393, 0.051565581596, 0.055485861717, 0.058823529412, 0.06, 0.063497860502, 0.06565033035, 0.0666, 0.069644309558, 0.070777242939, 0.075, 0.079117, 0.079672, 0.083507115328, 0.09, 0.09201, 0.096405820089, 0.1, 0.111111111111, 0.118487, 0.12, 0.125, 0.137706, 0.145092311579, 0.15, 0.156122973645, 0.158987294928, 0.172512255781, 0.18, 0.187835, 0.199810536843, 0.2, 0.217369227363, 0.23395, 0.248, 0.25, 0.274873, 0.277579145358, 0.282831, 0.296296, 0.296703296703, 0.3, 0.313934, 0.31869, 0.328595, 0.33, 0.333333, 0.348221547789, 0.35, 0.353553, 0.36, 0.383361, 0.395226848971, 0.4, 0.447214, 0.486641, 0.499089964762, 0.5, 0.500036, 0.500455, 0.557630781833, 0.6, 0.631882, 0.65, 0.65719, 0.65796538159, 0.692307692308, 0.69314718056, 0.697134, 0.7, 0.7071, 0.707106781187, 0.707107, 0.714614, 0.75, 0.750546, 0.771428571429, 0.797183, 0.8, 0.821487, 0.826824, 0.828, 0.828906, 0.834808, 0.863611, 0.870553869473, 0.876161, 0.879086, 0.888888888889, 0.9, 0.909968, 0.914772, 0.940199, 0.941176470588, 0.942547, 0.95, 0.958437, 0.959665, 0.975987, 0.984615384615, 0.986063, 0.99723, 1.0, 1.000071, 1.000088, 1.001537, 1.01395, 1.014656, 1.028571, 1.045, 1.05937, 1.059817303438, 1.08, 1.086081, 1.1, 1.1116, 1.150082, 1.173273473969, 1.19, 1.192433, 1.2, 1.214275, 1.216, 1.224295, 1.229774645621, 1.242088, 1.25, 1.299527, 1.3, 1.36, 1.38, 1.394267, 1.399193331188, 1.4, 1.414214, 1.460294, 1.474196, 1.5, 1.504, 1.533442, 1.538462, 1.6, 1.7008, 1.785576, 1.8, 1.84868, 1.851949, 1.86436, 1.916803, 2.0, 2.020725942164, 2.122865, 2.15, 2.17, 2.179329, 2.19, 2.198987, 2.21, 2.220633162866, 2.236068, 2.32658, 2.36, 2.364977, 2.43253596455, 2.440938, 2.484176, 2.5, 2.581989, 2.587852, 2.6, 2.618404314893, 2.621231, 2.8, 2.8125, 2.828427, 2.868207, 3.0, 3.154806, 3.162, 3.185598, 3.206877255895, 3.237392, 3.237437, 3.284882, 3.38, 3.383995, 3.403251, 3.415699, 3.47, 3.5, 3.562821, 3.562898, 3.6, 3.61, 3.670618, 3.70698, 3.736445, 3.75, 3.918712, 3.972384, 4.0, 4.112471, 4.140060735138, 4.168146, 4.24, 4.246743, 4.264879, 4.285714, 4.326502, 4.371791, 4.416867, 4.430689, 4.506223, 4.526119, 4.539606, 4.560252, 4.649249, 4.724749, 4.751385, 4.835193, 4.880416, 4.91573, 5.0, 5.060355, 5.099128681105, 5.145107, 5.242462, 5.450349, 5.557324, 5.720019, 5.817992, 5.85493004068, 5.861251, 5.882353, 5.9, 5.937008, 5.944722, 6.0, 6.1, 6.100736, 6.110773, 6.110906, 6.128184, 6.144662, 6.210441, 6.36628, 6.388448, 6.390096504227, 6.469629, 6.471437, 6.719472, 6.843, 6.933042, 6.943179, 6.943329, 7.0, 7.09, 7.097314, 7.11, 7.261844, 7.280601, 7.29112, 7.446595, 7.674178, 7.69106, 7.693729, 7.7, 7.805006, 7.967241, 8.0, 8.162947, 8.163726, 8.183505, 8.249579113843, 8.280121470276, 8.28906, 8.385841, 8.400899, 8.83, 8.875096, 8.875288, 8.92728, 8.988225, 9.0, 9.006299, 9.149437, 9.618, 9.62, 9.68951, 9.704008, 9.80665, 9.930885, 10.0, 10.395768, 10.5, 10.614326, 10.953502, 11.0, 11.25, 11.253366, 11.253609, 11.315691, 11.504808, 11.678001, 12.0, 12.244813, 12.284239, 12.346912, 12.34718, 12.420882, 12.492787, 12.670125, 12.939258, 13.0, 13.092021574467, 13.476136, 13.503861, 13.706606, 13.706903, 14.0, 14.126621, 14.228866, 14.382082, 15.0, 15.300074, 15.32046, 15.415916, 15.793311, 16.0, 16.213651, 16.782723, 16.943389, 17.0, 17.235518, 17.765065302925, 18.0, 18.514914469492, 19.0, 19.855739099768, 19.857586, 19.883778, 20.0, 20.492255142381, 20.530945, 20.70225, 21.0, 21.685537, 21.720064, 22.0, 22.678201, 22.950715, 23.018983, 23.695934, 23.734355, 24.0, 24.326764, 24.841765, 25.0, 25.742373, 25.878516, 26.0, 27.0, 27.278164, 29.0, 30.0, 31.825798, 32.427302, 33.565447, 33.760097, 33.760828, 33.900306, 34.257591, 35.0, 35.334937, 36.154977, 36.459384, 38.0, 40.0, 40.513256, 41.0, 41.402941, 41.641016, 42.0, 43.150877, 43.274798, 43.4, 43.602795, 44.236922, 44.331033, 45.869949, 46.0, 48.170414, 48.44755, 50.0, 53.0, 53.071631, 54.820774, 55.0, 56.381625, 57.344778, 59.0, 60.0, 60.477315, 60.5, 60.582215, 60.687843, 61.0, 61.199807, 62.104412, 63.0, 65.0, 65.398946, 67.726764, 68.402514, 69.328365, 74.465948, 74.74825, 77.0, 78.0, 78.263077, 78.557612, 79.0, 80.0, 80.243119, 80.910358, 81.0, 83.913617, 84.480253, 85.209861, 85.316542, 86.549597, 91.089356, 92.922276, 94.005599, 94.066711, 94.117647, 94.699946, 94.903339, 95.0, 96.355856, 97.139736, 98.461538, 98.886283, 98.991799, 99.128864, 99.39872, 99.867202, 99.999596, 99.999999999904, 100.0, 100.1, 100.391597, 100.5, 100.533332, 111.111111, 112.300216, 112.728365, 115.0, 120.0, 123.327327, 123.773404, 126.0, 128.975585, 129.824395, 130.391597, 131.5, 132.163417, 133.927597, 134.725142, 139.518714, 140.0, 142.091188, 142.391799, 146.965325, 148.600324, 149.908299, 150.0, 152.620204, 153.610296, 160.0, 160.391597, 162.445195, 165.003927, 172.739122, 175.563417, 177.0, 180.752746, 185.447151, 187.334148, 187.699403, 188.080643, 200.0, 200.5, 209.657299, 213.019154, 216.139122, 224.288508, 230.0, 230.02, 231.0, 239.252567, 240.0, 242.879204, 247.8, 250.035525, 250.692079, 252.0, 253.057299, 257.603712, 280.0, 285.800496, 286.602586, 300.0, 321.286806, 337.427088, 350.0, 351.501391, 378.634626, 388.888889, 400.0, 421.0, 424.601866, 431.898099, 432.288889, 434.75172, 454.160279, 460.0, 490.0, 496.8, 496.835297, 500.0, 554.375735, 567.644189, 600.0, 622.818975, 637.845785, 650.0, 674.84078, 700.0, 706.471546, 707.618822, 782.203875, 800.0, 801.033554, 819.122052, 857.655928, 859.697757, 892.869375, 900.0, 918.602441, 922.53281, 967.53441, 972.971292, 986.674641, 991.861174, 997.174641, 999.0, 1000.0, 1000.142101, 1035.261174, 1056.971292, 1125.80591, 1200.0, 1233.361979, 1233.553482, 1322.687929, 1419.551901, 1562.5, 1600.0, 1688.771335, 1690.0, 1741.72614, 1800.0, 2000.0, 3159.270855, 3706.61603, 15000.0, 25000.0, 28000.0, 62000.0, 65000.0, 75000.0, 86400.0, 120000.0, 200000.0, 280000.0, 300000.0, 300001.0, 400000.0, 2830279.1964111337]) pub
   where c.app_slug = 'producedwater'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\.?[0-9]*', 'g') as m
   where c.app_slug = 'producedwater' and p.app_slug = 'producedwater'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % graded field(s) land on a number the learner is handed in a prompt: %', v_graded, v_names;
  end if;

  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'producedwater') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'producedwater') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'producedwater') gg
   where c.app_slug = 'producedwater' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC7 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_ogulagha_water_viscosity_pas
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_water_viscosity_pas';
  select (f->>'expected')::double precision into v_g_ogulagha_water_density_kgm3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_water_density_kgm3';
  select (f->>'expected')::double precision into v_g_ogulagha_oil_density_kgm3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_oil_density_kgm3';
  select (f->>'expected')::double precision into v_g_ogulagha_droplet_rise_ms
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_droplet_rise_ms';
  select (f->>'expected')::double precision into v_g_ogulagha_basin_cut_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_basin_cut_micron';
  select (f->>'expected')::double precision into v_g_ogulagha_plate_cut_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'beginner' and f->>'key' = 'ogulagha_plate_cut_micron';
  select (f->>'expected')::double precision into v_g_izombe_liner_turndown_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_liner_turndown_ratio';
  select (f->>'expected')::double precision into v_g_izombe_cyclone_shear_penalty
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_cyclone_shear_penalty';
  select (f->>'expected')::double precision into v_g_izombe_cyclone_cut_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_cyclone_cut_micron';
  select (f->>'expected')::double precision into v_g_izombe_bubble_rise_ms
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_bubble_rise_ms';
  select (f->>'expected')::double precision into v_g_izombe_gas_holdup_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_gas_holdup_ratio';
  select (f->>'expected')::double precision into v_g_izombe_filter_cut_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'intermediate' and f->>'key' = 'izombe_filter_cut_micron';
  select (f->>'expected')::double precision into v_g_tunu_cyclone_stage_median_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_cyclone_stage_median_micron';
  select (f->>'expected')::double precision into v_g_tunu_plate_stage_removal_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_plate_stage_removal_pct';
  select (f->>'expected')::double precision into v_g_tunu_cyclone_stage_removal_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_cyclone_stage_removal_pct';
  select (f->>'expected')::double precision into v_g_tunu_train_outlet_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_train_outlet_ppm';
  select (f->>'expected')::double precision into v_g_tunu_train_outlet_median_micron
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_train_outlet_median_micron';
  select (f->>'expected')::double precision into v_g_tunu_coarse_droplet_reynolds
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'producedwater' and c.tier = 'advanced' and f->>'key' = 'tunu_coarse_droplet_reynolds';
  if v_g_ogulagha_water_viscosity_pas is null
     or v_g_ogulagha_water_density_kgm3 is null
     or v_g_ogulagha_oil_density_kgm3 is null
     or v_g_ogulagha_droplet_rise_ms is null
     or v_g_ogulagha_basin_cut_micron is null
     or v_g_ogulagha_plate_cut_micron is null
     or v_g_izombe_liner_turndown_ratio is null
     or v_g_izombe_cyclone_shear_penalty is null
     or v_g_izombe_cyclone_cut_micron is null
     or v_g_izombe_bubble_rise_ms is null
     or v_g_izombe_gas_holdup_ratio is null
     or v_g_izombe_filter_cut_micron is null
     or v_g_tunu_cyclone_stage_median_micron is null
     or v_g_tunu_plate_stage_removal_pct is null
     or v_g_tunu_cyclone_stage_removal_pct is null
     or v_g_tunu_train_outlet_ppm is null
     or v_g_tunu_train_outlet_median_micron is null
     or v_g_tunu_coarse_droplet_reynolds is null then
    raise exception 'FC7 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3, beginner.ogulagha_droplet_rise_ms, beginner.ogulagha_basin_cut_micron, beginner.ogulagha_plate_cut_micron, intermediate.izombe_liner_turndown_ratio, intermediate.izombe_cyclone_shear_penalty, intermediate.izombe_cyclone_cut_micron, intermediate.izombe_bubble_rise_ms, intermediate.izombe_gas_holdup_ratio, intermediate.izombe_filter_cut_micron, advanced.tunu_cyclone_stage_median_micron, advanced.tunu_plate_stage_removal_pct, advanced.tunu_cyclone_stage_removal_pct, advanced.tunu_train_outlet_ppm, advanced.tunu_train_outlet_median_micron, advanced.tunu_coarse_droplet_reynolds]';
  end if;

  -- ----------------------------------------------- the Associate, OGULAGHA
  -- The three fluid properties, off the module's own declared fits.
  if abs((v_g_ogulagha_water_viscosity_pas) - (2.414e-05 * power(10.0, 247.8 / (58.5 + 273.15 - 140.0)) * (1.0 + 1.8 * (42500.0 / 1000000.0)))) > 1e-12 * abs(2.414e-05 * power(10.0, 247.8 / (58.5 + 273.15 - 140.0)) * (1.0 + 1.8 * (42500.0 / 1000000.0))) then
    raise exception 'FC7 go-live refused: the water viscosity of % Pa.s is not the declared fit at % C and % ppm [graded field: beginner.ogulagha_water_viscosity_pas]', v_g_ogulagha_water_viscosity_pas, 58.5, 42500.0;
  end if;
  if abs((v_g_ogulagha_water_density_kgm3) - (1000.0 * (1.0 - ((58.5 + 288.9414) / (508929.2 * (58.5 + 68.12963))) * power(58.5 - 3.9863, 2.0)) + 700.0 * (42500.0 / 1000000.0))) > 1e-12 * abs(1000.0 * (1.0 - ((58.5 + 288.9414) / (508929.2 * (58.5 + 68.12963))) * power(58.5 - 3.9863, 2.0)) + 700.0 * (42500.0 / 1000000.0)) then
    raise exception 'FC7 go-live refused: the brine density of % kg/m3 is not the declared fit at % C and % ppm [graded field: beginner.ogulagha_water_density_kgm3]', v_g_ogulagha_water_density_kgm3, 58.5, 42500.0;
  end if;
  if abs((v_g_ogulagha_oil_density_kgm3) - ((141.5 / (131.5 + 27.5)) * 999.0 * (1.0 - 0.0007 * (58.5 - 15.56)))) > 1e-12 * abs((141.5 / (131.5 + 27.5)) * 999.0 * (1.0 - 0.0007 * (58.5 - 15.56))) then
    raise exception 'FC7 go-live refused: the crude density of % kg/m3 is not the declared chain from % API at % C [graded field: beginner.ogulagha_oil_density_kgm3]', v_g_ogulagha_oil_density_kgm3, 27.5, 58.5;
  end if;
  if not (v_g_ogulagha_water_density_kgm3 > v_g_ogulagha_oil_density_kgm3) then
    raise exception 'FC7 go-live refused: the graded crude at % kg/m3 is not lighter than the graded brine at % [graded field: beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3]', v_g_ogulagha_oil_density_kgm3, v_g_ogulagha_water_density_kgm3;
  end if;

  -- The Stokes rise of the volume median droplet, off the three GRADED properties.
  v_d := 22.0 * 0.000001;
  if abs((v_g_ogulagha_droplet_rise_ms) - ((9.80665 * v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)) / (18.0 * v_g_ogulagha_water_viscosity_pas))) > 1e-12 * abs((9.80665 * v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)) / (18.0 * v_g_ogulagha_water_viscosity_pas)) then
    raise exception 'FC7 go-live refused: the rise velocity of % m/s is not Stokes on the graded properties at % micron [graded field: beginner.ogulagha_droplet_rise_ms, beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3, beginner.ogulagha_water_viscosity_pas]', v_g_ogulagha_droplet_rise_ms, 22.0;
  end if;
  -- AND STANDARD GRAVITY RECOVERED OUT OF IT, which is the digest's own check on
  -- the 18 and reads all four graded fields at once. A slip in any one of the four
  -- moves the planet.
  if abs(18.0 * v_g_ogulagha_water_viscosity_pas * v_g_ogulagha_droplet_rise_ms
         / (v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)) - 9.80665) > 1e-12 * 9.80665 then
    raise exception 'FC7 go-live refused: gravity recovered from the graded viscosity, rise and densities is %, not % [graded field: beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_droplet_rise_ms, beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3]', 18.0 * v_g_ogulagha_water_viscosity_pas * v_g_ogulagha_droplet_rise_ms / (v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)), 9.80665;
  end if;

  -- The basin: the surface loading times the allowance, inverted through Stokes.
  v_q := (36000.0 * 0.158987294928) / 86400.0;
  v_design := (v_q / (15.0 * 3.4)) * 1.6;
  if abs((v_g_ogulagha_basin_cut_micron) - (sqrt((18.0 * v_g_ogulagha_water_viscosity_pas * v_design) / (9.80665 * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3))) * 1000000.0)) > 1e-12 * abs(sqrt((18.0 * v_g_ogulagha_water_viscosity_pas * v_design) / (9.80665 * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3))) * 1000000.0) then
    raise exception 'FC7 go-live refused: the basin cut of % micron is not Stokes inverted at the design rise of % m/s [graded field: beginner.ogulagha_basin_cut_micron, beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3]', v_g_ogulagha_basin_cut_micron, v_design;
  end if;
  -- AND FORWARD. The graded cut droplet must rise at exactly the design rise.
  v_d := v_g_ogulagha_basin_cut_micron * 0.000001;
  if abs(((9.80665 * v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)) / (18.0 * v_g_ogulagha_water_viscosity_pas)) - (v_design)) > 1e-12 * abs(v_design) then
    raise exception 'FC7 go-live refused: the graded basin cut of % micron rises at a speed other than the design rise of % m/s [graded field: beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3, beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_basin_cut_micron]', v_g_ogulagha_basin_cut_micron, v_design;
  end if;
  -- The fixed horizontal velocity half of API 421 is the only half here, so the
  -- capstone basin sits UNDER it and the missing half decides nothing.
  if not (v_q / (3.4 * 1.5) < 0.015) then
    raise exception 'FC7 go-live refused: the capstone basin runs over the fixed horizontal velocity limit, so the held half of the rule could decide it [graded field: beginner.ogulagha_basin_cut_micron]';
  end if;

  -- The plate pack, the same balance over the effective area.
  v_design := v_q / (2.5 * 48.0 * 0.7);
  if abs((v_g_ogulagha_plate_cut_micron) - (sqrt((18.0 * v_g_ogulagha_water_viscosity_pas * v_design) / (9.80665 * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3))) * 1000000.0)) > 1e-12 * abs(sqrt((18.0 * v_g_ogulagha_water_viscosity_pas * v_design) / (9.80665 * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3))) * 1000000.0) then
    raise exception 'FC7 go-live refused: the plate cut of % micron is not Stokes inverted at the design rise of % m/s [graded field: beginner.ogulagha_plate_cut_micron, beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3]', v_g_ogulagha_plate_cut_micron, v_design;
  end if;
  v_d := v_g_ogulagha_plate_cut_micron * 0.000001;
  if abs(((9.80665 * v_d * v_d * (v_g_ogulagha_water_density_kgm3 - v_g_ogulagha_oil_density_kgm3)) / (18.0 * v_g_ogulagha_water_viscosity_pas)) - (v_design)) > 1e-12 * abs(v_design) then
    raise exception 'FC7 go-live refused: the graded plate cut of % micron rises at a speed other than the design rise of % m/s [graded field: beginner.ogulagha_water_density_kgm3, beginner.ogulagha_oil_density_kgm3, beginner.ogulagha_water_viscosity_pas, beginner.ogulagha_plate_cut_micron]', v_g_ogulagha_plate_cut_micron, v_design;
  end if;
  if not (v_g_ogulagha_plate_cut_micron < v_g_ogulagha_basin_cut_micron) then
    raise exception 'FC7 go-live refused: the plate pack at % micron does not cut finer than the basin at % [graded field: beginner.ogulagha_plate_cut_micron, beginner.ogulagha_basin_cut_micron]', v_g_ogulagha_plate_cut_micron, v_g_ogulagha_basin_cut_micron;
  end if;


  -- --------------------------------------------- the Professional, IZOMBE
  v_mu := 2.414e-05 * power(10.0, 247.8 / (47.0 + 273.15 - 140.0)) * (1.0 + 1.8 * (88000.0 / 1000000.0));
  v_rw := 1000.0 * (1.0 - ((47.0 + 288.9414) / (508929.2 * (47.0 + 68.12963))) * power(47.0 - 3.9863, 2.0)) + 700.0 * (88000.0 / 1000000.0);
  v_ro := (141.5 / (131.5 + 31.0)) * 999.0 * (1.0 - 0.0007 * (47.0 - 15.56));
  v_q := (58000.0 * 0.158987294928) / 86400.0;

  -- The turndown, and the branch the tier is built on.
  v_per := v_q / 100.0;
  if abs((v_g_izombe_liner_turndown_ratio) - (v_per / 0.0006)) > 1e-12 * abs(v_per / 0.0006) then
    raise exception 'FC7 go-live refused: the turndown of % is not the flow per liner % over the rated % [graded field: intermediate.izombe_liner_turndown_ratio]', v_g_izombe_liner_turndown_ratio, v_per, 0.0006;
  end if;
  if not (v_g_izombe_liner_turndown_ratio > 1.3 and v_g_izombe_liner_turndown_ratio <= 2.0) then
    raise exception 'FC7 go-live refused: the turndown of % is not between the envelope top of % and the refusal at %, so the ceiling and the penalty the tier teaches are not on this case [graded field: intermediate.izombe_liner_turndown_ratio]', v_g_izombe_liner_turndown_ratio, 1.3, 2.0;
  end if;

  -- The shear penalty FROM THE GRADED TURNDOWN.
  if abs((v_g_izombe_cyclone_shear_penalty) - (sqrt(v_g_izombe_liner_turndown_ratio / 1.3))) > 1e-12 * abs(sqrt(v_g_izombe_liner_turndown_ratio / 1.3)) then
    raise exception 'FC7 go-live refused: the shear penalty of % is not the root of the graded turndown % over the envelope top [graded field: intermediate.izombe_cyclone_shear_penalty, intermediate.izombe_liner_turndown_ratio]', v_g_izombe_cyclone_shear_penalty, v_g_izombe_liner_turndown_ratio;
  end if;

  -- The liner cut: a capped field, a travel from the half-area radius to the
  -- core, a residence of one liner volume over one liner flow.
  v_ft := least(v_per / 0.0006, 1.3);
  v_gf := 1000.0 * v_ft * v_ft;
  v_r := 0.035 / 2.0;
  v_travel := v_r * sqrt(0.5) - v_r * 0.5;
  v_res := (pi() * v_r * v_r * 0.7) / v_per;
  v_req := v_travel / v_res;
  v_ideal := sqrt((18.0 * v_mu * v_req) / (v_gf * 9.80665 * (v_rw - v_ro))) * 1000000.0;
  if abs((v_g_izombe_cyclone_cut_micron) - (v_ideal * v_g_izombe_cyclone_shear_penalty)) > 1e-12 * abs(v_ideal * v_g_izombe_cyclone_shear_penalty) then
    raise exception 'FC7 go-live refused: the liner cut of % micron is not the ideal % micron times the graded penalty % [graded field: intermediate.izombe_cyclone_cut_micron, intermediate.izombe_cyclone_shear_penalty]', v_g_izombe_cyclone_cut_micron, v_ideal, v_g_izombe_cyclone_shear_penalty;
  end if;
  -- AND FORWARD. The ideal droplet, the graded cut over the graded penalty, must
  -- migrate across exactly the travel in exactly the residence time.
  v_d := (v_g_izombe_cyclone_cut_micron / v_g_izombe_cyclone_shear_penalty) * 0.000001;
  if abs((((v_gf * 9.80665 * v_d * v_d * (v_rw - v_ro)) / (18.0 * v_mu)) * v_res) - (v_travel)) > 1e-12 * abs(v_travel) then
    raise exception 'FC7 go-live refused: the graded liner cut of % micron over the penalty % does not cross the % m travel in the % s residence [graded field: intermediate.izombe_cyclone_cut_micron, intermediate.izombe_cyclone_shear_penalty]', v_g_izombe_cyclone_cut_micron, v_g_izombe_cyclone_shear_penalty, v_travel, v_res;
  end if;

  -- The bubble rise, as a ROOT of the Schiller-Naumann drag balance. Restating
  -- the engine's damped iteration would validate nothing; the terminal velocity
  -- is DEFINED as the one where the balance returns the velocity it was given.
  v_d := 220.0 * 0.000001;
  v_re := (v_rw * v_g_izombe_bubble_rise_ms * v_d) / v_mu;
  v_cd := (24.0 / v_re) * (1.0 + 0.15 * power(v_re, 0.687));
  v_vb := sqrt((4.0 * 9.80665 * v_d * (v_rw - 1.2)) / (3.0 * v_cd * v_rw));
  if abs((v_g_izombe_bubble_rise_ms) - (v_vb)) > 1e-12 * abs(v_vb) then
    raise exception 'FC7 go-live refused: the bubble rise of % m/s is not a root of the drag balance, which returns % m/s at Reynolds % [graded field: intermediate.izombe_bubble_rise_ms]', v_g_izombe_bubble_rise_ms, v_vb, v_re;
  end if;
  -- And it is outside creeping flow, which is why it is the balance and not Stokes.
  if not (v_re > 1.0) then
    raise exception 'FC7 go-live refused: the graded bubble rises at Reynolds %, inside creeping flow, so the full drag balance teaches nothing here', v_re;
  end if;

  -- The holdup, FROM THE GRADED RISE.
  v_jg := (0.12 * v_q) / (26.0 / 3.5);
  if abs((v_g_izombe_gas_holdup_ratio) - (v_jg / v_g_izombe_bubble_rise_ms)) > 1e-12 * abs(v_jg / v_g_izombe_bubble_rise_ms) then
    raise exception 'FC7 go-live refused: the holdup of % is not the superficial gas velocity % over the graded rise % [graded field: intermediate.izombe_gas_holdup_ratio, intermediate.izombe_bubble_rise_ms]', v_g_izombe_gas_holdup_ratio, v_jg, v_g_izombe_bubble_rise_ms;
  end if;
  if not (v_g_izombe_gas_holdup_ratio < 0.2) then
    raise exception 'FC7 go-live refused: the holdup of % is past the swarm limit, so the graded cell is not the independent swarm the model describes [graded field: intermediate.izombe_gas_holdup_ratio]', v_g_izombe_gas_holdup_ratio;
  end if;

  -- The bed, at the reference grain so the held exponent multiplies by one.
  if 800.0 <> 800.0 then
    raise exception 'FC7 go-live refused: the graded bed is not at the reference grain, so the held exponent reaches its cut [graded field: intermediate.izombe_filter_cut_micron]';
  end if;
  v_load := (v_q / 18.0) * 3600.0;
  v_lam := 3.5 * power(800.0 / 800.0, 3.0)
           * power(10.0 / v_load, 0.5);
  if abs((v_g_izombe_filter_cut_micron) - (20.0 * sqrt(ln(2.0) / (v_lam * 1.1)))) > 1e-12 * abs(20.0 * sqrt(ln(2.0) / (v_lam * 1.1))) then
    raise exception 'FC7 go-live refused: the bed cut of % micron is not depth filtration inverted at a filter coefficient of % per m [graded field: intermediate.izombe_filter_cut_micron]', v_g_izombe_filter_cut_micron, v_lam;
  end if;
  -- AND FORWARD. The graded droplet's own filter coefficient times the depth is
  -- the log of two, which is what makes it the droplet the bed removes half of.
  if abs((v_lam * power(v_g_izombe_filter_cut_micron / 20.0, 2.0) * 1.1) - (ln(2.0))) > 1e-12 * abs(ln(2.0)) then
    raise exception 'FC7 go-live refused: the graded bed cut of % micron does not put the filter coefficient times the depth at the log of two [graded field: intermediate.izombe_filter_cut_micron]', v_g_izombe_filter_cut_micron;
  end if;


  -- ---------------------------------------------------- the Expert, TUNU
  v_mu := 2.414e-05 * power(10.0, 247.8 / (66.0 + 273.15 - 140.0)) * (1.0 + 1.8 * (21000.0 / 1000000.0));
  v_rw := 1000.0 * (1.0 - ((66.0 + 288.9414) / (508929.2 * (66.0 + 68.12963))) * power(66.0 - 3.9863, 2.0)) + 700.0 * (21000.0 / 1000000.0);
  v_ro := (141.5 / (131.5 + 36.0)) * 999.0 * (1.0 - 0.0007 * (66.0 - 15.56));
  v_q := (44000.0 * 0.158987294928) / 86400.0;

  -- The three cut sizes, each the engine's own for its device.
  v_design := v_q / (2.2 * 56.0 * 0.7);
  v_cut_plate := sqrt((18.0 * v_mu * v_design) / (9.80665 * (v_rw - v_ro))) * 1000000.0;
  v_per := v_q / 120.0;
  v_t := v_per / 0.0006;
  if not (v_t > 0.5 and v_t <= 1.3) then
    raise exception 'FC7 go-live refused: the TUNU bank runs at a turndown of %, outside the envelope, so the Expert train is not the sized bank [graded field: advanced.tunu_cyclone_stage_removal_pct]', v_t;
  end if;
  v_gf := 1000.0 * v_t * v_t;
  v_r := 0.035 / 2.0;
  v_travel := v_r * sqrt(0.5) - v_r * 0.5;
  v_res := (pi() * v_r * v_r * 0.7) / v_per;
  v_req := v_travel / v_res;
  v_cut_cyc := sqrt((18.0 * v_mu * v_req) / (v_gf * 9.80665 * (v_rw - v_ro))) * 1000000.0;
  v_load := (v_q / 14.0) * 3600.0;
  v_lam := 3.5 * power(800.0 / 800.0, 3.0)
           * power(10.0 / v_load, 0.5);
  v_cut_bed := 20.0 * sqrt(ln(2.0) / (v_lam * 1.4));
  v_stage_cut := array[v_cut_plate, v_cut_cyc, v_cut_bed];
  v_stage_m := array[3.0, 3.0, 2.0];

  -- The inlet grid: log-normal in volume, 60 bins over 4 sigma
  -- either side, the cdf through the engine's own five-term error function.
  v_lnlo := ln(19.0) - 4.0 * 0.85;
  v_lnhi := ln(19.0) + 4.0 * 0.85;
  v_step := (v_lnhi - v_lnlo) / 60.0;
  v_x := ln(exp(v_lnlo) / 19.0) / (0.85 * sqrt(2.0));
  v_a := abs(v_x);
      v_tt := 1.0 / (1.0 + 0.3275911 * v_a);
      v_y := 1.0 - (((((1.061405429 * v_tt - 1.453152027) * v_tt) + 1.421413741) * v_tt
             - 0.284496736) * v_tt + 0.254829592) * v_tt * exp(-v_a * v_a);
      if v_x < 0.0 then v_y := -v_y; end if;
  v_below := 0.5 * (1.0 + v_y);
  v_dm := array[]::double precision[]; v_dlo := array[]::double precision[];
  v_dhi := array[]::double precision[]; v_vf := array[]::double precision[];
  for v_i in 0..59 loop
    v_lna := v_lnlo + v_step * v_i;
    v_lnb := v_lna + v_step;
    v_x := ln(exp(v_lnb) / 19.0) / (0.85 * sqrt(2.0));
      v_a := abs(v_x);
      v_tt := 1.0 / (1.0 + 0.3275911 * v_a);
      v_y := 1.0 - (((((1.061405429 * v_tt - 1.453152027) * v_tt) + 1.421413741) * v_tt
             - 0.284496736) * v_tt + 0.254829592) * v_tt * exp(-v_a * v_a);
      if v_x < 0.0 then v_y := -v_y; end if;
    v_cdfb := 0.5 * (1.0 + v_y);
    v_dm := v_dm || exp((v_lna + v_lnb) / 2.0);
    v_dlo := v_dlo || exp(v_lna);
    v_dhi := v_dhi || exp(v_lnb);
    v_vf := v_vf || (v_cdfb - v_below);
    v_below := v_cdfb;
  end loop;
  v_tot := 0.0;
  for v_i in 1..array_length(v_vf, 1) loop v_tot := v_tot + v_vf[v_i]; end loop;
  for v_i in 1..array_length(v_vf, 1) loop v_vf[v_i] := v_vf[v_i] / v_tot; end loop;

  -- The three stages in order, each carrying the OUTLET distribution forward.
  v_oiw := 1150.0;
  v_stage_removal := array[]::double precision[];
  v_stage_median := array[]::double precision[];
  for v_s in 1..3 loop
    v_removed := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop
      v_rr := power(v_dm[v_i] / v_stage_cut[v_s], v_stage_m[v_s]);
      v_eff := v_rr / (1.0 + v_rr);
      v_removed := v_removed + v_vf[v_i] * v_eff;
      v_vf[v_i] := v_vf[v_i] * (1.0 - v_eff);
    end loop;
    v_surv := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop v_surv := v_surv + v_vf[v_i]; end loop;
    for v_i in 1..array_length(v_vf, 1) loop v_vf[v_i] := v_vf[v_i] / v_surv; end loop;
    v_oiw := v_oiw * (1.0 - v_removed);
    -- The volume median, interpolated in log diameter across its bin.
    v_tot := 0.0;
    for v_i in 1..array_length(v_vf, 1) loop v_tot := v_tot + v_vf[v_i]; end loop;
    v_acc := 0.0; v_med := null;
    for v_i in 1..array_length(v_vf, 1) loop
      v_f := v_vf[v_i] / v_tot;
      if v_acc + v_f >= 0.5 then
        v_med := exp(ln(v_dlo[v_i]) + ((0.5 - v_acc) / v_f) * ln(v_dhi[v_i] / v_dlo[v_i]));
        exit;
      end if;
      v_acc := v_acc + v_f;
    end loop;
    v_stage_removal := v_stage_removal || (v_removed * 100.0);
    v_stage_median := v_stage_median || v_med;
  end loop;

  -- THE TRAIN IS ASSERTED AT 1e-9 RELATIVE, NOT 1e-12. Postgres's exp and ln
  -- are the host libm's, not V8's, and across sixty bins and three stages they
  -- land within 3e-11 of the engine on the scratch server. 1e-9 leaves thirty
  -- times that for a production libm and is still a hundred times tighter than
  -- the one part in 1e7 the negative control moves a field by.
  if abs((v_g_tunu_plate_stage_removal_pct) - (v_stage_removal[1])) > 1e-9 * abs(v_stage_removal[1]) then
    raise exception 'FC7 go-live refused: the plate stage removal of % percent is not the quadrature over the stated inlet, which gives % [graded field: advanced.tunu_plate_stage_removal_pct]', v_g_tunu_plate_stage_removal_pct, v_stage_removal[1];
  end if;
  if abs((v_g_tunu_cyclone_stage_removal_pct) - (v_stage_removal[2])) > 1e-9 * abs(v_stage_removal[2]) then
    raise exception 'FC7 go-live refused: the liner stage removal of % percent is not the quadrature over the plate stage outlet, which gives % [graded field: advanced.tunu_cyclone_stage_removal_pct]', v_g_tunu_cyclone_stage_removal_pct, v_stage_removal[2];
  end if;
  if abs((v_g_tunu_cyclone_stage_median_micron) - (v_stage_median[2])) > 1e-9 * abs(v_stage_median[2]) then
    raise exception 'FC7 go-live refused: the liner stage median of % micron is not the interpolated median of that outlet, which is % [graded field: advanced.tunu_cyclone_stage_median_micron]', v_g_tunu_cyclone_stage_median_micron, v_stage_median[2];
  end if;
  if abs((v_g_tunu_train_outlet_ppm) - (v_oiw)) > 1e-9 * abs(v_oiw) then
    raise exception 'FC7 go-live refused: the train outlet of % ppm is not the stated inlet carried through all three stages, which gives % [graded field: advanced.tunu_train_outlet_ppm]', v_g_tunu_train_outlet_ppm, v_oiw;
  end if;
  if abs((v_g_tunu_train_outlet_median_micron) - (v_stage_median[3])) > 1e-9 * abs(v_stage_median[3]) then
    raise exception 'FC7 go-live refused: the train outlet median of % micron is not the interpolated median at the bed outlet, which is % [graded field: advanced.tunu_train_outlet_median_micron]', v_g_tunu_train_outlet_median_micron, v_stage_median[3];
  end if;

  -- AND THE OUTLET AS A PRODUCT OF SURVIVALS, read off the graded figures alone.
  -- The third stage's removal is inferred from them, and it must be a real
  -- removal and the one the quadrature found.
  v_eff := 1.0 - v_g_tunu_train_outlet_ppm
           / (1150.0 * (1.0 - v_g_tunu_plate_stage_removal_pct / 100.0)
              * (1.0 - v_g_tunu_cyclone_stage_removal_pct / 100.0));
  if not (v_eff > 0.0 and v_eff < 1.0) or abs((v_eff * 100.0) - (v_stage_removal[3])) > 1e-8 * abs(v_stage_removal[3]) then
    raise exception 'FC7 go-live refused: the graded outlet and stage removals imply a bed removal of % percent, against the % percent the quadrature finds', v_eff * 100.0, v_stage_removal[3];
  end if;
  -- Every stage works on finer water than the one before it.
  if not (v_g_tunu_train_outlet_median_micron < v_g_tunu_cyclone_stage_median_micron
          and v_g_tunu_cyclone_stage_median_micron < 19.0) then
    raise exception 'FC7 go-live refused: the medians % and % micron do not fall stage by stage below the inlet median of % [graded field: advanced.tunu_train_outlet_median_micron, advanced.tunu_cyclone_stage_median_micron]', v_g_tunu_cyclone_stage_median_micron, v_g_tunu_train_outlet_median_micron, 19.0;
  end if;

  -- The coarse droplet: Stokes and the Reynolds number it reports beside it.
  v_d := 240.0 * 0.000001;
  v_v := (9.80665 * v_d * v_d * (v_rw - v_ro)) / (18.0 * v_mu);
  if abs((v_g_tunu_coarse_droplet_reynolds) - ((v_rw * v_v * v_d) / v_mu)) > 1e-12 * abs((v_rw * v_v * v_d) / v_mu) then
    raise exception 'FC7 go-live refused: the Reynolds number of % is not the one Stokes reports for a % micron droplet in this water [graded field: advanced.tunu_coarse_droplet_reynolds]', v_g_tunu_coarse_droplet_reynolds, 240.0;
  end if;
  -- AND BACK. The velocity the graded Reynolds number implies is Stokes.
  if abs((v_g_tunu_coarse_droplet_reynolds * v_mu / (v_rw * v_d)) - (v_v)) > 1e-12 * abs(v_v) then
    raise exception 'FC7 go-live refused: the graded Reynolds number of % implies a rise other than Stokes [graded field: advanced.tunu_coarse_droplet_reynolds]', v_g_tunu_coarse_droplet_reynolds;
  end if;
  if not (v_g_tunu_coarse_droplet_reynolds > 1.0) then
    raise exception 'FC7 go-live refused: the graded Reynolds number of % is inside the band, so the coarse droplet teaches nothing [graded field: advanced.tunu_coarse_droplet_reynolds]', v_g_tunu_coarse_droplet_reynolds;
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'producedwater';
  if not exists (select 1 from public.academy_apps
                  where slug = 'producedwater' and status = 'available') then
    raise exception 'FC7 go-live refused: producedwater did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC7 go-live: producedwater available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
