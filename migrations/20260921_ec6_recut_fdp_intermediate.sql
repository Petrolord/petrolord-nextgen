-- ============================================================================
-- EC6 RECUT, PROFESSIONAL TIER (intermediate): Field Development Planning
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
-- WHAT MOVES. 5 of the 132 Professional questions, 1 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to change, the new correct
-- text was written at the SAME index, so the key balance and key pattern of
-- every bank are untouched. No ord, no module key, no scope and no row count
-- moves.
-- Fields rewritten: 1 prompts, 5 options, 3 explanations.
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
-- NEW text in docs/ec6-abex-recut/MANIFEST-intermediate.json was independently
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

  -- ec6i_m04 ord 9: explanation, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The plan''s cost ledger carries a decommissioning provision of 260.0000 million USD as an ABEX line. Where does that provision show up in the screening case?' and options = '["Inside the CAPEX total of 2250.0000, alongside development drilling at 520.0000 and the subsea system at 380.0000, which is how the ledger and the concept come to agree.", "Nowhere: it sits in neither the CAPEX total of 2250.0000 nor the operating cost of 95.0000 a year, and the card''s own allowance of 204.5029 does not enter the screening NPV either.", "Inside the operating cost of 95.0000 a year, spread across the concept''s 20.0000 year life in the way maintenance and integrity at 23.0000 a year is spread.", "In place of the facility card''s allowance of 204.5029, the studio preferring the figure a person wrote whenever the ledger carries a removal line of its own."]'::jsonb and answer_index = 1 and explanation = 'The plan holds one removal figure a person wrote and the card holds another a curve produced, and reconciling 260.0000 against 204.5029 is planning work.' then 'old'
           when prompt = 'The plan''s cost ledger carries a decommissioning provision of 260.0000 million USD as an ABEX line. Where does that provision show up in the screening case?' and options = '["Inside the CAPEX total of 2250.0000, alongside development drilling at 520.0000 and the subsea system at 380.0000, which is how the ledger and the concept come to agree.", "In the final production year: it sits in neither the CAPEX total of 2250.0000 nor the operating cost of 95.0000 a year, and the case charges it there as the plan''s end-of-life cost.", "Inside the operating cost of 95.0000 a year, spread across the concept''s 20.0000 year life in the way maintenance and integrity at 23.0000 a year is spread.", "Inside the facility card''s allowance of 204.5029, which the ledger line is added to so that one removal figure covers the vessel and the field at once."]'::jsonb and answer_index = 1 and explanation = 'An ABEX cost item replaces the facility estimate rather than being added to it, so the case charges the plan''s own 260.0000 and the card''s 204.5029 never enters the NPV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-facilities-sized-and-priced' and ord = 9;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6i_m04 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6i_m04 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The plan''s cost ledger carries a decommissioning provision of 260.0000 million USD as an ABEX line. Where does that provision show up in the screening case?', options = '["Inside the CAPEX total of 2250.0000, alongside development drilling at 520.0000 and the subsea system at 380.0000, which is how the ledger and the concept come to agree.", "In the final production year: it sits in neither the CAPEX total of 2250.0000 nor the operating cost of 95.0000 a year, and the case charges it there as the plan''s end-of-life cost.", "Inside the operating cost of 95.0000 a year, spread across the concept''s 20.0000 year life in the way maintenance and integrity at 23.0000 a year is spread.", "Inside the facility card''s allowance of 204.5029, which the ledger line is added to so that one removal figure covers the vessel and the field at once."]'::jsonb, explanation = 'An ABEX cost item replaces the facility estimate rather than being added to it, so the case charges the plan''s own 260.0000 and the card''s 204.5029 never enters the NPV.'
     where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-facilities-sized-and-priced' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6i_m04 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6i_m06 ord 8: option_1
  select case
           when prompt = 'The generated document reports a completeness of 100 percent across nine sections. What has that measured?' and options = '["That the nine sections agree with one another, which is what makes the concept capex of 2250.0000 million USD and the cost ledger''s total of 2250.0000 million USD the same figure.", "That every figure in the plan has been through the engine rather than typed, so the completeness check is what stands behind the headline NPV of 2047.5653 million USD.", "That nine of the nine checks the studio runs came back without a warning, the same check that returns isValid true and an empty list of errors on this plan.", "That each of the nine sections it checks carries something, Field Data through to Risks."]'::jsonb and answer_index = 3 and explanation = 'The document reports what is there and what is missing and does not fill gaps: the nine sections are Field Data, Subsurface, Concepts, Wells, Facilities, Schedule, Economics, HSE and Risks.' then 'old'
           when prompt = 'The generated document reports a completeness of 100 percent across nine sections. What has that measured?' and options = '["That the nine sections agree with one another, which is what makes the concept capex of 2250.0000 million USD and the cost ledger''s total of 2250.0000 million USD the same figure.", "That every figure in the plan has been through the engine rather than typed, so the completeness check is what stands behind the headline NPV of 2015.4123 million USD.", "That nine of the nine checks the studio runs came back without a warning, the same check that returns isValid true and an empty list of errors on this plan.", "That each of the nine sections it checks carries something, Field Data through to Risks."]'::jsonb and answer_index = 3 and explanation = 'The document reports what is there and what is missing and does not fill gaps: the nine sections are Field Data, Subsurface, Concepts, Wells, Facilities, Schedule, Economics, HSE and Risks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 8;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6i_m06 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6i_m06 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The generated document reports a completeness of 100 percent across nine sections. What has that measured?', options = '["That the nine sections agree with one another, which is what makes the concept capex of 2250.0000 million USD and the cost ledger''s total of 2250.0000 million USD the same figure.", "That every figure in the plan has been through the engine rather than typed, so the completeness check is what stands behind the headline NPV of 2015.4123 million USD.", "That nine of the nine checks the studio runs came back without a warning, the same check that returns isValid true and an empty list of errors on this plan.", "That each of the nine sections it checks carries something, Field Data through to Risks."]'::jsonb, explanation = 'The document reports what is there and what is missing and does not fill gaps: the nine sections are Field Data, Subsurface, Concepts, Wells, Facilities, Schedule, Economics, HSE and Risks.'
     where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6i_m06 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6i_m06 ord 15: prompt, explanation, option_1
  select case
           when prompt = 'The document''s headline figures read P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, total CAPEX 2250.0000, NPV 2047.5653 and IRR 29.5998, with 4 wells. Which of them carries a P label correctly?' and options = '["The oil, the gas and the CAPEX, since the capex of 2250.0000 is itself a screening distribution and the document reports its middle case alongside the volumes.", "The oil, the gas and the NPV, since a net present value of 2047.5653 is carried at the same case as the reserves it was computed from and is labelled with them.", "The oil and the gas, since a P label belongs to a reserves distribution one fluid at a time.", "None of them, since a P label belongs to a distribution across reservoirs and the document reports one field, so its volumes are single figures rather than percentiles."]'::jsonb and answer_index = 2 and explanation = 'A capex, a rate, a cost, a duration, an index or a ratio never takes a P label, so the 2250.0000, the 2047.5653 and the 29.5998 carry none.' then 'old'
           when prompt = 'The document''s headline figures read P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, total CAPEX 2250.0000, NPV 2015.4123 and IRR none, with 4 wells. Which of them carries a P label correctly?' and options = '["The oil, the gas and the CAPEX, since the capex of 2250.0000 is itself a screening distribution and the document reports its middle case alongside the volumes.", "The oil, the gas and the NPV, since a net present value of 2015.4123 is carried at the same case as the reserves it was computed from and is labelled with them.", "The oil and the gas, since a P label belongs to a reserves distribution one fluid at a time.", "None of them, since a P label belongs to a distribution across reservoirs and the document reports one field, so its volumes are single figures rather than percentiles."]'::jsonb and answer_index = 2 and explanation = 'A capex, a rate, a cost, a duration, an index or a ratio never takes a P label, so the 2250.0000 and the 2015.4123 carry none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6i_m06 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6i_m06 ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The document''s headline figures read P50 oil 130.0000 MMbbl, P50 gas 70.0000 Bcf, total CAPEX 2250.0000, NPV 2015.4123 and IRR none, with 4 wells. Which of them carries a P label correctly?', options = '["The oil, the gas and the CAPEX, since the capex of 2250.0000 is itself a screening distribution and the document reports its middle case alongside the volumes.", "The oil, the gas and the NPV, since a net present value of 2015.4123 is carried at the same case as the reserves it was computed from and is labelled with them.", "The oil and the gas, since a P label belongs to a reserves distribution one fluid at a time.", "None of them, since a P label belongs to a distribution across reservoirs and the document reports one field, so its volumes are single figures rather than percentiles."]'::jsonb, explanation = 'A capex, a rate, a cost, a duration, an index or a ratio never takes a P label, so the 2250.0000 and the 2015.4123 carry none.'
     where app_slug = 'fdp' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6i_m06 ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6i_exam ord 22: option_2
  select case
           when prompt = 'The FPSO card''s capex of 1363.3524 is a screening figure, and the plan''s ledger carries hull and topsides at 1180.0000 with mooring and installation at 170.0000. What can be done with the ledger that cannot be done with the card?' and options = '["Its lines can each be rescaled to a new nameplate, since every one of them carries the same power 0.7 exponent that the screening curve applies only to a total figure at the end.", "Its lines can be interrogated, because a person wrote each of them and can defend it, while the curve reads a type and a nameplate and holds nothing inside to question.", "Its lines enter the screening economics, while the card''s capex is reported beside the plan and left out of them in the way the ABEX line is left out.", "Its lines carry contingency and standby, which is what separates 1363.3524 from the 1350.0000 the concept holds in its facilities field."]'::jsonb and answer_index = 1 and explanation = '1363.3524 is an output of two inputs and it moves the moment somebody revises the nameplate, with no new engineering behind the change.' then 'old'
           when prompt = 'The FPSO card''s capex of 1363.3524 is a screening figure, and the plan''s ledger carries hull and topsides at 1180.0000 with mooring and installation at 170.0000. What can be done with the ledger that cannot be done with the card?' and options = '["Its lines can each be rescaled to a new nameplate, since every one of them carries the same power 0.7 exponent that the screening curve applies only to a total figure at the end.", "Its lines can be interrogated, because a person wrote each of them and can defend it, while the curve reads a type and a nameplate and holds nothing inside to question.", "Its lines enter the screening economics, while the card''s capex is left out of them because a screening estimate and an ABEX line are treated in exactly the same way.", "Its lines carry contingency and standby, which is what separates 1363.3524 from the 1350.0000 the concept holds in its facilities field."]'::jsonb and answer_index = 1 and explanation = '1363.3524 is an output of two inputs and it moves the moment somebody revises the nameplate, with no new engineering behind the change.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6i_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6i_exam ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The FPSO card''s capex of 1363.3524 is a screening figure, and the plan''s ledger carries hull and topsides at 1180.0000 with mooring and installation at 170.0000. What can be done with the ledger that cannot be done with the card?', options = '["Its lines can each be rescaled to a new nameplate, since every one of them carries the same power 0.7 exponent that the screening curve applies only to a total figure at the end.", "Its lines can be interrogated, because a person wrote each of them and can defend it, while the curve reads a type and a nameplate and holds nothing inside to question.", "Its lines enter the screening economics, while the card''s capex is left out of them because a screening estimate and an ABEX line are treated in exactly the same way.", "Its lines carry contingency and standby, which is what separates 1363.3524 from the 1350.0000 the concept holds in its facilities field."]'::jsonb, explanation = '1363.3524 is an output of two inputs and it moves the moment somebody revises the nameplate, with no new engineering behind the change.'
     where app_slug = 'fdp' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6i_exam ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec6i_exam ord 26: explanation
  select case
           when prompt = 'The FPSO card carries a decommissioning allowance of 204.5029 and the plan''s ledger carries an ABEX line of 260.0000 million USD. Where do those two figures sit in roll-ups of 2250.0000 CAPEX and 95.0000 OPEX?' and options = '["The 260.0000 is inside the CAPEX total and the 204.5029 is left out of it, which is how the ledger comes to agree with the concept''s own capex of 2250.0000 to the decimal.", "The 204.5029 is inside the CAPEX total of 2250.0000 and the 260.0000 is spread across the operating cost of 95.0000 a year over the concept''s own 20.0000 year life.", "In neither: the roll-ups add the CAPEX and OPEX lines the ledger holds, so one removal figure sits outside the totals and the other was never in the ledger at all.", "Both sit inside the OPEX total of 95.0000 a year, which is why that figure stands well above the card''s own annual operating cost of 55.7800 for the same vessel."]'::jsonb and answer_index = 2 and explanation = 'The plan holds one removal figure a person wrote and the card holds another a curve produced, and the screening case carries capex and operating cost only.' then 'old'
           when prompt = 'The FPSO card carries a decommissioning allowance of 204.5029 and the plan''s ledger carries an ABEX line of 260.0000 million USD. Where do those two figures sit in roll-ups of 2250.0000 CAPEX and 95.0000 OPEX?' and options = '["The 260.0000 is inside the CAPEX total and the 204.5029 is left out of it, which is how the ledger comes to agree with the concept''s own capex of 2250.0000 to the decimal.", "The 204.5029 is inside the CAPEX total of 2250.0000 and the 260.0000 is spread across the operating cost of 95.0000 a year over the concept''s own 20.0000 year life.", "In neither: the roll-ups add the CAPEX and OPEX lines the ledger holds, so one removal figure sits outside the totals and the other was never in the ledger at all.", "Both sit inside the OPEX total of 95.0000 a year, which is why that figure stands well above the card''s own annual operating cost of 55.7800 for the same vessel."]'::jsonb and answer_index = 2 and explanation = 'The plan holds one removal figure a person wrote and the card holds another a curve produced, and the case charges the ledger''s ABEX line in the final production year while the card''s allowance never enters it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fdp' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'EC6 recut refused: no row for ec6i_exam ord 26'; end if;
  if v_state = 'other' then raise exception 'EC6 recut refused: ec6i_exam ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The FPSO card carries a decommissioning allowance of 204.5029 and the plan''s ledger carries an ABEX line of 260.0000 million USD. Where do those two figures sit in roll-ups of 2250.0000 CAPEX and 95.0000 OPEX?', options = '["The 260.0000 is inside the CAPEX total and the 204.5029 is left out of it, which is how the ledger comes to agree with the concept''s own capex of 2250.0000 to the decimal.", "The 204.5029 is inside the CAPEX total of 2250.0000 and the 260.0000 is spread across the operating cost of 95.0000 a year over the concept''s own 20.0000 year life.", "In neither: the roll-ups add the CAPEX and OPEX lines the ledger holds, so one removal figure sits outside the totals and the other was never in the ledger at all.", "Both sit inside the OPEX total of 95.0000 a year, which is why that figure stands well above the card''s own annual operating cost of 55.7800 for the same vessel."]'::jsonb, explanation = 'The plan holds one removal figure a person wrote and the card holds another a curve produced, and the case charges the ledger''s ABEX line in the final production year while the card''s allowance never enters it.'
     where app_slug = 'fdp' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC6 recut refused: ec6i_exam ord 26 updated % rows', v_count; end if;
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

  raise notice 'EC6 recut intermediate: % of 5 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm04-facilities-sized-and-priced', 9),
    ('module', 'm06-the-professional-reading', 8),
    ('module', 'm06-the-professional-reading', 15),
    ('final', null::text, 22),
    ('final', null::text, 26)
)
select 'ec6 recut intermediate' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fdp' and q.tier = 'intermediate'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec6 recut intermediate' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fdp' and tier = 'intermediate'
 group by scope, module_key
 order by scope desc, module_key nulls last;
