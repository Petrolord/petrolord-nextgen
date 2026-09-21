-- ==========================================================================
-- DIGEST-COPY RECUT: sim, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 3 (advanced 3).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-sim.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced final ord 25
  select case
           when prompt = 'Which of the seven cases raises two errors, and is that a flaw?' and options = '["The well outside the grid, and it is not: invalid indices genuinely also put the completion outside the layers.", "The missing start date, and it is not: a deck with no start date genuinely also fails the rule that the first history period must match it.", "The layer count mismatch, and it is a flaw: the case should have been written to drop a single layer entry rather than to change the count itself.", "The single-node PVT table, and it is: the table rule and the datum pressure rule should not have been coupled."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The two rules depend on the same field. The generator asserts that no case raises more than two errors, so a future case that cascades fails the build rather than being described as isolated.' then 'old'
           when prompt = 'Which of the seven cases raises two errors, and is that a flaw?' and options = '["The well outside the grid, and it is not: invalid indices genuinely also put the completion outside the layers.", "The missing start date, and it is not: a deck with no start date genuinely also fails the rule that the first history period must match it.", "The layer count mismatch, and it is a flaw: the case should have been written to drop a single layer entry rather than to change the count itself.", "The single-node PVT table, and it is: the table rule and the datum pressure rule should not have been coupled."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The two rules depend on the same field. The course''s build asserts that no case raises more than two errors, so a future case that cascades fails the build rather than being described as isolated.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'sim' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'digest-copy recut, sim refused: no row for advanced final ord 25'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, sim refused: advanced final ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of the seven cases raises two errors, and is that a flaw?', options = '["The well outside the grid, and it is not: invalid indices genuinely also put the completion outside the layers.", "The missing start date, and it is not: a deck with no start date genuinely also fails the rule that the first history period must match it.", "The layer count mismatch, and it is a flaw: the case should have been written to drop a single layer entry rather than to change the count itself.", "The single-node PVT table, and it is: the table rule and the datum pressure rule should not have been coupled."]'::jsonb, explanation = 'The two rules depend on the same field. The course''s build asserts that no case raises more than two errors, so a future case that cascades fails the build rather than being described as isolated.'
     where app_slug = 'sim' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, sim refused: advanced final ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-validation ord 5
  select case
           when prompt = 'Six of the seven cases raise exactly one error. Which raises two, and why?' and options = '["The missing title, because the title is used to name the deck file as well as to head the RUNSPEC section.", "The missing start date, because a deck with no start date also fails the rule that the first history period must match it.", "The well outside the grid, because a well carrying invalid indices also has a completion that cannot possibly be inside the layers.", "The single-node PVT table, because a table with one node also fails the requirement for a finite datum pressure."]'::jsonb and answer_index = 1 and explanation is not distinct from 'That coupling is real rather than an artifact: the two rules genuinely depend on the same field. The generator asserts that no case raises more than two errors, so a future case that cascades fails the build.' then 'old'
           when prompt = 'Six of the seven cases raise exactly one error. Which raises two, and why?' and options = '["The missing title, because the title is used to name the deck file as well as to head the RUNSPEC section.", "The missing start date, because a deck with no start date also fails the rule that the first history period must match it.", "The well outside the grid, because a well carrying invalid indices also has a completion that cannot possibly be inside the layers.", "The single-node PVT table, because a table with one node also fails the requirement for a finite datum pressure."]'::jsonb and answer_index = 1 and explanation is not distinct from 'That coupling is real rather than an artifact: the two rules genuinely depend on the same field. The course''s build asserts that no case raises more than two errors, so a future case that cascades fails the build.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'sim' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-validation' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, sim refused: no row for advanced m04-validation ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, sim refused: advanced m04-validation ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Six of the seven cases raise exactly one error. Which raises two, and why?', options = '["The missing title, because the title is used to name the deck file as well as to head the RUNSPEC section.", "The missing start date, because a deck with no start date also fails the rule that the first history period must match it.", "The well outside the grid, because a well carrying invalid indices also has a completion that cannot possibly be inside the layers.", "The single-node PVT table, because a table with one node also fails the requirement for a finite datum pressure."]'::jsonb, explanation = 'That coupling is real rather than an artifact: the two rules genuinely depend on the same field. The course''s build asserts that no case raises more than two errors, so a future case that cascades fails the build.'
     where app_slug = 'sim' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-validation' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, sim refused: advanced m04-validation ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 10
  select case
           when prompt = 'What did the tier learn from the first attempt at the validator cases?' and options = '["That a validator should stop at the first error, since accumulating them makes a cascading case indistinguishable from an isolated one.", "That a specification should be broken by removing a field rather than by replacing one, since replacement invalidates the references to it.", "That a negative test can fail for a reason other than the one intended, so a suite of cascading cases can look thorough while exercising one rule repeatedly.", "That the error count is a better assertion than the message text, since messages change between versions while counts do not."]'::jsonb and answer_index = 2 and explanation is not distinct from 'A case that raises 180 errors teaches the opposite of what it is for. The generator now asserts that no case raises more than two, so a future case that cascades fails the build rather than being described as isolated.' then 'old'
           when prompt = 'What did the tier learn from the first attempt at the validator cases?' and options = '["That a validator should stop at the first error, since accumulating them makes a cascading case indistinguishable from an isolated one.", "That a specification should be broken by removing a field rather than by replacing one, since replacement invalidates the references to it.", "That a negative test can fail for a reason other than the one intended, so a suite of cascading cases can look thorough while exercising one rule repeatedly.", "That the error count is a better assertion than the message text, since messages change between versions while counts do not."]'::jsonb and answer_index = 2 and explanation is not distinct from 'A case that raises 180 errors teaches the opposite of what it is for. The course''s build now asserts that no case raises more than two, so a future case that cascades fails the build rather than being described as isolated.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'sim' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, sim refused: no row for advanced m06-the-expert-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, sim refused: advanced m06-the-expert-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What did the tier learn from the first attempt at the validator cases?', options = '["That a validator should stop at the first error, since accumulating them makes a cascading case indistinguishable from an isolated one.", "That a specification should be broken by removing a field rather than by replacing one, since replacement invalidates the references to it.", "That a negative test can fail for a reason other than the one intended, so a suite of cascading cases can look thorough while exercising one rule repeatedly.", "That the error count is a better assertion than the message text, since messages change between versions while counts do not."]'::jsonb, explanation = 'A case that raises 180 errors teaches the opposite of what it is for. The course''s build now asserts that no case raises more than two, so a future case that cascades fails the build rather than being described as isolated.'
     where app_slug = 'sim' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, sim refused: advanced m06-the-expert-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'sim';
  if v_total <> 396 then raise exception 'digest-copy recut, sim refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, sim: % of 3 rows updated, the rest already carried the recut text', v_updated;
end $$;
