-- ============================================================================
-- EC2-1 SHARE STATES: Fiscal Regime Design advanced bank rows reworded.
--
-- The engine's price sweep no longer returns exactly 0 when lifetime profit is
-- not positive. Every point now carries a state (share, exceeds with the true
-- value kept, undefined with a null value), and the price verdict ranks only
-- across the common run of share prices, with at least three prices and a one
-- percentage point lead (FINDINGS EC2-1, owner decision 2026-09-14). The
-- advanced bank taught the old zero and the old verdict, so the rows below are
-- rewritten IN PLACE by their stable identity (app_slug, tier, scope,
-- module_key, ord). Question ids, counts and ords do not change.
--
-- GUARDS. Each row must match EITHER its published text exactly (then it is
-- updated) OR the new text exactly (then it was already applied and is left
-- alone). Anything else raises, so a row edited by hand since the seed is
-- never overwritten. The tier must still hold 132 questions afterwards.
--
-- HELD. Apply only with the EC2-1 NextGen upload that carries the reworded
-- lessons and the vendored engine, and before or with the EC2 go-live.
-- ============================================================================

do $$
declare
  v_state text;
  v_count integer;
begin

  -- ec2a_m02 ord 5 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'What does the price sweep return for a regime when total government take plus total contractor net cash flow is not greater than zero?' and options = '["A null, drawn as a break in the series.", "Exactly 0, with no flag, no null and no gap in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, which is why a plotted share can run into the thousands."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six templates plot a flat 0.0000 at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.' then 'old'
           when prompt = 'What does the price sweep return for a regime when total government take plus total contractor net cash flow is not greater than zero?' and options = '["Exactly 0, drawn on the axis beside the shares of the other regimes.", "A null, with the point''s state set to undefined and a break in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, flagged exceeds, which is why a plotted share can run into the thousands."]'::jsonb and answer_index = 1 and explanation = 'On the comparison built with capex of 20000 all six templates return null with the state undefined at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 5;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m02 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the price sweep return for a regime when total government take plus total contractor net cash flow is not greater than zero?', options = '["Exactly 0, drawn on the axis beside the shares of the other regimes.", "A null, with the point''s state set to undefined and a break in the line.", "100 percent, on the reasoning that the state took all of a contractor return that was not positive.", "The absolute value of the ratio, flagged exceeds, which is why a plotted share can run into the thousands."]'::jsonb, answer_index = 1, explanation = 'On the comparison built with capex of 20000 all six templates return null with the state undefined at all nine prices while the government collected between 700.1194 and 1662.7835 million USD.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 6 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'Six series sit flat along zero across the whole sweep on one published comparison. What is the most dangerous way to read them?' and options = '["As a rounding artefact of the one decimal place the sentences print, which a wider number format would resolve.", "As six regimes that collected nothing, which is what a share of 0.0000 percent would mean if the denominator were positive.", "As the most contractor friendly regimes on the chart, when they are the ones whose share could not be computed at all.", "As a comparison run with no regimes loaded, since an empty summary returns an empty list of verdicts."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison and plots 0.0000 at every one of the nine prices.' then 'old'
           when prompt = 'Six series draw no line at any of the nine prices on one published comparison, every point flagged undefined. What do the missing lines report?' and options = '["That the six regimes collected nothing, which is what an empty series would mean on a chart of government take.", "That every point sits above 100 percent and was pinned off the top of the axis.", "That the project''s lifetime profit is not positive at any swept price, so no government share exists to plot.", "That the sweep failed to run, since a comparison whose engine call rejects returns no series at all."]'::jsonb and answer_index = 2 and explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison, and every one of its nine points is null with the state undefined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 6;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m02 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 6 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Six series draw no line at any of the nine prices on one published comparison, every point flagged undefined. What do the missing lines report?', options = '["That the six regimes collected nothing, which is what an empty series would mean on a chart of government take.", "That every point sits above 100 percent and was pinned off the top of the axis.", "That the project''s lifetime profit is not positive at any swept price, so no government share exists to plot.", "That the sweep failed to run, since a comparison whose engine call rejects returns no series at all."]'::jsonb, answer_index = 2, explanation = 'Angola - Deepwater PSC collected 1662.7835 million USD for the government on that comparison, and every one of its nine points is null with the state undefined.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 6 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 7 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The Angola template on the default project at three times capex reads 0.0000 at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many meanings sit on those four points?' and options = '["Three: the guard firing, the ratio exploding through a near zero denominator, and an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government take at each swept price as the ledger changes sign."]'::jsonb and answer_index = 0 and explanation = 'A share of 0.0000 there means the calculation could not be done, and nothing on the chart separates it from the shares beside it.' then 'old'
           when prompt = 'The Angola template on the default project at three times capex returns null at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many states sit on those four points?' and options = '["Three: undefined, then exceeds at 2223.0766 and 144.0692, then an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government take at each swept price as the ledger changes sign."]'::jsonb and answer_index = 0 and explanation = 'The null carries the state undefined because lifetime profit is not positive at 40, and the two points above 100 percent carry exceeds and keep their true values.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 7;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m02 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 7 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Angola template on the default project at three times capex returns null at 40 USD per bbl, then 2223.0766, then 144.0692, then 85.6015. How many states sit on those four points?', options = '["Three: undefined, then exceeds at 2223.0766 and 144.0692, then an ordinary share.", "One, since all four are the same ratio on a curve that is steep.", "Two, a computed share and a missing value, with 2223.0766 and 144.0692 both ordinary shares of a project the state dominates.", "Four, because the engine switches its definition of government take at each swept price as the ledger changes sign."]'::jsonb, answer_index = 0, explanation = 'The null carries the state undefined because lifetime profit is not positive at 40, and the two points above 100 percent carry exceeds and keep their true values.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 7 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 8
  select case
           when prompt = 'What must a reader check before quoting any single point off the government share curve?' and options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb and answer_index = 3 and explanation = 'If lifetime contractor net cash flow is negative the share is not a share, and if it is negative enough to outweigh the take the curve reads zero and means nothing at all.' then 'old'
           when prompt = 'What must a reader check before quoting any single point off the government share curve?' and options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb and answer_index = 3 and explanation = 'If lifetime contractor net cash flow is negative the point is above 100 percent and flagged exceeds, and if it is negative enough to outweigh the take the point is null and flagged undefined.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 8;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m02 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 8 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What must a reader check before quoting any single point off the government share curve?', options = '["That the point sits at a price the deck itself contains, since only the 70 USD per bbl point is a real deck price.", "That the regime pays back, because the sweep drops any point whose payback year comes back null.", "The discount rate, since the share is computed on discounted totals and moves whenever that rate moves.", "The two lifetime totals underneath it."]'::jsonb, answer_index = 3, explanation = 'If lifetime contractor net cash flow is negative the point is above 100 percent and flagged exceeds, and if it is negative enough to outweigh the take the point is null and flagged undefined.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 8 updated % rows', v_count; end if;
  end if;

  -- ec2a_m02 ord 13
  select case
           when prompt = 'A gas weighted project shows a government share that barely moves across the nine points. What is the correct conclusion?' and options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The guard failed at every point and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb and answer_index = 2 and explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.' then 'old'
           when prompt = 'A gas weighted project shows a government share that barely moves across the nine points. What is the correct conclusion?' and options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The engine flagged every point undefined and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb and answer_index = 2 and explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 13;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m02 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A gas weighted project shows a government share that barely moves across the nine points. What is the correct conclusion?', options = '["The terms are flat rated, so the regime is neither progressive nor regressive.", "The project sits at its cost recovery limit at every price, which pins the share until the recoverable pool clears.", "The sweep did not move most of that project''s revenue, not that its terms are neutral to price.", "The engine flagged every point undefined and returned a constant, as it does whenever contractor net cash flow is negative."]'::jsonb, answer_index = 2, explanation = 'The multiplier scales oil only, so comparing the steepness of two projects'' curves compares their stream mix as much as their terms. The test project is 30000 bbl/d of oil with no gas and no NGL, so there the multiplier is the whole revenue multiplier.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-price-sweep' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m02 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2a_m03 ord 13
  select case
           when prompt = 'Which case does a project team fear that neither sweep contains?' and options = '["An opex overrun, which the capex multiplier does not touch, though the two curves can be combined into it by eye.", "A delay to first production, which both sweeps do cover through the payback year they compute at every point.", "An overrun arriving at a low price.", "A discount rate above the base case, which the price sweep covers implicitly by re-running the whole comparison."]'::jsonb and answer_index = 2 and explanation = 'The price sweep holds capex at the base case at every price and the capex sweep holds price at the deck at every multiplier. The Angola template at three times capex reads 0.0000 at 40 USD per bbl and 2223.0766 at 50, and neither sweep as drawn would have suggested it.' then 'old'
           when prompt = 'Which case does a project team fear that neither sweep contains?' and options = '["An opex overrun, which the capex multiplier does not touch, though the two curves can be combined into it by eye.", "A delay to first production, which both sweeps do cover through the payback year they compute at every point.", "An overrun arriving at a low price.", "A discount rate above the base case, which the price sweep covers implicitly by re-running the whole comparison."]'::jsonb and answer_index = 2 and explanation = 'The price sweep holds capex at the base case at every price and the capex sweep holds price at the deck at every multiplier. The Angola template at three times capex returns null at 40 USD per bbl and 2223.0766 at 50, and neither sweep as drawn would have suggested it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 13;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m03 ord 13'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m03 ord 13 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which case does a project team fear that neither sweep contains?', options = '["An opex overrun, which the capex multiplier does not touch, though the two curves can be combined into it by eye.", "A delay to first production, which both sweeps do cover through the payback year they compute at every point.", "An overrun arriving at a low price.", "A discount rate above the base case, which the price sweep covers implicitly by re-running the whole comparison."]'::jsonb, answer_index = 2, explanation = 'The price sweep holds capex at the base case at every price and the capex sweep holds price at the deck at every multiplier. The Angola template at three times capex returns null at 40 USD per bbl and 2223.0766 at 50, and neither sweep as drawn would have suggested it.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-the-capex-sweep' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m03 ord 13 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 5 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The price verdict on `cmp_never_recovers` names Nigeria - PIA (2021) the most progressive, its government share rising 0.0 percentage points across the swept range. What produced that climb?' and options = '["The share guard fired at every price, so all nine points of all six series read exactly 0.0000 and every climb is zero.", "Terms that are genuinely neutral to price at that capex, since the royalty is flat and no profit oil ever arises to be split.", "A real difference of a few hundredths of a percentage point, lost when the sentence rounded the climb to one decimal place.", "The oil multiplier cannot move a project carrying that much capex, so the sweep returned the base case nine times over."]'::jsonb and answer_index = 0 and explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government take of 1431.0440, the denominator is not positive, and the division returns 0.' then 'old'
           when prompt = 'An earlier build called Nigeria - PIA (2021) the most progressive on `cmp_never_recovers`, rising 0.0 percentage points. What does the price verdict return there now, and why?' and options = '["It declines to rank, because every point is undefined and so no swept price gives a government share for every regime.", "It still names Nigeria - PIA (2021), since two null endpoints subtract to a climb of zero that ranks like any other.", "It names Angola - Deepwater PSC, the regime that collected the most, because the take column breaks a tie in the climbs.", "It is omitted entirely, as it is for a single regime, because a ranking needs at least two usable series."]'::jsonb and answer_index = 0 and explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government take of 1431.0440, profit is not positive at any swept price, and the sentence says no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 5;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m04 ord 5'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m04 ord 5 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'An earlier build called Nigeria - PIA (2021) the most progressive on `cmp_never_recovers`, rising 0.0 percentage points. What does the price verdict return there now, and why?', options = '["It declines to rank, because every point is undefined and so no swept price gives a government share for every regime.", "It still names Nigeria - PIA (2021), since two null endpoints subtract to a climb of zero that ranks like any other.", "It names Angola - Deepwater PSC, the regime that collected the most, because the take column breaks a tie in the climbs.", "It is omitted entirely, as it is for a single regime, because a ranking needs at least two usable series."]'::jsonb, answer_index = 0, explanation = 'Lifetime contractor net cash flow of -16279.9099 million USD outweighs a government take of 1431.0440, profit is not positive at any swept price, and the sentence says no regime is economic at any swept price from 40 to 120 USD per bbl.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m04 ord 5 updated % rows', v_count; end if;
  end if;

  -- ec2a_m04 ord 11
  select case
           when prompt = 'On ODIDI the price verdict calls Ghana - Deepwater the most progressive, rising 2.0 percentage points. What does winning on that number say about the field?' and options = '["Ghana - Deepwater is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Nobody captures upside on ODIDI: the actual climb is 1.9971 and only one other regime climbs at all, Nigeria - PIA (2021) by 0.1968.", "Two percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb and answer_index = 2 and explanation = 'The other four climbs on ODIDI are negative, as far down as -37.6994 for USA - Gulf of Mexico, so the winner is the least regressive of six.' then 'old'
           when prompt = 'On ODIDI the price verdict calls Ghana - Deepwater the most progressive, rising 2.0 percentage points. What does winning on that number say about the field?' and options = '["Ghana - Deepwater is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Nobody captures upside on ODIDI: the actual climb is 1.9971 and only one other regime climbs at all, Nigeria - PIA (2021) by 0.1968.", "Two percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb and answer_index = 2 and explanation = 'The other four climbs on ODIDI are negative, as far down as -37.6994 for USA - Gulf of Mexico, so the winner leads a field on which only two regimes climb at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 11;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m04 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m04 ord 11 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ODIDI the price verdict calls Ghana - Deepwater the most progressive, rising 2.0 percentage points. What does winning on that number say about the field?', options = '["Ghana - Deepwater is a progressive regime, a property of its four instruments that the sweep has now measured on a second field.", "The climb is small because the sweep scales oil only, and ODIDI carries gas at 40 Mscf/d and NGL at 900 bbl/d that never move.", "Nobody captures upside on ODIDI: the actual climb is 1.9971 and only one other regime climbs at all, Nigeria - PIA (2021) by 0.1968.", "Two percentage points is the smallest climb the verdict will report, below which the sentence is omitted for want of separation."]'::jsonb, answer_index = 2, explanation = 'The other four climbs on ODIDI are negative, as far down as -37.6994 for USA - Gulf of Mexico, so the winner leads a field on which only two regimes climb at all.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-insights' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m04 ord 11 updated % rows', v_count; end if;
  end if;

  -- ec2a_m05 ord 3 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'On `cmp_never_recovers` the price sweep plots 0.0000 percent for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the zero mean?' and options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "The guard fired: lifetime contractor net cash flow is negative enough that the denominator is not positive, so the division was declined and 0 returned.", "The share was too large to render, so the series was clamped to zero rather than drawn off the top of the axis.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb and answer_index = 1 and explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659, and a zero that means not computable is drawn in the same colour as a zero that would mean nothing collected.' then 'old'
           when prompt = 'On `cmp_never_recovers` the price sweep returns null with the state undefined for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the null mean?' and options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "Lifetime profit is not positive: contractor net cash flow outweighs the take, so no share exists and the engine declines to return one.", "The share was too large to render, so the point was flagged and dropped rather than drawn off the top of the axis.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb and answer_index = 1 and explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659. An earlier build returned 0 there, drawn in the same colour as a zero that would mean nothing collected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m05 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m05 ord 3 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On `cmp_never_recovers` the price sweep returns null with the state undefined for every template at all nine prices, while Angola - Deepwater PSC collected 1662.7835 million USD for the government. What does the null mean?', options = '["The government took nothing, because a project that never pays back generates no profit oil and therefore no take at all.", "Lifetime profit is not positive: contractor net cash flow outweighs the take, so no share exists and the engine declines to return one.", "The share was too large to render, so the point was flagged and dropped rather than drawn off the top of the axis.", "The sweep could not scale the oil price on a project of that capex, so it returned the untouched deck at every point."]'::jsonb, answer_index = 1, explanation = 'Take of 1662.7835 against contractor net cash flow of -16511.6494 million USD sums to -14848.8659. An earlier build returned 0 there, drawn in the same colour as a zero that would mean nothing collected.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m05 ord 3 updated % rows', v_count; end if;
  end if;

  -- ec2a_m05 ord 4 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'The Angola template on the default project at three times capex plots 0.0000, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many meanings are on that line?' and options = '["One, a government share that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: the guard firing, a ratio exploding through a near zero denominator, and an ordinary share, in that order."]'::jsonb and answer_index = 3 and explanation = 'A government share of several hundred percent is arithmetic and not a fiscal term, and nothing on the chart flags any of the four points.' then 'old'
           when prompt = 'The Angola template on the default project at three times capex returns null, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many states are on that line?' and options = '["One, a government share that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: undefined at the first point, then exceeds twice with the true values kept, then an ordinary share."]'::jsonb and answer_index = 3 and explanation = 'A government share of several hundred percent is arithmetic and not a fiscal term, which is why those two points are flagged exceeds and never set the chart''s scale.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_m05 ord 4'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_m05 ord 4 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The Angola template on the default project at three times capex returns null, then 2223.0766, then 144.0692, then 85.6015 across the first four swept prices. How many states are on that line?', options = '["One, a government share that is simply very sensitive to price on a project carrying that much capital.", "Two, an unrenderable value at the first point and a share at the other three, since 2223.0766 is a share of a small denominator.", "Two, a share below the axis at the first point and a share above 100 percent at the other three, which is what an overrun does to any curve.", "Three: undefined at the first point, then exceeds twice with the true values kept, then an ordinary share."]'::jsonb, answer_index = 3, explanation = 'A government share of several hundred percent is arithmetic and not a fiscal term, which is why those two points are flagged exceeds and never set the chart''s scale.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-numbers-to-distrust' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_m05 ord 4 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 10
  select case
           when prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?' and options = '["The climb is measured on the summary''s effective tax rate rather than the sweep''s, and the two definitions move in opposite directions.", "The share below 60 USD per bbl was produced by the guard rather than by a division, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'old'
           when prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?' and options = '["The climb is measured on the summary''s effective tax rate rather than the sweep''s, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb and answer_index = 2 and explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_exam ord 10 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Brazil - Concession returns a price climb of 6.0391 percentage points while its share falls from 50.0329 at 40 USD per bbl to 46.6052 at 60. How can both be true?', options = '["The climb is measured on the summary''s effective tax rate rather than the sweep''s, and the two definitions move in opposite directions.", "The shares below 60 USD per bbl were flagged exceeds rather than share, so those points are not on the curve at all.", "The climb is the last swept share minus the first, so it sees two points and hides the minimum between them.", "The climb averages the eight intervals between the nine points, which a single early fall cannot outweigh."]'::jsonb, answer_index = 2, explanation = 'Ghana - Deepwater reverses twice inside a positive climb, from 76.7284 down to 76.4647 and from 77.2412 down to 77.0702.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_exam ord 10 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 17
  select case
           when prompt = 'Which case does neither sweep cover?' and options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb and answer_index = 0 and explanation = 'The Angola template on the default project at three times capex reads a government share of 0.0000 at 40 USD per bbl and 2223.0766 at 50, and neither chart as drawn would have suggested it.' then 'old'
           when prompt = 'Which case does neither sweep cover?' and options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb and answer_index = 0 and explanation = 'The Angola template on the default project at three times capex returns no government share at 40 USD per bbl, where the point is null, and 2223.0766 at 50, and neither chart as drawn would have suggested it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_exam ord 17'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_exam ord 17 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which case does neither sweep cover?', options = '["An overrun arriving at a low price, because the price sweep holds capex at the base case and the capex sweep holds price at the deck.", "A price above 120 USD per bbl, which the price sweep stops at and the capex sweep cannot reach by raising capital cost.", "A regime with no resource rent tax, since both sweeps assume a tax stack whose base moves with the capex they vary.", "A project whose capex is spent later than year 1, which is the only assumption the two sweeps make differently from each other."]'::jsonb, answer_index = 0, explanation = 'The Angola template on the default project at three times capex returns no government share at 40 USD per bbl, where the point is null, and 2223.0766 at 50, and neither chart as drawn would have suggested it.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_exam ord 17 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 22
  select case
           when prompt = 'What does `deriveInsights` do with a claim it cannot support?' and options = '["It returns the verdict with the regime name left empty, so a panel can render the heading and leave the sentence blank.", "It omits the verdict, which is why a single regime returns three and an empty comparison returns none.", "It returns the verdict with the quantity set to zero, which is the same convention the share curve uses when its guard fires.", "It returns a verdict stating that the claim could not be supported, so that a reader is told which ranking was attempted."]'::jsonb and answer_index = 1 and explanation = 'Both sweeps still run on a single regime comparison and still produce a series, and the function declines to name a winner among one.' then 'old'
           when prompt = 'What does `deriveInsights` do with a claim it cannot support?' and options = '["It returns the verdict with the regime name left empty, so a panel can render the heading and leave the sentence blank.", "It omits the verdict, which is why a single regime returns three and an empty comparison returns none.", "It returns the verdict with the quantity set to zero, which is how the share curve reports a price at which profit is not positive.", "It returns a verdict stating that the claim could not be supported, so that a reader is told which ranking was attempted."]'::jsonb and answer_index = 1 and explanation = 'Both sweeps still run on a single regime comparison and still produce a series, and the function declines to name a winner among one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_exam ord 22'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_exam ord 22 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does `deriveInsights` do with a claim it cannot support?', options = '["It returns the verdict with the regime name left empty, so a panel can render the heading and leave the sentence blank.", "It omits the verdict, which is why a single regime returns three and an empty comparison returns none.", "It returns the verdict with the quantity set to zero, which is how the share curve reports a price at which profit is not positive.", "It returns a verdict stating that the claim could not be supported, so that a reader is told which ranking was attempted."]'::jsonb, answer_index = 1, explanation = 'Both sweeps still run on a single regime comparison and still produce a series, and the function declines to name a winner among one.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_exam ord 22 updated % rows', v_count; end if;
  end if;

  -- ec2a_exam ord 37 (KEYED ANSWER TEXT CHANGED)
  select case
           when prompt = 'A progressivity verdict is returned on a comparison where every point of every share series is 0.0000. How is that possible?' and options = '["The verdict falls back on the summary''s effective tax rate whenever the sweep returns no usable series, and that column carries no guard that can zero it.", "The verdict ranks the difference between two series points, and a series of zeros gives a difference of zero, which ranks like any other number.", "The verdict is computed before the guard is applied, so it ranks the shares the division would have produced without it.", "The verdict treats a zeroed series as missing and names the regime with the largest government take instead."]'::jsonb and answer_index = 1 and explanation = 'On `cmp_never_recovers` the guard fires at all nine prices for all six templates, and the sentence still calls Nigeria - PIA (2021) the most progressive on a climb of 0.0 percentage points.' then 'old'
           when prompt = 'On a comparison where every point of every share series is null and flagged undefined, what does the price verdict return?' and options = '["The regime with the largest government take, since the verdict falls back on the take column whenever no series can be ranked.", "A sentence saying no regime can be ranked across the sweep and that no regime is economic at any swept price.", "A most progressive regime on a climb of 0.0 percentage points, because two nulls subtract to zero like any other pair.", "Nothing at all, since the verdict is omitted in the same way it is for a comparison of one regime."]'::jsonb and answer_index = 1 and explanation = 'On `cmp_never_recovers` all six templates are undefined at all nine prices, so fewer than three swept prices give a share for every regime, and the sentence ends: no regime is economic at any swept price from 40 to 120 USD per bbl.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'EC2-1 bank update refused: no row for ec2a_exam ord 37'; end if;
  if v_state = 'other' then raise exception 'EC2-1 bank update refused: ec2a_exam ord 37 matches neither its published nor its new text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On a comparison where every point of every share series is null and flagged undefined, what does the price verdict return?', options = '["The regime with the largest government take, since the verdict falls back on the take column whenever no series can be ranked.", "A sentence saying no regime can be ranked across the sweep and that no regime is economic at any swept price.", "A most progressive regime on a climb of 0.0 percentage points, because two nulls subtract to zero like any other pair.", "Nothing at all, since the verdict is omitted in the same way it is for a comparison of one regime."]'::jsonb, answer_index = 1, explanation = 'On `cmp_never_recovers` all six templates are undefined at all nine prices, so fewer than three swept prices give a share for every regime, and the sentence ends: no regime is economic at any swept price from 40 to 120 USD per bbl.'
     where app_slug = 'fiscal' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 bank update refused: ec2a_exam ord 37 updated % rows', v_count; end if;
  end if;

  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'fiscal' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC2-1 bank update refused: advanced tier holds % questions, expected 132', v_count; end if;
end $$;

-- ----------------------------------------------------------------------------
-- The Expert capstone prompt, one sentence. Field 6 is the concession's price
-- sweep last point minus first point. On URUAN its 40 USD/bbl point is
-- 107.8535 percent and flagged exceeds, so the old wording "the concession's
-- share falls" called a non-share point a share. The graded value
-- (-65.47814380281869) and every field are untouched; only the prompt text is.
-- ----------------------------------------------------------------------------
do $$
declare
  v_prompt text;
  v_count integer;
begin
  select prompt into v_prompt from public.academy_capstones where app_slug = 'fiscal' and tier = 'advanced';
  if v_prompt is null then raise exception 'EC2-1 capstone prompt update refused: no fiscal advanced capstone'; end if;
  if position('the concession''s line falls as the price rises, and field 6 is the endpoint difference asked for whatever state each endpoint carries.' in v_prompt) > 0 then
    raise notice 'EC2-1 capstone prompt already reworded';
  elsif position('the concession''s share falls as the price rises.' in v_prompt) = 0 then
    raise exception 'EC2-1 capstone prompt update refused: the field 6 sentence is not in the published prompt';
  else
    update public.academy_capstones
       set prompt = replace(prompt, 'the concession''s share falls as the price rises.', 'the concession''s line falls as the price rises, and field 6 is the endpoint difference asked for whatever state each endpoint carries.')
     where app_slug = 'fiscal' and tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC2-1 capstone prompt update refused: % rows', v_count; end if;
  end if;
end $$;
