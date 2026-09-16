-- ============================================================================
-- EC6 RECUT, CAPSTONE AND STRUCTURE: Field Development Planning (fdp).
--
-- WHY. Engines #183 and #191 (vendored in this branch from engines main
-- 709172f) charge a plan's end-of-life cost in the final production year of
-- every screening case it implies. The UKOT capstone plan carries an ABEX cost
-- item, "Abandonment provision", of 190 million USD, which before the repair
-- reached no cash flow at all. Charging it moves four of the eighteen graded
-- values and destroys a fifth.
--
-- WHAT MOVES.
--   beginner     ukot_base_npv_mm           1717.6860327539478 -> 1694.0731982105392
--   beginner     ukot_alternative_npv_mm    721.0656772144272 -> 695.4146347459839
--   advanced     ukot_price_swing_mm        2202.685546432514 -> 2206.7509870934814
--   advanced     ukot_stress_npv_mm         -771.0011900805065 -> -797.9291563861506
--
-- AND ONE FIELD IS RETIRED, NOT MOVED. Charging the end-of-life cost makes the
-- Board case flow change sign twice, so the engine returns irr null with
-- irrStatus 'multiple-roots' and BOTH roots in irrRoots:
--   -43.22592817326132 and 37.65929157034489
-- A numerically graded field cannot grade a null, so ukot_base_irr_pct
-- (37.66903234346082, tol 0.01) cannot stand.
--
-- THE HIGHER ROOT WAS REJECTED DELIBERATELY. 37.65929157034489 sits
-- 0.009740773115929358 from the retired answer, INSIDE the
-- retired tolerance of 0.01, so grading it would pass a learner who ran the
-- pre-repair case and never noticed the repair. The LOWER root can only be
-- found by reading both, which is the judgement the repair exposes, so the
-- replacement is:
--   ukot_base_irr_low_root_pct = -43.22592817326132, tol 0.01, unit percent
--   "Lower of the two rates at which the Board case NPV is zero, on the Wellhead platform concept"
-- The removal and the insertion are ONE jsonb rewrite of ONE row, at array
-- position 5, so the Associate tier never holds five or seven fields at any
-- instant. This migration asserts below that the rejection reasoning still
-- holds arithmetically.
--
-- THE PROMPTS DO NOT MOVE. None of the three prompts enumerates its six
-- fields or states a rate: the Associate prompt ends "Read six values. Money
-- to four decimals in million USD; reserves to four decimals; the rate to four
-- decimals in percent", which is still true of a rate at which the NPV is
-- zero. The field LABEL carries the definition, and the new label states it in
-- full. All three prompt md5s are asserted unchanged.
--
-- HOW THE VALUES WERE PRODUCED. The course's own field computation
-- (/root/ec-wip-fdp/ec6_capstone.mjs) was run against the engine vendored in
-- this branch, and against the PRE-REPAIR engine (the same tree with the two
-- vendored files rolled back to 662444d9^, called with no abandonment, as the
-- live course was cut). The pre-repair run reproduced ALL EIGHTEEN live values
-- character for character, so only a real engine move is declared a move.
-- Generator: scratchpad ec6recut/gen_capstone.py, reading a dump of the live
-- rows. Nothing published is retyped.
--
-- LEARNER IMPACT: NONE, AND THIS FILE REFUSES IF THAT EVER CHANGES.
-- public.academy_capstone_attempts holds 7 rows in the whole table, all of them
-- welldata/beginner; fdp has 0 attempts, 0 certifications and 0 enrollments. No
-- learner has been graded against a value this file moves or against the field
-- it retires. Block 0 re-checks that at run time and refuses rather than
-- silently moving a value someone has been graded against.
--
-- THE LESSON RETITLE HAS NO ROW HERE, AND THAT IS NOT AN OMISSION.
-- beginner/m05/l02 becomes "CAPEX, OPEX and the line outside both totals" with
-- its key l02-capex-opex-and-the-line-left-out unchanged.
-- academy_course_structures stores modules with a title and a flat list of
-- lesson KEYS; lesson titles live only in
-- src/content/courses/fdp/beginner/manifest.json and reach production with the
-- front-end upload, not with a migration. Block 4 ASSERTS that the live
-- structure still carries no lesson titles and that the key is present exactly
-- once, so if that ever changes the assertion fails loudly rather than leaving
-- a stale title in the database. (The MANIFEST-index.json claim that
-- "academy_course_structures for tier beginner must be reseeded from that
-- manifest" is wrong: there is nothing in that row to reseed.)
--
-- GUARDS. Every value and the swapped field must be EITHER the published one,
-- in which case it is written, OR the recut one, in which case it is left
-- alone. Anything else raises. The thirteen untouched values, every key,
-- label, unit, tolerance, field order, prompt, title, dataset, cert tier and
-- active flag are captured before and compared after, each tier is re-asserted
-- at 6 graded fields, and the go-live's own gates are re-run on the result.
--
-- SAFE TO RE-RUN. A second run finds everything already recut and writes
-- nothing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Learner impact. Refuse outright if anyone has been graded on this course.
-- ----------------------------------------------------------------------------
do $$
declare
  v_attempts integer;
begin
  select count(*) into v_attempts
    from public.academy_capstone_attempts where app_slug = 'fdp';
  if v_attempts <> 0 then
    raise exception 'EC6 recut refused: fdp has % capstone attempt(s). This file moves four graded values and retires a fifth, so a learner already graded against them must be regraded or flagged FIRST. That is an owner decision, not one this migration takes silently.', v_attempts;
  end if;
  raise notice 'EC6 recut: 0 capstone attempts on fdp, so no learner has been graded against a value this file moves';
end $$;

-- ----------------------------------------------------------------------------
-- 1. The four moved values, and the atomic swap of the Associate IRR field.
-- ----------------------------------------------------------------------------
do $$
declare
  v_before_others text;
  v_after_others  text;
  v_before_shape  text;
  v_after_shape   text;
  v_before_head   text;
  v_after_head    text;
  v_expected      numeric;
  v_state         text;
  v_count         integer;
  v_updated       integer := 0;
  t               text;
  k               text;
  v_old           numeric;
  v_new           numeric;
begin
  -- Every graded field that this file does NOT touch, with value and tolerance.
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_before_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp' and f->>'key' not in ('ukot_base_npv_mm', 'ukot_alternative_npv_mm', 'ukot_price_swing_mm', 'ukot_stress_npv_mm', 'ukot_base_irr_pct', 'ukot_base_irr_low_root_pct');

  -- Key order, labels, units and tolerances at every position EXCEPT the one
  -- position that is allowed to change identity.
  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_before_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fdp' and (e.f->>'key') not in ('ukot_base_irr_pct', 'ukot_base_irr_low_root_pct');

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_before_head
    from public.academy_capstones c where c.app_slug = 'fdp';
  if v_before_head is null then
    raise exception 'EC6 recut refused: fdp has no capstones';
  end if;

  -- ---------------------------------------------- the four moved values --
  for t, k, v_old, v_new in
    select * from (values
      ('beginner', 'ukot_base_npv_mm', 1717.6860327539478, 1694.0731982105392),
      ('beginner', 'ukot_alternative_npv_mm', 721.0656772144272, 695.4146347459839),
      ('advanced', 'ukot_price_swing_mm', 2202.685546432514, 2206.7509870934814),
      ('advanced', 'ukot_stress_npv_mm', -771.0011900805065, -797.9291563861506)
    ) as m(t, k, v_old, v_new)
  loop
    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'fdp' and c.tier = t and f->>'key' = k;

    if v_expected is null then
      raise exception 'EC6 recut refused: no % capstone field %', t, k;
    end if;
    if v_expected <> v_old and v_expected <> v_new then
      raise exception 'EC6 recut refused: % capstone field % expects %, neither the published value nor the recut one', t, k, v_expected;
    end if;

    if v_expected = v_old then
      update public.academy_capstones c
         set fields = (select jsonb_agg(case when e.f->>'key' = k
                                             then jsonb_set(e.f, '{expected}', to_jsonb(v_new))
                                             else e.f end order by e.n)
                         from jsonb_array_elements(c.fields) with ordinality as e(f, n))
       where c.app_slug = 'fdp' and c.tier = t;
      get diagnostics v_count = row_count;
      if v_count <> 1 then
        raise exception 'EC6 recut refused: % capstone field % update touched % rows', t, k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'fdp' and c.tier = t and f->>'key' = k;
    if v_expected <> v_new then
      raise exception 'EC6 recut refused: % capstone field % still expects % after the update', t, k, v_expected;
    end if;
  end loop;

  -- -------------------------------------- the Associate field 5 swap --
  select case
           when e.f->>'key' = 'ukot_base_irr_pct'
            and (e.f->>'expected')::numeric = 37.66903234346082
            and (e.f->>'tol')::numeric = 0.01
            and e.f->>'unit' = 'percent'
            and e.f->>'label' = 'IRR of the Board case scenario on the Wellhead platform concept' then 'old'
           when e.f->>'key' = 'ukot_base_irr_low_root_pct'
            and (e.f->>'expected')::numeric = -43.22592817326132
            and (e.f->>'tol')::numeric = 0.01
            and e.f->>'unit' = 'percent'
            and e.f->>'label' = 'Lower of the two rates at which the Board case NPV is zero, on the Wellhead platform concept' then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fdp' and c.tier = 'beginner' and e.n = 5;
  if v_state is null then
    raise exception 'EC6 recut refused: the Associate capstone has no field at position 5';
  end if;
  if v_state = 'other' then
    raise exception 'EC6 recut refused: the Associate field at position 5 is neither the published rate-of-return field nor the recut low-root one';
  end if;

  if v_state = 'old' then
    -- ONE update: the retired field leaves and the new one arrives in its
    -- place, in the same statement, at the same array position.
    update public.academy_capstones c
       set fields = (select jsonb_agg(case when e.n = 5
                                           then '{"expected": -43.22592817326132, "key": "ukot_base_irr_low_root_pct", "label": "Lower of the two rates at which the Board case NPV is zero, on the Wellhead platform concept", "tol": 0.01, "unit": "percent"}'::jsonb
                                           else e.f end order by e.n)
                       from jsonb_array_elements(c.fields) with ordinality as e(f, n))
     where c.app_slug = 'fdp' and c.tier = 'beginner';
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'EC6 recut refused: the Associate field swap touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the swap assertions --
  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp' and f->>'key' = 'ukot_base_irr_pct';
  if v_count <> 0 then
    raise exception 'EC6 recut refused: the retired key is still present % time(s)', v_count;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp' and f->>'key' = 'ukot_base_irr_low_root_pct'
     and (f->>'expected')::numeric = -43.22592817326132;
  if v_count <> 1 then
    raise exception 'EC6 recut refused: the low-root field is present % time(s) at its recut value, expected 1', v_count;
  end if;

  -- The graded low root must not be confusable with the retired answer: that
  -- is the whole reason the higher root was not used.
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp' and f->>'key' = 'ukot_base_irr_low_root_pct';
  if v_expected >= 0 then
    raise exception 'EC6 recut refused: the graded root % is not negative, so it is not the LOWER root', v_expected;
  end if;
  if abs(v_expected - 37.66903234346082) <= 10 * 0.01 then
    raise exception 'EC6 recut refused: the graded root % sits within ten tolerances of the retired answer, so a learner running the pre-repair case would pass', v_expected;
  end if;
  if abs(v_expected - 37.65929157034489) <= 10 * 0.01 then
    raise exception 'EC6 recut refused: the graded root % is the HIGHER root, which was rejected', v_expected;
  end if;
  -- And the stated reason for rejecting the higher root must still be true.
  if abs(37.65929157034489 - 37.66903234346082) > 0.01 then
    raise exception 'EC6 recut refused: the higher root no longer sits inside the retired tolerance, so the recorded reason for rejecting it does not hold';
  end if;

  -- ------------------------------------------- the unchanged assertions --
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_after_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp' and f->>'key' not in ('ukot_base_npv_mm', 'ukot_alternative_npv_mm', 'ukot_price_swing_mm', 'ukot_stress_npv_mm', 'ukot_base_irr_pct', 'ukot_base_irr_low_root_pct');
  if v_after_others is distinct from v_before_others then
    raise exception 'EC6 recut refused: a capstone field this file does not touch moved';
  end if;

  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_after_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fdp' and (e.f->>'key') not in ('ukot_base_irr_pct', 'ukot_base_irr_low_root_pct');
  if v_after_shape is distinct from v_before_shape then
    raise exception 'EC6 recut refused: a capstone key, label, unit, tolerance or field order changed';
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_after_head
    from public.academy_capstones c where c.app_slug = 'fdp';
  if v_after_head is distinct from v_before_head then
    raise exception 'EC6 recut refused: a capstone prompt, title, dataset, cert tier or active flag changed';
  end if;

  for t in select unnest(array['beginner', 'intermediate', 'advanced']) loop
    select count(*) into v_count
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'fdp' and c.tier = t;
    if v_count <> 6 then
      raise exception 'EC6 recut refused: the % capstone carries % graded fields, expected 6', t, v_count;
    end if;
  end loop;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp';
  if v_count <> 18 then
    raise exception 'EC6 recut refused: the fdp capstones carry % graded fields, expected 18', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'fdp';
  if v_count <> 3 then
    raise exception 'EC6 recut refused: fdp has % capstones, expected 3', v_count;
  end if;

  raise notice 'EC6 recut capstone: % of 5 changes written (4 moved values + 1 field swap)', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 2. The go-live's own gates, re-run on the recut capstone.
-- ----------------------------------------------------------------------------
do $$
declare
  v_graded integer;
  v_u_base_npv_mm numeric;
  v_u_alternative_npv_mm numeric;
  v_u_stress_npv_mm numeric;
  v_u_price_swing_mm numeric;
  v_u_low_root_pct numeric;
begin
  -- The scope assertion: nothing these engines cannot produce.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp'
     and (f->>'label' ilike '%value of information%' or f->>'label' ilike '%evpi%'
       or f->>'label' ilike '%breakeven%' or f->>'label' ilike '%decision tree%'
       or f->>'label' ilike '%efficient frontier%' or f->>'label' ilike '%working interest%'
       or f->>'unit'  ilike '%psi%');
  if v_graded <> 0 then
    raise exception 'EC6 recut refused: % capstone field(s) grade a quantity these engines cannot produce', v_graded;
  end if;

  -- A P-label may only name a reserves distribution, one fluid at a time.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp'
     and f->>'label' ~ '\mP(10|50|90)\M'
     and f->>'label' !~* '(oil|gas|condensate|reserves)';
  if v_graded <> 0 then
    raise exception 'EC6 recut refused: % capstone field label(s) put a P-label on something other than a reserves distribution', v_graded;
  end if;

  -- No graded answer may sit within its own tolerance of a number the goldens
  -- or the teaching digest carry. The list is the applied go-live's, plus the
  -- headline figures of the REBUILT 534 line digest this recut is cut against.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (2250), (130), (70), (2047.5653), (29.5998), (3.8273), (870), (933), (63)
          , (1363.3524), (204.5029), (10178668), (8360000), (0.821326), (0.26125)
          , (3092.0051), (-1797.2732), (0.247009), (0.428718), (0.877425)
          -- and the rebuilt digest's own headline figures (EC6 abandonment recut)
          , (2015.4123), (-1834.1220), (1013.7182), (5288.8051), (0.328598)
          , (32.1530), (260.0000), (3.2035), (95.0000), (730.0000)
          , (3097.7119), (3564.2683), (466.5563), (1735.4539), (2178.5655)
         ) as g(v)
   where c.app_slug = 'fdp'
     and abs(abs((f->>'expected')::numeric) - abs(g.v)) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC6 recut refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish', v_graded;
  end if;

  -- No graded answer may land on a number the learner is handed in a prompt.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (48),(82),(130),(17),(29),(47),(26),(46),(73),(15),(28),(45),(410),(760),(150),(68),(18),(44),(190),(120),(260),(33),(14),(19),(22),(10),(24),(260),(380),(190),(171),(120),(265000),(13100),(10400),(8700),(45000),(110000),(1800000),(1950000),(4600000),(2860000),(7300000),(1180000),(9900000),(70),(20)) as h(v)
   where c.app_slug = 'fdp'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC6 recut refused: % graded field(s) land on a number the learner is handed in a prompt', v_graded;
  end if;

  -- No prompt may state a graded value belonging to another tier.
  select count(*) into v_graded
    from public.academy_capstones c, public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'fdp' and c2.app_slug = 'fdp' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC6 recut refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- The five screening economics fields, as ordered pairs and bounds. These
  -- are the go-live's own checks, re-run on the recut values. The retired
  -- rate-of-return band check is replaced by the low-root checks, which sit
  -- with the swap in block 1.
  select (f->>'expected')::numeric into v_u_base_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_base_npv_mm';
  select (f->>'expected')::numeric into v_u_alternative_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_alternative_npv_mm';
  select (f->>'expected')::numeric into v_u_stress_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_stress_npv_mm';
  select (f->>'expected')::numeric into v_u_price_swing_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_price_swing_mm';
  select (f->>'expected')::numeric into v_u_low_root_pct from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_base_irr_low_root_pct';
  if v_u_base_npv_mm is null or v_u_alternative_npv_mm is null or v_u_stress_npv_mm is null
     or v_u_price_swing_mm is null or v_u_low_root_pct is null then
    raise exception 'EC6 recut refused: one of the five screening economics fields is missing';
  end if;

  if v_u_base_npv_mm <= v_u_alternative_npv_mm + 100 then
    raise exception 'EC6 recut refused: the two concepts are not far enough apart to be compared';
  end if;
  if v_u_alternative_npv_mm <= 0 then
    raise exception 'EC6 recut refused: the alternative concept does not carry a positive value';
  end if;
  if v_u_stress_npv_mm >= 0 then
    raise exception 'EC6 recut refused: the stress case is not a loss, so it cannot teach a case with no rate of return';
  end if;
  if v_u_base_npv_mm - v_u_stress_npv_mm <= 1320 then
    raise exception 'EC6 recut refused: the price cases are closer than the capex, so the tier cannot examine price exposure';
  end if;
  if v_u_price_swing_mm <= v_u_base_npv_mm then
    raise exception 'EC6 recut refused: the price swing is not wider than the base NPV, so the sensitivity teaches nothing';
  end if;
  -- Charging the end-of-life cost must COST the plan value, on both concepts
  -- and on the stress case: that is the repair this recut teaches.
  if v_u_base_npv_mm >= 1717.6860327539478 then
    raise exception 'EC6 recut refused: the recut Board case % is not below the published one, so the end-of-life cost is not being charged', v_u_base_npv_mm;
  end if;

  raise notice 'EC6 recut: the go-live gates pass on the recut capstone';
end $$;

-- ----------------------------------------------------------------------------
-- 3. The course structure: the lesson retitle has NO row, and this asserts it.
-- ----------------------------------------------------------------------------
do $$
declare
  v_lesson_objects integer;
  v_modules_with_lessons integer;
  v_count          integer;
  v_title          text;
  v_keys           text;
begin
  select string_agg(e.n || ':' || (e.m->>'key') || '[' || (select string_agg(lk.v, '>' order by lk.n)
                                                             from jsonb_array_elements_text(e.m->'lesson_keys') with ordinality as lk(v, n)) || ']', ',' order by e.n)
    into v_keys
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
   where s.app_slug = 'fdp' and s.tier = 'beginner';
  if v_keys is null then
    raise exception 'EC6 recut refused: no Associate course structure for fdp';
  end if;

  -- The live structure stores lesson KEYS only. If a lesson title ever lands
  -- in this table, the front-end retitle of beginner m05 l02 ("CAPEX, OPEX and
  -- the line left out" -> "CAPEX, OPEX and the line outside both totals")
  -- would need a row here too, so refuse rather than leave a stale title.
  select count(*) into v_lesson_objects
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') as m,
         lateral jsonb_array_elements(m->'lesson_keys') as l
   where s.app_slug = 'fdp' and jsonb_typeof(l) <> 'string';
  if v_lesson_objects <> 0 then
    raise exception 'EC6 recut refused: the fdp structures now carry % lesson object(s), so the beginner m05 l02 retitle needs a row in this migration', v_lesson_objects;
  end if;

  select count(*) into v_modules_with_lessons
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as m
   where s.app_slug = 'fdp' and m ? 'lessons';
  if v_modules_with_lessons <> 0 then
    raise exception 'EC6 recut refused: % fdp module(s) now carry a lessons array, which may hold titles, so the retitle needs a row in this migration', v_modules_with_lessons;
  end if;

  -- The retitled lesson's KEY is unchanged, and it is where it always was.
  select count(*) into v_count
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') as m,
         lateral jsonb_array_elements_text(m->'lesson_keys') as l
   where s.app_slug = 'fdp' and s.tier = 'beginner'
     and m->>'key' = 'm05-the-plan-s-own-economics'
     and l = 'l02-capex-opex-and-the-line-left-out';
  if v_count <> 1 then
    raise exception 'EC6 recut refused: the retitled lesson key is in the Associate m05 module % time(s), expected 1', v_count;
  end if;

  -- Its module title does not move: only the lesson title does.
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fdp' and s.tier = 'beginner' and e.m->>'key' = 'm05-the-plan-s-own-economics';
  if v_title is distinct from 'The Plan''s Own Economics' then
    raise exception 'EC6 recut refused: the Associate m05 module is titled %, not the title this recut leaves in place', v_title;
  end if;

  select count(*) into v_count
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as m
   where s.app_slug = 'fdp' and s.tier = 'beginner';
  if v_count <> 6 then
    raise exception 'EC6 recut refused: the Associate structure holds % modules, expected 6', v_count;
  end if;

  select count(*) into v_count
    from public.academy_course_structures where app_slug = 'fdp' and active;
  if v_count <> 3 then
    raise exception 'EC6 recut refused: fdp has % active structures, expected 3', v_count;
  end if;

  raise notice 'EC6 recut structure: 0 rows needed, the retitle ships with the front end (asserted)';
end $$;

-- ---------------------------------------------------------------- read-back --
select 'ec6 recut capstone' as migration, c.tier, e.n as ord, e.f->>'key' as key,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol,
       e.f->>'label' as label
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'fdp'
 order by c.tier, e.n;

select 'ec6 recut prompt' as migration, tier, md5(prompt) as prompt_md5, length(prompt) as len
  from public.academy_capstones where app_slug = 'fdp' order by tier;

select 'ec6 recut structure' as migration, s.tier, e.n as ord,
       e.m->>'key' as module_key, e.m->>'title' as title,
       jsonb_array_length(e.m->'lesson_keys') as lessons
  from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
 where s.app_slug = 'fdp' and s.tier = 'beginner'
 order by e.n;
