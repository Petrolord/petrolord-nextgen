-- ============================================================================
-- PD7 GO-LIVE (HELD): Production Networks flips to 'available'. This is the
-- SEVENTH Production & Artificial Lift course, behind 'nodal' at path_order 36.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/network. That upload is the gate, and
-- nothing else releases this file.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and every number in it was RECOMPUTED from the stated conditions
-- before it was written down: the two solo wells and the whole nine branch
-- system re-solved by Gauss-Seidel with a bracketed bisection at each node, no
-- Jacobian and no Newton anywhere, and the linearised twin re-solved in exact
-- rational arithmetic. All eighteen graded fields came back inside their own
-- grading tolerances, the worst by 1.8e-11 lb/d on the trunk mass. On PD4 two
-- of thirty-five assertions were wrong on the first pass and only a numeric
-- re-verification found them, which is why that pass is now the rule rather
-- than a courtesy.
--
-- Most assertions are PAIRS, because a one-sided check passes on a capstone
-- quietly recut into the mistake the course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE HOLE UNDER A CONVERGED FLAG. What the
-- conservation check calls PRODUCED, less what the trunk carries, must equal
-- EXACTLY the allocated well's allocation less what its flowline can pass, and
-- that difference must be a material fraction of the whole, above one per cent
-- and below two. Both, or the centre of the Expert tier is gone. Asserting
-- only that a gap exists would pass on a rounding nobody would ever notice.
-- Asserting only that the fraction is material would pass on a capstone whose
-- gap came from somewhere other than the pinned node, which is a different
-- finding with a different fix. The two together are the claim: this network
-- puts 300 lb/d in and never takes it out, that is 1.670 per cent of what it
-- says it produced, and it is the allocated well's shortfall to the last bit.
--
-- AND THE SIZE OF THE SILENCE IS ASSERTED BESIDE IT. The solver's own stopping
-- criterion on this capstone is the stated tolerance times a scale it never
-- shows the caller, and that scale is the largest SINGLE well inflow evaluated
-- at the sink pressure. This file recomputes that scale from the wells and
-- asserts the gap is more than ten orders of magnitude above the target the
-- solve actually stopped at. A solve reporting itself converged to eleven
-- figures on a network four hundred million times further out of balance than
-- its own criterion is not a tolerance question, and stating it as a ratio
-- rather than as an adjective is what keeps it from becoming one.
--
-- THE SECOND PAIR IS THAT A CORRECT ANSWER EXISTS AND THE DEFAULT GUESS MISSES
-- IT. This is the sharpest thing this wave found and it supersedes the framing
-- that a pinned pressure is merely undetermined. The allocated well's inflow
-- falls to its LINE CAPACITY at a pressure this file recomputes from the Vogel
-- inverse, and at that pressure the well delivers exactly what the line
-- carries and the balance closes. So the file asserts three things together:
-- that the crossing exists and returns the capacity, that it sits ABOVE the
-- pressure where the allocation stops binding, and that the engine's default
-- start, every unknown at the separator pressure, is DEEP INSIDE the flat top
-- where the allocation binds. The solver does not pick one of several equally
-- undetermined answers. It starts inside the trap and stays there, and a
-- solver that re-solved the node from its own inflow once the row went flat
-- would return the consistent answer with no change to the convergence test.
--
-- THE THIRD PAIR IS THE FIGHT, AND IT IS A PAIR BECAUSE THE RANKING REVERSES.
-- Each well's rate on the system must be BELOW its rate alone, the weak well
-- must lose the larger FRACTION of itself, and the strong well must still be
-- the larger RATE. Asserting only that the rates fall would pass on a system
-- where every well lost the same share, which teaches nothing a single-well
-- study does not already give. Asserting only the fractions would lose the
-- reason an allocation meeting gets this wrong: the two rankings are different
-- rankings and the second is the one everybody uses.
--
-- THE FOURTH PAIR IS THE ARROW THAT IS NOT A DIRECTION. The satellite tee must
-- sit ABOVE the west manifold and the crosslink must be NEGATIVE in the drawn
-- sense. Either alone is a coincidence; the two together are the statement
-- that a drawn `from` and `to` are a sign convention chosen before anybody
-- solved anything, and that the answer decides. A capstone recut so the
-- crosslink ran as drawn would satisfy every mass balance in this file and
-- would quietly delete the Expert tier's stream split.
--
-- THE FIFTH PAIR IS THE CUSP THE CAPSTONE IS PARKED ONE STEP SHORT OF. The
-- pressure difference across the crosslink must be under 5 psi while the
-- trunk's is over 400, a ratio above one hundred. The first makes the branch
-- genuinely close to dp = 0, where the turbulent relation's slope is infinite
-- and a centrally differenced Jacobian entry becomes a chord across a square
-- root; the second keeps it a real gathering system rather than a contrived
-- one. A capstone with no branch near the cusp would still solve, and the
-- Expert finding about a contract that asks for continuity where it needs
-- differentiability would have nothing on this network to point at.
--
-- AND THE SIXTH IS THE BOTTLENECK THAT IS NOT THE BIGGEST DROP. The trunk must
-- carry the largest pressure difference on the system AND must not be the
-- branch with the highest drop per unit mass. Both, or `diagnose`'s whole
-- claim, that a trunk carrying everything is supposed to have the biggest drop
-- and pointing at it every time would be useless, has nothing to stand on.
--
-- ONE ANCHOR IS ASSERTED DIFFERENTLY FROM EVERYTHING ELSE, ON PURPOSE. The
-- linearised twin has a closed form, so its west manifold pressure is checked
-- by rebuilding the whole eight node balance from hand retyped pressures and
-- requiring every node's net to close, the graded node included. That is the
-- only answer in this capstone that is not an iterate, and a tier whose
-- subject is that a solver's report on itself cannot be trusted has to end
-- holding one number that never needed one.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE THREE.
--
--   SMALL GROUP, the one field below 2: the dimensionless conservation gap.
--   Grader tolerance 8.4e-9. Nearest guarded published neighbour 2.98817e-4,
--   which is 0.01670118 against a teaching sweep's 0.017. A window of 1e-6
--   therefore sits 119 TIMES ABOVE the tolerance it covers and 299 TIMES BELOW
--   the nearest neighbour it must not catch.
--
--   MIDDLE GROUP, the eight fields between 2 and 1000: four pressures, a
--   length, a well rate, a branch mass and the linear twin's manifold.
--   Largest grader tolerance 4.8e-4. Nearest guarded neighbour 1.56230, the
--   linear manifold of 626.32724 psia against a teaching 627.889543. A window
--   of 0.03 sits 62.5 TIMES ABOVE the largest tolerance and 52.1 TIMES BELOW
--   that neighbour.
--
--   LARGE GROUP, the nine fields at 1000 and above: a pressure rating, four
--   masses, two solo rates, a water rate and the produced total. Largest
--   grader tolerance 9.0e-3. Nearest guarded neighbour 12.5045, the system
--   rate of 6161.27699 lb/d against a teaching sweep's 6173.781457. A window
--   of 0.4 sits 44.4 TIMES ABOVE the largest tolerance and 31.3 TIMES BELOW
--   that neighbour.
--
-- TWO APPROACHES ARE COINCIDENCES OF MAGNITUDE AND NOT LOOKUPS, AND THEY ARE
-- NAMED HERE RATHER THAN LEFT FOR SOMEBODY TO FIND. The trunk tee pressure of
-- 704.68191 PSIA sits 3.318 from the 708 MSCF/D of gas the Expert prompt lists
-- for one well's tested split, and the dimensionless conservation gap of
-- 0.0167012 sits 0.0024 from the trunk's 0.0143 FRICTION FACTOR. Neither is a
-- unit shift of the other side and neither is recoverable from it: a pressure
-- is not a gas rate and a mass fraction is not a Darcy friction factor. The
-- second is the tighter and it is worth being exact about: 0.0024 is 285,900
-- TIMES the tolerance that field is graded to, so a learner who wrote the
-- friction factor down instead of computing the gap fails by five orders of
-- magnitude, and it is 2401 times the 1e-6 window that field's magnitude group
-- is guarded with below. The eighteen graded values were swept against 3895
-- published numbers, the goldens and the teaching digest together, with zero
-- collisions inside any window above and no approach closer than 2798 times a
-- field's own grading tolerance.
--
-- A GATE THIS COURSE ADDS TO THE PERMANENT SET, AND IT IS THE THESIS AS SQL.
-- A PINNED NODE'S NUMBERS ARE NOT AN ANSWER AND MAY NOT BE GRADED. The pinned
-- pressure is wherever the last accepted step left it: it moves 2.8e-9 psi
-- under a pure reordering of the nodes array, which changes no physics at all,
-- and 321 psi under a change of initial guess that changes no physics either.
-- The pinned well's reported rate is its allocation and its flowline's mass is
-- that line's capacity, and neither of those two is a solve output at all.
-- So no graded PSIA field may land near the pinned pressure and no graded LB/D
-- field may land near the allocation or the capacity. The gate is written on
-- the UNIT rather than on the value alone, deliberately: a pressure the solver
-- left is a pressure, and a mass in lb/d landing near a pressure in psia is a
-- collision of magnitudes between two different physical quantities and is not
-- what this gate is looking for. The pinned pressure is quoted to four decimal
-- places and no further, because it has no further digits that mean anything.
--
-- A SECOND GATE, AND IT IS THE ONE THIS WAVE ADDS. NO GRADED FIELD MAY LAND
-- NEAR A VALUE THE LEARNER IS HANDED IN THE PROMPT. A capstone's conditions
-- have to state everything that changes an answer, and this domain hands over
-- more conditions than most: five wells, nine turbulent conductances, nine
-- linear ones, an allocation, a capacity limit, a pipe, a grade, a design
-- factor, a friction factor, five fitting counts and fifteen tested surface
-- rates. Every one of those is a number sitting in front of the learner while
-- they are graded, and a graded field that lands on one of them is not a
-- calculation, it is a transcription. The gate runs on the same three
-- magnitude windows as the golden sweep.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE, which re-reads the STORED prompts.
-- The Professional tier's west manifold pressure was drafted into the Expert
-- prompt as the backpressure a well is solved against and taken out of it,
-- because a wellhead is one addition away from a stated manifold and a leak
-- that needs one addition is still a leak. The three tiers are tied together
-- by identities stated in words instead, which is the device PD5 used on its
-- cycle gas and PD6 on its heat-loss-only arrival.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_maop   numeric; v_eqlen  numeric;
  v_sp1    numeric; v_sr1    numeric; v_sp4    numeric; v_sr4    numeric;
  v_h1     numeric; v_m      numeric; v_h2     numeric;
  v_tr     numeric; v_l1     numeric; v_l2     numeric;
  v_f1     numeric; v_f4     numeric; v_water  numeric;
  v_lin    numeric; v_prod   numeric; v_gapf   numeric;
  v_bare   numeric; v_sumk   numeric; v_l3     numeric;
  v_scale  numeric; v_target numeric; v_gap    numeric;
  v_pw1    numeric; v_pw4    numeric; v_share  numeric;
  v_pcap   numeric; v_pall   numeric; v_xcap   numeric; v_xall numeric;
  v_q2     numeric; v_q3     numeric; v_pw2    numeric; v_pw3    numeric;
  v_i1 numeric; v_i2 numeric; v_i3 numeric; v_i4 numeric; v_i5 numeric;
  v_ih1 numeric; v_im numeric; v_ih2 numeric; v_worst numeric; v_vog5 numeric;
  v_lossw numeric; v_losss numeric;
  -- Stated conditions of the capstone, and engine constants. None of these is
  -- a graded value; they are what the assertions are written against, and all
  -- of them are hand retyped from the capstone's own conditions rather than
  -- read out of the wave's derivation.
  c_sep    constant numeric := 235;      -- psia, the separator, the only known pressure
  c_q1 constant numeric := 7300;  c_p1 constant numeric := 3250;  -- OBIAFU-3
  c_q2 constant numeric := 5400;  c_p2 constant numeric := 2050;  -- OBIAFU-7
  c_q3 constant numeric := 6900;  c_p3 constant numeric := 2950;  -- OBIAFU-11
  c_q4 constant numeric := 1850;  c_p4 constant numeric := 1180;  -- OBIAFU-14
  c_q5 constant numeric := 2640;  c_p5 constant numeric := 1900;  -- OBIAFU-19
  c_alloc  constant numeric := 1450;     -- lb/d, the facility allocation
  c_cap    constant numeric := 1150;     -- lb/d, the flowline capacity limit
  -- turbulent branch conductances, lb/d per root psi
  c_kf1 constant numeric := 430; c_kf2 constant numeric := 505;
  c_kf3 constant numeric := 390; c_kf4 constant numeric := 232;
  c_kf5 constant numeric := 210; c_kl1 constant numeric := 980;
  c_kl2 constant numeric := 460; c_kl3 constant numeric := 350;
  c_ktr constant numeric := 815;
  -- linear branch conductances of the twin, lb/d per psi. NOT the same
  -- quantity as the nine above and never comparable with them.
  c_cf1 constant numeric := 31; c_cf2 constant numeric := 44;
  c_cf3 constant numeric := 27; c_cf4 constant numeric := 19;
  c_cf5 constant numeric := 23; c_cl1 constant numeric := 88;
  c_cl2 constant numeric := 36; c_cl3 constant numeric := 41;
  c_ctr constant numeric := 63;
  -- the trunk line
  c_od   constant numeric := 10.75;      -- in, NPS 10 schedule 40
  c_wall constant numeric := 0.365;      -- in
  c_bore constant numeric := 10.02;      -- in, the published bore
  c_yld  constant numeric := 60000;      -- psi, API 5L X60
  c_df   constant numeric := 0.6;        -- the design factor, an INPUT
  c_ff   constant numeric := 0.0143;     -- the friction factor
  -- the tested surface water each well makes, stb/d
  c_wat1 constant numeric := 176; c_wat2 constant numeric := 645;
  c_wat3 constant numeric := 412; c_wat4 constant numeric := 523;
  c_wat5 constant numeric := 58;
  c_tol    constant numeric := 0.000000000001;  -- 1e-12, the stated tolerance
  -- the linearised twin, solved in exact rational arithmetic outside this
  -- file and hand retyped. h1 is NOT here: it is the graded field, and the
  -- assertion is that the eight node balances close WITH it in place.
  c_lw1 constant numeric := 803.5860206978251;
  c_lw2 constant numeric := 706.7439031721586;
  c_lw3 constant numeric := 808.1407279887967;
  c_lw4 constant numeric := 668.5313862578204;
  c_lw5 constant numeric := 698.8886584840455;
  c_lm  constant numeric := 622.5935970801048;
  c_lh2 constant numeric := 497.12570152718376;
  -- the number the solver LEFT rather than determined, quoted to four decimals
  -- because it has no further digits that mean anything.
  c_pinned constant numeric := 921.1414;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'network' and active;
  if v_structures <> 3 then
    raise exception 'PD7 go-live refused: network has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'network';
  if v_questions <> 396 then
    raise exception 'PD7 go-live refused: network has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'network';
  if v_capstones <> 3 then
    raise exception 'PD7 go-live refused: network has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'network'
                   and module = 'production' and path_order = 36 and prereq_slug = 'nodal') then
    raise exception 'PD7 go-live refused: the network catalog row is not production/36 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD7 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- -------------------------------------------------- the scope assertion --
  -- These two engines index a topology, run Newton on a nodal mass balance,
  -- add component rates along solved directions and read a pipe table. They
  -- model NO hydraulics of their own: the branch relation and the well inflow
  -- are callbacks the consumer supplies. Section 24 of the teaching digest is
  -- the list of what that leaves out, and nothing here may certify any of it:
  -- temperature anywhere, so no thermal coupling and no cooldown; slugging,
  -- holdup and every transient, because every equation here is steady state;
  -- compressibility along a branch, since mass in equals mass out on every
  -- branch by construction; and any equipment between nodes at all, so no
  -- pump, no compressor and no choke as a node kind.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network'
     and (f->>'label' ilike '%temperature%' or f->>'label' ilike '%thermal%'
       or f->>'label' ilike '%cooldown%'    or f->>'label' ilike '%hydrate%'
       or f->>'label' ilike '%wax%'         or f->>'label' ilike '%holdup%'
       or f->>'label' ilike '%slug%'        or f->>'label' ilike '%regime%'
       or f->>'label' ilike '%transient%'   or f->>'label' ilike '%pump%'
       or f->>'label' ilike '%compressor%'  or f->>'label' ilike '%choke%'
       or f->>'label' ilike '%viscosit%'    or f->>'label' ilike '%skin%'
       or f->>'label' ilike '%permeab%'     or f->>'label' ilike '%decline%'
       or f->>'label' ilike '%reserve%'     or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%eur%'         or f->>'label' ilike '%price%'
       or f->>'label' ilike '%revenue%'     or f->>'label' ilike '%residual%'
       or f->>'unit'  ilike '%degf%'        or f->>'unit'  ilike '%degc%'
       or f->>'unit'  ilike '%btu%'         or f->>'unit'  ilike '%usd%'
       or f->>'unit'  ilike '%boe%'         or f->>'unit'  ilike '%psig%'
       or f->>'unit'  ilike '%md%');
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % capstone field(s) grade a quantity these network engines do not model', v_graded;
  end if;

  -- ----------- A PINNED NODE'S NUMBERS ARE NOT AN ANSWER, AS A GATE -------
  -- Written on the unit, because a pressure the solver left is a pressure and
  -- a mass landing near one is a collision of magnitudes and not a lookup.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network' and f->>'unit' = 'psia'
     and abs((f->>'expected')::numeric - c_pinned) < 0.5;
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded psia field(s) sit on the pinned node pressure, which is the last iterate rather than a solved value and moves 321 psi under a change of guess that changes no physics', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network' and f->>'unit' = 'lb/d'
     and (abs((f->>'expected')::numeric - c_alloc) < 0.5
       or abs((f->>'expected')::numeric - c_cap)   < 0.5);
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded lb/d field(s) sit on the pinned well''s allocation or on its flowline capacity, neither of which is a solve output', v_graded;
  end if;

  -- ---------- NO GRADED FIELD MAY BE A NUMBER THE PROMPT HANDS OVER ------
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (235),(7300),(3250),(5400),(2050),(6900),(2950),(1850),(1180),
                 (2640),(1900),(1450),(1150),
                 (430),(505),(390),(232),(210),(980),(460),(350),(815),
                 (31),(44),(27),(19),(23),(88),(36),(41),(63),
                 (10.75),(0.365),(10.02),(60000),(0.6),(0.0143),
                 (0.3),(0.35),(0.15),(2),(1),(5),(3),(0.2),(0.8),
                 (1420),(176),(1135),(862),(645),(708),(1238),(412),(1476),
                 (174),(523),(97),(306),(58),(241),
                 (1402),(1814),(300),(24090),(400),(100)) as h(v)
   where c.app_slug = 'network'
     and abs(abs((f->>'expected')::numeric) - h.v) <
         (case when abs((f->>'expected')::numeric) < 2 then 0.000001
               when abs((f->>'expected')::numeric) < 1000 then 0.03
               else 0.4 end);
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded field(s) land on a number the learner is handed in the prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- SMALL GROUP, the one graded value below 2. Window 1e-6.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network' and abs((f->>'expected')::numeric) < 2
     and (abs(abs((f->>'expected')::numeric) - 0.025938529) < 0.000001 -- teaching relative conservation gap
       or abs(abs((f->>'expected')::numeric) - 0.017)       < 0.000001 -- teaching sweep relative
       or abs(abs((f->>'expected')::numeric) - 0.01740181)  < 0.000001 -- teaching sweep relative
       or abs(abs((f->>'expected')::numeric) - 0.012199141) < 0.000001 -- teaching allocation sweep at 800
       or abs(abs((f->>'expected')::numeric) - 0.001541345) < 0.000001 -- teaching allocation sweep at 660
       or abs(abs((f->>'expected')::numeric) - 0.048473535) < 0.000001 -- teaching allocation sweep at 1300
       or abs(abs((f->>'expected')::numeric) - 0.5)         < 0.000001 -- the published pinning fixture's relative gap
       or abs(abs((f->>'expected')::numeric) - 0.018)       < 0.000001 -- gate friction factor
       or abs(abs((f->>'expected')::numeric) - 0.012)       < 0.000001 -- gate friction factor
       or abs(abs((f->>'expected')::numeric) - 0.05)        < 0.000001 -- the friction factor a thirty diameters rule assumes
       or abs(abs((f->>'expected')::numeric) - 0.72)        < 0.000001 -- gate design factor
       or abs(abs((f->>'expected')::numeric) - 1.5)         < 0.000001 -- the published fitting set summed K
       or abs(abs((f->>'expected')::numeric) - 1.388889)    < 0.000001 -- bare hoop over rated at the gate design factor
       or abs(abs((f->>'expected')::numeric) - 1.687637489) < 0.000001);-- wells_fight scale ratio at two wells
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded field(s) below 2 sit within 1e-6 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- MIDDLE GROUP, the eight graded values between 2 and 1000. Window 0.03.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network'
     and abs((f->>'expected')::numeric) >= 2 and abs((f->>'expected')::numeric) < 1000
     and (abs(abs((f->>'expected')::numeric) - 886.000043113)      < 0.03 -- teaching, what the strongest well lost
       or abs(abs((f->>'expected')::numeric) - 886.8815073597741)  < 0.03 -- golden wells_fight pressure w0
       or abs(abs((f->>'expected')::numeric) - 936.962342067409)   < 0.03 -- golden turbulent_tree pressure h1
       or abs(abs((f->>'expected')::numeric) - 738.664739309)      < 0.03 -- teaching, what the weak well lost
       or abs(abs((f->>'expected')::numeric) - 589.864625170)      < 0.03 -- teaching crosslink mass
       or abs(abs((f->>'expected')::numeric) - 569.313221)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 575.553310094)      < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 283.461039)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 892.889543)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 840.553310)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 335.147329)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 303.714449)         < 0.03 -- teaching solo wellhead
       or abs(abs((f->>'expected')::numeric) - 300.0)              < 0.03 -- golden looped branch conductance
       or abs(abs((f->>'expected')::numeric) - 340.0)              < 0.03 -- digest sweep value
       or abs(abs((f->>'expected')::numeric) - 627.889543025)      < 0.03 -- teaching value
       or abs(abs((f->>'expected')::numeric) - 624.301508)         < 0.03 -- teaching value
       or abs(abs((f->>'expected')::numeric) - 780.469728020)      < 0.03 -- teaching north manifold
       or abs(abs((f->>'expected')::numeric) - 781.662938843)      < 0.03 -- teaching loop tee
       or abs(abs((f->>'expected')::numeric) - 588.783893593)      < 0.03 -- teaching trunk tee
       or abs(abs((f->>'expected')::numeric) - 820.813328309)      < 0.03 -- teaching wellhead
       or abs(abs((f->>'expected')::numeric) - 831.176261907)      < 0.03 -- teaching PINNED pressure
       or abs(abs((f->>'expected')::numeric) - 252.222222222)      < 0.03 -- golden linear_star junction
       or abs(abs((f->>'expected')::numeric) - 396.666666667)      < 0.03 -- golden linear_star wellhead
       or abs(abs((f->>'expected')::numeric) - 546.666666666)      < 0.03 -- golden linear_star wellhead
       or abs(abs((f->>'expected')::numeric) - 265.0)              < 0.03 -- teaching separator
       or abs(abs((f->>'expected')::numeric) - 180.0)              < 0.03 -- golden separator
       or abs(abs((f->>'expected')::numeric) - 200.0)              < 0.03 -- golden separator
       or abs(abs((f->>'expected')::numeric) - 150.0)              < 0.03 -- golden separator
       or abs(abs((f->>'expected')::numeric) - 640.0)              < 0.03 -- teaching flowline capacity
       or abs(abs((f->>'expected')::numeric) - 985.0)              < 0.03 -- teaching allocation
       or abs(abs((f->>'expected')::numeric) - 345.0)              < 0.03 -- teaching conservation gap
       or abs(abs((f->>'expected')::numeric) - 188.982841040)      < 0.03 -- teaching survivors' gain
       or abs(abs((f->>'expected')::numeric) - 469.025752507)      < 0.03 -- teaching survivors' gain
       or abs(abs((f->>'expected')::numeric) - 767.079317902)      < 0.03 -- teaching survivors' gain
       or abs(abs((f->>'expected')::numeric) - 994.366002145)      < 0.03 -- teaching survivors' gain
       or abs(abs((f->>'expected')::numeric) - 451.017158960)      < 0.03 -- teaching deferment, delivered basis
       or abs(abs((f->>'expected')::numeric) - 796.017158960)      < 0.03 -- teaching deferment, reported basis
       or abs(abs((f->>'expected')::numeric) - 465.7099)           < 0.03 -- teaching residual at an iteration cap
       or abs(abs((f->>'expected')::numeric) - 83.333333)          < 0.03 -- the published fitting set in diameters at f 0.018
       or abs(abs((f->>'expected')::numeric) - 75.0)               < 0.03 -- the same set at f 0.02
       or abs(abs((f->>'expected')::numeric) - 30.0)               < 0.03);-- the thirty diameters rule
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded field(s) between 2 and 1000 sit within 0.03 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- LARGE GROUP, the nine graded values at 1000 and above. Window 0.4.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'network' and abs((f->>'expected')::numeric) >= 1000
     and (abs(abs((f->>'expected')::numeric) - 17556.445788322)   < 0.4 -- teaching, the four inflows at the sink pressure summed
       or abs(abs((f->>'expected')::numeric) - 17333.333333329)   < 0.4 -- golden linear_star flow b2
       or abs(abs((f->>'expected')::numeric) - 12955.677150912)   < 0.4 -- teaching trunk
       or abs(abs((f->>'expected')::numeric) - 12955.836128)      < 0.4 -- teaching crosslink sweep trunk
       or abs(abs((f->>'expected')::numeric) - 12955.796123)      < 0.4 -- teaching crosslink sweep trunk
       or abs(abs((f->>'expected')::numeric) - 12953.908263)      < 0.4 -- teaching crosslink sweep trunk
       or abs(abs((f->>'expected')::numeric) - 12949.424167)      < 0.4 -- teaching crosslink sweep trunk
       or abs(abs((f->>'expected')::numeric) - 12955.285062)      < 0.4 -- teaching crosslink sweep trunk
       or abs(abs((f->>'expected')::numeric) - 13300.677150912)   < 0.4 -- teaching produced
       or abs(abs((f->>'expected')::numeric) - 6004.874117054)    < 0.4 -- teaching well rate on the system
       or abs(abs((f->>'expected')::numeric) - 6890.874160167)    < 0.4 -- teaching solo well rate
       or abs(abs((f->>'expected')::numeric) - 6173.781457)       < 0.4 -- teaching sweep rate
       or abs(abs((f->>'expected')::numeric) - 4750.157046765)    < 0.4 -- teaching solo well rate
       or abs(abs((f->>'expected')::numeric) - 3057.021085629)    < 0.4 -- teaching solo well rate
       or abs(abs((f->>'expected')::numeric) - 2318.356346320)    < 0.4 -- teaching well rate
       or abs(abs((f->>'expected')::numeric) - 3992.446687538)    < 0.4 -- teaching well rate
       or abs(abs((f->>'expected')::numeric) - 3402.582062368)    < 0.4 -- teaching loop leg
       or abs(abs((f->>'expected')::numeric) - 9553.095088544)    < 0.4 -- teaching north bypass, solve mass
       or abs(abs((f->>'expected')::numeric) - 9898.095088544)    < 0.4 -- teaching north bypass, STREAM mass
       or abs(abs((f->>'expected')::numeric) - 15683.052292561)   < 0.4 -- teaching solo rates added
       or abs(abs((f->>'expected')::numeric) - 2382.375141650)    < 0.4 -- teaching cost of the network
       or abs(abs((f->>'expected')::numeric) - 23555.555555544)   < 0.4 -- golden linear_star flow b1
       or abs(abs((f->>'expected')::numeric) - 40888.888888870)   < 0.4 -- golden linear_star flow b3
       or abs(abs((f->>'expected')::numeric) - 16153.846153843)   < 0.4 -- published live network rate
       or abs(abs((f->>'expected')::numeric) - 3164.739623)       < 0.4 -- gate Barlow rating
       or abs(abs((f->>'expected')::numeric) - 2130.113208)       < 0.4 -- derived Barlow rating
       or abs(abs((f->>'expected')::numeric) - 2556.135849)       < 0.4 -- derived Barlow rating
       or abs(abs((f->>'expected')::numeric) - 3651.622642)       < 0.4 -- derived Barlow rating
       or abs(abs((f->>'expected')::numeric) - 3955.924528)       < 0.4 -- derived Barlow rating
       or abs(abs((f->>'expected')::numeric) - 5426.086957)       < 0.4 -- teaching line rating
       or abs(abs((f->>'expected')::numeric) - 7536.231884)       < 0.4 -- teaching line bare hoop
       or abs(abs((f->>'expected')::numeric) - 4395.471698)       < 0.4 -- gate line bare hoop
       or abs(abs((f->>'expected')::numeric) - 7883.717950413)    < 0.4 -- teaching convergence SCALE
       or abs(abs((f->>'expected')::numeric) - 3125.903030303)    < 0.4 -- teaching well inflow at the sink pressure
       or abs(abs((f->>'expected')::numeric) - 5561.824807605)    < 0.4 -- teaching well inflow at the sink pressure
       or abs(abs((f->>'expected')::numeric) - 4125.742011834)    < 0.4 -- wells_fight scale
       or abs(abs((f->>'expected')::numeric) - 5024.112000000)    < 0.4 -- wells_fight scale
       or abs(abs((f->>'expected')::numeric) - 6962.756887867)    < 0.4 -- wells_fight total inflow
       or abs(abs((f->>'expected')::numeric) - 11986.868887867)   < 0.4 -- wells_fight total inflow
       or abs(abs((f->>'expected')::numeric) - 16740.257197)      < 0.4 -- teaching gap at an iteration cap of one
       or abs(abs((f->>'expected')::numeric) - 11917.121949)      < 0.4 -- teaching gap at an iteration cap of two
       or abs(abs((f->>'expected')::numeric) - 3075.664586)       < 0.4 -- teaching gap at an iteration cap of three
       or abs(abs((f->>'expected')::numeric) - 7545.876)          < 0.4 -- teaching residual at an iteration cap of one
       or abs(abs((f->>'expected')::numeric) - 5456.522)          < 0.4 -- teaching residual at an iteration cap of two
       or abs(abs((f->>'expected')::numeric) - 1503.768)          < 0.4 -- teaching residual at an iteration cap of three
       or abs(abs((f->>'expected')::numeric) - 1318.365)          < 0.4 -- teaching residual at an iteration cap of four
       or abs(abs((f->>'expected')::numeric) - 1013.848652)       < 0.4 -- teaching allocation crossing
       or abs(abs((f->>'expected')::numeric) - 1182.577035)       < 0.4 -- teaching capacity crossing
       or abs(abs((f->>'expected')::numeric) - 1257.276513629)    < 0.4 -- teaching wellhead
       or abs(abs((f->>'expected')::numeric) - 1188.244679299)    < 0.4 -- teaching wellhead
       or abs(abs((f->>'expected')::numeric) - 5010.508114909)    < 0.4 -- teaching deferment
       or abs(abs((f->>'expected')::numeric) - 1849.330593813)    < 0.4 -- teaching deferment
       or abs(abs((f->>'expected')::numeric) - 3225.367369636)    < 0.4 -- teaching deferment
       or abs(abs((f->>'expected')::numeric) - 2100.0)            < 0.4 -- teaching qmax
       or abs(abs((f->>'expected')::numeric) - 8100.0)            < 0.4 -- teaching qmax
       or abs(abs((f->>'expected')::numeric) - 3300.0)            < 0.4 -- teaching qmax
       or abs(abs((f->>'expected')::numeric) - 5750.0)            < 0.4 -- teaching qmax
       or abs(abs((f->>'expected')::numeric) - 2750.0)            < 0.4 -- teaching reservoir pressure
       or abs(abs((f->>'expected')::numeric) - 2350.0)            < 0.4 -- teaching reservoir pressure
       or abs(abs((f->>'expected')::numeric) - 2400.0)            < 0.4 -- golden reservoir pressure
       or abs(abs((f->>'expected')::numeric) - 1650.0)            < 0.4 -- digest sweep value
       or abs(abs((f->>'expected')::numeric) - 1450.0)            < 0.4);-- digest sweep value
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % graded field(s) at 1000 or above sit within 0.4 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'network' and c2.app_slug = 'network' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD7 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_maop  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='trunk_maop_psi';
  select (f->>'expected')::numeric into v_eqlen from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='trunk_fitting_eq_length_ft';
  select (f->>'expected')::numeric into v_sp1   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='solo_w1_wellhead_psia';
  select (f->>'expected')::numeric into v_sr1   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='solo_w1_rate_lbd';
  select (f->>'expected')::numeric into v_sp4   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='solo_w4_wellhead_psia';
  select (f->>'expected')::numeric into v_sr4   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='solo_w4_rate_lbd';
  select (f->>'expected')::numeric into v_h1    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_header_h1_psia';
  select (f->>'expected')::numeric into v_m     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_satellite_m_psia';
  select (f->>'expected')::numeric into v_h2    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_tee_h2_psia';
  select (f->>'expected')::numeric into v_tr    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_trunk_mass_lbd';
  select (f->>'expected')::numeric into v_l1    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_bypass_mass_lbd';
  select (f->>'expected')::numeric into v_l2    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='net_crosslink_mass_lbd';
  select (f->>'expected')::numeric into v_f1    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='fight_w1_rate_lbd';
  select (f->>'expected')::numeric into v_f4    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='fight_w4_rate_lbd';
  select (f->>'expected')::numeric into v_water from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='stream_bypass_water_stbd';
  select (f->>'expected')::numeric into v_lin   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='exact_linear_h1_psia';
  select (f->>'expected')::numeric into v_prod  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='hidden_produced_lbd';
  select (f->>'expected')::numeric into v_gapf  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='network' and f->>'key'='hidden_gap_fraction';

  if v_maop is null or v_eqlen is null or v_sp1 is null or v_sr1 is null
     or v_sp4 is null or v_sr4 is null or v_h1 is null or v_m is null
     or v_h2 is null or v_tr is null or v_l1 is null or v_l2 is null
     or v_f1 is null or v_f4 is null or v_water is null or v_lin is null
     or v_prod is null or v_gapf is null then
    raise exception 'PD7 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ================= ASSOCIATE: THE LINE ==================================
  -- The published redundancy the pipe table's header calls its only self
  -- check, asserted at 1e-12 rather than at the three decimals the shipped
  -- gate uses. On this row it holds exactly.
  if abs(c_od - 2 * c_wall - c_bore) > 0.000000000001 then
    raise exception 'PD7 go-live refused: the trunk row fails its own redundancy, % in against a published bore of %, and that redundancy is the only thing standing behind the table', c_od - 2 * c_wall, c_bore;
  end if;

  v_sumk := 5 * 0.3 + 3 * 0.35 + 2 * 0.15 + 1 * 2 + 1 * 1;
  if abs(v_sumk - 5.85) > 0.000000000001 then
    raise exception 'PD7 go-live refused: the trunk fitting set no longer sums to 5.85 in resistance coefficients, it sums to %', v_sumk;
  end if;

  if abs(v_maop - 2 * c_yld * c_wall * c_df / c_od) > 0.000001 then
    raise exception 'PD7 go-live refused: the trunk rating of % psi is not Barlow, two yield times wall times design factor over the OUTSIDE diameter', v_maop;
  end if;
  v_bare := 2 * c_yld * c_wall / c_od;
  if abs(v_maop / v_bare - c_df) > 0.000000001 then
    raise exception 'PD7 go-live refused: the rating over the bare hoop stress is % rather than the 0.6 design factor, so the factor has stopped being the only thing between the two', v_maop / v_bare;
  end if;
  if v_maop >= v_bare then
    raise exception 'PD7 go-live refused: the rating of % psi is not below the bare hoop stress, so a design factor has stopped making a pipe safer', v_maop;
  end if;
  if v_maop < 4 * v_sp1 or v_maop < 4 * v_sp4 then
    raise exception 'PD7 go-live refused: the trunk rating of % psi is not more than four times both solo wellhead pressures, so the line is no longer comfortably rated for the system it carries', v_maop;
  end if;

  if abs(v_eqlen - v_sumk * (c_bore / 12) / c_ff) > 0.000001 then
    raise exception 'PD7 go-live refused: the equivalent length of % ft is not the summed resistance coefficients times the BORE in feet over the friction factor', v_eqlen;
  end if;
  if v_eqlen / (c_bore / 12) <= 400 then
    raise exception 'PD7 go-live refused: the fitting set is only % diameters of this pipe, so the Associate claim that a fixed diameters rule of thumb is a friction factor in disguise no longer has a case to make on it', v_eqlen / (c_bore / 12);
  end if;

  -- ================= ASSOCIATE: THE WELL ON ITS OWN =======================
  -- Vogel is q = qmax (1 - 0.2x - 0.8x^2) with x the wellhead over the
  -- reservoir pressure. Both wellheads are asserted below to sit strictly
  -- between the separator and their own reservoir pressures, so the clip at
  -- zero and one is never in play and is not written into these expressions.
  if abs(v_sr1 - c_q1 * (1 - 0.2 * (v_sp1 / c_p1) - 0.8 * (v_sp1 / c_p1) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the solo rate of % lb/d is not the Vogel inflow of a 7300 lb/d well at 3250 psia evaluated at the graded solo wellhead', v_sr1;
  end if;
  -- and the same rate read the other way round, through the flowline and the
  -- trunk in series against the separator. Two independent statements meeting
  -- on one pair of numbers is what fixes a solo solve at all.
  if abs(v_sr1 - c_kf1 * sqrt(v_sp1 - c_sep - (v_sr1 / c_ktr) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the solo rate of % lb/d does not close through the 430 flowline and the 815 trunk in series onto the 235 psia separator', v_sr1;
  end if;
  if abs(v_sr4 - c_q4 * (1 - 0.2 * (v_sp4 / c_p4) - 0.8 * (v_sp4 / c_p4) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the solo rate of % lb/d is not the Vogel inflow of an 1850 lb/d well at 1180 psia evaluated at the graded solo wellhead', v_sr4;
  end if;
  if abs(v_sr4 - c_kf4 * sqrt(v_sp4 - c_sep - (v_sr4 / c_ktr) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the solo rate of % lb/d does not close through the 232 flowline and the 815 trunk in series onto the 235 psia separator', v_sr4;
  end if;
  if not (v_sp1 > c_sep and v_sp1 < c_p1) then
    raise exception 'PD7 go-live refused: the solo wellhead of % psia does not sit between the separator and its own reservoir pressure, so it is not a producing solution at all', v_sp1;
  end if;
  if not (v_sp4 > c_sep and v_sp4 < c_p4) then
    raise exception 'PD7 go-live refused: the solo wellhead of % psia does not sit between the separator and its own reservoir pressure, so it is not a producing solution at all', v_sp4;
  end if;
  if v_sp1 <= v_sp4 then
    raise exception 'PD7 go-live refused: the strong well''s solo wellhead of % psia is not above the weak well''s, so the two are no longer far enough apart to be worth putting on one header', v_sp1;
  end if;
  if v_sr1 <= 4 * v_sr4 then
    raise exception 'PD7 go-live refused: the strong well makes only % times the weak one alone, so the pair is no longer the mismatch the Expert tier''s fight result needs', v_sr1 / v_sr4;
  end if;

  -- ================= PROFESSIONAL: THE SOLVE ==============================
  if abs(v_tr - c_ktr * sqrt(v_h2 - c_sep)) > 0.000001 then
    raise exception 'PD7 go-live refused: the trunk mass of % lb/d is not 815 times the root of the trunk tee pressure less the 235 psia separator', v_tr;
  end if;
  if abs(v_l1 - c_kl1 * sqrt(v_h1 - v_h2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the west bypass mass of % lb/d is not 980 times the root of the manifold less the trunk tee', v_l1;
  end if;
  if abs(v_l2 + c_kl2 * sqrt(v_m - v_h1)) > 0.000001 then
    raise exception 'PD7 go-live refused: the crosslink mass of % lb/d is not MINUS 460 times the root of the satellite tee less the manifold, which is the drawn sign convention applied to a branch that runs the other way', v_l2;
  end if;
  v_l3 := c_kl3 * sqrt(v_m - v_h2);
  if abs(v_l1 + v_l3 - v_tr) > 0.000001 then
    raise exception 'PD7 go-live refused: the west bypass and the satellite loop leg do not add to the trunk at the trunk tee, they are out by % lb/d, so the mass balance the whole solve rests on has stopped closing on the graded values', v_l1 + v_l3 - v_tr;
  end if;
  if v_l2 >= 0 then
    raise exception 'PD7 go-live refused: the crosslink mass of % lb/d is not negative, so the branch now runs the way it was drawn and the tier''s arrow finding has gone', v_l2;
  end if;
  if v_m <= v_h1 then
    raise exception 'PD7 go-live refused: the satellite tee at % psia no longer sits above the west manifold, which is the reason the crosslink runs backwards', v_m;
  end if;
  if not (v_m > v_h1 and v_h1 > v_h2 and v_h2 > c_sep) then
    raise exception 'PD7 go-live refused: the four pressures do not fall in the order satellite tee, manifold, trunk tee, separator, so the system no longer drains the way a gathering system must';
  end if;
  if (v_m - v_h1) >= 5 then
    raise exception 'PD7 go-live refused: the crosslink carries % psi, which is no longer close enough to zero difference for the cusp the Expert tier is about to be anywhere near this network', v_m - v_h1;
  end if;
  if (v_h2 - c_sep) <= 400 then
    raise exception 'PD7 go-live refused: the trunk carries only % psi, so the system no longer has the wide separation of pressure differences the bottleneck reading depends on', v_h2 - c_sep;
  end if;
  if (v_h2 - c_sep) / (v_m - v_h1) <= 100 then
    raise exception 'PD7 go-live refused: the trunk''s pressure difference is only % times the crosslink''s, so the crosslink is no longer an order of magnitude closer to its own cusp than anything else on the system', (v_h2 - c_sep) / (v_m - v_h1);
  end if;
  if (abs(v_l2) + v_l3) >= c_q3 then
    raise exception 'PD7 go-live refused: the satellite well would have to deliver % lb/d, at or above its own 6900 lb/d qmax, so the satellite tee''s balance is not physical', abs(v_l2) + v_l3;
  end if;
  if v_tr >= c_q1 + c_q2 + c_q3 + c_q4 + c_q5 then
    raise exception 'PD7 go-live refused: the trunk carries % lb/d, at or above the five wells'' qmax values added, so the system delivers more than its wells can make against no backpressure at all', v_tr;
  end if;

  -- THE TWO JUNCTION BALANCES CLOSED ALL THE WAY BACK TO THE WELL CURVES, and
  -- these are the strongest assertions in the file. Neither of the two wells
  -- below is graded anywhere, so each one's mass is recovered from the graded
  -- values by a junction balance and then fed back through its OWN Vogel curve
  -- at the wellhead its own flowline implies. If any graded pressure or mass
  -- were wrong, or if the allocated flowline were not sitting exactly on its
  -- capacity limit, neither of these could close.
  v_q3  := abs(v_l2) + v_l3;
  v_pw3 := v_m + (v_q3 / c_kf3) ^ 2;
  if abs(v_q3 - c_q3 * (1 - 0.2 * (v_pw3 / c_p3) - 0.8 * (v_pw3 / c_p3) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the satellite tee balance implies % lb/d down that well''s flowline, and that is not what its own Vogel curve makes at the wellhead the 390 flowline puts it at', v_q3;
  end if;
  v_q2  := v_l1 - v_f1 - v_f4 - c_cap - abs(v_l2);
  v_pw2 := v_h1 + (v_q2 / c_kf2) ^ 2;
  if abs(v_q2 - c_q2 * (1 - 0.2 * (v_pw2 / c_p2) - 0.8 * (v_pw2 / c_p2) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the west manifold balance, with the allocated flowline sitting exactly on its 1150 lb/d capacity limit, implies % lb/d from the remaining well, and that is not what its own Vogel curve makes at the wellhead the 505 flowline puts it at', v_q2;
  end if;
  if v_q2 <= 0 then
    raise exception 'PD7 go-live refused: the west manifold balance leaves % lb/d for the remaining well, so a well on this system is running backwards and the case is not the gathering system the course describes', v_q2;
  end if;

  -- ================= EXPERT: THE HOLE UNDER A CONVERGED FLAG ==============
  v_gap := v_prod - v_tr;
  if abs(v_gap - (c_alloc - c_cap)) > 0.000001 then
    raise exception 'PD7 go-live refused: what the conservation check calls produced, less what the trunk carries, is % lb/d and not the allocated well''s 1450 lb/d allocation less the 1150 lb/d its flowline can pass, so the hole is no longer the pinned node''s shortfall and the Expert tier is about something else', v_gap;
  end if;
  if abs(v_gapf - v_gap / v_prod) > 0.000000000001 then
    raise exception 'PD7 go-live refused: the relative gap of % is not that difference over the graded produced total', v_gapf;
  end if;
  if v_gapf <= 0.01 or v_gapf >= 0.02 then
    raise exception 'PD7 go-live refused: the relative conservation gap is %, outside the band that makes this a material loss of production rather than a rounding nobody would act on', v_gapf;
  end if;
  if v_prod <= v_tr then
    raise exception 'PD7 go-live refused: the produced total of % lb/d does not exceed what the trunk delivers, so the network no longer loses anything and the centre of the course has gone', v_prod;
  end if;

  -- THE SIZE OF THE SILENCE. The scale is recomputed here from the wells and
  -- the separator pressure rather than taken from the engine, because the
  -- engine never shows it to a caller at all.
  v_i1 := c_q1 * (1 - 0.2 * (c_sep / c_p1) - 0.8 * (c_sep / c_p1) ^ 2);
  v_i2 := c_q2 * (1 - 0.2 * (c_sep / c_p2) - 0.8 * (c_sep / c_p2) ^ 2);
  v_i3 := c_q3 * (1 - 0.2 * (c_sep / c_p3) - 0.8 * (c_sep / c_p3) ^ 2);
  v_i4 := c_q4 * (1 - 0.2 * (c_sep / c_p4) - 0.8 * (c_sep / c_p4) ^ 2);
  v_vog5 := c_q5 * (1 - 0.2 * (c_sep / c_p5) - 0.8 * (c_sep / c_p5) ^ 2);
  -- what the ENGINE's wellInflow returns for the allocated well is the smaller
  -- of its allocation and its curve, and that is what the scale is built from.
  v_i5 := least(c_alloc, v_vog5);
  v_scale := greatest(v_i1, v_i2, v_i3, v_i4, v_i5);
  if abs(v_scale - v_i1) > 0.000001 then
    raise exception 'PD7 go-live refused: the convergence scale is % lb/d and is not the strongest well''s inflow at the separator pressure, so the sentence the Expert tier writes about which single well sets the criterion is wrong', v_scale;
  end if;
  if not (v_scale > v_i2 and v_scale > v_i3 and v_scale > v_i4 and v_scale > v_i5) then
    raise exception 'PD7 go-live refused: the convergence scale does not strictly exceed every other well''s inflow at the separator pressure, so the finding that it is the largest SINGLE well rather than the total has nothing to show';
  end if;
  if v_scale >= v_prod then
    raise exception 'PD7 go-live refused: the scale of % lb/d is not below what the system produces, so the criterion no longer tightens as wells are added and the tier''s point about a relative scale used backwards is gone', v_scale;
  end if;
  if v_scale <= 1000 then
    raise exception 'PD7 go-live refused: the convergence scale is only % lb/d, so the module''s documented default tolerance is no longer materially looser than the lb/d its own name promises', v_scale;
  end if;
  v_target := greatest(c_tol, c_tol * v_scale);
  if v_gap / v_target <= 10000000000 then
    raise exception 'PD7 go-live refused: the conservation gap is only % times the target the solve actually stopped at, which is not far enough for the gap between what the solver reports about itself and what is true to be the headline of a course', v_gap / v_target;
  end if;

  -- ================= EXPERT: A CORRECT ANSWER EXISTS ======================
  -- The Vogel inverse, written out rather than iterated, so this file does not
  -- depend on a solver to make its point about a solver. x solves
  -- 0.8 x^2 + 0.2 x - (1 - q/qmax) = 0.
  v_xcap := (-0.2 + sqrt(0.04 + 3.2 * (1 - c_cap / c_q5))) / 1.6;
  v_pcap := v_xcap * c_p5;
  v_xall := (-0.2 + sqrt(0.04 + 3.2 * (1 - c_alloc / c_q5))) / 1.6;
  v_pall := v_xall * c_p5;
  if abs(c_q5 * (1 - 0.2 * v_xcap - 0.8 * v_xcap ^ 2) - c_cap) > 0.000001 then
    raise exception 'PD7 go-live refused: the pressure at which the allocated well''s inflow falls to its line capacity does not return that capacity, so the consistent answer this network has does not exist and the finding that the default guess misses one is false';
  end if;
  if v_pcap <= v_pall then
    raise exception 'PD7 go-live refused: the capacity crossing at % psia is not above the allocation crossing, so the flat top no longer sits between the default start and the solution and the trap is not the trap', v_pcap;
  end if;
  if v_pcap >= c_p5 then
    raise exception 'PD7 go-live refused: the capacity crossing at % psia is not below the well''s own reservoir pressure, so the solution is not on the well''s curve at all', v_pcap;
  end if;
  if v_vog5 <= c_alloc then
    raise exception 'PD7 go-live refused: the allocated well''s Vogel inflow at the separator pressure is % lb/d and does not exceed its allocation, so the engine''s default start is no longer inside the flat top and the default no longer starts inside the trap', v_vog5;
  end if;
  if v_pcap - c_sep <= 500 then
    raise exception 'PD7 go-live refused: the solution sits only % psi above the default start, which is close enough that the solver missing it would be a near miss rather than the structural failure this tier reports', v_pcap - c_sep;
  end if;
  -- AND THE LINE IS CAPACITY BOUND RATHER THAN CONDUCTANCE BOUND, which is
  -- what makes the node pinnable at all: at the consistent solution the
  -- uncapped 210 flowline would pass four times its own limit.
  if c_kf5 * sqrt(v_pcap - v_h1) <= c_cap then
    raise exception 'PD7 go-live refused: the allocated well''s uncapped flowline would pass only % lb/d against a 1150 lb/d limit, so the limit never binds, the node never goes flat and there is nothing to pin', c_kf5 * sqrt(v_pcap - v_h1);
  end if;

  -- ================= EXPERT: THE FIGHT ====================================
  -- Each system rate is checked against the well's own inflow curve evaluated
  -- at the wellhead the graded rate and the graded manifold pressure imply,
  -- which ties the Expert answer to the Professional one without either
  -- prompt stating the other's number.
  v_pw1 := v_h1 + (v_f1 / c_kf1) ^ 2;
  if abs(v_f1 - c_q1 * (1 - 0.2 * (v_pw1 / c_p1) - 0.8 * (v_pw1 / c_p1) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the system rate of % lb/d is not the strong well''s Vogel inflow at the wellhead its own flowline and the graded manifold imply', v_f1;
  end if;
  v_pw4 := v_h1 + (v_f4 / c_kf4) ^ 2;
  if abs(v_f4 - c_q4 * (1 - 0.2 * (v_pw4 / c_p4) - 0.8 * (v_pw4 / c_p4) ^ 2)) > 0.000001 then
    raise exception 'PD7 go-live refused: the system rate of % lb/d is not the weak well''s Vogel inflow at the wellhead its own flowline and the graded manifold imply', v_f4;
  end if;
  if v_f1 >= v_sr1 then
    raise exception 'PD7 go-live refused: the strong well makes % lb/d on the system, which is not below what it makes alone, so the network costs it nothing and the fight has gone', v_f1;
  end if;
  if v_f4 >= v_sr4 then
    raise exception 'PD7 go-live refused: the weak well makes % lb/d on the system, which is not below what it makes alone, so the network costs it nothing and the fight has gone', v_f4;
  end if;
  v_losss := (v_sr1 - v_f1) / v_sr1;
  v_lossw := (v_sr4 - v_f4) / v_sr4;
  if v_lossw <= v_losss then
    raise exception 'PD7 go-live refused: the weak well loses % of itself against the strong well''s %, so the weak well no longer loses the larger fraction and the result the Professional and Expert tiers share has gone', v_lossw, v_losss;
  end if;
  if v_f1 <= v_f4 then
    raise exception 'PD7 go-live refused: the strong well is not still the larger rate on the system, so the two rankings no longer disagree and the reason an allocation meeting gets this wrong has gone with them';
  end if;
  if v_f4 >= 0.5 * v_sr4 then
    raise exception 'PD7 go-live refused: the weak well keeps % of itself on the system, so it no longer loses more than half and the size of the fight is no longer the point', v_f4 / v_sr4;
  end if;
  if v_losss <= 0.05 or v_losss >= 0.20 then
    raise exception 'PD7 go-live refused: the strong well loses %, outside the band that makes its loss real without being the story, which is what the reversal of the two rankings needs', v_losss;
  end if;

  -- ================= EXPERT: THE STREAM AND THE SECOND MASS ===============
  v_share := abs(v_l2) / (abs(v_l2) + v_l3);
  if abs(v_water - (c_wat1 + c_wat2 + c_wat4 + c_wat5 + c_wat3 * v_share)) > 0.000001 then
    raise exception 'PD7 go-live refused: the water on the west bypass of % stb/d is not the four west wells'' tested water plus the satellite well''s share, split at its tee by MASS and carried back over the reversed crosslink', v_water;
  end if;
  if v_water <= c_wat1 + c_wat2 + c_wat4 + c_wat5 then
    raise exception 'PD7 go-live refused: the bypass water of % stb/d does not exceed the four west wells'' own water, so nothing comes back over the crosslink and the reversed branch has stopped mattering to the split', v_water;
  end if;
  if v_water >= c_wat1 + c_wat2 + c_wat3 + c_wat4 + c_wat5 then
    raise exception 'PD7 go-live refused: the bypass water of % stb/d is the whole field''s water or more, so the satellite tee no longer splits anything and the mass share the stream propagation runs on has stopped being a share', v_water;
  end if;
  -- THE SECOND MASS. The bypass's STREAM mass is everything the wells report
  -- less what leaves down the satellite loop leg, and it exceeds the bypass's
  -- SOLVE mass by exactly the conservation gap, with nothing in the return to
  -- say so. That identity IS the finding.
  if abs((v_prod - v_l3 - v_l1) - v_gap) > 0.000001 then
    raise exception 'PD7 go-live refused: the bypass stream mass exceeds its solve mass by % lb/d rather than by the conservation gap, so the hole no longer propagates cleanly into the surface split and the second mass finding has lost its arithmetic', v_prod - v_l3 - v_l1;
  end if;

  -- ================= EXPERT: THE ONE ANSWER THAT IS NOT AN ITERATE ========
  -- The linearised twin rebuilt in full: every node's net must close, with the
  -- GRADED manifold pressure in place. Linear well inflow is qmax (1 - p/pr)
  -- and every branch is a plain conductance, so the whole system is a weighted
  -- graph Laplacian and this is its solution or it is not.
  v_ih1 := c_cf1 * (c_lw1 - v_lin) + c_cf2 * (c_lw2 - v_lin)
         + c_cf4 * (c_lw4 - v_lin) + c_cf5 * (c_lw5 - v_lin)
         - c_cl1 * (v_lin - c_lh2) - c_cl2 * (v_lin - c_lm);
  if abs(v_ih1) > 0.000001 then
    raise exception 'PD7 go-live refused: the linearised twin''s manifold balance does not close on the graded pressure, it is out by % lb/d, so the one answer in this capstone that needs no tolerance has stopped being one', v_ih1;
  end if;
  v_im  := c_cf3 * (c_lw3 - c_lm) + c_cl2 * (v_lin - c_lm) - c_cl3 * (c_lm - c_lh2);
  v_ih2 := c_cl1 * (v_lin - c_lh2) + c_cl3 * (c_lm - c_lh2) - c_ctr * (c_lh2 - c_sep);
  v_worst := greatest(
    abs(c_q1 * (1 - c_lw1 / c_p1) - c_cf1 * (c_lw1 - v_lin)),
    abs(c_q2 * (1 - c_lw2 / c_p2) - c_cf2 * (c_lw2 - v_lin)),
    abs(c_q3 * (1 - c_lw3 / c_p3) - c_cf3 * (c_lw3 - c_lm)),
    abs(c_q4 * (1 - c_lw4 / c_p4) - c_cf4 * (c_lw4 - v_lin)),
    abs(c_q5 * (1 - c_lw5 / c_p5) - c_cf5 * (c_lw5 - v_lin)),
    abs(v_im), abs(v_ih2));
  if v_worst > 0.000001 then
    raise exception 'PD7 go-live refused: the linearised twin''s other seven node balances do not close, the worst is out by % lb/d, so the graded manifold pressure is not part of a solution of that system', v_worst;
  end if;
  if v_h1 - v_lin <= 200 then
    raise exception 'PD7 go-live refused: the linear twin''s manifold is only % psi below the turbulent one, so a learner who reused the turbulent answer would land close enough to pass and lb/d per psi against lb/d per root psi has stopped being a distinction with a consequence', v_h1 - v_lin;
  end if;

  -- ================= EXPERT: THE BOTTLENECK IS NOT THE BIGGEST DROP =======
  if (v_h2 - c_sep) <= greatest(v_h1 - v_h2, v_m - v_h2, v_m - v_h1) then
    raise exception 'PD7 go-live refused: the trunk no longer carries the biggest pressure difference on the system, so diagnose''s claim that a trunk is supposed to have the biggest drop has nothing on this network to make it with';
  end if;
  if (v_m - v_h2) / v_l3 <= (v_h2 - c_sep) / v_tr then
    raise exception 'PD7 go-live refused: the trunk now burns the most pressure per unit mass as well as the most pressure, so the bottleneck and the biggest drop are the same branch and the tier''s reading of diagnose collapses into one word';
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'network' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'network' and status = 'available') then
    raise exception 'PD7 go-live refused: network did not reach status available';
  end if;

  raise notice 'PD7 go-live: network is available, behind nodal, at path_order 36.';
end $$;
