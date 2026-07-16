-- NG9 — Pore Pressure course, ALL THREE TIERS in one phase
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §4,
-- post-series follow-on; second of the four remaining geoscience
-- apps, engine + goldens ready since Suite P1).
--
-- Same shape as NG8: zero spine SQL — one catalog row (module mapped
-- BEFORE the Expert tier sells, per the NG7 bridge gotcha) + three
-- capstone seeds + the availability flip.
--
-- Teaching dataset: the golden synthetic well ITSELF
-- (packages/engines/test-data/porepressure/goldens.json): 401 samples
-- 0-4000 m below mudline in 100 m of water, dual-implementation
-- oracle (stdlib Python vs the JS engines), built forward-inverse
-- consistent — a normal-compaction sonic (dt_ml 656, dt_ma 220,
-- c 0.0006/m) down to 2500 m, then a 4 kPa/m overpressure ramp
-- encoded INTO the transit times so an Eaton n=3 run over the log
-- recovers the imposed pressures exactly. Teaching lib:
-- src/lib/porepressureTeaching.js.
--
-- Oracle reproduced by running exactly the teaching-lib pipelines in
-- Node against @petrolord/engines before this migration was written
-- (see the NG9 pentest doc). Internal consistency highlights: the
-- graded overpressure at TD is EXACTLY 6 MPa (the imposed 4 kPa/m
-- ramp over 1500 m) and PP(TD) = hydrostatic(TD) + 6; the NCT fit
-- recovers the picks' own trend (650 us/m, 0.7/km), deliberately
-- different from the well's (656, 0.6/km) — fitting reads the data,
-- not the label; the Bowers pair are the committed golden fixture
-- points, inverted both ways.

-- ------------------------------------------------ 1. catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('porepressure', 'Pore Pressure', 'geoscience', 8, 'coming_soon', 'welldata')
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'porepressure', 'beginner', 'associate',
  'porepressure/goldens (synthetic well + NCT picks)',
  'The pressure frame of the synthetic well',
  'Build the frame on the golden well (4000 m below mudline, 100 m water, seawater 1025 kg/m3, pore fluid 1030 kg/m3): hydrostatic and overburden at TD, the Gardner density a sonic-only interval would use at 1600 m/s, the normal-compaction transit time at 2500 m on the well''s trend (656/220/0.0006), and the exact least-squares NCT fit through the twelve shale picks (matrix dt 220 us/m).',
  jsonb_build_array(
    jsonb_build_object('key','hydro_td_mpa','label','Hydrostatic pressure at TD',        'unit','MPa',   'expected',41.408579625,       'tol',0.01),
    jsonb_build_object('key','ob_td_mpa',   'label','Overburden stress at TD',           'unit','MPa',   'expected',91.12306695073282,  'tol',0.01),
    jsonb_build_object('key','gardner_rho', 'label','Gardner density at 1600 m/s',       'unit','kg/m3', 'expected',1960.612149304395,  'tol',0.5),
    jsonb_build_object('key','nct_2500',    'label','NCT transit time at 2500 m',        'unit','us/m',  'expected',317.2847498247154,  'tol',0.5),
    jsonb_build_object('key','fit_dtml',    'label','Fitted NCT mudline transit time',   'unit','us/m',  'expected',650.0000000000014,  'tol',0.5),
    jsonb_build_object('key','fit_c_per_km','label','Fitted compaction constant',        'unit','1/km',  'expected',0.7000000000000015, 'tol',0.005)
  )
),
(
  'porepressure', 'intermediate', 'professional',
  'porepressure/goldens (full Eaton prognosis)',
  'Eaton prognosis on the golden sonic',
  'Run the full pipeline over the well''s sonic and density logs with Eaton n = 3 on the well''s own NCT (656/220/0.0006): density to overburden, hydrostatic, NCT ratio, Eaton pore pressure, and coefficient-form fracture pressure with Poisson''s ratio 0.4. Report the overpressure onset (the first sample more than 0.05 MPa above hydrostatic), the NCT transit time at TD, pore pressure at 3000 m and at TD, the overpressure at TD, and fracture pressure at TD.',
  jsonb_build_array(
    jsonb_build_object('key','onset_m',    'label','Overpressure onset depth',          'unit','m bml','expected',2520,               'tol',0),
    jsonb_build_object('key','dtn_td',     'label','NCT transit time at TD',            'unit','us/m', 'expected',259.5530276341839,  'tol',0.5),
    jsonb_build_object('key','pp_3000_mpa','label','Pore pressure at 3000 m',           'unit','MPa',  'expected',33.307730125,       'tol',0.01),
    jsonb_build_object('key','pp_td_mpa',  'label','Pore pressure at TD',               'unit','MPa',  'expected',47.408579625,       'tol',0.01),
    jsonb_build_object('key','op_td_mpa',  'label','Overpressure at TD',                'unit','MPa',  'expected',6,                  'tol',0.01),
    jsonb_build_object('key','fp_td_mpa',  'label','Fracture pressure at TD',           'unit','MPa',  'expected',76.55157117548856,  'tol',0.01)
  )
),
(
  'porepressure', 'advanced', 'expert',
  'porepressure/goldens (mud window + Bowers)',
  'The mud-weight window at TD',
  'Turn the n = 3 prognosis into drilling numbers: equivalent mud weight referenced to sea level (P divided by g times depth-below-mudline plus water depth) for pore and fracture pressure at TD, and the window between them. Cross-check the physics with Bowers (A 10, B 0.75): the loading velocity at 5 MPa effective stress, and the effective stress the unloading form (sigma_max 50 MPa, U 3) reads from 3125.8 m/s. Then probe the calibration lever: pore pressure at TD with Eaton n = 1.2.',
  jsonb_build_array(
    jsonb_build_object('key','pp_emw_td',      'label','Pore pressure as EMW at TD',           'unit','kg/m3','expected',1179.1048116553065, 'tol',0.5),
    jsonb_build_object('key','fp_emw_td',      'label','Fracture pressure as EMW at TD',       'unit','kg/m3','expected',1903.9238599165737, 'tol',0.5),
    jsonb_build_object('key','window_td',      'label','Mud-weight window at TD',              'unit','kg/m3','expected',724.8190482612672,  'tol',0.5),
    jsonb_build_object('key','bowers_v_5mpa',  'label','Bowers loading velocity at 5 MPa',     'unit','m/s',  'expected',1949.944709834568,  'tol',0.5),
    jsonb_build_object('key','bowers_sigma_mpa','label','Bowers unloading stress at 3125.8 m/s','unit','MPa', 'expected',10,                 'tol',0.01),
    jsonb_build_object('key','pp_td_n12_mpa',  'label','Pore pressure at TD with n = 1.2',     'unit','MPa',  'expected',43.901549937778526, 'tol',0.01)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. go live
update public.academy_apps set status = 'available' where slug = 'porepressure';
