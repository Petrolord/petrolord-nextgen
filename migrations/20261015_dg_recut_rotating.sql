-- ==========================================================================
-- DIGEST-COPY RECUT: rotating, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/rotating, built from its committed .py sources.
-- Rows: 4 (beginner 2, advanced 2).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-rotating.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner m01-what-these-engines-size ord 1
  select case
           when prompt = 'compression.js takes its two power packagings from one module, and pumps.js takes its kilowatt conversion from the same one. Which module?' and options = '["engines/production/gasProperties.js, which already holds the gas constant and the molecular weight of air and is therefore where the shared packagings live.", "engines/facilities/separatorSizing.js, which already supplies the compressibility window and is the nearest shared facilities module.", "lib/units/fieldUnits.js, which both of them read, so one definition of a horsepower serves the liquid machine and the gas machine alike.", "Neither module reads a shared units file. Each one writes its own kilowatt and Btu factors inline at the point of use."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest names lib/units/fieldUnits.js as the source of the two power packagings, read by compression.js and by pumps.js.' then 'old'
           when prompt = 'compression.js takes its two power packagings from one module, and pumps.js takes its kilowatt conversion from the same one. Which module?' and options = '["engines/production/gasProperties.js, which already holds the gas constant and the molecular weight of air and is therefore where the shared packagings live.", "engines/facilities/separatorSizing.js, which already supplies the compressibility window and is the nearest shared facilities module.", "lib/units/fieldUnits.js, which both of them read, so one definition of a horsepower serves the liquid machine and the gas machine alike.", "Neither module reads a shared units file. Each one writes its own kilowatt and Btu factors inline at the point of use."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course names lib/units/fieldUnits.js as the source of the two power packagings, read by compression.js and by pumps.js.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'rotating' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-size' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, rotating refused: no row for beginner m01-what-these-engines-size ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, rotating refused: beginner m01-what-these-engines-size ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'compression.js takes its two power packagings from one module, and pumps.js takes its kilowatt conversion from the same one. Which module?', options = '["engines/production/gasProperties.js, which already holds the gas constant and the molecular weight of air and is therefore where the shared packagings live.", "engines/facilities/separatorSizing.js, which already supplies the compressibility window and is the nearest shared facilities module.", "lib/units/fieldUnits.js, which both of them read, so one definition of a horsepower serves the liquid machine and the gas machine alike.", "Neither module reads a shared units file. Each one writes its own kilowatt and Btu factors inline at the point of use."]'::jsonb, explanation = 'The course names lib/units/fieldUnits.js as the source of the two power packagings, read by compression.js and by pumps.js.'
     where app_slug = 'rotating' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-size' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, rotating refused: beginner m01-what-these-engines-size ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-these-engines-size ord 2
  select case
           when prompt = 'compression.js takes its compressibility validity window from another module. Which one, and what does that tell you about the window?' and options = '["engines/facilities/separatorSizing.js, so the same declared range governs a separator and a compressor stage rather than each module carrying a range of its own.", "engines/production/gasProperties.js, which is also where the Rankine offset and the molecular weight of air come from.", "lib/units/fieldUnits.js, on the grounds that a validity range is a unit-level statement about the correlation.", "It declares its own window internally, which is why the refusal message can quote the limits back at the caller."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest preamble lists three sources for compression.js: gasProperties.js for the gas constant, the molecular weight of air and the Rankine offset, separatorSizing.js for the compressibility validity window, and fieldUnits.js for the two power packagings.' then 'old'
           when prompt = 'compression.js takes its compressibility validity window from another module. Which one, and what does that tell you about the window?' and options = '["engines/facilities/separatorSizing.js, so the same declared range governs a separator and a compressor stage rather than each module carrying a range of its own.", "engines/production/gasProperties.js, which is also where the Rankine offset and the molecular weight of air come from.", "lib/units/fieldUnits.js, on the grounds that a validity range is a unit-level statement about the correlation.", "It declares its own window internally, which is why the refusal message can quote the limits back at the caller."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists three sources for compression.js: gasProperties.js for the gas constant, the molecular weight of air and the Rankine offset, separatorSizing.js for the compressibility validity window, and fieldUnits.js for the two power packagings.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'rotating' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-size' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, rotating refused: no row for beginner m01-what-these-engines-size ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, rotating refused: beginner m01-what-these-engines-size ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'compression.js takes its compressibility validity window from another module. Which one, and what does that tell you about the window?', options = '["engines/facilities/separatorSizing.js, so the same declared range governs a separator and a compressor stage rather than each module carrying a range of its own.", "engines/production/gasProperties.js, which is also where the Rankine offset and the molecular weight of air come from.", "lib/units/fieldUnits.js, on the grounds that a validity range is a unit-level statement about the correlation.", "It declares its own window internally, which is why the refusal message can quote the limits back at the caller."]'::jsonb, explanation = 'The course lists three sources for compression.js: gasProperties.js for the gas constant, the molecular weight of air and the Rankine offset, separatorSizing.js for the compressibility validity window, and fieldUnits.js for the two power packagings.'
     where app_slug = 'rotating' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-size' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, rotating refused: beginner m01-what-these-engines-size ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 41
  select case
           when prompt = 'The Hydraulic Institute viscosity correction is held, and the digest names a further simplification inside it. What is it?' and options = '["The efficiency factor is taken equal to the flow factor at best efficiency.", "The correlating parameter is evaluated at the shutoff head rather than at the duty.", "The head factor is taken equal to the flow factor at best efficiency.", "The flow factor is inverted in closed form rather than solved, which loses a digit."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The correction is empirical and unsourced in this repository, so no graded value in this course is a corrected flow, head or efficiency.' then 'old'
           when prompt = 'The Hydraulic Institute viscosity correction is held, and the course names a further simplification inside it. What is it?' and options = '["The efficiency factor is taken equal to the flow factor at best efficiency.", "The correlating parameter is evaluated at the shutoff head rather than at the duty.", "The head factor is taken equal to the flow factor at best efficiency.", "The flow factor is inverted in closed form rather than solved, which loses a digit."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The correction is empirical and unsourced in this repository, so no graded value in this course is a corrected flow, head or efficiency.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'rotating' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, rotating refused: no row for advanced final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, rotating refused: advanced final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Hydraulic Institute viscosity correction is held, and the course names a further simplification inside it. What is it?', options = '["The efficiency factor is taken equal to the flow factor at best efficiency.", "The correlating parameter is evaluated at the shutoff head rather than at the duty.", "The head factor is taken equal to the flow factor at best efficiency.", "The flow factor is inverted in closed form rather than solved, which loses a digit."]'::jsonb, explanation = 'The correction is empirical and unsourced in this repository, so no graded value in this course is a corrected flow, head or efficiency.'
     where app_slug = 'rotating' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, rotating refused: advanced final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 8
  select case
           when prompt = 'A gate written against one of those goldens therefore has to carry a tolerance. Where should the tolerance come from?' and options = '["From the precision the digest prints that field at, so the gate and the course agree.", "From the worst gap on the whole table, applied to every field so one number covers them all.", "From the tolerance the published file declares beside each case it carries.", "From the size of the disagreement the two routes really have."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Demanding equality on that table would fail on arithmetic rather than on error, and a tolerance chosen because it looks tidy is a tolerance chosen against nothing.' then 'old'
           when prompt = 'A gate written against one of those goldens therefore has to carry a tolerance. Where should the tolerance come from?' and options = '["From the precision the lesson prints that field at, so the gate and the course agree.", "From the worst gap on the whole table, applied to every field so one number covers them all.", "From the tolerance the published file declares beside each case it carries.", "From the size of the disagreement the two routes really have."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Demanding equality on that table would fail on arithmetic rather than on error, and a tolerance chosen because it looks tidy is a tolerance chosen against nothing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'rotating' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, rotating refused: no row for advanced m06-the-expert-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, rotating refused: advanced m06-the-expert-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A gate written against one of those goldens therefore has to carry a tolerance. Where should the tolerance come from?', options = '["From the precision the lesson prints that field at, so the gate and the course agree.", "From the worst gap on the whole table, applied to every field so one number covers them all.", "From the tolerance the published file declares beside each case it carries.", "From the size of the disagreement the two routes really have."]'::jsonb, explanation = 'Demanding equality on that table would fail on arithmetic rather than on error, and a tolerance chosen because it looks tidy is a tolerance chosen against nothing.'
     where app_slug = 'rotating' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, rotating refused: advanced m06-the-expert-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'rotating';
  if v_total <> 396 then raise exception 'digest-copy recut, rotating refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, rotating: % of 4 rows updated, the rest already carried the recut text', v_updated;
end $$;
