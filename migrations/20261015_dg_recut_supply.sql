-- ==========================================================================
-- DIGEST-COPY RECUT: supply, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/supply, built from its committed .py sources.
-- Rows: 43 (beginner 5, intermediate 25, advanced 13).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-supply.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 2
  select case
           when prompt = 'AK-02''s strapping table ends at 12000 mm with 2412.743 m3. Over which heights can volumeAtDip read a dip on AK-02?' and options = '["From 0 mm up to 12000 mm; a dip at 12010 mm is refused.", "From 0 mm upward, with heights past 12000 mm carried on the slope of the last step.", "Only at the entries themselves, one every 250 mm, since a dip must land on one.", "From 250 mm up to 12000 mm, since a dip of 0 mm counts as no reading."]'::jsonb and answer_index = 0 and explanation is not distinct from 'AK-02''s table starts at the empty tank and stops at 12000 mm. Between the two it interpolates; the digest''s dip at 12010 mm gets the refusal for a dip above the last strapping entry.' then 'old'
           when prompt = 'AK-02''s strapping table ends at 12000 mm with 2412.743 m3. Over which heights can volumeAtDip read a dip on AK-02?' and options = '["From 0 mm up to 12000 mm; a dip at 12010 mm is refused.", "From 0 mm upward, with heights past 12000 mm carried on the slope of the last step.", "Only at the entries themselves, one every 250 mm, since a dip must land on one.", "From 250 mm up to 12000 mm, since a dip of 0 mm counts as no reading."]'::jsonb and answer_index = 0 and explanation is not distinct from 'AK-02''s table starts at the empty tank and stops at 12000 mm. Between the two it interpolates; the course''s dip at 12010 mm gets the refusal for a dip above the last strapping entry.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for beginner final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: beginner final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'AK-02''s strapping table ends at 12000 mm with 2412.743 m3. Over which heights can volumeAtDip read a dip on AK-02?', options = '["From 0 mm up to 12000 mm; a dip at 12010 mm is refused.", "From 0 mm upward, with heights past 12000 mm carried on the slope of the last step.", "Only at the entries themselves, one every 250 mm, since a dip must land on one.", "From 250 mm up to 12000 mm, since a dip of 0 mm counts as no reading."]'::jsonb, explanation = 'AK-02''s table starts at the empty tank and stops at 12000 mm. Between the two it interpolates; the course''s dip at 12010 mm gets the refusal for a dip above the last strapping entry.'
     where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: beginner final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 7
  select case
           when prompt = 'The digest straps two AKODO tanks a second time at 10 mm. On which of them does the step change the reading at the dip?' and options = '["AK-03, the bullet", "AK-01, the vertical tank", "Both of them, by the same amount", "Neither of them, to the litre"]'::jsonb and answer_index = 0 and explanation is not distinct from 'AK-01''s 250 mm and 10 mm tables both read 3542.077 m3. On AK-03 the 100 mm table less the 10 mm table is -0.007 m3 at the 1847 mm dip.' then 'old'
           when prompt = 'The course straps two AKODO tanks a second time at 10 mm. On which of them does the step change the reading at the dip?' and options = '["AK-03, the bullet", "AK-01, the vertical tank", "Both of them, by the same amount", "Neither of them, to the litre"]'::jsonb and answer_index = 0 and explanation is not distinct from 'AK-01''s 250 mm and 10 mm tables both read 3542.077 m3. On AK-03 the 100 mm table less the 10 mm table is -0.007 m3 at the 1847 mm dip.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for beginner final ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: beginner final ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course straps two AKODO tanks a second time at 10 mm. On which of them does the step change the reading at the dip?', options = '["AK-03, the bullet", "AK-01, the vertical tank", "Both of them, by the same amount", "Neither of them, to the litre"]'::jsonb, explanation = 'AK-01''s 250 mm and 10 mm tables both read 3542.077 m3. On AK-03 the 100 mm table less the 10 mm table is -0.007 m3 at the 1847 mm dip.'
     where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: beginner final ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 28
  select case
           when prompt = 'In the trimmed record, what is the shortest run of loss the digest shows printing the prompt?' and options = '["3 days of loss", "6 days of loss", "4 days of loss", "2 days of loss"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The trimmed table is the only evidence: its row for 6 kept days shows 3 days of loss with no prompt, and its row for 7 kept days shows 4 days with the prompt.' then 'old'
           when prompt = 'In the trimmed record, what is the shortest run of loss the course shows printing the prompt?' and options = '["3 days of loss", "6 days of loss", "4 days of loss", "2 days of loss"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The trimmed table is the only evidence: its row for 6 kept days shows 3 days of loss with no prompt, and its row for 7 kept days shows 4 days with the prompt.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for beginner final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: beginner final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the trimmed record, what is the shortest run of loss the course shows printing the prompt?', options = '["3 days of loss", "6 days of loss", "4 days of loss", "2 days of loss"]'::jsonb, explanation = 'The trimmed table is the only evidence: its row for 6 kept days shows 3 days of loss with no prompt, and its row for 7 kept days shows 4 days with the prompt.'
     where app_slug = 'supply' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: beginner final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-strapping-table ord 4
  select case
           when prompt = 'At 41 mm on AK-03 the 100 mm table reads 0.341 m3 and the 10 mm table 0.220 m3. Which figure does the digest print for the 100 mm table less the 10 mm table?' and options = '["-0.007 m3, the difference at that tank''s morning dip", "0.341 m3, since the finer table reads no water", "0.120 m3", "0.220 m3, the reading on the finer of the two tables"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The last column is computed from the unrounded volumes, so the printed 0.120 m3 is the figure to quote. It is never recomputed from the rounded columns.' then 'old'
           when prompt = 'At 41 mm on AK-03 the 100 mm table reads 0.341 m3 and the 10 mm table 0.220 m3. Which figure does the course print for the 100 mm table less the 10 mm table?' and options = '["-0.007 m3, the difference at that tank''s morning dip", "0.341 m3, since the finer table reads no water", "0.120 m3", "0.220 m3, the reading on the finer of the two tables"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The last column is computed from the unrounded volumes, so the printed 0.120 m3 is the figure to quote. It is never recomputed from the rounded columns.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-strapping-table' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for beginner m02-the-strapping-table ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: beginner m02-the-strapping-table ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At 41 mm on AK-03 the 100 mm table reads 0.341 m3 and the 10 mm table 0.220 m3. Which figure does the course print for the 100 mm table less the 10 mm table?', options = '["-0.007 m3, the difference at that tank''s morning dip", "0.341 m3, since the finer table reads no water", "0.120 m3", "0.220 m3, the reading on the finer of the two tables"]'::jsonb, explanation = 'The last column is computed from the unrounded volumes, so the printed 0.120 m3 is the figure to quote. It is never recomputed from the rounded columns.'
     where app_slug = 'supply' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-strapping-table' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: beginner m02-the-strapping-table ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-volume-correction-factor ord 12
  select case
           when prompt = 'The three printed standard volumes, each rounded to the litre, add to 4499.453 m3. On which total is the AKODO day closed?' and options = '["4499.453 m3, the sum of the three printed standard volumes", "4581.490 m3, the total gross observed volume of the three tanks", "4499.452 m3, the total summed from the unrounded standard volumes", "4499.453 m3, since a stock is always quoted to the litre it prints"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine sums the unrounded standard volumes and the digest prints that total as 4499.452 m3. The sum of the printed rows is not the figure the day closes on.' then 'old'
           when prompt = 'The three printed standard volumes, each rounded to the litre, add to 4499.453 m3. On which total is the AKODO day closed?' and options = '["4499.453 m3, the sum of the three printed standard volumes", "4581.490 m3, the total gross observed volume of the three tanks", "4499.452 m3, the total summed from the unrounded standard volumes", "4499.453 m3, since a stock is always quoted to the litre it prints"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine sums the unrounded standard volumes and the course prints that total as 4499.452 m3. The sum of the printed rows is not the figure the day closes on.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-volume-correction-factor' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for beginner m04-the-volume-correction-factor ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: beginner m04-the-volume-correction-factor ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The three printed standard volumes, each rounded to the litre, add to 4499.453 m3. On which total is the AKODO day closed?', options = '["4499.453 m3, the sum of the three printed standard volumes", "4581.490 m3, the total gross observed volume of the three tanks", "4499.452 m3, the total summed from the unrounded standard volumes", "4499.453 m3, since a stock is always quoted to the litre it prints"]'::jsonb, explanation = 'The engine sums the unrounded standard volumes and the course prints that total as 4499.452 m3. The sum of the printed rows is not the figure the day closes on.'
     where app_slug = 'supply' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-volume-correction-factor' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: beginner m04-the-volume-correction-factor ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 2
  select case
           when prompt = 'Read the load minutes sweep at 26 minutes a load on IBAFO''s 4 bays. Which set of figures does it print?' and options = '["Utilisation 0.975000, probability of waiting 0.945114, mean wait 245.7297 minutes.", "Utilisation 0.950000, probability of waiting 0.891419, mean wait 106.9703 minutes.", "Utilisation 0.975000, probability of waiting 0.300939, mean wait 245.7297 minutes.", "Utilisation 1.000000, probability of waiting 1.000000, mean wait none."]'::jsonb and answer_index = 0 and explanation is not distinct from 'At 26 minutes the engine prints 0.975000, 0.945114 and 245.7297 minutes. The 0.300939 at that row is the Erlang B the digest derives from the Erlang C. The 0.950000 row is 9.5 arrivals in the arrivals sweep.' then 'old'
           when prompt = 'Read the load minutes sweep at 26 minutes a load on IBAFO''s 4 bays. Which set of figures does it print?' and options = '["Utilisation 0.975000, probability of waiting 0.945114, mean wait 245.7297 minutes.", "Utilisation 0.950000, probability of waiting 0.891419, mean wait 106.9703 minutes.", "Utilisation 0.975000, probability of waiting 0.300939, mean wait 245.7297 minutes.", "Utilisation 1.000000, probability of waiting 1.000000, mean wait none."]'::jsonb and answer_index = 0 and explanation is not distinct from 'At 26 minutes the engine prints 0.975000, 0.945114 and 245.7297 minutes. The 0.300939 at that row is the Erlang B the course derives from the Erlang C. The 0.950000 row is 9.5 arrivals in the arrivals sweep.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Read the load minutes sweep at 26 minutes a load on IBAFO''s 4 bays. Which set of figures does it print?', options = '["Utilisation 0.975000, probability of waiting 0.945114, mean wait 245.7297 minutes.", "Utilisation 0.950000, probability of waiting 0.891419, mean wait 106.9703 minutes.", "Utilisation 0.975000, probability of waiting 0.300939, mean wait 245.7297 minutes.", "Utilisation 1.000000, probability of waiting 1.000000, mean wait none."]'::jsonb, explanation = 'At 26 minutes the engine prints 0.975000, 0.945114 and 245.7297 minutes. The 0.300939 at that row is the Erlang B the course derives from the Erlang C. The 0.950000 row is 9.5 arrivals in the arrivals sweep.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 3
  select case
           when prompt = 'At 16 minute loads the digest prints a probability of waiting of 0.287043 and an Erlang B of 0.138706 worked out from it. Which one is the chance an arriving truck queues?' and options = '["0.138706, the blocking figure.", "0.287043, the Erlang C.", "Both: they describe one rack.", "Neither: the rack is unstable."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine reports Erlang C as the probability of waiting. Erlang B is the probability every bay is busy in a rack with no queue, where the truck leaves, and the digest derives it from the engine''s Erlang C.' then 'old'
           when prompt = 'At 16 minute loads the course prints a probability of waiting of 0.287043 and an Erlang B of 0.138706 worked out from it. Which one is the chance an arriving truck queues?' and options = '["0.138706, the blocking figure.", "0.287043, the Erlang C.", "Both: they describe one rack.", "Neither: the rack is unstable."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine reports Erlang C as the probability of waiting. Erlang B is the probability every bay is busy in a rack with no queue, where the truck leaves, and the course derives it from the engine''s Erlang C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At 16 minute loads the course prints a probability of waiting of 0.287043 and an Erlang B of 0.138706 worked out from it. Which one is the chance an arriving truck queues?', options = '["0.138706, the blocking figure.", "0.287043, the Erlang C.", "Both: they describe one rack.", "Neither: the rack is unstable."]'::jsonb, explanation = 'The engine reports Erlang C as the probability of waiting. Erlang B is the probability every bay is busy in a rack with no queue, where the truck leaves, and the course derives it from the engine''s Erlang C.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 4
  select case
           when prompt = 'The IBAFO rack''s mean wait is 47.2652 minutes and the digest works out 60.0000 minutes from the engine''s figures. Which statement is true?' and options = '["47.2652 averages the trucks that queue; 60.0000 averages every truck.", "47.2652 averages every truck; 60.0000 averages the trucks that queue.", "60.0000 is the mean wait plus the 24 minute load, the time on site.", "60.0000 is the wait at 5 bays, 47.2652 the wait at 4."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine''s figure takes in the trucks that load at once. The digest divides it by the probability of waiting to reach the trucks that queue. 7.0353 minutes is the 5 bay rack, and the time on site is a separate row of the rack table.' then 'old'
           when prompt = 'The IBAFO rack''s mean wait is 47.2652 minutes and the course works out 60.0000 minutes from the engine''s figures. Which statement is true?' and options = '["47.2652 averages the trucks that queue; 60.0000 averages every truck.", "47.2652 averages every truck; 60.0000 averages the trucks that queue.", "60.0000 is the mean wait plus the 24 minute load, the time on site.", "60.0000 is the wait at 5 bays, 47.2652 the wait at 4."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine''s figure takes in the trucks that load at once. The course divides it by the probability of waiting to reach the trucks that queue. 7.0353 minutes is the 5 bay rack, and the time on site is a separate row of the rack table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The IBAFO rack''s mean wait is 47.2652 minutes and the course works out 60.0000 minutes from the engine''s figures. Which statement is true?', options = '["47.2652 averages the trucks that queue; 60.0000 averages every truck.", "47.2652 averages every truck; 60.0000 averages the trucks that queue.", "60.0000 is the mean wait plus the 24 minute load, the time on site.", "60.0000 is the wait at 5 bays, 47.2652 the wait at 4."]'::jsonb, explanation = 'The engine''s figure takes in the trucks that load at once. The course divides it by the probability of waiting to reach the trucks that queue. 7.0353 minutes is the 5 bay rack, and the time on site is a separate row of the rack table.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 12
  select case
           when prompt = 'On this IBAFO morning, which tank decides that the netted and tank-by-tank stock figures part company?' and options = '["IB-T1, the petrol tank in use.", "IB-T3, the gas oil tank.", "IB-T4, the kerosene tank.", "IB-T2, below its heel."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The tank-by-tank count gives IB-T2 0.000 m3, since it holds 164.700 m3 against its 210.000 m3 heel. The netted farm figure charges IB-T2''s heel against the product in the other three tanks, which the digest rules out: no pump lends one tank''s volume to another''s heel.' then 'old'
           when prompt = 'On this IBAFO morning, which tank decides that the netted and tank-by-tank stock figures part company?' and options = '["IB-T1, the petrol tank in use.", "IB-T3, the gas oil tank.", "IB-T4, the kerosene tank.", "IB-T2, below its heel."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The tank-by-tank count gives IB-T2 0.000 m3, since it holds 164.700 m3 against its 210.000 m3 heel. The netted farm figure charges IB-T2''s heel against the product in the other three tanks, which the course rules out: no pump lends one tank''s volume to another''s heel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On this IBAFO morning, which tank decides that the netted and tank-by-tank stock figures part company?', options = '["IB-T1, the petrol tank in use.", "IB-T3, the gas oil tank.", "IB-T4, the kerosene tank.", "IB-T2, below its heel."]'::jsonb, explanation = 'The tank-by-tank count gives IB-T2 0.000 m3, since it holds 164.700 m3 against its 210.000 m3 heel. The netted farm figure charges IB-T2''s heel against the product in the other three tanks, which the course rules out: no pump lends one tank''s volume to another''s heel.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 13
  select case
           when prompt = 'The IBAFO farm prints a working capacity of 21845.000 m3. What does the engine take off the capacity of 22500.000 m3 to reach it?' and options = '["The farm''s ullage, 11767.300 m3.", "The farm''s stock, 10732.700 m3.", "The farm''s heel, 655.000 m3.", "IB-T2''s heel alone, 210.000 m3."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest defines working capacity as capacity less heel, and the farm rows read 22500.000 m3, 655.000 m3 and 21845.000 m3. 11767.300 m3 is the ullage and 10732.700 m3 the stock; 210.000 m3 is one tank''s heel.' then 'old'
           when prompt = 'The IBAFO farm prints a working capacity of 21845.000 m3. What does the engine take off the capacity of 22500.000 m3 to reach it?' and options = '["The farm''s ullage, 11767.300 m3.", "The farm''s stock, 10732.700 m3.", "The farm''s heel, 655.000 m3.", "IB-T2''s heel alone, 210.000 m3."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course defines working capacity as capacity less heel, and the farm rows read 22500.000 m3, 655.000 m3 and 21845.000 m3. 11767.300 m3 is the ullage and 10732.700 m3 the stock; 210.000 m3 is one tank''s heel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The IBAFO farm prints a working capacity of 21845.000 m3. What does the engine take off the capacity of 22500.000 m3 to reach it?', options = '["The farm''s ullage, 11767.300 m3.", "The farm''s stock, 10732.700 m3.", "The farm''s heel, 655.000 m3.", "IB-T2''s heel alone, 210.000 m3."]'::jsonb, explanation = 'The course defines working capacity as capacity less heel, and the farm rows read 22500.000 m3, 655.000 m3 and 21845.000 m3. 11767.300 m3 is the ullage and 10732.700 m3 the stock; 210.000 m3 is one tank''s heel.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 18
  select case
           when prompt = 'The IBAFO period prints three carbon cases: factor and density supplied, no emission factor, and no density. Which of them print a margin of 4988.00 USD?' and options = '["Only the case with the factor and the density supplied.", "The two cases with a density, since the loss is priced.", "All three cases, whatever the carbon side reads.", "None of them, since the margin waits on the carbon side."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints revenue 20592.00 USD and margin 4988.00 USD in all three rows. The margin is revenue less the variable and fixed costs; a missing factor or density leaves the carbon columns none and moves no money figure.' then 'old'
           when prompt = 'The IBAFO period prints three carbon cases: factor and density supplied, no emission factor, and no density. Which of them print a margin of 4988.00 USD?' and options = '["Only the case with the factor and the density supplied.", "The two cases with a density, since the loss is priced.", "All three cases, whatever the carbon side reads.", "None of them, since the margin waits on the carbon side."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints revenue 20592.00 USD and margin 4988.00 USD in all three rows. The margin is revenue less the variable and fixed costs; a missing factor or density leaves the carbon columns none and moves no money figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The IBAFO period prints three carbon cases: factor and density supplied, no emission factor, and no density. Which of them print a margin of 4988.00 USD?', options = '["Only the case with the factor and the density supplied.", "The two cases with a density, since the loss is priced.", "All three cases, whatever the carbon side reads.", "None of them, since the margin waits on the carbon side."]'::jsonb, explanation = 'The course prints revenue 20592.00 USD and margin 4988.00 USD in all three rows. The margin is revenue less the variable and fixed costs; a missing factor or density leaves the carbon columns none and moves no money figure.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 34
  select case
           when prompt = 'The IBAFO farm prints an ullage, and the IBAFO forecourt prints an ullage at reorder. Which pair does the digest print?' and options = '["Farm 11767.300 m3; forecourt 28125.00 litres.", "Farm 10123.000 m3; forecourt 28125.00 litres.", "Farm 11767.300 m3; forecourt 11875.00 litres.", "Farm 21845.000 m3; forecourt 37500.00 litres."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The farm''s ullage is each tank''s capacity less its stock, summed, 11767.300 m3. The forecourt''s ullage at reorder is capacity less the reorder level, 28125.00 litres. 10123.000 m3 is the farm''s pumpable stock, 11875.00 litres the reorder level, and 21845.000 m3 and 37500.00 litres are the working capacity and the usable tank litres.' then 'old'
           when prompt = 'The IBAFO farm prints an ullage, and the IBAFO forecourt prints an ullage at reorder. Which pair does the course print?' and options = '["Farm 11767.300 m3; forecourt 28125.00 litres.", "Farm 10123.000 m3; forecourt 28125.00 litres.", "Farm 11767.300 m3; forecourt 11875.00 litres.", "Farm 21845.000 m3; forecourt 37500.00 litres."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The farm''s ullage is each tank''s capacity less its stock, summed, 11767.300 m3. The forecourt''s ullage at reorder is capacity less the reorder level, 28125.00 litres. 10123.000 m3 is the farm''s pumpable stock, 11875.00 litres the reorder level, and 21845.000 m3 and 37500.00 litres are the working capacity and the usable tank litres.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The IBAFO farm prints an ullage, and the IBAFO forecourt prints an ullage at reorder. Which pair does the course print?', options = '["Farm 11767.300 m3; forecourt 28125.00 litres.", "Farm 10123.000 m3; forecourt 28125.00 litres.", "Farm 11767.300 m3; forecourt 11875.00 litres.", "Farm 21845.000 m3; forecourt 37500.00 litres."]'::jsonb, explanation = 'The farm''s ullage is each tank''s capacity less its stock, summed, 11767.300 m3. The forecourt''s ullage at reorder is capacity less the reorder level, 28125.00 litres. 10123.000 m3 is the farm''s pumpable stock, 11875.00 litres the reorder level, and 21845.000 m3 and 37500.00 litres are the working capacity and the usable tank litres.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 38
  select case
           when prompt = 'At the forecourt the mean wait is 2.2083 minutes at 6 nozzles. Which cars does it average over?' and options = '["Every car, including the ones that drive straight to a free nozzle.", "Only the cars that queue, as the rack''s 60.0000 minutes does.", "Only the cars in the peak hour that find the nozzles full.", "The cars that queue plus their time at the nozzle."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The forecourt is rackQueue with nozzles for bays, so its mean wait averages over every arrival, as the rack''s 47.2652 minutes does. The 60.0000 minutes the digest works out for the rack averages the trucks that queue.' then 'old'
           when prompt = 'At the forecourt the mean wait is 2.2083 minutes at 6 nozzles. Which cars does it average over?' and options = '["Every car, including the ones that drive straight to a free nozzle.", "Only the cars that queue, as the rack''s 60.0000 minutes does.", "Only the cars in the peak hour that find the nozzles full.", "The cars that queue plus their time at the nozzle."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The forecourt is rackQueue with nozzles for bays, so its mean wait averages over every arrival, as the rack''s 47.2652 minutes does. The 60.0000 minutes the course works out for the rack averages the trucks that queue.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the forecourt the mean wait is 2.2083 minutes at 6 nozzles. Which cars does it average over?', options = '["Every car, including the ones that drive straight to a free nozzle.", "Only the cars that queue, as the rack''s 60.0000 minutes does.", "Only the cars in the peak hour that find the nozzles full.", "The cars that queue plus their time at the nozzle."]'::jsonb, explanation = 'The forecourt is rackQueue with nozzles for bays, so its mean wait averages over every arrival, as the rack''s 47.2652 minutes does. The 60.0000 minutes the course works out for the rack averages the trucks that queue.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 2
  select case
           when prompt = 'The IBAFO rack is called with 9 arrivals an hour, 4 bays and a load time typed as 0 minutes. What does the engine answer?' and options = '["REFUSED: Arrival rate and load time are both needed.", "REFUSED: The number of bays must be a whole number, one or more.", "REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.", "No refusal: stable true and a mean wait of none."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A load that takes no time is a missing measurement. The digest''s refusal table prints the load time of 0 against 9 arrivals and 4 bays with the sentence about the arrival rate and the load time, the same sentence a blank load time gets.' then 'old'
           when prompt = 'The IBAFO rack is called with 9 arrivals an hour, 4 bays and a load time typed as 0 minutes. What does the engine answer?' and options = '["REFUSED: Arrival rate and load time are both needed.", "REFUSED: The number of bays must be a whole number, one or more.", "REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.", "No refusal: stable true and a mean wait of none."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A load that takes no time is a missing measurement. The course''s refusal table prints the load time of 0 against 9 arrivals and 4 bays with the sentence about the arrival rate and the load time, the same sentence a blank load time gets.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The IBAFO rack is called with 9 arrivals an hour, 4 bays and a load time typed as 0 minutes. What does the engine answer?', options = '["REFUSED: Arrival rate and load time are both needed.", "REFUSED: The number of bays must be a whole number, one or more.", "REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.", "No refusal: stable true and a mean wait of none."]'::jsonb, explanation = 'A load that takes no time is a missing measurement. The course''s refusal table prints the load time of 0 against 9 arrivals and 4 bays with the sentence about the arrival rate and the load time, the same sentence a blank load time gets.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 3
  select case
           when prompt = 'At IBAFO the offered load is 3.6000 erlangs. How does rackQueue form it?' and options = '["Arrivals per hour / (60 / load minutes) / bays.", "Arrivals per hour x bays / (60 / load minutes).", "Probability of waiting x bays.", "Arrivals per hour / (60 / load minutes)."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints offered load (erlangs) = arrivals per hour / (60 / load minutes), and utilisation = offered load / bays. Dividing the offered load by the bays again gives the utilisation, 0.900000. The bay count is not in the offered load, and neither is the probability of waiting, 0.787753.' then 'old'
           when prompt = 'At IBAFO the offered load is 3.6000 erlangs. How does rackQueue form it?' and options = '["Arrivals per hour / (60 / load minutes) / bays.", "Arrivals per hour x bays / (60 / load minutes).", "Probability of waiting x bays.", "Arrivals per hour / (60 / load minutes)."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints offered load (erlangs) = arrivals per hour / (60 / load minutes), and utilisation = offered load / bays. Dividing the offered load by the bays again gives the utilisation, 0.900000. The bay count is not in the offered load, and neither is the probability of waiting, 0.787753.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At IBAFO the offered load is 3.6000 erlangs. How does rackQueue form it?', options = '["Arrivals per hour / (60 / load minutes) / bays.", "Arrivals per hour x bays / (60 / load minutes).", "Probability of waiting x bays.", "Arrivals per hour / (60 / load minutes)."]'::jsonb, explanation = 'The course prints offered load (erlangs) = arrivals per hour / (60 / load minutes), and utilisation = offered load / bays. Dividing the offered load by the bays again gives the utilisation, 0.900000. The bay count is not in the offered load, and neither is the probability of waiting, 0.787753.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 5
  select case
           when prompt = 'IBAFO''s rack prints a utilisation of 0.900000 and a probability of waiting of 0.787753. What does 0.787753 measure?' and options = '["The share of each bay''s hour spent loading, across the 4 bays.", "The chance a truck finding every bay busy is turned away.", "The chance that an arriving truck has to wait for a bay.", "The share of the day''s 216 trucks that load within the mean load minutes."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest names it: the probability that an arriving truck waits is Erlang C. 0.900000 is the utilisation, offered load / bays. Erlang B, the rack where a truck that finds every bay busy leaves, is not exported by the engine, and 216 is the trucks per day at this arrival rate.' then 'old'
           when prompt = 'IBAFO''s rack prints a utilisation of 0.900000 and a probability of waiting of 0.787753. What does 0.787753 measure?' and options = '["The share of each bay''s hour spent loading, across the 4 bays.", "The chance a truck finding every bay busy is turned away.", "The chance that an arriving truck has to wait for a bay.", "The share of the day''s 216 trucks that load within the mean load minutes."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course names it: the probability that an arriving truck waits is Erlang C. 0.900000 is the utilisation, offered load / bays. Erlang B, the rack where a truck that finds every bay busy leaves, is not exported by the engine, and 216 is the trucks per day at this arrival rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s rack prints a utilisation of 0.900000 and a probability of waiting of 0.787753. What does 0.787753 measure?', options = '["The share of each bay''s hour spent loading, across the 4 bays.", "The chance a truck finding every bay busy is turned away.", "The chance that an arriving truck has to wait for a bay.", "The share of the day''s 216 trucks that load within the mean load minutes."]'::jsonb, explanation = 'The course names it: the probability that an arriving truck waits is Erlang C. 0.900000 is the utilisation, offered load / bays. Erlang B, the rack where a truck that finds every bay busy leaves, is not exported by the engine, and 216 is the trucks per day at this arrival rate.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 7
  select case
           when prompt = 'The digest prints an Erlang B of 0.270685 beside the IBAFO rack''s Erlang C of 0.787753. Where does that Erlang B come from?' and options = '["rackQueue exports it as a blocking probability.", "The engine''s probability of waiting at 16 minute loads.", "The utilisation times the engine''s Erlang C.", "The digest works it out from the engine''s Erlang C by an identity."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine builds Erlang C from the Erlang B recursion and exports only Erlang C. The digest derives B = C x (1 - utilisation) / (1 - utilisation x C), which gives 0.270685 on the IBAFO rack, and labels it as worked out from the engine''s figure.' then 'old'
           when prompt = 'The course prints an Erlang B of 0.270685 beside the IBAFO rack''s Erlang C of 0.787753. Where does that Erlang B come from?' and options = '["rackQueue exports it as a blocking probability.", "The engine''s probability of waiting at 16 minute loads.", "The utilisation times the engine''s Erlang C.", "The course works it out from the engine''s Erlang C by an identity."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine builds Erlang C from the Erlang B recursion and exports only Erlang C. The course derives B = C x (1 - utilisation) / (1 - utilisation x C), which gives 0.270685 on the IBAFO rack, and labels it as worked out from the engine''s figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints an Erlang B of 0.270685 beside the IBAFO rack''s Erlang C of 0.787753. Where does that Erlang B come from?', options = '["rackQueue exports it as a blocking probability.", "The engine''s probability of waiting at 16 minute loads.", "The utilisation times the engine''s Erlang C.", "The course works it out from the engine''s Erlang C by an identity."]'::jsonb, explanation = 'The engine builds Erlang C from the Erlang B recursion and exports only Erlang C. The course derives B = C x (1 - utilisation) / (1 - utilisation x C), which gives 0.270685 on the IBAFO rack, and labels it as worked out from the engine''s figure.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 8
  select case
           when prompt = 'What rack does the derived Erlang B of 0.270685 describe?' and options = '["The IBAFO rack as it runs, where a truck that finds every bay busy waits in the yard.", "A rack with no queue, where a truck that finds every bay busy leaves.", "A rack where every truck waits in the yard.", "A rack of one bay, where B and C agree."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest defines this Erlang B for a rack with NO queue, in which a truck that meets every bay busy drives off, and works it out for IBAFO as 0.270685. rackQueue runs the M/M/c queue instead and reports its Erlang C, 0.787753.' then 'old'
           when prompt = 'What rack does the derived Erlang B of 0.270685 describe?' and options = '["The IBAFO rack as it runs, where a truck that finds every bay busy waits in the yard.", "A rack with no queue, where a truck that finds every bay busy leaves.", "A rack where every truck waits in the yard.", "A rack of one bay, where B and C agree."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course defines this Erlang B for a rack with NO queue, in which a truck that meets every bay busy drives off, and works it out for IBAFO as 0.270685. rackQueue runs the M/M/c queue instead and reports its Erlang C, 0.787753.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What rack does the derived Erlang B of 0.270685 describe?', options = '["The IBAFO rack as it runs, where a truck that finds every bay busy waits in the yard.", "A rack with no queue, where a truck that finds every bay busy leaves.", "A rack where every truck waits in the yard.", "A rack of one bay, where B and C agree."]'::jsonb, explanation = 'The course defines this Erlang B for a rack with NO queue, in which a truck that meets every bay busy drives off, and works it out for IBAFO as 0.270685. rackQueue runs the M/M/c queue instead and reports its Erlang C, 0.787753.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 9
  select case
           when prompt = 'The load minutes are swept at 9 arrivals an hour on 4 bays. At 20 minutes a load, which figure is rackQueue''s probability of waiting?' and options = '["0.206107", "0.750000", "0.509434", "0.642160"]'::jsonb and answer_index = 2 and explanation is not distinct from 'At 20 minutes the engine''s Erlang C is 0.509434. The 0.206107 is the Erlang B the digest derives from that Erlang C, 0.750000 is the utilisation, and 0.642160 is the probability of waiting at 22 minutes a load.' then 'old'
           when prompt = 'The load minutes are swept at 9 arrivals an hour on 4 bays. At 20 minutes a load, which figure is rackQueue''s probability of waiting?' and options = '["0.206107", "0.750000", "0.509434", "0.642160"]'::jsonb and answer_index = 2 and explanation is not distinct from 'At 20 minutes the engine''s Erlang C is 0.509434. The 0.206107 is the Erlang B the course derives from that Erlang C, 0.750000 is the utilisation, and 0.642160 is the probability of waiting at 22 minutes a load.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The load minutes are swept at 9 arrivals an hour on 4 bays. At 20 minutes a load, which figure is rackQueue''s probability of waiting?', options = '["0.206107", "0.750000", "0.509434", "0.642160"]'::jsonb, explanation = 'At 20 minutes the engine''s Erlang C is 0.509434. The 0.206107 is the Erlang B the course derives from that Erlang C, 0.750000 is the utilisation, and 0.642160 is the probability of waiting at 22 minutes a load.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 14
  select case
           when prompt = 'The engine counts 216 trucks a day at IBAFO''s arrival rate. What is that count?' and options = '["The trucks the 4 bays can load in a day before the rack stops being stable.", "The trucks that load without waiting, the day''s share not caught by the Erlang C.", "The trucks a day at the rack''s mean arrival rate of 9 an hour.", "The day''s liftings in trucks, the divisor the tank farm uses for days of cover."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest labels it trucks per day at this arrival rate, and the rate is 9 arrivals an hour. The bays do not enter it, and neither does the probability of waiting. The tank farm divides by its daily throughput in m3, 2640.000 m3.' then 'old'
           when prompt = 'The engine counts 216 trucks a day at IBAFO''s arrival rate. What is that count?' and options = '["The trucks the 4 bays can load in a day before the rack stops being stable.", "The trucks that load without waiting, the day''s share not caught by the Erlang C.", "The trucks a day at the rack''s mean arrival rate of 9 an hour.", "The day''s liftings in trucks, the divisor the tank farm uses for days of cover."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course labels it trucks per day at this arrival rate, and the rate is 9 arrivals an hour. The bays do not enter it, and neither does the probability of waiting. The tank farm divides by its daily throughput in m3, 2640.000 m3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine counts 216 trucks a day at IBAFO''s arrival rate. What is that count?', options = '["The trucks the 4 bays can load in a day before the rack stops being stable.", "The trucks that load without waiting, the day''s share not caught by the Erlang C.", "The trucks a day at the rack''s mean arrival rate of 9 an hour.", "The day''s liftings in trucks, the divisor the tank farm uses for days of cover."]'::jsonb, explanation = 'The course labels it trucks per day at this arrival rate, and the rate is 9 arrivals an hour. The bays do not enter it, and neither does the probability of waiting. The tank farm divides by its daily throughput in m3, 2640.000 m3.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-loading-rack-as-a-queue ord 15
  select case
           when prompt = 'A depot turns trucks away at its gate when every bay is busy. Why note that beside rackQueue''s probability of waiting?' and options = '["rackQueue models an M/M/c queue, and the no-queue Erlang B is not exported.", "The engine then switches to Erlang B and prints the blocking probability instead.", "rackQueue counts the turned away trucks in its mean queue length of 7.0898.", "The printed probability counts the turned away trucks twice, once at the gate and once queued."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine''s figure is the Erlang C of an M/M/c queue, 0.787753, in which a truck that finds every bay busy waits. The digest works the no-queue Erlang B, 0.270685, out of it by an identity, and the engine exports none. Little''s law gives its queue length of 7.0898 from the arrivals and the mean wait.' then 'old'
           when prompt = 'A depot turns trucks away at its gate when every bay is busy. Why note that beside rackQueue''s probability of waiting?' and options = '["rackQueue models an M/M/c queue, and the no-queue Erlang B is not exported.", "The engine then switches to Erlang B and prints the blocking probability instead.", "rackQueue counts the turned away trucks in its mean queue length of 7.0898.", "The printed probability counts the turned away trucks twice, once at the gate and once queued."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine''s figure is the Erlang C of an M/M/c queue, 0.787753, in which a truck that finds every bay busy waits. The course works the no-queue Erlang B, 0.270685, out of it by an identity, and the engine exports none. Little''s law gives its queue length of 7.0898 from the arrivals and the mean wait.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m01-the-loading-rack-as-a-queue ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A depot turns trucks away at its gate when every bay is busy. Why note that beside rackQueue''s probability of waiting?', options = '["rackQueue models an M/M/c queue, and the no-queue Erlang B is not exported.", "The engine then switches to Erlang B and prints the blocking probability instead.", "rackQueue counts the turned away trucks in its mean queue length of 7.0898.", "The printed probability counts the turned away trucks twice, once at the gate and once queued."]'::jsonb, explanation = 'The engine''s figure is the Erlang C of an M/M/c queue, 0.787753, in which a truck that finds every bay busy waits. The course works the no-queue Erlang B, 0.270685, out of it by an identity, and the engine exports none. Little''s law gives its queue length of 7.0898 from the arrivals and the mean wait.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-loading-rack-as-a-queue' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m01-the-loading-rack-as-a-queue ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 1
  select case
           when prompt = 'rackQueue''s mean wait = Erlang C / (bays x service rate - arrivals). Which printed IBAFO figure is its numerator?' and options = '["The utilisation, 0.900000.", "The probability of waiting, 0.787753.", "The Erlang B worked out from it, 0.270685.", "The offered load of the traffic, 3.6000 erlangs."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The IBAFO table prints the probability of waiting as Erlang C, 0.787753, and the mean wait formula divides that Erlang C. 0.900000 is the utilisation and 3.6000 erlangs the offered load. 0.270685 is the Erlang B the digest works out from the Erlang C, and the engine does not export it.' then 'old'
           when prompt = 'rackQueue''s mean wait = Erlang C / (bays x service rate - arrivals). Which printed IBAFO figure is its numerator?' and options = '["The utilisation, 0.900000.", "The probability of waiting, 0.787753.", "The Erlang B worked out from it, 0.270685.", "The offered load of the traffic, 3.6000 erlangs."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The IBAFO table prints the probability of waiting as Erlang C, 0.787753, and the mean wait formula divides that Erlang C. 0.900000 is the utilisation and 3.6000 erlangs the offered load. 0.270685 is the Erlang B the course works out from the Erlang C, and the engine does not export it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'rackQueue''s mean wait = Erlang C / (bays x service rate - arrivals). Which printed IBAFO figure is its numerator?', options = '["The utilisation, 0.900000.", "The probability of waiting, 0.787753.", "The Erlang B worked out from it, 0.270685.", "The offered load of the traffic, 3.6000 erlangs."]'::jsonb, explanation = 'The IBAFO table prints the probability of waiting as Erlang C, 0.787753, and the mean wait formula divides that Erlang C. 0.900000 is the utilisation and 3.6000 erlangs the offered load. 0.270685 is the Erlang B the course works out from the Erlang C, and the engine does not export it.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 2
  select case
           when prompt = 'IBAFO''s mean wait is 47.2652 minutes. Which trucks is that figure averaged over?' and options = '["Only the trucks that queue, since a truck that finds a free bay has no wait to record.", "The trucks that queue in the peak hour, the only hour the rack is ever full.", "The trucks on the bays and in the yard together, the whole visit of each one.", "Every arriving truck, the ones that load at once counted as zero."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest says the engine''s averageWaitMinutes averages over every truck, the ones that load at once included. The mean wait of a truck that does queue, 47.2652 / 0.787753 = 60.0000 minutes, is worked out in the digest. The mean time on site is a separate row of the table.' then 'old'
           when prompt = 'IBAFO''s mean wait is 47.2652 minutes. Which trucks is that figure averaged over?' and options = '["Only the trucks that queue, since a truck that finds a free bay has no wait to record.", "The trucks that queue in the peak hour, the only hour the rack is ever full.", "The trucks on the bays and in the yard together, the whole visit of each one.", "Every arriving truck, the ones that load at once counted as zero."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course says the engine''s averageWaitMinutes averages over every truck, the ones that load at once included. The mean wait of a truck that does queue, 47.2652 / 0.787753 = 60.0000 minutes, is worked out in the course. The mean time on site is a separate row of the table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s mean wait is 47.2652 minutes. Which trucks is that figure averaged over?', options = '["Only the trucks that queue, since a truck that finds a free bay has no wait to record.", "The trucks that queue in the peak hour, the only hour the rack is ever full.", "The trucks on the bays and in the yard together, the whole visit of each one.", "Every arriving truck, the ones that load at once counted as zero."]'::jsonb, explanation = 'The course says the engine''s averageWaitMinutes averages over every truck, the ones that load at once included. The mean wait of a truck that does queue, 47.2652 / 0.787753 = 60.0000 minutes, is worked out in the course. The mean time on site is a separate row of the table.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 3
  select case
           when prompt = 'A driver who queued asks what the average wait is for trucks that actually queue at IBAFO. Which figure does the digest give, worked out from the engine''s figures?' and options = '["60.0000 minutes, the mean wait over the probability of waiting.", "47.2652 minutes, the engine''s averageWaitMinutes.", "7.0353 minutes, the 5 bay wait.", "24 minutes, the mean time on the bay."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints 47.2652 / 0.787753 = 60.0000 minutes and labels it as worked out from the engine''s figures. The engine''s 47.2652 averages over every truck; dividing by the probability of waiting leaves the average over the trucks that queue.' then 'old'
           when prompt = 'A driver who queued asks what the average wait is for trucks that actually queue at IBAFO. Which figure does the course give, worked out from the engine''s figures?' and options = '["60.0000 minutes, the mean wait over the probability of waiting.", "47.2652 minutes, the engine''s averageWaitMinutes.", "7.0353 minutes, the 5 bay wait.", "24 minutes, the mean time on the bay."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints 47.2652 / 0.787753 = 60.0000 minutes and labels it as worked out from the engine''s figures. The engine''s 47.2652 averages over every truck; dividing by the probability of waiting leaves the average over the trucks that queue.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A driver who queued asks what the average wait is for trucks that actually queue at IBAFO. Which figure does the course give, worked out from the engine''s figures?', options = '["60.0000 minutes, the mean wait over the probability of waiting.", "47.2652 minutes, the engine''s averageWaitMinutes.", "7.0353 minutes, the 5 bay wait.", "24 minutes, the mean time on the bay."]'::jsonb, explanation = 'The course prints 47.2652 / 0.787753 = 60.0000 minutes and labels it as worked out from the engine''s figures. The engine''s 47.2652 averages over every truck; dividing by the probability of waiting leaves the average over the trucks that queue.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 5
  select case
           when prompt = 'The digest checks the queue length by Little''s law: 9 x 47.2652 / 60 = 7.0898. Why is the division by 60 there?' and options = '["It turns 9 arrivals an hour into arrivals a minute for each bay.", "It spreads the queue over a bay''s hour.", "It converts the load time to a rate.", "It turns the wait from minutes into hours."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Little''s law reads queue length = arrivals per hour x mean wait in hours. The arrivals are per hour, the wait prints in minutes, so the wait is divided by 60 to match. The result agrees with the engine''s own queue length of 7.0898 trucks.' then 'old'
           when prompt = 'The course checks the queue length by Little''s law: 9 x 47.2652 / 60 = 7.0898. Why is the division by 60 there?' and options = '["It turns 9 arrivals an hour into arrivals a minute for each bay.", "It spreads the queue over a bay''s hour.", "It converts the load time to a rate.", "It turns the wait from minutes into hours."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Little''s law reads queue length = arrivals per hour x mean wait in hours. The arrivals are per hour, the wait prints in minutes, so the wait is divided by 60 to match. The result agrees with the engine''s own queue length of 7.0898 trucks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course checks the queue length by Little''s law: 9 x 47.2652 / 60 = 7.0898. Why is the division by 60 there?', options = '["It turns 9 arrivals an hour into arrivals a minute for each bay.", "It spreads the queue over a bay''s hour.", "It converts the load time to a rate.", "It turns the wait from minutes into hours."]'::jsonb, explanation = 'Little''s law reads queue length = arrivals per hour x mean wait in hours. The arrivals are per hour, the wait prints in minutes, so the wait is divided by 60 to match. The result agrees with the engine''s own queue length of 7.0898 trucks.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 6
  select case
           when prompt = 'What does IBAFO''s mean queue length of 7.0898 trucks count?' and options = '["Trucks waiting and trucks on the bays, on average.", "Trucks waiting for a bay, on average.", "The most trucks the yard holds at the busiest moment.", "Trucks waiting for a bay in the peak hour alone."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest reaches 7.0898 by Little''s law from the mean wait: 9 x 47.2652 / 60, the arrivals times the wait in hours. The time on the bay is not in that line. The figure is a mean queue length, so it is no maximum, and rackQueue has no peak hour.' then 'old'
           when prompt = 'What does IBAFO''s mean queue length of 7.0898 trucks count?' and options = '["Trucks waiting and trucks on the bays, on average.", "Trucks waiting for a bay, on average.", "The most trucks the yard holds at the busiest moment.", "Trucks waiting for a bay in the peak hour alone."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course reaches 7.0898 by Little''s law from the mean wait: 9 x 47.2652 / 60, the arrivals times the wait in hours. The time on the bay is not in that line. The figure is a mean queue length, so it is no maximum, and rackQueue has no peak hour.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does IBAFO''s mean queue length of 7.0898 trucks count?', options = '["Trucks waiting and trucks on the bays, on average.", "Trucks waiting for a bay, on average.", "The most trucks the yard holds at the busiest moment.", "Trucks waiting for a bay in the peak hour alone."]'::jsonb, explanation = 'The course reaches 7.0898 by Little''s law from the mean wait: 9 x 47.2652 / 60, the arrivals times the wait in hours. The time on the bay is not in that line. The figure is a mean queue length, so it is no maximum, and rackQueue has no peak hour.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-waiting-time-and-a-full-rack ord 15
  select case
           when prompt = 'Why does the digest print the Little''s law line beside the engine''s queue length?' and options = '["It shows the yard never holds more than 7.0898 trucks at any moment.", "It derives the Erlang B of the rack from the engine''s queue length.", "It reaches the engine''s 7.0898 a second way, from the arrivals and the mean wait.", "It replaces the engine''s figure, which the Erlang recursion cannot form."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints Little''s law, queue length = arrivals per hour x mean wait in hours: 9 x 47.2652 / 60 = 7.0898, and beside it the engine''s queue length, 7.0898. The Erlang B is worked out from the Erlang C, and a mean queue is no maximum.' then 'old'
           when prompt = 'Why does the course print the Little''s law line beside the engine''s queue length?' and options = '["It shows the yard never holds more than 7.0898 trucks at any moment.", "It derives the Erlang B of the rack from the engine''s queue length.", "It reaches the engine''s 7.0898 a second way, from the arrivals and the mean wait.", "It replaces the engine''s figure, which the Erlang recursion cannot form."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints Little''s law, queue length = arrivals per hour x mean wait in hours: 9 x 47.2652 / 60 = 7.0898, and beside it the engine''s queue length, 7.0898. The Erlang B is worked out from the Erlang C, and a mean queue is no maximum.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m02-waiting-time-and-a-full-rack ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does the course print the Little''s law line beside the engine''s queue length?', options = '["It shows the yard never holds more than 7.0898 trucks at any moment.", "It derives the Erlang B of the rack from the engine''s queue length.", "It reaches the engine''s 7.0898 a second way, from the arrivals and the mean wait.", "It replaces the engine''s figure, which the Erlang recursion cannot form."]'::jsonb, explanation = 'The course prints Little''s law, queue length = arrivals per hour x mean wait in hours: 9 x 47.2652 / 60 = 7.0898, and beside it the engine''s queue length, 7.0898. The Erlang B is worked out from the Erlang C, and a mean queue is no maximum.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-waiting-time-and-a-full-rack' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m02-waiting-time-and-a-full-rack ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-tank-farm ord 5
  select case
           when prompt = 'The digest prints the farm''s stock less the farm''s heel as 10077.700 m3 and says it is not pumpable stock. What is wrong with it?' and options = '["It counts IB-T2''s 164.700 m3 as pumpable, since the whole stock is netted in one step.", "It fills IB-T2''s heel shortfall with product from the other tanks.", "It takes the heel off twice, once per tank and once again for the farm.", "It leaves the heel of IB-T4 out, since kerosene is netted apart from petrol."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Netting across the farm lets IB-T2''s missing heel volume be made good from other tanks'' product. In the digest''s words, "no pump lends one tank''s volume to another''s heel". Counted tank by tank the pumpable stock is 10123.000 m3.' then 'old'
           when prompt = 'The course prints the farm''s stock less the farm''s heel as 10077.700 m3 and says it is not pumpable stock. What is wrong with it?' and options = '["It counts IB-T2''s 164.700 m3 as pumpable, since the whole stock is netted in one step.", "It fills IB-T2''s heel shortfall with product from the other tanks.", "It takes the heel off twice, once per tank and once again for the farm.", "It leaves the heel of IB-T4 out, since kerosene is netted apart from petrol."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Netting across the farm lets IB-T2''s missing heel volume be made good from other tanks'' product. In the course''s words, "no pump lends one tank''s volume to another''s heel". Counted tank by tank the pumpable stock is 10123.000 m3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-tank-farm' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m03-the-tank-farm ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m03-the-tank-farm ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the farm''s stock less the farm''s heel as 10077.700 m3 and says it is not pumpable stock. What is wrong with it?', options = '["It counts IB-T2''s 164.700 m3 as pumpable, since the whole stock is netted in one step.", "It fills IB-T2''s heel shortfall with product from the other tanks.", "It takes the heel off twice, once per tank and once again for the farm.", "It leaves the heel of IB-T4 out, since kerosene is netted apart from petrol."]'::jsonb, explanation = 'Netting across the farm lets IB-T2''s missing heel volume be made good from other tanks'' product. In the course''s words, "no pump lends one tank''s volume to another''s heel". Counted tank by tank the pumpable stock is 10123.000 m3.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-tank-farm' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m03-the-tank-farm ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-tank-farm ord 11
  select case
           when prompt = 'IB-T2 holds 164.700 m3 in a 7500.000 m3 tank. How does its ullage of 7335.300 m3 enter the farm''s 11767.300 m3?' and options = '["It is left out, since IB-T2 sits below its heel.", "It enters less IB-T2''s heel of 210.000 m3.", "It enters as IB-T2''s capacity less its heel.", "As IB-T2''s capacity less its stock, summed with the other tanks."]'::jsonb and answer_index = 3 and explanation is not distinct from 'IB-T2''s row prints capacity 7500.000 m3, stock 164.700 m3 and ullage 7335.300 m3, and the digest counts the farm''s ullage as each tank''s capacity less its stock, never below zero, summed over the tanks. The heel appears in no part of that count.' then 'old'
           when prompt = 'IB-T2 holds 164.700 m3 in a 7500.000 m3 tank. How does its ullage of 7335.300 m3 enter the farm''s 11767.300 m3?' and options = '["It is left out, since IB-T2 sits below its heel.", "It enters less IB-T2''s heel of 210.000 m3.", "It enters as IB-T2''s capacity less its heel.", "As IB-T2''s capacity less its stock, summed with the other tanks."]'::jsonb and answer_index = 3 and explanation is not distinct from 'IB-T2''s row prints capacity 7500.000 m3, stock 164.700 m3 and ullage 7335.300 m3, and the course counts the farm''s ullage as each tank''s capacity less its stock, never below zero, summed over the tanks. The heel appears in no part of that count.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-tank-farm' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m03-the-tank-farm ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m03-the-tank-farm ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IB-T2 holds 164.700 m3 in a 7500.000 m3 tank. How does its ullage of 7335.300 m3 enter the farm''s 11767.300 m3?', options = '["It is left out, since IB-T2 sits below its heel.", "It enters less IB-T2''s heel of 210.000 m3.", "It enters as IB-T2''s capacity less its heel.", "As IB-T2''s capacity less its stock, summed with the other tanks."]'::jsonb, explanation = 'IB-T2''s row prints capacity 7500.000 m3, stock 164.700 m3 and ullage 7335.300 m3, and the course counts the farm''s ullage as each tank''s capacity less its stock, never below zero, summed over the tanks. The heel appears in no part of that count.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-tank-farm' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m03-the-tank-farm ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-throughput-economics ord 10
  select case
           when prompt = 'What is the 850 kg CO2e a tonne factor used in the IBAFO carbon ledger?' and options = '["The engine''s shipped default for petrol.", "A synthetic factor invented for the course.", "A published factor for petrol, quoted here for the arithmetic.", "The PRODUCT_REFERENCE value the engine reads when none is typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine ships no emission factor. The digest labels 850 kg CO2e a tonne SYNTHETIC, invented for this course and not a published figure. It exists only to show the arithmetic.' then 'old'
           when prompt = 'What is the 850 kg CO2e a tonne factor used in the IBAFO carbon ledger?' and options = '["The engine''s shipped default for petrol.", "A synthetic factor invented for the course.", "A published factor for petrol, quoted here for the arithmetic.", "The PRODUCT_REFERENCE value the engine reads when none is typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine ships no emission factor. The course labels 850 kg CO2e a tonne SYNTHETIC, invented for this course and not a published figure. It exists only to show the arithmetic.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-throughput-economics' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for intermediate m04-throughput-economics ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: intermediate m04-throughput-economics ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What is the 850 kg CO2e a tonne factor used in the IBAFO carbon ledger?', options = '["The engine''s shipped default for petrol.", "A synthetic factor invented for the course.", "A published factor for petrol, quoted here for the arithmetic.", "The PRODUCT_REFERENCE value the engine reads when none is typed."]'::jsonb, explanation = 'The engine ships no emission factor. The course labels 850 kg CO2e a tonne SYNTHETIC, invented for this course and not a published figure. It exists only to show the arithmetic.'
     where app_slug = 'supply' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-throughput-economics' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: intermediate m04-throughput-economics ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 3
  select case
           when prompt = 'Ocean freight typed as a percent of C&F is refused on the invented BADAGRY walk. Which other entry does the digest show refused with the same sentence?' and options = '["A charge with the stage \"customs\".", "Insurance on CIF at 100 percent.", "Import duty typed as a percent of CIF.", "Ocean freight typed as a percent of CIF."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Freight on C&F and freight on CIF both read "Ocean freight is a percentage of a value that is not formed until after freight." A customs stage and CIF insurance at 100 percent have sentences of their own, and duty on CIF is the rate BADAGRY prices at 5.75 percent.' then 'old'
           when prompt = 'Ocean freight typed as a percent of C&F is refused on the invented BADAGRY walk. Which other entry does the course show refused with the same sentence?' and options = '["A charge with the stage \"customs\".", "Insurance on CIF at 100 percent.", "Import duty typed as a percent of CIF.", "Ocean freight typed as a percent of CIF."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Freight on C&F and freight on CIF both read "Ocean freight is a percentage of a value that is not formed until after freight." A customs stage and CIF insurance at 100 percent have sentences of their own, and duty on CIF is the rate BADAGRY prices at 5.75 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Ocean freight typed as a percent of C&F is refused on the invented BADAGRY walk. Which other entry does the course show refused with the same sentence?', options = '["A charge with the stage \"customs\".", "Insurance on CIF at 100 percent.", "Import duty typed as a percent of CIF.", "Ocean freight typed as a percent of CIF."]'::jsonb, explanation = 'Freight on C&F and freight on CIF both read "Ocean freight is a percentage of a value that is not formed until after freight." A customs stage and CIF insurance at 100 percent have sentences of their own, and duty on CIF is the rate BADAGRY prices at 5.75 percent.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 29
  select case
           when prompt = 'cargoQuantities refuses the unit "kg" and landedCost refuses the stage "customs". What do the two refusals share?' and options = '["Both are forward references to a value the walk has not formed, so both carry the same sentence.", "Each names a label the engine does not know and refuses the call.", "Both are density errors, since kilograms and customs charges are each formed from a volume.", "Both are read as zero and named, so the answer is labelled a floor until the label is fixed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints REFUSED: Unknown quantity unit "kg". for cargoQuantities and REFUSED: Customs processing has an unknown stage "customs". for landedCost. Neither returns a figure, and neither is a forward reference or a floor.' then 'old'
           when prompt = 'cargoQuantities refuses the unit "kg" and landedCost refuses the stage "customs". What do the two refusals share?' and options = '["Both are forward references to a value the walk has not formed, so both carry the same sentence.", "Each names a label the engine does not know and refuses the call.", "Both are density errors, since kilograms and customs charges are each formed from a volume.", "Both are read as zero and named, so the answer is labelled a floor until the label is fixed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns REFUSED: Unknown quantity unit "kg". for cargoQuantities and REFUSED: Customs processing has an unknown stage "customs". for landedCost. Neither returns a figure, and neither is a forward reference or a floor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'cargoQuantities refuses the unit "kg" and landedCost refuses the stage "customs". What do the two refusals share?', options = '["Both are forward references to a value the walk has not formed, so both carry the same sentence.", "Each names a label the engine does not know and refuses the call.", "Both are density errors, since kilograms and customs charges are each formed from a volume.", "Both are read as zero and named, so the answer is labelled a floor until the label is fixed."]'::jsonb, explanation = 'The engine returns REFUSED: Unknown quantity unit "kg". for cargoQuantities and REFUSED: Customs processing has an unknown stage "customs". for landedCost. Neither returns a figure, and neither is a forward reference or a floor.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-one-cargo-every-way ord 2
  select case
           when prompt = 'The invented BADAGRY cargo is entered as 34000 with the unit typed as kg and its density of 742.8 kg/m3 given. Which answer does cargoQuantities give?' and options = '["REFUSED: Unknown quantity unit \"kg\".", "A cargo of 34000 tonnes, because the engine maps a mass unit it does not list to the nearest mass unit it does.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Cargo quantity is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints this row as REFUSED: Unknown quantity unit "kg". The cargo table converts entries in tonne, m3, litre and bbl, and kg is none of them, so the row returns no figure.' then 'old'
           when prompt = 'The invented BADAGRY cargo is entered as 34000 with the unit typed as kg and its density of 742.8 kg/m3 given. Which answer does cargoQuantities give?' and options = '["REFUSED: Unknown quantity unit \"kg\".", "A cargo of 34000 tonnes, because the engine maps a mass unit it does not list to the nearest mass unit it does.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Cargo quantity is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints this row as REFUSED: Unknown quantity unit "kg". The cargo table converts entries in tonne, m3, litre and bbl, and kg is none of them, so the row returns no figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-cargo-every-way' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m01-one-cargo-every-way ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m01-one-cargo-every-way ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented BADAGRY cargo is entered as 34000 with the unit typed as kg and its density of 742.8 kg/m3 given. Which answer does cargoQuantities give?', options = '["REFUSED: Unknown quantity unit \"kg\".", "A cargo of 34000 tonnes, because the engine maps a mass unit it does not list to the nearest mass unit it does.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Cargo quantity is required."]'::jsonb, explanation = 'The course prints this row as REFUSED: Unknown quantity unit "kg". The cargo table converts entries in tonne, m3, litre and bbl, and kg is none of them, so the row returns no figure.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-cargo-every-way' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m01-one-cargo-every-way ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-one-cargo-every-way ord 3
  select case
           when prompt = 'A quantity of zero is put to cargoQuantities with a valid unit and the density of 742.8 kg/m3. What comes back?' and options = '["An empty cargo in every unit, since a zero quantity is still a quantity the rules can convert.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Unknown quantity unit \"kg\".", "REFUSED: Cargo quantity is required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the zero quantity case as the refusal "Cargo quantity is required." The engine forms no volume for a cargo it has not been given.' then 'old'
           when prompt = 'A quantity of zero is put to cargoQuantities with a valid unit and the density of 742.8 kg/m3. What comes back?' and options = '["An empty cargo in every unit, since a zero quantity is still a quantity the rules can convert.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Unknown quantity unit \"kg\".", "REFUSED: Cargo quantity is required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine answers the zero quantity case with the refusal "Cargo quantity is required." The engine forms no volume for a cargo it has not been given.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-cargo-every-way' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m01-one-cargo-every-way ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m01-one-cargo-every-way ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A quantity of zero is put to cargoQuantities with a valid unit and the density of 742.8 kg/m3. What comes back?', options = '["An empty cargo in every unit, since a zero quantity is still a quantity the rules can convert.", "REFUSED: Density is required to convert between mass and volume; it is not assumed.", "REFUSED: Unknown quantity unit \"kg\".", "REFUSED: Cargo quantity is required."]'::jsonb, explanation = 'The engine answers the zero quantity case with the refusal "Cargo quantity is required." The engine forms no volume for a cargo it has not been given.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-cargo-every-way' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m01-one-cargo-every-way ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-landed-cost-walk ord 13
  select case
           when prompt = 'The digest prints 26513943.86 - 24774210.79 = 1739733.07 USD for BADAGRY, every rate invented. Which lines does the floor build leave out of its total?' and options = '["The invented import duty and the invented financing line, both percents of CIF.", "The invented port and jetty lines, both levied on the bill-of-lading quantity of the cargo.", "The invented insurance and freight lines, both formed before CIF is frozen.", "The invented storage and demurrage lines, both booked at the landed stage."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The floor build is the one with the duty and financing rates blank. The full build prints them at 1399086.04 and 340647.04 USD, and the floor names both as missing.' then 'old'
           when prompt = 'The course prints 26513943.86 - 24774210.79 = 1739733.07 USD for BADAGRY, every rate invented. Which lines does the floor build leave out of its total?' and options = '["The invented import duty and the invented financing line, both percents of CIF.", "The invented port and jetty lines, both levied on the bill-of-lading quantity of the cargo.", "The invented insurance and freight lines, both formed before CIF is frozen.", "The invented storage and demurrage lines, both booked at the landed stage."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The floor build is the one with the duty and financing rates blank. The full build prints them at 1399086.04 and 340647.04 USD, and the floor names both as missing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-landed-cost-walk' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m02-the-landed-cost-walk ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m02-the-landed-cost-walk ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints 26513943.86 - 24774210.79 = 1739733.07 USD for BADAGRY, every rate invented. Which lines does the floor build leave out of its total?', options = '["The invented import duty and the invented financing line, both percents of CIF.", "The invented port and jetty lines, both levied on the bill-of-lading quantity of the cargo.", "The invented insurance and freight lines, both formed before CIF is frozen.", "The invented storage and demurrage lines, both booked at the landed stage."]'::jsonb, explanation = 'The floor build is the one with the duty and financing rates blank. The full build prints them at 1399086.04 and 340647.04 USD, and the floor names both as missing.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-landed-cost-walk' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m02-the-landed-cost-walk ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-ocean-loss-and-the-litre-sold ord 4
  select case
           when prompt = 'The digest''s rule for the ocean loss reads "The loss divides the cost." Which reading of BADAGRY does that statement rule out?' and options = '["Spreading the total over the litres that arrived.", "Adding the loss to the build-up as a charge in dollars.", "Holding the landed total the same on every row of the sweep.", "Charging port on the 34000 bill-of-lading tonnes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The importer pays for the bill-of-lading quantity and sells the outturn. The loss divides the cost: the landed total stays at 26513943.86 USD and the litres it is spread over fall, so the loss is never a charge in the build-up.' then 'old'
           when prompt = 'The course''s rule for the ocean loss reads "The loss divides the cost." Which reading of BADAGRY does that statement rule out?' and options = '["Spreading the total over the litres that arrived.", "Adding the loss to the build-up as a charge in dollars.", "Holding the landed total the same on every row of the sweep.", "Charging port on the 34000 bill-of-lading tonnes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The importer pays for the bill-of-lading quantity and sells the outturn. The loss divides the cost: the landed total stays at 26513943.86 USD and the litres it is spread over fall, so the loss is never a charge in the build-up.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m03-ocean-loss-and-the-litre-sold ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course''s rule for the ocean loss reads "The loss divides the cost." Which reading of BADAGRY does that statement rule out?', options = '["Spreading the total over the litres that arrived.", "Adding the loss to the build-up as a charge in dollars.", "Holding the landed total the same on every row of the sweep.", "Charging port on the 34000 bill-of-lading tonnes."]'::jsonb, explanation = 'The importer pays for the bill-of-lading quantity and sells the outturn. The loss divides the cost: the landed total stays at 26513943.86 USD and the litres it is spread over fall, so the loss is never a charge in the build-up.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-ocean-loss-and-the-litre-sold ord 8
  select case
           when prompt = 'The invented exchange rate is left out of the BADAGRY call. What does the engine report?' and options = '["A refusal of the whole landed cost.", "The dollar cost a litre sold, with the local figure reported as none.", "The naira figure at 1520.4000, carried over as the last rate the record used.", "Both figures in dollars, the naira column copied from the dollar one."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The dollar cost a litre sold needs no exchange rate. The naira figure is the dollar figure x the exchange rate, and with no exchange rate the digest prints the local figure as none.' then 'old'
           when prompt = 'The invented exchange rate is left out of the BADAGRY call. What does the engine report?' and options = '["A refusal of the whole landed cost.", "The dollar cost a litre sold, with the local figure reported as none.", "The naira figure at 1520.4000, carried over as the last rate the record used.", "Both figures in dollars, the naira column copied from the dollar one."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The dollar cost a litre sold needs no exchange rate. The naira figure is the dollar figure x the exchange rate, and with no exchange rate the engine returns the local figure as none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m03-ocean-loss-and-the-litre-sold ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented exchange rate is left out of the BADAGRY call. What does the engine report?', options = '["A refusal of the whole landed cost.", "The dollar cost a litre sold, with the local figure reported as none.", "The naira figure at 1520.4000, carried over as the last rate the record used.", "Both figures in dollars, the naira column copied from the dollar one."]'::jsonb, explanation = 'The dollar cost a litre sold needs no exchange rate. The naira figure is the dollar figure x the exchange rate, and with no exchange rate the engine returns the local figure as none.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-ocean-loss-and-the-litre-sold ord 12
  select case
           when prompt = 'Why is H1 taught as a limit and never graded?' and options = '["The engine bills the discharge lines on the outturn, and the course prints no outturn figure.", "It is held in the engines repository''s findings: the billing quantity is a contract term the engine does not know.", "The jetty and storage lines are left out of the BADAGRY landed total until the basis is settled.", "The engine refuses the jetty and storage lines until the contract basis is typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest lists H1 among the items held by the engines repository in FINDINGS-supply, taught as limits and never graded. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know, and the engine answers every per-quantity line on the bill of lading.' then 'old'
           when prompt = 'Why is H1 taught as a limit and never graded?' and options = '["The engine bills the discharge lines on the outturn, and the course prints no outturn figure.", "It is held in the engines repository''s findings: the billing quantity is a contract term the engine does not know.", "The jetty and storage lines are left out of the BADAGRY landed total until the basis is settled.", "The engine refuses the jetty and storage lines until the contract basis is typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course lists H1 among the items held by the engines repository in FINDINGS-supply, taught as limits and never graded. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know, and the engine answers every per-quantity line on the bill of lading.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m03-ocean-loss-and-the-litre-sold ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why is H1 taught as a limit and never graded?', options = '["The engine bills the discharge lines on the outturn, and the course prints no outturn figure.", "It is held in the engines repository''s findings: the billing quantity is a contract term the engine does not know.", "The jetty and storage lines are left out of the BADAGRY landed total until the basis is settled.", "The engine refuses the jetty and storage lines until the contract basis is typed."]'::jsonb, explanation = 'The course lists H1 among the items held by the engines repository in FINDINGS-supply, taught as limits and never graded. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know, and the engine answers every per-quantity line on the bill of lading.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-ocean-loss-and-the-litre-sold' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m03-ocean-loss-and-the-litre-sold ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-from-depot-gate-to-nozzle ord 2
  select case
           when prompt = 'The invented value added tax of 6.5 percent is typed as a percent of the landed cost instead of the running total. What does buildPumpPrice report?' and options = '["A pump price of 1074.8249 naira a litre, since a rate that is supplied gives the same amount on any basis.", "A pump price of 1031.3197 naira a litre, labelled a floor because the tax no longer reads the margins.", "A refusal, since percent_of_landed is a basis for the import walk and not a pump price element.", "A pump price of 1066.7292 naira a litre, complete true."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints price 1066.7292 naira a litre for that build and says it is complete true: the basis changes the amount, and every rate is still supplied.' then 'old'
           when prompt = 'The invented value added tax of 6.5 percent is typed as a percent of the landed cost instead of the running total. What does buildPumpPrice report?' and options = '["A pump price of 1074.8249 naira a litre, since a rate that is supplied gives the same amount on any basis.", "A pump price of 1031.3197 naira a litre, labelled a floor because the tax no longer reads the margins.", "A refusal, since percent_of_landed is a basis for the import walk and not a pump price element.", "A pump price of 1066.7292 naira a litre, complete true."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine returns price 1066.7292 naira a litre for that build and says it is complete true: the basis changes the amount, and every rate is still supplied.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-from-depot-gate-to-nozzle' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m04-from-depot-gate-to-nozzle ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m04-from-depot-gate-to-nozzle ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented value added tax of 6.5 percent is typed as a percent of the landed cost instead of the running total. What does buildPumpPrice report?', options = '["A pump price of 1074.8249 naira a litre, since a rate that is supplied gives the same amount on any basis.", "A pump price of 1031.3197 naira a litre, labelled a floor because the tax no longer reads the margins.", "A refusal, since percent_of_landed is a basis for the import walk and not a pump price element.", "A pump price of 1066.7292 naira a litre, complete true."]'::jsonb, explanation = 'The engine returns price 1066.7292 naira a litre for that build and says it is complete true: the basis changes the amount, and every rate is still supplied.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-from-depot-gate-to-nozzle' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m04-from-depot-gate-to-nozzle ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-from-depot-gate-to-nozzle ord 11
  select case
           when prompt = 'marginWaterfall is handed a build-up that the engine refused. What does it return?' and options = '["The refusal buildPumpPrice gives: A landed cost per litre is required.", "Every share reported as none.", "The refusal landedCost gives with no FOB: An FOB price and its basis are required.", "One Unattributed row holding the price."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints marginWaterfall on a refused build-up as REFUSED: A landed cost per litre is required., the sentence buildPumpPrice gives when it has no landed cost.' then 'old'
           when prompt = 'marginWaterfall is handed a build-up that the engine refused. What does it return?' and options = '["The refusal buildPumpPrice gives: A landed cost per litre is required.", "Every share reported as none.", "The refusal landedCost gives with no FOB: An FOB price and its basis are required.", "One Unattributed row holding the price."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine answers marginWaterfall on a refused build-up with REFUSED: A landed cost per litre is required., the sentence buildPumpPrice gives when it has no landed cost.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-from-depot-gate-to-nozzle' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m04-from-depot-gate-to-nozzle ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m04-from-depot-gate-to-nozzle ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'marginWaterfall is handed a build-up that the engine refused. What does it return?', options = '["The refusal buildPumpPrice gives: A landed cost per litre is required.", "Every share reported as none.", "The refusal landedCost gives with no FOB: An FOB price and its basis are required.", "One Unattributed row holding the price."]'::jsonb, explanation = 'The engine answers marginWaterfall on a refused build-up with REFUSED: A landed cost per litre is required., the sentence buildPumpPrice gives when it has no landed cost.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-from-depot-gate-to-nozzle' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m04-from-depot-gate-to-nozzle ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-breaks-the-price ord 4
  select case
           when prompt = 'solveCrossing is handed the invented exchange rate bracket written backwards, 2100 to 1200. Which answer does it give?' and options = '["It swaps the ends and finds 1641.7105.", "REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.", "REFUSED: The search bracket must be a valid interval.", "It halves from the high end and reports none."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints the bracket written backwards, 2100 to 1200, as that refusal, with no breakeven. The same-sign refusal belongs to a valid bracket that holds no crossing, such as 1300 to 1500.' then 'old'
           when prompt = 'solveCrossing is handed the invented exchange rate bracket written backwards, 2100 to 1200. Which answer does it give?' and options = '["It swaps the ends and finds 1641.7105.", "REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.", "REFUSED: The search bracket must be a valid interval.", "It halves from the high end and reports none."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine answers the bracket written backwards, 2100 to 1200, with that refusal, with no breakeven. The same-sign refusal belongs to a valid bracket that holds no crossing, such as 1300 to 1500.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-breaks-the-price' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m05-what-breaks-the-price ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m05-what-breaks-the-price ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'solveCrossing is handed the invented exchange rate bracket written backwards, 2100 to 1200. Which answer does it give?', options = '["It swaps the ends and finds 1641.7105.", "REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.", "REFUSED: The search bracket must be a valid interval.", "It halves from the high end and reports none."]'::jsonb, explanation = 'The engine answers the bracket written backwards, 2100 to 1200, with that refusal, with no breakeven. The same-sign refusal belongs to a valid bracket that holds no crossing, such as 1300 to 1500.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-breaks-the-price' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m05-what-breaks-the-price ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 9
  select case
           when prompt = 'Among the rules the engines keep, IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and their pumpable stock prints as 5078.400 m3. Which rule gives that figure?' and options = '["The pair''s stock less the pair''s heel, taken as one pool.", "Pumpable stock is counted tank by tank, each tank''s stock above its own heel.", "Pumpable stock is corrected to standard volume, while the stock is gross observed.", "A reserve above the heel is held back on every tank before it counts as pumpable."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The rule reads: pumpable stock is counted tank by tank, and the digest measures it on IB-T1 and IB-T2 as 5078.400 m3 of pumpable stock. Each tank''s pumpable stock is its stock above its own heel and never below zero, and no pump lends one tank''s volume to another''s heel.' then 'old'
           when prompt = 'Among the rules the engines keep, IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and their pumpable stock prints as 5078.400 m3. Which rule gives that figure?' and options = '["The pair''s stock less the pair''s heel, taken as one pool.", "Pumpable stock is counted tank by tank, each tank''s stock above its own heel.", "Pumpable stock is corrected to standard volume, while the stock is gross observed.", "A reserve above the heel is held back on every tank before it counts as pumpable."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The rule reads: pumpable stock is counted tank by tank, and the course measures it on IB-T1 and IB-T2 as 5078.400 m3 of pumpable stock. Each tank''s pumpable stock is its stock above its own heel and never below zero, and no pump lends one tank''s volume to another''s heel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m06-the-expert-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m06-the-expert-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Among the rules the engines keep, IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and their pumpable stock prints as 5078.400 m3. Which rule gives that figure?', options = '["The pair''s stock less the pair''s heel, taken as one pool.", "Pumpable stock is counted tank by tank, each tank''s stock above its own heel.", "Pumpable stock is corrected to standard volume, while the stock is gross observed.", "A reserve above the heel is held back on every tank before it counts as pumpable."]'::jsonb, explanation = 'The rule reads: pumpable stock is counted tank by tank, and the course measures it on IB-T1 and IB-T2 as 5078.400 m3 of pumpable stock. Each tank''s pumpable stock is its stock above its own heel and never below zero, and no pump lends one tank''s volume to another''s heel.'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m06-the-expert-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 10
  select case
           when prompt = 'Among the rules the engines keep, which one does the sentence "Arrival rate and load time are both needed." enforce?' and options = '["Bays are a whole number, one or more.", "throughputEconomics needs the throughput and the fee.", "A load time of zero minutes is refused.", "A day is not closed without its opening stock."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest lists the rule "a load time of zero minutes is refused" with that sentence. The bays rule prints "The number of bays must be a whole number, one or more.", the money rule "Throughput and the throughput fee are both needed for the money answer." and the opening stock rule "No opening stock, so the day cannot be closed."' then 'old'
           when prompt = 'Among the rules the engines keep, which one does the sentence "Arrival rate and load time are both needed." enforce?' and options = '["Bays are a whole number, one or more.", "throughputEconomics needs the throughput and the fee.", "A load time of zero minutes is refused.", "A day is not closed without its opening stock."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course lists the rule "a load time of zero minutes is refused" with that sentence. The bays rule prints "The number of bays must be a whole number, one or more.", the money rule "Throughput and the throughput fee are both needed for the money answer." and the opening stock rule "No opening stock, so the day cannot be closed."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, supply refused: no row for advanced m06-the-expert-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, supply refused: advanced m06-the-expert-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Among the rules the engines keep, which one does the sentence "Arrival rate and load time are both needed." enforce?', options = '["Bays are a whole number, one or more.", "throughputEconomics needs the throughput and the fee.", "A load time of zero minutes is refused.", "A day is not closed without its opening stock."]'::jsonb, explanation = 'The course lists the rule "a load time of zero minutes is refused" with that sentence. The bays rule prints "The number of bays must be a whole number, one or more.", the money rule "Throughput and the throughput fee are both needed for the money answer." and the opening stock rule "No opening stock, so the day cannot be closed."'
     where app_slug = 'supply' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, supply refused: advanced m06-the-expert-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'supply';
  if v_total <> 396 then raise exception 'digest-copy recut, supply refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, supply: % of 43 rows updated, the rest already carried the recut text', v_updated;
end $$;
