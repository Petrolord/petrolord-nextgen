-- ============================================================================
-- EC6 RECUT, ASSOCIATE TIER (beginner): Field Development Planning
-- (fdp) question bank brought to the charged end-of-life cost.
--
-- WHY. The EC6 teaching lab called runScenario and runFdpSensitivity with no
-- abandonment argument, so EGINA's ABEX cost item of 260 reached no cash flow
-- and the course taught a field development plan that never pays to abandon
-- the field. planAbandonment is now threaded through every screening case
-- (engines #183 and #191, vendored on engines main 709172f). The live bank was
-- cut against the unrepaired lab, so its moved values are wrong, some of its
-- keyed answers assert a rule that no longer holds, and some of its
-- distractors became true.
--
-- WHAT MOVES. 52 of the 132 Associate questions, 15 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to change, the new correct
-- text was written at the SAME index, so the key balance and key pattern of
-- every bank are untouched. No ord, no module key, no scope and no row count
-- moves.
-- Fields rewritten: 26 prompts, 69 options, 28 explanations.
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and each of the three tiers
-- must still hold 132 questions at the end.
--
-- Every published string below was read from the LIVE production row, not
-- retyped, and every recut string from docs/ec6-abex-recut/banks. The OLD and
-- NEW text in docs/ec6-abex-recut/MANIFEST-beginner.json was independently
-- re-verified character for character against the live table and against the
-- banks before this file was generated, and the set of changed rows was
-- DERIVED from the banks rather than taken from the manifest.
-- Generator: scratchpad ec6recut/gen_questions.py.
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

  -- ec6b_m01 ord 2: option_0, option_1
  select case
           when prompt = 'A plan otherwise like EGINA, with its economics never written, scores 89 percent. Where does that figure come from?' and options = '["The economics section is weighted above the others, because the NPV of 2047.5653 million USD is the figure the document leads on and the rest of it support.", "The score falls to the share of the six headline figures that survive, since the NPV and the IRR of 29.5998 percent both drop out when no economics are written.", "Eight of the nine sections still hold something, so the one empty section costs about a ninth of the score and the error names the CAPEX that is missing.", "A plan that fails validation is given a fixed penalty score, the same one a plan whose reserves rows cannot be parsed receives."]'::jsonb and answer_index = 2 and explanation = 'Completeness counts sections and does not weight them, and the error "Total CAPEX is zero or missing." names the one that is empty.' then 'old'
           when prompt = 'A plan otherwise like EGINA, with its economics never written, scores 89 percent. Where does that figure come from?' and options = '["The economics section is weighted above the others, because the NPV of 2015.4123 million USD is the figure the document leads on and the rest of it support.", "The score falls to the share of the six headline figures that survive, since the NPV of 2015.4123 million USD and the well count both drop out when no economics are written.", "Eight of the nine sections still hold something, so the one empty section costs about a ninth of the score and the error names the CAPEX that is missing.", "A plan that fails validation is given a fixed penalty score, the same one a plan whose reserves rows cannot be parsed receives."]'::jsonb and answer_index = 2 and explanation = 'Completeness counts sections and does not weight them, and the error "Total CAPEX is zero or missing." names the one that is empty.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A plan otherwise like EGINA, with its economics never written, scores 89 percent. Where does that figure come from?', options = '["The economics section is weighted above the others, because the NPV of 2015.4123 million USD is the figure the document leads on and the rest of it support.", "The score falls to the share of the six headline figures that survive, since the NPV of 2015.4123 million USD and the well count both drop out when no economics are written.", "Eight of the nine sections still hold something, so the one empty section costs about a ninth of the score and the error names the CAPEX that is missing.", "A plan that fails validation is given a fixed penalty score, the same one a plan whose reserves rows cannot be parsed receives."]'::jsonb, explanation = 'Completeness counts sections and does not weight them, and the error "Total CAPEX is zero or missing." names the one that is empty.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 3: prompt, explanation, option_2
  select case
           when prompt = 'A reader quotes EGINA''s NPV of 2047.5653 million USD off the plan''s headline and stops there. What is still missing?' and options = '["Nothing further, since the NPV is the one headline figure the studio derives for itself, rather than reading it off an entry that somebody typed into the plan.", "Which capex it ran on, which price deck priced it and which production shape it burned, since one plan holds several answers to overlapping questions.", "The IRR of 29.5998 percent beside it, because a present value can only be read next to the rate of return the same case returned for that concept.", "The completeness score of 100 percent, because a plan scoring below it returns an NPV the studio marks provisional."]'::jsonb and answer_index = 1 and explanation = 'The same concept is worth 2047.5653 million USD at 70.0000 USD a barrel and -1797.2732 million USD at 18.0000, so the deck is part of the number.' then 'old'
           when prompt = 'A reader quotes EGINA''s NPV of 2015.4123 million USD off the plan''s headline and stops there. What is still missing?' and options = '["Nothing further, since the NPV is the one headline figure the studio derives for itself, rather than reading it off an entry that somebody typed into the plan.", "Which capex it ran on, which price deck priced it and which production shape it burned, since one plan holds several answers to overlapping questions.", "The rate of return beside it, because a present value can only ever be read next to the rate that the very same case returned for that concept.", "The completeness score of 100 percent, because a plan scoring below it returns an NPV the studio marks provisional."]'::jsonb and answer_index = 1 and explanation = 'The same concept is worth 2015.4123 million USD at 70.0000 USD a barrel and -1834.1220 million USD at 18.0000, so the deck is part of the number.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 3;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader quotes EGINA''s NPV of 2015.4123 million USD off the plan''s headline and stops there. What is still missing?', options = '["Nothing further, since the NPV is the one headline figure the studio derives for itself, rather than reading it off an entry that somebody typed into the plan.", "Which capex it ran on, which price deck priced it and which production shape it burned, since one plan holds several answers to overlapping questions.", "The rate of return beside it, because a present value can only ever be read next to the rate that the very same case returned for that concept.", "The completeness score of 100 percent, because a plan scoring below it returns an NPV the studio marks provisional."]'::jsonb, explanation = 'The same concept is worth 2015.4123 million USD at 70.0000 USD a barrel and -1834.1220 million USD at 18.0000, so the deck is part of the number.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 8: explanation
  select case
           when prompt = 'The screening tier discounts mid year. What does that convention do to the answer?' and options = '["It halves the 10.0000 percent discount rate for the first producing year, which is how the payback of 3.8273 years comes to fall between two whole years.", "It treats a year of production as arriving in the middle of the year, which is closer to how a field earns and gives a slightly higher present value than year end discounting on the same cash flow.", "It moves half of each year''s capex into the year before it is spent, so the deepest cash position of -2250.0000 million USD arrives one period earlier.", "It applies the 10.0000 percent rate at the middle of the 20.0000 year life rather than year by year, so a single factor prices the whole profile at once."]'::jsonb and answer_index = 1 and explanation = 'It is a timing convention on the same cash flow, and the NPV of 2047.5653 million USD carries it.' then 'old'
           when prompt = 'The screening tier discounts mid year. What does that convention do to the answer?' and options = '["It halves the 10.0000 percent discount rate for the first producing year, which is how the payback of 3.8273 years comes to fall between two whole years.", "It treats a year of production as arriving in the middle of the year, which is closer to how a field earns and gives a slightly higher present value than year end discounting on the same cash flow.", "It moves half of each year''s capex into the year before it is spent, so the deepest cash position of -2250.0000 million USD arrives one period earlier.", "It applies the 10.0000 percent rate at the middle of the 20.0000 year life rather than year by year, so a single factor prices the whole profile at once."]'::jsonb and answer_index = 1 and explanation = 'It is a timing convention on the same cash flow, and the NPV of 2015.4123 million USD carries it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The screening tier discounts mid year. What does that convention do to the answer?', options = '["It halves the 10.0000 percent discount rate for the first producing year, which is how the payback of 3.8273 years comes to fall between two whole years.", "It treats a year of production as arriving in the middle of the year, which is closer to how a field earns and gives a slightly higher present value than year end discounting on the same cash flow.", "It moves half of each year''s capex into the year before it is spent, so the deepest cash position of -2250.0000 million USD arrives one period earlier.", "It applies the 10.0000 percent rate at the middle of the 20.0000 year life rather than year by year, so a single factor prices the whole profile at once."]'::jsonb, explanation = 'It is a timing convention on the same cash flow, and the NPV of 2015.4123 million USD carries it.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 9: prompt, option_0, option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the EGINA Base case royalty takes 2011.8812 and tax 3310.0565 million USD. The studio reports 0.330657 alongside them. What is that ratio?' and options = '["Government take of 5321.9377 million USD over the net cash flow the concept generates once its capex of 2250.0000 million USD and its operating cost have been taken out of revenue.", "Government take of 5321.9377 million USD over gross revenue of 16095.0492 million USD, royalty and tax added before any cost is taken out.", "The share of the NPV of 2047.5653 million USD that royalty and tax removed before the remainder was discounted at 10.0000 percent.", "The effective rate on profit, which is the 30.0000 percent tax lifted by the royalty charged ahead of it on the same barrels."]'::jsonb and answer_index = 1 and explanation = 'Capex of 2250.0000 and operating cost of 3049.6464 million USD sit outside that ratio: it is take over gross revenue and nothing else.' then 'old'
           when prompt = 'On the EGINA Base case royalty takes 2011.8812 and tax 3276.9239 million USD. The studio reports 0.328598 alongside them. What is that ratio?' and options = '["Government take of 5288.8051 million USD over the net cash flow the concept generates once its capex of 2250.0000 million USD and its operating cost have been taken out of revenue.", "Government take of 5288.8051 million USD over gross revenue of 16095.0492 million USD, royalty and tax added before any cost is taken out.", "The share of the NPV of 2015.4123 million USD that royalty and tax removed before the remainder was discounted at 10.0000 percent.", "The effective rate on profit, which is the 30.0000 percent tax lifted by the royalty charged ahead of it on the same barrels."]'::jsonb and answer_index = 1 and explanation = 'Capex of 2250.0000 and operating cost of 3049.6464 million USD sit outside that ratio: it is take over gross revenue and nothing else.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 9;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the EGINA Base case royalty takes 2011.8812 and tax 3276.9239 million USD. The studio reports 0.328598 alongside them. What is that ratio?', options = '["Government take of 5288.8051 million USD over the net cash flow the concept generates once its capex of 2250.0000 million USD and its operating cost have been taken out of revenue.", "Government take of 5288.8051 million USD over gross revenue of 16095.0492 million USD, royalty and tax added before any cost is taken out.", "The share of the NPV of 2015.4123 million USD that royalty and tax removed before the remainder was discounted at 10.0000 percent.", "The effective rate on profit, which is the 30.0000 percent tax lifted by the royalty charged ahead of it on the same barrels."]'::jsonb, explanation = 'Capex of 2250.0000 and operating cost of 3049.6464 million USD sit outside that ratio: it is take over gross revenue and nothing else.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 10: option_2
  select case
           when prompt = 'The EGINA Base case never gets deeper than -2250.0000 million USD. Which year is that, and why that figure?' and options = '["The payback year 3.8273 years in, where the cumulative position finally turns and the capex has just been recovered out of the producing years.", "The last year of the 20.0000 year life, where the decommissioning provision of 260.0000 million USD is charged against a profile that has declined to its lowest rate.", "The stress case at 18.0000 USD a barrel, where the same concept is worth -1797.2732 million USD and the cash position is at its lowest point in the plan.", "Year 0, which carries the capex and no production."]'::jsonb and answer_index = 3 and explanation = 'The whole 2250.0000 million USD of capex is spent before the first barrel is sold, so the deepest point is the year before revenue starts.' then 'old'
           when prompt = 'The EGINA Base case never gets deeper than -2250.0000 million USD. Which year is that, and why that figure?' and options = '["The payback year 3.8273 years in, where the cumulative position finally turns and the capex has just been recovered out of the producing years.", "The last year of the 20.0000 year life, where the decommissioning provision of 260.0000 million USD is charged against a profile that has declined to its lowest rate.", "The stress case at 18.0000 USD a barrel, where the same concept is worth -1834.1220 million USD and the cash position is at its lowest point in the plan.", "Year 0, which carries the capex and no production."]'::jsonb and answer_index = 3 and explanation = 'The whole 2250.0000 million USD of capex is spent before the first barrel is sold, so the deepest point is the year before revenue starts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The EGINA Base case never gets deeper than -2250.0000 million USD. Which year is that, and why that figure?', options = '["The payback year 3.8273 years in, where the cumulative position finally turns and the capex has just been recovered out of the producing years.", "The last year of the 20.0000 year life, where the decommissioning provision of 260.0000 million USD is charged against a profile that has declined to its lowest rate.", "The stress case at 18.0000 USD a barrel, where the same concept is worth -1834.1220 million USD and the cash position is at its lowest point in the plan.", "Year 0, which carries the capex and no production."]'::jsonb, explanation = 'The whole 2250.0000 million USD of capex is spent before the first barrel is sold, so the deepest point is the year before revenue starts.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 11: prompt, option_3
  select case
           when prompt = 'A scenario priced at zero returns an NPV of -3517.4133 million USD, and a scenario with a blank oil price returns nothing at all. What separates them?' and options = '["Zero is a number somebody entered, so the tier prices it, while a blank is a gap and the engine answers \"the scenario oil price is missing\" instead of deciding it.", "A blank is read as zero and then rejected for producing a negative value, since the engine declines any case worth less than the capex it carries.", "The engine puts its default oil price of 70.0000 USD a barrel behind a blank and reports the substitution, so no separate figure is returned.", "A price of zero skips royalty and tax, so the -3517.4133 million USD is capex and operating cost alone and a blank has no such shortcut."]'::jsonb and answer_index = 0 and explanation = 'The difference between those two cases is the difference between a decision and a gap, and the engine will not make the second one for you.' then 'old'
           when prompt = 'A scenario priced at zero returns an NPV of -3554.2621 million USD, and a scenario with a blank oil price returns nothing at all. What separates them?' and options = '["Zero is a number somebody entered, so the tier prices it, while a blank is a gap and the engine answers \"the scenario oil price is missing\" instead of deciding it.", "A blank is read as zero and then rejected for producing a negative value, since the engine declines any case worth less than the capex it carries.", "The engine puts its default oil price of 70.0000 USD a barrel behind a blank and reports the substitution, so no separate figure is returned.", "A price of zero skips royalty and tax, so the -3554.2621 million USD is capex and operating cost alone and a blank has no such shortcut."]'::jsonb and answer_index = 0 and explanation = 'The difference between those two cases is the difference between a decision and a gap, and the engine will not make the second one for you.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A scenario priced at zero returns an NPV of -3554.2621 million USD, and a scenario with a blank oil price returns nothing at all. What separates them?', options = '["Zero is a number somebody entered, so the tier prices it, while a blank is a gap and the engine answers \"the scenario oil price is missing\" instead of deciding it.", "A blank is read as zero and then rejected for producing a negative value, since the engine declines any case worth less than the capex it carries.", "The engine puts its default oil price of 70.0000 USD a barrel behind a blank and reports the substitution, so no separate figure is returned.", "A price of zero skips royalty and tax, so the -3554.2621 million USD is capex and operating cost alone and a blank has no such shortcut."]'::jsonb, explanation = 'The difference between those two cases is the difference between a decision and a gap, and the engine will not make the second one for you.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m01 ord 13: option_1
  select case
           when prompt = 'Before the repair that preceded this course, a concept with no capex, no operating cost and no peak rate, priced by a scenario with no oil price, still returned a full set of screening economics. What was wrong with that output?' and options = '["It was rounded to four decimals from values the engine held at full precision, so the NPV, the IRR and the payback disagreed with one another by small amounts.", "It was run on the other concept in the plan, the subsea tie-back, so the value of 1048.6281 million USD came back under the FPSO concept''s name instead.", "It carried a warning about the missing inputs which the studio printed in green, and readers took that green for a pass rather than for the notice it was.", "It was arithmetic on four figures the reader never saw."]'::jsonb and answer_index = 3 and explanation = 'The engine now stops instead and names the field: "the concept carries no capex: enter a drilling, facilities or subsea capex".' then 'old'
           when prompt = 'Before the repair that preceded this course, a concept with no capex, no operating cost and no peak rate, priced by a scenario with no oil price, still returned a full set of screening economics. What was wrong with that output?' and options = '["It was rounded to four decimals from values the engine held at full precision, so the NPV, the IRR and the payback disagreed with one another by small amounts.", "It was run on the other concept in the plan, the subsea tie-back, so the value of 1013.7182 million USD came back under the FPSO concept''s name instead.", "It carried a warning about the missing inputs which the studio printed in green, and readers took that green for a pass rather than for the notice it was.", "It was arithmetic on four figures the reader never saw."]'::jsonb and answer_index = 3 and explanation = 'The engine now stops instead and names the field: "the concept carries no capex: enter a drilling, facilities or subsea capex".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m01 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m01 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Before the repair that preceded this course, a concept with no capex, no operating cost and no peak rate, priced by a scenario with no oil price, still returned a full set of screening economics. What was wrong with that output?', options = '["It was rounded to four decimals from values the engine held at full precision, so the NPV, the IRR and the payback disagreed with one another by small amounts.", "It was run on the other concept in the plan, the subsea tie-back, so the value of 1013.7182 million USD came back under the FPSO concept''s name instead.", "It carried a warning about the missing inputs which the studio printed in green, and readers took that green for a pass rather than for the notice it was.", "It was arithmetic on four figures the reader never saw."]'::jsonb, explanation = 'The engine now stops instead and names the field: "the concept carries no capex: enter a drilling, facilities or subsea capex".'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-plan-holds' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m01 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m02 ord 11: option_1
  select case
           when prompt = 'Which figure in the EGINA plan may carry a P90 label?' and options = '["The capex of 2250.0000 million USD, whose own uncertainty is written in the same percentile language the reserves rows use.", "The NPV of 2047.5653 million USD, since the uncertainty in the reserves is carried through the case into the value it returns.", "The recovery factor of 0.340000, which is a percentile of the range of factors that reservoir could turn out to deliver.", "The oil reserves low case of 80.0000 MMbbl."]'::jsonb and answer_index = 3 and explanation = 'P-labels belong to a reserves distribution and to one fluid at a time; a capex carries uncertainty and that uncertainty is written in P-labels nowhere in this studio.' then 'old'
           when prompt = 'Which figure in the EGINA plan may carry a P90 label?' and options = '["The capex of 2250.0000 million USD, whose own uncertainty is written in the same percentile language the reserves rows use.", "The NPV of 2015.4123 million USD, since the uncertainty in the reserves is carried through the case into the value it returns.", "The recovery factor of 0.340000, which is a percentile of the range of factors that reservoir could turn out to deliver.", "The oil reserves low case of 80.0000 MMbbl."]'::jsonb and answer_index = 3 and explanation = 'P-labels belong to a reserves distribution and to one fluid at a time; a capex carries uncertainty and that uncertainty is written in P-labels nowhere in this studio.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-reserves-per-fluid' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m02 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m02 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which figure in the EGINA plan may carry a P90 label?', options = '["The capex of 2250.0000 million USD, whose own uncertainty is written in the same percentile language the reserves rows use.", "The NPV of 2015.4123 million USD, since the uncertainty in the reserves is carried through the case into the value it returns.", "The recovery factor of 0.340000, which is a percentile of the range of factors that reservoir could turn out to deliver.", "The oil reserves low case of 80.0000 MMbbl."]'::jsonb, explanation = 'P-labels belong to a reserves distribution and to one fluid at a time; a capex carries uncertainty and that uncertainty is written in P-labels nowhere in this studio.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-reserves-per-fluid' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m02 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m03 ord 10: explanation
  select case
           when prompt = 'The lifecycle totals are 4150.0000 million USD for the FPSO and 1330.0000 for the tie-back. What can that pair of figures not do?' and options = '["Say how much cash each concept consumes in total, which needs a year by year profile rather than a plain sum of two cost lines.", "Show which concept commits more capital, since the operating cost of 1900.0000 million USD dominates the FPSO''s own total.", "Be set against each other at all, since the two concepts run for different lives of 20.0000 years and 15.0000 years.", "Rank the two concepts by value."]'::jsonb and answer_index = 3 and explanation = 'A lifecycle cost is money as it is spent, with no discounting, no price, no royalty and no tax in it, and the ordering by value comes from the NPVs of 2047.5653 and 1048.6281 million USD.' then 'old'
           when prompt = 'The lifecycle totals are 4150.0000 million USD for the FPSO and 1330.0000 for the tie-back. What can that pair of figures not do?' and options = '["Say how much cash each concept consumes in total, which needs a year by year profile rather than a plain sum of two cost lines.", "Show which concept commits more capital, since the operating cost of 1900.0000 million USD dominates the FPSO''s own total.", "Be set against each other at all, since the two concepts run for different lives of 20.0000 years and 15.0000 years.", "Rank the two concepts by value."]'::jsonb and answer_index = 3 and explanation = 'A lifecycle cost is money as it is spent, with no discounting, no price, no royalty and no tax in it, and the ordering by value comes from the NPVs of 2015.4123 and 1013.7182 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-concepts-and-their-capex' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m03 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m03 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The lifecycle totals are 4150.0000 million USD for the FPSO and 1330.0000 for the tie-back. What can that pair of figures not do?', options = '["Say how much cash each concept consumes in total, which needs a year by year profile rather than a plain sum of two cost lines.", "Show which concept commits more capital, since the operating cost of 1900.0000 million USD dominates the FPSO''s own total.", "Be set against each other at all, since the two concepts run for different lives of 20.0000 years and 15.0000 years.", "Rank the two concepts by value."]'::jsonb, explanation = 'A lifecycle cost is money as it is spent, with no discounting, no price, no royalty and no tax in it, and the ordering by value comes from the NPVs of 2015.4123 and 1013.7182 million USD.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-concepts-and-their-capex' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m03 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m03 ord 11: explanation, option_3
  select case
           when prompt = 'The EGINA cost breakdown carries a decommissioning provision of 260.0000 million USD typed as ABEX. Where does it sit inside the concept''s lifecycle of 4150.0000 million USD?' and options = '["In the operating cost of 1900.0000 million USD, spread across the 20.0000 years the concept is expected to run for.", "In the capex of 2250.0000 million USD, since a provision is committed at sanction with the rest.", "Nowhere: the engine''s totals are CAPEX 2250.0000 and OPEX 95.0000 a year, and an ABEX line is in neither of them.", "In the final year of the profile, where the Base case charges it against a declining revenue."]'::jsonb and answer_index = 2 and explanation = 'Facilities carry their own estimate of the same thing, 204.5029 million USD for the Egina FPSO, so two real figures for the end of life sit outside the 4150.0000.' then 'old'
           when prompt = 'The EGINA cost breakdown carries a decommissioning provision of 260.0000 million USD typed as ABEX. Where does it sit inside the concept''s lifecycle of 4150.0000 million USD?' and options = '["In the operating cost of 1900.0000 million USD, spread across the 20.0000 years the concept is expected to run for.", "In the capex of 2250.0000 million USD, since a provision is committed at sanction with the rest.", "Nowhere: the engine''s totals are CAPEX 2250.0000 and OPEX 95.0000 a year, and an ABEX line is in neither of them.", "In the lifecycle once the facility''s own decommissioning estimate of 204.5029 is added to it, which is how 4150.0000 covers the end of the field''s life."]'::jsonb and answer_index = 2 and explanation = 'Facilities carry their own estimate of the same thing, 204.5029 million USD for the Egina FPSO, so two figures for the end of life sit outside the 4150.0000, and the case charges the plan''s own line in production year 20.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-concepts-and-their-capex' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m03 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m03 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The EGINA cost breakdown carries a decommissioning provision of 260.0000 million USD typed as ABEX. Where does it sit inside the concept''s lifecycle of 4150.0000 million USD?', options = '["In the operating cost of 1900.0000 million USD, spread across the 20.0000 years the concept is expected to run for.", "In the capex of 2250.0000 million USD, since a provision is committed at sanction with the rest.", "Nowhere: the engine''s totals are CAPEX 2250.0000 and OPEX 95.0000 a year, and an ABEX line is in neither of them.", "In the lifecycle once the facility''s own decommissioning estimate of 204.5029 is added to it, which is how 4150.0000 covers the end of the field''s life."]'::jsonb, explanation = 'Facilities carry their own estimate of the same thing, 204.5029 million USD for the Egina FPSO, so two figures for the end of life sit outside the 4150.0000, and the case charges the plan''s own line in production year 20.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-concepts-and-their-capex' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m03 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 1: prompt, explanation
  select case
           when prompt = 'The same FPSO concept returns an NPV of -161.0098 million USD at 40.0000 USD a barrel and 3151.8529 at 85.0000 USD a barrel. What differs between those two runs?' and options = '["The peak rate, because the engine trims the plateau of 60.0000 kbpd when a price cannot support it, so the cheaper run lifts fewer barrels as well.", "The discount rate, because a run priced at 40.0000 is discounted above the default 10.0000 percent.", "Only the price at the head of each run: the capex of 2250.0000, the 20 year shape and the fiscal terms are identical.", "The fiscal terms, because the royalty of 12.5000 percent is charged only once a case can pay it."]'::jsonb and answer_index = 2 and explanation = 'Four evenly spaced prices give -161.0098, 943.2778, 2047.5653 and 3151.8529, and the value steps up by the same amount each time because only what a barrel earns moves.' then 'old'
           when prompt = 'The same FPSO concept returns an NPV of -197.2391 million USD at 40.0000 USD a barrel and 3121.7380 at 85.0000 USD a barrel. What differs between those two runs?' and options = '["The peak rate, because the engine trims the plateau of 60.0000 kbpd when a price cannot support it, so the cheaper run lifts fewer barrels as well.", "The discount rate, because a run priced at 40.0000 is discounted above the default 10.0000 percent.", "Only the price at the head of each run: the capex of 2250.0000, the 20 year shape and the fiscal terms are identical.", "The fiscal terms, because the royalty of 12.5000 percent is charged only once a case can pay it."]'::jsonb and answer_index = 2 and explanation = 'Four evenly spaced prices give -197.2391, 909.0866, 2015.4123 and 3121.7380, and the value steps up by the same amount each time because only what a barrel earns moves.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 1;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The same FPSO concept returns an NPV of -197.2391 million USD at 40.0000 USD a barrel and 3121.7380 at 85.0000 USD a barrel. What differs between those two runs?', options = '["The peak rate, because the engine trims the plateau of 60.0000 kbpd when a price cannot support it, so the cheaper run lifts fewer barrels as well.", "The discount rate, because a run priced at 40.0000 is discounted above the default 10.0000 percent.", "Only the price at the head of each run: the capex of 2250.0000, the 20 year shape and the fiscal terms are identical.", "The fiscal terms, because the royalty of 12.5000 percent is charged only once a case can pay it."]'::jsonb, explanation = 'Four evenly spaced prices give -197.2391, 909.0866, 2015.4123 and 3121.7380, and the value steps up by the same amount each time because only what a barrel earns moves.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 2: prompt, explanation, option_1, option_3
  select case
           when prompt = 'A scenario priced at 0 returns an NPV of -3517.4133 million USD, while a scenario whose price box is left empty returns no value at all. What separates the two inputs?' and options = '["A typed zero is a number somebody chose, so the engine answers it; a blank is refused by name with the message that the scenario oil price is missing.", "Nothing in the inputs, because a blank reads as zero and both runs land on -3517.4133, with the missing price only noted.", "The sign of the entry, because zero is inside the accepted band while a blank reads as a negative price and is stopped as one.", "The default, because a blank price falls back to the 70.0000 USD a barrel the studio substitutes and quietly returns the Base value of 2047.5653."]'::jsonb and answer_index = 0 and explanation = 'Zero is accepted and returns -3517.4133; the silent substitution of 70.0000 USD a barrel ended in September 2026, and a missing price is now refused by name.' then 'old'
           when prompt = 'A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a scenario whose price box is left empty returns no value at all. What separates the two inputs?' and options = '["A typed zero is a number somebody chose, so the engine answers it; a blank is refused by name with the message that the scenario oil price is missing.", "Nothing in the inputs, because a blank reads as zero and both runs land on -3554.2621, with the missing price only noted.", "The sign of the entry, because zero is inside the accepted band while a blank reads as a negative price and is stopped as one.", "The default, because a blank price falls back to the 70.0000 USD a barrel the studio substitutes and quietly returns the Base value of 2015.4123."]'::jsonb and answer_index = 0 and explanation = 'Zero is accepted and returns -3554.2621; the silent substitution of 70.0000 USD a barrel ended in September 2026, and a missing price is now refused by name.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a scenario whose price box is left empty returns no value at all. What separates the two inputs?', options = '["A typed zero is a number somebody chose, so the engine answers it; a blank is refused by name with the message that the scenario oil price is missing.", "Nothing in the inputs, because a blank reads as zero and both runs land on -3554.2621, with the missing price only noted.", "The sign of the entry, because zero is inside the accepted band while a blank reads as a negative price and is stopped as one.", "The default, because a blank price falls back to the 70.0000 USD a barrel the studio substitutes and quietly returns the Base value of 2015.4123."]'::jsonb, explanation = 'Zero is accepted and returns -3554.2621; the silent substitution of 70.0000 USD a barrel ended in September 2026, and a missing price is now refused by name.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 3: prompt, option_0
  select case
           when prompt = 'The Stress scenario at 18.0000 USD a barrel reports an NPV of -1797.2732, an IRR status of no-root and a payback of never. What does that payback state?' and options = '["That payback falls in the last year of the 20.0000 year life, since a case ending at -1797.2732 has recovered all but that part of its capex of 2250.0000.", "That payback could not be computed because the rate of return has status no-root, and the engine withholds both figures whenever either one of them fails.", "That the capex of 2250.0000 is recovered exactly at the end of the profile, so the crossing sits on the last of the 21 rows the case carries.", "That the cumulative cash position never crosses zero, so a refusal is reported in place of a number."]'::jsonb and answer_index = 3 and explanation = 'The cumulative opens at -2250.0000 and never climbs out at that price; 5.7734 years at 48.0000 USD a barrel and never at 18.0000 are answers of the same kind, one measured and one refused.' then 'old'
           when prompt = 'The Stress scenario at 18.0000 USD a barrel reports an NPV of -1834.1220, an IRR status of no-root and a payback of never. What does that payback state?' and options = '["That payback falls in the last year of the 20.0000 year life, since a case ending at -1834.1220 has recovered all but that part of its capex of 2250.0000.", "That payback could not be computed because the rate of return has status no-root, and the engine withholds both figures whenever either one of them fails.", "That the capex of 2250.0000 is recovered exactly at the end of the profile, so the crossing sits on the last of the 21 rows the case carries.", "That the cumulative cash position never crosses zero, so a refusal is reported in place of a number."]'::jsonb and answer_index = 3 and explanation = 'The cumulative opens at -2250.0000 and never climbs out at that price; 5.7734 years at 48.0000 USD a barrel and never at 18.0000 are answers of the same kind, one measured and one refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 3;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Stress scenario at 18.0000 USD a barrel reports an NPV of -1834.1220, an IRR status of no-root and a payback of never. What does that payback state?', options = '["That payback falls in the last year of the 20.0000 year life, since a case ending at -1834.1220 has recovered all but that part of its capex of 2250.0000.", "That payback could not be computed because the rate of return has status no-root, and the engine withholds both figures whenever either one of them fails.", "That the capex of 2250.0000 is recovered exactly at the end of the profile, so the crossing sits on the last of the 21 rows the case carries.", "That the cumulative cash position never crosses zero, so a refusal is reported in place of a number."]'::jsonb, explanation = 'The cumulative opens at -2250.0000 and never climbs out at that price; 5.7734 years at 48.0000 USD a barrel and never at 18.0000 are answers of the same kind, one measured and one refused.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 4: prompt, explanation, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Base case takes 2011.8812 of royalty and 3310.0565 of tax out of gross revenue of 16095.0492. A reader quotes the tax alone as what the state receives. What has that reader left out?' and options = '["Nothing of the state''s money, because royalty is charged to the operator''s own account beside the operating cost of 3049.6464 and never enters the government take.", "The royalty of 2011.8812, so the state''s 5321.9377, which is 0.330657 of gross revenue, is understated by that whole line.", "The capex of 2250.0000, which is recovered from the state before tax is charged.", "The discounting, because the take of 5321.9377 is a present value while the tax is money of the day."]'::jsonb and answer_index = 1 and explanation = 'Government take is royalty plus tax, 5321.9377 against gross revenue of 16095.0492, which is a share of 0.330657.' then 'old'
           when prompt = 'The Base case takes 2011.8812 of royalty and 3276.9239 of tax out of gross revenue of 16095.0492. A reader quotes the tax alone as what the state receives. What has that reader left out?' and options = '["Nothing of the state''s money, because royalty is charged to the operator''s own account beside the operating cost of 3049.6464 and never enters the government take.", "The royalty of 2011.8812, so the state''s 5288.8051, which is 0.328598 of gross revenue, is understated by that whole line.", "The capex of 2250.0000, which is recovered from the state before tax is charged.", "The discounting, because the take of 5288.8051 is a present value while the tax is money of the day."]'::jsonb and answer_index = 1 and explanation = 'Government take is royalty plus tax, 5288.8051 against gross revenue of 16095.0492, which is a share of 0.328598.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 4;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case takes 2011.8812 of royalty and 3276.9239 of tax out of gross revenue of 16095.0492. A reader quotes the tax alone as what the state receives. What has that reader left out?', options = '["Nothing of the state''s money, because royalty is charged to the operator''s own account beside the operating cost of 3049.6464 and never enters the government take.", "The royalty of 2011.8812, so the state''s 5288.8051, which is 0.328598 of gross revenue, is understated by that whole line.", "The capex of 2250.0000, which is recovered from the state before tax is charged.", "The discounting, because the take of 5288.8051 is a present value while the tax is money of the day."]'::jsonb, explanation = 'Government take is royalty plus tax, 5288.8051 against gross revenue of 16095.0492, which is a share of 0.328598.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 8: option_0
  select case
           when prompt = 'The Base case reports a deepest cash position of -2250.0000 million USD. What is that figure?' and options = '["The loss the case carries to the end of its life, which the NPV of 2047.5653 states once the discount of 10.0000 percent has been applied to it.", "The part of the capex still outstanding after the plateau, since years 1 to 3 each return 795.8125 of net cash flow against a spend of 2250.0000.", "The cumulative position at the end of the 21 rows, once the decline has run down to 10.0063 kbpd and the field stops earning.", "The furthest the plan is ever out of pocket, reached at year 0 and closed by year 3."]'::jsonb and answer_index = 3 and explanation = 'The cumulative opens at -2250.0000 and stands at 137.4375 after year 3, so the deepest position is a moment in the case and not its result.' then 'old'
           when prompt = 'The Base case reports a deepest cash position of -2250.0000 million USD. What is that figure?' and options = '["The loss the case carries to the end of its life, which the NPV of 2015.4123 states once the discount of 10.0000 percent has been applied to it.", "The part of the capex still outstanding after the plateau, since years 1 to 3 each return 795.8125 of net cash flow against a spend of 2250.0000.", "The cumulative position at the end of the 21 rows, once the decline has run down to 10.0063 kbpd and the field stops earning.", "The furthest the plan is ever out of pocket, reached at year 0 and closed by year 3."]'::jsonb and answer_index = 3 and explanation = 'The cumulative opens at -2250.0000 and stands at 137.4375 after year 3, so the deepest position is a moment in the case and not its result.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case reports a deepest cash position of -2250.0000 million USD. What is that figure?', options = '["The loss the case carries to the end of its life, which the NPV of 2015.4123 states once the discount of 10.0000 percent has been applied to it.", "The part of the capex still outstanding after the plateau, since years 1 to 3 each return 795.8125 of net cash flow against a spend of 2250.0000.", "The cumulative position at the end of the 21 rows, once the decline has run down to 10.0063 kbpd and the field stops earning.", "The furthest the plan is ever out of pocket, reached at year 0 and closed by year 3."]'::jsonb, explanation = 'The cumulative opens at -2250.0000 and stands at 137.4375 after year 3, so the deepest position is a moment in the case and not its result.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 10: explanation, option_0, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Year 4 of the Base case earns 709.5812, year 5 earns 631.9731, and the decline runs on to the end of the 21 rows. How much of that money reaches the payback figure of 3.8273 years?' and options = '["All of it, because payback is measured on the same discounted flow as the NPV of 2047.5653 and therefore reads the whole of the life.", "None of it, because payback stops at the crossing, while the NPV of 2047.5653 counts every one of the 21 rows.", "Year 4 alone, because the crossing at 3.8273 years counts the rest of that year.", "The money earned before the decline begins, so 709.5812 counts and the later rows do not."]'::jsonb and answer_index = 1 and explanation = 'Two cases with the same payback can hold quite different money after the crossing, and only a value figure such as 2047.5653 can tell them apart.' then 'old'
           when prompt = 'Year 4 of the Base case earns 709.5812, year 5 earns 631.9731, and the decline runs on to the end of the 21 rows. How much of that money reaches the payback figure of 3.8273 years?' and options = '["All of it, because payback is measured on the same discounted flow as the NPV of 2015.4123 and therefore reads the whole of the life.", "None of it, because payback stops at the crossing, while the NPV of 2015.4123 counts every one of the 21 rows.", "Year 4 alone, because the crossing at 3.8273 years counts the rest of that year.", "The money earned before the decline begins, so 709.5812 counts and the later rows do not."]'::jsonb and answer_index = 1 and explanation = 'Two cases with the same payback can hold quite different money after the crossing, and only a value figure such as 2015.4123 can tell them apart.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Year 4 of the Base case earns 709.5812, year 5 earns 631.9731, and the decline runs on to the end of the 21 rows. How much of that money reaches the payback figure of 3.8273 years?', options = '["All of it, because payback is measured on the same discounted flow as the NPV of 2015.4123 and therefore reads the whole of the life.", "None of it, because payback stops at the crossing, while the NPV of 2015.4123 counts every one of the 21 rows.", "Year 4 alone, because the crossing at 3.8273 years counts the rest of that year.", "The money earned before the decline begins, so 709.5812 counts and the later rows do not."]'::jsonb, explanation = 'Two cases with the same payback can hold quite different money after the crossing, and only a value figure such as 2015.4123 can tell them apart.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 11: explanation, option_0, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The tie-back pays back in 3.2035 years and the FPSO in 3.8273 years at the same 70.0000 USD a barrel. What does a reader who ranks the two on payback alone give up?' and options = '["The larger value, because the quicker concept is worth 1048.6281 against the FPSO''s 2047.5653 at that price.", "Nothing measurable, because the tie-back also carries the higher rate of return at 40.4321 percent against 29.5998, so every measure agrees with it.", "The lower capex, because a payback ranking selects the FPSO''s spend of 2250.0000 over the tie-back''s 730.0000, which is the harder of the two to fund.", "The longer life, because a ranking on payback prefers 20.0000 years to 15.0000."]'::jsonb and answer_index = 0 and explanation = 'The quicker concept is the smaller one, 1048.6281 against 2047.5653 at one price, so a payback ranking puts the smaller value first.' then 'old'
           when prompt = 'The tie-back pays back in 3.2035 years and the FPSO in 3.8273 years at the same 70.0000 USD a barrel. What does a reader who ranks the two on payback alone give up?' and options = '["The larger value, because the quicker concept is worth 1013.7182 against the FPSO''s 2015.4123 at that price.", "Nothing measurable, because the tie-back also carries the higher of the two rates that zero its flow, 40.4136 against 29.5779, so every measure agrees with it.", "The lower capex, because a payback ranking selects the FPSO''s spend of 2250.0000 over the tie-back''s 730.0000, which is the harder of the two to fund.", "The longer life, because a ranking on payback prefers 20.0000 years to 15.0000."]'::jsonb and answer_index = 0 and explanation = 'The quicker concept is the smaller one, 1013.7182 against 2015.4123 at one price, so a payback ranking puts the smaller value first.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The tie-back pays back in 3.2035 years and the FPSO in 3.8273 years at the same 70.0000 USD a barrel. What does a reader who ranks the two on payback alone give up?', options = '["The larger value, because the quicker concept is worth 1013.7182 against the FPSO''s 2015.4123 at that price.", "Nothing measurable, because the tie-back also carries the higher of the two rates that zero its flow, 40.4136 against 29.5779, so every measure agrees with it.", "The lower capex, because a payback ranking selects the FPSO''s spend of 2250.0000 over the tie-back''s 730.0000, which is the harder of the two to fund.", "The longer life, because a ranking on payback prefers 20.0000 years to 15.0000."]'::jsonb, explanation = 'The quicker concept is the smaller one, 1013.7182 against 2015.4123 at one price, so a payback ranking puts the smaller value first.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 12: prompt, explanation, option_1, option_2
  select case
           when prompt = 'At 70.0000 USD a barrel the tie-back returns 1.436477 per million USD of capex and the FPSO returns 0.910029. What does that pair of ratios not say?' and options = '["Which of the two spends less, because the ratio is built on the capex of 730.0000 and 2250.0000 and reports the cheaper concept as the higher figure.", "Which concept the studio selects, because a ratio above one marks a development the engine passes and 0.910029 marks one it holds back.", "How the two would rank on their rates of return, because the ratio is the rate of 40.4321 percent restated for each million USD of capex.", "How much value each concept leaves in total, because a ratio has no size in it."]'::jsonb and answer_index = 3 and explanation = 'On a budget that can carry 2250.0000 the FPSO leaves 2047.5653 where the tie-back leaves 1048.6281, and the ratio of 1.436477 says nothing about that gap.' then 'old'
           when prompt = 'At 70.0000 USD a barrel the tie-back returns 1.388655 per million USD of capex and the FPSO returns 0.895739. What does that pair of ratios not say?' and options = '["Which of the two spends less, because the ratio is built on the capex of 730.0000 and 2250.0000 and reports the cheaper concept as the higher figure.", "Which concept the studio selects, because a ratio above one marks a development the engine passes and 0.895739 marks one it holds back.", "How the two would rank on the rates that zero their flows, because the ratio is one of those rates restated for each million USD of capex.", "How much value each concept leaves in total, because a ratio has no size in it."]'::jsonb and answer_index = 3 and explanation = 'On a budget that can carry 2250.0000 the FPSO leaves 2015.4123 where the tie-back leaves 1013.7182, and the ratio of 1.388655 says nothing about that gap.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 12;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 70.0000 USD a barrel the tie-back returns 1.388655 per million USD of capex and the FPSO returns 0.895739. What does that pair of ratios not say?', options = '["Which of the two spends less, because the ratio is built on the capex of 730.0000 and 2250.0000 and reports the cheaper concept as the higher figure.", "Which concept the studio selects, because a ratio above one marks a development the engine passes and 0.895739 marks one it holds back.", "How the two would rank on the rates that zero their flows, because the ratio is one of those rates restated for each million USD of capex.", "How much value each concept leaves in total, because a ratio has no size in it."]'::jsonb, explanation = 'On a budget that can carry 2250.0000 the FPSO leaves 2015.4123 where the tie-back leaves 1013.7182, and the ratio of 1.388655 says nothing about that gap.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 13: option_3
  select case
           when prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD and the tie-back''s is 1330.0000. What is each figure made of?' and options = '["Capex of 2250.0000 with the decommissioning provision of 260.0000 and the 3049.6464 of operating cost the Base case charges across its life.", "Capex of 2250.0000 with 1900.0000 of operating cost over 20.0000 years, against 730.0000 with 600.0000 over 15.0000 years.", "The capex each concept carries grossed up by the royalty of 12.5000 percent and the tax of 30.0000 percent.", "The capex each concept asks for added to the value it earns, 2047.5653 on 2250.0000."]'::jsonb and answer_index = 1 and explanation = 'Lifecycle is capex plus operating cost over the concept''s own life, so 2250.0000 and 1900.0000 give 4150.0000, and 730.0000 and 600.0000 give 1330.0000.' then 'old'
           when prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD and the tie-back''s is 1330.0000. What is each figure made of?' and options = '["Capex of 2250.0000 with the decommissioning provision of 260.0000 and the 3049.6464 of operating cost the Base case charges across its life.", "Capex of 2250.0000 with 1900.0000 of operating cost over 20.0000 years, against 730.0000 with 600.0000 over 15.0000 years.", "The capex each concept carries grossed up by the royalty of 12.5000 percent and the tax of 30.0000 percent.", "The capex each concept asks for added to the value it earns, 2015.4123 on 2250.0000."]'::jsonb and answer_index = 1 and explanation = 'Lifecycle is capex plus operating cost over the concept''s own life, so 2250.0000 and 1900.0000 give 4150.0000, and 730.0000 and 600.0000 give 1330.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD and the tie-back''s is 1330.0000. What is each figure made of?', options = '["Capex of 2250.0000 with the decommissioning provision of 260.0000 and the 3049.6464 of operating cost the Base case charges across its life.", "Capex of 2250.0000 with 1900.0000 of operating cost over 20.0000 years, against 730.0000 with 600.0000 over 15.0000 years.", "The capex each concept carries grossed up by the royalty of 12.5000 percent and the tax of 30.0000 percent.", "The capex each concept asks for added to the value it earns, 2015.4123 on 2250.0000."]'::jsonb, explanation = 'Lifecycle is capex plus operating cost over the concept''s own life, so 2250.0000 and 1900.0000 give 4150.0000, and 730.0000 and 600.0000 give 1330.0000.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m04 ord 15: prompt, explanation, option_1, option_2
  select case
           when prompt = 'The Base case reports 2047.5653 million USD at a discount rate of 10.0000 percent taken mid year. What does that figure state?' and options = '["What the case is worth against earning 10.0000 percent elsewhere, with the cash treated as arriving through each year.", "The cash the plan pays out, because the undiscounted total of the 21 rows comes to 2047.5653.", "What is left once the government take of 5321.9377 is paid, with the discount applied to the capex alone.", "The value at the end of the 20.0000 year life, carried forward at 10.0000 percent from year 0."]'::jsonb and answer_index = 0 and explanation = 'Nothing in a plan pays out 2047.5653: the figure is a comparison against a 10.0000 percent alternative, and mid year treatment puts the cash through the year rather than on its last day.' then 'old'
           when prompt = 'The Base case reports 2015.4123 million USD at a discount rate of 10.0000 percent taken mid year. What does that figure state?' and options = '["What the case is worth against earning 10.0000 percent elsewhere, with the cash treated as arriving through each year.", "The cash the plan pays out, because the undiscounted total of the 21 rows comes to 2015.4123.", "What is left once the government take of 5288.8051 is paid, with the discount applied to the capex alone.", "The value at the end of the 20.0000 year life, carried forward at 10.0000 percent from year 0."]'::jsonb and answer_index = 0 and explanation = 'Nothing in a plan pays out 2015.4123: the figure is a comparison against a 10.0000 percent alternative, and mid year treatment puts the cash through the year rather than on its last day.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m04 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m04 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case reports 2015.4123 million USD at a discount rate of 10.0000 percent taken mid year. What does that figure state?', options = '["What the case is worth against earning 10.0000 percent elsewhere, with the cash treated as arriving through each year.", "The cash the plan pays out, because the undiscounted total of the 21 rows comes to 2015.4123.", "What is left once the government take of 5288.8051 is paid, with the discount applied to the capex alone.", "The value at the end of the 20.0000 year life, carried forward at 10.0000 percent from year 0."]'::jsonb, explanation = 'Nothing in a plan pays out 2015.4123: the figure is a comparison against a 10.0000 percent alternative, and mid year treatment puts the cash through the year rather than on its last day.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-what-a-scenario-is-worth' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m04 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 1: explanation, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The engine reports CAPEX 2250.0000 and OPEX 95.0000 a year for a plan whose seven items total more than those two figures together. Which line reaches neither total?' and options = '["The mooring and installation line of 170.0000, which sits inside the Installation phase of 550.0000 rather than in the capex.", "The decommissioning provision of 260.0000, typed as ABEX, which is visible only in the Operate phase roll-up of 355.0000.", "The maintenance and integrity line of 23.0000, which is held outside the yearly total because it is charged on the barrels.", "The subsea system of 380.0000, which the concept already carries in a capex field of its own."]'::jsonb and answer_index = 1 and explanation = 'A screening case carries capex and operating cost only, so the ABEX line of 260.0000 is in neither the CAPEX total of 2250.0000 nor the OPEX total of 95.0000.' then 'old'
           when prompt = 'The engine reports CAPEX 2250.0000 and OPEX 95.0000 a year for a plan whose seven items total more than those two figures together. Which line reaches neither total?' and options = '["The mooring and installation line of 170.0000, which sits inside the Installation phase of 550.0000 rather than in the capex.", "The decommissioning provision of 260.0000, typed as ABEX, which shows in the Operate phase roll-up of 355.0000 and is charged in production year 20.", "The maintenance and integrity line of 23.0000, which is held outside the yearly total because it is charged on the barrels.", "The subsea system of 380.0000, which the concept already carries in a capex field of its own."]'::jsonb and answer_index = 1 and explanation = 'An ABEX line is neither development capex nor an annual operating cost, so the 260.0000 is in neither the CAPEX total of 2250.0000 nor the OPEX total of 95.0000, and the case charges it in production year 20.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 1;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The engine reports CAPEX 2250.0000 and OPEX 95.0000 a year for a plan whose seven items total more than those two figures together. Which line reaches neither total?', options = '["The mooring and installation line of 170.0000, which sits inside the Installation phase of 550.0000 rather than in the capex.", "The decommissioning provision of 260.0000, typed as ABEX, which shows in the Operate phase roll-up of 355.0000 and is charged in production year 20.", "The maintenance and integrity line of 23.0000, which is held outside the yearly total because it is charged on the barrels.", "The subsea system of 380.0000, which the concept already carries in a capex field of its own."]'::jsonb, explanation = 'An ABEX line is neither development capex nor an annual operating cost, so the 260.0000 is in neither the CAPEX total of 2250.0000 nor the OPEX total of 95.0000, and the case charges it in production year 20.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 5: explanation, option_0
  select case
           when prompt = 'A reviewer adds the decommissioning provision of 260.0000 to the capex to be conservative. What is wrong with the figure that results?' and options = '["The arithmetic holds, but the screening case then charges the provision twice, once inside the capex and once in the Operate phase roll-up of 355.0000.", "The provision would have to be grown to the end of the 20.0000 year life first.", "The engine refuses a capex it did not read from the cost items itself.", "It matches nothing: the engine reports CAPEX 2250.0000, and the new number agrees with no concept estimate."]'::jsonb and answer_index = 3 and explanation = 'Abandonment belongs in a tier that models it with a year and a fiscal treatment; in a screening case the capex is 2250.0000 and a hand altered figure reconciles against nothing.' then 'old'
           when prompt = 'A reviewer adds the decommissioning provision of 260.0000 to the capex to be conservative. What is wrong with the figure that results?' and options = '["The arithmetic holds, and the only cost of it is that the Operate phase roll-up of 355.0000 then counts the same line a second time.", "The provision would have to be grown to the end of the 20.0000 year life first.", "The engine refuses a capex it did not read from the cost items itself.", "It matches nothing: the engine reports CAPEX 2250.0000, and the new number agrees with no concept estimate."]'::jsonb and answer_index = 3 and explanation = 'The case already charges the 260.0000 in production year 20, where it is deductible; put in the capex it is charged twice and twenty years too early, and it reconciles against nothing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 5;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer adds the decommissioning provision of 260.0000 to the capex to be conservative. What is wrong with the figure that results?', options = '["The arithmetic holds, and the only cost of it is that the Operate phase roll-up of 355.0000 then counts the same line a second time.", "The provision would have to be grown to the end of the 20.0000 year life first.", "The engine refuses a capex it did not read from the cost items itself.", "It matches nothing: the engine reports CAPEX 2250.0000, and the new number agrees with no concept estimate."]'::jsonb, explanation = 'The case already charges the 260.0000 in production year 20, where it is deductible; put in the capex it is charged twice and twenty years too early, and it reconciles against nothing.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 8: prompt, explanation
  select case
           when prompt = 'A scenario priced at 0 returns an NPV of -3517.4133 million USD, while a deck missing one year''s price is refused outright. Why are the two treated differently?' and options = '["Zero sits inside the band of prices the engine accepts and a missing year sits outside it, in the way a price of -5 sits outside it.", "A zero priced barrel is valued at the default of 70.0000 USD a barrel, and the engine has no default to reach for when a year is absent.", "A typed zero is the question somebody asked; a missing year is a question nobody asked, and answering it invents the input and the output together.", "A scenario carries one price while a deck carries many, and the engine refuses any deck holding more than one price for a profile."]'::jsonb and answer_index = 2 and explanation = 'Zero is a number somebody chose and the engine owes them its answer of -3517.4133; the missing year gets a refusal in place of a price nobody supplied.' then 'old'
           when prompt = 'A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a deck missing one year''s price is refused outright. Why are the two treated differently?' and options = '["Zero sits inside the band of prices the engine accepts and a missing year sits outside it, in the way a price of -5 sits outside it.", "A zero priced barrel is valued at the default of 70.0000 USD a barrel, and the engine has no default to reach for when a year is absent.", "A typed zero is the question somebody asked; a missing year is a question nobody asked, and answering it invents the input and the output together.", "A scenario carries one price while a deck carries many, and the engine refuses any deck holding more than one price for a profile."]'::jsonb and answer_index = 2 and explanation = 'Zero is a number somebody chose and the engine owes them its answer of -3554.2621; the missing year gets a refusal in place of a price nobody supplied.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a deck missing one year''s price is refused outright. Why are the two treated differently?', options = '["Zero sits inside the band of prices the engine accepts and a missing year sits outside it, in the way a price of -5 sits outside it.", "A zero priced barrel is valued at the default of 70.0000 USD a barrel, and the engine has no default to reach for when a year is absent.", "A typed zero is the question somebody asked; a missing year is a question nobody asked, and answering it invents the input and the output together.", "A scenario carries one price while a deck carries many, and the engine refuses any deck holding more than one price for a profile."]'::jsonb, explanation = 'Zero is a number somebody chose and the engine owes them its answer of -3554.2621; the missing year gets a refusal in place of a price nobody supplied.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 10: option_0, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'How do the four drivers of the sweep rank by what each does to the value of the plan''s own case?' and options = '["Oil price at 3092.0051, production at 2839.5965, capex at 1287.1745, then operating cost at 323.8828.", "Capex at 1287.1745 first, as the one driver the plan controls, then oil price, production and operating cost behind it.", "Production at 2839.5965 first and oil price at 3092.0051 second, because barrels earn the revenue and the deck only prices them.", "Operating cost at 323.8828 first, as the only driver charged in all of the 21 rows, then capex, production and oil price."]'::jsonb and answer_index = 0 and explanation = 'Ranked by swing the order is oil price, production, capex and operating cost, and the driver at the top moves the value by nearly ten times what the one at the bottom does.' then 'old'
           when prompt = 'How do the four drivers of the sweep rank by what each does to the value of the plan''s own case?' and options = '["Oil price at 3097.7119, production at 2844.8375, capex at 1287.1745, then operating cost at 326.3064.", "Capex at 1287.1745 first, as the one driver the plan controls, then oil price, production and operating cost behind it.", "Production at 2844.8375 first and oil price at 3097.7119 second, because barrels earn the revenue and the deck only prices them.", "Operating cost at 326.3064 first, as the only driver charged in all of the 21 rows, then capex, production and oil price."]'::jsonb and answer_index = 0 and explanation = 'Ranked by swing the order is oil price, production, capex and operating cost, and the driver at the top moves the value by nearly ten times what the one at the bottom does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'How do the four drivers of the sweep rank by what each does to the value of the plan''s own case?', options = '["Oil price at 3097.7119, production at 2844.8375, capex at 1287.1745, then operating cost at 326.3064.", "Capex at 1287.1745 first, as the one driver the plan controls, then oil price, production and operating cost behind it.", "Production at 2844.8375 first and oil price at 3097.7119 second, because barrels earn the revenue and the deck only prices them.", "Operating cost at 326.3064 first, as the only driver charged in all of the 21 rows, then capex, production and oil price."]'::jsonb, explanation = 'Ranked by swing the order is oil price, production, capex and operating cost, and the driver at the top moves the value by nearly ten times what the one at the bottom does.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 11: prompt
  select case
           when prompt = 'The oil price swing is 3092.0051 and the production swing is 2839.5965, although both drivers scale revenue. What makes the price swing the larger of the two?' and options = '["The royalty of 12.5000 percent is charged on the price and not on the volume, so a move in the deck reaches the net cash flow untouched by it.", "Production is moved by 30 percent on the plateau of 60.0000 kbpd alone, while the price is moved by 30 percent in every one of the 21 rows.", "The capex of 2250.0000 is sized from the peak rate, so more barrels bring more spend with them and cancel part of the revenue they earn.", "A barrel carries a variable operating cost of 5.0000 USD and a dollar of price carries none."]'::jsonb and answer_index = 3 and explanation = '30 percent more barrels brings 30 percent more revenue and more cost with it, so price is the stronger driver wherever barrels cost money to lift.' then 'old'
           when prompt = 'The oil price swing is 3097.7119 and the production swing is 2844.8375, although both drivers scale revenue. What makes the price swing the larger of the two?' and options = '["The royalty of 12.5000 percent is charged on the price and not on the volume, so a move in the deck reaches the net cash flow untouched by it.", "Production is moved by 30 percent on the plateau of 60.0000 kbpd alone, while the price is moved by 30 percent in every one of the 21 rows.", "The capex of 2250.0000 is sized from the peak rate, so more barrels bring more spend with them and cancel part of the revenue they earn.", "A barrel carries a variable operating cost of 5.0000 USD and a dollar of price carries none."]'::jsonb and answer_index = 3 and explanation = '30 percent more barrels brings 30 percent more revenue and more cost with it, so price is the stronger driver wherever barrels cost money to lift.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The oil price swing is 3097.7119 and the production swing is 2844.8375, although both drivers scale revenue. What makes the price swing the larger of the two?', options = '["The royalty of 12.5000 percent is charged on the price and not on the volume, so a move in the deck reaches the net cash flow untouched by it.", "Production is moved by 30 percent on the plateau of 60.0000 kbpd alone, while the price is moved by 30 percent in every one of the 21 rows.", "The capex of 2250.0000 is sized from the peak rate, so more barrels bring more spend with them and cancel part of the revenue they earn.", "A barrel carries a variable operating cost of 5.0000 USD and a dollar of price carries none."]'::jsonb, explanation = '30 percent more barrels brings 30 percent more revenue and more cost with it, so price is the stronger driver wherever barrels cost money to lift.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 12: prompt, explanation, option_0, option_1, option_3
  select case
           when prompt = 'The capex row of the sweep reads 2691.1526 at minus 30 percent and 1403.9781 at plus 30 percent. What is a reader who expects every bar to grow to the right about to report?' and options = '["That the capex swing of 1287.1745 is the largest of the four, because the bar drawn from 1403.9781 to 2691.1526 is the widest on the chart.", "That the base value of 2047.5653 falls outside the capex range, because the two capex figures sit either side of it in the wrong order.", "That overspending improves the plan, having read the sign of the capex sensitivity backwards.", "That an overrun of 30 percent is worth 2691.1526."]'::jsonb and answer_index = 2 and explanation = 'More capex is less value, so the capex row reads high on the left and low on the right, and an overrun of 30 percent takes the case from 2047.5653 to 1403.9781.' then 'old'
           when prompt = 'The capex row of the sweep reads 2658.9995 at minus 30 percent and 1371.8250 at plus 30 percent. What is a reader who expects every bar to grow to the right about to report?' and options = '["That the capex swing of 1287.1745 is the largest of the four, because the bar drawn from 1371.8250 to 2658.9995 is the widest on the chart.", "That the base value of 2015.4123 falls outside the capex range, because the two capex figures sit either side of it in the wrong order.", "That overspending improves the plan, having read the sign of the capex sensitivity backwards.", "That an overrun of 30 percent is worth 2658.9995."]'::jsonb and answer_index = 2 and explanation = 'More capex is less value, so the capex row reads high on the left and low on the right, and an overrun of 30 percent takes the case from 2015.4123 to 1371.8250.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 12;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex row of the sweep reads 2658.9995 at minus 30 percent and 1371.8250 at plus 30 percent. What is a reader who expects every bar to grow to the right about to report?', options = '["That the capex swing of 1287.1745 is the largest of the four, because the bar drawn from 1371.8250 to 2658.9995 is the widest on the chart.", "That the base value of 2015.4123 falls outside the capex range, because the two capex figures sit either side of it in the wrong order.", "That overspending improves the plan, having read the sign of the capex sensitivity backwards.", "That an overrun of 30 percent is worth 2658.9995."]'::jsonb, explanation = 'More capex is less value, so the capex row reads high on the left and low on the right, and an overrun of 30 percent takes the case from 2015.4123 to 1371.8250.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m05 ord 13: option_1, option_2, option_3
  select case
           when prompt = 'Someone labels the plus 30 percent column of the sweep a P10 case and the minus 30 percent column a P90 case. What is wrong with those labels?' and options = '["The sweep holds no distribution: it moves one driver by 30 percent and says nothing about how likely that move is.", "They are the wrong way round, because more of a driver is the low case and the label belongs on the column reading 3593.5679.", "They belong to the plan as a whole, so only the base value of 2047.5653 may carry one of them.", "They may be used on the oil price row, whose swing of 3092.0051 was measured across prices, but not on the other three."]'::jsonb and answer_index = 0 and explanation = 'A P-label belongs to a reserves distribution, one fluid at a time, and 30 percent on the oil price and 30 percent on the operating cost are not equally likely events.' then 'old'
           when prompt = 'Someone labels the plus 30 percent column of the sweep a P10 case and the minus 30 percent column a P90 case. What is wrong with those labels?' and options = '["The sweep holds no distribution: it moves one driver by 30 percent and says nothing about how likely that move is.", "They are the wrong way round, because more of a driver is the low case and the label belongs on the column reading 3564.2683.", "They belong to the plan as a whole, so only the base value of 2015.4123 may carry one of them.", "They may be used on the oil price row, whose swing of 3097.7119 was measured across prices, but not on the other three."]'::jsonb and answer_index = 0 and explanation = 'A P-label belongs to a reserves distribution, one fluid at a time, and 30 percent on the oil price and 30 percent on the operating cost are not equally likely events.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m05 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m05 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Someone labels the plus 30 percent column of the sweep a P10 case and the minus 30 percent column a P90 case. What is wrong with those labels?', options = '["The sweep holds no distribution: it moves one driver by 30 percent and says nothing about how likely that move is.", "They are the wrong way round, because more of a driver is the low case and the label belongs on the column reading 3564.2683.", "They belong to the plan as a whole, so only the base value of 2015.4123 may carry one of them.", "They may be used on the oil price row, whose swing of 3097.7119 was measured across prices, but not on the other three."]'::jsonb, explanation = 'A P-label belongs to a reserves distribution, one fluid at a time, and 30 percent on the oil price and 30 percent on the operating cost are not equally likely events.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-plan-s-own-economics' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m05 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 2: prompt
  select case
           when prompt = 'A reader sets the FPSO''s 2047.5653 beside the tie-back''s 1048.6281, and the oil P50 of 130.0000 beside the gas P50 of 70.0000. Which comparison stands?' and options = '["The two values, because both are million USD on the same field at 70.0000 USD a barrel, while the two reserves figures are different fluids in different units.", "The two reserves figures, because both come from one plan through one accessor, while the values were run on concepts of different capex, life and peak rate.", "Both of them, because each pair is drawn from a single plan and the studio prints the members of a pair beside each other on the same card.", "Neither of them, because the values sit on capex of 2250.0000 and 730.0000 and the reserves sit in MMbbl and Bcf."]'::jsonb and answer_index = 0 and explanation = 'Two values at one price are comparable, and the differences between the concepts are what the comparison is about; 130.0000 MMbbl and 70.0000 Bcf are not comparable at all.' then 'old'
           when prompt = 'A reader sets the FPSO''s 2015.4123 beside the tie-back''s 1013.7182, and the oil P50 of 130.0000 beside the gas P50 of 70.0000. Which comparison stands?' and options = '["The two values, because both are million USD on the same field at 70.0000 USD a barrel, while the two reserves figures are different fluids in different units.", "The two reserves figures, because both come from one plan through one accessor, while the values were run on concepts of different capex, life and peak rate.", "Both of them, because each pair is drawn from a single plan and the studio prints the members of a pair beside each other on the same card.", "Neither of them, because the values sit on capex of 2250.0000 and 730.0000 and the reserves sit in MMbbl and Bcf."]'::jsonb and answer_index = 0 and explanation = 'Two values at one price are comparable, and the differences between the concepts are what the comparison is about; 130.0000 MMbbl and 70.0000 Bcf are not comparable at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader sets the FPSO''s 2015.4123 beside the tie-back''s 1013.7182, and the oil P50 of 130.0000 beside the gas P50 of 70.0000. Which comparison stands?', options = '["The two values, because both are million USD on the same field at 70.0000 USD a barrel, while the two reserves figures are different fluids in different units.", "The two reserves figures, because both come from one plan through one accessor, while the values were run on concepts of different capex, life and peak rate.", "Both of them, because each pair is drawn from a single plan and the studio prints the members of a pair beside each other on the same card.", "Neither of them, because the values sit on capex of 2250.0000 and 730.0000 and the reserves sit in MMbbl and Bcf."]'::jsonb, explanation = 'Two values at one price are comparable, and the differences between the concepts are what the comparison is about; 130.0000 MMbbl and 70.0000 Bcf are not comparable at all.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 6: prompt, explanation, option_1, option_3
  select case
           when prompt = 'An NPV of 2047.5653 million USD is carried out of the studio with no conditions attached to it. What has been left behind?' and options = '["Nothing, because a value is always stated after royalty and tax on the studio''s default terms and so carries its own conditions wherever it goes.", "The reserves the value was earned on, because 130.0000 MMbbl of oil and 70.0000 Bcf of gas are what the case sold to reach 2047.5653.", "The price of 70.0000 USD a barrel, the capex of 2250.0000, the operating cost of 95.0000 a year, the royalty of 12.5000 percent, the tax of 30.0000 percent, the discount rate of 10.0000 percent and the 20 year shape.", "The rate of return of 29.5998 percent and the payback of 3.8273 years, without which a value carries no measure of timing beside it."]'::jsonb and answer_index = 2 and explanation = 'Every value in this course is conditional on something, and the same concept at 18.0000 USD a barrel returns -1797.2732 with nothing else changed.' then 'old'
           when prompt = 'An NPV of 2015.4123 million USD is carried out of the studio with no conditions attached to it. What has been left behind?' and options = '["Nothing, because a value is always stated after royalty and tax on the studio''s default terms and so carries its own conditions wherever it goes.", "The reserves the value was earned on, because 130.0000 MMbbl of oil and 70.0000 Bcf of gas are what the case sold to reach 2015.4123.", "The price of 70.0000 USD a barrel, the capex of 2250.0000, the operating cost of 95.0000 a year, the royalty of 12.5000 percent, the tax of 30.0000 percent, the discount rate of 10.0000 percent and the 20 year shape.", "The rate of return and the payback of 3.8273 years, without which a value carries no measure of timing anywhere beside it."]'::jsonb and answer_index = 2 and explanation = 'Every value in this course is conditional on something, and the same concept at 18.0000 USD a barrel returns -1834.1220 with nothing else changed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An NPV of 2015.4123 million USD is carried out of the studio with no conditions attached to it. What has been left behind?', options = '["Nothing, because a value is always stated after royalty and tax on the studio''s default terms and so carries its own conditions wherever it goes.", "The reserves the value was earned on, because 130.0000 MMbbl of oil and 70.0000 Bcf of gas are what the case sold to reach 2015.4123.", "The price of 70.0000 USD a barrel, the capex of 2250.0000, the operating cost of 95.0000 a year, the royalty of 12.5000 percent, the tax of 30.0000 percent, the discount rate of 10.0000 percent and the 20 year shape.", "The rate of return and the payback of 3.8273 years, without which a value carries no measure of timing anywhere beside it."]'::jsonb, explanation = 'Every value in this course is conditional on something, and the same concept at 18.0000 USD a barrel returns -1834.1220 with nothing else changed.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 7: prompt, explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Base case reports 2047.5653, 29.5998 and 3.8273. What kind of quantity is each of the three?' and options = '["Money in million USD, then a percent, then a duration in years.", "Money in million USD, a percent, and a second percent, because payback states the share of the life that has been recovered.", "Money in whole currency units, a plain ratio, and a duration in years counted from the sanction date of the concept.", "Money in million USD, a plain ratio of the kind 1.436477 is, and a duration in years."]'::jsonb and answer_index = 0 and explanation = 'Plan money prints in million USD, a rate of return is the percent 29.5998, and payback is 3.8273 years, so the unit written beside each figure makes a unit error visible.' then 'old'
           when prompt = 'The Base case reports 2015.4123 and 3.8273, and the government take beside them reads 0.328598. What kind of quantity is each of the three?' and options = '["Money in million USD, then a duration in years, then a plain ratio.", "Money in million USD, a duration in years, and a percent, since 0.328598 is the share of gross revenue the state takes on this case.", "Money in whole currency units, a duration in years counted from the sanction date of the concept, and a plain ratio.", "Money in million USD, a percent, and a plain ratio of the kind 1.388655 is."]'::jsonb and answer_index = 0 and explanation = 'Plan money prints in million USD, payback is 3.8273 years, and 0.328598 of gross revenue is a plain ratio: 0.328598 percent of it would be a different figure entirely.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case reports 2015.4123 and 3.8273, and the government take beside them reads 0.328598. What kind of quantity is each of the three?', options = '["Money in million USD, then a duration in years, then a plain ratio.", "Money in million USD, a duration in years, and a percent, since 0.328598 is the share of gross revenue the state takes on this case.", "Money in whole currency units, a duration in years counted from the sanction date of the concept, and a plain ratio.", "Money in million USD, a percent, and a plain ratio of the kind 1.388655 is."]'::jsonb, explanation = 'Plan money prints in million USD, payback is 3.8273 years, and 0.328598 of gross revenue is a plain ratio: 0.328598 percent of it would be a different figure entirely.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 8: prompt, explanation, option_2
  select case
           when prompt = 'The tie-back concept returns 1.436477 at 70.0000 USD a barrel. In what unit is that figure?' and options = '["Percent, the rate of return the tie-back earns on the capex of 730.0000 it asks for across its life of 15.0000 years.", "A plain number, the value earned for each million USD of capex.", "Million USD, the value left once the capex has been taken out of the NPV of 1048.6281 the concept reports.", "MMbbl, the barrels the tie-back recovers for each million USD it spends over its 15.0000 year life."]'::jsonb and answer_index = 1 and explanation = 'A ratio is a plain number and a rate of return is a percent, so 1.436477 and the 40.4321 percent the tie-back earns are different animals.' then 'old'
           when prompt = 'The tie-back concept returns 1.388655 at 70.0000 USD a barrel. In what unit is that figure?' and options = '["Percent, the rate of return the tie-back earns on the capex of 730.0000 it asks for across its life of 15.0000 years.", "A plain number, the value earned for each million USD of capex.", "Million USD, the value left once the capex has been taken out of the NPV of 1013.7182 the concept reports.", "MMbbl, the barrels the tie-back recovers for each million USD it spends over its 15.0000 year life."]'::jsonb and answer_index = 1 and explanation = 'A ratio is a plain number and a rate of return is a percent, so 1.388655 is not a rate, and on this plan the tie-back reports no rate of return at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The tie-back concept returns 1.388655 at 70.0000 USD a barrel. In what unit is that figure?', options = '["Percent, the rate of return the tie-back earns on the capex of 730.0000 it asks for across its life of 15.0000 years.", "A plain number, the value earned for each million USD of capex.", "Million USD, the value left once the capex has been taken out of the NPV of 1013.7182 the concept reports.", "MMbbl, the barrels the tie-back recovers for each million USD it spends over its 15.0000 year life."]'::jsonb, explanation = 'A ratio is a plain number and a rate of return is a percent, so 1.388655 is not a rate, and on this plan the tie-back reports no rate of return at all.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 12: explanation
  select case
           when prompt = 'What does rounding a figure as you work, rather than at the end, do to an answer?' and options = '["Nothing at all, because the studio rounds every input before it runs.", "It is the safer practice, because a rounded input cannot carry more precision than the estimate behind it was entitled to claim.", "It changes the unit of the answer, because a figure rounded to whole numbers leaves the million USD scale for a whole currency one.", "It puts an error in the final line that nothing later in the work can find."]'::jsonb and answer_index = 3 and explanation = 'Carry the figures at the precision they were printed at, such as 2047.5653 and 0.330657, do the arithmetic once, and quote at the precision the question asks for.' then 'old'
           when prompt = 'What does rounding a figure as you work, rather than at the end, do to an answer?' and options = '["Nothing at all, because the studio rounds every input before it runs.", "It is the safer practice, because a rounded input cannot carry more precision than the estimate behind it was entitled to claim.", "It changes the unit of the answer, because a figure rounded to whole numbers leaves the million USD scale for a whole currency one.", "It puts an error in the final line that nothing later in the work can find."]'::jsonb and answer_index = 3 and explanation = 'Carry the figures at the precision they were printed at, such as 2015.4123 and 0.328598, do the arithmetic once, and quote at the precision the question asks for.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 12;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does rounding a figure as you work, rather than at the end, do to an answer?', options = '["Nothing at all, because the studio rounds every input before it runs.", "It is the safer practice, because a rounded input cannot carry more precision than the estimate behind it was entitled to claim.", "It changes the unit of the answer, because a figure rounded to whole numbers leaves the million USD scale for a whole currency one.", "It puts an error in the final line that nothing later in the work can find."]'::jsonb, explanation = 'Carry the figures at the precision they were printed at, such as 2015.4123 and 0.328598, do the arithmetic once, and quote at the precision the question asks for.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_m06 ord 15: option_1
  select case
           when prompt = 'What does the Associate tier hand on to the rest of the course?' and options = '["That a number comes from the field it was typed in, that units travel with their figures, and that an engine which cannot answer says so.", "A set of values to carry forward, led by the 2047.5653 the Base case reports, against which the later work is checked.", "The default terms of 12.5000 percent royalty and 30.0000 percent tax, which every later tier reuses unchanged.", "The completeness score of 100 percent, which the later tiers raise as each further section is filled in."]'::jsonb and answer_index = 0 and explanation = 'The habits carry forward: a figure typed into the studio is only as good as the work behind it, and a refusal is an answer.' then 'old'
           when prompt = 'What does the Associate tier hand on to the rest of the course?' and options = '["That a number comes from the field it was typed in, that units travel with their figures, and that an engine which cannot answer says so.", "A set of values to carry forward, led by the 2015.4123 the Base case reports, against which the later work is checked.", "The default terms of 12.5000 percent royalty and 30.0000 percent tax, which every later tier reuses unchanged.", "The completeness score of 100 percent, which the later tiers raise as each further section is filled in."]'::jsonb and answer_index = 0 and explanation = 'The habits carry forward: a figure typed into the studio is only as good as the work behind it, and a refusal is an answer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_m06 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_m06 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the Associate tier hand on to the rest of the course?', options = '["That a number comes from the field it was typed in, that units travel with their figures, and that an engine which cannot answer says so.", "A set of values to carry forward, led by the 2015.4123 the Base case reports, against which the later work is checked.", "The default terms of 12.5000 percent royalty and 30.0000 percent tax, which every later tier reuses unchanged.", "The completeness score of 100 percent, which the later tiers raise as each further section is filled in."]'::jsonb, explanation = 'The habits carry forward: a figure typed into the studio is only as good as the work behind it, and a refusal is an answer.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_m06 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 5: prompt
  select case
           when prompt = 'A board paper prints the Low price, Base and High price scenarios as the range the field could be worth, 427.9436 to 3667.1870 million USD. What has the paper claimed that the tier does not?' and options = '["That the three describe a spread: each is a separate run of one concept conditional on the single price typed at its head, and the tier holds no view on how likely 48.0000 or 92.0000 USD a barrel is.", "That the three share one concept, when the Low price row runs the subsea tie-back on its own capex of 730.0000 million USD and only the Base and the High price figures sit on one scale, so the range the paper prints is two concepts wide rather than one.", "That the figures are comparable, when each row is discounted at a rate matched to its own price and only the Base case runs at the default 10.0000 percent.", "That the studio named them, when Low price, Base and High price are the engine''s own judgements about which of the three prices is conservative and which optimistic."]'::jsonb and answer_index = 0 and explanation = 'Four rows of one concept at four typed prices are four complete answers, not a distribution, and the tier will not say whether any of the prices is plausible.' then 'old'
           when prompt = 'A board paper prints the Low price, Base and High price scenarios as the range the field could be worth, 392.8013 to 3638.0233 million USD. What has the paper claimed that the tier does not?' and options = '["That the three describe a spread: each is a separate run of one concept conditional on the single price typed at its head, and the tier holds no view on how likely 48.0000 or 92.0000 USD a barrel is.", "That the three share one concept, when the Low price row runs the subsea tie-back on its own capex of 730.0000 million USD and only the Base and the High price figures sit on one scale, so the range the paper prints is two concepts wide rather than one.", "That the figures are comparable, when each row is discounted at a rate matched to its own price and only the Base case runs at the default 10.0000 percent.", "That the studio named them, when Low price, Base and High price are the engine''s own judgements about which of the three prices is conservative and which optimistic."]'::jsonb and answer_index = 0 and explanation = 'Four rows of one concept at four typed prices are four complete answers, not a distribution, and the tier will not say whether any of the prices is plausible.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A board paper prints the Low price, Base and High price scenarios as the range the field could be worth, 392.8013 to 3638.0233 million USD. What has the paper claimed that the tier does not?', options = '["That the three describe a spread: each is a separate run of one concept conditional on the single price typed at its head, and the tier holds no view on how likely 48.0000 or 92.0000 USD a barrel is.", "That the three share one concept, when the Low price row runs the subsea tie-back on its own capex of 730.0000 million USD and only the Base and the High price figures sit on one scale, so the range the paper prints is two concepts wide rather than one.", "That the figures are comparable, when each row is discounted at a rate matched to its own price and only the Base case runs at the default 10.0000 percent.", "That the studio named them, when Low price, Base and High price are the engine''s own judgements about which of the three prices is conservative and which optimistic."]'::jsonb, explanation = 'Four rows of one concept at four typed prices are four complete answers, not a distribution, and the tier will not say whether any of the prices is plausible.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 6: prompt, option_3
  select case
           when prompt = 'Quoting an NPV of 2047.5653 million USD without its terms is quoting half a number. Which set of defaults is that value conditional on?' and options = '["Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and the concept''s fixed operating cost of 95.0000 million USD a year, discounted at each year end.", "An oil price of 70.0000 USD a barrel, a peak rate of 60.0000 kbpd, a life of 20.0000 years and a capex of 2250.0000 million USD.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, discounted mid year.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and an abandonment provision of 260.0000 million USD."]'::jsonb and answer_index = 2 and explanation = 'The four stated defaults are royalty 12.5000 percent, tax 30.0000 percent, discount 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, and the discounting is mid year.' then 'old'
           when prompt = 'Quoting an NPV of 2015.4123 million USD without its terms is quoting half a number. Which set of defaults is that value conditional on?' and options = '["Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and the concept''s fixed operating cost of 95.0000 million USD a year, discounted at each year end.", "An oil price of 70.0000 USD a barrel, a peak rate of 60.0000 kbpd, a life of 20.0000 years and a capex of 2250.0000 million USD.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, discounted mid year.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and a fixed operating cost of 95.0000 million USD a year with no charge on the barrels."]'::jsonb and answer_index = 2 and explanation = 'The four stated defaults are royalty 12.5000 percent, tax 30.0000 percent, discount 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, and the discounting is mid year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Quoting an NPV of 2015.4123 million USD without its terms is quoting half a number. Which set of defaults is that value conditional on?', options = '["Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and the concept''s fixed operating cost of 95.0000 million USD a year, discounted at each year end.", "An oil price of 70.0000 USD a barrel, a peak rate of 60.0000 kbpd, a life of 20.0000 years and a capex of 2250.0000 million USD.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, discounted mid year.", "Royalty 12.5000 percent, tax 30.0000 percent, a discount rate of 10.0000 percent and a fixed operating cost of 95.0000 million USD a year with no charge on the barrels."]'::jsonb, explanation = 'The four stated defaults are royalty 12.5000 percent, tax 30.0000 percent, discount 10.0000 percent and a variable operating cost of 5.0000 USD a barrel, and the discounting is mid year.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 10: prompt, explanation
  select case
           when prompt = 'The sweep prices the plan''s case with CAPEX at minus 30 percent, 2691.1526, and at plus 30 percent, 1403.9781. What is wrong with calling those the P90 and the P10 capex?' and options = '["The labels are right only for a driver that lifts the value, so a capex row reads P10 at minus 30 percent and P90 at plus 30 percent.", "A capex may carry a P-label once the sweep has been run at more than the two points, because three or more runs describe enough of a spread for a percentile to be read off them.", "A P-label belongs to a reserves distribution, one fluid at a time, and the sweep holds no distribution: it moves a driver by 30 percent and says nothing about how likely that is.", "The sweep moves all four drivers at once in each run, so neither figure belongs to the capex alone and no percentile of any kind could be attached to either of the two columns."]'::jsonb and answer_index = 2 and explanation = 'P90 is the low case of a reserves distribution, such as the oil P90 of 80.0000 MMbbl, while 2691.1526 is one driver moved 30 percent with the other three held at the base case.' then 'old'
           when prompt = 'The sweep prices the plan''s case with CAPEX at minus 30 percent, 2658.9995, and at plus 30 percent, 1371.8250. What is wrong with calling those the P90 and the P10 capex?' and options = '["The labels are right only for a driver that lifts the value, so a capex row reads P10 at minus 30 percent and P90 at plus 30 percent.", "A capex may carry a P-label once the sweep has been run at more than the two points, because three or more runs describe enough of a spread for a percentile to be read off them.", "A P-label belongs to a reserves distribution, one fluid at a time, and the sweep holds no distribution: it moves a driver by 30 percent and says nothing about how likely that is.", "The sweep moves all four drivers at once in each run, so neither figure belongs to the capex alone and no percentile of any kind could be attached to either of the two columns."]'::jsonb and answer_index = 2 and explanation = 'P90 is the low case of a reserves distribution, such as the oil P90 of 80.0000 MMbbl, while 2658.9995 is one driver moved 30 percent with the other three held at the base case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The sweep prices the plan''s case with CAPEX at minus 30 percent, 2658.9995, and at plus 30 percent, 1371.8250. What is wrong with calling those the P90 and the P10 capex?', options = '["The labels are right only for a driver that lifts the value, so a capex row reads P10 at minus 30 percent and P90 at plus 30 percent.", "A capex may carry a P-label once the sweep has been run at more than the two points, because three or more runs describe enough of a spread for a percentile to be read off them.", "A P-label belongs to a reserves distribution, one fluid at a time, and the sweep holds no distribution: it moves a driver by 30 percent and says nothing about how likely that is.", "The sweep moves all four drivers at once in each run, so neither figure belongs to the capex alone and no percentile of any kind could be attached to either of the two columns."]'::jsonb, explanation = 'P90 is the low case of a reserves distribution, such as the oil P90 of 80.0000 MMbbl, while 2658.9995 is one driver moved 30 percent with the other three held at the base case.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 12: option_0
  select case
           when prompt = 'A reserves figure can reach a plan three ways: a headline somebody typed, a summary carried in from a loaded example, and a table of reservoir rows. Which of the three is the plan''s own P50?' and options = '["The headline, because it is the figure the generated document prints beside the total CAPEX of 2250.0000 million USD and the NPV of 2047.5653, and the only one a reader of the finished plan ever sees.", "The summary, because a plan carrying one scores 33 percent with isValid true while a plan carrying the rows alone scores 78 percent and fails validation until somebody has filled the summary box in behind them.", "Whichever of the three the plan carries first, because the accessor reads them in that order and stops at the first figure it can resolve.", "The table, because the engine totals the rows one fluid at a time and the completeness check, the generated document and the economics all reach the reserves through that one accessor."]'::jsonb and answer_index = 3 and explanation = 'A headline typed by hand, a summary carried in from an example and a table of rows can all sit in one plan and disagree, and the number that belongs to the plan is the one totalled from the rows.' then 'old'
           when prompt = 'A reserves figure can reach a plan three ways: a headline somebody typed, a summary carried in from a loaded example, and a table of reservoir rows. Which of the three is the plan''s own P50?' and options = '["The headline, because it is the figure the generated document prints beside the total CAPEX of 2250.0000 million USD and the NPV of 2015.4123, and the only one a reader of the finished plan ever sees.", "The summary, because a plan carrying one scores 33 percent with isValid true while a plan carrying the rows alone scores 78 percent and fails validation until somebody has filled the summary box in behind them.", "Whichever of the three the plan carries first, because the accessor reads them in that order and stops at the first figure it can resolve.", "The table, because the engine totals the rows one fluid at a time and the completeness check, the generated document and the economics all reach the reserves through that one accessor."]'::jsonb and answer_index = 3 and explanation = 'A headline typed by hand, a summary carried in from an example and a table of rows can all sit in one plan and disagree, and the number that belongs to the plan is the one totalled from the rows.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 12'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reserves figure can reach a plan three ways: a headline somebody typed, a summary carried in from a loaded example, and a table of reservoir rows. Which of the three is the plan''s own P50?', options = '["The headline, because it is the figure the generated document prints beside the total CAPEX of 2250.0000 million USD and the NPV of 2015.4123, and the only one a reader of the finished plan ever sees.", "The summary, because a plan carrying one scores 33 percent with isValid true while a plan carrying the rows alone scores 78 percent and fails validation until somebody has filled the summary box in behind them.", "Whichever of the three the plan carries first, because the accessor reads them in that order and stops at the first figure it can resolve.", "The table, because the engine totals the rows one fluid at a time and the completeness check, the generated document and the economics all reach the reserves through that one accessor."]'::jsonb, explanation = 'A headline typed by hand, a summary carried in from an example and a table of rows can all sit in one plan and disagree, and the number that belongs to the plan is the one totalled from the rows.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 16: option_1
  select case
           when prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD. What is inside that figure, and what is not?' and options = '["Capex of 2250.0000 plus the whole case operating cost of 3049.6464, which carries the variable 5.0000 USD a barrel with it, and the 260.0000 decommissioning provision charged at the end of the life.", "Capex of 2250.0000 plus 1900.0000 of operating cost discounted at 10.0000 percent, which is what lets it be set beside the NPV of 2047.5653 million USD as a figure on the same scale.", "The cost items'' CAPEX of 2250.0000 plus the Operate phase roll-up of 355.0000 taken across the life, which is the route by which the decommissioning provision enters the lifecycle figure.", "Capex of 2250.0000 plus 1900.0000 of operating cost, undiscounted, and the 260.0000 decommissioning provision is not in it."]'::jsonb and answer_index = 3 and explanation = '95.0000 a year across 20.0000 years is 1900.0000, and 2250.0000 plus 1900.0000 is 4150.0000, a plain sum with no discounting and no abandonment inside it.' then 'old'
           when prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD. What is inside that figure, and what is not?' and options = '["Capex of 2250.0000 plus the whole case operating cost of 3049.6464, which carries the variable 5.0000 USD a barrel with it, and the 260.0000 decommissioning provision charged at the end of the life.", "Capex of 2250.0000 plus 1900.0000 of operating cost discounted at 10.0000 percent, which is what lets it be set beside the NPV of 2015.4123 million USD as a figure on the same scale.", "The cost items'' CAPEX of 2250.0000 plus the Operate phase roll-up of 355.0000 taken across the life, which is the route by which the decommissioning provision enters the lifecycle figure.", "Capex of 2250.0000 plus 1900.0000 of operating cost, undiscounted, and the 260.0000 decommissioning provision is not in it."]'::jsonb and answer_index = 3 and explanation = '95.0000 a year across 20.0000 years is 1900.0000, and 2250.0000 plus 1900.0000 is 4150.0000, a plain sum with no discounting and no abandonment inside it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 16'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The FPSO concept''s lifecycle cost is 4150.0000 million USD. What is inside that figure, and what is not?', options = '["Capex of 2250.0000 plus the whole case operating cost of 3049.6464, which carries the variable 5.0000 USD a barrel with it, and the 260.0000 decommissioning provision charged at the end of the life.", "Capex of 2250.0000 plus 1900.0000 of operating cost discounted at 10.0000 percent, which is what lets it be set beside the NPV of 2015.4123 million USD as a figure on the same scale.", "The cost items'' CAPEX of 2250.0000 plus the Operate phase roll-up of 355.0000 taken across the life, which is the route by which the decommissioning provision enters the lifecycle figure.", "Capex of 2250.0000 plus 1900.0000 of operating cost, undiscounted, and the 260.0000 decommissioning provision is not in it."]'::jsonb, explanation = '95.0000 a year across 20.0000 years is 1900.0000, and 2250.0000 plus 1900.0000 is 4150.0000, a plain sum with no discounting and no abandonment inside it.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 18: option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The volume under the FPSO concept''s 20 year shape is 229.9293 MMbbl and the plan''s oil P50 is 130.0000 MMbbl. What does the studio do about the difference?' and options = '["Caps the profile at the recoverable volume, so the decline steepens once cumulative production reaches 130.0000 MMbbl.", "Nothing: the shape is drawn from a peak rate and a life without consulting the reserves, so the plan still scores complete and still returns 2047.5653 million USD.", "Refuses the scenario by name, as it refuses a price deck that does not cover the profile, and asks for a larger reserves figure.", "Reports the difference as a warning against the completeness check, which is why a plan built this way reads 89 percent rather than the 100 percent its nine sections would otherwise give."]'::jsonb and answer_index = 1 and explanation = '229.9293 MMbbl under a shape drawn from two inputs against 130.0000 MMbbl in the reserves table, and the reconciliation is the planner''s job rather than the engine''s.' then 'old'
           when prompt = 'The volume under the FPSO concept''s 20 year shape is 229.9293 MMbbl and the plan''s oil P50 is 130.0000 MMbbl. What does the studio do about the difference?' and options = '["Caps the profile at the recoverable volume, so the decline steepens once cumulative production reaches 130.0000 MMbbl.", "Nothing: the shape is drawn from a peak rate and a life without consulting the reserves, so the plan still scores complete and still returns 2015.4123 million USD.", "Refuses the scenario by name, as it refuses a price deck that does not cover the profile, and asks for a larger reserves figure.", "Reports the difference as a warning against the completeness check, which is why a plan built this way reads 89 percent rather than the 100 percent its nine sections would otherwise give."]'::jsonb and answer_index = 1 and explanation = '229.9293 MMbbl under a shape drawn from two inputs against 130.0000 MMbbl in the reserves table, and the reconciliation is the planner''s job rather than the engine''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 18'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The volume under the FPSO concept''s 20 year shape is 229.9293 MMbbl and the plan''s oil P50 is 130.0000 MMbbl. What does the studio do about the difference?', options = '["Caps the profile at the recoverable volume, so the decline steepens once cumulative production reaches 130.0000 MMbbl.", "Nothing: the shape is drawn from a peak rate and a life without consulting the reserves, so the plan still scores complete and still returns 2015.4123 million USD.", "Refuses the scenario by name, as it refuses a price deck that does not cover the profile, and asks for a larger reserves figure.", "Reports the difference as a warning against the completeness check, which is why a plan built this way reads 89 percent rather than the 100 percent its nine sections would otherwise give."]'::jsonb, explanation = '229.9293 MMbbl under a shape drawn from two inputs against 130.0000 MMbbl in the reserves table, and the reconciliation is the planner''s job rather than the engine''s.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 21: prompt, explanation, option_0, option_3
  select case
           when prompt = 'The Low price scenario runs the FPSO at 48.0000 USD a barrel for an NPV of 427.9436 million USD, and the sweep''s oil price at minus 30 percent returns 501.5628. Why do two low price answers on one concept disagree?' and options = '["The sweep prices the plan''s own case off the cost items while the scenario prices the concept, so the 501.5628 runs on a capex that the 427.9436 does not.", "They are not at the same price: 30 percent off the base of 70.0000 USD a barrel is 49.0000, and the scenario was typed at 48.0000.", "The scenario carries a full deck at 48.0000 while the sweep moves the producing years only, leaving year 0 priced at the base of 70.0000 USD a barrel.", "The sweep reports a swing rather than a value, so 501.5628 is the distance the value moved and not what the case is worth at the lower price."]'::jsonb and answer_index = 1 and explanation = 'Both runs use the same 2250.0000 million USD of capex, the same 20 year shape and the same terms, so a dollar of price is the whole of the difference between 427.9436 and 501.5628.' then 'old'
           when prompt = 'The Low price scenario runs the FPSO at 48.0000 USD a barrel for an NPV of 392.8013 million USD, and the sweep''s oil price at minus 30 percent returns 466.5563. Why do two low price answers on one concept disagree?' and options = '["The sweep prices the plan''s own case off the cost items while the scenario prices the concept, so the 466.5563 runs on a capex that the 392.8013 does not.", "They are not at the same price: 30 percent off the base of 70.0000 USD a barrel is 49.0000, and the scenario was typed at 48.0000.", "The scenario carries a full deck at 48.0000 while the sweep moves the producing years only, leaving year 0 priced at the base of 70.0000 USD a barrel.", "The sweep reports a swing rather than a value, so 466.5563 is the distance the value moved and not what the case is worth at the lower price."]'::jsonb and answer_index = 1 and explanation = 'Both runs use the same 2250.0000 million USD of capex, the same 20 year shape and the same terms, so a dollar of price is the whole of the difference between 392.8013 and 466.5563.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 21'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Low price scenario runs the FPSO at 48.0000 USD a barrel for an NPV of 392.8013 million USD, and the sweep''s oil price at minus 30 percent returns 466.5563. Why do two low price answers on one concept disagree?', options = '["The sweep prices the plan''s own case off the cost items while the scenario prices the concept, so the 466.5563 runs on a capex that the 392.8013 does not.", "They are not at the same price: 30 percent off the base of 70.0000 USD a barrel is 49.0000, and the scenario was typed at 48.0000.", "The scenario carries a full deck at 48.0000 while the sweep moves the producing years only, leaving year 0 priced at the base of 70.0000 USD a barrel.", "The sweep reports a swing rather than a value, so 466.5563 is the distance the value moved and not what the case is worth at the lower price."]'::jsonb, explanation = 'Both runs use the same 2250.0000 million USD of capex, the same 20 year shape and the same terms, so a dollar of price is the whole of the difference between 392.8013 and 466.5563.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 22: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The FPSO pays back in 3.8273 years and the tie-back at the same price in 3.2035. Which does a payback ranking choose, and what does that ranking miss?' and options = '["The tie-back, and the ranking misses that the FPSO is worth 2047.5653 million USD against the tie-back''s 1048.6281, because payback stops counting at the crossing.", "The FPSO, because a longer payback across a life of 20.0000 years is the stronger result, and the ranking misses the 15.0000 year life.", "The tie-back, and the ranking misses nothing, because a rate of return of 40.4321 percent against 29.5998 puts it first on both measures.", "Neither, because payback carries no discount rate of its own and only shows the year the capex of 2250.0000 is recovered in cash."]'::jsonb and answer_index = 0 and explanation = 'Payback ranks the tie-back first at 3.2035 years and value takes the FPSO at 2047.5653 million USD, because the years after the crossing reach the NPV and never reach the payback.' then 'old'
           when prompt = 'The FPSO pays back in 3.8273 years and the tie-back at the same price in 3.2035. Which does a payback ranking choose, and what does that ranking miss?' and options = '["The tie-back, and the ranking misses that the FPSO is worth 2015.4123 million USD against the tie-back''s 1013.7182, because payback stops counting at the crossing.", "The FPSO, because a longer payback across a life of 20.0000 years is the stronger result, and the ranking misses the 15.0000 year life.", "The tie-back, and the ranking misses nothing, because the higher of the two rates that zero each flow, 40.4136 against 29.5779, puts it first on both measures.", "Neither, because payback carries no discount rate of its own and only shows the year the capex of 2250.0000 is recovered in cash."]'::jsonb and answer_index = 0 and explanation = 'Payback ranks the tie-back first at 3.2035 years and value takes the FPSO at 2015.4123 million USD, because the years after the crossing reach the NPV and never reach the payback.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The FPSO pays back in 3.8273 years and the tie-back at the same price in 3.2035. Which does a payback ranking choose, and what does that ranking miss?', options = '["The tie-back, and the ranking misses that the FPSO is worth 2015.4123 million USD against the tie-back''s 1013.7182, because payback stops counting at the crossing.", "The FPSO, because a longer payback across a life of 20.0000 years is the stronger result, and the ranking misses the 15.0000 year life.", "The tie-back, and the ranking misses nothing, because the higher of the two rates that zero each flow, 40.4136 against 29.5779, puts it first on both measures.", "Neither, because payback carries no discount rate of its own and only shows the year the capex of 2250.0000 is recovered in cash."]'::jsonb, explanation = 'Payback ranks the tie-back first at 3.2035 years and value takes the FPSO at 2015.4123 million USD, because the years after the crossing reach the NPV and never reach the payback.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 23: option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A worked answer calls the payback of 3.8273 years the point at which the Base case has recovered its 2250.0000 million USD in present value terms. What is wrong with that sentence?' and options = '["Nothing is wrong with it, since payback and value are measured on one discounted flow and 3.8273 years is simply where that flow first turns positive at the 10.0000 percent the scenario carries.", "The capex is wrong rather than the discounting, because payback is measured against the cost items'' CAPEX total and the 2250.0000 million USD quoted is the concept''s own estimate, and the two agree on this plan only because it was costed against the concept it runs.", "Payback carries no discount rate of its own: it is where the plain cumulative cash position crosses zero, and the 10.0000 percent taken mid year belongs to the 2047.5653 million USD instead.", "Payback is measured after the state is paid while the 2250.0000 million USD is a gross figure, so the sentence sets a post take measure against a pre take one."]'::jsonb and answer_index = 2 and explanation = 'The cumulative runs -2250.0000, -1454.1875, -658.3750 then 137.4375 with nothing discounted, and payback is placed inside the year where that crossing happens.' then 'old'
           when prompt = 'A worked answer calls the payback of 3.8273 years the point at which the Base case has recovered its 2250.0000 million USD in present value terms. What is wrong with that sentence?' and options = '["Nothing is wrong with it, since payback and value are measured on one discounted flow and 3.8273 years is simply where that flow first turns positive at the 10.0000 percent the scenario carries.", "The capex is wrong rather than the discounting, because payback is measured against the cost items'' CAPEX total and the 2250.0000 million USD quoted is the concept''s own estimate, and the two agree on this plan only because it was costed against the concept it runs.", "Payback carries no discount rate of its own: it is where the plain cumulative cash position crosses zero, and the 10.0000 percent taken mid year belongs to the 2015.4123 million USD instead.", "Payback is measured after the state is paid while the 2250.0000 million USD is a gross figure, so the sentence sets a post take measure against a pre take one."]'::jsonb and answer_index = 2 and explanation = 'The cumulative runs -2250.0000, -1454.1875, -658.3750 then 137.4375 with nothing discounted, and payback is placed inside the year where that crossing happens.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 23'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A worked answer calls the payback of 3.8273 years the point at which the Base case has recovered its 2250.0000 million USD in present value terms. What is wrong with that sentence?', options = '["Nothing is wrong with it, since payback and value are measured on one discounted flow and 3.8273 years is simply where that flow first turns positive at the 10.0000 percent the scenario carries.", "The capex is wrong rather than the discounting, because payback is measured against the cost items'' CAPEX total and the 2250.0000 million USD quoted is the concept''s own estimate, and the two agree on this plan only because it was costed against the concept it runs.", "Payback carries no discount rate of its own: it is where the plain cumulative cash position crosses zero, and the 10.0000 percent taken mid year belongs to the 2015.4123 million USD instead.", "Payback is measured after the state is paid while the 2250.0000 million USD is a gross figure, so the sentence sets a post take measure against a pre take one."]'::jsonb, explanation = 'The cumulative runs -2250.0000, -1454.1875, -658.3750 then 137.4375 with nothing discounted, and payback is placed inside the year where that crossing happens.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 24: prompt
  select case
           when prompt = 'At 40.0000, 55.0000, 70.0000 and 85.0000 USD a barrel the same concept returns -161.0098, 943.2778, 2047.5653 and 3151.8529. Why is the step even?' and options = '["The engine interpolates between the two prices it was given a full run at, so the two middle figures are read off a straight line drawn between 40.0000 and 85.0000 USD a barrel.", "Royalty and tax are charged on what is left after costs, so the state absorbs the curvature in the cash flow and leaves the value rising evenly with each step in the price.", "The four prices are evenly spaced within one price deck, and a deck that covers every year of the profile always returns an even step in the value it prices out.", "Only what a barrel earns moves between the runs: the shape, the capex of 2250.0000 and the fiscal terms are identical in all four."]'::jsonb and answer_index = 3 and explanation = 'Each run prices the same 20 year shape on the same 2250.0000 of capex, so a step of 15.0000 USD a barrel moves the value by the same amount every time.' then 'old'
           when prompt = 'At 40.0000, 55.0000, 70.0000 and 85.0000 USD a barrel the same concept returns -197.2391, 909.0866, 2015.4123 and 3121.7380. Why is the step even?' and options = '["The engine interpolates between the two prices it was given a full run at, so the two middle figures are read off a straight line drawn between 40.0000 and 85.0000 USD a barrel.", "Royalty and tax are charged on what is left after costs, so the state absorbs the curvature in the cash flow and leaves the value rising evenly with each step in the price.", "The four prices are evenly spaced within one price deck, and a deck that covers every year of the profile always returns an even step in the value it prices out.", "Only what a barrel earns moves between the runs: the shape, the capex of 2250.0000 and the fiscal terms are identical in all four."]'::jsonb and answer_index = 3 and explanation = 'Each run prices the same 20 year shape on the same 2250.0000 of capex, so a step of 15.0000 USD a barrel moves the value by the same amount every time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 24'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 40.0000, 55.0000, 70.0000 and 85.0000 USD a barrel the same concept returns -197.2391, 909.0866, 2015.4123 and 3121.7380. Why is the step even?', options = '["The engine interpolates between the two prices it was given a full run at, so the two middle figures are read off a straight line drawn between 40.0000 and 85.0000 USD a barrel.", "Royalty and tax are charged on what is left after costs, so the state absorbs the curvature in the cash flow and leaves the value rising evenly with each step in the price.", "The four prices are evenly spaced within one price deck, and a deck that covers every year of the profile always returns an even step in the value it prices out.", "Only what a barrel earns moves between the runs: the shape, the capex of 2250.0000 and the fiscal terms are identical in all four."]'::jsonb, explanation = 'Each run prices the same 20 year shape on the same 2250.0000 of capex, so a step of 15.0000 USD a barrel moves the value by the same amount every time.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 25: prompt, explanation, option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The tie-back returns 1.436477 of NPV per million USD of capex against the FPSO''s 0.910029. What does a ranking on that ratio leave out?' and options = '["Size: a ratio has none in it, and on a balance sheet that can carry 2250.0000 the FPSO leaves 2047.5653 million USD where the tie-back would have left 1048.6281.", "The price, because both ratios are conditional on the 70.0000 USD a barrel the two runs shared and the ranking between them turns over as soon as either is priced at 48.0000.", "The fiscal terms, because both pay royalty of 12.5000 percent on different volumes and the ratio is taken before the state is paid.", "The operating cost, because the tie-back''s 40.0000 a year against the FPSO''s 95.0000 sits outside the capex the ratio divides by."]'::jsonb and answer_index = 0 and explanation = '1048.6281 on 730.0000 of capex is the more efficient use of the money and 2047.5653 on 2250.0000 is the larger value, and the two measures answer different questions.' then 'old'
           when prompt = 'The tie-back returns 1.388655 of NPV per million USD of capex against the FPSO''s 0.895739. What does a ranking on that ratio leave out?' and options = '["Size: a ratio has none in it, and on a balance sheet that can carry 2250.0000 the FPSO leaves 2015.4123 million USD where the tie-back would have left 1013.7182.", "The price, because both ratios are conditional on the 70.0000 USD a barrel the two runs shared and the ranking between them turns over as soon as either is priced at 48.0000.", "The fiscal terms, because both pay royalty of 12.5000 percent on different volumes and the ratio is taken before the state is paid.", "The operating cost, because the tie-back''s 40.0000 a year against the FPSO''s 95.0000 sits outside the capex the ratio divides by."]'::jsonb and answer_index = 0 and explanation = '1013.7182 on 730.0000 of capex is the more efficient use of the money and 2015.4123 on 2250.0000 is the larger value, and the two measures answer different questions.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 25'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The tie-back returns 1.388655 of NPV per million USD of capex against the FPSO''s 0.895739. What does a ranking on that ratio leave out?', options = '["Size: a ratio has none in it, and on a balance sheet that can carry 2250.0000 the FPSO leaves 2015.4123 million USD where the tie-back would have left 1013.7182.", "The price, because both ratios are conditional on the 70.0000 USD a barrel the two runs shared and the ranking between them turns over as soon as either is priced at 48.0000.", "The fiscal terms, because both pay royalty of 12.5000 percent on different volumes and the ratio is taken before the state is paid.", "The operating cost, because the tie-back''s 40.0000 a year against the FPSO''s 95.0000 sits outside the capex the ratio divides by."]'::jsonb, explanation = '1013.7182 on 730.0000 of capex is the more efficient use of the money and 2015.4123 on 2250.0000 is the larger value, and the two measures answer different questions.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 26: prompt, explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Base case earns gross revenue of 16095.0492 million USD and reports a government take of 5321.9377. What is that take made of, and what share is it?' and options = '["Tax of 3310.0565 on its own, because royalty is a cost of production charged ahead of the tax base and is already carried inside the operating cost of 3049.6464 million USD.", "Royalty of 2011.8812 and tax of 3310.0565 added together, which is 0.330657 of gross revenue, a ratio rather than a percent.", "Royalty of 2011.8812 and tax of 3310.0565 added, which is 0.330657 percent of gross revenue under the stated default rates of 12.5000 percent and 30.0000 percent.", "Royalty of 2011.8812, tax of 3310.0565 and the capex of 2250.0000 the state recovers through the fiscal terms, which is why the take runs well above the NPV of 2047.5653."]'::jsonb and answer_index = 1 and explanation = '2011.8812 plus 3310.0565 is 5321.9377 million USD, and 0.330657 of gross revenue is a plain ratio: 0.330657 percent of it would be a different figure entirely.' then 'old'
           when prompt = 'The Base case earns gross revenue of 16095.0492 million USD and reports a government take of 5288.8051. What is that take made of, and what share is it?' and options = '["Tax of 3276.9239 on its own, because royalty is a cost of production charged ahead of the tax base and is already carried inside the operating cost of 3049.6464 million USD.", "Royalty of 2011.8812 and tax of 3276.9239 added together, which is 0.328598 of gross revenue, a ratio rather than a percent.", "Royalty of 2011.8812 and tax of 3276.9239 added, which is 0.328598 percent of gross revenue under the stated default rates of 12.5000 percent and 30.0000 percent.", "Royalty of 2011.8812, tax of 3276.9239 and the capex of 2250.0000 the state recovers through the fiscal terms, which is why the take runs well above the NPV of 2015.4123."]'::jsonb and answer_index = 1 and explanation = '2011.8812 plus 3276.9239 is 5288.8051 million USD, and 0.328598 of gross revenue is a plain ratio: 0.328598 percent of it would be a different figure entirely.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 26'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case earns gross revenue of 16095.0492 million USD and reports a government take of 5288.8051. What is that take made of, and what share is it?', options = '["Tax of 3276.9239 on its own, because royalty is a cost of production charged ahead of the tax base and is already carried inside the operating cost of 3049.6464 million USD.", "Royalty of 2011.8812 and tax of 3276.9239 added together, which is 0.328598 of gross revenue, a ratio rather than a percent.", "Royalty of 2011.8812 and tax of 3276.9239 added, which is 0.328598 percent of gross revenue under the stated default rates of 12.5000 percent and 30.0000 percent.", "Royalty of 2011.8812, tax of 3276.9239 and the capex of 2250.0000 the state recovers through the fiscal terms, which is why the take runs well above the NPV of 2015.4123."]'::jsonb, explanation = '2011.8812 plus 3276.9239 is 5288.8051 million USD, and 0.328598 of gross revenue is a plain ratio: 0.328598 percent of it would be a different figure entirely.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 28: explanation, option_0, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The plan carries a decommissioning provision of 260.0000 million USD and the Egina FPSO carries a decommissioning figure of 204.5029. What does the screening case charge?' and options = '["The 260.0000, in the final year of the 20.0000 year life, which is exactly why the Operate phase roll-up of 355.0000 stands so far above the annual operating cost of 95.0000.", "The 204.5029, because a facility figure is derived from the nameplate of 60000 bopd and the engine prefers a derived number.", "Neither of them: the case carries capex and operating cost only, so the 260.0000 falls outside the CAPEX total of 2250.0000 and outside the OPEX of 95.0000 a year.", "Both, as one abandonment line of the two added, which is what separates the lifecycle cost of 4150.0000 from the value of 2047.5653."]'::jsonb and answer_index = 2 and explanation = 'The engine totals CAPEX 2250.0000 and OPEX 95.0000 a year, so a value of 2047.5653 million USD is a screening value with an abandonment cost still to come.' then 'old'
           when prompt = 'The plan carries a decommissioning provision of 260.0000 million USD and the Egina FPSO carries a decommissioning figure of 204.5029. What does the screening case charge?' and options = '["Neither of them, because the case carries capex and operating cost only, so both figures sit outside the CAPEX total of 2250.0000 and outside the OPEX of 95.0000 a year.", "The 204.5029, because a facility figure is derived from the nameplate of 60000 bopd and the engine prefers a derived number.", "The 260.0000, charged in production year 20 as the plan''s end-of-life cost, while the facility''s 204.5029 is replaced by it rather than added to it.", "Both, as one abandonment line of the two added, which is what separates the lifecycle cost of 4150.0000 from the value of 2015.4123."]'::jsonb and answer_index = 2 and explanation = 'An ABEX cost item replaces the facility estimate and is never added to it, and charging the 260.0000 costs the plan 32.1530 million USD of present value against the 2047.5653 the same case is worth without it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 28'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The plan carries a decommissioning provision of 260.0000 million USD and the Egina FPSO carries a decommissioning figure of 204.5029. What does the screening case charge?', options = '["Neither of them, because the case carries capex and operating cost only, so both figures sit outside the CAPEX total of 2250.0000 and outside the OPEX of 95.0000 a year.", "The 204.5029, because a facility figure is derived from the nameplate of 60000 bopd and the engine prefers a derived number.", "The 260.0000, charged in production year 20 as the plan''s end-of-life cost, while the facility''s 204.5029 is replaced by it rather than added to it.", "Both, as one abandonment line of the two added, which is what separates the lifecycle cost of 4150.0000 from the value of 2015.4123."]'::jsonb, explanation = 'An ABEX cost item replaces the facility estimate and is never added to it, and charging the 260.0000 costs the plan 32.1530 million USD of present value against the 2047.5653 the same case is worth without it.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 29: option_1
  select case
           when prompt = 'A three year profile given two prices is refused. What does the refusal say, and what does the same profile do once a third price is entered?' and options = '["It says the deck has no price for production year 3 and asks for a price for every year of the profile, and with three prices the case runs and returns an NPV of -202.4284.", "It says the scenario oil price is missing, which is the message a blank price returns, and with a third price entered the case runs and returns an NPV of -3517.4133.", "It extends the last price it holds across year 3 and warns that the deck was short, and with three prices returns the same value.", "It refuses the plan rather than the scenario, so completeness falls to 89 percent, and with the third price entered the plan reads 100 percent and prices normally again."]'::jsonb and answer_index = 0 and explanation = 'The message names the year: "the price deck has no price for production year 3: enter a price for every year of the profile", and the complete deck prices out at -202.4284.' then 'old'
           when prompt = 'A three year profile given two prices is refused. What does the refusal say, and what does the same profile do once a third price is entered?' and options = '["It says the deck has no price for production year 3 and asks for a price for every year of the profile, and with three prices the case runs and returns an NPV of -202.4284.", "It says the scenario oil price is missing, which is the message a blank price returns, and with a third price entered the case runs and returns an NPV of -3554.2621.", "It extends the last price it holds across year 3 and warns that the deck was short, and with three prices returns the same value.", "It refuses the plan rather than the scenario, so completeness falls to 89 percent, and with the third price entered the plan reads 100 percent and prices normally again."]'::jsonb and answer_index = 0 and explanation = 'The message names the year: "the price deck has no price for production year 3: enter a price for every year of the profile", and the complete deck prices out at -202.4284.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 29'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A three year profile given two prices is refused. What does the refusal say, and what does the same profile do once a third price is entered?', options = '["It says the deck has no price for production year 3 and asks for a price for every year of the profile, and with three prices the case runs and returns an NPV of -202.4284.", "It says the scenario oil price is missing, which is the message a blank price returns, and with a third price entered the case runs and returns an NPV of -3554.2621.", "It extends the last price it holds across year 3 and warns that the deck was short, and with three prices returns the same value.", "It refuses the plan rather than the scenario, so completeness falls to 89 percent, and with the third price entered the plan reads 100 percent and prices normally again."]'::jsonb, explanation = 'The message names the year: "the price deck has no price for production year 3: enter a price for every year of the profile", and the complete deck prices out at -202.4284.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 30: prompt
  select case
           when prompt = 'Moving the Production driver up 30 percent takes the plan''s case to 3467.3636 million USD. What has that run done to the 130.0000 MMbbl the reserves table holds?' and options = '["It raises the recoverable volume by the same 30 percent, because the sweep re-runs the whole case and the reserves table is one of the inputs that gets re-run with it, so the table and the profile stay in step through every row of the sweep.", "Nothing, and nothing checks it: the sweep scales the concept''s screening shape, and that shape was drawn from a peak rate and a life without consulting the reserves in the first place.", "It leaves the table alone but caps the run, since the engine stops the profile once cumulative production reaches the oil P50 of 130.0000 MMbbl.", "It swaps the oil P10 of 205.0000 MMbbl into the case in place of the P50, which is how the studio prices a production upside."]'::jsonb and answer_index = 1 and explanation = 'The shape already produces 229.9293 MMbbl against an oil P50 of 130.0000 MMbbl before the driver is moved at all, and the plan still scores complete and still returns a value.' then 'old'
           when prompt = 'Moving the Production driver up 30 percent takes the plan''s case to 3437.8310 million USD. What has that run done to the 130.0000 MMbbl the reserves table holds?' and options = '["It raises the recoverable volume by the same 30 percent, because the sweep re-runs the whole case and the reserves table is one of the inputs that gets re-run with it, so the table and the profile stay in step through every row of the sweep.", "Nothing, and nothing checks it: the sweep scales the concept''s screening shape, and that shape was drawn from a peak rate and a life without consulting the reserves in the first place.", "It leaves the table alone but caps the run, since the engine stops the profile once cumulative production reaches the oil P50 of 130.0000 MMbbl.", "It swaps the oil P10 of 205.0000 MMbbl into the case in place of the P50, which is how the studio prices a production upside."]'::jsonb and answer_index = 1 and explanation = 'The shape already produces 229.9293 MMbbl against an oil P50 of 130.0000 MMbbl before the driver is moved at all, and the plan still scores complete and still returns a value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 30'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Moving the Production driver up 30 percent takes the plan''s case to 3437.8310 million USD. What has that run done to the 130.0000 MMbbl the reserves table holds?', options = '["It raises the recoverable volume by the same 30 percent, because the sweep re-runs the whole case and the reserves table is one of the inputs that gets re-run with it, so the table and the profile stay in step through every row of the sweep.", "Nothing, and nothing checks it: the sweep scales the concept''s screening shape, and that shape was drawn from a peak rate and a life without consulting the reserves in the first place.", "It leaves the table alone but caps the run, since the engine stops the profile once cumulative production reaches the oil P50 of 130.0000 MMbbl.", "It swaps the oil P10 of 205.0000 MMbbl into the case in place of the P50, which is how the studio prices a production upside."]'::jsonb, explanation = 'The shape already produces 229.9293 MMbbl against an oil P50 of 130.0000 MMbbl before the driver is moved at all, and the plan still scores complete and still returns a value.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 31: prompt, explanation
  select case
           when prompt = 'The sweep moves the value by 3092.0051 on oil price and by 2839.5965 on production. Why is price the stronger of the two?' and options = '["Production is capped by the concept''s peak rate of 60.0000 kbpd, so a rise of 30 percent cannot be delivered through the plateau years and only the declining years actually move.", "Royalty of 12.5000 percent falls on revenue from both drivers, while tax of 30.0000 percent is charged on the barrels alone.", "A move in the oil price also moves the capex of 2250.0000 through the cost items, so its swing carries a second effect.", "A barrel carries a variable operating cost of 5.0000 USD, so more barrels bring more cost with the revenue, while a dollar of price brings revenue and no cost."]'::jsonb and answer_index = 3 and explanation = 'Both drivers scale revenue, but 30 percent more barrels brings 30 percent more variable operating cost with it, which is why 3092.0051 runs above 2839.5965.' then 'old'
           when prompt = 'The sweep moves the value by 3097.7119 on oil price and by 2844.8375 on production. Why is price the stronger of the two?' and options = '["Production is capped by the concept''s peak rate of 60.0000 kbpd, so a rise of 30 percent cannot be delivered through the plateau years and only the declining years actually move.", "Royalty of 12.5000 percent falls on revenue from both drivers, while tax of 30.0000 percent is charged on the barrels alone.", "A move in the oil price also moves the capex of 2250.0000 through the cost items, so its swing carries a second effect.", "A barrel carries a variable operating cost of 5.0000 USD, so more barrels bring more cost with the revenue, while a dollar of price brings revenue and no cost."]'::jsonb and answer_index = 3 and explanation = 'Both drivers scale revenue, but 30 percent more barrels brings 30 percent more variable operating cost with it, which is why 3097.7119 runs above 2844.8375.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 31'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The sweep moves the value by 3097.7119 on oil price and by 2844.8375 on production. Why is price the stronger of the two?', options = '["Production is capped by the concept''s peak rate of 60.0000 kbpd, so a rise of 30 percent cannot be delivered through the plateau years and only the declining years actually move.", "Royalty of 12.5000 percent falls on revenue from both drivers, while tax of 30.0000 percent is charged on the barrels alone.", "A move in the oil price also moves the capex of 2250.0000 through the cost items, so its swing carries a second effect.", "A barrel carries a variable operating cost of 5.0000 USD, so more barrels bring more cost with the revenue, while a dollar of price brings revenue and no cost."]'::jsonb, explanation = 'Both drivers scale revenue, but 30 percent more barrels brings 30 percent more variable operating cost with it, which is why 3097.7119 runs above 2844.8375.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 32: option_0, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reviewer subtracts the FPSO concept''s lifecycle cost of 4150.0000 million USD from the Base case''s gross revenue of 16095.0492 and calls the remainder what the development is worth. What has that produced?' and options = '["The undiscounted value of the development, which becomes the 2047.5653 million USD once the 10.0000 percent rate has been applied to it year by year across the 21 rows the case carries.", "The right figure on the wrong scale, since gross revenue is money across the whole life and a lifecycle cost is money as it is spent, so the two would have to be put on one basis before either could be taken from the other.", "A figure on no scale the studio uses: it leaves the royalty of 2011.8812 and the tax of 3310.0565 inside the revenue and discounts nothing, while the value on those terms is 2047.5653 million USD.", "The government take of 5321.9377 million USD reached the long way round, because royalty and tax are exactly what separate gross revenue from a lifecycle cost."]'::jsonb and answer_index = 2 and explanation = 'A lifecycle cost is a plain sum of capex and operating cost with no price, no fiscal terms and no discounting in it, so it cannot be subtracted from a revenue to leave a value.' then 'old'
           when prompt = 'A reviewer subtracts the FPSO concept''s lifecycle cost of 4150.0000 million USD from the Base case''s gross revenue of 16095.0492 and calls the remainder what the development is worth. What has that produced?' and options = '["The undiscounted value of the development, which becomes the 2015.4123 million USD once the 10.0000 percent rate has been applied to it year by year across the 21 rows the case carries.", "The right figure on the wrong scale, since gross revenue is money across the whole life and a lifecycle cost is money as it is spent, so the two would have to be put on one basis before either could be taken from the other.", "A figure on no scale the studio uses: it leaves the royalty of 2011.8812 and the tax of 3276.9239 inside the revenue and discounts nothing, while the value on those terms is 2015.4123 million USD.", "The government take of 5288.8051 million USD reached the long way round, because royalty and tax are exactly what separate gross revenue from a lifecycle cost."]'::jsonb and answer_index = 2 and explanation = 'A lifecycle cost is a plain sum of capex and operating cost with no price, no fiscal terms and no discounting in it, so it cannot be subtracted from a revenue to leave a value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 32'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer subtracts the FPSO concept''s lifecycle cost of 4150.0000 million USD from the Base case''s gross revenue of 16095.0492 and calls the remainder what the development is worth. What has that produced?', options = '["The undiscounted value of the development, which becomes the 2015.4123 million USD once the 10.0000 percent rate has been applied to it year by year across the 21 rows the case carries.", "The right figure on the wrong scale, since gross revenue is money across the whole life and a lifecycle cost is money as it is spent, so the two would have to be put on one basis before either could be taken from the other.", "A figure on no scale the studio uses: it leaves the royalty of 2011.8812 and the tax of 3276.9239 inside the revenue and discounts nothing, while the value on those terms is 2015.4123 million USD.", "The government take of 5288.8051 million USD reached the long way round, because royalty and tax are exactly what separate gross revenue from a lifecycle cost."]'::jsonb, explanation = 'A lifecycle cost is a plain sum of capex and operating cost with no price, no fiscal terms and no discounting in it, so it cannot be subtracted from a revenue to leave a value.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 34: explanation, option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A worked answer reports an oil reserves figure, a rate of return and a value per million USD of capex. What unit does each of the three carry?' and options = '["MMbbl for the oil, a ratio for the rate of return, and million USD for the value per million USD of capex, which is why it prints as 1.436477 alongside the money in the plan.", "MMbbl for the oil, percent for the rate of return such as 29.5998, and a plain number for the ratio such as 1.436477.", "A barrel of oil equivalent basis for the oil once the 70.0000 Bcf of gas has been carried into it, percent for the rate of return, and percent again for the ratio that follows it.", "MMbbl for the oil, percent for the rate of return of 29.5998 and for the government take of 0.330657 as well, and million USD for the value per million USD of capex."]'::jsonb and answer_index = 1 and explanation = 'A percent and a ratio are different animals: 0.330657 of gross revenue is not 0.330657 percent of it, and 1.436477 is a plain number carrying no unit at all.' then 'old'
           when prompt = 'A worked answer reports an oil reserves figure, a rate of return and a value per million USD of capex. What unit does each of the three carry?' and options = '["MMbbl for the oil, a ratio for the rate of return, and million USD for the value per million USD of capex, which is why it prints as 1.388655 alongside the money in the plan.", "MMbbl for the oil, percent for a rate of return, and a plain number for the ratio such as 1.388655.", "A barrel of oil equivalent basis for the oil once the 70.0000 Bcf of gas has been carried into it, percent for the rate of return, and percent again for the ratio that follows it.", "MMbbl for the oil, percent for the rate of return and for the government take of 0.328598 as well, and million USD for the value per million USD of capex."]'::jsonb and answer_index = 1 and explanation = 'A percent and a ratio are different animals: 0.328598 of gross revenue is not 0.328598 percent of it, and 1.388655 is a plain number carrying no unit at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 34'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A worked answer reports an oil reserves figure, a rate of return and a value per million USD of capex. What unit does each of the three carry?', options = '["MMbbl for the oil, a ratio for the rate of return, and million USD for the value per million USD of capex, which is why it prints as 1.388655 alongside the money in the plan.", "MMbbl for the oil, percent for a rate of return, and a plain number for the ratio such as 1.388655.", "A barrel of oil equivalent basis for the oil once the 70.0000 Bcf of gas has been carried into it, percent for the rate of return, and percent again for the ratio that follows it.", "MMbbl for the oil, percent for the rate of return and for the government take of 0.328598 as well, and million USD for the value per million USD of capex."]'::jsonb, explanation = 'A percent and a ratio are different animals: 0.328598 of gross revenue is not 0.328598 percent of it, and 1.388655 is a plain number carrying no unit at all.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6b_exam ord 38: prompt, explanation
  select case
           when prompt = 'A plan reports P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, CAPEX 2250.0000, NPV 2047.5653, IRR 29.5998 and 4 wells. What does a reader need before quoting that NPV?' and options = '["The completeness score, because a plan below 100 percent carries an error list and an NPV quoted off an incomplete plan is exactly the case the studio puts a warning against.", "The gas P50 of 70.0000 Bcf, because the screening case prices both fluids and a value quoted without it understates the field.", "Which capex it ran on, which price priced it and which production shape it burned, because the figure is one concept at 70.0000 USD a barrel on default terms.", "The well count of 4, because the capex of 2250.0000 is divided across the wells the list carries."]'::jsonb and answer_index = 2 and explanation = '2047.5653 million USD belongs to the FPSO concept at 70.0000 USD a barrel on 2250.0000 of capex and a 20 year shape, and at 18.0000 USD a barrel the same concept reads -1797.2732.' then 'old'
           when prompt = 'A plan reports P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, CAPEX 2250.0000, NPV 2015.4123, IRR none and 4 wells. What does a reader need before quoting that NPV?' and options = '["The completeness score, because a plan below 100 percent carries an error list and an NPV quoted off an incomplete plan is exactly the case the studio puts a warning against.", "The gas P50 of 70.0000 Bcf, because the screening case prices both fluids and a value quoted without it understates the field.", "Which capex it ran on, which price priced it and which production shape it burned, because the figure is one concept at 70.0000 USD a barrel on default terms.", "The well count of 4, because the capex of 2250.0000 is divided across the wells the list carries."]'::jsonb and answer_index = 2 and explanation = '2015.4123 million USD belongs to the FPSO concept at 70.0000 USD a barrel on 2250.0000 of capex and a 20 year shape, and at 18.0000 USD a barrel the same concept reads -1834.1220.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6b_exam ord 38'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6b_exam ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A plan reports P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, CAPEX 2250.0000, NPV 2015.4123, IRR none and 4 wells. What does a reader need before quoting that NPV?', options = '["The completeness score, because a plan below 100 percent carries an error list and an NPV quoted off an incomplete plan is exactly the case the studio puts a warning against.", "The gas P50 of 70.0000 Bcf, because the screening case prices both fluids and a value quoted without it understates the field.", "Which capex it ran on, which price priced it and which production shape it burned, because the figure is one concept at 70.0000 USD a barrel on default terms.", "The well count of 4, because the capex of 2250.0000 is divided across the wells the list carries."]'::jsonb, explanation = '2015.4123 million USD belongs to the FPSO concept at 70.0000 USD a barrel on 2250.0000 of capex and a 20 year shape, and at 18.0000 USD a barrel the same concept reads -1834.1220.'
     where app_slug = 'fdp' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6b_exam ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the count assertions --
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC6 recut refused: beginner holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC6 recut refused: intermediate holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC6 recut refused: advanced holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fdp';
  if v_count <> 396 then raise exception 'EC6 recut refused: fdp holds % questions, expected 396', v_count; end if;

  raise notice 'EC6 recut beginner: % of 52 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-what-a-plan-holds', 2),
    ('module', 'm01-what-a-plan-holds', 3),
    ('module', 'm01-what-a-plan-holds', 8),
    ('module', 'm01-what-a-plan-holds', 9),
    ('module', 'm01-what-a-plan-holds', 10),
    ('module', 'm01-what-a-plan-holds', 11),
    ('module', 'm01-what-a-plan-holds', 13),
    ('module', 'm02-reserves-per-fluid', 11),
    ('module', 'm03-concepts-and-their-capex', 10),
    ('module', 'm03-concepts-and-their-capex', 11),
    ('module', 'm04-what-a-scenario-is-worth', 1),
    ('module', 'm04-what-a-scenario-is-worth', 2),
    ('module', 'm04-what-a-scenario-is-worth', 3),
    ('module', 'm04-what-a-scenario-is-worth', 4),
    ('module', 'm04-what-a-scenario-is-worth', 8),
    ('module', 'm04-what-a-scenario-is-worth', 10),
    ('module', 'm04-what-a-scenario-is-worth', 11),
    ('module', 'm04-what-a-scenario-is-worth', 12),
    ('module', 'm04-what-a-scenario-is-worth', 13),
    ('module', 'm04-what-a-scenario-is-worth', 15),
    ('module', 'm05-the-plan-s-own-economics', 1),
    ('module', 'm05-the-plan-s-own-economics', 5),
    ('module', 'm05-the-plan-s-own-economics', 8),
    ('module', 'm05-the-plan-s-own-economics', 10),
    ('module', 'm05-the-plan-s-own-economics', 11),
    ('module', 'm05-the-plan-s-own-economics', 12),
    ('module', 'm05-the-plan-s-own-economics', 13),
    ('module', 'm06-the-associate-reading', 2),
    ('module', 'm06-the-associate-reading', 6),
    ('module', 'm06-the-associate-reading', 7),
    ('module', 'm06-the-associate-reading', 8),
    ('module', 'm06-the-associate-reading', 12),
    ('module', 'm06-the-associate-reading', 15),
    ('final', null::text, 5),
    ('final', null::text, 6),
    ('final', null::text, 10),
    ('final', null::text, 12),
    ('final', null::text, 16),
    ('final', null::text, 18),
    ('final', null::text, 21),
    ('final', null::text, 22),
    ('final', null::text, 23),
    ('final', null::text, 24),
    ('final', null::text, 25),
    ('final', null::text, 26),
    ('final', null::text, 28),
    ('final', null::text, 29),
    ('final', null::text, 30),
    ('final', null::text, 31),
    ('final', null::text, 32),
    ('final', null::text, 34),
    ('final', null::text, 38)
)
select 'ec6 recut beginner' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fdp' and q.tier = 'beginner'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec6 recut beginner' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fdp' and tier = 'beginner'
 group by scope, module_key
 order by scope desc, module_key nulls last;
