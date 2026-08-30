-- ============================================================================
-- DR4: Well Control joins the catalog, the FOURTH Drilling & Completions
-- course (petrolord-suite docs/scope/NextGen-Drilling-Courses-PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 21; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 welldesign, DR2 torquedrag and
-- DR3 hydraulics are RECOMMENDED and not required.
--
-- TWO WELLS AND TWO PUBLISHED KICKS. wellcontrol_cases.json gives the 40
-- degree slant well with its bit at 3000 m measured and 2507.9196993011733 m
-- true vertical, its shoe at 1282.248590310811 m true vertical, and the
-- horizontal well with its bit at 2800 m measured and 1214.859173174059 m true
-- vertical, its shoe at 1172.343525979085 m. Both carry 1440 kg/m3 mud, a pump
-- at 0.012 m3 per stroke and a slow circulating rate pressure of 4500000 Pa.
-- The two published scenarios are a moderate gas kick (2.0 MPa on the string,
-- 2.9 MPa on the annulus, 3.0 m3 of gain) and a small liquid one (0.8, 0.9,
-- 1.5).
--
-- THE GAP BETWEEN SHOE AND BIT IS THE WHOLE STORY. 1225.671108990 m of true
-- vertical depth on the slant well and 42.515647195 m on the horizontal one.
-- That single difference decides which kick tolerance case binds on each well,
-- and it is why the Expert tier's sweep behaves completely differently on the
-- two of them.
--
-- THE CAPSTONE RUNS A KICK, A FRACTURE GRADIENT AND A KICK INTENSITY THE
-- LESSONS NEVER USE: 1.4 MPa on the string, 2.1 MPa on the annulus, 2.2 m3 of
-- gain, a fracture equivalent mud weight of 1820 kg/m3 and a kick intensity of
-- 45 kg/m3 against the lessons' 1750 and 60. The Associate tier goes further
-- and swaps the WELL: the lessons walk volumes on the horizontal well and the
-- capstone grades the slant one, because the horizontal well's volumes are
-- published in the goldens and grading them would have graded a lookup.
--
-- A COLLISION THE FIELD DESIGN CAUGHT BEFORE THE LESSONS WERE WRITTEN. The
-- first Expert field list carried horizontal_kick_tolerance_m3, which at the
-- capstone's conditions comes to 1.0787639801029438 and sits 6.1e-5 from the
-- PUBLISHED golden value of 1.078825342 with a tolerance of 5e-4. A learner
-- who read the golden would have scored it. It was replaced by
-- horizontal_maasp_Pa, which the capstone's fracture gradient makes specific
-- to the attempt.
--
-- THE FINDING THE SWEEP PRODUCED. The horizontal well's kick tolerance is
-- FLAT against mud weight from 1200 to 1560 kg/m3 (1.0776682353801654 rising
-- to 1.0792753276402405, two parts in a thousand) while the slant well's falls
-- nearly linearly from 7.8144842668708145 to 0.9542972967023874 over the same
-- range. The horizontal well is bound by the circulated case, and that case is
-- limited by the 42.5 m of rise available rather than by the headroom. Mud
-- weight is not the lever on that well. Expert m04 is built around it.
--
-- WHAT THE ENGINE DOES NOT DO, TAUGHT IN EXPERT m05 AND GRADED NOWHERE:
-- subsea and floating operations (surface BOP only, no riser, no choke line,
-- and the choke line friction correction is tens of bar on a deepwater well),
-- gas migration and volumetric control (no time axis at all), dissolved gas in
-- oil-based mud, the casing pressure history, and multiphase or dispersed
-- influx behaviour. 20260830_dr4_wellcontrol_go_live.sql asserts it.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (dr4_fields.mjs); wellcontrolLab.test.js pins all
-- eighteen through the course's own teaching lab. Pairwise tolerance-collision
-- check across all eighteen: 0 collisions, re-asserted inside the test at each
-- field's own tolerance.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr4_wellcontrol_go_live.sql until a production upload carries the
-- /dashboard/apps/wellcontrol route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('wellcontrol', 'Well Control', 'drilling', 21, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'wellcontrol', 'beginner', 'associate',
  'the 40 degree slant well with its bit at 3000 m measured depth, its shoe at 1500 m measured depth, 1440 kg/m3 mud and a pump delivering 0.012 m3 per stroke; this is NOT the horizontal well the lessons walk',
  'Walk the slant well',
  'Six numbers, and every one of them comes out of a span walk down the string and back up the annulus. The lessons did this on the HORIZONTAL well. This is the SLANT one, so none of your answers is a number a lesson printed. Report: (1) the total STRING volume in cubic metres; (2) the total ANNULUS volume in cubic metres; (3) the STROKES TO BIT at 0.012 m3 per stroke; (4) the BOTTOMS UP stroke count, which is the annulus rather than the whole system; (5) the TRUE VERTICAL DEPTH at the bit; and (6) the TRUE VERTICAL DEPTH at the shoe. Fields 1 to 4 use MEASURED depth because fluid fills the hole along its length. Fields 5 and 6 are vertical because the next tier turns them into pressures. Mixing the two is the classic error in this subject.',
  jsonb_build_array(
    jsonb_build_object('key','slant_string_volume_m3',  'label','String volume',        'unit','m3',      'expected',26.0836036552257,   'tol',0.0005),
    jsonb_build_object('key','slant_annulus_volume_m3', 'label','Annulus volume',       'unit','m3',      'expected',72.46894410089696,  'tol',0.0005),
    jsonb_build_object('key','slant_strokes_to_bit',    'label','Strokes to bit',       'unit','strokes', 'expected',2173.6336379354752, 'tol',0.05),
    jsonb_build_object('key','slant_bottoms_up_strokes','label','Bottoms up strokes',   'unit','strokes', 'expected',6039.078675074747,  'tol',0.05),
    jsonb_build_object('key','slant_tvd_at_bit_m',      'label','True vertical depth at the bit',  'unit','m', 'expected',2507.9196993011733, 'tol',0.0005),
    jsonb_build_object('key','slant_tvd_at_shoe_m',     'label','True vertical depth at the shoe', 'unit','m', 'expected',1282.248590310811,  'tol',0.0005)
  )
),
(
  'wellcontrol', 'intermediate', 'professional',
  'the slant well, 1440 kg/m3 mud, a slow circulating rate pressure of 4500000 Pa at 0.012 m3 per stroke, and a kick the lessons never ran: 1400000 Pa on the drill pipe, 2100000 Pa on the casing, 2.2 m3 of pit gain',
  'Build the sheet on a kick you have not seen',
  'Six numbers on a NEW kick. The well is shut in with 1400000 Pa on the drill pipe gauge, 2100000 Pa on the casing gauge and a pit gain of 2.2 m3. Neither of the two scenarios the lessons run has those readings. Report: (1) the KILL MUD DENSITY in kg/m3; (2) the FORMATION PRESSURE at the bit in pascals; (3) the INITIAL CIRCULATING PRESSURE in pascals; (4) the FINAL CIRCULATING PRESSURE in pascals, which is the slow circulating rate pressure scaled by the density ratio and is therefore NOT simply 4500000; (5) the INFLUX DENSITY in kg/m3; and (6) the INFLUX HEIGHT in metres. Field 6 uses the annulus capacity where the influx actually sits, opposite the bottom hole assembly, rather than an average over the whole annulus. Field 5 depends on field 6, so an error in the height costs you both.',
  jsonb_build_array(
    jsonb_build_object('key','kill_mud_density_kgm3','label','Kill mud density',            'unit','kg/m3','expected',1496.9237802377363,'tol',0.005),
    jsonb_build_object('key','formation_pressure_Pa','label','Formation pressure at the bit','unit','Pa',  'expected',36815778.63557866, 'tol',50),
    jsonb_build_object('key','icp_Pa',               'label','Initial circulating pressure', 'unit','Pa',  'expected',5900000,           'tol',50),
    jsonb_build_object('key','fcp_Pa',               'label','Final circulating pressure',   'unit','Pa',  'expected',4677886.813242926, 'tol',50),
    jsonb_build_object('key','influx_density_kgm3',  'label','Influx density',               'unit','kg/m3','expected',1001.2472105482163,'tol',0.005),
    jsonb_build_object('key','influx_height_m',      'label','Influx height',                'unit','m',   'expected',162.6887318429214, 'tol',0.005)
  )
),
(
  'wellcontrol', 'advanced', 'expert',
  'both wells at 1440 kg/m3 mud, with a fracture equivalent mud weight of 1820 kg/m3 and a kick intensity of 45 kg/m3 for the tolerance work, neither of which the lessons use; the last field is the same 1400000 Pa kick as the Professional capstone, moved onto the other well',
  'The shoe, and what it can stand',
  'Six numbers. Fields 1 to 5 run at a fracture equivalent mud weight of 1820 kg/m3 and a kick intensity of 45 kg/m3. The lessons run at 1750 and 60, so every value here is one you have to produce. The mud is 1440 kg/m3 and the influx density for the tolerance work is the engine default of 240 kg/m3. Report, on the SLANT well: (1) the MAASP in pascals; (2) the KICK TOLERANCE in cubic metres, which is the SMALLER of the two cases; (3) the SHOE HEADROOM in pascals, which is a pressure and not a volume; and (4) the CIRCULATED case alone, the influx at the shoe, which on this well is the LARGER of the two and therefore exceeds field 2. Then on the HORIZONTAL well: (5) the MAASP in pascals; and (6) the KILL MUD DENSITY for the Professional capstone''s kick, which is the same 1400000 Pa reading on a different well and therefore a different answer. Fields 1 and 5 do not depend on the kick intensity at all, which is a free check on your working.',
  jsonb_build_array(
    jsonb_build_object('key','slant_maasp_Pa',          'label','Slant well MAASP',              'unit','Pa',   'expected',4778333.992505175, 'tol',50),
    jsonb_build_object('key','slant_kick_tolerance_m3', 'label','Slant well kick tolerance',     'unit','m3',   'expected',4.219078164062683, 'tol',0.0005),
    jsonb_build_object('key','slant_headroom_Pa',       'label','Slant well shoe headroom',      'unit','Pa',   'expected',3671590.9101433456,'tol',50),
    jsonb_build_object('key','slant_kt_at_shoe_m3',     'label','Slant circulated case',         'unit','m3',   'expected',4.9888090018644276,'tol',0.0005),
    jsonb_build_object('key','horizontal_maasp_Pa',     'label','Horizontal well MAASP',         'unit','Pa',   'expected',4368769.802836261, 'tol',50),
    jsonb_build_object('key','horizontal_kill_mud_density_kgm3','label','Horizontal kill mud density','unit','kg/m3','expected',1557.511784879494,'tol',0.005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr4_wellcontrol_go_live.sql.
