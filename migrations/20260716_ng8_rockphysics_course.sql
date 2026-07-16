-- NG8 — Rock Physics course, ALL THREE TIERS in one phase
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md,
-- post-NG follow-on: the four remaining geoscience apps get courses;
-- Rock Physics first because its engine and goldens already exist).
--
-- First course seeded after the NG1-NG7 series, so unlike NG1-NG5 it
-- ships Beginner+Intermediate+Advanced together: the tier-fee
-- integrity gate (NG6), the ladder prereqs (NG6), and the Expert
-- Suite bridge (NG7) are all generic — a new app only needs its
-- catalog row (with module mapped BEFORE selling the Expert tier, or
-- the bridge trigger issues no code) and its capstones.
--
-- Teaching dataset: the Ekene SAND through the central rockphysics
-- engines (src/lib/rockphysicsTeaching.js), anchored to the committed
-- goldens (packages/engines/test-data/rockphysics/goldens.json,
-- dual-checked against bruges / equinor open_petro_elastic /
-- rockphypy — see that README). Conditions: 60 degC, 25 MPa, 35k ppm
-- brine, 0.6-gravity gas, 35 API oil GOR 50 L/L; frame 70/30
-- quartz/clay; in-situ sand log point vp 3200 / vs 1800 / rho 2250 at
-- phi 0.25 with K_min 37 GPa (the goldens' log-domain fixture);
-- Ekene shale vp 2743 / vs 1394 / rho 2450; wedge rc +/-0.1 on a 1 ms
-- grid.
--
-- Oracle reproduced by running exactly the teaching-lib pipelines in
-- Node against @petrolord/engines before this migration was written
-- (see the NG8 pentest doc). Highlights of internal consistency:
-- every Beginner fluid value IS a committed golden fixture point; the
-- Intermediate substitution reproduces the golden log-domain outputs
-- bit-for-bit (gas vp 2905.697, rho 2038.710); the Advanced chain
-- flips the sand from AVO class I (brine, A=+0.034) to class III
-- (gas, A=-0.063), and the 25 Hz tuning pick equals the golden 16 ms
-- (one sample above Kallweit-Wood sqrt(6)/(2*pi*f)).

-- ------------------------------------------------ 1. catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('rockphysics', 'Rock Physics', 'geoscience', 7, 'coming_soon', 'welldata')
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'rockphysics', 'beginner', 'associate',
  'rockphysics/goldens (Batzle-Wang fixture points)',
  'Reservoir fluids and the mineral frame',
  'The Ekene SAND sits at 60 degC and 25 MPa with 35,000 ppm brine, 0.6-gravity gas and a 35 API oil at GOR 50 L/L. Compute each fluid with the engine, mix the 70/30 quartz/clay frame with Voigt-Reuss-Hill, and mix the pore fluid at Sw 0.8 with Wood''s equation. Report what the panel shows.',
  jsonb_build_array(
    jsonb_build_object('key','brine_rho',  'label','Brine density',                      'unit','kg/m3','expected',1017.8249875,        'tol',0.5),
    jsonb_build_object('key','brine_k_gpa','label','Brine bulk modulus',                 'unit','GPa',  'expected',2.6978112899395996,  'tol',0.005),
    jsonb_build_object('key','gas_k_mpa',  'label','Gas bulk modulus',                   'unit','MPa',  'expected',55.71865290286663,   'tol',0.1),
    jsonb_build_object('key','oil_rho',    'label','Live-oil density',                   'unit','kg/m3','expected',777.0630099023522,   'tol',0.5),
    jsonb_build_object('key','vrh_k_gpa',  'label','Frame K, VRH 70/30 quartz/clay',     'unit','GPa',  'expected',30.87940062475596,   'tol',0.05),
    jsonb_build_object('key','wood_k_mpa', 'label','Wood mixed-fluid K at Sw 0.8',       'unit','MPa',  'expected',257.3340919366766,   'tol',0.5)
  )
),
(
  'rockphysics', 'intermediate', 'professional',
  'rockphysics/goldens (log-domain Gassmann fixture)',
  'Gassmann substitution on the Ekene SAND',
  'The logged sand (vp 3200 m/s, vs 1800 m/s, rho 2250 kg/m3; porosity 0.25, K_min 37 GPa) is brine-saturated. Recover the dry frame with inverse Gassmann, substitute to gas, and report the panel. Where the sonic has no shear, predict vs at vp 3000 m/s with Greenberg-Castagna for the 70/30 sand/shale mix.',
  jsonb_build_array(
    jsonb_build_object('key','mu_gpa',      'label','Shear modulus (fluid-blind)',       'unit','GPa',  'expected',7.29,                'tol',0.01),
    jsonb_build_object('key','ksat_insitu', 'label','In-situ saturated K',               'unit','GPa',  'expected',13.32,               'tol',0.01),
    jsonb_build_object('key','kdry_gpa',    'label','Dry-frame K (inverse Gassmann)',    'unit','GPa',  'expected',7.350343061720982,   'tol',0.01),
    jsonb_build_object('key','gas_vp',      'label','Gas-case vp',                       'unit','m/s',  'expected',2905.6972280296195,  'tol',1),
    jsonb_build_object('key','gas_rho',     'label','Gas-case density',                  'unit','kg/m3','expected',2038.7104517793223,  'tol',0.5),
    jsonb_build_object('key','gc_vs',       'label','Greenberg-Castagna vs at vp 3000',  'unit','m/s',  'expected',1521.197276567149,   'tol',1)
  )
),
(
  'rockphysics', 'advanced', 'expert',
  'rockphysics/ekene shale-over-sand + wedge',
  'Fluid substitution flips the AVO class',
  'Put the Ekene shale (vp 2743, vs 1394, rho 2450) over the SAND and screen both cases: the logged brine sand and its gas-substituted twin from the Professional tier. Report Shuey intercept and gradient for each, the gas case''s Rutherford-Williams class (as a number, 1 to 4), the exact Zoeppritz Rpp at 30 degrees for the gas case, and the wedge tuning thickness at 25 Hz.',
  jsonb_build_array(
    jsonb_build_object('key','brine_intercept','label','Brine-case Shuey intercept A',    'unit','ratio','expected',0.03434399848203321,  'tol',0.001),
    jsonb_build_object('key','brine_gradient', 'label','Brine-case Shuey gradient B',     'unit','ratio','expected',-0.16766246414664518, 'tol',0.001),
    jsonb_build_object('key','gas_intercept',  'label','Gas-case Shuey intercept A',      'unit','ratio','expected',-0.06282494068620303, 'tol',0.001),
    jsonb_build_object('key','gas_gradient',   'label','Gas-case Shuey gradient B',       'unit','ratio','expected',-0.2565633444602355,  'tol',0.001),
    jsonb_build_object('key','gas_class',      'label','Gas-case AVO class (1 to 4)',     'unit','class','expected',3,                    'tol',0),
    jsonb_build_object('key','zoep30',         'label','Exact Zoeppritz Rpp at 30 deg, gas','unit','ratio','expected',-0.12239091302671612,'tol',0.001),
    jsonb_build_object('key','tuning_ms',      'label','Wedge tuning thickness at 25 Hz', 'unit','ms',   'expected',16,                   'tol',0)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. go live
update public.academy_apps set status = 'available' where slug = 'rockphysics';
