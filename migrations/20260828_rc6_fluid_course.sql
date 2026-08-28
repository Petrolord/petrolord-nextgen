-- ============================================================================
-- RC6: Fluid Properties & PVT joins the catalog, the SIXTH Reservoir
-- Engineering course (plan of record: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, owner-approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert bridge
-- trigger can issue Suite discount codes) plus the three capstones. NO
-- prerequisite: owner Q2 set no hard gate inside the reservoir module, so
-- RC1 through RC5 are RECOMMENDED before this course, not required.
--
-- THE EXTRACTION GATE THIS COURSE WAITED ON. The plan makes every follow-on
-- course conditional on its engine landing in @petrolord/engines with goldens
-- first. That extraction is petrolord-engines PR #69: a central engines/fluid
-- holding the black-oil correlation set lifted out of mbalEngine (Standing,
-- Vasquez-Beggs, Glaso, Hall-Yarborough, Dranchuk-Abou-Kassem, McCain, Beal,
-- Beggs-Robinson, Lee-Gonzalez-Eakin, plus the two validity-warning
-- functions) and the Peng-Robinson 1978 compositional engine moved from the
-- Suite's Fluid Systems Studio with its independent Python oracle. Vendored
-- into this repo by file copy; subtree pull does not work here.
--
-- THE SCOPE DECISION THAT SHAPES THIS COURSE. The Suite ships a tier matrix
-- (docs/scope/FluidStudio-TierMatrix.md) grading every displayed quantity as
-- measured, armed, oracle_gated, lab_tuned, published_method or screening.
-- RC6 GRADES ONLY THE FIRST FIVE. It teaches the `screening` quantities and
-- certifies none of them: Expert module m05 covers LBC viscosity, interfacial
-- tension and the black-oil separator's gas partition, states each one's
-- mechanism and its limits, and contributes no capstone field. That is the
-- RC5 treatment of results literacy applied to a ladder the engine already
-- publishes, and the reason is the same: teaching a number and certifying a
-- learner can produce it are different acts, and the second implies the
-- number is worth producing.
--
-- Two subject fluids. EKENE (Associate) is the designed oil the whole RC
-- series runs on, so every correlation output has a known value to be held
-- against. GOOD OIL CO. WELL NO. 4 (Professional and Expert) is Core
-- Laboratories report RFL 88001, a real published study reproduced in McCain
-- and in Whitson & Brule, and `armed` in the engine's harness as CASE 19.
-- Only a measured fluid lets a model error be quantified rather than asserted.
--
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC6-TRUTH.md section G, verified field by field
-- against the engine by verify_section_g.py); fluidLab.test.js pins all
-- eighteen through the course's own teaching lab, so a panel and the live
-- grader cannot drift apart. Pairwise tolerance-collision check across all
-- eighteen: 0 fatal, 0 notes. A cross-course sweep confirms that no RC1
-- through RC5 lesson prints any RC6 graded value.
--
-- A DEFECT IN RC5 WAS FOUND WHILE DERIVING THIS TRUTH and fixed live on the
-- same day (20260828_rc5_sim_capstone_prompt_fix.sql): the RC5 Professional
-- capstone prompt named 2600 psia where its graded correlated_bo_at_pi is
-- Standing's answer at 3200. Building each course on the engine the last one
-- used is what surfaced it.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is what
-- makes the course enrollable and it is held in
-- 20260828_rc6_fluid_go_live.sql until a production upload carries the
-- /dashboard/apps/fluid route.
-- ============================================================================

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('fluid', 'Fluid Properties & PVT', 'reservoir', 16, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'fluid', 'beginner', 'associate',
  'the designed Ekene fluid (32 API, gas gravity 0.75, 180 F, bubble point 2000 psia, initial pressure 3200 psia, 400 scf/stb)',
  'Work the correlations',
  'Produce a black-oil description of the Ekene oil from the correlations the engine carries. The fluid is 32 API with a gas gravity of 0.75 at a reservoir temperature of 180 F, its designed bubble point is 2000 psia, its designed solution gas ratio is 400 scf/stb and its initial pressure is 3200 psia. Report the bubble point Standing''s correlation returns for the DESIGNED 400 scf/stb; the SATURATED formation volume factor Standing returns at that same designed solution gas ratio, with no undersaturated correction applied; the dead oil viscosity Beal''s correlation returns, with no dissolved gas in it; the gas z factor Hall-Yarborough returns at the INITIAL pressure of 3200 psia on Sutton pseudo-criticals; the gas formation volume factor at that pressure on that same z; and the percentage by which the Hall-Yarborough z differs from the Dranchuk-Abou-Kassem z at the same state, taken relative to Dranchuk-Abou-Kassem.',
  jsonb_build_array(
    jsonb_build_object('key','ekene_pb_standing_psia',       'label','Standing bubble point at 400 scf/stb',    'unit','psia',     'expected',1912.1923059028293,    'tol',0.05),
    jsonb_build_object('key','ekene_bo_at_designed_rs',      'label','Standing saturated Bo at 400 scf/stb',    'unit','rb/stb',   'expected',1.2407824121407645,    'tol',0.0005),
    jsonb_build_object('key','ekene_muod_beal_cp',           'label','Beal dead oil viscosity',                 'unit','cp',       'expected',2.3437444714709295,    'tol',0.0005),
    jsonb_build_object('key','ekene_z_hy_at_pi',             'label','Hall-Yarborough z at 3200 psia',          'unit','-',        'expected',0.8577529684232971,    'tol',0.0005),
    jsonb_build_object('key','ekene_bg_at_pi_rb_scf',        'label','Gas FVF at 3200 psia',                    'unit','rb/scf',   'expected',0.0008633118643757966, 'tol',0.0000005),
    jsonb_build_object('key','ekene_z_correlation_gap_pct',  'label','z disagreement, HY against DAK',          'unit','percent',  'expected',-0.3303055462323185,   'tol',0.002)
  )
),
(
  'fluid', 'intermediate', 'professional',
  'Good Oil Co. Well No. 4, Core Laboratories RFL 88001 (11 components, C7+ MW 218 / SG 0.8515, 220 F, bubble point 2634.65 psia)',
  'Read a real study against an untuned model',
  'Run an untuned Peng-Robinson model against a published laboratory study and quantify every gap. The fluid is Good Oil Co. Well No. 4 as Core Laboratories reported it: eleven components with a C7+ fraction of molecular weight 218 and specific gravity 0.8515, at a reservoir temperature of 220 F and a measured bubble point of 2634.65 psia. Its optimum separator test ran at 100 psig and 75 F, which is 114.65 psia, to a stock tank at 14.65 psia and 75 F, and measured a total gas-oil ratio of 768 scf/stb, a stock tank gravity of 40.7 API and a formation volume factor of 1.474 rb/stb. Characterize the plus fraction and report the critical temperature it is given in degrees Rankine. Then run the model, WITHOUT tuning anything and WITH the stock tank stage appended to the reported separator stage, and report its saturation pressure at 220 F, the percentage by which that exceeds the measured bubble point, the total gas-oil ratio the separator train produces, the stock tank gravity it produces, and the difference between that gravity and the laboratory''s in API.',
  jsonb_build_array(
    jsonb_build_object('key','good_oil_c7plus_tc_r',         'label','C7+ critical temperature',                'unit','degR',     'expected',1324.2385574932478,    'tol',0.05),
    jsonb_build_object('key','good_oil_untuned_psat_psia',   'label','Untuned saturation pressure',             'unit','psia',     'expected',2791.100735294379,     'tol',0.5),
    jsonb_build_object('key','good_oil_psat_bias_pct',       'label','Saturation pressure above the lab value', 'unit','percent',  'expected',5.938198064045652,     'tol',0.02),
    jsonb_build_object('key','good_oil_untuned_gor_scf_stb', 'label','Untuned total gas-oil ratio',             'unit','scf/stb',  'expected',793.8042771796476,     'tol',1),
    jsonb_build_object('key','good_oil_untuned_sto_api',     'label','Untuned stock tank gravity',              'unit','API',      'expected',31.8056416463794,      'tol',0.05),
    jsonb_build_object('key','good_oil_api_bias',            'label','Gravity minus the lab value',             'unit','API',      'expected',-8.894358353620603,    'tol',0.05)
  )
),
(
  'fluid', 'advanced', 'expert',
  'Good Oil Co. Well No. 4 tuned: four bounded C7+ knobs against four measured targets',
  'Tune it, and report what the tuning cost',
  'Tune the compositional model to the Good Oil Co. Well No. 4 study and report both the result and its price. Regress the four bounded knobs on the C7+ pseudo-component and NOTHING else, jointly against all four measurements at once: the saturation pressure of 2634.65 psia at 220 F, and the total gas-oil ratio of 768 scf/stb, the stock tank gravity of 40.7 API and the formation volume factor of 1.474 rb/stb from the optimum separator test at 114.65 psia and 75 F, with the stock tank stage at 14.65 psia and 75 F appended to it. Report the saturation pressure, the total gas-oil ratio and the stock tank gravity the TUNED model produces; the values the regression lands on for the C7+ volume shift and for the C1 to C7+ binary interaction parameter; and the factor by which the sum of squared residuals falls, being the value before the fit divided by the value after it. Every field asks for a value AFTER the regression.',
  jsonb_build_array(
    jsonb_build_object('key','good_oil_tuned_psat_psia',     'label','Tuned saturation pressure',               'unit','psia',     'expected',2632.64216695564,      'tol',0.5),
    jsonb_build_object('key','good_oil_tuned_gor_scf_stb',   'label','Tuned total gas-oil ratio',               'unit','scf/stb',  'expected',761.7262989883229,     'tol',1),
    jsonb_build_object('key','good_oil_tuned_sto_api',       'label','Tuned stock tank gravity',                'unit','API',      'expected',38.755039373806255,    'tol',0.05),
    jsonb_build_object('key','tuned_splus_knob',             'label','Tuned C7+ volume shift',                  'unit','-',        'expected',0.12266364195926757,   'tol',0.0005),
    jsonb_build_object('key','tuned_kc1_knob',               'label','Tuned C1 to C7+ interaction parameter',   'unit','-',        'expected',0.050325447877585576,  'tol',0.0005),
    jsonb_build_object('key','tuning_ssr_reduction',         'label','Residual reduction factor',               'unit','times',    'expected',23.157104602764026,    'tol',0.05)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- See 20260828_rc6_fluid_go_live.sql, applied only after the route ships.
