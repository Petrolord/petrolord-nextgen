-- ============================================================================
-- PD3: ESP Design joins the catalog, the THIRD Production & Artificial Lift
-- course.
--
-- Catalog row (module 'production'; path_order 32; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. An electric submersible pump is a stack of
-- identical stages turned by a motor on the end of a cable, so an ESP design
-- is ONE NUMBER CARRIED THROUGH FOUR TRANSLATIONS: head per stage becomes head
-- required, head required becomes shaft horsepower, shaft horsepower becomes
-- amps, and amps become what has to be present at surface. An error introduced
-- at any one of those translations is invisible at the next. The extraction
-- shipped ESP as three modules with hard seams and each module's outputs are
-- the next module's inputs, so the seams are already a curriculum: the
-- Associate tier owns THE STAGE, the Professional tier owns THE FLUID AND THE
-- LIFT, and the Expert tier owns THE ELECTRICAL SYSTEM AND THE DIAGNOSIS. The
-- shaft power is deliberately placed at the top of the Expert tier rather than
-- the bottom of the Professional one, because it is the hinge: it is the last
-- number espDesign produces and the first number espMotorCable consumes, and a
-- learner who cannot carry it across the seam has not got an installation,
-- only a pump.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) A STAGE CURVE IS A FIT, AND A FIT HAS AN EDGE. Head, efficiency and
--   power per stage all come from cubics through published catalogue points.
--   Inside the data they are the pump. Outside it they are still arithmetic,
--   and the arithmetic keeps answering.
--
--   (2) inRange false IS A FLAG ON THE ANSWER, NOT A REFUSAL, AND NOTHING
--   SNAPS. The golden itself publishes a row 1300 bbl/d past the end of the
--   data, returning 0.052063 ft of head and 0.004291 hp from a cubic that was
--   never asked to stop. On a whole design it is larger: sizePump at 40 Hz,
--   the golden's own lowest tested frequency, returns 926 stages off a stage
--   making 3.9802 ft, 5.58 times the design pump, with three warnings and no
--   refusal. Head does not turn negative until 36.1016 Hz, six and a half Hz
--   BELOW where the answers stopped meaning anything, so the only hard stop in
--   the chain fires long after the failure. Every number degrades smoothly and
--   the boolean is the only field that changes at the boundary, and it carries
--   no DISTANCE: it reads identical 100 bbl/d out and 1300 bbl/d out.
--
--   (3) STAGES ARE INTEGERS, SO A STACK MAKES MORE HEAD THAN IT WAS ASKED FOR.
--   stageCount rounds UP, so the head made exceeds the head required and the
--   two brake powers that follow differ by EXACTLY headMadeFt over tdhFt. That
--   is an identity and not an approximation: it holds to 1e-16 on every case
--   in the course. The margin is bounded by ONE STAGE and not by a percentage,
--   so it GROWS AS THE STACK SHRINKS, from 0.037359 percent on 192 stages to
--   2.567658 percent on 33. A reviewer who calls it rounding noise has missed
--   that the short shallow pump, the one most likely to be waved through, is
--   where it is largest.
--
--   (4) THE SAME FIELD NAME CAN HOLD TWO DIFFERENT QUANTITIES, WHICH IS A
--   HARDER DEFECT THAN A WRONG NUMBER. loadFraction in sizePump is utilisation
--   against the motor's USABLE rating, after the thrust derate. loadFraction
--   in motorCurrent is the ELECTRICAL load fraction against the PLATE, before
--   it. Both are arithmetically right for what they mean. They sit 12.23
--   points apart on the capstone well and they share a name in the same
--   domain. The reader's test is one line: is this one thing computed twice,
--   or two things wearing one label.
--
-- WHAT THE ENGINE ADJUDICATION DECIDED, AND IT IS TEACHING MATERIAL. Engines
-- PR #109 examined five findings from this wave and changed EXACTLY ONE,
-- because every one of these engines feeds a live application and a numeric
-- edit moves a number somebody is looking at today. FIXED: three
-- diagnoseOperation messages printed the threshold they had just failed,
-- because all three ratio messages were formatted with no decimals, so a flag
-- firing strictly below 85 percent printed "85 percent". One decimal place, no
-- arithmetic changed, and that is precisely why it was the one that could be
-- made. RECORDED AND NOT FIXED: two powers for one pump, since the published
-- motor sizing rule takes brake power at the head the stack MAKES while this
-- package builds the amps, the drop and the cable pick on brake power at the
-- head REQUIRED. ADJUDICATED CORRECT: the thrust derate stopping at the module
-- seam, because current at a given shaft load does not move when permissible
-- load is cut; the shared NAME is the defect, not the arithmetic. ADJUDICATED
-- A CONVENTION: two conversions for one gradient, gradientFromDensity dividing
-- by 144 against the rounded PSI_PER_FT_SG of 0.433, 0.076982 percent apart,
-- with the exact route being to derive the specific gravity from the design
-- gradient, which the goldens and the consumers already do. CONFIRMED
-- FAILS-OPEN: selectCable's ampacityOk is TRUE BY CONSTRUCTION, because the
-- shipped CABLE_SIZES carry no ampacity column by design, so the pick collapses
-- to voltage drop alone and the published gate shows 192 A taken down 6 AWG
-- because the drop happens to pass. The honest statement is that the check
-- does not currently check anything, NOT that the cable is wrong. Knowing
-- which defects you are allowed to fix is a professional skill, so the course
-- teaches the adjudication and not just the findings.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: OKARI-9, a gassy,
-- high-water-cut oil well on a variable speed drive, pump set 650 ft above the
-- perforations, on a 562-series stage whose vendor curve was published at 50
-- Hz and which is run at 57. Five things were tuned into it. THE PUMP IS RUN
-- FASTER THAN ITS PUBLISHED CURVE, so the affinity ratio is 1.14 and a learner
-- who multiplies where the engine divides lands 1,098.9 bbl/d away. THE GAS
-- SITS ON THE GAS-HANDLER LINE, one fifth of the intake stream being free gas
-- by volume, halved by a 55 percent separator to just over the 0.10
-- standard-pump limit: the installation is 1.9 points of separator efficiency
-- away from a different piece of equipment on the string. THE STAGE COUNT
-- ROUNDS UP BY ALMOST A WHOLE STAGE, the requirement being 165.009 stages, so
-- the rounding margin is 99.09 percent of one stage and result (3) is visible
-- rather than academic. THE CABLE IS ONE DEGREE FROM THE NEXT CONDUCTOR SIZE,
-- dropping 4.9917 percent against a 5 percent limit at 8,420 ft and 195 degF,
-- with 14 ft of cable or one degree of well temperature moving the pick. AND
-- THE DUTY IS CLOSE ENOUGH TO THE END OF THE CURVE THAT AN ORDINARY TURNDOWN
-- RUNS OFF IT, since slowing the drive raises the equivalent reference rate,
-- so turning this well DOWN pushes the duty UP the curve and it leaves the
-- published range at 42.67 Hz.
--
-- THE STAGE CURVE IS FITTED FROM VENDOR POINTS, AND THAT IS DELIBERATE.
-- espPump's header offers exactly two honest routes to a stage curve, a least
-- squares fit through points off a vendor's published curve or a transparent
-- reference MODEL from four named parameters. The catalog ships four reference
-- models and the goldens publish two of them in full, so quoting one back
-- would make this capstone a lookup of espCatalog.js, which is the single
-- easiest way to ruin it. The capstone takes the vendor route with six of its
-- own points, none of which is one of the golden vendor curve's five.
--
-- A CROSS-TIER LEAK THAT WAS FOUND AND CLOSED, AND THE CLOSE IS THE
-- INTERESTING PART. A capstone prompt has to state every condition that
-- changes an answer, and in a chained domain the thing that changes an
-- Associate answer is often a Professional quantity. The first cut of this
-- course read the Associate tier's fields 4, 5 and 6 at the rate the pump
-- swallows and at a specific gravity derived from the mixture density, which
-- are graded fields 10 and 9 of the PROFESSIONAL tier. Stating them, which the
-- prompt had to do, handed a Professional learner two of their own six answers.
-- dc-wavekit/promptleak.py reported it as an exact hit at 0.00 tolerances, and
-- PD1 and PD2 came back clean, so it was specific to how these fields were cut
-- rather than a property of the programme.
--
-- ROUNDING WAS NEVER AVAILABLE AS A FIX. Field 4 is graded to 1.1e-5 ft, which
-- pins the duty rate harder than field 10's own 2.1e-3 bbl/d does, and any
-- specific gravity precise enough for field 6 fixes the mixture density to
-- within field 9's 2.6e-5 lb/ft3. Any statement precise enough to make the
-- Associate tier gradeable was precise enough to answer the Professional one.
--
-- SO THE TWO WERE DECOUPLED INSTEAD. espPump's own header says the stage layer
-- has nothing about a well in it, and the Associate tier now honours that: it
-- reads the stage at a stated duty of 4,400 bbl/d on a stated 0.82 specific
-- gravity, both conditions of that tier alone and graded nowhere, with the
-- specific gravity given directly rather than derived from a density so that it
-- back-derives nothing either. The design chain is untouched and still runs at
-- the rate and the derived gravity the well actually produces, so graded fields
-- 7 through 18 did not move by a digit. The Professional tier still has to
-- compute its own intake rate, its own mixture density and its own stage head
-- from the produced stream, which is the question it was always meant to ask.
--
-- AND THE TRAP GOT SHARPER RATHER THAN SOFTER. At 4,400 bbl/d the affinity
-- ratio divides to 3,859.65 bbl/d, comfortably inside the published data and
-- above the best efficiency rate. Multiplied instead, which is the error the
-- tier exists to catch, it lands at 5,016 bbl/d, 116 bbl/d PAST the end of the
-- data, where the cubic returns a head of 10.65 ft, an efficiency of 0.5254 and
-- inRange false, and refuses nothing. The tier's commonest error now walks
-- straight into the tier's own headline result.
--
-- The go-live carries a standing gate for this: it re-reads the stored prompts
-- and refuses if any tier's prompt contains another tier's graded value.
--
-- THE GOLDENSWEEP RAN BEFORE A LESSON WAS WRITTEN: eighteen graded values
-- against 205 published numbers, ZERO collisions. Measured in TOLERANCES the
-- nearest approach is graded field 2 at 3600.625 bbl/d against a published
-- 3600.0, 0.625 apart on a field whose tolerance is 1.8e-3, so 347 times the
-- tolerance. It is a genuine near miss rather than a lookup: a scanned best
-- efficiency rate on a curve of six points that share none of the golden
-- curve's five rates, landing near a round number the golden happens to
-- publish. Measured in ABSOLUTE terms the nearest is a different field, graded
-- field 5 at 0.70635 against a published efficiency of 0.707727, 0.001377 away
-- and still 2782 tolerances clear. Both readings are recorded because the
-- go-live guard needs the second one to size its windows and the first one to
-- answer whether anything here is a lookup. No graded value here is an integer.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd3_esp_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/esp.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('esp', 'ESP Design', 'production', 32, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'esp', 'beginner', 'associate',
  'OKARI-9, one 562-series stage published at 50 Hz on six vendor points the lessons never use, read at a 57 Hz duty',
  'Read one stage',
  'Six values from ONE STAGE of the OKARI-9 pump, and there is deliberately no well in this question. The vendor published the stage at 50 Hz on six points, given as rate in bbl/d, head in ft per stage and efficiency in PERCENT: 1,750 and 22.6 and 46.5; 2,400 and 21.4 and 60.5; 3,050 and 19.6 and 68.5; 3,700 and 17.0 and 71.0; 4,350 and 13.4 and 66.5; and 4,900 and 9.2 and 55.5. Fit head and efficiency as CUBICS by least squares. The drive runs at 57 Hz, the DUTY is 4,400 bbl/d and the fluid through the stage has a SPECIFIC GRAVITY OF 0.82. Those last two belong to this tier and to nothing else: what an actual well would put through this pump, and how heavy what it produces would be, are the Professional tier''s to work out and are not needed here. Report: (1) the RMSE of the HEAD fit; (2) the rate at the BEST EFFICIENCY POINT; (3) the head per stage there; (4) the head per stage AT THE DUTY; (5) the efficiency at the duty as a FRACTION; and (6) the brake power of ONE STAGE at the duty. Traps. The curve was published at 50 Hz and the drive runs at 57, so the affinity ratio is 1.14 and the duty is mapped BACK onto the published curve by DIVISION before the curve is read, and only then is the head mapped forward by 1.14 SQUARED. Divided, the 4,400 bbl/d duty reads the curve at 3,859.65 bbl/d, comfortably inside the published data. MULTIPLIED, which is the error, it reads at 5,016 bbl/d, 116 bbl/d PAST the 4,900 bbl/d end of that data, and the cubic answers anyway: it hands back a head, an efficiency and a brake power, sets inRange to false and refuses nothing. Getting the direction wrong here does not produce an error, it produces a number. The best efficiency point is SCANNED and not solved: the engine walks 400 intervals across the published 1,750 to 4,900 bbl/d range, which puts its samples 7.875 bbl/d apart, so the scan resolution is part of the question and a finer scan moves field 2. Say scanned, not found. Field 3 is a head on the PUBLISHED 50 Hz curve while field 4 is a head at 57 Hz, so they live in two different frequency frames and subtracting one from the other means nothing. The efficiencies were supplied in PERCENT and field 5 is a fraction. Field 1 is an AGGREGATE over all six points, so one badly transcribed point hides inside it among five good ones, which is exactly the shape of a transcription error and exactly what an RMSE bar cannot catch. Free checks: field 2 must sit strictly inside the 1,750 to 4,900 bbl/d published range and must be 1,750 plus a WHOLE NUMBER of 7.875 bbl/d steps, since that is all a 400 interval scan across that range can return. Field 4 divided by 1.14 squared must come out BELOW field 3, because the duty maps back onto the published curve at a rate ABOVE the best efficiency rate and the head fit falls with rate there: that one relation tests the DIRECTION of the affinity map, which is the thing on this tier easiest to get backwards, and it fails loudly if the ratio was multiplied. Field 4 itself must nonetheless EXCEED field 3, because the 1.14 squared head map more than pays back that fall along the curve. Field 5 must be below the peak of the efficiency fit, since the duty is not the best efficiency point. Field 6 multiplied by field 5 must return the hydraulic power of one stage at the duty, which is formed from the 4,400 bbl/d duty, field 4 and the 0.82 specific gravity alone, and a brake power BELOW that hydraulic power is impossible. And field 1 must be well under one percent of the 13.4 ft spread of the six head points, because a cubic through six points off a smooth curve fits closely; an RMSE anywhere near that spread means the points were entered wrong and not that the pump is unusual.',
  jsonb_build_array(
    jsonb_build_object('key','stage_fit_head_rmse_ft',       'label','Head fit RMSE',              'unit','ft',      'expected',0.02217275280580838,'tol',0.000000011),
    jsonb_build_object('key','stage_bep_q_bpd',              'label','Best efficiency rate',       'unit','bbl/d',   'expected',3600.625,           'tol',0.0018),
    jsonb_build_object('key','stage_bep_head_ft',            'label','Head at the best efficiency point','unit','ft','expected',17.48655357193924, 'tol',0.0000087),
    jsonb_build_object('key','stage_head_at_duty_ft',        'label','Head per stage at the duty', 'unit','ft',      'expected',21.104863057398873,'tol',0.000011),
    jsonb_build_object('key','stage_efficiency_at_duty_frac','label','Efficiency at the duty',     'unit','fraction','expected',0.7063497926211714,'tol',0.00000035),
    jsonb_build_object('key','stage_bhp_per_stage_hp',       'label','Brake power per stage',      'unit','hp',      'expected',0.7947946030979557,'tol',0.0000004)
  )
),
(
  'esp', 'intermediate', 'professional',
  'the OKARI-9 design chain, a gassy high-water-cut well whose stage count rounds up by 99 percent of a whole stage',
  'Turn a well into a stack',
  'Six values that turn OKARI-9 into a head requirement and a stack, on the stage curve the Associate tier fitted. The well makes 1,136 stb/d of oil at a 66 percent water cut and a gas oil ratio of 1,320 scf/stb. At intake conditions the solution gas oil ratio is 415 scf/stb, the oil formation volume factor is 1.285 rb/stb, the water factor is 1.037 rb/stb and the gas factor is 0.00094 rb/scf; the oil weighs 46.7 lb/ft3, the water 65.3 and the free gas 5.4. A rotary separator takes out 55 PERCENT of the free gas. The flowing pressure at the perforations is 1,385 psia, the perforations are at 8,390 ft and the pump is set at 7,740 ft, with a 0.274 psi/ft column standing in the annulus between them. The discharge pressure is 2,552 psia. Take the gradient of what the pump swallows as its DENSITY DIVIDED BY 144, and take the specific gravity as THAT GRADIENT divided by the package''s own 0.433 psi/ft per unit of specific gravity, which is the convention its goldens and its consumers already use. Report: (1) the INTAKE pressure; (2) the gas volume fraction of the produced stream AT INTAKE, before the separator; (3) the DENSITY of the mixture the pump actually swallows; (4) the RATE it swallows; (5) the TOTAL DYNAMIC HEAD; and (6) the head the stack actually MAKES. Traps. The pump sits 650 ft ABOVE the perforations, so the intake pressure is the flowing pressure LESS that annulus column and not plus it, and getting the sign wrong moves every number after it. Field 2 and the fraction that actually goes through the pump are TWO DIFFERENT GAS FRACTIONS in one chain with the separator sitting between them, and the standard pump limit is applied to the second; a report of "the gas volume fraction" that does not say which one has said nothing. The package holds two forms of one water gradient, density over 144 against the rounded 0.433, and they are 0.076982 percent apart, so this capstone states which one to take because taking the other moves field 5. Fields 5 and 6 are not the same quantity: field 5 is what the well REQUIRES and field 6 is what an integer number of stages MAKES, and the stage count rounds UP. Field 4 is an IN SITU rate in bbl/d, neither the 1,136 stb/d of stock tank oil nor the whole produced stream, because the separator vented part of the gas before the pump ever saw it. And the stage has to be RE-READ here. The Associate tier read this same curve at that tier''s own stated duty on its own stated fluid, which is not this well: the head per stage that sizes this stack is the curve read at field 4 and field 3, and carrying the Associate number forward gives the wrong stage count. Free checks: field 1 must equal 1,385 psia less 0.274 psi/ft over the 650 ft between the perforations and the pump, EXACTLY, because nothing else enters it. Field 3 must sit between the 5.4 lb/ft3 free gas and the liquid density of the same stream, and must be HEAVIER than that stream was before the separator, since venting gas can only make what is left behind heavier. Field 4 must be LARGER than the stream''s liquid rate at intake and SMALLER than its total rate, since the separator took out part of the gas and none of the liquid. Field 2 must exceed the gas fraction that goes through the pump, for the same reason. And the pair that carries the whole tier: field 6 must EXCEED field 5, because stages are integers and the count rounds up, while field 6 divided by the head ONE STAGE makes at THIS well''s duty must be a WHOLE NUMBER and field 6 less field 5 must be SMALLER than that one stage head. On this well that margin is 99.09 percent of a whole stage, which is nearly the largest it can be.',
  jsonb_build_array(
    jsonb_build_object('key','intake_pressure_psia',      'label','Intake pressure',              'unit','psia',    'expected',1206.9,             'tol',0.0006),
    jsonb_build_object('key','intake_stream_gvf_frac',    'label','Stream gas volume fraction at intake','unit','fraction','expected',0.20505218502181405,'tol',0.0000001),
    jsonb_build_object('key','pump_mixture_density_lbft3','label','Mixture density through the pump','unit','lb/ft3','expected',52.57683447823375, 'tol',0.000026),
    jsonb_build_object('key','pump_intake_bpd',           'label','Rate through the pump',        'unit','bbl/d',   'expected',4181.40584,         'tol',0.0021),
    jsonb_build_object('key','tdh_ft',                    'label','Total dynamic head',           'unit','ft',      'expected',3684.025520406471,  'tol',0.0018),
    jsonb_build_object('key','design_head_made_ft',       'label','Head the stack makes',         'unit','ft',      'expected',3706.1488182900653, 'tol',0.0019)
  )
),
(
  'esp', 'advanced', 'expert',
  'the OKARI-9 electrical system and its surveillance record, a cable 14 ft from the next conductor size',
  'Carry the number across the seam',
  'Six values for OKARI-9 that the sizing report does not print, on the 166 stage stack the Professional tier sized. The motor is 150 hp on a 2,000 V, 48 A plate at 88.5 percent efficiency, DERATED 12 PERCENT FOR THRUST. The cable is picked out of the shipped AWG candidate table against a 5 percent voltage drop limit, at a LENGTH OF 8,420 FT and a CABLE TEMPERATURE OF 195 degF, on a power factor of 0.87. The electrical chain is built on the shaft power at the head the well REQUIRES, which is what this package does, and NOT on the stack''s brake power at the head it MAKES. A later production survey on the same stack at the same 57 Hz and the same specific gravity reads 3,960 bbl/d at an intake pressure of 1,142 psia and a discharge pressure of 2,344 psia, drawing 41.5 A. Report: (1) the SHAFT POWER; (2) the MOTOR CURRENT; (3) the cable VOLTAGE DROP as a percentage; (4) the kVA that has to be present at SURFACE; (5) the power the CABLE LOSES; and (6) the HEAD RATIO the survey reads against the curve. Traps. The 12 percent thrust derate is stated because it is a real condition of this motor, and it moves the sizing''s own load fraction and fires its overload warning, but it moves NOT ONE of the six numbers above, because the derate stops at the module seam: the sizing measures utilisation against the motor''s USABLE rating while the current measures it against the PLATE, and the two sit 12.2 points apart on this well while sharing a field name. The cable LENGTH of 8,420 ft and the TEMPERATURE of 195 degF are equally part of the question and not scenery, because the conductor the engine picks is 14 ft of cable, or one degree of well temperature, from moving a full size, and fields 3, 4 and 5 all move with it. The pick runs on VOLTAGE DROP ALONE, since the shipped candidate table carries no ampacity column, so the ampacity test passes by construction and is not a check on anything; the honest statement is that the check does not currently check anything, not that the cable is wrong. Building fields 2 through 5 on the OTHER brake power, the one the published motor sizing rule names, raises the current by about a quarter of an amp, pushes the drop PAST the 5 percent limit and buys a whole conductor size, which is why the choice of power is stated here rather than left to the reader. And field 6''s denominator is what the CURVE says the 166 stage stack should make at 3,960 bbl/d, not the design head, on a survey rate that is below the design rate, so the survey is not the design point. Free checks: field 2 divided by the 48 A plate must equal field 1 divided by the 150 hp plate, EXACTLY, because the current is taken as linear in horsepower loading against the plate. Field 1 must sit ABOVE 132 hp, the plate times the derating factor, and BELOW the 150 hp plate: that pair is the whole of the derate finding, since the first is why the sizing calls the motor overloaded and the second is why nothing in the electrical chain does. Field 3 must be below the stated 5 percent limit, since the conductor was chosen to satisfy it, and it must be the LARGEST drop of any candidate that passes, since the choice is the smallest conductor that does. Field 4 divided by the kVA the same current would need at the bare 2,000 V plate must equal one plus field 3 over one hundred, exactly, because the surface has to supply the plate volts PLUS the drop and nothing else. Field 5 must be three times the SQUARE of field 2 times the hot resistance of 8,420 ft of the selected conductor, since that is all a cable loss is, and it must be a small fraction of field 4. And field 6 must come out BELOW 0.85, which is what fires the under curve flag, while field 6 multiplied by the head the curve gives at 3,960 bbl/d must return the head the survey''s own two pressures give across the same gradient the design used.',
  jsonb_build_array(
    jsonb_build_object('key','design_shaft_hp',      'label','Shaft power',            'unit','hp',      'expected',134.57121282585754,'tol',0.000067),
    jsonb_build_object('key','motor_amps_a',         'label','Motor current',          'unit','A',       'expected',43.06278810427442, 'tol',0.000022),
    jsonb_build_object('key','cable_drop_pct',       'label','Cable voltage drop',     'unit','percent', 'expected',4.991671325954014, 'tol',0.0000025),
    jsonb_build_object('key','surface_kva',          'label','Surface kVA',            'unit','kVA',     'expected',156.62014330985684,'tol',0.000078),
    jsonb_build_object('key','cable_loss_kw',        'label','Cable loss',             'unit','kW',      'expected',7.446269485504994, 'tol',0.0000037),
    jsonb_build_object('key','diag_head_ratio_frac', 'label','Survey head ratio',      'unit','fraction','expected',0.8460786902908579,'tol',0.00000042)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_pd3_esp_go_live.sql.
