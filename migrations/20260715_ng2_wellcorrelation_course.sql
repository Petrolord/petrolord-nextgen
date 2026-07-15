-- NG2 — Well Correlation Beginner
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §2).
--
-- Second course of the geoscience path. The capstone machinery, the
-- prerequisite gate (NG1: a live Well Data Manager certification is
-- required to enroll here) and the scope ladder are already in place —
-- this migration only seeds the capstone and opens the catalog row.
--
-- Teaching dataset: a deterministic four-well section fixture
-- (src/lib/correlationTeaching.js — Ekene-1..4, tops TOP_A / TOP_SAND /
-- BASE_SAND / TOP_B; Ekene-4 lacks TOP_B, teaching missing-top
-- handling). The section engine's math is exact closed-form arithmetic,
-- so the oracle below is the fixture run through
-- @petrolord/engines/engines/wellcorrelation/section.js in Node before
-- this migration was written (see the NG2 pentest doc): flatten on
-- TOP_SAND at a 1500 m datum gives shifts W1 -48 / W2 -65 / W3 -41 /
-- W4 -90; every expected value is hand-derivable from the tops table.
--
-- Answers are READ off the section panel (the NG1 style): the certified
-- skill is reading a flattened correlation section.

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'wellcorrelation', 'beginner', 'associate',
  'correlation/ekene-section',
  'Correlate the Ekene section',
  'Flatten the section on TOP_SAND at a 1500 m datum and read the panel: report the flattening shifts, the SAND zone thickness, displayed depths under the datum, the structural relief on TOP_SAND, and how many wells the TOP_B correlation line reaches.',
  jsonb_build_array(
    jsonb_build_object('key','w2_shift_m',              'label','Ekene-2: flattening shift',                    'unit','m',     'expected',-65,  'tol',0.01),
    jsonb_build_object('key','w3_sand_thickness_m',     'label','Ekene-3: SAND zone thickness',                 'unit','m',     'expected',29,   'tol',0.01),
    jsonb_build_object('key','w4_base_sand_displayed_m','label','Ekene-4: BASE_SAND displayed depth (flattened)','unit','m',    'expected',1525, 'tol',0.01),
    jsonb_build_object('key','sand_relief_m',           'label','TOP_SAND structural relief across the section','unit','m',     'expected',49,   'tol',0.01),
    jsonb_build_object('key','wells_with_top_b',        'label','Wells the TOP_B correlation line reaches',     'unit','count', 'expected',3,    'tol',0),
    jsonb_build_object('key','w1_top_b_displayed_m',    'label','Ekene-1: TOP_B displayed depth (flattened)',   'unit','m',     'expected',1592, 'tol',0.01)
  ))
on conflict (app_slug, tier) do nothing;

update public.academy_apps set status = 'available' where slug = 'wellcorrelation';
