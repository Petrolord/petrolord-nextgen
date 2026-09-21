-- ==========================================================================
-- DIGEST-COPY RECUT: refinery, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/refinery, built from its committed .py sources.
-- Rows: 30 (beginner 4, intermediate 22, advanced 4).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-refinery.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner m01-what-a-feasibility-screen-computes ord 2
  select case
           when prompt = 'Some exports read the machine clock when an argument is left out. Which pairing of function and missing argument does the digest print?' and options = '["feasibilityEconomics reads the year when startYear is left out.", "cascadeToSchedule reads the year whenever startYear is left out of the call.", "feasibilityEconomics reads the date when periodStart is left out.", "scaleCapex reads the clock when no exponent is passed to it at all."]'::jsonb and answer_index = 0 and explanation is not distinct from 'cascadeToSchedule reads the clock when periodStart is missing, and feasibilityEconomics and calculateEconomics read the year when startYear is missing. The course passes both every time, with start year 2027 for every valuation.' then 'old'
           when prompt = 'Some exports read the machine clock when an argument is left out. Which pairing of function and missing argument does the course print?' and options = '["feasibilityEconomics reads the year when startYear is left out.", "cascadeToSchedule reads the year whenever startYear is left out of the call.", "feasibilityEconomics reads the date when periodStart is left out.", "scaleCapex reads the clock when no exponent is passed to it at all."]'::jsonb and answer_index = 0 and explanation is not distinct from 'cascadeToSchedule reads the clock when periodStart is missing, and feasibilityEconomics and calculateEconomics read the year when startYear is missing. The course passes both every time, with start year 2027 for every valuation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for beginner m01-what-a-feasibility-screen-computes ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Some exports read the machine clock when an argument is left out. Which pairing of function and missing argument does the course print?', options = '["feasibilityEconomics reads the year when startYear is left out.", "cascadeToSchedule reads the year whenever startYear is left out of the call.", "feasibilityEconomics reads the date when periodStart is left out.", "scaleCapex reads the clock when no exponent is passed to it at all."]'::jsonb, explanation = 'cascadeToSchedule reads the clock when periodStart is missing, and feasibilityEconomics and calculateEconomics read the year when startYear is missing. The course passes both every time, with start year 2027 for every valuation.'
     where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-a-feasibility-screen-computes ord 3
  select case
           when prompt = 'The digest counts each module''s exports. Which count belongs to modularRefinery?' and options = '["3 exported functions and 0 exported lists and constants.", "7 exported functions and 4 exported lists and constants, as measured.", "6 exported functions and 1 exported list or constant, as counted.", "6 exported functions and 4 exported lists and constants."]'::jsonb and answer_index = 3 and explanation is not distinct from 'modularRefinery counts 6 and 4. refineryPlanning counts 3 and 0, streamModel 7 and 4, and the screening engine 6 and 1.' then 'old'
           when prompt = 'The course counts each module''s exports. Which count belongs to modularRefinery?' and options = '["3 exported functions and 0 exported lists and constants.", "7 exported functions and 4 exported lists and constants, as measured.", "6 exported functions and 1 exported list or constant, as counted.", "6 exported functions and 4 exported lists and constants."]'::jsonb and answer_index = 3 and explanation is not distinct from 'modularRefinery counts 6 and 4. refineryPlanning counts 3 and 0, streamModel 7 and 4, and the screening engine 6 and 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for beginner m01-what-a-feasibility-screen-computes ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course counts each module''s exports. Which count belongs to modularRefinery?', options = '["3 exported functions and 0 exported lists and constants.", "7 exported functions and 4 exported lists and constants, as measured.", "6 exported functions and 1 exported list or constant, as counted.", "6 exported functions and 4 exported lists and constants."]'::jsonb, explanation = 'modularRefinery counts 6 and 4. refineryPlanning counts 3 and 0, streamModel 7 and 4, and the screening engine 6 and 1.'
     where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-a-feasibility-screen-computes ord 13
  select case
           when prompt = 'OKORDIA prices diesel at 101.0000 and gasoline at 104.0000 a barrel. What does the course say these prices are?' and options = '["Market quotations for a stated date the screen was calibrated on.", "The real prices of the crude grades whose names appear on the Studio panel.", "Illustrative figures on invented records, set in US dollars.", "Averages of published prices the Studio refreshes itself."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest''s case line says all three records are invented and every price and cost in it is illustrative, in US dollars. None is a market quotation for any date, and a crude grade name is a label on invented yields and prices.' then 'old'
           when prompt = 'OKORDIA prices diesel at 101.0000 and gasoline at 104.0000 a barrel. What does the course say these prices are?' and options = '["Market quotations for a stated date the screen was calibrated on.", "The real prices of the crude grades whose names appear on the Studio panel.", "Illustrative figures on invented records, set in US dollars.", "Averages of published prices the Studio refreshes itself."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s case line says all three records are invented and every price and cost in it is illustrative, in US dollars. None is a market quotation for any date, and a crude grade name is a label on invented yields and prices.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for beginner m01-what-a-feasibility-screen-computes ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'OKORDIA prices diesel at 101.0000 and gasoline at 104.0000 a barrel. What does the course say these prices are?', options = '["Market quotations for a stated date the screen was calibrated on.", "The real prices of the crude grades whose names appear on the Studio panel.", "Illustrative figures on invented records, set in US dollars.", "Averages of published prices the Studio refreshes itself."]'::jsonb, explanation = 'The course''s case line says all three records are invented and every price and cost in it is illustrative, in US dollars. None is a market quotation for any date, and a crude grade name is a label on invented yields and prices.'
     where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-feasibility-screen-computes' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: beginner m01-what-a-feasibility-screen-computes ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-capital-and-the-scaling-law ord 8
  select case
           when prompt = 'Down the scaleComparison table, what does the screen check about capital per bpd and total capital as capacity rises?' and options = '["Per bpd falls under stick-built only; modular per bpd holds at 12800.00.", "Per bpd rises at every step and total rises at every step, under both laws.", "Per bpd falls at every step and total rises at every step, true under both laws.", "Total rises under the modular law only, and per bpd goes unchecked."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints: capital per bpd falls at every step as capacity rises, modular true, stick-built true; total capital rises at every step, modular true, stick-built true. The plant costs more and each bpd of it costs less.' then 'old'
           when prompt = 'Down the scaleComparison table, what does the screen check about capital per bpd and total capital as capacity rises?' and options = '["Per bpd falls under stick-built only; modular per bpd holds at 12800.00.", "Per bpd rises at every step and total rises at every step, under both laws.", "Per bpd falls at every step and total rises at every step, true under both laws.", "Total rises under the modular law only, and per bpd goes unchecked."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints: capital per bpd falls at every step as capacity rises, modular true, stick-built true; total capital rises at every step, modular true, stick-built true. The plant costs more and each bpd of it costs less.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-capital-and-the-scaling-law' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for beginner m02-capital-and-the-scaling-law ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: beginner m02-capital-and-the-scaling-law ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Down the scaleComparison table, what does the screen check about capital per bpd and total capital as capacity rises?', options = '["Per bpd falls under stick-built only; modular per bpd holds at 12800.00.", "Per bpd rises at every step and total rises at every step, under both laws.", "Per bpd falls at every step and total rises at every step, true under both laws.", "Total rises under the modular law only, and per bpd goes unchecked."]'::jsonb, explanation = 'The course prints: capital per bpd falls at every step as capacity rises, modular true, stick-built true; total capital rises at every step, modular true, stick-built true. The plant costs more and each bpd of it costs less.'
     where app_slug = 'refinery' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-capital-and-the-scaling-law' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: beginner m02-capital-and-the-scaling-law ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 9
  select case
           when prompt = 'What margin difference does the digest print between the configuration as typed and the one where distillation is no longer feedless?' and options = '["95572.87", "-230175.48", "9614225.81", "2536290.33"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The fed configuration prints a margin of 9614225.81 against 7077935.48, and the digest prints the difference as 2536290.33. The crude unit runs 0.00 bbl and charges 0.00 for distillation.' then 'old'
           when prompt = 'What margin difference does the course print between the configuration as typed and the one where distillation is no longer feedless?' and options = '["95572.87", "-230175.48", "9614225.81", "2536290.33"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The fed configuration prints a margin of 9614225.81 against 7077935.48, and the course prints the difference as 2536290.33. The crude unit runs 0.00 bbl and charges 0.00 for distillation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What margin difference does the course print between the configuration as typed and the one where distillation is no longer feedless?', options = '["95572.87", "-230175.48", "9614225.81", "2536290.33"]'::jsonb, explanation = 'The fed configuration prints a margin of 9614225.81 against 7077935.48, and the course prints the difference as 2536290.33. The crude unit runs 0.00 bbl and charges 0.00 for distillation.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 10
  select case
           when prompt = 'When distillation is given a feed, which utilisation is printed for it?' and options = '["null", "0.00 percent", "78.04 percent", "100.00 percent"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints the crude unit utilisation in that configuration as 0.00 percent, with the unit running 0.00 bbl. A null utilisation belongs to a unit whose capacity is blank or typed as 0.' then 'old'
           when prompt = 'When distillation is given a feed, which utilisation is printed for it?' and options = '["null", "0.00 percent", "78.04 percent", "100.00 percent"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the crude unit utilisation in that configuration as 0.00 percent, with the unit running 0.00 bbl. A null utilisation belongs to a unit whose capacity is blank or typed as 0.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'When distillation is given a feed, which utilisation is printed for it?', options = '["null", "0.00 percent", "78.04 percent", "100.00 percent"]'::jsonb, explanation = 'The course prints the crude unit utilisation in that configuration as 0.00 percent, with the unit running 0.00 bbl. A null utilisation belongs to a unit whose capacity is blank or typed as 0.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 18
  select case
           when prompt = 'Which status does each of the five changes in the digest''s change table return?' and options = '["infeasible", "invalid", "optimal", "unbounded"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The hydrotreater shut, the hydrotreater left blank, the crude unit at 1900000 barrels, the Forcados cargo cancelled and the jet and fuel oil floors each return optimal, with a margin and a gross margin per barrel.' then 'old'
           when prompt = 'Which status does each of the five changes in the course''s change table return?' and options = '["infeasible", "invalid", "optimal", "unbounded"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The hydrotreater shut, the hydrotreater left blank, the crude unit at 1900000 barrels, the Forcados cargo cancelled and the jet and fuel oil floors each return optimal, with a margin and a gross margin per barrel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which status does each of the five changes in the course''s change table return?', options = '["infeasible", "invalid", "optimal", "unbounded"]'::jsonb, explanation = 'The hydrotreater shut, the hydrotreater left blank, the crude unit at 1900000 barrels, the Forcados cargo cancelled and the jet and fuel oil floors each return optimal, with a margin and a gross margin per barrel.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 20
  select case
           when prompt = 'Once the two floors are added, how many barrels of Fuel oil does the month sell?' and options = '["633129.03 bbl, as in the plan as typed.", "1000000.00 bbl, its ceiling.", "324178.57 bbl, the Jet A-1 figure.", "700000.00 bbl, the floor met exactly."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints Fuel oil 700000.00 under the floors, and the fuel oil floor is met exactly: true. 633129.03 bbl is Fuel oil''s volume as typed and 1000000.00 bbl its ceiling.' then 'old'
           when prompt = 'Once the two floors are added, how many barrels of Fuel oil does the month sell?' and options = '["633129.03 bbl, as in the plan as typed.", "1000000.00 bbl, its ceiling.", "324178.57 bbl, the Jet A-1 figure.", "700000.00 bbl, the floor met exactly."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints Fuel oil 700000.00 under the floors, and the fuel oil floor is met exactly: true. 633129.03 bbl is Fuel oil''s volume as typed and 1000000.00 bbl its ceiling.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Once the two floors are added, how many barrels of Fuel oil does the month sell?', options = '["633129.03 bbl, as in the plan as typed.", "1000000.00 bbl, its ceiling.", "324178.57 bbl, the Jet A-1 figure.", "700000.00 bbl, the floor met exactly."]'::jsonb, explanation = 'The course prints Fuel oil 700000.00 under the floors, and the fuel oil floor is met exactly: true. 633129.03 bbl is Fuel oil''s volume as typed and 1000000.00 bbl its ceiling.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 23
  select case
           when prompt = 'In the digest''s gasoil working, which yield divides the break-even?' and options = '["Bonny Light''s gasoil yield, 0.3100.", "Bonny Light''s residue yield, 0.2800.", "The hydrotreater''s ulsd yield, 0.9700.", "Forcados'' gasoil yield, 0.3400."]'::jsonb and answer_index = 0 and explanation is not distinct from '(82.5500 - 0.2300 x 91.4500 - 0.1500 x 105.5000 - 0.2800 x 59.0000 - 0.0300 x 0.0000) / 0.3100 = 94.1016. Under the floors the residue yield, 0.2800, is the divisor in residue''s working.' then 'old'
           when prompt = 'In the course''s gasoil working, which yield divides the break-even?' and options = '["Bonny Light''s gasoil yield, 0.3100.", "Bonny Light''s residue yield, 0.2800.", "The hydrotreater''s ulsd yield, 0.9700.", "Forcados'' gasoil yield, 0.3400."]'::jsonb and answer_index = 0 and explanation is not distinct from '(82.5500 - 0.2300 x 91.4500 - 0.1500 x 105.5000 - 0.2800 x 59.0000 - 0.0300 x 0.0000) / 0.3100 = 94.1016. Under the floors the residue yield, 0.2800, is the divisor in residue''s working.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 23'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s gasoil working, which yield divides the break-even?', options = '["Bonny Light''s gasoil yield, 0.3100.", "Bonny Light''s residue yield, 0.2800.", "The hydrotreater''s ulsd yield, 0.9700.", "Forcados'' gasoil yield, 0.3400."]'::jsonb, explanation = '(82.5500 - 0.2300 x 91.4500 - 0.1500 x 105.5000 - 0.2800 x 59.0000 - 0.0300 x 0.0000) / 0.3100 = 94.1016. Under the floors the residue yield, 0.2800, is the divisor in residue''s working.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 25
  select case
           when prompt = 'What margin does the digest print with the reformer''s capacity at 400000.00 bbl?' and options = '["6863271.83", "7018390.09", "7077935.48", "6847760.00"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The sweep prints 6863271.83 at 380000.00 bbl, 7018390.09 at 400000.00 and 7077935.48 at 420000.00 and above. 6847760.00 is the crude unit at 1900000 barrels.' then 'old'
           when prompt = 'What margin does the course print with the reformer''s capacity at 400000.00 bbl?' and options = '["6863271.83", "7018390.09", "7077935.48", "6847760.00"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The sweep prints 6863271.83 at 380000.00 bbl, 7018390.09 at 400000.00 and 7077935.48 at 420000.00 and above. 6847760.00 is the crude unit at 1900000 barrels.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 25'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What margin does the course print with the reformer''s capacity at 400000.00 bbl?', options = '["6863271.83", "7018390.09", "7077935.48", "6847760.00"]'::jsonb, explanation = 'The sweep prints 6863271.83 at 380000.00 bbl, 7018390.09 at 400000.00 and 7077935.48 at 420000.00 and above. 6847760.00 is the crude unit at 1900000 barrels.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 31
  select case
           when prompt = 'At a cargo size of 150000 bbl, what is the last Forcados receipt date the digest prints?' and options = '["2027-03-22, after seven earlier Forcados dates.", "2027-03-21, as at the 400000.00 bbl cargo size.", "2027-03-19, the last of eight Forcados dates.", "2027-03-31, the last day of the 31 day period."]'::jsonb and answer_index = 0 and explanation is not distinct from 'At 150000 bbl the Forcados dates run 2027-03-01, 2027-03-04, 2027-03-07, 2027-03-10, 2027-03-13, 2027-03-16, 2027-03-19 and 2027-03-22. 2027-03-21 is the last Forcados receipt at 400000.00 bbl.' then 'old'
           when prompt = 'At a cargo size of 150000 bbl, what is the last Forcados receipt date the course prints?' and options = '["2027-03-22, after seven earlier Forcados dates.", "2027-03-21, as at the 400000.00 bbl cargo size.", "2027-03-19, the last of eight Forcados dates.", "2027-03-31, the last day of the 31 day period."]'::jsonb and answer_index = 0 and explanation is not distinct from 'At 150000 bbl the Forcados dates run 2027-03-01, 2027-03-04, 2027-03-07, 2027-03-10, 2027-03-13, 2027-03-16, 2027-03-19 and 2027-03-22. 2027-03-21 is the last Forcados receipt at 400000.00 bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At a cargo size of 150000 bbl, what is the last Forcados receipt date the course prints?', options = '["2027-03-22, after seven earlier Forcados dates.", "2027-03-21, as at the 400000.00 bbl cargo size.", "2027-03-19, the last of eight Forcados dates.", "2027-03-31, the last day of the 31 day period."]'::jsonb, explanation = 'At 150000 bbl the Forcados dates run 2027-03-01, 2027-03-04, 2027-03-07, 2027-03-10, 2027-03-13, 2027-03-16, 2027-03-19 and 2027-03-22. 2027-03-21 is the last Forcados receipt at 400000.00 bbl.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-crude-unit-carries-every-barrel ord 7
  select case
           when prompt = 'The fed-crude-unit configuration prints a margin of 9614225.81. Which printed margin belongs to the same configuration as typed, with its crude unit feedless?' and options = '["9614225.81 again, the fed unit with its capacity typed as 0.", "7173508.35, the hydrotreater left blank.", "6847760.00, the crude unit capped.", "7077935.48, the margin as typed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the fed configuration''s margin, 9614225.81, against 7077935.48 for the configuration as typed. 9614225.81 is also the fed configuration with that unit''s capacity typed as 0, and 7173508.35 and 6847760.00 are the hydrotreater left blank and the crude unit at 1900000 barrels.' then 'old'
           when prompt = 'The fed-crude-unit configuration prints a margin of 9614225.81. Which printed margin belongs to the same configuration as typed, with its crude unit feedless?' and options = '["9614225.81 again, the fed unit with its capacity typed as 0.", "7173508.35, the hydrotreater left blank.", "6847760.00, the crude unit capped.", "7077935.48, the margin as typed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the fed configuration''s margin, 9614225.81, against 7077935.48 for the configuration as typed. 9614225.81 is also the fed configuration with that unit''s capacity typed as 0, and 7173508.35 and 6847760.00 are the hydrotreater left blank and the crude unit at 1900000 barrels.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-crude-unit-carries-every-barrel' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m02-the-crude-unit-carries-every-barrel ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m02-the-crude-unit-carries-every-barrel ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The fed-crude-unit configuration prints a margin of 9614225.81. Which printed margin belongs to the same configuration as typed, with its crude unit feedless?', options = '["9614225.81 again, the fed unit with its capacity typed as 0.", "7173508.35, the hydrotreater left blank.", "6847760.00, the crude unit capped.", "7077935.48, the margin as typed."]'::jsonb, explanation = 'The course prints the fed configuration''s margin, 9614225.81, against 7077935.48 for the configuration as typed. 9614225.81 is also the fed configuration with that unit''s capacity typed as 0, and 7173508.35 and 6847760.00 are the hydrotreater left blank and the crude unit at 1900000 barrels.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-crude-unit-carries-every-barrel' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m02-the-crude-unit-carries-every-barrel ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-reading-the-plan ord 1
  select case
           when prompt = 'Which three terms make up ABUA''s margin of 7077935.48?' and options = '["Revenue 172316812.90, less crude cost 160350322.58 and nothing else.", "Revenue 172316812.90, less crude cost 160350322.58, less unit operating cost 4888554.84.", "Revenue 172316812.90, less crude cost, unit operating cost, staff and insurance.", "Revenue less unit operating cost 4888554.84, with crude cost charged in the schedule and the fixed costs of the month."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s definition is margin = product revenue - crude cost - unit operating cost. Fixed costs, capital, tax and financing are not terms in it.' then 'old'
           when prompt = 'Which three terms make up ABUA''s margin of 7077935.48?' and options = '["Revenue 172316812.90, less crude cost 160350322.58 and nothing else.", "Revenue 172316812.90, less crude cost 160350322.58, less unit operating cost 4888554.84.", "Revenue 172316812.90, less crude cost, unit operating cost, staff and insurance.", "Revenue less unit operating cost 4888554.84, with crude cost charged in the schedule and the fixed costs of the month."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s definition is margin = product revenue - crude cost - unit operating cost. Fixed costs, capital, tax and financing are not terms in it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-reading-the-plan' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m03-reading-the-plan ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m03-reading-the-plan ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which three terms make up ABUA''s margin of 7077935.48?', options = '["Revenue 172316812.90, less crude cost 160350322.58 and nothing else.", "Revenue 172316812.90, less crude cost 160350322.58, less unit operating cost 4888554.84.", "Revenue 172316812.90, less crude cost, unit operating cost, staff and insurance.", "Revenue less unit operating cost 4888554.84, with crude cost charged in the schedule and the fixed costs of the month."]'::jsonb, explanation = 'The course''s definition is margin = product revenue - crude cost - unit operating cost. Fixed costs, capital, tax and financing are not terms in it.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-reading-the-plan' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m03-reading-the-plan ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-another-barrel-is-worth ord 4
  select case
           when prompt = 'The plan values naphtha at 91.4500. Which working does the digest print for that figure?' and options = '["Naphtha export''s price of 72.5000, with the reformer''s 2.9000 a barrel added on top.", "What the reformer makes from a barrel at the stream values, less its 2.9000 operating cost.", "Gasoline''s price of 111.0000, less the crude unit''s 1.2500 a barrel of distillation.", "A barrel of Bonny Light (illustrative) at 82.5500, shared over its naphtha yield of 0.2300."]'::jsonb and answer_index = 1 and explanation is not distinct from '0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000 = 91.4500. The reformer runs at 97.07 percent, below its capacity, so one more barrel of naphtha goes through it.' then 'old'
           when prompt = 'The plan values naphtha at 91.4500. Which working does the course print for that figure?' and options = '["Naphtha export''s price of 72.5000, with the reformer''s 2.9000 a barrel added on top.", "What the reformer makes from a barrel at the stream values, less its 2.9000 operating cost.", "Gasoline''s price of 111.0000, less the crude unit''s 1.2500 a barrel of distillation.", "A barrel of Bonny Light (illustrative) at 82.5500, shared over its naphtha yield of 0.2300."]'::jsonb and answer_index = 1 and explanation is not distinct from '0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000 = 91.4500. The reformer runs at 97.07 percent, below its capacity, so one more barrel of naphtha goes through it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m04-what-another-barrel-is-worth ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The plan values naphtha at 91.4500. Which working does the course print for that figure?', options = '["Naphtha export''s price of 72.5000, with the reformer''s 2.9000 a barrel added on top.", "What the reformer makes from a barrel at the stream values, less its 2.9000 operating cost.", "Gasoline''s price of 111.0000, less the crude unit''s 1.2500 a barrel of distillation.", "A barrel of Bonny Light (illustrative) at 82.5500, shared over its naphtha yield of 0.2300."]'::jsonb, explanation = '0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000 = 91.4500. The reformer runs at 97.07 percent, below its capacity, so one more barrel of naphtha goes through it.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-another-barrel-is-worth ord 5
  select case
           when prompt = 'The Diesel hydrotreater is at capacity. Through which crude does the digest''s working value gasoil at 94.1016?' and options = '["Forcados (illustrative), the crude the plan runs at its full availability.", "Brass River (illustrative), also run at its full availability in the plan.", "Bonny Light (illustrative), which the plan runs only in part.", "None: once the hydrotreater is full, the next barrel of gasoil is valued at Gasoil export''s 89.5000."]'::jsonb and answer_index = 2 and explanation is not distinct from 'One more barrel of gasoil lets the plan run less of the crude it only partly runs. At break-even a barrel of Bonny Light (illustrative), 82.5500 with the crude unit''s 1.2500, equals what its streams are worth, and that gives 94.1016.' then 'old'
           when prompt = 'The Diesel hydrotreater is at capacity. Through which crude does the course''s working value gasoil at 94.1016?' and options = '["Forcados (illustrative), the crude the plan runs at its full availability.", "Brass River (illustrative), also run at its full availability in the plan.", "Bonny Light (illustrative), which the plan runs only in part.", "None: once the hydrotreater is full, the next barrel of gasoil is valued at Gasoil export''s 89.5000."]'::jsonb and answer_index = 2 and explanation is not distinct from 'One more barrel of gasoil lets the plan run less of the crude it only partly runs. At break-even a barrel of Bonny Light (illustrative), 82.5500 with the crude unit''s 1.2500, equals what its streams are worth, and that gives 94.1016.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m04-what-another-barrel-is-worth ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Diesel hydrotreater is at capacity. Through which crude does the course''s working value gasoil at 94.1016?', options = '["Forcados (illustrative), the crude the plan runs at its full availability.", "Brass River (illustrative), also run at its full availability in the plan.", "Bonny Light (illustrative), which the plan runs only in part.", "None: once the hydrotreater is full, the next barrel of gasoil is valued at Gasoil export''s 89.5000."]'::jsonb, explanation = 'One more barrel of gasoil lets the plan run less of the crude it only partly runs. At break-even a barrel of Bonny Light (illustrative), 82.5500 with the crude unit''s 1.2500, equals what its streams are worth, and that gives 94.1016.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-another-barrel-is-worth ord 6
  select case
           when prompt = 'Why is the step from 400000.00 to 420000.00 bbl of reformer capacity priced at only 2.9773 a barrel?' and options = '["The reformer''s operating cost of 2.9000 a barrel is taken off each barrel of room.", "The step is the first one the digest prints, so it carries no change in margin.", "Gasoline reaches its ceiling inside that step and holds the reformer back.", "The reformer fills partway through the step and reads 97.07 percent at 420000.00 bbl."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The gain is the change in margin, 59545.39, over the change in capacity, 20000.00 bbl. Part of that room is used and part is not, so the figure averages the two stretches.' then 'old'
           when prompt = 'Why is the step from 400000.00 to 420000.00 bbl of reformer capacity priced at only 2.9773 a barrel?' and options = '["The reformer''s operating cost of 2.9000 a barrel is taken off each barrel of room.", "The step is the first one the course prints, so it carries no change in margin.", "Gasoline reaches its ceiling inside that step and holds the reformer back.", "The reformer fills partway through the step and reads 97.07 percent at 420000.00 bbl."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The gain is the change in margin, 59545.39, over the change in capacity, 20000.00 bbl. Part of that room is used and part is not, so the figure averages the two stretches.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m04-what-another-barrel-is-worth ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why is the step from 400000.00 to 420000.00 bbl of reformer capacity priced at only 2.9773 a barrel?', options = '["The reformer''s operating cost of 2.9000 a barrel is taken off each barrel of room.", "The step is the first one the course prints, so it carries no change in margin.", "Gasoline reaches its ceiling inside that step and holds the reformer back.", "The reformer fills partway through the step and reads 97.07 percent at 420000.00 bbl."]'::jsonb, explanation = 'The gain is the change in margin, 59545.39, over the change in capacity, 20000.00 bbl. Part of that room is used and part is not, so the figure averages the two stretches.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-another-barrel-is-worth ord 13
  select case
           when prompt = 'Across all six rows of the digest''s stream values under each change, which streams print one value in every row?' and options = '["Reformate, kero, ulsd and residue.", "Naphtha, reformate, kero and ulsd.", "Reformate, kero, ulsd and offgas.", "Kero, ulsd, residue and offgas."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Reformate prints 111.0000, kero 105.5000, ulsd 104.8000 and offgas 0.0000 in every row. Residue reads 79.6607 under the floors, and naphtha and gasoil move in several rows.' then 'old'
           when prompt = 'Across all six rows of the course''s stream values under each change, which streams print one value in every row?' and options = '["Reformate, kero, ulsd and residue.", "Naphtha, reformate, kero and ulsd.", "Reformate, kero, ulsd and offgas.", "Kero, ulsd, residue and offgas."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Reformate prints 111.0000, kero 105.5000, ulsd 104.8000 and offgas 0.0000 in every row. Residue reads 79.6607 under the floors, and naphtha and gasoil move in several rows.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m04-what-another-barrel-is-worth ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Across all six rows of the course''s stream values under each change, which streams print one value in every row?', options = '["Reformate, kero, ulsd and residue.", "Naphtha, reformate, kero and ulsd.", "Reformate, kero, ulsd and offgas.", "Kero, ulsd, residue and offgas."]'::jsonb, explanation = 'Reformate prints 111.0000, kero 105.5000, ulsd 104.8000 and offgas 0.0000 in every row. Residue reads 79.6607 under the floors, and naphtha and gasoil move in several rows.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-another-barrel-is-worth' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m04-what-another-barrel-is-worth ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-schedule ord 1
  select case
           when prompt = 'How does ABUA''s schedule decide how many cargoes a crude arrives in?' and options = '["The crude run divided by the cargo size, rounded down, with any part cargo dropped.", "The crude run divided by the cargo size, rounded up to a whole cargo, at least one.", "One cargo for each week in the period, so five cargoes whatever the crude run.", "The crude''s availability divided by the cargo size, rounded up to a whole cargo."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints the rule: cargoes = the crude run divided by the cargo size, rounded UP to a whole cargo (at least one). The days between cargoes are the 31 days divided by the cargoes, rounded DOWN.' then 'old'
           when prompt = 'How does ABUA''s schedule decide how many cargoes a crude arrives in?' and options = '["The crude run divided by the cargo size, rounded down, with any part cargo dropped.", "The crude run divided by the cargo size, rounded up to a whole cargo, at least one.", "One cargo for each week in the period, so five cargoes whatever the crude run.", "The crude''s availability divided by the cargo size, rounded up to a whole cargo."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the rule: cargoes = the crude run divided by the cargo size, rounded UP to a whole cargo (at least one). The days between cargoes are the 31 days divided by the cargoes, rounded DOWN.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m05-the-schedule ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does ABUA''s schedule decide how many cargoes a crude arrives in?', options = '["The crude run divided by the cargo size, rounded down, with any part cargo dropped.", "The crude run divided by the cargo size, rounded up to a whole cargo, at least one.", "One cargo for each week in the period, so five cargoes whatever the crude run.", "The crude''s availability divided by the cargo size, rounded up to a whole cargo."]'::jsonb, explanation = 'The course prints the rule: cargoes = the crude run divided by the cargo size, rounded UP to a whole cargo (at least one). The days between cargoes are the 31 days divided by the cargoes, rounded DOWN.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-schedule ord 5
  select case
           when prompt = 'The same plan is cascaded again at a cargo size of 150000 bbl. What does the digest show changing?' and options = '["The crude receipts stay at 6, and each carries a smaller share of its crude.", "The crude receipts become 15, and the plan''s volumes and margin stay as they were.", "The plan runs less Forcados, since each smaller cargo holds less of the crude.", "The crude receipts become 15, and the margin is solved again for the extra cargoes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The cargo size changes the schedule and leaves the plan alone. At 150000 bbl Forcados arrives on eight dates from 2027-03-01 to 2027-03-22, and the plan''s crude volumes, costs and margin do not change.' then 'old'
           when prompt = 'The same plan is cascaded again at a cargo size of 150000 bbl. What does the course show changing?' and options = '["The crude receipts stay at 6, and each carries a smaller share of its crude.", "The crude receipts become 15, and the plan''s volumes and margin stay as they were.", "The plan runs less Forcados, since each smaller cargo holds less of the crude.", "The crude receipts become 15, and the margin is solved again for the extra cargoes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The cargo size changes the schedule and leaves the plan alone. At 150000 bbl Forcados arrives on eight dates from 2027-03-01 to 2027-03-22, and the plan''s crude volumes, costs and margin do not change.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m05-the-schedule ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same plan is cascaded again at a cargo size of 150000 bbl. What does the course show changing?', options = '["The crude receipts stay at 6, and each carries a smaller share of its crude.", "The crude receipts become 15, and the plan''s volumes and margin stay as they were.", "The plan runs less Forcados, since each smaller cargo holds less of the crude.", "The crude receipts become 15, and the margin is solved again for the extra cargoes."]'::jsonb, explanation = 'The cargo size changes the schedule and leaves the plan alone. At 150000 bbl Forcados arrives on eight dates from 2027-03-01 to 2027-03-22, and the plan''s crude volumes, costs and margin do not change.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-schedule ord 10
  select case
           when prompt = 'What does cascadeToSchedule do when it is called with periodStart left out?' and options = '["It refuses and names the missing period start, as a blank cost is refused.", "It dates the schedule from 2027-03-01, the default period start it carries.", "It returns a schedule of 0 events.", "It reads the machine clock and dates the schedule from that day."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest names the argument: cascadeToSchedule reads it when periodStart is left out. The same plan cascaded on two different days would then give two different schedules.' then 'old'
           when prompt = 'What does cascadeToSchedule do when it is called with periodStart left out?' and options = '["It refuses and names the missing period start, as a blank cost is refused.", "It dates the schedule from 2027-03-01, the default period start it carries.", "It returns a schedule of 0 events.", "It reads the machine clock and dates the schedule from that day."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course names the argument: cascadeToSchedule reads it when periodStart is left out. The same plan cascaded on two different days would then give two different schedules.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m05-the-schedule ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does cascadeToSchedule do when it is called with periodStart left out?', options = '["It refuses and names the missing period start, as a blank cost is refused.", "It dates the schedule from 2027-03-01, the default period start it carries.", "It returns a schedule of 0 events.", "It reads the machine clock and dates the schedule from that day."]'::jsonb, explanation = 'The course names the argument: cascadeToSchedule reads it when periodStart is left out. The same plan cascaded on two different days would then give two different schedules.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-schedule ord 11
  select case
           when prompt = 'ABUA''s schedule is built in seven time zones with the period start passed as the string "2027-03-01". What does the digest print?' and options = '["Every zone''s 41 dates match the UTC run, from 2027-03-01 to 2027-03-31.", "Africa/Lagos and Pacific/Kiritimati start one day early, on 2027-02-28, and the rest match.", "The zones west of Greenwich start one day early, on 2027-02-28.", "Only UTC and Europe/London match; the other five shift by a day."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this digest passes it.' then 'old'
           when prompt = 'ABUA''s schedule is built in seven time zones with the period start passed as the string "2027-03-01". What does the course print?' and options = '["Every zone''s 41 dates match the UTC run, from 2027-03-01 to 2027-03-31.", "Africa/Lagos and Pacific/Kiritimati start one day early, on 2027-02-28, and the rest match.", "The zones west of Greenwich start one day early, on 2027-02-28.", "Only UTC and Europe/London match; the other five shift by a day."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this course passes it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m05-the-schedule ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'ABUA''s schedule is built in seven time zones with the period start passed as the string "2027-03-01". What does the course print?', options = '["Every zone''s 41 dates match the UTC run, from 2027-03-01 to 2027-03-31.", "Africa/Lagos and Pacific/Kiritimati start one day early, on 2027-02-28, and the rest match.", "The zones west of Greenwich start one day early, on 2027-02-28.", "Only UTC and Europe/London match; the other five shift by a day."]'::jsonb, explanation = 'A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this course passes it.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-schedule ord 12
  select case
           when prompt = 'The period start is handed over as new Date(2027, 2, 1), a Date built at local midnight. In which zones does the schedule start on 2027-02-28?' and options = '["America/New_York and America/Los_Angeles.", "Pacific/Pago_Pago and Pacific/Kiritimati.", "Africa/Lagos and Pacific/Kiritimati.", "Every zone the digest tried except UTC."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Built at local midnight, the Date gives 2027-02-28 as the first date in Africa/Lagos and Pacific/Kiritimati, and every date matches UTC reads false there. The two American zones and Pago Pago keep 2027-03-01.' then 'old'
           when prompt = 'The period start is handed over as new Date(2027, 2, 1), a Date built at local midnight. In which zones does the schedule start on 2027-02-28?' and options = '["America/New_York and America/Los_Angeles.", "Pacific/Pago_Pago and Pacific/Kiritimati.", "Africa/Lagos and Pacific/Kiritimati.", "Every zone the course tried except UTC."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Built at local midnight, the Date gives 2027-02-28 as the first date in Africa/Lagos and Pacific/Kiritimati, and every date matches UTC reads false there. The two American zones and Pago Pago keep 2027-03-01.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m05-the-schedule ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The period start is handed over as new Date(2027, 2, 1), a Date built at local midnight. In which zones does the schedule start on 2027-02-28?', options = '["America/New_York and America/Los_Angeles.", "Pacific/Pago_Pago and Pacific/Kiritimati.", "Africa/Lagos and Pacific/Kiritimati.", "Every zone the course tried except UTC."]'::jsonb, explanation = 'Built at local midnight, the Date gives 2027-02-28 as the first date in Africa/Lagos and Pacific/Kiritimati, and every date matches UTC reads false there. The two American zones and Pago Pago keep 2027-03-01.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-schedule' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m05-the-schedule ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 9
  select case
           when prompt = 'Which reading shows a configuration whose crude unit was given a feed?' and options = '["The crude unit reading 78.04 percent, short of its 2600000.00 bbl capacity.", "Total crude and crude unit throughput agreeing to the barrel, printed as true.", "A crude unit operating cost of 0.00 on a month of 2029032.26 bbl of crude.", "The crude unit charging 1.2500 a barrel on every barrel of crude."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the fed configuration the digest prints crude unit operating cost 0.00, and the crude is still run. The three other options read ABUA as typed: 78.04 percent, the agreement flag true, and 2536290.32 at 1.2500 a barrel.' then 'old'
           when prompt = 'Which reading shows a configuration whose crude unit was given a feed?' and options = '["The crude unit reading 78.04 percent, short of its 2600000.00 bbl capacity.", "Total crude and crude unit throughput agreeing to the barrel, printed as true.", "A crude unit operating cost of 0.00 on a month of 2029032.26 bbl of crude.", "The crude unit charging 1.2500 a barrel on every barrel of crude."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the fed configuration the course prints crude unit operating cost 0.00, and the crude is still run. The three other options read ABUA as typed: 78.04 percent, the agreement flag true, and 2536290.32 at 1.2500 a barrel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m06-the-professional-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which reading shows a configuration whose crude unit was given a feed?', options = '["The crude unit reading 78.04 percent, short of its 2600000.00 bbl capacity.", "Total crude and crude unit throughput agreeing to the barrel, printed as true.", "A crude unit operating cost of 0.00 on a month of 2029032.26 bbl of crude.", "The crude unit charging 1.2500 a barrel on every barrel of crude."]'::jsonb, explanation = 'In the fed configuration the course prints crude unit operating cost 0.00, and the crude is still run. The three other options read ABUA as typed: 78.04 percent, the agreement flag true, and 2536290.32 at 1.2500 a barrel.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 10
  select case
           when prompt = 'Of these changes the digest prices around ABUA''s month, which one raises the margin?' and options = '["The reformer stepped from 420000.00 to 440000.00 bbl.", "The crude unit held at 1900000 barrels for the month.", "The jet and fuel oil floors of 300000 and 700000.", "The hydrotreater capacity left blank, for no limit."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The blank hydrotreater prints a margin change of 95572.87. The reformer step to 440000.00 bbl changes the margin by 0.00, the crude unit at 1900000 barrels by -230175.48, and the two floors by -1148089.05.' then 'old'
           when prompt = 'Of these changes the course prices around ABUA''s month, which one raises the margin?' and options = '["The reformer stepped from 420000.00 to 440000.00 bbl.", "The crude unit held at 1900000 barrels for the month.", "The jet and fuel oil floors of 300000 and 700000.", "The hydrotreater capacity left blank, for no limit."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The blank hydrotreater prints a margin change of 95572.87. The reformer step to 440000.00 bbl changes the margin by 0.00, the crude unit at 1900000 barrels by -230175.48, and the two floors by -1148089.05.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m06-the-professional-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Of these changes the course prices around ABUA''s month, which one raises the margin?', options = '["The reformer stepped from 420000.00 to 440000.00 bbl.", "The crude unit held at 1900000 barrels for the month.", "The jet and fuel oil floors of 300000 and 700000.", "The hydrotreater capacity left blank, for no limit."]'::jsonb, explanation = 'The blank hydrotreater prints a margin change of 95572.87. The reformer step to 440000.00 bbl changes the margin by 0.00, the crude unit at 1900000 barrels by -230175.48, and the two floors by -1148089.05.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 13
  select case
           when prompt = 'Which way of handing cascadeToSchedule its period start keeps ABUA''s dates the same in every zone and on every day it runs?' and options = '["Leave it out, so the schedule is dated from the day it is built.", "Pass it as a Date at local midnight, as the Suite page does.", "Pass it as a Date, the way the digest''s seven zone run does.", "Pass it as a YYYY-MM-DD string, so no clock or zone can move it."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Left out, the period start is read from the machine clock. A YYYY-MM-DD string is the same calendar day in every zone, and that is how the Suite page and the digest pass it, 2027-03-01 for ABUA. A Date built at local midnight starts on 2027-02-28 in Africa/Lagos and Pacific/Kiritimati.' then 'old'
           when prompt = 'Which way of handing cascadeToSchedule its period start keeps ABUA''s dates the same in every zone and on every day it runs?' and options = '["Leave it out, so the schedule is dated from the day it is built.", "Pass it as a Date at local midnight, as the Suite page does.", "Pass it as a Date, the way the course''s seven zone run does.", "Pass it as a YYYY-MM-DD string, so no clock or zone can move it."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Left out, the period start is read from the machine clock. A YYYY-MM-DD string is the same calendar day in every zone, and that is how the Suite page and the course pass it, 2027-03-01 for ABUA. A Date built at local midnight starts on 2027-02-28 in Africa/Lagos and Pacific/Kiritimati.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m06-the-professional-reading ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which way of handing cascadeToSchedule its period start keeps ABUA''s dates the same in every zone and on every day it runs?', options = '["Leave it out, so the schedule is dated from the day it is built.", "Pass it as a Date at local midnight, as the Suite page does.", "Pass it as a Date, the way the course''s seven zone run does.", "Pass it as a YYYY-MM-DD string, so no clock or zone can move it."]'::jsonb, explanation = 'Left out, the period start is read from the machine clock. A YYYY-MM-DD string is the same calendar day in every zone, and that is how the Suite page and the course pass it, 2027-03-01 for ABUA. A Date built at local midnight starts on 2027-02-28 in Africa/Lagos and Pacific/Kiritimati.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 15
  select case
           when prompt = 'Which ABUA figure does the schedule''s totals table print identically in its scheduled and plan columns?' and options = '["The margin, 7077935.48, dated 2027-03-31.", "The crude unit capacity, 2600000.00 bbl.", "The cdu''s 2029032.26 bbl and 2536290.32.", "The offgas surplus of 103638.71 bbl, lifted weekly."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest sets the schedule''s totals beside the plan''s for all ten materials, and every row agrees. The cdu row reads 2029032.26 bbl and 2536290.32 in both, so the schedule adds no barrels and loses none.' then 'old'
           when prompt = 'Which ABUA figure does the schedule''s totals table print identically in its scheduled and plan columns?' and options = '["The margin, 7077935.48, dated 2027-03-31.", "The crude unit capacity, 2600000.00 bbl.", "The cdu''s 2029032.26 bbl and 2536290.32.", "The offgas surplus of 103638.71 bbl, lifted weekly."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course sets the schedule''s totals beside the plan''s for all ten materials, and every row agrees. The cdu row reads 2029032.26 bbl and 2536290.32 in both, so the schedule adds no barrels and loses none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for intermediate m06-the-professional-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which ABUA figure does the schedule''s totals table print identically in its scheduled and plan columns?', options = '["The margin, 7077935.48, dated 2027-03-31.", "The crude unit capacity, 2600000.00 bbl.", "The cdu''s 2029032.26 bbl and 2536290.32.", "The offgas surplus of 103638.71 bbl, lifted weekly."]'::jsonb, explanation = 'The course sets the schedule''s totals beside the plan''s for all ten materials, and every row agrees. The cdu row reads 2029032.26 bbl and 2536290.32 in both, so the schedule adds no barrels and loses none.'
     where app_slug = 'refinery' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: intermediate m06-the-professional-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 27
  select case
           when prompt = 'The expansion is valued with start year 2031. What does the first calendar year read?' and options = '["2027", "2029", "2031", "2033"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Year 0 takes the start year as its label. The money in every row is unchanged, which the digest confirms by printing the same NPV and total tax for both runs.' then 'old'
           when prompt = 'The expansion is valued with start year 2031. What does the first calendar year read?' and options = '["2027", "2029", "2031", "2033"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Year 0 takes the start year as its label. The money in every row is unchanged, which the course confirms by printing the same NPV and total tax for both runs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for advanced final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: advanced final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The expansion is valued with start year 2031. What does the first calendar year read?', options = '["2027", "2029", "2031", "2033"]'::jsonb, explanation = 'Year 0 takes the start year as its label. The money in every row is unchanged, which the course confirms by printing the same NPV and total tax for both runs.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: advanced final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 30
  select case
           when prompt = 'How is a year''s tax formed once a loss is being carried?' and options = '["taxable income x 30 percent, less the loss carried in, once above zero", "(taxable income - the tax paid last year) x 30 percent, once above zero", "the loss carried in x 30 percent, taken off the year''s income", "(taxable income - the loss carried in) x 30 percent, once above zero"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest states: the tax = (taxable income - the loss carried in) x the tax rate of 30 percent once that is above zero. The loss is set against income before the rate is applied.' then 'old'
           when prompt = 'How is a year''s tax formed once a loss is being carried?' and options = '["taxable income x 30 percent, less the loss carried in, once above zero", "(taxable income - the tax paid last year) x 30 percent, once above zero", "the loss carried in x 30 percent, taken off the year''s income", "(taxable income - the loss carried in) x 30 percent, once above zero"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: the tax = (taxable income - the loss carried in) x the tax rate of 30 percent once that is above zero. The loss is set against income before the rate is applied.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for advanced final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: advanced final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How is a year''s tax formed once a loss is being carried?', options = '["taxable income x 30 percent, less the loss carried in, once above zero", "(taxable income - the tax paid last year) x 30 percent, once above zero", "the loss carried in x 30 percent, taken off the year''s income", "(taxable income - the loss carried in) x 30 percent, once above zero"]'::jsonb, explanation = 'The course states: the tax = (taxable income - the loss carried in) x the tax rate of 30 percent once that is above zero. The loss is set against income before the rate is applied.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: advanced final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-investment-case ord 7
  select case
           when prompt = 'The cash flow''s opex in each operating year reads 307.5315. How is that figure formed?' and options = '["opexFixed 291.7664 plus opexVariable 15.7651.", "The fixed cost of 14000000.00 plus 4.2000 a barrel.", "opexFixed 291.7664 plus the tax of 15.7651.", "Gross revenue 346.1195 less the tax of 38.5879."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints the sum: 291.7664 + 15.7651 = 307.5315, and the cash flow''s opex reads 307.5315. The crude cost sits inside opexFixed, so a fixed and variable cost alone would leave the crude out.' then 'old'
           when prompt = 'The cash flow''s opex in each operating year reads 307.5315. How is that figure formed?' and options = '["opexFixed 291.7664 plus opexVariable 15.7651.", "The fixed cost of 14000000.00 plus 4.2000 a barrel.", "opexFixed 291.7664 plus the tax of 15.7651.", "Gross revenue 346.1195 less the tax of 38.5879."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the sum: 291.7664 + 15.7651 = 307.5315, and the cash flow''s opex reads 307.5315. The crude cost sits inside opexFixed, so a fixed and variable cost alone would leave the crude out.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-investment-case' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for advanced m04-the-investment-case ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: advanced m04-the-investment-case ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The cash flow''s opex in each operating year reads 307.5315. How is that figure formed?', options = '["opexFixed 291.7664 plus opexVariable 15.7651.", "The fixed cost of 14000000.00 plus 4.2000 a barrel.", "opexFixed 291.7664 plus the tax of 15.7651.", "Gross revenue 346.1195 less the tax of 38.5879."]'::jsonb, explanation = 'The course prints the sum: 291.7664 + 15.7651 = 307.5315, and the cash flow''s opex reads 307.5315. The crude cost sits inside opexFixed, so a fixed and variable cost alone would leave the crude out.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-investment-case' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: advanced m04-the-investment-case ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-tax-losses-carried-forward ord 10
  select case
           when prompt = 'Subtracting two printed four-decimal pool figures can differ from a printed result in the last place. Why?' and options = '["The engine rounds only the tax column to four decimals.", "The pool is carried in whole millions.", "Each four-decimal figure is rounded on its own.", "The tax rate is applied after the pool is rounded down."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Each four-decimal figure is rounded on its own, so the digest prints the construction years through year 6 to nine decimals for arithmetic. Each nine-decimal figure agrees with the engine''s own to within two units in the ninth decimal.' then 'old'
           when prompt = 'Subtracting two printed four-decimal pool figures can differ from a printed result in the last place. Why?' and options = '["The engine rounds only the tax column to four decimals.", "The pool is carried in whole millions.", "Each four-decimal figure is rounded on its own.", "The tax rate is applied after the pool is rounded down."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Each four-decimal figure is rounded on its own, so the course prints the construction years through year 6 to nine decimals for arithmetic. Each nine-decimal figure agrees with the engine''s own to within two units in the ninth decimal.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-tax-losses-carried-forward' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, refinery refused: no row for advanced m05-tax-losses-carried-forward ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, refinery refused: advanced m05-tax-losses-carried-forward ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Subtracting two printed four-decimal pool figures can differ from a printed result in the last place. Why?', options = '["The engine rounds only the tax column to four decimals.", "The pool is carried in whole millions.", "Each four-decimal figure is rounded on its own.", "The tax rate is applied after the pool is rounded down."]'::jsonb, explanation = 'Each four-decimal figure is rounded on its own, so the course prints the construction years through year 6 to nine decimals for arithmetic. Each nine-decimal figure agrees with the engine''s own to within two units in the ninth decimal.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-tax-losses-carried-forward' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, refinery refused: advanced m05-tax-losses-carried-forward ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'refinery';
  if v_total <> 396 then raise exception 'digest-copy recut, refinery refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, refinery: % of 30 rows updated, the rest already carried the recut text', v_updated;
end $$;
