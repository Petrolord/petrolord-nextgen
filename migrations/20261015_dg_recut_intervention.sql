-- ==========================================================================
-- DIGEST-COPY RECUT: intervention, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 1 (intermediate 1).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-intervention.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- intermediate m03-what-removing-skin-is-worth ord 10
  select case
           when prompt = 'What check has skinFromPiRatio ever been put through?' and options = '["A Theil-Sen route written by the oracle, the median of every pairwise slope, which is the same independent estimator it turns on the log-log slope.", "A round trip on the published pairs run by the teaching digest: case 2 inverts to -2.000000000 at a difference of 8.8818e-16.", "A radial Darcy rate in SI written by the oracle, which is the route that checks the multiplier it inverts.", "The five published skin pairs, each one of which carries an expected implied skin printed in the golden beside its published multiplier."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The oracle asserts skinPiMultiplier and asserts skinFromPiRatio against nothing at all, so the round trip is a check this course ran rather than one anybody wrote.' then 'old'
           when prompt = 'What check has skinFromPiRatio ever been put through?' and options = '["A Theil-Sen route written by the oracle, the median of every pairwise slope, which is the same independent estimator it turns on the log-log slope.", "A round trip on the published pairs run by the teaching course: case 2 inverts to -2.000000000 at a difference of 8.8818e-16.", "A radial Darcy rate in SI written by the oracle, which is the route that checks the multiplier it inverts.", "The five published skin pairs, each one of which carries an expected implied skin printed in the golden beside its published multiplier."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The oracle asserts skinPiMultiplier and asserts skinFromPiRatio against nothing at all, so the round trip is a check this course ran rather than one anybody wrote.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'intervention' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-what-removing-skin-is-worth' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, intervention refused: no row for intermediate m03-what-removing-skin-is-worth ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, intervention refused: intermediate m03-what-removing-skin-is-worth ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What check has skinFromPiRatio ever been put through?', options = '["A Theil-Sen route written by the oracle, the median of every pairwise slope, which is the same independent estimator it turns on the log-log slope.", "A round trip on the published pairs run by the teaching course: case 2 inverts to -2.000000000 at a difference of 8.8818e-16.", "A radial Darcy rate in SI written by the oracle, which is the route that checks the multiplier it inverts.", "The five published skin pairs, each one of which carries an expected implied skin printed in the golden beside its published multiplier."]'::jsonb, explanation = 'The oracle asserts skinPiMultiplier and asserts skinFromPiRatio against nothing at all, so the round trip is a check this course ran rather than one anybody wrote.'
     where app_slug = 'intervention' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-what-removing-skin-is-worth' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, intervention refused: intermediate m03-what-removing-skin-is-worth ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'intervention';
  if v_total <> 396 then raise exception 'digest-copy recut, intervention refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, intervention: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
