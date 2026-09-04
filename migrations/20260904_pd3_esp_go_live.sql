-- ============================================================================
-- PD3 GO-LIVE (HELD): ESP Design flips to 'available'. This is the THIRD
-- Production & Artificial Lift course, sitting behind 'nodal' at path_order 32.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/esp. That upload is the gate, and nothing
-- else releases this file. Running it earlier publishes a course whose app the
-- learner cannot open.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and several are deliberately written as PAIRS, because a one-sided
-- check would pass on a capstone quietly recut into exactly the mistake the
-- course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE TWO BRAKE POWERS. sizePump returns brake
-- power at the head REQUIRED and brake power at the head the stack MAKES, and
-- because the stage count rounds UP the two differ by EXACTLY headMadeFt over
-- tdhFt. Only the first is graded, because only the first feeds the electrical
-- chain, so the second is reconstructed here from graded field 13 and the
-- ratio of graded fields 12 and 11 and checked against the engine's own
-- 135.37933942851325 hp. Asserting only that the reconstructed power EXCEEDS
-- the graded one would pass on a capstone whose chain had been quietly rebuilt
-- on the larger power, which is the published method's choice and the thing
-- the tier exists to leave open rather than to settle. So the check is
-- two-sided in a second way as well: the drop the graded power gives must PASS
-- the 5 percent limit while the drop the other power gives must FAIL it. On a
-- comfortable cable both would pass and the tier's argument, that a tenth of a
-- percent of horsepower buys a whole conductor size, would no longer be in its
-- own capstone.
--
-- The design stage head of 22.32619770054256 ft and the design per stage brake
-- power of 0.8155381893283931 hp appear below as ENGINE CONSTANTS rather than
-- as graded fields. They used to be graded, as the Associate tier's fields 4
-- and 6, and they stopped being graded when that tier was decoupled from the
-- well. They are still the numbers the stack is built on, so the integer stage
-- assertions are written against them directly.
--
-- AND THERE IS A SECOND STANDING GATE HERE THAT PD1 DID NOT NEED. A capstone
-- prompt has to state every condition that changes an answer, and in a chained
-- domain that condition is often another tier's graded quantity. The first cut
-- of this course stated the pump intake rate and a specific gravity in the
-- ASSOCIATE prompt because a stage cannot be read at a duty without them, and
-- both are PROFESSIONAL graded answers. The fix was to decouple, not to round:
-- the Associate tier now reads its stage at a duty and on a fluid of its own,
-- graded nowhere. The assertion below re-reads the STORED PROMPTS and refuses
-- if any tier's prompt contains another tier's graded value, so the class of
-- defect cannot come back silently through a later edit to a prompt.
--
-- ONE NEAR APPROACH WORTH RECORDING, so a later reader does not mistake it for
-- a lookup. The goldens publish a best efficiency rate of 3600.0 bbl/d and
-- this capstone grades a scanned best efficiency rate of 3600.625 bbl/d. They
-- are 0.625 apart on a field whose tolerance is 1.8e-3, so 347 times the
-- tolerance, and measured in tolerances it is the nearest approach anywhere in
-- the sweep of eighteen graded values against 205 published numbers. The
-- capstone's six vendor points share no rate with the golden curve's five, and
-- the closeness is an accident of a scanned optimum landing near a round
-- number. Measured in absolute terms the nearest approach is a different one:
-- graded field 5 at 0.70635 against a published efficiency of 0.707727, which
-- is 0.001377 away and 2782 tolerances clear. Those are two different
-- questions, and the guard below needs the second one to size its windows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_rmse   numeric; v_bepq   numeric; v_beph   numeric; v_duty   numeric;
  v_eff    numeric; v_bhp    numeric;
  v_pin    numeric; v_gvf    numeric; v_rho    numeric; v_qin    numeric;
  v_tdh    numeric; v_made   numeric;
  v_shaft  numeric; v_amps   numeric; v_drop   numeric; v_kva    numeric;
  v_loss   numeric; v_ratio  numeric;
  v_other  numeric; v_amps2  numeric; v_drop2  numeric; v_kva0   numeric;
  c_sqrt3  constant numeric := 1.7320508075688772935;
  -- Engine outputs of the DESIGN stage, which the Associate tier no longer
  -- grades because its duty was decoupled from the well. See the header.
  c_stage_head constant numeric := 22.32619770054256;
  c_stage_bhp  constant numeric := 0.8155381893283931;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'esp' and active;
  if v_structures <> 3 then
    raise exception 'PD3 go-live refused: esp has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'esp';
  if v_questions <> 396 then
    raise exception 'PD3 go-live refused: esp has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'esp';
  if v_capstones <> 3 then
    raise exception 'PD3 go-live refused: esp has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'esp'
                   and module = 'production' and path_order = 32 and prereq_slug = 'nodal') then
    raise exception 'PD3 go-live refused: the esp catalog row is not production/32 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD3 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- These three engines size a pump, a motor and a cable. Nothing in them
  -- solves an inflow, forecasts a decline, books a reserve or prices a barrel,
  -- and the rate they work in is the IN SITU rate through the pump and never a
  -- stock tank rate. Nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'esp'
     and (f->>'label' ilike '%reserve%'  or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'  or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'    or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%probabilit%'
       or f->>'label' ilike '%skin%'     or f->>'label' ilike '%permeab%'
       or f->>'unit'  ilike '%usd%'      or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psig%'     or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'PD3 go-live refused: % capstone field(s) grade a quantity these ESP engines cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- TWO WINDOWS, and the reason is the same one PD2 records: a window has to be
  -- scaled to the quantity it guards. Thirteen of the eighteen graded fields
  -- are heads, rates, pressures, powers and currents running from 4.99 to 3706,
  -- and against the published neighbours of those the nearest approach anywhere
  -- is 0.2618, so a 0.02 window sits 9.5 times above the largest graded
  -- tolerance in that group (2.1e-3) and 13 times below the closest real
  -- neighbour. The other five are fractions and an RMSE, all between 0.022 and
  -- 0.85, graded to at most 4.2e-7, and against their published neighbours the
  -- nearest approach is 0.001377; 1e-4 sits 238 times above the largest
  -- tolerance there and 13.8 times below that neighbour.
  --
  -- THIS WINDOW WAS WRONG ONCE AND THE DRY RUN CAUGHT IT. A single 0.003 window
  -- was sized when the Associate tier still read the well's duty. Decoupling
  -- that tier moved graded field 5 from 0.71164 to 0.70635, which is 0.001377
  -- from a published efficiency of 0.707727, and the one-size window began
  -- refusing a value that is 2782 grader tolerances clear of it. A guard that
  -- fires on clear air is as much a defect as one that misses a collision.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'esp'
     and (abs((f->>'expected')::numeric - 0.031413612565)    < 0.0001 -- published head fit rmse
       or abs((f->>'expected')::numeric - 0.707726994286)    < 0.0001 -- published efficiency
       or abs((f->>'expected')::numeric - 0.833333333333)    < 0.0001
       or abs((f->>'expected')::numeric - 0.198470643715)    < 0.0001
       or abs((f->>'expected')::numeric - 0.85)              < 0.0001 -- the under-curve threshold
       or abs((f->>'expected')::numeric - 3600.000000000001) < 0.02   -- the near miss, see the header
       or abs((f->>'expected')::numeric - 17.997685466327)   < 0.02
       or abs((f->>'expected')::numeric - 22.174285714286)   < 0.02
       or abs((f->>'expected')::numeric - 1200.0)            < 0.02   -- published intake pressure
       or abs((f->>'expected')::numeric - 53.801047120419)   < 0.02
       or abs((f->>'expected')::numeric - 4098.400000000001) < 0.02
       or abs((f->>'expected')::numeric - 3636.000000000001) < 0.02   -- published heads
       or abs((f->>'expected')::numeric - 3750.0)            < 0.02
       or abs((f->>'expected')::numeric - 125.697715870033)  < 0.02   -- published shaft power
       or abs((f->>'expected')::numeric - 43.434206349207)   < 0.02   -- published current
       or abs((f->>'expected')::numeric - 4.729920773949)    < 0.02
       or abs((f->>'expected')::numeric - 143.986805702487)  < 0.02
       or abs((f->>'expected')::numeric - 7.10873015873)     < 0.02);
  if v_graded <> 0 then
    raise exception 'PD3 go-live refused: % graded field(s) sit within a window of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- A prompt is the one text a learner reads WHILE being graded, so a prompt
  -- that carries another tier's graded value has handed over that tier's
  -- answer. Commas are stripped first, because a prompt writes 4,181.40584
  -- where the answer key holds 4181.40584 and the two are the same leak.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'esp' and c2.app_slug = 'esp' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD3 go-live refused: % capstone prompt(s) state a graded value belonging to another tier, which hands a learner an answer they are about to be graded on', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_rmse  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_fit_head_rmse_ft';
  select (f->>'expected')::numeric into v_bepq  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_bep_q_bpd';
  select (f->>'expected')::numeric into v_beph  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_bep_head_ft';
  select (f->>'expected')::numeric into v_duty  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_head_at_duty_ft';
  select (f->>'expected')::numeric into v_eff   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_efficiency_at_duty_frac';
  select (f->>'expected')::numeric into v_bhp   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='stage_bhp_per_stage_hp';
  select (f->>'expected')::numeric into v_pin   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='intake_pressure_psia';
  select (f->>'expected')::numeric into v_gvf   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='intake_stream_gvf_frac';
  select (f->>'expected')::numeric into v_rho   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='pump_mixture_density_lbft3';
  select (f->>'expected')::numeric into v_qin   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='pump_intake_bpd';
  select (f->>'expected')::numeric into v_tdh   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='tdh_ft';
  select (f->>'expected')::numeric into v_made  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='design_head_made_ft';
  select (f->>'expected')::numeric into v_shaft from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='design_shaft_hp';
  select (f->>'expected')::numeric into v_amps  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='motor_amps_a';
  select (f->>'expected')::numeric into v_drop  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='cable_drop_pct';
  select (f->>'expected')::numeric into v_kva   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='surface_kva';
  select (f->>'expected')::numeric into v_loss  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='cable_loss_kw';
  select (f->>'expected')::numeric into v_ratio from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='esp' and f->>'key'='diag_head_ratio_frac';

  if v_rmse is null or v_bepq is null or v_beph is null or v_duty is null
     or v_eff is null or v_bhp is null or v_pin is null or v_gvf is null
     or v_rho is null or v_qin is null or v_tdh is null or v_made is null
     or v_shaft is null or v_amps is null or v_drop is null or v_kva is null
     or v_loss is null or v_ratio is null then
    raise exception 'PD3 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------- Associate: THE SCAN, NOT A SOLVE --------------------
  -- bepOf walks 400 intervals across the published 1750 to 4900 bbl/d range,
  -- which puts its samples 7.875 bbl/d apart, so the best efficiency rate is
  -- QUANTISED. If it ever stops being a whole number of steps above 1750, the
  -- capstone has been recut off a solver and the tier's own instruction to say
  -- scanned rather than found no longer describes its own capstone.
  if not (v_bepq > 1750 and v_bepq < 4900) then
    raise exception 'PD3 go-live refused: the best efficiency rate of % bbl/d does not sit inside the 1750 to 4900 bbl/d published range', v_bepq;
  end if;
  if abs((v_bepq - 1750) / 7.875 - round((v_bepq - 1750) / 7.875)) > 0.000001 then
    raise exception 'PD3 go-live refused: the best efficiency rate of % bbl/d is not a whole number of 7.875 bbl/d scan steps above 1750, so it did not come off a 400 interval scan', v_bepq;
  end if;

  -- ------------------- Associate: THE AFFINITY MAP, AS A PAIR --------------
  -- The duty maps BACK onto the published curve by dividing by 1.14 and the
  -- head maps FORWARD by 1.14 squared. Two things have to hold at once: the
  -- duty head must exceed the best efficiency head, because the frequency map
  -- more than pays for the fall along the curve, AND the duty head taken back
  -- to the published frame must sit BELOW the best efficiency head, because
  -- the duty maps back ABOVE the best efficiency rate. Checking only the first
  -- passes on a duty sitting at or below the best efficiency point, which is a
  -- comfortable pump with none of this tier's argument in it.
  if v_duty <= v_beph then
    raise exception 'PD3 go-live refused: the head at the duty of % ft does not exceed the best efficiency head of % ft, so the 57 Hz map no longer pays for the fall along the curve', v_duty, v_beph;
  end if;
  if v_duty / 1.2996 >= v_beph then
    raise exception 'PD3 go-live refused: the duty head taken back to the published frame is % ft, at or above the best efficiency head of % ft, so the duty no longer sits on the falling side of the curve', v_duty / 1.2996, v_beph;
  end if;
  if not (v_eff > 0 and v_eff < 0.7119994147814076) then
    raise exception 'PD3 go-live refused: the efficiency at the duty of % is not below the peak of the efficiency fit', v_eff;
  end if;
  if not (v_rmse > 0 and v_rmse < 0.134) then
    raise exception 'PD3 go-live refused: a head fit RMSE of % ft is not under one percent of the 13.4 ft spread of the six vendor points', v_rmse;
  end if;
  -- THE DECOUPLING, ASSERTED. The Associate tier reads the stage at its own
  -- duty on its own fluid, so its head per stage must NOT be the design stage
  -- head. If a later edit ever re-points this tier at the well's intake rate,
  -- the two collapse onto one number and the prompt has to state a graded
  -- Professional quantity again. This is the guard against that regression.
  if abs(v_duty - c_stage_head) < 0.001 then
    raise exception 'PD3 go-live refused: the Associate head per stage of % ft has collapsed onto the design stage head of % ft, so that tier is reading the well again and its prompt must state a Professional graded value', v_duty, c_stage_head;
  end if;
  if not (v_bhp > 0 and v_bhp < 5) then
    raise exception 'PD3 go-live refused: a brake power of % hp for ONE stage is not a stage of this pump', v_bhp;
  end if;

  -- ------------------- Professional: THE INTAKE IS A SUBTRACTION -----------
  -- The pump sits 650 ft ABOVE the perforations, so the intake pressure is the
  -- flowing pressure LESS the annulus column. There is nothing else in it, so
  -- this holds exactly or the sign is wrong.
  if v_pin <> 1385 - 0.274 * 650 then
    raise exception 'PD3 go-live refused: the intake pressure of % psia is not 1385 psia less a 0.274 psi/ft column over the 650 ft between the perforations and the pump', v_pin;
  end if;

  -- ------------------- Professional: THE SEPARATOR ONLY MAKES IT HEAVIER ---
  if not (v_rho > 47.2562923325379 and v_rho < 58.052880533656754) then
    raise exception 'PD3 go-live refused: the mixture density through the pump of % lb/ft3 does not sit between the full stream at 47.2562923325379 and the liquid at 58.052880533656754 lb/ft3, so the separator has stopped taking gas out', v_rho;
  end if;
  if not (v_qin > 3746.5280000000002 and v_qin < 4712.9232) then
    raise exception 'PD3 go-live refused: the rate through the pump of % bbl/d does not sit between the stream liquid rate of 3746.528 and its total rate of 4712.9232 bbl/d', v_qin;
  end if;
  if v_gvf <= 0.10400278199257497 then
    raise exception 'PD3 go-live refused: the stream gas volume fraction of % is not above the 0.10400278199257497 that goes through the pump, so the separator is taking nothing out', v_gvf;
  end if;

  -- ------------------- Professional: INTEGER STAGES, AS A PAIR -------------
  -- The stack must make MORE head than the well requires, because stageCount
  -- rounds up, AND the excess must be less than one whole stage, because that
  -- is what rounding up means. Checking only the first would pass on a stack
  -- sized off a fractional count, which loses the margin the whole Expert tier
  -- is built on. The whole-number check is the same statement a third way.
  if v_made <= v_tdh then
    raise exception 'PD3 go-live refused: the head the stack makes, % ft, does not exceed the head required, % ft, so the stage count no longer rounds up', v_made, v_tdh;
  end if;
  if (v_made - v_tdh) >= c_stage_head then
    raise exception 'PD3 go-live refused: the rounding margin of % ft is not less than one design stage head of % ft', v_made - v_tdh, c_stage_head;
  end if;
  if abs(v_made / c_stage_head - round(v_made / c_stage_head)) > 0.000000001 then
    raise exception 'PD3 go-live refused: the head made of % ft is not a whole number of % ft design stages', v_made, c_stage_head;
  end if;
  if round(v_made / c_stage_head) <> 166 then
    raise exception 'PD3 go-live refused: the stack is % stages, expected the 166 the Expert tier is built on', round(v_made / c_stage_head);
  end if;

  -- ------------------- Expert: THE DERATE STOPS AT THE SEAM, AS A PAIR -----
  -- The shaft power must sit ABOVE the plate times the 0.88 derating factor,
  -- which is why the sizing calls this motor overloaded, and BELOW the plate
  -- itself, which is why nothing in the electrical chain does. Either half
  -- alone is a motor with no finding on it.
  if v_shaft <= 150 * 0.88 then
    raise exception 'PD3 go-live refused: the shaft power of % hp does not exceed the 132 hp usable rating, so the sizing no longer warns the motor is overloaded and the seam finding disappears', v_shaft;
  end if;
  if v_shaft >= 150 then
    raise exception 'PD3 go-live refused: the shaft power of % hp is not below the 150 hp plate, so the electrical chain would warn as well and the two load fractions stop disagreeing', v_shaft;
  end if;

  -- ------------------- Expert: THE CURRENT IS LINEAR IN HORSEPOWER ---------
  if abs(v_amps / 48 - v_shaft / 150) > 0.000000001 then
    raise exception 'PD3 go-live refused: the current fraction of % against the 48 A plate does not equal the power fraction of % against the 150 hp plate', v_amps / 48, v_shaft / 150;
  end if;

  -- ------------------- Expert: THE SURFACE CARRIES THE PLATE PLUS THE DROP -
  v_kva0 := c_sqrt3 * 2000 * v_amps / 1000;
  if abs(v_kva / v_kva0 - (1 + v_drop / 100)) > 0.000000001 then
    raise exception 'PD3 go-live refused: the surface kVA of % against % kVA at the bare plate is a ratio of %, which is not one plus the % percent drop', v_kva, v_kva0, v_kva / v_kva0, v_drop;
  end if;
  if not (v_loss > 0 and v_loss < v_kva * 0.1) then
    raise exception 'PD3 go-live refused: a cable loss of % kW against a surface kVA of % is not a plausible copper loss', v_loss, v_kva;
  end if;

  -- ------------------- Expert: THE TWO POWERS, AS A PAIR -------------------
  -- Reconstruct the published method's brake power, which is brake power at
  -- the head the stack MAKES, from the graded shaft power and the graded head
  -- ratio. The identity is exact by construction in the engine, so this is a
  -- real check on all three fields at once.
  v_other := v_shaft * (v_made / v_tdh);
  if abs(v_other - 135.37933942851325) > 0.000001 then
    raise exception 'PD3 go-live refused: the shaft power of % hp scaled by the head ratio gives % hp, not the 135.37933942851325 hp the engine returns for the stack, so one of fields 11, 12 and 13 has moved', v_shaft, v_other;
  end if;
  if v_other <= v_shaft then
    raise exception 'PD3 go-live refused: the stack brake power of % hp does not exceed the shaft power of % hp, so the electrical chain is no longer built on the smaller of the two', v_other, v_shaft;
  end if;
  -- The same power reached the other way, off the DESIGN stage's brake power
  -- times the 166 stages the Professional tier sized. That is the published
  -- method's own arithmetic, so the two routes agreeing is a real check on
  -- graded fields 11, 12 and 13 at once rather than a restatement.
  if abs(c_stage_bhp * 166 - v_other) > 0.000001 then
    raise exception 'PD3 go-live refused: one design stage at % hp over 166 stages is % hp against a stack brake power of % hp, so the per stage power and the design power no longer describe the same pump', c_stage_bhp, c_stage_bhp * 166, v_other;
  end if;

  -- ------------------- Expert: AND WHAT THE OTHER POWER COSTS, AS A PAIR ---
  -- The graded chain must PASS the 5 percent drop limit and the other power's
  -- chain must FAIL it. Checking only that the graded drop passes would leave
  -- the tier claiming that a tenth of a percent of horsepower buys a conductor
  -- size on a well where it no longer does.
  v_amps2 := v_other / 150 * 48;
  v_drop2 := v_drop * v_amps2 / v_amps;
  if v_drop >= 5 then
    raise exception 'PD3 go-live refused: the graded cable drop of % percent does not pass the stated 5 percent limit, so the engine would not have selected this conductor', v_drop;
  end if;
  if v_drop2 <= 5 then
    raise exception 'PD3 go-live refused: the other brake power gives a drop of % percent, which still passes the 5 percent limit, so the choice of power no longer buys a conductor size and the Expert tier loses its consequence', v_drop2;
  end if;
  if v_drop <= 4.9 then
    raise exception 'PD3 go-live refused: the graded cable drop of % percent has too much headroom for the 14 ft margin the tier teaches', v_drop;
  end if;

  -- ------------------- Expert: THE SURVEY IS UNDER ITS OWN CURVE -----------
  if v_ratio >= 0.85 then
    raise exception 'PD3 go-live refused: the survey head ratio of % is not below the 0.85 under-curve threshold, so the flag the tier is built on no longer fires', v_ratio;
  end if;
  if v_ratio <= 0.8 then
    raise exception 'PD3 go-live refused: the survey head ratio of % is far enough below the threshold that the rounding collision the tier points at no longer applies', v_ratio;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'esp' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'esp' and status = 'available') then
    raise exception 'PD3 go-live refused: esp did not reach status available';
  end if;

  raise notice 'PD3 go-live: esp is available, behind nodal, at path_order 32.';
end $$;
