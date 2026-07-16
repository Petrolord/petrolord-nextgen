-- NG11 — Basin & Charge course, ALL THREE TIERS in one phase
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §4,
-- post-series follow-on; FOURTH AND LAST of the remaining geoscience
-- apps — this completes course coverage of the whole Geoscience
-- module, 10/10 apps).
--
-- Prerequisite work (NG11a, petrolord-engines PR #1, merged): the
-- BasinFlow Genesis math was extracted VERBATIM into the central
-- @petrolord/engines `basin` domain (Sclater-Christie decompaction,
-- backward-Euler heat transport, Sweeney-Burnham Easy%Ro + kerogen
-- kinetics, saturation-bucket expulsion) together with its
-- independent stdlib-Python oracle and goldens (payload regenerated
-- byte-identical; anchors self-asserted at generation). The vendored
-- packages/engines copy was synced in the same branch. The Suite's
-- dead VectorizedSolver (wrong-units Arrhenius) was deliberately NOT
-- extracted.
--
-- NG8-NG10 shape: zero spine SQL — one catalog row (module mapped
-- BEFORE the Expert tier sells) + three capstone seeds + the flip.
--
-- Teaching dataset IS the committed golden fixture
-- (test-data/basin/goldens.json): decompaction cases, the two-layer
-- steady heat column, the Easy%Ro ramp tables, isothermal kerogen TR,
-- and the four-layer reference basin (Type II source shale TOC 4 /
-- HI 500, cooling 80->60 mW/m2 heat flow, 600 m erosion at 10 Ma).
-- Teaching lib: src/lib/basinTeaching.js.
--
-- Oracle reproduced by running exactly the teaching-lib pipelines in
-- Node against @petrolord/engines before this migration was written
-- (see the NG11 pentest doc). The JS engine and the Python oracle are
-- independent implementations, so expected values are the ENGINE's
-- (goldens agree to ~1e-9 on kinetics and ~1e-4 m on geometry; every
-- graded field's tolerance covers the difference by orders of
-- magnitude). Internal consistency highlights: the steady heat column
-- is exactly T = Ts + Qz/k per layer (41.667 C at the low-k base is
-- hand arithmetic); Ro(F=0) = exp(-1.6) and full reaction
-- exp(-1.6 + 3.7*0.85) reproduce the published Easy%Ro range; the
-- slow 1 C/Ma ramp is MORE mature at 150 C than the 3 C/Ma ramp
-- (time is a reagent); the erosion signature is the difference of two
-- full forward runs the learner executes (delta Ro 0.0567).

-- ------------------------------------------------ 1. catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('basin', 'Basin & Charge', 'geoscience', 10, 'coming_soon', 'welldata')
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'basin', 'beginner', 'associate',
  'basin/goldens (decompaction + steady heat column)',
  'Burial and heat on the golden fixtures',
  'Work the compaction and heat fundamentals: the solid (grain) thickness inside 100 m of freshly deposited shale; that same 100 m of shale buried to 1000 m and restored to the surface; shale porosity at 2000 m on the Sclater-Christie curve (0.63, 0.00051/m); and the golden two-layer steady heat column (10 C surface, 60 mW/m2 basal, k 1.8 over k 3.5, ten 100 m cells per layer) read at the first cell, the base of the low-conductivity layer, and the deepest cell.',
  jsonb_build_array(
    jsonb_build_object('key','solid_100',   'label','Solid thickness in 100 m of surface shale','unit','m',  'expected',38.57953418711555,  'tol',0.05),
    jsonb_build_object('key','restored',    'label','100 m shale from 1000 m, restored to surface','unit','m','expected',159.79553483785466,'tol',0.05),
    jsonb_build_object('key','phi_2000',    'label','Shale porosity at 2000 m',                 'unit','v/v','expected',0.22717481230903933,'tol',0.001),
    jsonb_build_object('key','t_first',     'label','Temperature at the first cell (50 m)',     'unit','degC','expected',11.666666666666671,'tol',0.05),
    jsonb_build_object('key','t_lowk_base', 'label','Temperature at the low-k base (950 m)',    'unit','degC','expected',41.66666666666673, 'tol',0.05),
    jsonb_build_object('key','t_deepest',   'label','Temperature at the deepest cell (1950 m)', 'unit','degC','expected',59.619047619047684,'tol',0.05)
  )
),
(
  'basin', 'intermediate', 'professional',
  'basin/goldens (Easy%Ro ramps + isothermal kerogen TR)',
  'Maturity kinetics: the clock and the thermometer',
  'Run the Sweeney-Burnham Easy%Ro integrator and the Type II kerogen clock: vitrinite reflectance at zero and at full reaction; Ro at 150 C on the 3 C/Ma heating ramp and on the slower 1 C/Ma ramp (the same temperature, more time, more maturity); and the isothermal Type II transformation ratio at 100 C after 10 and after 50 Ma.',
  jsonb_build_array(
    jsonb_build_object('key','ro_f0',    'label','Ro at zero reaction',                    'unit','%Ro','expected',0.20189651799465538, 'tol',0.001),
    jsonb_build_object('key','ro_full',  'label','Ro at full reaction',                    'unit','%Ro','expected',4.687971627022019,   'tol',0.005),
    jsonb_build_object('key','ro_150_r3','label','Ro at 150 C on the 3 C/Ma ramp',         'unit','%Ro','expected',0.9871413464062039,  'tol',0.002),
    jsonb_build_object('key','ro_150_r1','label','Ro at 150 C on the 1 C/Ma ramp',         'unit','%Ro','expected',1.1129254516555198,  'tol',0.002),
    jsonb_build_object('key','tr_10',    'label','Type II TR after 10 Ma at 100 C',        'unit','frac','expected',0.022481215976523083,'tol',0.0005),
    jsonb_build_object('key','tr_50',    'label','Type II TR after 50 Ma at 100 C',        'unit','frac','expected',0.05477927380797565, 'tol',0.0005)
  )
),
(
  'basin', 'advanced', 'expert',
  'basin/goldens (the reference basin, run twice)',
  'The kitchen and the erosion signature',
  'Run the full forward model on the golden reference basin (four layers over 150 Ma, cooling 80 to 60 mW/m2 heat flow, 600 m of erosion at 10 Ma) and read the source shale at present day: reflectance, temperature, transformation ratio, generated and expelled mass. Then rerun WITHOUT the erosion event and report the erosion signature, the difference in final Ro between the two runs.',
  jsonb_build_array(
    jsonb_build_object('key','final_ro',   'label','Source rock final Ro',                  'unit','%Ro',   'expected',1.6718288798752388, 'tol',0.002),
    jsonb_build_object('key','final_temp', 'label','Source rock final temperature',         'unit','degC',  'expected',149.76037539670858, 'tol',0.1),
    jsonb_build_object('key','final_tr',   'label','Final transformation ratio',            'unit','frac',  'expected',0.7423743797385286, 'tol',0.002),
    jsonb_build_object('key','generated',  'label','Generated mass at present day',         'unit','kg/m2', 'expected',13946.54641524398,  'tol',5),
    jsonb_build_object('key','expelled',   'label','Expelled mass at present day',          'unit','kg/m2', 'expected',10048.985378825158, 'tol',5),
    jsonb_build_object('key','ro_delta',   'label','Erosion signature (delta Ro vs no-erosion run)','unit','%Ro','expected',0.05665081052235643,'tol',0.001)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. go live
update public.academy_apps set status = 'available' where slug = 'basin';
