-- NG5 — ReservoirCalc Beginner
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §2).
--
-- Fifth and final Beginner course of the geoscience path — it closes
-- the daily loop the whole path has been walking: the LAS files QC'd in
-- NG1 hold the logs, NG2 correlates the SAND tops, NG4 grids them, and
-- here the learner clips the reservoir against an oil-water contact and
-- sums the volumes.
--
-- Teaching dataset: the Ekene wells with BOTH SAND surfaces
-- (src/lib/reservoircalcTeaching.js; W1–W4 base picks match the
-- correlation fixture exactly). Pipeline: grid TOP_SAND and BASE_SAND
-- with the central TPS engine (100 m cell, 800 m extrapolation), clip
-- the oil column against the OWC (min(base, owc) − top where positive),
-- then the central zoneVolumes engine sums GRV → net (×0.8 NTG) → pore
-- (×0.20 φ) → HCPV (×(1−0.35 Sw)); STOIIP = HCPV / 1.2 Bo × 6.2898.
--
-- Oracle reproduced by running exactly this pipeline in Node against
-- @petrolord/engines before this migration was written (see the NG5
-- pentest doc): at the 1560 m capstone contact, 169 oil cells, a
-- 20.28 m maximum column, 22.269 million m³ GRV and 12.14 MMstb STOIIP.

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'reservoircalc', 'beginner', 'associate',
  'reservoircalc/ekene-sand-owc',
  'Volumes of the Ekene SAND accumulation',
  'Set the oil-water contact to 1560 m and read the volumetrics panel: report the oil-bearing cell count, the maximum oil column, the gross rock volume, the pore volume, the hydrocarbon pore volume and the STOIIP at the given properties (NTG 0.8, porosity 0.20, Sw 0.35, Bo 1.2).',
  jsonb_build_array(
    jsonb_build_object('key','oil_cells',       'label','Oil-bearing grid cells',        'unit','count',  'expected',169,                'tol',0),
    jsonb_build_object('key','max_oil_column_m','label','Maximum oil column',            'unit','m',      'expected',20.2818603515625,   'tol',0.1),
    jsonb_build_object('key','grv_mm3',         'label','Gross rock volume',             'unit','10^6 m3','expected',22.26903564453125,  'tol',0.05),
    jsonb_build_object('key','pore_mm3',        'label','Pore volume',                   'unit','10^6 m3','expected',3.563045809312045,  'tol',0.01),
    jsonb_build_object('key','hcpv_mm3',        'label','Hydrocarbon pore volume',       'unit','10^6 m3','expected',2.3159797972902343, 'tol',0.01),
    jsonb_build_object('key','stoiip_mmstb',    'label','STOIIP',                        'unit','MMstb',  'expected',12.139208107496763, 'tol',0.05)
  ))
on conflict (app_slug, tier) do nothing;

update public.academy_apps set status = 'available' where slug = 'reservoircalc';
