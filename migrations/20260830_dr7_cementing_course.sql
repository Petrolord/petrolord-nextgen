-- ============================================================================
-- DR7: Cementing joins the catalog, the SEVENTH Drilling & Completions course
-- (petrolord-suite docs/scope/NextGen-Drilling-Courses-PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 24; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 through DR6 are RECOMMENDED and
-- not required.
--
-- ONE WELLBORE, TWO WELLS, TWO PROGRAMMES AND ONE CLOSED-FORM FIXTURE.
-- cementing_cases.json cements the 7 inch production string on the same slant
-- and horizontal wells DR1 through DR6 use, inside 9-5/8 inch casing to 1400
-- and 1200 m and an 8-1/2 inch open hole below, at 15 percent excess. Each
-- well is run as a NEAT single slurry and as a LEAD AND TAIL. The vertical
-- fixture is a hand-built friction-free case whose volumes are exact cylinder
-- algebra and whose end pump pressure IS its float differential, because none
-- of its three fluids carries a rheology.
--
-- THE CAPSTONE CEMENTS THE STRING THE LESSONS' WELL WAS DRILLED THROUGH. Same
-- slant trajectory, which is the module's own well, and one hole section up:
-- the 9-5/8 inch INTERMEDIATE casing at 0.244475 by 0.2204974 m, shoe 1400 m,
-- float collar 1352, cased to 350 m behind 13-3/8 inch at 0.315341, 12-1/4
-- inch open hole at 0.31115 below that. Top of cement 250 m, excess 30
-- percent, spacer 6 cubic metres, split at 350, yield 0.0402, rate 0.028.
-- Fluids at 1400, 1520, 1580 and 1920 kg/m3 on four Fann sets none of which is
-- published. Standoff mud 1300 kg/m3, bow spring at 10.5 m and 11000 N, and a
-- 0.29 m rigid blade for comparison. Previous shoe leak-off 1600 kg/m3.
--
-- THE PUBLISHED-GOLDEN COLLISION CHECK, WHICH DR4 EARNED AND THIS COURSE RAN
-- BEFORE WRITING A LESSON. All eighteen proposed graded values were swept
-- against every one of the 977 numbers cementing_cases.json publishes, at each
-- field's own tolerance: 0 collisions. The pairwise check across the eighteen
-- is also 0. Both are re-asserted inside cementingLab.test.js.
--
-- FOUR FINDINGS THE FIXTURE'S OWN OUTPUT PRODUCED. (1) The open hole excess is
-- the ONLY guess on a volume sheet, every other input is a table, a tally or a
-- decision, and the slurry volume is exactly linear in it; 15 points low costs
-- about 212 m of uncemented annulus. (2) The two wells have IDENTICAL slurry
-- volumes to the last digit and differ only in displacement, by 200 m of
-- casing bore, because the volume sheet reads lengths and diameters and
-- nothing else. (3) The pump rate is a TRADE, and on the horizontal well with
-- a neat slurry at a 1700 kg/m3 shoe limit the window is CLOSED at
-- -0.0027654895607562464 cubic metres a second, while a lead slurry opens it
-- to 0.00539927840496492 by moving BOTH edges. (4) The mid-span sag, not the
-- centralizer, binds the standoff on both wells: the horizontal well reads
-- 0.8462214846722909 at the centralizer and 0.599178961025609 at mid span, and
-- only the second fails the API target.
--
-- WHAT THE ENGINE DOES NOT DO, TAUGHT IN EXPERT m05 AND GRADED NOWHERE: casing
-- rotation and reciprocation, intermixing and contamination, thickening time
-- and compressive strength, temperature, losses to the formation, gas
-- migration after placement, the transient free-fall rate, tension times
-- dogleg in the standoff, and cement bond evaluation.
-- 20260830_dr7_cementing_go_live.sql asserts it.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (dr7_fields.mjs); cementingLab.test.js pins all
-- eighteen through the course's own teaching lab across 38 cases.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr7_cementing_go_live.sql until a production upload carries the
-- /dashboard/apps/cementing route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('cementing', 'Cementing', 'drilling', 24, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'cementing', 'beginner', 'associate',
  'the 9-5/8 inch intermediate string on the same slant well the lessons use, one hole section up, on its own hole sizes, top of cement, excess and slurry yield',
  'Order a job one hole section up',
  'Six volumes for the 9-5/8 inch INTERMEDIATE casing on the same slant trajectory the lessons use. The casing is 0.244475 m outside and 0.2204974 m inside, with its shoe at 1400 m of measured depth and its float collar at 1352. The hole is cased from surface to 350 m behind 13-3/8 inch at a bore of 0.315341 m, and open hole from 350 to 1400 m at 12-1/4 inch, 0.31115 m. Top of cement 250 m, open hole excess 30 PERCENT, spacer 6 cubic metres, lead and tail split at 350 m, slurry yield 0.0402 cubic metres a sack, pump rate 0.028 cubic metres a second. Report: (1) the ANNULAR SLURRY volume; (2) the SHOE TRACK volume; (3) the TOTAL SLURRY volume; (4) the DISPLACEMENT volume; (5) the SACKS; and (6) the EFFECTIVE BORE of the open hole after the excess, in metres. Do field 6 first: inflate the open hole CAPACITY by 30 percent and back-solve the bore from it. Never inflate the diameter, because a ten percent bigger diameter is a twenty one percent bigger area. Traps. The casing is 9-5/8 inch and not the lessons'' 7 inch, so both capacities change. Field 4 is measured to the FLOAT COLLAR at 1352 m and not to the shoe at 1400, and the 48 m between them is field 2. The excess applies to the open hole row only, so the 250 to 350 m section inside the 13-3/8 inch casing is untouched by it. Field 1 spans TWO capacities: 100 m of cased annulus and 1050 m of open hole. Free checks: field 1 plus field 2 is field 3 exactly; field 5 times 0.0402 is field 3; field 4 divided by the inside capacity is exactly 1352; and field 6 must be LARGER than the bit size of 0.31115 and smaller than 0.404495, which is what inflating the diameter rather than the area would give. It also comes out LARGER than the 13-3/8 inch casing bore of 0.315341 above it, which is correct and is the same reversal Associate m03 teaches on the published well.',
  jsonb_build_array(
    jsonb_build_object('key','annulus_slurry_m3',          'label','Annular slurry',            'unit','m3','expected',42.83199302556888,  'tol',0.0000005),
    jsonb_build_object('key','shoe_track_m3',              'label','Shoe track',                'unit','m3','expected',1.8328970170415964, 'tol',0.0000005),
    jsonb_build_object('key','slurry_m3',                  'label','Total slurry',              'unit','m3','expected',44.66489004261047,  'tol',0.0000005),
    jsonb_build_object('key','displacement_m3',            'label','Displacement',              'unit','m3','expected',51.626599313338296, 'tol',0.0000005),
    jsonb_build_object('key','sacks',                      'label','Sacks',                     'unit','-', 'expected',1111.0669164828475, 'tol',0.0005),
    jsonb_build_object('key','open_hole_effective_bore_m', 'label','Open hole effective bore',  'unit','m', 'expected',0.32852429371737485,'tol',0.0000005)
  )
),
(
  'cementing', 'intermediate', 'professional',
  'the Associate capstone''s job simulated, on four fluid densities and four Fann sets the lessons never run, against a leak-off of 1600 kg/m3 at a previous shoe of 350 m',
  'Place it, and find the rate window',
  'Six placement numbers for the Associate capstone''s job. Mud in the hole at 1400 kg/m3, then 6 cubic metres of spacer at 1520, the lead at 1580, the tail at 1920, and displacement at 1400. Four NEW Fann sets: mud 600/300/6/3 of 72, 44, 8 and 7; spacer 46, 28, 5 and 4; lead 90, 56, 12 and 9; tail 124, 78, 17 and 14. Pump rate 0.028 cubic metres a second. The previous shoe at 350 m has been leak-off tested to 1600 kg/m3 equivalent. Report: (1) the END PUMP PRESSURE in pascals; (2) the FLOAT DIFFERENTIAL in pascals; (3) the PEAK ECD AT THE PREVIOUS SHOE in kg/m3; (4) the SMALLEST pump rate at which the job does NOT free fall, in cubic metres a second; (5) the LARGEST pump rate whose peak ECD at the previous shoe stays at or below 1600; and (6) the RATE WINDOW WIDTH, which is field 5 less field 4. Traps. Field 3 is at the PREVIOUS shoe at 350 m, not at the casing shoe at 1400, and the engine reports both. Fields 4 and 5 are BISECTIONS: a sweep will put you a whole step wide. Field 6 is NEGATIVE, because this job''s window is CLOSED, and a positive answer means one of the two edges is wrong. Field 4 is about five times the design rate, which is not an error: large-diameter casing in a wide annulus free falls at every rate anybody could pump. And the four Fann sets are what both edges are made of, so reusing the lessons'' rheologies moves both. Free checks: field 5 less field 4 is field 6 exactly; field 3 must be BELOW 1600 and field 5 must therefore exceed the design rate of 0.028; and field 1 must exceed field 2, because their difference is the friction at the last step.',
  jsonb_build_array(
    jsonb_build_object('key','end_pump_pressure_pa',        'label','End pump pressure',        'unit','Pa',   'expected',6233731.747831926,  'tol',50),
    jsonb_build_object('key','float_diff_pa',               'label','Float differential',       'unit','Pa',   'expected',4969584.9998046905,  'tol',50),
    jsonb_build_object('key','max_ecd_prev_shoe_kgm3',      'label','Peak ECD, previous shoe',  'unit','kg/m3','expected',1576.3692813689117,  'tol',0.005),
    jsonb_build_object('key','min_rate_no_free_fall_m3s',   'label','Slowest rate, no free fall','unit','m3/s','expected',0.12974748005989847, 'tol',0.0000005),
    jsonb_build_object('key','max_rate_under_ecd_limit_m3s','label','Fastest rate under 1600',  'unit','m3/s', 'expected',0.04354109120904704, 'tol',0.0000005),
    jsonb_build_object('key','rate_window_width_m3s',       'label','Rate window width',        'unit','m3/s', 'expected',-0.08620638885085144,'tol',0.0000005)
  )
),
(
  'cementing', 'advanced', 'expert',
  'the same intermediate string centralized, on a bow spring and a rigid blade the lessons never run, in a mud the lessons never use',
  'Centralize it, and say which device works',
  'Six centralization numbers for the Associate capstone''s string. The casing is 9-5/8 inch at 0.244475 m outside and 0.2204974 inside, weighing 69.9437033 kg per metre, on the same slant trajectory. The hole is cased to 350 m at 0.315341 m and open hole to 1400 at 0.31115. The centralizer is a BOW SPRING at 10.5 m spacing with a restoring force of 11000 N quoted at the standard 0.67. The mud is 1300 kg/m3, not the lessons'' 1440. A RIGID blade of 0.29 m is to be evaluated on the same string at the same spacing. Report: (1) the MINIMUM STANDOFF with the bow springs; (2) the STANDOFF AT THE CENTRALIZER at the interval where that minimum occurs; (3) the REQUIRED SPACING to reach the API target, in metres; (4) the BUOYED WEIGHT per metre at 1300 kg/m3, in newtons per metre; (5) the MINIMUM STANDOFF with the 0.29 m RIGID blade at the same spacing; and (6) the SPRING RATE of the 11000 N bow spring in the open hole, in newtons per metre. Do field 4 first, then field 6, then 1 and 2 from one profile, then 3 by bisection, then 5. Traps. The 30 percent excess of the other two capstones appears NOWHERE here: standoffProfile runs the annulus at zero excess, so a clearance of about 0.042 rather than 0.033 means the wrong bore was used. The casing is 9-5/8 inch, so its clearance, its weight and its bending stiffness all differ from the lessons''. The mud is LIGHTER, so the casing is heavier in the hole and the standoff slightly worse. Field 5 is not the blade ratio: the sag is subtracted from it exactly as it is for a bow spring. Free checks: field 1 must be at or below field 2; field 3 must EXCEED the 10.5 m being run, because the job passes; field 6 times 0.33 times the open hole clearance must give back 11000 N; and field 1 passes the API 67 percent while field 5 does not.',
  jsonb_build_array(
    jsonb_build_object('key','min_standoff',                  'label','Minimum standoff',            'unit','-',  'expected',0.8556417628346304, 'tol',0.0000005),
    jsonb_build_object('key','standoff_at_centralizer_at_min','label','Standoff at the centralizer', 'unit','-',  'expected',0.8841171967314949, 'tol',0.0000005),
    jsonb_build_object('key','required_spacing_m',            'label','Required spacing',            'unit','m',  'expected',15.99770776601963,  'tol',0.0000005),
    jsonb_build_object('key','buoyed_weight_n_per_m',         'label','Buoyed weight',               'unit','N/m','expected',572.3226608514,     'tol',0.0005),
    jsonb_build_object('key','min_standoff_rigid',            'label','Minimum standoff, rigid',     'unit','-',  'expected',0.6424096181525695, 'tol',0.0000005),
    jsonb_build_object('key','centralizer_spring_rate_n_per_m','label','Spring rate',                'unit','N/m','expected',999875.0156230475,  'tol',0.005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr7_cementing_go_live.sql.
