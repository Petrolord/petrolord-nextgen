-- ==========================================================================
-- EC2 RECUT, ASSOCIATE TIER (beginner): Fiscal Regime Design (fiscal)
-- question bank brought to the repaired engines.
--
-- WHY. Engines #183 to #194 (engines main 709172f) repaired the economics
-- the two live Economics courses teach. The live bank was cut against the
-- retired engine, so its moved figures are wrong, some keyed answers assert
-- a rule that no longer holds, and some stems rest on a premise the repair
-- removed. PR #133 moved the capstone answers; this file is the bank.
--
-- WHAT MOVES. 17 of the 132 Associate questions, 5 of them with a
-- changed keyed answer TEXT and 0 with a changed answer INDEX. No ord, no
-- module key, no scope and no row count moves.
-- Fields rewritten: 8 prompt, 9 options, 5 explanation (22 field edits).
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and the tier must still hold
-- 132 questions at the end.
--
-- Every published string below was read from a DUMP OF THE LIVE PRODUCTION
-- ROW, not retyped: see docs/ec12-recut/RECUT-ec2-fiscal-lessons-and-banks.json,
-- whose OLD text was verified character for character against the live table
-- before this file was generated. Generator: scratchpad ec12r/gen_ec12_recut.py.
--
-- SAFE TO RE-RUN. A second run finds every row already carrying the recut
-- text and updates nothing.
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
begin

  -- m01-what-a-fiscal-regime-is ord 7: option_3
  select case
           when prompt = 'On that same 20000 capex case the treasury collects 875.1492 million USD. Which instrument delivered it?' and options = '["The minimum tax, which floors the government at a percent of gross revenue in any year the profit share collapses.", "Royalty alone, since total profit oil and total tax are both 0.0000 million USD there.", "Cost recovery, which hands the unrecovered pool back to the state once the horizon ends without clearing it.", "Resource rent tax charged on the negative cash flow, against the annual capital uplift the tax block carries."]'::jsonb and answer_index = 1 and explanation = 'No abandonment and no economic limit exist to stop the field, so it produces for 25 years and pays royalty on total revenue of 7001.1938 million USD while losing money.' then 'old'
           when prompt = 'On that same 20000 capex case the treasury collects 875.1492 million USD. Which instrument delivered it?' and options = '["The minimum tax, which floors the government at a percent of gross revenue in any year the profit share collapses.", "Royalty alone, since total profit oil and total tax are both 0.0000 million USD there.", "Cost recovery, which hands the unrecovered pool back to the state once the horizon ends without clearing it.", "Resource rent tax charged on the negative cash flow, against the capital uplift the tax block carries."]'::jsonb and answer_index = 1 and explanation = 'No abandonment and no economic limit exist to stop the field, so it produces for 25 years and pays royalty on total revenue of 7001.1938 million USD while losing money.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 7;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-what-a-fiscal-regime-is ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-what-a-fiscal-regime-is ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On that same 20000 capex case the treasury collects 875.1492 million USD. Which instrument delivered it?', options = '["The minimum tax, which floors the government at a percent of gross revenue in any year the profit share collapses.", "Royalty alone, since total profit oil and total tax are both 0.0000 million USD there.", "Cost recovery, which hands the unrecovered pool back to the state once the horizon ends without clearing it.", "Resource rent tax charged on the negative cash flow, against the capital uplift the tax block carries."]'::jsonb, answer_index = 1, explanation = 'No abandonment and no economic limit exist to stop the field, so it produces for 25 years and pays royalty on total revenue of 7001.1938 million USD while losing money.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-fiscal-regime-is' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-what-a-fiscal-regime-is ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-revenue-and-royalty ord 8: prompt
  select case
           when prompt = 'Angola - Deepwater PSC charges a royalty of 0 percent and collects 0.0000 million USD on the default project, yet its contractor keeps 545.1955 million USD against 980.9313 under the Gulf of Mexico terms. Why?' and options = '["Its production is lower, the Angola template being run on a deepwater profile rather than on the Designer''s default project.", "Its royalty is collected later as an additional entitlement, which the template description records and the run applies at the end.", "Its CIT of 25 percent is charged on gross revenue rather than on the contractor profit share, which is the harsher base.", "Its other three fields are hard: cost recovery capped at 50 percent, a tiered profit split, and RRT at 50 percent."]'::jsonb and answer_index = 3 and explanation = 'A low headline rate is not a soft regime. The template with no royalty at all is the harsher of the two here.' then 'old'
           when prompt = 'Angola - Deepwater PSC charges a royalty of 0 percent and collects 0.0000 million USD on the default project, yet its contractor keeps 481.7318 million USD against 980.9313 under the Gulf of Mexico terms. Why?' and options = '["Its production is lower, the Angola template being run on a deepwater profile rather than on the Designer''s default project.", "Its royalty is collected later as an additional entitlement, which the template description records and the run applies at the end.", "Its CIT of 25 percent is charged on gross revenue rather than on the contractor profit share, which is the harsher base.", "Its other three fields are hard: cost recovery capped at 50 percent, a tiered profit split, and RRT at 50 percent."]'::jsonb and answer_index = 3 and explanation = 'A low headline rate is not a soft regime. The template with no royalty at all is the harsher of the two here.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-revenue-and-royalty' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-revenue-and-royalty ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-revenue-and-royalty ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC charges a royalty of 0 percent and collects 0.0000 million USD on the default project, yet its contractor keeps 481.7318 million USD against 980.9313 under the Gulf of Mexico terms. Why?', options = '["Its production is lower, the Angola template being run on a deepwater profile rather than on the Designer''s default project.", "Its royalty is collected later as an additional entitlement, which the template description records and the run applies at the end.", "Its CIT of 25 percent is charged on gross revenue rather than on the contractor profit share, which is the harsher base.", "Its other three fields are hard: cost recovery capped at 50 percent, a tiered profit split, and RRT at 50 percent."]'::jsonb, answer_index = 3, explanation = 'A low headline rate is not a soft regime. The template with no royalty at all is the harsher of the two here.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-revenue-and-royalty' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-revenue-and-royalty ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-concession-ledger ord 2: explanation
  select case
           when prompt = 'Angola recovers cost at a 50 percent limit and closes year 1 of the default project with 395.0083 still in the pool, yet its two takes add to the same -259.0138 as a regime that recovered everything. Why does the unrecovered balance open no gap?' and options = '["The engine writes the shortfall off against the state''s share of profit oil in the same year, so the pair is restored on the government side of the row.", "The limit is taken on revenue after royalty, and royalty sits outside the identity, so the shortfall cancels against the royalty column instead.", "An unrecovered balance is not a cash movement. It stays in the pool and becomes somebody''s profit oil in a later year.", "The contractor is credited with the shortfall as a receivable in the year it arises, and that receivable is carried inside contractor net cash flow."]'::jsonb and answer_index = 2 and explanation = 'Cost recovered plus profit oil is revenue after royalty in every year, so recovery and royalty both cancel out of the sum. Swept over 450 rows the largest disagreement is 1.7053e-13.' then 'old'
           when prompt = 'Angola recovers cost at a 50 percent limit and closes year 1 of the default project with 395.0083 still in the pool, yet its two takes add to the same -259.0138 as a regime that recovered everything. Why does the unrecovered balance open no gap?' and options = '["The engine writes the shortfall off against the state''s share of profit oil in the same year, so the pair is restored on the government side of the row.", "The limit is taken on revenue after royalty, and royalty sits outside the identity, so the shortfall cancels against the royalty column instead.", "An unrecovered balance is not a cash movement. It stays in the pool and becomes somebody''s profit oil in a later year.", "The contractor is credited with the shortfall as a receivable in the year it arises, and that receivable is carried inside contractor net cash flow."]'::jsonb and answer_index = 2 and explanation = 'Cost recovered plus profit oil is revenue after royalty in every year, so recovery and royalty both cancel out of the sum. Swept over 450 rows the largest disagreement is 1.1369e-13.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-concession-ledger ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola recovers cost at a 50 percent limit and closes year 1 of the default project with 395.0083 still in the pool, yet its two takes add to the same -259.0138 as a regime that recovered everything. Why does the unrecovered balance open no gap?', options = '["The engine writes the shortfall off against the state''s share of profit oil in the same year, so the pair is restored on the government side of the row.", "The limit is taken on revenue after royalty, and royalty sits outside the identity, so the shortfall cancels against the royalty column instead.", "An unrecovered balance is not a cash movement. It stays in the pool and becomes somebody''s profit oil in a later year.", "The contractor is credited with the shortfall as a receivable in the year it arises, and that receivable is carried inside contractor net cash flow."]'::jsonb, answer_index = 2, explanation = 'Cost recovered plus profit oil is revenue after royalty in every year, so recovery and royalty both cancel out of the sum. Swept over 450 rows the largest disagreement is 1.1369e-13.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-concession-ledger ord 11: explanation, prompt
  select case
           when prompt = 'Two published runs share a revenue of 7001.1938 and a profit oil of 3523.7229 and collect life tax of 1638.5664 and 2607.5549. What is different between them?' and options = '["One arms the minimum tax at 10 percent of gross revenue while the other leaves it at 0, which changes the years in which the stack binds.", "One leaves the resource rent tax uplift unstated, which takes the default of 20 percent, and the other sets it to 0.", "One runs the Brazil resource rent rate of 40 percent and the other the Angola rate of 50 percent, on the same contractor profit share.", "One recovers cost at 100 percent and the other at 70 percent, which moves the residual."]'::jsonb and answer_index = 1 and explanation = 'A setting nobody typed moved the life tax from 2607.5549 to 1638.5664, which is why an unstated field is read as carefully as a rate.' then 'old'
           when prompt = 'Two published runs share a revenue of 7001.1938 and a profit oil of 3523.7229 and collect life tax of 2127.5549 and 2207.5549. What is different between them?' and options = '["One arms the minimum tax at 10 percent of gross revenue while the other leaves it at 0, which changes the years in which the stack binds.", "One leaves the resource rent tax uplift unstated, which takes the default of 20 percent, and the other sets it to 0.", "One runs the Brazil resource rent rate of 40 percent and the other the Angola rate of 50 percent, on the same contractor profit share.", "One recovers cost at 100 percent and the other at 70 percent, which moves the residual."]'::jsonb and answer_index = 1 and explanation = 'A setting nobody typed moved the life tax from 2207.5549 to 2127.5549, which is why an unstated field is read as carefully as a rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-concession-ledger ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two published runs share a revenue of 7001.1938 and a profit oil of 3523.7229 and collect life tax of 2127.5549 and 2207.5549. What is different between them?', options = '["One arms the minimum tax at 10 percent of gross revenue while the other leaves it at 0, which changes the years in which the stack binds.", "One leaves the resource rent tax uplift unstated, which takes the default of 20 percent, and the other sets it to 0.", "One runs the Brazil resource rent rate of 40 percent and the other the Angola rate of 50 percent, on the same contractor profit share.", "One recovers cost at 100 percent and the other at 70 percent, which moves the residual."]'::jsonb, answer_index = 1, explanation = 'A setting nobody typed moved the life tax from 2207.5549 to 2127.5549, which is why an unstated field is read as carefully as a rate.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-concession-ledger ord 15: prompt
  select case
           when prompt = 'Angola charges no royalty at all and collects 1200.2886 on the default project, while the Gulf of Mexico terms charge 18.75 percent and collect 764.5528. Which instruments carry the Angola collection?' and options = '["A 50 percent recovery limit, a tiered split that leaves part of the residual with the state, and resource rent tax at 50 percent.", "A corporate income tax of 25 percent charged on gross revenue rather than on the contractor''s share of the residual.", "A minimum tax that binds in each year where the residual is too small for the ordinary rate to reach.", "A wider revenue base, because a regime that waives its royalty leaves more of the field''s sales to be divided."]'::jsonb and answer_index = 0 and explanation = 'Total revenue is 2686.9277 under every template on this project, so the whole of the difference is instrument.' then 'old'
           when prompt = 'Angola charges no royalty at all and collects 1263.7523 on the default project, while the Gulf of Mexico terms charge 18.75 percent and collect 764.5528. Which instruments carry the Angola collection?' and options = '["A 50 percent recovery limit, a tiered split that leaves part of the residual with the state, and resource rent tax at 50 percent.", "A corporate income tax of 25 percent charged on gross revenue rather than on the contractor''s share of the residual.", "A minimum tax that binds in each year where the residual is too small for the ordinary rate to reach.", "A wider revenue base, because a regime that waives its royalty leaves more of the field''s sales to be divided."]'::jsonb and answer_index = 0 and explanation = 'Total revenue is 2686.9277 under every template on this project, so the whole of the difference is instrument.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-concession-ledger ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola charges no royalty at all and collects 1263.7523 on the default project, while the Gulf of Mexico terms charge 18.75 percent and collect 764.5528. Which instruments carry the Angola collection?', options = '["A 50 percent recovery limit, a tiered split that leaves part of the residual with the state, and resource rent tax at 50 percent.", "A corporate income tax of 25 percent charged on gross revenue rather than on the contractor''s share of the residual.", "A minimum tax that binds in each year where the residual is too small for the ordinary rate to reach.", "A wider revenue base, because a regime that waives its royalty leaves more of the field''s sales to be divided."]'::jsonb, answer_index = 0, explanation = 'Total revenue is 2686.9277 under every template on this project, so the whole of the difference is instrument.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-concession-ledger' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-concession-ledger ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-reading-the-ledger ord 5: explanation, option_0, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A published case caps cost recovery at 5 percent, closes the life with 2543.7575 still unrecovered, and is named for a pool that never recovers. What does it report for payback?' and options = '["No payback at all, with an IRR of 0, since a pool that never clears is a project that never returns its capital.", "Payback in year 3, with an IRR of 54.6792 percent and a life contractor total of 1530.0622.", "Payback in year 3 on a life total of 1530.0622, but with the IRR suppressed to 0 because the pool never closed.", "No payback, because the engine reports payback only once the closing unrecovered pool has reached 0.0000."]'::jsonb and answer_index = 1 and explanation = 'The revenue the limit could not recover became profit oil, and this regime splits profit oil 100 percent to the contractor, so the capital came home through the profit share.' then 'old'
           when prompt = 'A published case caps cost recovery at 5 percent, closes the life with 2543.7575 still unrecovered, and is named for a pool that never recovers. What does it report for payback?' and options = '["No payback at all, and an IRR of 0, on the reasoning that a cost pool which never clears is capital that never comes home to the contractor.", "Payback in year 3, with no single IRR because its NPV is zero at 54.6792 percent and again at -14.2614 percent.", "Payback in year 3 on a life total of 1530.0622, but with the IRR suppressed to 0 because the pool never closed.", "No payback, because the engine reports payback only once the closing unrecovered pool has reached 0.0000."]'::jsonb and answer_index = 1 and explanation = 'The revenue the limit could not recover became profit oil, and this regime splits profit oil 100 percent to the contractor, so the capital came home through the profit share on a life total of 1530.0622.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-reading-the-ledger ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published case caps cost recovery at 5 percent, closes the life with 2543.7575 still unrecovered, and is named for a pool that never recovers. What does it report for payback?', options = '["No payback at all, and an IRR of 0, on the reasoning that a cost pool which never clears is capital that never comes home to the contractor.", "Payback in year 3, with no single IRR because its NPV is zero at 54.6792 percent and again at -14.2614 percent.", "Payback in year 3 on a life total of 1530.0622, but with the IRR suppressed to 0 because the pool never closed.", "No payback, because the engine reports payback only once the closing unrecovered pool has reached 0.0000."]'::jsonb, answer_index = 1, explanation = 'The revenue the limit could not recover became profit oil, and this regime splits profit oil 100 percent to the contractor, so the capital came home through the profit share on a life total of 1530.0622.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-reading-the-ledger ord 6: option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Four of the six templates report payback in year 3 on the default project. Why is that a poor place to rank them?' and options = '["Payback is measured on the discounted cumulative, and the discounting compresses the differences between the templates into one year.", "Payback is measured from the R factor, which is a ratio of cumulatives and moves too little between templates to separate them.", "Payback is a whole year, so a tie in the column is not a tie in the money: the same year 3 covers 986.7327 under Generic and 912.1029 under Brazil.", "Payback is reported to the nearest year and the engine rounds up, so four templates that really differ are printed as the same year."]'::jsonb and answer_index = 2 and explanation = 'It is an integer clock on an undiscounted running sum, and it has no view of anything that happens after the crossing.' then 'old'
           when prompt = 'Four of the six templates report payback in year 3 on the default project. Why is that a poor place to rank them?' and options = '["Payback is measured on the discounted cumulative, and the discounting compresses the differences between the templates into one year.", "Payback is measured from the R factor, which is a ratio of cumulatives and moves too little between templates to separate them.", "Payback is a whole year, so a tie in the column is not a tie in the money: the same year 3 covers 986.7327 under Generic and 623.9658 under Brazil.", "Payback is reported to the nearest year and the engine rounds up, so four templates that really differ are printed as the same year."]'::jsonb and answer_index = 2 and explanation = 'It is an integer clock on an undiscounted running sum, and it has no view of anything that happens after the crossing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-reading-the-ledger ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Four of the six templates report payback in year 3 on the default project. Why is that a poor place to rank them?', options = '["Payback is measured on the discounted cumulative, and the discounting compresses the differences between the templates into one year.", "Payback is measured from the R factor, which is a ratio of cumulatives and moves too little between templates to separate them.", "Payback is a whole year, so a tie in the column is not a tie in the money: the same year 3 covers 986.7327 under Generic and 623.9658 under Brazil.", "Payback is reported to the nearest year and the engine rounds up, so four templates that really differ are printed as the same year."]'::jsonb, answer_index = 2, explanation = 'It is an integer clock on an undiscounted running sum, and it has no view of anything that happens after the crossing.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-reading-the-ledger ord 9: prompt
  select case
           when prompt = 'Brazil pays the most tax of the six templates on the default project at 564.6884 and leaves the contractor 912.1029, the second highest figure in the table. What does that show?' and options = '["That the tax column is charged on gross revenue under Brazil and on the profit share under the other five, so the two are not comparable.", "Tax and take rank differently, because the state also collects through royalty and through its share of profit oil.", "That the resource rent tax of 40 percent is refunded to the contractor through the cost pool, which is why the cash survives the tax.", "That a high tax bill signals a high residual, so the contractor''s cash and the tax column will normally move together across templates."]'::jsonb and answer_index = 1 and explanation = 'PIA pays the least tax of the six, 174.0882, and leaves the contractor the least cash, 406.2057.' then 'old'
           when prompt = 'Brazil pays the most tax of the six templates on the default project at 852.8256 and leaves the contractor 623.9658, the third highest figure in the table. What does that show?' and options = '["That the tax column is charged on gross revenue under Brazil and on the profit share under the other five, so the two are not comparable.", "Tax and take rank differently, because the state also collects through royalty and through its share of profit oil.", "That the resource rent tax of 40 percent is refunded to the contractor through the cost pool, which is why the cash survives the tax.", "That a high tax bill signals a high residual, so the contractor''s cash and the tax column will normally move together across templates."]'::jsonb and answer_index = 1 and explanation = 'PIA pays the least tax of the six, 174.0882, and leaves the contractor the least cash, 406.2057.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-reading-the-ledger ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Brazil pays the most tax of the six templates on the default project at 852.8256 and leaves the contractor 623.9658, the third highest figure in the table. What does that show?', options = '["That the tax column is charged on gross revenue under Brazil and on the profit share under the other five, so the two are not comparable.", "Tax and take rank differently, because the state also collects through royalty and through its share of profit oil.", "That the resource rent tax of 40 percent is refunded to the contractor through the cost pool, which is why the cash survives the tax.", "That a high tax bill signals a high residual, so the contractor''s cash and the tax column will normally move together across templates."]'::jsonb, answer_index = 1, explanation = 'PIA pays the least tax of the six, 174.0882, and leaves the contractor the least cash, 406.2057.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-reading-the-ledger ord 14: prompt
  select case
           when prompt = 'Across the swept capex range on ODIDI, Ghana gives up 150.9021 of contractor value and Angola gives up 215.1075. What does that difference measure?' and options = '["Which regime has the higher capex, since the sweep moves each template''s own spend by its own multiplier before the ledgers are run.", "Which regime discounts the overrun hardest, since the value given up is a present value.", "Which regime makes the contractor carry more of a cost overrun, which is decided by the instruments that recover cost.", "Which regime has the larger tax base, since an overrun is deducted from tax in the year it is spent."]'::jsonb and answer_index = 2 and explanation = 'One ledger at one capex never asks the question, and the cost columns themselves are identical under all six templates.' then 'old'
           when prompt = 'Across the swept capex range on ODIDI, Ghana gives up 181.1922 of contractor value and Angola gives up 252.6075. What does that difference measure?' and options = '["Which regime has the higher capex, since the sweep moves each template''s own spend by its own multiplier before the ledgers are run.", "Which regime discounts the overrun hardest, since the value given up is a present value.", "Which regime makes the contractor carry more of a cost overrun, which is decided by the instruments that recover cost.", "Which regime has the larger tax base, since an overrun is deducted from tax in the year it is spent."]'::jsonb and answer_index = 2 and explanation = 'One ledger at one capex never asks the question, and the cost columns themselves are identical under all six templates.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-reading-the-ledger ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Across the swept capex range on ODIDI, Ghana gives up 181.1922 of contractor value and Angola gives up 252.6075. What does that difference measure?', options = '["Which regime has the higher capex, since the sweep moves each template''s own spend by its own multiplier before the ledgers are run.", "Which regime discounts the overrun hardest, since the value given up is a present value.", "Which regime makes the contractor carry more of a cost overrun, which is decided by the instruments that recover cost.", "Which regime has the larger tax base, since an overrun is deducted from tax in the year it is spent."]'::jsonb, answer_index = 2, explanation = 'One ledger at one capex never asks the question, and the cost columns themselves are identical under all six templates.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-reading-the-ledger' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-reading-the-ledger ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-associate-reading ord 5: option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ODIDI under Brazil returns the contractor 192.9896 over 25 years, the most of the six templates, and a value of -5.8662 at the project''s 12 percent. How can both be true?' and options = '["The value is computed on the government''s cash flows rather than the contractor''s, which is why it carries the opposite sign.", "The internal rate is 11.4055 percent, which is under the 12 percent the project is discounted at, so positive nominal cash is still worth less than nothing today.", "The 192.9896 is a total of undiscounted rows and the value excludes the capex, so the two are not readings of the same ledger.", "The closing unrecovered pool of 19.3270 is subtracted in the value and not in the total, and that is the whole of the difference."]'::jsonb and answer_index = 1 and explanation = 'Same rows, two verdicts. Every one of the six templates closes ODIDI''s cumulative in the black and returns a negative value at 12 percent.' then 'old'
           when prompt = 'ODIDI under Brazil returns the contractor 192.9896 over 25 years, the most of the six templates, and a value of -5.8662 at the project''s 12 percent. How can both be true?' and options = '["The value is computed on the government''s cash flows rather than the contractor''s, which is why it carries the opposite sign.", "The total adds 25 undiscounted rows and the value discounts each of them, and at 12 percent the year 1 capex outweighs cash that arrives late, so positive nominal cash is still worth less than nothing today.", "The 192.9896 is a total of undiscounted rows and the value excludes the capex, so the two are not readings of the same ledger.", "The closing unrecovered pool of 19.3270 is subtracted in the value and not in the total, and that is the whole of the difference."]'::jsonb and answer_index = 1 and explanation = 'Same rows, two verdicts. Every one of the six templates closes ODIDI''s cumulative in the black and returns a negative value at 12 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-associate-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-associate-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ODIDI under Brazil returns the contractor 192.9896 over 25 years, the most of the six templates, and a value of -5.8662 at the project''s 12 percent. How can both be true?', options = '["The value is computed on the government''s cash flows rather than the contractor''s, which is why it carries the opposite sign.", "The total adds 25 undiscounted rows and the value discounts each of them, and at 12 percent the year 1 capex outweighs cash that arrives late, so positive nominal cash is still worth less than nothing today.", "The 192.9896 is a total of undiscounted rows and the value excludes the capex, so the two are not readings of the same ledger.", "The closing unrecovered pool of 19.3270 is subtracted in the value and not in the total, and that is the whole of the difference."]'::jsonb, answer_index = 1, explanation = 'Same rows, two verdicts. Every one of the six templates closes ODIDI''s cumulative in the black and returns a negative value at 12 percent.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-associate-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-associate-reading ord 15: explanation, prompt
  select case
           when prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 1638.5664, where the run that sets it to 0 collects 2607.5549. What is the habit that catches this?' and options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government cash flow rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb and answer_index = 3 and explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed moved the tax by that much.' then 'old'
           when prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 2127.5549, where the run that sets it to 0 collects 2207.5549. What is the habit that catches this?' and options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government cash flow rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb and answer_index = 3 and explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed decided which of the two figures the run reported.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-associate-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-associate-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published run leaves the resource rent tax uplift unstated and collects life tax of 2127.5549, where the run that sets it to 0 collects 2207.5549. What is the habit that catches this?', options = '["Compare the two tax columns row by row, since a difference of this size is always visible in the first year of a life of 25 rows.", "Rank the templates by their headline corporate rate first, which is the field the two runs actually differ in.", "Total the government cash flow rather than the tax, because the take is the only column a default setting cannot move.", "Read what the regime does not state as carefully as what it does, because an unstated field takes a default of 20 percent."]'::jsonb, answer_index = 3, explanation = 'Both runs share a revenue of 7001.1938 and a profit oil of 3523.7229, so a number nobody typed decided which of the two figures the run reported.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-associate-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 10: option_0
  select case
           when prompt = 'The capex multiplier on the flat regime moves the test project NPV from 1262.3470 to 1062.6176 at 1.3 and to 1460.6941 at 0.7. What does it not do?' and options = '["Move the IRR, which stays at 124.5777 percent because the multiplier scales the cash flows in proportion.", "Phase the spend, because every dollar of capex is charged in year 1 whatever the multiplier is.", "Change the recoverable pool, since the pool is seeded from the revenue side and not from the capex.", "Alter the royalty, which is the one column the multiplier is allowed to reach through gross revenue."]'::jsonb and answer_index = 1 and explanation = 'Faking a schedule by lowering the multiplier changes the total rather than the timing, and answers a different question.' then 'old'
           when prompt = 'The capex multiplier on the flat regime moves the test project NPV from 1262.3470 to 1062.6176 at 1.3 and to 1460.6941 at 0.7. What does it not do?' and options = '["Move the internal rate of return, which the engine reports unchanged because the multiplier scales the cash flows in proportion.", "Phase the spend, because every dollar of capex is charged in year 1 whatever the multiplier is.", "Change the recoverable pool, since the pool is seeded from the revenue side and not from the capex.", "Alter the royalty, which is the one column the multiplier is allowed to reach through gross revenue."]'::jsonb and answer_index = 1 and explanation = 'Faking a schedule by lowering the multiplier changes the total rather than the timing, and answers a different question.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex multiplier on the flat regime moves the test project NPV from 1262.3470 to 1062.6176 at 1.3 and to 1460.6941 at 0.7. What does it not do?', options = '["Move the internal rate of return, which the engine reports unchanged because the multiplier scales the cash flows in proportion.", "Phase the spend, because every dollar of capex is charged in year 1 whatever the multiplier is.", "Change the recoverable pool, since the pool is seeded from the revenue side and not from the capex.", "Alter the royalty, which is the one column the multiplier is allowed to reach through gross revenue."]'::jsonb, answer_index = 1, explanation = 'Faking a schedule by lowering the multiplier changes the total rather than the timing, and answers a different question.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 17: prompt
  select case
           when prompt = 'Angola collects total royalty of 0.0000 on the default project and still leaves the contractor 545.1955, against 980.9313 under the Gulf of Mexico terms at 18.75 percent. Which fields make Angola the harsher regime?' and options = '["Its corporate income tax of 25 percent, which is charged on gross revenue rather than on the profit share.", "Its minimum tax, which binds in the years when the contractor''s residual is too small to reach.", "Its cost recovery limit of 50 percent, its tiered split, and resource rent tax at 50 percent.", "Its royalty of 0 percent, which leaves a larger base for the tax stack to be charged on."]'::jsonb and answer_index = 2 and explanation = 'A regime cannot be ranked by the instrument its press release quotes. Total revenue is 2686.9277 under both.' then 'old'
           when prompt = 'Angola collects total royalty of 0.0000 on the default project and still leaves the contractor 481.7318, against 980.9313 under the Gulf of Mexico terms at 18.75 percent. Which fields make Angola the harsher regime?' and options = '["Its corporate income tax of 25 percent, which is charged on gross revenue rather than on the profit share.", "Its minimum tax, which binds in the years when the contractor''s residual is too small to reach.", "Its cost recovery limit of 50 percent, its tiered split, and resource rent tax at 50 percent.", "Its royalty of 0 percent, which leaves a larger base for the tax stack to be charged on."]'::jsonb and answer_index = 2 and explanation = 'A regime cannot be ranked by the instrument its press release quotes. Total revenue is 2686.9277 under both.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 17'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola collects total royalty of 0.0000 on the default project and still leaves the contractor 481.7318, against 980.9313 under the Gulf of Mexico terms at 18.75 percent. Which fields make Angola the harsher regime?', options = '["Its corporate income tax of 25 percent, which is charged on gross revenue rather than on the profit share.", "Its minimum tax, which binds in the years when the contractor''s residual is too small to reach.", "Its cost recovery limit of 50 percent, its tiered split, and resource rent tax at 50 percent.", "Its royalty of 0 percent, which leaves a larger base for the tax stack to be charged on."]'::jsonb, answer_index = 2, explanation = 'A regime cannot be ranked by the instrument its press release quotes. Total revenue is 2686.9277 under both.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 19: explanation
  select case
           when prompt = 'Which statement about the contractor and government columns holds in every year, for every one of the six templates, at every cost recovery limit they use?' and options = '["Added together they equal gross revenue, since every dollar sold is assigned to one side or the other.", "Added together they equal gross revenue less opex less capex only while the cost recovery limit is not binding.", "Added together they equal gross revenue less opex less capex, less whatever moved into the unrecovered pool that year.", "Added together they equal gross revenue less opex less capex."]'::jsonb and answer_index = 3 and explanation = 'Swept across all six templates on all three projects, 450 rows, the largest disagreement between the two sums is 1.7053e-13.' then 'old'
           when prompt = 'Which statement about the contractor and government columns holds in every year, for every one of the six templates, at every cost recovery limit they use?' and options = '["Added together they equal gross revenue, since every dollar sold is assigned to one side or the other.", "Added together they equal gross revenue less opex less capex only while the cost recovery limit is not binding.", "Added together they equal gross revenue less opex less capex, less whatever moved into the unrecovered pool that year.", "Added together they equal gross revenue less opex less capex."]'::jsonb and answer_index = 3 and explanation = 'Swept across all six templates on all three projects, 450 rows, the largest disagreement between the two sums is 1.1369e-13.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 19'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 19 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which statement about the contractor and government columns holds in every year, for every one of the six templates, at every cost recovery limit they use?', options = '["Added together they equal gross revenue, since every dollar sold is assigned to one side or the other.", "Added together they equal gross revenue less opex less capex only while the cost recovery limit is not binding.", "Added together they equal gross revenue less opex less capex, less whatever moved into the unrecovered pool that year.", "Added together they equal gross revenue less opex less capex."]'::jsonb, answer_index = 3, explanation = 'Swept across all six templates on all three projects, 450 rows, the largest disagreement between the two sums is 1.1369e-13.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 19 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 26: option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Profit oil under the Gulf of Mexico terms totals 1241.6852 over the life of the default project, the smallest of the six templates, while Angola''s totals 1745.4841, the largest. Which regime returns the contractor more?' and options = '["The Gulf of Mexico terms, at 980.9313 against 545.1955, because the residual is not the contractor''s cash.", "Angola, since a larger residual is the pool that a tiered split draws from, and its first tier hands the contractor 70 percent.", "Angola, because its royalty of 0 percent leaves the whole of the top line inside the ledger.", "Neither, because the two are equal once the closing unrecovered pool has been added back to the contractor."]'::jsonb and answer_index = 0 and explanation = 'Royalty and the recovery limit sit upstream of the residual, so a bigger residual can mean a harsher regime rather than a kinder one.' then 'old'
           when prompt = 'Profit oil under the Gulf of Mexico terms totals 1241.6852 over the life of the default project, the smallest of the six templates, while Angola''s totals 1745.4841, the largest. Which regime returns the contractor more?' and options = '["The Gulf of Mexico terms, at 980.9313 against 481.7318, because the residual is not the contractor''s cash.", "Angola, since a larger residual is the pool that a tiered split draws from, and its first tier hands the contractor 70 percent.", "Angola, because its royalty of 0 percent leaves the whole of the top line inside the ledger.", "Neither, because the two are equal once the closing unrecovered pool has been added back to the contractor."]'::jsonb and answer_index = 0 and explanation = 'Royalty and the recovery limit sit upstream of the residual, so a bigger residual can mean a harsher regime rather than a kinder one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 26'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Profit oil under the Gulf of Mexico terms totals 1241.6852 over the life of the default project, the smallest of the six templates, while Angola''s totals 1745.4841, the largest. Which regime returns the contractor more?', options = '["The Gulf of Mexico terms, at 980.9313 against 481.7318, because the residual is not the contractor''s cash.", "Angola, since a larger residual is the pool that a tiered split draws from, and its first tier hands the contractor 70 percent.", "Angola, because its royalty of 0 percent leaves the whole of the top line inside the ledger.", "Neither, because the two are equal once the closing unrecovered pool has been added back to the contractor."]'::jsonb, answer_index = 0, explanation = 'Royalty and the recovery limit sit upstream of the residual, so a bigger residual can mean a harsher regime rather than a kinder one.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 28: option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A case named for a cost pool that never recovers closes the life with 2543.7575 unrecovered. Which readings of it are the ones its own numbers support?' and options = '["No payback and an IRR of 0, since a pool that never clears is capital that never comes home.", "Payback in year 3 and an IRR of 0, because the engine suppresses a rate whenever the pool is still open.", "No payback and an IRR of 54.6792 percent, since a positive rate can be reported without a crossing.", "Payback in year 3, payout in year 2 and an IRR of 54.6792 percent, on a life contractor total of 1530.0622."]'::jsonb and answer_index = 3 and explanation = 'At a 5 percent limit almost nothing comes back as cost oil, but the revenue that cannot be recovered becomes profit oil, and this regime splits it 100 percent to the contractor.' then 'old'
           when prompt = 'A case named for a cost pool that never recovers closes the life with 2543.7575 unrecovered. Which readings of it are the ones its own numbers support?' and options = '["No payback and an IRR of 0, since a pool that never clears is capital that never comes home.", "Payback in year 3 and an IRR of 0, because the engine suppresses a rate whenever the pool is still open.", "No payback and an IRR of 54.6792 percent, since a positive rate can be reported without a crossing.", "Payback in year 3, payout in year 2 and no single IRR, its NPV being zero at 54.6792 percent and again at -14.2614 percent, on a life contractor total of 1530.0622."]'::jsonb and answer_index = 3 and explanation = 'At a 5 percent limit almost nothing comes back as cost oil, but the revenue that cannot be recovered becomes profit oil, and this regime splits it 100 percent to the contractor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 28'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A case named for a cost pool that never recovers closes the life with 2543.7575 unrecovered. Which readings of it are the ones its own numbers support?', options = '["No payback and an IRR of 0, since a pool that never clears is capital that never comes home.", "Payback in year 3 and an IRR of 0, because the engine suppresses a rate whenever the pool is still open.", "No payback and an IRR of 54.6792 percent, since a positive rate can be reported without a crossing.", "Payback in year 3, payout in year 2 and no single IRR, its NPV being zero at 54.6792 percent and again at -14.2614 percent, on a life contractor total of 1530.0622."]'::jsonb, answer_index = 3, explanation = 'At a 5 percent limit almost nothing comes back as cost oil, but the revenue that cannot be recovered becomes profit oil, and this regime splits it 100 percent to the contractor.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 40: option_3, prompt
  select case
           when prompt = 'ODIDI under Brazil returns 192.9896 of contractor cash over 25 years and a value of -5.8662 at 12 percent, on an internal rate of 11.4055 percent. Which reading is wrong?' and options = '["The value, because a life that returns positive cash cannot be worth less than nothing.", "Neither. Both are readings of the same 25 rows, and the Associate answer quotes each with its basis.", "The total, because it adds year 25 money to year 1 money and so overstates what came back.", "The internal rate, because a rate below the discount rate cannot be reported alongside a positive total."]'::jsonb and answer_index = 1 and explanation = 'Which of the two a decision rests on takes a discount convention, and every one of the six templates on ODIDI shows the same pair of signs.' then 'old'
           when prompt = 'ODIDI under Brazil returns 192.9896 of contractor cash over 25 years and a value of -5.8662 at 12 percent. Which reading is wrong?' and options = '["The value, because a life that returns positive cash cannot be worth less than nothing.", "Neither. Both are readings of the same 25 rows, and the Associate answer quotes each with its basis.", "The total, because it adds year 25 money to year 1 money and so overstates what came back.", "The pair, because a total and a value that disagree in sign cannot both be readings of one ledger."]'::jsonb and answer_index = 1 and explanation = 'Which of the two a decision rests on takes a discount convention, and every one of the six templates on ODIDI shows the same pair of signs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 40'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ODIDI under Brazil returns 192.9896 of contractor cash over 25 years and a value of -5.8662 at 12 percent. Which reading is wrong?', options = '["The value, because a life that returns positive cash cannot be worth less than nothing.", "Neither. Both are readings of the same 25 rows, and the Associate answer quotes each with its basis.", "The total, because it adds year 25 money to year 1 money and so overstates what came back.", "The pair, because a total and a value that disagree in sign cannot both be readings of one ledger."]'::jsonb, answer_index = 1, explanation = 'Which of the two a decision rests on takes a discount convention, and every one of the six templates on ODIDI shows the same pair of signs.'
     where app_slug = 'fiscal' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- --------------------------------------------- the tier assertions --
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC2 recut refused: the Associate tier holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'beginner' and not active;
  if v_count <> 0 then raise exception 'EC2 recut refused: % Associate question(s) are inactive', v_count; end if;

  select count(*) into v_count from (
    select scope, module_key, count(*) as n from public.academy_quiz_questions
     where app_slug = 'fiscal' and tier = 'beginner' group by 1, 2
  ) b where (b.scope = 'module' and b.n <> 15) or (b.scope = 'final' and b.n <> 42);
  if v_count <> 0 then raise exception 'EC2 recut refused: % Associate bank(s) are not 15 (module) or 42 (final)', v_count; end if;

  -- Every option array is still four options and every key still points
  -- inside it: a rewritten options array that lost an entry would grade
  -- an answer that is no longer there.
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'beginner'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index >= jsonb_array_length(options));
  if v_count <> 0 then raise exception 'EC2 recut refused: % Associate question(s) have a bad option array or key index', v_count; end if;

  raise notice 'EC2 recut beginner: % of 17 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-what-a-fiscal-regime-is', 7),
    ('module', 'm03-revenue-and-royalty', 8),
    ('module', 'm04-the-concession-ledger', 2),
    ('module', 'm04-the-concession-ledger', 11),
    ('module', 'm04-the-concession-ledger', 15),
    ('module', 'm05-reading-the-ledger', 5),
    ('module', 'm05-reading-the-ledger', 6),
    ('module', 'm05-reading-the-ledger', 9),
    ('module', 'm05-reading-the-ledger', 14),
    ('module', 'm06-the-associate-reading', 5),
    ('module', 'm06-the-associate-reading', 15),
    ('final', null::text, 10),
    ('final', null::text, 17),
    ('final', null::text, 19),
    ('final', null::text, 26),
    ('final', null::text, 28),
    ('final', null::text, 40)
)
select 'ec2 recut beginner' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       q.answer_index,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fiscal' and q.tier = 'beginner'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec2 recut beginner' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fiscal' and tier = 'beginner'
 group by scope, module_key
 order by scope desc, module_key nulls last;
