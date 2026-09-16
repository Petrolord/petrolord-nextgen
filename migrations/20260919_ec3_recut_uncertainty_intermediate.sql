-- ============================================================================
-- EC3 RECUT, PROFESSIONAL TIER (intermediate): Probabilistic Economics
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
-- WHAT MOVES. 23 of the 132 Professional questions, 12 of them with a changed keyed answer TEXT.
-- 0 answer index moves: where a keyed answer had to
-- change, the new correct text was written at the SAME index, so the key
-- balance and key pattern of every bank are untouched. No ord, no module key,
-- no scope and no row count moves.
-- Fields rewritten: 16 prompts, 38 options, 12 explanations.
--
-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,
-- module_key, ord) and must match EITHER its published text exactly, in which
-- case it is updated, OR the recut text exactly, in which case it is already
-- applied and left alone. Anything else raises and the transaction rolls back.
-- Every update asserts it touched exactly 1 row, and the tier must still hold
-- 132 questions at the end.
--
-- Every published string below was read from the LIVE production row, not
-- retyped: see docs/ec3-recut/RECUT-intermediate.json, whose OLD text was verified
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

  -- ec3i_m01 ord 11: option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s fitted efficiency maximum is 99.9640 percent. What keeps it under 100?' and options = '["The fit clamps the maximum at 100 percent and sets `exact` to false.", "The sampler rejects any efficiency draw above 100 percent and redraws.", "The engine caps the efficiency fraction before it scales the profile.", "Only the belief, since neither the fit nor the sampler caps efficiency at 100 percent."]'::jsonb and answer_index = 3 and explanation = 'Nothing bounds a fitted efficiency above 100 or a fitted minimum below zero; 99.9640 stays under 100 because the belief 85 / 91 / 96 is centred low enough.' then 'old'
           when prompt = 'ISIALA''s fitted efficiency maximum is 99.9640 percent. What keeps it under 100?' and options = '["The fit clamps the maximum at 100 percent and sets `exact` to false.", "The sampler rejects any efficiency draw above 100 percent and redraws.", "The draw guard, which holds every efficiency draw at 100 percent and the fitted maximum with it.", "Only the belief: the fit never inspects its own maximum, and 85 / 91 / 96 is centred low enough to land at 99.9640."]'::jsonb and answer_index = 3 and explanation = 'The fit bounds nothing it produces, so a belief centred higher fits a maximum past 100, as mc_efficiency_past_100 does at 102.1312. Only the DRAWS are bounded: one past 100 is held there and counted in `clippedDraws`, 19 of 300 on that case, while ISIALA holds none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-percentiles-are-not-endpoints' and ord = 11;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m01 ord 11'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m01 ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s fitted efficiency maximum is 99.9640 percent. What keeps it under 100?', options = '["The fit clamps the maximum at 100 percent and sets `exact` to false.", "The sampler rejects any efficiency draw above 100 percent and redraws.", "The draw guard, which holds every efficiency draw at 100 percent and the fitted maximum with it.", "Only the belief: the fit never inspects its own maximum, and 85 / 91 / 96 is centred low enough to land at 99.9640."]'::jsonb, explanation = 'The fit bounds nothing it produces, so a belief centred higher fits a maximum past 100, as mc_efficiency_past_100 does at 102.1312. Only the DRAWS are bounded: one past 100 is held there and counted in `clippedDraws`, 19 of 300 on that case, while ISIALA holds none.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-percentiles-are-not-endpoints' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m01 ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m01 ord 12: option_1, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'After the bisection fixes m, the fit computes the range, then the minimum, then the maximum, then the mode. On a wide cost belief, where can a negative capex come from, and what happens to it?' and options = '["Nowhere, because the range line divides by a positive difference, so every fitted value keeps the sign of the stated 10th percentile it came from.", "The minimum, backed out of the stated 10th percentile, and nothing inspects it, so a negative cost would be sampled like any other value.", "The mode line, since min + m * range can dip below zero on a small m, and the fit then refuses the belief with a note in the insight.", "The range line, which the fit clamps at zero whenever the stated spread is too wide, reporting the result with `exact` set to false."]'::jsonb and answer_index = 1 and explanation = 'The closed form never checks what it produces: min = the stated 10th percentile less range * g(0.1, m) can fall below zero, and ISIALA avoids it only because its capex minimum is 127.2260.' then 'old'
           when prompt = 'After the bisection fixes m, the fit computes the range, then the minimum, then the maximum, then the mode. On a wide cost belief, where can a negative capex come from, and what happens to it?' and options = '["Nowhere, because the range line divides by a positive difference, so every fitted value keeps the sign of the stated 10th percentile it came from.", "The minimum, backed out of the stated 10th percentile, which the fit never inspects; the draw it feeds is then held at the 0 $MM bound and counted.", "The mode line, since min + m * range can dip below zero on a small m, and the fit then refuses the belief with a note in the insight.", "The range line, which the fit clamps at zero whenever the stated spread is too wide, reporting the result with `exact` set to false."]'::jsonb and answer_index = 1 and explanation = 'The closed form never checks what it produces: min = the stated 10th percentile less range * g(0.1, m) can fall below zero. The bound that catches it belongs to the sampler and not to the fit, and ISIALA never reaches it because its capex minimum is 127.2260.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-percentiles-are-not-endpoints' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m01 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m01 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'After the bisection fixes m, the fit computes the range, then the minimum, then the maximum, then the mode. On a wide cost belief, where can a negative capex come from, and what happens to it?', options = '["Nowhere, because the range line divides by a positive difference, so every fitted value keeps the sign of the stated 10th percentile it came from.", "The minimum, backed out of the stated 10th percentile, which the fit never inspects; the draw it feeds is then held at the 0 $MM bound and counted.", "The mode line, since min + m * range can dip below zero on a small m, and the fit then refuses the belief with a note in the insight.", "The range line, which the fit clamps at zero whenever the stated spread is too wide, reporting the result with `exact` set to false."]'::jsonb, explanation = 'The closed form never checks what it produces: min = the stated 10th percentile less range * g(0.1, m) can fall below zero. The bound that catches it belongs to the sampler and not to the fit, and ISIALA never reaches it because its capex minimum is 127.2260.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-percentiles-are-not-endpoints' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m01 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m04 ord 8: option_3
  select case
           when prompt = 'ISIALA''s run prints a mean breakeven of 73.6242 above its median of 73.3297, while mc_with_unreachable prints a mean of 446.8432 under its median of 449.5729. What reverses the order?' and options = '["ISIALA''s longer tail runs right from cost triangles with a long upper reach, while mc_with_unreachable''s expensive tail was cut off at the 500 USD per bbl bracket.", "ISIALA draws at seed 20260829 and mc_with_unreachable at seed 5, and which centre sits higher is decided by the seed.", "ISIALA''s median uses the floor rule while mc_with_unreachable''s averages two neighbours on its count of survivors.", "Finding B1 prints mc_with_unreachable''s two centres in the wrong order, the same defect that zeroes its tornado."]'::jsonb and answer_index = 0 and explanation = 'A mean past the median signals a longer right tail: ISIALA''s capex triangle reaches 252.3607; on mc_with_unreachable the dear iterations were excluded, 55 of 120.' then 'old'
           when prompt = 'ISIALA''s run prints a mean breakeven of 73.6242 above its median of 73.3297, while mc_with_unreachable prints a mean of 446.8432 under its median of 449.5729. What reverses the order?' and options = '["ISIALA''s longer tail runs right from cost triangles with a long upper reach, while mc_with_unreachable''s expensive tail was cut off at the 500 USD per bbl bracket.", "ISIALA draws at seed 20260829 and mc_with_unreachable at seed 5, and which centre sits higher is decided by the seed.", "ISIALA''s median uses the floor rule while mc_with_unreachable''s averages two neighbours on its count of survivors.", "Finding B1 prints mc_with_unreachable''s two centres in the wrong order, which is why its mean reads under its median."]'::jsonb and answer_index = 0 and explanation = 'A mean past the median signals a longer right tail: ISIALA''s capex triangle reaches 252.3607; on mc_with_unreachable the dear iterations were excluded, 55 of 120.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-reading-the-sample' and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m04 ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m04 ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s run prints a mean breakeven of 73.6242 above its median of 73.3297, while mc_with_unreachable prints a mean of 446.8432 under its median of 449.5729. What reverses the order?', options = '["ISIALA''s longer tail runs right from cost triangles with a long upper reach, while mc_with_unreachable''s expensive tail was cut off at the 500 USD per bbl bracket.", "ISIALA draws at seed 20260829 and mc_with_unreachable at seed 5, and which centre sits higher is decided by the seed.", "ISIALA''s median uses the floor rule while mc_with_unreachable''s averages two neighbours on its count of survivors.", "Finding B1 prints mc_with_unreachable''s two centres in the wrong order, which is why its mean reads under its median."]'::jsonb, explanation = 'A mean past the median signals a longer right tail: ISIALA''s capex triangle reaches 252.3607; on mc_with_unreachable the dear iterations were excluded, 55 of 120.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-reading-the-sample' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m04 ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m04 ord 9: option_3
  select case
           when prompt = 'On ISIALA''s S-curve the point at sorted index 2500 sits at 73.3297 with a height of 0.500200. Why is the height not a round half?' and options = '["Excluded iterations shrink n below 5000, so every height is divided by the survivors and drifts just above the round value.", "The curve places index i at (i + 1) / n while the percentile rule takes index floor(q n), two conventions a step apart.", "The median is averaged from two neighbours and the curve plots the upper of the pair, which lifts the height by one step.", "The curve is downsampled to 50 points and 0.500200 is simply the kept height that lies nearest to a half."]'::jsonb and answer_index = 1 and explanation = 'ISIALA excluded 0 iterations and the breakeven S-curve draws every sorted price; (2500 + 1) / 5000 gives 0.500200, a disagreement that is only a convention.' then 'old'
           when prompt = 'On ISIALA''s S-curve the point at sorted index 2500 sits at 73.3297 with a height of 0.500200. Why is the height not a round half?' and options = '["Excluded iterations shrink n below 5000, so every height is divided by the survivors and drifts just above the round value.", "The curve places index i at (i + 1) / n while the percentile rule takes index floor(q n), two conventions a step apart.", "The median is averaged from two neighbours and the curve plots the upper of the pair, which lifts the height by one step.", "The curve is drawn at 51 fixed probabilities from 0 to 100 percent, and 0.500200 is the grid step nearest a half."]'::jsonb and answer_index = 1 and explanation = 'ISIALA excluded 0 iterations and the breakeven S-curve draws every sorted price; (2500 + 1) / 5000 gives 0.500200, a disagreement that is only a convention.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-reading-the-sample' and ord = 9;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m04 ord 9'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m04 ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On ISIALA''s S-curve the point at sorted index 2500 sits at 73.3297 with a height of 0.500200. Why is the height not a round half?', options = '["Excluded iterations shrink n below 5000, so every height is divided by the survivors and drifts just above the round value.", "The curve places index i at (i + 1) / n while the percentile rule takes index floor(q n), two conventions a step apart.", "The median is averaged from two neighbours and the curve plots the upper of the pair, which lifts the height by one step.", "The curve is drawn at 51 fixed probabilities from 0 to 100 percent, and 0.500200 is the grid step nearest a half."]'::jsonb, explanation = 'ISIALA excluded 0 iterations and the breakeven S-curve draws every sorted price; (2500 + 1) / 5000 gives 0.500200, a disagreement that is only a convention.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-reading-the-sample' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m04 ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m05 ord 6: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Replace ISIALA''s opex belief with the narrow 16 / 17 / 26. The base breakeven moves to 67.2301 and the opex bar reads a low side of -1.4602 and a high side of 13.2707. Why is the high side so much longer?' and options = '["The fit clamped to 15.1886 / 15.1886 / 31.0000, and the tornado swings a clamped belief to its fitted maximum of 31.0000 on the high side instead of the stated 26.", "The bar is measured from the sample median, which the clamped triangle pushed up, so the high side starts from a higher centre than the stated one of the run.", "The stated median of 17 sits just past the 10th percentile of 16, so the step down barely moves the price while the reach up to 26 moves it a great deal.", "Every side is scaled by the base breakeven, and a base that fell to 67.2301 stretches the high side in proportion."]'::jsonb and answer_index = 2 and explanation = 'The base and the tornado run at the stated median of 17 and swing to the stated 16 and 26; the clamped triangle feeds only the sample, finding EC3-5.' then 'old'
           when prompt = 'Replace ISIALA''s opex belief with the narrow 16 / 17 / 26. The run reports opex beliefs of 16.0000 / 19.8197 / 26.0000 marked fitted, a base breakeven of 71.3621, and an opex bar of -5.5922 and 9.1387. Which opex does that bar swing around?' and options = '["The stated median of 17, which the engine keeps for the deterministic work and hands to the tornado, leaving the clamped triangle to feed the sampled iterations alone.", "The fitted triangle''s mode of 15.1886, since a clamped fit places its mode at the minimum and the base case is always solved at the likeliest value of each input.", "The fitted triangle''s own percentiles, with its median of 19.8197 in the base case, because a clamped fit hands the deterministic work the belief it can honour.", "The sample''s median breakeven of 73.1740, since a clamped bar is measured from the centre of the run."]'::jsonb and answer_index = 2 and explanation = 'The beliefs line names what the base case and the tornado used, opex 16.0000 / 19.8197 / 26.0000 fitted, so both ends and the base stand on one triangle, finding EC3-5. Before the 2026-09-15 repair the base was solved at the stated 17 and the bar printed -1.4602 and 13.2707.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 6;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m05 ord 6'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m05 ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Replace ISIALA''s opex belief with the narrow 16 / 17 / 26. The run reports opex beliefs of 16.0000 / 19.8197 / 26.0000 marked fitted, a base breakeven of 71.3621, and an opex bar of -5.5922 and 9.1387. Which opex does that bar swing around?', options = '["The stated median of 17, which the engine keeps for the deterministic work and hands to the tornado, leaving the clamped triangle to feed the sampled iterations alone.", "The fitted triangle''s mode of 15.1886, since a clamped fit places its mode at the minimum and the base case is always solved at the likeliest value of each input.", "The fitted triangle''s own percentiles, with its median of 19.8197 in the base case, because a clamped fit hands the deterministic work the belief it can honour.", "The sample''s median breakeven of 73.1740, since a clamped bar is measured from the centre of the run."]'::jsonb, explanation = 'The beliefs line names what the base case and the tornado used, opex 16.0000 / 19.8197 / 26.0000 fitted, so both ends and the base stand on one triangle, finding EC3-5. Before the 2026-09-15 repair the base was solved at the stated 17 and the bar printed -1.4602 and 13.2707.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m05 ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m05 ord 7: prompt, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the published mc_with_unreachable case the tornado''s low sides read -80.7218, -6.7689 and -26.2125, and every high side reads 0.0000. What swing does the engine give each bar, and what does the sort then do?' and options = '["A swing equal to each low side''s size, 80.7218 for capex, so capex still ranks first and only the drawing of the high side is lost.", "No swing and no bars, because the engine drops a variable from the tornado once either of its sides fails to break even under 500 USD per bbl, leaving an empty chart.", "A swing measured to the bracket top instead, since a high side that cannot be solved is placed at 500 USD per bbl before the sort.", "A swing of 0 for every bar, because a missing side zeroes the swing, so the sort ranks nothing and a bar with a missing side sorts last whatever its influence."]'::jsonb and answer_index = 3 and explanation = 'The base of 498.0372 sits just short of the bracket top, so no high side is solved; finding B1 is not repaired, and a zero looks exactly like a variable that does not matter.' then 'old'
           when prompt = 'On the published mc_with_unreachable case the tornado''s low sides read -80.7218, -6.7689 and -26.2125, and no variable reaches a breakeven below 500 USD per bbl at its adverse end. What does the engine report for those ends, and what does the sort do?' and options = '["A swing equal to each low side''s size, 80.7218 for capex, so capex still ranks first and only the drawing of the high side is lost.", "No swing and no bars, because the engine drops a variable from the tornado once either of its sides fails to break even under 500 USD per bbl, leaving an empty chart.", "A swing measured to the bracket top instead, since a high side that cannot be solved is placed at 500 USD per bbl before the sort.", "Each high side is null and each bar carries unreachable true with no swing at all, and those bars are placed at the top of the chart."]'::jsonb and answer_index = 3 and explanation = 'The base of 498.0372 sits just short of the bracket top, so no adverse end solves. B1 was fixed on 2026-09-15: a side the engine never placed reads null, carries unreachable true and sorts first, where it used to read 0.0000 and sort last.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 7;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m05 ord 7'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m05 ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the published mc_with_unreachable case the tornado''s low sides read -80.7218, -6.7689 and -26.2125, and no variable reaches a breakeven below 500 USD per bbl at its adverse end. What does the engine report for those ends, and what does the sort do?', options = '["A swing equal to each low side''s size, 80.7218 for capex, so capex still ranks first and only the drawing of the high side is lost.", "No swing and no bars, because the engine drops a variable from the tornado once either of its sides fails to break even under 500 USD per bbl, leaving an empty chart.", "A swing measured to the bracket top instead, since a high side that cannot be solved is placed at 500 USD per bbl before the sort.", "Each high side is null and each bar carries unreachable true with no swing at all, and those bars are placed at the top of the chart."]'::jsonb, explanation = 'The base of 498.0372 sits just short of the bracket top, so no adverse end solves. B1 was fixed on 2026-09-15: a side the engine never placed reads null, carries unreachable true and sorts first, where it used to read 0.0000 and sort last.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m05 ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m05 ord 12: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the narrow opex belief 16 / 17 / 26 the bars read Total CAPEX -7.0493 and 9.4442, Annual OPEX -1.4602 and 13.2707, and Prod. Efficiency -3.5016 and 4.7457. Which variable leads a sort by high side, and which trails a sort by low side?' and options = '["Total CAPEX leads both sorts, because it has the largest low side and the largest high side on this belief exactly as on the stated one.", "Annual OPEX leads the sort by high side and Prod. Efficiency trails the sort by low side, because efficiency runs backwards.", "Prod. Efficiency leads the sort by low side since it runs backwards, and Total CAPEX trails the sort by high side.", "Annual OPEX both leads the sort by high side and trails the sort by low side."]'::jsonb and answer_index = 3 and explanation = 'Opex has the largest high side, 13.2707, and the smallest low side, -1.4602, so the two one-sided sorts disagree and the swing folds both directions into one width.' then 'old'
           when prompt = 'On the narrow opex belief 16 / 17 / 26 the bars read Total CAPEX -7.0226 and 9.4090, Annual OPEX -5.5922 and 9.1387, and Prod. Efficiency -3.7168 and 5.0373. Which variable leads a sort by high side, and which trails a sort by low side?' and options = '["Annual OPEX leads the sort by high side and trails the sort by low side, because a clamped belief reaches much further up than it reaches down.", "Prod. Efficiency leads the sort by high side because it runs backwards, and Total CAPEX trails the sort by low side.", "No variable leads either sort, because a belief whose fit reports exact false is left out of the ranking until its percentiles are widened.", "Total CAPEX leads the sort by high side, and Prod. Efficiency trails the sort by low side."]'::jsonb and answer_index = 3 and explanation = 'Capex has the largest high side at 9.4090 and efficiency the smallest low side at -3.7168, so both one-sided sorts agree with the sort by swing; every end and the base stand on the fitted opex belief 16.0000 / 19.8197 / 26.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 12;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m05 ord 12'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m05 ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the narrow opex belief 16 / 17 / 26 the bars read Total CAPEX -7.0226 and 9.4090, Annual OPEX -5.5922 and 9.1387, and Prod. Efficiency -3.7168 and 5.0373. Which variable leads a sort by high side, and which trails a sort by low side?', options = '["Annual OPEX leads the sort by high side and trails the sort by low side, because a clamped belief reaches much further up than it reaches down.", "Prod. Efficiency leads the sort by high side because it runs backwards, and Total CAPEX trails the sort by low side.", "No variable leads either sort, because a belief whose fit reports exact false is left out of the ranking until its percentiles are widened.", "Total CAPEX leads the sort by high side, and Prod. Efficiency trails the sort by low side."]'::jsonb, explanation = 'Capex has the largest high side at 9.4090 and efficiency the smallest low side at -3.7168, so both one-sided sorts agree with the sort by swing; every end and the base stand on the fitted opex belief 16.0000 / 19.8197 / 26.0000.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-two-sided-tornado' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m05 ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m06 ord 3: prompt, option_0, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA with the narrow opex belief 16 / 17 / 26 reports a base breakeven of 67.2301 and a median breakeven of 73.1740. Why must a worked reading say that the fit clamped?' and options = '["The base case and the tornado run at the stated median of 17 while the sample draws from the clamped triangle of 15.1886 / 15.1886 / 31.0000, so one screen mixes two beliefs.", "The clamp makes the run discard every iteration that draws opex below the fitted minimum of 15.1886, so the median describes the survivors.", "A clamped fit is refitted at every seed, so the median of 73.1740 cannot be reproduced unless the note is quoted beside it.", "The note only warns about precision, since the base, the tornado and the sample all use the same clamped triangle."]'::jsonb and answer_index = 0 and explanation = 'Finding EC3-5: a clamped fit answers a different belief from the one stated, and only the fit note warns that the base of 67.2301 and the sample describe different opex.' then 'old'
           when prompt = 'ISIALA with the narrow opex belief 16 / 17 / 26 reports a base breakeven of 71.3621 and a median breakeven of 73.1740. Why must a worked reading still say that the fit clamped?' and options = '["The base case and the tornado answer the fitted opex belief of 16.0000 / 19.8197 / 26.0000, so a reading that repeats the stated median of 17 names a belief the run never used.", "The clamp makes the run discard every iteration that draws opex below the fitted minimum of 15.1886, so the median describes the survivors.", "A clamped fit is refitted at every seed, so the median of 73.1740 cannot be reproduced unless the note is quoted beside it.", "The note only warns about precision, since the base and the sample have always read one triangle."]'::jsonb and answer_index = 0 and explanation = 'Finding EC3-5: a clamped fit answers a different belief from the one stated, and the beliefs line is where the run says so, opex fitted with a median of 19.8197 against the stated 17.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m06 ord 3'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m06 ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA with the narrow opex belief 16 / 17 / 26 reports a base breakeven of 71.3621 and a median breakeven of 73.1740. Why must a worked reading still say that the fit clamped?', options = '["The base case and the tornado answer the fitted opex belief of 16.0000 / 19.8197 / 26.0000, so a reading that repeats the stated median of 17 names a belief the run never used.", "The clamp makes the run discard every iteration that draws opex below the fitted minimum of 15.1886, so the median describes the survivors.", "A clamped fit is refitted at every seed, so the median of 73.1740 cannot be reproduced unless the note is quoted beside it.", "The note only warns about precision, since the base and the sample have always read one triangle."]'::jsonb, explanation = 'Finding EC3-5: a clamped fit answers a different belief from the one stated, and the beliefs line is where the run says so, opex fitted with a median of 19.8197 against the stated 17.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m06 ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_m06 ord 14: prompt, option_0, option_1, option_2, option_3 KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Through the Scenario Builder''s Monte Carlo at the app''s own settings, ISIALA''s NPV reads 48.7439, 81.1835 and 109.8980. Which label does 48.7439 take, and what did the panel print before the repair?' and options = '["48.7439 is the Low case P10, as the key `p10` names it, and the old panel printed it correctly under \"P10 (Optimistic)\" all along.", "48.7439 is the 10th percentile of NPV and takes no P-label, since an NPV follows the same percentile words as a breakeven price.", "109.8980 is the Low case P90, the larger value met nine times in ten, which is what the old panel was printing and still prints.", "48.7439 is the Low case P90, stored under the key `p10`, and the old panel printed the larger 109.8980 under \"P90 (Conservative)\"."]'::jsonb and answer_index = 3 and explanation = 'An NPV is a quantity where more is better, so it takes exceedance labels; the option reading the key `p10` as a P-label is the mistake examined, and the old card called conservative held the larger number.' then 'old'
           when prompt = 'Through the Scenario Builder''s Monte Carlo at the app''s own settings, ISIALA''s NPV reads 15.6063, 78.5315 and 152.0653. Which label does 15.6063 take, and what did the panel print before the repair?' and options = '["15.6063 is the Low case P10, as the key `p10` names it, and the old panel printed it correctly under \"P10 (Optimistic)\" all along.", "15.6063 is the 10th percentile of NPV and takes no P-label, since an NPV follows the same percentile words as a breakeven price.", "152.0653 is the Low case P90, the larger value met nine times in ten, which is what the old panel was printing and still prints.", "15.6063 is the Low case P90, stored under the key `p10`, and the old panel printed the larger 152.0653 under \"P90 (Conservative)\"."]'::jsonb and answer_index = 3 and explanation = 'An NPV is a quantity where more is better, so it takes exceedance labels; the option reading the key `p10` as a P-label is the mistake examined, and the old card called conservative held the larger number.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_m06 ord 14'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_m06 ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Through the Scenario Builder''s Monte Carlo at the app''s own settings, ISIALA''s NPV reads 15.6063, 78.5315 and 152.0653. Which label does 15.6063 take, and what did the panel print before the repair?', options = '["15.6063 is the Low case P10, as the key `p10` names it, and the old panel printed it correctly under \"P10 (Optimistic)\" all along.", "15.6063 is the 10th percentile of NPV and takes no P-label, since an NPV follows the same percentile words as a breakeven price.", "152.0653 is the Low case P90, the larger value met nine times in ten, which is what the old panel was printing and still prints.", "15.6063 is the Low case P90, stored under the key `p10`, and the old panel printed the larger 152.0653 under \"P90 (Conservative)\"."]'::jsonb, explanation = 'An NPV is a quantity where more is better, so it takes exceedance labels; the option reading the key `p10` as a P-label is the mistake examined, and the old card called conservative held the larger number.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_m06 ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 5: option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA''s efficiency belief of 85 / 91 / 96 percent fits a triangle whose maximum is 99.9640. What keeps that maximum under 100 percent?' and options = '["The fit caps the maximum at 100 percent and would set exact false with a note, the same shape as the clamp it applies to a median outside the reachable band.", "Only the belief: nothing in the fit or the sampler bounds efficiency, so a belief sitting nearer the top would fit and sample values past 100 percent.", "`triInvCDF` rejects any draw above 100 percent and draws again from the generator, so a triangle past 100 never books more barrels than the profile holds.", "The engine divides efficiency by 100 and clamps the result at one before it scales the production profile."]'::jsonb and answer_index = 1 and explanation = 'Neither the fit nor the breakeven engine bounds a belief: the closed form never inspects min or max, and triInvCDF never truncates or rejects. 99.9640 stays under 100 because the belief is centred at 91.' then 'old'
           when prompt = 'ISIALA''s efficiency belief of 85 / 91 / 96 percent fits a triangle whose maximum is 99.9640. What keeps that maximum under 100 percent?' and options = '["The fit caps the maximum at 100 percent and would set exact false with a note, the same shape as the clamp it applies to a median outside the reachable band.", "Only the belief: the fit never inspects its own ends, so a belief sitting nearer the top fits a maximum past 100 percent and has its draws held at the limit.", "`triInvCDF` rejects any draw above 100 percent and draws again from the generator, so a triangle past 100 never books more barrels than the profile holds.", "The engine refuses any belief whose fitted maximum passes 100 percent, the same refusal it gives an efficiency percentile stated above 100."]'::jsonb and answer_index = 1 and explanation = 'The closed form never inspects min or max and triInvCDF never truncates or rejects, so a belief centred higher fits past 100 and is run, not refused: mc_efficiency_past_100 fits 102.1312 with exact true. What keeps a barrel count honest there is the draw guard, which holds 19 of its 300 draws at 100. ISIALA fits 99.9640 because its belief is centred at 91.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 5'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s efficiency belief of 85 / 91 / 96 percent fits a triangle whose maximum is 99.9640. What keeps that maximum under 100 percent?', options = '["The fit caps the maximum at 100 percent and would set exact false with a note, the same shape as the clamp it applies to a median outside the reachable band.", "Only the belief: the fit never inspects its own ends, so a belief sitting nearer the top fits a maximum past 100 percent and has its draws held at the limit.", "`triInvCDF` rejects any draw above 100 percent and draws again from the generator, so a triangle past 100 never books more barrels than the profile holds.", "The engine refuses any belief whose fitted maximum passes 100 percent, the same refusal it gives an efficiency percentile stated above 100."]'::jsonb, explanation = 'The closed form never inspects min or max and triInvCDF never truncates or rejects, so a belief centred higher fits past 100 and is run, not refused: mc_efficiency_past_100 fits 102.1312 with exact true. What keeps a barrel count honest there is the draw guard, which holds 19 of its 300 draws at 100. ISIALA fits 99.9640 because its belief is centred at 91.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 8: prompt, option_0
  select case
           when prompt = '`mulberry32(20260829)` opens 0.936239, 0.826447, 0.952306, 0.732031, 0.064278, 0.391443. Which draws make iteration 2 of ISIALA''s breakeven run, and where do they land?' and options = '["Capex takes 0.826447, the second draw, on the upper branch, since iteration k starts at draw k, then iteration 2 continues with the next two draws for opex and efficiency.", "Capex takes 0.732031 on the lower branch, because a draw below 0.9 cannot reach past the stated 90th percentile of 220.", "Capex takes 0.732031 on the upper branch, opex takes 0.064278 on the lower branch below the stated 16, and efficiency takes 0.391443 below the stated median of 91.", "Opex takes 0.732031 and capex 0.064278, because the order follows the variables as they are entered on the input screen."]'::jsonb and answer_index = 2 and explanation = 'Draws belong to positions: iteration 1 owns draws 1 to 3 and iteration 2 draws 4 to 6, always capex, opex, efficiency. Opex''s 0.064278 is below its F(mode) of 0.233597 and below 0.1, so it lands between 13.3201 and the stated 10th percentile.' then 'old'
           when prompt = 'At seed 20260829 the generator''s fourth, fifth and sixth numbers are 0.732031, 0.064278 and 0.391443. Which variable of ISIALA''s breakeven run takes each of them, and where does each land?' and options = '["Capex takes the second number, 0.826447, on the upper branch, since iteration k opens at draw k, and iteration 2 then runs on through the next two numbers for opex and efficiency.", "Capex takes 0.732031 on the lower branch, because a draw below 0.9 cannot reach past the stated 90th percentile of 220.", "Capex takes 0.732031 on the upper branch, opex takes 0.064278 on the lower branch below the stated 16, and efficiency takes 0.391443 below the stated median of 91.", "Opex takes 0.732031 and capex 0.064278, because the order follows the variables as they are entered on the input screen."]'::jsonb and answer_index = 2 and explanation = 'Draws belong to positions: iteration 1 owns draws 1 to 3 and iteration 2 draws 4 to 6, always capex, opex, efficiency. Opex''s 0.064278 is below its F(mode) of 0.233597 and below 0.1, so it lands between 13.3201 and the stated 10th percentile.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 8'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'At seed 20260829 the generator''s fourth, fifth and sixth numbers are 0.732031, 0.064278 and 0.391443. Which variable of ISIALA''s breakeven run takes each of them, and where does each land?', options = '["Capex takes the second number, 0.826447, on the upper branch, since iteration k opens at draw k, and iteration 2 then runs on through the next two numbers for opex and efficiency.", "Capex takes 0.732031 on the lower branch, because a draw below 0.9 cannot reach past the stated 90th percentile of 220.", "Capex takes 0.732031 on the upper branch, opex takes 0.064278 on the lower branch below the stated 16, and efficiency takes 0.391443 below the stated median of 91.", "Opex takes 0.732031 and capex 0.064278, because the order follows the variables as they are entered on the input screen."]'::jsonb, explanation = 'Draws belong to positions: iteration 1 owns draws 1 to 3 and iteration 2 draws 4 to 6, always capex, opex, efficiency. Opex''s 0.064278 is below its F(mode) of 0.233597 and below 0.1, so it lands between 13.3201 and the stated 10th percentile.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 10: prompt
  select case
           when prompt = 'ISIALA''s breakeven median is 73.3297 USD/bbl at the default seed over 5000 iterations, and two runs at that seed match value for value. Across seeds 1 to 10 at the same count the medians span 72.6338 to 73.1287. What should a report take from this?' and options = '["73.3297 is the accurate median, because a matching rerun at the default seed validates it and the other ten seeds are unvalidated samples of the same inputs.", "The engine is unstable across seeds and should be fixed, since one set of inputs ought to produce a single median at any seed.", "Report whichever seed reads best, since each of the eleven results reproduces exactly and the written seed makes any one of them defensible in front of a board.", "The seed makes 73.3297 repeatable and says nothing about accuracy: it sits above all ten other medians, and the first decimal moves from seed to seed."]'::jsonb and answer_index = 3 and explanation = 'A seed buys reproducibility, not accuracy. The range across the ten seeds is 0.4949, so the honest reading is the spread; seed shopping is reproducible without being representative.' then 'old'
           when prompt = 'A report defends 73.3297 USD/bbl because the whole run repeats value for value whenever the default seed is written down, and offers that repetition as evidence. Ten other seeds put the same statistic between 72.6338 and 73.1287. What does the repetition prove?' and options = '["73.3297 is the accurate median, because a matching rerun at the default seed validates it and the other ten seeds are unvalidated samples of the same inputs.", "The engine is unstable across seeds and should be fixed, since one set of inputs ought to produce a single median at any seed.", "Report whichever seed reads best, since each of the eleven results reproduces exactly and the written seed makes any one of them defensible in front of a board.", "The seed makes 73.3297 repeatable and says nothing about accuracy: it sits above all ten other medians, and the first decimal moves from seed to seed."]'::jsonb and answer_index = 3 and explanation = 'A seed buys reproducibility, not accuracy. The range across the ten seeds is 0.4949, so the honest reading is the spread; seed shopping is reproducible without being representative.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 10'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A report defends 73.3297 USD/bbl because the whole run repeats value for value whenever the default seed is written down, and offers that repetition as evidence. Ten other seeds put the same statistic between 72.6338 and 73.1287. What does the repetition prove?', options = '["73.3297 is the accurate median, because a matching rerun at the default seed validates it and the other ten seeds are unvalidated samples of the same inputs.", "The engine is unstable across seeds and should be fixed, since one set of inputs ought to produce a single median at any seed.", "Report whichever seed reads best, since each of the eleven results reproduces exactly and the written seed makes any one of them defensible in front of a board.", "The seed makes 73.3297 repeatable and says nothing about accuracy: it sits above all ten other medians, and the first decimal moves from seed to seed."]'::jsonb, explanation = 'A seed buys reproducibility, not accuracy. The range across the ten seeds is 0.4949, so the honest reading is the spread; seed shopping is reproducible without being representative.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 13: prompt
  select case
           when prompt = 'Iteration 1 draws a capex of 226.5205 million USD, above the stated 90th percentile of 220. Is the sample wrong?' and options = '["No: its draw of 0.936239 is above 0.9, the exact fit makes the fitted 90th percentile equal 220, and the fitted maximum of 252.3607 leaves room.", "Yes: 220 is the top of the stated belief, so any sampled capex above it shows the sampler ignored the fitted triangle and drew from outside its range.", "No, but only because the first draw of any run is taken from the top tenth of the generator to seed the tail.", "Yes: a draw of 0.936239 belongs on the lower branch, which climbs from the minimum and would have kept the value inside the stated range of 150 to 220."]'::jsonb and answer_index = 0 and explanation = 'A tenth of capex draws should land above 220. The draw 0.936239 exceeds F(mode) of 0.331225, so it takes the upper branch and lands between the fitted 90th percentile and the fitted maximum.' then 'old'
           when prompt = 'A reviewer wants the sample thrown out, having found a capex of 226.5205 million USD inside it, dearer than the 220 the engineer wrote as the 90th percentile. Is the objection right?' and options = '["No: its draw of 0.936239 is above 0.9, the exact fit makes the fitted 90th percentile equal 220, and the fitted maximum of 252.3607 leaves room.", "Yes: 220 is the top of the stated belief, so any sampled capex above it shows the sampler ignored the fitted triangle and drew from outside its range.", "No, but only because the first draw of any run is taken from the top tenth of the generator to seed the tail.", "Yes: a draw of 0.936239 belongs on the lower branch, which climbs from the minimum and would have kept the value inside the stated range of 150 to 220."]'::jsonb and answer_index = 0 and explanation = 'A tenth of capex draws should land above 220. The draw 0.936239 exceeds F(mode) of 0.331225, so it takes the upper branch and lands between the fitted 90th percentile and the fitted maximum.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 13'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A reviewer wants the sample thrown out, having found a capex of 226.5205 million USD inside it, dearer than the 220 the engineer wrote as the 90th percentile. Is the objection right?', options = '["No: its draw of 0.936239 is above 0.9, the exact fit makes the fitted 90th percentile equal 220, and the fitted maximum of 252.3607 leaves room.", "Yes: 220 is the top of the stated belief, so any sampled capex above it shows the sampler ignored the fitted triangle and drew from outside its range.", "No, but only because the first draw of any run is taken from the top tenth of the generator to seed the tail.", "Yes: a draw of 0.936239 belongs on the lower branch, which climbs from the minimum and would have kept the value inside the stated range of 150 to 220."]'::jsonb, explanation = 'A tenth of capex draws should land above 220. The draw 0.936239 exceeds F(mode) of 0.331225, so it takes the upper branch and lands between the fitted 90th percentile and the fitted maximum.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 17: prompt
  select case
           when prompt = 'ISIALA''s breakeven engine NPV is -6.5653 at 70 USD/bbl and 33.6477 at 80. A straight line between them reads a slightly higher breakeven than the solved 71.6277. Why?' and options = '["Year 13''s kink at 74.6504 sits inside the interval, and below it NPV climbs more steeply, so the true crossing comes earlier than the line.", "Bisection stops before the bracket closes and understates the price, so the interpolated value is the more precise of the two and the solved price should be corrected.", "Above 74.6504 NPV climbs more steeply than below it, as each taxed year adds more, which drags the straight line''s crossing to the left of the curve''s.", "The table rounds each NPV to four decimals, which moves the interpolated crossing by about the gap between the two."]'::jsonb and answer_index = 0 and explanation = 'Crossing a kink hands 35 percent of that year''s extra revenue after royalty to tax and bends the line shallower. The curve is steeper on the left piece, so it reaches zero sooner than the chord between 70 and 80.' then 'old'
           when prompt = 'Two tabulated points bracket ISIALA''s breakeven: -6.5653 at 70 USD/bbl and 33.6477 at 80. Interpolating between them puts the crossing above the solved 71.6277. Why does the chord miss?' and options = '["Year 13''s kink at 74.6504 sits inside the interval, and below it NPV climbs more steeply, so the true crossing comes earlier than the line.", "Bisection stops before the bracket closes and understates the price, so the interpolated value is the more precise of the two and the solved price should be corrected.", "Above 74.6504 NPV climbs more steeply than below it, as each taxed year adds more, which drags the straight line''s crossing to the left of the curve''s.", "The table rounds each NPV to four decimals, which moves the interpolated crossing by about the gap between the two."]'::jsonb and answer_index = 0 and explanation = 'Crossing a kink hands 35 percent of that year''s extra revenue after royalty to tax and bends the line shallower. The curve is steeper on the left piece, so it reaches zero sooner than the chord between 70 and 80.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 17'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Two tabulated points bracket ISIALA''s breakeven: -6.5653 at 70 USD/bbl and 33.6477 at 80. Interpolating between them puts the crossing above the solved 71.6277. Why does the chord miss?', options = '["Year 13''s kink at 74.6504 sits inside the interval, and below it NPV climbs more steeply, so the true crossing comes earlier than the line.", "Bisection stops before the bracket closes and understates the price, so the interpolated value is the more precise of the two and the solved price should be corrected.", "Above 74.6504 NPV climbs more steeply than below it, as each taxed year adds more, which drags the straight line''s crossing to the left of the curve''s.", "The table rounds each NPV to four decimals, which moves the interpolated crossing by about the gap between the two."]'::jsonb, explanation = 'Crossing a kink hands 35 percent of that year''s extra revenue after royalty to tax and bends the line shallower. The curve is steeper on the left piece, so it reaches zero sooner than the chord between 70 and 80.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 25: prompt
  select case
           when prompt = 'mc_with_unreachable reports 397.3404, 449.5729 and 486.6757 USD/bbl as its 10th percentile, median and 90th percentile, excluding 55 of 120 iterations, while its base case breaks even at 498.0372. What does the base above the 90th percentile show?' and options = '["The percentiles describe survivors only: every excluded iteration needed a price above 500, so the whole sample''s median lies above 449.5729.", "The base case is a single solve at the stated medians, which always sits above the sample''s 90th percentile whenever the beliefs are skewed toward overruns.", "The excluded iterations were set to 500 USD/bbl and sorted into the top of the sample, which drags the reported percentiles upward toward the base.", "The run is tight and well behaved, and the base simply reflects a capex belief whose median sits near its 90th percentile."]'::jsonb and answer_index = 0 and explanation = 'On ISIALA''s complete sample the base of 71.6277 sits between the 10th percentile and the median. Here it sits past the top because the dear draws left and the cheap ones stayed, and the printed count is the only evidence of the truncation.' then 'old'
           when prompt = 'On mc_with_unreachable the base case needs 498.0372 USD/bbl, dearer than the 486.6757 printed at the top of its percentile table, and 55 of its 120 iterations never solved at all. What does a base above the top of the table show?' and options = '["The percentiles describe survivors only: every excluded iteration needed a price above 500, so the whole sample''s median lies above 449.5729.", "The base case is a single solve at the stated medians, which always sits above the sample''s 90th percentile whenever the beliefs are skewed toward overruns.", "The excluded iterations were set to 500 USD/bbl and sorted into the top of the sample, which drags the reported percentiles upward toward the base.", "The run is tight and well behaved, and the base simply reflects a capex belief whose median sits near its 90th percentile."]'::jsonb and answer_index = 0 and explanation = 'On ISIALA''s complete sample the base of 71.6277 sits between the 10th percentile and the median. Here it sits past the top because the dear draws left and the cheap ones stayed, and the printed count is the only evidence of the truncation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 25'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On mc_with_unreachable the base case needs 498.0372 USD/bbl, dearer than the 486.6757 printed at the top of its percentile table, and 55 of its 120 iterations never solved at all. What does a base above the top of the table show?', options = '["The percentiles describe survivors only: every excluded iteration needed a price above 500, so the whole sample''s median lies above 449.5729.", "The base case is a single solve at the stated medians, which always sits above the sample''s 90th percentile whenever the beliefs are skewed toward overruns.", "The excluded iterations were set to 500 USD/bbl and sorted into the top of the sample, which drags the reported percentiles upward toward the base.", "The run is tight and well behaved, and the base simply reflects a capex belief whose median sits near its 90th percentile."]'::jsonb, explanation = 'On ISIALA''s complete sample the base of 71.6277 sits between the 10th percentile and the median. Here it sits past the top because the dear draws left and the cheap ones stayed, and the printed count is the only evidence of the truncation.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 27: option_2, explanation
  select case
           when prompt = 'The breakeven engine reads ISIALA''s median at sorted index 2500 of 5000, and the S-curve draws that same price 0.500200 of the way up. Why not exactly one half?' and options = '["The seed offsets every height by one draw, so a different seed would put the median at a round half.", "The heights are computed on the surviving iterations, and ISIALA''s excluded iterations shrink n below 5000.", "The S-curve is downsampled to 50 points with a last probability of 98.0000, so its heights are rounded to the kept points.", "The curve places index i at (i + 1) / n while the percentile rule reads index floor(q n), two conventions a step apart."]'::jsonb and answer_index = 3 and explanation = 'The first point sits one step off zero and the last reaches one, so reading the curve at exactly a half lands one step left of the reported median. The downsampled curve ending at 98.0000 is the Scenario Builder''s, another engine.' then 'old'
           when prompt = 'The breakeven engine reads ISIALA''s median at sorted index 2500 of 5000, and the S-curve draws that same price 0.500200 of the way up. Why not exactly one half?' and options = '["The seed offsets every height by one draw, so a different seed would put the median at a round half.", "The heights are computed on the surviving iterations, and ISIALA''s excluded iterations shrink n below 5000.", "The S-curve is drawn at 51 fixed probabilities from 0 to 100 percent, so every height lands on that grid and 0.500200 is the step nearest a half.", "The curve places index i at (i + 1) / n while the percentile rule reads index floor(q n), two conventions a step apart."]'::jsonb and answer_index = 3 and explanation = 'The first point sits one step off zero and the last reaches one, so reading the curve at exactly a half lands one step left of the reported median. The curve drawn at 51 fixed probabilities is the Scenario Builder''s, another engine.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 27'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'The breakeven engine reads ISIALA''s median at sorted index 2500 of 5000, and the S-curve draws that same price 0.500200 of the way up. Why not exactly one half?', options = '["The seed offsets every height by one draw, so a different seed would put the median at a round half.", "The heights are computed on the surviving iterations, and ISIALA''s excluded iterations shrink n below 5000.", "The S-curve is drawn at 51 fixed probabilities from 0 to 100 percent, so every height lands on that grid and 0.500200 is the step nearest a half.", "The curve places index i at (i + 1) / n while the percentile rule reads index floor(q n), two conventions a step apart."]'::jsonb, explanation = 'The first point sits one step off zero and the last reaches one, so reading the curve at exactly a half lands one step left of the reported median. The curve drawn at 51 fixed probabilities is the Scenario Builder''s, another engine.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 29: option_2
  select case
           when prompt = 'ISIALA''s 5000 breakeven prices run from 50.7415 to 107.6755 USD/bbl. Why are those two not the range to quote?' and options = '["Each is a single iteration, one lucky or unlucky trio of draws, while the 10th and 90th percentiles each have hundreds of prices beyond them.", "They are the fitted minimum and maximum of the breakeven distribution, which the engine solves from the triangles and reports only for plotting.", "They are the prices at the S-curve''s first and last points, which the downsample drops before the chart is drawn.", "They are true bounds, since the sampler cannot draw beyond its fitted triangles, but they are too wide to be useful in a report to a sanction meeting."]'::jsonb and answer_index = 0 and explanation = 'The S-curve reads zero under 50.7415 and one past 107.6755 only because these draws did not reach further, which says nothing about how low or high ISIALA''s breakeven can go.' then 'old'
           when prompt = 'ISIALA''s 5000 breakeven prices run from 50.7415 to 107.6755 USD/bbl. Why are those two not the range to quote?' and options = '["Each is a single iteration, one lucky or unlucky trio of draws, while the 10th and 90th percentiles each have hundreds of prices beyond them.", "They are the fitted minimum and maximum of the breakeven distribution, which the engine solves from the triangles and reports only for plotting.", "They sit at the S-curve''s fixed end probabilities of 0 and 100 percent, which the engine interpolates rather than reading off the sample.", "They are true bounds, since the sampler cannot draw beyond its fitted triangles, but they are too wide to be useful in a report to a sanction meeting."]'::jsonb and answer_index = 0 and explanation = 'The S-curve reads zero under 50.7415 and one past 107.6755 only because these draws did not reach further, which says nothing about how low or high ISIALA''s breakeven can go.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 29'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'ISIALA''s 5000 breakeven prices run from 50.7415 to 107.6755 USD/bbl. Why are those two not the range to quote?', options = '["Each is a single iteration, one lucky or unlucky trio of draws, while the 10th and 90th percentiles each have hundreds of prices beyond them.", "They are the fitted minimum and maximum of the breakeven distribution, which the engine solves from the triangles and reports only for plotting.", "They sit at the S-curve''s fixed end probabilities of 0 and 100 percent, which the engine interpolates rather than reading off the sample.", "They are true bounds, since the sampler cannot draw beyond its fitted triangles, but they are too wide to be useful in a report to a sanction meeting."]'::jsonb, explanation = 'The S-curve reads zero under 50.7415 and one past 107.6755 only because these draws did not reach further, which says nothing about how low or high ISIALA''s breakeven can go.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 34: prompt, option_0, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'ISIALA with the narrow opex belief 16 / 17 / 26 reports a base breakeven of 67.2301 and sample percentiles of 62.0843, 73.1740 and 85.4599 USD/bbl. Which belief does each number come from?' and options = '["All of them use the clamped triangle, since once the fit clamps the engine replaces the stated median with the fitted one everywhere.", "All of them use the stated belief, since the clamp only changes the note in the insight and never the distribution sampled.", "The base uses the fitted mode of 15.1886 and the percentiles use the stated belief, which is why the base sits below the median.", "The base and the tornado use the stated median of 17; the percentiles come from the clamped triangle 15.1886 / 15.1886 / 31.0000, whose median sits higher, so one screen mixes two beliefs."]'::jsonb and answer_index = 3 and explanation = 'The base case and the tornado read the stated median while the sample draws from the fitted triangle. When the fit clamps, the fitted median is not the stated one, and only exact false and the fit note warn.' then 'old'
           when prompt = 'A screen prints the narrow opex case as a base of 71.3621 USD/bbl over sample percentiles of 62.0843, 73.1740 and 85.4599, with its opex row flagged fitted at a median of 19.8197. Which belief does each of those numbers answer?' and options = '["The base and the tornado use the stated median of 17 while the percentiles come from the clamped triangle, so one screen mixes two beliefs.", "All of them use the stated belief, since the clamp only changes the note in the insight and never the distribution sampled.", "The base uses the fitted mode of 15.1886 and the percentiles use the stated belief, which is why the base sits below the median.", "All of them stand on the fitted triangle: the base case and the tornado run at its own 10th, 50th and 90th percentiles and the sample draws from it, so the stated median of 17 is used nowhere."]'::jsonb and answer_index = 3 and explanation = 'A clamped fit reports the percentiles it can honour, opex 16.0000 / 19.8197 / 26.0000, and the base case, the tornado and the sample all answer that one belief. Before the 2026-09-15 repair the base read 67.2301 at the stated 17 while the sample drew from the fitted triangle.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 34'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A screen prints the narrow opex case as a base of 71.3621 USD/bbl over sample percentiles of 62.0843, 73.1740 and 85.4599, with its opex row flagged fitted at a median of 19.8197. Which belief does each of those numbers answer?', options = '["The base and the tornado use the stated median of 17 while the percentiles come from the clamped triangle, so one screen mixes two beliefs.", "All of them use the stated belief, since the clamp only changes the note in the insight and never the distribution sampled.", "The base uses the fitted mode of 15.1886 and the percentiles use the stated belief, which is why the base sits below the median.", "All of them stand on the fitted triangle: the base case and the tornado run at its own 10th, 50th and 90th percentiles and the sample draws from it, so the stated median of 17 is used nowhere."]'::jsonb, explanation = 'A clamped fit reports the percentiles it can honour, opex 16.0000 / 19.8197 / 26.0000, and the base case, the tornado and the sample all answer that one belief. Before the 2026-09-15 repair the base read 67.2301 at the stated 17 while the sample drew from the fitted triangle.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 35: prompt, option_0, option_2, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On the narrow opex belief the bars read Total CAPEX -7.0493 and 9.4442, Annual OPEX -1.4602 and 13.2707, Prod. Efficiency -3.5016 and 4.7457. How does opex rank?' and options = '["It ranks last on every sort, since its low side of -1.4602 shows the belief barely moves the price in either direction at all.", "It ranks first on every sort, since a cost charged in every year of the life always outweighs capex that is spent only once.", "It leads a sort by high side and trails both others in a sort by low side; the swing folds both directions into one width.", "It cannot be ranked, since a clamped fit sets exact false and the engine drops that bar from the chart until the belief is widened."]'::jsonb and answer_index = 2 and explanation = 'A step down to 16 barely moves the price and the reach up to 26 moves it a great deal. The bar is as lopsided as the belief 16 / 17 / 26 behind it.' then 'old'
           when prompt = 'A sanction pack sorts the narrow opex case''s tornado three ways, by low side, by high side and by swing. Annual OPEX reads -5.5922 and 9.1387 where Total CAPEX reads -7.0226 and 9.4090. Where does opex land on each of the three?' and options = '["It leads a sort by high side and trails a sort by low side, so the two one-sided sorts disagree and only the swing settles it.", "It ranks first on every sort, since a cost charged in every year of the life always outweighs capex that is spent only once.", "It ranks second on the swing and second on each side, behind Total CAPEX on both.", "It cannot be ranked, since a clamped fit sets exact false and the engine drops that bar from the chart until the belief is widened."]'::jsonb and answer_index = 2 and explanation = 'Both ends and the base stand on the fitted opex belief 16.0000 / 19.8197 / 26.0000, so the bar is no longer lopsided and Total CAPEX leads on the low side, the high side and the swing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 35'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A sanction pack sorts the narrow opex case''s tornado three ways, by low side, by high side and by swing. Annual OPEX reads -5.5922 and 9.1387 where Total CAPEX reads -7.0226 and 9.4090. Where does opex land on each of the three?', options = '["It leads a sort by high side and trails a sort by low side, so the two one-sided sorts disagree and only the swing settles it.", "It ranks first on every sort, since a cost charged in every year of the life always outweighs capex that is spent only once.", "It ranks second on the swing and second on each side, behind Total CAPEX on both.", "It cannot be ranked, since a clamped fit sets exact false and the engine drops that bar from the chart until the belief is widened."]'::jsonb, explanation = 'Both ends and the base stand on the fitted opex belief 16.0000 / 19.8197 / 26.0000, so the bar is no longer lopsided and Total CAPEX leads on the low side, the high side and the swing.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 36: prompt, option_0, option_1, option_2, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'On mc_with_unreachable, whose base breaks even at 498.0372 USD/bbl, the tornado prints every high side as 0.0000 beside low sides of -80.7218, -6.7689 and -26.2125. How should a high side of 0.0000 be read?' and options = '["As a side the engine never placed, finding B1, which is still open: a missing side prints as a zero that looks exactly like an input that does not matter.", "As an input with no upward effect, since at a base this close to the bracket top no input can raise the price any further.", "As a result the repairs made before this course removed, so that on today''s engine a 0.0000 high side means the variable moved the breakeven price by less than a cent.", "As the price capped at the bracket top of 500, reported as a distance of zero because the solve stopped at the edge."]'::jsonb and answer_index = 0 and explanation = 'B1 is not repaired: every high side of mc_with_unreachable still reads 0.0000. The base sits just short of the 500 USD/bbl bracket top, and a zero there is an absence printed as a number.' then 'old'
           when prompt = 'On mc_with_unreachable, whose base breaks even at 498.0372 USD/bbl, the tornado prints a null high side on every bar beside low sides of -80.7218, -6.7689 and -26.2125. How should a null high side be read?' and options = '["As an end the engine could not place below 500 USD/bbl: the bar carries unreachable true, takes no swing, and sorts above every bar with two solved ends.", "As a side whose swing the engine measured to the 500 USD/bbl bracket top, so the bar is drawn at its widest and takes rank 1 on the sort by swing.", "As an input with no upward effect, since at a base this close to the bracket top no input can raise the price any further.", "As a swing of zero, so the bar sorts last under every bar with two solved ends, which is the shape finding B1 described."]'::jsonb and answer_index = 0 and explanation = 'B1 was fixed on 2026-09-15: an end with no breakeven below 500 USD/bbl is null, the bar carries unreachable true and no swing, and those bars sort first, so an absence is no longer printed as a 0.0000 that looks like an input that does not matter.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 36'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On mc_with_unreachable, whose base breaks even at 498.0372 USD/bbl, the tornado prints a null high side on every bar beside low sides of -80.7218, -6.7689 and -26.2125. How should a null high side be read?', options = '["As an end the engine could not place below 500 USD/bbl: the bar carries unreachable true, takes no swing, and sorts above every bar with two solved ends.", "As a side whose swing the engine measured to the 500 USD/bbl bracket top, so the bar is drawn at its widest and takes rank 1 on the sort by swing.", "As an input with no upward effect, since at a base this close to the bracket top no input can raise the price any further.", "As a swing of zero, so the bar sorts last under every bar with two solved ends, which is the shape finding B1 described."]'::jsonb, explanation = 'B1 was fixed on 2026-09-15: an end with no breakeven below 500 USD/bbl is null, the bar carries unreachable true and no swing, and those bars sort first, so an absence is no longer printed as a 0.0000 that looks like an input that does not matter.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 38: prompt
  select case
           when prompt = 'ISIALA''s fitted modes are 168.6738 for capex, 17.4160 for opex and 92.0352 for efficiency. What role do they play in the tornado''s base of 71.6277 USD/bbl?' and options = '["They are the base, since the most likely value of each input gives the most likely breakeven price.", "They set the base for capex and opex, the two right-skewed costs, while efficiency uses its stated median of 91 because its triangle leans the other way from the two costs.", "None: the base is solved at the stated medians, capex 180, opex 20 and efficiency 0.91, and a base built from the modes would solve a different project.", "They move the base whenever the seed changes, because the modes are refitted from each run''s sample."]'::jsonb and answer_index = 2 and explanation = 'The fit exists to pass a triangle through three points for sampling. The base is one solve, unchanged at any seed, and every bar is a distance from it.' then 'old'
           when prompt = 'Each of ISIALA''s three triangles peaks somewhere: 168.6738, 17.4160 and 92.0352. What part do those peaks play in solving the base breakeven of 71.6277 USD/bbl?' and options = '["They are the base, since the most likely value of each input gives the most likely breakeven price.", "They set the base for capex and opex, the two right-skewed costs, while efficiency uses its stated median of 91 because its triangle leans the other way from the two costs.", "None: the base is solved at the stated medians, capex 180, opex 20 and efficiency 0.91, and a base built from the modes would solve a different project.", "They move the base whenever the seed changes, because the modes are refitted from each run''s sample."]'::jsonb and answer_index = 2 and explanation = 'The fit exists to pass a triangle through three points for sampling. The base is one solve, unchanged at any seed, and every bar is a distance from it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 38'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Each of ISIALA''s three triangles peaks somewhere: 168.6738, 17.4160 and 92.0352. What part do those peaks play in solving the base breakeven of 71.6277 USD/bbl?', options = '["They are the base, since the most likely value of each input gives the most likely breakeven price.", "They set the base for capex and opex, the two right-skewed costs, while efficiency uses its stated median of 91 because its triangle leans the other way from the two costs.", "None: the base is solved at the stated medians, capex 180, opex 20 and efficiency 0.91, and a base built from the modes would solve a different project.", "They move the base whenever the seed changes, because the modes are refitted from each run''s sample."]'::jsonb, explanation = 'The fit exists to pass a triangle through three points for sampling. The base is one solve, unchanged at any seed, and every bar is a distance from it.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 40: prompt, option_0, option_1, option_3, explanation KEYED ANSWER TEXT CHANGED
  select case
           when prompt = 'Through the Scenario Builder''s Monte Carlo at seed 20260829 ISIALA''s NPV reads 48.7439, 81.1835 and 109.8980 million USD, while its breakeven run reads 62.1713, 73.3297 and 85.5912 USD/bbl. How do the labels differ?' and options = '["The NPV takes exceedance labels, Low case P90 48.7439 under the key `p10`; the breakeven price takes percentile words, with 85.5912 its 90th percentile.", "Both take exceedance labels under the same definition, so the NPV''s P90 is 109.8980 and the breakeven''s P90 is 85.5912, each read straight off its own `p90` key.", "Both take percentile words, since a 90th percentile means the same thing on a price as it does on an NPV.", "The NPV''s conservative card is 109.8980, as the shipped panel printed it, and the breakeven''s conservative price is 62.1713."]'::jsonb and answer_index = 0 and explanation = 'An NPV is an outcome where more is better, so P90 is its low case; reading P90 off the `p90` key, or labelling a price, is the misuse examined here. Giving the NPV percentile words drops the exceedance label it needs, and the panel that shipped before the repair printed 109.8980 under ''P90 (Conservative)''.' then 'old'
           when prompt = 'Through the Scenario Builder''s Monte Carlo at seed 20260829 ISIALA''s NPV reads 15.6063, 78.5315 and 152.0653 million USD, while its breakeven run reads 62.1713, 73.3297 and 85.5912 USD/bbl. How do the labels differ?' and options = '["The NPV takes exceedance labels, Low case P90 15.6063 under the key `p10`; the breakeven price takes percentile words, with 85.5912 its 90th percentile.", "Both take exceedance labels under the same definition, so the NPV''s P90 is 152.0653 and the breakeven''s P90 is 85.5912, each read straight off its own `p90` key.", "Both take percentile words, since a 90th percentile means the same thing on a price as it does on an NPV.", "The NPV''s conservative card is 152.0653, as the shipped panel printed it, and the breakeven''s conservative price is 62.1713."]'::jsonb and answer_index = 0 and explanation = 'An NPV is an outcome where more is better, so P90 is its low case; reading P90 off the `p90` key, or labelling a price, is the misuse examined here. Giving the NPV percentile words drops the exceedance label it needs, and the panel that shipped before the repair printed 152.0653 under ''P90 (Conservative)''.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 40'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Through the Scenario Builder''s Monte Carlo at seed 20260829 ISIALA''s NPV reads 15.6063, 78.5315 and 152.0653 million USD, while its breakeven run reads 62.1713, 73.3297 and 85.5912 USD/bbl. How do the labels differ?', options = '["The NPV takes exceedance labels, Low case P90 15.6063 under the key `p10`; the breakeven price takes percentile words, with 85.5912 its 90th percentile.", "Both take exceedance labels under the same definition, so the NPV''s P90 is 152.0653 and the breakeven''s P90 is 85.5912, each read straight off its own `p90` key.", "Both take percentile words, since a 90th percentile means the same thing on a price as it does on an NPV.", "The NPV''s conservative card is 152.0653, as the shipped panel printed it, and the breakeven''s conservative price is 62.1713."]'::jsonb, explanation = 'An NPV is an outcome where more is better, so P90 is its low case; reading P90 off the `p90` key, or labelling a price, is the misuse examined here. Giving the NPV percentile words drops the exceedance label it needs, and the panel that shipped before the repair printed 152.0653 under ''P90 (Conservative)''.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ec3i_exam ord 41: prompt, option_0, option_2
  select case
           when prompt = 'On the same 1000 Scenario Builder NPVs for ISIALA, the screening rule gives a 10th percentile of 48.7439 and the breakeven rule gives 48.8335. Which is right?' and options = '["48.8335, since the screening rule''s averaging is a defect the breakeven engine was written to repair.", "Both, by their own definitions: the screening rule averages two neighbours when n x q is whole on an even length, and the breakeven rule takes sorted[min(n - 1, floor(q n))].", "48.7439, since the breakeven rule is only valid for prices and gives a biased percentile on an NPV.", "Neither, since the difference shows the seed was not held fixed between the two readings of the sample."]'::jsonb and answer_index = 1 and explanation = 'At n of 1000, n x 0.1 is 100, a whole number, so the screening rule averages and the breakeven rule reads one sorted value. Two rules live in one module, so a quoted percentile should name its rule.' then 'old'
           when prompt = 'On the same 1000 Scenario Builder NPVs for ISIALA, the screening rule gives a 10th percentile of 15.6063 and the breakeven rule gives 15.6619. Which is right?' and options = '["15.6619, since the screening rule''s averaging is a defect the breakeven engine was written to repair.", "Both, by their own definitions: the screening rule averages two neighbours when n x q is whole on an even length, and the breakeven rule takes sorted[min(n - 1, floor(q n))].", "15.6063, since the breakeven rule is only valid for prices and gives a biased percentile on an NPV.", "Neither, since the difference shows the seed was not held fixed between the two readings of the sample."]'::jsonb and answer_index = 1 and explanation = 'At n of 1000, n x 0.1 is 100, a whole number, so the screening rule averages and the breakeven rule reads one sorted value. Two rules live in one module, so a quoted percentile should name its rule.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'EC3 recut refused: no row for ec3i_exam ord 41'; end if;
  if v_state = 'other' then raise exception 'EC3 recut refused: ec3i_exam ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'On the same 1000 Scenario Builder NPVs for ISIALA, the screening rule gives a 10th percentile of 15.6063 and the breakeven rule gives 15.6619. Which is right?', options = '["15.6619, since the screening rule''s averaging is a defect the breakeven engine was written to repair.", "Both, by their own definitions: the screening rule averages two neighbours when n x q is whole on an even length, and the breakeven rule takes sorted[min(n - 1, floor(q n))].", "15.6063, since the breakeven rule is only valid for prices and gives a biased percentile on an NPV.", "Neither, since the difference shows the seed was not held fixed between the two readings of the sample."]'::jsonb, explanation = 'At n of 1000, n x 0.1 is 100, a whole number, so the screening rule averages and the breakeven rule reads one sorted value. Two rules live in one module, so a quoted percentile should name its rule.'
     where app_slug = 'uncertainty' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'EC3 recut refused: ec3i_exam ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the count assertions --
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'beginner';
  if v_count <> 132 then raise exception 'EC3 recut refused: beginner holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'intermediate';
  if v_count <> 132 then raise exception 'EC3 recut refused: intermediate holds % questions, expected 132', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced';
  if v_count <> 132 then raise exception 'EC3 recut refused: advanced holds % questions, expected 132', v_count; end if;

  raise notice 'EC3 recut intermediate: % of 23 rows rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
-- Every row this file addresses, as it now stands.
with changed (scope, module_key, ord) as (
  values
    ('module', 'm01-percentiles-are-not-endpoints', 11),
    ('module', 'm01-percentiles-are-not-endpoints', 12),
    ('module', 'm04-reading-the-sample', 8),
    ('module', 'm04-reading-the-sample', 9),
    ('module', 'm05-the-two-sided-tornado', 6),
    ('module', 'm05-the-two-sided-tornado', 7),
    ('module', 'm05-the-two-sided-tornado', 12),
    ('module', 'm06-the-professional-reading', 3),
    ('module', 'm06-the-professional-reading', 14),
    ('final', null::text, 5),
    ('final', null::text, 8),
    ('final', null::text, 10),
    ('final', null::text, 13),
    ('final', null::text, 17),
    ('final', null::text, 25),
    ('final', null::text, 27),
    ('final', null::text, 29),
    ('final', null::text, 34),
    ('final', null::text, 35),
    ('final', null::text, 36),
    ('final', null::text, 38),
    ('final', null::text, 40),
    ('final', null::text, 41)
)
select 'ec3 recut intermediate' as migration,
       c.scope,
       coalesce(c.module_key, '(final exam)') as bank,
       c.ord,
       left(q.prompt, 64) as prompt_head,
       md5(q.prompt || q.options::text || q.answer_index::text || q.explanation) as row_digest
  from changed c
  join public.academy_quiz_questions q
    on q.app_slug = 'uncertainty' and q.tier = 'intermediate'
   and q.scope = c.scope and q.module_key is not distinct from c.module_key and q.ord = c.ord
 order by c.scope desc, c.module_key nulls last, c.ord;

select 'ec3 recut intermediate' as migration, scope,
       coalesce(module_key, '(final exam)') as bank, count(*) as questions
  from public.academy_quiz_questions
 where app_slug = 'uncertainty' and tier = 'intermediate'
 group by scope, module_key
 order by scope desc, module_key nulls last;
