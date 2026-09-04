-- ============================================================================
-- PD5 GO-LIVE (HELD): Gas Well Performance flips to 'available'. This is the
-- FIFTH Production & Artificial Lift course, behind 'nodal' at path_order 34.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/gaswell. That upload is the gate, and
-- nothing else releases this file.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the seed, and most are PAIRS, because a one-sided check passes on a capstone
-- quietly recut into the mistake the course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS PASS AT THE GAUGE, LOAD AT THE SHOE. The
-- wellhead critical rate must sit BELOW the 2,551.3 Mscf/d the well flows and
-- the shoe critical rate must sit ABOVE it. Asserting only the second would
-- pass on a well that is visibly loading at surface, and the whole reason
-- loadingProfile exists rather than a single wellhead check would be gone from
-- the capstone while all 78 lessons still argued for it. The mid-string
-- station is asserted too, on the other side, which brackets the crossing
-- between 4,210 ft and 6,315 ft where the course says it is.
--
-- THE SECOND PAIR IS THE CORRELATION DECIDING THE WORKOVER. The chosen string
-- must UNLOAD under the recommended correlation and must LOAD under the other
-- one, which is one multiplication apart: its critical rate must be below the
-- flowing rate and its critical rate times 1.2 must be above it. A capstone
-- recut onto a string with more margin would satisfy the first and destroy the
-- Expert tier's central claim, that a wellhead reading four tenths of a psi
-- under a threshold picked the workover.
--
-- THE THIRD PAIR IS THE PLUNGER SCREEN DISAGREEING WITH ITSELF. The pressure
-- half must PASS, the required lift sitting below the 745 psia of casing, and
-- the gas half must FAIL, the required gas-liquid ratio sitting above the
-- 6,825 scf/bbl the well makes. Both, or the tier loses the case it is built
-- on. The 400 scf/bbl per 1000 ft heuristic is asserted separately, because
-- the point is not that the screen fails but that two tests of one
-- installation disagree and the engine surfaces it rather than resolving it.
--
-- THE FOURTH IS THE 0.433 SEAM, AS AN EQUALITY THAT MUST CLOSE AND ONE THAT
-- MUST NOT. The graded slug hydrostatic must equal 165 ft times 1.095 times
-- the platform's ROUNDED 0.433 psi/ft per unit of specific gravity EXACTLY,
-- and must NOT equal the same product formed with the exact rho g of
-- 0.4335275. That second half is the one that earns its keep: it is the only
-- graded value in this course a learner can reach by hand, and a course that
-- had quietly moved onto the exact gradient would satisfy every other check
-- here while contradicting its own Expert module 3.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE TWO.
--
--   SMALL GROUP, the nine fields below 100 (a z factor, a density, four
--   velocities, a pressure term and a daily liquid volume). Largest grader
--   tolerance in the group 8.2e-5. Nearest real published neighbour anywhere
--   in the group 0.0523148, which is the wellhead z of 0.84768523 against the
--   flat 0.9 the published fixture assumes. A window of 1e-3 therefore sits
--   12.2 TIMES ABOVE the largest tolerance it covers and 52 TIMES BELOW the
--   nearest neighbour it must not catch.
--
--   LARGE GROUP, the nine fields above 300 (critical rates, a lift pressure, a
--   gas-liquid ratio, a slug length and a cycle gas volume). Largest grader
--   tolerance 0.012. Nearest real published neighbour 10.0012, the longest
--   liftable slug of 1041.93 ft against a published Turner critical rate of
--   1031.93 Mscf/d. A window of 0.1 sits 8.3 TIMES ABOVE the largest tolerance
--   and 100 TIMES BELOW that neighbour.
--
-- That 10.00 approach is a slug LENGTH in feet landing ten units from a gas
-- RATE in Mscf/d, which is a coincidence of magnitude and not a lookup. The
-- sweep of eighteen graded values against 2489 published numbers, the goldens
-- and the teaching digest together, found zero collisions and zero integer
-- notes.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE, which re-reads the STORED prompts.
-- The loading RATIOS were drafted into two prompts and removed from both,
-- because a ratio times a stated flowing rate is a critical rate another tier
-- is graded on, and a leak that needs one multiplication is still a leak.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_z     numeric; v_rho   numeric; v_vb    numeric; v_vc    numeric;
  v_qc    numeric; v_va    numeric;
  v_qmid  numeric; v_qshoe numeric; v_vshoe numeric; v_qsize numeric;
  v_plift numeric; v_glr   numeric;
  v_vturn numeric; v_qrej  numeric; v_slug  numeric; v_maxsl numeric;
  v_gas   numeric; v_liq   numeric;
  v_bbl   numeric;
  -- Stated conditions of the capstone well, and engine constants. None of
  -- these is a graded value; they are what the assertions are written against.
  c_q            constant numeric := 2551.3;        -- Mscf/d the well flows
  c_well_glr     constant numeric := 6825;          -- scf/bbl the well makes
  c_liquid_bpd   constant numeric := 373.8;         -- bbl/d the well makes
  c_casing       constant numeric := 745;           -- psia available
  c_rule_glr     constant numeric := 3368;          -- 400 scf/bbl/1000 ft over 8420 ft
  c_slug_ft      constant numeric := 165;
  c_liquid_sg    constant numeric := 1.095;
  c_plunger_id   constant numeric := 2.750;
  c_psi_per_ft   constant numeric := 0.433;         -- the platform's ROUNDED constant
  c_exact_grad   constant numeric := 0.4335275;     -- rho g, which the oracle uses
  c_turner_adj   constant numeric := 1.2;           -- Turner's adjustment, exactly
  c_air_mw       constant numeric := 28.9647;       -- gasWellLoading.AIR_MW
  c_r_gas        constant numeric := 10.7316;
  c_gas_sg       constant numeric := 0.702;
  c_wh_psia      constant numeric := 999.62;
  c_wh_degr      constant numeric := 556.07;        -- 96.4 degF at the engine's own toRankine
  c_brine_sigma  constant numeric := 66.4;
  c_brine_rho    constant numeric := 68.35;
  c_cond_sigma   constant numeric := 24.6;
  c_cond_rho     constant numeric := 43.8;
  c_in3_per_bbl  constant numeric := 9702;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'gaswell' and active;
  if v_structures <> 3 then
    raise exception 'PD5 go-live refused: gaswell has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'gaswell';
  if v_questions <> 396 then
    raise exception 'PD5 go-live refused: gaswell has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'gaswell';
  if v_capstones <> 3 then
    raise exception 'PD5 go-live refused: gaswell has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'gaswell'
                   and module = 'production' and path_order = 34 and prereq_slug = 'nodal') then
    raise exception 'PD5 go-live refused: the gaswell catalog row is not production/34 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD5 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- These engines carry a droplet, size a string against a rate and screen a
  -- plunger. PD1 owns the gas inflow and the node, and nothing here may
  -- certify an inflow, a decline, a reserve or a price. The one boundary worth
  -- naming explicitly is the IPR: a course that graded a bottomhole flowing
  -- pressure against a deliverability curve would be teaching PD1's subject
  -- with PD5's engines.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gaswell'
     and (f->>'label' ilike '%reserve%'  or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'  or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'    or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%probabilit%'
       or f->>'label' ilike '%skin%'     or f->>'label' ilike '%permeab%'
       or f->>'label' ilike '%inflow%'   or f->>'label' ilike '%deliverab%'
       or f->>'label' ilike '%absolute open%'
       or f->>'unit'  ilike '%usd%'      or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psig%'     or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'PD5 go-live refused: % capstone field(s) grade a quantity these deliquification engines cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gaswell'
     and (abs((f->>'expected')::numeric - 0.9)                < 0.001 -- the fixture's flat z
       or abs((f->>'expected')::numeric - 4.073798009608)     < 0.001 -- published Coleman velocity
       or abs((f->>'expected')::numeric - 6.586639385915)     < 0.001 -- published Coleman velocity
       or abs((f->>'expected')::numeric - 4.498859477368)     < 0.001 -- published Coleman velocity
       or abs((f->>'expected')::numeric - 7.903967263098)     < 0.001 -- published Turner velocity
       or abs((f->>'expected')::numeric - 4.386898323731)     < 0.001 -- published Coleman velocity
       or abs((f->>'expected')::numeric - 5.398631372842)     < 0.001 -- published Turner velocity
       or abs((f->>'expected')::numeric - 20)                 < 0.001 -- a published surface tension
       or abs((f->>'expected')::numeric - 88.439610816205)    < 0.001 -- the published slug hydrostatic
       or abs((f->>'expected')::numeric - 2341.162863677982)  < 0.1   -- published Turner critical rate
       or abs((f->>'expected')::numeric - 1031.930477997816)  < 0.1   -- published Turner critical rate
       or abs((f->>'expected')::numeric - 2500)               < 0.1   -- a published station pressure
       or abs((f->>'expected')::numeric - 300)                < 0.1   -- a published station pressure
       or abs((f->>'expected')::numeric - 6000)               < 0.1); -- the published plunger depth
  if v_graded <> 0 then
    raise exception 'PD5 go-live refused: % graded field(s) sit within a window of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'gaswell' and c2.app_slug = 'gaswell' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD5 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_z     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_z_dak';
  select (f->>'expected')::numeric into v_rho   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_gas_density_lbmft3';
  select (f->>'expected')::numeric into v_vb    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_terminal_velocity_brine_fts';
  select (f->>'expected')::numeric into v_vc    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_terminal_velocity_cond_fts';
  select (f->>'expected')::numeric into v_qc    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_critical_rate_mscfd';
  select (f->>'expected')::numeric into v_va    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='wh_actual_velocity_fts';
  select (f->>'expected')::numeric into v_qmid  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='mid_critical_rate_mscfd';
  select (f->>'expected')::numeric into v_qshoe from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='shoe_critical_rate_mscfd';
  select (f->>'expected')::numeric into v_vshoe from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='shoe_actual_velocity_fts';
  select (f->>'expected')::numeric into v_qsize from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='sized_tubing_critical_rate_mscfd';
  select (f->>'expected')::numeric into v_plift from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_required_lift_psia';
  select (f->>'expected')::numeric into v_glr   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_required_glr_scfbbl';
  select (f->>'expected')::numeric into v_vturn from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='shoe_critical_velocity_turner_fts';
  select (f->>'expected')::numeric into v_qrej  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='rejected_tubing_critical_rate_mscfd';
  select (f->>'expected')::numeric into v_slug  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_slug_hydrostatic_psi';
  select (f->>'expected')::numeric into v_maxsl from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_max_slug_ft';
  select (f->>'expected')::numeric into v_gas   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_gas_per_cycle_scf';
  select (f->>'expected')::numeric into v_liq   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='gaswell' and f->>'key'='plunger_liquid_per_day_bbl';

  if v_z is null or v_rho is null or v_vb is null or v_vc is null or v_qc is null
     or v_va is null or v_qmid is null or v_qshoe is null or v_vshoe is null
     or v_qsize is null or v_plift is null or v_glr is null or v_vturn is null
     or v_qrej is null or v_slug is null or v_maxsl is null or v_gas is null
     or v_liq is null then
    raise exception 'PD5 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------- Associate: THE Z WAS COMPUTED, NOT ASSUMED ----------
  if abs(v_z - 0.9) < 0.03 then
    raise exception 'PD5 go-live refused: the wellhead z of % is within 0.03 of the flat 0.9 the published fixture assumes, so the tier''s instruction to go and get a z rather than assume one no longer has a consequence', v_z;
  end if;
  if not (v_z > 0.80 and v_z < 0.88) then
    raise exception 'PD5 go-live refused: the wellhead z of % is outside the 0.80 to 0.88 band the lessons state for this well', v_z;
  end if;
  if abs(v_rho - c_gas_sg * c_air_mw * c_wh_psia / (v_z * c_r_gas * c_wh_degr)) > 0.0000001 then
    raise exception 'PD5 go-live refused: the wellhead gas density of % lbm/ft3 is not the real gas law on the graded z at 999.62 psia and 556.07 degR through the LOADING module''s 28.9647 molecular weight', v_rho;
  end if;

  -- ------------------- Associate: THE HEAVIER LIQUID FALLS FASTER ----------
  -- Stated as an identity rather than an inequality, because at one station
  -- everything in the droplet balance except surface tension and density
  -- difference cancels between the two liquids. The inequality alone would
  -- pass on a pair of liquids chosen to make the point trivially.
  if v_vb <= v_vc then
    raise exception 'PD5 go-live refused: the brine droplet terminal velocity of % ft/s does not exceed the condensate''s % ft/s, so the result module 3 is built on has reversed', v_vb, v_vc;
  end if;
  if abs(v_vb / v_vc
         - (((c_brine_sigma * (c_brine_rho - v_rho)) / (c_cond_sigma * (c_cond_rho - v_rho))) ^ 0.25)) > 0.0000001 then
    raise exception 'PD5 go-live refused: the ratio of the two terminal velocities is not the fourth root of the ratio of surface tension times density difference, so one of the two liquids is no longer being read at this station';
  end if;

  -- ------------------- Associate: THE WELL PASSES AT THE GAUGE, TWICE ------
  -- Under the recommended correlation AND under the stricter one. The second
  -- is what makes the Associate conclusion confidently wrong rather than
  -- marginal, and it is the whole motivation for the tier above.
  if v_va <= v_vb then
    raise exception 'PD5 go-live refused: the wellhead actual velocity of % ft/s does not exceed the critical velocity of % ft/s, so the well no longer looks healthy at the gauge', v_va, v_vb;
  end if;
  if v_va <= c_turner_adj * v_vb then
    raise exception 'PD5 go-live refused: the wellhead does not clear the stricter correlation either, so the tier''s wrong conclusion is now a marginal one rather than a confident one';
  end if;
  if abs(v_qc * (v_va / v_vb) - c_q) > 0.001 then
    raise exception 'PD5 go-live refused: the wellhead critical rate of % Mscf/d scaled by the velocity ratio does not return the 2551.3 Mscf/d the well flows, so the rate and the velocity are no longer describing one station', v_qc;
  end if;

  -- ------------------- Professional: PASS AT THE GAUGE, LOAD AT THE SHOE --
  if v_qc >= c_q then
    raise exception 'PD5 go-live refused: the wellhead critical rate of % Mscf/d is not below the 2551.3 Mscf/d the well flows, so the well is visibly loading at surface and the course has lost its premise', v_qc;
  end if;
  if v_qshoe <= c_q then
    raise exception 'PD5 go-live refused: the shoe critical rate of % Mscf/d is not above the 2551.3 Mscf/d the well flows, so the well no longer loads at the shoe', v_qshoe;
  end if;
  if v_qmid >= c_q then
    raise exception 'PD5 go-live refused: the 4210 ft critical rate of % Mscf/d is already above the flowing rate, so the crossing has moved above the mid string station the lessons bracket it between', v_qmid;
  end if;
  if not (v_qc < v_qmid and v_qmid < v_qshoe) then
    raise exception 'PD5 go-live refused: the three critical rates are not increasing with depth, so the traverse is no longer monotone and the argument that the margin closes downward has gone';
  end if;
  if v_vshoe >= v_va then
    raise exception 'PD5 go-live refused: the actual velocity at the shoe of % ft/s is not below the wellhead''s % ft/s, so the same standard rate is no longer occupying less volume at higher pressure', v_vshoe, v_va;
  end if;

  -- ------------------- Professional: THE CORRELATION DECIDES THE WORKOVER --
  if v_qsize >= c_q then
    raise exception 'PD5 go-live refused: the chosen string''s critical rate of % Mscf/d is not below the flowing rate, so the sizing has picked a string that does not unload', v_qsize;
  end if;
  if v_qsize * c_turner_adj <= c_q then
    raise exception 'PD5 go-live refused: the chosen string still unloads under the stricter correlation, so the 0.38 psi that picked the correlation no longer decides the workover and the Expert tier loses its consequence';
  end if;

  -- ------------------- Professional: THE SCREEN DISAGREES WITH ITSELF -----
  if v_plift >= c_casing then
    raise exception 'PD5 go-live refused: the required lift pressure of % psia is not below the 745 psia of casing, so the pressure half of the screen no longer passes', v_plift;
  end if;
  if v_glr <= c_well_glr then
    raise exception 'PD5 go-live refused: the required gas-liquid ratio of % scf/bbl is not above the 6825 scf/bbl the well makes, so the gas half of the screen no longer fails and the two halves now agree', v_glr;
  end if;
  if c_well_glr <= c_rule_glr then
    raise exception 'PD5 go-live refused: the well no longer beats the 400 scf/bbl per 1000 ft heuristic, so the rule of thumb and the physics no longer disagree';
  end if;
  if v_glr / c_rule_glr < 2.5 or v_glr / c_rule_glr > 3.0 then
    raise exception 'PD5 go-live refused: the force balance asks % times what the heuristic asks, outside the band the lessons state', v_glr / c_rule_glr;
  end if;

  -- ------------------- Expert: BOTH CORRELATIONS LOAD THE SHOE ------------
  if v_vturn <= v_vshoe then
    raise exception 'PD5 go-live refused: the Turner critical velocity at the shoe of % ft/s is not above the actual % ft/s', v_vturn, v_vshoe;
  end if;
  if v_vturn / c_turner_adj <= v_vshoe then
    raise exception 'PD5 go-live refused: the shoe clears under the recommended correlation, so the well no longer loads at the shoe under the correlation the engine actually chose';
  end if;
  if v_vshoe / (v_vturn / c_turner_adj) > 0.94 then
    raise exception 'PD5 go-live refused: the shoe margin has narrowed to % of critical, so the 7.5 percent deficit the lessons quote no longer holds', v_vshoe / (v_vturn / c_turner_adj);
  end if;

  -- ------------------- Expert: THE CANDIDATE THAT WAS DISCARDED -----------
  if v_qrej <= c_q then
    raise exception 'PD5 go-live refused: the rejected candidate''s critical rate of % Mscf/d is below the flowing rate, so it would have been chosen and there is no discarded candidate', v_qrej;
  end if;
  if v_qrej <= v_qsize then
    raise exception 'PD5 go-live refused: the rejected candidate''s critical rate is not above the chosen string''s, so it is not the larger bore and the walk down the list has changed direction';
  end if;
  if c_q / v_qrej < 0.95 then
    raise exception 'PD5 go-live refused: the rejected candidate reaches only % of one, which is a clear rejection rather than the near miss module 2 is written on', c_q / v_qrej;
  end if;

  -- ------------------- Expert: THE 0.433 SEAM, CLOSE AND REFUSE -----------
  if abs(v_slug - c_slug_ft * c_liquid_sg * c_psi_per_ft) > 0.000001 then
    raise exception 'PD5 go-live refused: the slug hydrostatic of % psi is not 165 ft times 1.095 times the platform''s rounded 0.433 psi/ft', v_slug;
  end if;
  if abs(v_slug - c_slug_ft * c_liquid_sg * c_exact_grad) < 0.01 then
    raise exception 'PD5 go-live refused: the slug hydrostatic is now indistinguishable from the exact rho g form, so the one seam the gate itself records has closed and Expert module 3 is teaching a disagreement its own capstone no longer has';
  end if;

  -- ------------------- Expert: THE CYCLE, AND WHAT NOBODY CHECKS ----------
  if v_maxsl <= c_slug_ft then
    raise exception 'PD5 go-live refused: the longest liftable slug of % ft does not exceed the 165 ft slug the installation lifts, so the pressure half of the screen could not have passed', v_maxsl;
  end if;
  if v_maxsl <= 0 then
    raise exception 'PD5 go-live refused: the longest liftable slug clamped to zero, which is the refusal-wearing-a-number the tier exists to point at, not a value to certify against';
  end if;
  -- The identity that ties the Expert cycle gas to the Professional ratio
  -- without either prompt stating the other's answer: a cycle's gas over the
  -- barrels one slug holds IS the required gas-liquid ratio.
  v_bbl := c_slug_ft * 12 * pi() / 4 * c_plunger_id * c_plunger_id / c_in3_per_bbl;
  if abs(v_gas / v_glr - v_bbl) > 0.000001 then
    raise exception 'PD5 go-live refused: the cycle gas over the required ratio is % bbl against the % bbl a 165 ft slug of 2.750 in tubing holds, so fields 12 and 17 no longer describe one cycle', v_gas / v_glr, v_bbl;
  end if;
  if v_liq >= c_liquid_bpd then
    raise exception 'PD5 go-live refused: a day of cycling delivers % bbl, which is not below the 373.8 bbl/d the well makes, so the finding the tier ends on has gone', v_liq;
  end if;
  if c_liquid_bpd / v_liq < 10 then
    raise exception 'PD5 go-live refused: the well makes only % times what a day of cycling delivers, so the gap that no screen in this package looks at is no longer the order of magnitude the lessons state', c_liquid_bpd / v_liq;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'gaswell' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'gaswell' and status = 'available') then
    raise exception 'PD5 go-live refused: gaswell did not reach status available';
  end if;

  raise notice 'PD5 go-live: gaswell is available, behind nodal, at path_order 34.';
end $$;
