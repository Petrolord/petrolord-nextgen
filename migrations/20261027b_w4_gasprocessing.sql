-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): gasprocessing.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
-- ADVANCED (5 graded field(s) now read in a typed panel mode: dropF, dzdT,
-- muFPerPsi, t2F, waterOutLbMMscf)
--   POINTER appended: On the course panel, the Cold end explorer's "Your skid,
--   typed" view takes the five numbers above (inlet pressure and temperature,
--   separator pressure, gravity and molar heat capacity) and prints every value
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
-- by docs/graded-field-audit/w4b_capstones.py from w4b/gasprocessing.json. SAFE TO
-- RE-RUN: a second run writes nothing.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_s0       text;
begin
  -- gasprocessing / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'gasprocessing' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w4b gasprocessing refused: gasprocessing/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '4d8765fa51805132de4c470ece46ffd5' and fields = '[{"key": "dzdT", "tol": 5E-7, "unit": "per degR", "label": "Compressibility temperature derivative at the skid inlet", "expected": 0.0009683744638956019}, {"key": "muFPerPsi", "tol": 5E-7, "unit": "degF/psi", "label": "Joule-Thomson coefficient at that inlet", "expected": 0.06026080453221084}, {"key": "dropF", "tol": 0.0001, "unit": "degF", "label": "Cooling across the let-down, marched rather than taken in one step", "expected": 33.72690128392314}, {"key": "t2F", "tol": 0.0001, "unit": "degF", "label": "Temperature the gas reaches at the separator inlet", "expected": 53.27309871607686}, {"key": "waterInLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas carries at the skid inlet", "expected": 32.20884788270555}, {"key": "waterOutLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas can still hold at the cold spot", "expected": 23.519449233233914}]'::jsonb then 'old'
              when md5(prompt) = '925f01648217cedc1cb7a37f492b8a36' and fields = '[{"key": "dzdT", "tol": 5E-7, "unit": "per degR", "label": "Compressibility temperature derivative at the skid inlet", "expected": 0.0009683744638956019}, {"key": "muFPerPsi", "tol": 5E-7, "unit": "degF/psi", "label": "Joule-Thomson coefficient at that inlet", "expected": 0.06026080453221084}, {"key": "dropF", "tol": 0.0001, "unit": "degF", "label": "Cooling across the let-down, marched rather than taken in one step", "expected": 33.72690128392314}, {"key": "t2F", "tol": 0.0001, "unit": "degF", "label": "Temperature the gas reaches at the separator inlet", "expected": 53.27309871607686}, {"key": "waterInLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas carries at the skid inlet", "expected": 32.20884788270555}, {"key": "waterOutLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas can still hold at the cold spot", "expected": 23.519449233233914}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'gasprocessing' and tier = 'advanced' and active;
  if v_s0 = 'other' then
    raise exception 'w4b gasprocessing refused: gasprocessing/advanced matches neither its published form (prompt md5 4d8765fa51805132de4c470ece46ffd5) nor its W4 form (prompt md5 925f01648217cedc1cb7a37f492b8a36), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W4 form
  if v_s0 = 'new' then
    raise notice 'w4b gasprocessing: 0 of 1 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception 'w4b gasprocessing refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'ESCRAVOS, the dew point skid. Gas at 935 psia and 87 degF lets down across a choke to 405 psia into a low temperature separator. The gas gravity is 0.67 and its molar heat capacity is 10.2 Btu per lbmol degF. The let-down begins below the pressure at which this engine warns that its water chart correction is out of its stated band, so nothing reported here leans on a quantity held for the literature. Report six values: the compressibility temperature derivative at the inlet, the Joule-Thomson coefficient there, the cooling the let-down produces, the temperature the gas reaches, and the water it carries at the inlet and can still hold at the cold spot. The derivative per degR, the coefficient in degF a psi, temperatures in degF and water contents in lb a MMscf, all to six decimals. Read the figures in the Gas Processing Studio with its Full precision switch on (at the top of the page): it prints them to the precision this capstone grades, with no digit grouping. On the course panel, the Cold end explorer''s "Your skid, typed" view takes the five numbers above (inlet pressure and temperature, separator pressure, gravity and molar heat capacity) and prints every value to at least the precision graded here.'
     where app_slug = 'gasprocessing' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b gasprocessing refused: gasprocessing/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '925f01648217cedc1cb7a37f492b8a36' and fields = '[{"key": "dzdT", "tol": 5E-7, "unit": "per degR", "label": "Compressibility temperature derivative at the skid inlet", "expected": 0.0009683744638956019}, {"key": "muFPerPsi", "tol": 5E-7, "unit": "degF/psi", "label": "Joule-Thomson coefficient at that inlet", "expected": 0.06026080453221084}, {"key": "dropF", "tol": 0.0001, "unit": "degF", "label": "Cooling across the let-down, marched rather than taken in one step", "expected": 33.72690128392314}, {"key": "t2F", "tol": 0.0001, "unit": "degF", "label": "Temperature the gas reaches at the separator inlet", "expected": 53.27309871607686}, {"key": "waterInLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas carries at the skid inlet", "expected": 32.20884788270555}, {"key": "waterOutLbMMscf", "tol": 0.0001, "unit": "lb/MMscf", "label": "Water the gas can still hold at the cold spot", "expected": 23.519449233233914}]'::jsonb) from public.academy_capstones where app_slug = 'gasprocessing' and tier = 'advanced' and active) is not true then
    raise exception 'w4b gasprocessing refused: gasprocessing/advanced does not read back as its W4 form';
  end if;

  raise notice 'w4b gasprocessing: % of 1 row(s) written, % already applied', v_written, 1 - v_written;
end $$;
