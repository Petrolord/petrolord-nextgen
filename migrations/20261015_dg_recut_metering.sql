-- ==========================================================================
-- DIGEST-COPY RECUT: metering, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/metering, built from its committed .py sources.
-- Rows: 30 (beginner 10, intermediate 7, advanced 13).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-metering.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 11
  select case
           when prompt = 'Two cells of the coefficient sweep bound the span the digest prints. What is the difference between them and what is their ratio?' and options = '["A difference of 0.072666 and a ratio of 1.122048.", "A difference of 0.084375 and a ratio of 1.092173.", "A difference of 0.000036 and a ratio of 0.999941.", "A difference of 34.203954 and a ratio of 2.186003."]'::jsonb and answer_index = 0 and explanation is not distinct from '0.668050 against 0.595385, both at beta 0.750000, which is why only the Reynolds number changed between them.' then 'old'
           when prompt = 'Two cells of the coefficient sweep bound the span the course prints. What is the difference between them and what is their ratio?' and options = '["A difference of 0.072666 and a ratio of 1.122048.", "A difference of 0.084375 and a ratio of 1.092173.", "A difference of 0.000036 and a ratio of 0.999941.", "A difference of 34.203954 and a ratio of 2.186003."]'::jsonb and answer_index = 0 and explanation is not distinct from '0.668050 against 0.595385, both at beta 0.750000, which is why only the Reynolds number changed between them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner final ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner final ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Two cells of the coefficient sweep bound the span the course prints. What is the difference between them and what is their ratio?', options = '["A difference of 0.072666 and a ratio of 1.122048.", "A difference of 0.084375 and a ratio of 1.092173.", "A difference of 0.000036 and a ratio of 0.999941.", "A difference of 34.203954 and a ratio of 2.186003."]'::jsonb, explanation = '0.668050 against 0.595385, both at beta 0.750000, which is why only the Reynolds number changed between them.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner final ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 16
  select case
           when prompt = 'At what beta does the digest show the extrapolation warning firing?' and options = '["0.950", "0.841", "0.800000", "0.750000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The message names the beta it was asked about and the 0.1 to 0.75 band it sits outside, which is what makes it specific to the run.' then 'old'
           when prompt = 'At what beta does the course show the extrapolation warning firing?' and options = '["0.950", "0.841", "0.800000", "0.750000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The message names the beta it was asked about and the 0.1 to 0.75 band it sits outside, which is what makes it specific to the run.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner final ord 16'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner final ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At what beta does the course show the extrapolation warning firing?', options = '["0.950", "0.841", "0.800000", "0.750000"]'::jsonb, explanation = 'The message names the beta it was asked about and the 0.1 to 0.75 band it sits outside, which is what makes it specific to the run.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner final ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 17
  select case
           when prompt = 'What are the two ends of the expansibility span the digest prints?' and options = '["0.999779 at dP/P1 0.001000 with k 1.1, and 0.915403 at dP/P1 0.250000 with k 1.66, since the factor falls as the specific heat ratio rises.", "0.999181 at the ABOH conditions, and 0.915403 at the bottom corner of the sweep.", "0.999779 at dP/P1 0.001000 with k 1.66, and 0.915403 at dP/P1 0.250000 with k 1.1.", "0.999737 and 0.941507, which are the two ends of the row the ABOH specific heat ratio of 1.270000 falls between."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The two cells differ in both coordinates, so the difference of 0.084375 and the ratio of 1.092173 are a span across the table.' then 'old'
           when prompt = 'What are the two ends of the expansibility span the course prints?' and options = '["0.999779 at dP/P1 0.001000 with k 1.1, and 0.915403 at dP/P1 0.250000 with k 1.66, since the factor falls as the specific heat ratio rises.", "0.999181 at the ABOH conditions, and 0.915403 at the bottom corner of the sweep.", "0.999779 at dP/P1 0.001000 with k 1.66, and 0.915403 at dP/P1 0.250000 with k 1.1.", "0.999737 and 0.941507, which are the two ends of the row the ABOH specific heat ratio of 1.270000 falls between."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The two cells differ in both coordinates, so the difference of 0.084375 and the ratio of 1.092173 are a span across the table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What are the two ends of the expansibility span the course prints?', options = '["0.999779 at dP/P1 0.001000 with k 1.1, and 0.915403 at dP/P1 0.250000 with k 1.66, since the factor falls as the specific heat ratio rises.", "0.999181 at the ABOH conditions, and 0.915403 at the bottom corner of the sweep.", "0.999779 at dP/P1 0.001000 with k 1.66, and 0.915403 at dP/P1 0.250000 with k 1.1.", "0.999737 and 0.941507, which are the two ends of the row the ABOH specific heat ratio of 1.270000 falls between."]'::jsonb, explanation = 'The two cells differ in both coordinates, so the difference of 0.084375 and the ratio of 1.092173 are a span across the table.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-discharge-coefficient ord 6
  select case
           when prompt = 'What is the only statement the digest licenses about the size of the small bore step in the coefficient?' and options = '["That the step is small enough at every beta and every Reynolds number to be left out of an ordinary flow calculation without any consequence for the answer.", "That the correction raises the coefficient, since an extra term in the equation can only add to it.", "That at beta 0.500000 and Reynolds 1e+6 the coefficient is 0.603040 where the correction is applied and 0.603075 where it is not, a difference of -0.000036 and a ratio of 0.999941.", "That the step is smaller than the span of the coefficient across the published cells."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That comparison was computed at one beta and one Reynolds number, and it is the only statement about the size of this step available.' then 'old'
           when prompt = 'What is the only statement the course licenses about the size of the small bore step in the coefficient?' and options = '["That the step is small enough at every beta and every Reynolds number to be left out of an ordinary flow calculation without any consequence for the answer.", "That the correction raises the coefficient, since an extra term in the equation can only add to it.", "That at beta 0.500000 and Reynolds 1e+6 the coefficient is 0.603040 where the correction is applied and 0.603075 where it is not, a difference of -0.000036 and a ratio of 0.999941.", "That the step is smaller than the span of the coefficient across the published cells."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That comparison was computed at one beta and one Reynolds number, and it is the only statement about the size of this step available.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-discharge-coefficient' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m02-the-discharge-coefficient ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m02-the-discharge-coefficient ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What is the only statement the course licenses about the size of the small bore step in the coefficient?', options = '["That the step is small enough at every beta and every Reynolds number to be left out of an ordinary flow calculation without any consequence for the answer.", "That the correction raises the coefficient, since an extra term in the equation can only add to it.", "That at beta 0.500000 and Reynolds 1e+6 the coefficient is 0.603040 where the correction is applied and 0.603075 where it is not, a difference of -0.000036 and a ratio of 0.999941.", "That the step is smaller than the span of the coefficient across the published cells."]'::jsonb, explanation = 'That comparison was computed at one beta and one Reynolds number, and it is the only statement about the size of this step available.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-discharge-coefficient' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m02-the-discharge-coefficient ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-permanent-loss-turbines-and-straight-run ord 2
  select case
           when prompt = 'What does the digest print about the permanent loss at the two ends of the published beta range?' and options = '["63.043643 in H2O at beta 0.100000 against 35.079209 in H2O at beta 0.670000, which are the two ends of the range the flange-tap correlation is published over.", "0.988145 against 0.452033, which are the loss fractions at the two ends and are the figures a loss comparison has to be made in because the inches of water carry the differential with them.", "63.043643 in H2O at beta 0.100000 against 28.839688 in H2O at beta 0.750000, a difference of 34.203954 and a ratio of 2.186003.", "That the loss falls by about half across the range, which is the comparison the table was built to support."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That RELATION is computed at the ABOH differential across the ends of the published range, and it is the comparison available on this table.' then 'old'
           when prompt = 'What does the course print about the permanent loss at the two ends of the published beta range?' and options = '["63.043643 in H2O at beta 0.100000 against 35.079209 in H2O at beta 0.670000, which are the two ends of the range the flange-tap correlation is published over.", "0.988145 against 0.452033, which are the loss fractions at the two ends and are the figures a loss comparison has to be made in because the inches of water carry the differential with them.", "63.043643 in H2O at beta 0.100000 against 28.839688 in H2O at beta 0.750000, a difference of 34.203954 and a ratio of 2.186003.", "That the loss falls by about half across the range, which is the comparison the table was built to support."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That RELATION is computed at the ABOH differential across the ends of the published range, and it is the comparison available on this table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-permanent-loss-turbines-and-straight-run' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m04-permanent-loss-turbines-and-straight-run ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m04-permanent-loss-turbines-and-straight-run ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print about the permanent loss at the two ends of the published beta range?', options = '["63.043643 in H2O at beta 0.100000 against 35.079209 in H2O at beta 0.670000, which are the two ends of the range the flange-tap correlation is published over.", "0.988145 against 0.452033, which are the loss fractions at the two ends and are the figures a loss comparison has to be made in because the inches of water carry the differential with them.", "63.043643 in H2O at beta 0.100000 against 28.839688 in H2O at beta 0.750000, a difference of 34.203954 and a ratio of 2.186003.", "That the loss falls by about half across the range, which is the comparison the table was built to support."]'::jsonb, explanation = 'That RELATION is computed at the ABOH differential across the ends of the published range, and it is the comparison available on this table.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-permanent-loss-turbines-and-straight-run' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m04-permanent-loss-turbines-and-straight-run ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-permanent-loss-turbines-and-straight-run ord 4
  select case
           when prompt = 'The loss on the ABOH run was computed twice, once with the run''s own coefficient of 0.602223 and once with an assumed 0.610000. What came out?' and options = '["47.865230 in H2O against 46.794924 in H2O, which is the loss table row at beta 0.500000 and is what an assumed coefficient lands on.", "The engine refused the second calculation, so only the figure with the run''s own coefficient exists and the cost of the assumption cannot be printed at all.", "A difference of 0.072666, which is the span of the coefficient across the published cells carried into the loss.", "47.865230 in H2O with the run''s own coefficient against 47.689171 in H2O with the assumed one, a difference of 0.176059 and a ratio of 1.003692."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine itself refuses to assume a coefficient. The digest performed the second calculation deliberately so that the cost of the assumption is printed rather than asserted.' then 'old'
           when prompt = 'The loss on the ABOH run was computed twice, once with the run''s own coefficient of 0.602223 and once with an assumed 0.610000. What came out?' and options = '["47.865230 in H2O against 46.794924 in H2O, which is the loss table row at beta 0.500000 and is what an assumed coefficient lands on.", "The engine refused the second calculation, so only the figure with the run''s own coefficient exists and the cost of the assumption cannot be printed at all.", "A difference of 0.072666, which is the span of the coefficient across the published cells carried into the loss.", "47.865230 in H2O with the run''s own coefficient against 47.689171 in H2O with the assumed one, a difference of 0.176059 and a ratio of 1.003692."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine itself refuses to assume a coefficient. The course performed the second calculation deliberately so that the cost of the assumption is printed rather than asserted.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-permanent-loss-turbines-and-straight-run' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m04-permanent-loss-turbines-and-straight-run ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m04-permanent-loss-turbines-and-straight-run ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The loss on the ABOH run was computed twice, once with the run''s own coefficient of 0.602223 and once with an assumed 0.610000. What came out?', options = '["47.865230 in H2O against 46.794924 in H2O, which is the loss table row at beta 0.500000 and is what an assumed coefficient lands on.", "The engine refused the second calculation, so only the figure with the run''s own coefficient exists and the cost of the assumption cannot be printed at all.", "A difference of 0.072666, which is the span of the coefficient across the published cells carried into the loss.", "47.865230 in H2O with the run''s own coefficient against 47.689171 in H2O with the assumed one, a difference of 0.176059 and a ratio of 1.003692."]'::jsonb, explanation = 'The engine itself refuses to assume a coefficient. The course performed the second calculation deliberately so that the cost of the assumption is printed rather than asserted.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-permanent-loss-turbines-and-straight-run' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m04-permanent-loss-turbines-and-straight-run ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-the-transmitter-and-turndown ord 2
  select case
           when prompt = 'What does the digest print for the transmitter contribution at the top and the bottom of this span?' and options = '["0.075000 percent of reading at a reading of 200.000000 in H2O against 7.500000 percent at a reading of 2.000000 in H2O, a difference of -7.425000 and a ratio of 0.010000.", "0.075000 percent at 200.000000 in H2O against 3.000000 percent at 5.000000 in H2O, which are the two rows the engine holds its limits at.", "0.235110 percent at 63.800000 in H2O against 7.500000 percent at 2.000000 in H2O, which is the span from the design reading down.", "That the contribution rises by roughly a factor of ten for every tenfold fall in the reading, which is the shape of the column."]'::jsonb and answer_index = 0 and explanation is not distinct from 'That RELATION is the comparison available on this span, and anything else about the shape of the column would be arithmetic done by the reader.' then 'old'
           when prompt = 'What does the course print for the transmitter contribution at the top and the bottom of this span?' and options = '["0.075000 percent of reading at a reading of 200.000000 in H2O against 7.500000 percent at a reading of 2.000000 in H2O, a difference of -7.425000 and a ratio of 0.010000.", "0.075000 percent at 200.000000 in H2O against 3.000000 percent at 5.000000 in H2O, which are the two rows the engine holds its limits at.", "0.235110 percent at 63.800000 in H2O against 7.500000 percent at 2.000000 in H2O, which is the span from the design reading down.", "That the contribution rises by roughly a factor of ten for every tenfold fall in the reading, which is the shape of the column."]'::jsonb and answer_index = 0 and explanation is not distinct from 'That RELATION is the comparison available on this span, and anything else about the shape of the column would be arithmetic done by the reader.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-transmitter-and-turndown' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m05-the-transmitter-and-turndown ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m05-the-transmitter-and-turndown ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print for the transmitter contribution at the top and the bottom of this span?', options = '["0.075000 percent of reading at a reading of 200.000000 in H2O against 7.500000 percent at a reading of 2.000000 in H2O, a difference of -7.425000 and a ratio of 0.010000.", "0.075000 percent at 200.000000 in H2O against 3.000000 percent at 5.000000 in H2O, which are the two rows the engine holds its limits at.", "0.235110 percent at 63.800000 in H2O against 7.500000 percent at 2.000000 in H2O, which is the span from the design reading down.", "That the contribution rises by roughly a factor of ten for every tenfold fall in the reading, which is the shape of the column."]'::jsonb, explanation = 'That RELATION is the comparison available on this span, and anything else about the shape of the column would be arithmetic done by the reader.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-transmitter-and-turndown' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m05-the-transmitter-and-turndown ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-the-transmitter-and-turndown ord 7
  select case
           when prompt = 'The engine holds two turndown limits. What are they, and what is the relationship the digest prints between them?' and options = '["A flow turndown limit of 9.000000 and a differential turndown limit of 3.000000, a difference of 6.000000 and a ratio of 3.000000, because the differential is the quantity that moves less.", "A flow turndown limit of 3.000000 and a differential turndown limit of 9.000000, a difference of 6.000000 and a ratio of 3.000000.", "A single limit of 3.000000 applied to whichever turndown the caller asks for.", "A flow limit of 3.000000 and a differential limit of 9.000000, with no relationship printed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'They are the same rule written in two quantities, and the digest prints the relationship rather than leaving a reader to work it out.' then 'old'
           when prompt = 'The engine holds two turndown limits. What are they, and what is the relationship the course prints between them?' and options = '["A flow turndown limit of 9.000000 and a differential turndown limit of 3.000000, a difference of 6.000000 and a ratio of 3.000000, because the differential is the quantity that moves less.", "A flow turndown limit of 3.000000 and a differential turndown limit of 9.000000, a difference of 6.000000 and a ratio of 3.000000.", "A single limit of 3.000000 applied to whichever turndown the caller asks for.", "A flow limit of 3.000000 and a differential limit of 9.000000, with no relationship printed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'They are the same rule written in two quantities, and the course prints the relationship rather than leaving a reader to work it out.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-transmitter-and-turndown' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m05-the-transmitter-and-turndown ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m05-the-transmitter-and-turndown ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine holds two turndown limits. What are they, and what is the relationship the course prints between them?', options = '["A flow turndown limit of 9.000000 and a differential turndown limit of 3.000000, a difference of 6.000000 and a ratio of 3.000000, because the differential is the quantity that moves less.", "A flow turndown limit of 3.000000 and a differential turndown limit of 9.000000, a difference of 6.000000 and a ratio of 3.000000.", "A single limit of 3.000000 applied to whichever turndown the caller asks for.", "A flow limit of 3.000000 and a differential limit of 9.000000, with no relationship printed."]'::jsonb, explanation = 'They are the same rule written in two quantities, and the course prints the relationship rather than leaving a reader to work it out.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-the-transmitter-and-turndown' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m05-the-transmitter-and-turndown ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-uncertainty-budget ord 6
  select case
           when prompt = 'What does the digest print about the two largest shares of the variance on the ABOH run at its design reading?' and options = '["The discharge coefficient at 74.045614 percent against expansibility at 11.847298 percent, a difference of 62.198316 and a ratio of 6.250000.", "The discharge coefficient at 74.045614 percent against density at 6.664105 percent, which are the two terms the engine names on that run.", "The discharge coefficient at 0.500000 percent against density at 0.300000 percent, which are contributions rather than shares.", "That the discharge coefficient carries about three quarters of the variance, which is the comparison the budget was built to support."]'::jsonb and answer_index = 0 and explanation is not distinct from 'That RELATION is between the two largest shares of the variance, and the engine names the discharge coefficient as dominant and expansibility as the runner up.' then 'old'
           when prompt = 'What does the course print about the two largest shares of the variance on the ABOH run at its design reading?' and options = '["The discharge coefficient at 74.045614 percent against expansibility at 11.847298 percent, a difference of 62.198316 and a ratio of 6.250000.", "The discharge coefficient at 74.045614 percent against density at 6.664105 percent, which are the two terms the engine names on that run.", "The discharge coefficient at 0.500000 percent against density at 0.300000 percent, which are contributions rather than shares.", "That the discharge coefficient carries about three quarters of the variance, which is the comparison the budget was built to support."]'::jsonb and answer_index = 0 and explanation is not distinct from 'That RELATION is between the two largest shares of the variance, and the engine names the discharge coefficient as dominant and expansibility as the runner up.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-uncertainty-budget' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m06-the-uncertainty-budget ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m06-the-uncertainty-budget ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print about the two largest shares of the variance on the ABOH run at its design reading?', options = '["The discharge coefficient at 74.045614 percent against expansibility at 11.847298 percent, a difference of 62.198316 and a ratio of 6.250000.", "The discharge coefficient at 74.045614 percent against density at 6.664105 percent, which are the two terms the engine names on that run.", "The discharge coefficient at 0.500000 percent against density at 0.300000 percent, which are contributions rather than shares.", "That the discharge coefficient carries about three quarters of the variance, which is the comparison the budget was built to support."]'::jsonb, explanation = 'That RELATION is between the two largest shares of the variance, and the engine names the discharge coefficient as dominant and expansibility as the runner up.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-uncertainty-budget' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m06-the-uncertainty-budget ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-uncertainty-budget ord 15
  select case
           when prompt = 'On the ABOH run at its design reading the lead is clear, and the digest records where that stops being true. Where?' and options = '["At a reading of 16.862007 in H2O.", "At a reading of 15.000000 in H2O, which is the same reading the name changes at.", "At a reading of 16.000000 in H2O, where the flow turndown reaches 3.651484 and the name changes.", "At a reading of 22.222222 in H2O, where the transmitter warning starts."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Between that reading and the reading where the name changes, the engine still names a dominant term while telling you the name is not worth much.' then 'old'
           when prompt = 'On the ABOH run at its design reading the lead is clear, and the course records where that stops being true. Where?' and options = '["At a reading of 16.862007 in H2O.", "At a reading of 15.000000 in H2O, which is the same reading the name changes at.", "At a reading of 16.000000 in H2O, where the flow turndown reaches 3.651484 and the name changes.", "At a reading of 22.222222 in H2O, where the transmitter warning starts."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Between that reading and the reading where the name changes, the engine still names a dominant term while telling you the name is not worth much.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-uncertainty-budget' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for beginner m06-the-uncertainty-budget ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: beginner m06-the-uncertainty-budget ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the ABOH run at its design reading the lead is clear, and the course records where that stops being true. Where?', options = '["At a reading of 16.862007 in H2O.", "At a reading of 15.000000 in H2O, which is the same reading the name changes at.", "At a reading of 16.000000 in H2O, where the flow turndown reaches 3.651484 and the name changes.", "At a reading of 22.222222 in H2O, where the transmitter warning starts."]'::jsonb, explanation = 'Between that reading and the reading where the name changes, the engine still names a dominant term while telling you the name is not worth much.'
     where app_slug = 'metering' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-uncertainty-budget' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: beginner m06-the-uncertainty-budget ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 11
  select case
           when prompt = 'What pressures does the digest state for the flashing case?' and options = '["An outlet pressure of 28.740000 psia against a vapour pressure of 26.740000 psia.", "An outlet pressure of 20.000000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 20.000000 psia."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine returns flashing true and the regime word flashing on that case, and it turns the flag on at exactly the stated vapour pressure.' then 'old'
           when prompt = 'What pressures does the course state for the flashing case?' and options = '["An outlet pressure of 28.740000 psia against a vapour pressure of 26.740000 psia.", "An outlet pressure of 20.000000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 20.000000 psia."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine returns flashing true and the regime word flashing on that case, and it turns the flag on at exactly the stated vapour pressure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate final ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate final ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What pressures does the course state for the flashing case?', options = '["An outlet pressure of 28.740000 psia against a vapour pressure of 26.740000 psia.", "An outlet pressure of 20.000000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 28.740000 psia.", "An outlet pressure of 26.740000 psia against a vapour pressure of 20.000000 psia."]'::jsonb, explanation = 'The engine returns flashing true and the regime word flashing on that case, and it turns the flag on at exactly the stated vapour pressure.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate final ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 20
  select case
           when prompt = 'What does the engine say about whether its pressure recovery factors are cited?' and options = '["They are cited to the sizing standard the coefficients are defined in.", "They are cited to the vendor catalogues the styles were averaged from.", "They are cited in the module''s own source comments, which the digest quotes.", "They are not cited to a document in this repository."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Following them back to a published source from here is not possible, which is what a reader has to know before quoting one in a calculation.' then 'old'
           when prompt = 'What does the engine say about whether its pressure recovery factors are cited?' and options = '["They are cited to the sizing standard the coefficients are defined in.", "They are cited to the vendor catalogues the styles were averaged from.", "They are cited in the module''s own source comments, which the course quotes.", "They are not cited to a document in this repository."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Following them back to a published source from here is not possible, which is what a reader has to know before quoting one in a calculation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the engine say about whether its pressure recovery factors are cited?', options = '["They are cited to the sizing standard the coefficients are defined in.", "They are cited to the vendor catalogues the styles were averaged from.", "They are cited in the module''s own source comments, which the course quotes.", "They are not cited to a document in this repository."]'::jsonb, explanation = 'Following them back to a published source from here is not possible, which is what a reader has to know before quoting one in a calculation.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 33
  select case
           when prompt = 'Which of the three probes did the engine leave where the pressure ratio had put it?' and options = '["The one scfh bleed at a pressure ratio near twelve.", "The hundred million scfh at a pressure ratio near two.", "The moderate station flow at a pressure ratio near six.", "None of them, since the stream power moved all three."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Its ratio band and its final band both read high, so nothing was moved on it and the digest prints no reason to look further.' then 'old'
           when prompt = 'Which of the three probes did the engine leave where the pressure ratio had put it?' and options = '["The one scfh bleed at a pressure ratio near twelve.", "The hundred million scfh at a pressure ratio near two.", "The moderate station flow at a pressure ratio near six.", "None of them, since the stream power moved all three."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Its ratio band and its final band both read high, so nothing was moved on it and the course prints no reason to look further.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of the three probes did the engine leave where the pressure ratio had put it?', options = '["The one scfh bleed at a pressure ratio near twelve.", "The hundred million scfh at a pressure ratio near two.", "The moderate station flow at a pressure ratio near six.", "None of them, since the stream power moved all three."]'::jsonb, explanation = 'Its ratio band and its final band both read high, so nothing was moved on it and the course prints no reason to look further.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-cavitation-and-the-screen ord 9
  select case
           when prompt = 'The engine exports the two sigma values its regime ladder turns on. What does the digest say about where those two values come from?' and options = '["They are read from the published source the recovery factors come from.", "They are derived from the critical pressure ratio factor of the fluid.", "Both belong to this engine, which exports them so that a reader can see what decided the word.", "They are fitted to the marched valve and so belong to that service rather than to the engine."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine exports them so that a reader can see exactly what decided the word on the screen, and this course grades no regime word as a result.' then 'old'
           when prompt = 'The engine exports the two sigma values its regime ladder turns on. What does the course say about where those two values come from?' and options = '["They are read from the published source the recovery factors come from.", "They are derived from the critical pressure ratio factor of the fluid.", "Both belong to this engine, which exports them so that a reader can see what decided the word.", "They are fitted to the marched valve and so belong to that service rather than to the engine."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine exports them so that a reader can see exactly what decided the word on the screen, and this course grades no regime word as a result.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cavitation-and-the-screen' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate m02-cavitation-and-the-screen ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate m02-cavitation-and-the-screen ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine exports the two sigma values its regime ladder turns on. What does the course say about where those two values come from?', options = '["They are read from the published source the recovery factors come from.", "They are derived from the critical pressure ratio factor of the fluid.", "Both belong to this engine, which exports them so that a reader can see what decided the word.", "They are fitted to the marched valve and so belong to that service rather than to the engine."]'::jsonb, explanation = 'The engine exports them so that a reader can see exactly what decided the word on the screen, and this course grades no regime word as a result.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cavitation-and-the-screen' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate m02-cavitation-and-the-screen ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-cavitation-and-the-screen ord 13
  select case
           when prompt = 'What does the digest print about the outlet pressure at which the flashing flag turns on, set against the stated vapour pressure?' and options = '["A difference of 2.000000 and a ratio of 1.074452, which is the margin the engine leaves before the flag turns on.", "A difference of 0.000000 and a ratio of 0.892161, the fluid''s own critical pressure ratio factor.", "A difference, the first less the second, of 0.000000 and a ratio, the first over the second, of 1.000000.", "No comparison at all, because the engine reports the flag rather than the pressure at which it turned over."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That is as clean a boundary as this course carries. The engine turns the flag on at exactly the vapour pressure, which makes the test the physical statement it appears to be.' then 'old'
           when prompt = 'What does the course print about the outlet pressure at which the flashing flag turns on, set against the stated vapour pressure?' and options = '["A difference of 2.000000 and a ratio of 1.074452, which is the margin the engine leaves before the flag turns on.", "A difference of 0.000000 and a ratio of 0.892161, the fluid''s own critical pressure ratio factor.", "A difference, the first less the second, of 0.000000 and a ratio, the first over the second, of 1.000000.", "No comparison at all, because the engine reports the flag rather than the pressure at which it turned over."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That is as clean a boundary as this course carries. The engine turns the flag on at exactly the vapour pressure, which makes the test the physical statement it appears to be.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cavitation-and-the-screen' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate m02-cavitation-and-the-screen ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate m02-cavitation-and-the-screen ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print about the outlet pressure at which the flashing flag turns on, set against the stated vapour pressure?', options = '["A difference of 2.000000 and a ratio of 1.074452, which is the margin the engine leaves before the flag turns on.", "A difference of 0.000000 and a ratio of 0.892161, the fluid''s own critical pressure ratio factor.", "A difference, the first less the second, of 0.000000 and a ratio, the first over the second, of 1.000000.", "No comparison at all, because the engine reports the flag rather than the pressure at which it turned over."]'::jsonb, explanation = 'That is as clean a boundary as this course carries. The engine turns the flag on at exactly the vapour pressure, which makes the test the physical statement it appears to be.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-cavitation-and-the-screen' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate m02-cavitation-and-the-screen ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-authority-and-the-characteristic ord 3
  select case
           when prompt = 'On that same 120.000000 psi system the valve is given 70.000000 psi. What is the authority?' and options = '["0.708333", "0.833333", "0.458333", "0.583333"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Seven valve drops are run against one total in the digest, and this rung is the fifth of them.' then 'old'
           when prompt = 'On that same 120.000000 psi system the valve is given 70.000000 psi. What is the authority?' and options = '["0.708333", "0.833333", "0.458333", "0.583333"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Seven valve drops are run against one total in the course, and this rung is the fifth of them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-authority-and-the-characteristic' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate m04-authority-and-the-characteristic ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate m04-authority-and-the-characteristic ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On that same 120.000000 psi system the valve is given 70.000000 psi. What is the authority?', options = '["0.708333", "0.833333", "0.458333", "0.583333"]'::jsonb, explanation = 'Seven valve drops are run against one total in the course, and this rung is the fifth of them.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-authority-and-the-characteristic' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate m04-authority-and-the-characteristic ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-travel-rangeability-and-the-verdict ord 7
  select case
           when prompt = 'The digest sets those two travels against each other. What ratio does it print, the first over the second?' and options = '["1.021201", "1.074452", "1.763636", "2.007880"]'::jsonb and answer_index = 3 and explanation is not distinct from 'It prints 37.515548 for the difference of the first less the second on the same line. Computed and printed is what allows a comparison to be quoted at all.' then 'old'
           when prompt = 'The course sets those two travels against each other. What ratio does it print, the first over the second?' and options = '["1.021201", "1.074452", "1.763636", "2.007880"]'::jsonb and answer_index = 3 and explanation is not distinct from 'It prints 37.515548 for the difference of the first less the second on the same line. Computed and printed is what allows a comparison to be quoted at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-travel-rangeability-and-the-verdict' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for intermediate m06-travel-rangeability-and-the-verdict ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: intermediate m06-travel-rangeability-and-the-verdict ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course sets those two travels against each other. What ratio does it print, the first over the second?', options = '["1.021201", "1.074452", "1.763636", "2.007880"]'::jsonb, explanation = 'It prints 37.515548 for the difference of the first less the second on the same line. Computed and printed is what allows a comparison to be quoted at all.'
     where app_slug = 'metering' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-travel-rangeability-and-the-verdict' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: intermediate m06-travel-rangeability-and-the-verdict ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 16
  select case
           when prompt = 'What would it take for this digest to print a row labelled a refusal under numbers from a call that actually succeeded?' and options = '["A rebuild in another timezone, which is the drift the reproducibility check over five timezones and four locales exists to catch.", "A count whose tree and rule disagreed, which is the check that stands between a label and the evidence printed under it.", "An engine whose message had been reworded, since the pinned strings are what tie a labelled row to the call that produced it.", "Nothing would print at all, because the file is not written if any label disagrees with its call."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A numeric sweep cannot see that defect, because every figure under the false sentence would be real engine output.' then 'old'
           when prompt = 'What would it take for this course to print a row labelled a refusal under numbers from a call that actually succeeded?' and options = '["A rebuild in another timezone, which is the drift the reproducibility check over five timezones and four locales exists to catch.", "A count whose tree and rule disagreed, which is the check that stands between a label and the evidence printed under it.", "An engine whose message had been reworded, since the pinned strings are what tie a labelled row to the call that produced it.", "Nothing would print at all, because the file is not written if any label disagrees with its call."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A numeric sweep cannot see that defect, because every figure under the false sentence would be real engine output.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced final ord 16'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced final ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What would it take for this course to print a row labelled a refusal under numbers from a call that actually succeeded?', options = '["A rebuild in another timezone, which is the drift the reproducibility check over five timezones and four locales exists to catch.", "A count whose tree and rule disagreed, which is the check that stands between a label and the evidence printed under it.", "An engine whose message had been reworded, since the pinned strings are what tie a labelled row to the call that produced it.", "Nothing would print at all, because the file is not written if any label disagrees with its call."]'::jsonb, explanation = 'A numeric sweep cannot see that defect, because every figure under the false sentence would be real engine output.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced final ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-tank-and-its-geometry ord 6
  select case
           when prompt = 'The digest prints a relation between the two capacities of this tank. What does it actually give a writer permission to say?' and options = '["That the working capacity is the larger of the two by 762.5522 bbl, which is the difference printed as the first value less the second.", "That the ratio of 1.040462 is the working capacity over the nominal, so the working figure is what the line divides by.", "That the gap is small enough to ignore in a screening calculation, which is the judgement the line supports.", "That the difference is 762.5522 bbl and the ratio is 1.040462, because the relation line carries both values, their difference and their ratio."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The relation names the nominal at 19608.4845 bbl first and the working at 18845.9323 bbl second, so the difference of 762.5522 and the ratio of 1.040462 both run in that order.' then 'old'
           when prompt = 'The course prints a relation between the two capacities of this tank. What does it actually give a writer permission to say?' and options = '["That the working capacity is the larger of the two by 762.5522 bbl, which is the difference printed as the first value less the second.", "That the ratio of 1.040462 is the working capacity over the nominal, so the working figure is what the line divides by.", "That the gap is small enough to ignore in a screening calculation, which is the judgement the line supports.", "That the difference is 762.5522 bbl and the ratio is 1.040462, because the relation line carries both values, their difference and their ratio."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The relation names the nominal at 19608.4845 bbl first and the working at 18845.9323 bbl second, so the difference of 762.5522 and the ratio of 1.040462 both run in that order.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-tank-and-its-geometry' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m01-the-tank-and-its-geometry ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m01-the-tank-and-its-geometry ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a relation between the two capacities of this tank. What does it actually give a writer permission to say?', options = '["That the working capacity is the larger of the two by 762.5522 bbl, which is the difference printed as the first value less the second.", "That the ratio of 1.040462 is the working capacity over the nominal, so the working figure is what the line divides by.", "That the gap is small enough to ignore in a screening calculation, which is the judgement the line supports.", "That the difference is 762.5522 bbl and the ratio is 1.040462, because the relation line carries both values, their difference and their ratio."]'::jsonb, explanation = 'The relation names the nominal at 19608.4845 bbl first and the working at 18845.9323 bbl second, so the difference of 762.5522 and the ratio of 1.040462 both run in that order.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-tank-and-its-geometry' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m01-the-tank-and-its-geometry ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-shell-and-what-governs ord 3
  select case
           when prompt = 'The digest reports that the water test takes the bottom course of this tank below a gravity of 0.931727. How was that figure obtained?' and options = '["By reading it from the API 650 band table the package carries for the diameter of this tank.", "By bisecting the governing word the engine returns, narrowing the interval until the word changed.", "By interpolating linearly between the design thickness at a gravity of 0.912400 and the design thickness at 1.000000, which is the pair of rows the crossover falls between on the sweep.", "By rearranging the one-foot relation for the gravity at which the two computed thicknesses are equal, which is an exact solution rather than a search."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Nothing in the package publishes 0.931727 as a threshold, because it is a property of this geometry and this test condition rather than a published quantity.' then 'old'
           when prompt = 'The course reports that the water test takes the bottom course of this tank below a gravity of 0.931727. How was that figure obtained?' and options = '["By reading it from the API 650 band table the package carries for the diameter of this tank.", "By bisecting the governing word the engine returns, narrowing the interval until the word changed.", "By interpolating linearly between the design thickness at a gravity of 0.912400 and the design thickness at 1.000000, which is the pair of rows the crossover falls between on the sweep.", "By rearranging the one-foot relation for the gravity at which the two computed thicknesses are equal, which is an exact solution rather than a search."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Nothing in the package publishes 0.931727 as a threshold, because it is a property of this geometry and this test condition rather than a published quantity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-shell-and-what-governs' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m02-the-shell-and-what-governs ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m02-the-shell-and-what-governs ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course reports that the water test takes the bottom course of this tank below a gravity of 0.931727. How was that figure obtained?', options = '["By reading it from the API 650 band table the package carries for the diameter of this tank.", "By bisecting the governing word the engine returns, narrowing the interval until the word changed.", "By interpolating linearly between the design thickness at a gravity of 0.912400 and the design thickness at 1.000000, which is the pair of rows the crossover falls between on the sweep.", "By rearranging the one-foot relation for the gravity at which the two computed thicknesses are equal, which is an exact solution rather than a search."]'::jsonb, explanation = 'Nothing in the package publishes 0.931727 as a threshold, because it is a property of this geometry and this test condition rather than a published quantity.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-shell-and-what-governs' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m02-the-shell-and-what-governs ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-normal-venting ord 4
  select case
           when prompt = 'At the stated rates the engine returns a total outbreathing of 25689.2574 scfh and a total inbreathing of 23201.8178 scfh. What may a writer say about the pair?' and options = '["That the outbreathing stands at twice the inbreathing, since 2.000000 is the ratio this pair is printed at on the relation line the digest carries for the two directions.", "That the two are close enough to be treated as one figure, which is why the engine forms a single predicate rather than reporting each direction separately.", "That the inbreathing is the larger of the two by 2487.4395 scfh, since the relation prints the difference as the first value less the second.", "That the difference is 2487.4395 scfh and the ratio is 1.107209, both quoted from the relation line the digest prints."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The relation carries the two values, their difference and their ratio, and a comparison is only ever stated where a relation line states it.' then 'old'
           when prompt = 'At the stated rates the engine returns a total outbreathing of 25689.2574 scfh and a total inbreathing of 23201.8178 scfh. What may a writer say about the pair?' and options = '["That the outbreathing stands at twice the inbreathing, since 2.000000 is the ratio this pair is printed at on the relation line the course carries for the two directions.", "That the two are close enough to be treated as one figure, which is why the engine forms a single predicate rather than reporting each direction separately.", "That the inbreathing is the larger of the two by 2487.4395 scfh, since the relation prints the difference as the first value less the second.", "That the difference is 2487.4395 scfh and the ratio is 1.107209, both quoted from the relation line the course prints."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The relation carries the two values, their difference and their ratio, and a comparison is only ever stated where a relation line states it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-normal-venting' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m03-normal-venting ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m03-normal-venting ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the stated rates the engine returns a total outbreathing of 25689.2574 scfh and a total inbreathing of 23201.8178 scfh. What may a writer say about the pair?', options = '["That the outbreathing stands at twice the inbreathing, since 2.000000 is the ratio this pair is printed at on the relation line the course carries for the two directions.", "That the two are close enough to be treated as one figure, which is why the engine forms a single predicate rather than reporting each direction separately.", "That the inbreathing is the larger of the two by 2487.4395 scfh, since the relation prints the difference as the first value less the second.", "That the difference is 2487.4395 scfh and the ratio is 1.107209, both quoted from the relation line the course prints."]'::jsonb, explanation = 'The relation carries the two values, their difference and their ratio, and a comparison is only ever stated where a relation line states it.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-normal-venting' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m03-normal-venting ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-normal-venting ord 10
  select case
           when prompt = 'What does the digest print about the thermal inbreathing of this tank with insulation applied?' and options = '["A relation giving 19608.4845 scfh uninsulated, 4902.1211 scfh insulated, a difference of 14706.3634 and a ratio of 4.000000.", "That insulation removes the thermal term altogether, so an insulated tank breathes on its movement terms alone and the inbreathing falls to 3593.3333 scfh.", "That insulation is applied as a latitude factor below 1.000000, so the credit shows up in the same field the latitude factor is returned in.", "That the credit is read from the standard for a documented insulation system."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The credit applied is 0.25 and the engine says it is its own stated choice rather than a value read from the standard.' then 'old'
           when prompt = 'What does the course print about the thermal inbreathing of this tank with insulation applied?' and options = '["A relation giving 19608.4845 scfh uninsulated, 4902.1211 scfh insulated, a difference of 14706.3634 and a ratio of 4.000000.", "That insulation removes the thermal term altogether, so an insulated tank breathes on its movement terms alone and the inbreathing falls to 3593.3333 scfh.", "That insulation is applied as a latitude factor below 1.000000, so the credit shows up in the same field the latitude factor is returned in.", "That the credit is read from the standard for a documented insulation system."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The credit applied is 0.25 and the engine says it is its own stated choice rather than a value read from the standard.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-normal-venting' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m03-normal-venting ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m03-normal-venting ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print about the thermal inbreathing of this tank with insulation applied?', options = '["A relation giving 19608.4845 scfh uninsulated, 4902.1211 scfh insulated, a difference of 14706.3634 and a ratio of 4.000000.", "That insulation removes the thermal term altogether, so an insulated tank breathes on its movement terms alone and the inbreathing falls to 3593.3333 scfh.", "That insulation is applied as a latitude factor below 1.000000, so the credit shows up in the same field the latitude factor is returned in.", "That the credit is read from the standard for a documented insulation system."]'::jsonb, explanation = 'The credit applied is 0.25 and the engine says it is its own stated choice rather than a value read from the standard.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-normal-venting' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m03-normal-venting ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-fire-case-and-the-withheld-vent ord 11
  select case
           when prompt = 'At the edge where the 1000 to 2800 ft2 band gives way to the band above it, the digest prints a duty of 14091137.6199 Btu/hr below the edge and 14089282.6189 Btu/hr above it. Why print both?' and options = '["So a reader can interpolate between the two and recover the duty at any area inside either band without calling the engine again for it.", "So the behaviour of the duty across a change of relation can be read rather than assumed.", "So the edge itself can be located, since the wetted area at which the change happens is not returned by the engine and has to be inferred from the two duties.", "So the discontinuity can be corrected, because a designer quoting a duty near an edge is expected to blend the two relations across it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Each edge was found by bisecting the band name the engine returns, and the two duties are printed at 2800.0000 ft2 so a reader can see what the change of band does.' then 'old'
           when prompt = 'At the edge where the 1000 to 2800 ft2 band gives way to the band above it, the course prints a duty of 14091137.6199 Btu/hr below the edge and 14089282.6189 Btu/hr above it. Why print both?' and options = '["So a reader can interpolate between the two and recover the duty at any area inside either band without calling the engine again for it.", "So the behaviour of the duty across a change of relation can be read rather than assumed.", "So the edge itself can be located, since the wetted area at which the change happens is not returned by the engine and has to be inferred from the two duties.", "So the discontinuity can be corrected, because a designer quoting a duty near an edge is expected to blend the two relations across it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Each edge was found by bisecting the band name the engine returns, and the two duties are printed at 2800.0000 ft2 so a reader can see what the change of band does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-fire-case-and-the-withheld-vent' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m04-the-fire-case-and-the-withheld-vent ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m04-the-fire-case-and-the-withheld-vent ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the edge where the 1000 to 2800 ft2 band gives way to the band above it, the course prints a duty of 14091137.6199 Btu/hr below the edge and 14089282.6189 Btu/hr above it. Why print both?', options = '["So a reader can interpolate between the two and recover the duty at any area inside either band without calling the engine again for it.", "So the behaviour of the duty across a change of relation can be read rather than assumed.", "So the edge itself can be located, since the wetted area at which the change happens is not returned by the engine and has to be inferred from the two duties.", "So the discontinuity can be corrected, because a designer quoting a duty near an edge is expected to blend the two relations across it."]'::jsonb, explanation = 'Each edge was found by bisecting the band name the engine returns, and the two duties are printed at 2800.0000 ft2 so a reader can see what the change of band does.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-fire-case-and-the-withheld-vent' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m04-the-fire-case-and-the-withheld-vent ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-fire-case-and-the-withheld-vent ord 13
  select case
           when prompt = 'The digest prints the fire duty on this tank with and without a stated drainage credit. What does that relation carry?' and options = '["A ratio of 0.300000, since that factor is what produced the second value.", "A difference of 18124708.1759 Btu/hr against the duty at the top of the band.", "25892440.2513 Btu/hr with no credit, 7767732.0754 Btu/hr at a factor of 0.300000, a difference of 18124708.1759 and a ratio of 3.333333.", "A ratio of 24, the factor the engine names for the two forms it will not use."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The relation line gives both values, their difference and their ratio, and a credit of that size has to be earned by drainage, insulation or a spray that exists and is maintained.' then 'old'
           when prompt = 'The course prints the fire duty on this tank with and without a stated drainage credit. What does that relation carry?' and options = '["A ratio of 0.300000, since that factor is what produced the second value.", "A difference of 18124708.1759 Btu/hr against the duty at the top of the band.", "25892440.2513 Btu/hr with no credit, 7767732.0754 Btu/hr at a factor of 0.300000, a difference of 18124708.1759 and a ratio of 3.333333.", "A ratio of 24, the factor the engine names for the two forms it will not use."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The relation line gives both values, their difference and their ratio, and a credit of that size has to be earned by drainage, insulation or a spray that exists and is maintained.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-fire-case-and-the-withheld-vent' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m04-the-fire-case-and-the-withheld-vent ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m04-the-fire-case-and-the-withheld-vent ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the fire duty on this tank with and without a stated drainage credit. What does that relation carry?', options = '["A ratio of 0.300000, since that factor is what produced the second value.", "A difference of 18124708.1759 Btu/hr against the duty at the top of the band.", "25892440.2513 Btu/hr with no credit, 7767732.0754 Btu/hr at a factor of 0.300000, a difference of 18124708.1759 and a ratio of 3.333333.", "A ratio of 24, the factor the engine names for the two forms it will not use."]'::jsonb, explanation = 'The relation line gives both values, their difference and their ratio, and a credit of that size has to be earned by drainage, insulation or a spray that exists and is maintained.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-fire-case-and-the-withheld-vent' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m04-the-fire-case-and-the-withheld-vent ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-losses-and-what-control-saves ord 3
  select case
           when prompt = 'The digest prints a relation over the two halves of the annual loss. What does it carry?' and options = '["A difference of 70067.5951 lb/yr, since a difference between two losses is printed as a magnitude and the sign is carried by the order of the two rows.", "A ratio of 0.048062 formed as the working loss over the standing loss.", "The standing loss at 3537.6108 lb/yr, the working loss at 73605.2059 lb/yr, a difference of -70067.5951 and a ratio of 0.048062.", "A ratio taken against the total of 77142.8167 lb/yr rather than against a half."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The relation prints the standing loss first, so the difference of -70067.5951 is the first value less the second and the ratio of 0.048062 runs in the same order.' then 'old'
           when prompt = 'The course prints a relation over the two halves of the annual loss. What does it carry?' and options = '["A difference of 70067.5951 lb/yr, since a difference between two losses is printed as a magnitude and the sign is carried by the order of the two rows.", "A ratio of 0.048062 formed as the working loss over the standing loss.", "The standing loss at 3537.6108 lb/yr, the working loss at 73605.2059 lb/yr, a difference of -70067.5951 and a ratio of 0.048062.", "A ratio taken against the total of 77142.8167 lb/yr rather than against a half."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The relation prints the standing loss first, so the difference of -70067.5951 is the first value less the second and the ratio of 0.048062 runs in the same order.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-losses-and-what-control-saves' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m05-losses-and-what-control-saves ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m05-losses-and-what-control-saves ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a relation over the two halves of the annual loss. What does it carry?', options = '["A difference of 70067.5951 lb/yr, since a difference between two losses is printed as a magnitude and the sign is carried by the order of the two rows.", "A ratio of 0.048062 formed as the working loss over the standing loss.", "The standing loss at 3537.6108 lb/yr, the working loss at 73605.2059 lb/yr, a difference of -70067.5951 and a ratio of 0.048062.", "A ratio taken against the total of 77142.8167 lb/yr rather than against a half."]'::jsonb, explanation = 'The relation prints the standing loss first, so the difference of -70067.5951 is the first value less the second and the ratio of 0.048062 runs in the same order.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-losses-and-what-control-saves' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m05-losses-and-what-control-saves ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-register-and-the-refusals ord 1
  select case
           when prompt = 'This course calls and proves 28 distinct refusals. What was that count taken over, and what made a call count?' and options = '["The assertion list the generator built while it ran, filtered to the ones labelled a refusal, with one count per distinct assertion text, each asserting that the engine returned an error key.", "The refusal messages the three engines export as named constants, with one count for each distinct message.", "The guard clauses written in the three engine sources, with one count for each clause that can return early.", "The inputs the generator rejected before calling anything, with one count for each input rejected."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A list compiled by reading the source would be a list of refusals somebody believed were reachable, which is a weaker claim than one that provoked every case.' then 'old'
           when prompt = 'This course calls and proves 28 distinct refusals. What was that count taken over, and what made a call count?' and options = '["The assertion list the course build made while it ran, filtered to the ones labelled a refusal, with one count per distinct assertion text, each asserting that the engine returned an error key.", "The refusal messages the three engines export as named constants, with one count for each distinct message.", "The guard clauses written in the three engine sources, with one count for each clause that can return early.", "The inputs the course build rejected before calling anything, with one count for each input rejected."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A list compiled by reading the source would be a list of refusals somebody believed were reachable, which is a weaker claim than one that provoked every case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m06-the-register-and-the-refusals ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'This course calls and proves 28 distinct refusals. What was that count taken over, and what made a call count?', options = '["The assertion list the course build made while it ran, filtered to the ones labelled a refusal, with one count per distinct assertion text, each asserting that the engine returned an error key.", "The refusal messages the three engines export as named constants, with one count for each distinct message.", "The guard clauses written in the three engine sources, with one count for each clause that can return early.", "The inputs the course build rejected before calling anything, with one count for each input rejected."]'::jsonb, explanation = 'A list compiled by reading the source would be a list of refusals somebody believed were reachable, which is a weaker claim than one that provoked every case.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-register-and-the-refusals ord 2
  select case
           when prompt = 'What rule decides whether a call this course made counts as one of its 238 successes?' and options = '["The result matched a golden case for the same function, which is what separates a call that ran from a call that ran correctly.", "The result carried a figure the digest went on to print, so a call whose output is never quoted anywhere is not counted as a success.", "The result carried no error key and no non-finite number in it.", "The result carried no warning and no note, since a call that returns a caveat is neither a refusal nor a clean success."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The successes and the refusals are counted over the same assertion list filtered two ways, and the rule is what tells the two halves apart.' then 'old'
           when prompt = 'What rule decides whether a call this course made counts as one of its 238 successes?' and options = '["The result matched a golden case for the same function, which is what separates a call that ran from a call that ran correctly.", "The result carried a figure the course went on to print, so a call whose output is never quoted anywhere is not counted as a success.", "The result carried no error key and no non-finite number in it.", "The result carried no warning and no note, since a call that returns a caveat is neither a refusal nor a clean success."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The successes and the refusals are counted over the same assertion list filtered two ways, and the rule is what tells the two halves apart.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m06-the-register-and-the-refusals ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What rule decides whether a call this course made counts as one of its 238 successes?', options = '["The result matched a golden case for the same function, which is what separates a call that ran from a call that ran correctly.", "The result carried a figure the course went on to print, so a call whose output is never quoted anywhere is not counted as a success.", "The result carried no error key and no non-finite number in it.", "The result carried no warning and no note, since a call that returns a caveat is neither a refusal nor a clean success."]'::jsonb, explanation = 'The successes and the refusals are counted over the same assertion list filtered two ways, and the rule is what tells the two halves apart.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-register-and-the-refusals ord 3
  select case
           when prompt = 'A generator labels a row a refusal and then calls a case that succeeds. What is the shape of that defect and what stops it here?' and options = '["The numbers would be invented rather than returned, so a sweep of the literals against the engine finds them and the build stops there.", "Real engine output would print under a false sentence, and nothing numeric could see it, so the file writes nothing at all if any label disagrees with its call.", "The row would carry a null where a figure belongs, which the reproducibility check catches on the second build of the file.", "The count of refusals would disagree with the count of successes, and the two are asserted to add to the number of calls made."]'::jsonb and answer_index = 1 and explanation is not distinct from 'When you assert a behaviour and print evidence of it, have something check that the evidence is evidence of the thing you asserted.' then 'old'
           when prompt = 'A course build labels a row a refusal and then calls a case that succeeds. What is the shape of that defect and what stops it here?' and options = '["The numbers would be invented rather than returned, so a sweep of the literals against the engine finds them and the build stops there.", "Real engine output would print under a false sentence, and nothing numeric could see it, so the file writes nothing at all if any label disagrees with its call.", "The row would carry a null where a figure belongs, which the reproducibility check catches on the second build of the file.", "The count of refusals would disagree with the count of successes, and the two are asserted to add to the number of calls made."]'::jsonb and answer_index = 1 and explanation is not distinct from 'When you assert a behaviour and print evidence of it, have something check that the evidence is evidence of the thing you asserted.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m06-the-register-and-the-refusals ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A course build labels a row a refusal and then calls a case that succeeds. What is the shape of that defect and what stops it here?', options = '["The numbers would be invented rather than returned, so a sweep of the literals against the engine finds them and the build stops there.", "Real engine output would print under a false sentence, and nothing numeric could see it, so the file writes nothing at all if any label disagrees with its call.", "The row would carry a null where a figure belongs, which the reproducibility check catches on the second build of the file.", "The count of refusals would disagree with the count of successes, and the two are asserted to add to the number of calls made."]'::jsonb, explanation = 'When you assert a behaviour and print evidence of it, have something check that the evidence is evidence of the thing you asserted.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-register-and-the-refusals ord 12
  select case
           when prompt = 'The digest pins fifty engine strings verbatim. What does the pinning actually buy?' and options = '["A reader can search the engine source for the string and confirm the message has not been edited since the file was built.", "A screen showing a message and an engine returning one cannot drift apart, because the pinned string is the named constant the interface reads and the engine returns on the call itself.", "A message that breaches the owner copy rule is exempted by exact text, which is what allows a contrastive to be quoted at all.", "Each was asserted to contain a fragment of its own text as the file was built, so a reworded message fails the build rather than teaching wording nobody will see."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A digest that paraphrased an error message would teach a sentence the learner will never see on the screen, and the same is true of a lesson.' then 'old'
           when prompt = 'The course pins fifty engine strings verbatim. What does the pinning actually buy?' and options = '["A reader can search the engine source for the string and confirm the message has not been edited since the file was built.", "A screen showing a message and an engine returning one cannot drift apart, because the pinned string is the named constant the interface reads and the engine returns on the call itself.", "A message that breaches the owner copy rule is exempted by exact text, which is what allows a contrastive to be quoted at all.", "Each was asserted to contain a fragment of its own text as the file was built, so a reworded message fails the build rather than teaching wording nobody will see."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A worked example that paraphrased an error message would teach a sentence the learner will never see on the screen, and the same is true of a lesson.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m06-the-register-and-the-refusals ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course pins fifty engine strings verbatim. What does the pinning actually buy?', options = '["A reader can search the engine source for the string and confirm the message has not been edited since the file was built.", "A screen showing a message and an engine returning one cannot drift apart, because the pinned string is the named constant the interface reads and the engine returns on the call itself.", "A message that breaches the owner copy rule is exempted by exact text, which is what allows a contrastive to be quoted at all.", "Each was asserted to contain a fragment of its own text as the file was built, so a reworded message fails the build rather than teaching wording nobody will see."]'::jsonb, explanation = 'A worked example that paraphrased an error message would teach a sentence the learner will never see on the screen, and the same is true of a lesson.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-register-and-the-refusals ord 13
  select case
           when prompt = 'Which of these is never a source for a figure in a document about this package?' and options = '["A message the engine returns, because a sentence is not a figure and cannot be checked against an engine output.", "A figure printed in the digest at six decimals, since a rendering is not a value.", "A comment in the engine source, because it often describes what the code did at some earlier time.", "A relation line, because a comparison is somebody''s reading of two figures."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The test is whether you can make the package produce the figure right now by calling it. A repair note and a review document are in the same position as the comment.' then 'old'
           when prompt = 'Which of these is never a source for a figure in a document about this package?' and options = '["A message the engine returns, because a sentence is not a figure and cannot be checked against an engine output.", "A figure printed in the course at six decimals, since a rendering is not a value.", "A comment in the engine source, because it often describes what the code did at some earlier time.", "A relation line, because a comparison is somebody''s reading of two figures."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The test is whether you can make the package produce the figure right now by calling it. A repair note and a review document are in the same position as the comment.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, metering refused: no row for advanced m06-the-register-and-the-refusals ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these is never a source for a figure in a document about this package?', options = '["A message the engine returns, because a sentence is not a figure and cannot be checked against an engine output.", "A figure printed in the course at six decimals, since a rendering is not a value.", "A comment in the engine source, because it often describes what the code did at some earlier time.", "A relation line, because a comparison is somebody''s reading of two figures."]'::jsonb, explanation = 'The test is whether you can make the package produce the figure right now by calling it. A repair note and a review document are in the same position as the comment.'
     where app_slug = 'metering' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-register-and-the-refusals' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, metering refused: advanced m06-the-register-and-the-refusals ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'metering';
  if v_total <> 396 then raise exception 'digest-copy recut, metering refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, metering: % of 30 rows updated, the rest already carried the recut text', v_updated;
end $$;
