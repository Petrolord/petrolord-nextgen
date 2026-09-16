-- ============================================================================
-- EC3 RECUT, EXPERT TIER (advanced): Probabilistic Economics
-- (uncertainty) question bank brought to the repaired engines.
--
-- WHY. Engines #182 (with the #187 performance pass, on top of #180) repaired
-- the behaviour this course teaches: the Scenario Builder Monte Carlo now
-- scales variable opex with the production it draws, the screening IRR says
-- why it is missing instead of reporting its 1000 percent Newton clamp, and a
-- tornado bar with an unreachable side is marked rather than collapsed to
-- zero. The live bank was cut against the retired engine, so its moved values
-- are wrong and some of its keyed answers assert a rule that no longer holds.
--
-- WHAT MOVES. 89 of the 132 Expert questions, 64 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to
-- change, the new correct text was written at the SAME index, so the key
-- balance and key pattern of every bank are untouched. No ord, no module key,
-- no scope and no row count moves.
-- Fields rewritten: 53 prompts, 201 options, 79 explanations.
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and the tier must still hold
-- 132 questions at the end.
--
-- Every published string below was read from the LIVE production row, not
-- retyped: see docs/ec3-recut/RECUT-advanced.json, whose OLD text was verified
-- character for character against the live table before this file was
-- generated. Generator: scratchpad ec3r/gen_recut.py.
--
-- SAFE TO RE-RUN. A second run finds every row already carrying the recut
-- text and updates nothing.
-- ============================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
begin

  -- ec3a_m01 ord 1: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Scenario Builder run at seed 20260829 prints a Low case of 48.7439 million USD under the label P90. Read with the Suite''s definition sentence, what does that label claim?' and options = '["That 90 percent of the 1000 sampled NPVs fall below 48.7439 million USD, the way a 90th percentile is read in ordinary arithmetic.", "That 90 percent of the 1000 sampled NPVs meet or exceed 48.7439 million USD, which is why P90 is the smallest of the three cases.", "That 48.7439 million USD is a floor for the field: with 90 percent confidence no sampled iteration returns an NPV below it.", "That the deterministic NPV of 81.0464 million USD has a 90 percent chance of landing above 48.7439 million USD once drilled."]'::jsonb and answer_index = 1 and explanation = 'The definition reads "P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS." It is no floor: the lowest of the 1000 NPVs is 16.3054.' then 'old'
           when prompt = 'ISIALA''s Scenario Builder run at seed 20260829 prints a Low case of 15.6063 million USD under the label P90. Read with the Suite''s definition sentence, what does that label claim?' and options = '["That 90 percent of the 1000 sampled NPVs fall below 15.6063 million USD, the way a 90th percentile is read in ordinary arithmetic.", "That 90 percent of the 1000 sampled NPVs meet or exceed 15.6063 million USD, which is why P90 is the smallest of the three cases.", "That 15.6063 million USD is a floor for the field: with 90 percent confidence no sampled iteration returns an NPV below it.", "That the deterministic NPV of 81.0464 million USD has a 90 percent chance of landing above 15.6063 million USD once drilled."]'::jsonb and answer_index = 1 and explanation = 'The definition reads "P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS." It is no floor: the lowest of the 1000 NPVs is -46.1564.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Scenario Builder run at seed 20260829 prints a Low case of 15.6063 million USD under the label P90. Read with the Suite''s definition sentence, what does that label claim?', options = '["That 90 percent of the 1000 sampled NPVs fall below 15.6063 million USD, the way a 90th percentile is read in ordinary arithmetic.", "That 90 percent of the 1000 sampled NPVs meet or exceed 15.6063 million USD, which is why P90 is the smallest of the three cases.", "That 15.6063 million USD is a floor for the field: with 90 percent confidence no sampled iteration returns an NPV below it.", "That the deterministic NPV of 81.0464 million USD has a 90 percent chance of landing above 15.6063 million USD once drilled."]'::jsonb, explanation = 'The definition reads "P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS." It is no floor: the lowest of the 1000 NPVs is -46.1564.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 2: option_0, explanation
  select case
           when prompt = 'Which engine key does ISIALA''s Low case card read, and why?' and options = '["The `p90` key, because a P90 label and a `p90` key name the same position in the sorted sample of 1000 NPVs.", "The `p50` key less half the spread, because a Low case is built from the Best case and the width of the run.", "The `p10` key, but only because the panel sorts the NPVs from highest to lowest before it reads any position.", "The `p10` key: the value with 10 percent of the sorted NPVs below it is the value 90 percent of them meet or exceed."]'::jsonb and answer_index = 3 and explanation = 'The engine returns `p10`, `p50` and `p90` as plain percentiles of NPVs sorted low to high, so the Low case P90 reads `p10` at 48.7439 and the High case P10 reads `p90` at 109.8980.' then 'old'
           when prompt = 'Which engine key does ISIALA''s Low case card read, and why?' and options = '["The `p90` key, because a P90 label and a `p90` key name the same position in the sorted sample of 1000 NPVs, so a panel can read the one off the other without consulting the convention.", "The `p50` key less half the spread, because a Low case is built from the Best case and the width of the run.", "The `p10` key, but only because the panel sorts the NPVs from highest to lowest before it reads any position.", "The `p10` key: the value with 10 percent of the sorted NPVs below it is the value 90 percent of them meet or exceed."]'::jsonb and answer_index = 3 and explanation = 'The engine returns `p10`, `p50` and `p90` as plain percentiles of NPVs sorted low to high, so the Low case P90 reads `p10` at 15.6063 and the High case P10 reads `p90` at 152.0653.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which engine key does ISIALA''s Low case card read, and why?', options = '["The `p90` key, because a P90 label and a `p90` key name the same position in the sorted sample of 1000 NPVs, so a panel can read the one off the other without consulting the convention.", "The `p50` key less half the spread, because a Low case is built from the Best case and the width of the run.", "The `p10` key, but only because the panel sorts the NPVs from highest to lowest before it reads any position.", "The `p10` key: the value with 10 percent of the sorted NPVs below it is the value 90 percent of them meet or exceed."]'::jsonb, explanation = 'The engine returns `p10`, `p50` and `p90` as plain percentiles of NPVs sorted low to high, so the Low case P90 reads `p10` at 15.6063 and the High case P10 reads `p90` at 152.0653.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 3: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Before EC3-0, what did the Scenario Builder''s card headed "P90 (Conservative)" show for ISIALA?' and options = '["109.8980 million USD from the `p90` key, a value only 10 percent of the sample meets or exceeds.", "48.7439 million USD from the `p10` key, so the number on the card was cautious and only its word needed changing.", "81.1835 million USD from the `p50` key, because the old panel treated the median as the conservative reading of a run.", "-72.1531 million USD, the scenario Low, which the old panel copied across from generateScenarios into its first card."]'::jsonb and answer_index = 0 and explanation = 'The old panel printed the `p90` key under "P90 (Conservative)" and the `p10` key under "P10 (Optimistic)", so the card called conservative held the larger number, 109.8980.' then 'old'
           when prompt = 'Before EC3-0, which engine key did the Scenario Builder''s card headed "P90 (Conservative)" read, and what does that key hold on ISIALA?' and options = '["The `p90` key, which on ISIALA holds 152.0653 million USD, a value only 10 percent of the sample meets or exceeds.", "The `p10` key, holding 15.6063 million USD, so the number on the card was cautious and only its word needed changing.", "The `p50` key, holding 78.5315 million USD, because the old panel treated the median as the conservative reading of a run.", "No engine key at all: the card held -57.8151 million USD, the scenario Low, copied across from generateScenarios."]'::jsonb and answer_index = 0 and explanation = 'The old panel printed the `p90` key under "P90 (Conservative)" and the `p10` key under "P10 (Optimistic)", so the card called conservative held the larger number. That run was unseeded, so an old slide is not expected to match 152.0653.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Before EC3-0, which engine key did the Scenario Builder''s card headed "P90 (Conservative)" read, and what does that key hold on ISIALA?', options = '["The `p90` key, which on ISIALA holds 152.0653 million USD, a value only 10 percent of the sample meets or exceeds.", "The `p10` key, holding 15.6063 million USD, so the number on the card was cautious and only its word needed changing.", "The `p50` key, holding 78.5315 million USD, because the old panel treated the median as the conservative reading of a run.", "No engine key at all: the card held -57.8151 million USD, the scenario Low, copied across from generateScenarios."]'::jsonb, explanation = 'The old panel printed the `p90` key under "P90 (Conservative)" and the `p10` key under "P10 (Optimistic)", so the card called conservative held the larger number. That run was unseeded, so an old slide is not expected to match 152.0653.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 4: prompt
  select case
           when prompt = 'A report lists ISIALA''s NPV cases as P90 109.8980, P50 81.1835 and P10 48.7439. What does the convention module''s gate helper make of it?' and options = '["It passes the set, because the convention leaves the display order of the three cases to the author.", "It passes the set as a correct listing for a quantity where more is worse, such as a breakeven price, where the labels run the other way.", "It flags the set: under exceedance P90 must be at or below P50, and this P90 is larger, so the keys were printed as labels.", "It passes the set as a reseeded run whose draws happened to reverse the order of the three cases without any error in the labels."]'::jsonb and answer_index = 2 and explanation = 'The helper flags any case set where the P90 exceeds the P50 or the P50 exceeds the P10. A breakeven price takes no P-label at all, so reading the reversed set as a price listing is the second mistake, not a rescue.' then 'old'
           when prompt = 'A report lists ISIALA''s NPV cases as P90 152.0653, P50 78.5315 and P10 15.6063. What does the convention module''s gate helper make of it?' and options = '["It passes the set, because the convention leaves the display order of the three cases to the author.", "It passes the set as a correct listing for a quantity where more is worse, such as a breakeven price, where the labels run the other way.", "It flags the set: under exceedance P90 must be at or below P50, and this P90 is larger, so the keys were printed as labels.", "It passes the set as a reseeded run whose draws happened to reverse the order of the three cases without any error in the labels."]'::jsonb and answer_index = 2 and explanation = 'The helper flags any case set where the P90 exceeds the P50 or the P50 exceeds the P10. A breakeven price takes no P-label at all, so reading the reversed set as a price listing is the second mistake, not a rescue.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A report lists ISIALA''s NPV cases as P90 152.0653, P50 78.5315 and P10 15.6063. What does the convention module''s gate helper make of it?', options = '["It passes the set, because the convention leaves the display order of the three cases to the author.", "It passes the set as a correct listing for a quantity where more is worse, such as a breakeven price, where the labels run the other way.", "It flags the set: under exceedance P90 must be at or below P50, and this P90 is larger, so the keys were printed as labels.", "It passes the set as a reseeded run whose draws happened to reverse the order of the three cases without any error in the labels."]'::jsonb, explanation = 'The helper flags any case set where the P90 exceeds the P50 or the P50 exceeds the P10. A breakeven price takes no P-label at all, so reading the reversed set as a price listing is the second mistake, not a rescue.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 7: prompt, option_0, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A board slide shows ISIALA''s scenario Low of -72.1531 million USD under a P90 heading. What is wrong with it?' and options = '["It is one deterministic corner from generateScenarios, below all 1000 sampled NPVs, while the Low case P90 is 48.7439.", "Nothing: the scenario Low and the Low case P90 are two computations of the same position in the distribution of NPV.", "Only its label: a scenario Low is the pessimistic case, so it should carry P10, the label for the pessimistic end of a run.", "Only a missing seed: it is the Low case at another seed, so it belongs under the P90 heading once that seed is written beside it."]'::jsonb and answer_index = 0 and explanation = 'Under a P90 heading, -72.1531 tells the board there is a 90 percent chance of doing better, yet the lowest sampled NPV is 16.3054 and no iteration came near it. Relabelling it P10 would repeat the swap, since P10 is the High case label.' then 'old'
           when prompt = 'A board slide shows ISIALA''s scenario Low of -57.8151 million USD under a P90 heading. What is wrong with it?' and options = '["It is one deterministic corner from generateScenarios, below all 1000 sampled NPVs, while the Low case P90 is 15.6063.", "Nothing: the scenario Low and the Low case P90 are two computations of the same position in the distribution of NPV.", "Only its label: a scenario Low is the pessimistic case, so it should carry P10, the label for the pessimistic end of a run.", "Only a missing seed: it is the Low case at another seed, so it belongs under the P90 heading once that seed is written beside it."]'::jsonb and answer_index = 0 and explanation = 'Under a P90 heading, -57.8151 tells the board there is a 90 percent chance of doing better, yet the lowest sampled NPV is -46.1564 and no iteration came near it. Relabelling it P10 would repeat the swap, since P10 is the High case label.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A board slide shows ISIALA''s scenario Low of -57.8151 million USD under a P90 heading. What is wrong with it?', options = '["It is one deterministic corner from generateScenarios, below all 1000 sampled NPVs, while the Low case P90 is 15.6063.", "Nothing: the scenario Low and the Low case P90 are two computations of the same position in the distribution of NPV.", "Only its label: a scenario Low is the pessimistic case, so it should carry P10, the label for the pessimistic end of a run.", "Only a missing seed: it is the Low case at another seed, so it belongs under the P90 heading once that seed is written beside it."]'::jsonb, explanation = 'Under a P90 heading, -57.8151 tells the board there is a 90 percent chance of doing better, yet the lowest sampled NPV is -46.1564 and no iteration came near it. Relabelling it P10 would repeat the swap, since P10 is the High case label.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 8: prompt, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Scenario Builder run reports an EMV of 80.1707 million USD beside a Best case P50 of 81.1835. What is the EMV?' and options = '["Another name for the Best case P50, printed from the same sorted position and rounded differently by the panel.", "The median read by the floor rule instead of the averaging rule, which is why it differs from the Best case card.", "The plain mean of the 1000 NPVs, which is not a case, takes no P-label, and sits below both the Best case and the deterministic 81.0464.", "The deterministic NPV recomputed at the sample''s average price, capex and reserves after all 1000 draws are made."]'::jsonb and answer_index = 2 and explanation = 'The EMV averages every NPV and the P50 reads the middle of the sorted sample; the floor rule''s median is 81.1952, above the card rather than below it.' then 'old'
           when prompt = 'ISIALA''s Scenario Builder run reports an EMV of 80.9836 million USD beside a Best case P50 of 78.5315. What is the EMV?' and options = '["Another name for the Best case P50, printed from the same sorted position and rounded differently by the panel.", "The median read by the floor rule instead of the averaging rule, which is why it differs from the Best case card.", "The plain mean of the 1000 NPVs, which is not a case, takes no P-label, and here sits above the Best case and below the deterministic 81.0464.", "The deterministic NPV recomputed at the sample''s average price, capex and reserves after all 1000 draws are made."]'::jsonb and answer_index = 2 and explanation = 'The EMV averages every NPV while the P50 reads the middle of the sorted sample, and it sits above that median because the sampled NPVs lean to the high side. The floor rule''s median is 78.5836, still below the EMV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Scenario Builder run reports an EMV of 80.9836 million USD beside a Best case P50 of 78.5315. What is the EMV?', options = '["Another name for the Best case P50, printed from the same sorted position and rounded differently by the panel.", "The median read by the floor rule instead of the averaging rule, which is why it differs from the Best case card.", "The plain mean of the 1000 NPVs, which is not a case, takes no P-label, and here sits above the Best case and below the deterministic 81.0464.", "The deterministic NPV recomputed at the sample''s average price, capex and reserves after all 1000 draws are made."]'::jsonb, explanation = 'The EMV averages every NPV while the P50 reads the middle of the sorted sample, and it sits above that median because the sampled NPVs lean to the high side. The floor rule''s median is 78.5836, still below the EMV.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 11: prompt, option_0, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low case P90 of 48.7439 says 90 percent of outcomes meet or exceed it. Ninety percent of what, exactly?' and options = '["Of this model''s 1000 draws, which treat every year and variable as independent and never sample opex, royalty or tax.", "Of every outcome the field could deliver, because the label follows SPE PRMS and PRMS probabilities describe the field itself.", "Of the outcomes across every seed the engine could be run at, since the default seed 20260829 stands in for all of them.", "Of the three generateScenarios corners, as if the P90 weighted the Low, Base and High cases."]'::jsonb and answer_index = 0 and explanation = 'A P90 describes the sample the model drew and nothing more; with no correlation and no opex, royalty or tax uncertainty, 90 percent is conditional on those choices. Seed 43 moves the Best case to 79.0624.' then 'old'
           when prompt = 'ISIALA''s Low case P90 of 15.6063 says 90 percent of outcomes meet or exceed it. Ninety percent of what, exactly?' and options = '["Of this model''s 1000 draws, which give each of three variables one factor an iteration, hold the three independent of one another, and never sample fixed opex, royalty or tax.", "Of every outcome the field could deliver, because the label follows SPE PRMS and PRMS probabilities describe the field itself.", "Of the outcomes across every seed the engine could be run at, since the default seed 20260829 stands in for all of them.", "Of the three generateScenarios corners, as if the P90 weighted the Low, Base and High cases."]'::jsonb and answer_index = 0 and explanation = 'A P90 describes the sample the model drew and nothing more; with no correlation between the three factors and no fixed opex, royalty or tax uncertainty, 90 percent is conditional on those choices. Seed 43 moves the Best case to 80.2233.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low case P90 of 15.6063 says 90 percent of outcomes meet or exceed it. Ninety percent of what, exactly?', options = '["Of this model''s 1000 draws, which give each of three variables one factor an iteration, hold the three independent of one another, and never sample fixed opex, royalty or tax.", "Of every outcome the field could deliver, because the label follows SPE PRMS and PRMS probabilities describe the field itself.", "Of the outcomes across every seed the engine could be run at, since the default seed 20260829 stands in for all of them.", "Of the three generateScenarios corners, as if the P90 weighted the Low, Base and High cases."]'::jsonb, explanation = 'A P90 describes the sample the model drew and nothing more; with no correlation between the three factors and no fixed opex, royalty or tax uncertainty, 90 percent is conditional on those choices. Seed 43 moves the Best case to 80.2233.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 12: option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why did the old Scenario Builder panel look right at a glance even while its two outer cards were swapped?' and options = '["The old panel sorted NPVs from highest to lowest, so the numbers were in the right places and only the words were wrong.", "The old generator was unseeded, so testers never saw the same pair of outer numbers twice and could not compare them.", "The `p50` key is the Best case P50 under either reading, so the middle card showed 81.1835 before and after the repair.", "The swap touched only the Breakeven Analyzer''s cards, which the Scenario Builder does not show beside its three cases."]'::jsonb and answer_index = 2 and explanation = 'Printing a key as a P-label flips `p10` and `p90` but leaves `p50` untouched, and a panel whose middle number is right looks right.' then 'old'
           when prompt = 'Why did the old Scenario Builder panel look right at a glance even while its two outer cards were swapped?' and options = '["The old panel sorted NPVs from highest to lowest, so the numbers were in the right places and only the words were wrong.", "The old generator was unseeded, so testers never saw the same pair of outer numbers twice and could not compare them.", "The `p50` key is the Best case P50 under either reading, so the middle card showed 78.5315 before and after the repair.", "The swap touched only the Breakeven Analyzer''s cards, which the Scenario Builder does not show beside its three cases."]'::jsonb and answer_index = 2 and explanation = 'Printing a key as a P-label flips `p10` and `p90` but leaves `p50` untouched, and a panel whose middle number is right looks right.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why did the old Scenario Builder panel look right at a glance even while its two outer cards were swapped?', options = '["The old panel sorted NPVs from highest to lowest, so the numbers were in the right places and only the words were wrong.", "The old generator was unseeded, so testers never saw the same pair of outer numbers twice and could not compare them.", "The `p50` key is the Best case P50 under either reading, so the middle card showed 78.5315 before and after the repair.", "The swap touched only the Breakeven Analyzer''s cards, which the Scenario Builder does not show beside its three cases."]'::jsonb, explanation = 'Printing a key as a P-label flips `p10` and `p90` but leaves `p50` untouched, and a panel whose middle number is right looks right.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 13: explanation
  select case
           when prompt = 'A saved slide from before EC3-0 shows a "P90 (Conservative)" card for some field. What can be recovered from it?' and options = '["The whole sample, by rerunning at the default seed 20260829, which reproduces every run made by the old engine on those inputs.", "Its direction: the number is a High case, the value 10 percent of that run met or exceeded, but the sample cannot be rebuilt.", "Nothing at all, since the old card mixed keys from two separate runs and neither number describes any case of the field.", "The Low case, by exchanging the slide''s two outer numbers and keeping the old words so the slide still matches its notes."]'::jsonb and answer_index = 1 and explanation = 'The old engine called an unseeded generator, so a past run cannot be repeated; do not expect it to match 109.8980. Only the label can be corrected, from Conservative to High case P10.' then 'old'
           when prompt = 'A saved slide from before EC3-0 shows a "P90 (Conservative)" card for some field. What can be recovered from it?' and options = '["The whole sample, by rerunning at the default seed 20260829, which reproduces every run made by the old engine on those inputs.", "Its direction: the number is a High case, the value 10 percent of that run met or exceeded, but the sample cannot be rebuilt.", "Nothing at all, since the old card mixed keys from two separate runs and neither number describes any case of the field.", "The Low case, by exchanging the slide''s two outer numbers and keeping the old words so the slide still matches its notes."]'::jsonb and answer_index = 1 and explanation = 'The old engine called an unseeded generator, so a past run cannot be repeated; do not expect it to match 152.0653. Only the label can be corrected, from Conservative to High case P10.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A saved slide from before EC3-0 shows a "P90 (Conservative)" card for some field. What can be recovered from it?', options = '["The whole sample, by rerunning at the default seed 20260829, which reproduces every run made by the old engine on those inputs.", "Its direction: the number is a High case, the value 10 percent of that run met or exceeded, but the sample cannot be rebuilt.", "Nothing at all, since the old card mixed keys from two separate runs and neither number describes any case of the field.", "The Low case, by exchanging the slide''s two outer numbers and keeping the old words so the slide still matches its notes."]'::jsonb, explanation = 'The old engine called an unseeded generator, so a past run cannot be repeated; do not expect it to match 152.0653. Only the label can be corrected, from Conservative to High case P10.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 14: explanation
  select case
           when prompt = 'EC3-0 relabelled the Scenario Builder''s cards and seeded its run. Which of these did the repair leave exactly as it was?' and options = '["The uncertainty the model omits: opex, royalty and tax are still never sampled in any iteration.", "The mapping from keys to cases, which still prints the `p90` key under the Low case so that existing callers keep working.", "The reproducibility of a run, since the default seed 20260829 repeats a sample only within one browser session.", "The display order, which still shows the High case first as the old panel did."]'::jsonb and answer_index = 0 and explanation = 'The keys stayed for existing callers, but the panel now maps them through `lib/conventions/percentile.js`, shows low to high and draws from mulberry32. Nothing in the fix adds opex, royalty or tax to 48.7439.' then 'old'
           when prompt = 'EC3-0 relabelled the Scenario Builder''s cards and seeded its run. Which of these did the repair leave exactly as it was?' and options = '["The uncertainty the model omits: opex, royalty and tax are still never sampled in any iteration.", "The mapping from keys to cases, which still prints the `p90` key under the Low case so that existing callers keep working.", "The reproducibility of a run, since the default seed 20260829 repeats a sample only within one browser session.", "The display order, which still shows the High case first as the old panel did."]'::jsonb and answer_index = 0 and explanation = 'The keys stayed for existing callers, but the panel now maps them through `lib/conventions/percentile.js`, shows low to high and draws from mulberry32. Nothing in the fix adds opex, royalty or tax to 15.6063.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'EC3-0 relabelled the Scenario Builder''s cards and seeded its run. Which of these did the repair leave exactly as it was?', options = '["The uncertainty the model omits: opex, royalty and tax are still never sampled in any iteration.", "The mapping from keys to cases, which still prints the `p90` key under the Low case so that existing callers keep working.", "The reproducibility of a run, since the default seed 20260829 repeats a sample only within one browser session.", "The display order, which still shows the High case first as the old panel did."]'::jsonb, explanation = 'The keys stayed for existing callers, but the panel now maps them through `lib/conventions/percentile.js`, shows low to high and draws from mulberry32. Nothing in the fix adds opex, royalty or tax to 15.6063.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m01 ord 15: option_1
  select case
           when prompt = 'One proposed fix for the swap was to exchange the two outer numbers and keep the words "Conservative" and "Optimistic". Why did the convention reject that?' and options = '["Exchanging the numbers would break existing callers, because the `p90` key would then have to hold the Low case value.", "The words were never on the Scenario Builder; they came from the Breakeven Analyzer''s cards, which is where the swap really sat.", "Conservative and optimistic already mean exactly what P90 and P10 mean, so keeping them would only print each label twice.", "Those words send readers hunting for a cautious card on every quantity, and on a breakeven price the high end, 85.5912, is the risky one."]'::jsonb and answer_index = 3 and explanation = 'The convention names cases Low, Best and High with exceedance labels on outcomes, and a price takes percentile words: ISIALA''s 90th percentile of breakeven price is 85.5912 USD per bbl.' then 'old'
           when prompt = 'One proposed fix for the swap was to exchange the two outer numbers and keep the words "Conservative" and "Optimistic". Why did the convention reject that?' and options = '["Exchanging the numbers would break existing callers, because the `p90` key would then have to hold the Low case value.", "The words were never on the Scenario Builder; they came from the Breakeven Analyzer''s cards, which print a 10th percentile of breakeven price of 62.1713 beside a 90th of 85.5912 and is where the swap really sat.", "Conservative and optimistic already mean exactly what P90 and P10 mean, so keeping them would only print each label twice.", "Those words send readers hunting for a cautious card on every quantity, and on a breakeven price the high end, 85.5912, is the risky one."]'::jsonb and answer_index = 3 and explanation = 'The convention names cases Low, Best and High with exceedance labels on outcomes, and a price takes percentile words: ISIALA''s 90th percentile of breakeven price is 85.5912 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m01 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m01 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'One proposed fix for the swap was to exchange the two outer numbers and keep the words "Conservative" and "Optimistic". Why did the convention reject that?', options = '["Exchanging the numbers would break existing callers, because the `p90` key would then have to hold the Low case value.", "The words were never on the Scenario Builder; they came from the Breakeven Analyzer''s cards, which print a 10th percentile of breakeven price of 62.1713 beside a 90th of 85.5912 and is where the swap really sat.", "Conservative and optimistic already mean exactly what P90 and P10 mean, so keeping them would only print each label twice.", "Those words send readers hunting for a cautious card on every quantity, and on a breakeven price the high end, 85.5912, is the risky one."]'::jsonb, explanation = 'The convention names cases Low, Best and High with exceedance labels on outcomes, and a price takes percentile words: ISIALA''s 90th percentile of breakeven price is 85.5912 USD per bbl.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-one-meaning-of-a-p-label' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m01 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 1: option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'At the app''s settings, how is ISIALA''s 2027 oil volume of 1606000.0000 bbl drawn in one Scenario Builder iteration?' and options = '["From a triangular peaking at the base volume, with tails reaching past 0.8 and 1.2 times it the way a fitted belief does.", "From a normal centred on the base whose 10th and 90th percentile sit at 0.8 and 1.2 times it, so some draws land outside.", "Uniformly between 0.8 and 1.2 times the base, every point equally likely and nothing outside.", "As one multiplier between 0.8 and 1.2 drawn for the iteration and applied to that year and every later year''s volume."]'::jsonb and answer_index = 2 and explanation = 'Each value v with a range r is drawn uniformly on [v(1 - r), v(1 + r)], one draw per year per array; plus or minus 20 percent is a width, with no mode and hard edges.' then 'old'
           when prompt = 'At the app''s settings, how is ISIALA''s 2027 oil volume of 1606000.0000 bbl drawn in one Scenario Builder iteration?' and options = '["From a triangular peaking at the base volume, with tails reaching past 0.8 and 1.2 times it the way a fitted belief does.", "From a fresh uniform draw for 2027 alone, with each later year taking its own independent draw inside the same interval.", "By one reserves factor for the iteration, uniform on 0.8 to 1.2, which multiplies 2027 and every later year alike.", "From a normal centred on the base whose 10th and 90th percentile sit at 0.8 and 1.2 times it, so some draws land outside."]'::jsonb and answer_index = 2 and explanation = 'A variable with a range r takes one draw an iteration, uniform on [1 - r, 1 + r], and that single factor scales every year of the arrays it owns. Plus or minus 20 percent is a width, with no mode and hard edges.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At the app''s settings, how is ISIALA''s 2027 oil volume of 1606000.0000 bbl drawn in one Scenario Builder iteration?', options = '["From a triangular peaking at the base volume, with tails reaching past 0.8 and 1.2 times it the way a fitted belief does.", "From a fresh uniform draw for 2027 alone, with each later year taking its own independent draw inside the same interval.", "By one reserves factor for the iteration, uniform on 0.8 to 1.2, which multiplies 2027 and every later year alike.", "From a normal centred on the base whose 10th and 90th percentile sit at 0.8 and 1.2 times it, so some draws land outside."]'::jsonb, explanation = 'A variable with a range r takes one draw an iteration, uniform on [1 - r, 1 + r], and that single factor scales every year of the arrays it owns. Plus or minus 20 percent is a width, with no mode and hard edges.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 2: option_0, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The first draw of mulberry32(20260829) is 0.936239. Where does it land in ISIALA''s Scenario Builder run?' and options = '["On the 2027 oil volume, near the top of its range, because oil volume comes first in the draw order.", "On the 2027 oil price, because price is the headline range and the draw order starts with the prices before any volume.", "On capex, as 226.5205 million USD, which is the value that same draw gives in the Breakeven Analyzer at that seed.", "On all three ranges at once, since one draw per iteration scales the price, the capex and the reserves together."]'::jsonb and answer_index = 0 and explanation = 'The order is oil volume, gas volume, oil price, gas price, capex, one draw per year. 226.5205 is what the draw becomes in the other engine, through a triangular inverse CDF.' then 'old'
           when prompt = 'The first draw of mulberry32(20260829) is 0.936239. Where does it land in ISIALA''s Scenario Builder run?' and options = '["On the reserves factor, near the top of its interval, and that factor then scales all twenty years of oil volume.", "On the 2027 oil price, because price is the headline range and the draw order starts with the prices before any volume.", "On capex, as 226.5205 million USD, which is the value that same draw gives in the Breakeven Analyzer at that seed.", "On the 2027 oil volume alone, since the sampler works through the case year by year and 2027 is its first year."]'::jsonb and answer_index = 0 and explanation = 'The order within an iteration is reserves, price, capex, one factor each, and a falsy range consumes no draw. The value 226.5205 is what the draw becomes in the other engine, through a triangular inverse CDF.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The first draw of mulberry32(20260829) is 0.936239. Where does it land in ISIALA''s Scenario Builder run?', options = '["On the reserves factor, near the top of its interval, and that factor then scales all twenty years of oil volume.", "On the 2027 oil price, because price is the headline range and the draw order starts with the prices before any volume.", "On capex, as 226.5205 million USD, which is the value that same draw gives in the Breakeven Analyzer at that seed.", "On the 2027 oil volume alone, since the sampler works through the case year by year and 2027 is its first year."]'::jsonb, explanation = 'The order within an iteration is reserves, price, capex, one factor each, and a falsy range consumes no draw. The value 226.5205 is what the draw becomes in the other engine, through a triangular inverse CDF.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 3: prompt, option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why does the lowest of ISIALA''s 1000 sampled NPVs, 16.3054, sit so far above the scenario Low of -72.1531?' and options = '["The Monte Carlo discounts at year end while generateScenarios discounts mid-year, which lifts every sampled NPV above the corner case.", "One thousand iterations are too few to reach the tail, and a run of 20000 iterations would carry its lowest NPV down to -72.1531.", "The uniform range is clipped at the base value on its downside, so the sampled prices and volumes can only move upward from it.", "Every year and variable is drawn on its own, so yearly draws partly cancel and no iteration pushes everything to its bad end together."]'::jsonb and answer_index = 3 and explanation = 'The scenario moves price and production to 0.8 times base in every year at once; the Monte Carlo''s Low case P90 of 48.7439 and its minimum both reflect independent draws that never line up that way.' then 'old'
           when prompt = 'Why does the lowest of ISIALA''s 1000 sampled NPVs, -46.1564, still sit above the scenario Low of -57.8151?' and options = '["The Monte Carlo discounts at year end while generateScenarios discounts mid-year, which lifts every sampled NPV above the corner case.", "One thousand iterations are too few to reach the tail, and a run of 20000 iterations would carry its lowest NPV down to -57.8151.", "The uniform range is clipped at the base value on its downside, so the sampled prices and volumes can only move upward from it.", "The three factors are drawn independently of one another, so they seldom land near their bad ends together, and fixed opex is never drawn at all."]'::jsonb and answer_index = 3 and explanation = 'The scenario moves price, production and variable opex to 0.8 times base and capex and fixed opex to 1.2 times in one move. The sampler holds each factor for a whole life but draws its three factors separately, and it never touches fixed opex.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does the lowest of ISIALA''s 1000 sampled NPVs, -46.1564, still sit above the scenario Low of -57.8151?', options = '["The Monte Carlo discounts at year end while generateScenarios discounts mid-year, which lifts every sampled NPV above the corner case.", "One thousand iterations are too few to reach the tail, and a run of 20000 iterations would carry its lowest NPV down to -57.8151.", "The uniform range is clipped at the base value on its downside, so the sampled prices and volumes can only move upward from it.", "The three factors are drawn independently of one another, so they seldom land near their bad ends together, and fixed opex is never drawn at all."]'::jsonb, explanation = 'The scenario moves price, production and variable opex to 0.8 times base and capex and fixed opex to 1.2 times in one move. The sampler holds each factor for a whole life but draws its three factors separately, and it never touches fixed opex.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 4: option_0, option_1, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'An analyst reads plus or minus 20 percent on price as "the price could stay 20 percent lower for the life of the field". What does the range actually do?' and options = '["Exactly what the analyst says: one multiplier sets the whole life, which is why the Low case P90 sits at 48.7439 million USD.", "It draws each year''s price on its own inside 0.8 to 1.2 times base; a price that stays low is a scenario and must be built as one.", "It states a percentile belief, so 20 percent of the iterations price below 0.8 times base and the rest price above it.", "It draws price once per iteration and capex and reserves once per year, so price is the one input that can stay low for life."]'::jsonb and answer_index = 1 and explanation = 'Independence across years is why the Low case P90 of 48.7439 sits far above the scenario Low of -72.1531: the range is applied to each year separately.' then 'old'
           when prompt = 'An analyst reads plus or minus 20 percent on price as "the price could stay 20 percent lower for the life of the field". What does the range actually do?' and options = '["It does that one year at a time: each year takes its own price draw, so a price 20 percent low for a whole life almost never occurs.", "It draws one price factor an iteration and holds it for every year, so a life at 0.8 of base is the hard edge of the range rather than a typical draw.", "It states a percentile belief, so 20 percent of the iterations price below 0.8 times base and the rest price above it.", "It draws price once per iteration and capex and reserves once per year, so price is the one input that can stay low for life."]'::jsonb and answer_index = 1 and explanation = 'One factor multiplies 2027 and 2046 by the same number, so a price deck keeps its shape and a whole life does move together. Every factor between 0.8 and 1.2 is equally likely, and 0.8 is the edge of the interval.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An analyst reads plus or minus 20 percent on price as "the price could stay 20 percent lower for the life of the field". What does the range actually do?', options = '["It does that one year at a time: each year takes its own price draw, so a price 20 percent low for a whole life almost never occurs.", "It draws one price factor an iteration and holds it for every year, so a life at 0.8 of base is the hard edge of the range rather than a typical draw.", "It states a percentile belief, so 20 percent of the iterations price below 0.8 times base and the rest price above it.", "It draws price once per iteration and capex and reserves once per year, so price is the one input that can stay low for life."]'::jsonb, explanation = 'One factor multiplies 2027 and 2046 by the same number, so a price deck keeps its shape and a whole life does move together. Every factor between 0.8 and 1.2 is equally likely, and 0.8 is the edge of the interval.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 5: option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Which arrays does the Scenario Builder''s range called reserves scale?' and options = '["A total recoverable volume, rescaled once per iteration and then declined at the base ratio of 0.880000 year on year.", "Oil volume alone, because ISIALA''s gas volume is 0 and the engine skips a zero array without consuming its draws.", "Oil volume and gas volume, each year drawn on its own, with no total recoverable volume in the draw.", "Oil volume together with the variable opex computed from it, so the costs follow the barrels the iteration sampled."]'::jsonb and answer_index = 2 and explanation = 'A draw low in 2027 and high in 2028 gives a profile that rises, so the sampled profile keeps no decline and no believed total; the gas draws are still consumed because the range is not falsy.' then 'old'
           when prompt = 'Which arrays does the Scenario Builder''s range called reserves scale?' and options = '["A total recoverable volume, rescaled once per iteration and then declined at the base ratio of 0.880000 year on year.", "Oil volume alone, because ISIALA''s gas volume is 0 and the variable opex array was fixed when the quick inputs were expanded.", "Oil volume, gas volume and the variable opex those volumes carry, all by the one factor drawn for the iteration.", "Oil volume and gas volume, with variable opex held at its base so that a low iteration still pays to lift barrels it never produced."]'::jsonb and answer_index = 2 and explanation = 'An iteration that lifts a fifth fewer barrels pays a fifth less to lift them, which is the only reading of a volume range a cost per barrel allows. One factor covers every array the range owns, and a gas volume of 0 costs no extra draw.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which arrays does the Scenario Builder''s range called reserves scale?', options = '["A total recoverable volume, rescaled once per iteration and then declined at the base ratio of 0.880000 year on year.", "Oil volume alone, because ISIALA''s gas volume is 0 and the variable opex array was fixed when the quick inputs were expanded.", "Oil volume, gas volume and the variable opex those volumes carry, all by the one factor drawn for the iteration.", "Oil volume and gas volume, with variable opex held at its base so that a low iteration still pays to lift barrels it never produced."]'::jsonb, explanation = 'An iteration that lifts a fifth fewer barrels pays a fifth less to lift them, which is the only reading of a volume range a cost per barrel allows. One factor covers every array the range owns, and a gas volume of 0 costs no extra draw.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 6: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'An iteration draws ISIALA''s 2027 oil volume near 0.8 times base. What variable opex does 2027 carry in that iteration?' and options = '["About 0.8 times 20.8780 million USD, since variable opex is volume times 13 USD/bbl.", "2.5000 million USD, the fixed opex alone, since a sampled volume replaces the variable part of the cost with nothing.", "Whatever the opex range draws for that year, since opex is sampled in the fifth position of the order beside capex.", "20.8780 million USD, the base value, because variable opex was fixed at expansion and does not follow the draw."]'::jsonb and answer_index = 3 and explanation = 'The variable opex array was computed from base volumes when the quick inputs were expanded, and the Monte Carlo never touches it, so a low-volume iteration still pays the full 20.8780.' then 'old'
           when prompt = 'An iteration draws ISIALA''s reserves factor near 0.8. What variable opex does 2027 carry in that iteration?' and options = '["20.8780 million USD, the base value, because variable opex was fixed at expansion and does not follow the draw.", "2.5000 million USD, the fixed opex alone, since a sampled volume replaces the variable part of the cost with nothing, as though the sampler dropped the per barrel charge whenever it scaled the barrels.", "Whatever an opex range draws for that year, since opex is sampled in its own position in the order beside capex.", "About 0.8 times 20.8780 million USD, because the reserves factor scales the variable opex array along with the volumes."]'::jsonb and answer_index = 3 and explanation = 'Variable opex is volume times 13 USD per bbl, so the reserves factor carries the cost with the barrels. Fixed opex of 2.5000 million USD a year is never sampled at any setting.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An iteration draws ISIALA''s reserves factor near 0.8. What variable opex does 2027 carry in that iteration?', options = '["20.8780 million USD, the base value, because variable opex was fixed at expansion and does not follow the draw.", "2.5000 million USD, the fixed opex alone, since a sampled volume replaces the variable part of the cost with nothing, as though the sampler dropped the per barrel charge whenever it scaled the barrels.", "Whatever an opex range draws for that year, since opex is sampled in its own position in the order beside capex.", "About 0.8 times 20.8780 million USD, because the reserves factor scales the variable opex array along with the volumes."]'::jsonb, explanation = 'Variable opex is volume times 13 USD per bbl, so the reserves factor carries the cost with the barrels. Fixed opex of 2.5000 million USD a year is never sampled at any setting.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 7: prompt, option_0, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reader calls the spread from ISIALA''s Low case P90 of 48.7439 to its High case P10 of 109.8980 "the uncertainty in ISIALA". What does that spread leave out?' and options = '["Every input never sampled, opex, royalty, tax, decline and discount rate among them; fixed opex alone moves the sweep''s NPV from 85.3696 to 76.7233.", "Nothing among the costs, since the capex range scales fixed opex and variable opex along with capex in every year.", "Only the correlation of opex with price, since opex, royalty and tax are sampled each year but drawn independently.", "Only the gas price, which ISIALA never sells, so for an oil field the three ranges already cover every input."]'::jsonb and answer_index = 0 and explanation = 'Price, capex and reserves are the only ranges; the sensitivity sweep scales fixed opex by 0.7 and 1.3 and the scenario Low by 1.2, but the Monte Carlo leaves it alone.' then 'old'
           when prompt = 'A reader calls the spread from ISIALA''s Low case P90 of 15.6063 to its High case P10 of 152.0653 "the uncertainty in ISIALA". What does that spread leave out?' and options = '["Every input never sampled, fixed opex, royalty, tax, decline and discount rate among them; fixed opex alone moves the sweep''s NPV from 85.3696 to 76.7233.", "Nothing among the costs, since the capex range scales fixed opex and variable opex along with capex in every year.", "Only the correlation of fixed opex with price, since fixed opex, royalty and tax each take a factor of their own.", "Only the gas price, which ISIALA never sells, so for an oil field the three ranges already cover every input."]'::jsonb and answer_index = 0 and explanation = 'Price, capex and reserves are the only ranges, and reserves carries variable opex with it. The sensitivity sweep scales fixed opex by 0.7 and 1.3 and the scenario Low by 1.2, but the Monte Carlo leaves fixed opex alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader calls the spread from ISIALA''s Low case P90 of 15.6063 to its High case P10 of 152.0653 "the uncertainty in ISIALA". What does that spread leave out?', options = '["Every input never sampled, fixed opex, royalty, tax, decline and discount rate among them; fixed opex alone moves the sweep''s NPV from 85.3696 to 76.7233.", "Nothing among the costs, since the capex range scales fixed opex and variable opex along with capex in every year.", "Only the correlation of fixed opex with price, since fixed opex, royalty and tax each take a factor of their own.", "Only the gas price, which ISIALA never sells, so for an oil field the three ranges already cover every input."]'::jsonb, explanation = 'Price, capex and reserves are the only ranges, and reserves carries variable opex with it. The sensitivity sweep scales fixed opex by 0.7 and 1.3 and the scenario Low by 1.2, but the Monte Carlo leaves fixed opex alone.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 9: prompt, option_0, option_1, option_2, explanation
  select case
           when prompt = 'ISIALA''s Best case P50 is 81.1835 million USD at seed 20260829 and 79.0624 at seed 43, with everything else the same. Which one is accurate?' and options = '["81.1835, because it sits closer to the deterministic 81.0464 million USD, and a good sample should centre on the base case.", "81.1835, because the engine''s goldens were validated at the default seed.", "79.0624, because a seed the analyst picks avoids whatever bias a developer built into the seed chosen as default.", "Neither is more correct: each is one sample of 1000, and the gap shows how much a single seed hides."]'::jsonb and answer_index = 3 and explanation = 'A seed buys reproducibility, not accuracy. Reporting 81.1835 because it is nearer 81.0464 is seed shopping: fix the seed before the first run and treat the gap as part of the uncertainty.' then 'old'
           when prompt = 'ISIALA''s Best case P50 is 78.5315 million USD at seed 20260829 and 80.2233 at seed 43, with everything else the same. Which one is accurate?' and options = '["80.2233, because it sits closer to the deterministic 81.0464 million USD, and a good sample should centre on the base case.", "78.5315, because it comes from the default seed, which is the seed the engine''s published goldens were validated at.", "80.2233, because a seed the analyst picks avoids whatever bias a developer built into the seed chosen as default.", "Neither is more correct: each is one sample of 1000, and the gap shows how much a single seed hides."]'::jsonb and answer_index = 3 and explanation = 'A seed buys reproducibility and nothing more. Reporting 80.2233 because it is nearer 81.0464 is seed shopping: fix the seed before the first run and treat the gap as part of the uncertainty.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Best case P50 is 78.5315 million USD at seed 20260829 and 80.2233 at seed 43, with everything else the same. Which one is accurate?', options = '["80.2233, because it sits closer to the deterministic 81.0464 million USD, and a good sample should centre on the base case.", "78.5315, because it comes from the default seed, which is the seed the engine''s published goldens were validated at.", "80.2233, because a seed the analyst picks avoids whatever bias a developer built into the seed chosen as default.", "Neither is more correct: each is one sample of 1000, and the gap shows how much a single seed hides."]'::jsonb, explanation = 'A seed buys reproducibility and nothing more. Reporting 80.2233 because it is nearer 81.0464 is seed shopping: fix the seed before the first run and treat the gap as part of the uncertainty.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 11: option_1
  select case
           when prompt = 'At 5000 iterations ISIALA''s median breakeven price across seeds 1 to 10 spans 72.6338 to 73.1287, and the default seed gives 73.3297. Should the default seed be distrusted?' and options = '["No: it drew a sample near one edge of what the model produces, and every run at that seed will faithfully repeat that edge.", "Yes: a default that falls outside the span of ten other seeds is biased and should be replaced by seed 1 for reporting.", "No: the default seed is the accurate one, and seeds 1 to 10 all sit low because small seeds give correlated streams.", "Yes: that run must have excluded iterations the other ten seeds kept, which is what moved its median above theirs."]'::jsonb and answer_index = 0 and explanation = 'ISIALA''s breakeven run excludes none. Reproducible is all a seed guarantees; the ten medians alone span 0.4949 USD per bbl.' then 'old'
           when prompt = 'At 5000 iterations ISIALA''s median breakeven price across seeds 1 to 10 spans 72.6338 to 73.1287, and the default seed gives 73.3297. Should the default seed be distrusted?' and options = '["No: it drew a sample near one edge of what the model produces, and every run at that seed will faithfully repeat that edge.", "Yes: a default that falls outside the span of ten other seeds is biased and should be replaced by seed 1 for reporting, on the reasoning that a default ought to sit at the centre of the spread it summarises.", "No: the default seed is the accurate one, and seeds 1 to 10 all sit low because small seeds give correlated streams.", "Yes: that run must have excluded iterations the other ten seeds kept, which is what moved its median above theirs."]'::jsonb and answer_index = 0 and explanation = 'ISIALA''s breakeven run excludes none. Reproducible is all a seed guarantees; the ten medians alone span 0.4949 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 5000 iterations ISIALA''s median breakeven price across seeds 1 to 10 spans 72.6338 to 73.1287, and the default seed gives 73.3297. Should the default seed be distrusted?', options = '["No: it drew a sample near one edge of what the model produces, and every run at that seed will faithfully repeat that edge.", "Yes: a default that falls outside the span of ten other seeds is biased and should be replaced by seed 1 for reporting, on the reasoning that a default ought to sit at the centre of the spread it summarises.", "No: the default seed is the accurate one, and seeds 1 to 10 all sit low because small seeds give correlated streams.", "Yes: that run must have excluded iterations the other ten seeds kept, which is what moved its median above theirs."]'::jsonb, explanation = 'ISIALA''s breakeven run excludes none. Reproducible is all a seed guarantees; the ten medians alone span 0.4949 USD per bbl.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s tallest histogram bin is the ninth, holding 114, while the Best case P50 of 81.1835 falls in the tenth, holding 94, and the eleventh and twelfth hold 96 and 111. How should that dip be read?' and options = '["As the mode, the most likely NPV, sitting one bin below the median through skew.", "As binning noise in one sample of 1000; a slightly different width would merge or split the two peaks.", "As two populations of NPV, one for each capex year, so the model really has two most likely values and a trough between.", "As the effect of rounding the bin width of 6.6524 million USD, which the engine would remove at 20 bins of density."]'::jsonb and answer_index = 1 and explanation = 'The model has one field, three uniform ranges and no switch between regimes, so nothing in it can make two peaks; the tallest bin is not the most likely NPV.' then 'old'
           when prompt = 'ISIALA''s histogram runs 90, 88, 99, 79 and 86 across its eighth to twelfth bins, and the Best case P50 of 78.5315 falls in the tenth. How should those dips be read?' and options = '["As the mode, the most likely NPV, which a decision should prefer to the median because it is where the draws concentrate.", "As binning noise in one sample of 1000; a slightly different width would merge or split the neighbouring bins.", "As two populations of NPV, one for each capex year, so the model has two most likely values and a trough between them.", "As the effect of rounding the bin width of 12.7562 million USD, which the engine would remove at 20 bins of density."]'::jsonb and answer_index = 1 and explanation = 'The model has one field, three uniform factors and no switch between regimes, so nothing in it can make two peaks. The tenth bin holds 99 of the 1000 and the eighth 90, a gap a slightly different width would close.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s histogram runs 90, 88, 99, 79 and 86 across its eighth to twelfth bins, and the Best case P50 of 78.5315 falls in the tenth. How should those dips be read?', options = '["As the mode, the most likely NPV, which a decision should prefer to the median because it is where the draws concentrate.", "As binning noise in one sample of 1000; a slightly different width would merge or split the neighbouring bins.", "As two populations of NPV, one for each capex year, so the model has two most likely values and a trough between them.", "As the effect of rounding the bin width of 12.7562 million USD, which the engine would remove at 20 bins of density."]'::jsonb, explanation = 'The model has one field, three uniform factors and no switch between regimes, so nothing in it can make two peaks. The tenth bin holds 99 of the 1000 and the eighth 90, a gap a slightly different width would close.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 13: option_0, explanation
  select case
           when prompt = 'An analyst lays ISIALA''s histogram at seed 43 over the one at seed 20260829 and compares the counts bin by bin. Why is that comparison invalid?' and options = '["It is valid, because both runs use 20 bins of the same fixed width of 6.6524 million USD, starting from the same edge.", "It is valid once each count is divided by 1000 to turn it into a share of the run.", "It is invalid only for the first and last bins, which move with the extremes while the inner eighteen bins stay put.", "Each run''s bins span its own lowest to highest NPV, so every count describes a different interval."]'::jsonb and answer_index = 3 and explanation = 'The width is the sample''s range divided by 20: 6.6524 comes from 16.3054 and 149.3540 at the default seed and describes no other sample.' then 'old'
           when prompt = 'An analyst lays ISIALA''s histogram at seed 43 over the one at seed 20260829 and compares the counts bin by bin. Why is that comparison invalid?' and options = '["It is valid, because both runs use 20 bins of the same fixed width of 12.7562 million USD, starting from the same edge.", "It is valid once each count is divided by 1000 to turn it into a share of the run.", "It is invalid only for the first and last bins, which move with the extremes while the inner eighteen bins stay put.", "Each run''s bins span its own lowest to highest NPV, so every count describes a different interval."]'::jsonb and answer_index = 3 and explanation = 'The width is the sample''s range divided by 20: 12.7562 comes from -46.1564 and 208.9685 at the default seed and describes no other sample.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An analyst lays ISIALA''s histogram at seed 43 over the one at seed 20260829 and compares the counts bin by bin. Why is that comparison invalid?', options = '["It is valid, because both runs use 20 bins of the same fixed width of 12.7562 million USD, starting from the same edge.", "It is valid once each count is divided by 1000 to turn it into a share of the run.", "It is invalid only for the first and last bins, which move with the extremes while the inner eighteen bins stay put.", "Each run''s bins span its own lowest to highest NPV, so every count describes a different interval."]'::jsonb, explanation = 'The width is the sample''s range divided by 20: 12.7562 comes from -46.1564 and 208.9685 at the default seed and describes no other sample.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 14: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s S-curve at 1000 iterations has 50 points, the first at probability 0.0000 and the last at 98.0000. What does the chart never draw?' and options = '["The sorted values above the last point, including the highest NPV of 149.3540, so its right end is not the maximum.", "Nothing: the point at 98.0000 is the highest NPV, placed there because the axis leaves two points of headroom at the top.", "The lowest values, because the curve starts at the first multiple of 20 and so leaves out the lowest NPV of 16.3054.", "The middle of the sample, because keeping one point in 20 retains the tails and thins out the values near the median."]'::jsonb and answer_index = 0 and explanation = 'The step is 1000 divided by 50, one point every 20 sorted values, and the sorted value at index i sits at i divided by n times 100, so the last kept index reads 98.0000.' then 'old'
           when prompt = 'ISIALA''s S-curve at 1000 iterations has 51 points, from probability 0.0000 to 100.0000. What does the point count tell a reader about the run?' and options = '["Nothing at all: the count never changes with the iteration count, so forty iterations draw 51 points as readily as a thousand do.", "That 1000 iterations were run, since the curve keeps one sorted value in every twenty and 1000 divided by 20 sets the count.", "That the run passed fifty iterations, because the chart draws no points at all until that many have been sampled.", "That fifty sorted values were kept and one more added at the top, so the count grows by one for every further fifty draws."]'::jsonb and answer_index = 0 and explanation = 'The curve reads the sample at 51 evenly spaced probabilities whatever the count, its first value equal to the lowest NPV of -46.1564 and its last to the highest of 208.9685. Record the iteration count beside the chart, because the picture will not show it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s S-curve at 1000 iterations has 51 points, from probability 0.0000 to 100.0000. What does the point count tell a reader about the run?', options = '["Nothing at all: the count never changes with the iteration count, so forty iterations draw 51 points as readily as a thousand do.", "That 1000 iterations were run, since the curve keeps one sorted value in every twenty and 1000 divided by 20 sets the count.", "That the run passed fifty iterations, because the chart draws no points at all until that many have been sampled.", "That fifty sorted values were kept and one more added at the top, so the count grows by one for every further fifty draws."]'::jsonb, explanation = 'The curve reads the sample at 51 evenly spaced probabilities whatever the count, its first value equal to the lowest NPV of -46.1564 and its last to the highest of 208.9685. Record the iteration count beside the chart, because the picture will not show it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m02 ord 15: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The S-curve point at height 10 is 48.8335 million USD, but the Low case card shows 48.7439. Which one is wrong?' and options = '["The card, because the S-curve plots the raw sample while the `p10` key is rounded for display on the panel.", "The curve, because its axis shows exceedance, so the point at height 10 is really the High case P10 and belongs on another card.", "Neither: the curve plots the single sorted value at index 100, while the card''s `p10` key averages two neighbours.", "The curve, which is drawn from a cached sample of an earlier seed and so lags the card by one run of the engine."]'::jsonb and answer_index = 2 and explanation = 'The axis counts the share below a value, so height 10 is the Low case P90''s region; the curve uses a different percentile rule from the cards, and 81.1952 against 81.1835 at the middle is the same effect.' then 'old'
           when prompt = 'ISIALA''s S-curve reads 15.6063 million USD at height 10, exactly what the Low case card shows. Why do the two agree?' and options = '["The curve is drawn from the three cards, so it interpolates between them and has to pass through each one.", "Both are rounded to four decimals, and the underlying values differ in a decimal place the panel does not print.", "One quantile rule reads both, so the curve''s heights and the three cards are one reading of one sorted sample.", "The curve plots the single sorted value at index 100, which on an even sample is always the averaged card value."]'::jsonb and answer_index = 2 and explanation = 'That agreement is the EC3-6 repair. The other rule in this module belongs to the Breakeven Analyzer, and on the same 1000 NPVs it reads 15.6619, 78.5836 and 152.1794 at those three positions.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m02 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m02 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s S-curve reads 15.6063 million USD at height 10, exactly what the Low case card shows. Why do the two agree?', options = '["The curve is drawn from the three cards, so it interpolates between them and has to pass through each one.", "Both are rounded to four decimals, and the underlying values differ in a decimal place the panel does not print.", "One quantile rule reads both, so the curve''s heights and the three cards are one reading of one sorted sample.", "The curve plots the single sorted value at index 100, which on an even sample is always the averaged card value."]'::jsonb, explanation = 'That agreement is the EC3-6 repair. The other rule in this module belongs to the Breakeven Analyzer, and on the same 1000 NPVs it reads 15.6619, 78.5836 and 152.1794 at those three positions.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-scenario-builder-monte-carlo' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m02 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 1: explanation
  select case
           when prompt = 'On ISIALA''s 1000 Scenario Builder NPVs, which branch of the `lib/stats` quantile rule gives the three cases at q of 0.1, 0.5 and 0.9?' and options = '["The single-value branch at every row, because a whole position needs no averaging and the rule simply reads the value there.", "The averaging branch at every row, because n x q is 100, 500 and 900, all whole on an even length.", "Averaging at the median only, with the Low case and High case read as single values because the tails of a sample are sparse.", "The odd-length branch, taking the value after the position at every row, because 1000 sorted values have no middle pair."]'::jsonb and answer_index = 1 and explanation = 'The rule averages the value at position n x q with the next one when n x q is whole and n is even, so 48.7439, 81.1835 and 109.8980 are all averages.' then 'old'
           when prompt = 'On ISIALA''s 1000 Scenario Builder NPVs, which branch of the `lib/stats` quantile rule gives the three cases at q of 0.1, 0.5 and 0.9?' and options = '["The single-value branch at every row, because a whole position needs no averaging and the rule simply reads the value there.", "The averaging branch at every row, because n x q is 100, 500 and 900, all whole on an even length.", "Averaging at the median only, with the Low case and High case read as single values because the tails of a sample are sparse.", "The odd-length branch, taking the value after the position at every row, because 1000 sorted values have no middle pair."]'::jsonb and answer_index = 1 and explanation = 'The rule averages the value at position n x q with the next one when n x q is whole and n is even, so 15.6063, 78.5315 and 152.0653 are all averages.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ISIALA''s 1000 Scenario Builder NPVs, which branch of the `lib/stats` quantile rule gives the three cases at q of 0.1, 0.5 and 0.9?', options = '["The single-value branch at every row, because a whole position needs no averaging and the rule simply reads the value there.", "The averaging branch at every row, because n x q is 100, 500 and 900, all whole on an even length.", "Averaging at the median only, with the Low case and High case read as single values because the tails of a sample are sparse.", "The odd-length branch, taking the value after the position at every row, because 1000 sorted values have no middle pair."]'::jsonb, explanation = 'The rule averages the value at position n x q with the next one when n x q is whole and n is even, so 15.6063, 78.5315 and 152.0653 are all averages.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 2: prompt, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'An analyst searches ISIALA''s exported sorted `allValues` for the Low case card''s 48.7439 million USD and finds nothing. What should they conclude?' and options = '["The card is stale, left over from an unseeded run made before EC3-0 that the current export does not contain.", "The export is rounded to four decimals while the card holds full precision, so the search fails on rounding alone.", "The card reads the `p90` key, so the value to look for in the export is 109.8980 and the search was aimed at the wrong end.", "The card is right: it is the midpoint of two neighbouring NPVs, the upper being 48.8335, so no iteration produced it."]'::jsonb and answer_index = 3 and explanation = 'Under its own rule the averaged card value is not a member of the sample; the floor rule''s 48.8335 is the upper neighbour, and 81.1835 and 109.8980 are equally absent.' then 'old'
           when prompt = 'An analyst searches ISIALA''s exported sorted `allValues` for the Low case card''s 15.6063 million USD and finds nothing. What should they conclude?' and options = '["The card is stale, left over from an unseeded run made before EC3-0 that the current export does not contain.", "The export is rounded to four decimals while the card holds full precision, so the search fails on rounding alone.", "The card reads the `p90` key, so the value to look for in the export is 152.0653 and the search was aimed at the wrong end.", "The card is right: it is the midpoint of two neighbouring NPVs, the upper being 15.6619, so no iteration produced it."]'::jsonb and answer_index = 3 and explanation = 'Under its own rule the averaged card value is not a member of the sample; the floor rule''s 15.6619 is the upper neighbour, and 78.5315 and 152.0653 are equally absent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An analyst searches ISIALA''s exported sorted `allValues` for the Low case card''s 15.6063 million USD and finds nothing. What should they conclude?', options = '["The card is stale, left over from an unseeded run made before EC3-0 that the current export does not contain.", "The export is rounded to four decimals while the card holds full precision, so the search fails on rounding alone.", "The card reads the `p90` key, so the value to look for in the export is 152.0653 and the search was aimed at the wrong end.", "The card is right: it is the midpoint of two neighbouring NPVs, the upper being 15.6619, so no iteration produced it."]'::jsonb, explanation = 'Under its own rule the averaged card value is not a member of the sample; the floor rule''s 15.6619 is the upper neighbour, and 78.5315 and 152.0653 are equally absent.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 4: prompt, option_1, explanation
  select case
           when prompt = 'Applied to ISIALA''s 1000 NPVs, the averaging rule minus the floor rule is -0.0896, -0.0116 and -0.0056 at the three cases. Why is every difference negative?' and options = '["The floor rule rounds its answer down and so should read lower, and the negative sign shows the export was sorted in descending order instead.", "The averaging rule folds the sample mean of 80.1707 million USD into each reading, which drags every one of its three cases downward below the floor.", "On a whole n x q the averaging rule blends the value at the index with the one before it, and the floor rule takes the upper of the two.", "Seed noise: the floor rule was applied to a second, independent draw of 1000 NPVs that happened to sit slightly higher than the first draw."]'::jsonb and answer_index = 2 and explanation = 'On this sample the floor rule cannot sit below the averaging rule, because the midpoint of two sorted values never exceeds the upper one; 48.8335 against 48.7439 is the largest gap.' then 'old'
           when prompt = 'Applied to ISIALA''s 1000 NPVs, the averaging rule minus the floor rule is -0.0556, -0.0521 and -0.1142 at the three cases. Why is every difference negative?' and options = '["The floor rule rounds its answer down and so should read lower, and the negative sign shows the export was sorted in descending order instead.", "The averaging rule folds the sample mean of 80.9836 million USD into each reading, which drags every one of its three cases downward below the floor.", "On a whole n x q the averaging rule blends the value at the index with the one before it, and the floor rule takes the upper of the two.", "Seed noise: the floor rule was applied to a second, independent draw of 1000 NPVs that happened to sit slightly higher than the first draw."]'::jsonb and answer_index = 2 and explanation = 'On this sample the floor rule cannot sit below the averaging rule, because the midpoint of two sorted values never exceeds the upper one. The largest of the three gaps is -0.1142, at the High case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Applied to ISIALA''s 1000 NPVs, the averaging rule minus the floor rule is -0.0556, -0.0521 and -0.1142 at the three cases. Why is every difference negative?', options = '["The floor rule rounds its answer down and so should read lower, and the negative sign shows the export was sorted in descending order instead.", "The averaging rule folds the sample mean of 80.9836 million USD into each reading, which drags every one of its three cases downward below the floor.", "On a whole n x q the averaging rule blends the value at the index with the one before it, and the floor rule takes the upper of the two.", "Seed noise: the floor rule was applied to a second, independent draw of 1000 NPVs that happened to sit slightly higher than the first draw."]'::jsonb, explanation = 'On this sample the floor rule cannot sit below the averaging rule, because the midpoint of two sorted values never exceeds the upper one. The largest of the three gaps is -0.1142, at the High case.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 5: option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reviewer wants the floor rule for ISIALA''s NPV Low case because "floor" sounds cautious. What is wrong with that reasoning?' and options = '["Nothing: flooring rounds the NPV itself down to the lower of two neighbours, which is the cautious choice for a Low case.", "The floor acts on the index, so it takes the upper neighbour, 48.8335 against 48.7439, leaning the Low case toward the good end.", "It holds for the Low case alone, since the floor lowers the value at q of 0.1 and raises it at q of 0.9, so only the High case suffers.", "The choice is irrelevant, because both rules return exactly 48.7439 whenever the iteration count is an even number."]'::jsonb and answer_index = 1 and explanation = 'On a breakeven price the floor leans a percentile towards the risky end; on an NPV it leans towards the good end, so a reader who assumes it is cautious has the direction backwards.' then 'old'
           when prompt = 'A reviewer wants the floor rule for ISIALA''s NPV Low case because "floor" sounds cautious. What is wrong with that reasoning?' and options = '["Nothing: flooring rounds the NPV itself down to the lower of two neighbours, which is the cautious choice for a Low case.", "The floor acts on the index, so it takes the upper neighbour, 15.6619 against 15.6063, leaning the Low case toward the good end.", "It holds for the Low case alone, since the floor lowers the value at q of 0.1 and raises it at q of 0.9, so only the High case suffers.", "The choice is irrelevant, because both rules return exactly 15.6063 whenever the iteration count is an even number."]'::jsonb and answer_index = 1 and explanation = 'On a breakeven price the floor leans a percentile towards the risky end; on an NPV it leans towards the good end, so a reader who assumes it is cautious has the direction backwards.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer wants the floor rule for ISIALA''s NPV Low case because "floor" sounds cautious. What is wrong with that reasoning?', options = '["Nothing: flooring rounds the NPV itself down to the lower of two neighbours, which is the cautious choice for a Low case.", "The floor acts on the index, so it takes the upper neighbour, 15.6619 against 15.6063, leaning the Low case toward the good end.", "It holds for the Low case alone, since the floor lowers the value at q of 0.1 and raises it at q of 0.9, so only the High case suffers.", "The choice is irrelevant, because both rules return exactly 15.6063 whenever the iteration count is an even number."]'::jsonb, explanation = 'On a breakeven price the floor leans a percentile towards the risky end; on an NPV it leans towards the good end, so a reader who assumes it is cautious has the direction backwards.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 8: prompt, explanation
  select case
           when prompt = 'ISIALA''s median NPV is 81.1835 by the averaging rule and 81.1952 by the floor rule, a difference of -0.0116. What is that gap made of?' and options = '["The distance between the sample mean and the median, which the averaging rule quietly blends into its reading of the middle.", "A rounding artefact from printing money to four decimals, which vanishes once both medians are carried at full precision.", "Exactly half the spacing between the two middle neighbours: one rule returns their midpoint and the other the upper one.", "Seed noise between two runs at seed 20260829, since each rule sorts its own freshly drawn sample of 1000 NPVs."]'::jsonb and answer_index = 2 and explanation = 'The sample is sorted once and both rules read it; the Best case P50 card shows the averaging rule''s 81.1835, and the EMV of 80.1707 is a separate quantity altogether.' then 'old'
           when prompt = 'ISIALA''s median NPV is 78.5315 by the averaging rule and 78.5836 by the floor rule, a difference of -0.0521. What is that gap made of?' and options = '["The distance between the sample mean and the median, which the averaging rule quietly blends into its reading of the middle.", "A rounding artefact from printing money to four decimals, which vanishes once both medians are carried at full precision.", "Exactly half the spacing between the two middle neighbours: one rule returns their midpoint and the other the upper one.", "Seed noise between two runs at seed 20260829, since each rule sorts its own freshly drawn sample of 1000 NPVs."]'::jsonb and answer_index = 2 and explanation = 'The sample is sorted once and both rules read it; the Best case P50 card shows the averaging rule''s 78.5315, and the EMV of 80.9836 is a separate quantity altogether.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s median NPV is 78.5315 by the averaging rule and 78.5836 by the floor rule, a difference of -0.0521. What is that gap made of?', options = '["The distance between the sample mean and the median, which the averaging rule quietly blends into its reading of the middle.", "A rounding artefact from printing money to four decimals, which vanishes once both medians are carried at full precision.", "Exactly half the spacing between the two middle neighbours: one rule returns their midpoint and the other the upper one.", "Seed noise between two runs at seed 20260829, since each rule sorts its own freshly drawn sample of 1000 NPVs."]'::jsonb, explanation = 'The sample is sorted once and both rules read it; the Best case P50 card shows the averaging rule''s 78.5315, and the EMV of 80.9836 is a separate quantity altogether.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 9: option_0, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Does the gap between the two percentile rules on ISIALA''s 1000 NPVs grow toward the tails of the sample?' and options = '["Yes: tails are sparse, so the spacing always widens away from the median, and the High case gap is therefore the largest of the three.", "Yes, on the low side only: the gap grows toward small NPVs and shrinks toward large ones on every sample the engine draws.", "No: the gap is the same at every row, because the rules differ by a fixed half step of one sorted position everywhere.", "No: it is half a random spacing, -0.0896 at the Low case, -0.0116 at the median and -0.0056 at the High case, the smallest."]'::jsonb and answer_index = 3 and explanation = 'The gap is half the space between two neighbouring sorted values, and that space is as random as the sample, so no rule of thumb places the largest gap in the tails.' then 'old'
           when prompt = 'Does the gap between the two percentile rules on ISIALA''s 1000 NPVs grow toward the tails of the sample?' and options = '["Yes: tails are sparse, so the spacing widens steadily away from the median, which makes the Low case gap the larger of the two outer ones.", "Yes, on the low side only: the gap grows toward small NPVs and shrinks toward large ones on every sample the engine draws.", "No: the gap is the same at every row, because the rules differ by a fixed half step of one sorted position everywhere.", "No: it is half a random spacing, -0.0556 at the Low case, -0.0521 at the median and -0.1142 at the High case."]'::jsonb and answer_index = 3 and explanation = 'The gap is half the space between two neighbouring sorted values, and that space is as random as the sample. Here the largest sits at the High case and the smallest at the median, which no rule of thumb predicts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Does the gap between the two percentile rules on ISIALA''s 1000 NPVs grow toward the tails of the sample?', options = '["Yes: tails are sparse, so the spacing widens steadily away from the median, which makes the Low case gap the larger of the two outer ones.", "Yes, on the low side only: the gap grows toward small NPVs and shrinks toward large ones on every sample the engine draws.", "No: the gap is the same at every row, because the rules differ by a fixed half step of one sorted position everywhere.", "No: it is half a random spacing, -0.0556 at the Low case, -0.0521 at the median and -0.1142 at the High case."]'::jsonb, explanation = 'The gap is half the space between two neighbouring sorted values, and that space is as random as the sample. Here the largest sits at the High case and the smallest at the median, which no rule of thumb predicts.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 10: option_1, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Rank these three gaps on ISIALA from smallest to largest: the rule difference at the median, the deterministic case against the medians, and seed 43''s change to the Best case P50.' and options = '["Seed 43''s change first, since both runs share 1000 iterations and the same ranges, then the rule difference, then the deterministic gap.", "The rule difference of -0.0116, then the deterministic 81.0464 below both medians, then seed 43 moving the Best case to 79.0624.", "The deterministic gap first, since a Best case P50 is built to centre on the base case, then the rule difference, then the seed 43 change.", "All three agree to the second decimal, so none of them should be preferred when a Best case P50 is quoted in a report."]'::jsonb and answer_index = 1 and explanation = 'The choice of rule changes nothing about the sample and is by far the smallest gap; the seed moves the whole-number part, so arguing over the rule settles nothing while the seed is uncontrolled.' then 'old'
           when prompt = 'Rank these three gaps on ISIALA from smallest to largest: the rule difference at the median, the deterministic case against the medians, and seed 43''s change to the Best case P50.' and options = '["Seed 43''s change first, since both runs share 1000 iterations and the same ranges, then the rule difference, then the deterministic gap.", "The rule difference of -0.0521, then seed 43 moving the Best case to 80.2233, then the deterministic 81.0464 standing above both medians.", "The deterministic gap first, since a Best case P50 is built to centre on the base case, then the rule difference, then the seed 43 change.", "All three agree to the second decimal, so none of them should be preferred when a Best case P50 is quoted in a report."]'::jsonb and answer_index = 1 and explanation = 'The choice of rule changes nothing about the sample and is by far the smallest gap. Seed 43 moves the median from 78.5315 to 80.2233, and the deterministic 81.0464 sits above both medians, 78.5315 and 78.5836.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 10;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Rank these three gaps on ISIALA from smallest to largest: the rule difference at the median, the deterministic case against the medians, and seed 43''s change to the Best case P50.', options = '["Seed 43''s change first, since both runs share 1000 iterations and the same ranges, then the rule difference, then the deterministic gap.", "The rule difference of -0.0521, then seed 43 moving the Best case to 80.2233, then the deterministic 81.0464 standing above both medians.", "The deterministic gap first, since a Best case P50 is built to centre on the base case, then the rule difference, then the seed 43 change.", "All three agree to the second decimal, so none of them should be preferred when a Best case P50 is quoted in a report."]'::jsonb, explanation = 'The choice of rule changes nothing about the sample and is by far the smallest gap. Seed 43 moves the median from 78.5315 to 80.2233, and the deterministic 81.0464 sits above both medians, 78.5315 and 78.5836.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m03 ord 11: prompt
  select case
           when prompt = 'ISIALA''s median breakeven price is 73.3297 USD per bbl and its base case at the stated medians is 71.6277. Is that the same kind of gap as the NPV''s 81.1835 against 81.1952?' and options = '["No: it compares a different quantity from a different engine, a sample of 5000 triangular draws against one solve, and neither price takes a P-label.", "Yes: 71.6277 is the median read by the floor rule and 73.3297 the median read by the averaging rule on the same breakeven sample.", "Yes: both are rule gaps, and the price gap is the larger one simply because 5000 is a bigger even count than 1000.", "No: 71.6277 is the price''s Best case P50, which the convention allows a breakeven to carry when it comes from a base case solve."]'::jsonb and answer_index = 0 and explanation = 'The base case is a single solve at the stated medians and is not a percentile of the sample; a price is quoted as 10th percentile, median and 90th percentile, so calling 71.6277 a Best case P50 puts a P-label on a price, and that is itself the error.' then 'old'
           when prompt = 'ISIALA''s median breakeven price is 73.3297 USD per bbl and its base case at the stated medians is 71.6277. Is that the same kind of gap as the NPV''s 78.5315 against 78.5836?' and options = '["No: it compares a different quantity from a different engine, a sample of 5000 triangular draws against one solve, and neither price takes a P-label.", "Yes: 71.6277 is the median read by the floor rule and 73.3297 the median read by the averaging rule on the same breakeven sample.", "Yes: both are rule gaps, and the price gap is the larger one simply because 5000 is a bigger even count than 1000.", "No: 71.6277 is the price''s Best case P50, which the convention allows a breakeven to carry when it comes from a base case solve."]'::jsonb and answer_index = 0 and explanation = 'The base case is a single solve at the stated medians and is not a percentile of the sample; a price is quoted as 10th percentile, median and 90th percentile, so calling 71.6277 a Best case P50 puts a P-label on a price, and that is itself the error.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m03 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m03 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s median breakeven price is 73.3297 USD per bbl and its base case at the stated medians is 71.6277. Is that the same kind of gap as the NPV''s 78.5315 against 78.5836?', options = '["No: it compares a different quantity from a different engine, a sample of 5000 triangular draws against one solve, and neither price takes a P-label.", "Yes: 71.6277 is the median read by the floor rule and 73.3297 the median read by the averaging rule on the same breakeven sample.", "Yes: both are rule gaps, and the price gap is the larger one simply because 5000 is a bigger even count than 1000.", "No: 71.6277 is the price''s Best case P50, which the convention allows a breakeven to carry when it comes from a base case solve."]'::jsonb, explanation = 'The base case is a single solve at the stated medians and is not a percentile of the sample; a price is quoted as 10th percentile, median and 90th percentile, so calling 71.6277 a Best case P50 puts a P-label on a price, and that is itself the error.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-two-percentile-rules' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m03 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 5: explanation
  select case
           when prompt = 'At 40 iterations the Scenario Builder as published returned an S-curve with nothing in it. What happened?' and options = '["The run threw the same TypeError as a zero range run, because a short sample leaves most histogram bins empty and the empty bins break the count.", "The step, 40 divided by 50 rounded down, was zero, so the remainder test was not a number at every index and no point was kept, with no error and no warning.", "The curve kept one point, the first sorted value, because index 0 divided by any step leaves no remainder and the loop stopped after it.", "The engine refused to draw a curve below 50 iterations as a deliberate guard on short runs, and the panel reported the refusal as a blank chart instead of printing a message."]'::jsonb and answer_index = 1 and explanation = 'That is finding S5, a silent failure: the three cases, the emv and the histogram came back beside a blank chart. The repair floors the step at 1, so 40 iterations now give 40 S-curve points.' then 'old'
           when prompt = 'At 40 iterations the Scenario Builder as published returned an S-curve with nothing in it. What happened?' and options = '["The run threw the same TypeError as a zero range run, because a short sample leaves most histogram bins empty and the empty bins break the count.", "The step, 40 divided by 50 rounded down, was zero, so the remainder test was not a number at every index and no point was kept, with no error and no warning.", "The curve kept one point, the first sorted value, because index 0 divided by any step leaves no remainder and the loop stopped after it.", "The engine refused to draw a curve below 50 iterations as a deliberate guard on short runs, and the panel reported the refusal as a blank chart instead of printing a message."]'::jsonb and answer_index = 1 and explanation = 'That is finding S5, a silent failure: the three cases, the emv and the histogram came back beside a blank chart. The repaired curve reads 51 points at fixed probabilities, so 40 iterations now give 51 points, the last of them 183.6938.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 40 iterations the Scenario Builder as published returned an S-curve with nothing in it. What happened?', options = '["The run threw the same TypeError as a zero range run, because a short sample leaves most histogram bins empty and the empty bins break the count.", "The step, 40 divided by 50 rounded down, was zero, so the remainder test was not a number at every index and no point was kept, with no error and no warning.", "The curve kept one point, the first sorted value, because index 0 divided by any step leaves no remainder and the loop stopped after it.", "The engine refused to draw a curve below 50 iterations as a deliberate guard on short runs, and the panel reported the refusal as a blank chart instead of printing a message."]'::jsonb, explanation = 'That is finding S5, a silent failure: the three cases, the emv and the histogram came back beside a blank chart. The repaired curve reads 51 points at fixed probabilities, so 40 iterations now give 51 points, the last of them 183.6938.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 6: explanation
  select case
           when prompt = 'Why is S5 described as worse than S4, although S4 stopped the run and S5 did not?' and options = '["S5 corrupted the three NPV cases as well as the curve, while S4 only affected the histogram and left every number reported beside it intact.", "S5 was never repaired, so a short run still draws nothing today, while S4 was fixed in EC3-0 and a zero range run now returns the base case.", "S4 was caught by a published golden before release, while S5 slipped past every gate because no case in the goldens ran fewer than 50 iterations at all.", "S4 threw, so a user knew something broke; S5 returned plausible numbers beside an empty chart that looked like a rendering fault."]'::jsonb and answer_index = 3 and explanation = 'A silent failure carries no signal: the cases and emv were right and only the curve was missing. Both were repaired, and 40 iterations now give 40 points.' then 'old'
           when prompt = 'Why is S5 described as worse than S4, although S4 stopped the run and S5 did not?' and options = '["S5 corrupted the three NPV cases as well as the curve, while S4 only affected the histogram and left every number reported beside it intact.", "S5 was never repaired, so a short run still draws nothing today, while S4 was fixed in EC3-0 and a zero range run now returns the base case.", "S4 was caught by a published golden before release, while S5 slipped past every gate because no case in the goldens ran fewer than 50 iterations at all.", "S4 threw, so a user knew something broke; S5 returned plausible numbers beside an empty chart that looked like a rendering fault."]'::jsonb and answer_index = 3 and explanation = 'A silent failure carries no signal: the cases and emv were right and only the curve was missing. Both were repaired, and 40 iterations now give 51 points, the last equal to the highest of the forty.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why is S5 described as worse than S4, although S4 stopped the run and S5 did not?', options = '["S5 corrupted the three NPV cases as well as the curve, while S4 only affected the histogram and left every number reported beside it intact.", "S5 was never repaired, so a short run still draws nothing today, while S4 was fixed in EC3-0 and a zero range run now returns the base case.", "S4 was caught by a published golden before release, while S5 slipped past every gate because no case in the goldens ran fewer than 50 iterations at all.", "S4 threw, so a user knew something broke; S5 returned plausible numbers beside an empty chart that looked like a rendering fault."]'::jsonb, explanation = 'A silent failure carries no signal: the cases and emv were right and only the curve was missing. Both were repaired, and 40 iterations now give 51 points, the last equal to the highest of the forty.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 7: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s 1000 iteration S-curve ends at a probability of 98.0000. Where should a reader take the highest NPV of the run from?' and options = '["From the sample itself, 149.3540 million USD, because the kept indices climb in steps of 20 and stop short of the top values, so the maximum is in the histogram but never plotted.", "From the last plotted point, which the downsample always places on the largest sorted value so that the curve spans the whole sample.", "From the High case P10 of 109.8980, which is the largest NPV the engine reports and so the value the curve''s top end represents.", "From the 98.0000 point plus the width of one histogram bin, which recovers the missing top of the curve from the bins beside it."]'::jsonb and answer_index = 0 and explanation = 'The lowest and highest values, 16.3054 and 149.3540, are read from the sample; the curve''s last point sits at 98.0000 because the kept indices climb in steps of 20 and the last one kept falls short of the end.' then 'old'
           when prompt = 'ISIALA''s 1000 iteration S-curve ends at a probability of 100.0000. Where should a reader take the highest NPV of the run from?' and options = '["From the curve''s last point, 208.9685 million USD, which the repaired curve places on the highest sorted value of the sample.", "From the sample itself, because the kept indices climb in steps of 20 and stop short of the top, leaving the maximum off the chart.", "From the High case P10 of 152.0653, which is the largest NPV the engine reports and so the value the curve''s top end represents.", "From the last point plus the width of one histogram bin, which recovers the missing top of the curve from the bins beside it."]'::jsonb and answer_index = 0 and explanation = 'The first and last points sit on the lowest and the highest value of the run, -46.1564 and 208.9685. Before the repair the curve kept one value in twenty, stopped at probability 98.0000 and never drew the maximum.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s 1000 iteration S-curve ends at a probability of 100.0000. Where should a reader take the highest NPV of the run from?', options = '["From the curve''s last point, 208.9685 million USD, which the repaired curve places on the highest sorted value of the sample.", "From the sample itself, because the kept indices climb in steps of 20 and stop short of the top, leaving the maximum off the chart.", "From the High case P10 of 152.0653, which is the largest NPV the engine reports and so the value the curve''s top end represents.", "From the last point plus the width of one histogram bin, which recovers the missing top of the curve from the bins beside it."]'::jsonb, explanation = 'The first and last points sit on the lowest and the highest value of the run, -46.1564 and 208.9685. Before the repair the curve kept one value in twenty, stopped at probability 98.0000 and never drew the maximum.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 9: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'In the published `mc_with_unreachable` breakeven tornado, every high side reads 0.0000. What does a high side of 0.0000 mean there?' and options = '["That raising capex or opex to its 90th percentile leaves the breakeven price exactly where the base case put it, because the base already sits at the bracket top.", "That the three variables have no effect on the high side, since the tornado measures from the base breakeven and a bar with no length is a variable that cannot move it.", "That the engine rounded a small positive shift down to four decimals, because at a base breakeven of 498.0372 the remaining room below 500 is tiny.", "That the solve on that side found no price inside the 500 USD per bbl bracket, and the chart wrote the null as zero: the most dangerous direction, drawn as harmless."]'::jsonb and answer_index = 3 and explanation = 'Raise capex or opex to its 90th percentile, or drop efficiency to its 10th, and the breakeven leaves the bracket; that is finding B1, and it is still the engine''s output.' then 'old'
           when prompt = 'In the published `mc_with_unreachable` breakeven tornado, every high side comes back null with its bar marked unreachable. What does a null high side mean?' and options = '["That raising capex or opex to its 90th percentile leaves the breakeven price exactly where the base case of 498.0372 put it, the bracket top and the base solve having effectively converged.", "That the three variables have no effect on the high side, since a bar with no length is a variable that cannot move the price.", "That the solve on that side was skipped to save work once 55 of 120 iterations had already been excluded from the sample.", "That no price below 500 USD per bbl breaks even at that end of the range, so the engine records no number there and flags the bar."]'::jsonb and answer_index = 3 and explanation = 'Raise capex or opex to its 90th percentile, or drop efficiency to its 10th, and the breakeven leaves the bracket. The low sides still solve, at -80.7218, -6.7689 and -26.2125.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'In the published `mc_with_unreachable` breakeven tornado, every high side comes back null with its bar marked unreachable. What does a null high side mean?', options = '["That raising capex or opex to its 90th percentile leaves the breakeven price exactly where the base case of 498.0372 put it, the bracket top and the base solve having effectively converged.", "That the three variables have no effect on the high side, since a bar with no length is a variable that cannot move the price.", "That the solve on that side was skipped to save work once 55 of 120 iterations had already been excluded from the sample.", "That no price below 500 USD per bbl breaks even at that end of the range, so the engine records no number there and flags the bar."]'::jsonb, explanation = 'Raise capex or opex to its 90th percentile, or drop efficiency to its 10th, and the breakeven leaves the bracket. The low sides still solve, at -80.7218, -6.7689 and -26.2125.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 10: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Which of the edges this module examines is still the engine''s output after the EC3-0 repairs?' and options = '["The one-sided tornado bar, finding B1: a side that cannot break even is still printed as 0.0000 with a swing of zero.", "The zero range run, finding S4, which still throws because the histogram repair was deferred to a later engines release after the course.", "The empty S-curve below 50 iterations, finding S5, which the repair only turned from a silent blank into a visible warning in the panel.", "The fit note''s wording, which still says a stated median is too near the P10 or the P90 when a belief is clamped."]'::jsonb and answer_index = 0 and explanation = 'S4 and S5 were repaired, and the fit note that used to say "too near the P10 / P90" (a P-label wrongly put on an input) now uses percentile words; B1 is the edge still open, and every high side of `mc_with_unreachable` reads 0.0000.' then 'old'
           when prompt = 'What does the breakeven engine do today with a tornado side that has no breakeven inside the 500 USD per bbl bracket?' and options = '["It returns null for that side, marks the bar unreachable, measures no swing for it, and sorts it ahead of every bar that closes.", "It draws that side at 0.0000 with a swing of zero, which sends the bar to the bottom of the chart below both reachable bars, a null having been coerced to a number before the chart arrays are built.", "It drops the variable from the tornado altogether and notes the omission in the insight sentence printed beside the chart.", "It widens the bracket above 500 USD per bbl for that one variable, so every side resolves to a price in the end."]'::jsonb and answer_index = 0 and explanation = 'That is finding B1, fixed on 2026-09-15. Before the repair an unreachable end was drawn at 0.0000 with a zero swing and its bar sorted last, so the most dangerous variable sat at the bottom of the chart.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 10;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the breakeven engine do today with a tornado side that has no breakeven inside the 500 USD per bbl bracket?', options = '["It returns null for that side, marks the bar unreachable, measures no swing for it, and sorts it ahead of every bar that closes.", "It draws that side at 0.0000 with a swing of zero, which sends the bar to the bottom of the chart below both reachable bars, a null having been coerced to a number before the chart arrays are built.", "It drops the variable from the tornado altogether and notes the omission in the insight sentence printed beside the chart.", "It widens the bracket above 500 USD per bbl for that one variable, so every side resolves to a price in the end."]'::jsonb, explanation = 'That is finding B1, fixed on 2026-09-15. Before the repair an unreachable end was drawn at 0.0000 with a zero swing and its bar sorted last, so the most dangerous variable sat at the bottom of the chart.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 11: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The three bars of the `mc_with_unreachable` tornado come back as Total CAPEX, Annual OPEX, Prod. Efficiency, although efficiency''s low side of -26.2125 is far larger than opex''s -6.7689. Why that order?' and options = '["The tornado sorts by the high side, and with all three high sides at 0.0000 it breaks the tie on the variable''s position in the belief list.", "Efficiency runs backwards, its low-price end coming from its 90th percentile, so its low side is subtracted from the swing and ranks it below opex.", "A null side gives a bar a swing of zero, every bar here has one, so the sort has nothing to sort on and the bars keep their input order.", "The sort is by the low side''s magnitude, and capex at -80.7218 leads while opex and efficiency are ranked on their stated medians instead."]'::jsonb and answer_index = 2 and explanation = 'In a tornado where the other bars had two sides, the variable that pushed the price out of the bracket would rank last, which is the reverse of its danger.' then 'old'
           when prompt = 'The bars of `mc_one_bar_unreachable` come back as Total CAPEX, Prod. Efficiency, Annual OPEX, although capex has only one solved side. Why that order?' and options = '["The bars keep the order the three beliefs were entered in, because no swing can be measured once any bar in the chart is unreachable.", "The sort reads the high side, and a null counts as larger than every solved high side, which lifts capex to the top of the chart.", "Total CAPEX is unreachable and an unreachable bar sorts first, and the two bars that do close then follow in order of swing.", "Efficiency runs backwards, so its swing is subtracted rather than added, and that is what drops it below capex in the ranking."]'::jsonb and answer_index = 2 and explanation = 'A variable that pushes the price out of the bracket is the most important thing on the chart. Prod. Efficiency reads -20.6267 and 23.0534 and Annual OPEX -6.7689 and 10.1534, so the wider of the two closed bars comes first.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The bars of `mc_one_bar_unreachable` come back as Total CAPEX, Prod. Efficiency, Annual OPEX, although capex has only one solved side. Why that order?', options = '["The bars keep the order the three beliefs were entered in, because no swing can be measured once any bar in the chart is unreachable.", "The sort reads the high side, and a null counts as larger than every solved high side, which lifts capex to the top of the chart.", "Total CAPEX is unreachable and an unreachable bar sorts first, and the two bars that do close then follow in order of swing.", "Efficiency runs backwards, so its swing is subtracted rather than added, and that is what drops it below capex in the ranking."]'::jsonb, explanation = 'A variable that pushes the price out of the bracket is the most important thing on the chart. Prod. Efficiency reads -20.6267 and 23.0534 and Annual OPEX -6.7689 and 10.1534, so the wider of the two closed bars comes first.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Where in the breakeven engine''s output is the real answer for a tornado side drawn at 0.0000?' and options = '["Nowhere, because the solver returns zero for an unreachable target and the chart only copies that value.", "In the sensitivity data, whose raw `low` and `high` prices keep the side that could not break even as null; only the tornado''s chart arrays turn it into 0.", "In the excluded count of the sample, which records 55 of 120 iterations and names, for each of them, the variable whose draw sent the breakeven price past the bracket.", "In the fit note appended to the insight, which the engine writes whenever a belief''s 90th percentile pushes a breakeven price past the top of the 500 USD per bbl bracket."]'::jsonb and answer_index = 1 and explanation = 'The engine keeps the information; read the raw pair before the bar, since null means no price inside the 500 USD per bbl bracket, not no movement.' then 'old'
           when prompt = 'Where in the breakeven engine''s output does a tornado side that could not be solved show itself?' and options = '["Nowhere, because the solver returns zero for an unreachable target and the chart arrays only copy that value onto the bar.", "In the side itself, which is null, and in the bar''s unreachable flag, with the insight naming the variable in words.", "In the excluded count of the sample, which names, for each dropped iteration, the variable whose draw sent the price past the bracket.", "In the fit note appended to the insight, which the engine writes whenever a belief''s 90th percentile pushes a price past the bracket."]'::jsonb and answer_index = 1 and explanation = 'The engine writes "Total CAPEX has no breakeven below 500 dollars a barrel at one end of its range, so that side of its bar is left open." A null means no price inside the bracket rather than no movement.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Where in the breakeven engine''s output does a tornado side that could not be solved show itself?', options = '["Nowhere, because the solver returns zero for an unreachable target and the chart arrays only copy that value onto the bar.", "In the side itself, which is null, and in the bar''s unreachable flag, with the insight naming the variable in words.", "In the excluded count of the sample, which names, for each dropped iteration, the variable whose draw sent the price past the bracket.", "In the fit note appended to the insight, which the engine writes whenever a belief''s 90th percentile pushes a price past the bracket."]'::jsonb, explanation = 'The engine writes "Total CAPEX has no breakeven below 500 dollars a barrel at one end of its range, so that side of its bar is left open." A null means no price inside the bracket rather than no movement.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 14: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'With the narrow opex belief, ISIALA''s base breakeven is 67.2301 USD per bbl while the median breakeven price is 73.1740. Why do the two describe different beliefs?' and options = '["The base case and the tornado run at the stated median of 17, while the sample draws from the clamped triangle, which cannot put its median at 17 (finding EC3-5).", "Both run on the clamped triangle, and the gap between them is only the ordinary gap between one solve at the medians and the middle of a seeded sample of 5000 solves.", "The base case uses the fitted mode of 15.1886 and the sample uses the stated median of 17, so the two sit on opposite sides of the same belief.", "The base case is solved at the 10th percentile of every input and the median of the sample at the medians, as the insight''s note explains."]'::jsonb and answer_index = 0 and explanation = 'One screen mixes two opex beliefs: 67.2301 is the stated median''s answer, and the sample median barely moves from the 73.3297 of the belief that fits because the clamped triangle cannot put its median at 17.' then 'old'
           when prompt = 'With the narrow opex belief 16 / 17 / 26, ISIALA''s base breakeven is 71.3621 USD per bbl and its median breakeven price is 73.1740. Which opex median produced the base?' and options = '["The fitted triangle''s own median of 19.8197, because an inexact fit hands the base case and the tornado the fitted percentiles.", "The stated median of 17, which the base case keeps while the sample alone draws from the clamped triangle.", "The fitted mode of 15.1886, since a clamped triangle puts its mode at its minimum and the base case solves there.", "The midpoint of the stated 16 and 26, because a clamped belief falls back to the centre of its stated range."]'::jsonb and answer_index = 0 and explanation = 'The beliefs line reports opex 16.0000 / 19.8197 / 26.0000 as fitted, and the base case, the tornado and the sample all run on that one triangle. Before the repair the base read the stated 17 and came out at 67.2301, so one result carried two beliefs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'With the narrow opex belief 16 / 17 / 26, ISIALA''s base breakeven is 71.3621 USD per bbl and its median breakeven price is 73.1740. Which opex median produced the base?', options = '["The fitted triangle''s own median of 19.8197, because an inexact fit hands the base case and the tornado the fitted percentiles.", "The stated median of 17, which the base case keeps while the sample alone draws from the clamped triangle.", "The fitted mode of 15.1886, since a clamped triangle puts its mode at its minimum and the base case solves there.", "The midpoint of the stated 16 and 26, because a clamped belief falls back to the centre of its stated range."]'::jsonb, explanation = 'The beliefs line reports opex 16.0000 / 19.8197 / 26.0000 as fitted, and the base case, the tornado and the sample all run on that one triangle. Before the repair the base read the stated 17 and came out at 67.2301, so one result carried two beliefs.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m04 ord 15: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'With the narrow belief the Annual OPEX tornado bar reads -1.4602 low and 13.2707 high, against -5.8578 and 8.8730 on the belief 16 / 20 / 26. What does that bar follow?' and options = '["The clamped triangle, swinging opex between its fitted minimum and maximum of 15.1886 and 31.0000 around the sample median of 73.1740 rather than around the base.", "The sample, taking the 10th and 90th percentiles of breakeven price under the narrow belief and measuring each of them from the base breakeven of 67.2301.", "The stated numbers: it swings opex between 16 and 26 around a base solved at 17, so a median near the bottom leaves little room below and much above.", "Nothing that changed, because a tornado moves one variable at a time and the other two beliefs are the same in both runs."]'::jsonb and answer_index = 2 and explanation = 'The tornado is part of the half of the result that reads the stated belief, the same half as the base of 67.2301, so read `exact` before quoting either beside the sample.' then 'old'
           when prompt = 'With the narrow belief the Annual OPEX tornado bar reads -5.5922 low and 9.1387 high, against -5.8578 and 8.8730 on the belief 16 / 20 / 26. What moved it?' and options = '["The stated median of 17, which the tornado keeps although the sample draws from the clamped triangle around it, so that one screen would carry two different opex beliefs at once.", "The clamped triangle''s minimum and maximum of 15.1886 and 31.0000, which the bar swings between in place of the percentiles.", "The base it is measured from: both bars swing opex between 16.0000 and 26.0000, and the narrow belief''s base sits at 71.3621.", "The sample, since the bar is the 10th and 90th percentile of breakeven price measured from the base breakeven."]'::jsonb and answer_index = 2 and explanation = 'The fitted 10th and 90th percentiles of the narrow belief are 16.0000 and 26.0000, the same ends as the belief that fits exactly. What changed is the base, from 71.6277 to 71.3621, and the bar is measured from it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m04 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m04 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'With the narrow belief the Annual OPEX tornado bar reads -5.5922 low and 9.1387 high, against -5.8578 and 8.8730 on the belief 16 / 20 / 26. What moved it?', options = '["The stated median of 17, which the tornado keeps although the sample draws from the clamped triangle around it, so that one screen would carry two different opex beliefs at once.", "The clamped triangle''s minimum and maximum of 15.1886 and 31.0000, which the bar swings between in place of the percentiles.", "The base it is measured from: both bars swing opex between 16.0000 and 26.0000, and the narrow belief''s base sits at 71.3621.", "The sample, since the bar is the 10th and 90th percentile of breakeven price measured from the base breakeven."]'::jsonb, explanation = 'The fitted 10th and 90th percentiles of the narrow belief are 16.0000 and 26.0000, the same ends as the belief that fits exactly. What changed is the base, from 71.6277 to 71.3621, and the bar is measured from it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-edges-that-used-to-break' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m04 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 1: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'NTEJE loses 123.9923 million USD at 12 percent and the screening engine reports its IRR as 1000.0000 percent. What is that number?' and options = '["A root that lies beyond the clamp, the same gentle form as `irr_beyond_clamp`, whose true root of 9900 percent the engine cuts back to 1000.", "The Newton clamp: NTEJE''s NPV never changes sign at any rate, so no IRR exists, and the engine reports the 1000 percent bound (finding S1).", "The rate the first capex half earns in its first year, which the engine reports because the 20 percent decline pulls every later year toward a loss.", "The value the derivative guard returns when the slope of NTEJE''s NPV against the rate falls below its absolute threshold on the first iteration."]'::jsonb and answer_index = 1 and explanation = 'The guard asks only whether some year is negative and some positive; nothing checks that 1000 percent makes the NPV zero, and for NTEJE no rate does. The derivative guard''s return is 10.0000, not 1000.' then 'old'
           when prompt = 'NTEJE loses 123.9923 million USD at 12 percent. What does the screening engine report for its IRR, and why?' and options = '["An IRR of 1000.0000 percent, the Newton clamp, which the engine reports whenever its iteration stops at that bound.", "irr null with irrStatus no-root, because no rate in the engine''s band drives NTEJE''s NPV to zero.", "irr null with irrStatus above-clamp, the status that says a root sits beyond 1000 percent, as `irr_beyond_clamp` records at 9900.", "irr 0.0000 percent, the value the derivative guard hands back when the slope of NPV against rate falls below its threshold."]'::jsonb and answer_index = 1 and explanation = 'The status names the reason a rate is missing, and no-root says there is none to find. NTEJE never pays back either, so its payback is null with paybackStatus not-recovered. Before the 2026-09-15 repair it reported 1000.0000 percent and a payback of 20.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'NTEJE loses 123.9923 million USD at 12 percent. What does the screening engine report for its IRR, and why?', options = '["An IRR of 1000.0000 percent, the Newton clamp, which the engine reports whenever its iteration stops at that bound.", "irr null with irrStatus no-root, because no rate in the engine''s band drives NTEJE''s NPV to zero.", "irr null with irrStatus above-clamp, the status that says a root sits beyond 1000 percent, as `irr_beyond_clamp` records at 9900.", "irr 0.0000 percent, the value the derivative guard hands back when the slope of NPV against rate falls below its threshold."]'::jsonb, explanation = 'The status names the reason a rate is missing, and no-root says there is none to find. NTEJE never pays back either, so its payback is null with paybackStatus not-recovered. Before the 2026-09-15 repair it reported 1000.0000 percent and a payback of 20.0000.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 2: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA is worth 167.4389 million USD and also reports an IRR of 1000.0000 percent. What is that rate?' and options = '["A real root past the clamp, cut back to 1000 in the same way the root of 9900 percent in `irr_beyond_clamp` is cut, because OKPOMA''s first year is already positive.", "The true rate OKPOMA earns, since a project that is cash positive before it has spent all its capex returns a rate without bound and the clamp only caps the display.", "The rate at which the 2029 cash flow of 57.8806 repays the second capex half, which the engine reports in place of the lifetime rate when the flows change sign twice.", "Not a root at all: OKPOMA''s only root is negative, its NPV stays positive at every rate from zero up, and Newton wandered upward from 10 percent until it stopped at the clamp."]'::jsonb and answer_index = 3 and explanation = 'Neither OKPOMA nor NTEJE is a root beyond the clamp; that form is `irr_beyond_clamp` at 9900 percent. The same 1000.0000 stands on a project that creates value and on one that destroys it.' then 'old'
           when prompt = 'OKPOMA is worth 167.4389 million USD and the engine reports an IRR of -54.7919 percent with irrStatus ok. How should that rate be read?' and options = '["As a failure the status word hid, since a project worth 167.4389 million USD cannot have a rate of return below zero.", "As the Newton clamp reported from the other end of the search, which the engine writes as a negative once its iteration overshoots the bound that once stood at 1000 percent.", "As a root past the clamp cut back in sign, the same form as `irr_beyond_clamp`, whose root of 9900 percent the engine also reports.", "As a root the engine solved: a cash flow that starts positive can zero its NPV at a negative rate while the project still creates value."]'::jsonb and answer_index = 3 and explanation = 'A status of ok says a rate zeroes the NPV. It never says the rate is a sensible screening number, and OKPOMA earns 9.2498 in 2027, loses 11.4786 in 2028 and earns 57.8806 in 2029.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA is worth 167.4389 million USD and the engine reports an IRR of -54.7919 percent with irrStatus ok. How should that rate be read?', options = '["As a failure the status word hid, since a project worth 167.4389 million USD cannot have a rate of return below zero.", "As the Newton clamp reported from the other end of the search, which the engine writes as a negative once its iteration overshoots the bound that once stood at 1000 percent.", "As a root past the clamp cut back in sign, the same form as `irr_beyond_clamp`, whose root of 9900 percent the engine also reports.", "As a root the engine solved: a cash flow that starts positive can zero its NPV at a negative rate while the project still creates value."]'::jsonb, explanation = 'A status of ok says a rate zeroes the NPV. It never says the rate is a sensible screening number, and OKPOMA earns 9.2498 in 2027, loses 11.4786 in 2028 and earns 57.8806 in 2029.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 3: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Three IRRs from the screening engine are return codes rather than solved rates. Which three, and what does each mean?' and options = '["1000.0000 is a root past the clamp, 10.0000 is the discount rate echoed back, and 0.0000 is a project that breaks even exactly at a zero rate of return.", "Only 1000.0000 is a code, because `irr_known_21pct` shows the solver landing exactly on round roots and a round rate is therefore as likely to be a solve as a flag.", "1000.0000 is the clamp, 10.0000 is the starting guess handed back when the derivative guard fires, and 0.0000 is the answer when no year changes sign.", "1000.0000 and 0.0000 are the ceiling and the floor of the search, while 10.0000 is a genuine root that the tiny cash flow case shares with every scaled copy of it."]'::jsonb and answer_index = 2 and explanation = '`irr_tiny_cash_flows_derivative_guard` has a golden root of 21 and the engine returns 10.0000; `irr_beyond_clamp` has a root of 9900 and returns 1000.0000.' then 'old'
           when prompt = 'The screening engine returns five values of irrStatus. Which reading of them is right?' and options = '["ok is a solved rate, and the other four all mean one thing, that Newton stopped before it converged on any value.", "no-root and no-sign-change mean a root exists but was not reached, while above-clamp means the engine capped a rate it did solve.", "ok is a solved rate, no-sign-change and no-root say no rate exists, above-clamp says a root sits past 1000 percent, and multiple-roots lists every root found.", "multiple-roots reports the first root Newton lands on, and above-clamp reports the 1000 percent bound as the project''s rate."]'::jsonb and answer_index = 2 and explanation = '`irr_two_roots` returns null with multiple-roots and irrRoots 10.0000 and 20.0000 percent, and `irr_beyond_clamp` returns null with above-clamp against a golden root of 9900. A null never arrives without a word for why.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The screening engine returns five values of irrStatus. Which reading of them is right?', options = '["ok is a solved rate, and the other four all mean one thing, that Newton stopped before it converged on any value.", "no-root and no-sign-change mean a root exists but was not reached, while above-clamp means the engine capped a rate it did solve.", "ok is a solved rate, no-sign-change and no-root say no rate exists, above-clamp says a root sits past 1000 percent, and multiple-roots lists every root found.", "multiple-roots reports the first root Newton lands on, and above-clamp reports the 1000 percent bound as the project''s rate."]'::jsonb, explanation = '`irr_two_roots` returns null with multiple-roots and irrRoots 10.0000 and 20.0000 percent, and `irr_beyond_clamp` returns null with above-clamp against a golden root of 9900. A null never arrives without a word for why.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 4: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s High scenario is worth 237.8860 million USD and reports an IRR of 0.0000 percent and a payback of 0.0000, beside a Base case IRR of 53.7148 percent. Why?' and options = '["No year of the High case is negative, so the IRR guard finds no sign change and returns 0, and payback reads 0 because the first cumulative is already positive (finding EC3-2).", "The High case pushes the IRR past the 1000 percent clamp, and the engine resets an overflowing Newton iteration to zero instead of reporting the bound as it does for OKPOMA and for NTEJE.", "Scenario IRRs are not computed at all, and 0.0000 is the placeholder the scenario table fills for every case other than the Base, whose rate comes from the deterministic run.", "Cutting capex to 0.8 of the base removes the capex half the rate is measured against, so the IRR is undefined and printed as its default."]'::jsonb and answer_index = 0 and explanation = 'The Low scenario reports -3.5758 percent, so scenarios do solve an IRR; the High case''s maxExposure of 27.7707 is positive, which is the tell. The best of the three cases reads as the worst IRR.' then 'old'
           when prompt = 'ISIALA''s High scenario is worth 226.0140 million USD and its IRR comes back null with irrStatus no-sign-change, beside a Base case IRR of 53.7148 percent. Why?' and options = '["No year of the High case is negative, so there is no sign change for a root to sit at, and the engine says so rather than printing a rate.", "The High case pushes the rate past the 1000 percent clamp, and the engine returns null rather than report a bound it cannot verify, making the status a ceiling rather than an absent sign change.", "Scenario IRRs are not computed at all, and a null is what the scenario table holds for every case other than the Base.", "Cutting capex to 0.8 of the base removes the spend the rate is measured against, so the IRR is undefined and reported as null."]'::jsonb and answer_index = 0 and explanation = 'The Low scenario solves to -0.6992 percent, so scenarios do solve an IRR. The High case''s maxExposure of 25.0565 is positive, which is the tell. Before the 2026-09-15 repair this case reported an IRR of 0.0000 with no status word.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s High scenario is worth 226.0140 million USD and its IRR comes back null with irrStatus no-sign-change, beside a Base case IRR of 53.7148 percent. Why?', options = '["No year of the High case is negative, so there is no sign change for a root to sit at, and the engine says so rather than printing a rate.", "The High case pushes the rate past the 1000 percent clamp, and the engine returns null rather than report a bound it cannot verify, making the status a ceiling rather than an absent sign change.", "Scenario IRRs are not computed at all, and a null is what the scenario table holds for every case other than the Base.", "Cutting capex to 0.8 of the base removes the spend the rate is measured against, so the IRR is undefined and reported as null."]'::jsonb, explanation = 'The Low scenario solves to -0.6992 percent, so scenarios do solve an IRR. The High case''s maxExposure of 25.0565 is positive, which is the tell. Before the 2026-09-15 repair this case reported an IRR of 0.0000 with no status word.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 5: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A portfolio screen ranks projects by IRR and passes any rate above a 12 percent hurdle. What happens to NTEJE, and what should be read first?' and options = '["It ranks at the bottom, because the screen treats a rate sitting at the clamp as a missing value and places any missing IRR below every solved rate in the portfolio, whatever its NPV.", "It drops out, since a payback of 20.0000 years equals the project life and an IRR screen removes any project that never pays back before ranking the rest.", "It ranks at the top and passes on 1000.0000 percent while losing 123.9923 million USD; read the NPV, the final cumulative of -154.5906 and the sign of every year before the IRR.", "It ranks beside ISIALA, since a magnitude check that rejects rates above 100 percent treats both as flags and removes them from the ranking together."]'::jsonb and answer_index = 2 and explanation = 'A reader who rejects 1000.0000 as absurd has caught it; a screen that trusts the rate has put a value-destroying project first. ISIALA''s 53.7148 percent is a solved rate and no flag.' then 'old'
           when prompt = 'A portfolio screen ranks projects by IRR and passes any rate above a 12 percent hurdle. What does NTEJE do to it now, and what should be read first?' and options = '["It ranks at the top on 1000.0000 percent while losing money, which is why such a screen has to reject any rate above 100 percent.", "It drops out, since an IRR screen removes any project whose paybackStatus reads not-recovered before ranking the rest.", "It carries no rate to rank on at all, so the screen falls back on the NPV of -123.9923 and the final cumulative of -154.5906.", "It ranks beside ISIALA, since a null is sorted as a zero and a zero clears no hurdle while still holding its place in the list."]'::jsonb and answer_index = 2 and explanation = 'NTEJE''s IRR is null with irrStatus no-root, so there is nothing to set against a hurdle. ISIALA''s 53.7148 percent is a solved rate with irrStatus ok. Before the repair the same project ranked first on the clamp.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A portfolio screen ranks projects by IRR and passes any rate above a 12 percent hurdle. What does NTEJE do to it now, and what should be read first?', options = '["It ranks at the top on 1000.0000 percent while losing money, which is why such a screen has to reject any rate above 100 percent.", "It drops out, since an IRR screen removes any project whose paybackStatus reads not-recovered before ranking the rest.", "It carries no rate to rank on at all, so the screen falls back on the NPV of -123.9923 and the final cumulative of -154.5906.", "It ranks beside ISIALA, since a null is sorted as a zero and a zero clears no hurdle while still holding its place in the list."]'::jsonb, explanation = 'NTEJE''s IRR is null with irrStatus no-root, so there is nothing to set against a hurdle. ISIALA''s 53.7148 percent is a solved rate with irrStatus ok. Before the repair the same project ranked first on the clamp.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 6: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA''s cumulative is 9.2498 million USD after 2027 and -2.2287 after 2028, and its payback reads 0.0000. Why?' and options = '["Every OKPOMA year is cash positive once royalty and tax are taken, so, as with ISIALA''s High scenario, the cumulative never crosses zero and payback falls back to its printed default of 0.0000.", "Payback is measured on cash flow discounted mid-year at OKPOMA''s 10 percent rate, and the discounted cumulative never drops below zero even though the undiscounted one does fall below zero in 2028.", "Payback counts from the last capex year, and the cumulative is already positive by the end of 2029, so no further years are needed after the spend ends.", "Payback is taken at the first year whose cumulative is non-negative and never revisited, so the second capex half taking the cumulative below zero in 2028 is ignored (finding EC3-1)."]'::jsonb and answer_index = 3 and explanation = 'OKPOMA''s 2028 net cash flow is -11.4786, so not every year is positive. A payback of 0.0000 beside a maxExposure of -2.2287 is the tell.' then 'old'
           when prompt = 'OKPOMA''s cumulative is 9.2498 million USD after 2027 and -2.2287 after 2028. What does the engine report for its payback?' and options = '["payback 0.0000 with paybackStatus ok, because the first crossing is all the engine records and it is never revisited.", "payback 2.0385 years with paybackStatus ok, since the engine reports the crossing that holds rather than the one that reverses.", "payback null with paybackStatus not-recovered, because a cumulative that falls back below zero has not recovered at all.", "payback 0.0000 with paybackStatus recrossed, and paybackLast 2.0385 for the year it turns non-negative for good."]'::jsonb and answer_index = 3 and explanation = 'Payback is the FIRST crossing, which is index 0, and the status says the cumulative later went back below zero. The derived check is 2 + 2.2287 / 57.8806 = 2.0385.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA''s cumulative is 9.2498 million USD after 2027 and -2.2287 after 2028. What does the engine report for its payback?', options = '["payback 0.0000 with paybackStatus ok, because the first crossing is all the engine records and it is never revisited.", "payback 2.0385 years with paybackStatus ok, since the engine reports the crossing that holds rather than the one that reverses.", "payback null with paybackStatus not-recovered, because a cumulative that falls back below zero has not recovered at all.", "payback 0.0000 with paybackStatus recrossed, and paybackLast 2.0385 for the year it turns non-negative for good."]'::jsonb, explanation = 'Payback is the FIRST crossing, which is index 0, and the status says the cumulative later went back below zero. The derived check is 2 + 2.2287 / 57.8806 = 2.0385.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m05 ord 15: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Scenario Builder sample has a Low case P90 of 48.7439 million USD and a lowest NPV of 16.3054, while the Low scenario loses 72.1531. Why does no iteration come near the Low scenario?' and options = '["1000 iterations are too few to reach the far tail, and a run of 20000 at the same seed would place a handful of iterations near the Low scenario''s loss of 72.1531 million USD.", "The ranges of plus or minus 20 percent are applied to the NPV rather than the inputs, so no iteration can fall more than a fifth below the base.", "Each value is drawn independently per year per array, so a whole life of low prices almost never occurs, and price, reserves and capex never move against the project together.", "The Low scenario scales fixed opex by 1.2, and the sampler would reach it if an opex range were typed, since opex is the input the three ranges leave out."]'::jsonb and answer_index = 2 and explanation = 'The Scenario Builder never samples opex, royalty or tax whatever ranges are typed, and the lowest draw of 16.3054 already sits far below a fifth off the base; independence narrows the spread.' then 'old'
           when prompt = 'ISIALA''s Scenario Builder sample has a Low case P90 of 15.6063 million USD and a lowest NPV of -46.1564, while the Low scenario loses 57.8151. Why does no iteration reach the Low scenario?' and options = '["1000 iterations are too few to reach the far tail, and a run of 20000 at the same seed would place iterations near -57.8151.", "The ranges of plus or minus 20 percent are applied to the NPV rather than to the inputs, so no iteration can fall a fifth below the base of 81.0464 million USD.", "A corner needs every input bad at once, and nothing in the sampler makes one: its three factors are unrelated draws, and fixed opex is not among them.", "Each year of each array is drawn on its own, so a whole life of low prices cancels out across the twenty years of the case."]'::jsonb and answer_index = 2 and explanation = 'One factor does carry a whole life, which is why iterations lose money and the lowest reaches -46.1564. The scenario moves price, production and variable opex to 0.8 and capex and fixed opex to 1.2 in one move, and the sampler never touches fixed opex.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m05 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m05 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Scenario Builder sample has a Low case P90 of 15.6063 million USD and a lowest NPV of -46.1564, while the Low scenario loses 57.8151. Why does no iteration reach the Low scenario?', options = '["1000 iterations are too few to reach the far tail, and a run of 20000 at the same seed would place iterations near -57.8151.", "The ranges of plus or minus 20 percent are applied to the NPV rather than to the inputs, so no iteration can fall a fifth below the base of 81.0464 million USD.", "A corner needs every input bad at once, and nothing in the sampler makes one: its three factors are unrelated draws, and fixed opex is not among them.", "Each year of each array is drawn on its own, so a whole life of low prices cancels out across the twenty years of the case."]'::jsonb, explanation = 'One factor does carry a whole life, which is why iterations lose money and the lowest reaches -46.1564. The scenario moves price, production and variable opex to 0.8 and capex and fixed opex to 1.2 in one move, and the sampler never touches fixed opex.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m05 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 1: explanation
  select case
           when prompt = 'Worked on ISIALA, in what order does the tier''s method take a graded probabilistic case?' and options = '["The breakeven price first, since its base solve needs no seed, then the deterministic case, then the outcomes and the edges read together.", "The edges first, reading every fit and every tornado side before anything else, because a clamped fit would change each number that follows it.", "The outcomes first, since the Monte Carlo carries the deterministic case as its Best case P50 and so makes a separate deterministic run redundant.", "The deterministic case, then the Monte Carlo outcomes with their labels, then the breakeven price in percentile words, then every edge."]'::jsonb and answer_index = 3 and explanation = 'The deterministic case is not the Best case P50: ISIALA''s NPV is 81.0464 million USD and its Best case P50 is 81.1835, so each is run and written in its place.' then 'old'
           when prompt = 'Worked on ISIALA, in what order does the tier''s method take a graded probabilistic case?' and options = '["The breakeven price first, since its base solve needs no seed, then the deterministic case, then the outcomes and the edges read together.", "The edges first, reading every fit and every tornado side before anything else, because a clamped fit would change each number that follows it.", "The outcomes first, since the Monte Carlo carries the deterministic case as its Best case P50 and so makes a separate deterministic run redundant.", "The deterministic case, then the Monte Carlo outcomes with their labels, then the breakeven price in percentile words, then every edge."]'::jsonb and answer_index = 3 and explanation = 'The deterministic case is not the Best case P50: ISIALA''s NPV is 81.0464 million USD and its Best case P50 is 78.5315, so each is run and written in its place.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Worked on ISIALA, in what order does the tier''s method take a graded probabilistic case?', options = '["The breakeven price first, since its base solve needs no seed, then the deterministic case, then the outcomes and the edges read together.", "The edges first, reading every fit and every tornado side before anything else, because a clamped fit would change each number that follows it.", "The outcomes first, since the Monte Carlo carries the deterministic case as its Best case P50 and so makes a separate deterministic run redundant.", "The deterministic case, then the Monte Carlo outcomes with their labels, then the breakeven price in percentile words, then every edge."]'::jsonb, explanation = 'The deterministic case is not the Best case P50: ISIALA''s NPV is 81.0464 million USD and its Best case P50 is 78.5315, so each is run and written in its place.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 2: option_1, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s deterministic case returns an IRR of 53.7148 percent and a payback of 3.2746 years. What check does the method ask before either is quoted?' and options = '["That the IRR exceeds the 12 percent discount rate and the payback falls inside the capex years, which together confirm a solved rate.", "That the IRR is none of the return codes 1000.0000, 10.0000 or 0.0000, and that the cumulative crosses zero once, from -8.6381 in 2029 to 22.8165 in 2030, and stays positive.", "That the IRR and the NPV agree in sign and the payback is shorter than the 20 year life, the two conditions a return code always fails.", "That both reproduce under a second seed, since a deterministic metric that moved with the seed would have been drawn from the sample."]'::jsonb and answer_index = 1 and explanation = 'A clamp, a starting guess or a no sign change zero is not a rate, and a payback taken at a first crossing that later reverses is finding EC3-1; ISIALA passes both checks.' then 'old'
           when prompt = 'ISIALA''s deterministic case returns an IRR of 53.7148 percent and a payback of 3.2746 years. What check does the method ask before either is quoted?' and options = '["That the IRR exceeds the 12 percent discount rate and the payback falls inside the capex years, which together confirm a solved rate.", "That irrStatus reads ok and paybackStatus reads ok, with the cumulative crossing zero once, from -8.6381 in 2029 to 22.8165 in 2030.", "That the IRR and the NPV agree in sign and the payback is shorter than the 20 year life, the two conditions a failed solve always breaks.", "That both reproduce under a second seed, since a deterministic metric that moved with the seed would have been drawn from the sample."]'::jsonb and answer_index = 1 and explanation = 'A null IRR always arrives with a word for why, and a payback taken at a first crossing that later reverses reads recrossed, as OKPOMA''s does. ISIALA passes both checks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s deterministic case returns an IRR of 53.7148 percent and a payback of 3.2746 years. What check does the method ask before either is quoted?', options = '["That the IRR exceeds the 12 percent discount rate and the payback falls inside the capex years, which together confirm a solved rate.", "That irrStatus reads ok and paybackStatus reads ok, with the cumulative crossing zero once, from -8.6381 in 2029 to 22.8165 in 2030.", "That the IRR and the NPV agree in sign and the payback is shorter than the 20 year life, the two conditions a failed solve always breaks.", "That both reproduce under a second seed, since a deterministic metric that moved with the seed would have been drawn from the sample."]'::jsonb, explanation = 'A null IRR always arrives with a word for why, and a payback taken at a first crossing that later reverses reads recrossed, as OKPOMA''s does. ISIALA passes both checks.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 3: prompt, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'An ISIALA result shows 109.8980 million USD under P90. What does the method say about it?' and options = '["It is correct under the SPE PRMS reading, since P90 names the value that a 90 percent chance of success requires, and on an NPV that is the large one.", "It reflects the other percentile rule, since the breakeven rule that floors the index on the same sample moves the Low case to the upper end of the three values.", "Its labels are swapped: the Low case P90 holds the smallest NPV, 48.7439 under engine key `p10`, and 109.8980 is the High case P10 under key `p90`.", "It is right for engine key `p90`, and a P-label is only the engine key read aloud, so the two may be written interchangeably."]'::jsonb and answer_index = 2 and explanation = 'The panel that shipped before EC3-0 printed 109.8980 under "P90 (Conservative)". The engine key is a plain percentile and reading it aloud as a P-label is exactly the mistake examined.' then 'old'
           when prompt = 'An ISIALA result shows 152.0653 million USD under P90. What does the method say about it?' and options = '["It is correct under the SPE PRMS reading, since P90 names the value that a 90 percent chance of success requires, and on an NPV that is the large one.", "It reflects the other percentile rule, since the breakeven rule that floors the index on the same sample moves the Low case to the upper end of the three values.", "Its labels are swapped: the Low case P90 holds the smallest NPV, 15.6063 under engine key `p10`, and 152.0653 is the High case P10 under key `p90`.", "It is right for engine key `p90`, and a P-label is only the engine key read aloud, so the two may be written interchangeably."]'::jsonb and answer_index = 2 and explanation = 'The panel that shipped before EC3-0 printed 152.0653 under "P90 (Conservative)". The engine key is a plain percentile and reading it aloud as a P-label is exactly the mistake examined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An ISIALA result shows 152.0653 million USD under P90. What does the method say about it?', options = '["It is correct under the SPE PRMS reading, since P90 names the value that a 90 percent chance of success requires, and on an NPV that is the large one.", "It reflects the other percentile rule, since the breakeven rule that floors the index on the same sample moves the Low case to the upper end of the three values.", "Its labels are swapped: the Low case P90 holds the smallest NPV, 15.6063 under engine key `p10`, and 152.0653 is the High case P10 under key `p90`.", "It is right for engine key `p90`, and a P-label is only the engine key read aloud, so the two may be written interchangeably."]'::jsonb, explanation = 'The panel that shipped before EC3-0 printed 152.0653 under "P90 (Conservative)". The engine key is a plain percentile and reading it aloud as a P-label is exactly the mistake examined.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 4: prompt, option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why does the method quote ISIALA''s Low case P90 of 48.7439 million USD together with the screening engine that produced it?' and options = '["On the same 1000 NPVs the breakeven rule puts the Low case at 48.8335, so the value depends on which percentile rule read the sample.", "Because the breakeven engine cannot read an NPV sample at all, so 48.7439 is the only Low case that exists for ISIALA.", "Because the screening engine draws from a different seed than the breakeven engine, and the seed decides which 1000 NPVs were drawn.", "Because 48.7439 is discounted at year end while the breakeven engine discounts mid-year, and the convention has to be named beside it."]'::jsonb and answer_index = 0 and explanation = 'Both engines default to seed 20260829 and the screening engine discounts mid-year; the difference of the two Low cases comes from averaging two neighbours against flooring the index.' then 'old'
           when prompt = 'Why does the method quote ISIALA''s Low case P90 of 15.6063 million USD together with the screening engine that produced it?' and options = '["On the same 1000 NPVs the breakeven rule puts the Low case at 15.6619, so the value depends on which percentile rule read the sample.", "Because the breakeven engine cannot read an NPV sample at all, so 15.6063 is the only Low case that exists for ISIALA.", "Because the screening engine draws from a different seed than the breakeven engine, and the seed decides which 1000 NPVs were drawn.", "Because 15.6063 is discounted at year end while the breakeven engine discounts mid-year, and the convention has to be named beside it."]'::jsonb and answer_index = 0 and explanation = 'Both engines default to seed 20260829 and the screening engine discounts mid-year; the difference of the two Low cases comes from averaging two neighbours against flooring the index.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does the method quote ISIALA''s Low case P90 of 15.6063 million USD together with the screening engine that produced it?', options = '["On the same 1000 NPVs the breakeven rule puts the Low case at 15.6619, so the value depends on which percentile rule read the sample.", "Because the breakeven engine cannot read an NPV sample at all, so 15.6063 is the only Low case that exists for ISIALA.", "Because the screening engine draws from a different seed than the breakeven engine, and the seed decides which 1000 NPVs were drawn.", "Because 15.6063 is discounted at year end while the breakeven engine discounts mid-year, and the convention has to be named beside it."]'::jsonb, explanation = 'Both engines default to seed 20260829 and the screening engine discounts mid-year; the difference of the two Low cases comes from averaging two neighbours against flooring the index.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 6: option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What does reading the edges of ISIALA''s breakeven result find?' and options = '["The opex fit is inexact, because a 10th percentile of 16 against a median of 20 sits too near the bottom of the band for any triangular to pass through.", "The efficiency bar has one side at 0.0000, since efficiency runs backwards and its high-price end cannot break even inside the 500 USD per bbl bracket.", "Every fit''s `exact` flag is true and every tornado bar has two sides, Total CAPEX -7.0202 and 9.4067 among them, with no side at 0.0000.", "Nothing worth writing down, since edges only matter on the published golden cases and a teaching field is built so that none of them can occur."]'::jsonb and answer_index = 2 and explanation = 'Opex 16 / 20 / 26 has a shape ratio of 0.400000, inside 0.381966 to 0.618034, and Prod. Efficiency reads -3.7306 and 5.0561; had a fit been inexact or a side zero, the answer would say so in words.' then 'old'
           when prompt = 'What does reading the edges of ISIALA''s breakeven result find?' and options = '["The opex fit is inexact, because a 10th percentile of 16 against a median of 20 sits too near the bottom of the band for any triangular.", "The efficiency bar is unreachable, since efficiency runs backwards and its high-price end finds no breakeven inside the 500 USD per bbl bracket.", "Every fit''s `exact` flag is true and every tornado bar solves on both sides, Total CAPEX -7.0202 and 9.4067 among them, with no bar unreachable.", "Nothing worth writing down, since edges only matter on the published golden cases and a teaching field is built so none can occur."]'::jsonb and answer_index = 2 and explanation = 'Opex 16 / 20 / 26 has a shape ratio of 0.400000, inside 0.381966 to 0.618034, and Prod. Efficiency reads -3.7306 and 5.0561. Had a fit been inexact or a bar unreachable, the answer would say so in words.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does reading the edges of ISIALA''s breakeven result find?', options = '["The opex fit is inexact, because a 10th percentile of 16 against a median of 20 sits too near the bottom of the band for any triangular.", "The efficiency bar is unreachable, since efficiency runs backwards and its high-price end finds no breakeven inside the 500 USD per bbl bracket.", "Every fit''s `exact` flag is true and every tornado bar solves on both sides, Total CAPEX -7.0202 and 9.4067 among them, with no bar unreachable.", "Nothing worth writing down, since edges only matter on the published golden cases and a teaching field is built so none can occur."]'::jsonb, explanation = 'Opex 16 / 20 / 26 has a shape ratio of 0.400000, inside 0.381966 to 0.618034, and Prod. Efficiency reads -3.7306 and 5.0561. Had a fit been inexact or a bar unreachable, the answer would say so in words.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 7: explanation
  select case
           when prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?' and options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the digest to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb and answer_index = 1 and explanation = 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 109.8980 shown first is a wrong answer with right numbers.' then 'old'
           when prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?' and options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the digest to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb and answer_index = 1 and explanation = 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 152.0653 shown first is a wrong answer with right numbers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?', options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the digest to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb, explanation = 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 152.0653 shown first is a wrong answer with right numbers.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 8: option_1, explanation
  select case
           when prompt = 'If ISIALA were rerun at seed 43 with every other setting the same, which results would not change?' and options = '["Only the deterministic NPV, since every breakeven number the analyzer prints, the base included, is computed by solving on the sampled triangles.", "The Best case P50 of 81.1835, since the median of 1000 NPVs is stable and only the tails of the sample move with the seed.", "Every result, since the seed only reorders the draws, and a sorted sample of 1000 NPVs is the same whatever order its values were drawn from the generator in.", "The deterministic NPV of 81.0464, the base breakeven of 71.6277, the fits and the tornado sides, since none of them is drawn from the sample."]'::jsonb and answer_index = 3 and explanation = 'At seed 43 the Best case P50 is 79.0624 against 81.1835. The tornado moves one stated belief at a time with the others at their medians, so it is a solve and not a draw.' then 'old'
           when prompt = 'If ISIALA were rerun at seed 43 with every other setting the same, which results would not change?' and options = '["Only the deterministic NPV, since every breakeven number the analyzer prints, the base included, is computed by solving on the sampled triangles.", "The Best case P50 of 78.5315, since the median of 1000 NPVs is stable and only the tails of the sample move with the seed.", "Every result, since the seed only reorders the draws, and a sorted sample of 1000 NPVs is the same whatever order its values were drawn from the generator in.", "The deterministic NPV of 81.0464, the base breakeven of 71.6277, the fits and the tornado sides, since none of them is drawn from the sample."]'::jsonb and answer_index = 3 and explanation = 'At seed 43 the Best case P50 is 80.2233 against 78.5315. The tornado moves one stated belief at a time with the others at their medians, so it is a solve and not a draw.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'If ISIALA were rerun at seed 43 with every other setting the same, which results would not change?', options = '["Only the deterministic NPV, since every breakeven number the analyzer prints, the base included, is computed by solving on the sampled triangles.", "The Best case P50 of 78.5315, since the median of 1000 NPVs is stable and only the tails of the sample move with the seed.", "Every result, since the seed only reorders the draws, and a sorted sample of 1000 NPVs is the same whatever order its values were drawn from the generator in.", "The deterministic NPV of 81.0464, the base breakeven of 71.6277, the fits and the tornado sides, since none of them is drawn from the sample."]'::jsonb, explanation = 'At seed 43 the Best case P50 is 80.2233 against 78.5315. The tornado moves one stated belief at a time with the others at their medians, so it is a solve and not a draw.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 9: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Of the findings this tier names (S4, S5, B1, S1 and EC3-1), which describe the engine''s output after EC3-0?' and options = '["Only B1, since EC3-0 repaired every screening engine finding along with the Monte Carlo seed, the IRR clamp and the payback taken at the first crossing among them.", "S4 and S5, since EC3-0 only rewrote the percentile labels on the two apps'' panels and left every numerical defect in both engines for the owner to decide.", "S1 alone, since B1 was repaired together with the fit note wording and EC3-1 was recorded as an observation rather than a defect.", "B1, S1 and EC3-1: a tornado side is still drawn at 0.0000, the IRR still reports its clamp, and payback is still not revisited; only S4 and S5 were repaired."]'::jsonb and answer_index = 3 and explanation = 'EC3-0 seeded the Monte Carlo and repaired S4 and S5; NTEJE still reports 1000.0000 percent, OKPOMA still reports a payback of 0.0000, and every high side of `mc_with_unreachable` still reads 0.0000.' then 'old'
           when prompt = 'Of the findings this tier names (S4, S5, B1, S1 and EC3-1), which still describe the engine''s output?' and options = '["B1, S1 and EC3-1, since a tornado side is still drawn at 0.0000, the IRR still reports its clamp and payback is still not revisited.", "S4 and S5, since the repairs changed only the percentile labels on the two panels and left both numerical faults in the engines.", "S1 alone, since the IRR clamp was left for the owner to decide while B1 and EC3-1 were repaired along with the rest.", "None of them: every one has been repaired, and each shows up now as the behaviour that replaced it rather than as a live defect."]'::jsonb and answer_index = 3 and explanation = 'Zero ranges return 81.0464 in all three cases, forty iterations give 51 S-curve points, an unreachable tornado side is null and sorts first, NTEJE''s IRR is null with no-root, and OKPOMA''s payback carries recrossed with paybackLast 2.0385.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Of the findings this tier names (S4, S5, B1, S1 and EC3-1), which still describe the engine''s output?', options = '["B1, S1 and EC3-1, since a tornado side is still drawn at 0.0000, the IRR still reports its clamp and payback is still not revisited.", "S4 and S5, since the repairs changed only the percentile labels on the two panels and left both numerical faults in the engines.", "S1 alone, since the IRR clamp was left for the owner to decide while B1 and EC3-1 were repaired along with the rest.", "None of them: every one has been repaired, and each shows up now as the behaviour that replaced it rather than as a live defect."]'::jsonb, explanation = 'Zero ranges return 81.0464 in all three cases, forty iterations give 51 S-curve points, an unreachable tornado side is null and sorts first, NTEJE''s IRR is null with no-root, and OKPOMA''s payback carries recrossed with paybackLast 2.0385.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 11: prompt, explanation
  select case
           when prompt = 'ISIALA''s NPV reads 81.0464 or 76.5817 million USD, and its Low case P90 reads 48.7439 or 48.8335. Which statement is right?' and options = '["One of each pair is wrong, and the method is to quote the larger NPV and the smaller Low case, which together make the conservative reading.", "The pairs are rounding differences, and at two decimals the two Low cases agree, which is the precision a decision needs anyway.", "Each is right for its own question: the NPVs differ by discounting convention on the same rows, the Low cases by percentile rule on the same sample.", "The first of each pair is the screening engine''s and the second comes from Petroleum Economics Studio, which discounts at year end and floors its index."]'::jsonb and answer_index = 2 and explanation = '81.0464 is mid-year and 76.5817 year end on identical rows, a ratio of 1.058301; 48.7439 averages two neighbours and 48.8335 floors the index. None is right without its method.' then 'old'
           when prompt = 'ISIALA''s NPV reads 81.0464 or 76.5817 million USD, and its Low case P90 reads 15.6063 or 15.6619. Which statement is right?' and options = '["One of each pair is wrong, and the method is to quote the larger NPV and the smaller Low case, which together make the conservative reading.", "The pairs are rounding differences, and at two decimals the two Low cases agree, which is the precision a decision needs anyway.", "Each is right for its own question: the NPVs differ by discounting convention on the same rows, the Low cases by percentile rule on the same sample.", "The first of each pair is the screening engine''s and the second comes from Petroleum Economics Studio, which discounts at year end and floors its index."]'::jsonb and answer_index = 2 and explanation = '81.0464 is mid-year and 76.5817 year end on identical rows, a ratio of 1.058301; 15.6063 averages two neighbours and 15.6619 floors the index. None is right without its method.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s NPV reads 81.0464 or 76.5817 million USD, and its Low case P90 reads 15.6063 or 15.6619. Which statement is right?', options = '["One of each pair is wrong, and the method is to quote the larger NPV and the smaller Low case, which together make the conservative reading.", "The pairs are rounding differences, and at two decimals the two Low cases agree, which is the precision a decision needs anyway.", "Each is right for its own question: the NPVs differ by discounting convention on the same rows, the Low cases by percentile rule on the same sample.", "The first of each pair is the screening engine''s and the second comes from Petroleum Economics Studio, which discounts at year end and floors its index."]'::jsonb, explanation = '81.0464 is mid-year and 76.5817 year end on identical rows, a ratio of 1.058301; 15.6063 averages two neighbours and 15.6619 floors the index. None is right without its method.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_m06 ord 14: prompt, explanation
  select case
           when prompt = 'What must stand beside ISIALA''s Best case P50 of 81.1835 million USD for the method to count it as a number?' and options = '["The settings that produced it, 1000 iterations with price, capex and reserves each plus or minus 20 percent at seed 20260829, and the screening engine''s percentile rule.", "Its standard error and the iteration count at which the median settled, which the Scenario Builder reports beside each of its three cases.", "The deterministic NPV of 81.0464 as its benchmark, since a Best case P50 that differs from the deterministic value signals a sampling error.", "The breakeven price at the same seed, since the two engines share one sample and each NPV case is only valid beside its own price."]'::jsonb and answer_index = 0 and explanation = 'A probabilistic number without its label, its rule, its settings and its seed is not a number. The Best case P50 and the deterministic NPV differ by design, 81.1835 against 81.0464.' then 'old'
           when prompt = 'What must stand beside ISIALA''s Best case P50 of 78.5315 million USD for the method to count it as a number?' and options = '["The settings that produced it, 1000 iterations with price, capex and reserves each plus or minus 20 percent at seed 20260829, and the screening engine''s percentile rule.", "Its standard error and the iteration count at which the median settled, which the Scenario Builder reports beside each of its three cases.", "The deterministic NPV of 81.0464 as its benchmark, since a Best case P50 that differs from the deterministic value signals a sampling error.", "The breakeven price at the same seed, since the two engines share one sample and each NPV case is only valid beside its own price."]'::jsonb and answer_index = 0 and explanation = 'A probabilistic number without its label, its rule, its settings and its seed is not a number. The Best case P50 and the deterministic NPV differ by design, 78.5315 against 81.0464.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_m06 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_m06 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What must stand beside ISIALA''s Best case P50 of 78.5315 million USD for the method to count it as a number?', options = '["The settings that produced it, 1000 iterations with price, capex and reserves each plus or minus 20 percent at seed 20260829, and the screening engine''s percentile rule.", "Its standard error and the iteration count at which the median settled, which the Scenario Builder reports beside each of its three cases.", "The deterministic NPV of 81.0464 as its benchmark, since a Best case P50 that differs from the deterministic value signals a sampling error.", "The breakeven price at the same seed, since the two engines share one sample and each NPV case is only valid beside its own price."]'::jsonb, explanation = 'A probabilistic number without its label, its rule, its settings and its seed is not a number. The Best case P50 and the deterministic NPV differ by design, 78.5315 against 81.0464.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_m06 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 1: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Scenario Builder run returns 48.7439 under engine key `p10` and 109.8980 under `p90`. Which P-label does the Low case print, and which number does it hold?' and options = '["P10, holding 48.7439, because a case takes its label from the engine key it reads and that key is the 10th percentile.", "P90, holding 109.8980, because the 90th percentile of the sorted NPVs is the value the label for ninety names.", "P90, holding 48.7439, the value that 90 percent of the 1000 sampled NPVs meet or exceed.", "P50, holding 81.1835, because a Low case in the Suite is the median of the draws that fall below the deterministic case."]'::jsonb and answer_index = 2 and explanation = 'Under the exceedance meaning P90 is the smallest of the three and reads the `p10` key, while the High case P10 reads `p90` and holds 109.8980.' then 'old'
           when prompt = 'ISIALA''s Scenario Builder run returns 15.6063 under engine key `p10` and 152.0653 under `p90`. Which P-label does the Low case print, and which number does it hold?' and options = '["P10, holding 15.6063, because a case takes its label from the engine key it reads and that key is the 10th percentile.", "P90, holding 152.0653, because the 90th percentile of the sorted NPVs is the value the label for ninety names.", "P90, holding 15.6063, the value that 90 percent of the 1000 sampled NPVs meet or exceed.", "P50, holding 78.5315, because a Low case in the Suite is the median of the draws that fall below the deterministic case."]'::jsonb and answer_index = 2 and explanation = 'Under the exceedance meaning P90 is the smallest of the three and reads the `p10` key, while the High case P10 reads `p90` and holds 152.0653.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Scenario Builder run returns 15.6063 under engine key `p10` and 152.0653 under `p90`. Which P-label does the Low case print, and which number does it hold?', options = '["P10, holding 15.6063, because a case takes its label from the engine key it reads and that key is the 10th percentile.", "P90, holding 152.0653, because the 90th percentile of the sorted NPVs is the value the label for ninety names.", "P90, holding 15.6063, the value that 90 percent of the 1000 sampled NPVs meet or exceed.", "P50, holding 78.5315, because a Low case in the Suite is the median of the draws that fall below the deterministic case."]'::jsonb, explanation = 'Under the exceedance meaning P90 is the smallest of the three and reads the `p10` key, while the High case P10 reads `p90` and holds 152.0653.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 4: option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A slide saved before EC3-0 shows an ISIALA card reading "P90 (Conservative)" over the largest of the three numbers. What is the right repair to that slide?' and options = '["Swap the two outer numbers under the old words, so the card called conservative holds the smaller value again, which is what the old panel intended.", "Relabel the card as the High case P10 and keep its number, without expecting it to match 109.8980, because the old run was unseeded.", "Rerun the same inputs today and paste the seeded values over the old cards, since the repair made earlier runs reproducible too.", "Leave it alone, because the swap affected only the middle card and the Best case P50 of 81.1835 now reads correctly on every slide."]'::jsonb and answer_index = 1 and explanation = 'That card held the value only 10 percent of its sample met or exceeded. The old generator was unseeded, so the sample cannot be rebuilt and only the direction of the error can be fixed.' then 'old'
           when prompt = 'A slide saved before EC3-0 shows an ISIALA card reading "P90 (Conservative)" over the largest of the three numbers. What is the right repair to that slide?' and options = '["Swap the two outer numbers under the old words, so the card called conservative holds the smaller value again, which is what the old panel intended.", "Relabel the card as the High case P10 and keep its number, without expecting it to match 152.0653, because the old run was unseeded.", "Rerun the same inputs today and paste the seeded values over the old cards, since the repair made earlier runs reproducible too.", "Leave it alone, because the swap affected only the middle card and the Best case P50 of 78.5315 now reads correctly on every slide."]'::jsonb and answer_index = 1 and explanation = 'That card held the value only 10 percent of its sample met or exceeded. The old generator was unseeded, so the sample cannot be rebuilt and only the direction of the error can be fixed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A slide saved before EC3-0 shows an ISIALA card reading "P90 (Conservative)" over the largest of the three numbers. What is the right repair to that slide?', options = '["Swap the two outer numbers under the old words, so the card called conservative holds the smaller value again, which is what the old panel intended.", "Relabel the card as the High case P10 and keep its number, without expecting it to match 152.0653, because the old run was unseeded.", "Rerun the same inputs today and paste the seeded values over the old cards, since the repair made earlier runs reproducible too.", "Leave it alone, because the swap affected only the middle card and the Best case P50 of 78.5315 now reads correctly on every slide."]'::jsonb, explanation = 'That card held the value only 10 percent of its sample met or exceeded. The old generator was unseeded, so the sample cannot be rebuilt and only the direction of the error can be fixed.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 5: prompt, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s run shows a deterministic NPV of 81.0464, a Best case P50 of 81.1835 and an emv of 80.1707. Which statement about the emv is right?' and options = '["It is a third name for the P50, differing slightly only because the engine computes it from the histogram''s bin midpoints rather than the sorted values.", "It is the deterministic NPV rediscounted at the sampled prices, which is why it must fall between the Low case and the High case.", "It is the Best case under the floor rule, which is why it differs from the card by a fraction of a million USD.", "It is the plain mean of the 1000 NPVs, takes no P-label, and on this sample sits below both the Best case and the deterministic case."]'::jsonb and answer_index = 3 and explanation = 'The emv averages every sampled NPV. The floor rule''s median on the same sample is 81.1952, not 80.1707.' then 'old'
           when prompt = 'ISIALA''s run shows a deterministic NPV of 81.0464, a Best case P50 of 78.5315 and an emv of 80.9836. Which statement about the emv is right?' and options = '["It is a third name for the P50, differing slightly only because the engine computes it from the histogram''s bin midpoints rather than the sorted values.", "It is the deterministic NPV rediscounted at the sampled prices, which is why it must fall between the Low case and the High case.", "It is the Best case under the floor rule, which is why it differs from the card by a fraction of a million USD.", "It is the plain mean of the 1000 NPVs, takes no P-label, and on this sample sits above the Best case and below the deterministic case."]'::jsonb and answer_index = 3 and explanation = 'The emv averages every sampled NPV and sits above the median because the sample leans to the high side of it. The floor rule''s median on the same sample is 78.5836, not 80.9836.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s run shows a deterministic NPV of 81.0464, a Best case P50 of 78.5315 and an emv of 80.9836. Which statement about the emv is right?', options = '["It is a third name for the P50, differing slightly only because the engine computes it from the histogram''s bin midpoints rather than the sorted values.", "It is the deterministic NPV rediscounted at the sampled prices, which is why it must fall between the Low case and the High case.", "It is the Best case under the floor rule, which is why it differs from the card by a fraction of a million USD.", "It is the plain mean of the 1000 NPVs, takes no P-label, and on this sample sits above the Best case and below the deterministic case."]'::jsonb, explanation = 'The emv averages every sampled NPV and sits above the median because the sample leans to the high side of it. The floor rule''s median on the same sample is 78.5836, not 80.9836.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 6: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A board pack prints ISIALA''s scenario Low of -72.1531 under a P90 heading. Why is that wrong?' and options = '["The scenario Low is one deterministic corner with every input bad in every year, while the P90 is a statistic of 1000 independent draws, 48.7439, and no iteration came near -72.1531.", "The number is right but belongs under P10, because the lowest case takes the lowest label on every quantity the Suite reports.", "The two are one quantity at different iteration counts, so -72.1531 is simply the P90 of a shorter run with fewer draws in it.", "The scenario Low applies a 30 percent move rather than 20 percent, so it is the P90 of a wider range the panel was not given."]'::jsonb and answer_index = 0 and explanation = 'The lowest of the 1000 NPVs is 16.3054. The scenario moves price and production to 0.8 and capex and fixed opex to 1.2 at once in every year, which independent yearly draws almost never do.' then 'old'
           when prompt = 'Three ISIALA figures are offered for a P90 heading: the scenario Low of -57.8151, the lowest sampled NPV of -46.1564, and 15.6063. Which belongs there?' and options = '["15.6063, the Low case P90, the only one of the three that 90 percent of the sampled NPVs meet or exceed.", "The scenario Low of -57.8151, because a P90 heading takes the most cautious figure the screening tools produce for the field.", "The lowest sampled NPV of -46.1564, because a P90 is the floor of the sample and 90 percent of the draws must sit above it.", "Any of the three, provided the heading also records the 1000 iterations and the seed 20260829 that produced the sample."]'::jsonb and answer_index = 0 and explanation = 'A P90 is a statistic of the sample rather than a corner or a minimum. The scenario Low moves price, production and variable opex to 0.8 and capex and fixed opex to 1.2 at once, and no iteration reached it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three ISIALA figures are offered for a P90 heading: the scenario Low of -57.8151, the lowest sampled NPV of -46.1564, and 15.6063. Which belongs there?', options = '["15.6063, the Low case P90, the only one of the three that 90 percent of the sampled NPVs meet or exceed.", "The scenario Low of -57.8151, because a P90 heading takes the most cautious figure the screening tools produce for the field.", "The lowest sampled NPV of -46.1564, because a P90 is the floor of the sample and 90 percent of the draws must sit above it.", "Any of the three, provided the heading also records the 1000 iterations and the seed 20260829 that produced the sample."]'::jsonb, explanation = 'A P90 is a statistic of the sample rather than a corner or a minimum. The scenario Low moves price, production and variable opex to 0.8 and capex and fixed opex to 1.2 at once, and no iteration reached it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 7: option_3, explanation
  select case
           when prompt = 'At the app''s settings, ISIALA''s 2027 oil volume of 1606000 bbl takes the first draw of seed 20260829, 0.936239. From what is it drawn, and where does it land?' and options = '["From a triangular with its mode at 1606000 and its 10th and 90th percentiles at 0.8 and 1.2 times it, in the upper branch of the inverse CDF.", "Uniformly on [1606000, 1.2 x 1606000], since the reserves range is one sided and only ever scales a volume upward.", "Uniformly on [0.8 x 1606000, 1.2 x 1606000], landing near the top of that interval.", "From a draw on the field''s reserves total spread over the 20 years, so 2027 moves together with every later year."]'::jsonb and answer_index = 2 and explanation = 'Each value v with range r is drawn on [v(1 - r), v(1 + r)] with every point equally likely, and a draw of 0.936239 sits near the upper edge.' then 'old'
           when prompt = 'At the app''s settings, ISIALA''s 2027 oil volume of 1606000 bbl takes the first draw of seed 20260829, 0.936239. From what is it drawn, and where does it land?' and options = '["From a triangular with its mode at 1606000 and its 10th and 90th percentiles at 0.8 and 1.2 times it, in the upper branch of the inverse CDF.", "Uniformly on [1606000, 1.2 x 1606000], since the reserves range is one sided and only ever scales a volume upward.", "Uniformly on [0.8 x 1606000, 1.2 x 1606000], landing near the top of that interval.", "From a believed total recoverable volume for the field, which the engine then spreads across the twenty years at the base decline."]'::jsonb and answer_index = 2 and explanation = 'Each value v with range r is drawn on [v(1 - r), v(1 + r)] with every point equally likely, and a draw of 0.936239 sits near the upper edge. The one reserves factor carries every later year with it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At the app''s settings, ISIALA''s 2027 oil volume of 1606000 bbl takes the first draw of seed 20260829, 0.936239. From what is it drawn, and where does it land?', options = '["From a triangular with its mode at 1606000 and its 10th and 90th percentiles at 0.8 and 1.2 times it, in the upper branch of the inverse CDF.", "Uniformly on [1606000, 1.2 x 1606000], since the reserves range is one sided and only ever scales a volume upward.", "Uniformly on [0.8 x 1606000, 1.2 x 1606000], landing near the top of that interval.", "From a believed total recoverable volume for the field, which the engine then spreads across the twenty years at the base decline."]'::jsonb, explanation = 'Each value v with range r is drawn on [v(1 - r), v(1 + r)] with every point equally likely, and a draw of 0.936239 sits near the upper edge. The one reserves factor carries every later year with it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 8: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Suppose one iteration draws ISIALA''s first production year at the bottom of the reserves range, 0.8 of base. How much does that year''s variable cost column hold?' and options = '["About 0.8 times 20.8780 million USD, because the reserves range scales the volume and variable opex is that volume times 13 USD per bbl.", "20.8780 million USD, the base-volume money, because variable opex was fixed when the quick inputs were expanded and is never sampled.", "A fresh uniform draw around 20.8780 million USD, taken right after the capex draw of the same iteration.", "Nothing for that year, because the sampler removes opex from any year whose drawn volume falls below its base value."]'::jsonb and answer_index = 1 and explanation = 'Opex, royalty, tax and the discount rate keep their case values in every iteration (EC3-7), so a low volume draw saves no variable opex.' then 'old'
           when prompt = 'One ISIALA iteration draws its reserves factor at 0.8 of base. Of 2027''s two opex columns, which one moves with that factor?' and options = '["Both of them, because the one factor drawn for an iteration is applied to every cost column the case holds before the ledger is rebuilt.", "The variable column alone, from 20.8780 million USD toward four fifths of it, while the fixed 2.5000 million USD a year stands where the case put it.", "Neither of them, because both opex columns were written out when the quick inputs were expanded and the sampler reads them as fixed arrays from then on.", "The fixed column alone, since each barrel still costs the same 13 USD per bbl to lift however few of them are drawn, so only the standing charge can give way."]'::jsonb and answer_index = 1 and explanation = 'The reserves factor scales oil volume, gas volume and the variable opex those volumes carry, so a fifth fewer barrels costs a fifth less to lift. Fixed opex, royalty and tax are never sampled at any setting (EC3-7).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'One ISIALA iteration draws its reserves factor at 0.8 of base. Of 2027''s two opex columns, which one moves with that factor?', options = '["Both of them, because the one factor drawn for an iteration is applied to every cost column the case holds before the ledger is rebuilt.", "The variable column alone, from 20.8780 million USD toward four fifths of it, while the fixed 2.5000 million USD a year stands where the case put it.", "Neither of them, because both opex columns were written out when the quick inputs were expanded and the sampler reads them as fixed arrays from then on.", "The fixed column alone, since each barrel still costs the same 13 USD per bbl to lift however few of them are drawn, so only the standing charge can give way."]'::jsonb, explanation = 'The reserves factor scales oil volume, gas volume and the variable opex those volumes carry, so a fifth fewer barrels costs a fifth less to lift. Fixed opex, royalty and tax are never sampled at any setting (EC3-7).'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 9: prompt, option_0, option_1, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Seed 43 gives ISIALA a Best case P50 of 79.0624, and the default seed gives 81.1835, nearer the deterministic 81.0464. Which reading is right?' and options = '["The default seed is the accurate one, since it was chosen so that the sample reproduces the deterministic case to within rounding at the app''s settings.", "Seed 43 is the more accurate one, since any seed away from the shared default avoids the bias the default carries into both engines.", "Both are reproducible samples of 1000 and neither is more accurate, so preferring the default for sitting nearer 81.0464 is seed shopping.", "Neither is usable, because a working sampler returns one median at every seed and a gap between seeds is a defect."]'::jsonb and answer_index = 2 and explanation = 'A seed buys reproducibility, not accuracy. The gap between the two medians is part of the uncertainty, so fix the seed before the first run and record it.' then 'old'
           when prompt = 'Seed 43 gives ISIALA a Best case P50 of 80.2233, nearer the deterministic 81.0464 than the default seed''s 78.5315. Which reading is right?' and options = '["Seed 43 is the accurate one, since a sample whose median lands near the deterministic case is the sample that has converged, so the run nearer 81.0464 is the one to report.", "The default seed is the accurate one, since it was chosen so that both engines share one stream and one answer.", "Both are reproducible samples of 1000 and neither is more accurate, so preferring seed 43 for sitting nearer 81.0464 is seed shopping.", "Neither is usable, because a working sampler returns one median at every seed and a gap between seeds is a defect."]'::jsonb and answer_index = 2 and explanation = 'A seed buys reproducibility and nothing more. The gap between the two medians is part of the uncertainty, so fix the seed before the first run and record it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Seed 43 gives ISIALA a Best case P50 of 80.2233, nearer the deterministic 81.0464 than the default seed''s 78.5315. Which reading is right?', options = '["Seed 43 is the accurate one, since a sample whose median lands near the deterministic case is the sample that has converged, so the run nearer 81.0464 is the one to report.", "The default seed is the accurate one, since it was chosen so that both engines share one stream and one answer.", "Both are reproducible samples of 1000 and neither is more accurate, so preferring seed 43 for sitting nearer 81.0464 is seed shopping.", "Neither is usable, because a working sampler returns one median at every seed and a gap between seeds is a defect."]'::jsonb, explanation = 'A seed buys reproducibility and nothing more. The gap between the two medians is part of the uncertainty, so fix the seed before the first run and record it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 10: option_0, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Scenario Builder and the Breakeven Analyzer both default to seed 20260829, and both begin with the draw 0.936239. What links their two samples?' and options = '["Nothing: the Scenario Builder spends that draw on ISIALA''s 2027 oil volume, and the breakeven engine turns it into a capex of 226.5205 million USD.", "Their iterations, which share one random state, so a high NPV in one lines up with a low breakeven price in the other, iteration for iteration across the two apps.", "Their medians, which the shared seed forces to agree once the NPV is turned into a price through the mid-year ratio of 1.058301 at 12 percent.", "Their exclusions, since an iteration the breakeven engine drops is dropped from the Scenario Builder''s 1000 NPVs as well."]'::jsonb and answer_index = 0 and explanation = 'The breakeven engine takes three draws per iteration, capex, opex and efficiency, through a triangular inverse CDF, so samples from the two apps at one seed have nothing to do with each other.' then 'old'
           when prompt = 'The Scenario Builder and the Breakeven Analyzer both default to seed 20260829, and both begin with the draw 0.936239. What links their two samples?' and options = '["Nothing: in the Scenario Builder that draw is the reserves factor scaling every year''s volume, and in the breakeven engine it is a capex of 226.5205 million USD.", "Their iterations, which share one random state, so a high NPV in one lines up with a low breakeven price in the other, iteration for iteration across the two apps.", "Their medians, which the shared seed forces to agree once the NPV is turned into a price through the mid-year ratio of 1.058301 at 12 percent.", "Their exclusions, since an iteration the breakeven engine drops is dropped from the Scenario Builder''s 1000 NPVs as well."]'::jsonb and answer_index = 0 and explanation = 'The breakeven engine takes three draws an iteration, capex, opex and efficiency, through a triangular inverse CDF, while the Scenario Builder takes one factor each for reserves, price and capex.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Scenario Builder and the Breakeven Analyzer both default to seed 20260829, and both begin with the draw 0.936239. What links their two samples?', options = '["Nothing: in the Scenario Builder that draw is the reserves factor scaling every year''s volume, and in the breakeven engine it is a capex of 226.5205 million USD.", "Their iterations, which share one random state, so a high NPV in one lines up with a low breakeven price in the other, iteration for iteration across the two apps.", "Their medians, which the shared seed forces to agree once the NPV is turned into a price through the mid-year ratio of 1.058301 at 12 percent.", "Their exclusions, since an iteration the breakeven engine drops is dropped from the Scenario Builder''s 1000 NPVs as well."]'::jsonb, explanation = 'The breakeven engine takes three draws an iteration, capex, opex and efficiency, through a triangular inverse CDF, while the Scenario Builder takes one factor each for reserves, price and capex.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 11: prompt, option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s histogram at seed 20260829 has its tallest bin, the ninth, at 114, while the Best case P50 of 81.1835 falls in the tenth, holding 94. What does the tallest bin tell you?' and options = '["The most likely NPV, which a decision should prefer to the median because the mode is where the draws concentrate most densely across the 1000 iterations.", "Two populations in the field, since a dip between tall bins means the draws came from two regimes of the model that the ranges switch between from one year to the next.", "The Low case P90, since the engine reads each of its cases from an edge of the bin that holds the most draws.", "Little: its bins are 6.6524 wide between this sample''s own lowest and highest values, and a slightly different width would merge or split the peaks."]'::jsonb and answer_index = 3 and explanation = 'The model has one field and three uniform ranges and nothing that makes two peaks. The cases come from the sorted sample, never from a bin edge.' then 'old'
           when prompt = 'ISIALA''s histogram at seed 20260829 has its tallest bin, the tenth, at 99, while the eighth holds 90. What does the tallest bin tell you?' and options = '["The most likely NPV, which a decision should prefer to the median because the mode is where the draws concentrate most densely across the 1000 iterations.", "Two populations in the field, since a dip between tall bins means the draws came from two regimes of the model that the ranges switch between.", "The Low case P90, since the engine reads each of its cases from an edge of the bin that holds the most draws.", "Little: its bins are 12.7562 wide between this sample''s own lowest and highest values, and a slightly different width would merge or split the peaks."]'::jsonb and answer_index = 3 and explanation = 'The model has one field and three uniform factors and nothing that makes two peaks. The cases come from the sorted sample, never from a bin edge, and the tenth bin is where the Best case P50 of 78.5315 falls.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s histogram at seed 20260829 has its tallest bin, the tenth, at 99, while the eighth holds 90. What does the tallest bin tell you?', options = '["The most likely NPV, which a decision should prefer to the median because the mode is where the draws concentrate most densely across the 1000 iterations.", "Two populations in the field, since a dip between tall bins means the draws came from two regimes of the model that the ranges switch between.", "The Low case P90, since the engine reads each of its cases from an edge of the bin that holds the most draws.", "Little: its bins are 12.7562 wide between this sample''s own lowest and highest values, and a slightly different width would merge or split the peaks."]'::jsonb, explanation = 'The model has one field and three uniform factors and nothing that makes two peaks. The cases come from the sorted sample, never from a bin edge, and the tenth bin is where the Best case P50 of 78.5315 falls.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s 1000 iteration S-curve ends at probability 98. What becomes of its highest NPV, 149.3540?' and options = '["It is the point plotted at 98, because the curve rescales its axis so that the last point is always the maximum of the sample, whatever the step.", "It is in the sample and the histogram but never drawn on the curve, which keeps one sorted value in every 20 and stops short of the end.", "It was excluded from the sample as an outlier before sorting, which is why the curve stops short of 100 percent and the histogram ends below it.", "It sits at probability 100 on a point the chart hides under its axis frame, so it is plotted but not visible."]'::jsonb and answer_index = 1 and explanation = 'The step is floor(1000 / 50) = 20, so the kept indices stop at probability 98.0000 (EC3-6). Read the extremes from the lowest and highest values, 16.3054 and 149.3540.' then 'old'
           when prompt = 'ISIALA''s 1000 iteration S-curve runs to probability 100.0000. What is its last value, and what does the curve leave unsaid?' and options = '["152.0653, the High case P10, because the curve''s top end plots the largest value the engine reports as a case.", "208.9685, the highest sampled NPV, and it never says how long the run was, since the curve draws 51 points at any iteration count.", "208.9685, and the curve carries its iteration count as well, since the point count rises with every further fifty draws.", "-46.1564, because the axis runs from the highest value down to the lowest, so the last point drawn is the minimum."]'::jsonb and answer_index = 1 and explanation = 'The first and last points equal the lowest and the highest sampled value, -46.1564 and 208.9685. Forty iterations give 51 points too, so the picture cannot show whether a run was short.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s 1000 iteration S-curve runs to probability 100.0000. What is its last value, and what does the curve leave unsaid?', options = '["152.0653, the High case P10, because the curve''s top end plots the largest value the engine reports as a case.", "208.9685, the highest sampled NPV, and it never says how long the run was, since the curve draws 51 points at any iteration count.", "208.9685, and the curve carries its iteration count as well, since the point count rises with every further fifty draws.", "-46.1564, because the axis runs from the highest value down to the lowest, so the last point drawn is the minimum."]'::jsonb, explanation = 'The first and last points equal the lowest and the highest sampled value, -46.1564 and 208.9685. Forty iterations give 51 points too, so the picture cannot show whether a run was short.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 13: option_0, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A golden case switches off everything but price uncertainty (`mc_seed3_price_only`). Where in the random stream do its price values come from?' and options = '["They are unchanged from a full run, because each array keeps its own position in the stream whether or not an earlier range is sampled.", "They are drawn twice as wide, since the sampler moves the unused reserves and capex width onto the one range still set.", "They are replaced by the deterministic prices, since the sampler draws nothing until at least two ranges are set.", "They take stream positions the volume draws would have used, since a falsy range consumes no draw."]'::jsonb and answer_index = 3 and explanation = 'The seed fixes the stream, not which value each draw goes to. ISIALA''s gas draws still consume positions although gas volume is 0, because their range is not falsy.' then 'old'
           when prompt = 'A golden case switches off everything but price uncertainty (`mc_seed3_price_only`). Where in the random stream do its price values come from?' and options = '["They are unchanged from a full run, because each variable keeps its own position in the stream whether or not it is sampled.", "They are drawn twice as wide, since the sampler moves the unused reserves and capex width onto the one range still set.", "They are replaced by the deterministic prices, since the sampler draws nothing until at least two ranges are set.", "They take stream positions the reserves and capex factors would have used, since a falsy range consumes no draw."]'::jsonb and answer_index = 3 and explanation = 'The seed fixes the stream of draws while leaving open which value each draw goes to. One factor covers every array a range owns, so ISIALA''s gas volume of 0 costs no extra draw either.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A golden case switches off everything but price uncertainty (`mc_seed3_price_only`). Where in the random stream do its price values come from?', options = '["They are unchanged from a full run, because each variable keeps its own position in the stream whether or not it is sampled.", "They are drawn twice as wide, since the sampler moves the unused reserves and capex width onto the one range still set.", "They are replaced by the deterministic prices, since the sampler draws nothing until at least two ranges are set.", "They take stream positions the reserves and capex factors would have used, since a falsy range consumes no draw."]'::jsonb, explanation = 'The seed fixes the stream of draws while leaving open which value each draw goes to. One factor covers every array a range owns, so ISIALA''s gas volume of 0 costs no extra draw either.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 14: prompt, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why can ISIALA''s Low case P90 of 48.7439 not be found anywhere in the exported sorted sample of 1000 NPVs?' and options = '["The card rounds its sampled value to four decimals while the export keeps full precision, so an exact search finds no match.", "The card is stale from before EC3-0, when an unseeded sampler wrote a different sample from the one now exported.", "n x 0.1 = 100 is whole on an even length, so the screening rule averages two neighbours, and the upper one is 48.8335.", "The rule interpolates linearly across the whole bin that holds the 10th percentile, so its answer falls between two bin edges."]'::jsonb and answer_index = 2 and explanation = 'Under its own rule the card is right. The floor rule reads the single value 48.8335 on the same sample, a difference of -0.0896.' then 'old'
           when prompt = 'Why can ISIALA''s Low case P90 of 15.6063 not be found anywhere in the exported sorted sample of 1000 NPVs?' and options = '["The card rounds its sampled value to four decimals while the export keeps full precision, so an exact search finds no match.", "The card is stale from before EC3-0, when an unseeded sampler wrote a different sample from the one now exported.", "n x 0.1 = 100 is whole on an even length, so the screening rule averages two neighbours, and the upper one is 15.6619.", "The rule interpolates linearly across the whole bin that holds the 10th percentile, so its answer falls between two bin edges."]'::jsonb and answer_index = 2 and explanation = 'Under its own rule the card is right. The floor rule reads the single value 15.6619 on the same sample, a difference of -0.0556.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why can ISIALA''s Low case P90 of 15.6063 not be found anywhere in the exported sorted sample of 1000 NPVs?', options = '["The card rounds its sampled value to four decimals while the export keeps full precision, so an exact search finds no match.", "The card is stale from before EC3-0, when an unseeded sampler wrote a different sample from the one now exported.", "n x 0.1 = 100 is whole on an even length, so the screening rule averages two neighbours, and the upper one is 15.6619.", "The rule interpolates linearly across the whole bin that holds the 10th percentile, so its answer falls between two bin edges."]'::jsonb, explanation = 'Under its own rule the card is right. The floor rule reads the single value 15.6619 on the same sample, a difference of -0.0556.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 15: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Every difference between the averaging rule and the floor rule on ISIALA''s 1000 NPVs is negative: -0.0896, -0.0116 and -0.0056. Why can none be positive on this sample?' and options = '["With n x q whole, the averaging rule blends the value at the index with the one before it, while the floor rule takes the value at the index, the upper of the two.", "The floor rule rounds its index down, so it takes the lower of the two neighbours and always reads below the average.", "The NPVs are skewed to the right, so any rule that avoids averaging reads higher than the average in both tails and at the middle.", "The averaging rule weights each value by its histogram count, which pulls every case toward the tallest bin below the median."]'::jsonb and answer_index = 0 and explanation = 'The floor applies to the index, not to the answer. On an NPV it leans toward the good end, so a reader who takes the floor rule as the cautious one has the direction backwards.' then 'old'
           when prompt = 'A report quotes ISIALA''s Low case as 15.6619 million USD. Which rule produced that figure, and what must the report carry beside it?' and options = '["The breakeven engine''s floor rule, read on the Scenario Builder''s sample, so the report has to name the rule beside the number.", "The Scenario Builder''s own averaging rule, which returns 15.6619 whenever the iteration count leaves n x q a whole number.", "Neither rule: 15.6619 is the lowest sampled NPV of that run, which is why it sits below every case the panel prints.", "The averaging rule at seed 43, since a change of seed moves the Low case and the two engines share one percentile rule."]'::jsonb and answer_index = 0 and explanation = 'The Scenario Builder''s card reads 15.6063 by the averaging rule, and the floor rule on the same 1000 NPVs reads 15.6619, a difference of -0.0556. Every percentile is a convention, so name the rule before comparing two numbers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A report quotes ISIALA''s Low case as 15.6619 million USD. Which rule produced that figure, and what must the report carry beside it?', options = '["The breakeven engine''s floor rule, read on the Scenario Builder''s sample, so the report has to name the rule beside the number.", "The Scenario Builder''s own averaging rule, which returns 15.6619 whenever the iteration count leaves n x q a whole number.", "Neither rule: 15.6619 is the lowest sampled NPV of that run, which is why it sits below every case the panel prints.", "The averaging rule at seed 43, since a change of seed moves the Low case and the two engines share one percentile rule."]'::jsonb, explanation = 'The Scenario Builder''s card reads 15.6063 by the averaging rule, and the floor rule on the same 1000 NPVs reads 15.6619, a difference of -0.0556. Every percentile is a convention, so name the rule before comparing two numbers.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 16: explanation
  select case
           when prompt = 'Two Scenario Builder runs of one field differ only in iteration count, 1000 and an odd number. How is the Best case read in each?' and options = '["Both are averages, because the rule always blends the two values nearest the middle whatever the iteration count happens to be.", "At 1000 it is the mean of the two middle values; on the odd count it is a single sorted value, and nothing on the panel says which branch ran.", "Both take the single value at floor(q n), since the Scenario Builder switches to the breakeven engine''s rule on any count other than 1000, to keep each case a member of the sample.", "The odd count averages the three values around the middle position, and the panel marks that run as interpolated."]'::jsonb and answer_index = 1 and explanation = 'On an odd length n x 0.5 is never whole, so no case is averaged. At 1000 every case is, and the middle one reads 81.1835.' then 'old'
           when prompt = 'Two Scenario Builder runs of one field differ only in iteration count, 1000 and an odd number. How is the Best case read in each?' and options = '["Both are averages, because the rule always blends the two values nearest the middle whatever the iteration count happens to be.", "At 1000 it is the mean of the two middle values; on the odd count it is a single sorted value, and nothing on the panel says which branch ran.", "Both take the single value at floor(q n), since the Scenario Builder switches to the breakeven engine''s rule on any count other than 1000, to keep each case a member of the sample.", "The odd count averages the three values around the middle position, and the panel marks that run as interpolated."]'::jsonb and answer_index = 1 and explanation = 'On an odd length n x 0.5 is never whole, so no case is averaged. At 1000 every case is, and the middle one reads 78.5315.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 16'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two Scenario Builder runs of one field differ only in iteration count, 1000 and an odd number. How is the Best case read in each?', options = '["Both are averages, because the rule always blends the two values nearest the middle whatever the iteration count happens to be.", "At 1000 it is the mean of the two middle values; on the odd count it is a single sorted value, and nothing on the panel says which branch ran.", "Both take the single value at floor(q n), since the Scenario Builder switches to the breakeven engine''s rule on any count other than 1000, to keep each case a member of the sample.", "The odd count averages the three values around the middle position, and the panel marks that run as interpolated."]'::jsonb, explanation = 'On an odd length n x 0.5 is never whole, so no case is averaged. At 1000 every case is, and the middle one reads 78.5315.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 19: option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On ISIALA, order these from smallest to largest: the gap between the two percentile rules at the median, the change in the Best case P50 from seed 20260829 to seed 43, and the gap between the mid-year and year-end NPV.' and options = '["The seed change, then the rule gap, then the convention gap, since a seed only reorders draws that the two rules then read differently.", "The rule gap of -0.0116, then the seed change from 81.1835 to 79.0624, then the convention gap from 81.0464 to 76.5817.", "The rule gap, then the convention gap, then the seed change, since mid-year discounting scales the NPV by only 1.058301.", "The convention gap, then the rule gap, then the seed change, since mid-year and year-end differ by no more than half a year."]'::jsonb and answer_index = 1 and explanation = 'The choice of rule is the smallest of the three and the only one that changes nothing about the sample, while mid-year multiplies the whole NPV by 1.058301.' then 'old'
           when prompt = 'On ISIALA, order these from smallest to largest: the gap between the two percentile rules at the median, the change in the Best case P50 from seed 20260829 to seed 43, and the gap between the mid-year and year-end NPV.' and options = '["The seed change, then the rule gap, then the convention gap, since a seed only reorders draws that the two rules then read differently.", "The rule gap of -0.0521, then the seed change from 78.5315 to 80.2233, then the convention gap from 81.0464 to 76.5817.", "The rule gap, then the convention gap, then the seed change, since mid-year discounting scales the NPV by only 1.058301.", "The convention gap, then the rule gap, then the seed change, since mid-year and year-end differ by no more than half a year."]'::jsonb and answer_index = 1 and explanation = 'The choice of rule is the smallest of the three and the only one that changes nothing about the sample, while mid-year multiplies the whole NPV by 1.058301.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 19'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 19 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ISIALA, order these from smallest to largest: the gap between the two percentile rules at the median, the change in the Best case P50 from seed 20260829 to seed 43, and the gap between the mid-year and year-end NPV.', options = '["The seed change, then the rule gap, then the convention gap, since a seed only reorders draws that the two rules then read differently.", "The rule gap of -0.0521, then the seed change from 78.5315 to 80.2233, then the convention gap from 81.0464 to 76.5817.", "The rule gap, then the convention gap, then the seed change, since mid-year discounting scales the NPV by only 1.058301.", "The convention gap, then the rule gap, then the seed change, since mid-year and year-end differ by no more than half a year."]'::jsonb, explanation = 'The choice of rule is the smallest of the three and the only one that changes nothing about the sample, while mid-year multiplies the whole NPV by 1.058301.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 19 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 22: option_2, explanation
  select case
           when prompt = 'What did the published Scenario Builder return for its S-curve at 40 iterations (finding S5)?' and options = '["A single point at probability 100, because a step of zero kept only the last sorted value of the run.", "A TypeError, the same fault as a zero-range run, caught by the panel and shown to the user as an error banner.", "Forty points, as it does now, but at probabilities scaled to a 1000 iteration axis so that they bunched at the left.", "An empty array with no error, because floor(40 / 50) is zero and the remainder by zero failed every test."]'::jsonb and answer_index = 3 and explanation = 'The cases, the emv and the histogram came back beside a blank chart, which looked like a rendering fault. The repair floors the step at 1, giving 40 points.' then 'old'
           when prompt = 'What did the published Scenario Builder return for its S-curve at 40 iterations (finding S5)?' and options = '["A single point at probability 100, because a step of zero kept only the last sorted value of the run.", "A TypeError, the same fault as a zero-range run, caught by the panel and shown to the user as an error banner.", "Fifty one points, as it does now, but at probabilities scaled to a 1000 iteration axis so that they bunched at the left.", "An empty array with no error, because floor(40 / 50) is zero and the remainder by zero failed every test."]'::jsonb and answer_index = 3 and explanation = 'The cases, the emv and the histogram came back beside a blank chart, which looked like a rendering fault. The repaired curve reads 51 points at fixed probabilities, the last of them 183.6938 on a forty iteration run.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What did the published Scenario Builder return for its S-curve at 40 iterations (finding S5)?', options = '["A single point at probability 100, because a step of zero kept only the last sorted value of the run.", "A TypeError, the same fault as a zero-range run, caught by the panel and shown to the user as an error banner.", "Fifty one points, as it does now, but at probabilities scaled to a 1000 iteration axis so that they bunched at the left.", "An empty array with no error, because floor(40 / 50) is zero and the remainder by zero failed every test."]'::jsonb, explanation = 'The cases, the emv and the histogram came back beside a blank chart, which looked like a rendering fault. The repaired curve reads 51 points at fixed probabilities, the last of them 183.6938 on a forty iteration run.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 23: prompt, option_1, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On `mc_with_unreachable` the right-hand end of each tornado bar is printed as 0.0000. How should an analyst interpret that blank?' and options = '["The variable cannot raise the breakeven price at all, so the three bars show only downside relief and are ranked from the largest low side to the smallest.", "The most dangerous direction: that end has no breakeven price below 500 USD per bbl, the solver returns null, and the chart writes it as zero.", "The high side solved exactly at the base breakeven of 498.0372, so moving that variable toward its bad end leaves the breakeven price where the base put it.", "The side was skipped to save solves once 55 of 120 iterations had already been excluded from the sample."]'::jsonb and answer_index = 1 and explanation = 'Each null side gives a swing of zero, so the sort has nothing to sort on and efficiency''s -26.2125 ranks below opex''s -6.7689 (B1). The raw low and high in the sensitivity data keep the null.' then 'old'
           when prompt = 'On `mc_with_unreachable` the right-hand end of each tornado bar comes back null. How should an analyst read that?' and options = '["The variable cannot raise the breakeven price at all, so the three bars show only downside relief and are ranked from the largest low side to the smallest.", "As the most dangerous direction: that end has no breakeven price below 500 USD per bbl, so the engine records none and marks the bar unreachable.", "The high side solved exactly at the base breakeven of 498.0372, so moving that variable toward its bad end leaves the breakeven price where the base put it.", "The side was skipped to save solves once 55 of 120 iterations had already been excluded from the sample."]'::jsonb and answer_index = 1 and explanation = 'All three bars are unreachable here, so all three sort first and keep their input order, Total CAPEX, Annual OPEX then Prod. Efficiency. Their low sides still solve, at -80.7218, -6.7689 and -26.2125.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 23'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `mc_with_unreachable` the right-hand end of each tornado bar comes back null. How should an analyst read that?', options = '["The variable cannot raise the breakeven price at all, so the three bars show only downside relief and are ranked from the largest low side to the smallest.", "As the most dangerous direction: that end has no breakeven price below 500 USD per bbl, so the engine records none and marks the bar unreachable.", "The high side solved exactly at the base breakeven of 498.0372, so moving that variable toward its bad end leaves the breakeven price where the base put it.", "The side was skipped to save solves once 55 of 120 iterations had already been excluded from the sample."]'::jsonb, explanation = 'All three bars are unreachable here, so all three sort first and keep their input order, Total CAPEX, Annual OPEX then Prod. Efficiency. Their low sides still solve, at -80.7218, -6.7689 and -26.2125.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 24: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Three published faults were repaired in EC3-0 and one was left in place. Which one would a user still meet?' and options = '["The error thrown on a Monte Carlo with every range at zero, finding S4, which the histogram still raises on a zero width.", "The empty S-curve below fifty iterations, finding S5, which still returns no points at all on a run of 40 iterations.", "A tornado side that cannot break even inside the bracket, drawn at 0.0000 (B1).", "The fit note that described a clamped belief in P-labels, which the Breakeven Analyzer still shows beside the insight."]'::jsonb and answer_index = 2 and explanation = 'S4, S5 and the fit note words are repaired: zero ranges now return 81.0464 in all three cases and 40 iterations give 40 points. Every high side of `mc_with_unreachable` still reads 0.0000.' then 'old'
           when prompt = 'S4, S5 and B1 have all been repaired. Which statement describes what a user meets today?' and options = '["A Monte Carlo with every range at zero still throws from the histogram, because the zero width divide was left for a later release, so such a run has to be nudged to a tiny width before it will finish.", "A run below fifty iterations still returns no S-curve points at all, since the repair only turned the blank chart into a warning.", "A tornado side with no breakeven inside the bracket is null, its bar is marked unreachable, and that bar sorts ahead of the bars that close.", "A clamped belief is still described in P-labels in the fit note, which the Breakeven Analyzer shows beside its insight."]'::jsonb and answer_index = 2 and explanation = 'Zero ranges now return 81.0464 in all three cases, 40 iterations give 51 points, and the fit note uses percentile words. Before B1 was fixed an unreachable end was drawn at 0.0000 with a zero swing and sorted last.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 24'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'S4, S5 and B1 have all been repaired. Which statement describes what a user meets today?', options = '["A Monte Carlo with every range at zero still throws from the histogram, because the zero width divide was left for a later release, so such a run has to be nudged to a tiny width before it will finish.", "A run below fifty iterations still returns no S-curve points at all, since the repair only turned the blank chart into a warning.", "A tornado side with no breakeven inside the bracket is null, its bar is marked unreachable, and that bar sorts ahead of the bars that close.", "A clamped belief is still described in P-labels in the fit note, which the Breakeven Analyzer shows beside its insight."]'::jsonb, explanation = 'Zero ranges now return 81.0464 in all three cases, 40 iterations give 51 points, and the fit note uses percentile words. Before B1 was fixed an unreachable end was drawn at 0.0000 with a zero swing and sorted last.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 25: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA with the narrow opex belief 16 / 17 / 26 reports a base breakeven of 67.2301 and a median breakeven price of 73.1740. Why should the two not be quoted as one belief?' and options = '["The base and the tornado use the stated median of 17, while the sample draws from the clamped triangle 15.1886 / 15.1886 / 31.0000, whose median is not 17.", "The base is discounted at year end and the sample at mid-year, so the two differ by the ratio between the conventions.", "The median comes from the averaging rule and the base from the floor rule, so their gap is the rule difference at 5000 iterations.", "The belief was refused and replaced by 16 / 20 / 26 for the sample, while the base kept the values that were typed."]'::jsonb and answer_index = 0 and explanation = 'Its shape ratio of 0.100000 lies outside 0.381966 to 0.618034, so the fit clamps, `exact` reads false and the insight carries the note (EC3-5). Read `exact` before quoting either number.' then 'old'
           when prompt = 'Before quoting either of ISIALA''s narrow-belief figures, a base breakeven of 71.3621 and a median breakeven price of 73.1740, what must a reader check?' and options = '["The fit''s `exact` flag and the beliefs line beneath it, which name the percentiles the base case and the tornado actually ran at.", "The seed and the iteration count, since a base breakeven is the middle of the sample and moves with both of them.", "The discounting convention of each, since the base solves at year end and the sample at mid-year on the same ledger.", "The excluded count, since a clamped belief drops the iterations that cannot break even and the two figures then describe different samples."]'::jsonb and answer_index = 0 and explanation = 'The opex belief 16 / 17 / 26 has a shape ratio of 0.100000, outside 0.381966 to 0.618034, so `exact` reads false and the beliefs line reports opex 16.0000 / 19.8197 / 26.0000 as fitted. The stated median of 17 appears nowhere in the answer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 25'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Before quoting either of ISIALA''s narrow-belief figures, a base breakeven of 71.3621 and a median breakeven price of 73.1740, what must a reader check?', options = '["The fit''s `exact` flag and the beliefs line beneath it, which name the percentiles the base case and the tornado actually ran at.", "The seed and the iteration count, since a base breakeven is the middle of the sample and moves with both of them.", "The discounting convention of each, since the base solves at year end and the sample at mid-year on the same ledger.", "The excluded count, since a clamped belief drops the iterations that cannot break even and the two figures then describe different samples."]'::jsonb, explanation = 'The opex belief 16 / 17 / 26 has a shape ratio of 0.100000, outside 0.381966 to 0.618034, so `exact` reads false and the beliefs line reports opex 16.0000 / 19.8197 / 26.0000 as fitted. The stated median of 17 appears nowhere in the answer.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 27: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A screening run on NTEJE prints a rate of return of 1000.0000 percent beside an NPV of -123.9923. How much of that rate is real?' and options = '["A true root beyond the clamp, the form of `irr_beyond_clamp`, which the engine caps and reports at 1000 percent in place of the higher rate the cash flow earns.", "The Newton clamp: no rate makes NTEJE''s NPV zero, and the engine reports where the iteration stopped without checking the NPV there.", "A rate the cash flow earns in its first years, before the second capex half is spent and the NPV turns negative.", "The code the engine prints for a project that never pays back, whenever its payback reads the project life of 20."]'::jsonb and answer_index = 1 and explanation = '`irr_beyond_clamp` has a real root at 9900 percent; NTEJE has none. A reader who ranks projects by IRR puts NTEJE at the top (S1), and `irr_all_negative` never pays back yet reports 0, so 1000 is no never-pays-back code.' then 'old'
           when prompt = 'A screening run on NTEJE returns irr null beside an NPV of -123.9923. Which status does it carry, and what does that status claim?' and options = '["above-clamp, the status for a root beyond 1000 percent, which is the form `irr_beyond_clamp` records against a golden root of 9900.", "no-root: no rate in the engine''s band drives NTEJE''s NPV to zero, so there is no rate to report.", "multiple-roots, the status the engine uses when a cash flow changes sign more than once and several rates zero the NPV.", "no-sign-change, which the engine returns whenever a project never pays back, as its final cumulative of -154.5906 shows."]'::jsonb and answer_index = 1 and explanation = 'A null always carries a word for why. NTEJE''s payback is null with not-recovered, and before the 2026-09-15 repair the same field reported the 1000 percent Newton clamp as though it were a rate (S1).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 27'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening run on NTEJE returns irr null beside an NPV of -123.9923. Which status does it carry, and what does that status claim?', options = '["above-clamp, the status for a root beyond 1000 percent, which is the form `irr_beyond_clamp` records against a golden root of 9900.", "no-root: no rate in the engine''s band drives NTEJE''s NPV to zero, so there is no rate to report.", "multiple-roots, the status the engine uses when a cash flow changes sign more than once and several rates zero the NPV.", "no-sign-change, which the engine returns whenever a project never pays back, as its final cumulative of -154.5906 shows."]'::jsonb, explanation = 'A null always carries a word for why. NTEJE''s payback is null with not-recovered, and before the 2026-09-15 repair the same field reported the 1000 percent Newton clamp as though it were a rate (S1).'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 28: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA, valued at 167.4389 million USD, prints an internal rate of 1000.0000 as well. Where did its number come from?' and options = '["Its only IRR root is negative, so Newton wandered upward from its 10 percent start and stopped at the clamp, which is no root at all.", "Its root lies past the clamp, the gentle form, so the project truly earns more than 1000 percent and the clamp understates it, as in `irr_beyond_clamp`.", "The rate is right, because a first year already cash positive makes the IRR unbounded and 1000 is how the engine says so.", "It is the starting guess returned by the derivative guard, finding S2, since OKPOMA''s final years carry tiny cash flows."]'::jsonb and answer_index = 0 and explanation = 'Neither OKPOMA nor NTEJE is a root past the clamp; that form is `irr_beyond_clamp` at 9900. The guard asks whether the years differ in sign, never whether the last guess makes NPV zero, and S2 returns 10, not 1000.' then 'old'
           when prompt = 'A screen lists OKPOMA at -54.7919 percent with irrStatus ok and NTEJE at irr null with irrStatus no-root. What separates the two entries?' and options = '["OKPOMA has a rate that zeroes its NPV and NTEJE has none, so only one of the two entries is a rate at all.", "OKPOMA''s rate was clamped and NTEJE''s was not, so the first is a bound the solver stopped at and the second a genuine search.", "OKPOMA is the worse project, since a negative rate of return ranks below a project whose rate the engine could not find at all.", "Nothing of substance: both are ways of reporting that the Newton iteration failed to converge on the cash flow it was given."]'::jsonb and answer_index = 0 and explanation = 'A status of ok says a rate zeroes the NPV; it never says the rate is a sensible screening number, and OKPOMA is worth 167.4389 million USD. NTEJE loses 123.9923 million USD and no rate in the band zeroes it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 28'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screen lists OKPOMA at -54.7919 percent with irrStatus ok and NTEJE at irr null with irrStatus no-root. What separates the two entries?', options = '["OKPOMA has a rate that zeroes its NPV and NTEJE has none, so only one of the two entries is a rate at all.", "OKPOMA''s rate was clamped and NTEJE''s was not, so the first is a bound the solver stopped at and the second a genuine search.", "OKPOMA is the worse project, since a negative rate of return ranks below a project whose rate the engine could not find at all.", "Nothing of substance: both are ways of reporting that the Newton iteration failed to converge on the cash flow it was given."]'::jsonb, explanation = 'A status of ok says a rate zeroes the NPV; it never says the rate is a sensible screening number, and OKPOMA is worth 167.4389 million USD. NTEJE loses 123.9923 million USD and no rate in the band zeroes it.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 29: option_0, option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA reports a payback of 0.0000 beside a peak exposure of -2.2287. What produces that pair?' and options = '["Payback is measured on discounted cash flow and peak exposure on undiscounted cash flow, so the two describe different ledgers.", "The engine sets payback to zero whenever the IRR reports its 1000 percent clamp, and peak exposure is not affected by that rule.", "The 2028 loss falls within the first half year of mid-year discounting, so a payback under one year rounds to 0.0000.", "The cumulative is 9.2498 after 2027, so payback is taken at index 0, and the second capex half then takes it to -2.2287 in 2028 without the payback being revisited."]'::jsonb and answer_index = 3 and explanation = 'Payback is the first index at which the cumulative is non-negative and is never looked at again (EC3-1). A payback of 0 beside a negative peak exposure is the tell.' then 'old'
           when prompt = 'OKPOMA reports a payback of 0.0000 beside a peak exposure of -2.2287. What produces that pair?' and options = '["Payback is measured on discounted cash flow and peak exposure on undiscounted cash flow, so the two describe different ledgers, one at the 10 percent rate and one in money of the day.", "The engine sets payback to zero whenever the IRR comes back null, and peak exposure is not affected by that rule.", "The 2028 loss falls within the first half year of mid-year discounting, so a payback under one year rounds to 0.0000.", "The cumulative is 9.2498 after 2027, so the first crossing is index 0, and the second capex half then takes it to -2.2287 in 2028."]'::jsonb and answer_index = 3 and explanation = 'Payback is the first index at which the cumulative is non-negative, and the status says what happened next: paybackStatus recrossed, with paybackLast 2.0385 where it turns non-negative for good (EC3-1).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 29'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA reports a payback of 0.0000 beside a peak exposure of -2.2287. What produces that pair?', options = '["Payback is measured on discounted cash flow and peak exposure on undiscounted cash flow, so the two describe different ledgers, one at the 10 percent rate and one in money of the day.", "The engine sets payback to zero whenever the IRR comes back null, and peak exposure is not affected by that rule.", "The 2028 loss falls within the first half year of mid-year discounting, so a payback under one year rounds to 0.0000.", "The cumulative is 9.2498 after 2027, so the first crossing is index 0, and the second capex half then takes it to -2.2287 in 2028."]'::jsonb, explanation = 'Payback is the first index at which the cumulative is non-negative, and the status says what happened next: paybackStatus recrossed, with paybackLast 2.0385 where it turns non-negative for good (EC3-1).'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 32: prompt, option_0, option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'None of ISIALA''s 1000 sampled NPVs loses money, yet its Low scenario loses 72.1531 million USD. What can a reader conclude about the chance of that outcome?' and options = '["Nothing from this sample: independent yearly draws almost never put a whole life at the bottom together, so the distribution cannot price a correlated outcome.", "ISIALA''s chance of it is below one in 1000, since 1000 iterations without a single loss bound that chance from above.", "It is about 10 percent, since the Low scenario sits below the Low case P90 and 10 percent of the sample lies below that case.", "It equals the share of iterations below 16.3054, which the S-curve plots at probability 0.0000 and so reads as none."]'::jsonb and answer_index = 0 and explanation = 'Opex, royalty and tax are never sampled and no draw leans on another. The missing risk is correlated, structural or never modelled.' then 'old'
           when prompt = 'ISIALA''s sampled NPVs reach down to -46.1564 million USD, yet its Low scenario loses 57.8151. What can a reader conclude about the chance of that scenario?' and options = '["Nothing from this sample: the three factors are drawn separately, so the sampler almost never reproduces a corner with every input bad at once.", "Its chance is below one in 1000, since 1000 iterations without reaching that loss bound the chance from above.", "It is about 10 percent, since the Low scenario sits below the Low case P90 and 10 percent of the sample lies below that case.", "It equals the share of iterations below -46.1564, which the S-curve plots at probability 0.0000 and so reads as none."]'::jsonb and answer_index = 0 and explanation = 'Fixed opex, royalty and tax are never sampled and no factor leans on another. The missing risk is correlated, structural or never modelled.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 32'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s sampled NPVs reach down to -46.1564 million USD, yet its Low scenario loses 57.8151. What can a reader conclude about the chance of that scenario?', options = '["Nothing from this sample: the three factors are drawn separately, so the sampler almost never reproduces a corner with every input bad at once.", "Its chance is below one in 1000, since 1000 iterations without reaching that loss bound the chance from above.", "It is about 10 percent, since the Low scenario sits below the Low case P90 and 10 percent of the sample lies below that case.", "It equals the share of iterations below -46.1564, which the S-curve plots at probability 0.0000 and so reads as none."]'::jsonb, explanation = 'Fixed opex, royalty and tax are never sampled and no factor leans on another. The missing risk is correlated, structural or never modelled.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 34: option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Working the capstone order on ISIALA, what check does the tier ask for on the deterministic IRR of 53.7148 percent before it is quoted?' and options = '["That it exceeds the 12 percent discount rate, which is what confirms that the Newton iteration converged onto a root.", "That it matches the Monte Carlo''s Best case P50 once that NPV is converted to a rate through the mid-year ratio.", "That it lies between the Low and High scenario IRRs of -3.5758 and 0.0000 percent, as a base case must.", "That it is not 1000.0000, 10.0000 or 0.0000, the values the solver returns when it did not solve."]'::jsonb and answer_index = 3 and explanation = 'The High scenario''s 0.0000 is the no-sign-change return (EC3-2), and ISIALA''s cumulative crosses zero once, from -8.6381 in 2029 to 22.8165 in 2030, so its payback of 3.2746 is no re-crossing either.' then 'old'
           when prompt = 'Working the capstone order on ISIALA, what check does the tier ask for on the deterministic IRR of 53.7148 percent before it is quoted?' and options = '["That it exceeds the 12 percent discount rate, which is what confirms that the Newton iteration converged onto a root.", "That it matches the Monte Carlo''s Best case P50 once that NPV is converted to a rate through the mid-year ratio.", "That it lies between the Low and High scenario IRRs, the Low being -0.6992 percent, as a base case must.", "That it carries irrStatus ok, so it is a rate the engine solved rather than a null with a reason attached."]'::jsonb and answer_index = 3 and explanation = 'The High scenario''s IRR is null with no-sign-change, so the two scenarios bracket nothing. ISIALA''s cumulative crosses zero once, from -8.6381 in 2029 to 22.8165 in 2030, so its paybackStatus is ok.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 34'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Working the capstone order on ISIALA, what check does the tier ask for on the deterministic IRR of 53.7148 percent before it is quoted?', options = '["That it exceeds the 12 percent discount rate, which is what confirms that the Newton iteration converged onto a root.", "That it matches the Monte Carlo''s Best case P50 once that NPV is converted to a rate through the mid-year ratio.", "That it lies between the Low and High scenario IRRs, the Low being -0.6992 percent, as a base case must.", "That it carries irrStatus ok, so it is a rate the engine solved rather than a null with a reason attached."]'::jsonb, explanation = 'The High scenario''s IRR is null with no-sign-change, so the two scenarios bracket nothing. ISIALA''s cumulative crosses zero once, from -8.6381 in 2029 to 22.8165 in 2030, so its paybackStatus is ok.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 36: option_1, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s tornado reads Total CAPEX -7.0202 and 9.4067, Annual OPEX -5.8578 and 8.8730, Prod. Efficiency -3.7306 and 5.0561, and every fit is exact. Why must an answer still say it read them?' and options = '["The tornado sides are percentiles of the 5000 iteration sample, so they must be quoted with the seed that produced them and its iteration count.", "An inexact fit or a side at 0.0000 changes what the base and the bars mean, so the answer states in words that neither occurred.", "A bar with two sides means some iteration was excluded, and the answer must count those exclusions beside the percentiles of breakeven price.", "Efficiency''s high side being smaller than capex''s means its fit clamped, and a clamped fit has to be named."]'::jsonb and answer_index = 1 and explanation = 'A null side is drawn at 0.0000 (B1) and a clamp splits the base from the sample (EC3-5). On ISIALA no side is 0.0000 and the capex, opex and efficiency fits are all true.' then 'old'
           when prompt = 'ISIALA''s tornado reads Total CAPEX -7.0202 and 9.4067, Annual OPEX -5.8578 and 8.8730, Prod. Efficiency -3.7306 and 5.0561, and every fit is exact. Why must an answer still say it read them?' and options = '["The tornado sides are percentiles of the 5000 iteration sample, so they must be quoted with the seed that produced them and its iteration count.", "An inexact fit or an unreachable side changes what the base and the bars mean, so the answer states in words that neither occurred.", "A bar with two sides means some iteration was excluded, and the answer must count those exclusions beside the percentiles of breakeven price.", "Efficiency''s high side being smaller than capex''s means its fit clamped, and a clamped fit has to be named."]'::jsonb and answer_index = 1 and explanation = 'An unreachable side is null and sorts its bar first (B1), and a clamp moves the base and the tornado onto the fitted percentiles (EC3-5). On ISIALA no bar is unreachable and all three fits are true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 36'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s tornado reads Total CAPEX -7.0202 and 9.4067, Annual OPEX -5.8578 and 8.8730, Prod. Efficiency -3.7306 and 5.0561, and every fit is exact. Why must an answer still say it read them?', options = '["The tornado sides are percentiles of the 5000 iteration sample, so they must be quoted with the seed that produced them and its iteration count.", "An inexact fit or an unreachable side changes what the base and the bars mean, so the answer states in words that neither occurred.", "A bar with two sides means some iteration was excluded, and the answer must count those exclusions beside the percentiles of breakeven price.", "Efficiency''s high side being smaller than capex''s means its fit clamped, and a clamped fit has to be named."]'::jsonb, explanation = 'An unreachable side is null and sorts its bar first (B1), and a clamp moves the base and the tornado onto the fitted percentiles (EC3-5). On ISIALA no bar is unreachable and all three fits are true.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 37: explanation
  select case
           when prompt = 'Which of ISIALA''s reported numbers would move if the whole reading were rerun at another seed?' and options = '["Only the emv, since the three cases and three percentiles are read from fixed sorted positions, and a position does not depend on which draw landed in it.", "Every number including the base breakeven of 71.6277, since the breakeven engine solves its base case from the first draw of each iteration rather than the stated medians.", "The three NPV cases, the emv and the three breakeven percentiles, while the deterministic NPV of 81.0464 and the base breakeven of 71.6277 stay put.", "None of them, since the repaired engines fix the seed at 20260829 and ignore any other seed they are passed."]'::jsonb and answer_index = 2 and explanation = 'A seed moves the sample: seed 43 gives a Best case P50 of 79.0624 and seed 7 a median breakeven price of 72.8475. The deterministic case and the base solve at the stated medians take no draws.' then 'old'
           when prompt = 'Which of ISIALA''s reported numbers would move if the whole reading were rerun at another seed?' and options = '["Only the emv, since the three cases and three percentiles are read from fixed sorted positions, and a position does not depend on which draw landed in it.", "Every number including the base breakeven of 71.6277, since the breakeven engine solves its base case from the first draw of each iteration rather than the stated medians.", "The three NPV cases, the emv and the three breakeven percentiles, while the deterministic NPV of 81.0464 and the base breakeven of 71.6277 stay put.", "None of them, since the repaired engines fix the seed at 20260829 and ignore any other seed they are passed."]'::jsonb and answer_index = 2 and explanation = 'A seed moves the sample: seed 43 gives a Best case P50 of 80.2233 and seed 7 a median breakeven price of 72.8475. The deterministic case and the base solve at the stated medians take no draws.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 37'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which of ISIALA''s reported numbers would move if the whole reading were rerun at another seed?', options = '["Only the emv, since the three cases and three percentiles are read from fixed sorted positions, and a position does not depend on which draw landed in it.", "Every number including the base breakeven of 71.6277, since the breakeven engine solves its base case from the first draw of each iteration rather than the stated medians.", "The three NPV cases, the emv and the three breakeven percentiles, while the deterministic NPV of 81.0464 and the base breakeven of 71.6277 stay put.", "None of them, since the repaired engines fix the seed at 20260829 and ignore any other seed they are passed."]'::jsonb, explanation = 'A seed moves the sample: seed 43 gives a Best case P50 of 80.2233 and seed 7 a median breakeven price of 72.8475. The deterministic case and the base solve at the stated medians take no draws.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 38: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reader takes the value at height 90 on ISIALA''s Scenario Builder S-curve and prints it as the P90. Which pair of errors has been made?' and options = '["None in the label, since height 90 is the Low case P90, but the curve plots averages where the card reads a single value from the sorted NPVs, which is why the two disagree.", "The curve stops at 98, so height 90 is extrapolated, and the extrapolation borrows the breakeven engine''s (i + 1) / n axis.", "The axis counts exceedance, so height 90 is the Low case, and the curve is drawn from bin edges rather than from the sorted sample of 1000 NPVs that the three cards read.", "Height 90 is the value 90 percent of the sample falls below, the High case P10, and the curve reads a single sorted value, 109.9036 against the card''s 109.8980."]'::jsonb and answer_index = 3 and explanation = 'The y axis counts from below, so a label taken straight off it swaps the cases the way the old cards did, and the curve uses the rule the cards do not (EC3-6).' then 'old'
           when prompt = 'A reader takes the value at height 90 on ISIALA''s Scenario Builder S-curve and prints it as the P90. What is wrong?' and options = '["Nothing in the label, since height 90 is the Low case P90, but the curve plots averages where the card reads a single sorted value, which is what makes the two disagree.", "The curve stops short of the top of the sample, so height 90 has to be extrapolated from the last point the chart actually draws.", "The axis counts exceedance, so height 90 is already the Low case, and the only error is that the curve is drawn from bin edges.", "Height 90 is the value 90 percent of the sample falls below, which is the High case P10 at 152.0653, so the label names the opposite case."]'::jsonb and answer_index = 3 and explanation = 'The y axis counts the share below a value, so a P-label taken straight off it swaps the cases the way the old cards did. The curve and the cards now share one rule, so both give 152.0653.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 38'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader takes the value at height 90 on ISIALA''s Scenario Builder S-curve and prints it as the P90. What is wrong?', options = '["Nothing in the label, since height 90 is the Low case P90, but the curve plots averages where the card reads a single sorted value, which is what makes the two disagree.", "The curve stops short of the top of the sample, so height 90 has to be extrapolated from the last point the chart actually draws.", "The axis counts exceedance, so height 90 is already the Low case, and the only error is that the curve is drawn from bin edges.", "Height 90 is the value 90 percent of the sample falls below, which is the High case P10 at 152.0653, so the label names the opposite case."]'::jsonb, explanation = 'The y axis counts the share below a value, so a P-label taken straight off it swaps the cases the way the old cards did. The curve and the cards now share one rule, so both give 152.0653.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 39: option_3, explanation
  select case
           when prompt = 'In `mc_with_unreachable`, 55 of 120 iterations are excluded and the 10th percentile of breakeven price reads 397.3404. Which statement about that number is right?' and options = '["It is the mean of two neighbouring prices, since the breakeven engine switches to the averaging rule once exclusions leave an odd count.", "It is a price one surviving iteration produced, read by the floor rule, and it describes only iterations that broke even below 500 USD per bbl.", "It already counts every excluded iteration as a price of 500 USD per bbl at the top of the bracket, so a 10th percentile over all 120 iterations would sit lower still.", "It is also the tornado''s low end for capex, since the bars and the percentiles are read from the same excluded sample of surviving iterations."]'::jsonb and answer_index = 1 and explanation = 'The floor rule has one branch at any surviving count. On the same case every tornado high side reads 0.0000 (B1), so neither the percentiles nor the bars see the iterations that never broke even.' then 'old'
           when prompt = 'In `mc_with_unreachable`, 55 of 120 iterations are excluded and the 10th percentile of breakeven price reads 397.3404. Which statement about that number is right?' and options = '["It is the mean of two neighbouring prices, since the breakeven engine switches to the averaging rule once exclusions leave an odd count.", "It is a price one surviving iteration produced, read by the floor rule, and it describes only iterations that broke even below 500 USD per bbl.", "It already counts every excluded iteration as a price of 500 USD per bbl at the top of the bracket, so a 10th percentile over all 120 iterations would sit lower still.", "It is also the tornado''s low end for capex, since the bars and the percentiles are read from the same surviving iterations."]'::jsonb and answer_index = 1 and explanation = 'The floor rule has one branch at any surviving count. On the same case every tornado high side is null and every bar unreachable, so neither the percentiles nor the bars see the iterations that never broke even.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 39'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'In `mc_with_unreachable`, 55 of 120 iterations are excluded and the 10th percentile of breakeven price reads 397.3404. Which statement about that number is right?', options = '["It is the mean of two neighbouring prices, since the breakeven engine switches to the averaging rule once exclusions leave an odd count.", "It is a price one surviving iteration produced, read by the floor rule, and it describes only iterations that broke even below 500 USD per bbl.", "It already counts every excluded iteration as a price of 500 USD per bbl at the top of the bracket, so a 10th percentile over all 120 iterations would sit lower still.", "It is also the tornado''s low end for capex, since the bars and the percentiles are read from the same surviving iterations."]'::jsonb, explanation = 'The floor rule has one branch at any surviving count. On the same case every tornado high side is null and every bar unreachable, so neither the percentiles nor the bars see the iterations that never broke even.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 40: prompt
  select case
           when prompt = 'A memo pairs ISIALA''s Low case P90 of 48.7439 with its 90th percentile of breakeven price, 85.5912 USD per bbl, as the downside of one run. What is wrong?' and options = '["They come from different engines and samples, uniform ranges on price, capex and reserves against fitted triangles on capex, opex and efficiency, so no iteration links them.", "Nothing, since both are 90 percent statements and the shared seed of 20260829 makes them come from the same iterations.", "The price should be the 10th percentile of breakeven price, 62.1713, because a low NPV pairs with the lowest breakeven.", "They are one run, but the NPV has to be restated at year end with 1.058301 before it can sit beside a price."]'::jsonb and answer_index = 0 and explanation = 'At one seed the first draw, 0.936239, is an oil volume in one app and a capex of 226.5205 million USD in the other. A shared label or pairing invents a link.' then 'old'
           when prompt = 'A memo pairs ISIALA''s Low case P90 of 15.6063 with its 90th percentile of breakeven price, 85.5912 USD per bbl, as the downside of one run. What is wrong?' and options = '["They come from different engines and samples, uniform ranges on price, capex and reserves against fitted triangles on capex, opex and efficiency, so no iteration links them.", "Nothing, since both are 90 percent statements and the shared seed of 20260829 makes them come from the same iterations.", "The price should be the 10th percentile of breakeven price, 62.1713, because a low NPV pairs with the lowest breakeven.", "They are one run, but the NPV has to be restated at year end with 1.058301 before it can sit beside a price."]'::jsonb and answer_index = 0 and explanation = 'At one seed the first draw, 0.936239, is an oil volume in one app and a capex of 226.5205 million USD in the other. A shared label or pairing invents a link.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 40'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A memo pairs ISIALA''s Low case P90 of 15.6063 with its 90th percentile of breakeven price, 85.5912 USD per bbl, as the downside of one run. What is wrong?', options = '["They come from different engines and samples, uniform ranges on price, capex and reserves against fitted triangles on capex, opex and efficiency, so no iteration links them.", "Nothing, since both are 90 percent statements and the shared seed of 20260829 makes them come from the same iterations.", "The price should be the 10th percentile of breakeven price, 62.1713, because a low NPV pairs with the lowest breakeven.", "They are one run, but the NPV has to be restated at year end with 1.058301 before it can sit beside a price."]'::jsonb, explanation = 'At one seed the first draw, 0.936239, is an oil volume in one app and a capex of 226.5205 million USD in the other. A shared label or pairing invents a link.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 41: option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'An analyst widens ISIALA''s price, capex and reserves ranges until the Low case P90 looks cautious enough, then calls it a risk assessment. What does the tier say?' and options = '["It becomes sound once the ranges pass 30 percent, the width the sensitivity sweep uses, because the two tools then agree.", "It becomes sound if the seed is changed as well, since a new seed removes the independence between years that narrows the sample and lets the tails reach further.", "It is sound, because the Low case P90 then approaches the scenario Low of -72.1531, and that scenario is the probability weighted downside of the whole field.", "A wider uniform range only fattens independent noise; the missing risk is correlated across years, sits in opex, royalty and tax, or is never modelled."]'::jsonb and answer_index = 3 and explanation = 'Independence is why 48.7439 sits far above -72.1531 (EC3-7), and no range reaches the 20 year life, the decline or the TaxRoyalty terms.' then 'old'
           when prompt = 'An analyst widens ISIALA''s price, capex and reserves ranges until the Low case P90 looks cautious enough, then calls it a risk assessment. What does the tier say?' and options = '["It becomes sound once the ranges pass 30 percent, the width the sensitivity sweep uses, because the two tools then agree.", "It becomes sound if the seed is changed as well, since a new seed lets the tails of the sample reach further than any one seed can.", "It is sound, because the Low case P90 then approaches the scenario Low of -57.8151, and that scenario is the probability weighted downside of the whole field.", "A wider uniform range only fattens three factors already drawn; the missing risk is correlated between them, sits in fixed opex, royalty and tax, or is never modelled."]'::jsonb and answer_index = 3 and explanation = 'Independence between the three factors is why 15.6063 sits far above -57.8151 (EC3-7), and no range reaches the 20 year life, the decline or the TaxRoyalty terms.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 41'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An analyst widens ISIALA''s price, capex and reserves ranges until the Low case P90 looks cautious enough, then calls it a risk assessment. What does the tier say?', options = '["It becomes sound once the ranges pass 30 percent, the width the sensitivity sweep uses, because the two tools then agree.", "It becomes sound if the seed is changed as well, since a new seed lets the tails of the sample reach further than any one seed can.", "It is sound, because the Low case P90 then approaches the scenario Low of -57.8151, and that scenario is the probability weighted downside of the whole field.", "A wider uniform range only fattens three factors already drawn; the missing risk is correlated between them, sits in fixed opex, royalty and tax, or is never modelled."]'::jsonb, explanation = 'Independence between the three factors is why 15.6063 sits far above -57.8151 (EC3-7), and no range reaches the 20 year life, the decline or the TaxRoyalty terms.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3a_exam ord 42: option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Which sentence reports ISIALA''s Low case the way the tier requires?' and options = '["P90 (Conservative) 48.7439 million USD at 1000 iterations and seed 20260829, the cautious card of the three.", "A P10 of 48.7439, since the engine returned it under `p10` and a key names its own label, from 1000 draws at seed 20260829.", "Low case P90 48.7439 million USD, engine key `p10`, averaging rule, 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.", "A 90 percent chance of at least 48.8335 million USD, the single sorted value at index 100, with the ranges and seed recorded beside it."]'::jsonb and answer_index = 2 and explanation = 'The Low case prints P90 while reading `p10`, so the version printed as P10 reads the key aloud as a label, which is the mistake. 48.8335 is the floor rule''s reading, and Conservative is not a word of the convention.' then 'old'
           when prompt = 'Which sentence reports ISIALA''s Low case the way the tier requires?' and options = '["P90 (Conservative) 15.6063 million USD at 1000 iterations and seed 20260829, the cautious card of the three.", "A P10 of 15.6063, since the engine returned it under `p10` and a key names its own label, from 1000 draws at seed 20260829.", "Low case P90 15.6063 million USD, engine key `p10`, averaging rule, 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.", "A 90 percent chance of at least 15.6619 million USD, the single sorted value at index 100, with the ranges and seed recorded beside it."]'::jsonb and answer_index = 2 and explanation = 'The Low case prints P90 while reading `p10`, so the version printed as P10 reads the key aloud as a label, which is the mistake. 15.6619 is the floor rule''s reading, and Conservative is not a word of the convention.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3a_exam ord 42'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3a_exam ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which sentence reports ISIALA''s Low case the way the tier requires?', options = '["P90 (Conservative) 15.6063 million USD at 1000 iterations and seed 20260829, the cautious card of the three.", "A P10 of 15.6063, since the engine returned it under `p10` and a key names its own label, from 1000 draws at seed 20260829.", "Low case P90 15.6063 million USD, engine key `p10`, averaging rule, 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829.", "A 90 percent chance of at least 15.6619 million USD, the single sorted value at index 100, with the ranges and seed recorded beside it."]'::jsonb, explanation = 'The Low case prints P90 while reading `p10`, so the version printed as P10 reads the key aloud as a label, which is the mistake. 15.6619 is the floor rule''s reading, and Conservative is not a word of the convention.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3a_exam ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the count assertions --
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC3 recut refused: beginner holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC3 recut refused: intermediate holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC3 recut refused: advanced holds % questions, expected 132', v_count; end if;

  raise notice 'EC3 recut advanced: % of 89 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-one-meaning-of-a-p-label', 1),
    ('module', 'm01-one-meaning-of-a-p-label', 2),
    ('module', 'm01-one-meaning-of-a-p-label', 3),
    ('module', 'm01-one-meaning-of-a-p-label', 4),
    ('module', 'm01-one-meaning-of-a-p-label', 7),
    ('module', 'm01-one-meaning-of-a-p-label', 8),
    ('module', 'm01-one-meaning-of-a-p-label', 11),
    ('module', 'm01-one-meaning-of-a-p-label', 12),
    ('module', 'm01-one-meaning-of-a-p-label', 13),
    ('module', 'm01-one-meaning-of-a-p-label', 14),
    ('module', 'm01-one-meaning-of-a-p-label', 15),
    ('module', 'm02-the-scenario-builder-monte-carlo', 1),
    ('module', 'm02-the-scenario-builder-monte-carlo', 2),
    ('module', 'm02-the-scenario-builder-monte-carlo', 3),
    ('module', 'm02-the-scenario-builder-monte-carlo', 4),
    ('module', 'm02-the-scenario-builder-monte-carlo', 5),
    ('module', 'm02-the-scenario-builder-monte-carlo', 6),
    ('module', 'm02-the-scenario-builder-monte-carlo', 7),
    ('module', 'm02-the-scenario-builder-monte-carlo', 9),
    ('module', 'm02-the-scenario-builder-monte-carlo', 11),
    ('module', 'm02-the-scenario-builder-monte-carlo', 12),
    ('module', 'm02-the-scenario-builder-monte-carlo', 13),
    ('module', 'm02-the-scenario-builder-monte-carlo', 14),
    ('module', 'm02-the-scenario-builder-monte-carlo', 15),
    ('module', 'm03-two-percentile-rules', 1),
    ('module', 'm03-two-percentile-rules', 2),
    ('module', 'm03-two-percentile-rules', 4),
    ('module', 'm03-two-percentile-rules', 5),
    ('module', 'm03-two-percentile-rules', 8),
    ('module', 'm03-two-percentile-rules', 9),
    ('module', 'm03-two-percentile-rules', 10),
    ('module', 'm03-two-percentile-rules', 11),
    ('module', 'm04-edges-that-used-to-break', 5),
    ('module', 'm04-edges-that-used-to-break', 6),
    ('module', 'm04-edges-that-used-to-break', 7),
    ('module', 'm04-edges-that-used-to-break', 9),
    ('module', 'm04-edges-that-used-to-break', 10),
    ('module', 'm04-edges-that-used-to-break', 11),
    ('module', 'm04-edges-that-used-to-break', 12),
    ('module', 'm04-edges-that-used-to-break', 14),
    ('module', 'm04-edges-that-used-to-break', 15),
    ('module', 'm05-numbers-to-distrust', 1),
    ('module', 'm05-numbers-to-distrust', 2),
    ('module', 'm05-numbers-to-distrust', 3),
    ('module', 'm05-numbers-to-distrust', 4),
    ('module', 'm05-numbers-to-distrust', 5),
    ('module', 'm05-numbers-to-distrust', 6),
    ('module', 'm05-numbers-to-distrust', 15),
    ('module', 'm06-the-expert-reading', 1),
    ('module', 'm06-the-expert-reading', 2),
    ('module', 'm06-the-expert-reading', 3),
    ('module', 'm06-the-expert-reading', 4),
    ('module', 'm06-the-expert-reading', 6),
    ('module', 'm06-the-expert-reading', 7),
    ('module', 'm06-the-expert-reading', 8),
    ('module', 'm06-the-expert-reading', 9),
    ('module', 'm06-the-expert-reading', 11),
    ('module', 'm06-the-expert-reading', 14),
    ('final', null::text, 1),
    ('final', null::text, 4),
    ('final', null::text, 5),
    ('final', null::text, 6),
    ('final', null::text, 7),
    ('final', null::text, 8),
    ('final', null::text, 9),
    ('final', null::text, 10),
    ('final', null::text, 11),
    ('final', null::text, 12),
    ('final', null::text, 13),
    ('final', null::text, 14),
    ('final', null::text, 15),
    ('final', null::text, 16),
    ('final', null::text, 19),
    ('final', null::text, 22),
    ('final', null::text, 23),
    ('final', null::text, 24),
    ('final', null::text, 25),
    ('final', null::text, 27),
    ('final', null::text, 28),
    ('final', null::text, 29),
    ('final', null::text, 32),
    ('final', null::text, 34),
    ('final', null::text, 36),
    ('final', null::text, 37),
    ('final', null::text, 38),
    ('final', null::text, 39),
    ('final', null::text, 40),
    ('final', null::text, 41),
    ('final', null::text, 42)
)
select 'ec3 recut advanced' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'uncertainty' and q.tier = 'advanced'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec3 recut advanced' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'uncertainty' and tier = 'advanced'
 group by scope, module_key
 order by scope desc, module_key nulls last;
