-- ==========================================================================
-- EC1 RECUT, ASSOCIATE TIER (beginner): Cash Flow & NPV (cashflow)
-- question bank brought to the repaired engines.
--
-- WHY. Engines #183 to #194 (engines main 709172f) repaired the economics
-- the two live Economics courses teach. The live bank was cut against the
-- retired engine, so its moved figures are wrong, some keyed answers assert
-- a rule that no longer holds, and some stems rest on a premise the repair
-- removed. PR #133 moved the capstone answers; this file is the bank.
--
-- WHAT MOVES. 9 of the 132 Associate questions, 6 of them with a
-- changed keyed answer TEXT and 0 with a changed answer INDEX. No ord, no
-- module key, no scope and no row count moves.
-- Fields rewritten: 5 prompt, 20 options, 7 explanation (32 field edits).
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and the tier must still hold
-- 132 questions at the end.
--
-- Every published string below was read from a DUMP OF THE LIVE PRODUCTION
-- ROW, not retyped: see docs/ec12-recut/RECUT-ec1-cashflow-lessons-and-banks.json,
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

  -- m01-what-a-cash-flow-is ord 5: prompt
  select case
           when prompt = 'What does the Petroleum Economics Studio engine, version 3.9.0, read before it builds a ledger?' and options = '["Three uploaded files, production, capex and opex, and a configuration carrying prices, escalators, inflation and fiscal terms; nothing else.", "A production file, a reservoir decline model and a facilities capacity file, from which it checks the volumes before believing them.", "A single combined spreadsheet of volumes and costs, with the price taken from the deck by default when the configuration is blank.", "The three files and a well log, which fixes the boe conversion for the field."]'::jsonb and answer_index = 0 and explanation = 'If the volumes are wrong the ledger is wrong, and the engine has no way to know: no reservoir, no facilities capacity, no decline.' then 'old'
           when prompt = 'What does the Petroleum Economics Studio engine, version 3.10.0, read before it builds a ledger?' and options = '["Three uploaded files, production, capex and opex, and a configuration carrying prices, escalators, inflation and fiscal terms; nothing else.", "A production file, a reservoir decline model and a facilities capacity file, from which it checks the volumes before believing them.", "A single combined spreadsheet of volumes and costs, with the price taken from the deck by default when the configuration is blank.", "The three files and a well log, which fixes the boe conversion for the field."]'::jsonb and answer_index = 0 and explanation = 'If the volumes are wrong the ledger is wrong, and the engine has no way to know: no reservoir, no facilities capacity, no decline.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-cash-flow-is' and ord = 5;
  if v_state is null then raise exception 'EC1 recut refused: no row for m01-what-a-cash-flow-is ord 5'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m01-what-a-cash-flow-is ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the Petroleum Economics Studio engine, version 3.10.0, read before it builds a ledger?', options = '["Three uploaded files, production, capex and opex, and a configuration carrying prices, escalators, inflation and fiscal terms; nothing else.", "A production file, a reservoir decline model and a facilities capacity file, from which it checks the volumes before believing them.", "A single combined spreadsheet of volumes and costs, with the price taken from the deck by default when the configuration is blank.", "The three files and a well log, which fixes the boe conversion for the field."]'::jsonb, answer_index = 0, explanation = 'If the volumes are wrong the ledger is wrong, and the engine has no way to know: no reservoir, no facilities capacity, no decline.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-a-cash-flow-is' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m01-what-a-cash-flow-is ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-joint-venture-cascade ord 12: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'AKATA at a 60 percent working interest prints 2029 royalty 16742880.00, tax 27150528.00 and net -72674208.00 USD, with gross revenue still 186032000.00. What scales and what does not?' and options = '["Gross revenue and the volumes scale first, so the cascade runs on 60 percent of the field''s 186032000.00 and the royalty is 15 percent of that share.", "Only the net cash flow scales; the row prints royalty and tax at the field''s 27904800.00 and 45250880.00.", "Royalty, tax and net cash flow scale; gross revenue, the 9680000.00 bbl of oil and the unit technical cost of 40.006602 stay field-level.", "Nothing on the row scales; the working interest is applied to the totals and the NPV only."]'::jsonb and answer_index = 2 and explanation = 'Scaling inside means the fiscal cascade runs once on the whole field and the partner takes a share of each result, which is why the engine reports working_interest_pct beside the run.' then 'old'
           when prompt = 'AKATA at a 60 percent working interest prints 2029 gross revenue 111619200.00 USD, royalty 16742880.00, tax 27150528.00 and net -72674208.00, with total oil 5808000.00 bbl. How far does the interest reach?' and options = '["Royalty, tax and net cash flow only, leaving gross revenue at the field''s 186032000.00 and the oil at 9680000.00 bbl.", "Only the net cash flow; the row prints royalty and tax at the field''s 27904800.00 and 45250880.00.", "Every money line and the volumes: the row reports the partner''s share throughout, and NPV falls from 72534830.66 to 43520898.40.", "Nothing on the row; the working interest is applied to the totals and the NPV only."]'::jsonb and answer_index = 2 and explanation = 'The cascade still runs once on the whole field and the partner takes a share of each result, which is why take holds at 66.1723 percent and the unit technical cost at 40.006602 USD/boe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 12;
  if v_state is null then raise exception 'EC1 recut refused: no row for m04-the-joint-venture-cascade ord 12'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'AKATA at a 60 percent working interest prints 2029 gross revenue 111619200.00 USD, royalty 16742880.00, tax 27150528.00 and net -72674208.00, with total oil 5808000.00 bbl. How far does the interest reach?', options = '["Royalty, tax and net cash flow only, leaving gross revenue at the field''s 186032000.00 and the oil at 9680000.00 bbl.", "Only the net cash flow; the row prints royalty and tax at the field''s 27904800.00 and 45250880.00.", "Every money line and the volumes: the row reports the partner''s share throughout, and NPV falls from 72534830.66 to 43520898.40.", "Nothing on the row; the working interest is applied to the totals and the NPV only."]'::jsonb, answer_index = 2, explanation = 'The cascade still runs once on the whole field and the partner takes a share of each result, which is why take holds at 66.1723 percent and the unit technical cost at 40.006602 USD/boe.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-joint-venture-cascade ord 13: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'At a 25 percent working interest AKATA''s take reads 91.5431 percent against 66.1723 at 100 percent. What changed?' and options = '["Nothing in the regime. The take compares the partner''s scaled net with the field''s unscaled pre-take value, so it counts the other partners'' share as if it were the government''s.", "The royalty, which the JV regime levies at a higher tier on a small partner''s barrels, so that a 25 percent holder pays a larger share of its revenue off the top than the field does at 100 percent.", "The tax rate, which the engine raises on a minority interest.", "The unit technical cost, which rises when the volumes are scaled and the cost is not."]'::jsonb and answer_index = 0 and explanation = 'The government''s share of the field is the 66.1723 percent on the 100 percent row whatever interest is held; 91.5431 is the share of value this partner does not keep.' then 'old'
           when prompt = 'At a 25 percent working interest AKATA''s take reads 66.1723 percent, the same as at 100 percent, while the 2029 net falls from -121123680.00 to -30280920.00 USD. Why does the take not move?' and options = '["The interest scales the government''s lines and the partner''s alike, so the ratio between them is unchanged and take is a property of the regime.", "The royalty rate falls with the interest, exactly offsetting the smaller net, which is how the engine holds the ratio steady at every interest a partner can hold.", "The pre-take value stays at the field''s 857602518.80 USD while only the net scales, and the two happen to cancel at this interest.", "Take is computed on a 100 percent run and copied onto every scaled run."]'::jsonb and answer_index = 0 and explanation = 'AKATA reports 66.1723 percent at 100, 75, 60, 40 and 25 percent alike; until the 2026-09-15 repair the JV ledger kept revenue, volumes and costs at field level while scaling royalty, tax and net, and printed 91.5431 percent at a 25 percent interest.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 13;
  if v_state is null then raise exception 'EC1 recut refused: no row for m04-the-joint-venture-cascade ord 13'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At a 25 percent working interest AKATA''s take reads 66.1723 percent, the same as at 100 percent, while the 2029 net falls from -121123680.00 to -30280920.00 USD. Why does the take not move?', options = '["The interest scales the government''s lines and the partner''s alike, so the ratio between them is unchanged and take is a property of the regime.", "The royalty rate falls with the interest, exactly offsetting the smaller net, which is how the engine holds the ratio steady at every interest a partner can hold.", "The pre-take value stays at the field''s 857602518.80 USD while only the net scales, and the two happen to cancel at this interest.", "Take is computed on a 100 percent run and copied onto every scaled run."]'::jsonb, answer_index = 0, explanation = 'AKATA reports 66.1723 percent at 100, 75, 60, 40 and 25 percent alike; until the 2026-09-15 repair the JV ledger kept revenue, volumes and costs at field level while scaling royalty, tax and net, and printed 91.5431 percent at a 25 percent interest.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-joint-venture-cascade ord 14: option_0
  select case
           when prompt = 'Under AKATA''s flat 15 percent royalty and 40 percent tax, scaling the volumes to the interest first would give the same net as scaling the results afterward. Why does the engine still insist on scaling inside?' and options = '["Because the engine reads the volumes at the working interest before pricing them, so scaling inside and scaling outside are the same calculation and the choice is only a label.", "Because a rate tier on the field''s daily production, a lifetime cumulative cap or a fixed lump sum is not proportional to revenue, and the two orders then part.", "Because the depreciation schedule is unit-of-production and follows the scaled barrels.", "Because the two orders never give the same answer, even under flat rates."]'::jsonb and answer_index = 1 and explanation = 'Under flat rates every line is proportional to revenue, so the habit is formed where it is cheap: interest is applied to results, not to inputs.' then 'old'
           when prompt = 'Under AKATA''s flat 15 percent royalty and 40 percent tax, scaling the volumes to the interest first would give the same net as scaling the results afterward. Why does the engine still insist on scaling inside?' and options = '["Because the engine applies the interest to the uploaded volumes before the cascade runs, so a field-level rate tier would read the partner''s barrels rather than the field''s.", "Because a rate tier on the field''s daily production, a lifetime cumulative cap or a fixed lump sum is not proportional to revenue, and the two orders then part.", "Because the depreciation schedule is unit-of-production and follows the scaled barrels.", "Because the two orders never give the same answer, even under flat rates."]'::jsonb and answer_index = 1 and explanation = 'Under flat rates every line is proportional to revenue, so the habit is formed where it is cheap: interest is applied to results, not to inputs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 14;
  if v_state is null then raise exception 'EC1 recut refused: no row for m04-the-joint-venture-cascade ord 14'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Under AKATA''s flat 15 percent royalty and 40 percent tax, scaling the volumes to the interest first would give the same net as scaling the results afterward. Why does the engine still insist on scaling inside?', options = '["Because the engine applies the interest to the uploaded volumes before the cascade runs, so a field-level rate tier would read the partner''s barrels rather than the field''s.", "Because a rate tier on the field''s daily production, a lifetime cumulative cap or a fixed lump sum is not proportional to revenue, and the two orders then part.", "Because the depreciation schedule is unit-of-production and follows the scaled barrels.", "Because the two orders never give the same answer, even under flat rates."]'::jsonb, answer_index = 1, explanation = 'Under flat rates every line is proportional to revenue, so the habit is formed where it is cheap: interest is applied to results, not to inputs.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-joint-venture-cascade' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m04-the-joint-venture-cascade ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-adding-up ord 11: explanation, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'AKATA''s unit technical cost is 40.006602 USD/boe. What happens to it when the working interest drops to 40 percent?' and options = '["It falls to 40 percent of itself, because capex and opex are money lines and every money line scales with the interest the partner holds.", "It rises, because the volumes are scaled to the interest while the capex and opex are not.", "Nothing: it stays at 40.006602, because 255000000.00 plus 183899092.34 over 10970666.67 boe is field-level on both sides.", "It becomes null, because the engine declines to divide a partner''s cost by the field''s barrels."]'::jsonb and answer_index = 2 and explanation = 'Neither unit cost contains royalty or tax; they are what it takes to build and run the field per barrel, at any interest.' then 'old'
           when prompt = 'AKATA''s unit technical cost is 40.006602 USD/boe. What happens to it when the working interest drops to 40 percent?' and options = '["It falls to 40 percent of itself, because capex and opex are money lines and every money line scales with the interest the partner holds.", "It rises, because the volumes are scaled to the interest while the capex and opex are not.", "Nothing: it stays at 40.006602, because the interest scales the cost and the barrels alike and cancels out of the ratio.", "It becomes null, because the engine declines to divide a partner''s cost by the field''s barrels."]'::jsonb and answer_index = 2 and explanation = 'At 40 percent the row reports the partner''s share of the 255000000.00 of capex, the 183899092.34 of opex and the 10970666.67 boe alike; neither unit cost contains royalty or tax.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-adding-up' and ord = 11;
  if v_state is null then raise exception 'EC1 recut refused: no row for m05-adding-up ord 11'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m05-adding-up ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'AKATA''s unit technical cost is 40.006602 USD/boe. What happens to it when the working interest drops to 40 percent?', options = '["It falls to 40 percent of itself, because capex and opex are money lines and every money line scales with the interest the partner holds.", "It rises, because the volumes are scaled to the interest while the capex and opex are not.", "Nothing: it stays at 40.006602, because the interest scales the cost and the barrels alike and cancels out of the ratio.", "It becomes null, because the engine declines to divide a partner''s cost by the field''s barrels."]'::jsonb, answer_index = 2, explanation = 'At 40 percent the row reports the partner''s share of the 255000000.00 of capex, the 183899092.34 of opex and the 10970666.67 boe alike; neither unit cost contains royalty or tax.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-adding-up' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m05-adding-up ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-associate-reading ord 6: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A ledger question is asked at a working interest below 100 percent. What does the Associate method do with the take?' and options = '["Quotes 66.1723 percent from the 100 percent row, because that is the only row on which the number is the government''s share.", "Scales it by the interest, as it scales every other money reading in the KPI block.", "Quotes the take the engine prints at that interest, since the engine reports working_interest_pct beside it.", "Leaves it out, because take is a field-level reading and cannot be stated for a partner."]'::jsonb and answer_index = 0 and explanation = 'The money readings scale and the volumes and unit costs stay at field level; the take at an interest compares one partner''s net with the whole field''s value and is not a fiscal statement.' then 'old'
           when prompt = 'A ledger question is asked at a working interest below 100 percent. What does the Associate method do with the take?' and options = '["Quotes what the engine prints on that run, 66.1723 percent, because the interest scales the government''s lines and the partner''s alike.", "Scales it by the interest, as it scales every other money reading in the KPI block.", "Goes back to a 100 percent run for it, because a scaled run sets the partner''s net against the whole field''s value and its take is not a fiscal statement.", "Leaves it out, because take is a field-level reading and cannot be stated for a partner."]'::jsonb and answer_index = 0 and explanation = 'Every money line and the volumes report the share, so take reads 66.1723 percent at 100, at 60 and at 25 percent alike; until the 2026-09-15 repair the same run printed 91.5431 percent at a 25 percent interest.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
  if v_state is null then raise exception 'EC1 recut refused: no row for m06-the-associate-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: m06-the-associate-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A ledger question is asked at a working interest below 100 percent. What does the Associate method do with the take?', options = '["Quotes what the engine prints on that run, 66.1723 percent, because the interest scales the government''s lines and the partner''s alike.", "Scales it by the interest, as it scales every other money reading in the KPI block.", "Goes back to a 100 percent run for it, because a scaled run sets the partner''s net against the whole field''s value and its take is not a fiscal statement.", "Leaves it out, because take is a field-level reading and cannot be stated for a partner."]'::jsonb, answer_index = 0, explanation = 'Every money line and the volumes report the share, so take reads 66.1723 percent at 100, at 60 and at 25 percent alike; until the 2026-09-15 repair the same run printed 91.5431 percent at a 25 percent interest.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: m06-the-associate-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 29: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'AKATA at a 40 percent working interest prints 2029 net -48449472.00 USD, take 86.4689 percent and unit technical cost 40.006602 USD/boe. Which of those three is a statement about the field rather than about the partner?' and options = '["Only the take, which is the government''s share and cannot depend on who holds the interest.", "The net and the take together, since both are printed on the partner''s row.", "Only the unit technical cost, which is field-level on both sides of its ratio.", "None of them, because every reading on a scaled run belongs to the partner."]'::jsonb and answer_index = 2 and explanation = 'The net is the partner''s share, the take counts the other partners as if they were the government, and 40.006602 is the same at 100 percent and at 25.' then 'old'
           when prompt = 'AKATA at a 40 percent working interest prints 2029 net -48449472.00 USD, take 66.1723 percent and unit technical cost 40.006602 USD/boe. Which of those three is the partner''s own number?' and options = '["Only the take, because a partner''s share of the value is what take measures while the other two are field readings.", "Only the unit technical cost, because the interest scales the barrels while the capex and opex stay at the field''s 255000000.00 and 183899092.34 USD.", "Only the net cash flow; the other two are ratios the interest scales on both sides.", "All three, because every reading printed on a scaled run belongs to the partner."]'::jsonb and answer_index = 2 and explanation = 'Take reads 66.1723 percent and unit technical cost 40.006602 USD/boe at 100, 75, 60, 40 and 25 percent alike, while the 2029 net falls from -121123680.00 to -48449472.00.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC1 recut refused: no row for (final exam) ord 29'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: (final exam) ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'AKATA at a 40 percent working interest prints 2029 net -48449472.00 USD, take 66.1723 percent and unit technical cost 40.006602 USD/boe. Which of those three is the partner''s own number?', options = '["Only the take, because a partner''s share of the value is what take measures while the other two are field readings.", "Only the unit technical cost, because the interest scales the barrels while the capex and opex stay at the field''s 255000000.00 and 183899092.34 USD.", "Only the net cash flow; the other two are ratios the interest scales on both sides.", "All three, because every reading printed on a scaled run belongs to the partner."]'::jsonb, answer_index = 2, explanation = 'Take reads 66.1723 percent and unit technical cost 40.006602 USD/boe at 100, 75, 60, 40 and 25 percent alike, while the 2029 net falls from -121123680.00 to -48449472.00.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: (final exam) ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 30: explanation
  select case
           when prompt = 'A partner''s interest in a field steps from 100 percent to 60 percent after payout. How does the engine model it?' and options = '["With a second run at 60 percent whose rows are spliced in from the payback year the first run reports.", "With the interest applied year by year from a column in the production file, which the engine reads like a volume.", "By scaling the pre-payout rows at 100 and the later rows at 60 automatically, since payback is a reading it already has.", "It cannot: jv_working_interest_pct is one number for the whole life."]'::jsonb and answer_index = 3 and explanation = 'Working interest scales money lines only, cannot step at a date, and carries no carried interest and no partner-specific cost.' then 'old'
           when prompt = 'A partner''s interest in a field steps from 100 percent to 60 percent after payout. How does the engine model it?' and options = '["With a second run at 60 percent whose rows are spliced in from the payback year the first run reports.", "With the interest applied year by year from a column in the production file, which the engine reads like a volume.", "By scaling the pre-payout rows at 100 and the later rows at 60 automatically, since payback is a reading it already has.", "It cannot: jv_working_interest_pct is one number for the whole life."]'::jsonb and answer_index = 3 and explanation = 'Working interest is one number for the whole life, so it cannot step at a date, and it carries no carried interest and no partner-specific cost; what it does reach is every money line and the volumes alike.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'EC1 recut refused: no row for (final exam) ord 30'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: (final exam) ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A partner''s interest in a field steps from 100 percent to 60 percent after payout. How does the engine model it?', options = '["With a second run at 60 percent whose rows are spliced in from the payback year the first run reports.", "With the interest applied year by year from a column in the production file, which the engine reads like a volume.", "By scaling the pre-payout rows at 100 and the later rows at 60 automatically, since payback is a reading it already has.", "It cannot: jv_working_interest_pct is one number for the whole life."]'::jsonb, answer_index = 3, explanation = 'Working interest is one number for the whole life, so it cannot step at a date, and it carries no carried interest and no partner-specific cost; what it does reach is every money line and the volumes alike.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: (final exam) ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 31: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The hand-derived case at a 25 percent working interest prints year 1 royalty 5000000.00 USD, tax 8125000.00, net -3125000.00 and take 95.1923 percent. What has stayed the same as the 100 percent run?' and options = '["The take, because the regime is unchanged and the take is the regime''s share.", "The volumes, the prices and every field-level line the row prints, because the cascade ran once on the whole field.", "The net cash flow, because scaling is applied to the KPI block and not to the rows.", "Nothing, because a 25 percent partner has a quarter of everything including the barrels."]'::jsonb and answer_index = 1 and explanation = 'Royalty 20000000.00, tax 32500000.00 and net -12500000.00 each became a quarter of themselves; 95.1923 is a partner''s number, not a fiscal one.' then 'old'
           when prompt = 'The hand-derived case at a 25 percent working interest prints year 1 royalty 5000000.00 USD, tax 8125000.00 and net -3125000.00, each a quarter of the 100 percent figures. What does the same run report as its take?' and options = '["95.1923 percent, because the partner''s scaled net is set against the field''s unscaled pre-take value.", "80.7692 percent, the same as at 100 percent, because the interest scales the government''s lines and the contractor''s together.", "A quarter of 80.7692 percent, since take is a money reading and every money reading scales with the interest.", "Null, because the engine declines a take on any run below a 100 percent interest."]'::jsonb and answer_index = 1 and explanation = 'NPV falls from 21590909.09 to 5397727.27 USD with the share while take does not move; until the 2026-09-15 repair the JV ledger kept revenue and costs at field level and the same run printed 95.1923 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'EC1 recut refused: no row for (final exam) ord 31'; end if;
  if v_state = 'other' then raise exception 'EC1 recut refused: (final exam) ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The hand-derived case at a 25 percent working interest prints year 1 royalty 5000000.00 USD, tax 8125000.00 and net -3125000.00, each a quarter of the 100 percent figures. What does the same run report as its take?', options = '["95.1923 percent, because the partner''s scaled net is set against the field''s unscaled pre-take value.", "80.7692 percent, the same as at 100 percent, because the interest scales the government''s lines and the contractor''s together.", "A quarter of 80.7692 percent, since take is a money reading and every money reading scales with the interest.", "Null, because the engine declines a take on any run below a 100 percent interest."]'::jsonb, answer_index = 1, explanation = 'NPV falls from 21590909.09 to 5397727.27 USD with the share while take does not move; until the 2026-09-15 repair the JV ledger kept revenue and costs at field level and the same run printed 95.1923 percent.'
     where app_slug = 'cashflow' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC1 recut refused: (final exam) ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- --------------------------------------------- the tier assertions --
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'cashflow' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC1 recut refused: the Associate tier holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'cashflow' and tier = 'beginner' and not active;
  if v_count <> 0 then raise exception 'EC1 recut refused: % Associate question(s) are inactive', v_count; end if;

  select count(*) into v_count from (
    select scope, module_key, count(*) as n from public.academy_quiz_questions
     where app_slug = 'cashflow' and tier = 'beginner' group by 1, 2
  ) b where (b.scope = 'module' and b.n <> 15) or (b.scope = 'final' and b.n <> 42);
  if v_count <> 0 then raise exception 'EC1 recut refused: % Associate bank(s) are not 15 (module) or 42 (final)', v_count; end if;

  -- Every option array is still four options and every key still points
  -- inside it: a rewritten options array that lost an entry would grade
  -- an answer that is no longer there.
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'cashflow' and tier = 'beginner'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index >= jsonb_array_length(options));
  if v_count <> 0 then raise exception 'EC1 recut refused: % Associate question(s) have a bad option array or key index', v_count; end if;

  raise notice 'EC1 recut beginner: % of 9 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-what-a-cash-flow-is', 5),
    ('module', 'm04-the-joint-venture-cascade', 12),
    ('module', 'm04-the-joint-venture-cascade', 13),
    ('module', 'm04-the-joint-venture-cascade', 14),
    ('module', 'm05-adding-up', 11),
    ('module', 'm06-the-associate-reading', 6),
    ('final', null::text, 29),
    ('final', null::text, 30),
    ('final', null::text, 31)
)
select 'ec1 recut beginner' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       q.answer_index,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'cashflow' and q.tier = 'beginner'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec1 recut beginner' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'cashflow' and tier = 'beginner'
 group by scope, module_key
 order by scope desc, module_key nulls last;
