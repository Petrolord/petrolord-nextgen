-- ============================================================================
-- EC3 RECUT, ASSOCIATE TIER (beginner): Probabilistic Economics
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
-- WHAT MOVES. 48 of the 132 Associate questions, 39 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to
-- change, the new correct text was written at the SAME index, so the key
-- balance and key pattern of every bank are untouched. No ord, no module key,
-- no scope and no row count moves.
-- Fields rewritten: 36 prompts, 143 options, 45 explanations.
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and the tier must still hold
-- 132 questions at the end.
--
-- Every published string below was read from the LIVE production row, not
-- retyped: see docs/ec3-recut/RECUT-beginner.json, whose OLD text was verified
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

  -- ec3b_m01 ord 1: prompt, option_0, explanation
  select case
           when prompt = 'ISIALA''s screening NPV is 81.0464 million USD. The sampled run at seed 20260829 gives an emv of 80.1707 and a Best case P50 of 81.1835. What is 81.0464?' and options = '["The mean of the sampled NPVs before the engine rounds it for display, which is why it lands so close to the emv of 80.1707.", "The Best case P50 of the deterministic run, the value the project meets or exceeds half of the time.", "The value at the inputs exactly as typed, which is neither a mean nor a Best case P50 of anything.", "What the project will probably earn, since every input is a most likely value."]'::jsonb and answer_index = 2 and explanation = 'A deterministic NPV carries no probability. On ISIALA the emv of 80.1707 and the Best case P50 of 81.1835 land close to it, and nothing in the engine promises they will on the next field.' then 'old'
           when prompt = 'ISIALA''s screening NPV is 81.0464 million USD. The sampled run at seed 20260829 gives an emv of 80.9836 and a Best case P50 of 78.5315. What is 81.0464?' and options = '["The mean of the sampled NPVs before the engine rounds it for display, which is why it lands so close to the emv of 80.9836.", "The Best case P50 of the deterministic run, the value the project meets or exceeds half of the time.", "The value at the inputs exactly as typed, which is neither a mean nor a Best case P50 of anything.", "What the project will probably earn, since every input is a most likely value."]'::jsonb and answer_index = 2 and explanation = 'A deterministic NPV carries no probability. On ISIALA the emv of 80.9836 and the Best case P50 of 78.5315 land close to it, and nothing in the engine promises they will on the next field.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-screening-model-is' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m01 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m01 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s screening NPV is 81.0464 million USD. The sampled run at seed 20260829 gives an emv of 80.9836 and a Best case P50 of 78.5315. What is 81.0464?', options = '["The mean of the sampled NPVs before the engine rounds it for display, which is why it lands so close to the emv of 80.9836.", "The Best case P50 of the deterministic run, the value the project meets or exceeds half of the time.", "The value at the inputs exactly as typed, which is neither a mean nor a Best case P50 of anything.", "What the project will probably earn, since every input is a most likely value."]'::jsonb, explanation = 'A deterministic NPV carries no probability. On ISIALA the emv of 80.9836 and the Best case P50 of 78.5315 land close to it, and nothing in the engine promises they will on the next field.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-screening-model-is' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m01 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m01 ord 2: prompt, option_0, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario returns -72.1531 and the sampled run''s Low case P90 is 48.7439. Why are both called low without being the same kind of number?' and options = '["The scenario moves every input the wrong way at once and carries no probability, while 48.7439 is met or exceeded with a 90 percent probability.", "The scenario is a deeper point of the same sampled distribution, taken further into the low tail than the Low case P90, so the two differ only in how much probability they leave below them.", "The Low case P90 is the value the sampled NPV falls below 90 percent of the time, so 48.7439 is the optimistic reading of the run and -72.1531 is the conservative reading of the same run.", "The scenario moves only price and production while the sample moves price, capex and reserves, so the two lows differ because they vary different inputs at the same probability."]'::jsonb and answer_index = 0 and explanation = 'A scenario attaches no probability at all, and under the exceedance meaning P90 is a 90 percent probability the NPV meets or exceeds 48.7439. Reading P90 as the value the NPV falls below is the label misread one distractor makes, and the Low scenario also raises capex and fixed opex.' then 'old'
           when prompt = 'ISIALA''s Low scenario returns -57.8151 and the sampled run''s Low case P90 is 15.6063. Why are both called low without being the same kind of number?' and options = '["The scenario moves every input the wrong way at once and carries no probability, while 15.6063 is met or exceeded with a 90 percent probability.", "The scenario is a deeper point of the same sampled distribution, taken further into the low tail than the Low case P90, so the two differ only in how much probability they leave below them.", "The Low case P90 is the value the sampled NPV falls below 90 percent of the time, so 15.6063 is the optimistic reading of the run and -57.8151 is the conservative reading of the same run.", "The scenario moves only price and production while the sample moves price, capex and reserves, so the two lows differ because they vary different inputs at the same probability."]'::jsonb and answer_index = 0 and explanation = 'A scenario attaches no probability at all, and under the exceedance meaning P90 is a 90 percent probability the NPV meets or exceeds 15.6063. Reading P90 as the value the NPV falls below is the label misread one distractor makes, and the Low scenario also raises capex and fixed opex.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-screening-model-is' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m01 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m01 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario returns -57.8151 and the sampled run''s Low case P90 is 15.6063. Why are both called low without being the same kind of number?', options = '["The scenario moves every input the wrong way at once and carries no probability, while 15.6063 is met or exceeded with a 90 percent probability.", "The scenario is a deeper point of the same sampled distribution, taken further into the low tail than the Low case P90, so the two differ only in how much probability they leave below them.", "The Low case P90 is the value the sampled NPV falls below 90 percent of the time, so 15.6063 is the optimistic reading of the run and -57.8151 is the conservative reading of the same run.", "The scenario moves only price and production while the sample moves price, capex and reserves, so the two lows differ because they vary different inputs at the same probability."]'::jsonb, explanation = 'A scenario attaches no probability at all, and under the exceedance meaning P90 is a 90 percent probability the NPV meets or exceeds 15.6063. Reading P90 as the value the NPV falls below is the label misread one distractor makes, and the Low scenario also raises capex and fixed opex.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-screening-model-is' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m01 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m02 ord 7: option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and the engine reports a payback of 0.0000 years. What does that 0 mean?' and options = '["The project never had any money at risk.", "Payback on discounted cash, positive throughout.", "No crossing was found, so 0 is a refusal.", "The cumulative was non-negative at index 0, where payback is read, and the reading is never revisited after the second 130.0000 takes the project under water."]'::jsonb and answer_index = 3 and explanation = 'Payback is read where the cumulative is first non-negative, and OKPOMA''s split capex puts that at index 0. The project was still under water after its second year, which the payback never shows.' then 'old'
           when prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and the engine reports a payback of 0.0000 years. What does that 0 mean?' and options = '["The project never had any money at risk, since 2027''s gross revenue of 193.5960 covers both halves of the 260 before 2028 begins.", "Payback read on discounted cash, which stays positive throughout because the mid-year factors shrink 2028''s shortfall below 2027''s surplus.", "No crossing was found at all, so 0.0000 is the engine''s refusal, the same value it returns for a project that never recovers.", "Payback is the FIRST crossing, at index 0 where the cumulative is already non-negative, and paybackStatus recrossed with paybackLast 2.0385 records the later dip."]'::jsonb and answer_index = 3 and explanation = 'Payback is read at the first year whose cumulative is non-negative, which OKPOMA''s split capex puts at index 0. The status carries the rest, recrossed with paybackLast 2.0385 where the money is back for good, and before the 2026-09-15 repair the same 0.0000 came with no status at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m02 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m02 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and the engine reports a payback of 0.0000 years. What does that 0 mean?', options = '["The project never had any money at risk, since 2027''s gross revenue of 193.5960 covers both halves of the 260 before 2028 begins.", "Payback read on discounted cash, which stays positive throughout because the mid-year factors shrink 2028''s shortfall below 2027''s surplus.", "No crossing was found at all, so 0.0000 is the engine''s refusal, the same value it returns for a project that never recovers.", "Payback is the FIRST crossing, at index 0 where the cumulative is already non-negative, and paybackStatus recrossed with paybackLast 2.0385 records the later dip."]'::jsonb, explanation = 'Payback is read at the first year whose cumulative is non-negative, which OKPOMA''s split capex puts at index 0. The status carries the rest, recrossed with paybackLast 2.0385 where the money is back for good, and before the 2026-09-15 repair the same 0.0000 came with no status at all.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m02 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m02 ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Production and Oil Price bars both read -17.3893 at 0.7 and 175.8952 at 1.3. Why are they identical?' and options = '["Revenue is volume times price, so any bar scaling either term must match.", "The two bars share one sweep inside the engine.", "The Production bar scales oil volume only and variable opex does not follow it, so the scaled barrels arrive with no extra cost, exactly as a higher price would.", "Production also scales variable opex."]'::jsonb and answer_index = 2 and explanation = 'On a field with variable opex those two bars should differ. Here they do not, because the case holds variable opex as fixed millions per year once it has been built.' then 'old'
           when prompt = 'ISIALA''s Production bar runs from 4.1176 to 156.4596 while its Oil Price bar runs from -17.3893 to 175.8952. Why is the Production bar the narrower of the two?' and options = '["Revenue is volume times price, so any bar that scales either term moves the NPV by the same amount and the two widths can differ only by rounding.", "The two bars are swept over different multipliers, 0.8 and 1.2 for production against 0.7 and 1.3 for price, because a volume forecast is held to be the better known of the two.", "Production scales oil volume AND the variable opex those barrels carry, so at 0.7 the smaller field also pays a smaller operating bill.", "Royalty is charged on barrels rather than on revenue, so a volume change reaches the NPV after the state takes its share."]'::jsonb and answer_index = 2 and explanation = 'The two bars scale the same revenue by the same fraction and only Production moves the cost the barrels carry, so it keeps 4.1176 where the price bar reaches -17.3893. Before the 2026-09-15 repair Production scaled volume alone and printed the price bar''s pair to four decimals.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m02 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m02 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Production bar runs from 4.1176 to 156.4596 while its Oil Price bar runs from -17.3893 to 175.8952. Why is the Production bar the narrower of the two?', options = '["Revenue is volume times price, so any bar that scales either term moves the NPV by the same amount and the two widths can differ only by rounding.", "The two bars are swept over different multipliers, 0.8 and 1.2 for production against 0.7 and 1.3 for price, because a volume forecast is held to be the better known of the two.", "Production scales oil volume AND the variable opex those barrels carry, so at 0.7 the smaller field also pays a smaller operating bill.", "Royalty is charged on barrels rather than on revenue, so a volume change reaches the NPV after the state takes its share."]'::jsonb, explanation = 'The two bars scale the same revenue by the same fraction and only Production moves the cost the barrels carry, so it keeps 4.1176 where the price bar reaches -17.3893. Before the 2026-09-15 repair Production scaled volume alone and printed the price bar''s pair to four decimals.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m02 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m02 ord 13: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario reads totalOpex 220.4887 and the High scenario 200.4887, the same distance either side of the Base 210.4887, although Low produces less oil than High. Why?' and options = '["The scenarios scale fixed opex by a fifth either way and never scale variable opex, so the whole distance is fixed opex.", "Variable opex falls with Low''s production while fixed opex rises by more, and the two effects happen to net to the same distance on ISIALA.", "The scenarios scale total ledger opex by a fifth either way, and the base total is small enough that the two moves come out the same size.", "Opex is sampled in both scenarios with the same seed."]'::jsonb and answer_index = 0 and explanation = 'Twenty years of fixed opex at 2.5 is raised or lowered by a fifth, while variable opex keeps the base case''s millions per year although Low produces less oil than High.' then 'old'
           when prompt = 'ISIALA''s Low scenario reads totalOpex 188.3910 and the High scenario 232.5864 either side of the Base 210.4887, so the smaller field is the cheaper one to run. Which rule puts it there?' and options = '["Low scales production and the variable opex those barrels carry by 0.8 while raising fixed opex by 1.2, and the variable half is much the larger of the two.", "Low scales the whole ledger opex column by 0.8 and High by 1.2, so the flat charge of 2.5 million USD a year follows the barrels down with everything else.", "Low produces for fewer years, because a scenario ends the case at the first year whose opex outruns its revenue and the fixed charge stops with it.", "Both scenarios hold opex at the base, and the gap between 188.3910 and 232.5864 is the capex that each case charges through the same column."]'::jsonb and answer_index = 0 and explanation = 'Fixed opex of 2.5 a year moves against the volume and variable opex of 20.8780 in 2027 alone moves with it, so Low lands below the Base. Before the 2026-09-15 repair the scenarios held variable opex at the base volume and Low read 220.4887 against High''s 200.4887.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m02 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m02 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario reads totalOpex 188.3910 and the High scenario 232.5864 either side of the Base 210.4887, so the smaller field is the cheaper one to run. Which rule puts it there?', options = '["Low scales production and the variable opex those barrels carry by 0.8 while raising fixed opex by 1.2, and the variable half is much the larger of the two.", "Low scales the whole ledger opex column by 0.8 and High by 1.2, so the flat charge of 2.5 million USD a year follows the barrels down with everything else.", "Low produces for fewer years, because a scenario ends the case at the first year whose opex outruns its revenue and the fixed charge stops with it.", "Both scenarios hold opex at the base, and the gap between 188.3910 and 232.5864 is the capex that each case charges through the same column."]'::jsonb, explanation = 'Fixed opex of 2.5 a year moves against the volume and variable opex of 20.8780 in 2027 alone moves with it, so Low lands below the Base. Before the 2026-09-15 repair the scenarios held variable opex at the base volume and Low read 220.4887 against High''s 200.4887.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m02 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m02 ord 15: option_0, option_1, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What price paths can the Scenario Builder''s Monte Carlo draw around ISIALA''s flat 70 USD per bbl?' and options = '["One price drawn per iteration and held flat for all twenty rows of the case.", "A price drawn for each year around 70, with no trend, since the case holds no deck and no escalation.", "A deck that escalates from 70 at a sampled rate.", "A random walk, with each year''s price starting from the year before''s draw, so that a run can trend up or down across the life of the field."]'::jsonb and answer_index = 1 and explanation = 'The flat price refuses a deck, escalation and inflation. The Monte Carlo can draw a price for each year around 70 and never draws a trend, and 70.0000 in 2046 is the same number of USD as 70.0000 in 2027.' then 'old'
           when prompt = 'What price paths can the Scenario Builder''s Monte Carlo draw around ISIALA''s flat 70 USD per bbl?' and options = '["A price drawn separately for each of the twenty years around 70, so a single run can hold a high year beside a low one with no trend across the life.", "One factor drawn per iteration and applied to all twenty rows, so the whole flat deck moves up or down together.", "A deck that escalates from 70 at a rate drawn once an iteration.", "A random walk, with each year''s price starting from the year before''s draw, so that a run can trend up or down across the life of the field."]'::jsonb and answer_index = 1 and explanation = 'The engine draws ONE factor per uncertain variable per iteration, uniform on the stated range, and applies it to every year, so the case stays flat and only its level moves. Before the 2026-09-15 repair every year was drawn separately.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m02 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m02 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What price paths can the Scenario Builder''s Monte Carlo draw around ISIALA''s flat 70 USD per bbl?', options = '["A price drawn separately for each of the twenty years around 70, so a single run can hold a high year beside a low one with no trend across the life.", "One factor drawn per iteration and applied to all twenty rows, so the whole flat deck moves up or down together.", "A deck that escalates from 70 at a rate drawn once an iteration.", "A random walk, with each year''s price starting from the year before''s draw, so that a run can trend up or down across the life of the field."]'::jsonb, explanation = 'The engine draws ONE factor per uncertain variable per iteration, uniform on the stated range, and applies it to every year, so the case stays flat and only its level moves. Before the 2026-09-15 repair every year was drawn separately.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-case-before-the-numbers' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m02 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m03 ord 6: prompt, explanation
  select case
           when prompt = 'ISIALA''s Low scenario reads totalRevenue 553.0688 and totalRoyalty 82.9603, both in proportion to the Base, but totalTax of 62.9637, less than half the Base 136.0307. Why does tax fall faster?' and options = '["Low runs at a lower tax rate, since the scenarios scale the tax rate with price.", "Royalty is taken twice in Low, on revenue and on scaled production.", "Low carries its capex year losses forward, so the deductions from the two capex years reduce every later year''s tax until they are used up, which the Base case never needs to do at all.", "Tax depends on costs as well as revenue, and Low raises capex and fixed opex by a fifth while its revenue falls, so the taxable base shrinks faster than revenue."]'::jsonb and answer_index = 3 and explanation = 'Royalty is a fixed fraction of the first line and scales one for one with revenue. Tax is charged on what is left after costs, and in Low the costs rose while revenue fell; there is no loss carry forward in either case.' then 'old'
           when prompt = 'ISIALA''s Low scenario reads totalRevenue 553.0688 and totalRoyalty 82.9603, both in proportion to the Base, but totalTax of 71.4503, barely over half the Base 136.0307. Why does tax fall faster?' and options = '["Low runs at a lower tax rate, since the scenarios scale the tax rate with price.", "Royalty is taken twice in Low, on revenue and on scaled production.", "Low carries its capex year losses forward, so the deductions from the two capex years reduce every later year''s tax until they are used up, which the Base case never needs to do at all.", "Tax depends on costs as well as revenue, and Low raises capex and fixed opex by a fifth while its revenue falls, so the taxable base shrinks faster than revenue."]'::jsonb and answer_index = 3 and explanation = 'Royalty is a fixed fraction of the first line and scales one for one with revenue. Tax is charged on what is left after costs, and Low charges capex of 216.0000 against a revenue of 553.0688; there is no loss carry forward in either case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-royalty-and-tax-ledger' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m03 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m03 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario reads totalRevenue 553.0688 and totalRoyalty 82.9603, both in proportion to the Base, but totalTax of 71.4503, barely over half the Base 136.0307. Why does tax fall faster?', options = '["Low runs at a lower tax rate, since the scenarios scale the tax rate with price.", "Royalty is taken twice in Low, on revenue and on scaled production.", "Low carries its capex year losses forward, so the deductions from the two capex years reduce every later year''s tax until they are used up, which the Base case never needs to do at all.", "Tax depends on costs as well as revenue, and Low raises capex and fixed opex by a fifth while its revenue falls, so the taxable base shrinks faster than revenue."]'::jsonb, explanation = 'Royalty is a fixed fraction of the first line and scales one for one with revenue. Tax is charged on what is left after costs, and Low charges capex of 216.0000 against a revenue of 553.0688; there is no loss carry forward in either case.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-royalty-and-tax-ledger' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m03 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 7: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario reports a payback of 20.0000 years on its twenty year life. How should that be read?' and options = '["It never pays back: the engine reports the project life when the cumulative never stops being negative.", "It recovers in its final year, 2046, when the last row''s positive net cash flow closes the hole just before the life ends.", "The engine clamps payback at the life as it clamps the IRR at 1000 percent, so the true recovery lies past 2046.", "It recovers at the end of the life, because with no economic limit the engine runs every row until the cumulative reaches zero."]'::jsonb and answer_index = 0 and explanation = 'payback_never reports 5.0000 on a five period life for the same reason, and a value equal to the life cannot tell recovery at the very end from no recovery.' then 'old'
           when prompt = 'ISIALA''s Low scenario reports payback null with paybackStatus not-recovered. How should that pair be read?' and options = '["Its cumulative never stops being negative inside the twenty year life, so there is no crossing to report and the engine names the reason.", "It recovers in its final year, 2046, when the last row''s positive net cash flow closes the hole just before the life ends and leaves no figure to print.", "The engine could not finish the reading, because payback is struck on the discounted column and Low''s NPV of -57.8151 leaves that column negative throughout.", "Payback was suppressed because Low''s IRR of -0.6992 percent is negative, so the engine returns null for both."]'::jsonb and answer_index = 0 and explanation = 'The four statuses are ok, recrossed, no-investment and not-recovered. Before the 2026-09-15 repair a project that never recovered printed the project life instead, 20.0000 on Low and 5.0000 on payback_never, which reads like recovery in the final year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario reports payback null with paybackStatus not-recovered. How should that pair be read?', options = '["Its cumulative never stops being negative inside the twenty year life, so there is no crossing to report and the engine names the reason.", "It recovers in its final year, 2046, when the last row''s positive net cash flow closes the hole just before the life ends and leaves no figure to print.", "The engine could not finish the reading, because payback is struck on the discounted column and Low''s NPV of -57.8151 leaves that column negative throughout.", "Payback was suppressed because Low''s IRR of -0.6992 percent is negative, so the engine returns null for both."]'::jsonb, explanation = 'The four statuses are ok, recrossed, no-investment and not-recovered. Before the 2026-09-15 repair a project that never recovered printed the project life instead, 20.0000 on Low and 5.0000 on payback_never, which reads like recovery in the final year.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 8: option_0, option_1, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and its payback reads 0.0000. What happened?' and options = '["OKPOMA found no crossing from negative to non-negative, and 0.0000 is the engine''s return for a project that never recovers.", "Payback is computed on discounted flows, and the discounted 2027 surplus outweighs the discounted 2028 shortfall.", "The cumulative was non-negative in the first year, so payback was set at 0, and the engine never looked again when the second capex year took it below zero.", "OKPOMA did recover within 2027, and the 2028 dip is new investment that payback is correctly designed to leave out."]'::jsonb and answer_index = 2 and explanation = 'Once the cumulative has crossed, the reading is not revisited, so a field that is still 2.2287 under water at the end of 2028 prints a payback of 0.0000.' then 'old'
           when prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and its payback reads 0.0000. What happened?' and options = '["OKPOMA found no crossing from negative to non-negative at all, and 0.0000 is what the engine returns for a project whose status reads not-recovered.", "Payback is computed on discounted flows, and the discounted 2027 surplus outweighs the discounted 2028 shortfall, so that column never turns negative.", "The cumulative was non-negative at index 0, so the first crossing is 0.0000, and paybackStatus recrossed with paybackLast 2.0385 records where it turns non-negative for good.", "OKPOMA did recover within 2027, and the 2028 dip is new investment that payback is correctly designed to leave out."]'::jsonb and answer_index = 2 and explanation = 'Payback is the FIRST crossing, so the second capex year cannot move it, and paybackLast is 2 + 2.2287 / 57.8806 = 2.0385. Before the 2026-09-15 repair the same 0.0000 came with no status and the dip left no trace in the metrics.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA''s cumulative is 9.2498 after 2027 and -2.2287 after 2028, and its payback reads 0.0000. What happened?', options = '["OKPOMA found no crossing from negative to non-negative at all, and 0.0000 is what the engine returns for a project whose status reads not-recovered.", "Payback is computed on discounted flows, and the discounted 2027 surplus outweighs the discounted 2028 shortfall, so that column never turns negative.", "The cumulative was non-negative at index 0, so the first crossing is 0.0000, and paybackStatus recrossed with paybackLast 2.0385 records where it turns non-negative for good.", "OKPOMA did recover within 2027, and the 2028 dip is new investment that payback is correctly designed to leave out."]'::jsonb, explanation = 'Payback is the FIRST crossing, so the second capex year cannot move it, and paybackLast is 2 + 2.2287 / 57.8806 = 2.0385. Before the 2026-09-15 repair the same 0.0000 came with no status and the dip left no trace in the metrics.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 11: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'NTEJE loses 123.9923 million USD, never pays back, and reports an IRR of 1000.0000 percent. What is that IRR?' and options = '["The Newton clamp reported as a rate, FINDINGS S1: NTEJE has no IRR to find, yet a sort by IRR would put it first.", "A true root lying beyond the clamp, the same situation as irr_beyond_clamp, where the engine reports 1000 for a root at 9900 percent.", "A real but extreme rate, because NTEJE''s early revenue is large against its capex and recovers the spend inside its first year.", "The engine''s return for net cash flows that never change sign, printed high so it cannot pass for a rate."]'::jsonb and answer_index = 0 and explanation = 'NTEJE''s NPV never reaches zero at any rate, so there is no root at all; irr_beyond_clamp is the different case of a real root at 9900 percent past the clamp. The no sign change return is 0.0000, not 1000.' then 'old'
           when prompt = 'NTEJE loses 123.9923 million USD and never pays back. What do its IRR and its payback report?' and options = '["irr null with irrStatus no-root and payback null with paybackStatus not-recovered, because no rate in the band zeroes its NPV and the cumulative never turns non-negative.", "irr 1000.0000 percent, the Newton clamp, beside a payback of 20.0000, the project life, which is how the engine reports a search that found nothing.", "irr -54.7919 percent with irrStatus ok beside a payback of null, since Newton lands on a real negative root whenever a ledger closes below zero.", "irr null with irrStatus no-sign-change beside a payback of 0.0000 with paybackStatus no-investment, since a ledger that only loses money never crosses."]'::jsonb and answer_index = 0 and explanation = 'NTEJE changes sign and still has no rate in the engine''s band that zeroes its NPV, which is what no-root names, and its cumulative closes at -154.5906. Before the 2026-09-15 repair it printed 1000.0000 percent, the Newton clamp recorded as FINDINGS S1, so a sort by IRR put it first.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'NTEJE loses 123.9923 million USD and never pays back. What do its IRR and its payback report?', options = '["irr null with irrStatus no-root and payback null with paybackStatus not-recovered, because no rate in the band zeroes its NPV and the cumulative never turns non-negative.", "irr 1000.0000 percent, the Newton clamp, beside a payback of 20.0000, the project life, which is how the engine reports a search that found nothing.", "irr -54.7919 percent with irrStatus ok beside a payback of null, since Newton lands on a real negative root whenever a ledger closes below zero.", "irr null with irrStatus no-sign-change beside a payback of 0.0000 with paybackStatus no-investment, since a ledger that only loses money never crosses."]'::jsonb, explanation = 'NTEJE changes sign and still has no rate in the engine''s band that zeroes its NPV, which is what no-root names, and its cumulative closes at -154.5906. Before the 2026-09-15 repair it printed 1000.0000 percent, the Newton clamp recorded as FINDINGS S1, so a sort by IRR put it first.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 12: option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Net cash flows of -100, 230 and -132 have roots at 10 and 20 percent. What does the engine report as the IRR?' and options = '["20.0000, the larger root, since the engine searches for the highest rate at which the NPV is zero.", "0.0000, the fixed return the engine uses when the flows change sign more than once and no single IRR exists.", "10.0000, the root Newton lands on from its 10 percent start, with nothing to say a second root exists.", "1000.0000, the clamp, because Newton oscillates between the two roots until the step runs away."]'::jsonb and answer_index = 2 and explanation = 'irr_two_roots returns 10.0000 while the golden lists roots at 10 and 20 percent, so the reported rate is one of two with no flag.' then 'old'
           when prompt = 'Net cash flows of -100, 230 and -132 have roots at 10 and 20 percent. What does the engine report as the IRR?' and options = '["20.0000 percent, the larger root, since the engine keeps searching upward and reports the highest rate at which the NPV is zero.", "10.0000 percent with irrStatus ok, the root Newton reaches from its 10 percent start, with the second root left out of the result entirely.", "irr null with irrStatus multiple-roots, and irrRoots listing 10.0000 and 20.0000 percent.", "irr null with irrStatus no-root, since two sign changes leave no rate to report."]'::jsonb and answer_index = 2 and explanation = 'Mid-year discounting scales every term by the same (1 + r)^-0.5, so both year-end roots survive and the engine hands back the pair. Before the 2026-09-15 repair it printed 10.0000, one of two rates with no flag beside it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Net cash flows of -100, 230 and -132 have roots at 10 and 20 percent. What does the engine report as the IRR?', options = '["20.0000 percent, the larger root, since the engine keeps searching upward and reports the highest rate at which the NPV is zero.", "10.0000 percent with irrStatus ok, the root Newton reaches from its 10 percent start, with the second root left out of the result entirely.", "irr null with irrStatus multiple-roots, and irrRoots listing 10.0000 and 20.0000 percent.", "irr null with irrStatus no-root, since two sign changes leave no rate to report."]'::jsonb, explanation = 'Mid-year discounting scales every term by the same (1 + r)^-0.5, so both year-end roots survive and the engine hands back the pair. Before the 2026-09-15 repair it printed 10.0000, one of two rates with no flag beside it.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 13: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Cash flows of order 1e-7 million USD have a true IRR of 21 percent, and the engine returns 10.0000. Why?' and options = '["The engine rounds any flow below its four decimal print to zero, sees no sign change and reports its default for that case.", "Newton converged on the second of two roots, which for flows this small sits at 10 percent instead of 21.", "Mid-year discounting shifts a 21 percent year-end root down to 10 percent once every flow is small enough.", "An absolute guard on the slope, |dNPV/dr| < 1e-5, fires on such tiny flows and hands back Newton''s 10 percent starting guess."]'::jsonb and answer_index = 3 and explanation = 'irr_tiny_cash_flows_derivative_guard is irr_known_21pct scaled down, and the guard fires on the first iteration, so 10.0000 is the start, not a root.' then 'old'
           when prompt = 'The published irr_known_21pct flows of -100 and +121 are scaled down to order 1e-7 million USD. What does the engine report for them?' and options = '["10.0000 percent, the starting guess, handed back after an absolute guard on the slope, |dNPV/dr| below 1e-5, fires on the first iteration.", "irr null with irrStatus no-sign-change, because flows that small round to zero at the four decimals the ledger prints and leave no crossing to find.", "irr null with irrStatus no-root, since a rate can be reported only where the cash flows are large enough for the search to measure a slope against them.", "21.0000 percent with irrStatus ok, the same root the unscaled case returns."]'::jsonb and answer_index = 3 and explanation = 'A root does not move with the size of the flows. Before the 2026-09-15 repair the derivative guard fired and the engine returned its 10 percent start, a disagreement recorded in FINDINGS-fiscal.md that the repair removed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published irr_known_21pct flows of -100 and +121 are scaled down to order 1e-7 million USD. What does the engine report for them?', options = '["10.0000 percent, the starting guess, handed back after an absolute guard on the slope, |dNPV/dr| below 1e-5, fires on the first iteration.", "irr null with irrStatus no-sign-change, because flows that small round to zero at the four decimals the ledger prints and leave no crossing to find.", "irr null with irrStatus no-root, since a rate can be reported only where the cash flows are large enough for the search to measure a slope against them.", "21.0000 percent with irrStatus ok, the same root the unscaled case returns."]'::jsonb, explanation = 'A root does not move with the size of the flows. Before the 2026-09-15 repair the derivative guard fired and the engine returned its 10 percent start, a disagreement recorded in FINDINGS-fiscal.md that the repair removed.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m04 ord 14: prompt, option_1, explanation
  select case
           when prompt = 'ISIALA''s High scenario prints a peak exposure, maxExposure, of 27.7707. How is it read?' and options = '["As the lowest cumulative of a project never under water, positive, so it needs no funding.", "As a funding requirement of 27.7707 million USD, the depth of the hole that 2029''s positive cash flow later repays.", "As the discounted trough, positive because mid-year factors shrink the capex rows more than the revenue rows.", "As the gap between High''s capex of 144.0000 and its first year revenue, which a larger revenue keeps above zero."]'::jsonb and answer_index = 0 and explanation = 'maxExposure is the minimum of the undiscounted cumulative, so dropping its sign turns a project that never needs cash into one that seems to need 27.7707.' then 'old'
           when prompt = 'ISIALA''s High scenario prints a peak exposure, maxExposure, of 25.0565. How is it read?' and options = '["As the lowest cumulative of a project never under water, positive, so it needs no funding.", "As a funding requirement of 25.0565 million USD, the depth of the hole that 2029''s positive cash flow later repays.", "As the discounted trough, positive because mid-year factors shrink the capex rows more than the revenue rows.", "As the gap between High''s capex of 144.0000 and its first year revenue, which a larger revenue keeps above zero."]'::jsonb and answer_index = 0 and explanation = 'maxExposure is the minimum of the undiscounted cumulative, so dropping its sign turns a project that never needs cash into one that seems to need 25.0565.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m04 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m04 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s High scenario prints a peak exposure, maxExposure, of 25.0565. How is it read?', options = '["As the lowest cumulative of a project never under water, positive, so it needs no funding.", "As a funding requirement of 25.0565 million USD, the depth of the hole that 2029''s positive cash flow later repays.", "As the discounted trough, positive because mid-year factors shrink the capex rows more than the revenue rows.", "As the gap between High''s capex of 144.0000 and its first year revenue, which a larger revenue keeps above zero."]'::jsonb, explanation = 'maxExposure is the minimum of the undiscounted cumulative, so dropping its sign turns a project that never needs cash into one that seems to need 25.0565.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-value-from-a-ledger' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m04 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 1: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On ISIALA the Production row of the sensitivity sweep prints -17.3893 and 175.8952, exactly the Oil Price row to four decimals. Why?' and options = '["The sweep treats revenue as a single input, and both labels point at the same revenue multiplier inside the engine.", "Production scales production.oil only, and variable opex is already stored in million USD a year from the base volume, so scaling volume moves revenue exactly as price does while that cost stays put.", "Production and price enter only as a product, and royalty and tax are flat rates on that product, so any field ties the two rows whatever its costs.", "The decline is scaled along with production, so volume lost in early years is offset exactly by volume kept in later years."]'::jsonb and answer_index = 1 and explanation = 'Variable opex of 20.8780 in 2027 was worked out at 13 USD per bbl on the base volume and does not follow a scaled volume, and the 10 year base case repeats the tie at 95.1220 to 850.0945.' then 'old'
           when prompt = 'On ISIALA the sensitivity sweep prints Production at 4.1176 and 156.4596 against Oil Price at -17.3893 and 175.8952. What separates the two rows?' and options = '["The sweep treats revenue as a single input, so both labels point at one multiplier inside the engine.", "Production scales production.oil AND opexVariable, so the barrels take their operating cost with them, while Oil Price scales price.oil alone.", "Production is swept over a narrower multiplier than price, so its two ends sit inside the price ends by the difference between the two ranges the sweep uses.", "The decline is scaled with production, so volume lost early is offset by volume kept later."]'::jsonb and answer_index = 1 and explanation = 'Variable opex of 20.8780 in 2027 follows the barrels, so at 0.7 the field keeps 4.1176 where the price bar still pays every barrel''s cost and reaches -17.3893. The published 10 year base case shows the same gap, Oil Price 95.1220 to 850.0945 against Production 129.6350 to 815.5814.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ISIALA the sensitivity sweep prints Production at 4.1176 and 156.4596 against Oil Price at -17.3893 and 175.8952. What separates the two rows?', options = '["The sweep treats revenue as a single input, so both labels point at one multiplier inside the engine.", "Production scales production.oil AND opexVariable, so the barrels take their operating cost with them, while Oil Price scales price.oil alone.", "Production is swept over a narrower multiplier than price, so its two ends sit inside the price ends by the difference between the two ranges the sweep uses.", "The decline is scaled with production, so volume lost early is offset by volume kept later."]'::jsonb, explanation = 'Variable opex of 20.8780 in 2027 follows the barrels, so at 0.7 the field keeps 4.1176 where the price bar still pays every barrel''s cost and reaches -17.3893. The published 10 year base case shows the same gap, Oil Price 95.1220 to 850.0945 against Production 129.6350 to 815.5814.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 2: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'How would a real 30 percent volume shortfall on ISIALA compare with the Production row''s printed -17.3893?' and options = '["It would cost exactly the printed amount, since price and volume are interchangeable in revenue and the sweep shows the two rows tied to four decimals.", "It would cost more than printed, because a lower volume raises fixed opex per barrel and the engine omits that unit cost.", "It would cost more than printed, since a shortfall compounds through the decline year on year and the sweep scales year one only.", "It would cost less than printed, because fewer barrels also means less variable opex, which the Production row holds at the base volume."]'::jsonb and answer_index = 3 and explanation = 'The row is an engine property read as physics: the sweep leaves variable opex at the base, so the true loss from lower volume is smaller than the gap from 81.0464 down to -17.3893.' then 'old'
           when prompt = 'A shortfall leaves ISIALA producing 0.7 of its barrels while the operating bill stays where it was. How does that compare with the Production row''s 4.1176?' and options = '["It costs exactly what the row shows, since the sweep scales the volume and every line the engine builds from it, which is what a shortfall does to a field.", "It costs less than the row shows, because fewer barrels also mean less variable opex, which the Production row holds at the base volume throughout.", "It costs less than the row shows, since a shortfall reaches the late years that discounting has already shrunk.", "It costs more than the row shows, because the row has already taken the variable opex of the missing barrels away with them."]'::jsonb and answer_index = 3 and explanation = 'The row values a smaller field, operating cost included: 4.1176 has part of the 20.8780 of first year variable opex removed with the barrels, so a shortfall that keeps the bill is worth less than that.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 2;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A shortfall leaves ISIALA producing 0.7 of its barrels while the operating bill stays where it was. How does that compare with the Production row''s 4.1176?', options = '["It costs exactly what the row shows, since the sweep scales the volume and every line the engine builds from it, which is what a shortfall does to a field.", "It costs less than the row shows, because fewer barrels also mean less variable opex, which the Production row holds at the base volume throughout.", "It costs less than the row shows, since a shortfall reaches the late years that discounting has already shrunk.", "It costs more than the row shows, because the row has already taken the variable opex of the missing barrels away with them."]'::jsonb, explanation = 'The row values a smaller field, operating cost included: 4.1176 has part of the 20.8780 of first year variable opex removed with the barrels, so a shortfall that keeps the bill is worth less than that.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 5: prompt, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s swings, high minus low, are 193.2845 for Oil Price and Production, -93.4835 for CAPEX and -8.6463 for OPEX. A tornado chart sorts on the signed number. What goes wrong?' and options = '["Nothing, because the sign only records direction and sorting on it gives the same order as sorting on width for every bar on the chart.", "CAPEX lands above Oil Price, since a negative swing is read as a loss and a tornado places losses at the top.", "Production drops to the bottom, because a tie on the signed number is broken by each input''s position in the table.", "OPEX lands above CAPEX, since -8.6463 is larger than -93.4835, when by width CAPEX belongs directly below the tied pair."]'::jsonb and answer_index = 3 and explanation = 'The sign records direction, raising capex or opex lowers NPV, so bars must be sorted by width: 193.2845, then 93.4835, then 8.6463.' then 'old'
           when prompt = 'ISIALA''s swings, high minus low, are 193.2845 for Oil Price, 152.3420 for Production, -93.4835 for CAPEX and -8.6463 for OPEX. A tornado chart sorts on the signed number. What goes wrong?' and options = '["Nothing, because the sign only records direction and sorting on it gives the same order as sorting on width for every bar on the chart.", "CAPEX lands above Oil Price, since a negative swing is read as a loss and a tornado places the losses at the top of the chart.", "Production drops to the bottom, because its swing of 152.3420 is measured against a different base from the other three rows.", "OPEX lands above CAPEX, since -8.6463 is larger than -93.4835, when by width CAPEX belongs directly below Production."]'::jsonb and answer_index = 3 and explanation = 'The sign records direction, raising capex or opex lowers NPV, so bars must be sorted by width: 193.2845, then 152.3420, then 93.4835, then 8.6463.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s swings, high minus low, are 193.2845 for Oil Price, 152.3420 for Production, -93.4835 for CAPEX and -8.6463 for OPEX. A tornado chart sorts on the signed number. What goes wrong?', options = '["Nothing, because the sign only records direction and sorting on it gives the same order as sorting on width for every bar on the chart.", "CAPEX lands above Oil Price, since a negative swing is read as a loss and a tornado places the losses at the top of the chart.", "Production drops to the bottom, because its swing of 152.3420 is measured against a different base from the other three rows.", "OPEX lands above CAPEX, since -8.6463 is larger than -93.4835, when by width CAPEX belongs directly below Production."]'::jsonb, explanation = 'The sign records direction, raising capex or opex lowers NPV, so bars must be sorted by width: 193.2845, then 152.3420, then 93.4835, then 8.6463.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 9: option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'How does generateScenarios build ISIALA''s Low case?' and options = '["Every sensitivity input at its 0.7 end at once, the same multiplier the sweep uses for one input at a time.", "Price and production times 0.8 and total opex times 1.2, so variable opex rises with the fixed part in the same run.", "Price at its 10th percentile and capex at its 90th percentile, drawn from each input''s stated belief by the scenario generator, with every other input held at its median.", "Price and production times 0.8, capex and fixed opex times 1.2, with royalty, tax, the discount rate, the decline and variable opex left at the base."]'::jsonb and answer_index = 3 and explanation = 'The scenarios never scale variable opex and draw from no belief at all, so Low is four fixed multipliers giving -72.1531.' then 'old'
           when prompt = 'How does generateScenarios build ISIALA''s Low case?' and options = '["Every sensitivity input at its 0.7 end at once, the same multiplier the sweep uses for one input at a time.", "Price and production times 0.8 and the whole opex column times 1.2, so the variable half rises with the fixed part in the same run.", "Price at its 10th percentile and capex at its 90th percentile, drawn from each input''s stated belief by the scenario generator, with every other input held at its median.", "Price, production and the variable opex those barrels carry times 0.8, capex and fixed opex times 1.2, with royalty, tax, the discount rate and the decline left at the base."]'::jsonb and answer_index = 3 and explanation = 'The scenarios draw from no belief at all, so Low is five fixed multipliers giving -57.8151, and its totalOpex of 188.3910 falls below the Base because the variable half follows the barrels.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'How does generateScenarios build ISIALA''s Low case?', options = '["Every sensitivity input at its 0.7 end at once, the same multiplier the sweep uses for one input at a time.", "Price and production times 0.8 and the whole opex column times 1.2, so the variable half rises with the fixed part in the same run.", "Price at its 10th percentile and capex at its 90th percentile, drawn from each input''s stated belief by the scenario generator, with every other input held at its median.", "Price, production and the variable opex those barrels carry times 0.8, capex and fixed opex times 1.2, with royalty, tax, the discount rate and the decline left at the base."]'::jsonb, explanation = 'The scenarios draw from no belief at all, so Low is five fixed multipliers giving -57.8151, and its totalOpex of 188.3910 falls below the Base because the variable half follows the barrels.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 11: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s High scenario prints an IRR of 0.0000 and a payback of 0.0000 beside the best NPV of the three, 237.8860. What are those two numbers?' and options = '["Signs that High earns no return above its cost, and that the engine could not find a year in which it recovers.", "A real root at zero, because High''s scaled-down capex is recovered at exactly the rate at which the NPV vanishes.", "Fixed returns for a ledger that never goes negative: its lowest cumulative is 27.7707, so payback is immediate and, with no sign change, there is no IRR to find.", "The Newton clamp''s floor, the counterpart of the 1000 percent ceiling, reported when the rate runs below zero."]'::jsonb and answer_index = 2 and explanation = 'Sorted by IRR, High ranks below Base, 0.0000 against 53.7148, which is a statement about the engine''s fixed return and not about High.' then 'old'
           when prompt = 'ISIALA''s High scenario prints irr null with irrStatus no-sign-change and payback 0.0000 with paybackStatus no-investment beside the best NPV of the three, 226.0140. What do those two say?' and options = '["Signs that High earns no return above its cost of capital, and that the engine could not find a year in which it recovers its 144.0000 of capex.", "A real root at zero, because High''s scaled-down capex is recovered at exactly the rate at which the NPV vanishes, which the status then records.", "Its ledger never goes negative: the lowest cumulative is 25.0565, so nothing was at risk to recover and no rate can zero a flow that never changes sign.", "The floor of Newton''s search, the counterpart of a ceiling at 1000 percent, reported whenever the rate the solver reaches runs below zero."]'::jsonb and answer_index = 2 and explanation = 'A status is not a rate, so High cannot be ranked by IRR at all while Base reports 53.7148 percent with irrStatus ok. Before the 2026-09-15 repair High printed 0.0000 for both, two plain numbers for two different situations.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s High scenario prints irr null with irrStatus no-sign-change and payback 0.0000 with paybackStatus no-investment beside the best NPV of the three, 226.0140. What do those two say?', options = '["Signs that High earns no return above its cost of capital, and that the engine could not find a year in which it recovers its 144.0000 of capex.", "A real root at zero, because High''s scaled-down capex is recovered at exactly the rate at which the NPV vanishes, which the status then records.", "Its ledger never goes negative: the lowest cumulative is 25.0565, so nothing was at risk to recover and no rate can zero a flow that never changes sign.", "The floor of Newton''s search, the counterpart of a ceiling at 1000 percent, reported whenever the rate the solver reaches runs below zero."]'::jsonb, explanation = 'A status is not a rate, so High cannot be ranked by IRR at all while Base reports 53.7148 percent with irrStatus ok. Before the 2026-09-15 repair High printed 0.0000 for both, two plain numbers for two different situations.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario reports a payback of 20.0000 years and an IRR of -3.5758 percent. Which is a flag and which is a value?' and options = '["The payback is the flag, the project life meaning never; the IRR is a real negative root.", "Both are flags, since the engine never reports a negative IRR and uses the project life as its default payback for every case.", "The IRR is the flag, a clamp at the bottom of Newton''s search for a root, while the payback is a real recovery in 2046.", "Both are values: Low recovers in its twentieth year and earns a small negative return on the way there."]'::jsonb and answer_index = 0 and explanation = 'With no economic limit Low still produces and charges all twenty years, and its payback of 20.0000 equals the life, while -3.5758 is a root the engine can print.' then 'old'
           when prompt = 'ISIALA''s Low scenario reports payback null with paybackStatus not-recovered and an IRR of -0.6992 percent with irrStatus ok. Which of the two is a measurement?' and options = '["The IRR: -0.6992 is a real negative root, while the payback is the engine saying the cumulative never turned non-negative.", "Neither, since the engine returns null for payback and a negative rate for the IRR whenever a scenario''s NPV comes out below zero.", "The payback, since null stands for the twenty year life written another way, and a rate below zero is the floor the solver reports when it finds no root.", "Both, because Low recovers in its twentieth year and earns a small negative return on the way there, which is what the two statuses record."]'::jsonb and answer_index = 0 and explanation = 'With no economic limit Low still produces and charges all twenty years and its cumulative never crosses. Before the 2026-09-15 repair the same case read a payback of 20.0000, its own life, beside an IRR of -3.5758 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario reports payback null with paybackStatus not-recovered and an IRR of -0.6992 percent with irrStatus ok. Which of the two is a measurement?', options = '["The IRR: -0.6992 is a real negative root, while the payback is the engine saying the cumulative never turned non-negative.", "Neither, since the engine returns null for payback and a negative rate for the IRR whenever a scenario''s NPV comes out below zero.", "The payback, since null stands for the twenty year life written another way, and a rate below zero is the floor the solver reports when it finds no root.", "Both, because Low recovers in its twentieth year and earns a small negative return on the way there, which is what the two statuses record."]'::jsonb, explanation = 'With no economic limit Low still produces and charges all twenty years and its cumulative never crosses. Before the 2026-09-15 repair the same case read a payback of 20.0000, its own life, beside an IRR of -3.5758 percent.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 13: prompt, option_0, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario is -72.1531, and the Scenario Builder''s Monte Carlo Low case P90 is 48.7439. Why are they so far apart?' and options = '["The Monte Carlo also samples opex, and cheaper opex draws lift most of its NPVs well above the scenario.", "The scenario multiplies by 0.8 while the sample''s plus or minus 20 percent reaches only 0.9 of the base on a typical draw.", "The sample''s lowest NPV, 16.3054, is its P90, so the scenario sits below it only because 1000 iterations is small.", "The scenario forces price, production, capex and fixed opex bad at once, while the sample draws price, capex and reserves independently each year, so a bad draw is usually offset."]'::jsonb and answer_index = 3 and explanation = 'The Monte Carlo never samples opex and draws every year separately, and -72.1531 sits below even the lowest of the 1000 sampled NPVs, 16.3054; calling that lowest value P90 is the misuse, since P90 is the Low case at 48.7439.' then 'old'
           when prompt = 'ISIALA''s Low scenario is -57.8151, and the Scenario Builder''s Monte Carlo Low case P90 is 15.6063. Why are they so far apart?' and options = '["The Monte Carlo also samples opex, and cheaper opex draws lift most of its NPVs well above the scenario''s corner.", "The scenario multiplies by 0.8 while the sample''s plus or minus 20 percent reaches only 0.9 of the base on a typical draw.", "The sample''s lowest NPV, -46.1564, is its Low case P90, so the scenario sits below it only because 1000 iterations is a small sample.", "The scenario forces price, production, capex and fixed opex bad at once, while the sample draws one factor per variable an iteration, so a bad capex draw usually meets an ordinary price draw."]'::jsonb and answer_index = 3 and explanation = 'Opex is never sampled, and -57.8151 sits below even the lowest of the 1000 sampled NPVs, -46.1564; calling that lowest value the Low case P90 is the misuse, since the Low case P90 is 15.6063, the 10th percentile key of the sample.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario is -57.8151, and the Scenario Builder''s Monte Carlo Low case P90 is 15.6063. Why are they so far apart?', options = '["The Monte Carlo also samples opex, and cheaper opex draws lift most of its NPVs well above the scenario''s corner.", "The scenario multiplies by 0.8 while the sample''s plus or minus 20 percent reaches only 0.9 of the base on a typical draw.", "The sample''s lowest NPV, -46.1564, is its Low case P90, so the scenario sits below it only because 1000 iterations is a small sample.", "The scenario forces price, production, capex and fixed opex bad at once, while the sample draws one factor per variable an iteration, so a bad capex draw usually meets an ordinary price draw."]'::jsonb, explanation = 'Opex is never sampled, and -57.8151 sits below even the lowest of the 1000 sampled NPVs, -46.1564; calling that lowest value the Low case P90 is the misuse, since the Low case P90 is 15.6063, the 10th percentile key of the sample.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 14: prompt, option_0, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A slide labels ISIALA''s scenario NPVs -72.1531, 81.0464 and 237.8860 as P90, P50 and P10. What is wrong with it?' and options = '["The order, because under the exceedance meaning P10 is the low case, so -72.1531 should carry the label P10 and 237.8860 the label P90.", "No probability was ever computed for a scenario, so -72.1531 is not a value ISIALA meets or exceeds nine times in ten.", "Nothing, since Low, Base and High are simply the conventional names for P90, P50 and P10 on any NPV table a screening study prints.", "Only the middle label, since Base is a single run while the outer cases are corners and therefore percentiles."]'::jsonb and answer_index = 1 and explanation = 'A label needs a definition behind it: P90 on an NPV means a 90 percent probability of meeting or exceeding it, and swapping P10 onto the low case is the reversed-label mistake, not a fix.' then 'old'
           when prompt = 'A slide labels ISIALA''s scenario NPVs -57.8151, 81.0464 and 226.0140 as P90, P50 and P10. What is wrong with it?' and options = '["The order, because under the exceedance meaning P10 is the low case, so -57.8151 should carry the label P10 and 226.0140 the label P90.", "No probability was ever computed for a scenario, so -57.8151 is not a value ISIALA meets or exceeds nine times in ten.", "Nothing, since Low, Base and High are simply the conventional names for P90, P50 and P10 on any NPV table a screening study prints.", "Only the middle label, since Base is a single run while the outer cases are corners and therefore percentiles."]'::jsonb and answer_index = 1 and explanation = 'A label needs a definition behind it: P90 on an NPV means a 90 percent probability of meeting or exceeding it, and swapping P10 onto the low case is the reversed-label mistake, not a fix.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A slide labels ISIALA''s scenario NPVs -57.8151, 81.0464 and 226.0140 as P90, P50 and P10. What is wrong with it?', options = '["The order, because under the exceedance meaning P10 is the low case, so -57.8151 should carry the label P10 and 226.0140 the label P90.", "No probability was ever computed for a scenario, so -57.8151 is not a value ISIALA meets or exceeds nine times in ten.", "Nothing, since Low, Base and High are simply the conventional names for P90, P50 and P10 on any NPV table a screening study prints.", "Only the middle label, since Base is a single run while the outer cases are corners and therefore percentiles."]'::jsonb, explanation = 'A label needs a definition behind it: P90 on an NPV means a 90 percent probability of meeting or exceeding it, and swapping P10 onto the low case is the reversed-label mistake, not a fix.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m05 ord 15: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Scenario Builder''s results panel once printed 109.8980 under "P90 (Conservative)". What was wrong with that card?' and options = '["Nothing: 109.8980 is the High case P10, and the conservative card was meant to show how much upside the project keeps.", "It showed a scenario rather than a sample, since 109.8980 is the High scenario that generateScenarios returns.", "It held the p90 key, the larger number, when under the exceedance meaning the P90 Low case is 48.7439.", "It showed the mean of the 1000 NPVs, which the panel had mislabelled as a percentile because the two sit close together."]'::jsonb and answer_index = 2 and explanation = 'The engine key p90 is a plain 90th percentile of the sample, so reading it aloud as P90 put the larger of 48.7439 and 109.8980 on the card called conservative.' then 'old'
           when prompt = 'The Scenario Builder''s results panel once printed 152.0653 under "P90 (Conservative)". What was wrong with that card?' and options = '["Nothing: 152.0653 is the High case P10, and the conservative card was meant to show how much upside the project keeps.", "It showed a scenario rather than a sample, since the High scenario that generateScenarios returns is the figure the panel meant to carry.", "It held the p90 key, the larger number, when under the exceedance meaning the P90 Low case is 15.6063.", "It showed the mean of the 1000 NPVs, which the panel had mislabelled as a percentile because the emv and the card sit close together."]'::jsonb and answer_index = 2 and explanation = 'The engine key p90 is a plain 90th percentile of the sample, so reading it aloud as P90 put the larger of 15.6063 and 152.0653 on the card called conservative.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m05 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m05 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Scenario Builder''s results panel once printed 152.0653 under "P90 (Conservative)". What was wrong with that card?', options = '["Nothing: 152.0653 is the High case P10, and the conservative card was meant to show how much upside the project keeps.", "It showed a scenario rather than a sample, since the High scenario that generateScenarios returns is the figure the panel meant to carry.", "It held the p90 key, the larger number, when under the exceedance meaning the P90 Low case is 15.6063.", "It showed the mean of the 1000 NPVs, which the panel had mislabelled as a percentile because the emv and the card sit close together."]'::jsonb, explanation = 'The engine key p90 is a plain 90th percentile of the sample, so reading it aloud as P90 put the larger of 15.6063 and 152.0653 on the card called conservative.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-one-number-becomes-three' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m05 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m06 ord 4: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Reading ISIALA''s value metrics against their flags, which engine values should send a reader back to the net cash flow column?' and options = '["A negative NPV, an IRR below the 12 percent discount rate, and any payback beyond ISIALA''s 3.2746 years.", "An IRR of 0, 10 or 1000, a payback equal to the life, and a payback of 0.", "Any IRR above ISIALA''s own 53.7148 percent, since Newton''s clamp is what stops a sound screening case reporting a higher rate.", "A negative peak exposure, since the engine prints the trough as a positive size whenever a project is sound."]'::jsonb and answer_index = 1 and explanation = 'Those values are fixed returns that print like readings: a payback of 20.0000 means never, and ISIALA''s 53.7148 is trusted only after the net cash flow is seen to change sign.' then 'old'
           when prompt = 'Reading ISIALA''s value metrics, which engine outputs have to be read with the status printed beside them?' and options = '["A negative NPV, an IRR below the 12 percent discount rate, and any payback beyond ISIALA''s 3.2746 years, since each of those falls short of the case''s own hurdle.", "A null IRR, a null payback and a payback of 0.0000, each of which names a situation rather than measuring one.", "Any IRR above ISIALA''s own 53.7148 percent, since a screening case reporting a higher rate has run past the band in which the search looks for a root.", "A negative peak exposure, since the engine prints the trough as a positive size whenever a project is sound and a sign change there marks a ledger to re-read."]'::jsonb and answer_index = 1 and explanation = 'payback null says not-recovered, payback 0.0000 says no-investment or recrossed, and irr null names no-sign-change, no-root, above-clamp or multiple-roots; ISIALA''s own 53.7148 percent carries irrStatus ok.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 4;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m06 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m06 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Reading ISIALA''s value metrics, which engine outputs have to be read with the status printed beside them?', options = '["A negative NPV, an IRR below the 12 percent discount rate, and any payback beyond ISIALA''s 3.2746 years, since each of those falls short of the case''s own hurdle.", "A null IRR, a null payback and a payback of 0.0000, each of which names a situation rather than measuring one.", "Any IRR above ISIALA''s own 53.7148 percent, since a screening case reporting a higher rate has run past the band in which the search looks for a root.", "A negative peak exposure, since the engine prints the trough as a positive size whenever a project is sound and a sign change there marks a ledger to re-read."]'::jsonb, explanation = 'payback null says not-recovered, payback 0.0000 says no-investment or recrossed, and irr null names no-sign-change, no-root, above-clamp or multiple-roots; ISIALA''s own 53.7148 percent carries irrStatus ok.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m06 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m06 ord 8: option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why does the capstone method refuse to read ISIALA''s metrics straight off the summary card?' and options = '["The card rounds to two decimals, so a payback of 3.2746 read from it lands in the wrong year.", "The card discounts at year end, so it disagrees with the ledger by 1.058301.", "The card shows the High scenario, whose IRR of 0.0000 is not the base case.", "Every number there is true to the engine, yet payback and IRR can be fixed returns."]'::jsonb and answer_index = 3 and explanation = 'Nothing on the card is wrong to the engine; the danger is a payback of 20.0000 or an IRR of 0.0000 that print like readings, so each is checked against its flag.' then 'old'
           when prompt = 'Why does the capstone method refuse to read ISIALA''s metrics straight off the summary card?' and options = '["The card rounds to two decimals, so a payback of 3.2746 read from it lands in the wrong year.", "The card discounts at year end, so it disagrees with the ledger by 1.058301.", "The card shows the High scenario, whose IRR is null with irrStatus no-sign-change and never was a rate at all.", "Every number there is true to the engine, yet payback and IRR can be a status rather than a measurement."]'::jsonb and answer_index = 3 and explanation = 'Nothing on the card is wrong to the engine; the danger is a payback of 0.0000 or a null IRR that print like readings, so each is checked against the status beside it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m06 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m06 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does the capstone method refuse to read ISIALA''s metrics straight off the summary card?', options = '["The card rounds to two decimals, so a payback of 3.2746 read from it lands in the wrong year.", "The card discounts at year end, so it disagrees with the ledger by 1.058301.", "The card shows the High scenario, whose IRR is null with irrStatus no-sign-change and never was a rate at all.", "Every number there is true to the engine, yet payback and IRR can be a status rather than a measurement."]'::jsonb, explanation = 'Nothing on the card is wrong to the engine; the danger is a payback of 0.0000 or a null IRR that print like readings, so each is checked against the status beside it.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m06 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m06 ord 9: explanation
  select case
           when prompt = 'Which limit does the capstone method state about its own checks on ISIALA?' and options = '["It proves two rows and trusts eighteen, and it cannot say whether the price or the decline is right.", "It proves every one of the twenty rows, so a case that passes its checks is right in price and decline too.", "It checks the value metrics and the range but never proves a ledger row.", "It attaches a probability to Low and High from the rows it has checked."]'::jsonb and answer_index = 0 and explanation = 'The method proves the 2027 and 2029 rows, -17.8210 and 35.9654, and attaches no probability to the range from -72.1531 to 237.8860.' then 'old'
           when prompt = 'Which limit does the capstone method state about its own checks on ISIALA?' and options = '["It proves two rows and trusts eighteen, and it cannot say whether the price or the decline is right.", "It proves every one of the twenty rows, so a case that passes its checks is right in price and decline too.", "It checks the value metrics and the range but never proves a ledger row.", "It attaches a probability to Low and High from the rows it has checked."]'::jsonb and answer_index = 0 and explanation = 'The method proves the 2027 and 2029 rows, -17.8210 and 35.9654, and attaches no probability to the range from -57.8151 to 226.0140.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m06 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m06 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which limit does the capstone method state about its own checks on ISIALA?', options = '["It proves two rows and trusts eighteen, and it cannot say whether the price or the decline is right.", "It proves every one of the twenty rows, so a case that passes its checks is right in price and decline too.", "It checks the value metrics and the range but never proves a ledger row.", "It attaches a probability to Low and High from the rows it has checked."]'::jsonb, explanation = 'The method proves the 2027 and 2029 rows, -17.8210 and 35.9654, and attaches no probability to the range from -57.8151 to 226.0140.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m06 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m06 ord 14: option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Through the Scenario Builder''s Monte Carlo on ISIALA, which NPV takes the label P90?' and options = '["109.8980, the High case stored under the engine key p90, which the old panel printed as conservative.", "48.7439, the Low case, stored under the engine key p10.", "81.1835, the Best case, since P90 names the value nearest the outcome expected nine times in ten.", "-72.1531, the Low scenario, since P90 marks the low end of the range and the scenario is its lowest corner."]'::jsonb and answer_index = 1 and explanation = 'Under the exceedance meaning P90 is the value met or exceeded with 90 percent probability, the Low case 48.7439; the panel that shipped before the fix printed 109.8980 under "P90 (Conservative)".' then 'old'
           when prompt = 'Through the Scenario Builder''s Monte Carlo on ISIALA, which NPV takes the label P90?' and options = '["152.0653, the High case stored under the engine key p90, which the old panel printed as conservative.", "15.6063, the Low case, stored under the engine key p10.", "78.5315, the Best case, since P90 names the value nearest the outcome expected nine times in ten.", "-57.8151, the Low scenario, since P90 marks the low end of the range and the scenario is its lowest corner."]'::jsonb and answer_index = 1 and explanation = 'Under the exceedance meaning P90 is the value met or exceeded with 90 percent probability, the Low case 15.6063; the panel that shipped before the fix printed 152.0653 under "P90 (Conservative)".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m06 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m06 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Through the Scenario Builder''s Monte Carlo on ISIALA, which NPV takes the label P90?', options = '["152.0653, the High case stored under the engine key p90, which the old panel printed as conservative.", "15.6063, the Low case, stored under the engine key p10.", "78.5315, the Best case, since P90 names the value nearest the outcome expected nine times in ten.", "-57.8151, the Low scenario, since P90 marks the low end of the range and the scenario is its lowest corner."]'::jsonb, explanation = 'Under the exceedance meaning P90 is the value met or exceeded with 90 percent probability, the Low case 15.6063; the panel that shipped before the fix printed 152.0653 under "P90 (Conservative)".'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m06 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_m06 ord 15: prompt, explanation
  select case
           when prompt = 'The Associate reading ends with ISIALA worth -72.1531 to 237.8860 million USD. What can this tier not tell you about that range?' and options = '["How likely any of it is: the sweep and the scenarios say what happens if inputs move, never how often.", "Whether ISIALA has value at the base, since 81.0464 is itself a sampled median.", "Where the ends come from, since the scenario multipliers are drawn at random.", "Anything beyond even odds, since Low and High are mirror multipliers and so are built to be equally likely."]'::jsonb and answer_index = 0 and explanation = 'The sweep''s -17.3893 at 0.7 of price and the Low scenario''s -72.1531 are what-if runs with no probability, and the base 81.0464 is one deterministic run.' then 'old'
           when prompt = 'The Associate reading ends with ISIALA worth -57.8151 to 226.0140 million USD. What can this tier not tell you about that range?' and options = '["How likely any of it is: the sweep and the scenarios say what happens if inputs move, never how often.", "Whether ISIALA has value at the base, since 81.0464 is itself a sampled median.", "Where the ends come from, since the scenario multipliers are drawn at random.", "Anything beyond even odds, since Low and High are mirror multipliers and so are built to be equally likely."]'::jsonb and answer_index = 0 and explanation = 'The sweep''s -17.3893 at 0.7 of price and the Low scenario''s -57.8151 are what-if runs with no probability, and the base 81.0464 is one deterministic run.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_m06 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_m06 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Associate reading ends with ISIALA worth -57.8151 to 226.0140 million USD. What can this tier not tell you about that range?', options = '["How likely any of it is: the sweep and the scenarios say what happens if inputs move, never how often.", "Whether ISIALA has value at the base, since 81.0464 is itself a sampled median.", "Where the ends come from, since the scenario multipliers are drawn at random.", "Anything beyond even odds, since Low and High are mirror multipliers and so are built to be equally likely."]'::jsonb, explanation = 'The sweep''s -17.3893 at 0.7 of price and the Low scenario''s -57.8151 are what-if runs with no probability, and the base 81.0464 is one deterministic run.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_m06 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 1: option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s screening NPV is 81.0464 million USD. A manager reads it as what the project will probably earn. What is it?' and options = '["The Best case P50, because a screening engine runs each input at its median and the median NPV follows from the median inputs.", "The emv, because mid-year discounting averages each year''s cash through the year and so returns the expected value of the ledger.", "The value at the inputs that were typed; ISIALA''s emv of 80.1707 and Best case P50 of 81.1835 happen to land close, and nothing in the engine promises that on the next field.", "A Low case P90, because a deterministic case is built from conservative inputs that the outcome meets or exceeds nine times in ten."]'::jsonb and answer_index = 2 and explanation = 'The quick inputs carry no range, so 81.0464 carries no probability; the sampled run over 1000 iterations at seed 20260829 is what supplies the emv of 80.1707.' then 'old'
           when prompt = 'ISIALA''s screening NPV is 81.0464 million USD. A manager reads it as what the project will probably earn. What is it?' and options = '["The Best case P50, because a screening engine runs each input at its median and the median NPV follows from the median inputs.", "The emv, because mid-year discounting averages each year''s cash through the year and so returns the expected value of the ledger.", "The value at the inputs that were typed; ISIALA''s emv of 80.9836 and Best case P50 of 78.5315 happen to land close, and nothing in the engine promises that on the next field.", "A Low case P90, because a deterministic case is built from conservative inputs that the outcome meets or exceeds nine times in ten."]'::jsonb and answer_index = 2 and explanation = 'The quick inputs carry no range, so 81.0464 carries no probability; the sampled run over 1000 iterations at seed 20260829 is what supplies the emv of 80.9836.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 1'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s screening NPV is 81.0464 million USD. A manager reads it as what the project will probably earn. What is it?', options = '["The Best case P50, because a screening engine runs each input at its median and the median NPV follows from the median inputs.", "The emv, because mid-year discounting averages each year''s cash through the year and so returns the expected value of the ledger.", "The value at the inputs that were typed; ISIALA''s emv of 80.9836 and Best case P50 of 78.5315 happen to land close, and nothing in the engine promises that on the next field.", "A Low case P90, because a deterministic case is built from conservative inputs that the outcome meets or exceeds nine times in ten."]'::jsonb, explanation = 'The quick inputs carry no range, so 81.0464 carries no probability; the sampled run over 1000 iterations at seed 20260829 is what supplies the emv of 80.9836.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 3: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA''s 2046 row has gross revenue of 4.4603, opex of 4.5718 and a net cash flow of -0.5576. What does its NPV of 167.4389 million USD include?' and options = '["Only the years to 2045, because the engine stops a field once opex first exceeds gross revenue and prints the last row for information only.", "All twenty years with 2046 at zero, because tax cannot go negative and the engine lets the tax line absorb a small operating loss.", "The years worth producing, with 2046 replaced by the abandonment cost that the quick form books in the final year of its life.", "All twenty years, 2046 among them, because the engine has no economic limit."]'::jsonb and answer_index = 3 and explanation = 'The -0.5576 is discounted and subtracted like any other row; a real operator would shut the field in, and the quick form books no abandonment cost at all.' then 'old'
           when prompt = 'ISIALA''s twentieth year earns a net cash flow of 2.6534 million USD and OKPOMA''s loses 0.5576. What does the screening engine do differently for the two fields in 2046?' and options = '["It shuts OKPOMA in after 2045 and runs ISIALA to the end, because the economic limit is tested on each field''s own opex against its own gross revenue.", "It floors OKPOMA''s 2046 at zero and leaves ISIALA''s 2.6534 alone, since one losing year cannot be allowed to reduce an NPV that is positive over the life.", "It books an abandonment charge in OKPOMA''s final year and none in ISIALA''s, which is what turns that one row negative while ISIALA''s still pays.", "Nothing: it produces and charges all twenty rows of both, so 2.6534 sits inside ISIALA''s 81.0464 and -0.5576 inside OKPOMA''s 167.4389."]'::jsonb and answer_index = 3 and explanation = 'The engine has no economic limit, so a year that loses money is produced and charged like any other. ISIALA still lifts 141552.0984 bbl in 2046, and OKPOMA''s opex of 4.5718 against gross revenue of 4.4603 stays in the ledger; the quick form books no abandonment cost at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s twentieth year earns a net cash flow of 2.6534 million USD and OKPOMA''s loses 0.5576. What does the screening engine do differently for the two fields in 2046?', options = '["It shuts OKPOMA in after 2045 and runs ISIALA to the end, because the economic limit is tested on each field''s own opex against its own gross revenue.", "It floors OKPOMA''s 2046 at zero and leaves ISIALA''s 2.6534 alone, since one losing year cannot be allowed to reduce an NPV that is positive over the life.", "It books an abandonment charge in OKPOMA''s final year and none in ISIALA''s, which is what turns that one row negative while ISIALA''s still pays.", "Nothing: it produces and charges all twenty rows of both, so 2.6534 sits inside ISIALA''s 81.0464 and -0.5576 inside OKPOMA''s 167.4389."]'::jsonb, explanation = 'The engine has no economic limit, so a year that loses money is produced and charged like any other. ISIALA still lifts 141552.0984 bbl in 2046, and OKPOMA''s opex of 4.5718 against gross revenue of 4.4603 stays in the ledger; the quick form books no abandonment cost at all.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 6: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reader applies ISIALA''s 12 percent decline before booking the first year. What do they write for 2027, and what follows?' and options = '["1606000.0000 bbl, the same as the engine, because the quick form rewrites year 1 as the undeclined daily rate over a year whatever the reader does.", "1243686.4000 bbl, because a decline taken before the first year compounds twice by the end of 2027 under the engine''s year on year rule.", "1606000.0000 bbl less a fixed tenth of barrels, which the reader subtracts again every year until the profile runs dry inside the life.", "1413280.0000 bbl, the engine''s 2028, so every row slides a year early and revenue falls in every column."]'::jsonb and answer_index = 3 and explanation = 'The engine books 4400 bopd over a whole year as 1606000.0000 bbl with no decline taken, and the first ratio of 0.880000 appears in 2028; the NPV then falls for a reason unrelated to the field.' then 'old'
           when prompt = 'ISIALA''s 2046 ledger opex of 4.3402 million USD is almost half that year''s gross revenue of 9.9086, where in 2027 opex of 23.3780 was about a fifth of 112.4200. What made the late years thin?' and options = '["Royalty rises as a share of revenue late in the life, because the 15 percent rate is charged on a base that no longer carries the capex the early years absorbed.", "Fixed opex escalates over the life while revenue declines, so the two lines move apart year on year.", "The tax of 1.4288 in 2046 is charged before opex rather than after it, which leaves a smaller revenue to carry the same operating cost.", "Variable opex fell with the barrels from 20.8780 to 1.8402 while fixed opex stayed at 2.5000, so the flat half grew as a share of a shrinking revenue."]'::jsonb and answer_index = 3 and explanation = 'Fixed opex is 2.5000 in every row and the variable half is oil volume times 13 USD per bbl over 1e6, so only the variable half declines. In 2027 the variable 20.8780 is most of the column, and by 2046 the fixed 2.5000 is larger than the variable 1.8402.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s 2046 ledger opex of 4.3402 million USD is almost half that year''s gross revenue of 9.9086, where in 2027 opex of 23.3780 was about a fifth of 112.4200. What made the late years thin?', options = '["Royalty rises as a share of revenue late in the life, because the 15 percent rate is charged on a base that no longer carries the capex the early years absorbed.", "Fixed opex escalates over the life while revenue declines, so the two lines move apart year on year.", "The tax of 1.4288 in 2046 is charged before opex rather than after it, which leaves a smaller revenue to carry the same operating cost.", "Variable opex fell with the barrels from 20.8780 to 1.8402 while fixed opex stayed at 2.5000, so the flat half grew as a share of a shrinking revenue."]'::jsonb, explanation = 'Fixed opex is 2.5000 in every row and the variable half is oil volume times 13 USD per bbl over 1e6, so only the variable half declines. In 2027 the variable 20.8780 is most of the column, and by 2046 the fixed 2.5000 is larger than the variable 1.8402.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 9: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A tornado for ISIALA draws two bars of exactly equal width, one labelled Production and one Oil Price. What in the expanded case makes them tie?' and options = '["Every cost in the ledger is a fixed share of revenue, so any lever that moves revenue by the same factor must move the NPV by the same amount.", "The engine models variable opex following the barrels, and a price cut shrinks margin per barrel by exactly what fewer barrels shrink it.", "The tornado display merges two bars that differ only past the fourth decimal, so the tie is a rounding of two slightly different sensitivities to revenue.", "Variable opex is stored as millions a year from the base volume, so scaling production moves revenue exactly as price does and the cost stays put."]'::jsonb and answer_index = 3 and explanation = 'In a real field fewer barrels means less variable opex, so the true loss from a volume shortfall is smaller than the -17.3893 printed; the tie counts one lever twice.' then 'old'
           when prompt = 'A tornado for ISIALA draws the Production bar narrower than the Oil Price bar, 152.3420 against 193.2845. What in the expanded case makes the difference?' and options = '["Every cost in the ledger is a fixed share of revenue, so any lever that moves revenue moves the NPV with it and the narrower bar is only the one the chart rounds.", "Royalty is charged on barrels while a price change is taxed on revenue, so the state takes a different share out of each of the two levers before it reaches the NPV.", "The two bars are swept over different multipliers, 0.8 and 1.2 for production against 0.7 and 1.3 for price, because a volume forecast is held to be the better known.", "Production scales the volume and the variable opex those barrels carry, so a smaller field pays a smaller operating bill while a price cut leaves every barrel''s cost in place."]'::jsonb and answer_index = 3 and explanation = 'At 0.7 Production keeps 4.1176 where Oil Price reaches -17.3893, and the difference is the variable opex that left with the barrels. Before the 2026-09-15 repair the two bars were the same width to four decimals.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A tornado for ISIALA draws the Production bar narrower than the Oil Price bar, 152.3420 against 193.2845. What in the expanded case makes the difference?', options = '["Every cost in the ledger is a fixed share of revenue, so any lever that moves revenue moves the NPV with it and the narrower bar is only the one the chart rounds.", "Royalty is charged on barrels while a price change is taxed on revenue, so the state takes a different share out of each of the two levers before it reaches the NPV.", "The two bars are swept over different multipliers, 0.8 and 1.2 for production against 0.7 and 1.3 for price, because a volume forecast is held to be the better known.", "Production scales the volume and the variable opex those barrels carry, so a smaller field pays a smaller operating bill while a price cut leaves every barrel''s cost in place."]'::jsonb, explanation = 'At 0.7 Production keeps 4.1176 where Oil Price reaches -17.3893, and the difference is the variable opex that left with the barrels. Before the 2026-09-15 repair the two bars were the same width to four decimals.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 19: prompt, option_0, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'OKPOMA''s capex of 260 is split 130.0000 in 2027 and 130.0000 in 2028, and its summary card prints a payback of 0.0000 years beside a maxExposure of -2.2287. How should that payback be read?' and options = '["The cumulative was non-negative at index 0, so payback reads 0, and the engine never revisits it after the second capex year pushes the cumulative under water.", "OKPOMA never had money at risk, since its 2027 gross revenue of 193.5960 covers both halves of the 260 of capex before 2028 begins.", "The engine reads payback from discounted rows, and 2028''s -11.4786 discounted at 10 percent no longer takes the cumulative below zero.", "A payback of 0 flags net cash flows that never change sign, the same fixed return the IRR solver gives a ledger with no negative year."]'::jsonb and answer_index = 0 and explanation = 'The cumulative is 9.2498 after 2027 and -2.2287 after 2028: 2027''s gross revenue of 193.5960 pays royalty, opex, tax and only that year''s 130.0000 of capex, never the whole 260, and the second 130.0000 lands after a positive year. maxExposure prints -2.2287 with no year beside it, so only the cumulative column shows the dip.' then 'old'
           when prompt = 'OKPOMA''s capex of 260 is split 130.0000 in 2027 and 130.0000 in 2028, and its summary card prints a payback of 0.0000 years with paybackStatus recrossed beside a maxExposure of -2.2287. How should that payback be read?' and options = '["As the FIRST crossing, at index 0, with paybackLast 2.0385 carrying the year the cumulative turns non-negative for good.", "OKPOMA never had money at risk, since its 2027 gross revenue of 193.5960 covers both halves of the 260 of capex before 2028 begins.", "The engine reads payback from discounted rows, where 2028''s -11.4786 no longer takes the cumulative below zero.", "A payback of 0.0000 with a status of no-investment, which is what the engine reports for a ledger whose cumulative is non-negative in every period of the life."]'::jsonb and answer_index = 0 and explanation = 'The cumulative is 9.2498 after 2027 and -2.2287 after 2028, so the status is recrossed and paybackLast is 2 + 2.2287 / 57.8806 = 2.0385. A ledger that is never under water reads 0.0000 with no-investment instead, and before the 2026-09-15 repair both shapes printed the same bare 0.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 19'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 19 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'OKPOMA''s capex of 260 is split 130.0000 in 2027 and 130.0000 in 2028, and its summary card prints a payback of 0.0000 years with paybackStatus recrossed beside a maxExposure of -2.2287. How should that payback be read?', options = '["As the FIRST crossing, at index 0, with paybackLast 2.0385 carrying the year the cumulative turns non-negative for good.", "OKPOMA never had money at risk, since its 2027 gross revenue of 193.5960 covers both halves of the 260 of capex before 2028 begins.", "The engine reads payback from discounted rows, where 2028''s -11.4786 no longer takes the cumulative below zero.", "A payback of 0.0000 with a status of no-investment, which is what the engine reports for a ledger whose cumulative is non-negative in every period of the life."]'::jsonb, explanation = 'The cumulative is 9.2498 after 2027 and -2.2287 after 2028, so the status is recrossed and paybackLast is 2 + 2.2287 / 57.8806 = 2.0385. A ledger that is never under water reads 0.0000 with no-investment instead, and before the 2026-09-15 repair both shapes printed the same bare 0.0000.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 19 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 20: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario reports a payback of 20.0000 years. What does that number say?' and options = '["Low pays back in its final year, 2046, so it is slow but recovers its 216.0000 of capex.", "Never: a payback equal to the project life is the engine''s way of saying the cumulative never recovers.", "Low pays back after twenty years discounted at 12 percent, which the scenario reports in place of the undiscounted figure.", "Low recovers within the life, and 20.0000 is the fixed life written over the true crossing because the quick form caps payback."]'::jsonb and answer_index = 1 and explanation = 'payback_never reports 5.0000 on a five period life the same way, and a value equal to the life cannot tell a recovery at the very end from none; Low''s NPV is -72.1531.' then 'old'
           when prompt = 'A board pack ranks ISIALA''s three scenarios by speed of recovery: High at 0.0000 years, Base at 3.2746 and Low left blank. What has the ranking missed?' and options = '["Nothing: High, Base, Low is exactly the order the three paybacks give, and a blank is simply the slowest entry of the three.", "Three situations wearing two numbers and a blank: High was never under water, Base crosses inside 2030, and Low never recovers at all.", "That payback is struck on discounted cash, so the three figures cannot be compared until each is restated at its own scenario''s discount rate.", "That Low recovers in 2046, its final year, so the blank belongs beside Base rather than at the end of the ranking."]'::jsonb and answer_index = 1 and explanation = 'High carries paybackStatus no-investment, Base carries ok and Low carries not-recovered. Before the 2026-09-15 repair Low printed its project life, 20.0000, which reads like a recovery in the final year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 20'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A board pack ranks ISIALA''s three scenarios by speed of recovery: High at 0.0000 years, Base at 3.2746 and Low left blank. What has the ranking missed?', options = '["Nothing: High, Base, Low is exactly the order the three paybacks give, and a blank is simply the slowest entry of the three.", "Three situations wearing two numbers and a blank: High was never under water, Base crosses inside 2030, and Low never recovers at all.", "That payback is struck on discounted cash, so the three figures cannot be compared until each is restated at its own scenario''s discount rate.", "That Low recovers in 2046, its final year, so the blank belongs beside Base rather than at the end of the ranking."]'::jsonb, explanation = 'High carries paybackStatus no-investment, Base carries ok and Low carries not-recovered. Before the 2026-09-15 repair Low printed its project life, 20.0000, which reads like a recovery in the final year.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 21: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Sorted by IRR, a screening shortlist puts NTEJE first at 1000.0000 percent, above ISIALA''s 53.7148, although NTEJE''s NPV is -123.9923 and its payback equals its twenty year life. What is NTEJE''s rate?' and options = '["A root beyond the clamp, like irr_beyond_clamp, whose true rate of 9900 percent the engine can only print as 1000.", "A real return on a small early outlay, the kind of rate a project earns when its first year revenue nearly covers the first half of its capex.", "The Newton clamp reported as a rate: NTEJE''s NPV never changes sign, so there is no root to find at any rate (FINDINGS S1).", "The slope guard''s fixed return, which the engine hands back when a ledger''s cash flows are of order 1e-7 million USD."]'::jsonb and answer_index = 2 and explanation = 'NTEJE''s cumulative closes at -154.5906 and payback reads 20.0000. irr_beyond_clamp is the different case of a real root at 9900 percent past the clamp; NTEJE has no root at all, so treat 0, 10 and 1000 as flags until the net cash flow column agrees.' then 'old'
           when prompt = 'A screening shortlist is sorted by IRR. NTEJE reports irr null with irrStatus no-root on an NPV of -123.9923, beside ISIALA''s 53.7148 percent. Where does the sort put NTEJE?' and options = '["At the top, above ISIALA, because the engine reports 1000.0000 percent whenever the search runs to the end of its band without settling.", "Beside irr_beyond_clamp, whose true rate of 9900 percent sits past the band, since both cases describe a root the search could not reach.", "Nowhere: there is no rate to sort on, and the status says why none exists instead of supplying one.", "At the bottom, below every negative rate, since a null sorts as zero."]'::jsonb and answer_index = 2 and explanation = 'No rate in the band zeroes NTEJE''s NPV, which is what no-root names, and its payback is null with paybackStatus not-recovered on a cumulative closing at -154.5906. Before the 2026-09-15 repair it printed 1000.0000 percent, the Newton clamp recorded as FINDINGS S1, and the sort put it first.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 21'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening shortlist is sorted by IRR. NTEJE reports irr null with irrStatus no-root on an NPV of -123.9923, beside ISIALA''s 53.7148 percent. Where does the sort put NTEJE?', options = '["At the top, above ISIALA, because the engine reports 1000.0000 percent whenever the search runs to the end of its band without settling.", "Beside irr_beyond_clamp, whose true rate of 9900 percent sits past the band, since both cases describe a root the search could not reach.", "Nowhere: there is no rate to sort on, and the status says why none exists instead of supplying one.", "At the bottom, below every negative rate, since a null sorts as zero."]'::jsonb, explanation = 'No rate in the band zeroes NTEJE''s NPV, which is what no-root names, and its payback is null with paybackStatus not-recovered on a cumulative closing at -154.5906. Before the 2026-09-15 repair it printed 1000.0000 percent, the Newton clamp recorded as FINDINGS S1, and the sort put it first.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 22: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s High scenario reports an IRR of 0.0000 percent beside an NPV of 237.8860 and a maxExposure of 27.7707. How should the IRR be read?' and options = '["As a genuine ranking: a larger project earns a lower return per unit of money at risk, so High truly sits below Base at 53.7148.", "As a clamp wrapped round to zero, since Newton ran away past 1000 percent on a project that earns more than it spends in 2027.", "As a real root at zero, since High recovers its 144.0000 of capex by the end of its life and earns no return on it.", "As the engine''s fixed return for no root: High''s net cash flow never changes sign and its cumulative never falls below zero."]'::jsonb and answer_index = 3 and explanation = 'Low''s -3.5758 is a real negative root, and High''s payback of 0.0000 is the same kind of flag; read NPV and peak exposure first.' then 'old'
           when prompt = 'ISIALA''s High scenario reports irr null with irrStatus no-sign-change beside an NPV of 226.0140 and a maxExposure of 25.0565. How should the null be read?' and options = '["As a genuine ranking: a larger project earns a lower return per unit of money at risk, so High truly sits below Base at 53.7148 percent.", "As a failure of the search, which stopped before it reached a root because every one of High''s twenty rows is positive and Newton needs a negative row to start.", "As a rate of zero, since High recovers its 144.0000 of capex by the end of its life and earns nothing at all above it.", "As a ledger with no rate to find: no year of High is ever under water, so nothing was put at risk for a return to be measured against."]'::jsonb and answer_index = 3 and explanation = 'Low''s -0.6992 percent carries irrStatus ok, a real negative root, and High''s payback of 0.0000 carries paybackStatus no-investment. Before the 2026-09-15 repair both of High''s readings printed as a plain 0.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s High scenario reports irr null with irrStatus no-sign-change beside an NPV of 226.0140 and a maxExposure of 25.0565. How should the null be read?', options = '["As a genuine ranking: a larger project earns a lower return per unit of money at risk, so High truly sits below Base at 53.7148 percent.", "As a failure of the search, which stopped before it reached a root because every one of High''s twenty rows is positive and Newton needs a negative row to start.", "As a rate of zero, since High recovers its 144.0000 of capex by the end of its life and earns nothing at all above it.", "As a ledger with no rate to find: no year of High is ever under water, so nothing was put at risk for a return to be measured against."]'::jsonb, explanation = 'Low''s -0.6992 percent carries irrStatus ok, a real negative root, and High''s payback of 0.0000 carries paybackStatus no-investment. Before the 2026-09-15 repair both of High''s readings printed as a plain 0.0000.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 23: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The published ledger -100, 230, -132 returns an IRR of 10.0000. What is that return?' and options = '["One of two true roots, 10 and 20 percent; Newton started at 10 and stopped there, and the return does not mention the other.", "The only root, because mid-year discounting removes the second root that the same flows would show under year end discounting.", "The slope guard''s starting guess handed back unchanged, which means Newton found no root at all on flows that change sign twice.", "The case''s discount rate, which the engine returns in place of a rate whenever cash flows change sign more than once."]'::jsonb and answer_index = 0 and explanation = 'Every mid-year term carries the same (1 + r)^-0.5, so the year-end roots of 10 and 20 percent survive; the engine reports one root when there are two.' then 'old'
           when prompt = 'The published irr_beyond_clamp case has net cash flows of -1 and +100, and its true mid-year IRR is 9900 percent. What does the engine report?' and options = '["irr null with irrStatus above-clamp, because Newton is stopped at 1000 percent and the NPV is still positive there.", "1000.0000 percent, the bound printed as though it were the rate the search had found.", "A rate of 9900 percent, since the engine widens its band whenever the NPV has not changed sign by 1000 percent.", "irr null with irrStatus no-sign-change, since a ledger of only two periods gives Newton too few rows to measure a slope against."]'::jsonb and answer_index = 0 and explanation = 'The clamp stops the search at 1000 percent and the NPV is still positive there, so the engine returns null and names the bound. The golden records the true root at 9900 percent, and before the 2026-09-15 repair the engine printed the clamp itself as a rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 23'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published irr_beyond_clamp case has net cash flows of -1 and +100, and its true mid-year IRR is 9900 percent. What does the engine report?', options = '["irr null with irrStatus above-clamp, because Newton is stopped at 1000 percent and the NPV is still positive there.", "1000.0000 percent, the bound printed as though it were the rate the search had found.", "A rate of 9900 percent, since the engine widens its band whenever the NPV has not changed sign by 1000 percent.", "irr null with irrStatus no-sign-change, since a ledger of only two periods gives Newton too few rows to measure a slope against."]'::jsonb, explanation = 'The clamp stops the search at 1000 percent and the NPV is still positive there, so the engine returns null and names the bound. The golden records the true root at 9900 percent, and before the 2026-09-15 repair the engine printed the clamp itself as a rate.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 24: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The published two year hand case has capex of 50 in year 1, net cash flows of 10 then 35, an NPV of 39.8721 and an IRR of 0.0000. Why zero?' and options = '["The project earns back its 50 of capex exactly by the end of year 1, which is a zero rate of return on the money invested.", "Expensing the 50 in the year it is spent cancels the investment inside the rate calculation, so no outlay is left to earn a return on.", "Year 1''s tax of 10 exactly offsets its net cash flow of 10, and the solver treats a year that nets to zero as the start of the project.", "Year 1 is already positive after capex, so the flows never change sign and the engine returns its fixed 0."]'::jsonb and answer_index = 3 and explanation = 'Capex of 50 sits inside year 1''s net cash flow of 10 beside royalty 20, opex 10 and tax 10; payback reads 0.0000 for the same reason, and neither is a statement about value.' then 'old'
           when prompt = 'The published two year hand case has capex of 50 in year 1, net cash flows of 10 then 35 and an NPV of 39.8721. What does it report for IRR and payback?' and options = '["An IRR of 0.0000 percent and a payback of 0.0000 years, the two fixed returns the engine prints for a ledger that holds no negative row at all.", "An IRR of 21.0000 percent beside a payback of 1.0000 year.", "irr null with irrStatus no-root and payback null with paybackStatus not-recovered, since a case with no outlay has nothing to recover and no root to find.", "irr null with irrStatus no-sign-change and payback 0.0000 with paybackStatus no-investment."]'::jsonb and answer_index = 3 and explanation = 'Capex of 50 sits inside year 1''s net cash flow of 10 beside royalty 20, opex 10 and tax 10, so the flows never change sign and no year is under water. Before the 2026-09-15 repair both came back as a plain 0.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 24'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published two year hand case has capex of 50 in year 1, net cash flows of 10 then 35 and an NPV of 39.8721. What does it report for IRR and payback?', options = '["An IRR of 0.0000 percent and a payback of 0.0000 years, the two fixed returns the engine prints for a ledger that holds no negative row at all.", "An IRR of 21.0000 percent beside a payback of 1.0000 year.", "irr null with irrStatus no-root and payback null with paybackStatus not-recovered, since a case with no outlay has nothing to recover and no root to find.", "irr null with irrStatus no-sign-change and payback 0.0000 with paybackStatus no-investment."]'::jsonb, explanation = 'Capex of 50 sits inside year 1''s net cash flow of 10 beside royalty 20, opex 10 and tax 10, so the flows never change sign and no year is under water. Before the 2026-09-15 repair both came back as a plain 0.0000.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 25: prompt, option_1, explanation
  select case
           when prompt = 'A summary writes ISIALA''s High scenario as "exposure 27.7707". What has the summary done?' and options = '["Nothing wrong, since peak exposure is reported as a magnitude and the sign on the engine''s value is a display convention only.", "Understated the need, since 27.7707 is the discounted trough and the undiscounted hole is deeper by the first mid-year factor.", "Dropped the sign, so the lowest cumulative of a project never under water reads as a funding need.", "Quoted the funding needed for 2027, the year High spends the first half of its 144.0000 of capex against a smaller revenue."]'::jsonb and answer_index = 2 and explanation = 'ISIALA''s Low scenario at -146.2765 and NTEJE at -169.0209 are real holes; maxExposure is plain undiscounted cash and its sign carries the meaning.' then 'old'
           when prompt = 'A summary writes ISIALA''s High scenario as "exposure 25.0565". What has the summary done?' and options = '["Nothing wrong, since peak exposure is reported as a magnitude and the sign on the engine''s value is a display convention only.", "Understated the need, since 25.0565 is the discounted trough and the undiscounted hole is deeper by the first mid-year factor.", "Dropped the sign, so the lowest cumulative of a project never under water reads as a funding need.", "Quoted the funding needed for 2027, the year High spends the first half of its 144.0000 of capex against a smaller revenue."]'::jsonb and answer_index = 2 and explanation = 'ISIALA''s Low scenario at -138.4263 and NTEJE at -169.0209 are real holes; maxExposure is plain undiscounted cash and its sign carries the meaning.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 25'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A summary writes ISIALA''s High scenario as "exposure 25.0565". What has the summary done?', options = '["Nothing wrong, since peak exposure is reported as a magnitude and the sign on the engine''s value is a display convention only.", "Understated the need, since 25.0565 is the discounted trough and the undiscounted hole is deeper by the first mid-year factor.", "Dropped the sign, so the lowest cumulative of a project never under water reads as a funding need.", "Quoted the funding needed for 2027, the year High spends the first half of its 144.0000 of capex against a smaller revenue."]'::jsonb, explanation = 'ISIALA''s Low scenario at -138.4263 and NTEJE at -169.0209 are real holes; maxExposure is plain undiscounted cash and its sign carries the meaning.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 27: option_1, explanation
  select case
           when prompt = 'A tornado sorts ISIALA''s bars on the signed swing, high minus low. Where does that put CAPEX and OPEX?' and options = '["In the same order as a sort by width, because a sign records direction only and cannot change where a bar is ranked.", "CAPEX at the top, because -93.4835 is the largest swing in magnitude once the tie at 193.2845 between the top two is broken.", "OPEX off the chart, because a bar whose two ends match to within a rounding has no width to sort and is dropped from the list.", "OPEX at -8.6463 above CAPEX at -93.4835, the wrong order."]'::jsonb and answer_index = 3 and explanation = 'Sorted by width Oil Price and Production tie at 193.2845, CAPEX follows at 93.4835 and OPEX is last; raising capex or opex lowers NPV, which is all the negative sign records.' then 'old'
           when prompt = 'A tornado sorts ISIALA''s bars on the signed swing, high minus low. Where does that put CAPEX and OPEX?' and options = '["In the same order as a sort by width, because a sign records direction only and cannot change where a bar is ranked.", "CAPEX at the top, because -93.4835 is the largest swing in magnitude once the two revenue bars are set aside as one lever.", "OPEX off the chart, because a bar whose two ends match to within a rounding has no width to sort and is dropped from the list.", "OPEX at -8.6463 above CAPEX at -93.4835, the wrong order."]'::jsonb and answer_index = 3 and explanation = 'Sorted by width Oil Price leads at 193.2845, Production follows at 152.3420, CAPEX comes next at 93.4835 and OPEX is last; raising capex or opex lowers NPV, which is all the negative sign records.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 27'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A tornado sorts ISIALA''s bars on the signed swing, high minus low. Where does that put CAPEX and OPEX?', options = '["In the same order as a sort by width, because a sign records direction only and cannot change where a bar is ranked.", "CAPEX at the top, because -93.4835 is the largest swing in magnitude once the two revenue bars are set aside as one lever.", "OPEX off the chart, because a bar whose two ends match to within a rounding has no width to sort and is dropped from the list.", "OPEX at -8.6463 above CAPEX at -93.4835, the wrong order."]'::jsonb, explanation = 'Sorted by width Oil Price leads at 193.2845, Production follows at 152.3420, CAPEX comes next at 93.4835 and OPEX is last; raising capex or opex lowers NPV, which is all the negative sign records.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 29: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s Low scenario produces less oil than Base yet its totalOpex is 220.4887 against Base''s 210.4887. Why higher?' and options = '["Low''s lower oil price raises the variable cost per barrel, which the engine indexes to revenue rather than to the volume produced.", "Low''s capex of 216.0000 is charged partly through the opex column in the two capex years, which lifts the lifetime opex total.", "Variable opex does follow Low''s 0.8 production downward, but fixed opex at 1.2 rises faster and outweighs the barrels saved.", "Low scales fixed opex by 1.2 and leaves variable opex at the base volume, so the extra is all fixed opex."]'::jsonb and answer_index = 3 and explanation = 'High reads 200.4887, the same distance below Base; the scenarios never scale variable opex, which holds at the base volume even while Low produces less.' then 'old'
           when prompt = 'ISIALA''s Low scenario produces less oil than Base and its totalOpex is 188.3910 against Base''s 210.4887. Which half of the column fell, and which rose?' and options = '["Both halves fell, since a scenario scales the whole opex column with production and the flat charge of 2.5 million USD a year follows the volume down.", "Neither moved, since the scenarios leave opex at the base and the gap to 210.4887 is the capex that Low charges through the same column.", "Variable opex was held at the base volume while fixed opex rose by a fifth, so the whole distance from the Base is fixed opex and the total is the higher of the two.", "Variable opex fell with the barrels at 0.8 while fixed opex rose by a fifth, and the variable half is much the larger of the two."]'::jsonb and answer_index = 3 and explanation = 'High mirrors it at 232.5864, above the Base because High lifts more oil. Before the 2026-09-15 repair the scenarios held variable opex at the base volume, so Low read 220.4887 and High 200.4887, the smaller field the dearer one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 29'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario produces less oil than Base and its totalOpex is 188.3910 against Base''s 210.4887. Which half of the column fell, and which rose?', options = '["Both halves fell, since a scenario scales the whole opex column with production and the flat charge of 2.5 million USD a year follows the volume down.", "Neither moved, since the scenarios leave opex at the base and the gap to 210.4887 is the capex that Low charges through the same column.", "Variable opex was held at the base volume while fixed opex rose by a fifth, so the whole distance from the Base is fixed opex and the total is the higher of the two.", "Variable opex fell with the barrels at 0.8 while fixed opex rose by a fifth, and the variable half is much the larger of the two."]'::jsonb, explanation = 'High mirrors it at 232.5864, above the Base because High lifts more oil. Before the 2026-09-15 repair the scenarios held variable opex at the base volume, so Low read 220.4887 and High 200.4887, the smaller field the dearer one.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 30: prompt, option_2
  select case
           when prompt = 'ISIALA''s Low scenario pays totalTax of 62.9637 against Base''s 136.0307, less than half, while totalRoyalty falls only to 82.9603 from 129.6255. Why does tax fall so much further?' and options = '["Low scales the tax rate by 0.8 along with price and production, so each year''s tax falls by two multipliers where royalty falls by one.", "Tax is charged on the residual after royalty, opex and capex, which swings far harder than revenue; royalty is a fixed fraction of revenue.", "A payback of 20.0000 exempts every one of Low''s years from tax, and the 62.9637 is tax the engine charges on the High side of the table.", "Low''s net cash flow is negative over the life, so the engine rebates part of the tax it would have charged the Base case on the same twenty rows of the ledger."]'::jsonb and answer_index = 1 and explanation = 'Royalty follows revenue one for one, 553.0688 against 864.1699; the royalty rate, the tax rate and the discount rate are never scaled by the scenarios.' then 'old'
           when prompt = 'ISIALA''s Low scenario pays totalTax of 71.4503 against Base''s 136.0307, close to half, while totalRoyalty falls only to 82.9603 from 129.6255. Why does tax fall so much further?' and options = '["Low scales the tax rate by 0.8 along with price and production, so each year''s tax falls by two multipliers where royalty falls by one.", "Tax is charged on the residual after royalty, opex and capex, which swings far harder than revenue; royalty is a fixed fraction of revenue.", "A payback of null exempts every one of Low''s years from tax, and the 71.4503 is tax the engine charges on the High side of the table.", "Low''s net cash flow is negative over the life, so the engine rebates part of the tax it would have charged the Base case on the same twenty rows of the ledger."]'::jsonb and answer_index = 1 and explanation = 'Royalty follows revenue one for one, 553.0688 against 864.1699; the royalty rate, the tax rate and the discount rate are never scaled by the scenarios.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 30'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Low scenario pays totalTax of 71.4503 against Base''s 136.0307, close to half, while totalRoyalty falls only to 82.9603 from 129.6255. Why does tax fall so much further?', options = '["Low scales the tax rate by 0.8 along with price and production, so each year''s tax falls by two multipliers where royalty falls by one.", "Tax is charged on the residual after royalty, opex and capex, which swings far harder than revenue; royalty is a fixed fraction of revenue.", "A payback of null exempts every one of Low''s years from tax, and the 71.4503 is tax the engine charges on the High side of the table.", "Low''s net cash flow is negative over the life, so the engine rebates part of the tax it would have charged the Base case on the same twenty rows of the ledger."]'::jsonb, explanation = 'Royalty follows revenue one for one, 553.0688 against 864.1699; the royalty rate, the tax rate and the discount rate are never scaled by the scenarios.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 31: option_0, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A board pack heads the Low, Base and High columns from generateScenarios with P90, P50 and P10, so ISIALA''s Low column now reads as its P90. What is wrong?' and options = '["Only the order, since under the exceedance meaning the low value -72.1531 should carry P10 and the high value 237.8860 should carry P90.", "Nothing, since the multipliers of 0.8 and 1.2 are chosen as the 10th and 90th percentile of each input and the NPVs inherit those odds.", "It gives -72.1531 odds it never had: no probability was computed for any scenario, and P90 on an NPV is a value met or exceeded with 90 percent probability.", "Only the middle label, since the Best case P50 of 81.1835 belongs there, and the two outer scenarios are then the tails of the same sample."]'::jsonb and answer_index = 2 and explanation = 'The first wrong reading puts P10 on the low value, which is the cumulative reading and the reverse of the exceedance meaning in which P90 is the Low case; a scenario takes no P-label either way.' then 'old'
           when prompt = 'A board pack heads the Low, Base and High columns from generateScenarios with P90, P50 and P10, so ISIALA''s Low column now reads as its P90. What is wrong?' and options = '["Only the order, since under the exceedance meaning the low value -57.8151 should carry P10 and the high value 226.0140 should carry P90.", "Nothing, since the multipliers of 0.8 and 1.2 are chosen as the 10th and 90th percentile of each input and the NPVs inherit those odds.", "It gives -57.8151 odds it never had: no probability was computed for any scenario, and P90 on an NPV is a value met or exceeded with 90 percent probability.", "Only the middle label, since the Best case P50 of 78.5315 belongs there, and the two outer scenarios are then the tails of the same sample."]'::jsonb and answer_index = 2 and explanation = 'The first wrong reading puts P10 on the low value, which is the cumulative reading and the reverse of the exceedance meaning in which P90 is the Low case; a scenario takes no P-label either way.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 31'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A board pack heads the Low, Base and High columns from generateScenarios with P90, P50 and P10, so ISIALA''s Low column now reads as its P90. What is wrong?', options = '["Only the order, since under the exceedance meaning the low value -57.8151 should carry P10 and the high value 226.0140 should carry P90.", "Nothing, since the multipliers of 0.8 and 1.2 are chosen as the 10th and 90th percentile of each input and the NPVs inherit those odds.", "It gives -57.8151 odds it never had: no probability was computed for any scenario, and P90 on an NPV is a value met or exceeded with 90 percent probability.", "Only the middle label, since the Best case P50 of 78.5315 belongs there, and the two outer scenarios are then the tails of the same sample."]'::jsonb, explanation = 'The first wrong reading puts P10 on the low value, which is the cumulative reading and the reverse of the exceedance meaning in which P90 is the Low case; a scenario takes no P-label either way.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 32: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Before EC3-0 the Scenario Builder''s results panel printed ISIALA''s 109.8980 under "P90 (Conservative)". What had it done?' and options = '["Printed the engine''s p90 key, a plain 90th percentile of the sampled NPVs, under an exceedance label, so the conservative card held the High case P10.", "Nothing wrong, since the p90 key names the value the NPV exceeds with 90 percent probability and 109.8980 is ISIALA''s Low case.", "Swapped the mean and the median, since 109.8980 is the sampled emv of the run and 81.1835 is the deterministic value at the typed inputs.", "Used the breakeven percentile rule where the screening rule belongs, which moves the lower card of the sample from 48.7439 to 109.8980."]'::jsonb and answer_index = 0 and explanation = 'The first wrong reading takes the engine key p90 as a P-label, the misuse the swap shipped; the Low case P90 is the p10 key, 48.7439, and the emv is 80.1707.' then 'old'
           when prompt = 'The Scenario Builder''s results panel that shipped before EC3-0 printed ISIALA''s 15.6063 under "P10 (Optimistic)". Under the exceedance meaning, what is 15.6063, and what had the panel done?' and options = '["It is the Low case P90, and the panel had read the engine key p10 aloud as a P-label, so the card called optimistic carried the lowest of the three.", "It is the High case P10, so that card was right and only the conservative card beside it was mislabelled.", "It is the Best case P50 printed one card early, since 15.6063 is the sampled value nearest the emv of 80.9836.", "It is a 10th percentile of an NPV, which takes no P-label at all, so the card should have named the percentile and dropped the case name."]'::jsonb and answer_index = 0 and explanation = 'P90 means a 90 percent probability of meeting or exceeding the value, so the Low case is the smallest of the three, 15.6063, stored under the engine key p10. The Best case P50 is 78.5315, and the same panel printed 152.0653 under "P90 (Conservative)".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 32'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Scenario Builder''s results panel that shipped before EC3-0 printed ISIALA''s 15.6063 under "P10 (Optimistic)". Under the exceedance meaning, what is 15.6063, and what had the panel done?', options = '["It is the Low case P90, and the panel had read the engine key p10 aloud as a P-label, so the card called optimistic carried the lowest of the three.", "It is the High case P10, so that card was right and only the conservative card beside it was mislabelled.", "It is the Best case P50 printed one card early, since 15.6063 is the sampled value nearest the emv of 80.9836.", "It is a 10th percentile of an NPV, which takes no P-label at all, so the card should have named the percentile and dropped the case name."]'::jsonb, explanation = 'P90 means a 90 percent probability of meeting or exceeding the value, so the Low case is the smallest of the three, 15.6063, stored under the engine key p10. The Best case P50 is 78.5315, and the same panel printed 152.0653 under "P90 (Conservative)".'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 33: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why does the Scenario Builder''s Low case P90 of 48.7439 sit so far above ISIALA''s Low scenario of -72.1531?' and options = '["The Monte Carlo also samples opex, royalty and tax, and their favourable draws lift the low tail of the sample above the scenario''s corner.", "The sample moves each input up to 20 percent from the base while the scenario moves each by 30 percent, so the scenario reaches further out.", "The sample moves price, capex and reserves together once per run, so its low tail is a milder version of the scenario''s same corner.", "The Monte Carlo draws price, capex and reserves independently, one draw per year each, so a bad draw is usually offset; the scenario forces every input bad at once."]'::jsonb and answer_index = 3 and explanation = 'The scenario lands well below even the lowest of the 1000 sampled NPVs, 16.3054; opex is never sampled, and the scenario multipliers are 0.8 and 1.2.' then 'old'
           when prompt = 'ISIALA''s Base scenario is 81.0464 million USD and the sampled run''s Best case P50 is 78.5315. They land close. What is wrong with treating them as one number?' and options = '["Nothing, since the Base scenario is by construction the median of the distribution the sample draws from and the small gap is sampling error that more iterations would close.", "The gap is the mid-year discounting that the sample applies and the deterministic run does not, so the two are reconciled by the factor 1.058301.", "The Best case P50 is the higher of the two on any field, so a base run above it shows the sample was drawn from the wrong ranges.", "One is a single run at the typed inputs and the other the middle of 1000 sampled NPVs, so they are different quantities that happen to land near each other on this field."]'::jsonb and answer_index = 3 and explanation = 'A deterministic NPV carries no probability and the Best case P50 is the middle of a sample at seed 20260829. Nothing in the engine promises the two will land close on the next field, and the emv is a third quantity again at 80.9836.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 33'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s Base scenario is 81.0464 million USD and the sampled run''s Best case P50 is 78.5315. They land close. What is wrong with treating them as one number?', options = '["Nothing, since the Base scenario is by construction the median of the distribution the sample draws from and the small gap is sampling error that more iterations would close.", "The gap is the mid-year discounting that the sample applies and the deterministic run does not, so the two are reconciled by the factor 1.058301.", "The Best case P50 is the higher of the two on any field, so a base run above it shows the sample was drawn from the wrong ranges.", "One is a single run at the typed inputs and the other the middle of 1000 sampled NPVs, so they are different quantities that happen to land near each other on this field."]'::jsonb, explanation = 'A deterministic NPV carries no probability and the Best case P50 is the middle of a sample at seed 20260829. Nothing in the engine promises the two will land close on the next field, and the emv is a third quantity again at 80.9836.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 38: prompt, explanation
  select case
           when prompt = 'Which refusal of the screening engine does ISIALA''s Low scenario NPV of -72.1531 inherit that a real operator would not accept?' and options = '["No royalty in loss years, so Low''s value leaves out the 82.9603 of royalty that a real regime would have collected.", "A loss carried forward, which Low uses to shelter its later tax although a real regime taxing only positive bases would forbid it.", "No economic limit: Low still produces and charges all twenty years of the fixed life, including any year that loses money.", "A development year with no revenue, which the quick form inserts into Low to hold its 216.0000 of capex and leaves out of Base."]'::jsonb and answer_index = 2 and explanation = 'Royalty is charged in every producing year and no loss is ever carried; the scenario keeps the engine''s limits, which is also why its payback reads 20.0000.' then 'old'
           when prompt = 'Which refusal of the screening engine does ISIALA''s Low scenario NPV of -57.8151 inherit that a real operator would not accept?' and options = '["No royalty in loss years, so Low''s value leaves out the 82.9603 of royalty that a real regime would have collected.", "A loss carried forward, which Low uses to shelter its later tax although a real regime taxing only positive bases would forbid it.", "No economic limit: Low still produces and charges all twenty years of the fixed life, including any year that loses money.", "A development year with no revenue, which the quick form inserts into Low to hold its 216.0000 of capex and leaves out of Base."]'::jsonb and answer_index = 2 and explanation = 'Royalty is charged in every producing year and no loss is ever carried; the scenario keeps the engine''s limits, which is also why its payback is null with paybackStatus not-recovered.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 38'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which refusal of the screening engine does ISIALA''s Low scenario NPV of -57.8151 inherit that a real operator would not accept?', options = '["No royalty in loss years, so Low''s value leaves out the 82.9603 of royalty that a real regime would have collected.", "A loss carried forward, which Low uses to shelter its later tax although a real regime taxing only positive bases would forbid it.", "No economic limit: Low still produces and charges all twenty years of the fixed life, including any year that loses money.", "A development year with no revenue, which the quick form inserts into Low to hold its 216.0000 of capex and leaves out of Base."]'::jsonb, explanation = 'Royalty is charged in every producing year and no loss is ever carried; the scenario keeps the engine''s limits, which is also why its payback is null with paybackStatus not-recovered.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 39: option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Scenario Builder''s Monte Carlo has a reserves range. What does it actually sample on ISIALA?' and options = '["A total reserves figure from which the engine rederives the life, so a low draw shortens the 20 year case and a high one extends it.", "Each year''s volume, drawn around its base value one year at a time; there is no reserves field and the decline itself is never sampled.", "The decline rate, drawn once per run within 20 percent of 12 percent, which then reshapes the whole profile from 2028 onward.", "The initial rate of 4400 bopd, drawn once per run, with every later year then following the fixed year on year decline of 0.880000 from that draw."]'::jsonb and answer_index = 1 and explanation = 'A steeper decline from the same first year is a case it never samples; volume is whatever an initial rate and a decline add up to over twenty rows.' then 'old'
           when prompt = 'The Scenario Builder''s Monte Carlo has a reserves range. What does it actually sample on ISIALA?' and options = '["A total reserves figure from which the engine rederives the life, so a low draw shortens the 20 year case and a high one extends it.", "One factor an iteration, applied to every year''s volume and to the variable opex those barrels carry; there is no reserves field and the decline is never sampled.", "Each year''s volume separately, drawn around its base value one year at a time, so that a single run can hold a high year beside a low one.", "The decline rate, drawn once per run within 20 percent of 12 percent, which then reshapes the whole profile from 2028 onward."]'::jsonb and answer_index = 1 and explanation = 'The reserves factor scales oil and gas volumes and the variable opex they carry, and it is drawn first, before price and capex. A steeper decline from the same first year is a case it never samples.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 39'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Scenario Builder''s Monte Carlo has a reserves range. What does it actually sample on ISIALA?', options = '["A total reserves figure from which the engine rederives the life, so a low draw shortens the 20 year case and a high one extends it.", "One factor an iteration, applied to every year''s volume and to the variable opex those barrels carry; there is no reserves field and the decline is never sampled.", "Each year''s volume separately, drawn around its base value one year at a time, so that a single run can hold a high year beside a low one.", "The decline rate, drawn once per run within 20 percent of 12 percent, which then reshapes the whole profile from 2028 onward."]'::jsonb, explanation = 'The reserves factor scales oil and gas volumes and the variable opex they carry, and it is drawn first, before price and capex. A steeper decline from the same first year is a case it never samples.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 41: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The published tr_missing_profiles case shows grossRevenue 0.0000, opex 5.0000 and net cash flow -5.0000 in both 2032 and 2033. What did the engine do?' and options = '["Ended the case at the last producing year, since a profile that runs out acts as the economic limit the quick form otherwise lacks.", "Refunded tax on each negative base at the case''s tax rate, so part of each 5.0000 loss is carried by the government through a negative tax line.", "Carried each negative base back to 2031 and reduced that year''s tax of 4.9800 against it, which is why 2032 and 2033 both show no tax of their own.", "Read the missing profile as zero, kept charging opex and returned tax of 0.0000 on the negative base, so the contractor carries each loss."]'::jsonb and answer_index = 3 and explanation = 'The engine does not notice the field stopped; its `|| 0` reads a shorter profile as zero, and a negative base produces no refund, no credit and no memory.' then 'old'
           when prompt = 'The published tr_missing_profiles case loses 5.0000 million USD in each of its last two years, yet reports a payback of 0.0000 years with paybackStatus no-investment beside an IRR of -15.0294 percent with irrStatus ok. How do the three readings fit together?' and options = '["The payback of 0.0000 is the engine''s refusal, the value it returns whenever the cumulative ends lower than it began.", "no-investment means the engine found no capex at all, so the 20.0000 spent in 2030 was read as opex and the rate was struck on the operating rows alone.", "The two statuses disagree, and printing ok beside a negative rate is how the engine flags a ledger whose cumulative ends below its own peak.", "Its cumulative is never negative, running 1.4000, 13.0200, 8.0200 and 3.0200, so nothing was at risk to recover, and the negative IRR is a real root on flows that do change sign."]'::jsonb and answer_index = 3 and explanation = 'no-investment says the cumulative was never below zero, so payback is 0 and the two loss years at the end never take it under. The flows still change sign, so -15.0294 percent is a measurement and not a flag, and the case is worth 3.7561.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 41'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published tr_missing_profiles case loses 5.0000 million USD in each of its last two years, yet reports a payback of 0.0000 years with paybackStatus no-investment beside an IRR of -15.0294 percent with irrStatus ok. How do the three readings fit together?', options = '["The payback of 0.0000 is the engine''s refusal, the value it returns whenever the cumulative ends lower than it began.", "no-investment means the engine found no capex at all, so the 20.0000 spent in 2030 was read as opex and the rate was struck on the operating rows alone.", "The two statuses disagree, and printing ok beside a negative rate is how the engine flags a ledger whose cumulative ends below its own peak.", "Its cumulative is never negative, running 1.4000, 13.0200, 8.0200 and 3.0200, so nothing was at risk to recover, and the negative IRR is a real root on flows that do change sign."]'::jsonb, explanation = 'no-investment says the cumulative was never below zero, so payback is 0 and the two loss years at the end never take it under. The flows still change sign, so -15.0294 percent is a measurement and not a flag, and the case is worth 3.7561.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3b_exam ord 42: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Scale irr_known_21pct''s net cash flows of -100 and +121 down to order 1e-7 million USD. The root is still 21 percent, yet the engine''s IRR moves from 21.0000 to 10.0000. What happened?' and options = '["Flows that small round to zero at four decimals, so the ledger shows no sign change and the solver returns its fixed rate.", "An absolute guard on the slope, |dNPV/dr| below 1e-5, fires on the first iteration and hands back the 10 percent starting guess.", "Mid-year discounting moves the root from 21 to 10 on small flows, because the half-year exponent of (1 + r)^-0.5 dominates the discounting when the cash is tiny.", "Newton converged on the second root of the case at 10 percent, since cash flows that small always produce two roots, as irr_two_roots does."]'::jsonb and answer_index = 1 and explanation = 'That scaled case is irr_tiny_cash_flows_derivative_guard, a disagreement recorded in FINDINGS-fiscal.md; the guard is absolute, so it fires on size alone, and a rounding to zero would have returned 0.' then 'old'
           when prompt = 'FINDINGS-fiscal.md recorded a disagreement with the oracle on a ledger whose cash flows are of order 1e-7 million USD. What does the repaired engine report there?' and options = '["10.0000 percent, the starting guess, handed back after an absolute guard on the slope, |dNPV/dr| below 1e-5, fires on the first iteration.", "21.0000 percent with irrStatus ok, the same root the unscaled case returns.", "irr null with irrStatus no-sign-change, because flows that small round to zero at the four decimals the ledger prints and leave no crossing to find.", "irr null with irrStatus multiple-roots, as irr_two_roots reports."]'::jsonb and answer_index = 1 and explanation = 'A root does not move with the size of the flows. Before the 2026-09-15 repair the derivative guard fired on the first iteration and irr_tiny_cash_flows_derivative_guard returned the 10 percent start, a disagreement recorded in FINDINGS-fiscal.md.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3b_exam ord 42'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3b_exam ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'FINDINGS-fiscal.md recorded a disagreement with the oracle on a ledger whose cash flows are of order 1e-7 million USD. What does the repaired engine report there?', options = '["10.0000 percent, the starting guess, handed back after an absolute guard on the slope, |dNPV/dr| below 1e-5, fires on the first iteration.", "21.0000 percent with irrStatus ok, the same root the unscaled case returns.", "irr null with irrStatus no-sign-change, because flows that small round to zero at the four decimals the ledger prints and leave no crossing to find.", "irr null with irrStatus multiple-roots, as irr_two_roots reports."]'::jsonb, explanation = 'A root does not move with the size of the flows. Before the 2026-09-15 repair the derivative guard fired on the first iteration and irr_tiny_cash_flows_derivative_guard returned the 10 percent start, a disagreement recorded in FINDINGS-fiscal.md.'
     where app_slug = 'uncertainty' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3b_exam ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the count assertions --
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC3 recut refused: beginner holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC3 recut refused: intermediate holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC3 recut refused: advanced holds % questions, expected 132', v_count; end if;

  raise notice 'EC3 recut beginner: % of 48 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-what-a-screening-model-is', 1),
    ('module', 'm01-what-a-screening-model-is', 2),
    ('module', 'm02-the-case-before-the-numbers', 7),
    ('module', 'm02-the-case-before-the-numbers', 12),
    ('module', 'm02-the-case-before-the-numbers', 13),
    ('module', 'm02-the-case-before-the-numbers', 15),
    ('module', 'm03-the-royalty-and-tax-ledger', 6),
    ('module', 'm04-value-from-a-ledger', 7),
    ('module', 'm04-value-from-a-ledger', 8),
    ('module', 'm04-value-from-a-ledger', 11),
    ('module', 'm04-value-from-a-ledger', 12),
    ('module', 'm04-value-from-a-ledger', 13),
    ('module', 'm04-value-from-a-ledger', 14),
    ('module', 'm05-one-number-becomes-three', 1),
    ('module', 'm05-one-number-becomes-three', 2),
    ('module', 'm05-one-number-becomes-three', 5),
    ('module', 'm05-one-number-becomes-three', 9),
    ('module', 'm05-one-number-becomes-three', 11),
    ('module', 'm05-one-number-becomes-three', 12),
    ('module', 'm05-one-number-becomes-three', 13),
    ('module', 'm05-one-number-becomes-three', 14),
    ('module', 'm05-one-number-becomes-three', 15),
    ('module', 'm06-the-associate-reading', 4),
    ('module', 'm06-the-associate-reading', 8),
    ('module', 'm06-the-associate-reading', 9),
    ('module', 'm06-the-associate-reading', 14),
    ('module', 'm06-the-associate-reading', 15),
    ('final', null::text, 1),
    ('final', null::text, 3),
    ('final', null::text, 6),
    ('final', null::text, 9),
    ('final', null::text, 19),
    ('final', null::text, 20),
    ('final', null::text, 21),
    ('final', null::text, 22),
    ('final', null::text, 23),
    ('final', null::text, 24),
    ('final', null::text, 25),
    ('final', null::text, 27),
    ('final', null::text, 29),
    ('final', null::text, 30),
    ('final', null::text, 31),
    ('final', null::text, 32),
    ('final', null::text, 33),
    ('final', null::text, 38),
    ('final', null::text, 39),
    ('final', null::text, 41),
    ('final', null::text, 42)
)
select 'ec3 recut beginner' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'uncertainty' and q.tier = 'beginner'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec3 recut beginner' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'uncertainty' and tier = 'beginner'
 group by scope, module_key
 order by scope desc, module_key nulls last;
