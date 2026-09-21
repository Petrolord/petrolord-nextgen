-- ==========================================================================
-- DIGEST-COPY RECUT: stimulation, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 2 (intermediate 2).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-stimulation.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- intermediate m04-material-balance ord 15
  select case
           when prompt = 'By what procedure does the engine converge the material balance, and what did the published case need?' and options = '["A single closed form expression is evaluated once, with no iteration.", "A guess of 0.5 for efficiency is refined until it settles, which took 9 passes on the published case.", "The leakoff coefficient is swept over a table of values and interpolated, which is why the digest reports a sweep.", "A guess of one for efficiency is stepped down, reaching the answer after the full 200 passes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The loop contracts quickly because the Nolte factor barely moves across the efficiency range, and it gives up after 200 passes.' then 'old'
           when prompt = 'By what procedure does the engine converge the material balance, and what did the published case need?' and options = '["A single closed form expression is evaluated once, with no iteration.", "A guess of 0.5 for efficiency is refined until it settles, which took 9 passes on the published case.", "The leakoff coefficient is swept over a table of values and interpolated, which is why the course reports a sweep.", "A guess of one for efficiency is stepped down, reaching the answer after the full 200 passes."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The loop contracts quickly because the Nolte factor barely moves across the efficiency range, and it gives up after 200 passes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'stimulation' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-material-balance' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, stimulation refused: no row for intermediate m04-material-balance ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, stimulation refused: intermediate m04-material-balance ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'By what procedure does the engine converge the material balance, and what did the published case need?', options = '["A single closed form expression is evaluated once, with no iteration.", "A guess of 0.5 for efficiency is refined until it settles, which took 9 passes on the published case.", "The leakoff coefficient is swept over a table of values and interpolated, which is why the course reports a sweep.", "A guess of one for efficiency is stepped down, reaching the answer after the full 200 passes."]'::jsonb, explanation = 'The loop contracts quickly because the Nolte factor barely moves across the efficiency range, and it gives up after 200 passes.'
     where app_slug = 'stimulation' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-material-balance' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, stimulation refused: intermediate m04-material-balance ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 4
  select case
           when prompt = 'A design sheet crossing your desk lists a PKN average width and a KGD average width that agree to within three per cent. Which of the three checks has failed, and what does the agreement imply?' and options = '["The volume check, and it means the stored volume was computed on the maximum width.", "No check has failed, because the two models are expected to converge once the fracture is long relative to its own height.", "The efficiency check, and it means the fixed point stopped on its first pass rather than converging properly on the published tolerance.", "The disagreement check, and it means one expression was evaluated twice rather than two different models being run."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the digest sweep the ratio runs from 1.8723566993895047 at a half-length of 40 m up to 3.0985171538556986 at 300 m.' then 'old'
           when prompt = 'A design sheet crossing your desk lists a PKN average width and a KGD average width that agree to within three per cent. Which of the three checks has failed, and what does the agreement imply?' and options = '["The volume check, and it means the stored volume was computed on the maximum width.", "No check has failed, because the two models are expected to converge once the fracture is long relative to its own height.", "The efficiency check, and it means the fixed point stopped on its first pass rather than converging properly on the published tolerance.", "The disagreement check, and it means one expression was evaluated twice rather than two different models being run."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course''s sweep the ratio runs from 1.8723566993895047 at a half-length of 40 m up to 3.0985171538556986 at 300 m.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'stimulation' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, stimulation refused: no row for intermediate m06-the-professional-reading ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, stimulation refused: intermediate m06-the-professional-reading ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A design sheet crossing your desk lists a PKN average width and a KGD average width that agree to within three per cent. Which of the three checks has failed, and what does the agreement imply?', options = '["The volume check, and it means the stored volume was computed on the maximum width.", "No check has failed, because the two models are expected to converge once the fracture is long relative to its own height.", "The efficiency check, and it means the fixed point stopped on its first pass rather than converging properly on the published tolerance.", "The disagreement check, and it means one expression was evaluated twice rather than two different models being run."]'::jsonb, explanation = 'In the course''s sweep the ratio runs from 1.8723566993895047 at a half-length of 40 m up to 3.0985171538556986 at 300 m.'
     where app_slug = 'stimulation' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, stimulation refused: intermediate m06-the-professional-reading ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'stimulation';
  if v_total <> 396 then raise exception 'digest-copy recut, stimulation refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, stimulation: % of 2 rows updated, the rest already carried the recut text', v_updated;
end $$;
