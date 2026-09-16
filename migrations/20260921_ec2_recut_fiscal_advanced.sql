-- ==========================================================================
-- EC2 RECUT, EXPERT TIER (advanced): Fiscal Regime Design (fiscal)
-- question bank brought to the repaired engines.
--
-- WHY. Engines #183 to #194 (engines main 709172f) repaired the economics
-- the two live Economics courses teach. The live bank was cut against the
-- retired engine, so its moved figures are wrong, some keyed answers assert
-- a rule that no longer holds, and some stems rest on a premise the repair
-- removed. PR #133 moved the capstone answers; this file is the bank.
--
-- WHAT MOVES. 70 of the 132 Expert questions, 40 of them with a
-- changed keyed answer TEXT and 0 with a changed answer INDEX. No ord, no
-- module key, no scope and no row count moves.
-- Fields rewritten: 44 prompt, 135 options, 53 explanation (232 field edits).
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

  -- m01-six-regimes-at-once ord 3: option_3
  select case
           when prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?' and options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government cash flow ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 43.0919 is an error."]'::jsonb and answer_index = 1 and explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.' then 'old'
           when prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?' and options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government cash flow ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 44.0823 is an error."]'::jsonb and answer_index = 1 and explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-six-regimes-at-once ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The summary comes back sorted. What can be read off a row''s position, and what tie break applies when two regimes match?', options = '["Contractor NPV descending, with the payback year as the secondary key wherever two NPVs are equal.", "Contractor NPV descending and nothing else, and there is no secondary key at all, so equal NPVs keep the order they were passed in.", "Contractor NPV descending and government cash flow ascending together, since the two mirror each other.", "The internal rate of return descending, so rank 2 at 40.2125 percent above rank 3 at 44.0823 is an error."]'::jsonb, answer_index = 1, explanation = 'summary[0] is the best regime for the contractor and nothing else can be read off a position, and the comparison exposes no option to sort on another column.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m01-six-regimes-at-once ord 4: explanation, prompt
  select case
           when prompt = 'On the default project rank 2 returns an internal rate of return of 40.2125 percent and rank 3 returns 43.0919 percent. What has gone wrong?' and options = '["The two rates were solved at different discount rates, because the bisection reruns each regime against its own hurdle.", "The rank 2 regime failed to converge, so the solver reported the edge of its own bracket in that row instead of a root.", "The rows were ordered on the payback year, which puts a regime with a later payout above one with a higher rate.", "Nothing at all."]'::jsonb and answer_index = 3 and explanation = 'Generic Royalty/Tax leads on NPV at 397.0445 million USD with a rate of 44.6574 percent, and Brazil - Concession sits at rank 3 with 357.8728 and 43.0919, so the higher rate and the higher NPV belong to different regimes.' then 'old'
           when prompt = 'On the default project rank 2 returns an internal rate of return of 40.2125 percent and rank 3 returns 44.0823 percent. What has gone wrong?' and options = '["The two rates were solved at different discount rates, because the bisection reruns each regime against its own hurdle.", "The rank 2 regime failed to converge, so the solver reported the edge of its own bracket in that row instead of a root.", "The rows were ordered on the payback year, which puts a regime with a later payout above one with a higher rate.", "Nothing at all."]'::jsonb and answer_index = 3 and explanation = 'Generic Royalty/Tax leads on NPV at 397.0445 million USD with a rate of 44.6574 percent, and Brazil - Concession sits at rank 3 with 287.2804 and 44.0823, so the higher rate and the higher NPV belong to different regimes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-six-regimes-at-once ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the default project rank 2 returns an internal rate of return of 40.2125 percent and rank 3 returns 44.0823 percent. What has gone wrong?', options = '["The two rates were solved at different discount rates, because the bisection reruns each regime against its own hurdle.", "The rank 2 regime failed to converge, so the solver reported the edge of its own bracket in that row instead of a root.", "The rows were ordered on the payback year, which puts a regime with a later payout above one with a higher rate.", "Nothing at all."]'::jsonb, answer_index = 3, explanation = 'Generic Royalty/Tax leads on NPV at 397.0445 million USD with a rate of 44.6574 percent, and Brazil - Concession sits at rank 3 with 287.2804 and 44.0823, so the higher rate and the higher NPV belong to different regimes.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m01-six-regimes-at-once ord 8: prompt
  select case
           when prompt = 'Angola - Deepwater PSC pays 181.7318 million USD of tax on the default project inside a take of 1200.2886, and its government share of net revenue reads 53.4534 percent. What is the column counting?' and options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.' then 'old'
           when prompt = 'Angola - Deepwater PSC pays 245.1955 million USD of tax on the default project inside a take of 1263.7523, and its government share of net revenue reads 56.2797 percent. What is the column counting?' and options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb and answer_index = 3 and explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m01-six-regimes-at-once ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC pays 245.1955 million USD of tax on the default project inside a take of 1263.7523, and its government share of net revenue reads 56.2797 percent. What is the column counting?', options = '["The corporate income tax of 25 percent and the resource rent tax of 50 percent, weighted by the years each of them was actually charged.", "Tax over the contractor''s profit share, which is the statutory rate this template was built to reproduce on a deepwater block.", "The share of gross revenue the state received, which is why it exceeds 25 percent.", "Royalty, the government''s profit oil share and tax together, so most of what it counts is not tax."]'::jsonb, answer_index = 3, explanation = 'USA - Gulf of Mexico is clearer still: its only tax is corporate income tax at 21 percent, its column reads 34.0485 percent, and a flat royalty contributes 503.7989 million USD of the 764.5528 collected.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-six-regimes-at-once' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m01-six-regimes-at-once ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 3: explanation
  select case
           when prompt = 'At 40 USD per bbl the Designer''s default production sharing regime leaves 5.9578 million USD of cost unrecovered at the end of the life. What does that say?' and options = '["The cost recovery limit binds hard at the bottom of the sweep, and the pool closes to 0.7642 at 50 and to 0.0000 from 60 upward.", "The pool carries forward past the horizon, so the contractor recovers the remainder in the following licence period.", "The engine wrote the remainder off as an abandonment provision, which is what makes the NPV smaller than the loss.", "Cost recovery was capped by the profit oil split rather than by the limit, since a low price walks the R factor into a generous tranche."]'::jsonb and answer_index = 0 and explanation = 'A limit that never binds at the deck price binds at 40 USD per bbl, where NPV is -51.1673 million USD and the internal rate of return is 6.6994 percent.' then 'old'
           when prompt = 'At 40 USD per bbl the Designer''s default production sharing regime leaves 5.9578 million USD of cost unrecovered at the end of the life. What does that say?' and options = '["The cost recovery limit binds hard at the bottom of the sweep, and the pool closes to 0.7642 at 50 and to 0.0000 from 60 upward.", "The pool carries forward past the horizon, so the contractor recovers the remainder in the following licence period.", "The engine wrote the remainder off as an abandonment provision, which is what makes the NPV smaller than the loss.", "Cost recovery was capped by the profit oil split rather than by the limit, since a low price walks the R factor into a generous tranche."]'::jsonb and answer_index = 0 and explanation = 'A limit that never binds at the deck price binds at 40 USD per bbl, where NPV is -51.1673 million USD and the engine names no internal rate of return at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At 40 USD per bbl the Designer''s default production sharing regime leaves 5.9578 million USD of cost unrecovered at the end of the life. What does that say?', options = '["The cost recovery limit binds hard at the bottom of the sweep, and the pool closes to 0.7642 at 50 and to 0.0000 from 60 upward.", "The pool carries forward past the horizon, so the contractor recovers the remainder in the following licence period.", "The engine wrote the remainder off as an abandonment provision, which is what makes the NPV smaller than the loss.", "Cost recovery was capped by the profit oil split rather than by the limit, since a low price walks the R factor into a generous tranche."]'::jsonb, answer_index = 0, explanation = 'A limit that never binds at the deck price binds at 40 USD per bbl, where NPV is -51.1673 million USD and the engine names no internal rate of return at all.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 4: explanation
  select case
           when prompt = 'The nine published price runs are named price_40_pia_default through price_120_pia_default. Which regime do they actually run?' and options = '["The Nigeria - PIA (2021) template, which is why the 70 point returns that template''s NPV of 154.8286 million USD on the default project.", "All six templates at once, with the PIA row published at each price and the other five rows computed and then discarded.", "The Nigeria - PIA (2021) template on the test project, the one project whose first deck point is not 70 USD per bbl.", "The Designer''s own default regime, id 1, Nigerian PIA (PSC)."]'::jsonb and answer_index = 3 and explanation = 'The template and the Designer regime share a country and nothing else: cost recovery at 70 percent against 80, and royalty from 12.5 percent against 7.5 percent. The template returns 154.8286 million USD on that project and the Designer regime 173.4150.' then 'old'
           when prompt = 'The nine published price runs are named price_40_pia_default through price_120_pia_default. Which regime do they actually run?' and options = '["The Nigeria - PIA (2021) template, which is why the 70 point returns that template''s NPV of 154.8286 million USD on the default project.", "All six templates at once, with the PIA row published at each price and the other five rows computed and then discarded.", "The Nigeria - PIA (2021) template on the test project, the one project whose first deck point is not 70 USD per bbl.", "The Designer''s own default regime, id 1, Nigerian PIA (PSC)."]'::jsonb and answer_index = 3 and explanation = 'The template and the Designer regime share a country and nothing else: cost recovery at 70 percent against 80, and royalty from 12.5 percent against 7.5 percent. The template returns 154.8286 million USD on that project and the Designer regime 169.7176.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The nine published price runs are named price_40_pia_default through price_120_pia_default. Which regime do they actually run?', options = '["The Nigeria - PIA (2021) template, which is why the 70 point returns that template''s NPV of 154.8286 million USD on the default project.", "All six templates at once, with the PIA row published at each price and the other five rows computed and then discarded.", "The Nigeria - PIA (2021) template on the test project, the one project whose first deck point is not 70 USD per bbl.", "The Designer''s own default regime, id 1, Nigerian PIA (PSC)."]'::jsonb, answer_index = 3, explanation = 'The template and the Designer regime share a country and nothing else: cost recovery at 70 percent against 80, and royalty from 12.5 percent against 7.5 percent. The template returns 154.8286 million USD on that project and the Designer regime 169.7176.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 9: explanation
  select case
           when prompt = 'The sweep reports a climb for each regime. What quantity is that?' and options = '["The average slope against price, fitted across all nine swept points.", "The rise from the curve''s minimum to its maximum, wherever those fall.", "The last swept share minus the first, at full precision, which is two of the nine points.", "The change in share per 10 USD per bbl around the deck price."]'::jsonb and answer_index = 2 and explanation = 'On the default project the climbs run from 12.1305 percentage points for Angola - Deepwater PSC down to -17.2498 for USA - Gulf of Mexico.' then 'old'
           when prompt = 'The sweep reports a climb for each regime. What quantity is that?' and options = '["The average slope against price, fitted across all nine swept points.", "The rise from the curve''s minimum to its maximum, wherever those fall.", "The last swept share minus the first, at full precision, which is two of the nine points.", "The change in share per 10 USD per bbl around the deck price."]'::jsonb and answer_index = 2 and explanation = 'On the default project the climbs run from 20.5076 percentage points for Brazil - Concession down to -17.2498 for USA - Gulf of Mexico.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The sweep reports a climb for each regime. What quantity is that?', options = '["The average slope against price, fitted across all nine swept points.", "The rise from the curve''s minimum to its maximum, wherever those fall.", "The last swept share minus the first, at full precision, which is two of the nine points.", "The change in share per 10 USD per bbl around the deck price."]'::jsonb, answer_index = 2, explanation = 'On the default project the climbs run from 20.5076 percentage points for Brazil - Concession down to -17.2498 for USA - Gulf of Mexico.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 10: option_0, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Brazil - Concession climbs 6.0391 percentage points on the default project and is not rising. How are both true?' and options = '["It falls from 50.0329 to 46.6052 over the first three points and only then turns, so the climb is measured from the far side of its own minimum.", "The climb is computed on the test project while the nine plotted points belong to the default project.", "Its resource rent tax at 40 percent is charged only above 90 USD per bbl, so the first three points sit outside the regime.", "The climb includes a capex multiplier of 1.5 that the chart itself does not plot."]'::jsonb and answer_index = 0 and explanation = 'An endpoint difference cannot report a shape. Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'old'
           when prompt = 'Angola - Deepwater PSC climbs 19.6873 percentage points on the default project and is not simply rising. How are both true?' and options = '["It falls from 63.4520 to 59.5510 over the first interval and only then turns, so the climb is measured from the far side of its own minimum.", "The climb is computed on the test project while the nine plotted points belong to the default project.", "Its resource rent tax at 50 percent is charged only above 90 USD per bbl, so the first two points sit outside the regime.", "The climb includes a capex multiplier of 1.5 that the chart itself does not plot."]'::jsonb and answer_index = 0 and explanation = 'An endpoint difference cannot report a shape. Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC climbs 19.6873 percentage points on the default project and is not simply rising. How are both true?', options = '["It falls from 63.4520 to 59.5510 over the first interval and only then turns, so the climb is measured from the far side of its own minimum.", "The climb is computed on the test project while the nine plotted points belong to the default project.", "Its resource rent tax at 50 percent is charged only above 90 USD per bbl, so the first two points sit outside the regime.", "The climb includes a capex multiplier of 1.5 that the chart itself does not plot."]'::jsonb, answer_index = 0, explanation = 'An endpoint difference cannot report a shape. Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 11: prompt
  select case
           when prompt = 'Angola - Deepwater PSC climbs 12.1305 percentage points on the default project and -14.8244 on ODIDI with all four of its instruments unchanged. What moved?' and options = '["The discount rate, 10 percent on one field and 12 percent on the other, which reweights the share at every price.", "The field: a different decline, a different deck and a different cost stack change where cost recovery still binds across the range.", "The template, since ODIDI is run against the Designer''s own two regimes rather than against the six templates.", "The swept prices, which are set from each project''s own first deck point and are therefore lower on ODIDI."]'::jsonb and answer_index = 1 and explanation = 'The sweep visits the same nine prices on both fields and the shares are undiscounted lifetime totals, so only the project underneath them differs.' then 'old'
           when prompt = 'Angola - Deepwater PSC climbs 19.6873 percentage points on the default project and -8.3874 on ODIDI with all four of its instruments unchanged. What moved?' and options = '["The discount rate, 10 percent on one field and 12 percent on the other, which reweights the share at every price.", "The field: a different decline, a different deck and a different cost stack change where cost recovery still binds across the range.", "The template, since ODIDI is run against the Designer''s own two regimes rather than against the six templates.", "The swept prices, which are set from each project''s own first deck point and are therefore lower on ODIDI."]'::jsonb and answer_index = 1 and explanation = 'The sweep visits the same nine prices on both fields and the shares are undiscounted lifetime totals, so only the project underneath them differs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC climbs 19.6873 percentage points on the default project and -8.3874 on ODIDI with all four of its instruments unchanged. What moved?', options = '["The discount rate, 10 percent on one field and 12 percent on the other, which reweights the share at every price.", "The field: a different decline, a different deck and a different cost stack change where cost recovery still binds across the range.", "The template, since ODIDI is run against the Designer''s own two regimes rather than against the six templates.", "The swept prices, which are set from each project''s own first deck point and are therefore lower on ODIDI."]'::jsonb, answer_index = 1, explanation = 'The sweep visits the same nine prices on both fields and the shares are undiscounted lifetime totals, so only the project underneath them differs.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m02-the-price-sweep ord 14: explanation
  select case
           when prompt = 'On the Designer''s two default regimes at the deck''s own first year price, Concessionary (Royalty/Tax) reads 46.3452 in one place and 59.6210 in another. What separates those two figures?' and options = '["The table adds total capex back into the contractor''s side of the denominator and the chart does not.", "The chart is computed at the swept price and the table at the deck price, which are not the same price.", "The chart counts the government''s profit oil share as well as tax and the table counts tax alone.", "The chart is undiscounted while the table is discounted at 10 percent."]'::jsonb and answer_index = 0 and explanation = 'Both are the same ratio on the same cash flows and only the add-back differs. The gap on that row is 13.2758 percentage points, and on Nigerian PIA (PSC) it is 15.9091.' then 'old'
           when prompt = 'On the Designer''s two default regimes at the deck''s own first year price, Concessionary (Royalty/Tax) reads 46.3452 in one place and 59.6210 in another. What separates those two figures?' and options = '["The table adds total capex back into the contractor''s side of the denominator and the chart does not.", "The chart is computed at the swept price and the table at the deck price, which are not the same price.", "The chart counts the government''s profit oil share as well as tax and the table counts tax alone.", "The chart is undiscounted while the table is discounted at 10 percent."]'::jsonb and answer_index = 0 and explanation = 'Both are the same ratio on the same cash flows and only the add-back differs. The gap on that row is 13.2758 percentage points, and on Nigerian PIA (PSC) it is 16.1948.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m02-the-price-sweep ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m02-the-price-sweep ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the Designer''s two default regimes at the deck''s own first year price, Concessionary (Royalty/Tax) reads 46.3452 in one place and 59.6210 in another. What separates those two figures?', options = '["The table adds total capex back into the contractor''s side of the denominator and the chart does not.", "The chart is computed at the swept price and the table at the deck price, which are not the same price.", "The chart counts the government''s profit oil share as well as tax and the table counts tax alone.", "The chart is undiscounted while the table is discounted at 10 percent."]'::jsonb, answer_index = 0, explanation = 'Both are the same ratio on the same cash flows and only the add-back differs. The gap on that row is 13.2758 percentage points, and on Nigerian PIA (PSC) it is 16.1948.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m02-the-price-sweep ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 1: explanation, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What multipliers does the capex sweep hand back with its points?' and options = '["Eight labels, 0.8 through 1.5 inclusive.", "Seven labels from 0.7 to 1.3, the multipliers the published capex cases are run at.", "Seven labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4.", "Nine labels, matched to the nine points of the price sweep so that the two charts can be read together."]'::jsonb and answer_index = 2 and explanation = 'The loop accumulates 0.1 and arrives at 1.5000000000000004, which fails the test that the multiplier be no greater than 1.5, so it exits one iteration early.' then 'old'
           when prompt = 'What multipliers does the capex sweep hand back with its points?' and options = '["Seven labels, 0.8 through 1.4, the eighth being unreachable in floating point.", "Nine labels from 0.7 to 1.5, the multipliers the published capex cases are run at.", "Eight labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5.", "Six labels, one per template."]'::jsonb and answer_index = 2 and explanation = 'The multipliers are written from a step count, as 8 plus the step number over 10, so the last is exactly 1.5. The loop they replaced accumulated 0.1, arrived at 1.5000000000000004 and stopped at 1.4.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 1;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What multipliers does the capex sweep hand back with its points?', options = '["Seven labels, 0.8 through 1.4, the eighth being unreachable in floating point.", "Nine labels from 0.7 to 1.5, the multipliers the published capex cases are run at.", "Eight labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5.", "Six labels, one per template."]'::jsonb, answer_index = 2, explanation = 'The multipliers are written from a step count, as 8 plus the step number over 10, so the last is exactly 1.5. The loop they replaced accumulated 0.1, arrived at 1.5000000000000004 and stopped at 1.4.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 2: explanation, option_1, option_3, prompt
  select case
           when prompt = 'The axis is labelled to a multiplier of 1.5 and the last tick reads 1.4. What ended the loop early?' and options = '["Accumulating 0.1 in binary floating point arrives at 1.5000000000000004, which is greater than 1.5.", "The engine refuses a multiplier above 1.4 because no cost recovery limit can absorb a larger overrun.", "The eighth point returned a negative NPV for one regime, so the sweep dropped it.", "The label comes from the loop bound and the points from a step count."]'::jsonb and answer_index = 0 and explanation = 'The point is not unreachable. Calling the engine directly at a multiplier of 1.5 returns an ordinary answer, and Nigeria - PIA (2021) still holds 58.5739 million USD of contractor NPV there against 79.1811 at the last swept point.' then 'old'
           when prompt = 'Until the 2026-09-15 repair the capex axis was labelled to a multiplier of 1.5 and its last tick read 1.4. What had ended the loop early?' and options = '["Accumulating 0.1 in binary floating point arrives at 1.5000000000000004, which is greater than 1.5.", "The engine refused a multiplier above 1.4 because no cost recovery limit can absorb a larger overrun.", "The eighth point returned a negative NPV for one regime, so the sweep dropped it.", "The label came from the loop bound and the points from a step count."]'::jsonb and answer_index = 0 and explanation = 'The point was never unreachable. Nigeria - PIA (2021) holds 58.5739 million USD of contractor NPV at a multiplier of 1.5 against 79.1811 at 1.4, and that value now arrives as a swept point rather than a direct call.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Until the 2026-09-15 repair the capex axis was labelled to a multiplier of 1.5 and its last tick read 1.4. What had ended the loop early?', options = '["Accumulating 0.1 in binary floating point arrives at 1.5000000000000004, which is greater than 1.5.", "The engine refused a multiplier above 1.4 because no cost recovery limit can absorb a larger overrun.", "The eighth point returned a negative NPV for one regime, so the sweep dropped it.", "The label came from the loop bound and the points from a step count."]'::jsonb, answer_index = 0, explanation = 'The point was never unreachable. Nigeria - PIA (2021) holds 58.5739 million USD of contractor NPV at a multiplier of 1.5 against 79.1811 at 1.4, and that value now arrives as a swept point rather than a direct call.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 3: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'For Generic Royalty/Tax the sweep reports a loss of 208.0310 million USD across its points. What does the range the axis advertises actually cost?' and options = '["208.0310 million USD, because the eighth point sits inside the swept range and is merely unlabelled.", "244.0782 million USD, the loss over the eight points from 0.8 to 1.5.", "257.3831 million USD, the NPV the last swept point returns.", "465.4141 million USD, the contractor NPV at the first swept point, since the loss runs from there down to nothing."]'::jsonb and answer_index = 1 and explanation = 'The seven swept points understate the loss the axis promises. For USA - Gulf of Mexico the two figures are 228.7953 and 267.7301 million USD.' then 'old'
           when prompt = 'For Generic Royalty/Tax the capex sweep reports a loss of 244.0782 million USD. Between which two points is that measured?' and options = '["The NPV at a multiplier of 0.8 and the NPV at 1.4, the eighth point having been computed and then dropped from the series.", "The contractor NPV at a multiplier of 0.8 and the NPV at 1.5, the first and last of the eight swept points.", "The NPV at a multiplier of 0.7 and the NPV at 1.3, which is the range the nine published capex cases are run over.", "The NPV at the base multiplier and the NPV at 1.5, so the loss is measured down from the base case."]'::jsonb and answer_index = 1 and explanation = 'The last swept value equals the engine called directly at a multiplier of 1.5 on every regime, which is the check that the endpoint is reached rather than approached. For USA - Gulf of Mexico the same loss is 267.7301 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'For Generic Royalty/Tax the capex sweep reports a loss of 244.0782 million USD. Between which two points is that measured?', options = '["The NPV at a multiplier of 0.8 and the NPV at 1.4, the eighth point having been computed and then dropped from the series.", "The contractor NPV at a multiplier of 0.8 and the NPV at 1.5, the first and last of the eight swept points.", "The NPV at a multiplier of 0.7 and the NPV at 1.3, which is the range the nine published capex cases are run over.", "The NPV at the base multiplier and the NPV at 1.5, so the loss is measured down from the base case."]'::jsonb, answer_index = 1, explanation = 'The last swept value equals the engine called directly at a multiplier of 1.5 on every regime, which is the check that the endpoint is reached rather than approached. For USA - Gulf of Mexico the same loss is 267.7301 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 4: explanation, prompt
  select case
           when prompt = 'Does the point the loop never reaches change which regime the resilience verdict names on the default project?' and options = '["Yes. Over eight points Ghana - Deepwater gives up 109.8425 million USD and takes the title from Angola - Deepwater PSC.", "Yes, because the eighth point is where the two regressive templates cross the two whose split is tiered on the R factor.", "It cannot be known, because the engine returns no value at all at a multiplier of 1.5 for any of the six templates.", "No, the winner is the same either way."]'::jsonb and answer_index = 3 and explanation = 'Angola - Deepwater PSC gives up the least on seven points at 84.8591 million USD and on eight at 107.3918, and USA - Gulf of Mexico the most in both, so what moves is the quantity attached to the winner.' then 'old'
           when prompt = 'Did closing the capex sweep at a multiplier of 1.5 change which regime the resilience verdict names on the default project?' and options = '["Yes. Over eight points Ghana - Deepwater gives up 109.8425 million USD and takes the title from Angola - Deepwater PSC.", "Yes, because the eighth point is where the two regressive templates cross the two whose split is tiered on the R factor.", "It cannot be known, because the engine returns no value at all at a multiplier of 1.5 for any of the six templates.", "No, the winner is the same either way."]'::jsonb and answer_index = 3 and explanation = 'Angola - Deepwater PSC gives up the least at 88.6123 million USD and USA - Gulf of Mexico the most at 267.7301, and the short sweep named the same pair, so what moved is the quantity attached to the winner.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Did closing the capex sweep at a multiplier of 1.5 change which regime the resilience verdict names on the default project?', options = '["Yes. Over eight points Ghana - Deepwater gives up 109.8425 million USD and takes the title from Angola - Deepwater PSC.", "Yes, because the eighth point is where the two regressive templates cross the two whose split is tiered on the R factor.", "It cannot be known, because the engine returns no value at all at a multiplier of 1.5 for any of the six templates.", "No, the winner is the same either way."]'::jsonb, answer_index = 3, explanation = 'Angola - Deepwater PSC gives up the least at 88.6123 million USD and USA - Gulf of Mexico the most at 267.7301, and the short sweep named the same pair, so what moved is the quantity attached to the winner.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 5: option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The capex verdict ranks one quantity per regime. Which quantity?' and options = '["The contractor NPV at the first swept point minus the NPV at the last, in million USD, which prices a 20 percent underspend against a 40 percent overrun.", "The slope of contractor NPV against the multiplier, fitted across all seven of the swept points.", "The fraction of base case NPV that survives a 50 percent overrun, which is why it reads as a percentage.", "The multiplier at which contractor NPV first turns negative, so a higher figure is the more resilient regime."]'::jsonb and answer_index = 0 and explanation = 'It is an absolute amount between two endpoints, so it reports neither the shape between them nor a percentage of the base NPV.' then 'old'
           when prompt = 'The capex verdict ranks one quantity per regime. Which quantity?' and options = '["The contractor NPV at the first swept point minus the NPV at the last, in million USD, which prices a 20 percent underspend against a 50 percent overrun.", "The slope of contractor NPV against the multiplier, fitted across all eight of the swept points.", "The fraction of base case NPV that survives a 50 percent overrun, which is why it reads as a percentage.", "The multiplier at which contractor NPV first turns negative, so a higher figure is the more resilient regime and a regime that never turns negative cannot be ranked at all."]'::jsonb and answer_index = 0 and explanation = 'It is an absolute amount between two endpoints, so it reports neither the shape between them nor a percentage of the base NPV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex verdict ranks one quantity per regime. Which quantity?', options = '["The contractor NPV at the first swept point minus the NPV at the last, in million USD, which prices a 20 percent underspend against a 50 percent overrun.", "The slope of contractor NPV against the multiplier, fitted across all eight of the swept points.", "The fraction of base case NPV that survives a 50 percent overrun, which is why it reads as a percentage.", "The multiplier at which contractor NPV first turns negative, so a higher figure is the more resilient regime and a regime that never turns negative cannot be ranked at all."]'::jsonb, answer_index = 0, explanation = 'It is an absolute amount between two endpoints, so it reports neither the shape between them nor a percentage of the base NPV.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 6: explanation, option_1, prompt
  select case
           when prompt = 'USA - Gulf of Mexico is named the least resilient at 228.7953 million USD given up, on a base contractor NPV of 382.0660. Why is that not obviously the worse choice?' and options = '["The sweep holds price at the deck, and USA - Gulf of Mexico is the most progressive of the six on that project.", "The 228.7953 is quoted over seven points while the other five regimes are quoted over eight.", "The loss is an absolute amount, so a regime with more NPV to lose is penalised for having it.", "The base NPV of 382.0660 is discounted at 10 percent while the loss beside it is not discounted at all."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC is named the most resilient at 84.8591 million USD given up on a base NPV of 223.7100, so the verdict prefers the smaller prize because it shrinks more slowly.' then 'old'
           when prompt = 'USA - Gulf of Mexico is named the least resilient at 267.7301 million USD given up, on a base contractor NPV of 382.0660. Why is that not obviously the worse choice?' and options = '["The sweep holds price at the deck, and USA - Gulf of Mexico is the most progressive of the six on that project.", "The 267.7301 is quoted over eight points while the other five regimes are quoted over seven.", "The loss is an absolute amount, so a regime with more NPV to lose is penalised for having it.", "The base NPV of 382.0660 is discounted at 10 percent while the loss beside it is not discounted at all."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC is named the most resilient at 88.6123 million USD given up on a base NPV of 211.3787, so the verdict prefers the smaller prize because it shrinks more slowly.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'USA - Gulf of Mexico is named the least resilient at 267.7301 million USD given up, on a base contractor NPV of 382.0660. Why is that not obviously the worse choice?', options = '["The sweep holds price at the deck, and USA - Gulf of Mexico is the most progressive of the six on that project.", "The 267.7301 is quoted over eight points while the other five regimes are quoted over seven.", "The loss is an absolute amount, so a regime with more NPV to lose is penalised for having it.", "The base NPV of 382.0660 is discounted at 10 percent while the loss beside it is not discounted at all."]'::jsonb, answer_index = 2, explanation = 'Angola - Deepwater PSC is named the most resilient at 88.6123 million USD given up on a base NPV of 211.3787, so the verdict prefers the smaller prize because it shrinks more slowly.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 7: explanation, option_1, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Angola - Deepwater PSC returns 232.3129 million USD at a multiplier of 0.8 and 238.0330 at 0.9. What makes spending more capital pay?' and options = '["Its cost recovery limit of 50 percent lets a larger pool be recovered faster, so the contractor is repaid sooner.", "Its resource rent tax at 50 percent has a base cut by an annual uplift computed from total capex, so a larger capex enlarges the deduction in every year of the life.", "The larger capex lowers the R factor and holds the contractor in the 70 percent tranche, which outweighs the spend.", "Its royalty of 0 percent leaves capex as the only deduction, so the deduction grows with no royalty offsetting it."]'::jsonb and answer_index = 1 and explanation = 'Brazil - Concession, with a resource rent tax at 40 percent, shows the muted version of the same thing, giving up only the step from 369.1782 to 367.7987 over the same interval.' then 'old'
           when prompt = 'Angola - Deepwater PSC returns 213.5335 million USD at a multiplier of 0.8 and 218.7874 at 0.9. What makes spending more capital pay?' and options = '["Its cost recovery limit of 50 percent lets a larger pool be recovered faster, so the contractor is repaid sooner.", "Its resource rent tax at 50 percent is relieved from a pool opened at total capex times one plus the uplift, so a larger capex opens a larger pool.", "The larger capex lowers the R factor and holds the contractor in the 70 percent tranche, which outweighs the spend.", "Its royalty of 0 percent leaves capex as the only deduction, so the deduction grows with no royalty offsetting it."]'::jsonb and answer_index = 1 and explanation = 'Brazil - Concession, with a resource rent tax at 40 percent, shows the muted version of the same thing, giving up only the step from 304.7089 to 296.9901 over the same interval.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 7;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC returns 213.5335 million USD at a multiplier of 0.8 and 218.7874 at 0.9. What makes spending more capital pay?', options = '["Its cost recovery limit of 50 percent lets a larger pool be recovered faster, so the contractor is repaid sooner.", "Its resource rent tax at 50 percent is relieved from a pool opened at total capex times one plus the uplift, so a larger capex opens a larger pool.", "The larger capex lowers the R factor and holds the contractor in the 70 percent tranche, which outweighs the spend.", "Its royalty of 0 percent leaves capex as the only deduction, so the deduction grows with no royalty offsetting it."]'::jsonb, answer_index = 1, explanation = 'Brazil - Concession, with a resource rent tax at 40 percent, shows the muted version of the same thing, giving up only the step from 304.7089 to 296.9901 over the same interval.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 8: explanation, option_0, option_2, prompt
  select case
           when prompt = 'The seven published capex cases are named capex_0.7_pia_default to capex_1.3_pia_default. How do they relate to the sweep the chart draws?' and options = '["They are the seven swept points themselves, published one case per label on the chart''s axis.", "They are the same regime as the chart over a shifted range, the Nigeria - PIA (2021) template under the name the Designer gives it.", "They are the oracle''s eight point sweep with the point at a multiplier of 1.5 taken out of it.", "A different range on a different regime."]'::jsonb and answer_index = 3 and explanation = 'The published set runs the Designer''s default regime, id 1, at multipliers of 0.7 to 1.3, returning 173.4150 million USD of NPV at 1.0 where the template returns 154.8286, and the chart sweeps 0.8 to 1.4 on the templates.' then 'old'
           when prompt = 'The nine published capex cases are named capex_0.7_pia_default to capex_1.5_pia_default. How do they relate to the sweep the chart draws?' and options = '["They are the swept points themselves, published one case per label on the chart''s axis.", "They are the same regime as the chart over a shifted range, the Nigeria - PIA (2021) template under the name the Designer gives it.", "They are the oracle''s own sweep rather than the engine''s, published so that the two can be compared point by point.", "A different range on a different regime."]'::jsonb and answer_index = 3 and explanation = 'The published set runs the Designer''s default regime, id 1, at multipliers of 0.7 to 1.5, returning 169.7176 million USD of NPV at 1.0 where the template returns 154.8286, and the chart sweeps 0.8 to 1.5 on the six templates.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The nine published capex cases are named capex_0.7_pia_default to capex_1.5_pia_default. How do they relate to the sweep the chart draws?', options = '["They are the swept points themselves, published one case per label on the chart''s axis.", "They are the same regime as the chart over a shifted range, the Nigeria - PIA (2021) template under the name the Designer gives it.", "They are the oracle''s own sweep rather than the engine''s, published so that the two can be compared point by point.", "A different range on a different regime."]'::jsonb, answer_index = 3, explanation = 'The published set runs the Designer''s default regime, id 1, at multipliers of 0.7 to 1.5, returning 169.7176 million USD of NPV at 1.0 where the template returns 154.8286, and the chart sweeps 0.8 to 1.5 on the six templates.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 9: explanation, prompt
  select case
           when prompt = 'Across the published capex cases the payback year steps 3, 3, 4, 4, 4, 5 and 5 while the payout year steps 2, 2, 2, 3, 3, 3 and 4. What does that add to the NPV story?' and options = '["Nothing, since both are integers and an integer cannot resolve a 10 percent step in capex.", "That payback and payout are one test read to two precisions, which is why they step together.", "An overrun also delays the year the contractor turns positive and the year the R factor passes 1.0, and can move a profit split tier with it.", "That the sweep re-runs the discounting alone, the ledger underneath being unchanged by the multiplier."]'::jsonb and answer_index = 2 and explanation = 'NPV over the same range runs 240.3937, 218.5119, 198.2887, 173.4150, 150.6191, 123.6342 and 98.2520 million USD, so the curve is not a straight line either.' then 'old'
           when prompt = 'Across the published capex cases the payback year steps 3, 3, 4, 4, 4, 5, 5, 6 and 6 while the payout year steps 2, 2, 2, 3, 3, 3, 4, 4 and 4. What does that add to the NPV story?' and options = '["Nothing, since both are integers and an integer cannot resolve a 10 percent step in capex.", "That payback and payout are one test read to two precisions, which is why they step together.", "An overrun also delays the year the contractor turns positive and the year the R factor passes 1.0, and can move a profit split tier with it.", "That the sweep re-runs the discounting alone, the ledger underneath being unchanged by the multiplier."]'::jsonb and answer_index = 2 and explanation = 'NPV over the same range runs 220.1703, 204.6839, 189.9756, 169.7176, 149.8784, 123.6342, 98.2520, 69.4751 and 41.2671 million USD, so the curve is not a straight line either.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Across the published capex cases the payback year steps 3, 3, 4, 4, 4, 5, 5, 6 and 6 while the payout year steps 2, 2, 2, 3, 3, 3, 4, 4 and 4. What does that add to the NPV story?', options = '["Nothing, since both are integers and an integer cannot resolve a 10 percent step in capex.", "That payback and payout are one test read to two precisions, which is why they step together.", "An overrun also delays the year the contractor turns positive and the year the R factor passes 1.0, and can move a profit split tier with it.", "That the sweep re-runs the discounting alone, the ledger underneath being unchanged by the multiplier."]'::jsonb, answer_index = 2, explanation = 'NPV over the same range runs 220.1703, 204.6839, 189.9756, 169.7176, 149.8784, 123.6342, 98.2520, 69.4751 and 41.2671 million USD, so the curve is not a straight line either.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 10: option_0, option_1, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.' and options = '["Government take in percent at nine oil prices, and contractor NPV in million USD at seven capex multipliers.", "Contractor NPV in million USD at nine oil prices, and government take in percent at seven capex multipliers, which is the pairing the two axis titles suggest.", "Government take in percent on both, nine points on price and eight on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb and answer_index = 0 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.' then 'old'
           when prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.' and options = '["Government take in percent at nine oil prices, and contractor NPV in million USD at eight capex multipliers.", "Contractor NPV in million USD at nine oil prices, and government take in percent at eight capex multipliers, which is the pairing the two axis titles suggest.", "Government take in percent on both, nine points on price and seven on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb and answer_index = 0 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'State the unit and the number of points of each of the two sweeps the comparison returns.', options = '["Government take in percent at nine oil prices, and contractor NPV in million USD at eight capex multipliers.", "Contractor NPV in million USD at nine oil prices, and government take in percent at eight capex multipliers, which is the pairing the two axis titles suggest.", "Government take in percent on both, nine points on price and seven on capex.", "Contractor NPV in million USD on both, so the two charts can be subtracted point by point."]'::jsonb, answer_index = 0, explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s can be compared between projects of different sizes.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 11: explanation, prompt
  select case
           when prompt = 'On the default project the most progressive template gives up the least contractor NPV and the two regressive ones give up the most. Why is that agreement not a coincidence?' and options = '["The two verdicts are computed by the same reduce over the same array, so they cannot disagree.", "A regime taking a rising share of the upside absorbs a share of the downside too, so the contractor''s NPV moves less when capital cost rises.", "Both sweeps hold the other variable at its base case, which forces the two rankings to match row for row, so a regime placed third by climb is placed third by loss as well.", "The price climb is an input to the capex loss, which is why the two orderings track one another so closely."]'::jsonb and answer_index = 1 and explanation = 'Angola - Deepwater PSC climbs 12.1305 percentage points and gives up 84.8591 million USD while USA - Gulf of Mexico climbs -17.2498 and gives up 228.7953, and the orders agree in tendency and not row for row.' then 'old'
           when prompt = 'On the default project the two steepest climbers give up the least contractor NPV and the two regressive templates give up the most. Why is that agreement not a coincidence?' and options = '["The two verdicts are computed by the same reduce over the same array, so they cannot disagree.", "A regime taking a rising share of the upside absorbs a share of the downside too, so the contractor''s NPV moves less when capital cost rises.", "Both sweeps hold the other variable at its base case, which forces the two rankings to match row for row, so a regime placed third by climb is placed third by loss as well.", "The price climb is an input to the capex loss, which is why the two orderings track one another so closely."]'::jsonb and answer_index = 1 and explanation = 'Angola - Deepwater PSC climbs 19.6873 percentage points and gives up 88.6123 million USD while USA - Gulf of Mexico climbs -17.2498 and gives up 267.7301, and the orders agree in tendency and not row for row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the default project the two steepest climbers give up the least contractor NPV and the two regressive templates give up the most. Why is that agreement not a coincidence?', options = '["The two verdicts are computed by the same reduce over the same array, so they cannot disagree.", "A regime taking a rising share of the upside absorbs a share of the downside too, so the contractor''s NPV moves less when capital cost rises.", "Both sweeps hold the other variable at its base case, which forces the two rankings to match row for row, so a regime placed third by climb is placed third by loss as well.", "The price climb is an input to the capex loss, which is why the two orderings track one another so closely."]'::jsonb, answer_index = 1, explanation = 'Angola - Deepwater PSC climbs 19.6873 percentage points and gives up 88.6123 million USD while USA - Gulf of Mexico climbs -17.2498 and gives up 267.7301, and the orders agree in tendency and not row for row.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 12: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On ODIDI, which regime wins both sweep verdicts and which one breaks the pattern?' and options = '["Brazil - Concession wins both, since it leads the summary on that field at -5.8662 million USD.", "Angola - Deepwater PSC wins both, as it does on the default project, and Ghana - Deepwater is the one that breaks the pattern.", "No regime wins both, because every climb on that field is negative and a negative climb cannot win the price verdict.", "Ghana - Deepwater wins both, most progressive at 1.9971 percentage points and most resilient at 150.9021 million USD, and Angola - Deepwater PSC breaks it."]'::jsonb and answer_index = 3 and explanation = 'Angola''s climb of -14.8244 is not the worst on that field while its capex loss of 215.1075 million USD is the largest of the six.' then 'old'
           when prompt = 'On ODIDI the two sweep verdicts name two different regimes. Which two, and which regime breaks the pattern?' and options = '["Brazil - Concession takes both, since it leads the summary on that field at -5.8662 million USD.", "Ghana - Deepwater takes both, most progressive at 1.9971 percentage points and most resilient at 181.1922 million USD.", "Neither verdict names a regime, because every climb on that field is negative and a negative climb cannot win the price verdict.", "Brazil - Concession is the most progressive at 7.4752 percentage points and Ghana - Deepwater the most resilient at 181.1922 million USD, and Angola - Deepwater PSC breaks it."]'::jsonb and answer_index = 3 and explanation = 'Angola''s climb of -8.3874 is not the worst on that field while its capex loss of 252.6075 million USD is the largest of the six.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 12;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI the two sweep verdicts name two different regimes. Which two, and which regime breaks the pattern?', options = '["Brazil - Concession takes both, since it leads the summary on that field at -5.8662 million USD.", "Ghana - Deepwater takes both, most progressive at 1.9971 percentage points and most resilient at 181.1922 million USD.", "Neither verdict names a regime, because every climb on that field is negative and a negative climb cannot win the price verdict.", "Brazil - Concession is the most progressive at 7.4752 percentage points and Ghana - Deepwater the most resilient at 181.1922 million USD, and Angola - Deepwater PSC breaks it."]'::jsonb, answer_index = 3, explanation = 'Angola''s climb of -8.3874 is not the worst on that field while its capex loss of 252.6075 million USD is the largest of the six.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 14: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the comparison built with capex of 20000 all six templates give up 10909.090909 million USD across the sweep. What is the verdict that names USA - Gulf of Mexico the most resilient?' and options = '["Not a result. The six losses are identical by construction and differ only in the last bits of a floating point sum.", "A correct ranking on a margin too fine to print, which one more decimal place in the sentence would show.", "A tie broken by the summary''s own sort, which keeps the first row it sees, so the sentence is naming the highest NPV regime under another label.", "A defect in the oracle rather than the engine, since the oracle''s arithmetic names Brazil - Concession."]'::jsonb and answer_index = 0 and explanation = 'At a capex of 20000 nothing below the capex line moves between the first swept point and the last, so the whole capex difference reaches the contractor undiluted and is discounted by the same one year in every case. The sentence quotes both regimes at 10909.1 million USD.' then 'old'
           when prompt = 'On the comparison built with capex of 20000 all six templates give up 12727.272727 million USD across the capex sweep. What does the resilience verdict do?' and options = '["It declines to rank, and names all six as giving up 12,727.3 million USD each, within 0.1 million USD of each other.", "It names USA - Gulf of Mexico, a reduce with a strict less than keeping the first of six equal values.", "It names Brazil - Concession, following the oracle''s arithmetic wherever the engine''s own reduce disagrees with it.", "It is omitted, in the way both sweep verdicts are omitted when only one regime is compared."]'::jsonb and answer_index = 0 and explanation = 'At a capex of 20000 nothing below the capex line moves between the first swept point and the last, so the whole capex difference reaches the contractor undiluted and is discounted by the same one year in every case. The retired reduce named USA - Gulf of Mexico here and the oracle named Brazil - Concession, and neither was a result.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the comparison built with capex of 20000 all six templates give up 12727.272727 million USD across the capex sweep. What does the resilience verdict do?', options = '["It declines to rank, and names all six as giving up 12,727.3 million USD each, within 0.1 million USD of each other.", "It names USA - Gulf of Mexico, a reduce with a strict less than keeping the first of six equal values.", "It names Brazil - Concession, following the oracle''s arithmetic wherever the engine''s own reduce disagrees with it.", "It is omitted, in the way both sweep verdicts are omitted when only one regime is compared."]'::jsonb, answer_index = 0, explanation = 'At a capex of 20000 nothing below the capex line moves between the first swept point and the last, so the whole capex difference reaches the contractor undiluted and is discounted by the same one year in every case. The retired reduce named USA - Gulf of Mexico here and the oracle named Brazil - Concession, and neither was a result.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m03-the-capex-sweep ord 15: explanation, option_1 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Name the three reasons a resilience verdict can differ between two runs.' and options = '["The project life was extended past 25 years, the capex was rescheduled out of year 1, or opex was swept beside capital.", "The field underneath changed, the swept range is not the one the axis claims, or there was nothing to rank.", "The bisection failed to converge, the summary lost its sort, or the golden was re-cut against a new engine.", "One regime paid back and the others did not, one returned a null rate, or one returned an empty list of verdicts."]'::jsonb and answer_index = 1 and explanation = 'On ODIDI the same six templates hand the title to Ghana - Deepwater at 150.9021 million USD where Angola - Deepwater PSC held it on the default project at 84.8591.' then 'old'
           when prompt = 'Name the three reasons a resilience verdict can differ between two runs.' and options = '["The project life was extended past 25 years, the capex was rescheduled out of year 1, or opex was swept beside capital.", "The field underneath changed, the swept range changed, or there was nothing to rank.", "The bisection failed to converge, the summary lost its sort, or the golden was re-cut against a new engine.", "One regime paid back and the others did not, one returned a null rate, or one returned an empty list of verdicts."]'::jsonb and answer_index = 1 and explanation = 'On ODIDI the same six templates hand the title to Ghana - Deepwater at 181.1922 million USD where Angola - Deepwater PSC held it on the default project at 88.6123.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m03-the-capex-sweep ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Name the three reasons a resilience verdict can differ between two runs.', options = '["The project life was extended past 25 years, the capex was rescheduled out of year 1, or opex was swept beside capital.", "The field underneath changed, the swept range changed, or there was nothing to rank.", "The bisection failed to converge, the summary lost its sort, or the golden was re-cut against a new engine.", "One regime paid back and the others did not, one returned a null rate, or one returned an empty list of verdicts."]'::jsonb, answer_index = 1, explanation = 'On ODIDI the same six templates hand the title to Ghana - Deepwater at 181.1922 million USD where Angola - Deepwater PSC held it on the default project at 88.6123.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m03-the-capex-sweep ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 1: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On `cmp_all_templates_default_project` the payback verdict reads that Generic Royalty/Tax pays back in year 3, against year 4 for Angola - Deepwater PSC. Four of the six templates pay back in year 3. Which of the four does the sentence name?' and options = '["Whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, since the engine interpolates within the year to separate a tie.", "The first of them in summary order, and the summary is sorted by contractor NPV, so the sentence names whichever regime has the highest NPV.", "Angola - Deepwater PSC, because a payback of year 4 is what the comparison clause of the sentence ranks the winner against.", "The one of the four with the smallest government cash flow, 758.7514 million USD, which the tie break reads next."]'::jsonb and answer_index = 1 and explanation = 'Payback is an integer year, so a strict less than in a reduce keeps the first element it saw, and that element is the NPV winner at 397.0445 million USD.' then 'old'
           when prompt = 'On `cmp_all_templates_default_project` four of the six templates pay back in year 3. How does the payback verdict report that?' and options = '["It names the first of them in summary order, which is the highest NPV regime, and says nothing of the other three.", "It names all four of them, in summary order, against year 4 for Angola - Deepwater PSC.", "It is omitted, because a four way tie at the top cannot be ranked and an unsupportable claim is dropped.", "It names whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, the engine interpolating within the year to separate a tie."]'::jsonb and answer_index = 1 and explanation = 'Nigeria - PIA (2021) also pays back in year 4 and is not named, because the closing clause reports one regime at the slowest year. Naming every regime tied at the fastest year is the 2026-09-15 repair; the retired rule named the first of them, which was the NPV winner at 397.0445 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 1;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 1'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_all_templates_default_project` four of the six templates pay back in year 3. How does the payback verdict report that?', options = '["It names the first of them in summary order, which is the highest NPV regime, and says nothing of the other three.", "It names all four of them, in summary order, against year 4 for Angola - Deepwater PSC.", "It is omitted, because a four way tie at the top cannot be ranked and an unsupportable claim is dropped.", "It names whichever of them crosses zero cumulative contractor net cash flow earliest inside year 3, the engine interpolating within the year to separate a tie."]'::jsonb, answer_index = 1, explanation = 'Nigeria - PIA (2021) also pays back in year 4 and is not named, because the closing clause reports one regime at the slowest year. Naming every regime tied at the fastest year is the 2026-09-15 repair; the retired rule named the first of them, which was the NPV winner at 397.0445 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 2: option_1, prompt
  select case
           when prompt = 'A payback verdict on ODIDI reads that Brazil - Concession pays back in year 6, against year 8 for Angola - Deepwater PSC. What is the second regime in that sentence?' and options = '["The runner up, the second fastest of the six, which the sentence quotes so a reader can see how tight the top of the column is.", "The regime immediately below the winner in the summary sort, which on ODIDI is Generic Royalty/Tax at year 7.", "The slowest of the rest, because the function takes the fastest, removes it, and then takes the maximum of what is left.", "The median of the payback column, chosen so that one outlier cannot make the spread look wider than it is."]'::jsonb and answer_index = 2 and explanation = 'It reads like a top two and is a top and a bottom, with the three ODIDI regimes that pay back in year 7 silently in between.' then 'old'
           when prompt = 'A payback verdict on ODIDI reads that Brazil - Concession and Ghana - Deepwater pay back in year 6, against year 8 for Angola - Deepwater PSC. What is the last regime in that sentence?' and options = '["The runner up, the second fastest of the six, which the sentence quotes so a reader can see how tight the top of the column is.", "The regime immediately below the winners in the summary sort, which on ODIDI is Generic Royalty/Tax at year 7.", "The slowest of the rest, because the function takes the fastest, removes it, and then takes the maximum of what is left.", "The median of the payback column, chosen so that one outlier cannot make the spread look wider than it is."]'::jsonb and answer_index = 2 and explanation = 'It reads like a top two and is a top and a bottom, with the three ODIDI regimes that pay back in year 7 silently in between.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A payback verdict on ODIDI reads that Brazil - Concession and Ghana - Deepwater pay back in year 6, against year 8 for Angola - Deepwater PSC. What is the last regime in that sentence?', options = '["The runner up, the second fastest of the six, which the sentence quotes so a reader can see how tight the top of the column is.", "The regime immediately below the winners in the summary sort, which on ODIDI is Generic Royalty/Tax at year 7.", "The slowest of the rest, because the function takes the fastest, removes it, and then takes the maximum of what is left.", "The median of the payback column, chosen so that one outlier cannot make the spread look wider than it is."]'::jsonb, answer_index = 2, explanation = 'It reads like a top two and is a top and a bottom, with the three ODIDI regimes that pay back in year 7 silently in between.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 3: prompt
  select case
           when prompt = 'On `cmp_never_recovers` all six templates give up 10909.090909 million USD of contractor NPV across the capex sweep. Why are the six losses identical rather than merely close?' and options = '["At both ends of the sweep every regime recovers cost at its own limit, so nothing below the capex line moves and the whole capex difference reaches the contractor''s year 1 line undiluted, discounted by the same one year.", "The sweep reuses the first regime''s ledger for the other five, because nothing pays back and the comparison stops early.", "Every template applies the same cost recovery limit at that capex, so each one recovers an identical fraction of the overrun.", "The loss is rounded before the verdict ranks it, and the six regimes differ only past the sixth decimal place."]'::jsonb and answer_index = 0 and explanation = 'The capex delta passes straight to the contractor''s year 1 line, so the loss is the same discounted amount for all six whatever royalty, profit oil and tax each of them carries.' then 'old'
           when prompt = 'On `cmp_never_recovers` all six templates give up 12727.272727 million USD of contractor NPV across the capex sweep. Why are the six losses identical rather than merely close?' and options = '["At both ends of the sweep every regime recovers cost at its own limit, so nothing below the capex line moves and the whole capex difference reaches the contractor''s year 1 line undiluted, discounted by the same one year.", "The sweep reuses the first regime''s ledger for the other five, because nothing pays back and the comparison stops early.", "Every template applies the same cost recovery limit at that capex, so each one recovers an identical fraction of the overrun.", "The loss is rounded before the verdict ranks it, and the six regimes differ only past the sixth decimal place."]'::jsonb and answer_index = 0 and explanation = 'The capex delta passes straight to the contractor''s year 1 line, so the loss is the same discounted amount for all six whatever royalty, profit oil and tax each of them carries.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_never_recovers` all six templates give up 12727.272727 million USD of contractor NPV across the capex sweep. Why are the six losses identical rather than merely close?', options = '["At both ends of the sweep every regime recovers cost at its own limit, so nothing below the capex line moves and the whole capex difference reaches the contractor''s year 1 line undiluted, discounted by the same one year.", "The sweep reuses the first regime''s ledger for the other five, because nothing pays back and the comparison stops early.", "Every template applies the same cost recovery limit at that capex, so each one recovers an identical fraction of the overrun.", "The loss is rounded before the verdict ranks it, and the six regimes differ only past the sixth decimal place."]'::jsonb, answer_index = 0, explanation = 'The capex delta passes straight to the contractor''s year 1 line, so the loss is the same discounted amount for all six whatever royalty, profit oil and tax each of them carries.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 4: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The capex verdict on that same comparison names USA - Gulf of Mexico the most resilient at 10909.1 million USD and Nigeria - PIA (2021) the most exposed at 10909.1 million USD. What has the sentence established?' and options = '["That USA - Gulf of Mexico is the safer regime under an overrun, since the engine names it and the golden pins the sentence it returned.", "That the oracle''s arithmetic settles the pick in favour of Brazil - Concession, which is the correct winner wherever the engine''s reduce disagrees with it.", "That the six regimes are separated somewhere past the printed decimals, so the ranking holds and only the rounding of the sentence conceals it.", "Nothing, because the least and the most print the same quantity."]'::jsonb and answer_index = 3 and explanation = 'The tie is exact by construction, the golden pins the ranked quantities rather than a winner, and no tie break rule could be right among six answers that are one answer.' then 'old'
           when prompt = 'The capex verdict on that same comparison declines to rank and names all six regimes at 12,727.3 million USD each. What has it established?' and options = '["That USA - Gulf of Mexico is the safer regime under an overrun, since that is the regime the golden pins for this case.", "Nothing, because a verdict that names no winner has not read the column it was handed.", "That the six regimes are separated somewhere past the printed decimals, so one more decimal place in the sentence would rank them.", "The only true thing available, that the six quantities are one quantity, so no regime is more resilient than another here."]'::jsonb and answer_index = 3 and explanation = 'The tie is exact by construction, the golden pins the ranked quantities rather than a winner, and no tie break rule could be right among six answers that are one answer. The retired reduce named USA - Gulf of Mexico and the oracle named Brazil - Concession.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 4;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The capex verdict on that same comparison declines to rank and names all six regimes at 12,727.3 million USD each. What has it established?', options = '["That USA - Gulf of Mexico is the safer regime under an overrun, since that is the regime the golden pins for this case.", "Nothing, because a verdict that names no winner has not read the column it was handed.", "That the six regimes are separated somewhere past the printed decimals, so one more decimal place in the sentence would rank them.", "The only true thing available, that the six quantities are one quantity, so no regime is more resilient than another here."]'::jsonb, answer_index = 3, explanation = 'The tie is exact by construction, the golden pins the ranked quantities rather than a winner, and no tie break rule could be right among six answers that are one answer. The retired reduce named USA - Gulf of Mexico and the oracle named Brazil - Concession.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 6: option_3
  select case
           when prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?' and options = '["1339.2784 million USD, because government cash flow descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1200.2886 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb and answer_index = 2 and explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.' then 'old'
           when prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?' and options = '["1339.2784 million USD, because government cash flow descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1263.7523 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb and answer_index = 2 and explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Insights tab once called the second ranked regime the one that maximises government revenue. What does the second row of `cmp_all_templates_default_project` actually collect?', options = '["1339.2784 million USD, because government cash flow descending is the summary''s secondary sort once contractor NPV has ordered the rows.", "758.7514 million USD, the largest of the six, which is why the old sentence looked right on this project.", "764.5528 million USD, while the largest take on that comparison is 1339.2784 million USD and belongs to the regime in sixth place.", "1263.7523 million USD, for Angola - Deepwater PSC, the regime the take column puts second."]'::jsonb, answer_index = 2, explanation = 'The sort carries no information about take, and on this project the take column runs the other way, from 758.7514 at rank 1 to 1339.2784 at rank 6.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 10: explanation, option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On ODIDI the capex verdict names Ghana - Deepwater as giving up the least contractor NPV and Angola - Deepwater PSC the most. What are the two ranked quantities?' and options = '["84.8591 million USD for Ghana - Deepwater and 228.7953 million USD for Angola - Deepwater PSC, the two losses the same verdict reports on the default project.", "150.9021 million USD for Ghana - Deepwater and 215.1075 million USD for Angola - Deepwater PSC.", "16.4714 and 10.9118 million USD, the NPV each returns at the first swept point.", "-134.4307 million USD and -204.1957 million USD, the contractor NPV each regime returns at the last swept multiplier."]'::jsonb and answer_index = 1 and explanation = 'The quantity is the first swept point minus the last: Ghana runs 16.4714 down to -134.4307 and Angola 10.9118 down to -204.1957.' then 'old'
           when prompt = 'On ODIDI the capex verdict names Ghana - Deepwater as giving up the least contractor NPV and Angola - Deepwater PSC the most. What are the two ranked quantities?' and options = '["88.6123 million USD for Ghana - Deepwater and 267.7301 million USD for Angola - Deepwater PSC, the two losses the same verdict reports on the default project.", "181.1922 million USD for Ghana - Deepwater and 252.6075 million USD for Angola - Deepwater PSC.", "16.4714 and 10.9118 million USD, the NPV each returns at the first swept point.", "-164.7208 million USD and -241.6957 million USD, the contractor NPV each regime returns at the last swept multiplier."]'::jsonb and answer_index = 1 and explanation = 'The quantity is the first swept point minus the last: Ghana runs 16.4714 down to -164.7208 and Angola 10.9118 down to -241.6957.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI the capex verdict names Ghana - Deepwater as giving up the least contractor NPV and Angola - Deepwater PSC the most. What are the two ranked quantities?', options = '["88.6123 million USD for Ghana - Deepwater and 267.7301 million USD for Angola - Deepwater PSC, the two losses the same verdict reports on the default project.", "181.1922 million USD for Ghana - Deepwater and 252.6075 million USD for Angola - Deepwater PSC.", "16.4714 and 10.9118 million USD, the NPV each returns at the first swept point.", "-164.7208 million USD and -241.6957 million USD, the contractor NPV each regime returns at the last swept multiplier."]'::jsonb, answer_index = 1, explanation = 'The quantity is the first swept point minus the last: Ghana runs 16.4714 down to -164.7208 and Angola 10.9118 down to -241.6957.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 11: explanation, option_0, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On ODIDI the price verdict calls Ghana - Deepwater the most progressive, rising 2.0 percentage points. What does winning on that number say about the field?' and options = '["Ghana - Deepwater is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Nobody captures upside on ODIDI: the actual climb is 1.9971 and only one other regime climbs at all, Nigeria - PIA (2021) by 0.1968.", "Two percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb and answer_index = 2 and explanation = 'The other four climbs on ODIDI are negative, as far down as -37.6994 for USA - Gulf of Mexico, so the winner leads a field on which only two regimes climb at all.' then 'old'
           when prompt = 'On ODIDI the price verdict calls Brazil - Concession the most progressive, rising 7.5 percentage points. What does winning on that number say about the field?' and options = '["Brazil - Concession is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Half the field is going the other way: only Ghana - Deepwater at 1.9971 and Nigeria - PIA (2021) at 0.1968 climb beside it, and the other three fall.", "Seven percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb and answer_index = 2 and explanation = 'The three falling climbs run as far down as -37.6994 for USA - Gulf of Mexico, so the winner leads a field on which half the regimes hand the state a shrinking fraction as price rises.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI the price verdict calls Brazil - Concession the most progressive, rising 7.5 percentage points. What does winning on that number say about the field?', options = '["Brazil - Concession is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Half the field is going the other way: only Ghana - Deepwater at 1.9971 and Nigeria - PIA (2021) at 0.1968 climb beside it, and the other three fall.", "Seven percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb, answer_index = 2, explanation = 'The three falling climbs run as far down as -37.6994 for USA - Gulf of Mexico, so the winner leads a field on which half the regimes hand the state a shrinking fraction as price rises.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m04-the-insights ord 15: explanation, option_1, option_3, prompt
  select case
           when prompt = 'On `cmp_never_recovers` the contractor verdict names Brazil - Concession at -15354.7 million USD with an IRR of 0.0 percent, under a heading that reads best for the contractor. Is the sentence wrong?' and options = '["Yes, because a negative NPV cannot be the highest of anything, and a claim that cannot be supported is supposed to be omitted rather than printed.", "Yes, because an IRR of 0.0 percent means the flows never changed sign, so this project broke even rather than lost money.", "No, it is correct and it describes a catastrophe, because the sort ranks six ways of losing money and rank 1 is the least bad.", "No, and the 0.0 percent IRR confirms it: a rate of zero is the floor the bisection reports when a project exactly returns its outlay."]'::jsonb and answer_index = 2 and explanation = 'Highest here means least negative, against -15900.1132 million USD for the worst of the six, and the payback column is null for all of them.' then 'old'
           when prompt = 'On `cmp_never_recovers` the contractor verdict names Brazil - Concession at -15,354.7 million USD with no IRR, under a heading that reads best for the contractor. Is the sentence wrong?' and options = '["Yes, because a negative NPV cannot be the highest of anything, and a claim that cannot be supported is supposed to be omitted rather than printed.", "Yes, because a withheld IRR means the flows never changed sign, so this project broke even rather than lost money.", "No, it is correct and it describes a catastrophe, because the sort ranks six ways of losing money and rank 1 is the least bad.", "No, and the withheld IRR confirms it: the engine declines a rate only when a project exactly returns its outlay."]'::jsonb and answer_index = 2 and explanation = 'The sentence gives its reason, that no rate from -99 to 1000 percent brings the NPV to zero. Highest here means least negative, against -15900.1132 million USD for the worst of the six.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m04-the-insights ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m04-the-insights ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_never_recovers` the contractor verdict names Brazil - Concession at -15,354.7 million USD with no IRR, under a heading that reads best for the contractor. Is the sentence wrong?', options = '["Yes, because a negative NPV cannot be the highest of anything, and a claim that cannot be supported is supposed to be omitted rather than printed.", "Yes, because a withheld IRR means the flows never changed sign, so this project broke even rather than lost money.", "No, it is correct and it describes a catastrophe, because the sort ranks six ways of losing money and rank 1 is the least bad.", "No, and the withheld IRR confirms it: the engine declines a rate only when a project exactly returns its outlay."]'::jsonb, answer_index = 2, explanation = 'The sentence gives its reason, that no rate from -99 to 1000 percent brings the NPV to zero. Highest here means least negative, against -15900.1132 million USD for the worst of the six.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m04-the-insights ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 3: option_2
  select case
           when prompt = 'On `cmp_never_recovers` the price sweep returns null with the state undefined for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the null mean?' and options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "Lifetime profit is not positive: contractor net cash flow outweighs the take, so no share exists and the engine declines to return one.", "The share was too large to render, so the point was flagged and dropped rather than drawn off the top of the axis.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb and answer_index = 1 and explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659. An earlier build returned 0 there, drawn in the same colour as a zero that would mean nothing collected.' then 'old'
           when prompt = 'On `cmp_never_recovers` the price sweep returns null with the state undefined for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the null mean?' and options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "Lifetime profit is not positive: contractor net cash flow outweighs the take, so no share exists and the engine declines to return one.", "The share was too large to render, so the point was flagged and then dropped rather than being drawn off the top of the axis with its true value kept.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb and answer_index = 1 and explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659. An earlier build returned 0 there, drawn in the same colour as a zero that would mean nothing collected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_never_recovers` the price sweep returns null with the state undefined for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the null mean?', options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "Lifetime profit is not positive: contractor net cash flow outweighs the take, so no share exists and the engine declines to return one.", "The share was too large to render, so the point was flagged and then dropped rather than being drawn off the top of the axis with its true value kept.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb, answer_index = 1, explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659. An earlier build returned 0 there, drawn in the same colour as a zero that would mean nothing collected.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 5: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The capex sweep is written as a loop from a multiplier of 0.8 to 1.5 in steps of 0.1 and returns seven points. What ends the loop early?' and options = '["The engine caps the sweep at seven points to hold the comparison inside its time budget, since each point re-runs every regime.", "The eighth point is skipped because a multiplier of 1.5 makes the contractor NPV negative for several templates and the axis would need rescaling.", "The accumulating multiplier reaches 1.5000000000000004, which fails the test that it be at most 1.5, so the eighth iteration never runs.", "The loop tests the rounded label rather than the accumulator, so a label of 1.5 is never produced."]'::jsonb and answer_index = 2 and explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4, and the axis it is drawn against still promises 1.5.' then 'old'
           when prompt = 'Until the 2026-09-15 repair the capex sweep was a loop from a multiplier of 0.8 to 1.5 in steps of 0.1 that returned seven points. What ended it early, and what replaced it?' and options = '["The engine capped the sweep at seven points to hold the comparison inside its time budget, and the cap was later raised to eight.", "The eighth point was skipped because a multiplier of 1.5 makes the contractor NPV negative for several templates, and the axis was rescaled instead.", "The accumulating multiplier reached 1.5000000000000004, which fails the test that it be at most 1.5, and an integer step count replaced the accumulation.", "The loop tested the rounded label rather than the accumulator, so a label of 1.5 was never produced, and the label is now read from the loop bound."]'::jsonb and answer_index = 2 and explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5, and the last swept value equals the engine called directly at 1.5 on every regime.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Until the 2026-09-15 repair the capex sweep was a loop from a multiplier of 0.8 to 1.5 in steps of 0.1 that returned seven points. What ended it early, and what replaced it?', options = '["The engine capped the sweep at seven points to hold the comparison inside its time budget, and the cap was later raised to eight.", "The eighth point was skipped because a multiplier of 1.5 makes the contractor NPV negative for several templates, and the axis was rescaled instead.", "The accumulating multiplier reached 1.5000000000000004, which fails the test that it be at most 1.5, and an integer step count replaced the accumulation.", "The loop tested the rounded label rather than the accumulator, so a label of 1.5 was never produced, and the label is now read from the loop bound."]'::jsonb, answer_index = 2, explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5, and the last swept value equals the engine called directly at 1.5 on every regime.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 6: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'For USA - Gulf of Mexico on the default project the resilience verdict quotes a loss of 228.7953 million USD. What would the range the axis advertises have given?' and options = '["189.4674 million USD, the contractor NPV the regime still returns when the engine is called directly at a multiplier of 1.5.", "267.7301 million USD, the loss to the eighth point at a multiplier of 1.5, which the sweep never visits.", "244.0782 million USD, which is the loss the same eight point range gives for Generic Royalty/Tax rather than for this regime.", "228.4023 million USD, the contractor NPV at the last swept point, which the verdict reports as the loss."]'::jsonb and answer_index = 1 and explanation = 'Every resilience number on that chart is understated: Angola - Deepwater PSC is quoted at 84.8591 where the labelled range gives 107.3918.' then 'old'
           when prompt = 'For USA - Gulf of Mexico on the default project the resilience verdict quotes a loss of 267.7301 million USD. Which two points is that measured between?' and options = '["457.1975 million USD at 0.8 and 228.4023 at 1.4, the last point the sweep visits.", "A contractor NPV of 457.1975 million USD at a multiplier of 0.8 and 189.4674 at 1.5.", "382.0660 million USD at the base multiplier and 189.4674 at 1.5, so the loss runs down from the base case.", "465.4141 million USD at 0.8 and 221.3360 at 1.5, which are the points of Generic Royalty/Tax rather than of this regime."]'::jsonb and answer_index = 1 and explanation = 'Angola - Deepwater PSC sits at the other end of the same table, quoted at 88.6123 million USD over the same eight multipliers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'For USA - Gulf of Mexico on the default project the resilience verdict quotes a loss of 267.7301 million USD. Which two points is that measured between?', options = '["457.1975 million USD at 0.8 and 228.4023 at 1.4, the last point the sweep visits.", "A contractor NPV of 457.1975 million USD at a multiplier of 0.8 and 189.4674 at 1.5.", "382.0660 million USD at the base multiplier and 189.4674 at 1.5, so the loss runs down from the base case.", "465.4141 million USD at 0.8 and 221.3360 at 1.5, which are the points of Generic Royalty/Tax rather than of this regime."]'::jsonb, answer_index = 1, explanation = 'Angola - Deepwater PSC sits at the other end of the same table, quoted at 88.6123 million USD over the same eight multipliers.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 7: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Is the resilience sentence false when it prices a range the chart labels 0.8 to 1.5?' and options = '["Yes, because it names a winner the eight point range would not have named, and the ranking is what the sentence claims to establish.", "Yes, because the quantity it prints belongs to a range no reader can see and no input can reproduce from the chart.", "No, because the loop does reach 1.5 and only the axis label is short, so the number and the range it describes agree with each other.", "No, it reports the range the sweep produced, a 20 percent underspend to a 40 percent overrun."]'::jsonb and answer_index = 3 and explanation = 'It is answering a narrower question than the label asks, which is harder to catch than a wrong number, and on the default project the named winners survive the change of range.' then 'old'
           when prompt = 'While the sweep stopped at a multiplier of 1.4, was the resilience sentence false?' and options = '["Yes, because it named a winner the eight point range would not have named, and the ranking is what the sentence claims to establish.", "Yes, because it quoted a 50 percent overrun while it was measuring a 40 percent one, and the range is half of what such a claim asserts.", "No, because the loop did reach 1.5 and only the axis label was short, so the number and the range agreed all along.", "No, it reported the range the sweep produced, a 20 percent underspend to a 40 percent overrun."]'::jsonb and answer_index = 3 and explanation = 'It was answering a narrower question than the label asked, which is harder to catch than a wrong number, and on the default project the named winners survived the change of range.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 7;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'While the sweep stopped at a multiplier of 1.4, was the resilience sentence false?', options = '["Yes, because it named a winner the eight point range would not have named, and the ranking is what the sentence claims to establish.", "Yes, because it quoted a 50 percent overrun while it was measuring a 40 percent one, and the range is half of what such a claim asserts.", "No, because the loop did reach 1.5 and only the axis label was short, so the number and the range agreed all along.", "No, it reported the range the sweep produced, a 20 percent underspend to a 40 percent overrun."]'::jsonb, answer_index = 3, explanation = 'It was answering a narrower question than the label asked, which is harder to catch than a wrong number, and on the default project the named winners survived the change of range.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 8: explanation, prompt
  select case
           when prompt = 'The seven published capex cases run multipliers of 0.7 to 1.3 and return NPVs from 240.3937 down to 98.2520 million USD. Which regime do they run?' and options = '["The Designer''s own default regime, the one the price cases also use, which is not the Nigeria - PIA (2021) template despite sharing a country with it.", "The Nigeria - PIA (2021) template, which is why the case at a multiplier of 1.0 returns the same NPV as that template''s summary row.", "All six templates at once, with the case reporting the best contractor NPV of the six at each multiplier.", "The Brazil - Concession template, the regime whose resource rent tax makes a capex sweep worth publishing at all."]'::jsonb and answer_index = 0 and explanation = 'Two ranges live in one engine and neither is the one on the axis: the sweep visits 0.8 to 1.4 and the published cases 0.7 to 1.3, where payback slips from year 3 to year 5.' then 'old'
           when prompt = 'The nine published capex cases run multipliers of 0.7 to 1.5 and return NPVs from 220.1703 down to 41.2671 million USD. Which regime do they run?' and options = '["The Designer''s own default regime, the one the price cases also use, which is not the Nigeria - PIA (2021) template despite sharing a country with it.", "The Nigeria - PIA (2021) template, which is why the case at a multiplier of 1.0 returns the same NPV as that template''s summary row.", "All six templates at once, with the case reporting the best contractor NPV of the six at each multiplier.", "The Brazil - Concession template, the regime whose resource rent tax makes a capex sweep worth publishing at all."]'::jsonb and answer_index = 0 and explanation = 'Two ranges live in one engine: the sweep visits 0.8 to 1.5 on the six templates and the published cases 0.7 to 1.5 on the Designer''s own regime, where payback slips from year 3 to year 6.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The nine published capex cases run multipliers of 0.7 to 1.5 and return NPVs from 220.1703 down to 41.2671 million USD. Which regime do they run?', options = '["The Designer''s own default regime, the one the price cases also use, which is not the Nigeria - PIA (2021) template despite sharing a country with it.", "The Nigeria - PIA (2021) template, which is why the case at a multiplier of 1.0 returns the same NPV as that template''s summary row.", "All six templates at once, with the case reporting the best contractor NPV of the six at each multiplier.", "The Brazil - Concession template, the regime whose resource rent tax makes a capex sweep worth publishing at all."]'::jsonb, answer_index = 0, explanation = 'Two ranges live in one engine: the sweep visits 0.8 to 1.5 on the six templates and the published cases 0.7 to 1.5 on the Designer''s own regime, where payback slips from year 3 to year 6.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 9: explanation, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What can a reader change about the capex sweep to see a 50 percent overrun?' and options = '["The multiplier list, which the comparison accepts alongside the project and the regimes.", "The axis maximum, which is the value the loop tests against and therefore also the value it stops at.", "Nothing about the sweep, since the range, the step and the number of points are written into the loop and no input reaches them.", "The capex lines of the project itself, which is the only supported way to move the range and gives the same seven multipliers around a larger base."]'::jsonb and answer_index = 2 and explanation = 'The eighth point exists and is perfectly ordinary, 189.4674 million USD for USA - Gulf of Mexico, but reaching it means calling the ledger function directly at that multiplier.' then 'old'
           when prompt = 'What can a reader change about the capex sweep to see a 70 percent overrun?' and options = '["The multiplier list, which the comparison accepts alongside the project and the regimes.", "The axis maximum, which is the value the step count is built from and therefore also the value it stops at.", "Nothing about the sweep, since the range, the step and the number of points are written into the engine and no input reaches them.", "The capex lines of the project itself, which the sweep reads in order to set its own multipliers, so that a larger capital base widens the swept range."]'::jsonb and answer_index = 2 and explanation = 'The last swept point is ordinary, 189.4674 million USD for USA - Gulf of Mexico at a multiplier of 1.5, but reaching anything past it means calling the ledger function directly.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What can a reader change about the capex sweep to see a 70 percent overrun?', options = '["The multiplier list, which the comparison accepts alongside the project and the regimes.", "The axis maximum, which is the value the step count is built from and therefore also the value it stops at.", "Nothing about the sweep, since the range, the step and the number of points are written into the engine and no input reaches them.", "The capex lines of the project itself, which the sweep reads in order to set its own multipliers, so that a larger capital base widens the swept range."]'::jsonb, answer_index = 2, explanation = 'The last swept point is ordinary, 189.4674 million USD for USA - Gulf of Mexico at a multiplier of 1.5, but reaching anything past it means calling the ledger function directly.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 10: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = '`calculateIRR` reports 102400.0000 percent on flows of -1 in year 1 and 2000 in year 2. What is that number?' and options = '["The root of the flows, which the 80 bisections found to that precision before the tolerance closed.", "The top of its own search, 100 percent doubled ten times, returned because the NPV was still positive there.", "A clamp typed into the solver to stop a runaway Newton iteration from returning an infinite rate.", "The rate at which the NPV of those flows first crosses zero from below, which is why the golden pins it as the expected value."]'::jsonb and answer_index = 1 and explanation = 'The NPV at 102400 percent is 0.0009, small, positive and not zero, while the true root is 199900 percent.' then 'old'
           when prompt = 'On flows of -1 in year 1 and 2000 in year 2 the retired bisection reported 102400 percent. What does `calculateIRR` return now?' and options = '["102400 percent still, the top of a doubling bracket that the band from -99 to 1000 percent does not change.", "Null, with the status above-clamp and `irrRootAboveBand` true, because the only root is 199900 percent.", "199900.0000 percent, the true root, which the widened search now reaches.", "1000.0000 percent, the top of the band, reported as a clamp in the way the screening engine reports its own."]'::jsonb and answer_index = 1 and explanation = 'The NPV at 102400 percent is 0.0009, small, positive and not zero, so the retired value was the edge of a search and never a root.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On flows of -1 in year 1 and 2000 in year 2 the retired bisection reported 102400 percent. What does `calculateIRR` return now?', options = '["102400 percent still, the top of a doubling bracket that the band from -99 to 1000 percent does not change.", "Null, with the status above-clamp and `irrRootAboveBand` true, because the only root is 199900 percent.", "199900.0000 percent, the true root, which the widened search now reaches.", "1000.0000 percent, the top of the band, reported as a clamp in the way the screening engine reports its own."]'::jsonb, answer_index = 1, explanation = 'The NPV at 102400 percent is 0.0009, small, positive and not zero, so the retired value was the edge of a search and never a root.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 11: explanation, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Two solvers in this package report suspiciously round rates, 102400 percent and 1000 percent. What is the tell a reader should carry?' and options = '["Size rather than roundness, since no real project returns a rate in the thousands of percent and any such value is the edge of a search.", "A rate quoted to four decimal places, which is the format the bisection uses and the Newton iteration does not.", "An IRR reported beside a negative NPV, which is the only combination that a bracket return can produce in either engine.", "Roundness rather than size, because both numbers are the edge of a search."]'::jsonb and answer_index = 3 and explanation = 'The published `capex_multiplier_0_7` case returns an IRR of 1095.4783 percent on a real ledger and that is a root, while 1000 is a Newton clamp and 102400 is a doubling bound.' then 'old'
           when prompt = 'Two solvers in this package once reported suspiciously round rates, 102400 percent and 1000 percent. What is the tell a reader should carry?' and options = '["Size rather than roundness, since no real project returns a rate in the thousands of percent and any such value is the edge of a search.", "A rate quoted to four decimal places, which is the format the bisection uses and the Newton iteration does not.", "An IRR reported beside a negative NPV, which is the only combination that a bracket return can produce in either engine.", "Roundness rather than size, because both numbers were the edge of a search."]'::jsonb and answer_index = 3 and explanation = 'On the published `capex_multiplier_0_7` case 1095.4783 percent is a real root and 102400 never was one, and the engine now returns null with a status rather than either.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 11;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two solvers in this package once reported suspiciously round rates, 102400 percent and 1000 percent. What is the tell a reader should carry?', options = '["Size rather than roundness, since no real project returns a rate in the thousands of percent and any such value is the edge of a search.", "A rate quoted to four decimal places, which is the format the bisection uses and the Newton iteration does not.", "An IRR reported beside a negative NPV, which is the only combination that a bracket return can produce in either engine.", "Roundness rather than size, because both numbers were the edge of a search."]'::jsonb, answer_index = 3, explanation = 'On the published `capex_multiplier_0_7` case 1095.4783 percent is a real root and 102400 never was one, and the engine now returns null with a status rather than either.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 12: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = '`irr_all_positive` and `irr_npv0_negative` both report 0.0000 percent. What separates them?' and options = '["The first has flows that never change sign on a profitable project, with an NPV at 10 percent of 25.6198, and the second loses money at every rate, with an NPV at 10 percent of -16.5289.", "The first is a true root at zero and the second is the early exit, which is why only the second carries a disagreement in the golden.", "The first was stopped by the bracket and the second by the sign test, so one is a bound and the other a refusal.", "Nothing separates them in the return value or in the flows, since both projects break even exactly at a rate of zero."]'::jsonb and answer_index = 0 and explanation = 'The solver refuses to report a negative internal rate of return, so one zero means the question was ill posed and the other means the answer is negative, and they print the same.' then 'old'
           when prompt = '`irr_all_positive_no_sign_change` and `irr_negative_root_reported` both printed 0.0000 percent under the retired rule. What does each return now?' and options = '["Null with the status no-sign-change on the first, whose NPV at 10 percent is 25.6198, and the negative root itself, -10.0000 percent, on the second, whose NPV at 10 percent is -16.5289.", "Null with the status no-root on both, since neither has a rate inside the band from -99 to 1000 percent.", "0.0000 percent on the first and null on the second, the engine still declining to print a negative rate.", "-10.0000 percent on both, the shared contract reporting the nearest root inside the band whatever the flows do."]'::jsonb and answer_index = 0 and explanation = 'One zero used to mean the question was ill posed and the other that the answer was negative, and they printed the same. Each now carries either a status word or the rate itself.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 12;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 12'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`irr_all_positive_no_sign_change` and `irr_negative_root_reported` both printed 0.0000 percent under the retired rule. What does each return now?', options = '["Null with the status no-sign-change on the first, whose NPV at 10 percent is 25.6198, and the negative root itself, -10.0000 percent, on the second, whose NPV at 10 percent is -16.5289.", "Null with the status no-root on both, since neither has a rate inside the band from -99 to 1000 percent.", "0.0000 percent on the first and null on the second, the engine still declining to print a negative rate.", "-10.0000 percent on both, the shared contract reporting the nearest root inside the band whatever the flows do."]'::jsonb, answer_index = 0, explanation = 'One zero used to mean the question was ill posed and the other that the answer was negative, and they printed the same. Each now carries either a status word or the rate itself.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 13: explanation, option_0, option_1, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The resource rent tax base is the contractor profit share minus `totalCapex` times `rrtUpliftPct` divided by 100. What does the default of 20 grant over the project life?' and options = '["A fifth of the capex, deducted once in year 1 alongside the capital spend it uplifts.", "A fifth of the capex in each year until the capital has been recovered, after which the deduction stops.", "Five times the whole capex, because the subtraction is made in every one of the 25 years.", "A fifth of the profit share each year, which is what makes the relief proportional to the rent the tax is aimed at."]'::jsonb and answer_index = 2 and explanation = 'Total capex on the default project is 500.0000 million USD and the engine calls the annual treatment a screening approximation in its own comment.' then 'old'
           when prompt = 'The resource rent tax is relieved from a pool opened at total capex times one plus `rrtUpliftPct` over 100. What does the default of 20 grant over the project life?' and options = '["Five times the whole capex, a fifth of it being subtracted from the base in every one of the 25 years.", "A fifth of the capex, deducted once in year 1 alongside the capital spend it uplifts.", "At most 1.2 times the capex, once, because the pool is drawn against the profit share and never refilled.", "A fifth of the profit share each year, which is what makes the relief proportional to the rent the tax is aimed at."]'::jsonb and answer_index = 2 and explanation = 'Total capex on the default project is 500.0000 million USD, and the retired rule subtracted total capex times the uplift over 100 in every one of the 25 years, which the engine called a screening approximation in its own comment.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 13;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The resource rent tax is relieved from a pool opened at total capex times one plus `rrtUpliftPct` over 100. What does the default of 20 grant over the project life?', options = '["Five times the whole capex, a fifth of it being subtracted from the base in every one of the 25 years.", "A fifth of the capex, deducted once in year 1 alongside the capital spend it uplifts.", "At most 1.2 times the capex, once, because the pool is drawn against the profit share and never refilled.", "A fifth of the profit share each year, which is what makes the relief proportional to the rent the tax is aimed at."]'::jsonb, answer_index = 2, explanation = 'Total capex on the default project is 500.0000 million USD, and the retired rule subtracted total capex times the uplift over 100 in every one of the 25 years, which the engine called a screening approximation in its own comment.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 14: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Sweeping `rrtUpliftPct` on the Brazil - Concession instruments with the corporate income tax set to zero, so the resource rent tax stands alone, the total tax reads 62.5794 at an uplift of 20, 1.0282 at 30 and 0.0000 at 50. What does the last row show?' and options = '["The resource rent tax reaching its own minimum tax floor, below which the stack will not charge a regime whose base has gone negative.", "The instrument switched off by a parameter that never mentions switching anything off, with no first year carrying a positive charge.", "The regime''s whole tax bill going to zero, since the isolated sweep is the published Brazil stack with its corporate income tax of 34 percent inside it.", "A rounding of a small positive charge, since the sweep prints tax to four decimals and the charge in the later years is smaller than that."]'::jsonb and answer_index = 1 and explanation = 'Ten points of uplift, from 20 to 30, take the total from 62.5794 to 1.0282, and at 50 the first year with a positive charge is null.' then 'old'
           when prompt = 'Sweeping `rrtUpliftPct` on the Brazil - Concession instruments with the corporate income tax set to zero, so the resource rent tax stands alone, the total tax reads 390.7165 at an uplift of 0, 350.7165 at 20 and 290.7165 at 50. What does the sweep show?' and options = '["An annual allowance, since a total tax that keeps falling with every point of uplift can only come from a deduction repeated in every year of the life.", "A pool: the relief is the same size in the end and the uplift only moves how long it lasts, so the first charged year slides from 6 to 9.", "The instrument switching itself off, since at an uplift of 50 no year of the ledger carries a positive resource rent tax charge.", "A minimum tax floor, below which the stack will not charge a regime whose base has gone negative."]'::jsonb and answer_index = 1 and explanation = 'Total capex here is 500.0000 million USD, so an uplift of 20 opens a pool of 1.2 times that and a zero uplift opens one at the capex itself. The total falls by a fixed amount per point of uplift and the first charged year slides later.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Sweeping `rrtUpliftPct` on the Brazil - Concession instruments with the corporate income tax set to zero, so the resource rent tax stands alone, the total tax reads 390.7165 at an uplift of 0, 350.7165 at 20 and 290.7165 at 50. What does the sweep show?', options = '["An annual allowance, since a total tax that keeps falling with every point of uplift can only come from a deduction repeated in every year of the life.", "A pool: the relief is the same size in the end and the uplift only moves how long it lasts, so the first charged year slides from 6 to 9.", "The instrument switching itself off, since at an uplift of 50 no year of the ledger carries a positive resource rent tax charge.", "A minimum tax floor, below which the stack will not charge a regime whose base has gone negative."]'::jsonb, answer_index = 1, explanation = 'Total capex here is 500.0000 million USD, so an uplift of 20 opens a pool of 1.2 times that and a zero uplift opens one at the capex itself. The total falls by a fixed amount per point of uplift and the first charged year slides later.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m05-numbers-to-distrust ord 15: explanation, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = '`rrt_uplift_default_20` omits the uplift field and returns total tax of 1638.5664 million USD, while `rrt_uplift_zero_respected` sets it to 0 and returns 2607.5549. What does a blank field give?' and options = '["A zero uplift, on the ordinary rule that an absent numeric field contributes nothing to the base it would have reduced.", "Whatever the template carried, since a comparison fills a missing tax field from the regime it was cloned from before the ledger runs.", "An error the comparison reports rather than a ledger, because the resource rent tax cannot be charged without a stated uplift.", "The default of 20, and 1638.5664 million USD with it."]'::jsonb and answer_index = 3 and explanation = 'Contractor net cash flow moves with it, 1812.4483 million USD on the default against 843.4598 on an explicit zero, so omitting the field is a decision.' then 'old'
           when prompt = '`rrt_uplift_default_20` omits the uplift field and returns total tax of 2127.5549 million USD, while `rrt_uplift_zero_respected` sets it to 0 and returns 2207.5549. What does a blank field give?' and options = '["A zero uplift, on the ordinary rule that an absent numeric field contributes nothing to the base it would have reduced.", "Whatever the template carried, since a comparison fills a missing tax field from the regime it was cloned from before the ledger runs.", "An error the comparison reports rather than a ledger, because the resource rent tax cannot be charged without a stated uplift.", "The default of 20, and 2127.5549 million USD with it."]'::jsonb and answer_index = 3 and explanation = 'Contractor net cash flow moves with it, 1323.4598 million USD on the default against 1243.4598 on an explicit zero, so omitting the field is a decision.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m05-numbers-to-distrust ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = '`rrt_uplift_default_20` omits the uplift field and returns total tax of 2127.5549 million USD, while `rrt_uplift_zero_respected` sets it to 0 and returns 2207.5549. What does a blank field give?', options = '["A zero uplift, on the ordinary rule that an absent numeric field contributes nothing to the base it would have reduced.", "Whatever the template carried, since a comparison fills a missing tax field from the regime it was cloned from before the ledger runs.", "An error the comparison reports rather than a ledger, because the resource rent tax cannot be charged without a stated uplift.", "The default of 20, and 2127.5549 million USD with it."]'::jsonb, answer_index = 3, explanation = 'Contractor net cash flow moves with it, 1323.4598 million USD on the default against 1243.4598 on an explicit zero, so omitting the field is a decision.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m05-numbers-to-distrust ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-expert-reading ord 8: explanation, option_0, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'A capstone answer states the uplift as absent rather than stating a number. Why does that matter?' and options = '["It does not matter, because the resource rent tax is charged on the profit share and the uplift only moves the year the charge begins.", "Because the comparison rejects a regime with an absent field and substitutes the template it was cloned from, which changes more instruments than the uplift alone.", "Because an absent field is reported as null in the summary, and a null in any instrument suppresses the whole tax block for that regime.", "A missing uplift is not a zero uplift: the published pair returns total tax of 1638.5664 million USD on the default and 2607.5549 on an explicit zero."]'::jsonb and answer_index = 3 and explanation = 'Contractor net cash flow moves with it too, 1812.4483 million USD against 843.4598, so the blank field is a decision and has to be written down as one.' then 'old'
           when prompt = 'A capstone answer states the uplift as absent rather than stating a number. Why does that matter?' and options = '["It does not matter, because an absent uplift and an explicit zero open the same pool and return the same total tax.", "Because the comparison rejects a regime with an absent field and substitutes the template it was cloned from, which changes more instruments than the uplift alone.", "Because an absent field is reported as null in the summary, and a null in any instrument suppresses the whole tax block for that regime.", "A missing uplift is not a zero uplift: the published pair returns total tax of 2127.5549 million USD on the default and 2207.5549 on an explicit zero."]'::jsonb and answer_index = 3 and explanation = 'Contractor net cash flow moves with it too, 1323.4598 million USD against 1243.4598, so the blank field is a decision and has to be written down as one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-expert-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-expert-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A capstone answer states the uplift as absent rather than stating a number. Why does that matter?', options = '["It does not matter, because an absent uplift and an explicit zero open the same pool and return the same total tax.", "Because the comparison rejects a regime with an absent field and substitutes the template it was cloned from, which changes more instruments than the uplift alone.", "Because an absent field is reported as null in the summary, and a null in any instrument suppresses the whole tax block for that regime.", "A missing uplift is not a zero uplift: the published pair returns total tax of 2127.5549 million USD on the default and 2207.5549 on an explicit zero."]'::jsonb, answer_index = 3, explanation = 'Contractor net cash flow moves with it too, 1323.4598 million USD against 1243.4598, so the blank field is a decision and has to be written down as one.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-expert-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-expert-reading ord 9: explanation, option_0, option_1, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'How should each sweep be quoted in a written answer?' and options = '["Both as the ranges their axes carry, 40 to 120 USD per bbl and 0.8 to 1.5, since those are the ranges a reader of the chart will check against.", "The price sweep as nine points moving all three stream prices together and the capex sweep as eight points, the last of which the golden publishes on its own.", "Whichever range the verdict sentence names, because the verdict is computed from the series and therefore carries the range with it.", "The price sweep as nine oil prices from 40 to 120 USD per bbl with gas and NGL unmoved, and the capex sweep as seven points ending at a multiplier of 1.4."]'::jsonb and answer_index = 3 and explanation = 'ODIDI''s capex losses of 150.9021 million USD for Ghana - Deepwater and 215.1075 for Angola - Deepwater PSC are losses to a 40 percent overrun, not to the 50 percent the axis promises.' then 'old'
           when prompt = 'How should each sweep be quoted in a written answer?' and options = '["The price sweep as nine oil prices moving all three of the stream prices together, and the capex sweep as eight points running from a multiplier of 0.8 to 1.5.", "The price sweep as nine oil prices from 40 to 120 USD per bbl, and the capex sweep as the nine published multipliers from 0.7 to 1.5.", "Whichever range the verdict sentence names, because the verdict is computed from the series and therefore carries the range with it.", "The price sweep as nine oil prices from 40 to 120 USD per bbl with gas and NGL unmoved, and the capex sweep as eight points from a multiplier of 0.8 to 1.5."]'::jsonb and answer_index = 3 and explanation = 'ODIDI''s capex losses of 181.1922 million USD for Ghana - Deepwater and 252.6075 for Angola - Deepwater PSC are losses to a 50 percent overrun on that field alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-expert-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-expert-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'How should each sweep be quoted in a written answer?', options = '["The price sweep as nine oil prices moving all three of the stream prices together, and the capex sweep as eight points running from a multiplier of 0.8 to 1.5.", "The price sweep as nine oil prices from 40 to 120 USD per bbl, and the capex sweep as the nine published multipliers from 0.7 to 1.5.", "Whichever range the verdict sentence names, because the verdict is computed from the series and therefore carries the range with it.", "The price sweep as nine oil prices from 40 to 120 USD per bbl with gas and NGL unmoved, and the capex sweep as eight points from a multiplier of 0.8 to 1.5."]'::jsonb, answer_index = 3, explanation = 'ODIDI''s capex losses of 181.1922 million USD for Ghana - Deepwater and 252.6075 for Angola - Deepwater PSC are losses to a 50 percent overrun on that field alone.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-expert-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- m06-the-expert-reading ord 15: option_0, option_1, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Nigeria - PIA (2021) has a capex resilience of 97.7613 million USD and also of 118.3685. Which is right?' and options = '["The first, because the second figure came from calling the ledger function directly at a multiplier the comparison never sweeps and never returns to a reader.", "Both, each for its own question: 97.7613 is the loss over the seven points the sweep visited and 118.3685 the loss over the eight the axis advertised.", "The second, because the axis label is the published range, and a resilience figure quoted short of that range understates the exposure the chart set out to price.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb and answer_index = 1 and explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 as government share of net revenue and 76.7282 as government take.' then 'old'
           when prompt = 'Nigeria - PIA (2021) has a capex resilience of 118.3685 million USD and also of 216.2236. Which is right?' and options = '["The first, because the second was measured on a field whose NPVs are all negative, and a loss between two negative numbers is not a resilience figure.", "Both, each for its own field: 118.3685 is the loss on the default project and 216.2236 the loss on ODIDI, over the same eight multipliers.", "The second, because a figure quoted on the Designer''s own defaults understates what an overrun costs on a real field.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb and answer_index = 1 and explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 as government share of net revenue and 76.7282 as government take.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for m06-the-expert-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: m06-the-expert-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Nigeria - PIA (2021) has a capex resilience of 118.3685 million USD and also of 216.2236. Which is right?', options = '["The first, because the second was measured on a field whose NPVs are all negative, and a loss between two negative numbers is not a resilience figure.", "Both, each for its own field: 118.3685 is the loss on the default project and 216.2236 the loss on ODIDI, over the same eight multipliers.", "The second, because a figure quoted on the Designer''s own defaults understates what an overrun costs on a real field.", "Neither, because a loss between two endpoints is not a resilience figure at all when the curve between them is not a straight line."]'::jsonb, answer_index = 1, explanation = 'A number without its definition is not a number, which is the same lesson as one regime reading 59.6432 as government share of net revenue and 76.7282 as government take.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: m06-the-expert-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 2: explanation, option_1
  select case
           when prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?' and options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government cash flow.", "That the test project is insensitive to fiscal terms, since Complex returns 709.3642 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb and answer_index = 2 and explanation = 'Complex on the same project returns 709.3642 million USD of NPV and 2934.0177 of government cash flow, so the field is not the reason the two agree.' then 'old'
           when prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?' and options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government cash flow.", "That the test project is insensitive to fiscal terms, since Complex returns 657.4150 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb and answer_index = 2 and explanation = 'Complex on the same project returns 657.4150 million USD of NPV and 3087.2215 of government cash flow, so the field is not the reason the two agree.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 2'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the Suite test project the comparison of Flat against Complex returns Flat at an NPV of 1262.3470 million USD, which is the row Generic Royalty/Tax returns on the same project. What does that show?', options = '["That the comparison caches a ledger by project and reuses it whenever two regimes return the same government cash flow.", "That the test project is insensitive to fiscal terms, since Complex returns 657.4150 million USD on the same run.", "A name is not a regime: the two carry identical instruments, so they return an identical row.", "That Generic Royalty/Tax is the fallback the engine substitutes whenever a regime is passed without a full set of four instruments."]'::jsonb, answer_index = 2, explanation = 'Complex on the same project returns 657.4150 million USD of NPV and 3087.2215 of government cash flow, so the field is not the reason the two agree.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 5: option_1
  select case
           when prompt = 'Government share of net revenue, the summary''s percentage column, counts a great deal that no tax authority calls tax. What is in its numerator?' and options = '["Government cash flow, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 53.4534 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government cash flow net of the cost the state recovered, which is what takes capex out of the ratio."]'::jsonb and answer_index = 0 and explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.' then 'old'
           when prompt = 'Government share of net revenue, the summary''s percentage column, counts a great deal that no tax authority calls tax. What is in its numerator?' and options = '["Government cash flow, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 56.2797 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government cash flow net of the cost the state recovered, which is what takes capex out of the ratio."]'::jsonb and answer_index = 0 and explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Government share of net revenue, the summary''s percentage column, counts a great deal that no tax authority calls tax. What is in its numerator?', options = '["Government cash flow, which is royalty plus the government''s share of profit oil plus tax, so USA - Gulf of Mexico reads 34.0485 percent while its only tax is corporate income tax at 21 percent.", "Tax alone, which is why Angola - Deepwater PSC reads 56.2797 percent against instruments carrying 25 and 50 percent.", "Tax plus royalty, with the profit oil split excluded because it is a share of production rather than a charge on income.", "Government cash flow net of the cost the state recovered, which is what takes capex out of the ratio."]'::jsonb, answer_index = 0, explanation = 'A flat royalty of 18.75 percent contributes 503.7989 million USD of the 764.5528 that regime collects.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 6: explanation
  select case
           when prompt = 'What does `summary[0]` guarantee on any comparison?' and options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government cash flow, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb and answer_index = 2 and explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 43.0919, so even the IRR column is already out of order.' then 'old'
           when prompt = 'What does `summary[0]` guarantee on any comparison?' and options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government cash flow, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb and answer_index = 2 and explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 44.0823, so even the IRR column is already out of order.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does `summary[0]` guarantee on any comparison?', options = '["The highest contractor NPV and the fastest payback, since the two move together on every published comparison in the course.", "The best result for the contractor on NPV, IRR and payback, which is what makes it the row a recommendation is written from.", "The highest contractor NPV at the comparison''s discount rate, and nothing else.", "The lowest government cash flow, because take and contractor NPV are the two sides of one revenue total and must run opposite each other."]'::jsonb, answer_index = 2, explanation = 'On the default project rank 2 returns an IRR of 40.2125 percent and rank 3 returns 44.0823, so even the IRR column is already out of order.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 9: explanation
  select case
           when prompt = 'USA - Gulf of Mexico shows a price climb of -17.2498 percentage points and Generic Royalty/Tax -10.1897 on the default project. What makes those two regressive?' and options = '["A fixed royalty rate and a fixed tax rate on a growing profit hand the government a shrinking fraction once cost recovery has been paid off.", "A cost recovery limit that rises with price, which returns more of the contractor''s cost before any split is taken.", "A profit split tiered on the R factor, which walks the contractor into a more generous tranche as revenue grows.", "A minimum tax that binds at low prices and stops binding once the computed charge exceeds it."]'::jsonb and answer_index = 0 and explanation = 'The three templates whose split is tiered on the R factor climb instead, by 12.1305, 10.1420 and 7.8960 percentage points.' then 'old'
           when prompt = 'USA - Gulf of Mexico shows a price climb of -17.2498 percentage points and Generic Royalty/Tax -10.1897 on the default project. What makes those two regressive?' and options = '["A fixed royalty rate and a fixed tax rate on a growing profit hand the government a shrinking fraction once cost recovery has been paid off.", "A cost recovery limit that rises with price, which returns more of the contractor''s cost before any split is taken.", "A profit split tiered on the R factor, which walks the contractor into a more generous tranche as revenue grows.", "A minimum tax that binds at low prices and stops binding once the computed charge exceeds it."]'::jsonb and answer_index = 0 and explanation = 'Brazil - Concession climbs the most at 20.5076 percentage points, and the three templates whose split is tiered on the R factor climb by 19.6873, 10.1420 and 7.8960.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 9'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'USA - Gulf of Mexico shows a price climb of -17.2498 percentage points and Generic Royalty/Tax -10.1897 on the default project. What makes those two regressive?', options = '["A fixed royalty rate and a fixed tax rate on a growing profit hand the government a shrinking fraction once cost recovery has been paid off.", "A cost recovery limit that rises with price, which returns more of the contractor''s cost before any split is taken.", "A profit split tiered on the R factor, which walks the contractor into a more generous tranche as revenue grows.", "A minimum tax that binds at low prices and stops binding once the computed charge exceeds it."]'::jsonb, answer_index = 0, explanation = 'Brazil - Concession climbs the most at 20.5076 percentage points, and the three templates whose split is tiered on the R factor climb by 19.6873, 10.1420 and 7.8960.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 10: option_1, prompt
  select case
           when prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?' and options = '["The climb is measured on government share of net revenue rather than on government take, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'old'
           when prompt = 'Angola - Deepwater PSC returns a price climb of 19.6873 percentage points while its share falls from 63.4520 at 40 USD per bbl to 59.5510 at 50. How can both be true?' and options = '["The climb is measured on government share of net revenue rather than on government take, and the two definitions move in opposite directions.", "The share at 40 USD per bbl was flagged exceeds rather than share, so that point is not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Angola - Deepwater PSC returns a price climb of 19.6873 percentage points while its share falls from 63.4520 at 40 USD per bbl to 59.5510 at 50. How can both be true?', options = '["The climb is measured on government share of net revenue rather than on government take, and the two definitions move in opposite directions.", "The share at 40 USD per bbl was flagged exceeds rather than share, so that point is not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb, answer_index = 2, explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 14: explanation, prompt
  select case
           when prompt = 'The resilience verdict names USA - Gulf of Mexico the least resilient on the default project at 228.7953 million USD given up. What is the catch in that ranking?' and options = '["The quantity is a percentage of base NPV, so a regime with a small base is penalised for a loss that is small in money.", "The quantity is an absolute amount, so a regime with more NPV to lose is penalised for having it, and that regime''s base NPV is 382.0660 million USD.", "The quantity is measured from the peak of the curve, so a regime that rises before it falls is charged for the rise as well.", "The quantity is discounted at 10 percent while the base NPV is not, so the two cannot be compared as amounts at all."]'::jsonb and answer_index = 1 and explanation = 'Angola - Deepwater PSC is named the most resilient at 84.8591 million USD given up, on a base NPV of 223.7100.' then 'old'
           when prompt = 'The resilience verdict names USA - Gulf of Mexico the least resilient on the default project at 267.7301 million USD given up. What is the catch in that ranking?' and options = '["The quantity is a percentage of base NPV, so a regime with a small base is penalised for a loss that is small in money.", "The quantity is an absolute amount, so a regime with more NPV to lose is penalised for having it, and that regime''s base NPV is 382.0660 million USD.", "The quantity is measured from the peak of the curve, so a regime that rises before it falls is charged for the rise as well.", "The quantity is discounted at 10 percent while the base NPV is not, so the two cannot be compared as amounts at all."]'::jsonb and answer_index = 1 and explanation = 'Angola - Deepwater PSC is named the most resilient at 88.6123 million USD given up, on a base NPV of 211.3787.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 14'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The resilience verdict names USA - Gulf of Mexico the least resilient on the default project at 267.7301 million USD given up. What is the catch in that ranking?', options = '["The quantity is a percentage of base NPV, so a regime with a small base is penalised for a loss that is small in money.", "The quantity is an absolute amount, so a regime with more NPV to lose is penalised for having it, and that regime''s base NPV is 382.0660 million USD.", "The quantity is measured from the peak of the curve, so a regime that rises before it falls is charged for the rise as well.", "The quantity is discounted at 10 percent while the base NPV is not, so the two cannot be compared as amounts at all."]'::jsonb, answer_index = 1, explanation = 'Angola - Deepwater PSC is named the most resilient at 88.6123 million USD given up, on a base NPV of 211.3787.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 15: option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why can the price chart and the capex chart not be read as a matched pair?' and options = '["One is computed from the summary and the other from the ledgers, so the two are drawn from different objects inside the returned result.", "One re-runs the whole comparison at each point while the other rescales the base case, so only one of the two is a set of full computations.", "One is a rate on the state''s side of the ledger at nine prices and the other is money on the contractor''s side at seven multipliers.", "One has nine points and the other has seven."]'::jsonb and answer_index = 2 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s values can be compared between projects of different sizes.' then 'old'
           when prompt = 'Why can the price chart and the capex chart not be read as a matched pair?' and options = '["One is computed from the summary and the other from the ledgers, so the two are drawn from different objects inside the returned result.", "One re-runs the whole comparison at each point while the other rescales the base case, so only one of the two is a set of full computations.", "One is a rate on the state''s side of the ledger at nine prices and the other is money on the contractor''s side at eight multipliers.", "One has nine points and the other has eight."]'::jsonb and answer_index = 2 and explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s values can be compared between projects of different sizes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 15'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why can the price chart and the capex chart not be read as a matched pair?', options = '["One is computed from the summary and the other from the ledgers, so the two are drawn from different objects inside the returned result.", "One re-runs the whole comparison at each point while the other rescales the base case, so only one of the two is a set of full computations.", "One is a rate on the state''s side of the ledger at nine prices and the other is money on the contractor''s side at eight multipliers.", "One has nine points and the other has eight."]'::jsonb, answer_index = 2, explanation = 'Only the capex chart''s values can be added or subtracted as amounts, and only the price chart''s values can be compared between projects of different sizes.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 16: option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why can a capex loss of 84.8591 million USD on the default project not be carried to another field?' and options = '["Because the losses are quoted in million USD and two fields of different size need the figure expressed as a percentage first.", "Because a second field would be swept over a different capex range, since the multipliers are taken from the project''s own capex lines.", "Because the verdict rounds to one decimal place, and a figure carried between fields loses the digits that separated the regimes.", "The ordering itself changes: on ODIDI the same six templates give up between 150.9021 and 215.1075 million USD."]'::jsonb and answer_index = 3 and explanation = 'Angola - Deepwater PSC gives up the least of the six on the default project and the most of the six on ODIDI, so a resilience ranking belongs to a field.' then 'old'
           when prompt = 'Why can a capex loss of 88.6123 million USD on the default project not be carried to another field?' and options = '["Because the losses are quoted in million USD and two fields of different size need the figure expressed as a percentage first.", "Because a second field would be swept over a different capex range, since the multipliers are taken from the project''s own capex lines.", "Because the verdict rounds to one decimal place, and a figure carried between fields loses the digits that separated the regimes.", "The ordering itself changes: on ODIDI the same six templates give up between 181.1922 and 252.6075 million USD."]'::jsonb and answer_index = 3 and explanation = 'Angola - Deepwater PSC gives up the least of the six on the default project and the most of the six on ODIDI, so a resilience ranking belongs to a field.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 16'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why can a capex loss of 88.6123 million USD on the default project not be carried to another field?', options = '["Because the losses are quoted in million USD and two fields of different size need the figure expressed as a percentage first.", "Because a second field would be swept over a different capex range, since the multipliers are taken from the project''s own capex lines.", "Because the verdict rounds to one decimal place, and a figure carried between fields loses the digits that separated the regimes.", "The ordering itself changes: on ODIDI the same six templates give up between 181.1922 and 252.6075 million USD."]'::jsonb, answer_index = 3, explanation = 'Angola - Deepwater PSC gives up the least of the six on the default project and the most of the six on ODIDI, so a resilience ranking belongs to a field.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 18: explanation
  select case
           when prompt = 'A resilience verdict names a different regime on a second run. Which three explanations must be separated?' and options = '["The discount rate moved, the regime list moved, or the sweep was run before the summary had been sorted by contractor NPV.", "The field moved, the range moved, or there was nothing to rank in the first place.", "The capex lines moved, the deck moved, or the verdict was read from the price sweep rather than from the capex sweep.", "The tie break changed, the rounding changed, or the golden pinned a winner the engine no longer returns."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six regimes give up 10909.090909 million USD, so the third explanation is not hypothetical.' then 'old'
           when prompt = 'A resilience verdict names a different regime on a second run. Which three explanations must be separated?' and options = '["The discount rate moved, the regime list moved, or the sweep was run before the summary had been sorted by contractor NPV.", "The field moved, the range moved, or there was nothing to rank in the first place.", "The capex lines moved, the deck moved, or the verdict was read from the price sweep rather than from the capex sweep.", "The tie break changed, the rounding changed, or the golden pinned a winner the engine no longer returns."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six regimes give up 12727.272727 million USD, so the third explanation is not hypothetical.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 18'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A resilience verdict names a different regime on a second run. Which three explanations must be separated?', options = '["The discount rate moved, the regime list moved, or the sweep was run before the summary had been sorted by contractor NPV.", "The field moved, the range moved, or there was nothing to rank in the first place.", "The capex lines moved, the deck moved, or the verdict was read from the price sweep rather than from the capex sweep.", "The tie break changed, the rounding changed, or the golden pinned a winner the engine no longer returns."]'::jsonb, answer_index = 1, explanation = 'On the comparison built with capex of 20000 all six regimes give up 12727.272727 million USD, so the third explanation is not hypothetical.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 23: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the ODIDI comparison the capex verdict names Ghana - Deepwater and the price verdict names Ghana - Deepwater. Is that agreement a finding?' and options = '["No, because both verdicts are produced by the same reduce over the same series and must always name the same regime.", "No, because a climb of 1.9971 percentage points is inside the precision the verdict prints, so the price verdict ranked nothing.", "It is a real agreement on that field, since Ghana gives up the least at 150.9021 million USD and climbs the most at 1.9971 percentage points.", "Yes, and it carries to any field, because a regime that takes a share of the upside absorbs a share of the downside."]'::jsonb and answer_index = 2 and explanation = 'On the default project the pairing is looser, with Angola - Deepwater PSC first by climb at 12.1305 and Ghana - Deepwater second by loss at 88.2631.' then 'old'
           when prompt = 'On the ODIDI comparison the capex verdict names Ghana - Deepwater and the price verdict names Brazil - Concession. What does that disagreement show?' and options = '["That one of the two verdicts has ranked noise, both being produced by the same reduce over the same series.", "That the price verdict ranked nothing, a climb of 7.4752 percentage points being inside the precision its sentence prints.", "That the two sweeps measure different things and need not agree: Ghana gives up the least at 181.1922 million USD while Brazil climbs the most at 7.4752 percentage points.", "That ODIDI is a poor field to compare regimes on, because a field whose NPVs are all negative cannot separate two sweeps."]'::jsonb and answer_index = 2 and explanation = 'On the default project the capex verdict names Angola - Deepwater PSC at 88.6123 million USD while the price verdict declines to rank at all, so the two sweeps agree in tendency and never row for row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 23'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the ODIDI comparison the capex verdict names Ghana - Deepwater and the price verdict names Brazil - Concession. What does that disagreement show?', options = '["That one of the two verdicts has ranked noise, both being produced by the same reduce over the same series.", "That the price verdict ranked nothing, a climb of 7.4752 percentage points being inside the precision its sentence prints.", "That the two sweeps measure different things and need not agree: Ghana gives up the least at 181.1922 million USD while Brazil climbs the most at 7.4752 percentage points.", "That ODIDI is a poor field to compare regimes on, because a field whose NPVs are all negative cannot separate two sweeps."]'::jsonb, answer_index = 2, explanation = 'On the default project the capex verdict names Angola - Deepwater PSC at 88.6123 million USD while the price verdict declines to rank at all, so the two sweeps agree in tendency and never row for row.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 24: option_0, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The contractor verdict on ODIDI prints -5.9 million USD and an IRR of 11.4 percent. What did it rank?' and options = '["The first row of the summary at full precision, -5.8662 million USD and 11.4055 percent, because the sort has already put the highest contractor NPV there.", "The largest contractor NPV it could find across the six ledgers, recomputed at the comparison''s discount rate before the sentence was built.", "The rounded figures themselves, which is why two regimes printing the same value are reported as a tie by this verdict.", "The undiscounted lifetime contractor net cash flow, which on ODIDI is 192.9896 million USD for that regime."]'::jsonb and answer_index = 0 and explanation = 'Every insight sentence rounds money and rates to one decimal place while the ranking underneath runs at full precision.' then 'old'
           when prompt = 'The contractor verdict on ODIDI prints -5.9 million USD and says there is no single IRR, because the NPV is zero at -18.8% and 11.4%. What did it rank?' and options = '["The first row of the summary at full precision, -5.8662 million USD, because the sort has already put the highest contractor NPV there.", "The largest contractor NPV it could find across the six ledgers, recomputed at the comparison''s discount rate before the sentence was built.", "The rounded figures themselves, which is why two regimes printing the same value are reported as a tie by this verdict.", "The undiscounted lifetime contractor net cash flow, which on ODIDI is 192.9896 million USD for that regime."]'::jsonb and answer_index = 0 and explanation = 'Every insight sentence rounds money and rates to one decimal place while the ranking underneath runs at full precision.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 24'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The contractor verdict on ODIDI prints -5.9 million USD and says there is no single IRR, because the NPV is zero at -18.8% and 11.4%. What did it rank?', options = '["The first row of the summary at full precision, -5.8662 million USD, because the sort has already put the highest contractor NPV there.", "The largest contractor NPV it could find across the six ledgers, recomputed at the comparison''s discount rate before the sentence was built.", "The rounded figures themselves, which is why two regimes printing the same value are reported as a tie by this verdict.", "The undiscounted lifetime contractor net cash flow, which on ODIDI is 192.9896 million USD for that regime."]'::jsonb, answer_index = 0, explanation = 'Every insight sentence rounds money and rates to one decimal place while the ranking underneath runs at full precision.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 25: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = '`calculateIRR` returns 102400.0000 percent on flows of -1 then 2000, where the true rate is 199900 percent. What did the solver do?' and options = '["It bisected to the tolerance it was given, which on a curve this flat is reached long before the root.", "It returned a clamp written into the function to stop an unbounded search from reporting an infinite rate.", "It found a second root, since flows that change sign once can still admit two rates and the function returns the smaller.", "It stopped at the top of its own bracket, 100 percent doubled ten times, with the NPV there still positive at 0.0009."]'::jsonb and answer_index = 3 and explanation = 'The NPV at 199900 percent is 0.0000 and at 400000 percent is -0.0001, so the root is real and the reported value is a bound.' then 'old'
           when prompt = 'On flows of -1 then 2000 the retired bisection returned 102400 percent where the true rate is 199900 percent. What does the engine do with those flows now?' and options = '["It returns 199900.0000 percent, the band having been widened until the search reached the root.", "It returns 1000.0000 percent, the top of the band, as the screening engine returns its own clamp.", "It returns null with the status no-root, since a root outside the band is a root the engine did not find.", "It returns null with the status above-clamp, because the only root lies beyond the band from -99 to 1000 percent."]'::jsonb and answer_index = 3 and explanation = 'The NPV at 102400 percent is 0.0009 and at 199900 percent is 0.0000, so the retired value was the edge of a search and never a root.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 25'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On flows of -1 then 2000 the retired bisection returned 102400 percent where the true rate is 199900 percent. What does the engine do with those flows now?', options = '["It returns 199900.0000 percent, the band having been widened until the search reached the root.", "It returns 1000.0000 percent, the top of the band, as the screening engine returns its own clamp.", "It returns null with the status no-root, since a root outside the band is a root the engine did not find.", "It returns null with the status above-clamp, because the only root lies beyond the band from -99 to 1000 percent."]'::jsonb, answer_index = 3, explanation = 'The NPV at 102400 percent is 0.0009 and at 199900 percent is 0.0000, so the retired value was the edge of a search and never a root.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 26: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Two published cases return an IRR of 0.0000 percent, one with an NPV at 10 percent of 25.6198 million USD and one of -16.5289. What separates them?' and options = '["One was stopped by the bracket and the other by the tolerance, so one zero is a bound and the other a converged root.", "One has flows that never change sign on a profitable project and the other loses money at every rate, and the solver refuses to report a negative rate.", "One is a project that breaks even exactly and the other a project whose root the bisection could not locate inside 80 steps.", "Nothing separates them: both are ill posed, and the profitable one only looks different because its NPV is quoted at a rate the case did not use."]'::jsonb and answer_index = 1 and explanation = 'A reader who rejects 102400 percent as absurd and accepts 0.0000 percent as break even has caught the harmless case and swallowed the dangerous one.' then 'old'
           when prompt = 'Two published cases once returned an IRR of 0.0000 percent, one with an NPV at 10 percent of 25.6198 million USD and one of -16.5289. What does each return today?' and options = '["Null with the status no-root on both, neither having a rate inside the band from -99 to 1000 percent.", "Null with the status no-sign-change on the profitable one, and the negative root itself, -10.0000 percent, on the one that loses money at every rate.", "0.0000 percent on the profitable one and null on the other, the engine still declining to print a negative rate.", "-10.0000 percent on both, the shared contract reporting the nearest root inside the band whatever the flows do."]'::jsonb and answer_index = 1 and explanation = 'A reader who rejected 102400 percent as absurd and accepted 0.0000 percent as break even had caught the harmless case and swallowed the dangerous one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 26'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two published cases once returned an IRR of 0.0000 percent, one with an NPV at 10 percent of 25.6198 million USD and one of -16.5289. What does each return today?', options = '["Null with the status no-root on both, neither having a rate inside the band from -99 to 1000 percent.", "Null with the status no-sign-change on the profitable one, and the negative root itself, -10.0000 percent, on the one that loses money at every rate.", "0.0000 percent on the profitable one and null on the other, the engine still declining to print a negative rate.", "-10.0000 percent on both, the shared contract reporting the nearest root inside the band whatever the flows do."]'::jsonb, answer_index = 1, explanation = 'A reader who rejected 102400 percent as absurd and accepted 0.0000 percent as break even had caught the harmless case and swallowed the dangerous one.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 27: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'What does an `rrtUpliftPct` of 20 do to the resource rent tax base?' and options = '["It uplifts the capex by a fifth before it is recovered, so the pool clears later and the base appears later.", "It subtracts a fifth of total capex from the profit share in the first year only, as a capital allowance on the year the money was spent.", "It subtracts a fifth of total capex from the profit share in every one of the 25 years, so the relief over the life is five times the capex.", "It raises the resource rent tax rate by a fifth in the years the project is still recovering its capital."]'::jsonb and answer_index = 2 and explanation = 'Total capex on the default project is 500.0000 million USD, and the engine calls the annual treatment a screening approximation in its own comment.' then 'old'
           when prompt = 'What does an `rrtUpliftPct` of 20 do to the resource rent tax base?' and options = '["It subtracts a fifth of total capex from the profit share in every one of the 25 years, so the relief is five times the capex.", "It subtracts a fifth of total capex from the profit share in the first year only, as a capital allowance on the year the money was spent.", "It opens a pool at 1.2 times total capex, drawn against the profit share until it is exhausted and never refilled.", "It raises the resource rent tax rate by a fifth in the years the project is still recovering its capital."]'::jsonb and answer_index = 2 and explanation = 'Total capex on the default project is 500.0000 million USD, and the annual treatment this pool replaced was one the engine called a screening approximation in its own comment.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 27'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does an `rrtUpliftPct` of 20 do to the resource rent tax base?', options = '["It subtracts a fifth of total capex from the profit share in every one of the 25 years, so the relief is five times the capex.", "It subtracts a fifth of total capex from the profit share in the first year only, as a capital allowance on the year the money was spent.", "It opens a pool at 1.2 times total capex, drawn against the profit share until it is exhausted and never refilled.", "It raises the resource rent tax rate by a fifth in the years the project is still recovering its capital."]'::jsonb, answer_index = 2, explanation = 'Total capex on the default project is 500.0000 million USD, and the annual treatment this pool replaced was one the engine called a screening approximation in its own comment.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 28: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'In the isolated uplift sweep, where the corporate income tax is set to zero so the resource rent tax stands alone, an uplift of 50 returns total tax of 0.0000 and a first year with a positive charge of null. What has happened?' and options = '["The instrument has been switched off by a parameter whose name says nothing about switching anything off.", "The tax has been deferred past the 25 year horizon and falls in later years.", "The base has gone negative and the minimum tax has taken over, which is why the charge is reported as zero rather than as a credit.", "The sweep has left the range the engine supports, since an uplift above the tax rate of 40 percent is not a defined input."]'::jsonb and answer_index = 0 and explanation = 'Ten points of uplift, from 20 to 30, already take the total from 62.5794 to 1.0282 million USD.' then 'old'
           when prompt = 'In the isolated uplift sweep, where the corporate income tax is set to zero so the resource rent tax stands alone, an uplift of 50 returns total tax of 290.7165 million USD and a first charged year of 9. What has happened?' and options = '["A larger pool has pushed the charge later without removing it, the relief being a one-time pool rather than an annual allowance.", "The instrument has been switched off by a parameter whose name says nothing about switching anything off.", "The tax has been deferred past the 25 year horizon and falls in years the ledger does not reach.", "The base has gone negative and the minimum tax has taken over, which is why the charge arrives so late."]'::jsonb and answer_index = 0 and explanation = 'At a zero uplift the pool is the capex itself and the first charged year is 6; at 20 percent it is 1.2 times the capex and the first charged year is 7.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 28'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'In the isolated uplift sweep, where the corporate income tax is set to zero so the resource rent tax stands alone, an uplift of 50 returns total tax of 290.7165 million USD and a first charged year of 9. What has happened?', options = '["A larger pool has pushed the charge later without removing it, the relief being a one-time pool rather than an annual allowance.", "The instrument has been switched off by a parameter whose name says nothing about switching anything off.", "The tax has been deferred past the 25 year horizon and falls in years the ledger does not reach.", "The base has gone negative and the minimum tax has taken over, which is why the charge arrives so late."]'::jsonb, answer_index = 0, explanation = 'At a zero uplift the pool is the capex itself and the first charged year is 6; at 20 percent it is 1.2 times the capex and the first charged year is 7.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 29: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Why does the capex sweep return seven points rather than eight?' and options = '["The engine drops the last point to keep the axis readable.", "The loop counts steps from 0.8 in tenths and seven steps is what the range of 0.7 in the published cases allows.", "The last multiplier is reserved for the direct call the golden publishes beside the sweep, so it is computed but not returned.", "The accumulating multiplier reaches 1.5000000000000004 and fails its own test."]'::jsonb and answer_index = 3 and explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4, and the axis it is drawn against still promises 1.5.' then 'old'
           when prompt = 'Why did the capex sweep once return seven points rather than eight?' and options = '["The engine dropped the last point to keep the axis readable.", "The loop counted steps from 0.8 in tenths, and seven steps is what the 0.7 range of the published cases allows.", "The last multiplier was reserved for the direct call the golden publishes beside the sweep, so it was computed but not returned.", "The accumulating multiplier reached 1.5000000000000004 and failed its own test."]'::jsonb and answer_index = 3 and explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5, written from a step count, and the last of them equals the engine called directly at 1.5.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 29'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why did the capex sweep once return seven points rather than eight?', options = '["The engine dropped the last point to keep the axis readable.", "The loop counted steps from 0.8 in tenths, and seven steps is what the 0.7 range of the published cases allows.", "The last multiplier was reserved for the direct call the golden publishes beside the sweep, so it was computed but not returned.", "The accumulating multiplier reached 1.5000000000000004 and failed its own test."]'::jsonb, answer_index = 3, explanation = 'The engine returns the labels 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5, written from a step count, and the last of them equals the engine called directly at 1.5.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 30: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The verdict quotes Angola - Deepwater PSC as giving up 84.8591 million USD across the swept capex range. What is understated, and by how much?' and options = '["The base NPV, which is 223.7100 million USD at the base multiplier and is the figure the sentence should have quoted.", "The range, and with it the loss: over the eight points the axis advertises the same regime gives up 107.3918 million USD.", "The winner, since Angola gives up the least over seven points and USA - Gulf of Mexico gives up the least over eight.", "Nothing is understated, because the sweep reports the range it ran and the axis label has no bearing on the number."]'::jsonb and answer_index = 1 and explanation = 'Every resilience number on that chart is understated in the same way, USA - Gulf of Mexico at 228.7953 against 267.7301 million USD.' then 'old'
           when prompt = 'The verdict quotes Angola - Deepwater PSC as giving up 88.6123 million USD across the swept capex range. What is that measured over?' and options = '["Seven multipliers from 0.8 to 1.4, the eighth point being computed and then dropped.", "Eight multipliers from 0.8 to 1.5, a 20 percent underspend against a 50 percent overrun.", "Its base contractor NPV of 211.3787 million USD, against the value it keeps at the last swept multiplier.", "Nine multipliers from 0.7 to 1.5, the range the published capex cases run."]'::jsonb and answer_index = 1 and explanation = 'USA - Gulf of Mexico sits at the other end of the same table at 267.7301 million USD, and the last swept value equals the engine called directly at a multiplier of 1.5.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 30'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The verdict quotes Angola - Deepwater PSC as giving up 88.6123 million USD across the swept capex range. What is that measured over?', options = '["Seven multipliers from 0.8 to 1.4, the eighth point being computed and then dropped.", "Eight multipliers from 0.8 to 1.5, a 20 percent underspend against a 50 percent overrun.", "Its base contractor NPV of 211.3787 million USD, against the value it keeps at the last swept multiplier.", "Nine multipliers from 0.7 to 1.5, the range the published capex cases run."]'::jsonb, answer_index = 1, explanation = 'USA - Gulf of Mexico sits at the other end of the same table at 267.7301 million USD, and the last swept value equals the engine called directly at a multiplier of 1.5.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 31: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Every rate in a written answer on ODIDI is correct and the resilience answer is still wrong. What was skipped?' and options = '["The instruments, since a resilience figure depends on the resource rent tax uplift and the uplift is the field readers omit.", "The sort, since a resilience verdict is read off the summary''s first row.", "The ranges: the capex sweep stops at a multiplier of 1.4 while the chart promises 1.5.", "The discount rate, since ODIDI is discounted at 12 percent and the swept losses are reported at the comparison''s own 10."]'::jsonb and answer_index = 2 and explanation = 'Ranges and definitions are where the marks are lost, not rates, and ODIDI''s losses of 150.9021 and 215.1075 million USD price a 40 percent overrun.' then 'old'
           when prompt = 'Every rate in a written answer on ODIDI is correct and the resilience answer is still wrong. What was skipped?' and options = '["The ranges, since the capex sweep stops at a multiplier of 1.4 while the chart promises 1.5.", "The sort, since a resilience verdict is read off the summary''s first row.", "The field: a capex loss belongs to one project, and ODIDI orders the six templates differently from the default project.", "The discount rate, since ODIDI is discounted at 12 percent and the swept losses are reported at the comparison''s own 10."]'::jsonb and answer_index = 2 and explanation = 'Ranges and definitions are where the marks are lost, not rates, and ODIDI''s losses of 181.1922 and 252.6075 million USD belong to that field alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 31'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Every rate in a written answer on ODIDI is correct and the resilience answer is still wrong. What was skipped?', options = '["The ranges, since the capex sweep stops at a multiplier of 1.4 while the chart promises 1.5.", "The sort, since a resilience verdict is read off the summary''s first row.", "The field: a capex loss belongs to one project, and ODIDI orders the six templates differently from the default project.", "The discount rate, since ODIDI is discounted at 12 percent and the swept losses are reported at the comparison''s own 10."]'::jsonb, answer_index = 2, explanation = 'Ranges and definitions are where the marks are lost, not rates, and ODIDI''s losses of 181.1922 and 252.6075 million USD belong to that field alone.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 35: explanation
  select case
           when prompt = 'On the Designer''s defaults the Concessionary regime reads 46.3452 percent in the summary and 59.6210 percent on the price chart at the base price. Which one is the rate on profit, and why do they differ?' and options = '["The summary''s 46.3452, because it adds total capex back to the contractor side, while the chart''s 59.6210 divides the same two totals with nothing added back.", "The chart''s 59.6210, because the sweep re-runs the whole ledger at each of its nine prices and therefore works on profit, while the summary reports a single ratio taken on cash.", "The summary''s 46.3452, because it is discounted at 10 percent while the chart''s number is an undiscounted lifetime ratio.", "Neither, since both divide take by take plus contractor cash and the difference between them is the swept price."]'::jsonb and answer_index = 0 and explanation = 'The Nigerian PIA (PSC) regime shows the same pair, 55.5380 against 71.4471, a gap of 15.9091 percentage points on one screen.' then 'old'
           when prompt = 'On the Designer''s defaults the Concessionary regime reads 46.3452 percent in the summary and 59.6210 percent on the price chart at the base price. Which one is the rate on profit, and why do they differ?' and options = '["The summary''s 46.3452, because it adds total capex back to the contractor side, while the chart''s 59.6210 divides the same two totals with nothing added back.", "The chart''s 59.6210, because the sweep re-runs the whole ledger at each of its nine prices and therefore works on profit, while the summary reports a single ratio taken on cash.", "The summary''s 46.3452, because it is discounted at 10 percent while the chart''s number is an undiscounted lifetime ratio.", "Neither, since both divide take by take plus contractor cash and the difference between them is the swept price."]'::jsonb and answer_index = 0 and explanation = 'The Nigerian PIA (PSC) regime shows the same pair, 56.5354 against 72.7302, a gap of 16.1948 percentage points on one screen.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 35'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the Designer''s defaults the Concessionary regime reads 46.3452 percent in the summary and 59.6210 percent on the price chart at the base price. Which one is the rate on profit, and why do they differ?', options = '["The summary''s 46.3452, because it adds total capex back to the contractor side, while the chart''s 59.6210 divides the same two totals with nothing added back.", "The chart''s 59.6210, because the sweep re-runs the whole ledger at each of its nine prices and therefore works on profit, while the summary reports a single ratio taken on cash.", "The summary''s 46.3452, because it is discounted at 10 percent while the chart''s number is an undiscounted lifetime ratio.", "Neither, since both divide take by take plus contractor cash and the difference between them is the swept price."]'::jsonb, answer_index = 0, explanation = 'The Nigerian PIA (PSC) regime shows the same pair, 56.5354 against 72.7302, a gap of 16.1948 percentage points on one screen.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 36: explanation, option_0, option_2 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?' and options = '["The regime with the smallest government cash flow, since the tie break falls through to the next column in the summary.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb and answer_index = 2 and explanation = 'Four regimes pay back in year 3 and the sentence names Generic Royalty/Tax, which leads the sort at 397.0445 million USD, so the verdict is the NPV ranking wearing a different label.' then 'old'
           when prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?' and options = '["The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "All four regimes at year 3, in summary order, against year 4 for one of the two at the slowest year.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb and answer_index = 2 and explanation = 'Naming every regime tied at the fastest year is the 2026-09-15 repair. Until then the sentence named Generic Royalty/Tax alone, which leads the sort at 397.0445 million USD, so a tied payback verdict was the NPV ranking under another label.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 36'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The payback column of `cmp_all_templates_default_project` reads 3, 3, 3, 4, 3 and 4 down the summary. What does the payback verdict then report?', options = '["The regime with the highest NPV, because the tie is broken by summary order and the summary is sorted on contractor NPV.", "No verdict at all, because a four way tie at the top cannot be ranked and an unsupportable claim is omitted.", "All four regimes at year 3, in summary order, against year 4 for one of the two at the slowest year.", "The regime whose R factor payout year is earliest, which is the tie break the engine applies whenever an integer column ties in the summary."]'::jsonb, answer_index = 2, explanation = 'Naming every regime tied at the fastest year is the 2026-09-15 repair. Until then the sentence named Generic Royalty/Tax alone, which leads the sort at 397.0445 million USD, so a tied payback verdict was the NPV ranking under another label.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 38: explanation
  select case
           when prompt = 'A reader quotes the resilience verdict for Angola - Deepwater PSC on the default project. Which two separate checks does that number need?' and options = '["Whether the discount rate matches the project and whether the regime''s four instruments were taken from the template rather than the Designer.", "Whether the sweep re-ran every regime and whether the loss was measured from the peak of the curve rather than from its first point.", "Whether the capex lines were scaled together and whether the opex moved with them.", "Whether the ranked quantities are separated at all, and whether the swept range is the range the answer was about."]'::jsonb and answer_index = 3 and explanation = 'The pick comes from a strict less than in a reduce, and the quantity comes from seven points ending at a multiplier of 1.4 rather than the eight the axis promises.' then 'old'
           when prompt = 'A reader quotes the resilience verdict for Angola - Deepwater PSC on the default project. Which two separate checks does that number need?' and options = '["Whether the discount rate matches the project and whether the regime''s four instruments were taken from the template rather than the Designer.", "Whether the sweep re-ran every regime and whether the loss was measured from the peak of the curve rather than from its first point.", "Whether the capex lines were scaled together and whether the opex moved with them.", "Whether the ranked quantities are separated at all, and whether the swept range is the range the answer was about."]'::jsonb and answer_index = 3 and explanation = 'The pick refuses a lead under 0.1 million USD, and the quantity comes from eight points running 0.8 to 1.5, so both checks can be made off the chart.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 38'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reader quotes the resilience verdict for Angola - Deepwater PSC on the default project. Which two separate checks does that number need?', options = '["Whether the discount rate matches the project and whether the regime''s four instruments were taken from the template rather than the Designer.", "Whether the sweep re-ran every regime and whether the loss was measured from the peak of the curve rather than from its first point.", "Whether the capex lines were scaled together and whether the opex moved with them.", "Whether the ranked quantities are separated at all, and whether the swept range is the range the answer was about."]'::jsonb, answer_index = 3, explanation = 'The pick refuses a lead under 0.1 million USD, and the quantity comes from eight points running 0.8 to 1.5, so both checks can be made off the chart.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 39: explanation
  select case
           when prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?' and options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government take.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb and answer_index = 0 and explanation = 'The most progressive template gives up the least at 84.8591 million USD and the two regressive ones give up 208.0310 and 228.7953, and the orders still differ row for row.' then 'old'
           when prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?' and options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government take.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb and answer_index = 0 and explanation = 'The two steepest climbers give up the least at 100.7185 and 88.6123 million USD and the two regressive ones give up 244.0782 and 267.7301, and the orders still differ row for row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 39'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the default project the price climb and the capex loss rank the six templates in nearly the same order. What connects the two sweeps?', options = '["A regime that takes a rising share of the upside absorbs a share of the downside, so the contractor''s NPV under it moves less when capital cost rises.", "Both sweeps are computed from the same series, since the capex sweep is the price sweep re-expressed in money rather than in percentage points of government take.", "Both sweeps hold the other variable at the base case, so the two rankings are the same ranking measured twice.", "Both are endpoint differences over seven points, so a regime that leads one must lead the other by construction."]'::jsonb, answer_index = 0, explanation = 'The two steepest climbers give up the least at 100.7185 and 88.6123 million USD and the two regressive ones give up 244.0782 and 267.7301, and the orders still differ row for row.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 40: option_0, option_1, option_2, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On `cmp_never_recovers` every IRR reads 0.0000 and every payback is null. What may a reader do with those two columns?' and options = '["Sort on the IRR, since a rate of zero is a real comparison point and the six regimes are separated somewhere below the four printed decimals.", "Read the null as the last year of the horizon, since a project that never pays back has by definition a payback of year 25.", "Neither may be sorted on: the zero is the solver declining to report a negative rate and the null is a payback that never arrived.", "Use the payback column to break the tie in the IRR column, because the two are computed from the same cumulative series."]'::jsonb and answer_index = 2 and explanation = 'The sort that produced the table was on contractor NPV, and what it ranks is six ways of losing money, from -15354.6816 to -15900.1132 million USD.' then 'old'
           when prompt = 'On `cmp_never_recovers` every IRR is null with the status no-root and every payback is null. What may a reader do with those two columns?' and options = '["Sort on the IRR, since the status word orders the six regimes even where the rate itself is missing.", "Read the payback null as the last year of the horizon, since a project that never pays back has by definition a payback of year 25.", "Neither may be sorted on: the first says no rate in the band brings the NPV to zero and the second a payback that never arrived.", "Use the payback column to break the tie in the IRR column, because the two are computed from the same cumulative series."]'::jsonb and answer_index = 2 and explanation = 'The sort that produced the table was on contractor NPV, and what it ranks is six ways of losing money, from -15354.6816 to -15900.1132 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 40'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_never_recovers` every IRR is null with the status no-root and every payback is null. What may a reader do with those two columns?', options = '["Sort on the IRR, since the status word orders the six regimes even where the rate itself is missing.", "Read the payback null as the last year of the horizon, since a project that never pays back has by definition a payback of year 25.", "Neither may be sorted on: the first says no rate in the band brings the NPV to zero and the second a payback that never arrived.", "Use the payback column to break the tie in the IRR column, because the two are computed from the same cumulative series."]'::jsonb, answer_index = 2, explanation = 'The sort that produced the table was on contractor NPV, and what it ranks is six ways of losing money, from -15354.6816 to -15900.1132 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- (final exam) ord 42: explanation, option_0, option_1, option_2, option_3, prompt KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'The eighth capex point is not unreachable: the engine returns 58.5739 million USD for Nigeria - PIA (2021) at a multiplier of 1.5. Why is it not on the chart?' and options = '["The golden withholds it so the oracle''s eighth point cannot pass as the engine''s.", "The chart drops any point whose contractor NPV falls below the base case by more than half, which is what 58.5739 does against 154.8286.", "The point exists only for templates carrying a resource rent tax, since the direct call needs an uplift to compute a base at that capex.", "The sweep that draws the chart never asks for it, and no input to the comparison can make it."]'::jsonb and answer_index = 3 and explanation = 'Reaching it means calling the ledger function directly at that multiplier, and the sweep''s range, step and count are written into the loop.' then 'old'
           when prompt = 'The engine returns 58.5739 million USD for Nigeria - PIA (2021) at a capex multiplier of 1.5 both as a swept point and when called directly. What does that agreement pin?' and options = '["That the golden publishes the oracle''s eighth point in place of the engine''s, the two being equal at that multiplier.", "That the chart may drop a point whose contractor NPV falls below the base case by more than half, as 58.5739 does against 154.8286.", "That a direct call and a swept point use different discount conventions which happen to meet at a multiplier of 1.5.", "That the sweep reaches its endpoint rather than approaching it, which is the check a step count buys over an accumulating sum."]'::jsonb and answer_index = 3 and explanation = 'The golden also pins the grid itself as `capexGrid`, eight multipliers from 0.8 to 1.5, so neither the count nor the labels can drift back.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'EC2 recut refused: no row for (final exam) ord 42'; end if;
  if v_state = 'other' then raise exception 'EC2 recut refused: (final exam) ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The engine returns 58.5739 million USD for Nigeria - PIA (2021) at a capex multiplier of 1.5 both as a swept point and when called directly. What does that agreement pin?', options = '["That the golden publishes the oracle''s eighth point in place of the engine''s, the two being equal at that multiplier.", "That the chart may drop a point whose contractor NPV falls below the base case by more than half, as 58.5739 does against 154.8286.", "That a direct call and a swept point use different discount conventions which happen to meet at a multiplier of 1.5.", "That the sweep reaches its endpoint rather than approaching it, which is the check a step count buys over an accumulating sum."]'::jsonb, answer_index = 3, explanation = 'The golden also pins the grid itself as `capexGrid`, eight multipliers from 0.8 to 1.5, so neither the count nor the labels can drift back.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2 recut refused: (final exam) ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- --------------------------------------------- the tier assertions --
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC2 recut refused: the Expert tier holds % questions, expected 132', v_count; end if;

  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'advanced' and not active;
  if v_count <> 0 then raise exception 'EC2 recut refused: % Expert question(s) are inactive', v_count; end if;

  select count(*) into v_count from (
    select scope, module_key, count(*) as n from public.academy_quiz_questions
     where app_slug = 'fiscal' and tier = 'advanced' group by 1, 2
  ) b where (b.scope = 'module' and b.n <> 15) or (b.scope = 'final' and b.n <> 42);
  if v_count <> 0 then raise exception 'EC2 recut refused: % Expert bank(s) are not 15 (module) or 42 (final)', v_count; end if;

  -- Every option array is still four options and every key still points
  -- inside it: a rewritten options array that lost an entry would grade
  -- an answer that is no longer there.
  select count(*) into v_count from public.academy_quiz_questions
   where app_slug = 'fiscal' and tier = 'advanced'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index >= jsonb_array_length(options));
  if v_count <> 0 then raise exception 'EC2 recut refused: % Expert question(s) have a bad option array or key index', v_count; end if;

  raise notice 'EC2 recut advanced: % of 70 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-six-regimes-at-once', 3),
    ('module', 'm01-six-regimes-at-once', 4),
    ('module', 'm01-six-regimes-at-once', 8),
    ('module', 'm02-the-price-sweep', 3),
    ('module', 'm02-the-price-sweep', 4),
    ('module', 'm02-the-price-sweep', 9),
    ('module', 'm02-the-price-sweep', 10),
    ('module', 'm02-the-price-sweep', 11),
    ('module', 'm02-the-price-sweep', 14),
    ('module', 'm03-the-capex-sweep', 1),
    ('module', 'm03-the-capex-sweep', 2),
    ('module', 'm03-the-capex-sweep', 3),
    ('module', 'm03-the-capex-sweep', 4),
    ('module', 'm03-the-capex-sweep', 5),
    ('module', 'm03-the-capex-sweep', 6),
    ('module', 'm03-the-capex-sweep', 7),
    ('module', 'm03-the-capex-sweep', 8),
    ('module', 'm03-the-capex-sweep', 9),
    ('module', 'm03-the-capex-sweep', 10),
    ('module', 'm03-the-capex-sweep', 11),
    ('module', 'm03-the-capex-sweep', 12),
    ('module', 'm03-the-capex-sweep', 14),
    ('module', 'm03-the-capex-sweep', 15),
    ('module', 'm04-the-insights', 1),
    ('module', 'm04-the-insights', 2),
    ('module', 'm04-the-insights', 3),
    ('module', 'm04-the-insights', 4),
    ('module', 'm04-the-insights', 6),
    ('module', 'm04-the-insights', 10),
    ('module', 'm04-the-insights', 11),
    ('module', 'm04-the-insights', 15),
    ('module', 'm05-numbers-to-distrust', 3),
    ('module', 'm05-numbers-to-distrust', 5),
    ('module', 'm05-numbers-to-distrust', 6),
    ('module', 'm05-numbers-to-distrust', 7),
    ('module', 'm05-numbers-to-distrust', 8),
    ('module', 'm05-numbers-to-distrust', 9),
    ('module', 'm05-numbers-to-distrust', 10),
    ('module', 'm05-numbers-to-distrust', 11),
    ('module', 'm05-numbers-to-distrust', 12),
    ('module', 'm05-numbers-to-distrust', 13),
    ('module', 'm05-numbers-to-distrust', 14),
    ('module', 'm05-numbers-to-distrust', 15),
    ('module', 'm06-the-expert-reading', 8),
    ('module', 'm06-the-expert-reading', 9),
    ('module', 'm06-the-expert-reading', 15),
    ('final', null::text, 2),
    ('final', null::text, 5),
    ('final', null::text, 6),
    ('final', null::text, 9),
    ('final', null::text, 10),
    ('final', null::text, 14),
    ('final', null::text, 15),
    ('final', null::text, 16),
    ('final', null::text, 18),
    ('final', null::text, 23),
    ('final', null::text, 24),
    ('final', null::text, 25),
    ('final', null::text, 26),
    ('final', null::text, 27),
    ('final', null::text, 28),
    ('final', null::text, 29),
    ('final', null::text, 30),
    ('final', null::text, 31),
    ('final', null::text, 35),
    ('final', null::text, 36),
    ('final', null::text, 38),
    ('final', null::text, 39),
    ('final', null::text, 40),
    ('final', null::text, 42)
)
select 'ec2 recut advanced' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       q.answer_index,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'fiscal' and q.tier = 'advanced'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec2 recut advanced' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'fiscal' and tier = 'advanced'
 group by scope, module_key
 order by scope desc, module_key nulls last;
