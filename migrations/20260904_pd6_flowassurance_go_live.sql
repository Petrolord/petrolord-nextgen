-- ============================================================================
-- PD6 GO-LIVE (HELD): Flow Assurance flips to 'available'. This is the SIXTH
-- Production & Artificial Lift course, behind 'nodal' at path_order 35.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/flowassurance. That upload is the gate,
-- and nothing else releases this file.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and every number in it was recomputed from closed forms before it
-- was written down. Most are PAIRS, because a one-sided check passes on a
-- capstone quietly recut into the mistake the course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE VERDICT FLIP. The heat-loss-only arrival
-- must sit ABOVE the 71.4 degF flowing hydrate boundary and the engine's
-- Joule-Thomson arrival must sit BELOW it, and the CORRECTLY DAMPED arrival
-- must be back above it again. All three, or the course loses its central
-- finding. Asserting only that the engine goes sub-boundary would pass on a
-- line that was inside the hydrate region before the JT term was applied at
-- all, which is a line that needs methanol for reasons the defect had nothing
-- to do with. Asserting only that the undamped and damped answers differ would
-- pass on a difference of a tenth of a degF, where nobody's decision changes.
-- The three together are the claim: the term is over-applied by a factor of
-- 2.1383, that is worth 5.6894 degF on this line, and 5.6894 degF is enough to
-- move the answer across the only line that matters.
--
-- AND THE PAIR THAT KEEPS THAT CLAIM HONEST. A sub-seabed arrival is NOT by
-- itself impossible and this file must not let a future recut pretend it is. A
-- Joule-Thomson term is a real heat sink: expanding gas does work, and a line
-- can genuinely arrive below the sea that is warming it. The go-live therefore
-- asserts that the engine's JT arrival on THIS line stays comfortably ABOVE
-- ambient, so nothing in the capstone rests on an impossibility argument, and
-- it records in this header what the three-times-length case actually shows.
-- On that longer line the engine arrives 9.578 degF below the seabed and the
-- CORRECTLY DAMPED reading arrives 0.887 degF below it too. Both go under. The
-- engine's excursion is 10.8 TIMES the correct one. The defect is the SIZE of
-- the excursion and never its sign, and a lesson that argued otherwise would
-- be right about the term for a reason that is false.
--
-- THE SECOND PAIR IS THE DOSE THAT PASSES ITS OWN CHECK WHILE MISSING ITS OWN
-- TARGET. The design concentration fed back through HAMMERSCHMIDT must return
-- the 45.8 degF that was asked for, EXACTLY, and the delivered depression the
-- same call reports through NIELSEN-BUCKLIN must fall BELOW it, and below the
-- 40.4 degF bare subcooling as well. The first half alone would pass on any
-- dose the inverse ever produced, since the inverse and the forward relation
-- are algebraic inverses of each other and always agree. It is the second half
-- that carries the finding, and the third half that makes it matter: 39.2154
-- degF against a 40.4 degF subcooling is a line still inside its own hydrate
-- region after the design the engine passed with ok true.
--
-- THE THIRD PAIR IS THE CEILING THAT REFUSES ON THE WRONG THING. The design
-- must sit ABOVE the 25 weight percent reliability line, which is why the
-- check switches relation and disagrees with the sizing at all, and BELOW the
-- 70 weight percent practical ceiling, which is why the call returns ok true
-- instead of refusing. Both, or the capstone lands on a call that either never
-- disagrees with itself or refuses before it can. Nothing in the function
-- compares the delivered depression against the need, and that is only
-- visible on a call that got past the one comparison it does make.
--
-- THE FOURTH PAIR IS PASS THE FLOWING BOUNDARY, FAIL THE SHUT-IN ONE. The
-- arrival must be ABOVE 71.4 degF, the boundary that applies while the line
-- flows, and BELOW 79.6 degF, the boundary the same fluid makes once the line
-- packs in. A capstone recut to arrive above both would satisfy every other
-- thermal check in this file and would quietly delete the Professional tier's
-- closing finding, which is that asking cooldownTime for the time to reach the
-- boundary that actually applies returns MINUS 0.5844 hr with ok true, no
-- note, and a station table that warms up as it runs backwards through
-- negative time.
--
-- THE FIFTH PAIR IS THE TWO MASSES, WHICH RANK ONE WAY BY WEIGHT AND THE OTHER
-- WAY BY HEAT. The steel must OUTWEIGH the contents, which is what
-- cooldownTime's own header leads a reader to expect, and the contents must
-- carry MORE of the M Cp than the steel, because 0.113 Btu/(lb degF) meets
-- 0.58. Asserting only the weight would leave the header's ranking looking
-- right; asserting only the heat capacity would lose the reason the header is
-- worth arguing with. Both slots are then asserted to carry between a tenth
-- and nine tenths of the total, which is what gives the fails-open in
-- cooldownTime its teeth: with neither slot near zero, the `!(mcp > 0)` guard
-- on the TOTAL cannot fire when ONE slot goes NaN, and the function returns
-- hours short by exactly that slot's share with nothing in the return to say
-- so.
--
-- AND THE SIXTH IS THE TRENCH THAT CAN BE SWALLOWED. The buried term must
-- carry more than a quarter of the resistance stack, and the foam must be the
-- largest single term while still not a majority of the stack. The first makes
-- overallU's NaN-drop expensive, 74.13 percent on this build, rather than a
-- curiosity; the second is the Associate tier's whole claim that the stack is
-- readable and that the biggest term dominates without owning the answer.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE THREE.
--
--   SMALL GROUP, the four fields below 2: three overall coefficients and a
--   number of transfer units. Largest grader tolerance in the group 8.9e-7.
--   Nearest guarded published neighbour anywhere in the group 2.51549e-4,
--   which is the insulated U of 1.11203139 against the teaching line's
--   1.11228293 degF excursion below the seabed. A window of 1e-5 therefore
--   sits 11.2 TIMES ABOVE the largest tolerance it covers and 25.2 TIMES BELOW
--   the nearest neighbour it must not catch.
--
--   MIDDLE GROUP, the eleven fields between 2 and 100: two masses, a share, an
--   overall coefficient, two temperatures, a depression, two concentrations
--   and two times. Largest grader tolerance 3.9e-5. Nearest guarded neighbour
--   3.92911e-3, which is the steel mass of 40.29797 lbm/ft against a published
--   ground share of 40.301898 PERCENT. A window of 4e-4 sits 10.3 TIMES ABOVE
--   the largest tolerance and 9.8 TIMES BELOW that neighbour.
--
--   LARGE GROUP, the three fields above 100: two injection rates and a
--   relaxation length. Largest grader tolerance 0.018. Nearest guarded
--   neighbour 3.00532, the MEG rate of 1003.00532 bbl/d against a round
--   thousand. A window of 0.2 sits 11.1 TIMES ABOVE the largest tolerance and
--   15.0 TIMES BELOW that neighbour.
--
-- THREE APPROACHES ARE COINCIDENCES OF MAGNITUDE AND NOT LOOKUPS, AND THEY ARE
-- NAMED HERE RATHER THAN LEFT FOR SOMEBODY TO FIND. A coefficient in
-- Btu/(hr ft2 degF) landing a quarter of a thousandth from a TEMPERATURE
-- EXCURSION in degF; a mass in lbm/ft landing four thousandths from a
-- RESISTANCE SHARE in percent; and the delivered depression of 39.2154 degF
-- landing 0.0154 degF from the 39.2 degF SEABED TEMPERATURE the Professional
-- prompt states. None of the three is a unit shift of the other side and none
-- is recoverable from it. The third is the tightest and it is worth being
-- precise about: 0.0154 degF is 768 TIMES the tolerance that field is graded
-- to, so a learner who wrote down the seabed temperature instead of computing
-- the depression fails, and it is 38 times the 4e-4 window that field's own
-- magnitude group is guarded with below. The eighteen graded values were
-- swept against 1078 published
-- numbers, the goldens and the teaching digest together, with zero collisions
-- inside any window above.
--
-- A GATE THIS COURSE ADDS TO THE PERMANENT SET, AND IT IS THE THESIS AS SQL.
-- THE HYDRATE BOUNDARY IS AN INPUT. Neither engine computes it, both headers
-- say so in as many words, and the goldens publish no hydrate temperature at
-- any pressure because the oracle has none either. So no graded field measured
-- in degF may land within 0.2 degF of either boundary temperature, of the
-- subcooling they imply, or of the depression that subcooling asks for. A
-- capstone that graded a learner on a number that arrived in an email from a
-- laboratory would be certifying somebody else's measurement as this course's
-- calculation. The gate is written on the UNIT rather than on the value alone,
-- deliberately: a hydrate temperature is a temperature, and the steel mass of
-- 40.29797 lbm/ft sitting a tenth of a unit from a 40.4 degF subcooling is a
-- collision of magnitudes between two different physical quantities and is not
-- what this gate is looking for.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE, which re-reads the STORED prompts.
-- The heat-loss-only arrival was drafted into the Expert prompt as the
-- starting point for the Joule-Thomson subtraction and taken out of it, since
-- an arrival minus a stated 10.6875 degF is one subtraction away from a
-- Professional graded value, and a leak that needs one subtraction is still a
-- leak. The two tiers are tied together by an identity stated in words
-- instead, which is the device PD5 used on its cycle gas.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_ubare  numeric; v_uins   numeric; v_ubur   numeric; v_foam   numeric;
  v_msteel numeric; v_mfluid numeric;
  v_lc     numeric; v_arr    numeric; v_ntu    numeric; v_uneed  numeric;
  v_hours  numeric; v_tau    numeric;
  v_jtarr  numeric; v_wmeoh  numeric; v_deliv  numeric; v_rmeoh  numeric;
  v_wmeg   numeric; v_rmeg   numeric;
  v_rin    numeric; v_rwall  numeric; v_rfoam  numeric; v_rcoat  numeric;
  v_rsoil  numeric; v_rout   numeric; v_rtot   numeric; v_area   numeric;
  v_ratio  numeric; v_damp   numeric; v_damped numeric; v_full   numeric;
  v_mcpc   numeric; v_mcps   numeric; v_xmeoh  numeric; v_xmeg   numeric;
  -- Stated conditions of the capstone line, and engine constants. None of
  -- these is a graded value; they are what the assertions are written against.
  c_bore        constant numeric := 10.02;    -- in, the bore and the reference
  c_pipe_od     constant numeric := 10.75;    -- in
  c_foam_od     constant numeric := 12.25;    -- in
  c_coat_od     constant numeric := 17.25;    -- in
  c_k_pipe      constant numeric := 8.67;     -- Btu/(hr ft degF), 22Cr duplex
  c_k_foam      constant numeric := 0.062;
  c_k_coat      constant numeric := 0.88;
  c_k_soil      constant numeric := 1.45;
  c_h_in        constant numeric := 285;      -- Btu/(hr ft2 degF)
  c_h_out       constant numeric := 64;
  c_burial      constant numeric := 5.5;      -- ft to CENTRELINE
  c_rho_steel   constant numeric := 487.3;    -- lbm/ft3
  c_rho_fluid   constant numeric := 47.5;     -- lbm/ft3
  c_length      constant numeric := 65120;    -- ft
  c_mdot        constant numeric := 90000;    -- lb/hr
  c_cp          constant numeric := 0.58;     -- Btu/(lb degF)
  c_t_in        constant numeric := 268.0;    -- degF
  c_t_amb       constant numeric := 39.2;     -- degF, the seabed
  c_cp_shell    constant numeric := 0.113;    -- Btu/(lb degF)
  c_target      constant numeric := 96.5;     -- degF, the retrofit target
  c_p_in        constant numeric := 2140;     -- psia
  c_p_out       constant numeric := 1285;     -- psia
  c_jt          constant numeric := 0.0125;   -- degF/psi
  c_hyd_flow    constant numeric := 71.4;     -- degF, A LAB NUMBER
  c_hyd_shut    constant numeric := 79.6;     -- degF, A LAB NUMBER
  c_subcool     constant numeric := 40.4;     -- degF, 79.6 less 39.2
  c_margin      constant numeric := 5.4;      -- degF
  c_need        constant numeric := 45.8;     -- degF, 40.4 plus 5.4
  c_water_bpd   constant numeric := 780;
  c_rho_water   constant numeric := 8.62;     -- lb/gal, the produced brine
  c_lean_meoh   constant numeric := 95.5;     -- weight percent
  c_lean_meg    constant numeric := 88.5;     -- weight percent
  c_mw_meoh     constant numeric := 32.04;
  c_mw_meg      constant numeric := 62.07;
  c_mw_water    constant numeric := 18.015;   -- WATER_MOLECULAR_WEIGHT
  c_k_ham       constant numeric := 2335;     -- the engine's Hammerschmidt k
  c_nb          constant numeric := 129.6;    -- NIELSEN_BUCKLIN_CONSTANT_F
  c_rho_meoh    constant numeric := 6.6;      -- lb/gal
  c_rho_meg     constant numeric := 9.3;      -- lb/gal
  c_reliable    constant numeric := 25;       -- HAMMERSCHMIDT_RELIABLE_WT_PCT
  c_ceiling     constant numeric := 70;       -- MAX_PRACTICAL_WT_PCT
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'flowassurance' and active;
  if v_structures <> 3 then
    raise exception 'PD6 go-live refused: flowassurance has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'flowassurance';
  if v_questions <> 396 then
    raise exception 'PD6 go-live refused: flowassurance has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'flowassurance';
  if v_capstones <> 3 then
    raise exception 'PD6 go-live refused: flowassurance has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'flowassurance'
                   and module = 'production' and path_order = 35 and prereq_slug = 'nodal') then
    raise exception 'PD6 go-live refused: the flowassurance catalog row is not production/35 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD6 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- These two engines stack resistances, run one exponential and size a dose.
  -- They carry NO hydraulics at all: the pressure column in a profile is a
  -- linear interpolation between two stated endpoints, not a pressure drop,
  -- and nothing in either file computes one. So nothing here may certify a
  -- pressure, a reserve, a decline, a price or an inflow, and the boundary
  -- worth naming explicitly is the one both module headers name: a HYDRATE or
  -- WAX boundary is a fluid property from a lab or a flash and is not this
  -- course's to grade.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'flowassurance'
     and (f->>'label' ilike '%hydrate%'   or f->>'label' ilike '%wax%'
       or f->>'label' ilike '%boundary%'  or f->>'label' ilike '%envelope%'
       or f->>'label' ilike '%flash%'     or f->>'label' ilike '%equilibrium%'
       or f->>'label' ilike '%reserve%'   or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'   or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'     or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%skin%'      or f->>'label' ilike '%permeab%'
       or f->>'label' ilike '%inflow%'    or f->>'label' ilike '%deliverab%'
       or f->>'label' ilike '%pressure drop%'
       or f->>'unit'  ilike '%usd%'       or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psi%'       or f->>'unit'  ilike '%stb%'
       or f->>'unit'  ilike '%scf%'       or f->>'unit'  ilike '%degc%');
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % capstone field(s) grade a quantity these flow assurance engines cannot produce', v_graded;
  end if;

  -- ------------------------- THE BOUNDARY IS AN INPUT, AS A GATE ----------
  -- No graded TEMPERATURE may be one of the four numbers that came out of the
  -- laboratory rather than out of an engine: the two hydrate temperatures, the
  -- subcooling they imply against the seabed, or the depression that
  -- subcooling asks for once the operator's margin is on it. Written on the
  -- unit, because a hydrate temperature is a temperature and a mass that
  -- happens to land near one is a collision of magnitudes and not a lookup.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'flowassurance' and f->>'unit' = 'degF'
     and (abs((f->>'expected')::numeric - c_hyd_flow) < 0.2
       or abs((f->>'expected')::numeric - c_hyd_shut) < 0.2
       or abs((f->>'expected')::numeric - c_subcool)  < 0.2
       or abs((f->>'expected')::numeric - c_need)     < 0.2);
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % graded degF field(s) sit on a hydrate boundary or on a subcooling read off one, which neither engine computes and no course may certify as its own', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- SMALL GROUP, the four graded values below 2. Window 1e-5.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'flowassurance' and (f->>'expected')::numeric < 2
     and (abs((f->>'expected')::numeric - 0.713200015595)     < 0.00001  -- golden buried4ft U
       or abs((f->>'expected')::numeric - 1.334879072040)     < 0.00001  -- golden insulated U
       or abs((f->>'expected')::numeric - 0.1865194066365108) < 0.00001  -- golden ntu, 5280 ft
       or abs((f->>'expected')::numeric - 0.932597033182554)  < 0.00001  -- golden ntu, 26400 ft
       or abs((f->>'expected')::numeric - 0.5406476278)       < 0.00001  -- teaching U for an 80 degF arrival
       or abs((f->>'expected')::numeric - 0.4227104126)       < 0.00001  -- published ground resistance, depth read to the pipe top
       or abs((f->>'expected')::numeric - 1.112282934)        < 0.00001  -- teaching excursion below the seabed, degF
       or abs((f->>'expected')::numeric - 1.793150736)        < 0.00001  -- teaching U needed on the published pipe
       or abs((f->>'expected')::numeric - 1.87167561)         < 0.00001);-- published U ratio insulated to buried
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % graded field(s) below 2 sit within 1e-5 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- MIDDLE GROUP, the eleven graded values between 2 and 100. Window 4e-4.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'flowassurance'
     and (f->>'expected')::numeric >= 2 and (f->>'expected')::numeric < 100
     and (abs((f->>'expected')::numeric - 3.730388132730216)  < 0.0004 -- golden ntu, 105600 ft
       or abs((f->>'expected')::numeric - 3.5886909084131804) < 0.0004 -- golden cooldown time constant
       or abs((f->>'expected')::numeric - 4.6627250326042144) < 0.0004 -- golden cooldown hours
       or abs((f->>'expected')::numeric - 43.35769353343494)  < 0.0004 -- golden arrival, 105600 ft
       or abs((f->>'expected')::numeric - 95.09425189690589)  < 0.0004 -- golden arrival, 26400 ft
       or abs((f->>'expected')::numeric - 40.0)               < 0.0004 -- golden ambient
       or abs((f->>'expected')::numeric - 25.0)               < 0.0004 -- the reliability limit
       or abs((f->>'expected')::numeric - 70.0)               < 0.0004 -- the practical ceiling
       or abs((f->>'expected')::numeric - 46.57193819)        < 0.0004 -- published burial share of the buried4ft stack
       or abs((f->>'expected')::numeric - 47.379792)          < 0.0004 -- teaching U error from a swallowed trench, percent
       or abs((f->>'expected')::numeric - 40.301898)          < 0.0004 -- published ground share at a 2 ft trench
       or abs((f->>'expected')::numeric - 39.24181312)        < 0.0004 -- published Hammerschmidt at 35 weight percent
       or abs((f->>'expected')::numeric - 54.93055115)        < 0.0004 -- published station temperature
       or abs((f->>'expected')::numeric - 67.14890604)        < 0.0004 -- published shortfall at a 180 degF subcooling
       or abs((f->>'expected')::numeric - 77.94002285)        < 0.0004 -- published station temperature
       or abs((f->>'expected')::numeric - 2.564189444)        < 0.0004 -- published excess over ambient at ntu 4
       or abs((f->>'expected')::numeric - 13.75)              < 0.0004 -- teaching foam outside diameter, in
       or abs((f->>'expected')::numeric - 48.57677902621723)  < 0.0004 -- golden methanol Hammerschmidt, 40 wt pct
       or abs((f->>'expected')::numeric - 41.256893831591086) < 0.0004 -- golden methanol Nielsen-Bucklin, 40 wt pct
       or abs((f->>'expected')::numeric - 31.227929373996794) < 0.0004 -- golden methanol Hammerschmidt, 30 wt pct
       or abs((f->>'expected')::numeric - 27.979891476965186) < 0.0004 -- golden methanol Nielsen-Bucklin, 30 wt pct
       or abs((f->>'expected')::numeric - 25.07491541807637)  < 0.0004 -- golden MEG Hammerschmidt, 40 wt pct
       or abs((f->>'expected')::numeric - 22.92401216464219)  < 0.0004 -- golden MEG Nielsen-Bucklin, 40 wt pct
       or abs((f->>'expected')::numeric - 37.612373127114545) < 0.0004 -- golden MEG Hammerschmidt, 50 wt pct
       or abs((f->>'expected')::numeric - 33.02542240923286)  < 0.0004 -- golden MEG Nielsen-Bucklin, 50 wt pct
       or abs((f->>'expected')::numeric - 57.81939131579898)  < 0.0004 -- golden methanol Nielsen-Bucklin, 50 wt pct
       or abs((f->>'expected')::numeric - 72.86516853932584)  < 0.0004);-- golden methanol Hammerschmidt, 50 wt pct
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % graded field(s) between 2 and 100 sit within 4e-4 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- LARGE GROUP, the three graded values above 100. Window 0.2.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'flowassurance' and (f->>'expected')::numeric >= 100
     and (abs((f->>'expected')::numeric - 156.17794402818063) < 0.2 -- golden arrival, 5280 ft
       or abs((f->>'expected')::numeric - 105.9799308356)     < 0.2 -- golden bare U
       or abs((f->>'expected')::numeric - 14154.02315290888)  < 0.2 -- golden relaxation length
       or abs((f->>'expected')::numeric - 28308.04630581776)  < 0.2 -- golden relaxation length
       or abs((f->>'expected')::numeric - 33969.65556698131)  < 0.2 -- golden relaxation length
       or abs((f->>'expected')::numeric - 2334.6)             < 0.2 -- the oracle's Hammerschmidt constant
       or abs((f->>'expected')::numeric - 2335.0)             < 0.2 -- the engine's Hammerschmidt constant
       or abs((f->>'expected')::numeric - 5280.0)             < 0.2 -- golden profile length
       or abs((f->>'expected')::numeric - 26400.0)            < 0.2 -- golden profile length
       or abs((f->>'expected')::numeric - 105600.0)           < 0.2 -- golden profile length
       or abs((f->>'expected')::numeric - 490.0)              < 0.2 -- STEEL_DENSITY_LB_FT3
       or abs((f->>'expected')::numeric - 129.6)              < 0.2 -- NIELSEN_BUCKLIN_CONSTANT_F
       or abs((f->>'expected')::numeric - 609.6)              < 0.2 -- the oracle's metres-per-foot denominator
       or abs((f->>'expected')::numeric - 1055.05585262)      < 0.2 -- the international Btu in joules
       or abs((f->>'expected')::numeric - 1000.0)             < 0.2 -- a round thousand
       or abs((f->>'expected')::numeric - 120000.0)           < 0.2 -- golden mass rate
       or abs((f->>'expected')::numeric - 60000.0)            < 0.2);-- golden mass rate
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % graded field(s) above 100 sit within 0.2 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'flowassurance' and c2.app_slug = 'flowassurance' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD6 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_ubare  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='u_bare_btu_hr_ft2_f';
  select (f->>'expected')::numeric into v_uins   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='u_insulated_btu_hr_ft2_f';
  select (f->>'expected')::numeric into v_ubur   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='u_buried_btu_hr_ft2_f';
  select (f->>'expected')::numeric into v_foam   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='foam_resistance_share_pct';
  select (f->>'expected')::numeric into v_msteel from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='steel_mass_lbm_per_ft';
  select (f->>'expected')::numeric into v_mfluid from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='contents_mass_lbm_per_ft';
  select (f->>'expected')::numeric into v_lc     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='relaxation_length_ft';
  select (f->>'expected')::numeric into v_arr    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='arrival_temp_f';
  select (f->>'expected')::numeric into v_ntu    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='ntu_dimensionless';
  select (f->>'expected')::numeric into v_uneed  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='u_for_target_arrival_btu_hr_ft2_f';
  select (f->>'expected')::numeric into v_hours  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='cooldown_hours_hr';
  select (f->>'expected')::numeric into v_tau    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='cooldown_time_constant_hr';
  select (f->>'expected')::numeric into v_jtarr  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='jt_arrival_temp_f';
  select (f->>'expected')::numeric into v_wmeoh  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='meoh_design_wt_pct';
  select (f->>'expected')::numeric into v_deliv  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='meoh_delivered_depression_f';
  select (f->>'expected')::numeric into v_rmeoh  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='meoh_injection_rate_bpd';
  select (f->>'expected')::numeric into v_wmeg   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='meg_design_wt_pct';
  select (f->>'expected')::numeric into v_rmeg   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='flowassurance' and f->>'key'='meg_injection_rate_bpd';

  if v_ubare is null or v_uins is null or v_ubur is null or v_foam is null
     or v_msteel is null or v_mfluid is null or v_lc is null or v_arr is null
     or v_ntu is null or v_uneed is null or v_hours is null or v_tau is null
     or v_jtarr is null or v_wmeoh is null or v_deliv is null or v_rmeoh is null
     or v_wmeg is null or v_rmeg is null then
    raise exception 'PD6 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------------------ the stack, rebuilt from scratch
  -- The conduction shape factor is written as ln(r + sqrt(r*r - 1)) rather
  -- than acosh(), so this file does not depend on a server version for the
  -- one term the whole burial argument rests on.
  v_area  := pi() * c_bore / 12;
  v_rin   := 1 / (c_h_in * pi() * c_bore / 12);
  v_rwall := ln(c_pipe_od / c_bore) / (2 * pi() * c_k_pipe);
  v_rfoam := ln(c_foam_od / c_pipe_od) / (2 * pi() * c_k_foam);
  v_rcoat := ln(c_coat_od / c_foam_od) / (2 * pi() * c_k_coat);
  v_ratio := 2 * c_burial / (c_coat_od / 12);
  v_rsoil := ln(v_ratio + sqrt(v_ratio * v_ratio - 1)) / (2 * pi() * c_k_soil);
  v_rout  := 1 / (c_h_out * pi() * c_coat_od / 12);
  v_rtot  := v_rin + v_rwall + v_rfoam + v_rcoat + v_rsoil + v_rout;

  -- ------------------- Associate: EVERY U IS THE STACK IT SAYS IT IS ------
  if abs(v_ubare - 1 / ((v_rin + v_rwall + 1 / (c_h_out * pi() * c_pipe_od / 12)) * v_area)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the bare U of % is not the inside film, the duplex wall and an outside film taken on the 10.75 in steel outside diameter, referred to the bore', v_ubare;
  end if;
  if abs(v_uins - 1 / ((v_rin + v_rwall + v_rfoam + 1 / (c_h_out * pi() * c_foam_od / 12)) * v_area)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the insulated U of % is not the bare stack plus the foam with the outside film moved onto the 12.25 in foam outside diameter', v_uins;
  end if;
  if abs(v_ubur - 1 / (v_rtot * v_area)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the buried U of % is not the full six term stack referred to the 10.02 in bore', v_ubur;
  end if;
  if abs(v_foam - 100 * v_rfoam / v_rtot) > 0.0000001 then
    raise exception 'PD6 go-live refused: the foam share of % percent is not the foam resistance over the total of the buried stack', v_foam;
  end if;

  -- ------------------- Associate: A SERIES STACK ONLY EVER LOSES ----------
  if not (v_ubare > v_uins and v_uins > v_ubur) then
    raise exception 'PD6 go-live refused: the three coefficients % , % and % are not strictly decreasing, so adding a resistance in series has stopped making the coefficient smaller', v_ubare, v_uins, v_ubur;
  end if;
  if v_ubare / v_uins < 40 then
    raise exception 'PD6 go-live refused: the foam is worth only % times the bare coefficient, so the Associate claim that insulation dominates a bare pipe by more than forty times has gone', v_ubare / v_uins;
  end if;

  -- ------------------- Associate: THE STACK IS READABLE, AND THE TRENCH IS
  -- WORTH SWALLOWING. The foam must be the largest single term and must still
  -- not be a majority; the trench must carry more than a quarter. Together
  -- they are what makes overallU dropping a NaN burial term expensive rather
  -- than a curiosity: on this build it is 74 percent on the coefficient.
  if v_foam <= 100 * v_rsoil / v_rtot then
    raise exception 'PD6 go-live refused: the foam share of % percent no longer exceeds the trench share, so the insulation is not the largest single term in the stack', v_foam;
  end if;
  if v_foam >= 50 then
    raise exception 'PD6 go-live refused: the foam share of % percent is a majority of the stack on its own, so the trench has stopped being a real second term', v_foam;
  end if;
  if 100 * v_rsoil / v_rtot < 25 then
    raise exception 'PD6 go-live refused: the trench carries only % percent of the stack, so a silently dropped burial term is no longer an expensive fails-open', 100 * v_rsoil / v_rtot;
  end if;

  -- ------------------- Associate: THE TWO MASSES, AND THE RANKING THAT ----
  -- REVERSES BETWEEN WEIGHT AND HEAT.
  if abs(v_msteel - pi() / 4 * ((c_pipe_od / 12) ^ 2 - (c_bore / 12) ^ 2) * c_rho_steel) > 0.0000001 then
    raise exception 'PD6 go-live refused: the steel mass of % lbm/ft is not the 10.75 by 10.02 in annulus at this alloy''s stated 487.3 lbm/ft3', v_msteel;
  end if;
  if abs(v_mfluid - pi() / 4 * (c_bore / 12) ^ 2 * c_rho_fluid) > 0.0000001 then
    raise exception 'PD6 go-live refused: the contents mass of % lbm/ft is not a full 10.02 in bore of 47.5 lbm/ft3 fluid', v_mfluid;
  end if;
  if v_msteel <= v_mfluid then
    raise exception 'PD6 go-live refused: the steel no longer outweighs the fluid, so the reversal the cooldown header leads a reader into has nothing to reverse';
  end if;
  v_mcpc := v_mfluid * c_cp;
  v_mcps := v_msteel * c_cp_shell;
  if v_mcpc <= v_mcps then
    raise exception 'PD6 go-live refused: the contents no longer carry more heat capacity than the steel, so the header''s ranking is correct on this line and the Associate finding has gone';
  end if;
  -- Both slots material, which is what lets ONE bad slot fail open in
  -- cooldownTime while the guard on the TOTAL stays quiet.
  if 100 * v_mcpc / (v_mcpc + v_mcps) < 10 or 100 * v_mcpc / (v_mcpc + v_mcps) > 90 then
    raise exception 'PD6 go-live refused: the contents carry % percent of the heat capacity, so one of the two cooldown mass slots is near enough to nothing that dropping it would not be a fails-open', 100 * v_mcpc / (v_mcpc + v_mcps);
  end if;

  -- ------------------- Professional: ONE EXPONENTIAL, FOUR ANSWERS --------
  if abs(v_lc - c_mdot * c_cp / (v_ubur * pi() * c_bore / 12)) > 0.000001 then
    raise exception 'PD6 go-live refused: the relaxation length of % ft is not m Cp over U pi D on the graded buried coefficient and the bore', v_lc;
  end if;
  if abs(v_ntu - c_length / v_lc) > 0.0000000001 then
    raise exception 'PD6 go-live refused: the number of transfer units of % is not 65120 ft over the graded relaxation length', v_ntu;
  end if;
  if abs(v_arr - (c_t_amb + (c_t_in - c_t_amb) * exp(-v_ntu))) > 0.0000000001 then
    raise exception 'PD6 go-live refused: the arrival of % degF is not the seabed plus the inlet excess times exp(-ntu) on the graded ntu', v_arr;
  end if;
  if abs(v_uneed - c_mdot * c_cp * ln((c_t_in - c_t_amb) / (c_target - c_t_amb)) / (pi() * c_bore / 12 * c_length)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the U for the 96.5 degF target of % is not the same exponential inverted', v_uneed;
  end if;
  if v_uneed >= v_ubur then
    raise exception 'PD6 go-live refused: the U needed for the target of % is not below the U the line has, so arriving warmer no longer means losing less', v_uneed;
  end if;
  if 100 * (v_ubur - v_uneed) / v_ubur < 15 or 100 * (v_ubur - v_uneed) / v_ubur > 30 then
    raise exception 'PD6 go-live refused: the retrofit asks for a % percent improvement in the coefficient, outside the band the lessons state as a real but affordable insulation change', 100 * (v_ubur - v_uneed) / v_ubur;
  end if;

  -- ------------------- Professional: THE COOLDOWN IS THE SAME EXPONENTIAL --
  -- in time, and it is asserted from the ASSOCIATE masses and the ASSOCIATE
  -- coefficient, which is the identity that ties the two tiers together
  -- without either prompt stating the other's answer.
  if abs(v_tau - (v_mcpc + v_mcps) / (v_ubur * pi() * c_bore / 12)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the time constant of % hr is not M Cp over U A built from the two graded masses and the graded coefficient', v_tau;
  end if;
  if abs(v_hours - v_tau * ln((v_arr - c_t_amb) / (c_hyd_flow - c_t_amb))) > 0.0000001 then
    raise exception 'PD6 go-live refused: the no-touch time of % hr is not the time constant times the log of the temperature ratio from the graded arrival', v_hours;
  end if;
  if v_hours >= 3 then
    raise exception 'PD6 go-live refused: the no-touch time of % hr is not under three hours, so the design no longer lives or dies on it', v_hours;
  end if;
  if v_tau <= 13 then
    raise exception 'PD6 go-live refused: the time constant of % hr is not over thirteen, so the short no-touch time is now a line that cools fast rather than a line that started close to the boundary', v_tau;
  end if;
  if v_tau / v_hours < 5 then
    raise exception 'PD6 go-live refused: the time constant is only % times the no-touch time, so the margin the line starts with is no longer the small one the lessons describe', v_tau / v_hours;
  end if;

  -- ------------------- Professional: PASS THE FLOWING BOUNDARY, FAIL THE --
  -- SHUT-IN ONE. Both, or the tier's closing finding has nothing to land on.
  if v_arr <= c_hyd_flow then
    raise exception 'PD6 go-live refused: the arrival of % degF is not above the 71.4 degF flowing hydrate boundary, so the line is already inside the hydrate region before the Expert tier touches it', v_arr;
  end if;
  if v_arr >= c_hyd_shut then
    raise exception 'PD6 go-live refused: the arrival of % degF is not below the 79.6 degF shut-in hydrate boundary, so asking the cooldown for the boundary that actually applies no longer returns a negative number of hours with ok true', v_arr;
  end if;
  if v_arr - c_hyd_flow < 4 or v_arr - c_hyd_flow > 9 then
    raise exception 'PD6 go-live refused: the flowing margin is % degF, outside the band that makes the Joule-Thomson finding a verdict change rather than a rounding', v_arr - c_hyd_flow;
  end if;

  -- ------------------- Expert: THE TERM IS APPLIED WHOLE ------------------
  v_full   := c_jt * (c_p_in - c_p_out);
  v_damp   := (1 - exp(-v_ntu)) / v_ntu;
  v_damped := v_arr - v_full * v_damp;
  if abs(v_jtarr - (v_arr - v_full)) > 0.0000000001 then
    raise exception 'PD6 go-live refused: the Joule-Thomson arrival of % degF is not the graded arrival less the WHOLE 0.0125 x 855 degF drop, so the engine is no longer applying the term undamped and the tier''s first finding has gone', v_jtarr;
  end if;
  if v_damp >= 0.6 or v_damp <= 0.35 then
    raise exception 'PD6 go-live refused: the damping factor is %, so the line is no longer at a number of transfer units where the over-application is a factor of about two', v_damp;
  end if;

  -- ------------------- Expert: THE VERDICT FLIPS, ALL THREE WAYS ----------
  if v_jtarr >= c_hyd_flow then
    raise exception 'PD6 go-live refused: the engine''s Joule-Thomson arrival of % degF is not below the 71.4 degF boundary, so the defect no longer changes the verdict', v_jtarr;
  end if;
  if v_damped <= c_hyd_flow then
    raise exception 'PD6 go-live refused: the CORRECTLY DAMPED arrival of % degF is also below the 71.4 degF boundary, so this line needs inhibitor either way and the flip is an illusion', v_damped;
  end if;
  if v_damped - v_jtarr < 4 then
    raise exception 'PD6 go-live refused: the undamped and damped arrivals differ by only % degF, which is not enough for anybody''s decision to turn on it', v_damped - v_jtarr;
  end if;
  -- And the honesty guard: nothing in this capstone may rest on an
  -- impossibility argument about arriving below the sea, because a
  -- Joule-Thomson term is a real heat sink and the correctly damped answer
  -- goes sub-seabed too on a long enough line. On THIS line neither does.
  if v_jtarr <= c_t_amb then
    raise exception 'PD6 go-live refused: the engine''s Joule-Thomson arrival of % degF is at or below the seabed, and a capstone that landed there would invite the argument that a sub-ambient arrival is impossible, which is false: the correctly damped reading also goes sub-seabed on a longer line, and the defect is the SIZE of the excursion rather than its sign', v_jtarr;
  end if;

  -- ------------------- Expert: SIZED ONE WAY, CHECKED ANOTHER -------------
  -- First, the two stated conditions the whole inhibitor half rests on, tied
  -- back to the laboratory number they came out of. The subcooling is the
  -- SHUT-IN boundary against the seabed and nothing else, and the requirement
  -- is that subcooling plus the operator's margin and nothing else. Neither is
  -- an engine output and both are asserted here so that a recut that quietly
  -- moved the boundary cannot leave the requirement behind.
  if abs(c_hyd_shut - c_t_amb - c_subcool) > 0.0000001 then
    raise exception 'PD6 go-live refused: the 79.6 degF shut-in boundary against the 39.2 degF seabed is not the 40.4 degF subcooling this file asserts against';
  end if;
  if abs(c_subcool + c_margin - c_need) > 0.0000001 then
    raise exception 'PD6 go-live refused: the 40.4 degF subcooling and the 5.4 degF safety margin do not sum to the 45.8 degF the design is sized to';
  end if;
  if abs(v_wmeoh - 100 * c_need * c_mw_meoh / (c_k_ham + c_need * c_mw_meoh)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the methanol design of % weight percent is not the Hammerschmidt inverse at 45.8 degF on a molecular weight of 32.04 and k 2335', v_wmeoh;
  end if;
  if abs(v_wmeg - 100 * c_need * c_mw_meg / (c_k_ham + c_need * c_mw_meg)) > 0.0000001 then
    raise exception 'PD6 go-live refused: the MEG design of % weight percent is not the same inverse on a molecular weight of 62.07', v_wmeg;
  end if;
  -- The sizing relation returns EXACTLY what it was asked for, which is what
  -- makes the check's disagreement a disagreement between two relations rather
  -- than an arithmetic slip.
  if abs(c_k_ham * v_wmeoh / (c_mw_meoh * (100 - v_wmeoh)) - c_need) > 0.0000001 then
    raise exception 'PD6 go-live refused: the design concentration fed back through Hammerschmidt does not return the 45.8 degF it was sized for, so the inverse and the forward relation have stopped being inverses';
  end if;
  v_xmeoh := (v_wmeoh / c_mw_meoh) / (v_wmeoh / c_mw_meoh + (100 - v_wmeoh) / c_mw_water);
  v_xmeg  := (v_wmeg  / c_mw_meg)  / (v_wmeg  / c_mw_meg  + (100 - v_wmeg)  / c_mw_water);
  if abs(v_deliv - (-c_nb * ln(1 - v_xmeoh))) > 0.0000001 then
    raise exception 'PD6 go-live refused: the delivered depression of % degF is not Nielsen-Bucklin at the design mole fraction', v_deliv;
  end if;
  if v_deliv >= c_need then
    raise exception 'PD6 go-live refused: the delivered depression of % degF reaches the 45.8 degF that was asked for, so the dose no longer misses its own target and the tier''s second finding has gone', v_deliv;
  end if;
  if v_deliv >= c_subcool then
    raise exception 'PD6 go-live refused: the delivered depression of % degF still covers the 40.4 degF bare subcooling, so the shortfall has been absorbed by the safety margin and the line is no longer left inside its own hydrate region', v_deliv;
  end if;
  if c_need - v_deliv < 3 then
    raise exception 'PD6 go-live refused: the shortfall is only % degF, which is inside the noise of any hydrate boundary and not a finding', c_need - v_deliv;
  end if;

  -- ------------------- Expert: THE CEILING REFUSES ON THE WRONG THING -----
  if v_wmeoh <= c_reliable then
    raise exception 'PD6 go-live refused: the methanol design of % weight percent is at or below the 25 percent reliability line, so the check never switches relation and never disagrees with the sizing at all', v_wmeoh;
  end if;
  if v_wmeoh >= c_ceiling or v_wmeg >= c_ceiling then
    raise exception 'PD6 go-live refused: a design concentration reaches the 70 weight percent practical ceiling, so the call refuses on concentration before the shortfall the tier is about can be seen';
  end if;

  -- ------------------- Expert: ONE NEED, TWO FLUIDS, ONE MOLE FRACTION ----
  if abs(v_xmeg - v_xmeoh) > 0.0000000001 then
    raise exception 'PD6 go-live refused: the methanol and MEG designs sit at different mole fractions, % against %, so the Hammerschmidt inverse has stopped fixing a mole fraction independent of molecular weight and the finding that the suppressed glycol check would return the identical number is gone', v_xmeg, v_xmeoh;
  end if;
  if abs((-c_nb * ln(1 - v_xmeg)) - v_deliv) > 0.0000001 then
    raise exception 'PD6 go-live refused: Nielsen-Bucklin on the MEG design does not return the same depression as on the methanol design, so the check the module declines to run for a glycol is no longer the identical calculation';
  end if;
  if v_wmeg <= v_wmeoh then
    raise exception 'PD6 go-live refused: the MEG design is not the higher weight percent, so the molecular weight has stopped doing the work of telling the two fluids apart';
  end if;

  -- ------------------- Expert: THE TWO RATES ------------------------------
  if abs(v_rmeoh - (c_water_bpd * 42 * c_rho_water * v_wmeoh / (100 - v_wmeoh)) * (100 / c_lean_meoh)
                   / ((c_rho_meoh * c_lean_meoh + c_rho_water * (100 - c_lean_meoh)) / 100) / 42) > 0.000001 then
    raise exception 'PD6 go-live refused: the methanol rate of % bbl/d is not the aqueous mass balance grossed up for a 95.5 percent lean stream over a blended density, on 780 bbl/d of 8.62 lb/gal water', v_rmeoh;
  end if;
  if abs(v_rmeg - (c_water_bpd * 42 * c_rho_water * v_wmeg / (100 - v_wmeg)) * (100 / c_lean_meg)
                  / ((c_rho_meg * c_lean_meg + c_rho_water * (100 - c_lean_meg)) / 100) / 42) > 0.000001 then
    raise exception 'PD6 go-live refused: the MEG rate of % bbl/d is not the same mass balance on an 88.5 percent lean glycol', v_rmeg;
  end if;
  if v_rmeg <= v_rmeoh then
    raise exception 'PD6 go-live refused: the MEG rate of % bbl/d is not above the methanol rate, so heavier per degree of depression has stopped costing anything', v_rmeg;
  end if;
  if v_rmeg / v_rmeoh < 1.4 or v_rmeg / v_rmeoh > 1.6 then
    raise exception 'PD6 go-live refused: the MEG rate is % times the methanol rate, outside the band the lessons state for what a glycol costs in tankage and umbilical', v_rmeg / v_rmeoh;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'flowassurance' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'flowassurance' and status = 'available') then
    raise exception 'PD6 go-live refused: flowassurance did not reach status available';
  end if;

  raise notice 'PD6 go-live: flowassurance is available, behind nodal, at path_order 35.';
end $$;
