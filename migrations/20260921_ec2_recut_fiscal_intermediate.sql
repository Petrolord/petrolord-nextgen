-- ==========================================================================
-- EC2 RECUT, PROFESSIONAL TIER (intermediate): Fiscal Regime Design (fiscal)
-- question bank brought to the repaired engines.
--
-- WHY. Engines #183 to #194 (engines main 709172f) repaired the economics
-- the two live Economics courses teach. The live bank was cut against the
-- retired engine, so its moved figures are wrong, some keyed answers assert
-- a rule that no longer holds, and some stems rest on a premise the repair
-- removed. PR #133 moved the capstone answers; this file is the bank.
--
-- WHAT MOVES. 48 of the 132 Professional questions, 32 of them with a
-- changed keyed answer TEXT and 0 with a changed answer INDEX. No ord, no
-- module key, no scope and no row count moves.
-- Fields rewritten: 32 prompt, 100 options, 38 explanation (170 field edits).
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

  -- m01-the-sliding-scale ord 4: explanation, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = '`price_below_every_threshold` runs the default project at a 0.5 multiplier, putting oil at 35 USD per bbl against tiers of 60 USD/bbl at 12.5 percent and 80 USD/bbl at 15 percent. What royalty rate does the field pay?' and options = '["Zero, because a tier list keyed at 60 and 80 USD per bbl charges nothing until the lower of the two keys is reached by the price.", "The 15 percent rate of the upper tier, because with no threshold reached the walk falls through to the last entry in the list.", "0.125000, but only from the year the deck''s step hold lifts the applied price above the 60 USD/bbl key for the first time.", "0.125000 in every year, which is the first tier''s rate charged as the initialisation before any threshold is reached."]'::jsonb and answer_index = 3 and explanation = '`getSlidingScaleRoyalty` initialises to the first tier''s rate before the walk begins, which is why year 1 pays 18.0299 on gross revenue of 144.2389.' then 'old'
           when prompt = '`price_below_every_threshold` runs the default project at a 0.5 multiplier, putting oil at 35 USD per bbl against tiers of 60 USD/bbl at 12.5 percent and 80 USD/bbl at 15 percent. What royalty rate does the field pay?' and options = '["Zero, because a tier list keyed at 60 and 80 USD per bbl charges nothing until the lower of the two keys is reached by the price.", "The 15 percent rate of the upper tier, because with no threshold reached the walk falls through to the last entry in the list.", "0.125000, but only from the year the deck''s step hold lifts the applied price above the 60 USD/bbl key for the first time.", "0.125000 in every year, which is the lowest tier''s rate, charged as the fallback before any threshold is reached."]'::jsonb and answer_index = 3 and explanation = '`getSlidingScaleRoyalty` falls back to the lowest tier''s rate when the price has reached no threshold, which is why year 1 pays 18.0299 on gross revenue of 144.2389.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-the-sliding-scale ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`price_below_every_threshold` runs the default project at a 0.5 multiplier, putting oil at 35 USD per bbl against tiers of 60 USD/bbl at 12.5 percent and 80 USD/bbl at 15 percent. What royalty rate does the field pay?', options = '["Zero, because a tier list keyed at 60 and 80 USD per bbl charges nothing until the lower of the two keys is reached by the price.", "The 15 percent rate of the upper tier, because with no threshold reached the walk falls through to the last entry in the list.", "0.125000, but only from the year the deck''s step hold lifts the applied price above the 60 USD/bbl key for the first time.", "0.125000 in every year, which is the lowest tier''s rate, charged as the fallback before any threshold is reached."]'::jsonb, answer_index = 3, explanation = '`getSlidingScaleRoyalty` falls back to the lowest tier''s rate when the price has reached no threshold, which is why year 1 pays 18.0299 on gross revenue of 144.2389.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m01-the-sliding-scale ord 12: explanation, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The PIA template''s first royalty tier is keyed at 0 USD/bbl. Why does that hide something a reader needs to check?' and options = '["Because a threshold of 0 USD/bbl is skipped by the walk, leaving the 50 USD/bbl tier as the only rate the template can charge.", "Because a zero threshold makes the implied rate undefined in any year the applied oil price is itself below one dollar.", "Because the engine treats a 0 USD/bbl key as an instruction to charge no royalty until the next threshold in the list is reached.", "Because at any positive price the first tier is genuinely reached, so the initialisation to the first tier''s rate never shows itself and the walk looks like an ordinary threshold rule."]'::jsonb and answer_index = 3 and explanation = 'On tiers keyed at 60 and 80 USD/bbl the initialisation is visible as 0.125000 charged below every threshold, and that is the entry every tier list has to be checked for.' then 'old'
           when prompt = 'The PIA template''s lowest royalty tier is keyed at 0 USD/bbl. Why does that hide something a reader needs to check?' and options = '["Because a threshold of 0 USD/bbl is skipped by the walk, leaving the 50 USD/bbl tier as the only rate the template can charge.", "Because a zero threshold makes the implied rate undefined in any year the applied oil price is itself below one dollar.", "Because the engine treats a 0 USD/bbl key as an instruction to charge no royalty until the next threshold in the list is reached.", "Because at any positive price that tier is genuinely reached, so the fallback to the lowest tier''s rate never shows itself and the selection looks like an ordinary threshold rule."]'::jsonb and answer_index = 3 and explanation = 'On tiers keyed at 60 and 80 USD/bbl the fallback is visible as 0.125000 charged below every threshold, and that is the entry every tier list has to be checked for.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 12;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-the-sliding-scale ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The PIA template''s lowest royalty tier is keyed at 0 USD/bbl. Why does that hide something a reader needs to check?', options = '["Because a threshold of 0 USD/bbl is skipped by the walk, leaving the 50 USD/bbl tier as the only rate the template can charge.", "Because a zero threshold makes the implied rate undefined in any year the applied oil price is itself below one dollar.", "Because the engine treats a 0 USD/bbl key as an instruction to charge no royalty until the next threshold in the list is reached.", "Because at any positive price that tier is genuinely reached, so the fallback to the lowest tier''s rate never shows itself and the selection looks like an ordinary threshold rule."]'::jsonb, answer_index = 3, explanation = 'On tiers keyed at 60 and 80 USD/bbl the fallback is visible as 0.125000 charged below every threshold, and that is the entry every tier list has to be checked for.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m01-the-sliding-scale ord 13: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What validation does `getSlidingScaleRoyalty` perform on the tier list it is given?' and options = '["It sorts the list ascending by threshold at load, which is why the walk can be described as keeping the highest threshold reached.", "None. It does not sort the list, does not check that thresholds ascend, and does not warn on duplicates.", "It rejects a list whose rates fall as its thresholds rise.", "It checks the first tier''s threshold is zero or negative, so that some rate is always defined below the list''s lowest key."]'::jsonb and answer_index = 1 and explanation = 'The walk keeps the last qualifying tier in list order, which equals the highest threshold reached only while the list is sorted, and every shipped template happens to be sorted.' then 'old'
           when prompt = 'What does `getSlidingScaleRoyalty` do with a tier list whose thresholds are not typed in ascending order?' and options = '["It reads the list exactly as typed and keeps the last qualifying entry it meets, so a list written out of order charges the wrong rate for the year and raises nothing at all.", "It sorts a copy before reading it, so the rate charged is the one keyed to the highest threshold the price has reached, whatever the typed order.", "It rejects the regime outright, because a list whose thresholds do not ascend fails validation before any year is computed.", "It reads the first and the last entry only, so a tier typed out of order in the middle of the list is passed over."]'::jsonb and answer_index = 1 and explanation = 'Selection is by threshold, from a sorted copy. The one table the engine does refuse is a list with two tiers at one threshold, and it names the repeated threshold rather than choosing between them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 13;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-the-sliding-scale ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does `getSlidingScaleRoyalty` do with a tier list whose thresholds are not typed in ascending order?', options = '["It reads the list exactly as typed and keeps the last qualifying entry it meets, so a list written out of order charges the wrong rate for the year and raises nothing at all.", "It sorts a copy before reading it, so the rate charged is the one keyed to the highest threshold the price has reached, whatever the typed order.", "It rejects the regime outright, because a list whose thresholds do not ascend fails validation before any year is computed.", "It reads the first and the last entry only, so a tier typed out of order in the middle of the list is passed over."]'::jsonb, answer_index = 1, explanation = 'Selection is by threshold, from a sorted copy. The one table the engine does refuse is a list with two tiers at one threshold, and it names the repeated threshold rather than choosing between them.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m01-the-sliding-scale ord 14: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'How does the walk in `getSlidingScaleRoyalty` treat a price that has reached two thresholds?' and options = '["It stops at the first qualifying tier and charges that rate, which is why the lowest reached threshold governs the year.", "It sums the rates of every qualifying tier, so a price reaching two tiers pays the total of both rates on gross revenue.", "It keeps the rate of the later qualifying tier in list order, having overwritten the earlier one as it walked past it.", "It compares each qualifying tier against the one it is holding and keeps whichever carries the larger rate."]'::jsonb and answer_index = 2 and explanation = 'The walk never compares one qualifying tier against another. What survives is whichever qualifying tier came last in the list.' then 'old'
           when prompt = 'A year''s oil price has reached two of a royalty''s thresholds. Which rate is charged?' and options = '["The rate of whichever of the two qualifying tiers was typed last in the list.", "The sum of the two rates, since every qualifying tier charges its own rate on gross revenue.", "The rate keyed to the higher of the two thresholds, and the order the tiers were typed in makes no difference to it.", "The rate of the lower of the two thresholds, since the selection stops at the first threshold the price has passed on its way up."]'::jsonb and answer_index = 2 and explanation = 'A sorted copy of the list is read, so the highest threshold reached is the one that governs. Nothing between two thresholds is interpolated and no rates are added.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-the-sliding-scale ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A year''s oil price has reached two of a royalty''s thresholds. Which rate is charged?', options = '["The rate of whichever of the two qualifying tiers was typed last in the list.", "The sum of the two rates, since every qualifying tier charges its own rate on gross revenue.", "The rate keyed to the higher of the two thresholds, and the order the tiers were typed in makes no difference to it.", "The rate of the lower of the two thresholds, since the selection stops at the first threshold the price has passed on its way up."]'::jsonb, answer_index = 2, explanation = 'A sorted copy of the list is read, so the highest threshold reached is the one that governs. Nothing between two thresholds is interpolated and no rates are added.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-sliding-scale' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-the-sliding-scale ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-cost-recovery ord 2: explanation, prompt
  select case
           when prompt = 'The golden note on `capped_5pct_never_recovers` says no payback and IRR 0, while the case records payback in year 3 and an IRR of 54.6792 percent. Why does the project pay back even though its pool never clears?' and options = '["The engine treats the closing pool of 2543.7575 as a receivable and credits it to contractor cash in the year the horizon closes.", "Payback is measured on gross revenue rather than on contractor net cash flow, so a project pays back whether or not any cost is recovered.", "The 5 percent limit loosens automatically once the pool exceeds the capex, releasing the arrears in a single year and producing the year 3 payback.", "Revenue the 5 percent limit will not release as cost oil becomes profit oil instead, and that regime gives the contractor the whole of the profit split, so the capital comes home through the profit share."]'::jsonb and answer_index = 3 and explanation = 'Cost recovery is not the only way a contractor is paid back. Total profit oil on that case is 5819.7423 against 3355.3781 on the full limit run, and contractor net cash flow still reaches 1530.0622.' then 'old'
           when prompt = 'A published run caps cost recovery at 5 percent of revenue after royalty, so its cost pool never clears inside the 25 years. It records payback in year 3 all the same. How?' and options = '["The engine treats the closing pool of 2543.7575 as a receivable and credits it to contractor cash in the year the horizon closes.", "Payback is measured on gross revenue rather than on contractor net cash flow, so a project pays back whether or not any cost is recovered.", "The 5 percent limit loosens automatically once the pool exceeds the capex, releasing the arrears in a single year and producing the year 3 payback.", "Revenue the 5 percent limit will not release as cost oil becomes profit oil instead, and that regime gives the contractor the whole of the profit split, so the capital comes home through the profit share."]'::jsonb and answer_index = 3 and explanation = 'Cost recovery is not the only way a contractor is paid back. Total profit oil on that case is 5819.7423 against 3355.3781 on the full limit run, and contractor net cash flow still reaches 1530.0622 while its rate of return is null with the status multiple-roots.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-cost-recovery ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-cost-recovery ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published run caps cost recovery at 5 percent of revenue after royalty, so its cost pool never clears inside the 25 years. It records payback in year 3 all the same. How?', options = '["The engine treats the closing pool of 2543.7575 as a receivable and credits it to contractor cash in the year the horizon closes.", "Payback is measured on gross revenue rather than on contractor net cash flow, so a project pays back whether or not any cost is recovered.", "The 5 percent limit loosens automatically once the pool exceeds the capex, releasing the arrears in a single year and producing the year 3 payback.", "Revenue the 5 percent limit will not release as cost oil becomes profit oil instead, and that regime gives the contractor the whole of the profit split, so the capital comes home through the profit share."]'::jsonb, answer_index = 3, explanation = 'Cost recovery is not the only way a contractor is paid back. Total profit oil on that case is 5819.7423 against 3355.3781 on the full limit run, and contractor net cash flow still reaches 1530.0622 while its rate of return is null with the status multiple-roots.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-cost-recovery ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-cost-recovery ord 3: prompt
  select case
           when prompt = 'On the Suite test project, `capped_5pct_never_recovers` pays total tax of 1745.9227 while `flat_test_project` pays 1006.6134. Why does the tighter cost recovery limit pay more tax?' and options = '["Because cost recovered is not a tax deduction: the base is the contractor''s profit share, and cost the limit refuses to release stays inside the profit oil the split and the tax act on.", "Because an unrecovered pool is added to taxable income as a deemed benefit in the year the horizon closes, which raises the lifetime tax total.", "Because the minimum tax provision binds whenever cost recovery falls short, and the minimum is charged on gross revenue rather than on the profit share.", "Because the tighter limit lengthens the life of the pool, and the tax stack charges its capital uplift on every year a balance is still outstanding."]'::jsonb and answer_index = 0 and explanation = 'Recovering 306.3022 instead of 2770.6665 leaves 5819.7423 of profit oil rather than 3355.3781, and the tax follows the profit oil upward.' then 'old'
           when prompt = 'On the Suite test project, `capped_5pct_pool_never_clears` pays total tax of 1745.9227 while `flat_test_project` pays 1006.6134. Why does the tighter cost recovery limit pay more tax?' and options = '["Because cost recovered is not a tax deduction: the base is the contractor''s profit share, and cost the limit refuses to release stays inside the profit oil the split and the tax act on.", "Because an unrecovered pool is added to taxable income as a deemed benefit in the year the horizon closes, which raises the lifetime tax total.", "Because the minimum tax provision binds whenever cost recovery falls short, and the minimum is charged on gross revenue rather than on the profit share.", "Because the tighter limit lengthens the life of the pool, and the tax stack charges its capital uplift on every year a balance is still outstanding."]'::jsonb and answer_index = 0 and explanation = 'Recovering 306.3022 instead of 2770.6665 leaves 5819.7423 of profit oil rather than 3355.3781, and the tax follows the profit oil upward.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-cost-recovery ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-cost-recovery ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the Suite test project, `capped_5pct_pool_never_clears` pays total tax of 1745.9227 while `flat_test_project` pays 1006.6134. Why does the tighter cost recovery limit pay more tax?', options = '["Because cost recovered is not a tax deduction: the base is the contractor''s profit share, and cost the limit refuses to release stays inside the profit oil the split and the tax act on.", "Because an unrecovered pool is added to taxable income as a deemed benefit in the year the horizon closes, which raises the lifetime tax total.", "Because the minimum tax provision binds whenever cost recovery falls short, and the minimum is charged on gross revenue rather than on the profit share.", "Because the tighter limit lengthens the life of the pool, and the tax stack charges its capital uplift on every year a balance is still outstanding."]'::jsonb, answer_index = 0, explanation = 'Recovering 306.3022 instead of 2770.6665 leaves 5819.7423 of profit oil rather than 3355.3781, and the tax follows the profit oil upward.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-cost-recovery ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-cost-recovery ord 8: prompt
  select case
           when prompt = '`capped_5pct_never_recovers` closes with 2543.7575 million USD still in the pool. What happens to it?' and options = '["It is written off against the contractor''s taxable profit share in year 25, which is why that case records a lower tax than the full limit run.", "It is carried to a terminal settlement and added to contractor net cash flow in the final year, which is what makes payback possible in year 3.", "Nothing. Nothing in the engine ever pays it, and the horizon does not extend to let the recovery finish.", "It is converted into a loss carryforward that shelters the profit share in the years that follow, though the engine''s 25 year horizon truncates it."]'::jsonb and answer_index = 2 and explanation = 'An unrecovered pool is not a receivable. A reader who adds it back values the case too highly by 2543.7575, and does the same to `capped_40pct` by 399.6419 and to `flat_test_project` by 79.3932.' then 'old'
           when prompt = '`capped_5pct_pool_never_clears` closes with 2543.7575 million USD still in the pool. What happens to it?' and options = '["It is written off against the contractor''s taxable profit share in year 25, which is why that case records a lower tax than the full limit run.", "It is carried to a terminal settlement and added to contractor net cash flow in the final year, which is what makes payback possible in year 3.", "Nothing. Nothing in the engine ever pays it, and the horizon does not extend to let the recovery finish.", "It is converted into a loss carryforward that shelters the profit share in the years that follow, though the engine''s 25 year horizon truncates it."]'::jsonb and answer_index = 2 and explanation = 'An unrecovered pool is not a receivable. A reader who adds it back values the case too highly by 2543.7575, and does the same to `capped_40pct` by 399.6419 and to `flat_test_project` by 79.3932.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-cost-recovery ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-cost-recovery ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`capped_5pct_pool_never_clears` closes with 2543.7575 million USD still in the pool. What happens to it?', options = '["It is written off against the contractor''s taxable profit share in year 25, which is why that case records a lower tax than the full limit run.", "It is carried to a terminal settlement and added to contractor net cash flow in the final year, which is what makes payback possible in year 3.", "Nothing. Nothing in the engine ever pays it, and the horizon does not extend to let the recovery finish.", "It is converted into a loss carryforward that shelters the profit share in the years that follow, though the engine''s 25 year horizon truncates it."]'::jsonb, answer_index = 2, explanation = 'An unrecovered pool is not a receivable. A reader who adds it back values the case too highly by 2543.7575, and does the same to `capped_40pct` by 399.6419 and to `flat_test_project` by 79.3932.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cost-recovery' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-cost-recovery ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-r-factor ord 3: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The golden note on `rfactor_tranche_crossing` says the R factor walks through 1.0 in year 3 and the contractor split steps there. The table reads 0.781480 in year 1, 1.383252 in year 2 and 1.846809 in year 3, with splits of 0.600000, 0.600000 and 0.400000. What is wrong with the note?' and options = '["Nothing is wrong. The split does step in year 3 and 1.0 is a real threshold in the tier list, so the note describes the row correctly.", "The 1.0 crossing happens in year 2 and changes nothing, because 60 percent is already the first tier''s split. The year 3 step to 40 percent is the 1.6 threshold.", "The crossing is in year 2 and the step in year 3, so the note is right about the step but has simply dated the crossing one year late.", "The 1.0 crossing does happen in year 3 exactly as the note says, and the error is that the split it triggers there is 30 percent rather than the 40 percent recorded."]'::jsonb and answer_index = 1 and explanation = 'The note dates one event wrongly and credits it with a step another threshold caused. Every number in it appears somewhere in the case, which is why no mechanical sweep catches it.' then 'old'
           when prompt = 'On `rfactor_tranche_crossing` the R factor reads 0.781480 in year 1, 1.383252 in year 2 and 1.846809 in year 3, with splits of 0.600000, 0.600000 and 0.400000. Which threshold moved the split, and where did the ratio cross 1.0?' and options = '["The 1.0 threshold moved it, in year 3, which is the first tranche the ratio reaches on its way up the list.", "The 1.6 threshold moved it, in year 3. The ratio crossed 1.0 in year 2 and that changed nothing, because 60 percent is the lowest tranche''s split and was already in force.", "The 1.0 threshold moved it, in year 2, and the year 3 row is that same crossing arriving one year late through the cumulative totals the ratio is built from, which always lag the year they price.", "The 2.5 threshold moved it, in year 3, because the ratio passes 2.5 on its way to a peak above 3 later in the life."]'::jsonb and answer_index = 1 and explanation = 'Every number here appears somewhere in the case, so no mechanical sweep separates a crossing from the step it is credited with. Only the arithmetic does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-r-factor ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-r-factor ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `rfactor_tranche_crossing` the R factor reads 0.781480 in year 1, 1.383252 in year 2 and 1.846809 in year 3, with splits of 0.600000, 0.600000 and 0.400000. Which threshold moved the split, and where did the ratio cross 1.0?', options = '["The 1.0 threshold moved it, in year 3, which is the first tranche the ratio reaches on its way up the list.", "The 1.6 threshold moved it, in year 3. The ratio crossed 1.0 in year 2 and that changed nothing, because 60 percent is the lowest tranche''s split and was already in force.", "The 1.0 threshold moved it, in year 2, and the year 3 row is that same crossing arriving one year late through the cumulative totals the ratio is built from, which always lag the year they price.", "The 2.5 threshold moved it, in year 3, because the ratio passes 2.5 on its way to a peak above 3 later in the life."]'::jsonb, answer_index = 1, explanation = 'Every number here appears somewhere in the case, so no mechanical sweep separates a crossing from the step it is credited with. Only the arithmetic does.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-r-factor ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-r-factor ord 4: explanation, prompt
  select case
           when prompt = 'The golden note on `rfactor_falls_back` says the R factor peaks just above 2.5. What do its own numbers say?' and options = '["It peaks at 2.501684 in year 5, and 2.972625 is the peak of the crossing case rather than of this one.", "It peaks at 2.545295 in year 22, the last year before the split steps back up from 30 to 40 percent.", "It peaks at 2.494796 in year 23, which is the value that fails the 2.5 threshold and returns the contractor to the 1.6 tranche.", "It peaks at 2.972625 in year 11. The value 2.501684 is where it crosses 2.5 going up, in year 5."]'::jsonb and answer_index = 3 and explanation = 'The peak is nearly half a unit above what the note claims. Key on the table and never on a golden''s prose.' then 'old'
           when prompt = 'On `rfactor_falls_back`, where does the R factor peak, and what is the value 2.501684?' and options = '["It peaks at 2.501684 in year 5, and 2.972625 is the peak of the crossing case rather than of this one.", "It peaks at 2.545295 in year 22, the last year before the split steps back up from 30 to 40 percent.", "It peaks at 2.494796 in year 23, which is the value that fails the 2.5 threshold and returns the contractor to the 1.6 tranche.", "It peaks at 2.972625 in year 11. The value 2.501684 is where it crosses 2.5 going up, in year 5."]'::jsonb and answer_index = 3 and explanation = 'The peak sits nearly half a unit above the threshold the split steps at. Key on the table and never on a sentence written beside it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-r-factor ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-r-factor ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `rfactor_falls_back`, where does the R factor peak, and what is the value 2.501684?', options = '["It peaks at 2.501684 in year 5, and 2.972625 is the peak of the crossing case rather than of this one.", "It peaks at 2.545295 in year 22, the last year before the split steps back up from 30 to 40 percent.", "It peaks at 2.494796 in year 23, which is the value that fails the 2.5 threshold and returns the contractor to the 1.6 tranche.", "It peaks at 2.972625 in year 11. The value 2.501684 is where it crosses 2.5 going up, in year 5."]'::jsonb, answer_index = 3, explanation = 'The peak sits nearly half a unit above the threshold the split steps at. Key on the table and never on a sentence written beside it.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-r-factor ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-r-factor ord 8: explanation, option_0 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the default project year 1 the R factor is 0.512217, below every threshold in the PIA tranche list. What contractor split is applied?' and options = '["0.600000, the first tier''s split, used as the initialisation before any threshold has been reached.", "No split at all, since a tranche list cannot select a rate until its lowest threshold has actually been reached by the ratio.", "0.300000, because the walk falls through a list none of whose thresholds are met and keeps the split carried by the last entry.", "A split interpolated between zero and the first tier''s 60 percent in proportion to how far the ratio has climbed toward 1."]'::jsonb and answer_index = 0 and explanation = '`getTieredSplit` sets the split to the first tier''s split before the walk begins, exactly as the sliding royalty initialises to its first tier''s rate.' then 'old'
           when prompt = 'On the default project year 1 the R factor is 0.512217, below every threshold in the PIA tranche list. What contractor split is applied?' and options = '["0.600000, the lowest tranche''s split, used as the fallback before any threshold has been reached.", "No split at all, since a tranche list cannot select a rate until its lowest threshold has actually been reached by the ratio.", "0.300000, because the walk falls through a list none of whose thresholds are met and keeps the split carried by the last entry.", "A split interpolated between zero and the first tier''s 60 percent in proportion to how far the ratio has climbed toward 1."]'::jsonb and answer_index = 0 and explanation = '`getTieredSplit` keeps the lowest tranche''s split until a threshold is reached, exactly as the sliding royalty falls back to its lowest tier''s rate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-r-factor ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-r-factor ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the default project year 1 the R factor is 0.512217, below every threshold in the PIA tranche list. What contractor split is applied?', options = '["0.600000, the lowest tranche''s split, used as the fallback before any threshold has been reached.", "No split at all, since a tranche list cannot select a rate until its lowest threshold has actually been reached by the ratio.", "0.300000, because the walk falls through a list none of whose thresholds are met and keeps the split carried by the last entry.", "A split interpolated between zero and the first tier''s 60 percent in proportion to how far the ratio has climbed toward 1."]'::jsonb, answer_index = 0, explanation = '`getTieredSplit` keeps the lowest tranche''s split until a threshold is reached, exactly as the sliding royalty falls back to its lowest tier''s rate.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-r-factor ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-r-factor ord 11: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'In year 11 on the default project the R factor is 2.581420, which has reached all three PIA thresholds, and the implied split reads 0.300000 on profit oil of 80.0217. What would happen if the 2.5 tranche were listed first?' and options = '["Nothing, because the engine sorts the tier list ascending by threshold when the regime is loaded, so the stated order of the tranches is only presentational.", "The engine would refuse the regime, since a tier list whose thresholds do not ascend fails validation before any year is computed.", "The walk would keep the highest threshold reached, which is 2.5 whatever the order, so the split would still read 0.300000 in that row.", "The walk would keep whichever qualifying tier came last in the reordered list, so 0.600000 or 0.400000 would be charged, and no error would be raised."]'::jsonb and answer_index = 3 and explanation = 'The walk keeps the LAST qualifying tier in list order, which equals the highest threshold reached only while the list is sorted. No gate in the app checks the order.' then 'old'
           when prompt = 'In year 11 on the default project the R factor is 2.581420, which has reached all three PIA thresholds, and the implied split reads 0.300000 on profit oil of 80.0217. What would happen if the 2.5 tranche were typed first?' and options = '["The split would be whichever qualifying tranche came last in the reordered list, so 0.600000 would be charged on that year''s profit oil and no error would be raised.", "The engine would refuse the regime, since a tranche list whose thresholds do not ascend fails validation before any year is computed.", "The split would be interpolated between the tranches the reordering brackets, which is how the engine resolves a list it cannot read in order.", "Nothing at all. A sorted copy of the list is read, so the highest threshold reached is still 2.5 and the split in that row is still 0.300000."]'::jsonb and answer_index = 3 and explanation = '`tiers_unsorted_selected_by_threshold` types these tranches out of order and returns every row of the sorted case, closing at 279.5803 million USD of contractor net cash flow. Only a repeated threshold is refused, and it is refused by name.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-r-factor ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-r-factor ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'In year 11 on the default project the R factor is 2.581420, which has reached all three PIA thresholds, and the implied split reads 0.300000 on profit oil of 80.0217. What would happen if the 2.5 tranche were typed first?', options = '["The split would be whichever qualifying tranche came last in the reordered list, so 0.600000 would be charged on that year''s profit oil and no error would be raised.", "The engine would refuse the regime, since a tranche list whose thresholds do not ascend fails validation before any year is computed.", "The split would be interpolated between the tranches the reordering brackets, which is how the engine resolves a list it cannot read in order.", "Nothing at all. A sorted copy of the list is read, so the highest threshold reached is still 2.5 and the split in that row is still 0.300000."]'::jsonb, answer_index = 3, explanation = '`tiers_unsorted_selected_by_threshold` types these tranches out of order and returns every row of the sorted case, closing at 279.5803 million USD of contractor net cash flow. Only a repeated threshold is refused, and it is refused by name.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-r-factor' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-r-factor ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 3: explanation, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Running the Brazil instruments with two of the three tax instruments switched off gives 502.1091 million USD for a corporate income tax of 34 percent and 62.5794 for a resource rent tax of 40 percent, on the same base. Why does the higher rate collect the smaller amount?' and options = '["The resource rent tax is charged on what survives the corporate income tax, so it works on a base that the 34 percent charge has already taken a third out of, which is how a second profits tax is usually stacked on a first.", "The resource rent tax falls on the government''s share of profit oil rather than the contractor''s, and on this regime that share is much the smaller of the two.", "The resource rent tax begins only once the cost recovery pool has cleared, so it reaches fewer of the 25 years than the corporate income tax does.", "The resource rent tax base is the profit share less 20 percent of the whole 500.0000 million USD of capex, subtracted in every year, so most years have no positive base left."]'::jsonb and answer_index = 3 and explanation = 'The uplift removes the same fixed amount every year, so the resource rent tax alone is back to 0.0000 by year 9 while profit oil is still 93.4441 million USD.' then 'old'
           when prompt = 'Running the Brazil instruments with two of the three tax instruments switched off gives 502.1091 million USD for a corporate income tax of 34 percent and 350.7165 for a resource rent tax of 40 percent, on the same base. Why does the higher rate collect the smaller amount?' and options = '["The resource rent tax is charged on what survives the corporate income tax, so it works on a base that the 34 percent charge has already taken a third out of, which is how a second profits tax is usually stacked on a first.", "The resource rent tax falls on the government''s share of profit oil rather than the contractor''s, and on this regime that share is much the smaller of the two.", "The resource rent tax begins only once the cost recovery pool has cleared in year 3, so it reaches fewer of the 25 years than the corporate income tax does.", "The resource rent tax draws relief from a pool of 1.2 times the 500.0000 million USD of capex before it charges anything, so the first six years of the base are sheltered whole."]'::jsonb and answer_index = 3 and explanation = 'The pool is drawn against the profit share and never refilled, so the column is 0.0000 until year 7, charges 10.8703 million USD there and is the full rate from year 8.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Running the Brazil instruments with two of the three tax instruments switched off gives 502.1091 million USD for a corporate income tax of 34 percent and 350.7165 for a resource rent tax of 40 percent, on the same base. Why does the higher rate collect the smaller amount?', options = '["The resource rent tax is charged on what survives the corporate income tax, so it works on a base that the 34 percent charge has already taken a third out of, which is how a second profits tax is usually stacked on a first.", "The resource rent tax falls on the government''s share of profit oil rather than the contractor''s, and on this regime that share is much the smaller of the two.", "The resource rent tax begins only once the cost recovery pool has cleared in year 3, so it reaches fewer of the 25 years than the corporate income tax does.", "The resource rent tax draws relief from a pool of 1.2 times the 500.0000 million USD of capex before it charges anything, so the first six years of the base are sheltered whole."]'::jsonb, answer_index = 3, explanation = 'The pool is drawn against the profit share and never refilled, so the column is 0.0000 until year 7, charges 10.8703 million USD there and is the full rate from year 8.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 5: explanation, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The decomposition prints 502.1091 million USD for the corporate income tax alone and 62.5794 for the resource rent tax alone, against a published stack of 564.6884. What should a reader conclude from adding the first two figures?' and options = '["That the printed columns disagree with the stack, which is evidence that the maximum rule drops part of one instrument somewhere in the life of the field.", "That a third instrument is quietly present in the published run, since a stack built from two exact components would reproduce its own total at the printed precision.", "Nothing at all, because each column total is rounded on its own; unrounded, the two agree with 564.6884366927 to within 1.1369e-13.", "That the decomposition is only approximate inside the engine."]'::jsonb and answer_index = 2 and explanation = 'The decomposition is exact in the engine and only approximate at the precision printed, so quote the columns and never assert that the printed figures add.' then 'old'
           when prompt = 'The decomposition prints 502.1091 million USD for the corporate income tax alone and 350.7165 for the resource rent tax alone, against a published stack of 852.8256. What should a reader conclude from adding the first two figures?' and options = '["That the printed columns disagree with the stack, which is evidence that the maximum rule drops part of one instrument somewhere in the life of the field.", "That a third instrument is quietly present in the published run, since a stack built from two exact components would reproduce its own total at the printed precision.", "Nothing beyond what each column already says, because every column total is rounded on its own and the sum of two rounded figures is not itself a published number.", "That the decomposition is only approximate inside the engine."]'::jsonb and answer_index = 2 and explanation = 'Unrounded, the two come to 852.8256004720 against a published 852.8256004720. The decomposition is exact in the engine and only approximate at the precision printed, so quote the columns and never assert that the printed figures add.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The decomposition prints 502.1091 million USD for the corporate income tax alone and 350.7165 for the resource rent tax alone, against a published stack of 852.8256. What should a reader conclude from adding the first two figures?', options = '["That the printed columns disagree with the stack, which is evidence that the maximum rule drops part of one instrument somewhere in the life of the field.", "That a third instrument is quietly present in the published run, since a stack built from two exact components would reproduce its own total at the printed precision.", "Nothing beyond what each column already says, because every column total is rounded on its own and the sum of two rounded figures is not itself a published number.", "That the decomposition is only approximate inside the engine."]'::jsonb, answer_index = 2, explanation = 'Unrounded, the two come to 852.8256004720 against a published 852.8256004720. The decomposition is exact in the engine and only approximate at the precision printed, so quote the columns and never assert that the printed figures add.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 6: explanation, option_1, prompt
  select case
           when prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 590.7165 million USD at an uplift of 0 percent. What is that figure?' and options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 564.6884 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government cash flow at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb and answer_index = 0 and explanation = 'The published Brazil stack on this project is 564.6884 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.' then 'old'
           when prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 390.7165 million USD at an uplift of 0 percent. What is that figure?' and options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 852.8256 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government cash flow at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb and answer_index = 0 and explanation = 'The published Brazil stack on this project is 852.8256 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The uplift sweep on the Brazil instruments reports a total tax of 390.7165 million USD at an uplift of 0 percent. What is that figure?', options = '["The resource rent tax alone at 40 percent, because the sweep sets the template''s own corporate income tax of 34 percent to zero in every one of its rows.", "The regime''s whole tax bill with the relief withdrawn, which is what the published stack of 852.8256 million USD becomes when the uplift is taken away.", "The corporate income tax and the resource rent tax added together on a base that no longer carries any capital relief at all.", "The total government cash flow at that uplift, of which the tax column is the part collected through the stack rather than through the royalty."]'::jsonb, answer_index = 0, explanation = 'The published Brazil stack on this project is 852.8256 million USD. The sweep''s tax, cash flow, take and NPV columns are an isolation of one instrument and not the regime.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 7: explanation, option_0, option_1, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What does the uplift sweep report at an uplift of 50 percent?' and options = '["A total tax of 1.0282 million USD, the smallest charge in the sweep, arriving in year 4 as it does at an uplift of 30 percent.", "A total tax of 0.0000 and no year in the whole life carrying a positive charge.", "A negative tax, because the base falls below zero and the engine credits the shortfall back to the contractor as relief in that year.", "A refusal, because an uplift larger than the resource rent tax rate is rejected by the engine as an instrument that cannot be expressed."]'::jsonb and answer_index = 1 and explanation = 'Half of the 500.0000 million USD of capex is removed from the base in every year, and contractor net cash flow reaches 1476.7914 million USD.' then 'old'
           when prompt = 'What does the uplift sweep on the Brazil instruments report at an uplift of 50 percent?' and options = '["A total tax of 0.0000, because half of the 500.0000 million USD of capex is taken out of the base in every one of the 25 years of the life.", "A total tax of 290.7165 million USD, with the first positive charge falling in year 9.", "A negative tax, because the base falls below zero and the engine credits the shortfall back to the contractor as relief in that year.", "A refusal, because an uplift larger than the resource rent tax rate is rejected by the engine as an instrument that cannot be expressed."]'::jsonb and answer_index = 1 and explanation = 'The pool there is 1.5 times the capex, so it lasts longer and the charge begins later, and contractor net cash flow reaches 1186.0748 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 7;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the uplift sweep on the Brazil instruments report at an uplift of 50 percent?', options = '["A total tax of 0.0000, because half of the 500.0000 million USD of capex is taken out of the base in every one of the 25 years of the life.", "A total tax of 290.7165 million USD, with the first positive charge falling in year 9.", "A negative tax, because the base falls below zero and the engine credits the shortfall back to the contractor as relief in that year.", "A refusal, because an uplift larger than the resource rent tax rate is rejected by the engine as an instrument that cannot be expressed."]'::jsonb, answer_index = 1, explanation = 'The pool there is 1.5 times the capex, so it lasts longer and the charge begins later, and contractor net cash flow reaches 1186.0748 million USD.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 8: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The resource rent tax uplift is a percent of total capex. How often is it subtracted from the base?' and options = '["Once, in the year the capex is spent, which is why no charge can arise in year 1 on a project that spends its capital there.", "In every year until the cumulative relief given has reached the whole of the capex, after which the subtraction stops and the full base is charged.", "In every year the cost recovery pool still carries a balance, since the uplift is the tax side of the same unrecovered capital.", "In every one of the 25 years."]'::jsonb and answer_index = 3 and explanation = 'At the default 20 percent on 500.0000 million USD of capex the relief given over the life is five times the whole capital cost, which the engine''s own comment calls a screening approximation.' then 'old'
           when prompt = 'The resource rent tax uplift is a percent of total capex. What does the engine do with it?' and options = '["It takes the capex times the uplift off the base in every one of the 25 years, so the relief over the life runs to several times the capex.", "It takes the capex times the uplift off the base once, in the year the capex is spent, so no charge can arise in year 1 on a project that spends its capital there.", "It takes the capex times the uplift off the base in every year the cost recovery pool still carries a balance, since the uplift is the tax side of the same unrecovered capital.", "It opens a relief pool once, at the capex times one plus the uplift, and draws that pool down against the profit share until it is exhausted."]'::jsonb and answer_index = 3 and explanation = 'At the default 20 percent on 500.0000 million USD of capex the pool is 1.2 times the capital cost and the first positive charge falls in year 7. Until the 2026-09-15 repair the subtraction was made in every one of the 25 years.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The resource rent tax uplift is a percent of total capex. What does the engine do with it?', options = '["It takes the capex times the uplift off the base in every one of the 25 years, so the relief over the life runs to several times the capex.", "It takes the capex times the uplift off the base once, in the year the capex is spent, so no charge can arise in year 1 on a project that spends its capital there.", "It takes the capex times the uplift off the base in every year the cost recovery pool still carries a balance, since the uplift is the tax side of the same unrecovered capital.", "It opens a relief pool once, at the capex times one plus the uplift, and draws that pool down against the profit share until it is exhausted."]'::jsonb, answer_index = 3, explanation = 'At the default 20 percent on 500.0000 million USD of capex the pool is 1.2 times the capital cost and the first positive charge falls in year 7. Until the 2026-09-15 repair the subtraction was made in every one of the 25 years.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-tax-stack ord 9: explanation, option_0, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Two published cases run the same regime on the same project and differ only in the uplift field: one omits it and one sets it to 0. Total tax is 1638.5664 million USD against 2607.5549. What decided the gap?' and options = '["The omitted field took the documented default of 20 percent, so one run carries a relief the other does not.", "The omitted field was read as zero and the explicit zero as missing, so the two case names sit against the wrong totals and the pair should be read the other way round.", "The two runs differ in their corporate income tax as well, because the default uplift is applied to that rate before the resource rent tax is worked out.", "A minimum tax bound in the second run and replaced the profits taxes."]'::jsonb and answer_index = 0 and explanation = 'Contractor net cash flow is 1812.4483 against 843.4598 million USD. The golden''s note on the second case spells the parameter rrtUpliptPct while the engine reads rrtUpliftPct, which is why the numbers and not the prose are the record.' then 'old'
           when prompt = 'Two published cases run the same regime on the same project and differ only in the uplift field: one omits it and one sets it to 0. Total tax is 2127.5549 million USD against 2207.5549. What decided the gap?' and options = '["The omitted field took the documented default of 20 percent, so one run opens a relief pool of 1.2 times the capex where the other opens one at the capex itself.", "The omitted field was read as zero and the explicit zero as missing, so the two case names sit against the wrong totals and the pair should be read the other way round.", "The two runs differ in their corporate income tax as well, because the default uplift is applied to that rate before the resource rent tax is worked out.", "A minimum tax bound in the second run and replaced the profits taxes."]'::jsonb and answer_index = 0 and explanation = 'Contractor net cash flow is 1323.4598 against 1243.4598 million USD. The two ledgers differ in one year only, year 4, at 169.6803 against 249.6803.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-tax-stack ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-tax-stack ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two published cases run the same regime on the same project and differ only in the uplift field: one omits it and one sets it to 0. Total tax is 2127.5549 million USD against 2207.5549. What decided the gap?', options = '["The omitted field took the documented default of 20 percent, so one run opens a relief pool of 1.2 times the capex where the other opens one at the capex itself.", "The omitted field was read as zero and the explicit zero as missing, so the two case names sit against the wrong totals and the pair should be read the other way round.", "The two runs differ in their corporate income tax as well, because the default uplift is applied to that rate before the resource rent tax is worked out.", "A minimum tax bound in the second run and replaced the profits taxes."]'::jsonb, answer_index = 0, explanation = 'Contractor net cash flow is 1323.4598 against 1243.4598 million USD. The two ledgers differ in one year only, year 4, at 169.6803 against 249.6803.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-tax-stack' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-tax-stack ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 3: option_1
  select case
           when prompt = 'A reader lays the ledger out with the year 1 outflow at time zero and leaves it undiscounted. What does that do to a swept table of present values?' and options = '["Every value comes out too high, and too high by a factor that changes with the rate, so no single correction repairs the whole table.", "Only the value at a rate of 0 percent moves, since every other row divides the same 310.0117 million USD by a number larger than one.", "Every value comes out too low, because a cost at face value is larger than one divided by one plus the rate.", "Nothing moves at all, because the convention governs receipts and the year 1 flow is an outlay."]'::jsonb and answer_index = 0 and explanation = 'Laying the ledger out a year early multiplies every discounted value by one plus the rate, so the overstatement grows with the rate and no single correction repairs a swept table. The row at 0 percent is the one exception, because the factor there is one and the value stays at the ledger''s own total of 980.9313 million USD.' then 'old'
           when prompt = 'A reader lays the ledger out with the year 1 outflow at time zero and leaves it undiscounted. What does that do to a swept table of present values?' and options = '["Every value comes out too high, and too high by a factor that changes with the rate, so no single correction repairs the whole table.", "Only the value at a rate of 0 percent moves, since every other row divides the very same 310.0117 million USD by a number larger than one already.", "Every value comes out too low, because a cost at face value is larger than one divided by one plus the rate.", "Nothing moves at all, because the convention governs receipts and the year 1 flow is an outlay."]'::jsonb and answer_index = 0 and explanation = 'Laying the ledger out a year early multiplies every discounted value by one plus the rate, so the overstatement grows with the rate and no single correction repairs a swept table. The row at 0 percent is the one exception, because the factor there is one and the value stays at the ledger''s own total of 980.9313 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader lays the ledger out with the year 1 outflow at time zero and leaves it undiscounted. What does that do to a swept table of present values?', options = '["Every value comes out too high, and too high by a factor that changes with the rate, so no single correction repairs the whole table.", "Only the value at a rate of 0 percent moves, since every other row divides the very same 310.0117 million USD by a number larger than one already.", "Every value comes out too low, because a cost at face value is larger than one divided by one plus the rate.", "Nothing moves at all, because the convention governs receipts and the year 1 flow is an outlay."]'::jsonb, answer_index = 0, explanation = 'Laying the ledger out a year early multiplies every discounted value by one plus the rate, so the overstatement grows with the rate and no single correction repairs a swept table. The row at 0 percent is the one exception, because the factor there is one and the value stays at the ledger''s own total of 980.9313 million USD.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 7: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'All six templates return a negative present value on the teaching field at 12 percent, Brazil - Concession the least negative at negative 5.8662 million USD. What does that say about Brazil on that field?' and options = '["The field loses money under that regime, as a negative present value reports.", "Its payback in year 6 falls outside the reach of the discounting, so the years after it contribute nothing to the sum at all.", "Its internal rate of return is 11.4055 percent, which is below 12, and that is the whole of the explanation.", "Its undiscounted contractor net cash flow of 192.9896 million USD never covers the capital, so the project fails to return its outlay."]'::jsonb and answer_index = 2 and explanation = 'Brazil returns 192.9896 million USD of undiscounted contractor net cash flow and pays back in year 6. A negative present value at a rate above the project''s own return is not a loss.' then 'old'
           when prompt = 'All six templates return a negative present value on the teaching field at 12 percent, Brazil - Concession the least negative at negative 5.8662 million USD. What does the engine report in its rate of return column for Brazil there?' and options = '["The field loses money under that regime, as a negative present value reports, so the column carries a negative rate.", "A rate just under 12 percent, which is the crossing that matters and the one the summary reports.", "Nothing. Its present value crosses zero twice, once at a negative rate and once below 12 percent, so no single rate can be named.", "A rate of 0.0000 percent, since its undiscounted contractor net cash flow of 192.9896 million USD never covers the capital."]'::jsonb and answer_index = 2 and explanation = 'Brazil returns 192.9896 million USD of undiscounted contractor net cash flow and pays back in year 6. A negative present value on a field whose rate column is empty is not a loss.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 7;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'All six templates return a negative present value on the teaching field at 12 percent, Brazil - Concession the least negative at negative 5.8662 million USD. What does the engine report in its rate of return column for Brazil there?', options = '["The field loses money under that regime, as a negative present value reports, so the column carries a negative rate.", "A rate just under 12 percent, which is the crossing that matters and the one the summary reports.", "Nothing. Its present value crosses zero twice, once at a negative rate and once below 12 percent, so no single rate can be named.", "A rate of 0.0000 percent, since its undiscounted contractor net cash flow of 192.9896 million USD never covers the capital."]'::jsonb, answer_index = 2, explanation = 'Brazil returns 192.9896 million USD of undiscounted contractor net cash flow and pays back in year 6. A negative present value on a field whose rate column is empty is not a loss.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 8: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The solver checks for a sign change, checks the value at a rate of zero, brackets by doubling from 100 percent ten times, then bisects 80 times. Which of those steps produces a reported 102400.0000 percent?' and options = '["The bracketing, which reports its own bound when the present value is still positive at the top of the doubling.", "The bisection, which converges on the largest rate it can represent when the two ends of the bracket never change sign between them.", "The sign change check, which returns the top of the search rather than 0.", "The check at a rate of zero, which substitutes the bound whenever the present value there is very large, as it is on the case whose value at 10 percent is 1651.9835."]'::jsonb and answer_index = 0 and explanation = 'Eighty halvings is a fine sieve, so the engine and the golden agree to four decimals wherever a root exists. A bound is what arrives when no root was found inside the search.' then 'old'
           when prompt = 'Which band does `calculateIRR` search, and what does it hand back when that band holds no single root?' and options = '["Negative 99 to 1000 percent, and null with a status word naming the reason.", "Zero to 1000 percent, and the top of the band, so the largest rate it can represent stands in for the root it could not find.", "Negative 99 to 1000 percent, and 0.0000 percent, which is the value the function has always used where a search comes up empty.", "One hundred percent doubled ten times, and the top of that bracket whenever the present value is still positive there."]'::jsonb and answer_index = 0 and explanation = 'A number comes back only when exactly one rate in the band brings the present value to zero. The four words that come back instead are no-sign-change, no-root, above-clamp and multiple-roots.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which band does `calculateIRR` search, and what does it hand back when that band holds no single root?', options = '["Negative 99 to 1000 percent, and null with a status word naming the reason.", "Zero to 1000 percent, and the top of the band, so the largest rate it can represent stands in for the root it could not find.", "Negative 99 to 1000 percent, and 0.0000 percent, which is the value the function has always used where a search comes up empty.", "One hundred percent doubled ten times, and the top of that bracket whenever the present value is still positive there."]'::jsonb, answer_index = 0, explanation = 'A number comes back only when exactly one rate in the band brings the present value to zero. The four words that come back instead are no-sign-change, no-root, above-clamp and multiple-roots.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 9: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The published case with flows of negative 1 then 2000 reports an internal rate of return of 102400.0000 percent. What is that number?' and options = '["It is the root of those flows to four decimals, which is enormous because a single receipt of 2000 stands against an outlay of 1.", "It is 100 doubled ten times, the top of the search, reported because the present value was still positive there. The true root is 199900.0000 percent.", "It is a cap the engine applies to any rate too large for a screening study, in the manner of the 1000 percent clamp the engine next door uses.", "It is the result of 80 bisections inside a bracket that had already been shown to contain the root."]'::jsonb and answer_index = 1 and explanation = 'The golden pins the disagreement rather than hiding it: engine 102400.0000 percent against an oracle root of 199900.0000 percent.' then 'old'
           when prompt = 'The published case with flows of negative 1 then 2000 has a root at 199900.0000 percent. What does the engine report for it?' and options = '["199900.0000 percent, since the root is exact and the band is a search hint rather than a limit on what may be reported.", "Null, with the status above-clamp, because the only root sits beyond the top of the band the engine searches.", "1000.0000 percent, the top of the band, which is the nearest rate the engine is prepared to defend.", "The top of a doubling search that started at 100 percent, since a bracket that stopped short is still the engine''s fallback."]'::jsonb and answer_index = 1 and explanation = '`irr_above_clamp_inside_old_bracket`, with flows of negative 100 then 1500, has a root of 1400.0000 percent and the same status, so a root the retired bisection would have printed is refused as well.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The published case with flows of negative 1 then 2000 has a root at 199900.0000 percent. What does the engine report for it?', options = '["199900.0000 percent, since the root is exact and the band is a search hint rather than a limit on what may be reported.", "Null, with the status above-clamp, because the only root sits beyond the top of the band the engine searches.", "1000.0000 percent, the top of the band, which is the nearest rate the engine is prepared to defend.", "The top of a doubling search that started at 100 percent, since a bracket that stopped short is still the engine''s fallback."]'::jsonb, answer_index = 1, explanation = '`irr_above_clamp_inside_old_bracket`, with flows of negative 100 then 1500, has a root of 1400.0000 percent and the same status, so a root the retired bisection would have printed is refused as well.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 10: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What separates a rate that came out of 80 bisections from one that is really the edge of the search?' and options = '["The function returns a status flag beside the rate, and a bound carries that flag while a genuine root does not carry it.", "A bound is always reported as 0.0000 percent, which is why a rate of exactly zero is the signal to go back and read the flows by hand.", "A bound is always larger than the largest rate in the discount sweep, so any rate above 30 percent should be treated as one.", "A bisected rate looks like 13.0662 percent, and a bound looks like 102400."]'::jsonb and answer_index = 3 and explanation = 'The tell is a suspiciously round number where a rate should be. The capex multiplier of 0.7 case reports 1095.4783 percent and that one is a real root.' then 'old'
           when prompt = 'What tells a reader that the engine refused to name a rate rather than failing to find one?' and options = '["A rate of 0.0000 percent, which is the value the function returns whenever its search comes up empty.", "A suspiciously round rate where a rate should be, which is the edge of a search printed as though it were an answer.", "The absence of any entry at all, since a refusal leaves the field out of the result object rather than writing to it.", "The status word printed beside the null, which names which of the four reasons for declining applies here."]'::jsonb and answer_index = 3 and explanation = 'A null is a decision and not a gap. `irrRoots` carries the roots inside the band when there are several of them, and `irrRootAboveBand` flags one beyond it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What tells a reader that the engine refused to name a rate rather than failing to find one?', options = '["A rate of 0.0000 percent, which is the value the function returns whenever its search comes up empty.", "A suspiciously round rate where a rate should be, which is the edge of a search printed as though it were an answer.", "The absence of any entry at all, since a refusal leaves the field out of the result object rather than writing to it.", "The status word printed beside the null, which names which of the four reasons for declining applies here."]'::jsonb, answer_index = 3, explanation = 'A null is a decision and not a gap. `irrRoots` carries the roots inside the band when there are several of them, and `irrRootAboveBand` flags one beyond it.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 11: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The solver returns 0.0000 percent for two published cases that could hardly be further apart. Which two?' and options = '["The case whose flows never change sign, and the case whose bracket search climbed to 102400.0000 percent before any root had been found, which is the disagreement the golden pins.", "The case whose flows never change sign, worth 25.6198 million USD at 10 percent, and the case whose only root is negative, at negative 16.5289.", "The case with no capital outlay at all, and the case whose payback year is null because cumulative cash flow never turns positive.", "The case whose present value at a rate of zero is exactly zero, and the case whose present value at 10 percent is exactly zero."]'::jsonb and answer_index = 1 and explanation = 'One zero means the project never loses and the other means it never wins, and the function prints the same four characters for both.' then 'old'
           when prompt = 'Two published cases used to report 0.0000 percent, one worth 25.6198 million USD at 10 percent and one worth negative 16.5289. What do they report now?' and options = '["0.0000 percent for both, since the repair changed the statuses the engine records and not the rates it prints.", "Null with the status no-sign-change for the first, and the negative root itself, negative 10.0000 percent, for the second.", "Null with the status no-root for both, since neither of them has a rate the engine is willing to name.", "Null with the status above-clamp for the first and null with the status multiple-roots for the second."]'::jsonb and answer_index = 1 and explanation = 'One project never loses and the other never wins, and the retired rule printed the same four characters for both.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two published cases used to report 0.0000 percent, one worth 25.6198 million USD at 10 percent and one worth negative 16.5289. What do they report now?', options = '["0.0000 percent for both, since the repair changed the statuses the engine records and not the rates it prints.", "Null with the status no-sign-change for the first, and the negative root itself, negative 10.0000 percent, for the second.", "Null with the status no-root for both, since neither of them has a rate the engine is willing to name.", "Null with the status above-clamp for the first and null with the status multiple-roots for the second."]'::jsonb, answer_index = 1, explanation = 'One project never loses and the other never wins, and the retired rule printed the same four characters for both.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 12: explanation, option_0, option_1, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A reader sees 0.0000 percent in the rate column and reads it as a project that breaks even exactly. What is wrong with that reading?' and options = '["Nothing, provided the present value at a rate of zero is checked as well, because both guards fire on a project sitting at break even.", "Only the precision, since the engine prints four decimals on a value it never obtained by bisection in the first place.", "It is backwards in both directions at once, since one zero is a project that never loses and the other is a project that never wins.", "It confuses the rate with the payout year, which is the first year the R factor rises above 1.0."]'::jsonb and answer_index = 2 and explanation = 'The published pair reads 25.6198 million USD at 10 percent against negative 16.5289, and both report 0.0000 percent.' then 'old'
           when prompt = 'A reader sees an empty rate column on several regimes of one comparison and reads it as a set of projects that broke even. What is wrong with that reading?' and options = '["Nothing, provided the present value at a rate of zero is checked as well, because the same statuses fire on a project sitting at break even.", "Only the precision, since the column would print four decimals on a rate the engine had actually found.", "A null is the engine declining to name a rate, and none of its reasons for declining has anything to do with breaking even.", "It confuses the rate with the payout year, which is the first year the R factor rises above 1.0."]'::jsonb and answer_index = 2 and explanation = 'All six templates on the teaching field come back null, and their present values at 12 percent run from negative 5.8662 to negative 58.1813 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 12;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader sees an empty rate column on several regimes of one comparison and reads it as a set of projects that broke even. What is wrong with that reading?', options = '["Nothing, provided the present value at a rate of zero is checked as well, because the same statuses fire on a project sitting at break even.", "Only the precision, since the column would print four decimals on a rate the engine had actually found.", "A null is the engine declining to name a rate, and none of its reasons for declining has anything to do with breaking even.", "It confuses the rate with the payout year, which is the first year the R factor rises above 1.0."]'::jsonb, answer_index = 2, explanation = 'All six templates on the teaching field come back null, and their present values at 12 percent run from negative 5.8662 to negative 58.1813 million USD.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 13: explanation, option_0, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What goes wrong when a comparison is sorted or filtered on the internal rate of return column?' and options = '["Every regime reporting 0.0000 percent is left unranked, and a filter set below a threshold hides the hopeless projects and the ones that needed no capital together.", "The sort puts the bound of 102400.0000 percent at the top, which is the only way a bound can be told apart from a root.", "The sort disagrees with a sort on present value, which is the ranking the summary is built on.", "Nothing, so long as the negative rates are read as the losses they stand for before the column is sorted."]'::jsonb and answer_index = 0 and explanation = 'The case with capex of 20000 reports 0.0000 percent on a contractor net cash flow of negative 15724.0151 million USD and a present value of negative 15453.8510.' then 'old'
           when prompt = 'What goes wrong when a comparison is sorted or filtered on the internal rate of return column?' and options = '["Every regime whose rate is null is left unranked, and a filter set above a threshold drops the hopeless projects and the ones that needed no capital together.", "The sort puts the largest rate at the top, which on this engine is always the edge of a search rather than a root, so the order the comparison ends up in is upside down.", "The sort disagrees with a sort on present value, which is the ranking the summary is built on.", "Nothing, so long as the negative rates are read as the losses they stand for before the column is sorted."]'::jsonb and answer_index = 0 and explanation = 'The case with capex of 20000 comes back null with the status no-root, on a contractor net cash flow of negative 15724.0151 million USD and a present value of negative 15453.8510.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 13;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What goes wrong when a comparison is sorted or filtered on the internal rate of return column?', options = '["Every regime whose rate is null is left unranked, and a filter set above a threshold drops the hopeless projects and the ones that needed no capital together.", "The sort puts the largest rate at the top, which on this engine is always the edge of a search rather than a root, so the order the comparison ends up in is upside down.", "The sort disagrees with a sort on present value, which is the ranking the summary is built on.", "Nothing, so long as the negative rates are read as the losses they stand for before the column is sorted."]'::jsonb, answer_index = 0, explanation = 'The case with capex of 20000 comes back null with the status no-root, on a contractor net cash flow of negative 15724.0151 million USD and a present value of negative 15453.8510.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 14: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The capex multiplier of 0.7 on the flat regime reports an internal rate of return of 1095.4783 percent with a payout year of 1. Is that figure a root?' and options = '["No, it is the doubling bracket reported as a rate, in the same way as the 102400.0000 percent of the published case with flows of negative 1 then 2000.", "Yes. The reduced outlay came back almost immediately, so the rate is real, and it is still not a number anybody can act on.", "No, it is the 1000 percent Newton clamp of the screening engine next door.", "Yes, and it settles the comparison, because a rate that large outranks anything else the summary could put beside it."]'::jsonb and answer_index = 1 and explanation = 'A large rate is not a good project. The case pays back a reduced outlay in the first year, and the six templates on the default project sit between 28.2129 and 44.6574 percent.' then 'old'
           when prompt = 'The capex multiplier of 0.7 on the flat regime has a present value of zero at 1095.4783 percent and again at negative 20.4852 percent. What does the engine report?' and options = '["1095.4783 percent, since the reduced outlay came back almost immediately and the rate is a genuine root of those flows.", "Null with the status multiple-roots, with `irrRoots` listing the negative root alone and `irrRootAboveBand` flagging the other.", "Negative 20.4852 percent, the only root inside the band, since a root beyond the band is outside the engine''s business.", "The 1000 percent clamp the screening engine next door applies, which is what the top edge of the band returns."]'::jsonb and answer_index = 1 and explanation = 'One root inside the band and one above it is still more than one root, so no single rate is named. The case pays back a reduced outlay in year 2 and reaches its payout year in year 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex multiplier of 0.7 on the flat regime has a present value of zero at 1095.4783 percent and again at negative 20.4852 percent. What does the engine report?', options = '["1095.4783 percent, since the reduced outlay came back almost immediately and the rate is a genuine root of those flows.", "Null with the status multiple-roots, with `irrRoots` listing the negative root alone and `irrRootAboveBand` flagging the other.", "Negative 20.4852 percent, the only root inside the band, since a root beyond the band is outside the engine''s business.", "The 1000 percent clamp the screening engine next door applies, which is what the top edge of the band returns."]'::jsonb, answer_index = 1, explanation = 'One root inside the band and one above it is still more than one root, so no single rate is named. The case pays back a reduced outlay in year 2 and reaches its payout year in year 1.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-rate-and-return ord 15: explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Which statement about what the internal rate of return function hands back is correct?' and options = '["It returns the number of roots it found beside the rate, which is how a reader recognises a curve with more than one of them.", "It returns a negative rate when the only root is negative, which is the case the second guard exists to report faithfully.", "It returns one number and no status, so a guard, a bound and a genuine root arrive at the call site indistinguishable from one another.", "It returns the bracket it searched alongside the rate, so a reported 102400.0000 percent can be read as the bound that it is."]'::jsonb and answer_index = 2 and explanation = 'The engine reports 0.0000 percent rather than a negative rate, so a genuinely loss making project cannot be described by that column at all.' then 'old'
           when prompt = 'Which statement about what the internal rate of return function hands back is correct?' and options = '["It returns one number and no status, so a guard, a bound and a genuine root arrive at the call site indistinguishable from one another.", "It returns the edge of the band whenever a root lies beyond it, so a reported 1000.0000 percent is how the engine says above-clamp.", "It returns either one rate or a null with a status, and where several roots are in reach it lists the ones inside the band.", "It returns 0.0000 percent for a project whose only root is negative, since the column carries no negative rates at all."]'::jsonb and answer_index = 2 and explanation = 'A negative root inside the band is reported as the negative rate it is, and negative 10.0000 percent on the published case of negative 100 then 90 is the example.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-rate-and-return ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-rate-and-return ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which statement about what the internal rate of return function hands back is correct?', options = '["It returns one number and no status, so a guard, a bound and a genuine root arrive at the call site indistinguishable from one another.", "It returns the edge of the band whenever a root lies beyond it, so a reported 1000.0000 percent is how the engine says above-clamp.", "It returns either one rate or a null with a status, and where several roots are in reach it lists the ones inside the band.", "It returns 0.0000 percent for a project whose only root is negative, since the column carries no negative rates at all."]'::jsonb, answer_index = 2, explanation = 'A negative root inside the band is reported as the negative rate it is, and negative 10.0000 percent on the published case of negative 100 then 90 is the example.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-rate-and-return' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-rate-and-return ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 2: option_1
  select case
           when prompt = 'Angola - Deepwater PSC carries a flat 0 percent royalty, a 50 percent recovery limit, an R factor split of 70, 50 and 30 percent and a stack of 25 and 50 percent. Which of those leaves 192.1146 million USD in the pool at the close of the teaching field?' and options = '["The flat 0 percent royalty, since a regime that takes nothing off gross revenue has no mechanism for returning capital either.", "The resource rent tax at 50 percent, whose uplift is charged against the pool in every year of the life and holds the balance open.", "The R factor split, which hands the contractor a smaller share of profit oil as the ratio climbs and so slows the return of capital.", "The 50 percent recovery limit."]'::jsonb and answer_index = 3 and explanation = 'Angola recovers 618.0991 million USD on that field against 790.8868 for Brazil - Concession, whose limit is 100 percent. The limit decides how fast the pool can drain and nothing else in the list does.' then 'old'
           when prompt = 'Angola - Deepwater PSC carries a flat 0 percent royalty, a 50 percent recovery limit, an R factor split of 70, 50 and 30 percent and a stack of 25 and 50 percent. Which of those leaves 192.1146 million USD in the pool at the close of the teaching field?' and options = '["The flat 0 percent royalty, since a regime that takes nothing off gross revenue has no mechanism for returning capital either.", "The resource rent tax at 50 percent, whose relief is drawn against the cost recovery pool and holds that balance open.", "The R factor split, which hands the contractor a smaller share of profit oil as the ratio climbs and so slows the return of capital.", "The 50 percent recovery limit."]'::jsonb and answer_index = 3 and explanation = 'Angola recovers 618.0991 million USD on that field against 790.8868 for Brazil - Concession, whose limit is 100 percent. The limit decides how fast the pool can drain and nothing else in the list does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC carries a flat 0 percent royalty, a 50 percent recovery limit, an R factor split of 70, 50 and 30 percent and a stack of 25 and 50 percent. Which of those leaves 192.1146 million USD in the pool at the close of the teaching field?', options = '["The flat 0 percent royalty, since a regime that takes nothing off gross revenue has no mechanism for returning capital either.", "The resource rent tax at 50 percent, whose relief is drawn against the cost recovery pool and holds that balance open.", "The R factor split, which hands the contractor a smaller share of profit oil as the ratio climbs and so slows the return of capital.", "The 50 percent recovery limit."]'::jsonb, answer_index = 3, explanation = 'Angola recovers 618.0991 million USD on that field against 790.8868 for Brazil - Concession, whose limit is 100 percent. The limit decides how fast the pool can drain and nothing else in the list does.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 6: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Every one of the six templates returns a negative present value on the teaching field at 12 percent. How is that reported?' and options = '["As one fact, that every rate of return on that field is below 12 percent, rather than as six separate failures.", "As six loss making regimes, since a negative present value on a 25 year ledger is the model''s report of a loss.", "As evidence that the field''s discount rate is set too high, because a rate no regime can beat is not a screening rate.", "As an artefact of year end discounting, which is the more conservative of the two conventions in the package."]'::jsonb and answer_index = 0 and explanation = 'Brazil - Concession is the least negative at negative 5.8662 million USD with a rate of return of 11.4055 percent, and it returns 192.9896 undiscounted with payback in year 6.' then 'old'
           when prompt = 'Every one of the six templates returns a negative present value on the teaching field at 12 percent. How is that reported?' and options = '["As one fact about the field, that its cash flows carry no 12 percent return under any of the six regimes, rather than as six separate failures.", "As six loss making regimes, since a negative present value on a 25 year ledger is the model''s report of a loss.", "As evidence that the field''s own discount rate has been set too high, because a rate that no regime in the comparison can beat is not a screening rate at all.", "As an artefact of year end discounting, which is the more conservative of the two conventions in the package."]'::jsonb and answer_index = 0 and explanation = 'Brazil - Concession is the least negative at negative 5.8662 million USD, and it returns 192.9896 undiscounted with payback in year 6. No regime on that field carries a single rate of return at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Every one of the six templates returns a negative present value on the teaching field at 12 percent. How is that reported?', options = '["As one fact about the field, that its cash flows carry no 12 percent return under any of the six regimes, rather than as six separate failures.", "As six loss making regimes, since a negative present value on a 25 year ledger is the model''s report of a loss.", "As evidence that the field''s own discount rate has been set too high, because a rate that no regime in the comparison can beat is not a screening rate at all.", "As an artefact of year end discounting, which is the more conservative of the two conventions in the package."]'::jsonb, answer_index = 0, explanation = 'Brazil - Concession is the least negative at negative 5.8662 million USD, and it returns 192.9896 undiscounted with payback in year 6. No regime on that field carries a single rate of return at all.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 11: explanation, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The capex sweep on the teaching field runs from a multiplier of 0.8 and stops at 1.4, seven points in all. What does the resilience verdict built on it price?' and options = '["Every overrun the project could suffer, since the sweep is run to the point where the least resilient regime stops paying back.", "The overrun at which the best regime for the contractor changes.", "A cost overrun no larger than the end of that swept range, whatever the axis of the chart appears to promise.", "A cost overrun measured against the closing pool, because an overrun that cannot be recovered is the only kind that reaches the contractor."]'::jsonb and answer_index = 2 and explanation = 'Over those points Ghana - Deepwater gives up 150.9021 million USD of contractor present value and Angola - Deepwater PSC 215.1075. Read the axis before the verdict.' then 'old'
           when prompt = 'The capex sweep on the teaching field runs eight multipliers from 0.8 to 1.5, the last of them exactly 1.5. What does the resilience verdict built on it price?' and options = '["Every overrun the project could suffer, since the sweep is run to the point where the least resilient regime stops paying back.", "The overrun at which the best regime for the contractor changes.", "The contractor present value given up between a 20 percent underspend and a 50 percent overrun, which is the range the axis claims.", "A cost overrun measured against the closing pool, because an overrun that cannot be recovered is the only kind that reaches the contractor."]'::jsonb and answer_index = 2 and explanation = 'Over those eight points Ghana - Deepwater gives up 181.1922 million USD of contractor present value and Angola - Deepwater PSC 252.6075. Until the 2026-09-15 repair the loop stopped at 1.4 and every resilience figure was understated.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex sweep on the teaching field runs eight multipliers from 0.8 to 1.5, the last of them exactly 1.5. What does the resilience verdict built on it price?', options = '["Every overrun the project could suffer, since the sweep is run to the point where the least resilient regime stops paying back.", "The overrun at which the best regime for the contractor changes.", "The contractor present value given up between a 20 percent underspend and a 50 percent overrun, which is the range the axis claims.", "A cost overrun measured against the closing pool, because an overrun that cannot be recovered is the only kind that reaches the contractor."]'::jsonb, answer_index = 2, explanation = 'Over those eight points Ghana - Deepwater gives up 181.1922 million USD of contractor present value and Angola - Deepwater PSC 252.6075. Until the 2026-09-15 repair the loop stopped at 1.4 and every resilience figure was understated.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 12: explanation
  select case
           when prompt = 'Across the swept prices on the teaching field government take climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?' and options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb and answer_index = 3 and explanation = 'A share is a ratio and not an amount. The regime whose share climbs is the progressive one, which is why Ghana - Deepwater is named the most responsive to higher prices.' then 'old'
           when prompt = 'Across the swept prices on the teaching field government take climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?' and options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb and answer_index = 3 and explanation = 'A share is a ratio and not an amount. The regime whose share climbs fastest is the progressive one, and on that field it is Brazil - Concession at 7.4752 points.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Across the swept prices on the teaching field government take climbs 1.9971 points for Ghana - Deepwater and falls 37.6994 for USA - Gulf of Mexico. What does a falling share mean?', options = '["That the government collects less money as price rises.", "That the regime is charging a sliding royalty in reverse, since only a rate that falls with price can produce a falling share.", "That the sweep has run below the range where the regime''s instruments bind, so the share is falling towards the level it holds at low price.", "That the regime hands the upside to the contractor as price rises."]'::jsonb, answer_index = 3, explanation = 'A share is a ratio and not an amount. The regime whose share climbs fastest is the progressive one, and on that field it is Brazil - Concession at 7.4752 points.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 14: explanation
  select case
           when prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?' and options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common government take, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb and answer_index = 1 and explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate of 0.0000 percent standing for two opposite things.' then 'old'
           when prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?' and options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common government take, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb and answer_index = 1 and explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate column that once printed 0.0000 percent for two opposite things.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Three habits from the Professional tier carry into a six regime comparison. What are they?', options = '["Sort on present value, then on rate of return, then on payback, so that a verdict is never made on one column alone.", "Name the base before the rate, read the closing pool before believing a cost recovery total, and write down what a zero means before quoting it.", "Convert every regime to a common government take, discount at one rate, and report the range rather than a point.", "Check the price deck, the production profile and the cost columns, since a comparison is only as good as the inputs the regimes share."]'::jsonb, answer_index = 1, explanation = 'Each habit answers a way this package has already misled a reader: a 21 percent rate that collected more than a 35 percent one, a recovery total with 2543.7575 million USD left unpaid behind it, and a rate column that once printed 0.0000 percent for two opposite things.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-professional-reading ord 15: option_3
  select case
           when prompt = 'On the teaching field under the PIA template the pool clears in year 9 and stands at 0.0000 through year 18, then reads 0.5221 million USD in year 19 and 30.5883 at the close of year 25. What reopened it?' and options = '["A second round of capex late in the life, which enters the pool whole in the year it is spent as the first round did.", "The royalty rate stepping up in year 19, which reduced revenue after royalty below the level the limit needs to clear a year''s cost.", "Revenue fell far enough that the allowance no longer covered the year''s own cost, so the shortfall began accruing again.", "The uplift on the resource rent tax, which is charged in every one of the 25 years and is added to the pool in the years the tax is zero."]'::jsonb and answer_index = 2 and explanation = 'In year 19 the allowance releases 12.3236 million USD against a cost of 12.8457, and the difference of that year and every year after it is what carries the pool to 30.5883.' then 'old'
           when prompt = 'On the teaching field under the PIA template the pool clears in year 9 and stands at 0.0000 through year 18, then reads 0.5221 million USD in year 19 and 30.5883 at the close of year 25. What reopened it?' and options = '["A second round of capex late in the life, which enters the pool whole in the year it is spent as the first round did.", "The royalty rate stepping up in year 19, which reduced revenue after royalty below the level the limit needs to clear a year''s cost.", "Revenue fell far enough that the allowance no longer covered the year''s own cost, so the shortfall began accruing again.", "The uplift on the resource rent tax, which adds whatever relief it has not used to the cost pool in the years the tax is zero."]'::jsonb and answer_index = 2 and explanation = 'In year 19 the allowance releases 12.3236 million USD against a cost of 12.8457, and the difference of that year and every year after it is what carries the pool to 30.5883.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-professional-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-professional-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the teaching field under the PIA template the pool clears in year 9 and stands at 0.0000 through year 18, then reads 0.5221 million USD in year 19 and 30.5883 at the close of year 25. What reopened it?', options = '["A second round of capex late in the life, which enters the pool whole in the year it is spent as the first round did.", "The royalty rate stepping up in year 19, which reduced revenue after royalty below the level the limit needs to clear a year''s cost.", "Revenue fell far enough that the allowance no longer covered the year''s own cost, so the shortfall began accruing again.", "The uplift on the resource rent tax, which adds whatever relief it has not used to the cost pool in the years the tax is zero."]'::jsonb, answer_index = 2, explanation = 'In year 19 the allowance releases 12.3236 million USD against a cost of 12.8457, and the difference of that year and every year after it is what carries the pool to 30.5883.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-professional-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 1: option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A tier list keyed at 60 and 80 USD per bbl is run against a deck the price never lifts above 35. What royalty rate is charged?' and options = '["No royalty at all, since the lowest threshold on the list was never reached in any year of the life and a tier nobody reaches charges nothing.", "A rate interpolated between zero and 12.5 percent according to how close the price came to the first threshold, in the way a scale that slides on price is usually taken to work.", "The first tier''s rate of 12.5 percent, in every year, because the walk initialises to it before any threshold is tested.", "The first tier''s rate, but only in the years the project is profitable, since a royalty is not charged against a loss."]'::jsonb and answer_index = 2 and explanation = 'The published case pays 18.0299 million USD on gross revenue of 144.2389 in year 1, an implied 0.125000, and 177.3774 over a life whose present value at 10 percent is negative 111.7254.' then 'old'
           when prompt = 'A tier list keyed at 60 and 80 USD per bbl is run against a deck the price never lifts above 35. What royalty rate is charged?' and options = '["No royalty at all, since the lowest threshold on the list was never reached in any year of the life and a tier nobody reaches charges nothing.", "A rate interpolated between zero and 12.5 percent according to how close the price came to the first threshold, in the way a scale that slides on price is usually taken to work.", "The lowest tier''s rate of 12.5 percent, in every year, because the selection falls back to it before any threshold is reached.", "The first tier''s rate, but only in the years the project is profitable, since a royalty is not charged against a loss."]'::jsonb and answer_index = 2 and explanation = 'The published case pays 18.0299 million USD on gross revenue of 144.2389 in year 1, an implied 0.125000, and 177.3774 over a life whose present value at 10 percent is negative 111.7254.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A tier list keyed at 60 and 80 USD per bbl is run against a deck the price never lifts above 35. What royalty rate is charged?', options = '["No royalty at all, since the lowest threshold on the list was never reached in any year of the life and a tier nobody reaches charges nothing.", "A rate interpolated between zero and 12.5 percent according to how close the price came to the first threshold, in the way a scale that slides on price is usually taken to work.", "The lowest tier''s rate of 12.5 percent, in every year, because the selection falls back to it before any threshold is reached.", "The first tier''s rate, but only in the years the project is profitable, since a royalty is not charged against a loss."]'::jsonb, answer_index = 2, explanation = 'The published case pays 18.0299 million USD on gross revenue of 144.2389 in year 1, an implied 0.125000, and 177.3774 over a life whose present value at 10 percent is negative 111.7254.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 3: option_2, prompt
  select case
           when prompt = 'The walk that picks a royalty tier keeps no memory of the tier it chose the year before. What follows on a deck whose price falls back?' and options = '["The rate holds at the highest tier the price has ever reached, in the way a real sliding scale ratchets once a threshold has been passed.", "The rate is averaged across the tiers the deck has visited, which is what keeps a royalty line smooth across a step in the price deck.", "The rate cannot fall, because the walk initialises each year to the rate it finished the year before and only tests the tiers above it.", "The rate can move up one year and down the next, since the tier is chosen fresh from that year''s own price."]'::jsonb and answer_index = 3 and explanation = 'The teaching field pays an implied 0.075000 through year 5 and 0.100000 from year 6 under the PIA tiers, and a deck falling back below 50 USD per bbl would return it to 0.075000 with nothing in the instrument to prevent it.' then 'old'
           when prompt = 'The selection that picks a royalty tier keeps no memory of the tier it chose the year before. What follows on a deck whose price falls back?' and options = '["The rate holds at the highest tier the price has ever reached, in the way a real sliding scale ratchets once a threshold has been passed.", "The rate is averaged across the tiers the deck has visited, which is what keeps a royalty line smooth across a step in the price deck.", "The rate cannot fall, because the selection starts each year from the rate it finished the year before and only tests the tiers above it.", "The rate can move up one year and down the next, since the tier is chosen fresh from that year''s own price."]'::jsonb and answer_index = 3 and explanation = 'The teaching field pays an implied 0.075000 through year 5 and 0.100000 from year 6 under the PIA tiers, and a deck falling back below 50 USD per bbl would return it to 0.075000 with nothing in the instrument to prevent it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The selection that picks a royalty tier keeps no memory of the tier it chose the year before. What follows on a deck whose price falls back?', options = '["The rate holds at the highest tier the price has ever reached, in the way a real sliding scale ratchets once a threshold has been passed.", "The rate is averaged across the tiers the deck has visited, which is what keeps a royalty line smooth across a step in the price deck.", "The rate cannot fall, because the selection starts each year from the rate it finished the year before and only tests the tiers above it.", "The rate can move up one year and down the next, since the tier is chosen fresh from that year''s own price."]'::jsonb, answer_index = 3, explanation = 'The teaching field pays an implied 0.075000 through year 5 and 0.100000 from year 6 under the PIA tiers, and a deck falling back below 50 USD per bbl would return it to 0.075000 with nothing in the instrument to prevent it.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 4: option_2, option_3
  select case
           when prompt = 'A sweep prints an applied oil price of 50.000000 USD per bbl and an implied royalty rate of 0.075000 against tiers of 0 and 50. What has happened?' and options = '["The engine has a tolerance around a threshold and treats a price within it as not yet reached.", "The printed price is a rounding of a price strictly below the threshold, such as 49.99999999999998, and the implied rate is the measurement of which side the engine was on.", "The tier list was unsorted, so the walk kept a lower tier that appeared later in the list than the one the price had reached.", "The sweep applied the multiplier to revenue but not to the price the royalty function reads, so the two columns disagree."]'::jsonb and answer_index = 1 and explanation = 'Read a printed price column as a rounding of the price the engine used, never as the price itself. The rate says which side of the threshold the run was actually on.' then 'old'
           when prompt = 'A sweep prints an applied oil price of 50.000000 USD per bbl and an implied royalty rate of 0.075000 against tiers of 0 and 50. What has happened?' and options = '["The engine has a tolerance around a threshold and treats a price within it as not yet reached.", "The printed price is a rounding of a price strictly below the threshold, such as 49.99999999999998, and the implied rate is the measurement of which side the engine was on.", "The tier list repeated a threshold, so the engine kept the lower of the two rates written at that price.", "The sweep applied its multiplier to the revenue column but not to the price the royalty function actually reads, so the two columns printed beside each other disagree by construction."]'::jsonb and answer_index = 1 and explanation = 'Read a printed price column as a rounding of the price the engine used, never as the price itself. The rate says which side of the threshold the run was actually on.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A sweep prints an applied oil price of 50.000000 USD per bbl and an implied royalty rate of 0.075000 against tiers of 0 and 50. What has happened?', options = '["The engine has a tolerance around a threshold and treats a price within it as not yet reached.", "The printed price is a rounding of a price strictly below the threshold, such as 49.99999999999998, and the implied rate is the measurement of which side the engine was on.", "The tier list repeated a threshold, so the engine kept the lower of the two rates written at that price.", "The sweep applied its multiplier to the revenue column but not to the price the royalty function actually reads, so the two columns printed beside each other disagree by construction."]'::jsonb, answer_index = 1, explanation = 'Read a printed price column as a rounding of the price the engine used, never as the price itself. The rate says which side of the threshold the run was actually on.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 5: explanation, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?' and options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1200.2886 million USD of government cash flow on that project against 764.5528 for USA, through the profit split instead."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 545.1955 for Angola. A royalty is one instrument out of four, and the take is the reading.' then 'old'
           when prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?' and options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1263.7523 million USD of government cash flow on that project against 764.5528 for USA, through the profit split instead."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 481.7318 for Angola. A royalty is one instrument out of four, and the take is the reading.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC takes 0.0000 of royalty on the default project while USA - Gulf of Mexico takes 503.7989 million USD. What does a royalty of zero say about the burden of a regime?', options = '["That the government has given up its first claim on gross revenue, which is why the contractor keeps more of this ledger under Angola than under any other template.", "That the regime has to recover cost faster, since a royalty of zero leaves the whole of gross revenue available to the recovery allowance in year 1.", "That the template is incomplete, because a production sharing contract with no royalty in it cannot express a government''s claim at all.", "Nothing on its own. Angola collects 1263.7523 million USD of government cash flow on that project against 764.5528 for USA, through the profit split instead."]'::jsonb, answer_index = 3, explanation = 'USA - Gulf of Mexico leaves the contractor 980.9313 million USD of net cash flow against 481.7318 for Angola. A royalty is one instrument out of four, and the take is the reading.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 10: explanation
  select case
           when prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?' and options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government cash flow on that case."]'::jsonb and answer_index = 2 and explanation = 'That case still pays back in year 3 and returns an internal rate of return of 54.6792 percent, because the contractor is also paid through its profit share.' then 'old'
           when prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?' and options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government cash flow on that case."]'::jsonb and answer_index = 2 and explanation = 'That case still pays back in year 3, because the contractor is also paid through its profit share, and its rate of return is null with the status multiple-roots.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A published case closes its 25 year life with 2543.7575 million USD still in the unrecovered cost pool. What is that balance worth to the contractor?', options = '["It is a receivable, so the contractor''s position should be read as the ledger total plus the 2543.7575 million USD still owed.", "It is a tax attribute, since an unrecovered balance shelters the profit share of the years that follow it.", "Nothing. The engine never pays it, nothing carries it past the horizon, and it appears in no other column.", "It is written off against government cash flow on that case."]'::jsonb, answer_index = 2, explanation = 'That case still pays back in year 3, because the contractor is also paid through its profit share, and its rate of return is null with the status multiple-roots.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 16: explanation, option_0
  select case
           when prompt = 'On the published crossing case the split falls from 0.600000 in year 2 to 0.400000 in year 3, with R factors of 1.383252 and 1.846809. Which threshold caused it?' and options = '["The 1.0 threshold, reached in year 3, which is where the golden''s own note dates the first step of the split.", "The 1.6 threshold. Crossing 1.0 happened between years 1 and 2 and changed nothing, because 60 percent was already in force.", "The 2.5 threshold, which the ratio passes in year 3 on its way to a peak above 3 later in the life.", "Both the 1.0 and the 1.6 thresholds in the same year, since the walk applies every tier it has reached and the last one wins."]'::jsonb and answer_index = 1 and explanation = 'The golden''s note misattributes its own step. Quote a golden''s numbers and never a golden''s prose, because no mechanical check reads an association.' then 'old'
           when prompt = 'On the published crossing case the split falls from 0.600000 in year 2 to 0.400000 in year 3, with R factors of 1.383252 and 1.846809. Which threshold caused it?' and options = '["The 1.0 threshold, reached in year 3, which is the first tranche the ratio meets on its way up the list.", "The 1.6 threshold. Crossing 1.0 happened between years 1 and 2 and changed nothing, because 60 percent was already in force.", "The 2.5 threshold, which the ratio passes in year 3 on its way to a peak above 3 later in the life.", "Both the 1.0 and the 1.6 thresholds in the same year, since the walk applies every tier it has reached and the last one wins."]'::jsonb and answer_index = 1 and explanation = 'Quote a case''s numbers and never the prose beside them, because no mechanical check reads the association between a number and the event it is credited with.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 16'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the published crossing case the split falls from 0.600000 in year 2 to 0.400000 in year 3, with R factors of 1.383252 and 1.846809. Which threshold caused it?', options = '["The 1.0 threshold, reached in year 3, which is the first tranche the ratio meets on its way up the list.", "The 1.6 threshold. Crossing 1.0 happened between years 1 and 2 and changed nothing, because 60 percent was already in force.", "The 2.5 threshold, which the ratio passes in year 3 on its way to a peak above 3 later in the life.", "Both the 1.0 and the 1.6 thresholds in the same year, since the walk applies every tier it has reached and the last one wins."]'::jsonb, answer_index = 1, explanation = 'Quote a case''s numbers and never the prose beside them, because no mechanical check reads the association between a number and the event it is credited with.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 18: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The tier walk keeps the split of every tier whose threshold the ratio has reached, one after another. What survives the walk?' and options = '["Whichever qualifying tier came last in the list, which is the highest threshold reached only while the list is sorted.", "Whichever qualifying tier carries the highest threshold, since the walk compares each tier against the one it would replace.", "Whichever qualifying tier carries the lowest split, because the engine resolves a tie in the government''s favour.", "Whichever tier the previous year selected, unless a new threshold has been reached since."]'::jsonb and answer_index = 0 and explanation = 'Every shipped template is sorted, so nothing is wrong today. The engine does not sort the list, does not check that thresholds ascend and raises no error, and no gate in the app checks the order.' then 'old'
           when prompt = 'A tranche list is read to choose one split for the year. Which tranche''s split survives?' and options = '["The one carrying the highest threshold the ratio has reached, because a copy of the list is sorted by threshold before it is read.", "The one that came last in the list as typed among those whose threshold was reached, since the list is read in the order it was written.", "The one carrying the lowest split among those whose threshold was reached, because the engine resolves a choice in the government''s favour.", "The one the previous year selected, unless a new threshold has been reached since."]'::jsonb and answer_index = 0 and explanation = 'Every shipped template is written sorted, so no template ledger moved. A list with two tranches at one threshold is the case the engine refuses, and it refuses it by naming the repeated threshold.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 18'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A tranche list is read to choose one split for the year. Which tranche''s split survives?', options = '["The one carrying the highest threshold the ratio has reached, because a copy of the list is sorted by threshold before it is read.", "The one that came last in the list as typed among those whose threshold was reached, since the list is read in the order it was written.", "The one carrying the lowest split among those whose threshold was reached, because the engine resolves a choice in the government''s favour.", "The one the previous year selected, unless a new threshold has been reached since."]'::jsonb, answer_index = 0, explanation = 'Every shipped template is written sorted, so no template ledger moved. A list with two tranches at one threshold is the case the engine refuses, and it refuses it by naming the repeated threshold.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 21: explanation, option_0, option_1, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Isolated on the default project, a corporate income tax of 34 percent collects 502.1091 million USD over the life and a resource rent tax of 40 percent collects 62.5794. What makes the second so much smaller?' and options = '["Its base is the profit share less 20 percent of the whole 500.0000 million USD of capex, and that subtraction is made in every one of the 25 years.", "Its base is the profit share less the cost recovered in the year, which on this project comes to 941.4436 million USD over the life.", "It is charged only in the years after the recovery pool has cleared, and the pool clears late on this project.", "It is charged on the government''s share of profit oil, which is the smaller side of the split on this regime."]'::jsonb and answer_index = 0 and explanation = 'At the default uplift the relief over the life is five times the whole capex, which the engine''s own comment calls a screening approximation. The charge is back to 0.0000 by year 9.' then 'old'
           when prompt = 'Isolated on the default project, a corporate income tax of 34 percent collects 502.1091 million USD over the life and a resource rent tax of 40 percent collects 350.7165. What makes the second the smaller?' and options = '["It draws relief from a pool of 1.2 times the 500.0000 million USD of capex before it charges anything, so its first positive charge falls only in year 7.", "Its base is the profit share less the cost recovered in that same year, and the cost recovered on this project comes to 941.4436 million USD over the whole of the life.", "It is charged only in the years after the recovery pool has cleared, and the pool clears late on this project.", "It is charged on the government''s share of profit oil, which is the smaller side of the split on this regime."]'::jsonb and answer_index = 0 and explanation = 'The pool is drawn against the profit share and never refilled, so the column reads 0.0000 for six years and then charges the full rate on the whole base.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 21'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Isolated on the default project, a corporate income tax of 34 percent collects 502.1091 million USD over the life and a resource rent tax of 40 percent collects 350.7165. What makes the second the smaller?', options = '["It draws relief from a pool of 1.2 times the 500.0000 million USD of capex before it charges anything, so its first positive charge falls only in year 7.", "Its base is the profit share less the cost recovered in that same year, and the cost recovered on this project comes to 941.4436 million USD over the whole of the life.", "It is charged only in the years after the recovery pool has cleared, and the pool clears late on this project.", "It is charged on the government''s share of profit oil, which is the smaller side of the split on this regime."]'::jsonb, answer_index = 0, explanation = 'The pool is drawn against the profit share and never refilled, so the column reads 0.0000 for six years and then charges the full rate on the whole base.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 22: explanation, prompt
  select case
           when prompt = 'A sweep of the resource rent tax uplift reports a government cash flow of 331.2721 million USD at the default 20 percent. Why is that not the regime''s government cash flow on that project?' and options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb and answer_index = 2 and explanation = 'The published take for that regime on the default project is 833.3812 million USD. Sections 10 and 11 carry the stack; the sweep carries an isolation.' then 'old'
           when prompt = 'A sweep of the resource rent tax uplift reports a government cash flow of 619.4093 million USD at the default 20 percent. Why is that not the regime''s government cash flow on that project?' and options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb and answer_index = 2 and explanation = 'The published take for that regime on the default project is 1121.5184 million USD. The sweep prints an isolation of one instrument and never the stack.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 22'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A sweep of the resource rent tax uplift reports a government cash flow of 619.4093 million USD at the default 20 percent. Why is that not the regime''s government cash flow on that project?', options = '["The sweep reports take before royalty, which has to be added back before the figure can be compared with a published one.", "The sweep runs a different project, so its columns are not comparable with the default project at all.", "The sweep sets the template''s own corporate income tax of 34 percent to zero in every row, so the take it prints is one instrument short.", "The sweep reports the discounted take, which is why it is smaller than the published figure on the same regime."]'::jsonb, answer_index = 2, explanation = 'The published take for that regime on the default project is 1121.5184 million USD. The sweep prints an isolation of one instrument and never the stack.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 27: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Two published cases report an internal rate of return of 0.0000 percent, one worth 25.6198 million USD at 10 percent and one worth negative 16.5289. What do the two zeros mean?' and options = '["Both projects break even exactly, which is what a rate of zero reports and why the two present values straddle zero.", "One project never loses, because its flows never change sign, and the other never wins, because its only root is negative.", "One is a genuine root and the other is the guard, so only the case with the positive present value can be read as a rate.", "Both are the doubling bracket collapsing to its lower bound, which is what the search returns when it cannot bracket a root."]'::jsonb and answer_index = 1 and explanation = 'The function prints the same four characters for both, and a reader who takes 0.0000 for break even has it backwards in both directions at once.' then 'old'
           when prompt = 'Two published cases have their only root ABOVE the band: -1 then 2000, whose root is 199900 percent, and -100 then 1500, whose root is 1400 percent. What does the engine report for each, and which one would the retired rule have printed a rate for?' and options = '["A rate for both, 199900 and 1400 percent, because a root that exists is reported wherever it lies and only a missing root gives null.", "Null with the status above-clamp for both, and the retired bisection would have printed 1400 percent for the second, because that root sat inside the doubling bracket it searched.", "Null with the status no-root for both, because a rate above the band is treated exactly as a rate that does not exist at all anywhere.", "Null for the first and 1400 percent for the second, because the band is applied to the search range rather than to the answer the search returns."]'::jsonb and answer_index = 1 and explanation = 'The band runs from -99 to 1000 percent and a root outside it is not a rate the engine will name, so both are null with the status above-clamp and irrRootAboveBand set. The distinction worth carrying is what the retired rule did: it doubled from 100 percent to 102400, so it reported 102400 for the first, whose root is past even that, and it reported the real 1400 percent for the second, whose root sat inside the bracket.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 27'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two published cases have their only root ABOVE the band: -1 then 2000, whose root is 199900 percent, and -100 then 1500, whose root is 1400 percent. What does the engine report for each, and which one would the retired rule have printed a rate for?', options = '["A rate for both, 199900 and 1400 percent, because a root that exists is reported wherever it lies and only a missing root gives null.", "Null with the status above-clamp for both, and the retired bisection would have printed 1400 percent for the second, because that root sat inside the doubling bracket it searched.", "Null with the status no-root for both, because a rate above the band is treated exactly as a rate that does not exist at all anywhere.", "Null for the first and 1400 percent for the second, because the band is applied to the search range rather than to the answer the search returns."]'::jsonb, answer_index = 1, explanation = 'The band runs from -99 to 1000 percent and a root outside it is not a rate the engine will name, so both are null with the status above-clamp and irrRootAboveBand set. The distinction worth carrying is what the retired rule did: it doubled from 100 percent to 102400, so it reported 102400 for the first, whose root is past even that, and it reported the real 1400 percent for the second, whose root sat inside the bracket.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 28: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Flows of negative 1 then 2000 return 102400.0000 percent from the solver. What should a reader do with that figure?' and options = '["Quote it as the rate, since the golden records the same value and the two therefore agree.", "Halve it, because the bracket the doubling reached always overshoots the root by a factor of two.", "Treat it as the top of the doubling search rather than a rate, because the true root is 199900.0000 percent.", "Read it as an error code, since a solver that fails to converge in 80 bisections signals the failure through the return value."]'::jsonb and answer_index = 2 and explanation = 'The tell is a suspiciously round number where a rate should be. A rate that came out of 80 bisections looks like 13.0662 percent.' then 'old'
           when prompt = 'Flows of negative 1 then 2000 have a root at 199900.0000 percent. What does the solver return for them, and why?' and options = '["199900.0000 percent, since the root is exact and the band is a search hint rather than a limit on what may be reported.", "1000.0000 percent, the top of the band, because a root above the band is reported at the boundary it passed.", "Null with the status above-clamp, because the only root lies beyond the top of the band the engine will search.", "A rate read off the top of a doubling search, since that is what the solver falls back on when no root is bracketed."]'::jsonb and answer_index = 2 and explanation = 'A root above the band is not a rate the engine will name. The published case with flows of negative 100 then 1500, whose root is 1400.0000 percent, carries the same status.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 28'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Flows of negative 1 then 2000 have a root at 199900.0000 percent. What does the solver return for them, and why?', options = '["199900.0000 percent, since the root is exact and the band is a search hint rather than a limit on what may be reported.", "1000.0000 percent, the top of the band, because a root above the band is reported at the boundary it passed.", "Null with the status above-clamp, because the only root lies beyond the top of the band the engine will search.", "A rate read off the top of a doubling search, since that is what the solver falls back on when no root is bracketed."]'::jsonb, answer_index = 2, explanation = 'A root above the band is not a rate the engine will name. The published case with flows of negative 100 then 1500, whose root is 1400.0000 percent, carries the same status.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 29: explanation, option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A comparison is filtered to regimes returning more than a threshold rate. What does that filter remove?' and options = '["Only the projects whose present value at a rate of zero is negative, which is the second of the solver''s two guards.", "The projects whose rate is a reported bracket rather than a root, because a bound is always above any sensible threshold.", "Nothing that matters, provided the threshold sits below the lowest genuine rate returned.", "The hopeless projects and the ones that never needed capital together, since both report 0.0000 percent."]'::jsonb and answer_index = 3 and explanation = 'The case with capex of 20000 reports 0.0000 percent on a contractor net cash flow of negative 15724.0151 million USD, and a case with no outlay at all reports the same figure.' then 'old'
           when prompt = 'A comparison is filtered to regimes returning more than a threshold rate. What does that filter remove?' and options = '["Only the projects whose present value at a rate of zero is negative, which is one of the four statuses the engine records.", "The projects whose rate is the edge of a search rather than a root, because such a rate is always above any sensible threshold.", "Nothing that matters, provided the threshold sits below the lowest genuine rate returned.", "Every regime whose rate is null, which puts the hopeless projects and the ones that never needed capital on the same side of the line."]'::jsonb and answer_index = 3 and explanation = 'The case with capex of 20000 comes back null with the status no-root, on a contractor net cash flow of negative 15724.0151 million USD, and a case with no outlay at all comes back null with the status no-sign-change.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 29'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A comparison is filtered to regimes returning more than a threshold rate. What does that filter remove?', options = '["Only the projects whose present value at a rate of zero is negative, which is one of the four statuses the engine records.", "The projects whose rate is the edge of a search rather than a root, because such a rate is always above any sensible threshold.", "Nothing that matters, provided the threshold sits below the lowest genuine rate returned.", "Every regime whose rate is null, which puts the hopeless projects and the ones that never needed capital on the same side of the line."]'::jsonb, answer_index = 3, explanation = 'The case with capex of 20000 comes back null with the status no-root, on a contractor net cash flow of negative 15724.0151 million USD, and a case with no outlay at all comes back null with the status no-sign-change.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 37: explanation, option_1, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Two runs of the same regime on the same project differ only in the resource rent tax uplift, one taking the default and one set to 0. Present value at 10 percent is 961.7819 million USD against 473.7983 and the rate of return 107.2817 percent against 72.4998. What moved them?' and options = '["The discount rate, since the two runs are reported at different rates and only one of them is the project''s own.", "One field left out of the inputs, which took its documented default of 20 percent and sheltered part of the base in every year.", "The cost recovery limit, which is the only input that can move a present value and a rate of return together on one project.", "A minimum tax that bound in one run and not the other, which changed the years the charge falls in and therefore the discounting."]'::jsonb and answer_index = 1 and explanation = 'Total tax is 1638.5664 million USD against 2607.5549. A default that decides half a present value is worth reading in the inputs and not in the output.' then 'old'
           when prompt = 'Two runs of the same regime on the same project differ only in the resource rent tax uplift, one taking the default and one set to 0. Total tax is 2127.5549 million USD against 2207.5549 and present value at 10 percent 831.8148 against 777.1737. What moved them?' and options = '["The discount rate, since the two runs are reported at different rates and only one of them is the project''s own.", "One field left out of the inputs, which took its documented default of 20 percent and opened the larger of the two relief pools.", "The cost recovery limit, which is the only input that can move a present value and a total tax together on one project.", "A minimum tax that bound in one run and not the other, which changed the years the charge falls in and therefore the discounting."]'::jsonb and answer_index = 1 and explanation = 'The two ledgers differ in one year only, year 4, at 169.6803 against 249.6803 million USD. A default worth 80 million USD of tax is worth reading in the inputs and not in the output.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 37'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two runs of the same regime on the same project differ only in the resource rent tax uplift, one taking the default and one set to 0. Total tax is 2127.5549 million USD against 2207.5549 and present value at 10 percent 831.8148 against 777.1737. What moved them?', options = '["The discount rate, since the two runs are reported at different rates and only one of them is the project''s own.", "One field left out of the inputs, which took its documented default of 20 percent and opened the larger of the two relief pools.", "The cost recovery limit, which is the only input that can move a present value and a total tax together on one project.", "A minimum tax that bound in one run and not the other, which changed the years the charge falls in and therefore the discounting."]'::jsonb, answer_index = 1, explanation = 'The two ledgers differ in one year only, year 4, at 169.6803 against 249.6803 million USD. A default worth 80 million USD of tax is worth reading in the inputs and not in the output.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 38: option_1, option_2, prompt
  select case
           when prompt = 'One published run returns 2.9910 percent, reaches payback only in year 12 and closes at negative 111.7254 million USD of present value, and it still hands over 177.3774 of royalty. What do those readings show together?' and options = '["That the royalty is the reason the rate of return is so low, since an instrument charged before cost is what a marginal project cannot carry.", "That the rate of return is the binding reading, because a charge on revenue is waived in any year a project earns less than its discount rate.", "That the two readings belong to different runs, since a project returning a positive rate of return cannot also carry a negative present value.", "A royalty is charged on gross revenue whether or not the project makes money."]'::jsonb and answer_index = 3 and explanation = 'The royalty collected is more than twice the contractor''s whole lifetime cash flow of 80.8085 million USD. The instrument sees a price, picks a rate and charges gross revenue.' then 'old'
           when prompt = 'One published run reaches payback only in year 12, closes at negative 111.7254 million USD of present value and is given no rate of return at all, and it still hands over 177.3774 of royalty. What do those readings show together?' and options = '["That the royalty is the reason the rate of return is so low, since an instrument charged before cost is what a marginal project cannot carry.", "That the present value is the binding reading, because a charge on revenue is waived in any year a project earns less than its discount rate.", "That the two readings belong to different runs, since a project that pays back at all cannot also carry a negative present value.", "A royalty is charged on gross revenue whether or not the project makes money."]'::jsonb and answer_index = 3 and explanation = 'The royalty collected is more than twice the contractor''s whole lifetime cash flow of 80.8085 million USD. The instrument sees a price, picks a rate and charges gross revenue.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 38'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'One published run reaches payback only in year 12, closes at negative 111.7254 million USD of present value and is given no rate of return at all, and it still hands over 177.3774 of royalty. What do those readings show together?', options = '["That the royalty is the reason the rate of return is so low, since an instrument charged before cost is what a marginal project cannot carry.", "That the present value is the binding reading, because a charge on revenue is waived in any year a project earns less than its discount rate.", "That the two readings belong to different runs, since a project that pays back at all cannot also carry a negative present value.", "A royalty is charged on gross revenue whether or not the project makes money."]'::jsonb, answer_index = 3, explanation = 'The royalty collected is more than twice the contractor''s whole lifetime cash flow of 80.8085 million USD. The instrument sees a price, picks a rate and charges gross revenue.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 39: option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool, reports a contractor net cash flow of negative 15724.0151 and an internal rate of return of 0.0000 percent. Which guard produced the rate?' and options = '["The sign change check, since a ledger with no positive contractor cash flow in any year never changes sign.", "The bracketing step, which returned its lower bound because the present value was negative across the whole search.", "The check on the present value at a rate of zero, which is not above zero here, so the engine reports 0 rather than a negative rate.", "None of them. The rate is a genuine root, and a project that recovers exactly its outlay returns zero."]'::jsonb and answer_index = 2 and explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government cash flow is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.' then 'old'
           when prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool and reports a contractor net cash flow of negative 15724.0151. What does its rate of return column say?' and options = '["Null, with the status no-sign-change, since a ledger carrying no positive contractor cash flow in any year never changes sign.", "0.0000 percent, from the check on the present value at a rate of zero, which is not above zero on this ledger.", "Null, with the status no-root, because no rate from negative 99 to 1000 percent brings its present value to zero.", "A negative rate, since a project that never recovers its outlay solves to a root below zero."]'::jsonb and answer_index = 2 and explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government cash flow is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 39'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A test project run at 20000 of capex closes with 15724.0151 million USD in the pool and reports a contractor net cash flow of negative 15724.0151. What does its rate of return column say?', options = '["Null, with the status no-sign-change, since a ledger carrying no positive contractor cash flow in any year never changes sign.", "0.0000 percent, from the check on the present value at a rate of zero, which is not above zero on this ledger.", "Null, with the status no-root, because no rate from negative 99 to 1000 percent brings its present value to zero.", "A negative rate, since a project that never recovers its outlay solves to a root below zero."]'::jsonb, answer_index = 2, explanation = 'Present value at 10 percent is negative 15453.8510 million USD, government cash flow is 875.1492 and all of it is royalty, because royalty does not wait for cost to be recovered.'
     where app_slug = 'fiscal' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- --------------------------------------------- the tier assertions --
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC2 recut refused: the Professional tier holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'intermediate' and not active;
  if v_count <> 0 then raise exception 'EC2 recut refused: % Professional question(s) are inactive', v_count; end if;

  select count(*) into v_count from (
    select scope, module_key, count(*) as n from public.academy_quiz_questions
     where app_slug = 'fiscal' and tier = 'intermediate' group by 1, 2
  ) b where (b.scope = 'module' and b.n <> 15) or (b.scope = 'final' and b.n <> 42);
  if v_count <> 0 then raise exception 'EC2 recut refused: % Professional bank(s) are not 15 (module) or 42 (final)', v_count; end if;

  -- Every option array is still four options and every key still points
  -- inside it: a rewritten options array that lost an entry would grade
  -- an answer that is no longer there.
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'intermediate'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index >= jsonb_array_length(options));
  if v_count <> 0 then raise exception 'EC2 recut refused: % Professional question(s) have a bad option array or key index', v_count; end if;

  raise notice 'EC2 recut intermediate: % of 48 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-the-sliding-scale', 4),
    ('module', 'm01-the-sliding-scale', 12),
    ('module', 'm01-the-sliding-scale', 13),
    ('module', 'm01-the-sliding-scale', 14),
    ('module', 'm02-cost-recovery', 2),
    ('module', 'm02-cost-recovery', 3),
    ('module', 'm02-cost-recovery', 8),
    ('module', 'm03-the-r-factor', 3),
    ('module', 'm03-the-r-factor', 4),
    ('module', 'm03-the-r-factor', 8),
    ('module', 'm03-the-r-factor', 11),
    ('module', 'm04-the-tax-stack', 3),
    ('module', 'm04-the-tax-stack', 5),
    ('module', 'm04-the-tax-stack', 6),
    ('module', 'm04-the-tax-stack', 7),
    ('module', 'm04-the-tax-stack', 8),
    ('module', 'm04-the-tax-stack', 9),
    ('module', 'm05-rate-and-return', 3),
    ('module', 'm05-rate-and-return', 7),
    ('module', 'm05-rate-and-return', 8),
    ('module', 'm05-rate-and-return', 9),
    ('module', 'm05-rate-and-return', 10),
    ('module', 'm05-rate-and-return', 11),
    ('module', 'm05-rate-and-return', 12),
    ('module', 'm05-rate-and-return', 13),
    ('module', 'm05-rate-and-return', 14),
    ('module', 'm05-rate-and-return', 15),
    ('module', 'm06-the-professional-reading', 2),
    ('module', 'm06-the-professional-reading', 6),
    ('module', 'm06-the-professional-reading', 11),
    ('module', 'm06-the-professional-reading', 12),
    ('module', 'm06-the-professional-reading', 14),
    ('module', 'm06-the-professional-reading', 15),
    ('final', null::text, 1),
    ('final', null::text, 3),
    ('final', null::text, 4),
    ('final', null::text, 5),
    ('final', null::text, 10),
    ('final', null::text, 16),
    ('final', null::text, 18),
    ('final', null::text, 21),
    ('final', null::text, 22),
    ('final', null::text, 27),
    ('final', null::text, 28),
    ('final', null::text, 29),
    ('final', null::text, 37),
    ('final', null::text, 38),
    ('final', null::text, 39)
)
select 'ec2 recut intermediate' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       q.answer_index,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fiscal' and q.tier = 'intermediate'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec2 recut intermediate' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fiscal' and tier = 'intermediate'
 group by scope, module_key
 order by scope desc, module_key nulls last;
