-- ============================================================================
-- DR5: Geomechanics and Wellbore Stability joins the catalog, the FIFTH
-- Drilling & Completions course (petrolord-suite
-- docs/scope/NextGen-Drilling-Courses-PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 22; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 through DR4 are RECOMMENDED and
-- not required.
--
-- ONE PROFILE, TWO WELLS, ONE CLOSED-FORM FIXTURE. geomech_cases.json gives 52
-- depth samples from 50 m to 2600 m of true vertical depth, with a CONSTANT
-- overburden gradient of 2300 kg/m3, a pore pressure that is hydrostatic at
-- 1030 kg/m3 to 1500 m and then ramps to 1186.5384615384614 by 2600 m, and a
-- sonic curve falling from 494 to 188 microseconds per metre. The two wells
-- are the same 40 degree slant to 3000 m and horizontal to 2800 m that DR1
-- through DR4 use. The vertical fixture is a separate hand-built case whose
-- collapse and fracture pressures both have closed forms.
--
-- THE CAPSTONE PARAMETER SET SHARES NOTHING WITH THE PUBLISHED ONE. Poisson
-- ratio 0.24 against 0.28, friction angle 26 against 32, Young's modulus 18
-- against 25 GPa, tectonic strains 0.0002 and 0.0005 against 0.0001 and
-- 0.0003, Biot coefficient 0.9 against 1, SHmax azimuth 105 against 60,
-- tensile strength 2.5 against 1 MPa. The Associate capstone additionally
-- grades a core plug sonic reading of 233 microseconds per metre, which is not
-- one of the profile's own samples, and the Professional capstone runs a hole
-- attitude of 55 degrees inclination on 130 degrees azimuth, neither of which
-- is in the lesson sweeps of 0/30/60/90 and 0/60/150.
--
-- THE PUBLISHED-GOLDEN COLLISION CHECK, WHICH DR4 EARNED AND THIS COURSE RAN
-- BEFORE WRITING A LESSON. All eighteen proposed graded values were swept
-- against every one of the 1165 numbers the golden file publishes, at each
-- field's own tolerance: 0 collisions. The pairwise check across the eighteen
-- is also 0. Both are re-asserted inside geomechLab.test.js.
--
-- THREE FINDINGS THE FIXTURE'S OWN OUTPUT PRODUCED. (1) Twenty-three of the 52
-- profile samples put SHmax ABOVE the overburden, which is not the normal
-- faulting regime the run assumes; they are the 23 shallowest and only FOUR
-- are clamped, so the tectonic strain term rather than the frictional bound is
-- responsible. The quality score reports 80 for it. (2) The Horsrud and
-- McNally strength correlations cross TWICE, at about 198.68499251376295 and
-- about 409.8356528477385 microseconds per metre, both inside this profile's
-- range, so neither is reliably the conservative choice. (3) The tightest
-- point on the horizontal well is at the KICK-OFF at 1020 m rather than at
-- total depth, because the collapse gradient falls with depth while the
-- deviation below the kick-off widens the window.
--
-- THE SENSITIVITY RESULT THE EXPERT TIER IS BUILT ON. The Poisson ratio moves
-- the windows by 956.2616032453875 and 1153.222084676116 kg/m3 across this
-- course's own sandstone-to-shale seed range, two and a half to five times
-- more than anything else. The friction angle moves the slant well by EXACTLY
-- ZERO, because that well is pore pressure bound and neither of its bounds
-- contains a friction angle. Which bound binds decides which parameters
-- matter, and that reorders the conventional list of what to measure.
--
-- WHAT THE ENGINE DOES NOT DO, TAUGHT IN EXPERT m05 AND GRADED NOWHERE:
-- inelastic and anisotropic rock behaviour, time-dependent effects (pore
-- pressure diffusion, creep, damage accumulation), chemical effects (water
-- activity, clay swelling, ion exchange), thermal stress, and natural
-- fractures and bedding. 20260830_dr5_geomech_go_live.sql asserts it.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (dr5_fields.mjs); geomechLab.test.js pins all eighteen
-- through the course's own teaching lab across 33 cases.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr5_geomech_go_live.sql until a production upload carries the
-- /dashboard/apps/geomech route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('geomech', 'Geomechanics and Wellbore Stability', 'drilling', 22, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'geomech', 'beginner', 'associate',
  'the 52 sample profile from 50 m to 2600 m of true vertical depth, run on a parameter set that shares nothing with the published one, plus a core plug sonic reading that is not one of the profile''s own samples',
  'Build the model on new parameters',
  'Six numbers, on a parameter set the lessons never ran. Use a Poisson ratio of 0.24, a friction angle of 26 degrees, a Young''s modulus of 18000000000 Pa, tectonic strains of epsX 0.0002 and epsY 0.0005, a Biot coefficient of 0.9 and a normal faulting regime. Report: (1) the k0 the run uses; (2) the FRICTIONAL LIMIT RATIO q; (3) SHMIN at 2000 m of true vertical depth, in pascals; and (4) SHMAX at the same depth, in pascals. Then, for a core plug reading 233 microseconds per metre, which is NOT one of the profile''s sonic samples, report (5) the HORSRUD unconfined compressive strength and (6) the MCNALLY one, both in PASCALS. Fields 3 and 4 must be checked against the frictional bounds before you report them: if either is clamped, the clamped value is the answer. Field 6 takes slowness in microseconds per FOOT internally and the reading is given per metre, which is a factor no tolerance will catch. Free check: fields 1 and 2 must both come out SMALLER than the published 0.38888888888888895 and 3.254588303299863, because both input parameters are lower.',
  jsonb_build_array(
    jsonb_build_object('key','k0_used',                'label','k0 used',                 'unit','-',  'expected',0.3157894736842105, 'tol',0.0000005),
    jsonb_build_object('key','frictional_limit_ratio', 'label','Frictional limit ratio q','unit','-',  'expected',2.5610706048410403, 'tol',0.0000005),
    jsonb_build_object('key','shmin_at_2000m_Pa',      'label','Shmin at 2000 m',         'unit','Pa', 'expected',33914681.28858234,  'tol',50),
    jsonb_build_object('key','shmax_at_2000m_Pa',      'label','SHmax at 2000 m',         'unit','Pa', 'expected',38269519.99825976,  'tol',50),
    jsonb_build_object('key','ucs_horsrud_Pa',         'label','Horsrud UCS',             'unit','Pa', 'expected',81461382.79343805,  'tol',50),
    jsonb_build_object('key','ucs_mcnally_Pa',         'label','McNally UCS',             'unit','Pa', 'expected',93075820.55442823,  'tol',50)
  )
),
(
  'geomech', 'intermediate', 'professional',
  'one depth at 2000 m of true vertical depth, on the Associate capstone''s parameter set and its Horsrud strength, at a hole attitude the lesson sweeps do not contain',
  'Bound the mud weight at one depth',
  'Six numbers at 2000 m of true vertical depth, on the SAME parameter set as the Associate capstone: Poisson ratio 0.24, friction angle 26 degrees, Biot coefficient 0.9, SHmax azimuth 105 degrees, tensile strength 2500000 Pa. The two horizontal stresses are the Associate capstone''s fields 3 and 4, and the strength is its field 5, the HORSRUD value for the 233 microsecond per metre core plug reading, NOT the profile''s own published UCS at that depth. The hole is at an INCLINATION of 55 degrees on an AZIMUTH of 130 degrees; the lessons run 0, 30, 60 and 90 degrees on azimuths of 0, 60 and 150, so neither of these is one of them. Report: (1) the COLLAPSE pressure in pascals; (2) the FRACTURE INITIATION pressure in pascals; (3) the BREAKOUT ANGLE in degrees from the HIGH SIDE of the hole, which is a borehole-frame angle and not a compass bearing; (4) the collapse EQUIVALENT MUD WEIGHT; (5) the fracture initiation equivalent mud weight; and (6) the WINDOW WIDTH in equivalent mud weight. Free check: field 4 plus field 6 must equal field 5 exactly, because all three are the same pressures divided by the same denominator.',
  jsonb_build_array(
    jsonb_build_object('key','collapse_Pa',           'label','Collapse pressure',        'unit','Pa',    'expected',14628899.208552536,'tol',50),
    jsonb_build_object('key','frac_init_Pa',          'label','Fracture initiation',      'unit','Pa',    'expected',45176234.71145374, 'tol',50),
    jsonb_build_object('key','breakout_theta_deg',    'label','Breakout angle',           'unit','deg',   'expected',84,                'tol',0.5),
    jsonb_build_object('key','collapse_emw_kgm3',     'label','Collapse EMW',             'unit','kg/m3', 'expected',745.8662850490502, 'tol',0.005),
    jsonb_build_object('key','frac_init_emw_kgm3',    'label','Fracture initiation EMW',  'unit','kg/m3', 'expected',2303.346948828282, 'tol',0.005),
    jsonb_build_object('key','window_width_emw_kgm3', 'label','Window width',             'unit','kg/m3', 'expected',1557.480663779232, 'tol',0.005)
  )
),
(
  'geomech', 'advanced', 'expert',
  'both wells walked end to end at 30 m of measured depth, on the same capstone parameter set, with the tightest point found on each',
  'Walk both wells, and read the tightest point',
  'Six numbers from two whole-trajectory walks, on the SAME capstone parameter set as the two tiers before it: Poisson ratio 0.24, friction angle 26 degrees, Young''s modulus 18000000000 Pa, strains 0.0002 and 0.0005, Biot coefficient 0.9, SHmax azimuth 105 degrees, tensile strength 2500000 Pa. On the SLANT well, at the tightest point of its walk, report (1) the WINDOW WIDTH, (2) the COLLAPSE gradient there and (3) the FRACTURE INITIATION gradient there. Then on the HORIZONTAL well, at the tightest point of ITS walk, report (4) the window width, (5) the collapse gradient and (6) the fracture initiation gradient. All six are EQUIVALENT MUD WEIGHTS in kg/m3. Three traps. The tightest point MOVES at these parameters, so the depth the lessons print is the wrong row. Fields 2 and 5 ask for the COLLAPSE gradient specifically, not the lower bound, so on the well where the pore pressure binds the collapse gradient sits well below the floor and is still the answer. And the window width is measured from the LOWER BOUND, so field 5 plus field 4 equals field 6 exactly on the collapse-bound well while field 2 plus field 1 does NOT equal field 3 on the other one. You should be able to say which well is which before running anything.',
  jsonb_build_array(
    jsonb_build_object('key','slant_tightest_width_kgm3',            'label','Slant window width',      'unit','kg/m3','expected',1317.993874508228, 'tol',0.005),
    jsonb_build_object('key','slant_collapse_emw_at_tightest_kgm3',  'label','Slant collapse gradient', 'unit','kg/m3','expected',248.10414286699674,'tol',0.005),
    jsonb_build_object('key','slant_frac_init_emw_at_tightest_kgm3', 'label','Slant fracture gradient', 'unit','kg/m3','expected',2496.6949229689703,'tol',0.005),
    jsonb_build_object('key','horizontal_tightest_width_kgm3',            'label','Horizontal window width',      'unit','kg/m3','expected',1343.3180035349267,'tol',0.005),
    jsonb_build_object('key','horizontal_collapse_emw_at_tightest_kgm3',  'label','Horizontal collapse gradient', 'unit','kg/m3','expected',1411.1968938126954,'tol',0.005),
    jsonb_build_object('key','horizontal_frac_init_emw_at_tightest_kgm3', 'label','Horizontal fracture gradient', 'unit','kg/m3','expected',2754.514897347622, 'tol',0.005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr5_geomech_go_live.sql.
