-- ============================================================================
-- EC6 RECUT, EXPERT TIER (advanced): Field Development Planning
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
-- WHAT MOVES. 56 of the 132 Expert questions, 15 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to change, the new correct
-- text was written at the SAME index, so the key balance and key pattern of
-- every bank are untouched. No ord, no module key, no scope and no row count
-- moves.
-- Fields rewritten: 31 prompts, 65 options, 31 explanations.
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
-- NEW text in docs/ec6-abex-recut/MANIFEST-advanced.json was independently
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

  -- ec6a_m01 ord 1: prompt, explanation
  select case
           when prompt = 'The EGINA Base scenario reports an internal rate of return of 29.5998 percent with the status ok. Where does that number come from?' and options = '["It is the screening threshold the studio applies to an FPSO concept, carried on the concept beside its three capex fields of 520.0000, 1350.0000 and 380.0000.", "It is the discount rate the net present value of 2047.5653 million USD was struck at, which the studio raises above its default of 10.0000 percent for a long shape.", "It is solved: the discount rate that drives this flow''s net present value to zero, fixed by the capex of 2250.0000 million USD, the shape, the price and the terms.", "It is a score the engine formed about the concept, weighing the money returned against the 2250.0000 million USD committed."]'::jsonb and answer_index = 2 and explanation = 'Nobody chose 29.5998. Year 0 spends 2250.0000 and the years after it earn, and the rate falls out of that flow; the value of 2047.5653 was taken at 10.0000 percent.' then 'old'
           when prompt = 'Run the EGINA Base case with no end-of-life cost and it reports an internal rate of return of 29.5998 percent at the status ok. Where does that number come from?' and options = '["It is the screening threshold the studio applies to an FPSO concept, carried on the concept beside its three capex fields of 520.0000, 1350.0000 and 380.0000.", "It is the discount rate the net present value of 2047.5653 million USD was struck at, which the studio raises above its default of 10.0000 percent for a long shape.", "It is solved: the discount rate that drives this flow''s net present value to zero, fixed by the capex of 2250.0000 million USD, the shape, the price and the terms.", "It is a score the engine formed about the concept, weighing the money returned against the 2250.0000 million USD committed."]'::jsonb and answer_index = 2 and explanation = 'Nobody chose 29.5998. Year 0 spends 2250.0000 and the years after it earn, and the rate falls out of that flow; charge the plan''s end-of-life cost and the same case is worth 2015.4123 with two roots and no rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 1;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Run the EGINA Base case with no end-of-life cost and it reports an internal rate of return of 29.5998 percent at the status ok. Where does that number come from?', options = '["It is the screening threshold the studio applies to an FPSO concept, carried on the concept beside its three capex fields of 520.0000, 1350.0000 and 380.0000.", "It is the discount rate the net present value of 2047.5653 million USD was struck at, which the studio raises above its default of 10.0000 percent for a long shape.", "It is solved: the discount rate that drives this flow''s net present value to zero, fixed by the capex of 2250.0000 million USD, the shape, the price and the terms.", "It is a score the engine formed about the concept, weighing the money returned against the 2250.0000 million USD committed."]'::jsonb, explanation = 'Nobody chose 29.5998. Year 0 spends 2250.0000 and the years after it earn, and the rate falls out of that flow; charge the plan''s end-of-life cost and the same case is worth 2015.4123 with two roots and no rate.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 2: prompt, explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'At 40.0000 USD a barrel the same concept reports a rate of 8.2444 percent and a net present value of -161.0098 million USD. How are both true at once?' and options = '["The flow turns positive, so a root exists at 8.2444 percent, and the value was struck at a discount rate of 10.0000 percent, which is more than this flow earns.", "The rate is solved before royalty at 12.5000 percent and tax at 30.0000 percent while the value is struck after them, so the two are reading one flow at different points.", "The search failed at that price and returned a floor, so -161.0098 million USD is the real finding and 8.2444 percent is only where the solver gave up.", "A rate under the discount rate is recorded by convention rather than solved, as the published zero production case records 0 beside its value of -979.6325."]'::jsonb and answer_index = 0 and explanation = 'A positive rate is not a profitable one. 8.2444 is below the 10.0000 percent the money is charged at, and the -161.0098 is that comparison already made.' then 'old'
           when prompt = 'At 40.0000 USD a barrel the concept is worth -197.2391 million USD and reports no rate of return at all, at the status multiple-roots. What is that status saying about the flow?' and options = '["It changes sign more than once, so more than one discount rate zeroes it and the engine will name none of them the rate of return.", "The search ran out of range before it reached a root, so the status stands in for a rate the engine could see but not confirm inside the band.", "The value fell below zero, and the engine withholds a rate on any case whose value is negative at the screening discount of 10.0000 percent.", "No root exists at all here, in the way a flow that only spends has none, which is the reading the status no-sign-change carries."]'::jsonb and answer_index = 0 and explanation = 'The plan pays 260.0000 million USD to abandon the field in production year 20, so every earning case here changes sign twice; the value of -197.2391 is defined all the same.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 40.0000 USD a barrel the concept is worth -197.2391 million USD and reports no rate of return at all, at the status multiple-roots. What is that status saying about the flow?', options = '["It changes sign more than once, so more than one discount rate zeroes it and the engine will name none of them the rate of return.", "The search ran out of range before it reached a root, so the status stands in for a rate the engine could see but not confirm inside the band.", "The value fell below zero, and the engine withholds a rate on any case whose value is negative at the screening discount of 10.0000 percent.", "No root exists at all here, in the way a flow that only spends has none, which is the reading the status no-sign-change carries."]'::jsonb, explanation = 'The plan pays 260.0000 million USD to abandon the field in production year 20, so every earning case here changes sign twice; the value of -197.2391 is defined all the same.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 3: prompt, explanation, option_2
  select case
           when prompt = 'The Base cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. Why can a rate be solved for this flow at all?' and options = '["Each of the first three years earns 795.8125, and a flow whose early years are equal always carries exactly one root for the search to find.", "The cumulative reaches 137.4375 inside the concept life of 20.0000 years, which is the crossing the search requires before it will report any rate.", "The net present value of 2047.5653 million USD is positive, and a positive value guarantees a root somewhere inside the band of -99 to 1000 percent.", "It starts negative and later turns positive, so some discount rate brings the discounted total to zero."]'::jsonb and answer_index = 3 and explanation = 'Discounting punishes the late positive years harder than the year 0 spend of -2250.0000, so a rate exists; a flow that never turns has none.' then 'old'
           when prompt = 'The Base cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. Why is that climb the reason a discount rate can zero this flow at all?' and options = '["Each of the first three years earns 795.8125, and a flow whose early years are equal always carries exactly one root for the search to find.", "The cumulative reaches 137.4375 inside the concept life of 20.0000 years, which is the crossing the search requires before it will report any rate.", "The net present value of 2015.4123 million USD is positive, and a positive value guarantees a root somewhere inside the band of -99 to 1000 percent.", "It starts negative and later turns positive, so some discount rate brings the discounted total to zero."]'::jsonb and answer_index = 3 and explanation = 'Discounting punishes the late positive years harder than the year 0 spend of -2250.0000, so a rate that zeroes it exists, and on this plan two of them do; a flow that never turns has none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 3;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. Why is that climb the reason a discount rate can zero this flow at all?', options = '["Each of the first three years earns 795.8125, and a flow whose early years are equal always carries exactly one root for the search to find.", "The cumulative reaches 137.4375 inside the concept life of 20.0000 years, which is the crossing the search requires before it will report any rate.", "The net present value of 2015.4123 million USD is positive, and a positive value guarantees a root somewhere inside the band of -99 to 1000 percent.", "It starts negative and later turns positive, so some discount rate brings the discounted total to zero."]'::jsonb, explanation = 'Discounting punishes the late positive years harder than the year 0 spend of -2250.0000, so a rate that zeroes it exists, and on this plan two of them do; a flow that never turns has none.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 4: prompt, explanation
  select case
           when prompt = 'What makes the Base net present value of 2047.5653 million USD and the tie-back''s 1048.6281 comparable numbers?' and options = '["Both concepts total their capex from the same three fields, which puts the two values onto one basis whatever price each of them was separately run at.", "Both were struck at a discount rate of 10.0000 percent on the same oil price of 70.0000 USD a barrel, which is what puts them on one basis.", "Both scenarios report the status ok, which the engine sets only where two cases share a fiscal basis and one discount rate.", "Both clear a screening hurdle of 15 percent, which puts every case that passes onto one footing."]'::jsonb and answer_index = 1 and explanation = 'The rates differ, 40.4321 against 29.5998, and so does the capex, 730.0000 against 2250.0000; what the two values share is the price and the discount rate.' then 'old'
           when prompt = 'What makes the Base net present value of 2015.4123 million USD and the tie-back''s 1013.7182 comparable numbers?' and options = '["Both concepts total their capex from the same three fields, which puts the two values onto one basis whatever price each of them was separately run at.", "Both were struck at a discount rate of 10.0000 percent on the same oil price of 70.0000 USD a barrel, which is what puts them on one basis.", "Both scenarios report the status ok, which the engine sets only where two cases share a fiscal basis and one discount rate.", "Both clear a screening hurdle of 15 percent, which puts every case that passes onto one footing."]'::jsonb and answer_index = 1 and explanation = 'Neither case carries a rate at all, and the capex differs, 730.0000 against 2250.0000; what the two values share is the price and the discount rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 4;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What makes the Base net present value of 2015.4123 million USD and the tie-back''s 1013.7182 comparable numbers?', options = '["Both concepts total their capex from the same three fields, which puts the two values onto one basis whatever price each of them was separately run at.", "Both were struck at a discount rate of 10.0000 percent on the same oil price of 70.0000 USD a barrel, which is what puts them on one basis.", "Both scenarios report the status ok, which the engine sets only where two cases share a fiscal basis and one discount rate.", "Both clear a screening hurdle of 15 percent, which puts every case that passes onto one footing."]'::jsonb, explanation = 'Neither case carries a rate at all, and the capex differs, 730.0000 against 2250.0000; what the two values share is the price and the discount rate.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 5: prompt, explanation, option_0, option_1, option_3
  select case
           when prompt = 'Value per million of capex is 1.436477 for the tie-back and 0.910029 for the FPSO. What does that pair establish?' and options = '["The tie-back is worth more money, since 1.436477 is the share of the field''s total value that its capex captures against the FPSO''s 0.910029.", "The FPSO is the more efficient user of capital, since its 0.910029 is spread over a life of 20.0000 years against the tie-back''s 15.0000.", "Every million the tie-back commits works harder, and there is far less of it committed: 730.0000 million USD against 2250.0000.", "The two concepts are interchangeable, since 1.436477 and 0.910029 both sit above zero."]'::jsonb and answer_index = 2 and explanation = 'A plan that stops at the tie-back leaves the rest of the field undeveloped rather than earning 0.910029 per million on it, which is why 1048.6281 is less than 2047.5653.' then 'old'
           when prompt = 'Value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO. What does that pair establish?' and options = '["The tie-back is worth more money, since 1.388655 is the share of the field''s total value that its capex captures against the FPSO''s 0.895739.", "The FPSO is the more efficient user of capital, since its 0.895739 is spread over a life of 20.0000 years against the tie-back''s 15.0000.", "Every million the tie-back commits works harder, and there is far less of it committed: 730.0000 million USD against 2250.0000.", "The two concepts are interchangeable, since 1.388655 and 0.895739 both sit above zero."]'::jsonb and answer_index = 2 and explanation = 'A plan that stops at the tie-back leaves the rest of the field undeveloped rather than earning 0.895739 per million on it, which is why 1013.7182 is less than 2015.4123.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 5;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO. What does that pair establish?', options = '["The tie-back is worth more money, since 1.388655 is the share of the field''s total value that its capex captures against the FPSO''s 0.895739.", "The FPSO is the more efficient user of capital, since its 0.895739 is spread over a life of 20.0000 years against the tie-back''s 15.0000.", "Every million the tie-back commits works harder, and there is far less of it committed: 730.0000 million USD against 2250.0000.", "The two concepts are interchangeable, since 1.388655 and 0.895739 both sit above zero."]'::jsonb, explanation = 'A plan that stops at the tie-back leaves the rest of the field undeveloped rather than earning 0.895739 per million on it, which is why 1013.7182 is less than 2015.4123.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 6: explanation
  select case
           when prompt = 'Two cash flows differ by a factor of three in every single year. What do their rates of return read?' and options = '["Rates three times apart, since the larger flow returns three times the money on the same shape and a rate carries the size of the money through.", "Whatever their paybacks imply, since payback and rate are both indifferent to size and therefore move together on any pair of flows.", "No rate at all for the smaller of the two, since a flow scaled down towards the floor of -99 percent loses the crossing that the search needs.", "The same rate, because a rate is a percentage and divides out the scale of the flow before it reports."]'::jsonb and answer_index = 3 and explanation = 'The tie-back''s 40.4321 percent says nothing about its 730.0000 million USD of capex, which is why 1048.6281 sits under a higher rate than 2047.5653.' then 'old'
           when prompt = 'Two cash flows differ by a factor of three in every single year. What do their rates of return read?' and options = '["Rates three times apart, since the larger flow returns three times the money on the same shape and a rate carries the size of the money through.", "Whatever their paybacks imply, since payback and rate are both indifferent to size and therefore move together on any pair of flows.", "No rate at all for the smaller of the two, since a flow scaled down towards the floor of -99 percent loses the crossing that the search needs.", "The same rate, because a rate is a percentage and divides out the scale of the flow before it reports."]'::jsonb and answer_index = 3 and explanation = 'The tie-back''s higher root of 40.4136 says nothing about its 730.0000 million USD of capex, which is why 1013.7182 sits under a higher figure than 2015.4123.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 6;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two cash flows differ by a factor of three in every single year. What do their rates of return read?', options = '["Rates three times apart, since the larger flow returns three times the money on the same shape and a rate carries the size of the money through.", "Whatever their paybacks imply, since payback and rate are both indifferent to size and therefore move together on any pair of flows.", "No rate at all for the smaller of the two, since a flow scaled down towards the floor of -99 percent loses the crossing that the search needs.", "The same rate, because a rate is a percentage and divides out the scale of the flow before it reports."]'::jsonb, explanation = 'The tie-back''s higher root of 40.4136 says nothing about its 730.0000 million USD of capex, which is why 1013.7182 sits under a higher figure than 2015.4123.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 7: option_0
  select case
           when prompt = 'A published suite case spends 100000 in capex and reports a value of -92616.5020, a rate of -36.6747 percent and the status ok. Why is the status ok?' and options = '["The status records only that the engine priced the case without refusing one of its inputs, so any run that produced a number carries it.", "The flow changes sign, the search found a verified root inside the band of -99 to 1000 percent, and that root simply happens to be negative.", "The rate cleared the floor of -99 percent, and ok marks any rate the band contains.", "The value of -92616.5020 is a real number rather than a null, which is what ok reports."]'::jsonb and answer_index = 1 and explanation = 'A rate of -36.6747 percent says the money came back and came back short, which is a real answer; a null with a status would have said something else.' then 'old'
           when prompt = 'A published suite case spends 100000 in capex and reports a value of -92616.5020, a rate of -36.6747 percent and the status ok. Why is the status ok?' and options = '["The status records only that the engine priced the case without refusing one of its inputs, so any run that produced a number at all carries it, whatever the search itself found.", "The flow changes sign, the search found a verified root inside the band of -99 to 1000 percent, and that root simply happens to be negative.", "The rate cleared the floor of -99 percent, and ok marks any rate the band contains.", "The value of -92616.5020 is a real number rather than a null, which is what ok reports."]'::jsonb and answer_index = 1 and explanation = 'A rate of -36.6747 percent says the money came back and came back short, which is a real answer; a null with a status would have said something else.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 7;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published suite case spends 100000 in capex and reports a value of -92616.5020, a rate of -36.6747 percent and the status ok. Why is the status ok?', options = '["The status records only that the engine priced the case without refusing one of its inputs, so any run that produced a number at all carries it, whatever the search itself found.", "The flow changes sign, the search found a verified root inside the band of -99 to 1000 percent, and that root simply happens to be negative.", "The rate cleared the floor of -99 percent, and ok marks any rate the band contains.", "The value of -92616.5020 is a real number rather than a null, which is what ok reports."]'::jsonb, explanation = 'A rate of -36.6747 percent says the money came back and came back short, which is a real answer; a null with a status would have said something else.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 8: prompt, option_3
  select case
           when prompt = 'Three cases all lose money: one reads -92616.5020 with a rate, one reads -1797.2732 with the status no-root, and one reads -524.1537 with no-sign-change. What separates them?' and options = '["Only the first has a rate: the second changes sign with no rate in the band zeroing it, and the third never changes sign at all.", "Nothing that matters at screening, since all three destroy value and a status records only how far the search ran.", "The size of the loss, since a loss as deep as -92616.5020 always admits a root while -524.1537 leaves nothing to find.", "The discount rate each was struck at, since -1797.2732 and -524.1537 were taken at rates outside the band."]'::jsonb and answer_index = 0 and explanation = 'A reader who files all three under a bad rate has lost the difference between a project that returned money badly and one that returned none.' then 'old'
           when prompt = 'Three cases all lose money: one reads -92616.5020 with a rate, one reads -1834.1220 with the status no-root, and one reads -524.1537 with no-sign-change. What separates them?' and options = '["Only the first has a rate: the second changes sign with no rate in the band zeroing it, and the third never changes sign at all.", "Nothing that matters at screening, since all three destroy value and a status records only how far the search ran.", "The size of the loss, since a loss as deep as -92616.5020 always admits a root while -524.1537 leaves nothing to find.", "The discount rate each was struck at, since -1834.1220 and -524.1537 were taken at rates outside the band."]'::jsonb and answer_index = 0 and explanation = 'A reader who files all three under a bad rate has lost the difference between a project that returned money badly and one that returned none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three cases all lose money: one reads -92616.5020 with a rate, one reads -1834.1220 with the status no-root, and one reads -524.1537 with no-sign-change. What separates them?', options = '["Only the first has a rate: the second changes sign with no rate in the band zeroing it, and the third never changes sign at all.", "Nothing that matters at screening, since all three destroy value and a status records only how far the search ran.", "The size of the loss, since a loss as deep as -92616.5020 always admits a root while -524.1537 leaves nothing to find.", "The discount rate each was struck at, since -1834.1220 and -524.1537 were taken at rates outside the band."]'::jsonb, explanation = 'A reader who files all three under a bad rate has lost the difference between a project that returned money badly and one that returned none.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 9: option_0
  select case
           when prompt = 'A team suppresses any rate below zero on their screening cards, on the grounds that a minus sign looks like an error. What have they given up?' and options = '["Nothing at all, since the EGINA rates run 29.5998, 40.4321, 43.8693 and 14.4152 percent.", "The floor of the search, since hiding rates below zero narrows the band upward from -99 percent.", "The difference between a project that returned money badly at -36.6747 percent and one with no root at all, which the engine marks with a null and a status naming the reason.", "The payback column, since a case with a negative rate never pays back and must be hidden alongside."]'::jsonb and answer_index = 2 and explanation = 'The published case at -36.6747 percent carries the status ok on a value of -92616.5020, while the 18.0000 USD a barrel case has no rate to print at all.' then 'old'
           when prompt = 'A team suppresses any rate below zero on their screening cards, on the grounds that a minus sign looks like an error. What have they given up?' and options = '["Nothing at all, since every EGINA case reports a rate above the screening discount of 10.0000 percent.", "The floor of the search, since hiding rates below zero narrows the band upward from -99 percent.", "The difference between a project that returned money badly at -36.6747 percent and one with no root at all, which the engine marks with a null and a status naming the reason.", "The payback column, since a case with a negative rate never pays back and must be hidden alongside."]'::jsonb and answer_index = 2 and explanation = 'The published case at -36.6747 percent carries the status ok on a value of -92616.5020, while the 18.0000 USD a barrel case has no rate to print at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 9;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A team suppresses any rate below zero on their screening cards, on the grounds that a minus sign looks like an error. What have they given up?', options = '["Nothing at all, since every EGINA case reports a rate above the screening discount of 10.0000 percent.", "The floor of the search, since hiding rates below zero narrows the band upward from -99 percent.", "The difference between a project that returned money badly at -36.6747 percent and one with no root at all, which the engine marks with a null and a status naming the reason.", "The payback column, since a case with a negative rate never pays back and must be hidden alongside."]'::jsonb, explanation = 'The published case at -36.6747 percent carries the status ok on a value of -92616.5020, while the 18.0000 USD a barrel case has no rate to print at all.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 10: option_3
  select case
           when prompt = 'The Base case reports payback of 3.8273 years. What does that figure record?' and options = '["The cumulative first turned positive inside year 3, moving from -658.3750 up to 137.4375, so the crossing falls part way through the year.", "The discounted cash flow first exceeded the capex of 2250.0000 million USD there, which is the point the engine measures a discounted payback to.", "The third full year of production closed at 137.4375 and the remaining fraction is the share of year 4 added for discounting.", "The engine interpolated between the year 3 and year 4 positions of 137.4375 and 847.0187 to find where the rate of 29.5998 percent is met."]'::jsonb and answer_index = 0 and explanation = 'Year 0 spends 2250.0000 and each of the first three years earns 795.8125, which walks the cumulative back up through zero inside year 3.' then 'old'
           when prompt = 'The Base case reports payback of 3.8273 years. What does that figure record?' and options = '["The cumulative first turned positive inside year 3, moving from -658.3750 up to 137.4375, so the crossing falls part way through the year.", "The discounted cash flow first exceeded the capex of 2250.0000 million USD there, which is the point the engine measures a discounted payback to.", "The third full year of production closed at 137.4375 and the remaining fraction is the share of year 4 added for discounting.", "The engine interpolated between the year 3 and year 4 positions of 137.4375 and 847.0187 to find where the discounted flow meets the capex of 2250.0000."]'::jsonb and answer_index = 0 and explanation = 'Year 0 spends 2250.0000 and each of the first three years earns 795.8125, which walks the cumulative back up through zero inside year 3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base case reports payback of 3.8273 years. What does that figure record?', options = '["The cumulative first turned positive inside year 3, moving from -658.3750 up to 137.4375, so the crossing falls part way through the year.", "The discounted cash flow first exceeded the capex of 2250.0000 million USD there, which is the point the engine measures a discounted payback to.", "The third full year of production closed at 137.4375 and the remaining fraction is the share of year 4 added for discounting.", "The engine interpolated between the year 3 and year 4 positions of 137.4375 and 847.0187 to find where the discounted flow meets the capex of 2250.0000."]'::jsonb, explanation = 'Year 0 spends 2250.0000 and each of the first three years earns 795.8125, which walks the cumulative back up through zero inside year 3.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 11: prompt
  select case
           when prompt = 'At 30.0000 USD a barrel the concept is worth -898.3507 million USD and the cumulative never reaches zero. What should the payback column carry?' and options = '["The concept life of 20.0000 years, the convention the published zero production case records beside its value of -979.6325.", "The payback of the nearest case that does pay back, 5.7734 years from the 48.0000 USD a barrel run, carried as an upper bound.", "Nothing at all, since a case the engine has refused to price carries neither a payback nor a rate and the status stands for both.", "Never, as a null, which is the measured answer rather than missing data."]'::jsonb and answer_index = 3 and explanation = 'Substituting the project life turns the clearest finding a screening case can make into a plausible looking 20.0000; at 18.0000 USD a barrel the answer is the same null.' then 'old'
           when prompt = 'At 30.0000 USD a barrel the concept is worth -935.1995 million USD and the cumulative never reaches zero. What should the payback column carry?' and options = '["The concept life of 20.0000 years, the convention the published zero production case records beside its value of -979.6325.", "The payback of the nearest case that does pay back, 5.7734 years from the 48.0000 USD a barrel run, carried as an upper bound.", "Nothing at all, since a case the engine has refused to price carries neither a payback nor a rate and the status stands for both.", "Never, as a null, which is the measured answer rather than missing data."]'::jsonb and answer_index = 3 and explanation = 'Substituting the project life turns the clearest finding a screening case can make into a plausible looking 20.0000; at 18.0000 USD a barrel the answer is the same null.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 30.0000 USD a barrel the concept is worth -935.1995 million USD and the cumulative never reaches zero. What should the payback column carry?', options = '["The concept life of 20.0000 years, the convention the published zero production case records beside its value of -979.6325.", "The payback of the nearest case that does pay back, 5.7734 years from the 48.0000 USD a barrel run, carried as an upper bound.", "Nothing at all, since a case the engine has refused to price carries neither a payback nor a rate and the status stands for both.", "Never, as a null, which is the measured answer rather than missing data."]'::jsonb, explanation = 'Substituting the project life turns the clearest finding a screening case can make into a plausible looking 20.0000; at 18.0000 USD a barrel the answer is the same null.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 13: prompt, explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The Low price scenario returns 14.4152 percent and fails a screening hurdle of 15 percent. What did the hurdle reject?' and options = '["A case worth 427.9436 million USD at a discount rate of 10.0000 percent, rejected correctly by the hurdle''s own rule since 14.4152 is below 15.", "A case the engine had already priced as a loss, so the hurdle gave nothing away.", "A case worth less than nothing at the screening discount rate of 10.0000 percent.", "A concept rather than a scenario, since a hurdle is applied to a capex of 2250.0000."]'::jsonb and answer_index = 0 and explanation = 'The rule fired correctly, and the 427.9436 million USD it turned down is money the field would otherwise not have had at all.' then 'old'
           when prompt = 'The Low price scenario is worth 392.8013 million USD and reports no rate of return at all, so a screening hurdle of 15 percent has nothing to test. What does the hurdle do with it?' and options = '["Nothing it can act on: the card has no rate to colour, and the figure that survives is the 392.8013 million USD the case is worth at a discount rate of 10.0000 percent.", "It rejects the case as a loss, since a case the engine gives no rate has already been priced below zero.", "It passes the case, since a scenario with no rate clears any threshold until a rate is entered against it.", "It applies itself to the concept''s capex of 2250.0000 instead, since a threshold has to test some figure."]'::jsonb and answer_index = 0 and explanation = 'The rule needs a rate and the engine reports none, so the verdict is missing rather than negative, and the 392.8013 million USD is money the field would otherwise not have had.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Low price scenario is worth 392.8013 million USD and reports no rate of return at all, so a screening hurdle of 15 percent has nothing to test. What does the hurdle do with it?', options = '["Nothing it can act on: the card has no rate to colour, and the figure that survives is the 392.8013 million USD the case is worth at a discount rate of 10.0000 percent.", "It rejects the case as a loss, since a case the engine gives no rate has already been priced below zero.", "It passes the case, since a scenario with no rate clears any threshold until a rate is entered against it.", "It applies itself to the concept''s capex of 2250.0000 instead, since a threshold has to test some figure."]'::jsonb, explanation = 'The rule needs a rate and the engine reports none, so the verdict is missing rather than negative, and the 392.8013 million USD is money the field would otherwise not have had.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 14: explanation, option_0, option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A screening process filters on a hurdle and then sorts the survivors by how far each cleared it. What does that do to the EGINA scenarios?' and options = '["It produces an order that matches the values, since the margin above a hurdle grows with the size of the case and 2047.5653 million USD leads it.", "It places the tie-back above the Base, 40.4321 percent against 29.5998, so 1048.6281 million USD outranks 2047.5653.", "It produces no order at all, since a hurdle returns a pass or a fail and no margin above the threshold to sort on.", "It puts the two concepts on separate lists, since 730.0000 and 2250.0000 are not the same commitment."]'::jsonb and answer_index = 1 and explanation = 'The hurdle divides the scale out before it tests anything, and nothing on the page shows that 2047.5653 was the larger amount of money.' then 'old'
           when prompt = 'A screening process filters on a hurdle and then sorts the survivors by how far each cleared it. What does that do to the EGINA scenarios?' and options = '["It produces an order that matches the values, since the margin above a hurdle grows with the size of the case and 2015.4123 million USD leads it.", "It sorts nothing at all, since not one of the five carries a rate to clear a hurdle by, and 3638.0233, 2015.4123, 1013.7182 and 392.8013 go unranked.", "It ranks them on the higher of the two rates that zero each flow, which puts the tie-back''s 40.4136 above the Base''s 29.5779 and so puts the tie-back first of all.", "It puts the two concepts on separate lists, since 730.0000 and 2250.0000 are not the same commitment."]'::jsonb and answer_index = 1 and explanation = 'The hurdle divides the scale out before it tests anything, and here there is nothing to divide: the card reports no rate on any EGINA case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 14;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening process filters on a hurdle and then sorts the survivors by how far each cleared it. What does that do to the EGINA scenarios?', options = '["It produces an order that matches the values, since the margin above a hurdle grows with the size of the case and 2015.4123 million USD leads it.", "It sorts nothing at all, since not one of the five carries a rate to clear a hurdle by, and 3638.0233, 2015.4123, 1013.7182 and 392.8013 go unranked.", "It ranks them on the higher of the two rates that zero each flow, which puts the tie-back''s 40.4136 above the Base''s 29.5779 and so puts the tie-back first of all.", "It puts the two concepts on separate lists, since 730.0000 and 2250.0000 are not the same commitment."]'::jsonb, explanation = 'The hurdle divides the scale out before it tests anything, and here there is nothing to divide: the card reports no rate on any EGINA case.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m01 ord 15: explanation, option_1
  select case
           when prompt = 'A screening case is discounted at 10.0000 percent and a hurdle of 15 percent is then applied to its rate. How do the two relate?' and options = '["They are one test stated twice, since a value taken at 10.0000 percent is positive exactly when the rate clears 15 percent and negative when it does not.", "The hurdle replaces the discount rate for any case the engine returns a rate for, so the Base value of 2047.5653 million USD is restated at the higher rate.", "They are two different tests, one charging future money before the value is struck and one a policy applied to the rate afterwards.", "The engine derives the hurdle from the default terms of royalty 12.5000 percent and tax 30.0000 percent."]'::jsonb and answer_index = 2 and explanation = 'The Low price case passes the first test, since 427.9436 million USD is positive, and fails the second at 14.4152 percent; which of them decides is a policy somebody set.' then 'old'
           when prompt = 'A screening case is discounted at 10.0000 percent and a hurdle of 15 percent is then applied to its rate. How do the two relate?' and options = '["They are one test stated twice, since a value taken at 10.0000 percent is positive exactly when the rate clears 15 percent and negative when it does not.", "The hurdle replaces the discount rate for any case the engine returns a rate for, so the Base value of 2015.4123 million USD is restated at the higher rate.", "They are two different tests, one charging future money before the value is struck and one a policy applied to the rate afterwards.", "The engine derives the hurdle from the default terms of royalty 12.5000 percent and tax 30.0000 percent."]'::jsonb and answer_index = 2 and explanation = 'The Low price case passes the first test, since 392.8013 million USD is positive, and the second has no rate to test at all; which of them decides is a policy somebody set.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m01 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m01 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening case is discounted at 10.0000 percent and a hurdle of 15 percent is then applied to its rate. How do the two relate?', options = '["They are one test stated twice, since a value taken at 10.0000 percent is positive exactly when the rate clears 15 percent and negative when it does not.", "The hurdle replaces the discount rate for any case the engine returns a rate for, so the Base value of 2015.4123 million USD is restated at the higher rate.", "They are two different tests, one charging future money before the value is struck and one a policy applied to the rate afterwards.", "The engine derives the hurdle from the default terms of royalty 12.5000 percent and tax 30.0000 percent."]'::jsonb, explanation = 'The Low price case passes the first test, since 392.8013 million USD is positive, and the second has no rate to test at all; which of them decides is a policy somebody set.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-rate-of-return' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m01 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 7: explanation
  select case
           when prompt = 'A screening case comes back above-clamp. What is the first thing to check?' and options = '["The band, which should be widened until the root appears so that 15389.6875 percent can be carried onto the management page.", "The value, since a case above the clamp is a marginal one and belongs with the failures until its rate can be stated properly.", "The capex, since a case clearing 1000 percent usually has one that is wrong, missing or entered in the wrong units.", "The discount rate, since a root above the band means the case was struck at a rate too low for the shape the concept implies."]'::jsonb and answer_index = 2 and explanation = 'A real development case sits far inside the band, the Base at 29.5998 percent and the tie-back at 40.4321, so a four figure root is a prompt about the inputs.' then 'old'
           when prompt = 'A screening case comes back above-clamp. What is the first thing to check?' and options = '["The band, which should be widened until the root appears so that 15389.6875 percent can be carried onto the management page.", "The value, since a case above the clamp is a marginal one and belongs with the failures until its rate can be stated properly.", "The capex, since a case clearing 1000 percent usually has one that is wrong, missing or entered in the wrong units.", "The discount rate, since a root above the band means the case was struck at a rate too low for the shape the concept implies."]'::jsonb and answer_index = 2 and explanation = 'A real development case sits far inside the band: every rate that zeroes an EGINA flow falls between -66.9344 and 43.8661 percent, so a four figure root is a prompt about the inputs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 7;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening case comes back above-clamp. What is the first thing to check?', options = '["The band, which should be widened until the root appears so that 15389.6875 percent can be carried onto the management page.", "The value, since a case above the clamp is a marginal one and belongs with the failures until its rate can be stated properly.", "The capex, since a case clearing 1000 percent usually has one that is wrong, missing or entered in the wrong units.", "The discount rate, since a root above the band means the case was struck at a rate too low for the shape the concept implies."]'::jsonb, explanation = 'A real development case sits far inside the band: every rate that zeroes an EGINA flow falls between -66.9344 and 43.8661 percent, so a four figure root is a prompt about the inputs.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 8: explanation
  select case
           when prompt = 'Three of the five statuses withhold a rate for three different reasons. Which reading of them is right?' and options = '["no-sign-change says no root exists, above-clamp says a root exists above the band the search covers, and no-root says the flow changes sign and no rate inside the band zeroes it.", "no-sign-change says the search ran out of iterations, above-clamp says the root sits at the edge of the band, and no-root says the value came out negative.", "no-sign-change says the capex is missing, above-clamp says the capex is too small, and no-root says the price deck is shorter than the profile.", "no-sign-change says the rate is zero, above-clamp says the rate is 1000 percent, and no-root says the rate is somewhere the engine will not name."]'::jsonb and answer_index = 0 and explanation = 'None of the three means zero and none of them is a rate. At 18.0000 USD a barrel the status is no-root on a value of -1797.2732 million USD.' then 'old'
           when prompt = 'Three of the five statuses withhold a rate for three different reasons. Which reading of them is right?' and options = '["no-sign-change says no root exists, above-clamp says a root exists above the band the search covers, and no-root says the flow changes sign and no rate inside the band zeroes it.", "no-sign-change says the search ran out of iterations, above-clamp says the root sits at the edge of the band, and no-root says the value came out negative.", "no-sign-change says the capex is missing, above-clamp says the capex is too small, and no-root says the price deck is shorter than the profile.", "no-sign-change says the rate is zero, above-clamp says the rate is 1000 percent, and no-root says the rate is somewhere the engine will not name."]'::jsonb and answer_index = 0 and explanation = 'None of the three means zero and none of them is a rate. At 18.0000 USD a barrel the status is no-root on a value of -1834.1220 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three of the five statuses withhold a rate for three different reasons. Which reading of them is right?', options = '["no-sign-change says no root exists, above-clamp says a root exists above the band the search covers, and no-root says the flow changes sign and no rate inside the band zeroes it.", "no-sign-change says the search ran out of iterations, above-clamp says the root sits at the edge of the band, and no-root says the value came out negative.", "no-sign-change says the capex is missing, above-clamp says the capex is too small, and no-root says the price deck is shorter than the profile.", "no-sign-change says the rate is zero, above-clamp says the rate is 1000 percent, and no-root says the rate is somewhere the engine will not name."]'::jsonb, explanation = 'None of the three means zero and none of them is a rate. At 18.0000 USD a barrel the status is no-root on a value of -1834.1220 million USD.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 11: prompt, explanation, option_0, option_1
  select case
           when prompt = 'At 30.0000 USD a barrel the concept reads multiple-roots and at 18.0000 it reads no-root. What is the difference between those two answers?' and options = '["How far each value sits below zero, -898.3507 against -1797.2732 million USD, with multiple-roots kept for the shallower of the two losses.", "Whether a payback exists, since the case at 30.0000 USD a barrel pays back inside its life and the case at 18.0000 never does.", "Which search was run, since multiple-roots comes from the band of -99 to 1000 percent and no-root from a second pass made outside that band.", "Whether any rate zeroes the flow at all, since one crosses zero more than once and the other crosses nowhere the band reaches."]'::jsonb and answer_index = 3 and explanation = 'Reading the two as synonyms loses the finding. Both are worth stating, -898.3507 and -1797.2732, and neither of them carries a rate.' then 'old'
           when prompt = 'At 30.0000 USD a barrel the concept reads no-root and at 70.0000 USD a barrel it reads multiple-roots. What is the difference between those two answers?' and options = '["How far each value sits below zero, since a loss as shallow as -935.1995 still admits roots and a deeper one does not.", "Whether a payback exists, since the case at 70.0000 USD a barrel pays back in 3.8273 years and the case at 30.0000 never does, which is what the two statuses record.", "Which search was run, since multiple-roots comes from the band of -99 to 1000 percent and no-root from a second pass made outside that band.", "Whether any rate zeroes the flow at all, since one crosses zero more than once and the other crosses nowhere the band reaches."]'::jsonb and answer_index = 3 and explanation = 'Reading the two as synonyms loses the finding: at 30.0000 USD a barrel no rate zeroes the flow at all, and at 70.0000 two do, on values of -935.1995 and 2015.4123.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 30.0000 USD a barrel the concept reads no-root and at 70.0000 USD a barrel it reads multiple-roots. What is the difference between those two answers?', options = '["How far each value sits below zero, since a loss as shallow as -935.1995 still admits roots and a deeper one does not.", "Whether a payback exists, since the case at 70.0000 USD a barrel pays back in 3.8273 years and the case at 30.0000 never does, which is what the two statuses record.", "Which search was run, since multiple-roots comes from the band of -99 to 1000 percent and no-root from a second pass made outside that band.", "Whether any rate zeroes the flow at all, since one crosses zero more than once and the other crosses nowhere the band reaches."]'::jsonb, explanation = 'Reading the two as synonyms loses the finding: at 30.0000 USD a barrel no rate zeroes the flow at all, and at 70.0000 two do, on values of -935.1995 and 2015.4123.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 13: prompt
  select case
           when prompt = 'At 18.0000 USD a barrel the concept is worth -1797.2732 million USD. Before the repair the engine reported a rate there. What was the number, and what was it a property of?' and options = '["1000 percent, the top of its own search band, which is a property of the search and not of the cash flow it was run on.", "1000 percent, the highest rate the flow reaches at any point in its life, verified before it was returned.", "A null with no status, which readers filled in by hand because a card would not draw without a number.", "The floor of -99 percent, since a loss this deep drives the search to the bottom of the band."]'::jsonb and answer_index = 0 and explanation = 'The flow does change sign, since year 0 spends 2250.0000 and later years earn, so a naive search starts looking and simply never finds a crossing.' then 'old'
           when prompt = 'At 18.0000 USD a barrel the concept is worth -1834.1220 million USD. Before the repair the engine reported a rate there. What was the number, and what was it a property of?' and options = '["1000 percent, the top of its own search band, which is a property of the search and not of the cash flow it was run on.", "1000 percent, the highest rate the flow reaches at any point in its life, verified before it was returned.", "A null with no status, which readers filled in by hand because a card would not draw without a number.", "The floor of -99 percent, since a loss this deep drives the search to the bottom of the band."]'::jsonb and answer_index = 0 and explanation = 'The flow does change sign, since year 0 spends 2250.0000 and later years earn, so a naive search starts looking and simply never finds a crossing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 18.0000 USD a barrel the concept is worth -1834.1220 million USD. Before the repair the engine reported a rate there. What was the number, and what was it a property of?', options = '["1000 percent, the top of its own search band, which is a property of the search and not of the cash flow it was run on.", "1000 percent, the highest rate the flow reaches at any point in its life, verified before it was returned.", "A null with no status, which readers filled in by hand because a card would not draw without a number.", "The floor of -99 percent, since a loss this deep drives the search to the bottom of the band."]'::jsonb, explanation = 'The flow does change sign, since year 0 spends 2250.0000 and later years earn, so a naive search starts looking and simply never finds a crossing.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 14: option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The clamp of 1000 percent survived a long time on the cards. What made it so hard to notice?' and options = '["It appeared only on cases the engine refused elsewhere as well, so the rate was never the number a reader was actually looking at on the card.", "It moved with the price deck as a solved rate would, so no reader could tell it apart from the 29.5998 percent that the Base case reports.", "It cleared every threshold anyone would set, so it was coloured green on a case whose value of -1797.2732 million USD says the opposite.", "It was printed with no status beside it, and the four statuses that name a refusal arrived only in the repair that removed the clamp."]'::jsonb and answer_index = 2 and explanation = 'Nothing about 1000 percent announces that it came from the boundary; the failure is silent, and the contradicting value was printed next to it the whole time.' then 'old'
           when prompt = 'The clamp of 1000 percent survived a long time on the cards. What made it so hard to notice?' and options = '["It appeared only on cases the engine refused elsewhere as well, so the rate was never the number a reader was actually looking at on the card.", "It moved with the price deck as a solved rate would, so no reader could tell it apart from the rates the engine reports on the cases that have one.", "It cleared every threshold anyone would set, so it was coloured green on a case whose value of -1834.1220 million USD says the opposite.", "It was printed with no status beside it, and the four statuses that name a refusal arrived only in the repair that removed the clamp."]'::jsonb and answer_index = 2 and explanation = 'Nothing about 1000 percent announces that it came from the boundary; the failure is silent, and the contradicting value was printed next to it the whole time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 14;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The clamp of 1000 percent survived a long time on the cards. What made it so hard to notice?', options = '["It appeared only on cases the engine refused elsewhere as well, so the rate was never the number a reader was actually looking at on the card.", "It moved with the price deck as a solved rate would, so no reader could tell it apart from the rates the engine reports on the cases that have one.", "It cleared every threshold anyone would set, so it was coloured green on a case whose value of -1834.1220 million USD says the opposite.", "It was printed with no status beside it, and the four statuses that name a refusal arrived only in the repair that removed the clamp."]'::jsonb, explanation = 'Nothing about 1000 percent announces that it came from the boundary; the failure is silent, and the contradicting value was printed next to it the whole time.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m02 ord 15: option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What is the tell that a reported rate came from a boundary rather than from a solution?' and options = '["It carries the status ok, which the repaired engine now keeps for a verified root and which the clamped search set on every single run it made.", "It sits exactly on the limit of the search range, where the engine''s genuine answers do not: 29.5998, 40.4321, 14.4152 and -36.6747 percent.", "It appears beside a payback of never, which is the pairing the repaired engine refuses and the clamped search produced freely.", "It is printed to one decimal place while a solved root carries four, which is how a boundary can be spotted on a card."]'::jsonb and answer_index = 1 and explanation = 'A solver landing precisely on its own limit has returned a return code; the published tax floor case is the same shape at -944.3201 with the status no-root.' then 'old'
           when prompt = 'What is the tell that a reported rate came from a boundary rather than from a solution?' and options = '["It carries the status ok, which the repaired engine now keeps for a verified root and which the clamped search set on every single run it made.", "It sits exactly on the limit of the search range, where the engine''s genuine answers do not: -36.6747 percent on the published case, or the roots -44.3414 and 29.5779 on the plan''s own.", "It appears beside a payback of never, which is the pairing the repaired engine refuses and the clamped search produced freely.", "It is printed to one decimal place while a solved root carries four, which is how a boundary can be spotted on a card."]'::jsonb and answer_index = 1 and explanation = 'A solver landing precisely on its own limit has returned a return code; the published tax floor case is the same shape at -944.3201 with the status no-root.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m02 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m02 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What is the tell that a reported rate came from a boundary rather than from a solution?', options = '["It carries the status ok, which the repaired engine now keeps for a verified root and which the clamped search set on every single run it made.", "It sits exactly on the limit of the search range, where the engine''s genuine answers do not: -36.6747 percent on the published case, or the roots -44.3414 and 29.5779 on the plan''s own.", "It appears beside a payback of never, which is the pairing the repaired engine refuses and the clamped search produced freely.", "It is printed to one decimal place while a solved root carries four, which is how a boundary can be spotted on a card."]'::jsonb, explanation = 'A solver landing precisely on its own limit has returned a return code; the published tax floor case is the same shape at -944.3201 with the status no-root.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-when-there-is-no-rate' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m02 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 1: prompt, explanation, option_0
  select case
           when prompt = 'The minus 30 percent oil price end of the EGINA sweep is 501.5628. How was that figure produced?' and options = '["By scaling the base of 2047.5653 million USD down in proportion to the price move, which is what would make the two ends of the row symmetric about it.", "By taking the revenue of 16095.0492 down by 30 percent and carrying that difference straight through to the value the case finally reports.", "By discounting the base case at a rate 30 percent higher than 10.0000 percent, which is how the sweep expresses a fall in the price.", "By re-running the whole case with one input changed, royalty, tax, the discount at 10.0000 percent and the production shape all included."]'::jsonb and answer_index = 3 and explanation = 'A full re-calculation is why the ends are not symmetric about 2047.5653: 501.5628 and 3593.5679 are not the same distance from it.' then 'old'
           when prompt = 'The minus 30 percent oil price end of the EGINA sweep is 466.5563. How was that figure produced?' and options = '["By scaling the base of 2015.4123 million USD down in proportion to the price move, which is what would make the two ends of the row symmetric about it.", "By taking the revenue of 16095.0492 down by 30 percent and carrying that difference straight through to the value the case finally reports.", "By discounting the base case at a rate 30 percent higher than 10.0000 percent, which is how the sweep expresses a fall in the price.", "By re-running the whole case with one input changed, royalty, tax, the discount at 10.0000 percent and the production shape all included."]'::jsonb and answer_index = 3 and explanation = 'A full re-calculation is why the ends are not symmetric about 2015.4123: 466.5563 and 3564.2683 are not the same distance from it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 1;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The minus 30 percent oil price end of the EGINA sweep is 466.5563. How was that figure produced?', options = '["By scaling the base of 2015.4123 million USD down in proportion to the price move, which is what would make the two ends of the row symmetric about it.", "By taking the revenue of 16095.0492 down by 30 percent and carrying that difference straight through to the value the case finally reports.", "By discounting the base case at a rate 30 percent higher than 10.0000 percent, which is how the sweep expresses a fall in the price.", "By re-running the whole case with one input changed, royalty, tax, the discount at 10.0000 percent and the production shape all included."]'::jsonb, explanation = 'A full re-calculation is why the ends are not symmetric about 2015.4123: 466.5563 and 3564.2683 are not the same distance from it.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 2: explanation
  select case
           when prompt = 'What combination of moves can the EGINA sweep never show?' and options = '["A move of more than 30 percent in any driver, since the sweep re-runs the case only at the two ends its own convention fixes.", "Two drivers moving together, so a price fall arriving with a capex overrun sits outside the table entirely.", "A fall in the value produced by a rise in a driver, since three of the four drivers raise the value when they themselves rise.", "A move in the production shape, since the sweep changes when the plateau ends each time it scales the profile up or down."]'::jsonb and answer_index = 1 and explanation = 'The worst single figure in the table is 501.5628, which is the worst the sweep can produce and not the worst the project can suffer.' then 'old'
           when prompt = 'What combination of moves can the EGINA sweep never show?' and options = '["A move of more than 30 percent in any driver, since the sweep re-runs the case only at the two ends its own convention fixes.", "Two drivers moving together, so a price fall arriving with a capex overrun sits outside the table entirely.", "A fall in the value produced by a rise in a driver, since three of the four drivers raise the value when they themselves rise.", "A move in the production shape, since the sweep changes when the plateau ends each time it scales the profile up or down."]'::jsonb and answer_index = 1 and explanation = 'The worst single figure in the table is 466.5563, which is the worst the sweep can produce and not the worst the project can suffer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What combination of moves can the EGINA sweep never show?', options = '["A move of more than 30 percent in any driver, since the sweep re-runs the case only at the two ends its own convention fixes.", "Two drivers moving together, so a price fall arriving with a capex overrun sits outside the table entirely.", "A fall in the value produced by a rise in a driver, since three of the four drivers raise the value when they themselves rise.", "A move in the production shape, since the sweep changes when the plateau ends each time it scales the profile up or down."]'::jsonb, explanation = 'The worst single figure in the table is 466.5563, which is the worst the sweep can produce and not the worst the project can suffer.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 3: option_3
  select case
           when prompt = 'Ranked by swing the EGINA drivers run Oil Price, Production, CAPEX, OPEX. What does that ordering establish?' and options = '["Which input is most likely to move far enough to matter, which is what would let a drilling capex and a long run oil price be ranked against one another.", "Which input the engine is least certain of, since a wider swing reflects a looser estimate behind the number that was entered for it.", "Which input the value of this case is most exposed to, given a move of the same relative size, 30 percent either way, in each of the four drivers.", "Which input carries the most money, since a swing of 3092.0051 is the share of the revenue of 16095.0492 that the price controls."]'::jsonb and answer_index = 2 and explanation = 'A 30 percent move in a drilling capex and a 30 percent move in a long run oil price are not comparable events, and the ranking says nothing about either.' then 'old'
           when prompt = 'Ranked by swing the EGINA drivers run Oil Price, Production, CAPEX, OPEX. What does that ordering establish?' and options = '["Which input is most likely to move far enough to matter, which is what would let a drilling capex and a long run oil price be ranked against one another.", "Which input the engine is least certain of, since a wider swing reflects a looser estimate behind the number that was entered for it.", "Which input the value of this case is most exposed to, given a move of the same relative size, 30 percent either way, in each of the four drivers.", "Which input carries the most money, since a swing of 3097.7119 is the share of the revenue of 16095.0492 that the price controls."]'::jsonb and answer_index = 2 and explanation = 'A 30 percent move in a drilling capex and a 30 percent move in a long run oil price are not comparable events, and the ranking says nothing about either.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 3;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Ranked by swing the EGINA drivers run Oil Price, Production, CAPEX, OPEX. What does that ordering establish?', options = '["Which input is most likely to move far enough to matter, which is what would let a drilling capex and a long run oil price be ranked against one another.", "Which input the engine is least certain of, since a wider swing reflects a looser estimate behind the number that was entered for it.", "Which input the value of this case is most exposed to, given a move of the same relative size, 30 percent either way, in each of the four drivers.", "Which input carries the most money, since a swing of 3097.7119 is the share of the revenue of 16095.0492 that the price controls."]'::jsonb, explanation = 'A 30 percent move in a drilling capex and a 30 percent move in a long run oil price are not comparable events, and the ranking says nothing about either.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 4: prompt, explanation
  select case
           when prompt = 'A reviewer sets the EGINA price swing of 3092.0051 against a swing reported on a different project. What is wrong with that?' and options = '["Each swing is a share of its own base, so the two are not on one scale.", "The other project was not run on the same terms, royalty 12.5000 percent and tax 30.0000 percent, so only its ends may be compared.", "A swing is comparable only where both cases were discounted at 10.0000 percent, and a sweep does not record the rate it was run at.", "The sweep moves one driver at a time, so only a single driver swing from a single case may ever be set beside another on a page."]'::jsonb and answer_index = 0 and explanation = 'As a share of its own base the EGINA price swing is 1.510089, which is the figure that travels between cases; 3092.0051 does not travel.' then 'old'
           when prompt = 'A reviewer sets the EGINA price swing of 3097.7119 against a swing reported on a different project. What is wrong with that?' and options = '["Each swing is a share of its own base, so the two are not on one scale.", "The other project was not run on the same terms, royalty 12.5000 percent and tax 30.0000 percent, so only its ends may be compared.", "A swing is comparable only where both cases were discounted at 10.0000 percent, and a sweep does not record the rate it was run at.", "The sweep moves one driver at a time, so only a single driver swing from a single case may ever be set beside another on a page."]'::jsonb and answer_index = 0 and explanation = 'As a share of its own base the EGINA price swing is 1.537012, which is the figure that travels between cases; 3097.7119 does not travel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 4;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer sets the EGINA price swing of 3097.7119 against a swing reported on a different project. What is wrong with that?', options = '["Each swing is a share of its own base, so the two are not on one scale.", "The other project was not run on the same terms, royalty 12.5000 percent and tax 30.0000 percent, so only its ends may be compared.", "A swing is comparable only where both cases were discounted at 10.0000 percent, and a sweep does not record the rate it was run at.", "The sweep moves one driver at a time, so only a single driver swing from a single case may ever be set beside another on a page."]'::jsonb, explanation = 'As a share of its own base the EGINA price swing is 1.537012, which is the figure that travels between cases; 3097.7119 does not travel.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 5: prompt, explanation
  select case
           when prompt = 'A 30 percent move in price and a 30 percent move in production both scale revenue, yet the price swing is 3092.0051 and the production swing 2839.5965. Why?' and options = '["Royalty at 12.5000 percent and tax at 30.0000 percent fall on the price and not on the volume, which is where the two swings separate.", "A barrel carries its own variable operating cost of 5.0000 USD and a dollar of price does not, so the extra barrels give part of their earnings back.", "The production driver moves only the plateau while the price driver moves every year of the profile, so fewer years carry the volume move.", "The price driver is applied before discounting at 10.0000 percent and the production driver after it, which costs volume part of its effect."]'::jsonb and answer_index = 1 and explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492; royalty at 2011.8812 and tax at 3310.0565 take their share of both drivers alike.' then 'old'
           when prompt = 'A 30 percent move in price and a 30 percent move in production both scale revenue, yet the price swing is 3097.7119 and the production swing 2844.8375. Why?' and options = '["Royalty at 12.5000 percent and tax at 30.0000 percent fall on the price and not on the volume, which is where the two swings separate.", "A barrel carries its own variable operating cost of 5.0000 USD and a dollar of price does not, so the extra barrels give part of their earnings back.", "The production driver moves only the plateau while the price driver moves every year of the profile, so fewer years carry the volume move.", "The price driver is applied before discounting at 10.0000 percent and the production driver after it, which costs volume part of its effect."]'::jsonb and answer_index = 1 and explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492; royalty at 2011.8812 and tax at 3276.9239 take their share of both drivers alike.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 5;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A 30 percent move in price and a 30 percent move in production both scale revenue, yet the price swing is 3097.7119 and the production swing 2844.8375. Why?', options = '["Royalty at 12.5000 percent and tax at 30.0000 percent fall on the price and not on the volume, which is where the two swings separate.", "A barrel carries its own variable operating cost of 5.0000 USD and a dollar of price does not, so the extra barrels give part of their earnings back.", "The production driver moves only the plateau while the price driver moves every year of the profile, so fewer years carry the volume move.", "The price driver is applied before discounting at 10.0000 percent and the production driver after it, which costs volume part of its effect."]'::jsonb, explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492; royalty at 2011.8812 and tax at 3276.9239 take their share of both drivers alike.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 6: option_0
  select case
           when prompt = 'The published case with no royalty and no tax has a base of 2738.0331, price ends of 1651.9056 to 3824.1606 and production ends of 1735.4539 to 3740.6123. What does it settle?' and options = '["That the government take is what separates the two, since the base moves from 2047.5653 to 2738.0331 once royalty and tax come out of the case.", "That the ordering reverses on a case with no take, which is why the production ends of 1735.4539 and 3740.6123 are quoted beside the price ends.", "That the gap between price and volume is not a fiscal artefact, since price stays the wider driver even with the government take removed.", "That a case with no royalty and no tax carries no variable operating cost either, so both drivers move the value by the same amount."]'::jsonb and answer_index = 2 and explanation = 'Price is wider on every published case, this one included: 1651.9056 sits below 1735.4539 at the low end and 3824.1606 above 3740.6123 at the high end.' then 'old'
           when prompt = 'The published case with no royalty and no tax has a base of 2738.0331, price ends of 1651.9056 to 3824.1606 and production ends of 1735.4539 to 3740.6123. What does it settle?' and options = '["That the government take is what separates the two, since the base moves from 2015.4123 to 2738.0331 once royalty and tax come out of the case.", "That the ordering reverses on a case with no take, which is why the production ends of 1735.4539 and 3740.6123 are quoted beside the price ends.", "That the gap between price and volume is not a fiscal artefact, since price stays the wider driver even with the government take removed.", "That a case with no royalty and no tax carries no variable operating cost either, so both drivers move the value by the same amount."]'::jsonb and answer_index = 2 and explanation = 'Price is wider on every published case, this one included: 1651.9056 sits below 1735.4539 at the low end and 3824.1606 above 3740.6123 at the high end.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 6;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case with no royalty and no tax has a base of 2738.0331, price ends of 1651.9056 to 3824.1606 and production ends of 1735.4539 to 3740.6123. What does it settle?', options = '["That the government take is what separates the two, since the base moves from 2015.4123 to 2738.0331 once royalty and tax come out of the case.", "That the ordering reverses on a case with no take, which is why the production ends of 1735.4539 and 3740.6123 are quoted beside the price ends.", "That the gap between price and volume is not a fiscal artefact, since price stays the wider driver even with the government take removed.", "That a case with no royalty and no tax carries no variable operating cost either, so both drivers move the value by the same amount."]'::jsonb, explanation = 'Price is wider on every published case, this one included: 1651.9056 sits below 1735.4539 at the low end and 3824.1606 above 3740.6123 at the high end.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 8: explanation
  select case
           when prompt = 'What would close the gap between the price row and the production row of a sweep?' and options = '["A case with no royalty and no tax, since the government take is what charges the barrels rather than the price they are sold at.", "A larger case, since the example FPSO profile on a base of 10032.1182 carries a wider gap and a smaller case carries none at all.", "A longer life, since discounting at 10.0000 percent weighs the late barrels down and the price move is spread more evenly across the years.", "A case with no variable cost per barrel, since the gap comes from the operating cost the barrels carry."]'::jsonb and answer_index = 3 and explanation = 'A case with a higher variable cost per barrel separates them further, and the 5.0000 USD a barrel is what splits 3092.0051 from 2839.5965.' then 'old'
           when prompt = 'What would close the gap between the price row and the production row of a sweep?' and options = '["A case with no royalty and no tax, since the government take is what charges the barrels rather than the price they are sold at.", "A larger case, since the example FPSO profile on a base of 10032.1182 carries a wider gap and a smaller case carries none at all.", "A longer life, since discounting at 10.0000 percent weighs the late barrels down and the price move is spread more evenly across the years.", "A case with no variable cost per barrel, since the gap comes from the operating cost the barrels carry."]'::jsonb and answer_index = 3 and explanation = 'A case with a higher variable cost per barrel separates them further, and the 5.0000 USD a barrel is what splits 3097.7119 from 2844.8375.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What would close the gap between the price row and the production row of a sweep?', options = '["A case with no royalty and no tax, since the government take is what charges the barrels rather than the price they are sold at.", "A larger case, since the example FPSO profile on a base of 10032.1182 carries a wider gap and a smaller case carries none at all.", "A longer life, since discounting at 10.0000 percent weighs the late barrels down and the price move is spread more evenly across the years.", "A case with no variable cost per barrel, since the gap comes from the operating cost the barrels carry."]'::jsonb, explanation = 'A case with a higher variable cost per barrel separates them further, and the 5.0000 USD a barrel is what splits 3097.7119 from 2844.8375.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 9: prompt, option_0, option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The CAPEX row of the EGINA sweep reads 2691.1526 at one end and 1403.9781 at the other. Which end is the overrun?' and options = '["2691.1526, since the sweep prints the ends of every row in order of size and a cost driver always puts its worst outcome first of the two.", "2691.1526, since an overrun raises the capex and the sweep reports the higher value against the higher spend on the row.", "1403.9781, the plus 30 percent end of the row, and 2691.1526 is what the case is worth if the capex comes in 30 percent under.", "Neither of them, since a capex move changes the deepest cash position of -2250.0000 and not the value the sweep reports."]'::jsonb and answer_index = 2 and explanation = 'The sweep prints minus and then plus rather than in order of size, so this row runs high to low; read the label before the value.' then 'old'
           when prompt = 'The CAPEX row of the EGINA sweep reads 2658.9995 at one end and 1371.8250 at the other. Which end is the overrun?' and options = '["2658.9995, since the sweep prints the ends of every row in order of size and a cost driver always puts its worst outcome first of the two.", "2658.9995, since an overrun raises the capex and the sweep reports the higher value against the higher spend on the row.", "1371.8250, the plus 30 percent end of the row, and 2658.9995 is what the case is worth if the capex comes in 30 percent under.", "Neither of them, since a capex move changes the deepest cash position of -2250.0000 and not the value the sweep reports."]'::jsonb and answer_index = 2 and explanation = 'The sweep prints minus and then plus rather than in order of size, so this row runs high to low; read the label before the value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 9;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The CAPEX row of the EGINA sweep reads 2658.9995 at one end and 1371.8250 at the other. Which end is the overrun?', options = '["2658.9995, since the sweep prints the ends of every row in order of size and a cost driver always puts its worst outcome first of the two.", "2658.9995, since an overrun raises the capex and the sweep reports the higher value against the higher spend on the row.", "1371.8250, the plus 30 percent end of the row, and 2658.9995 is what the case is worth if the capex comes in 30 percent under.", "Neither of them, since a capex move changes the deepest cash position of -2250.0000 and not the value the sweep reports."]'::jsonb, explanation = 'The sweep prints minus and then plus rather than in order of size, so this row runs high to low; read the label before the value.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 10: prompt, explanation, option_3
  select case
           when prompt = 'Capex swings the value by 1287.1745 and operating cost by 323.8828 on the same relative move. What accounts for the difference?' and options = '["Capex lands in year 0 before a barrel is produced, where discounting touches it least, while operating cost spreads across the producing years and the later portions count for less.", "Capex is the larger input and the sweep moves each by 30 percent, so the two swings sit in the same ratio as the inputs.", "Capex is charged before royalty and tax while operating cost is charged after them, so the terms absorb part of the opex move.", "The capex bar is symmetric about the base of 2047.5653 and the operating cost bar is not, which stretches the capex swing."]'::jsonb and answer_index = 0 and explanation = 'As a share of base that is 0.628637 against 0.158179, and the capex move works directly on the deepest cash position of -2250.0000.' then 'old'
           when prompt = 'Capex swings the value by 1287.1745 and operating cost by 326.3064 on the same relative move. What accounts for the difference?' and options = '["Capex lands in year 0 before a barrel is produced, where discounting touches it least, while operating cost spreads across the producing years and the later portions count for less.", "Capex is the larger input and the sweep moves each by 30 percent, so the two swings sit in the same ratio as the inputs.", "Capex is charged before royalty and tax while operating cost is charged after them, so the terms absorb part of the opex move.", "The capex bar is symmetric about the base of 2015.4123 and the operating cost bar is not, which stretches the capex swing."]'::jsonb and answer_index = 0 and explanation = 'As a share of base that is 0.638666 against 0.161906, and the capex move works directly on the deepest cash position of -2250.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Capex swings the value by 1287.1745 and operating cost by 326.3064 on the same relative move. What accounts for the difference?', options = '["Capex lands in year 0 before a barrel is produced, where discounting touches it least, while operating cost spreads across the producing years and the later portions count for less.", "Capex is the larger input and the sweep moves each by 30 percent, so the two swings sit in the same ratio as the inputs.", "Capex is charged before royalty and tax while operating cost is charged after them, so the terms absorb part of the opex move.", "The capex bar is symmetric about the base of 2015.4123 and the operating cost bar is not, which stretches the capex swing."]'::jsonb, explanation = 'As a share of base that is 0.638666 against 0.161906, and the capex move works directly on the deepest cash position of -2250.0000.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 11: explanation, option_0, option_1, option_3
  select case
           when prompt = 'A chart ranks the four bars by their right hand end rather than by their swing. What does that do?' and options = '["It puts the base of 2047.5653 in the middle of the chart, which is where a sweep is read from in any case and costs its reader nothing at all.", "It reverses the ranking of Oil Price and Production, whose right hand ends of 3593.5679 and 3467.3636 sit fairly close together on the page.", "It sorts the two cost drivers as though their overruns were upsides, since the CAPEX and the OPEX rows both run from high to low.", "It drops OPEX from the chart, since its ends of 2209.5067 and 1885.6239 both sit above the right hand end of the capex row."]'::jsonb and answer_index = 2 and explanation = 'The swings are 3092.0051, 2839.5965, 1287.1745 and 323.8828, and only a swing puts the four rows of the sweep on one footing.' then 'old'
           when prompt = 'A chart ranks the four bars by their right hand end rather than by their swing. What does that do?' and options = '["It puts the base of 2015.4123 in the middle of the chart, which is where a sweep is read from in any case and costs its reader nothing at all.", "It reverses the ranking of Oil Price and Production, whose right hand ends of 3564.2683 and 3437.8310 sit fairly close together on the page.", "It sorts the two cost drivers as though their overruns were upsides, since the CAPEX and the OPEX rows both run from high to low.", "It drops OPEX from the chart, since its ends of 2178.5655 and 1852.2591 both sit above the right hand end of the capex row."]'::jsonb and answer_index = 2 and explanation = 'The swings are 3097.7119, 2844.8375, 1287.1745 and 326.3064, and only a swing puts the four rows of the sweep on one footing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A chart ranks the four bars by their right hand end rather than by their swing. What does that do?', options = '["It puts the base of 2015.4123 in the middle of the chart, which is where a sweep is read from in any case and costs its reader nothing at all.", "It reverses the ranking of Oil Price and Production, whose right hand ends of 3564.2683 and 3437.8310 sit fairly close together on the page.", "It sorts the two cost drivers as though their overruns were upsides, since the CAPEX and the OPEX rows both run from high to low.", "It drops OPEX from the chart, since its ends of 2178.5655 and 1852.2591 both sit above the right hand end of the capex row."]'::jsonb, explanation = 'The swings are 3097.7119, 2844.8375, 1287.1745 and 326.3064, and only a swing puts the four rows of the sweep on one footing.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 12: option_2
  select case
           when prompt = 'On the published marginal case the capex ends are 470.1383 and -44.7315. What does reading that row backwards produce?' and options = '["A case that fails on a cost saving, since 470.1383 is the end the sweep prints first and a first end is always taken to be the adverse one on a row.", "No error at all, since both ends are correct runs of the case and a base of 212.7034 sits between them whichever way round they are read.", "A swing read at the wrong sign, which the share of base of 0.628637 corrects as soon as the row is ranked against the other three.", "A case that fails on a cost overrun read as a case that thrives on one, since the overrun end of that row is the end that sits below zero."]'::jsonb and answer_index = 3 and explanation = 'An overrun of 30 percent takes that case from 212.7034 down to -44.7315, and the direction of the row is the only thing that says so.' then 'old'
           when prompt = 'On the published marginal case the capex ends are 470.1383 and -44.7315. What does reading that row backwards produce?' and options = '["A case that fails on a cost saving, since 470.1383 is the end the sweep prints first and a first end is always taken to be the adverse one on a row.", "No error at all, since both ends are correct runs of the case and a base of 212.7034 sits between them whichever way round they are read.", "A swing read at the wrong sign, which the share of base of 0.638666 corrects as soon as the row is ranked against the other three.", "A case that fails on a cost overrun read as a case that thrives on one, since the overrun end of that row is the end that sits below zero."]'::jsonb and answer_index = 3 and explanation = 'An overrun of 30 percent takes that case from 212.7034 down to -44.7315, and the direction of the row is the only thing that says so.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 12;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the published marginal case the capex ends are 470.1383 and -44.7315. What does reading that row backwards produce?', options = '["A case that fails on a cost saving, since 470.1383 is the end the sweep prints first and a first end is always taken to be the adverse one on a row.", "No error at all, since both ends are correct runs of the case and a base of 212.7034 sits between them whichever way round they are read.", "A swing read at the wrong sign, which the share of base of 0.638666 corrects as soon as the row is ranked against the other three.", "A case that fails on a cost overrun read as a case that thrives on one, since the overrun end of that row is the end that sits below zero."]'::jsonb, explanation = 'An overrun of 30 percent takes that case from 212.7034 down to -44.7315, and the direction of the row is the only thing that says so.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 13: prompt
  select case
           when prompt = 'Why may the figure 501.5628 not be labelled a P90 NPV?' and options = '["It is one conditional run, and a P-label belongs to a reserves distribution one fluid at a time, such as an oil P50 of 130.0000 MMbbl.", "It is the low end rather than the high end, so it would have to be labelled a P10 NPV to match the convention.", "A P-label may be carried by a value in money, but only once the sweep is re-run on a distribution of prices.", "A P90 is fixed at a different exceedance from the 30 percent the sweep moves, so the label is right at another figure."]'::jsonb and answer_index = 0 and explanation = 'Calling it a P90 asserts that a 30 percent price fall has a particular chance of being exceeded, and the sweep contains no such claim; a gas P50 of 70.0000 Bcf is what a P-label describes.' then 'old'
           when prompt = 'Why may the figure 466.5563 not be labelled a P90 NPV?' and options = '["It is one conditional run, and a P-label belongs to a reserves distribution one fluid at a time, such as an oil P50 of 130.0000 MMbbl.", "It is the low end rather than the high end, so it would have to be labelled a P10 NPV to match the convention.", "A P-label may be carried by a value in money, but only once the sweep is re-run on a distribution of prices.", "A P90 is fixed at a different exceedance from the 30 percent the sweep moves, so the label is right at another figure."]'::jsonb and answer_index = 0 and explanation = 'Calling it a P90 asserts that a 30 percent price fall has a particular chance of being exceeded, and the sweep contains no such claim; a gas P50 of 70.0000 Bcf is what a P-label describes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why may the figure 466.5563 not be labelled a P90 NPV?', options = '["It is one conditional run, and a P-label belongs to a reserves distribution one fluid at a time, such as an oil P50 of 130.0000 MMbbl.", "It is the low end rather than the high end, so it would have to be labelled a P10 NPV to match the convention.", "A P-label may be carried by a value in money, but only once the sweep is re-run on a distribution of prices.", "A P90 is fixed at a different exceedance from the 30 percent the sweep moves, so the label is right at another figure."]'::jsonb, explanation = 'Calling it a P90 asserts that a 30 percent price fall has a particular chance of being exceeded, and the sweep contains no such claim; a gas P50 of 70.0000 Bcf is what a P-label describes.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 14: option_0
  select case
           when prompt = 'A manager reads the eight ends of a tornado as the range the project could land in. What is missing from that reading?' and options = '["The base of 2047.5653 million USD, which the chart leaves out and which a reader needs before either end of any row can be placed at all.", "The upside beyond 30 percent, since the eight ends are conditional on the sweep''s own convention and a driver can move a good deal further than that.", "Every case where two drivers move together, which the sweep never runs and which on a marginal case is worse than either end alone.", "The discount rate, since every one of the eight ends was struck at 10.0000 percent and a range of outcomes has to be stated before it is discounted."]'::jsonb and answer_index = 2 and explanation = 'On the marginal case the price downside of -225.0477 and the capex overrun end of -44.7315 are both in the table, and the case where both happen is not.' then 'old'
           when prompt = 'A manager reads the eight ends of a tornado as the range the project could land in. What is missing from that reading?' and options = '["The base of 2015.4123 million USD, which the chart leaves out and which a reader needs before either end of any row can be placed at all.", "The upside beyond 30 percent, since the eight ends are conditional on the sweep''s own convention and a driver can move a good deal further than that.", "Every case where two drivers move together, which the sweep never runs and which on a marginal case is worse than either end alone.", "The discount rate, since every one of the eight ends was struck at 10.0000 percent and a range of outcomes has to be stated before it is discounted."]'::jsonb and answer_index = 2 and explanation = 'On the marginal case the price downside of -225.0477 and the capex overrun end of -44.7315 are both in the table, and the case where both happen is not.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 14;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A manager reads the eight ends of a tornado as the range the project could land in. What is missing from that reading?', options = '["The base of 2015.4123 million USD, which the chart leaves out and which a reader needs before either end of any row can be placed at all.", "The upside beyond 30 percent, since the eight ends are conditional on the sweep''s own convention and a driver can move a good deal further than that.", "Every case where two drivers move together, which the sweep never runs and which on a marginal case is worse than either end alone.", "The discount rate, since every one of the eight ends was struck at 10.0000 percent and a range of outcomes has to be stated before it is discounted."]'::jsonb, explanation = 'On the marginal case the price downside of -225.0477 and the capex overrun end of -44.7315 are both in the table, and the case where both happen is not.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m03 ord 15: explanation
  select case
           when prompt = 'What is a tornado chart genuinely good for?' and options = '["Sizing the risk carried by a case, since the widest bar of the four names the driver most likely to move by an amount that hurts the value of it.", "Ranking the four drivers of one case by their arithmetic leverage, as a work list for where to spend effort on tightening an estimate.", "Testing whether the inputs behind a case were right, since a base that is wrong shows up as a set of ends that will not balance.", "Bracketing the outcome, since the widest end and the narrowest end mark the limits the case can reach on any combination of moves."]'::jsonb and answer_index = 1 and explanation = 'A driver with a swing of 323.8828 does not repay much study on this case and one with a swing of 3092.0051 does.' then 'old'
           when prompt = 'What is a tornado chart genuinely good for?' and options = '["Sizing the risk carried by a case, since the widest bar of the four names the driver most likely to move by an amount that hurts the value of it.", "Ranking the four drivers of one case by their arithmetic leverage, as a work list for where to spend effort on tightening an estimate.", "Testing whether the inputs behind a case were right, since a base that is wrong shows up as a set of ends that will not balance.", "Bracketing the outcome, since the widest end and the narrowest end mark the limits the case can reach on any combination of moves."]'::jsonb and answer_index = 1 and explanation = 'A driver with a swing of 326.3064 does not repay much study on this case and one with a swing of 3097.7119 does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m03 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m03 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What is a tornado chart genuinely good for?', options = '["Sizing the risk carried by a case, since the widest bar of the four names the driver most likely to move by an amount that hurts the value of it.", "Ranking the four drivers of one case by their arithmetic leverage, as a work list for where to spend effort on tightening an estimate.", "Testing whether the inputs behind a case were right, since a base that is wrong shows up as a set of ends that will not balance.", "Bracketing the outcome, since the widest end and the narrowest end mark the limits the case can reach on any combination of moves."]'::jsonb, explanation = 'A driver with a swing of 326.3064 does not repay much study on this case and one with a swing of 3097.7119 does.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-what-a-sensitivity-says' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m03 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m06 ord 4: explanation, option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The plan''s cost items include a Decommissioning provision of 260.0000 million USD typed as ABEX. Where does it appear in the engine''s totals?' and options = '["In neither of them: the CAPEX total is 2250.0000 and the OPEX total is 95.0000 a year, because the screening case carries capex and operating cost only.", "In the CAPEX total, which is why 2250.0000 stands above the drilling, facilities and subsea fields taken on their own.", "In the OPEX total of 95.0000 a year, since the line sits in the Operate phase alongside the operations and the maintenance lines.", "In the facility screening estimate of 1363.3524, which is the one figure in the studio that carries a decommissioning number."]'::jsonb and answer_index = 0 and explanation = 'A line can be in the plan, correct, and absent from the number the plan reports.' then 'old'
           when prompt = 'The plan''s cost items include a Decommissioning provision of 260.0000 million USD typed as ABEX. Where does it appear in the engine''s totals?' and options = '["In neither of them: the CAPEX total is 2250.0000 and the OPEX total is 95.0000 a year, because an ABEX line is neither development capex nor an annual operating cost.", "In the CAPEX total, which is why 2250.0000 stands above the drilling, facilities and subsea fields taken on their own.", "In the OPEX total of 95.0000 a year, since the line sits in the Operate phase alongside the operations and the maintenance lines.", "In the facility screening estimate of 1363.3524, which is the one figure in the studio that carries a decommissioning number."]'::jsonb and answer_index = 0 and explanation = 'The line sits outside both totals and still reaches the value the plan reports, because the case charges it in the final production year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 4;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m06 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m06 ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The plan''s cost items include a Decommissioning provision of 260.0000 million USD typed as ABEX. Where does it appear in the engine''s totals?', options = '["In neither of them: the CAPEX total is 2250.0000 and the OPEX total is 95.0000 a year, because an ABEX line is neither development capex nor an annual operating cost.", "In the CAPEX total, which is why 2250.0000 stands above the drilling, facilities and subsea fields taken on their own.", "In the OPEX total of 95.0000 a year, since the line sits in the Operate phase alongside the operations and the maintenance lines.", "In the facility screening estimate of 1363.3524, which is the one figure in the studio that carries a decommissioning number."]'::jsonb, explanation = 'The line sits outside both totals and still reaches the value the plan reports, because the case charges it in the final production year.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m06 ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m06 ord 10: prompt
  select case
           when prompt = 'The Base scenario on the concept''s capex returns an NPV of 2047.5653 million USD and the plan''s own cost items at the same price return 2047.5653. What does the difference of 0.0000 mean?' and options = '["That the plan was costed against the concept it is running, which is a reconciliation somebody performed rather than an identity the engine enforces.", "That the engine runs the scenario once and reports it twice, so the two figures are one calculation printed under two headings.", "That the cost items are ignored by the economics, which reads the concept''s three capex fields and nothing else.", "That the plan is complete and valid at 100 percent, which is the check that holds the two NPVs together."]'::jsonb and answer_index = 0 and explanation = 'A difference of zero earned by reconciliation is a finding; a difference of zero assumed in advance is nothing at all.' then 'old'
           when prompt = 'The Base scenario on the concept''s capex returns an NPV of 2015.4123 million USD and the plan''s own cost items at the same price return 2015.4123. What does the difference of 0.0000 mean?' and options = '["That the plan was costed against the concept it is running, which is a reconciliation somebody performed rather than an identity the engine enforces.", "That the engine runs the scenario once and reports it twice, so the two figures are one calculation printed under two headings.", "That the cost items are ignored by the economics, which reads the concept''s three capex fields and nothing else.", "That the plan is complete and valid at 100 percent, which is the check that holds the two NPVs together."]'::jsonb and answer_index = 0 and explanation = 'A difference of zero earned by reconciliation is a finding; a difference of zero assumed in advance is nothing at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m06 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m06 ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Base scenario on the concept''s capex returns an NPV of 2015.4123 million USD and the plan''s own cost items at the same price return 2015.4123. What does the difference of 0.0000 mean?', options = '["That the plan was costed against the concept it is running, which is a reconciliation somebody performed rather than an identity the engine enforces.", "That the engine runs the scenario once and reports it twice, so the two figures are one calculation printed under two headings.", "That the cost items are ignored by the economics, which reads the concept''s three capex fields and nothing else.", "That the plan is complete and valid at 100 percent, which is the check that holds the two NPVs together."]'::jsonb, explanation = 'A difference of zero earned by reconciliation is a finding; a difference of zero assumed in advance is nothing at all.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m06 ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_m06 ord 13: prompt, option_2
  select case
           when prompt = 'At 18.0000 USD a barrel the FPSO scenario returns an NPV of -1797.2732 million USD. What does it report for the rate of return and for the payback?' and options = '["No rate of return at all, with a status of no-root, and a payback of never, which is the honest reading of a case that does not return its money.", "A rate of 1000 percent, the upper edge of the band the engine searches, and a payback of never.", "A negative rate, since an NPV of -1797.2732 has to correspond to a rate below the discount rate of 10.0000 percent.", "No rate, with a status of no-sign-change, and a payback equal to the concept''s life of 20.0000 years."]'::jsonb and answer_index = 0 and explanation = 'A search that clamped at its own boundary used to print 1000 percent here, in green, on a scenario that never pays back.' then 'old'
           when prompt = 'At 18.0000 USD a barrel the FPSO scenario returns an NPV of -1834.1220 million USD. What does it report for the rate of return and for the payback?' and options = '["No rate of return at all, with a status of no-root, and a payback of never, which is the honest reading of a case that does not return its money.", "A rate of 1000 percent, the upper edge of the band the engine searches, and a payback of never.", "A negative rate, since an NPV of -1834.1220 has to correspond to a rate below the discount rate of 10.0000 percent.", "No rate, with a status of no-sign-change, and a payback equal to the concept''s life of 20.0000 years."]'::jsonb and answer_index = 0 and explanation = 'A search that clamped at its own boundary used to print 1000 percent here, in green, on a scenario that never pays back.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_m06 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_m06 ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 18.0000 USD a barrel the FPSO scenario returns an NPV of -1834.1220 million USD. What does it report for the rate of return and for the payback?', options = '["No rate of return at all, with a status of no-root, and a payback of never, which is the honest reading of a case that does not return its money.", "A rate of 1000 percent, the upper edge of the band the engine searches, and a payback of never.", "A negative rate, since an NPV of -1834.1220 has to correspond to a rate below the discount rate of 10.0000 percent.", "No rate, with a status of no-sign-change, and a payback equal to the concept''s life of 20.0000 years."]'::jsonb, explanation = 'A search that clamped at its own boundary used to print 1000 percent here, in green, on a scenario that never pays back.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-reading-a-plan-against-itself' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_m06 ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 1: prompt, explanation, option_0, option_1, option_3
  select case
           when prompt = 'The scenario card colours a rate of 15 percent or more green, and the sweep ranks the plan''s drivers Oil Price, Production, CAPEX, OPEX. A reviewer reads a green 29.5998 percent beside the widest bar and calls the case risked. What has that reading assumed?' and options = '["Nothing that is not already stated, since the colour applies the only hurdle rate in the studio and the widest swing of 3092.0051 names the driver most likely to move against the case.", "Only that the base is sound, since a green rate and a driver ranking are both properties of a case whose value of 2047.5653 million USD was struck on a capex of 2250.0000 the plan has reconciled.", "Two things neither output claims: a colour on a card is not a decision rule and carries no money beside it, and a ranking by swing is arithmetic leverage with nothing in it about how likely a 30 percent move is.", "That the tie-back was screened on the same terms, since 40.4321 percent is green as well and its own swing would have to be ranked before either concept could be called risked."]'::jsonb and answer_index = 2 and explanation = 'The green at 29.5998 percent says nothing about the 2047.5653 million USD standing beside it, and the sweep ranks by leverage as a work list for tightening an estimate rather than by likelihood.' then 'old'
           when prompt = 'The scenario card colours a rate of 15 percent or more green, and the sweep ranks the plan''s drivers Oil Price, Production, CAPEX, OPEX. A reviewer treats the colour rule as a decision and the widest bar as the biggest risk. What has that reading assumed?' and options = '["Nothing that is not already stated, since the colour applies the only hurdle rate in the studio and the widest swing of 3097.7119 names the driver most likely to move against the case.", "Only that the base is sound, since the colour rule and the driver ranking are both properties of a case whose value of 2015.4123 million USD was struck on a capex of 2250.0000 the plan has reconciled.", "Two things neither output claims: a colour on a card is not a decision rule and carries no money beside it, and a ranking by swing is arithmetic leverage with nothing in it about how likely a 30 percent move is.", "That the tie-back was screened on the same terms, since its own swing would have to be ranked as well before either concept could be called risked."]'::jsonb and answer_index = 2 and explanation = 'The card has no rate to colour on any EGINA case, and the sweep ranks by leverage as a work list for tightening an estimate rather than by likelihood.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 1'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The scenario card colours a rate of 15 percent or more green, and the sweep ranks the plan''s drivers Oil Price, Production, CAPEX, OPEX. A reviewer treats the colour rule as a decision and the widest bar as the biggest risk. What has that reading assumed?', options = '["Nothing that is not already stated, since the colour applies the only hurdle rate in the studio and the widest swing of 3097.7119 names the driver most likely to move against the case.", "Only that the base is sound, since the colour rule and the driver ranking are both properties of a case whose value of 2015.4123 million USD was struck on a capex of 2250.0000 the plan has reconciled.", "Two things neither output claims: a colour on a card is not a decision rule and carries no money beside it, and a ranking by swing is arithmetic leverage with nothing in it about how likely a 30 percent move is.", "That the tie-back was screened on the same terms, since its own swing would have to be ranked as well before either concept could be called risked."]'::jsonb, explanation = 'The card has no rate to colour on any EGINA case, and the sweep ranks by leverage as a work list for tightening an estimate rather than by likelihood.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 2: prompt, explanation, option_0, option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'At 70.0000 USD a barrel the subsea tie-back returns 40.4321 percent on a capex of 730.0000 and the FPSO returns 29.5998 percent on 2250.0000, while the tie-back is worth 1048.6281 million USD and the FPSO 2047.5653. Which reading is sound?' and options = '["Both measures are true at once, since value per million of capex is 1.436477 for the tie-back and 0.910029 for the FPSO while the FPSO still returns the larger amount of money.", "The tie-back is the better development, because it wins on the rate and on payback at 3.2035 years against 3.8273, and two measures out of three settle a screening ranking.", "The FPSO is the better development, because a rate taken on 730.0000 of capex cannot be set against a rate taken on 2250.0000 until both have been restated on one capex.", "Neither ranking holds, because the two scenarios were struck at different discount rates and only values taken at a single rate of 10.0000 percent may be compared."]'::jsonb and answer_index = 0 and explanation = 'The rate says how hard the money worked and the NPV says how much came back. A portfolio sorted on 40.4321 percent hands the reader 1048.6281 in place of 2047.5653.' then 'old'
           when prompt = 'At 70.0000 USD a barrel the subsea tie-back is worth 1013.7182 million USD on a capex of 730.0000 and the FPSO 2015.4123 on 2250.0000, and neither of them reports a rate of return. Which reading is sound?' and options = '["Both measures are true at once, since value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO while the FPSO still returns the larger amount of money.", "The tie-back is the better development, because it wins on efficiency and on payback at 3.2035 years against 3.8273, and two measures out of three settle a screening ranking.", "The FPSO is the better development, because a ratio taken on 730.0000 of capex cannot be set against one taken on 2250.0000 until both have been restated on a single capex.", "Neither ranking holds, because the two scenarios were struck at different discount rates and only values taken at a single rate of 10.0000 percent may be compared."]'::jsonb and answer_index = 0 and explanation = 'The ratio says how hard the money worked and the NPV says how much came back. A portfolio sorted on 1.388655 hands the reader 1013.7182 in place of 2015.4123.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 2'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 70.0000 USD a barrel the subsea tie-back is worth 1013.7182 million USD on a capex of 730.0000 and the FPSO 2015.4123 on 2250.0000, and neither of them reports a rate of return. Which reading is sound?', options = '["Both measures are true at once, since value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO while the FPSO still returns the larger amount of money.", "The tie-back is the better development, because it wins on efficiency and on payback at 3.2035 years against 3.8273, and two measures out of three settle a screening ranking.", "The FPSO is the better development, because a ratio taken on 730.0000 of capex cannot be set against one taken on 2250.0000 until both have been restated on a single capex.", "Neither ranking holds, because the two scenarios were struck at different discount rates and only values taken at a single rate of 10.0000 percent may be compared."]'::jsonb, explanation = 'The ratio says how hard the money worked and the NPV says how much came back. A portfolio sorted on 1.388655 hands the reader 1013.7182 in place of 2015.4123.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 3: prompt, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reviewer divides the FPSO''s NPV of 2047.5653 million USD by the facility screening estimate of 1363.3524 and sets the result beside the tie-back''s value per million of capex of 1.436477. What is wrong with that pair?' and options = '["Nothing, since a screening estimate and a concept capex are both class 5 figures in million USD and the two ratios are therefore struck on one footing.", "The FPSO''s value should have been the plan''s own cost items NPV rather than the scenario NPV, because only the cost items reach the 2250.0000 a facility estimate belongs beside.", "The tie-back''s ratio should have been re-struck on its own facility screening estimate of 184.6717, which is the figure that puts the two concepts on the same basis.", "The tie-back figure is taken on its concept''s whole capex of 730.0000, while 1363.3524 prices one facility and leaves out drilling of 520.0000 and subsea of 380.0000, so the FPSO''s like for like figure is 0.910029 on 2250.0000."]'::jsonb and answer_index = 3 and explanation = 'A value per million is only as good as the capex underneath it. The screening estimate belongs beside the concept''s facilities field of 1350.0000, a gap of 13.3524, and never beside a development that also drills wells and lays subsea.' then 'old'
           when prompt = 'A reviewer divides the FPSO''s NPV of 2015.4123 million USD by the facility screening estimate of 1363.3524 and sets the result beside the tie-back''s value per million of capex of 1.388655. What is wrong with that pair?' and options = '["Nothing, since a screening estimate and a concept capex are both class 5 figures in million USD and the two ratios are therefore struck on one footing.", "The FPSO''s value should have been the plan''s own cost items NPV rather than the scenario NPV, because only the cost items reach the 2250.0000 a facility estimate belongs beside.", "The tie-back''s ratio should have been re-struck on its own facility screening estimate of 184.6717, which is the figure that puts the two concepts on the same basis.", "The tie-back figure is taken on its concept''s whole capex of 730.0000, while 1363.3524 prices one facility and leaves out drilling of 520.0000 and subsea of 380.0000, so the FPSO''s like for like figure is 0.895739 on 2250.0000."]'::jsonb and answer_index = 3 and explanation = 'A value per million is only as good as the capex underneath it. The screening estimate belongs beside the concept''s facilities field of 1350.0000, a gap of 13.3524, and never beside a development that also drills wells and lays subsea.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 3'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer divides the FPSO''s NPV of 2015.4123 million USD by the facility screening estimate of 1363.3524 and sets the result beside the tie-back''s value per million of capex of 1.388655. What is wrong with that pair?', options = '["Nothing, since a screening estimate and a concept capex are both class 5 figures in million USD and the two ratios are therefore struck on one footing.", "The FPSO''s value should have been the plan''s own cost items NPV rather than the scenario NPV, because only the cost items reach the 2250.0000 a facility estimate belongs beside.", "The tie-back''s ratio should have been re-struck on its own facility screening estimate of 184.6717, which is the figure that puts the two concepts on the same basis.", "The tie-back figure is taken on its concept''s whole capex of 730.0000, while 1363.3524 prices one facility and leaves out drilling of 520.0000 and subsea of 380.0000, so the FPSO''s like for like figure is 0.895739 on 2250.0000."]'::jsonb, explanation = 'A value per million is only as good as the capex underneath it. The screening estimate belongs beside the concept''s facilities field of 1350.0000, a gap of 13.3524, and never beside a development that also drills wells and lays subsea.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 5: prompt, explanation, option_0, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Run the EGINA scenarios past a screening threshold of 15 percent on the rate and the Low price case at 14.4152 percent fails. What has just been rejected?' and options = '["A case the engine had already priced as worthless, since a rate below the threshold means the discounted flow at 48.0000 USD a barrel does not cover its own capex.", "Nothing at all, because a threshold of 15 percent and a discount rate of 10.0000 percent are the same test applied twice and the value had already failed the first of them.", "427.9436 million USD of value at a discount rate of 10.0000 percent, correctly by the rule''s own terms, with nothing on the card to show what the rejection cost.", "The weakest of the three FPSO cases, which the sweep had already found at its minus 30 percent oil price end of 501.5628 million USD on the plan''s own base."]'::jsonb and answer_index = 2 and explanation = '14.4152 is less than 15, so the verdict is right and uninformative. The rejected case is worth 427.9436 and a reader who sees only the verdict cannot tell it from a worthless one.' then 'old'
           when prompt = 'A screening threshold of 15 percent on the rate is run past the EGINA scenarios, and the Low price case comes back with no rate at all. What has the threshold told the reader about it?' and options = '["That the case is worthless, since a rate the engine declines to report is a rate that fell below the threshold.", "Nothing at all, because a threshold of 15 percent and a discount rate of 10.0000 percent are the same test applied twice and the value had already failed the first of them.", "Nothing: the case is worth 392.8013 million USD at a discount rate of 10.0000 percent, and a rule written against a rate has no input on a case the engine gives none.", "That it is the weakest of the three FPSO cases, which the sweep had already found at its minus 30 percent oil price end of 466.5563 million USD on the plan''s own base."]'::jsonb and answer_index = 2 and explanation = 'A missing verdict is not a negative one. The case is worth 392.8013 million USD, and a reader who sees an empty cell cannot tell it from a case worth nothing at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screening threshold of 15 percent on the rate is run past the EGINA scenarios, and the Low price case comes back with no rate at all. What has the threshold told the reader about it?', options = '["That the case is worthless, since a rate the engine declines to report is a rate that fell below the threshold.", "Nothing at all, because a threshold of 15 percent and a discount rate of 10.0000 percent are the same test applied twice and the value had already failed the first of them.", "Nothing: the case is worth 392.8013 million USD at a discount rate of 10.0000 percent, and a rule written against a rate has no input on a case the engine gives none.", "That it is the weakest of the three FPSO cases, which the sweep had already found at its minus 30 percent oil price end of 466.5563 million USD on the plan''s own base."]'::jsonb, explanation = 'A missing verdict is not a negative one. The case is worth 392.8013 million USD, and a reader who sees an empty cell cannot tell it from a case worth nothing at all.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 6: prompt, explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'At 40.0000 USD a barrel the FPSO concept reports a rate of 8.2444 percent and an NPV of -161.0098 million USD. How do those two live together?' and options = '["The flow earns 8.2444 percent and the screening case charges 10.0000 percent for money, so a real positive root still leaves the value below zero.", "The two cannot both stand, so the rate of 8.2444 percent is a clamped figure and not a root.", "The root was found above the band the engine searches and reported anyway, which is the reading the status above-clamp exists to warn a reader about.", "The rate was struck before royalty and tax and the value after both, so they differ."]'::jsonb and answer_index = 0 and explanation = 'The sign of the rate is not the test. The test is the rate against the rate money costs, and the NPV of -161.0098 has already made that comparison.' then 'old'
           when prompt = 'A pack lists the FPSO at 40.0000 USD a barrel, worth -197.2391 million USD with no rate of return, beside a published case worth -92616.5020 that does carry one, -36.6747 percent at status ok. Why does one of them have a rate and the other not?' and options = '["The published flow spends once and earns thereafter, so one root zeroes it, while the EGINA flow also pays 260.0000 million USD to abandon the field and changes sign twice.", "The published case is the deeper loss, and a rate is reported wherever the value sits far enough below zero for the search to isolate a single root against it.", "The EGINA case is discounted at 10.0000 percent and the published case is not, so only one of the two leaves a flow the search can be run against at all.", "The published root is negative, and the engine verifies a rate below zero while it withholds any positive root found on a case whose value is negative."]'::jsonb and answer_index = 0 and explanation = 'A rate of -36.6747 percent is a verified root at status ok. A flow that changes sign twice has more than one rate that zeroes it, so the engine names none and the value of -197.2391 is what the row carries.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A pack lists the FPSO at 40.0000 USD a barrel, worth -197.2391 million USD with no rate of return, beside a published case worth -92616.5020 that does carry one, -36.6747 percent at status ok. Why does one of them have a rate and the other not?', options = '["The published flow spends once and earns thereafter, so one root zeroes it, while the EGINA flow also pays 260.0000 million USD to abandon the field and changes sign twice.", "The published case is the deeper loss, and a rate is reported wherever the value sits far enough below zero for the search to isolate a single root against it.", "The EGINA case is discounted at 10.0000 percent and the published case is not, so only one of the two leaves a flow the search can be run against at all.", "The published root is negative, and the engine verifies a rate below zero while it withholds any positive root found on a case whose value is negative."]'::jsonb, explanation = 'A rate of -36.6747 percent is a verified root at status ok. A flow that changes sign twice has more than one rate that zeroes it, so the engine names none and the value of -197.2391 is what the row carries.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 9: explanation
  select case
           when prompt = 'The published case whose price deck is shorter than its profile is worth 126.1636, reports multiple-roots, and has a recorded hidden root of -52.4425 percent. Why is -52.4425 not its rate of return?' and options = '["A second root is equally valid, so the case has no single rate, and the unpriced years still carry their operating cost, which bends the flow back below zero.", "Because it lies below the floor of the search at -99 percent, and a root outside the band is never reported however carefully a golden has recorded it.", "Because the engine never reports a rate below zero, which is why the published case that never pays back carries the status ok and no number beside that status.", "Because the plan path refuses a short deck by name rather than pricing it, so no rate of any kind was ever computed for that flow to be able to carry."]'::jsonb and answer_index = 0 and explanation = 'Missing prices read as 0 in that fixture. At 30.0000 USD a barrel EGINA reads multiple-roots too, on -898.3507, and picking one root is the reader''s preference wearing the engine''s authority.' then 'old'
           when prompt = 'The published case whose price deck is shorter than its profile is worth 126.1636, reports multiple-roots, and has a recorded hidden root of -52.4425 percent. Why is -52.4425 not its rate of return?' and options = '["A second root is equally valid, so the case has no single rate, and the unpriced years still carry their operating cost, which bends the flow back below zero.", "Because it lies below the floor of the search at -99 percent, and a root outside the band is never reported however carefully a golden has recorded it.", "Because the engine never reports a rate below zero, which is why the published case that never pays back carries the status ok and no number beside that status.", "Because the plan path refuses a short deck by name rather than pricing it, so no rate of any kind was ever computed for that flow to be able to carry."]'::jsonb and answer_index = 0 and explanation = 'Missing prices read as 0 in that fixture. EGINA''s own Base case reads multiple-roots too, on 2015.4123 with roots of -44.3414 and 29.5779, and picking one root is the reader''s preference wearing the engine''s authority.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 9'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case whose price deck is shorter than its profile is worth 126.1636, reports multiple-roots, and has a recorded hidden root of -52.4425 percent. Why is -52.4425 not its rate of return?', options = '["A second root is equally valid, so the case has no single rate, and the unpriced years still carry their operating cost, which bends the flow back below zero.", "Because it lies below the floor of the search at -99 percent, and a root outside the band is never reported however carefully a golden has recorded it.", "Because the engine never reports a rate below zero, which is why the published case that never pays back carries the status ok and no number beside that status.", "Because the plan path refuses a short deck by name rather than pricing it, so no rate of any kind was ever computed for that flow to be able to carry."]'::jsonb, explanation = 'Missing prices read as 0 in that fixture. EGINA''s own Base case reads multiple-roots too, on 2015.4123 with roots of -44.3414 and 29.5779, and picking one root is the reader''s preference wearing the engine''s authority.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 10: explanation
  select case
           when prompt = 'Before the repair the studio printed 1000 percent, in green, against the EGINA concept at 18.0000 USD a barrel. What was that figure?' and options = '["The true root of that flow, which sits above the band and is recorded in the goldens in the way 2305.7875 percent is recorded for another published case.", "The rate at which the stress case breaks even, computed correctly and then labelled wrongly.", "The upper edge of the band the search covers, returned from where the search stopped, so it is a property of the search rather than of the cash flow.", "A placeholder the card drew when the engine returned nothing, in the way an index with no denominator was drawn as a clean 1.00 and labelled under budget."]'::jsonb and answer_index = 2 and explanation = 'The tell is that the number was exactly the boundary. The repaired engine reports null with the status no-root there, and the NPV of -1797.2732 sat on the same card the whole time.' then 'old'
           when prompt = 'Before the repair the studio printed 1000 percent, in green, against the EGINA concept at 18.0000 USD a barrel. What was that figure?' and options = '["The true root of that flow, which sits above the band and is recorded in the goldens in the way 2305.7875 percent is recorded for another published case.", "The rate at which the stress case breaks even, computed correctly and then labelled wrongly.", "The upper edge of the band the search covers, returned from where the search stopped, so it is a property of the search rather than of the cash flow.", "A placeholder the card drew when the engine returned nothing, in the way an index with no denominator was drawn as a clean 1.00 and labelled under budget."]'::jsonb and answer_index = 2 and explanation = 'The tell is that the number was exactly the boundary. The repaired engine reports null with the status no-root there, and the NPV of -1834.1220 sat on the same card the whole time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Before the repair the studio printed 1000 percent, in green, against the EGINA concept at 18.0000 USD a barrel. What was that figure?', options = '["The true root of that flow, which sits above the band and is recorded in the goldens in the way 2305.7875 percent is recorded for another published case.", "The rate at which the stress case breaks even, computed correctly and then labelled wrongly.", "The upper edge of the band the search covers, returned from where the search stopped, so it is a property of the search rather than of the cash flow.", "A placeholder the card drew when the engine returned nothing, in the way an index with no denominator was drawn as a clean 1.00 and labelled under budget."]'::jsonb, explanation = 'The tell is that the number was exactly the boundary. The repaired engine reports null with the status no-root there, and the NPV of -1834.1220 sat on the same card the whole time.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 11: prompt
  select case
           when prompt = 'A case worth -1797.2732 million USD reports no rate of return at all with a status of no-root, and a sweep is drawn around it anyway. What does that chart carry?' and options = '["Nothing at all, since a case with no verified root inside the band of -99 to 1000 percent cannot be re-run and the sweep has no base to move around.", "A rate at each of the eight ends, since every run solves its own flow and the status of no-root belongs to the base run alone.", "The same eight ends the Base case gives, since the sweep moves the drivers and a status is a property of the flow rather than of the driver being moved.", "Eight re-runs of the case in money and a ranking of the drivers by leverage, with nothing on it to say that a rate was withheld or why."]'::jsonb and answer_index = 3 and explanation = 'The sweep reports values, so it draws with equal confidence on a case the engine would refuse to hand a rate. The ranking of Oil Price, Production, CAPEX, OPEX is leverage and carries no status and no likelihood.' then 'old'
           when prompt = 'A case worth -1834.1220 million USD reports no rate of return at all with a status of no-root, and a sweep is drawn around it anyway. What does that chart carry?' and options = '["Nothing at all, since a case with no verified root inside the band of -99 to 1000 percent cannot be re-run and the sweep has no base to move around.", "A rate at each of the eight ends, since every run solves its own flow and the status of no-root belongs to the base run alone.", "The same eight ends the Base case gives, since the sweep moves the drivers and a status is a property of the flow rather than of the driver being moved.", "Eight re-runs of the case in money and a ranking of the drivers by leverage, with nothing on it to say that a rate was withheld or why."]'::jsonb and answer_index = 3 and explanation = 'The sweep reports values, so it draws with equal confidence on a case the engine would refuse to hand a rate. The ranking of Oil Price, Production, CAPEX, OPEX is leverage and carries no status and no likelihood.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 11'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A case worth -1834.1220 million USD reports no rate of return at all with a status of no-root, and a sweep is drawn around it anyway. What does that chart carry?', options = '["Nothing at all, since a case with no verified root inside the band of -99 to 1000 percent cannot be re-run and the sweep has no base to move around.", "A rate at each of the eight ends, since every run solves its own flow and the status of no-root belongs to the base run alone.", "The same eight ends the Base case gives, since the sweep moves the drivers and a status is a property of the flow rather than of the driver being moved.", "Eight re-runs of the case in money and a ranking of the drivers by leverage, with nothing on it to say that a rate was withheld or why."]'::jsonb, explanation = 'The sweep reports values, so it draws with equal confidence on a case the engine would refuse to hand a rate. The ranking of Oil Price, Production, CAPEX, OPEX is leverage and carries no status and no likelihood.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 13: prompt, explanation, option_3
  select case
           when prompt = 'On the plan''s own case the sweep''s minus 30 percent oil price end is 501.5628 against a base of 2047.5653. What produced 501.5628?' and options = '["A complete re-run of the case with that one input moved and every other held, which is why the two ends of a row are rarely the same distance from the base.", "The base value scaled down by 30 percent and then discounted again at 10.0000 percent, which is the arithmetic that makes a tornado chart cheap to draw.", "The Low price scenario at 48.0000 USD a barrel carried across into the sweep, which is why the sweep and the scenario table agree on the downside of this plan.", "The worst of the eight runs, taken once the price fall had been combined with the capex overrun end of 1403.9781 to give the case its full downside."]'::jsonb and answer_index = 0 and explanation = 'Every row runs royalty, tax, the discount and the shape again. The Low price scenario is a different number, 427.9436 at 48.0000 USD a barrel.' then 'old'
           when prompt = 'On the plan''s own case the sweep''s minus 30 percent oil price end is 466.5563 against a base of 2015.4123. What produced 466.5563?' and options = '["A complete re-run of the case with that one input moved and every other held, which is why the two ends of a row are rarely the same distance from the base.", "The base value scaled down by 30 percent and then discounted again at 10.0000 percent, which is the arithmetic that makes a tornado chart cheap to draw.", "The Low price scenario at 48.0000 USD a barrel carried across into the sweep, which is why the sweep and the scenario table agree on the downside of this plan.", "The worst of the eight runs, taken once the price fall had been combined with the capex overrun end of 1371.8250 to give the case its full downside."]'::jsonb and answer_index = 0 and explanation = 'Every row runs royalty, tax, the discount and the shape again. The Low price scenario is a different number, 392.8013 at 48.0000 USD a barrel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 13'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the plan''s own case the sweep''s minus 30 percent oil price end is 466.5563 against a base of 2015.4123. What produced 466.5563?', options = '["A complete re-run of the case with that one input moved and every other held, which is why the two ends of a row are rarely the same distance from the base.", "The base value scaled down by 30 percent and then discounted again at 10.0000 percent, which is the arithmetic that makes a tornado chart cheap to draw.", "The Low price scenario at 48.0000 USD a barrel carried across into the sweep, which is why the sweep and the scenario table agree on the downside of this plan.", "The worst of the eight runs, taken once the price fall had been combined with the capex overrun end of 1371.8250 to give the case its full downside."]'::jsonb, explanation = 'Every row runs royalty, tax, the discount and the shape again. The Low price scenario is a different number, 392.8013 at 48.0000 USD a barrel.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 14: prompt
  select case
           when prompt = 'The oil price swing is 3092.0051 and the production swing is 2839.5965 on the same 30 percent move. What separates them?' and options = '["Royalty at 12.5000 percent and tax at 30.0000 percent are taken on revenue, so a price move is taxed once while a volume move is taxed twice over the life of the case.", "The production driver moves the plateau and the decline as well as the volume, so more of its move lands in later years where the discount of 10.0000 percent bites.", "A variable operating cost of 5.0000 USD a barrel travels with the barrels, so extra volume brings its own cost and an extra dollar of price brings none.", "The price driver moves every producing row while the production driver leaves year 0 untouched, and year 0 is the row carrying the capex of 2250.0000."]'::jsonb and answer_index = 2 and explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492. The published case with no royalty and no tax keeps price the wider driver on a base of 2738.0331.' then 'old'
           when prompt = 'The oil price swing is 3097.7119 and the production swing is 2844.8375 on the same 30 percent move. What separates them?' and options = '["Royalty at 12.5000 percent and tax at 30.0000 percent are taken on revenue, so a price move is taxed once while a volume move is taxed twice over the life of the case.", "The production driver moves the plateau and the decline as well as the volume, so more of its move lands in later years where the discount of 10.0000 percent bites.", "A variable operating cost of 5.0000 USD a barrel travels with the barrels, so extra volume brings its own cost and an extra dollar of price brings none.", "The price driver moves every producing row while the production driver leaves year 0 untouched, and year 0 is the row carrying the capex of 2250.0000."]'::jsonb and answer_index = 2 and explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492. The published case with no royalty and no tax keeps price the wider driver on a base of 2738.0331.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 14'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The oil price swing is 3097.7119 and the production swing is 2844.8375 on the same 30 percent move. What separates them?', options = '["Royalty at 12.5000 percent and tax at 30.0000 percent are taken on revenue, so a price move is taxed once while a volume move is taxed twice over the life of the case.", "The production driver moves the plateau and the decline as well as the volume, so more of its move lands in later years where the discount of 10.0000 percent bites.", "A variable operating cost of 5.0000 USD a barrel travels with the barrels, so extra volume brings its own cost and an extra dollar of price brings none.", "The price driver moves every producing row while the production driver leaves year 0 untouched, and year 0 is the row carrying the capex of 2250.0000."]'::jsonb, explanation = 'Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492. The published case with no royalty and no tax keeps price the wider driver on a base of 2738.0331.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 15: prompt
  select case
           when prompt = 'The sweep''s CAPEX row runs from 2691.1526 at minus 30 percent to 1403.9781 at plus 30 percent. Which of the plan''s figures did it move by 30 percent either way?' and options = '["The facility screening estimate of 1363.3524 million USD, since a sweep prices the facility from its type and its nameplate of 60000 bopd before it moves anything.", "The 2250.0000 million USD the case was run on, which is the concept''s drilling, facilities and subsea fields added and is also what the plan''s cost items total.", "The concept''s facilities field of 1350.0000 million USD, since the drilling of 520.0000 and the subsea of 380.0000 are committed and only a facilities figure is open to an overrun.", "The CAPEX total less the Decommissioning provision of 260.0000 million USD, since the screening case carries capex and operating cost only."]'::jsonb and answer_index = 1 and explanation = 'The two capex estimates agree at 2250.0000 because the plan was costed against its concept, and the sweep moves that one figure. The screening estimate of 1363.3524 is a third number and belongs beside 1350.0000.' then 'old'
           when prompt = 'The sweep''s CAPEX row runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent. Which of the plan''s figures did it move by 30 percent either way?' and options = '["The facility screening estimate of 1363.3524 million USD, since a sweep prices the facility from its type and its nameplate of 60000 bopd before it moves anything.", "The 2250.0000 million USD the case was run on, which is the concept''s drilling, facilities and subsea fields added and is also what the plan''s cost items total.", "The concept''s facilities field of 1350.0000 million USD, since the drilling of 520.0000 and the subsea of 380.0000 are committed and only a facilities figure is open to an overrun.", "The CAPEX total less the Decommissioning provision of 260.0000 million USD, since the screening case carries capex and operating cost only."]'::jsonb and answer_index = 1 and explanation = 'The two capex estimates agree at 2250.0000 because the plan was costed against its concept, and the sweep moves that one figure. The screening estimate of 1363.3524 is a third number and belongs beside 1350.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The sweep''s CAPEX row runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent. Which of the plan''s figures did it move by 30 percent either way?', options = '["The facility screening estimate of 1363.3524 million USD, since a sweep prices the facility from its type and its nameplate of 60000 bopd before it moves anything.", "The 2250.0000 million USD the case was run on, which is the concept''s drilling, facilities and subsea fields added and is also what the plan''s cost items total.", "The concept''s facilities field of 1350.0000 million USD, since the drilling of 520.0000 and the subsea of 380.0000 are committed and only a facilities figure is open to an overrun.", "The CAPEX total less the Decommissioning provision of 260.0000 million USD, since the screening case carries capex and operating cost only."]'::jsonb, explanation = 'The two capex estimates agree at 2250.0000 because the plan was costed against its concept, and the sweep moves that one figure. The screening estimate of 1363.3524 is a third number and belongs beside 1350.0000.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 16: prompt, explanation
  select case
           when prompt = 'CAPEX runs from 2691.1526 at minus 30 percent to 1403.9781 at plus 30 percent, a swing of 1287.1745, while OPEX swings 323.8828 on the same move. Why is the capex row so much the wider?' and options = '["The capex base of 2250.0000 is larger than the 95.0000 a year, and the sweep moves each driver by an absolute amount.", "The capex row runs backwards, and a swing across a reversed row always reads wider.", "Operating cost is taken before royalty and tax, so the government absorbs most of its move, while the capex move falls whole on the investor and is not shared with anybody.", "The capex lands in year 0 where discounting touches it least, and operating cost is spread across the producing years where the later portions count for less."]'::jsonb and answer_index = 3 and explanation = 'The shares of base are 0.628637 for capex and 0.158179 for operating cost. Both rows still run high to low, because more money spent is less money kept.' then 'old'
           when prompt = 'CAPEX runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent, a swing of 1287.1745, while OPEX swings 326.3064 on the same move. Why is the capex row so much the wider?' and options = '["The capex base of 2250.0000 is larger than the 95.0000 a year, and the sweep moves each driver by an absolute amount.", "The capex row runs backwards, and a swing across a reversed row always reads wider.", "Operating cost is taken before royalty and tax, so the government absorbs most of its move, while the capex move falls whole on the investor and is not shared with anybody.", "The capex lands in year 0 where discounting touches it least, and operating cost is spread across the producing years where the later portions count for less."]'::jsonb and answer_index = 3 and explanation = 'The shares of base are 0.638666 for capex and 0.161906 for operating cost. Both rows still run high to low, because more money spent is less money kept.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 16'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'CAPEX runs from 2658.9995 at minus 30 percent to 1371.8250 at plus 30 percent, a swing of 1287.1745, while OPEX swings 326.3064 on the same move. Why is the capex row so much the wider?', options = '["The capex base of 2250.0000 is larger than the 95.0000 a year, and the sweep moves each driver by an absolute amount.", "The capex row runs backwards, and a swing across a reversed row always reads wider.", "Operating cost is taken before royalty and tax, so the government absorbs most of its move, while the capex move falls whole on the investor and is not shared with anybody.", "The capex lands in year 0 where discounting touches it least, and operating cost is spread across the producing years where the later portions count for less."]'::jsonb, explanation = 'The shares of base are 0.638666 for capex and 0.161906 for operating cost. Both rows still run high to low, because more money spent is less money kept.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 17: prompt, option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'May the sweep''s minus 30 percent oil price end of 501.5628 be labelled a P90 NPV?' and options = '["No, because a P-label belongs to a reserves distribution one fluid at a time, and 501.5628 is a single conditional run rather than a point on any distribution.", "Yes, provided the label goes on the minus 30 percent ends of all four drivers together, since those four downside runs bracket the low case of the plan between them.", "Yes, because the sweep moves every driver by the same 30 percent, so the eight ends are equally likely and the lowest of them is the low outcome by construction.", "No, because the right label for a downside run is P10, which names the high case of a distribution and so the low case of any value that is built on it."]'::jsonb and answer_index = 0 and explanation = 'EGINA''s oil P50 is 130.0000 MMbbl and its gas P50 is 70.0000 Bcf, and those labels came from a distribution somebody built. The sweep carries no claim about likelihood.' then 'old'
           when prompt = 'May the sweep''s minus 30 percent oil price end of 466.5563 be labelled a P90 NPV?' and options = '["No, because a P-label belongs to a reserves distribution one fluid at a time, and 466.5563 is a single conditional run rather than a point on any distribution.", "Yes, provided the label goes on the minus 30 percent ends of all four drivers together, since those four downside runs bracket the low case of the plan between them.", "Yes, because the sweep moves every driver by the same 30 percent, so the eight ends are equally likely and the lowest of them is the low outcome by construction.", "No, because the right label for a downside run is P10, which names the high case of a distribution and so the low case of any value that is built on it."]'::jsonb and answer_index = 0 and explanation = 'EGINA''s oil P50 is 130.0000 MMbbl and its gas P50 is 70.0000 Bcf, and those labels came from a distribution somebody built. The sweep carries no claim about likelihood.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 17'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'May the sweep''s minus 30 percent oil price end of 466.5563 be labelled a P90 NPV?', options = '["No, because a P-label belongs to a reserves distribution one fluid at a time, and 466.5563 is a single conditional run rather than a point on any distribution.", "Yes, provided the label goes on the minus 30 percent ends of all four drivers together, since those four downside runs bracket the low case of the plan between them.", "Yes, because the sweep moves every driver by the same 30 percent, so the eight ends are equally likely and the lowest of them is the low outcome by construction.", "No, because the right label for a downside run is P10, which names the high case of a distribution and so the low case of any value that is built on it."]'::jsonb, explanation = 'EGINA''s oil P50 is 130.0000 MMbbl and its gas P50 is 70.0000 Bcf, and those labels came from a distribution somebody built. The sweep carries no claim about likelihood.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 18: prompt, option_0, option_3
  select case
           when prompt = 'The lowest figure anywhere in the sweep is 501.5628. Is that the worst the case can do?' and options = '["Yes, since the widest single driver, at a swing of 3092.0051, already carries any combination of moves that could be made to the case and its four drivers at once.", "Yes, because 30 percent is the largest move the sweep may make on a driver.", "No, because one driver moves at a time, so a price fall arriving with a capex overrun is nowhere in the table and sits below every figure printed in it.", "No, because the capex overrun end of 1403.9781 is lower still than that figure."]'::jsonb and answer_index = 2 and explanation = 'On the published marginal case with 900.0000 of capex at 45.0000 the price downside is -225.0477 and the capex overrun end is -44.7315, and the case where both happen is absent.' then 'old'
           when prompt = 'The lowest figure anywhere in the sweep is 466.5563. Is that the worst the case can do?' and options = '["Yes, since the widest single driver, at a swing of 3097.7119, already carries any combination of moves that could be made to the case and its four drivers at once.", "Yes, because 30 percent is the largest move the sweep may make on a driver.", "No, because one driver moves at a time, so a price fall arriving with a capex overrun is nowhere in the table and sits below every figure printed in it.", "No, because the capex overrun end of 1371.8250 is lower still than that figure."]'::jsonb and answer_index = 2 and explanation = 'On the published marginal case with 900.0000 of capex at 45.0000 the price downside is -225.0477 and the capex overrun end is -44.7315, and the case where both happen is absent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 18'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The lowest figure anywhere in the sweep is 466.5563. Is that the worst the case can do?', options = '["Yes, since the widest single driver, at a swing of 3097.7119, already carries any combination of moves that could be made to the case and its four drivers at once.", "Yes, because 30 percent is the largest move the sweep may make on a driver.", "No, because one driver moves at a time, so a price fall arriving with a capex overrun is nowhere in the table and sits below every figure printed in it.", "No, because the capex overrun end of 1371.8250 is lower still than that figure."]'::jsonb, explanation = 'On the published marginal case with 900.0000 of capex at 45.0000 the price downside is -225.0477 and the capex overrun end is -44.7315, and the case where both happen is absent.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 28: option_1
  select case
           when prompt = 'A reviewer meets a schedule index of 1.795082 and a proposal to type 150 into a percent complete, and treats both as numbers above one the engine ought to handle alike. What separates them?' and options = '["Nothing: both are clipped, the index back to one and the progress back to 100.0000 percent, which is why a task ahead of its own window cannot show it on either figure.", "The index is a ratio and the progress a percentage, so 1.795082 is accepted as 179.5082 percent of the plan and the 150 refused only because it was typed into the wrong field.", "The index is refused as well on any task whose window is still open, since a schedule reading may pass one only after the last window has closed and the whole budget has been scheduled.", "The index is a verified reading against a planned value smaller than the budget, and the 150 is refused at the input because earned value may not pass the budget at completion."]'::jsonb and answer_index = 3 and explanation = 'A task 90.0000 percent done half way through its window reads 1.795082 against a completion ratio of 0.900000, and the old capped ratio could never make that reading; progress of 150 meets "Overdone: percent complete must be between 0 and 100, not 150".' then 'old'
           when prompt = 'A reviewer meets a schedule index of 1.795082 and a proposal to type 150 into a percent complete, and treats both as numbers above one the engine ought to handle alike. What separates them?' and options = '["Nothing: both are clipped, the index back to one and the progress back to 100.0000 percent, which is why a task ahead of its own window cannot show it on either figure.", "The index is a ratio and the progress a percentage, so 1.795082 is accepted as a share of the plan and the 150 refused only because it was typed into the wrong field.", "The index is refused as well on any task whose window is still open, since a schedule reading may pass one only after the last window has closed and the whole budget has been scheduled.", "The index is a verified reading against a planned value smaller than the budget, and the 150 is refused at the input because earned value may not pass the budget at completion."]'::jsonb and answer_index = 3 and explanation = 'A task 90.0000 percent done half way through its window reads 1.795082 against a completion ratio of 0.900000, and the old capped ratio could never make that reading; progress of 150 meets "Overdone: percent complete must be between 0 and 100, not 150".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 28'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer meets a schedule index of 1.795082 and a proposal to type 150 into a percent complete, and treats both as numbers above one the engine ought to handle alike. What separates them?', options = '["Nothing: both are clipped, the index back to one and the progress back to 100.0000 percent, which is why a task ahead of its own window cannot show it on either figure.", "The index is a ratio and the progress a percentage, so 1.795082 is accepted as a share of the plan and the 150 refused only because it was typed into the wrong field.", "The index is refused as well on any task whose window is still open, since a schedule reading may pass one only after the last window has closed and the whole budget has been scheduled.", "The index is a verified reading against a planned value smaller than the budget, and the 150 is refused at the input because earned value may not pass the budget at completion."]'::jsonb, explanation = 'A task 90.0000 percent done half way through its window reads 1.795082 against a completion ratio of 0.900000, and the old capped ratio could never make that reading; progress of 150 meets "Overdone: percent complete must be between 0 and 100, not 150".'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 33: explanation, option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The plan''s cost items carry a Decommissioning provision of 260.0000 typed as ABEX, and the engine reports a CAPEX total of 2250.0000 and an OPEX total of 95.0000 a year. Where is the 260.0000?' and options = '["In neither total, because the screening case carries capex and operating cost only, so a line can be in the plan, correct, and absent from the number the plan reports.", "Inside the CAPEX total of 2250.0000, beside the drilling of 520.0000 and the subsea of 380.0000, because a provision is money committed ahead of first oil.", "Spread through the operating years inside the 95.0000 a year, which is how an abandonment provision is charged, and taken again in the facility figure of 204.5029.", "Inside the facility screening estimate of 1363.3524, which carries decommissioning at 0.150000 of the capex the facility holds, so the plan''s own line duplicates it."]'::jsonb and answer_index = 0 and explanation = 'The engine totals are CAPEX 2250.0000 and OPEX 95.0000. The screening estimate does carry its own decommissioning figure of 204.5029, a different number from a different method.' then 'old'
           when prompt = 'The plan''s cost items carry a Decommissioning provision of 260.0000 typed as ABEX, and the engine reports a CAPEX total of 2250.0000 and an OPEX total of 95.0000 a year. Where is the 260.0000?' and options = '["In neither total, because an ABEX line is neither development capex nor an annual operating cost, and the case charges it in the final production year instead.", "Inside the CAPEX total of 2250.0000, beside the drilling of 520.0000 and the subsea of 380.0000, because a provision is money committed ahead of first oil.", "Spread through the operating years inside the 95.0000 a year, which is how an abandonment provision is charged, and taken again in the facility figure of 204.5029.", "Inside the facility screening estimate of 1363.3524, which carries decommissioning at 0.150000 of the capex the facility holds, so the plan''s own line duplicates it."]'::jsonb and answer_index = 0 and explanation = 'The engine totals are CAPEX 2250.0000 and OPEX 95.0000. The screening estimate carries its own decommissioning figure of 204.5029, which an ABEX cost item replaces rather than adds to.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 33'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The plan''s cost items carry a Decommissioning provision of 260.0000 typed as ABEX, and the engine reports a CAPEX total of 2250.0000 and an OPEX total of 95.0000 a year. Where is the 260.0000?', options = '["In neither total, because an ABEX line is neither development capex nor an annual operating cost, and the case charges it in the final production year instead.", "Inside the CAPEX total of 2250.0000, beside the drilling of 520.0000 and the subsea of 380.0000, because a provision is money committed ahead of first oil.", "Spread through the operating years inside the 95.0000 a year, which is how an abandonment provision is charged, and taken again in the facility figure of 204.5029.", "Inside the facility screening estimate of 1363.3524, which carries decommissioning at 0.150000 of the capex the facility holds, so the plan''s own line duplicates it."]'::jsonb, explanation = 'The engine totals are CAPEX 2250.0000 and OPEX 95.0000. The screening estimate carries its own decommissioning figure of 204.5029, which an ABEX cost item replaces rather than adds to.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 35: prompt, option_0, option_1, option_2
  select case
           when prompt = 'A reader wants the rate of return that goes with the sweep''s minus 30 percent oil price end of 501.5628. Where is it?' and options = '["In the scenario table at 14.4152 percent, since the Low price case at 48.0000 USD a barrel is that same downside read through a different card of the studio.", "In the price rows at 8.2444 percent, because the sweep takes the price down to about the level the 40.0000 USD a barrel row prices and that row carries its own rate.", "In the base at 29.5998 percent reduced in the proportion the driver moved, because a rate and a value both scale with the input the sweep has changed.", "Nowhere in the sweep, whose eight ends are amounts of money."]'::jsonb and answer_index = 3 and explanation = 'A rate would need its own run, and the engine reports one only when it verifies a root inside the band between -99 and 1000 percent. On some flows there is none to verify.' then 'old'
           when prompt = 'A reader wants the rate of return that goes with the sweep''s minus 30 percent oil price end of 466.5563. Where is it?' and options = '["In the scenario table at the Low price case, since 48.0000 USD a barrel is that same downside read through a different card of the studio.", "In the price rows at the 40.0000 USD a barrel run, because the sweep takes the price down to about that level and that row carries a rate of its own.", "In the base, reduced in the proportion the driver moved, because a rate and a value both scale with the input the sweep has changed.", "Nowhere in the sweep, whose eight ends are amounts of money."]'::jsonb and answer_index = 3 and explanation = 'A rate would need its own run, and the engine reports one only when it verifies a root inside the band between -99 and 1000 percent. On some flows there is none to verify.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 35'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader wants the rate of return that goes with the sweep''s minus 30 percent oil price end of 466.5563. Where is it?', options = '["In the scenario table at the Low price case, since 48.0000 USD a barrel is that same downside read through a different card of the studio.", "In the price rows at the 40.0000 USD a barrel run, because the sweep takes the price down to about that level and that row carries a rate of its own.", "In the base, reduced in the proportion the driver moved, because a rate and a value both scale with the input the sweep has changed.", "Nowhere in the sweep, whose eight ends are amounts of money."]'::jsonb, explanation = 'A rate would need its own run, and the engine reports one only when it verifies a root inside the band between -99 and 1000 percent. On some flows there is none to verify.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 36: explanation, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Which measure is defined for every one of the five EGINA scenarios, including the case at 18.0000 USD a barrel?' and options = '["The internal rate of return, since the engine returns a status for every case and a status of no-root is itself the answer the search arrived at for that flow.", "The NPV, defined for every cash flow at every discount rate whether or not a root exists, and reading -1797.2732 on that case.", "The payback, since a case that does not pay back is recorded at the project life.", "The swing, since the sweep re-runs each scenario across its four drivers and the widest of them, 3092.0051, exists for any case the engine is able to price."]'::jsonb and answer_index = 1 and explanation = 'The rate is missing on the stress case and the payback there is never. A card that leads with a rate has nothing to print on the case that most needs reading.' then 'old'
           when prompt = 'Which measure is defined for every one of the five EGINA scenarios, including the case at 18.0000 USD a barrel?' and options = '["The internal rate of return, since the engine returns a status for every case and a status of no-root is itself the answer the search arrived at for that flow.", "The NPV, defined for every cash flow at every discount rate whether or not a root exists, and reading -1834.1220 on that case.", "The payback, since a case that does not pay back is recorded at the project life.", "The swing, since the sweep re-runs each scenario across its four drivers and the widest of them, 3097.7119, exists for any case the engine is able to price."]'::jsonb and answer_index = 1 and explanation = 'The rate is missing on every one of the five and the payback at 18.0000 is never. A card that leads with a rate has nothing to print on any of them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 36'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which measure is defined for every one of the five EGINA scenarios, including the case at 18.0000 USD a barrel?', options = '["The internal rate of return, since the engine returns a status for every case and a status of no-root is itself the answer the search arrived at for that flow.", "The NPV, defined for every cash flow at every discount rate whether or not a root exists, and reading -1834.1220 on that case.", "The payback, since a case that does not pay back is recorded at the project life.", "The swing, since the sweep re-runs each scenario across its four drivers and the widest of them, 3097.7119, exists for any case the engine is able to price."]'::jsonb, explanation = 'The rate is missing on every one of the five and the payback at 18.0000 is never. A card that leads with a rate has nothing to print on any of them.'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6a_exam ord 41: option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Three reports arrive: a scenario with no rate of return, a project whose schedule index is none because one costed task carries no dates, and a project with no planned value at all. What does a reader take to a decision from each?' and options = '["The NPV of -1797.2732 and a payback of never, then the earned value, the actual cost and the completion ratio of 0.256839, and then nothing until a cost is entered.", "A rate of 1000 percent, an index of one and a percent complete of zero, each being what the engine returns once its own search or its own denominator runs out.", "The status alone in all three, since no-root, a planned value that cannot be phased and a task list with no costs are findings rather than measurements and carry no figures.", "The completion ratio in all three, since it needs neither a root nor a calendar and reads 0.261250 wherever a budget at completion has been built from the task list."]'::jsonb and answer_index = 0 and explanation = 'The basis lines say which measurement is gone and why: "1 costed task carries no planned dates, so planned value cannot be time-phased" and "no costed task, so there is no planned value".' then 'old'
           when prompt = 'Three reports arrive: a scenario with no rate of return, a project whose schedule index is none because one costed task carries no dates, and a project with no planned value at all. What does a reader take to a decision from each?' and options = '["The NPV of -1834.1220 and a payback of never, then the earned value, the actual cost and the completion ratio of 0.256839, and then nothing until a cost is entered.", "A rate of 1000 percent, an index of one and a percent complete of zero, each being what the engine returns once its own search or its own denominator runs out.", "The status alone in all three, since no-root, a planned value that cannot be phased and a task list with no costs are findings rather than measurements and carry no figures.", "The completion ratio in all three, since it needs neither a root nor a calendar and reads 0.261250 wherever a budget at completion has been built from the task list."]'::jsonb and answer_index = 0 and explanation = 'The basis lines say which measurement is gone and why: "1 costed task carries no planned dates, so planned value cannot be time-phased" and "no costed task, so there is no planned value".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6a_exam ord 41'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6a_exam ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three reports arrive: a scenario with no rate of return, a project whose schedule index is none because one costed task carries no dates, and a project with no planned value at all. What does a reader take to a decision from each?', options = '["The NPV of -1834.1220 and a payback of never, then the earned value, the actual cost and the completion ratio of 0.256839, and then nothing until a cost is entered.", "A rate of 1000 percent, an index of one and a percent complete of zero, each being what the engine returns once its own search or its own denominator runs out.", "The status alone in all three, since no-root, a planned value that cannot be phased and a task list with no costs are findings rather than measurements and carry no figures.", "The completion ratio in all three, since it needs neither a root nor a calendar and reads 0.261250 wherever a budget at completion has been built from the task list."]'::jsonb, explanation = 'The basis lines say which measurement is gone and why: "1 costed task carries no planned dates, so planned value cannot be time-phased" and "no costed task, so there is no planned value".'
     where app_slug = 'fdp' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6a_exam ord 41 updated % rows', v_count; end if;
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

  raise notice 'EC6 recut advanced: % of 56 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-the-rate-of-return', 1),
    ('module', 'm01-the-rate-of-return', 2),
    ('module', 'm01-the-rate-of-return', 3),
    ('module', 'm01-the-rate-of-return', 4),
    ('module', 'm01-the-rate-of-return', 5),
    ('module', 'm01-the-rate-of-return', 6),
    ('module', 'm01-the-rate-of-return', 7),
    ('module', 'm01-the-rate-of-return', 8),
    ('module', 'm01-the-rate-of-return', 9),
    ('module', 'm01-the-rate-of-return', 10),
    ('module', 'm01-the-rate-of-return', 11),
    ('module', 'm01-the-rate-of-return', 13),
    ('module', 'm01-the-rate-of-return', 14),
    ('module', 'm01-the-rate-of-return', 15),
    ('module', 'm02-when-there-is-no-rate', 7),
    ('module', 'm02-when-there-is-no-rate', 8),
    ('module', 'm02-when-there-is-no-rate', 11),
    ('module', 'm02-when-there-is-no-rate', 13),
    ('module', 'm02-when-there-is-no-rate', 14),
    ('module', 'm02-when-there-is-no-rate', 15),
    ('module', 'm03-what-a-sensitivity-says', 1),
    ('module', 'm03-what-a-sensitivity-says', 2),
    ('module', 'm03-what-a-sensitivity-says', 3),
    ('module', 'm03-what-a-sensitivity-says', 4),
    ('module', 'm03-what-a-sensitivity-says', 5),
    ('module', 'm03-what-a-sensitivity-says', 6),
    ('module', 'm03-what-a-sensitivity-says', 8),
    ('module', 'm03-what-a-sensitivity-says', 9),
    ('module', 'm03-what-a-sensitivity-says', 10),
    ('module', 'm03-what-a-sensitivity-says', 11),
    ('module', 'm03-what-a-sensitivity-says', 12),
    ('module', 'm03-what-a-sensitivity-says', 13),
    ('module', 'm03-what-a-sensitivity-says', 14),
    ('module', 'm03-what-a-sensitivity-says', 15),
    ('module', 'm06-reading-a-plan-against-itself', 4),
    ('module', 'm06-reading-a-plan-against-itself', 10),
    ('module', 'm06-reading-a-plan-against-itself', 13),
    ('final', null::text, 1),
    ('final', null::text, 2),
    ('final', null::text, 3),
    ('final', null::text, 5),
    ('final', null::text, 6),
    ('final', null::text, 9),
    ('final', null::text, 10),
    ('final', null::text, 11),
    ('final', null::text, 13),
    ('final', null::text, 14),
    ('final', null::text, 15),
    ('final', null::text, 16),
    ('final', null::text, 17),
    ('final', null::text, 18),
    ('final', null::text, 28),
    ('final', null::text, 33),
    ('final', null::text, 35),
    ('final', null::text, 36),
    ('final', null::text, 41)
)
select 'ec6 recut advanced' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fdp' and q.tier = 'advanced'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec6 recut advanced' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fdp' and tier = 'advanced'
 group by scope, module_key
 order by scope desc, module_key nulls last;
