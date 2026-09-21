-- ==========================================================================
-- DIGEST-COPY RECUT: gasvalue, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/gasvalue, built from its committed .py sources.
-- Rows: 206 (beginner 47, intermediate 56, advanced 103).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-gasvalue.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 3
  select case
           when prompt = 'In the digest''s arithmetic for kgPerMscf, which constant turns pounds into kilograms?' and options = '["SCF_PER_LBMOL, 379.49", "GAL_PER_FT3, 7.480519", "LB_PER_KG, 2.20462262", "PSI_PER_BAR, 14.503773773"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The kilograms are the pounds over LB_PER_KG, pounds in one kilogram. SCF_PER_LBMOL gives the lb-mol in one Mscf (1000 over it), GAL_PER_FT3 is gallons in a cubic foot and PSI_PER_BAR is lpgCng''s psi in one bar.' then 'old'
           when prompt = 'In the course''s arithmetic for kgPerMscf, which constant turns pounds into kilograms?' and options = '["SCF_PER_LBMOL, 379.49", "GAL_PER_FT3, 7.480519", "LB_PER_KG, 2.20462262", "PSI_PER_BAR, 14.503773773"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The kilograms are the pounds over LB_PER_KG, pounds in one kilogram. SCF_PER_LBMOL gives the lb-mol in one Mscf (1000 over it), GAL_PER_FT3 is gallons in a cubic foot and PSI_PER_BAR is lpgCng''s psi in one bar.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s arithmetic for kgPerMscf, which constant turns pounds into kilograms?', options = '["SCF_PER_LBMOL, 379.49", "GAL_PER_FT3, 7.480519", "LB_PER_KG, 2.20462262", "PSI_PER_BAR, 14.503773773"]'::jsonb, explanation = 'The kilograms are the pounds over LB_PER_KG, pounds in one kilogram. SCF_PER_LBMOL gives the lb-mol in one Mscf (1000 over it), GAL_PER_FT3 is gallons in a cubic foot and PSI_PER_BAR is lpgCng''s psi in one bar.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 4
  select case
           when prompt = 'The digest recomputes kgPerMscf for pure methane and pure carbon dioxide from the constants, beside the engine. What does its difference column read?' and options = '["0.0000 on methane, with the CO2 row left to the engine", "19.1757 on methane and 52.6038 on carbon dioxide", "0.0000 on methane, the CO2 row weighed at 44.009", "0.0000 on both rows"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The check table prints 19.1757 against 19.1757 for methane and 52.6038 against 52.6038 for carbon dioxide, with 0.0000 in the difference column on both.' then 'old'
           when prompt = 'The course recomputes kgPerMscf for pure methane and pure carbon dioxide from the constants, beside the engine. What does its difference column read?' and options = '["0.0000 on methane, with the CO2 row left to the engine", "19.1757 on methane and 52.6038 on carbon dioxide", "0.0000 on methane, the CO2 row weighed at 44.009", "0.0000 on both rows"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The check table prints 19.1757 against 19.1757 for methane and 52.6038 against 52.6038 for carbon dioxide, with 0.0000 in the difference column on both.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course recomputes kgPerMscf for pure methane and pure carbon dioxide from the constants, beside the engine. What does its difference column read?', options = '["0.0000 on methane, with the CO2 row left to the engine", "19.1757 on methane and 52.6038 on carbon dioxide", "0.0000 on methane, the CO2 row weighed at 44.009", "0.0000 on both rows"]'::jsonb, explanation = 'The check table prints 19.1757 against 19.1757 for methane and 52.6038 against 52.6038 for carbon dioxide, with 0.0000 in the difference column on both.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 8
  select case
           when prompt = 'OGUTA is the lean non-associated gas. Which ghvBtuScf does the digest print for it?' and options = '["1248.4110", "1035.6050", "1210.7800", "1010"]'::jsonb and answer_index = 1 and explanation is not distinct from 'OGUTA''s ghvBtuScf is 1035.6050. 1248.4110 is EGBEMA, 1210.7800 the studio''s opening gas and 1010 is methane''s typical heating value in the reference table.' then 'old'
           when prompt = 'OGUTA is the lean non-associated gas. Which ghvBtuScf does the course print for it?' and options = '["1248.4110", "1035.6050", "1210.7800", "1010"]'::jsonb and answer_index = 1 and explanation is not distinct from 'OGUTA''s ghvBtuScf is 1035.6050. 1248.4110 is EGBEMA, 1210.7800 the studio''s opening gas and 1010 is methane''s typical heating value in the reference table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'OGUTA is the lean non-associated gas. Which ghvBtuScf does the course print for it?', options = '["1248.4110", "1035.6050", "1210.7800", "1010"]'::jsonb, explanation = 'OGUTA''s ghvBtuScf is 1035.6050. 1248.4110 is EGBEMA, 1210.7800 the studio''s opening gas and 1010 is methane''s typical heating value in the reference table.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 9
  select case
           when prompt = 'What does the digest print as OGUTA''s inertMoleFraction, and from which fractions?' and options = '["0.0150, from CO2 0.0150 alone", "0.0270, from N2 0.0120 plus CO2 0.0150", "0.0460, from N2 0.0180 plus CO2 0.0280", "0.0400, from N2 0.0200 plus CO2 0.0200"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The inert table''s OGUTA row sums its two inert codes to 0.0270, and the engine agrees.' then 'old'
           when prompt = 'What does the course print as OGUTA''s inertMoleFraction, and from which fractions?' and options = '["0.0150, from CO2 0.0150 alone", "0.0270, from N2 0.0120 plus CO2 0.0150", "0.0460, from N2 0.0180 plus CO2 0.0280", "0.0400, from N2 0.0200 plus CO2 0.0200"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The inert table''s OGUTA row sums its two inert codes to 0.0270, and the engine agrees.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print as OGUTA''s inertMoleFraction, and from which fractions?', options = '["0.0150, from CO2 0.0150 alone", "0.0270, from N2 0.0120 plus CO2 0.0150", "0.0460, from N2 0.0180 plus CO2 0.0280", "0.0400, from N2 0.0200 plus CO2 0.0200"]'::jsonb, explanation = 'The inert table''s OGUTA row sums its two inert codes to 0.0270, and the engine agrees.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 11
  select case
           when prompt = 'What carbonPerMol does characteriseGas give OGUTA?' and options = '["1.0430", "1.3600", "1.3000", "1.0580"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 5 prints OGUTA at carbonPerMol 1.0580; 1.0430 is its hydrocarbon count, and the other two are EGBEMA and the studio gas.' then 'old'
           when prompt = 'What carbonPerMol does characteriseGas give OGUTA?' and options = '["1.0430", "1.3600", "1.3000", "1.0580"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The gas lesson prints OGUTA at carbonPerMol 1.0580; 1.0430 is its hydrocarbon count, and the other two are EGBEMA and the studio gas.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What carbonPerMol does characteriseGas give OGUTA?', options = '["1.0430", "1.3600", "1.3000", "1.0580"]'::jsonb, explanation = 'The gas lesson prints OGUTA at carbonPerMol 1.0580; 1.0430 is its hydrocarbon count, and the other two are EGBEMA and the studio gas.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 17
  select case
           when prompt = 'On-stream days are omitted in one call and typed blank in another. How does abatement treat the two?' and options = '["Omitted days are refused; blank days take the default, scfPerYear 2625000000", "Omitted days take the default, scfPerYear 2625000000; blank days are refused", "Either way the default applies, and scfPerYear reads 2625000000", "Either way the call is refused with the on-stream days sentence"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 13: omitted from the call, the days take the stated default (onstreamDays 350). Typed blank (''''), they are refused with the range more than 0 and no more than 366.' then 'old'
           when prompt = 'On-stream days are omitted in one call and typed blank in another. How does abatement treat the two?' and options = '["Omitted days are refused; blank days take the default, scfPerYear 2625000000", "Omitted days take the default, scfPerYear 2625000000; blank days are refused", "Either way the default applies, and scfPerYear reads 2625000000", "Either way the call is refused with the on-stream days sentence"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The refusals lesson: omitted from the call, the days take the stated default (onstreamDays 350). Typed blank (''''), they are refused with the range more than 0 and no more than 366.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On-stream days are omitted in one call and typed blank in another. How does abatement treat the two?', options = '["Omitted days are refused; blank days take the default, scfPerYear 2625000000", "Omitted days take the default, scfPerYear 2625000000; blank days are refused", "Either way the default applies, and scfPerYear reads 2625000000", "Either way the call is refused with the on-stream days sentence"]'::jsonb, explanation = 'The refusals lesson: omitted from the call, the days take the stated default (onstreamDays 350). Typed blank (''''), they are refused with the range more than 0 and no more than 366.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 19
  select case
           when prompt = 'From which carbon count does the digest''s every-unburned-carbon methane shortcut start?' and options = '["hydrocarbonCarbonPerMol, only the carbon that can burn", "methaneMoleFraction, the methane in the gas", "The ethane and heavier carbon alone", "carbonPerMol, every carbon atom, the CO2''s included"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The shortcut multiplies the lb-mol a year by carbonPerMol, every carbon atom with the CO2''s included.' then 'old'
           when prompt = 'From which carbon count does the course''s every-unburned-carbon methane shortcut start?' and options = '["hydrocarbonCarbonPerMol, only the carbon that can burn", "methaneMoleFraction, the methane in the gas", "The ethane and heavier carbon alone", "carbonPerMol, every carbon atom, the CO2''s included"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The shortcut multiplies the lb-mol a year by carbonPerMol, every carbon atom with the CO2''s included.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 19'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 19 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'From which carbon count does the course''s every-unburned-carbon methane shortcut start?', options = '["hydrocarbonCarbonPerMol, only the carbon that can burn", "methaneMoleFraction, the methane in the gas", "The ethane and heavier carbon alone", "carbonPerMol, every carbon atom, the CO2''s included"]'::jsonb, explanation = 'The shortcut multiplies the lb-mol a year by carbonPerMol, every carbon atom with the CO2''s included.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 19 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 22
  select case
           when prompt = 'In the digest''s words, what is the destruction efficiency?' and options = '["The share oxidised to CO2", "The share of the gas sent to an unlit flare", "The share of hydrocarbon destroyed", "The share of the CO2 that passes through"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 11 defines it as the share of hydrocarbon destroyed; its partner is the share oxidised to CO2.' then 'old'
           when prompt = 'In the course''s words, what is the destruction efficiency?' and options = '["The share oxidised to CO2", "The share of the gas sent to an unlit flare", "The share of hydrocarbon destroyed", "The share of the CO2 that passes through"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The efficiency lesson defines it as the share of hydrocarbon destroyed; its partner is the share oxidised to CO2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 22'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s words, what is the destruction efficiency?', options = '["The share oxidised to CO2", "The share of the gas sent to an unlit flare", "The share of hydrocarbon destroyed", "The share of the CO2 that passes through"]'::jsonb, explanation = 'The efficiency lesson defines it as the share of hydrocarbon destroyed; its partner is the share oxidised to CO2.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 24
  select case
           when prompt = 'Whose choice does the digest say the assessment report behind a methane GWP is?' and options = '["The engine''s, which ships a default", "The study''s", "The course''s, which picks one edition", "40 CFR 98.233(n)''s, which the engine follows"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The methane GWP is an input with no default: the assessment report it comes from is the study''s to choose, and this course does not choose it. The engine ships no GWP.' then 'old'
           when prompt = 'Whose choice does the course say the assessment report behind a methane GWP is?' and options = '["The engine''s, which ships a default", "The study''s", "The course''s, which picks one edition", "40 CFR 98.233(n)''s, which the engine follows"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The methane GWP is an input with no default: the assessment report it comes from is the study''s to choose, and this course does not choose it. The engine ships no GWP.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Whose choice does the course say the assessment report behind a methane GWP is?', options = '["The engine''s, which ships a default", "The study''s", "The course''s, which picks one edition", "40 CFR 98.233(n)''s, which the engine follows"]'::jsonb, explanation = 'The methane GWP is an input with no default: the assessment report it comes from is the study''s to choose, and this course does not choose it. The engine ships no GWP.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 26
  select case
           when prompt = 'Which ethane figure, gpmC2Plus minus gpmC3Plus, belongs to the studio''s gas?' and options = '["2.4003", "2.7737", "0.8268", "2.6894"]'::jsonb and answer_index = 0 and explanation is not distinct from '2.4003 is the studio row of SECTION 7''s ethane column. 2.6894 is that gas''s gpmC3Plus.' then 'old'
           when prompt = 'Which ethane figure, gpmC2Plus minus gpmC3Plus, belongs to the studio''s gas?' and options = '["2.4003", "2.7737", "0.8268", "2.6894"]'::jsonb and answer_index = 0 and explanation is not distinct from '2.4003 is the studio row of the liquids lesson''s ethane column. 2.6894 is that gas''s gpmC3Plus.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which ethane figure, gpmC2Plus minus gpmC3Plus, belongs to the studio''s gas?', options = '["2.4003", "2.7737", "0.8268", "2.6894"]'::jsonb, explanation = '2.4003 is the studio row of the liquids lesson''s ethane column. 2.6894 is that gas''s gpmC3Plus.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 28
  select case
           when prompt = 'EGBEMA''s ethane row gives 2.7737 gal/Mscf. Which liquid cut holds it?' and options = '["gpmC3Plus only", "Both gpmC2Plus and gpmC3Plus", "gpmC2Plus only", "Neither, as ethane reads recoverable false"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The C2 row reads recoverable true, in gpmC2Plus true and in gpmC3Plus false, at 2.7737. The digest prints the same figure as gpmC2Plus minus gpmC3Plus, the ethane.' then 'old'
           when prompt = 'EGBEMA''s ethane row gives 2.7737 gal/Mscf. Which liquid cut holds it?' and options = '["gpmC3Plus only", "Both gpmC2Plus and gpmC3Plus", "gpmC2Plus only", "Neither, as ethane reads recoverable false"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The C2 row reads recoverable true, in gpmC2Plus true and in gpmC3Plus false, at 2.7737. The course prints the same figure as gpmC2Plus minus gpmC3Plus, the ethane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA''s ethane row gives 2.7737 gal/Mscf. Which liquid cut holds it?', options = '["gpmC3Plus only", "Both gpmC2Plus and gpmC3Plus", "gpmC2Plus only", "Neither, as ethane reads recoverable false"]'::jsonb, explanation = 'The C2 row reads recoverable true, in gpmC2Plus true and in gpmC3Plus false, at 2.7737. The course prints the same figure as gpmC2Plus minus gpmC3Plus, the ethane.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 35
  select case
           when prompt = 'The digest names one module flareToValue draws on. Which, and for what?' and options = '["terminalDepot, for its loading-rack queue", "production/gasProperties, for the Z factor", "modularRefinery, for capital by the power law", "facilities/compression, for its compressors"]'::jsonb and answer_index = 2 and explanation is not distinct from 'flareToValue scales capital with the power law in modularRefinery. terminalDepot, production/gasProperties and facilities/compression are the three modules the digest names lpgCng calling.' then 'old'
           when prompt = 'The course names one module flareToValue draws on. Which, and for what?' and options = '["terminalDepot, for its loading-rack queue", "production/gasProperties, for the Z factor", "modularRefinery, for capital by the power law", "facilities/compression, for its compressors"]'::jsonb and answer_index = 2 and explanation is not distinct from 'flareToValue scales capital with the power law in modularRefinery. terminalDepot, production/gasProperties and facilities/compression are the three modules the course names lpgCng calling.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 35'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course names one module flareToValue draws on. Which, and for what?', options = '["terminalDepot, for its loading-rack queue", "production/gasProperties, for the Z factor", "modularRefinery, for capital by the power law", "facilities/compression, for its compressors"]'::jsonb, explanation = 'flareToValue scales capital with the power law in modularRefinery. terminalDepot, production/gasProperties and facilities/compression are the three modules the course names lpgCng calling.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 38
  select case
           when prompt = 'Which on-stream days does abatement accept?' and options = '["355", "367", "0", "blank ('''')"]'::jsonb and answer_index = 0 and explanation is not distinct from 'EGBEMA''s 355 days are answered, scfPerYear 2662500000. The refusal states the range, more than 0 and no more than 366, and 0, 367 and a blank are all refused in the digest''s table.' then 'old'
           when prompt = 'Which on-stream days does abatement accept?' and options = '["355", "367", "0", "blank ('''')"]'::jsonb and answer_index = 0 and explanation is not distinct from 'EGBEMA''s 355 days are answered, scfPerYear 2662500000. The refusal states the range, more than 0 and no more than 366, and 0, 367 and a blank are all refused in the course''s table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which on-stream days does abatement accept?', options = '["355", "367", "0", "blank ('''')"]'::jsonb, explanation = 'EGBEMA''s 355 days are answered, scfPerYear 2662500000. The refusal states the range, more than 0 and no more than 366, and 0, 367 and a blank are all refused in the course''s table.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 39
  select case
           when prompt = 'Which of these does the digest state as a limit of the flare model?' and options = '["An unlit flare is not modelled.", "A gas that carries CO2 is not modelled.", "A gas that carries nitrogen is not modelled.", "A combustion efficiency below the destruction efficiency is not modelled."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The stated limits: the efficiencies have no default, an unlit flare is not modelled, the GWP and credit prices are case inputs, and the reference figures are typical. EGBEMA carries N2 0.018 and CO2 0.028 and a combustion efficiency of 0.955 below its 0.97, and is answered.' then 'old'
           when prompt = 'Which of these does the course state as a limit of the flare model?' and options = '["An unlit flare is not modelled.", "A gas that carries CO2 is not modelled.", "A gas that carries nitrogen is not modelled.", "A combustion efficiency below the destruction efficiency is not modelled."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The stated limits: the efficiencies have no default, an unlit flare is not modelled, the GWP and credit prices are case inputs, and the reference figures are typical. EGBEMA carries N2 0.018 and CO2 0.028 and a combustion efficiency of 0.955 below its 0.97, and is answered.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the course state as a limit of the flare model?', options = '["An unlit flare is not modelled.", "A gas that carries CO2 is not modelled.", "A gas that carries nitrogen is not modelled.", "A combustion efficiency below the destruction efficiency is not modelled."]'::jsonb, explanation = 'The stated limits: the efficiencies have no default, an unlit flare is not modelled, the GWP and credit prices are case inputs, and the reference figures are typical. EGBEMA carries N2 0.018 and CO2 0.028 and a combustion efficiency of 0.955 below its 0.97, and is answered.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 40
  select case
           when prompt = 'On the Flare Gas to Value Studio''s opening flare, which parcel does the digest run?' and options = '["7.5 MMscfd on 355 days", "10 MMscfd on 355 days", "10 MMscfd on 350 days", "7.5 MMscfd on 350 days"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The studio''s opening gas is run at 10 MMscfd and 350 days with the efficiencies blank, and abatement refuses. 7.5 MMscfd on 355 days is EGBEMA.' then 'old'
           when prompt = 'On the Flare Gas to Value Studio''s opening flare, which parcel does the course run?' and options = '["7.5 MMscfd on 355 days", "10 MMscfd on 355 days", "10 MMscfd on 350 days", "7.5 MMscfd on 350 days"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The studio''s opening gas is run at 10 MMscfd and 350 days with the efficiencies blank, and abatement refuses. 7.5 MMscfd on 355 days is EGBEMA.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 40'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the Flare Gas to Value Studio''s opening flare, which parcel does the course run?', options = '["7.5 MMscfd on 355 days", "10 MMscfd on 355 days", "10 MMscfd on 350 days", "7.5 MMscfd on 350 days"]'::jsonb, explanation = 'The studio''s opening gas is run at 10 MMscfd and 350 days with the efficiencies blank, and abatement refuses. 7.5 MMscfd on 355 days is EGBEMA.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 41
  select case
           when prompt = 'Which record does the digest describe as a flow station in Imo State flaring associated gas?' and options = '["EGBEMA", "OGUTA", "KANO", "IBAFO"]'::jsonb and answer_index = 0 and explanation is not distinct from 'EGBEMA is the flow station flaring associated gas. OGUTA is a lean non-associated gas, KANO an LPG storage and bottling plant and IBAFO a CNG mother station. Every record is invented; the places are real.' then 'old'
           when prompt = 'Which record does the course describe as a flow station in Imo State flaring associated gas?' and options = '["EGBEMA", "OGUTA", "KANO", "IBAFO"]'::jsonb and answer_index = 0 and explanation is not distinct from 'EGBEMA is the flow station flaring associated gas. OGUTA is a lean non-associated gas, KANO an LPG storage and bottling plant and IBAFO a CNG mother station. Every record is invented; the places are real.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which record does the course describe as a flow station in Imo State flaring associated gas?', options = '["EGBEMA", "OGUTA", "KANO", "IBAFO"]'::jsonb, explanation = 'EGBEMA is the flow station flaring associated gas. OGUTA is a lean non-associated gas, KANO an LPG storage and bottling plant and IBAFO a CNG mother station. Every record is invented; the places are real.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 42
  select case
           when prompt = 'What does the digest say of EGBEMA''s efficiencies, 0.97 and 0.955?' and options = '["They are the tiered default pair of 40 CFR 98.233(n)(1).", "They are invented and illustrative, as every efficiency in the digest is.", "They are the NUPRC flare regulations'' basis for Imo State.", "They were measured on the Egbema flare by the flare study."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s preamble: every analysis, efficiency, GWP, price, cost, fill limit and vehicle figure is invented and illustrative, and no figure is a measured flare or a regulation.' then 'old'
           when prompt = 'What does the course say of EGBEMA''s efficiencies, 0.97 and 0.955?' and options = '["They are the tiered default pair of 40 CFR 98.233(n)(1).", "They are invented and illustrative, as every efficiency in the course is.", "They are the NUPRC flare regulations'' basis for Imo State.", "They were measured on the Egbema flare by the flare study."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s opening note: every analysis, efficiency, GWP, price, cost, fill limit and vehicle figure is invented and illustrative, and no figure is a measured flare or a regulation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course say of EGBEMA''s efficiencies, 0.97 and 0.955?', options = '["They are the tiered default pair of 40 CFR 98.233(n)(1).", "They are invented and illustrative, as every efficiency in the course is.", "They are the NUPRC flare regulations'' basis for Imo State.", "They were measured on the Egbema flare by the flare study."]'::jsonb, explanation = 'The course''s opening note: every analysis, efficiency, GWP, price, cost, fill limit and vehicle figure is invented and illustrative, and no figure is a measured flare or a regulation.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 1
  select case
           when prompt = 'Which flareToValue function answers the studio question "what is in this gas, and how much liquid could it give"?' and options = '["creditSensitivity", "screenRoute", "characteriseGas", "routeEconomics"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest''s table of questions pairs that question with characteriseGas. creditSensitivity answers whether the project needs carbon credits to clear its hurdle, screenRoute answers which way of selling the gas it allows, and routeEconomics answers what a route makes, earns and costs in a year.' then 'old'
           when prompt = 'Which flareToValue function answers the studio question "what is in this gas, and how much liquid could it give"?' and options = '["creditSensitivity", "screenRoute", "characteriseGas", "routeEconomics"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s table of questions pairs that question with characteriseGas. creditSensitivity answers whether the project needs carbon credits to clear its hurdle, screenRoute answers which way of selling the gas it allows, and routeEconomics answers what a route makes, earns and costs in a year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which flareToValue function answers the studio question "what is in this gas, and how much liquid could it give"?', options = '["creditSensitivity", "screenRoute", "characteriseGas", "routeEconomics"]'::jsonb, explanation = 'The course''s table of questions pairs that question with characteriseGas. creditSensitivity answers whether the project needs carbon credits to clear its hurdle, screenRoute answers which way of selling the gas it allows, and routeEconomics answers what a route makes, earns and costs in a year.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 2
  select case
           when prompt = 'What does the digest''s export table count for flareToValue?' and options = '["7 exported functions and 10 exported constants and tables", "10 exported functions and 9 exported constants and tables", "10 exported functions and 7 exported constants and tables", "10 exported functions and 10 exported constants and tables"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The flareToValue row reads 7 functions (abatement, characteriseGas, compareRoutes, creditSensitivity, routeEconomics, screenRoute, yieldCeiling) and 10 constants and tables. 10 functions and 9 constants and tables is the lpgCng row.' then 'old'
           when prompt = 'What does the course''s export table count for flareToValue?' and options = '["7 exported functions and 10 exported constants and tables", "10 exported functions and 9 exported constants and tables", "10 exported functions and 7 exported constants and tables", "10 exported functions and 10 exported constants and tables"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The flareToValue row reads 7 functions (abatement, characteriseGas, compareRoutes, creditSensitivity, routeEconomics, screenRoute, yieldCeiling) and 10 constants and tables. 10 functions and 9 constants and tables is the lpgCng row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course''s export table count for flareToValue?', options = '["7 exported functions and 10 exported constants and tables", "10 exported functions and 9 exported constants and tables", "10 exported functions and 7 exported constants and tables", "10 exported functions and 10 exported constants and tables"]'::jsonb, explanation = 'The flareToValue row reads 7 functions (abatement, characteriseGas, compareRoutes, creditSensitivity, routeEconomics, screenRoute, yieldCeiling) and 10 constants and tables. 10 functions and 9 constants and tables is the lpgCng row.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 3
  select case
           when prompt = 'lpgCng calls three modules and writes none of the three itself. What does it call terminalDepot for?' and options = '["The gas Z factor, for the gas in a bank", "The compressor train, for the station compressor", "The power law, for scaling a plant''s capital", "The loading-rack queue, for its carousel and forecourt"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest says lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression. The capital power law is in modularRefinery, which flareToValue uses.' then 'old'
           when prompt = 'lpgCng calls three modules and writes none of the three itself. What does it call terminalDepot for?' and options = '["The gas Z factor, for the gas in a bank", "The compressor train, for the station compressor", "The power law, for scaling a plant''s capital", "The loading-rack queue, for its carousel and forecourt"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course says lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression. The capital power law is in modularRefinery, which flareToValue uses.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'lpgCng calls three modules and writes none of the three itself. What does it call terminalDepot for?', options = '["The gas Z factor, for the gas in a bank", "The compressor train, for the station compressor", "The power law, for scaling a plant''s capital", "The loading-rack queue, for its carousel and forecourt"]'::jsonb, explanation = 'The course says lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression. The capital power law is in modularRefinery, which flareToValue uses.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 5
  select case
           when prompt = 'One Mscf of methane carries 19.1757 kg and one Mscf of carbon dioxide carries 52.6038 kg. What does the digest say the two rows hold the same?' and options = '["The mass in the Mscf", "The count of moles", "The molar mass behind the row", "The typical heating value of the gas"]'::jsonb and answer_index = 1 and explanation is not distinct from 'A standard cubic foot counts gas at 60 F and 14.696 psia, so every row is the same count of moles and the mass follows the molar mass: 16.043 lb/lbmol for methane and 44.01 for carbon dioxide. The heating values differ too, 1010 Btu/scf for methane against 0 for carbon dioxide.' then 'old'
           when prompt = 'One Mscf of methane carries 19.1757 kg and one Mscf of carbon dioxide carries 52.6038 kg. What does the course say the two rows hold the same?' and options = '["The mass in the Mscf", "The count of moles", "The molar mass behind the row", "The typical heating value of the gas"]'::jsonb and answer_index = 1 and explanation is not distinct from 'A standard cubic foot counts gas at 60 F and 14.696 psia, so every row is the same count of moles and the mass follows the molar mass: 16.043 lb/lbmol for methane and 44.01 for carbon dioxide. The heating values differ too, 1010 Btu/scf for methane against 0 for carbon dioxide.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'One Mscf of methane carries 19.1757 kg and one Mscf of carbon dioxide carries 52.6038 kg. What does the course say the two rows hold the same?', options = '["The mass in the Mscf", "The count of moles", "The molar mass behind the row", "The typical heating value of the gas"]'::jsonb, explanation = 'A standard cubic foot counts gas at 60 F and 14.696 psia, so every row is the same count of moles and the mass follows the molar mass: 16.043 lb/lbmol for methane and 44.01 for carbon dioxide. The heating values differ too, 1010 Btu/scf for methane against 0 for carbon dioxide.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 6
  select case
           when prompt = 'How does the digest say kgPerMscf is built from the engine''s constants?' and options = '["1000 times SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, times LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times GAL_PER_FT3 gives cubic feet, over LB_PER_KG gives kilograms", "SCF_PER_LBMOL over 1000 gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lb-mol in one Mscf is 1000 over SCF_PER_LBMOL, the pounds are that times the mole-weighted molar mass, and the kilograms are the pounds over LB_PER_KG. Done on the constants it gives 19.1757 for methane and 52.6038 for carbon dioxide, a difference of 0.0000 from the engine on both rows.' then 'old'
           when prompt = 'How does the course say kgPerMscf is built from the engine''s constants?' and options = '["1000 times SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, times LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times GAL_PER_FT3 gives cubic feet, over LB_PER_KG gives kilograms", "SCF_PER_LBMOL over 1000 gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lb-mol in one Mscf is 1000 over SCF_PER_LBMOL, the pounds are that times the mole-weighted molar mass, and the kilograms are the pounds over LB_PER_KG. Done on the constants it gives 19.1757 for methane and 52.6038 for carbon dioxide, a difference of 0.0000 from the engine on both rows.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the course say kgPerMscf is built from the engine''s constants?', options = '["1000 times SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, times LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times GAL_PER_FT3 gives cubic feet, over LB_PER_KG gives kilograms", "SCF_PER_LBMOL over 1000 gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms", "1000 over SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms"]'::jsonb, explanation = 'The lb-mol in one Mscf is 1000 over SCF_PER_LBMOL, the pounds are that times the mole-weighted molar mass, and the kilograms are the pounds over LB_PER_KG. Done on the constants it gives 19.1757 for methane and 52.6038 for carbon dioxide, a difference of 0.0000 from the engine on both rows.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-is-being-flared ord 9
  select case
           when prompt = 'The CO2 row carries one carbon per molecule and is marked inert. What does the digest say about that carbon?' and options = '["It is left out of the carbon per mole, because the row is marked inert.", "It is counted as a fuel carbon, at the typical heating value of methane.", "It is counted at zero in the carbon per mole, as nitrogen''s row is.", "It is counted when the carbon per mole is counted, and CO2 is no fuel."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest''s sentence on the row: its carbon is counted when the carbon per mole is counted, and it is not a fuel. The CO2 row''s typical heating value is 0, and nitrogen carries 0 carbon per molecule where CO2 carries 1.' then 'old'
           when prompt = 'The CO2 row carries one carbon per molecule and is marked inert. What does the course say about that carbon?' and options = '["It is left out of the carbon per mole, because the row is marked inert.", "It is counted as a fuel carbon, at the typical heating value of methane.", "It is counted at zero in the carbon per mole, as nitrogen''s row is.", "It is counted when the carbon per mole is counted, and CO2 is no fuel."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s sentence on the row: its carbon is counted when the carbon per mole is counted, and it is not a fuel. The CO2 row''s typical heating value is 0, and nitrogen carries 0 carbon per molecule where CO2 carries 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m01-what-is-being-flared ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The CO2 row carries one carbon per molecule and is marked inert. What does the course say about that carbon?', options = '["It is left out of the carbon per mole, because the row is marked inert.", "It is counted as a fuel carbon, at the typical heating value of methane.", "It is counted at zero in the carbon per mole, as nitrogen''s row is.", "It is counted when the carbon per mole is counted, and CO2 is no fuel."]'::jsonb, explanation = 'The course''s sentence on the row: its carbon is counted when the carbon per mole is counted, and it is not a fuel. The CO2 row''s typical heating value is 0, and nitrogen carries 0 carbon per molecule where CO2 carries 1.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-is-being-flared' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m01-what-is-being-flared ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 1
  select case
           when prompt = 'On what basis does characteriseGas blend a gas''s heating value?' and options = '["Mass-weighted over the normalised analysis, inerts included", "Mole-weighted over the normalised analysis, inerts included", "Mole-weighted over the hydrocarbons alone, rescaled to one", "Weighted by liquid volume over the recoverable components"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Every property in SECTION 5 is a mole-weighted sum over the normalised analysis, and the heating value is the mole-weighted heating value. The mass weighting (1537.2878 Btu/scf on EGBEMA) and the hydrocarbons alone (1308.6069) are the two shortcuts the digest prints beside the engine''s 1248.4110.' then 'old'
           when prompt = 'On what basis does characteriseGas blend a gas''s heating value?' and options = '["Mass-weighted over the normalised analysis, inerts included", "Mole-weighted over the normalised analysis, inerts included", "Mole-weighted over the hydrocarbons alone, rescaled to one", "Weighted by liquid volume over the recoverable components"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Every property in the gas lesson is a mole-weighted sum over the normalised analysis, and the heating value is the mole-weighted heating value. The mass weighting (1537.2878 Btu/scf on EGBEMA) and the hydrocarbons alone (1308.6069) are the two shortcuts the course prints beside the engine''s 1248.4110.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On what basis does characteriseGas blend a gas''s heating value?', options = '["Mass-weighted over the normalised analysis, inerts included", "Mole-weighted over the normalised analysis, inerts included", "Mole-weighted over the hydrocarbons alone, rescaled to one", "Weighted by liquid volume over the recoverable components"]'::jsonb, explanation = 'Every property in the gas lesson is a mole-weighted sum over the normalised analysis, and the heating value is the mole-weighted heating value. The mass weighting (1537.2878 Btu/scf on EGBEMA) and the hydrocarbons alone (1308.6069) are the two shortcuts the course prints beside the engine''s 1248.4110.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 4
  select case
           when prompt = 'EGBEMA''s inertMoleFraction is 0.0460. Which normalised fractions does the engine sum to get it?' and options = '["carbon dioxide at 0.0280 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus carbon dioxide at 0.0280", "nitrogen, carbon dioxide and methane at 0.7420"]'::jsonb and answer_index = 2 and explanation is not distinct from 'inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2. The digest''s table prints N2 0.0180, CO2 0.0280, N2 plus CO2 0.0460 and the engine''s 0.0460. C5 and C1 are not marked inert.' then 'old'
           when prompt = 'EGBEMA''s inertMoleFraction is 0.0460. Which normalised fractions does the engine sum to get it?' and options = '["carbon dioxide at 0.0280 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus carbon dioxide at 0.0280", "nitrogen, carbon dioxide and methane at 0.7420"]'::jsonb and answer_index = 2 and explanation is not distinct from 'inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2. The course''s table prints N2 0.0180, CO2 0.0280, N2 plus CO2 0.0460 and the engine''s 0.0460. C5 and C1 are not marked inert.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA''s inertMoleFraction is 0.0460. Which normalised fractions does the engine sum to get it?', options = '["carbon dioxide at 0.0280 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus pentanes plus at 0.0120", "nitrogen at 0.0180 plus carbon dioxide at 0.0280", "nitrogen, carbon dioxide and methane at 0.7420"]'::jsonb, explanation = 'inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2. The course''s table prints N2 0.0180, CO2 0.0280, N2 plus CO2 0.0460 and the engine''s 0.0460. C5 and C1 are not marked inert.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 5
  select case
           when prompt = 'OGUTA''s carbonPerMol is 1.0580 and its hydrocarbonCarbonPerMol is 1.0430. What does the digest say carbonPerMol minus hydrocarbonCarbonPerMol is, in every row?' and options = '["The CO2 mole fraction", "The inert mole fraction", "The nitrogen mole fraction", "The ethane mole fraction"]'::jsonb and answer_index = 0 and explanation is not distinct from 'In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2. OGUTA''s co2MoleFraction is 0.0150, and its inertMoleFraction, 0.0270, also counts nitrogen, which carries no carbon.' then 'old'
           when prompt = 'OGUTA''s carbonPerMol is 1.0580 and its hydrocarbonCarbonPerMol is 1.0430. What does the course say carbonPerMol minus hydrocarbonCarbonPerMol is, in every row?' and options = '["The CO2 mole fraction", "The inert mole fraction", "The nitrogen mole fraction", "The ethane mole fraction"]'::jsonb and answer_index = 0 and explanation is not distinct from 'In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2. OGUTA''s co2MoleFraction is 0.0150, and its inertMoleFraction, 0.0270, also counts nitrogen, which carries no carbon.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'OGUTA''s carbonPerMol is 1.0580 and its hydrocarbonCarbonPerMol is 1.0430. What does the course say carbonPerMol minus hydrocarbonCarbonPerMol is, in every row?', options = '["The CO2 mole fraction", "The inert mole fraction", "The nitrogen mole fraction", "The ethane mole fraction"]'::jsonb, explanation = 'In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2. OGUTA''s co2MoleFraction is 0.0150, and its inertMoleFraction, 0.0270, also counts nitrogen, which carries no carbon.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 9
  select case
           when prompt = 'The digest probes a gas of methane 0.9 and propane 0.1, with propane''s carbon number left blank. What carbonPerMol does the engine report?' and options = '["A refusal naming C3, since no carbon number was typed", "None: carbonPerMol is left null and named missing", "1.2000 for hydrocarbonCarbonPerMol, carbonPerMol null", "1.2000, as with 3 typed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'A hydrocarbon typed without a carbon number takes it from the reference by its code. Both probe rows, propane''s carbon number typed and left blank, read carbonPerMol 1.2000 and hydrocarbonCarbonPerMol 1.2000.' then 'old'
           when prompt = 'The course probes a gas of methane 0.9 and propane 0.1, with propane''s carbon number left blank. What carbonPerMol does the engine report?' and options = '["A refusal naming C3, since no carbon number was typed", "None: carbonPerMol is left null and named missing", "1.2000 for hydrocarbonCarbonPerMol, carbonPerMol null", "1.2000, as with 3 typed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'A hydrocarbon typed without a carbon number takes it from the reference by its code. Both probe rows, propane''s carbon number typed and left blank, read carbonPerMol 1.2000 and hydrocarbonCarbonPerMol 1.2000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course probes a gas of methane 0.9 and propane 0.1, with propane''s carbon number left blank. What carbonPerMol does the engine report?', options = '["A refusal naming C3, since no carbon number was typed", "None: carbonPerMol is left null and named missing", "1.2000 for hydrocarbonCarbonPerMol, carbonPerMol null", "1.2000, as with 3 typed"]'::jsonb, explanation = 'A hydrocarbon typed without a carbon number takes it from the reference by its code. Both probe rows, propane''s carbon number typed and left blank, read carbonPerMol 1.2000 and hydrocarbonCarbonPerMol 1.2000.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 12
  select case
           when prompt = 'What methaneMoleFraction does characteriseGas report for OGUTA?' and options = '["0.7420", "0.9250", "0.7800", "0.7411"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5 prints OGUTA''s methane at 0.9250; the other three belong to EGBEMA, the studio gas and the short sheet as scaled.' then 'old'
           when prompt = 'What methaneMoleFraction does characteriseGas report for OGUTA?' and options = '["0.7420", "0.9250", "0.7800", "0.7411"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The gas lesson prints OGUTA''s methane at 0.9250; the other three belong to EGBEMA, the studio gas and the short sheet as scaled.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What methaneMoleFraction does characteriseGas report for OGUTA?', options = '["0.7420", "0.9250", "0.7800", "0.7411"]'::jsonb, explanation = 'The gas lesson prints OGUTA''s methane at 0.9250; the other three belong to EGBEMA, the studio gas and the short sheet as scaled.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 13
  select case
           when prompt = 'The engine is asked about EGBEMA''s hydrocarbons alone, inerts left out and the rest scaled to one. What does the digest print for that heating value?' and options = '["1308.6069 Btu/scf, 60.1959 below the engine''s", "1537.2878 Btu/scf, 288.8768 above the engine''s", "1248.4110 Btu/scf, the same as the engine''s", "1308.6069 Btu/scf, 60.1959 above the engine''s"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The hydrocarbons-alone row reads 1308.6069 with 60.1959 in the "minus the engine''s" column, and the digest says both shortcuts read higher than the engine on this gas. 1537.2878 with 288.8768 is the mass-weighted row, and 1248.4110 is the engine on moles.' then 'old'
           when prompt = 'The engine is asked about EGBEMA''s hydrocarbons alone, inerts left out and the rest scaled to one. What does the course print for that heating value?' and options = '["1308.6069 Btu/scf, 60.1959 below the engine''s", "1537.2878 Btu/scf, 288.8768 above the engine''s", "1248.4110 Btu/scf, the same as the engine''s", "1308.6069 Btu/scf, 60.1959 above the engine''s"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The hydrocarbons-alone row reads 1308.6069 with 60.1959 in the "minus the engine''s" column, and the course says both shortcuts read higher than the engine on this gas. 1537.2878 with 288.8768 is the mass-weighted row, and 1248.4110 is the engine on moles.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine is asked about EGBEMA''s hydrocarbons alone, inerts left out and the rest scaled to one. What does the course print for that heating value?', options = '["1308.6069 Btu/scf, 60.1959 below the engine''s", "1537.2878 Btu/scf, 288.8768 above the engine''s", "1248.4110 Btu/scf, the same as the engine''s", "1308.6069 Btu/scf, 60.1959 above the engine''s"]'::jsonb, explanation = 'The hydrocarbons-alone row reads 1308.6069 with 60.1959 in the "minus the engine''s" column, and the course says both shortcuts read higher than the engine on this gas. 1537.2878 with 288.8768 is the mass-weighted row, and 1248.4110 is the engine on moles.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-the-gas-by-the-mole ord 14
  select case
           when prompt = 'Which gas does the digest print with carbonPerMol 1.3000 and hydrocarbonCarbonPerMol 1.2800?' and options = '["The studio''s opening gas, with CO2 0.0200", "EGBEMA, with CO2 0.0280", "OGUTA, with its CO2 mole fraction at 0.0150", "The propane probe, methane 0.9 and propane 0.1"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The studio''s opening gas reads 1.3000 and 1.2800 with a co2MoleFraction of 0.0200. EGBEMA reads 1.3600 and 1.3320, OGUTA 1.0580 and 1.0430, and the propane probe 1.2000 and 1.2000.' then 'old'
           when prompt = 'Which gas does the course print with carbonPerMol 1.3000 and hydrocarbonCarbonPerMol 1.2800?' and options = '["The studio''s opening gas, with CO2 0.0200", "EGBEMA, with CO2 0.0280", "OGUTA, with its CO2 mole fraction at 0.0150", "The propane probe, methane 0.9 and propane 0.1"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The studio''s opening gas reads 1.3000 and 1.2800 with a co2MoleFraction of 0.0200. EGBEMA reads 1.3600 and 1.3320, OGUTA 1.0580 and 1.0430, and the propane probe 1.2000 and 1.2000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m02-the-gas-by-the-mole ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which gas does the course print with carbonPerMol 1.3000 and hydrocarbonCarbonPerMol 1.2800?', options = '["The studio''s opening gas, with CO2 0.0200", "EGBEMA, with CO2 0.0280", "OGUTA, with its CO2 mole fraction at 0.0150", "The propane probe, methane 0.9 and propane 0.1"]'::jsonb, explanation = 'The studio''s opening gas reads 1.3000 and 1.2800 with a co2MoleFraction of 0.0200. EGBEMA reads 1.3600 and 1.3320, OGUTA 1.0580 and 1.0430, and the propane probe 1.2000 and 1.2000.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-the-gas-by-the-mole' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m02-the-gas-by-the-mole ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-liquids-in-the-gas ord 3
  select case
           when prompt = 'OGUTA reads gpmC2Plus 1.3157 and gpmC3Plus 0.4890. What does the digest name the column between them, and what does it print for OGUTA?' and options = '["The ethane, 0.8268", "The ethane, 2.7737", "The propane, 0.8268", "The methane, 0.8268"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The column is gpmC2Plus minus gpmC3Plus, and the digest heads it "the ethane": 0.8268 on OGUTA, 2.7737 on EGBEMA and 2.4003 on the studio''s opening gas. Methane is not recoverable as NGL and is in neither cut.' then 'old'
           when prompt = 'OGUTA reads gpmC2Plus 1.3157 and gpmC3Plus 0.4890. What does the course name the column between them, and what does it print for OGUTA?' and options = '["The ethane, 0.8268", "The ethane, 2.7737", "The propane, 0.8268", "The methane, 0.8268"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The column is gpmC2Plus minus gpmC3Plus, and the course heads it "the ethane": 0.8268 on OGUTA, 2.7737 on EGBEMA and 2.4003 on the studio''s opening gas. Methane is not recoverable as NGL and is in neither cut.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m03-the-liquids-in-the-gas ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'OGUTA reads gpmC2Plus 1.3157 and gpmC3Plus 0.4890. What does the course name the column between them, and what does it print for OGUTA?', options = '["The ethane, 0.8268", "The ethane, 2.7737", "The propane, 0.8268", "The methane, 0.8268"]'::jsonb, explanation = 'The column is gpmC2Plus minus gpmC3Plus, and the course heads it "the ethane": 0.8268 on OGUTA, 2.7737 on EGBEMA and 2.4003 on the studio''s opening gas. Methane is not recoverable as NGL and is in neither cut.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-liquids-in-the-gas ord 11
  select case
           when prompt = 'What does the digest print for EGBEMA''s propane and heavier mass against its whole mass in one Mscf?' and options = '["5.5819 of 25.4954 kg, a share of 0.2189", "6.6647 of 26.7066 kg, a share of 0.2496", "6.6647 of 26.7066 kg, a share of 0.2189", "0.9798 of 21.0224 kg, a share of 0.0466"]'::jsonb and answer_index = 1 and explanation is not distinct from 'EGBEMA''s row reads kgPerMscf 26.7066, c3PlusKgPerMscf 6.6647 and c3PlusKgPerMscf over kgPerMscf 0.2496. 5.5819 of 25.4954 at 0.2189 is the studio''s opening gas and 0.9798 of 21.0224 at 0.0466 is OGUTA.' then 'old'
           when prompt = 'What does the course print for EGBEMA''s propane and heavier mass against its whole mass in one Mscf?' and options = '["5.5819 of 25.4954 kg, a share of 0.2189", "6.6647 of 26.7066 kg, a share of 0.2496", "6.6647 of 26.7066 kg, a share of 0.2189", "0.9798 of 21.0224 kg, a share of 0.0466"]'::jsonb and answer_index = 1 and explanation is not distinct from 'EGBEMA''s row reads kgPerMscf 26.7066, c3PlusKgPerMscf 6.6647 and c3PlusKgPerMscf over kgPerMscf 0.2496. 5.5819 of 25.4954 at 0.2189 is the studio''s opening gas and 0.9798 of 21.0224 at 0.0466 is OGUTA.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m03-the-liquids-in-the-gas ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print for EGBEMA''s propane and heavier mass against its whole mass in one Mscf?', options = '["5.5819 of 25.4954 kg, a share of 0.2189", "6.6647 of 26.7066 kg, a share of 0.2496", "6.6647 of 26.7066 kg, a share of 0.2189", "0.9798 of 21.0224 kg, a share of 0.0466"]'::jsonb, explanation = 'EGBEMA''s row reads kgPerMscf 26.7066, c3PlusKgPerMscf 6.6647 and c3PlusKgPerMscf over kgPerMscf 0.2496. 5.5819 of 25.4954 at 0.2189 is the studio''s opening gas and 0.9798 of 21.0224 at 0.0466 is OGUTA.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-liquids-in-the-gas ord 14
  select case
           when prompt = 'RICHNESS_GPM exports the edges of a screening word. Beside that word, what does the digest say governs a route''s liquids?' and options = '["The RICHNESS_GPM edge the gas sits above", "The richness word, read off gpmC3Plus", "gpmC2Plus, read against the same edges", "The route''s own liquids limit"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest reads the richness word off gpmC3Plus against RICHNESS_GPM and calls it "a screening word; a route''s own liquids limit governs".' then 'old'
           when prompt = 'RICHNESS_GPM exports the edges of a screening word. Beside that word, what does the course say governs a route''s liquids?' and options = '["The RICHNESS_GPM edge the gas sits above", "The richness word, read off gpmC3Plus", "gpmC2Plus, read against the same edges", "The route''s own liquids limit"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course reads the richness word off gpmC3Plus against RICHNESS_GPM and calls it "a screening word; a route''s own liquids limit governs".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m03-the-liquids-in-the-gas ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'RICHNESS_GPM exports the edges of a screening word. Beside that word, what does the course say governs a route''s liquids?', options = '["The RICHNESS_GPM edge the gas sits above", "The richness word, read off gpmC3Plus", "gpmC2Plus, read against the same edges", "The route''s own liquids limit"]'::jsonb, explanation = 'The course reads the richness word off gpmC3Plus against RICHNESS_GPM and calls it "a screening word; a route''s own liquids limit governs".'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-liquids-in-the-gas' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m03-the-liquids-in-the-gas ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-flare-by-the-rule ord 2
  select case
           when prompt = 'Which methane does the engine count as escaping the flare?' and options = '["The methane in the gas times one less the destruction efficiency", "Every unburned carbon atom, counted as methane", "The methane in the gas times one less the combustion efficiency", "The hydrocarbon carbon times one less the destruction efficiency"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The methane that escapes is the methane in the gas times one less the destruction efficiency. Every unburned carbon counted as methane is the shortcut the digest prints beside the engine at 2083.055 t/yr against the engine''s 1136.490.' then 'old'
           when prompt = 'Which methane does the engine count as escaping the flare?' and options = '["The methane in the gas times one less the destruction efficiency", "Every unburned carbon atom, counted as methane", "The methane in the gas times one less the combustion efficiency", "The hydrocarbon carbon times one less the destruction efficiency"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The methane that escapes is the methane in the gas times one less the destruction efficiency. Every unburned carbon counted as methane is the shortcut the course prints beside the engine at 2083.055 t/yr against the engine''s 1136.490.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m04-the-flare-by-the-rule ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which methane does the engine count as escaping the flare?', options = '["The methane in the gas times one less the destruction efficiency", "Every unburned carbon atom, counted as methane", "The methane in the gas times one less the combustion efficiency", "The hydrocarbon carbon times one less the destruction efficiency"]'::jsonb, explanation = 'The methane that escapes is the methane in the gas times one less the destruction efficiency. Every unburned carbon counted as methane is the shortcut the course prints beside the engine at 2083.055 t/yr against the engine''s 1136.490.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-flare-by-the-rule ord 3
  select case
           when prompt = 'What does the digest print for EGBEMA''s methane if every unburned carbon atom is counted as methane, and over the engine''s figure?' and options = '["3788.301 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1531.658", "1531.658 t/yr, 1.0000 over the engine''s 1136.490"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The shortcut row reads 2083.055 t/yr and 1.8329 in the "over the engine''s" column; the engine''s row reads 1136.490 and 1.0000. 3788.301 is the engine''s methane at a destruction efficiency of 0.9, and 1531.658 is the all-methane probe.' then 'old'
           when prompt = 'What does the course print for EGBEMA''s methane if every unburned carbon atom is counted as methane, and over the engine''s figure?' and options = '["3788.301 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1531.658", "1531.658 t/yr, 1.0000 over the engine''s 1136.490"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The shortcut row reads 2083.055 t/yr and 1.8329 in the "over the engine''s" column; the engine''s row reads 1136.490 and 1.0000. 3788.301 is the engine''s methane at a destruction efficiency of 0.9, and 1531.658 is the all-methane probe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m04-the-flare-by-the-rule ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course print for EGBEMA''s methane if every unburned carbon atom is counted as methane, and over the engine''s figure?', options = '["3788.301 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1136.490", "2083.055 t/yr, 1.8329 over the engine''s 1531.658", "1531.658 t/yr, 1.0000 over the engine''s 1136.490"]'::jsonb, explanation = 'The shortcut row reads 2083.055 t/yr and 1.8329 in the "over the engine''s" column; the engine''s row reads 1136.490 and 1.0000. 3788.301 is the engine''s methane at a destruction efficiency of 0.9, and 1531.658 is the all-methane probe.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-flare-by-the-rule ord 6
  select case
           when prompt = 'Which of the two efficiencies changes how much of the CO2 already in the gas leaves the flare as CO2?' and options = '["Neither: it leaves as CO2 at every efficiency.", "The combustion efficiency, which sets the CO2.", "The destruction efficiency, which sets the share destroyed.", "Both, through the product of the two efficiencies."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "The CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane." The all-CO2 probe reads 140054.324 t/yr at EGBEMA''s efficiencies and at both efficiencies 0.5.' then 'old'
           when prompt = 'Which of the two efficiencies changes how much of the CO2 already in the gas leaves the flare as CO2?' and options = '["Neither: it leaves as CO2 at every efficiency.", "The combustion efficiency, which sets the CO2.", "The destruction efficiency, which sets the share destroyed.", "Both, through the product of the two efficiencies."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "The CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane." The all-CO2 probe reads 140054.324 t/yr at EGBEMA''s efficiencies and at both efficiencies 0.5.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m04-the-flare-by-the-rule ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of the two efficiencies changes how much of the CO2 already in the gas leaves the flare as CO2?', options = '["Neither: it leaves as CO2 at every efficiency.", "The combustion efficiency, which sets the CO2.", "The destruction efficiency, which sets the share destroyed.", "Both, through the product of the two efficiencies."]'::jsonb, explanation = 'The course states: "The CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane." The all-CO2 probe reads 140054.324 t/yr at EGBEMA''s efficiencies and at both efficiencies 0.5.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-flare-by-the-rule ord 12
  select case
           when prompt = 'Which efficiency does the digest define as the share oxidised to CO2?' and options = '["The destruction efficiency, which sets the CO2", "The combustion efficiency, which sets the CO2", "The destruction efficiency, which sets the methane", "The combustion efficiency, which sets the methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2. A combustion efficiency cannot exceed the destruction efficiency.' then 'old'
           when prompt = 'Which efficiency does the course define as the share oxidised to CO2?' and options = '["The destruction efficiency, which sets the CO2", "The combustion efficiency, which sets the CO2", "The destruction efficiency, which sets the methane", "The combustion efficiency, which sets the methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2. A combustion efficiency cannot exceed the destruction efficiency.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m04-the-flare-by-the-rule ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which efficiency does the course define as the share oxidised to CO2?', options = '["The destruction efficiency, which sets the CO2", "The combustion efficiency, which sets the CO2", "The destruction efficiency, which sets the methane", "The combustion efficiency, which sets the methane"]'::jsonb, explanation = 'The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2. A combustion efficiency cannot exceed the destruction efficiency.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-the-flare-by-the-rule ord 13
  select case
           when prompt = 'In EGBEMA''s "left out minus given" row the CO2 reads 2798.286 and the CO2e 2798.285, with the methane at 0.000. What reason does the digest give?' and options = '["Each tonnage is reported to three decimals before the difference is taken.", "The CO2e carries the methane at the GWP, and the methane moved slightly.", "The CO2e is formed at 0.955 and the CO2 at 0.97.", "The CO2e weighs its CO2 at 44.01 and the CO2 row at 44.009."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The rounding note: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference can differ in the third decimal though the methane is the same.' then 'old'
           when prompt = 'In EGBEMA''s "left out minus given" row the CO2 reads 2798.286 and the CO2e 2798.285, with the methane at 0.000. What reason does the course give?' and options = '["Each tonnage is reported to three decimals before the difference is taken.", "The CO2e carries the methane at the GWP, and the methane moved slightly.", "The CO2e is formed at 0.955 and the CO2 at 0.97.", "The CO2e weighs its CO2 at 44.01 and the CO2 row at 44.009."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The rounding note: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference can differ in the third decimal though the methane is the same.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m04-the-flare-by-the-rule ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In EGBEMA''s "left out minus given" row the CO2 reads 2798.286 and the CO2e 2798.285, with the methane at 0.000. What reason does the course give?', options = '["Each tonnage is reported to three decimals before the difference is taken.", "The CO2e carries the methane at the GWP, and the methane moved slightly.", "The CO2e is formed at 0.955 and the CO2 at 0.97.", "The CO2e weighs its CO2 at 44.01 and the CO2 row at 44.009."]'::jsonb, explanation = 'The rounding note: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference can differ in the third decimal though the methane is the same.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-the-flare-by-the-rule' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m04-the-flare-by-the-rule ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-co2e-and-its-limits ord 4
  select case
           when prompt = 'How does the digest form methaneShareOfFlareCo2e?' and options = '["flareCh4Tonnes over flareCo2eTonnes", "flareCh4Tonnes times the GWP over flareCo2Tonnes", "flareCh4Tonnes times the GWP over flareCo2eTonnes", "flareCh4Tonnes over flareCo2Tonnes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'methaneShareOfFlareCo2e is flareCh4Tonnes times the GWP over flareCo2eTonnes, 0.1568 on EGBEMA at 29.8. CO2e is the CO2 plus the methane times the GWP.' then 'old'
           when prompt = 'How does the course form methaneShareOfFlareCo2e?' and options = '["flareCh4Tonnes over flareCo2eTonnes", "flareCh4Tonnes times the GWP over flareCo2Tonnes", "flareCh4Tonnes times the GWP over flareCo2eTonnes", "flareCh4Tonnes over flareCo2Tonnes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'methaneShareOfFlareCo2e is flareCh4Tonnes times the GWP over flareCo2eTonnes, 0.1568 on EGBEMA at 29.8. CO2e is the CO2 plus the methane times the GWP.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m05-co2e-and-its-limits ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the course form methaneShareOfFlareCo2e?', options = '["flareCh4Tonnes over flareCo2eTonnes", "flareCh4Tonnes times the GWP over flareCo2Tonnes", "flareCh4Tonnes times the GWP over flareCo2eTonnes", "flareCh4Tonnes over flareCo2Tonnes"]'::jsonb, explanation = 'methaneShareOfFlareCo2e is flareCh4Tonnes times the GWP over flareCo2eTonnes, 0.1568 on EGBEMA at 29.8. CO2e is the CO2 plus the methane times the GWP.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-co2e-and-its-limits ord 10
  select case
           when prompt = 'What does the digest say about a flare that is not lit?' and options = '["It is not modelled; the engine''s flare is lit.", "It is modelled at destruction efficiency 0.5.", "It is modelled with its methane set by the combustion efficiency.", "It is modelled as vented gas, all of it methane."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Among the stated limits: an unlit flare is not modelled. Gas sent to a flare that is not lit is vented, all of it methane; the engine''s flare is lit.' then 'old'
           when prompt = 'What does the course say about a flare that is not lit?' and options = '["It is not modelled; the engine''s flare is lit.", "It is modelled at destruction efficiency 0.5.", "It is modelled with its methane set by the combustion efficiency.", "It is modelled as vented gas, all of it methane."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Among the stated limits: an unlit flare is not modelled. Gas sent to a flare that is not lit is vented, all of it methane; the engine''s flare is lit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m05-co2e-and-its-limits ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course say about a flare that is not lit?', options = '["It is not modelled; the engine''s flare is lit.", "It is modelled at destruction efficiency 0.5.", "It is modelled with its methane set by the combustion efficiency.", "It is modelled as vented gas, all of it methane."]'::jsonb, explanation = 'Among the stated limits: an unlit flare is not modelled. Gas sent to a flare that is not lit is vented, all of it methane; the engine''s flare is lit.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-co2e-and-its-limits ord 12
  select case
           when prompt = 'The digest shows the on-stream days default by asking one function with the days omitted. Which, and what does it report?' and options = '["abatement, onstreamDays 355", "routeEconomics, onstreamDays 366", "routeEconomics, onstreamDays 350", "characteriseGas, onstreamDays 350"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 13: routeEconomics, asked with the days omitted, reports onstreamDays 350, and 7.5 MMscfd times a million times 350 is the omitted call''s scfPerYear.' then 'old'
           when prompt = 'The course shows the on-stream days default by asking one function with the days omitted. Which, and what does it report?' and options = '["abatement, onstreamDays 355", "routeEconomics, onstreamDays 366", "routeEconomics, onstreamDays 350", "characteriseGas, onstreamDays 350"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The refusals lesson: routeEconomics, asked with the days omitted, reports onstreamDays 350, and 7.5 MMscfd times a million times 350 is the omitted call''s scfPerYear.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m05-co2e-and-its-limits ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course shows the on-stream days default by asking one function with the days omitted. Which, and what does it report?', options = '["abatement, onstreamDays 355", "routeEconomics, onstreamDays 366", "routeEconomics, onstreamDays 350", "characteriseGas, onstreamDays 350"]'::jsonb, explanation = 'The refusals lesson: routeEconomics, asked with the days omitted, reports onstreamDays 350, and 7.5 MMscfd times a million times 350 is the omitted call''s scfPerYear.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-co2e-and-its-limits ord 13
  select case
           when prompt = 'Which of these does the engine ship?' and options = '["Typical component heating values and liquid densities", "A methane GWP, taken whenever the GWP box is left blank", "A credit price for the tonnes a route abates", "A default flare destruction efficiency"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: the methane GWP and any credit price are case inputs, and the engine ships neither; the efficiencies have no default. The component heating values and liquid densities are the engine''s own labelled typical tables.' then 'old'
           when prompt = 'Which of these does the engine ship?' and options = '["Typical component heating values and liquid densities", "A methane GWP, taken whenever the GWP box is left blank", "A credit price for the tonnes a route abates", "A default flare destruction efficiency"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: the methane GWP and any credit price are case inputs, and the engine ships neither; the efficiencies have no default. The component heating values and liquid densities are the engine''s own labelled typical tables.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m05-co2e-and-its-limits ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the engine ship?', options = '["Typical component heating values and liquid densities", "A methane GWP, taken whenever the GWP box is left blank", "A credit price for the tonnes a route abates", "A default flare destruction efficiency"]'::jsonb, explanation = 'The course states: the methane GWP and any credit price are case inputs, and the engine ships neither; the efficiencies have no default. The component heating values and liquid densities are the engine''s own labelled typical tables.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-co2e-and-its-limits' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m05-co2e-and-its-limits ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 1
  select case
           when prompt = 'Which two lines of EGBEMA''s end-to-end table are the most any route can take out of a thousand standard cubic feet, by mass?' and options = '["mass, kg/Mscf and propane and heavier, kg/Mscf", "liquids, gal/Mscf C3+ and richness", "heating value, Btu/scf and inerts, mole fraction", "flare CO2, t/yr and flare methane, t/yr"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 says of kgPerMscf and c3PlusKgPerMscf: they are the most any route can take out of a thousand standard cubic feet, by mass. On EGBEMA they read 26.7066 and 6.6647.' then 'old'
           when prompt = 'Which two lines of EGBEMA''s end-to-end table are the most any route can take out of a thousand standard cubic feet, by mass?' and options = '["mass, kg/Mscf and propane and heavier, kg/Mscf", "liquids, gal/Mscf C3+ and richness", "heating value, Btu/scf and inerts, mole fraction", "flare CO2, t/yr and flare methane, t/yr"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The mass ceiling lesson says of kgPerMscf and c3PlusKgPerMscf: they are the most any route can take out of a thousand standard cubic feet, by mass. On EGBEMA they read 26.7066 and 6.6647.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m06-the-associate-reading ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which two lines of EGBEMA''s end-to-end table are the most any route can take out of a thousand standard cubic feet, by mass?', options = '["mass, kg/Mscf and propane and heavier, kg/Mscf", "liquids, gal/Mscf C3+ and richness", "heating value, Btu/scf and inerts, mole fraction", "flare CO2, t/yr and flare methane, t/yr"]'::jsonb, explanation = 'The mass ceiling lesson says of kgPerMscf and c3PlusKgPerMscf: they are the most any route can take out of a thousand standard cubic feet, by mass. On EGBEMA they read 26.7066 and 6.6647.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 3
  select case
           when prompt = 'The digest reads the studio''s opening gas the same way as EGBEMA. At which line does its table end?' and options = '["flare CO2, t/yr", "flare CO2e, t/yr", "flare methane, t/yr", "richness, which reads rich"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The studio''s table runs from the heating value, 1210.7800 Btu/scf, to richness, rich. Its flare is refused until the efficiencies are typed.' then 'old'
           when prompt = 'The course reads the studio''s opening gas the same way as EGBEMA. At which line does its table end?' and options = '["flare CO2, t/yr", "flare CO2e, t/yr", "flare methane, t/yr", "richness, which reads rich"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The studio''s table runs from the heating value, 1210.7800 Btu/scf, to richness, rich. Its flare is refused until the efficiencies are typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m06-the-associate-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course reads the studio''s opening gas the same way as EGBEMA. At which line does its table end?', options = '["flare CO2, t/yr", "flare CO2e, t/yr", "flare methane, t/yr", "richness, which reads rich"]'::jsonb, explanation = 'The studio''s table runs from the heating value, 1210.7800 Btu/scf, to richness, rich. Its flare is refused until the efficiencies are typed.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 5
  select case
           when prompt = 'Beside its analysis, which flare inputs does the digest give EGBEMA?' and options = '["10 MMscfd, 350 days, 0.97, 0.955 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 20", "7.5 MMscfd, 350 days, 0.97, 0.97 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 29.8"]'::jsonb and answer_index = 3 and explanation is not distinct from 'EGBEMA flares 7.5 MMscfd on 355 days a year; the flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955 and uses a methane GWP of 29.8. 10 MMscfd on 350 days is the studio''s opening parcel, and 20 is a comparison GWP.' then 'old'
           when prompt = 'Beside its analysis, which flare inputs does the course give EGBEMA?' and options = '["10 MMscfd, 350 days, 0.97, 0.955 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 20", "7.5 MMscfd, 350 days, 0.97, 0.97 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 29.8"]'::jsonb and answer_index = 3 and explanation is not distinct from 'EGBEMA flares 7.5 MMscfd on 355 days a year; the flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955 and uses a methane GWP of 29.8. 10 MMscfd on 350 days is the studio''s opening parcel, and 20 is a comparison GWP.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m06-the-associate-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside its analysis, which flare inputs does the course give EGBEMA?', options = '["10 MMscfd, 350 days, 0.97, 0.955 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 20", "7.5 MMscfd, 350 days, 0.97, 0.97 and a GWP of 29.8", "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 29.8"]'::jsonb, explanation = 'EGBEMA flares 7.5 MMscfd on 355 days a year; the flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955 and uses a methane GWP of 29.8. 10 MMscfd on 350 days is the studio''s opening parcel, and 20 is a comparison GWP.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 7
  select case
           when prompt = 'The studio gas''s end-to-end table opens on its heating value. Which figure, in Btu/scf?' and options = '["1248.4110", "1210.7800", "1035.6050", "1308.6069"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 15''s studio table opens at 1210.7800; 1248.4110 opens EGBEMA''s.' then 'old'
           when prompt = 'The studio gas''s end-to-end table opens on its heating value. Which figure, in Btu/scf?' and options = '["1248.4110", "1210.7800", "1035.6050", "1308.6069"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The end-to-end lesson''s studio table opens at 1210.7800; 1248.4110 opens EGBEMA''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m06-the-associate-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio gas''s end-to-end table opens on its heating value. Which figure, in Btu/scf?', options = '["1248.4110", "1210.7800", "1035.6050", "1308.6069"]'::jsonb, explanation = 'The end-to-end lesson''s studio table opens at 1210.7800; 1248.4110 opens EGBEMA''s.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 14
  select case
           when prompt = 'EGBEMA is analysed with propane''s liquid density left blank. Which two end-to-end lines does the digest print as null on that probe?' and options = '["The liquids line and the propane and heavier kg/Mscf", "The heating value line and the liquids line", "The richness line and the mass, kg/Mscf line", "The liquids line and the richness line"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 8''s probe row prints gpmC3Plus null and richness null beside ghvBtuScf 1248.4110. SECTION 9 prints c3PlusKgPerMscf 6.6647 and kgPerMscf 26.7066 on the same probe.' then 'old'
           when prompt = 'EGBEMA is analysed with propane''s liquid density left blank. Which two end-to-end lines does the course print as null on that probe?' and options = '["The liquids line and the propane and heavier kg/Mscf", "The heating value line and the liquids line", "The richness line and the mass, kg/Mscf line", "The liquids line and the richness line"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The density lesson''s probe row prints gpmC3Plus null and richness null beside ghvBtuScf 1248.4110. The mass ceiling lesson prints c3PlusKgPerMscf 6.6647 and kgPerMscf 26.7066 on the same probe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for beginner m06-the-associate-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA is analysed with propane''s liquid density left blank. Which two end-to-end lines does the course print as null on that probe?', options = '["The liquids line and the propane and heavier kg/Mscf", "The heating value line and the liquids line", "The richness line and the mass, kg/Mscf line", "The liquids line and the richness line"]'::jsonb, explanation = 'The density lesson''s probe row prints gpmC3Plus null and richness null beside ghvBtuScf 1248.4110. The mass ceiling lesson prints c3PlusKgPerMscf 6.6647 and kgPerMscf 26.7066 on the same probe.'
     where app_slug = 'gasvalue' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: beginner m06-the-associate-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 5
  select case
           when prompt = 'Which limits did the EGBEMA study type on the Compressed natural gas route?' and options = '["minVolumeMMscfd 3, minGhvBtuScf 950, with the inerts left unset", "minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000", "minVolumeMMscfd 10, maxCo2Fraction 0.02, maxInertFraction 0.06", "minVolumeMMscfd 5, minGpmC3Plus 2, with no heating value limit"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s limits table: Compressed natural gas, minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000. The others are the gas to power, mini LNG and LPG rows.' then 'old'
           when prompt = 'Which limits did the EGBEMA study type on the Compressed natural gas route?' and options = '["minVolumeMMscfd 3, minGhvBtuScf 950, with the inerts left unset", "minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000", "minVolumeMMscfd 10, maxCo2Fraction 0.02, maxInertFraction 0.06", "minVolumeMMscfd 5, minGpmC3Plus 2, with no heating value limit"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s limits table: Compressed natural gas, minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000. The others are the gas to power, mini LNG and LPG rows.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which limits did the EGBEMA study type on the Compressed natural gas route?', options = '["minVolumeMMscfd 3, minGhvBtuScf 950, with the inerts left unset", "minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000", "minVolumeMMscfd 10, maxCo2Fraction 0.02, maxInertFraction 0.06", "minVolumeMMscfd 5, minGpmC3Plus 2, with no heating value limit"]'::jsonb, explanation = 'The course''s limits table: Compressed natural gas, minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000. The others are the gas to power, mini LNG and LPG rows.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 6
  select case
           when prompt = 'Which three verdicts does screenRoute give a ROUTE?' and options = '["pass, fail and unchecked", "passes, fails and unchecked, as each check reads", "passes, fails and screened out of the comparison", "passes, fails and not fully screened"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: "Three verdicts appear: passes, fails, and not fully screened." pass, fail and unchecked are the statuses of a single requirement''s check, and screenedOut is a compareRoutes field.' then 'old'
           when prompt = 'Which three verdicts does screenRoute give a ROUTE?' and options = '["pass, fail and unchecked", "passes, fails and unchecked, as each check reads", "passes, fails and screened out of the comparison", "passes, fails and not fully screened"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: "Three verdicts appear: passes, fails, and not fully screened." pass, fail and unchecked are the statuses of a single requirement''s check, and screenedOut is a compareRoutes field.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which three verdicts does screenRoute give a ROUTE?', options = '["pass, fail and unchecked", "passes, fails and unchecked, as each check reads", "passes, fails and screened out of the comparison", "passes, fails and not fully screened"]'::jsonb, explanation = 'The course states: "Three verdicts appear: passes, fails, and not fully screened." pass, fail and unchecked are the statuses of a single requirement''s check, and screenedOut is a compareRoutes field.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 14
  select case
           when prompt = 'How does grossMarginPerYear relate to the two figures printed before it in the year table?' and options = '["revenuePerYear minus operatingCostPerYear minus the capital", "revenuePerYear minus the variable cost of the recovered gas", "revenuePerYear minus operatingCostPerYear, on every row", "revenuePerYear minus operatingCostPerYear, over mscfPerYear"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row." The margin over mscfPerYear is valuePerMscf, and the capital sits in the cash flow''s year 0.' then 'old'
           when prompt = 'How does grossMarginPerYear relate to the two figures printed before it in the year table?' and options = '["revenuePerYear minus operatingCostPerYear minus the capital", "revenuePerYear minus the variable cost of the recovered gas", "revenuePerYear minus operatingCostPerYear, on every row", "revenuePerYear minus operatingCostPerYear, over mscfPerYear"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row." The margin over mscfPerYear is valuePerMscf, and the capital sits in the cash flow''s year 0.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does grossMarginPerYear relate to the two figures printed before it in the year table?', options = '["revenuePerYear minus operatingCostPerYear minus the capital", "revenuePerYear minus the variable cost of the recovered gas", "revenuePerYear minus operatingCostPerYear, on every row", "revenuePerYear minus operatingCostPerYear, over mscfPerYear"]'::jsonb, explanation = 'The course states: "grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row." The margin over mscfPerYear is valuePerMscf, and the capital sits in the cash flow''s year 0.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 18
  select case
           when prompt = 'What is cashFlow.year0 on every route routeEconomics hands on?' and options = '["The first year''s gross margin, as a positive", "The capitalCost less the recurring margin", "The capitalCost as a negative", "The capitalCost discounted to year 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "Year 0 is the capital as a negative, and the recurring figure is the margin", so CNG''s year0 is -29337983.06 beside a capitalCost of 29337983.06. The engine assembles the cash flow and hands it on; it does not discount it.' then 'old'
           when prompt = 'What is cashFlow.year0 on every route routeEconomics hands on?' and options = '["The first year''s gross margin, as a positive", "The capitalCost less the recurring margin", "The capitalCost as a negative", "The capitalCost discounted to year 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "Year 0 is the capital as a negative, and the recurring figure is the margin", so CNG''s year0 is -29337983.06 beside a capitalCost of 29337983.06. The engine assembles the cash flow and hands it on; it does not discount it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What is cashFlow.year0 on every route routeEconomics hands on?', options = '["The first year''s gross margin, as a positive", "The capitalCost less the recurring margin", "The capitalCost as a negative", "The capitalCost discounted to year 0"]'::jsonb, explanation = 'The course states: "Year 0 is the capital as a negative, and the recurring figure is the margin", so CNG''s year0 is -29337983.06 beside a capitalCost of 29337983.06. The engine assembles the cash flow and hands it on; it does not discount it.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 25
  select case
           when prompt = 'Which recovery gives gas to power its avoided flare of 202989.652 t/yr?' and options = '["0.88", "0.94", "0.82", "0.86"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "Gas to power recovers 0.94." avoidedFlareCo2eTonnes 202989.652. 0.88 is CNG''s recovery, 0.82 LPG''s and 0.86 mini LNG''s.' then 'old'
           when prompt = 'Which recovery gives gas to power its avoided flare of 202989.652 t/yr?' and options = '["0.88", "0.94", "0.82", "0.86"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "Gas to power recovers 0.94." avoidedFlareCo2eTonnes 202989.652. 0.88 is CNG''s recovery, 0.82 LPG''s and 0.86 mini LNG''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 25'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which recovery gives gas to power its avoided flare of 202989.652 t/yr?', options = '["0.88", "0.94", "0.82", "0.86"]'::jsonb, explanation = 'The course states: "Gas to power recovers 0.94." avoidedFlareCo2eTonnes 202989.652. 0.88 is CNG''s recovery, 0.82 LPG''s and 0.86 mini LNG''s.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 28
  select case
           when prompt = 'Which counterfactual label does the gas to power route carry on EGBEMA?' and options = '["\"CNG sold into a market that burned nothing\"", "\"Gas to power displacing diesel generators\"", "\"Gas to power displacing pipeline gas\"", "\"Gas to power for a new load that burned nothing\""]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: Gas to power''s counterfactual, "Gas to power for a new load that burned nothing": product combustion 205000, displaced 0. The CNG label is the CNG route''s third counterfactual.' then 'old'
           when prompt = 'Which counterfactual label does the gas to power route carry on EGBEMA?' and options = '["\"CNG sold into a market that burned nothing\"", "\"Gas to power displacing diesel generators\"", "\"Gas to power displacing pipeline gas\"", "\"Gas to power for a new load that burned nothing\""]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: Gas to power''s counterfactual, "Gas to power for a new load that burned nothing": product combustion 205000, displaced 0. The CNG label is the CNG route''s third counterfactual.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which counterfactual label does the gas to power route carry on EGBEMA?', options = '["\"CNG sold into a market that burned nothing\"", "\"Gas to power displacing diesel generators\"", "\"Gas to power displacing pipeline gas\"", "\"Gas to power for a new load that burned nothing\""]'::jsonb, explanation = 'The course states: Gas to power''s counterfactual, "Gas to power for a new load that burned nothing": product combustion 205000, displaced 0. The CNG label is the CNG route''s third counterfactual.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 30
  select case
           when prompt = 'How does creditSensitivity decide whether a typed price clears?' and options = '["Its credit revenue alone reaches the hurdle margin the study typed.", "Its price reaches the lowest tested price in the order typed.", "Its total margin, the gross margin plus the credit revenue, reaches the hurdle.", "Its total margin, less the capital, reaches the hurdle margin."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "totalMarginPerYear is the route''s gross margin plus that; a point clears when its total margin reaches the hurdle." The capital is no term of the credit test.' then 'old'
           when prompt = 'How does creditSensitivity decide whether a typed price clears?' and options = '["Its credit revenue alone reaches the hurdle margin the study typed.", "Its price reaches the lowest tested price in the order typed.", "Its total margin, the gross margin plus the credit revenue, reaches the hurdle.", "Its total margin, less the capital, reaches the hurdle margin."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "totalMarginPerYear is the route''s gross margin plus that; a point clears when its total margin reaches the hurdle." The capital is no term of the credit test.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does creditSensitivity decide whether a typed price clears?', options = '["Its credit revenue alone reaches the hurdle margin the study typed.", "Its price reaches the lowest tested price in the order typed.", "Its total margin, the gross margin plus the credit revenue, reaches the hurdle.", "Its total margin, less the capital, reaches the hurdle margin."]'::jsonb, explanation = 'The course states: "totalMarginPerYear is the route''s gross margin plus that; a point clears when its total margin reaches the hurdle." The capital is no term of the credit test.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 32
  select case
           when prompt = 'creditSensitivity is run on a route with its price missing, so it has no margin. What does it answer?' and options = '["REFUSED: The hurdle margin is not a number.", "A breakeven worked on a margin of zero, with the price named in assumedZero.", "No verdict and a null breakeven; it reports that no hurdle margin was given.", "No verdict and a null breakeven; it asks the study to supply its price and costs."]'::jsonb and answer_index = 3 and explanation is not distinct from 'With the price missing there is no margin. The digest prints the answer as having no verdict, a null breakevenCreditPrice and a request to supply the price and costs. A hurdle typed as ''x'' is the refused probe.' then 'old'
           when prompt = 'creditSensitivity is run on a route with its price missing, so it has no margin. What does it answer?' and options = '["REFUSED: The hurdle margin is not a number.", "A breakeven worked on a margin of zero, with the price named in assumedZero.", "No verdict and a null breakeven; it reports that no hurdle margin was given.", "No verdict and a null breakeven; it asks the study to supply its price and costs."]'::jsonb and answer_index = 3 and explanation is not distinct from 'With the price missing there is no margin. The course prints the answer as having no verdict, a null breakevenCreditPrice and a request to supply the price and costs. A hurdle typed as ''x'' is the refused probe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 32'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'creditSensitivity is run on a route with its price missing, so it has no margin. What does it answer?', options = '["REFUSED: The hurdle margin is not a number.", "A breakeven worked on a margin of zero, with the price named in assumedZero.", "No verdict and a null breakeven; it reports that no hurdle margin was given.", "No verdict and a null breakeven; it asks the study to supply its price and costs."]'::jsonb, explanation = 'With the price missing there is no margin. The course prints the answer as having no verdict, a null breakevenCreditPrice and a request to supply the price and costs. A hurdle typed as ''x'' is the refused probe.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 34
  select case
           when prompt = 'What happens to the failing mini LNG route when compareRoutes lays out the bid?' and options = '["It drops the row and names the route in screenedOut.", "It keeps its row and names it in notFullyScreened.", "It keeps its row, verdict fails, and names it in screenedOut.", "It keeps its row and ranks it best on its capital."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "A route that fails screening stays in the table with its failure named." Mini LNG keeps capital 42870938.50 and value per Mscf 4.2447 beside its verdict, and screenedOut reads Mini LNG. notFullyScreened names gas to power.' then 'old'
           when prompt = 'What happens to the failing mini LNG route when compareRoutes lays out the bid?' and options = '["It drops the row and names the route in screenedOut.", "It keeps its row and names it in notFullyScreened.", "It keeps its row, verdict fails, and names it in screenedOut.", "It keeps its row and ranks it best on its capital."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "A route that fails screening stays in the table with its failure named." Mini LNG keeps capital 42870938.50 and value per Mscf 4.2447 beside its verdict, and screenedOut reads Mini LNG. notFullyScreened names gas to power.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What happens to the failing mini LNG route when compareRoutes lays out the bid?', options = '["It drops the row and names the route in screenedOut.", "It keeps its row and names it in notFullyScreened.", "It keeps its row, verdict fails, and names it in screenedOut.", "It keeps its row and ranks it best on its capital."]'::jsonb, explanation = 'The course states: "A route that fails screening stays in the table with its failure named." Mini LNG keeps capital 42870938.50 and value per Mscf 4.2447 beside its verdict, and screenedOut reads Mini LNG. notFullyScreened names gas to power.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 37
  select case
           when prompt = 'Where do the credit prices creditSensitivity tests come from?' and options = '["The engine''s table of market credit prices.", "The case types them; the engine ships none.", "The engine''s default list, 40, 8, 20 and 12.", "The hurdle margin over the net abatement."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "Credit prices are case inputs; the engine ships none." 40, 8, 20 and 12 are the prices the EGBEMA case typed. The hurdle minus the margin over the net tonnes is the breakeven.' then 'old'
           when prompt = 'Where do the credit prices creditSensitivity tests come from?' and options = '["The engine''s table of market credit prices.", "The case types them; the engine ships none.", "The engine''s default list, 40, 8, 20 and 12.", "The hurdle margin over the net abatement."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "Credit prices are case inputs; the engine ships none." 40, 8, 20 and 12 are the prices the EGBEMA case typed. The hurdle minus the margin over the net tonnes is the breakeven.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where do the credit prices creditSensitivity tests come from?', options = '["The engine''s table of market credit prices.", "The case types them; the engine ships none.", "The engine''s default list, 40, 8, 20 and 12.", "The hurdle margin over the net abatement."]'::jsonb, explanation = 'The course states: "Credit prices are case inputs; the engine ships none." 40, 8, 20 and 12 are the prices the EGBEMA case typed. The hurdle minus the margin over the net tonnes is the breakeven.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 1
  select case
           when prompt = 'How does ROUTE_TEMPLATES ship the limit on each of its route requirements?' and options = '["Set to each licensor''s published figure.", "Set to the EGBEMA study''s limits, which the studio opens with.", "Unset (null): the envelope is the study''s to fill.", "Set on physical law for volume, and left null on composition."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints ROUTE_TEMPLATES with a limit column that reads null on every requirement: "Every limit ships unset (null): the envelope is the study''s to fill." The studio opens with every limit unset, and every route then reads not fully screened.' then 'old'
           when prompt = 'How does ROUTE_TEMPLATES ship the limit on each of its route requirements?' and options = '["Set to each licensor''s published figure.", "Set to the EGBEMA study''s limits, which the studio opens with.", "Unset (null): the envelope is the study''s to fill.", "Set on physical law for volume, and left null on composition."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints ROUTE_TEMPLATES with a limit column that reads null on every requirement: "Every limit ships unset (null): the envelope is the study''s to fill." The studio opens with every limit unset, and every route then reads not fully screened.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does ROUTE_TEMPLATES ship the limit on each of its route requirements?', options = '["Set to each licensor''s published figure.", "Set to the EGBEMA study''s limits, which the studio opens with.", "Unset (null): the envelope is the study''s to fill.", "Set on physical law for volume, and left null on composition."]'::jsonb, explanation = 'The course prints ROUTE_TEMPLATES with a limit column that reads null on every requirement: "Every limit ships unset (null): the envelope is the study''s to fill." The studio opens with every limit unset, and every route then reads not fully screened.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 3
  select case
           when prompt = 'A template note reads: "CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor''s." Which route and requirement carry it?' and options = '["CNG, on Minimum heating value.", "Gas to power, on Maximum inerts.", "LPG and condensate extraction, on Minimum liquids content.", "Mini LNG, on Maximum CO2 before treatment."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest lists the notes the templates carry on two requirements, and this one sits on Mini LNG, Maximum CO2 before treatment. The LPG route''s Minimum liquids content carries the other note, about the liquids paying for the plant. Neither note gives a number.' then 'old'
           when prompt = 'A template note reads: "CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor''s." Which route and requirement carry it?' and options = '["CNG, on Minimum heating value.", "Gas to power, on Maximum inerts.", "LPG and condensate extraction, on Minimum liquids content.", "Mini LNG, on Maximum CO2 before treatment."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course lists the notes the templates carry on two requirements, and this one sits on Mini LNG, Maximum CO2 before treatment. The LPG route''s Minimum liquids content carries the other note, about the liquids paying for the plant. Neither note gives a number.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A template note reads: "CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor''s." Which route and requirement carry it?', options = '["CNG, on Minimum heating value.", "Gas to power, on Maximum inerts.", "LPG and condensate extraction, on Minimum liquids content.", "Mini LNG, on Maximum CO2 before treatment."]'::jsonb, explanation = 'The course lists the notes the templates carry on two requirements, and this one sits on Mini LNG, Maximum CO2 before treatment. The LPG route''s Minimum liquids content carries the other note, about the liquids paying for the plant. Neither note gives a number.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 4
  select case
           when prompt = 'Which requirement carries the template note "Below this the liquids do not pay for the plant, whatever the gas is worth."?' and options = '["Minimum volume, in MMscfd, on the LPG and condensate route.", "Minimum liquids content, in gal/Mscf of C3+, on the LPG route.", "Maximum CO2 before treatment, a mole fraction, on mini LNG.", "Minimum heating value, in Btu/scf, on gas to power or gas to wire."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints the note on LPG and condensate extraction, Minimum liquids content, whose unit in the template is gal/Mscf of C3+. The mini LNG CO2 requirement carries the other note, and the Minimum volume and heating value rows carry none.' then 'old'
           when prompt = 'Which requirement carries the template note "Below this the liquids do not pay for the plant, whatever the gas is worth."?' and options = '["Minimum volume, in MMscfd, on the LPG and condensate route.", "Minimum liquids content, in gal/Mscf of C3+, on the LPG route.", "Maximum CO2 before treatment, a mole fraction, on mini LNG.", "Minimum heating value, in Btu/scf, on gas to power or gas to wire."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the note on LPG and condensate extraction, Minimum liquids content, whose unit in the template is gal/Mscf of C3+. The mini LNG CO2 requirement carries the other note, and the Minimum volume and heating value rows carry none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which requirement carries the template note "Below this the liquids do not pay for the plant, whatever the gas is worth."?', options = '["Minimum volume, in MMscfd, on the LPG and condensate route.", "Minimum liquids content, in gal/Mscf of C3+, on the LPG route.", "Maximum CO2 before treatment, a mole fraction, on mini LNG.", "Minimum heating value, in Btu/scf, on gas to power or gas to wire."]'::jsonb, explanation = 'The course prints the note on LPG and condensate extraction, Minimum liquids content, whose unit in the template is gal/Mscf of C3+. The mini LNG CO2 requirement carries the other note, and the Minimum volume and heating value rows carry none.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 5
  select case
           when prompt = 'screenRoute forms a margin on every checked requirement. How is it formed on a MAXIMUM requirement?' and options = '["The actual minus the limit; a negative margin is a failure.", "The limit minus the actual; a negative margin is a failure.", "The limit minus the actual; a positive margin is a failure.", "The actual over the limit; a ratio above one is a failure."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "The margin column is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum; a negative margin is a failure, and the shortfall is its size." The CNG inerts, 0.0460 against a limit of 0.06, print a margin of 0.0140 and a pass.' then 'old'
           when prompt = 'screenRoute forms a margin on every checked requirement. How is it formed on a MAXIMUM requirement?' and options = '["The actual minus the limit; a negative margin is a failure.", "The limit minus the actual; a negative margin is a failure.", "The limit minus the actual; a positive margin is a failure.", "The actual over the limit; a ratio above one is a failure."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "The margin column is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum; a negative margin is a failure, and the shortfall is its size." The CNG inerts, 0.0460 against a limit of 0.06, print a margin of 0.0140 and a pass.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'screenRoute forms a margin on every checked requirement. How is it formed on a MAXIMUM requirement?', options = '["The actual minus the limit; a negative margin is a failure.", "The limit minus the actual; a negative margin is a failure.", "The limit minus the actual; a positive margin is a failure.", "The actual over the limit; a ratio above one is a failure."]'::jsonb, explanation = 'The course states: "The margin column is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum; a negative margin is a failure, and the shortfall is its size." The CNG inerts, 0.0460 against a limit of 0.06, print a margin of 0.0140 and a pass.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 8
  select case
           when prompt = 'On gas to power, the study typed minVolumeMMscfd 3 and minGhvBtuScf 950 and nothing else. What does the check table print on that route''s Maximum inerts row?' and options = '["Actual 0.0460, limit 0.06, status pass, margin 0.0140.", "Actual 0.0280, limit unset, status fail, margin -0.0080.", "Actual 0.0460, limit unset, status unchecked, margin none.", "Actual 0.0460, limit unset, status pass, margin none."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints the gas to power Maximum inerts row as 0.0460, unset, unchecked, none: "A requirement with no limit is reported unchecked; an unset limit is not a satisfied one." The 0.06 limit with a 0.0140 margin is the CNG and mini LNG inerts row, where a limit was typed.' then 'old'
           when prompt = 'On gas to power, the study typed minVolumeMMscfd 3 and minGhvBtuScf 950 and nothing else. What does the check table print on that route''s Maximum inerts row?' and options = '["Actual 0.0460, limit 0.06, status pass, margin 0.0140.", "Actual 0.0280, limit unset, status fail, margin -0.0080.", "Actual 0.0460, limit unset, status unchecked, margin none.", "Actual 0.0460, limit unset, status pass, margin none."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the gas to power Maximum inerts row as 0.0460, unset, unchecked, none: "A requirement with no limit is reported unchecked; an unset limit is not a satisfied one." The 0.06 limit with a 0.0140 margin is the CNG and mini LNG inerts row, where a limit was typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On gas to power, the study typed minVolumeMMscfd 3 and minGhvBtuScf 950 and nothing else. What does the check table print on that route''s Maximum inerts row?', options = '["Actual 0.0460, limit 0.06, status pass, margin 0.0140.", "Actual 0.0280, limit unset, status fail, margin -0.0080.", "Actual 0.0460, limit unset, status unchecked, margin none.", "Actual 0.0460, limit unset, status pass, margin none."]'::jsonb, explanation = 'The course prints the gas to power Maximum inerts row as 0.0460, unset, unchecked, none: "A requirement with no limit is reported unchecked; an unset limit is not a satisfied one." The 0.06 limit with a 0.0140 margin is the CNG and mini LNG inerts row, where a limit was typed.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 11
  select case
           when prompt = 'How does mini LNG''s failures field print the volume requirement it breaks?' and options = '["7.5000 against a limit of 5, short by 2.5000 MMscfd", "10 against 7.5000, a shortfall of 4.5000 MMscfd", "7.5000 against 10, short by 2.5000 MMscfd", "7.5000 against 10, short by 0.0080 mole fraction"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest''s failures entry: "Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd". The limit of 5 is the CNG and LPG volume limit, where 7.5000 passes, 4.5000 is the gas to power volume margin, and 0.0080 mole fraction is the shortfall on the CO2 requirement.' then 'old'
           when prompt = 'How does mini LNG''s failures field print the volume requirement it breaks?' and options = '["7.5000 against a limit of 5, short by 2.5000 MMscfd", "10 against 7.5000, a shortfall of 4.5000 MMscfd", "7.5000 against 10, short by 2.5000 MMscfd", "7.5000 against 10, short by 0.0080 mole fraction"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s failures entry: "Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd". The limit of 5 is the CNG and LPG volume limit, where 7.5000 passes, 4.5000 is the gas to power volume margin, and 0.0080 mole fraction is the shortfall on the CO2 requirement.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does mini LNG''s failures field print the volume requirement it breaks?', options = '["7.5000 against a limit of 5, short by 2.5000 MMscfd", "10 against 7.5000, a shortfall of 4.5000 MMscfd", "7.5000 against 10, short by 2.5000 MMscfd", "7.5000 against 10, short by 0.0080 mole fraction"]'::jsonb, explanation = 'The course''s failures entry: "Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd". The limit of 5 is the CNG and LPG volume limit, where 7.5000 passes, 4.5000 is the gas to power volume margin, and 0.0080 mole fraction is the shortfall on the CO2 requirement.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 13
  select case
           when prompt = 'The Flare Gas to Value Studio opens with every requirement limit unset. Which verdicts does screenRoute give the four EGBEMA routes?' and options = '["not fully screened, on every one of the four", "passes, on all four, as nothing is breached", "fails, on all four, as no requirement is met", "passes on three, with mini LNG left failing"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints the same four routes with every limit unset, as the studio opens: Compressed natural gas, Mini LNG, LPG and condensate extraction, and Gas to power or gas to wire all read not fully screened. An unset limit is not a satisfied one.' then 'old'
           when prompt = 'The Flare Gas to Value Studio opens with every requirement limit unset. Which verdicts does screenRoute give the four EGBEMA routes?' and options = '["not fully screened, on every one of the four", "passes, on all four, as nothing is breached", "fails, on all four, as no requirement is met", "passes on three, with mini LNG left failing"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the same four routes with every limit unset, as the studio opens: Compressed natural gas, Mini LNG, LPG and condensate extraction, and Gas to power or gas to wire all read not fully screened. An unset limit is not a satisfied one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Flare Gas to Value Studio opens with every requirement limit unset. Which verdicts does screenRoute give the four EGBEMA routes?', options = '["not fully screened, on every one of the four", "passes, on all four, as nothing is breached", "fails, on all four, as no requirement is met", "passes on three, with mini LNG left failing"]'::jsonb, explanation = 'The course prints the same four routes with every limit unset, as the studio opens: Compressed natural gas, Mini LNG, LPG and condensate extraction, and Gas to power or gas to wire all read not fully screened. An unset limit is not a satisfied one.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 14
  select case
           when prompt = 'screenRoute is asked to screen a gas the analysis refused. What does it answer?' and options = '["Every requirement reads unchecked, and each route reads not fully screened.", "Every requirement reads fail, and mini LNG is listed in screenedOut.", "The routes are screened on the gas as typed, with each status printed.", "It refuses: a characterised gas is required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest''s probe table for screenRoute: a gas the analysis refused gives "REFUSED: A characterised gas is required." No check table and no verdict are printed for it.' then 'old'
           when prompt = 'screenRoute is asked to screen a gas the analysis refused. What does it answer?' and options = '["Every requirement reads unchecked, and each route reads not fully screened.", "Every requirement reads fail, and mini LNG is listed in screenedOut.", "The routes are screened on the gas as typed, with each status printed.", "It refuses: a characterised gas is required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s probe table for screenRoute: a gas the analysis refused gives "REFUSED: A characterised gas is required." No check table and no verdict are printed for it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'screenRoute is asked to screen a gas the analysis refused. What does it answer?', options = '["Every requirement reads unchecked, and each route reads not fully screened.", "Every requirement reads fail, and mini LNG is listed in screenedOut.", "The routes are screened on the gas as typed, with each status printed.", "It refuses: a characterised gas is required."]'::jsonb, explanation = 'The course''s probe table for screenRoute: a gas the analysis refused gives "REFUSED: A characterised gas is required." No check table and no verdict are printed for it.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-four-routes-and-their-envelopes ord 15
  select case
           when prompt = 'Beside the notes two of its requirements carry, the engine prints one note on ROUTE_TEMPLATES as a whole. Which sentence opens that note?' and options = '["\"The limit is the licensor''s.\" on every row of the table.", "\"Below this the liquids do not pay for the plant.\"", "\"Requirement limits are yours to set.\"", "\"An unset limit is a pass.\""]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine''s note on the templates opens "Requirement limits are yours to set." The licensor sentence is the note on mini LNG''s CO2 requirement alone, the liquids sentence is the note on the LPG route''s liquids content, and the digest reports a requirement with no limit unchecked.' then 'old'
           when prompt = 'Beside the notes two of its requirements carry, the engine prints one note on ROUTE_TEMPLATES as a whole. Which sentence opens that note?' and options = '["\"The limit is the licensor''s.\" on every row of the table.", "\"Below this the liquids do not pay for the plant.\"", "\"Requirement limits are yours to set.\"", "\"An unset limit is a pass.\""]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine''s note on the templates opens "Requirement limits are yours to set." The licensor sentence is the note on mini LNG''s CO2 requirement alone, the liquids sentence is the note on the LPG route''s liquids content, and the course reports a requirement with no limit unchecked.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m01-four-routes-and-their-envelopes ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside the notes two of its requirements carry, the engine prints one note on ROUTE_TEMPLATES as a whole. Which sentence opens that note?', options = '["\"The limit is the licensor''s.\" on every row of the table.", "\"Below this the liquids do not pay for the plant.\"", "\"Requirement limits are yours to set.\"", "\"An unset limit is a pass.\""]'::jsonb, explanation = 'The engine''s note on the templates opens "Requirement limits are yours to set." The licensor sentence is the note on mini LNG''s CO2 requirement alone, the liquids sentence is the note on the LPG route''s liquids content, and the course reports a requirement with no limit unchecked.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-four-routes-and-their-envelopes' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m01-four-routes-and-their-envelopes ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 3
  select case
           when prompt = 'How does yieldCeiling turn a heating value into the gas to power ceiling?' and options = '["The heating value times a thousand over BTU_PER_MWH.", "The heating value over BTU_PER_MWH, with no thousand.", "The heating value times BTU_PER_MWH over a thousand.", "The gas mass times the heating value over BTU_PER_MWH."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest states the gas to power ceiling as the heating value in MWh: "the heating value times a thousand over BTU_PER_MWH". The heating value is per standard cubic foot and the yield is per Mscf, and BTU_PER_MWH is 3412141.6331.' then 'old'
           when prompt = 'How does yieldCeiling turn a heating value into the gas to power ceiling?' and options = '["The heating value times a thousand over BTU_PER_MWH.", "The heating value over BTU_PER_MWH, with no thousand.", "The heating value times BTU_PER_MWH over a thousand.", "The gas mass times the heating value over BTU_PER_MWH."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states the gas to power ceiling as the heating value in MWh: "the heating value times a thousand over BTU_PER_MWH". The heating value is per standard cubic foot and the yield is per Mscf, and BTU_PER_MWH is 3412141.6331.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does yieldCeiling turn a heating value into the gas to power ceiling?', options = '["The heating value times a thousand over BTU_PER_MWH.", "The heating value over BTU_PER_MWH, with no thousand.", "The heating value times BTU_PER_MWH over a thousand.", "The gas mass times the heating value over BTU_PER_MWH."]'::jsonb, explanation = 'The course states the gas to power ceiling as the heating value in MWh: "the heating value times a thousand over BTU_PER_MWH". The heating value is per standard cubic foot and the yield is per Mscf, and BTU_PER_MWH is 3412141.6331.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 6
  select case
           when prompt = 'The studio''s LPG route on its opening gas is typed at 0.0045 t/Mscf. What is printed for that yield?' and options = '["Refused, above the ceiling of 0.0056 t/Mscf it would need.", "Within a ceiling of 0.0067 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0056 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0255 t/Mscf; typed over ceiling 0.8062."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "The studio''s LPG route on its opening gas at 0.0045 t/Mscf is within its ceiling of 0.0056 t/Mscf, and the typed yield over the ceiling is 0.8062." 0.0067 is EGBEMA''s LPG ceiling and 0.0255 the studio gas''s mini LNG ceiling.' then 'old'
           when prompt = 'The studio''s LPG route on its opening gas is typed at 0.0045 t/Mscf. What is printed for that yield?' and options = '["Refused, above the ceiling of 0.0056 t/Mscf it would need.", "Within a ceiling of 0.0067 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0056 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0255 t/Mscf; typed over ceiling 0.8062."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "The studio''s LPG route on its opening gas at 0.0045 t/Mscf is within its ceiling of 0.0056 t/Mscf, and the typed yield over the ceiling is 0.8062." 0.0067 is EGBEMA''s LPG ceiling and 0.0255 the studio gas''s mini LNG ceiling.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio''s LPG route on its opening gas is typed at 0.0045 t/Mscf. What is printed for that yield?', options = '["Refused, above the ceiling of 0.0056 t/Mscf it would need.", "Within a ceiling of 0.0067 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0056 t/Mscf; typed over ceiling 0.8062.", "Within a ceiling of 0.0255 t/Mscf; typed over ceiling 0.8062."]'::jsonb, explanation = 'The course states: "The studio''s LPG route on its opening gas at 0.0045 t/Mscf is within its ceiling of 0.0056 t/Mscf, and the typed yield over the ceiling is 0.8062." 0.0067 is EGBEMA''s LPG ceiling and 0.0255 the studio gas''s mini LNG ceiling.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 8
  select case
           when prompt = 'EGBEMA''s CNG yield is typed at 30 kg/Mscf. What does the engine answer?' and options = '["A year on 30 kg, flagged as above the ceiling of 26.7066 kg.", "REFUSED: more than the 26.706618 kg the gas holds (gas mass).", "A year on 26.7066 kg, the yield cut back to the ceiling.", "REFUSED: more than the 6.6647 kg the gas holds (propane and heavier)."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints: REFUSED: Route "Compressed natural gas" yields 30 kg per Mscf, more than the 26.706618 kg the gas holds (gas mass). A yield above what the gas contains is refused. No year is printed at 30 kg or at the ceiling.' then 'old'
           when prompt = 'EGBEMA''s CNG yield is typed at 30 kg/Mscf. What does the engine answer?' and options = '["A year on 30 kg, flagged as above the ceiling of 26.7066 kg.", "REFUSED: more than the 26.706618 kg the gas holds (gas mass).", "A year on 26.7066 kg, the yield cut back to the ceiling.", "REFUSED: more than the 6.6647 kg the gas holds (propane and heavier)."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints: REFUSED: Route "Compressed natural gas" yields 30 kg per Mscf, more than the 26.706618 kg the gas holds (gas mass). A yield above what the gas contains is refused. No year is printed at 30 kg or at the ceiling.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA''s CNG yield is typed at 30 kg/Mscf. What does the engine answer?', options = '["A year on 30 kg, flagged as above the ceiling of 26.7066 kg.", "REFUSED: more than the 26.706618 kg the gas holds (gas mass).", "A year on 26.7066 kg, the yield cut back to the ceiling.", "REFUSED: more than the 6.6647 kg the gas holds (propane and heavier)."]'::jsonb, explanation = 'The course prints: REFUSED: Route "Compressed natural gas" yields 30 kg per Mscf, more than the 26.706618 kg the gas holds (gas mass). A yield above what the gas contains is refused. No year is printed at 30 kg or at the ceiling.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 9
  select case
           when prompt = 'EGBEMA''s gas to power yield is typed at 0 MWh/Mscf, below its ceiling of 0.3659. What does the engine answer?' and options = '["A year with productPerYear of zero and a margin below zero.", "It takes the ceiling of 0.3659 MWh as the yield.", "It takes a zero yield and names it in assumedZero.", "REFUSED: the route needs a positive product yield per Mscf."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: EGBEMA, gas to power at 0 MWh/Mscf gives REFUSED: Route "Gas to power or gas to wire" needs a positive product yield per Mscf. A yield above the ceiling is refused, and a yield of zero is refused.' then 'old'
           when prompt = 'EGBEMA''s gas to power yield is typed at 0 MWh/Mscf, below its ceiling of 0.3659. What does the engine answer?' and options = '["A year with productPerYear of zero and a margin below zero.", "It takes the ceiling of 0.3659 MWh as the yield.", "It takes a zero yield and names it in assumedZero.", "REFUSED: the route needs a positive product yield per Mscf."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: EGBEMA, gas to power at 0 MWh/Mscf gives REFUSED: Route "Gas to power or gas to wire" needs a positive product yield per Mscf. A yield above the ceiling is refused, and a yield of zero is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA''s gas to power yield is typed at 0 MWh/Mscf, below its ceiling of 0.3659. What does the engine answer?', options = '["A year with productPerYear of zero and a margin below zero.", "It takes the ceiling of 0.3659 MWh as the yield.", "It takes a zero yield and names it in assumedZero.", "REFUSED: the route needs a positive product yield per Mscf."]'::jsonb, explanation = 'The course states: EGBEMA, gas to power at 0 MWh/Mscf gives REFUSED: Route "Gas to power or gas to wire" needs a positive product yield per Mscf. A yield above the ceiling is refused, and a yield of zero is refused.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 11
  select case
           when prompt = 'EGBEMA''s gas to power ceiling is 0.3659 MWh per Mscf. Which EGBEMA heating value is that ceiling built on?' and options = '["1537.2878 Btu/scf, the heating values weighted by mass", "1248.4110 Btu/scf, the engine''s heating value on moles", "1308.6069 Btu/scf, the hydrocarbons alone scaled to one", "1035.6050 Btu/scf, the ghvBtuScf of the lean OGUTA gas"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The ceiling is the heating value times a thousand over BTU_PER_MWH, and EGBEMA''s heating value is ghvBtuScf 1248.4110, blended on moles. The digest prints 1537.2878 and 1308.6069 as two shortcuts beside the engine''s figure, and 1035.6050 is OGUTA''s.' then 'old'
           when prompt = 'EGBEMA''s gas to power ceiling is 0.3659 MWh per Mscf. Which EGBEMA heating value is that ceiling built on?' and options = '["1537.2878 Btu/scf, the heating values weighted by mass", "1248.4110 Btu/scf, the engine''s heating value on moles", "1308.6069 Btu/scf, the hydrocarbons alone scaled to one", "1035.6050 Btu/scf, the ghvBtuScf of the lean OGUTA gas"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The ceiling is the heating value times a thousand over BTU_PER_MWH, and EGBEMA''s heating value is ghvBtuScf 1248.4110, blended on moles. The course prints 1537.2878 and 1308.6069 as two shortcuts beside the engine''s figure, and 1035.6050 is OGUTA''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'EGBEMA''s gas to power ceiling is 0.3659 MWh per Mscf. Which EGBEMA heating value is that ceiling built on?', options = '["1537.2878 Btu/scf, the heating values weighted by mass", "1248.4110 Btu/scf, the engine''s heating value on moles", "1308.6069 Btu/scf, the hydrocarbons alone scaled to one", "1035.6050 Btu/scf, the ghvBtuScf of the lean OGUTA gas"]'::jsonb, explanation = 'The ceiling is the heating value times a thousand over BTU_PER_MWH, and EGBEMA''s heating value is ghvBtuScf 1248.4110, blended on moles. The course prints 1537.2878 and 1308.6069 as two shortcuts beside the engine''s figure, and 1035.6050 is OGUTA''s.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-what-the-gas-can-yield ord 13
  select case
           when prompt = 'Where do the EGBEMA yields the study typed sit against their ceilings?' and options = '["Every one sits at or below its ceiling.", "The LPG yield of 0.0052 t sits above the 0.0010 t ceiling.", "The CNG yield of 18.5 kg sits above the 0.3659 ceiling.", "The mini LNG yield of 0.0175 t sits above its 0.0056 t."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "Every EGBEMA yield typed sits at or below its ceiling." 0.0010 is OGUTA''s LPG ceiling, 0.3659 is EGBEMA''s gas to power ceiling in MWh, and 0.0056 is the studio gas''s LPG ceiling. EGBEMA''s own ceilings are 26.7066, 0.0267, 0.0067 and 0.3659.' then 'old'
           when prompt = 'Where do the EGBEMA yields the study typed sit against their ceilings?' and options = '["Every one sits at or below its ceiling.", "The LPG yield of 0.0052 t sits above the 0.0010 t ceiling.", "The CNG yield of 18.5 kg sits above the 0.3659 ceiling.", "The mini LNG yield of 0.0175 t sits above its 0.0056 t."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "Every EGBEMA yield typed sits at or below its ceiling." 0.0010 is OGUTA''s LPG ceiling, 0.3659 is EGBEMA''s gas to power ceiling in MWh, and 0.0056 is the studio gas''s LPG ceiling. EGBEMA''s own ceilings are 26.7066, 0.0267, 0.0067 and 0.3659.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m02-what-the-gas-can-yield ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where do the EGBEMA yields the study typed sit against their ceilings?', options = '["Every one sits at or below its ceiling.", "The LPG yield of 0.0052 t sits above the 0.0010 t ceiling.", "The CNG yield of 18.5 kg sits above the 0.3659 ceiling.", "The mini LNG yield of 0.0175 t sits above its 0.0056 t."]'::jsonb, explanation = 'The course states: "Every EGBEMA yield typed sits at or below its ceiling." 0.0010 is OGUTA''s LPG ceiling, 0.3659 is EGBEMA''s gas to power ceiling in MWh, and 0.0056 is the studio gas''s LPG ceiling. EGBEMA''s own ceilings are 26.7066, 0.0267, 0.0067 and 0.3659.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-what-the-gas-can-yield' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m02-what-the-gas-can-yield ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 2
  select case
           when prompt = 'A routeEconomics call on the CNG route carries no on-stream days field at all. Which days and Mscf a year does it use?' and options = '["REFUSED: On-stream days are required, more than 0 and no more than 366.", "It takes onstreamDays 350: mscfPerYear 2625000.0000.", "It takes onstreamDays 355: mscfPerYear 2662500.0000.", "It takes the days as zero and names them in assumedZero."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "On-stream days OMITTED from routeEconomics take the stated default: onstreamDays 350, mscfPerYear 2625000.0000 on the CNG route." The refusal is what a days box typed blank gets, and 355 is the figure the EGBEMA study typed.' then 'old'
           when prompt = 'A routeEconomics call on the CNG route carries no on-stream days field at all. Which days and Mscf a year does it use?' and options = '["REFUSED: On-stream days are required, more than 0 and no more than 366.", "It takes onstreamDays 350: mscfPerYear 2625000.0000.", "It takes onstreamDays 355: mscfPerYear 2662500.0000.", "It takes the days as zero and names them in assumedZero."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "On-stream days OMITTED from routeEconomics take the stated default: onstreamDays 350, mscfPerYear 2625000.0000 on the CNG route." The refusal is what a days box typed blank gets, and 355 is the figure the EGBEMA study typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A routeEconomics call on the CNG route carries no on-stream days field at all. Which days and Mscf a year does it use?', options = '["REFUSED: On-stream days are required, more than 0 and no more than 366.", "It takes onstreamDays 350: mscfPerYear 2625000.0000.", "It takes onstreamDays 355: mscfPerYear 2662500.0000.", "It takes the days as zero and names them in assumedZero."]'::jsonb, explanation = 'The course states: "On-stream days OMITTED from routeEconomics take the stated default: onstreamDays 350, mscfPerYear 2625000.0000 on the CNG route." The refusal is what a days box typed blank gets, and 355 is the figure the EGBEMA study typed.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 4
  select case
           when prompt = 'How does routeEconomics form productPerYear?' and options = '["mscfPerYear times the yield ceiling times the recovery", "mscfPerYear times the yield, with no recovery in it", "mscfPerYear times the yield times the recovery", "mscfPerYear times the yield times the price"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "productPerYear is that times the yield times the recovery", where that is mscfPerYear. On CNG, 2662500.0000 Mscf, 18.5 kg and 0.88 give 43345500.0000 kg of CNG. Revenue is product times price, and the yield ceiling is no term of the rule.' then 'old'
           when prompt = 'How does routeEconomics form productPerYear?' and options = '["mscfPerYear times the yield ceiling times the recovery", "mscfPerYear times the yield, with no recovery in it", "mscfPerYear times the yield times the recovery", "mscfPerYear times the yield times the price"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "productPerYear is that times the yield times the recovery", where that is mscfPerYear. On CNG, 2662500.0000 Mscf, 18.5 kg and 0.88 give 43345500.0000 kg of CNG. Revenue is product times price, and the yield ceiling is no term of the rule.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does routeEconomics form productPerYear?', options = '["mscfPerYear times the yield ceiling times the recovery", "mscfPerYear times the yield, with no recovery in it", "mscfPerYear times the yield times the recovery", "mscfPerYear times the yield times the price"]'::jsonb, explanation = 'The course states: "productPerYear is that times the yield times the recovery", where that is mscfPerYear. On CNG, 2662500.0000 Mscf, 18.5 kg and 0.88 give 43345500.0000 kg of CNG. Revenue is product times price, and the yield ceiling is no term of the rule.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 5
  select case
           when prompt = 'A study clears the recovery box on the CNG route and runs the year. What happens?' and options = '["It takes the recovery as 1 and names it in assumedZero.", "It takes the recovery as zero and prints a product of none.", "It refuses: the route needs a recovery fraction in (0, 1].", "It takes the stated default recovery and prints a full year."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints "CNG recovery left blank ('''')" with REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. The recoveries 0 and 1.2 draw the same refusal.' then 'old'
           when prompt = 'A study clears the recovery box on the CNG route and runs the year. What happens?' and options = '["It takes the recovery as 1 and names it in assumedZero.", "It takes the recovery as zero and prints a product of none.", "It refuses: the route needs a recovery fraction in (0, 1].", "It takes the stated default recovery and prints a full year."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints "CNG recovery left blank ('''')" with REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. The recoveries 0 and 1.2 draw the same refusal.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A study clears the recovery box on the CNG route and runs the year. What happens?', options = '["It takes the recovery as 1 and names it in assumedZero.", "It takes the recovery as zero and prints a product of none.", "It refuses: the route needs a recovery fraction in (0, 1].", "It takes the stated default recovery and prints a full year."]'::jsonb, explanation = 'The course prints "CNG recovery left blank ('''')" with REFUSED: Route "Compressed natural gas" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. The recoveries 0 and 1.2 draw the same refusal.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 6
  select case
           when prompt = 'How does routeEconomics form a route''s operating cost a year?' and options = '["The fixed cost plus the variable cost per Mscf of the whole parcel.", "The fixed cost plus the variable cost per Mscf recovered.", "The fixed cost plus the variable cost per unit of product.", "The variable cost per Mscf, with the fixed in capital."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel". On CNG the fixed 1900000 and 0.35 dollars per Mscf print an operating cost of 2831875.00.' then 'old'
           when prompt = 'How does routeEconomics form a route''s operating cost a year?' and options = '["The fixed cost plus the variable cost per Mscf of the whole parcel.", "The fixed cost plus the variable cost per Mscf recovered.", "The fixed cost plus the variable cost per unit of product.", "The variable cost per Mscf, with the fixed in capital."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel". On CNG the fixed 1900000 and 0.35 dollars per Mscf print an operating cost of 2831875.00.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does routeEconomics form a route''s operating cost a year?', options = '["The fixed cost plus the variable cost per Mscf of the whole parcel.", "The fixed cost plus the variable cost per Mscf recovered.", "The fixed cost plus the variable cost per unit of product.", "The variable cost per Mscf, with the fixed in capital."]'::jsonb, explanation = 'The course states: "operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel". On CNG the fixed 1900000 and 0.35 dollars per Mscf print an operating cost of 2831875.00.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 7
  select case
           when prompt = 'Which rule gives valuePerMscf, the last figure of a route''s year?' and options = '["The margin over the Mscf the route recovers", "Revenue over mscfPerYear", "Margin over productPerYear", "The margin over mscfPerYear"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: "valuePerMscf is the margin over mscfPerYear." On CNG, a gross margin of 21008150.00 over 2662500.0000 Mscf prints 7.8904.' then 'old'
           when prompt = 'Which rule gives valuePerMscf, the last figure of a route''s year?' and options = '["The margin over the Mscf the route recovers", "Revenue over mscfPerYear", "Margin over productPerYear", "The margin over mscfPerYear"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: "valuePerMscf is the margin over mscfPerYear." On CNG, a gross margin of 21008150.00 over 2662500.0000 Mscf prints 7.8904.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which rule gives valuePerMscf, the last figure of a route''s year?', options = '["The margin over the Mscf the route recovers", "Revenue over mscfPerYear", "Margin over productPerYear", "The margin over mscfPerYear"]'::jsonb, explanation = 'The course states: "valuePerMscf is the margin over mscfPerYear." On CNG, a gross margin of 21008150.00 over 2662500.0000 Mscf prints 7.8904.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 8
  select case
           when prompt = 'The CNG route''s variable cost box is left blank (''''). Which row does routeEconomics print?' and options = '["operating cost 931875.00, valuePerMscf 8.6040, assumedZero variable operating cost", "operating cost 1900000.00, valuePerMscf 8.2404, assumedZero variable operating cost", "operating cost 2831875.00, valuePerMscf 7.8904, assumedZero none", "REFUSED: the variable operating cost is required"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s blank cost table: variable cost left blank ('''') gives 1900000.00, 8.2404 and variable operating cost. A cost box left blank is taken as zero and named in assumedZero. 931875.00 and 8.6040 belong to the fixed cost left blank, and 2831875.00 and 7.8904 to both costs typed.' then 'old'
           when prompt = 'The CNG route''s variable cost box is left blank (''''). Which row does routeEconomics print?' and options = '["operating cost 931875.00, valuePerMscf 8.6040, assumedZero variable operating cost", "operating cost 1900000.00, valuePerMscf 8.2404, assumedZero variable operating cost", "operating cost 2831875.00, valuePerMscf 7.8904, assumedZero none", "REFUSED: the variable operating cost is required"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s blank cost table: variable cost left blank ('''') gives 1900000.00, 8.2404 and variable operating cost. A cost box left blank is taken as zero and named in assumedZero. 931875.00 and 8.6040 belong to the fixed cost left blank, and 2831875.00 and 7.8904 to both costs typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The CNG route''s variable cost box is left blank (''''). Which row does routeEconomics print?', options = '["operating cost 931875.00, valuePerMscf 8.6040, assumedZero variable operating cost", "operating cost 1900000.00, valuePerMscf 8.2404, assumedZero variable operating cost", "operating cost 2831875.00, valuePerMscf 7.8904, assumedZero none", "REFUSED: the variable operating cost is required"]'::jsonb, explanation = 'The course''s blank cost table: variable cost left blank ('''') gives 1900000.00, 8.2404 and variable operating cost. A cost box left blank is taken as zero and named in assumedZero. 931875.00 and 8.6040 belong to the fixed cost left blank, and 2831875.00 and 7.8904 to both costs typed.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 9
  select case
           when prompt = 'The CNG route''s fixed cost is left blank (null). What does assumedZero read, and what operating cost prints?' and options = '["fixed operating cost; 931875.00", "variable operating cost; 1900000.00", "none; 2831875.00, as both are typed", "fixed operating cost; 1900000.00"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s row for the fixed cost left blank (null) prints operatingCostPerYear 931875.00, valuePerMscf 8.6040 and assumedZero fixed operating cost. 1900000.00 is the operating cost with the variable cost blank.' then 'old'
           when prompt = 'The CNG route''s fixed cost is left blank (null). What does assumedZero read, and what operating cost prints?' and options = '["fixed operating cost; 931875.00", "variable operating cost; 1900000.00", "none; 2831875.00, as both are typed", "fixed operating cost; 1900000.00"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s row for the fixed cost left blank (null) prints operatingCostPerYear 931875.00, valuePerMscf 8.6040 and assumedZero fixed operating cost. 1900000.00 is the operating cost with the variable cost blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The CNG route''s fixed cost is left blank (null). What does assumedZero read, and what operating cost prints?', options = '["fixed operating cost; 931875.00", "variable operating cost; 1900000.00", "none; 2831875.00, as both are typed", "fixed operating cost; 1900000.00"]'::jsonb, explanation = 'The course''s row for the fixed cost left blank (null) prints operatingCostPerYear 931875.00, valuePerMscf 8.6040 and assumedZero fixed operating cost. 1900000.00 is the operating cost with the variable cost blank.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 13
  select case
           when prompt = 'A study clears the scaling exponent box on the CNG route. Which exponent and capital follow?' and options = '["STICK_BUILT: 0.6, capitalCost 27438303.12.", "No exponent: a null capital and a note.", "REFUSED: a scaling exponent is required.", "The MODULAR exponent: 0.9, capitalCost 29337983.06."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: "With the scaling exponent typed blank ('''') routeEconomics takes the MODULAR exponent: scalingExponent 0.9, capitalCost 29337983.06 on the CNG route." 27438303.12 is the six-tenths reading on the same plant.' then 'old'
           when prompt = 'A study clears the scaling exponent box on the CNG route. Which exponent and capital follow?' and options = '["STICK_BUILT: 0.6, capitalCost 27438303.12.", "No exponent: a null capital and a note.", "REFUSED: a scaling exponent is required.", "The MODULAR exponent: 0.9, capitalCost 29337983.06."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: "With the scaling exponent typed blank ('''') routeEconomics takes the MODULAR exponent: scalingExponent 0.9, capitalCost 29337983.06 on the CNG route." 27438303.12 is the six-tenths reading on the same plant.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A study clears the scaling exponent box on the CNG route. Which exponent and capital follow?', options = '["STICK_BUILT: 0.6, capitalCost 27438303.12.", "No exponent: a null capital and a note.", "REFUSED: a scaling exponent is required.", "The MODULAR exponent: 0.9, capitalCost 29337983.06."]'::jsonb, explanation = 'The course states: "With the scaling exponent typed blank ('''') routeEconomics takes the MODULAR exponent: scalingExponent 0.9, capitalCost 29337983.06 on the CNG route." 27438303.12 is the six-tenths reading on the same plant.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-a-routes-year ord 14
  select case
           when prompt = 'A route''s reference plant cost is left blank. What does routeEconomics give for capital?' and options = '["Capital null, with the note \"No capital cost: a reference plant cost and capacity are required to scale from.\"", "Capital zero, named in assumedZero beside the operating costs.", "REFUSED: a reference plant cost is required to scale from.", "Capital scaled from the MODULAR default plant for the route."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "With the reference cost left blank the capital is null and the note reads: No capital cost: a reference plant cost and capacity are required to scale from." A blank cost box is the one taken as zero in assumedZero, and no default plant is printed.' then 'old'
           when prompt = 'A route''s reference plant cost is left blank. What does routeEconomics give for capital?' and options = '["Capital null, with the note \"No capital cost: a reference plant cost and capacity are required to scale from.\"", "Capital zero, named in assumedZero beside the operating costs.", "REFUSED: a reference plant cost is required to scale from.", "Capital scaled from the MODULAR default plant for the route."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "With the reference cost left blank the capital is null and the note reads: No capital cost: a reference plant cost and capacity are required to scale from." A blank cost box is the one taken as zero in assumedZero, and no default plant is printed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m03-a-routes-year ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A route''s reference plant cost is left blank. What does routeEconomics give for capital?', options = '["Capital null, with the note \"No capital cost: a reference plant cost and capacity are required to scale from.\"", "Capital zero, named in assumedZero beside the operating costs.", "REFUSED: a reference plant cost is required to scale from.", "Capital scaled from the MODULAR default plant for the route."]'::jsonb, explanation = 'The course states: "With the reference cost left blank the capital is null and the note reads: No capital cost: a reference plant cost and capacity are required to scale from." A blank cost box is the one taken as zero in assumedZero, and no default plant is printed.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-a-routes-year' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m03-a-routes-year ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 1
  select case
           when prompt = 'The CNG route recovers 0.88 of EGBEMA''s flare of 215946.438 t/yr of CO2e. What avoidedFlareCo2eTonnes does abatement print?' and options = '["190032.865", "215946.438", "218032.865", "202989.652"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "The gas it does not recover is still flared, so the avoided flare CO2e is the flare''s CO2e times the recovery." CNG prints 190032.865. 215946.438 is the whole flare, 218032.865 the net against diesel and 202989.652 the gas to power route''s avoided flare at 0.94.' then 'old'
           when prompt = 'The CNG route recovers 0.88 of EGBEMA''s flare of 215946.438 t/yr of CO2e. What avoidedFlareCo2eTonnes does abatement print?' and options = '["190032.865", "215946.438", "218032.865", "202989.652"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "The gas it does not recover is still flared, so the avoided flare CO2e is the flare''s CO2e times the recovery." CNG prints 190032.865. 215946.438 is the whole flare, 218032.865 the net against diesel and 202989.652 the gas to power route''s avoided flare at 0.94.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The CNG route recovers 0.88 of EGBEMA''s flare of 215946.438 t/yr of CO2e. What avoidedFlareCo2eTonnes does abatement print?', options = '["190032.865", "215946.438", "218032.865", "202989.652"]'::jsonb, explanation = 'The course states: "The gas it does not recover is still flared, so the avoided flare CO2e is the flare''s CO2e times the recovery." CNG prints 190032.865. 215946.438 is the whole flare, 218032.865 the net against diesel and 202989.652 the gas to power route''s avoided flare at 0.94.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 2
  select case
           when prompt = 'How does abatement form the net abatement from its three terms?' and options = '["The avoided flare, plus what burning the product emits, less what the product displaces.", "The whole flare, less what burning the product emits, plus what the product displaces.", "The avoided flare, less what burning the product emits, plus what the product displaces.", "What the product displaces, less the avoided flare, less what burning the product emits."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces." The avoided flare is the flare''s CO2e times the recovery, 190032.865 on the CNG route.' then 'old'
           when prompt = 'How does abatement form the net abatement from its three terms?' and options = '["The avoided flare, plus what burning the product emits, less what the product displaces.", "The whole flare, less what burning the product emits, plus what the product displaces.", "The avoided flare, less what burning the product emits, plus what the product displaces.", "What the product displaces, less the avoided flare, less what burning the product emits."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces." The avoided flare is the flare''s CO2e times the recovery, 190032.865 on the CNG route.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does abatement form the net abatement from its three terms?', options = '["The avoided flare, plus what burning the product emits, less what the product displaces.", "The whole flare, less what burning the product emits, plus what the product displaces.", "The avoided flare, less what burning the product emits, plus what the product displaces.", "What the product displaces, less the avoided flare, less what burning the product emits."]'::jsonb, explanation = 'The course states: "The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces." The avoided flare is the flare''s CO2e times the recovery, 190032.865 on the CNG route.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 6
  select case
           when prompt = 'On the three CNG counterfactuals, which one gives a net abatement LARGER than the gross flare?' and options = '["Displacing pipeline gas already burned", "Displacing diesel in haulage trucks", "A market that burned nothing, as no fuel is burned", "None of the three: a net never exceeds the flare"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller." The diesel row''s net minus the gross flare is 2086.427.' then 'old'
           when prompt = 'On the three CNG counterfactuals, which one gives a net abatement LARGER than the gross flare?' and options = '["Displacing pipeline gas already burned", "Displacing diesel in haulage trucks", "A market that burned nothing, as no fuel is burned", "None of the three: a net never exceeds the flare"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller." The diesel row''s net minus the gross flare is 2086.427.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the three CNG counterfactuals, which one gives a net abatement LARGER than the gross flare?', options = '["Displacing pipeline gas already burned", "Displacing diesel in haulage trucks", "A market that burned nothing, as no fuel is burned", "None of the three: a net never exceeds the flare"]'::jsonb, explanation = 'The course states: "Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller." The diesel row''s net minus the gross flare is 2086.427.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 7
  select case
           when prompt = 'Gas to power recovers 0.94, and its counterfactual "Gas to power for a new load that burned nothing" types product combustion 205000 and displaced 0. What does abatement print?' and options = '["avoided 202989.652; net -2010.348; this route adds emissions", "avoided 202989.652; net 218032.865; this route abates", "avoided 190032.865; net 62032.865; this route abates", "avoided 215946.438; net -2010.348; this route adds emissions"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints avoidedFlareCo2eTonnes 202989.652 and netAbatementTonnesCo2ePerYear -2010.348, and: "The net is below zero: this route adds emissions." 215946.438 is the whole flare, and 190032.865 and 62032.865 are the CNG route''s figures.' then 'old'
           when prompt = 'Gas to power recovers 0.94, and its counterfactual "Gas to power for a new load that burned nothing" types product combustion 205000 and displaced 0. What does abatement print?' and options = '["avoided 202989.652; net -2010.348; this route adds emissions", "avoided 202989.652; net 218032.865; this route abates", "avoided 190032.865; net 62032.865; this route abates", "avoided 215946.438; net -2010.348; this route adds emissions"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints avoidedFlareCo2eTonnes 202989.652 and netAbatementTonnesCo2ePerYear -2010.348, and: "The net is below zero: this route adds emissions." 215946.438 is the whole flare, and 190032.865 and 62032.865 are the CNG route''s figures.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Gas to power recovers 0.94, and its counterfactual "Gas to power for a new load that burned nothing" types product combustion 205000 and displaced 0. What does abatement print?', options = '["avoided 202989.652; net -2010.348; this route adds emissions", "avoided 202989.652; net 218032.865; this route abates", "avoided 190032.865; net 62032.865; this route abates", "avoided 215946.438; net -2010.348; this route adds emissions"]'::jsonb, explanation = 'The course prints avoidedFlareCo2eTonnes 202989.652 and netAbatementTonnesCo2ePerYear -2010.348, and: "The net is below zero: this route adds emissions." 215946.438 is the whole flare, and 190032.865 and 62032.865 are the CNG route''s figures.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 9
  select case
           when prompt = 'In abatement''s blocked probe table, which probe prints the blockedBy text that names the methane global warming potential?' and options = '["the probe with no GWP", "the probe at 1.5", "the no label probe", "the probe with no displaced fuel figure"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s probe "no GWP" prints a net of null beside blockedBy "no methane global warming potential supplied". Recovery 1.5 prints the recovery text, and the label and displaced fuel probes print the counterfactual text.' then 'old'
           when prompt = 'In abatement''s blocked probe table, which probe prints the blockedBy text that names the methane global warming potential?' and options = '["the probe with no GWP", "the probe at 1.5", "the no label probe", "the probe with no displaced fuel figure"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s probe "no GWP" prints a net of null beside blockedBy "no methane global warming potential supplied". Recovery 1.5 prints the recovery text, and the label and displaced fuel probes print the counterfactual text.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In abatement''s blocked probe table, which probe prints the blockedBy text that names the methane global warming potential?', options = '["the probe with no GWP", "the probe at 1.5", "the no label probe", "the probe with no displaced fuel figure"]'::jsonb, explanation = 'The course''s probe "no GWP" prints a net of null beside blockedBy "no methane global warming potential supplied". Recovery 1.5 prints the recovery text, and the label and displaced fuel probes print the counterfactual text.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 10
  select case
           when prompt = 'A recovery of 1.5 is typed into abatement. What does blockedBy read?' and options = '["the counterfactual is not declared: what the product displaces, and what burning it emits", "no methane global warming potential supplied", "recovery capped at 1: the whole flare is taken as avoided", "no recovery fraction in (0, 1]: gas the plant does not recover is still flared"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest''s probe "recovery 1.5" prints a net of null and blockedBy "no recovery fraction in (0, 1]: gas the plant does not recover is still flared", the same text as the probe with no recovery fraction.' then 'old'
           when prompt = 'A recovery of 1.5 is typed into abatement. What does blockedBy read?' and options = '["the counterfactual is not declared: what the product displaces, and what burning it emits", "no methane global warming potential supplied", "recovery capped at 1: the whole flare is taken as avoided", "no recovery fraction in (0, 1]: gas the plant does not recover is still flared"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s probe "recovery 1.5" prints a net of null and blockedBy "no recovery fraction in (0, 1]: gas the plant does not recover is still flared", the same text as the probe with no recovery fraction.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A recovery of 1.5 is typed into abatement. What does blockedBy read?', options = '["the counterfactual is not declared: what the product displaces, and what burning it emits", "no methane global warming potential supplied", "recovery capped at 1: the whole flare is taken as avoided", "no recovery fraction in (0, 1]: gas the plant does not recover is still flared"]'::jsonb, explanation = 'The course''s probe "recovery 1.5" prints a net of null and blockedBy "no recovery fraction in (0, 1]: gas the plant does not recover is still flared", the same text as the probe with no recovery fraction.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-counterfactual ord 12
  select case
           when prompt = 'Beside a blocked net, which figure does abatement still report, and in which field?' and options = '["190032.865 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as netAbatementTonnesCo2ePerYear", "218032.865 t/yr, as grossClaimIfNoCounterfactual"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "The flare''s gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (215946.438 t/yr here): the claim the engine will not make." The net itself prints null on every blocked probe.' then 'old'
           when prompt = 'Beside a blocked net, which figure does abatement still report, and in which field?' and options = '["190032.865 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as netAbatementTonnesCo2ePerYear", "218032.865 t/yr, as grossClaimIfNoCounterfactual"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "The flare''s gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (215946.438 t/yr here): the claim the engine will not make." The net itself prints null on every blocked probe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m04-the-counterfactual ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside a blocked net, which figure does abatement still report, and in which field?', options = '["190032.865 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as grossClaimIfNoCounterfactual", "215946.438 t/yr, as netAbatementTonnesCo2ePerYear", "218032.865 t/yr, as grossClaimIfNoCounterfactual"]'::jsonb, explanation = 'The course states: "The flare''s gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (215946.438 t/yr here): the claim the engine will not make." The net itself prints null on every blocked probe.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-counterfactual' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m04-the-counterfactual ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 2
  select case
           when prompt = 'Credit prices are typed in the order 40, 8, 20, 12. What does lowestTestedClearingPrice read?' and options = '["20", "40", "16.0152", "12"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Of the prices typed, 40 and 20 print clearsHurdle true and 8 and 12 false, and the digest prints lowestTestedClearingPrice 20. 40 is the first price in the order typed that clears, and 16.0152 is the breakeven.' then 'old'
           when prompt = 'Credit prices are typed in the order 40, 8, 20, 12. What does lowestTestedClearingPrice read?' and options = '["20", "40", "16.0152", "12"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Of the prices typed, 40 and 20 print clearsHurdle true and 8 and 12 false, and the course prints lowestTestedClearingPrice 20. 40 is the first price in the order typed that clears, and 16.0152 is the breakeven.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Credit prices are typed in the order 40, 8, 20, 12. What does lowestTestedClearingPrice read?', options = '["20", "40", "16.0152", "12"]'::jsonb, explanation = 'Of the prices typed, 40 and 20 print clearsHurdle true and 8 and 12 false, and the course prints lowestTestedClearingPrice 20. 40 is the first price in the order typed that clears, and 16.0152 is the breakeven.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 3
  select case
           when prompt = 'Beside the breakeven and lowestTestedClearingPrice, a third price is printed: the first price in the order typed that clears. What does it read, and how does it relate to the other two?' and options = '["20, and it equals the lowest tested price", "16.0152, and it equals the breakeven price", "40, and it is lowestTestedClearingPrice", "40, and it is neither of the other two"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the first price in the order typed that clears as 40 and says it "is a third figure again, and it is neither". The breakeven is 16.0152 and lowestTestedClearingPrice is 20.' then 'old'
           when prompt = 'Beside the breakeven and lowestTestedClearingPrice, a third price is printed: the first price in the order typed that clears. What does it read, and how does it relate to the other two?' and options = '["20, and it equals the lowest tested price", "16.0152, and it equals the breakeven price", "40, and it is lowestTestedClearingPrice", "40, and it is neither of the other two"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the first price in the order typed that clears as 40 and says it "is a third figure again, and it is neither". The breakeven is 16.0152 and lowestTestedClearingPrice is 20.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside the breakeven and lowestTestedClearingPrice, a third price is printed: the first price in the order typed that clears. What does it read, and how does it relate to the other two?', options = '["20, and it equals the lowest tested price", "16.0152, and it equals the breakeven price", "40, and it is lowestTestedClearingPrice", "40, and it is neither of the other two"]'::jsonb, explanation = 'The course prints the first price in the order typed that clears as 40 and says it "is a third figure again, and it is neither". The breakeven is 16.0152 and lowestTestedClearingPrice is 20.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 4
  select case
           when prompt = 'What is printed as the breakeven''s numerator, the hurdle minus the margin, on EGBEMA''s CNG route?' and options = '["24500000 a year", "3491850.00 a year", "8721314.60 a year", "21008150.00 a year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest: "The breakeven''s numerator, the hurdle minus the margin: 3491850.00 a year, over 218032.865 t/yr." 24500000 is the hurdle, 21008150.00 the gross margin and 8721314.60 the credit revenue at a price of 40.' then 'old'
           when prompt = 'What is printed as the breakeven''s numerator, the hurdle minus the margin, on EGBEMA''s CNG route?' and options = '["24500000 a year", "3491850.00 a year", "8721314.60 a year", "21008150.00 a year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "The breakeven''s numerator, the hurdle minus the margin: 3491850.00 a year, over 218032.865 t/yr." 24500000 is the hurdle, 21008150.00 the gross margin and 8721314.60 the credit revenue at a price of 40.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What is printed as the breakeven''s numerator, the hurdle minus the margin, on EGBEMA''s CNG route?', options = '["24500000 a year", "3491850.00 a year", "8721314.60 a year", "21008150.00 a year"]'::jsonb, explanation = 'The course states: "The breakeven''s numerator, the hurdle minus the margin: 3491850.00 a year, over 218032.865 t/yr." 24500000 is the hurdle, 21008150.00 the gross margin and 8721314.60 the credit revenue at a price of 40.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 6
  select case
           when prompt = 'How does creditSensitivity form creditRevenuePerYear at each typed price?' and options = '["The credit price times the gross flare CO2e in tonnes.", "The credit price times the avoided flare CO2e in tonnes.", "The credit price times the net abatement in tonnes.", "The credit price times the net tonnes, less the margin."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route''s gross margin plus that". At a price of 20 on 218032.865 t/yr it prints 4360657.30.' then 'old'
           when prompt = 'How does creditSensitivity form creditRevenuePerYear at each typed price?' and options = '["The credit price times the gross flare CO2e in tonnes.", "The credit price times the avoided flare CO2e in tonnes.", "The credit price times the net abatement in tonnes.", "The credit price times the net tonnes, less the margin."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route''s gross margin plus that". At a price of 20 on 218032.865 t/yr it prints 4360657.30.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does creditSensitivity form creditRevenuePerYear at each typed price?', options = '["The credit price times the gross flare CO2e in tonnes.", "The credit price times the avoided flare CO2e in tonnes.", "The credit price times the net abatement in tonnes.", "The credit price times the net tonnes, less the margin."]'::jsonb, explanation = 'The course states: "creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route''s gross margin plus that". At a price of 20 on 218032.865 t/yr it prints 4360657.30.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 7
  select case
           when prompt = 'Against a hurdle of 24500000, what verdict does creditSensitivity give EGBEMA''s CNG route?' and options = '["\"Needs a credit price of 20 per tonne to clear the hurdle. This is a bet on the credit price.\"", "\"Clears the hurdle on its own. Credits are upside; the case stands without them.\"", "\"Needs a credit price of 40 per tonne to clear the hurdle. Credits are upside.\"", "\"Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price.\""]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints standsAloneWithoutCredits false and the verdict "Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price." The field breakevenCreditPrice prints the same price as 16.0152. The stands alone verdict belongs to the hurdle of 20000000.' then 'old'
           when prompt = 'Against a hurdle of 24500000, what verdict does creditSensitivity give EGBEMA''s CNG route?' and options = '["\"Needs a credit price of 20 per tonne to clear the hurdle. This is a bet on the credit price.\"", "\"Clears the hurdle on its own. Credits are upside; the case stands without them.\"", "\"Needs a credit price of 40 per tonne to clear the hurdle. Credits are upside.\"", "\"Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price.\""]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints standsAloneWithoutCredits false and the verdict "Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price." The field breakevenCreditPrice prints the same price as 16.0152. The stands alone verdict belongs to the hurdle of 20000000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Against a hurdle of 24500000, what verdict does creditSensitivity give EGBEMA''s CNG route?', options = '["\"Needs a credit price of 20 per tonne to clear the hurdle. This is a bet on the credit price.\"", "\"Clears the hurdle on its own. Credits are upside; the case stands without them.\"", "\"Needs a credit price of 40 per tonne to clear the hurdle. Credits are upside.\"", "\"Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price.\""]'::jsonb, explanation = 'The course prints standsAloneWithoutCredits false and the verdict "Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price." The field breakevenCreditPrice prints the same price as 16.0152. The stands alone verdict belongs to the hurdle of 20000000.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 8
  select case
           when prompt = 'Lower the hurdle margin to 20000000 with the same margin and net. Which two fields follow?' and options = '["standsAloneWithoutCredits true, breakevenCreditPrice 0.0000", "standsAloneWithoutCredits true, breakevenCreditPrice 20", "standsAloneWithoutCredits true, breakevenCreditPrice null", "standsAloneWithoutCredits false, breakevenCreditPrice 0.0000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest: "At a hurdle of 20000000 the route stands alone: standsAloneWithoutCredits true, breakevenCreditPrice 0.0000, verdict Clears the hurdle on its own. Credits are upside; the case stands without them." A null breakeven is what the probes with no margin or no hurdle print, and 20 is lowestTestedClearingPrice at the hurdle of 24500000.' then 'old'
           when prompt = 'Lower the hurdle margin to 20000000 with the same margin and net. Which two fields follow?' and options = '["standsAloneWithoutCredits true, breakevenCreditPrice 0.0000", "standsAloneWithoutCredits true, breakevenCreditPrice 20", "standsAloneWithoutCredits true, breakevenCreditPrice null", "standsAloneWithoutCredits false, breakevenCreditPrice 0.0000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states: "At a hurdle of 20000000 the route stands alone: standsAloneWithoutCredits true, breakevenCreditPrice 0.0000, verdict Clears the hurdle on its own. Credits are upside; the case stands without them." A null breakeven is what the probes with no margin or no hurdle print, and 20 is lowestTestedClearingPrice at the hurdle of 24500000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Lower the hurdle margin to 20000000 with the same margin and net. Which two fields follow?', options = '["standsAloneWithoutCredits true, breakevenCreditPrice 0.0000", "standsAloneWithoutCredits true, breakevenCreditPrice 20", "standsAloneWithoutCredits true, breakevenCreditPrice null", "standsAloneWithoutCredits false, breakevenCreditPrice 0.0000"]'::jsonb, explanation = 'The course states: "At a hurdle of 20000000 the route stands alone: standsAloneWithoutCredits true, breakevenCreditPrice 0.0000, verdict Clears the hurdle on its own. Credits are upside; the case stands without them." A null breakeven is what the probes with no margin or no hurdle print, and 20 is lowestTestedClearingPrice at the hurdle of 24500000.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 9
  select case
           when prompt = 'creditSensitivity is run on the gas to power counterfactual, whose net abatement is -2010.348 t/yr. What does it answer?' and options = '["REFUSED: No net abatement to sell. Declare the counterfactual first.", "REFUSED: The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell.", "A breakeven of 0.0000, as a negative net needs no credit price.", "No verdict: breakevenCreditPrice null, with the net named."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s probe table prints that refusal for "the gas-to-power counterfactual, which adds emissions". The "No net abatement to sell" refusal is the one for a counterfactual left undeclared.' then 'old'
           when prompt = 'creditSensitivity is run on the gas to power counterfactual, whose net abatement is -2010.348 t/yr. What does it answer?' and options = '["REFUSED: No net abatement to sell. Declare the counterfactual first.", "REFUSED: The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell.", "A breakeven of 0.0000, as a negative net needs no credit price.", "No verdict: breakevenCreditPrice null, with the net named."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s probe table prints that refusal for "the gas-to-power counterfactual, which adds emissions". The "No net abatement to sell" refusal is the one for a counterfactual left undeclared.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'creditSensitivity is run on the gas to power counterfactual, whose net abatement is -2010.348 t/yr. What does it answer?', options = '["REFUSED: No net abatement to sell. Declare the counterfactual first.", "REFUSED: The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell.", "A breakeven of 0.0000, as a negative net needs no credit price.", "No verdict: breakevenCreditPrice null, with the net named."]'::jsonb, explanation = 'The course''s probe table prints that refusal for "the gas-to-power counterfactual, which adds emissions". The "No net abatement to sell" refusal is the one for a counterfactual left undeclared.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 10
  select case
           when prompt = 'creditSensitivity is run with the counterfactual undeclared, so there is no net abatement. What does it answer?' and options = '["It prices credits on the gross flare of 215946.438 t/yr.", "It answers with no verdict and a null breakeven.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: REFUSED: No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued. The hurdle refusal is for a hurdle typed as ''x''.' then 'old'
           when prompt = 'creditSensitivity is run with the counterfactual undeclared, so there is no net abatement. What does it answer?' and options = '["It prices credits on the gross flare of 215946.438 t/yr.", "It answers with no verdict and a null breakeven.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: REFUSED: No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued. The hurdle refusal is for a hurdle typed as ''x''.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'creditSensitivity is run with the counterfactual undeclared, so there is no net abatement. What does it answer?', options = '["It prices credits on the gross flare of 215946.438 t/yr.", "It answers with no verdict and a null breakeven.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb, explanation = 'The course states: REFUSED: No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued. The hurdle refusal is for a hurdle typed as ''x''.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 11
  select case
           when prompt = 'The hurdle margin is typed as ''x''. What does creditSensitivity answer?' and options = '["No verdict: breakevenCreditPrice null; \"No hurdle margin, so whether it needs credits cannot be said.\"", "It takes the hurdle as zero, and the route stands alone.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest''s probe "a hurdle that is not a number (''x'')" prints REFUSED: The hurdle margin is not a number. The answer with no verdict and the no hurdle sentence belong to the hurdle left blank ('''').' then 'old'
           when prompt = 'The hurdle margin is typed as ''x''. What does creditSensitivity answer?' and options = '["No verdict: breakevenCreditPrice null; \"No hurdle margin, so whether it needs credits cannot be said.\"", "It takes the hurdle as zero, and the route stands alone.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s probe "a hurdle that is not a number (''x'')" prints REFUSED: The hurdle margin is not a number. The answer with no verdict and the no hurdle sentence belong to the hurdle left blank ('''').' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The hurdle margin is typed as ''x''. What does creditSensitivity answer?', options = '["No verdict: breakevenCreditPrice null; \"No hurdle margin, so whether it needs credits cannot be said.\"", "It takes the hurdle as zero, and the route stands alone.", "REFUSED: The hurdle margin is not a number.", "REFUSED: No net abatement to sell."]'::jsonb, explanation = 'The course''s probe "a hurdle that is not a number (''x'')" prints REFUSED: The hurdle margin is not a number. The answer with no verdict and the no hurdle sentence belong to the hurdle left blank ('''').'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 12
  select case
           when prompt = 'A study leaves the hurdle box empty (''''). Which answer comes back from the credit test?' and options = '["No verdict: breakevenCreditPrice null, with \"No hurdle margin, so whether it needs credits cannot be said.\"", "REFUSED: The hurdle margin is not a number, as a blank is not a figure.", "standsAloneWithoutCredits true, with the hurdle taken as zero.", "No verdict: breakevenCreditPrice null, with \"Supply its price and costs.\""]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s probe "hurdle left blank ('''')" answers with no verdict: breakevenCreditPrice null; "No hurdle margin, so whether it needs credits cannot be said." The other answer with no verdict belongs to a route whose price is missing.' then 'old'
           when prompt = 'A study leaves the hurdle box empty (''''). Which answer comes back from the credit test?' and options = '["No verdict: breakevenCreditPrice null, with \"No hurdle margin, so whether it needs credits cannot be said.\"", "REFUSED: The hurdle margin is not a number, as a blank is not a figure.", "standsAloneWithoutCredits true, with the hurdle taken as zero.", "No verdict: breakevenCreditPrice null, with \"Supply its price and costs.\""]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s probe "hurdle left blank ('''')" answers with no verdict: breakevenCreditPrice null; "No hurdle margin, so whether it needs credits cannot be said." The other answer with no verdict belongs to a route whose price is missing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A study leaves the hurdle box empty (''''). Which answer comes back from the credit test?', options = '["No verdict: breakevenCreditPrice null, with \"No hurdle margin, so whether it needs credits cannot be said.\"", "REFUSED: The hurdle margin is not a number, as a blank is not a figure.", "standsAloneWithoutCredits true, with the hurdle taken as zero.", "No verdict: breakevenCreditPrice null, with \"Supply its price and costs.\""]'::jsonb, explanation = 'The course''s probe "hurdle left blank ('''')" answers with no verdict: breakevenCreditPrice null; "No hurdle margin, so whether it needs credits cannot be said." The other answer with no verdict belongs to a route whose price is missing.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-credits-and-the-bid ord 13
  select case
           when prompt = 'On EGBEMA with the study''s limits, what do compareRoutes'' fields read?' and options = '["bestByValuePerMscf null; leaderNotFullyScreened cng; screenedOut Mini LNG", "bestByValuePerMscf cng; screenedOut Mini LNG; notFullyScreened gas to power", "bestByValuePerMscf cng; screenedOut gas to power; notFullyScreened Mini LNG", "bestByValuePerMscf lpg_extraction; screenedOut Mini LNG; notFullyScreened none"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints bestByValuePerMscf cng, leaderNotFullyScreened null, screenedOut Mini LNG and notFullyScreened Gas to power or gas to wire. The null best with cng as leader not fully screened is the studio''s opening case, with every limit unset.' then 'old'
           when prompt = 'On EGBEMA with the study''s limits, what do compareRoutes'' fields read?' and options = '["bestByValuePerMscf null; leaderNotFullyScreened cng; screenedOut Mini LNG", "bestByValuePerMscf cng; screenedOut Mini LNG; notFullyScreened gas to power", "bestByValuePerMscf cng; screenedOut gas to power; notFullyScreened Mini LNG", "bestByValuePerMscf lpg_extraction; screenedOut Mini LNG; notFullyScreened none"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints bestByValuePerMscf cng, leaderNotFullyScreened null, screenedOut Mini LNG and notFullyScreened Gas to power or gas to wire. The null best with cng as leader not fully screened is the studio''s opening case, with every limit unset.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m05-credits-and-the-bid ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On EGBEMA with the study''s limits, what do compareRoutes'' fields read?', options = '["bestByValuePerMscf null; leaderNotFullyScreened cng; screenedOut Mini LNG", "bestByValuePerMscf cng; screenedOut Mini LNG; notFullyScreened gas to power", "bestByValuePerMscf cng; screenedOut gas to power; notFullyScreened Mini LNG", "bestByValuePerMscf lpg_extraction; screenedOut Mini LNG; notFullyScreened none"]'::jsonb, explanation = 'The course prints bestByValuePerMscf cng, leaderNotFullyScreened null, screenedOut Mini LNG and notFullyScreened Gas to power or gas to wire. The null best with cng as leader not fully screened is the studio''s opening case, with every limit unset.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-credits-and-the-bid' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m05-credits-and-the-bid ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 3
  select case
           when prompt = 'How does the oracle check the flare by the rule?' and options = '["By mass, cross-checked by the engine''s own flare figure.", "By the rule''s volumetric route alone, with no second route.", "By moles, cross-checked by the rule''s own volumetric route.", "By moles, cross-checked against a measured flare''s figures."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "the flare by the rule by moles, cross-checked by the rule''s own volumetric route". The oracle checks independently of the engine, and the digest''s preamble says no figure in it is a published analysis or a measured flare.' then 'old'
           when prompt = 'How does the oracle check the flare by the rule?' and options = '["By mass, cross-checked by the engine''s own flare figure.", "By the rule''s volumetric route alone, with no second route.", "By moles, cross-checked by the rule''s own volumetric route.", "By moles, cross-checked against a measured flare''s figures."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "the flare by the rule by moles, cross-checked by the rule''s own volumetric route". The oracle checks independently of the engine, and the course states that none of its figures is a published analysis or a measured flare.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m06-the-professional-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the oracle check the flare by the rule?', options = '["By mass, cross-checked by the engine''s own flare figure.", "By the rule''s volumetric route alone, with no second route.", "By moles, cross-checked by the rule''s own volumetric route.", "By moles, cross-checked against a measured flare''s figures."]'::jsonb, explanation = 'The course states: "the flare by the rule by moles, cross-checked by the rule''s own volumetric route". The oracle checks independently of the engine, and the course states that none of its figures is a published analysis or a measured flare.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 5
  select case
           when prompt = 'In what form does the oracle carry the gas?' and options = '["In floating point, in pounds and standard cubic feet", "In exact rationals, in pounds and standard cubic feet", "In the engine''s own figures, to four decimals", "In exact rationals, in kilograms and cubic metres"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest: "the gas in exact rationals carried in kilograms and cubic metres". Among the engine''s own constants is SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol.' then 'old'
           when prompt = 'In what form does the oracle carry the gas?' and options = '["In floating point, in pounds and standard cubic feet", "In exact rationals, in pounds and standard cubic feet", "In the engine''s own figures, to four decimals", "In exact rationals, in kilograms and cubic metres"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: "the gas in exact rationals carried in kilograms and cubic metres". Among the engine''s own constants is SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m06-the-professional-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In what form does the oracle carry the gas?', options = '["In floating point, in pounds and standard cubic feet", "In exact rationals, in pounds and standard cubic feet", "In the engine''s own figures, to four decimals", "In exact rationals, in kilograms and cubic metres"]'::jsonb, explanation = 'The course states: "the gas in exact rationals carried in kilograms and cubic metres". Among the engine''s own constants is SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 6
  select case
           when prompt = 'Which ledgers does the oracle check on a parcel?' and options = '["The route and credit ledgers, leaving comparison", "The route, credit and comparison ledgers", "The carbon inventory and the MAC curve ledgers", "The discounted cash flow and payback ledgers"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest lists "the route, credit and comparison ledgers" among the oracle''s checks. The engine assembles its cash flow and hands it on; it does not discount it.' then 'old'
           when prompt = 'Which ledgers does the oracle check on a parcel?' and options = '["The route and credit ledgers, leaving comparison", "The route, credit and comparison ledgers", "The carbon inventory and the MAC curve ledgers", "The discounted cash flow and payback ledgers"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course lists "the route, credit and comparison ledgers" among the oracle''s checks. The engine assembles its cash flow and hands it on; it does not discount it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m06-the-professional-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which ledgers does the oracle check on a parcel?', options = '["The route and credit ledgers, leaving comparison", "The route, credit and comparison ledgers", "The carbon inventory and the MAC curve ledgers", "The discounted cash flow and payback ledgers"]'::jsonb, explanation = 'The course lists "the route, credit and comparison ledgers" among the oracle''s checks. The engine assembles its cash flow and hands it on; it does not discount it.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 15
  select case
           when prompt = 'How is the validation oracle said to check flareToValue''s figures?' and options = '["By re-running the engine on a second machine", "Against measured flares", "Independently of the engine", "Against the typical heating values"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest: "What the validation oracle (oracle_flaretovalue.py ...) checks, independently of the engine". Every analysis is invented and illustrative, and the typical heating values are what it does not validate.' then 'old'
           when prompt = 'How is the validation oracle said to check flareToValue''s figures?' and options = '["By re-running the engine on a second machine", "Against measured flares", "Independently of the engine", "Against the typical heating values"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "What the validation oracle (oracle_flaretovalue.py ...) checks, independently of the engine". Every analysis is invented and illustrative, and the typical heating values are what it does not validate.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for intermediate m06-the-professional-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How is the validation oracle said to check flareToValue''s figures?', options = '["By re-running the engine on a second machine", "Against measured flares", "Independently of the engine", "Against the typical heating values"]'::jsonb, explanation = 'The course states: "What the validation oracle (oracle_flaretovalue.py ...) checks, independently of the engine". Every analysis is invented and illustrative, and the typical heating values are what it does not validate.'
     where app_slug = 'gasvalue' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: intermediate m06-the-professional-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 1
  select case
           when prompt = 'What typical boiling point does LPG_REFERENCE print for propane?' and options = '["-0.5 C", "38 C", "18 C", "-42 C"]'::jsonb and answer_index = 3 and explanation is not distinct from 'LPG_REFERENCE prints propane''s typical boiling point as -42 C and n-butane''s as -0.5 C. 38 C is the boiling point at KANO''s vaporizer pressure and 18 C the liquid''s inlet temperature (SECTION 27).' then 'old'
           when prompt = 'What typical boiling point does LPG_REFERENCE print for propane?' and options = '["-0.5 C", "38 C", "18 C", "-42 C"]'::jsonb and answer_index = 3 and explanation is not distinct from 'LPG_REFERENCE prints propane''s typical boiling point as -42 C and n-butane''s as -0.5 C. 38 C is the boiling point at KANO''s vaporizer pressure and 18 C the liquid''s inlet temperature (the vaporizer lesson).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What typical boiling point does LPG_REFERENCE print for propane?', options = '["-0.5 C", "38 C", "18 C", "-42 C"]'::jsonb, explanation = 'LPG_REFERENCE prints propane''s typical boiling point as -42 C and n-butane''s as -0.5 C. 38 C is the boiling point at KANO''s vaporizer pressure and 18 C the liquid''s inlet temperature (the vaporizer lesson).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 3
  select case
           when prompt = 'The studio opens on propane 0.4 and butane 0.6 by liquid volume. What density does lpgBlendProperties return?' and options = '["557.4000 kg/m3", "553.6000 kg/m3", "508 kg/m3", "999.1 kg/m3"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25 prints the studio opening blend at densityKgM3 553.6000 (volume). 557.4000 kg/m3 is KANO''s blend, 508 kg/m3 propane''s typical row, and 999.1 kg/m3 is WATER_KG_M3 (SECTION 26).' then 'old'
           when prompt = 'The studio opens on propane 0.4 and butane 0.6 by liquid volume. What density does lpgBlendProperties return?' and options = '["557.4000 kg/m3", "553.6000 kg/m3", "508 kg/m3", "999.1 kg/m3"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The blend lesson prints the studio opening blend at densityKgM3 553.6000 (volume). 557.4000 kg/m3 is KANO''s blend, 508 kg/m3 propane''s typical row, and 999.1 kg/m3 is WATER_KG_M3 (the vessel lesson).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio opens on propane 0.4 and butane 0.6 by liquid volume. What density does lpgBlendProperties return?', options = '["557.4000 kg/m3", "553.6000 kg/m3", "508 kg/m3", "999.1 kg/m3"]'::jsonb, explanation = 'The blend lesson prints the studio opening blend at densityKgM3 553.6000 (volume). 557.4000 kg/m3 is KANO''s blend, 508 kg/m3 propane''s typical row, and 999.1 kg/m3 is WATER_KG_M3 (the vessel lesson).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 4
  select case
           when prompt = 'lpgBlendProperties is given a negative volume fraction. Which line comes back?' and options = '["REFUSED: Every component needs a volume fraction.", "REFUSED: A volume fraction cannot be negative.", "A blend taken on the components whose fractions are positive.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25''s probe table prints "REFUSED: A volume fraction cannot be negative." A blank butane volume fraction gets "Every component needs a volume fraction."; the fill ratio refusal belongs to lpgStorageSizing.' then 'old'
           when prompt = 'lpgBlendProperties is given a negative volume fraction. Which line comes back?' and options = '["REFUSED: Every component needs a volume fraction.", "REFUSED: A volume fraction cannot be negative.", "A blend taken on the components whose fractions are positive.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The blend lesson''s probe table prints "REFUSED: A volume fraction cannot be negative." A blank butane volume fraction gets "Every component needs a volume fraction."; the fill ratio refusal belongs to lpgStorageSizing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'lpgBlendProperties is given a negative volume fraction. Which line comes back?', options = '["REFUSED: Every component needs a volume fraction.", "REFUSED: A volume fraction cannot be negative.", "A blend taken on the components whose fractions are positive.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb, explanation = 'The blend lesson''s probe table prints "REFUSED: A volume fraction cannot be negative." A blank butane volume fraction gets "Every component needs a volume fraction."; the fill ratio refusal belongs to lpgStorageSizing.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 5
  select case
           when prompt = 'KANO''s vessel is given a fill limit of 1. What does lpgStorageSizing print?' and options = '["REFUSED: At this density the filling density fills the vessel liquid-full.", "The vessel sized liquid-full, with no vapour space left.", "REFUSED: A maximum fill ratio is required and is not defaulted.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 26''s probe table prints "REFUSED: The maximum fill ratio must lie between 0 and 1." for a fill limit of 1. The liquid-full refusal is the probe with a filling density of 0.6 on water capacity; the not defaulted refusal is a blank fill limit.' then 'old'
           when prompt = 'KANO''s vessel is given a fill limit of 1. What does lpgStorageSizing print?' and options = '["REFUSED: At this density the filling density fills the vessel liquid-full.", "The vessel sized liquid-full, with no vapour space left.", "REFUSED: A maximum fill ratio is required and is not defaulted.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The vessel lesson''s probe table prints "REFUSED: The maximum fill ratio must lie between 0 and 1." for a fill limit of 1. The liquid-full refusal is the probe with a filling density of 0.6 on water capacity; the not defaulted refusal is a blank fill limit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s vessel is given a fill limit of 1. What does lpgStorageSizing print?', options = '["REFUSED: At this density the filling density fills the vessel liquid-full.", "The vessel sized liquid-full, with no vapour space left.", "REFUSED: A maximum fill ratio is required and is not defaulted.", "REFUSED: The maximum fill ratio must lie between 0 and 1."]'::jsonb, explanation = 'The vessel lesson''s probe table prints "REFUSED: The maximum fill ratio must lie between 0 and 1." for a fill limit of 1. The liquid-full refusal is the probe with a filling density of 0.6 on water capacity; the not defaulted refusal is a blank fill limit.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 6
  select case
           when prompt = 'The fill ratio basis is typed as ''weight''. What does the engine do?' and options = '["It reads weight as water_capacity_mass and names that basis in its output.", "It takes liquid_volume, the basis it takes when none is given in the call.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass.", "REFUSED: A liquid density is required; it is not assumed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 26''s probe table prints the unknown basis refusal for ''weight''. liquid_volume is what the engine takes when the basis is OMITTED from the call; a basis that is typed and unknown is refused.' then 'old'
           when prompt = 'The fill ratio basis is typed as ''weight''. What does the engine do?' and options = '["It reads weight as water_capacity_mass and names that basis in its output.", "It takes liquid_volume, the basis it takes when none is given in the call.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass.", "REFUSED: A liquid density is required; it is not assumed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The vessel lesson''s probe table prints the unknown basis refusal for ''weight''. liquid_volume is what the engine takes when the basis is OMITTED from the call; a basis that is typed and unknown is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The fill ratio basis is typed as ''weight''. What does the engine do?', options = '["It reads weight as water_capacity_mass and names that basis in its output.", "It takes liquid_volume, the basis it takes when none is given in the call.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass.", "REFUSED: A liquid density is required; it is not assumed."]'::jsonb, explanation = 'The vessel lesson''s probe table prints the unknown basis refusal for ''weight''. liquid_volume is what the engine takes when the basis is OMITTED from the call; a basis that is typed and unknown is refused.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 7
  select case
           when prompt = 'What deliveriesPerMonth does lpgStorageSizing print for KANO, and by which rule?' and options = '["12.0000, the demand times 30 over the delivery", "12.0000, usableTonnes over the delivery of 20 t", "8.8840, usableTonnes over the demand", "40.0000, the demand times the lead time plus the safety stock"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 26: deliveriesPerMonth is the demand times 30 over the delivery, and both rows print 12.0000. usableTonnes over the demand is coverDays, 8.8840 at the 0.85 fill; the demand times the lead time plus the safety stock is reorderAtTonnes, 40.0000.' then 'old'
           when prompt = 'What deliveriesPerMonth does lpgStorageSizing print for KANO, and by which rule?' and options = '["12.0000, the demand times 30 over the delivery", "12.0000, usableTonnes over the delivery of 20 t", "8.8840, usableTonnes over the demand", "40.0000, the demand times the lead time plus the safety stock"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The vessel lesson: deliveriesPerMonth is the demand times 30 over the delivery, and both rows print 12.0000. usableTonnes over the demand is coverDays, 8.8840 at the 0.85 fill; the demand times the lead time plus the safety stock is reorderAtTonnes, 40.0000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What deliveriesPerMonth does lpgStorageSizing print for KANO, and by which rule?', options = '["12.0000, the demand times 30 over the delivery", "12.0000, usableTonnes over the delivery of 20 t", "8.8840, usableTonnes over the demand", "40.0000, the demand times the lead time plus the safety stock"]'::jsonb, explanation = 'The vessel lesson: deliveriesPerMonth is the demand times 30 over the delivery, and both rows print 12.0000. usableTonnes over the demand is coverDays, 8.8840 at the 0.85 fill; the demand times the lead time plus the safety stock is reorderAtTonnes, 40.0000.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 8
  select case
           when prompt = 'The call for KANO''s vessel at 0.85 leaves the lead time field out altogether. Which pair comes back?' and options = '["lead time in missingInputs, reorderAtTonnes null", "missingInputs none, reorderAtTonnes 16.0000", "missingInputs none, reorderAtTonnes 40.0000", "lead time in missingInputs, reorderAtTonnes 16.0000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Left out of the call, the lead time takes the stated 0 (SECTION 26): no missing inputs, and a reorder point of 16.0000, the safety stock alone. Typed blank (''''), the lead time is named missing and the reorder point is null; 40.0000 belongs to the 3 day lead time.' then 'old'
           when prompt = 'The call for KANO''s vessel at 0.85 leaves the lead time field out altogether. Which pair comes back?' and options = '["lead time in missingInputs, reorderAtTonnes null", "missingInputs none, reorderAtTonnes 16.0000", "missingInputs none, reorderAtTonnes 40.0000", "lead time in missingInputs, reorderAtTonnes 16.0000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Left out of the call, the lead time takes the stated 0 (the vessel lesson): no missing inputs, and a reorder point of 16.0000, the safety stock alone. Typed blank (''''), the lead time is named missing and the reorder point is null; 40.0000 belongs to the 3 day lead time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The call for KANO''s vessel at 0.85 leaves the lead time field out altogether. Which pair comes back?', options = '["lead time in missingInputs, reorderAtTonnes null", "missingInputs none, reorderAtTonnes 16.0000", "missingInputs none, reorderAtTonnes 40.0000", "lead time in missingInputs, reorderAtTonnes 16.0000"]'::jsonb, explanation = 'Left out of the call, the lead time takes the stated 0 (the vessel lesson): no missing inputs, and a reorder point of 16.0000, the safety stock alone. Typed blank (''''), the lead time is named missing and the reorder point is null; 40.0000 belongs to the 3 day lead time.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 9
  select case
           when prompt = 'KANO''s 0.42 is read as a share of the liquid volume, on the basis it was not stated on. What does the digest print?' and options = '["62.9433 t, the same as on water capacity", "71.0685 t, the 0.85 liquid_volume figure", "27.8271 t, which is 35.1162 t below the 62.9433 t", "35.1162 t, which is 27.8271 t below the 62.9433 t"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Read on the liquid volume, the 0.42 gives 35.1162 t, and the digest prints that as 27.8271 t below the 62.9433 t the filling density gives. 71.0685 t is the 0.85 limit''s usable stock.' then 'old'
           when prompt = 'KANO''s 0.42 is read as a share of the liquid volume, on the basis it was not stated on. What does the course print?' and options = '["62.9433 t, the same as on water capacity", "71.0685 t, the 0.85 liquid_volume figure", "27.8271 t, which is 35.1162 t below the 62.9433 t", "35.1162 t, which is 27.8271 t below the 62.9433 t"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Read on the liquid volume, the 0.42 gives 35.1162 t, and the course prints that as 27.8271 t below the 62.9433 t the filling density gives. 71.0685 t is the 0.85 limit''s usable stock.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s 0.42 is read as a share of the liquid volume, on the basis it was not stated on. What does the course print?', options = '["62.9433 t, the same as on water capacity", "71.0685 t, the 0.85 liquid_volume figure", "27.8271 t, which is 35.1162 t below the 62.9433 t", "35.1162 t, which is 27.8271 t below the 62.9433 t"]'::jsonb, explanation = 'Read on the liquid volume, the 0.42 gives 35.1162 t, and the course prints that as 27.8271 t below the 62.9433 t the filling density gives. 71.0685 t is the 0.85 limit''s usable stock.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 10
  select case
           when prompt = 'How does vaporizerDuty form the term Warm the liquid to boiling?' and options = '["Mass flow times vapour heat capacity times (outlet less boiling point)", "Mass flow times liquid heat capacity times (outlet less inlet)", "Mass flow times liquid heat capacity times (boiling point less inlet)", "Mass flow times the latent heat"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 27: warm the liquid is the mass flow times the liquid heat capacity times (boiling point less inlet). The vapour heat capacity term is the superheat and the latent heat term is the boil.' then 'old'
           when prompt = 'How does vaporizerDuty form the term Warm the liquid to boiling?' and options = '["Mass flow times vapour heat capacity times (outlet less boiling point)", "Mass flow times liquid heat capacity times (outlet less inlet)", "Mass flow times liquid heat capacity times (boiling point less inlet)", "Mass flow times the latent heat"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The vaporizer lesson: warm the liquid is the mass flow times the liquid heat capacity times (boiling point less inlet). The vapour heat capacity term is the superheat and the latent heat term is the boil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does vaporizerDuty form the term Warm the liquid to boiling?', options = '["Mass flow times vapour heat capacity times (outlet less boiling point)", "Mass flow times liquid heat capacity times (outlet less inlet)", "Mass flow times liquid heat capacity times (boiling point less inlet)", "Mass flow times the latent heat"]'::jsonb, explanation = 'The vaporizer lesson: warm the liquid is the mass flow times the liquid heat capacity times (boiling point less inlet). The vapour heat capacity term is the superheat and the latent heat term is the boil.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 13
  select case
           when prompt = 'KANO''s vaporizer is run with no latent heat. What does vaporizerDuty print?' and options = '["A duty on n-butane''s typical latent heat of 385 kJ/kg from LPG_REFERENCE.", "The warming and superheat terms, with the boil named as a missing term.", "A duty on the blend''s latent heat of 397.7592 kJ/kg, taken by default.", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 27''s probe table prints the latent heat refusal. A latent heat is a property of the product, and the engine assumes none.' then 'old'
           when prompt = 'KANO''s vaporizer is run with no latent heat. What does vaporizerDuty print?' and options = '["A duty on n-butane''s typical latent heat of 385 kJ/kg from LPG_REFERENCE.", "The warming and superheat terms, with the boil named as a missing term.", "A duty on the blend''s latent heat of 397.7592 kJ/kg, taken by default.", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The vaporizer lesson''s probe table prints the latent heat refusal. A latent heat is a property of the product, and the engine assumes none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s vaporizer is run with no latent heat. What does vaporizerDuty print?', options = '["A duty on n-butane''s typical latent heat of 385 kJ/kg from LPG_REFERENCE.", "The warming and superheat terms, with the boil named as a missing term.", "A duty on the blend''s latent heat of 397.7592 kJ/kg, taken by default.", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed."]'::jsonb, explanation = 'The vaporizer lesson''s probe table prints the latent heat refusal. A latent heat is a property of the product, and the engine assumes none.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 14
  select case
           when prompt = 'What arrivalsPerHour does the carousel print for KANO''s 3200 cylinders over a 10 hour shift?' and options = '["320.0000 cylinders an hour", "4516.3600 cylinders an hour", "3200 cylinders an hour", "11.7333 cylinders an hour"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 28 prints arrivalsPerHour 320.0000. 4516.3600 is throughputCapacityPerDay, 3200 the cylinders a shift, and 11.7333 the queue''s offered load in erlangs.' then 'old'
           when prompt = 'What arrivalsPerHour does the carousel print for KANO''s 3200 cylinders over a 10 hour shift?' and options = '["320.0000 cylinders an hour", "4516.3600 cylinders an hour", "3200 cylinders an hour", "11.7333 cylinders an hour"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The carousel lesson prints arrivalsPerHour 320.0000. 4516.3600 is throughputCapacityPerDay, 3200 the cylinders a shift, and 11.7333 the queue''s offered load in erlangs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What arrivalsPerHour does the carousel print for KANO''s 3200 cylinders over a 10 hour shift?', options = '["320.0000 cylinders an hour", "4516.3600 cylinders an hour", "3200 cylinders an hour", "11.7333 cylinders an hour"]'::jsonb, explanation = 'The carousel lesson prints arrivalsPerHour 320.0000. 4516.3600 is throughputCapacityPerDay, 3200 the cylinders a shift, and 11.7333 the queue''s offered load in erlangs.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 15
  select case
           when prompt = 'What does KANO''s carousel print for minimumPositionsForThroughput and meetsDemand?' and options = '["13 and true", "16 and true", "17 and true", "13 and false"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 28 prints minimumPositionsForThroughput 13 and meetsDemand true. 16 is queuePositions; 17 is the positions rounded to the nearest whole one, the shortcut the engine does not take.' then 'old'
           when prompt = 'What does KANO''s carousel print for minimumPositionsForThroughput and meetsDemand?' and options = '["13 and true", "16 and true", "17 and true", "13 and false"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The carousel lesson prints minimumPositionsForThroughput 13 and meetsDemand true. 16 is queuePositions; 17 is the positions rounded to the nearest whole one, the shortcut the engine does not take.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does KANO''s carousel print for minimumPositionsForThroughput and meetsDemand?', options = '["13 and true", "16 and true", "17 and true", "13 and false"]'::jsonb, explanation = 'The carousel lesson prints minimumPositionsForThroughput 13 and meetsDemand true. 16 is queuePositions; 17 is the positions rounded to the nearest whole one, the shortcut the engine does not take.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 16
  select case
           when prompt = 'On its 16 working positions, what probabilityOfWaiting does KANO''s carousel print?' and options = '["0.1078", "0.0633", "0.1769", "0.7333"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 28 prints queue probabilityOfWaiting 0.1769. 0.1078 and 0.0633 are the carousel run at availability 1 on 17 and on 18 positions; 0.7333 is the queue utilisation.' then 'old'
           when prompt = 'On its 16 working positions, what probabilityOfWaiting does KANO''s carousel print?' and options = '["0.1078", "0.0633", "0.1769", "0.7333"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The carousel lesson prints queue probabilityOfWaiting 0.1769. 0.1078 and 0.0633 are the carousel run at availability 1 on 17 and on 18 positions; 0.7333 is the queue utilisation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 16'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On its 16 working positions, what probabilityOfWaiting does KANO''s carousel print?', options = '["0.1078", "0.0633", "0.1769", "0.7333"]'::jsonb, explanation = 'The carousel lesson prints queue probabilityOfWaiting 0.1769. 0.1078 and 0.0633 are the carousel run at availability 1 on 17 and on 18 positions; 0.7333 is the queue utilisation.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 17
  select case
           when prompt = 'The studio''s opening carousel runs 16 positions at availability 0.9 for 8 hours. What does it print?' and options = '["effectivePositions 14.4000, queuePositions 14", "effectivePositions 14.4000, queuePositions 15", "effectivePositions 16.5600, queuePositions 16", "effectivePositions 14, queuePositions 14.4000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 28: the studio''s opening carousel prints effectivePositions 14.4000, queuePositions 14 and averageWaitMinutes 0.9850. 16.5600 and 16 are KANO''s.' then 'old'
           when prompt = 'The studio''s opening carousel runs 16 positions at availability 0.9 for 8 hours. What does it print?' and options = '["effectivePositions 14.4000, queuePositions 14", "effectivePositions 14.4000, queuePositions 15", "effectivePositions 16.5600, queuePositions 16", "effectivePositions 14, queuePositions 14.4000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The carousel lesson: the studio''s opening carousel prints effectivePositions 14.4000, queuePositions 14 and averageWaitMinutes 0.9850. 16.5600 and 16 are KANO''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio''s opening carousel runs 16 positions at availability 0.9 for 8 hours. What does it print?', options = '["effectivePositions 14.4000, queuePositions 14", "effectivePositions 14.4000, queuePositions 15", "effectivePositions 16.5600, queuePositions 16", "effectivePositions 14, queuePositions 14.4000"]'::jsonb, explanation = 'The carousel lesson: the studio''s opening carousel prints effectivePositions 14.4000, queuePositions 14 and averageWaitMinutes 0.9850. 16.5600 and 16 are KANO''s.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 18
  select case
           when prompt = 'KANO''s carousel is sized with no fill time. Which line comes back?' and options = '["REFUSED: Arrivals, fill time and a dispenser count are required and must be positive.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "A carousel run on the studio''s 2.5 minutes a cylinder.", "REFUSED: Demand, fill time and a position count are required and must be positive."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 28''s probe table prints the demand, fill time and position count refusal. The arrivals and dispenser count refusal is cngDispensing''s (SECTION 33).' then 'old'
           when prompt = 'KANO''s carousel is sized with no fill time. Which line comes back?' and options = '["REFUSED: Arrivals, fill time and a dispenser count are required and must be positive.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "A carousel run on the studio''s 2.5 minutes a cylinder.", "REFUSED: Demand, fill time and a position count are required and must be positive."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The carousel lesson''s probe table prints the demand, fill time and position count refusal. The arrivals and dispenser count refusal is cngDispensing''s (the forecourt lesson).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s carousel is sized with no fill time. Which line comes back?', options = '["REFUSED: Arrivals, fill time and a dispenser count are required and must be positive.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "A carousel run on the studio''s 2.5 minutes a cylinder.", "REFUSED: Demand, fill time and a position count are required and must be positive."]'::jsonb, explanation = 'The carousel lesson''s probe table prints the demand, fill time and position count refusal. The arrivals and dispenser count refusal is cngDispensing''s (the forecourt lesson).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 20
  select case
           when prompt = 'A cylinder float is asked for with an empty list of cycle stages. The engine''s answer?' and options = '["REFUSED: No duration for At the customer.", "A fleet of none, since no stage holds an asset.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: The spares allowance cannot be negative."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 29''s probe table prints the at least one stage refusal for no stages. "No duration for At the customer." is KANO''s cycle with that stage left blank.' then 'old'
           when prompt = 'A cylinder float is asked for with an empty list of cycle stages. The engine''s answer?' and options = '["REFUSED: No duration for At the customer.", "A fleet of none, since no stage holds an asset.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: The spares allowance cannot be negative."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The fleet lesson''s probe table prints the at least one stage refusal for no stages. "No duration for At the customer." is KANO''s cycle with that stage left blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A cylinder float is asked for with an empty list of cycle stages. The engine''s answer?', options = '["REFUSED: No duration for At the customer.", "A fleet of none, since no stage holds an asset.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: The spares allowance cannot be negative."]'::jsonb, explanation = 'The fleet lesson''s probe table prints the at least one stage refusal for no stages. "No duration for At the customer." is KANO''s cycle with that stage left blank.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 21
  select case
           when prompt = 'Which bank of IBAFO''s gas storage holds 448.1628 kg?' and options = '["Mid, 2 m3 at 250 bar(a)", "High, 2 m3 at 270 bar(a)", "Low, 2 m3 at 230 bar(a)", "Mid, read at 250.0130 bar(a)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 30 prints massKg 448.1628 on the High row. The Mid bank holds 425.6293 kg, the Low bank 400.5918 kg, and 250.0130 bar(a) gives 425.6447 kg.' then 'old'
           when prompt = 'Which bank of IBAFO''s gas storage holds 448.1628 kg?' and options = '["Mid, 2 m3 at 250 bar(a)", "High, 2 m3 at 270 bar(a)", "Low, 2 m3 at 230 bar(a)", "Mid, read at 250.0130 bar(a)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bank lesson prints massKg 448.1628 on the High row. The Mid bank holds 425.6293 kg, the Low bank 400.5918 kg, and 250.0130 bar(a) gives 425.6447 kg.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 21'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which bank of IBAFO''s gas storage holds 448.1628 kg?', options = '["Mid, 2 m3 at 250 bar(a)", "High, 2 m3 at 270 bar(a)", "Low, 2 m3 at 230 bar(a)", "Mid, read at 250.0130 bar(a)"]'::jsonb, explanation = 'The bank lesson prints massKg 448.1628 on the High row. The Mid bank holds 425.6293 kg, the Low bank 400.5918 kg, and 250.0130 bar(a) gives 425.6447 kg.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 22
  select case
           when prompt = 'For the 249 bar gauge reading, what does the absolute minus gauge-as-absolute row print?' and options = '["1.0130 bar(a) and 425.6447 kg", "250.0130 bar(a) and 1.2054 kg", "1.0130 bar(a) and 1.2054 kg", "249 bar(a) and 424.4393 kg"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 30''s gauge table prints absolute minus gauge-as-absolute as 1.0130 bar(a) and 1.2054 kg. 249 and 424.4393 kg are the gauge reading typed as if absolute; 250.0130 and 425.6447 kg are gauge plus atmosphere.' then 'old'
           when prompt = 'For the 249 bar gauge reading, what does the absolute minus gauge-as-absolute row print?' and options = '["1.0130 bar(a) and 425.6447 kg", "250.0130 bar(a) and 1.2054 kg", "1.0130 bar(a) and 1.2054 kg", "249 bar(a) and 424.4393 kg"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bank lesson''s gauge table prints absolute minus gauge-as-absolute as 1.0130 bar(a) and 1.2054 kg. 249 and 424.4393 kg are the gauge reading typed as if absolute; 250.0130 and 425.6447 kg are gauge plus atmosphere.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 22'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For the 249 bar gauge reading, what does the absolute minus gauge-as-absolute row print?', options = '["1.0130 bar(a) and 425.6447 kg", "250.0130 bar(a) and 1.2054 kg", "1.0130 bar(a) and 1.2054 kg", "249 bar(a) and 424.4393 kg"]'::jsonb, explanation = 'The bank lesson''s gauge table prints absolute minus gauge-as-absolute as 1.0130 bar(a) and 1.2054 kg. 249 and 424.4393 kg are the gauge reading typed as if absolute; 250.0130 and 425.6447 kg are gauge plus atmosphere.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 23
  select case
           when prompt = 'The bank mass is requested without any pressure. What is printed?' and options = '["REFUSED: A pressure is required.", "REFUSED: A gas specific gravity is required.", "The mass at the atmosphere of 1.013 bar(a).", "REFUSED: A temperature is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'gasMassInVessel refuses a missing pressure with that line (SECTION 30). 1.013 bar(a) is the site''s atmosphere in SECTION 30''s gauge example.' then 'old'
           when prompt = 'The bank mass is requested without any pressure. What is printed?' and options = '["REFUSED: A pressure is required.", "REFUSED: A gas specific gravity is required.", "The mass at the atmosphere of 1.013 bar(a).", "REFUSED: A temperature is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'gasMassInVessel refuses a missing pressure with that line (the bank lesson). 1.013 bar(a) is the site''s atmosphere in the bank lesson''s gauge example.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 23'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The bank mass is requested without any pressure. What is printed?', options = '["REFUSED: A pressure is required.", "REFUSED: A gas specific gravity is required.", "The mass at the atmosphere of 1.013 bar(a).", "REFUSED: A temperature is required."]'::jsonb, explanation = 'gasMassInVessel refuses a missing pressure with that line (the bank lesson). 1.013 bar(a) is the site''s atmosphere in the bank lesson''s gauge example.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 24
  select case
           when prompt = 'Which ppr does IBAFO''s Low bank print at 30 C, and is the correlation in range?' and options = '["ppr 4.9479, correlationInRange true", "ppr 4.9479, correlationInRange false", "ppr 5.8084, correlationInRange true", "ppr 0.9727, correlationInRange false"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 30''s bank table prints the Low bank at ppr 4.9479 with correlationInRange true. 5.8084 is the High bank''s ppr, and 0.9727 is the tpr of the Low bank at -80 C, where correlationInRange is false.' then 'old'
           when prompt = 'Which ppr does IBAFO''s Low bank print at 30 C, and is the correlation in range?' and options = '["ppr 4.9479, correlationInRange true", "ppr 4.9479, correlationInRange false", "ppr 5.8084, correlationInRange true", "ppr 0.9727, correlationInRange false"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bank lesson''s table prints the Low bank at ppr 4.9479 with correlationInRange true. 5.8084 is the High bank''s ppr, and 0.9727 is the tpr of the Low bank at -80 C, where correlationInRange is false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which ppr does IBAFO''s Low bank print at 30 C, and is the correlation in range?', options = '["ppr 4.9479, correlationInRange true", "ppr 4.9479, correlationInRange false", "ppr 5.8084, correlationInRange true", "ppr 0.9727, correlationInRange false"]'::jsonb, explanation = 'The bank lesson''s table prints the Low bank at ppr 4.9479 with correlationInRange true. 5.8084 is the High bank''s ppr, and 0.9727 is the tpr of the Low bank at -80 C, where correlationInRange is false.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 26
  select case
           when prompt = 'cascadeEfficiency is a ratio of two cascade masses. Which two, and at what value for IBAFO?' and options = '["Delivered over stored, 0.1505", "Left in the banks over stored, 0.4775", "Delivered over stored, 0.4775", "Delivered over stored, 0.4577"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 31 prints cascadeEfficiency (delivered over stored) 0.4775 for IBAFO. 0.1505 is the same 6.0000 m3 as one bank, and 0.4577 the studio''s opening cascade.' then 'old'
           when prompt = 'cascadeEfficiency is a ratio of two cascade masses. Which two, and at what value for IBAFO?' and options = '["Delivered over stored, 0.1505", "Left in the banks over stored, 0.4775", "Delivered over stored, 0.4775", "Delivered over stored, 0.4577"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The cascade lesson prints cascadeEfficiency (delivered over stored) 0.4775 for IBAFO. 0.1505 is the same 6.0000 m3 as one bank, and 0.4577 the studio''s opening cascade.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'cascadeEfficiency is a ratio of two cascade masses. Which two, and at what value for IBAFO?', options = '["Delivered over stored, 0.1505", "Left in the banks over stored, 0.4775", "Delivered over stored, 0.4775", "Delivered over stored, 0.4577"]'::jsonb, explanation = 'The cascade lesson prints cascadeEfficiency (delivered over stored) 0.4775 for IBAFO. 0.1505 is the same 6.0000 m3 as one bank, and 0.4577 the studio''s opening cascade.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 27
  select case
           when prompt = 'The studio''s opening cascade, three 1.5 m3 banks at 250 bar(a), prints how many fills before recharge?' and options = '["33, with the next vehicle reaching 195.5640 bar(a)", "38, with the next vehicle reaching 197.7590 bar(a)", "33, with the next vehicle reaching 197.7590 bar(a)", "38, with the next vehicle reaching 195.5640 bar(a)"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 31: the studio''s opening cascade prints fillsBeforeRecharge 33, cascadeEfficiency 0.4577, leftInBanksKg 542.689 and nextVehicleReachesBar 195.5640. 38 and 197.7590 are IBAFO''s.' then 'old'
           when prompt = 'The studio''s opening cascade, three 1.5 m3 banks at 250 bar(a), prints how many fills before recharge?' and options = '["33, with the next vehicle reaching 195.5640 bar(a)", "38, with the next vehicle reaching 197.7590 bar(a)", "33, with the next vehicle reaching 197.7590 bar(a)", "38, with the next vehicle reaching 195.5640 bar(a)"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The cascade lesson: the studio''s opening cascade prints fillsBeforeRecharge 33, cascadeEfficiency 0.4577, leftInBanksKg 542.689 and nextVehicleReachesBar 195.5640. 38 and 197.7590 are IBAFO''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The studio''s opening cascade, three 1.5 m3 banks at 250 bar(a), prints how many fills before recharge?', options = '["33, with the next vehicle reaching 195.5640 bar(a)", "38, with the next vehicle reaching 197.7590 bar(a)", "33, with the next vehicle reaching 197.7590 bar(a)", "38, with the next vehicle reaching 195.5640 bar(a)"]'::jsonb, explanation = 'The cascade lesson: the studio''s opening cascade prints fillsBeforeRecharge 33, cascadeEfficiency 0.4577, leftInBanksKg 542.689 and nextVehicleReachesBar 195.5640. 38 and 197.7590 are IBAFO''s.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 28
  select case
           when prompt = 'cascadeFills is given a target pressure below the start. What does it print?' and options = '["REFUSED: At least one bank is required.", "REFUSED: A start and a higher target pressure are required.", "REFUSED: A temperature is required.", "A count of no fills, with hitFillLimit false."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A target below the start is refused with the start and higher target line (SECTION 31). The bank refusal is for a call with no banks, and the temperature refusal for a temperature left blank.' then 'old'
           when prompt = 'cascadeFills is given a target pressure below the start. What does it print?' and options = '["REFUSED: At least one bank is required.", "REFUSED: A start and a higher target pressure are required.", "REFUSED: A temperature is required.", "A count of no fills, with hitFillLimit false."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A target below the start is refused with the start and higher target line (the cascade lesson). The bank refusal is for a call with no banks, and the temperature refusal for a temperature left blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'cascadeFills is given a target pressure below the start. What does it print?', options = '["REFUSED: At least one bank is required.", "REFUSED: A start and a higher target pressure are required.", "REFUSED: A temperature is required.", "A count of no fills, with hitFillLimit false."]'::jsonb, explanation = 'A target below the start is refused with the start and higher target line (the cascade lesson). The bank refusal is for a call with no banks, and the temperature refusal for a temperature left blank.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 29
  select case
           when prompt = 'One of IBAFO''s banks is given a volume and no pressure. What does cascadeFills print?' and options = '["REFUSED: A pressure is required.", "REFUSED: Every bank needs a volume and a pressure.", "REFUSED: At least one bank is required.", "A cascade run on the other two banks alone."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 31''s probe table prints "REFUSED: Every bank needs a volume and a pressure." for a bank with no pressure. "A pressure is required." is gasMassInVessel''s line (SECTION 30).' then 'old'
           when prompt = 'One of IBAFO''s banks is given a volume and no pressure. What does cascadeFills print?' and options = '["REFUSED: A pressure is required.", "REFUSED: Every bank needs a volume and a pressure.", "REFUSED: At least one bank is required.", "A cascade run on the other two banks alone."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The cascade lesson''s probe table prints "REFUSED: Every bank needs a volume and a pressure." for a bank with no pressure. "A pressure is required." is gasMassInVessel''s line (the bank lesson).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'One of IBAFO''s banks is given a volume and no pressure. What does cascadeFills print?', options = '["REFUSED: A pressure is required.", "REFUSED: Every bank needs a volume and a pressure.", "REFUSED: At least one bank is required.", "A cascade run on the other two banks alone."]'::jsonb, explanation = 'The cascade lesson''s probe table prints "REFUSED: Every bank needs a volume and a pressure." for a bank with no pressure. "A pressure is required." is gasMassInVessel''s line (the bank lesson).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 30
  select case
           when prompt = 'Where does IBAFO''s stageCount of 4 come from?' and options = '["cngCompression''s own staging rule on bar(a)", "A stage count typed with IBAFO''s compressor inputs", "The Facilities compression engine that cngCompression calls", "The ratio of 255 to 5 bar(a), taken to a whole number"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 32''s basis reads: "Staging, polytropic head and real-gas Z from the Facilities compression engine; this converts units and does not reimplement the thermodynamics." The staging is the Facilities engine''s: cngCompression converts IBAFO''s 400 kg/h, suction 5 bar(a) at 32 C and discharge 255 bar(a) to field units, calls that engine and converts the answer back.' then 'old'
           when prompt = 'Where does IBAFO''s stageCount of 4 come from?' and options = '["cngCompression''s own staging rule on bar(a)", "A stage count typed with IBAFO''s compressor inputs", "The Facilities compression engine that cngCompression calls", "The ratio of 255 to 5 bar(a), taken to a whole number"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The compressor lesson''s basis reads: "Staging, polytropic head and real-gas Z from the Facilities compression engine; this converts units and does not reimplement the thermodynamics." The staging is the Facilities engine''s: cngCompression converts IBAFO''s 400 kg/h, suction 5 bar(a) at 32 C and discharge 255 bar(a) to field units, calls that engine and converts the answer back.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does IBAFO''s stageCount of 4 come from?', options = '["cngCompression''s own staging rule on bar(a)", "A stage count typed with IBAFO''s compressor inputs", "The Facilities compression engine that cngCompression calls", "The ratio of 255 to 5 bar(a), taken to a whole number"]'::jsonb, explanation = 'The compressor lesson''s basis reads: "Staging, polytropic head and real-gas Z from the Facilities compression engine; this converts units and does not reimplement the thermodynamics." The staging is the Facilities engine''s: cngCompression converts IBAFO''s 400 kg/h, suction 5 bar(a) at 32 C and discharge 255 bar(a) to field units, calls that engine and converts the answer back.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 31
  select case
           when prompt = 'Which stage of IBAFO''s compressor runs from 35.7070 to 95.4220 bar(a)?' and options = '["Stage 2", "Stage 3", "Stage 4", "Stage 1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 32''s stage table: stage 1 runs 5.0000 to 13.3620, stage 2 13.3620 to 35.7070, stage 3 35.7070 to 95.4220 and stage 4 95.4220 to 255.0000, each at a ratio of 2.6723.' then 'old'
           when prompt = 'Which stage of IBAFO''s compressor runs from 35.7070 to 95.4220 bar(a)?' and options = '["Stage 2", "Stage 3", "Stage 4", "Stage 1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The compressor lesson''s stage table: stage 1 runs 5.0000 to 13.3620, stage 2 13.3620 to 35.7070, stage 3 35.7070 to 95.4220 and stage 4 95.4220 to 255.0000, each at a ratio of 2.6723.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which stage of IBAFO''s compressor runs from 35.7070 to 95.4220 bar(a)?', options = '["Stage 2", "Stage 3", "Stage 4", "Stage 1"]'::jsonb, explanation = 'The compressor lesson''s stage table: stage 1 runs 5.0000 to 13.3620, stage 2 13.3620 to 35.7070, stage 3 35.7070 to 95.4220 and stage 4 95.4220 to 255.0000, each at a ratio of 2.6723.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 32
  select case
           when prompt = 'The station compressor bridge gets a suction and a discharge but no throughput. Result?' and options = '["REFUSED: A suction pressure and a higher discharge pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A pressure is required.", "A bridge with qMMscfd 0.4473 taken as the default."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 32''s probe table prints "REFUSED: A throughput is required." for no throughput. 0.4473 is IBAFO''s qMMscfd for its 400 kg/h, and the pressure refusal is gasMassInVessel''s.' then 'old'
           when prompt = 'The station compressor bridge gets a suction and a discharge but no throughput. Result?' and options = '["REFUSED: A suction pressure and a higher discharge pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A pressure is required.", "A bridge with qMMscfd 0.4473 taken as the default."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The compressor lesson''s probe table prints "REFUSED: A throughput is required." for no throughput. 0.4473 is IBAFO''s qMMscfd for its 400 kg/h, and the pressure refusal is gasMassInVessel''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 32'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The station compressor bridge gets a suction and a discharge but no throughput. Result?', options = '["REFUSED: A suction pressure and a higher discharge pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A pressure is required.", "A bridge with qMMscfd 0.4473 taken as the default."]'::jsonb, explanation = 'The compressor lesson''s probe table prints "REFUSED: A throughput is required." for no throughput. 0.4473 is IBAFO''s qMMscfd for its 400 kg/h, and the pressure refusal is gasMassInVessel''s.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 33
  select case
           when prompt = 'How busy are IBAFO''s two dispensers at 14 buses an hour, as the engine''s utilisation?' and options = '["0.4667", "1.2500", "0.7000", "0.5765"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 33 prints utilisation 0.7000 on 2 dispensers and 0.4667 on 3. 1.2500 is 25 buses an hour on 2 dispensers, and 0.5765 the probabilityOfWaiting on 2.' then 'old'
           when prompt = 'How busy are IBAFO''s two dispensers at 14 buses an hour, as the engine''s utilisation?' and options = '["0.4667", "1.2500", "0.7000", "0.5765"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The forecourt lesson prints utilisation 0.7000 on 2 dispensers and 0.4667 on 3. 1.2500 is 25 buses an hour on 2 dispensers, and 0.5765 the probabilityOfWaiting on 2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How busy are IBAFO''s two dispensers at 14 buses an hour, as the engine''s utilisation?', options = '["0.4667", "1.2500", "0.7000", "0.5765"]'::jsonb, explanation = 'The forecourt lesson prints utilisation 0.7000 on 2 dispensers and 0.4667 on 3. 1.2500 is 25 buses an hour on 2 dispensers, and 0.5765 the probabilityOfWaiting on 2.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 34
  select case
           when prompt = 'What does cngDispensing''s note say about a forecourt?' and options = '["A CNG fill takes seconds, so a forecourt queues only at traffic a liquid-fuel operator would call heavy.", "A forecourt is a different queue from the carousel and the loading rack, and is sized on its own rule.", "A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet.", "A forecourt queues only once its utilisation reaches 1.2500, and never below it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 33 prints the note verbatim, and states that a CNG forecourt is the same queue as the carousel and the loading rack. 1.2500 is the utilisation of the overloaded forecourt, and the queues on 2 and 3 dispensers at 14 buses an hour both print a probability of waiting.' then 'old'
           when prompt = 'What does cngDispensing''s note say about a forecourt?' and options = '["A CNG fill takes seconds, so a forecourt queues only at traffic a liquid-fuel operator would call heavy.", "A forecourt is a different queue from the carousel and the loading rack, and is sized on its own rule.", "A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet.", "A forecourt queues only once its utilisation reaches 1.2500, and never below it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The forecourt lesson prints the note verbatim, and states that a CNG forecourt is the same queue as the carousel and the loading rack. 1.2500 is the utilisation of the overloaded forecourt, and the queues on 2 and 3 dispensers at 14 buses an hour both print a probability of waiting.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does cngDispensing''s note say about a forecourt?', options = '["A CNG fill takes seconds, so a forecourt queues only at traffic a liquid-fuel operator would call heavy.", "A forecourt is a different queue from the carousel and the loading rack, and is sized on its own rule.", "A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet.", "A forecourt queues only once its utilisation reaches 1.2500, and never below it."]'::jsonb, explanation = 'The forecourt lesson prints the note verbatim, and states that a CNG forecourt is the same queue as the carousel and the loading rack. 1.2500 is the utilisation of the overloaded forecourt, and the queues on 2 and 3 dispensers at 14 buses an hour both print a probability of waiting.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 36
  select case
           when prompt = 'Two dispensers serve IBAFO''s 14 buses an hour. How likely is a bus to wait, by the engine?' and options = '["0.2024", "0.7000", "0.1769", "0.5765"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 33 prints probabilityOfWaiting 0.5765 on 2 dispensers and 0.2024 on 3; 0.7000 is the utilisation on 2. 0.1769 is KANO''s carousel (SECTION 28).' then 'old'
           when prompt = 'Two dispensers serve IBAFO''s 14 buses an hour. How likely is a bus to wait, by the engine?' and options = '["0.2024", "0.7000", "0.1769", "0.5765"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The forecourt lesson prints probabilityOfWaiting 0.5765 on 2 dispensers and 0.2024 on 3; 0.7000 is the utilisation on 2. 0.1769 is KANO''s carousel (the carousel lesson).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Two dispensers serve IBAFO''s 14 buses an hour. How likely is a bus to wait, by the engine?', options = '["0.2024", "0.7000", "0.1769", "0.5765"]'::jsonb, explanation = 'The forecourt lesson prints probabilityOfWaiting 0.5765 on 2 dispensers and 0.2024 on 3; 0.7000 is the utilisation on 2. 0.1769 is KANO''s carousel (the carousel lesson).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 37
  select case
           when prompt = 'What CNG kg a year and CNG cost a year does the Lagos bus switch print?' and options = '["7700.0000 kg and 2120289.8600 naira", "5579.7100 kg and 2120289.8600 naira", "5579.7100 kg and 6006000.0000 naira", "2365.8000 kg and 2120289.8600 naira"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 34 prints CNG kg a year 5579.7100 and CNG cost a year 2120289.8600. 7700.0000 is the PMS litres a year, 6006000.0000 the PMS cost a year, and 2365.8000 kgCo2eAvoidedPerYear.' then 'old'
           when prompt = 'What CNG kg a year and CNG cost a year does the Lagos bus switch print?' and options = '["7700.0000 kg and 2120289.8600 naira", "5579.7100 kg and 2120289.8600 naira", "5579.7100 kg and 6006000.0000 naira", "2365.8000 kg and 2120289.8600 naira"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bus switch lesson prints CNG kg a year 5579.7100 and CNG cost a year 2120289.8600. 7700.0000 is the PMS litres a year, 6006000.0000 the PMS cost a year, and 2365.8000 kgCo2eAvoidedPerYear.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What CNG kg a year and CNG cost a year does the Lagos bus switch print?', options = '["7700.0000 kg and 2120289.8600 naira", "5579.7100 kg and 2120289.8600 naira", "5579.7100 kg and 6006000.0000 naira", "2365.8000 kg and 2120289.8600 naira"]'::jsonb, explanation = 'The bus switch lesson prints CNG kg a year 5579.7100 and CNG cost a year 2120289.8600. 7700.0000 is the PMS litres a year, 6006000.0000 the PMS cost a year, and 2365.8000 kgCo2eAvoidedPerYear.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 39
  select case
           when prompt = 'The switch economics are run without the bus''s yearly kilometres. Which line does the engine print?' and options = '["REFUSED: Annual distance, base consumption and both fuel prices are required.", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "A saving per km, with the annual figures left null.", "REFUSED: A throughput is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 34''s probe table prints the annual distance refusal. The either or refusal is the probe with no measured consumption and a blank efficiency ratio.' then 'old'
           when prompt = 'The switch economics are run without the bus''s yearly kilometres. Which line does the engine print?' and options = '["REFUSED: Annual distance, base consumption and both fuel prices are required.", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "A saving per km, with the annual figures left null.", "REFUSED: A throughput is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bus switch lesson''s probe table prints the annual distance refusal. The either or refusal is the probe with no measured consumption and a blank efficiency ratio.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The switch economics are run without the bus''s yearly kilometres. Which line does the engine print?', options = '["REFUSED: Annual distance, base consumption and both fuel prices are required.", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "A saving per km, with the annual figures left null.", "REFUSED: A throughput is required."]'::jsonb, explanation = 'The bus switch lesson''s probe table prints the annual distance refusal. The either or refusal is the probe with no measured consumption and a blank efficiency ratio.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 40
  select case
           when prompt = 'The converted bus is assumed to use CNG energy exactly as well as PMS energy, a ratio of 1. Which consumption and payback does the switch print?' and options = '["10.1449 kg per 100 km, payback 0.3137 years", "11.6667 kg per 100 km, payback 0.3421 years", "9.3333 kg per 100 km, payback 0.3030 years", "9.3333 kg per 100 km, payback 0.3004 years"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 34''s ratio table prints 9.3333 and 0.3004 at a ratio of 1, 10.1449 and 0.3137 at 0.92, and 11.6667 and 0.3421 at 0.8. 0.3030 is the payback on the measured 9.5 kg per 100 km.' then 'old'
           when prompt = 'The converted bus is assumed to use CNG energy exactly as well as PMS energy, a ratio of 1. Which consumption and payback does the switch print?' and options = '["10.1449 kg per 100 km, payback 0.3137 years", "11.6667 kg per 100 km, payback 0.3421 years", "9.3333 kg per 100 km, payback 0.3030 years", "9.3333 kg per 100 km, payback 0.3004 years"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bus switch lesson''s ratio table prints 9.3333 and 0.3004 at a ratio of 1, 10.1449 and 0.3137 at 0.92, and 11.6667 and 0.3421 at 0.8. 0.3030 is the payback on the measured 9.5 kg per 100 km.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 40'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The converted bus is assumed to use CNG energy exactly as well as PMS energy, a ratio of 1. Which consumption and payback does the switch print?', options = '["10.1449 kg per 100 km, payback 0.3137 years", "11.6667 kg per 100 km, payback 0.3421 years", "9.3333 kg per 100 km, payback 0.3030 years", "9.3333 kg per 100 km, payback 0.3004 years"]'::jsonb, explanation = 'The bus switch lesson''s ratio table prints 9.3333 and 0.3004 at a ratio of 1, 10.1449 and 0.3137 at 0.92, and 11.6667 and 0.3421 at 0.8. 0.3030 is the payback on the measured 9.5 kg per 100 km.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 41
  select case
           when prompt = 'Which of these is a HELD limit in SECTION 35?' and options = '["The DAK and Sutton coefficients are validated by the oracle.", "The compressor''s thermodynamics are checked by this course''s oracle.", "The flare efficiencies default to the rule''s tiers.", "Fill limits by code are not shipped."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 35 holds four limits: the flare efficiencies have no default, an unlit flare is not modelled, fill limits by code are not shipped, and GWP values and credit prices are case inputs. The DAK and Sutton coefficients are pinned and not validated, and the compressor''s thermodynamics are validated in Facilities.' then 'old'
           when prompt = 'Which of these is a HELD limit in the limits lesson?' and options = '["The DAK and Sutton coefficients are validated by the oracle.", "The compressor''s thermodynamics are checked by this course''s oracle.", "The flare efficiencies default to the rule''s tiers.", "Fill limits by code are not shipped."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The limits lesson holds four limits: the flare efficiencies have no default, an unlit flare is not modelled, fill limits by code are not shipped, and GWP values and credit prices are case inputs. The DAK and Sutton coefficients are pinned and not validated, and the compressor''s thermodynamics are validated in Facilities.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these is a HELD limit in the limits lesson?', options = '["The DAK and Sutton coefficients are validated by the oracle.", "The compressor''s thermodynamics are checked by this course''s oracle.", "The flare efficiencies default to the rule''s tiers.", "Fill limits by code are not shipped."]'::jsonb, explanation = 'The limits lesson holds four limits: the flare efficiencies have no default, an unlit flare is not modelled, fill limits by code are not shipped, and GWP values and credit prices are case inputs. The DAK and Sutton coefficients are pinned and not validated, and the compressor''s thermodynamics are validated in Facilities.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 42
  select case
           when prompt = 'The end-to-end table closes on IBAFO. Which three of its figures appear there?' and options = '["Mid bank 425.6447 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 12 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 7.2000 trailers"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 36 prints IBAFO Mid bank 425.6293 kg, fills before recharge 38 and trailers required 8. 425.6447 kg is the gauge plus atmosphere reading, 12 fills the one bank case, and 7.2000 the trailers in circulation.' then 'old'
           when prompt = 'The end-to-end table closes on IBAFO. Which three of its figures appear there?' and options = '["Mid bank 425.6447 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 12 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 7.2000 trailers"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The rollout lesson prints IBAFO Mid bank 425.6293 kg, fills before recharge 38 and trailers required 8. 425.6447 kg is the gauge plus atmosphere reading, 12 fills the one bank case, and 7.2000 the trailers in circulation.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The end-to-end table closes on IBAFO. Which three of its figures appear there?', options = '["Mid bank 425.6447 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 12 fills before recharge, 8 trailers", "Mid bank 425.6293 kg, 38 fills before recharge, 7.2000 trailers"]'::jsonb, explanation = 'The rollout lesson prints IBAFO Mid bank 425.6293 kg, fills before recharge 38 and trailers required 8. 425.6447 kg is the gauge plus atmosphere reading, 12 fills the one bank case, and 7.2000 the trailers in circulation.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 1
  select case
           when prompt = 'lpgBlendProperties prints a basis beside each of the three properties it returns for KANO''s blend. Which pairing does it print?' and options = '["Density on mass, latent heat on volume, molar mass on mole.", "Density on volume, latent heat on volume, molar mass on mass.", "Density on volume, latent heat on mass, molar mass on mole.", "Density on mole, latent heat on mass, molar mass on volume."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 25 prints KANO''s row as 557.4000 (volume), 397.7592 (mass) and 52.7681 (mole), and states: density blends on volume; latent heat per kilogram blends on mass; molar mass blends on moles. Each other pairing moves at least one property onto a basis the engine does not use for it.' then 'old'
           when prompt = 'lpgBlendProperties prints a basis beside each of the three properties it returns for KANO''s blend. Which pairing does it print?' and options = '["Density on mass, latent heat on volume, molar mass on mole.", "Density on volume, latent heat on volume, molar mass on mass.", "Density on volume, latent heat on mass, molar mass on mole.", "Density on mole, latent heat on mass, molar mass on volume."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The blend lesson prints KANO''s row as 557.4000 (volume), 397.7592 (mass) and 52.7681 (mole), and states: density blends on volume; latent heat per kilogram blends on mass; molar mass blends on moles. Each other pairing moves at least one property onto a basis the engine does not use for it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'lpgBlendProperties prints a basis beside each of the three properties it returns for KANO''s blend. Which pairing does it print?', options = '["Density on mass, latent heat on volume, molar mass on mole.", "Density on volume, latent heat on volume, molar mass on mass.", "Density on volume, latent heat on mass, molar mass on mole.", "Density on mole, latent heat on mass, molar mass on volume."]'::jsonb, explanation = 'The blend lesson prints KANO''s row as 557.4000 (volume), 397.7592 (mass) and 52.7681 (mole), and states: density blends on volume; latent heat per kilogram blends on mass; molar mass blends on moles. Each other pairing moves at least one property onto a basis the engine does not use for it.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 2
  select case
           when prompt = 'KANO''s blend is propane 0.35 and butane 0.65 by liquid volume, on the typical figures. What latent heat does the engine return for it?' and options = '["397.7592 kJ/kg", "399.0000 kJ/kg", "399.6821 kJ/kg", "385 kJ/kg"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The KANO row prints latentHeatKJkg 397.7592 on mass. 399.0000 kJ/kg is KANO''s latent heat averaged on the volume fractions, which SECTION 25 prints as 1.2408 kJ/kg from the engine''s; 399.6821 kJ/kg is the studio opening blend; 385 kJ/kg is n-butane''s typical row in LPG_REFERENCE.' then 'old'
           when prompt = 'KANO''s blend is propane 0.35 and butane 0.65 by liquid volume, on the typical figures. What latent heat does the engine return for it?' and options = '["397.7592 kJ/kg", "399.0000 kJ/kg", "399.6821 kJ/kg", "385 kJ/kg"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The KANO row prints latentHeatKJkg 397.7592 on mass. 399.0000 kJ/kg is KANO''s latent heat averaged on the volume fractions, which the blend lesson prints as 1.2408 kJ/kg from the engine''s; 399.6821 kJ/kg is the studio opening blend; 385 kJ/kg is n-butane''s typical row in LPG_REFERENCE.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s blend is propane 0.35 and butane 0.65 by liquid volume, on the typical figures. What latent heat does the engine return for it?', options = '["397.7592 kJ/kg", "399.0000 kJ/kg", "399.6821 kJ/kg", "385 kJ/kg"]'::jsonb, explanation = 'The KANO row prints latentHeatKJkg 397.7592 on mass. 399.0000 kJ/kg is KANO''s latent heat averaged on the volume fractions, which the blend lesson prints as 1.2408 kJ/kg from the engine''s; 399.6821 kJ/kg is the studio opening blend; 385 kJ/kg is n-butane''s typical row in LPG_REFERENCE.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 5
  select case
           when prompt = 'KANO''s blend is run with butane''s latent heat left blank. What does lpgBlendProperties return?' and options = '["A latent heat on propane alone, and the density 557.4000 kg/m3", "A null latent heat, and the density still 557.4000 kg/m3", "A null latent heat and a null density for the blend", "REFUSED: A liquid density is required for every component; it is not assumed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25: with butane''s latent heat left blank the blend''s latent heat is null and its density still 557.4000 kg/m3, with the note "A property missing on any component is reported as missing for the blend. It is never averaged over the components that have it." The quoted refusal is the one for a blank butane liquid density.' then 'old'
           when prompt = 'KANO''s blend is run with butane''s latent heat left blank. What does lpgBlendProperties return?' and options = '["A latent heat on propane alone, and the density 557.4000 kg/m3", "A null latent heat, and the density still 557.4000 kg/m3", "A null latent heat and a null density for the blend", "REFUSED: A liquid density is required for every component; it is not assumed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The blend lesson: with butane''s latent heat left blank the blend''s latent heat is null and its density still 557.4000 kg/m3, with the note "A property missing on any component is reported as missing for the blend. It is never averaged over the components that have it." The quoted refusal is the one for a blank butane liquid density.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s blend is run with butane''s latent heat left blank. What does lpgBlendProperties return?', options = '["A latent heat on propane alone, and the density 557.4000 kg/m3", "A null latent heat, and the density still 557.4000 kg/m3", "A null latent heat and a null density for the blend", "REFUSED: A liquid density is required for every component; it is not assumed."]'::jsonb, explanation = 'The blend lesson: with butane''s latent heat left blank the blend''s latent heat is null and its density still 557.4000 kg/m3, with the note "A property missing on any component is reported as missing for the blend. It is never averaged over the components that have it." The quoted refusal is the one for a blank butane liquid density.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 6
  select case
           when prompt = 'A butane liquid density left blank is put to lpgBlendProperties. What does the engine print?' and options = '["REFUSED: A liquid density is required for every component; it is not assumed.", "REFUSED: A liquid density is required; it is not assumed.", "REFUSED: Every component needs a volume fraction.", "A null density, reported as missing for the blend."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 25''s probe table prints this refusal for the blank butane density. "A liquid density is required; it is not assumed." is lpgStorageSizing''s refusal for a vessel with no liquid density (SECTION 26), and "Every component needs a volume fraction." is the refusal for a blank butane volume fraction.' then 'old'
           when prompt = 'A butane liquid density left blank is put to lpgBlendProperties. What does the engine print?' and options = '["REFUSED: A liquid density is required for every component; it is not assumed.", "REFUSED: A liquid density is required; it is not assumed.", "REFUSED: Every component needs a volume fraction.", "A null density, reported as missing for the blend."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The blend lesson''s probe table prints this refusal for the blank butane density. "A liquid density is required; it is not assumed." is lpgStorageSizing''s refusal for a vessel with no liquid density (the vessel lesson), and "Every component needs a volume fraction." is the refusal for a blank butane volume fraction.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A butane liquid density left blank is put to lpgBlendProperties. What does the engine print?', options = '["REFUSED: A liquid density is required for every component; it is not assumed.", "REFUSED: A liquid density is required; it is not assumed.", "REFUSED: Every component needs a volume fraction.", "A null density, reported as missing for the blend."]'::jsonb, explanation = 'The blend lesson''s probe table prints this refusal for the blank butane density. "A liquid density is required; it is not assumed." is lpgStorageSizing''s refusal for a vessel with no liquid density (the vessel lesson), and "Every component needs a volume fraction." is the refusal for a blank butane volume fraction.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 7
  select case
           when prompt = 'lpgStorageSizing is called for KANO''s vessel with the fill limit left blank. What comes back?' and options = '["The vessel sized at 0.85 on liquid_volume.", "REFUSED: The maximum fill ratio must lie between 0 and 1.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "REFUSED: A maximum fill ratio is required and is not defaulted."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 26: the fill limit is required and has no default; the blank probe prints "REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically." 0.85 is one of two illustrative limits typed for KANO, neither a code value.' then 'old'
           when prompt = 'lpgStorageSizing is called for KANO''s vessel with the fill limit left blank. What comes back?' and options = '["The vessel sized at 0.85 on liquid_volume.", "REFUSED: The maximum fill ratio must lie between 0 and 1.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "REFUSED: A maximum fill ratio is required and is not defaulted."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The vessel lesson: the fill limit is required and has no default; the blank probe prints "REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically." 0.85 is one of two illustrative limits typed for KANO, neither a code value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'lpgStorageSizing is called for KANO''s vessel with the fill limit left blank. What comes back?', options = '["The vessel sized at 0.85 on liquid_volume.", "REFUSED: The maximum fill ratio must lie between 0 and 1.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "REFUSED: A maximum fill ratio is required and is not defaulted."]'::jsonb, explanation = 'The vessel lesson: the fill limit is required and has no default; the blank probe prints "REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically." 0.85 is one of two illustrative limits typed for KANO, neither a code value.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 8
  select case
           when prompt = 'The fill ratio basis is OMITTED from the call for KANO''s vessel at a fill limit of 0.85. What does the engine do?' and options = '["It takes water_capacity_mass, names it, and gives 62.9433 t usable.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "It takes liquid_volume, names it, and gives 71.0685 t usable.", "It names the basis in missingInputs and gives usableTonnes null."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 26: omitted from the call, the engine takes liquid_volume and names it in its output: fillRatioBasis liquid_volume, usableTonnes 71.0685 at a fill limit of 0.85. The refusal is what a basis typed blank ('''') gets. 62.9433 t is the 0.42 limit on water_capacity_mass.' then 'old'
           when prompt = 'The fill ratio basis is OMITTED from the call for KANO''s vessel at a fill limit of 0.85. What does the engine do?' and options = '["It takes water_capacity_mass, names it, and gives 62.9433 t usable.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "It takes liquid_volume, names it, and gives 71.0685 t usable.", "It names the basis in missingInputs and gives usableTonnes null."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The vessel lesson: omitted from the call, the engine takes liquid_volume and names it in its output: fillRatioBasis liquid_volume, usableTonnes 71.0685 at a fill limit of 0.85. The refusal is what a basis typed blank ('''') gets. 62.9433 t is the 0.42 limit on water_capacity_mass.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The fill ratio basis is OMITTED from the call for KANO''s vessel at a fill limit of 0.85. What does the engine do?', options = '["It takes water_capacity_mass, names it, and gives 62.9433 t usable.", "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.", "It takes liquid_volume, names it, and gives 71.0685 t usable.", "It names the basis in missingInputs and gives usableTonnes null."]'::jsonb, explanation = 'The vessel lesson: omitted from the call, the engine takes liquid_volume and names it in its output: fillRatioBasis liquid_volume, usableTonnes 71.0685 at a fill limit of 0.85. The refusal is what a basis typed blank ('''') gets. 62.9433 t is the 0.42 limit on water_capacity_mass.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 10
  select case
           when prompt = 'On the water-capacity basis, at what density does the engine weigh the vessel''s water capacity?' and options = '["WATER_KG_M3, that is 999.1 kg/m3", "The blend''s 557.4000 kg/m3", "n-butane''s typical 584 kg/m3", "The studio blend''s 553.6000 kg/m3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 26: on the water-capacity basis the engine weighs the water capacity at WATER_KG_M3 = 999.1 kg/m3. 557.4000 kg/m3 is KANO''s blend density, the liquid density the vessel rows use; 584 kg/m3 is n-butane''s typical row; 553.6000 kg/m3 is the studio opening blend.' then 'old'
           when prompt = 'On the water-capacity basis, at what density does the engine weigh the vessel''s water capacity?' and options = '["WATER_KG_M3, that is 999.1 kg/m3", "The blend''s 557.4000 kg/m3", "n-butane''s typical 584 kg/m3", "The studio blend''s 553.6000 kg/m3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The vessel lesson: on the water-capacity basis the engine weighs the water capacity at WATER_KG_M3 = 999.1 kg/m3. 557.4000 kg/m3 is KANO''s blend density, the liquid density the vessel rows use; 584 kg/m3 is n-butane''s typical row; 553.6000 kg/m3 is the studio opening blend.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the water-capacity basis, at what density does the engine weigh the vessel''s water capacity?', options = '["WATER_KG_M3, that is 999.1 kg/m3", "The blend''s 557.4000 kg/m3", "n-butane''s typical 584 kg/m3", "The studio blend''s 553.6000 kg/m3"]'::jsonb, explanation = 'The vessel lesson: on the water-capacity basis the engine weighs the water capacity at WATER_KG_M3 = 999.1 kg/m3. 557.4000 kg/m3 is KANO''s blend density, the liquid density the vessel rows use; 584 kg/m3 is n-butane''s typical row; 553.6000 kg/m3 is the studio opening blend.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 12
  select case
           when prompt = 'KANO''s lead time is left blank ('''') at the 0.85 fill. What does lpgStorageSizing return?' and options = '["missingInputs none, reorderAtTonnes 16.0000 from the safety stock alone", "lead time in missingInputs, reorderAtTonnes null, cover still 8.8840 days", "REFUSED on the lead time, with no cover and no reorder point given", "lead time in missingInputs, reorderAtTonnes 40.0000, cover 8.8840 days"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 26: a blank lead time is missing: missingInputs lead time; reorderAtTonnes null; deliveryFitsUllage no verdict; the cover (8.8840 days) does not depend on it and is still given. missingInputs none with a reorder point of 16.0000 is what the engine gives when the lead time is OMITTED and takes the stated 0.' then 'old'
           when prompt = 'KANO''s lead time is left blank ('''') at the 0.85 fill. What does lpgStorageSizing return?' and options = '["missingInputs none, reorderAtTonnes 16.0000 from the safety stock alone", "lead time in missingInputs, reorderAtTonnes null, cover still 8.8840 days", "REFUSED on the lead time, with no cover and no reorder point given", "lead time in missingInputs, reorderAtTonnes 40.0000, cover 8.8840 days"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The vessel lesson: a blank lead time is missing: missingInputs lead time; reorderAtTonnes null; deliveryFitsUllage no verdict; the cover (8.8840 days) does not depend on it and is still given. missingInputs none with a reorder point of 16.0000 is what the engine gives when the lead time is OMITTED and takes the stated 0.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s lead time is left blank ('''') at the 0.85 fill. What does lpgStorageSizing return?', options = '["missingInputs none, reorderAtTonnes 16.0000 from the safety stock alone", "lead time in missingInputs, reorderAtTonnes null, cover still 8.8840 days", "REFUSED on the lead time, with no cover and no reorder point given", "lead time in missingInputs, reorderAtTonnes 40.0000, cover 8.8840 days"]'::jsonb, explanation = 'The vessel lesson: a blank lead time is missing: missingInputs lead time; reorderAtTonnes null; deliveryFitsUllage no verdict; the cover (8.8840 days) does not depend on it and is still given. missingInputs none with a reorder point of 16.0000 is what the engine gives when the lead time is OMITTED and takes the stated 0.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 13
  select case
           when prompt = 'A filling density of 0.6 on water capacity is put to KANO''s vessel at the blend density. What does the engine print?' and options = '["REFUSED: The maximum fill ratio must lie between 0 and 1.", "A usable volume larger than the 150 m3 vessel, with the vapour space printed below zero.", "REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 26''s probe table prints the liquid-full refusal for this case. The between 0 and 1 refusal is the probe with a fill limit of 1; the unknown basis refusal is the basis typed as ''weight''.' then 'old'
           when prompt = 'A filling density of 0.6 on water capacity is put to KANO''s vessel at the blend density. What does the engine print?' and options = '["REFUSED: The maximum fill ratio must lie between 0 and 1.", "A usable volume larger than the 150 m3 vessel, with the vapour space printed below zero.", "REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The vessel lesson''s probe table prints the liquid-full refusal for this case. The between 0 and 1 refusal is the probe with a fill limit of 1; the unknown basis refusal is the basis typed as ''weight''.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A filling density of 0.6 on water capacity is put to KANO''s vessel at the blend density. What does the engine print?', options = '["REFUSED: The maximum fill ratio must lie between 0 and 1.", "A usable volume larger than the 150 m3 vessel, with the vapour space printed below zero.", "REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis.", "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass."]'::jsonb, explanation = 'The vessel lesson''s probe table prints the liquid-full refusal for this case. The between 0 and 1 refusal is the probe with a fill limit of 1; the unknown basis refusal is the basis typed as ''weight''.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 14
  select case
           when prompt = 'What vapour space does lpgStorageSizing leave in KANO''s 150 m3 vessel at the 0.42 water_capacity_mass limit?' and options = '["37.0770 m3", "22.5000 m3", "112.9230 m3", "127.5000 m3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 0.42 row prints usableM3 112.9230 and vapourSpaceM3 37.0770; the digest states vapourSpaceM3 is the vessel less usableM3. 22.5000 m3 is the vapour space at the 0.85 liquid_volume fill, and 127.5000 m3 that row''s usable volume.' then 'old'
           when prompt = 'What vapour space does lpgStorageSizing leave in KANO''s 150 m3 vessel at the 0.42 water_capacity_mass limit?' and options = '["37.0770 m3", "22.5000 m3", "112.9230 m3", "127.5000 m3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 0.42 row prints usableM3 112.9230 and vapourSpaceM3 37.0770; the course states vapourSpaceM3 is the vessel less usableM3. 22.5000 m3 is the vapour space at the 0.85 liquid_volume fill, and 127.5000 m3 that row''s usable volume.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What vapour space does lpgStorageSizing leave in KANO''s 150 m3 vessel at the 0.42 water_capacity_mass limit?', options = '["37.0770 m3", "22.5000 m3", "112.9230 m3", "127.5000 m3"]'::jsonb, explanation = 'The 0.42 row prints usableM3 112.9230 and vapourSpaceM3 37.0770; the course states vapourSpaceM3 is the vessel less usableM3. 22.5000 m3 is the vapour space at the 0.85 liquid_volume fill, and 127.5000 m3 that row''s usable volume.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-lpg-blend-and-the-vessel ord 15
  select case
           when prompt = 'At the 0.85 fill, usableTonnes over the demand is printed as 8.8836, and the engine''s coverDays as 8.8840. What does the digest give as the reason?' and options = '["The engine holds the 16.0000 t safety stock back from the cover.", "The engine takes the cover on the water capacity at 999.1 kg/m3.", "The engine adds the 3 day lead time before it divides.", "The engine reports coverDays rounded to three decimals."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 26''s rounding note: the engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand. The digest''s rule is that coverDays is usableTonnes over the demand, with no safety stock, water weight or lead time in it.' then 'old'
           when prompt = 'At the 0.85 fill, usableTonnes over the demand is printed as 8.8836, and the engine''s coverDays as 8.8840. What does the course give as the reason?' and options = '["The engine holds the 16.0000 t safety stock back from the cover.", "The engine takes the cover on the water capacity at 999.1 kg/m3.", "The engine adds the 3 day lead time before it divides.", "The engine reports coverDays rounded to three decimals."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The vessel lesson''s rounding note: the engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand. The course''s rule is that coverDays is usableTonnes over the demand, with no safety stock, water weight or lead time in it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m01-the-lpg-blend-and-the-vessel ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the 0.85 fill, usableTonnes over the demand is printed as 8.8836, and the engine''s coverDays as 8.8840. What does the course give as the reason?', options = '["The engine holds the 16.0000 t safety stock back from the cover.", "The engine takes the cover on the water capacity at 999.1 kg/m3.", "The engine adds the 3 day lead time before it divides.", "The engine reports coverDays rounded to three decimals."]'::jsonb, explanation = 'The vessel lesson''s rounding note: the engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand. The course''s rule is that coverDays is usableTonnes over the demand, with no safety stock, water weight or lead time in it.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-lpg-blend-and-the-vessel' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m01-the-lpg-blend-and-the-vessel ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 1
  select case
           when prompt = 'Which term of KANO''s vaporizer duty does the engine print at 0.8368 of the duty?' and options = '["Warm the liquid to boiling, 8.8472 kW", "Boil it, 71.8176 kW of the dutyKW 85.8215 kW", "Superheat the vapour, 5.1567 kW", "designDutyKW, 98.6948 kW"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 27''s term table prints Boil it at 71.8176 kW and 0.8368 of the duty. Warming the liquid is 8.8472 kW at 0.1031 and superheating is 5.1567 kW at 0.0601; designDutyKW 98.6948 kW carries no share.' then 'old'
           when prompt = 'Which term of KANO''s vaporizer duty does the engine print at 0.8368 of the duty?' and options = '["Warm the liquid to boiling, 8.8472 kW", "Boil it, 71.8176 kW of the dutyKW 85.8215 kW", "Superheat the vapour, 5.1567 kW", "designDutyKW, 98.6948 kW"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The vaporizer lesson''s term table prints Boil it at 71.8176 kW and 0.8368 of the duty. Warming the liquid is 8.8472 kW at 0.1031 and superheating is 5.1567 kW at 0.0601; designDutyKW 98.6948 kW carries no share.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which term of KANO''s vaporizer duty does the engine print at 0.8368 of the duty?', options = '["Warm the liquid to boiling, 8.8472 kW", "Boil it, 71.8176 kW of the dutyKW 85.8215 kW", "Superheat the vapour, 5.1567 kW", "designDutyKW, 98.6948 kW"]'::jsonb, explanation = 'The vaporizer lesson''s term table prints Boil it at 71.8176 kW and 0.8368 of the duty. Warming the liquid is 8.8472 kW at 0.1031 and superheating is 5.1567 kW at 0.0601; designDutyKW 98.6948 kW carries no share.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 2
  select case
           when prompt = 'KANO''s vaporizer takes 650 kg/h with a design margin of 15 percent. What design duty does the engine give?' and options = '["85.8215 kW", "71.8176 kW", "8.8472 kW", "98.6948 kW"]'::jsonb and answer_index = 3 and explanation is not distinct from 'designDutyKW is dutyKW times one plus the margin percent over 100, and SECTION 27 prints it as 98.6948 kW. 85.8215 kW is dutyKW before the margin, 71.8176 kW the boil term alone, and 8.8472 kW the warming term.' then 'old'
           when prompt = 'KANO''s vaporizer takes 650 kg/h with a design margin of 15 percent. What design duty does the engine give?' and options = '["85.8215 kW", "71.8176 kW", "8.8472 kW", "98.6948 kW"]'::jsonb and answer_index = 3 and explanation is not distinct from 'designDutyKW is dutyKW times one plus the margin percent over 100, and the vaporizer lesson prints it as 98.6948 kW. 85.8215 kW is dutyKW before the margin, 71.8176 kW the boil term alone, and 8.8472 kW the warming term.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s vaporizer takes 650 kg/h with a design margin of 15 percent. What design duty does the engine give?', options = '["85.8215 kW", "71.8176 kW", "8.8472 kW", "98.6948 kW"]'::jsonb, explanation = 'designDutyKW is dutyKW times one plus the margin percent over 100, and the vaporizer lesson prints it as 98.6948 kW. 85.8215 kW is dutyKW before the margin, 71.8176 kW the boil term alone, and 8.8472 kW the warming term.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 3
  select case
           when prompt = 'KANO''s vaporizer duty is asked for with the boiling point left blank. Which result comes back?' and options = '["dutyKW 71.8176, with warming and superheat named as missing terms", "dutyKW 85.8215, on butane''s typical boiling point of -0.5 C", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed.", "designDutyKW 98.6948, with the boiling point taken at 38 C"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 27: with the boiling point left blank the engine gives the boil alone: dutyKW 71.8176, missingTerms Warm the liquid to boiling; Superheat the vapour, and a note that the duty is a floor. The latent heat refusal is the probe with no latent heat.' then 'old'
           when prompt = 'KANO''s vaporizer duty is asked for with the boiling point left blank. Which result comes back?' and options = '["dutyKW 71.8176, with warming and superheat named as missing terms", "dutyKW 85.8215, on butane''s typical boiling point of -0.5 C", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed.", "designDutyKW 98.6948, with the boiling point taken at 38 C"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The vaporizer lesson: with the boiling point left blank the engine gives the boil alone: dutyKW 71.8176, missingTerms Warm the liquid to boiling; Superheat the vapour, and a note that the duty is a floor. The latent heat refusal is the probe with no latent heat.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s vaporizer duty is asked for with the boiling point left blank. Which result comes back?', options = '["dutyKW 71.8176, with warming and superheat named as missing terms", "dutyKW 85.8215, on butane''s typical boiling point of -0.5 C", "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed.", "designDutyKW 98.6948, with the boiling point taken at 38 C"]'::jsonb, explanation = 'The vaporizer lesson: with the boiling point left blank the engine gives the boil alone: dutyKW 71.8176, missingTerms Warm the liquid to boiling; Superheat the vapour, and a note that the duty is a floor. The latent heat refusal is the probe with no latent heat.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 4
  select case
           when prompt = 'n-butane''s atmospheric boiling point of -0.5 C from LPG_REFERENCE is typed for KANO''s vaporizer, with the liquid entering at 18 C. What does the engine print?' and options = '["dutyKW 71.8176, the boil alone, with the engine''s note that the duty is a floor.", "REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense.", "REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C).", "A duty whose warming term is printed below zero kW."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 27 prints the refusal in full: "The liquid enters at 18 C, above the boiling point given (-0.5 C). A liquid above its boiling point is not liquid: give the boiling point at the vaporizer''s operating pressure." The boil alone is the blank boiling point; the condense refusal is the outlet at 30 C.' then 'old'
           when prompt = 'n-butane''s atmospheric boiling point of -0.5 C from LPG_REFERENCE is typed for KANO''s vaporizer, with the liquid entering at 18 C. What does the engine print?' and options = '["dutyKW 71.8176, the boil alone, with the engine''s note that the duty is a floor.", "REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense.", "REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C).", "A duty whose warming term is printed below zero kW."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The vaporizer lesson prints the refusal in full: "The liquid enters at 18 C, above the boiling point given (-0.5 C). A liquid above its boiling point is not liquid: give the boiling point at the vaporizer''s operating pressure." The boil alone is the blank boiling point; the condense refusal is the outlet at 30 C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'n-butane''s atmospheric boiling point of -0.5 C from LPG_REFERENCE is typed for KANO''s vaporizer, with the liquid entering at 18 C. What does the engine print?', options = '["dutyKW 71.8176, the boil alone, with the engine''s note that the duty is a floor.", "REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense.", "REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C).", "A duty whose warming term is printed below zero kW."]'::jsonb, explanation = 'The vaporizer lesson prints the refusal in full: "The liquid enters at 18 C, above the boiling point given (-0.5 C). A liquid above its boiling point is not liquid: give the boiling point at the vaporizer''s operating pressure." The boil alone is the blank boiling point; the condense refusal is the outlet at 30 C.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 5
  select case
           when prompt = 'KANO''s vaporizer is given a design margin of -5 percent. What comes back?' and options = '["designDutyKW equal to dutyKW, 85.8215 kW, the margin taken as zero.", "A design duty below the 85.8215 kW dutyKW.", "REFUSED: A latent heat of vaporisation is required.", "REFUSED: The design margin cannot be negative."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 27''s probe table prints "REFUSED: The design margin cannot be negative." for a margin of -5 percent. The margin is refused; it is neither taken as zero nor applied.' then 'old'
           when prompt = 'KANO''s vaporizer is given a design margin of -5 percent. What comes back?' and options = '["designDutyKW equal to dutyKW, 85.8215 kW, the margin taken as zero.", "A design duty below the 85.8215 kW dutyKW.", "REFUSED: A latent heat of vaporisation is required.", "REFUSED: The design margin cannot be negative."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The vaporizer lesson''s probe table prints "REFUSED: The design margin cannot be negative." for a margin of -5 percent. The margin is refused; it is neither taken as zero nor applied.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s vaporizer is given a design margin of -5 percent. What comes back?', options = '["designDutyKW equal to dutyKW, 85.8215 kW, the margin taken as zero.", "A design duty below the 85.8215 kW dutyKW.", "REFUSED: A latent heat of vaporisation is required.", "REFUSED: The design margin cannot be negative."]'::jsonb, explanation = 'The vaporizer lesson''s probe table prints "REFUSED: The design margin cannot be negative." for a margin of -5 percent. The margin is refused; it is neither taken as zero nor applied.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 6
  select case
           when prompt = 'How does vaporizerDuty form its Boil it term, before dividing by KJ_PER_KWH?' and options = '["The mass flow times the vapour heat capacity times (outlet less boiling point).", "The mass flow times the latent heat.", "The mass flow times the liquid heat capacity times (boiling point less inlet).", "dutyKW times one plus the margin percent over 100."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 27: boil it is the mass flow times the latent heat. The heat capacity products are the superheat and warming terms, and dutyKW times one plus the margin percent over 100 is designDutyKW.' then 'old'
           when prompt = 'How does vaporizerDuty form its Boil it term, before dividing by KJ_PER_KWH?' and options = '["The mass flow times the vapour heat capacity times (outlet less boiling point).", "The mass flow times the latent heat.", "The mass flow times the liquid heat capacity times (boiling point less inlet).", "dutyKW times one plus the margin percent over 100."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The vaporizer lesson: boil it is the mass flow times the latent heat. The heat capacity products are the superheat and warming terms, and dutyKW times one plus the margin percent over 100 is designDutyKW.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does vaporizerDuty form its Boil it term, before dividing by KJ_PER_KWH?', options = '["The mass flow times the vapour heat capacity times (outlet less boiling point).", "The mass flow times the latent heat.", "The mass flow times the liquid heat capacity times (boiling point less inlet).", "dutyKW times one plus the margin percent over 100."]'::jsonb, explanation = 'The vaporizer lesson: boil it is the mass flow times the latent heat. The heat capacity products are the superheat and warming terms, and dutyKW times one plus the margin percent over 100 is designDutyKW.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 7
  select case
           when prompt = 'On how many positions does the engine run KANO''s carousel queue, from 18 positions each available 0.92 of the time?' and options = '["17, 16.56 rounded to the nearest", "18, every position on the carousel", "16, the floor of the 16.56 positions working", "13, minimumPositionsForThroughput"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 28 prints effectivePositions 16.5600 and queuePositions 16: the queue runs on the positions wholly working, the floor of the positions times the availability. 17 is the positions rounded to the nearest whole one, which the digest names as the shortcut the engine does not take; 13 is minimumPositionsForThroughput.' then 'old'
           when prompt = 'On how many positions does the engine run KANO''s carousel queue, from 18 positions each available 0.92 of the time?' and options = '["17, 16.56 rounded to the nearest", "18, every position on the carousel", "16, the floor of the 16.56 positions working", "13, minimumPositionsForThroughput"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The carousel lesson prints effectivePositions 16.5600 and queuePositions 16: the queue runs on the positions wholly working, the floor of the positions times the availability. 17 is the positions rounded to the nearest whole one, which the course names as the shortcut the engine does not take; 13 is minimumPositionsForThroughput.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On how many positions does the engine run KANO''s carousel queue, from 18 positions each available 0.92 of the time?', options = '["17, 16.56 rounded to the nearest", "18, every position on the carousel", "16, the floor of the 16.56 positions working", "13, minimumPositionsForThroughput"]'::jsonb, explanation = 'The carousel lesson prints effectivePositions 16.5600 and queuePositions 16: the queue runs on the positions wholly working, the floor of the positions times the availability. 17 is the positions rounded to the nearest whole one, which the course names as the shortcut the engine does not take; 13 is minimumPositionsForThroughput.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 10
  select case
           when prompt = 'KANO''s carousel is run at availability 1 on 17 positions. What average wait does the digest print?' and options = '["0.0450 minutes", "0.0912 minutes", "0.0222 minutes", "0.9850 minutes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The whole-positions table prints 0.0912 minutes on 16, 0.0450 minutes on 17 and 0.0222 minutes on 18. 0.9850 minutes is the studio''s opening carousel.' then 'old'
           when prompt = 'KANO''s carousel is run at availability 1 on 17 positions. What average wait does the course print?' and options = '["0.0450 minutes", "0.0912 minutes", "0.0222 minutes", "0.9850 minutes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The whole-positions table prints 0.0912 minutes on 16, 0.0450 minutes on 17 and 0.0222 minutes on 18. 0.9850 minutes is the studio''s opening carousel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s carousel is run at availability 1 on 17 positions. What average wait does the course print?', options = '["0.0450 minutes", "0.0912 minutes", "0.0222 minutes", "0.9850 minutes"]'::jsonb, explanation = 'The whole-positions table prints 0.0912 minutes on 16, 0.0450 minutes on 17 and 0.0222 minutes on 18. 0.9850 minutes is the studio''s opening carousel.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 11
  select case
           when prompt = 'bottlingPlant is given one position at availability 0.4. What does it print?' and options = '["REFUSED: Only 0.4 positions are working on average: fewer than one.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "REFUSED: Demand, fill time and a position count are required and must be positive.", "A queue on one position, since a queue has a whole number of servers."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 28''s probe table prints "REFUSED: Only 0.4 positions are working on average: fewer than one." for this case. The other two refusals are for blank shift hours or availability 1.2, and for no fill time.' then 'old'
           when prompt = 'bottlingPlant is given one position at availability 0.4. What does it print?' and options = '["REFUSED: Only 0.4 positions are working on average: fewer than one.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "REFUSED: Demand, fill time and a position count are required and must be positive.", "A queue on one position, since a queue has a whole number of servers."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The carousel lesson''s probe table prints "REFUSED: Only 0.4 positions are working on average: fewer than one." for this case. The other two refusals are for blank shift hours or availability 1.2, and for no fill time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'bottlingPlant is given one position at availability 0.4. What does it print?', options = '["REFUSED: Only 0.4 positions are working on average: fewer than one.", "REFUSED: Shift hours must be positive and availability must lie in (0, 1].", "REFUSED: Demand, fill time and a position count are required and must be positive.", "A queue on one position, since a queue has a whole number of servers."]'::jsonb, explanation = 'The carousel lesson''s probe table prints "REFUSED: Only 0.4 positions are working on average: fewer than one." for this case. The other two refusals are for blank shift hours or availability 1.2, and for no fill time.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 12
  select case
           when prompt = 'Which two of the carousel probes print the same refusal?' and options = '["Availability 1.2, and one position at availability 0.4", "No fill time, and shift hours left blank", "Shift hours left blank, and availability 1.2", "One position at availability 0.4, and no fill time"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 28 prints "REFUSED: Shift hours must be positive and availability must lie in (0, 1]." for both shift hours left blank ('''') and availability 1.2. One position at 0.4 and no fill time each print a refusal of their own.' then 'old'
           when prompt = 'Which two of the carousel probes print the same refusal?' and options = '["Availability 1.2, and one position at availability 0.4", "No fill time, and shift hours left blank", "Shift hours left blank, and availability 1.2", "One position at availability 0.4, and no fill time"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The carousel lesson prints "REFUSED: Shift hours must be positive and availability must lie in (0, 1]." for both shift hours left blank ('''') and availability 1.2. One position at 0.4 and no fill time each print a refusal of their own.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which two of the carousel probes print the same refusal?', options = '["Availability 1.2, and one position at availability 0.4", "No fill time, and shift hours left blank", "Shift hours left blank, and availability 1.2", "One position at availability 0.4, and no fill time"]'::jsonb, explanation = 'The carousel lesson prints "REFUSED: Shift hours must be positive and availability must lie in (0, 1]." for both shift hours left blank ('''') and availability 1.2. One position at 0.4 and no fill time each print a refusal of their own.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-vaporizer-carousel-and-float ord 15
  select case
           when prompt = 'KANO''s cycle is put to assetFloat with the At the customer stage left blank. What does the engine print?' and options = '["A fleet sized on the other stages, with that stage in missingInputs.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: No duration for At the customer.", "REFUSED: The spares allowance cannot be negative."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 29 prints "REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it." The at least one stage refusal is the probe with no stages; the spares refusal is a negative spares allowance.' then 'old'
           when prompt = 'KANO''s cycle is put to assetFloat with the At the customer stage left blank. What does the engine print?' and options = '["A fleet sized on the other stages, with that stage in missingInputs.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: No duration for At the customer.", "REFUSED: The spares allowance cannot be negative."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The fleet lesson prints "REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it." The at least one stage refusal is the probe with no stages; the spares refusal is a negative spares allowance.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m02-vaporizer-carousel-and-float ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'KANO''s cycle is put to assetFloat with the At the customer stage left blank. What does the engine print?', options = '["A fleet sized on the other stages, with that stage in missingInputs.", "REFUSED: At least one cycle stage with a duration is required.", "REFUSED: No duration for At the customer.", "REFUSED: The spares allowance cannot be negative."]'::jsonb, explanation = 'The fleet lesson prints "REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it." The at least one stage refusal is the probe with no stages; the spares refusal is a negative spares allowance.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-vaporizer-carousel-and-float' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m02-vaporizer-carousel-and-float ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 1
  select case
           when prompt = 'What pressureBasis does lpgCng print on every CNG result?' and options = '["absolute (bar(a))", "gauge (bar(g))", "absolute (psia)", "gauge plus atmosphere (bar)"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 30: every pressure in lpgCng is absolute, and the engine says so on every CNG result: pressureBasis "absolute (bar(a))".' then 'old'
           when prompt = 'What pressureBasis does lpgCng print on every CNG result?' and options = '["absolute (bar(a))", "gauge (bar(g))", "absolute (psia)", "gauge plus atmosphere (bar)"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bank lesson: every pressure in lpgCng is absolute, and the engine says so on every CNG result: pressureBasis "absolute (bar(a))".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What pressureBasis does lpgCng print on every CNG result?', options = '["absolute (bar(a))", "gauge (bar(g))", "absolute (psia)", "gauge plus atmosphere (bar)"]'::jsonb, explanation = 'The bank lesson: every pressure in lpgCng is absolute, and the engine says so on every CNG result: pressureBasis "absolute (bar(a))".'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 4
  select case
           when prompt = 'Every IBAFO bank prints realVersusIdeal above one. What does the digest say that shows?' and options = '["Every bank holds less gas than the ideal gas law says.", "Every bank holds more gas than the ideal gas law says.", "Z is above one at these pressures, for every bank.", "The correlation is outside its range for every bank."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 30: at these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one). The three rows print correlationInRange true.' then 'old'
           when prompt = 'Every IBAFO bank prints realVersusIdeal above one. What does the course say that shows?' and options = '["Every bank holds less gas than the ideal gas law says.", "Every bank holds more gas than the ideal gas law says.", "Z is above one at these pressures, for every bank.", "The correlation is outside its range for every bank."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bank lesson: at these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one). The three rows print correlationInRange true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every IBAFO bank prints realVersusIdeal above one. What does the course say that shows?', options = '["Every bank holds less gas than the ideal gas law says.", "Every bank holds more gas than the ideal gas law says.", "Z is above one at these pressures, for every bank.", "The correlation is outside its range for every bank."]'::jsonb, explanation = 'The bank lesson: at these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one). The three rows print correlationInRange true.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 6
  select case
           when prompt = 'In m = P V M over Z R T, what does gasMassInVessel take as M?' and options = '["The gas''s specific gravity times the molar mass of air", "The specific gravity of 0.62 alone, as a ratio", "The molar mass of air, with the gravity put into Z", "The gas mass over the bank volume at 30 C"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 30: M is the gas''s molar mass, its specific gravity times the molar mass of air, in kg/kmol.' then 'old'
           when prompt = 'In m = P V M over Z R T, what does gasMassInVessel take as M?' and options = '["The gas''s specific gravity times the molar mass of air", "The specific gravity of 0.62 alone, as a ratio", "The molar mass of air, with the gravity put into Z", "The gas mass over the bank volume at 30 C"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bank lesson: M is the gas''s molar mass, its specific gravity times the molar mass of air, in kg/kmol.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In m = P V M over Z R T, what does gasMassInVessel take as M?', options = '["The gas''s specific gravity times the molar mass of air", "The specific gravity of 0.62 alone, as a ratio", "The molar mass of air, with the gravity put into Z", "The gas mass over the bank volume at 30 C"]'::jsonb, explanation = 'The bank lesson: M is the gas''s molar mass, its specific gravity times the molar mass of air, in kg/kmol.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 7
  select case
           when prompt = 'In what unit does the pressure P enter the mass equation in gasMassInVessel?' and options = '["bar(a), as typed", "psia, as bar(a) times PSI_PER_BAR", "bar, as the gauge plus 1.013", "Pa, as bar(a) times 100000"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 30: P is the pressure in Pa (bar(a) times 100000). Every pressure in lpgCng is absolute.' then 'old'
           when prompt = 'In what unit does the pressure P enter the mass equation in gasMassInVessel?' and options = '["bar(a), as typed", "psia, as bar(a) times PSI_PER_BAR", "bar, as the gauge plus 1.013", "Pa, as bar(a) times 100000"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bank lesson: P is the pressure in Pa (bar(a) times 100000). Every pressure in lpgCng is absolute.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In what unit does the pressure P enter the mass equation in gasMassInVessel?', options = '["bar(a), as typed", "psia, as bar(a) times PSI_PER_BAR", "bar, as the gauge plus 1.013", "Pa, as bar(a) times 100000"]'::jsonb, explanation = 'The bank lesson: P is the pressure in Pa (bar(a) times 100000). Every pressure in lpgCng is absolute.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 10
  select case
           when prompt = 'What range does DAK_RANGE print for the Dranchuk-Abou-Kassem correlation?' and options = '["ppr 0.2 to 30, tpr 1 to 3", "ppr 1 to 3, tpr 0.2 to 30", "ppr 0.2 to 3, tpr 1 to 30", "ppr 1 to 30, tpr 0.2 to 3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 30: DAK_RANGE: ppr 0.2 to 30, tpr 1 to 3. Outside it the engine still answers and says so.' then 'old'
           when prompt = 'What range does DAK_RANGE print for the Dranchuk-Abou-Kassem correlation?' and options = '["ppr 0.2 to 30, tpr 1 to 3", "ppr 1 to 3, tpr 0.2 to 30", "ppr 0.2 to 3, tpr 1 to 30", "ppr 1 to 30, tpr 0.2 to 3"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bank lesson: DAK_RANGE: ppr 0.2 to 30, tpr 1 to 3. Outside it the engine still answers and says so.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What range does DAK_RANGE print for the Dranchuk-Abou-Kassem correlation?', options = '["ppr 0.2 to 30, tpr 1 to 3", "ppr 1 to 3, tpr 0.2 to 30", "ppr 0.2 to 3, tpr 1 to 30", "ppr 1 to 30, tpr 0.2 to 3"]'::jsonb, explanation = 'The bank lesson: DAK_RANGE: ppr 0.2 to 30, tpr 1 to 3. Outside it the engine still answers and says so.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 11
  select case
           when prompt = 'IBAFO''s Low bank is run at -80 C. What does gasMassInVessel do?' and options = '["REFUSED: A temperature is required.", "It answers with tpr held at 1, the bottom of DAK_RANGE, so that correlationInRange reads true for the bank.", "It refuses the bank, since tpr 0.9727 lies below the range the correlation was fitted over.", "It answers, with correlationInRange false and a note calling the value an extrapolation."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 30 prints the probe with tpr 0.9727, correlationInRange false, and the note "Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data." Outside the range the engine still answers.' then 'old'
           when prompt = 'IBAFO''s Low bank is run at -80 C. What does gasMassInVessel do?' and options = '["REFUSED: A temperature is required.", "It answers with tpr held at 1, the bottom of DAK_RANGE, so that correlationInRange reads true for the bank.", "It refuses the bank, since tpr 0.9727 lies below the range the correlation was fitted over.", "It answers, with correlationInRange false and a note calling the value an extrapolation."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bank lesson prints the probe with tpr 0.9727, correlationInRange false, and the note "Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data." Outside the range the engine still answers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s Low bank is run at -80 C. What does gasMassInVessel do?', options = '["REFUSED: A temperature is required.", "It answers with tpr held at 1, the bottom of DAK_RANGE, so that correlationInRange reads true for the bank.", "It refuses the bank, since tpr 0.9727 lies below the range the correlation was fitted over.", "It answers, with correlationInRange false and a note calling the value an extrapolation."]'::jsonb, explanation = 'The bank lesson prints the probe with tpr 0.9727, correlationInRange false, and the note "Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data." Outside the range the engine still answers.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 12
  select case
           when prompt = 'Which Z method does gasMassInVessel use for massKg?' and options = '["Sutton on Dranchuk-Abou-Kassem pseudo-criticals", "Dranchuk-Abou-Kassem on Sutton pseudo-criticals", "Z taken as one, the ideal gas law", "Dranchuk-Abou-Kassem on the gauge pressure"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 30: Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. Z taken as one is how the engine forms idealMassKg, which it prints beside massKg; the pressures are absolute.' then 'old'
           when prompt = 'Which Z method does gasMassInVessel use for massKg?' and options = '["Sutton on Dranchuk-Abou-Kassem pseudo-criticals", "Dranchuk-Abou-Kassem on Sutton pseudo-criticals", "Z taken as one, the ideal gas law", "Dranchuk-Abou-Kassem on the gauge pressure"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bank lesson: Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. Z taken as one is how the engine forms idealMassKg, which it prints beside massKg; the pressures are absolute.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which Z method does gasMassInVessel use for massKg?', options = '["Sutton on Dranchuk-Abou-Kassem pseudo-criticals", "Dranchuk-Abou-Kassem on Sutton pseudo-criticals", "Z taken as one, the ideal gas law", "Dranchuk-Abou-Kassem on the gauge pressure"]'::jsonb, explanation = 'The bank lesson: Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. Z taken as one is how the engine forms idealMassKg, which it prints beside massKg; the pressures are absolute.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 13
  select case
           when prompt = 'IBAFO''s bank is put to gasMassInVessel with the gas gravity left blank (''''). What does the engine print?' and options = '["REFUSED: A pressure is required.", "The mass on air''s molar mass, the gravity taken as one.", "REFUSED: A gas specific gravity is required.", "REFUSED: A temperature is required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 30''s probe table prints "REFUSED: A gas specific gravity is required." for a blank gas gravity. The pressure and temperature refusals are the probes with no pressure and no temperature.' then 'old'
           when prompt = 'IBAFO''s bank is put to gasMassInVessel with the gas gravity left blank (''''). What does the engine print?' and options = '["REFUSED: A pressure is required.", "The mass on air''s molar mass, the gravity taken as one.", "REFUSED: A gas specific gravity is required.", "REFUSED: A temperature is required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bank lesson''s probe table prints "REFUSED: A gas specific gravity is required." for a blank gas gravity. The pressure and temperature refusals are the probes with no pressure and no temperature.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s bank is put to gasMassInVessel with the gas gravity left blank (''''). What does the engine print?', options = '["REFUSED: A pressure is required.", "The mass on air''s molar mass, the gravity taken as one.", "REFUSED: A gas specific gravity is required.", "REFUSED: A temperature is required."]'::jsonb, explanation = 'The bank lesson''s probe table prints "REFUSED: A gas specific gravity is required." for a blank gas gravity. The pressure and temperature refusals are the probes with no pressure and no temperature.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-gas-in-a-bank ord 14
  select case
           when prompt = 'gasMassInVessel prints idealMassKg beside massKg on every bank. What is idealMassKg?' and options = '["The mass at the gauge reading typed as absolute", "The same mass with Z taken as one", "The mass the bank gives up to the cascade", "The mass on the specific gravity alone, M taken as 0.62"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 30: the ideal mass is the same m = P V M over Z R T with Z taken as one. The gauge reading typed as absolute is its own row of the gauge table, and M is the specific gravity times the molar mass of air.' then 'old'
           when prompt = 'gasMassInVessel prints idealMassKg beside massKg on every bank. What is idealMassKg?' and options = '["The mass at the gauge reading typed as absolute", "The same mass with Z taken as one", "The mass the bank gives up to the cascade", "The mass on the specific gravity alone, M taken as 0.62"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bank lesson: the ideal mass is the same m = P V M over Z R T with Z taken as one. The gauge reading typed as absolute is its own row of the gauge table, and M is the specific gravity times the molar mass of air.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m03-gas-in-a-bank ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'gasMassInVessel prints idealMassKg beside massKg on every bank. What is idealMassKg?', options = '["The mass at the gauge reading typed as absolute", "The same mass with Z taken as one", "The mass the bank gives up to the cascade", "The mass on the specific gravity alone, M taken as 0.62"]'::jsonb, explanation = 'The bank lesson: the ideal mass is the same m = P V M over Z R T with Z taken as one. The gauge reading typed as absolute is its own row of the gauge table, and M is the specific gravity times the molar mass of air.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-gas-in-a-bank' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m03-gas-in-a-bank ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 1
  select case
           when prompt = 'IBAFO''s cascade counts 38 fills and stops. What does it print for hitFillLimit and for the next vehicle?' and options = '["hitFillLimit true; the maxFills cap was reached at 38", "hitFillLimit false; next vehicle reaches 197.7590 bar(a)", "hitFillLimit false; the next vehicle reaches 195.5640 bar(a)", "hitFillLimit true; the next vehicle reaches 197.7590 bar(a)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 31 prints hitFillLimit false and nextVehicleReachesBar 197.7590: hitFillLimit reads true only when the count reaches the maxFills cap the call carries, and here it stopped on a vehicle that could not reach its target. 195.5640 bar(a) is the studio''s opening cascade.' then 'old'
           when prompt = 'IBAFO''s cascade counts 38 fills and stops. What does it print for hitFillLimit and for the next vehicle?' and options = '["hitFillLimit true; the maxFills cap was reached at 38", "hitFillLimit false; next vehicle reaches 197.7590 bar(a)", "hitFillLimit false; the next vehicle reaches 195.5640 bar(a)", "hitFillLimit true; the next vehicle reaches 197.7590 bar(a)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The cascade lesson prints hitFillLimit false and nextVehicleReachesBar 197.7590: hitFillLimit reads true only when the count reaches the maxFills cap the call carries, and here it stopped on a vehicle that could not reach its target. 195.5640 bar(a) is the studio''s opening cascade.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s cascade counts 38 fills and stops. What does it print for hitFillLimit and for the next vehicle?', options = '["hitFillLimit true; the maxFills cap was reached at 38", "hitFillLimit false; next vehicle reaches 197.7590 bar(a)", "hitFillLimit false; the next vehicle reaches 195.5640 bar(a)", "hitFillLimit true; the next vehicle reaches 197.7590 bar(a)"]'::jsonb, explanation = 'The cascade lesson prints hitFillLimit false and nextVehicleReachesBar 197.7590: hitFillLimit reads true only when the count reaches the maxFills cap the call carries, and here it stopped on a vehicle that could not reach its target. 195.5640 bar(a) is the studio''s opening cascade.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 7
  select case
           when prompt = 'What does the digest say of the heat of a fast fill in the cascade?' and options = '["It is not modelled; the count is a ceiling in that one respect.", "It is modelled, and it brings the count down from 38 fills to 33.", "It is taken from the Facilities compression engine''s discharge.", "It raises the count, so 38 is a floor."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 31: both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. 33 is the studio''s opening cascade.' then 'old'
           when prompt = 'What does the course say of the heat of a fast fill in the cascade?' and options = '["It is not modelled; the count is a ceiling in that one respect.", "It is modelled, and it brings the count down from 38 fills to 33.", "It is taken from the Facilities compression engine''s discharge.", "It raises the count, so 38 is a floor."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The cascade lesson: both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. 33 is the studio''s opening cascade.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course say of the heat of a fast fill in the cascade?', options = '["It is not modelled; the count is a ceiling in that one respect.", "It is modelled, and it brings the count down from 38 fills to 33.", "It is taken from the Facilities compression engine''s discharge.", "It raises the count, so 38 is a floor."]'::jsonb, explanation = 'The cascade lesson: both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. 33 is the studio''s opening cascade.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 8
  select case
           when prompt = 'Which storedKg does IBAFO''s cascade print, and what does the digest print beside it?' and options = '["608.505 kg, the same as the Low, Mid and High bank masses summed", "665.879 kg, the same as the Low, Mid and High bank masses summed", "1084.729 kg, the same as the Low, Mid and High bank masses summed", "1274.384 kg, the same as the Low, Mid and High bank masses summed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The cascade table prints storedKg 1274.384 and, beside it, the Low, Mid and High bank masses summed (SECTION 30) as 1274.384. storedKg minus deliveredKg minus leftInBanksKg prints 0.000.' then 'old'
           when prompt = 'Which storedKg does IBAFO''s cascade print, and what does the course print beside it?' and options = '["608.505 kg, the same as the Low, Mid and High bank masses summed", "665.879 kg, the same as the Low, Mid and High bank masses summed", "1084.729 kg, the same as the Low, Mid and High bank masses summed", "1274.384 kg, the same as the Low, Mid and High bank masses summed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The cascade table prints storedKg 1274.384 and, beside it, the Low, Mid and High bank masses summed (the bank lesson) as 1274.384. storedKg minus deliveredKg minus leftInBanksKg prints 0.000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which storedKg does IBAFO''s cascade print, and what does the course print beside it?', options = '["608.505 kg, the same as the Low, Mid and High bank masses summed", "665.879 kg, the same as the Low, Mid and High bank masses summed", "1084.729 kg, the same as the Low, Mid and High bank masses summed", "1274.384 kg, the same as the Low, Mid and High bank masses summed"]'::jsonb, explanation = 'The cascade table prints storedKg 1274.384 and, beside it, the Low, Mid and High bank masses summed (the bank lesson) as 1274.384. storedKg minus deliveredKg minus leftInBanksKg prints 0.000.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 9
  select case
           when prompt = 'What does cngCompression do with the Facilities compression engine?' and options = '["It reimplements that engine''s staging in the station''s own metric units.", "It converts units to and from the field units that engine speaks, and calls it.", "It computes the polytropic head itself and hands only the Z on to that engine.", "It checks that engine''s thermodynamics by an oracle of its own."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 32: cngCompression does not compute compression itself. It converts the station''s metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. Its basis reads that it converts units and does not reimplement the thermodynamics, and SECTION 32 says the thermodynamics belong to the Facilities course.' then 'old'
           when prompt = 'What does cngCompression do with the Facilities compression engine?' and options = '["It reimplements that engine''s staging in the station''s own metric units.", "It converts units to and from the field units that engine speaks, and calls it.", "It computes the polytropic head itself and hands only the Z on to that engine.", "It checks that engine''s thermodynamics by an oracle of its own."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The compressor lesson: cngCompression does not compute compression itself. It converts the station''s metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. Its basis reads that it converts units and does not reimplement the thermodynamics, and the compressor lesson says the thermodynamics belong to the Facilities course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does cngCompression do with the Facilities compression engine?', options = '["It reimplements that engine''s staging in the station''s own metric units.", "It converts units to and from the field units that engine speaks, and calls it.", "It computes the polytropic head itself and hands only the Z on to that engine.", "It checks that engine''s thermodynamics by an oracle of its own."]'::jsonb, explanation = 'The compressor lesson: cngCompression does not compute compression itself. It converts the station''s metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. Its basis reads that it converts units and does not reimplement the thermodynamics, and the compressor lesson says the thermodynamics belong to the Facilities course.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 11
  select case
           when prompt = 'How many stages does the Facilities engine return for IBAFO''s compressor, and at what ratio each?' and options = '["3 stages, each at 2.6723", "4 stages, each at 13.3620", "2 stages, each at 35.7070", "4 stages, each at 2.6723"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 32 prints stageCount 4 and a ratio of 2.6723 on every stage, from 5.0000 to 255.0000 bar(a). 13.3620 and 35.7070 are stage discharge pressures in bar(a).' then 'old'
           when prompt = 'How many stages does the Facilities engine return for IBAFO''s compressor, and at what ratio each?' and options = '["3 stages, each at 2.6723", "4 stages, each at 13.3620", "2 stages, each at 35.7070", "4 stages, each at 2.6723"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The compressor lesson prints stageCount 4 and a ratio of 2.6723 on every stage, from 5.0000 to 255.0000 bar(a). 13.3620 and 35.7070 are stage discharge pressures in bar(a).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many stages does the Facilities engine return for IBAFO''s compressor, and at what ratio each?', options = '["3 stages, each at 2.6723", "4 stages, each at 13.3620", "2 stages, each at 35.7070", "4 stages, each at 2.6723"]'::jsonb, explanation = 'The compressor lesson prints stageCount 4 and a ratio of 2.6723 on every stage, from 5.0000 to 255.0000 bar(a). 13.3620 and 35.7070 are stage discharge pressures in bar(a).'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 12
  select case
           when prompt = 'cngCompression is given a discharge below its suction. What does it print?' and options = '["REFUSED: A start and a higher target pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A suction pressure and a higher discharge pressure are required.", "A train with a single stage whose ratio is below one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 32''s probe table prints this refusal for discharge below suction. The start and target refusal is the cascade''s (SECTION 31); the throughput refusal is the probe with no throughput.' then 'old'
           when prompt = 'cngCompression is given a discharge below its suction. What does it print?' and options = '["REFUSED: A start and a higher target pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A suction pressure and a higher discharge pressure are required.", "A train with a single stage whose ratio is below one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The compressor lesson''s probe table prints this refusal for discharge below suction. The start and target refusal is the cascade''s (the cascade lesson); the throughput refusal is the probe with no throughput.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'cngCompression is given a discharge below its suction. What does it print?', options = '["REFUSED: A start and a higher target pressure are required.", "REFUSED: A throughput is required.", "REFUSED: A suction pressure and a higher discharge pressure are required.", "A train with a single stage whose ratio is below one."]'::jsonb, explanation = 'The compressor lesson''s probe table prints this refusal for discharge below suction. The start and target refusal is the cascade''s (the cascade lesson); the throughput refusal is the probe with no throughput.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 13
  select case
           when prompt = 'IBAFO''s forecourt takes 14 buses an hour at 6 minutes a fill. What average wait does it give on 3 dispensers?' and options = '["5.7647 minutes", "0.5765 minutes", "0.7588 minutes", "0.2024 minutes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 33 prints averageWaitMinutes 5.7647 on 2 dispensers and 0.7588 on 3. 0.5765 and 0.2024 are the probabilityOfWaiting on 2 and on 3.' then 'old'
           when prompt = 'IBAFO''s forecourt takes 14 buses an hour at 6 minutes a fill. What average wait does it give on 3 dispensers?' and options = '["5.7647 minutes", "0.5765 minutes", "0.7588 minutes", "0.2024 minutes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The forecourt lesson prints averageWaitMinutes 5.7647 on 2 dispensers and 0.7588 on 3. 0.5765 and 0.2024 are the probabilityOfWaiting on 2 and on 3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s forecourt takes 14 buses an hour at 6 minutes a fill. What average wait does it give on 3 dispensers?', options = '["5.7647 minutes", "0.5765 minutes", "0.7588 minutes", "0.2024 minutes"]'::jsonb, explanation = 'The forecourt lesson prints averageWaitMinutes 5.7647 on 2 dispensers and 0.7588 on 3. 0.5765 and 0.2024 are the probabilityOfWaiting on 2 and on 3.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 14
  select case
           when prompt = 'IBAFO''s forecourt is run at 25 buses an hour on 2 dispensers. What does cngDispensing return?' and options = '["REFUSED: The number of bays must be a whole number, one or more.", "An average wait that grows with the 1.2500 utilisation", "An answer: stable false and utilisation 1.2500", "REFUSED: Arrivals, fill time and a dispenser count are required and must be positive."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 33: at 25 buses an hour on 2 dispensers the engine gives an answer and no refusal: stable false, utilisation 1.2500, and the message that no average waiting time exists.' then 'old'
           when prompt = 'IBAFO''s forecourt is run at 25 buses an hour on 2 dispensers. What does cngDispensing return?' and options = '["REFUSED: The number of bays must be a whole number, one or more.", "An average wait that grows with the 1.2500 utilisation", "An answer: stable false and utilisation 1.2500", "REFUSED: Arrivals, fill time and a dispenser count are required and must be positive."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The forecourt lesson: at 25 buses an hour on 2 dispensers the engine gives an answer and no refusal: stable false, utilisation 1.2500, and the message that no average waiting time exists.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s forecourt is run at 25 buses an hour on 2 dispensers. What does cngDispensing return?', options = '["REFUSED: The number of bays must be a whole number, one or more.", "An average wait that grows with the 1.2500 utilisation", "An answer: stable false and utilisation 1.2500", "REFUSED: Arrivals, fill time and a dispenser count are required and must be positive."]'::jsonb, explanation = 'The forecourt lesson: at 25 buses an hour on 2 dispensers the engine gives an answer and no refusal: stable false, utilisation 1.2500, and the message that no average waiting time exists.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-cascade ord 15
  select case
           when prompt = 'cngDispensing is asked for 2.5 dispensers. What comes back?' and options = '["The queue on 2 dispensers, with 2.5 rounded down to a whole number of bays.", "REFUSED: The number of bays must be a whole number, one or more.", "The queue on 3 dispensers, with 2.5 rounded to the nearest whole bay.", "A queue on 2.5 dispensers, the count taken exactly as it was typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 33''s probe table prints "REFUSED: The number of bays must be a whole number, one or more." for 2.5 dispensers.' then 'old'
           when prompt = 'cngDispensing is asked for 2.5 dispensers. What comes back?' and options = '["The queue on 2 dispensers, with 2.5 rounded down to a whole number of bays.", "REFUSED: The number of bays must be a whole number, one or more.", "The queue on 3 dispensers, with 2.5 rounded to the nearest whole bay.", "A queue on 2.5 dispensers, the count taken exactly as it was typed."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The forecourt lesson''s probe table prints "REFUSED: The number of bays must be a whole number, one or more." for 2.5 dispensers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m04-the-cascade ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'cngDispensing is asked for 2.5 dispensers. What comes back?', options = '["The queue on 2 dispensers, with 2.5 rounded down to a whole number of bays.", "REFUSED: The number of bays must be a whole number, one or more.", "The queue on 3 dispensers, with 2.5 rounded to the nearest whole bay.", "A queue on 2.5 dispensers, the count taken exactly as it was typed."]'::jsonb, explanation = 'The forecourt lesson''s probe table prints "REFUSED: The number of bays must be a whole number, one or more." for 2.5 dispensers.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-cascade' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m04-the-cascade ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 1
  select case
           when prompt = 'No CNG consumption is measured for the Lagos bus. What consumption on CNG does conversionEconomics use, and from what source?' and options = '["9.5 kg per 100 km, as measured", "11.6667 kg per 100 km, derived from energy equivalence", "10.1449 kg per 100 km, derived from energy equivalence", "9.3333 kg per 100 km, derived from energy equivalence"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 34 prints consumptionSource derived from energy equivalence and newFuelConsumptionPer100Km 10.1449 kg at the efficiency ratio of 0.92. 11.6667 kg is the ratio of 0.8 and 9.3333 kg the ratio of 1; 9.5 kg is the measured consumption of the separate probe.' then 'old'
           when prompt = 'No CNG consumption is measured for the Lagos bus. What consumption on CNG does conversionEconomics use, and from what source?' and options = '["9.5 kg per 100 km, as measured", "11.6667 kg per 100 km, derived from energy equivalence", "10.1449 kg per 100 km, derived from energy equivalence", "9.3333 kg per 100 km, derived from energy equivalence"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bus switch lesson prints consumptionSource derived from energy equivalence and newFuelConsumptionPer100Km 10.1449 kg at the efficiency ratio of 0.92. 11.6667 kg is the ratio of 0.8 and 9.3333 kg the ratio of 1; 9.5 kg is the measured consumption of the separate probe.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'No CNG consumption is measured for the Lagos bus. What consumption on CNG does conversionEconomics use, and from what source?', options = '["9.5 kg per 100 km, as measured", "11.6667 kg per 100 km, derived from energy equivalence", "10.1449 kg per 100 km, derived from energy equivalence", "9.3333 kg per 100 km, derived from energy equivalence"]'::jsonb, explanation = 'The bus switch lesson prints consumptionSource derived from energy equivalence and newFuelConsumptionPer100Km 10.1449 kg at the efficiency ratio of 0.92. 11.6667 kg is the ratio of 0.8 and 9.3333 kg the ratio of 1; 9.5 kg is the measured consumption of the separate probe.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 2
  select case
           when prompt = 'How does the engine derive the CNG consumption when none is measured?' and options = '["PMS consumption times PMS energy, over CNG energy times the efficiency ratio", "PMS consumption times CNG energy, over PMS energy times the efficiency ratio", "PMS consumption times PMS energy times the efficiency ratio, over CNG energy", "PMS consumption over the efficiency ratio, on the litres of PMS"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 34 prints the check row PMS consumption x PMS energy over (CNG energy x efficiency ratio) as 10.1449, the same as newFuelConsumptionPer100Km.' then 'old'
           when prompt = 'How does the engine derive the CNG consumption when none is measured?' and options = '["PMS consumption times PMS energy, over CNG energy times the efficiency ratio", "PMS consumption times CNG energy, over PMS energy times the efficiency ratio", "PMS consumption times PMS energy times the efficiency ratio, over CNG energy", "PMS consumption over the efficiency ratio, on the litres of PMS"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bus switch lesson prints the check row PMS consumption x PMS energy over (CNG energy x efficiency ratio) as 10.1449, the same as newFuelConsumptionPer100Km.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the engine derive the CNG consumption when none is measured?', options = '["PMS consumption times PMS energy, over CNG energy times the efficiency ratio", "PMS consumption times CNG energy, over PMS energy times the efficiency ratio", "PMS consumption times PMS energy times the efficiency ratio, over CNG energy", "PMS consumption over the efficiency ratio, on the litres of PMS"]'::jsonb, explanation = 'The bus switch lesson prints the check row PMS consumption x PMS energy over (CNG energy x efficiency ratio) as 10.1449, the same as newFuelConsumptionPer100Km.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 3
  select case
           when prompt = 'What cost per kilometre on CNG does the engine print for the Lagos bus?' and options = '["109.2000 naira", "38.5507 naira", "69.5584 naira", "10.1449 naira"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 34 prints CNG cost per km 38.5507 and PMS cost per km 109.2000; savingPerKm is 69.5584. 10.1449 is the CNG consumption in kg per 100 km.' then 'old'
           when prompt = 'What cost per kilometre on CNG does the engine print for the Lagos bus?' and options = '["109.2000 naira", "38.5507 naira", "69.5584 naira", "10.1449 naira"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bus switch lesson prints CNG cost per km 38.5507 and PMS cost per km 109.2000; savingPerKm is 69.5584. 10.1449 is the CNG consumption in kg per 100 km.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What cost per kilometre on CNG does the engine print for the Lagos bus?', options = '["109.2000 naira", "38.5507 naira", "69.5584 naira", "10.1449 naira"]'::jsonb, explanation = 'The bus switch lesson prints CNG cost per km 38.5507 and PMS cost per km 109.2000; savingPerKm is 69.5584. 10.1449 is the CNG consumption in kg per 100 km.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 4
  select case
           when prompt = 'At the efficiency ratio of 0.92, what annualSaving after maintenance does the engine give?' and options = '["3507666.6700 naira", "3995333.3300 naira", "6006000.0000 naira", "3825710.1400 naira"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 34 prints annualSaving (after maintenance) 3825710.1400. 3507666.6700 is the ratio of 0.8 and 3995333.3300 the ratio of 1; 6006000.0000 is the PMS cost a year.' then 'old'
           when prompt = 'At the efficiency ratio of 0.92, what annualSaving after maintenance does the engine give?' and options = '["3507666.6700 naira", "3995333.3300 naira", "6006000.0000 naira", "3825710.1400 naira"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bus switch lesson prints annualSaving (after maintenance) 3825710.1400. 3507666.6700 is the ratio of 0.8 and 3995333.3300 the ratio of 1; 6006000.0000 is the PMS cost a year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the efficiency ratio of 0.92, what annualSaving after maintenance does the engine give?', options = '["3507666.6700 naira", "3995333.3300 naira", "6006000.0000 naira", "3825710.1400 naira"]'::jsonb, explanation = 'The bus switch lesson prints annualSaving (after maintenance) 3825710.1400. 3507666.6700 is the ratio of 0.8 and 3995333.3300 the ratio of 1; 6006000.0000 is the PMS cost a year.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 5
  select case
           when prompt = 'At the efficiency ratio of 0.92, what simple payback does conversionEconomics print?' and options = '["0.3421 years", "0.3004 years", "0.3137 years", "0.3030 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 34 prints simplePaybackYears 0.3137, and the check row conversion cost over annualSaving as 0.3137. 0.3421 is the ratio of 0.8, 0.3004 the ratio of 1, and 0.3030 the measured consumption of 9.5 kg per 100 km.' then 'old'
           when prompt = 'At the efficiency ratio of 0.92, what simple payback does conversionEconomics print?' and options = '["0.3421 years", "0.3004 years", "0.3137 years", "0.3030 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bus switch lesson prints simplePaybackYears 0.3137, and the check row conversion cost over annualSaving as 0.3137. 0.3421 is the ratio of 0.8, 0.3004 the ratio of 1, and 0.3030 the measured consumption of 9.5 kg per 100 km.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the efficiency ratio of 0.92, what simple payback does conversionEconomics print?', options = '["0.3421 years", "0.3004 years", "0.3137 years", "0.3030 years"]'::jsonb, explanation = 'The bus switch lesson prints simplePaybackYears 0.3137, and the check row conversion cost over annualSaving as 0.3137. 0.3421 is the ratio of 0.8, 0.3004 the ratio of 1, and 0.3030 the measured consumption of 9.5 kg per 100 km.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 6
  select case
           when prompt = 'A measured CNG consumption of 9.5 kg per 100 km is given to the engine. What does it do?' and options = '["It uses it: consumptionSource as measured, simplePaybackYears 0.3030", "It derives 10.1449 kg from energy equivalence and sets the 9.5 aside", "It uses it: consumptionSource as measured, simplePaybackYears 0.3137", "It keeps the derived consumptionSource, with payback 0.3030"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 34: with a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource "as measured", simplePaybackYears 0.3030. 0.3137 is the payback on the derived consumption.' then 'old'
           when prompt = 'A measured CNG consumption of 9.5 kg per 100 km is given to the engine. What does it do?' and options = '["It uses it: consumptionSource as measured, simplePaybackYears 0.3030", "It derives 10.1449 kg from energy equivalence and sets the 9.5 aside", "It uses it: consumptionSource as measured, simplePaybackYears 0.3137", "It keeps the derived consumptionSource, with payback 0.3030"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bus switch lesson: with a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource "as measured", simplePaybackYears 0.3030. 0.3137 is the payback on the derived consumption.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A measured CNG consumption of 9.5 kg per 100 km is given to the engine. What does it do?', options = '["It uses it: consumptionSource as measured, simplePaybackYears 0.3030", "It derives 10.1449 kg from energy equivalence and sets the 9.5 aside", "It uses it: consumptionSource as measured, simplePaybackYears 0.3137", "It keeps the derived consumptionSource, with payback 0.3030"]'::jsonb, explanation = 'The bus switch lesson: with a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource "as measured", simplePaybackYears 0.3030. 0.3137 is the payback on the derived consumption.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 7
  select case
           when prompt = 'CNG is priced at 1100 naira a kg for the same bus. What does conversionEconomics return?' and options = '["annualSaving 3825710.1400 and simplePaybackYears 0.3137", "annualSaving -191681.1600 and a simplePaybackYears of 0.3137", "annualSaving -191681.1600, with simplePaybackYears null", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 34: with CNG at 1100 naira a kg there is no saving: annualSaving -191681.1600, simplePaybackYears null, and the note "The conversion does not save money at these prices, so there is no payback to report."' then 'old'
           when prompt = 'CNG is priced at 1100 naira a kg for the same bus. What does conversionEconomics return?' and options = '["annualSaving 3825710.1400 and simplePaybackYears 0.3137", "annualSaving -191681.1600 and a simplePaybackYears of 0.3137", "annualSaving -191681.1600, with simplePaybackYears null", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bus switch lesson: with CNG at 1100 naira a kg there is no saving: annualSaving -191681.1600, simplePaybackYears null, and the note "The conversion does not save money at these prices, so there is no payback to report."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'CNG is priced at 1100 naira a kg for the same bus. What does conversionEconomics return?', options = '["annualSaving 3825710.1400 and simplePaybackYears 0.3137", "annualSaving -191681.1600 and a simplePaybackYears of 0.3137", "annualSaving -191681.1600, with simplePaybackYears null", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb, explanation = 'The bus switch lesson: with CNG at 1100 naira a kg there is no saving: annualSaving -191681.1600, simplePaybackYears null, and the note "The conversion does not save money at these prices, so there is no payback to report."'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 8
  select case
           when prompt = 'What does conversionEconomics print as its paybackNote?' and options = '["Simple payback is discounted at the case''s own stated rate, and the cash flow is handed on already discounted.", "Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine.", "The conversion does not save money at these prices, so there is no payback to report.", "Simple payback is undiscounted, and it is taken from the fuel cost alone, before maintenance."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 34 prints the paybackNote verbatim. The no saving sentence is the note at 1100 naira a kg; annualSaving is printed after maintenance.' then 'old'
           when prompt = 'What does conversionEconomics print as its paybackNote?' and options = '["Simple payback is discounted at the case''s own stated rate, and the cash flow is handed on already discounted.", "Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine.", "The conversion does not save money at these prices, so there is no payback to report.", "Simple payback is undiscounted, and it is taken from the fuel cost alone, before maintenance."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bus switch lesson prints the paybackNote verbatim. The no saving sentence is the note at 1100 naira a kg; annualSaving is printed after maintenance.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does conversionEconomics print as its paybackNote?', options = '["Simple payback is discounted at the case''s own stated rate, and the cash flow is handed on already discounted.", "Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine.", "The conversion does not save money at these prices, so there is no payback to report.", "Simple payback is undiscounted, and it is taken from the fuel cost alone, before maintenance."]'::jsonb, explanation = 'The bus switch lesson prints the paybackNote verbatim. The no saving sentence is the note at 1100 naira a kg; annualSaving is printed after maintenance.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 9
  select case
           when prompt = 'What annual cash flow does conversionEconomics hand on for the Lagos bus?' and options = '["year0 -1200000.0000, recurring 3825710.1400", "year0 -1200000.0000, recurring 2120289.8600", "year0 -1200000.0000, recurring 6006000.0000", "year0 -1200000.0000, recurring 3995333.3300"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 34 prints annualCashFlow year0 -1200000.0000 and recurring 3825710.1400. 2120289.8600 is the CNG cost a year, 6006000.0000 the PMS cost a year, and 3995333.3300 the annualSaving at an efficiency ratio of 1.' then 'old'
           when prompt = 'What annual cash flow does conversionEconomics hand on for the Lagos bus?' and options = '["year0 -1200000.0000, recurring 3825710.1400", "year0 -1200000.0000, recurring 2120289.8600", "year0 -1200000.0000, recurring 6006000.0000", "year0 -1200000.0000, recurring 3995333.3300"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The bus switch lesson prints annualCashFlow year0 -1200000.0000 and recurring 3825710.1400. 2120289.8600 is the CNG cost a year, 6006000.0000 the PMS cost a year, and 3995333.3300 the annualSaving at an efficiency ratio of 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What annual cash flow does conversionEconomics hand on for the Lagos bus?', options = '["year0 -1200000.0000, recurring 3825710.1400", "year0 -1200000.0000, recurring 2120289.8600", "year0 -1200000.0000, recurring 6006000.0000", "year0 -1200000.0000, recurring 3995333.3300"]'::jsonb, explanation = 'The bus switch lesson prints annualCashFlow year0 -1200000.0000 and recurring 3825710.1400. 2120289.8600 is the CNG cost a year, 6006000.0000 the PMS cost a year, and 3995333.3300 the annualSaving at an efficiency ratio of 1.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 10
  select case
           when prompt = 'No measured CNG consumption is given and the efficiency ratio is left blank. What does the engine print?' and options = '["A consumption derived at an efficiency ratio of 1, 9.3333 kg per 100 km", "A consumption derived at the 0.92 ratio, 10.1449 kg per 100 km", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 34''s probe table prints this refusal, which ends "Neither is assumed." The other refusal is the probe with no annual distance.' then 'old'
           when prompt = 'No measured CNG consumption is given and the efficiency ratio is left blank. What does the engine print?' and options = '["A consumption derived at an efficiency ratio of 1, 9.3333 kg per 100 km", "A consumption derived at the 0.92 ratio, 10.1449 kg per 100 km", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bus switch lesson''s probe table prints this refusal, which ends "Neither is assumed." The other refusal is the probe with no annual distance.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'No measured CNG consumption is given and the efficiency ratio is left blank. What does the engine print?', options = '["A consumption derived at an efficiency ratio of 1, 9.3333 kg per 100 km", "A consumption derived at the 0.92 ratio, 10.1449 kg per 100 km", "REFUSED: Either a measured consumption on the new fuel, or both fuels'' energy content and an efficiency ratio, are required.", "REFUSED: Annual distance, base consumption and both fuel prices are required."]'::jsonb, explanation = 'The bus switch lesson''s probe table prints this refusal, which ends "Neither is assumed." The other refusal is the probe with no annual distance.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 11
  select case
           when prompt = 'Beside the saving, the switch prints a yearly figure in kg of CO2e avoided. Which is it?' and options = '["5579.7100", "7700.0000", "3825710.1400", "2365.8000"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 34 prints kgCo2eAvoidedPerYear 2365.8000, on the illustrative emission factors 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG. 5579.7100 is the CNG kg a year, 7700.0000 the PMS litres a year, and 3825710.1400 the annualSaving.' then 'old'
           when prompt = 'Beside the saving, the switch prints a yearly figure in kg of CO2e avoided. Which is it?' and options = '["5579.7100", "7700.0000", "3825710.1400", "2365.8000"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bus switch lesson prints kgCo2eAvoidedPerYear 2365.8000, on the illustrative emission factors 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG. 5579.7100 is the CNG kg a year, 7700.0000 the PMS litres a year, and 3825710.1400 the annualSaving.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Beside the saving, the switch prints a yearly figure in kg of CO2e avoided. Which is it?', options = '["5579.7100", "7700.0000", "3825710.1400", "2365.8000"]'::jsonb, explanation = 'The bus switch lesson prints kgCo2eAvoidedPerYear 2365.8000, on the illustrative emission factors 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG. 5579.7100 is the CNG kg a year, 7700.0000 the PMS litres a year, and 3825710.1400 the annualSaving.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 12
  select case
           when prompt = 'What does the efficiency ratio of 0.92 state for the converted bus?' and options = '["CNG carries 0.92 times the energy of PMS for each unit of fuel bought.", "It turns CNG energy into distance 0.92 times as well as PMS energy.", "It covers 0.92 of its 55000 km a year on CNG, and the rest of it on PMS.", "CNG costs 0.92 times as much as PMS for each MJ it supplies."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 34: the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. The energy contents are typed separately, 32 MJ a litre of PMS and 48 MJ a kg of CNG.' then 'old'
           when prompt = 'What does the efficiency ratio of 0.92 state for the converted bus?' and options = '["CNG carries 0.92 times the energy of PMS for each unit of fuel bought.", "It turns CNG energy into distance 0.92 times as well as PMS energy.", "It covers 0.92 of its 55000 km a year on CNG, and the rest of it on PMS.", "CNG costs 0.92 times as much as PMS for each MJ it supplies."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The bus switch lesson: the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. The energy contents are typed separately, 32 MJ a litre of PMS and 48 MJ a kg of CNG.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the efficiency ratio of 0.92 state for the converted bus?', options = '["CNG carries 0.92 times the energy of PMS for each unit of fuel bought.", "It turns CNG energy into distance 0.92 times as well as PMS energy.", "It covers 0.92 of its 55000 km a year on CNG, and the rest of it on PMS.", "CNG costs 0.92 times as much as PMS for each MJ it supplies."]'::jsonb, explanation = 'The bus switch lesson: the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. The energy contents are typed separately, 32 MJ a litre of PMS and 48 MJ a kg of CNG.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 13
  select case
           when prompt = 'IBAFO''s trailers run 4 trips a day with spares 0.1. What does assetFloat print as inCirculation, sparesAllowance and fleetRequired?' and options = '["7.2000, 0.0800 and 8", "7.2000, 0.7200 and 8", "1.8000, 0.7200 and 8", "7.2000, 0.7200 and 0.0800"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 29 prints IBAFO''s trailers as inCirculation 7.2000, sparesAllowance 0.7200 and fleetRequired 8, the fleet being the ceiling of the assets in circulation plus the spares allowance. 1.8000 is cycleDays and 0.0800 is spareCapacityUnits, what the ceiling adds.' then 'old'
           when prompt = 'IBAFO''s trailers run 4 trips a day with spares 0.1. What does assetFloat print as inCirculation, sparesAllowance and fleetRequired?' and options = '["7.2000, 0.0800 and 8", "7.2000, 0.7200 and 8", "1.8000, 0.7200 and 8", "7.2000, 0.7200 and 0.0800"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The fleet lesson prints IBAFO''s trailers as inCirculation 7.2000, sparesAllowance 0.7200 and fleetRequired 8, the fleet being the ceiling of the assets in circulation plus the spares allowance. 1.8000 is cycleDays and 0.0800 is spareCapacityUnits, what the ceiling adds.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s trailers run 4 trips a day with spares 0.1. What does assetFloat print as inCirculation, sparesAllowance and fleetRequired?', options = '["7.2000, 0.0800 and 8", "7.2000, 0.7200 and 8", "1.8000, 0.7200 and 8", "7.2000, 0.7200 and 0.0800"]'::jsonb, explanation = 'The fleet lesson prints IBAFO''s trailers as inCirculation 7.2000, sparesAllowance 0.7200 and fleetRequired 8, the fleet being the ceiling of the assets in circulation plus the spares allowance. 1.8000 is cycleDays and 0.0800 is spareCapacityUnits, what the ceiling adds.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-the-customers-switch ord 15
  select case
           when prompt = 'IBAFO''s trailers print spareCapacityUnits 0.0800. What does the digest call that field?' and options = '["The spares allowance of the fleet", "The spares fraction typed for the trailers", "The share of the cycle spent loading", "What the ceiling adds"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 29 labels spareCapacityUnits "what the ceiling adds". The spares allowance prints 0.7200, the spares fraction typed is 0.1, and Loading''s share of the cycle is 0.1111.' then 'old'
           when prompt = 'IBAFO''s trailers print spareCapacityUnits 0.0800. What does the course call that field?' and options = '["The spares allowance of the fleet", "The spares fraction typed for the trailers", "The share of the cycle spent loading", "What the ceiling adds"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The fleet lesson labels spareCapacityUnits "what the ceiling adds". The spares allowance prints 0.7200, the spares fraction typed is 0.1, and Loading''s share of the cycle is 0.1111.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m05-the-customers-switch ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s trailers print spareCapacityUnits 0.0800. What does the course call that field?', options = '["The spares allowance of the fleet", "The spares fraction typed for the trailers", "The share of the cycle spent loading", "What the ceiling adds"]'::jsonb, explanation = 'The fleet lesson labels spareCapacityUnits "what the ceiling adds". The spares allowance prints 0.7200, the spares fraction typed is 0.1, and Loading''s share of the cycle is 0.1111.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-the-customers-switch' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m05-the-customers-switch ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 1
  select case
           when prompt = 'What does SECTION 35 hold about the flare efficiencies?' and options = '["They default to the rule''s tiered values unless a study types its own.", "They have no default; the rule''s tiered defaults are a United States rule.", "They default to the combustion efficiency typed for the case.", "They are pinned and not validated, beside the DAK and Sutton coefficients."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 35, held: the flare efficiencies have no default: the rule''s tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading. The pinned list names heating values, densities, latent heats, the DAK and Sutton coefficients, the rule''s equation form and water at 15 C.' then 'old'
           when prompt = 'What does the limits lesson hold about the flare efficiencies?' and options = '["They default to the rule''s tiered values unless a study types its own.", "They have no default; the rule''s tiered defaults are a United States rule.", "They default to the combustion efficiency typed for the case.", "They are pinned and not validated, beside the DAK and Sutton coefficients."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Held in the limits lesson: the flare efficiencies have no default: the rule''s tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading. The pinned list names heating values, densities, latent heats, the DAK and Sutton coefficients, the rule''s equation form and water at 15 C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the limits lesson hold about the flare efficiencies?', options = '["They default to the rule''s tiered values unless a study types its own.", "They have no default; the rule''s tiered defaults are a United States rule.", "They default to the combustion efficiency typed for the case.", "They are pinned and not validated, beside the DAK and Sutton coefficients."]'::jsonb, explanation = 'Held in the limits lesson: the flare efficiencies have no default: the rule''s tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading. The pinned list names heating values, densities, latent heats, the DAK and Sutton coefficients, the rule''s equation form and water at 15 C.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 2
  select case
           when prompt = 'SECTION 35 names water at 15 C for a filling density. In which of its lists does it place that item?' and options = '["Among the held limits, as a code value the site types", "Among the case inputs, typed with the GWP values", "Among the checks the oracles make against measured water", "Among the items pinned and not validated"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 35''s pinned list ends with water at 15 C for a filling density. The held limits are the flare efficiencies, the unlit flare, fill limits by code, and GWP values and credit prices as case inputs.' then 'old'
           when prompt = 'The limits lesson names water at 15 C for a filling density. In which of its lists does it place that item?' and options = '["Among the held limits, as a code value the site types", "Among the case inputs, typed with the GWP values", "Among the checks the oracles make against measured water", "Among the items pinned and not validated"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The limits lesson''s pinned list ends with water at 15 C for a filling density. The held limits are the flare efficiencies, the unlit flare, fill limits by code, and GWP values and credit prices as case inputs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The limits lesson names water at 15 C for a filling density. In which of its lists does it place that item?', options = '["Among the held limits, as a code value the site types", "Among the case inputs, typed with the GWP values", "Among the checks the oracles make against measured water", "Among the items pinned and not validated"]'::jsonb, explanation = 'The limits lesson''s pinned list ends with water at 15 C for a filling density. The held limits are the flare efficiencies, the unlit flare, fill limits by code, and GWP values and credit prices as case inputs.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 3
  select case
           when prompt = 'Which fill limit does lpgCng ship for an LPG vessel?' and options = '["None; the site types the limit with its basis.", "0.85 on liquid_volume, KANO''s first limit", "0.42 on water_capacity_mass, the NFPA 58 value", "The NUPRC practice value, on liquid_volume"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 35, held: fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped: the limit is a safety code value, typed by the site with its basis. SECTION 26 calls 0.85 and 0.42 two illustrative fill limits, neither a code value.' then 'old'
           when prompt = 'Which fill limit does lpgCng ship for an LPG vessel?' and options = '["None; the site types the limit with its basis.", "0.85 on liquid_volume, KANO''s first limit", "0.42 on water_capacity_mass, the NFPA 58 value", "The NUPRC practice value, on liquid_volume"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Held in the limits lesson: fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped: the limit is a safety code value, typed by the site with its basis. The vessel lesson calls 0.85 and 0.42 two illustrative fill limits, neither a code value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which fill limit does lpgCng ship for an LPG vessel?', options = '["None; the site types the limit with its basis.", "0.85 on liquid_volume, KANO''s first limit", "0.42 on water_capacity_mass, the NFPA 58 value", "The NUPRC practice value, on liquid_volume"]'::jsonb, explanation = 'Held in the limits lesson: fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped: the limit is a safety code value, typed by the site with its basis. The vessel lesson calls 0.85 and 0.42 two illustrative fill limits, neither a code value.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 4
  select case
           when prompt = 'What does SECTION 35 say of GWP values and credit prices?' and options = '["They ship in a table, one row per edition.", "They are pinned and not validated.", "They are case inputs.", "They are checked by the validation oracles."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 35, held: GWP values and credit prices are case inputs. They appear in neither the pinned list nor the list of what the oracles check.' then 'old'
           when prompt = 'What does the limits lesson say of GWP values and credit prices?' and options = '["They ship in a table, one row per edition.", "They are pinned and not validated.", "They are case inputs.", "They are checked by the validation oracles."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Held in the limits lesson: GWP values and credit prices are case inputs. They appear in neither the pinned list nor the list of what the oracles check.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the limits lesson say of GWP values and credit prices?', options = '["They ship in a table, one row per edition.", "They are pinned and not validated.", "They are case inputs.", "They are checked by the validation oracles."]'::jsonb, explanation = 'Held in the limits lesson: GWP values and credit prices are case inputs. They appear in neither the pinned list nor the list of what the oracles check.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 5
  select case
           when prompt = 'Which of these does SECTION 35 list as pinned and not validated?' and options = '["The cascade''s mass ledger", "The DAK and Sutton coefficients", "Erlang C on the positions wholly working", "The ledgers for the blend, storage and vaporizer"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 35''s pinned list: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule''s equations, and water at 15 C for a filling density. The cascade ledger, Erlang C and the blend, storage and vaporizer ledgers are what the oracles check.' then 'old'
           when prompt = 'Which of these does the limits lesson list as pinned and not validated?' and options = '["The cascade''s mass ledger", "The DAK and Sutton coefficients", "Erlang C on the positions wholly working", "The ledgers for the blend, storage and vaporizer"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The limits lesson''s pinned list: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule''s equations, and water at 15 C for a filling density. The cascade ledger, Erlang C and the blend, storage and vaporizer ledgers are what the oracles check.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the limits lesson list as pinned and not validated?', options = '["The cascade''s mass ledger", "The DAK and Sutton coefficients", "Erlang C on the positions wholly working", "The ledgers for the blend, storage and vaporizer"]'::jsonb, explanation = 'The limits lesson''s pinned list: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule''s equations, and water at 15 C for a filling density. The cascade ledger, Erlang C and the blend, storage and vaporizer ledgers are what the oracles check.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 6
  select case
           when prompt = 'What do the validation oracles check of cngCompression?' and options = '["The polytropic head of each stage, in exact rationals.", "The four stage ratios, by bisection on reduced density.", "Nothing; the compressor sits on the pinned and not validated list.", "Only the unit bridge; the train''s thermodynamics are validated in Facilities."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 35: the compressor train''s thermodynamics are the Facilities engine''s and are validated there; only the unit bridge is checked here. The pinned list does not name the compressor, and bisection on reduced density is how the oracle finds Z.' then 'old'
           when prompt = 'What do the validation oracles check of cngCompression?' and options = '["The polytropic head of each stage, in exact rationals.", "The four stage ratios, by bisection on reduced density.", "Nothing; the compressor sits on the pinned and not validated list.", "Only the unit bridge; the train''s thermodynamics are validated in Facilities."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The limits lesson: the compressor train''s thermodynamics are the Facilities engine''s and are validated there; only the unit bridge is checked here. The pinned list does not name the compressor, and bisection on reduced density is how the oracle finds Z.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What do the validation oracles check of cngCompression?', options = '["The polytropic head of each stage, in exact rationals.", "The four stage ratios, by bisection on reduced density.", "Nothing; the compressor sits on the pinned and not validated list.", "Only the unit bridge; the train''s thermodynamics are validated in Facilities."]'::jsonb, explanation = 'The limits lesson: the compressor train''s thermodynamics are the Facilities engine''s and are validated there; only the unit bridge is checked here. The pinned list does not name the compressor, and bisection on reduced density is how the oracle finds Z.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 7
  select case
           when prompt = 'How does the oracle find Z, independently of the engine?' and options = '["By bisection on reduced density, with a second correlation as a plausibility check", "By the engine''s own DAK iteration, rerun to four decimals and compared", "As a mass ledger, with conservation asserted on every bank", "In exact rationals, in kilograms and cubic metres"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 35: Z by bisection on reduced density with a second correlation as a plausibility check. The mass ledger with conservation asserted is the cascade''s check, and exact rationals in kilograms and cubic metres are how the oracle takes the gas.' then 'old'
           when prompt = 'How does the oracle find Z, independently of the engine?' and options = '["By bisection on reduced density, with a second correlation as a plausibility check", "By the engine''s own DAK iteration, rerun to four decimals and compared", "As a mass ledger, with conservation asserted on every bank", "In exact rationals, in kilograms and cubic metres"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The limits lesson: Z by bisection on reduced density with a second correlation as a plausibility check. The mass ledger with conservation asserted is the cascade''s check, and exact rationals in kilograms and cubic metres are how the oracle takes the gas.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the oracle find Z, independently of the engine?', options = '["By bisection on reduced density, with a second correlation as a plausibility check", "By the engine''s own DAK iteration, rerun to four decimals and compared", "As a mass ledger, with conservation asserted on every bank", "In exact rationals, in kilograms and cubic metres"]'::jsonb, explanation = 'The limits lesson: Z by bisection on reduced density with a second correlation as a plausibility check. The mass ledger with conservation asserted is the cascade''s check, and exact rationals in kilograms and cubic metres are how the oracle takes the gas.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 8
  select case
           when prompt = 'The Kano and Ibafo rollout prints KANO cylinders required. Which figure is it?' and options = '["91200.0000, the cylinders in circulation alone", "3200, the cylinders filled in a day", "98496, the fleet with its 0.08 spares", "7296.0000, the spares allowance alone"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 36 prints KANO cylinders required 98496, SECTION 29''s fleetRequired. inCirculation prints 91200.0000 and sparesAllowance 7296.0000; 3200 is the cylinders filled a day.' then 'old'
           when prompt = 'The Kano and Ibafo rollout prints KANO cylinders required. Which figure is it?' and options = '["91200.0000, the cylinders in circulation alone", "3200, the cylinders filled in a day", "98496, the fleet with its 0.08 spares", "7296.0000, the spares allowance alone"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The rollout lesson prints KANO cylinders required 98496, the fleet lesson''s fleetRequired. inCirculation prints 91200.0000 and sparesAllowance 7296.0000; 3200 is the cylinders filled a day.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Kano and Ibafo rollout prints KANO cylinders required. Which figure is it?', options = '["91200.0000, the cylinders in circulation alone", "3200, the cylinders filled in a day", "98496, the fleet with its 0.08 spares", "7296.0000, the spares allowance alone"]'::jsonb, explanation = 'The rollout lesson prints KANO cylinders required 98496, the fleet lesson''s fleetRequired. inCirculation prints 91200.0000 and sparesAllowance 7296.0000; 3200 is the cylinders filled a day.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 9
  select case
           when prompt = 'Two rollout steps size KANO''s stock: usable LPG and cover. Which pair does the end-to-end table show?' and options = '["62.9433 t and 7.8680 days", "71.0685 t and 8.8836 days", "127.5000 t and 8.8840 days", "71.0685 t and 8.8840 days"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 36 prints KANO usable LPG at a 0.85 liquid fill 71.0685 t and cover 8.8840 days. 62.9433 t and 7.8680 days are the 0.42 water_capacity_mass row; 8.8836 is usableTonnes over demand before the engine''s three decimal cover; 127.5000 is usableM3 in m3.' then 'old'
           when prompt = 'Two rollout steps size KANO''s stock: usable LPG and cover. Which pair does the end-to-end table show?' and options = '["62.9433 t and 7.8680 days", "71.0685 t and 8.8836 days", "127.5000 t and 8.8840 days", "71.0685 t and 8.8840 days"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The rollout lesson prints KANO usable LPG at a 0.85 liquid fill 71.0685 t and cover 8.8840 days. 62.9433 t and 7.8680 days are the 0.42 water_capacity_mass row; 8.8836 is usableTonnes over demand before the engine''s three decimal cover; 127.5000 is usableM3 in m3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Two rollout steps size KANO''s stock: usable LPG and cover. Which pair does the end-to-end table show?', options = '["62.9433 t and 7.8680 days", "71.0685 t and 8.8836 days", "127.5000 t and 8.8840 days", "71.0685 t and 8.8840 days"]'::jsonb, explanation = 'The rollout lesson prints KANO usable LPG at a 0.85 liquid fill 71.0685 t and cover 8.8840 days. 62.9433 t and 7.8680 days are the 0.42 water_capacity_mass row; 8.8836 is usableTonnes over demand before the engine''s three decimal cover; 127.5000 is usableM3 in m3.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 10
  select case
           when prompt = 'The rollout''s KANO vaporizer design duty of 98.6948 kW runs on which latent heat?' and options = '["399.0000 kJ/kg, the blend''s on the volume fractions", "397.7592 kJ/kg, the blend''s on mass", "385 kJ/kg, n-butane''s typical row", "425 kJ/kg, propane''s typical row"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The vaporizer in SECTION 27 is fed the latent heat the blend gives on mass, 397.7592 kJ/kg. 399.0000 kJ/kg is the volume-fraction average SECTION 25 sets beside it, and 385 and 425 kJ/kg are the two component rows.' then 'old'
           when prompt = 'The rollout''s KANO vaporizer design duty of 98.6948 kW runs on which latent heat?' and options = '["399.0000 kJ/kg, the blend''s on the volume fractions", "397.7592 kJ/kg, the blend''s on mass", "385 kJ/kg, n-butane''s typical row", "425 kJ/kg, propane''s typical row"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the vaporizer lesson the vaporizer is fed the latent heat the blend gives on mass, 397.7592 kJ/kg. 399.0000 kJ/kg is the volume-fraction average the blend lesson sets beside it, and 385 and 425 kJ/kg are the two component rows.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The rollout''s KANO vaporizer design duty of 98.6948 kW runs on which latent heat?', options = '["399.0000 kJ/kg, the blend''s on the volume fractions", "397.7592 kJ/kg, the blend''s on mass", "385 kJ/kg, n-butane''s typical row", "425 kJ/kg, propane''s typical row"]'::jsonb, explanation = 'In the vaporizer lesson the vaporizer is fed the latent heat the blend gives on mass, 397.7592 kJ/kg. 399.0000 kJ/kg is the volume-fraction average the blend lesson sets beside it, and 385 and 425 kJ/kg are the two component rows.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 12
  select case
           when prompt = 'IBAFO''s forecourt prints kgPerHour 224.1860. Which mass per fill does it carry?' and options = '["425.6293 kg, the Mid bank''s mass", "608.505 kg, the cascade''s deliveredKg", "16.0133 kg, the cascade''s kgPerFill", "10.1449 kg, the bus''s CNG per 100 km"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 33: IBAFO''s forecourt is 14 buses an hour, 6 minutes a fill, each fill the cascade''s 16.0133 kg. 425.6293 kg is the Mid bank in SECTION 30, 608.505 kg the cascade''s deliveredKg, and 10.1449 kg the bus''s newFuelConsumptionPer100Km.' then 'old'
           when prompt = 'IBAFO''s forecourt prints kgPerHour 224.1860. Which mass per fill does it carry?' and options = '["425.6293 kg, the Mid bank''s mass", "608.505 kg, the cascade''s deliveredKg", "16.0133 kg, the cascade''s kgPerFill", "10.1449 kg, the bus''s CNG per 100 km"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The forecourt lesson: IBAFO''s forecourt is 14 buses an hour, 6 minutes a fill, each fill the cascade''s 16.0133 kg. 425.6293 kg is the Mid bank in the bank lesson, 608.505 kg the cascade''s deliveredKg, and 10.1449 kg the bus''s newFuelConsumptionPer100Km.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IBAFO''s forecourt prints kgPerHour 224.1860. Which mass per fill does it carry?', options = '["425.6293 kg, the Mid bank''s mass", "608.505 kg, the cascade''s deliveredKg", "16.0133 kg, the cascade''s kgPerFill", "10.1449 kg, the bus''s CNG per 100 km"]'::jsonb, explanation = 'The forecourt lesson: IBAFO''s forecourt is 14 buses an hour, 6 minutes a fill, each fill the cascade''s 16.0133 kg. 425.6293 kg is the Mid bank in the bank lesson, 608.505 kg the cascade''s deliveredKg, and 10.1449 kg the bus''s newFuelConsumptionPer100Km.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 13
  select case
           when prompt = 'Which gas do IBAFO''s cascade and its banks both run on?' and options = '["Specific gravity 0.6 at 15 C", "Specific gravity 0.62 at 32 C", "Specific gravity 0.62 at -80 C", "Specific gravity 0.62 at 30 C"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTIONS 30 and 31 give IBAFO''s gas as specific gravity 0.62 at 30 C. 0.6 at 15 C is the studio''s opening cascade; 32 C is the compressor''s suction temperature; -80 C is the out of range probe on the Low bank.' then 'old'
           when prompt = 'Which gas do IBAFO''s cascade and its banks both run on?' and options = '["Specific gravity 0.6 at 15 C", "Specific gravity 0.62 at 32 C", "Specific gravity 0.62 at -80 C", "Specific gravity 0.62 at 30 C"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The bank and cascade lessons give IBAFO''s gas as specific gravity 0.62 at 30 C. 0.6 at 15 C is the studio''s opening cascade; 32 C is the compressor''s suction temperature; -80 C is the out of range probe on the Low bank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which gas do IBAFO''s cascade and its banks both run on?', options = '["Specific gravity 0.6 at 15 C", "Specific gravity 0.62 at 32 C", "Specific gravity 0.62 at -80 C", "Specific gravity 0.62 at 30 C"]'::jsonb, explanation = 'The bank and cascade lessons give IBAFO''s gas as specific gravity 0.62 at 30 C. 0.6 at 15 C is the studio''s opening cascade; 32 C is the compressor''s suction temperature; -80 C is the out of range probe on the Low bank.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 14
  select case
           when prompt = 'How do the oracles check the cascade?' and options = '["As a mass ledger, with conservation asserted", "In exact rationals, on the positions wholly working", "By bisection on reduced density", "They do not; the cascade is pinned and not validated"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 35: the cascade as a mass ledger with conservation asserted. Exact rationals on the positions wholly working is the oracle''s Erlang C, and bisection on reduced density its Z. SECTION 31 prints storedKg minus deliveredKg minus leftInBanksKg as 0.000.' then 'old'
           when prompt = 'How do the oracles check the cascade?' and options = '["As a mass ledger, with conservation asserted", "In exact rationals, on the positions wholly working", "By bisection on reduced density", "They do not; the cascade is pinned and not validated"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The limits lesson: the cascade as a mass ledger with conservation asserted. Exact rationals on the positions wholly working is the oracle''s Erlang C, and bisection on reduced density its Z. The cascade lesson prints storedKg minus deliveredKg minus leftInBanksKg as 0.000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How do the oracles check the cascade?', options = '["As a mass ledger, with conservation asserted", "In exact rationals, on the positions wholly working", "By bisection on reduced density", "They do not; the cascade is pinned and not validated"]'::jsonb, explanation = 'The limits lesson: the cascade as a mass ledger with conservation asserted. Exact rationals on the positions wholly working is the oracle''s Erlang C, and bisection on reduced density its Z. The cascade lesson prints storedKg minus deliveredKg minus leftInBanksKg as 0.000.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 15
  select case
           when prompt = 'Which carousel figures does the rollout print for KANO?' and options = '["17 positions wholly working, an average wait of 0.0450 minutes", "16 positions wholly working, an average wait of 0.0912 minutes", "18 positions wholly working, an average wait of 0.0222 minutes", "14 positions wholly working, an average wait of 0.9850 minutes"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 36 prints KANO carousel positions wholly working 16 and average wait 0.0912 minutes. 17 and 18 positions are SECTION 28''s whole positions run at availability 1, and 14 positions with 0.9850 minutes is the studio''s opening carousel.' then 'old'
           when prompt = 'Which carousel figures does the rollout print for KANO?' and options = '["17 positions wholly working, an average wait of 0.0450 minutes", "16 positions wholly working, an average wait of 0.0912 minutes", "18 positions wholly working, an average wait of 0.0222 minutes", "14 positions wholly working, an average wait of 0.9850 minutes"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The rollout lesson prints KANO carousel positions wholly working 16 and average wait 0.0912 minutes. 17 and 18 positions are the carousel lesson''s whole positions run at availability 1, and 14 positions with 0.9850 minutes is the studio''s opening carousel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, gasvalue refused: no row for advanced m06-the-expert-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which carousel figures does the rollout print for KANO?', options = '["17 positions wholly working, an average wait of 0.0450 minutes", "16 positions wholly working, an average wait of 0.0912 minutes", "18 positions wholly working, an average wait of 0.0222 minutes", "14 positions wholly working, an average wait of 0.9850 minutes"]'::jsonb, explanation = 'The rollout lesson prints KANO carousel positions wholly working 16 and average wait 0.0912 minutes. 17 and 18 positions are the carousel lesson''s whole positions run at availability 1, and 14 positions with 0.9850 minutes is the studio''s opening carousel.'
     where app_slug = 'gasvalue' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, gasvalue refused: advanced m06-the-expert-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'gasvalue';
  if v_total <> 396 then raise exception 'digest-copy recut, gasvalue refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, gasvalue: % of 206 rows updated, the rest already carried the recut text', v_updated;
end $$;
