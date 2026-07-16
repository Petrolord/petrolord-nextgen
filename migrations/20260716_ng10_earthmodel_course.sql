-- NG10 — Earth Modeling course, ALL THREE TIERS in one phase
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §4,
-- post-series follow-on; third of the four remaining geoscience apps,
-- engine + goldens ready since Suite G8).
--
-- NG8/NG9 shape: zero spine SQL — one catalog row (module mapped
-- BEFORE the Expert tier sells) + three capstone seeds + the flip.
--
-- Curriculum division of labour (binding, from the G8 plan and the
-- NG10 scope lock): this course owns the CONTAINER — surface stacks,
-- the monotonic clamp, zone geometry, well ties, fault blocks,
-- property population, per-block BULK rock volume. Fluids, contacts
-- and STOIIP booking stay with the ReservoirCalc course.
--
-- Teaching dataset IS the committed golden fixture
-- (packages/engines/test-data/earthmodel/goldens.json, dual
-- stdlib-Python oracle with anchors A1-A9): three source surfaces on
-- three DIFFERENT grids resampled to a 25x20 / 50 m model frame; zone
-- B pinches out (the clamp fixes exactly 180 BaseB nodes and reports
-- them); four wells incl. one true 45-degree build (W2) tied via
-- minimum-curvature; a fault polygon with the hand-counted census
-- {block0: 326, block1: 174}; trend + simple-kriging population; and
-- the closed-form zone-A bulk volume anchor of exactly 45,000,000 m3.
--
-- Oracle reproduced by running exactly the teaching-lib pipelines
-- (src/lib/earthmodelTeaching.js) in Node against @petrolord/engines
-- before this migration was written (see the NG10 pentest doc).
-- Internal consistency highlights: zone-A bulk = the closed-form
-- 45.0e6 m3 anchor and block volumes sum to it (31.00125 + 13.99875);
-- kriged phi AT a well equals the well (exact interpolation, nugget
-- below sill); block 1 holds only W1 so its weighted phi IS W1's
-- 0.315; the worst tie residual is the deviated well's BaseB
-- (45.028 m) — deviation moves the bottom of the hole.

-- ------------------------------------------------ 1. catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('earthmodel', 'Earth Modeling', 'geoscience', 9, 'coming_soon', 'welldata')
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'earthmodel', 'beginner', 'associate',
  'earthmodel/goldens (three-surface framework)',
  'Build the golden framework',
  'Resample the three source surfaces (TopA, TopB, BaseB — each on its own grid) onto the 25x20 model frame at 50 m cells, apply the depth-down monotonic clamp, and derive the two zone thickness grids. Read the framework panel: the mean TopB depth, how many BaseB nodes the clamp fixed (the zone B pinch-out), zone A''s mean and maximum thickness, zone B''s mean thickness, and zone A''s bulk rock volume.',
  jsonb_build_array(
    jsonb_build_object('key','s2_mean',   'label','Mean TopB depth on the model frame','unit','m',       'expected',1575.5,             'tol',0.1),
    jsonb_build_object('key','clamp_s3',  'label','BaseB nodes fixed by the clamp',    'unit','count',   'expected',180,                'tol',0),
    jsonb_build_object('key','tka_mean',  'label','Zone A mean thickness',             'unit','m',       'expected',36,                 'tol',0.05),
    jsonb_build_object('key','tka_max',   'label','Zone A maximum thickness',          'unit','m',       'expected',42,                 'tol',0.05),
    jsonb_build_object('key','tkb_mean',  'label','Zone B mean thickness',             'unit','m',       'expected',10.24,              'tol',0.05),
    jsonb_build_object('key','bulk_a_mm3','label','Zone A bulk rock volume',           'unit','10^6 m3', 'expected',45,                 'tol',0.01)
  )
),
(
  'earthmodel', 'intermediate', 'professional',
  'earthmodel/goldens (well ties)',
  'Tie the four wells',
  'Build minimum-curvature trajectories for the four wells (W2 carries a real 45 degree build), land every top in 3D, and tie each against its framework surface (residual = pick TVDSS minus the surface there). Report W2''s TVDSS at its TopA pick, three residuals from the tie table (W1 BaseB, W2 TopB, W3 TopA), the largest absolute residual in the well set, and the x coordinate of W2''s zone-A control point (the zone''s MD midpoint along the path).',
  jsonb_build_array(
    jsonb_build_object('key','w2_topa_tvdss','label','W2 TVDSS at the TopA pick',        'unit','m',    'expected',1496.6634373420557, 'tol',0.01),
    jsonb_build_object('key','w1_baseb_res', 'label','W1 BaseB tie residual',             'unit','m',    'expected',5,                  'tol',0.01),
    jsonb_build_object('key','w2_topb_res',  'label','W2 TopB tie residual',              'unit','m',    'expected',8.318351595797822,  'tol',0.01),
    jsonb_build_object('key','w3_topa_res',  'label','W3 TopA tie residual',              'unit','m',    'expected',1,                  'tol',0.01),
    jsonb_build_object('key','worst_res',    'label','Largest absolute tie residual',     'unit','m',    'expected',45.02816332199586,  'tol',0.01),
    jsonb_build_object('key','w2_cpa_x',     'label','W2 zone-A control point x',         'unit','m',    'expected',1610.8719179395334, 'tol',0.01)
  )
),
(
  'earthmodel', 'advanced', 'expert',
  'earthmodel/goldens (fault blocks + population)',
  'Blocks, properties, and per-block volume',
  'Label the model with the fault polygon and run everything per block: the block-1 node count, the plane-trend porosity at (1250, 2250), the kriged porosity at (1500, 2500) and AT well W1 (the exactness check: simple kriging with a nugget below the sill honors the data), zone A''s interval-weighted porosity in block 0, and zone A''s bulk rock volume in block 1.',
  jsonb_build_array(
    jsonb_build_object('key','block1_cells',   'label','Block 1 node count',                    'unit','count',  'expected',174,                 'tol',0),
    jsonb_build_object('key','trend_probe',    'label','Trend porosity at (1250, 2250)',        'unit','v/v',    'expected',0.3075,              'tol',0.001),
    jsonb_build_object('key','krige_probe',    'label','Kriged porosity at (1500, 2500)',       'unit','v/v',    'expected',0.2914277719922997,  'tol',0.001),
    jsonb_build_object('key','krige_at_w1',    'label','Kriged porosity at W1 (1100, 2100)',    'unit','v/v',    'expected',0.315,               'tol',0.0005),
    jsonb_build_object('key','phi_block0',     'label','Zone A weighted porosity, block 0',     'unit','v/v',    'expected',0.28631191845445614, 'tol',0.001),
    jsonb_build_object('key','bulk_a_block1',  'label','Zone A bulk volume in block 1',         'unit','10^6 m3','expected',13.998749999999998,  'tol',0.01)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. go live
update public.academy_apps set status = 'available' where slug = 'earthmodel';
