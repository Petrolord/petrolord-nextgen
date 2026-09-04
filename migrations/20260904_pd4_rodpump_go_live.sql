-- ============================================================================
-- PD4 GO-LIVE (HELD): Rod Pump Design flips to 'available'. This is the FOURTH
-- Production & Artificial Lift course, sitting behind 'nodal' at path_order 33.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/rodpump. That upload is the gate, and
-- nothing else releases this file. Running it earlier publishes a course whose
-- app the learner cannot open.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and most are deliberately written as PAIRS, because a one-sided
-- check passes on a capstone quietly recut into exactly the mistake the course
-- exists to correct. That rule was learnt the expensive way in DR7, where the
-- first clean run of a go-live REFUSED because the assertion had been written
-- from the intuition the prompt was drafted with rather than from what the
-- engine actually returns.
--
-- THE PAIR THAT MATTERS MOST IS THE OVERTRAVEL. The static spring rule says
-- the plunger loses exactly the rod stretch. The damped wave equation says it
-- travels further, and on this well the gap is 10.83 in, which is 10.51 percent
-- of the static rule's own answer and 8.92 percent of the surface stroke. The
-- assertion below is written against the SURFACE stroke, so its floor is 5
-- percent rather than 10. Both sides are graded in the Professional tier. Asserting
-- only that the wave answer sits below the surface stroke would pass on a
-- capstone recut where the two agree, and two whole modules would then be
-- teaching a distinction their own capstone no longer contains. So the check
-- is three-sided: the wave answer must sit BELOW the surface stroke, must sit
-- ABOVE the static rule, and the gap between it and the static rule must stay
-- LARGE ENOUGH to be the tier's headline.
--
-- THE SECOND PAIR IS THE SUBSAMPLE, AND IT RUNS IN OPPOSITE DIRECTIONS. The
-- reported peak polished rod load is LOW against the marched envelope and the
-- reported minimum is HIGH against it, because a coarse sample is least likely
-- to land on an extreme and a minimum has further to travel. Both graded
-- fields are the SUBSAMPLED ones, because runRodPumpDesign exposes neither
-- `cardSamples` nor `nodes` and the subsampled pair is what a studio user
-- receives. The full resolution pair appears below as ENGINE CONSTANTS. The
-- assertion requires the peak to be understated AND the minimum to be
-- overstated by more than a factor of two and a half: a capstone recut at full
-- resolution satisfies neither, and the Expert tier's opening result would
-- have vanished without a single number in the seed changing shape.
--
-- A THIRD PAIR GUARDS THE FILLAGE CLIFF, and it is a threshold rather than an
-- edge. runRodPumpDesign warns `incompleteFillage` strictly below 0.85 and
-- this barrel fills 0.853, so a pump fifteen percent short of full raises no
-- warning at all. Production at 0.849, where the warning does fire, is
-- 249.27311533306815 bbl/d. The graded production must EXCEED that and must
-- exceed it by LESS than 0.6 bbl/d, which is the whole point: the two designs
-- are on opposite sides of a warning and half a barrel a day apart. Only the
-- second half of that pair says the cliff is in the code rather than in the
-- pump.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE TWO. A single absolute
-- window across fields spanning four orders of magnitude will refuse a value
-- thousands of grader tolerances clear of any golden, which is as much a
-- defect as a window that misses. So the guard is split by magnitude, and both
-- numbers are recorded here as the kit requires.
--
--   SMALL GROUP, the ten fields below 400 (stretches, strokes, frequencies,
--   powers, percentages, rates and the spring rate). Largest grader tolerance
--   in the group 7.3e-5. Nearest real published neighbour anywhere in the
--   group 0.00221522, which is the natural frequency of 46.52548077 against a
--   published diagnose position of 46.52769599. A window of 3e-4 therefore
--   sits 4.1 TIMES ABOVE the largest tolerance it covers and 7.4 TIMES BELOW
--   the nearest neighbour it must not catch.
--
--   LARGE GROUP, the eight fields above 3000 (loads, moments and torques).
--   Largest grader tolerance in the group 0.13. Nearest real published
--   neighbour 34.958, the buoyed weight of 11903.8966 against a published
--   diagnose load of 11868.9387. A window of 1.0 sits 7.7 TIMES ABOVE the
--   largest tolerance and 35 TIMES BELOW the nearest neighbour.
--
-- The 46.5 approach is worth reading rather than skipping. It is a natural
-- frequency in spm landing 0.0022 from a rod POSITION in inches, on a
-- different well, in a different quantity, in a different unit. It is a
-- coincidence of magnitude and not a lookup, and the sweep of eighteen graded
-- values against 5184 published numbers, the goldens and the teaching digest
-- together, found zero collisions and zero integer notes.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE. A prompt is the one text a learner
-- reads WHILE being graded. This course's prompts restate the string, the
-- linkage and the pump from raw geometry in all three tiers precisely so that
-- no tier has to be handed another tier's answer as a condition. Five figures
-- were drafted into prompts and removed: the static rule's own plunger stroke,
-- the ratio of plunger stroke to surface stroke, the full resolution load
-- pair, the round trip gaps and the critical service factor. Every one of them
-- divides or subtracts straight back to a graded field in a different tier.
-- The gate below re-reads the STORED prompts so a later edit cannot put one
-- back silently.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_kr    numeric; v_buoy  numeric; v_freq  numeric; v_stroke numeric;
  v_fo    numeric; v_rated numeric;
  v_er    numeric; v_sp    numeric; v_pprl  numeric; v_mprl   numeric;
  v_prhp  numeric; v_prod  numeric;
  v_mom   numeric; v_torq  numeric; v_cbe   numeric; v_load   numeric;
  v_dsp   numeric; v_dpl   numeric;
  v_static numeric;
  -- Engine outputs that are NOT graded, carried here so the assertions can be
  -- written against what the engine returns rather than against the seed.
  c_weight_air     constant numeric := 13523.24;              -- rodString weightAirLb
  c_buoyancy       constant numeric := 0.8802547770700637;    -- the 0.94 fluid's factor
  c_er             constant numeric := 0.004202437373950929;  -- elastic constant, in/lb
  c_n0             constant numeric := 40.15458511472821;     -- uniform fundamental, spm
  c_taper          constant numeric := 1.1586592325962348;    -- taper factor
  c_naive_stroke   constant numeric := 111.45474860335197;    -- 2*r*a/c, the handbook shorthand
  c_pump_constant  constant numeric := 0.11657115597735782;   -- bbl/d per in2 per in per spm
  c_work_per_cycle constant numeric := 783182.6554494038;     -- in-lb, the card area
  c_full_pprl      constant numeric := 23248.018127217023;    -- the marched envelope, not the subsample
  c_full_mprl      constant numeric := 1125.2296606866257;    -- ditto
  c_below_cliff    constant numeric := 249.27311533306815;    -- production at fillage 0.849
  c_torque_no_unb  constant numeric := 595149.7229468387;     -- peak torque with the unbalance omitted
  c_torque_rating  constant numeric := 640000;                -- C-640D-305-144
  c_spm            constant numeric := 11.4;
  c_plunger_d      constant numeric := 1.5;
  c_fillage        constant numeric := 0.853;
  c_pump_eff       constant numeric := 0.86;
  c_front_arm      constant numeric := 118.4;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'rodpump' and active;
  if v_structures <> 3 then
    raise exception 'PD4 go-live refused: rodpump has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'rodpump';
  if v_questions <> 396 then
    raise exception 'PD4 go-live refused: rodpump has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'rodpump';
  if v_capstones <> 3 then
    raise exception 'PD4 go-live refused: rodpump has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'rodpump'
                   and module = 'production' and path_order = 33 and prereq_slug = 'nodal') then
    raise exception 'PD4 go-live refused: the rodpump catalog row is not production/33 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD4 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- These four engines size a rod string, close a linkage, march a card and
  -- balance a gearbox. Nothing in them solves an inflow, forecasts a decline,
  -- books a reserve or prices a barrel, and the production they report is a
  -- pump displacement rather than a stock tank rate against an IPR. Nothing
  -- here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'rodpump'
     and (f->>'label' ilike '%reserve%'  or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'  or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'    or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%probabilit%'
       or f->>'label' ilike '%skin%'     or f->>'label' ilike '%permeab%'
       or f->>'label' ilike '%inflow%'   or f->>'label' ilike '%productivity%'
       or f->>'unit'  ilike '%usd%'      or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psig%'     or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'PD4 go-live refused: % capstone field(s) grade a quantity these rod pump engines cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Two windows, sized in the header. Each published value below is the
  -- nearest real neighbour of at least one graded field.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'rodpump'
     and (abs((f->>'expected')::numeric - 254.726031943899)  < 0.0003 -- uniform string spring rate
       or abs((f->>'expected')::numeric - 46.527695991665)   < 0.0003 -- a published diagnose position
       or abs((f->>'expected')::numeric - 106.689319801576)  < 0.0003 -- the golden unit stroke
       or abs((f->>'expected')::numeric - 18.984427421574)   < 0.0003 -- a published diagnose position
       or abs((f->>'expected')::numeric - 22.111456180002)   < 0.0003 -- a published diagnose position
       or abs((f->>'expected')::numeric - 105.993381109691)  < 0.0003 -- a published unit position sample
       or abs((f->>'expected')::numeric - 395.090372522192)  < 0.0003 -- published pump load minimum
       or abs((f->>'expected')::numeric - 11868.938653739)   < 1.0    -- a published diagnose load
       or abs((f->>'expected')::numeric - 4235.608307818561) < 1.0    -- published pump load maximum
       or abs((f->>'expected')::numeric - 16545.574080121)   < 1.0    -- published pprl at 9 spm
       or abs((f->>'expected')::numeric - 15231.366293700)   < 1.0    -- published pprl at 5 spm
       or abs((f->>'expected')::numeric - 3000)              < 1.0);  -- a published section length
  if v_graded <> 0 then
    raise exception 'PD4 go-live refused: % graded field(s) sit within a window of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- Commas are stripped first, because a prompt writes 22,844.62490875651
  -- where the answer key holds 22844.62490875651 and the two are the same leak.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'rodpump' and c2.app_slug = 'rodpump' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD4 go-live refused: % capstone prompt(s) state a graded value belonging to another tier, which hands a learner an answer they are about to be graded on', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_kr     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='string_kr_lb_per_in';
  select (f->>'expected')::numeric into v_buoy   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='string_buoyed_weight_lb';
  select (f->>'expected')::numeric into v_freq   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='string_natural_freq_spm';
  select (f->>'expected')::numeric into v_stroke from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='unit_stroke_in';
  select (f->>'expected')::numeric into v_fo     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='pump_fluid_load_lb';
  select (f->>'expected')::numeric into v_rated  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='pump_rated_displacement_bpd';
  select (f->>'expected')::numeric into v_er     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_static_stretch_in';
  select (f->>'expected')::numeric into v_sp     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_plunger_stroke_in';
  select (f->>'expected')::numeric into v_pprl   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_pprl_lb';
  select (f->>'expected')::numeric into v_mprl   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_mprl_lb';
  select (f->>'expected')::numeric into v_prhp   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_prhp_hp';
  select (f->>'expected')::numeric into v_prod   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='design_produced_bpd';
  select (f->>'expected')::numeric into v_mom    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='balance_moment_in_lb';
  select (f->>'expected')::numeric into v_torq   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='balance_peak_torque_in_lb';
  select (f->>'expected')::numeric into v_cbe    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='balance_cbe_lb';
  select (f->>'expected')::numeric into v_load   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='stress_worst_loading_pct';
  select (f->>'expected')::numeric into v_dsp    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='diag_plunger_stroke_in';
  select (f->>'expected')::numeric into v_dpl    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='rodpump' and f->>'key'='diag_pump_load_max_lb';

  if v_kr is null or v_buoy is null or v_freq is null or v_stroke is null
     or v_fo is null or v_rated is null or v_er is null or v_sp is null
     or v_pprl is null or v_mprl is null or v_prhp is null or v_prod is null
     or v_mom is null or v_torq is null or v_cbe is null or v_load is null
     or v_dsp is null or v_dpl is null then
    raise exception 'PD4 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------- Associate: ARCHIMEDES, AS AN EQUALITY ---------------
  if abs(v_buoy - c_weight_air * c_buoyancy) > 0.0005 then
    raise exception 'PD4 go-live refused: the buoyed weight of % lb is not the 13523.24 lb weight in air times the 0.94 fluid buoyancy factor', v_buoy;
  end if;
  if v_buoy >= c_weight_air then
    raise exception 'PD4 go-live refused: the buoyed weight of % lb does not sit below the weight in air, so the string is no longer hanging in a fluid', v_buoy;
  end if;

  -- ------------------- Associate: THE TAPER RAISES THE NOTE, AS A PAIR ----
  -- A stepped bar has a fundamental of its own and the taper multiplies it.
  -- Asserting only that the graded frequency exceeds the uniform one would
  -- pass on a string whose taper had shrunk to nothing, and module 3 would be
  -- teaching a distinction its own capstone had lost.
  if v_freq <= c_n0 then
    raise exception 'PD4 go-live refused: the natural frequency of % spm does not exceed the uniform fundamental of 40.15458511 spm, so the taper no longer raises the note', v_freq;
  end if;
  if abs(v_freq - c_n0 * c_taper) > 0.0003 then
    raise exception 'PD4 go-live refused: the natural frequency of % spm is not the uniform fundamental times the 1.15865923 taper factor, so one of the two is no longer this string', v_freq;
  end if;
  if v_freq <= c_spm * 3 then
    raise exception 'PD4 go-live refused: the natural frequency of % spm is within a factor of three of the 11.4 spm operating speed, which is a different design problem from the one this course teaches', v_freq;
  end if;

  -- ------------------- Associate: THE LINKAGE, AS A PAIR -------------------
  -- One relation that must HOLD and one that must NOT. The four-bar stroke
  -- must exceed the handbook shorthand, and it must not EQUAL it, because a
  -- capstone whose pitman had been made long enough to vindicate the
  -- shorthand would satisfy the first check and destroy module 4's argument.
  if v_stroke <= c_naive_stroke then
    raise exception 'PD4 go-live refused: the surface stroke of % in does not exceed the 111.45474860 in handbook shorthand, so the four-bar was closed on the wrong branch or the shorthand is no longer wrong here', v_stroke;
  end if;
  if v_stroke - c_naive_stroke < 5 then
    raise exception 'PD4 go-live refused: the surface stroke of % in is within 5 in of the handbook shorthand, so the small angle approximation module 4 is built on is no longer worth teaching on this unit', v_stroke;
  end if;
  if v_stroke >= 144 then
    raise exception 'PD4 go-live refused: the surface stroke of % in reaches the 144 in the C-640D-305-144 is rated for, so the unit is outside its own stroke rating', v_stroke;
  end if;

  -- ------------------- Associate: THE PUMP, AS TWO EQUALITIES --------------
  if abs(v_fo / (pi() / 4 * c_plunger_d * c_plunger_d) - 2470) > 0.001 then
    raise exception 'PD4 go-live refused: the fluid load of % lb over the 1.5 in plunger area is not the 2470 psi differential, so it has picked up a depth or a gravity it should not carry', v_fo;
  end if;
  if abs(v_rated - c_pump_constant * c_plunger_d * c_plunger_d * v_stroke * c_spm) > 0.0002 then
    raise exception 'PD4 go-live refused: the rated displacement of % bbl/d is not the pump constant times the plunger area factor times the SURFACE stroke times 11.4 spm', v_rated;
  end if;

  -- ------------------- Professional: THE OVERTRAVEL, THREE SIDED ----------
  -- The centre of the course. The static rule is the surface stroke less the
  -- stretch; the wave answer must sit above it and below the surface stroke,
  -- and the gap must stay big enough to be the thing two modules are about.
  v_static := v_stroke - v_er;
  if v_sp >= v_stroke then
    raise exception 'PD4 go-live refused: the plunger stroke of % in is not below the surface stroke of % in', v_sp, v_stroke;
  end if;
  if v_sp <= v_static then
    raise exception 'PD4 go-live refused: the plunger stroke of % in does not exceed the static spring rule answer of % in, so the inertial overtravel this tier is built on has changed sign', v_sp, v_static;
  end if;
  if (v_sp - v_static) / v_stroke < 0.05 then
    raise exception 'PD4 go-live refused: the overtravel is only % percent of the surface stroke, so the spring rule and the wave equation now agree closely enough that grading both teaches nothing', (v_sp - v_static) / v_stroke * 100;
  end if;
  if abs(v_er - v_fo * c_er) > 0.000002 then
    raise exception 'PD4 go-live refused: the static stretch of % in is not the fluid load times the string elastic constant of 0.004202437373950929 in/lb', v_er;
  end if;

  -- ------------------- Professional: THE LOADS AND THE POWER ---------------
  if v_pprl <= v_buoy then
    raise exception 'PD4 go-live refused: the peak polished rod load of % lb does not exceed the buoyed string weight of % lb', v_pprl, v_buoy;
  end if;
  if v_mprl <= 0 or v_mprl >= v_buoy then
    raise exception 'PD4 go-live refused: the minimum polished rod load of % lb is not positive and below the buoyed string weight', v_mprl;
  end if;
  if abs(v_prhp - c_work_per_cycle * c_spm / 396000) > 0.000005 then
    raise exception 'PD4 go-live refused: the polished rod horsepower of % hp is not the 783182.6554494038 in-lb card area times 11.4 spm over 396000', v_prhp;
  end if;

  -- ------------------- Professional: PRODUCTION, AND THE CLIFF -------------
  if abs(v_prod - c_pump_constant * c_plunger_d * c_plunger_d * v_sp * c_spm * c_fillage * c_pump_eff) > 0.0002 then
    raise exception 'PD4 go-live refused: the production of % bbl/d is not the pump constant on the PLUNGER stroke times the fillage times the efficiency', v_prod;
  end if;
  if v_prod >= v_rated then
    raise exception 'PD4 go-live refused: the production of % bbl/d is not below the rated displacement of % bbl/d', v_prod, v_rated;
  end if;
  if v_prod <= c_below_cliff then
    raise exception 'PD4 go-live refused: production at fillage 0.853 is % bbl/d, not above the 249.27311533306815 bbl/d the same well makes at 0.849 where the warning fires', v_prod;
  end if;
  if v_prod - c_below_cliff > 0.6 then
    raise exception 'PD4 go-live refused: production at fillage 0.853 is % bbl/d more than at 0.849, so the two sides of the warning threshold are no longer within half a barrel a day of each other and the cliff is no longer a threshold in the code', v_prod - c_below_cliff;
  end if;

  -- ------------------- Expert: THE SUBSAMPLE, IN BOTH DIRECTIONS -----------
  if v_pprl >= c_full_pprl then
    raise exception 'PD4 go-live refused: the reported peak load of % lb is not below the 23248.018127217023 lb the march accumulated, so the decimation no longer understates the peak', v_pprl;
  end if;
  if v_mprl <= c_full_mprl then
    raise exception 'PD4 go-live refused: the reported minimum load of % lb is not above the 1125.2296606866257 lb the march accumulated, so the decimation no longer overstates the minimum', v_mprl;
  end if;
  if v_mprl / c_full_mprl < 2.5 then
    raise exception 'PD4 go-live refused: the reported minimum load is only % times the marched minimum, so the headline result of the Expert tier has shrunk below the size the lessons state', v_mprl / c_full_mprl;
  end if;

  -- ------------------- Expert: THE COUNTERBALANCE, AS A BRACKET ------------
  -- The module header names the standard error outright: the counterbalance
  -- effect is NOT the moment over the beam's front arm, because the torque
  -- factor at the quarter turn is not an arm length, and the arm understates
  -- the effect by roughly a factor of two. The bracket asserts both that the
  -- arm is wrong and that it is wrong by about that much.
  if v_cbe <= 2 * v_mom / c_front_arm then
    raise exception 'PD4 go-live refused: the counterbalance effect of % lb is not more than twice the moment over the 118.4 in front arm, so the misconception module 3 corrects is no longer present on this unit', v_cbe;
  end if;
  if v_cbe >= 3 * v_mom / c_front_arm then
    raise exception 'PD4 go-live refused: the counterbalance effect of % lb is more than three times the moment over the front arm, which is outside the range a real crank geometry gives and suggests the quarter turn sample has moved', v_cbe;
  end if;

  -- ------------------- Expert: THE UNBALANCE THAT DOES SOMETHING -----------
  -- The design routine ignores the unbalance and the balancing routine reads
  -- it. Asserting only that the graded torque is under the unit rating would
  -- say nothing about which of the two routines produced it.
  if v_torq >= c_torque_no_unb then
    raise exception 'PD4 go-live refused: the peak torque of % in-lb is not below the 595149.7229468387 in-lb the same card gives with the structural unbalance omitted, so the 810 lb is no longer being read', v_torq;
  end if;
  if v_torq >= c_torque_rating then
    raise exception 'PD4 go-live refused: the peak torque of % in-lb reaches the 640000 in-lb the C-640D is rated for, so the gearbox is outside its rating and the course''s claim that only the rods are wrong is false', v_torq;
  end if;
  if v_torq / c_torque_rating < 0.8 then
    raise exception 'PD4 go-live refused: the peak torque is only % percent of the unit rating, so the gearbox is no longer close enough to its limit for the tier''s reading of this unit to hold', v_torq / c_torque_rating * 100;
  end if;

  -- ------------------- Expert: THE RODS ARE THE ONLY THING WRONG -----------
  if v_load <= 100 then
    raise exception 'PD4 go-live refused: the worst rod loading of % percent does not exceed 100, so the design is no longer refused and the capstone has become a comfortable one', v_load;
  end if;
  if v_load >= 115 then
    raise exception 'PD4 go-live refused: the worst rod loading of % percent is so far over the allowable that the service factor judgement the tier turns on no longer decides anything', v_load;
  end if;

  -- ------------------- Expert: THE ROUND TRIP, AS A PAIR -------------------
  -- Both halves of the diagnostic's disagreement with its own march run the
  -- same way. Asserting one of them would pass on a diagnostic that had
  -- drifted the other way on the other, which is the case worth catching
  -- because it would mean the harmonic solver had changed and not the card.
  if v_dsp <= v_sp then
    raise exception 'PD4 go-live refused: the diagnosed plunger stroke of % in does not exceed the predicted % in, so the round trip no longer runs the way the tier states', v_dsp, v_sp;
  end if;
  if v_dsp - v_sp > 0.5 then
    raise exception 'PD4 go-live refused: the diagnosed plunger stroke is % in above the predicted one, which is far more than a harmonic reconstruction of the same card should move it', v_dsp - v_sp;
  end if;
  if v_dpl <= v_fo then
    raise exception 'PD4 go-live refused: the diagnosed peak pump load of % lb does not exceed the fluid load of % lb the design assumed', v_dpl, v_fo;
  end if;
  if v_dpl / v_fo < 1.02 or v_dpl / v_fo > 1.12 then
    raise exception 'PD4 go-live refused: the diagnosed peak pump load is % times the assumed fluid load, outside the 2 to 12 percent band the round trip lesson is written on', v_dpl / v_fo;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'rodpump' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'rodpump' and status = 'available') then
    raise exception 'PD4 go-live refused: rodpump did not reach status available';
  end if;

  raise notice 'PD4 go-live: rodpump is available, behind nodal, at path_order 33.';
end $$;
