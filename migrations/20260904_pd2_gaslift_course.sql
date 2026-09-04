-- ============================================================================
-- PD2: Gas Lift Design joins the catalog, the SECOND Production & Artificial
-- Lift course and the first one that has a prerequisite.
--
-- Catalog row (module 'production'; path_order 31; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. A gas lift design is a race between two pressures
-- down the same hole. The injection gas in the annulus gets heavier as it goes
-- down, the kill fluid it is pushing out gets lighter as gas replaces it, and
-- every valve in the string exists to hand the well from one depth to a deeper
-- one until the gas can reach as far as its pressure will carry it. The
-- Associate tier owns the GAS COLUMN, which is the layer every depth and every
-- dome charge stands on. The Professional tier owns the VALVES, which is where
-- the mandrels go and what the shop dials into them. The Expert tier owns the
-- UNLOADING SEQUENCE AND THE POINT OF INJECTION, which is what the design
-- sheet does not show and what breaks it.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) THE INJECTION LINE IS A REAL GAS COLUMN AND ITS WEIGHT IS NOT A
--   CONSTANT, BUT THE DIRECTION IT MOVES IN IS A RACE AND NOT A STORY. The
--   gradient is density over 144 with density proportional to p over z T, so
--   compression pushes it up and the linear geotherm pushes it down. On all
--   three published columns the LOCAL gradient FALLS with depth. Hold the same
--   column at its wellhead temperature and it RISES, by 26.0, 43.4 and 10.1
--   percent, which is the isothermal control that separates the two effects.
--   The flat 0.02 psi/ft rule of thumb is therefore wrong in BOTH directions
--   depending on the column: 1.99 times the rule on the 1414.7 psia column and
--   0.67 times it on the 614.7 psia one. The course brief asserted a single
--   direction in its first draft and the digest build caught it. A plausible
--   physical account that names only one of two competing effects is the
--   commonest way to be confidently wrong, and the cure is a controlled
--   comparison rather than a better story.
--
--   (2) SPACING IS A RECURSION, NOT A FORMULA. Valve 1 sits where the
--   injection line first overcomes a full column of kill fluid. Every valve
--   after it sits where the injection line, decremented by the surface drop
--   per valve, still beats the transfer pressure at the valve above by the
--   transfer differential. Change the decrement and every depth BELOW the
--   change moves while every depth above it stays put. That is why a design is
--   a string and not a list of valves, and why the two spacing conventions are
--   one recursion with a different decrement rather than two methods.
--
--   (3) THE MOST CONSEQUENTIAL BOOLEAN IN THE OUTPUT SITS ON A KNIFE EDGE.
--   Whether the string MULTIPOINTS, meaning two valves inject at once, is the
--   single most consequential thing designGasLift emits, and on the capstone
--   the deciding stage hangs on 0.14199570250571014 psi of closing margin on a
--   1268.3 psia system. The margin moves about 1.14 psi per psi of decrement,
--   so the verdict flips between 49.02 and 49.03 psi per valve: one hundredth
--   of a psi per valve of a design decision no installation on earth controls
--   to. A boolean that consequential is not a detail of the output, it IS the
--   output.
--
--   AND IT MOVES AS A STEP FUNCTION, NOT AS A SLOPE. The verdict reaches the
--   design gas rate ONLY through selectPort, so it moves when the target
--   crosses a catalogue step and not before. On the published knife edge case
--   the stage 5 margin is frozen from 400 through 1400 Mscf/d and then jumps
--   at 1600 with an extra multipointing stage. A coarse sweep steps over the
--   flip and a fine one finds nothing between the steps and feels like
--   evidence. A sweep's resolution has to match the MECHANISM and not the axis.
--
--   (4) THE DEEPEST INJECTION POINT IS FOUND BY CHORD, AND THE CHORD CANNOT
--   SEE ITS OWN ERROR. The crossing is located on straight lines drawn between
--   whatever rows the caller tabulated, and BOTH SIDES of the residual come off
--   the same pair of chords. So the residual the function reports at its own
--   answer is a statement that the two chords agree with each other and nothing
--   more. On the published case the shipped engine reports 4.6770e-3 psi
--   against a true 1.58211e-1 psi, 33.83 times larger, with the depth
--   1.317711139 ft off; on the wave's teaching traverse the same mechanism
--   gives 60.420814470 ft of error at a ratio of 678.26 that holds near 670
--   down the whole refinement. Worse, the reported residual is ANTI-CORRELATED
--   with accuracy across a column refinement, so an engineer tightening their
--   acceptance tolerance on that number selects a worse answer.
--
-- FOUR DEFECTS THE EXTRACTION'S ORACLE RECORDS, AND WHERE THIS COURSE STANDS
-- ON EACH. (a) THE UNLOADING VERDICT WAS UNGATED WHILE LOOKING GATED.
-- oracle_gaslift.py's unloading() walked the valves and appended an empty
-- open-valve list for every stage WITHOUT EVER EVALUATING THE CONDITION, and
-- no unloading key was written into the goldens at all, so result (3) above
-- had no independent check behind it. Coverage that is not coverage is worse
-- than no coverage, because no coverage is visible and false coverage is not.
-- Closed by engines PR #110, which derives the verdict from the published
-- closing rule at valve depth off a forward RK4 column where the engine
-- inverts a coarser column at surface, and which found a production operated
-- disagreement on its first run. EXPOSED HERE AS THE CENTRE OF THE EXPERT
-- CAPSTONE: graded fields 13 and 14 are the two closing pressures the verdict
-- turns on. (b) FOR A PPO VALVE THE CLOSING TEST IS A CATEGORY ERROR.
-- closingSurfacePressurePsia converts a dome that balances against the TUBING
-- into a CASING surface pressure, and the same swapped line gives a NEGATIVE
-- spread on every valve of the published PPO case. One root cause, two
-- symptoms, and the louder one went unreported. Pinned, not fixed, because the
-- engine is consumed by a live Suite app. NOT EXPOSED IN THE GRADED FIELDS:
-- this capstone is IPO, because a PPO capstone has no knife edge at all. (c)
-- THE CHORD, which is result (4) and which IS exposed: graded fields 15 and 17
-- are the same crossing at two tabulations. (d) THE TARGET-DEPTH MANDREL IS
-- EXEMPT FROM minSpacingFt, on two of the four published cases, and the oracle
-- orders the same two branches the same way so the goldens record agreement
-- where neither side ever reached the test. NOT EXPOSED HERE: this capstone
-- stops on minSpacing, the branch that does check.
--
-- AND ONE HONEST NEGATIVE RESULT, WHICH IS THE HARDER THING TO TEACH. The gas
-- column march is essentially exact. At the packer, 20 steps and 2000 steps
-- differ by 0.0036 psi, and the injection pressure curve carries a chord bias
-- of 0.00032 psi at 64 samples. PD1's Cullender and Smith truncation has NO
-- counterpart here. A programme that only ever reports defects is not
-- measuring anything, and a learner who leaves believing every numerical
-- method is suspect has learned the wrong lesson. The skill is telling the two
-- cases apart, and the way you tell them apart is by refining and watching.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: OKPARA-9, a 9,640 ft oil
-- well on continuous gas lift, kicked off at 1,268.3 psia on a 0.682 gravity
-- gas, unloading a 0.468 psi/ft kill fluid against a 186.4 psia wellhead,
-- spaced on a 48.9 psi surface decrement into a 0.99 in2 bellows family. It is
-- deliberately an uncomfortable design. The string MULTIPOINTS IN THE MIDDLE
-- AND NOT AT THE ENDS, because the surface-referred spreads run 54.371,
-- 42.341, 49.042, 37.565, 28.171 and 20.409 psi against a 48.9 psi decrement,
-- so valve 1 stays open at stage 2, valve 2 closes cleanly at stage 3 and
-- valve 3 stays open again at stage 4. A verdict that is not monotone in depth
-- is not what a spacing sheet leads anyone to expect, and the reason is the
-- PORT LADDER stepping in the middle of the string: the 9/32 in port passes
-- 2029.973885223026 Mscf/d against a 2,062 Mscf/d target, short by 32.03
-- Mscf/d, so valve 3 steps up to 11/32 in, the port to bellows ratio goes from
-- 0.0628 to 0.0937, the spread goes up by half and the valve that was going to
-- close no longer does. Thirty-two Mscf/d of design rate, 1.6 percent, decides
-- whether this string injects at two depths.
--
-- AND THE DESIGN WAS TARGETED ON THE WRONG PRESSURE. Spacing stops on
-- minSpacing with the bottom mandrel at 8730.375110751653 ft while the deepest
-- point at which the KICKOFF pressure beats the flowing traverse is graded
-- field 15, a 409.15 ft shortfall the engine does warn about. But the well
-- does not run on the kickoff pressure. Handed the 1,178.3 psia operating
-- pressure the same function puts the injection point 615.87 ft SHALLOWER, so
-- the bottom mandrel is 206.72 ft BELOW the depth the operating pressure can
-- actually reach, and the engine says nothing at all about that one. Graded
-- field 18 is the operating line read at the kickoff-based injection point,
-- and it comes out 55.46 psi BELOW the tubing at the same depth.
--
-- THE FLOWING TRAVERSE IS AN INJECTED TABLE, AND THAT IS THE ENGINE'S OWN
-- CHOICE. Its header is explicit that it does not solve the well's inflow or
-- its multiphase outflow, and that the traverse used to locate the deepest
-- injection point is passed in as a depth-pressure table so the caller can
-- build it from a validated nodal model rather than this module inventing a
-- gradient. The goldens follow the same discipline with a labelled nine-row
-- table. This capstone supplies its own analytic gradient, rising linearly
-- from 0.062 psi/ft at surface to 0.229 psi/ft at the packer, which is the
-- shape a real gas-lifted traverse has, light where the injected gas is and
-- heavy below it. It is sampled at TWO resolutions and BOTH are graded,
-- because the gap between them is defect (c).
--
-- THE GOLDENSWEEP RAN BEFORE A LESSON WAS WRITTEN: eighteen graded values
-- against 638 published numbers, ZERO collisions. The nearest approach
-- anywhere in the sweep is graded field 9 at 1313.645346439994 psia against a
-- published 1313.798877081367, 0.1535 apart on a field whose tolerance is
-- 6.6e-4, so 233 times the tolerance. No graded value here is an integer.
-- Every capstone CONDITION also differs from the goldens' own, checked line by
-- line; the only exceptions are the three MODE selections (IPO, surfaceClose,
-- bottomOrifice true), for which the engine offers exactly two choices each
-- and the goldens publish both, so "differ from the golden" is not available.
-- Nothing follows from a mode alone.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd2_gaslift_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/gaslift.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('gaslift', 'Gas Lift Design', 'production', 31, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'gaslift', 'beginner', 'associate',
  'OKPARA-9, the injection gas column of a 9,640 ft continuous gas lift well the lessons never use',
  'Weigh the gas on its way down',
  'Six values from the OKPARA-9 injection gas column, the layer every depth and every dome charge in this design stands on. The injection gas has a specific gravity of 0.682. The well is 9,640 ft TVD to the packer, and its temperature runs LINEARLY from 103.5 degF at the wellhead to 236.5 degF at a REFERENCE DEPTH of 10,250 ft, which is deeper than the packer, so the packer is not at 236.5 degF. The casing is kicked off at 1,268.3 psia. March the gas column in 96 STEPS. The well is dead and full of a 0.468 psi/ft kill fluid standing against a 186.4 psia unloading wellhead pressure. Report: (1) the gas compressibility factor at the kickoff pressure and the wellhead temperature; (2) the static gas gradient there; (3) the injection pressure at the packer; (4) the SURFACE pressure that would put exactly 1,585 psia at the packer; (5) the depth of the TOP valve; and (6) the injection pressure at 5,375 ft read off the injection pressure curve cut at 64 SAMPLES. Traps. The temperature profile is anchored at 10,250 ft and not at the packer, so a column marched with 236.5 degF at 9,640 ft comes out too light and every pressure below is wrong with it. The step count is stated at 96 and it is part of the question rather than part of the answer: the engine defaults to 40 and hardcodes 20 inside its own spacing and valve routines, and on a column this deep a 20 step march does not reproduce field 3 to the tolerance this capstone grades at. Fields 3 and 4 are the SAME march run in two directions and neither is an algebraic rearrangement of the other, because the compressibility factor depends on the very pressure being solved for. Field 6 is read off a SAMPLED curve by straight line between its own samples on a 150.625 ft grid, not off a fresh march to 5,375 ft, and the two differ in the seventh figure. The 0.02 psi/ft rule of thumb is not this gas: field 2 comes out more than half again heavier than it. Free checks: field 3 must EXCEED the 1,268.3 psia kickoff, since a static gas column only gains pressure with depth, and field 6 must sit strictly between the two. Field 4 must fall BELOW 1,268.3 psia for exactly the same reason that field 3 comes out ABOVE 1,585 psia: those are one statement read two ways, and if one of them holds while the other does not, one of the two marches is wrong. Field 1 must be below one. Field 2 multiplied by 9,640 ft and added to the kickoff pressure must OVERSTATE field 3, because the local gradient FALLS with depth on this geotherm, the temperature effect beating the compression effect. And reading the injection line at field 5 must return 186.4 psia plus 0.468 psi/ft times field 5, to within a thousandth of a psi, because that equality is the definition of the top valve depth and nothing else is in it.',
  jsonb_build_array(
    jsonb_build_object('key','gas_z_at_kickoff',                   'label','Gas z at kickoff',            'unit','dimensionless','expected',0.8321323612578156,  'tol',0.00000042),
    jsonb_build_object('key','gas_gradient_at_kickoff_psi_per_ft', 'label','Gas gradient at kickoff',     'unit','psi/ft',       'expected',0.03459262518232471, 'tol',0.000000017),
    jsonb_build_object('key','inj_column_at_packer_psia',          'label','Injection pressure at packer','unit','psia',         'expected',1589.4628665427595,  'tol',0.00079),
    jsonb_build_object('key','inj_surface_for_1585psia_psia',      'label','Surface pressure for 1585 psia at packer','unit','psia','expected',1264.8156205292921,'tol',0.00063),
    jsonb_build_object('key','top_valve_depth_ft',                 'label','Top valve depth',             'unit','ft TVD',       'expected',2494.025220656208,   'tol',0.0012),
    jsonb_build_object('key','inj_curve_at_5375ft_psia',           'label','Injection curve at 5375 ft',  'unit','psia',         'expected',1450.0362742923005,  'tol',0.00073)
  )
),
(
  'gaslift', 'intermediate', 'professional',
  'the OKPARA-9 installation, an IPO string whose port ladder steps in the middle and whose spacing stops on its own minimum',
  'Set the string',
  'Six values from the OKPARA-9 installation, spaced and set on the gas column the Associate tier established. The design is IPO on the SURFACE CLOSE method: a kickoff pressure of 1,268.3 psia, an operating pressure of 1,178.3 psia, a surface decrement of 48.9 psi per valve, a transfer differential of 58.5 psi, a 0.468 psi/ft kill fluid, a 0.094 psi/ft unloading gradient, a 186.4 psia unloading wellhead, a minimum spacing of 335 ft, at most 11 valves, a 0.99 in2 bellows, a port catalogue of 0.28125, 0.34375, 0.40625, 0.46875 and 0.5625 in, a design gas rate of 2,062 Mscf/d, and a bottom orifice of 0.34375 in. The target depth handed to the spacing recursion is deeper than anything this well reaches: the recursion stops on the 335 ft minimum at the seventh mandrel, so the target never binds and no answer on this tier depends on it. Report: (1) the depth of VALVE 2; (2) the depth of VALVE 4; (3) valve 2''s dome pressure AT VALVE TEMPERATURE; (4) valve 2''s TEST RACK opening pressure; (5) valve 4''s SPREAD; and (6) what valve 4''s port PASSES at the design conditions. Traps. Spacing is a recursion and not a formula, so field 2 carries three applications of the decrement and a single slip at valve 2 moves it; change the decrement and every depth below the change moves while every depth above it stays put. Fields 3 and 4 are the same valve read at TWO TEMPERATURES: the dome is charged cold in the shop at 60 degF and read hot at valve 2''s depth, and the test rack opening also divides the cold dome by one minus the port to bellows ratio. Reporting field 4 at valve temperature, or field 3 at 60 degF, swaps the two. Field 6 must be read off the port the engine PICKED and not off the smallest port in the catalogue: selectPort takes the smallest catalogue port that passes 2,062 Mscf/d at the unloading transfer differential, and the ladder steps between valve 2 and valve 3, so valves 1 and 2 carry the 0.28125 in port while valves 3 through 6 carry 0.34375 in. Reading valve 4 on the small port is the commonest error on this tier. The flow through valve 4 is SUBCRITICAL, so the choked form of the Thornhill and Craver expression does not apply there. And a spread is a PRESSURE FALL across the valve, which on an IPO valve is positive; a negative spread is not a valve property, it is the injection and production sides entered the wrong way round, which is what this package does on a production operated string. Free checks: the depths must INCREASE while the INCREMENTS DECREASE, because the injection line walks down 48.9 psi a valve while the kill fluid gradient does not change, so field 1 less the top valve depth must exceed HALF of field 2 less field 1, the latter spanning two increments and the former one. Field 2 must be deeper than field 1, and both must sit between the top valve depth and the 9,640 ft packer. Field 3 must EXCEED 1,219.4 psia, the second step of the decrement ladder down from 1,268.3, because the dome balances against the injection pressure at valve 2''s DEPTH and not at surface, and it must sit below that injection pressure at depth. Field 4 must come out below field 3 and below 1,219.4 psia. Field 5 must be positive. And field 6 must EXCEED the 2,062 Mscf/d design rate, because selectPort returns nothing that does not pass it.',
  jsonb_build_array(
    jsonb_build_object('key','valve2_depth_ft',              'label','Valve 2 depth',                'unit','ft TVD','expected',4379.112457100502,  'tol',0.0022),
    jsonb_build_object('key','valve4_depth_ft',              'label','Valve 4 depth',                'unit','ft TVD','expected',6997.151937824368,  'tol',0.0035),
    jsonb_build_object('key','valve2_dome_at_temp_psia',     'label','Valve 2 dome at valve temperature','unit','psia','expected',1313.645346439994,'tol',0.00066),
    jsonb_build_object('key','valve2_test_rack_opening_psia','label','Valve 2 test rack opening',    'unit','psia',  'expected',1143.8633940736581, 'tol',0.00057),
    jsonb_build_object('key','valve4_spread_psi',            'label','Valve 4 spread',               'unit','psi',   'expected',45.22330508618348,  'tol',0.000023),
    jsonb_build_object('key','valve4_throughput_mscfd',      'label','Valve 4 throughput',           'unit','Mscf/d','expected',2892.4892215328155, 'tol',0.0014)
  )
),
(
  'gaslift', 'advanced', 'expert',
  'the OKPARA-9 unloading sequence and its deepest injection point, a string whose stage 4 verdict hangs on 0.142 psi',
  'Find out where the gas actually gets in',
  'Six values for OKPARA-9, on the installation the Professional tier set. The lifted well''s flowing traverse is 224.6 psia plus 0.062 psi/ft times the depth plus 0.167 psi/ft times the depth SQUARED over twice 9,640 ft, which is a column whose local gradient rises linearly from 0.062 psi/ft at surface to 0.229 psi/ft at the packer. The transfer differential is 58.5 psi and the injection pressure curve is cut at 64 samples. Report: (1) valve 1''s CLOSING SURFACE pressure; (2) valve 3''s closing surface pressure; (3) the DEEPEST POINT OF GAS INJECTION with the traverse tabulated at 401 EVENLY SPACED ROWS from surface to the packer, which puts the rows 24.1 ft apart; (4) the injection pressure at that crossing; (5) the SAME crossing on the SAME traverse tabulated at 7 ROWS, 1,606.667 ft apart, which is the spacing a designer reading a gradient curve actually hands it; and (6) the OPERATING injection line, driven from 1,178.3 psia rather than from the 1,268.3 psia kickoff, read at the depth of field 3. Traps. Fields 3 and 5 are the same well, the same function and the same traverse, and the ONLY thing that differs between them is how finely the traverse was tabulated, which is why the row count is stated in the question rather than left to the answer. The crossing is located on straight lines drawn between the rows the caller supplied, and BOTH SIDES of the residual come off the same pair of chords, so the residual the function reports at its own answer is a statement that the two chords agree with each other and nothing more: on the 7 row tabulation that residual is about a twentieth of a psi, comfortably inside the half psi the engine''s own gate allows, while the depth is tens of feet out. A small residual is not evidence here, and tightening an acceptance tolerance on it selects a worse answer rather than a better one. Field 3 was solved on the KICKOFF pressure. The well does not run on the kickoff pressure, and field 6 is what the line the well actually runs on reads at that same depth. Field 6 is read off the design''s OWN injection pressure curve, which designGasLift cuts on its internal default of 41 samples and which the caller cannot change, so it is not the 64 sample curve the Associate tier read. Fields 1 and 2 are CLOSING surface pressures, obtained by taking a dome pressure that balances at DEPTH back up the gas column to surface; they are not the valves'' opening surface pressures, which are just the steps of the decrement ladder. Free checks: field 1 must exceed field 2, since valve 1 is the shallower valve sitting on the higher step of the ladder, and field 1 must fall below the 1,268.3 psia that opened valve 1 in the first place. Field 2 must come out BELOW 1,121.6 psia, the fourth step of the ladder, by LESS THAN ONE PSI: that margin is the entire verdict of this string, because 1,121.6 psia is the casing pressure when the point of injection transfers to valve 4 and valve 3 is still open at it. Field 4 less the 58.5 psi transfer differential must return the flowing traverse evaluated at field 3, to within a thousandth of a psi, because that equality is what defines the crossing. Field 5 must be SHALLOWER than field 3, because a chord drawn across a traverse that steepens with depth lies above the true curve and cuts the crossing short, and the two must sit less than a hundred feet apart on a 9,640 ft well. And field 6 must come out below field 4, since the same column is driven from a surface pressure 90 psi lower, and it must ALSO come out below the flowing traverse at that depth, which is the finding: at the pressure this well actually runs on, gas cannot enter at the depth the design was targeted at.',
  jsonb_build_array(
    jsonb_build_object('key','valve1_closing_surface_psia',       'label','Valve 1 closing surface pressure','unit','psia','expected',1213.9289535870623,'tol',0.00061),
    jsonb_build_object('key','valve3_closing_surface_psia',       'label','Valve 3 closing surface pressure','unit','psia','expected',1121.4580042974942,'tol',0.00056),
    jsonb_build_object('key','injection_point_depth_ft',          'label','Injection point depth, fine tabulation','unit','ft TVD','expected',9139.524034378974,'tol',0.0046),
    jsonb_build_object('key','injection_point_pinj_psia',         'label','Injection pressure at the crossing','unit','psia','expected',1573.281485043544,'tol',0.00079),
    jsonb_build_object('key','injection_point_depth_coarse_ft',   'label','Injection point depth, coarse tabulation','unit','ft TVD','expected',9113.00140054971,'tol',0.0046),
    jsonb_build_object('key','operating_inj_at_injection_pt_psia','label','Operating injection line at the crossing','unit','psia','expected',1459.3240954891764,'tol',0.00073)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_pd2_gaslift_go_live.sql.
