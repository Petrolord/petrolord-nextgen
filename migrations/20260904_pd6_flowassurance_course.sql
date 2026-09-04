-- ============================================================================
-- PD6: Flow Assurance joins the catalog, the SIXTH Production & Artificial
-- Lift course.
--
-- Catalog row (module 'production'; path_order 35; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- THE ONE SENTENCE THE COURSE IS. A subsea flowline is a race between the heat
-- the fluid carries and the heat the sea takes away, and flow assurance is the
-- business of arriving at the other end still above a temperature somebody
-- else measured in a laboratory.
--
-- WHAT THE COURSE COVERS AND WHAT IT DELIBERATELY DOES NOT. PD1 owns the node
-- and the tubing curve, PD5 owns the liquid a gas well cannot carry, and none
-- of that is repeated. PD6's engines are flowlineThermal.js and
-- hydrateInhibition.js, and between them they carry no hydraulics at all: the
-- pressure column in a profile is a LINEAR INTERPOLATION between two stated
-- endpoints, not a pressure drop, and no function in either file computes one.
-- The course therefore never certifies a pressure, a flow regime or a holdup.
-- It certifies a resistance stack, an arrival, a no-touch time and a dose.
--
-- THE TIERS SPLIT ON A SEAM IN THE CODE RATHER THAN ON A SYLLABUS.
-- layerResistance, burialResistance, overallU and the two mass helpers know
-- nothing about fluid, rate, time or temperature: that is ASSOCIATE, THE
-- RESISTANCE STACK. The four functions where the fluid, the rate and the clock
-- enter are all exponentials of one group: that is PROFESSIONAL, THE LINE IN
-- OPERATION. And the two places where comparing two engine returns against
-- each other exposes a break are both about a boundary somebody else supplied:
-- that is EXPERT, THE BOUNDARY AND THE CHEMICAL.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) THE HYDRATE BOUNDARY IS AN INPUT, AND BOTH ENGINE HEADERS SAY SO.
--   flowlineThermal: hydrate and wax boundaries "are fluid properties, they
--   come from a lab or a compositional flash, and the consumer supplies them".
--   hydrateInhibition: it "does NOT compute where the hydrate boundary is in
--   the first place". Neither engine draws the line every verdict in this
--   course is measured against. The golden file publishes no hydrate
--   temperature at any pressure, because its oracle has none either. So the
--   capstone's two boundary temperatures are stated conditions the way a PVT
--   report is, they are the only two numbers in the capstone for which no
--   competing published value exists, and the go-live refuses any graded degF
--   field that lands near one of them. A course whose answers are all
--   conditional on an emailed number has to say so in module 1 of the lowest
--   tier, and this one does.
--
--   (2) INSULATION AND BURIAL ARE RESISTANCES IN SERIES AND NOTHING MORE
--   COMPLICATED. The stack adds, the biggest term dominates, and the shares
--   are readable off the return. On the capstone build the foam carries 47.746
--   percent, the trench 42.572, the weight coat 8.815, and the two films
--   together under 0.7. That is the whole Associate tier and it is genuinely
--   simple, which is worth saying out loud: not every module in this programme
--   hides something, and a tier that manufactured a paradox here would teach a
--   suspicion the code does not earn.
--
--   (3) THE JOULE-THOMSON TERM IS APPLIED UNDAMPED, AND ON THIS LINE THE
--   VERDICT FLIPS. steadyStateProfile carries the JT drop LINEARLY, jtCoeff x
--   dp x x/L, and subtracts it from an exponential that is not linear. Solve
--   the same balance with a constant JT sink per foot, which is what a linear
--   pressure profile implies, and the offset at the outlet is s Lc (1 -
--   exp(-ntu)) rather than s L, so the correct weighting is
--   (1 - exp(-ntu))/ntu. On the capstone that factor is 0.46766 and the engine
--   applies 2.1383 times the term it should: 10.6875 degF where 4.9981 degF
--   belongs. The arrival moves from 72.9257 degF, which is 1.526 degF OUTSIDE
--   the 71.4 degF hydrate boundary, to 67.2364 degF, which is 4.164 degF
--   INSIDE it. A project reads continuous methanol from day one out of a
--   factor of two.
--
--   AND THE COURSE MUST NOT OVERSTATE IT. Push the same line to three times
--   its length and the engine reports an arrival 9.578 degF BELOW the seabed
--   it is losing heat to, while uForArrivalTemp in the same file refuses that
--   exact temperature as an impossible target. That looks like a proof of
--   absurdity and it is not one. A Joule-Thomson term is a REAL heat sink, and
--   the CORRECTLY DAMPED reading on that same three-times line is 38.313 degF,
--   which is also below the 39.2 degF seabed, by 0.887 degF. The sign is not
--   the defect. THE SIZE IS: the engine's excursion below ambient is 10.8
--   times the correct one. A lesson arguing "below ambient is impossible,
--   therefore the term is wrong" would be right about the term for a reason
--   that is false, and would teach a learner to reject a correct answer the
--   next time one arrives. Expert m01 says it the careful way.
--
--   (4) THE INHIBITOR IS SIZED ONE WAY, CHECKED ANOTHER, AND THE TWO ARE NEVER
--   COMPARED. inhibitionRequirement sizes the dose with the Hammerschmidt
--   INVERSE and then checks it by calling depression, which above 25 weight
--   percent reports NIELSEN-BUCKLIN. On the capstone requirement of 45.8 degF
--   it returns 38.5919 weight percent methanol with ok TRUE, and its own
--   depressionCheck.nielsenBucklinF, in the same returned object, says that
--   concentration delivers 39.2154 degF: 6.5846 degF short of what was asked
--   for and 1.1846 degF short of the BARE subcooling before any margin. The
--   design the engine passes leaves the line inside the hydrate region.
--   Nothing in the function compares the two numbers. The honest
--   Nielsen-Bucklin dose is 42.9843 weight percent, 4.3923 points higher and
--   19.96 percent more chemical every day for the life of the field.
--
-- A FAMILY OF NaN-IS-FALSY FAILS-OPEN, GRADED BY SHARPNESS RATHER THAN LISTED.
--
--   (a) overallU CATCHES A NaN BURIAL RESISTANCE AND DROPS THE TERM RATHER
--   THAN REFUSING. The guard is `if (Number.isFinite(r)) resistances.push`, so
--   a burial depth shallower than half the coated diameter, which is what a
--   depth read to the pipe TOP rather than the centreline looks like on a big
--   weight coat, silently reclassifies a trenched line as an exposed one: U
--   0.9452 against 0.5428, 74.13 percent high, ok TRUE, no note. A term that
--   cannot be computed is not a term worth zero.
--
--   (b) cooldownTime TURNS A NaN MASS INTO A ZERO MASS, AND ONE BAD SLOT FAILS
--   OPEN WHERE TWO REFUSE CORRECTLY. Both slots read as
--   `(contents?.massLbPerFt || 0)`, NaN is falsy, and the only guard is
--   `!(mcp > 0)` on the TOTAL. Both bad refuses properly; ONE bad returns ok
--   true with hours, a time constant and a full station table, no note and no
--   error, short by exactly the dropped slot's share of M Cp. On the capstone
--   line a NaN shell mass gives 1.9546 hr against 2.5446, 23.19 percent low,
--   on the number a platform is evacuated against.
--
--   (b) IS THE SHARPER OF THE TWO AND THE REASON IS STRUCTURAL RATHER THAN
--   NUMERICAL. overallU returns a `resistances` array a caller can COUNT, and
--   five entries where six were expected is detectable. cooldownTime returns
--   `ok, hours, timeConstantHr, stations` and nothing else, so a caller cannot
--   detect the loss from the return at any effort. Expert m02 owns both and
--   ranks them in that order.
--
--   (c) AND inhibitionRequirement WITH NO SUBCOOLING AT ALL ANSWERS "NO
--   INHIBITOR IS NEEDED". The guard is `!(need > 0)` and `!(NaN > 0)` is true,
--   so the branch written for a fluid already outside the hydrate region also
--   catches a caller who supplied nothing. ok true, required false, and a note
--   that prints the literal string "NaN F" to a user. The other two return a
--   wrong number; this one returns a DECISION NOT TO INHIBIT A LINE.
--
-- THE CEILING REFUSES ON CONCENTRATION AND NEVER ON SHORTFALL. The only
-- refusal branch in inhibitionRequirement compares weightPct against maxWtPct.
-- Nothing compares depressionCheck.recommendedF against neededDepressionF.
-- Sweeping methanol, the shortfall grows monotonically with the need, 10.70
-- degF at a 60 degF subcooling to 61.40 degF at 170 degF, and ok is TRUE for
-- every row of that; the one refused row is refused for asking 71.18 weight
-- percent, not for being the worst answer in the table. The ceiling itself is
-- measured in Hammerschmidt coordinates: 70 weight percent methanol is 170.05
-- degF of Hammerschmidt depression against 108.62 degF of Nielsen-Bucklin.
--
-- THREE MORE CONVENTIONS THAT DO NOT TRAVEL, ALL EXPERT m05.
--   overallU reports a `referenceIdIn` that NONE of its three consumers
--   accepts. On the capstone stack the same physics referred to the coated
--   outside diameter is 0.3153 against 0.5428, and that U passed to a profile
--   with the bore returns an arrival 42.808 degF wrong.
--   `leanWtPct` is a WEIGHT percent in the mass gross-up and a VOLUME percent
--   one line later in the density blend. Worth 0.307 percent on the capstone
--   methanol rate and more on a leaner stream.
--   And `reliable` is a print switch on concentration, `weightPct <= 25`, not
--   an accuracy claim: at exactly 25.0 weight percent methanol the two
--   relations are already 2.0293 degF apart, 9.11 percent of the
--   Nielsen-Bucklin value, with the flag still TRUE.
--
-- WHAT THE ORACLE RECORDS, AND WHAT IT NEVER LOOKS AT. oracle_flowassurance.py
-- crosses into SI throughout and computes both inhibitor relations in CELSIUS
-- with the metric constants 1297 and 72, which is the sharpest available check
-- that the field constants fall out of the metric ones. It records exactly one
-- disagreement and records it as a TOLERANCE rather than as a defect:
--
--   THREE VALUES OF ONE CONSTANT. The engine carries Hammerschmidt k = 2335 on
--   all four inhibitors, the oracle reaches 2334.6 through 1297 x 1.8, and
--   129.6 x 18.015 = 2334.744 is the value that makes the module's own two
--   relations meet in the dilute limit. The gate therefore compares
--   Hammerschmidt at 5e-4 relative and Nielsen-Bucklin at 1e-9, five and a
--   half orders of magnitude apart.
--
-- Everything else in this file lives in the oracle's SILENCE. It sets no
-- pressures, so jt is zero in every published case and the whole of result (3)
-- is invisible to it. It never calls inhibitionRequirement, injectionRate or
-- weightPctForDepression, so the whole of result (4) is invisible to it. It
-- checks no share percentage, no reference diameter, neither mass helper, and
-- every branch of cooldownTime except the one ordinary case. Same shape the
-- ESP and rod pump waves found: the oracle's silence was the finding.
--
-- THE CHECK THE MODULE DECLINES TO RUN WOULD RETURN THE IDENTICAL NUMBER.
-- Every inhibitor carries the same k, and the Hammerschmidt inverse fixes a
-- MOLE FRACTION that contains no molecular weight at all, so all four fluids
-- sized to one requirement land on one mole fraction and one Nielsen-Bucklin
-- answer. The capstone methanol and MEG doses, 38.5919 and 54.9037 weight
-- percent, are the same 0.2610963 mole fraction to the last bit a double
-- carries. The oracle publishes a nielsenBucklinF for all four fluids in all
-- 24 golden rows, so the check the module suppresses for the glycols sits in
-- the very file it is validated against.
--
-- THE CAPSTONE IS A LINE THE LESSONS NEVER TOUCH: EGBEMA SOUTH FL-4, a 65,120
-- ft 10 in schedule 40 duplex tieback, foam insulated, concrete weight coated,
-- trenched 5.5 ft to centreline in wet clay, carrying 90,000 lb/hr from a
-- 268.0 degF well to a 39.2 degF seabed. Every condition differs from the ones
-- flowassurance_cases.json publishes, which is the DR2 rule, and taking the
-- pipe onto 22Cr duplex at k 8.67 removed the last number it would otherwise
-- have shared with the golden. Four things were tuned into it and every one is
-- verified from printed engine returns rather than asserted: it arrives 6.524
-- degF OUTSIDE the flowing hydrate boundary and the engine's own JT term puts
-- it 4.164 degF INSIDE; the no-touch time is under three hours on a time
-- constant of nearly fourteen; the coatings that carry 56.561 percent of the
-- resistance carry none of the mass the cooldown uses; and the inhibitor
-- design passes its own check while missing its own target.
--
-- ONE THING THE PROFESSIONAL TIER ENDS ON THAT NO GUARD IN THE FILE CATCHES.
-- The boundary that applies once a line packs in is the SHUT-IN one, 79.6 degF
-- here, and the capstone arrives at 77.9239 degF, already below it. Ask
-- cooldownTime for the time to reach that boundary and it returns MINUS 0.5844
-- hr with ok true, no note, and a 33 row station table that runs backwards
-- through negative time and warms up as it goes. The function guards the start
-- against ambient and the target against ambient and never compares the two
-- with each other.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. Every tier's
-- prompt restates the pipe, the coatings, the films and the trench from the
-- raw dimensions, and NO tier's prompt states a number another tier is graded
-- on, nor any quantity another tier's answer can be recovered from by one
-- multiplication or one division. The heat-loss-only arrival was drafted into
-- the Expert prompt as the starting point for the Joule-Thomson subtraction
-- and removed, because an arrival minus a stated 10.6875 degF is one
-- subtraction from a Professional graded value. The two tiers are tied
-- together by an IDENTITY the Expert free checks state in words instead, which
-- is the same device PD5 used on its cycle gas. The go-live re-reads the
-- STORED prompts and refuses on regression.
--
-- THE GOLDENSWEEP RAN BEFORE THIS FILE WAS WRITTEN, against the goldens AND
-- the teaching digest: eighteen graded values against 1078 published numbers,
-- ZERO collisions inside any go-live window and no approach closer than 196
-- times a field's own grading tolerance.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd6_flowassurance_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/flowassurance.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('flowassurance', 'Flow Assurance', 'production', 35, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'flowassurance', 'beginner', 'associate',
  'EGBEMA SOUTH FL-4 as a stack of resistances, before anything flows down it',
  'Build the stack',
  'Six values for the stack of EGBEMA SOUTH FL-4, and every one of them exists before a drop flows down the line. THE PIPE is 10 in schedule 40 line pipe in 22Cr duplex: bore 10.02 IN, steel outside diameter 10.75 IN, thermal conductivity 8.67 BTU/(HR FT DEGF), which is about a third of carbon steel and is a property of this alloy rather than a catalog default. THE INSULATION is polyurethane foam over the steel out to 12.25 IN, at the manufacturer''s measured 0.062 BTU/(HR FT DEGF) and NOT at the catalog value for polyurethane. THE WEIGHT COAT is concrete over the foam out to 17.25 IN, at this coat''s tested 0.88 BTU/(HR FT DEGF). THE FILMS are a measured 285 BTU/(HR FT2 DEGF) on the flowing bore and a measured 64 BTU/(HR FT2 DEGF) on the outside, this being a sheltered channel between still water and a swept seabed. THE TRENCH is 5.5 FT to the pipe CENTRELINE in backfill of 1.45 BTU/(HR FT DEGF). Refer every overall coefficient to the BORE, 10.02 IN. THE STEEL weighs 487.3 LBM/FT3 and THE FLUID THE LINE HOLDS weighs 47.5 LBM/FT3. Report: (1) the overall U of the BARE build, the steel wall and the two films and nothing else; (2) the overall U with the FOAM added; (3) the overall U of the FULL BURIED build, steel, foam, weight coat and trench; (4) the FOAM''S SHARE of the total thermal resistance of that full buried build, as a percentage; (5) the STEEL MASS per foot of line; and (6) the CONTENTS MASS per foot of line. What the line does once a fluid is moving through it belongs to the Professional tier and is not needed here. Traps. The three builds do not share an outside film: that film is referred to the OUTERMOST diameter of whatever build it sits on, so it is taken on 10.75 in for field 1, on 12.25 in for field 2 and on 17.25 in for field 3, and reusing one of them for all three is the commonest way to build the second and third numbers wrongly out of the first. The REFERENCE diameter, by contrast, is the bore in all three, which is what makes them comparable at all; the same physics referred to the coated outside diameter is dimensionally consistent and is a different number, and a coefficient quoted without its reference has said nothing. The trench depth is to the CENTRELINE and it enters through the conduction shape factor for a cylinder in a semi infinite medium, an inverse hyperbolic cosine of twice the depth over the diameter, taken on the OUTERMOST 17.25 in and not on the bore and not on the steel; a depth read to the top of the pipe instead is shallower by half the coated diameter and on a coat this thick that is not a rounding. Field 4 is a share of a RESISTANCE and not a share of a coefficient, because resistances in series add and coefficients do not. Field 5 is an annulus between 10.75 and 10.02 in and field 6 is a full circle of 10.02 in, and neither may ride the module''s own 490 lbm/ft3 steel default, because this alloy''s density is stated. Do not compute a heat capacity anywhere in this tier: a mass is not a thermal mass and the tier above is where they meet. Free checks: field 1 must exceed field 2 by more than FORTY times, and field 2 must exceed field 3, because adding a resistance in series can only ever make a coefficient smaller. Field 4 must come out UNDER 50, so the foam is the largest single term in the stack and is still not a majority of it, the trench being a real second rather than an afterthought. Field 3 multiplied by pi and by the bore expressed in feet must be the exact reciprocal of the total thermal resistance of the buried stack, which is what referring a coefficient to the bore means. Field 4 must then equal one hundred times the foam''s own resistance, the natural log of 12.25 over 10.75 divided by two pi times 0.062, divided by that same total. And field 5 divided by field 6 must exceed one, since on this line the steel outweighs the fluid it carries, and it must equal a pure ratio of the two areas times the ratio of the two densities and nothing else.',
  jsonb_build_array(
    jsonb_build_object('key','u_bare_btu_hr_ft2_f',      'label','Bare build overall U',            'unit','Btu/(hr ft2 degF)','expected',46.60031626151484,   'tol',0.000023),
    jsonb_build_object('key','u_insulated_btu_hr_ft2_f', 'label','Insulated build overall U',       'unit','Btu/(hr ft2 degF)','expected',1.1120313853280657,  'tol',0.00000056),
    jsonb_build_object('key','u_buried_btu_hr_ft2_f',    'label','Full buried build overall U',     'unit','Btu/(hr ft2 degF)','expected',0.5428232788182644,  'tol',0.00000027),
    jsonb_build_object('key','foam_resistance_share_pct','label','Foam share of the resistance stack','unit','percent',       'expected',47.745620329885455,  'tol',0.000024),
    jsonb_build_object('key','steel_mass_lbm_per_ft',    'label','Steel mass per foot',             'unit','lbm/ft',          'expected',40.29796889486093,   'tol',0.00002),
    jsonb_build_object('key','contents_mass_lbm_per_ft', 'label','Contents mass per foot',          'unit','lbm/ft',          'expected',26.01096363755233,   'tol',0.000013)
  )
),
(
  'flowassurance', 'intermediate', 'professional',
  'the EGBEMA SOUTH FL-4 duty, what it arrives at and what it has left after a shutdown',
  'Run the line',
  'Six values that turn the EGBEMA SOUTH FL-4 stack into a line in operation. THE SAME LINE, restated in full so nothing has to be carried across from another tier. THE PIPE is 10 in schedule 40 in 22Cr duplex: bore 10.02 IN, steel outside diameter 10.75 IN, conductivity 8.67 BTU/(HR FT DEGF). Polyurethane foam out to 12.25 IN at 0.062 BTU/(HR FT DEGF). Concrete weight coat out to 17.25 IN at 0.88 BTU/(HR FT DEGF). Films of 285 BTU/(HR FT2 DEGF) on the bore and 64 BTU/(HR FT2 DEGF) outside. Trench 5.5 FT to the pipe CENTRELINE in backfill of 1.45 BTU/(HR FT DEGF). Refer the overall coefficient to the BORE, 10.02 IN, and build it yourself: it is not given to you here. NEW HERE, and it is the point of the tier: THE DUTY. The line runs 65,120 FT from the well to the manifold. The fluid enters at 268.0 DEGF and the seabed is at 39.2 DEGF. The mass rate is 90,000 LB/HR at a heat capacity of 0.58 BTU/(LB DEGF). Take the steady state profile on 41 STATIONS. ALSO NEW: an insulation retrofit is being priced against a TARGET ARRIVAL of 96.5 DEGF on the same length, the same rate and the same fluid; and a SHUTDOWN is to be assessed, with the line holding a fluid of 47.5 LBM/FT3 at that same 0.58 BTU/(LB DEGF), a steel shell of 487.3 LBM/FT3 at 0.113 BTU/(LB DEGF), the cooldown taken on 33 STATIONS, and the fluid''s HYDRATE TEMPERATURE AT FLOWING CONDITIONS measured in a laboratory at 71.4 DEGF. Report: (1) the RELAXATION LENGTH; (2) the ARRIVAL TEMPERATURE with heat loss to the sea and nothing else; (3) the NUMBER OF TRANSFER UNITS; (4) the OVERALL U the line would NEED to arrive at the 96.5 degF target; (5) the NO-TOUCH TIME from the arrival temperature down to the 71.4 degF boundary; and (6) the COOLDOWN TIME CONSTANT. Traps. All six are rearrangements of ONE exponential, so a tier answered as six formulas has been answered three formulas too many. The relaxation length takes the heat transfer area on the BORE, the same diameter the coefficient is referred to, because a coefficient and an area have to be a matched pair and mixing two references is the commonest mistake in this calculation. Field 3 is a pure number, the line measured in relaxation lengths; it is not a length and not a temperature. Field 4 is the coefficient the line would NEED and not the one it has, and it must come out BELOW the one it has, since arriving warmer means losing less. The shutdown starts from the ARRIVAL temperature and not from the inlet, and the function offers exactly TWO mass slots, the contents and the steel shell: the foam and the weight coat are not in that thermal mass at all, which is worth noticing rather than working around here. Field 6 is a time constant and field 5 is a time to reach a stated target, and they are not two spellings of one quantity. And the 71.4 degF is a LABORATORY number supplied with the fluid: neither engine in this course computes a hydrate boundary, both headers say so, and the whole verdict rests on a number that arrived in an email. Free checks: field 3 must equal 65,120 divided by field 1, exactly. Field 2 must equal 39.2 plus 228.8 times the exponential of minus field 3. Field 2 must sit ABOVE the 71.4 degF flowing boundary, which is the whole reason this line is insulated and coated as it is, and BELOW the 79.6 degF the same fluid makes once the line packs in on a shutdown, which is why a stopped line is a different question from a flowing one and not a milder version of it. Field 4 must be positive and below the coefficient you built. Field 5 must equal field 6 times the natural log of field 2 less 39.2 over 71.4 less 39.2, which is the same exponential read in time instead of in distance. And field 5 must come out UNDER 3 hr while field 6 is OVER 13 hr: a short no-touch time on a long time constant is not a line that cools quickly, it is a line that started close to the boundary, and the ratio of the two being over five is what that looks like in numbers.',
  jsonb_build_array(
    jsonb_build_object('key','relaxation_length_ft',             'label','Relaxation length',            'unit','ft',           'expected',36658.58444365967,   'tol',0.018),
    jsonb_build_object('key','arrival_temp_f',                   'label','Arrival temperature',          'unit','degF',         'expected',77.92388912738244,   'tol',0.000039),
    jsonb_build_object('key','ntu_dimensionless',                'label','Number of transfer units',     'unit','dimensionless','expected',1.7763915598018383,  'tol',0.00000089),
    jsonb_build_object('key','u_for_target_arrival_btu_hr_ft2_f','label','Overall U for the target arrival','unit','Btu/(hr ft2 degF)','expected',0.42308503617338816,'tol',0.00000021),
    jsonb_build_object('key','cooldown_hours_hr',                'label','No-touch time',                'unit','hr',           'expected',2.544607096144167,   'tol',0.0000013),
    jsonb_build_object('key','cooldown_time_constant_hr',        'label','Cooldown time constant',       'unit','hr',           'expected',13.792637472200887,  'tol',0.0000069)
  )
),
(
  'flowassurance', 'advanced', 'expert',
  'the EGBEMA SOUTH FL-4 answers that rest on a boundary neither engine draws',
  'Cross the boundary',
  'Six values for EGBEMA SOUTH FL-4 that decide whether it needs chemical for the life of the field. THE SAME LINE AGAIN, restated in full. THE PIPE is 10 in schedule 40 in 22Cr duplex: bore 10.02 IN, steel outside diameter 10.75 IN, conductivity 8.67 BTU/(HR FT DEGF). Polyurethane foam out to 12.25 IN at 0.062 BTU/(HR FT DEGF). Concrete weight coat out to 17.25 IN at 0.88 BTU/(HR FT DEGF). Films of 285 BTU/(HR FT2 DEGF) on the bore and 64 BTU/(HR FT2 DEGF) outside. Trench 5.5 FT to the pipe CENTRELINE in backfill of 1.45 BTU/(HR FT DEGF). Refer the coefficient to the BORE, 10.02 IN, and build it yourself. THE DUTY is 65,120 FT, 268.0 DEGF in, a 39.2 DEGF seabed, 90,000 LB/HR at a heat capacity of 0.58 BTU/(LB DEGF), on 41 STATIONS. NEW HERE: THE PRESSURES AND THE CHEMISTRY. The line enters at 2,140 PSIA and arrives at 1,285 PSIA, and the fluid''s JOULE-THOMSON COEFFICIENT from the equation of state is 0.0125 DEGF PER PSI. The fluid''s HYDRATE TEMPERATURE, measured in a laboratory and supplied with it, is 71.4 DEGF at the flowing arrival pressure and 79.6 DEGF once the line packs in to 2,900 PSIA on a shutdown. Against a 39.2 degF seabed that shut-in boundary is 40.4 DEGF of subcooling, and the operator asks for a 5.4 DEGF SAFETY MARGIN on top of it. The line makes 780 BBL/D of produced water at 8.62 LB/GAL. Two continuous injection designs are to be compared: METHANOL, molecular weight 32.04, liquid density 6.6 LB/GAL, delivered LEAN at 95.5 WEIGHT PERCENT; and MONOETHYLENE GLYCOL, molecular weight 62.07, liquid density 9.3 LB/GAL, delivered LEAN at 88.5 WEIGHT PERCENT. The Hammerschmidt constant the package carries on every inhibitor is 2335. Report: (1) the ARRIVAL TEMPERATURE THE ENGINE RETURNS with the Joule-Thomson term switched on; (2) the METHANOL CONCENTRATION the requirement is sized to; (3) the DEPRESSION that concentration actually delivers according to the CHECK the same call runs on it; (4) the METHANOL INJECTION RATE; (5) the MEG CONCENTRATION the same requirement is sized to; and (6) the MEG INJECTION RATE. Traps. Field 1 is what the ENGINE returns and not what the energy balance gives: the pressure term is carried LINEARLY down the line and subtracted whole from an exponential that is not linear, and the difference between those two statements is the largest single finding in this course. Report the engine''s number, then know what it is worth. Fields 2 and 5 are sized with the HAMMERSCHMIDT INVERSE, and field 3 is what the check inside the SAME returned object says field 2 delivers, and that check is not the relation field 2 was sized with: above 25 weight percent it reports Nielsen-Bucklin instead. Answering field 3 with the sizing relation''s own answer is the exact mistake this tier exists to expose. Field 3 is a DEPRESSION in degF and not a concentration. The two rates are a mass balance on the aqueous phase, grossed up for the water the lean stream brings with it and divided by a blended stream density, and neither may leave the produced water at the function''s own fresh water default, because this water''s density is stated. Fields 2 and 5 are not in the ratio of the two molecular weights, and neither is the ratio of the two rates. And nothing in this tier computes 71.4 or 79.6: they are laboratory numbers stated with the fluid, both engine headers refuse the job in as many words, and every verdict below is conditional on them. Free checks: field 1 must land BELOW the 71.4 degF flowing boundary, which is the verdict this tier is about, and must still sit well above the 39.2 degF seabed on a line of this length. Field 1 must equal the heat loss only arrival, which the Professional tier computes and which is not stated here, less exactly 0.0125 times 855 degF, with NOTHING weighting that term: that missing weighting is the finding, and on this line it is worth more than five degF and it changes the sign of the answer. Field 2 must exceed 25 weight percent, which is why the check switches relation, and must fall below 70, which is why the call does not refuse: the only refusal branch in the function tests a concentration and never a shortfall. Field 2 fed back through Hammerschmidt at 2335 must return 45.8 degF exactly, which is how you know the sizing relation and the checking relation are two different relations. Field 3 must then come out BELOW 45.8 degF, the depression that was asked for, and BELOW 40.4 degF, the bare subcooling before any margin at all: those two together are the finding, because the design the engine passes with ok true leaves this line inside its own hydrate region. Fields 2 and 5 must land on the SAME mole fraction of inhibitor in the aqueous phase, to every figure a double carries, since the Hammerschmidt inverse fixes a mole fraction that contains no molecular weight; Nielsen-Bucklin on either would therefore return field 3, and the package declines to run it on the glycol. And field 6 divided by field 4 must come out near one and a half, which is what heavier per degree of depression costs in tankage, pumps and a bigger umbilical.',
  jsonb_build_array(
    jsonb_build_object('key','jt_arrival_temp_f',         'label','Arrival temperature with the pressure term','unit','degF',  'expected',67.23638912738244,   'tol',0.000034),
    jsonb_build_object('key','meoh_design_wt_pct',        'label','Methanol design concentration',   'unit','weight percent','expected',38.591932741992494,  'tol',0.000019),
    jsonb_build_object('key','meoh_delivered_depression_f','label','Depression the design dose delivers','unit','degF',       'expected',39.215361739692504,  'tol',0.00002),
    jsonb_build_object('key','meoh_injection_rate_bpd',   'label','Methanol injection rate',         'unit','bbl/d',         'expected',661.2794981380277,   'tol',0.00033),
    jsonb_build_object('key','meg_design_wt_pct',         'label','MEG design concentration',        'unit','weight percent','expected',54.903679280374725,  'tol',0.000027),
    jsonb_build_object('key','meg_injection_rate_bpd',    'label','MEG injection rate',              'unit','bbl/d',         'expected',1003.0053214651645,  'tol',0.0005)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_pd6_flowassurance_go_live.sql.
