-- ============================================================================
-- H1 GO-LIVE (HELD): Safety Performance Statistics & KPIs flips to
-- 'available', the FIRST course of the HSE module, at path_order 61.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/safetystats. The 78 lessons, the teaching lab
-- (safetystatsLab.js) and its three explorer panels (rates, intervals and the
-- u-chart) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h1_capstone.mjs returned through
--      the vendored engines/hse/safetyStats.js when this file was generated,
--      to the last bit, so a capstone row an earlier seed left behind, or a
--      move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and states every month it sums, then recomputes the rates, the
--      rolling window and the u-chart by sum then divide, finds the signalling
--      month itself, and asserts the Garwood, zero-event and rate-ratio limits
--      BY THE EQUATION THEY ARE A ROOT OF (a Poisson or binomial tail summed in
--      SQL landing on 0.025) and the three p-values as twice the smaller tail;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7
-- with a label and a unit, the six-decimal answer the prompt asks for must
-- pass, and one unit either side of it in the sixth decimal must fail. All of
-- it is asserted here, on the rows as seeded.
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
  v_ubar double precision; v_units double precision[];
  v_flagged int[]; v_kept int[];
  v_g_okrika_combined_trir_per_200k double precision; v_s_okrika_combined_trir_per_200k double precision;
  v_g_okrika_combined_ltir_per_1m double precision; v_s_okrika_combined_ltir_per_1m double precision;
  v_g_okrika_far_per_100m double precision; v_s_okrika_far_per_100m double precision;
  v_g_okrika_severity_rate_per_200k double precision; v_s_okrika_severity_rate_per_200k double precision;
  v_g_okrika_tier1_pse_rate_per_200k double precision; v_s_okrika_tier1_pse_rate_per_200k double precision;
  v_g_okrika_rolling12_trir_month14_per_200k double precision; v_s_okrika_rolling12_trir_month14_per_200k double precision;
  v_g_bonny_alpha_trir_lower95_per_200k double precision; v_s_bonny_alpha_trir_lower95_per_200k double precision;
  v_g_bonny_alpha_trir_upper95_per_200k double precision; v_s_bonny_alpha_trir_upper95_per_200k double precision;
  v_g_bonny_crew_zero_event_upper95_per_200k double precision; v_s_bonny_crew_zero_event_upper95_per_200k double precision;
  v_g_bonny_rate_ratio_lower95 double precision; v_s_bonny_rate_ratio_lower95 double precision;
  v_g_bonny_rate_ratio_upper95 double precision; v_s_bonny_rate_ratio_upper95 double precision;
  v_g_bonny_compare_p_value double precision; v_s_bonny_compare_p_value double precision;
  v_g_forcados_centre_per_200k double precision; v_s_forcados_centre_per_200k double precision;
  v_g_forcados_ucl_month09_per_200k double precision; v_s_forcados_ucl_month09_per_200k double precision;
  v_g_forcados_lcl_month07_per_200k double precision; v_s_forcados_lcl_month07_per_200k double precision;
  v_g_forcados_revised_centre_per_200k double precision; v_s_forcados_revised_centre_per_200k double precision;
  v_g_forcados_before_after_p_value double precision; v_s_forcados_before_after_p_value double precision;
  v_g_forcados_before_after_p_value_without_month06 double precision; v_s_forcados_before_after_p_value_without_month06 double precision;
  v_ok_c int[] := array[1, 2, 0, 1, 3, 1, 0, 2, 1, 2, 1, 2, 1, 1];
  v_ok_h double precision[] := array[452115.0, 439760.0, 468930.0, 27450.0, 446205.0, 461880.0, 455330.0, 448615.0, 470470.0, 441905.0, 458240.0, 402975.0, 449820.0, 36180.0];
  v_fc_c int[] := array[14, 11, 17, 9, 13, 38, 21, 12, 2, 13, 10, 11];
  v_fc_h double precision[] := array[736410.0, 702885.0, 781260.0, 544370.0, 719935.0, 902640.0, 1386215.0, 748120.0, 118460.0, 731055.0, 694830.0, 752390.0];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'safetystats' and active;
  if v_structures <> 3 then
    raise exception 'H1 go-live refused: safetystats has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'safetystats';
  if v_questions <> 396 then
    raise exception 'H1 go-live refused: safetystats has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'safetystats'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'safetystats' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'safetystats' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'safetystats'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'safetystats' and s.active;
  if v_lessons <> 78 then
    raise exception 'H1 go-live refused: safetystats carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'safetystats' and s.active;
  if v_modules <> 18 then
    raise exception 'H1 go-live refused: safetystats carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'safetystats' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'safetystats';
  if v_capstones <> 3 then
    raise exception 'H1 go-live refused: safetystats has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'safetystats';
  if v_graded <> 18 then
    raise exception 'H1 go-live refused: safetystats has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'safetystats' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'safetystats' and module = 'hse'
                    and path_order = 61 and prereq_slug is null) then
    raise exception 'H1 go-live refused: the safetystats catalogue row is not hse at path_order 61 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 61 and slug <> 'safetystats') then
    raise exception 'H1 go-live refused: another course already holds path_order 61';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at the six-decimal floor, with a
  -- label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to six decimals, must pass abs(answer - expected) <= tol
  -- in numeric exactly as academy_submit_capstone computes it, and one unit in
  -- the sixth decimal either side of it must fail.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads

  -- beginner: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'safetystats' and tier = 'beginner';
  if md5(v_prompt) <> '4ae43ab94bd22aa4640ebce0c46bf4d8' then
    raise exception 'H1 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'safetystats' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'OKRIKA, an export terminal''s annual safety report and fourteen months of recordable cases' and title = 'What the rate is, on the base the report names') then
    raise exception 'H1 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every month the second route sums is stated, count paired with hours,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['month 1, 1 recordable case in 452115 hours; ', '; month 2, 2 in 439760;', '; month 3, 0 in 468930;', '; month 4, 1 in 27450;', '; month 5, 3 in 446205;', '; month 6, 1 in 461880;', '; month 7, 0 in 455330;', '; month 8, 2 in 448615;', '; month 9, 1 in 470470;', '; month 10, 2 in 441905;', '; month 11, 1 in 458240;', '; month 12, 2 in 402975;', '; month 13, 1 in 449820;', '; month 14, 1 in 36180.']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % beginner month(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;

  -- intermediate: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'safetystats' and tier = 'intermediate';
  if md5(v_prompt) <> '712c8197738ae4707b0827dc618f557c' then
    raise exception 'H1 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'safetystats' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'BONNY, two contractor crews on one scope and a small crew with no recordable case' and title = 'How sure each rate is, and whether the two crews differ') then
    raise exception 'H1 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;

  -- advanced: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'safetystats' and tier = 'advanced';
  if md5(v_prompt) <> '425fb2232ae0e7d26bcd14e329b58c8f' then
    raise exception 'H1 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'safetystats' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'FORCADOS, a year of monthly recordable cases on a u-chart around an intervention' and title = 'Whether anything is changing, and what one month does to the answer') then
    raise exception 'H1 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every month the second route sums is stated, count paired with hours,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['month 1, 14 recordable cases in 736410 hours; ', '; month 2, 11 in 702885;', '; month 3, 17 in 781260;', '; month 4, 9 in 544370;', '; month 5, 13 in 719935;', '; month 6, 38 in 902640;', '; month 7, 21 in 1386215;', '; month 8, 12 in 748120;', '; month 9, 2 in 118460;', '; month 10, 13 in 731055;', '; month 11, 10 in 694830;', '; month 12, 11 in 752390.']) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % advanced month(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_okrika_combined_trir_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_combined_trir_per_200k';
  select (f->>'expected')::double precision into v_g_okrika_combined_ltir_per_1m
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_combined_ltir_per_1m';
  select (f->>'expected')::double precision into v_g_okrika_far_per_100m
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_far_per_100m';
  select (f->>'expected')::double precision into v_g_okrika_severity_rate_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_severity_rate_per_200k';
  select (f->>'expected')::double precision into v_g_okrika_tier1_pse_rate_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_tier1_pse_rate_per_200k';
  select (f->>'expected')::double precision into v_g_okrika_rolling12_trir_month14_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'beginner' and f->>'key' = 'okrika_rolling12_trir_month14_per_200k';
  select (f->>'expected')::double precision into v_g_bonny_alpha_trir_lower95_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_alpha_trir_lower95_per_200k';
  select (f->>'expected')::double precision into v_g_bonny_alpha_trir_upper95_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_alpha_trir_upper95_per_200k';
  select (f->>'expected')::double precision into v_g_bonny_crew_zero_event_upper95_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_crew_zero_event_upper95_per_200k';
  select (f->>'expected')::double precision into v_g_bonny_rate_ratio_lower95
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_rate_ratio_lower95';
  select (f->>'expected')::double precision into v_g_bonny_rate_ratio_upper95
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_rate_ratio_upper95';
  select (f->>'expected')::double precision into v_g_bonny_compare_p_value
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'intermediate' and f->>'key' = 'bonny_compare_p_value';
  select (f->>'expected')::double precision into v_g_forcados_centre_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_centre_per_200k';
  select (f->>'expected')::double precision into v_g_forcados_ucl_month09_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_ucl_month09_per_200k';
  select (f->>'expected')::double precision into v_g_forcados_lcl_month07_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_lcl_month07_per_200k';
  select (f->>'expected')::double precision into v_g_forcados_revised_centre_per_200k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_revised_centre_per_200k';
  select (f->>'expected')::double precision into v_g_forcados_before_after_p_value
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_before_after_p_value';
  select (f->>'expected')::double precision into v_g_forcados_before_after_p_value_without_month06
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'safetystats' and c.tier = 'advanced' and f->>'key' = 'forcados_before_after_p_value_without_month06';
  if v_g_okrika_combined_trir_per_200k is null
     or v_g_okrika_combined_ltir_per_1m is null
     or v_g_okrika_far_per_100m is null
     or v_g_okrika_severity_rate_per_200k is null
     or v_g_okrika_tier1_pse_rate_per_200k is null
     or v_g_okrika_rolling12_trir_month14_per_200k is null
     or v_g_bonny_alpha_trir_lower95_per_200k is null
     or v_g_bonny_alpha_trir_upper95_per_200k is null
     or v_g_bonny_crew_zero_event_upper95_per_200k is null
     or v_g_bonny_rate_ratio_lower95 is null
     or v_g_bonny_rate_ratio_upper95 is null
     or v_g_bonny_compare_p_value is null
     or v_g_forcados_centre_per_200k is null
     or v_g_forcados_ucl_month09_per_200k is null
     or v_g_forcados_lcl_month07_per_200k is null
     or v_g_forcados_revised_centre_per_200k is null
     or v_g_forcados_before_after_p_value is null
     or v_g_forcados_before_after_p_value_without_month06 is null then
    raise exception 'H1 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner/okrika_combined_trir_per_200k, beginner/okrika_combined_ltir_per_1m, beginner/okrika_far_per_100m, beginner/okrika_severity_rate_per_200k, beginner/okrika_tier1_pse_rate_per_200k, beginner/okrika_rolling12_trir_month14_per_200k, intermediate/bonny_alpha_trir_lower95_per_200k, intermediate/bonny_alpha_trir_upper95_per_200k, intermediate/bonny_crew_zero_event_upper95_per_200k, intermediate/bonny_rate_ratio_lower95, intermediate/bonny_rate_ratio_upper95, intermediate/bonny_compare_p_value, advanced/forcados_centre_per_200k, advanced/forcados_ucl_month09_per_200k, advanced/forcados_lcl_month07_per_200k, advanced/forcados_revised_centre_per_200k, advanced/forcados_before_after_p_value, advanced/forcados_before_after_p_value_without_month06]';
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
   where c.app_slug = 'safetystats' and p.app_slug = 'safetystats'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner at
  -- least 100 numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '([0-9]+(\.[0-9]+)?)', 'g') m
   where p.app_slug = 'safetystats';
  if v_n < 100 then
    raise exception 'H1 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'safetystats') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'safetystats') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(a.e - b.e) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;

  -- EVERY NUMBER THE TEACHING DIGEST PRINTS (434 of them), at each
  -- field's SHIPPED tolerance. A graded value on one of them is a lookup.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 0.000301, 0.000611, 0.024805, 0.025, 0.025000000000000022, 0.025317807984, 0.025879, 0.039551, 0.048748, 0.05, 0.050000000000000044, 0.050636, 0.051759, 0.086257, 0.128104, 0.172515, 0.210374, 0.241552, 0.242209, 0.242209278544, 0.242424, 0.25, 0.256209, 0.333333, 0.34503, 0.352941, 0.35731, 0.357764, 0.402628, 0.431287, 0.48615, 0.5, 0.504944, 0.526295, 0.550271, 0.576156, 0.607952, 0.618672122896, 0.621694, 0.649395, 0.677882, 0.74654, 0.769438, 0.77, 0.776317, 0.8, 0.809223, 0.81, 0.82, 0.820324, 0.826095, 0.833228, 0.840001, 0.862575, 0.9, 0.909256, 0.911835, 0.920345, 0.926827, 0.933593, 0.936592, 0.945403, 0.95, 0.951727, 0.951893, 0.956795, 0.959078, 0.968312, 0.973261, 0.975, 0.975386, 0.979567, 0.981012, 0.982603, 0.983436, 0.985612, 0.99, 0.990126, 0.990863, 0.991404, 0.992753, 1.0, 1.001425, 1.006289, 1.011164, 1.015454, 1.018563, 1.018693, 1.02, 1.028627, 1.086218, 1.1, 1.100207, 1.14, 1.161259, 1.171189, 1.2, 1.207931, 1.208038, 1.209454, 1.221652, 1.257771, 1.279566, 1.29, 1.306019, 1.359497, 1.407182, 1.456, 1.48205, 1.484439, 1.494848, 1.5, 1.52, 1.613424, 1.623486390118, 1.62728, 1.717033, 1.725149, 1.731302, 1.75476, 1.755328, 1.776261, 1.812185, 1.8594, 1.863325, 1.883239, 1.905851, 1.92, 1.9228, 1.93, 1.9347, 1.9406, 1.96355, 1.974139, 1.99235, 2.0, 2.008969, 2.01175, 2.0262, 2.026485, 2.02731, 2.028541, 2.03, 2.0373374787, 2.047326, 2.04965, 2.061218, 2.067504, 2.0803, 2.1, 2.10545, 2.111567, 2.191251, 2.29, 2.302585092994, 2.32, 2.34, 2.389523, 2.41, 2.432536, 2.437872, 2.46, 2.475775, 2.497142, 2.5, 2.509599, 2.512443, 2.528411, 2.528691, 2.537201, 2.636751, 2.73, 2.81436305152, 2.893273, 2.914319, 2.927329, 2.982478, 2.995732273554, 3.0, 3.088838, 3.202958, 3.25309, 3.285315691895, 3.3, 3.373705, 3.445148, 3.491239, 3.5, 3.59, 3.63, 3.678071, 3.688879454114, 3.835008, 3.881586, 3.894766804876, 4.0, 4.667333, 4.795388696132, 4.796684, 4.8, 4.96531, 5.0, 5.181, 5.237783, 5.269483, 5.283194, 5.291761, 5.298317366548, 5.30341, 5.321021, 5.335335, 5.339055, 5.346612, 5.388087, 5.45, 5.454545, 5.546326, 5.571643390939, 5.597615, 5.62872610304, 5.687703, 5.79, 6.0, 6.039396, 6.091641, 6.17, 6.410039, 6.457588, 6.478154, 6.49, 6.491006, 6.508479, 6.534895, 6.556366, 6.561947, 6.573282, 6.62, 6.635494, 6.84, 7.0, 7.084918, 7.187207, 7.211338, 7.224687667724, 7.224688, 7.377758908228, 7.39, 7.599326, 7.772371, 8.0, 8.01, 8.227913, 8.280716, 8.767273069742, 9.0, 9.11759, 9.26, 10.0, 10.21192, 10.964912, 11.0, 11.143287, 11.150533, 11.668332079323, 11.770914461548, 12.0, 12.408545, 13.0, 13.148113802432, 14.0, 14.422675361702, 14.507178, 14.527845, 15.0, 16.0, 16.1, 17.0, 17.133593268913, 17.863823, 18.0, 18.390356042018, 18.420680743952, 18.420680743953, 19.0, 20.0, 21.0, 21.77465, 21.887976311285, 22.0, 23.0, 24.0, 24.863388, 25.0, 25.657711, 26.0, 27.0, 28.0, 28.845350723405, 29.828286, 32.0, 33.0, 35.0, 36.841361477855, 36.841361487905, 40.0, 41.403581, 44.196051, 45.174452079421, 45.5, 47.0, 48.0, 50.0, 52.0, 55.0, 55.262042231857, 55.262086475787, 58.0, 61.0, 63.0, 69.077552789821, 69.079151984682, 78.287893161798, 81.363991250923, 90.0, 95.0, 96.0, 100.0, 121.626793792427, 156.0, 200.0, 220.068159, 300.0, 312.0, 337.0, 388.158576, 399.0, 400.0, 500.0, 627.0, 754.0, 938.973018407692, 1000.0, 1063.952136016309, 1936.0, 1940.0, 2000.0, 2010.0, 2020.0, 2021.0, 2022.0, 2023.0, 2024.0, 3071.0, 5000.0, 18240.0, 41300.0, 61480.0, 80000.0, 90000.0, 97230.0, 100000.0, 116480.0, 150000.0, 180000.0, 196330.0, 198750.0, 200000.0, 201460.0, 205880.0, 208520.0, 209880.0, 210000.0, 212400.0, 214670.0, 215790.0, 219960.0, 222150.0, 224310.0, 231040.0, 240500.0, 296410.0, 355200.0, 368887.945411, 371880.0, 384560.0, 386940.0, 388120.0, 392710.0, 398470.0, 400000.0, 402350.0, 405240.0, 409930.0, 421090.0, 500000.0, 512300.0, 737775.890823, 846200.0, 902700.0, 980199.0, 1000000.0, 1048900.0, 1392750.0, 1475551.781646, 1650000.0, 1830000.0, 1904760.0, 1965920.0, 1967920.0, 2000000.0, 2143920.0, 2149730.0, 2152250.0, 2152440.0, 2238950.0, 2318640.0, 2389010.0, 2478540.0, 2951103.563291, 4700000.0, 4800000.0, 5000000.0, 5200000.0, 5500000.0, 6100000.0, 10000000.0, 100000000.0, 2544201000.0, 2579000000.0, 2679026000.0, 3291382000.0, 3795000000.0, 4158877000.0]::double precision[]) pub
   where c.app_slug = 'safetystats'
     and abs((f->>'expected')::double precision - pub) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;


  -- ------------------------------------------ 1. against the engine ledger
  -- The values h1_capstone.mjs returned through the vendored engine, to the
  -- last bit. A seeded value that is not the engine's is refused by name.
  if v_g_okrika_combined_trir_per_200k <> 0.6433615641728029::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.6433615641728029 the engine returned [graded field: beginner/okrika_combined_trir_per_200k]', v_g_okrika_combined_trir_per_200k;
  end if;
  if v_g_okrika_combined_ltir_per_1m <> 0.8042019552160036::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.8042019552160036 the engine returned [graded field: beginner/okrika_combined_ltir_per_1m]', v_g_okrika_combined_ltir_per_1m;
  end if;
  if v_g_okrika_far_per_100m <> 20.10504888040009::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 20.10504888040009 the engine returned [graded field: beginner/okrika_far_per_100m]', v_g_okrika_far_per_100m;
  end if;
  if v_g_okrika_severity_rate_per_200k <> 7.519288281269634::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 7.519288281269634 the engine returned [graded field: beginner/okrika_severity_rate_per_200k]', v_g_okrika_severity_rate_per_200k;
  end if;
  if v_g_okrika_tier1_pse_rate_per_200k <> 0.12063029328240055::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.12063029328240055 the engine returned [graded field: beginner/okrika_tier1_pse_rate_per_200k]', v_g_okrika_tier1_pse_rate_per_200k;
  end if;
  if v_g_okrika_rolling12_trir_month14_per_200k <> 0.6567425569176882::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.6567425569176882 the engine returned [graded field: beginner/okrika_rolling12_trir_month14_per_200k]', v_g_okrika_rolling12_trir_month14_per_200k;
  end if;
  if v_g_bonny_alpha_trir_lower95_per_200k <> 1.3441464210661842::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 1.3441464210661842 the engine returned [graded field: intermediate/bonny_alpha_trir_lower95_per_200k]', v_g_bonny_alpha_trir_lower95_per_200k;
  end if;
  if v_g_bonny_alpha_trir_upper95_per_200k <> 5.580169007877703::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 5.580169007877703 the engine returned [graded field: intermediate/bonny_alpha_trir_upper95_per_200k]', v_g_bonny_alpha_trir_upper95_per_200k;
  end if;
  if v_g_bonny_crew_zero_event_upper95_per_200k <> 8.829295007453174::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 8.829295007453174 the engine returned [graded field: intermediate/bonny_crew_zero_event_upper95_per_200k]', v_g_bonny_crew_zero_event_upper95_per_200k;
  end if;
  if v_g_bonny_rate_ratio_lower95 <> 0.9788650276137694::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.9788650276137694 the engine returned [graded field: intermediate/bonny_rate_ratio_lower95]', v_g_bonny_rate_ratio_lower95;
  end if;
  if v_g_bonny_rate_ratio_upper95 <> 9.332895636622686::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 9.332895636622686 the engine returned [graded field: intermediate/bonny_rate_ratio_upper95]', v_g_bonny_rate_ratio_upper95;
  end if;
  if v_g_bonny_compare_p_value <> 0.05508741246272278::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.05508741246272278 the engine returned [graded field: intermediate/bonny_compare_p_value]', v_g_bonny_compare_p_value;
  end if;
  if v_g_forcados_centre_per_200k <> 3.878179795590441::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 3.878179795590441 the engine returned [graded field: advanced/forcados_centre_per_200k]', v_g_forcados_centre_per_200k;
  end if;
  if v_g_forcados_ucl_month09_per_200k <> 11.55469930741927::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 11.55469930741927 the engine returned [graded field: advanced/forcados_ucl_month09_per_200k]', v_g_forcados_ucl_month09_per_200k;
  end if;
  if v_g_forcados_lcl_month07_per_200k <> 1.634117414998765::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 1.634117414998765 the engine returned [graded field: advanced/forcados_lcl_month07_per_200k]', v_g_forcados_lcl_month07_per_200k;
  end if;
  if v_g_forcados_revised_centre_per_200k <> 3.3603126859383545::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 3.3603126859383545 the engine returned [graded field: advanced/forcados_revised_centre_per_200k]', v_g_forcados_revised_centre_per_200k;
  end if;
  if v_g_forcados_before_after_p_value <> 0.011814431372499143::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.011814431372499143 the engine returned [graded field: advanced/forcados_before_after_p_value]', v_g_forcados_before_after_p_value;
  end if;
  if v_g_forcados_before_after_p_value_without_month06 <> 0.3869280005870388::double precision then
    raise exception 'H1 go-live refused: the seeded value % is not the 0.3869280005870388 the engine returned [graded field: advanced/forcados_before_after_p_value_without_month06]', v_g_forcados_before_after_p_value_without_month06;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OKRIKA. Every rate is a count times its base over the hours of
  -- both workforces; the rolling window ending at month 14 is months 3 to 14,
  -- summed and then divided.
  if abs(v_g_okrika_combined_trir_per_200k - (16 * 200000.0 / (1846220.0 + 3127655.0))) > 1e-12
     or abs(v_g_okrika_combined_ltir_per_1m - (4 * 1000000.0 / (1846220.0 + 3127655.0))) > 1e-12
     or abs(v_g_okrika_far_per_100m - (1 * 100000000.0 / (1846220.0 + 3127655.0))) > 1e-11
     or abs(v_g_okrika_severity_rate_per_200k - (187 * 200000.0 / (1846220.0 + 3127655.0))) > 1e-12
     or abs(v_g_okrika_tier1_pse_rate_per_200k - (3 * 200000.0 / (1846220.0 + 3127655.0))) > 1e-12 then
    raise exception 'H1 go-live refused: the second route in SQL does not reproduce the OKRIKA annual rates from the counts and hours in the prompt [graded field: beginner/okrika_combined_trir_per_200k, beginner/okrika_combined_ltir_per_1m, beginner/okrika_far_per_100m, beginner/okrika_severity_rate_per_200k, beginner/okrika_tier1_pse_rate_per_200k]';
  end if;
  if (select sum(v_ok_h[g]) from generate_series(1, 12) g) <> 4973875.0 or (select sum(v_ok_c[g]) from generate_series(1, 12) g) <> 16 then
    raise exception 'H1 go-live refused: OKRIKA months 1 to 12 do not sum to the annual report the prompt states';
  end if;
  v_s_okrika_rolling12_trir_month14_per_200k := (select sum(v_ok_c[g]) from generate_series(3, 14) g) * 200000.0 / (select sum(v_ok_h[g]) from generate_series(3, 14) g);
  if abs(v_s_okrika_rolling12_trir_month14_per_200k - v_g_okrika_rolling12_trir_month14_per_200k) > 1e-12 then
    raise exception 'H1 go-live refused: the second route in SQL gives % for the window of months 3 to 14, against the seeded % [graded field: beginner/okrika_rolling12_trir_month14_per_200k]', v_s_okrika_rolling12_trir_month14_per_200k, v_g_okrika_rolling12_trir_month14_per_200k;
  end if;

  -- PROFESSIONAL, BONNY. The Garwood limits are the roots of the two Poisson
  -- tails at 0.025: at the lower limit's mean the chance of 9 or more is
  -- 0.025, and at the upper limit's mean the chance of 9 or fewer is 0.025.
  -- The zero-event limit's mean is where exp(-mu) is 0.025. The rate-ratio
  -- limits stand for conditional proportions p = x / (1 + x), x = ratio times
  -- Alpha's hours over Beta's, and are the roots of the two binomial tails of
  -- 9 in 16. Each tail is summed term by term here.
  v_x := 1.0 - (select sum(exp(-(v_g_bonny_alpha_trir_lower95_per_200k * 612340.0 / 200000.0) + j * ln(v_g_bonny_alpha_trir_lower95_per_200k * 612340.0 / 200000.0) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g))) from generate_series(0, 8) j);
  if abs(v_x - 0.025000000000000022) > 1e-12 then
    raise exception 'H1 go-live refused: at the seeded lower limit % the chance of 9 or more is %, and a Garwood lower limit makes it 0.025 [graded field: intermediate/bonny_alpha_trir_lower95_per_200k]', v_g_bonny_alpha_trir_lower95_per_200k, v_x;
  end if;
  v_x := (select sum(exp(-(v_g_bonny_alpha_trir_upper95_per_200k * 612340.0 / 200000.0) + j * ln(v_g_bonny_alpha_trir_upper95_per_200k * 612340.0 / 200000.0) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g))) from generate_series(0, 9) j);
  if abs(v_x - 0.025000000000000022) > 1e-12 then
    raise exception 'H1 go-live refused: at the seeded upper limit % the chance of 9 or fewer is %, and a Garwood upper limit makes it 0.025 [graded field: intermediate/bonny_alpha_trir_upper95_per_200k]', v_g_bonny_alpha_trir_upper95_per_200k, v_x;
  end if;
  v_x := exp(-v_g_bonny_crew_zero_event_upper95_per_200k * 83560.0 / 200000.0);
  if abs(v_x - 0.025000000000000022) > 1e-12 then
    raise exception 'H1 go-live refused: at the seeded zero-event limit % the chance of no event is %, and the limit makes it 0.025 [graded field: intermediate/bonny_crew_zero_event_upper95_per_200k]', v_g_bonny_crew_zero_event_upper95_per_200k, v_x;
  end if;
  v_x := (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, 16) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, 16 - j) g) + j * ln(((v_g_bonny_rate_ratio_lower95 * 612340.0 / 1406775.0) / (1.0 + v_g_bonny_rate_ratio_lower95 * 612340.0 / 1406775.0))) + (16 - j) * ln(1.0 - (((v_g_bonny_rate_ratio_lower95 * 612340.0 / 1406775.0) / (1.0 + v_g_bonny_rate_ratio_lower95 * 612340.0 / 1406775.0)))))) from generate_series(9, 16) j);
  if abs(v_x - 0.025000000000000022) > 1e-12 then
    raise exception 'H1 go-live refused: the seeded rate-ratio lower limit % leaves an upper binomial tail of %, and a Clopper-Pearson limit leaves 0.025 [graded field: intermediate/bonny_rate_ratio_lower95]', v_g_bonny_rate_ratio_lower95, v_x;
  end if;
  v_x := (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, 16) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, 16 - j) g) + j * ln(((v_g_bonny_rate_ratio_upper95 * 612340.0 / 1406775.0) / (1.0 + v_g_bonny_rate_ratio_upper95 * 612340.0 / 1406775.0))) + (16 - j) * ln(1.0 - (((v_g_bonny_rate_ratio_upper95 * 612340.0 / 1406775.0) / (1.0 + v_g_bonny_rate_ratio_upper95 * 612340.0 / 1406775.0)))))) from generate_series(0, 9) j);
  if abs(v_x - 0.025000000000000022) > 1e-12 then
    raise exception 'H1 go-live refused: the seeded rate-ratio upper limit % leaves a lower binomial tail of %, and a Clopper-Pearson limit leaves 0.025 [graded field: intermediate/bonny_rate_ratio_upper95]', v_g_bonny_rate_ratio_upper95, v_x;
  end if;
  v_s_bonny_compare_p_value := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - j) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0))))))) from generate_series(0, 9) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - j) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0))))))) from generate_series(9, (9 + 7)) j)));
  if abs(v_s_bonny_compare_p_value - v_g_bonny_compare_p_value) > 1e-11 then
    raise exception 'H1 go-live refused: twice the smaller binomial tail gives %, against the seeded % [graded field: intermediate/bonny_compare_p_value]', v_s_bonny_compare_p_value, v_g_bonny_compare_p_value;
  end if;
  -- The tier's point, on these inputs: the central p-value sits above 0.05 and
  -- the engine's own rate-ratio interval contains 1, so the two agree.
  if not (v_g_bonny_compare_p_value > 0.05 and v_g_bonny_rate_ratio_lower95 < 1.0 and v_g_bonny_rate_ratio_upper95 > 1.0) then
    raise exception 'H1 go-live refused: the p-value % and the ratio interval % to % do not agree about 1 [graded field: intermediate/bonny_compare_p_value, intermediate/bonny_rate_ratio_lower95, intermediate/bonny_rate_ratio_upper95]', v_g_bonny_compare_p_value, v_g_bonny_rate_ratio_lower95, v_g_bonny_rate_ratio_upper95;
  end if;

  -- EXPERT, FORCADOS. Exposure units are hours over 200,000; the centre is the
  -- pooled count over the pooled units; limits are the centre plus and minus
  -- three root(centre over units), the lower floored at zero; a month signals
  -- only STRICTLY outside. Postgres finds the signalling months itself, and the
  -- revised centre and the second p-value leave out exactly those months.
  select array_agg(v_fc_h[g] / 200000.0 order by g) into v_units from generate_series(1, 12) g;
  select sum(v_fc_c[g]) / sum(v_units[g]) into v_ubar from generate_series(1, 12) g;
  select coalesce(array_agg(g order by g), '{}') into v_flagged from generate_series(1, 12) g
   where v_fc_c[g] / v_units[g] > v_ubar + 3.0 * sqrt(v_ubar / v_units[g])
      or v_fc_c[g] / v_units[g] < greatest(0.0, v_ubar - 3.0 * sqrt(v_ubar / v_units[g]));
  if v_flagged <> array[6] then
    raise exception 'H1 go-live refused: the second route finds the chart signalling on months %, and the Expert capstone is built on month 6 alone', v_flagged;
  end if;
  select array_agg(g order by g) into v_kept from generate_series(1, 12) g where g <> all (v_flagged);
  if abs(v_ubar - v_g_forcados_centre_per_200k) > 1e-12 then
    raise exception 'H1 go-live refused: the pooled centre is %, against the seeded % [graded field: advanced/forcados_centre_per_200k]', v_ubar, v_g_forcados_centre_per_200k;
  end if;
  v_x := v_ubar + 3.0 * sqrt(v_ubar / v_units[9]);
  if abs(v_x - v_g_forcados_ucl_month09_per_200k) > 1e-11 then
    raise exception 'H1 go-live refused: the month 9 upper limit is %, against the seeded % [graded field: advanced/forcados_ucl_month09_per_200k]', v_x, v_g_forcados_ucl_month09_per_200k;
  end if;
  if not (v_ubar - 3.0 * sqrt(v_ubar / v_units[9]) < 0.0) then
    raise exception 'H1 go-live refused: the month 9 lower limit is not floored, so the shutdown month teaches nothing about the floor';
  end if;
  v_x := v_ubar - 3.0 * sqrt(v_ubar / v_units[7]);
  if abs(v_x - v_g_forcados_lcl_month07_per_200k) > 1e-12 or not (v_x > 0.0) then
    raise exception 'H1 go-live refused: the month 7 lower limit is % and positive, against the seeded % [graded field: advanced/forcados_lcl_month07_per_200k]', v_x, v_g_forcados_lcl_month07_per_200k;
  end if;
  select sum(v_fc_c[g]) / sum(v_units[g]) into v_x from unnest(v_kept) g;
  if abs(v_x - v_g_forcados_revised_centre_per_200k) > 1e-12 then
    raise exception 'H1 go-live refused: the centre without the signalling month is %, against the seeded % [graded field: advanced/forcados_revised_centre_per_200k]', v_x, v_g_forcados_revised_centre_per_200k;
  end if;
  v_s_forcados_before_after_p_value := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) j)));
  if abs(v_s_forcados_before_after_p_value - v_g_forcados_before_after_p_value) > 1e-11 then
    raise exception 'H1 go-live refused: twice the smaller tail for months 7 to 12 against 1 to 6 is %, against the seeded % [graded field: advanced/forcados_before_after_p_value]', v_s_forcados_before_after_p_value, v_g_forcados_before_after_p_value;
  end if;
  v_s_forcados_before_after_p_value_without_month06 := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) j)));
  if abs(v_s_forcados_before_after_p_value_without_month06 - v_g_forcados_before_after_p_value_without_month06) > 1e-11 then
    raise exception 'H1 go-live refused: twice the smaller tail with the signalling month left out is %, against the seeded % [graded field: advanced/forcados_before_after_p_value_without_month06]', v_s_forcados_before_after_p_value_without_month06, v_g_forcados_before_after_p_value_without_month06;
  end if;
  -- The tier's point, on these inputs: with month 6 the drop is significant at
  -- 0.05 and without it the drop is not.
  if not (v_g_forcados_before_after_p_value < 0.05 and v_g_forcados_before_after_p_value_without_month06 > 0.05) then
    raise exception 'H1 go-live refused: the two before-and-after p-values % and % do not fall either side of 0.05 [graded field: advanced/forcados_before_after_p_value, advanced/forcados_before_after_p_value_without_month06]', v_g_forcados_before_after_p_value, v_g_forcados_before_after_p_value_without_month06;
  end if;


  -- ------------------------------------------------- 3. the traps bite
  -- Each wrong reading is computed over the same inputs and must MISS the
  -- graded value by more than its tolerance, or the field does not
  -- discriminate the trap it is for.
  v_wrong := (5 * 200000.0 / 1846220.0 + 11 * 200000.0 / 3127655.0) / 2.0;
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_trir_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the mean of the two workforce rates gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_trir_per_200k]', v_wrong, v_g_okrika_combined_trir_per_200k;
  end if;
  v_wrong := 16 * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_trir_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the IOGP 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_trir_per_200k]', v_wrong, v_g_okrika_combined_trir_per_200k;
  end if;
  v_wrong := (16 + 1) * 200000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_trir_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the fatality counted a second time gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_trir_per_200k]', v_wrong, v_g_okrika_combined_trir_per_200k;
  end if;
  v_wrong := 4 * 200000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_ltir_per_1m) <= 5e-07 then
    raise exception 'H1 go-live refused: the 200,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_ltir_per_1m]', v_wrong, v_g_okrika_combined_ltir_per_1m;
  end if;
  v_wrong := 16 * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_ltir_per_1m) <= 5e-07 then
    raise exception 'H1 go-live refused: the recordable cases counted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_ltir_per_1m]', v_wrong, v_g_okrika_combined_ltir_per_1m;
  end if;
  v_wrong := (4 + 1) * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_combined_ltir_per_1m) <= 5e-07 then
    raise exception 'H1 go-live refused: the fatality added again gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_combined_ltir_per_1m]', v_wrong, v_g_okrika_combined_ltir_per_1m;
  end if;
  v_wrong := 1 * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_far_per_100m) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_far_per_100m]', v_wrong, v_g_okrika_far_per_100m;
  end if;
  v_wrong := 1 * 200000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_far_per_100m) <= 5e-07 then
    raise exception 'H1 go-live refused: the 200,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_far_per_100m]', v_wrong, v_g_okrika_far_per_100m;
  end if;
  v_wrong := 4 * 100000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_far_per_100m) <= 5e-07 then
    raise exception 'H1 go-live refused: the lost time count used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_far_per_100m]', v_wrong, v_g_okrika_far_per_100m;
  end if;
  v_wrong := 187.0 / 4.0;
  if v_wrong is null or abs(v_wrong - v_g_okrika_severity_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: days per lost time case gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_severity_rate_per_200k]', v_wrong, v_g_okrika_severity_rate_per_200k;
  end if;
  v_wrong := 187 * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_severity_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_severity_rate_per_200k]', v_wrong, v_g_okrika_severity_rate_per_200k;
  end if;
  v_wrong := 187.0 / 16.0;
  if v_wrong is null or abs(v_wrong - v_g_okrika_severity_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: days per recordable case gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_severity_rate_per_200k]', v_wrong, v_g_okrika_severity_rate_per_200k;
  end if;
  v_wrong := 3 * 1000000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_tier1_pse_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_tier1_pse_rate_per_200k]', v_wrong, v_g_okrika_tier1_pse_rate_per_200k;
  end if;
  v_wrong := (3 + 7) * 200000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_tier1_pse_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: Tier 1 and Tier 2 counted together gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_tier1_pse_rate_per_200k]', v_wrong, v_g_okrika_tier1_pse_rate_per_200k;
  end if;
  v_wrong := 7 * 200000.0 / (1846220.0 + 3127655.0);
  if v_wrong is null or abs(v_wrong - v_g_okrika_tier1_pse_rate_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the Tier 2 count used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_tier1_pse_rate_per_200k]', v_wrong, v_g_okrika_tier1_pse_rate_per_200k;
  end if;
  v_wrong := (select sum(v_ok_c[g]) from generate_series(1, 12) g) * 200000.0 / (select sum(v_ok_h[g]) from generate_series(1, 12) g);
  if v_wrong is null or abs(v_wrong - v_g_okrika_rolling12_trir_month14_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the calendar-year window gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_rolling12_trir_month14_per_200k]', v_wrong, v_g_okrika_rolling12_trir_month14_per_200k;
  end if;
  v_wrong := (select sum(v_ok_c[g]) from generate_series(2, 13) g) * 200000.0 / (select sum(v_ok_h[g]) from generate_series(2, 13) g);
  if v_wrong is null or abs(v_wrong - v_g_okrika_rolling12_trir_month14_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the window ending at month 13 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_rolling12_trir_month14_per_200k]', v_wrong, v_g_okrika_rolling12_trir_month14_per_200k;
  end if;
  v_wrong := (select sum(v_ok_c[g] * 200000.0 / v_ok_h[g]) / 12.0 from generate_series(3, 14) g);
  if v_wrong is null or abs(v_wrong - v_g_okrika_rolling12_trir_month14_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the mean of the monthly rates in the window gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/okrika_rolling12_trir_month14_per_200k]', v_wrong, v_g_okrika_rolling12_trir_month14_per_200k;
  end if;
  v_wrong := (9 - 1.959963984540054 * sqrt(9.0)) * 200000.0 / 612340.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_lower95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the normal approximation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_lower95_per_200k]', v_wrong, v_g_bonny_alpha_trir_lower95_per_200k;
  end if;
  v_wrong := 9 * 200000.0 / 612340.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_lower95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the point estimate quoted as the limit gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_lower95_per_200k]', v_wrong, v_g_bonny_alpha_trir_lower95_per_200k;
  end if;
  v_wrong := v_g_bonny_alpha_trir_lower95_per_200k * 1000000.0 / 200000.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_lower95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_lower95_per_200k]', v_wrong, v_g_bonny_alpha_trir_lower95_per_200k;
  end if;
  v_wrong := (9 + 1.959963984540054 * sqrt(9.0)) * 200000.0 / 612340.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the normal approximation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_upper95_per_200k]', v_wrong, v_g_bonny_alpha_trir_upper95_per_200k;
  end if;
  v_wrong := 9 * 200000.0 / 612340.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the point estimate quoted as the limit gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_upper95_per_200k]', v_wrong, v_g_bonny_alpha_trir_upper95_per_200k;
  end if;
  v_wrong := v_g_bonny_alpha_trir_upper95_per_200k * 1000000.0 / 200000.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_alpha_trir_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_alpha_trir_upper95_per_200k]', v_wrong, v_g_bonny_alpha_trir_upper95_per_200k;
  end if;
  v_wrong := 3.0 * 200000.0 / 83560.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_crew_zero_event_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the rule of three gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_crew_zero_event_upper95_per_200k]', v_wrong, v_g_bonny_crew_zero_event_upper95_per_200k;
  end if;
  v_wrong := 0.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_crew_zero_event_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the point estimate of zero quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_crew_zero_event_upper95_per_200k]', v_wrong, v_g_bonny_crew_zero_event_upper95_per_200k;
  end if;
  v_wrong := v_g_bonny_crew_zero_event_upper95_per_200k * 1000000.0 / 200000.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_crew_zero_event_upper95_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_crew_zero_event_upper95_per_200k]', v_wrong, v_g_bonny_crew_zero_event_upper95_per_200k;
  end if;
  v_wrong := (9.0 / 612340.0) / (7.0 / 1406775.0) * exp(-1.959963984540054 * sqrt(1.0 / 9.0 + 1.0 / 7.0));
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_lower95) <= 5e-07 then
    raise exception 'H1 go-live refused: the Wald interval on the log ratio gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_lower95]', v_wrong, v_g_bonny_rate_ratio_lower95;
  end if;
  v_wrong := 1.0 / v_g_bonny_rate_ratio_upper95;
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_lower95) <= 5e-07 then
    raise exception 'H1 go-live refused: the groups swapped gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_lower95, intermediate/bonny_rate_ratio_upper95]', v_wrong, v_g_bonny_rate_ratio_lower95;
  end if;
  v_wrong := v_g_bonny_rate_ratio_lower95 * 612340.0 / 1406775.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_lower95) <= 5e-07 then
    raise exception 'H1 go-live refused: the hours ratio ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_lower95]', v_wrong, v_g_bonny_rate_ratio_lower95;
  end if;
  v_wrong := (9.0 / 612340.0) / (7.0 / 1406775.0) * exp(1.959963984540054 * sqrt(1.0 / 9.0 + 1.0 / 7.0));
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_upper95) <= 5e-07 then
    raise exception 'H1 go-live refused: the Wald interval on the log ratio gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_upper95]', v_wrong, v_g_bonny_rate_ratio_upper95;
  end if;
  v_wrong := 1.0 / v_g_bonny_rate_ratio_lower95;
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_upper95) <= 5e-07 then
    raise exception 'H1 go-live refused: the groups swapped gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_upper95, intermediate/bonny_rate_ratio_lower95]', v_wrong, v_g_bonny_rate_ratio_upper95;
  end if;
  v_wrong := v_g_bonny_rate_ratio_upper95 * 612340.0 / 1406775.0;
  if v_wrong is null or abs(v_wrong - v_g_bonny_rate_ratio_upper95) <= 5e-07 then
    raise exception 'H1 go-live refused: the hours ratio ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_rate_ratio_upper95]', v_wrong, v_g_bonny_rate_ratio_upper95;
  end if;
  v_wrong := least(1.0, (select sum(t.q) from (select exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - j) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0)))))) q from generate_series(0, (9 + 7)) j) t where t.q <= exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, 9) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - 9) g) + 9 * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - 9) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0)))))) * (1.0 + 1e-7)));
  if v_wrong is null or abs(v_wrong - v_g_bonny_compare_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: the minlike convention of R and scipy gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_compare_p_value]', v_wrong, v_g_bonny_compare_p_value;
  end if;
  v_wrong := least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - j) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0))))))) from generate_series(0, 9) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((612340.0) / ((612340.0) + (1406775.0)))) + ((9 + 7) - j) * ln(1.0 - (((612340.0) / ((612340.0) + (1406775.0))))))) from generate_series(9, (9 + 7)) j));
  if v_wrong is null or abs(v_wrong - v_g_bonny_compare_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: one tail not doubled gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_compare_p_value]', v_wrong, v_g_bonny_compare_p_value;
  end if;
  v_wrong := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((1.0) / ((1.0) + (1.0)))) + ((9 + 7) - j) * ln(1.0 - (((1.0) / ((1.0) + (1.0))))))) from generate_series(0, 9) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (9 + 7) - j) g) + j * ln(((1.0) / ((1.0) + (1.0)))) + ((9 + 7) - j) * ln(1.0 - (((1.0) / ((1.0) + (1.0))))))) from generate_series(9, (9 + 7)) j)));
  if v_wrong is null or abs(v_wrong - v_g_bonny_compare_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: equal hours assumed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/bonny_compare_p_value]', v_wrong, v_g_bonny_compare_p_value;
  end if;
  v_wrong := (select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g);
  if v_wrong is null or abs(v_wrong - v_g_forcados_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the mean of the monthly u gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_centre_per_200k]', v_wrong, v_g_forcados_centre_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g]) / 12.0 from generate_series(1, 12) g);
  if v_wrong is null or abs(v_wrong - v_g_forcados_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: recordable cases per month gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_centre_per_200k]', v_wrong, v_g_forcados_centre_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g]) * 1000000.0 / sum(v_fc_h[g]) from generate_series(1, 12) g);
  if v_wrong is null or abs(v_wrong - v_g_forcados_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the 1,000,000 hour base gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_centre_per_200k]', v_wrong, v_g_forcados_centre_per_200k;
  end if;
  v_wrong := v_ubar + 2.0 * sqrt(v_ubar / v_units[9]);
  if v_wrong is null or abs(v_wrong - v_g_forcados_ucl_month09_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: two-sigma limits gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_ucl_month09_per_200k]', v_wrong, v_g_forcados_ucl_month09_per_200k;
  end if;
  v_wrong := v_ubar + 3.0 * sqrt(v_ubar / (select sum(v_units[g]) / 12.0 from generate_series(1, 12) g));
  if v_wrong is null or abs(v_wrong - v_g_forcados_ucl_month09_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: limits from the average exposure gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_ucl_month09_per_200k]', v_wrong, v_g_forcados_ucl_month09_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g) + 3.0 * sqrt((select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g) / v_units[9]);
  if v_wrong is null or abs(v_wrong - v_g_forcados_ucl_month09_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the centre taken as the mean of u gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_ucl_month09_per_200k]', v_wrong, v_g_forcados_ucl_month09_per_200k;
  end if;
  v_wrong := v_ubar + 3.0 * sqrt(v_ubar / v_fc_h[9]);
  if v_wrong is null or abs(v_wrong - v_g_forcados_ucl_month09_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: hours not converted to units gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_ucl_month09_per_200k]', v_wrong, v_g_forcados_ucl_month09_per_200k;
  end if;
  v_wrong := v_ubar - 2.0 * sqrt(v_ubar / v_units[7]);
  if v_wrong is null or abs(v_wrong - v_g_forcados_lcl_month07_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: two-sigma limits gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_lcl_month07_per_200k]', v_wrong, v_g_forcados_lcl_month07_per_200k;
  end if;
  v_wrong := v_ubar - 3.0 * sqrt(v_ubar / (select sum(v_units[g]) / 12.0 from generate_series(1, 12) g));
  if v_wrong is null or abs(v_wrong - v_g_forcados_lcl_month07_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: limits from the average exposure gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_lcl_month07_per_200k]', v_wrong, v_g_forcados_lcl_month07_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g) - 3.0 * sqrt((select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g) / v_units[7]);
  if v_wrong is null or abs(v_wrong - v_g_forcados_lcl_month07_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the centre taken as the mean of u gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_lcl_month07_per_200k]', v_wrong, v_g_forcados_lcl_month07_per_200k;
  end if;
  v_wrong := 0.0;
  if v_wrong is null or abs(v_wrong - v_g_forcados_lcl_month07_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: a lower limit floored by habit gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_lcl_month07_per_200k]', v_wrong, v_g_forcados_lcl_month07_per_200k;
  end if;
  v_wrong := v_ubar;
  if v_wrong is null or abs(v_wrong - v_g_forcados_revised_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the chart not revised gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_revised_centre_per_200k]', v_wrong, v_g_forcados_revised_centre_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g] / v_units[g]) / count(*) from unnest(v_kept) g);
  if v_wrong is null or abs(v_wrong - v_g_forcados_revised_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the mean of the kept monthly u gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_revised_centre_per_200k]', v_wrong, v_g_forcados_revised_centre_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g]) from unnest(v_kept) g) / (select sum(v_units[g]) from generate_series(1, 12) g);
  if v_wrong is null or abs(v_wrong - v_g_forcados_revised_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the events dropped and the hours kept gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_revised_centre_per_200k]', v_wrong, v_g_forcados_revised_centre_per_200k;
  end if;
  v_wrong := (select sum(v_fc_c[g]) / sum(v_units[g]) from generate_series(1, 12) g where g <> 9);
  if v_wrong is null or abs(v_wrong - v_g_forcados_revised_centre_per_200k) <= 5e-07 then
    raise exception 'H1 go-live refused: the short month dropped instead gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_revised_centre_per_200k]', v_wrong, v_g_forcados_revised_centre_per_200k;
  end if;
  v_wrong := least(1.0, (select sum(t.q) from (select exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))))) q from generate_series(0, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) j) t where t.q <= exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - (select sum(v_fc_c[g]) from generate_series(7, 12) g)) g) + (select sum(v_fc_c[g]) from generate_series(7, 12) g) * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - (select sum(v_fc_c[g]) from generate_series(7, 12) g)) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))))) * (1.0 + 1e-7)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: the minlike convention of R and scipy gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value]', v_wrong, v_g_forcados_before_after_p_value;
  end if;
  v_wrong := least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) j));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: one tail not doubled gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value]', v_wrong, v_g_forcados_before_after_p_value;
  end if;
  v_wrong := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln(((1.0) / ((1.0) + (1.0)))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - (((1.0) / ((1.0) + (1.0))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln(((1.0) / ((1.0) + (1.0)))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - (((1.0) / ((1.0) + (1.0))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) j)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: equal hours assumed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value]', v_wrong, v_g_forcados_before_after_p_value;
  end if;
  v_wrong := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) j)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value) <= 5e-07 then
    raise exception 'H1 go-live refused: the signalling month removed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value]', v_wrong, v_g_forcados_before_after_p_value;
  end if;
  v_wrong := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g)) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g))) j)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value_without_month06) <= 5e-07 then
    raise exception 'H1 go-live refused: the signalling month left in gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value_without_month06]', v_wrong, v_g_forcados_before_after_p_value_without_month06;
  end if;
  v_wrong := least(1.0, 2.0 * least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g)))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) j)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value_without_month06) <= 5e-07 then
    raise exception 'H1 go-live refused: its events dropped and its hours kept gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value_without_month06]', v_wrong, v_g_forcados_before_after_p_value_without_month06;
  end if;
  v_wrong := least(1.0, (select sum(t.q) from (select exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))))) q from generate_series(0, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) j) t where t.q <= exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - (select sum(v_fc_c[g]) from generate_series(7, 12) g)) g) + (select sum(v_fc_c[g]) from generate_series(7, 12) g) * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - (select sum(v_fc_c[g]) from generate_series(7, 12) g)) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))))) * (1.0 + 1e-7)));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value_without_month06) <= 5e-07 then
    raise exception 'H1 go-live refused: the minlike convention of R and scipy gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value_without_month06]', v_wrong, v_g_forcados_before_after_p_value_without_month06;
  end if;
  v_wrong := least((select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series(0, (select sum(v_fc_c[g]) from generate_series(7, 12) g)) j), (select sum(exp((select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, j) g) - (select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) g) + j * ln((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged)))))) + (((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))) - j) * ln(1.0 - ((((select sum(v_fc_h[g]) from generate_series(7, 12) g)) / (((select sum(v_fc_h[g]) from generate_series(7, 12) g)) + ((select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))))))))) from generate_series((select sum(v_fc_c[g]) from generate_series(7, 12) g), ((select sum(v_fc_c[g]) from generate_series(7, 12) g) + (select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged)))) j));
  if v_wrong is null or abs(v_wrong - v_g_forcados_before_after_p_value_without_month06) <= 5e-07 then
    raise exception 'H1 go-live refused: one tail not doubled gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/forcados_before_after_p_value_without_month06]', v_wrong, v_g_forcados_before_after_p_value_without_month06;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'safetystats';
  if not exists (select 1 from public.academy_apps where slug = 'safetystats' and status = 'available') then
    raise exception 'H1 go-live refused: safetystats did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H1 go-live: safetystats available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
