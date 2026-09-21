-- ============================================================================
-- H2 GO-LIVE (HELD): Occupational Hygiene: Noise, Chemical & Heat Exposure
-- flips to 'available', the SECOND course of the HSE module, at path_order
-- 62.
--
-- THIS MIGRATION IS APPLIED BY NOBODY IN THE PULL REQUEST THAT SHIPS IT. It is
-- written, generated from the committed tree, dry-run inside a rolled-back
-- transaction against a local scratch Postgres, and then left unapplied on
-- purpose. The four seed migrations beside it put the course in hidden, and
-- this one is the only file that makes it reachable.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/hygiene. The 78 lessons, the teaching lab and its three
-- explorer panels (the noise dosimeter, protection and chemicals, and heat
-- stress) ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h2_capstone.mjs returned through
--      the vendored engines/hse/exposure.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move
--      of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and states every period it sums, then recomputes the reference
--      duration and the noise dose period by period with the threshold as a
--      where clause, the dose-to-average step on the coefficient the source
--      prints, LEX,8h and the weekly LEX as energy sums, the protector credit,
--      the chemical averages, the mixture indices, the extended-shift action
--      level and the Brief and Scala factors, each as the formula its own
--      source writes;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- AND BY THIS COURSE'S OWN LINE. No graded field may read as a NIOSH heat
-- recommended alert limit, a NIOSH heat REL, a margin against either, an
-- exceedance verdict, or a wet bulb globe temperature built from thermometer
-- readings. Those equations and weights are TRANSCRIPTION-CHECKED ONLY, and
-- NIOSH's own worked example disagrees with its own equation, so the course
-- teaches them and grades nothing that passes through them. The check is in
-- SQL below, on the rows as seeded.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7 with
-- a label and a unit, the six-decimal answer the prompt asks for must pass, and
-- one unit either side of it in the sixth decimal must fail. All of it is
-- asserted here, on the rows as seeded.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_x double precision; v_wrong double precision;
  v_rf double precision; v_exposed double precision;
  v_g_utorogu_osha_pel_dose_pct double precision; v_s_utorogu_osha_pel_dose_pct double precision;
  v_g_utorogu_osha_pel_twa_dba double precision; v_s_utorogu_osha_pel_twa_dba double precision;
  v_g_utorogu_action_level_dose_pct double precision; v_s_utorogu_action_level_dose_pct double precision;
  v_g_utorogu_niosh_rel_dose_pct double precision; v_s_utorogu_niosh_rel_dose_pct double precision;
  v_g_utorogu_niosh_rel_twa_dba double precision; v_s_utorogu_niosh_rel_twa_dba double precision;
  v_g_utorogu_pel_minutes_left_min double precision; v_s_utorogu_pel_minutes_left_min double precision;
  v_g_amukpe_lex_8h_dba double precision; v_s_amukpe_lex_8h_dba double precision;
  v_g_amukpe_lex_weekly_dba double precision; v_s_amukpe_lex_weekly_dba double precision;
  v_g_amukpe_field_derated_exposure_dba double precision; v_s_amukpe_field_derated_exposure_dba double precision;
  v_g_amukpe_benzene_twa8h_ppm double precision; v_s_amukpe_benzene_twa8h_ppm double precision;
  v_g_amukpe_toluene_stel_ppm double precision; v_s_amukpe_toluene_stel_ppm double precision;
  v_g_amukpe_mixture_index double precision; v_s_amukpe_mixture_index double precision;
  v_g_osioka_wbgt_twa_c double precision; v_s_osioka_wbgt_twa_c double precision;
  v_g_osioka_metabolic_twa_w double precision; v_s_osioka_metabolic_twa_w double precision;
  v_g_osioka_extended_action_level_dba double precision; v_s_osioka_extended_action_level_dba double precision;
  v_g_osioka_extended_action_dose_pct double precision; v_s_osioka_extended_action_dose_pct double precision;
  v_g_osioka_adjusted_limit_ppm double precision; v_s_osioka_adjusted_limit_ppm double precision;
  v_g_osioka_adjusted_mixture_index double precision; v_s_osioka_adjusted_mixture_index double precision;
  v_u_l double precision[] := array[86.7, 92.4, 83.3, 96.3, 78.6];
  v_u_h double precision[] := array[2.35, 1.6, 2.2, 0.55, 1.3];
  v_a_l double precision[] := array[89.6, 82.3, 98.2, 76.4, 93.1];
  v_a_h double precision[] := array[1.8, 3.9, 0.35, 2.45, 0.7];
  v_a_week double precision[] := array[87.9, 84.6, 89.3, 82.2, 85.7];
  v_b_c double precision[] := array[0.86, 0.34, 1.73];
  v_b_h double precision[] := array[2.4, 3.15, 0.8];
  v_st_c double precision[] := array[212.0, 148.0];
  v_st_m double precision[] := array[6.0, 5.5];
  v_mx_c double precision[] := array[61.4, 28.3, 97.4];
  v_mx_l double precision[] := array[200.0, 100.0, 300.0];
  v_wb_t double precision[] := array[31.6, 29.3, 26.9];
  v_wb_m double precision[] := array[22.0, 23.0, 15.0];
  v_mt_w double precision[] := array[418.0, 305.0, 165.0];
  v_mt_m double precision[] := array[22.0, 23.0, 15.0];
  v_od_l double precision[] := array[85.2, 88.6, 81.6, 91.7, 77.8];
  v_od_h double precision[] := array[3.4, 2.1, 3.3, 0.8, 1.65];
  v_sv_c double precision[] := array[24.3, 41.8, 96.5];
  v_sv_l double precision[] := array[100.0, 200.0, 500.0];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'hygiene' and active;
  if v_structures <> 3 then
    raise exception 'H2 go-live refused: hygiene has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'hygiene';
  if v_questions <> 396 then
    raise exception 'H2 go-live refused: hygiene has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'hygiene'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'hygiene' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'hygiene' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'hygiene'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'hygiene' and s.active;
  if v_lessons <> 78 then
    raise exception 'H2 go-live refused: hygiene carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'hygiene' and s.active;
  if v_modules <> 18 then
    raise exception 'H2 go-live refused: hygiene carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'hygiene' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'hygiene';
  if v_capstones <> 3 then
    raise exception 'H2 go-live refused: hygiene has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'hygiene';
  if v_graded <> 18 then
    raise exception 'H2 go-live refused: hygiene has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'hygiene' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'hygiene' and module = 'hse'
                    and path_order = 62 and prereq_slug is null) then
    raise exception 'H2 go-live refused: the hygiene catalogue row is not hse at path_order 62 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 62 and slug <> 'hygiene') then
    raise exception 'H2 go-live refused: another course already holds path_order 62';
  end if;

  -- THE LINE THIS COURSE DOES NOT CROSS, on the rows as seeded. No graded field
  -- may read as a NIOSH heat recommended alert limit, a NIOSH heat REL, a
  -- margin against either, an exceedance verdict, or a wet bulb globe
  -- temperature built from thermometer readings.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene'
     and ((f->>'key') || ' ' || coalesce(f->>'label', '') || ' ' || coalesce(f->>'unit', ''))
         ~* '(\mRAL\M|recommended alert limit|NIOSH heat REL|\mmargin\M|\mexceeds?\M|\mexceedance\M|\mverdict\M|natural wet bulb|dry bulb)';
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) read as a heat limit, a margin, a verdict or a wet bulb globe temperature built from thermometer readings, which this course grades nowhere: %', v_n, v_names;
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at the six-decimal floor, with a
  -- label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to six decimals, must pass abs(answer - expected) <= tol
  -- in numeric exactly as academy_submit_capstone computes it, and one unit in
  -- the sixth decimal either side of it must fail.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads

  -- beginner: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'hygiene' and tier = 'beginner';
  if md5(v_prompt) <> 'de3780b8a754fbcba4a9c54918c1bd0e' then
    raise exception 'H2 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'hygiene' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'UTOROGU, one operator''s eight-hour dosimeter day in a gas compressor house' and title = 'What the noise dose is, once the criterion is named') then
    raise exception 'H2 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every period the second route sums is stated, its own numbers together,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['period 1, 86.7 dBA for 2.35 hours', 'period 2, 92.4 dBA for 1.6 hours', 'period 3, 83.3 dBA for 2.2 hours', 'period 4, 96.3 dBA for 0.55 hours', 'period 5, 78.6 dBA for 1.3 hours']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % beginner period line(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;

  -- intermediate: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'hygiene' and tier = 'intermediate';
  if md5(v_prompt) <> '8a4827c201123a391d591ce4baf48588' then
    raise exception 'H2 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'hygiene' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'AMUKPE, a maintenance crew on a floating production vessel, with a survey, a week of daily values and three personal air samples' and title = 'Protection and chemicals, each on the metric its own source prints') then
    raise exception 'H2 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every period the second route sums is stated, its own numbers together,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['task 1, 89.6 dBA for 1.8 hours', 'task 2, 82.3 dBA for 3.9 hours', 'task 3, 98.2 dBA for 0.35 hours', 'task 4, 76.4 dBA for 2.45 hours', 'task 5, 93.1 dBA for 0.7 hours', 'sample 1, 0.86 ppm for 2.4 hours', 'sample 2, 0.34 ppm for 3.15 hours', 'sample 3, 1.73 ppm for 0.8 hours', 'reading 1, 212 ppm for 6 minutes', 'reading 2, 148 ppm for 5.5 minutes', 'toluene at 61.4 ppm against a limit of 200 ppm', 'xylene at 28.3 ppm against a limit of 100 ppm', 'cyclohexane at 97.4 ppm against a limit of 300 ppm']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % intermediate period line(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;

  -- advanced: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'hygiene' and tier = 'advanced';
  if md5(v_prompt) <> '7333ed84862e060e4c488c923c25ca28' then
    raise exception 'H2 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'hygiene' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'OSIOKA, a hot-season turnaround on extended shifts, with stated heat stress readouts and a full-shift dosimeter record' and title = 'The shift that is not eight hours, and the readings a heat stress assessment starts from') then
    raise exception 'H2 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every period the second route sums is stated, its own numbers together,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['period 1, 31.6 degrees C at 418 watts for 22 minutes', 'period 2, 29.3 degrees C at 305 watts for 23 minutes', 'period 3, 26.9 degrees C at 165 watts for 15 minutes', 'period 1, 85.2 dBA for 3.4 hours', 'period 2, 88.6 dBA for 2.1 hours', 'period 3, 81.6 dBA for 3.3 hours', 'period 4, 91.7 dBA for 0.8 hours', 'period 5, 77.8 dBA for 1.65 hours', 'xylene at 24.3 ppm against a limit of 100 ppm', 'toluene at 41.8 ppm against a limit of 200 ppm', 'n-hexane at 96.5 ppm against a limit of 500 ppm']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % advanced period line(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_utorogu_osha_pel_dose_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_osha_pel_dose_pct';
  select (f->>'expected')::double precision into v_g_utorogu_osha_pel_twa_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_osha_pel_twa_dba';
  select (f->>'expected')::double precision into v_g_utorogu_action_level_dose_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_action_level_dose_pct';
  select (f->>'expected')::double precision into v_g_utorogu_niosh_rel_dose_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_niosh_rel_dose_pct';
  select (f->>'expected')::double precision into v_g_utorogu_niosh_rel_twa_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_niosh_rel_twa_dba';
  select (f->>'expected')::double precision into v_g_utorogu_pel_minutes_left_min
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'beginner' and f->>'key' = 'utorogu_pel_minutes_left_min';
  select (f->>'expected')::double precision into v_g_amukpe_lex_8h_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_lex_8h_dba';
  select (f->>'expected')::double precision into v_g_amukpe_lex_weekly_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_lex_weekly_dba';
  select (f->>'expected')::double precision into v_g_amukpe_field_derated_exposure_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_field_derated_exposure_dba';
  select (f->>'expected')::double precision into v_g_amukpe_benzene_twa8h_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_benzene_twa8h_ppm';
  select (f->>'expected')::double precision into v_g_amukpe_toluene_stel_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_toluene_stel_ppm';
  select (f->>'expected')::double precision into v_g_amukpe_mixture_index
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'intermediate' and f->>'key' = 'amukpe_mixture_index';
  select (f->>'expected')::double precision into v_g_osioka_wbgt_twa_c
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_wbgt_twa_c';
  select (f->>'expected')::double precision into v_g_osioka_metabolic_twa_w
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_metabolic_twa_w';
  select (f->>'expected')::double precision into v_g_osioka_extended_action_level_dba
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_extended_action_level_dba';
  select (f->>'expected')::double precision into v_g_osioka_extended_action_dose_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_extended_action_dose_pct';
  select (f->>'expected')::double precision into v_g_osioka_adjusted_limit_ppm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_adjusted_limit_ppm';
  select (f->>'expected')::double precision into v_g_osioka_adjusted_mixture_index
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hygiene' and c.tier = 'advanced' and f->>'key' = 'osioka_adjusted_mixture_index';
  if v_g_utorogu_osha_pel_dose_pct is null
     or v_g_utorogu_osha_pel_twa_dba is null
     or v_g_utorogu_action_level_dose_pct is null
     or v_g_utorogu_niosh_rel_dose_pct is null
     or v_g_utorogu_niosh_rel_twa_dba is null
     or v_g_utorogu_pel_minutes_left_min is null
     or v_g_amukpe_lex_8h_dba is null
     or v_g_amukpe_lex_weekly_dba is null
     or v_g_amukpe_field_derated_exposure_dba is null
     or v_g_amukpe_benzene_twa8h_ppm is null
     or v_g_amukpe_toluene_stel_ppm is null
     or v_g_amukpe_mixture_index is null
     or v_g_osioka_wbgt_twa_c is null
     or v_g_osioka_metabolic_twa_w is null
     or v_g_osioka_extended_action_level_dba is null
     or v_g_osioka_extended_action_dose_pct is null
     or v_g_osioka_adjusted_limit_ppm is null
     or v_g_osioka_adjusted_mixture_index is null then
    raise exception 'H2 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner/utorogu_osha_pel_dose_pct, beginner/utorogu_osha_pel_twa_dba, beginner/utorogu_action_level_dose_pct, beginner/utorogu_niosh_rel_dose_pct, beginner/utorogu_niosh_rel_twa_dba, beginner/utorogu_pel_minutes_left_min, intermediate/amukpe_lex_8h_dba, intermediate/amukpe_lex_weekly_dba, intermediate/amukpe_field_derated_exposure_dba, intermediate/amukpe_benzene_twa8h_ppm, intermediate/amukpe_toluene_stel_ppm, intermediate/amukpe_mixture_index, advanced/osioka_wbgt_twa_c, advanced/osioka_metabolic_twa_w, advanced/osioka_extended_action_level_dba, advanced/osioka_extended_action_dose_pct, advanced/osioka_adjusted_limit_ppm, advanced/osioka_adjusted_mixture_index]';
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- PROMPTLEAK, IN SQL. No number in any prompt, dataset, title or label of
  -- this course, thousands separators stripped, lands within a graded field's
  -- tolerance of a graded value of ANY tier. A different tier is a leak and the
  -- same tier a transcription; both are refused.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone text', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' '
                   || (select string_agg((pf->>'label') || ' ' || (pf->>'unit'), ' ') from jsonb_array_elements(p.fields) pf),
                   ',', ''),
           '([0-9]+(\.[0-9]+)?)', 'g') as m
   where c.app_slug = 'hygiene' and p.app_slug = 'hygiene'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner at
  -- least 100 numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '([0-9]+(\.[0-9]+)?)', 'g') m
   where p.app_slug = 'hygiene';
  if v_n < 100 then
    raise exception 'H2 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'hygiene') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'hygiene') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(a.e - b.e) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;

  -- EVERY NUMBER THE TEACHING DIGEST PRINTS (1631 of them), at each
  -- field's SHIPPED tolerance. A graded value on one of them is a lookup.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 9e-06, 1e-05, 1.7e-05, 3e-05, 3.5e-05, 3.6e-05, 3.9e-05, 4.5e-05, 4.6e-05, 5.8e-05, 6e-05, 6.9e-05, 7.2e-05, 7.8e-05, 8.1e-05, 8.9e-05, 9e-05, 9.2e-05, 9.4e-05, 9.8e-05, 0.000103, 0.00011, 0.000116, 0.000119, 0.000121, 0.000123, 0.000134, 0.000139, 0.000143, 0.000206, 0.000211, 0.000235, 0.000246, 0.00025, 0.000268, 0.000278, 0.000308, 0.000359525563, 0.000366, 0.000388, 0.000396, 0.000409, 0.000469, 0.000488, 0.0005, 0.000535, 0.000551, 0.000556, 0.000615, 0.000775, 0.000792, 0.000833, 0.000977, 0.001071, 0.001111, 0.001181, 0.00123, 0.001319, 0.001409, 0.001471, 0.00155, 0.001583, 0.001667, 0.001944, 0.001953, 0.002142, 0.002199, 0.002362, 0.002423, 0.002461, 0.0025, 0.002603, 0.002825, 0.002842, 0.003056, 0.0031, 0.003175, 0.003396, 0.003575, 0.003587, 0.003889, 0.003906, 0.003965, 0.004068, 0.004349, 0.004563, 0.004725, 0.004922, 0.004938, 0.005, 0.005077, 0.005207, 0.005532, 0.006066, 0.006111, 0.006201, 0.006351, 0.006746, 0.007442, 0.007778, 0.007813, 0.00793, 0.008135, 0.008169, 0.009263, 0.00964, 0.009722, 0.009775, 0.009843, 0.010076, 0.01039, 0.010413, 0.010897, 0.011946, 0.012043, 0.012127, 0.012151, 0.01233, 0.012402, 0.012482, 0.0125, 0.012511, 0.013222, 0.013846, 0.015172, 0.015556, 0.015625, 0.015717, 0.017082, 0.017371, 0.017494, 0.017798, 0.018386, 0.018456, 0.019508, 0.019686, 0.019692, 0.019717, 0.019722, 0.019735, 0.020031, 0.020095, 0.020321, 0.020805, 0.020826, 0.021641, 0.021683, 0.021705, 0.02188, 0.021968, 0.022065, 0.022123, 0.023241, 0.023253, 0.023487, 0.024291, 0.024292, 0.024441, 0.024722, 0.024803, 0.024813, 0.025733, 0.027134, 0.027502, 0.027674, 0.028224, 0.028809, 0.029297, 0.029333, 0.029376, 0.029962, 0.029997, 0.030973, 0.031, 0.03125, 0.031389, 0.031433, 0.031521, 0.032543, 0.032982, 0.034215715338, 0.034216, 0.034443, 0.034453, 0.035203, 0.035535, 0.035595, 0.035897, 0.036, 0.036091, 0.036696, 0.036775, 0.036912, 0.037134, 0.037143, 0.037314, 0.037626, 0.038659, 0.039016, 0.039095, 0.039373, 0.039444, 0.039482, 0.039638, 0.039985, 0.040095, 0.040614, 0.041, 0.041101, 0.041235, 0.042306, 0.042382, 0.042846, 0.04372, 0.043937, 0.043991, 0.044046, 0.044084, 0.044843, 0.045112, 0.045169, 0.04519, 0.045192, 0.045732, 0.046337, 0.046367, 0.046506, 0.047, 0.047202, 0.047366, 0.047514, 0.048053, 0.048535, 0.048698, 0.049606, 0.049625, 0.049722, 0.05, 0.054, 0.054409, 0.058594, 0.058656, 0.0625, 0.063, 0.063546, 0.068431, 0.071794, 0.072, 0.073823, 0.077935, 0.078611, 0.078745, 0.079328, 0.079422, 0.08, 0.082, 0.082469, 0.091809, 0.092872, 0.093012, 0.094732, 0.095, 0.099167, 0.099213, 0.1, 0.100714, 0.101328, 0.102647, 0.108819, 0.11, 0.112151, 0.113544, 0.114798, 0.117188, 0.124352, 0.124441, 0.125, 0.125458, 0.126791, 0.127088, 0.136863, 0.14, 0.143587, 0.146367, 0.147647, 0.14776, 0.15749, 0.1575, 0.159621, 0.16, 0.164938, 0.171079, 0.180582, 0.181975, 0.186024, 0.189465, 0.19, 0.192872, 0.198333, 0.198425, 0.2, 0.200951, 0.214798, 0.217638, 0.22, 0.225, 0.234375, 0.25, 0.252982, 0.287175, 0.29, 0.295294, 0.3, 0.307786, 0.312, 0.3125, 0.31498, 0.316389, 0.318486, 0.329877, 0.33, 0.341061, 0.357143, 0.3625, 0.372047, 0.378929, 0.38, 0.385, 0.39685, 0.396944, 0.40095, 0.416667, 0.435275, 0.4375, 0.44, 0.46875, 0.5, 0.504766, 0.524593, 0.542492, 0.5625, 0.57, 0.574349, 0.590588, 0.6, 0.625, 0.629961, 0.63, 0.635463, 0.642857, 0.659722, 0.659754, 0.66, 0.7, 0.7375, 0.744094, 0.75, 0.757858, 0.76, 0.78125, 0.793611, 0.793701, 0.8, 0.833333, 0.853561, 0.87, 0.870551, 0.925, 0.9375, 0.952084, 1.0, 1.00714, 1.0595, 1.1, 1.148695, 1.148698, 1.15, 1.181176, 1.2, 1.25, 1.258925, 1.259921, 1.26, 1.266667, 1.267915, 1.3, 1.319508, 1.4375, 1.488188, 1.5, 1.513571, 1.515717, 1.583333, 1.587401, 1.59621, 1.7, 1.7068, 1.741101, 1.75, 1.8, 1.836177, 1.875, 1.9, 1.904167, 2.0, 2.009509, 2.1, 2.167591, 2.2, 2.22, 2.265768, 2.297397, 2.3, 2.362352, 2.457837, 2.5, 2.516667, 2.519842, 2.529822, 2.6, 2.639016, 2.782678, 2.890073, 2.9, 2.955125, 2.976377, 3.0, 3.031433, 3.1, 3.158, 3.166667, 3.174802, 3.184857, 3.240515, 3.4, 3.411023, 3.482202, 3.5, 3.553, 3.565356, 3.6, 3.735378, 3.75, 3.817322, 3.979, 3.984913, 4.0, 4.009498, 4.023193, 4.094076, 4.228072, 4.4, 4.594793, 4.6, 4.724704, 5.0, 5.033333, 5.039684, 5.047659, 5.071055, 5.278032, 5.3, 5.952754, 6.0, 6.062866, 6.1, 6.349604, 6.35, 6.354626, 6.458554, 6.5, 6.679, 6.75, 6.821223, 6.964405, 7.0, 7.5, 8.0, 8.1, 8.224911, 8.82703, 9.0, 9.091664, 9.189587, 9.2, 9.3, 9.375, 9.404383, 9.449408, 9.965784284662, 9.9897, 10.0, 10.079368, 10.083333, 10.5, 10.556063, 10.6, 11.0, 11.5, 11.81176, 11.905508, 12.0, 12.1, 12.125733, 12.5, 12.679146, 12.699208, 12.7, 13.0, 13.25, 13.5, 13.9, 13.928809, 14.0, 14.1, 14.747186, 15.0, 15.962099, 16.0, 16.534419, 16.609640474437, 16.61, 16.759307, 17.0, 17.630482, 18.0, 18.024072, 18.379174, 18.4, 18.921153, 19.0, 19.248401, 19.764235, 20.0, 20.158737, 20.166667, 20.25, 20.728067, 20.935665, 20.97, 21.0, 21.1, 21.112127, 21.844523, 22.0, 22.288913, 22.566713, 23.0, 23.100555, 23.210954, 23.811016, 24.0, 24.047916, 24.048, 24.251465, 24.3, 24.751261, 24.920578, 24.97259, 25.0, 25.00075, 25.298221, 25.398417, 25.4, 25.6, 25.661845, 26.0, 26.024291, 26.4, 26.520282, 26.77631, 27.0, 27.09585, 27.1, 27.455477, 27.457508, 27.458939, 27.459, 27.646683, 27.748183, 27.8, 27.857618, 27.9, 28.0, 28.2, 28.213106, 29.0, 29.066667, 29.217113, 29.25, 29.475407, 30.0, 30.09, 30.125, 30.238155, 30.791142, 30.8, 31.0, 31.2, 31.41, 31.473135, 31.622777, 31.674951, 31.7, 31.8112, 32.0, 32.46875, 32.56, 32.958733, 32.98849, 33.0, 33.7, 33.725, 33.8, 34.375, 35.0, 35.703704, 35.714286, 36.0, 37.797631, 38.0, 38.7, 40.0, 42.0, 42.15625, 43.75, 45.0, 45.3, 45.63864, 45.880074, 47.622032, 48.0, 49.0, 50.0, 50.00075, 50.118723, 51.0, 52.780316, 53.9, 54.0, 55.0, 56.0, 56.7, 57.0, 57.350093, 59.0, 59.9, 60.0, 64.0, 64.285714, 64.980192, 65.0, 65.972222, 65.975989, 66.6, 67.321825, 69.0, 69.6, 70.0, 71.2, 71.6, 71.996537, 72.0, 72.054478, 72.251817, 72.5, 72.6, 73.39, 73.39036, 73.4, 73.8, 74.6, 75.0, 75.595263, 75.786283, 76.2, 76.3, 76.314876, 76.315172, 76.5, 77.074908, 77.183889, 77.6, 77.9588, 78.0, 78.0103, 78.034216, 78.390108, 78.39036, 78.4, 78.9, 78.9794, 79.370053, 79.6, 79.771213, 79.789103, 79.8, 79.85, 79.9, 79.9794, 79.999784, 80.0, 80.752126, 80.9, 80.96303, 81.0, 81.0206, 81.034216, 81.2, 81.25, 81.3, 81.314984, 81.315172, 81.593327, 81.7, 81.9897, 82.0, 82.075016, 82.1, 82.235865, 82.296991, 82.4, 82.42697, 82.427134, 82.781513, 82.789103, 82.8, 82.95, 83.0, 83.038262, 83.1, 83.245112, 83.333333, 83.390216, 83.39036, 83.4, 83.41486, 83.45098, 83.45628, 83.5, 84.0, 84.0309, 84.034216, 84.150248, 84.150613, 84.2, 84.23986, 84.239985, 84.3, 84.35, 84.448506, 84.5, 84.542425, 84.543991, 84.599082, 84.6, 84.719713, 84.86, 84.9, 84.9897, 84.991812, 84.999891772021, 84.999892, 85.0, 85.39026, 85.4, 85.412511, 85.413927, 85.461288, 85.687424, 85.687518, 85.7, 85.789103, 85.791812, 85.8, 85.85, 85.9691, 85.989252, 86.0, 86.026852, 86.1, 86.135535, 86.139434, 86.245112, 86.3, 86.315092, 86.315172, 86.4, 86.45628, 86.46128, 86.5, 86.613302, 86.64697, 86.754888, 86.760913, 86.8, 86.892491, 86.892558, 86.9, 87.0, 87.075124, 87.075187, 87.1, 87.2, 87.207845, 87.296604, 87.3, 87.304489, 87.4, 87.427078, 87.427134, 87.6, 87.600937, 87.635749, 87.9, 87.924768, 87.924813, 88.0, 88.0103, 88.1, 88.2, 88.275, 88.390325, 88.39036, 88.4, 88.479936, 88.479969, 88.5, 88.568448, 88.568479, 88.6, 88.655887, 88.655916, 88.7, 88.742279, 88.742306, 88.780693, 88.8, 88.827648, 88.827674, 88.9, 88.912019, 88.912043, 88.965784, 88.9794, 88.995415, 88.995437, 89.0, 89.0309, 89.077857, 89.077877, 89.1, 89.159368, 89.159386, 89.2, 89.239968, 89.239985, 89.24246, 89.245112, 89.3, 89.319678, 89.319692, 89.398516, 89.398529, 89.4, 89.476502, 89.476513, 89.5, 89.553654, 89.553663, 89.6, 89.629989, 89.629997, 89.7, 89.705525, 89.705532, 89.754888, 89.771213, 89.780279, 89.780283, 89.8, 89.854265, 89.854268, 89.9, 89.927501, 89.927502, 90.0, 90.0515, 90.071776, 90.071778, 90.1, 90.142846, 90.142849, 90.2, 90.213222, 90.213226, 90.282918, 90.282924, 90.3, 90.351947, 90.351954, 90.4, 90.420321, 90.42033, 90.422065, 90.44068, 90.488054, 90.488065, 90.5, 90.555157, 90.555169, 90.6, 90.621641, 90.621654, 90.687518, 90.687533, 90.7, 90.752798, 90.752815, 90.8, 90.817494, 90.817511, 90.881614, 90.881633, 90.9, 90.945169, 90.94519, 91.0, 91.008, 91.008191, 91.0206, 91.070624, 91.070647, 91.1, 91.132543, 91.132567, 91.181812, 91.193934, 91.19396, 91.2, 91.254808, 91.254835, 91.3, 91.315172, 91.3152, 91.5, 91.509775, 91.532125, 91.6, 91.60964, 91.609675, 91.892558, 91.892599, 91.895868, 91.9, 91.965784, 91.9897, 92.0, 92.075187, 92.1, 92.164797, 92.164844, 92.2, 92.333333, 92.378295, 92.4, 92.403627, 92.427134, 92.427187, 92.6, 92.680265, 92.680323, 92.7, 92.754888, 92.781513, 92.8, 92.9, 92.924813, 92.924876, 93.0, 93.1, 93.101319, 93.129134, 93.161341, 93.16141, 93.2, 93.35, 93.39036, 93.390433, 93.4, 93.422065, 93.45098, 93.5, 93.6, 93.61233, 93.612408, 93.720672, 93.75, 93.750613, 93.8, 93.827674, 93.827757, 94.0, 94.0309, 94.036775, 94.036862, 94.2, 94.239985, 94.240076, 94.4, 94.437626, 94.437722, 94.6, 94.629997, 94.630097, 94.7, 94.8, 94.817371, 94.817475, 95.0, 95.000108, 95.1, 95.244063, 95.351947, 95.352062, 95.4, 95.6, 95.687518, 95.687641, 95.7, 96.0, 96.008169, 96.008299, 96.1, 96.3, 96.315172, 96.315309, 96.5, 96.6, 96.60964, 96.609784, 96.892558, 96.892707, 96.9, 97.0, 97.075187, 97.1, 97.164797, 97.164952, 97.2, 97.4, 97.427134, 97.427295, 97.6, 97.680265, 97.680431, 97.7, 97.9, 97.924813, 97.924984, 97.965784, 98.0, 98.0103, 98.161341, 98.161518, 98.2, 98.337073, 98.39036, 98.390541, 98.4, 98.6, 98.61233, 98.612517, 98.8, 98.827674, 98.827865, 98.931569, 98.9794, 99.0, 99.036775, 99.03697, 99.1, 99.2, 99.239985, 99.240185, 99.4, 99.437626, 99.437831, 99.6, 99.629997, 99.630206, 99.720672, 99.763116, 99.771213, 99.8, 99.817371, 99.817583, 100.0, 100.000000000001, 100.000216, 100.0515, 100.17812, 100.17834, 100.2, 100.351947, 100.352171, 100.387849, 100.4, 100.44068, 100.5, 100.521683, 100.521911, 100.687518, 100.687749, 100.7, 100.8, 100.849625, 100.84986, 100.965784, 101.0, 101.008169, 101.008408, 101.0206, 101.163304, 101.163545, 101.2, 101.3, 101.315172, 101.315417, 101.463909, 101.464157, 101.475559, 101.5, 101.532125, 101.6, 101.60964, 101.609892, 101.752486, 101.752741, 101.8, 101.892558, 101.892816, 101.9, 101.931569, 101.9897, 102.0, 102.029962, 102.030222, 102.164797, 102.16506, 102.2, 102.297158, 102.297424, 102.3, 102.4, 102.427134, 102.427403, 102.55481, 102.555081, 102.6, 102.680265, 102.680539, 102.7, 102.720672, 102.781513, 102.8, 102.803575, 102.803852, 102.9, 102.924813, 102.925092, 103.0, 103.044046, 103.044329, 103.161341, 103.161626, 103.2, 103.276759, 103.277047, 103.3, 103.387849, 103.39036, 103.390649, 103.4, 103.45098, 103.5, 103.502199, 103.502491, 103.6, 103.61233, 103.612625, 103.7, 103.720805, 103.721102, 103.8, 103.827674, 103.827973, 103.9, 103.932982, 103.933283, 103.965784, 104.0, 104.0309, 104.036775, 104.037078, 104.1, 104.139095, 104.139401, 104.2, 104.239985, 104.240293, 104.3, 104.339482, 104.339793, 104.4, 104.437626, 104.437939, 104.475559, 104.5, 104.534453, 104.534768, 104.542425, 104.6, 104.629997, 104.630314, 104.7, 104.724292, 104.724611, 104.8, 104.817371, 104.817691, 104.9, 104.909263, 104.909586, 104.931569, 105.0, 105.000325, 105.08961, 105.089936, 105.1, 105.17812, 105.178448, 105.2, 105.265557, 105.265887, 105.3, 105.351947, 105.352279, 105.4, 105.437314, 105.437648, 105.5, 105.521683, 105.522019, 105.6, 105.605077, 105.605415, 105.687518, 105.687857, 105.7, 105.720672, 105.769027, 105.769368, 105.791812, 105.8, 105.849625, 105.849968, 105.9, 105.929333, 105.929678, 106.0, 106.008169, 106.008516, 106.086154, 106.086502, 106.1, 106.163304, 106.163654, 106.167127, 106.2, 106.239638, 106.239989, 106.3, 106.315172, 106.315525, 106.387849, 106.389924, 106.390279, 106.4, 106.46128, 106.463909, 106.464265, 106.5, 106.537143, 106.537501, 106.6, 106.602423, 106.602783, 106.965784, 107.0, 107.0412, 107.475559, 107.552725, 107.6, 107.931569, 108.0, 108.0103, 108.897353, 108.9794, 109.0, 109.686456, 109.771213, 109.8, 110.0, 110.353633, 110.4, 110.44068, 110.931569, 111.0, 111.0206, 111.441344, 111.5, 111.532125, 111.9897, 111.99, 112.0, 112.686456, 112.781513, 112.8, 113.0, 113.353633, 113.45098, 113.5, 113.931569, 114.0, 114.0309, 114.441344, 114.5, 114.542425, 114.897353, 115.0, 116.0, 117.0, 118.0, 119.0, 120.0, 121.0, 121.407128, 121.5, 121.532125, 121.863137, 121.9897, 122.0, 122.65224, 122.781513, 122.8, 123.0, 123.319418, 123.45098, 123.5, 123.897353, 124.0, 124.0309, 124.407128, 124.5, 124.542425, 124.863137, 125.0, 125.275648, 125.4, 125.413927, 125.65224, 125.791812, 125.8, 125.998672, 126.0, 126.1, 126.139434, 126.319418, 126.46128, 126.5, 126.897353, 127.0, 127.0412, 127.407128, 127.552725, 127.6, 127.863137, 128.0, 128.0103, 128.275648, 128.4, 128.424227, 128.65224, 128.8, 128.802112, 128.998672, 129.0, 129.1, 129.149733, 129.319418, 129.47158, 129.5, 129.618025, 129.771213, 129.8, 130.0, 130.285202, 130.4, 130.44068, 130.863137, 131.0, 131.0206, 131.372912, 131.5, 131.532125, 131.828921, 131.949999, 131.9897, 132.0, 132.618025, 132.781513, 132.8, 133.285202, 133.45098, 133.5, 133.863137, 134.0, 134.0309, 134.372912, 134.5, 134.542425, 134.828921, 135.0, 140.0, 144.987371, 145.0, 146.115723, 150.0, 151.190526, 153.333333, 155.0, 158.489319, 160.0, 165.0, 166.25875, 168.0, 170.0, 173.404361, 175.0, 180.0, 185.0, 190.0, 190.488126, 195.0, 199.526231, 199.794001, 199.996999, 200.0, 210.0, 220.0, 230.0, 233.0, 235.0, 240.0, 250.0, 260.0, 265.610944, 270.0, 280.0, 290.0, 300.0, 302.381052, 310.0, 316.227766, 320.0, 330.0, 340.0, 348.9, 349.0, 350.0, 360.0, 370.0, 372.0, 380.0, 380.976252, 385.0, 390.0, 399.987998, 400.0, 410.0, 420.0, 430.0, 440.0, 441.0, 450.0, 460.0, 465.0, 467.0, 470.0, 480.0, 490.0, 500.0, 501.187234, 510.0, 520.0, 530.0, 540.0, 550.0, 560.0, 570.0, 580.0, 590.0, 600.0, 604.762104, 610.0, 620.0, 630.0, 640.0, 650.0, 660.0, 670.0, 680.0, 690.0, 700.0, 710.0, 714.0, 720.0, 730.0, 740.0, 750.0, 760.0, 761.952505, 770.0, 780.0, 790.0, 800.0, 810.0, 820.0, 830.0, 840.0, 850.0, 860.0, 870.0, 880.0, 890.0, 900.0, 910.0, 920.0, 930.0, 940.0, 950.0, 960.0, 970.0, 980.0, 990.0, 999.0, 1000.0, 1209.524208, 1523.90501, 1910.1, 1910.95, 1975.0, 1990.0, 1998.0, 1999.0, 2000.0, 2003.0, 2005.0, 2016.0, 2156.29055, 2500.0, 3000.0, 3162.27766, 3500.0, 4000.0, 4500.0, 5000.0, 6000.0, 7000.0, 7243.0, 8000.0, 9000.0, 9612.0, 10000.0, 12000.0, 13083.161045, 14000.0, 16000.0, 18000.0, 20000.0, 25000.0, 30000.0, 35000.0, 40000.0, 45000.0, 50000.0, 60000.0, 70000.0, 80000.0, 90000.0, 100000.0, 450000.0, 500000.0, 600000.0, 700000.0, 800000.0, 900000.0, 1000000.0, 1100000.0, 1200000.0, 1300000.0, 1400000.0, 1600000.0, 1800000.0, 2000000.0, 2200000.0, 2400000.0, 2600000.0, 2800000.0, 3000000.0, 3500000.0, 4000000.0, 4500000.0, 5000000.0, 6000000.0, 7000000.0, 8000000.0, 9000000.0, 10000000.0]::double precision[]) pub
   where c.app_slug = 'hygiene'
     and abs((f->>'expected')::double precision - pub) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;


  -- ------------------------------------------ 1. against the engine ledger
  -- The values h2_capstone.mjs returned through the vendored engine, to the
  -- last bit. A seeded value that is not the engine's is refused by name.
  if v_g_utorogu_osha_pel_dose_pct <> 44.3602055155184::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 44.3602055155184 the engine returned [graded field: beginner/utorogu_osha_pel_dose_pct]', v_g_utorogu_osha_pel_dose_pct;
  end if;
  if v_g_utorogu_osha_pel_twa_dba <> 84.13656285746234::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 84.13656285746234 the engine returned [graded field: beginner/utorogu_osha_pel_twa_dba]', v_g_utorogu_osha_pel_twa_dba;
  end if;
  if v_g_utorogu_action_level_dose_pct <> 73.81407352757833::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 73.81407352757833 the engine returned [graded field: beginner/utorogu_action_level_dose_pct]', v_g_utorogu_action_level_dose_pct;
  end if;
  if v_g_utorogu_niosh_rel_dose_pct <> 266.2009704602468::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 266.2009704602468 the engine returned [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_g_utorogu_niosh_rel_dose_pct;
  end if;
  if v_g_utorogu_niosh_rel_twa_dba <> 89.25209634402225::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 89.25209634402225 the engine returned [graded field: beginner/utorogu_niosh_rel_twa_dba]', v_g_utorogu_niosh_rel_twa_dba;
  end if;
  if v_g_utorogu_pel_minutes_left_min <> 111.51388851232277::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 111.51388851232277 the engine returned [graded field: beginner/utorogu_pel_minutes_left_min]', v_g_utorogu_pel_minutes_left_min;
  end if;
  if v_g_amukpe_lex_8h_dba <> 88.8596336786288::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 88.8596336786288 the engine returned [graded field: intermediate/amukpe_lex_8h_dba]', v_g_amukpe_lex_8h_dba;
  end if;
  if v_g_amukpe_lex_weekly_dba <> 86.61553376952014::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 86.61553376952014 the engine returned [graded field: intermediate/amukpe_lex_weekly_dba]', v_g_amukpe_lex_weekly_dba;
  end if;
  if v_g_amukpe_field_derated_exposure_dba <> 92.07265437345556::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 92.07265437345556 the engine returned [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_g_amukpe_field_derated_exposure_dba;
  end if;
  if v_g_amukpe_benzene_twa8h_ppm <> 0.564875::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 0.564875 the engine returned [graded field: intermediate/amukpe_benzene_twa8h_ppm]', v_g_amukpe_benzene_twa8h_ppm;
  end if;
  if v_g_amukpe_toluene_stel_ppm <> 139.06666666666666::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 139.06666666666666 the engine returned [graded field: intermediate/amukpe_toluene_stel_ppm]', v_g_amukpe_toluene_stel_ppm;
  end if;
  if v_g_amukpe_mixture_index <> 0.9146666666666667::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 0.9146666666666667 the engine returned [graded field: intermediate/amukpe_mixture_index]', v_g_amukpe_mixture_index;
  end if;
  if v_g_osioka_wbgt_twa_c <> 29.543333333333333::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 29.543333333333333 the engine returned [graded field: advanced/osioka_wbgt_twa_c]', v_g_osioka_wbgt_twa_c;
  end if;
  if v_g_osioka_metabolic_twa_w <> 311.43333333333334::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 311.43333333333334 the engine returned [graded field: advanced/osioka_metabolic_twa_w]', v_g_osioka_metabolic_twa_w;
  end if;
  if v_g_osioka_extended_action_level_dba <> 82.54057305810645::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 82.54057305810645 the engine returned [graded field: advanced/osioka_extended_action_level_dba]', v_g_osioka_extended_action_level_dba;
  end if;
  if v_g_osioka_extended_action_dose_pct <> 68.99765774496588::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 68.99765774496588 the engine returned [graded field: advanced/osioka_extended_action_dose_pct]', v_g_osioka_extended_action_dose_pct;
  end if;
  if v_g_osioka_adjusted_limit_ppm <> 56.666666666666664::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 56.666666666666664 the engine returned [graded field: advanced/osioka_adjusted_limit_ppm]', v_g_osioka_adjusted_limit_ppm;
  end if;
  if v_g_osioka_adjusted_mixture_index <> 1.138235294117647::double precision then
    raise exception 'H2 go-live refused: the seeded value % is not the 1.138235294117647 the engine returned [graded field: advanced/osioka_adjusted_mixture_index]', v_g_osioka_adjusted_mixture_index;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- Nothing below calls the engine. The reference duration T = 8 / 2^((L - Lc)
  -- / q) and the noise dose D = 100 sum(C / T) are summed period by period with
  -- the threshold as a WHERE clause, so the threshold decides what is
  -- integrated in SQL exactly as it does in the engine; the dose-to-average
  -- step uses the coefficient each source PRINTS, 16.61 for OSHA and 10.0 for
  -- NIOSH; LEX,8h and the weekly LEX are energy sums; the protector credit, the
  -- chemical averages, the mixture indices, the extended-shift action level and
  -- the Brief and Scala factors are each the formula their own source writes.
  v_exposed := (16.61 * log((612.4) / 100.0) + 90.0);
  v_rf := least(least(1.0, (8.0 / 11.25) * ((24.0 - 11.25) / 16.0)), least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0)));
  if not (least(1.0, (8.0 / 11.25) * ((24.0 - 11.25) / 16.0)) < least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0))) then
    raise exception 'H2 go-live refused: the weekly Brief and Scala factor % is not above the daily factor %, and the Expert capstone is built on the daily factor governing', least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0)), least(1.0, (8.0 / 11.25) * ((24.0 - 11.25) / 16.0));
  end if;
  v_s_utorogu_osha_pel_dose_pct := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 90.0);
  if abs(v_s_utorogu_osha_pel_dose_pct - v_g_utorogu_osha_pel_dose_pct) > 1e-09 then
    raise exception 'H2 go-live refused: the noise dose summed period by period over the periods at or above the 90 dBA threshold gives %, against the seeded % [graded field: beginner/utorogu_osha_pel_dose_pct]', v_s_utorogu_osha_pel_dose_pct, v_g_utorogu_osha_pel_dose_pct;
  end if;
  v_s_utorogu_osha_pel_twa_dba := (16.61 * log((v_s_utorogu_osha_pel_dose_pct) / 100.0) + 90.0);
  if abs(v_s_utorogu_osha_pel_twa_dba - v_g_utorogu_osha_pel_twa_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the printed 16.61 coefficient on the second route noise dose, over the criterion of 90 dBA gives %, against the seeded % [graded field: beginner/utorogu_osha_pel_twa_dba]', v_s_utorogu_osha_pel_twa_dba, v_g_utorogu_osha_pel_twa_dba;
  end if;
  v_s_utorogu_action_level_dose_pct := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0);
  if abs(v_s_utorogu_action_level_dose_pct - v_g_utorogu_action_level_dose_pct) > 1e-09 then
    raise exception 'H2 go-live refused: the same record summed from the 80 dBA threshold of the action level setup gives %, against the seeded % [graded field: beginner/utorogu_action_level_dose_pct]', v_s_utorogu_action_level_dose_pct, v_g_utorogu_action_level_dose_pct;
  end if;
  v_s_utorogu_niosh_rel_dose_pct := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 85.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0);
  if abs(v_s_utorogu_niosh_rel_dose_pct - v_g_utorogu_niosh_rel_dose_pct) > 1e-09 then
    raise exception 'H2 go-live refused: the same record on the NIOSH criterion of 85 dBA and its 3 dB decibel exchange rate gives %, against the seeded % [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_s_utorogu_niosh_rel_dose_pct, v_g_utorogu_niosh_rel_dose_pct;
  end if;
  v_s_utorogu_niosh_rel_twa_dba := (10.0 * log((v_s_utorogu_niosh_rel_dose_pct) / 100.0) + 85.0);
  if abs(v_s_utorogu_niosh_rel_twa_dba - v_g_utorogu_niosh_rel_twa_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the printed 10.0 coefficient on the second route NIOSH noise dose, over the criterion of 85 dBA gives %, against the seeded % [graded field: beginner/utorogu_niosh_rel_twa_dba]', v_s_utorogu_niosh_rel_twa_dba, v_g_utorogu_niosh_rel_twa_dba;
  end if;
  v_s_utorogu_pel_minutes_left_min := ((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * (8.0 / power(2.0, (96.3 - 90.0) / 5.0)) * 60.0);
  if abs(v_s_utorogu_pel_minutes_left_min - v_g_utorogu_pel_minutes_left_min) > 1e-09 then
    raise exception 'H2 go-live refused: the unspent fraction times the reference duration at the loudest sound level, in minutes gives %, against the seeded % [graded field: beginner/utorogu_pel_minutes_left_min]', v_s_utorogu_pel_minutes_left_min, v_g_utorogu_pel_minutes_left_min;
  end if;
  v_s_amukpe_lex_8h_dba := (10.0 * log((select sum((v_a_h[g] / 8.0) * power(10.0, v_a_l[g] / 10.0)) from generate_series(1, 5) g)));
  if abs(v_s_amukpe_lex_8h_dba - v_g_amukpe_lex_8h_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the Schedule 1 energy sum normalised to eight hours gives %, against the seeded % [graded field: intermediate/amukpe_lex_8h_dba]', v_s_amukpe_lex_8h_dba, v_g_amukpe_lex_8h_dba;
  end if;
  v_s_amukpe_lex_weekly_dba := (10.0 * log((select sum(power(10.0, 0.1 * v_a_week[g])) from generate_series(1, 5) g) / 5.0));
  if abs(v_s_amukpe_lex_weekly_dba - v_g_amukpe_lex_weekly_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the energy average of the five stated days over the statutory divisor of five gives %, against the seeded % [graded field: intermediate/amukpe_lex_weekly_dba]', v_s_amukpe_lex_weekly_dba, v_g_amukpe_lex_weekly_dba;
  end if;
  v_s_amukpe_field_derated_exposure_dba := (v_exposed - greatest(0.0, (29.0 - 7.0) * 0.5));
  if abs(v_s_amukpe_field_derated_exposure_dba - v_g_amukpe_field_derated_exposure_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the time weighted average from the stated noise dose, less half of the rating credit gives %, against the seeded % [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_s_amukpe_field_derated_exposure_dba, v_g_amukpe_field_derated_exposure_dba;
  end if;
  v_s_amukpe_benzene_twa8h_ppm := ((select sum(v_b_c[g] * v_b_h[g]) from generate_series(1, 3) g) / 8.0);
  if abs(v_s_amukpe_benzene_twa8h_ppm - v_g_amukpe_benzene_twa8h_ppm) > 1e-09 then
    raise exception 'H2 go-live refused: the sum of concentration times hours over the divisor of eight the regulation writes gives %, against the seeded % [graded field: intermediate/amukpe_benzene_twa8h_ppm]', v_s_amukpe_benzene_twa8h_ppm, v_g_amukpe_benzene_twa8h_ppm;
  end if;
  v_s_amukpe_toluene_stel_ppm := ((select sum(v_st_c[g] * v_st_m[g]) from generate_series(1, 2) g) / 15.0);
  if abs(v_s_amukpe_toluene_stel_ppm - v_g_amukpe_toluene_stel_ppm) > 1e-09 then
    raise exception 'H2 go-live refused: the sum of concentration times minutes over the fifteen minute window gives %, against the seeded % [graded field: intermediate/amukpe_toluene_stel_ppm]', v_s_amukpe_toluene_stel_ppm, v_g_amukpe_toluene_stel_ppm;
  end if;
  v_s_amukpe_mixture_index := (select sum(v_mx_c[g] / (v_mx_l[g] * 1.0)) from generate_series(1, 3) g);
  if abs(v_s_amukpe_mixture_index - v_g_amukpe_mixture_index) > 1e-09 then
    raise exception 'H2 go-live refused: the additive index, each concentration over its own limit gives %, against the seeded % [graded field: intermediate/amukpe_mixture_index]', v_s_amukpe_mixture_index, v_g_amukpe_mixture_index;
  end if;
  v_s_osioka_wbgt_twa_c := ((select sum(v_wb_t[g] * v_wb_m[g]) from generate_series(1, 3) g) / (select sum(v_wb_m[g]) from generate_series(1, 3) g));
  if abs(v_s_osioka_wbgt_twa_c - v_g_osioka_wbgt_twa_c) > 1e-09 then
    raise exception 'H2 go-live refused: the stated readouts weighted by their own minutes gives %, against the seeded % [graded field: advanced/osioka_wbgt_twa_c]', v_s_osioka_wbgt_twa_c, v_g_osioka_wbgt_twa_c;
  end if;
  v_s_osioka_metabolic_twa_w := ((select sum(v_mt_w[g] * v_mt_m[g]) from generate_series(1, 3) g) / (select sum(v_mt_m[g]) from generate_series(1, 3) g));
  if abs(v_s_osioka_metabolic_twa_w - v_g_osioka_metabolic_twa_w) > 1e-09 then
    raise exception 'H2 go-live refused: the stated rates weighted by their own minutes gives %, against the seeded % [graded field: advanced/osioka_metabolic_twa_w]', v_s_osioka_metabolic_twa_w, v_g_osioka_metabolic_twa_w;
  end if;
  v_s_osioka_extended_action_level_dba := (16.61 * log(50.0 / (12.5 * 11.25)) + 90.0);
  if abs(v_s_osioka_extended_action_level_dba - v_g_osioka_extended_action_level_dba) > 1e-09 then
    raise exception 'H2 go-live refused: the extended-shift action level from the shift length gives %, against the seeded % [graded field: advanced/osioka_extended_action_level_dba]', v_s_osioka_extended_action_level_dba, v_g_osioka_extended_action_level_dba;
  end if;
  v_s_osioka_extended_action_dose_pct := (select 100.0 * coalesce(sum(v_od_h[g] / (8.0 / power(2.0, (v_od_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_od_l[g] >= 80.0);
  if abs(v_s_osioka_extended_action_dose_pct - v_g_osioka_extended_action_dose_pct) > 1e-09 then
    raise exception 'H2 go-live refused: the whole shift summed from the 80 dBA threshold with no rescaling to eight hours gives %, against the seeded % [graded field: advanced/osioka_extended_action_dose_pct]', v_s_osioka_extended_action_dose_pct, v_g_osioka_extended_action_dose_pct;
  end if;
  v_s_osioka_adjusted_limit_ppm := (100.0 * v_rf);
  if abs(v_s_osioka_adjusted_limit_ppm - v_g_osioka_adjusted_limit_ppm) > 1e-09 then
    raise exception 'H2 go-live refused: the stated limit times the governing reduction factor gives %, against the seeded % [graded field: advanced/osioka_adjusted_limit_ppm]', v_s_osioka_adjusted_limit_ppm, v_g_osioka_adjusted_limit_ppm;
  end if;
  v_s_osioka_adjusted_mixture_index := (select sum(v_sv_c[g] / (v_sv_l[g] * v_rf)) from generate_series(1, 3) g);
  if abs(v_s_osioka_adjusted_mixture_index - v_g_osioka_adjusted_mixture_index) > 1e-09 then
    raise exception 'H2 go-live refused: the additive index over limits each multiplied by the governing reduction factor gives %, against the seeded % [graded field: advanced/osioka_adjusted_mixture_index]', v_s_osioka_adjusted_mixture_index, v_g_osioka_adjusted_mixture_index;
  end if;
  -- THE LESSONS THESE INPUTS CARRY. A capstone whose numbers stopped making
  -- the tier's point still grades, and no count of rows can see that.
  if not (v_g_utorogu_osha_pel_dose_pct < 100.0 and v_g_utorogu_action_level_dose_pct > 50.0) then
    raise exception 'H2 go-live refused: the UTOROGU day no longer sits under the permissible exposure limit at % percent while over the action level at % percent [graded field: beginner/utorogu_osha_pel_dose_pct, beginner/utorogu_action_level_dose_pct]', v_g_utorogu_osha_pel_dose_pct, v_g_utorogu_action_level_dose_pct;
  end if;
  if not (v_g_utorogu_niosh_rel_dose_pct > 100.0) then
    raise exception 'H2 go-live refused: the UTOROGU day no longer exceeds the NIOSH noise REL at % percent [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_g_utorogu_niosh_rel_dose_pct;
  end if;
  if not (v_g_osioka_extended_action_dose_pct > 50.0
          and v_g_osioka_extended_action_dose_pct * (8.0 / 11.25) < 50.0) then
    raise exception 'H2 go-live refused: the OSIOKA shift noise dose of % percent no longer crosses 50 percent only because the shift is long [graded field: advanced/osioka_extended_action_dose_pct]', v_g_osioka_extended_action_dose_pct;
  end if;
  v_x := (select sum(v_sv_c[g] / (v_sv_l[g] * 1.0)) from generate_series(1, 3) g);
  if not (v_x < 1.0 and v_g_osioka_adjusted_mixture_index > 1.0) then
    raise exception 'H2 go-live refused: the OSIOKA mixture index is % unadjusted and % adjusted, and the Expert capstone is built on it passing unadjusted and failing adjusted [graded field: advanced/osioka_adjusted_mixture_index]', v_x, v_g_osioka_adjusted_mixture_index;
  end if;

  -- ------------------------------------------------- 3. the traps bite
  -- Each wrong reading is computed over the same inputs and must MISS the
  -- graded value by more than its tolerance, or the field does not
  -- discriminate the trap it is for.
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the 80 dBA threshold of the action level setup used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_dose_pct]', v_wrong, v_g_utorogu_osha_pel_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH 3 dB decibel exchange rate used on the OSHA criterion gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_dose_pct]', v_wrong, v_g_utorogu_osha_pel_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= -1000000000.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: no threshold applied, so every period integrated gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_dose_pct]', v_wrong, v_g_utorogu_osha_pel_dose_pct;
  end if;
  v_wrong := (16.609640474436812 * log((v_s_utorogu_osha_pel_dose_pct) / 100.0) + 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the exact 5 over log10 2 coefficient instead of the printed 16.61 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_twa_dba]', v_wrong, v_g_utorogu_osha_pel_twa_dba;
  end if;
  v_wrong := (10.0 * log((v_s_utorogu_osha_pel_dose_pct) / 100.0) + 85.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH coefficient and criterion used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_twa_dba]', v_wrong, v_g_utorogu_osha_pel_twa_dba;
  end if;
  v_wrong := (16.61 * log((v_s_utorogu_action_level_dose_pct) / 100.0) + 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the action level noise dose used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_twa_dba]', v_wrong, v_g_utorogu_osha_pel_twa_dba;
  end if;
  v_wrong := (16.61 * log((v_s_utorogu_osha_pel_dose_pct) / 100.0) + 0.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_osha_pel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the criterion left off the sum gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_osha_pel_twa_dba]', v_wrong, v_g_utorogu_osha_pel_twa_dba;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_action_level_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the 90 dBA threshold of the permissible exposure limit setup used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_action_level_dose_pct]', v_wrong, v_g_utorogu_action_level_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_action_level_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH 3 dB decibel exchange rate used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_action_level_dose_pct]', v_wrong, v_g_utorogu_action_level_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= -1000000000.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_action_level_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: no threshold applied, so every period integrated gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_action_level_dose_pct]', v_wrong, v_g_utorogu_action_level_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 85.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the OSHA 5 dB decibel exchange rate used on the NIOSH criterion gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_wrong, v_g_utorogu_niosh_rel_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 85.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the OSHA 90 dBA threshold used on the NIOSH criterion gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_wrong, v_g_utorogu_niosh_rel_dose_pct;
  end if;
  v_wrong := ((select 100.0 * coalesce(sum(v_u_h[g] / (8.0 / power(2.0, (v_u_l[g] - 85.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_u_l[g] >= 80.0) / 60.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH reference duration left in minutes while the periods are in hours gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_dose_pct]', v_wrong, v_g_utorogu_niosh_rel_dose_pct;
  end if;
  v_wrong := (9.965784284662087 * log((v_s_utorogu_niosh_rel_dose_pct) / 100.0) + 85.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the exact 3 over log10 2 coefficient instead of the printed 10.0 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_twa_dba]', v_wrong, v_g_utorogu_niosh_rel_twa_dba;
  end if;
  v_wrong := (16.61 * log((v_s_utorogu_niosh_rel_dose_pct) / 100.0) + 90.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the OSHA coefficient and criterion used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_twa_dba]', v_wrong, v_g_utorogu_niosh_rel_twa_dba;
  end if;
  v_wrong := (10.0 * log((v_s_utorogu_osha_pel_dose_pct) / 100.0) + 85.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_niosh_rel_twa_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the OSHA permissible exposure limit noise dose used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_niosh_rel_twa_dba]', v_wrong, v_g_utorogu_niosh_rel_twa_dba;
  end if;
  v_wrong := ((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * (8.0 / power(2.0, (96.3 - 90.0) / 5.0)));
  if v_wrong is null or abs(v_wrong - v_g_utorogu_pel_minutes_left_min) <= 5e-07 then
    raise exception 'H2 go-live refused: the remaining fraction left in hours gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_pel_minutes_left_min]', v_wrong, v_g_utorogu_pel_minutes_left_min;
  end if;
  v_wrong := ((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * (8.0 / power(2.0, (96.3 - 85.0) / 3.0)) * 60.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_pel_minutes_left_min) <= 5e-07 then
    raise exception 'H2 go-live refused: the reference duration taken on the NIOSH scale gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_pel_minutes_left_min]', v_wrong, v_g_utorogu_pel_minutes_left_min;
  end if;
  v_wrong := ((8.0 / power(2.0, (96.3 - 90.0) / 5.0)) * 60.0);
  if v_wrong is null or abs(v_wrong - v_g_utorogu_pel_minutes_left_min) <= 5e-07 then
    raise exception 'H2 go-live refused: the whole reference duration credited with no noise dose subtracted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/utorogu_pel_minutes_left_min]', v_wrong, v_g_utorogu_pel_minutes_left_min;
  end if;
  v_wrong := (10.0 * log((select sum((v_a_h[g] / 9.2) * power(10.0, v_a_l[g] / 10.0)) from generate_series(1, 5) g)));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_8h_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the day length used in place of the eight hours the metric normalises to gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_8h_dba]', v_wrong, v_g_amukpe_lex_8h_dba;
  end if;
  v_wrong := (10.0 * log((select sum(power(10.0, v_a_l[g] / 10.0)) / 5.0 from generate_series(1, 5) g)));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_8h_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the energy average taken with no duration weighting gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_8h_dba]', v_wrong, v_g_amukpe_lex_8h_dba;
  end if;
  v_wrong := ((select sum(v_a_l[g]) / 5.0 from generate_series(1, 5) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_8h_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the task sound levels gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_8h_dba]', v_wrong, v_g_amukpe_lex_8h_dba;
  end if;
  v_wrong := (10.0 * log((select sum(power(10.0, 0.1 * v_a_week[g])) from generate_series(1, 5) g) / 7.0));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_weekly_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the divisor taken as seven days gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_weekly_dba]', v_wrong, v_g_amukpe_lex_weekly_dba;
  end if;
  v_wrong := ((select sum(v_a_week[g]) / 5.0 from generate_series(1, 5) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_weekly_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the five daily values gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_weekly_dba]', v_wrong, v_g_amukpe_lex_weekly_dba;
  end if;
  v_wrong := (10.0 * log((select sum(power(10.0, 0.1 * v_a_week[g])) from generate_series(1, 5) g) / 1.0));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_lex_weekly_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the energy sum quoted with no divisor at all gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_lex_weekly_dba]', v_wrong, v_g_amukpe_lex_weekly_dba;
  end if;
  v_wrong := (v_exposed - (29.0 - 7.0));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_field_derated_exposure_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the OSHA Appendix B credit of the rating less seven, with no field derating gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_wrong, v_g_amukpe_field_derated_exposure_dba;
  end if;
  v_wrong := (v_exposed - 29.0);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_field_derated_exposure_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the labelled rating credited whole gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_wrong, v_g_amukpe_field_derated_exposure_dba;
  end if;
  v_wrong := (v_exposed - (0.75 * 29.0 - 7.0));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_field_derated_exposure_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH earmuff derating of 0.75 used instead gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_wrong, v_g_amukpe_field_derated_exposure_dba;
  end if;
  v_wrong := (v_exposed - (29.0 * 0.5 - 7.0));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_field_derated_exposure_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the seven subtracted after the halving instead of before gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_field_derated_exposure_dba]', v_wrong, v_g_amukpe_field_derated_exposure_dba;
  end if;
  v_wrong := ((select sum(v_b_c[g] * v_b_h[g]) from generate_series(1, 3) g) / (select sum(v_b_h[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_benzene_twa8h_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the sampled time used as the divisor instead of the eight hours the regulation writes gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_benzene_twa8h_ppm]', v_wrong, v_g_amukpe_benzene_twa8h_ppm;
  end if;
  v_wrong := ((select sum(v_b_c[g]) from generate_series(1, 3) g) / 3.0);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_benzene_twa8h_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the three concentrations gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_benzene_twa8h_ppm]', v_wrong, v_g_amukpe_benzene_twa8h_ppm;
  end if;
  v_wrong := (select sum(v_b_c[g] * v_b_h[g]) from generate_series(1, 3) g);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_benzene_twa8h_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the sum of the products quoted with no divisor gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_benzene_twa8h_ppm]', v_wrong, v_g_amukpe_benzene_twa8h_ppm;
  end if;
  v_wrong := ((select sum(v_st_c[g] * v_st_m[g]) from generate_series(1, 2) g) / (select sum(v_st_m[g]) from generate_series(1, 2) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_toluene_stel_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the sampled minutes used as the divisor instead of the fifteen the window is gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_toluene_stel_ppm]', v_wrong, v_g_amukpe_toluene_stel_ppm;
  end if;
  v_wrong := ((select sum(v_st_c[g]) from generate_series(1, 2) g) / 2.0);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_toluene_stel_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the two readings gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_toluene_stel_ppm]', v_wrong, v_g_amukpe_toluene_stel_ppm;
  end if;
  v_wrong := (select sum(v_st_c[g] * v_st_m[g]) from generate_series(1, 2) g);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_toluene_stel_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the sum of the products quoted with no divisor gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_toluene_stel_ppm]', v_wrong, v_g_amukpe_toluene_stel_ppm;
  end if;
  v_wrong := ((select sum(v_mx_c[g]) from generate_series(1, 3) g) / (select sum(v_mx_l[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the concentrations summed over the summed limits gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_mixture_index]', v_wrong, v_g_amukpe_mixture_index;
  end if;
  v_wrong := ((select sum(v_mx_c[g] / (v_mx_l[g] * 1.0)) from generate_series(1, 3) g) / 3.0);
  if v_wrong is null or abs(v_wrong - v_g_amukpe_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the mean of the three ratios instead of their sum gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_mixture_index]', v_wrong, v_g_amukpe_mixture_index;
  end if;
  v_wrong := ((select max(v_mx_c[g] / v_mx_l[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_amukpe_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the largest single ratio quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/amukpe_mixture_index]', v_wrong, v_g_amukpe_mixture_index;
  end if;
  v_wrong := ((select sum(v_wb_t[g]) from generate_series(1, 3) g) / 3.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_wbgt_twa_c) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the three readouts gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_wbgt_twa_c]', v_wrong, v_g_osioka_wbgt_twa_c;
  end if;
  v_wrong := ((select sum(v_wb_t[g] * v_mt_w[g]) from generate_series(1, 3) g) / (select sum(v_mt_w[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_osioka_wbgt_twa_c) <= 5e-07 then
    raise exception 'H2 go-live refused: weighted by the metabolic rates instead of the minutes gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_wbgt_twa_c]', v_wrong, v_g_osioka_wbgt_twa_c;
  end if;
  v_wrong := ((select max(v_wb_t[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_osioka_wbgt_twa_c) <= 5e-07 then
    raise exception 'H2 go-live refused: the highest readout quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_wbgt_twa_c]', v_wrong, v_g_osioka_wbgt_twa_c;
  end if;
  v_wrong := ((select sum(v_mt_w[g]) from generate_series(1, 3) g) / 3.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_metabolic_twa_w) <= 5e-07 then
    raise exception 'H2 go-live refused: the arithmetic mean of the three rates gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_metabolic_twa_w]', v_wrong, v_g_osioka_metabolic_twa_w;
  end if;
  v_wrong := ((select sum(v_mt_w[g] * v_wb_t[g]) from generate_series(1, 3) g) / (select sum(v_wb_t[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_osioka_metabolic_twa_w) <= 5e-07 then
    raise exception 'H2 go-live refused: weighted by the temperature readouts instead of the minutes gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_metabolic_twa_w]', v_wrong, v_g_osioka_metabolic_twa_w;
  end if;
  v_wrong := ((select max(v_mt_w[g]) from generate_series(1, 3) g));
  if v_wrong is null or abs(v_wrong - v_g_osioka_metabolic_twa_w) <= 5e-07 then
    raise exception 'H2 go-live refused: the highest rate quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_metabolic_twa_w]', v_wrong, v_g_osioka_metabolic_twa_w;
  end if;
  v_wrong := (16.609640474436812 * log(50.0 / (12.5 * 11.25)) + 90.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_level_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the exact 5 over log10 2 coefficient instead of the printed 16.61 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_level_dba]', v_wrong, v_g_osioka_extended_action_level_dba;
  end if;
  v_wrong := 85.0;
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_level_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the eight-hour action level of 85 dBA quoted for a long shift gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_level_dba]', v_wrong, v_g_osioka_extended_action_level_dba;
  end if;
  v_wrong := (16.61 * log(50.0 / 11.25) + 90.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_level_dba) <= 5e-07 then
    raise exception 'H2 go-live refused: the shift hours used where the 12.5 belongs gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_level_dba]', v_wrong, v_g_osioka_extended_action_level_dba;
  end if;
  v_wrong := (v_s_osioka_extended_action_dose_pct * (8.0 / 11.25));
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the shift rescaled to eight hours gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_dose_pct]', v_wrong, v_g_osioka_extended_action_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_od_h[g] / (8.0 / power(2.0, (v_od_l[g] - 90.0) / 5.0))), 0.0) from generate_series(1, 5) g where v_od_l[g] >= 90.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the 90 dBA threshold of the permissible exposure limit setup used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_dose_pct]', v_wrong, v_g_osioka_extended_action_dose_pct;
  end if;
  v_wrong := (select 100.0 * coalesce(sum(v_od_h[g] / (8.0 / power(2.0, (v_od_l[g] - 90.0) / 3.0))), 0.0) from generate_series(1, 5) g where v_od_l[g] >= 80.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_extended_action_dose_pct) <= 5e-07 then
    raise exception 'H2 go-live refused: the NIOSH 3 dB decibel exchange rate used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_extended_action_dose_pct]', v_wrong, v_g_osioka_extended_action_dose_pct;
  end if;
  v_wrong := (100.0 * least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0)));
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_limit_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the weekly factor used instead of the governing daily one gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_limit_ppm]', v_wrong, v_g_osioka_adjusted_limit_ppm;
  end if;
  v_wrong := (100.0 * 1.0);
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_limit_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the limit left unadjusted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_limit_ppm]', v_wrong, v_g_osioka_adjusted_limit_ppm;
  end if;
  v_wrong := (100.0 * least(1.0, (8.0 / 11.25) * ((24.0 - 11.25) / 16.0)) * least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0)));
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_limit_ppm) <= 5e-07 then
    raise exception 'H2 go-live refused: the two factors multiplied together gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_limit_ppm]', v_wrong, v_g_osioka_adjusted_limit_ppm;
  end if;
  v_wrong := (select sum(v_sv_c[g] / (v_sv_l[g] * 1.0)) from generate_series(1, 3) g);
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the limits left unadjusted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_mixture_index]', v_wrong, v_g_osioka_adjusted_mixture_index;
  end if;
  v_wrong := (select sum(v_sv_c[g] / (v_sv_l[g] * (least(1.0, (40.0 / 45.0) * ((168.0 - 45.0) / 128.0))))) from generate_series(1, 3) g);
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the weekly factor used instead of the governing daily one gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_mixture_index]', v_wrong, v_g_osioka_adjusted_mixture_index;
  end if;
  v_wrong := ((select sum(v_sv_c[g] / (v_sv_l[g] * 1.0)) from generate_series(1, 3) g) * v_rf);
  if v_wrong is null or abs(v_wrong - v_g_osioka_adjusted_mixture_index) <= 5e-07 then
    raise exception 'H2 go-live refused: the factor applied to the concentrations instead of the limits gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/osioka_adjusted_mixture_index]', v_wrong, v_g_osioka_adjusted_mixture_index;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'hygiene';
  if not exists (select 1 from public.academy_apps where slug = 'hygiene' and status = 'available') then
    raise exception 'H2 go-live refused: hygiene did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H2 go-live: hygiene available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
