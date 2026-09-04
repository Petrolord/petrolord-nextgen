-- ============================================================================
-- DR11: Well Integrity & P&A joins the catalog, the ELEVENTH Drilling &
-- Completions course.
--
-- Catalog row (module 'drilling'; path_order 28; prereq_slug NULL) plus the
-- three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. Containment, and the evidence for it. The
-- Associate tier reads a barrier table: what an element is, which envelope it
-- serves, what its status claims, and what the two envelopes together oblige.
-- The Professional tier computes the annulus pressure limits that protect
-- those barriers. The Expert tier takes the well permanently out of service.
--
-- THE IDEA THAT RUNS THROUGH ALL THREE TIERS IS EVIDENCE. An element is
-- 'verified' only if somebody tested it and the test is current, and
-- 'not-verified' DEGRADES an envelope exactly as an explicitly degraded
-- element does, because a barrier you cannot demonstrate is not a barrier you
-- can rely on. The Expert tier prices the same principle: unverified annular
-- cement needs 100 m and logged cement needs 30, so a cement evaluation log is
-- worth SEVENTY METRES of cement.
--
-- TWO ENGINE DEFECTS THIS COURSE FOUND, BOTH THE SAME FAILURE MODE, AND BOTH
-- IN THE DIRECTION AN INTEGRITY FUNCTION MUST NEVER FAIL IN.
--
--   (1) wellCategory accepted any string and fell through to GREEN for
--   anything it did not recognise. An ELEMENT is verified / degraded / failed
--   / not-verified; an ENVELOPE is intact / degraded / failed / empty; two
--   words are in BOTH lists, which is what makes mixing them easy. So
--   wellCategory({ primary: 'not-verified', secondary: 'intact' }) answered
--   GREEN for a well whose primary envelope nobody had checked. Its sibling
--   envelopeStatus already threw on an unknown element status, so the two
--   halves of one boundary disagreed about whether to trust their caller.
--
--   (2) An EMPTY primary envelope also read GREEN on a well without flow
--   potential. That branch tested for failed and degraded and fell through for
--   everything else, so a well with NOTHING recorded in it came back clean and
--   the reason string named a "Qualified barrier" that did not exist. The
--   flowing branch had always treated empty as a finding.
--
-- Both fixed in petrolord-engines PR #105, with the relaxation that matters
-- preserved and tested: an INTACT single envelope on a non-flowing well is
-- still green. THE RULE: when two halves of one function disagree about
-- whether to trust their input, the trusting half is the bug.
--
-- A THIRD FINDING, AND IT IS A SCOPE LIMIT RATHER THAN A DEFECT. The secondary
-- barrier rule tests only that a plug sits entirely above the source top and
-- passes the length rule. It does NOT test formation competence or annular
-- isolation behind the secondary, which the standard does require, and
-- annularBarrierCheck is a SEPARATE function that abandonmentProgram never
-- calls, so the 30 m and 100 m annular figures play no part in a zone verdict.
-- The engine header documents exactly this, so Expert m05 l04 teaches it as a
-- stated limit: a passing programme is not a complete one.
--
-- THE CAPSTONE IS A SUBSEA WELL THE LESSONS NEVER TOUCH. Nineteen physical
-- elements against the published ten, THREE common well barrier elements
-- against the published none, and two barrier tables rather than one. It comes
-- back RED as found, and the reason rewards reading: the failed production
-- packer alone would only be orange, but the SECONDARY is degraded too, not by
-- damage but because a tubing hanger and a casing hanger seal were never
-- verified. Securing the well moves it red to yellow, and it stays yellow
-- solely because the BOP is not yet pressure tested.
--
-- THE DR4 CHECK RAN BEFORE A LESSON WAS WRITTEN, and it earned its keep twice.
-- It caught a beginner field whose value the golden's OWN published category
-- table already lists, which made it a lookup rather than a calculation; that
-- field was re-cut to the seat total. It then flagged the replacement against
-- a survey station's inclination, which is a coincidence between two small
-- integers and nothing more. The sweep now separates integer NOTES from real
-- COLLISIONS for exactly that reason, and the notes still get read.
--
-- Oracle values reproduced from the vendored engine in Node BEFORE this
-- migration was written; see dr11_fields.mjs in the wave directory.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_dr11_integrity_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/integrity.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('integrity', 'Well Integrity & P&A', 'drilling', 28, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'integrity', 'beginner', 'associate',
  'a subsea well with nineteen barrier elements, three of them common to both envelopes, in two states: as found and as secured',
  'Read two barrier tables on a well the lessons never touch',
  'Six counts from the two barrier tables supplied with this capstone. THE WELL is subsea. THE AS FOUND TABLE lists nineteen physical elements: six serving the primary envelope only, ten serving the secondary only, and THREE serving BOTH. Among them a production packer has FAILED, a tubing hanger and a casing hanger seal assembly were never verified, and an annulus packer fluid is degraded. THE AS SECURED TABLE describes the same well killed, with a deep-set plug and a cement plug set in the tubing, the tree pulled and the BOP nippled up but NOT yet pressure tested. Report: (1) the PRIMARY element count as found; (2) the SECONDARY element count as found; (3) the DISTINCT physical element count as found; (4) the SEAT TOTAL as found, meaning the primary count plus the secondary count; (5) the PRIMARY element count as secured; and (6) the DISTINCT physical element count as secured. Traps. A COMMON element belongs to BOTH envelopes and is counted by each of them, so fields 1 and 2 both include all three of them and field 3 counts each of them ONCE. Field 4 is therefore LARGER than field 3, and the gap is not an error: it is exactly the number of common elements, and it is the honest measure of how much independence this well actually has. The as secured table is a different table, not an edit of the first, so recount it rather than adjusting. Free checks: field 4 must equal field 1 plus field 2; field 4 less field 3 must equal three, the number of common elements; and every count must be a whole number of elements you can point at on the table.',
  jsonb_build_array(
    jsonb_build_object('key','asfound_primary_count',         'label','Primary elements, as found',   'unit','','expected',9, 'tol',0.0000005),
    jsonb_build_object('key','asfound_secondary_count',       'label','Secondary elements, as found', 'unit','','expected',13,'tol',0.0000005),
    jsonb_build_object('key','asfound_distinct_element_count','label','Distinct elements, as found',  'unit','','expected',19,'tol',0.0000005),
    jsonb_build_object('key','asfound_seat_total',            'label','Seat total, as found',         'unit','','expected',22,'tol',0.0000005),
    jsonb_build_object('key','secured_primary_count',         'label','Primary elements, as secured', 'unit','','expected',11,'tol',0.0000005),
    jsonb_build_object('key','secured_distinct_element_count','label','Distinct elements, as secured','unit','','expected',17,'tol',0.0000005)
  )
),
(
  'integrity', 'intermediate', 'professional',
  'the A and B annuli of the Associate capstone well, plus a displacement case with the tubing unloaded to gas',
  'Two annuli, and the case where one cannot be pressured at all',
  'Six values for the annuli of the Associate capstone well. Each bounding element carries its own pressure limit, its true vertical depth, the density of whatever stands on the FAR side of it, and a role from which the RP 90 design factor is looked up. Report, for the A ANNULUS: (1) the allowable at the COMPLETION TUBING COLLAPSE row in pascals; (2) the allowable at the SHOE FORMATION STRENGTH row; (3) the MAWOP of the A annulus; and (4) the TRUE VERTICAL DEPTH of the GOVERNING element, in metres. Then (5) the MAASP of the B ANNULUS in pascals; and (6) the allowable at the tubing collapse row in the DISPLACEMENT case, where the annulus carries heavy brine and the tubing has been unloaded to GAS. Traps. The engine takes TRUE VERTICAL depth and not measured depth, because a head is a vertical quantity, so convert through the survey first. Field 3 is the MINIMUM over the rows and NOT the first row and NOT the smallest raw rating: the ROLE factor can invert the ranking, and on this well an outer casing with the highest rating governs because it carries the lowest factor. Field 6 is NEGATIVE and the sign is part of the answer: hydrostatic alone exceeds the rating, so the engine clamps the reported MAASP to zero and raises its negative flag, and reporting the clamped zero as if it were the row would lose the finding. Free checks: field 3 must be no larger than field 1 or field 2, since it is the minimum over a set that includes them; field 4 must be the depth of whichever row produced field 3; and field 6 must be below zero, because that is the whole point of the displacement case.',
  jsonb_build_array(
    jsonb_build_object('key','mawop_a_tubing_row_pa',        'label','A annulus, tubing collapse row','unit','Pa','expected',16226227.041788332, 'tol',10),
    jsonb_build_object('key','mawop_a_shoe_row_pa',          'label','A annulus, shoe strength row',  'unit','Pa','expected',16497910.032817762, 'tol',10),
    jsonb_build_object('key','mawop_a_pa',                   'label','A annulus MAWOP',               'unit','Pa','expected',13513225.370183308, 'tol',10),
    jsonb_build_object('key','mawop_a_governing_tvd_m',      'label','Governing element TVD',         'unit','m', 'expected',1944.8770336087282,  'tol',0.0005),
    jsonb_build_object('key','maasp_b_pa',                   'label','B annulus MAASP',               'unit','Pa','expected',15378302.866843894, 'tol',10),
    jsonb_build_object('key','maasp_gasfilled_tubing_row_pa','label','Displacement case, tubing row', 'unit','Pa','expected',-7098210.7407652065,'tol',10)
  )
),
(
  'integrity', 'advanced', 'expert',
  'a five plug abandonment of the Associate capstone well at 35 percent excess, which FAILS on a 7.5 metre shortfall',
  'Place the plugs, then read the verdict the programme actually gives',
  'Six values for a permanent abandonment of the Associate capstone well. FIVE plugs are proposed across two flowing zones plus a surface phase, at 35 percent excess. Report: (1) the SLURRY VOLUME of the reservoir primary plug in cubic metres; (2) its SPACER BEHIND volume; (3) the SETTLE of that plug, meaning how much DEEPER its final top sits than its as-pumped top, in metres; (4) the ABOVE SOURCE MARGIN for the reservoir zone in metres, WITH ITS SIGN; (5) the ANNULAR CEMENT MARGIN in metres, WITH ITS SIGN; and (6) the TOTAL SLURRY TAKEOFF across the whole programme. Traps. Field 3 is not caused by the excess. The as-pumped column stands in the annulus PLUS the stinger bore, which together are narrower than the full hole, so when the stinger is pulled the same slurry redistributes across the wider bore and the top drops. It would drop even at ZERO excess; the excess only adds to it, and at zero excess the settled top lands exactly on the design top, which is the identity that anchors every other figure here. Fields 4 and 5 are NEGATIVE and their signs are the answer: each is a SHORTFALL in metres rather than a failure code, and a reader who reports a magnitude has thrown away the direction. Field 6 sums every plug including the two the programme does not design a placement for, so it is not the sum of the designed slurries alone. Free checks: field 2 must be far smaller than field 1, since the spacer behind balances a spacer ahead across a capacity ratio; field 3 must be positive, because a plug always settles DOWNWARD; and fields 4 and 5 must both be negative, because this programme fails and the Expert tier is built on reading why.',
  jsonb_build_array(
    jsonb_build_object('key','plug_slurry_m3',           'label','Reservoir plug slurry',    'unit','m3','expected',4.620238645056858,  'tol',0.0000005),
    jsonb_build_object('key','plug_spacer_behind_m3',    'label','Spacer behind',            'unit','m3','expected',0.5279360645295814, 'tol',0.00000005),
    jsonb_build_object('key','plug_top_settle_m',        'label','Plug top settle',          'unit','m', 'expected',21.154551869215993, 'tol',0.000005),
    jsonb_build_object('key','above_source_margin_m',    'label','Above source margin',      'unit','m', 'expected',-7.5,                'tol',0.000005),
    jsonb_build_object('key','annular_cement_margin_m',  'label','Annular cement margin',    'unit','m', 'expected',-26.5,               'tol',0.000005),
    jsonb_build_object('key','program_slurry_takeoff_m3','label','Programme slurry takeoff', 'unit','m3','expected',18.197179289478704, 'tol',0.0000005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_dr11_integrity_go_live.sql.
