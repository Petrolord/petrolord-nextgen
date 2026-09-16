-- ============================================================================
-- FC3 GO-LIVE (HELD): Rotating Equipment flips to 'available'. The THIRD
-- Facilities course, above FC2 linesizing at path_order 40 and FC1 separation
-- at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/rotating. The 78 lessons, the teaching lab
-- (rotatingLab.js) and its three explorer panels (the pump, the suction side
-- and the compressor) ship in the zip and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does
-- not exist. Every Facilities and Drilling wave on this programme has held its
-- go-live behind one verified upload.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost
-- a third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this.
-- The generator that wrote this file refuses to emit a division with a bare
-- integer denominator.
--
-- THIRTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM.
-- A head is a static column plus a friction term that goes as the square of
-- flow; a hydraulic power is a flow, a head and a gravity over 3960; a brake
-- power is that through an efficiency; a kilowatt is a horsepower through a
-- conversion that is exact by definition; a pressure head is a pressure
-- difference over a gravity; an affinity law is a square and a cube; a
-- polytropic exponent ratio is k and an efficiency; and a discharge
-- temperature is an inlet temperature times a ratio to that exponent. A
-- capstone quietly recut to another curve, station, gravity, efficiency,
-- suction, speed, ratio or gas fails them outright.
--
-- THE FIVE THAT ARE NOT CLOSED FORM ARE ASSERTED THE ONLY HONEST WAY THERE IS,
-- BY THE EQUATION THEY ARE A ROOT OF.
--
--   * THE THREE DUTY FLOWS come out of a bisection on the difference between
--     a fitted pump curve and a station curve, so each is asserted by that
--     difference being zero AT THE GRADED FLOW. The fitted curve is not
--     handed to this file either: the three coefficients are recomputed here
--     from the four catalogue points by Cramer's rule on the same normal
--     equations pumps.js builds, so the SQL solves the least-squares problem
--     rather than trusting its answer. The parallel flow is the same root
--     with ONE MACHINE TAKING HALF THE FLOW, which is the whole point of the
--     Professional tier: two pumps in parallel deliver far less than twice
--     one pump, and this file asserts that too.
--   * THE POLYTROPIC HEAD carries the stage average compressibility, which is
--     an iterated correlation with no closed form. It is asserted through the
--     one relation that does not need z: the gas horsepower is that head
--     through the mass flow and the polytropic efficiency, EXACTLY, so the
--     two graded values pin each other. The z the head implies is then read
--     back out and required to be a compressed real gas rather than a number.
--   * THE DRIVER FUEL is asserted BY INVERSION, and it is THE ONE VALUE HERE
--     THAT IS NOT PINNED TIGHTLY, which is said rather than left to be
--     discovered. A fuel rate, a heating value and a heat rate give back the
--     brake power the train actually drew, and that power has to be the
--     three-stage machine the staging demands. But the second and third stages
--     hold a compressibility no closed form reaches, so what is asserted is a
--     BAND and not an identity. The dry run measured what the band catches: a
--     move of 3 percent on the fuel is refused and a move of 2.5 percent is
--     not, against one part in 1e7 on every other graded value in this file.
--     Restating the correlation in SQL would be a transcription pretending to
--     be a check, and a gate that restates a formula validates nothing.
--
-- THE STAGE COUNT IS ASSERTED AS THE LARGER OF TWO LIMITS, AND WHICH ONE WON.
-- The ratio limit of 3.8 demands 2 stages and the temperature limit of
-- 285 degF demands 3, so the temperature limit governs. Two stages
-- would reach 294.9683 degF and three reach 221.7762 degF, and this file
-- asserts both, so a recut that made the ratio limit govern instead would be
-- grading a different lesson under the same label.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE ITEM, and that is asserted
-- rather than asserted-by-comment. Eight things are taught here as limits and
-- held: the Hydraulic Institute viscosity correction, the trim shortfall
-- model, the operating-region bands, the NPSH margin rule, the machine
-- screening thresholds, the 300 degF DEFAULT discharge limit, the implied
-- water density away from real water, and the published goldens with the
-- affinity speed band they carry. The capstone calls none of those functions:
-- it grades a SPEED change and never a trim, an NPSH AVAILABLE and never a
-- margin or a verdict, and it states its own 285 degF limit rather than
-- taking the default. Both halves are asserted below, on the labels and again
-- on the values.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_lessons    integer;
  v_modules    integer;
  v_available  integer;
  v_soon       integer;
  v_duty_flow_gpm numeric;
  v_duty_head_ft numeric;
  v_hydraulic_hp numeric;
  v_brake_hp numeric;
  v_motor_input_kw numeric;
  v_discharge_psi numeric;
  v_pressure_head_ft numeric;
  v_npsha_ft numeric;
  v_npsha_raised_ft numeric;
  v_speed_flow_gpm numeric;
  v_speed_head_ft numeric;
  v_parallel_flow_gpm numeric;
  v_exponent_ratio numeric;
  v_ratio_per_stage numeric;
  v_stage1_discharge_f numeric;
  v_stage1_poly_head numeric;
  v_stage1_gas_hp numeric;
  v_fuel_mmscfd numeric;
  -- the working the assertions are built from
  v_pump numeric; v_syst numeric; v_base numeric; v_z numeric;
  v_mass numeric; v_bhp numeric; v_e numeric; v_t1r numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'rotating' and active;
  if v_structures <> 3 then
    raise exception 'FC3 go-live refused: rotating has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'rotating';
  if v_questions <> 396 then
    raise exception 'FC3 go-live refused: rotating has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = 'rotating' group by tier) t
   where t.n <> 132;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, module_key, count(*) n from public.academy_quiz_questions
           where app_slug = 'rotating' and scope = 'module'
           group by tier, module_key) t
   where t.n <> 15;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = 'rotating' and scope = 'final' group by tier) t
   where t.n <> 42;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- Every question offers four options and keys one of them. A bank that lost
  -- an option to an escaping accident still counts as a row.
  select count(*) into v_graded
    from public.academy_quiz_questions
   where app_slug = 'rotating'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'rotating';
  if v_capstones <> 3 then
    raise exception 'FC3 go-live refused: rotating has % capstones, expected 3', v_capstones;
  end if;

  -- 78 lessons across three tiers, 26 each, in six modules each. The lab and
  -- the panels ship in the zip; the lesson KEYS are what this database holds,
  -- so this is the count that has to match the upload.
  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'rotating' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC3 go-live refused: rotating carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'rotating' and s.active;
  if v_modules <> 18 then
    raise exception 'FC3 go-live refused: rotating carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- Every module a question is keyed to is a module the structure declares.
  -- A bank seeded against a module key the manifest renamed would be served
  -- to nobody and would still count 132.
  select count(*) into v_graded
    from (select distinct q.tier, q.module_key
            from public.academy_quiz_questions q
           where q.app_slug = 'rotating' and q.scope = 'module') qm
   where not exists (
     select 1 from public.academy_course_structures s,
            lateral jsonb_array_elements(s.structure->'modules') m
      where s.app_slug = 'rotating' and s.tier = qm.tier and m->>'key' = qm.module_key);
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'rotating';
  if v_graded <> 18 then
    raise exception 'FC3 go-live refused: rotating has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded
    from (select c.tier, count(*) n
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'rotating' group by c.tier) t
   where t.n <> 6;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- The catalogue row itself: the module, the slot and the absence of a
  -- prerequisite are decisions, so they are asserted rather than assumed. FC3
  -- takes 41, directly above FC2 linesizing at 40.
  if not exists (select 1 from public.academy_apps
                  where slug = 'rotating' and module = 'facilities'
                    and path_order = 41 and prereq_slug is null) then
    raise exception 'FC3 go-live refused: the rotating catalogue row is not facilities at path_order 41 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps a, public.academy_apps b
              where a.slug = 'rotating' and b.slug <> 'rotating'
                and b.path_order = a.path_order) then
    raise exception 'FC3 go-live refused: another course already holds path_order 41';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course sizes ROTATING MACHINES. It does not book a reserve, estimate
  -- an ultimate recovery, value a barrel, model a reservoir pressure or size a
  -- pipe. Flows, heads, powers, suction margins, pressure ratios, stage
  -- temperatures, polytropic heads and fuel rates are its subject.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'rotating'
     and (f->>'label' ilike '%reserve%'    or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%npv%'        or f->>'label' ilike '%irr%'
       or f->>'label' ilike '%permeab%'    or f->>'label' ilike '%porosit%'
       or f->>'label' ilike '%decline%'    or f->>'label' ilike '%skin%'
       or f->>'label' ilike '%wall thick%' or f->>'label' ilike '%maop%'
       or f->>'unit'  ilike '%usd%'        or f->>'unit'  ilike '%md%');
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % capstone field(s) grade a quantity these rotating-equipment engines cannot produce', v_graded;
  end if;

  -- ------------------------------- the HELD-FOR-LITERATURE assertion --
  -- Eight things are taught here as limits and held for the literature, and
  -- none may be graded. The hold is neutralised by CONSTRUCTION rather than by
  -- hope: the capstone never calls viscosityCorrection, impellerTrim,
  -- operatingRegion, npshCheck or machineScreen, and it states its own
  -- discharge-temperature limit rather than taking the default.
  --
  -- FC2's dry run caught the crude version of this gate refusing the very
  -- field that PROVES its hold, so this one looks for the name of a LOOKUP and
  -- not for the name of a quantity. 'NPSH available on the suction side as
  -- surveyed' is the field that proves the margin rule is not graded.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'rotating'
     and (f->>'label' ilike '%viscosity correct%'  or f->>'label' ilike '%corrected flow%'
       or f->>'label' ilike '%corrected head%'     or f->>'label' ilike '%trim%'
       or f->>'label' ilike '%operating region%'   or f->>'label' ilike '%best efficiency%'
       or f->>'label' ilike '%preferred%'          or f->>'label' ilike '%required margin%'
       or f->>'label' ilike '%npsh required%'      or f->>'label' ilike '%severity%'
       or f->>'label' ilike '%recommend%'          or f->>'label' ilike '%screening%'
       or f->>'label' ilike '%from the table%'     or f->>'label' ilike '%water density%');
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) name a lookup into a quantity held for the literature', v_graded;
  end if;

  -- And the same hold read off the VALUES, which is the half a label cannot be
  -- trusted for: no graded value is one of the region bands, either half of
  -- the margin rule, one of the screening thresholds, the DEFAULT discharge
  -- limit, either end of the affinity speed band, or the implied water
  -- density.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
                 (50.0), (70.0), (120.0), (140.0), (3.0), (0.35),
                 (500.0), (5000.0), (20000.0), (4.0), (6.0), (200.0),
                 (10000.0), (300.0), (0.5), (1.5), (62.33766233766234)
         ) as held(v)
   where c.app_slug = 'rotating'
     and abs(abs((f->>'expected')::numeric) - held.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) land on a quantity held for the literature', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- EVERY numeric literal the teaching digest prints, all 799 distinct
  -- magnitudes of them, swept out of digest.txt rather than hand picked. A
  -- graded field within its OWN tolerance of one of these is a lookup and not
  -- a calculation. The lessons work the OKONO pump and the SOKU compressor;
  -- the capstone runs ESCRAVOS, BONGA and BONNY and shares no curve point,
  -- station, gravity, efficiency, suction, speed, rate, pressure, temperature,
  -- ratio or heat rate with them.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
                 (0.0), (0.000136363636), (0.000314049587), (0.0005254484459904507), (0.001216798), (0.006), (0.006000000000002004), (0.01),
                 (0.018), (0.028279485058), (0.03246029), (0.074570011), (0.12), (0.137), (0.160628), (0.2),
                 (0.203016), (0.20634920634920634), (0.20634920634920637), (0.21875), (0.21875000000000003), (0.220750552), (0.221789883), (0.23076923076923078),
                 (0.2307692307692308), (0.25635548), (0.257895213), (0.258885372), (0.264550265), (0.270475467), (0.284346004), (0.28571428571428564),
                 (0.2857142857142857), (0.289735099), (0.291666667), (0.293761435), (0.295719844), (0.31684269), (0.320512821), (0.321091712),
                 (0.341215205), (0.343), (0.348432056), (0.35), (0.378429518), (0.3999999999999999), (0.425703013), (0.425703226),
                 (0.432769057), (0.456934987), (0.479919881), (0.49), (0.5), (0.512), (0.524972745), (0.55),
                 (0.551043), (0.5824), (0.593431), (0.598174115), (0.62), (0.637190119), (0.64), (0.648),
                 (0.65), (0.673754678), (0.676936155), (0.7), (0.72), (0.721231896), (0.72253971), (0.729),
                 (0.738126), (0.74), (0.745699871582), (0.75), (0.755), (0.76), (0.764), (0.764282755),
                 (0.78), (0.7999), (0.8), (0.800158099), (0.803437333), (0.806312723), (0.81), (0.82),
                 (0.8272), (0.829792706), (0.835498), (0.837451028), (0.839967688), (0.84), (0.84033581), (0.848),
                 (0.848155), (0.85), (0.86), (0.861851087), (0.86905), (0.869554532), (0.88), (0.881865458),
                 (0.884384331), (0.894963166), (0.89535), (0.9), (0.9025), (0.903178), (0.905043418), (0.918910857),
                 (0.919606033), (0.92), (0.937882), (0.94), (0.946562979), (0.948163998), (0.949032669), (0.9499),
                 (0.95), (0.950697), (0.951552997), (0.951900876), (0.956986144), (0.957006239), (0.958078196), (0.962401519),
                 (0.965583754), (0.968), (0.973162), (0.974896675), (0.97515), (0.979412912), (0.98), (0.980245113),
                 (0.981490716), (0.986868979), (0.987732307), (0.987885118), (0.988340706), (0.988949105), (0.993426696), (0.997024668),
                 (0.999553114), (0.999754151), (0.999983354), (0.999985896), (1.0), (1.000001), (1.0000045236324695), (1.000395783),
                 (1.000525448), (1.004485907), (1.02), (1.033460604), (1.036203885), (1.04), (1.059019153), (1.0639229984758982),
                 (1.084062477), (1.0864981), (1.099939243), (1.1), (1.105087375), (1.108361261), (1.1102230246251565), (1.111809573),
                 (1.1368683772161603), (1.140303), (1.19580457), (1.2), (1.200960144), (1.201015758), (1.21), (1.24),
                 (1.247569076), (1.25), (1.26), (1.28), (1.285), (1.3), (1.32), (1.324503311),
                 (1.331), (1.35), (1.356430057), (1.4), (1.49225), (1.5), (1.522776943887805), (1.532881),
                 (1.661125814), (1.688794663), (1.718977148), (1.75), (1.8), (1.805787796), (1.903801752), (1.940054),
                 (2.0), (2.056367445), (2.1285145351823687), (2.130603693), (2.131775386), (2.15443469), (2.204023061), (2.211629342),
                 (2.213363839), (2.259986545), (2.2737367544323206), (2.31), (2.353953103), (2.398167), (2.5), (2.535719112),
                 (2.553769592), (2.6), (2.603601), (2.7616873004480746), (2.761687300448075), (2.7755575615628914), (2.814633), (2.939549),
                 (2.9723), (3.0), (3.107080181448693), (3.16), (3.168144586), (3.19151), (3.2), (3.260869565),
                 (3.297481363), (3.300511), (3.401478), (3.4354741274000844), (3.5), (3.863407), (4.0), (4.064032),
                 (4.1848), (4.2), (4.257030134), (4.4), (4.440892098500626), (4.5), (4.619291), (4.891304348),
                 (5.0), (5.000000000000004), (5.000000000999993), (5.0000000010000045), (5.010000000000003), (5.09), (5.452254), (5.5),
                 (5.551115123125783), (5.6), (5.856338), (6.0), (6.2), (6.52173913), (6.6), (6.7096),
                 (7.0), (7.615207009), (7.7009), (8.0), (8.1149), (8.228696), (8.5503), (8.571428571),
                 (8.6374), (8.6809), (8.6948), (8.695652174), (8.7679), (8.9856), (9.0), (9.094947017729282),
                 (9.3654), (9.3726), (9.908462939023366), (10.0), (10.3213), (10.397220821), (10.5), (10.706521739),
                 (10.9272), (11.0), (11.4), (11.5), (12.0), (12.3202), (12.411268963), (13.0),
                 (13.043478261), (13.4048), (14.0), (14.6564), (14.7), (15.0), (15.040865), (15.9102),
                 (15.916686), (16.0), (16.2), (16.304347826), (17.0), (18.0), (18.187407), (19.143662),
                 (19.999999999999996), (20.0), (20.652173913), (20.855103295), (21.0), (21.6), (22.0), (22.370673),
                 (23.131214), (24.0), (24.3944), (24.5), (25.0), (25.757576), (25.769092), (26.0),
                 (26.086956522), (27.11), (27.656887), (28.9625), (29.034135), (30.0), (30.540865), (31.040865),
                 (31.41276), (33.479389), (34.0444), (35.0), (35.024468), (35.814), (35.8243), (36.349051),
                 (36.808173), (37.0), (37.870673), (38.370673), (40.0), (40.385733873), (40.409), (40.5),
                 (41.039251), (41.1365), (43.573343), (43.590588), (44.534135), (44.99999999999999), (45.0), (45.034135),
                 (45.7), (47.59089), (48.1372), (48.7044), (49.024519), (49.9), (50.0), (52.308173),
                 (52.808173), (55.0), (55.6252), (56.0), (60.0), (61.0), (62.337662337662), (62.75869),
                 (62.783366), (62.791667), (63.7036), (64.524519), (65.024519), (66.6921), (69.9), (70.0),
                 (71.236058), (80.350994), (81.994), (85.0), (86.736058), (87.236058), (90.0), (92.0),
                 (93.717444), (94.577778), (99.289794), (100.0), (104.0), (107.343736), (108.489657), (110.0),
                 (112.13707), (115.0), (115.659135), (120.0), (120.1), (123.692443), (123.834499), (123.889863),
                 (124.737918), (130.0), (131.159135), (131.659135), (133.437533), (135.450994), (138.0), (140.0),
                 (140.1), (142.532518), (144.0), (148.363379), (150.0), (153.736305), (154.781645), (154.7816454151096),
                 (156.5982), (156.935535), (157.467056), (159.796984), (160.0), (165.0), (172.277556), (175.3008),
                 (176.0), (180.0), (180.062578), (180.155799), (180.866242), (183.041884), (184.0), (188.100891),
                 (188.2466), (198.958569), (200.0), (202.7701), (204.722499), (204.951), (206.365549), (206.811504),
                 (207.9889), (210.0), (211.2066), (213.811175), (218.006), (222.272727), (223.2904), (226.082802),
                 (230.0), (231.0), (231.2948), (233.6372), (241.321868), (243.327313), (243.628747), (244.3748),
                 (244.459069), (246.213642), (246.2503), (249.839372), (250.0), (251.2956), (251.8628), (252.31566),
                 (258.8635), (259.090909), (259.591), (260.0), (264.1757), (265.9556), (266.2663), (267.392652),
                 (269.0103), (269.8918), (271.7647058823529), (272.89), (275.343572), (275.6056), (275.923397), (276.0),
                 (278.1057), (279.636439), (283.749561), (284.0898), (288.0), (289.0728), (289.714512), (290.6346),
                 (291.10177), (294.4), (294.800398), (295.447319), (299.8214), (299.99999999999994), (300.0), (300.00000000000006),
                 (301.1829), (304.75), (306.725662), (307.005319), (308.014664), (308.788996), (309.956214), (310.78945),
                 (312.3981), (317.9889), (318.0), (318.6976), (320.0), (320.454545), (322.0), (323.172),
                 (323.545108), (324.9553), (328.26626), (329.889), (330.203016), (333.5954), (333.6), (334.452969),
                 (334.938111), (335.4044), (338.418825), (344.979482), (345.0), (345.478053), (347.2615), (352.371253),
                 (353.226726), (353.626782), (354.7551), (355.1806), (359.2178), (359.351126), (360.837617), (362.123069),
                 (366.680892), (368.0), (372.181743), (377.065419), (378.6113), (379.483571856287), (379.483572), (380.0),
                 (382.434987), (384.39561), (384.664421), (384.834161), (387.3369), (397.506), (400.0), (401.256098),
                 (406.363636), (406.49486), (406.666408), (413.832653), (414.0), (415.6938), (417.1563), (417.801018),
                 (420.0), (421.147552), (424.0), (424.551043), (428.720607), (430.0), (436.357271), (442.2902),
                 (442.434987), (446.91), (450.0), (458.621768), (459.67), (459.953894), (475.236191), (488.300056),
                 (489.171266), (500.0), (502.692592), (505.539232), (511.406569), (511.456135), (512.0), (515.331652),
                 (516.818182), (520.804255), (527.036531), (532.735738), (533.062177), (540.0), (540.203016), (551.907863),
                 (567.2037), (573.85), (575.0), (599.485483), (600.0), (651.818182), (690.0), (695.297235),
                 (700.0), (707.4815), (734.940178), (774.81788), (791.589335), (800.0), (803.85), (804.694816),
                 (805.0), (812.270054), (850.0), (851.147837), (864.117078), (870.289343), (884.707754), (900.0),
                 (910.1014), (921.2989), (923.952933), (938.184257), (942.653617), (943.122068), (950.0), (977.5),
                 (985.0), (987.562375), (994.911823), (1000.0), (1002.721458), (1008.245819), (1017.806473), (1024.855758),
                 (1029.207641), (1036.940494), (1062.943072), (1063.505922), (1069.0552909632156), (1086.318613), (1094.342557), (1100.0),
                 (1103.518695), (1106.761747), (1111.007672), (1125.475461), (1126.324848), (1131.756344), (1135.696732), (1137.227616),
                 (1146.578368), (1150.0), (1172.730321), (1198.970966), (1200.0), (1201.0), (1209.76391), (1219.484579),
                 (1226.90265), (1234.452969), (1263.2148), (1289.271238), (1322.5), (1357.898266), (1379.861681), (1380.0),
                 (1381.15), (1392.444304), (1417.9497), (1430.823522), (1457.9276), (1461.7913), (1464.8241), (1465.998506),
                 (1488.478813), (1495.0), (1500.0), (1506.1235), (1508.865998), (1510.115), (1545.3504), (1610.0),
                 (1611.15), (1676.470978), (1714.285714285714), (1725.594), (1728.0), (1728.0611), (1780.0), (1800.0),
                 (1840.0), (1880.4357), (1900.0), (1955.7326), (2000.0), (2015.0), (2015.0151), (2067.761),
                 (2100.0), (2101.0), (2131.4567), (2175.2453), (2192.7856), (2193.2399), (2225.5218), (2273.7165),
                 (2279.6019), (2297.6867), (2319.9745), (2354.9606), (2400.0), (2407.1743), (2490.1186), (2495.4355),
                 (2544.433577644024), (2544.4336), (2729.8297), (2814.5452), (3030.8719), (3090.0016), (3105.2431), (3111.8045),
                 (3560.0), (3654.39), (3960.0), (4054.299), (4220.8083), (4279.3999), (4302.7446), (4337.6686),
                 (4447.6481), (4453.3383), (4481.0626), (4572.5633), (4758.4333), (4892.4897), (5000.0), (5365.9149),
                 (5615.9251), (6085.1118), (6200.0), (7000.0), (7600.0), (7962.6965), (8100.0), (9000.0),
                 (9200.0), (9555.249), (10000.0), (11000.0), (14500.0), (19739.9969), (20000.0), (24000.0),
                 (33000.0), (35245.946), (39563.3251), (40678.7794), (40786.5845), (43053.0), (43053.4421), (43087.9193),
                 (48215.9853), (53577.2205), (59471.443), (60693.2222), (60870.3418), (61985.4682), (62096.0266), (62157.4133),
                 (62661.2723), (63221.6383), (63440.7448), (63604.9582), (63684.9911), (64554.9267), (64731.4272), (65574.3395),
                 (67164.4557), (69478.7492), (78530.8297), (84758.5707), (86824.8963), (100000.0), (123445.296915), (3000000.0),
                 (4163623.9019), (4178010.181407), (4386630.5362), (8550254.4381), (36296606.925), (100000000.0), (183041883.582474)
         ) as g(v)
   where c.app_slug = 'rotating'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  -- Every number stated in any of the three capstone prompts, swept out of the
  -- prompts themselves. A graded field landing on one of them would be a
  -- transcription rather than a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
                 (0.0), (0.673), (0.761), (0.767), (0.79), (0.823), (0.87), (0.938),
                 (0.972), (1.272), (2.0), (3.7), (3.8), (4.3), (11.5), (19.4),
                 (34.0), (44.0), (46.0), (88.0), (96.0), (138.0), (160.0), (168.0),
                 (198.0), (212.0), (214.0), (285.0), (358.0), (450.0), (452.0), (486.0),
                 (700.0), (800.0), (900.0), (968.0), (1240.0), (1250.0), (1300.0), (1400.0),
                 (1401.0), (2000.0), (2203.0), (3101.0), (6000.0), (7650.0), (8000.0)
         ) as h(v)
   where c.app_slug = 'rotating'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- FC3's tiers do not chain: the Associate solves ESCRAVOS against its own
  -- station, the Professional works the BONGA suction side and its second
  -- machine, and the Expert takes the BONNY gas booster train. Asserted
  -- anyway, because a later recut that reused a machine across tiers would
  -- silently hand an answer over.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'rotating' and c2.app_slug = 'rotating' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_duty_flow_gpm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_duty_flow_gpm';
  select (f->>'expected')::numeric into v_duty_head_ft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_duty_head_ft';
  select (f->>'expected')::numeric into v_hydraulic_hp from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_hydraulic_hp';
  select (f->>'expected')::numeric into v_brake_hp from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_brake_hp';
  select (f->>'expected')::numeric into v_motor_input_kw from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_motor_input_kw';
  select (f->>'expected')::numeric into v_discharge_psi from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'escravos_discharge_psi';
  select (f->>'expected')::numeric into v_pressure_head_ft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_pressure_head_ft';
  select (f->>'expected')::numeric into v_npsha_ft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_npsha_ft';
  select (f->>'expected')::numeric into v_npsha_raised_ft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_npsha_raised_ft';
  select (f->>'expected')::numeric into v_speed_flow_gpm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_speed_flow_gpm';
  select (f->>'expected')::numeric into v_speed_head_ft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_speed_head_ft';
  select (f->>'expected')::numeric into v_parallel_flow_gpm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonga_parallel_flow_gpm';
  select (f->>'expected')::numeric into v_exponent_ratio from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_exponent_ratio';
  select (f->>'expected')::numeric into v_ratio_per_stage from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_ratio_per_stage';
  select (f->>'expected')::numeric into v_stage1_discharge_f from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_stage1_discharge_f';
  select (f->>'expected')::numeric into v_stage1_poly_head from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_stage1_poly_head';
  select (f->>'expected')::numeric into v_stage1_gas_hp from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_stage1_gas_hp';
  select (f->>'expected')::numeric into v_fuel_mmscfd from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'rotating' and f->>'key' = 'bonny_fuel_mmscfd';

  if v_duty_flow_gpm is null
     or v_duty_head_ft is null
     or v_hydraulic_hp is null
     or v_brake_hp is null
     or v_motor_input_kw is null
     or v_discharge_psi is null
     or v_pressure_head_ft is null
     or v_npsha_ft is null
     or v_npsha_raised_ft is null
     or v_speed_flow_gpm is null
     or v_speed_head_ft is null
     or v_parallel_flow_gpm is null
     or v_exponent_ratio is null
     or v_ratio_per_stage is null
     or v_stage1_discharge_f is null
     or v_stage1_poly_head is null
     or v_stage1_gas_hp is null
     or v_fuel_mmscfd is null then
    raise exception 'FC3 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ============ ASSOCIATE: the ESCRAVOS transfer pump, P-1401 ============
  -- Four catalogue points, a station stated as 214 ft of friction at 1250 gpm
  -- over 168 ft of static lift, crude at a gravity of 0.823, a pump
  -- efficiency of 0.761 and a motor at 0.938.
  --
  -- THE DUTY FLOW IS A ROOT AND IS ASSERTED AS ONE. pumps.js fits a quadratic
  -- to the catalogue points by least squares and bisects the difference
  -- between that curve and the station curve. The three coefficients below are
  -- the SAME least-squares problem solved exactly by Cramer's rule on the
  -- normal equations, in the engine's own scaled variable q over 2000, so
  -- nothing here is handed the engine's answer to check the engine's answer.
  v_pump := 485.14962239509396 + 11.217015339438825 * (v_duty_flow_gpm / 2000.0)
            + -281.2982145899073 * power(v_duty_flow_gpm / 2000.0, 2);
  v_syst := 168.0 + (214.0 / power(1250.0, 2)) * power(v_duty_flow_gpm, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: at the graded duty flow % gpm the fitted pump curve reads % ft and the station curve reads % ft, so that flow is not where they cross [graded field: escravos_duty_flow_gpm]', v_duty_flow_gpm, v_pump, v_syst;
  end if;

  -- THE DUTY HEAD IS WHAT BOTH CURVES AGREE ON THERE, and the station curve is
  -- the closed-form half of that agreement.
  if abs(v_duty_head_ft - v_syst) > 1e-9 then
    raise exception 'FC3 go-live refused: the duty head % ft is not the station curve at the duty flow [graded field: escravos_duty_head_ft]', v_duty_head_ft;
  end if;

  -- A pump has no operating point until it is connected to something, and this
  -- one landed BELOW its shutoff head and ABOVE its static lift. A recut that
  -- lost either would stop teaching what the tier exists to teach.
  if not (v_duty_head_ft < 485.14962239509396
          and v_duty_head_ft > 168.0) then
    raise exception 'FC3 go-live refused: the duty head % ft is not between the station static lift and the pump shutoff head [graded field: escravos_duty_head_ft]', v_duty_head_ft;
  end if;

  -- THE TWO FIELD PACKAGINGS ARE ONE CONSTANT, which is the engine fact this
  -- tier owns. Hydraulic power is flow, head and gravity over 3960.
  if abs(v_hydraulic_hp
         - v_duty_flow_gpm * v_duty_head_ft * 0.823 / 3960.0) > 1e-9 then
    raise exception 'FC3 go-live refused: the hydraulic power % hp is not the duty through the field packaging [graded field: escravos_hydraulic_hp]', v_hydraulic_hp;
  end if;
  if abs(v_brake_hp - v_hydraulic_hp / 0.761) > 1e-9 then
    raise exception 'FC3 go-live refused: the brake power % hp is not the hydraulic power through the pump efficiency [graded field: escravos_brake_hp]', v_brake_hp;
  end if;
  -- The kilowatt is EXACT BY DEFINITION and is written as the definition:
  -- 550 ft lbf per second, the foot at 0.3048 m, the pound at 0.45359237 kg
  -- and standard gravity at 9.80665 m per s2. 0.7457 is a rounding of this and
  -- the FC3-0 repair removed it.
  if abs(v_motor_input_kw
         - v_brake_hp / 0.938 * (550 * 0.3048 * 0.45359237 * 9.80665) / 1000.0) > 1e-9 then
    raise exception 'FC3 go-live refused: the motor input % kW is not the brake power through the motor efficiency and the defined horsepower [graded field: escravos_motor_input_kw]', v_motor_input_kw;
  end if;
  -- A head becomes a pressure through 2.31 ft per psi at gravity one, which is
  -- the same water density the 3960 above implies.
  if abs(v_discharge_psi - v_duty_head_ft * 0.823 / 2.31) > 1e-9 then
    raise exception 'FC3 go-live refused: the discharge pressure % psi is not the duty head on this crude [graded field: escravos_discharge_psi]', v_discharge_psi;
  end if;

  -- ========== PROFESSIONAL: the BONGA booster station, P-2203 ============
  -- THE SUCTION SIDE, BUILT FROM WHAT WAS SURVEYED. A pressure head over the
  -- vapour pressure, a static height and a suction friction, at gravity 0.79.
  if abs(v_pressure_head_ft - (19.4 - 3.7) * 2.31 / 0.79) > 1e-9 then
    raise exception 'FC3 go-live refused: the pressure head % ft is not the suction pressure over the vapour pressure as a head of this liquid [graded field: bonga_pressure_head_ft]', v_pressure_head_ft;
  end if;
  if abs(v_npsha_ft - (v_pressure_head_ft + 11.5 - 4.3)) > 1e-9 then
    raise exception 'FC3 go-live refused: the NPSH available % ft is not the pressure head plus the static height less the suction friction [graded field: bonga_npsha_ft]', v_npsha_ft;
  end if;
  -- PADDING THE DRUM MOVES ONLY THE PRESSURE TERM. The static height and the
  -- suction friction are untouched, so the whole rise is the pressure head's.
  if abs(v_npsha_raised_ft
         - ((46.0 - 3.7) * 2.31 / 0.79 + 11.5 - 4.3)) > 1e-9 then
    raise exception 'FC3 go-live refused: the padded NPSH available % ft is not the same suction side at the proposed drum pressure [graded field: bonga_npsha_raised_ft]', v_npsha_raised_ft;
  end if;
  if abs((v_npsha_raised_ft - v_npsha_ft)
         - (46.0 - 19.4) * 2.31 / 0.79) > 1e-9 then
    raise exception 'FC3 go-live refused: the rise in NPSH available is % ft and the rise in the pressure term is % ft, so a second term moved with it [graded field: bonga_npsha_raised_ft, bonga_npsha_ft]', v_npsha_raised_ft - v_npsha_ft, (46.0 - 19.4) * 2.31 / 0.79;
  end if;

  -- AN AFFINITY LAW APPLIED TO A DUTY POINT IS NOT A NEW DUTY POINT, and the
  -- graded flow is the scaled one, so it is asserted through the duty it was
  -- scaled from: divide it back by the speed ratio and that flow must be the
  -- root of the BONGA pump curve against the BONGA station.
  v_base := v_speed_flow_gpm / 0.87;
  v_pump := 211.46279407493466 + 8.566147093942622 * (v_base / 1300.0)
            + -123.38903411107884 * power(v_base / 1300.0, 2);
  v_syst := 44.0 + (88.0 / power(800.0, 2)) * power(v_base, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: the graded flow % gpm divided by the speed ratio is % gpm, which is not the solved duty: the pump reads % ft there and the station reads % ft [graded field: bonga_speed_flow_gpm]', v_speed_flow_gpm, v_base, v_pump, v_syst;
  end if;
  -- The head leg is the SQUARE of the speed ratio on that same duty head,
  -- which is the station curve at the base flow. Exact for a geometrically
  -- similar machine, which is why this tier grades a speed change and never a
  -- trim: the trim shortfall model is HELD.
  if abs(v_speed_head_ft - power(0.87, 2) * v_syst) > 1e-9 then
    raise exception 'FC3 go-live refused: the head at the proposed speed % ft is not the square law on the solved duty head [graded field: bonga_speed_head_ft]', v_speed_head_ft;
  end if;

  -- TWO PUMPS IN PARALLEL DELIVER FAR LESS THAN TWICE ONE PUMP, and that is
  -- the result the engine exists to make visible. The combined curve is ONE
  -- machine at HALF the flow, and the graded flow is the root of that against
  -- the same station.
  v_pump := 211.46279407493466 + 8.566147093942622 * (v_parallel_flow_gpm / 2.0 / 1300.0)
            + -123.38903411107884 * power(v_parallel_flow_gpm / 2.0 / 1300.0, 2);
  v_syst := 44.0 + (88.0 / power(800.0, 2)) * power(v_parallel_flow_gpm, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: the parallel flow % gpm is not where two of these machines cross this station: one machine at half the flow reads % ft and the station reads % ft [graded field: bonga_parallel_flow_gpm]', v_parallel_flow_gpm, v_pump, v_syst;
  end if;
  if not (v_parallel_flow_gpm < 1.6 * v_base
          and v_parallel_flow_gpm > 1.02 * v_base) then
    raise exception 'FC3 go-live refused: two machines deliver % times one, which is not the shortfall the tier is built to show [graded field: bonga_parallel_flow_gpm]', v_parallel_flow_gpm / v_base;
  end if;

  -- ============ EXPERT: the BONNY gas booster train, K-3101 ==============
  -- 34.0 MMscfd of a 0.673 gravity gas from 138.0 psia and 96.0 degF to 1240.0 psia,
  -- k = 1.272, polytropic efficiency 0.767, mechanical efficiency 0.972, a
  -- per-stage ratio limit of 3.8, a stated discharge limit of 285 degF and
  -- intercooling back to the suction temperature.
  --
  -- THE POLYTROPIC EXPONENT IS NOT THE ISENTROPIC ONE. Using k where n belongs
  -- under-predicts the discharge temperature and over-predicts how much ratio
  -- a stage can take, which is the Expert tier's first fact.
  v_e := (1.272 - 1) / (1.272 * 0.767);
  if abs(v_exponent_ratio - v_e) > 1e-15 then
    raise exception 'FC3 go-live refused: the exponent ratio % is not (k-1) over k times the polytropic efficiency [graded field: bonny_exponent_ratio]', v_exponent_ratio;
  end if;

  -- THE STAGE COUNT IS THE LARGER OF TWO LIMITS, AND THE ENGINE NAMES WHICH.
  -- The ratio limit of 3.8 demands 2 stages here. The temperature limit
  -- demands 3, because two equal stages reach 294.9683 degF against a stated
  -- limit of 285. So the TEMPERATURE limit governs, and the graded ratio is
  -- the 3-stage one: asserted by raising it to the stage count, which must
  -- return the overall ratio exactly.
  if abs(power(v_ratio_per_stage, 3) - 1240.0 / 138.0) > 1e-9 then
    raise exception 'FC3 go-live refused: the ratio per stage % raised to 3 is not the overall ratio of this duty [graded field: bonny_ratio_per_stage]', v_ratio_per_stage;
  end if;
  if not (v_ratio_per_stage < 3.8) then
    raise exception 'FC3 go-live refused: the ratio per stage % breaks the stated per-stage limit of 3.8 [graded field: bonny_ratio_per_stage]', v_ratio_per_stage;
  end if;
  v_t1r := 96.0 + 459.67;
  -- BOTH SIDES OF THE LIMIT THAT GOVERNED. One fewer stage must break it and
  -- the chosen count must meet it, or the count is not the one the engine
  -- chose and the tier is grading a different lesson under the same label.
  if not (v_t1r * power(power(1240.0 / 138.0, 1 / 2.0), v_e) - 459.67 > 285.0) then
    raise exception 'FC3 go-live refused: 2 stages would meet the stated 285 degF limit, so the temperature limit is not what chose 3';
  end if;
  if not (v_stage1_discharge_f <= 285.0) then
    raise exception 'FC3 go-live refused: the first stage discharges at % degF, above the stated limit of 285 [graded field: bonny_stage1_discharge_f]', v_stage1_discharge_f;
  end if;

  -- THE DISCHARGE TEMPERATURE IS THE INLET ON THE POLYTROPIC PATH, closed form
  -- once the exponent and the ratio are known. Stage 1 starts from the suction
  -- temperature, and every later stage is cooled back to it, which is why this
  -- capstone's intercooler approach was stated AT the suction temperature: it
  -- makes the staging assumption exact.
  if abs(v_stage1_discharge_f
         - (v_t1r * power(v_ratio_per_stage, v_exponent_ratio) - 459.67)) > 1e-9 then
    raise exception 'FC3 go-live refused: the first stage discharge % degF is not its own inlet raised on the polytropic path [graded field: bonny_stage1_discharge_f]', v_stage1_discharge_f;
  end if;

  -- THE POLYTROPIC HEAD CARRIES THE STAGE AVERAGE COMPRESSIBILITY, which is an
  -- iterated correlation with no closed form, so the head is NOT restated as a
  -- formula. It is asserted through the one relation z cancels out of: the gas
  -- horsepower is this head through the mass flow and the polytropic
  -- efficiency, exactly. The mass flow is closed form: MMscfd to lbmol through
  -- the package's own standard base, lbmol to pounds through the molecular
  -- weight of air times the gravity.
  v_mass := (34.0 * 1000000.0 / ((10.7316 * 519.67) / 14.696) / 24.0)
            * (28.9625 * 0.673);
  if abs(v_stage1_gas_hp
         - v_mass * v_stage1_poly_head / (33000.0 * 60.0) / 0.767) > 1e-9 then
    raise exception 'FC3 go-live refused: the gas horsepower % and the polytropic head % do not agree through the mass flow of % lb per hr [graded field: bonny_stage1_gas_hp, bonny_stage1_poly_head]', v_stage1_gas_hp, v_stage1_poly_head, v_mass;
  end if;

  -- AND THE z THAT HEAD IMPLIES IS READ BACK OUT AND JUDGED. The head is
  -- z times the gas constant over the molecular weight, times the temperature
  -- RISE over the exponent, so the graded discharge temperature and the graded
  -- head between them say what z the engine used. It has to be a compressed
  -- real gas rather than a number that made the arithmetic work.
  v_z := v_stage1_poly_head * v_exponent_ratio
         / ((1545.3504 / (28.9625 * 0.673))
            * (v_stage1_discharge_f - 96.0));
  if not (v_z > 0.5 and v_z < 1.0) then
    raise exception 'FC3 go-live refused: the polytropic head % implies a stage average z of %, which is not a compressed real gas [graded field: bonny_stage1_poly_head]', v_stage1_poly_head, v_z;
  end if;

  -- THE FUEL IS ASSERTED BY INVERSION. A fuel rate at a stated heating value
  -- and a stated heat rate gives back the brake power the train drew, and
  -- nothing else it could have drawn. 24.0 and not 24: integer division would
  -- turn this assertion into a different one that still passed.
  v_bhp := v_fuel_mmscfd * 1000000.0 * 968.0 / 24.0 / 7650.0;
  -- THE LIMIT OF WHAT THIS ONE CAN BE ASSERTED TO, SAID PLAINLY. Every other
  -- graded value here is pinned to 1e-9 or to the root of an equation, and a
  -- move of one part in 1e7 is refused. THIS ONE IS NOT. The fuel carries the
  -- WHOLE train, and stages two and three hold a stage average compressibility
  -- that only an iterated correlation reaches, so there is no identity to pin
  -- it with and a reimplementation of that correlation in SQL would be a
  -- transcription pretending to be a check. What is asserted instead is a band,
  -- and the dry run MEASURED what the band catches: a move of 3 percent on the
  -- fuel is refused and a move of 2.5 percent is not.
  --
  -- The band is two statements. The first is physics and cannot wrongly fail:
  -- the three stages share a mass flow, an inlet temperature and a ratio, so
  -- the train's gas power is the first stage's times the sum of the three z's
  -- over the first, and every later stage runs at a higher pressure where z is
  -- lower. So the power is strictly under 3 first stages. The second is
  -- CALIBRATED at these conditions rather than derived: more than 2.85 first
  -- stages is what a 3-stage train of this gas gives, and it is here to catch
  -- a recut to another stage count, rate, gas or efficiency.
  if not (v_bhp > 2.85 * (v_stage1_gas_hp / 0.972)
          and v_bhp < 3.0 * (v_stage1_gas_hp / 0.972)) then
    raise exception 'FC3 go-live refused: the fuel of % MMscfd implies a train brake power of % hp, which is % first stages and not the 3-stage machine this duty demands [graded field: bonny_fuel_mmscfd, bonny_stage1_gas_hp]', v_fuel_mmscfd, v_bhp, v_bhp / (v_stage1_gas_hp / 0.972);
  end if;
  -- And the driver is on the right side of the first law. A heat rate below
  -- the 2544.4336 Btu that one horsepower-hour IS would be a driver more than
  -- a hundred percent thermally efficient, and driverFuel refuses it by name.
  if not (7650.0 > 550 * 0.3048 * 0.45359237 * 9.80665 * (3600.0 / 1055.05585262)) then
    raise exception 'FC3 go-live refused: the stated heat rate is below the Btu that one horsepower-hour is';
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'rotating' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'rotating' and status = 'available') then
    raise exception 'FC3 go-live refused: rotating did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC3 go-live: rotating available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
