-- ============================================================================
-- DR8: Completion Design joins the catalog, the EIGHTH Drilling & Completions
-- course (petrolord-suite docs/scope/NextGen-Drilling-Courses-PLAN.md, PR #337).
--
-- Catalog row (module 'drilling'; path_order 25; prereq_slug NULL) plus the
-- three capstones, eighteen graded fields. DR1 through DR7 are RECOMMENDED and
-- not required.
--
-- ONE PUBLISHED COMPLETION, ONE CASING PROGRAM AND A DRIFT TABLE OF 28 ROWS.
-- completion_cases.json runs a 13 component 3-1/2 inch string of 2606.25 m into
-- a well with 9-5/8 inch production casing in two weights to 3000 m and a 7
-- inch liner from 2400. The packer lands at 2600.5 and total depth is 3000. The
-- drift table is the whole casing and tubing catalog, 28 rows across the four
-- API 5CT deduction classes: 3 at 3/16 in, 9 at 5/32, 10 at 1/8 and 6 tubing
-- rows at 3/32. The equipment catalog is 49 rows across 14 types and 4 tubing
-- sizes, and EVERY row is flagged approximate.
--
-- THE CAPSTONE RUNS A DIFFERENT STRING INTO A DIFFERENT WELL. Fourteen
-- components of 2-7/8 inch jewelry (coupling 3.668 in, bore 2.441, X seat
-- 2.313, XN no-go 2.205) into a THREE string program: 13-3/8 inch surface to
-- 400 m at 12.415 in bore, 9-5/8 inch 53.5 lb/ft to 2200 at 8.535, and a 7 inch
-- 32 lb/ft liner from 2000 to 2900 at 6.094. Total depth 2900. Warn margin
-- 0.003 m. The space-out is a 5.35 m polished bore landed 2.28 m in, against an
-- elongation of 0.65 m and a contraction of 3.15, at a margin of 0.4. Neither
-- the string, the program, the tubing size, the liner weight nor any of the
-- five space-out numbers appears anywhere in the lessons.
--
-- THE PUBLISHED-GOLDEN COLLISION CHECK, WHICH DR4 EARNED AND THIS COURSE RAN
-- BEFORE WRITING A LESSON. All eighteen proposed graded values were swept
-- against every number completion_cases.json publishes, at each field's own
-- tolerance: 0 collisions, after a retune of the capstone PBR, insertion and
-- length changes that removed the two the first draft had. The pairwise check
-- across the eighteen is also 0. Both are re-asserted inside
-- completionLab.test.js.
--
-- THE ENGINE DEFECT THIS COURSE FOUND, FIXED AND GUARDED. runInClearance
-- returned a `worst` row ranked by STATUS ALONE. On a string where every row
-- shares a status, which is every string that PASSES, no row ever outranked the
-- incumbent and the reduction degenerated to rows[0]. The published completion
-- reported its first tubing joint at 0.10222865 m as the worst clearance on a
-- string whose production packer clears by 0.0046736, a factor of
-- 21.87364130434783. The fix ranks by status and then by the tightest clearance
-- within that status, keeps the first on a tie, and never selects a row with no
-- clearance value. The oracle never computed a worst row, so the golden had no
-- field to compare and the output was unverified; oracle_completion.py now
-- computes it with self-asserts and completion_cases.json carries
-- results.clearanceWorst. Shipped as petrolord-engines PR #90 and Suite PR #338,
-- each with its own guards, per the plan's no-engine-change-without-a-guard rule.
--
-- FOUR FINDINGS THE FIXTURE'S OWN OUTPUT PRODUCED. (1) The API drift deduction
-- is a lookup on the OUTSIDE diameter alone, so every 9-5/8 inch row in the
-- catalog gives up the same 5/32 in whatever it weighs, and the class ranges are
-- INCLUSIVE at 8-5/8 and 13-3/8 in, which no catalog row exercises. (2) A
-- component's constraint is the tightest bore anywhere ABOVE it: the safety
-- valve and the side pocket mandrel share an outside diameter of 5.75 in and
-- clear by 0.0704787 and 0.0078486 m, a factor of nine, purely because one stops
-- above the liner top and the other below it. (3) An EXTREME is not an EXTENT:
-- the string is advertised at its XN no-go bore of 0.066929 m, which governs
-- 3.75 m of a 2606.25 m string, while the safety valve at 0.06985 governs
-- 2451.6. (4) Insertion depth splits a FIXED budget, so available elongation
-- plus available contraction is the PBR length at every landing; the published
-- job lands 3 m into 6.1 m and sits 0.3 m SHALLOWER than the lower edge of its
-- own acceptable band of 3.3 to 4.4 m, which is exactly why its contraction case
-- comes back WARN with 0.2 m to spare.
--
-- WHAT THE ENGINE DOES NOT DO, TAUGHT IN EXPERT m05 AND GRADED NOWHERE:
-- deviation and doglegs, running mechanics and drag, the thermal and pressure
-- length changes themselves, buckling, time (scale, corrosion, elastomer
-- degradation, wear), and flow. 20260830_dr8_completion_go_live.sql asserts it.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written (dr8_fields.mjs); completionLab.test.js pins all
-- eighteen through the course's own teaching lab across 42 cases.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260830_dr8_completion_go_live.sql until a production upload carries the
-- /dashboard/apps/completion route.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('completion', 'Completion Design', 'drilling', 25, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'completion', 'beginner', 'associate',
  'a 14 component 2-7/8 inch completion in a three string program with a 7 inch 32 lb/ft liner, none of which the lessons use',
  'Tally a string the lessons never run',
  'Six values for a NEW completion. The string is fourteen components of 2-7/8 inch equipment hung at surface, in order from the top: 180 m of tubing; a 0.9 m flow coupling; a 2.2 m safety valve; a 0.9 m flow coupling; 2100 m of tubing; a 6.1 m blast joint; a 2.4 m side pocket mandrel; 300 m of tubing; a 0.4 m X landing nipple; a 1.5 m production packer; 2.5 m of tubing; a 0.45 m XN no-go nipple; a 3.0 m perforated joint; and a 0.3 m wireline entry guide. The 2-7/8 inch tubing has a coupling outside diameter of 3.668 in and a bore of 2.441 in; the safety valve is 5.25 in outside with a 2.313 in bore; the side pocket mandrel is 5.0 in outside at the tubing bore; the packer is 5.875 in outside with a 2.75 in bore; the X nipple bore is 2.313 in and the XN no-go bore is 2.205; the perforated joint is 2.875 in outside at the tubing bore. The well has THREE casing strings: 13-3/8 in surface from 0 to 400 m at a bore of 12.415 in; 9-5/8 in 53.5 lb/ft from 0 to 2200 at 8.535 in; and a 7 in 32 lb/ft liner from 2000 to 2900 at 6.094 in. Total depth is 2900 m. Report: (1) the BOTTOM depth of the string in metres of measured depth; (2) the BOTTOM depth of the PACKER; (3) the API 5CT DRIFT of the 7 in liner in metres; (4) the API 5CT DRIFT of the 13-3/8 in surface casing in metres; (5) the string CAPACITY in cubic metres; and (6) the string DISPLACEMENT in cubic metres. Traps. Field 4 sits at a class boundary: 13-3/8 in is INCLUSIVE in the 5/32 in class and does NOT take the 3/16 in deduction, and getting that wrong costs a thirty second of an inch. The liner is 32 lb/ft and not the lessons 29, so its bore and therefore its drift both differ. Field 2 is the packer BOTTOM and not its top. Fields 5 and 6 are sums over all fourteen components of an area times a length, using the INSIDE diameter for one and the OUTSIDE for the other, and every catalog value here is in inches while every answer is in metres at 0.0254 m to the inch exactly. Free checks: field 1 must equal the sum of the fourteen lengths, because the hanger is at surface; field 6 must exceed field 5, and their difference is the steel; and both drifts must fall short of their nominal bores by one of the four deduction values and by nothing else.',
  jsonb_build_array(
    jsonb_build_object('key','bottom_md_m',            'label','String bottom',          'unit','m',  'expected',2600.65,            'tol',0.0000005),
    jsonb_build_object('key','packer_bottom_md_m',     'label','Packer bottom',          'unit','m',  'expected',2594.4,             'tol',0.0000005),
    jsonb_build_object('key','drift_liner_m',          'label','Liner drift',            'unit','m',  'expected',0.1516126,          'tol',0.00000005),
    jsonb_build_object('key','drift_surface_casing_m', 'label','Surface casing drift',   'unit','m',  'expected',0.31137224999999996,'tol',0.00000005),
    jsonb_build_object('key','string_capacity_m3',     'label','String capacity',        'unit','m3', 'expected',7.852067852872123,  'tol',0.0000005),
    jsonb_build_object('key','string_displacement_m3', 'label','String displacement',    'unit','m3', 'expected',17.767445424211306, 'tol',0.0000005)
  )
),
(
  'completion', 'intermediate', 'professional',
  'the Associate capstone string checked against its own three string program, on a liner weight and a warn margin the lessons never use',
  'Get it down, and see what gets through',
  'Six fit and volume values for the Associate capstone completion, in the same three string program: 13-3/8 in surface 0 to 400 m at 12.415 in, 9-5/8 in 53.5 lb/ft 0 to 2200 at 8.535 in, and a 7 in 32 lb/ft liner 2000 to 2900 at 6.094 in, with total depth 2900 m and a WARN MARGIN of 0.003 m. Report: (1) the WORST run-in clearance in the string, in metres; (2) the run-in clearance of the SIDE POCKET MANDREL; (3) the MINIMUM THROUGH BORE of the finished string, in metres; (4) the THROUGH BORE AT THE PACKER, meaning the running minimum down to and including the packer; (5) the ANNULUS volume ABOVE the packer in cubic metres; and (6) the volume BELOW the packer. Traps. Field 1 is the TIGHTEST row within the most severe status present, and NOT the first row: rank by status first and then by clearance. Every row is checked against the smallest drift anywhere ABOVE it and never against the bore at its own depth, and in this well the liner top at 2000 m is above the mandrel, the nipple, the packer and everything below them. There are THREE strings here and not the lessons two, so build the exposed profile before checking anything. Field 4 is LARGER than field 3, because something below the packer is tighter than anything above it. Field 6 uses the FULL casing bore and not an annular area, because the tail is open and perforated. Free checks: field 1 must be no larger than field 2, since the mandrel is one of the rows; field 4 must be no smaller than field 3; field 5 must be far larger than the string capacity from the Associate tier; and exactly one row in the whole string comes back WARN rather than PASS.',
  jsonb_build_array(
    jsonb_build_object('key','worst_clearance_m',            'label','Worst clearance',            'unit','m', 'expected',0.0023875999999999897,'tol',0.00000005),
    jsonb_build_object('key','spm_clearance_m',              'label','Side pocket mandrel',        'unit','m', 'expected',0.024612599999999984, 'tol',0.00000005),
    jsonb_build_object('key','through_bore_min_id_m',        'label','Minimum through bore',       'unit','m', 'expected',0.056007,             'tol',0.00000005),
    jsonb_build_object('key','through_bore_at_packer_id_m',  'label','Through bore at the packer', 'unit','m', 'expected',0.0587502,            'tol',0.00000005),
    jsonb_build_object('key','annulus_above_packer_m3',      'label','Annulus above the packer',   'unit','m3','expected',67.27585926805148,    'tol',0.0000005),
    jsonb_build_object('key','below_packer_m3',              'label','Below the packer',           'unit','m3','expected',5.715910666870907,    'tol',0.0000005)
  )
),
(
  'completion', 'advanced', 'expert',
  'a 5.35 m polished bore landed 2.28 m in, against an elongation of 0.65 m and a contraction of 3.15, at a margin of 0.4, none of which the lessons use',
  'Land the seals, and size the bore',
  'Six space-out values for the Associate capstone completion. The seal assembly runs in a POLISHED BORE RECEPTACLE of 5.35 m and is landed 2.28 m into it. The two design cases are an ELONGATION of 0.65 m and a CONTRACTION of 3.15 m. The margin is 0.4 m, which is NOT the 0.5 m the lessons use. Report: (1) the AVAILABLE travel for the elongation case in metres; (2) the AVAILABLE travel for the contraction case; (3) the REMAINING travel after the elongation case; (4) the REMAINING travel after the contraction case, WITH ITS SIGN; (5) the SMALLEST insertion depth at which BOTH cases pass with the margin, in metres; and (6) the SHORTEST polished bore that leaves any acceptable landing at all, in metres. Traps. Elongation pushes the seals DEEPER, so its available travel is the bore length LESS the insertion depth, and contraction pulls them OUT, so its available travel IS the insertion depth. Getting those two the wrong way round swaps fields 1 and 2 and both remainings with them. Field 4 is NEGATIVE and the sign is part of the answer: this landing fails the contraction case. Field 5 comes from the CONTRACTION case, because that is the lower bound on the landing, and not from the elongation case. Field 6 is the whole SWING plus TWICE the margin, once at each end, and using one margin gives an answer 0.4 m short. Free checks: fields 1 and 2 must sum to 5.35 exactly, because the insertion depth splits a fixed budget and never creates any; field 4 must equal field 2 less 3.15; field 5 must EXCEED the 2.28 m as landed, since the landing as given fails one case; and field 6 must be smaller than 5.35, since the band on this bore is open.',
  jsonb_build_array(
    jsonb_build_object('key','available_elongation_m',    'label','Available, elongation',        'unit','m','expected',3.07,               'tol',0.0000005),
    jsonb_build_object('key','available_contraction_m',   'label','Available, contraction',       'unit','m','expected',2.28,               'tol',0.0000005),
    jsonb_build_object('key','remaining_elongation_m',    'label','Remaining after elongation',   'unit','m','expected',2.42,               'tol',0.0000005),
    jsonb_build_object('key','remaining_contraction_m',   'label','Remaining after contraction',  'unit','m','expected',-0.8700000000000001,'tol',0.0000005),
    jsonb_build_object('key','min_insertion_both_pass_m', 'label','Smallest insertion, both pass','unit','m','expected',3.5500000000000003, 'tol',0.0000005),
    jsonb_build_object('key','min_pbr_length_m',          'label','Shortest usable PBR',          'unit','m','expected',4.6000000000000005, 'tol',0.0000005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260830_dr8_completion_go_live.sql.
