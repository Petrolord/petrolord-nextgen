-- ============================================================================
-- RC3: SCAL & Displacement joins the catalog, the THIRD Reservoir Engineering
-- course (plan of record: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, owner-approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert bridge
-- trigger can issue Suite discount codes) plus the three capstones. NO
-- prerequisite: owner Q2 set no hard gate inside the reservoir module, so
-- RC1 Decline Curve Analysis and RC2 Material Balance are RECOMMENDED before
-- this course, not required.
--
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC3-TRUTH.md); scalLab.test.js pins all eighteen.
-- Fixtures: test-data/ekene-dynamic/scal.json (the displacement design and
-- the three-plug capillary block from central PR #60) and the published
-- anchor Ahmed REH 4th ed. Example 4-7.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is what
-- makes the course enrollable and it is held in
-- 20260827_rc3_scal_go_live.sql until a production upload carries the
-- /dashboard/apps/scal route.
-- ============================================================================

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('scal', 'SCAL & Displacement', 'reservoir', 13, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'scal', 'beginner', 'associate',
  'ekene-dynamic/scal.json (Corey design, flood-era viscosities)',
  'Displace the Ekene sand',
  'Run the Ekene displacement from its designed relative permeability set (Corey with Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9, nw 2.5, no 2.0; water 0.5 cp against oil 1.8 cp) and read the flood: the endpoint mobility ratio, the Welge front saturation and the fractional flow at the front, the pore volumes injected at breakthrough, the displacement efficiency at breakthrough, and the days to breakthrough at a steady 8000 bwpd on the fixture pore volume.',
  jsonb_build_array(
    jsonb_build_object('key','m_ratio',      'label','Endpoint mobility ratio M',                    'unit','-',        'expected',1.2,                 'tol',0.005),
    jsonb_build_object('key','swf',          'label','Welge front saturation Swf',                   'unit','fraction', 'expected',0.6372,              'tol',0.0005),
    jsonb_build_object('key','fwf',          'label','Fractional flow at the front',                 'unit','fraction', 'expected',0.8682763300877854,  'tol',0.001),
    jsonb_build_object('key','qi_bt_pv',     'label','Pore volumes injected at breakthrough',        'unit','PV',       'expected',0.33077027444818546, 'tol',0.001),
    jsonb_build_object('key','ed_bt',        'label','Displacement efficiency at breakthrough',      'unit','fraction', 'expected',0.5088773453049006,  'tol',0.001),
    jsonb_build_object('key','bt_days_8000', 'label','Days to breakthrough at 8000 bwpd',            'unit','days',     'expected',926.6051908800841,   'tol',2)
  )
),
(
  'scal', 'intermediate', 'professional',
  'Ahmed Ex. 4-7 + ekene-dynamic/scal.json capillary',
  'Carry the lab to the field',
  'Work Ahmed Example 4-7 start to finish: the lab J-per-psi factor for the 80 md, 16 percent porosity core, the full-precision J at Sw 0.20, and the reservoir capillary pressure at Sw 0.20 obtained by scaling the PRINTED (rounded) J column back through the 120 md, 19 percent porosity reservoir rock, which is the chain the book itself uses. Then carry the Ekene plugs to the field on the sand''s own rock and fluids: the entry height in metres, the free water level in metres TVD given the mapped 1560 m contact, and the water saturation at the crest of the structure.',
  jsonb_build_array(
    jsonb_build_object('key','lab_j_per_psi', 'label','Ahmed 4-7 lab J factor per psi',              'unit','1/psi',    'expected',0.0967993827459659,  'tol',0.0001),
    jsonb_build_object('key','j_at_sw02',     'label','Ahmed 4-7 J at Sw 0.20 (full precision)',     'unit','-',        'expected',0.16939891980544033, 'tol',0.0005),
    jsonb_build_object('key','res_pc_sw02',   'label','Reservoir Pc at Sw 0.20 from the printed J',  'unit','psi',      'expected',1.5534071373580902,  'tol',0.002),
    jsonb_build_object('key','h_entry_m',     'label','Ekene entry height above the FWL',            'unit','m',        'expected',3.142982863763458,   'tol',0.01),
    jsonb_build_object('key','fwl_m',         'label','Ekene free water level',                      'unit','m TVD',    'expected',1563.1429828637636,  'tol',0.02),
    jsonb_build_object('key','sw_at_crest',   'label','Water saturation at the crest',               'unit','fraction', 'expected',0.35062979402484734, 'tol',0.0005)
  )
),
(
  'scal', 'advanced', 'expert',
  'Ekene lab kr grid + plugs + designed dip/polymer cases',
  'Fit, average, and design the flood',
  'Fit the 13-row lab relative permeability grid (Sw 0.35 to 0.75 in twelve equal steps, Swirr 0.25 given) with fixed endpoints taken from the table and report the fitted water exponent. Average the three Ekene plug J-curves at the true Swirr 0.25 and report the refitted coefficient a, which drifts off the design 0.25 through the log-linear resampling. Then design the flood on the Ekene sand: the displacement efficiency at breakthrough for the dip case (k 250 md, cross-section 20000 ft2, total rate 2000 rb/d, water gravity 1.03, oil gravity from API 32) displacing updip at plus 10 degrees and again downdip at minus 10 degrees, the polymer screening case at a water viscosity multiplier of 4, and the height-averaged water saturation over the crest column from the composite trapezoid with 2000 intervals between the contact and the crest.',
  jsonb_build_array(
    jsonb_build_object('key','fitted_nw',           'label','Fitted water Corey exponent nw',            'unit','-',        'expected',2.4999999999999996,  'tol',0.001),
    jsonb_build_object('key','avg_refit_a',         'label','Averaged-refit J coefficient a',            'unit','-',        'expected',0.2491501585202375,  'tol',0.0005),
    jsonb_build_object('key','gravity_ed_bt',       'label','EDbt displacing updip at 10 degrees',       'unit','fraction', 'expected',0.5095807170488317,  'tol',0.0005),
    jsonb_build_object('key','downdip_ed_bt',       'label','EDbt displacing downdip at 10 degrees',     'unit','fraction', 'expected',0.5081700834294871,  'tol',0.0005),
    jsonb_build_object('key','polymer_ed_bt',       'label','EDbt with the water viscosity times 4',     'unit','fraction', 'expected',0.5771964898801638,  'tol',0.001),
    jsonb_build_object('key','sw_avg_crest_column', 'label','Height-averaged Sw over the crest column',  'unit','fraction', 'expected',0.48345033394940007, 'tol',0.002)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- See 20260827_rc3_scal_go_live.sql, applied only after the route ships.
