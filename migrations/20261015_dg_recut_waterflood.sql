-- ==========================================================================
-- DIGEST-COPY RECUT: waterflood, question text only.
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
-- (docs/digest-recut/RECUT-waterflood.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- intermediate final ord 24
  select case
           when prompt = 'Ekene-4''s above-reference Hall slopes are 2.0000000000000013 and 2.857142857142859. How should the baseline be reported?' and options = '["As 2.0000000000000013, since anything else discards precision the engine actually delivered.", "As 2.0, while recording the raw double in the digest.", "As 2, with the trailing digits treated as evidence of a small real change in injectivity over the baseline period.", "As a range from 2.0 to 2.857142857142859, since the two thirds bracket the well''s behaviour over the record."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The trailing digits in the fourteenth place are the least squares round trip rather than a physical deviation, and the planted injectivity index is exactly 0.5. Report 2.0, record the raw value, and never key an assessment on the trailing digit. The two slopes describe two different periods rather than bracketing one.' then 'old'
           when prompt = 'Ekene-4''s above-reference Hall slopes are 2.0000000000000013 and 2.857142857142859. How should the baseline be reported?' and options = '["As 2.0000000000000013, since anything else discards precision the engine actually delivered.", "As 2.0, while recording the raw double in your notes.", "As 2, with the trailing digits treated as evidence of a small real change in injectivity over the baseline period.", "As a range from 2.0 to 2.857142857142859, since the two thirds bracket the well''s behaviour over the record."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The trailing digits in the fourteenth place are the least squares round trip rather than a physical deviation, and the planted injectivity index is exactly 0.5. Report 2.0, record the raw value, and never key an assessment on the trailing digit. The two slopes describe two different periods rather than bracketing one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'waterflood' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, waterflood refused: no row for intermediate final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, waterflood refused: intermediate final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Ekene-4''s above-reference Hall slopes are 2.0000000000000013 and 2.857142857142859. How should the baseline be reported?', options = '["As 2.0000000000000013, since anything else discards precision the engine actually delivered.", "As 2.0, while recording the raw double in your notes.", "As 2, with the trailing digits treated as evidence of a small real change in injectivity over the baseline period.", "As a range from 2.0 to 2.857142857142859, since the two thirds bracket the well''s behaviour over the record."]'::jsonb, explanation = 'The trailing digits in the fourteenth place are the least squares round trip rather than a physical deviation, and the planted injectivity index is exactly 0.5. Report 2.0, record the raw value, and never key an assessment on the trailing digit. The two slopes describe two different periods rather than bracketing one.'
     where app_slug = 'waterflood' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, waterflood refused: intermediate final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'waterflood';
  if v_total <> 396 then raise exception 'digest-copy recut, waterflood refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, waterflood: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
