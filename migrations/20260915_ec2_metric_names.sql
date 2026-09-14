-- ============================================================================
-- EC2 METRIC NAMES (naming wave, owner decision 2026-09-14): Fiscal Regime
-- Design bank rows and capstone labels reworded to the two named metrics.
--
-- GOVERNMENT TAKE is the headline: government cash flow divided by revenue
-- less opex less capex. GOVERNMENT SHARE OF NET REVENUE is second: government
-- cash flow divided by revenue less opex, capex added back. The money both
-- divide is GOVERNMENT CASH FLOW. Definitions live in the engines package,
-- engines/economics/fiscalConventions.js. An earlier build labelled both
-- ratios "effective tax rate" and called the money "government take".
--
-- No graded value, tolerance, answer index, question id, ord or count moves.
-- Rows are rewritten IN PLACE by (app_slug, tier, scope, module_key, ord).
--
-- GUARDS. Each question row must match EITHER its published text exactly
-- (then it is updated) OR the new text exactly (already applied, left alone);
-- anything else raises. Every tier must still hold 132 questions. Capstone
-- labels change only on the named keys, only from the published or to the new
-- label, and the expected values and tolerances are compared before and after.
--
-- HELD. Apply only after the NextGen upload carrying the renamed lessons and
-- panels is verified live.
-- ============================================================================

do $$
declare
  v_state text;
  v_count integer;
begin

  -- ec2b_m01 ord 6
  select case
           when prompt = 'The published case that puts capex of 20000 on the test project reports payback year null and payout year null. What does that say about its 25 rows?' and options = '["The engine truncated the run in the year the pool was judged unrecoverable, so the totals cover fewer than 25 rows.", "The rows after the loss were computed but left out of government take, which is why that figure stops at 875.1492 million USD.", "Nothing stopped. All 25 were computed, taxed and counted into the totals, and null records only that cumulative contractor net cash flow never rose above zero.", "The project was abandoned inside the model, and the abandonment charge is the closing pool of 15724.0151 million USD."]'::jsonb and answer_index = 2 and explanation = 'Reading null as a stop is how a reader ends up quoting a 25 year royalty stream as a short one. Total contractor net cash flow on that case is -15724.0151 million USD.' then 'old'
           when prompt = 'The published case that puts capex of 20000 on the test project reports payback year null and payout year null. What does that say about its 25 rows?' and options = '["The engine truncated the run in the year the pool was judged unrecoverable, so the totals cover fewer than 25 rows.", "The rows after the loss were computed but left out of government cash flow, which is why that figure stops at 875.1492 million USD.", "Nothing stopped. All 25 were computed, taxed and counted into the totals, and null records only that cumulative contractor net cash flow never rose above zero.", "The project was abandoned inside the model, and the abandonment charge is the closing pool of 15724.0151 million USD."]'::jsonb and answer_index = 2 and explanation = 'Reading null as a stop is how a reader ends up quoting a 25 year royalty stream as a short one. Total contractor net cash flow on that case is -15724.0151 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m01 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m01 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case that puts capex of 20000 on the test project reports payback year null and payout year null. What does that say about its 25 rows?', options = '["The engine truncated the run in the year the pool was judged unrecoverable, so the totals cover fewer than 25 rows.", "The rows after the loss were computed but left out of government cash flow, which is why that figure stops at 875.1492 million USD.", "Nothing stopped. All 25 were computed, taxed and counted into the totals, and null records only that cumulative contractor net cash flow never rose above zero.", "The project was abandoned inside the model, and the abandonment charge is the closing pool of 15724.0151 million USD."]'::jsonb, explanation = 'Reading null as a stop is how a reader ends up quoting a 25 year royalty stream as a short one. Total contractor net cash flow on that case is -15724.0151 million USD.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m01 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2b_m01 ord 14
  select case
           when prompt = 'The engine header names a single source of truth for Nigerian fiscal math. What is this model for?' and options = '["Comparing the shape of regimes against each other, with the Petroleum Economics Studio engine holding the fiscal truth.", "Assessing a Nigerian liability under the Petroleum Industry Act, which is why the template set carries a PIA entry at all.", "Producing a filing figure, once a template has been reconciled against the Petroleum Economics Studio engine on the same project.", "Replacing that engine for screening work, since the two agree on a total government take of 1339.2784 million USD."]'::jsonb and answer_index = 0 and explanation = 'A template named for a jurisdiction is a caricature in six numbers, useful for asking which instrument moved which result and unfit for filing anything.' then 'old'
           when prompt = 'The engine header names a single source of truth for Nigerian fiscal math. What is this model for?' and options = '["Comparing the shape of regimes against each other, with the Petroleum Economics Studio engine holding the fiscal truth.", "Assessing a Nigerian liability under the Petroleum Industry Act, which is why the template set carries a PIA entry at all.", "Producing a filing figure, once a template has been reconciled against the Petroleum Economics Studio engine on the same project.", "Replacing that engine for screening work, since the two agree on a total government cash flow of 1339.2784 million USD."]'::jsonb and answer_index = 0 and explanation = 'A template named for a jurisdiction is a caricature in six numbers, useful for asking which instrument moved which result and unfit for filing anything.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 14;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m01 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m01 ord 14 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The engine header names a single source of truth for Nigerian fiscal math. What is this model for?', options = '["Comparing the shape of regimes against each other, with the Petroleum Economics Studio engine holding the fiscal truth.", "Assessing a Nigerian liability under the Petroleum Industry Act, which is why the template set carries a PIA entry at all.", "Producing a filing figure, once a template has been reconciled against the Petroleum Economics Studio engine on the same project.", "Replacing that engine for screening work, since the two agree on a total government cash flow of 1339.2784 million USD."]'::jsonb, explanation = 'A template named for a jurisdiction is a caricature in six numbers, useful for asking which instrument moved which result and unfit for filing anything.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m01 ord 14 updated % rows', v_count; end if;
  end if;

  -- ec2b_m01 ord 15
  select case
           when prompt = 'A term sheet carries a signature bonus, a domestic supply obligation and a state participation share. How are the three entered?' and options = '["The bonus goes into a capex bucket, the obligation into the variable opex rate, and the participation share into the contractor split.", "Each becomes a tier on the profit split, the one field taking more than one entry.", "They are not. A regime needing any of them cannot be expressed in this sandbox at all.", "They ride on the template''s description string into government take."]'::jsonb and answer_index = 2 and explanation = 'There is no signature bonus, no domestic supply obligation, no state participation and no flare penalty. Four fields, and the ledger they act on, are the whole of it.' then 'old'
           when prompt = 'A term sheet carries a signature bonus, a domestic supply obligation and a state participation share. How are the three entered?' and options = '["The bonus goes into a capex bucket, the obligation into the variable opex rate, and the participation share into the contractor split.", "Each becomes a tier on the profit split, the one field taking more than one entry.", "They are not. A regime needing any of them cannot be expressed in this sandbox at all.", "They ride on the template''s description string into government cash flow."]'::jsonb and answer_index = 2 and explanation = 'There is no signature bonus, no domestic supply obligation, no state participation and no flare penalty. Four fields, and the ledger they act on, are the whole of it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 15;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m01 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m01 ord 15 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A term sheet carries a signature bonus, a domestic supply obligation and a state participation share. How are the three entered?', options = '["The bonus goes into a capex bucket, the obligation into the variable opex rate, and the participation share into the contractor split.", "Each becomes a tier on the profit split, the one field taking more than one entry.", "They are not. A regime needing any of them cannot be expressed in this sandbox at all.", "They ride on the template''s description string into government cash flow."]'::jsonb, explanation = 'There is no signature bonus, no domestic supply obligation, no state participation and no flare penalty. Four fields, and the ledger they act on, are the whole of it.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m01 ord 15 updated % rows', v_count; end if;
  end if;

  -- ec2b_m03 ord 4 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'Year 1 of the default project under the Gulf of Mexico terms carries capex of 500.0000 million USD and a contractor net cash flow of -310.0117. What royalty is charged that year?' and options = '["Nothing, since a royalty is charged on revenue after royalty and no profit oil arises in the year the capex lands.", "A reduced charge, the sandbox waiving royalty in a year that closes below zero.", "50.9979 million USD, which then enters the unrecovered cost pool and comes back to the contractor in a later year.", "50.9979 million USD, the full rate on the top line, and that is the whole of government take for the year."]'::jsonb and answer_index = 3 and explanation = 'A loss making year pays royalty at the same rate as the best year in the field. There is no profit oil and no tax in year 1, so government take is the royalty alone.' then 'old'
           when prompt = 'Year 1 of the default project under the Gulf of Mexico terms carries capex of 500.0000 million USD and a contractor net cash flow of -310.0117. What royalty is charged that year?' and options = '["Nothing, since a royalty is charged on revenue after royalty and no profit oil arises in the year the capex lands.", "A reduced charge, the sandbox waiving royalty in a year that closes below zero.", "50.9979 million USD, which then enters the unrecovered cost pool and comes back to the contractor in a later year.", "50.9979 million USD, the full rate on the top line, and that is the whole of government cash flow for the year."]'::jsonb and answer_index = 3 and explanation = 'A loss making year pays royalty at the same rate as the best year in the field. There is no profit oil and no tax in year 1, so government cash flow is the royalty alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-revenue-and-royalty' and ord = 4;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m03 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m03 ord 4 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Year 1 of the default project under the Gulf of Mexico terms carries capex of 500.0000 million USD and a contractor net cash flow of -310.0117. What royalty is charged that year?', options = '["Nothing, since a royalty is charged on revenue after royalty and no profit oil arises in the year the capex lands.", "A reduced charge, the sandbox waiving royalty in a year that closes below zero.", "50.9979 million USD, which then enters the unrecovered cost pool and comes back to the contractor in a later year.", "50.9979 million USD, the full rate on the top line, and that is the whole of government cash flow for the year."]'::jsonb, explanation = 'A loss making year pays royalty at the same rate as the best year in the field. There is no profit oil and no tax in year 1, so government cash flow is the royalty alone.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-revenue-and-royalty' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m03 ord 4 updated % rows', v_count; end if;
  end if;

  -- ec2b_m04 ord 1
  select case
           when prompt = 'Add contractor net cash flow and government take on one row of a ledger this engine returns. What does the pair equal?' and options = '["Gross revenue less opex less capex, in every year, under every one of the six templates.", "Gross revenue less opex less capex, less the movement in the unrecovered cost pool, because cost that was not recovered in the year reached neither party.", "Gross revenue less royalty, because the royalty is settled off the top before the cascade begins and belongs to neither of the two takes.", "Gross revenue, since every dollar the field sold is assigned in the year to the contractor or to the state and nothing else is done with it."]'::jsonb and answer_index = 0 and explanation = 'Year 1 of the default project reads -259.0138 for both sums under the Gulf of Mexico terms at a 100 percent limit and under Angola at 50 percent, though the closing pools are 310.0117 and 395.0083.' then 'old'
           when prompt = 'Add contractor net cash flow and government cash flow on one row of a ledger this engine returns. What does the pair equal?' and options = '["Gross revenue less opex less capex, in every year, under every one of the six templates.", "Gross revenue less opex less capex, less the movement in the unrecovered cost pool, because cost that was not recovered in the year reached neither party.", "Gross revenue less royalty, because the royalty is settled off the top before the cascade begins and belongs to neither of the two takes.", "Gross revenue, since every dollar the field sold is assigned in the year to the contractor or to the state and nothing else is done with it."]'::jsonb and answer_index = 0 and explanation = 'Year 1 of the default project reads -259.0138 for both sums under the Gulf of Mexico terms at a 100 percent limit and under Angola at 50 percent, though the closing pools are 310.0117 and 395.0083.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 1;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m04 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m04 ord 1 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Add contractor net cash flow and government cash flow on one row of a ledger this engine returns. What does the pair equal?', options = '["Gross revenue less opex less capex, in every year, under every one of the six templates.", "Gross revenue less opex less capex, less the movement in the unrecovered cost pool, because cost that was not recovered in the year reached neither party.", "Gross revenue less royalty, because the royalty is settled off the top before the cascade begins and belongs to neither of the two takes.", "Gross revenue, since every dollar the field sold is assigned in the year to the contractor or to the state and nothing else is done with it."]'::jsonb, explanation = 'Year 1 of the default project reads -259.0138 for both sums under the Gulf of Mexico terms at a 100 percent limit and under Angola at 50 percent, though the closing pools are 310.0117 and 395.0083.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m04 ord 1 updated % rows', v_count; end if;
  end if;

  -- ec2b_m04 ord 13
  select case
           when prompt = 'Royalty never appears as a subtraction on the contractor''s line, though it is printed on the row. Why not?' and options = '["It is charged to the government take column instead.", "It is returned to the pool as a recoverable cost in the next year.", "It came off before cost recovery began, so year 1 cost oil of 220.9910 is already net of it.", "It is netted against the tax owed on the contractor''s profit share."]'::jsonb and answer_index = 2 and explanation = 'Subtract it a second time and year 1 reads 50.9979 too low, with a life total to match.' then 'old'
           when prompt = 'Royalty never appears as a subtraction on the contractor''s line, though it is printed on the row. Why not?' and options = '["It is charged to the government cash flow column instead.", "It is returned to the pool as a recoverable cost in the next year.", "It came off before cost recovery began, so year 1 cost oil of 220.9910 is already net of it.", "It is netted against the tax owed on the contractor''s profit share."]'::jsonb and answer_index = 2 and explanation = 'Subtract it a second time and year 1 reads 50.9979 too low, with a life total to match.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 13;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m04 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m04 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Royalty never appears as a subtraction on the contractor''s line, though it is printed on the row. Why not?', options = '["It is charged to the government cash flow column instead.", "It is returned to the pool as a recoverable cost in the next year.", "It came off before cost recovery began, so year 1 cost oil of 220.9910 is already net of it.", "It is netted against the tax owed on the contractor''s profit share."]'::jsonb, explanation = 'Subtract it a second time and year 1 reads 50.9979 too low, with a life total to match.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m04 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2b_m04 ord 14
  select case
           when prompt = 'Year 1 on the default project shows government take of 50.9979 against a contractor line of -310.0117. What is the state''s figure made of?' and options = '["Royalty plus the state''s share of profit oil, which is small in this year because the residual left after recovery is itself small.", "Royalty alone, collected on gross revenue in a year that destroyed 259.0138 of value.", "Royalty net of the state''s share of the year''s opex and capex.", "Royalty plus tax on the contractor''s share of a residual of 220.9910."]'::jsonb and answer_index = 1 and explanation = 'The contractor takes 100 percent of profit oil here and profit oil is 0.0000, so royalty is the whole column. The state carries none of the cost.' then 'old'
           when prompt = 'Year 1 on the default project shows government cash flow of 50.9979 against a contractor line of -310.0117. What is the state''s figure made of?' and options = '["Royalty plus the state''s share of profit oil, which is small in this year because the residual left after recovery is itself small.", "Royalty alone, collected on gross revenue in a year that destroyed 259.0138 of value.", "Royalty net of the state''s share of the year''s opex and capex.", "Royalty plus tax on the contractor''s share of a residual of 220.9910."]'::jsonb and answer_index = 1 and explanation = 'The contractor takes 100 percent of profit oil here and profit oil is 0.0000, so royalty is the whole column. The state carries none of the cost.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 14;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m04 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m04 ord 14 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Year 1 on the default project shows government cash flow of 50.9979 against a contractor line of -310.0117. What is the state''s figure made of?', options = '["Royalty plus the state''s share of profit oil, which is small in this year because the residual left after recovery is itself small.", "Royalty alone, collected on gross revenue in a year that destroyed 259.0138 of value.", "Royalty net of the state''s share of the year''s opex and capex.", "Royalty plus tax on the contractor''s share of a residual of 220.9910."]'::jsonb, explanation = 'The contractor takes 100 percent of profit oil here and profit oil is 0.0000, so royalty is the whole column. The state carries none of the cost.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m04 ord 14 updated % rows', v_count; end if;
  end if;

  -- ec2b_m05 ord 1
  select case
           when prompt = 'The Gulf of Mexico ledger on the Designer''s default project closes cumulativeNCF at 980.9313. What else in the same ledger must read 980.9313, and what does it mean if it does not?' and options = '["The life total of the contractor net cash flow column, and a disagreement means one of the two was built from a different column.", "The life total of government take, since the running sum is a division of one quantity and the two sides of it must close together.", "The net present value at the project''s 10 percent, because a running sum and a discounted sum differ only in the order they are taken.", "The life total of gross revenue less royalty, because everything else in the cascade is either recovered or carried forward."]'::jsonb and answer_index = 0 and explanation = 'The closing cumulative and the contractor total are the same 25 numbers added in the same order, so they are the cheapest check in the ledger.' then 'old'
           when prompt = 'The Gulf of Mexico ledger on the Designer''s default project closes cumulativeNCF at 980.9313. What else in the same ledger must read 980.9313, and what does it mean if it does not?' and options = '["The life total of the contractor net cash flow column, and a disagreement means one of the two was built from a different column.", "The life total of government cash flow, since the running sum is a division of one quantity and the two sides of it must close together.", "The net present value at the project''s 10 percent, because a running sum and a discounted sum differ only in the order they are taken.", "The life total of gross revenue less royalty, because everything else in the cascade is either recovered or carried forward."]'::jsonb and answer_index = 0 and explanation = 'The closing cumulative and the contractor total are the same 25 numbers added in the same order, so they are the cheapest check in the ledger.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 1;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m05 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m05 ord 1 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Gulf of Mexico ledger on the Designer''s default project closes cumulativeNCF at 980.9313. What else in the same ledger must read 980.9313, and what does it mean if it does not?', options = '["The life total of the contractor net cash flow column, and a disagreement means one of the two was built from a different column.", "The life total of government cash flow, since the running sum is a division of one quantity and the two sides of it must close together.", "The net present value at the project''s 10 percent, because a running sum and a discounted sum differ only in the order they are taken.", "The life total of gross revenue less royalty, because everything else in the cascade is either recovered or carried forward."]'::jsonb, explanation = 'The closing cumulative and the contractor total are the same 25 numbers added in the same order, so they are the cheapest check in the ledger.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m05 ord 1 updated % rows', v_count; end if;
  end if;

  -- ec2b_m05 ord 7
  select case
           when prompt = 'The published case at capex 20000 returns payback null and payout null. What is the correct way to read that pair?' and options = '["As a reading in its own right: the cumulative was never above zero and the R factor never above 1.0 in any of the 25 rows.", "As a gap in the table, since the engine leaves the field empty when a project is stopped before the horizon is reached.", "As a sign the run was terminated early, so the rows after the shut in were never computed and never taxed.", "As an error state, since a project that cannot pay back is outside the range the sandbox is able to report on."]'::jsonb and answer_index = 0 and explanation = 'Every one of the 25 rows was still computed and still counted: government take is royalty of 875.1492 on revenue of 7001.1938.' then 'old'
           when prompt = 'The published case at capex 20000 returns payback null and payout null. What is the correct way to read that pair?' and options = '["As a reading in its own right: the cumulative was never above zero and the R factor never above 1.0 in any of the 25 rows.", "As a gap in the table, since the engine leaves the field empty when a project is stopped before the horizon is reached.", "As a sign the run was terminated early, so the rows after the shut in were never computed and never taxed.", "As an error state, since a project that cannot pay back is outside the range the sandbox is able to report on."]'::jsonb and answer_index = 0 and explanation = 'Every one of the 25 rows was still computed and still counted: government cash flow is royalty of 875.1492 on revenue of 7001.1938.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 7;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m05 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m05 ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case at capex 20000 returns payback null and payout null. What is the correct way to read that pair?', options = '["As a reading in its own right: the cumulative was never above zero and the R factor never above 1.0 in any of the 25 rows.", "As a gap in the table, since the engine leaves the field empty when a project is stopped before the horizon is reached.", "As a sign the run was terminated early, so the rows after the shut in were never computed and never taxed.", "As an error state, since a project that cannot pay back is outside the range the sandbox is able to report on."]'::jsonb, explanation = 'Every one of the 25 rows was still computed and still counted: government cash flow is royalty of 875.1492 on revenue of 7001.1938.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m05 ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2b_m05 ord 13
  select case
           when prompt = 'Swept from 40 to 120 USD per bbl on ODIDI, the government share under the Gulf of Mexico terms falls from 78.5512 percent to 40.8517 while under PIA it stays within 75.1077 to 79.4678. What does a single ledger tell you about that?' and options = '["It tells you the ranking at the run''s own price, and that ranking holds across the sweep.", "Nothing at all, because one run is one price deck and the shape of a regime across prices is not in it.", "It tells you the direction of the movement, since a regime with a higher take at the base price always gives up more of it as prices rise.", "It tells you which template is progressive, from the government share at the base price."]'::jsonb and answer_index = 1 and explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the single ledger shows neither shape.' then 'old'
           when prompt = 'Swept from 40 to 120 USD per bbl on ODIDI, government take under the Gulf of Mexico terms falls from 78.5512 percent to 40.8517 while under PIA it stays within 75.1077 to 79.4678. What does a single ledger tell you about that?' and options = '["It tells you the ranking at the run''s own price, and that ranking holds across the sweep.", "Nothing at all, because one run is one price deck and the shape of a regime across prices is not in it.", "It tells you the direction of the movement, since a regime with a higher take at the base price always gives up more of it as prices rise.", "It tells you which template is progressive, from government take at the base price."]'::jsonb and answer_index = 1 and explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the single ledger shows neither shape.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 13;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m05 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m05 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Swept from 40 to 120 USD per bbl on ODIDI, government take under the Gulf of Mexico terms falls from 78.5512 percent to 40.8517 while under PIA it stays within 75.1077 to 79.4678. What does a single ledger tell you about that?', options = '["It tells you the ranking at the run''s own price, and that ranking holds across the sweep.", "Nothing at all, because one run is one price deck and the shape of a regime across prices is not in it.", "It tells you the direction of the movement, since a regime with a higher take at the base price always gives up more of it as prices rise.", "It tells you which template is progressive, from government take at the base price."]'::jsonb, explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the single ledger shows neither shape.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m05 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2b_m06 ord 13
  select case
           when prompt = 'ODIDI hands the state between 232.9950 and 316.7898 depending on which of the six templates prices it. What can the Associate reading not say about that range?' and options = '["Which template collects the most, since the six collections are only comparable when the closing pools are equal.", "Which template leaves the contractor the least cash, which needs a discount convention the tier does not carry.", "Which of the splits is fair, which survives a price collapse, and which numbers on a comparison screen are measurements at all.", "How much of each collection is royalty, since the ledger prints government take as a single undivided column."]'::jsonb and answer_index = 2 and explanation = 'The contractor keeps between 109.1947 and 192.9896 across the same six templates, and the tier can state the range without judging it.' then 'old'
           when prompt = 'ODIDI hands the state between 232.9950 and 316.7898 depending on which of the six templates prices it. What can the Associate reading not say about that range?' and options = '["Which template collects the most, since the six collections are only comparable when the closing pools are equal.", "Which template leaves the contractor the least cash, which needs a discount convention the tier does not carry.", "Which of the splits is fair, which survives a price collapse, and which numbers on a comparison screen are measurements at all.", "How much of each collection is royalty, since the ledger prints government cash flow as a single undivided column."]'::jsonb and answer_index = 2 and explanation = 'The contractor keeps between 109.1947 and 192.9896 across the same six templates, and the tier can state the range without judging it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 13;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m06 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m06 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ODIDI hands the state between 232.9950 and 316.7898 depending on which of the six templates prices it. What can the Associate reading not say about that range?', options = '["Which template collects the most, since the six collections are only comparable when the closing pools are equal.", "Which template leaves the contractor the least cash, which needs a discount convention the tier does not carry.", "Which of the splits is fair, which survives a price collapse, and which numbers on a comparison screen are measurements at all.", "How much of each collection is royalty, since the ledger prints government cash flow as a single undivided column."]'::jsonb, explanation = 'The contractor keeps between 109.1947 and 192.9896 across the same six templates, and the tier can state the range without judging it.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m06 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2b_m06 ord 15
  select case
           when prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 1638.5664, where the run that sets it to 0 collects 2607.5549. What is the habit that catches this?' and options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government take rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb and answer_index = 3 and explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed moved the tax by that much.' then 'old'
           when prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 1638.5664, where the run that sets it to 0 collects 2607.5549. What is the habit that catches this?' and options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government cash flow rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb and answer_index = 3 and explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed moved the tax by that much.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_m06 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_m06 ord 15 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 1638.5664, where the run that sets it to 0 collects 2607.5549. What is the habit that catches this?', options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government cash flow rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb, explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed moved the tax by that much.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_m06 ord 15 updated % rows', v_count; end if;
  end if;

  -- ec2b_exam ord 5
  select case
           when prompt = 'The published case at capex 20000 produces for 25 years, loses 15724.0151 and hands the treasury 875.1492. Which two omissions let that happen?' and options = '["No depreciation and no loss carryforward, so the losses of the early years never shelter the later ones from tax.", "No ring fence and no valuation date, so the losses of one field are never set against the profits of another.", "No economic limit and no abandonment cost, so nothing shuts the field in and nothing is paid at the end.", "No price escalation and no inflation, so a deck that ends in year 10 prices the last fifteen years too low."]'::jsonb and answer_index = 2 and explanation = 'Total tax is 0.0000 and total profit oil is 0.0000, so the government take is pure royalty on revenue of 7001.1938.' then 'old'
           when prompt = 'The published case at capex 20000 produces for 25 years, loses 15724.0151 and hands the treasury 875.1492. Which two omissions let that happen?' and options = '["No depreciation and no loss carryforward, so the losses of the early years never shelter the later ones from tax.", "No ring fence and no valuation date, so the losses of one field are never set against the profits of another.", "No economic limit and no abandonment cost, so nothing shuts the field in and nothing is paid at the end.", "No price escalation and no inflation, so a deck that ends in year 10 prices the last fifteen years too low."]'::jsonb and answer_index = 2 and explanation = 'Total tax is 0.0000 and total profit oil is 0.0000, so the government cash flow is pure royalty on revenue of 7001.1938.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_exam ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case at capex 20000 produces for 25 years, loses 15724.0151 and hands the treasury 875.1492. Which two omissions let that happen?', options = '["No depreciation and no loss carryforward, so the losses of the early years never shelter the later ones from tax.", "No ring fence and no valuation date, so the losses of one field are never set against the profits of another.", "No economic limit and no abandonment cost, so nothing shuts the field in and nothing is paid at the end.", "No price escalation and no inflation, so a deck that ends in year 10 prices the last fifteen years too low."]'::jsonb, explanation = 'Total tax is 0.0000 and total profit oil is 0.0000, so the government cash flow is pure royalty on revenue of 7001.1938.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_exam ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2b_exam ord 6
  select case
           when prompt = 'The engine returns a total government take of 1339.2784 under the PIA template on the default project. What is that number?' and options = '["A shape, useful for asking which instrument moved which result, and unfit for filing anything.", "An assessment of the Nigerian take on a deepwater project, computed under the Petroleum Industry Act.", "A screening estimate that the Petroleum Economics Studio engine would reproduce to within a rounding.", "A statutory minimum, since the templates are calibrated to the floor each jurisdiction would accept."]'::jsonb and answer_index = 0 and explanation = 'The engine''s own header says the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and that this model compares the shape of regimes.' then 'old'
           when prompt = 'The engine returns a total government cash flow of 1339.2784 under the PIA template on the default project. What is that number?' and options = '["A shape, useful for asking which instrument moved which result, and unfit for filing anything.", "An assessment of the Nigerian take on a deepwater project, computed under the Petroleum Industry Act.", "A screening estimate that the Petroleum Economics Studio engine would reproduce to within a rounding.", "A statutory minimum, since the templates are calibrated to the floor each jurisdiction would accept."]'::jsonb and answer_index = 0 and explanation = 'The engine''s own header says the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and that this model compares the shape of regimes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_exam ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The engine returns a total government cash flow of 1339.2784 under the PIA template on the default project. What is that number?', options = '["A shape, useful for asking which instrument moved which result, and unfit for filing anything.", "An assessment of the Nigerian take on a deepwater project, computed under the Petroleum Industry Act.", "A screening estimate that the Petroleum Economics Studio engine would reproduce to within a rounding.", "A statutory minimum, since the templates are calibrated to the floor each jurisdiction would accept."]'::jsonb, explanation = 'The engine''s own header says the single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and that this model compares the shape of regimes.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_exam ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2b_exam ord 23
  select case
           when prompt = 'Year 4 of the Gulf of Mexico ledger on the default project reports government take of 65.4424. What is in it?' and options = '["Royalty of 37.0317 and the state''s half of a residual of 135.2891, with the tax settled inside that share.", "Tax of 28.4107 and the state''s share of cost oil, since recovery is charged against the state''s own entitlement.", "Royalty of 37.0317 alone, with the tax of 28.4107 reported separately and not counted into the take.", "Royalty of 37.0317 and tax of 28.4107, with no profit share because the contractor takes all of the residual."]'::jsonb and answer_index = 3 and explanation = 'The state''s line is royalty plus its share of profit oil plus tax, and here the middle term is nothing.' then 'old'
           when prompt = 'Year 4 of the Gulf of Mexico ledger on the default project reports government cash flow of 65.4424. What is in it?' and options = '["Royalty of 37.0317 and the state''s half of a residual of 135.2891, with the tax settled inside that share.", "Tax of 28.4107 and the state''s share of cost oil, since recovery is charged against the state''s own entitlement.", "Royalty of 37.0317 alone, with the tax of 28.4107 reported separately and not counted into the take.", "Royalty of 37.0317 and tax of 28.4107, with no profit share because the contractor takes all of the residual."]'::jsonb and answer_index = 3 and explanation = 'The state''s line is royalty plus its share of profit oil plus tax, and here the middle term is nothing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_exam ord 23'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_exam ord 23 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Year 4 of the Gulf of Mexico ledger on the default project reports government cash flow of 65.4424. What is in it?', options = '["Royalty of 37.0317 and the state''s half of a residual of 135.2891, with the tax settled inside that share.", "Tax of 28.4107 and the state''s share of cost oil, since recovery is charged against the state''s own entitlement.", "Royalty of 37.0317 alone, with the tax of 28.4107 reported separately and not counted into the take.", "Royalty of 37.0317 and tax of 28.4107, with no profit share because the contractor takes all of the residual."]'::jsonb, explanation = 'The state''s line is royalty plus its share of profit oil plus tax, and here the middle term is nothing.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_exam ord 23 updated % rows', v_count; end if;
  end if;

  -- ec2b_exam ord 30
  select case
           when prompt = 'Run six templates on the default project and total revenue reads 2686.9277 on every line. What does that constant make possible?' and options = '["It makes the whole of the spread in the answer attributable to the regime and to nothing else.", "It makes the six ledgers comparable with the test project''s 7001.1938.", "It makes the cost recovery totals comparable, since a constant revenue means a constant recoverable pool.", "It makes the government take rankable by royalty rate, since the base of the royalty is the same in each."]'::jsonb and answer_index = 0 and explanation = 'A fiscal regime prices barrels, it does not produce them. Contractor cash ranges from 406.2057 to 986.7327 against that identical sales figure.' then 'old'
           when prompt = 'Run six templates on the default project and total revenue reads 2686.9277 on every line. What does that constant make possible?' and options = '["It makes the whole of the spread in the answer attributable to the regime and to nothing else.", "It makes the six ledgers comparable with the test project''s 7001.1938.", "It makes the cost recovery totals comparable, since a constant revenue means a constant recoverable pool.", "It makes the government cash flow rankable by royalty rate, since the base of the royalty is the same in each."]'::jsonb and answer_index = 0 and explanation = 'A fiscal regime prices barrels, it does not produce them. Contractor cash ranges from 406.2057 to 986.7327 against that identical sales figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_exam ord 30'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_exam ord 30 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Run six templates on the default project and total revenue reads 2686.9277 on every line. What does that constant make possible?', options = '["It makes the whole of the spread in the answer attributable to the regime and to nothing else.", "It makes the six ledgers comparable with the test project''s 7001.1938.", "It makes the cost recovery totals comparable, since a constant revenue means a constant recoverable pool.", "It makes the government cash flow rankable by royalty rate, since the base of the royalty is the same in each."]'::jsonb, explanation = 'A fiscal regime prices barrels, it does not produce them. Contractor cash ranges from 406.2057 to 986.7327 against that identical sales figure.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_exam ord 30 updated % rows', v_count; end if;
  end if;

  -- ec2b_exam ord 33
  select case
           when prompt = 'Under PIA the government share of ODIDI stays inside a band from 75.1077 to 79.4678 across nine price points, where another template gives up tens of percentage points across the same range. What does one run at one deck tell you about that difference?' and options = '["The ranking at the base price, which the sweep then preserves at every other price it visits.", "The direction of the movement, since a regime with the higher take at one price gives up more of it as prices climb.", "The size of the movement, which is proportional to the royalty rate the template carries.", "Nothing, because one run is one deck and the shape of a regime across prices is not in a single ledger."]'::jsonb and answer_index = 3 and explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the same holds for a cost overrun.' then 'old'
           when prompt = 'Under PIA the government take on ODIDI stays inside a band from 75.1077 to 79.4678 across nine price points, where another template gives up tens of percentage points across the same range. What does one run at one deck tell you about that difference?' and options = '["The ranking at the base price, which the sweep then preserves at every other price it visits.", "The direction of the movement, since a regime with the higher take at one price gives up more of it as prices climb.", "The size of the movement, which is proportional to the royalty rate the template carries.", "Nothing, because one run is one deck and the shape of a regime across prices is not in a single ledger."]'::jsonb and answer_index = 3 and explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the same holds for a cost overrun.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2b_exam ord 33'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2b_exam ord 33 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Under PIA the government take on ODIDI stays inside a band from 75.1077 to 79.4678 across nine price points, where another template gives up tens of percentage points across the same range. What does one run at one deck tell you about that difference?', options = '["The ranking at the base price, which the sweep then preserves at every other price it visits.", "The direction of the movement, since a regime with the higher take at one price gives up more of it as prices climb.", "The size of the movement, which is proportional to the royalty rate the template carries.", "Nothing, because one run is one deck and the shape of a regime across prices is not in a single ledger."]'::jsonb, explanation = 'Two regimes that look similar on one run behave nothing alike on the next, and the same holds for a cost overrun.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2b_exam ord 33 updated % rows', v_count; end if;
  end if;

  -- ec2i_m02 ord 9
  select case
           when prompt = '`never_recovers_huge_capex` takes the Suite test project to 20000 of capex. Profit oil is 0.0000 in every year and total tax is 0.0000, yet government take is 875.1492. Where did it come from?' and options = '["It is the minimum tax, which is charged on gross revenue whenever the profit share falls to zero and no ordinary tax base exists.", "All of it is royalty, which is charged on gross revenue and has nothing to do with whether any cost was recovered.", "It is the government''s share of the 6126.0445 of cost oil recovered.", "It is a clawback of the earlier years'' cost recovery, triggered when the closing pool of 15724.0151 exceeds the capex actually spent."]'::jsonb and answer_index = 1 and explanation = 'Total royalty on that case is 875.1492 and total tax is 0.0000, so the whole of government take is the royalty. That is a royalty seen from the cost recovery side.' then 'old'
           when prompt = '`never_recovers_huge_capex` takes the Suite test project to 20000 of capex. Profit oil is 0.0000 in every year and total tax is 0.0000, yet government cash flow is 875.1492. Where did it come from?' and options = '["It is the minimum tax, which is charged on gross revenue whenever the profit share falls to zero and no ordinary tax base exists.", "All of it is royalty, which is charged on gross revenue and has nothing to do with whether any cost was recovered.", "It is the government''s share of the 6126.0445 of cost oil recovered.", "It is a clawback of the earlier years'' cost recovery, triggered when the closing pool of 15724.0151 exceeds the capex actually spent."]'::jsonb and answer_index = 1 and explanation = 'Total royalty on that case is 875.1492 and total tax is 0.0000, so the whole of government cash flow is the royalty. That is a royalty seen from the cost recovery side.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 9;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m02 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m02 ord 9 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`never_recovers_huge_capex` takes the Suite test project to 20000 of capex. Profit oil is 0.0000 in every year and total tax is 0.0000, yet government cash flow is 875.1492. Where did it come from?', options = '["It is the minimum tax, which is charged on gross revenue whenever the profit share falls to zero and no ordinary tax base exists.", "All of it is royalty, which is charged on gross revenue and has nothing to do with whether any cost was recovered.", "It is the government''s share of the 6126.0445 of cost oil recovered.", "It is a clawback of the earlier years'' cost recovery, triggered when the closing pool of 15724.0151 exceeds the capex actually spent."]'::jsonb, explanation = 'Total royalty on that case is 875.1492 and total tax is 0.0000, so the whole of government cash flow is the royalty. That is a royalty seen from the cost recovery side.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m02 ord 9 updated % rows', v_count; end if;
  end if;

  -- ec2i_m04 ord 6
  select case
           when prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 590.7165 million USD at an uplift of 0 percent. What is that figure?' and options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 564.6884 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government take at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb and answer_index = 0 and explanation = 'The published Brazil stack on this project is 564.6884 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.' then 'old'
           when prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 590.7165 million USD at an uplift of 0 percent. What is that figure?' and options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 564.6884 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government cash flow at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb and answer_index = 0 and explanation = 'The published Brazil stack on this project is 564.6884 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m04 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m04 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 590.7165 million USD at an uplift of 0 percent. What is that figure?', options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 564.6884 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government cash flow at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb, explanation = 'The published Brazil stack on this project is 564.6884 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m04 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2i_m04 ord 12
  select case
           when prompt = 'Ghana - Deepwater charges a corporate income tax of 35 percent on the default project and collects 230.9340 million USD, while Generic Royalty/Tax charges 30 percent and collects 422.8854. What explains that order?' and options = '["Ghana''s royalty of 134.3464 million USD is deducted from the base before the rate is applied to it, and Generic''s larger royalty is not deducted at all.", "Ghana recovers far more of its cost, so much less of the revenue after royalty survives as profit oil for the higher rate to reach.", "Ghana''s rate is charged on the contractor''s net cash flow rather than on the profit share, and that is a smaller quantity in every year.", "The base. Generic hands the contractor the whole of profit oil, while Ghana splits it on the R factor and the government''s own share never passes through the tax line."]'::jsonb and answer_index = 3 and explanation = 'Government take runs the other way for exactly that reason, 1316.6067 million USD for Ghana against 758.7514 for Generic.' then 'old'
           when prompt = 'Ghana - Deepwater charges a corporate income tax of 35 percent on the default project and collects 230.9340 million USD, while Generic Royalty/Tax charges 30 percent and collects 422.8854. What explains that order?' and options = '["Ghana''s royalty of 134.3464 million USD is deducted from the base before the rate is applied to it, and Generic''s larger royalty is not deducted at all.", "Ghana recovers far more of its cost, so much less of the revenue after royalty survives as profit oil for the higher rate to reach.", "Ghana''s rate is charged on the contractor''s net cash flow rather than on the profit share, and that is a smaller quantity in every year.", "The base. Generic hands the contractor the whole of profit oil, while Ghana splits it on the R factor and the government''s own share never passes through the tax line."]'::jsonb and answer_index = 3 and explanation = 'Government cash flow runs the other way for exactly that reason, 1316.6067 million USD for Ghana against 758.7514 for Generic.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 12;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m04 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m04 ord 12 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Ghana - Deepwater charges a corporate income tax of 35 percent on the default project and collects 230.9340 million USD, while Generic Royalty/Tax charges 30 percent and collects 422.8854. What explains that order?', options = '["Ghana''s royalty of 134.3464 million USD is deducted from the base before the rate is applied to it, and Generic''s larger royalty is not deducted at all.", "Ghana recovers far more of its cost, so much less of the revenue after royalty survives as profit oil for the higher rate to reach.", "Ghana''s rate is charged on the contractor''s net cash flow rather than on the profit share, and that is a smaller quantity in every year.", "The base. Generic hands the contractor the whole of profit oil, while Ghana splits it on the R factor and the government''s own share never passes through the tax line."]'::jsonb, explanation = 'Government cash flow runs the other way for exactly that reason, 1316.6067 million USD for Ghana against 758.7514 for Generic.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m04 ord 12 updated % rows', v_count; end if;
  end if;

  -- ec2i_m04 ord 13
  select case
           when prompt = 'Nigeria - PIA (2021) collects the smallest total tax of the four templates carrying a corporate income tax alone, 174.0882 million USD, inside the largest government take of the four, 1339.2784. What does that pair say?' and options = '["The template''s royalty must be the largest of the four, because a small tax inside a large take can only be made up by a charge on gross revenue.", "The tax line measures one instrument and the take measures the regime, and on one ledger the two can point in opposite directions.", "The take is the wrong column to read, since it includes the contractor''s own profit share.", "The tax total is understated, because the government''s share of profit oil is a tax collected in kind and belongs in that column."]'::jsonb and answer_index = 1 and explanation = 'USA - Gulf of Mexico collects 260.7539 million USD of tax inside a take of 764.5528, so ranking these regimes by the tax column reverses the ranking by take.' then 'old'
           when prompt = 'Nigeria - PIA (2021) collects the smallest total tax of the four templates carrying a corporate income tax alone, 174.0882 million USD, inside the largest government cash flow of the four, 1339.2784. What does that pair say?' and options = '["The template''s royalty must be the largest of the four, because a small tax inside a large take can only be made up by a charge on gross revenue.", "The tax line measures one instrument and the take measures the regime, and on one ledger the two can point in opposite directions.", "The take is the wrong column to read, since it includes the contractor''s own profit share.", "The tax total is understated, because the government''s share of profit oil is a tax collected in kind and belongs in that column."]'::jsonb and answer_index = 1 and explanation = 'USA - Gulf of Mexico collects 260.7539 million USD of tax inside a take of 764.5528, so ranking these regimes by the tax column reverses the ranking by take.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 13;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m04 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m04 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Nigeria - PIA (2021) collects the smallest total tax of the four templates carrying a corporate income tax alone, 174.0882 million USD, inside the largest government cash flow of the four, 1339.2784. What does that pair say?', options = '["The template''s royalty must be the largest of the four, because a small tax inside a large take can only be made up by a charge on gross revenue.", "The tax line measures one instrument and the take measures the regime, and on one ledger the two can point in opposite directions.", "The take is the wrong column to read, since it includes the contractor''s own profit share.", "The tax total is understated, because the government''s share of profit oil is a tax collected in kind and belongs in that column."]'::jsonb, explanation = 'USA - Gulf of Mexico collects 260.7539 million USD of tax inside a take of 764.5528, so ranking these regimes by the tax column reverses the ranking by take.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m04 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2i_m05 ord 2
  select case
           when prompt = 'The swept present value of USA - Gulf of Mexico on the default project reads 980.9313 million USD at a rate of 0 percent. What check does that figure provide?' and options = '["It is contractor net cash flow and government take added together, since at a rate of zero the two are no longer separated by any timing.", "It shows a rate of zero is handled as a special case in the code, which is why the sweep can begin below the project''s own rate at all.", "It is the mid year figure at 10 percent, because the parity factor of 1.048809 leaves the two conventions agreeing at the foot of the sweep.", "It has to equal the undiscounted total contractor net cash flow of that ledger, and it does."]'::jsonb and answer_index = 3 and explanation = 'A discount rate of zero is not a special case; it simply makes every divisor one. A top row that does not match the ledger total is reading different flows, because at a rate of zero every discounting convention returns the same sum.' then 'old'
           when prompt = 'The swept present value of USA - Gulf of Mexico on the default project reads 980.9313 million USD at a rate of 0 percent. What check does that figure provide?' and options = '["It is contractor net cash flow and government cash flow added together, since at a rate of zero the two are no longer separated by any timing.", "It shows a rate of zero is handled as a special case in the code, which is why the sweep can begin below the project''s own rate at all.", "It is the mid year figure at 10 percent, because the parity factor of 1.048809 leaves the two conventions agreeing at the foot of the sweep.", "It has to equal the undiscounted total contractor net cash flow of that ledger, and it does."]'::jsonb and answer_index = 3 and explanation = 'A discount rate of zero is not a special case; it simply makes every divisor one. A top row that does not match the ledger total is reading different flows, because at a rate of zero every discounting convention returns the same sum.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 2;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m05 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m05 ord 2 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The swept present value of USA - Gulf of Mexico on the default project reads 980.9313 million USD at a rate of 0 percent. What check does that figure provide?', options = '["It is contractor net cash flow and government cash flow added together, since at a rate of zero the two are no longer separated by any timing.", "It shows a rate of zero is handled as a special case in the code, which is why the sweep can begin below the project''s own rate at all.", "It is the mid year figure at 10 percent, because the parity factor of 1.048809 leaves the two conventions agreeing at the foot of the sweep.", "It has to equal the undiscounted total contractor net cash flow of that ledger, and it does."]'::jsonb, explanation = 'A discount rate of zero is not a special case; it simply makes every divisor one. A top row that does not match the ledger total is reading different flows, because at a rate of zero every discounting convention returns the same sum.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m05 ord 2 updated % rows', v_count; end if;
  end if;

  -- ec2i_m05 ord 6 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'What does the discounting in this engine decline to give a reader?' and options = '["A figure at a rate of 0 percent, because the code guards against a divisor of one and hands back the undiscounted total in its place.", "A figure above 30 percent, the top of the swept range and the highest rate the function accepts.", "A figure for a regime whose net cash flow is negative in its early years, which it reports as 0.0000 rather than as a present value.", "A discounted government take or a discounted tax, since it discounts contractor net cash flow and nothing else."]'::jsonb and answer_index = 3 and explanation = 'There is no valuation year, no partial period and no inflation term, and the horizon is 25 rows for every regime and every project.' then 'old'
           when prompt = 'What does the discounting in this engine decline to give a reader?' and options = '["A figure at a rate of 0 percent, because the code guards against a divisor of one and hands back the undiscounted total in its place.", "A figure above 30 percent, the top of the swept range and the highest rate the function accepts.", "A figure for a regime whose net cash flow is negative in its early years, which it reports as 0.0000 rather than as a present value.", "A discounted government cash flow or a discounted tax, since it discounts contractor net cash flow and nothing else."]'::jsonb and answer_index = 3 and explanation = 'There is no valuation year, no partial period and no inflation term, and the horizon is 25 rows for every regime and every project.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m05 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m05 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the discounting in this engine decline to give a reader?', options = '["A figure at a rate of 0 percent, because the code guards against a divisor of one and hands back the undiscounted total in its place.", "A figure above 30 percent, the top of the swept range and the highest rate the function accepts.", "A figure for a regime whose net cash flow is negative in its early years, which it reports as 0.0000 rather than as a present value.", "A discounted government cash flow or a discounted tax, since it discounts contractor net cash flow and nothing else."]'::jsonb, explanation = 'There is no valuation year, no partial period and no inflation term, and the horizon is 25 rows for every regime and every project.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m05 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2i_m06 ord 4
  select case
           when prompt = 'Ghana - Deepwater recovers 788.5887 million USD on the teaching field and closes with 21.6250 still in the pool. Which of those two figures is read first?' and options = '["The recovery total, since it is the number the ledger reports and the pool is derived from it by subtraction.", "Neither on its own. The two have to be added, because the sum of them is the cost the contractor actually incurred over the life.", "The closing pool, because a recovery total says nothing until you know how much was never paid back.", "The recovery total, because the closing pool is settled against government take at the horizon."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC recovers 618.0991 and closes at 192.1146 on the same field. A large closing pool is money the contractor spent that the ledger never paid back.' then 'old'
           when prompt = 'Ghana - Deepwater recovers 788.5887 million USD on the teaching field and closes with 21.6250 still in the pool. Which of those two figures is read first?' and options = '["The recovery total, since it is the number the ledger reports and the pool is derived from it by subtraction.", "Neither on its own. The two have to be added, because the sum of them is the cost the contractor actually incurred over the life.", "The closing pool, because a recovery total says nothing until you know how much was never paid back.", "The recovery total, because the closing pool is settled against government cash flow at the horizon."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC recovers 618.0991 and closes at 192.1146 on the same field. A large closing pool is money the contractor spent that the ledger never paid back.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m06 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m06 ord 4 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Ghana - Deepwater recovers 788.5887 million USD on the teaching field and closes with 21.6250 still in the pool. Which of those two figures is read first?', options = '["The recovery total, since it is the number the ledger reports and the pool is derived from it by subtraction.", "Neither on its own. The two have to be added, because the sum of them is the cost the contractor actually incurred over the life.", "The closing pool, because a recovery total says nothing until you know how much was never paid back.", "The recovery total, because the closing pool is settled against government cash flow at the horizon."]'::jsonb, explanation = 'Angola - Deepwater PSC recovers 618.0991 and closes at 192.1146 on the same field. A large closing pool is money the contractor spent that the ledger never paid back.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m06 ord 4 updated % rows', v_count; end if;
  end if;

  -- ec2i_m06 ord 7
  select case
           when prompt = 'The summary of a comparison is sorted by contractor net present value descending. What can be read off a regime''s position in it?' and options = '["That the last row is the heaviest regime for the contractor, since government take runs in the reverse order of contractor present value.", "That the rows are in order of rate of return as well, because the two measures rank the same cash flows on the same ledger.", "That the rows are in order of payback, since a regime that returns capital faster carries more of its cash in the early discounted years.", "That the first row is the best regime for the contractor, and nothing else."]'::jsonb and answer_index = 3 and explanation = 'On the teaching field the sort puts Brazil - Concession first and Angola - Deepwater PSC last, while government take runs the other way at 316.7898 million USD for Angola against 232.9950 for Brazil.' then 'old'
           when prompt = 'The summary of a comparison is sorted by contractor net present value descending. What can be read off a regime''s position in it?' and options = '["That the last row is the heaviest regime for the contractor, since government cash flow runs in the reverse order of contractor present value.", "That the rows are in order of rate of return as well, because the two measures rank the same cash flows on the same ledger.", "That the rows are in order of payback, since a regime that returns capital faster carries more of its cash in the early discounted years.", "That the first row is the best regime for the contractor, and nothing else."]'::jsonb and answer_index = 3 and explanation = 'On the teaching field the sort puts Brazil - Concession first and Angola - Deepwater PSC last, while government cash flow runs the other way at 316.7898 million USD for Angola against 232.9950 for Brazil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m06 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m06 ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The summary of a comparison is sorted by contractor net present value descending. What can be read off a regime''s position in it?', options = '["That the last row is the heaviest regime for the contractor, since government cash flow runs in the reverse order of contractor present value.", "That the rows are in order of rate of return as well, because the two measures rank the same cash flows on the same ledger.", "That the rows are in order of payback, since a regime that returns capital faster carries more of its cash in the early discounted years.", "That the first row is the best regime for the contractor, and nothing else."]'::jsonb, explanation = 'On the teaching field the sort puts Brazil - Concession first and Angola - Deepwater PSC last, while government cash flow runs the other way at 316.7898 million USD for Angola against 232.9950 for Brazil.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m06 ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2i_m06 ord 10 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The comparison summary carries an effective tax rate, and Brazil - Concession reads 27.5413 percent on the teaching field. What should a reader know about that column before quoting it?' and options = '["It is government take divided by gross revenue, so it is not comparable with a headline tax rate at all.", "A second value for the same quantity, computed on the same cash flows a different way, sits in the same result object and appears on the screen too.", "It is the rate the tax column implies, so it can be checked by dividing total tax by total profit oil on the same ledger.", "It is reported only for regimes whose profit oil is positive in every year, so a comparison of six can carry fewer than six values."]'::jsonb and answer_index = 1 and explanation = 'Two effective tax rates live in one result and both are on the screen. Working out which is which is where the next tier starts, and the six on that field run from 27.5413 to 37.4463 percent.' then 'old'
           when prompt = 'The comparison summary carries government share of net revenue, and Brazil - Concession reads 27.5413 percent on the teaching field. What should a reader know about that column before quoting it?' and options = '["It is government cash flow divided by gross revenue, so it is not comparable with a headline tax rate at all.", "Government take, the same government cash flow divided without the capex added back, sits in the same result object and appears on the screen too.", "It is the rate the tax column implies, so it can be checked by dividing total tax by total profit oil on the same ledger.", "It is reported only for regimes whose profit oil is positive in every year, so a comparison of six can carry fewer than six values."]'::jsonb and answer_index = 1 and explanation = 'Two ratios of one government cash flow live in one result and both are on the screen. Working out which is which is where the next tier starts, and the six on that field run from 27.5413 to 37.4463 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m06 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m06 ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The comparison summary carries government share of net revenue, and Brazil - Concession reads 27.5413 percent on the teaching field. What should a reader know about that column before quoting it?', options = '["It is government cash flow divided by gross revenue, so it is not comparable with a headline tax rate at all.", "Government take, the same government cash flow divided without the capex added back, sits in the same result object and appears on the screen too.", "It is the rate the tax column implies, so it can be checked by dividing total tax by total profit oil on the same ledger.", "It is reported only for regimes whose profit oil is positive in every year, so a comparison of six can carry fewer than six values."]'::jsonb, explanation = 'Two ratios of one government cash flow live in one result and both are on the screen. Working out which is which is where the next tier starts, and the six on that field run from 27.5413 to 37.4463 percent.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m06 ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2i_m06 ord 12
  select case
           when prompt = 'Across the swept prices on the teaching field the government share climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?' and options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb and answer_index = 3 and explanation = 'A share is a ratio and not an amount. The regime whose share climbs is the progressive one, which is why Ghana - Deepwater is named the most responsive to higher prices.' then 'old'
           when prompt = 'Across the swept prices on the teaching field government take climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?' and options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb and answer_index = 3 and explanation = 'A share is a ratio and not an amount. The regime whose share climbs is the progressive one, which is why Ghana - Deepwater is named the most responsive to higher prices.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m06 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m06 ord 12 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Across the swept prices on the teaching field government take climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?', options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb, explanation = 'A share is a ratio and not an amount. The regime whose share climbs is the progressive one, which is why Ghana - Deepwater is named the most responsive to higher prices.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m06 ord 12 updated % rows', v_count; end if;
  end if;

  -- ec2i_m06 ord 14
  select case
           when prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?' and options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common effective tax rate, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb and answer_index = 1 and explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate of 0.0000 percent standing for two opposite things.' then 'old'
           when prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?' and options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common government take, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb and answer_index = 1 and explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate of 0.0000 percent standing for two opposite things.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_m06 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_m06 ord 14 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?', options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common government take, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb, explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate of 0.0000 percent standing for two opposite things.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_m06 ord 14 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 5 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?' and options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1200.2886 million USD of government take on that project against 764.5528 for USA, through the profit split instead."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 545.1955 for Angola. A royalty is one instrument out of four, and the take is the reading.' then 'old'
           when prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?' and options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1200.2886 million USD of government cash flow on that project against 764.5528 for USA, through the profit split instead."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 545.1955 for Angola. A royalty is one instrument out of four, and the take is the reading.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?', options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1200.2886 million USD of government cash flow on that project against 764.5528 for USA, through the profit split instead."]'::jsonb, explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 545.1955 for Angola. A royalty is one instrument out of four, and the take is the reading.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 10
  select case
           when prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?' and options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government take on that case."]'::jsonb and answer_index = 2 and explanation = 'That case still pays back in year 3 and returns an internal rate of return of 54.6792 percent, because the contractor is also paid through its profit share.' then 'old'
           when prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?' and options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government cash flow on that case."]'::jsonb and answer_index = 2 and explanation = 'That case still pays back in year 3 and returns an internal rate of return of 54.6792 percent, because the contractor is also paid through its profit share.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?', options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government cash flow on that case."]'::jsonb, explanation = 'That case still pays back in year 3 and returns an internal rate of return of 54.6792 percent, because the contractor is also paid through its profit share.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 12
  select case
           when prompt = 'Capping cost recovery at 5 percent on the test project recovers 306.3022 million USD instead of 2770.6665 and the total tax rises from 1006.6134 to 1745.9227. Why does recovering less cost raise the tax?' and options = '["Cost that cannot be recovered stays inside profit oil, which rises from 3355.3781 to 5819.7423 million USD, and profit oil is what the tax base is cut from.", "The tighter limit lengthens the life of the pool, and the engine charges a carrying cost on an unrecovered balance through the tax line.", "The unrecovered cost is added back to the base as a disallowed deduction, in the way a tax authority treats a cost it will not accept.", "The tax rate rises with the limit, because a regime that recovers less is compensating the government for a longer wait."]'::jsonb and answer_index = 0 and explanation = 'If cost recovery were a deduction, less recovery would mean a smaller base. It means a larger one, and government take rises from 1881.7626 to 2621.0719 million USD.' then 'old'
           when prompt = 'Capping cost recovery at 5 percent on the test project recovers 306.3022 million USD instead of 2770.6665 and the total tax rises from 1006.6134 to 1745.9227. Why does recovering less cost raise the tax?' and options = '["Cost that cannot be recovered stays inside profit oil, which rises from 3355.3781 to 5819.7423 million USD, and profit oil is what the tax base is cut from.", "The tighter limit lengthens the life of the pool, and the engine charges a carrying cost on an unrecovered balance through the tax line.", "The unrecovered cost is added back to the base as a disallowed deduction, in the way a tax authority treats a cost it will not accept.", "The tax rate rises with the limit, because a regime that recovers less is compensating the government for a longer wait."]'::jsonb and answer_index = 0 and explanation = 'If cost recovery were a deduction, less recovery would mean a smaller base. It means a larger one, and government cash flow rises from 1881.7626 to 2621.0719 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 12 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Capping cost recovery at 5 percent on the test project recovers 306.3022 million USD instead of 2770.6665 and the total tax rises from 1006.6134 to 1745.9227. Why does recovering less cost raise the tax?', options = '["Cost that cannot be recovered stays inside profit oil, which rises from 3355.3781 to 5819.7423 million USD, and profit oil is what the tax base is cut from.", "The tighter limit lengthens the life of the pool, and the engine charges a carrying cost on an unrecovered balance through the tax line.", "The unrecovered cost is added back to the base as a disallowed deduction, in the way a tax authority treats a cost it will not accept.", "The tax rate rises with the limit, because a regime that recovers less is compensating the government for a longer wait."]'::jsonb, explanation = 'If cost recovery were a deduction, less recovery would mean a smaller base. It means a larger one, and government cash flow rises from 1881.7626 to 2621.0719 million USD.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 12 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 22
  select case
           when prompt = 'A sweep of the resource rent tax uplift reports a government take of 331.2721 million USD at the default 20 percent. Why is that not the regime''s government take on that project?' and options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb and answer_index = 2 and explanation = 'The published take for that regime on the default project is 833.3812 million USD. Sections 10 and 11 carry the stack; the sweep carries an isolation.' then 'old'
           when prompt = 'A sweep of the resource rent tax uplift reports a government cash flow of 331.2721 million USD at the default 20 percent. Why is that not the regime''s government cash flow on that project?' and options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb and answer_index = 2 and explanation = 'The published take for that regime on the default project is 833.3812 million USD. Sections 10 and 11 carry the stack; the sweep carries an isolation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 22 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A sweep of the resource rent tax uplift reports a government cash flow of 331.2721 million USD at the default 20 percent. Why is that not the regime''s government cash flow on that project?', options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb, explanation = 'The published take for that regime on the default project is 833.3812 million USD. Sections 10 and 11 carry the stack; the sweep carries an isolation.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 22 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 24
  select case
           when prompt = 'On the test project USA - Gulf of Mexico collects 616.4851 million USD of tax inside a government take of 1929.2089, and Nigeria - PIA (2021) collects 389.4896 inside 3372.6496. Which regime is the heavier?' and options = '["USA, on the tax, since tax is the only column in which a government''s claim on a contractor is actually collected.", "Neither, because the two columns disagree and a comparison can only be made on regimes whose orders agree.", "Nigeria, on the take. The tax column measures one instrument and the take measures the regime.", "USA, because a higher tax against a lower take means more of its claim is being taken through instruments the take does not include."]'::jsonb and answer_index = 2 and explanation = 'The two columns point in opposite directions on the same ledger, because the government''s share of profit oil never passes through the tax line.' then 'old'
           when prompt = 'On the test project USA - Gulf of Mexico collects 616.4851 million USD of tax inside a government cash flow of 1929.2089, and Nigeria - PIA (2021) collects 389.4896 inside 3372.6496. Which regime is the heavier?' and options = '["USA, on the tax, since tax is the only column in which a government''s claim on a contractor is actually collected.", "Neither, because the two columns disagree and a comparison can only be made on regimes whose orders agree.", "Nigeria, on the take. The tax column measures one instrument and the take measures the regime.", "USA, because a higher tax against a lower take means more of its claim is being taken through instruments the take does not include."]'::jsonb and answer_index = 2 and explanation = 'The two columns point in opposite directions on the same ledger, because the government''s share of profit oil never passes through the tax line.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 24'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 24 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the test project USA - Gulf of Mexico collects 616.4851 million USD of tax inside a government cash flow of 1929.2089, and Nigeria - PIA (2021) collects 389.4896 inside 3372.6496. Which regime is the heavier?', options = '["USA, on the tax, since tax is the only column in which a government''s claim on a contractor is actually collected.", "Neither, because the two columns disagree and a comparison can only be made on regimes whose orders agree.", "Nigeria, on the take. The tax column measures one instrument and the take measures the regime.", "USA, because a higher tax against a lower take means more of its claim is being taken through instruments the take does not include."]'::jsonb, explanation = 'The two columns point in opposite directions on the same ledger, because the government''s share of profit oil never passes through the tax line.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 24 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 26
  select case
           when prompt = 'A swept table of present values reports 980.9313 million USD at a rate of 0 percent. What must that value equal?' and options = '["The undiscounted total contractor net cash flow of the same ledger, which is the cheapest check there is on a discounted number.", "The present value at the project''s own rate, since a rate of zero is read as an instruction to use the project default.", "The total government take, because at a rate of zero the two sides of the ledger are no longer separated by timing.", "Nothing in particular, since a rate of zero is a degenerate case the function handles separately."]'::jsonb and answer_index = 0 and explanation = 'A rate of zero simply makes every divisor one. A top row that does not match the ledger total is reading different flows, since at a rate of zero every discounting convention returns the same sum.' then 'old'
           when prompt = 'A swept table of present values reports 980.9313 million USD at a rate of 0 percent. What must that value equal?' and options = '["The undiscounted total contractor net cash flow of the same ledger, which is the cheapest check there is on a discounted number.", "The present value at the project''s own rate, since a rate of zero is read as an instruction to use the project default.", "The total government cash flow, because at a rate of zero the two sides of the ledger are no longer separated by timing.", "Nothing in particular, since a rate of zero is a degenerate case the function handles separately."]'::jsonb and answer_index = 0 and explanation = 'A rate of zero simply makes every divisor one. A top row that does not match the ledger total is reading different flows, since at a rate of zero every discounting convention returns the same sum.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 26'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 26 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A swept table of present values reports 980.9313 million USD at a rate of 0 percent. What must that value equal?', options = '["The undiscounted total contractor net cash flow of the same ledger, which is the cheapest check there is on a discounted number.", "The present value at the project''s own rate, since a rate of zero is read as an instruction to use the project default.", "The total government cash flow, because at a rate of zero the two sides of the ledger are no longer separated by timing.", "Nothing in particular, since a rate of zero is a degenerate case the function handles separately."]'::jsonb, explanation = 'A rate of zero simply makes every divisor one. A top row that does not match the ledger total is reading different flows, since at a rate of zero every discounting convention returns the same sum.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 26 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 34
  select case
           when prompt = 'The teaching field summary is sorted by contractor net present value descending and Brazil - Concession is first at negative 5.8662 million USD. Government take runs the other way, 316.7898 for Angola against 232.9950 for Brazil. Which order is right?' and options = '["The take order, since a present value that is negative for every regime cannot rank anything and should not be sorted on at all.", "The present value order, because the summary''s own sort is the engine''s verdict and the take column is a derived quantity beside it.", "Neither, because the two disagree, and a ranking that reverses under a second column is evidence that the comparison was mis-specified.", "Both, and they are orders of different things."]'::jsonb and answer_index = 3 and explanation = 'The best regime for the contractor on that field has a present value of negative 5.8662 million USD. Being least bad is a real answer, and it needs its label saying so.' then 'old'
           when prompt = 'The teaching field summary is sorted by contractor net present value descending and Brazil - Concession is first at negative 5.8662 million USD. Government cash flow runs the other way, 316.7898 for Angola against 232.9950 for Brazil. Which order is right?' and options = '["The take order, since a present value that is negative for every regime cannot rank anything and should not be sorted on at all.", "The present value order, because the summary''s own sort is the engine''s verdict and the take column is a derived quantity beside it.", "Neither, because the two disagree, and a ranking that reverses under a second column is evidence that the comparison was mis-specified.", "Both, and they are orders of different things."]'::jsonb and answer_index = 3 and explanation = 'The best regime for the contractor on that field has a present value of negative 5.8662 million USD. Being least bad is a real answer, and it needs its label saying so.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 34'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 34 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The teaching field summary is sorted by contractor net present value descending and Brazil - Concession is first at negative 5.8662 million USD. Government cash flow runs the other way, 316.7898 for Angola against 232.9950 for Brazil. Which order is right?', options = '["The take order, since a present value that is negative for every regime cannot rank anything and should not be sorted on at all.", "The present value order, because the summary''s own sort is the engine''s verdict and the take column is a derived quantity beside it.", "Neither, because the two disagree, and a ranking that reverses under a second column is evidence that the comparison was mis-specified.", "Both, and they are orders of different things."]'::jsonb, explanation = 'The best regime for the contractor on that field has a present value of negative 5.8662 million USD. Being least bad is a real answer, and it needs its label saying so.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 34 updated % rows', v_count; end if;
  end if;

  -- ec2i_exam ord 39
  select case
           when prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool, reports a contractor net cash flow of negative 15724.0151 and an internal rate of return of 0.0000 percent. Which guard produced the rate?' and options = '["The sign change check, since a ledger with no positive contractor cash flow in any year never changes sign.", "The bracketing step, which returned its lower bound because the present value was negative across the whole search.", "The check on the present value at a rate of zero, which is not above zero here, so the engine reports 0 rather than a negative rate.", "None of them. The rate is a genuine root, and a project that recovers exactly its outlay returns zero."]'::jsonb and answer_index = 2 and explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government take is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.' then 'old'
           when prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool, reports a contractor net cash flow of negative 15724.0151 and an internal rate of return of 0.0000 percent. Which guard produced the rate?' and options = '["The sign change check, since a ledger with no positive contractor cash flow in any year never changes sign.", "The bracketing step, which returned its lower bound because the present value was negative across the whole search.", "The check on the present value at a rate of zero, which is not above zero here, so the engine reports 0 rather than a negative rate.", "None of them. The rate is a genuine root, and a project that recovers exactly its outlay returns zero."]'::jsonb and answer_index = 2 and explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government cash flow is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2i_exam ord 39'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2i_exam ord 39 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool, reports a contractor net cash flow of negative 15724.0151 and an internal rate of return of 0.0000 percent. Which guard produced the rate?', options = '["The sign change check, since a ledger with no positive contractor cash flow in any year never changes sign.", "The bracketing step, which returned its lower bound because the present value was negative across the whole search.", "The check on the present value at a rate of zero, which is not above zero here, so the engine reports 0 rather than a negative rate.", "None of them. The rate is a genuine root, and a project that recovers exactly its outlay returns zero."]'::jsonb, explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government cash flow is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2i_exam ord 39 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 3
  select case
           when prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?' and options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government take ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 43.0919 is an error."]'::jsonb and answer_index = 1 and explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.' then 'old'
           when prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?' and options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government cash flow ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 43.0919 is an error."]'::jsonb and answer_index = 1 and explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 3;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 3 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?', options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government cash flow ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 43.0919 is an error."]'::jsonb, explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 3 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 5
  select case
           when prompt = 'On ODIDI, Ghana - Deepwater sits at rank 3 collecting 308.8447 million USD for the government and USA - Gulf of Mexico at rank 4 collecting 277.6679. Why does the lower ranked regime collect less?' and options = '["The take column is reported after royalty on that field, and USA - Gulf of Mexico charges the higher flat royalty of the two.", "The sort key is NPV discounted at 12 percent while take is an undiscounted lifetime total, and the larger contractor sum arrives later.", "The ranking was set by the effective tax rate column, where 32.8219 percent sits below 36.5071 percent.", "USA - Gulf of Mexico never pays back on ODIDI, so its take was truncated at the fixed 25 year horizon."]'::jsonb and answer_index = 1 and explanation = 'USA - Gulf of Mexico keeps 148.3166 million USD of lifetime contractor net cash flow against 117.1399 for Ghana - Deepwater and ranks lower anyway, paying back in year 7 against year 6.' then 'old'
           when prompt = 'On ODIDI, Ghana - Deepwater sits at rank 3 collecting 308.8447 million USD for the government and USA - Gulf of Mexico at rank 4 collecting 277.6679. Why does the lower ranked regime collect less?' and options = '["The take column is reported after royalty on that field, and USA - Gulf of Mexico charges the higher flat royalty of the two.", "The sort key is NPV discounted at 12 percent while take is an undiscounted lifetime total, and the larger contractor sum arrives later.", "The ranking was set by the government share of net revenue column, where 32.8219 percent sits below 36.5071 percent.", "USA - Gulf of Mexico never pays back on ODIDI, so its take was truncated at the fixed 25 year horizon."]'::jsonb and answer_index = 1 and explanation = 'USA - Gulf of Mexico keeps 148.3166 million USD of lifetime contractor net cash flow against 117.1399 for Ghana - Deepwater and ranks lower anyway, paying back in year 7 against year 6.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI, Ghana - Deepwater sits at rank 3 collecting 308.8447 million USD for the government and USA - Gulf of Mexico at rank 4 collecting 277.6679. Why does the lower ranked regime collect less?', options = '["The take column is reported after royalty on that field, and USA - Gulf of Mexico charges the higher flat royalty of the two.", "The sort key is NPV discounted at 12 percent while take is an undiscounted lifetime total, and the larger contractor sum arrives later.", "The ranking was set by the government share of net revenue column, where 32.8219 percent sits below 36.5071 percent.", "USA - Gulf of Mexico never pays back on ODIDI, so its take was truncated at the fixed 25 year horizon."]'::jsonb, explanation = 'USA - Gulf of Mexico keeps 148.3166 million USD of lifetime contractor net cash flow against 117.1399 for Ghana - Deepwater and ranks lower anyway, paying back in year 7 against year 6.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 7 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The summary''s effective tax rate column divides which two quantities?' and options = '["Government take over government take plus contractor take, with total capex added back into the contractor''s side.", "Government take over government take plus contractor net cash flow, with no adjustment made to either quantity.", "Total tax over total profit oil, which is why a template carrying no resource rent tax reads the lower number.", "Government take over gross revenue, which is why every template on one project shares a denominator."]'::jsonb and answer_index = 0 and explanation = 'Total capex on the default project is 500.0000 million USD and the same add-back goes into every row, which turns the ratio into a rate on profit rather than a rate on cash.' then 'old'
           when prompt = 'The summary''s government share of net revenue column divides which two quantities?' and options = '["Government cash flow over government cash flow plus contractor take, with total capex added back into the contractor''s side.", "Government cash flow over government cash flow plus contractor net cash flow, with no adjustment made to either quantity.", "Total tax over total profit oil, which is why a template carrying no resource rent tax reads the lower number.", "Government cash flow over gross revenue, which is why every template on one project shares a denominator."]'::jsonb and answer_index = 0 and explanation = 'Total capex on the default project is 500.0000 million USD and the same add-back goes into every row, which turns the denominator into revenue less opex, the net revenue the name refers to.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 7;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The summary''s government share of net revenue column divides which two quantities?', options = '["Government cash flow over government cash flow plus contractor take, with total capex added back into the contractor''s side.", "Government cash flow over government cash flow plus contractor net cash flow, with no adjustment made to either quantity.", "Total tax over total profit oil, which is why a template carrying no resource rent tax reads the lower number.", "Government cash flow over gross revenue, which is why every template on one project shares a denominator."]'::jsonb, explanation = 'Total capex on the default project is 500.0000 million USD and the same add-back goes into every row, which turns the denominator into revenue less opex, the net revenue the name refers to.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 8
  select case
           when prompt = 'Angola - Deepwater PSC pays 181.7318 million USD of tax on the default project inside a take of 1200.2886, and its effective tax rate column reads 53.4534 percent. What is the column counting?' and options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.' then 'old'
           when prompt = 'Angola - Deepwater PSC pays 181.7318 million USD of tax on the default project inside a take of 1200.2886, and its government share of net revenue reads 53.4534 percent. What is the column counting?' and options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 8;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 8 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC pays 181.7318 million USD of tax on the default project inside a take of 1200.2886, and its government share of net revenue reads 53.4534 percent. What is the column counting?', options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb, explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 8 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 9
  select case
           when prompt = 'On the published comparison built with capex of 20000, Brazil - Concession shows the gentlest effective tax rate in the course, 13.5916 percent, on an NPV of -15354.6816 million USD. Why is it so low?' and options = '["Brazil - Concession charges no royalty on that project, so only its corporate income tax and its resource rent tax reach the numerator.", "The 20000 of capex was added back into the denominator and swamped everything else in it.", "Cost recovery ran at the full limit for all 25 years, so the government''s profit share never began and the tax base stayed at nought.", "The rate is discounted at 10 percent while the take it divides is not."]'::jsonb and answer_index = 1 and explanation = 'A rate that falls as the project gets worse is not measuring the harshness of the terms. Angola - Deepwater PSC on the same comparison collects 1662.7835 million USD and reads 32.2800 percent.' then 'old'
           when prompt = 'On the published comparison built with capex of 20000, Brazil - Concession shows the gentlest government share of net revenue in the course, 13.5916 percent, on an NPV of -15354.6816 million USD. Why is it so low?' and options = '["Brazil - Concession charges no royalty on that project, so only its corporate income tax and its resource rent tax reach the numerator.", "The 20000 of capex was added back into the denominator and swamped everything else in it.", "Cost recovery ran at the full limit for all 25 years, so the government''s profit share never began and the tax base stayed at nought.", "The rate is discounted at 10 percent while the take it divides is not."]'::jsonb and answer_index = 1 and explanation = 'A rate that falls as the project gets worse is not measuring the harshness of the terms. Angola - Deepwater PSC on the same comparison collects 1662.7835 million USD and reads 32.2800 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 9;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 9 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the published comparison built with capex of 20000, Brazil - Concession shows the gentlest government share of net revenue in the course, 13.5916 percent, on an NPV of -15354.6816 million USD. Why is it so low?', options = '["Brazil - Concession charges no royalty on that project, so only its corporate income tax and its resource rent tax reach the numerator.", "The 20000 of capex was added back into the denominator and swamped everything else in it.", "Cost recovery ran at the full limit for all 25 years, so the government''s profit share never began and the tax base stayed at nought.", "The rate is discounted at 10 percent while the take it divides is not."]'::jsonb, explanation = 'A rate that falls as the project gets worse is not measuring the harshness of the terms. Angola - Deepwater PSC on the same comparison collects 1662.7835 million USD and reads 32.2800 percent.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 9 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 10 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'What is the summary''s effective tax rate column not able to be compared with?' and options = '["Another regime in the same table, because the capex added back differs by regime.", "The same regime on a second field, because the add-back is discounted to that field''s own valuation date before the ratio is struck.", "A statutory rate, and the rate the price sensitivity plots, which reads 43.4694 percent where the column reads 33.7901.", "The government take column beside it, which the ratio is built from and therefore ranks in the same order on every project."]'::jsonb and answer_index = 2 and explanation = 'Both totals are undiscounted lifetime sums while the NPV beside them is discounted, and the same 500.0000 million USD add-back is applied to every row of one project.' then 'old'
           when prompt = 'What is the summary''s government share of net revenue column not able to be compared with?' and options = '["Another regime in the same table, because the capex added back differs by regime.", "The same regime on a second field, because the add-back is discounted to that field''s own valuation date before the ratio is struck.", "A statutory rate, and government take on the price sweep, which reads 43.4694 percent where the column reads 33.7901.", "The government cash flow column beside it, which the ratio is built from and therefore ranks in the same order on every project."]'::jsonb and answer_index = 2 and explanation = 'Both totals are undiscounted lifetime sums while the NPV beside them is discounted, and the same 500.0000 million USD add-back is applied to every row of one project.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What is the summary''s government share of net revenue column not able to be compared with?', options = '["Another regime in the same table, because the capex added back differs by regime.", "The same regime on a second field, because the add-back is discounted to that field''s own valuation date before the ratio is struck.", "A statutory rate, and government take on the price sweep, which reads 43.4694 percent where the column reads 33.7901.", "The government cash flow column beside it, which the ratio is built from and therefore ranks in the same order on every project."]'::jsonb, explanation = 'Both totals are undiscounted lifetime sums while the NPV beside them is discounted, and the same 500.0000 million USD add-back is applied to every row of one project.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2a_m01 ord 14
  select case
           when prompt = 'The two Suite test regimes return Flat with an NPV of 1262.3470 million USD, take of 1881.7626 and an effective tax rate of 36.5310, which is exactly the row Generic Royalty/Tax returns on the test project. Why?' and options = '["Both rows were run at the same discount rate of 10 percent, and the effective tax rate is insensitive to everything except the rate.", "The comparison caches one result per project and reuses it whenever the first regime in the list sorts to rank 1 of the summary.", "The four instruments are identical, so a name is not a regime.", "Generic Royalty/Tax is the fallback the engine substitutes for any regime that carries no resource rent tax and no tiered split."]'::jsonb and answer_index = 2 and explanation = 'One field and one deck divided by the same royalty, the same cost recovery, the same split and the same tax stack returns the same ledger under either label.' then 'old'
           when prompt = 'The two Suite test regimes return Flat with an NPV of 1262.3470 million USD, take of 1881.7626 and a government share of net revenue of 36.5310, which is exactly the row Generic Royalty/Tax returns on the test project. Why?' and options = '["Both rows were run at the same discount rate of 10 percent, and government share of net revenue is insensitive to everything except the rate.", "The comparison caches one result per project and reuses it whenever the first regime in the list sorts to rank 1 of the summary.", "The four instruments are identical, so a name is not a regime.", "Generic Royalty/Tax is the fallback the engine substitutes for any regime that carries no resource rent tax and no tiered split."]'::jsonb and answer_index = 2 and explanation = 'One field and one deck divided by the same royalty, the same cost recovery, the same split and the same tax stack returns the same ledger under either label.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 14;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m01 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m01 ord 14 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The two Suite test regimes return Flat with an NPV of 1262.3470 million USD, take of 1881.7626 and a government share of net revenue of 36.5310, which is exactly the row Generic Royalty/Tax returns on the test project. Why?', options = '["Both rows were run at the same discount rate of 10 percent, and government share of net revenue is insensitive to everything except the rate.", "The comparison caches one result per project and reuses it whenever the first regime in the list sorts to rank 1 of the summary.", "The four instruments are identical, so a name is not a regime.", "Generic Royalty/Tax is the fallback the engine substitutes for any regime that carries no resource rent tax and no tiered split."]'::jsonb, explanation = 'One field and one deck divided by the same royalty, the same cost recovery, the same split and the same tax stack returns the same ledger under either label.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m01 ord 14 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 5
  select case
           when prompt = 'What does the price sweep return for a regime when total government take plus total contractor net cash flow is not greater than zero?' and options = '["Exactly 0, drawn on the axis beside the shares of the other regimes.", "A null, with the point''s state set to undefined and a break in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, flagged exceeds, which is why a plotted share can run into the thousands."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six templates return null with the state undefined at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.' then 'old'
           when prompt = 'What does the price sweep return for a regime when total government cash flow plus total contractor net cash flow is not greater than zero?' and options = '["Exactly 0, drawn on the axis beside the shares of the other regimes.", "A null, with the point''s state set to undefined and a break in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, flagged exceeds, which is why a plotted share can run into the thousands."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six templates return null with the state undefined at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the price sweep return for a regime when total government cash flow plus total contractor net cash flow is not greater than zero?', options = '["Exactly 0, drawn on the axis beside the shares of the other regimes.", "A null, with the point''s state set to undefined and a break in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, flagged exceeds, which is why a plotted share can run into the thousands."]'::jsonb, explanation = 'On the comparison built with capex of 20000 all six templates return null with the state undefined at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 6 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'Six series draw no line at any of the nine prices on one published comparison, every point flagged undefined. What do the missing lines report?' and options = '["That the six regimes collected nothing, which is what an empty series would mean on a chart of government take.", "That every point sits above 100 percent and was pinned off the top of the axis.", "That the project''s lifetime profit is not positive at any swept price, so no government share exists to plot.", "That the sweep failed to run, since a comparison whose engine call rejects returns no series at all."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison, and every one of its nine points is null with the state undefined.' then 'old'
           when prompt = 'Six series draw no line at any of the nine prices on one published comparison, every point flagged undefined. What do the missing lines report?' and options = '["That the six regimes collected nothing, which is what an empty series would mean on a chart of government cash flow.", "That every point sits above 100 percent and was pinned off the top of the axis.", "That the project''s lifetime profit is not positive at any swept price, so no government take exists to plot.", "That the sweep failed to run, since a comparison whose engine call rejects returns no series at all."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison, and every one of its nine points is null with the state undefined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Six series draw no line at any of the nine prices on one published comparison, every point flagged undefined. What do the missing lines report?', options = '["That the six regimes collected nothing, which is what an empty series would mean on a chart of government cash flow.", "That every point sits above 100 percent and was pinned off the top of the axis.", "That the project''s lifetime profit is not positive at any swept price, so no government take exists to plot.", "That the sweep failed to run, since a comparison whose engine call rejects returns no series at all."]'::jsonb, explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison, and every one of its nine points is null with the state undefined.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 7
  select case
           when prompt = 'The Angola template on the default project at three times capex returns null at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many states sit on those four points?' and options = '["Three: undefined, then exceeds at 2223.0766 and 144.0692, then an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government take at each swept price as the ledger changes sign."]'::jsonb and answer_index = 0 and explanation = 'The null carries the state undefined because lifetime profit is not positive at 40, and the two points above 100 percent carry exceeds and keep their true values.' then 'old'
           when prompt = 'The Angola template on the default project at three times capex returns null at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many states sit on those four points?' and options = '["Three: undefined, then exceeds at 2223.0766 and 144.0692, then an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government cash flow at each swept price as the ledger changes sign."]'::jsonb and answer_index = 0 and explanation = 'The null carries the state undefined because lifetime profit is not positive at 40, and the two points above 100 percent carry exceeds and keep their true values.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 7;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Angola template on the default project at three times capex returns null at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many states sit on those four points?', options = '["Three: undefined, then exceeds at 2223.0766 and 144.0692, then an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government cash flow at each swept price as the ledger changes sign."]'::jsonb, explanation = 'The null carries the state undefined because lifetime profit is not positive at 40, and the two points above 100 percent carry exceeds and keep their true values.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 8
  select case
           when prompt = 'What must a reader check before quoting any single point off the government share curve?' and options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb and answer_index = 3 and explanation = 'If lifetime contractor net cash flow is negative the point is above 100 percent and flagged exceeds, and if it is negative enough to outweigh the take the point is null and flagged undefined.' then 'old'
           when prompt = 'What must a reader check before quoting any single point off the government take curve?' and options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb and answer_index = 3 and explanation = 'If lifetime contractor net cash flow is negative the point is above 100 percent and flagged exceeds, and if it is negative enough to outweigh the take the point is null and flagged undefined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 8;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 8 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What must a reader check before quoting any single point off the government take curve?', options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb, explanation = 'If lifetime contractor net cash flow is negative the point is above 100 percent and flagged exceeds, and if it is negative enough to outweigh the take the point is null and flagged undefined.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 8 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 13
  select case
           when prompt = 'A gas weighted project shows a government share that barely moves across the nine points. What is the correct conclusion?' and options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The engine flagged every point undefined and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb and answer_index = 2 and explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.' then 'old'
           when prompt = 'A gas weighted project shows a government take that barely moves across the nine points. What is the correct conclusion?' and options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The engine flagged every point undefined and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb and answer_index = 2 and explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 13;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A gas weighted project shows a government take that barely moves across the nine points. What is the correct conclusion?', options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The engine flagged every point undefined and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb, explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 15
  select case
           when prompt = 'Why can a reader not carry one correction between the summary''s effective tax rate and the chart''s?' and options = '["The two are computed on different projects, so a gap measured on one field cannot be carried to another.", "The gap runs from 9.6793 to 17.0850 percentage points across six templates on one project at one price.", "The chart prints four decimal places and the table one, so the offset changes with the rounding.", "The gap changes sign between a regime that adds capex back and one that does not."]'::jsonb and answer_index = 1 and explanation = 'The gap grows with the government''s share, so Ghana - Deepwater''s 16.7958 carried across to Generic Royalty/Tax, where it is 9.6793, overstates the chart badly.' then 'old'
           when prompt = 'Why can a reader not carry one fixed offset between government share of net revenue in the summary and government take on the chart?' and options = '["The two are computed on different projects, so a gap measured on one field cannot be carried to another.", "The gap runs from 9.6793 to 17.0850 percentage points across six templates on one project at one price.", "The chart prints four decimal places and the table one, so the offset changes with the rounding.", "The gap changes sign between a regime that adds capex back and one that does not."]'::jsonb and answer_index = 1 and explanation = 'The gap grows with government share of net revenue itself, so Ghana - Deepwater''s 16.7958 carried across to Generic Royalty/Tax, where it is 9.6793, overstates the chart badly.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 15;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m02 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m02 ord 15 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why can a reader not carry one fixed offset between government share of net revenue in the summary and government take on the chart?', options = '["The two are computed on different projects, so a gap measured on one field cannot be carried to another.", "The gap runs from 9.6793 to 17.0850 percentage points across six templates on one project at one price.", "The chart prints four decimal places and the table one, so the offset changes with the rounding.", "The gap changes sign between a regime that adds capex back and one that does not."]'::jsonb, explanation = 'The gap grows with government share of net revenue itself, so Ghana - Deepwater''s 16.7958 carried across to Generic Royalty/Tax, where it is 9.6793, overstates the chart badly.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m02 ord 15 updated % rows', v_count; end if;
  end if;

  -- ec2a_m03 ord 10 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.' and options = '["A government share in percent at nine oil prices, and contractor NPV in million USD at seven capex multipliers.", "Contractor NPV in million USD at nine oil prices, and a government share in percent at seven capex multipliers, which is the pairing the two axis titles suggest.", "A government share in percent on both, nine points on price and eight on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb and answer_index = 0 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.' then 'old'
           when prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.' and options = '["Government take in percent at nine oil prices, and contractor NPV in million USD at seven capex multipliers.", "Contractor NPV in million USD at nine oil prices, and government take in percent at seven capex multipliers, which is the pairing the two axis titles suggest.", "Government take in percent on both, nine points on price and eight on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb and answer_index = 0 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m03 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m03 ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.', options = '["Government take in percent at nine oil prices, and contractor NPV in million USD at seven capex multipliers.", "Contractor NPV in million USD at nine oil prices, and government take in percent at seven capex multipliers, which is the pairing the two axis titles suggest.", "Government take in percent on both, nine points on price and eight on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb, explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m03 ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 1
  select case
           when prompt = 'On `cmp_all_templates_default_project` the payback verdict reads that Generic Royalty/Tax pays back in year 3, against year 4 for Angola - Deepwater PSC. Four of the six templates pay back in year 3. Which of the four does the sentence name?' and options = '["Whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, since the engine interpolates within the year to separate a tie.", "The first of them in summary order, and the summary is sorted by contractor NPV, so the sentence names whichever regime has the highest NPV.", "Angola - Deepwater PSC, because a payback of year 4 is what the comparison clause of the sentence ranks the winner against.", "The one of the four with the smallest government take, 758.7514 million USD, which the tie break reads next."]'::jsonb and answer_index = 1 and explanation = 'Payback is an integer year, so a strict less than in a reduce keeps the first element it saw, and that element is the NPV winner at 397.0445 million USD.' then 'old'
           when prompt = 'On `cmp_all_templates_default_project` the payback verdict reads that Generic Royalty/Tax pays back in year 3, against year 4 for Angola - Deepwater PSC. Four of the six templates pay back in year 3. Which of the four does the sentence name?' and options = '["Whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, since the engine interpolates within the year to separate a tie.", "The first of them in summary order, and the summary is sorted by contractor NPV, so the sentence names whichever regime has the highest NPV.", "Angola - Deepwater PSC, because a payback of year 4 is what the comparison clause of the sentence ranks the winner against.", "The one of the four with the smallest government cash flow, 758.7514 million USD, which the tie break reads next."]'::jsonb and answer_index = 1 and explanation = 'Payback is an integer year, so a strict less than in a reduce keeps the first element it saw, and that element is the NPV winner at 397.0445 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 1;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m04 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m04 ord 1 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_all_templates_default_project` the payback verdict reads that Generic Royalty/Tax pays back in year 3, against year 4 for Angola - Deepwater PSC. Four of the six templates pay back in year 3. Which of the four does the sentence name?', options = '["Whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, since the engine interpolates within the year to separate a tie.", "The first of them in summary order, and the summary is sorted by contractor NPV, so the sentence names whichever regime has the highest NPV.", "Angola - Deepwater PSC, because a payback of year 4 is what the comparison clause of the sentence ranks the winner against.", "The one of the four with the smallest government cash flow, 758.7514 million USD, which the tie break reads next."]'::jsonb, explanation = 'Payback is an integer year, so a strict less than in a reduce keeps the first element it saw, and that element is the NPV winner at 397.0445 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m04 ord 1 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 5 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'An earlier build called Nigeria - PIA (2021) the most progressive on `cmp_never_recovers`, rising 0.0 percentage points. What does the price verdict return there now, and why?' and options = '["It declines to rank, because every point is undefined and so no swept price gives a government share for every regime.", "It still names Nigeria - PIA (2021), since two null endpoints subtract to a climb of zero that ranks like any other.", "It names Angola - Deepwater PSC, the regime that collected the most, because the take column breaks a tie in the climbs.", "It is omitted entirely, as it is for a single regime, because a ranking needs at least two usable series."]'::jsonb and answer_index = 0 and explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government take of 1431.0440, profit is not positive at any swept price, and the sentence says no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'old'
           when prompt = 'An earlier build called Nigeria - PIA (2021) the most progressive on `cmp_never_recovers`, rising 0.0 percentage points. What does the price verdict return there now, and why?' and options = '["It declines to rank, because every point is undefined and so no swept price gives every regime a government take within 0 to 100 percent.", "It still names Nigeria - PIA (2021), since two null endpoints subtract to a climb of zero that ranks like any other.", "It names Angola - Deepwater PSC, the regime that collected the most, because the take column breaks a tie in the climbs.", "It is omitted entirely, as it is for a single regime, because the verdict needs at least two regimes whose series carry usable points before it will rank anything."]'::jsonb and answer_index = 0 and explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government cash flow of 1431.0440, profit is not positive at any swept price, and the sentence says no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m04 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m04 ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An earlier build called Nigeria - PIA (2021) the most progressive on `cmp_never_recovers`, rising 0.0 percentage points. What does the price verdict return there now, and why?', options = '["It declines to rank, because every point is undefined and so no swept price gives every regime a government take within 0 to 100 percent.", "It still names Nigeria - PIA (2021), since two null endpoints subtract to a climb of zero that ranks like any other.", "It names Angola - Deepwater PSC, the regime that collected the most, because the take column breaks a tie in the climbs.", "It is omitted entirely, as it is for a single regime, because the verdict needs at least two regimes whose series carry usable points before it will rank anything."]'::jsonb, explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government cash flow of 1431.0440, profit is not positive at any swept price, and the sentence says no regime is economic at any swept price from 40 to 120 USD per bbl.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m04 ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 6
  select case
           when prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?' and options = '["1339.2784 million USD, because government take descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1200.2886 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb and answer_index = 2 and explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.' then 'old'
           when prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?' and options = '["1339.2784 million USD, because government cash flow descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1200.2886 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb and answer_index = 2 and explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m04 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m04 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?', options = '["1339.2784 million USD, because government cash flow descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1200.2886 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb, explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m04 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 14
  select case
           when prompt = '`never_recovers_huge_capex` returns total profit oil 0.0000, total tax 0.0000 and total government take 875.1492 million USD. Which instrument produced the take?' and options = '["The government''s share of profit oil, which is charged before the cost recovery limit is applied and therefore survives the overrun.", "Corporate income tax on the profit share, levied on the gross revenue of 7001.1938 million USD rather than on a base that went negative.", "The minimum tax, which the tax stack applies whenever the computed charge on a loss making project would otherwise be zero.", "Royalty, taken off the top."]'::jsonb and answer_index = 3 and explanation = 'Profit oil never appears, so the tax stack never charges anything, and every dollar of the 875.1492 is royalty off the top of revenue.' then 'old'
           when prompt = '`never_recovers_huge_capex` returns total profit oil 0.0000, total tax 0.0000 and total government cash flow 875.1492 million USD. Which instrument produced the take?' and options = '["The government''s share of profit oil, which is charged before the cost recovery limit is applied and therefore survives the overrun.", "Corporate income tax on the profit share, levied on the gross revenue of 7001.1938 million USD rather than on a base that went negative.", "The minimum tax, which the tax stack applies whenever the computed charge on a loss making project would otherwise be zero.", "Royalty, taken off the top."]'::jsonb and answer_index = 3 and explanation = 'Profit oil never appears, so the tax stack never charges anything, and every dollar of the 875.1492 is royalty off the top of revenue.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 14;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m04 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m04 ord 14 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`never_recovers_huge_capex` returns total profit oil 0.0000, total tax 0.0000 and total government cash flow 875.1492 million USD. Which instrument produced the take?', options = '["The government''s share of profit oil, which is charged before the cost recovery limit is applied and therefore survives the overrun.", "Corporate income tax on the profit share, levied on the gross revenue of 7001.1938 million USD rather than on a base that went negative.", "The minimum tax, which the tax stack applies whenever the computed charge on a loss making project would otherwise be zero.", "Royalty, taken off the top."]'::jsonb, explanation = 'Profit oil never appears, so the tax stack never charges anything, and every dollar of the 875.1492 is royalty off the top of revenue.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m04 ord 14 updated % rows', v_count; end if;
  end if;

  -- ec2a_m05 ord 1
  select case
           when prompt = 'Nigeria - PIA (2021) on the default project reads an effective tax rate of 59.6432 in the summary table and 76.7282 on the price sweep at 70 USD per bbl. What separates the two?' and options = '["The summary is computed on discounted cash flows at 10 percent while the sweep totals the same ledger undiscounted, so the two answer the same question at different dates.", "The sweep re-ran the comparison at a higher oil price than the deck''s own, so 76.7282 belongs to a later point of the nine and not to the base case.", "The summary adds total capex back into the contractor side of the denominator and the sweep does not, on the same cash flows over the same 25 years.", "The summary counts royalty inside government take and the sweep counts only profit oil and tax, which is why the sweep reads the higher of the two."]'::jsonb and answer_index = 2 and explanation = 'Both come out of one call to `runFiscalComparison` and both are labelled effective tax rate, and 17.0850 percentage points separate them.' then 'old'
           when prompt = 'Nigeria - PIA (2021) on the default project reads 59.6432 as government share of net revenue in the summary table and 76.7282 as government take on the price sweep at 70 USD per bbl. What separates the two?' and options = '["The summary is computed on discounted cash flows at 10 percent while the sweep totals the same ledger undiscounted, so the two answer the same question at different dates.", "The sweep re-ran the comparison at a higher oil price than the deck''s own, so 76.7282 belongs to a later point of the nine, not the base case.", "The summary adds total capex back into the contractor side of the denominator and the sweep does not, on the same cash flows over the same 25 years.", "The summary counts royalty inside government cash flow and the sweep counts only profit oil and tax, which is why the sweep reads the higher of the two."]'::jsonb and answer_index = 2 and explanation = 'Both come out of one call to `runFiscalComparison` an earlier build gave them one label, and 17.0850 percentage points separate them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 1;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m05 ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m05 ord 1 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Nigeria - PIA (2021) on the default project reads 59.6432 as government share of net revenue in the summary table and 76.7282 as government take on the price sweep at 70 USD per bbl. What separates the two?', options = '["The summary is computed on discounted cash flows at 10 percent while the sweep totals the same ledger undiscounted, so the two answer the same question at different dates.", "The sweep re-ran the comparison at a higher oil price than the deck''s own, so 76.7282 belongs to a later point of the nine, not the base case.", "The summary adds total capex back into the contractor side of the denominator and the sweep does not, on the same cash flows over the same 25 years.", "The summary counts royalty inside government cash flow and the sweep counts only profit oil and tax, which is why the sweep reads the higher of the two."]'::jsonb, explanation = 'Both come out of one call to `runFiscalComparison` an earlier build gave them one label, and 17.0850 percentage points separate them.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m05 ord 1 updated % rows', v_count; end if;
  end if;

  -- ec2a_m05 ord 2 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'A reader proposes to translate between the two effective tax rates with a fixed offset, because the chart runs about ten points above the table. Why does that fail?' and options = '["The gap is not fixed: on one comparison at one price it runs from 9.6793 percentage points for Generic Royalty/Tax to 17.0850 for Nigeria - PIA (2021), and it grows with the government''s share.", "The gap changes with the swept price, so an offset taken at 70 USD per bbl is wrong at every other one of the nine points.", "The offset is stable in percentage points and unstable in money, so it can be carried between rates but never between takes.", "The two rates are computed from different ledgers, so no arithmetic relation between them exists to be approximated by an offset."]'::jsonb and answer_index = 0 and explanation = 'A capex add-back of a fixed 500.0000 million USD weighs more heavily on a denominator the state has already thinned, so Ghana - Deepwater shows 16.7958 where Generic Royalty/Tax shows 9.6793.' then 'old'
           when prompt = 'A reader proposes to translate between government take and government share of net revenue with a fixed offset, because the chart runs about ten points above the table. Why does that fail?' and options = '["The gap is not fixed: on one comparison at one price it runs from 9.6793 percentage points for Generic Royalty/Tax to 17.0850 for Nigeria - PIA (2021), and it grows with the share itself.", "The gap changes with the swept price, so an offset taken at 70 USD per bbl is wrong at every other one of the nine points.", "The offset is stable in percentage points and unstable in money, so it can be carried between rates but never between takes.", "The two rates are computed from different ledgers, so no arithmetic relation between them exists to be approximated by an offset."]'::jsonb and answer_index = 0 and explanation = 'Government take is government share of net revenue times 1.286453 on this project, so the gap is proportional to the share: Ghana - Deepwater shows 16.7958 where Generic Royalty/Tax shows 9.6793.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 2;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m05 ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m05 ord 2 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader proposes to translate between government take and government share of net revenue with a fixed offset, because the chart runs about ten points above the table. Why does that fail?', options = '["The gap is not fixed: on one comparison at one price it runs from 9.6793 percentage points for Generic Royalty/Tax to 17.0850 for Nigeria - PIA (2021), and it grows with the share itself.", "The gap changes with the swept price, so an offset taken at 70 USD per bbl is wrong at every other one of the nine points.", "The offset is stable in percentage points and unstable in money, so it can be carried between rates but never between takes.", "The two rates are computed from different ledgers, so no arithmetic relation between them exists to be approximated by an offset."]'::jsonb, explanation = 'Government take is government share of net revenue times 1.286453 on this project, so the gap is proportional to the share: Ghana - Deepwater shows 16.7958 where Generic Royalty/Tax shows 9.6793.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m05 ord 2 updated % rows', v_count; end if;
  end if;

  -- ec2a_m05 ord 4
  select case
           when prompt = 'The Angola template on the default project at three times capex returns null, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many states are on that line?' and options = '["One, a government share that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: undefined at the first point, then exceeds twice with the true values kept, then an ordinary share."]'::jsonb and answer_index = 3 and explanation = 'A government share of several hundred percent is arithmetic and not a fiscal term, which is why those two points are flagged exceeds and never set the chart''s scale.' then 'old'
           when prompt = 'The Angola template on the default project at three times capex returns null, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many states are on that line?' and options = '["One, a government take that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: undefined at the first point, then exceeds twice with the true values kept, then an ordinary share."]'::jsonb and answer_index = 3 and explanation = 'A government take of several hundred percent is arithmetic and not a fiscal term, which is why those two points are flagged exceeds and never set the chart''s scale.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m05 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m05 ord 4 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Angola template on the default project at three times capex returns null, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many states are on that line?', options = '["One, a government take that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: undefined at the first point, then exceeds twice with the true values kept, then an ordinary share."]'::jsonb, explanation = 'A government take of several hundred percent is arithmetic and not a fiscal term, which is why those two points are flagged exceeds and never set the chart''s scale.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m05 ord 4 updated % rows', v_count; end if;
  end if;

  -- ec2a_m06 ord 6 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'On ODIDI, Ghana - Deepwater reads an effective tax rate of 36.5071 at rank 3 and USA - Gulf of Mexico reads 32.8219 at rank 4. What does that show?' and options = '["That the two rows were computed at different discount rates, since the summary discounts each regime at the rate its template carries.", "That the effective tax rate does not follow the sort either.", "That the effective tax rate column is the sweep''s version on those two rows, which is the definition that has no capex added back.", "That the sort has a secondary key on the effective tax rate ascending, which only shows itself when two NPVs are close together."]'::jsonb and answer_index = 1 and explanation = 'The rate is take over take plus contractor take with capex added back, both totals undiscounted, while the sort key is discounted at 12 percent.' then 'old'
           when prompt = 'On ODIDI, Ghana - Deepwater reads a government share of net revenue of 36.5071 at rank 3 and USA - Gulf of Mexico reads 32.8219 at rank 4. What does that show?' and options = '["That the two rows were computed at different discount rates, since the summary discounts each regime at the rate its template carries.", "That government share of net revenue does not follow the sort either.", "That the column shows government take on those two rows, which is the definition that has no capex added back.", "That the sort has a secondary key on government share of net revenue ascending, which only shows itself when two NPVs are close together."]'::jsonb and answer_index = 1 and explanation = 'The ratio is government cash flow over government cash flow plus contractor take with capex added back, both totals undiscounted, while the sort key is discounted at 12 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m06 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m06 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI, Ghana - Deepwater reads a government share of net revenue of 36.5071 at rank 3 and USA - Gulf of Mexico reads 32.8219 at rank 4. What does that show?', options = '["That the two rows were computed at different discount rates, since the summary discounts each regime at the rate its template carries.", "That government share of net revenue does not follow the sort either.", "That the column shows government take on those two rows, which is the definition that has no capex added back.", "That the sort has a secondary key on government share of net revenue ascending, which only shows itself when two NPVs are close together."]'::jsonb, explanation = 'The ratio is government cash flow over government cash flow plus contractor take with capex added back, both totals undiscounted, while the sort key is discounted at 12 percent.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m06 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2a_m06 ord 10 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'What has to be checked under every government share before it is quoted?' and options = '["Total government take and total contractor net cash flow for that regime.", "The swept price the point belongs to, since a share read off the wrong one of the nine labels is the common error on this chart.", "The summary''s effective tax rate for the same regime, which is the same ratio with the capex add-back and can be used to correct the point.", "The number of regimes in the comparison, because the share is normalised across the regimes plotted and moves when one is added or removed."]'::jsonb and answer_index = 0 and explanation = 'If the contractor total is negative the number is not a share, and if the two do not sum above zero the curve reads 0.0000 and means nothing at all.' then 'old'
           when prompt = 'What has to be checked under every government take before it is quoted?' and options = '["Total government cash flow and total contractor net cash flow for that regime.", "The swept price the point belongs to, since a share read off the wrong one of the nine labels is the common error on this chart.", "Government share of net revenue for the same regime, which keeps capex in its denominator and can be used to correct the point.", "The number of regimes in the comparison, because the share is normalised across the regimes plotted and moves when one is added or removed."]'::jsonb and answer_index = 0 and explanation = 'If the contractor total is negative the point is flagged exceeds, and if the two do not sum above zero it is null and flagged undefined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m06 ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m06 ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What has to be checked under every government take before it is quoted?', options = '["Total government cash flow and total contractor net cash flow for that regime.", "The swept price the point belongs to, since a share read off the wrong one of the nine labels is the common error on this chart.", "Government share of net revenue for the same regime, which keeps capex in its denominator and can be used to correct the point.", "The number of regimes in the comparison, because the share is normalised across the regimes plotted and moves when one is added or removed."]'::jsonb, explanation = 'If the contractor total is negative the point is flagged exceeds, and if the two do not sum above zero it is null and flagged undefined.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m06 ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2a_m06 ord 15
  select case
           when prompt = 'Nigeria - PIA (2021) has a capex resilience of 97.7613 million USD and also of 118.3685. Which is right?' and options = '["The first, because the second figure came from calling the ledger function directly at a multiplier the comparison never sweeps and never returns to a reader.", "Both, each for its own question: 97.7613 is the loss over the seven points the sweep visited and 118.3685 the loss over the eight the axis advertised.", "The second, because the axis label is the published range, and a resilience figure quoted short of that range understates the exposure the chart set out to price.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb and answer_index = 1 and explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 and 76.7282 as its effective tax rate.' then 'old'
           when prompt = 'Nigeria - PIA (2021) has a capex resilience of 97.7613 million USD and also of 118.3685. Which is right?' and options = '["The first, because the second figure came from calling the ledger function directly at a multiplier the comparison never sweeps and never returns to a reader.", "Both, each for its own question: 97.7613 is the loss over the seven points the sweep visited and 118.3685 the loss over the eight the axis advertised.", "The second, because the axis label is the published range, and a resilience figure quoted short of that range understates the exposure the chart set out to price.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb and answer_index = 1 and explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 as government share of net revenue and 76.7282 as government take.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_m06 ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_m06 ord 15 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Nigeria - PIA (2021) has a capex resilience of 97.7613 million USD and also of 118.3685. Which is right?', options = '["The first, because the second figure came from calling the ledger function directly at a multiplier the comparison never sweeps and never returns to a reader.", "Both, each for its own question: 97.7613 is the loss over the seven points the sweep visited and 118.3685 the loss over the eight the axis advertised.", "The second, because the axis label is the published range, and a resilience figure quoted short of that range understates the exposure the chart set out to price.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb, explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 as government share of net revenue and 76.7282 as government take.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_m06 ord 15 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 2
  select case
           when prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?' and options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government take.", "That the test project is insensitive to fiscal terms, since Complex returns 709.3642 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb and answer_index = 2 and explanation = 'Complex on the same project returns 709.3642 million USD of NPV and 2934.0177 of government take, so the field is not the reason the two agree.' then 'old'
           when prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?' and options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government cash flow.", "That the test project is insensitive to fiscal terms, since Complex returns 709.3642 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb and answer_index = 2 and explanation = 'Complex on the same project returns 709.3642 million USD of NPV and 2934.0177 of government cash flow, so the field is not the reason the two agree.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 2 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?', options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government cash flow.", "That the test project is insensitive to fiscal terms, since Complex returns 709.3642 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb, explanation = 'Complex on the same project returns 709.3642 million USD of NPV and 2934.0177 of government cash flow, so the field is not the reason the two agree.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 2 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 4
  select case
           when prompt = 'Two regimes in one comparison return exactly the same contractor NPV. Where do they sit in the summary?' and options = '["Ordered by government take ascending, which is the tie break the comparison applies before it hands the rows back to the caller.", "Ordered by payback year and then by the R factor payout year, the two integer columns the summary already carries for every regime.", "Either of them may head the table, since a tie inside a floating point sort goes to whichever rounding error happened to be the smaller.", "In the order they were passed in, because the sort has no secondary key."]'::jsonb and answer_index = 3 and explanation = 'The comparison exposes no option to sort on anything else, so `summary[0]` guarantees the highest contractor NPV at the comparison''s discount rate and nothing more.' then 'old'
           when prompt = 'Two regimes in one comparison return exactly the same contractor NPV. Where do they sit in the summary?' and options = '["Ordered by government cash flow ascending, which is the tie break the comparison applies before it hands the rows back to the caller.", "Ordered by payback year and then by the R factor payout year, the two integer columns the summary already carries for every regime.", "Either of them may head the table, since a tie inside a floating point sort goes to whichever rounding error happened to be the smaller.", "In the order they were passed in, because the sort has no secondary key."]'::jsonb and answer_index = 3 and explanation = 'The comparison exposes no option to sort on anything else, so `summary[0]` guarantees the highest contractor NPV at the comparison''s discount rate and nothing more.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 4 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two regimes in one comparison return exactly the same contractor NPV. Where do they sit in the summary?', options = '["Ordered by government cash flow ascending, which is the tie break the comparison applies before it hands the rows back to the caller.", "Ordered by payback year and then by the R factor payout year, the two integer columns the summary already carries for every regime.", "Either of them may head the table, since a tie inside a floating point sort goes to whichever rounding error happened to be the smaller.", "In the order they were passed in, because the sort has no secondary key."]'::jsonb, explanation = 'The comparison exposes no option to sort on anything else, so `summary[0]` guarantees the highest contractor NPV at the comparison''s discount rate and nothing more.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 4 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 5 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The summary''s effective tax rate is charged with a great deal that no tax authority calls tax. What is in the numerator?' and options = '["Government take, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 53.4534 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government take net of the cost the state recovered, which is what turns the ratio into a rate on profit rather than on cash."]'::jsonb and answer_index = 0 and explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.' then 'old'
           when prompt = 'Government share of net revenue, the summary''s percentage column, counts a great deal that no tax authority calls tax. What is in its numerator?' and options = '["Government cash flow, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 53.4534 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government cash flow net of the cost the state recovered, which is what takes capex out of the ratio."]'::jsonb and answer_index = 0 and explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Government share of net revenue, the summary''s percentage column, counts a great deal that no tax authority calls tax. What is in its numerator?', options = '["Government cash flow, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 53.4534 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government cash flow net of the cost the state recovered, which is what takes capex out of the ratio."]'::jsonb, explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 6
  select case
           when prompt = 'What does `summary[0]` guarantee on any comparison?' and options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government take, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb and answer_index = 2 and explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 43.0919, so even the IRR column is already out of order.' then 'old'
           when prompt = 'What does `summary[0]` guarantee on any comparison?' and options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government cash flow, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb and answer_index = 2 and explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 43.0919, so even the IRR column is already out of order.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does `summary[0]` guarantee on any comparison?', options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government cash flow, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb, explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 43.0919, so even the IRR column is already out of order.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 7
  select case
           when prompt = 'A reader takes a government share at 75 USD per bbl off the price chart. What have they read?' and options = '["An interpolation the engine supplies between neighbouring swept points, which is why the sweep returns a curve rather than nine values.", "The chart''s own line between two computed points, because the sweep has nine fixed prices and nothing between them.", "A tenth point, because the sweep adds any price the project''s own deck carries to its nine fixed prices before it runs.", "A share at the deck''s own price, reproduced exactly."]'::jsonb and answer_index = 1 and explanation = 'The nine prices are fixed and no input changes them, so a project whose economics turn at 45 USD per bbl cannot be examined there at all.' then 'old'
           when prompt = 'A reader reads government take at 75 USD per bbl off the price chart. What have they read?' and options = '["An interpolation the engine supplies between neighbouring swept points, which is why the sweep returns a curve rather than nine values.", "The chart''s own line between two computed points, because the sweep has nine fixed prices and nothing between them.", "A tenth point, because the sweep adds any price the project''s own deck carries to its nine fixed prices before it runs.", "A share at the deck''s own price, reproduced exactly."]'::jsonb and answer_index = 1 and explanation = 'The nine prices are fixed and no input changes them, so a project whose economics turn at 45 USD per bbl cannot be examined there at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader reads government take at 75 USD per bbl off the price chart. What have they read?', options = '["An interpolation the engine supplies between neighbouring swept points, which is why the sweep returns a curve rather than nine values.", "The chart''s own line between two computed points, because the sweep has nine fixed prices and nothing between them.", "A tenth point, because the sweep adds any price the project''s own deck carries to its nine fixed prices before it runs.", "A share at the deck''s own price, reproduced exactly."]'::jsonb, explanation = 'The nine prices are fixed and no input changes them, so a project whose economics turn at 45 USD per bbl cannot be examined there at all.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 10
  select case
           when prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?' and options = '["The climb is measured on the summary''s effective tax rate rather than the sweep''s, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'old'
           when prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?' and options = '["The climb is measured on government share of net revenue rather than on government take, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?', options = '["The climb is measured on government share of net revenue rather than on government take, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb, explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 12 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'At every swept price the comparison recomputes an NPV, a payback year and an unrecovered pool for every regime. What becomes of them?' and options = '["They are returned inside `sensitivityData` beside the share, which is how a panel draws a second series when a reader asks for one.", "They replace the summary row at whichever price the reader has selected, which is why the table moves when the chart is clicked.", "They are averaged across the nine points and reported as the regime''s sensitivity, which is the quantity the progressivity verdict ranks.", "They are discarded, because the chart plots one government share per regime per point."]'::jsonb and answer_index = 3 and explanation = 'Neither chart can tell a reader that a point it plotted came from a project that never paid back, so the totals underneath a point have to be fetched from the ledger.' then 'old'
           when prompt = 'At every swept price the comparison recomputes an NPV, a payback year and an unrecovered pool for every regime. What becomes of them?' and options = '["They are returned inside `sensitivityData` beside the share, which is how a panel draws a second series when a reader asks for one.", "They replace the summary row at whichever price the reader has selected, which is why the table moves when the chart is clicked.", "They are averaged across the nine points and reported as the regime''s sensitivity, which is the quantity the progressivity verdict ranks.", "They are discarded, because the chart plots one government take per regime per point."]'::jsonb and answer_index = 3 and explanation = 'Neither chart can tell a reader that a point it plotted came from a project that never paid back, so the totals underneath a point have to be fetched from the ledger.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 12 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At every swept price the comparison recomputes an NPV, a payback year and an unrecovered pool for every regime. What becomes of them?', options = '["They are returned inside `sensitivityData` beside the share, which is how a panel draws a second series when a reader asks for one.", "They replace the summary row at whichever price the reader has selected, which is why the table moves when the chart is clicked.", "They are averaged across the nine points and reported as the regime''s sensitivity, which is the quantity the progressivity verdict ranks.", "They are discarded, because the chart plots one government take per regime per point."]'::jsonb, explanation = 'Neither chart can tell a reader that a point it plotted came from a project that never paid back, so the totals underneath a point have to be fetched from the ledger.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 12 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 17
  select case
           when prompt = 'Which case does neither sweep cover?' and options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb and answer_index = 0 and explanation = 'The Angola template on the default project at three times capex returns no government share at 40 USD per bbl, where the point is null, and 2223.0766 at 50, and neither chart as drawn would have suggested it.' then 'old'
           when prompt = 'Which case does neither sweep cover?' and options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb and answer_index = 0 and explanation = 'The Angola template on the default project at three times capex returns no government take at 40 USD per bbl, where the point is null, and 2223.0766 at 50, and neither chart as drawn would have suggested it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 17'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 17 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which case does neither sweep cover?', options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb, explanation = 'The Angola template on the default project at three times capex returns no government take at 40 USD per bbl, where the point is null, and 2223.0766 at 50, and neither chart as drawn would have suggested it.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 17 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 19
  select case
           when prompt = 'Which four claims did the Insights tab state that nothing had computed?' and options = '["That the top NPV regime also collected the least for the government, that payback and payout coincide, and two rankings taken from the sweeps.", "That the summary was sorted on four keys at once, so a reader could take any column''s order off the table without reading the column.", "That the top NPV regime also paid back fastest, that the second ranked regime maximised government revenue, and a capex resilience ranking and a price response ranking.", "That every regime pays back, that every IRR is a root, that the effective tax rate is a tax rate, and that the axis labels match the sweeps."]'::jsonb and answer_index = 2 and explanation = 'All four now come from the numbers, and a claim that cannot be supported is omitted rather than guessed.' then 'old'
           when prompt = 'Which four claims did the Insights tab state that nothing had computed?' and options = '["That the top NPV regime also collected the least for the government, that payback and payout coincide, and two rankings taken from the sweeps.", "That the summary was sorted on four keys at once, so a reader could take any column''s order off the table without reading the column.", "That the top NPV regime also paid back fastest, that the second ranked regime maximised government revenue, and a capex resilience ranking and a price response ranking.", "That every regime pays back, that every IRR is a root, that the summary''s percentage column is a tax rate, and that the axis labels match the sweeps."]'::jsonb and answer_index = 2 and explanation = 'All four now come from the numbers, and a claim that cannot be supported is omitted rather than guessed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 19'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 19 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which four claims did the Insights tab state that nothing had computed?', options = '["That the top NPV regime also collected the least for the government, that payback and payout coincide, and two rankings taken from the sweeps.", "That the summary was sorted on four keys at once, so a reader could take any column''s order off the table without reading the column.", "That the top NPV regime also paid back fastest, that the second ranked regime maximised government revenue, and a capex resilience ranking and a price response ranking.", "That every regime pays back, that every IRR is a root, that the summary''s percentage column is a tax rate, and that the axis labels match the sweeps."]'::jsonb, explanation = 'All four now come from the numbers, and a claim that cannot be supported is omitted rather than guessed.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 19 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 33 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'On ODIDI the highest contractor NPV and the largest government take sit in different rows. Which rows, and why is that not a contradiction?' and options = '["Brazil - Concession heads both, and the appearance of a split comes from the effective tax rate column, which is a ratio rather than a total.", "Brazil - Concession at -5.8662 million USD heads the sort while Angola - Deepwater PSC collects 316.7898 at rank 6, because the sort key is discounted and the take column is an undiscounted lifetime total.", "Generic Royalty/Tax heads the sort at -13.3840 million USD while Nigeria - PIA (2021) collects 312.9610 million USD, and the two differ because one of those columns is a percent of revenue and the other is money over the whole life.", "Angola - Deepwater PSC heads both on ODIDI, which is what makes the field a poor one to rehearse a comparison on."]'::jsonb and answer_index = 1 and explanation = 'All six ODIDI NPVs at 12 percent are negative, so the head of the sort is the least bad rather than the good one.' then 'old'
           when prompt = 'On ODIDI the highest contractor NPV and the largest government cash flow sit in different rows. Which rows, and why is that not a contradiction?' and options = '["Brazil - Concession heads both, and the appearance of a split comes from the government share of net revenue column, which is a ratio rather than a total.", "Brazil - Concession at -5.8662 million USD heads the sort while Angola - Deepwater PSC collects 316.7898 at rank 6, because the sort key is discounted and government cash flow is an undiscounted lifetime total.", "Generic Royalty/Tax heads the sort at -13.3840 million USD while Nigeria - PIA (2021) collects 312.9610 million USD, and the two differ because one of those columns is a percent of revenue and the other is money over the whole life.", "Angola - Deepwater PSC heads both on ODIDI, which is what makes the field a poor one to rehearse a comparison on."]'::jsonb and answer_index = 1 and explanation = 'All six ODIDI NPVs at 12 percent are negative, so the head of the sort is the least bad rather than the good one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 33'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 33 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI the highest contractor NPV and the largest government cash flow sit in different rows. Which rows, and why is that not a contradiction?', options = '["Brazil - Concession heads both, and the appearance of a split comes from the government share of net revenue column, which is a ratio rather than a total.", "Brazil - Concession at -5.8662 million USD heads the sort while Angola - Deepwater PSC collects 316.7898 at rank 6, because the sort key is discounted and government cash flow is an undiscounted lifetime total.", "Generic Royalty/Tax heads the sort at -13.3840 million USD while Nigeria - PIA (2021) collects 312.9610 million USD, and the two differ because one of those columns is a percent of revenue and the other is money over the whole life.", "Angola - Deepwater PSC heads both on ODIDI, which is what makes the field a poor one to rehearse a comparison on."]'::jsonb, explanation = 'All six ODIDI NPVs at 12 percent are negative, so the head of the sort is the least bad rather than the good one.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 33 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 36
  select case
           when prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?' and options = '["The regime with the smallest government take, since the tie break falls through to the next column in the summary.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb and answer_index = 2 and explanation = 'Four regimes pay back in year 3 and the sentence names Generic Royalty/Tax, which leads the sort at 397.0445 million USD, so the verdict is the NPV ranking wearing a different label.' then 'old'
           when prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?' and options = '["The regime with the smallest government cash flow, since the tie break falls through to the next column in the summary.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb and answer_index = 2 and explanation = 'Four regimes pay back in year 3 and the sentence names Generic Royalty/Tax, which leads the sort at 397.0445 million USD, so the verdict is the NPV ranking wearing a different label.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 36'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 36 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?', options = '["The regime with the smallest government cash flow, since the tie break falls through to the next column in the summary.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb, explanation = 'Four regimes pay back in year 3 and the sentence names Generic Royalty/Tax, which leads the sort at 397.0445 million USD, so the verdict is the NPV ranking wearing a different label.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 36 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 37
  select case
           when prompt = 'On a comparison where every point of every share series is null and flagged undefined, what does the price verdict return?' and options = '["The regime with the largest government take, since the verdict falls back on the take column whenever no series can be ranked.", "A sentence saying no regime can be ranked across the sweep and that no regime is economic at any swept price.", "A most progressive regime on a climb of 0.0 percentage points, because two nulls subtract to zero like any other pair.", "Nothing at all, since the verdict is omitted in the same way it is for a comparison of one regime."]'::jsonb and answer_index = 1 and explanation = 'On `cmp_never_recovers` all six templates are undefined at all nine prices, so fewer than three swept prices give a share for every regime, and the sentence ends: no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'old'
           when prompt = 'On a comparison where every point of every share series is null and flagged undefined, what does the price verdict return?' and options = '["The regime with the largest government cash flow, since the verdict falls back on the take column whenever no series can be ranked.", "A sentence saying no regime can be ranked across the sweep and that no regime is economic at any swept price.", "A most progressive regime on a climb of 0.0 percentage points, because two nulls subtract to zero like any other pair.", "Nothing at all, since the verdict is omitted in the same way it is for a comparison of one regime."]'::jsonb and answer_index = 1 and explanation = 'On `cmp_never_recovers` all six templates are undefined at all nine prices, so fewer than three swept prices give a share for every regime, and the sentence ends: no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 37'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 37 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On a comparison where every point of every share series is null and flagged undefined, what does the price verdict return?', options = '["The regime with the largest government cash flow, since the verdict falls back on the take column whenever no series can be ranked.", "A sentence saying no regime can be ranked across the sweep and that no regime is economic at any swept price.", "A most progressive regime on a climb of 0.0 percentage points, because two nulls subtract to zero like any other pair.", "Nothing at all, since the verdict is omitted in the same way it is for a comparison of one regime."]'::jsonb, explanation = 'On `cmp_never_recovers` all six templates are undefined at all nine prices, so fewer than three swept prices give a share for every regime, and the sentence ends: no regime is economic at any swept price from 40 to 120 USD per bbl.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 37 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 39
  select case
           when prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?' and options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government share.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb and answer_index = 0 and explanation = 'The most progressive template gives up the least at 84.8591 million USD and the two regressive ones give up 208.0310 and 228.7953, and the orders still differ row for row.' then 'old'
           when prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?' and options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government take.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb and answer_index = 0 and explanation = 'The most progressive template gives up the least at 84.8591 million USD and the two regressive ones give up 208.0310 and 228.7953, and the orders still differ row for row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC2 metric names refused: no row for ec2a_exam ord 39'; end if;
  if v_state = 'other' then raise exception 'EC2 metric names refused: ec2a_exam ord 39 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?', options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government take.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb, explanation = 'The most progressive template gives up the least at 84.8591 million USD and the two regressive ones give up 208.0310 and 228.7953, and the orders still differ row for row.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: ec2a_exam ord 39 updated % rows', v_count; end if;
  end if;

  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC2 metric names refused: beginner holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC2 metric names refused: intermediate holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC2 metric names refused: advanced holds % questions, expected 132', v_count; end if;
end $$;

-- ----------------------------------------------------------------------------
-- Capstone field labels and prompt sentences. Keys, expected values and
-- tolerances are untouched and are compared before and after.
-- ----------------------------------------------------------------------------
do $$
declare
  v_before text;
  v_after  text;
  v_label  text;
  v_prompt text;
  v_count  integer;
begin
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_before
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'fiscal';


  select f->>'label' into v_label
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_psc_effective_tax_rate_pct';
  if v_label is null then raise exception 'EC2 metric names refused: no capstone field advanced cmp_psc_effective_tax_rate_pct'; end if;
  if v_label not in ('Production sharing contract effective tax rate, summary table', 'Production sharing contract government share of net revenue (undiscounted), summary table') then
    raise exception 'EC2 metric names refused: capstone field advanced cmp_psc_effective_tax_rate_pct carries label %, neither published nor new', v_label;
  end if;
  if v_label = 'Production sharing contract effective tax rate, summary table' then
    update public.academy_capstones c
       set fields = (select jsonb_agg(case when e.f->>'key' = 'cmp_psc_effective_tax_rate_pct' then jsonb_set(e.f, '{label}', to_jsonb('Production sharing contract government share of net revenue (undiscounted), summary table'::text)) else e.f end order by e.n)
                       from jsonb_array_elements(c.fields) with ordinality as e(f, n))
     where c.app_slug = 'fiscal' and c.tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: capstone advanced label update touched % rows', v_count; end if;
  end if;

  select f->>'label' into v_label
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_psc_price_sweep_at_60_pct';
  if v_label is null then raise exception 'EC2 metric names refused: no capstone field advanced cmp_psc_price_sweep_at_60_pct'; end if;
  if v_label not in ('Production sharing contract government share at 60 USD/bbl', 'Production sharing contract government take (undiscounted) at 60 USD/bbl') then
    raise exception 'EC2 metric names refused: capstone field advanced cmp_psc_price_sweep_at_60_pct carries label %, neither published nor new', v_label;
  end if;
  if v_label = 'Production sharing contract government share at 60 USD/bbl' then
    update public.academy_capstones c
       set fields = (select jsonb_agg(case when e.f->>'key' = 'cmp_psc_price_sweep_at_60_pct' then jsonb_set(e.f, '{label}', to_jsonb('Production sharing contract government take (undiscounted) at 60 USD/bbl'::text)) else e.f end order by e.n)
                       from jsonb_array_elements(c.fields) with ordinality as e(f, n))
     where c.app_slug = 'fiscal' and c.tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: capstone advanced label update touched % rows', v_count; end if;
  end if;

  select f->>'label' into v_label
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_total_government_take_musd';
  if v_label is null then raise exception 'EC2 metric names refused: no capstone field beginner con_total_government_take_musd'; end if;
  if v_label not in ('Total government take', 'Total government cash flow') then
    raise exception 'EC2 metric names refused: capstone field beginner con_total_government_take_musd carries label %, neither published nor new', v_label;
  end if;
  if v_label = 'Total government take' then
    update public.academy_capstones c
       set fields = (select jsonb_agg(case when e.f->>'key' = 'con_total_government_take_musd' then jsonb_set(e.f, '{label}', to_jsonb('Total government cash flow'::text)) else e.f end order by e.n)
                       from jsonb_array_elements(c.fields) with ordinality as e(f, n))
     where c.app_slug = 'fiscal' and c.tier = 'beginner';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: capstone beginner label update touched % rows', v_count; end if;
  end if;

  select prompt into v_prompt from public.academy_capstones where app_slug = 'fiscal' and tier = 'advanced';
  if position('(2) the PRODUCTION SHARING CONTRACT''s government share of net revenue (undiscounted) as the SUMMARY TABLE reports it, the engine''s effectiveTaxRate key, in percent; (3) the PRODUCTION SHARING CONTRACT''s government take (undiscounted) on the PRICE SWEEP at 60 USD/bbl, in percent;' in v_prompt) = 0 then
    if position('(2) the PRODUCTION SHARING CONTRACT''s effectiveTaxRate as the SUMMARY TABLE reports it, in percent; (3) the PRODUCTION SHARING CONTRACT''s point on the PRICE SWEEP at 60 USD/bbl, in percent;' in v_prompt) = 0 then
      raise exception 'EC2 metric names refused: the advanced capstone prompt carries neither the published nor the new sentence';
    end if;
    update public.academy_capstones
       set prompt = replace(prompt, '(2) the PRODUCTION SHARING CONTRACT''s effectiveTaxRate as the SUMMARY TABLE reports it, in percent; (3) the PRODUCTION SHARING CONTRACT''s point on the PRICE SWEEP at 60 USD/bbl, in percent;', '(2) the PRODUCTION SHARING CONTRACT''s government share of net revenue (undiscounted) as the SUMMARY TABLE reports it, the engine''s effectiveTaxRate key, in percent; (3) the PRODUCTION SHARING CONTRACT''s government take (undiscounted) on the PRICE SWEEP at 60 USD/bbl, in percent;')
     where app_slug = 'fiscal' and tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: advanced capstone prompt update touched % rows', v_count; end if;
  end if;

  select prompt into v_prompt from public.academy_capstones where app_slug = 'fiscal' and tier = 'advanced';
  if position('Fields 2 and 3 are two different ratios of the same government cash flow and they are NOT the same number: government share of net revenue adds TOTAL CAPEX back into contractor take and government take does not, and field 3 is also read at a swept price.' in v_prompt) = 0 then
    if position('Fields 2 and 3 are the same ratio on the same cash flows and they are NOT the same number: the summary adds TOTAL CAPEX back into contractor take and the sweep does not.' in v_prompt) = 0 then
      raise exception 'EC2 metric names refused: the advanced capstone prompt carries neither the published nor the new sentence';
    end if;
    update public.academy_capstones
       set prompt = replace(prompt, 'Fields 2 and 3 are the same ratio on the same cash flows and they are NOT the same number: the summary adds TOTAL CAPEX back into contractor take and the sweep does not.', 'Fields 2 and 3 are two different ratios of the same government cash flow and they are NOT the same number: government share of net revenue adds TOTAL CAPEX back into contractor take and government take does not, and field 3 is also read at a swept price.')
     where app_slug = 'fiscal' and tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: advanced capstone prompt update touched % rows', v_count; end if;
  end if;

  select prompt into v_prompt from public.academy_capstones where app_slug = 'fiscal' and tier = 'beginner';
  if position('(6) the TOTAL government cash flow over the life.' in v_prompt) = 0 then
    if position('(6) the TOTAL government take over the life.' in v_prompt) = 0 then
      raise exception 'EC2 metric names refused: the beginner capstone prompt carries neither the published nor the new sentence';
    end if;
    update public.academy_capstones
       set prompt = replace(prompt, '(6) the TOTAL government take over the life.', '(6) the TOTAL government cash flow over the life.')
     where app_slug = 'fiscal' and tier = 'beginner';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: beginner capstone prompt update touched % rows', v_count; end if;
  end if;

  select prompt into v_prompt from public.academy_capstones where app_slug = 'fiscal' and tier = 'beginner';
  if position('Government cash flow is royalty plus the government profit share plus tax,' in v_prompt) = 0 then
    if position('Government take is royalty plus the government profit share plus tax,' in v_prompt) = 0 then
      raise exception 'EC2 metric names refused: the beginner capstone prompt carries neither the published nor the new sentence';
    end if;
    update public.academy_capstones
       set prompt = replace(prompt, 'Government take is royalty plus the government profit share plus tax,', 'Government cash flow is royalty plus the government profit share plus tax,')
     where app_slug = 'fiscal' and tier = 'beginner';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 metric names refused: beginner capstone prompt update touched % rows', v_count; end if;
  end if;

  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_after
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'fiscal';
  if v_after is distinct from v_before then
    raise exception 'EC2 metric names refused: a capstone key, expected value or tolerance changed';
  end if;
  select count(*) into v_count from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'fiscal';
  if v_count <> 18 then raise exception 'EC2 metric names refused: fiscal capstones carry % fields, expected 18', v_count; end if;
end $$;
