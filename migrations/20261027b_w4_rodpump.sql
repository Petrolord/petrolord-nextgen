-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): rodpump.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
-- INTERMEDIATE (5 graded field(s) now read in a typed panel mode:
-- design_mprl_lb, design_plunger_stroke_in, design_pprl_lb, design_prhp_hp,
-- design_produced_bpd)
--   POINTER appended: On the course panel, the Card explorer's "Your well,
--   typed" view takes this well as typed (the taper, grade, fluid, unit
--   geometry, pump, speed, damping, fillage and efficiency), marches it at the
--   engine's default parameters and prints every value to nine decimals.
-- ADVANCED (6 graded field(s) now read in a typed panel mode: balance_cbe_lb,
-- balance_moment_in_lb, balance_peak_torque_in_lb, diag_plunger_stroke_in,
-- diag_pump_load_max_lb, stress_worst_loading_pct)
--   POINTER appended: On the course panel, the Balance explorer's "Your well,
--   typed" view takes this well as typed, with the unbalance, crank offset, unit
--   designation, service factor and harmonics, and prints the balance, the
--   Goodman loading of every section and the diagnostic read-back to nine
--   decimals.
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and no attempts guard is needed.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W4
-- text (left alone). Anything else raises and the file rolls back. A file that
-- will write first checks the W1 post-state and refuses without it. Generated
-- by docs/graded-field-audit/w4b_capstones.py from w4b/rodpump.json. SAFE TO
-- RE-RUN: a second run writes nothing.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_s0       text;
  v_s1       text;
begin
  -- rodpump / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'rodpump' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w4b rodpump refused: rodpump/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '230cf27bb8b429095abf8b8c154d963c' and fields = '[{"key": "design_static_stretch_in", "tol": 0.0000037, "unit": "in", "label": "Static stretch", "expected": 18.3430100033456}, {"key": "design_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Plunger stroke", "expected": 113.87084766145045}, {"key": "design_pprl_lb", "tol": 0.0046, "unit": "lbf", "label": "Peak polished rod load", "expected": 22844.62490875651}, {"key": "design_mprl_lb", "tol": 0.00064, "unit": "lbf", "label": "Minimum polished rod load", "expected": 3184.8310729370005}, {"key": "design_prhp_hp", "tol": 0.0000046, "unit": "hp", "label": "Polished rod horsepower", "expected": 22.54616735384647}, {"key": "design_produced_bpd", "tol": 0.000051, "unit": "bbl/d", "label": "Production", "expected": 249.76898478544632}]'::jsonb then 'old'
              when md5(prompt) = '015442f1e4d65bd66739d89e2d9e989a' and fields = '[{"key": "design_static_stretch_in", "tol": 0.0000037, "unit": "in", "label": "Static stretch", "expected": 18.3430100033456}, {"key": "design_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Plunger stroke", "expected": 113.87084766145045}, {"key": "design_pprl_lb", "tol": 0.0046, "unit": "lbf", "label": "Peak polished rod load", "expected": 22844.62490875651}, {"key": "design_mprl_lb", "tol": 0.00064, "unit": "lbf", "label": "Minimum polished rod load", "expected": 3184.8310729370005}, {"key": "design_prhp_hp", "tol": 0.0000046, "unit": "hp", "label": "Polished rod horsepower", "expected": 22.54616735384647}, {"key": "design_produced_bpd", "tol": 0.000051, "unit": "bbl/d", "label": "Production", "expected": 249.76898478544632}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'rodpump' and tier = 'intermediate' and active;
  if v_s0 = 'other' then
    raise exception 'w4b rodpump refused: rodpump/intermediate matches neither its published form (prompt md5 230cf27bb8b429095abf8b8c154d963c) nor its W4 form (prompt md5 015442f1e4d65bd66739d89e2d9e989a), with the fields this file was generated against';
  end if;

  -- rodpump / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'rodpump' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w4b rodpump refused: rodpump/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'b04cf5b093ba7838e489e9cc5157587e' and fields = '[{"key": "balance_moment_in_lb", "tol": 0.13, "unit": "in-lb", "label": "Counterbalance moment", "expected": 724684.4494328515}, {"key": "balance_peak_torque_in_lb", "tol": 0.12, "unit": "in-lb", "label": "Peak gearbox torque", "expected": 572027.7632886502}, {"key": "balance_cbe_lb", "tol": 0.003, "unit": "lbf", "label": "Counterbalance effect", "expected": 14743.788548099372}, {"key": "stress_worst_loading_pct", "tol": 0.000021, "unit": "percent", "label": "Worst rod loading", "expected": 104.60464569678913}, {"key": "diag_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Diagnosed plunger stroke", "expected": 113.95219388403339}, {"key": "diag_pump_load_max_lb", "tol": 0.00098, "unit": "lbf", "label": "Diagnosed peak pump load", "expected": 4606.367684104658}]'::jsonb then 'old'
              when md5(prompt) = '058e830054eaca9b31d4a34da697e842' and fields = '[{"key": "balance_moment_in_lb", "tol": 0.13, "unit": "in-lb", "label": "Counterbalance moment", "expected": 724684.4494328515}, {"key": "balance_peak_torque_in_lb", "tol": 0.12, "unit": "in-lb", "label": "Peak gearbox torque", "expected": 572027.7632886502}, {"key": "balance_cbe_lb", "tol": 0.003, "unit": "lbf", "label": "Counterbalance effect", "expected": 14743.788548099372}, {"key": "stress_worst_loading_pct", "tol": 0.000021, "unit": "percent", "label": "Worst rod loading", "expected": 104.60464569678913}, {"key": "diag_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Diagnosed plunger stroke", "expected": 113.95219388403339}, {"key": "diag_pump_load_max_lb", "tol": 0.00098, "unit": "lbf", "label": "Diagnosed peak pump load", "expected": 4606.367684104658}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'rodpump' and tier = 'advanced' and active;
  if v_s1 = 'other' then
    raise exception 'w4b rodpump refused: rodpump/advanced matches neither its published form (prompt md5 b04cf5b093ba7838e489e9cc5157587e) nor its W4 form (prompt md5 058e830054eaca9b31d4a34da697e842), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W4 form
  if v_s0 = 'new' and v_s1 = 'new' then
    raise notice 'w4b rodpump: 0 of 2 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception 'w4b rodpump refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values that turn OBAGI-27 into a card. THE SAME WELL, restated in full so nothing has to be carried across from another tier. The string is a three-way taper hanging 6085 ft: 1825 ft of 1 in rod, then 2140 ft of 7/8 in, then 2120 ft of 3/4 in, all API GRADE D, in a fluid of SPECIFIC GRAVITY 0.94. The unit is conventional, with a 118.4 in FRONT arm from the saddle bearing to the polished rod, a 71.6 in REAR arm from the saddle bearing to the equalizer, a 92.5 in pitman, a crank pivot 104.3 in behind and 66.9 in below the saddle bearing and a 33.7 in crank radius, closed at 720 crank angles. The pump has a 1.5 IN PLUNGER between 210 PSIA intake and 2680 PSIA discharge, and the unit runs at 11.4 SPM. NEW HERE, and each of the three moves an answer: the string is damped at 0.085 OF CRITICAL, the barrel fills 0.853, and the pump is 0.86 EFFICIENT. Leave the marching parameters at the engine''s own defaults: do not raise the node count, the sample count, the cycle limit or the tolerance, because the numbers this tier is graded on are the numbers a studio user receives. Report: (1) the STATIC STRETCH the fluid load causes; (2) the PLUNGER STROKE; (3) the PEAK POLISHED ROD LOAD; (4) the MINIMUM POLISHED ROD LOAD; (5) the POLISHED ROD HORSEPOWER; and (6) what the well PRODUCES. Traps. Fields 1 and 2 are the whole point of this tier and they are in tension. The spring rule says the plunger loses exactly the rod stretch, surface stroke less field 1, and that rule is a STATIC one: it knows nothing about a rod string that is still moving when the polished rod turns round. The wave equation says the plunger travels FURTHER than the spring rule allows, by about a tenth of what the spring rule itself predicts on this well, and the whole of that difference is inertial OVERTRAVEL. Report field 2 from the MARCH. A learner who reports the spring rule''s answer there loses field 2 and keeps field 1, which is exactly the split this tier is cut to produce. Fields 3 and 4 are what the design REPORTS, not necessarily what the march computed, and this tier is graded on the report. Field 5 is built from the WORK PER CYCLE that the card encloses times the speed, so it carries the same provenance as fields 3 and 4 and no separate assumption. Field 6 is not the rated displacement: it is the pump constant times the plunger diameter squared times the PLUNGER stroke times the speed times the fillage times the efficiency, and every one of those five factors is stated above. The barrel fillage of 0.853 is worth a second look, because runRodPumpDesign warns on incomplete fillage BELOW 0.85 and this barrel is three thousandths above that line, so a pump fifteen percent short of full raises no warning at all; reading the warning list here and concluding the pump is full is the error the number refuses. Free checks: field 1 divided by the fluid load the plunger sees must return the string''s ELASTIC CONSTANT, which the taper alone fixes and which is the same number for this string under any load. Field 2 must be LESS than the surface stroke the linkage gives, and MORE than that surface stroke less field 1, and those two bounds are the spring rule and the wave answer bracketing each other. Field 3 must EXCEED the buoyed weight of the string, since the polished rod carries the rods plus the fluid at peak. Field 4 must be POSITIVE and must be well below that buoyed weight, and field 3 less field 4 is the load range the gearbox is eventually sized on. Field 6 divided by the fillage, then by the efficiency, then by field 2, then by 11.4, then by 1.5 squared must return the package''s own pump constant of 0.11657115597735782, and if it returns it after dividing by the SURFACE stroke instead you have reported the swept volume of a pump this well does not have. And field 6 must be smaller than the rated displacement of the same pump, necessarily, since fillage and efficiency are both below one and the plunger travels less than the polished rod. On the course panel, the Card explorer''s "Your well, typed" view takes this well as typed (the taper, grade, fluid, unit geometry, pump, speed, damping, fillage and efficiency), marches it at the engine''s default parameters and prints every value to nine decimals.'
     where app_slug = 'rodpump' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b rodpump refused: rodpump/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '015442f1e4d65bd66739d89e2d9e989a' and fields = '[{"key": "design_static_stretch_in", "tol": 0.0000037, "unit": "in", "label": "Static stretch", "expected": 18.3430100033456}, {"key": "design_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Plunger stroke", "expected": 113.87084766145045}, {"key": "design_pprl_lb", "tol": 0.0046, "unit": "lbf", "label": "Peak polished rod load", "expected": 22844.62490875651}, {"key": "design_mprl_lb", "tol": 0.00064, "unit": "lbf", "label": "Minimum polished rod load", "expected": 3184.8310729370005}, {"key": "design_prhp_hp", "tol": 0.0000046, "unit": "hp", "label": "Polished rod horsepower", "expected": 22.54616735384647}, {"key": "design_produced_bpd", "tol": 0.000051, "unit": "bbl/d", "label": "Production", "expected": 249.76898478544632}]'::jsonb) from public.academy_capstones where app_slug = 'rodpump' and tier = 'intermediate' and active) is not true then
    raise exception 'w4b rodpump refused: rodpump/intermediate does not read back as its W4 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for OBAGI-27 that the design report does not print. THE SAME WELL AGAIN, restated in full. The string is a three-way taper hanging 6085 ft: 1825 ft of 1 in rod, then 2140 ft of 7/8 in, then 2120 ft of 3/4 in, all API GRADE D, in a fluid of SPECIFIC GRAVITY 0.94. The unit is conventional, with a 118.4 in FRONT arm from the saddle bearing to the polished rod, a 71.6 in REAR arm from the saddle bearing to the equalizer, a 92.5 in pitman, a crank pivot 104.3 in behind and 66.9 in below the saddle bearing and a 33.7 in crank radius, closed at 720 crank angles. The pump has a 1.5 IN PLUNGER between 210 PSIA intake and 2680 PSIA discharge, the string is damped at 0.085 OF CRITICAL, the barrel fills 0.853, the pump is 0.86 EFFICIENT and the unit runs at 11.4 SPM, all at the engine''s default marching parameters. NEW HERE: the unit carries a STRUCTURAL UNBALANCE OF 810 LB and its cranks are OFFSET BY 14 DEGREES; it is a C-640D-305-144; the rods are checked on a SERVICE FACTOR OF 0.94; and the Gibbs diagnostic is run at 36 HARMONICS. Report: (1) the COUNTERBALANCE MOMENT the unit needs; (2) the PEAK GEARBOX TORQUE with that counterbalance on it; (3) the COUNTERBALANCE EFFECT at the polished rod; (4) the WORST rod loading as a PERCENTAGE of its modified Goodman allowable; (5) the plunger stroke the DIAGNOSTIC reads back; and (6) the peak PUMP LOAD the diagnostic reads back. Traps. The unbalance and the crank offset are the sharpest thing in this tier. Hand both to the DESIGN routine and its output is bit identical with them and without them, so an engineer who supplies them there and sees the numbers stand has learned nothing about whether they were read. Hand the same two to the BALANCING routine and they move the peak torque by four percent. An input being accepted is not an input being used, and the test is which function you asked. Fields 5 and 6 come from a Gibbs harmonic solver handed the SURFACE half of the card the march itself produced, and it shares no code path with that march, so the gap between what it returns and what the prediction was told to assume is the engine measured against itself rather than against a well. Report what the DIAGNOSTIC returns, not what the design assumed. Field 4 is a percentage of an ALLOWABLE and the allowable carries the 0.94 service factor, which is not a rod property at all: it is the operator''s judgement about the fluid and the corrosion, so the number that decides whether this design is legal is a judgement wearing a decimal point. And field 4 belongs to the WORST section, which you have to find rather than assume, on a string where a different section entirely goes into COMPRESSION at the bottom of the stroke. Free checks: field 3 less the 810 lb of structural unbalance, multiplied by the torque factor a quarter turn past the bottom of the stroke, must return field 1 exactly, because that is the crank angle at which the counterweight moment peaks and balancing the rod load there is the whole definition. Dividing field 1 by the 118.4 in front arm instead is the standard error and the module header names it: the torque factor at the quarter turn is not an arm length, and the arm understates the effect by roughly a factor of two, so field 3 must come out MORE THAN TWICE field 1 over 118.4. Field 2 must be BELOW the peak torque the same card gives with the structural unbalance set to zero, because 810 lb of unbalance is torque the crank does not have to carry, and it must be below the unit''s own 640,000 in-lb rating with room to spare. Field 3 must be LARGER than a counterbalance effect built by averaging the two polished rod loads, and the size of that excess is what a real crank geometry costs over a symmetry assumption. Field 4 must be ABOVE 100, which is why this design is refused, and it must be the LARGEST of the three sections'' loadings rather than the top section''s by default. Field 5 must EXCEED the plunger stroke the prediction returned, and field 6 must EXCEED the fluid load the design assumed, both for the same reason: a finite harmonic reconstruction of a card does not return the assumptions the card was built from, and both gaps run the same way. And the unit must be inside every rating it has, at roughly three quarters of its structural capacity, seven eighths of its gearbox and five sixths of its stroke, so the only thing wrong with this design is the rods. On the course panel, the Balance explorer''s "Your well, typed" view takes this well as typed, with the unbalance, crank offset, unit designation, service factor and harmonics, and prints the balance, the Goodman loading of every section and the diagnostic read-back to nine decimals.'
     where app_slug = 'rodpump' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b rodpump refused: rodpump/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '058e830054eaca9b31d4a34da697e842' and fields = '[{"key": "balance_moment_in_lb", "tol": 0.13, "unit": "in-lb", "label": "Counterbalance moment", "expected": 724684.4494328515}, {"key": "balance_peak_torque_in_lb", "tol": 0.12, "unit": "in-lb", "label": "Peak gearbox torque", "expected": 572027.7632886502}, {"key": "balance_cbe_lb", "tol": 0.003, "unit": "lbf", "label": "Counterbalance effect", "expected": 14743.788548099372}, {"key": "stress_worst_loading_pct", "tol": 0.000021, "unit": "percent", "label": "Worst rod loading", "expected": 104.60464569678913}, {"key": "diag_plunger_stroke_in", "tol": 0.000023, "unit": "in", "label": "Diagnosed plunger stroke", "expected": 113.95219388403339}, {"key": "diag_pump_load_max_lb", "tol": 0.00098, "unit": "lbf", "label": "Diagnosed peak pump load", "expected": 4606.367684104658}]'::jsonb) from public.academy_capstones where app_slug = 'rodpump' and tier = 'advanced' and active) is not true then
    raise exception 'w4b rodpump refused: rodpump/advanced does not read back as its W4 form';
  end if;

  raise notice 'w4b rodpump: % of 2 row(s) written, % already applied', v_written, 2 - v_written;
end $$;
