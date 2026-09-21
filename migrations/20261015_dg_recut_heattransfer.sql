-- ==========================================================================
-- DIGEST-COPY RECUT: heattransfer, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/heattransfer, built from its committed .py sources.
-- Rows: 3 (beginner 2, advanced 1).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-heattransfer.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 20
  select case
           when prompt = 'The teaching digest lists the states this balance will not compute. How many are there, and what do they have in common?' and options = '["Three, and every one of them is a temperature that moved in the wrong direction on one of the two streams.", "Twelve, one for each door of the module, since each door carries exactly one guard of its own.", "Six, and every one of them is caught after the duty has been formed, which is what lets each message quote it.", "Six, and every one of them is a state a saved study can carry, with each refusal naming the box rather than the physics."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A wrong-way hot outlet, a wrong-way cold outlet, a duty of zero, a duty disagreeing with a stated outlet, a duty that crosses the streams, and a duty parallel flow cannot deliver.' then 'old'
           when prompt = 'The course lists the states this balance will not compute. How many are there, and what do they have in common?' and options = '["Three, and every one of them is a temperature that moved in the wrong direction on one of the two streams.", "Twelve, one for each door of the module, since each door carries exactly one guard of its own.", "Six, and every one of them is caught after the duty has been formed, which is what lets each message quote it.", "Six, and every one of them is a state a saved study can carry, with each refusal naming the box rather than the physics."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A wrong-way hot outlet, a wrong-way cold outlet, a duty of zero, a duty disagreeing with a stated outlet, a duty that crosses the streams, and a duty parallel flow cannot deliver.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'heattransfer' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, heattransfer refused: no row for beginner final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, heattransfer refused: beginner final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course lists the states this balance will not compute. How many are there, and what do they have in common?', options = '["Three, and every one of them is a temperature that moved in the wrong direction on one of the two streams.", "Twelve, one for each door of the module, since each door carries exactly one guard of its own.", "Six, and every one of them is caught after the duty has been formed, which is what lets each message quote it.", "Six, and every one of them is a state a saved study can carry, with each refusal naming the box rather than the physics."]'::jsonb, explanation = 'A wrong-way hot outlet, a wrong-way cold outlet, a duty of zero, a duty disagreeing with a stated outlet, a duty that crosses the streams, and a duty parallel flow cannot deliver.'
     where app_slug = 'heattransfer' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, heattransfer refused: beginner final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-this-engine-rates ord 8
  select case
           when prompt = 'On the probes the teaching digest runs, three of the twelve doors handed back more than a message when they refused. What were the extra keys?' and options = '["The defaults the door would have substituted had it been willing to answer the call at all.", "The nearest input value that would have been accepted, so a caller can see how far outside the band the study sits.", "The intermediate figures the door had already reached at the moment it stopped computing.", "The numbers that produced the state the door refused."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A refusal carrying its evidence lets an interface show why a state is impossible rather than only that it is. Three of twelve is what those probes measured, so read it as a floor.' then 'old'
           when prompt = 'On the probes the course runs, three of the twelve doors handed back more than a message when they refused. What were the extra keys?' and options = '["The defaults the door would have substituted had it been willing to answer the call at all.", "The nearest input value that would have been accepted, so a caller can see how far outside the band the study sits.", "The intermediate figures the door had already reached at the moment it stopped computing.", "The numbers that produced the state the door refused."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A refusal carrying its evidence lets an interface show why a state is impossible rather than only that it is. Three of twelve is what those probes measured, so read it as a floor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'heattransfer' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-this-engine-rates' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, heattransfer refused: no row for beginner m01-what-this-engine-rates ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, heattransfer refused: beginner m01-what-this-engine-rates ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the probes the course runs, three of the twelve doors handed back more than a message when they refused. What were the extra keys?', options = '["The defaults the door would have substituted had it been willing to answer the call at all.", "The nearest input value that would have been accepted, so a caller can see how far outside the band the study sits.", "The intermediate figures the door had already reached at the moment it stopped computing.", "The numbers that produced the state the door refused."]'::jsonb, explanation = 'A refusal carrying its evidence lets an interface show why a state is impossible rather than only that it is. Three of twelve is what those probes measured, so read it as a floor.'
     where app_slug = 'heattransfer' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-this-engine-rates' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, heattransfer refused: beginner m01-what-this-engine-rates ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 38
  select case
           when prompt = 'This module exports 17 names in all. How many of them are frozen tables rather than functions?' and options = '["2, which are the declared constants and the held register.", "7, one for each entry the held register carries.", "3, which are the declared constants, the declared bounds and the held register.", "12, one for each door that takes a named-argument object."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Section 20 reads the held register itself rather than quoting a count from the module''s header sentence, which is how the disagreement between 7 and six was found.' then 'old'
           when prompt = 'This module exports 17 names in all. How many of them are frozen tables rather than functions?' and options = '["2, which are the declared constants and the held register.", "7, one for each entry the held register carries.", "3, which are the declared constants, the declared bounds and the held register.", "12, one for each door that takes a named-argument object."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course reads the held register itself rather than quoting a count from the module''s header sentence, which is how the disagreement between 7 and six was found.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'heattransfer' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, heattransfer refused: no row for advanced final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, heattransfer refused: advanced final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'This module exports 17 names in all. How many of them are frozen tables rather than functions?', options = '["2, which are the declared constants and the held register.", "7, one for each entry the held register carries.", "3, which are the declared constants, the declared bounds and the held register.", "12, one for each door that takes a named-argument object."]'::jsonb, explanation = 'The course reads the held register itself rather than quoting a count from the module''s header sentence, which is how the disagreement between 7 and six was found.'
     where app_slug = 'heattransfer' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, heattransfer refused: advanced final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'heattransfer';
  if v_total <> 396 then raise exception 'digest-copy recut, heattransfer refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, heattransfer: % of 3 rows updated, the rest already carried the recut text', v_updated;
end $$;
