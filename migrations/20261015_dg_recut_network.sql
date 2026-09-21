-- ==========================================================================
-- DIGEST-COPY RECUT: network, question text only.
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
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-network.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced m05-cusps-and-rankings ord 14
  select case
           when prompt = 'Why is the ranking''s behaviour called a note rather than a defect?' and options = '["Every real case in the digest ranks exactly as the header says, and a relative floor at one part in ten thousand of the largest branch mass would close it and change no ranking here.", "Because the whisper leg is a constructed fixture, and a leg carrying a millionth of a pound a day cannot occur on a solved network.", "Because the ranking is never read by a caller, since diagnose is a reporting function and no field in it feeds the solve.", "Because the independent oracle ranks a bottleneck too and agrees with the engine on every published case."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The failure mode is failing open: a ranking with no floor cannot decline, so it names a branch whether or not the branch means anything.' then 'old'
           when prompt = 'Why is the ranking''s behaviour called a note rather than a defect?' and options = '["Every real case in the course ranks exactly as the header says, and a relative floor at one part in ten thousand of the largest branch mass would close it and change no ranking here.", "Because the whisper leg is a constructed fixture, and a leg carrying a millionth of a pound a day cannot occur on a solved network.", "Because the ranking is never read by a caller, since diagnose is a reporting function and no field in it feeds the solve.", "Because the independent oracle ranks a bottleneck too and agrees with the engine on every published case."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The failure mode is failing open: a ranking with no floor cannot decline, so it names a branch whether or not the branch means anything.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'network' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-cusps-and-rankings' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, network refused: no row for advanced m05-cusps-and-rankings ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, network refused: advanced m05-cusps-and-rankings ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why is the ranking''s behaviour called a note rather than a defect?', options = '["Every real case in the course ranks exactly as the header says, and a relative floor at one part in ten thousand of the largest branch mass would close it and change no ranking here.", "Because the whisper leg is a constructed fixture, and a leg carrying a millionth of a pound a day cannot occur on a solved network.", "Because the ranking is never read by a caller, since diagnose is a reporting function and no field in it feeds the solve.", "Because the independent oracle ranks a bottleneck too and agrees with the engine on every published case."]'::jsonb, explanation = 'The failure mode is failing open: a ranking with no floor cannot decline, so it names a branch whether or not the branch means anything.'
     where app_slug = 'network' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-cusps-and-rankings' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, network refused: advanced m05-cusps-and-rankings ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'network';
  if v_total <> 396 then raise exception 'digest-copy recut, network refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, network: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
