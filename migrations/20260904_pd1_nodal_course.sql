-- ============================================================================
-- PD1: Nodal Analysis & Well Performance joins the catalog, the FIRST
-- Production & Artificial Lift course and the root of that module's path.
--
-- Catalog row (module 'production'; path_order 30; prereq_slug NULL) plus the
-- three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. A producing well is two curves and one meeting
-- point. The reservoir can deliver a rate at a flowing pressure and the tubing
-- will accept a rate at a flowing pressure, and the well produces where those
-- two statements agree. The Associate tier owns the INFLOW, the Professional
-- tier owns the OUTFLOW, and the Expert tier owns the NODE where they cross,
-- which is the only one of the three that can have more than one answer.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) THE OUTFLOW CURVE IS J SHAPED BECAUSE TWO TERMS PULL OPPOSITE WAYS. A
--   column lightens as rate rises and friction grows as the square of rate, so
--   the required bottomhole pressure FALLS, reaches a minimum, and then rises.
--   That minimum is the single most important feature of the curve, because a
--   well operating to the LEFT of it is on a falling limb, and everything the
--   Expert tier says about stability follows from which side of the minimum
--   the operating point sits on.
--
--   (2) A NODE CAN HAVE TWO SOLUTIONS, AND ONLY ONE OF THEM HOLDS. When the
--   column outweighs the reservoir at low rate the residual STARTS POSITIVE,
--   crosses zero on the way down, and crosses back on the way up. The lower
--   crossing is the heading branch: a well sitting there is driven away from
--   it by any disturbance. The upper crossing holds. A learner who reports the
--   first intersection the solver returns gets the unstable one.
--
--   (3) A SOLVER THAT SCANS A GRID HAS A RESOLUTION, AND THIS WELL IS BELOW
--   IT. solveNodeCore's documented default of nGrid 40 spaces its samples
--   98.47 stb/d apart across this well's open flow. Both crossings fall inside
--   one interval, the residual never changes sign on the grid, and the engine
--   reports a LIVE WELL DEAD. At 900 and 4000 the operating rate agrees to
--   4.9e-6 stb/d, so the graded value is scan-independent once the scan can
--   see the well at all. Worth saying plainly: the SCAN fails long before the
--   stability slope test does.
--
--   AND THE OBVIOUS FIX DOES NOT WORK. Raising the grid is NOT monotone in the
--   verdict: 40 reports dead, 60 finds both crossings, and 100 loses the well
--   AGAIN before 200 finds it once more. A sign-change scan sees the dip only
--   if an interval happens to straddle it, so the verdict depends on where the
--   samples land and not only on how many there are. That kills the natural
--   response of turning the grid up until the answer stops changing, because
--   the answer can change back. The check is the residual, not the count.
--
--   (4) NEAR TANGENCY, A SMALL DECISION HAS A LARGE PAYOFF AND A SMALL
--   MISTAKE KILLS THE WELL. The residual dip is only 0.1433 psi deep, so the
--   two curves go tangent at a wellhead pressure of 1236.1433 psia: the well
--   is ONE SEVENTH OF ONE PSI from having no crossing at all. Sixty psi the
--   other way, a 4.9 percent reduction, and the rate goes from 930 to 1184
--   stb/d, a 27 percent gain. That asymmetry is not a quirk of this well; it
--   is the shape you always get when two curves are nearly tangent, and it is
--   why a single operating point is a weaker answer than a sweep. The tangency
--   was located two independent ways, a Brent root find on the residual slope
--   and a bisection on the engine's own status verdict, agreeing to 1.3e-4
--   psi. An earlier draft of this header said twelve psi, which is true but
--   loose by two orders of magnitude and understates the very thing the
--   course exists to show.
--
-- THREE DEFECTS THE EXTRACTION'S ORACLE RECORDS, AND WHERE THIS COURSE STANDS
-- ON EACH. (a) gasPwfAtRate reads the inflow off a SAMPLED gas IPR by linear
-- interpolation, and the sampling is even in pressure so it is sparse in rate
-- exactly where the curve is steepest; it runs one to three psi low through
-- the body of both empirical families and thirteen psi low at the low-rate end
-- of a strongly turbulent one. NOT exposed by this capstone, whose inflow is
-- an oil IPR inverted by a Brent root find, so there is no chord to be biased;
-- it is taught by pointing at the gas analogue. (b) cullenderSmithBhp defaults
-- to steps 2, which IS the published two-station method, and that method's own
-- truncation is not small once friction is comparable to gravity. Exposed here
-- and SIZED: on the capstone's gravity-only injection column two stations are
-- only 0.136 psi low, while on a friction-loaded diagnostic column at 9.6
-- MMscf/d the same two stations are 4.51 psi low. The truncation is a friction
-- problem, not a gravity one. (c) The 40-point scan, which is result (3) above
-- and the centre of the capstone.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: NEMBE-14, a near-saturated
-- oil well at 3,450 psia against a 3,100 psia bubble point, on continuous gas
-- lift, tied into a gathering system at 1,236 psia. It is deliberately an
-- uncomfortable well. The column outweighs the reservoir at BOTH ends of the
-- rate range, asking 5,046.57 psia at low rate and 5,277.41 psia at open flow
-- against a reservoir that can offer 3,450, so the well cannot start itself.
-- The whole stable window is 24.65 stb/d wide against an absolute open flow of
-- 3,848 stb/d, which is 0.64 percent. The operating point sits 96.1 psi above
-- the bottom of its own tubing curve and 386 stb/d to the LEFT of it, which
-- means the well holds on a FALLING limb: the outflow is still dropping with
-- rate there, and the crossing holds only because the outflow falls more
-- slowly than the inflow does.
--
-- THE OUTFLOW IS AN INJECTED FUNCTION, AND THAT IS THE ENGINE'S OWN CHOICE.
-- Its header is explicit that only the DRY GAS column is built in, because
-- Cullender and Smith needs nothing but a z-factor and is honestly
-- self-contained, while a black-oil traverse belongs to whoever owns the PVT
-- stack. The goldens follow the same discipline and drive their oil nodes with
-- a labelled gravity-plus-friction instrument. This capstone uses that same
-- instrument shape with its own four constants, so every graded number is
-- still a return value of tubingCurve, solveOilNode or operatingPointSweep.
--
-- THE DR4 CHECK RAN BEFORE A LESSON WAS WRITTEN: eighteen graded values swept
-- against 906 published numbers, ZERO collisions and ZERO integer notes. There
-- was nothing to adjudicate, because no graded value here is an integer. Every
-- capstone CONDITION also differs from the goldens' own, checked by hand line
-- by line; the single exception is nGrid 40, which is carried in only so the
-- aux block can show what the default misses and which no graded value uses.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd1_nodal_go_live.sql and must not run until a NextGen production
-- upload carries /dashboard/apps/nodal.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('nodal', 'Nodal Analysis & Well Performance', 'production', 30, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'nodal', 'beginner', 'associate',
  'NEMBE-14, a composite IPR calibrated from one flow test on a near-saturated well the lessons never use',
  'Find out what the reservoir will give you',
  'Six values from the NEMBE-14 inflow supplied with this capstone. The reservoir pressure is 3,450 psia, the bubble point is 3,100 psia, and a single flow test recorded 1,200 stb/d at a flowing pressure of 2,790 psia. Build the COMPOSITE inflow performance relationship from that one test and report: (1) the productivity index; (2) the rate AT THE BUBBLE POINT; (3) the rate at a flowing pressure of 1,650 psia; (4) the absolute open flow; (5) the flowing pressure at 2,400 stb/d; and (6) the flowing pressure at 3,300 stb/d. Traps. The test point is BELOW the bubble point, so the productivity index cannot be read as the test rate divided by the drawdown. That straight-line reading is the commonest error on this tier and it understates the index, because the curve has already bent away from the line by the time it reaches the test pressure. Fields 2 and 3 are RATES read at a stated PRESSURE while fields 5 and 6 are PRESSURES read at a stated RATE, and the two readings are not the same operation: the forward reading follows the relation, and the inverse one has to solve it. Field 6 sits past 85 percent of the open flow, deep on the part of the curve where a small change in rate costs a large change in pressure. Free checks: field 2 must equal the index times the drawdown from reservoir pressure to the bubble point exactly, because ABOVE the bubble point the relation is a straight line and nothing else; field 3 must be larger than field 2 and field 5 larger than field 6, since the curve falls; field 4 must exceed every rate you report; and reading a pressure at the rate you got in field 3 must bring you back to 1,650 psia.',
  jsonb_build_array(
    jsonb_build_object('key','ipr_pi_stbd_per_psi',      'label','Productivity index',      'unit','stb/d/psi','expected',1.856946354883082,  'tol',0.000001),
    jsonb_build_object('key','ipr_q_at_bubble_stbd',     'label','Rate at the bubble point','unit','stb/d',    'expected',649.9312242090787,   'tol',0.0003),
    jsonb_build_object('key','ipr_q_at_1650psia_stbd',   'label','Rate at 1650 psia',       'unit','stb/d',    'expected',2782.757243643787,   'tol',0.0014),
    jsonb_build_object('key','ipr_aof_stbd',             'label','Absolute open flow',      'unit','stb/d',    'expected',3848.005502063276,   'tol',0.0019),
    jsonb_build_object('key','ipr_pwf_at_2400stbd_psia', 'label','Pressure at 2400 stb/d',  'unit','psia',     'expected',1976.629067965619,   'tol',0.001),
    jsonb_build_object('key','ipr_pwf_at_3300stbd_psia', 'label','Pressure at 3300 stb/d',  'unit','psia',     'expected',1098.6212097187506,  'tol',0.00055)
  )
),
(
  'nodal', 'intermediate', 'professional',
  'the NEMBE-14 tubing curve and its gas-lift injection column, a well whose outflow beats its reservoir at both ends',
  'Find out what the tubing will take',
  'Six values for the NEMBE-14 outflow, built on the open flow the Associate tier established. The tubing curve is the gravity-plus-friction relation supplied with this capstone, evaluated at a wellhead pressure of 1,236 psia over 49 points from just above zero to the absolute open flow. The gas-lift injection column is a dry gas column of specific gravity 0.72 at 1,225 psia at the tubing head, 8,900 ft measured and 8,300 ft true vertical, from 96 degF to 214 degF, marched in 20 steps. Report: (1) the RATE at the MINIMUM of the tubing curve; (2) the bottomhole pressure AT that minimum; (3) the bottomhole pressure at the LOW RATE end of the curve; (4) the bottomhole pressure at the OPEN FLOW end; (5) the injection-gas pressure at the VALVE depth; and (6) the injection-gas pressure at the MIDPOINT of the column. Traps. Fields 3 and 4 are the two ENDS of the same curve and both must come out ABOVE the reservoir pressure of 3,450 psia, which is the whole point of this well: the column outweighs the reservoir at both ends and the well cannot start itself. A learner who reports a low-rate end below reservoir pressure has evaluated the gravity term at the wrong place. Field 1 is read off the SAMPLED curve at the stated 49 points and not off an analytic minimum, because the sampled minimum is what the engine returns and a finer sampling moves it. The injection column is marched at TWENTY steps and not at the published two-station default; on a gravity-only column the two answers differ by only a fraction of a psi, which is exactly why the difference is easy to miss and why the tier makes you state the step count. Free checks: field 2 must be the smallest bottomhole pressure anywhere on the curve, and both fields 3 and 4 must exceed it; field 1 must fall strictly between the ends of the rate range; and field 6 must sit between the 1,225 psia tubing head pressure and field 5, since a static gas column only gains pressure with depth.',
  jsonb_build_array(
    jsonb_build_object('key','vlp_min_q_stbd',            'label','Rate at the curve minimum','unit','stb/d','expected',1285.2338376891341, 'tol',0.00064),
    jsonb_build_object('key','vlp_min_bhp_psia',          'label','Pressure at the minimum',  'unit','psia', 'expected',2849.67283735105,   'tol',0.0014),
    jsonb_build_object('key','vlp_loaded_end_bhp_psia',   'label','Low rate end',             'unit','psia', 'expected',5046.565087663264,  'tol',0.0025),
    jsonb_build_object('key','vlp_friction_end_bhp_psia', 'label','Open flow end',            'unit','psia', 'expected',5277.411341029544,  'tol',0.0026),
    jsonb_build_object('key','liftgas_valve_pwf_psia',    'label','Injection pressure at depth','unit','psia','expected',1516.5314295864096, 'tol',0.00076),
    jsonb_build_object('key','liftgas_mid_pmf_psia',      'label','Injection pressure at midpoint','unit','psia','expected',1373.724371881081,'tol',0.00069)
  )
),
(
  'nodal', 'advanced', 'expert',
  'the NEMBE-14 node, where two crossings sit 24.65 stb/d apart and the default scan reports the well dead',
  'Solve a node that has two answers',
  'Six values for NEMBE-14, solving the node where the Associate tier''s inflow meets the Professional tier''s outflow. Solve on a 900-point grid. Report: (1) the OPERATING rate; (2) the flowing pressure at the operating point; (3) the rate at the UNSTABLE crossing; (4) the flowing pressure there; and then, sweeping the wellhead pressure, (5) the operating rate and (6) the flowing pressure at a wellhead pressure of 1,176 psia. Traps. This node has TWO crossings and the difference between them is the whole tier: the LOWER rate one is the heading branch, where a well is driven away from the crossing by any disturbance, and the HIGHER rate one is where the well actually produces. Reporting the first intersection a solver hands back swaps fields 1 and 2 with fields 3 and 4. The grid is stated at 900 points and that is not decoration: at the solver''s default of 40 the two crossings fall inside a single interval, the residual never changes sign, and the engine reports this live well DEAD. Field 5 is not a small correction to field 1. Free checks: field 1 must exceed field 3 and field 2 must be BELOW field 4, since the outflow is falling across the window; the two crossings must sit less than 30 stb/d apart on a well whose open flow is nearly 3,850 stb/d; field 2 must come out ABOVE the minimum of the tubing curve the Professional tier reported, because this well holds on the FALLING limb and not at the bottom of it; and field 5 must exceed field 1 by more than 250 stb/d, because a 60 psi reduction at the wellhead near tangency buys far more than 60 psi of drawdown would suggest.',
  jsonb_build_array(
    jsonb_build_object('key','node_op_q_stbd',        'label','Operating rate',            'unit','stb/d','expected',929.9820637311327,  'tol',0.00046),
    jsonb_build_object('key','node_op_pwf_psia',      'label','Operating pressure',        'unit','psia', 'expected',2945.7774594005996, 'tol',0.0015),
    jsonb_build_object('key','node_unstable_q_stbd',  'label','Unstable crossing rate',    'unit','stb/d','expected',905.3367675852949,  'tol',0.00045),
    jsonb_build_object('key','node_unstable_pwf_psia','label','Unstable crossing pressure','unit','psia', 'expected',2959.6346643478146, 'tol',0.0015),
    jsonb_build_object('key','sweep_pwh1176_q_stbd',  'label','Rate at 1176 psia wellhead','unit','stb/d','expected',1184.0068509231141, 'tol',0.00057),
    jsonb_build_object('key','sweep_pwh1176_pwf_psia','label','Pressure at 1176 psia wellhead','unit','psia','expected',2799.4388422395805,'tol',0.0015)
  )
)
on conflict (app_slug, tier) do nothing;

-- ----------------------------------------------------------------------------
-- AMENDMENT, same day, applied on top of the insert above. The teaching lab
-- found that raising the scan is NOT monotone in the verdict: 40 reports dead,
-- 60 finds both crossings, 100 loses the well AGAIN, 200 finds it once more. A
-- learner told only that the default of 40 reports the well dead could try 100,
-- get dead a second time, and reasonably conclude the capstone is broken rather
-- than that the scan is. The Expert prompt gains one sentence saying so. No
-- graded value moves. Written as an explicit update because the insert above is
-- ON CONFLICT DO NOTHING and the row already existed by the time this was
-- known; the statement is idempotent and is a no-op on a fresh database, where
-- the insert has already put the amended text in place.
-- ----------------------------------------------------------------------------
update public.academy_capstones
   set prompt = replace(
         prompt,
         'the residual never changes sign, and the engine reports this live well DEAD.',
         'the residual never changes sign, and the engine reports this live well DEAD. Raising the grid is not monotone in that verdict either, so trying a middling count and getting a dead well a second time is not evidence the well is dead.')
 where app_slug = 'nodal'
   and tier = 'advanced'
   and prompt like '%the residual never changes sign, and the engine reports this live well DEAD.%'
   and prompt not like '%not monotone in that verdict%';

-- No go-live here. See 20260904_pd1_nodal_go_live.sql.
