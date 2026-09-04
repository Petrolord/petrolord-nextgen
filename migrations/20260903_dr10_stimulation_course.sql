-- ============================================================================
-- DR10: Stimulation Design joins the catalog, the TENTH Drilling & Completions
-- course.
--
-- Catalog row (module 'drilling'; path_order 27; prereq_slug NULL) plus the
-- three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. Two answers to two different problems. If the well
-- is DAMAGED, the near-wellbore region is the problem and acid is the answer:
-- clear it. If the well is merely TIGHT, the reservoir is the problem and a
-- fracture is the answer: go around it with a conductive path. The Associate
-- tier reads the damage and plans both acid routes. The Professional tier
-- computes the fracture geometry and the material balance that decides how long
-- the job takes. The Expert tier turns a pumped schedule into a pack and the
-- pack into a skin.
--
-- THE HEADLINE RESULT, AND IT IS DERIVED RATHER THAN ASSERTED. The engine
-- carries 1.6 as the unified fracture design optimum, a published constant. A
-- golden-section search on the engine's OWN Cinco-Ley pseudo-skin, at fixed
-- proppant volume, has no knowledge of that constant and lands at 1.6363280591
-- anyway, a ratio of 1.0227 to the published figure. A constant you can
-- rederive from an independent route is a RESULT; one you can only quote is a
-- CONVENTION. The search lives in stimulationLab.js and is asserted in
-- stimulationLab.test.js, so an edit that broke the f function would drift the
-- search off 1.6 and the suite would say so.
--
-- THE ENGINE-USE DEFECT THIS COURSE FOUND, AND IT WAS THE LAB REFUSING TO MATCH
-- ITS OWN GOLDEN THAT CAUGHT IT. The matrix-rate ceiling takes the viscosity of
-- the ACID, about 1e-3 Pa.s, and NOT the fracturing fluid's. The golden's own
-- oracle passes 1e-3; params.muPaS is 0.2 Pa.s of crosslinked gel, which is
-- what you pump to make a fracture rather than what you pump into a matrix.
-- A first draft of both the teaching lab and this capstone passed the frac
-- fluid and understated the ceiling by a factor of TWO HUNDRED, which makes a
-- perfectly pumpable job look impossible. Two lesson agents independently
-- flagged the mismatch before it was fixed. The lab now asserts the two
-- hundred to one ratio explicitly, so nobody can quietly restore the error.
-- THE RULE: when a lab reproduces every value in a golden except one, the one
-- is not a tolerance problem.
--
-- TWO CLAIMS THE ENGINE CORRECTED, WHICH IS THE DR7 RULE AGAIN. Both were
-- asserted from intuition in a first draft of the test file and both were
-- wrong. (1) The pad-fraction error is NOT monotonic in efficiency. It is
-- eta(1-eta)/(1+eta), which VANISHES at both ends and peaks in the middle, at
-- eta = sqrt(2) - 1 with the exact value 3 - 2*sqrt(2). (2) Doubling the
-- damaged radius does not always buy less skin than doubling the permeability
-- contrast. Close to the wellbore it buys MORE, because the logarithm is still
-- steep there. What is true, and is the design point, is that the gain from
-- doubling FALLS as the damage reaches further out. Both are now asserted in
-- their true form.
--
-- THE CAPSTONE RUNS A DIFFERENT WELL, A DIFFERENT ROCK AND A DIFFERENT JOB from
-- anything the lessons use, which is the DR2 rule about designing the
-- capstone's conditions before writing the lessons. A 9-3/4 in hole against the
-- lessons' 8-1/2; 0.4 mD against 1.0; a stiffer rock at 32 GPa and nu 0.22
-- against 25 GPa and 0.28; a taller, shorter fracture at 42 m by 110 m against
-- 30 by 150; a sand proppant against the lessons' ceramic; and an acid job with
-- eight times the contrast reaching only two thirds of the way to the damage.
--
-- THE DR4 CHECK RAN BEFORE A SINGLE LESSON WAS WRITTEN, which is where DR5 put
-- it and where it belongs. All eighteen graded values were swept against every
-- number the goldens and the teaching digest publish, 2241 of them, at each
-- field's own tolerance: zero collisions. Pairwise across the eighteen: zero.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written; see dr10_fields.mjs in the wave directory, which
-- derives all eighteen by running fracDesign.js and acidizing.js and writes
-- fields.json. Nothing below is typed from a lesson.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260903_dr10_stimulation_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/stimulation.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('stimulation', 'Stimulation Design', 'drilling', 27, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'stimulation', 'beginner', 'associate',
  'a damaged 9-3/4 inch well in 0.4 mD rock, with an acid job that reaches only two thirds of the way to the damage',
  'Read the damage, then price both answers to it',
  'Six values for a well the lessons never treat. THE WELL is a 9-3/4 in hole, so the wellbore radius is 4.875 in, draining to 260 m, in rock of 0.4 mD. The job is placed at 2380 m measured depth. THE DAMAGE has a permeability contrast of 8 and reaches out to 1.2 m. THE SANDSTONE PLAN targets an acid front at 0.8 m over a 65 m interval at 22 percent porosity, using a pore volume factor of 1.5. THE CARBONATE ALTERNATIVE pumps 12 cubic metres over the same interval at a pore volume to breakthrough of 1.0. Report: (1) the HAWKINS skin before any treatment; (2) the sandstone PLANNING VOLUME in cubic metres; (3) the sandstone skin AFTER the planned job; (4) the carbonate WORMHOLE RADIUS in metres; (5) the carbonate SKIN; and (6) the MAXIMUM MATRIX RATE in cubic metres per second. Traps. Field 3 is NOT zero. The front reaches 0.8 m and the damage reaches 1.2, so the job stops short and a residual skin survives it, which is the whole point of the plan. Field 6 takes the viscosity of the ACID, about 1e-3 Pa.s, and NOT the fracturing fluid: using a gel viscosity here understates the ceiling by more than two orders of magnitude and turns a routine job into an impossible one. Field 6 also takes the DAMAGED skin, because that is the well as it stands before any acid has been pumped into it. The frac pressure is the closure stress at the true vertical depth of 2380 m measured, which is not 2380 m. Free checks: field 1 must be large and positive, because a contrast of 8 over that radius is severe damage; field 3 must be positive and smaller than field 1; field 5 must be NEGATIVE, since a wormhole enlarges the effective wellbore; and field 6 must be small, because a damaged well in sub-millidarcy rock accepts fluid slowly.',
  jsonb_build_array(
    jsonb_build_object('key','hawkins_s_before',    'label','Hawkins skin, before',   'unit','',    'expected',15.898452901112533,   'tol',0.0000005),
    jsonb_build_object('key','sandstone_volume_m3', 'label','Sandstone plan volume',  'unit','m3',  'expected',42.0945614782356,     'tol',0.0000005),
    jsonb_build_object('key','sandstone_s_after',   'label','Skin after the acid',    'unit','',    'expected',2.8382557567571496,   'tol',0.0000005),
    jsonb_build_object('key','carbonate_rwh_m',     'label','Wormhole radius',        'unit','m',   'expected',0.531456321656052,    'tol',0.00000005),
    jsonb_build_object('key','carbonate_skin',      'label','Carbonate skin',         'unit','',    'expected',-1.4567517365442468,  'tol',0.0000005),
    jsonb_build_object('key','q_max_matrix_m3s',    'label','Maximum matrix rate',    'unit','m3/s','expected',0.00009644175015806953,'tol',0.00000000005)
  )
),
(
  'stimulation', 'intermediate', 'professional',
  'a stiffer rock at 32 GPa and nu 0.22, and a taller shorter fracture at 42 by 110 metres, none of which the lessons use',
  'Two models, one balance, and what the job costs in time',
  'Six values for a fracture in the Associate capstone well. THE ROCK has a Young modulus of 32 GPa and a Poisson ratio of 0.22. THE TARGET is a half-length of 110 m at a fracture height of 42 m. THE JOB pumps at 0.068 cubic metres a second with a fluid of 0.15 Pa.s against a leakoff coefficient of 6.5e-5 in metres per root second. The closure stress is the minimum horizontal stress at the true vertical depth of 2380 m measured. Report: (1) the PLANE STRAIN MODULUS in pascals; (2) the PKN AVERAGE width in metres; (3) the PKN NET PRESSURE in pascals; (4) the KGD AVERAGE width in metres; (5) the fluid EFFICIENCY; and (6) the PUMP TIME in seconds. Traps. Field 1 is E over one minus nu squared and not E, and every other field moves if it is got wrong. Fields 2 and 4 use DIFFERENT shape factors, pi over 5 for PKN and pi over 4 for KGD, applied to different maximum widths, so they are not related by any single constant. Field 3 is the PKN net pressure specifically, which divides by twice the HEIGHT; using the KGD form, which divides by four times the half-length, gives a different and much smaller number. Fields 5 and 6 come from the material balance run on the PKN average width, and they are a FIXED POINT rather than a formula: the Nolte factor depends on the efficiency, the efficiency depends on the pump time, and the pump time depends on the Nolte factor, so the engine iterates. Free checks: field 4 must be substantially LARGER than field 2, since KGD is the wider model at these proportions; field 5 must lie strictly between zero and one; and the injected volume implied by fields 5 and 6 must exceed the fracture volume implied by fields 2 and the target geometry, because most of a frac job leaks off.',
  jsonb_build_array(
    jsonb_build_object('key','e_prime_pa',   'label','Plane strain modulus', 'unit','Pa','expected',33627574611.181168,   'tol',500),
    jsonb_build_object('key','pkn_w_avg_m',  'label','PKN average width',    'unit','m', 'expected',0.0034883188616690705,'tol',0.0000000005),
    jsonb_build_object('key','pkn_p_net_pa', 'label','PKN net pressure',     'unit','Pa','expected',2222555.25497038,     'tol',500),
    jsonb_build_object('key','kgd_w_avg_m',  'label','KGD average width',    'unit','m', 'expected',0.007732250756687415, 'tol',0.0000000005),
    jsonb_build_object('key','eta_frac',     'label','Fluid efficiency',     'unit','',  'expected',0.3169056621158875,   'tol',0.0000005),
    jsonb_build_object('key','ti_s',         'label','Pump time',            'unit','s', 'expected',1495.7163326395373,   'tol',0.00005)
  )
),
(
  'stimulation', 'advanced', 'expert',
  'a sand proppant at 2650 kg/m3 and 38 percent pack porosity, retained at 0.6, on the Professional capstone fracture',
  'Place the pack, then say what it is worth',
  'Six values for the Professional capstone fracture. THE SCHEDULE runs to an end of job concentration of 950 kg per cubic metre in 8 steps. THE PROPPANT is a sand of 2650 kg per cubic metre at a pack porosity of 0.38 and a pack permeability of 95 darcy, retained at a damage factor of 0.6. The formation is 0.4 mD and the wellbore radius is 4.875 in. Report: (1) the PAD FRACTION; (2) the PLACED PROPPANT MASS in kilogrammes; (3) the PROPPED WIDTH in metres; (4) the DIMENSIONLESS CONDUCTIVITY; (5) the FRACTURE PSEUDO-SKIN; and (6) the EFFECTIVE WELLBORE RADIUS in metres. Traps. Field 1 is (1 minus the efficiency) divided by (1 PLUS the efficiency), and NOT one minus the efficiency: the naive form is larger, so a designer using it pumps too much pad and shortens the fracture. Field 3 spreads the mass over the fracture face area of BOTH WINGS and then divides by the BULK density of the pack, which is the solid density times one minus the porosity, so using the solid density alone understates the width. Field 4 applies the damage factor to the pack permeability before forming the ratio. Field 6 is the radius an unstimulated well would need to flow the same, and it is enormous compared with the drilled radius. Free checks: field 1 must be smaller than one minus the efficiency from the Professional tier; field 3 must be far below the created width from that tier, because most of what was opened closed again; field 5 must be NEGATIVE; field 6 must exceed the drilled radius by more than two orders of magnitude; and field 4 must sit ABOVE the unified optimum of 1.6, so this design is the opposite case from the published one and is length-starved rather than conductivity-starved.',
  jsonb_build_array(
    jsonb_build_object('key','pad_frac',     'label','Pad fraction',              'unit','',  'expected',0.5187116720164883,   'tol',0.0000005),
    jsonb_build_object('key','prop_mass_kg', 'label','Placed proppant mass',      'unit','kg','expected',30620.462967731102,   'tol',0.0005),
    jsonb_build_object('key','wp_m',         'label','Propped width',             'unit','m', 'expected',0.0020169829084513797,'tol',0.0000000005),
    jsonb_build_object('key','cfd',          'label','Dimensionless conductivity','unit','',  'expected',2.612909676857469,    'tol',0.0000005),
    jsonb_build_object('key','s_f',          'label','Fracture pseudo-skin',      'unit','',  'expected',-5.623051793770081,   'tol',0.0000005),
    jsonb_build_object('key','rw_prime_m',   'label','Effective wellbore radius', 'unit','m', 'expected',34.26641751153083,    'tol',0.00000005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260903_dr10_stimulation_go_live.sql.
