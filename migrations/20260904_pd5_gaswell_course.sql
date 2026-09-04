-- ============================================================================
-- PD5: Gas Well Performance joins the catalog, the FIFTH Production &
-- Artificial Lift course.
--
-- Catalog row (module 'production'; path_order 34; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- WHAT THE COURSE IS ABOUT, AND WHAT IT DELIBERATELY DOES NOT COVER. PD1
-- already owns the gas inflow, the tubing curve and the node, including the
-- record that gasPwfAtRate reads a SAMPLED gas IPR by linear interpolation and
-- is sparse in rate exactly where the curve is steepest. None of that is
-- repeated here. PD5 is the DELIQUIFICATION course, so its subject is the
-- liquid the gas cannot carry: the droplet balance, the critical velocity, the
-- critical rate, WHERE DOWN THE STRING it bites first, and what a smaller
-- tubing string or a plunger does about it.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) A WELL CAN PASS AT THE GAUGE AND LOAD AT THE SHOE. The capstone well
--   runs a ratio of 1.2552 at the wellhead, comfortably unloaded where the
--   operator can see it, and 0.9253 at the shoe, a margin of -7.474 percent.
--   The profile crosses one between 4,210 ft (1.0711) and 6,315 ft (0.9956),
--   so liquid is falling back over the bottom third of the string while every
--   surface number says the well is healthy. That is why loadingProfile exists
--   rather than a single loadingAt at the wellhead, and it is the whole reason
--   the Professional tier is a DESIGN tier rather than a second point check.
--
--   (2) A CORRELATION IS CHOSEN ONCE, AT THE WELLHEAD, AND THEN USED
--   EVERYWHERE. recommendCorrelation takes ONE argument, a wellhead pressure,
--   and switches at COLEMAN_PRESSURE_LIMIT_PSIA of 1000 psia. The capstone
--   wellhead is 999.62 psia, so the well is recommended COLEMAN, the
--   unadjusted equation, by four tenths of a psi on a surface gauge. The
--   module's own loadingProfile header says the CONTROLLING station is the
--   shoe, and the shoe is at 2,261.5 psia, 2.26 times the pressure limit
--   Coleman was fitted under. Turner's adjustment is exactly 1.2 on every
--   critical rate, and on this well that is the difference between a 2.750 in
--   workover string and a 2.323 in one. The message also calls whatever
--   pressure it is handed a "wellhead", so fed the controlling station it
--   prints "At 2262 psia wellhead this well is above the range Coleman
--   studied". A course could teach the switch as a threshold. What it must
--   teach is that the threshold is read at a station that is not the one the
--   answer is used at.
--
--   (3) A SIZING RETURNS ONE ANSWER AND SILENTLY DISCARDS THE REST.
--   sizeTubingForRate walks the candidate list largest bore first and returns
--   `largestUnloaded`, the first row that clears, plus every row it rejected.
--   On the capstone well the rejected 2.922 in candidate misses by 2.99
--   percent, at a ratio of 0.9701, and never appears in `largestUnloaded`. A
--   pick that clears in its second decimal and a pick that clears twice over
--   are the same field, and only the rows say which one you have. The function
--   also gained an `ok` key at engines 5733550, precisely because
--   `largestUnloaded: null` had been carrying two different meanings with one
--   value.
--
--   (4) THE PLUNGER SCREEN IS BLESSED BY THE RULE OF THUMB AND REFUSED BY THE
--   PHYSICS. screenPlungerLift returns pressureOk TRUE, 745 psia of casing
--   against what the lift needs, and glrOk FALSE. The 400 scf/bbl per 1000 ft
--   screening heuristic asks for 3,368 scf/bbl, which this well beats twice
--   over, while the force balance asks for 2.763 times that, which the well
--   misses. `ruleOfThumbAgrees` comes back false and the engine SURFACES the
--   disagreement instead of resolving it. The capstone is built to land inside
--   it.
--
-- WHAT THE ORACLE RECORDS, AND WHAT IT DOES NOT.
-- tools/validation/production/oracle_gaswell.py records NO defects at all. Its
-- docstring is entirely independence discipline: SI throughout with no gc
-- anywhere, the rate constant built from the molar volume rather than from
-- 86400 Tsc/psc, plunger lift in pascals and metres. It emits goldens and says
-- nothing about where the engine and the oracle part company. The GATE does,
-- in one comment, and that one is graded here:
--
--   (a) THE 0.433 SEAM, GRADED. The slug hydrostatic term carries the
--   platform's ROUNDED PSI_PER_FT_SG of 0.433 where the oracle uses rho g
--   exactly. On this well that is 78.232275 psi against 78.327582, a gap of
--   0.095307 psi and 0.1218 percent, which is 1,162 TIMES the graded field's
--   tolerance. It is the one graded field in this course a learner can reach
--   with a hand calculation, and doing it with the textbook water gradient
--   FAILS. The gate loosens exactly that one assertion to 5e-3 relative and
--   pins the constant. Recorded, not fixed, because the constant is shared.
--
--   (b) THE GAS REQUIREMENT FALLS AS THE WELL GETS WEAKER, WHICH IS THE WRONG
--   DIRECTION. gasPerCycleScf is evaluated between the casing pressure and the
--   pressure still needed at the top of the rise, so when the casing cannot
--   reach the requirement the average runs BACKWARDS and the number keeps
--   coming. The same well at 745, 288 and 96 psia of casing needs 9,306.7,
--   5,362.8 and 3,705.9 scf/bbl, and at BOTH 288 and 96 psia glrOk turns TRUE
--   on a well whose casing cannot move the plunger at all. A screen that gets
--   easier to pass as the well dies is a fails-open, and it is recorded rather
--   than fixed because plungerLift feeds a live Suite application.
--
--   (c) maxSlugLengthFt CLAMPS TO ZERO INSTEAD OF REFUSING, so the same well
--   at 96 psia of casing reports that the longest slug it can lift is 0 ft,
--   which reads as an answer and is actually a refusal wearing a number.
--
--   (d) recommendCorrelation PRINTS THE THRESHOLD IT JUST CLEARED, because the
--   reason string is formatted with Math.round: at 999.62 psia it reads "At
--   1000 psia wellhead". Same family as the PD3 ESP toFixed(0) finding, and
--   the sweep that produced both is engines PRs #113 and #114.
--
--   (e) TWO MOLECULAR WEIGHTS OF AIR IN ONE DOMAIN. gasWellLoading.AIR_MW is
--   28.9647 and gasProperties.AIR_MW is 28.9625 against the same R of 10.7316,
--   so one gas density computed two ways differs by 76 parts per million.
--   gasWellLoading also speaks degR while gasProperties speaks degF, which is
--   why this wave converts at the DOOR with the engine's own toRankine rather
--   than carrying a hand-typed 459.67 anywhere.
--
-- WHY THE Z-FACTOR IS IMPORTED RATHER THAN ASSUMED. gasWellLoading needs a z
-- at every station and does not own one. The golden hands it a FLAT 0.9 at
-- every pressure from 300 to 2,500 psia, which is fine for an oracle checking
-- droplet algebra and wrong for a well whose pressure triples down the string.
-- This capstone takes z from gasProperties.naturalGasZ (Sutton
-- pseudo-criticals, Dranchuk and Abou-Kassem), which is a return value of an
-- engine function in the same package, and grades it at the wellhead so the
-- learner has to go and GET one rather than assume one. The resulting z runs
-- 0.8436 to 0.8677 and is nowhere near 0.9.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: IMIRINGI-7, a watering-out
-- gas well on 3-1/2 in 9.3 lb/ft tubing to 8,420 ft, flowing 2,551.3 Mscf/d
-- against 999.62 psia at the wellhead and making 373.8 bbl/d of formation
-- brine with it. Every condition differs from the ones gaswell_cases.json
-- publishes, which is the DR2 rule. Four things were tuned into it and every
-- one is verified from printed values rather than asserted: it passes at the
-- gauge and loads at the shoe; the wellhead sits 0.38 psi BELOW the
-- correlation threshold; the correlation decides the workover, 2.750 in under
-- Coleman against 2.323 in under Turner; and the plunger fallback is blessed
-- by the heuristic and refused by the physics.
--
-- ONE MORE THING THE EXPERT TIER ENDS ON, AND `feasible` NEVER LOOKS AT IT. A
-- day of cycling this plunger delivers 18.796 bbl/d against the 373.8 bbl/d
-- the well makes, a factor of 19.9. Every pressure and gas test in the screen
-- can pass on an installation that cannot carry the well's liquid at all,
-- because nothing in the screen compares the cycle's delivery to the well's
-- production.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. Every tier's
-- prompt restates the gas, the liquids, the string, the rate and the traverse
-- from the raw conditions, and NO tier's prompt states a number another tier
-- is graded on, nor any quantity another tier's answer can be recovered from
-- by one multiplication or one division. The loading RATIOS were drafted into
-- two prompts and removed from both, because a ratio times a stated rate is a
-- critical rate that another tier is graded on. The go-live re-reads the
-- STORED prompts and refuses on regression.
--
-- THE GOLDENSWEEP RAN BEFORE A LESSON WAS WRITTEN, against the goldens AND the
-- teaching digest: eighteen graded values against 2489 published numbers, ZERO
-- collisions and ZERO integer notes.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd5_gaswell_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/gaswell.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('gaswell', 'Gas Well Performance', 'production', 34, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'gaswell', 'beginner', 'associate',
  'IMIRINGI-7 read at the wellhead gauge alone, where every number says the well is healthy',
  'Read one station',
  'Six values from ONE STATION of IMIRINGI-7, and that station is the WELLHEAD, because it is the gauge an operator actually reads. THE GAS has a specific gravity of 0.702. THE WELLHEAD is at 999.62 PSIA and 96.4 degF. THE STRING is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, and the well is flowing 2,551.3 MSCF/D. THE WELL MAKES TWO LIQUIDS and you are asked about both: formation brine at an interfacial tension of 66.4 DYNE/CM and a density of 68.35 LBM/FT3, and a light condensate at 24.6 DYNE/CM and 43.8 LBM/FT3. Take the compressibility factor from the package''s own natural gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and NOT from a flat assumption. The critical rate asked for is the one the recommended correlation gives on the BRINE, which is the heavier of the two liquids and therefore the one that governs. What the well does further down the hole is the Professional tier''s and is not needed here. Report: (1) the Z FACTOR at the wellhead; (2) the GAS DENSITY there; (3) the TERMINAL VELOCITY of a BRINE droplet; (4) the TERMINAL VELOCITY of a CONDENSATE droplet; (5) the CRITICAL RATE; and (6) the ACTUAL VELOCITY the well is making. Traps. A flat z of 0.9 is what the published fixture uses and it is wrong here by more than five percent, and z is in the denominator of BOTH the gas density and the actual velocity, so assuming one instead of computing one moves four of these six answers. The two modules in this chain disagree about temperature: one speaks degR and one speaks degF, so convert at the DOOR with the package''s own converter rather than adding a hand-typed 459.67 somewhere in the middle, which is where that error hides. They also carry two different molecular weights of air, 28.9647 and 28.9625, against the same gas constant, so a density computed through the other module differs in the fifth figure; report the one the LOADING module gives. Fields 3 and 4 are not ordered the way intuition suggests: the heavier liquid makes the FASTER droplet, because the terminal velocity rises with the density difference and the brine is heavier than the condensate by more than its higher surface tension gives back. Field 5 is a RATE and field 6 is a VELOCITY, and they are not two spellings of the same check; a rate carries the flow area and the standard conditions and a velocity does not. And the correlation is chosen for you, by a rule that reads THIS station and no other, so do not adjust anything by 20 percent here. Free checks: field 1 must sit between 0.84 and 0.87, well below the 0.9 the fixture assumes. Field 2 must equal the gas gravity times the air molecular weight times the pressure, over the z, the gas constant and the absolute temperature, so doubling the pressure at fixed z and temperature must double it. Field 3 divided by field 4 must equal the fourth root of the ratio of the two liquids'' surface tensions times density differences, since everything else in the droplet balance cancels between two liquids at one station. Field 5 divided by field 6 must be a pure function of the flow area, the pressure, the z and the temperature, and not of either liquid. And field 6 must EXCEED field 3, which is the whole reason a learner who stops at the wellhead concludes this well is unloaded, and is the finding the Professional tier overturns.',
  jsonb_build_array(
    jsonb_build_object('key','wh_z_dak',                       'label','Wellhead z factor',                'unit','fraction','expected',0.847685225820759,  'tol',0.000001),
    jsonb_build_object('key','wh_gas_density_lbmft3',          'label','Wellhead gas density',             'unit','lbm/ft3', 'expected',4.018024007155638,  'tol',0.0000042),
    jsonb_build_object('key','wh_terminal_velocity_brine_fts', 'label','Brine droplet terminal velocity',  'unit','ft/s',    'expected',6.42693606609917,   'tol',0.0000068),
    jsonb_build_object('key','wh_terminal_velocity_cond_fts',  'label','Condensate droplet terminal velocity','unit','ft/s', 'expected',4.446421214633396,  'tol',0.0000047),
    jsonb_build_object('key','wh_critical_rate_mscfd',         'label','Wellhead critical rate',           'unit','Mscf/d',  'expected',2032.5884737584674, 'tol',0.0021),
    jsonb_build_object('key','wh_actual_velocity_fts',         'label','Wellhead actual velocity',         'unit','ft/s',    'expected',8.067074175186569,  'tol',0.0000083)
  )
),
(
  'gaswell', 'intermediate', 'professional',
  'the IMIRINGI-7 traverse, its controlling station and the two remedies a design has to choose between',
  'Take the well down the hole',
  'Six values that turn IMIRINGI-7 from a gauge reading into a design. THE SAME WELL, restated in full so nothing has to be carried across from another tier. The gas has a specific gravity of 0.702. The string is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, to 8,420 FT, flowing 2,551.3 MSCF/D and making 373.8 BBL/D of formation brine at 66.4 DYNE/CM and 68.35 LBM/FT3. NEW HERE, and it is the point of the tier: THE FLOWING TRAVERSE, five measured stations, top first, as depth in ft with pressure in psia and temperature in degF. 0 and 999.62 and 96.4; 2,105 and 1,236.4 and 119.6; 4,210 and 1,503.9 and 142.8; 6,315 and 1,836.2 and 166.0; 8,420 and 2,261.5 and 189.2. Take z from the package''s own natural gas correlation at EVERY station, and convert temperature at the door. The correlation is the one the package recommends for this well, chosen by its own rule from the WELLHEAD pressure and then applied down the whole traverse, which is what the engine does. ALSO NEW: four real workover strings are available, with inside diameters 2.922, 2.750, 2.323 and 1.867 IN, to be sized at the CONTROLLING station for the SAME 2,551.3 Mscf/d; and a plunger installation is proposed on 2.750 IN tubing set at 8,420 FT, lifting a 165 FT slug of 1.095 specific gravity liquid, with a 9.4 LB plunger, a line pressure of 214 PSIA, a casing pressure of 745 PSIA and an average tubing temperature of 142.8 degF, against a well gas-liquid ratio of 6,825 SCF/BBL. Report: (1) the CRITICAL RATE at the 4,210 ft station; (2) the CRITICAL RATE at the controlling station; (3) the ACTUAL VELOCITY at the controlling station; (4) the CRITICAL RATE of the string the sizing CHOOSES; (5) the PRESSURE the plunger lift REQUIRES; and (6) the GAS-LIQUID RATIO a cycle COSTS. Traps. The controlling station is not the one with the worst pressure or the worst temperature, it is the one with the worst MARGIN, and on this well it is the SHOE, which is exactly the station the wellhead gauge cannot see. Fields 1 and 2 are both critical rates on the same traverse and they differ by more than fifteen percent, so quoting "the critical rate" of this well without naming a station has said nothing. Field 3 falls with depth while field 2 rises with it, and that opposite motion is why the margin closes downward: the gas is denser and slower at the bottom and the droplet is harder to carry there. The sizing is run at the CONTROLLING station and not at the wellhead, and running it at the wellhead picks a different string; field 4 is the critical rate OF the chosen string, not the rate the well makes. Fields 5 and 6 are the two halves of a plunger screen that DISAGREE with each other on this well: one of them passes and one of them fails, and a report that gives only the one that passes has hidden the answer. The 400 scf/bbl per 1000 ft screening heuristic is not field 6 and does not agree with it. Free checks: field 1 must sit between the wellhead critical rate and field 2, since the traverse is monotone in pressure. Field 2 must EXCEED the 2,551.3 Mscf/d the well is flowing, which is what makes the shoe the controlling station and the well a loading well. Field 3 must be BELOW the actual velocity at the wellhead, because the same standard rate occupies less volume at higher pressure. Field 4 must be BELOW the 2,551.3 Mscf/d the well makes, since the chosen string is one that UNLOADS, and it must EXCEED the critical rate of every smaller candidate on the list, since a critical rate rises with bore and the pick is the LARGEST bore that clears. If your field 4 exceeds the rate the well makes you have picked a string that does not unload at all. Field 5 must be BELOW the 745 psia of casing available, which is why the pressure half of the screen passes. Field 6 must EXCEED the 6,825 scf/bbl the well makes, which is why the gas half fails, and it must exceed 3,368 scf/bbl, which is what the rule of thumb asks and which this well beats twice over. Those last two together are the disagreement the engine surfaces rather than resolves.',
  jsonb_build_array(
    jsonb_build_object('key','mid_critical_rate_mscfd',        'label','Critical rate at 4210 ft',      'unit','Mscf/d','expected',2381.915240563656,  'tol',0.0025),
    jsonb_build_object('key','shoe_critical_rate_mscfd',       'label','Critical rate at the shoe',     'unit','Mscf/d','expected',2757.4013450247076, 'tol',0.0029),
    jsonb_build_object('key','shoe_actual_velocity_fts',       'label','Actual velocity at the shoe',   'unit','ft/s',  'expected',4.259303791892167,  'tol',0.0000044),
    jsonb_build_object('key','sized_tubing_critical_rate_mscfd','label','Critical rate of the chosen string','unit','Mscf/d','expected',2329.389923010978,'tol',0.0024),
    jsonb_build_object('key','plunger_required_lift_psia',     'label','Plunger lift pressure required','unit','psia',  'expected',333.42363379741835, 'tol',0.00035),
    jsonb_build_object('key','plunger_required_glr_scfbbl',    'label','Gas-liquid ratio a cycle costs','unit','scf/bbl','expected',9306.71712654132,  'tol',0.0098)
  )
),
(
  'gaswell', 'advanced', 'expert',
  'the IMIRINGI-7 answers that the design hides: the other correlation, the discarded candidate and a cycle nobody sized against the well',
  'Read what the design discards',
  'Six values for IMIRINGI-7 that the design report does not print. THE SAME WELL AGAIN, restated in full. The gas has a specific gravity of 0.702. The string is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, to 8,420 FT, flowing 2,551.3 MSCF/D and making 373.8 BBL/D of formation brine at 66.4 DYNE/CM and 68.35 LBM/FT3. The flowing traverse, top first, as depth in ft with pressure in psia and temperature in degF: 0 and 999.62 and 96.4; 2,105 and 1,236.4 and 119.6; 4,210 and 1,503.9 and 142.8; 6,315 and 1,836.2 and 166.0; 8,420 and 2,261.5 and 189.2. Take z from the package''s own natural gas correlation at every station and convert temperature at the door. The four workover candidates are 2.922, 2.750, 2.323 and 1.867 IN, sized at the controlling station for the same 2,551.3 Mscf/d. The plunger installation is on 2.750 IN tubing at 8,420 FT, lifting a 165 FT slug of 1.095 SPECIFIC GRAVITY liquid with a 9.4 LB plunger, against a 214 PSIA line pressure, a 745 PSIA casing pressure and an average tubing temperature of 142.8 degF, on a well gas-liquid ratio of 6,825 SCF/BBL. NEW HERE: the CYCLE is 812 FT/MIN of rise, 1,085 FT/MIN of fall in gas, 186 FT/MIN of fall in liquid, 26 MIN of afterflow and 48 MIN shut in. Report: (1) the TURNER critical VELOCITY at the controlling station; (2) the CRITICAL RATE of the candidate the sizing REJECTED; (3) the SLUG HYDROSTATIC term in the lift pressure; (4) the LONGEST SLUG this well can lift; (5) the GAS a cycle costs, as a volume; and (6) the LIQUID a day of cycling delivers. Traps. Field 1 is the correlation the package did NOT choose, and the choice was made on a wellhead reading four tenths of a psi under a 1000 psia threshold, at a station whose pressure is more than twice that threshold. Turner is the unadjusted equation multiplied by exactly 1.2, so the arithmetic is trivial and the judgement is not: the same rule that picked the correlation would pick the other one if it were read at the station where the answer is used. Field 2 is the candidate that missed, and it missed by under three percent, so it is the difference between a workover with margin and a workover without one; `largestUnloaded` never mentions it and only the rejected rows do. Field 3 is the ONE graded value in this course reachable by hand, and doing it by hand with the textbook water gradient FAILS: this platform carries a ROUNDED pressure gradient per unit of specific gravity, 0.433, where the exact rho g is 0.4335275, and the difference on this slug is over a thousand times the tolerance you are graded to. Use the platform''s constant. Field 4 is a length and it is the number that a clamp destroys on a weaker well: the same routine on a well whose casing cannot move the plunger at all returns zero rather than refusing, so a zero here would be a refusal wearing a number. Field 5 is a VOLUME in scf and is not the gas-liquid ratio; the ratio is what the Professional screen tests and this is what one cycle actually spends. And field 6 is the number no screen in this package ever looks at. Free checks: field 1 must be exactly 1.2 times the critical velocity the recommended correlation gives at the same station, since the adjustment is a constant factor and nothing else about the station changes. Field 2 must EXCEED the 2,551.3 Mscf/d the well makes, which is why it was rejected, and it must exceed the critical rate of the string that was chosen, since the rejected candidate is the LARGER bore. Field 3 must equal 165 ft times 1.095 times 0.433 psi/ft, exactly, and must come out about 0.12 percent BELOW the same product formed with an exact water gradient. Field 4 must EXCEED the 165 ft slug the installation actually lifts, since the installation is feasible on pressure, and the ratio of the two is the margin the pressure half of the screen has. Field 5 divided by the barrels one 165 ft slug of 2.750 in tubing holds must return the gas-liquid ratio the Professional tier computes, which is the identity that ties the two tiers together without either stating the other''s answer. And field 6 must be about a TWENTIETH of the 373.8 bbl/d this well makes, which is the finding the tier ends on: every pressure and gas test in the screen can pass on an installation that cannot carry the well.',
  jsonb_build_array(
    jsonb_build_object('key','shoe_critical_velocity_turner_fts','label','Turner critical velocity at the shoe','unit','ft/s',  'expected',5.524059109300652,  'tol',0.0000058),
    jsonb_build_object('key','rejected_tubing_critical_rate_mscfd','label','Critical rate of the rejected candidate','unit','Mscf/d','expected',2629.8878454771925,'tol',0.0028),
    jsonb_build_object('key','plunger_slug_hydrostatic_psi',   'label','Slug hydrostatic term',       'unit','psi',    'expected',78.232275,          'tol',0.000082),
    jsonb_build_object('key','plunger_max_slug_ft',            'label','Longest liftable slug',       'unit','ft',     'expected',1041.9317152418678, 'tol',0.0011),
    jsonb_build_object('key','plunger_gas_per_cycle_scf',      'label','Gas per cycle',               'unit','scf',    'expected',11281.211169142487, 'tol',0.012),
    jsonb_build_object('key','plunger_liquid_per_day_bbl',     'label','Liquid delivered per day',    'unit','bbl/d',  'expected',18.79621249139511,  'tol',0.00002)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_pd5_gaswell_go_live.sql.
