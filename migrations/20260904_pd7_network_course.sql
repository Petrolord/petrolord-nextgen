-- ============================================================================
-- PD7: Production Networks joins the catalog, the SEVENTH Production &
-- Artificial Lift course.
--
-- Catalog row (module 'production'; path_order 36; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- THE ONE SENTENCE THE COURSE IS. A gathering system has one answer and every
-- well is in it, so the rate a well makes is not a property of the well but of
-- the whole network solved at once, and the only thing that can hand you that
-- answer is an iteration whose report on itself is the weakest part of the
-- module.
--
-- WHAT THE COURSE COVERS AND WHAT IT DELIBERATELY DOES NOT. PD1 owns the node
-- and the tubing curve, PD6 owns the heat a flowline loses to the sea, and
-- none of that is repeated. PD7's engines are networkSolve.js and
-- pipeSchedule.js. Between them they model no hydraulics of their own: the
-- branch relation and the well inflow are CALLBACKS the consumer supplies, and
-- the module header is explicit that this is the point, because "the topology,
-- the Newton solve and the conservation laws have nothing to do with
-- petroleum, and can therefore be checked EXACTLY". Section 24 of the teaching
-- digest is the list of what that leaves out and every tier ends on it:
-- temperature anywhere, so no thermal coupling and no cooldown; slugging,
-- holdup and every transient, because every equation here is steady state;
-- compressibility along a branch, since mass in equals mass out on every
-- branch by construction; and any equipment between nodes at all, so no pump,
-- no compressor and no choke as a node kind. Three node kinds are the whole
-- vocabulary. Anything a real gathering system has that is not a well, a
-- junction or a sink has to be written as a branch relation or left out.
--
-- THE TIERS SPLIT ON A SEAM IN THE CODE RATHER THAN ON A SYLLABUS, AND THE
-- SEAM IS EXACTLY WHERE THE ITERATION STARTS AND STOPS. pipeSchedule.js is a
-- published table and two closed forms; buildNetwork validates and indexes and
-- never computes a pressure; and one well on its own flowline against the
-- separator is a two node problem a single-well studio already gives you. That
-- is ASSOCIATE, THE LINE AND THE WELL ON ITS OWN, and the tier ends where the
-- second well arrives. solveNetwork is the only function in either module that
-- iterates, and everything that needs the whole system at once and nothing
-- that needs to look at how the iteration reported itself is PROFESSIONAL, THE
-- SOLVE. And the part that exists only because the answer came out of an
-- iteration, what the solve pinned, what its residual could not see, what it
-- does when it cannot converge and what it says when it fails, is EXPERT,
-- WHAT THE SOLVE HIDES.
--
-- FIVE RESULTS THE COURSE IS BUILT ON, EVERY ONE RUN AGAINST THE ENGINE.
--
--   (1) A LINEAR NETWORK HAS A CLOSED FORM AND IT IS THE ONLY CHECK IN THE
--   COURSE WITH NO TOLERANCE IN IT. Give the solver linear branch resistances
--   and the whole system collapses to a weighted graph Laplacian whose
--   solution is a matrix inverse. Newton iteration and Gaussian elimination
--   share no code and no reasoning, so agreement to machine precision is
--   evidence about the assembly, the signs and the boundary handling rather
--   than about either method. On the published linear_star the two agree
--   EXACTLY at two of the four nodes and to 5.7e-14 psia at the worst of the
--   others, and Newton needs two iterations, because Newton is exact on a
--   linear system and needing many steps here would mean the Jacobian is wrong
--   rather than that the problem is hard. Every result after this one is an
--   iterate.
--
--   (2) WELLS FIGHT, AND THE WEAK WELL LOSES MOST. On the teaching network the
--   four solo rates add to 15683.052293 lb/d and the system produces
--   13300.677151, so the network costs 2382.375142 lb/d, 15.190762 percent.
--   The ranking by percentage lost is NOT the ranking by rate: the low
--   pressure well loses 24.162893 percent of itself while the strongest loses
--   12.857586, and by rate on the system they come the other way round. A well
--   with little margin over the header has the least to give when the header
--   rises. Neither column can be got at from the other by any single-well
--   method, because every single-well study is run against a wellhead pressure
--   somebody typed in.
--
--   (3) THE HEADLINE. THE REPORTED RESIDUAL CANNOT SEE ITS OWN ERROR. normOf
--   is the maximum over the unknown nodes FILTERED to exclude the pinned ones
--   and converged is tested against that norm, so a pinned node is removed
--   from the measurement by construction. On the teaching network the engine
--   returns converged true with a residual of 1.546141e-11 lb/d while
--   checkConservation, on the same answer, reports a gap of 345.000000 lb/d,
--   2.593853 percent of what it says was produced: the gap is 2.231362e+13
--   times the residual. checkConservation is IN THE SAME FILE, its own header
--   calls it the only check that catches a sign error in the assembly, and
--   solveNetwork never calls it. Nothing in that return is a check on the
--   answer that was not computed by the same iteration that produced it. The
--   module's own gate builds exactly such a case, asserts ok, pinned and the
--   warning text, and never looks at the 1000 lb/d hole it just created.
--
--   (4) AND THE PINNING IS THE NON-SOLUTION, WHICH IS SHARPER THAN SAYING THE
--   PINNED PRESSURE IS UNDETERMINED. Change nothing but initialPressures and
--   the teaching network's conservation gap comes back as 345.000000 lb/d, as
--   1625.000000 with the capacity limited flowline running BACKWARDS at its
--   limit, as 0.000000, and as MINUS 640.000000 where the network delivers
--   more than it says was produced. Every one of those runs reports converged.
--   Six of the seven pin the node and every one of the six is mass imbalanced;
--   the ONE run that pins nothing is the one whose balance closes, and it
--   closes because above 1013.848652 psia the allocation stops binding and the
--   node keeps its Jacobian row. The well's inflow falls to its line capacity
--   at 1182.577035 psia and that is where the engine lands from a 1200 psia
--   start, with the well delivering exactly what the line carries. THAT IS THE
--   SOLUTION, AND THE SHIPPED DEFAULT GUESS, EVERY UNKNOWN AT THE SEPARATOR
--   PRESSURE, IS DEEP INSIDE THE FLAT TOP. The default does not pick one of
--   several equally undetermined answers. It starts inside the trap and stays
--   there. WORSE, THE QUALITY NUMBER MOVES AGAINST THE TRUTH: the two runs
--   that are 1625.000000 lb/d out carry the SMALLEST reported residual on the
--   table, 2.2737e-12, and the run whose balance closes carries the largest,
--   1.8917e-10, so ranking those seven by the solver's own number picks the
--   two worst.
--
--   (5) THE TOLERANCE IS NOT IN LB/D AND EVERY FAILURE COMES BACK ok. The
--   constant is DEFAULT_TOLERANCE_LB_D and its own comment says Newton stops
--   when the worst nodal imbalance is below it, in lb/d. What the solver stops
--   at is that tolerance times a SCALE, and the scale is the largest SINGLE
--   well inflow evaluated at the sink pressure, 7883.717950 lb/d on the
--   teaching network, so the documented default is looser than its name
--   promises by that factor. The scale being the largest single well rather
--   than the total means the criterion TIGHTENS as wells are added, which is
--   the opposite of what a relative scale is for. Meanwhile buildNetwork
--   trains the caller to key on ok by refusing a stranded node, a missing
--   sink, a duplicate id and an unknown kind, each with ok false and a reason,
--   and solveNetwork returns ok TRUE when the iteration cap is hit, when the
--   line search stalls and when it sits on a cusp it cannot resolve. And the
--   failure message prints the number it just failed on with toFixed(3): at
--   one cap the true residual is 3.876838925407e-3 lb/d and the sentence says
--   0.004, at the next it is 3.214654498152e-8 and the sentence says 0.000, on
--   the one line whose whole job is to say how far off the answer is.
--
-- THREE MORE, SMALLER, AND ALL EXPERT.
--   propagateStreams carries a SECOND mass for every branch, supplied by the
--   caller and never compared with wellRates, so the solve's hole propagates
--   into the surface split silently and a mass that is simply wrong by any
--   factor propagates with ok true and no warning.
--   branchStreams and flows use OPPOSITE sign conventions, so differencing
--   them gives zero where a branch ran as drawn and twice the flow where it
--   ran backwards. On the teaching network that column carries two diseases at
--   once, the convention on one branch and the pinned well's mass hole on
--   three others, and the factor of two is the only signature separating them.
--   And diagnose's bottleneck intensity is a drop over a mass with only a
--   guard at a billionth of a pound a day, so a leg carrying nothing scores a
--   million and wins. On every real case in the digest it behaves exactly as
--   its header says, which is why that one is a note and not a defect.
--
-- WHAT THE ORACLE RECORDS, AND IT IS NOTHING. oracle_network.py is a genuinely
-- independent referee for the PHYSICS: Gauss-Seidel with a bracketed bisection
-- at each node, no Jacobian, no linear algebra, not the same iteration
-- structure, taking 19, 42 and 48 sweeps where the engine takes a handful of
-- Newton steps. It publishes four clean cases and records NO defects at all.
-- Every finding above therefore lives in its SILENCE: it has no concept of a
-- pinned node, its convergence criterion is a pressure movement and is not
-- comparable with the engine's mass residual, its 4000 sweep cap is never
-- reached so no published case runs out of iterations, it never calls
-- checkConservation, diagnose or propagateStreams, it has no linear case of
-- its own, and it does not import pipeSchedule.js at all. Same shape the ESP,
-- rod pump and flow assurance waves found. The oracle's silence was the
-- finding.
--
-- AND THE ONE ASSERTION THAT STANDS ALONE BEHIND THE PIPE TABLE IS THE LOOSEST
-- IN THE FILE. pipeSchedule.js's header says the redundancy of outside
-- diameter, wall and bore is the table's only way of catching a transcription
-- error. Run it as strict equality and one of the twelve published rows
-- already fails, NPS 6 schedule 40 by 8.8818e-16 in. The shipped gate uses
-- toBeCloseTo at three decimals, which passes anything within 5e-4 in, a band
-- 5.6e+11 times wider than the largest residual any row has and larger than
-- the error the redundancy exists to catch. There is no Python oracle for that
-- module anywhere.
--
-- THE CAPSTONE IS A NETWORK THE LESSONS NEVER TOUCH: OBIAFU SOUTH, five wells
-- into a west manifold, a satellite tee crosslinked to it, a trunk tee and a
-- separator, nine branches and eight unknown pressures. It is NOT the teaching
-- network in the digest and it shares no condition with any published golden
-- case, which is the DR2 rule. Four things were tuned into it and every one is
-- verified from printed engine returns rather than asserted: THE WELLS FIGHT
-- AND THE WEAK ONE LOSES MOST, so the fight is a graded answer rather than an
-- illustration; THE CROSSLINK RUNS BACKWARDS, so a learner who takes the
-- drawing's arrow at face value gets the sign and the whole downstream split
-- wrong; ONE BRANCH SITS NEAR THE CUSP OF ITS OWN RELATION, parked one step
-- short of the conductance at which the same solver on the same network burns
-- its entire iteration cap and still returns ok true; and THE SYSTEM LOSES A
-- WELL AND SAYS IT CONVERGED, because an allocated well on a capacity limited
-- flowline pins its own node and the shortfall stops being counted. That last
-- one is the centre of the Expert tier.
--
-- WHAT IS NOT GRADEABLE IS NOT GRADED. The pinned node's pressure is wherever
-- the last accepted step left it: it moves 2.8e-9 psi under a pure reordering
-- of the nodes array, which changes no physics at all, and 321 psi under a
-- change of initial guess that changes no physics either. Neither that
-- pressure nor the pinned well's reported rate is a graded field, and the
-- go-live refuses any graded value that lands near either.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. Every tier's
-- prompt restates the pipe, the wells, the conductances and the topology from
-- the raw conditions, and NO tier's prompt states a number another tier is
-- graded on, nor any quantity another tier's answer can be recovered from by
-- one multiplication or one division. The Professional tier's manifold
-- pressure was drafted into the Expert prompt as the starting point for the
-- backpressure a well is solved against and removed, because a wellhead is one
-- addition from a stated manifold. The three tiers are tied together by
-- IDENTITIES the free checks state in words instead, which is the device PD5
-- used on its cycle gas and PD6 on its heat-loss-only arrival. The check runs
-- HERE, in this file, immediately after the capstones are inserted, and the
-- go-live re-reads the STORED prompts and refuses on regression.
--
-- THE GOLDENSWEEP RAN BEFORE THIS FILE WAS WRITTEN, against the goldens AND
-- the teaching digest: eighteen graded values against 3895 published numbers,
-- ZERO collisions inside any go-live window and no approach closer than 2798
-- times a field's own grading tolerance.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd7_network_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/network.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('network', 'Production Networks', 'production', 36, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'network', 'beginner', 'associate',
  'the OBIAFU SOUTH trunk line, and two of its wells each taken on its own',
  'The line and the well on its own',
  'Six values for the OBIAFU SOUTH gathering system, and every one of them is available before two wells are ever solved together. THE TRUNK LINE is NPS 10 SCHEDULE 40: outside diameter 10.75 IN, wall 0.365 IN, bore 10.02 IN. It is API 5L grade X60 at a specified minimum yield of 60,000 PSI, and the jurisdiction it is built to sets a DESIGN FACTOR of 0.6. Its friction factor is 0.0143, and it carries FIVE long radius 90 degree elbows at a resistance coefficient of 0.3 each, THREE 45 degree elbows at 0.35 each, TWO fully open gate valves at 0.15 each, ONE swing check valve at 2, and ONE exit into a vessel at 1. THE DELIVERY BOUNDARY is a separator held at 235 PSIA. TWO OF THE FIELD''S WELLS, each taken ON ITS OWN with nothing else connected to the system: OBIAFU-3 is a Vogel inflow of 7,300 LB/D at a reservoir pressure of 3,250 PSIA on a flowline of conductance 430 LB/D PER ROOT PSI; OBIAFU-14 is a Vogel inflow of 1,850 LB/D at a reservoir pressure of 1,180 PSIA on a flowline of conductance 232 LB/D PER ROOT PSI. In each of those two solo runs the well sits on its own flowline into the west manifold, the TRUNK of conductance 815 LB/D PER ROOT PSI runs from that manifold to the separator, and nothing else is on the system. Every branch obeys q equals k times the sign of the pressure difference times the square root of its magnitude. Vogel is q equals qmax times one less 0.2 x less 0.8 x squared, with x the node pressure over the reservoir pressure clipped into zero to one. EVERY RATE HERE IS A MASS RATE IN LB/D, which is this module''s currency because surface volumes do not add across pressures. Report: (1) the TRUNK''S MAXIMUM ALLOWABLE OPERATING PRESSURE by Barlow; (2) the EQUIVALENT LENGTH of the trunk''s fittings, expressed as a length of the trunk''s own pipe; (3) OBIAFU-3''S WELLHEAD PRESSURE with that well alone on the system; (4) OBIAFU-3''S RATE alone; (5) OBIAFU-14''S WELLHEAD PRESSURE alone; and (6) OBIAFU-14''S RATE alone. What either well makes once the other four wells of the field are on the system belongs to the tiers above and is not asked for here. Traps. Barlow takes the OUTSIDE diameter and never the bore, and taking it on the bore returns a rating some seven percent HIGH, which is the wrong side to be wrong on. The design factor is an INPUT and is never defaulted, because burying one would be pretending a jurisdiction: leave it out and what comes back is the bare hoop stress, which is not a rating anybody may operate to. Field 2 takes the BORE, expressed in FEET, and the friction factor belongs in the denominator, because the equivalence is between a resistance coefficient and a length of PIPE and a length of pipe only costs what it costs once it knows its own friction factor; a rule of thumb that puts a fitting at a fixed number of diameters has assumed a friction factor without saying which one. The resistance coefficients are summed over the COUNT of each fitting, so five long radius elbows are five times 0.3 and not 0.3. Fields 3 through 6 are a SOLVE and not a formula: a wellhead sits where the inflow curve meets what the flowline and the trunk together will pass, and it is not the reservoir pressure, not the separator pressure and not anything between them chosen by hand. And a conductance in lb/d per root psi is not a conductance in lb/d per psi and the two never compare. Free checks: field 1 divided by 0.6 must be the bare hoop stress of the same wall on the same outside diameter, so field 1 is smaller than that number by exactly the design factor and by nothing else. Field 1 must also come out more than four times either of fields 3 and 5, which is what a pressure rating is for. Field 2 divided by the bore expressed in feet must be a PURE COUNT OF DIAMETERS equal to the summed resistance coefficients over the friction factor, and that count must land above 400, which is what makes any fixed diameters rule of thumb a friction factor in disguise. Field 4 must equal 7,300 times one less 0.2 x less 0.8 x squared with x field 3 over 3,250. Field 4 must ALSO equal 430 times the square root of field 3 less 235 less the square of field 4 over 815: that is the flowline and the trunk in series with the separator behind them and nothing else in between, and the two statements together are what fixes field 3. Fields 5 and 6 must satisfy those same two statements on 1,850, 1,180 and 232. And field 3 must exceed field 5 while field 4 exceeds field 6 by more than four times, which is the whole reason the tier above exists: two wells this far apart in strength do not share a header quietly.',
  jsonb_build_array(
    jsonb_build_object('key','trunk_maop_psi',            'label','Trunk maximum allowable operating pressure','unit','psi',  'expected',2444.6511627906975,  'tol',0.0013),
    jsonb_build_object('key','trunk_fitting_eq_length_ft','label','Equivalent length of the trunk fittings',   'unit','ft',   'expected',341.59090909090907,  'tol',0.00018),
    jsonb_build_object('key','solo_w1_wellhead_psia',     'label','OBIAFU-3 wellhead pressure, alone',         'unit','psia', 'expected',561.6257875816433,   'tol',0.00029),
    jsonb_build_object('key','solo_w1_rate_lbd',          'label','OBIAFU-3 rate, alone',                      'unit','lb/d', 'expected',6873.302934940513,   'tol',0.0035),
    jsonb_build_object('key','solo_w4_wellhead_psia',     'label','OBIAFU-14 wellhead pressure, alone',        'unit','psia', 'expected',290.93392225131095,  'tol',0.00015),
    jsonb_build_object('key','solo_w4_rate_lbd',          'label','OBIAFU-14 rate, alone',                     'unit','lb/d', 'expected',1668.807296619226,   'tol',0.00084)
  )
),
(
  'network', 'intermediate', 'professional',
  'the whole of OBIAFU SOUTH solved at once, five wells against one separator',
  'Solve the system',
  'Six values that only exist once the whole of OBIAFU SOUTH is solved at once. THE SAME FIELD, restated in full so nothing has to be carried across from another tier. THE DELIVERY BOUNDARY is a separator held at 235 PSIA, and it is the only node on the system whose pressure is known. THE FIVE WELLS, as Vogel inflows in LB/D at a reservoir pressure in PSIA: OBIAFU-3 is 7,300 at 3,250; OBIAFU-7 is 5,400 at 2,050; OBIAFU-11 is 6,900 at 2,950; OBIAFU-14 is 1,850 at 1,180. Vogel is q equals qmax times one less 0.2 x less 0.8 x squared with x the wellhead over the reservoir pressure clipped into zero to one. THE FIFTH WELL IS DIFFERENT AND IT IS THE REASON THIS FIELD IS WORTH SOLVING: OBIAFU-19 is a Vogel inflow of 2,640 LB/D at 1,900 PSIA that is HELD TO A FACILITY ALLOCATION of 1,450 LB/D, so what it delivers is the SMALLER of that allocation and its Vogel curve, and its flowline is CAPACITY LIMITED at 1,150 LB/D in either direction. THE TOPOLOGY. There is a WEST MANIFOLD, a SATELLITE TEE, a TRUNK TEE and the separator. OBIAFU-3, OBIAFU-7, OBIAFU-14 and OBIAFU-19 each run their own flowline into the WEST MANIFOLD, at conductances of 430, 505, 232 and 210 LB/D PER ROOT PSI respectively. OBIAFU-11 runs its own flowline into the SATELLITE TEE at 390. A WEST BYPASS runs from the west manifold to the trunk tee at 980. A CROSSLINK is DRAWN from the west manifold to the satellite tee at 460. A SATELLITE LOOP LEG runs from the satellite tee to the trunk tee at 350. And the TRUNK runs from the trunk tee to the separator at 815. Every branch obeys q equals k times the sign of the pressure difference times the square root of its magnitude, signed from the branch''s drawn start to its drawn end. Nine branches, eight unknown pressures, one loop. Solve it to a tolerance of 1e-12 with the iteration cap left at the module default. Report: (1) the WEST MANIFOLD PRESSURE; (2) the SATELLITE TEE PRESSURE; (3) the TRUNK TEE PRESSURE; (4) the MASS THE TRUNK CARRIES; (5) the MASS THE WEST BYPASS CARRIES; and (6) the MASS ON THE CROSSLINK, SIGNED IN THE DRAWN SENSE from the west manifold to the satellite tee. Traps. A DRAWN ARROW IS NOT A FLOW DIRECTION. The from and the to of a branch are a sign convention somebody chose before anybody solved anything, and the answer decides which way mass actually moves; field 6 is asked for signed in the drawn sense precisely so that a wrong sign is a wrong answer rather than a footnote. The satellite tee is fed by one well through a stiff flowline while the west manifold is fed by four through slacker ones, and where those two land relative to each other is a property of the solution and not of the drawing. Nothing may be solved against a wellhead pressure typed in by hand: that is exactly what this tier exists to replace, and a well solved against an assumed backpressure is a different and easier problem. Every well pressure is an unknown. OBIAFU-19''s inflow is the smaller of its allocation and its Vogel curve and its flowline cannot pass more than its limit in either direction, and both of those are conditions of the case rather than optional refinements. And every flow here is a MASS in lb/d: mixing a surface volume into a network balance is the mistake this module''s currency rule exists to prevent. Free checks: field 2 must come out ABOVE field 1, and that ordering is what makes field 6 NEGATIVE. Field 6 must equal minus 460 times the square root of field 2 less field 1. Field 5 must equal 980 times the square root of field 1 less field 3. Field 4 must equal 815 times the square root of field 3 less 235. Field 5 plus 350 times the square root of field 2 less field 3 must equal field 4 EXACTLY, since the trunk tee takes in the west bypass and the satellite loop leg and puts out the trunk and does nothing else. The four pressures must fall in the order field 2, field 1, field 3, then 235. The pressure difference across the crosslink, field 2 less field 1, must come out under 5 PSI while the trunk''s, field 3 less 235, is over 400: a ratio above one hundred, and that crosslink is the branch on this system closest to the cusp of its own square root relation, which is why it costs this solve more iterations than any single well costs on its own. Field 4 must land below 24,090 lb/d, the five wells'' qmax values added, because no gathering system delivers more than its wells can make against no backpressure at all. And field 4 is what the TRUNK CARRIES. Whether that is the same number as what the five wells produced is the Expert tier''s question and is not asked here.',
  jsonb_build_array(
    jsonb_build_object('key','net_header_h1_psia',    'label','West manifold pressure',        'unit','psia','expected',879.9476730307991,   'tol',0.00044),
    jsonb_build_object('key','net_satellite_m_psia',  'label','Satellite tee pressure',        'unit','psia','expected',884.148272605056,    'tol',0.00045),
    jsonb_build_object('key','net_tee_h2_psia',       'label','Trunk tee pressure',            'unit','psia','expected',704.6819057375309,   'tol',0.00036),
    jsonb_build_object('key','net_trunk_mass_lbd',    'label','Mass the trunk carries',        'unit','lb/d','expected',17662.798867634527,  'tol',0.0089),
    jsonb_build_object('key','net_bypass_mass_lbd',   'label','Mass the west bypass carries',  'unit','lb/d','expected',12974.021847848679,  'tol',0.0065),
    jsonb_build_object('key','net_crosslink_mass_lbd','label','Mass on the crosslink, drawn sense','unit','lb/d','expected',-942.7867573914898,'tol',0.00048)
  )
),
(
  'network', 'advanced', 'expert',
  'what the OBIAFU SOUTH solve costs each well, splits at a reversed tee, and never counted',
  'What the solve hides',
  'Six values for OBIAFU SOUTH that are invisible from a converged answer read at face value. THE SAME FIELD AGAIN, restated in full. THE DELIVERY BOUNDARY is a separator held at 235 PSIA and it is the only node whose pressure is known. THE FIVE WELLS, as Vogel inflows in LB/D at a reservoir pressure in PSIA: OBIAFU-3 is 7,300 at 3,250; OBIAFU-7 is 5,400 at 2,050; OBIAFU-11 is 6,900 at 2,950; OBIAFU-14 is 1,850 at 1,180; and OBIAFU-19 is 2,640 at 1,900 but is HELD TO A FACILITY ALLOCATION of 1,450 LB/D, so it delivers the SMALLER of that allocation and its Vogel curve, on a flowline CAPACITY LIMITED at 1,150 LB/D in either direction. Vogel is q equals qmax times one less 0.2 x less 0.8 x squared with x the wellhead over the reservoir pressure clipped into zero to one. THE TOPOLOGY. OBIAFU-3, OBIAFU-7, OBIAFU-14 and OBIAFU-19 run their own flowlines into the WEST MANIFOLD at conductances of 430, 505, 232 and 210 LB/D PER ROOT PSI. OBIAFU-11 runs its own flowline into the SATELLITE TEE at 390. A WEST BYPASS runs from the west manifold to the TRUNK TEE at 980, a CROSSLINK is DRAWN from the west manifold to the satellite tee at 460, a SATELLITE LOOP LEG runs from the satellite tee to the trunk tee at 350, and the TRUNK runs from the trunk tee to the separator at 815. Every branch obeys q equals k times the sign of the pressure difference times the square root of its magnitude. Solve it to a tolerance of 1e-12 with the iteration cap at the module default. NEW HERE, AND IT IS THE POINT OF THE TIER. THE SURFACE SPLIT each well is tested at, in stb/d of oil, stb/d of water and Mscf/d of gas: OBIAFU-3 makes 1,420, 176 and 1,135; OBIAFU-7 makes 862, 645 and 708; OBIAFU-11 makes 1,238, 412 and 1,476; OBIAFU-14 makes 174, 523 and 97; and OBIAFU-19 makes 306, 58 and 241. Those component rates ride along with whatever mass the solve gives each well and are not solved for. ALSO NEW: A LINEARISED TWIN of the same field. Same topology, same wells at the same qmax and the same reservoir pressures, but every well inflow read as q equals qmax times one less p over pr and EVERY BRANCH given a LINEAR conductance in LB/D PER PSI: the four west flowlines at 31, 44, 19 and 23, the satellite flowline at 27, the west bypass at 88, the crosslink at 36, the satellite loop leg at 41 and the trunk at 63, in that same order, with the same separator at 235 PSIA and no allocation and no capacity limit anywhere. Report: (1) OBIAFU-3''S RATE ON THE SYSTEM, with all five wells producing; (2) OBIAFU-14''S RATE ON THE SYSTEM; (3) the WATER ON THE WEST BYPASS, propagated from the tested splits along the solved flow directions; (4) the WEST MANIFOLD PRESSURE OF THE LINEARISED TWIN, by its closed form; (5) what a conservation check on the turbulent solve reports as PRODUCED; and (6) that same check''s RELATIVE CONSERVATION GAP. Traps. Fields 1 and 2 are the rates ON THE SYSTEM and not on a flowline alone, and the difference between those two readings is the entire reason a network is solved rather than a well. Field 3 splits at the satellite tee by MASS SHARE, which is the only split that conserves anything, and the crosslink on this field RUNS BACKWARDS, so a learner who takes the drawing''s arrow at face value sends the satellite well''s water the wrong way and gets a plausible number that is wrong by more than a rounding. A stream mass rides along with the mass the SOLVE gives each well, and nothing in the module compares a stream mass with a well rate, which is why fields 5 and 6 exist at all. Field 4 is a DIFFERENT NETWORK: lb/d per psi and lb/d per root psi are not the same quantity and never compare, and the linearised twin is solved by assembling a weighted graph Laplacian and inverting it, with no iteration anywhere in it. Field 5 is what the check reports as PRODUCED, which is the sum of the REPORTED well rates and is not what the trunk delivers. Field 6 is a FRACTION and not a percentage. And the solve returns converged true on this field with a reported residual near 1e-12 lb/d: that residual is not field 6, it does not bound field 6, and taking it as a statement about the answer is the single mistake this tier exists to prevent. Free checks: field 1 must fall BELOW what OBIAFU-3 makes alone on its own flowline, which the Associate tier computes and which is not stated here, and field 2 must fall below HALF of what OBIAFU-14 makes alone. The weak well must lose the larger FRACTION of itself while the strong well is still the larger rate, and both halves of that are the finding: ranking wells by what they lose is not ranking them by what they make. Field 1 must equal the Vogel inflow of OBIAFU-3 evaluated at its own wellhead, and that wellhead must equal the west manifold pressure plus the square of field 1 over 430. Field 3 must exceed 1,402 stb/d, the water the four wells on the west manifold bring in directly, and must fall below 1,814 stb/d, the whole field''s tested water, because the satellite well''s water splits at its own tee and only part of it comes back over the crosslink. Field 4 must come out well BELOW the west manifold pressure of the turbulent system, which the Professional tier computes and which is not stated here, and it is the only answer in this capstone that needs no tolerance at all: Newton run on that same linear system returns it to the last bits a double carries, because Newton is exact on a linear system and Gaussian elimination shares no reasoning with it. Field 5 less the mass the trunk carries must equal exactly 300 LB/D, which is OBIAFU-19''s 1,450 lb/d allocation less the 1,150 lb/d its flowline can pass and nothing else, and that is production this field puts in and never takes out. Field 6 must equal that same difference divided by field 5, and must land above one per cent and below two. And the last check is the course itself: that gap in lb/d is more than thirteen orders of magnitude above the residual the solve reports about itself, on a return whose converged flag says true.',
  jsonb_build_array(
    jsonb_build_object('key','fight_w1_rate_lbd',        'label','OBIAFU-3 rate on the system',       'unit','lb/d',        'expected',6161.276989112374,   'tol',0.0031),
    jsonb_build_object('key','fight_w4_rate_lbd',        'label','OBIAFU-14 rate on the system',      'unit','lb/d',        'expected',729.3706808145245,   'tol',0.00037),
    jsonb_build_object('key','stream_bypass_water_stbd', 'label','Water on the west bypass',          'unit','stb/d',       'expected',1470.97340763847,    'tol',0.00074),
    jsonb_build_object('key','exact_linear_h1_psia',     'label','Linearised twin west manifold pressure','unit','psia',    'expected',626.3272410560802,   'tol',0.00032),
    jsonb_build_object('key','hidden_produced_lbd',      'label','Produced, as the conservation check reports it','unit','lb/d','expected',17962.798867634523,'tol',0.009),
    jsonb_build_object('key','hidden_gap_fraction',      'label','Relative conservation gap',         'unit','dimensionless','expected',0.01670118349655065, 'tol',0.0000000084)
  )
)
on conflict (app_slug, tier) do nothing;

-- ---------------------------------------------------------------------------
-- THE CROSS-TIER PROMPT-LEAK GATE, RUN HERE RATHER THAN ONLY AT GO-LIVE.
--
-- A capstone's conditions have to state everything that changes an answer, and
-- in a chained domain the thing that changes one tier's answer is often
-- another tier's quantity. State it and the value has been handed over; leave
-- it out and the field is not gradeable. PD3 shipped a capstone prompt that
-- stated another tier's graded value at a tolerance of 0.00, and the fix is
-- always to DECOUPLE the fields rather than to disclose. Neither the lesson
-- leakage sweep nor the digest guard can see this, because a migration is not
-- a lesson, so the check lives in the migration that writes the prompts.
-- ---------------------------------------------------------------------------
do $$
declare
  v_leaks integer;
begin
  select count(*) into v_leaks
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'network' and c2.app_slug = 'network' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_leaks <> 0 then
    raise exception 'PD7 refused: % capstone prompt(s) state a graded value belonging to another tier', v_leaks;
  end if;
end $$;

-- No go-live here. See 20260904_pd7_network_go_live.sql.
