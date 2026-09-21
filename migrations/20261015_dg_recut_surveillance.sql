-- ==========================================================================
-- DIGEST-COPY RECUT: surveillance, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 2 (beginner 1, advanced 1).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-surveillance.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced final ord 42
  select case
           when prompt = 'Where does a course number that is not in the digest come from, and what should be done with it?' and options = '["It comes from the goldens and may be used wherever the golden case is named beside it.", "It comes from the engine re-run and may be used once it has been checked against the oracle, which is the route the digest itself took.", "It has no provenance, and it may not be used, because recomputing a figure is not a substitute for a published or derived one.", "It comes from the teaching field and may be used as long as the field is described as invented and the number is labelled as a teaching one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'golden, derived and teaching are three different kinds of claim, and a reader is entitled to know which is in front of them.' then 'old'
           when prompt = 'Where does a course number the course never printed come from, and what should be done with it?' and options = '["It comes from the goldens and may be used wherever the golden case is named beside it.", "It comes from the engine re-run and may be used once it has been checked against the oracle, which is the route the course itself took.", "It has no provenance, and it may not be used, because recomputing a figure is not a substitute for a published or derived one.", "It comes from the teaching field and may be used as long as the field is described as invented and the number is labelled as a teaching one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'golden, derived and teaching are three different kinds of claim, and a reader is entitled to know which is in front of them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'surveillance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, surveillance refused: no row for advanced final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, surveillance refused: advanced final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does a course number the course never printed come from, and what should be done with it?', options = '["It comes from the goldens and may be used wherever the golden case is named beside it.", "It comes from the engine re-run and may be used once it has been checked against the oracle, which is the route the course itself took.", "It has no provenance, and it may not be used, because recomputing a figure is not a substitute for a published or derived one.", "It comes from the teaching field and may be used as long as the field is described as invented and the number is labelled as a teaching one."]'::jsonb, explanation = 'golden, derived and teaching are three different kinds of claim, and a reader is entitled to know which is in front of them.'
     where app_slug = 'surveillance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, surveillance refused: advanced final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 2
  select case
           when prompt = 'academy_submit_capstone compares an answer against an expected value how?' and options = '["As an absolute difference in that field''s own units against a tolerance in the same units, which is not a percentage of anything.", "As a relative error, so a watercut carried as a per cent and the same watercut as a fraction are near misses of each other.", "As a match to a stated number of significant figures, which is why the digest prints twelve of them.", "As a match after both values are normalised to SI units."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A watercut carried as a fraction and a watercut carried as a per cent are two different quantities under that rule, not two roundings of one.' then 'old'
           when prompt = 'academy_submit_capstone compares an answer against an expected value how?' and options = '["As an absolute difference in that field''s own units against a tolerance in the same units, which is not a percentage of anything.", "As a relative error, so a watercut carried as a per cent and the same watercut as a fraction are near misses of each other.", "As a match to a stated number of significant figures, which is why the course prints twelve of them.", "As a match after both values are normalised to SI units."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A watercut carried as a fraction and a watercut carried as a per cent are two different quantities under that rule, not two roundings of one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'surveillance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, surveillance refused: no row for beginner m06-the-associate-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, surveillance refused: beginner m06-the-associate-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'academy_submit_capstone compares an answer against an expected value how?', options = '["As an absolute difference in that field''s own units against a tolerance in the same units, which is not a percentage of anything.", "As a relative error, so a watercut carried as a per cent and the same watercut as a fraction are near misses of each other.", "As a match to a stated number of significant figures, which is why the course prints twelve of them.", "As a match after both values are normalised to SI units."]'::jsonb, explanation = 'A watercut carried as a fraction and a watercut carried as a per cent are two different quantities under that rule, not two roundings of one.'
     where app_slug = 'surveillance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, surveillance refused: beginner m06-the-associate-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'surveillance';
  if v_total <> 396 then raise exception 'digest-copy recut, surveillance refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, surveillance: % of 2 rows updated, the rest already carried the recut text', v_updated;
end $$;
