-- ==========================================================================
-- DIGEST-COPY RECUT: crude, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/crude, built from its committed .py sources.
-- Rows: 51 (beginner 4, intermediate 32, advanced 15).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-crude.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 2
  select case
           when prompt = 'For three crudes at 50, 30 and 20, the digest prints the figure 29.6100 in two places. What does it stand for in each?' and options = '["The engine''s API for the blend typed by volume, and the mass-weighted mean of the API numbers for the same blend.", "The engine''s API for the blend typed by mass, and a rounding of the 29.2240 typed by volume.", "The volume-weighted mean of the API numbers, printed a second time as a check on the engine.", "The volume-weighted mean of the API numbers for the blend typed by volume, and the engine''s API for the blend typed by mass."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Typed by volume the engine gives 29.2240 and the shortcut gives 29.6100. Typed by mass the engine gives 29.6100. The same three numbers make two different blends depending on their basis.' then 'old'
           when prompt = 'For three crudes at 50, 30 and 20, the course prints the figure 29.6100 in two places. What does it stand for in each?' and options = '["The engine''s API for the blend typed by volume, and the mass-weighted mean of the API numbers for the same blend.", "The engine''s API for the blend typed by mass, and a rounding of the 29.2240 typed by volume.", "The volume-weighted mean of the API numbers, printed a second time as a check on the engine.", "The volume-weighted mean of the API numbers for the blend typed by volume, and the engine''s API for the blend typed by mass."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Typed by volume the engine gives 29.2240 and the shortcut gives 29.6100. Typed by mass the engine gives 29.6100. The same three numbers make two different blends depending on their basis.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for beginner final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: beginner final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For three crudes at 50, 30 and 20, the course prints the figure 29.6100 in two places. What does it stand for in each?', options = '["The engine''s API for the blend typed by volume, and the mass-weighted mean of the API numbers for the same blend.", "The engine''s API for the blend typed by mass, and a rounding of the 29.2240 typed by volume.", "The volume-weighted mean of the API numbers, printed a second time as a check on the engine.", "The volume-weighted mean of the API numbers for the blend typed by volume, and the engine''s API for the blend typed by mass."]'::jsonb, explanation = 'Typed by volume the engine gives 29.2240 and the shortcut gives 29.6100. Typed by mass the engine gives 29.6100. The same three numbers make two different blends depending on their basis.'
     where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: beginner final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 3
  select case
           when prompt = 'What does the engine assume about volume when two crudes of different gravity are poured together?' and options = '["The volume shrinks in proportion to the two crudes'' API contrast on mixing.", "Mass is conserved, and the volume is found from the blend''s API.", "Volume is taken as conserved, as mass is.", "Volume is conserved only within 15.0000 API of contrast."]'::jsonb and answer_index = 2 and explanation is not distinct from 'blendCrudes blends specific gravity on volume, and the digest states the assumption: mass is conserved and volume is taken as conserved.' then 'old'
           when prompt = 'What does the engine assume about volume when two crudes of different gravity are poured together?' and options = '["The volume shrinks in proportion to the two crudes'' API contrast on mixing.", "Mass is conserved, and the volume is found from the blend''s API.", "Volume is taken as conserved, as mass is.", "Volume is conserved only within 15.0000 API of contrast."]'::jsonb and answer_index = 2 and explanation is not distinct from 'blendCrudes blends specific gravity on volume, and the course states the assumption: mass is conserved and volume is taken as conserved.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for beginner final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: beginner final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the engine assume about volume when two crudes of different gravity are poured together?', options = '["The volume shrinks in proportion to the two crudes'' API contrast on mixing.", "Mass is conserved, and the volume is found from the blend''s API.", "Volume is taken as conserved, as mass is.", "Volume is conserved only within 15.0000 API of contrast."]'::jsonb, explanation = 'blendCrudes blends specific gravity on volume, and the course states the assumption: mass is conserved and volume is taken as conserved.'
     where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: beginner final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 34
  select case
           when prompt = 'Why does the digest print a column called the volume-weighted mean of the API numbers when the engine never reports it?' and options = '["Because the engine reports it as a check figure whenever the blend API is formed.", "Because contracts quote it, and the engine converts it to specific gravity later.", "So the shortcut can be read beside the answer, computed with the engine''s own blendOnVolume.", "Because it is the engine''s answer for a blend whose shares are typed by volume."]'::jsonb and answer_index = 2 and explanation is not distinct from 'API itself is never averaged. The column is the shortcut the engine refuses to take, computed so that it can be read beside the right answer.' then 'old'
           when prompt = 'Why does the course print a column called the volume-weighted mean of the API numbers when the engine never reports it?' and options = '["Because the engine reports it as a check figure whenever the blend API is formed.", "Because contracts quote it, and the engine converts it to specific gravity later.", "So the shortcut can be read beside the answer, computed with the engine''s own blendOnVolume.", "Because it is the engine''s answer for a blend whose shares are typed by volume."]'::jsonb and answer_index = 2 and explanation is not distinct from 'API itself is never averaged. The column is the shortcut the engine refuses to take, computed so that it can be read beside the right answer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for beginner final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: beginner final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does the course print a column called the volume-weighted mean of the API numbers when the engine never reports it?', options = '["Because the engine reports it as a check figure whenever the blend API is formed.", "Because contracts quote it, and the engine converts it to specific gravity later.", "So the shortcut can be read beside the answer, computed with the engine''s own blendOnVolume.", "Because it is the engine''s answer for a blend whose shares are typed by volume."]'::jsonb, explanation = 'API itself is never averaged. The column is the shortcut the engine refuses to take, computed so that it can be read beside the right answer.'
     where app_slug = 'crude' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: beginner final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-assay-carries ord 13
  select case
           when prompt = 'Library inputs such as 4.6 cSt and 22 cSt print with one decimal or none, while specific gravity prints as 0.8408. Why?' and options = '["Inputs print as typed, and every computed figure prints to four decimals.", "The engine rounds each input to its measured precision.", "Viscosity is stored in whole cSt, and specific gravity needs four decimals for API.", "Only specific gravity is blended, so only it carries full precision."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s precision rule: every computed figure prints to four decimals, and every input prints exactly as it is typed. Viscosity in the library is typed, and specific gravity is computed from API by sgFromApi.' then 'old'
           when prompt = 'Library inputs such as 4.6 cSt and 22 cSt print with one decimal or none, while specific gravity prints as 0.8408. Why?' and options = '["Inputs print as typed, and every computed figure prints to four decimals.", "The engine rounds each input to its measured precision.", "Viscosity is stored in whole cSt, and specific gravity needs four decimals for API.", "Only specific gravity is blended, so only it carries full precision."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s precision rule: every computed figure prints to four decimals, and every input prints exactly as it is typed. Viscosity in the library is typed, and specific gravity is computed from API by sgFromApi.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-assay-carries' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for beginner m01-what-an-assay-carries ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: beginner m01-what-an-assay-carries ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Library inputs such as 4.6 cSt and 22 cSt print with one decimal or none, while specific gravity prints as 0.8408. Why?', options = '["Inputs print as typed, and every computed figure prints to four decimals.", "The engine rounds each input to its measured precision.", "Viscosity is stored in whole cSt, and specific gravity needs four decimals for API.", "Only specific gravity is blended, so only it carries full precision."]'::jsonb, explanation = 'The course''s precision rule: every computed figure prints to four decimals, and every input prints exactly as it is typed. Viscosity in the library is typed, and specific gravity is computed from API by sgFromApi.'
     where app_slug = 'crude' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-assay-carries' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: beginner m01-what-an-assay-carries ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 2
  select case
           when prompt = 'The studio opens on its default pair, 60 and 40. What does the digest print for the two crudes'' own fifty percent points averaged by volume share, minus the engine''s interpolated T50?' and options = '["-2.9207 F.", "-3.3184 F.", "72.8571 F.", "-5.1429 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'On the default pair the engine reads T50 at 617.1429 F and the crudes'' T50 averaged by volume share is 612.0000 F; the shortcut table prints that difference as -5.1429 F. Each other option sits in the same table on another row or in another column.' then 'old'
           when prompt = 'The studio opens on its default pair, 60 and 40. What does the course print for the two crudes'' own fifty percent points averaged by volume share, minus the engine''s interpolated T50?' and options = '["-2.9207 F.", "-3.3184 F.", "72.8571 F.", "-5.1429 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'On the default pair the engine reads T50 at 617.1429 F and the crudes'' T50 averaged by volume share is 612.0000 F; the shortcut table prints that difference as -5.1429 F. Each other option sits in the same table on another row or in another column.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio opens on its default pair, 60 and 40. What does the course print for the two crudes'' own fifty percent points averaged by volume share, minus the engine''s interpolated T50?', options = '["-2.9207 F.", "-3.3184 F.", "72.8571 F.", "-5.1429 F."]'::jsonb, explanation = 'On the default pair the engine reads T50 at 617.1429 F and the crudes'' T50 averaged by volume share is 612.0000 F; the shortcut table prints that difference as -5.1429 F. Each other option sits in the same table on another row or in another column.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 9
  select case
           when prompt = 'The Kwale blend''s curve reaches 212.2121 F at which volume percent?' and options = '["8.0714 percent.", "14.5833 percent.", "10 percent.", "30 percent."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest reads the Kwale blend at 10, 30, 50, 70 and 90 percent: 212.2121, 411.6294, 587.3184, 796.5882 and 1133.0737 F. 8.0714 is the blend at 190 F and 14.5833 at 265 F.' then 'old'
           when prompt = 'The Kwale blend''s curve reaches 212.2121 F at which volume percent?' and options = '["8.0714 percent.", "14.5833 percent.", "10 percent.", "30 percent."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course reads the Kwale blend at 10, 30, 50, 70 and 90 percent: 212.2121, 411.6294, 587.3184, 796.5882 and 1133.0737 F. 8.0714 is the blend at 190 F and 14.5833 at 265 F.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Kwale blend''s curve reaches 212.2121 F at which volume percent?', options = '["8.0714 percent.", "14.5833 percent.", "10 percent.", "30 percent."]'::jsonb, explanation = 'The course reads the Kwale blend at 10, 30, 50, 70 and 90 percent: 212.2121, 411.6294, 587.3184, 796.5882 and 1133.0737 F. 8.0714 is the blend at 190 F and 14.5833 at 265 F.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 17
  select case
           when prompt = 'Which cut set does the digest call a vacuum refinery''s?' and options = '["Kwale''s own cuts, with a single heavy cut from 650 F upward.", "The cut set drawn inside the Ebocha partial curve, from 110 F to 920 F.", "The studio''s default cuts, which split the heavy end at 1000 F.", "Kwale''s cuts with the diesel end point moved from 650 F to 700 F."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The studio''s default cuts are printed on the Kwale blend for contrast as a vacuum refinery''s cut set: Vacuum gasoil runs from 650 F to 1000 F and Vacuum residue from 1000 F with no upper bound.' then 'old'
           when prompt = 'Which cut set does the course call a vacuum refinery''s?' and options = '["Kwale''s own cuts, with a single heavy cut from 650 F upward.", "The cut set drawn inside the Ebocha partial curve, from 110 F to 920 F.", "The studio''s default cuts, which split the heavy end at 1000 F.", "Kwale''s cuts with the diesel end point moved from 650 F to 700 F."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The studio''s default cuts are printed on the Kwale blend for contrast as a vacuum refinery''s cut set: Vacuum gasoil runs from 650 F to 1000 F and Vacuum residue from 1000 F with no upper bound.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which cut set does the course call a vacuum refinery''s?', options = '["Kwale''s own cuts, with a single heavy cut from 650 F upward.", "The cut set drawn inside the Ebocha partial curve, from 110 F to 920 F.", "The studio''s default cuts, which split the heavy end at 1000 F.", "Kwale''s cuts with the diesel end point moved from 650 F to 700 F."]'::jsonb, explanation = 'The studio''s default cuts are printed on the Kwale blend for contrast as a vacuum refinery''s cut set: Vacuum gasoil runs from 650 F to 1000 F and Vacuum residue from 1000 F with no upper bound.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 26
  select case
           when prompt = 'Under the complete Kwale valuation the digest prints: Costs taken as zero because they were blank: nothing. What does that line confirm?' and options = '["assumedZero is empty, so the netback of 64.9473 carries no assumed zero.", "Every cut had a price, so unpricedCuts is empty and the valuation is complete.", "Every cost was refused and none entered the netback of 64.9473.", "The loss was taken on the product side, so no cost was reduced by it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A cost left blank would be taken as zero and named, as freight and losses are in the 67.4412 $/bbl case. Complete: true is the separate line about prices and yields.' then 'old'
           when prompt = 'Under the complete Kwale valuation the course prints: Costs taken as zero because they were blank: nothing. What does that line confirm?' and options = '["assumedZero is empty, so the netback of 64.9473 carries no assumed zero.", "Every cut had a price, so unpricedCuts is empty and the valuation is complete.", "Every cost was refused and none entered the netback of 64.9473.", "The loss was taken on the product side, so no cost was reduced by it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A cost left blank would be taken as zero and named, as freight and losses are in the 67.4412 $/bbl case. Complete: true is the separate line about prices and yields.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Under the complete Kwale valuation the course prints: Costs taken as zero because they were blank: nothing. What does that line confirm?', options = '["assumedZero is empty, so the netback of 64.9473 carries no assumed zero.", "Every cut had a price, so unpricedCuts is empty and the valuation is complete.", "Every cost was refused and none entered the netback of 64.9473.", "The loss was taken on the product side, so no cost was reduced by it."]'::jsonb, explanation = 'A cost left blank would be taken as zero and named, as freight and losses are in the 67.4412 $/bbl case. Complete: true is the separate line about prices and yields.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 31
  select case
           when prompt = 'What does the digest print as the first point of the default pair''s blend curve at or past 50 percent?' and options = '["650 F.", "617.1429 F.", "614.2222 F.", "690 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The shortcut table prints the default pair''s grid reading minus the engine as 72.8571 F, the grid reading being 690 F. The Kwale blend''s grid reading is 650 F. The other two options are the default pair''s own interpolated and mass-weighted readings.' then 'old'
           when prompt = 'What does the course print as the first point of the default pair''s blend curve at or past 50 percent?' and options = '["650 F.", "617.1429 F.", "614.2222 F.", "690 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The shortcut table prints the default pair''s grid reading minus the engine as 72.8571 F, the grid reading being 690 F. The Kwale blend''s grid reading is 650 F. The other two options are the default pair''s own interpolated and mass-weighted readings.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print as the first point of the default pair''s blend curve at or past 50 percent?', options = '["650 F.", "617.1429 F.", "614.2222 F.", "690 F."]'::jsonb, explanation = 'The shortcut table prints the default pair''s grid reading minus the engine as 72.8571 F, the grid reading being 690 F. The Kwale blend''s grid reading is 650 F. The other two options are the default pair''s own interpolated and mass-weighted readings.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 33
  select case
           when prompt = 'What kind of test is D86, and how is a crude assay reported?' and options = '["D86 is the crude assay test; TBP is kept for finished products.", "D86 is a product test; a crude assay is reported as a TBP distillation.", "D86 is a product test; a crude assay is reported as a D86 curve converted by d86ToTbp.", "D86 is a crude assay test that d86ToTbp converts with its own table."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: D86 is a product test; a crude assay is reported as a TBP distillation. d86ToTbp ships no coefficient table, and called without one it refuses.' then 'old'
           when prompt = 'What kind of test is D86, and how is a crude assay reported?' and options = '["D86 is the crude assay test; TBP is kept for finished products.", "D86 is a product test; a crude assay is reported as a TBP distillation.", "D86 is a product test; a crude assay is reported as a D86 curve converted by d86ToTbp.", "D86 is a crude assay test that d86ToTbp converts with its own table."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: D86 is a product test; a crude assay is reported as a TBP distillation. d86ToTbp ships no coefficient table, and called without one it refuses.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What kind of test is D86, and how is a crude assay reported?', options = '["D86 is the crude assay test; TBP is kept for finished products.", "D86 is a product test; a crude assay is reported as a TBP distillation.", "D86 is a product test; a crude assay is reported as a D86 curve converted by d86ToTbp.", "D86 is a crude assay test that d86ToTbp converts with its own table."]'::jsonb, explanation = 'The course: D86 is a product test; a crude assay is reported as a TBP distillation. d86ToTbp ships no coefficient table, and called without one it refuses.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 42
  select case
           when prompt = 'The Kwale blend, 55 and 45, prints API 33.1219 and sulfur 0.2268 wt%. Which SG sits beside them, the SG that Watson K divides by?' and options = '["0.8595.", "0.8727.", "0.8328.", "0.8922."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 0.8727 is the studio''s default pair''s SG, 0.8328 Kwale Light''s and 0.8922 Ughelli Medium''s.' then 'old'
           when prompt = 'The Kwale blend, 55 and 45, prints API 33.1219 and sulfur 0.2268 wt%. Which SG sits beside them, the SG that Watson K divides by?' and options = '["0.8595.", "0.8727.", "0.8328.", "0.8922."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 0.8727 is the studio''s default pair''s SG, 0.8328 Kwale Light''s and 0.8922 Ughelli Medium''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Kwale blend, 55 and 45, prints API 33.1219 and sulfur 0.2268 wt%. Which SG sits beside them, the SG that Watson K divides by?', options = '["0.8595.", "0.8727.", "0.8328.", "0.8922."]'::jsonb, explanation = 'The course prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 0.8727 is the studio''s default pair''s SG, 0.8328 Kwale Light''s and 0.8922 Ughelli Medium''s.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-blends-own-curve ord 3
  select case
           when prompt = 'A TBP volume percent is weighted by volume share when two crudes are blended. What is the reason?' and options = '["Volume is conserved on mixing and mass is not, so every property of a blend, sulfur included, has to be weighted on volume shares.", "A TBP figure is a volume percent distilled, and the digest''s rule is that yields are additive on volume.", "The engine holds no gravity for a crude at the curve step, so a volume share is the only weight it can form for the yields there.", "A volume weighting gives the larger blend yield at every temperature, which is the conservative reading."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s rule: yields are additive on volume, so at any temperature the blend has distilled the volume-weighted sum of what each crude has distilled. Sulfur and the other per-mass properties blend on mass. The engine can weight yields on mass too: module 3 prints blendOnMass beside the engine''s cut yields.' then 'old'
           when prompt = 'A TBP volume percent is weighted by volume share when two crudes are blended. What is the reason?' and options = '["Volume is conserved on mixing and mass is not, so every property of a blend, sulfur included, has to be weighted on volume shares.", "A TBP figure is a volume percent distilled, and the course''s rule is that yields are additive on volume.", "The engine holds no gravity for a crude at the curve step, so a volume share is the only weight it can form for the yields there.", "A volume weighting gives the larger blend yield at every temperature, which is the conservative reading."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s rule: yields are additive on volume, so at any temperature the blend has distilled the volume-weighted sum of what each crude has distilled. Sulfur and the other per-mass properties blend on mass. The engine can weight yields on mass too: module 3 prints blendOnMass beside the engine''s cut yields.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-blends-own-curve' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m01-the-blends-own-curve ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m01-the-blends-own-curve ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A TBP volume percent is weighted by volume share when two crudes are blended. What is the reason?', options = '["Volume is conserved on mixing and mass is not, so every property of a blend, sulfur included, has to be weighted on volume shares.", "A TBP figure is a volume percent distilled, and the course''s rule is that yields are additive on volume.", "The engine holds no gravity for a crude at the curve step, so a volume share is the only weight it can form for the yields there.", "A volume weighting gives the larger blend yield at every temperature, which is the conservative reading."]'::jsonb, explanation = 'The course''s rule: yields are additive on volume, so at any temperature the blend has distilled the volume-weighted sum of what each crude has distilled. Sulfur and the other per-mass properties blend on mass. The engine can weight yields on mass too: module 3 prints blendOnMass beside the engine''s cut yields.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-blends-own-curve' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m01-the-blends-own-curve ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-blends-own-curve ord 8
  select case
           when prompt = 'Beside the Kwale blend''s curve, the digest prints the blend''s properties at 55 and 45. Which set is it?' and options = '["API 32.8173, SG 0.8611 and sulfur 0.2642 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a volume basis.", "API 38.4, SG 0.8328 and sulfur 0.11 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a mass basis."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 38.4, 0.8328 and 0.11 are Kwale Light''s own figures, and 32.8173, 0.8611 and 0.2642 belong to the Associate tier''s Obigbo export blend.' then 'old'
           when prompt = 'Beside the Kwale blend''s curve, the course prints the blend''s properties at 55 and 45. Which set is it?' and options = '["API 32.8173, SG 0.8611 and sulfur 0.2642 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a volume basis.", "API 38.4, SG 0.8328 and sulfur 0.11 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a mass basis."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 38.4, 0.8328 and 0.11 are Kwale Light''s own figures, and 32.8173, 0.8611 and 0.2642 belong to the Associate tier''s Obigbo export blend.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-blends-own-curve' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m01-the-blends-own-curve ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m01-the-blends-own-curve ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside the Kwale blend''s curve, the course prints the blend''s properties at 55 and 45. Which set is it?', options = '["API 32.8173, SG 0.8611 and sulfur 0.2642 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a volume basis.", "API 38.4, SG 0.8328 and sulfur 0.11 wt% on a mass basis.", "API 33.1219, SG 0.8595 and sulfur 0.2268 wt% on a mass basis."]'::jsonb, explanation = 'The course prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 38.4, 0.8328 and 0.11 are Kwale Light''s own figures, and 32.8173, 0.8611 and 0.2642 belong to the Associate tier''s Obigbo export blend.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-blends-own-curve' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m01-the-blends-own-curve ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 4
  select case
           when prompt = 'What does the digest print for the grid reading minus the engine, on the Kwale blend and on the studio''s default pair?' and options = '["72.8571 F on the Kwale blend and 62.6816 F on the default pair.", "62.6816 F on the Kwale blend and 72.8571 F on the default pair.", "-3.3184 F on the Kwale blend and -5.1429 F on the default pair.", "62.6816 F on the Kwale blend and -2.9207 F on the default pair."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The Kwale grid reading is 650 F against 587.3184 F, and the default pair''s is 690 F against 617.1429 F. -3.3184 and -5.1429 F are the volume-weighted means minus the engine, and -2.9207 F is the default pair''s mass-weighted mean minus the engine.' then 'old'
           when prompt = 'What does the course print for the grid reading minus the engine, on the Kwale blend and on the studio''s default pair?' and options = '["72.8571 F on the Kwale blend and 62.6816 F on the default pair.", "62.6816 F on the Kwale blend and 72.8571 F on the default pair.", "-3.3184 F on the Kwale blend and -5.1429 F on the default pair.", "62.6816 F on the Kwale blend and -2.9207 F on the default pair."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The Kwale grid reading is 650 F against 587.3184 F, and the default pair''s is 690 F against 617.1429 F. -3.3184 and -5.1429 F are the volume-weighted means minus the engine, and -2.9207 F is the default pair''s mass-weighted mean minus the engine.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print for the grid reading minus the engine, on the Kwale blend and on the studio''s default pair?', options = '["72.8571 F on the Kwale blend and 62.6816 F on the default pair.", "62.6816 F on the Kwale blend and 72.8571 F on the default pair.", "-3.3184 F on the Kwale blend and -5.1429 F on the default pair.", "62.6816 F on the Kwale blend and -2.9207 F on the default pair."]'::jsonb, explanation = 'The Kwale grid reading is 650 F against 587.3184 F, and the default pair''s is 690 F against 617.1429 F. -3.3184 and -5.1429 F are the volume-weighted means minus the engine, and -2.9207 F is the default pair''s mass-weighted mean minus the engine.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 5
  select case
           when prompt = 'Which volume percents make up the digest''s table of other points on the Kwale blend, the T50 row among them?' and options = '["At 0, 25, 50, 75 and 100 percent.", "At each of the 14 points of the blend''s curve.", "At 10, 30, 50, 70 and 90 percent distilled.", "At 50 percent alone, the blend''s T50."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That table has five rows, 10, 30, 50, 70 and 90 percent, and its 50 percent row is the engine''s T50 of 587.3184 F. The blend''s 14 curve points sit at the temperatures the two crudes measured.' then 'old'
           when prompt = 'Which volume percents make up the course''s table of other points on the Kwale blend, the T50 row among them?' and options = '["At 0, 25, 50, 75 and 100 percent.", "At each of the 14 points of the blend''s curve.", "At 10, 30, 50, 70 and 90 percent distilled.", "At 50 percent alone, the blend''s T50."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That table has five rows, 10, 30, 50, 70 and 90 percent, and its 50 percent row is the engine''s T50 of 587.3184 F. The blend''s 14 curve points sit at the temperatures the two crudes measured.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which volume percents make up the course''s table of other points on the Kwale blend, the T50 row among them?', options = '["At 0, 25, 50, 75 and 100 percent.", "At each of the 14 points of the blend''s curve.", "At 10, 30, 50, 70 and 90 percent distilled.", "At 50 percent alone, the blend''s T50."]'::jsonb, explanation = 'That table has five rows, 10, 30, 50, 70 and 90 percent, and its 50 percent row is the engine''s T50 of 587.3184 F. The blend''s 14 curve points sit at the temperatures the two crudes measured.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 6
  select case
           when prompt = 'For the Kwale blend, what is the volume-weighted mean of the crudes'' own T50, and how far does it sit from the engine?' and options = '["584.0000 F, which the digest prints as -3.3184 F against the engine.", "586.0503 F, which the digest prints as -1.2681 F against the engine.", "584.0000 F, which the digest prints as 62.6816 F against the engine.", "612.0000 F, which the digest prints as -5.1429 F against the engine."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The volume-weighted mean of 530 and 650 at 55 and 45 is printed as 584.0000 F. 586.0503 F is the mass-weighted mean, and 612.0000 F belongs to the default pair.' then 'old'
           when prompt = 'For the Kwale blend, what is the volume-weighted mean of the crudes'' own T50, and how far does it sit from the engine?' and options = '["584.0000 F, which the course prints as -3.3184 F against the engine.", "586.0503 F, which the course prints as -1.2681 F against the engine.", "584.0000 F, which the course prints as 62.6816 F against the engine.", "612.0000 F, which the course prints as -5.1429 F against the engine."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The volume-weighted mean of 530 and 650 at 55 and 45 is printed as 584.0000 F. 586.0503 F is the mass-weighted mean, and 612.0000 F belongs to the default pair.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For the Kwale blend, what is the volume-weighted mean of the crudes'' own T50, and how far does it sit from the engine?', options = '["584.0000 F, which the course prints as -3.3184 F against the engine.", "586.0503 F, which the course prints as -1.2681 F against the engine.", "584.0000 F, which the course prints as 62.6816 F against the engine.", "612.0000 F, which the course prints as -5.1429 F against the engine."]'::jsonb, explanation = 'The volume-weighted mean of 530 and 650 at 55 and 45 is printed as 584.0000 F. 586.0503 F is the mass-weighted mean, and 612.0000 F belongs to the default pair.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 7
  select case
           when prompt = 'The mass-weighted mean of the API numbers is the blend API. Does mass weighting do the same for the Kwale crudes'' own T50?' and options = '["Yes: the digest prints the mass-weighted mean minus the engine as 0.0000 F.", "No: the digest prints the mass-weighted mean minus the engine as 62.6816 F.", "Yes: the mass-weighted mean of the crudes'' T50 is the engine''s 587.3184 F.", "No: the digest prints the mass-weighted mean minus the engine as -1.2681 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The Kwale row prints the mass-weighted mean of the crudes'' T50 as 586.0503 F beside the engine''s 587.3184 F, and the difference as -1.2681 F. 62.6816 F is the grid reading minus the engine. The 0.0000 belongs to the mass-weighted mean of the API numbers.' then 'old'
           when prompt = 'The mass-weighted mean of the API numbers is the blend API. Does mass weighting do the same for the Kwale crudes'' own T50?' and options = '["Yes: the course prints the mass-weighted mean minus the engine as 0.0000 F.", "No: the course prints the mass-weighted mean minus the engine as 62.6816 F.", "Yes: the mass-weighted mean of the crudes'' T50 is the engine''s 587.3184 F.", "No: the course prints the mass-weighted mean minus the engine as -1.2681 F."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The Kwale row prints the mass-weighted mean of the crudes'' T50 as 586.0503 F beside the engine''s 587.3184 F, and the difference as -1.2681 F. 62.6816 F is the grid reading minus the engine. The 0.0000 belongs to the mass-weighted mean of the API numbers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The mass-weighted mean of the API numbers is the blend API. Does mass weighting do the same for the Kwale crudes'' own T50?', options = '["Yes: the course prints the mass-weighted mean minus the engine as 0.0000 F.", "No: the course prints the mass-weighted mean minus the engine as 62.6816 F.", "Yes: the mass-weighted mean of the crudes'' T50 is the engine''s 587.3184 F.", "No: the course prints the mass-weighted mean minus the engine as -1.2681 F."]'::jsonb, explanation = 'The Kwale row prints the mass-weighted mean of the crudes'' T50 as 586.0503 F beside the engine''s 587.3184 F, and the difference as -1.2681 F. 62.6816 F is the grid reading minus the engine. The 0.0000 belongs to the mass-weighted mean of the API numbers.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 8
  select case
           when prompt = 'For the studio''s default pair, 60 and 40, which volume-weighted and mass-weighted means of the crudes'' T50 does the digest print?' and options = '["584.0000 F and 586.0503 F.", "612.0000 F and 614.2222 F.", "614.2222 F and 612.0000 F.", "612.0000 F and 617.1429 F."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The default pair''s row reads the volume-weighted mean of the crudes'' T50 as 612.0000 F and the mass-weighted mean as 614.2222 F, beside the engine''s 617.1429 F. 584.0000 F and 586.0503 F are the Kwale blend''s.' then 'old'
           when prompt = 'For the studio''s default pair, 60 and 40, which volume-weighted and mass-weighted means of the crudes'' T50 does the course print?' and options = '["584.0000 F and 586.0503 F.", "612.0000 F and 614.2222 F.", "614.2222 F and 612.0000 F.", "612.0000 F and 617.1429 F."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The default pair''s row reads the volume-weighted mean of the crudes'' T50 as 612.0000 F and the mass-weighted mean as 614.2222 F, beside the engine''s 617.1429 F. 584.0000 F and 586.0503 F are the Kwale blend''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For the studio''s default pair, 60 and 40, which volume-weighted and mass-weighted means of the crudes'' T50 does the course print?', options = '["584.0000 F and 586.0503 F.", "612.0000 F and 614.2222 F.", "614.2222 F and 612.0000 F.", "612.0000 F and 617.1429 F."]'::jsonb, explanation = 'The default pair''s row reads the volume-weighted mean of the crudes'' T50 as 612.0000 F and the mass-weighted mean as 614.2222 F, beside the engine''s 617.1429 F. 584.0000 F and 586.0503 F are the Kwale blend''s.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 9
  select case
           when prompt = 'How does the digest establish the offset watsonK adds to a temperature in F?' and options = '["It reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700.", "It types the published Rankine offset of 459.6700 into the digest from a table of constants.", "It bisects watsonK until the function stops returning a value, and takes that temperature.", "It takes the offset as the grid reading minus the engine, 62.6816, scaled onto the Rankine scale."]'::jsonb and answer_index = 0 and explanation is not distinct from 'watsonK = Tb^(1/3) / SG with Tb in degrees Rankine. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset the engine gives itself.' then 'old'
           when prompt = 'How does the course establish the offset watsonK adds to a temperature in F?' and options = '["It reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700.", "It types the published Rankine offset of 459.6700 into the course from a table of constants.", "It bisects watsonK until the function stops returning a value, and takes that temperature.", "It takes the offset as the grid reading minus the engine, 62.6816, scaled onto the Rankine scale."]'::jsonb and answer_index = 0 and explanation is not distinct from 'watsonK = Tb^(1/3) / SG with Tb in degrees Rankine. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset the engine gives itself.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the course establish the offset watsonK adds to a temperature in F?', options = '["It reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700.", "It types the published Rankine offset of 459.6700 into the course from a table of constants.", "It bisects watsonK until the function stops returning a value, and takes that temperature.", "It takes the offset as the grid reading minus the engine, 62.6816, scaled onto the Rankine scale."]'::jsonb, explanation = 'watsonK = Tb^(1/3) / SG with Tb in degrees Rankine. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset the engine gives itself.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-fifty-percent-point ord 12
  select case
           when prompt = 'The studio takes the boiling temperature in Watson K as the blend''s T50. How does this course treat that choice?' and options = '["As a graded figure: Watson K at T50 prints to four decimals, so it is marked like any other four-decimal figure.", "As held item C13, a stated limit: K at T50 is a screening figure and is never graded.", "As a refusal: the studio reports no K until a mean average boiling point is typed in beside the blend''s curve.", "As the strict basis, since the interpolated T50 of a two crude blend is its mean average boiling point."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The studio takes Tb as the blend''s T50, and the page labels K as the screening figure. The digest records that choice as C13, taught here as a stated limit.' then 'old'
           when prompt = 'The studio takes the boiling temperature in Watson K as the blend''s T50. How does this course treat that choice?' and options = '["As a graded figure: Watson K at T50 prints to four decimals, so it is marked like any other four-decimal figure.", "As held item C13, a stated limit: K at T50 is a screening figure and is never graded.", "As a refusal: the studio reports no K until a mean average boiling point is typed in beside the blend''s curve.", "As the strict basis, since the interpolated T50 of a two crude blend is its mean average boiling point."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The studio takes Tb as the blend''s T50, and the page labels K as the screening figure. The course records that choice as C13, taught here as a stated limit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m02-the-fifty-percent-point ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio takes the boiling temperature in Watson K as the blend''s T50. How does this course treat that choice?', options = '["As a graded figure: Watson K at T50 prints to four decimals, so it is marked like any other four-decimal figure.", "As held item C13, a stated limit: K at T50 is a screening figure and is never graded.", "As a refusal: the studio reports no K until a mean average boiling point is typed in beside the blend''s curve.", "As the strict basis, since the interpolated T50 of a two crude blend is its mean average boiling point."]'::jsonb, explanation = 'The studio takes Tb as the blend''s T50, and the page labels K as the screening figure. The course records that choice as C13, taught here as a stated limit.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-fifty-percent-point' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m02-the-fifty-percent-point ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 1
  select case
           when prompt = 'Why does Kwale''s cut set end at atmospheric residue?' and options = '["Neither Kwale crude carries a TBP point above 650 F, so nothing heavier than that can be cut.", "The Kwale refinery has no vacuum unit, so it has nowhere to split the heavy end further.", "The engine closes every cut set with an open residue cut, so no refinery''s set can split it.", "A cut set that splits the residue cannot close on a two crude blend, so the engine joins it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest gives the reason in one line: the Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue. Kwale draws its own cut points.' then 'old'
           when prompt = 'Why does Kwale''s cut set end at atmospheric residue?' and options = '["Neither Kwale crude carries a TBP point above 650 F, so nothing heavier than that can be cut.", "The Kwale refinery has no vacuum unit, so it has nowhere to split the heavy end further.", "The engine closes every cut set with an open residue cut, so no refinery''s set can split it.", "A cut set that splits the residue cannot close on a two crude blend, so the engine joins it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course gives the reason in one line: the Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue. Kwale draws its own cut points.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does Kwale''s cut set end at atmospheric residue?', options = '["Neither Kwale crude carries a TBP point above 650 F, so nothing heavier than that can be cut.", "The Kwale refinery has no vacuum unit, so it has nowhere to split the heavy end further.", "The engine closes every cut set with an open residue cut, so no refinery''s set can split it.", "A cut set that splits the residue cannot close on a two crude blend, so the engine joins it."]'::jsonb, explanation = 'The course gives the reason in one line: the Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue. Kwale draws its own cut points.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 3
  select case
           when prompt = 'On Kwale''s cuts, what Diesel / AGO figures does the digest print for the Kwale blend by cutYields on its curve, by blendOnVolume and by blendOnMass?' and options = '["19.3849, 19.3849 and 19.4040.", "19.3849, 19.4040 and 19.4040.", "19.4040, 19.3849 and 19.3849.", "16.9510, 19.3849 and 19.4040."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The Diesel / AGO row reads 19.3849 for the blend by cutYields, 19.3849 volume-weighted from the two crudes, a difference of 0.0000, and 19.4040 mass-weighted from the two crudes. 16.9510 is the blend''s Diesel / Gasoil on the studio''s default cuts.' then 'old'
           when prompt = 'On Kwale''s cuts, what Diesel / AGO figures does the course print for the Kwale blend by cutYields on its curve, by blendOnVolume and by blendOnMass?' and options = '["19.3849, 19.3849 and 19.4040.", "19.3849, 19.4040 and 19.4040.", "19.4040, 19.3849 and 19.3849.", "16.9510, 19.3849 and 19.4040."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The Diesel / AGO row reads 19.3849 for the blend by cutYields, 19.3849 volume-weighted from the two crudes, a difference of 0.0000, and 19.4040 mass-weighted from the two crudes. 16.9510 is the blend''s Diesel / Gasoil on the studio''s default cuts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On Kwale''s cuts, what Diesel / AGO figures does the course print for the Kwale blend by cutYields on its curve, by blendOnVolume and by blendOnMass?', options = '["19.3849, 19.3849 and 19.4040.", "19.3849, 19.4040 and 19.4040.", "19.4040, 19.3849 and 19.3849.", "16.9510, 19.3849 and 19.4040."]'::jsonb, explanation = 'The Diesel / AGO row reads 19.3849 for the blend by cutYields, 19.3849 volume-weighted from the two crudes, a difference of 0.0000, and 19.4040 mass-weighted from the two crudes. 16.9510 is the blend''s Diesel / Gasoil on the studio''s default cuts.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 8
  select case
           when prompt = 'Why does the total of the Kwale blend''s cut yields change by 0.0000 when the diesel end point moves?' and options = '["The engine normalises the total back to 100.0000 after any cut point moves.", "The moved barrels are taken from the lost volume, which sits outside the total.", "Moving a cut point moves barrels between two cuts and nowhere else.", "The Diesel / AGO gain is small enough that the total rounds back to 100.0000."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints the rule with the table: moving a cut point moves barrels between two cuts and nowhere else. Diesel / AGO changes by 5.0376, Atmospheric residue by -5.0376 and the total by 0.0000. The total is reported as it computes and is never normalised.' then 'old'
           when prompt = 'Why does the total of the Kwale blend''s cut yields change by 0.0000 when the diesel end point moves?' and options = '["The engine normalises the total back to 100.0000 after any cut point moves.", "The moved barrels are taken from the lost volume, which sits outside the total.", "Moving a cut point moves barrels between two cuts and nowhere else.", "The Diesel / AGO gain is small enough that the total rounds back to 100.0000."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the rule with the table: moving a cut point moves barrels between two cuts and nowhere else. Diesel / AGO changes by 5.0376, Atmospheric residue by -5.0376 and the total by 0.0000. The total is reported as it computes and is never normalised.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does the total of the Kwale blend''s cut yields change by 0.0000 when the diesel end point moves?', options = '["The engine normalises the total back to 100.0000 after any cut point moves.", "The moved barrels are taken from the lost volume, which sits outside the total.", "Moving a cut point moves barrels between two cuts and nowhere else.", "The Diesel / AGO gain is small enough that the total rounds back to 100.0000."]'::jsonb, explanation = 'The course prints the rule with the table: moving a cut point moves barrels between two cuts and nowhere else. Diesel / AGO changes by 5.0376, Atmospheric residue by -5.0376 and the total by 0.0000. The total is reported as it computes and is never normalised.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 12
  select case
           when prompt = 'What does the engine report for the cuts with a yield on the partial blend, and does it scale them?' and options = '["They are scaled up to total 100.0000, spreading the missing barrels over the known cuts.", "They total 76.3376 percent, reported as computed, with no scaling toward 100 percent.", "They total 33.6742 percent, the known cuts of the Ebocha partial assay on the default set.", "They total 76.3376 percent, and the engine scales them only when unknownCuts is empty."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints: the cuts with a yield total 76.3376 percent, and the total is reported as it computes and is never normalised. 33.6742 belongs to the Ebocha partial assay alone on the studio''s cuts.' then 'old'
           when prompt = 'What does the engine report for the cuts with a yield on the partial blend, and does it scale them?' and options = '["They are scaled up to total 100.0000, spreading the missing barrels over the known cuts.", "They total 76.3376 percent, reported as computed, with no scaling toward 100 percent.", "They total 33.6742 percent, the known cuts of the Ebocha partial assay on the default set.", "They total 76.3376 percent, and the engine scales them only when unknownCuts is empty."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints: the cuts with a yield total 76.3376 percent, and the total is reported as it computes and is never normalised. 33.6742 belongs to the Ebocha partial assay alone on the studio''s cuts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the engine report for the cuts with a yield on the partial blend, and does it scale them?', options = '["They are scaled up to total 100.0000, spreading the missing barrels over the known cuts.", "They total 76.3376 percent, reported as computed, with no scaling toward 100 percent.", "They total 33.6742 percent, the known cuts of the Ebocha partial assay on the default set.", "They total 76.3376 percent, and the engine scales them only when unknownCuts is empty."]'::jsonb, explanation = 'The course prints: the cuts with a yield total 76.3376 percent, and the total is reported as it computes and is never normalised. 33.6742 belongs to the Ebocha partial assay alone on the studio''s cuts.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 13
  select case
           when prompt = 'On the Kwale Light and Ebocha blend cut on Kwale''s set, what do unknownCuts and Closes read?' and options = '["unknownCuts: LPG / Light ends, Naphtha. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha. Closes: true.", "unknownCuts: Atmospheric residue. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha, Vacuum gasoil, Vacuum residue. Closes: false."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints unknownCuts: LPG / Light ends, Naphtha. Closes: false. Atmospheric residue has a yield, 40.1548, because it runs from 650 F to 100 percent. Four cuts with no yield belong to the Ebocha partial assay alone on the studio''s cuts.' then 'old'
           when prompt = 'On the Kwale Light and Ebocha blend cut on Kwale''s set, what do unknownCuts and Closes read?' and options = '["unknownCuts: LPG / Light ends, Naphtha. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha. Closes: true.", "unknownCuts: Atmospheric residue. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha, Vacuum gasoil, Vacuum residue. Closes: false."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints unknownCuts: LPG / Light ends, Naphtha. Closes: false. Atmospheric residue has a yield, 40.1548, because it runs from 650 F to 100 percent. Four cuts with no yield belong to the Ebocha partial assay alone on the studio''s cuts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the Kwale Light and Ebocha blend cut on Kwale''s set, what do unknownCuts and Closes read?', options = '["unknownCuts: LPG / Light ends, Naphtha. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha. Closes: true.", "unknownCuts: Atmospheric residue. Closes: false.", "unknownCuts: LPG / Light ends, Naphtha, Vacuum gasoil, Vacuum residue. Closes: false."]'::jsonb, explanation = 'The course prints unknownCuts: LPG / Light ends, Naphtha. Closes: false. Atmospheric residue has a yield, 40.1548, because it runs from 650 F to 100 percent. Four cuts with no yield belong to the Ebocha partial assay alone on the studio''s cuts.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-cut-yields-of-the-blend ord 14
  select case
           when prompt = 'Kwale Light and the Ebocha partial assay are valued as a blend on the Kwale refinery''s prices, costs and losses. What comes back?' and options = '["A refusal in place of a figure, because netbackValue will not value any blend whose cut yields do not close, and it names the cuts that stopped it.", "A netback of 48.3393 $/bbl with complete: true, since the missing cuts are already named in unknownCuts and a named gap leaves a valuation whole.", "A netback over the three cuts it can value, with LPG / Light ends and Naphtha entered at a yield of 0.0000 and complete: true.", "A netback of 48.3393 $/bbl over the cuts it can value, with unyieldedCuts naming LPG / Light ends and Naphtha and complete: false."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints unyieldedCuts: LPG / Light ends, Naphtha beside the 48.3393 $/bbl, and complete: false. Both cuts keep an empty yield and an empty value.' then 'old'
           when prompt = 'Kwale Light and the Ebocha partial assay are valued as a blend on the Kwale refinery''s prices, costs and losses. What comes back?' and options = '["A refusal in place of a figure, because netbackValue will not value any blend whose cut yields do not close, and it names the cuts that stopped it.", "A netback of 48.3393 $/bbl with complete: true, since the missing cuts are already named in unknownCuts and a named gap leaves a valuation whole.", "A netback over the three cuts it can value, with LPG / Light ends and Naphtha entered at a yield of 0.0000 and complete: true.", "A netback of 48.3393 $/bbl over the cuts it can value, with unyieldedCuts naming LPG / Light ends and Naphtha and complete: false."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints unyieldedCuts: LPG / Light ends, Naphtha beside the 48.3393 $/bbl, and complete: false. Both cuts keep an empty yield and an empty value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m03-cut-yields-of-the-blend ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Kwale Light and the Ebocha partial assay are valued as a blend on the Kwale refinery''s prices, costs and losses. What comes back?', options = '["A refusal in place of a figure, because netbackValue will not value any blend whose cut yields do not close, and it names the cuts that stopped it.", "A netback of 48.3393 $/bbl with complete: true, since the missing cuts are already named in unknownCuts and a named gap leaves a valuation whole.", "A netback over the three cuts it can value, with LPG / Light ends and Naphtha entered at a yield of 0.0000 and complete: true.", "A netback of 48.3393 $/bbl over the cuts it can value, with unyieldedCuts naming LPG / Light ends and Naphtha and complete: false."]'::jsonb, explanation = 'The course prints unyieldedCuts: LPG / Light ends, Naphtha beside the 48.3393 $/bbl, and complete: false. Both cuts keep an empty yield and an empty value.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-cut-yields-of-the-blend' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m03-cut-yields-of-the-blend ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-netback ord 7
  select case
           when prompt = 'If the loss percent is taken off the netback after processing and freight, what does the digest print?' and options = '["65.5412 $/bbl, which is 0.5939 above the engine''s netback.", "64.9473 $/bbl, which is 0.0000 from the engine''s netback.", "65.0169 $/bbl, which is 0.5939 above the engine''s netback.", "65.0169 $/bbl, which is 0.0696 above the engine''s netback."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine takes losses off the product value before the costs, and this reading takes them off a figure that already has processing and freight removed. The digest prints it at 65.0169, 0.0696 from the engine''s 64.9473. 65.5412 is the reading with losses left out.' then 'old'
           when prompt = 'If the loss percent is taken off the netback after processing and freight, what does the course print?' and options = '["65.5412 $/bbl, which is 0.5939 above the engine''s netback.", "64.9473 $/bbl, which is 0.0000 from the engine''s netback.", "65.0169 $/bbl, which is 0.5939 above the engine''s netback.", "65.0169 $/bbl, which is 0.0696 above the engine''s netback."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine takes losses off the product value before the costs, and this reading takes them off a figure that already has processing and freight removed. The course prints it at 65.0169, 0.0696 from the engine''s 64.9473. 65.5412 is the reading with losses left out.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-netback' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m04-netback ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m04-netback ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'If the loss percent is taken off the netback after processing and freight, what does the course print?', options = '["65.5412 $/bbl, which is 0.5939 above the engine''s netback.", "64.9473 $/bbl, which is 0.0000 from the engine''s netback.", "65.0169 $/bbl, which is 0.5939 above the engine''s netback.", "65.0169 $/bbl, which is 0.0696 above the engine''s netback."]'::jsonb, explanation = 'The engine takes losses off the product value before the costs, and this reading takes them off a figure that already has processing and freight removed. The course prints it at 65.0169, 0.0696 from the engine''s 64.9473. 65.5412 is the reading with losses left out.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-netback' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m04-netback ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-netback ord 9
  select case
           when prompt = 'The losses left out reading lands 0.5939 above the engine''s netback. Which figure in the engine''s term table does that match?' and options = '["The distance of the after-the-costs reading from the engine, 0.0696 $/bbl.", "The freight, 1.9000 $/bbl of crude, taken off after the losses.", "The value lost to losses at 0.8 percent, 0.5939 $/bbl of crude.", "The processing cost, 6.8000 $/bbl of crude, taken off before freight."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The losses left out reading is 65.5412 against the engine''s 64.9473, and the digest prints that difference as 0.5939, the figure it also prints as the value lost to losses at 0.8 percent.' then 'old'
           when prompt = 'The losses left out reading lands 0.5939 above the engine''s netback. Which figure in the engine''s term table does that match?' and options = '["The distance of the after-the-costs reading from the engine, 0.0696 $/bbl.", "The freight, 1.9000 $/bbl of crude, taken off after the losses.", "The value lost to losses at 0.8 percent, 0.5939 $/bbl of crude.", "The processing cost, 6.8000 $/bbl of crude, taken off before freight."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The losses left out reading is 65.5412 against the engine''s 64.9473, and the course prints that difference as 0.5939, the figure it also prints as the value lost to losses at 0.8 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-netback' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m04-netback ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m04-netback ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The losses left out reading lands 0.5939 above the engine''s netback. Which figure in the engine''s term table does that match?', options = '["The distance of the after-the-costs reading from the engine, 0.0696 $/bbl.", "The freight, 1.9000 $/bbl of crude, taken off after the losses.", "The value lost to losses at 0.8 percent, 0.5939 $/bbl of crude.", "The processing cost, 6.8000 $/bbl of crude, taken off before freight."]'::jsonb, explanation = 'The losses left out reading is 65.5412 against the engine''s 64.9473, and the course prints that difference as 0.5939, the figure it also prints as the value lost to losses at 0.8 percent.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-netback' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m04-netback ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-against-the-marker ord 6
  select case
           when prompt = 'Kwale Light and Ughelli Medium each have a netback of their own. Weighted 55 and 45 on volume, where do they land against the blend''s netback?' and options = '["The mean is 65.0169 $/bbl, and the digest prints the difference as 0.0696.", "The mean is 64.9473 $/bbl, and the digest prints the difference as 0.0000.", "The mean is 64.9473 $/bbl, and the digest prints the difference as -7.5527.", "The mean is 65.5412 $/bbl, and the digest prints the difference as 0.5939."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The blend is worth what its barrels are worth: its netback and the volume-weighted netbacks of its crudes are the same figure.' then 'old'
           when prompt = 'Kwale Light and Ughelli Medium each have a netback of their own. Weighted 55 and 45 on volume, where do they land against the blend''s netback?' and options = '["The mean is 65.0169 $/bbl, and the course prints the difference as 0.0696.", "The mean is 64.9473 $/bbl, and the course prints the difference as 0.0000.", "The mean is 64.9473 $/bbl, and the course prints the difference as -7.5527.", "The mean is 65.5412 $/bbl, and the course prints the difference as 0.5939."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The blend is worth what its barrels are worth: its netback and the volume-weighted netbacks of its crudes are the same figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m05-against-the-marker ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Kwale Light and Ughelli Medium each have a netback of their own. Weighted 55 and 45 on volume, where do they land against the blend''s netback?', options = '["The mean is 65.0169 $/bbl, and the course prints the difference as 0.0696.", "The mean is 64.9473 $/bbl, and the course prints the difference as 0.0000.", "The mean is 64.9473 $/bbl, and the course prints the difference as -7.5527.", "The mean is 65.5412 $/bbl, and the course prints the difference as 0.5939."]'::jsonb, explanation = 'The blend is worth what its barrels are worth: its netback and the volume-weighted netbacks of its crudes are the same figure.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-against-the-marker ord 8
  select case
           when prompt = 'What does the digest say d86ToTbp has the structure of?' and options = '["A fixed offset added at every point of the D86 curve, with no coefficient table needed.", "A bisection on the D86 curve for the temperature of each TBP point in turn.", "The cut-point-difference conversion, API Technical Data Book Procedure 3A1.1.", "The Refutas index form, blended on volume fraction the way ASTM D7152 blends it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: d86ToTbp has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1) and ships no coefficient table. Called without the table, it refuses.' then 'old'
           when prompt = 'What does the course say d86ToTbp has the structure of?' and options = '["A fixed offset added at every point of the D86 curve, with no coefficient table needed.", "A bisection on the D86 curve for the temperature of each TBP point in turn.", "The cut-point-difference conversion, API Technical Data Book Procedure 3A1.1.", "The Refutas index form, blended on volume fraction the way ASTM D7152 blends it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: d86ToTbp has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1) and ships no coefficient table. Called without the table, it refuses.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m05-against-the-marker ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course say d86ToTbp has the structure of?', options = '["A fixed offset added at every point of the D86 curve, with no coefficient table needed.", "A bisection on the D86 curve for the temperature of each TBP point in turn.", "The cut-point-difference conversion, API Technical Data Book Procedure 3A1.1.", "The Refutas index form, blended on volume fraction the way ASTM D7152 blends it."]'::jsonb, explanation = 'The course: d86ToTbp has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1) and ships no coefficient table. Called without the table, it refuses.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-against-the-marker ord 10
  select case
           when prompt = 'On this valuation, does blending Kwale Light and Ughelli Medium create or destroy netback?' and options = '["It destroys netback, because the blend''s Watson K at T50 of 11.8135 marks it as a poorer feed than either crude.", "It destroys netback, because the blend''s loss of 0.5939 is taken on a mixed barrel.", "It creates netback, because the blend''s curve has 14 points where each crude''s assay has fewer.", "Neither: the blend nets back the volume-weighted mean of its crudes'' netbacks."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the blend''s netback minus the volume-weighted mean of its crudes'' netbacks as 0.0000, with every row on the same cut set, prices, costs and losses.' then 'old'
           when prompt = 'On this valuation, does blending Kwale Light and Ughelli Medium create or destroy netback?' and options = '["It destroys netback, because the blend''s Watson K at T50 of 11.8135 marks it as a poorer feed than either crude.", "It destroys netback, because the blend''s loss of 0.5939 is taken on a mixed barrel.", "It creates netback, because the blend''s curve has 14 points where each crude''s assay has fewer.", "Neither: the blend nets back the volume-weighted mean of its crudes'' netbacks."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the blend''s netback minus the volume-weighted mean of its crudes'' netbacks as 0.0000, with every row on the same cut set, prices, costs and losses.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m05-against-the-marker ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On this valuation, does blending Kwale Light and Ughelli Medium create or destroy netback?', options = '["It destroys netback, because the blend''s Watson K at T50 of 11.8135 marks it as a poorer feed than either crude.", "It destroys netback, because the blend''s loss of 0.5939 is taken on a mixed barrel.", "It creates netback, because the blend''s curve has 14 points where each crude''s assay has fewer.", "Neither: the blend nets back the volume-weighted mean of its crudes'' netbacks."]'::jsonb, explanation = 'The course prints the blend''s netback minus the volume-weighted mean of its crudes'' netbacks as 0.0000, with every row on the same cut set, prices, costs and losses.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-against-the-marker ord 12
  select case
           when prompt = 'Which loss percents does the digest show netbackValue refusing?' and options = '["101 percent only; -1 percent is taken as zero and named in assumedZero.", "-1 percent only; 101 percent is capped at 100 and valued.", "101 percent and -1 percent, each refused with the same sentence.", "Neither; both are valued, with complete: false beside the netback."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The refusal table prints two rows, losses of 101 percent and losses of -1 percent, and one sentence for both: REFUSED: Losses must be between 0 and 100 percent.' then 'old'
           when prompt = 'Which loss percents does the course show netbackValue refusing?' and options = '["101 percent only; -1 percent is taken as zero and named in assumedZero.", "-1 percent only; 101 percent is capped at 100 and valued.", "101 percent and -1 percent, each refused with the same sentence.", "Neither; both are valued, with complete: false beside the netback."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The refusal table prints two rows, losses of 101 percent and losses of -1 percent, and one sentence for both: REFUSED: Losses must be between 0 and 100 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m05-against-the-marker ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which loss percents does the course show netbackValue refusing?', options = '["101 percent only; -1 percent is taken as zero and named in assumedZero.", "-1 percent only; 101 percent is capped at 100 and valued.", "101 percent and -1 percent, each refused with the same sentence.", "Neither; both are valued, with complete: false beside the netback."]'::jsonb, explanation = 'The refusal table prints two rows, losses of 101 percent and losses of -1 percent, and one sentence for both: REFUSED: Losses must be between 0 and 100 percent.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-against-the-marker ord 13
  select case
           when prompt = 'A blank loss is taken as zero and named. A loss of 101 percent is refused. What separates the two?' and options = '["A blank loss is named in unpricedCuts, and 101 percent is capped at 100 percent.", "A blank loss makes the valuation incomplete, and 101 percent is valued with complete: false.", "Both are refused in the engine; the blank is taken as zero by the studio alone.", "A blank loss is taken as zero in assumedZero; losses must be between 0 and 100 percent."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints Kwale with freight and losses left blank at 67.4412 $/bbl, assumedZero naming freight, losses, and complete: true. Losses of 101 percent return REFUSED: Losses must be between 0 and 100 percent.' then 'old'
           when prompt = 'A blank loss is taken as zero and named. A loss of 101 percent is refused. What separates the two?' and options = '["A blank loss is named in unpricedCuts, and 101 percent is capped at 100 percent.", "A blank loss makes the valuation incomplete, and 101 percent is valued with complete: false.", "Both are refused in the engine; the blank is taken as zero by the studio alone.", "A blank loss is taken as zero in assumedZero; losses must be between 0 and 100 percent."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints Kwale with freight and losses left blank at 67.4412 $/bbl, assumedZero naming freight, losses, and complete: true. Losses of 101 percent return REFUSED: Losses must be between 0 and 100 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m05-against-the-marker ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A blank loss is taken as zero and named. A loss of 101 percent is refused. What separates the two?', options = '["A blank loss is named in unpricedCuts, and 101 percent is capped at 100 percent.", "A blank loss makes the valuation incomplete, and 101 percent is valued with complete: false.", "Both are refused in the engine; the blank is taken as zero by the studio alone.", "A blank loss is taken as zero in assumedZero; losses must be between 0 and 100 percent."]'::jsonb, explanation = 'The course prints Kwale with freight and losses left blank at 67.4412 $/bbl, assumedZero naming freight, losses, and complete: true. Losses of 101 percent return REFUSED: Losses must be between 0 and 100 percent.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-against-the-marker' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m05-against-the-marker ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 3
  select case
           when prompt = 'Which set of four checks does the digest show the Kwale valuation passing?' and options = '["The yields close; nothing is assumed zero; the loss comes off before the costs; the blend''s netback matches its crudes'' volume-weighted mean.", "The yields close; the blend API matches the volume-weighted mean of the API numbers; the Watson K sits in a paraffinic band; the differential is positive.", "The yields total 100.0000 after scaling; every cost is typed; the loss is taken after the costs; the T50 matches the mean of the crudes'' own T50.", "The curve has a point at every 10 percent; the cut set has a vacuum split; the netback exceeds the marker; the oracle reproduces the Watson K."]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the Kwale case the yields close, the netback of 64.9473 $/bbl is complete with nothing assumed zero, the loss appears as its own term of 0.5939 directly after gross, and the blend minus the mean is 0.0000.' then 'old'
           when prompt = 'Which set of four checks does the course show the Kwale valuation passing?' and options = '["The yields close; nothing is assumed zero; the loss comes off before the costs; the blend''s netback matches its crudes'' volume-weighted mean.", "The yields close; the blend API matches the volume-weighted mean of the API numbers; the Watson K sits in a paraffinic band; the differential is positive.", "The yields total 100.0000 after scaling; every cost is typed; the loss is taken after the costs; the T50 matches the mean of the crudes'' own T50.", "The curve has a point at every 10 percent; the cut set has a vacuum split; the netback exceeds the marker; the oracle reproduces the Watson K."]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the Kwale case the yields close, the netback of 64.9473 $/bbl is complete with nothing assumed zero, the loss appears as its own term of 0.5939 directly after gross, and the blend minus the mean is 0.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m06-the-professional-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which set of four checks does the course show the Kwale valuation passing?', options = '["The yields close; nothing is assumed zero; the loss comes off before the costs; the blend''s netback matches its crudes'' volume-weighted mean.", "The yields close; the blend API matches the volume-weighted mean of the API numbers; the Watson K sits in a paraffinic band; the differential is positive.", "The yields total 100.0000 after scaling; every cost is typed; the loss is taken after the costs; the T50 matches the mean of the crudes'' own T50.", "The curve has a point at every 10 percent; the cut set has a vacuum split; the netback exceeds the marker; the oracle reproduces the Watson K."]'::jsonb, explanation = 'In the Kwale case the yields close, the netback of 64.9473 $/bbl is complete with nothing assumed zero, the loss appears as its own term of 0.5939 directly after gross, and the blend minus the mean is 0.0000.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 7
  select case
           when prompt = 'How is oracle_crudeassay.py written, by the digest''s account?' and options = '["From the rules, independently of the JavaScript engine.", "From the JavaScript engine, translated line for line into Python.", "From the golden files, fitted to reproduce each case.", "From the digest''s own tables, read back as its inputs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest describes an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules, and counts its golden cases from the vendored file.' then 'old'
           when prompt = 'How is oracle_crudeassay.py written, by the course''s account?' and options = '["From the rules, independently of the JavaScript engine.", "From the JavaScript engine, translated line for line into Python.", "From the golden files, fitted to reproduce each case.", "From the course''s own tables, read back as its inputs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course describes an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules, and counts its golden cases from the vendored file.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m06-the-professional-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How is oracle_crudeassay.py written, by the course''s account?', options = '["From the rules, independently of the JavaScript engine.", "From the JavaScript engine, translated line for line into Python.", "From the golden files, fitted to reproduce each case.", "From the course''s own tables, read back as its inputs."]'::jsonb, explanation = 'The course describes an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules, and counts its golden cases from the vendored file.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 11
  select case
           when prompt = 'What does the Python oracle for the assay engine load a blend as?' and options = '["As a cargo, loaded in barrels and in pounds.", "As mass shares from resolveFractions.", "As one barrel at the refinery gate.", "As volume shares normalised to 100."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s oracle line begins with the load: a cargo in barrels and pounds. The engine itself converts volume shares to mass shares with resolveFractions.' then 'old'
           when prompt = 'What does the Python oracle for the assay engine load a blend as?' and options = '["As a cargo, loaded in barrels and in pounds.", "As mass shares from resolveFractions.", "As one barrel at the refinery gate.", "As volume shares normalised to 100."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s oracle line begins with the load: a cargo in barrels and pounds. The engine itself converts volume shares to mass shares with resolveFractions.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for intermediate m06-the-professional-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the Python oracle for the assay engine load a blend as?', options = '["As a cargo, loaded in barrels and in pounds.", "As mass shares from resolveFractions.", "As one barrel at the refinery gate.", "As volume shares normalised to 100."]'::jsonb, explanation = 'The course''s oracle line begins with the load: a cargo in barrels and pounds. The engine itself converts volume shares to mass shares with resolveFractions.'
     where app_slug = 'crude' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: intermediate m06-the-professional-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 3
  select case
           when prompt = 'Three Apapa requests: a target volume of 0, Reformate with a minimum of 3000 and a maximum of 2000, and the 10 ppm gasoline template. Which one does the digest print with the status infeasible?' and options = '["The target volume of 0, which comes back infeasible.", "The crossed Reformate bounds, which come back infeasible.", "All three of them, because each one comes back without a recipe for the cargo.", "The 10 ppm gasoline template asked of the Apapa PMS pool."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the 10 ppm template with the status infeasible and "REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can." The other two are among what optimiseBlend refuses, each in its own words: "REFUSED: The target volume must be greater than zero." and "REFUSED: Reformate has a minimum above its maximum."' then 'old'
           when prompt = 'Three Apapa requests: a target volume of 0, Reformate with a minimum of 3000 and a maximum of 2000, and the 10 ppm gasoline template. Which one does the course print with the status infeasible?' and options = '["The target volume of 0, which comes back infeasible.", "The crossed Reformate bounds, which come back infeasible.", "All three of them, because each one comes back without a recipe for the cargo.", "The 10 ppm gasoline template asked of the Apapa PMS pool."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the 10 ppm template with the status infeasible and "REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can." The other two are among what optimiseBlend refuses, each in its own words: "REFUSED: The target volume must be greater than zero." and "REFUSED: Reformate has a minimum above its maximum."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Three Apapa requests: a target volume of 0, Reformate with a minimum of 3000 and a maximum of 2000, and the 10 ppm gasoline template. Which one does the course print with the status infeasible?', options = '["The target volume of 0, which comes back infeasible.", "The crossed Reformate bounds, which come back infeasible.", "All three of them, because each one comes back without a recipe for the cargo.", "The 10 ppm gasoline template asked of the Apapa PMS pool."]'::jsonb, explanation = 'The course prints the 10 ppm template with the status infeasible and "REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can." The other two are among what optimiseBlend refuses, each in its own words: "REFUSED: The target volume must be greater than zero." and "REFUSED: Reformate has a minimum above its maximum."'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 12
  select case
           when prompt = 'Apapa''s marginal barrel sits 0.1731 $/bbl above its average and the default pool''s sits 0.0000 above. Which difference between the two pools accounts for that?' and options = '["Apapa binds on Sulfur and RVP, and the default pool binds on no specification at all.", "Apapa holds Butane at its availability, and the default pool holds no component at its availability.", "Apapa is solved on the 10 ppm template, and the default pool on the 50 ppm template.", "Apapa blends 8000 bbl, and the default pool''s 1000 bbl is too small for a gap to print."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Both pools are on the 50 ppm template and both bind on Sulfur and RVP. What the digest prints differently is availability: Butane at 400.0000 bbl at Apapa, and nothing in the default pool.' then 'old'
           when prompt = 'Apapa''s marginal barrel sits 0.1731 $/bbl above its average and the default pool''s sits 0.0000 above. Which difference between the two pools accounts for that?' and options = '["Apapa binds on Sulfur and RVP, and the default pool binds on no specification at all.", "Apapa holds Butane at its availability, and the default pool holds no component at its availability.", "Apapa is solved on the 10 ppm template, and the default pool on the 50 ppm template.", "Apapa blends 8000 bbl, and the default pool''s 1000 bbl is too small for a gap to print."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Both pools are on the 50 ppm template and both bind on Sulfur and RVP. What the course prints differently is availability: Butane at 400.0000 bbl at Apapa, and nothing in the default pool.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Apapa''s marginal barrel sits 0.1731 $/bbl above its average and the default pool''s sits 0.0000 above. Which difference between the two pools accounts for that?', options = '["Apapa binds on Sulfur and RVP, and the default pool binds on no specification at all.", "Apapa holds Butane at its availability, and the default pool holds no component at its availability.", "Apapa is solved on the 10 ppm template, and the default pool on the 50 ppm template.", "Apapa blends 8000 bbl, and the default pool''s 1000 bbl is too small for a gap to print."]'::jsonb, explanation = 'Both pools are on the 50 ppm template and both bind on Sulfur and RVP. What the course prints differently is availability: Butane at 400.0000 bbl at Apapa, and nothing in the default pool.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 20
  select case
           when prompt = 'On the AGO recipe the Cetane number minimum has rowPrice 0.1932 and price 1159.3909 $ per unit, both positive, while the Density maximum''s rowPrice x scale and its price carry opposite signs. Why the difference?' and options = '["Cetane blends on volume and density on mass, so only density''s scale turns the sign.", "A minimum''s relief is dCost/dL, and a maximum''s is its negative.", "The engine flips the sign on any binding row it prices above a thousand dollars.", "Density does not bind, so its signs need not agree."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Cetane is a minimum: lowering it is the relief, and its dual already reads as a saving. Density is a maximum, and for a maximum the digest''s rule turns the sign between the dual and the value of relief.' then 'old'
           when prompt = 'On the AGO recipe the Cetane number minimum has rowPrice 0.1932 and price 1159.3909 $ per unit, both positive, while the Density maximum''s rowPrice x scale and its price carry opposite signs. Why the difference?' and options = '["Cetane blends on volume and density on mass, so only density''s scale turns the sign.", "A minimum''s relief is dCost/dL, and a maximum''s is its negative.", "The engine flips the sign on any binding row it prices above a thousand dollars.", "Density does not bind, so its signs need not agree."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Cetane is a minimum: lowering it is the relief, and its dual already reads as a saving. Density is a maximum, and for a maximum the course''s rule turns the sign between the dual and the value of relief.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the AGO recipe the Cetane number minimum has rowPrice 0.1932 and price 1159.3909 $ per unit, both positive, while the Density maximum''s rowPrice x scale and its price carry opposite signs. Why the difference?', options = '["Cetane blends on volume and density on mass, so only density''s scale turns the sign.", "A minimum''s relief is dCost/dL, and a maximum''s is its negative.", "The engine flips the sign on any binding row it prices above a thousand dollars.", "Density does not bind, so its signs need not agree."]'::jsonb, explanation = 'Cetane is a minimum: lowering it is the relief, and its dual already reads as a saving. Density is a maximum, and for a maximum the course''s rule turns the sign between the dual and the value of relief.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 27
  select case
           when prompt = 'Given held item C12, which report of the AGO viscosity matches what the digest prints?' and options = '["2.9518 cSt alone, the volume figure, as the course keys volume as the correct basis.", "The engine''s 3.0036 cSt, stated as the Refutas index blended on mass fraction.", "The mean of 3.0036 and 2.9518 cSt, the engine''s reading between the two bases.", "No viscosity at all, as the engine withholds a figure on a held basis."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine prints 3.0036 cSt with the index on mass and 2.9518 cSt with the same index on volume. C12 is taught as a stated limit and never graded, and the basis is a course and owner decision.' then 'old'
           when prompt = 'Given held item C12, which report of the AGO viscosity matches what the course prints?' and options = '["2.9518 cSt alone, the volume figure, as the course keys volume as the correct basis.", "The engine''s 3.0036 cSt, stated as the Refutas index blended on mass fraction.", "The mean of 3.0036 and 2.9518 cSt, the engine''s reading between the two bases.", "No viscosity at all, as the engine withholds a figure on a held basis."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine prints 3.0036 cSt with the index on mass and 2.9518 cSt with the same index on volume. C12 is taught as a stated limit and never graded, and the basis is a course and owner decision.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Given held item C12, which report of the AGO viscosity matches what the course prints?', options = '["2.9518 cSt alone, the volume figure, as the course keys volume as the correct basis.", "The engine''s 3.0036 cSt, stated as the Refutas index blended on mass fraction.", "The mean of 3.0036 and 2.9518 cSt, the engine''s reading between the two bases.", "No viscosity at all, as the engine withholds a figure on a held basis."]'::jsonb, explanation = 'The engine prints 3.0036 cSt with the index on mass and 2.9518 cSt with the same index on volume. C12 is taught as a stated limit and never graded, and the basis is a course and owner decision.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 29
  select case
           when prompt = 'The digest solves each textbook corner with both coordinates fixed by bounds, and all four print the status optimal. Why optimal at every one?' and options = '["Each corner is the optimum of the full problem, so all four report one objective.", "Optimal is reported whenever phase two runs, met rows or not.", "Each fixed point is feasible, so the kernel has a point to return.", "The two rows are dropped once both coordinates are fixed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Fixing both coordinates leaves one point, and the kernel''s status says whether it meets every row. The objectives are 0.0000, 20.0000, 12.0000 and 21.0000, and 21.0000 is the optimum of the full problem.' then 'old'
           when prompt = 'The course solves each textbook corner with both coordinates fixed by bounds, and all four print the status optimal. Why optimal at every one?' and options = '["Each corner is the optimum of the full problem, so all four report one objective.", "Optimal is reported whenever phase two runs, met rows or not.", "Each fixed point is feasible, so the kernel has a point to return.", "The two rows are dropped once both coordinates are fixed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Fixing both coordinates leaves one point, and the kernel''s status says whether it meets every row. The objectives are 0.0000, 20.0000, 12.0000 and 21.0000, and 21.0000 is the optimum of the full problem.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course solves each textbook corner with both coordinates fixed by bounds, and all four print the status optimal. Why optimal at every one?', options = '["Each corner is the optimum of the full problem, so all four report one objective.", "Optimal is reported whenever phase two runs, met rows or not.", "Each fixed point is feasible, so the kernel has a point to return.", "The two rows are dropped once both coordinates are fixed."]'::jsonb, explanation = 'Fixing both coordinates leaves one point, and the kernel''s status says whether it meets every row. The objectives are 0.0000, 20.0000, 12.0000 and 21.0000, and 21.0000 is the optimum of the full problem.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 36
  select case
           when prompt = 'Suppose the Apapa sulfur row had been built with volume weights in place of SG weights. Where would the digest''s two-route check show it?' and options = '["Nowhere: both routes read the same row, so they share any error made in building it.", "As an infeasible status for the whole pool, reported by the kernel''s phase one.", "As a difference other than 0.0000 on the Sulfur line.", "As a refusal naming the sulfur row, printed where the engine''s refusals are listed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'propertyOfBlend recomputes a property from a finished recipe by the specification''s own rule, separately from the LP rows, so agreement is a check. Both routes print 50.0000 for Sulfur, with a difference of 0.0000.' then 'old'
           when prompt = 'Suppose the Apapa sulfur row had been built with volume weights in place of SG weights. Where would the course''s two-route check show it?' and options = '["Nowhere: both routes read the same row, so they share any error made in building it.", "As an infeasible status for the whole pool, reported by the kernel''s phase one.", "As a difference other than 0.0000 on the Sulfur line.", "As a refusal naming the sulfur row, printed where the engine''s refusals are listed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'propertyOfBlend recomputes a property from a finished recipe by the specification''s own rule, separately from the LP rows, so agreement is a check. Both routes print 50.0000 for Sulfur, with a difference of 0.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Suppose the Apapa sulfur row had been built with volume weights in place of SG weights. Where would the course''s two-route check show it?', options = '["Nowhere: both routes read the same row, so they share any error made in building it.", "As an infeasible status for the whole pool, reported by the kernel''s phase one.", "As a difference other than 0.0000 on the Sulfur line.", "As a refusal naming the sulfur row, printed where the engine''s refusals are listed."]'::jsonb, explanation = 'propertyOfBlend recomputes a property from a finished recipe by the specification''s own rule, separately from the LP rows, so agreement is a check. Both routes print 50.0000 for Sulfur, with a difference of 0.0000.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 37
  select case
           when prompt = 'Moving the RVP limit to 10 prints a saving of 3651.3942 $, and moving it to 8 prints -4751.5037 $, around 4448.9659 $ per psi. Which causes does the digest name for that spread?' and options = '["Rounding in the rowPrice of -0.2569, printed to four decimals and so drifting over a psi.", "The Butane bound, which the re-solves remove before moving the limit.", "The Density range, which binds once the RVP limit moves a whole psi.", "The optimum moves to a different vertex, and the RVP row''s index units are not a straight line in psi."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The RVP re-solves change what holds (at 10 psi only Sulfur binds; at 8 psi Reformate sits at its availability), so the optimum moves to a different vertex, and the RVP row is in index units, which are not a straight line in psi. Rounding is not among the causes the digest names.' then 'old'
           when prompt = 'Moving the RVP limit to 10 prints a saving of 3651.3942 $, and moving it to 8 prints -4751.5037 $, around 4448.9659 $ per psi. Which causes does the course name for that spread?' and options = '["Rounding in the rowPrice of -0.2569, printed to four decimals and so drifting over a psi.", "The Butane bound, which the re-solves remove before moving the limit.", "The Density range, which binds once the RVP limit moves a whole psi.", "The optimum moves to a different vertex, and the RVP row''s index units are not a straight line in psi."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The RVP re-solves change what holds (at 10 psi only Sulfur binds; at 8 psi Reformate sits at its availability), so the optimum moves to a different vertex, and the RVP row is in index units, which are not a straight line in psi. Rounding is not among the causes the course names.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Moving the RVP limit to 10 prints a saving of 3651.3942 $, and moving it to 8 prints -4751.5037 $, around 4448.9659 $ per psi. Which causes does the course name for that spread?', options = '["Rounding in the rowPrice of -0.2569, printed to four decimals and so drifting over a psi.", "The Butane bound, which the re-solves remove before moving the limit.", "The Density range, which binds once the RVP limit moves a whole psi.", "The optimum moves to a different vertex, and the RVP row''s index units are not a straight line in psi."]'::jsonb, explanation = 'The RVP re-solves change what holds (at 10 psi only Sulfur binds; at 8 psi Reformate sits at its availability), so the optimum moves to a different vertex, and the RVP row is in index units, which are not a straight line in psi. Rounding is not among the causes the course names.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 39
  select case
           when prompt = 'At Apapa the RVP rowPrice times the 8000.0000 bbl batch prints -2054.8893. In what unit is that figure?' and options = '["$ per psi, the value of one psi of RVP relief at the limit", "$ per ppm, the unit the sulfur row''s figure is in", "$ per index point, as the row is in index units", "$ per bbl, the cost of one more barrel"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints: rowPrice x 8000.0000 bbl is -2054.8893 $ per index point. The RVP row is in index units.' then 'old'
           when prompt = 'At Apapa the RVP rowPrice times the 8000.0000 bbl batch prints -2054.8893. In what unit is that figure?' and options = '["$ per psi, the value of one psi of RVP relief at the limit", "$ per ppm, the unit the sulfur row''s figure is in", "$ per index point, as the row is in index units", "$ per bbl, the cost of one more barrel"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints: rowPrice x 8000.0000 bbl is -2054.8893 $ per index point. The RVP row is in index units.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At Apapa the RVP rowPrice times the 8000.0000 bbl batch prints -2054.8893. In what unit is that figure?', options = '["$ per psi, the value of one psi of RVP relief at the limit", "$ per ppm, the unit the sulfur row''s figure is in", "$ per index point, as the row is in index units", "$ per bbl, the cost of one more barrel"]'::jsonb, explanation = 'The course prints: rowPrice x 8000.0000 bbl is -2054.8893 $ per index point. The RVP row is in index units.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 42
  select case
           when prompt = 'The digest counts the LP oracle''s golden cases as 181 problems. How does its method stand against the kernel''s absolute tolerances?' and options = '["The kernel''s own absolute tolerances, shared by running a simplex with Bland''s rule.", "A larger tolerance than the kernel''s, sized for problems scaled in millions.", "It works in exact rational arithmetic, with no simplex at all.", "A relative tolerance on each pivot, set tighter than the kernel''s absolute ones."]'::jsonb and answer_index = 2 and explanation is not distinct from 'oracle_lp.py uses exact rational vertex enumeration with no simplex at all. The kernel''s absolute tolerances are what held item L4 is about.' then 'old'
           when prompt = 'The course counts the LP oracle''s golden cases as 181 problems. How does its method stand against the kernel''s absolute tolerances?' and options = '["The kernel''s own absolute tolerances, shared by running a simplex with Bland''s rule.", "A larger tolerance than the kernel''s, sized for problems scaled in millions.", "It works in exact rational arithmetic, with no simplex at all.", "A relative tolerance on each pivot, set tighter than the kernel''s absolute ones."]'::jsonb and answer_index = 2 and explanation is not distinct from 'oracle_lp.py uses exact rational vertex enumeration with no simplex at all. The kernel''s absolute tolerances are what held item L4 is about.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course counts the LP oracle''s golden cases as 181 problems. How does its method stand against the kernel''s absolute tolerances?', options = '["The kernel''s own absolute tolerances, shared by running a simplex with Bland''s rule.", "A larger tolerance than the kernel''s, sized for problems scaled in millions.", "It works in exact rational arithmetic, with no simplex at all.", "A relative tolerance on each pivot, set tighter than the kernel''s absolute ones."]'::jsonb, explanation = 'oracle_lp.py uses exact rational vertex enumeration with no simplex at all. The kernel''s absolute tolerances are what held item L4 is about.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-what-a-linear-programme-is ord 1
  select case
           when prompt = 'Two rows, x + y <= 2 and x + y >= 3, sit under the objective minimise x + y. Which answer comes back from solveLP?' and options = '["optimal, objective 3.0000, where x + y >= 3 holds", "unbounded, since x + y has no floor", "infeasible, since no point meets both rows", "it throws, as the rows contradict each other"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Infeasible and unbounded are answers, and the digest prints this problem''s status as infeasible. The kernel throws only on a malformed problem.' then 'old'
           when prompt = 'Two rows, x + y <= 2 and x + y >= 3, sit under the objective minimise x + y. Which answer comes back from solveLP?' and options = '["optimal, objective 3.0000, where x + y >= 3 holds", "unbounded, since x + y has no floor", "infeasible, since no point meets both rows", "it throws, as the rows contradict each other"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Infeasible and unbounded are answers, and the course prints this problem''s status as infeasible. The kernel throws only on a malformed problem.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-what-a-linear-programme-is' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m01-what-a-linear-programme-is ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m01-what-a-linear-programme-is ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Two rows, x + y <= 2 and x + y >= 3, sit under the objective minimise x + y. Which answer comes back from solveLP?', options = '["optimal, objective 3.0000, where x + y >= 3 holds", "unbounded, since x + y has no floor", "infeasible, since no point meets both rows", "it throws, as the rows contradict each other"]'::jsonb, explanation = 'Infeasible and unbounded are answers, and the course prints this problem''s status as infeasible. The kernel throws only on a malformed problem.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-what-a-linear-programme-is' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m01-what-a-linear-programme-is ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-shadow-prices ord 13
  select case
           when prompt = 'The RVP shadow price at Apapa is 4448.9659 $ per psi. Where does the digest read what relieving the maximum by one whole psi saves?' and options = '["From the shadow price, since it holds for any move of the RVP maximum, however large.", "From the average of the two re-solves, taken as the value of a psi.", "From the re-solve at an RVP limit of 10, which prints 3651.3942 $.", "From the unit cost of 87.3377 $/bbl, taken over the batch."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine re-solved with the limit moved one whole unit each way, and relieving the 9 psi maximum to 10 prints a saving of 3651.3942 $ against the price of 4448.9659 $ per psi.' then 'old'
           when prompt = 'The RVP shadow price at Apapa is 4448.9659 $ per psi. Where does the course read what relieving the maximum by one whole psi saves?' and options = '["From the shadow price, since it holds for any move of the RVP maximum, however large.", "From the average of the two re-solves, taken as the value of a psi.", "From the re-solve at an RVP limit of 10, which prints 3651.3942 $.", "From the unit cost of 87.3377 $/bbl, taken over the batch."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine re-solved with the limit moved one whole unit each way, and relieving the 9 psi maximum to 10 prints a saving of 3651.3942 $ against the price of 4448.9659 $ per psi.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-shadow-prices' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m04-shadow-prices ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m04-shadow-prices ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The RVP shadow price at Apapa is 4448.9659 $ per psi. Where does the course read what relieving the maximum by one whole psi saves?', options = '["From the shadow price, since it holds for any move of the RVP maximum, however large.", "From the average of the two re-solves, taken as the value of a psi.", "From the re-solve at an RVP limit of 10, which prints 3651.3942 $.", "From the unit cost of 87.3377 $/bbl, taken over the batch."]'::jsonb, explanation = 'The engine re-solved with the limit moved one whole unit each way, and relieving the 9 psi maximum to 10 prints a saving of 3651.3942 $ against the price of 4448.9659 $ per psi.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-shadow-prices' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m04-shadow-prices ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-infeasible-refused-and-skipped ord 4
  select case
           when prompt = 'The Apapa pool is posed with a RON minimum of 99. What does the engine return?' and options = '["An optimal recipe with RON at 94.5010, since RON gives away 3.5010 at the Apapa optimum.", "The status infeasible, with the message that no recipe from these components can meet every specification.", "An optimal recipe with the RON specification listed as skipped, with its reason.", "The refusal for a missing cost, since no component''s cost can buy a RON of 99."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A RON minimum of 99 sits in the digest''s infeasible table beside the 10 ppm template, with the same message. An infeasible blend is a real answer: the specifications cannot be met by the components available.' then 'old'
           when prompt = 'The Apapa pool is posed with a RON minimum of 99. What does the engine return?' and options = '["An optimal recipe with RON at 94.5010, since RON gives away 3.5010 at the Apapa optimum.", "The status infeasible, with the message that no recipe from these components can meet every specification.", "An optimal recipe with the RON specification listed as skipped, with its reason.", "The refusal for a missing cost, since no component''s cost can buy a RON of 99."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A RON minimum of 99 sits in the course''s infeasible table beside the 10 ppm template, with the same message. An infeasible blend is a real answer: the specifications cannot be met by the components available.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-infeasible-refused-and-skipped' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m05-infeasible-refused-and-skipped ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m05-infeasible-refused-and-skipped ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Apapa pool is posed with a RON minimum of 99. What does the engine return?', options = '["An optimal recipe with RON at 94.5010, since RON gives away 3.5010 at the Apapa optimum.", "The status infeasible, with the message that no recipe from these components can meet every specification.", "An optimal recipe with the RON specification listed as skipped, with its reason.", "The refusal for a missing cost, since no component''s cost can buy a RON of 99."]'::jsonb, explanation = 'A RON minimum of 99 sits in the course''s infeasible table beside the 10 ppm template, with the same message. An infeasible blend is a real answer: the specifications cannot be met by the components available.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-infeasible-refused-and-skipped' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m05-infeasible-refused-and-skipped ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 8
  select case
           when prompt = 'Of the three held items, which one concerns the LP kernel, and what does the engine do there?' and options = '["L4: absolute tolerances on its pivots and on phase one.", "C12: absolute tolerances on the pivots.", "C13: a binding test of 1e-7 times the limit on each row.", "L4: the Refutas index taken on mass fraction in the AGO rows."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 27 lists three held items: L4, the LP kernel''s absolute tolerances on its pivots and on phase one; C12, the Refutas index on mass fraction; C13, Watson K taken at the blend''s T50.' then 'old'
           when prompt = 'Of the three held items, which one concerns the LP kernel, and what does the engine do there?' and options = '["L4: absolute tolerances on its pivots and on phase one.", "C12: absolute tolerances on the pivots.", "C13: a binding test of 1e-7 times the limit on each row.", "L4: the Refutas index taken on mass fraction in the AGO rows."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists three held items: L4, the LP kernel''s absolute tolerances on its pivots and on phase one; C12, the Refutas index on mass fraction; C13, Watson K taken at the blend''s T50.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m06-the-expert-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Of the three held items, which one concerns the LP kernel, and what does the engine do there?', options = '["L4: absolute tolerances on its pivots and on phase one.", "C12: absolute tolerances on the pivots.", "C13: a binding test of 1e-7 times the limit on each row.", "L4: the Refutas index taken on mass fraction in the AGO rows."]'::jsonb, explanation = 'The course lists three held items: L4, the LP kernel''s absolute tolerances on its pivots and on phase one; C12, the Refutas index on mass fraction; C13, Watson K taken at the blend''s T50.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 12
  select case
           when prompt = 'The engines state RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7 in their modules. What does that give a reader?' and options = '["A value read from the module itself, as the engines state it.", "A regulation, since each constant is the limit the regulation in force sets.", "A graded value the capstone checks to four decimals.", "A default price per unit of relief for every binding row."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest lists the constants the engines state, read from the modules: CII_BANDS.STABLE 0.7, CII_BANDS.UNSTABLE 0.9, RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7. SPEC_TEMPLATES are starting points; the regulation in force governs.' then 'old'
           when prompt = 'The engines state RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7 in their modules. What does that give a reader?' and options = '["A value read from the module itself, as the engines state it.", "A regulation, since each constant is the limit the regulation in force sets.", "A graded value the capstone checks to four decimals.", "A default price per unit of relief for every binding row."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists the constants the engines state, read from the modules: CII_BANDS.STABLE 0.7, CII_BANDS.UNSTABLE 0.9, RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7. SPEC_TEMPLATES are starting points; the regulation in force governs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m06-the-expert-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engines state RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7 in their modules. What does that give a reader?', options = '["A value read from the module itself, as the engines state it.", "A regulation, since each constant is the limit the regulation in force sets.", "A graded value the capstone checks to four decimals.", "A default price per unit of relief for every binding row."]'::jsonb, explanation = 'The course lists the constants the engines state, read from the modules: CII_BANDS.STABLE 0.7, CII_BANDS.UNSTABLE 0.9, RVP_INDEX_EXPONENT 1.25 and BINDING_TOLERANCE 1e-7. SPEC_TEMPLATES are starting points; the regulation in force governs.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 15
  select case
           when prompt = 'The digest counts the refusals it prints: 17. What stands behind that count?' and options = '["Each was asserted against the engine before it was printed.", "Each was written by the course from the engine''s rules, so the wording is the course''s own paraphrase.", "Each is a status the kernel returns from phase one.", "Each is graded against the capstone''s own figures."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest closes: "Refusals printed in this digest, each asserted against the engine before it was printed: 17."' then 'old'
           when prompt = 'The course counts the refusals it prints: 17. What stands behind that count?' and options = '["Each was asserted against the engine before it was printed.", "Each was written by the course from the engine''s rules, so the wording is the course''s own paraphrase.", "Each is a status the kernel returns from phase one.", "Each is graded against the capstone''s own figures."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course closes on its count of refusals, each asserted against the engine before it was printed: 17.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, crude refused: no row for advanced m06-the-expert-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course counts the refusals it prints: 17. What stands behind that count?', options = '["Each was asserted against the engine before it was printed.", "Each was written by the course from the engine''s rules, so the wording is the course''s own paraphrase.", "Each is a status the kernel returns from phase one.", "Each is graded against the capstone''s own figures."]'::jsonb, explanation = 'The course closes on its count of refusals, each asserted against the engine before it was printed: 17.'
     where app_slug = 'crude' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, crude refused: advanced m06-the-expert-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'crude';
  if v_total <> 396 then raise exception 'digest-copy recut, crude refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, crude: % of 51 rows updated, the rest already carried the recut text', v_updated;
end $$;
