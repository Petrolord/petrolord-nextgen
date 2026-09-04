-- ============================================================================
-- PD4: Rod Pump Design joins the catalog, the FOURTH Production & Artificial
-- Lift course.
--
-- Catalog row (module 'production'; path_order 33; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. A beam pump is a WAVE MACHINE. The polished rod
-- moves a stroke at the surface, the rod string carries that motion down as a
-- travelling wave, and the plunger at the bottom moves a DIFFERENT stroke, so
-- almost every number a designer wants is a property of the card the wave
-- makes rather than of the geometry that started it. The extraction shipped
-- the domain as four modules with a clean seam through the middle of it, and
-- the seam is already a curriculum. rodString.js, pumpingUnit.js's kinematics
-- and the two closed forms at the top of rodPumpDesign.js are CLOSED FORM AND
-- TIMELESS: a compliance sum, Archimedes, a stepped-bar eigenvalue, a four-bar
-- closure, a differential times an area, a volume per stroke. Nothing in that
-- layer knows what time it is, and that is the ASSOCIATE tier. Everything in
-- rodDynamics.predictCard IS the design, because the design is the card, and
-- that is the PROFESSIONAL tier. The EXPERT tier is what the card hides.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) THE STATIC RULE AND THE WAVE EQUATION DISAGREE BY ABOUT A TENTH OF THE
--   STROKE, AND THE WHOLE OF THE GAP IS INERTIAL OVERTRAVEL. Every rod pump
--   text opens with Sp = S - Fo*Er, the plunger losing exactly the rod stretch.
--   It knows nothing about a string that is still moving when the polished rod
--   turns round. On the capstone well the static rule is 10.83 in LOW,
--   which is 10.51 percent of its own answer and 8.92 percent of the surface
--   stroke. Both the stretch and the wave answer are graded in the SAME
--   tier, so a learner who stops at the spring model loses one field and keeps
--   the other. That distinction is why this course exists.
--
--   (2) THE REPORTED LOADS ARE NOT THE LOADS COMPUTED. predictCard marches the
--   string at the Courant step, 4228 steps in a cycle on the capstone well,
--   and accumulates the tension envelope over every one of them. It then
--   DECIMATES the surface card to 184 points and reads prlPeakLb and prlMinLb
--   off THAT SUBSAMPLE. The peak comes back 403.39 lb low. The minimum comes
--   back 2059.60 lb HIGH, which is 2.83 TIMES the load the march actually
--   computed, because a minimum is where a coarse sample is least likely to
--   land on the extreme. Raising `cardSamples` alone, which changes the
--   decimation stride and nothing else in the march, recovers both. And
--   runRodPumpDesign exposes NEITHER `cardSamples` NOR `nodes`, so a studio
--   user gets the subsampled pair and no way to ask for the other. Both are
--   graded at the shipped default, because that is what the app returns.
--
--   (3) THE LOADS ARE NOT CONVERGED EITHER, AND THE PLUNGER STROKE IS.
--   Re-solving the same well at 120, 240, 480 and 960 nodes moves the plunger
--   stroke by 0.041044911 in, four hundredths of one percent, and moves the
--   peak polished rod load by 967.98 lb and the minimum by 1108.07 lb, 4.2 and
--   34.8 percent. At 240 nodes the march does not reach a repeating cycle in
--   the twenty strokes it is allowed and comes back `notPeriodic`, so the grid
--   sequence is not even monotone in convergence. One consequence is worth
--   stating plainly: the worst rod loading across a 10.6 to 12.2 spm sweep
--   reads 105.16, 106.34, 104.60, 109.06, 111.23 percent, which is NOT
--   monotonic, and the dip at 11.4 spm is SMALLER than the grid spread on the
--   load it is built from. That is not evidence that speeding this unit up
--   unloads the rods. It is the engine failing to resolve a two point
--   difference in rod loading, and a course that teaches the dip as a result
--   would be teaching numerical noise as physics.
--
--   (4) A DIAGNOSTIC RE-READING THE CARD ITS OWN MARCH PRODUCED DOES NOT GET
--   THE SAME ANSWER BACK. diagnoseCard is a Gibbs harmonic solver handed the
--   surface half of the predicted card and asked what the pump was doing. It
--   shares no code path with the march that made the card, so the gap between
--   what it returns and what the prediction was told to assume is a
--   measurement of the engine against itself: 0.0813 in on the plunger stroke
--   and 241.52 lb, 5.53 percent, on the peak pump load. Both halves of that
--   gap are graded rather than hidden, one in the Professional tier and one in
--   the Expert tier.
--
-- WHAT THE ORACLE RECORDS, AND IT IS NOT A DEFECT LIST.
-- tools/validation/production/oracle_rodpump.py records an INDEPENDENCE
-- DISCIPLINE: a finite element eigenvalue solve where the engine walks a
-- transfer matrix, Newton closure and implicit differentiation where the
-- engine intersects circles and differences numerically, a staggered
-- velocity/tension RK4 march where the engine marches displacement by explicit
-- central differences, and Python's own complex type where the engine
-- hand-rolls complex arithmetic. The two routes are then required to agree.
-- The tolerance the gates hold them to on the wave equation is 2 PERCENT on
-- the plunger stroke and 3 PERCENT on the minimum polished rod load, so
-- EVERYTHING SMALLER THAN THAT IS INVISIBLE TO THE ORACLE BY CONSTRUCTION.
-- Every finding this wave turned up is either smaller than that or outside
-- what the oracle exercises at all, which is exactly why an oracle passing is
-- not the same statement as an engine being right. All seven are recorded in
-- the wave's FINDINGS.md with their magnitudes, and the sharpest of them, the
-- 2.83x minimum load, sits comfortably inside a 3 percent gate because the
-- gate is on a DIFFERENT well.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: OBAGI-27, a 6085 ft
-- beam-pumped oil well on a three-way taper, a 1.5 in plunger and a barrel
-- that fills 85.3 percent. Every condition it carries differs from the ones
-- rodpump_cases.json publishes, which is the DR2 rule: design the capstone's
-- conditions BEFORE writing the lessons, so the tier can teach on the
-- published case and grade on this one. Five things were tuned into it.
--
--   THE ONLY THING WRONG WITH THE DESIGN IS THE RODS. The unit is inside every
--   rating it has, at 74.90 percent of its structure, 89.38 percent of its
--   gearbox and 84.29 percent of its stroke. The rods are over the modified
--   Goodman allowable and the design is REFUSED, on a service factor that is
--   the operator's own judgement about the fluid rather than a rod property at
--   all.
--
--   THE FILLAGE SITS THREE THOUSANDTHS ABOVE A CLIFF IN THE CODE.
--   runRodPumpDesign warns `incompleteFillage` below 0.85 and this barrel
--   fills 0.853, so a pump that is fifteen percent short raises NO warning.
--   The same well at 0.849 raises it, and the two differ in production by
--   0.4959 bbl/d. A learner who reads the warning list rather than the number
--   concludes the pump is full.
--
--   THE 3/4 SECTION GOES INTO COMPRESSION, at -3623.60 psi, on a design whose
--   only warning names a different section entirely.
--
--   TWO INPUTS ARE ACCEPTED AND CHANGE NOTHING, AND THE SAME TWO CHANGE A LOT
--   SOMEWHERE ELSE. The structural unbalance of 810 lb and the crank offset of
--   14 degrees leave runRodPumpDesign's output BIT IDENTICAL. Hand the same
--   two to balanceUnit and the peak torque moves 23121.96 in-lb, 4.04 percent.
--   The reader's test is not whether an input was accepted. It is which
--   function was asked.
--
--   AND THE LOADS THE DESIGN REPORTS ARE THE SUBSAMPLED ONES, per result (2),
--   because that is what a studio user receives.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. A capstone prompt
-- must state every condition that changes an answer, and in a chained domain
-- the thing that changes a Professional answer is usually an Associate
-- quantity. The fix is not to disclose the overlap, it is to RESTATE THE
-- CONDITIONS rather than the results: every tier's prompt repeats the string,
-- the linkage and the pump from the raw geometry, and NO tier's prompt states
-- a number another tier is graded on, nor any quantity another tier's answer
-- can be recovered from by one subtraction or one division. That last clause
-- is the one that did work here. The static rule's own plunger stroke, the
-- ratio of plunger stroke to surface stroke, the full-resolution load pair,
-- the round-trip gaps and the critical service factor were ALL drafted into
-- prompts and ALL removed, because each of them divides or subtracts straight
-- back to a graded field in a different tier. The relations they were carrying
-- are still in the prompts, stated as directions and inequalities that a
-- learner can check and cannot invert.
--
-- The go-live carries a standing gate for this: it re-reads the STORED prompts
-- and refuses if any tier's prompt contains another tier's graded value,
-- commas stripped first.
--
-- THE GOLDENSWEEP RAN BEFORE A LESSON WAS WRITTEN, and was re-run against the
-- teaching digest as well as the goldens: eighteen graded values against 5184
-- published numbers, ZERO collisions and ZERO integer notes. Sweeping against
-- the goldens proves the capstone is not a lookup. Sweeping against the
-- TEACHING DIGEST proves the lessons do not hand out the answers, which is the
-- one that voids an assessment, and it is a different question.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd4_rodpump_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/rodpump.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('rodpump', 'Rod Pump Design', 'production', 33, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'rodpump', 'beginner', 'associate',
  'OBAGI-27, a 6085 ft three-way taper on a conventional unit, read before anything moves',
  'Settle the design before anything moves',
  'Six values for OBAGI-27 that are settled BEFORE a single time step is taken, and there is deliberately no card in this question. THE STRING is a three-way taper hanging 6085 ft: 1825 ft of 1 in rod at the top, then 2140 ft of 7/8 in, then 2120 ft of 3/4 in at the bottom, all API GRADE D, hanging in a fluid of SPECIFIC GRAVITY 0.94. THE UNIT is conventional, and these are its own drawing dimensions: a walking beam with a 118.4 in FRONT arm from the saddle bearing to the polished rod and a 71.6 in REAR arm from the saddle bearing to the equalizer, a 92.5 in pitman, a crank pivot 104.3 in behind and 66.9 in below the saddle bearing, and a 33.7 in crank radius. Close the linkage at 720 CRANK ANGLES. THE PUMP has a 1.5 IN PLUNGER, an intake pressure of 210 PSIA and a discharge pressure of 2680 PSIA, and the unit runs at 11.4 SPM. What the barrel actually fills, how efficient the pump is and how heavily the string is damped are the Professional tier''s to work out and are not needed here. Report: (1) the SPRING RATE of the string; (2) its BUOYED WEIGHT; (3) its NATURAL FREQUENCY; (4) the SURFACE STROKE the linkage gives; (5) the FLUID LOAD on the plunger; and (6) the RATED DISPLACEMENT. Traps. Field 2 is not the weight in air. The string weighs 13,523.24 lb dry, and the buoyancy factor comes from the 0.94 fluid rather than from water, so a design worked in water is wrong in the third figure and wrong in the same direction on every load that follows it. Field 3 has TWO candidate answers and only one is asked for. A stepped bar has a fundamental of its own, 40.15458511 spm here, and a taper raises it by a taper factor of 1.15865923; report the TAPERED string''s note, not the uniform one. Field 4 has the same shape of trap from the other direction: the textbook shorthand of twice the crank radius times the front arm over the rear arm gives 111.45474860 in on this unit, and the four-bar closed properly gives something 9.93 in longer, because a pitman of finite length is not a rigid link of zero mass and the shorthand is a small-angle approximation nobody states. Field 5 is a DIFFERENTIAL times an AREA and nothing else: no depth, no specific gravity, no fillage. Field 6 is a RATING and not a production forecast: it is the pump constant times the plunger diameter SQUARED times the SURFACE stroke times the speed, with no barrel fillage and no pump efficiency in it, so it is the largest number this well can be made to produce and not a number it will. Free checks: field 2 divided by the 13,523.24 lb weight in air must equal one less the fluid''s own weight over steel''s, and must therefore be the SAME buoyancy factor for every taper hung in this fluid. Field 3 must EXCEED the 40.15458511 spm uniform fundamental, by exactly the taper factor, because stiffening the top of a bar can only raise its note. Field 4 must EXCEED 111.45474860 in, and if your linkage returns something below it you have closed the four-bar on the wrong branch. Field 5 divided by the plunger area must return 2470 psi exactly, the differential and nothing else. Field 6 divided by field 4, then by 11.4, then by 1.5 squared, must return the package''s own pump constant of 0.11657115597735782 bbl per day per in2 per in per spm, which is built from 42 gallons of 231 in3 rather than stored, so the same division done against a stored constant off a chart will miss in the sixth figure. And the 11.4 spm the unit runs at must sit WELL BELOW field 3, since a beam pump run near the string''s own note is a different design problem from this one.',
  jsonb_build_array(
    jsonb_build_object('key','string_kr_lb_per_in',        'label','Rod string spring rate',  'unit','lb/in','expected',237.9571451078754,  'tol',0.000048),
    jsonb_build_object('key','string_buoyed_weight_lb',    'label','Buoyed string weight',    'unit','lbf',  'expected',11903.896611464968, 'tol',0.0024),
    jsonb_build_object('key','string_natural_freq_spm',    'label','Natural frequency',       'unit','spm',  'expected',46.52548077425118,  'tol',0.0000094),
    jsonb_build_object('key','unit_stroke_in',             'label','Surface stroke',          'unit','in',   'expected',121.38337590532858,  'tol',0.000025),
    jsonb_build_object('key','pump_fluid_load_lb',         'label','Fluid load',              'unit','lbf',  'expected',4364.850293081319,  'tol',0.00088),
    jsonb_build_object('key','pump_rated_displacement_bpd','label','Rated displacement',      'unit','bbl/d','expected',362.9423814326748,  'tol',0.000073)
  )
),
(
  'rodpump', 'intermediate', 'professional',
  'the OBAGI-27 card, where the static rule loses a tenth of the stroke to inertial overtravel',
  'Solve the card',
  'Six values that turn OBAGI-27 into a card. THE SAME WELL, restated in full so nothing has to be carried across from another tier. The string is a three-way taper hanging 6085 ft: 1825 ft of 1 in rod, then 2140 ft of 7/8 in, then 2120 ft of 3/4 in, all API GRADE D, in a fluid of SPECIFIC GRAVITY 0.94. The unit is conventional, with a 118.4 in FRONT arm from the saddle bearing to the polished rod, a 71.6 in REAR arm from the saddle bearing to the equalizer, a 92.5 in pitman, a crank pivot 104.3 in behind and 66.9 in below the saddle bearing and a 33.7 in crank radius, closed at 720 crank angles. The pump has a 1.5 IN PLUNGER between 210 PSIA intake and 2680 PSIA discharge, and the unit runs at 11.4 SPM. NEW HERE, and each of the three moves an answer: the string is damped at 0.085 OF CRITICAL, the barrel fills 0.853, and the pump is 0.86 EFFICIENT. Leave the marching parameters at the engine''s own defaults: do not raise the node count, the sample count, the cycle limit or the tolerance, because the numbers this tier is graded on are the numbers a studio user receives. Report: (1) the STATIC STRETCH the fluid load causes; (2) the PLUNGER STROKE; (3) the PEAK POLISHED ROD LOAD; (4) the MINIMUM POLISHED ROD LOAD; (5) the POLISHED ROD HORSEPOWER; and (6) what the well PRODUCES. Traps. Fields 1 and 2 are the whole point of this tier and they are in tension. The spring rule says the plunger loses exactly the rod stretch, surface stroke less field 1, and that rule is a STATIC one: it knows nothing about a rod string that is still moving when the polished rod turns round. The wave equation says the plunger travels FURTHER than the spring rule allows, by about a tenth of what the spring rule itself predicts on this well, and the whole of that difference is inertial OVERTRAVEL. Report field 2 from the MARCH. A learner who reports the spring rule''s answer there loses field 2 and keeps field 1, which is exactly the split this tier is cut to produce. Fields 3 and 4 are what the design REPORTS, not necessarily what the march computed, and this tier is graded on the report. Field 5 is built from the WORK PER CYCLE that the card encloses times the speed, so it carries the same provenance as fields 3 and 4 and no separate assumption. Field 6 is not the rated displacement: it is the pump constant times the plunger diameter squared times the PLUNGER stroke times the speed times the fillage times the efficiency, and every one of those five factors is stated above. The barrel fillage of 0.853 is worth a second look, because runRodPumpDesign warns on incomplete fillage BELOW 0.85 and this barrel is three thousandths above that line, so a pump fifteen percent short of full raises no warning at all; reading the warning list here and concluding the pump is full is the error the number refuses. Free checks: field 1 divided by the fluid load the plunger sees must return the string''s ELASTIC CONSTANT, which the taper alone fixes and which is the same number for this string under any load. Field 2 must be LESS than the surface stroke the linkage gives, and MORE than that surface stroke less field 1, and those two bounds are the spring rule and the wave answer bracketing each other. Field 3 must EXCEED the buoyed weight of the string, since the polished rod carries the rods plus the fluid at peak. Field 4 must be POSITIVE and must be well below that buoyed weight, and field 3 less field 4 is the load range the gearbox is eventually sized on. Field 6 divided by the fillage, then by the efficiency, then by field 2, then by 11.4, then by 1.5 squared must return the package''s own pump constant of 0.11657115597735782, and if it returns it after dividing by the SURFACE stroke instead you have reported the swept volume of a pump this well does not have. And field 6 must be smaller than the rated displacement of the same pump, necessarily, since fillage and efficiency are both below one and the plunger travels less than the polished rod.',
  jsonb_build_array(
    jsonb_build_object('key','design_static_stretch_in', 'label','Static stretch',            'unit','in',   'expected',18.3430100033456,   'tol',0.0000037),
    jsonb_build_object('key','design_plunger_stroke_in', 'label','Plunger stroke',            'unit','in',   'expected',113.87084766145045, 'tol',0.000023),
    jsonb_build_object('key','design_pprl_lb',           'label','Peak polished rod load',    'unit','lbf',  'expected',22844.62490875651,  'tol',0.0046),
    jsonb_build_object('key','design_mprl_lb',           'label','Minimum polished rod load', 'unit','lbf',  'expected',3184.8310729370005, 'tol',0.00064),
    jsonb_build_object('key','design_prhp_hp',           'label','Polished rod horsepower',   'unit','hp',   'expected',22.54616735384647,  'tol',0.0000046),
    jsonb_build_object('key','design_produced_bpd',      'label','Production',                'unit','bbl/d','expected',249.76898478544632, 'tol',0.000051)
  )
),
(
  'rodpump', 'advanced', 'expert',
  'the OBAGI-27 gearbox, its Goodman check and the diagnostic re-reading its own card',
  'Read what the card hides',
  'Six values for OBAGI-27 that the design report does not print. THE SAME WELL AGAIN, restated in full. The string is a three-way taper hanging 6085 ft: 1825 ft of 1 in rod, then 2140 ft of 7/8 in, then 2120 ft of 3/4 in, all API GRADE D, in a fluid of SPECIFIC GRAVITY 0.94. The unit is conventional, with a 118.4 in FRONT arm from the saddle bearing to the polished rod, a 71.6 in REAR arm from the saddle bearing to the equalizer, a 92.5 in pitman, a crank pivot 104.3 in behind and 66.9 in below the saddle bearing and a 33.7 in crank radius, closed at 720 crank angles. The pump has a 1.5 IN PLUNGER between 210 PSIA intake and 2680 PSIA discharge, the string is damped at 0.085 OF CRITICAL, the barrel fills 0.853, the pump is 0.86 EFFICIENT and the unit runs at 11.4 SPM, all at the engine''s default marching parameters. NEW HERE: the unit carries a STRUCTURAL UNBALANCE OF 810 LB and its cranks are OFFSET BY 14 DEGREES; it is a C-640D-305-144; the rods are checked on a SERVICE FACTOR OF 0.94; and the Gibbs diagnostic is run at 36 HARMONICS. Report: (1) the COUNTERBALANCE MOMENT the unit needs; (2) the PEAK GEARBOX TORQUE with that counterbalance on it; (3) the COUNTERBALANCE EFFECT at the polished rod; (4) the WORST rod loading as a PERCENTAGE of its modified Goodman allowable; (5) the plunger stroke the DIAGNOSTIC reads back; and (6) the peak PUMP LOAD the diagnostic reads back. Traps. The unbalance and the crank offset are the sharpest thing in this tier. Hand both to the DESIGN routine and its output is bit identical with them and without them, so an engineer who supplies them there and sees the numbers stand has learned nothing about whether they were read. Hand the same two to the BALANCING routine and they move the peak torque by four percent. An input being accepted is not an input being used, and the test is which function you asked. Fields 5 and 6 come from a Gibbs harmonic solver handed the SURFACE half of the card the march itself produced, and it shares no code path with that march, so the gap between what it returns and what the prediction was told to assume is the engine measured against itself rather than against a well. Report what the DIAGNOSTIC returns, not what the design assumed. Field 4 is a percentage of an ALLOWABLE and the allowable carries the 0.94 service factor, which is not a rod property at all: it is the operator''s judgement about the fluid and the corrosion, so the number that decides whether this design is legal is a judgement wearing a decimal point. And field 4 belongs to the WORST section, which you have to find rather than assume, on a string where a different section entirely goes into COMPRESSION at the bottom of the stroke. Free checks: field 3 less the 810 lb of structural unbalance, multiplied by the torque factor a quarter turn past the bottom of the stroke, must return field 1 exactly, because that is the crank angle at which the counterweight moment peaks and balancing the rod load there is the whole definition. Dividing field 1 by the 118.4 in front arm instead is the standard error and the module header names it: the torque factor at the quarter turn is not an arm length, and the arm understates the effect by roughly a factor of two, so field 3 must come out MORE THAN TWICE field 1 over 118.4. Field 2 must be BELOW the peak torque the same card gives with the structural unbalance set to zero, because 810 lb of unbalance is torque the crank does not have to carry, and it must be below the unit''s own 640,000 in-lb rating with room to spare. Field 3 must be LARGER than a counterbalance effect built by averaging the two polished rod loads, and the size of that excess is what a real crank geometry costs over a symmetry assumption. Field 4 must be ABOVE 100, which is why this design is refused, and it must be the LARGEST of the three sections'' loadings rather than the top section''s by default. Field 5 must EXCEED the plunger stroke the prediction returned, and field 6 must EXCEED the fluid load the design assumed, both for the same reason: a finite harmonic reconstruction of a card does not return the assumptions the card was built from, and both gaps run the same way. And the unit must be inside every rating it has, at roughly three quarters of its structural capacity, seven eighths of its gearbox and five sixths of its stroke, so the only thing wrong with this design is the rods.',
  jsonb_build_array(
    jsonb_build_object('key','balance_moment_in_lb',      'label','Counterbalance moment',      'unit','in-lb',  'expected',724684.4494328515,  'tol',0.13),
    jsonb_build_object('key','balance_peak_torque_in_lb', 'label','Peak gearbox torque',        'unit','in-lb',  'expected',572027.7632886502,  'tol',0.12),
    jsonb_build_object('key','balance_cbe_lb',            'label','Counterbalance effect',      'unit','lbf',    'expected',14743.788548099372, 'tol',0.003),
    jsonb_build_object('key','stress_worst_loading_pct',  'label','Worst rod loading',          'unit','percent','expected',104.60464569678913, 'tol',0.000021),
    jsonb_build_object('key','diag_plunger_stroke_in',    'label','Diagnosed plunger stroke',   'unit','in',     'expected',113.95219388403339, 'tol',0.000023),
    jsonb_build_object('key','diag_pump_load_max_lb',     'label','Diagnosed peak pump load',   'unit','lbf',    'expected',4606.367684104658,  'tol',0.00098)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_pd4_rodpump_go_live.sql.
