-- ==========================================================================
-- EC1 AND EC2 RECUT, THE ASSERTIONS: Cash Flow & NPV (cashflow) and
-- Fiscal Regime Design (fiscal), the structural half of the recut.
--
-- THIS FILE WRITES NOTHING. Every statement in it is a check. It is applied
-- LAST, after the six tier files, so that what those files assume about the
-- shape of the two courses is asserted on the result rather than hoped for.
--
-- 1. THE THREE EC2 EXPERT LESSON RETITLES HAVE NO ROW, AND THAT IS NOT AN
--    OMISSION. Three Expert lesson titles still name behaviour the repair
--    retired:
--      m03-the-capex-sweep / l02-the-point-the-loop-never-reaches
--        "The point the loop never reaches"
--      m05-numbers-to-distrust / l03-the-irr-that-reports-its-bracket
--        "The IRR that reports its bracket"
--      m05-numbers-to-distrust / l04-the-uplift-charged-every-year
--        "The uplift charged every year"
--    academy_course_structures stores each module as a title plus a FLAT
--    LIST OF LESSON KEYS; there is no lesson title anywhere in the table, so
--    a retitle ships with the front-end upload and not with a migration.
--    Block 1 below ASSERTS that absence: if a lesson ever arrives as an
--    object rather than a bare key, it raises and names these three, so the
--    stale titles cannot be left behind silently.
--
--    THE DECISION TAKEN HERE: the titles STAY as they are. Each of the three
--    lessons now teaches the retired behaviour as history, which is what the
--    lesson is for, so the title reads as the name of the defect the lesson
--    is about. Changing them would be a front-end content edit with no
--    database component and no effect on grading.
--
-- 2. MODULE TITLES ARE ROWS, and none of them moves. All 36 (two courses,
--    three tiers, six modules) are asserted at their published text.
--
-- 3. THE CAPSTONES. Every one of the 36 graded fields must hold EITHER its
--    published value OR the value PR #133 gives it, and each tier must hold
--    exactly 6. Regenerating both courses' fields against the engines as
--    vendored on this branch reproduced production exactly except for the
--    five #133 already covers, so THIS RECUT MOVES NO CAPSTONE VALUE.
--
-- 4. THE PROMPTS. Every one of the 6 must hash to its published text or to
--    the text PR #133 writes. The recut falsifies no prompt beyond those two.
--
-- 5. LEARNER IMPACT. academy_capstone_attempts must hold no attempt on either
--    course. If one ever appears this file RAISES rather than letting the
--    ladder finish, because an attempt graded against a moved value is a
--    regrade decision for the owner, not something a migration takes
--    silently.
--
-- SAFE TO RE-RUN. It writes nothing, so it is idempotent by construction.
-- ==========================================================================

-- ----------------------------------------------------------------------------
-- 1. Lesson titles are not rows. Assert the absence.
-- ----------------------------------------------------------------------------
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') as m,
         lateral jsonb_array_elements(m->'lesson_keys') as l
   where s.app_slug in ('cashflow', 'fiscal') and jsonb_typeof(l) <> 'string';
  if v_count <> 0 then
    raise exception 'EC12 recut refused: the course structures now carry % lesson object(s), so the three EC2 Expert lesson retitles (the point the loop never reaches / the IRR that reports its bracket / the uplift charged every year) need rows in this migration', v_count;
  end if;

  -- And no module carries a lessons array of objects under another name.
  select count(*) into v_count
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') as m,
         lateral jsonb_object_keys(m) as k
   where s.app_slug in ('cashflow', 'fiscal') and k not in ('key', 'title', 'lesson_keys');
  if v_count <> 0 then
    raise exception 'EC12 recut refused: a module object carries % key(s) beyond key/title/lesson_keys, so a lesson title may now live in the table', v_count;
  end if;

  select count(*) into v_count from public.academy_course_structures
   where app_slug in ('cashflow', 'fiscal') and active;
  if v_count <> 6 then
    raise exception 'EC12 recut refused: the two courses have % active structures, expected 6', v_count;
  end if;

  raise notice 'EC12 recut: lesson titles are not rows, so the three EC2 Expert retitles ship with the front end';
end $$;

-- ----------------------------------------------------------------------------
-- 2. The 36 module titles, none of which moves.
-- ----------------------------------------------------------------------------
do $$
declare
  v_title text;
  v_count integer;
begin
  -- cashflow advanced
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm01-cost-recovery';
  if v_title is distinct from 'Cost Recovery' then
    raise exception 'EC12 recut refused: cashflow advanced module m01-cost-recovery is titled %, expected Cost Recovery', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm02-the-pia-royalties';
  if v_title is distinct from 'The PIA Royalties' then
    raise exception 'EC12 recut refused: cashflow advanced module m02-the-pia-royalties is titled %, expected The PIA Royalties', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm03-hydrocarbon-tax';
  if v_title is distinct from 'Hydrocarbon Tax' then
    raise exception 'EC12 recut refused: cashflow advanced module m03-hydrocarbon-tax is titled %, expected Hydrocarbon Tax', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm04-levies-and-losses';
  if v_title is distinct from 'Levies and Losses' then
    raise exception 'EC12 recut refused: cashflow advanced module m04-levies-and-losses is titled %, expected Levies and Losses', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm05-end-of-life';
  if v_title is distinct from 'End of Life' then
    raise exception 'EC12 recut refused: cashflow advanced module m05-end-of-life is titled %, expected End of Life', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'advanced' and e.m->>'key' = 'm06-the-expert-reading';
  if v_title is distinct from 'The Expert Reading' then
    raise exception 'EC12 recut refused: cashflow advanced module m06-the-expert-reading is titled %, expected The Expert Reading', coalesce(v_title, '(missing)');
  end if;

  -- cashflow beginner
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm01-what-a-cash-flow-is';
  if v_title is distinct from 'What a Cash Flow Is' then
    raise exception 'EC12 recut refused: cashflow beginner module m01-what-a-cash-flow-is is titled %, expected What a Cash Flow Is', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm02-from-rows-to-years';
  if v_title is distinct from 'From Rows to Years' then
    raise exception 'EC12 recut refused: cashflow beginner module m02-from-rows-to-years is titled %, expected From Rows to Years', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm03-prices';
  if v_title is distinct from 'Prices' then
    raise exception 'EC12 recut refused: cashflow beginner module m03-prices is titled %, expected Prices', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm04-the-joint-venture-cascade';
  if v_title is distinct from 'The Joint Venture Cascade' then
    raise exception 'EC12 recut refused: cashflow beginner module m04-the-joint-venture-cascade is titled %, expected The Joint Venture Cascade', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm05-adding-up';
  if v_title is distinct from 'Adding Up' then
    raise exception 'EC12 recut refused: cashflow beginner module m05-adding-up is titled %, expected Adding Up', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'beginner' and e.m->>'key' = 'm06-the-associate-reading';
  if v_title is distinct from 'The Associate Reading' then
    raise exception 'EC12 recut refused: cashflow beginner module m06-the-associate-reading is titled %, expected The Associate Reading', coalesce(v_title, '(missing)');
  end if;

  -- cashflow intermediate
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm01-why-time-matters';
  if v_title is distinct from 'Why Time Matters' then
    raise exception 'EC12 recut refused: cashflow intermediate module m01-why-time-matters is titled %, expected Why Time Matters', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm02-real-and-nominal';
  if v_title is distinct from 'Real and Nominal' then
    raise exception 'EC12 recut refused: cashflow intermediate module m02-real-and-nominal is titled %, expected Real and Nominal', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm03-net-present-value';
  if v_title is distinct from 'Net Present Value' then
    raise exception 'EC12 recut refused: cashflow intermediate module m03-net-present-value is titled %, expected Net Present Value', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm04-the-internal-rate-of-return';
  if v_title is distinct from 'The Internal Rate of Return' then
    raise exception 'EC12 recut refused: cashflow intermediate module m04-the-internal-rate-of-return is titled %, expected The Internal Rate of Return', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm05-sweeps';
  if v_title is distinct from 'Sweeps' then
    raise exception 'EC12 recut refused: cashflow intermediate module m05-sweeps is titled %, expected Sweeps', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'cashflow' and s.tier = 'intermediate' and e.m->>'key' = 'm06-the-professional-reading';
  if v_title is distinct from 'The Professional Reading' then
    raise exception 'EC12 recut refused: cashflow intermediate module m06-the-professional-reading is titled %, expected The Professional Reading', coalesce(v_title, '(missing)');
  end if;

  -- fiscal advanced
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm01-six-regimes-at-once';
  if v_title is distinct from 'Six Regimes at Once' then
    raise exception 'EC12 recut refused: fiscal advanced module m01-six-regimes-at-once is titled %, expected Six Regimes at Once', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm02-the-price-sweep';
  if v_title is distinct from 'The Price Sweep' then
    raise exception 'EC12 recut refused: fiscal advanced module m02-the-price-sweep is titled %, expected The Price Sweep', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm03-the-capex-sweep';
  if v_title is distinct from 'The Capex Sweep' then
    raise exception 'EC12 recut refused: fiscal advanced module m03-the-capex-sweep is titled %, expected The Capex Sweep', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm04-the-insights';
  if v_title is distinct from 'The Insights' then
    raise exception 'EC12 recut refused: fiscal advanced module m04-the-insights is titled %, expected The Insights', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm05-numbers-to-distrust';
  if v_title is distinct from 'Numbers to Distrust' then
    raise exception 'EC12 recut refused: fiscal advanced module m05-numbers-to-distrust is titled %, expected Numbers to Distrust', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'advanced' and e.m->>'key' = 'm06-the-expert-reading';
  if v_title is distinct from 'The Expert Reading' then
    raise exception 'EC12 recut refused: fiscal advanced module m06-the-expert-reading is titled %, expected The Expert Reading', coalesce(v_title, '(missing)');
  end if;

  -- fiscal beginner
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm01-what-a-fiscal-regime-is';
  if v_title is distinct from 'What a Fiscal Regime Is' then
    raise exception 'EC12 recut refused: fiscal beginner module m01-what-a-fiscal-regime-is is titled %, expected What a Fiscal Regime Is', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm02-the-project-before-the-regime';
  if v_title is distinct from 'The Project Before the Regime' then
    raise exception 'EC12 recut refused: fiscal beginner module m02-the-project-before-the-regime is titled %, expected The Project Before the Regime', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm03-revenue-and-royalty';
  if v_title is distinct from 'Revenue and Royalty' then
    raise exception 'EC12 recut refused: fiscal beginner module m03-revenue-and-royalty is titled %, expected Revenue and Royalty', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm04-the-concession-ledger';
  if v_title is distinct from 'The Concession Ledger' then
    raise exception 'EC12 recut refused: fiscal beginner module m04-the-concession-ledger is titled %, expected The Concession Ledger', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm05-reading-the-ledger';
  if v_title is distinct from 'Reading the Ledger' then
    raise exception 'EC12 recut refused: fiscal beginner module m05-reading-the-ledger is titled %, expected Reading the Ledger', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'beginner' and e.m->>'key' = 'm06-the-associate-reading';
  if v_title is distinct from 'The Associate Reading' then
    raise exception 'EC12 recut refused: fiscal beginner module m06-the-associate-reading is titled %, expected The Associate Reading', coalesce(v_title, '(missing)');
  end if;

  -- fiscal intermediate
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm01-the-sliding-scale';
  if v_title is distinct from 'The Sliding Scale' then
    raise exception 'EC12 recut refused: fiscal intermediate module m01-the-sliding-scale is titled %, expected The Sliding Scale', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm02-cost-recovery';
  if v_title is distinct from 'Cost Recovery' then
    raise exception 'EC12 recut refused: fiscal intermediate module m02-cost-recovery is titled %, expected Cost Recovery', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm03-the-r-factor';
  if v_title is distinct from 'The R Factor' then
    raise exception 'EC12 recut refused: fiscal intermediate module m03-the-r-factor is titled %, expected The R Factor', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm04-the-tax-stack';
  if v_title is distinct from 'The Tax Stack' then
    raise exception 'EC12 recut refused: fiscal intermediate module m04-the-tax-stack is titled %, expected The Tax Stack', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm05-rate-and-return';
  if v_title is distinct from 'Rate and Return' then
    raise exception 'EC12 recut refused: fiscal intermediate module m05-rate-and-return is titled %, expected Rate and Return', coalesce(v_title, '(missing)');
  end if;
  select e.m->>'title' into v_title
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as e(m)
   where s.app_slug = 'fiscal' and s.tier = 'intermediate' and e.m->>'key' = 'm06-the-professional-reading';
  if v_title is distinct from 'The Professional Reading' then
    raise exception 'EC12 recut refused: fiscal intermediate module m06-the-professional-reading is titled %, expected The Professional Reading', coalesce(v_title, '(missing)');
  end if;

  select count(*) into v_count
    from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') as m
   where s.app_slug in ('cashflow', 'fiscal');
  if v_count <> 36 then
    raise exception 'EC12 recut refused: the two courses hold % modules, expected 36', v_count;
  end if;

  raise notice 'EC12 recut: all 36 module titles are at their published text';
end $$;

-- ----------------------------------------------------------------------------
-- 3. The capstones: 6 graded fields per tier, every value published or #133.
-- ----------------------------------------------------------------------------
do $$
declare
  v_expected numeric;
  v_count    integer;
  v_keys     text;
  t          text;
begin
  -- cashflow advanced
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_2032_price_royalty_usd';
  if v_expected is distinct from 951123.1830656304 then
    raise exception 'EC12 recut refused: cashflow advanced pia_2032_price_royalty_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_2032_prod_alw_eligible_bbl';
  if v_expected is distinct from 787500 then
    raise exception 'EC12 recut refused: cashflow advanced pia_2032_prod_alw_eligible_bbl expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_2031_cpr_deferred_usd';
  if v_expected is distinct from 3942400 then
    raise exception 'EC12 recut refused: cashflow advanced pia_2031_cpr_deferred_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_total_hct_usd';
  if v_expected is distinct from 51541932.563462615 then
    raise exception 'EC12 recut refused: cashflow advanced pia_total_hct_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_2033_dev_levy_usd';
  if v_expected is distinct from 1331296.587088759 then
    raise exception 'EC12 recut refused: cashflow advanced pia_2033_dev_levy_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'advanced' and f->>'key' = 'pia_npv_real_usd';
  if v_expected is distinct from -46086957.32549152 then
    raise exception 'EC12 recut refused: cashflow advanced pia_npv_real_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;

  -- cashflow beginner
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_2033_gross_revenue_usd';
  if v_expected is null or v_expected not in (83024596.47999997, 66419677.183999985) then
    raise exception 'EC12 recut refused: cashflow beginner jv_2033_gross_revenue_usd expects %, neither its published value nor the one PR #133 gives it', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_2032_tax_usd';
  if v_expected is distinct from 19728417.6 then
    raise exception 'EC12 recut refused: cashflow beginner jv_2032_tax_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_2034_net_cash_flow_usd';
  if v_expected is distinct from 22086267.91657759 then
    raise exception 'EC12 recut refused: cashflow beginner jv_2034_net_cash_flow_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_payback_years';
  if v_expected is distinct from 3.4998246420308123 then
    raise exception 'EC12 recut refused: cashflow beginner jv_payback_years expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_total_boe';
  if v_expected is null or v_expected not in (6788275.2, 5430620.16) then
    raise exception 'EC12 recut refused: cashflow beginner jv_total_boe expects %, neither its published value nor the one PR #133 gives it', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'beginner' and f->>'key' = 'jv_government_take_pct';
  if v_expected is null or v_expected not in (80.07659344822196, 75.09574181027746) then
    raise exception 'EC12 recut refused: cashflow beginner jv_government_take_pct expects %, neither its published value nor the one PR #133 gives it', coalesce(v_expected::text, '(missing)');
  end if;

  -- cashflow intermediate
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_npv_real_usd';
  if v_expected is distinct from 20656337.21686185 then
    raise exception 'EC12 recut refused: cashflow intermediate jv_npv_real_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_npv_mid_year_usd';
  if v_expected is distinct from 20030970.834339857 then
    raise exception 'EC12 recut refused: cashflow intermediate jv_npv_mid_year_usd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_irr_pct';
  if v_expected is distinct from 23.719272956750835 then
    raise exception 'EC12 recut refused: cashflow intermediate jv_irr_pct expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_discounted_payback_years';
  if v_expected is distinct from 3.9696530221864026 then
    raise exception 'EC12 recut refused: cashflow intermediate jv_discounted_payback_years expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_dpi';
  if v_expected is null or v_expected not in (0.14002119133320534, 0.17502648916650668) then
    raise exception 'EC12 recut refused: cashflow intermediate jv_dpi expects %, neither its published value nor the one PR #133 gives it', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and c.tier = 'intermediate' and f->>'key' = 'jv_breakeven_oil_price_usd_bbl';
  if v_expected is distinct from 66.10100889205933 then
    raise exception 'EC12 recut refused: cashflow intermediate jv_breakeven_oil_price_usd_bbl expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;

  -- fiscal advanced
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_top_npv_musd';
  if v_expected is distinct from 20.956012449531823 then
    raise exception 'EC12 recut refused: fiscal advanced cmp_top_npv_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_psc_effective_tax_rate_pct';
  if v_expected is distinct from 42.14742246720144 then
    raise exception 'EC12 recut refused: fiscal advanced cmp_psc_effective_tax_rate_pct expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_psc_price_sweep_at_60_pct';
  if v_expected is distinct from 75.697560213795 then
    raise exception 'EC12 recut refused: fiscal advanced cmp_psc_price_sweep_at_60_pct expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  -- PR #133 RETIRES this key and puts cmp_psc_capex_loss_last_tenth_musd at
  -- the same array position, so exactly one of the two must be present.
  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced'
     and ((f->>'key' = 'cmp_psc_capex_loss_seven_point_musd' and (f->>'expected')::numeric = 140.9798310836312)
       or (f->>'key' = 'cmp_psc_capex_loss_last_tenth_musd'  and (f->>'expected')::numeric = 28.127858185420223));
  if v_count <> 1 then
    raise exception 'EC12 recut refused: the fiscal Expert capex-loss field is present % time(s) at a value that is neither its published one nor the one PR #133 gives it, expected 1', v_count;
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_psc_capex_loss_eight_point_musd';
  if v_expected is distinct from 169.10768926905132 then
    raise exception 'EC12 recut refused: fiscal advanced cmp_psc_capex_loss_eight_point_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and f->>'key' = 'cmp_con_price_climb_pct_points';
  if v_expected is distinct from -65.47814380281869 then
    raise exception 'EC12 recut refused: fiscal advanced cmp_con_price_climb_pct_points expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;

  -- fiscal beginner
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_y1_gross_revenue_musd';
  if v_expected is distinct from 114.89032 then
    raise exception 'EC12 recut refused: fiscal beginner con_y1_gross_revenue_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_y4_royalty_musd';
  if v_expected is distinct from 11.309459947889602 then
    raise exception 'EC12 recut refused: fiscal beginner con_y4_royalty_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_y4_opex_musd';
  if v_expected is distinct from 18.467779420043748 then
    raise exception 'EC12 recut refused: fiscal beginner con_y4_opex_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_y5_contractor_ncf_musd';
  if v_expected is distinct from 44.366803603492855 then
    raise exception 'EC12 recut refused: fiscal beginner con_y5_contractor_ncf_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_payback_year_cum_ncf_musd';
  if v_expected is distinct from 14.740261270763284 then
    raise exception 'EC12 recut refused: fiscal beginner con_payback_year_cum_ncf_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'beginner' and f->>'key' = 'con_total_government_take_musd';
  if v_expected is distinct from 229.13292242776342 then
    raise exception 'EC12 recut refused: fiscal beginner con_total_government_take_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;

  -- fiscal intermediate
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_y1_cost_recovered_musd';
  if v_expected is distinct from 70.19798552 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_y1_cost_recovered_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_y3_unrecovered_pool_musd';
  if v_expected is distinct from 190.0287098892603 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_y3_unrecovered_pool_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_y5_r_factor';
  if v_expected is distinct from 1.1122624290891505 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_y5_r_factor expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_y8_royalty_musd';
  if v_expected is distinct from 5.961300665865362 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_y8_royalty_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_total_tax_musd';
  if v_expected is distinct from 62.454042497773344 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_total_tax_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;
  select (f->>'expected')::numeric into v_expected
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and c.tier = 'intermediate' and f->>'key' = 'psc_npv_musd';
  if v_expected is distinct from -19.724017651298347 then
    raise exception 'EC12 recut refused: fiscal intermediate psc_npv_musd expects %, and this recut moves no capstone value', coalesce(v_expected::text, '(missing)');
  end if;

  -- Exactly 6 graded fields in each of the six tiers, 18 per course.
  for t in select unnest(array['beginner', 'intermediate', 'advanced']) loop
    select count(*) into v_count
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'cashflow' and c.tier = t;
    if v_count <> 6 then
      raise exception 'EC12 recut refused: the cashflow % capstone carries % graded fields, expected 6', t, v_count;
    end if;
    select count(*) into v_count
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'fiscal' and c.tier = t;
    if v_count <> 6 then
      raise exception 'EC12 recut refused: the fiscal % capstone carries % graded fields, expected 6', t, v_count;
    end if;
  end loop;

  select count(*) into v_count from public.academy_capstones
   where app_slug in ('cashflow', 'fiscal') and active;
  if v_count <> 6 then
    raise exception 'EC12 recut refused: the two courses have % active capstones, expected 6', v_count;
  end if;

  raise notice 'EC12 recut: 36 graded fields, 6 per tier, none moved by this recut';
end $$;

-- ----------------------------------------------------------------------------
-- 4. The six capstone prompts: published, or the text PR #133 writes.
-- ----------------------------------------------------------------------------
do $$
declare
  v_md5 text;
begin
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'cashflow' and tier = 'beginner';
  if v_md5 is null or v_md5 not in ('c336411be1b76babcfe822dbc67da883', '2a4a309b4556d24a9e1445fb5fd2163b') then
    raise exception 'EC12 recut refused: the cashflow beginner capstone prompt hashes to %, which is not its expected text (published or #133)', coalesce(v_md5, '(missing)');
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'cashflow' and tier = 'intermediate';
  if v_md5 is null or v_md5 not in ('d0a7c52f2cac2386ea42f3846b26f06e') then
    raise exception 'EC12 recut refused: the cashflow intermediate capstone prompt hashes to %, which is not its expected text (published; #133 does not touch it)', coalesce(v_md5, '(missing)');
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'cashflow' and tier = 'advanced';
  if v_md5 is null or v_md5 not in ('b0f91aa94c9b66864a6dcec45641f044') then
    raise exception 'EC12 recut refused: the cashflow advanced capstone prompt hashes to %, which is not its expected text (published; #133 does not touch it)', coalesce(v_md5, '(missing)');
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'fiscal' and tier = 'beginner';
  if v_md5 is null or v_md5 not in ('4f3ed4f51fbf1b10e8cfd5a779409978') then
    raise exception 'EC12 recut refused: the fiscal beginner capstone prompt hashes to %, which is not its expected text (published; #133 does not touch it)', coalesce(v_md5, '(missing)');
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'fiscal' and tier = 'intermediate';
  if v_md5 is null or v_md5 not in ('5be2b3a132aec8daf747058cda0298e3') then
    raise exception 'EC12 recut refused: the fiscal intermediate capstone prompt hashes to %, which is not its expected text (published; #133 does not touch it)', coalesce(v_md5, '(missing)');
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'fiscal' and tier = 'advanced';
  if v_md5 is null or v_md5 not in ('78e2c54a19db1503432fd43888d8d192', 'd3c59d3cf5a65713173c9514c348a8b4') then
    raise exception 'EC12 recut refused: the fiscal advanced capstone prompt hashes to %, which is not its expected text (published or #133)', coalesce(v_md5, '(missing)');
  end if;

  raise notice 'EC12 recut: all six capstone prompts are at their published or #133 text';
end $$;

-- ----------------------------------------------------------------------------
-- 5. The banks, and the learner impact.
-- ----------------------------------------------------------------------------
do $$
declare
  v_count integer;
  v_rows  text;
begin
  select count(*) into v_count from (
    select app_slug, tier, count(*) as n from public.academy_quiz_questions
     where app_slug in ('cashflow', 'fiscal') group by 1, 2
  ) b where b.n <> 132;
  if v_count <> 0 then
    raise exception 'EC12 recut refused: % tier(s) of the two courses do not hold 132 questions', v_count;
  end if;

  select count(*) into v_count from public.academy_quiz_questions
   where app_slug in ('cashflow', 'fiscal');
  if v_count <> 792 then
    raise exception 'EC12 recut refused: the two courses hold % questions, expected 792', v_count;
  end if;

  -- Both courses stay available throughout: nothing in this ladder flips a
  -- status, adds a catalog row or removes one.
  select count(*) into v_count from public.academy_apps
   where slug in ('cashflow', 'fiscal') and status = 'available';
  if v_count <> 2 then
    raise exception 'EC12 recut refused: % of the two courses are available, expected 2', v_count;
  end if;

  -- LEARNER IMPACT. No capstone attempt may exist on either course. This
  -- recut moves no graded value, but the ladder it is applied with (PR #133)
  -- does, so an attempt here is a regrade decision for the owner.
  select count(*) into v_count from public.academy_capstone_attempts
   where app_slug in ('cashflow', 'fiscal');
  if v_count <> 0 then
    select string_agg(distinct app_slug || '/' || tier, ', ') into v_rows
      from public.academy_capstone_attempts where app_slug in ('cashflow', 'fiscal');
    raise exception 'EC12 recut refused: % capstone attempt(s) exist on these courses (%), so a regrade is a decision to take before applying, not after', v_count, v_rows;
  end if;

  raise notice 'EC12 recut: 792 questions, both courses available, 0 capstone attempts';
end $$;

-- ---------------------------------------------------------------- read-back --
select 'ec12 recut questions' as migration, app_slug, tier, count(*) as questions
  from public.academy_quiz_questions where app_slug in ('cashflow', 'fiscal')
 group by 1, 2, 3 order by app_slug, tier;

select 'ec12 recut capstone' as migration, c.app_slug, c.tier, e.n as ord,
       e.f->>'key' as key, (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug in ('cashflow', 'fiscal')
 order by c.app_slug, c.tier, e.n;

select 'ec12 recut structure' as migration, s.app_slug, s.tier, e.n as ord,
       e.m->>'key' as module_key, e.m->>'title' as title,
       jsonb_array_length(e.m->'lesson_keys') as lessons,
       (select count(*) from jsonb_array_elements(e.m->'lesson_keys') as l where jsonb_typeof(l) <> 'string') as lesson_objects
  from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') with ordinality as e(m, n)
 where s.app_slug in ('cashflow', 'fiscal')
 order by s.app_slug, s.tier, e.n;

select 'ec12 recut prompts' as migration, app_slug, tier, md5(prompt) as prompt_md5, length(prompt) as len
  from public.academy_capstones where app_slug in ('cashflow', 'fiscal') order by app_slug, tier;
