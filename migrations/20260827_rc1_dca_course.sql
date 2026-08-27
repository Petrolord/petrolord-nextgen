-- RC1: Decline Curve Analysis & Forecasting — the first Reservoir
-- Engineering course (plan: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert
-- bridge trigger can issue Suite discount codes) + the three capstones.
-- NO prerequisite: this is the reservoir path root (owner Q2 decision).
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC1-TRUTH.md; declineLab.test.js pins them all).
-- Fixture: packages/engines/test-data/ekene-dynamic (committed goldens).

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('dca', 'Decline Curve Analysis', 'reservoir', 11, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'dca', 'beginner', 'associate',
  'ekene-dynamic/rates.json (Ekene-1, primary window)',
  'Fit and book Ekene-1',
  'Fit Ekene-1''s primary window (its monthly rates from 2020-01-01 through 2022-12-01, before the flood response) with the real engine, then book the well: the fitted initial rate and nominal decline, the EUR and the time to the 10 stb/d economic limit, the cumulative production at the flood start, and the tangent effective annual decline.',
  jsonb_build_array(
    jsonb_build_object('key','qi_bpd',          'label','Fitted initial rate qi',                      'unit','stb/d', 'expected',120,               'tol',0.5),
    jsonb_build_object('key','di_per_day',      'label','Fitted nominal decline Di',                   'unit','1/d',   'expected',0.0012,            'tol',0.00002),
    jsonb_build_object('key','eur_10_stb',      'label','EUR at the 10 stb/d limit',                   'unit','stb',   'expected',91666.6666666667,  'tol',500),
    jsonb_build_object('key','t_limit_days',    'label','Time to the 10 stb/d limit',                  'unit','days',  'expected',2070.75554149,     'tol',10),
    jsonb_build_object('key','np_flood_stb',    'label','Cumulative production at 2023-01-01',         'unit','stb',   'expected',73157.9366256283,  'tol',400),
    jsonb_build_object('key','eff_decline_pct', 'label','Tangent effective annual decline',            'unit','%/yr',  'expected',35.4674217142705,  'tol',0.1)
  )
),
(
  'dca', 'intermediate', 'professional',
  'ekene-dynamic/rates.json (all four producers)',
  'Windows, models and the portfolio',
  'Work the Ekene field like a portfolio: identify Ekene-3''s decline exponent from its primary window and book its EUR at the 10 stb/d limit; window Ekene-6 to the primary and report its fitted Di; read the R2 of the invalid full-history auto-fit of Ekene-1; book Ekene-6 from the pooled Ekene-3 + Ekene-6 type curve applied fixed-b; and total the four wells'' closed-form EURs.',
  jsonb_build_array(
    jsonb_build_object('key','e3_b',          'label','Ekene-3 fitted decline exponent b',            'unit','-',     'expected',0.5,               'tol',0.02),
    jsonb_build_object('key','e3_eur_stb',    'label','Ekene-3 EUR at 10 stb/d',                      'unit','stb',   'expected',111270.166537926,  'tol',600),
    jsonb_build_object('key','e6_win_di',     'label','Ekene-6 windowed-to-primary Di',               'unit','1/d',   'expected',0.001,             'tol',0.00002),
    jsonb_build_object('key','e1_naive_r2',   'label','Ekene-1 full-history fit R2',                  'unit','-',     'expected',0.818388421218434, 'tol',0.01),
    jsonb_build_object('key','tc_eur_stb',    'label','Ekene-6 EUR from the fixed-b type curve',      'unit','stb',   'expected',91524.2759502962,  'tol',600),
    jsonb_build_object('key','field_eur_stb', 'label','Sum of the four closed-form EURs at 10 stb/d', 'unit','stb',   'expected',461709.132532792,  'tol',2000)
  )
),
(
  'dca', 'advanced', 'expert',
  'ekene-dynamic/rates.json + test-data/dca literature fixtures',
  'Uncertainty, governance and honesty',
  'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted Di. Book the b = 1.2 EUR at qi 120 stb/d, Di 0.0012/d, limit 10 stb/d, and its ratio to the exponential booking of the same data. Compute the field triangle''s P90 and P10 (minimum 380000, mode 461709.132532792, maximum 580000 stb, petroleum convention P90 low). Quantify the monthly-snapshot overstatement of Ekene-1''s primary cumulative against the closed form.',
  jsonb_build_array(
    jsonb_build_object('key','e5_late_di',    'label','Ekene-5 post-ramp fitted Di (2024-05-01 on)',  'unit','1/d',   'expected',0.00035,           'tol',0.000005),
    jsonb_build_object('key','b12_eur_stb',   'label','EUR at b 1.2 (qi 120, Di 0.0012, limit 10)',   'unit','stb',   'expected',321875.914758613,  'tol',2000),
    jsonb_build_object('key','b_ratio',       'label','b 1.2 EUR over the exponential EUR',           'unit','-',     'expected',3.5113736155485,   'tol',0.02),
    jsonb_build_object('key','p90_stb',       'label','Field triangle P90 (low)',                     'unit','stb',   'expected',420425.025054486,  'tol',2000),
    jsonb_build_object('key','p10_stb',       'label','Field triangle P10 (high)',                    'unit','stb',   'expected',531360.331525141,  'tol',2000),
    jsonb_build_object('key','snap_over_pct', 'label','Monthly-snapshot overstatement of Ekene-1 primary Np', 'unit','%', 'expected',1.83847495692304, 'tol',0.05)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- The catalog row is deliberately left 'coming_soon'. Flipping it to
-- 'available' makes the course ENROLLABLE, and the DcaLearningPage route it
-- needs ships with the next NextGen production upload. Going live before the
-- route is deployed would sell a course whose app page 404s (the standing
-- deploy-gating rule). The flip lives in its own held migration,
-- 20260827_rc1_dca_go_live.sql, applied AFTER that upload.
