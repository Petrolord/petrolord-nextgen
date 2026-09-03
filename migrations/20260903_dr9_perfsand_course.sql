-- ============================================================================
-- DR9: Perforation & Sand Control joins the catalog, the NINTH Drilling &
-- Completions course, and the last one before the module's close-out trio.
--
-- Catalog row (module 'drilling'; path_order 26; prereq_slug NULL) plus the
-- three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. Two questions that meet at one object. A
-- perforation is a flow path, and its geometry decides what the completion
-- gives up or gains against an open hole of the same radius. A perforation is
-- also a cavity, and whether its wall holds decides whether the well produces
-- sand. The Associate tier reads the two inputs, a gun catalog row and a sieve
-- analysis. The Professional tier computes the Karakas and Tariq perforation
-- skin and turns it into a productivity ratio. The Expert tier sizes gravel and
-- a screen and runs a sanding onset sweep down a perforated interval.
--
-- THE STRIKING RESULT THE PROFESSIONAL TIER IS BUILT ON: the absolute
-- permeability cancels out of the skin entirely. The rock could be one
-- millidarcy or one darcy and all four components would be identical, because
-- a dimensionless skin compares two flow geometries that scale with
-- permeability in exactly the same way. What the correlation reads instead are
-- two RATIOS, an anisotropy and a crush contrast, which change the SHAPE of the
-- flow field rather than its level. The whole course has exactly one input in
-- millidarcies and it feeds one output, the underbalance guideline band, which
-- is a transient flushing question rather than a steady-state geometry.
--
-- THE ENGINE DEFECT THIS COURSE FOUND, FIXED AND GUARDED, AND IT IS THE SAME
-- SHAPE AS DR8'S. cdpAlongInterval walked its sanding sweep with a
-- `md <= bottomMdM` loop guard, which exits before the clamp inside the loop
-- can fire. On any interval whose step does not divide it evenly, the deepest
-- metres were never screened: 2450 to 2550 at a 25 m step stopped at 2540. On
-- an interval whose base is the weak rock that is the row that GOVERNS, and
-- omitting it flips the reported margin positive. Invisible on any interval
-- whose step happens to divide it, which is every interval anybody wrote a
-- fixture for. Fixed in the vendored engine and in the Suite as PR #339, each
-- with its own guard; the golden gains a ragged case and the oracle now visits
-- an EXPLICIT station list rather than transcribing the engine's own loop,
-- which is what let the first version agree with the bug.
--
-- THE EXPERT CAPSTONE EXERCISES THAT FIX ON PURPOSE. Its interval is 2200 to
-- 2320 m at a 25 m step. 120 does not divide by 25, so the sweep visits 2200,
-- 2225, 2250, 2275, 2300 and then the CLAMPED bottom at 2320: SIX rows, the
-- last of which did not exist before the fix. Fields 4 and 5 are the governing
-- cdp and the bottom cdp and they are DIFFERENT numbers, because on this
-- interval the TOP governs. A learner who assumes the deepest row is always the
-- worst one gets field 4 wrong, and a learner running the pre-fix engine cannot
-- produce field 5 at all.
--
-- THE CAPSTONE RUNS A DIFFERENT WELL, A DIFFERENT GUN AND A DIFFERENT SAND
-- from anything the lessons use, which is the DR2 rule about designing the
-- capstone's conditions before writing the lessons. A 9-7/8 in hole and not the
-- lessons' 8-1/2; a charge the catalog does not carry, at 8 shots per foot and
-- 90 degree phasing; a nine point sieve none of the tiers analyse; a drainage
-- radius of 220 m; an anisotropy of 6 and a crush contrast of 4.
--
-- THE PUBLISHED-GOLDEN COLLISION CHECK, WHICH DR4 EARNED, RAN BEFORE ANY LESSON
-- WAS WRITTEN. All eighteen proposed graded values were swept against every
-- number the goldens publish, and pairwise against each other at their own
-- tolerances. Zero collisions.
--
-- THE LEAKAGE SWEEP GAINED A UNIT SCALE THIS WAVE, AND IMMEDIATELY EARNED IT.
-- The sweep compared raw literals only, so a value graded in metres and
-- restated in millimetres passed. The Associate exam printed its own capstone
-- answer as "38.1 millimetres" against a graded perf_spacing_m of 0.0381 and
-- the sweep said clean. It now tests every literal against each graded value at
-- each plausible unit scale, and the two Associate questions that converted 8
-- shots per foot (the capstone's own density) were moved to 5 and 6 shots per
-- foot. Both sweeps, banks and all 78 lessons, are clean under the stricter
-- tool. THE RULE: a leakage sweep that only matches raw literals is checking
-- the notation, not the answer.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written; see dr9_fields.mjs in the wave directory, which
-- derives all eighteen by running perforation.js and sandControl.js and writes
-- fields.json. Nothing below is typed from a lesson.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260903_dr9_perfsand_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/perfsand.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('perfsand', 'Perforation & Sand Control', 'drilling', 26, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'perfsand', 'beginner', 'associate',
  'a nine point sieve analysis and a gun at 8 shots per foot in a 9-7/8 inch hole, none of which the lessons use',
  'Read the two inputs on a well the lessons never touch',
  'Six values from the two inputs this tier reads. THE GUN is quoted at 8 shots per foot with 90 degree phasing, an entrance hole of 0.34 in and a published penetration of 22 in, run in a 9-7/8 in hole. THE SIEVE ANALYSIS is a CUMULATIVE RETAINED curve of nine points, size in microns against percent retained: 560 at 2, 400 at 7, 280 at 19, 200 at 36, 140 at 54, 100 at 70, 70 at 83, 50 at 92 and 38 at 96. Report: (1) the shot density in shots per METRE; (2) the shot SPACING in metres; (3) D50 in metres; (4) D10 in metres; (5) the UNIFORMITY coefficient; and (6) the FINES percentage. Traps. Fields 1 and 2 are the same input twice and are reciprocals of each other, but only after the foot has become a metre, and a learner who converts once and forgets the other gets one of the two. This is a RETAINED curve, so D10 is the COARSE end and comes out LARGER than D50; reading it as a passing curve swaps fields 3 and 4 and silently ruins field 5 as well. Every interpolation between two sieves is on a LOG scale, because a straight line on linear axes sits above the curve and oversizes the grain. The fines cutoff is 44 microns and the stack reaches 38, so the cutoff IS bracketed and the answer is an interpolation rather than a refusal. Free checks: field 4 must exceed field 3, which is the whole test of the convention; field 1 times field 2 must equal one exactly; field 5 must exceed one, since a uniformity below one would mean the coarse percentile was finer than the fine one; and field 6 must fall between the 4 percent passing at 38 microns and the 8 percent passing at 50, because 44 sits between those two sieves.',
  jsonb_build_array(
    jsonb_build_object('key','spf_per_m',      'label','Shot density',           'unit','1/m','expected',26.246719160104984,   'tol',0.0000005),
    jsonb_build_object('key','perf_spacing_m', 'label','Shot spacing',           'unit','m',  'expected',0.0381,               'tol',0.00000005),
    jsonb_build_object('key','d50_m',          'label','D50',                    'unit','m',  'expected',0.00015154816894736884,'tol',0.0000000005),
    jsonb_build_object('key','d10_m',          'label','D10',                    'unit','m',  'expected',0.0003658764876914779, 'tol',0.0000000005),
    jsonb_build_object('key','uniformity',     'label','Uniformity coefficient', 'unit','',   'expected',3.4289759314122965,   'tol',0.0000005),
    jsonb_build_object('key','fines_pct',      'label','Fines',                  'unit','%',  'expected',6.136789960794047,    'tol',0.000005)
  )
),
(
  'perfsand', 'intermediate', 'professional',
  'the Associate capstone gun and hole, at an anisotropy of 6 and a crush contrast of 4 that the lessons never pair',
  'Four components, one total, and what it buys',
  'Six values for the Associate capstone gun in the Associate capstone hole. The gun is 8 shots per foot at 90 degree phasing, entrance hole 0.34 in, penetration 22 in, in a 9-7/8 in hole. The CRUSHED ZONE has a radius of 0.6 in and the undamaged to crushed permeability ratio is 4. The horizontal to vertical permeability ratio is 6. The drainage radius is 220 m. Report: (1) the PLANE FLOW skin; (2) the CONVERGING FLOW skin; (3) the CRUSHED ZONE skin; (4) the TOTAL skin; (5) the PRODUCTIVITY RATIO; and (6) the DIMENSIONLESS PERFORATION RADIUS. Traps. The tunnel RADIUS is HALF the entrance hole and not the entrance hole itself, and every one of the six fields moves if that is got wrong. The published penetration is the tunnel LENGTH here, with no rock correction applied, because none has been supplied. The spacing that enters the correlation is the reciprocal of the density in METRES, which is the Associate tier field 2. Field 4 is NOT the sum of fields 1, 2 and 3: there is a fourth component, the wellbore blockage skin, and it is small but it is NOT zero, so a learner who adds three numbers is short by it. Field 5 needs the drainage radius as stated and not a default. Free checks: field 1 must be NEGATIVE, because a tunnel a third of a metre long reaches past the wall of the hole; fields 2 and 3 must both be POSITIVE; field 4 must be negative and must be LARGER than field 1 alone; and field 5 must EXCEED one, because a negative total skin is a stimulation.',
  jsonb_build_array(
    jsonb_build_object('key','skin_h',             'label','Plane flow skin',        'unit','','expected',-1.3764549734793852, 'tol',0.0000005),
    jsonb_build_object('key','skin_v',             'label','Converging flow skin',   'unit','','expected',0.3651263069479987,  'tol',0.0000005),
    jsonb_build_object('key','skin_cz',            'label','Crushed zone skin',      'unit','','expected',0.25795865826120373, 'tol',0.0000005),
    jsonb_build_object('key','skin_total',         'label','Total skin',             'unit','','expected',-0.7474989638653953, 'tol',0.0000005),
    jsonb_build_object('key','productivity_ratio', 'label','Productivity ratio',     'unit','','expected',1.1111973107176247,  'tol',0.0000005),
    jsonb_build_object('key','rp_d',               'label','Dimensionless perf radius','unit','','expected',0.07980073645961891,'tol',0.00000005)
  )
),
(
  'perfsand', 'advanced', 'expert',
  'the Associate capstone sand, plus a 2200 to 2320 m interval at a 25 m step that does NOT divide it, at a boost of 1.15',
  'Size the pack, then walk the interval',
  'Six values. THE SAND is the Associate capstone sieve, cumulative retained in microns: 560 at 2, 400 at 7, 280 at 19, 200 at 36, 140 at 54, 100 at 70, 70 at 83, 50 at 92 and 38 at 96. THE INTERVAL runs from 2200 to 2320 m measured depth, screened at a step of 25 m, as an OPEN HOLE cavity, with a strength boost factor of 1.15. Report: (1) the MINIMUM of the Saucier gravel band in metres; (2) the GAUGE MARGIN in metres, meaning the largest permissible gauge less the gauge actually selected; (3) the CRITICAL FLOWING PRESSURE at the governing station in pascals; (4) the GOVERNING critical drawdown pressure in pascals; (5) the critical drawdown pressure at the BOTTOM station in pascals; and (6) the boost factor at which the governing margin is exactly ZERO. Traps. The Saucier band is a multiplier on D50 and NOT on D10, and using the coarse percentile oversizes the pack by a factor of well over two. The gauge series is DISCRETE, so field 2 is a leftover and not a design choice, and it is the bound less the SELECTED gauge rather than the bound less the gravel size. The step does NOT divide the interval: 120 m at 25 m gives 2200, 2225, 2250, 2275, 2300 and then a CLAMPED bottom at 2320, which is SIX rows and not five, and the sixth exists only because the engine walks to the interval bottom rather than to the last whole step before it. Fields 4 and 5 are DIFFERENT numbers and field 4 is the SMALLER: on this interval the TOP station governs, so a learner who assumes the deepest row is the worst one reports field 5 twice. Field 6 is a search and not a formula. Free checks: field 5 must EXCEED field 4, since the governing value is a minimum over the rows; field 6 must be BELOW the applied 1.15, because at 1.15 the interval still has margin; and field 1 must equal five times the Associate tier D50 exactly.',
  jsonb_build_array(
    jsonb_build_object('key','gravel_band_min_m',     'label','Gravel band minimum',      'unit','m', 'expected',0.0007577408447368442,'tol',0.0000000005),
    jsonb_build_object('key','gauge_margin_m',        'label','Gauge margin',             'unit','m', 'expected',0.00008699999999999995,'tol',0.0000000005),
    jsonb_build_object('key','pwf_crit_pa',           'label','Critical flowing pressure','unit','Pa','expected',11691094.102374725,   'tol',500),
    jsonb_build_object('key','cdp_governing_pa',      'label','Governing CDP',            'unit','Pa','expected',8884412.847751666,    'tol',500),
    jsonb_build_object('key','cdp_bottom_pa',         'label','CDP at the bottom station','unit','Pa','expected',12588855.56336058,    'tol',500),
    jsonb_build_object('key','boost_at_zero_margin',  'label','Boost at zero margin',     'unit','',  'expected',0.7896888993074376,   'tol',0.0000005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260903_dr9_perfsand_go_live.sql.
