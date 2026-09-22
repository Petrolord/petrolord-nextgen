-- ============================================================================
-- B5 FOLLOW-ON W2 (publish inputs in prompts and lessons): gaswell.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (a), and the spec docs/graded-field-audit/w2/gaswell.json (the
-- inputs, where each came from, and the key each reproduces through the
-- vendored engines). Owner approved D1 to D7 as recommended, 2026-09-21.
--
-- BEGINNER
--   Prompt only, no field moves. Every beginner field needs z from Sutton and
--   Dranchuk and Abou-Kassem, which no lesson or panel gives (B5 finding 1). z
--   at the wellhead IS field 1, so printing it would hand that field over; the
--   prompt instead states the Sutton pseudo-criticals for this gas and the DAK
--   equation with its eleven constants (read from the vendored engine), so z is
--   a spreadsheet goal seek and the other five fields are the taught closed
--   forms on it. Keys, expected values and tolerances are unchanged.
--   PROMPT was: Take the compressibility factor from the package's own natural
--   gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and
--   NOT from a flat assumption.
--   PROMPT now: Take the compressibility factor from the package's own natural
--   gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and
--   NOT from a flat assumption. For this gas Sutton gives a pseudo-critical
--   temperature Tpc of 378.081504 degR and a pseudo-critical pressure Ppc of
--   663.063906 psia (a sweet gas, so no acid gas correction). Dranchuk and
--   Abou-Kassem then make z the root of z = 1 + (A1 + A2/Tpr + A3/Tpr^3 +
--   A4/Tpr^4 + A5/Tpr^5) rr + (A6 + A7/Tpr + A8/Tpr^2) rr^2 - A9 (A7/Tpr +
--   A8/Tpr^2) rr^5 + A10 (1 + A11 rr^2) (rr^2/Tpr^3) exp(-A11 rr^2), where rr =
--   0.27 Ppr / (z Tpr), Tpr is the absolute temperature over Tpc, Ppr is the
--   pressure over Ppc, and A1 to A11 are 0.3265, -1.07, -0.5339, 0.01569,
--   -0.05165, 0.5475, -0.7361, 0.1844, 0.1056, 0.6134, 0.721; solve it by goal
--   seek or iteration.
--
-- INTERMEDIATE
--   Prompt only, no field moves. The prompt asked for z at every station from
--   the package correlation, which only the engine could supply (B5 finding 1).
--   It now states z at the four stations below the wellhead and at the plunger's
--   average conditions (vendored naturalGasZ, ten decimals), so the critical
--   rates, the sizing and the plunger balance are the taught closed forms. The
--   wellhead z is left out: it is the beginner key.
--   PROMPT was: Take z from the package's own natural gas correlation at EVERY
--   station, and convert temperature at the door.
--   PROMPT now: Take z from the package's own natural gas correlation at EVERY
--   station, and convert temperature at the door: z at each station below the
--   wellhead, from the package's own natural gas correlation (Sutton with
--   Dranchuk and Abou-Kassem) at that station's pressure and temperature, is:
--   2105 ft 0.8443510213; 4210 ft 0.8466418981; 6315 ft 0.8536633916; 8420 ft
--   0.8677419755. For the plunger, z at the 214 psia line pressure and the 142.8
--   degF average tubing temperature is 0.9740548796. The wellhead z is the
--   Associate tier's own graded answer and nothing in this tier needs it.
--
-- ADVANCED
--   Prompt only, no field moves. As intermediate: z at the four stations below
--   the wellhead and at the plunger conditions is stated, so every field is a
--   closed form. The sentence calling field 3 one of the only two values
--   reachable by hand is no longer true and now says fields 3 and 6 need no z at
--   all.
--   PROMPT was: Take z from the package's own natural gas correlation at every
--   station and convert temperature at the door.
--   PROMPT now: Take z from the package's own natural gas correlation at every
--   station and convert temperature at the door: z at each station below the
--   wellhead, from the package's own natural gas correlation (Sutton with
--   Dranchuk and Abou-Kassem) at that station's pressure and temperature, is:
--   2105 ft 0.8443510213; 4210 ft 0.8466418981; 6315 ft 0.8536633916; 8420 ft
--   0.8677419755. For the plunger, z at the 214 psia line pressure and the 142.8
--   degF average tubing temperature is 0.9740548796. The wellhead z is the
--   Associate tier's own graded answer and nothing in this tier needs it.
--   PROMPT was: Field 3 is one of the two graded values in this course reachable
--   by hand, field 6 being the other, and doing field 3 by hand with the
--   textbook water gradient FAILS:
--   PROMPT now: Field 3 needs no z at all, and neither does field 6, and doing
--   field 3 by hand with the textbook water gradient FAILS:
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected value and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently, nobody is re-scored and no attempts guard is needed.
--
-- GUARDS. Each row must hold EITHER its published prompt (by md5) with its
-- live fields (exact jsonb), as production holds it after W1 (it is
-- rewritten), OR its W2 prompt with the same fields (left alone). Anything
-- else raises and the whole file rolls back. A file that will write first
-- checks the W1 post-state and refuses without it. Generated by
-- docs/graded-field-audit/w2_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_s0       text;
  v_s1       text;
  v_s2       text;
begin
  -- gaswell / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaswell' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w2 gaswell refused: gaswell/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '8bb57814a492a0fc1f9d80315c2ee302' and fields = '[{"key": "wh_z_dak", "tol": 0.000001, "unit": "fraction", "label": "Wellhead z factor", "expected": 0.847685225820759}, {"key": "wh_gas_density_lbmft3", "tol": 0.0000042, "unit": "lbm/ft3", "label": "Wellhead gas density", "expected": 4.018024007155638}, {"key": "wh_terminal_velocity_brine_fts", "tol": 0.0000068, "unit": "ft/s", "label": "Brine droplet terminal velocity", "expected": 6.42693606609917}, {"key": "wh_terminal_velocity_cond_fts", "tol": 0.0000047, "unit": "ft/s", "label": "Condensate droplet terminal velocity", "expected": 4.446421214633396}, {"key": "wh_critical_rate_mscfd", "tol": 0.0021, "unit": "Mscf/d", "label": "Wellhead critical rate", "expected": 2032.5884737584674}, {"key": "wh_actual_velocity_fts", "tol": 0.0000083, "unit": "ft/s", "label": "Wellhead actual velocity", "expected": 8.067074175186569}]'::jsonb then 'old'
              when md5(prompt) = '709a80f987ffc8cd04b9e0c844563481' and fields = '[{"key": "wh_z_dak", "tol": 0.000001, "unit": "fraction", "label": "Wellhead z factor", "expected": 0.847685225820759}, {"key": "wh_gas_density_lbmft3", "tol": 0.0000042, "unit": "lbm/ft3", "label": "Wellhead gas density", "expected": 4.018024007155638}, {"key": "wh_terminal_velocity_brine_fts", "tol": 0.0000068, "unit": "ft/s", "label": "Brine droplet terminal velocity", "expected": 6.42693606609917}, {"key": "wh_terminal_velocity_cond_fts", "tol": 0.0000047, "unit": "ft/s", "label": "Condensate droplet terminal velocity", "expected": 4.446421214633396}, {"key": "wh_critical_rate_mscfd", "tol": 0.0021, "unit": "Mscf/d", "label": "Wellhead critical rate", "expected": 2032.5884737584674}, {"key": "wh_actual_velocity_fts", "tol": 0.0000083, "unit": "ft/s", "label": "Wellhead actual velocity", "expected": 8.067074175186569}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'gaswell' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w2 gaswell refused: gaswell/beginner matches neither its published form (prompt md5 8bb57814a492a0fc1f9d80315c2ee302) nor its W2 form (prompt md5 709a80f987ffc8cd04b9e0c844563481), with the fields this file was generated against';
  end if;

  -- gaswell / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaswell' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w2 gaswell refused: gaswell/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '58e1a16831e28d9a89e4104b87de4619' and fields = '[{"key": "mid_critical_rate_mscfd", "tol": 0.0025, "unit": "Mscf/d", "label": "Critical rate at 4210 ft", "expected": 2381.915240563656}, {"key": "shoe_critical_rate_mscfd", "tol": 0.0029, "unit": "Mscf/d", "label": "Critical rate at the shoe", "expected": 2757.4013450247076}, {"key": "shoe_actual_velocity_fts", "tol": 0.0000044, "unit": "ft/s", "label": "Actual velocity at the shoe", "expected": 4.259303791892167}, {"key": "sized_tubing_critical_rate_mscfd", "tol": 0.0024, "unit": "Mscf/d", "label": "Critical rate of the chosen string", "expected": 2329.389923010978}, {"key": "plunger_required_lift_psia", "tol": 0.00035, "unit": "psia", "label": "Plunger lift pressure required", "expected": 333.42363379741835}, {"key": "plunger_required_glr_scfbbl", "tol": 0.0098, "unit": "scf/bbl", "label": "Gas-liquid ratio a cycle costs", "expected": 9306.71712654132}]'::jsonb then 'old'
              when md5(prompt) = '0a72bc622b3a605d631eb68a9b21004d' and fields = '[{"key": "mid_critical_rate_mscfd", "tol": 0.0025, "unit": "Mscf/d", "label": "Critical rate at 4210 ft", "expected": 2381.915240563656}, {"key": "shoe_critical_rate_mscfd", "tol": 0.0029, "unit": "Mscf/d", "label": "Critical rate at the shoe", "expected": 2757.4013450247076}, {"key": "shoe_actual_velocity_fts", "tol": 0.0000044, "unit": "ft/s", "label": "Actual velocity at the shoe", "expected": 4.259303791892167}, {"key": "sized_tubing_critical_rate_mscfd", "tol": 0.0024, "unit": "Mscf/d", "label": "Critical rate of the chosen string", "expected": 2329.389923010978}, {"key": "plunger_required_lift_psia", "tol": 0.00035, "unit": "psia", "label": "Plunger lift pressure required", "expected": 333.42363379741835}, {"key": "plunger_required_glr_scfbbl", "tol": 0.0098, "unit": "scf/bbl", "label": "Gas-liquid ratio a cycle costs", "expected": 9306.71712654132}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'gaswell' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w2 gaswell refused: gaswell/intermediate matches neither its published form (prompt md5 58e1a16831e28d9a89e4104b87de4619) nor its W2 form (prompt md5 0a72bc622b3a605d631eb68a9b21004d), with the fields this file was generated against';
  end if;

  -- gaswell / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaswell' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w2 gaswell refused: gaswell/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '07f6076362de4a93714236cc10af4012' and fields = '[{"key": "shoe_critical_velocity_turner_fts", "tol": 0.0000058, "unit": "ft/s", "label": "Turner critical velocity at the shoe", "expected": 5.524059109300652}, {"key": "rejected_tubing_critical_rate_mscfd", "tol": 0.0028, "unit": "Mscf/d", "label": "Critical rate of the rejected candidate", "expected": 2629.8878454771925}, {"key": "plunger_slug_hydrostatic_psi", "tol": 0.000082, "unit": "psi", "label": "Slug hydrostatic term", "expected": 78.232275}, {"key": "plunger_max_slug_ft", "tol": 0.0011, "unit": "ft", "label": "Longest liftable slug", "expected": 1041.9317152418678}, {"key": "plunger_gas_per_cycle_scf", "tol": 0.012, "unit": "scf", "label": "Gas per cycle", "expected": 11281.211169142487}, {"key": "plunger_liquid_per_day_bbl", "tol": 0.00002, "unit": "bbl/d", "label": "Liquid delivered per day", "expected": 18.79621249139511}]'::jsonb then 'old'
              when md5(prompt) = 'c760fa7f06ae8283db11bfe666059333' and fields = '[{"key": "shoe_critical_velocity_turner_fts", "tol": 0.0000058, "unit": "ft/s", "label": "Turner critical velocity at the shoe", "expected": 5.524059109300652}, {"key": "rejected_tubing_critical_rate_mscfd", "tol": 0.0028, "unit": "Mscf/d", "label": "Critical rate of the rejected candidate", "expected": 2629.8878454771925}, {"key": "plunger_slug_hydrostatic_psi", "tol": 0.000082, "unit": "psi", "label": "Slug hydrostatic term", "expected": 78.232275}, {"key": "plunger_max_slug_ft", "tol": 0.0011, "unit": "ft", "label": "Longest liftable slug", "expected": 1041.9317152418678}, {"key": "plunger_gas_per_cycle_scf", "tol": 0.012, "unit": "scf", "label": "Gas per cycle", "expected": 11281.211169142487}, {"key": "plunger_liquid_per_day_bbl", "tol": 0.00002, "unit": "bbl/d", "label": "Liquid delivered per day", "expected": 18.79621249139511}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'gaswell' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w2 gaswell refused: gaswell/advanced matches neither its published form (prompt md5 07f6076362de4a93714236cc10af4012) nor its W2 form (prompt md5 c760fa7f06ae8283db11bfe666059333), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W2 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w2 gaswell: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024a/b) must be applied first: production holds it, and the W2
  -- apply script checks all 34 files; this reads two of its rows
  if exists (select 1 from public.academy_capstones where app_slug = 'integrity' and tier = 'beginner' and active and md5(prompt) <> '0e0ac66d6b97e9f7f66b5055e1fddf7d')
     or exists (select 1 from public.academy_capstones where app_slug = 'welldata' and tier = 'beginner' and active and md5(prompt) <> 'f362ed27e7d8766e7e51dcf1ca0e5e6e') then
    raise exception 'w2 gaswell refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values from ONE STATION of IMIRINGI-7, and that station is the WELLHEAD, because it is the gauge an operator actually reads. THE GAS has a specific gravity of 0.702. THE WELLHEAD is at 999.62 PSIA and 96.4 degF. THE STRING is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, and the well is flowing 2,551.3 MSCF/D. THE WELL MAKES TWO LIQUIDS and you are asked about both: formation brine at an interfacial tension of 66.4 DYNE/CM and a density of 68.35 LBM/FT3, and a light condensate at 24.6 DYNE/CM and 43.8 LBM/FT3. Take the compressibility factor from the package''s own natural gas correlation, Sutton pseudo-criticals with Dranchuk and Abou-Kassem, and NOT from a flat assumption. For this gas Sutton gives a pseudo-critical temperature Tpc of 378.081504 degR and a pseudo-critical pressure Ppc of 663.063906 psia (a sweet gas, so no acid gas correction). Dranchuk and Abou-Kassem then make z the root of z = 1 + (A1 + A2/Tpr + A3/Tpr^3 + A4/Tpr^4 + A5/Tpr^5) rr + (A6 + A7/Tpr + A8/Tpr^2) rr^2 - A9 (A7/Tpr + A8/Tpr^2) rr^5 + A10 (1 + A11 rr^2) (rr^2/Tpr^3) exp(-A11 rr^2), where rr = 0.27 Ppr / (z Tpr), Tpr is the absolute temperature over Tpc, Ppr is the pressure over Ppc, and A1 to A11 are 0.3265, -1.07, -0.5339, 0.01569, -0.05165, 0.5475, -0.7361, 0.1844, 0.1056, 0.6134, 0.721; solve it by goal seek or iteration. The critical rate asked for is the one the recommended correlation gives on the BRINE, which is the heavier of the two liquids and therefore the one that governs. What the well does further down the hole is the Professional tier''s and is not needed here. Report: (1) the Z FACTOR at the wellhead; (2) the GAS DENSITY there; (3) the TERMINAL VELOCITY of a BRINE droplet; (4) the TERMINAL VELOCITY of a CONDENSATE droplet; (5) the CRITICAL RATE; and (6) the ACTUAL VELOCITY the well is making. Traps. A flat z of 0.9 is what the published fixture uses and it is wrong here by more than five percent, and z is in the denominator of BOTH the gas density and the actual velocity, so assuming one instead of computing one moves four of these six answers. The two modules in this chain disagree about temperature: one speaks degR and one speaks degF, so convert at the DOOR with the package''s own converter rather than adding a hand-typed 459.67 somewhere in the middle, which is where that error hides. They also carry two different molecular weights of air, 28.9647 and 28.9625, against the same gas constant, so a density computed through the other module differs in the fifth figure; report the one the LOADING module gives. Fields 3 and 4 are not ordered the way intuition suggests: the heavier liquid makes the FASTER droplet, because the terminal velocity rises with the density difference and the brine is heavier than the condensate by more than its higher surface tension gives back. Field 5 is a RATE and field 6 is a VELOCITY, and they are not two spellings of the same check; a rate carries the flow area and the standard conditions and a velocity does not. And the correlation is chosen for you, by a rule that reads THIS station and no other, so do not adjust anything by 20 percent here. Free checks: field 1 must sit between 0.84 and 0.87, well below the 0.9 the fixture assumes. Field 2 must equal the gas gravity times the air molecular weight times the pressure, over the z, the gas constant and the absolute temperature, so doubling the pressure at fixed z and temperature must double it. Field 3 divided by field 4 must equal the fourth root of the ratio of the two liquids'' surface tensions times density differences, since everything else in the droplet balance cancels between two liquids at one station. Field 5 divided by field 6 must be a pure function of the flow area, the pressure, the z and the temperature, and not of either liquid. And field 6 must EXCEED field 3, which is the whole reason a learner who stops at the wellhead concludes this well is unloaded, and is the finding the Professional tier overturns.'
     where app_slug = 'gaswell' and tier = 'beginner' and active and md5(prompt) = '8bb57814a492a0fc1f9d80315c2ee302';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 gaswell refused: gaswell/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '709a80f987ffc8cd04b9e0c844563481' and fields = '[{"key": "wh_z_dak", "tol": 0.000001, "unit": "fraction", "label": "Wellhead z factor", "expected": 0.847685225820759}, {"key": "wh_gas_density_lbmft3", "tol": 0.0000042, "unit": "lbm/ft3", "label": "Wellhead gas density", "expected": 4.018024007155638}, {"key": "wh_terminal_velocity_brine_fts", "tol": 0.0000068, "unit": "ft/s", "label": "Brine droplet terminal velocity", "expected": 6.42693606609917}, {"key": "wh_terminal_velocity_cond_fts", "tol": 0.0000047, "unit": "ft/s", "label": "Condensate droplet terminal velocity", "expected": 4.446421214633396}, {"key": "wh_critical_rate_mscfd", "tol": 0.0021, "unit": "Mscf/d", "label": "Wellhead critical rate", "expected": 2032.5884737584674}, {"key": "wh_actual_velocity_fts", "tol": 0.0000083, "unit": "ft/s", "label": "Wellhead actual velocity", "expected": 8.067074175186569}]'::jsonb) from public.academy_capstones where app_slug = 'gaswell' and tier = 'beginner' and active) is not true then
    raise exception 'w2 gaswell refused: gaswell/beginner does not read back as its W2 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values that turn IMIRINGI-7 from a gauge reading into a design. THE SAME WELL, restated in full so nothing has to be carried across from another tier. The gas has a specific gravity of 0.702. The string is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, to 8,420 FT, flowing 2,551.3 MSCF/D and making 373.8 BBL/D of formation brine at 66.4 DYNE/CM and 68.35 LBM/FT3. NEW HERE, and it is the point of the tier: THE FLOWING TRAVERSE, five measured stations, top first, as depth in ft with pressure in psia and temperature in degF. 0 and 999.62 and 96.4; 2,105 and 1,236.4 and 119.6; 4,210 and 1,503.9 and 142.8; 6,315 and 1,836.2 and 166.0; 8,420 and 2,261.5 and 189.2. Take z from the package''s own natural gas correlation at EVERY station, and convert temperature at the door: z at each station below the wellhead, from the package''s own natural gas correlation (Sutton with Dranchuk and Abou-Kassem) at that station''s pressure and temperature, is: 2105 ft 0.8443510213; 4210 ft 0.8466418981; 6315 ft 0.8536633916; 8420 ft 0.8677419755. For the plunger, z at the 214 psia line pressure and the 142.8 degF average tubing temperature is 0.9740548796. The wellhead z is the Associate tier''s own graded answer and nothing in this tier needs it. The correlation is the one the package recommends for this well, chosen by its own rule from the WELLHEAD pressure and then applied down the whole traverse, which is what the engine does. ALSO NEW: four real workover strings are available, with inside diameters 2.922, 2.750, 2.323 and 1.867 IN, to be sized at the CONTROLLING station for the SAME 2,551.3 Mscf/d; and a plunger installation is proposed on 2.750 IN tubing set at 8,420 FT, lifting a 165 FT slug of 1.095 specific gravity liquid, with a 9.4 LB plunger, a line pressure of 214 PSIA, a casing pressure of 745 PSIA and an average tubing temperature of 142.8 degF, against a well gas-liquid ratio of 6,825 SCF/BBL. Report: (1) the CRITICAL RATE at the 4,210 ft station; (2) the CRITICAL RATE at the controlling station; (3) the ACTUAL VELOCITY at the controlling station; (4) the CRITICAL RATE of the string the sizing CHOOSES; (5) the PRESSURE the plunger lift REQUIRES; and (6) the GAS-LIQUID RATIO a cycle COSTS. Traps. The controlling station is not the one with the worst pressure or the worst temperature, it is the one with the worst MARGIN, and on this well it is the SHOE, which is exactly the station the wellhead gauge cannot see. Fields 1 and 2 are both critical rates on the same traverse and they differ by more than fifteen percent, so quoting "the critical rate" of this well without naming a station has said nothing. Field 3 falls with depth while field 2 rises with it, and that opposite motion is why the margin closes downward: the gas is denser and slower at the bottom and the droplet is harder to carry there. The sizing is run at the CONTROLLING station and not at the wellhead, and running it at the wellhead picks a different string; field 4 is the critical rate OF the chosen string, not the rate the well makes. Fields 5 and 6 are the two halves of a plunger screen that DISAGREE with each other on this well: one of them passes and one of them fails, and a report that gives only the one that passes has hidden the answer. The 400 scf/bbl per 1000 ft screening heuristic is not field 6 and does not agree with it. Free checks: field 1 must sit between the wellhead critical rate and field 2, since the traverse is monotone in pressure. Field 2 must EXCEED the 2,551.3 Mscf/d the well is flowing, which is what makes the shoe the controlling station and the well a loading well. Field 3 must be BELOW the actual velocity at the wellhead, because the same standard rate occupies less volume at higher pressure. Field 4 must be BELOW the 2,551.3 Mscf/d the well makes, since the chosen string is one that UNLOADS, and it must EXCEED the critical rate of every smaller candidate on the list, since a critical rate rises with bore and the pick is the LARGEST bore that clears. If your field 4 exceeds the rate the well makes you have picked a string that does not unload at all. Field 5 must be BELOW the 745 psia of casing available, which is why the pressure half of the screen passes. Field 6 must EXCEED the 6,825 scf/bbl the well makes, which is why the gas half fails, and it must exceed 3,368 scf/bbl, which is what the rule of thumb asks and which this well beats twice over. Those last two together are the disagreement the engine surfaces rather than resolves.'
     where app_slug = 'gaswell' and tier = 'intermediate' and active and md5(prompt) = '58e1a16831e28d9a89e4104b87de4619';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 gaswell refused: gaswell/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '0a72bc622b3a605d631eb68a9b21004d' and fields = '[{"key": "mid_critical_rate_mscfd", "tol": 0.0025, "unit": "Mscf/d", "label": "Critical rate at 4210 ft", "expected": 2381.915240563656}, {"key": "shoe_critical_rate_mscfd", "tol": 0.0029, "unit": "Mscf/d", "label": "Critical rate at the shoe", "expected": 2757.4013450247076}, {"key": "shoe_actual_velocity_fts", "tol": 0.0000044, "unit": "ft/s", "label": "Actual velocity at the shoe", "expected": 4.259303791892167}, {"key": "sized_tubing_critical_rate_mscfd", "tol": 0.0024, "unit": "Mscf/d", "label": "Critical rate of the chosen string", "expected": 2329.389923010978}, {"key": "plunger_required_lift_psia", "tol": 0.00035, "unit": "psia", "label": "Plunger lift pressure required", "expected": 333.42363379741835}, {"key": "plunger_required_glr_scfbbl", "tol": 0.0098, "unit": "scf/bbl", "label": "Gas-liquid ratio a cycle costs", "expected": 9306.71712654132}]'::jsonb) from public.academy_capstones where app_slug = 'gaswell' and tier = 'intermediate' and active) is not true then
    raise exception 'w2 gaswell refused: gaswell/intermediate does not read back as its W2 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for IMIRINGI-7 that the design report does not print. THE SAME WELL AGAIN, restated in full. The gas has a specific gravity of 0.702. The string is 3-1/2 in 9.3 lb/ft tubing, inside diameter 2.992 IN, to 8,420 FT, flowing 2,551.3 MSCF/D and making 373.8 BBL/D of formation brine at 66.4 DYNE/CM and 68.35 LBM/FT3. The flowing traverse, top first, as depth in ft with pressure in psia and temperature in degF: 0 and 999.62 and 96.4; 2,105 and 1,236.4 and 119.6; 4,210 and 1,503.9 and 142.8; 6,315 and 1,836.2 and 166.0; 8,420 and 2,261.5 and 189.2. Take z from the package''s own natural gas correlation at every station and convert temperature at the door: z at each station below the wellhead, from the package''s own natural gas correlation (Sutton with Dranchuk and Abou-Kassem) at that station''s pressure and temperature, is: 2105 ft 0.8443510213; 4210 ft 0.8466418981; 6315 ft 0.8536633916; 8420 ft 0.8677419755. For the plunger, z at the 214 psia line pressure and the 142.8 degF average tubing temperature is 0.9740548796. The wellhead z is the Associate tier''s own graded answer and nothing in this tier needs it. The four workover candidates are 2.922, 2.750, 2.323 and 1.867 IN, sized at the controlling station for the same 2,551.3 Mscf/d. The plunger installation is on 2.750 IN tubing at 8,420 FT, lifting a 165 FT slug of 1.095 SPECIFIC GRAVITY liquid with a 9.4 LB plunger, against a 214 PSIA line pressure, a 745 PSIA casing pressure and an average tubing temperature of 142.8 degF, on a well gas-liquid ratio of 6,825 SCF/BBL. NEW HERE: the CYCLE is 812 FT/MIN of rise, 1,085 FT/MIN of fall in gas, 186 FT/MIN of fall in liquid, 26 MIN of afterflow and 48 MIN shut in. Report: (1) the TURNER critical VELOCITY at the controlling station; (2) the CRITICAL RATE of the candidate the sizing REJECTED; (3) the SLUG HYDROSTATIC term in the lift pressure; (4) the LONGEST SLUG this well can lift; (5) the GAS a cycle costs, as a volume; and (6) the LIQUID a day of cycling delivers. Traps. Field 1 is the correlation the package did NOT choose, and the choice was made on a wellhead reading four tenths of a psi under a 1000 psia threshold, at a station whose pressure is more than twice that threshold. Turner is the unadjusted equation multiplied by exactly 1.2, so the arithmetic is trivial and the judgement is not: the same rule that picked the correlation would pick the other one if it were read at the station where the answer is used. Field 2 is the candidate that missed, and it missed by under three percent, so it is the difference between a workover with margin and a workover without one; `largestUnloaded` never mentions it and only the rejected rows do. Field 3 needs no z at all, and neither does field 6, and doing field 3 by hand with the textbook water gradient FAILS: this platform carries a ROUNDED pressure gradient per unit of specific gravity, 0.433, where the exact rho g is 0.4335275, and the difference on this slug is over a thousand times the tolerance you are graded to. Use the platform''s constant. Field 4 is a length and it is the number that a clamp destroys on a weaker well: the same routine on a well whose casing cannot move the plunger at all returns zero rather than refusing, so a zero here would be a refusal wearing a number. Field 5 is a VOLUME in scf and is not the gas-liquid ratio; the ratio is what the Professional screen tests and this is what one cycle actually spends. And field 6 is the number no screen in this package ever looks at. Free checks: field 1 must be exactly 1.2 times the critical velocity the recommended correlation gives at the same station, since the adjustment is a constant factor and nothing else about the station changes. Field 2 must EXCEED the 2,551.3 Mscf/d the well makes, which is why it was rejected, and it must exceed the critical rate of the string that was chosen, since the rejected candidate is the LARGER bore. Field 3 must equal 165 ft times 1.095 times 0.433 psi/ft, exactly, and must come out about 0.12 percent BELOW the same product formed with an exact water gradient. Field 4 must EXCEED the 165 ft slug the installation actually lifts, since the installation is feasible on pressure, and the ratio of the two is the margin the pressure half of the screen has. Field 5 divided by the barrels one 165 ft slug of 2.750 in tubing holds must return the gas-liquid ratio the Professional tier computes, which is the identity that ties the two tiers together without either stating the other''s answer. And field 6 must be about a TWENTIETH of the 373.8 bbl/d this well makes, which is the finding the tier ends on: every pressure and gas test in the screen can pass on an installation that cannot carry the well.'
     where app_slug = 'gaswell' and tier = 'advanced' and active and md5(prompt) = '07f6076362de4a93714236cc10af4012';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 gaswell refused: gaswell/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'c760fa7f06ae8283db11bfe666059333' and fields = '[{"key": "shoe_critical_velocity_turner_fts", "tol": 0.0000058, "unit": "ft/s", "label": "Turner critical velocity at the shoe", "expected": 5.524059109300652}, {"key": "rejected_tubing_critical_rate_mscfd", "tol": 0.0028, "unit": "Mscf/d", "label": "Critical rate of the rejected candidate", "expected": 2629.8878454771925}, {"key": "plunger_slug_hydrostatic_psi", "tol": 0.000082, "unit": "psi", "label": "Slug hydrostatic term", "expected": 78.232275}, {"key": "plunger_max_slug_ft", "tol": 0.0011, "unit": "ft", "label": "Longest liftable slug", "expected": 1041.9317152418678}, {"key": "plunger_gas_per_cycle_scf", "tol": 0.012, "unit": "scf", "label": "Gas per cycle", "expected": 11281.211169142487}, {"key": "plunger_liquid_per_day_bbl", "tol": 0.00002, "unit": "bbl/d", "label": "Liquid delivered per day", "expected": 18.79621249139511}]'::jsonb) from public.academy_capstones where app_slug = 'gaswell' and tier = 'advanced' and active) is not true then
    raise exception 'w2 gaswell refused: gaswell/advanced does not read back as its W2 form';
  end if;

  raise notice 'w2 gaswell: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
