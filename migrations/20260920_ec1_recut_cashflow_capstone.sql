-- ============================================================================
-- EC1 CAPSTONE RECUT: Cash Flow & NPV (cashflow), the LIVE IKPOTO capstone.
--
-- WHY. Engines #193 (decision EC1-4, on engines main 709172f, ENGINE_VERSION
-- 3.10.0) repaired the joint venture regime: a JV below 100 percent working
-- interest now scales EVERY monetary line and the volumes to the share, the
-- way the PSC and PIA regimes already did. Before the repair the ledger kept
-- revenue, volumes, opex, capex and depreciation at FIELD level while
-- reporting royalty, tax and net cash flow at share, so government take
-- counted the partners' share as take and moved with the working interest.
-- IKPOTO is a JV at 80 percent, so four of its eighteen graded fields moved.
--
-- WHAT MOVES. Four expected values, and two sentences of the Associate prompt
-- that taught the retired split ledger.
--   jv_2033_gross_revenue_usd    83024596.47999997 -> 66419677.183999985
--   jv_total_boe                 6788275.2 -> 5430620.16
--   jv_government_take_pct       80.07659344822196 -> 75.09574181027746
--   jv_dpi                       0.14002119133320534 -> 0.17502648916650668
--
-- The other fourteen graded fields are unchanged to the last digit: both
-- NPVs, the IRR, both paybacks, the breakeven price, the 2032 tax, the 2034
-- net cash flow and every PIA field. No tolerance, label, unit, key or field
-- order moves. jv_dpi moves because the present value of capex is the share
-- now; take and dpi are working-interest invariant after the repair.
--
-- HOW THE VALUES WERE PRODUCED. The course's own field computation
-- (/root/ec-wip-cashflow/ec1_fields.mjs, run as
-- scratchpad/d3-ec1/capstone.mjs) was executed twice: once against the
-- engine vendored in this repo, which reproduced all eighteen LIVE values
-- character for character, and once against engines main 709172f. The four
-- differences are the rows below. Generator: scratchpad ec12/gen_ec12.py,
-- reading a dump of the live production rows.
--
-- GUARDS. Every value and the prompt must be EITHER the published one, in
-- which case it is rewritten, OR the recut one, in which case it is already
-- applied and left alone. Anything else raises. Keys, labels, units,
-- tolerances, field order, titles, datasets and the other fourteen values are
-- captured before and compared after, and the go-live's own published-golden,
-- handed-in-the-prompt and cross-tier prompt-leak gates are re-run on the
-- result.
--
-- SAFE TO RE-RUN. A second run finds everything already recut and writes
-- nothing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The four expected values.
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
  v_count         integer;
  v_updated       integer := 0;
  k               text;
  t               text;
  v_old           numeric;
  v_new           numeric;
begin
  -- Every graded field that is NOT one of the four, with its expected value
  -- and its tolerance. Must come out of this migration byte for byte the same.
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_before_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and f->>'key' not in ('jv_2033_gross_revenue_usd', 'jv_total_boe', 'jv_government_take_pct', 'jv_dpi');

  -- Key order, labels, units and tolerances of ALL eighteen fields.
  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_before_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'cashflow';

  -- Titles, datasets, cert tiers and active flags. Only the Associate PROMPT
  -- moves in this file, and it moves in block 2.
  select string_agg(c.tier || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_before_head
    from public.academy_capstones c where c.app_slug = 'cashflow';

  for k, t, v_old, v_new in
    select * from (values
      ('jv_2033_gross_revenue_usd', 'beginner', 83024596.47999997, 66419677.183999985),
      ('jv_total_boe', 'beginner', 6788275.2, 5430620.16),
      ('jv_government_take_pct', 'beginner', 80.07659344822196, 75.09574181027746),
      ('jv_dpi', 'intermediate', 0.14002119133320534, 0.17502648916650668)
    ) as x(k, t, v_old, v_new)
  loop
    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'cashflow' and c.tier = t and f->>'key' = k;

    if v_expected is null then
      raise exception 'EC1 recut refused: no % capstone field %', t, k;
    end if;
    if v_expected <> v_old and v_expected <> v_new then
      raise exception 'EC1 recut refused: % capstone field % expects %, neither the published value nor the recut one', t, k, v_expected;
    end if;

    if v_expected = v_old then
      update public.academy_capstones c
         set fields = (select jsonb_agg(case when e.f->>'key' = k
                                             then jsonb_set(e.f, '{expected}', to_jsonb(v_new))
                                             else e.f end order by e.n)
                         from jsonb_array_elements(c.fields) with ordinality as e(f, n))
       where c.app_slug = 'cashflow' and c.tier = t;
      get diagnostics v_count = row_count;
      if v_count <> 1 then
        raise exception 'EC1 recut refused: % capstone field % update touched % rows', t, k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    select (f->>'expected')::numeric into v_expected
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'cashflow' and c.tier = t and f->>'key' = k;
    if v_expected <> v_new then
      raise exception 'EC1 recut refused: % capstone field % still expects % after the update', t, k, v_expected;
    end if;
  end loop;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_after_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow' and f->>'key' not in ('jv_2033_gross_revenue_usd', 'jv_total_boe', 'jv_government_take_pct', 'jv_dpi');
  if v_after_others is distinct from v_before_others then
    raise exception 'EC1 recut refused: a capstone field other than the four moved';
  end if;

  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_after_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'cashflow';
  if v_after_shape is distinct from v_before_shape then
    raise exception 'EC1 recut refused: a capstone key, label, unit, tolerance or field order changed';
  end if;

  select string_agg(c.tier || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_after_head
    from public.academy_capstones c where c.app_slug = 'cashflow';
  if v_after_head is distinct from v_before_head then
    raise exception 'EC1 recut refused: a capstone title, dataset, cert tier or active flag changed';
  end if;

  -- Exactly 6 graded fields in every tier, 18 in the course, 3 capstones.
  for t in select unnest(array['beginner', 'intermediate', 'advanced']) loop
    select count(*) into v_count
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'cashflow' and c.tier = t;
    if v_count <> 6 then
      raise exception 'EC1 recut refused: the % capstone carries % graded fields, expected 6', t, v_count;
    end if;
  end loop;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow';
  if v_count <> 18 then
    raise exception 'EC1 recut refused: the cashflow capstones carry % graded fields, expected 18', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'cashflow';
  if v_count <> 3 then
    raise exception 'EC1 recut refused: cashflow has % capstones, expected 3', v_count;
  end if;

  raise notice 'EC1 recut capstone: % of 4 expected values rewritten', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 2. The Associate prompt: two sentences that taught the retired split ledger.
--    Guarded on md5 so the published text is not retyped here.
-- ----------------------------------------------------------------------------
do $$
declare
  v_md5     text;
  v_count   integer;
  v_updated integer := 0;
begin
  select md5(prompt) into v_md5 from public.academy_capstones
   where app_slug = 'cashflow' and tier = 'beginner';
  if v_md5 is null then
    raise exception 'EC1 recut refused: no Associate capstone for cashflow';
  end if;
  if v_md5 not in ('c336411be1b76babcfe822dbc67da883', '2a4a309b4556d24a9e1445fb5fd2163b') then
    raise exception 'EC1 recut refused: the Associate prompt hashes to %, neither the published text nor the recut one', v_md5;
  end if;

  if v_md5 = 'c336411be1b76babcfe822dbc67da883' then
    update public.academy_capstones
       set prompt = 'Six values from the IKPOTO joint venture ledger supplied with this capstone. First oil 2031, six years of production: 1,600,000 bbl of oil in 2031 declining twenty percent a year (1,280,000; 1,024,000; 819,200; 655,360; 524,288), with gas at 900 scf per barrel (1,440,000 Mscf in 2031, then 1,152,000; 921,600; 737,280; 589,824; 471,859.2). Capex 120,000,000 USD in 2031 and 30,000,000 USD in 2032; opex 19,000,000 USD a year in 2031 money escalating at 3.5 percent. Oil 76 USD/bbl and gas 3.0 USD/Mscf in 2031, both escalating at 1.5 percent; inflation 2.5 percent; base year 2031. Joint venture terms: working interest 80 percent, royalty 12.5 percent, tax 45 percent, depreciation on the engine''s default straight line. Report: (1) the GROSS REVENUE in 2033; (2) the TAX in 2032; (3) the NET CASH FLOW in 2034; (4) the PAYBACK in years; (5) the TOTAL barrels of oil equivalent; and (6) the GOVERNMENT TAKE in percent. Traps. The joint venture ledger reports EVERY line at the 80 percent SHARE, the way the production sharing and PIA regimes already did: gross revenue, volumes, opex, capex and depreciation as well as royalty, taxable income, tax and net cash flow. So fields 1, 2, 3 and 5 are all the share, and a reader who takes the gross field ledger is wrong on each of them by a factor of 1.25. Gas counts at 6 Mscf per barrel of oil equivalent. Depreciation is a deduction in the tax line and NOT a cash flow in field 3. Payback is read off the CUMULATIVE nominal cash flow and interpolated inside the year it turns positive. Take is the engine''s: the pre-take value at your share (revenue less capex less opex, undiscounted) minus the contractor''s net cash flow, over the pre-take value, so it no longer moves when the working interest does; report the engine''s number as the engine defines it.'
     where app_slug = 'cashflow' and tier = 'beginner';
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'EC1 recut refused: the Associate prompt update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select md5(prompt) into v_md5 from public.academy_capstones
   where app_slug = 'cashflow' and tier = 'beginner';
  if v_md5 <> '2a4a309b4556d24a9e1445fb5fd2163b' then
    raise exception 'EC1 recut refused: the Associate prompt hashes to % after the update', v_md5;
  end if;

  -- The other two prompts are untouched: the Professional prompt states no
  -- rule the repair retired, and the Expert PIA tier did not move.
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'cashflow' and tier = 'intermediate';
  if v_md5 <> 'd0a7c52f2cac2386ea42f3846b26f06e' then
    raise exception 'EC1 recut refused: the Professional prompt changed';
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'cashflow' and tier = 'advanced';
  if v_md5 <> 'b0f91aa94c9b66864a6dcec45641f044' then
    raise exception 'EC1 recut refused: the Expert prompt changed';
  end if;

  raise notice 'EC1 recut prompt: % of 1 Associate prompt rewritten', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 3. The go-live's own gates, re-run on the recut values.
-- ----------------------------------------------------------------------------
do $$
declare
  v_graded integer;
begin
  -- Published goldens: a graded field within tolerance of a value the goldens
  -- or the digest publish would be a lookup rather than a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (135185570.34, 1),      -- PIA worked example NPV
            (21590909.090909086, 1),-- hand-derived JV NPV
            (203250580.205128, 1),  -- multiyear_pia_real NPV
            (88104638.99559215, 1), -- multiyear_jv_real NPV
            (72534830.66, 1),       -- AKATA NPV
            (70188970.32, 1),       -- AKATA mid-year NPV
            (42943268.01, 1),       -- AKATA under the PIA
            (200, 0.001),           -- hand-derived JV IRR
            (43.92693503545888, 0.001),
            (47.90202040678996, 0.001),
            (29.2361, 0.001),       -- AKATA IRR
            (71.72619047591115, 0.01),
            (66.115702, 0.01)       -- AKATA breakeven
         ) as g(v, w)
   where c.app_slug = 'cashflow'
     and abs((f->>'expected')::numeric - g.v) < g.w;
  if v_graded <> 0 then
    raise exception 'EC1 recut refused: % graded field(s) now sit within tolerance of a published golden', v_graded;
  end if;

  -- Numbers the learner is handed in a prompt.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (1600000),(1280000),(1024000),(819200),(655360),(524288),(900),
            (1440000),(1152000),(921600),(737280),(589824),(471859.2),
            (120000000),(30000000),(19000000),(40000000),(97612500),(100000000),(2387500),
            (76),(3.0),(3.5),(1.5),(2.5),(2031),(80),(12.5),(45),(9),(30),(35),(8),(20),(3),(4),(2),
            (0.8),(1.25),(1.09),(1.025),(6),(100),(1)) as h(v)
   where c.app_slug = 'cashflow'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC1 recut refused: % graded field(s) land on a number handed in a prompt', v_graded;
  end if;

  -- No tier's prompt may state a graded value belonging to another tier.
  select count(*) into v_graded
    from public.academy_capstones c, public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'cashflow' and c2.app_slug = 'cashflow' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC1 recut refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  raise notice 'EC1 recut: the go-live gates pass on the recut values';
end $$;

-- ---------------------------------------------------------------- read-back --
select 'ec1 recut capstone' as migration, c.tier, e.n as ord, e.f->>'key' as key,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol,
       case when e.f->>'key' in ('jv_2033_gross_revenue_usd', 'jv_total_boe', 'jv_government_take_pct', 'jv_dpi') then 'recut' else 'unchanged' end as state
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'cashflow'
 order by c.tier, e.n;

select 'ec1 recut prompt' as migration, tier, md5(prompt) as prompt_md5, length(prompt) as len
  from public.academy_capstones where app_slug = 'cashflow' order by tier;
