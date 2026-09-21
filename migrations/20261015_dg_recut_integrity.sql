-- ==========================================================================
-- DIGEST-COPY RECUT: integrity, question text only.
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
-- (docs/digest-recut/RECUT-integrity.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced m04-annular-cement ord 8
  select case
           when prompt = 'What figure does the digest put on the value of running a cement evaluation log?' and options = '["Ten metres, the margin the published interval keeps.", "Half the required length, because the standard treats a logged annulus as twice as reliable as an unlogged one of the same cement.", "Thirty metres, since that is the length a logged barrier has to reach.", "Seventy metres of cement, the gap between the logged requirement and the unlogged one for the very same annulus."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Priced that way, a skipped log becomes a deliberate purchase of slurry, rig time and interval you may not have above the source.' then 'old'
           when prompt = 'What figure does the course put on the value of running a cement evaluation log?' and options = '["Ten metres, the margin the published interval keeps.", "Half the required length, because the standard treats a logged annulus as twice as reliable as an unlogged one of the same cement.", "Thirty metres, since that is the length a logged barrier has to reach.", "Seventy metres of cement, the gap between the logged requirement and the unlogged one for the very same annulus."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Priced that way, a skipped log becomes a deliberate purchase of slurry, rig time and interval you may not have above the source.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'integrity' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-annular-cement' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, integrity refused: no row for advanced m04-annular-cement ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, integrity refused: advanced m04-annular-cement ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What figure does the course put on the value of running a cement evaluation log?', options = '["Ten metres, the margin the published interval keeps.", "Half the required length, because the standard treats a logged annulus as twice as reliable as an unlogged one of the same cement.", "Thirty metres, since that is the length a logged barrier has to reach.", "Seventy metres of cement, the gap between the logged requirement and the unlogged one for the very same annulus."]'::jsonb, explanation = 'Priced that way, a skipped log becomes a deliberate purchase of slurry, rig time and interval you may not have above the source.'
     where app_slug = 'integrity' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-annular-cement' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, integrity refused: advanced m04-annular-cement ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'integrity';
  if v_total <> 396 then raise exception 'digest-copy recut, integrity refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, integrity: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
