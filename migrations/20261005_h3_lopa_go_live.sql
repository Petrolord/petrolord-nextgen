-- ============================================================================
-- H3 GO-LIVE (HELD): Process Safety: LOPA & SIL Determination flips to
-- 'available', the THIRD course of the HSE module, at path_order 63.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/lopa. The 78 lessons, the teaching lab (lopaLab.js)
-- and its three explorer panels (the worksheet, the SIF builder and the proof
-- test) ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist. This file
-- is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h3_capstone.mjs returned through
--      the vendored engines/hse/lopa.js when this file was generated, to the
--      last bit, so a capstone row an earlier seed left behind, or a move of
--      one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and carries every input fragment, then recomputes the LOPA chains
--      as products and quotients (finding the export row's SIL itself, through
--      the decade snap), every subsystem by the Annex B form term by term and
--      the SIF as their sum, and asserts the three longest intervals BY THE
--      EQUATION THEY ARE A ROOT OF (the Annex B PFDavg at the seeded interval
--      lands on its budget) and the coverage floor as the form at an interval
--      of zero;
--   3. by the TRAPS the course is built on, 94 wrong methods, each of which
--      must bite on these inputs: the reading a learner who missed the lesson
--      would give is computed (the interval ones by a bisection in PL/pgSQL)
--      and refused if it lands within the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Frequencies and
-- PFDavg values are graded at twelve decimals (tolerance 5e-13), risk
-- reduction factors and hours at six (5e-7). Every field must carry a positive,
-- non-whole expected value at its class's tolerance with a label and a unit,
-- the answer the prompt asks for must pass, and one unit either side of it in
-- the last asked decimal must fail. All of it is asserted here, on the rows as
-- seeded.
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
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; v_k int;
  v_names text; v_prompt text; v_x double precision; v_wrong double precision; v_sil int;
  v_t double precision; v_lo double precision; v_hi double precision; v_mid double precision;
  v_g_akpo_separator_unmitigated_frequency_per_yr double precision;
  v_g_akpo_separator_required_rrf double precision;
  v_g_akpo_tank_mitigated_frequency_without_sif_per_yr double precision;
  v_g_akpo_tank_required_sif_pfdavg double precision;
  v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr double precision;
  v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr double precision;
  v_g_usan_transmitters_2oo3_pfdavg double precision;
  v_g_usan_logic_solver_1oo1_pfdavg double precision;
  v_g_usan_valves_1oo2_pfdavg double precision;
  v_g_usan_sif_rrf double precision;
  v_g_usan_proposed_2oo2_transmitters_pfdavg double precision;
  v_g_usan_mitigated_frequency_with_sif_per_yr double precision;
  v_g_yoho_valves_1oo2_max_interval_hours double precision;
  v_g_yoho_valve_1oo1_ptc_pfdavg double precision;
  v_g_yoho_valve_1oo1_ptc_max_interval_hours double precision;
  v_g_yoho_transmitter_ptc_floor_pfdavg double precision;
  v_g_yoho_sif_rrf_at_three_year_interval double precision;
  v_g_yoho_transmitters_2oo3_max_interval_hours double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'lopa' and active;
  if v_structures <> 3 then
    raise exception 'H3 go-live refused: lopa has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'lopa';
  if v_questions <> 396 then
    raise exception 'H3 go-live refused: lopa has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = 'lopa'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'lopa' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'lopa' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = 'lopa'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'lopa' and s.active;
  if v_lessons <> 78 then
    raise exception 'H3 go-live refused: lopa carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'lopa' and s.active;
  if v_modules <> 18 then
    raise exception 'H3 go-live refused: lopa carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'lopa' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'lopa';
  if v_capstones <> 3 then
    raise exception 'H3 go-live refused: lopa has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'lopa';
  if v_graded <> 18 then
    raise exception 'H3 go-live refused: lopa has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'lopa' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'lopa' and module = 'hse'
                    and path_order = 63 and prereq_slug is null) then
    raise exception 'H3 go-live refused: the lopa catalogue row is not hse at path_order 63 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = 63 and slug <> 'lopa') then
    raise exception 'H3 go-live refused: another course already holds path_order 63';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at its class's tolerance (twelve
  -- decimals at 5e-13, six at 5e-7), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or (f->>'expected')::numeric = round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> case when f->>'key' in ('akpo_separator_required_rrf', 'usan_sif_rrf', 'yoho_valves_1oo2_max_interval_hours', 'yoho_valve_1oo1_ptc_max_interval_hours', 'yoho_sif_rrf_at_three_year_interval', 'yoho_transmitters_2oo3_max_interval_hours') then 0.0000005 else 0.0000000000005 end
          or (f->>'key') not in ('akpo_separator_unmitigated_frequency_per_yr', 'akpo_separator_required_rrf', 'akpo_tank_mitigated_frequency_without_sif_per_yr', 'akpo_tank_required_sif_pfdavg', 'akpo_compressor_mitigated_frequency_with_sif_per_yr', 'akpo_export_catalogue_sif_mitigated_frequency_per_yr', 'usan_transmitters_2oo3_pfdavg', 'usan_logic_solver_1oo1_pfdavg', 'usan_valves_1oo2_pfdavg', 'usan_sif_rrf', 'usan_proposed_2oo2_transmitters_pfdavg', 'usan_mitigated_frequency_with_sif_per_yr', 'yoho_valves_1oo2_max_interval_hours', 'yoho_valve_1oo1_ptc_pfdavg', 'yoho_valve_1oo1_ptc_max_interval_hours', 'yoho_transmitter_ptc_floor_pfdavg', 'yoho_sif_rrf_at_three_year_interval', 'yoho_transmitters_2oo3_max_interval_hours')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) are not a positive non-whole number at their class tolerance with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to its class's decimals, must pass
  -- abs(answer - expected) <= tol in numeric exactly as academy_submit_capstone
  -- computes it, and one unit in the last decimal either side of it must fail.
  select count(*), string_agg(t.tier || '/' || t.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric tl,
                 case when f->>'key' in ('akpo_separator_required_rrf', 'usan_sif_rrf', 'yoho_valves_1oo2_max_interval_hours', 'yoho_valve_1oo1_ptc_max_interval_hours', 'yoho_sif_rrf_at_three_year_interval', 'yoho_transmitters_2oo3_max_interval_hours') then 6 else 12 end dp
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'lopa') t
   where abs(round(t.e, t.dp) - t.e) > t.tl
      or abs(round(t.e, t.dp) + power(10::numeric, -t.dp) - t.e) <= t.tl
      or abs(round(t.e, t.dp) - power(10::numeric, -t.dp) - t.e) <= t.tl;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) either fail the answer the prompt asks for or pass one a unit off in its last decimal: %', v_n, v_names;
  end if;


  -- ---------------------------------------- the prompts the learner reads

  -- beginner: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'lopa' and tier = 'beginner';
  if md5(v_prompt) <> 'a07c6a6f843871bec07d7e291851d352' then
    raise exception 'H3 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'lopa' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'AKPO, a gas plant LOPA worksheet of four scenarios' and title = 'How much risk reduction each row is missing') then
    raise exception 'H3 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array['AKPO, a gas plant, and four rows of its LOPA worksheet. Every frequency is per year, every probability and IPL PFD is a fraction, every row carries its TMEL, the tolerable mitigated event likelihood, as a frequency per year, and every IPL is credited only as its flags allow.', 'SEPARATOR, overpressure of the inlet separator: initiating event frequency 0.37 per year; enabling condition ''high pressure well lined up to the separator'' 0.23; conditional modifiers ''ignition'' 0.42 and ''operator in the area'' 0.18; IPLs ''high pressure alarm with operator response'', IPL PFD 0.1, flagged independent and ''BPCS high pressure trip on the initiating controller'', IPL PFD 0.1, flagged not independent; TMEL 1e-5 per year.', 'TANK, overfill of the condensate tank: initiating event frequency 0.83 per year; enabling conditions ''tank receiving from the separator'' 0.64 and ''rundown at the high rate'' 0.35; conditional modifier ''vapour cloud ignites'' 0.27; IPLs ''independent high level alarm with operator response'', IPL PFD 0.1, flagged independent and ''level transmitter shared with the control loop'', IPL PFD 0.1, flagged not independent; TMEL 1e-5 per year.', 'COMPRESSOR, a compressor seal failure: initiating event frequency 0.19 per year; no enabling condition; conditional modifiers ''ignition'' 0.33, ''person present'' 0.52 and ''fatal injury'' 0.4; IPL ''gas detection with operator shutdown'', IPL PFD 0.1, flagged independent; TMEL 1e-5 per year; and a proposed SIF with a PFDavg of 0.0037.', 'EXPORT, overpressure of the export pump: initiating event frequency 0.64 per year; enabling condition ''export pump on the high speed curve'' 0.625; conditional modifier ''release reaches the jetty'' 0.25; IPLs ''pressure relief to the closed drain'', IPL PFD 0.1, flagged independent and ''BPCS pump trip on the same controller'', IPL PFD 0.1, flagged not independent; TMEL 0.0001 per year.', 'The site SIF catalogue holds one standard design per SIL band: SIL 1 at a PFDavg of 0.0273, SIL 2 at 0.00318 and SIL 3 at 0.000461.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % beginner input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
  end if;

  -- intermediate: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'lopa' and tier = 'intermediate';
  if md5(v_prompt) <> '84875b786a6a087329774bd96f0b8c07' then
    raise exception 'H3 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'lopa' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'USAN, a high pressure trip SIF on a gas export line' and title = 'What the SIF achieves, subsystem by subsystem, and whether the row closes') then
    raise exception 'H3 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array['USAN, a high pressure trip on a gas export line. The failure rates below are illustrative, chosen for this exercise. Rates are per hour per channel and times are in hours.', 'TRANSMITTERS: 2oo3, lambdaDU 6.3e-7 and lambdaDD 1.9e-6 per hour, proof tested every 8760 hours, MTTR 16 hours and MRT 16 hours, beta factor 0.06 and betaD 0.03.', 'LOGIC SOLVER: a 1oo1 safety PLC, lambdaDU 4.6e-8 and lambdaDD 7.6e-7 per hour, proof tested every 8760 hours, MTTR 16 hours and MRT 16 hours.', 'VALVES: two shutdown valves 1oo2, lambdaDU 2.4e-6 and lambdaDD 3e-7 per hour, proof tested every 8760 hours, MTTR 16 hours and MRT 16 hours, beta factor 0.1 and betaD 0.05.', 'PROPOSED: a 2oo2 vote of the same transmitters, to cut spurious trips, on the same data sheet: lambdaDU 6.3e-7 and lambdaDD 1.9e-6 per hour, proof tested every 8760 hours, MTTR 16 hours and MRT 16 hours, carrying the beta factor 0.06 and betaD 0.03 of the 2oo3 set.', 'THE LOPA ROW the SIF answers, overpressure of the export line: initiating event frequency 0.21 per year; enabling condition ''export compressor at full throughput'' 0.44; conditional modifier ''ignition'' 0.3; IPL ''pressure relief valve'', IPL PFD 0.01, flagged independent; TMEL, the tolerable mitigated event likelihood, 1e-6 per year.', 'Use the IEC 61508-6 Annex B forms, with the mean repair time after a proof test (MRT) as stated.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % intermediate input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
  end if;

  -- advanced: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = 'lopa' and tier = 'advanced';
  if md5(v_prompt) <> 'f574d1836f7e1102a4634f48c33f3368' then
    raise exception 'H3 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'lopa' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'YOHO, proof testing on a crude oil stabiliser' and title = 'How long each proof test may run, and where no interval helps') then
    raise exception 'H3 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array['YOHO, proof testing on a crude oil stabiliser. The failure rates below are illustrative, chosen for this exercise. Rates are per hour per channel, times are in hours, and a year is 8760 hours.', 'VALVES: two shutdown valves 1oo2, lambdaDU 2.3e-6 per hour and no detected failures, MRT 48 hours, beta factor 0.07, proof tested every 8760 hours today; their allocated PFDavg budget is 0.0022.', 'SINGLE VALVE: a 1oo1 valve, lambdaDU 7.8e-7 per hour and no detected failures, MRT 48 hours, proof tested every 8760 hours with a proof test coverage of 0.75; the failures the test misses are found only at overhaul, a lifetime of 105120 hours. Its target PFDavg is 0.0118.', 'SINGLE TRANSMITTER: a 1oo1 transmitter, lambdaDU 6.1e-7 and lambdaDD 2.4e-6 per hour, MTTR 72 hours and MRT 72 hours, proof tested every 8760 hours with a proof test coverage of 0.6 and a lifetime of 131400 hours. Its target PFDavg is 0.003.', 'THE FUNCTION: 2oo3 transmitters, lambdaDU 7.4e-7 and lambdaDD 1.3e-6 per hour, MTTR 24 hours and MRT 24 hours, beta factor 0.1 and betaD 0.05, allocated a PFDavg budget of 0.00015; a 1oo1 logic solver, lambdaDU 5.2e-8 and lambdaDD 9.1e-7 per hour, MTTR 24 hours and MRT 24 hours; and the 1oo2 valves above. Each is proof tested every 8760 hours today, and it is proposed to stretch every proof test interval in the function to 26280 hours.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % advanced input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_akpo_separator_unmitigated_frequency_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_separator_unmitigated_frequency_per_yr';
  select (f->>'expected')::double precision into v_g_akpo_separator_required_rrf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_separator_required_rrf';
  select (f->>'expected')::double precision into v_g_akpo_tank_mitigated_frequency_without_sif_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_tank_mitigated_frequency_without_sif_per_yr';
  select (f->>'expected')::double precision into v_g_akpo_tank_required_sif_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_tank_required_sif_pfdavg';
  select (f->>'expected')::double precision into v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_compressor_mitigated_frequency_with_sif_per_yr';
  select (f->>'expected')::double precision into v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'beginner' and f->>'key' = 'akpo_export_catalogue_sif_mitigated_frequency_per_yr';
  select (f->>'expected')::double precision into v_g_usan_transmitters_2oo3_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_transmitters_2oo3_pfdavg';
  select (f->>'expected')::double precision into v_g_usan_logic_solver_1oo1_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_logic_solver_1oo1_pfdavg';
  select (f->>'expected')::double precision into v_g_usan_valves_1oo2_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_valves_1oo2_pfdavg';
  select (f->>'expected')::double precision into v_g_usan_sif_rrf
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_sif_rrf';
  select (f->>'expected')::double precision into v_g_usan_proposed_2oo2_transmitters_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_proposed_2oo2_transmitters_pfdavg';
  select (f->>'expected')::double precision into v_g_usan_mitigated_frequency_with_sif_per_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'intermediate' and f->>'key' = 'usan_mitigated_frequency_with_sif_per_yr';
  select (f->>'expected')::double precision into v_g_yoho_valves_1oo2_max_interval_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_valves_1oo2_max_interval_hours';
  select (f->>'expected')::double precision into v_g_yoho_valve_1oo1_ptc_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_valve_1oo1_ptc_pfdavg';
  select (f->>'expected')::double precision into v_g_yoho_valve_1oo1_ptc_max_interval_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_valve_1oo1_ptc_max_interval_hours';
  select (f->>'expected')::double precision into v_g_yoho_transmitter_ptc_floor_pfdavg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_transmitter_ptc_floor_pfdavg';
  select (f->>'expected')::double precision into v_g_yoho_sif_rrf_at_three_year_interval
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_sif_rrf_at_three_year_interval';
  select (f->>'expected')::double precision into v_g_yoho_transmitters_2oo3_max_interval_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'lopa' and c.tier = 'advanced' and f->>'key' = 'yoho_transmitters_2oo3_max_interval_hours';
  if v_g_akpo_separator_unmitigated_frequency_per_yr is null
     or v_g_akpo_separator_required_rrf is null
     or v_g_akpo_tank_mitigated_frequency_without_sif_per_yr is null
     or v_g_akpo_tank_required_sif_pfdavg is null
     or v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr is null
     or v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr is null
     or v_g_usan_transmitters_2oo3_pfdavg is null
     or v_g_usan_logic_solver_1oo1_pfdavg is null
     or v_g_usan_valves_1oo2_pfdavg is null
     or v_g_usan_sif_rrf is null
     or v_g_usan_proposed_2oo2_transmitters_pfdavg is null
     or v_g_usan_mitigated_frequency_with_sif_per_yr is null
     or v_g_yoho_valves_1oo2_max_interval_hours is null
     or v_g_yoho_valve_1oo1_ptc_pfdavg is null
     or v_g_yoho_valve_1oo1_ptc_max_interval_hours is null
     or v_g_yoho_transmitter_ptc_floor_pfdavg is null
     or v_g_yoho_sif_rrf_at_three_year_interval is null
     or v_g_yoho_transmitters_2oo3_max_interval_hours is null then
    raise exception 'H3 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr, beginner/akpo_separator_required_rrf, beginner/akpo_tank_mitigated_frequency_without_sif_per_yr, beginner/akpo_tank_required_sif_pfdavg, beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr, beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr, intermediate/usan_transmitters_2oo3_pfdavg, intermediate/usan_logic_solver_1oo1_pfdavg, intermediate/usan_valves_1oo2_pfdavg, intermediate/usan_sif_rrf, intermediate/usan_proposed_2oo2_transmitters_pfdavg, intermediate/usan_mitigated_frequency_with_sif_per_yr, advanced/yoho_valves_1oo2_max_interval_hours, advanced/yoho_valve_1oo1_ptc_pfdavg, advanced/yoho_valve_1oo1_ptc_max_interval_hours, advanced/yoho_transmitter_ptc_floor_pfdavg, advanced/yoho_sif_rrf_at_three_year_interval, advanced/yoho_transmitters_2oo3_max_interval_hours]';
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- PROMPTLEAK, IN SQL. No number in any prompt, dataset, title or label of
  -- this course, exponent spellings read as the numbers they are, lands within
  -- a graded field's tolerance of a graded value of ANY tier. A different tier
  -- is a leak and the same tier a transcription; both are refused.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone text', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' '
                   || (select string_agg((pf->>'label') || ' ' || (pf->>'unit'), ' ') from jsonb_array_elements(p.fields) pf),
                   ',', ''),
           '([0-9]+(\.[0-9]+)?(e-[0-9]+)?)', 'g') as m
   where c.app_slug = 'lopa' and p.app_slug = 'lopa'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner
  -- 133 numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '([0-9]+(\.[0-9]+)?(e-[0-9]+)?)', 'g') m
   where p.app_slug = 'lopa';
  if v_n < 133 then
    raise exception 'H3 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'lopa') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'lopa') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(a.e - b.e) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;

  -- EVERY NUMBER THE TEACHING DIGEST PRINTS (442 of them), at each
  -- field's SHIPPED tolerance. A graded value on one of them is a lookup.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 1.14e-16, 1.42e-16, 1.46e-16, 1.58e-16, 1.78e-16, 1.82e-16, 1e-10, 1e-09, 4.9e-09, 6.75e-09, 6.81e-09, 7.06e-09, 1e-08, 2e-08, 2.4205e-08, 3e-08, 6.75e-08, 1e-07, 1.215e-07, 1.35e-07, 2.7e-07, 2.73209e-07, 4e-07, 4.48e-07, 5e-07, 5.33545e-07, 5.33954e-07, 5.34e-07, 5.68e-07, 5.94e-07, 6e-07, 6.11065e-07, 6.11583e-07, 6.12e-07, 6.29e-07, 6.55e-07, 6.68e-07, 6.68114e-07, 6.68459e-07, 6.95574e-07, 6.96679e-07, 6.97e-07, 7.16e-07, 7.52e-07, 7.75912e-07, 7.76e-07, 7.76417e-07, 8e-07, 8.36e-07, 8.61e-07, 8.86e-07, 9e-07, 1e-06, 1.2e-06, 1.28e-06, 1.316518e-06, 1.344443e-06, 2e-06, 2.1e-06, 2.6e-06, 2.8e-06, 4e-06, 5e-06, 7.407407e-06, 8e-06, 1e-05, 1.35e-05, 2e-05, 2.16e-05, 2.8305589e-05, 3.2693162e-05, 3.5005448e-05, 3.5259176e-05, 3.6430741e-05, 3.7396736e-05, 5e-05, 6.893262e-05, 7e-05, 7.3541861e-05, 7.4074074e-05, 8.4916768e-05, 9.8079485e-05, 0.0001, 0.000100983281, 0.0001023168, 0.000105016345, 0.000105536, 0.000105777528, 0.000109292223, 0.000112190208, 0.00013644, 0.000141276391, 0.000141966741, 0.000159173172, 0.0002, 0.000214828223, 0.0002184, 0.000224130836, 0.000224179788, 0.000235575925, 0.000235764375, 0.000236, 0.000252779155, 0.000255485341, 0.000263048981, 0.00026328, 0.00026384, 0.000264001209, 0.000296042728, 0.000298347613, 0.000298845448, 0.000298987176, 0.0003, 0.000300179812, 0.000300267345, 0.000300316807, 0.000304116193, 0.0003069504, 0.000311851427, 0.00034387546, 0.000344, 0.000344085754, 0.0003449, 0.000362528185, 0.000368856345, 0.000369505528, 0.000439001274, 0.000439152692, 0.000473588152, 0.000474, 0.000489, 0.0005, 0.000517, 0.00052768, 0.000529009407, 0.000530340912, 0.000545634667, 0.000555204499, 0.000560373162, 0.0006, 0.0006115, 0.000611621, 0.000625759485, 0.0006503, 0.000666501722, 0.000669710253, 0.000676, 0.000676060358, 0.000709025673, 0.000715022736, 0.000740740741, 0.000753, 0.0007655, 0.0008, 0.0008476, 0.00087, 0.000876, 0.0009, 0.000946449167, 0.001, 0.001017167254, 0.00102, 0.001043789195, 0.00104876764, 0.00105, 0.00105536, 0.001083665589, 0.001140276768, 0.00126844952, 0.001277138663, 0.001286431107, 0.001287026426, 0.00129, 0.001314, 0.001588, 0.001609902719, 0.00175, 0.001792971954, 0.0019926, 0.002, 0.00231, 0.002517, 0.002628, 0.002638288099, 0.00271, 0.002713783083, 0.002725452157, 0.002847929478, 0.002993, 0.00313, 0.00378, 0.0039636, 0.004062218645, 0.004330192328, 0.00438, 0.004574307642, 0.004588, 0.00477, 0.005, 0.005256, 0.005288, 0.0057375, 0.005849, 0.00589, 0.006810104389, 0.006819960176, 0.00685, 0.00690146188, 0.007407407407, 0.0075114, 0.0079056, 0.008382016506, 0.008458, 0.008709064891, 0.00876, 0.008783920983, 0.00882800553, 0.00888, 0.009, 0.009482, 0.01, 0.010066196546, 0.010512, 0.010576, 0.01071, 0.0110592, 0.01171, 0.0118476, 0.01321, 0.0135, 0.0144, 0.014607, 0.016460844922, 0.017317146501, 0.01752, 0.01754, 0.018095929431, 0.02, 0.021024, 0.02121, 0.02209, 0.025, 0.027, 0.02862, 0.042048, 0.045, 0.049925, 0.05, 0.056541, 0.0675, 0.069876, 0.074074074074, 0.0876, 0.1, 0.135, 0.15, 0.1512, 0.1752, 0.190241513373, 0.2, 0.219, 0.25, 0.3, 0.412002, 0.438, 0.45, 0.5, 0.7, 0.740740740741, 0.793797, 0.8, 0.9, 0.95, 1.0, 1.002144, 1.006435, 1.019335, 1.045262, 1.235857, 1.35, 1.479164, 2.0, 2.037515, 2.049485, 2.104288, 2.116328, 2.164389, 2.212798, 2.229198, 2.321406, 2.391248, 2.415452, 2.5, 2.561394, 2.657218, 2.689723, 2.87966, 2.95441, 3.0, 3.155302, 3.2, 3.222922, 3.333333, 3.5, 3.685286, 3.835109, 4.0, 4.040301, 4.38, 4.520097, 4.53, 4.808513, 5.0, 5.068087, 5.305186, 6.0, 6.43, 7.0, 7.61, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 13.5, 14.0, 15.0, 15.12, 16.0, 17.0, 18.0, 19.0, 20.0, 20.61, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 50.0, 68.460327, 71.78, 72.0, 77.0, 84.0, 85.0, 90.0, 90.422454, 94.553707, 95.129376, 98.0, 99.342388, 99.9999999, 100.0, 100.00000000000001, 100.0000001, 100.000001, 100.00001, 119.303034, 120.0, 133.130974, 135.0, 146.628422, 168.0, 174.291939, 189.107413, 190.258752, 246.170895, 252.295893, 300.0, 500.0, 557.733208, 570.0, 665.0, 777.0, 777.344387, 881.6, 884.0, 888.8, 903.2, 932.0, 972.0, 1000.0, 1319.6, 1322.0, 1326.8, 1341.2, 1350.0, 1370.0, 2001.0, 2010.0, 2024.0, 2190.0, 2706.319458, 2758.406219, 3344.625055, 3377.890772, 3609.141022, 3787.861448, 3801.57336, 4380.0, 4404.0, 5000.0, 6375.0, 6953.661742, 8346.0, 8760.0, 10000.0, 12288.0, 12957.474301, 13500.0, 16230.0, 17520.0, 20000.0, 25880.634921, 27640.443736, 33595.555556, 35040.0, 35393.040486, 39596.049383, 42122.573099, 44396.444444, 46473.42698, 50000.0, 61508.0, 61511.0, 70080.0, 87600.0, 100000.0, 135000.0, 200000.0, 500000.0, 10000001.0]::double precision[]) pub
   where c.app_slug = 'lopa'
     and abs((f->>'expected')::double precision - pub) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;


  -- ------------------------------------------ 1. against the engine ledger
  -- The values h3_capstone.mjs returned through the vendored engine, to the
  -- last bit. A seeded value that is not the engine's is refused by name.
  if v_g_akpo_separator_unmitigated_frequency_per_yr <> 0.0064335600000000005::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.0064335600000000005 the engine returned [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  if v_g_akpo_separator_required_rrf <> 64.3356::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 64.3356 the engine returned [graded field: beginner/akpo_separator_required_rrf]', v_g_akpo_separator_required_rrf;
  end if;
  if v_g_akpo_tank_mitigated_frequency_without_sif_per_yr <> 0.00501984::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.00501984 the engine returned [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  if v_g_akpo_tank_required_sif_pfdavg <> 0.0019920953655893415::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.0019920953655893415 the engine returned [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_g_akpo_tank_required_sif_pfdavg;
  end if;
  if v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr <> 4.825392000000002e-06::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 4.825392000000002e-06 the engine returned [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  if v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr <> 0.0002730000000000001::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.0002730000000000001 the engine returned [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  if v_g_usan_transmitters_2oo3_pfdavg <> 0.00019634220842816946::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.00019634220842816946 the engine returned [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  if v_g_usan_logic_solver_1oo1_pfdavg <> 0.000214376::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.000214376 the engine returned [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  if v_g_usan_valves_1oo2_pfdavg <> 0.0011773445892821334::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.0011773445892821334 the engine returned [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_g_usan_valves_1oo2_pfdavg;
  end if;
  if v_g_usan_sif_rrf <> 629.6980204068868::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 629.6980204068868 the engine returned [graded field: intermediate/usan_sif_rrf]', v_g_usan_sif_rrf;
  end if;
  if v_g_usan_proposed_2oo2_transmitters_pfdavg <> 0.00559976::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.00559976 the engine returned [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  if v_g_usan_mitigated_frequency_with_sif_per_yr <> 4.402110075252959e-07::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 4.402110075252959e-07 the engine returned [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  if v_g_yoho_valves_1oo2_max_interval_hours <> 19751.841538652778::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 19751.841538652778 the engine returned [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  if v_g_yoho_valve_1oo1_ptc_pfdavg <> 0.012848940000000001::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.012848940000000001 the engine returned [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  if v_g_yoho_valve_1oo1_ptc_max_interval_hours <> 5173.880341878748::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 5173.880341878748 the engine returned [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  if v_g_yoho_transmitter_ptc_floor_pfdavg <> 0.01624752::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 0.01624752 the engine returned [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  if v_g_yoho_sif_rrf_at_three_year_interval <> 192.27709511406886::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 192.27709511406886 the engine returned [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  if v_g_yoho_transmitters_2oo3_max_interval_hours <> 3765.3355760909617::double precision then
    raise exception 'H3 go-live refused: the seeded value % is not the 3765.3355760909617 the engine returned [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, AKPO. Each LOPA chain as products and quotients of the stated
  -- inputs, crediting only the layers flagged independent. The export row's
  -- required SIL is found HERE, through the decade snap: its required risk
  -- reduction factor is a double just above 100, a plain comparison bands it
  -- SIL 2, and within one part in a billion of a decade it IS the decade, SIL 1.
  -- PROFESSIONAL, USAN, and EXPERT, YOHO. Every subsystem by the IEC 61508-6
  -- Annex B form written out term by term; the SIF as the series sum; each
  -- longest interval as the root it is.
  v_x := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) / 0.0001::double precision);
  if not (v_x > 100.0::double precision) then
    raise exception 'H3 go-live refused: the export row''s required risk reduction factor % is not a double above 100, so it teaches no snap', v_x;
  end if;
  v_sil := case when abs(v_x / power(10.0::double precision, round(log(v_x))) - 1.0::double precision) <= 1e-09::double precision
                then round(log(v_x))::int - 1
                else ceil(log(v_x))::int - 1 end;
  if v_sil <> 1 then
    raise exception 'H3 go-live refused: the decade snap puts the export row at SIL %, and it is built on the exact decade at SIL 1', v_sil;
  end if;
  v_x := (((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) * (case v_sil when 1 then 0.0273::double precision when 2 then 0.00318::double precision else 0.000461::double precision end);
  if abs(v_x - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) > 1e-12 * abs(v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) then
    raise exception 'H3 go-live refused: the catalogue design Postgres selects gives %, against the seeded % [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_x, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;

  v_x := ((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision));
  if abs(v_x - v_g_akpo_separator_unmitigated_frequency_per_yr) > 1e-12 * abs(v_g_akpo_separator_unmitigated_frequency_per_yr) then
    raise exception 'H3 go-live refused: the separator row, the initiating event frequency times its enabling condition and both modifiers, gives % in SQL, against the seeded % [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_x, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_x := ((((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision);
  if abs(v_x - v_g_akpo_separator_required_rrf) > 1e-12 * abs(v_g_akpo_separator_required_rrf) then
    raise exception 'H3 go-live refused: the separator row with only its independent alarm credited, over its TMEL, gives % in SQL, against the seeded % [graded field: beginner/akpo_separator_required_rrf]', v_x, v_g_akpo_separator_required_rrf;
  end if;
  v_x := (((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision));
  if abs(v_x - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) > 1e-12 * abs(v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) then
    raise exception 'H3 go-live refused: the tank row with only its independent alarm credited gives % in SQL, against the seeded % [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_x, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_x := (1.0::double precision / ((((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision));
  if abs(v_x - v_g_akpo_tank_required_sif_pfdavg) > 1e-12 * abs(v_g_akpo_tank_required_sif_pfdavg) then
    raise exception 'H3 go-live refused: one over the tank row''s required risk reduction factor gives % in SQL, against the seeded % [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_x, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_x := ((((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.0037::double precision);
  if abs(v_x - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) > 1e-12 * abs(v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) then
    raise exception 'H3 go-live refused: the compressor row through its proposed SIF gives % in SQL, against the seeded % [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_x, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_x := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.0273::double precision);
  if abs(v_x - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) > 1e-12 * abs(v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) then
    raise exception 'H3 go-live refused: the export row through the SIL 1 catalogue design gives % in SQL, against the seeded % [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_x, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_x := ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if abs(v_x - v_g_usan_transmitters_2oo3_pfdavg) > 1e-12 * abs(v_g_usan_transmitters_2oo3_pfdavg) then
    raise exception 'H3 go-live refused: the Annex B 2oo3 form for the transmitters gives % in SQL, against the seeded % [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_x, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_x := ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)));
  if abs(v_x - v_g_usan_logic_solver_1oo1_pfdavg) > 1e-12 * abs(v_g_usan_logic_solver_1oo1_pfdavg) then
    raise exception 'H3 go-live refused: the Annex B 1oo1 form for the logic solver gives % in SQL, against the seeded % [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_x, v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  v_x := ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)));
  if abs(v_x - v_g_usan_valves_1oo2_pfdavg) > 1e-12 * abs(v_g_usan_valves_1oo2_pfdavg) then
    raise exception 'H3 go-live refused: the Annex B 1oo2 form for the valves gives % in SQL, against the seeded % [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_x, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_x := (1.0::double precision / (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)))) + ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if abs(v_x - v_g_usan_sif_rrf) > 1e-12 * abs(v_g_usan_sif_rrf) then
    raise exception 'H3 go-live refused: one over the series sum of the three subsystems gives % in SQL, against the seeded % [graded field: intermediate/usan_sif_rrf]', v_x, v_g_usan_sif_rrf;
  end if;
  v_x := ((2.0::double precision * (6.3e-07::double precision + 1.9e-06::double precision)) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision)));
  if abs(v_x - v_g_usan_proposed_2oo2_transmitters_pfdavg) > 1e-12 * abs(v_g_usan_proposed_2oo2_transmitters_pfdavg) then
    raise exception 'H3 go-live refused: the Annex B 2oo2 form, with no beta factor term, gives % in SQL, against the seeded % [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_x, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_x := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) * (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)))) + ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if abs(v_x - v_g_usan_mitigated_frequency_with_sif_per_yr) > 1e-12 * abs(v_g_usan_mitigated_frequency_with_sif_per_yr) then
    raise exception 'H3 go-live refused: the USAN row through the summed SIF gives % in SQL, against the seeded % [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_x, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_x := ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_g_yoho_valves_1oo2_max_interval_hours / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_g_yoho_valves_1oo2_max_interval_hours / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_g_yoho_valves_1oo2_max_interval_hours / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)));
  if abs(v_x - 0.0022::double precision) > 1e-10 * 0.0022::double precision then
    raise exception 'H3 go-live refused: the Annex B PFDavg at the seeded interval % hours is %, and the longest interval lands on the valves'' budget, 0.0022 [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_g_yoho_valves_1oo2_max_interval_hours, v_x;
  end if;
  v_x := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if abs(v_x - v_g_yoho_valve_1oo1_ptc_pfdavg) > 1e-12 * abs(v_g_yoho_valve_1oo1_ptc_pfdavg) then
    raise exception 'H3 go-live refused: the Annex B 1oo1 form with the coverage split of the DU down time gives % in SQL, against the seeded % [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_x, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_x := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_g_yoho_valve_1oo1_ptc_max_interval_hours / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if abs(v_x - 0.0118::double precision) > 1e-10 * 0.0118::double precision then
    raise exception 'H3 go-live refused: the Annex B PFDavg at the seeded interval % hours is %, and the longest interval lands on the single valve''s target, 0.0118 [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_g_yoho_valve_1oo1_ptc_max_interval_hours, v_x;
  end if;
  v_x := ((6.1e-07::double precision + 2.4e-06::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * ((0.6::double precision * ((0.0::double precision / 2.0::double precision) + 72.0::double precision)) + ((1.0::double precision - 0.6::double precision) * ((131400.0::double precision / 2.0::double precision) + 72.0::double precision)))) + ((2.4e-06::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * 72.0::double precision)));
  if abs(v_x - v_g_yoho_transmitter_ptc_floor_pfdavg) > 1e-12 * abs(v_g_yoho_transmitter_ptc_floor_pfdavg) then
    raise exception 'H3 go-live refused: the transmitter''s Annex B form at a proof test interval of zero gives % in SQL, against the seeded % [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_x, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_x := (1.0::double precision / (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision)))) + ((5.2e-08::double precision + 9.1e-07::double precision) * (((5.2e-08::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((9.1e-07::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * 24.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)))));
  if abs(v_x - v_g_yoho_sif_rrf_at_three_year_interval) > 1e-12 * abs(v_g_yoho_sif_rrf_at_three_year_interval) then
    raise exception 'H3 go-live refused: one over the series sum with every interval stretched gives % in SQL, against the seeded % [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_x, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_x := ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_g_yoho_transmitters_2oo3_max_interval_hours / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_g_yoho_transmitters_2oo3_max_interval_hours / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_g_yoho_transmitters_2oo3_max_interval_hours / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision)));
  if abs(v_x - 0.00015::double precision) > 1e-10 * 0.00015::double precision then
    raise exception 'H3 go-live refused: the Annex B PFDavg at the seeded interval % hours is %, and the longest interval lands on the transmitters'' budget, 0.00015 [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_g_yoho_transmitters_2oo3_max_interval_hours, v_x;
  end if;
  -- The tiers' points, on these inputs: the SIL 1 catalogue design sits in the
  -- band the export row requires and still misses its TMEL; the USAN SIF closes
  -- its row; the YOHO transmitter's floor sits at or above its target, so no
  -- interval reaches it; and the two valve intervals fall either side of a year.
  if not (v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr > 0.0001::double precision) then
    raise exception 'H3 go-live refused: the SIL 1 catalogue design meets the export TMEL [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]';
  end if;
  if not (v_g_usan_mitigated_frequency_with_sif_per_yr < 1e-06::double precision) then
    raise exception 'H3 go-live refused: the USAN SIF does not close its row [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]';
  end if;
  if not (v_g_yoho_transmitter_ptc_floor_pfdavg >= 0.003::double precision) then
    raise exception 'H3 go-live refused: the transmitter floor sits below its target, so the target is achievable [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]';
  end if;
  if not (v_g_yoho_valve_1oo1_ptc_max_interval_hours < 8760.0::double precision and v_g_yoho_valves_1oo2_max_interval_hours > 8760.0::double precision) then
    raise exception 'H3 go-live refused: the two valve intervals do not fall either side of a year [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours, advanced/yoho_valves_1oo2_max_interval_hours]';
  end if;

  -- ------------------------------------------------- 3. the traps bite
  -- Each wrong reading is computed over the same inputs and must MISS the
  -- graded value by more than its tolerance, or the field does not
  -- discriminate the trap it is for. A wrong method with no answer at all
  -- (NaN) misses by construction.
  v_wrong := ((0.37::double precision * 1.0::double precision) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_unmitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the enabling condition forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_wrong, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_wrong := ((0.37::double precision * (1.0::double precision * 0.23::double precision)) * 1.0::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_unmitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the modifiers forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_wrong, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_wrong := 0.37::double precision;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_unmitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the initiating frequency alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_wrong, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_wrong := (((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_unmitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the credited ipl applied gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_wrong, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_wrong := (0.37::double precision * ((0.0::double precision + 0.23::double precision) + ((0.0::double precision + 0.42::double precision) + 0.18::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_unmitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the probabilities summed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_unmitigated_frequency_per_yr]', v_wrong, v_g_akpo_separator_unmitigated_frequency_per_yr;
  end if;
  v_wrong := ((((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * ((1.0::double precision * 0.1::double precision) * 0.1::double precision)) / 1e-05::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_required_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the non independent ipl credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_required_rrf]', v_wrong, v_g_akpo_separator_required_rrf;
  end if;
  v_wrong := ((((0.37::double precision * 1.0::double precision) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_required_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the enabling condition forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_required_rrf]', v_wrong, v_g_akpo_separator_required_rrf;
  end if;
  v_wrong := ((((0.37::double precision * (1.0::double precision * 0.23::double precision)) * 1.0::double precision) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_required_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the modifiers forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_required_rrf]', v_wrong, v_g_akpo_separator_required_rrf;
  end if;
  v_wrong := (1.0::double precision / ((((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_required_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the ratio inverted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_required_rrf]', v_wrong, v_g_akpo_separator_required_rrf;
  end if;
  v_wrong := ((((0.37::double precision * (1.0::double precision * 0.23::double precision)) * ((1.0::double precision * 0.42::double precision) * 0.18::double precision)) * 1.0::double precision) / 1e-05::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_separator_required_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the no ipl credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_separator_required_rrf]', v_wrong, v_g_akpo_separator_required_rrf;
  end if;
  v_wrong := (((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision)) * ((1.0::double precision * 0.1::double precision) * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the non independent ipl credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_wrong, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_wrong := (((0.83::double precision * 1.0::double precision) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the enabling conditions forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_wrong, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_wrong := (((0.83::double precision * (1.0::double precision * 0.64::double precision)) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the second enabling condition forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_wrong, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_wrong := (((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * 1.0::double precision) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the modifier forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_wrong, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_wrong := ((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_mitigated_frequency_without_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the ipls not applied gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_mitigated_frequency_without_sif_per_yr]', v_wrong, v_g_akpo_tank_mitigated_frequency_without_sif_per_yr;
  end if;
  v_wrong := ((((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_required_sif_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the required rrf reported gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_wrong, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_wrong := (1.0::double precision / ((((0.83::double precision * ((1.0::double precision * 0.64::double precision) * 0.35::double precision)) * (1.0::double precision * 0.27::double precision)) * ((1.0::double precision * 0.1::double precision) * 0.1::double precision)) / 1e-05::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_required_sif_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the non independent ipl credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_wrong, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_wrong := 0.01::double precision;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_required_sif_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the band ceiling of the required sil gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_wrong, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_wrong := 0.001::double precision;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_required_sif_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the band floor of the required sil gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_wrong, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_wrong := (1.0::double precision / ((((0.83::double precision * 1.0::double precision) * (1.0::double precision * 0.27::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_tank_required_sif_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the enabling conditions forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_tank_required_sif_pfdavg]', v_wrong, v_g_akpo_tank_required_sif_pfdavg;
  end if;
  v_wrong := (((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the sif not applied gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.01::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the sif at the sil band ceiling gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * (1.0::double precision * 0.1::double precision)) * (1.0::double precision / ((((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * (1.0::double precision * 0.1::double precision)) / 1e-05::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the required pfdavg used for the sif gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.19::double precision * 1.0::double precision) * ((1.0::double precision * 0.33::double precision) * 0.52::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.0037::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the fatal injury modifier forgotten gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.19::double precision * 1.0::double precision) * (((1.0::double precision * 0.33::double precision) * 0.52::double precision) * 0.4::double precision)) * 1.0::double precision) * 0.0037::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the gas detection not credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_compressor_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_akpo_compressor_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.00318::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the exact decade put in the higher sil gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_wrong, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_wrong := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) * 0.00318::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the unsnapped float comparison gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_wrong, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_wrong := (((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the sif not applied gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_wrong, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_wrong := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * ((1.0::double precision * 0.1::double precision) * 0.1::double precision)) * 0.0273::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the non independent ipl credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_wrong, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_wrong := ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) * (1.0::double precision / ((((0.64::double precision * (1.0::double precision * 0.625::double precision)) * (1.0::double precision * 0.25::double precision)) * (1.0::double precision * 0.1::double precision)) / 0.0001::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the required pfdavg used for the sif gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpo_export_catalogue_sif_mitigated_frequency_per_yr]', v_wrong, v_g_akpo_export_catalogue_sif_mitigated_frequency_per_yr;
  end if;
  v_wrong := ((((3.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the multiplicity three for six gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((1.9e-06::double precision + 6.3e-07::double precision) * (1.9e-06::double precision + 6.3e-07::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the no one minus beta gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the group down time at t over two gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 0.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 0.0::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 0.0::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.0::double precision / (6.3e-07::double precision + 0.0::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 0.0::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((0.0::double precision / (6.3e-07::double precision + 0.0::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 0.0::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the detected failures ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := (((((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision) * ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (8760.0::double precision * 8760.0::double precision)) + (((0.06::double precision * 6.3e-07::double precision) * 8760.0::double precision) / 2.0::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the tr84 simplified form gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((((1.0::double precision - 0.06::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.06::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.06::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_transmitters_2oo3_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the beta used for betad gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_transmitters_2oo3_pfdavg]', v_wrong, v_g_usan_transmitters_2oo3_pfdavg;
  end if;
  v_wrong := ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 1.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_logic_solver_1oo1_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the half dropped in 1oo1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_wrong, v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  v_wrong := ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_logic_solver_1oo1_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_wrong, v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  v_wrong := ((4.6e-08::double precision + 0.0::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.0::double precision / (4.6e-08::double precision + 0.0::double precision)) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_logic_solver_1oo1_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the detected failures ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_wrong, v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  v_wrong := ((4.6e-08::double precision + 7.6e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_logic_solver_1oo1_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the detected failures treated as undetected gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_logic_solver_1oo1_pfdavg]', v_wrong, v_g_usan_logic_solver_1oo1_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((3e-07::double precision + 2.4e-06::double precision) * (3e-07::double precision + 2.4e-06::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the no one minus beta gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the group down time at t over two gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 0.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.0::double precision / (2.4e-06::double precision + 0.0::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((0.0::double precision / (2.4e-06::double precision + 0.0::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 0.0::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the detected failures ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := ((((((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision) * ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (8760.0::double precision * 8760.0::double precision)) / 3.0::double precision) + (((0.1::double precision * 2.4e-06::double precision) * 8760.0::double precision) / 2.0::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the tr84 simplified form gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * (8760.0::double precision + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_valves_1oo2_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the common cause over the full interval gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_valves_1oo2_pfdavg]', v_wrong, v_g_usan_valves_1oo2_pfdavg;
  end if;
  v_wrong := (1.0::double precision / (((1.0::double precision * ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)))) * ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) * ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_sif_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the product of subsystem pfdavg gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_sif_rrf]', v_wrong, v_g_usan_sif_rrf;
  end if;
  v_wrong := (1.0::double precision / ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_sif_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the weakest subsystem only gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_sif_rrf]', v_wrong, v_g_usan_sif_rrf;
  end if;
  v_wrong := (1.0::double precision / (((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision))) + ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_sif_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the logic solver left out gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_sif_rrf]', v_wrong, v_g_usan_sif_rrf;
  end if;
  v_wrong := (((0.0::double precision + (1.0::double precision / ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision))))) + (1.0::double precision / ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision))))) + (1.0::double precision / ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_sif_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the sum of subsystem rrfs gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_sif_rrf]', v_wrong, v_g_usan_sif_rrf;
  end if;
  v_wrong := (1.0::double precision / ((((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision))) + ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) + ((2.4e-06::double precision + 3e-07::double precision) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_sif_rrf) <= 5e-07) then
    raise exception 'H3 go-live refused: the valves as 1oo1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_sif_rrf]', v_wrong, v_g_usan_sif_rrf;
  end if;
  v_wrong := (((2.0::double precision * (6.3e-07::double precision + 1.9e-06::double precision)) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_proposed_2oo2_transmitters_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the beta applied to 2oo2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_wrong, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_wrong := ((2.0::double precision * (((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision) + ((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_proposed_2oo2_transmitters_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the one minus beta applied to 2oo2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_wrong, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_wrong := ((((2.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_proposed_2oo2_transmitters_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the the 1oo2 formula gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_wrong, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_wrong := ((6.3e-07::double precision + 1.9e-06::double precision) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_proposed_2oo2_transmitters_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the the 1oo1 formula gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_wrong, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_wrong := ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_proposed_2oo2_transmitters_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the the 2oo3 result reused gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_proposed_2oo2_transmitters_pfdavg]', v_wrong, v_g_usan_proposed_2oo2_transmitters_pfdavg;
  end if;
  v_wrong := (((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the sif not applied gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) * (((1.0::double precision * ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)))) * ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) * ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the product of subsystem pfdavg gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) * (1.0::double precision / ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) / 1e-06::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the required pfdavg used for the sif gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) * 0.01::double precision);
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the sil band ceiling used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * 1.0::double precision) * (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)) * (((1.0::double precision - 0.03::double precision) * 1.9e-06::double precision) + ((1.0::double precision - 0.06::double precision) * 6.3e-07::double precision)))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) * (((6.3e-07::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((1.9e-06::double precision / (6.3e-07::double precision + 1.9e-06::double precision)) * 16.0::double precision))) + (((0.06::double precision * 6.3e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.03::double precision * 1.9e-06::double precision) * 16.0::double precision)))) + ((4.6e-08::double precision + 7.6e-07::double precision) * (((4.6e-08::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((7.6e-07::double precision / (4.6e-08::double precision + 7.6e-07::double precision)) * 16.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the relief not credited gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_wrong := ((((0.21::double precision * (1.0::double precision * 0.44::double precision)) * (1.0::double precision * 0.3::double precision)) * (1.0::double precision * 0.01::double precision)) * ((((2.0::double precision * ((((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)) * (((1.0::double precision - 0.05::double precision) * 3e-07::double precision) + ((1.0::double precision - 0.1::double precision) * 2.4e-06::double precision)))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) * (((2.4e-06::double precision / (2.4e-06::double precision + 3e-07::double precision)) * ((8760.0::double precision / 3.0::double precision) + 16.0::double precision)) + ((3e-07::double precision / (2.4e-06::double precision + 3e-07::double precision)) * 16.0::double precision))) + (((0.1::double precision * 2.4e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 16.0::double precision)) + ((0.05::double precision * 3e-07::double precision) * 16.0::double precision))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_usan_mitigated_frequency_with_sif_per_yr) <= 5e-13) then
    raise exception 'H3 go-live refused: the valves only gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/usan_mitigated_frequency_with_sif_per_yr]', v_wrong, v_g_usan_mitigated_frequency_with_sif_per_yr;
  end if;
  v_t := 1e-09::double precision;
  if not (((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) < 0.0022::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the group down time at t over two gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((2.0::double precision * ((0.0::double precision + 2.3e-06::double precision) * (0.0::double precision + 2.3e-06::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) < 0.0022::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((2.0::double precision * ((0.0::double precision + 2.3e-06::double precision) * (0.0::double precision + 2.3e-06::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((2.0::double precision * ((0.0::double precision + 2.3e-06::double precision) * (0.0::double precision + 2.3e-06::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the no one minus beta gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) < 0.0022::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * (v_t + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) < 0.0022::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * (v_t + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * (v_t + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.0022::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the common cause over the full interval gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) < 0.01::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.01::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))) <= 0.01::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the budget read as the sil band ceiling gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_wrong := ((8760.0::double precision * 0.0022::double precision) / ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valves_1oo2_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the linear scaling from one year gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valves_1oo2_max_interval_hours]', v_wrong, v_g_yoho_valves_1oo2_max_interval_hours;
  end if;
  v_wrong := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the coverage ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_wrong, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_wrong := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * (105120.0::double precision + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the uncovered part over the full lifetime gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_wrong, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_wrong := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((8760.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 0.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_wrong, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_wrong := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + 0.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the covered part only gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_wrong, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_wrong := ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((8760.0::double precision / 1.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 1.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the half dropped in 1oo1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_pfdavg]', v_wrong, v_g_yoho_valve_1oo1_ptc_pfdavg;
  end if;
  v_t := 1e-09::double precision;
  if not (((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) < 0.0118::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the coverage ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_wrong, v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * (105120.0::double precision + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) < 0.0118::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * (105120.0::double precision + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * (105120.0::double precision + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the uncovered part over the full lifetime gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_wrong, v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 0.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) < 0.0118::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 0.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 2.0::double precision) + 0.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_wrong, v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + 0.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) < 0.0118::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + 0.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 2.0::double precision) + 48.0::double precision)) + 0.0::double precision)) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the covered part only gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_wrong, v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 1.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 1.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) < 0.0118::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 1.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 1.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((7.8e-07::double precision + 0.0::double precision) * (((7.8e-07::double precision / (7.8e-07::double precision + 0.0::double precision)) * ((0.75::double precision * ((v_t / 1.0::double precision) + 48.0::double precision)) + ((1.0::double precision - 0.75::double precision) * ((105120.0::double precision / 1.0::double precision) + 48.0::double precision)))) + ((0.0::double precision / (7.8e-07::double precision + 0.0::double precision)) * 0.0::double precision))) <= 0.0118::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_valve_1oo1_ptc_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the half dropped in 1oo1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_valve_1oo1_ptc_max_interval_hours]', v_wrong, v_g_yoho_valve_1oo1_ptc_max_interval_hours;
  end if;
  v_wrong := ((6.1e-07::double precision + 2.4e-06::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * ((0.0::double precision / 2.0::double precision) + 72.0::double precision)) + ((2.4e-06::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * 72.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitter_ptc_floor_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the coverage ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_wrong, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_wrong := ((6.1e-07::double precision + 2.4e-06::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * ((0.6::double precision * ((0.0::double precision / 2.0::double precision) + 72.0::double precision)) + ((1.0::double precision - 0.6::double precision) * (131400.0::double precision + 72.0::double precision)))) + ((2.4e-06::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * 72.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitter_ptc_floor_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the uncovered part over the full lifetime gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_wrong, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_wrong := ((6.1e-07::double precision + 2.4e-06::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * ((0.6::double precision * ((0.0::double precision / 2.0::double precision) + 0.0::double precision)) + ((1.0::double precision - 0.6::double precision) * ((131400.0::double precision / 2.0::double precision) + 0.0::double precision)))) + ((2.4e-06::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * 72.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitter_ptc_floor_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_wrong, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_wrong := ((6.1e-07::double precision + 0.0::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 0.0::double precision)) * ((0.6::double precision * ((0.0::double precision / 2.0::double precision) + 72.0::double precision)) + ((1.0::double precision - 0.6::double precision) * ((131400.0::double precision / 2.0::double precision) + 72.0::double precision)))) + ((0.0::double precision / (6.1e-07::double precision + 0.0::double precision)) * 72.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitter_ptc_floor_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the detected failures left out gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_wrong, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_wrong := ((6.1e-07::double precision + 2.4e-06::double precision) * (((6.1e-07::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * ((0.6::double precision * ((8760.0::double precision / 2.0::double precision) + 72.0::double precision)) + ((1.0::double precision - 0.6::double precision) * ((131400.0::double precision / 2.0::double precision) + 72.0::double precision)))) + ((2.4e-06::double precision / (6.1e-07::double precision + 2.4e-06::double precision)) * 72.0::double precision)));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitter_ptc_floor_pfdavg) <= 5e-13) then
    raise exception 'H3 go-live refused: the the one year pfdavg reported gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitter_ptc_floor_pfdavg]', v_wrong, v_g_yoho_transmitter_ptc_floor_pfdavg;
  end if;
  v_wrong := (1.0::double precision / (3.0::double precision * (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision)))) + ((5.2e-08::double precision + 9.1e-07::double precision) * (((5.2e-08::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((9.1e-07::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * 24.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision))))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_sif_rrf_at_three_year_interval) <= 5e-07) then
    raise exception 'H3 go-live refused: the one year rrf divided by three gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_wrong, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_wrong := (1.0::double precision / ((((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) + ((5.2e-08::double precision + 9.1e-07::double precision) * (((5.2e-08::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((9.1e-07::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * 24.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_sif_rrf_at_three_year_interval) <= 5e-07) then
    raise exception 'H3 go-live refused: the only the valves stretched gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_wrong, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_wrong := (1.0::double precision / (((0.0::double precision + ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((8760.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision)))) + ((5.2e-08::double precision + 9.1e-07::double precision) * (((5.2e-08::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * ((8760.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((9.1e-07::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * 24.0::double precision)))) + ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((8760.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((8760.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_sif_rrf_at_three_year_interval) <= 5e-07) then
    raise exception 'H3 go-live refused: the one year rrf kept gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_wrong, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_wrong := (1.0::double precision / (((1.0::double precision * ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision)))) * ((5.2e-08::double precision + 9.1e-07::double precision) * (((5.2e-08::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((9.1e-07::double precision / (5.2e-08::double precision + 9.1e-07::double precision)) * 24.0::double precision)))) * ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_sif_rrf_at_three_year_interval) <= 5e-07) then
    raise exception 'H3 go-live refused: the product of subsystem pfdavg gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_wrong, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_wrong := (1.0::double precision / (((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((26280.0::double precision / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((26280.0::double precision / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) + ((((2.0::double precision * ((((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)) * (((1.0::double precision - 0.0::double precision) * 0.0::double precision) + ((1.0::double precision - 0.07::double precision) * 2.3e-06::double precision)))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) * (((2.3e-06::double precision / (2.3e-06::double precision + 0.0::double precision)) * ((26280.0::double precision / 3.0::double precision) + 48.0::double precision)) + ((0.0::double precision / (2.3e-06::double precision + 0.0::double precision)) * 0.0::double precision))) + (((0.07::double precision * 2.3e-06::double precision) * ((26280.0::double precision / 2.0::double precision) + 48.0::double precision)) + ((0.0::double precision * 0.0::double precision) * 0.0::double precision)))));
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_sif_rrf_at_three_year_interval) <= 5e-07) then
    raise exception 'H3 go-live refused: the logic solver left out gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_sif_rrf_at_three_year_interval]', v_wrong, v_g_yoho_sif_rrf_at_three_year_interval;
  end if;
  v_t := 1e-09::double precision;
  if not (((((3.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) < 0.00015::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((3.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((3.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitters_2oo3_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the multiplicity three for six gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_wrong, v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((6.0::double precision * ((1.3e-06::double precision + 7.4e-07::double precision) * (1.3e-06::double precision + 7.4e-07::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) < 0.00015::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((6.0::double precision * ((1.3e-06::double precision + 7.4e-07::double precision) * (1.3e-06::double precision + 7.4e-07::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((6.0::double precision * ((1.3e-06::double precision + 7.4e-07::double precision) * (1.3e-06::double precision + 7.4e-07::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitters_2oo3_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the no one minus beta gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_wrong, v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) < 0.00015::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitters_2oo3_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the group down time at t over two gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_wrong, v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) < 0.00015::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 1.3e-06::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * ((v_t / 3.0::double precision) + 0.0::double precision)) + ((1.3e-06::double precision / (7.4e-07::double precision + 1.3e-06::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 0.0::double precision)) + ((0.05::double precision * 1.3e-06::double precision) * 24.0::double precision))) <= 0.00015::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitters_2oo3_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the mrt ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_wrong, v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;
  v_t := 1e-09::double precision;
  if not (((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 0.0::double precision) * 24.0::double precision))) < 0.00015::double precision) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 0.0::double precision) * 24.0::double precision))) <= 0.00015::double precision loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if ((((6.0::double precision * ((((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)) * (((1.0::double precision - 0.05::double precision) * 0.0::double precision) + ((1.0::double precision - 0.1::double precision) * 7.4e-07::double precision)))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) * (((7.4e-07::double precision / (7.4e-07::double precision + 0.0::double precision)) * ((v_t / 3.0::double precision) + 24.0::double precision)) + ((0.0::double precision / (7.4e-07::double precision + 0.0::double precision)) * 24.0::double precision))) + (((0.1::double precision * 7.4e-07::double precision) * ((v_t / 2.0::double precision) + 24.0::double precision)) + ((0.05::double precision * 0.0::double precision) * 24.0::double precision))) <= 0.00015::double precision then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;
  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - v_g_yoho_transmitters_2oo3_max_interval_hours) <= 5e-07) then
    raise exception 'H3 go-live refused: the detected failures ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/yoho_transmitters_2oo3_max_interval_hours]', v_wrong, v_g_yoho_transmitters_2oo3_max_interval_hours;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'lopa';
  if not exists (select 1 from public.academy_apps where slug = 'lopa' and status = 'available') then
    raise exception 'H3 go-live refused: lopa did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H3 go-live: lopa available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
