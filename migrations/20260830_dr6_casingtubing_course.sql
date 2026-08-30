-- ============================================================================
-- DR6: Casing & Tubing Design joins the catalog, the SIXTH Drilling &
-- Completions course (petrolord-suite docs/scope/NextGen-Drilling-Courses-
-- PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 23; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 through DR5 are RECOMMENDED and
-- not required.
--
-- ONE CATALOG, ONE STRING, ONE TUBING. tubular_cases.json gives 84 published
-- rating rows over 28 catalog geometries at three grades, the two-section
-- 9-5/8 inch string on the D1 slant well with its shoe at 2507.919699301 m of
-- true vertical depth and its section break at 1473.759701091, seven canonical
-- load cases over that string, and three tubing-packer scenarios on a 3-1/2
-- inch 9.3 lb/ft string 2500 m long in a 4 inch seal bore. The wellbore is the
-- same one DR1 through DR5 use.
--
-- THE CAPSTONE CONDITIONS SHARE NOTHING WITH THE PUBLISHED ONES, AT EVERY
-- TIER. The Associate capstone runs a 13-3/8 inch 68 lb/ft joint at grade
-- C-90, which the goldens never publish, on a SHORT THREAD connection at 0.75
-- which the string never uses, derated at 0.55 of yield rather than the
-- lessons' 0.4. The Professional capstone runs a 2200 m shoe on 1620 kg/m3 mud
-- with a 28000000 Pa test, a 1900 Pa per metre gas gradient, a 1950 kg/m3 shoe
-- fracture equivalent mud weight, a 1025 kg/m3 backup, an evacuation fraction
-- of 0.7, 1870 kg/m3 cement, 620000 N of overpull and a 3.5 degree per 30 m
-- dogleg, on a string of 9-5/8 inch 53.5 lb/ft T-95 over 9-5/8 inch 47 lb/ft
-- C-90, neither grade published. The Expert capstone runs 4-1/2 inch 12.75
-- lb/ft tubing 3200 m long in a 5 inch seal bore rated to 900000 N with 2 m of
-- stroke, at 32000000 Pa on the bore, 6000000 Pa on the annulus and a mean
-- temperature change of 100 degrees.
--
-- THE PUBLISHED-GOLDEN COLLISION CHECK, WHICH DR4 EARNED AND THIS COURSE RAN
-- BEFORE WRITING A LESSON. All eighteen proposed graded values were swept
-- against every one of the 797 numbers tubular_cases.json publishes, at each
-- field's own tolerance: 0 collisions. The pairwise check across the eighteen
-- is also 0. Both are re-asserted inside casingTubingLab.test.js.
--
-- THREE FINDINGS THE FIXTURE'S OWN OUTPUT PRODUCED. (1) Exactly one of the 28
-- catalog rows gives the same collapse at all ten grades: 20 inch 94 lb/ft, at
-- 3554024.408995863 Pa, because a D over t of 45.662100456621005 puts it in
-- the elastic regime at every grade and the elastic formula contains no yield
-- strength. Its burst spans a factor of 3.125 over the same span. (2) On the
-- gas kick the burst differential SHRINKS downward at 7800.8495 Pa per metre,
-- so the surface section governs at the WELLHEAD at 1.6904923854809817 rather
-- than at its shoe at 2.396900745393525, a 41.8 percent overstatement for any
-- check that evaluates the section bottom. The pressure test governs at the
-- other end. (3) The three published tubing cases each hit a DIFFERENT limit:
-- production heating buckles helically with the best packer safety factor of
-- the three, injection cooling strokes out without buckling, and stimulation
-- has the worst packer force and does not buckle. There is no design case.
--
-- TWO EXACT RESULTS THE EXPERT TIER TURNS ON. The helical buckling limit is
-- 1.8284271247461903 times the sinusoidal one on every string, and the stroke
-- window is exactly twice the stroke over alpha times the length, 100 degrees
-- on the published completion, whatever the pressures do.
--
-- WHAT THE ENGINE DOES NOT DO, TAUGHT IN EXPERT m05 AND GRADED NOWHERE: the
-- buckling length change, annular pressure buildup, seal and wall friction,
-- the erosional velocity as a design criterion, connection sealing, casing
-- wear, fatigue and temperature derating of the yield strength.
-- 20260830_dr6_casingtubing_go_live.sql asserts it.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (dr6_fields.mjs); casingTubingLab.test.js pins all
-- eighteen through the course's own teaching lab across 36 cases.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr6_casingtubing_go_live.sql until a production upload carries the
-- /dashboard/apps/casingtubing route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('casingtubing', 'Casing and Tubing Design', 'drilling', 23, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'casingtubing', 'beginner', 'associate',
  'one catalog row at a grade the goldens never publish, on a connection the string never uses, derated at a fraction the lessons never run',
  'Rate a joint at a grade this course has not run',
  'Six numbers for a 13-3/8 inch 68 lb/ft casing joint at grade C-90, on a SHORT THREAD connection, derated at 55 percent of yield. Three of those five facts are new: C-90 is not one of the three grades the goldens publish, short thread is not one of the two connections the string uses, and 0.55 is not the 0.4 every table in module 4 was built on. Report: (1) the BURST rating in pascals; (2) the PIPE BODY YIELD in newtons; (3) the JOINT STRENGTH in newtons on that short thread connection; (4) the COLLAPSE rating with no axial load, in pascals; (5) the COLLAPSE rating at 55 percent of yield in tension, in pascals; and (6) the PLASTIC TO TRANSITION D over t boundary at that grade, which is dimensionless. Do field 6 first: once you have the three boundaries at C-90 and this pipe''s own ratio you know its regime, and that tells you in advance how far apart fields 4 and 5 should be. Traps: field 1 is 0.875 times Barlow and not Barlow, so leaving the tolerance out puts you 14.3 percent high; field 3 uses 0.75 and not 0.85; fields 4 and 5 are in PASCALS and the collapse polynomials work internally in psi, so a value that was never converted back is about 6895 times too small. Free checks: field 3 is exactly three quarters of field 2, and field 5 must be SMALLER than field 4 because this pipe is not in the elastic regime.',
  jsonb_build_array(
    jsonb_build_object('key','burst_rating_Pa',                'label','Burst rating',              'unit','Pa','expected',38971486.295327105,'tol',50),
    jsonb_build_object('key','body_yield_N',                   'label','Pipe body yield',           'unit','N', 'expected',7784690.730872745, 'tol',50),
    jsonb_build_object('key','joint_strength_N',               'label','Joint strength (STC)',      'unit','N', 'expected',5838518.048154559, 'tol',50),
    jsonb_build_object('key','collapse_Pa',                    'label','Collapse, no axial load',   'unit','Pa','expected',15994736.328453356,'tol',50),
    jsonb_build_object('key','collapse_at_55pct_tension_Pa',   'label','Collapse at 55 pct tension','unit','Pa','expected',13362352.096477188,'tol',50),
    jsonb_build_object('key','dt_plastic_transition_boundary', 'label','Plastic/transition D over t','unit','-','expected',21.687209920387204,'tol',0.0000005)
  )
),
(
  'casingtubing', 'intermediate', 'professional',
  'a two-section 9-5/8 inch string on a 2200 m shoe in 1620 kg/m3 mud, at two unpublished grades, with an evacuation level that lands inside the top section',
  'Check a string this course has not run',
  'Six safety factors on a string and an environment that share nothing with the lessons. The string: two sections of 9-5/8 inch, break at 1200 m of true vertical depth and shoe at 2200. On top, 53.5 lb/ft at T-95 on a buttress connection. Below, 47 lb/ft at C-90 on a SHORT THREAD connection. Neither grade is published. The environment: mud 1620 kg/m3, test pressure 28000000 Pa, gas gradient 1900 Pa per metre, shoe fracture equivalent mud weight 1950 kg/m3, seawater backup 1025 kg/m3, evacuation fraction 0.7, cement 1870 kg/m3, packer fluid 1200 kg/m3, overpull 620000 N, dogleg 3.5 degrees per 30 m, string weight 53.5 lb/ft. Design factors unchanged at 1.1, 1.0, 1.6 and 1.25. Report: (1) the GAS KICK burst safety factor on SECTION 1; (2) the PRESSURE TEST burst safety factor on SECTION 2; (3) the FULL EVACUATION collapse safety factor on SECTION 2; (4) the PARTIAL EVACUATION collapse safety factor on SECTION 2; (5) the RUNNING case tension safety factor on SECTION 2; and (6) the PRESSURE TEST triaxial safety factor on SECTION 2. Traps. The grid is 2200 over 50 intervals, so the spacing is 44 m exactly and the break at 1200 is not a grid point: the last point above it is 1188 and the first below is 1232. The evacuation fraction of 0.7 puts the level at 660 m, INSIDE section 1, so the identity between fields 3 and 4 on the TOP section that held on the published run does not hold here. Field 5 is on section 2 with a short thread connection at 0.75. Free checks: field 1 must govern at exactly 0 m and field 2 at exactly 2200 m, because the gas gradient is still far below the backup gradient and the mud gradient is still above it. Field 3 should be the smallest of the six by a wide margin, and exactly one of the fourteen section evaluations on this string is not a PASS. Find it before you submit.',
  jsonb_build_array(
    jsonb_build_object('key','gaskick_sec1_burst_sf',        'label','Gas kick, section 1 burst',        'unit','-','expected',1.712954075413236, 'tol',0.000005),
    jsonb_build_object('key','pressuretest_sec2_burst_sf',   'label','Pressure test, section 2 burst',   'unit','-','expected',1.3040311472977943,'tol',0.000005),
    jsonb_build_object('key','fullevac_sec2_collapse_sf',    'label','Full evacuation, section 2',       'unit','-','expected',0.9852464388609451,'tol',0.000005),
    jsonb_build_object('key','partialevac_sec2_collapse_sf', 'label','Partial evacuation, section 2',    'unit','-','expected',2.046281065326578, 'tol',0.000005),
    jsonb_build_object('key','runningaxial_sec2_tension_sf', 'label','Running, section 2 tension',       'unit','-','expected',3.3408019033052354,'tol',0.000005),
    jsonb_build_object('key','pressuretest_sec2_triax_sf',   'label','Pressure test, section 2 triaxial','unit','-','expected',1.4356806349563185,'tol',0.000005)
  )
),
(
  'casingtubing', 'advanced', 'expert',
  'a longer and wider tubing on a wider seal bore, hotter than anything the lessons run, with a pressure change on the annulus as well as the bore',
  'Load a completion this course has not run',
  'Six numbers for a tubing-packer system that shares nothing with the published one. The tubing: 4-1/2 inch 12.75 lb/ft, outside diameter 0.1143 m and inside 0.1005332 m, 3200 m long, not the 3-1/2 inch 9.3 lb/ft at 2500 m the lessons run. The packer: a 5 INCH seal bore, rated to 900000 N, with 2 m of stroke. Still inside 7 inch 29 lb/ft casing, so the radial clearance has CHANGED even though the casing has not. The event: 32000000 Pa on the bore, 6000000 Pa on the ANNULUS, and a mean temperature change of PLUS 100 degrees. Report: (1) the PISTON force in newtons; (2) the BALLOONING force in newtons; (3) the THERMAL force in newtons; (4) the TOTAL force at the packer in newtons; (5) the HELICAL buckling limit in newtons; and (6) the TOTAL LENGTH CHANGE in metres. Do the geometry first: the bore area, the outside area, the seal bore area and the steel section, all four, before touching a force. Traps. Field 3 is NEGATIVE, because the temperature change is positive and the formula carries a minus sign, and it is the largest of the three, so dropping its sign flips field 4 as well. Field 5 needs the NEW clearance, which is smaller because the tubing grew inside the same casing, and the buoyed weight at the 1080 kg/m3 external density given here rather than the 1150 the lessons used. The annulus pressure is not zero: it reduces piston and ballooning by different amounts, because they act on different areas, so dropping it gives two wrong answers. Free checks: fields 1, 2 and 3 add to field 4 exactly; field 5 divided by the sinusoidal limit must be 1.8284271247461903, so compute the sinusoidal one too even though it is not graded; the absolute value of field 4 must EXCEED field 5, and field 6 must exceed 2 metres. Both of those last two say the completion fails, which is the correct answer. Say which limit you would fix first, and note that the answer is not a heavier tubing.',
  jsonb_build_array(
    jsonb_build_object('key','piston_N',              'label','Piston force',        'unit','N','expected',136910.1070172768,  'tol',0.5),
    jsonb_build_object('key','ballooning_N',          'label','Ballooning force',    'unit','N','expected',115469.85263765803, 'tol',0.5),
    jsonb_build_object('key','thermal_N',             'label','Thermal force',       'unit','N','expected',-576442.5921194464, 'tol',0.5),
    jsonb_build_object('key','total_force_N',         'label','Total at the packer', 'unit','N','expected',-324062.63246451155,'tol',0.5),
    jsonb_build_object('key','helical_limit_N',       'label','Helical limit',       'unit','N','expected',264203.613922147,   'tol',0.5),
    jsonb_build_object('key','total_length_change_m', 'label','Total length change', 'unit','m','expected',2.158758783053055,  'tol',0.000005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr6_casingtubing_go_live.sql.
