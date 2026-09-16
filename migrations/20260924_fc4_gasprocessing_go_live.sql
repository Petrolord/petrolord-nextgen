-- ============================================================================
-- FC4 GO-LIVE (HELD): Gas Processing flips to 'available'. The FOURTH
-- Facilities course, above FC3 rotating at path_order 41, FC2 linesizing at 40
-- and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/gasprocessing. The 78 lessons, the teaching lab
-- (gasprocessingLab.js) and its three explorer panels (the water side, the
-- absorber and the cold end) ship in the ZIP and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does not
-- exist. Every Facilities and Drilling wave on this programme has held its
-- go-live behind one verified upload.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost a
-- third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this. The
-- generator that wrote this file refuses to emit a division with a bare integer
-- denominator, and refuses a malformed numeric literal, which is the other
-- thing only SQL would have caught and only on the branch that reached it.
--
-- THIRTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM.
-- A water rate is a content difference applied to a gas rate; a circulation is
-- a stated ratio on that rate; a daily volume and a rate are one quantity in
-- two units; a sensible heat is a mass, a heat capacity and a temperature lift;
-- a BTEX mass is a mole balance on a stated fraction and molecular weight; a
-- Kremser removal and its inverse are one closed form read in two directions; an
-- acid gas load is a mole balance on the spec difference; an amine circulation
-- is that load over the loading swing through the strength and the solution
-- density; a regenerator duty is a circulation at a stated duty a gallon; a
-- Joule-Thomson coefficient is a compressibility derivative through a heat
-- capacity; and a separator temperature is an inlet less a drop. A capstone
-- quietly recut to another stream, spec, ratio, strength, loading, duty or gas
-- fails them outright.
--
-- AND THE TWO CIRCULATIONS PIN EACH OTHER. `circGpm` on the Professional and
-- `circGpmRetuned` are the SAME mole balance read at two loading swings, so
-- their product with their own swings is one number. That is the lesson of the
-- retune asserted as arithmetic rather than described.
--
-- THE FIVE THAT ARE NOT CLOSED FORM ARE ASSERTED THE ONLY HONEST WAY THERE IS.
--
--   * THE COMPRESSIBILITY TEMPERATURE DERIVATIVE is a central difference of an
--     ITERATED correlation, so it is asserted BY THE EQUATION ITS TWO
--     COMPRESSIBILITIES ARE ROOTS OF. The two reduced densities were solved in
--     the generator by Newton on the Dranchuk and Abou-Kassem relation, which
--     is an independent solve of the same equation the engine solves, and what
--     this file carries is those ROOTS. The SQL puts each one back into the
--     equation and requires the residual to vanish, reads the compressibility
--     off the same polynomial, and then requires the graded derivative to be
--     their difference over the engine's own step of the inlet temperature
--     times 1e-4. SQL cannot solve that equation; it can verify a root, which
--     is what a root deserves.
--   * THE JOULE-THOMSON COEFFICIENT is then EXACT on that derivative, so the
--     two graded values pin each other and neither can move alone.
--   * THE COOLING is a twenty-step midpoint march, so no closed form reaches
--     it. It is asserted the way the course teaches it: against the ONE-STEP
--     answer the inlet coefficient would give, which is the error the tier
--     exists to show. The march must EXCEED that answer, and by a fraction
--     inside a stated band of 0.03 to 0.08; on this skid it exceeds it by
--     0.056004. THAT IS A BAND AND NOT AN IDENTITY, and saying so is the point:
--     restating the march in SQL would be a transcription pretending to be a
--     check, and a gate that restates a formula validates nothing.
--   * THE THREE WATER CONTENTS come out of a published vapour-pressure fit, so
--     they are checked against A DIFFERENT PUBLISHED EQUATION, Antoine against
--     the engine's Magnus, inside the 0.005 relative band two such
--     correlations agree to. Restating Magnus here would check nothing. The
--     cold content is additionally chained to the graded separator temperature,
--     so a recut of the let-down moves it.
--
--     THESE TWO ARE BANDS AND NOT IDENTITIES, and the dry run MEASURED what
--     each one catches rather than leaving it to be discovered. Sixteen of the
--     eighteen graded values are refused at ONE PART IN 1e7. These two are not,
--     because a correlation band cannot see a move that small. waterInLbMMscf is
--     refused at 0.38 percent and not at 0.35; waterOutLbMMscf is refused at
--     0.16 percent and not at 0.15, the tighter of the two because the engine's
--     Magnus fit already sits 0.345 percent above Antoine at the cold spot and
--     has less of the band left. Both are therefore pinned to about a third of a
--     percent rather than to a part in ten million, and saying which is the point:
--     a reader is entitled to know which of the eighteen is weakly held. The
--     inlet content is pinned far more tightly than that by SECOND ROUTE, the
--     Associate water-a-day identity that depends on it, which does refuse at one
--     part in 1e7.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY, and that is
-- asserted rather than asserted-by-comment. Digest Section 16 holds six things
-- and names two absences: the real-gas departure of the saturated water
-- content, the water overhead the reboiler pays for, the module's one glycol
-- density, the water density the amine gallons chain divides by, the three
-- amines' property set, and the BTEX absorbed fraction with its single
-- molecular weight. The capstone is built so that none of them can reach a
-- graded number: NO graded Associate field reads a reboiler duty, so the water
-- overhead cannot enter and the SENSIBLE half, made entirely of stated inputs,
-- is what is graded; NO graded Professional field reads a contactor diameter,
-- so the contactor liquid density cannot enter; OTUMARA states its own 920 Btu
-- a gallon rather than taking a table default; the BTEX fraction and weight are
-- stated in the prompt; and both let-downs begin below the 1000 psia the chart
-- correction is warned about. All of that is asserted below, on the labels and
-- again on the values.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES THAT VALUE BY KEY, appended by
-- the generator from its own variable map rather than typed, so the dry run's
-- negative control can tell a real refusal from any other.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_z_plus double precision; v_z_minus double precision;
  v_resid double precision; v_pump double precision;
  v_one_step double precision; v_excess double precision;
  v_antoine double precision; v_psat double precision;
  v_names text;
  v_ass_inletLbMMscf double precision;
  v_ass_waterLbDay double precision;
  v_ass_circGpm double precision;
  v_ass_circGpd double precision;
  v_ass_sensiblePerGal double precision;
  v_ass_btexTonsYear double precision;
  v_pro_fractionRemoved double precision;
  v_pro_stagesNeeded double precision;
  v_pro_acidMolesDay double precision;
  v_pro_circGpm double precision;
  v_pro_reboilerMMBtuHr double precision;
  v_pro_circGpmRetuned double precision;
  v_exp_dzdT double precision;
  v_exp_muFPerPsi double precision;
  v_exp_dropF double precision;
  v_exp_t2F double precision;
  v_exp_waterInLbMMscf double precision;
  v_exp_waterOutLbMMscf double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'gasprocessing' and active;
  if v_structures <> 3 then
    raise exception 'FC4 go-live refused: gasprocessing has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'gasprocessing';
  if v_questions <> 396 then
    raise exception 'FC4 go-live refused: gasprocessing has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'gasprocessing'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'gasprocessing' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'gasprocessing' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question with three options, five options, or a key outside its own
  -- options is a question no learner can answer correctly.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'gasprocessing'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'gasprocessing';
  if v_capstones <> 3 then
    raise exception 'FC4 go-live refused: gasprocessing has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'gasprocessing' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC4 go-live refused: gasprocessing carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'gasprocessing' and s.active;
  if v_modules <> 18 then
    raise exception 'FC4 go-live refused: gasprocessing carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner can reach, and it counts towards the 396 either way.
  select count(*) into v_graded from public.academy_quiz_questions q
   where q.app_slug = 'gasprocessing' and q.scope = 'module'
     and not exists (
       select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = q.app_slug and s.tier = q.tier and s.active
          and m->>'key' = q.module_key);
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'gasprocessing';
  if v_graded <> 18 then
    raise exception 'FC4 go-live refused: gasprocessing has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'gasprocessing' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- ------------------------------------------------------- the catalogue row
  if not exists (select 1 from public.academy_apps
                  where slug = 'gasprocessing' and module = 'facilities'
                    and path_order = 42 and prereq_slug is null) then
    raise exception 'FC4 go-live refused: the gasprocessing catalogue row is not facilities at path_order 42 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps
              where path_order = 42 and slug <> 'gasprocessing') then
    raise exception 'FC4 go-live refused: another course already holds path_order 42';
  end if;


  -- ------------------------------------------------- held for the literature
  -- BOTH HALVES. A label that names a held quantity, and a value that lands on
  -- one. The first is what a recut of the capstone prompt would break; the
  -- second is what a recut of the ANSWER would break, and neither implies the
  -- other.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ' order by c.tier, f->>'key')
    into v_graded, v_names from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing'
     and (lower(f->>'label') like '%reboiler dut%'
          or lower(f->>'label') like '%contactor diameter%'
          or lower(f->>'label') like '%vessel diameter%'
          or lower(f->>'label') like '%rich glycol%'
          or lower(f->>'label') like '%real-gas%'
          or lower(f->>'label') like '%mcketta%');
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- A graded field may not be a quantity these engines cannot produce at all.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ' order by c.tier, f->>'key')
    into v_graded, v_names from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing'
     and (lower(f->>'label') like '%hydrate%'
          or lower(f->>'label') like '%stage efficienc%'
          or lower(f->>'label') like '%tray%'
          or lower(f->>'label') like '%phase envelope%');
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % capstone field(s) grade a quantity this gas processing engine cannot produce: %', v_graded, v_names;
  end if;


  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
                 (1000.0), (1100.0), (9.3), (8.34), (61.08),
                 (105.14), (119.16), (18.0), (28.0), (45.0),
                 (0.35), (0.4), (0.5), (1.01), (1.02),
                 (1.04), (950.0), (800.0), (0.15), (92.0),
                 (2.0), (5.0)
         ) as h(v)
   where c.app_slug = 'gasprocessing'
     and abs((f->>'expected')::double precision) - h.v <= (f->>'tol')::double precision
     and h.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;


  -- ------------------------------------- a graded value is not a lookup
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A hand-picked list of headline
  -- figures is a list of the collisions somebody thought of, so this is all
  -- 598 of them.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
                 (0.0), (1.665057e-06), (4.3882457e-05), (0.000179949122), (0.0004), (0.000572602141),
                 (0.000986027713), (0.001125908), (0.001161871583), (0.001420038256), (0.001585158042), (0.004975123378),
                 (0.004975124378), (0.004975124878), (0.0063795), (0.0093), (0.01), (0.03),
                 (0.045082772), (0.0465), (0.048), (0.05), (0.054913819), (0.056296379),
                 (0.057), (0.059233788), (0.059712113), (0.061607962), (0.061694982), (0.066),
                 (0.067252747), (0.071833233), (0.0744), (0.08), (0.093), (0.1),
                 (0.112463), (0.12), (0.15), (0.153343), (0.1825), (0.186),
                 (0.2), (0.25), (0.255814), (0.3), (0.3125), (0.33),
                 (0.337388), (0.35), (0.36), (0.375), (0.38), (0.39),
                 (0.4), (0.414499), (0.43), (0.44), (0.444444444), (0.45),
                 (0.465), (0.47), (0.479999999), (0.48), (0.489795918), (0.497666),
                 (0.5), (0.500001), (0.506169), (0.540441176), (0.545454545), (0.55),
                 (0.555085832), (0.566273421), (0.580834), (0.588480076), (0.590163934), (0.595927884),
                 (0.599476889), (0.6), (0.60375803), (0.61094), (0.626239), (0.65),
                 (0.659228), (0.66), (0.661246612), (0.664002), (0.66427), (0.666666667),
                 (0.677469), (0.68), (0.690669), (0.697269), (0.7), (0.702522608),
                 (0.717068), (0.725274725), (0.738367833), (0.742302), (0.743468), (0.746926678),
                 (0.75), (0.751811429), (0.756578), (0.763369), (0.766549366), (0.768995038974),
                 (0.768995039), (0.772324), (0.787335), (0.788365257), (0.789473684), (0.78994316),
                 (0.794841), (0.8), (0.801154097), (0.813710879), (0.818461451), (0.82),
                 (0.83), (0.830337), (0.833333333333), (0.834003433), (0.85), (0.855999257),
                 (0.857142857), (0.861800291), (0.865620297), (0.871027146669), (0.871027147), (0.876617747),
                 (0.876923077), (0.87897), (0.880630661741), (0.8835), (0.888888889), (0.897258427),
                 (0.9), (0.904635), (0.910768035), (0.916066108), (0.919606033), (0.922576074),
                 (0.923076923), (0.923076923077), (0.924170616), (0.933333333), (0.933333333333), (0.949998335),
                 (0.95), (0.951920538), (0.958077213054), (0.967741935), (0.96891695), (0.969846485),
                 (0.975), (0.976783371), (0.979379999), (0.986646497), (0.99), (0.991735537),
                 (0.992125984), (0.992446573), (0.995024876), (0.996673), (0.997251744), (0.997417616),
                 (0.998043053), (0.998750174391), (0.999085087), (0.999731528034), (0.999877915), (0.999898384),
                 (0.999962994696), (0.999991324329), (0.999997865073), (0.999997865073155), (0.999997906978), (0.999998746),
                 (0.999999433807), (0.999999437154), (0.999999440139), (0.99999967261), (0.999999979778), (0.999999999),
                 (1.0), (1.000000001), (1.001253761109), (1.001276298008), (1.001865077), (1.002457408),
                 (1.00275583), (1.00415987), (1.0063795), (1.006865), (1.01), (1.018625984),
                 (1.02), (1.032231), (1.035597), (1.04), (1.064736567), (1.0696),
                 (1.069612), (1.0696122340416079), (1.087422183), (1.098713), (1.148069844), (1.163008),
                 (1.178924), (1.2), (1.232852867), (1.265913867), (1.318455), (1.349553),
                 (1.4), (1.491161), (1.5), (1.538198), (1.6), (1.723846),
                 (1.75794), (1.771625), (1.858958085), (1.979300649), (1.999999), (2.0),
                 (2.045042), (2.207512726), (2.5), (2.704296), (2.721538393), (2.764926),
                 (2.792432), (2.795933), (2.797882), (2.811568), (2.812116), (2.812118),
                 (2.904091), (2.923419), (2.95583), (2.99992), (3.0), (3.078284),
                 (3.096692), (3.14020239), (3.192661), (3.2), (3.424553), (3.497385),
                 (3.585683), (3.828818705), (3.831017), (3.897763), (3.900134), (3.90013422),
                 (3.900136), (3.902738), (3.910196), (3.999894), (4.0), (4.208602),
                 (4.406452), (4.406454), (4.441), (4.508277), (4.515105), (4.5996),
                 (4.999867), (5.0), (5.000001), (5.025685103), (5.031317), (5.07),
                 (5.08), (5.2), (5.491382), (5.520833), (5.629638), (5.658211483),
                 (5.67252), (5.750076), (5.923379), (5.971211), (5.999841), (6.0),
                 (6.160796), (6.169498), (6.355348), (6.39983), (6.813163), (6.892825),
                 (7.0), (7.088719), (7.103036), (7.226497), (7.295386), (7.480519480519),
                 (7.5), (7.746472598), (7.999788), (8.0), (8.096205), (8.125226),
                 (8.125243), (8.34), (8.5), (8.914931), (9.0), (9.3),
                 (9.452149), (9.5), (9.8), (9.999734), (10.0), (10.176445163),
                 (10.5), (10.7316), (11.0), (11.999681), (12.0), (12.144308),
                 (12.386768), (12.436046977), (13.0), (13.728699767), (14.0), (14.247),
                 (14.696), (15.0), (15.038835973), (15.555556), (16.0), (16.019637),
                 (16.389556103), (16.458894), (16.478981), (16.479016), (17.0), (17.625),
                 (17.875376), (17.875414), (18.0), (18.01528), (18.76282077), (19.0),
                 (20.0), (20.240513), (21.708864), (23.094536), (24.029456), (24.12096),
                 (25.0), (25.242865), (25.805766), (27.136079), (27.831876), (28.0),
                 (28.666667), (28.9625), (30.0), (30.151199), (32.892218), (33.801656743),
                 (33.851907), (35.0), (36.271170079), (36.306809467), (36.31521554), (36.316244375),
                 (36.316483434), (36.316547556), (36.316558711), (36.316559445), (40.0), (40.049093),
                 (43.417727), (44.767), (45.0), (45.000001), (46.45038), (49.0),
                 (49.000001), (49.376683), (50.0), (50.000001), (50.777861), (53.247325),
                 (53.45038), (59.683441289), (59.683452444), (59.683516566), (59.683517), (59.683755625),
                 (59.68478446), (59.693190533), (59.728829921), (59.999999), (60.0), (60.000001),
                 (60.572688), (60.721539), (61.08), (62.0), (62.32180462), (63.011408),
                 (63.635283), (64.883034), (65.0), (65.646117), (69.365413534), (69.37),
                 (69.568831), (69.568831168831), (74.065024), (79.610443897), (80.0), (80.168225),
                 (80.501714), (81.64), (81.642477876), (82.0), (82.271300233), (83.563953023),
                 (84.629768), (87.074123), (87.55786736), (88.0), (88.249974), (88.812965),
                 (89.0), (89.568932039), (89.57), (89.925494), (90.0), (90.000001),
                 (90.093212), (90.1857), (90.5), (91.910902), (91.911573472), (92.0),
                 (93.3), (94.13877551), (94.814044213), (95.0), (95.78153446), (95.97503251),
                 (96.0), (96.265279584), (96.652275683), (96.749024), (97.111578947), (98.0),
                 (98.753366), (99.0), (99.2), (99.5), (99.9), (99.999999),
                 (100.0), (104.0), (105.0), (105.14), (105.5172487617218), (105.517249),
                 (110.0), (112.0), (118.0), (119.16), (120.0), (120.147278),
                 (122.0), (122.000001), (137.866352), (140.0), (140.000001), (142.54782),
                 (142.548124), (150.0), (164.588943), (180.0), (181.8261), (200.0),
                 (229.1667), (229.777254), (231.0), (243.04), (249.681529), (249.682062),
                 (250.0), (253.889303), (270.5572), (275.0), (275.732705), (340.0),
                 (343.75), (360.0), (370.325122), (372.403668), (372.404463), (375.0),
                 (378.125), (379.483571856287), (380.0), (390.0), (400.0), (405.8358),
                 (412.5), (429.6875), (452.267991), (457.5376), (458.3333), (459.67),
                 (464.5038), (481.136161), (481.25), (499.999999), (500.0), (502.51999),
                 (519.67), (525.893013), (541.1143), (550.0), (565.334989), (579.830758),
                 (600.0), (628.149988), (640.0), (685.254532), (687.5), (689.331762),
                 (690.0), (800.0), (850.0), (900.0), (901.8572), (904.535983),
                 (916.6667), (934.163599), (950.0), (985.0), (994.638143), (1000.0),
                 (1000.000001), (1100.0), (1180.0), (1200.0), (1207.14), (1309.44),
                 (1386.165), (1393.5114), (1400.0), (1440.0), (1454.6084), (1462.89),
                 (1500.0), (1514.04), (1615.3317), (1636.8275), (1661.165), (1728.0),
                 (1729.915), (1739.1275), (1764.29), (1789.7), (1798.665), (1815.8525),
                 (1844.4983), (1867.415), (1890.5333), (1892.5775), (1936.165), (1943.7275),
                 (2000.0), (2029.1788), (2073.665), (2200.0), (2204.025), (2302.8317),
                 (2500.0), (2650.0), (2879.9235), (3065.9235), (3189.9235), (3251.9235),
                 (3282.9235), (5135.0), (5574.0455), (9215.7553), (10320.0), (10666.2009),
                 (11612.5949), (20000.0), (30000.0), (24000000.0)
         ) as d(v)
   where c.app_slug = 'gasprocessing'
     and abs((f->>'expected')::double precision) - d.v <= (f->>'tol')::double precision
     and d.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;


  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
                 (0.0004), (0.03), (0.07), (0.12), (0.22), (0.38),
                 (0.55), (0.67), (0.78), (0.94), (1.85), (2.0),
                 (2.5), (3.6), (5.0), (6.4), (9.3), (10.2),
                 (33.0), (47.0), (71.0), (87.0), (92.0), (99.4),
                 (109.0), (155.0), (368.0), (405.0), (880.0), (920.0),
                 (935.0)
         ) as p(v)
   where c.app_slug = 'gasprocessing'
     and abs((f->>'expected')::double precision) - p.v <= (f->>'tol')::double precision
     and p.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || g.owner || '/' || g.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'gasprocessing') g
   where c.app_slug = 'gasprocessing' and c.tier <> g.owner and c.prompt like '%' || g.e || '%';
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_ass_inletLbMMscf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'inletLbMMscf';
  select (f->>'expected')::double precision into v_ass_waterLbDay
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'waterLbDay';
  select (f->>'expected')::double precision into v_ass_circGpm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'circGpm';
  select (f->>'expected')::double precision into v_ass_circGpd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'circGpd';
  select (f->>'expected')::double precision into v_ass_sensiblePerGal
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'sensiblePerGal';
  select (f->>'expected')::double precision into v_ass_btexTonsYear
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and f->>'key' = 'btexTonsYear';
  select (f->>'expected')::double precision into v_pro_fractionRemoved
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'fractionRemoved';
  select (f->>'expected')::double precision into v_pro_stagesNeeded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'stagesNeeded';
  select (f->>'expected')::double precision into v_pro_acidMolesDay
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'acidMolesDay';
  select (f->>'expected')::double precision into v_pro_circGpm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'circGpm';
  select (f->>'expected')::double precision into v_pro_reboilerMMBtuHr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'reboilerMMBtuHr';
  select (f->>'expected')::double precision into v_pro_circGpmRetuned
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'intermediate' and f->>'key' = 'circGpmRetuned';
  select (f->>'expected')::double precision into v_exp_dzdT
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 'dzdT';
  select (f->>'expected')::double precision into v_exp_muFPerPsi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 'muFPerPsi';
  select (f->>'expected')::double precision into v_exp_dropF
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 'dropF';
  select (f->>'expected')::double precision into v_exp_t2F
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 't2F';
  select (f->>'expected')::double precision into v_exp_waterInLbMMscf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 'waterInLbMMscf';
  select (f->>'expected')::double precision into v_exp_waterOutLbMMscf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gasprocessing' and c.tier = 'advanced' and f->>'key' = 'waterOutLbMMscf';
  if v_ass_inletLbMMscf is null
     or v_ass_waterLbDay is null
     or v_ass_circGpm is null
     or v_ass_circGpd is null
     or v_ass_sensiblePerGal is null
     or v_ass_btexTonsYear is null
     or v_pro_fractionRemoved is null
     or v_pro_stagesNeeded is null
     or v_pro_acidMolesDay is null
     or v_pro_circGpm is null
     or v_pro_reboilerMMBtuHr is null
     or v_pro_circGpmRetuned is null
     or v_exp_dzdT is null
     or v_exp_muFPerPsi is null
     or v_exp_dropF is null
     or v_exp_t2F is null
     or v_exp_waterInLbMMscf is null
     or v_exp_waterOutLbMMscf is null then
    raise exception 'FC4 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.inletLbMMscf, beginner.waterLbDay, beginner.circGpm, beginner.circGpd, beginner.sensiblePerGal, beginner.btexTonsYear, intermediate.fractionRemoved, intermediate.stagesNeeded, intermediate.acidMolesDay, intermediate.circGpm, intermediate.reboilerMMBtuHr, intermediate.circGpmRetuned, advanced.dzdT, advanced.muFPerPsi, advanced.dropF, advanced.t2F, advanced.waterInLbMMscf, advanced.waterOutLbMMscf]';
  end if;

  -- ------------------------------------------- the Associate, IKOT ABASI
  -- The water a day is the CONTENT DIFFERENCE applied to the rate, which is the
  -- intensive-against-extensive distinction the whole tier is built on.
  if abs(v_ass_waterLbDay - (v_ass_inletLbMMscf - 5.0) * 47.0) > 1e-09 then
    raise exception 'FC4 go-live refused: the water a day of % lb is not the content difference applied to % MMscfd [graded field: beginner.waterLbDay, beginner.inletLbMMscf]', v_ass_waterLbDay, 47.0;
  end if;
  if abs(v_ass_circGpd - v_ass_waterLbDay * 3.6) > 1e-09 then
    raise exception 'FC4 go-live refused: the daily glycol volume of % gallons is not the stated ratio of % on that water [graded field: beginner.circGpd, beginner.waterLbDay]', v_ass_circGpd, 3.6;
  end if;
  if abs(v_ass_circGpm - v_ass_circGpd / 1440.0) > 1e-12 then
    raise exception 'FC4 go-live refused: the glycol circulation of % gpm and % gallons a day are not one quantity in two units [graded field: beginner.circGpm, beginner.circGpd]', v_ass_circGpm, v_ass_circGpd;
  end if;
  if abs(v_ass_sensiblePerGal - 9.3 * 0.55 * (368.0 - 109.0)) > 1e-09 then
    raise exception 'FC4 go-live refused: the sensible heat of % Btu a gallon is not the glycol mass, its heat capacity and the lift from % to % degF [graded field: beginner.sensiblePerGal]', v_ass_sensiblePerGal, 109.0, 368.0;
  end if;
  -- The BTEX chain is a mole balance: ppmv to lbmol a day, the stated absorbed
  -- fraction, the stated molecular weight, a year, a short ton.
  if abs(v_ass_btexTonsYear - (47.0 * 1e6 * (155.0 / 1e6) / 379.48357185628737)
         * 0.12 * 92.0 * 365.0 / 2000.0) > 1e-09 then
    raise exception 'FC4 go-live refused: the BTEX of % short tons a year is not the mole balance on the stated fraction and molecular weight [graded field: beginner.btexTonsYear]', v_ass_btexTonsYear;
  end if;


  -- The one Associate value the SATURATION FIT produces, checked against a
  -- SECOND published vapour-pressure equation rather than against a restatement
  -- of the engine's own.
  v_antoine := (1.235724520742008 / 880.0) * (1e6 / 379.48357185628737) * 18.01528;
  if abs(v_ass_inletLbMMscf / v_antoine - 1.0) > 0.005 then
    raise exception 'FC4 go-live refused: the inlet water content of % lb a MMscf is % from the independent Antoine route, outside the band two published vapour-pressure fits agree to [graded field: beginner.inletLbMMscf]', v_ass_inletLbMMscf, v_ass_inletLbMMscf / v_antoine - 1.0;
  end if;


  -- ---------------------------------------- the Professional, OTUMARA
  -- Kremser, read in both directions off ONE closed form.
  if abs(v_pro_fractionRemoved - (1.85 ^ (5.0 + 1.0) - 1.85)
         / (1.85 ^ (5.0 + 1.0) - 1.0)) > 1e-14 then
    raise exception 'FC4 go-live refused: the removal of % is not Kremser at an absorption factor of % over % stages [graded field: intermediate.fractionRemoved]', v_pro_fractionRemoved, 1.85, 5.0;
  end if;
  if abs(v_pro_stagesNeeded - (ln((1.85 - 0.94) / (1.0 - 0.94)) / ln(1.85) - 1.0)) > 1e-12 then
    raise exception 'FC4 go-live refused: the stage count of % is not the same Kremser relation solved for the stages at a removal of % [graded field: intermediate.stagesNeeded]', v_pro_stagesNeeded, 0.94;
  end if;
  -- THE CEILING THE TIER EXISTS TO TEACH. Below an absorption factor of one the
  -- removal cannot exceed the factor itself, so a spec above the factor has no
  -- stage count at all. The stated factor is above the stated spec, and this
  -- asserts that rather than assuming it.
  if not (1.85 > 0.94) then
    raise exception 'FC4 go-live refused: an absorption factor of % caps the removal at itself and the spec asks for %, so the graded stage count does not exist', 1.85, 0.94;
  end if;
  if abs(v_pro_acidMolesDay - 71.0 * 1e6
         * (((6.4 - 2.5) + (0.78 - 0.0004)) / 100.0)
         / 379.48357185628737) > 1e-08 then
    raise exception 'FC4 go-live refused: the acid gas of % lbmol a day is not the mole balance on the spec difference at % MMscfd [graded field: intermediate.acidMolesDay]', v_pro_acidMolesDay, 71.0;
  end if;
  if abs(v_pro_circGpm - (v_pro_acidMolesDay / (0.38 - 0.07))
         * 105.14 / (33.0 / 100.0)
         / (8.34 * 1.02) / 1440.0) > 1e-08 then
    raise exception 'FC4 go-live refused: the amine circulation of % gpm does not close the mole balance on a swing of % [graded field: intermediate.circGpm, intermediate.acidMolesDay]', v_pro_circGpm, 0.31;
  end if;
  if abs(v_pro_reboilerMMBtuHr - v_pro_circGpm * 60.0 * 920.0 / 1e6) > 1e-12 then
    raise exception 'FC4 go-live refused: the regenerator duty of % MMBtu an hour is not that circulation at the stated % Btu a gallon [graded field: intermediate.reboilerMMBtuHr, intermediate.circGpm]', v_pro_reboilerMMBtuHr, 920.0;
  end if;
  if abs(v_pro_circGpmRetuned - (v_pro_acidMolesDay / (0.38 - 0.03))
         * 105.14 / (33.0 / 100.0)
         / (8.34 * 1.02) / 1440.0) > 1e-08 then
    raise exception 'FC4 go-live refused: the retuned circulation of % gpm is not the same balance on the wider swing of % [graded field: intermediate.circGpmRetuned, intermediate.acidMolesDay]', v_pro_circGpmRetuned, 0.35;
  end if;
  -- ONE MOLE BALANCE, TWO SWINGS. This is the retune's whole lesson as
  -- arithmetic: neither circulation can move without the other.
  if abs(v_pro_circGpmRetuned * (0.38 - 0.03)
         - v_pro_circGpm * (0.38 - 0.07)) > 1e-08 then
    raise exception 'FC4 go-live refused: the surveyed circulation of % gpm and the retuned % gpm are not one mole balance read at two swings [graded field: intermediate.circGpmRetuned, intermediate.circGpm]', v_pro_circGpm, v_pro_circGpmRetuned;
  end if;
  if not (v_pro_circGpmRetuned < v_pro_circGpm) then
    raise exception 'FC4 go-live refused: the retune to a leaner lean did not reduce the circulation, which is what widening the swing buys: % against % [graded field: intermediate.circGpmRetuned, intermediate.circGpm]', v_pro_circGpmRetuned, v_pro_circGpm;
  end if;


  -- --------------------------------------------- the Expert, ESCRAVOS
  -- THE DERIVATIVE IS ASSERTED BY THE EQUATION ITS TWO COMPRESSIBILITIES ARE
  -- ROOTS OF. The two reduced densities below were solved in the generator by
  -- Newton on the Dranchuk and Abou-Kassem relation, independently of the
  -- engine. SQL cannot solve that equation. It can put a candidate back into it
  -- and require the residual to vanish, which is what a root deserves, and it
  -- can then read the compressibility off the same polynomial and require the
  -- graded derivative to be their difference.
  v_z_plus := (1.0 + -0.5676490150233591 * 0.29786589960458676 + 0.13366388942818608 * 0.29786589960458676 * 0.29786589960458676 - -0.04370109327638355 * 0.29786589960458676 ^ 5.0 + 0.6134 * (1.0 + 0.721 * 0.29786589960458676 * 0.29786589960458676) * (0.29786589960458676 * 0.29786589960458676 / 1.4770498024565415 ^ 3.0) * exp(- 0.721 * 0.29786589960458676 * 0.29786589960458676));
  v_resid := v_z_plus * 0.29786589960458676 - 0.27 * 1.4009296419271782 / 1.4770498024565415;
  if abs(v_resid) > 1e-11 then
    raise exception 'FC4 go-live refused: the warm reduced density leaves a DAK residual of %, so it is not a root of the equation the compressibility solves', v_resid;
  end if;
  v_z_minus := (1.0 + -0.567898063979015 * 0.2979621727828763 + 0.13359802343471477 * 0.2979621727828763 * 0.2979621727828763 - -0.043708048725294116 * 0.2979621727828763 ^ 5.0 + 0.6134 * (1.0 + 0.721 * 0.2979621727828763 * 0.2979621727828763) * (0.2979621727828763 * 0.2979621727828763 / 1.4767544220340925 ^ 3.0) * exp(- 0.721 * 0.2979621727828763 * 0.2979621727828763));
  v_resid := v_z_minus * 0.2979621727828763 - 0.27 * 1.4009296419271782 / 1.4767544220340925;
  if abs(v_resid) > 1e-11 then
    raise exception 'FC4 go-live refused: the cold reduced density leaves a DAK residual of %, so it is not a root of the equation the compressibility solves', v_resid;
  end if;
  -- Both roots must be a COMPRESSED REAL GAS rather than a number.
  if not (v_z_plus > 0.5 and v_z_plus < 1.0 and v_z_minus > 0.5 and v_z_minus < 1.0) then
    raise exception 'FC4 go-live refused: the two compressibilities are % and %, which is not a compressed real gas', v_z_plus, v_z_minus;
  end if;
  if abs(v_exp_dzdT - (v_z_plus - v_z_minus) / (2.0 * 0.05466700000000001)) > 5e-13 then
    raise exception 'FC4 go-live refused: the derivative % per degR is not the difference of those two roots over the engine''s own step of % degR [graded field: advanced.dzdT]', v_exp_dzdT, 0.05466700000000001;
  end if;
  -- AND THE COEFFICIENT IS EXACT ON IT, so the two graded values pin each other
  -- and neither can move alone.
  if abs(v_exp_muFPerPsi - (10.7316 / (10.2 * 5.403953210180594))
         * 546.6700000000001 * 546.6700000000001 * v_exp_dzdT / 935.0) > 1e-15 then
    raise exception 'FC4 go-live refused: the coefficient of % degF a psi is not the graded derivative through a heat capacity of % Btu a lbmol degF [graded field: advanced.muFPerPsi, advanced.dzdT]', v_exp_muFPerPsi, 10.2;
  end if;
  if abs(v_exp_t2F - (87.0 - v_exp_dropF)) > 1e-12 then
    raise exception 'FC4 go-live refused: the separator temperature of % degF is not the inlet of % less the drop [graded field: advanced.t2F, advanced.dropF]', v_exp_t2F, 87.0;
  end if;
  -- THE COOLING IS A MARCH, so what is asserted is the error the tier exists to
  -- show: the one-step answer the INLET coefficient would give, and the band the
  -- march stands above it by. A band and not an identity, which is said here
  -- rather than left to be discovered.
  v_one_step := v_exp_muFPerPsi * (935.0 - 405.0);
  v_excess := v_exp_dropF / v_one_step - 1.0;
  if not (v_exp_dropF > v_one_step) then
    raise exception 'FC4 go-live refused: the marched cooling of % degF does not exceed the one-step answer of % degF, so the march is not doing what the tier teaches [graded field: advanced.dropF]', v_exp_dropF, v_one_step;
  end if;
  if v_excess <= 0.03 or v_excess >= 0.08 then
    raise exception 'FC4 go-live refused: the marched cooling of % degF stands % above the one-step answer, outside the stated band of % to % [graded field: advanced.dropF]', v_exp_dropF, v_excess, 0.03, 0.08;
  end if;


  -- The two water contents, against the INDEPENDENT Antoine route. The cold one
  -- is taken at the GRADED separator temperature, so a recut of the let-down
  -- moves it and cannot move it quietly.
  v_antoine := (0.633606088968722 / 935.0) * (1e6 / 379.48357185628737) * 18.01528;
  if abs(v_exp_waterInLbMMscf / v_antoine - 1.0) > 0.005 then
    raise exception 'FC4 go-live refused: the inlet water of % lb a MMscf is % from the independent Antoine route, outside the band two published vapour-pressure fits agree to [graded field: advanced.waterInLbMMscf]', v_exp_waterInLbMMscf, v_exp_waterInLbMMscf / v_antoine - 1.0;
  end if;
  -- Antoine in SQL at the graded cold temperature: log10(P mmHg) = A - B/(C + T_C).
  v_psat := power(10.0, 8.07131 - 1730.63 / (233.426 + (v_exp_t2F - 32.0) / 1.8)) * 0.0193367747;
  v_antoine := (v_psat / 405.0) * (1e6 / 379.48357185628737) * 18.01528;
  if abs(v_exp_waterOutLbMMscf / v_antoine - 1.0) > 0.005 then
    raise exception 'FC4 go-live refused: the cold water of % lb a MMscf is % from the independent Antoine route taken at the graded separator temperature of % degF, outside the band two published vapour-pressure fits agree to [graded field: advanced.waterOutLbMMscf, advanced.t2F]', v_exp_waterOutLbMMscf, v_exp_waterOutLbMMscf / v_antoine - 1.0, v_exp_t2F;
  end if;
  if not (v_exp_waterOutLbMMscf < v_exp_waterInLbMMscf) then
    raise exception 'FC4 go-live refused: the gas leaves the cold separator holding % lb a MMscf against % at the inlet, so the let-down did not dry it [graded field: advanced.waterOutLbMMscf, advanced.waterInLbMMscf]', v_exp_waterOutLbMMscf, v_exp_waterInLbMMscf;
  end if;
  -- BOTH LET-DOWN PRESSURES SIT BELOW the pressure the held chart correction is
  -- warned about, which is how a graded water content avoids leaning on it.
  if 935.0 > 1000.0 or 880.0 > 1000.0 then
    raise exception 'FC4 go-live refused: a graded water content is taken above the 1000 psia at which the held McKetta and Wehe correction is warned about';
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'gasprocessing';
  if not exists (select 1 from public.academy_apps
                  where slug = 'gasprocessing' and status = 'available') then
    raise exception 'FC4 go-live refused: gasprocessing did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC4 go-live: gasprocessing available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
