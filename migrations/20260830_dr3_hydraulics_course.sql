-- ============================================================================
-- DR3: Drilling Hydraulics joins the catalog, the THIRD Drilling & Completions
-- course (petrolord-suite docs/scope/NextGen-Drilling-Courses-PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 20; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 welldesign and DR2 torquedrag
-- are RECOMMENDED and not required.
--
-- FOUR FIXTURES: TWO WELLS CROSSED WITH TWO MUDS. hydraulics_cases.json gives
-- the 40 degree slant well to 3000 m and the horizontal well to 2800 m, each
-- with a KCl polymer mud at 1440 kg/m3 (dial readings 64, 38, 7, 6) and a light
-- water-based mud at 1200 (45, 28, 5, 4). One string, one bit at 0.000461814 m2
-- of nozzle area, one discharge coefficient. The lessons run at 0.015, 0.025
-- and 0.035 m3/s and at trip speeds of 0.2, 0.5 and 1.0 m/s.
--
-- THE CAPSTONE RUNS A MUD, A FLOW RATE AND A TRIP SPEED THE LESSONS NEVER USE:
-- dial readings 52, 33, 6, 5 at 1320 kg/m3, at 0.030 m3/s and 0.75 m/s. That
-- follows the lesson DR2 taught: design the graded conditions BEFORE writing
-- the lessons rather than stripping numbers out afterwards.
--
-- A COINCIDENCE THE SWEEP CAUGHT, WORTH RECORDING. The Herschel-Bulkley yield
-- is (2 x theta3 - theta6) dial units, so the capstone mud's yield is exactly
-- four dial units, which is exactly the LIGHT mud's 3 rpm stress that a lesson
-- table printed. The tier-leakage sweep flagged it as a same-tier answer print.
-- The table now gives the light mud's dial readings and leaves the conversion
-- as the exercise it already was.
--
-- THE SCOPE DECISION THAT SHAPES THIS COURSE. engines/drilling implements a
-- STEADY-STATE hydraulics of a stated seven-point method specification on a
-- CONCENTRIC NON-ROTATING annulus. It has no transients or acceleration terms,
-- no temperature or compressibility, no gel strength and therefore no
-- break-circulation pressure, no eccentricity or pipe rotation, and no
-- cuttings-bed or inclination term in the transport calculation. Expert m05
-- teaches all five and grades none. 20260830_dr3_hydraulics_go_live.sql
-- asserts it.
--
-- THE LIMITATION THE ENGINE'S OWN OUTPUT DEMONSTRATES. The transport model is
-- a falling particle in a rising fluid with no angle term, so the horizontal
-- well and the slant well return IDENTICAL transport ratios at every flow rate
-- (0.8284815558593573 for the heavy mud at 0.025 m3/s on both). A 40 degree
-- hole and a 90 degree hole cannot clean the same. Professional m03 is built
-- around that, and the Expert capstone's transport field is graded on the
-- horizontal well precisely so that the identity is met once more in a graded
-- number.
--
-- THE ORACLE RESULT, WHICH IS CLEANER AND LESS INSTRUCTIVE THAN DR2'S. The
-- goldens come from an independent numpy implementation of the same method
-- specification and ask for a relative tolerance of 1e-6. The engine beats it
-- everywhere: the rheology fits agree to about 1e-10 (the rounding of the
-- published nine-decimal values), the surge and swab pressures to about 1e-16
-- (machine precision on a short chain), and the pump pressures to about 1e-7,
-- which is the longest chain in the comparison. There is no closed-form case
-- here to settle a disagreement, and there is no disagreement to settle.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (DR3-TRUTH via dr3_fields.mjs); hydraulicsLab.test.js
-- pins all eighteen through the course's own teaching lab. Pairwise
-- tolerance-collision check across all eighteen: 0 fatal, 0 notes, re-asserted
-- inside the test at each field's own tolerance.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr3_hydraulics_go_live.sql until a production upload carries the
-- /dashboard/apps/hydraulics route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('hydraulics', 'Drilling Hydraulics', 'drilling', 20, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'hydraulics', 'beginner', 'associate',
  'the 40 degree slant well to 3000 m with the shared string and a bit at 0.000461814 m2 of total nozzle flow area, circulating a mud that has not appeared in the lessons',
  'Fit the mud, then split the pressure',
  'Six numbers, on a mud you have not seen. It reads 52 at 600 rpm, 33 at 300, 6 at 6 rpm and 5 at 3 rpm, at a density of 1320 kg/m3. That is NOT either of the two muds the lessons run on, and the same new mud is used at all three tiers. Report: (1) the POWER LAW flow behaviour index n for that mud, which is not the Herschel-Bulkley n; (2) the HERSCHEL-BULKLEY yield stress in pascals, which is not the Bingham yield point and is less than half of it; then, circulating that mud down the SLANT well at 0.030 m3/s, which is not one of the three rates the lessons use, with the fixture''s own hole geometry, the shared string, a discharge coefficient of 0.95 and no surface loss, report (3) the total PIPE pressure loss, (4) the total ANNULUS pressure loss, (5) the BIT pressure drop, and (6) the PUMP pressure. Use the Herschel-Bulkley fit for the pressure calculation, which is what the engine does. All four pressures are in PASCALS, and field 6 must equal the sum of fields 3, 4 and 5 exactly.',
  jsonb_build_array(
    jsonb_build_object('key','pl_n',             'label','Power law flow behaviour index','unit','-', 'expected',0.6560455987826389, 'tol',0.0000005),
    jsonb_build_object('key','hb_tau_y_Pa',      'label','Herschel-Bulkley yield stress','unit','Pa', 'expected',2.04161424376,      'tol',0.0005),
    jsonb_build_object('key','pipe_dp_Pa',       'label','Pipe pressure loss',           'unit','Pa', 'expected',8990804.931422047,  'tol',50),
    jsonb_build_object('key','annulus_dp_Pa',    'label','Annulus pressure loss',        'unit','Pa', 'expected',1531961.9814624505, 'tol',50),
    jsonb_build_object('key','bit_dp_Pa',        'label','Bit pressure drop',            'unit','Pa', 'expected',3086064.831211029,  'tol',50),
    jsonb_build_object('key','pump_pressure_Pa', 'label','Pump pressure',                'unit','Pa', 'expected',13608831.744095527, 'tol',50)
  )
),
(
  'hydraulics', 'intermediate', 'professional',
  'both wells, the 40 degree slant to 3000 m and the horizontal to 2800 m, circulating the same new mud, with cuttings at 2600 kg/m3 and 6 mm at a rate of penetration of 0.005 m/s',
  'What the rock feels, and what the annulus carries',
  'Six numbers on the same new mud as the Associate capstone: 52, 33, 6 and 5 at 1320 kg/m3, at a flow rate of 0.030 m3/s for fields 1 to 5. Report: (1) the EQUIVALENT CIRCULATING DENSITY at total depth on the SLANT well; (2) the worst (minimum) ANNULAR VELOCITY on that same run, which depends on the flow rate and the geometry alone and therefore not on the mud at all; (3) the equivalent circulating density at total depth on the HORIZONTAL well, which will be LARGER than field 1 even though that well is shallower in measured depth, because the equivalent circulating density divides by TRUE VERTICAL depth; (4) the worst TRANSPORT RATIO on the horizontal well; (5) the worst CUTTINGS CONCENTRATION on the horizontal well as a PERCENTAGE; and (6) the flow rate, in m3/s, that reaches a transport ratio of exactly 0.80 on the horizontal well, which is a solve rather than a run and therefore does not use 0.030.',
  jsonb_build_array(
    jsonb_build_object('key','slant_ecd_at_td_kgm3',          'label','Slant well ECD at total depth','unit','kg/m3',  'expected',1382.2893336895256, 'tol',0.005),
    jsonb_build_object('key','slant_min_annular_velocity_ms', 'label','Worst annular velocity',       'unit','m/s',    'expected',1.1756560409748478, 'tol',0.00005),
    jsonb_build_object('key','horizontal_ecd_at_td_kgm3',     'label','Horizontal well ECD',          'unit','kg/m3',  'expected',1441.9531576465401, 'tol',0.005),
    jsonb_build_object('key','horizontal_min_transport_ratio','label','Worst transport ratio',        'unit','-',      'expected',0.8328468755463043, 'tol',0.00005),
    jsonb_build_object('key','horizontal_worst_cuttings_conc_pct','label','Worst cuttings concentration','unit','percent','expected',0.7326199737252664,'tol',0.00005),
    jsonb_build_object('key','horizontal_min_flow_tr080_m3s', 'label','Flow rate for a 0.80 ratio',   'unit','m3/s',   'expected',0.024178302356402937,'tol',0.000005)
  )
),
(
  'hydraulics', 'advanced', 'expert',
  'both wells with the pumps off and the string moving, on the same new mud, at a trip speed the lessons do not run, with a clinging constant of 0.45',
  'Move the string, and fit four pressures in one window',
  'Six numbers on the same new mud again: 52, 33, 6 and 5 at 1320 kg/m3. The trip speed is 0.75 m/s for fields 1 to 5, which is not one of the three the lessons use. Report: (1) the SURGE PRESSURE on the SLANT well with a CLOSED string, in pascals; (2) the SURGE equivalent mud weight from that same run; (3) the SWAB equivalent mud weight on the same well with an OPEN string, which is BELOW the mud weight and is two changes from field 2 at once; (4) the ratio of the CLOSED pressure to the OPEN pressure on that well, which is greater than one; (5) the surge equivalent mud weight on the HORIZONTAL well with a closed string, which is much larger than field 2 because the equivalent mud weight divides by TRUE VERTICAL depth; and (6) the MAXIMUM TRIP SPEED, in m/s, that the slant well allows with a CLOSED string given a fracture equivalent mud weight of 1400 kg/m3 and a pore equivalent mud weight of 1260 kg/m3, which is a solve and therefore does not use 0.75.',
  jsonb_build_array(
    jsonb_build_object('key','slant_surge_dp_closed_Pa',      'label','Slant closed-string surge pressure','unit','Pa',   'expected',1147176.908236135,  'tol',50),
    jsonb_build_object('key','slant_surge_emw_closed_kgm3',   'label','Slant closed surge EMW',           'unit','kg/m3', 'expected',1366.6440330130283, 'tol',0.005),
    jsonb_build_object('key','slant_swab_emw_open_kgm3',      'label','Slant open-string swab EMW',       'unit','kg/m3', 'expected',1281.0694196662196, 'tol',0.005),
    jsonb_build_object('key','closed_over_open_dp_ratio',     'label','Closed over open pressure',        'unit','-',     'expected',1.1981335138884341, 'tol',0.00005),
    jsonb_build_object('key','horizontal_surge_emw_closed_kgm3','label','Horizontal closed surge EMW',    'unit','kg/m3', 'expected',1411.1350006312582, 'tol',0.005),
    jsonb_build_object('key','slant_max_trip_speed_ms',       'label','Maximum trip speed in the window', 'unit','m/s',   'expected',1.0880403500952598, 'tol',0.00005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr3_hydraulics_go_live.sql.
