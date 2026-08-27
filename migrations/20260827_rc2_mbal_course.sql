-- ============================================================================
-- RC2: Material Balance joins the catalog, the SECOND Reservoir Engineering
-- course (plan of record: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, owner-approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert bridge
-- trigger can issue Suite discount codes) plus the three capstones. NO
-- prerequisite: owner Q2 set no hard gate inside the reservoir module, so
-- RC1 Decline Curve Analysis is RECOMMENDED before this course, not required.
--
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC2-TRUTH.md); tankLab.test.js pins all eighteen.
-- Fixtures: test-data/ekene-dynamic (the field RC1 put on production) and
-- the armed published anchors in test-data/mbal (Dake Exercise 9.2, Ahmed
-- REH 4th ed. Examples 10-10 and 11-1).
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is what
-- makes the course enrollable and it is held in
-- 20260827_rc2_mbal_go_live.sql until a production upload carries the
-- /dashboard/apps/mbal route.
-- ============================================================================

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('mbal', 'Material Balance', 'reservoir', 12, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'mbal', 'beginner', 'associate',
  'ekene-dynamic/mbal.json (six pressure surveys, no aquifer)',
  'Close the Ekene tank',
  'Run material balance on the Ekene survey history and read the tank: the underground withdrawal and the total expansion at the last survey, the oil in place the Havlena-Odeh straight line gives, the share of that expansion carried by rock and connate water, the depletion drive index, and the quality of the straight line itself.',
  jsonb_build_array(
    jsonb_build_object('key','f_last_rb',     'label','Underground withdrawal F at the last survey', 'unit','rb',     'expected',317926.842484584,   'tol',50),
    jsonb_build_object('key','et_last_rb',    'label','Total expansion Et at the last survey',       'unit','rb/stb', 'expected',0.0261900809071921, 'tol',0.00005),
    jsonb_build_object('key','ooip_stb',      'label','OOIP from the Havlena-Odeh slope',            'unit','stb',    'expected',12139208.1074968,   'tol',20000),
    jsonb_build_object('key','efw_share_pct', 'label','Efw share of Et at the last survey',          'unit','%',      'expected',39.2996108949418,   'tol',0.2),
    jsonb_build_object('key','ddi_final',     'label','Depletion drive index at the last survey',    'unit','-',      'expected',0.607003891050583,  'tol',0.005),
    jsonb_build_object('key','r_squared',     'label','R-squared of the straight line',              'unit','-',      'expected',1,                  'tol',0.001)
  )
),
(
  'mbal', 'intermediate', 'professional',
  'mbal/ahmed-ex-10-10-fetkovich.json + ekene-dynamic/mbal.json',
  'Aquifers, and the cost of the wrong one',
  'Work the Fetkovich aquifer of Ahmed Example 10-10 from its published geometry: the encroachable water, the productivity index on the pseudo-steady-state form, the decay term over one annual step, and the cumulative influx after four steps. Then test the opposite error by handing a pot aquifer to the Ekene tank, which has none, and report what the regression does with the freedom.',
  jsonb_build_array(
    jsonb_build_object('key','wei_bbl',        'label','Fetkovich Wei for Ahmed 10-10',              'unit','bbl',       'expected',211934253.721285,  'tol',500000),
    jsonb_build_object('key','j_bbl_d_psi',    'label','Aquifer productivity index J',               'unit','bbl/d/psi', 'expected',116.496154838747,  'tol',0.5),
    jsonb_build_object('key','decay_365',      'label','Decay term over one 365 day step',           'unit','-',         'expected',0.422897624804177, 'tol',0.002),
    jsonb_build_object('key','we_final_mmbbl', 'label','Cumulative We after four steps',             'unit','MMbbl',     'expected',37.9731544101719,  'tol',0.4),
    jsonb_build_object('key','pot_ooip_stb',   'label','OOIP when a pot aquifer is forced on Ekene', 'unit','stb',       'expected',-516449.043355256, 'tol',20000),
    jsonb_build_object('key','pot_r2',         'label','R-squared of that wrong-model fit',          'unit','-',         'expected',0.999485673716372, 'tol',0.002)
  )
),
(
  'mbal', 'advanced', 'expert',
  'mbal/dake-9-2.ts + mbal/ahmed-ex-11-1-combination.json',
  'The finite aquifer and the published benchmark',
  'Run Carter-Tracy with a finite aquifer on Dake Exercise 9.2 and report the oil in place and the cumulative influx the engine recovers, together with the bounded-circle dimensionless pressure at a dimensionless time of 100. Then work the combination-drive terms of Ahmed Example 11-1: the water influx, the water drive index, and the sum of the four indices under the convention that actually closes.',
  jsonb_build_array(
    jsonb_build_object('key','dake_ooip_mmstb', 'label','Dake 9.2 OOIP from Carter-Tracy',             'unit','MMSTB', 'expected',307.221409553720,  'tol',3),
    jsonb_build_object('key','dake_we_mmrb',    'label','Dake 9.2 cumulative water influx',            'unit','MMrb',  'expected',88.0645883139400,  'tol',1),
    jsonb_build_object('key','pd_finite_100',   'label','Bounded-circle pD at reD 5, tD 100',          'unit','-',     'expected',9.30886079703705,  'tol',0.05),
    jsonb_build_object('key','a111_we_bbl',     'label','Ahmed 11-1 water influx We',                  'unit','bbl',   'expected',411281.250000001,  'tol',500),
    jsonb_build_object('key','a111_wdi',        'label','Ahmed 11-1 water drive index',                'unit','-',     'expected',0.211250877090399, 'tol',0.002),
    jsonb_build_object('key','a111_index_sum',  'label','Ahmed 11-1 drive indices summed',             'unit','-',     'expected',1,                 'tol',0.002)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- See 20260827_rc2_mbal_go_live.sql, applied only after the route ships.
