-- ============================================================================
-- PD2 GO-LIVE (HELD): Gas Lift Design flips to 'available'. This is the SECOND
-- Production & Artificial Lift course and the first one in that module with a
-- prerequisite, which is 'nodal'.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/gaslift. That upload is the gate, and
-- nothing else releases this file. Running it earlier publishes a course whose
-- app the learner cannot open.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and several are deliberately written as PAIRS, because a one-sided
-- check would pass on a capstone quietly recut into exactly the mistake the
-- course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE TWO INJECTION POINT READINGS. Graded
-- fields 15 and 17 are the same crossing on the same traverse at two
-- tabulations, 24.1 ft apart and 1606.667 ft apart. Asserting only that they
-- DIFFER would pass on a capstone whose two readings had been recut off one
-- tabulation and then perturbed, and asserting only that they are CLOSE would
-- pass on a capstone that had lost the defect entirely. So the check is
-- three-sided: the coarse reading must be the SHALLOWER of the two, because a
-- chord drawn across a traverse that steepens with depth lies above the true
-- curve and cuts the crossing short; the gap must be large enough to matter;
-- and it must be small enough to still be a chord artefact on one well rather
-- than a different well.
--
-- TWO STANDING GATES HERE ARE NOT ABOUT THE ANSWERS AT ALL, THEY ARE ABOUT THE
-- QUESTIONS. The first re-reads the STORED PROMPTS and refuses if any tier's
-- prompt contains another tier's graded value, because a prompt is the one text
-- a learner reads while being graded and a capstone has to state every condition
-- that changes an answer, which in a chained domain is often the next tier's
-- quantity. PD2 is clean on it today and the gate is here so it stays that way.
-- The second guards the one place where PD2 could acquire that defect: the
-- spacing recursion is HANDED the deepest injection point as its target depth,
-- and that depth is graded field 15 of the Expert tier. It does not bind today,
-- because the recursion stops on the 335 ft minimum spacing hundreds of feet
-- above it, so the Professional prompt can describe the target by that property
-- instead of quoting the number. If a later retune ever let the recursion reach
-- the target, the Professional prompt would have to state an Expert graded
-- answer. The gate below fails first.
--
-- ONE NEAR APPROACH WORTH RECORDING, so a later reader does not mistake it for
-- a lookup. The goldens publish a dome pressure of 1313.798877081367 psia and
-- this capstone grades a dome pressure of 1313.645346439994 psia. They are
-- 0.1535 apart on a field whose tolerance is 6.6e-4, so 233 times the
-- tolerance, and it is the nearest approach anywhere in the sweep of eighteen
-- graded values against 638 published numbers. They are the same quantity on
-- two different valves of two different wells, and the closeness is an
-- accident of a shared bellows physics. The guard below is written with a
-- window tight enough to tell them apart rather than one round enough to look
-- tidy.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_z      numeric; v_grad   numeric; v_packer numeric; v_inv    numeric;
  v_top    numeric; v_curve  numeric;
  v_v2d    numeric; v_v4d    numeric; v_dome   numeric; v_rack   numeric;
  v_spread numeric; v_thru   numeric;
  v_c1     numeric; v_c3     numeric; v_ipf    numeric; v_ipp    numeric;
  v_ipc    numeric; v_opln   numeric;
  v_trav   numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'gaslift' and active;
  if v_structures <> 3 then
    raise exception 'PD2 go-live refused: gaslift has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'gaslift';
  if v_questions <> 396 then
    raise exception 'PD2 go-live refused: gaslift has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'gaslift';
  if v_capstones <> 3 then
    raise exception 'PD2 go-live refused: gaslift has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  -- PD2 is the first course in this module that has a prerequisite. A path
  -- that points at a course which is not in the catalog is a dead end.
  if not exists (select 1 from public.academy_apps where slug = 'gaslift'
                   and module = 'production' and path_order = 31 and prereq_slug = 'nodal') then
    raise exception 'PD2 go-live refused: the gaslift catalog row is not production/31 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD2 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine designs a gas lift installation. Its own header is explicit
  -- that it does NOT solve the well's inflow or its multiphase outflow: the
  -- flowing traverse it locates an injection point on is passed IN as a
  -- depth-pressure table. So it cannot produce an oil rate, and it certainly
  -- cannot forecast a decline, book a reserve, price a barrel or size a
  -- compressor. Nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gaslift'
     and (f->>'label' ilike '%reserve%'  or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'  or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'    or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%probabilit%'
       or f->>'unit'  ilike '%usd%'      or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psig%'     or f->>'unit'  ilike '%stb/d%'
       or f->>'unit'  ilike '%bbl/d%');
  if v_graded <> 0 then
    raise exception 'PD2 go-live refused: % capstone field(s) grade a quantity this gas lift engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- TWO WINDOWS, and the reason is worth stating because one window is the
  -- easy mistake here. Sixteen of the eighteen graded fields are pressures,
  -- depths, rates or a spread, all of them O(10) to O(10000), and among those
  -- the nearest published neighbour anywhere in the sweep is 0.1535 away, so a
  -- 0.02 window is more than seven times tighter than the closest real
  -- neighbour and more than four times looser than the largest graded
  -- tolerance of 4.6e-3. The other two fields are a compressibility factor and
  -- a gradient, which live at 0.83 and 0.035, and a 0.02 window on those would
  -- flag the goldens' own z of 0.8495 and gradient of 0.0319 as collisions
  -- when they are 0.0173 and 0.0027 away, which on fields graded to 4.2e-7 and
  -- 1.7e-8 is tens of thousands of tolerances of clear air. A window has to be
  -- scaled to the quantity it guards, so the two small ones get 5e-7, the same
  -- window PD1 used on its own dimensionless field.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gaslift'
     and (abs((f->>'expected')::numeric - 0.849475578742)    < 0.0000005  -- published z
       or abs((f->>'expected')::numeric - 0.031855542283)    < 0.0000005  -- published gradient
       or abs((f->>'expected')::numeric - 1569.154634335068) < 0.02
       or abs((f->>'expected')::numeric - 1265.564457252759) < 0.02
       or abs((f->>'expected')::numeric - 2500.0)            < 0.02   -- published valve depths
       or abs((f->>'expected')::numeric - 1448.416161730984) < 0.02
       or abs((f->>'expected')::numeric - 4493.061051145492) < 0.02
       or abs((f->>'expected')::numeric - 7000.0)            < 0.02
       or abs((f->>'expected')::numeric - 1313.798877081367) < 0.02   -- the near miss, see the header
       or abs((f->>'expected')::numeric - 1143.132591365118) < 0.02
       or abs((f->>'expected')::numeric - 45.637828290884)   < 0.02   -- published spread
       or abs((f->>'expected')::numeric - 3000.0)            < 0.02
       or abs((f->>'expected')::numeric - 1213.736305005327) < 0.02   -- published closing pressures
       or abs((f->>'expected')::numeric - 1122.989274256516) < 0.02
       or abs((f->>'expected')::numeric - 9000.0)            < 0.02   -- published injection depth
       or abs((f->>'expected')::numeric - 1458.181355015039) < 0.02);
  if v_graded <> 0 then
    raise exception 'PD2 go-live refused: % graded field(s) sit within a window of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- Commas are stripped first, because a prompt writes 9,139.524034378974 where
  -- the answer key holds 9139.524034378974 and the two are the same leak.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'gaslift' and c2.app_slug = 'gaslift' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD2 go-live refused: % capstone prompt(s) state a graded value belonging to another tier, which hands a learner an answer they are about to be graded on', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_z      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='gas_z_at_kickoff';
  select (f->>'expected')::numeric into v_grad   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='gas_gradient_at_kickoff_psi_per_ft';
  select (f->>'expected')::numeric into v_packer from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='inj_column_at_packer_psia';
  select (f->>'expected')::numeric into v_inv    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='inj_surface_for_1585psia_psia';
  select (f->>'expected')::numeric into v_top    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='top_valve_depth_ft';
  select (f->>'expected')::numeric into v_curve  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='inj_curve_at_5375ft_psia';
  select (f->>'expected')::numeric into v_v2d    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve2_depth_ft';
  select (f->>'expected')::numeric into v_v4d    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve4_depth_ft';
  select (f->>'expected')::numeric into v_dome   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve2_dome_at_temp_psia';
  select (f->>'expected')::numeric into v_rack   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve2_test_rack_opening_psia';
  select (f->>'expected')::numeric into v_spread from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve4_spread_psi';
  select (f->>'expected')::numeric into v_thru   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve4_throughput_mscfd';
  select (f->>'expected')::numeric into v_c1     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve1_closing_surface_psia';
  select (f->>'expected')::numeric into v_c3     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='valve3_closing_surface_psia';
  select (f->>'expected')::numeric into v_ipf    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='injection_point_depth_ft';
  select (f->>'expected')::numeric into v_ipp    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='injection_point_pinj_psia';
  select (f->>'expected')::numeric into v_ipc    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='injection_point_depth_coarse_ft';
  select (f->>'expected')::numeric into v_opln   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaslift' and f->>'key'='operating_inj_at_injection_pt_psia';

  if v_z is null or v_grad is null or v_packer is null or v_inv is null
     or v_top is null or v_curve is null or v_v2d is null or v_v4d is null
     or v_dome is null or v_rack is null or v_spread is null or v_thru is null
     or v_c1 is null or v_c3 is null or v_ipf is null or v_ipp is null
     or v_ipc is null or v_opln is null then
    raise exception 'PD2 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------- Associate: A STATIC COLUMN ONLY GAINS WITH DEPTH ----
  if not (v_packer > 1268.3 and v_curve > 1268.3 and v_curve < v_packer) then
    raise exception 'PD2 go-live refused: the injection column is not monotone with depth, kickoff 1268.3, 5375 ft %, packer %', v_curve, v_packer;
  end if;
  if not (v_z > 0 and v_z < 1) then
    raise exception 'PD2 go-live refused: the gas compressibility factor of % is not a real gas z below one', v_z;
  end if;

  -- ------------------- Associate: THE INVERSE, AS A PAIR -------------------
  -- Fields 3 and 4 are the same march run in two directions on the same
  -- column. 1268.3 psia at surface delivering MORE than 1585 psia at the
  -- packer, and 1585 psia at the packer needing LESS than 1268.3 psia at
  -- surface, are ONE statement read two ways. Checking either alone would pass
  -- on a capstone where only one of the two marches had been recut, which is
  -- the failure that leaves a course teaching an inverse that does not invert.
  if (v_packer > 1585) <> (v_inv < 1268.3) then
    raise exception 'PD2 go-live refused: the forward march gives % psia at the packer while the inverse march asks % psia at surface for 1585 psia, and the two do not agree on which side of 1585 this column sits', v_packer, v_inv;
  end if;
  if abs(v_packer - 1585) > 20 or abs(v_inv - 1268.3) > 20 then
    raise exception 'PD2 go-live refused: the inverse target of 1585 psia is no longer near the column, packer % psia, surface for 1585 % psia', v_packer, v_inv;
  end if;

  -- ------------------- Associate: THE GRADIENT FALLS WITH DEPTH ------------
  -- The tier's whole result. Compression pushes the gradient up and the
  -- geotherm pushes it down, and on this column the temperature wins, so the
  -- surface gradient extended over the whole hole must OVERSTATE the marched
  -- column. If an edit ever flipped that race, the tier would be teaching a
  -- direction its own capstone contradicts.
  if not (1268.3 + v_grad * 9640 > v_packer) then
    raise exception 'PD2 go-live refused: the kickoff gradient of % psi/ft over 9640 ft gives % psia, which does not overstate the marched column of % psia, so the local gradient no longer falls with depth', v_grad, 1268.3 + v_grad * 9640, v_packer;
  end if;
  if v_grad < 0.025 or v_grad > 0.05 then
    raise exception 'PD2 go-live refused: a gas gradient of % psi/ft is not a real injection gas column', v_grad;
  end if;

  -- ------------------- Professional: THE RECURSION, AS A PAIR --------------
  -- The depths must INCREASE while the increments DECREASE. Checking only that
  -- the depths increase would pass on an evenly spaced string, which is what a
  -- learner gets from treating spacing as a formula and is the error the tier
  -- exists to correct. Field 2 spans two increments and field 1 spans one, so
  -- half of the first must still be smaller than the second.
  if not (v_top < v_v2d and v_v2d < v_v4d and v_v4d < 9640) then
    raise exception 'PD2 go-live refused: the mandrel depths are not ordered inside the hole, top %, valve 2 %, valve 4 %', v_top, v_v2d, v_v4d;
  end if;
  if not ((v_v2d - v_top) > (v_v4d - v_v2d) / 2) then
    raise exception 'PD2 go-live refused: the spacing increments are not falling, first increment % ft against an average of % ft over the next two, so the string is evenly spaced and the recursion has been replaced by a formula', v_v2d - v_top, (v_v4d - v_v2d) / 2;
  end if;
  -- THE TARGET DEPTH MUST STILL NOT BIND. The recursion is handed graded field
  -- 15 as its target and stops on the 335 ft minimum at 8730.375110751653 ft,
  -- hundreds of feet above it, which is why the Professional prompt can
  -- describe the target by that property rather than quote an Expert answer. If
  -- a retune ever lets the recursion reach the target, the deepest mandrel
  -- lands ON field 15, this shortfall collapses to zero and the prompt starts
  -- leaking. Fail here instead.
  if (v_ipf - 8730.375110751653) <= 100 then
    raise exception 'PD2 go-live refused: the spacing stops only % ft above its target depth, so the target now binds the recursion and the Professional prompt would have to state Expert graded field 15', v_ipf - 8730.375110751653;
  end if;

  -- ------------------- Professional: TWO TEMPERATURES, AS A PAIR -----------
  -- The dome is charged COLD in the shop and balances HOT at valve depth, and
  -- 1219.4 psia is the second step of the 48.9 psi decrement ladder, which is
  -- valve 2's own opening surface pressure. The hot dome must sit ABOVE it
  -- because the gas column has added weight by the time it reaches 4379 ft,
  -- and the cold test rack opening must sit BELOW it. Checking only one side
  -- would pass on a capstone whose two temperatures had been collapsed into
  -- one, which loses the entire reason a valve is a thermometer.
  if not (v_dome > 1219.4 and v_rack < 1219.4) then
    raise exception 'PD2 go-live refused: the dome at valve temperature % psia and the test rack opening % psia do not straddle valve 2 opening surface pressure of 1219.4 psia', v_dome, v_rack;
  end if;
  if v_dome <= v_rack then
    raise exception 'PD2 go-live refused: the dome at valve temperature of % psia is not above the test rack opening of % psia', v_dome, v_rack;
  end if;

  -- ------------------- Professional: THE PORT PASSES THE TARGET ------------
  if v_thru <= 2062 then
    raise exception 'PD2 go-live refused: valve 4 passes % Mscf/d against a 2062 Mscf/d design rate, which selectPort would never have returned', v_thru;
  end if;
  if v_spread <= 0 then
    raise exception 'PD2 go-live refused: the valve 4 spread of % psi is not positive, so the injection and production sides have been entered the wrong way round', v_spread;
  end if;

  -- ------------------- Expert: THE KNIFE EDGE, AS A PAIR -------------------
  -- 1121.6 psia is the fourth step of the decrement ladder, the casing
  -- pressure when the point of injection transfers to valve 4. Valve 3's
  -- closing pressure sitting BELOW it is what makes this string multipoint at
  -- stage 4; the margin being under a psi is what makes that verdict a knife
  -- edge rather than a comfortable answer. Checking only the first would pass
  -- on a comfortably multipointing string, and a comfortable string cannot
  -- teach why an ungated boolean matters.
  if v_c3 >= 1121.6 then
    raise exception 'PD2 go-live refused: valve 3 closes at % psia, at or above the 1121.6 psia casing pressure at stage 4, so the string no longer multipoints there and the Expert tier loses its capstone', v_c3;
  end if;
  if (1121.6 - v_c3) >= 1 then
    raise exception 'PD2 go-live refused: the stage 4 closing margin is % psi, which is no longer the knife edge the tier is built on', 1121.6 - v_c3;
  end if;
  -- The same pair one valve up, where the verdict is also open but on a wider
  -- margin. Together the two make the verdict NON-MONOTONE in depth, which is
  -- the shape of this string.
  if not (v_c1 < 1219.4 and (1219.4 - v_c1) < 10) then
    raise exception 'PD2 go-live refused: valve 1 closes at % psia against the 1219.4 psia stage 2 casing pressure, a margin of % psi, which is not the narrow open verdict this string is built on', v_c1, 1219.4 - v_c1;
  end if;
  if not (v_c1 > v_c3 and v_c1 < 1268.3) then
    raise exception 'PD2 go-live refused: the closing pressures are not ordered, valve 1 % psia, valve 3 % psia, kickoff 1268.3 psia', v_c1, v_c3;
  end if;

  -- ------------------- Expert: THE CROSSING CLOSES ON ITS OWN TRAVERSE -----
  -- The capstone's traverse, evaluated at the reported depth. The crossing is
  -- defined by the injection pressure exceeding the flowing pressure by the
  -- 58.5 psi transfer differential and by nothing else, so this identity has
  -- to hold at the fine tabulation whatever else moves.
  v_trav := 224.6 + 0.062 * v_ipf + (0.167 * v_ipf * v_ipf) / (2 * 9640);
  if abs((v_ipp - 58.5) - v_trav) > 0.01 then
    raise exception 'PD2 go-live refused: the injection pressure of % psia less the 58.5 psi transfer differential is % psia against a flowing traverse of % psia at % ft, so the reported crossing is not on the capstone traverse', v_ipp, v_ipp - 58.5, v_trav, v_ipf;
  end if;

  -- ------------------- Expert: THE CHORD, AS A PAIR ------------------------
  -- Fields 15 and 17 are one crossing at two tabulations. The coarse one must
  -- be SHALLOWER, because a chord across a traverse that steepens with depth
  -- lies above the true curve and cuts the crossing short. The gap must be big
  -- enough to be the finding and small enough to still be one well.
  if v_ipc >= v_ipf then
    raise exception 'PD2 go-live refused: the coarse tabulation puts the injection point at % ft, at or below the fine one at % ft, which is the wrong direction for a chord across a steepening traverse', v_ipc, v_ipf;
  end if;
  if not (v_ipf - v_ipc > 5 and v_ipf - v_ipc < 100) then
    raise exception 'PD2 go-live refused: the two tabulations disagree by % ft, which is not the chord artefact the Expert tier is built on', v_ipf - v_ipc;
  end if;
  if not (v_ipf > v_v4d and v_ipf < 9640 and v_ipc > v_v4d and v_ipc < 9640) then
    raise exception 'PD2 go-live refused: an injection point at % ft or % ft does not sit between valve 4 at % ft and the 9640 ft packer', v_ipf, v_ipc, v_v4d;
  end if;

  -- ------------------- Expert: THE OPERATING PRESSURE, AS A PAIR -----------
  -- The design was targeted on the KICKOFF pressure and the well runs on the
  -- operating one. The operating line must read LOWER than the kickoff line at
  -- the same depth, which is only arithmetic, AND it must read below the
  -- flowing traverse there, which is the finding: at the pressure this well
  -- actually runs on, gas cannot enter at the depth the design bought.
  -- Checking only the first would pass on a well whose operating pressure
  -- still reaches, and that well has no lesson in it.
  if v_opln >= v_ipp then
    raise exception 'PD2 go-live refused: the operating injection line reads % psia against the kickoff line at % psia at the same depth, which cannot happen on a lower surface pressure', v_opln, v_ipp;
  end if;
  if v_opln >= v_trav then
    raise exception 'PD2 go-live refused: the operating injection line reads % psia against a flowing traverse of % psia at % ft, so gas can still enter at the design target and the Expert tier loses its finding', v_opln, v_trav, v_ipf;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'gaslift' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'gaslift' and status = 'available') then
    raise exception 'PD2 go-live refused: gaslift did not reach status available';
  end if;

  raise notice 'PD2 go-live: gaslift is available, behind nodal, at path_order 31.';
end $$;
