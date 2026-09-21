-- ==========================================================================
-- DIGEST-COPY RECUT: uncertainty, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 1 (advanced 1).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-uncertainty.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced m06-the-expert-reading ord 7
  select case
           when prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?' and options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the digest to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 152.0653 shown first is a wrong answer with right numbers.' then 'old'
           when prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?' and options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the course to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 152.0653 shown first is a wrong answer with right numbers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, uncertainty refused: no row for advanced m06-the-expert-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, uncertainty refused: advanced m06-the-expert-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every ISIALA value in an answer is correct. How can the answer still lose its marks?', options = '["It cannot, since the graded values are numbers, and a number correct to four decimals carries the whole of its mark.", "By writing a breakeven price with a P-label, by showing the High case first, or by quoting a median without its seed.", "By rounding, since each value must be quoted at the four decimals of the course to be read as the correct value.", "By quoting the base breakeven at all, since 71.6277 is not sampled and only the three percentiles belong in a probabilistic answer."]'::jsonb, explanation = 'The method keeps the base beside the percentiles and says which is which; the words are part of the answer, so the High case P10 of 152.0653 shown first is a wrong answer with right numbers.'
     where app_slug = 'uncertainty' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, uncertainty refused: advanced m06-the-expert-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'uncertainty';
  if v_total <> 396 then raise exception 'digest-copy recut, uncertainty refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, uncertainty: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
