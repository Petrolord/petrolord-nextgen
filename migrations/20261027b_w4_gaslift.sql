-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): gaslift.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
-- BEGINNER (6 graded field(s) now read in a typed panel mode:
-- gas_gradient_at_kickoff_psi_per_ft, gas_z_at_kickoff,
-- inj_column_at_packer_psia, inj_curve_at_5375ft_psia,
-- inj_surface_for_1585psia_psia, top_valve_depth_ft)
--   POINTER appended: On the course panel, the Column explorer's "Your well,
--   typed" view takes this gas, geotherm, packer, kickoff pressure, step count,
--   kill fluid, unloading wellhead, target and curve samples as typed and prints
--   z to eight decimals and every other value to at least the precision graded
--   here.
-- INTERMEDIATE (6 graded field(s) now read in a typed panel mode:
-- valve2_depth_ft, valve2_dome_at_temp_psia, valve2_test_rack_opening_psia,
-- valve4_depth_ft, valve4_spread_psi, valve4_throughput_mscfd)
--   POINTER appended: On the course panel, the Valve explorer's "Your
--   installation, typed" view takes this design as typed (the gas column of the
--   Associate tier, the pressures, gradients, spacing limits, bellows, port
--   catalogue, gas rate and bottom orifice) and prints every valve's depth,
--   dome, test rack opening, spread, port and throughput to at least the
--   precision graded here.
-- ADVANCED (6 graded field(s) now read in a typed panel mode:
-- injection_point_depth_coarse_ft, injection_point_depth_ft,
-- injection_point_pinj_psia, operating_inj_at_injection_pt_psia,
-- valve1_closing_surface_psia, valve3_closing_surface_psia)
--   POINTER appended: On the course panel, the Unloading explorer's "Your well
--   and traverse, typed" view takes the installation and this traverse as typed,
--   with its fine and coarse row counts and curve samples, and prints the
--   closing surface pressures, both crossings and the operating injection line
--   to at least the precision graded here.
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and no attempts guard is needed.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W4
-- text (left alone). Anything else raises and the file rolls back. A file that
-- will write first checks the W1 post-state and refuses without it. Generated
-- by docs/graded-field-audit/w4b_capstones.py from w4b/gaslift.json. SAFE TO
-- RE-RUN: a second run writes nothing.
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
  -- gaslift / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaslift' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w4b gaslift refused: gaslift/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '6a1476826eaab63874c12d7a4e5010a1' and fields = '[{"key": "gas_z_at_kickoff", "tol": 4.2E-7, "unit": "dimensionless", "label": "Gas z at kickoff", "expected": 0.8321323612578156}, {"key": "gas_gradient_at_kickoff_psi_per_ft", "tol": 1.7E-8, "unit": "psi/ft", "label": "Gas gradient at kickoff", "expected": 0.03459262518232471}, {"key": "inj_column_at_packer_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at packer", "expected": 1589.4628665427595}, {"key": "inj_surface_for_1585psia_psia", "tol": 0.00063, "unit": "psia", "label": "Surface pressure for 1585 psia at packer", "expected": 1264.8156205292921}, {"key": "top_valve_depth_ft", "tol": 0.0012, "unit": "ft TVD", "label": "Top valve depth", "expected": 2494.025220656208}, {"key": "inj_curve_at_5375ft_psia", "tol": 0.00073, "unit": "psia", "label": "Injection curve at 5375 ft", "expected": 1450.0362742923005}]'::jsonb then 'old'
              when md5(prompt) = '5506eb8bc3a7f83f2091e2b3577449c3' and fields = '[{"key": "gas_z_at_kickoff", "tol": 4.2E-7, "unit": "dimensionless", "label": "Gas z at kickoff", "expected": 0.8321323612578156}, {"key": "gas_gradient_at_kickoff_psi_per_ft", "tol": 1.7E-8, "unit": "psi/ft", "label": "Gas gradient at kickoff", "expected": 0.03459262518232471}, {"key": "inj_column_at_packer_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at packer", "expected": 1589.4628665427595}, {"key": "inj_surface_for_1585psia_psia", "tol": 0.00063, "unit": "psia", "label": "Surface pressure for 1585 psia at packer", "expected": 1264.8156205292921}, {"key": "top_valve_depth_ft", "tol": 0.0012, "unit": "ft TVD", "label": "Top valve depth", "expected": 2494.025220656208}, {"key": "inj_curve_at_5375ft_psia", "tol": 0.00073, "unit": "psia", "label": "Injection curve at 5375 ft", "expected": 1450.0362742923005}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'gaslift' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w4b gaslift refused: gaslift/beginner matches neither its published form (prompt md5 6a1476826eaab63874c12d7a4e5010a1) nor its W4 form (prompt md5 5506eb8bc3a7f83f2091e2b3577449c3), with the fields this file was generated against';
  end if;

  -- gaslift / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaslift' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w4b gaslift refused: gaslift/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '6571f08be5acc57d89bbd7e90d99e0c1' and fields = '[{"key": "valve2_depth_ft", "tol": 0.0022, "unit": "ft TVD", "label": "Valve 2 depth", "expected": 4379.112457100502}, {"key": "valve4_depth_ft", "tol": 0.0035, "unit": "ft TVD", "label": "Valve 4 depth", "expected": 6997.151937824368}, {"key": "valve2_dome_at_temp_psia", "tol": 0.00066, "unit": "psia", "label": "Valve 2 dome at valve temperature", "expected": 1313.645346439994}, {"key": "valve2_test_rack_opening_psia", "tol": 0.00057, "unit": "psia", "label": "Valve 2 test rack opening", "expected": 1143.8633940736581}, {"key": "valve4_spread_psi", "tol": 0.000023, "unit": "psi", "label": "Valve 4 spread", "expected": 45.22330508618348}, {"key": "valve4_throughput_mscfd", "tol": 0.0014, "unit": "Mscf/d", "label": "Valve 4 throughput", "expected": 2892.4892215328155}]'::jsonb then 'old'
              when md5(prompt) = 'a81373e5ac81a24e1015320a1dcb0a02' and fields = '[{"key": "valve2_depth_ft", "tol": 0.0022, "unit": "ft TVD", "label": "Valve 2 depth", "expected": 4379.112457100502}, {"key": "valve4_depth_ft", "tol": 0.0035, "unit": "ft TVD", "label": "Valve 4 depth", "expected": 6997.151937824368}, {"key": "valve2_dome_at_temp_psia", "tol": 0.00066, "unit": "psia", "label": "Valve 2 dome at valve temperature", "expected": 1313.645346439994}, {"key": "valve2_test_rack_opening_psia", "tol": 0.00057, "unit": "psia", "label": "Valve 2 test rack opening", "expected": 1143.8633940736581}, {"key": "valve4_spread_psi", "tol": 0.000023, "unit": "psi", "label": "Valve 4 spread", "expected": 45.22330508618348}, {"key": "valve4_throughput_mscfd", "tol": 0.0014, "unit": "Mscf/d", "label": "Valve 4 throughput", "expected": 2892.4892215328155}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'gaslift' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w4b gaslift refused: gaslift/intermediate matches neither its published form (prompt md5 6571f08be5acc57d89bbd7e90d99e0c1) nor its W4 form (prompt md5 a81373e5ac81a24e1015320a1dcb0a02), with the fields this file was generated against';
  end if;

  -- gaslift / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'gaslift' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w4b gaslift refused: gaslift/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '4c2d7b2ec617fa5dfe2d3c9f4e44017f' and fields = '[{"key": "valve1_closing_surface_psia", "tol": 0.00061, "unit": "psia", "label": "Valve 1 closing surface pressure", "expected": 1213.9289535870623}, {"key": "valve3_closing_surface_psia", "tol": 0.00056, "unit": "psia", "label": "Valve 3 closing surface pressure", "expected": 1121.4580042974942}, {"key": "injection_point_depth_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, fine tabulation", "expected": 9139.524034378974}, {"key": "injection_point_pinj_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at the crossing", "expected": 1573.281485043544}, {"key": "injection_point_depth_coarse_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, coarse tabulation", "expected": 9113.00140054971}, {"key": "operating_inj_at_injection_pt_psia", "tol": 0.00073, "unit": "psia", "label": "Operating injection line at the crossing", "expected": 1459.3240954891764}]'::jsonb then 'old'
              when md5(prompt) = '9c8d109fe200ad3a6bf436b0eed069a4' and fields = '[{"key": "valve1_closing_surface_psia", "tol": 0.00061, "unit": "psia", "label": "Valve 1 closing surface pressure", "expected": 1213.9289535870623}, {"key": "valve3_closing_surface_psia", "tol": 0.00056, "unit": "psia", "label": "Valve 3 closing surface pressure", "expected": 1121.4580042974942}, {"key": "injection_point_depth_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, fine tabulation", "expected": 9139.524034378974}, {"key": "injection_point_pinj_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at the crossing", "expected": 1573.281485043544}, {"key": "injection_point_depth_coarse_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, coarse tabulation", "expected": 9113.00140054971}, {"key": "operating_inj_at_injection_pt_psia", "tol": 0.00073, "unit": "psia", "label": "Operating injection line at the crossing", "expected": 1459.3240954891764}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'gaslift' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w4b gaslift refused: gaslift/advanced matches neither its published form (prompt md5 4c2d7b2ec617fa5dfe2d3c9f4e44017f) nor its W4 form (prompt md5 9c8d109fe200ad3a6bf436b0eed069a4), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W4 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w4b gaslift: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception 'w4b gaslift refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values from the OKPARA-9 injection gas column, the layer every depth and every dome charge in this design stands on. The injection gas has a specific gravity of 0.682. The well is 9,640 ft TVD to the packer, and its temperature runs LINEARLY from 103.5 degF at the wellhead to 236.5 degF at a REFERENCE DEPTH of 10,250 ft, which is deeper than the packer, so the packer is not at 236.5 degF. The casing is kicked off at 1,268.3 psia. March the gas column in 96 STEPS. The well is dead and full of a 0.468 psi/ft kill fluid standing against a 186.4 psia unloading wellhead pressure. Report: (1) the gas compressibility factor at the kickoff pressure and the wellhead temperature; (2) the static gas gradient there; (3) the injection pressure at the packer; (4) the SURFACE pressure that would put exactly 1,585 psia at the packer; (5) the depth of the TOP valve; and (6) the injection pressure at 5,375 ft read off the injection pressure curve cut at 64 SAMPLES. Traps. The temperature profile is anchored at 10,250 ft and not at the packer, so a column marched with 236.5 degF at 9,640 ft comes out too light and every pressure below is wrong with it. The step count is stated at 96 and it is part of the question rather than part of the answer: the engine defaults to 40 and hardcodes 20 inside its own spacing and valve routines, and on a column this deep a 20 step march does not reproduce field 3 to the tolerance this capstone grades at. Fields 3 and 4 are the SAME march run in two directions and neither is an algebraic rearrangement of the other, because the compressibility factor depends on the very pressure being solved for. Field 6 is read off a SAMPLED curve by straight line between its own samples on a 150.625 ft grid, not off a fresh march to 5,375 ft, and the two differ in the seventh figure. The 0.02 psi/ft rule of thumb is not this gas: field 2 comes out more than half again heavier than it. Free checks: field 3 must EXCEED the 1,268.3 psia kickoff, since a static gas column only gains pressure with depth, and field 6 must sit strictly between the two. Field 4 must fall BELOW 1,268.3 psia for exactly the same reason that field 3 comes out ABOVE 1,585 psia: those are one statement read two ways, and if one of them holds while the other does not, one of the two marches is wrong. Field 1 must be below one. Field 2 multiplied by 9,640 ft and added to the kickoff pressure must OVERSTATE field 3, because the local gradient FALLS with depth on this geotherm, the temperature effect beating the compression effect. And reading the injection line at field 5 must return 186.4 psia plus 0.468 psi/ft times field 5, to within a thousandth of a psi, because that equality is the definition of the top valve depth and nothing else is in it. On the course panel, the Column explorer''s "Your well, typed" view takes this gas, geotherm, packer, kickoff pressure, step count, kill fluid, unloading wellhead, target and curve samples as typed and prints z to eight decimals and every other value to at least the precision graded here.'
     where app_slug = 'gaslift' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b gaslift refused: gaslift/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '5506eb8bc3a7f83f2091e2b3577449c3' and fields = '[{"key": "gas_z_at_kickoff", "tol": 4.2E-7, "unit": "dimensionless", "label": "Gas z at kickoff", "expected": 0.8321323612578156}, {"key": "gas_gradient_at_kickoff_psi_per_ft", "tol": 1.7E-8, "unit": "psi/ft", "label": "Gas gradient at kickoff", "expected": 0.03459262518232471}, {"key": "inj_column_at_packer_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at packer", "expected": 1589.4628665427595}, {"key": "inj_surface_for_1585psia_psia", "tol": 0.00063, "unit": "psia", "label": "Surface pressure for 1585 psia at packer", "expected": 1264.8156205292921}, {"key": "top_valve_depth_ft", "tol": 0.0012, "unit": "ft TVD", "label": "Top valve depth", "expected": 2494.025220656208}, {"key": "inj_curve_at_5375ft_psia", "tol": 0.00073, "unit": "psia", "label": "Injection curve at 5375 ft", "expected": 1450.0362742923005}]'::jsonb) from public.academy_capstones where app_slug = 'gaslift' and tier = 'beginner' and active) is not true then
    raise exception 'w4b gaslift refused: gaslift/beginner does not read back as its W4 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values from the OKPARA-9 installation, spaced and set on the gas column the Associate tier established. The design is IPO on the SURFACE CLOSE method: a kickoff pressure of 1,268.3 psia, an operating pressure of 1,178.3 psia, a surface decrement of 48.9 psi per valve, a transfer differential of 58.5 psi, a 0.468 psi/ft kill fluid, a 0.094 psi/ft unloading gradient, a 186.4 psia unloading wellhead, a minimum spacing of 335 ft, at most 11 valves, a 0.99 in2 bellows, a port catalogue of 0.28125, 0.34375, 0.40625, 0.46875 and 0.5625 in, a design gas rate of 2,062 Mscf/d, and a bottom orifice of 0.34375 in. The target depth handed to the spacing recursion is deeper than anything this well reaches: the recursion stops on the 335 ft minimum at the seventh mandrel, so the target never binds and no answer on this tier depends on it. Report: (1) the depth of VALVE 2; (2) the depth of VALVE 4; (3) valve 2''s dome pressure AT VALVE TEMPERATURE; (4) valve 2''s TEST RACK opening pressure; (5) valve 4''s SPREAD; and (6) what valve 4''s port PASSES at the design conditions. Traps. Spacing is a recursion and not a formula, so field 2 carries three applications of the decrement and a single slip at valve 2 moves it; change the decrement and every depth below the change moves while every depth above it stays put. Fields 3 and 4 are the same valve read at TWO TEMPERATURES: the dome is charged cold in the shop at 60 degF and read hot at valve 2''s depth, and the test rack opening also divides the cold dome by one minus the port to bellows ratio. Reporting field 4 at valve temperature, or field 3 at 60 degF, swaps the two. Field 6 must be read off the port the engine PICKED and not off the smallest port in the catalogue: selectPort takes the smallest catalogue port that passes 2,062 Mscf/d at the unloading transfer differential, and the ladder steps between valve 2 and valve 3, so valves 1 and 2 carry the 0.28125 in port while valves 3 through 6 carry 0.34375 in. Reading valve 4 on the small port is the commonest error on this tier. The flow through valve 4 is SUBCRITICAL, so the choked form of the Thornhill and Craver expression does not apply there. And a spread is a PRESSURE FALL across the valve, which on an IPO valve is positive; a negative spread is not a valve property, it is the injection and production sides entered the wrong way round, which is what this package does on a production operated string. Free checks: the depths must INCREASE while the INCREMENTS DECREASE, because the injection line walks down 48.9 psi a valve while the kill fluid gradient does not change, so field 1 less the top valve depth must exceed HALF of field 2 less field 1, the latter spanning two increments and the former one. Field 2 must be deeper than field 1, and both must sit between the top valve depth and the 9,640 ft packer. Field 3 must EXCEED 1,219.4 psia, the second step of the decrement ladder down from 1,268.3, because the dome balances against the injection pressure at valve 2''s DEPTH and not at surface, and it must sit below that injection pressure at depth. Field 4 must come out below field 3 and below 1,219.4 psia. Field 5 must be positive. And field 6 must EXCEED the 2,062 Mscf/d design rate, because selectPort returns nothing that does not pass it. On the course panel, the Valve explorer''s "Your installation, typed" view takes this design as typed (the gas column of the Associate tier, the pressures, gradients, spacing limits, bellows, port catalogue, gas rate and bottom orifice) and prints every valve''s depth, dome, test rack opening, spread, port and throughput to at least the precision graded here.'
     where app_slug = 'gaslift' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b gaslift refused: gaslift/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'a81373e5ac81a24e1015320a1dcb0a02' and fields = '[{"key": "valve2_depth_ft", "tol": 0.0022, "unit": "ft TVD", "label": "Valve 2 depth", "expected": 4379.112457100502}, {"key": "valve4_depth_ft", "tol": 0.0035, "unit": "ft TVD", "label": "Valve 4 depth", "expected": 6997.151937824368}, {"key": "valve2_dome_at_temp_psia", "tol": 0.00066, "unit": "psia", "label": "Valve 2 dome at valve temperature", "expected": 1313.645346439994}, {"key": "valve2_test_rack_opening_psia", "tol": 0.00057, "unit": "psia", "label": "Valve 2 test rack opening", "expected": 1143.8633940736581}, {"key": "valve4_spread_psi", "tol": 0.000023, "unit": "psi", "label": "Valve 4 spread", "expected": 45.22330508618348}, {"key": "valve4_throughput_mscfd", "tol": 0.0014, "unit": "Mscf/d", "label": "Valve 4 throughput", "expected": 2892.4892215328155}]'::jsonb) from public.academy_capstones where app_slug = 'gaslift' and tier = 'intermediate' and active) is not true then
    raise exception 'w4b gaslift refused: gaslift/intermediate does not read back as its W4 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for OKPARA-9, on the installation the Professional tier set. The lifted well''s flowing traverse is 224.6 psia plus 0.062 psi/ft times the depth plus 0.167 psi/ft times the depth SQUARED over twice 9,640 ft, which is a column whose local gradient rises linearly from 0.062 psi/ft at surface to 0.229 psi/ft at the packer. The transfer differential is 58.5 psi and the injection pressure curve is cut at 64 samples. Report: (1) valve 1''s CLOSING SURFACE pressure; (2) valve 3''s closing surface pressure; (3) the DEEPEST POINT OF GAS INJECTION with the traverse tabulated at 401 EVENLY SPACED ROWS from surface to the packer, which puts the rows 24.1 ft apart; (4) the injection pressure at that crossing; (5) the SAME crossing on the SAME traverse tabulated at 7 ROWS, 1,606.667 ft apart, which is the spacing a designer reading a gradient curve actually hands it; and (6) the OPERATING injection line, driven from 1,178.3 psia rather than from the 1,268.3 psia kickoff, read at the depth of field 3. Traps. Fields 3 and 5 are the same well, the same function and the same traverse, and the ONLY thing that differs between them is how finely the traverse was tabulated, which is why the row count is stated in the question rather than left to the answer. The crossing is located on straight lines drawn between the rows the caller supplied, and BOTH SIDES of the residual come off the same pair of chords, so the residual the function reports at its own answer is a statement that the two chords agree with each other and nothing more: on the 7 row tabulation that residual is about a twentieth of a psi, comfortably inside the half psi the engine''s own gate allows, while the depth is tens of feet out. A small residual is not evidence here, and tightening an acceptance tolerance on it selects a worse answer rather than a better one. Field 3 was solved on the KICKOFF pressure. The well does not run on the kickoff pressure, and field 6 is what the line the well actually runs on reads at that same depth. Field 6 is read off the design''s OWN injection pressure curve, which designGasLift cuts on its internal default of 41 samples and which the caller cannot change, so it is not the 64 sample curve the Associate tier read. Fields 1 and 2 are CLOSING surface pressures, obtained by taking a dome pressure that balances at DEPTH back up the gas column to surface; they are not the valves'' opening surface pressures, which are just the steps of the decrement ladder. Free checks: field 1 must exceed field 2, since valve 1 is the shallower valve sitting on the higher step of the ladder, and field 1 must fall below the 1,268.3 psia that opened valve 1 in the first place. Field 2 must come out BELOW 1,121.6 psia, the fourth step of the ladder, by LESS THAN ONE PSI: that margin is the entire verdict of this string, because 1,121.6 psia is the casing pressure when the point of injection transfers to valve 4 and valve 3 is still open at it. Field 4 less the 58.5 psi transfer differential must return the flowing traverse evaluated at field 3, to within a thousandth of a psi, because that equality is what defines the crossing. Field 5 must be SHALLOWER than field 3, because a chord drawn across a traverse that steepens with depth lies above the true curve and cuts the crossing short, and the two must sit less than a hundred feet apart on a 9,640 ft well. And field 6 must come out below field 4, since the same column is driven from a surface pressure 90 psi lower, and it must ALSO come out below the flowing traverse at that depth, which is the finding: at the pressure this well actually runs on, gas cannot enter at the depth the design was targeted at. On the course panel, the Unloading explorer''s "Your well and traverse, typed" view takes the installation and this traverse as typed, with its fine and coarse row counts and curve samples, and prints the closing surface pressures, both crossings and the operating injection line to at least the precision graded here.'
     where app_slug = 'gaslift' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b gaslift refused: gaslift/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '9c8d109fe200ad3a6bf436b0eed069a4' and fields = '[{"key": "valve1_closing_surface_psia", "tol": 0.00061, "unit": "psia", "label": "Valve 1 closing surface pressure", "expected": 1213.9289535870623}, {"key": "valve3_closing_surface_psia", "tol": 0.00056, "unit": "psia", "label": "Valve 3 closing surface pressure", "expected": 1121.4580042974942}, {"key": "injection_point_depth_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, fine tabulation", "expected": 9139.524034378974}, {"key": "injection_point_pinj_psia", "tol": 0.00079, "unit": "psia", "label": "Injection pressure at the crossing", "expected": 1573.281485043544}, {"key": "injection_point_depth_coarse_ft", "tol": 0.0046, "unit": "ft TVD", "label": "Injection point depth, coarse tabulation", "expected": 9113.00140054971}, {"key": "operating_inj_at_injection_pt_psia", "tol": 0.00073, "unit": "psia", "label": "Operating injection line at the crossing", "expected": 1459.3240954891764}]'::jsonb) from public.academy_capstones where app_slug = 'gaslift' and tier = 'advanced' and active) is not true then
    raise exception 'w4b gaslift refused: gaslift/advanced does not read back as its W4 form';
  end if;

  raise notice 'w4b gaslift: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
