-- ============================================================================
-- EC3 RECUT, CAPSTONE AND STRUCTURE: Probabilistic Economics (uncertainty).
--
-- WHY. Engines #182 (with the #187 performance pass, on top of #180) repaired
-- the Scenario Builder Monte Carlo the Expert capstone grades: the sampled
-- run now scales variable opex with the production it draws, so the spread of
-- the 1000 NPVs widened and four of the six Expert answers moved. The other
-- fourteen graded fields across the three tiers are unchanged, and no
-- tolerance moves.
--
-- WHAT MOVES.
--   um_mc_low_case_p90_npv_musd            22.343849110253952 -> -9.458763830643502
--   um_mc_high_case_p10_npv_musd           70.77465019495077  -> 103.72137834406172
--   um_mc_emv_musd                         46.51052703453377  -> 44.907432365660654
--   um_mc_10th_percentile_floor_rule_musd  22.35045845910797  -> -9.443407561604305
-- Two of the four are now NEGATIVE: the repaired sample's low tail crosses
-- zero, which is the whole point of the Expert reading.
--
-- And one course-structure title. B1 is fixed, so the Expert module that was
-- called "Repaired Edges and One Still Open" is now "Edges That Used to
-- Break", which is what its key m04-edges-that-used-to-break always said.
--
-- THE SECOND RETITLE HAS NO ROW HERE, AND THAT IS NOT AN OMISSION. Expert
-- m05 l01 "The IRR that reports its clamp" becomes "The IRR that says why it
-- is missing" (the clamp is gone, engines #180). academy_course_structures
-- stores modules with a title and a flat list of lesson KEYS; lesson titles
-- live only in src/content/courses/uncertainty/advanced/manifest.json and
-- reach production with the front-end upload, not with a migration. The
-- structure block below ASSERTS that the live structure still carries no
-- lesson titles, so that if this ever changes the assertion fails loudly
-- rather than leaving a stale title in the database.
--
-- GUARDS. Every value and title must be EITHER the published one, in which
-- case it is updated, OR the recut one, in which case it is already applied
-- and left alone. Anything else raises. Keys, tolerances, prompts, field
-- order, module keys and lesson keys are captured before and compared after.
--
-- SAFE TO RE-RUN. A second run finds everything already recut and writes
-- nothing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The four Expert capstone expected values.
-- ----------------------------------------------------------------------------
do $$
declare
  v_before_others text;
  v_after_others  text;
  v_before_shape  text;
  v_after_shape   text;
  v_before_prompt text;
  v_after_prompt  text;
  v_expected      numeric;
  v_count         integer;
  v_updated       integer := 0;
  k               text;
  v_old           numeric;
  v_new           numeric;
begin
  -- Every graded field that is NOT one of the four, with its expected value
  -- and its tolerance. Must come out of this migration byte for byte the same.
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_before_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty'
     and f->>'key' not in ('um_mc_low_case_p90_npv_musd', 'um_mc_high_case_p10_npv_musd',
                           'um_mc_emv_musd', 'um_mc_10th_percentile_floor_rule_musd');

  -- Key order, labels, units and tolerances of ALL eighteen fields. Only the
  -- four expected values may move, so this must also be unchanged.
  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_before_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'uncertainty';

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.title) || ':' || c.dataset || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_before_prompt
    from public.academy_capstones c where c.app_slug = 'uncertainty';

  -- Each field: published value or recut value, nothing else.
  for k, v_old, v_new in
    select * from (values
      ('um_mc_low_case_p90_npv_musd',            22.343849110253952, -9.458763830643502),
      ('um_mc_high_case_p10_npv_musd',           70.77465019495077,  103.72137834406172),
      ('um_mc_emv_musd',                         46.51052703453377,  44.907432365660654),
      ('um_mc_10th_percentile_floor_rule_musd',  22.35045845910797,  -9.443407561604305)
    ) as t(k, v_old, v_new)
  loop
    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'uncertainty' and c.tier = 'advanced' and f->>'key' = k;

    if v_expected is null then
      raise exception 'EC3 recut refused: no Expert capstone field %', k;
    end if;
    if v_expected <> v_old and v_expected <> v_new then
      raise exception 'EC3 recut refused: Expert capstone field % expects %, neither the published value nor the recut one', k, v_expected;
    end if;

    if v_expected = v_old then
      update public.academy_capstones c
         set fields = (select jsonb_agg(case when e.f->>'key' = k
                                             then jsonb_set(e.f, '{expected}', to_jsonb(v_new))
                                             else e.f end order by e.n)
                         from jsonb_array_elements(c.fields) with ordinality as e(f, n))
       where c.app_slug = 'uncertainty' and c.tier = 'advanced';
      get diagnostics v_count = row_count;
      if v_count <> 1 then
        raise exception 'EC3 recut refused: Expert capstone field % update touched % rows', k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    -- and it now holds the recut value
    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'uncertainty' and c.tier = 'advanced' and f->>'key' = k;
    if v_expected <> v_new then
      raise exception 'EC3 recut refused: Expert capstone field % still expects % after the update', k, v_expected;
    end if;
  end loop;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_after_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty'
     and f->>'key' not in ('um_mc_low_case_p90_npv_musd', 'um_mc_high_case_p10_npv_musd',
                           'um_mc_emv_musd', 'um_mc_10th_percentile_floor_rule_musd');
  if v_after_others is distinct from v_before_others then
    raise exception 'EC3 recut refused: a capstone field other than the four moved';
  end if;

  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_after_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'uncertainty';
  if v_after_shape is distinct from v_before_shape then
    raise exception 'EC3 recut refused: a capstone key, label, unit, tolerance or field order changed';
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.title) || ':' || c.dataset || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_after_prompt
    from public.academy_capstones c where c.app_slug = 'uncertainty';
  if v_after_prompt is distinct from v_before_prompt then
    raise exception 'EC3 recut refused: a capstone prompt, title, dataset, cert tier or active flag changed';
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'EC3 recut refused: the Expert capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty';
  if v_count <> 18 then
    raise exception 'EC3 recut refused: the uncertainty capstones carry % graded fields, expected 18', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'uncertainty';
  if v_count <> 3 then
    raise exception 'EC3 recut refused: uncertainty has % capstones, expected 3', v_count;
  end if;

  raise notice 'EC3 recut capstone: % of 4 Expert values rewritten', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 2. The Expert module title.
-- ----------------------------------------------------------------------------
do $$
declare
  v_title         text;
  v_before_keys   text;
  v_after_keys    text;
  v_before_titles text;
  v_after_titles  text;
  v_lesson_titles integer;
  v_count         integer;
  v_updated       integer := 0;
begin
  -- Module keys and their lesson keys, in order. Nothing here may move.
  select string_agg(e.n || ':' || (e.m->>'key') || '[' || (select string_agg(lk.v, '>' order by lk.n)
                                                             from jsonb_array_elements_text(e.m->'lesson_keys') with ordinality as lk(v, n)) || ']', ',' order by e.n)
    into v_before_keys
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced';
  if v_before_keys is null then
    raise exception 'EC3 recut refused: no Expert course structure for uncertainty';
  end if;

  -- Every module title except the one that moves.
  select string_agg(e.n || ':' || (e.m->>'title'), ',' order by e.n)
    into v_before_titles
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced'
     and e.m->>'key' <> 'm04-edges-that-used-to-break';

  -- The live structure stores lesson KEYS only. If a lesson title ever lands
  -- in this table, the front-end retitle of m05 l01 ("The IRR that reports
  -- its clamp" -> "The IRR that says why it is missing") would need a row
  -- here too, so refuse rather than leave a stale title behind.
  select count(*) into v_lesson_titles
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') as m,
         lateral jsonb_array_elements(m->'lesson_keys') as l
   where s.app_slug = 'uncertainty' and s.tier = 'advanced'
     and jsonb_typeof(l) <> 'string';
  if v_lesson_titles <> 0 then
    raise exception 'EC3 recut refused: the Expert structure now carries % lesson object(s), so the m05 l01 retitle needs a row in this migration', v_lesson_titles;
  end if;

  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced' and e.m->>'key' = 'm04-edges-that-used-to-break';
  if v_title is null then
    raise exception 'EC3 recut refused: no Expert module m04-edges-that-used-to-break';
  end if;
  if v_title not in ('Repaired Edges and One Still Open', 'Edges That Used to Break') then
    raise exception 'EC3 recut refused: Expert module m04 is titled %, neither the published title nor the recut one', v_title;
  end if;

  if v_title = 'Repaired Edges and One Still Open' then
    update public.academy_course_structures s
       set structure = jsonb_set(s.structure, '{modules}',
             (select jsonb_agg(case when e.m->>'key' = 'm04-edges-that-used-to-break'
                                    then jsonb_set(e.m, '{title}', to_jsonb('Edges That Used to Break'::text))
                                    else e.m end order by e.n)
                from jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)))
     where s.app_slug = 'uncertainty' and s.tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'EC3 recut refused: the Expert module title update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced' and e.m->>'key' = 'm04-edges-that-used-to-break';
  if v_title <> 'Edges That Used to Break' then
    raise exception 'EC3 recut refused: Expert module m04 is still titled % after the update', v_title;
  end if;

  select string_agg(e.n || ':' || (e.m->>'key') || '[' || (select string_agg(lk.v, '>' order by lk.n)
                                                             from jsonb_array_elements_text(e.m->'lesson_keys') with ordinality as lk(v, n)) || ']', ',' order by e.n)
    into v_after_keys
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced';
  if v_after_keys is distinct from v_before_keys then
    raise exception 'EC3 recut refused: a module key, a lesson key or their order changed';
  end if;

  select string_agg(e.n || ':' || (e.m->>'title'), ',' order by e.n)
    into v_after_titles
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
   where s.app_slug = 'uncertainty' and s.tier = 'advanced'
     and e.m->>'key' <> 'm04-edges-that-used-to-break';
  if v_after_titles is distinct from v_before_titles then
    raise exception 'EC3 recut refused: a module title other than m04 changed';
  end if;

  select count(*) into v_count
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as m
   where s.app_slug = 'uncertainty' and s.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'EC3 recut refused: the Expert structure holds % modules, expected 6', v_count;
  end if;

  select count(*) into v_count
    from public.academy_course_structures where app_slug = 'uncertainty' and active;
  if v_count <> 3 then
    raise exception 'EC3 recut refused: uncertainty has % active structures, expected 3', v_count;
  end if;

  raise notice 'EC3 recut structure: % of 1 Expert module title rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'ec3 recut capstone' as migration, c.tier, e.n as ord, e.f->>'key' as key,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol,
       case when e.f->>'key' in ('um_mc_low_case_p90_npv_musd', 'um_mc_high_case_p10_npv_musd',
                                 'um_mc_emv_musd', 'um_mc_10th_percentile_floor_rule_musd')
            then 'recut' else 'unchanged' end as state
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'uncertainty'
 order by c.tier, e.n;

select 'ec3 recut structure' as migration, s.tier, e.n as ord,
       e.m->>'key' as module_key, e.m->>'title' as title,
       jsonb_array_length(e.m->'lesson_keys') as lessons
  from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
 where s.app_slug = 'uncertainty' and s.tier = 'advanced'
 order by e.n;
