-- NG3 — Seismolord Beginner (synthetics-first)
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §2).
--
-- Third course of the geoscience path. Capstone machinery, prereq gate
-- (welldata certification required) and scope ladder are in place —
-- this migration only seeds the capstone and opens the catalog row.
--
-- Teaching dataset: the basic_20 golden LAS (the same well the Well
-- Data Manager course QCs) driven through the central synthetics
-- engine: DT (µs/m) → velocity → impedance (×RHOB) → resample to a
-- 2 ms TWT grid → reflectivity → convolve with a 25 Hz Ricker.
-- Teaching time-depth is deliberately hand-checkable: vertical well,
-- KB at MSL, single 2000 m/s overburden velocity → TWT(z) = z ms.
--
-- Oracle reproduced by running exactly this pipeline in Node against
-- @petrolord/engines before this migration was written (see the NG3
-- pentest doc). The synthetic peak is validity-masked (convolution
-- edge samples excluded), matching what the app's summary panel shows.

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'seismolord', 'beginner', 'associate',
  'wells/las/basic_20 + ricker25',
  'Tie the basic_20 well: synthetic seismogram summary',
  'Set the wavelet to 25 Hz and read the synthetic summary panel: report the mean sonic velocity, the two-way time at the top of the log under the teaching time-depth function, the maximum impedance, and the strongest reflection coefficient and synthetic amplitude with their two-way times.',
  jsonb_build_array(
    jsonb_build_object('key','mean_velocity_ms', 'label','Mean sonic velocity',                    'unit','m/s',        'expected',3145.2869374221345,  'tol',1),
    jsonb_build_object('key','twt_at_log_top_ms','label','TWT at the top of the log (1500 m)',     'unit','ms',         'expected',1500,                'tol',0.5),
    jsonb_build_object('key','imp_max',          'label','Maximum impedance',                      'unit','(m/s)·(g/cc)','expected',10624.9560546875,   'tol',10),
    jsonb_build_object('key','rc_peak_abs',      'label','Strongest reflection coefficient (abs)', 'unit','-',          'expected',0.017688043415546417,'tol',0.0005),
    jsonb_build_object('key','rc_peak_twt_ms',   'label','TWT of the strongest reflection',        'unit','ms',         'expected',1582,                'tol',2),
    jsonb_build_object('key','syn_peak_twt_ms',  'label','TWT of the strongest synthetic amplitude (25 Hz)','unit','ms','expected',1642,                'tol',2)
  ))
on conflict (app_slug, tier) do nothing;

update public.academy_apps set status = 'available' where slug = 'seismolord';
