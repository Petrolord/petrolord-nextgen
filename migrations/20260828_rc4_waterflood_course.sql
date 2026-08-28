-- ============================================================================
-- RC4: Waterflood Management joins the catalog, the FOURTH Reservoir
-- Engineering course (plan of record: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, owner-approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert bridge
-- trigger can issue Suite discount codes) plus the three capstones. NO
-- prerequisite: owner Q2 set no hard gate inside the reservoir module, so
-- RC1 Decline Curve Analysis, RC2 Material Balance and RC3 SCAL are
-- RECOMMENDED before this course, not required.
--
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC4-TRUTH.md); floodLab.test.js pins all eighteen
-- through the course's own teaching lab, so a panel and the live grader
-- cannot drift apart. Fixture: test-data/ekene-dynamic/waterflood.json with
-- field.json, mbal.json and scal.json supplying the statics, the tank
-- constants and the displacement design.
--
-- ONE CAPSTONE FIELD WAS REPLACED BEFORE SEEDING, and the reason is recorded
-- here because it is the wave's most useful finding about its own design.
-- Section J originally graded `tracked_vs_frozen_vrr` = 1.0349459620241488
-- (tol 0.0005) at the Professional tier. That value sits 4.6426e-5 from the
-- ASSOCIATE tier's own graded field_cum_vrr = 1.034899536109, so the tolerance
-- was 10.8x the gap and the Associate answer scored full marks on the
-- Professional field: it could not distinguish a learner who tracked the
-- formation volume factor from one who did not, which is the only thing it
-- existed to test. It also graded a topic Associate m05 l03 owns outright.
-- Replaced by `chan_slope_e6`, which is Professional-exclusive, collides with
-- no other graded value, and gives m05 a graded field where it had none.
-- (Suite RC1 hit the same failure mode after seeding and needed a live fix
-- migration; this wave caught it before any migration existed.)
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is what
-- makes the course enrollable and it is held in
-- 20260828_rc4_waterflood_go_live.sql until a production upload carries the
-- /dashboard/apps/waterflood route.
-- ============================================================================

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('waterflood', 'Waterflood Management', 'reservoir', 14, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'waterflood', 'beginner', 'associate',
  'ekene-dynamic/waterflood.json (36 monthly field periods, frozen factor set)',
  'Read the flood ledger',
  'Work the Ekene waterflood ledger over its 36 monthly periods, 2023-01 through 2025-12, on the frozen factor set Bo 1.21584, Bw 1.02, Bg 0 and Rs 400 scf/stb. Report the cumulative voidage replacement ratio as the ratio of the summed voidages, the total produced and injected voidage in reservoir barrels, the zero-based index of the first period at which the CUMULATIVE ratio reaches or exceeds 1.0, the number of periods whose INSTANTANEOUS ratio falls below an operator target band of 1.00 to 1.20, and the produced voidage of January 2023 alone. Only free produced gas adds voidage: subtract the solution gas Rs*Np/1000 from the metered gas before converting.',
  jsonb_build_array(
    jsonb_build_object('key','field_cum_vrr',            'label','Field cumulative VRR',                      'unit','-',        'expected',1.034899536109,      'tol',0.0005),
    jsonb_build_object('key','produced_voidage_rb',      'label','Total produced voidage',                    'unit','rb',       'expected',221736.43680913927,  'tol',50),
    jsonb_build_object('key','injected_voidage_rb',      'label','Total injected voidage',                    'unit','rb',       'expected',229474.93559224083,  'tol',50),
    jsonb_build_object('key','fillup_month_index',       'label','Fill-up period index (zero-based)',         'unit','index',    'expected',11,                  'tol',0),
    jsonb_build_object('key','months_under_target_band', 'label','Periods under the 1.00 to 1.20 band',       'unit','count',    'expected',4,                   'tol',0),
    jsonb_build_object('key','jan_produced_voidage_rb',  'label','January 2023 produced voidage',             'unit','rb',       'expected',5747.317402456214,   'tol',1)
  )
),
(
  'waterflood', 'intermediate', 'professional',
  'ekene-dynamic/waterflood.json (allocation matrix, two patterns, surveillance rows)',
  'Allocate, split, diagnose',
  'Take the Ekene flood apart by geometry. The allocation matrix routes Ekene-2 to Ekene-6 0.45, Ekene-1 0.30 and Ekene-3 0.15, and Ekene-4 to Ekene-3 0.40, Ekene-6 0.35 and Ekene-5 0.10. The two elements are North, holding Ekene-1 and Ekene-6, and South, holding Ekene-3 and Ekene-5. Report the injected volume that lands on no producer, each element''s cumulative VRR on the frozen factor set, and the injection recommended for the South element at a target VRR of 1.0 over a three-period trailing window, scaled from the ALLOCATED injection into that element. Then two diagnostics on the raw well data: the Hall plot slope ratio for Ekene-4 built on pressure ABOVE the 2050 psia injection reference, and the late-time log-log slope of the water oil ratio derivative for Ekene-6.',
  jsonb_build_array(
    jsonb_build_object('key','out_of_zone_bbl',       'label','Out-of-zone injection',                        'unit','bbl',      'expected',26997.051246145966, 'tol',20),
    jsonb_build_object('key','north_cum_vrr',         'label','North element cumulative VRR',                 'unit','-',        'expected',1.2024353717815623, 'tol',0.0005),
    jsonb_build_object('key','south_cum_vrr',         'label','South element cumulative VRR',                 'unit','-',        'expected',0.6097477559533482, 'tol',0.0005),
    jsonb_build_object('key','south_recommended_wi',  'label','South recommended injection at target 1.0',    'unit','bbl',      'expected',2683.051749612857,  'tol',2),
    jsonb_build_object('key','hall_ratio_e4',         'label','Ekene-4 Hall slope ratio above the reference', 'unit','-',        'expected',1.4285714285714286, 'tol',0.002),
    jsonb_build_object('key','chan_slope_e6',         'label','Ekene-6 Chan late-time slope',                 'unit','-',        'expected',2.348281726147951,  'tol',0.005)
  )
),
(
  'waterflood', 'advanced', 'expert',
  'ekene-dynamic/waterflood.json (five-layer column, five-spot element, breakthrough date)',
  'Design the flood',
  'Design and then check the Ekene flood. The sand is five non-communicating layers, given in DEPTH order with thicknesses 18, 22, 16, 14 and 14 ft and permeabilities 173.81198701129736, 607.7507038307907, 250, 102.8382190362731 and 359.5839451276606 md; the endpoint mobility ratio is 1.2 and the frozen factors are Bo 1.21584 and Bw 1.02. Report the Dykstra-Parsons permeability variation V, the vertical coverage at the FIRST layer breakthrough at that mobility ratio, the Stiles surface water cut at the same stage using the capacity ratio A = M*Bo/Bw, and the Craig five-spot areal sweep at breakthrough evaluated at the mobility ratio. Then forecast the five-spot element of 208.8040473397547 acres and 34.585155812896204 ft net at porosity 0.2, injecting 2000 rb/d with the vertical sweep taken from your own coverage answer and a water oil ratio limit of 25, and report the breakthrough time as the engine reports it, on whole monthly steps of 30.4375 days. Finally, invert the pattern breakthrough condition on the 35106.29313483455 bbl the allocation routed to Ekene-6 before its 2024-03-01 breakthrough, and report the contacted pore volume as a fraction of the WHOLE element, 11205422.76570545 rb, computed without the vertical sweep multiplier.',
  jsonb_build_array(
    jsonb_build_object('key','dykstra_parsons_v',       'label','Dykstra-Parsons permeability variation V',   'unit','-',        'expected',0.5,                  'tol',0.001),
    jsonb_build_object('key','dp_coverage_first_bt',    'label','Coverage at the first breakthrough',         'unit','fraction', 'expected',0.5146907350993352,  'tol',0.0005),
    jsonb_build_object('key','stiles_wc_first_bt',      'label','Stiles surface water cut at first BT',       'unit','fraction', 'expected',0.5843728303284756,  'tol',0.0005),
    jsonb_build_object('key','eabt_at_design_m',        'label','Areal sweep at breakthrough at M = 1.2',     'unit','fraction', 'expected',0.6573574366303985,  'tol',0.0005),
    jsonb_build_object('key','design_breakthrough_days','label','Design-case breakthrough time',              'unit','days',     'expected',639.1875,            'tol',2),
    jsonb_build_object('key','implied_swept_fraction',  'label','Implied contacted fraction of the element',  'unit','fraction', 'expected',0.014697005138728762,'tol',0.0002)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- See 20260828_rc4_waterflood_go_live.sql, applied only after the route ships.
